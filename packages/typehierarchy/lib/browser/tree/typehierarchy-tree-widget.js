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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TypeHierarchyTreeWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeHierarchyTreeWidget = void 0;
const React = require("@theia/core/shared/react");
const inversify_1 = require("@theia/core/shared/inversify");
const widgets_1 = require("@theia/core/shared/@phosphor/widgets");
const uri_1 = require("@theia/core/lib/common/uri");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const editor_manager_1 = require("@theia/editor/lib/browser/editor-manager");
const context_menu_renderer_1 = require("@theia/core/lib/browser/context-menu-renderer");
const tree_widget_1 = require("@theia/core/lib/browser/tree/tree-widget");
const typehierarchy_tree_model_1 = require("./typehierarchy-tree-model");
const typehierarchy_tree_1 = require("./typehierarchy-tree");
const browser_1 = require("@theia/core/lib/browser");
const nls_1 = require("@theia/core/lib/common/nls");
let TypeHierarchyTreeWidget = TypeHierarchyTreeWidget_1 = class TypeHierarchyTreeWidget extends tree_widget_1.TreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.icons = new Map(Array.from(Object.keys(vscode_languageserver_protocol_1.SymbolKind)).map(key => [vscode_languageserver_protocol_1.SymbolKind[key], key.toLocaleLowerCase()]));
        this.id = TypeHierarchyTreeWidget_1.WIDGET_ID;
        this.title.label = TypeHierarchyTreeWidget_1.WIDGET_LABEL;
        this.title.caption = TypeHierarchyTreeWidget_1.WIDGET_LABEL;
        this.addClass(TypeHierarchyTreeWidget_1.Styles.TYPE_HIERARCHY_TREE_CLASS);
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('type-hierarchy');
        this.toDispose.push(this.model.onSelectionChanged(selection => {
            const node = selection[0];
            if (node) {
                this.openEditor(node, true);
            }
        }));
        this.toDispose.push(this.model.onOpenNode(node => this.openEditor(node)));
    }
    /**
     * Initializes the widget with the new input.
     */
    async initialize(options) {
        await this.model.initialize(options);
    }
    /**
     * See: `TreeWidget#renderIcon`.
     */
    renderIcon(node) {
        if (typehierarchy_tree_1.TypeHierarchyTree.Node.is(node)) {
            return React.createElement("div", { className: 'symbol-icon-center codicon codicon-symbol-' + this.icons.get(node.item.kind) || 'unknown' });
        }
        return undefined;
    }
    /**
     * Opens up the node in the editor. On demand (`keepFocus`) it reveals the location in the editor.
     */
    async openEditor(node, keepFocus = false) {
        if (typehierarchy_tree_1.TypeHierarchyTree.Node.is(node)) {
            const { selectionRange, uri } = node.item;
            const editorWidget = await this.editorManager.open(new uri_1.default(uri), {
                mode: keepFocus ? 'reveal' : 'activate',
                selection: vscode_languageserver_protocol_1.Range.create(selectionRange.start, selectionRange.end)
            });
            if (editorWidget.parent instanceof widgets_1.DockPanel) {
                editorWidget.parent.selectWidget(editorWidget);
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], TypeHierarchyTreeWidget.prototype, "editorManager", void 0);
TypeHierarchyTreeWidget = TypeHierarchyTreeWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tree_widget_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(typehierarchy_tree_model_1.TypeHierarchyTreeModel)),
    __param(2, (0, inversify_1.inject)(context_menu_renderer_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, typehierarchy_tree_model_1.TypeHierarchyTreeModel,
        context_menu_renderer_1.ContextMenuRenderer])
], TypeHierarchyTreeWidget);
exports.TypeHierarchyTreeWidget = TypeHierarchyTreeWidget;
(function (TypeHierarchyTreeWidget) {
    TypeHierarchyTreeWidget.WIDGET_ID = 'theia-typehierarchy';
    TypeHierarchyTreeWidget.WIDGET_LABEL = nls_1.nls.localizeByDefault('Type Hierarchy');
    /**
     * CSS styles for the `Type Hierarchy` widget.
     */
    let Styles;
    (function (Styles) {
        Styles.TYPE_HIERARCHY_TREE_CLASS = 'theia-type-hierarchy-tree';
    })(Styles = TypeHierarchyTreeWidget.Styles || (TypeHierarchyTreeWidget.Styles = {}));
})(TypeHierarchyTreeWidget = exports.TypeHierarchyTreeWidget || (exports.TypeHierarchyTreeWidget = {}));
exports.TypeHierarchyTreeWidget = TypeHierarchyTreeWidget;
//# sourceMappingURL=typehierarchy-tree-widget.js.map