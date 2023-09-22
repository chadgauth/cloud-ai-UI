"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_preview_lib_browser_preview-contribution_js"],{

/***/ "../../packages/preview/lib/browser/preview-contribution.js":
/*!******************************************************************!*\
  !*** ../../packages/preview/lib/browser/preview-contribution.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreviewContribution = exports.PreviewCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const mini_browser_open_handler_1 = __webpack_require__(/*! @theia/mini-browser/lib/browser/mini-browser-open-handler */ "../../packages/mini-browser/lib/browser/mini-browser-open-handler.js");
const preview_widget_1 = __webpack_require__(/*! ./preview-widget */ "../../packages/preview/lib/browser/preview-widget.js");
const preview_handler_1 = __webpack_require__(/*! ./preview-handler */ "../../packages/preview/lib/browser/preview-handler.js");
const preview_uri_1 = __webpack_require__(/*! ./preview-uri */ "../../packages/preview/lib/browser/preview-uri.js");
const preview_preferences_1 = __webpack_require__(/*! ./preview-preferences */ "../../packages/preview/lib/browser/preview-preferences.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
var PreviewCommands;
(function (PreviewCommands) {
    /**
     * No `label`. Otherwise, it would show up in the `Command Palette` and we already have the `Preview` open handler.
     * See in (`WorkspaceCommandContribution`)[https://bit.ly/2DncrSD].
     */
    PreviewCommands.OPEN = common_1.Command.toLocalizedCommand({
        id: 'preview:open',
        label: 'Open Preview',
        iconClass: (0, browser_1.codicon)('open-preview')
    }, 'vscode.markdown-language-features/package/markdown.preview.title');
    PreviewCommands.OPEN_SOURCE = {
        id: 'preview.open.source',
        iconClass: (0, browser_1.codicon)('go-to-file')
    };
})(PreviewCommands = exports.PreviewCommands || (exports.PreviewCommands = {}));
let PreviewContribution = 
// eslint-disable-next-line max-len
class PreviewContribution extends browser_1.NavigatableWidgetOpenHandler {
    constructor() {
        super(...arguments);
        this.id = preview_uri_1.PreviewUri.id;
        this.label = nls_1.nls.localize(mini_browser_open_handler_1.MiniBrowserCommands.PREVIEW_CATEGORY_KEY, mini_browser_open_handler_1.MiniBrowserCommands.PREVIEW_CATEGORY);
        this.synchronizedUris = new Set();
        this.scrollSyncLockOn = undefined;
    }
    onStart() {
        this.onCreated(previewWidget => {
            this.registerOpenOnDoubleClick(previewWidget);
            this.registerEditorAndPreviewSync(previewWidget);
        });
        this.editorManager.onCreated(editorWidget => {
            this.registerEditorAndPreviewSync(editorWidget);
        });
    }
    async lockScrollSync(on, delay = 50) {
        this.scrollSyncLockOn = on;
        if (this.scrollSyncLockTimeout) {
            window.clearTimeout(this.scrollSyncLockTimeout);
        }
        this.scrollSyncLockTimeout = window.setTimeout(() => {
            this.scrollSyncLockOn = undefined;
        }, delay);
    }
    async registerEditorAndPreviewSync(source) {
        let uri;
        let editorWidget;
        let previewWidget;
        if (source instanceof browser_2.EditorWidget) {
            editorWidget = source;
            uri = editorWidget.editor.uri.toString();
            previewWidget = await this.getWidget(editorWidget.editor.uri);
        }
        else {
            previewWidget = source;
            uri = previewWidget.getUri().toString();
            editorWidget = await this.editorManager.getByUri(previewWidget.getUri());
        }
        if (!previewWidget || !editorWidget || !uri) {
            return;
        }
        if (this.synchronizedUris.has(uri)) {
            return;
        }
        const syncDisposables = new common_1.DisposableCollection();
        previewWidget.disposed.connect(() => syncDisposables.dispose());
        editorWidget.disposed.connect(() => syncDisposables.dispose());
        const editor = editorWidget.editor;
        syncDisposables.push(editor.onScrollChanged(debounce(() => {
            if (this.scrollSyncLockOn === 'editor') {
                // avoid recursive scroll synchronization
                return;
            }
            this.lockScrollSync('preview');
            const range = editor.getVisibleRanges();
            if (range.length > 0) {
                this.revealSourceLineInPreview(previewWidget, range[0].start);
            }
        }), 100));
        syncDisposables.push(this.synchronizeScrollToEditor(previewWidget, editor));
        this.synchronizedUris.add(uri);
        syncDisposables.push(common_1.Disposable.create(() => this.synchronizedUris.delete(uri)));
    }
    revealSourceLineInPreview(previewWidget, position) {
        previewWidget.revealForSourceLine(position.line);
    }
    synchronizeScrollToEditor(previewWidget, editor) {
        return previewWidget.onDidScroll(sourceLine => {
            if (this.scrollSyncLockOn === 'preview') {
                // avoid recursive scroll synchronization
                return;
            }
            const line = Math.floor(sourceLine);
            this.lockScrollSync('editor'); // avoid recursive scroll synchronization
            editor.revealRange({
                start: {
                    line,
                    character: 0
                },
                end: {
                    line: line + 1,
                    character: 0
                }
            }, { at: 'top' });
        });
    }
    registerOpenOnDoubleClick(ref) {
        const disposable = ref.onDidDoubleClick(async (location) => {
            const { editor } = await this.openSource(ref);
            editor.revealPosition(location.range.start);
            editor.selection = location.range;
            ref.revealForSourceLine(location.range.start.line);
        });
        ref.disposed.connect(() => disposable.dispose());
    }
    canHandle(uri) {
        if (!this.previewHandlerProvider.canHandle(uri)) {
            return 0;
        }
        const editorPriority = this.editorManager.canHandle(uri);
        if (editorPriority === 0) {
            return 200;
        }
        if (preview_uri_1.PreviewUri.match(uri)) {
            return editorPriority * 2;
        }
        return editorPriority * (this.openByDefault ? 2 : 0.5);
    }
    get openByDefault() {
        return this.preferences['preview.openByDefault'];
    }
    async open(uri, options) {
        const resolvedOptions = await this.resolveOpenerOptions(options);
        return super.open(uri, resolvedOptions);
    }
    serializeUri(uri) {
        return super.serializeUri(preview_uri_1.PreviewUri.decode(uri));
    }
    async resolveOpenerOptions(options) {
        const resolved = { mode: 'activate', ...options };
        if (resolved.originUri) {
            const ref = await this.getWidget(resolved.originUri);
            if (ref) {
                resolved.widgetOptions = { ...resolved.widgetOptions, ref };
            }
        }
        return resolved;
    }
    registerCommands(registry) {
        registry.registerCommand(PreviewCommands.OPEN, {
            execute: widget => this.openForEditor(widget),
            isEnabled: widget => this.canHandleEditorUri(widget),
            isVisible: widget => this.canHandleEditorUri(widget)
        });
        registry.registerCommand(PreviewCommands.OPEN_SOURCE, {
            execute: widget => this.openSource(widget),
            isEnabled: widget => widget instanceof preview_widget_1.PreviewWidget,
            isVisible: widget => widget instanceof preview_widget_1.PreviewWidget
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_2.EditorContextMenu.NAVIGATION, {
            commandId: PreviewCommands.OPEN.id
        });
    }
    registerToolbarItems(registry) {
        registry.registerItem({
            id: PreviewCommands.OPEN.id,
            command: PreviewCommands.OPEN.id,
            tooltip: nls_1.nls.localize('vscode.markdown-language-features/package/markdown.previewSide.title', 'Open Preview to the Side')
        });
        registry.registerItem({
            id: PreviewCommands.OPEN_SOURCE.id,
            command: PreviewCommands.OPEN_SOURCE.id,
            tooltip: nls_1.nls.localize('vscode.markdown-language-features/package/markdown.showSource.title', 'Open Source')
        });
    }
    canHandleEditorUri(widget) {
        const uri = this.getCurrentEditorUri(widget);
        return !!uri && this.previewHandlerProvider.canHandle(uri);
    }
    getCurrentEditorUri(widget) {
        const current = this.getCurrentEditor(widget);
        return current && current.editor.uri;
    }
    getCurrentEditor(widget) {
        const current = widget ? widget : this.editorManager.currentEditor;
        return current instanceof browser_2.EditorWidget && current || undefined;
    }
    async openForEditor(widget) {
        const ref = this.getCurrentEditor(widget);
        if (!ref) {
            return;
        }
        await this.open(ref.editor.uri, {
            mode: 'reveal',
            widgetOptions: { ref, mode: 'open-to-right' }
        });
    }
    async openSource(ref) {
        if (ref instanceof preview_widget_1.PreviewWidget) {
            return this.editorManager.open(ref.uri, {
                widgetOptions: { ref, mode: 'tab-after' }
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], PreviewContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(preview_handler_1.PreviewHandlerProvider),
    __metadata("design:type", preview_handler_1.PreviewHandlerProvider)
], PreviewContribution.prototype, "previewHandlerProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preview_preferences_1.PreviewPreferences),
    __metadata("design:type", Object)
], PreviewContribution.prototype, "preferences", void 0);
PreviewContribution = __decorate([
    (0, inversify_1.injectable)()
    // eslint-disable-next-line max-len
], PreviewContribution);
exports.PreviewContribution = PreviewContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/preview-contribution'] = this;


/***/ }),

/***/ "../../packages/preview/lib/browser/preview-handler.js":
/*!*************************************************************!*\
  !*** ../../packages/preview/lib/browser/preview-handler.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreviewHandlerProvider = exports.RenderContentParams = exports.PreviewHandler = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
exports.PreviewHandler = Symbol('PreviewHandler');
var RenderContentParams;
(function (RenderContentParams) {
    function is(params) {
        return (0, core_1.isObject)(params) && 'content' in params && 'originUri' in params;
    }
    RenderContentParams.is = is;
})(RenderContentParams = exports.RenderContentParams || (exports.RenderContentParams = {}));
/**
 * Provider managing the available PreviewHandlers.
 */
let PreviewHandlerProvider = class PreviewHandlerProvider {
    constructor(previewHandlerContributions) {
        this.previewHandlerContributions = previewHandlerContributions;
    }
    /**
     * Find PreviewHandlers for the given resource identifier.
     *
     * @param uri the URI identifying a resource.
     *
     * @returns the list of all supported `PreviewHandlers` sorted by their priority.
     */
    findContribution(uri) {
        const prioritized = core_1.Prioritizeable.prioritizeAllSync(this.previewHandlerContributions.getContributions(), contrib => contrib.canHandle(uri));
        return prioritized.map(c => c.value);
    }
    /**
     * Indicates whether any PreviewHandler can process the resource identified by the given URI.
     *
     * @param uri the URI identifying a resource.
     *
     * @returns `true` when a PreviewHandler can process the resource, `false` otherwise.
     */
    canHandle(uri) {
        return this.findContribution(uri).length > 0;
    }
};
PreviewHandlerProvider = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(core_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.PreviewHandler)),
    __metadata("design:paramtypes", [Object])
], PreviewHandlerProvider);
exports.PreviewHandlerProvider = PreviewHandlerProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/preview-handler'] = this;


