"use strict";
// *****************************************************************************
// Copyright (C) 2018-2019 Red Hat, Inc. and others.
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
exports.TreeViewWidget = exports.PluginTreeModel = exports.PluginTree = exports.TreeViewWidgetOptions = exports.CompositeTreeViewNode = exports.ResolvableCompositeTreeViewNode = exports.ResolvableTreeViewNode = exports.TreeViewNode = exports.VIEW_ITEM_INLINE_MENU = exports.VIEW_ITEM_CONTEXT_MENU = exports.TREE_NODE_HYPERLINK = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const browser_1 = require("@theia/core/lib/browser");
const menu_1 = require("@theia/core/lib/common/menu");
const React = require("@theia/core/shared/react");
const plugin_shared_style_1 = require("../plugin-shared-style");
const widget_1 = require("@theia/core/lib/browser/widgets/widget");
const event_1 = require("@theia/core/lib/common/event");
const message_service_1 = require("@theia/core/lib/common/message-service");
const uri_1 = require("@theia/core/lib/common/uri");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const markdown_rendering_1 = require("@theia/core/lib/common/markdown-rendering");
const label_parser_1 = require("@theia/core/lib/browser/label-parser");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
const tree_decorator_1 = require("@theia/core/lib/browser/tree/tree-decorator");
const common_1 = require("@theia/core/lib/common");
const types_1 = require("../../../common/types");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const dnd_file_content_store_1 = require("./dnd-file-content-store");
exports.TREE_NODE_HYPERLINK = 'theia-TreeNodeHyperlink';
exports.VIEW_ITEM_CONTEXT_MENU = ['view-item-context-menu'];
exports.VIEW_ITEM_INLINE_MENU = ['view-item-context-menu', 'inline'];
var TreeViewNode;
(function (TreeViewNode) {
    function is(arg) {
        return !!arg && browser_1.SelectableTreeNode.is(arg) && tree_decorator_1.DecoratedTreeNode.is(arg);
    }
    TreeViewNode.is = is;
})(TreeViewNode = exports.TreeViewNode || (exports.TreeViewNode = {}));
class ResolvableTreeViewNode {
    constructor(treeViewNode, resolve) {
        this._resolved = false;
        (0, types_1.mixin)(this, treeViewNode);
        this.resolve = async (token) => {
            var _a, _b;
            if (this.resolving) {
                return this.resolving.promise;
            }
            if (!this._resolved) {
                this.resolving = new promise_util_1.Deferred();
                const resolvedTreeItem = await resolve(token);
                if (resolvedTreeItem) {
                    this.command = (_a = this.command) !== null && _a !== void 0 ? _a : resolvedTreeItem.command;
                    this.tooltip = (_b = this.tooltip) !== null && _b !== void 0 ? _b : resolvedTreeItem.tooltip;
                }
                this.resolving.resolve();
                this.resolving = undefined;
            }
            if (!token.isCancellationRequested) {
                this._resolved = true;
            }
        };
    }
    reset() {
        this._resolved = false;
        this.resolving = undefined;
        this.command = undefined;
        this.tooltip = undefined;
    }
    get resolved() {
        return this._resolved;
    }
}
exports.ResolvableTreeViewNode = ResolvableTreeViewNode;
class ResolvableCompositeTreeViewNode extends ResolvableTreeViewNode {
    constructor(treeViewNode, resolve) {
        super(treeViewNode, resolve);
        this.expanded = treeViewNode.expanded;
        this.children = treeViewNode.children;
    }
}
exports.ResolvableCompositeTreeViewNode = ResolvableCompositeTreeViewNode;
var CompositeTreeViewNode;
(function (CompositeTreeViewNode) {
    function is(arg) {
        return TreeViewNode.is(arg) && browser_1.ExpandableTreeNode.is(arg) && browser_1.CompositeTreeNode.is(arg);
    }
    CompositeTreeViewNode.is = is;
})(CompositeTreeViewNode = exports.CompositeTreeViewNode || (exports.CompositeTreeViewNode = {}));
let TreeViewWidgetOptions = class TreeViewWidgetOptions {
};
TreeViewWidgetOptions = __decorate([
    (0, inversify_1.injectable)()
], TreeViewWidgetOptions);
exports.TreeViewWidgetOptions = TreeViewWidgetOptions;
let PluginTree = class PluginTree extends browser_1.TreeImpl {
    constructor() {
        super(...arguments);
        this.onDidChangeWelcomeStateEmitter = new event_1.Emitter();
        this.onDidChangeWelcomeState = this.onDidChangeWelcomeStateEmitter.event;
        this._hasTreeItemResolve = Promise.resolve(false);
    }
    set proxy(proxy) {
        this._proxy = proxy;
        if (proxy) {
            this._hasTreeItemResolve = proxy.$hasResolveTreeItem(this.options.id);
        }
        else {
            this._hasTreeItemResolve = Promise.resolve(false);
        }
    }
    get proxy() {
        return this._proxy;
    }
    get hasTreeItemResolve() {
        return this._hasTreeItemResolve;
    }
    set viewInfo(viewInfo) {
        this._viewInfo = viewInfo;
    }
    get isEmpty() {
        return this._isEmpty;
    }
    async resolveChildren(parent) {
        if (!this._proxy) {
            return super.resolveChildren(parent);
        }
        const children = await this.fetchChildren(this._proxy, parent);
        const hasResolve = await this.hasTreeItemResolve;
        return children.map(value => hasResolve ? this.createResolvableTreeNode(value, parent) : this.createTreeNode(value, parent));
    }
    async fetchChildren(proxy, parent) {
        try {
            const children = await proxy.$getChildren(this.options.id, parent.id);
            const oldEmpty = this._isEmpty;
            this._isEmpty = !parent.id && (!children || children.length === 0);
            if (oldEmpty !== this._isEmpty) {
                this.onDidChangeWelcomeStateEmitter.fire();
            }
            return children || [];
        }
        catch (e) {
            if (e) {
                console.error(`Failed to fetch children for '${this.options.id}'`, e);
                const label = this._viewInfo ? this._viewInfo.name : this.options.id;
                this.notification.error(`${label}: ${e.message}`);
            }
            return [];
        }
    }
    createTreeNode(item, parent) {
        const update = this.createTreeNodeUpdate(item);
        const node = this.getNode(item.id);
        if (item.collapsibleState !== undefined && item.collapsibleState !== plugin_api_rpc_1.TreeViewItemCollapsibleState.None) {
            if (CompositeTreeViewNode.is(node)) {
                return Object.assign(node, update);
            }
            return Object.assign({
                id: item.id,
                parent,
                visible: true,
                selected: false,
                expanded: plugin_api_rpc_1.TreeViewItemCollapsibleState.Expanded === item.collapsibleState,
                children: [],
                command: item.command
            }, update);
        }
        if (TreeViewNode.is(node) && !browser_1.ExpandableTreeNode.is(node)) {
            return Object.assign(node, update, { command: item.command });
        }
        return Object.assign({
            id: item.id,
            parent,
            visible: true,
            selected: false,
            command: item.command,
        }, update);
    }
    markAsChecked(node, checked) {
        var _a;
        function findParentsToChange(child, nodes) {
            var _a;
            if ((((_a = child.parent) === null || _a === void 0 ? void 0 : _a.checkboxInfo) !== undefined && child.parent.checkboxInfo.checked !== checked) &&
                (!checked || !child.parent.children.some(candidate => { var _a; return candidate !== child && ((_a = candidate.checkboxInfo) === null || _a === void 0 ? void 0 : _a.checked) === false; }))) {
                nodes.push(child.parent);
                findParentsToChange(child.parent, nodes);
            }
        }
        function findChildrenToChange(parent, nodes) {
            if (browser_1.CompositeTreeNode.is(parent)) {
                parent.children.forEach(child => {
                    if (child.checkboxInfo !== undefined && child.checkboxInfo.checked !== checked) {
                        nodes.push(child);
                    }
                    findChildrenToChange(child, nodes);
                });
            }
        }
        const nodesToChange = [node];
        if (!this.options.manageCheckboxStateManually) {
            findParentsToChange(node, nodesToChange);
            findChildrenToChange(node, nodesToChange);
        }
        nodesToChange.forEach(n => n.checkboxInfo.checked = checked);
        this.onDidUpdateEmitter.fire(nodesToChange);
        (_a = this.proxy) === null || _a === void 0 ? void 0 : _a.$checkStateChanged(this.options.id, [{ id: node.id, checked: checked }]);
    }
    /** Creates a resolvable tree node. If a node already exists, reset it because the underlying TreeViewItem might have been disposed in the backend. */
    createResolvableTreeNode(item, parent) {
        const update = this.createTreeNodeUpdate(item);
        const node = this.getNode(item.id);
        // Node is a composite node that might contain children
        if (item.collapsibleState !== undefined && item.collapsibleState !== plugin_api_rpc_1.TreeViewItemCollapsibleState.None) {
            // Reuse existing composite node and reset it
            if (node instanceof ResolvableCompositeTreeViewNode) {
                node.reset();
                return Object.assign(node, update);
            }
            // Create new composite node
            const compositeNode = Object.assign({
                id: item.id,
                parent,
                visible: true,
                selected: false,
                expanded: plugin_api_rpc_1.TreeViewItemCollapsibleState.Expanded === item.collapsibleState,
                children: [],
                command: item.command
            }, update);
            return new ResolvableCompositeTreeViewNode(compositeNode, async (token) => { var _a; return (_a = this._proxy) === null || _a === void 0 ? void 0 : _a.$resolveTreeItem(this.options.id, item.id, token); });
        }
        // Node is a leaf
        // Reuse existing node and reset it.
        if (node instanceof ResolvableTreeViewNode && !browser_1.ExpandableTreeNode.is(node)) {
            node.reset();
            return Object.assign(node, update);
        }
        const treeNode = Object.assign({
            id: item.id,
            parent,
            visible: true,
            selected: false,
            command: item.command,
        }, update);
        return new ResolvableTreeViewNode(treeNode, async (token) => { var _a; return (_a = this._proxy) === null || _a === void 0 ? void 0 : _a.$resolveTreeItem(this.options.id, item.id, token); });
    }
    createTreeNodeUpdate(item) {
        const decorationData = this.toDecorationData(item);
        const icon = this.toIconClass(item);
        const resourceUri = item.resourceUri && uri_1.URI.fromComponents(item.resourceUri).toString();
        const themeIcon = item.themeIcon ? item.themeIcon : item.collapsibleState !== plugin_api_rpc_1.TreeViewItemCollapsibleState.None ? { id: 'folder' } : undefined;
        return {
            name: item.label,
            decorationData,
            icon,
            description: item.description,
            themeIcon,
            resourceUri,
            tooltip: item.tooltip,
            contextValue: item.contextValue,
            command: item.command,
            checkboxInfo: item.checkboxInfo,
            accessibilityInformation: item.accessibilityInformation,
        };
    }
    toDecorationData(item) {
        let decoration = {};
        if (item.highlights) {
            const highlight = {
                ranges: item.highlights.map(h => ({ offset: h[0], length: h[1] - h[0] }))
            };
            decoration = { highlight };
        }
        return decoration;
    }
    toIconClass(item) {
        if (item.icon) {
            return 'fa ' + item.icon;
        }
        if (item.iconUrl) {
            const reference = this.sharedStyle.toIconClass(item.iconUrl);
            this.toDispose.push(reference);
            return reference.object.iconClass;
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], PluginTree.prototype, "sharedStyle", void 0);
__decorate([
    (0, inversify_1.inject)(TreeViewWidgetOptions),
    __metadata("design:type", TreeViewWidgetOptions)
], PluginTree.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], PluginTree.prototype, "notification", void 0);
PluginTree = __decorate([
    (0, inversify_1.injectable)()
], PluginTree);
exports.PluginTree = PluginTree;
let PluginTreeModel = class PluginTreeModel extends browser_1.TreeModelImpl {
    set proxy(proxy) {
        this.tree.proxy = proxy;
    }
    get proxy() {
        return this.tree.proxy;
    }
    get hasTreeItemResolve() {
        return this.tree.hasTreeItemResolve;
    }
    set viewInfo(viewInfo) {
        this.tree.viewInfo = viewInfo;
    }
    get isTreeEmpty() {
        return this.tree.isEmpty;
    }
    get onDidChangeWelcomeState() {
        return this.tree.onDidChangeWelcomeState;
    }
    doOpenNode(node) {
        super.doOpenNode(node);
        if (node instanceof ResolvableTreeViewNode) {
            node.resolve(common_1.CancellationToken.None);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(PluginTree),
    __metadata("design:type", PluginTree)
], PluginTreeModel.prototype, "tree", void 0);
PluginTreeModel = __decorate([
    (0, inversify_1.injectable)()
], PluginTreeModel);
exports.PluginTreeModel = PluginTreeModel;
let TreeViewWidget = class TreeViewWidget extends browser_1.TreeViewWelcomeWidget {
    constructor() {
        super(...arguments);
        this._contextSelection = false;
        this.expansionTimeouts = new Map();
    }
    init() {
        super.init();
        this.id = this.options.id;
        this.addClass('theia-tree-view');
        this.node.style.height = '100%';
        this.model.onDidChangeWelcomeState(this.update, this);
        this.toDispose.push(this.model.onDidChangeWelcomeState(this.update, this));
        this.toDispose.push(this.onDidChangeVisibilityEmitter);
        this.toDispose.push(this.contextKeyService.onDidChange(() => this.update()));
        this.toDispose.push(this.keybindings.onKeybindingsChanged(() => this.update()));
        this.treeDragType = `application/vnd.code.tree.${this.id.toLowerCase()}`;
    }
    get showCollapseAll() {
        return this.options.showCollapseAll || false;
    }
    renderIcon(node, props) {
        var _a;
        const icon = this.toNodeIcon(node);
        if (icon) {
            let style;
            if (TreeViewNode.is(node) && ((_a = node.themeIcon) === null || _a === void 0 ? void 0 : _a.color)) {
                const color = this.colorRegistry.getCurrentColor(node.themeIcon.color.id);
                if (color) {
                    style = { color };
                }
            }
            return React.createElement("div", { className: icon + ' theia-tree-view-icon', style: style });
        }
        return undefined;
    }
    renderCaption(node, props) {
        const classes = [browser_1.TREE_NODE_SEGMENT_CLASS];
        if (!this.hasTrailingSuffixes(node)) {
            classes.push(browser_1.TREE_NODE_SEGMENT_GROW_CLASS);
        }
        const className = classes.join(' ');
        let attrs = {
            ...this.decorateCaption(node, {}),
            className,
            id: node.id
        };
        if (node.accessibilityInformation) {
            attrs = {
                ...attrs,
                'aria-label': node.accessibilityInformation.label,
                'role': node.accessibilityInformation.role
            };
        }
        if (!node.tooltip && node instanceof ResolvableTreeViewNode) {
            let configuredTip = false;
            let source;
            attrs = {
                ...attrs,
                onMouseLeave: () => source === null || source === void 0 ? void 0 : source.cancel(),
                onMouseEnter: async (event) => {
                    const target = event.currentTarget; // event.currentTarget will be null after awaiting node resolve()
                    if (configuredTip) {
                        if (markdown_rendering_1.MarkdownString.is(node.tooltip)) {
                            this.hoverService.requestHover({
                                content: node.tooltip,
                                target: event.target,
                                position: 'right'
                            });
                        }
                        return;
                    }
                    if (!node.resolved) {
                        source = new common_1.CancellationTokenSource();
                        const token = source.token;
                        await node.resolve(token);
                        if (token.isCancellationRequested) {
                            return;
                        }
                    }
                    if (markdown_rendering_1.MarkdownString.is(node.tooltip)) {
                        this.hoverService.requestHover({
                            content: node.tooltip,
                            target: event.target,
                            position: 'right'
                        });
                    }
                    else {
                        const title = node.tooltip ||
                            (node.resourceUri && this.labelProvider.getLongName(new uri_1.URI(node.resourceUri)))
                            || this.toNodeName(node);
                        target.title = title;
                    }
                    configuredTip = true;
                }
            };
        }
        else if (markdown_rendering_1.MarkdownString.is(node.tooltip)) {
            attrs = {
                ...attrs,
                onMouseEnter: event => {
                    this.hoverService.requestHover({
                        content: node.tooltip,
                        target: event.target,
                        position: 'right'
                    });
                }
            };
        }
        else {
            const title = node.tooltip ||
                (node.resourceUri && this.labelProvider.getLongName(new uri_1.URI(node.resourceUri)))
                || this.toNodeName(node);
            attrs = {
                ...attrs,
                title
            };
        }
        const children = [];
        const caption = this.toNodeName(node);
        const highlight = this.getDecorationData(node, 'highlight')[0];
        if (highlight) {
            children.push(this.toReactNode(caption, highlight));
        }
        const searchHighlight = this.searchHighlights && this.searchHighlights.get(node.id);
        if (searchHighlight) {
            children.push(...this.toReactNode(caption, searchHighlight));
        }
        else if (!highlight) {
            children.push(caption);
        }
        const description = this.toNodeDescription(node);
        if (description) {
            children.push(React.createElement("span", { className: 'theia-tree-view-description' }, description));
        }
        return React.createElement("div", { ...attrs }, ...children);
    }
    createNodeAttributes(node, props) {
        const attrs = super.createNodeAttributes(node, props);
        if (this.options.dragMimeTypes) {
            attrs.onDragStart = event => this.handleDragStartEvent(node, event);
            attrs.onDragEnd = event => this.handleDragEnd(node, event);
            attrs.draggable = true;
        }
        if (this.options.dropMimeTypes) {
            attrs.onDrop = event => this.handleDropEvent(node, event);
            attrs.onDragEnter = event => this.handleDragEnter(node, event);
            attrs.onDragLeave = event => this.handleDragLeave(node, event);
            attrs.onDragOver = event => this.handleDragOver(event);
        }
        return attrs;
    }
    handleDragLeave(node, event) {
        const timeout = this.expansionTimeouts.get(node.id);
        if (typeof timeout !== 'undefined') {
            console.debug(`dragleave ${node.id} canceling timeout`);
            clearTimeout(timeout);
            this.expansionTimeouts.delete(node.id);
        }
    }
    handleDragEnter(node, event) {
        console.debug(`dragenter ${node.id}`);
        if (browser_1.ExpandableTreeNode.is(node)) {
            console.debug(`dragenter ${node.id} starting timeout`);
            this.expansionTimeouts.set(node.id, window.setTimeout(() => {
                console.debug(`dragenter ${node.id} timeout reached`);
                this.model.expandNode(node);
            }, 500));
        }
    }
    createContainerAttributes() {
        const attrs = super.createContainerAttributes();
        if (this.options.dropMimeTypes) {
            attrs.onDrop = event => this.handleDropEvent(undefined, event);
            attrs.onDragOver = event => this.handleDragOver(event);
        }
        return attrs;
    }
    handleDragStartEvent(node, event) {
        event.dataTransfer.setData(this.treeDragType, '');
        let selectedNodes = [];
        if (this.model.selectedNodes.find(selected => browser_1.TreeNode.equals(selected, node))) {
            selectedNodes = this.model.selectedNodes.filter(TreeViewNode.is);
        }
        else {
            selectedNodes = [node];
        }
        this.options.dragMimeTypes.forEach(type => {
            if (type === 'text/uri-list') {
                browser_1.ApplicationShell.setDraggedEditorUris(event.dataTransfer, selectedNodes.filter(n => n.resourceUri).map(n => new uri_1.URI(n.resourceUri)));
            }
            else {
                event.dataTransfer.setData(type, '');
            }
        });
        this.model.proxy.$dragStarted(this.options.id, selectedNodes.map(selected => selected.id), common_1.CancellationToken.None).then(maybeUris => {
            if (maybeUris) {
                this.applicationShell.addAdditionalDraggedEditorUris(maybeUris.map(uri_1.URI.fromComponents));
            }
        });
    }
    handleDragEnd(node, event) {
        this.applicationShell.clearAdditionalDraggedEditorUris();
        this.model.proxy.$dragEnd(this.id);
    }
    handleDragOver(event) {
        const hasFiles = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file') {
                    return true;
                }
            }
            return false;
        };
        if (event.dataTransfer) {
            const canDrop = event.dataTransfer.types.some(type => this.options.dropMimeTypes.includes(type)) ||
                event.dataTransfer.types.includes(this.treeDragType) ||
                this.options.dropMimeTypes.includes('files') && hasFiles(event.dataTransfer.items);
            if (canDrop) {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
            }
            else {
                event.dataTransfer.dropEffect = 'none';
            }
            event.stopPropagation();
        }
    }
    handleDropEvent(node, event) {
        var _a;
        if (event.dataTransfer) {
            const items = [];
            let files = [];
            try {
                for (let i = 0; i < event.dataTransfer.items.length; i++) {
                    const transferItem = event.dataTransfer.items[i];
                    if (transferItem.type !== this.treeDragType) {
                        // do not pass the artificial drag data to the extension
                        const f = event.dataTransfer.items[i].getAsFile();
                        if (f) {
                            const fileId = this.dndFileContentStore.addFile(f);
                            files.push(fileId);
                            const uri = f.path ? {
                                scheme: 'file',
                                path: f.path,
                                authority: '',
                                query: '',
                                fragment: ''
                            } : undefined;
                            items.push([transferItem.type, new plugin_api_rpc_1.DataTransferFileDTO(f.name, fileId, uri)]);
                        }
                        else {
                            const textData = event.dataTransfer.getData(transferItem.type);
                            if (textData) {
                                items.push([transferItem.type, textData]);
                            }
                        }
                    }
                }
                if (items.length > 0 || event.dataTransfer.types.includes(this.treeDragType)) {
                    event.preventDefault();
                    event.stopPropagation();
                    (_a = this.model.proxy) === null || _a === void 0 ? void 0 : _a.$drop(this.id, node === null || node === void 0 ? void 0 : node.id, items, common_1.CancellationToken.None).finally(() => {
                        for (const file of files) {
                            this.dndFileContentStore.removeFile(file);
                        }
                    });
                    files = [];
                }
            }
            catch (e) {
                for (const file of files) {
                    this.dndFileContentStore.removeFile(file);
                }
                throw e;
            }
        }
    }
    renderTailDecorations(treeViewNode, props) {
        return this.contextKeys.with({ view: this.id, viewItem: treeViewNode.contextValue }, () => {
            const menu = this.menus.getMenu(exports.VIEW_ITEM_INLINE_MENU);
            const args = this.toContextMenuArgs(treeViewNode);
            const inlineCommands = menu.children.filter((item) => item instanceof menu_1.ActionMenuNode);
            const tailDecorations = super.renderTailDecorations(treeViewNode, props);
            return React.createElement(React.Fragment, null,
                inlineCommands.length > 0 && React.createElement("div", { className: browser_1.TREE_NODE_SEGMENT_CLASS + ' flex' }, inlineCommands.map((item, index) => this.renderInlineCommand(item, index, this.focusService.hasFocus(treeViewNode), args))),
                tailDecorations !== undefined && React.createElement("div", { className: browser_1.TREE_NODE_SEGMENT_CLASS + ' flex' }, tailDecorations));
        });
    }
    toTreeViewItemReference(treeNode) {
        return { viewId: this.id, itemId: treeNode.id };
    }
    resolveKeybindingForCommand(command) {
        let result = '';
        if (command) {
            const bindings = this.keybindings.getKeybindingsForCommand(command);
            let found = false;
            if (bindings && bindings.length > 0) {
                bindings.forEach(binding => {
                    if (!found && this.keybindings.isEnabledInScope(binding, this.node)) {
                        found = true;
                        result = ` (${this.keybindings.acceleratorFor(binding, '+')})`;
                    }
                });
            }
        }
        return result;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderInlineCommand(actionMenuNode, index, tabbable, args) {
        if (!actionMenuNode.icon || !this.commands.isVisible(actionMenuNode.command, ...args) || !actionMenuNode.when || !this.contextKeys.match(actionMenuNode.when)) {
            return false;
        }
        const className = [browser_1.TREE_NODE_SEGMENT_CLASS, browser_1.TREE_NODE_TAIL_CLASS, actionMenuNode.icon, widget_1.ACTION_ITEM, 'theia-tree-view-inline-action'].join(' ');
        const tabIndex = tabbable ? 0 : undefined;
        const titleString = actionMenuNode.label + this.resolveKeybindingForCommand(actionMenuNode.command);
        return React.createElement("div", { key: index, className: className, title: titleString, tabIndex: tabIndex, onClick: e => {
                e.stopPropagation();
                this.commands.executeCommand(actionMenuNode.command, ...args);
            } });
    }
    toContextMenuArgs(target) {
        if (this.options.multiSelect) {
            return [this.toTreeViewItemReference(target), this.model.selectedNodes.map(node => this.toTreeViewItemReference(node))];
        }
        else {
            return [this.toTreeViewItemReference(target)];
        }
    }
    setFlag(flag) {
        super.setFlag(flag);
        if (flag === widget_1.Widget.Flag.IsVisible) {
            this.onDidChangeVisibilityEmitter.fire(this.isVisible);
        }
    }
    clearFlag(flag) {
        super.clearFlag(flag);
        if (flag === widget_1.Widget.Flag.IsVisible) {
            this.onDidChangeVisibilityEmitter.fire(this.isVisible);
        }
    }
    handleEnter(event) {
        super.handleEnter(event);
        this.tryExecuteCommand();
    }
    tapNode(node) {
        super.tapNode(node);
        this.findCommands(node).then(commandMap => {
            if (commandMap.size > 0) {
                this.tryExecuteCommandMap(commandMap);
            }
            else if (node && this.isExpandable(node)) {
                this.model.toggleNodeExpansion(node);
            }
        });
    }
    // execute TreeItem.command if present
    async tryExecuteCommand(node) {
        this.tryExecuteCommandMap(await this.findCommands(node));
    }
    tryExecuteCommandMap(commandMap) {
        commandMap.forEach((args, commandId) => {
            this.commands.executeCommand(commandId, ...args);
        });
    }
    async findCommands(node) {
        const commandMap = new Map();
        const treeNodes = (node ? [node] : this.model.selectedNodes);
        if (await this.model.hasTreeItemResolve) {
            const cancellationToken = new common_1.CancellationTokenSource().token;
            // Resolve all resolvable nodes that don't have a command and haven't been resolved.
            const allResolved = Promise.all(treeNodes.map(maybeNeedsResolve => {
                if (!maybeNeedsResolve.command && maybeNeedsResolve instanceof ResolvableTreeViewNode && !maybeNeedsResolve.resolved) {
                    return maybeNeedsResolve.resolve(cancellationToken).catch(err => {
                        console.error(`Failed to resolve tree item '${maybeNeedsResolve.id}'`, err);
                    });
                }
                return Promise.resolve(maybeNeedsResolve);
            }));
            // Only need to wait but don't need the values because tree items are resolved in place.
            await allResolved;
        }
        for (const treeNode of treeNodes) {
            if (treeNode && treeNode.command) {
                commandMap.set(treeNode.command.id, treeNode.command.arguments || []);
            }
        }
        return commandMap;
    }
    get message() {
        return this._message;
    }
    set message(message) {
        this._message = message;
        this.update();
    }
    render() {
        return React.createElement('div', this.createContainerAttributes(), this.renderSearchInfo(), this.renderTree(this.model));
    }
    renderSearchInfo() {
        if (this._message) {
            return React.createElement("div", { className: 'theia-TreeViewInfo' }, this._message);
        }
        return undefined;
    }
    shouldShowWelcomeView() {
        return (this.model.proxy === undefined || this.model.isTreeEmpty) && this.message === undefined;
    }
    handleContextMenuEvent(node, event) {
        if (browser_1.SelectableTreeNode.is(node)) {
            // Keep the selection for the context menu, if the widget support multi-selection and the right click happens on an already selected node.
            if (!this.props.multiSelect || !node.selected) {
                const type = !!this.props.multiSelect && this.hasCtrlCmdMask(event) ? browser_1.TreeSelection.SelectionType.TOGGLE : browser_1.TreeSelection.SelectionType.DEFAULT;
                this.model.addSelection({ node, type });
            }
            this.focusService.setFocus(node);
            const contextMenuPath = this.props.contextMenuPath;
            if (contextMenuPath) {
                const { x, y } = event.nativeEvent;
                const args = this.toContextMenuArgs(node);
                const contextKeyService = this.contextKeyService.createOverlay([
                    ['viewItem', (TreeViewNode.is(node) && node.contextValue) || undefined],
                    ['view', this.options.id]
                ]);
                setTimeout(() => this.contextMenuRenderer.render({
                    menuPath: contextMenuPath,
                    anchor: { x, y },
                    args,
                    contextKeyService,
                    onHide: () => contextKeyService.dispose(),
                }), 10);
            }
        }
        event.stopPropagation();
        event.preventDefault();
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], TreeViewWidget.prototype, "applicationShell", void 0);
__decorate([
    (0, inversify_1.inject)(menu_1.MenuModelRegistry),
    __metadata("design:type", menu_1.MenuModelRegistry)
], TreeViewWidget.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], TreeViewWidget.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TreeViewWidget.prototype, "contextKeys", void 0);
__decorate([
    (0, inversify_1.inject)(TreeViewWidgetOptions),
    __metadata("design:type", TreeViewWidgetOptions)
], TreeViewWidget.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(PluginTreeModel),
    __metadata("design:type", PluginTreeModel)
], TreeViewWidget.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TreeViewWidget.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.HoverService),
    __metadata("design:type", browser_1.HoverService)
], TreeViewWidget.prototype, "hoverService", void 0);
__decorate([
    (0, inversify_1.inject)(label_parser_1.LabelParser),
    __metadata("design:type", label_parser_1.LabelParser)
], TreeViewWidget.prototype, "labelParser", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], TreeViewWidget.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(dnd_file_content_store_1.DnDFileContentStore),
    __metadata("design:type", dnd_file_content_store_1.DnDFileContentStore)
], TreeViewWidget.prototype, "dndFileContentStore", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeViewWidget.prototype, "init", null);
TreeViewWidget = __decorate([
    (0, inversify_1.injectable)()
], TreeViewWidget);
exports.TreeViewWidget = TreeViewWidget;
//# sourceMappingURL=tree-view-widget.js.map