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
exports.TreeViewsMainImpl = void 0;
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const plugin_view_registry_1 = require("./plugin-view-registry");
const browser_1 = require("@theia/core/lib/browser");
const view_context_key_service_1 = require("./view-context-key-service");
const core_1 = require("@theia/core");
const tree_view_widget_1 = require("./tree-view-widget");
const plugin_view_widget_1 = require("./plugin-view-widget");
const buffer_1 = require("@theia/core/lib/common/buffer");
const dnd_file_content_store_1 = require("./dnd-file-content-store");
class TreeViewsMainImpl {
    constructor(rpc, container) {
        this.container = container;
        this.treeViewProviders = new Map();
        this.toDispose = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TREE_VIEWS_EXT);
        this.viewRegistry = container.get(plugin_view_registry_1.PluginViewRegistry);
        this.contextKeys = this.container.get(view_context_key_service_1.ViewContextKeyService);
        this.widgetManager = this.container.get(browser_1.WidgetManager);
        this.fileContentStore = this.container.get(dnd_file_content_store_1.DnDFileContentStore);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $registerTreeDataProvider(treeViewId, $options) {
        this.treeViewProviders.set(treeViewId, this.viewRegistry.registerViewDataProvider(treeViewId, async ({ state, viewInfo }) => {
            const options = {
                id: treeViewId,
                manageCheckboxStateManually: $options.manageCheckboxStateManually,
                showCollapseAll: $options.showCollapseAll,
                multiSelect: $options.canSelectMany,
                dragMimeTypes: $options.dragMimeTypes,
                dropMimeTypes: $options.dropMimeTypes
            };
            const widget = await this.widgetManager.getOrCreateWidget(plugin_view_registry_1.PLUGIN_VIEW_DATA_FACTORY_ID, options);
            widget.model.viewInfo = viewInfo;
            if (state) {
                widget.restoreState(state);
                // ensure that state is completely restored
                await widget.model.refresh();
            }
            else if (!widget.model.root) {
                const root = {
                    id: '',
                    parent: undefined,
                    name: '',
                    visible: false,
                    expanded: true,
                    children: []
                };
                widget.model.root = root;
            }
            if (this.toDispose.disposed) {
                widget.model.proxy = undefined;
            }
            else {
                widget.model.proxy = this.proxy;
                this.toDispose.push(core_1.Disposable.create(() => widget.model.proxy = undefined));
                this.handleTreeEvents(widget.id, widget);
            }
            await widget.model.refresh();
            return widget;
        }));
        this.toDispose.push(core_1.Disposable.create(() => this.$unregisterTreeDataProvider(treeViewId)));
    }
    async $unregisterTreeDataProvider(treeViewId) {
        const treeDataProvider = this.treeViewProviders.get(treeViewId);
        if (treeDataProvider) {
            this.treeViewProviders.delete(treeViewId);
            treeDataProvider.dispose();
        }
    }
    async $readDroppedFile(contentId) {
        const file = this.fileContentStore.getFile(contentId);
        const buffer = await file.arrayBuffer();
        return buffer_1.BinaryBuffer.wrap(new Uint8Array(buffer));
    }
    async $refresh(treeViewId) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        const widget = viewPanel && viewPanel.widgets[0];
        if (widget instanceof tree_view_widget_1.TreeViewWidget) {
            await widget.model.refresh();
        }
    }
    // elementParentChain parameter contain a list of tree ids from root to the revealed node
    // all parents of the revealed node should be fetched and expanded in order for it to reveal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $reveal(treeViewId, elementParentChain, options) {
        const viewPanel = await this.viewRegistry.openView(treeViewId, { activate: options.focus, reveal: true });
        const widget = viewPanel && viewPanel.widgets[0];
        if (widget instanceof tree_view_widget_1.TreeViewWidget) {
            // pop last element which is the node to reveal
            const elementId = elementParentChain.pop();
            await this.expandParentChain(widget.model, elementParentChain);
            const treeNode = widget.model.getNode(elementId);
            if (treeNode) {
                if (options.expand && browser_1.ExpandableTreeNode.is(treeNode)) {
                    await widget.model.expandNode(treeNode);
                }
                if (options.select && browser_1.SelectableTreeNode.is(treeNode)) {
                    widget.model.selectNode(treeNode);
                }
            }
        }
    }
    /**
     * Expand all parents of the node to reveal from root. This should also fetch missing nodes to the frontend.
     */
    async expandParentChain(model, elementParentChain) {
        for (const elementId of elementParentChain) {
            const treeNode = model.getNode(elementId);
            if (browser_1.ExpandableTreeNode.is(treeNode)) {
                await model.expandNode(treeNode);
            }
        }
    }
    async $setMessage(treeViewId, message) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        if (viewPanel instanceof plugin_view_widget_1.PluginViewWidget) {
            viewPanel.message = message;
        }
    }
    async $setTitle(treeViewId, title) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        if (viewPanel) {
            viewPanel.title.label = title;
        }
    }
    async $setDescription(treeViewId, description) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        if (viewPanel) {
            viewPanel.description = description;
        }
    }
    async $setBadge(treeViewId, badge) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        if (viewPanel) {
            viewPanel.badge = badge === null || badge === void 0 ? void 0 : badge.value;
            viewPanel.badgeTooltip = badge === null || badge === void 0 ? void 0 : badge.tooltip;
        }
    }
    async setChecked(treeViewWidget, changedNodes) {
        await this.proxy.$checkStateChanged(treeViewWidget.id, changedNodes.map(node => {
            var _a;
            return ({
                id: node.id,
                checked: !!((_a = node.checkboxInfo) === null || _a === void 0 ? void 0 : _a.checked)
            });
        }));
    }
    handleTreeEvents(treeViewId, treeViewWidget) {
        this.toDispose.push(treeViewWidget.model.onExpansionChanged(event => {
            this.proxy.$setExpanded(treeViewId, event.id, event.expanded);
        }));
        this.toDispose.push(treeViewWidget.model.onSelectionChanged(event => {
            this.contextKeys.view.set(treeViewId);
            this.proxy.$setSelection(treeViewId, event.map((node) => node.id));
        }));
        const updateVisible = () => this.proxy.$setVisible(treeViewId, treeViewWidget.isVisible);
        updateVisible();
        this.toDispose.push(treeViewWidget.onDidChangeVisibility(() => updateVisible()));
    }
}
exports.TreeViewsMainImpl = TreeViewsMainImpl;
//# sourceMappingURL=tree-views-main.js.map