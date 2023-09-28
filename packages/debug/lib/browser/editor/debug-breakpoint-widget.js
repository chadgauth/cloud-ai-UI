"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
var DebugBreakpointWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugBreakpointWidget = void 0;
const React = require("@theia/core/shared/react");
const client_1 = require("@theia/core/shared/react-dom/client");
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const uri_1 = require("@theia/core/lib/common/uri");
const monaco_editor_provider_1 = require("@theia/monaco/lib/browser/monaco-editor-provider");
const monaco_editor_zone_widget_1 = require("@theia/monaco/lib/browser/monaco-editor-zone-widget");
const debug_editor_1 = require("./debug-editor");
const debug_source_breakpoint_1 = require("../model/debug-source-breakpoint");
const monaco = require("@theia/monaco-editor-core");
const suggest_1 = require("@theia/monaco-editor-core/esm/vs/editor/contrib/suggest/browser/suggest");
const languageFeatures_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const select_component_1 = require("@theia/core/lib/browser/widgets/select-component");
let DebugBreakpointWidget = DebugBreakpointWidget_1 = class DebugBreakpointWidget {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
        this.context = 'condition';
        this._values = {};
        this.selectComponentRef = React.createRef();
        this.updateInput = (option) => {
            if (this._input) {
                this._values[this.context] = this._input.getControl().getValue();
            }
            this.context = option.value;
            this.render();
            if (this._input) {
                this._input.focus();
            }
        };
    }
    get values() {
        if (!this._input) {
            return undefined;
        }
        return {
            ...this._values,
            [this.context]: this._input.getControl().getValue()
        };
    }
    get input() {
        return this._input;
    }
    // eslint-disable-next-line no-null/no-null
    set inputSize(dimension) {
        if (this._input) {
            if (dimension) {
                this._input.setSize(dimension);
            }
            else {
                this._input.resizeToFit();
            }
        }
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.toDispose.push(this.zone = new monaco_editor_zone_widget_1.MonacoEditorZoneWidget(this.editor.getControl()));
        this.zone.containerNode.classList.add('theia-debug-breakpoint-widget');
        const selectNode = this.selectNode = document.createElement('div');
        selectNode.classList.add('theia-debug-breakpoint-select');
        this.zone.containerNode.appendChild(selectNode);
        this.selectNodeRoot = (0, client_1.createRoot)(this.selectNode);
        this.toDispose.push(core_1.Disposable.create(() => this.selectNodeRoot.unmount()));
        const inputNode = document.createElement('div');
        inputNode.classList.add('theia-debug-breakpoint-input');
        this.zone.containerNode.appendChild(inputNode);
        const input = this._input = await this.createInput(inputNode);
        if (this.toDispose.disposed) {
            input.dispose();
            return;
        }
        this.toDispose.push(input);
        this.toDispose.push(monaco.languages.registerCompletionItemProvider({ scheme: input.uri.scheme }, {
            provideCompletionItems: async (model, position, context, token) => {
                const suggestions = [];
                if ((this.context === 'condition' || this.context === 'logMessage')
                    && input.uri.toString() === model.uri.toString()) {
                    const editor = this.editor.getControl();
                    const completions = await (0, suggest_1.provideSuggestionItems)(standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).completionProvider, editor.getModel(), new monaco.Position(editor.getPosition().lineNumber, 1), new suggest_1.CompletionOptions(undefined, new Set().add(27 /* Snippet */)), context, token);
                    let overwriteBefore = 0;
                    if (this.context === 'condition') {
                        overwriteBefore = position.column - 1;
                    }
                    else {
                        // Inside the curly brackets, need to count how many useful characters are behind the position so they would all be taken into account
                        const value = editor.getModel().getValue();
                        while ((position.column - 2 - overwriteBefore >= 0)
                            && value[position.column - 2 - overwriteBefore] !== '{' && value[position.column - 2 - overwriteBefore] !== ' ') {
                            overwriteBefore++;
                        }
                    }
                    for (const { completion } of completions.items) {
                        completion.range = monaco.Range.fromPositions(position.delta(0, -overwriteBefore), position);
                        suggestions.push(completion);
                    }
                }
                return { suggestions };
            }
        }));
        this.toDispose.push(this.zone.onDidLayoutChange(dimension => this.layout(dimension)));
        this.toDispose.push(input.getControl().onDidChangeModelContent(() => {
            const heightInLines = input.getControl().getModel().getLineCount() + 1;
            this.zone.layout(heightInLines);
            this.updatePlaceholder();
        }));
        this._input.getControl().createContextKey('breakpointWidgetFocus', true);
    }
    dispose() {
        this.toDispose.dispose();
    }
    get position() {
        const options = this.zone.options;
        return options && new monaco.Position(options.afterLineNumber, options.afterColumn || -1);
    }
    show(options) {
        if (!this._input) {
            return;
        }
        const breakpoint = options instanceof debug_source_breakpoint_1.DebugSourceBreakpoint ? options : 'breakpoint' in options ? options.breakpoint : undefined;
        this._values = breakpoint ? {
            condition: breakpoint.condition,
            hitCondition: breakpoint.hitCondition,
            logMessage: breakpoint.logMessage
        } : {};
        if (options instanceof debug_source_breakpoint_1.DebugSourceBreakpoint) {
            if (options.logMessage) {
                this.context = 'logMessage';
            }
            else if (options.hitCondition && !options.condition) {
                this.context = 'hitCondition';
            }
            else {
                this.context = 'condition';
            }
        }
        else {
            this.context = options.context;
        }
        this.render();
        const position = 'position' in options ? options.position : undefined;
        const afterLineNumber = breakpoint ? breakpoint.line : position.lineNumber;
        const afterColumn = breakpoint ? breakpoint.column : position.column;
        const editor = this._input.getControl();
        const heightInLines = editor.getModel().getLineCount() + 1;
        this.zone.show({ afterLineNumber, afterColumn, heightInLines, frameWidth: 1 });
        editor.setPosition(editor.getModel().getPositionAt(editor.getModel().getValueLength()));
        this._input.focus();
        this.editor.getControl().createContextKey('isBreakpointWidgetVisible', true);
    }
    hide() {
        this.zone.hide();
        this.editor.getControl().createContextKey('isBreakpointWidgetVisible', false);
        this.editor.focus();
    }
    layout(dimension) {
        if (this._input) {
            this._input.getControl().layout(dimension);
        }
    }
    createInput(node) {
        return this.editorProvider.createInline(new uri_1.default().withScheme('breakpointinput').withPath(this.editor.getControl().getId()), node, {
            autoSizing: false
        });
    }
    render() {
        if (this._input) {
            this._input.getControl().setValue(this._values[this.context] || '');
        }
        const selectComponent = this.selectComponentRef.current;
        if (selectComponent && selectComponent.value !== this.context) {
            selectComponent.value = this.context;
        }
        this.selectNodeRoot.render(React.createElement(select_component_1.SelectComponent, { defaultValue: this.context, onChange: this.updateInput, options: [
                { value: 'condition', label: core_1.nls.localizeByDefault('Expression') },
                { value: 'hitCondition', label: core_1.nls.localizeByDefault('Hit Count') },
                { value: 'logMessage', label: core_1.nls.localizeByDefault('Log Message') },
            ], ref: this.selectComponentRef }));
    }
    updatePlaceholder() {
        if (!this._input) {
            return;
        }
        const value = this._input.getControl().getValue();
        const decorations = !!value ? [] : [{
                range: {
                    startLineNumber: 0,
                    endLineNumber: 0,
                    startColumn: 0,
                    endColumn: 1
                },
                renderOptions: {
                    after: {
                        contentText: this.placeholder,
                        opacity: '0.4'
                    }
                }
            }];
        this._input.getControl()
            .setDecorationsByType('Debug breakpoint placeholder', DebugBreakpointWidget_1.PLACEHOLDER_DECORATION, decorations);
    }
    get placeholder() {
        if (this.context === 'logMessage') {
            return core_1.nls.localizeByDefault("Message to log when breakpoint is hit. Expressions within {} are interpolated. 'Enter' to accept, 'esc' to cancel.");
        }
        if (this.context === 'hitCondition') {
            return core_1.nls.localizeByDefault("Break when hit count condition is met. 'Enter' to accept, 'esc' to cancel.");
        }
        return core_1.nls.localizeByDefault("Break when expression evaluates to true. 'Enter' to accept, 'esc' to cancel.");
    }
};
DebugBreakpointWidget.PLACEHOLDER_DECORATION = 'placeholderDecoration';
__decorate([
    (0, inversify_1.inject)(debug_editor_1.DebugEditor),
    __metadata("design:type", Object)
], DebugBreakpointWidget.prototype, "editor", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_provider_1.MonacoEditorProvider),
    __metadata("design:type", monaco_editor_provider_1.MonacoEditorProvider)
], DebugBreakpointWidget.prototype, "editorProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugBreakpointWidget.prototype, "init", null);
DebugBreakpointWidget = DebugBreakpointWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugBreakpointWidget);
exports.DebugBreakpointWidget = DebugBreakpointWidget;
//# sourceMappingURL=debug-breakpoint-widget.js.map