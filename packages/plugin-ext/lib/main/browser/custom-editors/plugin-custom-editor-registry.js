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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCustomEditorRegistry = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const disposable_1 = require("@theia/core/lib/common/disposable");
const custom_editor_opener_1 = require("./custom-editor-opener");
const browser_1 = require("@theia/workspace/lib/browser");
const core_1 = require("@theia/core");
const common_1 = require("@theia/core/lib/common");
const uri_command_handler_1 = require("@theia/core/lib/common/uri-command-handler");
const navigator_contribution_1 = require("@theia/navigator/lib//browser/navigator-contribution");
const browser_2 = require("@theia/core/lib/browser");
const custom_editor_widget_1 = require("./custom-editor-widget");
let PluginCustomEditorRegistry = class PluginCustomEditorRegistry {
    constructor() {
        this.editors = new Map();
        this.pendingEditors = new Set();
        this.resolvers = new Map();
        this.onWillOpenCustomEditorEmitter = new core_1.Emitter();
        this.onWillOpenCustomEditor = this.onWillOpenCustomEditorEmitter.event;
        this.resolveWidget = (widget, options) => {
            const resolver = this.resolvers.get(widget.viewType);
            if (resolver) {
                resolver(widget, options);
            }
            else {
                this.pendingEditors.add(widget);
                this.onWillOpenCustomEditorEmitter.fire(widget.viewType);
            }
        };
    }
    init() {
        this.widgetManager.onDidCreateWidget(({ factoryId, widget }) => {
            if (factoryId === custom_editor_widget_1.CustomEditorWidget.FACTORY_ID && widget instanceof custom_editor_widget_1.CustomEditorWidget) {
                const restoreState = widget.restoreState.bind(widget);
                widget.restoreState = state => {
                    if (state.viewType && state.strResource) {
                        restoreState(state);
                        this.resolveWidget(widget);
                    }
                    else {
                        widget.dispose();
                    }
                };
            }
        });
    }
    registerCustomEditor(editor) {
        if (this.editors.has(editor.viewType)) {
            console.warn('editor with such id already registered: ', JSON.stringify(editor));
            return disposable_1.Disposable.NULL;
        }
        this.editors.set(editor.viewType, editor);
        const toDispose = new disposable_1.DisposableCollection();
        toDispose.push(disposable_1.Disposable.create(() => this.editors.delete(editor.viewType)));
        const editorOpenHandler = new custom_editor_opener_1.CustomEditorOpener(editor, this.shell, this.widgetManager);
        toDispose.push(this.defaultOpenerService.addHandler(editorOpenHandler));
        const openWithCommand = browser_1.WorkspaceCommands.FILE_OPEN_WITH(editorOpenHandler);
        toDispose.push(this.menuModelRegistry.registerMenuAction(navigator_contribution_1.NavigatorContextMenu.OPEN_WITH, {
            commandId: openWithCommand.id,
            label: editorOpenHandler.label
        }));
        toDispose.push(this.commandRegistry.registerCommand(openWithCommand, uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, {
            execute: uri => editorOpenHandler.open(uri),
            isEnabled: uri => editorOpenHandler.canHandle(uri) > 0,
            isVisible: uri => editorOpenHandler.canHandle(uri) > 0
        })));
        toDispose.push(editorOpenHandler.onDidOpenCustomEditor(event => this.resolveWidget(event[0], event[1])));
        return toDispose;
    }
    registerResolver(viewType, resolver) {
        if (this.resolvers.has(viewType)) {
            throw new Error(`Resolver for ${viewType} already registered`);
        }
        for (const editorWidget of this.pendingEditors) {
            if (editorWidget.viewType === viewType) {
                resolver(editorWidget);
                this.pendingEditors.delete(editorWidget);
            }
        }
        this.resolvers.set(viewType, resolver);
        return disposable_1.Disposable.create(() => this.resolvers.delete(viewType));
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.DefaultOpenerService),
    __metadata("design:type", browser_2.DefaultOpenerService)
], PluginCustomEditorRegistry.prototype, "defaultOpenerService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MenuModelRegistry),
    __metadata("design:type", core_1.MenuModelRegistry)
], PluginCustomEditorRegistry.prototype, "menuModelRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], PluginCustomEditorRegistry.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], PluginCustomEditorRegistry.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WidgetManager),
    __metadata("design:type", browser_2.WidgetManager)
], PluginCustomEditorRegistry.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.ApplicationShell),
    __metadata("design:type", browser_2.ApplicationShell)
], PluginCustomEditorRegistry.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginCustomEditorRegistry.prototype, "init", null);
PluginCustomEditorRegistry = __decorate([
    (0, inversify_1.injectable)()
], PluginCustomEditorRegistry);
exports.PluginCustomEditorRegistry = PluginCustomEditorRegistry;
//# sourceMappingURL=plugin-custom-editor-registry.js.map