"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugInlineValueDecorator = exports.INLINE_VALUE_DECORATION_KEY = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const monaco = require("@theia/monaco-editor-core");
const cancellation_1 = require("@theia/monaco-editor-core/esm/vs/base/common/cancellation");
const wordHelper_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/core/wordHelper");
const languageFeatures_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const monaco_editor_service_1 = require("@theia/monaco/lib/browser/monaco-editor-service");
const debug_console_items_1 = require("../console/debug-console-items");
const debug_preferences_1 = require("../debug-preferences");
// https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L40-L43
exports.INLINE_VALUE_DECORATION_KEY = 'inlinevaluedecoration';
const MAX_NUM_INLINE_VALUES = 100; // JS Global scope can have 700+ entries. We want to limit ourselves for perf reasons
const MAX_INLINE_DECORATOR_LENGTH = 150; // Max string length of each inline decorator when debugging. If exceeded ... is added
const MAX_TOKENIZATION_LINE_LEN = 500; // If line is too long, then inline values for the line are skipped
/**
 * MAX SMI (SMall Integer) as defined in v8.
 * one bit is lost for boxing/unboxing flag.
 * one bit is lost for sign flag.
 * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
 */
// https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/uint.ts#L7-L13
const MAX_SAFE_SMALL_INTEGER = 1 << 30;
class InlineSegment {
    constructor(column, text) {
        this.column = column;
        this.text = text;
    }
}
let DebugInlineValueDecorator = class DebugInlineValueDecorator {
    constructor() {
        this.enabled = false;
        this.wordToLineNumbersMap = new Map();
    }
    onStart() {
        this.editorService.registerDecorationType('Inline debug decorations', exports.INLINE_VALUE_DECORATION_KEY, {});
        this.enabled = !!this.preferences['debug.inlineValues'];
        this.preferences.onPreferenceChanged(({ preferenceName, newValue }) => {
            if (preferenceName === 'debug.inlineValues' && !!newValue !== this.enabled) {
                this.enabled = !!newValue;
            }
        });
    }
    async calculateDecorations(debugEditorModel, stackFrame) {
        this.wordToLineNumbersMap = undefined;
        const model = debugEditorModel.editor.getControl().getModel() || undefined;
        return this.updateInlineValueDecorations(debugEditorModel, model, stackFrame);
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L382-L408
    async updateInlineValueDecorations(debugEditorModel, model, stackFrame) {
        if (!this.enabled || !model || !stackFrame || !stackFrame.source || model.uri.toString() !== stackFrame.source.uri.toString()) {
            return [];
        }
        // XXX: Here is a difference between the VS Code's `IStackFrame` and the `DebugProtocol.StackFrame`.
        // In DAP, `source` is optional, hence `range` is optional too.
        const { range: stackFrameRange } = stackFrame;
        if (!stackFrameRange) {
            return [];
        }
        const scopes = await stackFrame.getMostSpecificScopes(stackFrameRange);
        // Get all top level children in the scope chain
        const decorationsPerScope = await Promise.all(scopes.map(async (scope) => {
            const children = Array.from(await scope.getElements());
            let range = new monaco.Range(0, 0, stackFrameRange.startLineNumber, stackFrameRange.startColumn);
            if (scope.range) {
                range = range.setStartPosition(scope.range.startLineNumber, scope.range.startColumn);
            }
            return this.createInlineValueDecorationsInsideRange(children, range, model, debugEditorModel, stackFrame);
        }));
        return decorationsPerScope.reduce((previous, current) => previous.concat(current), []);
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L410-L452
    async createInlineValueDecorationsInsideRange(expressions, range, model, debugEditorModel, stackFrame) {
        const decorations = [];
        const inlineValuesProvider = standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).inlineValuesProvider;
        const textEditorModel = debugEditorModel.editor.document.textEditorModel;
        if (inlineValuesProvider && inlineValuesProvider.has(textEditorModel)) {
            const findVariable = async (variableName, caseSensitiveLookup) => {
                const scopes = await stackFrame.getMostSpecificScopes(stackFrame.range);
                const key = caseSensitiveLookup ? variableName : variableName.toLowerCase();
                for (const scope of scopes) {
                    const expressionContainers = await scope.getElements();
                    let container = expressionContainers.next();
                    while (!container.done) {
                        const debugVariable = container.value;
                        if (debugVariable && debugVariable instanceof debug_console_items_1.DebugVariable) {
                            if (caseSensitiveLookup) {
                                if (debugVariable.name === key) {
                                    return debugVariable;
                                }
                            }
                            else {
                                if (debugVariable.name.toLowerCase() === key) {
                                    return debugVariable;
                                }
                            }
                        }
                        container = expressionContainers.next();
                    }
                }
                return undefined;
            };
            const context = {
                frameId: stackFrame.raw.id,
                stoppedLocation: range
            };
            const cancellationToken = new cancellation_1.CancellationTokenSource().token;
            const registeredProviders = inlineValuesProvider.ordered(textEditorModel).reverse();
            const visibleRanges = debugEditorModel.editor.getControl().getVisibleRanges();
            const lineDecorations = new Map();
            for (const provider of registeredProviders) {
                for (const visibleRange of visibleRanges) {
                    const result = await provider.provideInlineValues(textEditorModel, visibleRange, context, cancellationToken);
                    if (result) {
                        for (const inlineValue of result) {
                            let text = undefined;
                            switch (inlineValue.type) {
                                case 'text':
                                    text = inlineValue.text;
                                    break;
                                case 'variable': {
                                    let varName = inlineValue.variableName;
                                    if (!varName) {
                                        const lineContent = model.getLineContent(inlineValue.range.startLineNumber);
                                        varName = lineContent.substring(inlineValue.range.startColumn - 1, inlineValue.range.endColumn - 1);
                                    }
                                    const variable = await findVariable(varName, inlineValue.caseSensitiveLookup);
                                    if (variable) {
                                        text = this.formatInlineValue(varName, variable.value);
                                    }
                                    break;
                                }
                                case 'expression': {
                                    let expr = inlineValue.expression;
                                    if (!expr) {
                                        const lineContent = model.getLineContent(inlineValue.range.startLineNumber);
                                        expr = lineContent.substring(inlineValue.range.startColumn - 1, inlineValue.range.endColumn - 1);
                                    }
                                    if (expr) {
                                        const expression = new debug_console_items_1.ExpressionItem(expr, () => stackFrame.thread.session);
                                        await expression.evaluate('watch');
                                        if (expression.available) {
                                            text = this.formatInlineValue(expr, expression.value);
                                        }
                                    }
                                    break;
                                }
                            }
                            if (text) {
                                const line = inlineValue.range.startLineNumber;
                                let lineSegments = lineDecorations.get(line);
                                if (!lineSegments) {
                                    lineSegments = [];
                                    lineDecorations.set(line, lineSegments);
                                }
                                if (!lineSegments.some(segment => segment.text === text)) {
                                    lineSegments.push(new InlineSegment(inlineValue.range.startColumn, text));
                                }
                            }
                        }
                    }
                }
            }
            ;
            // sort line segments and concatenate them into a decoration
            const separator = ', ';
            lineDecorations.forEach((segments, line) => {
                if (segments.length > 0) {
                    segments = segments.sort((a, b) => a.column - b.column);
                    const text = segments.map(s => s.text).join(separator);
                    decorations.push(this.createInlineValueDecoration(line, text));
                }
            });
        }
        else { // use fallback if no provider was registered
            const lineToNamesMap = new Map();
            const nameValueMap = new Map();
            for (const expr of expressions) {
                if (expr instanceof debug_console_items_1.DebugVariable) { // XXX: VS Code uses `IExpression` that has `name` and `value`.
                    nameValueMap.set(expr.name, expr.value);
                }
                // Limit the size of map. Too large can have a perf impact
                if (nameValueMap.size >= MAX_NUM_INLINE_VALUES) {
                    break;
                }
            }
            const wordToPositionsMap = this.getWordToPositionsMap(model);
            // Compute unique set of names on each line
            nameValueMap.forEach((_, name) => {
                const positions = wordToPositionsMap.get(name);
                if (positions) {
                    for (const position of positions) {
                        if (range.containsPosition(position)) {
                            if (!lineToNamesMap.has(position.lineNumber)) {
                                lineToNamesMap.set(position.lineNumber, []);
                            }
                            if (lineToNamesMap.get(position.lineNumber).indexOf(name) === -1) {
                                lineToNamesMap.get(position.lineNumber).push(name);
                            }
                        }
                    }
                }
            });
            // Compute decorators for each line
            lineToNamesMap.forEach((names, line) => {
                const contentText = names.sort((first, second) => {
                    const content = model.getLineContent(line);
                    return content.indexOf(first) - content.indexOf(second);
                }).map(name => `${name} = ${nameValueMap.get(name)}`).join(', ');
                decorations.push(this.createInlineValueDecoration(line, contentText));
            });
        }
        return decorations;
    }
    formatInlineValue(...args) {
        const valuePattern = '{0} = {1}';
        const formatRegExp = /{(\d+)}/g;
        if (args.length === 0) {
            return valuePattern;
        }
        return valuePattern.replace(formatRegExp, (match, group) => {
            const idx = parseInt(group, 10);
            return isNaN(idx) || idx < 0 || idx >= args.length ?
                match :
                args[idx];
        });
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L454-L485
    createInlineValueDecoration(lineNumber, contentText) {
        // If decoratorText is too long, trim and add ellipses. This could happen for minified files with everything on a single line
        if (contentText.length > MAX_INLINE_DECORATOR_LENGTH) {
            contentText = contentText.substring(0, MAX_INLINE_DECORATOR_LENGTH) + '...';
        }
        return {
            range: {
                startLineNumber: lineNumber,
                endLineNumber: lineNumber,
                startColumn: MAX_SAFE_SMALL_INTEGER,
                endColumn: MAX_SAFE_SMALL_INTEGER
            },
            renderOptions: {
                after: {
                    contentText,
                    backgroundColor: 'rgba(255, 200, 0, 0.2)',
                    margin: '10px'
                },
                dark: {
                    after: {
                        color: 'rgba(255, 255, 255, 0.5)',
                    }
                },
                light: {
                    after: {
                        color: 'rgba(0, 0, 0, 0.5)',
                    }
                }
            }
        };
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L487-L531
    getWordToPositionsMap(model) {
        model = model;
        if (!this.wordToLineNumbersMap) {
            this.wordToLineNumbersMap = new Map();
            if (!model) {
                return this.wordToLineNumbersMap;
            }
            // For every word in every line, map its ranges for fast lookup
            for (let lineNumber = 1, len = model.getLineCount(); lineNumber <= len; ++lineNumber) {
                const lineContent = model.getLineContent(lineNumber);
                // If line is too long then skip the line
                if (lineContent.length > MAX_TOKENIZATION_LINE_LEN) {
                    continue;
                }
                model.tokenization.forceTokenization(lineNumber);
                const lineTokens = model.tokenization.getLineTokens(lineNumber);
                for (let tokenIndex = 0, tokenCount = lineTokens.getCount(); tokenIndex < tokenCount; tokenIndex++) {
                    const tokenStartOffset = lineTokens.getStartOffset(tokenIndex);
                    const tokenEndOffset = lineTokens.getEndOffset(tokenIndex);
                    const tokenType = lineTokens.getStandardTokenType(tokenIndex);
                    const tokenStr = lineContent.substring(tokenStartOffset, tokenEndOffset);
                    // Token is a word and not a comment
                    if (tokenType === 0 /* Other */) {
                        wordHelper_1.DEFAULT_WORD_REGEXP.lastIndex = 0; // We assume tokens will usually map 1:1 to words if they match
                        const wordMatch = wordHelper_1.DEFAULT_WORD_REGEXP.exec(tokenStr);
                        if (wordMatch) {
                            const word = wordMatch[0];
                            if (!this.wordToLineNumbersMap.has(word)) {
                                this.wordToLineNumbersMap.set(word, []);
                            }
                            this.wordToLineNumbersMap.get(word).push(new monaco.Position(lineNumber, tokenStartOffset));
                        }
                    }
                }
            }
        }
        return this.wordToLineNumbersMap;
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService),
    __metadata("design:type", monaco_editor_service_1.MonacoEditorService)
], DebugInlineValueDecorator.prototype, "editorService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_preferences_1.DebugPreferences),
    __metadata("design:type", Object)
], DebugInlineValueDecorator.prototype, "preferences", void 0);
DebugInlineValueDecorator = __decorate([
    (0, inversify_1.injectable)()
], DebugInlineValueDecorator);
exports.DebugInlineValueDecorator = DebugInlineValueDecorator;
//# sourceMappingURL=debug-inline-value-decorator.js.map