/***/ }),

/***/ "../../packages/preview/lib/browser/preview-preferences.js":
/*!*****************************************************************!*\
  !*** ../../packages/preview/lib/browser/preview-preferences.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindPreviewPreferences = exports.createPreviewPreferences = exports.PreviewPreferences = exports.PreviewPreferenceContribution = exports.PreviewConfigSchema = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.PreviewConfigSchema = {
    type: 'object',
    properties: {
        'preview.openByDefault': {
            type: 'boolean',
            description: nls_1.nls.localize('theia/preview/openByDefault', 'Open the preview instead of the editor by default.'),
            default: false
        }
    }
};
exports.PreviewPreferenceContribution = Symbol('PreviewPreferenceContribution');
exports.PreviewPreferences = Symbol('PreviewPreferences');
function createPreviewPreferences(preferences, schema = exports.PreviewConfigSchema) {
    return (0, browser_1.createPreferenceProxy)(preferences, schema);
}
exports.createPreviewPreferences = createPreviewPreferences;
function bindPreviewPreferences(bind) {
    bind(exports.PreviewPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(browser_1.PreferenceService);
        const contribution = ctx.container.get(exports.PreviewPreferenceContribution);
        return createPreviewPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.PreviewPreferenceContribution).toConstantValue({ schema: exports.PreviewConfigSchema });
    bind(browser_1.PreferenceContribution).toService(exports.PreviewPreferenceContribution);
}
exports.bindPreviewPreferences = bindPreviewPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/preview-preferences'] = this;


/***/ }),

