"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeViewsExtImpl = void 0;
// TODO: extract `@theia/util` for event, disposable, cancellation and common types
// don't use @theia/core directly from plugin host
const event_1 = require("@theia/core/lib/common/event");
const paths_1 = require("@theia/core/lib/common/paths");
const disposable_1 = require("@theia/core/lib/common/disposable");
const types_impl_1 = require("../types-impl");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const common_1 = require("../../common");
const plugin_icon_path_1 = require("../plugin-icon-path");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const core_1 = require("@theia/core");
class TreeViewsExtImpl {
    constructor(rpc, commandRegistry) {
        this.commandRegistry = commandRegistry;
        this.treeViews = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TREE_VIEWS_MAIN);
        commandRegistry.registerArgumentProcessor({
            processArgument: arg => {
                if (common_1.TreeViewItemReference.is(arg)) {
                    return this.toTreeElement(arg);
                }
                else if (Array.isArray(arg)) {
                    return arg.map(param => common_1.TreeViewItemReference.is(param) ? this.toTreeElement(param) : param);
                }
                else {
                    return arg;
                }
            }
        });
    }
    $checkStateChanged(treeViewId, itemIds) {
        return this.getTreeView(treeViewId).checkStateChanged(itemIds);
    }
    $dragStarted(treeViewId, treeItemIds, token) {
        return this.getTreeView(treeViewId).onDragStarted(treeItemIds, token);
    }
    $dragEnd(treeViewId) {
        return this.getTreeView(treeViewId).dragEnd();
    }
    $drop(treeViewId, treeItemId, dataTransferItems, token) {
        return this.getTreeView(treeViewId).handleDrop(treeItemId, dataTransferItems, token);
    }
    toTreeElement(treeViewItemRef) {
        var _a;
        return (_a = this.treeViews.get(treeViewItemRef.viewId)) === null || _a === void 0 ? void 0 : _a.getElement(treeViewItemRef.itemId);
    }
    registerTreeDataProvider(plugin, treeViewId, treeDataProvider) {
        const treeView = this.createTreeView(plugin, treeViewId, { treeDataProvider });
        return types_impl_1.Disposable.create(() => {
            this.treeViews.delete(treeViewId);
            treeView.dispose();
        });
    }
    createTreeView(plugin, treeViewId, options) {
        if (!options || !options.treeDataProvider) {
            throw new Error('Options with treeDataProvider is mandatory');
        }
        const treeView = new TreeViewExtImpl(plugin, treeViewId, options, this.proxy, this.commandRegistry.converter);
        this.treeViews.set(treeViewId, treeView);
        return {
            // tslint:disable:typedef
            get onDidExpandElement() {
                return treeView.onDidExpandElement;
            },
            get onDidCollapseElement() {
                return treeView.onDidCollapseElement;
            },
            get selection() {
                return treeView.selectedElements;
            },
            get onDidChangeSelection() {
                return treeView.onDidChangeSelection;
            },
            get visible() {
                return treeView.visible;
            },
            get onDidChangeVisibility() {
                return treeView.onDidChangeVisibility;
            },
            get onDidChangeCheckboxState() {
                return treeView.onDidChangeCheckboxState;
            },
            get message() {
                return treeView.message;
            },
            set message(message) {
                treeView.message = message;
            },
            get title() {
                return treeView.title;
            },
            set title(title) {
                treeView.title = title;
            },
            get description() {
                return treeView.description;
            },
            set description(description) {
                treeView.description = description;
            },
            get badge() {
                return treeView.badge;
            },
            set badge(badge) {
                treeView.badge = badge;
            },
            reveal: (element, revealOptions) => treeView.reveal(element, revealOptions),
            dispose: () => {
                this.treeViews.delete(treeViewId);
                treeView.dispose();
            }
        };
    }
    async $getChildren(treeViewId, treeItemId) {
        const treeView = this.getTreeView(treeViewId);
        return treeView.getChildren(treeItemId);
    }
    async $resolveTreeItem(treeViewId, treeItemId, token) {
        return this.getTreeView(treeViewId).resolveTreeItem(treeItemId, token);
    }
    async $hasResolveTreeItem(treeViewId) {
        return this.getTreeView(treeViewId).hasResolveTreeItem();
    }
    async $setExpanded(treeViewId, treeItemId, expanded) {
        const treeView = this.getTreeView(treeViewId);
        if (expanded) {
            return treeView.onExpanded(treeItemId);
        }
        else {
            return treeView.onCollapsed(treeItemId);
        }
    }
    async $setSelection(treeViewId, treeItemIds) {
        this.getTreeView(treeViewId).setSelection(treeItemIds);
    }
    async $setVisible(treeViewId, isVisible) {
        this.getTreeView(treeViewId).setVisible(isVisible);
    }
    getTreeView(treeViewId) {
        const treeView = this.treeViews.get(treeViewId);
        if (!treeView) {
            throw new Error(`No tree view with id '${treeViewId}' registered.`);
        }
        return treeView;
    }
}
exports.TreeViewsExtImpl = TreeViewsExtImpl;
class TreeViewExtImpl {
    constructor(plugin, treeViewId, options, proxy, commandsConverter) {
        var _a, _b, _c, _d, _e, _f;
        this.plugin = plugin;
        this.treeViewId = treeViewId;
        this.options = options;
        this.proxy = proxy;
        this.commandsConverter = commandsConverter;
        this.onDidExpandElementEmitter = new event_1.Emitter();
        this.onDidExpandElement = this.onDidExpandElementEmitter.event;
        this.onDidCollapseElementEmitter = new event_1.Emitter();
        this.onDidCollapseElement = this.onDidCollapseElementEmitter.event;
        this.onDidChangeSelectionEmitter = new event_1.Emitter();
        this.onDidChangeSelection = this.onDidChangeSelectionEmitter.event;
        this.onDidChangeVisibilityEmitter = new event_1.Emitter();
        this.onDidChangeVisibility = this.onDidChangeVisibilityEmitter.event;
        this.onDidChangeCheckboxStateEmitter = new event_1.Emitter();
        this.onDidChangeCheckboxState = this.onDidChangeCheckboxStateEmitter.event;
        this.nodes = new Map();
        this.pendingRefresh = Promise.resolve();
        this.localDataTransfer = new types_impl_1.DataTransfer();
        this.toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => this.clearAll()), this.onDidExpandElementEmitter, this.onDidCollapseElementEmitter, this.onDidChangeSelectionEmitter, this.onDidChangeVisibilityEmitter);
        this._message = '';
        this._title = '';
        this._description = '';
        this._badge = undefined;
        this.selectedItemIds = new Set();
        this._visible = false;
        // make copies of optionally provided MIME types:
        const dragMimeTypes = (_b = (_a = options.dragAndDropController) === null || _a === void 0 ? void 0 : _a.dragMimeTypes) === null || _b === void 0 ? void 0 : _b.slice();
        const dropMimeTypes = (_d = (_c = options.dragAndDropController) === null || _c === void 0 ? void 0 : _c.dropMimeTypes) === null || _d === void 0 ? void 0 : _d.slice();
        proxy.$registerTreeDataProvider(treeViewId, {
            manageCheckboxStateManually: options.manageCheckboxStateManually,
            showCollapseAll: options.showCollapseAll,
            canSelectMany: options.canSelectMany,
            dragMimeTypes, dropMimeTypes
        });
        this.toDispose.push(disposable_1.Disposable.create(() => this.proxy.$unregisterTreeDataProvider(treeViewId)));
        (_f = (_e = options.treeDataProvider).onDidChangeTreeData) === null || _f === void 0 ? void 0 : _f.call(_e, () => {
            this.pendingRefresh = proxy.$refresh(treeViewId);
        });
    }
    dispose() {
        this.toDispose.dispose();
    }
    async reveal(element, options) {
        await this.pendingRefresh;
        const select = (options === null || options === void 0 ? void 0 : options.select) !== false; // default to true
        const focus = !!(options === null || options === void 0 ? void 0 : options.focus);
        const expand = typeof (options === null || options === void 0 ? void 0 : options.expand) === 'undefined' ? false : options.expand;
        const elementParentChain = await this.calculateRevealParentChain(element);
        if (elementParentChain) {
            return this.proxy.$reveal(this.treeViewId, elementParentChain, {
                select, focus, expand, ...options
            });
        }
    }
    get message() {
        return this._message;
    }
    set message(message) {
        this._message = message;
        this.proxy.$setMessage(this.treeViewId, this._message);
    }
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
        this.proxy.$setTitle(this.treeViewId, title);
    }
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
        this.proxy.$setDescription(this.treeViewId, this._description);
    }
    get badge() {
        return this._badge;
    }
    set badge(badge) {
        this._badge = badge;
        this.proxy.$setBadge(this.treeViewId, badge ? { value: badge.value, tooltip: badge.tooltip } : undefined);
    }
    getElement(treeItemId) {
        var _a;
        return (_a = this.nodes.get(treeItemId)) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     * calculate the chain of node ids from root to element so that the frontend can expand all of them and reveal element.
     * this is needed as the frontend may not have the full tree nodes.
     * throughout the parent chain this.getChildren is called in order to fill this.nodes cache.
     *
     * returns undefined if wasn't able to calculate the path due to inconsistencies.
     *
     * @param element element to reveal
     */
    async calculateRevealParentChain(element) {
        var _a, _b, _c;
        if (!element) {
            // root
            return [];
        }
        const parent = (_c = await ((_b = (_a = this.options.treeDataProvider).getParent) === null || _b === void 0 ? void 0 : _b.call(_a, element))) !== null && _c !== void 0 ? _c : undefined;
        const chain = await this.calculateRevealParentChain(parent);
        const parentId = chain.length ? chain[chain.length - 1] : '';
        const treeItem = await this.options.treeDataProvider.getTreeItem(element);
        return chain.concat(this.buildTreeItemId(parentId, treeItem, false));
    }
    getTreeItemLabel(treeItem) {
        const treeItemLabel = treeItem.label;
        return typeof treeItemLabel === 'object' ? treeItemLabel.label : treeItemLabel;
    }
    getTreeItemLabelHighlights(treeItem) {
        const treeItemLabel = treeItem.label;
        return typeof treeItemLabel === 'object' ? treeItemLabel.highlights : undefined;
    }
    getItemLabel(treeItem) {
        let idLabel = this.getTreeItemLabel(treeItem);
        // Use resource URI if label is not set
        if (idLabel === undefined && treeItem.resourceUri) {
            idLabel = treeItem.resourceUri.path.toString();
            idLabel = decodeURIComponent(idLabel);
            if (idLabel.indexOf('/') >= 0) {
                idLabel = idLabel.substring(idLabel.lastIndexOf('/') + 1);
            }
        }
        return idLabel;
    }
    // Modeled on https://github.com/microsoft/vscode/blob/main/src/vs/workbench/api/common/extHostTreeViews.ts#L822
    buildTreeItemId(parentId, item, mustReturnNew) {
        var _a;
        if (item.id) {
            return `${TreeViewExtImpl.ID_ITEM}-@-${parentId}-@-${item.id}`;
        }
        const treeItemLabel = this.getItemLabel(item);
        const prefix = `${TreeViewExtImpl.ID_COMPUTED}-@-${parentId || ''}-@-`;
        let elementId = treeItemLabel ? treeItemLabel : item.resourceUri ? (0, paths_1.basename)(item.resourceUri.fsPath) : '';
        elementId = elementId.indexOf('/') !== -1 ? elementId.replace('/', '//') : elementId;
        const childrenNodes = (((_a = this.nodes.get(parentId)) === null || _a === void 0 ? void 0 : _a.children) || []);
        let id;
        let counter = 0;
        do {
            id = `${prefix}/${counter}:${elementId}`;
            if (!mustReturnNew || !this.nodes.has(id) || this.nodes.get(id) === item) {
                // Return first if asked for or
                // Return if handle does not exist or
                // Return if handle is being reused
                break;
            }
            counter++;
        } while (counter <= childrenNodes.length);
        return id;
    }
    async getChildren(parentId) {
        let parentNode = this.nodes.get(parentId);
        const parent = parentNode === null || parentNode === void 0 ? void 0 : parentNode.value;
        if (parentId && !parent) {
            console.error(`No tree item with id '${parentId}' found.`);
            return [];
        }
        this.clearChildren(parentNode);
        // place root in the cache
        if (parentId === '' && !parentNode) {
            const rootNodeDisposables = new disposable_1.DisposableCollection();
            parentNode = { id: '', disposables: rootNodeDisposables, dispose: () => { rootNodeDisposables.dispose(); } };
            this.nodes.set(parentId, parentNode);
        }
        // ask data provider for children for cached element
        const result = await this.options.treeDataProvider.getChildren(parent);
        if (result) {
            const treeItemPromises = result.map(async (value) => {
                var _a;
                // Ask data provider for a tree item for the value
                // Data provider must return theia.TreeItem
                const treeItem = await this.options.treeDataProvider.getTreeItem(value);
                // Convert theia.TreeItem to the TreeViewItem
                const label = this.getItemLabel(treeItem) || '';
                const highlights = this.getTreeItemLabelHighlights(treeItem);
                // Generate the ID
                // ID is used for caching the element
                const id = this.buildTreeItemId(parentId, treeItem, true);
                const toDisposeElement = new disposable_1.DisposableCollection();
                const node = {
                    id,
                    pluginTreeItem: treeItem,
                    value,
                    disposables: toDisposeElement,
                    dispose: () => toDisposeElement.dispose()
                };
                if (parentNode) {
                    const children = parentNode.children || [];
                    children.push(node);
                    parentNode.children = children;
                }
                this.nodes.set(id, node);
                let icon;
                let iconUrl;
                let themeIcon;
                const { iconPath } = treeItem;
                if (typeof iconPath === 'string' && iconPath.indexOf('fa-') !== -1) {
                    icon = iconPath;
                }
                else if (types_impl_1.ThemeIcon.is(iconPath)) {
                    themeIcon = iconPath;
                }
                else {
                    iconUrl = plugin_icon_path_1.PluginIconPath.toUrl(iconPath, this.plugin);
                }
                let checkboxInfo;
                if (treeItem.checkboxState === undefined) {
                    checkboxInfo = undefined;
                }
                else if ((0, core_1.isObject)(treeItem.checkboxState)) {
                    checkboxInfo = {
                        checked: treeItem.checkboxState.state === types_impl_1.TreeItemCheckboxState.Checked,
                        tooltip: treeItem.checkboxState.tooltip,
                        accessibilityInformation: treeItem.accessibilityInformation
                    };
                }
                else {
                    checkboxInfo = {
                        checked: treeItem.checkboxState === types_impl_1.TreeItemCheckboxState.Checked
                    };
                }
                const treeViewItem = {
                    id,
                    label,
                    highlights,
                    icon,
                    iconUrl,
                    themeIcon,
                    description: treeItem.description,
                    resourceUri: treeItem.resourceUri,
                    tooltip: treeItem.tooltip,
                    collapsibleState: (_a = treeItem.collapsibleState) === null || _a === void 0 ? void 0 : _a.valueOf(),
                    checkboxInfo: checkboxInfo,
                    contextValue: treeItem.contextValue,
                    command: this.commandsConverter.toSafeCommand(treeItem.command, toDisposeElement),
                    accessibilityInformation: treeItem.accessibilityInformation
                };
                node.treeViewItem = treeViewItem;
                return treeViewItem;
            });
            return Promise.all(treeItemPromises);
        }
        else {
            return undefined;
        }
    }
    clearChildren(parentNode) {
        if (parentNode) {
            if (parentNode.children) {
                for (const child of parentNode.children) {
                    this.clear(child);
                }
            }
            delete parentNode['children'];
        }
        else {
            this.clearAll();
        }
    }
    clear(node) {
        if (node.children) {
            for (const child of node.children) {
                this.clear(child);
            }
        }
        this.nodes.delete(node.id);
        node.dispose();
    }
    clearAll() {
        this.nodes.forEach(node => node.dispose());
        this.nodes.clear();
    }
    async onExpanded(treeItemId) {
        // get element from a cache
        const cachedElement = this.getElement(treeItemId);
        // fire an event
        if (cachedElement) {
            this.onDidExpandElementEmitter.fire({
                element: cachedElement
            });
        }
    }
    async onCollapsed(treeItemId) {
        // get element from a cache
        const cachedElement = this.getElement(treeItemId);
        // fire an event
        if (cachedElement) {
            this.onDidCollapseElementEmitter.fire({
                element: cachedElement
            });
        }
    }
    async checkStateChanged(items) {
        const transformed = [];
        items.forEach(item => {
            const node = this.nodes.get(item.id);
            if (node) {
                if (node.value) {
                    transformed.push([node.value, item.checked ? types_impl_1.TreeItemCheckboxState.Checked : types_impl_1.TreeItemCheckboxState.Unchecked]);
                }
                if (node.treeViewItem) {
                    node.treeViewItem.checkboxInfo.checked = item.checked;
                }
            }
        });
        this.onDidChangeCheckboxStateEmitter.fire({
            items: transformed
        });
    }
    async resolveTreeItem(treeItemId, token) {
        var _a;
        if (!this.options.treeDataProvider.resolveTreeItem) {
            return undefined;
        }
        const node = this.nodes.get(treeItemId);
        if (node && node.treeViewItem && node.pluginTreeItem && node.value) {
            const resolved = (_a = await this.options.treeDataProvider.resolveTreeItem(node.pluginTreeItem, node.value, token)) !== null && _a !== void 0 ? _a : node.pluginTreeItem;
            node.treeViewItem.command = this.commandsConverter.toSafeCommand(resolved.command, node.disposables);
            node.treeViewItem.tooltip = resolved.tooltip;
            return node.treeViewItem;
        }
        return undefined;
    }
    hasResolveTreeItem() {
        return !!this.options.treeDataProvider.resolveTreeItem;
    }
    get selectedElements() {
        const items = [];
        for (const id of this.selectedItemIds) {
            const item = this.getElement(id);
            if (item) {
                items.push(item);
            }
        }
        return items;
    }
    setSelection(selectedItemIds) {
        const toDelete = new Set(this.selectedItemIds);
        for (const id of selectedItemIds) {
            toDelete.delete(id);
            if (!this.selectedItemIds.has(id)) {
                this.doSetSelection(selectedItemIds);
                return;
            }
        }
        if (toDelete.size) {
            this.doSetSelection(selectedItemIds);
        }
    }
    doSetSelection(selectedItemIts) {
        this.selectedItemIds = new Set(selectedItemIts);
        this.onDidChangeSelectionEmitter.fire(Object.freeze({ selection: this.selectedElements }));
    }
    get visible() {
        return this._visible;
    }
    setVisible(visible) {
        if (visible !== this._visible) {
            this._visible = visible;
            this.onDidChangeVisibilityEmitter.fire(Object.freeze({ visible: this._visible }));
        }
    }
    async onDragStarted(treeItemIds, token) {
        var _a, _b;
        const treeItems = [];
        for (const id of treeItemIds) {
            const item = this.getElement(id);
            if (item) {
                treeItems.push(item);
            }
        }
        if ((_a = this.options.dragAndDropController) === null || _a === void 0 ? void 0 : _a.handleDrag) {
            this.localDataTransfer.clear();
            await this.options.dragAndDropController.handleDrag(treeItems, this.localDataTransfer, token);
            const uriList = await ((_b = this.localDataTransfer.get('text/uri-list')) === null || _b === void 0 ? void 0 : _b.asString());
            if (uriList) {
                return uriList.split('\n').map(str => vscode_uri_1.URI.parse(str));
            }
        }
        return undefined;
    }
    async dragEnd() {
        this.localDataTransfer.clear();
    }
    async handleDrop(treeItemId, dataTransferItems, token) {
        var _a;
        const treeItem = treeItemId ? this.getElement(treeItemId) : undefined;
        const dropTransfer = new types_impl_1.DataTransfer();
        if ((_a = this.options.dragAndDropController) === null || _a === void 0 ? void 0 : _a.handleDrop) {
            this.localDataTransfer.forEach((item, type) => {
                dropTransfer.set(type, item);
            });
            for (const [type, item] of dataTransferItems) {
                // prefer the item the plugin has set in `onDragStarted`;
                if (!dropTransfer.has(type)) {
                    if (typeof item === 'string') {
                        dropTransfer.set(type, new types_impl_1.DataTransferItem(item));
                    }
                    else {
                        const file = {
                            name: item.name,
                            data: () => this.proxy.$readDroppedFile(item.contentId).then(buffer => buffer.buffer),
                            uri: item.uri ? vscode_uri_1.URI.revive(item.uri) : undefined
                        };
                        const fileItem = new class extends types_impl_1.DataTransferItem {
                            asFile() {
                                return file;
                            }
                        }(file);
                        dropTransfer.set(type, fileItem);
                    }
                }
            }
            return this.options.dragAndDropController.handleDrop(treeItem, dropTransfer, token);
        }
    }
}
TreeViewExtImpl.ID_COMPUTED = 'c';
TreeViewExtImpl.ID_ITEM = 'i';
//# sourceMappingURL=tree-views.js.map