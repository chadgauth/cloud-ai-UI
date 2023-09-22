"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.EditorPreviewTreeDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const browser_1 = require("@theia/core/lib/browser");
const navigator_open_editors_tree_model_1 = require("@theia/navigator/lib/browser/open-editors-widget/navigator-open-editors-tree-model");
const editor_preview_widget_1 = require("./editor-preview-widget");
const editor_preview_manager_1 = require("./editor-preview-manager");
let EditorPreviewTreeDecorator = class EditorPreviewTreeDecorator {
    constructor() {
        this.id = 'theia-open-editors-file-decorator';
        this.decorationsMap = new Map();
        this.decorationsChangedEmitter = new event_1.Emitter();
        this.onDidChangeDecorations = this.decorationsChangedEmitter.event;
        this.toDisposeOnDirtyChanged = new Map();
        this.toDisposeOnPreviewPinned = new Map();
    }
    onDidInitializeLayout(app) {
        this.shell.onDidAddWidget(widget => this.registerEditorListeners(widget));
        this.shell.onDidRemoveWidget(widget => this.unregisterEditorListeners(widget));
        this.editorWidgets.forEach(widget => this.registerEditorListeners(widget));
    }
    registerEditorListeners(widget) {
        const saveable = browser_1.Saveable.get(widget);
        if (saveable) {
            this.toDisposeOnDirtyChanged.set(widget.id, saveable.onDirtyChanged(() => {
                this.fireDidChangeDecorations((tree) => this.collectDecorators(tree));
            }));
        }
        if (widget instanceof editor_preview_widget_1.EditorPreviewWidget) {
            this.toDisposeOnPreviewPinned.set(widget.id, widget.onDidChangePreviewState(() => {
                var _a;
                this.fireDidChangeDecorations((tree) => this.collectDecorators(tree));
                (_a = this.toDisposeOnPreviewPinned.get(widget.id)) === null || _a === void 0 ? void 0 : _a.dispose();
                this.toDisposeOnDirtyChanged.delete(widget.id);
            }));
        }
    }
    unregisterEditorListeners(widget) {
        var _a, _b;
        (_a = this.toDisposeOnDirtyChanged.get(widget.id)) === null || _a === void 0 ? void 0 : _a.dispose();
        this.toDisposeOnDirtyChanged.delete(widget.id);
        (_b = this.toDisposeOnPreviewPinned.get(widget.id)) === null || _b === void 0 ? void 0 : _b.dispose();
        this.toDisposeOnPreviewPinned.delete(widget.id);
    }
    get editorWidgets() {
        return this.shell.widgets.filter((widget) => browser_1.NavigatableWidget.is(widget));
    }
    fireDidChangeDecorations(event) {
        this.decorationsChangedEmitter.fire(event);
    }
    decorations(tree) {
        return this.collectDecorators(tree);
    }
    // Add workspace root as caption suffix and italicize if PreviewWidget
    collectDecorators(tree) {
        const result = new Map();
        if (tree.root === undefined) {
            return result;
        }
        for (const node of new browser_1.DepthFirstTreeIterator(tree.root)) {
            if (navigator_open_editors_tree_model_1.OpenEditorNode.is(node)) {
                const { widget } = node;
                const isPreviewWidget = widget instanceof editor_preview_widget_1.EditorPreviewWidget && widget.isPreview;
                const decorations = {
                    fontData: { style: isPreviewWidget ? 'italic' : undefined }
                };
                result.set(node.id, decorations);
            }
        }
        return result;
    }
};
__decorate([
    (0, inversify_1.inject)(editor_preview_manager_1.EditorPreviewManager),
    __metadata("design:type", editor_preview_manager_1.EditorPreviewManager)
], EditorPreviewTreeDecorator.prototype, "editorPreviewManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], EditorPreviewTreeDecorator.prototype, "shell", void 0);
EditorPreviewTreeDecorator = __decorate([
    (0, inversify_1.injectable)()
], EditorPreviewTreeDecorator);
exports.EditorPreviewTreeDecorator = EditorPreviewTreeDecorator;
//# sourceMappingURL=editor-preview-tree-decorator.js.map