/***/ "../../packages/preview/lib/browser/preview-uri.js":
/*!*********************************************************!*\
  !*** ../../packages/preview/lib/browser/preview-uri.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreviewUri = void 0;
var PreviewUri;
(function (PreviewUri) {
    PreviewUri.id = 'code-editor-preview';
    PreviewUri.param = 'open-handler=' + PreviewUri.id;
    function match(uri) {
        return uri.query.indexOf(PreviewUri.param) !== -1;
    }
    PreviewUri.match = match;
    function encode(uri) {
        if (match(uri)) {
            return uri;
        }
        const params = [PreviewUri.param];
        if (uri.query) {
            params.push(...uri.query.split('&'));
        }
        const query = params.join('&');
        return uri.withQuery(query);
    }
    PreviewUri.encode = encode;
    function decode(uri) {
        if (!match(uri)) {
            return uri;
        }
        const query = uri.query.split('&').filter(p => p !== PreviewUri.param).join('&');
        return uri.withQuery(query);
    }
    PreviewUri.decode = decode;
})(PreviewUri = exports.PreviewUri || (exports.PreviewUri = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/preview-uri'] = this;


/***/ }),

/***/ "../../packages/preview/lib/browser/preview-widget.js":
/*!************************************************************!*\
  !*** ../../packages/preview/lib/browser/preview-widget.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreviewWidget = exports.PreviewWidgetOptions = exports.PREVIEW_WIDGET_CLASS = void 0;
const throttle = __webpack_require__(/*! @theia/core/shared/lodash.throttle */ "../../packages/core/shared/lodash.throttle/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const preview_handler_1 = __webpack_require__(/*! ./preview-handler */ "../../packages/preview/lib/browser/preview-handler.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_workspace_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
exports.PREVIEW_WIDGET_CLASS = 'theia-preview-widget';
const DEFAULT_ICON = (0, browser_1.codicon)('eye');
let widgetCounter = 0;
exports.PreviewWidgetOptions = Symbol('PreviewWidgetOptions');
let PreviewWidget = class PreviewWidget extends browser_1.BaseWidget {
    constructor(options, previewHandlerProvider, themeService, workspace, editorPreferences) {
        super();
        this.options = options;
        this.previewHandlerProvider = previewHandlerProvider;
        this.themeService = themeService;
        this.workspace = workspace;
        this.editorPreferences = editorPreferences;
        this.firstUpdate = undefined;
        this.onDidScrollEmitter = new common_1.Emitter();
        this.onDidDoubleClickEmitter = new common_1.Emitter();
        this.preventScrollNotification = false;
        this.previousContent = undefined;
        this.internalRevealForSourceLine = throttle((sourceLine) => {
            if (!this.previewHandler || !this.previewHandler.findElementForSourceLine) {
                return;
            }
            const elementToReveal = this.previewHandler.findElementForSourceLine(this.node, sourceLine);
            if (elementToReveal) {
                this.preventScrollNotification = true;
                elementToReveal.scrollIntoView();
                window.setTimeout(() => {
                    this.preventScrollNotification = false;
                }, 50);
            }
        }, 50);
        this.resource = this.options.resource;
        this.uri = this.resource.uri;
        this.id = 'preview-widget-' + widgetCounter++;
        this.title.closable = true;
        this.title.label = `Preview ${this.uri.path.base}`;
        this.title.caption = this.title.label;
        this.title.closable = true;
        this.toDispose.push(this.onDidScrollEmitter);
        this.toDispose.push(this.onDidDoubleClickEmitter);
        this.addClass(exports.PREVIEW_WIDGET_CLASS);
        this.node.tabIndex = 0;
        const previewHandler = this.previewHandler = this.previewHandlerProvider.findContribution(this.uri)[0];
        if (!previewHandler) {
            return;
        }
        this.title.iconClass = previewHandler.iconClass || DEFAULT_ICON;
        this.initialize();
    }
    async initialize() {
        this.scrollBeyondLastLine = !!this.editorPreferences['editor.scrollBeyondLastLine'];
        this.toDispose.push(this.editorPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'editor.scrollBeyondLastLine') {
                this.scrollBeyondLastLine = Boolean(e.newValue);
                this.forceUpdate();
            }
        }));
        this.toDispose.push(this.resource);
        if (this.resource.onDidChangeContents) {
            this.toDispose.push(this.resource.onDidChangeContents(() => this.update()));
        }
        const updateIfAffected = (affectedUri) => {
            if (!affectedUri || affectedUri === this.uri.toString()) {
                this.update();
            }
        };
        this.toDispose.push(this.workspace.onDidOpenTextDocument(document => updateIfAffected(document.uri)));
        this.toDispose.push(this.workspace.onDidChangeTextDocument(params => updateIfAffected(params.model.uri)));
        this.toDispose.push(this.workspace.onDidCloseTextDocument(document => updateIfAffected(document.uri)));
        this.toDispose.push(this.themeService.onDidColorThemeChange(() => this.update()));
        this.firstUpdate = () => {
            this.revealFragment(this.uri);
        };
        this.update();
    }
    onBeforeAttach(msg) {
        super.onBeforeAttach(msg);
        this.toDispose.push(this.startScrollSync());
        this.toDispose.push(this.startDoubleClickListener());
    }
    startScrollSync() {
        return (0, browser_1.addEventListener)(this.node, 'scroll', throttle((event) => {
            if (this.preventScrollNotification) {
                return;
            }
            const scrollTop = this.node.scrollTop;
            this.didScroll(scrollTop);
        }, 50));
    }
    startDoubleClickListener() {
        return (0, browser_1.addEventListener)(this.node, 'dblclick', (event) => {
            if (!(event.target instanceof HTMLElement)) {
                return;
            }
            const target = event.target;
            let node = target;
            while (node && node instanceof HTMLElement) {
                if (node.tagName === 'A') {
                    return;
                }
                node = node.parentElement;
            }
            const offsetParent = target.offsetParent;
            const offset = offsetParent.classList.contains(exports.PREVIEW_WIDGET_CLASS) ? target.offsetTop : offsetParent.offsetTop;
            this.didDoubleClick(offset);
        });
    }
    getUri() {
        return this.uri;
    }
    getResourceUri() {
        return this.uri;
    }
    createMoveToUri(resourceUri) {
        return this.uri.withPath(resourceUri.path);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
        this.update();
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        this.performUpdate();
    }
    forceUpdate() {
        this.previousContent = undefined;
        this.update();
    }
    async performUpdate() {
        if (!this.resource) {
            return;
        }
        const uri = this.resource.uri;
        const document = this.workspace.textDocuments.find(d => d.uri === uri.toString());
        const content = document ? document.getText() : await this.resource.readContents();
        if (content === this.previousContent) {
            return;
        }
        this.previousContent = content;
        const contentElement = await this.render(content, uri);
        this.node.innerHTML = '';
        if (contentElement) {
            if (this.scrollBeyondLastLine) {
                contentElement.classList.add('scrollBeyondLastLine');
            }
            this.node.appendChild(contentElement);
            if (this.firstUpdate) {
                this.firstUpdate();
                this.firstUpdate = undefined;
            }
        }
    }
    async render(content, originUri) {
        if (!this.previewHandler || !this.resource) {
            return undefined;
        }
        return this.previewHandler.renderContent({ content, originUri });
    }
    revealFragment(uri) {
        if (uri.fragment === '' || !this.previewHandler || !this.previewHandler.findElementForFragment) {
            return;
        }
        const elementToReveal = this.previewHandler.findElementForFragment(this.node, uri.fragment);
        if (elementToReveal) {
            this.preventScrollNotification = true;
            elementToReveal.scrollIntoView();
            window.setTimeout(() => {
                this.preventScrollNotification = false;
            }, 50);
        }
    }
    revealForSourceLine(sourceLine) {
        this.internalRevealForSourceLine(sourceLine);
    }
    get onDidScroll() {
        return this.onDidScrollEmitter.event;
    }
    fireDidScrollToSourceLine(line) {
        this.onDidScrollEmitter.fire(line);
    }
    didScroll(scrollTop) {
        if (!this.previewHandler || !this.previewHandler.getSourceLineForOffset) {
            return;
        }
        const offset = scrollTop;
        const line = this.previewHandler.getSourceLineForOffset(this.node, offset);
        if (line) {
            this.fireDidScrollToSourceLine(line);
        }
    }
    get onDidDoubleClick() {
        return this.onDidDoubleClickEmitter.event;
    }
    fireDidDoubleClickToSourceLine(line) {
        if (!this.resource) {
            return;
        }
        this.onDidDoubleClickEmitter.fire({
            uri: this.resource.uri.toString(),
            range: vscode_languageserver_protocol_1.Range.create({ line, character: 0 }, { line, character: 0 })
        });
    }
    didDoubleClick(offsetTop) {
        if (!this.previewHandler || !this.previewHandler.getSourceLineForOffset) {
            return;
        }
        const line = this.previewHandler.getSourceLineForOffset(this.node, offsetTop) || 0;
        this.fireDidDoubleClickToSourceLine(line);
    }
};
PreviewWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.PreviewWidgetOptions)),
    __param(1, (0, inversify_1.inject)(preview_handler_1.PreviewHandlerProvider)),
    __param(2, (0, inversify_1.inject)(theming_1.ThemeService)),
    __param(3, (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace)),
    __param(4, (0, inversify_1.inject)(browser_2.EditorPreferences)),
    __metadata("design:paramtypes", [Object, preview_handler_1.PreviewHandlerProvider,
        theming_1.ThemeService,
        monaco_workspace_1.MonacoWorkspace, Object])
], PreviewWidget);
exports.PreviewWidget = PreviewWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/preview-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_preview_lib_browser_preview-contribution_js.js.map