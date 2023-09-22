(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_monaco_lib_browser_monaco-editor-provider_js"],{

/***/ "../../packages/core/shared/@phosphor/commands/index.js":
/*!**************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/commands/index.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/commands */ "../../node_modules/@phosphor/commands/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/commands'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-bulk-edit-service.js":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-bulk-edit-service.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoBulkEditService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco_workspace_1 = __webpack_require__(/*! ./monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const bulkEditService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService.js");
let MonacoBulkEditService = class MonacoBulkEditService {
    async apply(editsIn, options) {
        const edits = Array.isArray(editsIn) ? editsIn : bulkEditService_1.ResourceEdit.convert(editsIn);
        if (this._previewHandler && ((options === null || options === void 0 ? void 0 : options.showPreview) || edits.some(value => { var _a; return (_a = value.metadata) === null || _a === void 0 ? void 0 : _a.needsConfirmation; }))) {
            editsIn = await this._previewHandler(edits, options);
            return { ariaSummary: '', success: true };
        }
        else {
            return this.workspace.applyBulkEdit(edits, options);
        }
    }
    hasPreviewHandler() {
        return Boolean(this._previewHandler);
    }
    setPreviewHandler(handler) {
        this._previewHandler = handler;
        const disposePreviewHandler = () => {
            if (this._previewHandler === handler) {
                this._previewHandler = undefined;
            }
        };
        return {
            dispose() {
                disposePreviewHandler();
            }
        };
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace),
    __metadata("design:type", monaco_workspace_1.MonacoWorkspace)
], MonacoBulkEditService.prototype, "workspace", void 0);
MonacoBulkEditService = __decorate([
    (0, inversify_1.injectable)()
], MonacoBulkEditService);
exports.MonacoBulkEditService = MonacoBulkEditService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-bulk-edit-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-color-registry.js":
/*!******************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-color-registry.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoColorRegistry = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const colorRegistry_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/colorRegistry */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/colorRegistry.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const standaloneTheme_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme.js");
const color_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/color */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/color.js");
const Colors = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/colorRegistry */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/colorRegistry.js");
let MonacoColorRegistry = class MonacoColorRegistry extends color_registry_1.ColorRegistry {
    constructor() {
        super(...arguments);
        this.monacoThemeService = standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService);
        this.monacoColorRegistry = (0, colorRegistry_1.getColorRegistry)();
    }
    *getColors() {
        for (const { id } of this.monacoColorRegistry.getColors()) {
            yield id;
        }
    }
    getCurrentColor(id) {
        var _a;
        return (_a = this.monacoThemeService.getColorTheme().getColor(id)) === null || _a === void 0 ? void 0 : _a.toString();
    }
    getColor(id) {
        return this.monacoThemeService.getColorTheme().getColor(id);
    }
    doRegister(definition) {
        var _a, _b, _c, _d, _e, _f;
        const defaults = {
            dark: this.toColor((_a = definition.defaults) === null || _a === void 0 ? void 0 : _a.dark),
            light: this.toColor((_b = definition.defaults) === null || _b === void 0 ? void 0 : _b.light),
            hcDark: this.toColor((_d = (_c = definition.defaults) === null || _c === void 0 ? void 0 : _c.hcDark) !== null && _d !== void 0 ? _d : (_e = definition.defaults) === null || _e === void 0 ? void 0 : _e.hc),
            hcLight: this.toColor((_f = definition.defaults) === null || _f === void 0 ? void 0 : _f.hcLight),
        };
        const identifier = this.monacoColorRegistry.registerColor(definition.id, defaults, definition.description);
        return disposable_1.Disposable.create(() => this.monacoColorRegistry.deregisterColor(identifier));
    }
    toColor(value) {
        if (!value || typeof value === 'string') {
            return value !== null && value !== void 0 ? value : null; // eslint-disable-line no-null/no-null
        }
        if ('kind' in value) {
            return Colors[value.kind](value.v, value.f);
        }
        else if ('r' in value) {
            const { r, g, b, a } = value;
            return new color_1.Color(new color_1.RGBA(r, g, b, a));
        }
        else {
            const { h, s, l, a } = value;
            return new color_1.Color(new color_1.HSLA(h, s, l, a));
        }
    }
};
MonacoColorRegistry = __decorate([
    (0, inversify_1.injectable)()
], MonacoColorRegistry);
exports.MonacoColorRegistry = MonacoColorRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-color-registry'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-command-service.js":
/*!*******************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-command-service.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.MonacoCommandService = exports.MonacoCommandServiceFactory = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
exports.MonacoCommandServiceFactory = Symbol('MonacoCommandServiceFactory');
let MonacoCommandService = class MonacoCommandService {
    constructor(commandRegistry) {
        this.commandRegistry = commandRegistry;
        this.onWillExecuteCommandEmitter = new event_1.Emitter();
        this.onDidExecuteCommandEmitter = new event_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection(this.onWillExecuteCommandEmitter, this.onDidExecuteCommandEmitter);
        this.delegateListeners = new disposable_1.DisposableCollection();
        this.toDispose.push(this.commandRegistry.onWillExecuteCommand(e => this.onWillExecuteCommandEmitter.fire(e)));
        this.toDispose.push(this.commandRegistry.onDidExecuteCommand(e => this.onDidExecuteCommandEmitter.fire(e)));
    }
    dispose() {
        this.toDispose.dispose();
    }
    get onWillExecuteCommand() {
        return this.onWillExecuteCommandEmitter.event;
    }
    get onDidExecuteCommand() {
        return this.onDidExecuteCommandEmitter.event;
    }
    setDelegate(delegate) {
        if (this.toDispose.disposed) {
            return;
        }
        this.delegateListeners.dispose();
        this.toDispose.push(this.delegateListeners);
        this.delegate = delegate;
        if (this.delegate) {
            this.delegateListeners.push(this.delegate.onWillExecuteCommand(event => this.onWillExecuteCommandEmitter.fire(event)));
            this.delegateListeners.push(this.delegate.onDidExecuteCommand(event => this.onDidExecuteCommandEmitter.fire(event)));
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async executeCommand(commandId, ...args) {
        try {
            await this.commandRegistry.executeCommand(commandId, ...args);
        }
        catch (e) {
            if (e.code === 'NO_ACTIVE_HANDLER') {
                return this.executeMonacoCommand(commandId, ...args);
            }
            throw e;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async executeMonacoCommand(commandId, ...args) {
        if (this.delegate) {
            return this.delegate.executeCommand(commandId, ...args);
        }
        throw new Error(`command '${commandId}' not found`);
    }
};
MonacoCommandService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(command_1.CommandRegistry)),
    __metadata("design:paramtypes", [command_1.CommandRegistry])
], MonacoCommandService);
exports.MonacoCommandService = MonacoCommandService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-command-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-context-menu.js":
/*!****************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-context-menu.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.MonacoContextMenuService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const widgets_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/widgets */ "../../packages/core/shared/@phosphor/widgets/index.js");
const commands_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/commands */ "../../packages/core/shared/@phosphor/commands/index.js");
const actions_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/actions/common/actions */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/actions/common/actions.js");
const event_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/event */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/event.js");
let MonacoContextMenuService = class MonacoContextMenuService {
    constructor(contextMenuRenderer) {
        this.contextMenuRenderer = contextMenuRenderer;
        this.onDidShowContextMenuEmitter = new event_1.Emitter();
        this.onDidHideContextMenuEmitter = new event_1.Emitter();
    }
    get onDidShowContextMenu() {
        return this.onDidShowContextMenuEmitter.event;
    }
    ;
    get onDidHideContextMenu() {
        return this.onDidShowContextMenuEmitter.event;
    }
    ;
    showContextMenu(delegate) {
        const anchor = (0, browser_2.toAnchor)(delegate.getAnchor());
        const actions = delegate.getActions();
        const onHide = () => {
            var _a;
            (_a = delegate.onHide) === null || _a === void 0 ? void 0 : _a.call(delegate, false);
            this.onDidHideContextMenuEmitter.fire();
        };
        // Actions for editor context menu come as 'MenuItemAction' items
        // In case of 'Quick Fix' actions come as 'CodeActionAction' items
        if (actions.length > 0 && actions[0] instanceof actions_1.MenuItemAction) {
            this.contextMenuRenderer.render({
                menuPath: this.menuPath(),
                anchor,
                onHide
            });
        }
        else {
            const commands = new commands_1.CommandRegistry();
            const menu = new widgets_1.Menu({
                commands
            });
            for (const action of actions) {
                const commandId = 'quickfix_' + actions.indexOf(action);
                commands.addCommand(commandId, {
                    label: action.label,
                    className: action.class,
                    isToggled: () => Boolean(action.checked),
                    isEnabled: () => action.enabled,
                    execute: () => action.run()
                });
                menu.addItem({
                    type: 'command',
                    command: commandId
                });
            }
            menu.aboutToClose.connect(() => onHide());
            menu.open(anchor.x, anchor.y);
        }
        this.onDidShowContextMenuEmitter.fire();
    }
    menuPath() {
        return browser_1.EDITOR_CONTEXT_MENU;
    }
};
MonacoContextMenuService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_2.ContextMenuRenderer)),
    __metadata("design:paramtypes", [browser_2.ContextMenuRenderer])
], MonacoContextMenuService);
exports.MonacoContextMenuService = MonacoContextMenuService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-context-menu'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-diff-editor.js":
/*!***************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-diff-editor.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoDiffEditor = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const diff_uris_1 = __webpack_require__(/*! @theia/core/lib/browser/diff-uris */ "../../packages/core/lib/browser/diff-uris.js");
const standaloneCodeEditor_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor.js");
class MonacoDiffEditor extends monaco_editor_1.MonacoEditor {
    constructor(uri, node, originalModel, modifiedModel, services, diffNavigatorFactory, options, override) {
        super(uri, modifiedModel, node, services, options, override);
        this.originalModel = originalModel;
        this.modifiedModel = modifiedModel;
        this.diffNavigatorFactory = diffNavigatorFactory;
        this.documents.add(originalModel);
        const original = originalModel.textEditorModel;
        const modified = modifiedModel.textEditorModel;
        this._diffNavigator = diffNavigatorFactory.createdDiffNavigator(this._diffEditor, options);
        this._diffEditor.setModel({ original, modified });
    }
    get diffEditor() {
        return this._diffEditor;
    }
    get diffNavigator() {
        return this._diffNavigator;
    }
    create(options, override) {
        const instantiator = this.getInstantiatorWithOverrides(override);
        /**
         *  @monaco-uplift. Should be guaranteed to work.
         *  Incomparable enums prevent TypeScript from believing that public IStandaloneDiffEditor is satisfied by private StandaloneDiffEditor
         */
        this._diffEditor = instantiator
            .createInstance(standaloneCodeEditor_1.StandaloneDiffEditor, this.node, { ...options, fixedOverflowWidgets: true });
        this.editor = this._diffEditor.getModifiedEditor();
        return this._diffEditor;
    }
    resize(dimension) {
        if (this.node) {
            const layoutSize = this.computeLayoutSize(this.node, dimension);
            this._diffEditor.layout(layoutSize);
        }
    }
    isActionSupported(id) {
        const action = this._diffEditor.getSupportedActions().find(a => a.id === id);
        return !!action && action.isSupported() && super.isActionSupported(id);
    }
    deltaDecorations(params) {
        console.warn('`deltaDecorations` should be called on either the original, or the modified editor.');
        return [];
    }
    getResourceUri() {
        return new uri_1.default(this.originalModel.uri);
    }
    createMoveToUri(resourceUri) {
        const [left, right] = diff_uris_1.DiffUris.decode(this.uri);
        return diff_uris_1.DiffUris.encode(left.withPath(resourceUri.path), right.withPath(resourceUri.path));
    }
}
exports.MonacoDiffEditor = MonacoDiffEditor;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-diff-editor'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-diff-navigator-factory.js":
/*!**************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-diff-navigator-factory.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoDiffNavigatorFactory = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const diffNavigator_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/widget/diffNavigator */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/widget/diffNavigator.js");
let MonacoDiffNavigatorFactory = class MonacoDiffNavigatorFactory {
    createdDiffNavigator(editor, options) {
        const navigator = new diffNavigator_1.DiffNavigator(editor, options);
        const ensureInitialized = (fwd) => {
            if (navigator['nextIdx'] < 0) {
                navigator['_initIdx'](fwd);
            }
        };
        return {
            canNavigate: () => navigator.canNavigate(),
            hasNext: () => {
                if (navigator.canNavigate()) {
                    ensureInitialized(true);
                    return navigator['nextIdx'] + 1 < navigator['ranges'].length;
                }
                return false;
            },
            hasPrevious: () => {
                if (navigator.canNavigate()) {
                    ensureInitialized(false);
                    return navigator['nextIdx'] > 0;
                }
                return false;
            },
            next: () => navigator.next(),
            previous: () => navigator.previous(),
        };
    }
};
MonacoDiffNavigatorFactory.nullNavigator = {
    canNavigate: () => false,
    hasNext: () => false,
    hasPrevious: () => false,
    next: () => { },
    previous: () => { },
};
MonacoDiffNavigatorFactory = __decorate([
    (0, inversify_1.injectable)()
], MonacoDiffNavigatorFactory);
exports.MonacoDiffNavigatorFactory = MonacoDiffNavigatorFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-diff-navigator-factory'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-editor-provider.js":
/*!*******************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-editor-provider.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MonacoEditorProvider_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoEditorProvider = exports.MonacoEditorFactory = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const diff_uris_1 = __webpack_require__(/*! @theia/core/lib/browser/diff-uris */ "../../packages/core/lib/browser/diff-uris.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const monaco_command_service_1 = __webpack_require__(/*! ./monaco-command-service */ "../../packages/monaco/lib/browser/monaco-command-service.js");
const monaco_context_menu_1 = __webpack_require__(/*! ./monaco-context-menu */ "../../packages/monaco/lib/browser/monaco-context-menu.js");
const monaco_diff_editor_1 = __webpack_require__(/*! ./monaco-diff-editor */ "../../packages/monaco/lib/browser/monaco-diff-editor.js");
const monaco_diff_navigator_factory_1 = __webpack_require__(/*! ./monaco-diff-navigator-factory */ "../../packages/monaco/lib/browser/monaco-diff-navigator-factory.js");
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const monaco_editor_model_1 = __webpack_require__(/*! ./monaco-editor-model */ "../../packages/monaco/lib/browser/monaco-editor-model.js");
const monaco_editor_service_1 = __webpack_require__(/*! ./monaco-editor-service */ "../../packages/monaco/lib/browser/monaco-editor-service.js");
const monaco_text_model_service_1 = __webpack_require__(/*! ./monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const monaco_workspace_1 = __webpack_require__(/*! ./monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const monaco_bulk_edit_service_1 = __webpack_require__(/*! ./monaco-bulk-edit-service */ "../../packages/monaco/lib/browser/monaco-bulk-edit-service.js");
const application_protocol_1 = __webpack_require__(/*! @theia/core/lib/common/application-protocol */ "../../packages/core/lib/common/application-protocol.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const monaco_resolved_keybinding_1 = __webpack_require__(/*! ./monaco-resolved-keybinding */ "../../packages/monaco/lib/browser/monaco-resolved-keybinding.js");
const monaco_to_protocol_converter_1 = __webpack_require__(/*! ./monaco-to-protocol-converter */ "../../packages/monaco/lib/browser/monaco-to-protocol-converter.js");
const protocol_to_monaco_converter_1 = __webpack_require__(/*! ./protocol-to-monaco-converter */ "../../packages/monaco/lib/browser/protocol-to-monaco-converter.js");
const browser_3 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const monaco_quick_input_service_1 = __webpack_require__(/*! ./monaco-quick-input-service */ "../../packages/monaco/lib/browser/monaco-quick-input-service.js");
const contextKeyService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService.js");
const openerService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/openerService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/openerService.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const opener_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/opener/common/opener */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/opener/common/opener.js");
const keybindings_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/keybindings */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/keybindings.js");
const codeEditorService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService.js");
const instantiation_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/instantiation/common/instantiation */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/instantiation/common/instantiation.js");
const keybinding_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybinding */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybinding.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const resolverService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/resolverService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/resolverService.js");
const contextView_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextview/browser/contextView */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextview/browser/contextView.js");
const bulkEditService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService.js");
const contextkey_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey.js");
const quickInput_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickInput */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickInput.js");
const commands_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/commands/common/commands */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/commands/common/commands.js");
exports.MonacoEditorFactory = Symbol('MonacoEditorFactory');
let MonacoEditorProvider = MonacoEditorProvider_1 = class MonacoEditorProvider {
    constructor(codeEditorService, textModelService, contextMenuService, m2p, p2m, workspace, commandServiceFactory, editorPreferences, diffNavigatorFactory, 
    /** @deprecated since 1.6.0 */
    applicationServer, contextKeyService) {
        this.codeEditorService = codeEditorService;
        this.textModelService = textModelService;
        this.contextMenuService = contextMenuService;
        this.m2p = m2p;
        this.p2m = p2m;
        this.workspace = workspace;
        this.commandServiceFactory = commandServiceFactory;
        this.editorPreferences = editorPreferences;
        this.diffNavigatorFactory = diffNavigatorFactory;
        this.applicationServer = applicationServer;
        this.contextKeyService = contextKeyService;
        standaloneServices_1.StandaloneServices.initialize({
            [codeEditorService_1.ICodeEditorService.toString()]: codeEditorService,
        });
    }
    /**
     * Returns the last focused MonacoEditor.
     * It takes into account inline editors as well.
     * If you are interested only in standalone editors then use `MonacoEditor.getCurrent(EditorManager)`
     */
    get current() {
        return this._current;
    }
    async getModel(uri, toDispose) {
        const reference = await this.textModelService.createModelReference(uri);
        // if document is invalid makes sure that all events from underlying resource are processed before throwing invalid model
        if (!reference.object.valid) {
            await reference.object.sync();
        }
        if (!reference.object.valid) {
            reference.dispose();
            throw Object.assign(new Error(`'${uri.toString()}' is invalid`), { code: 'MODEL_IS_INVALID' });
        }
        toDispose.push(reference);
        return reference.object;
    }
    async get(uri) {
        await this.editorPreferences.ready;
        return this.doCreateEditor(uri, (override, toDispose) => this.createEditor(uri, override, toDispose));
    }
    async doCreateEditor(uri, factory) {
        const commandService = this.commandServiceFactory();
        const domNode = document.createElement('div');
        const contextKeyService = this.contextKeyService.createScoped(domNode);
        const { codeEditorService, textModelService, contextMenuService } = this;
        const workspaceEditService = this.bulkEditService;
        const toDispose = new common_1.DisposableCollection(commandService);
        const openerService = new openerService_1.OpenerService(codeEditorService, commandService);
        openerService.registerOpener({
            open: (u, options) => this.interceptOpen(u, options)
        });
        const overrides = [
            [codeEditorService_1.ICodeEditorService, codeEditorService],
            [resolverService_1.ITextModelService, textModelService],
            [contextView_1.IContextMenuService, contextMenuService],
            [bulkEditService_1.IBulkEditService, workspaceEditService],
            [contextkey_1.IContextKeyService, contextKeyService],
            [opener_1.IOpenerService, openerService],
            [quickInput_1.IQuickInputService, this.quickInputService],
            [commands_1.ICommandService, commandService]
        ];
        const editor = await factory(overrides, toDispose);
        editor.onDispose(() => toDispose.dispose());
        this.injectKeybindingResolver(editor);
        const standaloneCommandService = new standaloneServices_1.StandaloneCommandService(standaloneServices_1.StandaloneServices.get(instantiation_1.IInstantiationService));
        commandService.setDelegate(standaloneCommandService);
        toDispose.push(editor.onFocusChanged(focused => {
            if (focused) {
                this._current = editor;
            }
        }));
        toDispose.push(common_1.Disposable.create(() => {
            if (this._current === editor) {
                this._current = undefined;
            }
        }));
        return editor;
    }
    /**
     * Intercept internal Monaco open calls and delegate to OpenerService.
     */
    async interceptOpen(monacoUri, monacoOptions) {
        let options = undefined;
        if (monacoOptions) {
            if ('openToSide' in monacoOptions && monacoOptions.openToSide) {
                options = Object.assign(options || {}, {
                    widgetOptions: {
                        mode: 'split-right'
                    }
                });
            }
            if ('openExternal' in monacoOptions && monacoOptions.openExternal) {
                options = Object.assign(options || {}, {
                    openExternal: true
                });
            }
        }
        const uri = new uri_1.default(monacoUri.toString());
        try {
            await (0, browser_2.open)(this.openerService, uri, options);
            return true;
        }
        catch (e) {
            console.error(`Fail to open '${uri.toString()}':`, e);
            return false;
        }
    }
    injectKeybindingResolver(editor) {
        const keybindingService = standaloneServices_1.StandaloneServices.get(keybinding_1.IKeybindingService);
        keybindingService.resolveKeybinding = keybinding => [new monaco_resolved_keybinding_1.MonacoResolvedKeybinding(monaco_resolved_keybinding_1.MonacoResolvedKeybinding.keySequence(keybinding), this.keybindingRegistry)];
        keybindingService.resolveKeyboardEvent = keyboardEvent => {
            const keybinding = new keybindings_1.SimpleKeybinding(keyboardEvent.ctrlKey, keyboardEvent.shiftKey, keyboardEvent.altKey, keyboardEvent.metaKey, keyboardEvent.keyCode).toChord();
            return new monaco_resolved_keybinding_1.MonacoResolvedKeybinding(monaco_resolved_keybinding_1.MonacoResolvedKeybinding.keySequence(keybinding), this.keybindingRegistry);
        };
    }
    createEditor(uri, override, toDispose) {
        if (diff_uris_1.DiffUris.isDiffUri(uri)) {
            return this.createMonacoDiffEditor(uri, override, toDispose);
        }
        return this.createMonacoEditor(uri, override, toDispose);
    }
    get preferencePrefixes() {
        return ['editor.'];
    }
    async createMonacoEditor(uri, override, toDispose) {
        const model = await this.getModel(uri, toDispose);
        const options = this.createMonacoEditorOptions(model);
        const factory = this.factories.getContributions().find(({ scheme }) => uri.scheme === scheme);
        const editor = factory
            ? factory.create(model, options, override)
            : new monaco_editor_1.MonacoEditor(uri, model, document.createElement('div'), this.services, options, override);
        toDispose.push(this.editorPreferences.onPreferenceChanged(event => {
            if (event.affects(uri.toString(), model.languageId)) {
                this.updateMonacoEditorOptions(editor, event);
            }
        }));
        toDispose.push(editor.onLanguageChanged(() => this.updateMonacoEditorOptions(editor)));
        editor.document.onWillSaveModel(event => event.waitUntil(this.formatOnSave(editor, event)));
        return editor;
    }
    createMonacoEditorOptions(model) {
        const options = this.createOptions(this.preferencePrefixes, model.uri, model.languageId);
        options.model = model.textEditorModel;
        options.readOnly = model.readOnly;
        options.lineNumbersMinChars = model.lineNumbersMinChars;
        return options;
    }
    updateMonacoEditorOptions(editor, event) {
        if (event) {
            const preferenceName = event.preferenceName;
            const overrideIdentifier = editor.document.languageId;
            const newValue = this.editorPreferences.get({ preferenceName, overrideIdentifier }, undefined, editor.uri.toString());
            editor.getControl().updateOptions(this.setOption(preferenceName, newValue, this.preferencePrefixes));
        }
        else {
            const options = this.createMonacoEditorOptions(editor.document);
            delete options.model;
            editor.getControl().updateOptions(options);
        }
    }
    shouldFormat(editor, event) {
        var _a;
        if (event.reason !== vscode_languageserver_protocol_1.TextDocumentSaveReason.Manual) {
            return false;
        }
        if ((_a = event.options) === null || _a === void 0 ? void 0 : _a.formatType) {
            switch (event.options.formatType) {
                case 1 /* ON */: return true;
                case 2 /* OFF */: return false;
                case 3 /* DIRTY */: return editor.document.dirty;
            }
        }
        return true;
    }
    async formatOnSave(editor, event) {
        if (!this.shouldFormat(editor, event)) {
            return [];
        }
        const overrideIdentifier = editor.document.languageId;
        const uri = editor.uri.toString();
        const formatOnSave = this.editorPreferences.get({ preferenceName: 'editor.formatOnSave', overrideIdentifier }, undefined, uri);
        if (formatOnSave) {
            const formatOnSaveTimeout = this.editorPreferences.get({ preferenceName: 'editor.formatOnSaveTimeout', overrideIdentifier }, undefined, uri);
            await Promise.race([
                (0, promise_util_1.timeoutReject)(formatOnSaveTimeout, `Aborted format on save after ${formatOnSaveTimeout}ms`),
                editor.runAction('editor.action.formatDocument')
            ]);
        }
        const shouldRemoveWhiteSpace = this.filePreferences.get({ preferenceName: 'files.trimTrailingWhitespace', overrideIdentifier }, undefined, uri);
        if (shouldRemoveWhiteSpace) {
            await editor.runAction('editor.action.trimTrailingWhitespace');
        }
        return [];
    }
    get diffPreferencePrefixes() {
        return [...this.preferencePrefixes, 'diffEditor.'];
    }
    async createMonacoDiffEditor(uri, override, toDispose) {
        const [original, modified] = diff_uris_1.DiffUris.decode(uri);
        const [originalModel, modifiedModel] = await Promise.all([this.getModel(original, toDispose), this.getModel(modified, toDispose)]);
        const options = this.createMonacoDiffEditorOptions(originalModel, modifiedModel);
        const editor = new monaco_diff_editor_1.MonacoDiffEditor(uri, document.createElement('div'), originalModel, modifiedModel, this.services, this.diffNavigatorFactory, options, override);
        toDispose.push(this.editorPreferences.onPreferenceChanged(event => {
            const originalFileUri = original.withoutQuery().withScheme('file').toString();
            if (event.affects(originalFileUri, editor.document.languageId)) {
                this.updateMonacoDiffEditorOptions(editor, event, originalFileUri);
            }
        }));
        toDispose.push(editor.onLanguageChanged(() => this.updateMonacoDiffEditorOptions(editor)));
        return editor;
    }
    createMonacoDiffEditorOptions(original, modified) {
        const options = this.createOptions(this.diffPreferencePrefixes, modified.uri, modified.languageId);
        options.originalEditable = !original.readOnly;
        options.readOnly = modified.readOnly;
        return options;
    }
    updateMonacoDiffEditorOptions(editor, event, resourceUri) {
        if (event) {
            const preferenceName = event.preferenceName;
            const overrideIdentifier = editor.document.languageId;
            const newValue = this.editorPreferences.get({ preferenceName, overrideIdentifier }, undefined, resourceUri);
            editor.diffEditor.updateOptions(this.setOption(preferenceName, newValue, this.diffPreferencePrefixes));
        }
        else {
            const options = this.createMonacoDiffEditorOptions(editor.originalModel, editor.modifiedModel);
            editor.diffEditor.updateOptions(options);
        }
    }
    createOptions(prefixes, uri, overrideIdentifier) {
        const flat = {};
        for (const preferenceName of Object.keys(this.editorPreferences)) {
            flat[preferenceName] = this.editorPreferences.get({ preferenceName, overrideIdentifier }, undefined, uri);
        }
        return Object.entries(flat).reduce((tree, [preferenceName, value]) => this.setOption(preferenceName, (0, common_1.deepClone)(value), prefixes, tree), {});
    }
    setOption(preferenceName, value, prefixes, options = {}) {
        const optionName = this.toOptionName(preferenceName, prefixes);
        this.doSetOption(options, value, optionName.split('.'));
        return options;
    }
    toOptionName(preferenceName, prefixes) {
        for (const prefix of prefixes) {
            if (preferenceName.startsWith(prefix)) {
                return preferenceName.substring(prefix.length);
            }
        }
        return preferenceName;
    }
    doSetOption(obj, value, names) {
        for (let i = 0; i < names.length - 1; i++) {
            const name = names[i];
            if (obj[name] === undefined) {
                obj = obj[name] = {};
            }
            else if (typeof obj[name] !== 'object' || obj[name] === null) { // eslint-disable-line no-null/no-null
                console.warn(`Preference (diff)editor.${names.join('.')} conflicts with another preference name.`);
                obj = obj[name] = {};
            }
            else {
                obj = obj[name];
            }
        }
        obj[names[names.length - 1]] = value;
    }
    getDiffNavigator(editor) {
        if (editor instanceof monaco_diff_editor_1.MonacoDiffEditor) {
            return editor.diffNavigator;
        }
        return monaco_diff_navigator_factory_1.MonacoDiffNavigatorFactory.nullNavigator;
    }
    async createInline(uri, node, options) {
        return this.doCreateEditor(uri, async (override, toDispose) => {
            const overrides = override ? Array.from(override) : [];
            overrides.push([contextView_1.IContextMenuService, { showContextMenu: () => { } }]);
            const document = new monaco_editor_model_1.MonacoEditorModel({
                uri,
                readContents: async () => '',
                dispose: () => { }
            }, this.m2p, this.p2m);
            toDispose.push(document);
            const model = (await document.load()).textEditorModel;
            return new monaco_editor_1.MonacoEditor(uri, document, node, this.services, Object.assign({
                model,
                isSimpleWidget: true,
                autoSizing: false,
                minHeight: 1,
                maxHeight: 1
            }, MonacoEditorProvider_1.inlineOptions, options), overrides);
        });
    }
};
MonacoEditorProvider.inlineOptions = {
    wordWrap: 'on',
    overviewRulerLanes: 0,
    glyphMargin: false,
    lineNumbers: 'off',
    folding: false,
    selectOnLineNumbers: false,
    hideCursorInOverviewRuler: true,
    selectionHighlight: false,
    scrollbar: {
        horizontal: 'hidden'
    },
    lineDecorationsWidth: 0,
    overviewRulerBorder: false,
    scrollBeyondLastLine: false,
    renderLineHighlight: 'none',
    fixedOverflowWidgets: true,
    acceptSuggestionOnEnter: 'smart',
    minimap: {
        enabled: false
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(exports.MonacoEditorFactory),
    __metadata("design:type", Object)
], MonacoEditorProvider.prototype, "factories", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_bulk_edit_service_1.MonacoBulkEditService),
    __metadata("design:type", monaco_bulk_edit_service_1.MonacoBulkEditService)
], MonacoEditorProvider.prototype, "bulkEditService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_1.MonacoEditorServices),
    __metadata("design:type", monaco_editor_1.MonacoEditorServices)
], MonacoEditorProvider.prototype, "services", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.KeybindingRegistry),
    __metadata("design:type", browser_2.KeybindingRegistry)
], MonacoEditorProvider.prototype, "keybindingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.OpenerService),
    __metadata("design:type", Object)
], MonacoEditorProvider.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.FileSystemPreferences),
    __metadata("design:type", Object)
], MonacoEditorProvider.prototype, "filePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_quick_input_service_1.MonacoQuickInputImplementation),
    __metadata("design:type", monaco_quick_input_service_1.MonacoQuickInputImplementation)
], MonacoEditorProvider.prototype, "quickInputService", void 0);
MonacoEditorProvider = MonacoEditorProvider_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService)),
    __param(1, (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService)),
    __param(2, (0, inversify_1.inject)(monaco_context_menu_1.MonacoContextMenuService)),
    __param(3, (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter)),
    __param(4, (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter)),
    __param(5, (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace)),
    __param(6, (0, inversify_1.inject)(monaco_command_service_1.MonacoCommandServiceFactory)),
    __param(7, (0, inversify_1.inject)(browser_1.EditorPreferences)),
    __param(8, (0, inversify_1.inject)(monaco_diff_navigator_factory_1.MonacoDiffNavigatorFactory)),
    __param(9, (0, inversify_1.inject)(application_protocol_1.ApplicationServer)),
    __param(10, (0, inversify_1.inject)(contextKeyService_1.ContextKeyService)),
    __metadata("design:paramtypes", [monaco_editor_service_1.MonacoEditorService,
        monaco_text_model_service_1.MonacoTextModelService,
        monaco_context_menu_1.MonacoContextMenuService,
        monaco_to_protocol_converter_1.MonacoToProtocolConverter,
        protocol_to_monaco_converter_1.ProtocolToMonacoConverter,
        monaco_workspace_1.MonacoWorkspace, Function, Object, monaco_diff_navigator_factory_1.MonacoDiffNavigatorFactory, Object, contextKeyService_1.ContextKeyService])
], MonacoEditorProvider);
exports.MonacoEditorProvider = MonacoEditorProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-editor-provider'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-editor-service.js":
/*!******************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-editor-service.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var MonacoEditorService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoEditorService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const monaco_to_protocol_converter_1 = __webpack_require__(/*! ./monaco-to-protocol-converter */ "../../packages/monaco/lib/browser/monaco-to-protocol-converter.js");
const monaco_editor_model_1 = __webpack_require__(/*! ./monaco-editor-model */ "../../packages/monaco/lib/browser/monaco-editor-model.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const standaloneTheme_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme.js");
const standaloneCodeEditorService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditorService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditorService.js");
const standaloneCodeEditor_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor.js");
const contextKeyService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService.js");
(0, inversify_1.decorate)((0, inversify_1.injectable)(), standaloneCodeEditorService_1.StandaloneCodeEditorService);
let MonacoEditorService = MonacoEditorService_1 = class MonacoEditorService extends standaloneCodeEditorService_1.StandaloneCodeEditorService {
    constructor(contextKeyService) {
        super(contextKeyService, standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService));
    }
    /**
     * Monaco active editor is either focused or last focused editor.
     */
    getActiveCodeEditor() {
        let editor = monaco_editor_1.MonacoEditor.getCurrent(this.editors);
        if (!editor && browser_2.CustomEditorWidget.is(this.shell.activeWidget)) {
            const model = this.shell.activeWidget.modelRef.object;
            if (model.editorTextModel instanceof monaco_editor_model_1.MonacoEditorModel) {
                editor = monaco_editor_1.MonacoEditor.findByDocument(this.editors, model.editorTextModel)[0];
            }
        }
        const candidate = editor === null || editor === void 0 ? void 0 : editor.getControl();
        // Since we extend a private super class, we have to check that the thing that matches the public interface also matches the private expectations the superclass.
        /* eslint-disable-next-line no-null/no-null */
        return candidate instanceof standaloneCodeEditor_1.StandaloneCodeEditor ? candidate : null;
    }
    async openCodeEditor(input, source, sideBySide) {
        const uri = new uri_1.default(input.resource.toString());
        const openerOptions = this.createEditorOpenerOptions(input, source, sideBySide);
        const widget = await (0, browser_1.open)(this.openerService, uri, openerOptions);
        const editorWidget = await this.findEditorWidgetByUri(widget, uri.toString());
        if (editorWidget && editorWidget.editor instanceof monaco_editor_1.MonacoEditor) {
            const candidate = editorWidget.editor.getControl();
            // Since we extend a private super class, we have to check that the thing that matches the public interface also matches the private expectations the superclass.
            // eslint-disable-next-line no-null/no-null
            return candidate instanceof standaloneCodeEditor_1.StandaloneCodeEditor ? candidate : null;
        }
        // eslint-disable-next-line no-null/no-null
        return null;
    }
    async findEditorWidgetByUri(widget, uriAsString) {
        if (widget instanceof browser_2.EditorWidget) {
            if (widget.editor.uri.toString() === uriAsString) {
                return widget;
            }
            return undefined;
        }
        if (browser_1.ApplicationShell.TrackableWidgetProvider.is(widget)) {
            for (const childWidget of widget.getTrackableWidgets()) {
                const editorWidget = await this.findEditorWidgetByUri(childWidget, uriAsString);
                if (editorWidget) {
                    return editorWidget;
                }
            }
        }
        return undefined;
    }
    createEditorOpenerOptions(input, source, sideBySide) {
        const mode = this.getEditorOpenMode(input);
        const widgetOptions = this.getWidgetOptions(source, sideBySide);
        const selection = this.getSelection(input);
        const preview = !!this.preferencesService.get(MonacoEditorService_1.ENABLE_PREVIEW_PREFERENCE, false);
        return { mode, widgetOptions, preview, selection };
    }
    getSelection(input) {
        if ('options' in input && input.options && 'selection' in input.options) {
            return this.m2p.asRange(input.options.selection);
        }
    }
    getEditorOpenMode(input) {
        const options = {
            preserveFocus: false,
            revealIfVisible: true,
            ...input.options
        };
        if (options.preserveFocus) {
            return 'reveal';
        }
        return options.revealIfVisible ? 'activate' : 'open';
    }
    getWidgetOptions(source, sideBySide) {
        const ref = monaco_editor_1.MonacoEditor.getWidgetFor(this.editors, source);
        if (!ref) {
            return undefined;
        }
        const area = (ref && this.shell.getAreaFor(ref)) || 'main';
        const mode = ref && sideBySide ? 'split-right' : undefined;
        return { area, mode, ref };
    }
};
MonacoEditorService.ENABLE_PREVIEW_PREFERENCE = 'editor.enablePreview';
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], MonacoEditorService.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter),
    __metadata("design:type", monaco_to_protocol_converter_1.MonacoToProtocolConverter)
], MonacoEditorService.prototype, "m2p", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], MonacoEditorService.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], MonacoEditorService.prototype, "editors", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], MonacoEditorService.prototype, "preferencesService", void 0);
MonacoEditorService = MonacoEditorService_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contextKeyService_1.ContextKeyService)),
    __metadata("design:paramtypes", [contextKeyService_1.ContextKeyService])
], MonacoEditorService);
exports.MonacoEditorService = MonacoEditorService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-editor-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-keycode-map.js":
/*!***************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-keycode-map.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KEY_CODE_MAP = void 0;
const browser = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const MonacoPlatform = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/platform */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/platform.js");
exports.KEY_CODE_MAP = [];
(function () {
    exports.KEY_CODE_MAP[3] = 7 /* PauseBreak */; // VK_CANCEL 0x03 Control-break processing
    exports.KEY_CODE_MAP[8] = 1 /* Backspace */;
    exports.KEY_CODE_MAP[9] = 2 /* Tab */;
    exports.KEY_CODE_MAP[13] = 3 /* Enter */;
    exports.KEY_CODE_MAP[16] = 4 /* Shift */;
    exports.KEY_CODE_MAP[17] = 5 /* Ctrl */;
    exports.KEY_CODE_MAP[18] = 6 /* Alt */;
    exports.KEY_CODE_MAP[19] = 7 /* PauseBreak */;
    exports.KEY_CODE_MAP[20] = 8 /* CapsLock */;
    exports.KEY_CODE_MAP[27] = 9 /* Escape */;
    exports.KEY_CODE_MAP[32] = 10 /* Space */;
    exports.KEY_CODE_MAP[33] = 11 /* PageUp */;
    exports.KEY_CODE_MAP[34] = 12 /* PageDown */;
    exports.KEY_CODE_MAP[35] = 13 /* End */;
    exports.KEY_CODE_MAP[36] = 14 /* Home */;
    exports.KEY_CODE_MAP[37] = 15 /* LeftArrow */;
    exports.KEY_CODE_MAP[38] = 16 /* UpArrow */;
    exports.KEY_CODE_MAP[39] = 17 /* RightArrow */;
    exports.KEY_CODE_MAP[40] = 18 /* DownArrow */;
    exports.KEY_CODE_MAP[45] = 19 /* Insert */;
    exports.KEY_CODE_MAP[46] = 20 /* Delete */;
    exports.KEY_CODE_MAP[48] = 21 /* Digit0 */;
    exports.KEY_CODE_MAP[49] = 22 /* Digit1 */;
    exports.KEY_CODE_MAP[50] = 23 /* Digit2 */;
    exports.KEY_CODE_MAP[51] = 24 /* Digit3 */;
    exports.KEY_CODE_MAP[52] = 25 /* Digit4 */;
    exports.KEY_CODE_MAP[53] = 26 /* Digit5 */;
    exports.KEY_CODE_MAP[54] = 27 /* Digit6 */;
    exports.KEY_CODE_MAP[55] = 28 /* Digit7 */;
    exports.KEY_CODE_MAP[56] = 29 /* Digit8 */;
    exports.KEY_CODE_MAP[57] = 30 /* Digit9 */;
    exports.KEY_CODE_MAP[65] = 31 /* KeyA */;
    exports.KEY_CODE_MAP[66] = 32 /* KeyB */;
    exports.KEY_CODE_MAP[67] = 33 /* KeyC */;
    exports.KEY_CODE_MAP[68] = 34 /* KeyD */;
    exports.KEY_CODE_MAP[69] = 35 /* KeyE */;
    exports.KEY_CODE_MAP[70] = 36 /* KeyF */;
    exports.KEY_CODE_MAP[71] = 37 /* KeyG */;
    exports.KEY_CODE_MAP[72] = 38 /* KeyH */;
    exports.KEY_CODE_MAP[73] = 39 /* KeyI */;
    exports.KEY_CODE_MAP[74] = 40 /* KeyJ */;
    exports.KEY_CODE_MAP[75] = 41 /* KeyK */;
    exports.KEY_CODE_MAP[76] = 42 /* KeyL */;
    exports.KEY_CODE_MAP[77] = 43 /* KeyM */;
    exports.KEY_CODE_MAP[78] = 44 /* KeyN */;
    exports.KEY_CODE_MAP[79] = 45 /* KeyO */;
    exports.KEY_CODE_MAP[80] = 46 /* KeyP */;
    exports.KEY_CODE_MAP[81] = 47 /* KeyQ */;
    exports.KEY_CODE_MAP[82] = 48 /* KeyR */;
    exports.KEY_CODE_MAP[83] = 49 /* KeyS */;
    exports.KEY_CODE_MAP[84] = 50 /* KeyT */;
    exports.KEY_CODE_MAP[85] = 51 /* KeyU */;
    exports.KEY_CODE_MAP[86] = 52 /* KeyV */;
    exports.KEY_CODE_MAP[87] = 53 /* KeyW */;
    exports.KEY_CODE_MAP[88] = 54 /* KeyX */;
    exports.KEY_CODE_MAP[89] = 55 /* KeyY */;
    exports.KEY_CODE_MAP[90] = 56 /* KeyZ */;
    exports.KEY_CODE_MAP[93] = 58 /* ContextMenu */;
    exports.KEY_CODE_MAP[96] = 93 /* Numpad0 */;
    exports.KEY_CODE_MAP[97] = 94 /* Numpad1 */;
    exports.KEY_CODE_MAP[98] = 95 /* Numpad2 */;
    exports.KEY_CODE_MAP[99] = 96 /* Numpad3 */;
    exports.KEY_CODE_MAP[100] = 97 /* Numpad4 */;
    exports.KEY_CODE_MAP[101] = 98 /* Numpad5 */;
    exports.KEY_CODE_MAP[102] = 99 /* Numpad6 */;
    exports.KEY_CODE_MAP[103] = 100 /* Numpad7 */;
    exports.KEY_CODE_MAP[104] = 101 /* Numpad8 */;
    exports.KEY_CODE_MAP[105] = 102 /* Numpad9 */;
    exports.KEY_CODE_MAP[106] = 103 /* NumpadMultiply */;
    exports.KEY_CODE_MAP[107] = 104 /* NumpadAdd */;
    exports.KEY_CODE_MAP[108] = 105 /* NUMPAD_SEPARATOR */;
    exports.KEY_CODE_MAP[109] = 106 /* NumpadSubtract */;
    exports.KEY_CODE_MAP[110] = 107 /* NumpadDecimal */;
    exports.KEY_CODE_MAP[111] = 108 /* NumpadDivide */;
    exports.KEY_CODE_MAP[112] = 59 /* F1 */;
    exports.KEY_CODE_MAP[113] = 60 /* F2 */;
    exports.KEY_CODE_MAP[114] = 61 /* F3 */;
    exports.KEY_CODE_MAP[115] = 62 /* F4 */;
    exports.KEY_CODE_MAP[116] = 63 /* F5 */;
    exports.KEY_CODE_MAP[117] = 64 /* F6 */;
    exports.KEY_CODE_MAP[118] = 65 /* F7 */;
    exports.KEY_CODE_MAP[119] = 66 /* F8 */;
    exports.KEY_CODE_MAP[120] = 67 /* F9 */;
    exports.KEY_CODE_MAP[121] = 68 /* F10 */;
    exports.KEY_CODE_MAP[122] = 69 /* F11 */;
    exports.KEY_CODE_MAP[123] = 70 /* F12 */;
    exports.KEY_CODE_MAP[124] = 71 /* F13 */;
    exports.KEY_CODE_MAP[125] = 72 /* F14 */;
    exports.KEY_CODE_MAP[126] = 73 /* F15 */;
    exports.KEY_CODE_MAP[127] = 74 /* F16 */;
    exports.KEY_CODE_MAP[128] = 75 /* F17 */;
    exports.KEY_CODE_MAP[129] = 76 /* F18 */;
    exports.KEY_CODE_MAP[130] = 77 /* F19 */;
    exports.KEY_CODE_MAP[144] = 78 /* NumLock */;
    exports.KEY_CODE_MAP[145] = 79 /* ScrollLock */;
    exports.KEY_CODE_MAP[186] = 80 /* Semicolon */;
    exports.KEY_CODE_MAP[187] = 81 /* Equal */;
    exports.KEY_CODE_MAP[188] = 82 /* Comma */;
    exports.KEY_CODE_MAP[189] = 83 /* Minus */;
    exports.KEY_CODE_MAP[190] = 84 /* Period */;
    exports.KEY_CODE_MAP[191] = 85 /* Slash */;
    exports.KEY_CODE_MAP[192] = 86 /* Backquote */;
    exports.KEY_CODE_MAP[193] = 110 /* ABNT_C1 */;
    exports.KEY_CODE_MAP[194] = 111 /* ABNT_C2 */;
    exports.KEY_CODE_MAP[219] = 87 /* BracketLeft */;
    exports.KEY_CODE_MAP[220] = 88 /* Backslash */;
    exports.KEY_CODE_MAP[221] = 89 /* BracketRight */;
    exports.KEY_CODE_MAP[222] = 90 /* Quote */;
    exports.KEY_CODE_MAP[223] = 91 /* OEM_8 */;
    exports.KEY_CODE_MAP[226] = 92 /* IntlBackslash */;
    /**
     * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
     * If an Input Method Editor is processing key input and the event is keydown, return 229.
     */
    exports.KEY_CODE_MAP[229] = 109 /* KEY_IN_COMPOSITION */;
    if (browser.isIE) {
        exports.KEY_CODE_MAP[91] = 57 /* Meta */;
    }
    else if (browser.isFirefox) {
        exports.KEY_CODE_MAP[59] = 80 /* Semicolon */;
        exports.KEY_CODE_MAP[107] = 81 /* Equal */;
        exports.KEY_CODE_MAP[109] = 83 /* Minus */;
        if (MonacoPlatform.OS === 2 /* Macintosh */) {
            exports.KEY_CODE_MAP[224] = 57 /* Meta */;
        }
    }
    else if (browser.isWebKit) {
        exports.KEY_CODE_MAP[91] = 57 /* Meta */;
        if (MonacoPlatform.OS === 2 /* Macintosh */) {
            // the two meta keys in the Mac have different key codes (91 and 93)
            exports.KEY_CODE_MAP[93] = 57 /* Meta */;
        }
        else {
            exports.KEY_CODE_MAP[92] = 57 /* Meta */;
        }
    }
})();

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-keycode-map'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-quick-input-service.js":
/*!***********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-quick-input-service.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.MonacoQuickPickItem = exports.MonacoQuickInputService = exports.MonacoQuickInputImplementation = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const quickInput_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/parts/quickinput/browser/quickInput */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/parts/quickinput/browser/quickInput.js");
const monaco_resolved_keybinding_1 = __webpack_require__(/*! ./monaco-resolved-keybinding */ "../../packages/monaco/lib/browser/monaco-resolved-keybinding.js");
const quickAccess_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/quickinput/browser/quickAccess */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/quickinput/browser/quickAccess.js");
const contextKeyService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService.js");
const listWidget_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/browser/ui/list/listWidget */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/browser/ui/list/listWidget.js");
const instantiation_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/instantiation/common/instantiation */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/instantiation/common/instantiation.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const monaco_color_registry_1 = __webpack_require__(/*! ./monaco-color-registry */ "../../packages/monaco/lib/browser/monaco-color-registry.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const standaloneTheme_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme.js");
let MonacoQuickInputImplementation = class MonacoQuickInputImplementation {
    get backButton() { return this.controller.backButton; }
    get onShow() { return this.controller.onShow; }
    get onHide() { return this.controller.onHide; }
    init() {
        this.initContainer();
        this.initController();
        this.quickAccess = new quickAccess_1.QuickAccessController(this, standaloneServices_1.StandaloneServices.get(instantiation_1.IInstantiationService));
        this.inQuickOpen = this.contextKeyService.createKey('inQuickOpen', false);
        this.controller.onShow(() => {
            this.container.style.top = this.shell.mainPanel.node.getBoundingClientRect().top + 'px';
            this.inQuickOpen.set(true);
        });
        this.controller.onHide(() => this.inQuickOpen.set(false));
        this.themeService.initialized.then(() => this.controller.applyStyles(this.getStyles()));
        // Hook into the theming service of Monaco to ensure that the updates are ready.
        standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService).onDidColorThemeChange(() => this.controller.applyStyles(this.getStyles()));
        window.addEventListener('resize', () => this.updateLayout());
    }
    setContextKey(key) {
        if (key) {
            this.contextKeyService.createKey(key, undefined);
        }
    }
    createQuickPick() {
        return this.controller.createQuickPick();
    }
    createInputBox() {
        return this.controller.createInputBox();
    }
    open(filter) {
        this.quickAccess.show(filter);
        setTimeout(() => {
            this.quickInputList.focusNth(0);
        }, 300);
    }
    input(options, token) {
        return this.controller.input(options, token);
    }
    pick(picks, options, token) {
        return this.controller.pick(picks, options, token);
    }
    hide() {
        this.controller.hide();
    }
    focus() {
        this.controller.focus();
    }
    toggle() {
        this.controller.toggle();
    }
    applyStyles(styles) {
        this.controller.applyStyles(styles);
    }
    layout(dimension, titleBarOffset) {
        this.controller.layout(dimension, titleBarOffset);
    }
    navigate(next, quickNavigate) {
        this.controller.navigate(next, quickNavigate);
    }
    dispose() {
        this.controller.dispose();
    }
    async cancel() {
        this.controller.cancel();
    }
    async back() {
        this.controller.back();
    }
    async accept(keyMods) {
        this.controller.accept(keyMods);
    }
    initContainer() {
        const container = this.container = document.createElement('div');
        container.id = 'quick-input-container';
        document.body.appendChild(this.container);
    }
    initController() {
        this.controller = new quickInput_1.QuickInputController(this.getOptions());
        this.updateLayout();
    }
    updateLayout() {
        // Initialize the layout using screen dimensions as monaco computes the actual sizing.
        // https://github.com/microsoft/vscode/blob/6261075646f055b99068d3688932416f2346dd3b/src/vs/base/parts/quickinput/browser/quickInput.ts#L1799
        this.controller.layout(this.getClientDimension(), 0);
    }
    getClientDimension() {
        return { width: window.innerWidth, height: window.innerHeight };
    }
    getOptions() {
        const options = {
            idPrefix: 'quickInput_',
            container: this.container,
            styles: { widget: {}, list: {}, inputBox: {}, countBadge: {}, button: {}, progressBar: {}, keybindingLabel: {}, },
            ignoreFocusOut: () => false,
            isScreenReaderOptimized: () => false,
            backKeybindingLabel: () => undefined,
            setContextKey: (id) => this.setContextKey(id),
            returnFocus: () => this.container.focus(),
            createList: (user, container, delegate, renderers, listOptions) => this.quickInputList = new listWidget_1.List(user, container, delegate, renderers, listOptions),
        };
        return options;
    }
    // @monaco-uplift
    // Keep the styles up to date with https://github.com/microsoft/vscode/blob/7888ff3a6b104e9e2e3d0f7890ca92dd0828215f/src/vs/platform/quickinput/browser/quickInput.ts#L171.
    getStyles() {
        return {
            widget: {
                quickInputBackground: this.colorRegistry.getColor('quickInput.background'),
                quickInputForeground: this.colorRegistry.getColor('quickInput.foreground'),
                quickInputTitleBackground: this.colorRegistry.getColor('quickInputTitle.background')
            },
            list: {
                listBackground: this.colorRegistry.getColor('quickInput.background'),
                listInactiveFocusForeground: this.colorRegistry.getColor('quickInputList.focusForeground'),
                listInactiveSelectionIconForeground: this.colorRegistry.getColor('quickInputList.focusIconForeground'),
                listInactiveFocusBackground: this.colorRegistry.getColor('quickInputList.focusBackground'),
                listFocusOutline: this.colorRegistry.getColor('activeContrastBorder'),
                listInactiveFocusOutline: this.colorRegistry.getColor('activeContrastBorder'),
                pickerGroupBorder: this.colorRegistry.getColor('pickerGroup.border'),
                pickerGroupForeground: this.colorRegistry.getColor('pickerGroup.foreground')
            },
            inputBox: {
                inputForeground: this.colorRegistry.getColor('inputForeground'),
                inputBackground: this.colorRegistry.getColor('inputBackground'),
                inputBorder: this.colorRegistry.getColor('inputBorder'),
                inputValidationInfoBackground: this.colorRegistry.getColor('inputValidation.infoBackground'),
                inputValidationInfoForeground: this.colorRegistry.getColor('inputValidation.infoForeground'),
                inputValidationInfoBorder: this.colorRegistry.getColor('inputValidation.infoBorder'),
                inputValidationWarningBackground: this.colorRegistry.getColor('inputValidation.warningBackground'),
                inputValidationWarningForeground: this.colorRegistry.getColor('inputValidation.warningForeground'),
                inputValidationWarningBorder: this.colorRegistry.getColor('inputValidation.warningBorder'),
                inputValidationErrorBackground: this.colorRegistry.getColor('inputValidation.errorBackground'),
                inputValidationErrorForeground: this.colorRegistry.getColor('inputValidation.errorForeground'),
                inputValidationErrorBorder: this.colorRegistry.getColor('inputValidation.errorBorder'),
            },
            countBadge: {
                badgeBackground: this.colorRegistry.getColor('badge.background'),
                badgeForeground: this.colorRegistry.getColor('badge.foreground'),
                badgeBorder: this.colorRegistry.getColor('contrastBorder')
            },
            button: {
                buttonForeground: this.colorRegistry.getColor('button.foreground'),
                buttonBackground: this.colorRegistry.getColor('button.background'),
                buttonHoverBackground: this.colorRegistry.getColor('button.hoverBackground'),
                buttonBorder: this.colorRegistry.getColor('contrastBorder')
            },
            progressBar: {
                progressBarBackground: this.colorRegistry.getColor('progressBar.background')
            },
            keybindingLabel: {
                keybindingLabelBackground: this.colorRegistry.getColor('keybindingLabe.background'),
                keybindingLabelForeground: this.colorRegistry.getColor('keybindingLabel.foreground'),
                keybindingLabelBorder: this.colorRegistry.getColor('keybindingLabel.border'),
                keybindingLabelBottomBorder: this.colorRegistry.getColor('keybindingLabel.bottomBorder'),
                keybindingLabelShadow: this.colorRegistry.getColor('widget.shadow')
            },
        };
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], MonacoQuickInputImplementation.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_color_registry_1.MonacoColorRegistry),
    __metadata("design:type", monaco_color_registry_1.MonacoColorRegistry)
], MonacoQuickInputImplementation.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], MonacoQuickInputImplementation.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.inject)(contextKeyService_1.ContextKeyService),
    __metadata("design:type", contextKeyService_1.ContextKeyService)
], MonacoQuickInputImplementation.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoQuickInputImplementation.prototype, "init", null);
MonacoQuickInputImplementation = __decorate([
    (0, inversify_1.injectable)()
], MonacoQuickInputImplementation);
exports.MonacoQuickInputImplementation = MonacoQuickInputImplementation;
let MonacoQuickInputService = class MonacoQuickInputService {
    get backButton() {
        return this.monacoService.backButton;
    }
    get onShow() { return this.monacoService.onShow; }
    get onHide() { return this.monacoService.onHide; }
    open(filter) {
        this.monacoService.open(filter);
    }
    createInputBox() {
        return this.monacoService.createInputBox();
    }
    input(options, token) {
        let inputOptions;
        if (options) {
            const { validateInput, ...props } = options;
            inputOptions = { ...props };
            if (validateInput) {
                inputOptions.validateInput = async (input) => validateInput(input);
            }
        }
        return this.monacoService.input(inputOptions, token);
    }
    async pick(picks, options, token) {
        const monacoPicks = new Promise(async (resolve) => {
            const updatedPicks = (await picks).map(pick => {
                if (pick.type !== 'separator') {
                    pick.buttons && (pick.buttons = pick.buttons.map(browser_1.QuickInputButton.normalize));
                }
                return pick;
            });
            resolve(updatedPicks);
        });
        const monacoOptions = options;
        const picked = await this.monacoService.pick(monacoPicks, monacoOptions, token);
        if (!picked) {
            return picked;
        }
        if (options === null || options === void 0 ? void 0 : options.canPickMany) {
            return (Array.isArray(picked) ? picked : [picked]);
        }
        return Array.isArray(picked) ? picked[0] : picked;
    }
    showQuickPick(items, options) {
        return new Promise((resolve, reject) => {
            var _a, _b, _c, _d;
            const wrapped = this.createQuickPick();
            wrapped.items = items;
            if (options) {
                wrapped.canSelectMany = !!options.canSelectMany;
                wrapped.contextKey = options.contextKey;
                wrapped.description = options.description;
                wrapped.enabled = (_a = options.enabled) !== null && _a !== void 0 ? _a : true;
                wrapped.ignoreFocusOut = !!options.ignoreFocusOut;
                wrapped.matchOnDescription = (_b = options.matchOnDescription) !== null && _b !== void 0 ? _b : true;
                wrapped.matchOnDetail = (_c = options.matchOnDetail) !== null && _c !== void 0 ? _c : true;
                wrapped.keepScrollPosition = (_d = options.keepScrollPosition) !== null && _d !== void 0 ? _d : false;
                wrapped.placeholder = options.placeholder;
                wrapped.step = options.step;
                wrapped.title = options.title;
                wrapped.totalSteps = options.totalSteps;
                if (options.activeItem) {
                    wrapped.activeItems = [options.activeItem];
                }
                wrapped.onDidAccept(() => {
                    if (options === null || options === void 0 ? void 0 : options.onDidAccept) {
                        options.onDidAccept();
                    }
                    wrapped.hide();
                    resolve(wrapped.selectedItems[0]);
                });
                wrapped.onDidHide(() => {
                    if (options.onDidHide) {
                        options.onDidHide();
                    }
                    ;
                    wrapped.dispose();
                    setTimeout(() => resolve(undefined));
                });
                wrapped.onDidChangeValue((filter) => {
                    if (options.onDidChangeValue) {
                        options.onDidChangeValue(wrapped, filter);
                    }
                });
                wrapped.onDidChangeActive((activeItems) => {
                    if (options.onDidChangeActive) {
                        options.onDidChangeActive(wrapped, activeItems);
                    }
                });
                wrapped.onDidTriggerButton((button) => {
                    if (options.onDidTriggerButton) {
                        options.onDidTriggerButton(button);
                    }
                });
                wrapped.onDidTriggerItemButton((event) => {
                    if (options.onDidTriggerItemButton) {
                        // https://github.com/theia-ide/vscode/blob/standalone/0.23.x/src/vs/base/parts/quickinput/browser/quickInput.ts#L1387
                        options.onDidTriggerItemButton({
                            ...event,
                            removeItem: () => {
                                wrapped.items = wrapped.items.filter(item => item !== event.item);
                                wrapped.activeItems = wrapped.activeItems.filter(item => item !== event.item);
                            }
                        });
                    }
                });
                wrapped.onDidChangeSelection((selectedItems) => {
                    if (options.onDidChangeSelection) {
                        options.onDidChangeSelection(wrapped, selectedItems);
                    }
                });
            }
            wrapped.show();
        }).then(item => {
            if (item === null || item === void 0 ? void 0 : item.execute) {
                item.execute();
            }
            return item;
        });
    }
    createQuickPick() {
        const quickPick = this.monacoService.createQuickPick();
        return this.wrapQuickPick(quickPick);
    }
    wrapQuickPick(wrapped) {
        return new MonacoQuickPick(wrapped, this.keybindingRegistry);
    }
    convertItems(item) {
        return new MonacoQuickPickItem(item, this.keybindingRegistry);
    }
    hide() {
        return this.monacoService.hide();
    }
};
__decorate([
    (0, inversify_1.inject)(MonacoQuickInputImplementation),
    __metadata("design:type", MonacoQuickInputImplementation)
], MonacoQuickInputService.prototype, "monacoService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], MonacoQuickInputService.prototype, "keybindingRegistry", void 0);
MonacoQuickInputService = __decorate([
    (0, inversify_1.injectable)()
], MonacoQuickInputService);
exports.MonacoQuickInputService = MonacoQuickInputService;
class MonacoQuickInput {
    constructor(wrapped) {
        this.wrapped = wrapped;
    }
    get onDidHide() { return this.wrapped.onDidHide; }
    get onDispose() { return this.wrapped.onDispose; }
    get title() {
        return this.wrapped.title;
    }
    set title(v) {
        this.wrapped.title = v;
    }
    get description() {
        return this.wrapped.description;
    }
    set description(v) {
        this.wrapped.description = v;
    }
    get step() {
        return this.wrapped.step;
    }
    set step(v) {
        this.wrapped.step = v;
    }
    get enabled() {
        return this.wrapped.enabled;
    }
    set enabled(v) {
        this.wrapped.enabled = v;
    }
    get totalSteps() {
        return this.wrapped.totalSteps;
    }
    set totalSteps(v) {
        this.wrapped.totalSteps = v;
    }
    get contextKey() {
        return this.wrapped.contextKey;
    }
    set contextKey(v) {
        this.wrapped.contextKey = v;
    }
    get busy() {
        return this.wrapped.busy;
    }
    set busy(v) {
        this.wrapped.busy = v;
    }
    get ignoreFocusOut() {
        return this.wrapped.ignoreFocusOut;
    }
    set ignoreFocusOut(v) {
        this.wrapped.ignoreFocusOut = v;
    }
    show() {
        this.wrapped.show();
    }
    hide() {
        this.wrapped.hide();
    }
    dispose() {
        this.wrapped.dispose();
    }
}
class MonacoQuickPick extends MonacoQuickInput {
    constructor(wrapped, keybindingRegistry) {
        super(wrapped);
        this.wrapped = wrapped;
        this.keybindingRegistry = keybindingRegistry;
        this.onDidAccept = this.wrapped.onDidAccept;
        this.onDidChangeValue = this.wrapped.onDidChangeValue;
        this.onDidTriggerButton = this.wrapped.onDidTriggerButton;
        this.onDidTriggerItemButton = core_1.Event.map(this.wrapped.onDidTriggerItemButton, (evt) => ({
            item: evt.item.item,
            button: evt.button
        }));
        this.onDidChangeActive = core_1.Event.map(this.wrapped.onDidChangeActive, (items) => items.map(item => item.item));
        this.onDidChangeSelection = core_1.Event.map(this.wrapped.onDidChangeSelection, (items) => items.map(item => item.item));
    }
    get value() {
        return this.wrapped.value;
    }
    ;
    set value(v) {
        this.wrapped.value = v;
    }
    get placeholder() {
        return this.wrapped.placeholder;
    }
    set placeholder(v) {
        this.wrapped.placeholder = v;
    }
    get canSelectMany() {
        return this.wrapped.canSelectMany;
    }
    set canSelectMany(v) {
        this.wrapped.canSelectMany = v;
    }
    get matchOnDescription() {
        return this.wrapped.matchOnDescription;
    }
    set matchOnDescription(v) {
        this.wrapped.matchOnDescription = v;
    }
    get matchOnDetail() {
        return this.wrapped.matchOnDetail;
    }
    set matchOnDetail(v) {
        this.wrapped.matchOnDetail = v;
    }
    get keepScrollPosition() {
        return this.wrapped.keepScrollPosition;
    }
    set keepScrollPosition(v) {
        this.wrapped.keepScrollPosition = v;
    }
    get items() {
        return this.wrapped.items.map(item => browser_1.QuickPickSeparator.is(item) ? item : item.item);
    }
    set items(itemList) {
        // We need to store and apply the currently selected active items.
        // Since monaco compares these items by reference equality, creating new wrapped items will unmark any active items.
        // Assigning the `activeItems` again will restore all active items even after the items array has changed.
        // See also the `findMonacoItemReferences` method.
        const active = this.activeItems;
        this.wrapped.items = itemList.map(item => browser_1.QuickPickSeparator.is(item) ? item : new MonacoQuickPickItem(item, this.keybindingRegistry));
        if (active.length !== 0) {
            this.activeItems = active; // If this is done with an empty activeItems array, then it will undo first item focus on quick menus.
        }
    }
    set activeItems(itemList) {
        this.wrapped.activeItems = this.findMonacoItemReferences(this.wrapped.items, itemList);
    }
    get activeItems() {
        return this.wrapped.activeItems.map(item => item.item);
    }
    set selectedItems(itemList) {
        this.wrapped.selectedItems = this.findMonacoItemReferences(this.wrapped.items, itemList);
    }
    get selectedItems() {
        return this.wrapped.selectedItems.map(item => item.item);
    }
    /**
     * Monaco doesn't check for deep equality when setting the `activeItems` or `selectedItems`.
     * Instead we have to find the references of the monaco wrappers that contain the selected/active items
     */
    findMonacoItemReferences(source, items) {
        const monacoReferences = [];
        for (const item of items) {
            for (const wrappedItem of source) {
                if (!browser_1.QuickPickSeparator.is(wrappedItem) && wrappedItem.item === item) {
                    monacoReferences.push(wrappedItem);
                }
            }
        }
        return monacoReferences;
    }
}
class MonacoQuickPickItem {
    constructor(item, kbRegistry) {
        var _a;
        this.item = item;
        this.type = item.type;
        this.id = item.id;
        this.label = item.label;
        this.meta = item.meta;
        this.ariaLabel = item.ariaLabel;
        this.description = item.description;
        this.detail = item.detail;
        this.keybinding = item.keySequence ? new monaco_resolved_keybinding_1.MonacoResolvedKeybinding(item.keySequence, kbRegistry) : undefined;
        this.iconClasses = item.iconClasses;
        this.buttons = (_a = item.buttons) === null || _a === void 0 ? void 0 : _a.map(browser_1.QuickInputButton.normalize);
        this.alwaysShow = item.alwaysShow;
        this.highlights = item.highlights;
    }
    accept() {
        if (this.item.execute) {
            this.item.execute();
        }
    }
}
exports.MonacoQuickPickItem = MonacoQuickPickItem;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-quick-input-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-resolved-keybinding.js":
/*!***********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-resolved-keybinding.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoResolvedKeybinding = void 0;
const keybindings_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/keybindings */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/keybindings.js");
const keybindingLabels_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/keybindingLabels */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/keybindingLabels.js");
const usLayoutResolvedKeybinding_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/keybinding/common/usLayoutResolvedKeybinding */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/keybinding/common/usLayoutResolvedKeybinding.js");
const MonacoPlatform = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/platform */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/platform.js");
const keys_1 = __webpack_require__(/*! @theia/core/lib/browser/keys */ "../../packages/core/lib/browser/keys.js");
const os_1 = __webpack_require__(/*! @theia/core/lib/common/os */ "../../packages/core/lib/common/os.js");
const monaco_keycode_map_1 = __webpack_require__(/*! ./monaco-keycode-map */ "../../packages/monaco/lib/browser/monaco-keycode-map.js");
class MonacoResolvedKeybinding extends keybindings_1.ResolvedKeybinding {
    constructor(keySequence, keybindingService) {
        super();
        this.keySequence = keySequence;
        this.parts = keySequence.map(keyCode => {
            // eslint-disable-next-line no-null/no-null
            const keyLabel = keyCode.key ? keybindingService.acceleratorForKey(keyCode.key) : null;
            const keyAriaLabel = keyLabel;
            return new keybindings_1.ResolvedKeybindingPart(keyCode.ctrl, keyCode.shift, keyCode.alt, keyCode.meta, keyLabel, keyAriaLabel);
        });
    }
    getLabel() {
        return keybindingLabels_1.UILabelProvider.toLabel(MonacoPlatform.OS, this.parts, p => p.keyLabel);
    }
    getAriaLabel() {
        return keybindingLabels_1.UILabelProvider.toLabel(MonacoPlatform.OS, this.parts, p => p.keyAriaLabel);
    }
    getElectronAccelerator() {
        if (this.isChord()) {
            // Electron cannot handle chords
            // eslint-disable-next-line no-null/no-null
            return null;
        }
        return keybindingLabels_1.ElectronAcceleratorLabelProvider.toLabel(MonacoPlatform.OS, this.parts, p => p.keyLabel);
    }
    getUserSettingsLabel() {
        return keybindingLabels_1.UserSettingsLabelProvider.toLabel(MonacoPlatform.OS, this.parts, p => p.keyLabel);
    }
    isWYSIWYG() {
        return true;
    }
    isChord() {
        return this.parts.length > 1;
    }
    getDispatchParts() {
        return this.keySequence.map(keyCode => usLayoutResolvedKeybinding_1.USLayoutResolvedKeybinding.getDispatchStr(this.toKeybinding(keyCode)));
    }
    getSingleModifierDispatchParts() {
        return this.keySequence.map(keybinding => this.getSingleModifierDispatchPart(keybinding));
    }
    getSingleModifierDispatchPart(code) {
        var _a, _b, _c, _d, _e;
        if (((_a = code.key) === null || _a === void 0 ? void 0 : _a.keyCode) === undefined) {
            return null; // eslint-disable-line no-null/no-null
        }
        if (monaco_keycode_map_1.KEY_CODE_MAP[(_b = code.key) === null || _b === void 0 ? void 0 : _b.keyCode] === 5 /* Ctrl */ && !code.shift && !code.alt && !code.meta) {
            return 'ctrl';
        }
        if (monaco_keycode_map_1.KEY_CODE_MAP[(_c = code.key) === null || _c === void 0 ? void 0 : _c.keyCode] === 4 /* Shift */ && !code.ctrl && !code.alt && !code.meta) {
            return 'shift';
        }
        if (monaco_keycode_map_1.KEY_CODE_MAP[(_d = code.key) === null || _d === void 0 ? void 0 : _d.keyCode] === 6 /* Alt */ && !code.shift && !code.ctrl && !code.meta) {
            return 'alt';
        }
        if (monaco_keycode_map_1.KEY_CODE_MAP[(_e = code.key) === null || _e === void 0 ? void 0 : _e.keyCode] === 57 /* Meta */ && !code.shift && !code.alt && !code.ctrl) {
            return 'meta';
        }
        return null; // eslint-disable-line no-null/no-null
    }
    toKeybinding(keyCode) {
        return new keybindings_1.SimpleKeybinding(keyCode.ctrl, keyCode.shift, keyCode.alt, keyCode.meta, monaco_keycode_map_1.KEY_CODE_MAP[keyCode.key.keyCode]);
    }
    getParts() {
        return this.parts;
    }
    static toKeybinding(keybindings) {
        return keybindings.map(binding => this.keyCode(binding)).join(' ');
    }
    static keyCode(keybinding) {
        const keyCode = keybinding instanceof keybindings_1.SimpleKeybinding ? keybinding.keyCode : usLayoutResolvedKeybinding_1.USLayoutResolvedKeybinding['_scanCodeToKeyCode'](keybinding.scanCode);
        const sequence = {
            first: keys_1.Key.getKey(this.monaco2BrowserKeyCode(keyCode & 0xff)),
            modifiers: []
        };
        if (keybinding.ctrlKey) {
            if (os_1.isOSX) {
                sequence.modifiers.push(keys_1.KeyModifier.MacCtrl);
            }
            else {
                sequence.modifiers.push(keys_1.KeyModifier.CtrlCmd);
            }
        }
        if (keybinding.shiftKey) {
            sequence.modifiers.push(keys_1.KeyModifier.Shift);
        }
        if (keybinding.altKey) {
            sequence.modifiers.push(keys_1.KeyModifier.Alt);
        }
        if (keybinding.metaKey && sequence.modifiers.indexOf(keys_1.KeyModifier.CtrlCmd) === -1) {
            sequence.modifiers.push(keys_1.KeyModifier.CtrlCmd);
        }
        return keys_1.KeyCode.createKeyCode(sequence);
    }
    static keySequence(keybinding) {
        return keybinding.parts.map(part => this.keyCode(part));
    }
    static monaco2BrowserKeyCode(keyCode) {
        for (let i = 0; i < monaco_keycode_map_1.KEY_CODE_MAP.length; i++) {
            if (monaco_keycode_map_1.KEY_CODE_MAP[i] === keyCode) {
                return i;
            }
        }
        return -1;
    }
}
exports.MonacoResolvedKeybinding = MonacoResolvedKeybinding;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-resolved-keybinding'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_monaco_lib_browser_monaco-editor-provider_js.js.map