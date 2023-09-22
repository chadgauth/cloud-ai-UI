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
var DebugHoverWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugHoverWidget = exports.createDebugHoverWidgetContainer = void 0;
const debounce = require("@theia/core/shared/lodash.debounce");
const widgets_1 = require("@theia/core/shared/@phosphor/widgets");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const source_tree_1 = require("@theia/core/lib/browser/source-tree");
const disposable_1 = require("@theia/core/lib/common/disposable");
const debug_session_manager_1 = require("../debug-session-manager");
const debug_editor_1 = require("./debug-editor");
const debug_expression_provider_1 = require("./debug-expression-provider");
const debug_hover_source_1 = require("./debug-hover-source");
const debug_console_items_1 = require("../console/debug-console-items");
const monaco = require("@theia/monaco-editor-core");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const languageFeatures_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures");
const cancellation_1 = require("@theia/monaco-editor-core/esm/vs/base/common/cancellation");
const position_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/core/position");
const core_1 = require("@theia/core");
function createDebugHoverWidgetContainer(parent, editor) {
    const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
        virtualized: false
    });
    child.bind(debug_editor_1.DebugEditor).toConstantValue(editor);
    child.bind(debug_hover_source_1.DebugHoverSource).toSelf();
    child.unbind(source_tree_1.SourceTreeWidget);
    child.bind(debug_expression_provider_1.DebugExpressionProvider).toSelf();
    child.bind(DebugHoverWidget).toSelf();
    return child;
}
exports.createDebugHoverWidgetContainer = createDebugHoverWidgetContainer;
let DebugHoverWidget = DebugHoverWidget_1 = class DebugHoverWidget extends source_tree_1.SourceTreeWidget {
    constructor() {
        super(...arguments);
        this.allowEditorOverflow = true;
        this.domNode = document.createElement('div');
        this.titleNode = document.createElement('div');
        this.contentNode = document.createElement('div');
        this.doSchedule = debounce((fn) => fn(), 300);
    }
    getId() {
        return DebugHoverWidget_1.ID;
    }
    getDomNode() {
        return this.domNode;
    }
    init() {
        super.init();
        this.domNode.className = 'theia-debug-hover';
        this.titleNode.className = 'theia-debug-hover-title';
        this.domNode.appendChild(this.titleNode);
        this.contentNode.className = 'theia-debug-hover-content';
        this.domNode.appendChild(this.contentNode);
        // for stopping scroll events from contentNode going to the editor
        this.contentNode.addEventListener('wheel', e => e.stopPropagation());
        this.editor.getControl().addContentWidget(this);
        this.source = this.hoverSource;
        this.toDispose.pushAll([
            this.hoverSource,
            disposable_1.Disposable.create(() => this.editor.getControl().removeContentWidget(this)),
            disposable_1.Disposable.create(() => this.hide()),
            this.sessions.onDidChange(() => {
                if (!this.isEditorFrame()) {
                    this.hide();
                }
            })
        ]);
    }
    dispose() {
        this.toDispose.dispose();
    }
    show(options) {
        this.schedule(() => this.doShow(options), options && options.immediate);
    }
    hide(options) {
        this.schedule(() => this.doHide(), options && options.immediate);
    }
    schedule(fn, immediate = true) {
        if (immediate) {
            this.doSchedule.cancel();
            fn();
        }
        else {
            this.doSchedule(fn);
        }
    }
    doHide() {
        if (!this.isVisible) {
            return;
        }
        if (this.domNode.contains(document.activeElement)) {
            this.editor.getControl().focus();
        }
        if (this.isAttached) {
            widgets_1.Widget.detach(this);
        }
        this.hoverSource.reset();
        super.hide();
        this.options = undefined;
        this.editor.getControl().layoutContentWidget(this);
    }
    async doShow(options = this.options) {
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        if (!this.isEditorFrame()) {
            this.hide();
            return;
        }
        if (!options) {
            this.hide();
            return;
        }
        if (this.options && this.options.selection.equalsRange(options.selection)) {
            return;
        }
        if (!this.isAttached) {
            widgets_1.Widget.attach(this, this.contentNode);
        }
        this.options = options;
        let matchingExpression;
        const pluginExpressionProvider = standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).evaluatableExpressionProvider;
        const textEditorModel = this.editor.document.textEditorModel;
        if (pluginExpressionProvider && pluginExpressionProvider.has(textEditorModel)) {
            const registeredProviders = pluginExpressionProvider.ordered(textEditorModel);
            const position = new position_1.Position(this.options.selection.startLineNumber, this.options.selection.startColumn);
            const promises = registeredProviders.map(support => Promise.resolve(support.provideEvaluatableExpression(textEditorModel, position, cancellationSource.token)));
            const results = await Promise.all(promises).then(core_1.ArrayUtils.coalesce);
            if (results.length > 0) {
                matchingExpression = results[0].expression;
                const range = results[0].range;
                if (!matchingExpression) {
                    const lineContent = textEditorModel.getLineContent(position.lineNumber);
                    matchingExpression = lineContent.substring(range.startColumn - 1, range.endColumn - 1);
                }
            }
        }
        else { // use fallback if no provider was registered
            matchingExpression = this.expressionProvider.get(this.editor.getControl().getModel(), options.selection);
        }
        if (!matchingExpression) {
            this.hide();
            return;
        }
        const toFocus = new disposable_1.DisposableCollection();
        if (this.options.focus === true) {
            toFocus.push(this.model.onNodeRefreshed(() => {
                toFocus.dispose();
                this.activate();
            }));
        }
        const expression = await this.hoverSource.evaluate(matchingExpression);
        if (!expression) {
            toFocus.dispose();
            this.hide();
            return;
        }
        this.contentNode.hidden = false;
        ['number', 'boolean', 'string'].forEach(token => this.titleNode.classList.remove(token));
        this.domNode.classList.remove('complex-value');
        if (expression.hasElements) {
            this.domNode.classList.add('complex-value');
        }
        else {
            this.contentNode.hidden = true;
            if (expression.type === 'number' || expression.type === 'boolean' || expression.type === 'string') {
                this.titleNode.classList.add(expression.type);
            }
            else if (!isNaN(+expression.value)) {
                this.titleNode.classList.add('number');
            }
            else if (debug_console_items_1.DebugVariable.booleanRegex.test(expression.value)) {
                this.titleNode.classList.add('boolean');
            }
            else if (debug_console_items_1.DebugVariable.stringRegex.test(expression.value)) {
                this.titleNode.classList.add('string');
            }
        }
        super.show();
        await new Promise(resolve => {
            setTimeout(() => window.requestAnimationFrame(() => {
                this.editor.getControl().layoutContentWidget(this);
                resolve();
            }), 0);
        });
    }
    isEditorFrame() {
        return this.sessions.isCurrentEditorFrame(this.editor.getControl().getModel().uri);
    }
    getPosition() {
        if (!this.isVisible) {
            return undefined;
        }
        const position = this.options && this.options.selection.getStartPosition();
        return position
            ? {
                position: new monaco.Position(position.lineNumber, position.column),
                preference: [
                    monaco.editor.ContentWidgetPositionPreference.ABOVE,
                    monaco.editor.ContentWidgetPositionPreference.BELOW,
                ],
            }
            : undefined;
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        const { expression } = this.hoverSource;
        const value = expression && expression.value || '';
        this.titleNode.textContent = value;
        this.titleNode.title = value;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.addKeyListener(this.domNode, browser_1.Key.ESCAPE, () => this.hide());
    }
};
DebugHoverWidget.ID = 'debug.editor.hover';
__decorate([
    (0, inversify_1.inject)(debug_editor_1.DebugEditor),
    __metadata("design:type", Object)
], DebugHoverWidget.prototype, "editor", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugHoverWidget.prototype, "sessions", void 0);
__decorate([
    (0, inversify_1.inject)(debug_hover_source_1.DebugHoverSource),
    __metadata("design:type", debug_hover_source_1.DebugHoverSource)
], DebugHoverWidget.prototype, "hoverSource", void 0);
__decorate([
    (0, inversify_1.inject)(debug_expression_provider_1.DebugExpressionProvider),
    __metadata("design:type", debug_expression_provider_1.DebugExpressionProvider)
], DebugHoverWidget.prototype, "expressionProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugHoverWidget.prototype, "init", null);
DebugHoverWidget = DebugHoverWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugHoverWidget);
exports.DebugHoverWidget = DebugHoverWidget;
//# sourceMappingURL=debug-hover-widget.js.map