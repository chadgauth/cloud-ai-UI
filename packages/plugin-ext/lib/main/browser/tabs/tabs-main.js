"use strict";
// *****************************************************************************
// Copyright (C) 2022 TypeFox and others.
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
exports.TabsMainImpl = void 0;
const browser_1 = require("@theia/core/lib/browser");
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const editor_preview_widget_1 = require("@theia/editor-preview/lib/browser/editor-preview-widget");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const monaco_diff_editor_1 = require("@theia/monaco/lib/browser/monaco-diff-editor");
const hierarchy_types_converters_1 = require("../hierarchy/hierarchy-types-converters");
const terminal_widget_1 = require("@theia/terminal/lib/browser/base/terminal-widget");
const core_1 = require("@theia/core");
class TabsMainImpl {
    constructor(rpc, container) {
        this.tabGroupModel = new Map();
        this.tabInfoLookup = new Map();
        this.disposableTabBarListeners = new core_1.DisposableCollection();
        this.toDisposeOnDestroy = new core_1.DisposableCollection();
        this.groupIdCounter = 0;
        this.tabGroupChanged = false;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TABS_EXT);
        this.applicationShell = container.get(browser_1.ApplicationShell);
        this.createTabsModel();
        const tabBars = this.applicationShell.mainPanel.tabBars();
        for (let tabBar; tabBar = tabBars.next();) {
            this.attachListenersToTabBar(tabBar);
        }
        this.toDisposeOnDestroy.push(this.applicationShell.mainPanelRenderer.onDidCreateTabBar(tabBar => {
            this.attachListenersToTabBar(tabBar);
            this.onTabGroupCreated(tabBar);
        }));
        this.connectToSignal(this.toDisposeOnDestroy, this.applicationShell.mainPanel.widgetAdded, (mainPanel, widget) => {
            if (this.tabGroupChanged || this.tabGroupModel.size === 0) {
                this.tabGroupChanged = false;
                this.createTabsModel();
                // tab Open event is done in backend
            }
            else {
                const tabBar = mainPanel.findTabBar(widget.title);
                const oldTabInfo = this.tabInfoLookup.get(widget.title);
                const group = this.tabGroupModel.get(tabBar);
                if (group !== (oldTabInfo === null || oldTabInfo === void 0 ? void 0 : oldTabInfo.group)) {
                    if (oldTabInfo) {
                        this.onTabClosed(oldTabInfo, widget.title);
                    }
                    this.onTabCreated(tabBar, { index: tabBar.titles.indexOf(widget.title), title: widget.title });
                }
            }
        });
        this.connectToSignal(this.toDisposeOnDestroy, this.applicationShell.mainPanel.widgetRemoved, (mainPanel, widget) => {
            if (!(widget instanceof browser_1.TabBar)) {
                const tabInfo = this.getOrRebuildModel(this.tabInfoLookup, widget.title);
                this.onTabClosed(tabInfo, widget.title);
                if (this.tabGroupChanged) {
                    this.tabGroupChanged = false;
                    this.createTabsModel();
                }
            }
        });
    }
    createTabsModel() {
        var _a, _b;
        const newTabGroupModel = new Map();
        this.tabInfoLookup.clear();
        this.disposableTabBarListeners.dispose();
        this.applicationShell.mainAreaTabBars.forEach(tabBar => {
            this.attachListenersToTabBar(tabBar);
            const groupDto = this.createTabGroupDto(tabBar);
            tabBar.titles.forEach((title, index) => this.tabInfoLookup.set(title, { group: groupDto, tab: groupDto.tabs[index], tabIndex: index }));
            newTabGroupModel.set(tabBar, groupDto);
        });
        if (newTabGroupModel.size > 0 && Array.from(newTabGroupModel.values()).indexOf(this.currentActiveGroup) < 0) {
            this.currentActiveGroup = (_b = (_a = this.tabInfoLookup.get(this.applicationShell.mainPanel.currentTitle)) === null || _a === void 0 ? void 0 : _a.group) !== null && _b !== void 0 ? _b : newTabGroupModel.values().next().value;
            this.currentActiveGroup.isActive = true;
        }
        this.tabGroupModel = newTabGroupModel;
        this.proxy.$acceptEditorTabModel(Array.from(this.tabGroupModel.values()));
    }
    createTabDto(tabTitle, groupId) {
        const widget = tabTitle.owner;
        return {
            id: this.createTabId(tabTitle, groupId),
            label: tabTitle.label,
            input: this.evaluateTabDtoInput(widget),
            isActive: tabTitle.owner.isVisible,
            isPinned: tabTitle.className.includes(browser_1.PINNED_CLASS),
            isDirty: browser_1.Saveable.isDirty(widget),
            isPreview: widget instanceof editor_preview_widget_1.EditorPreviewWidget && widget.isPreview
        };
    }
    createTabId(tabTitle, groupId) {
        return `${groupId}~${tabTitle.owner.id}`;
    }
    createTabGroupDto(tabBar) {
        var _a;
        const oldDto = this.tabGroupModel.get(tabBar);
        const groupId = (_a = oldDto === null || oldDto === void 0 ? void 0 : oldDto.groupId) !== null && _a !== void 0 ? _a : this.groupIdCounter++;
        const tabs = tabBar.titles.map(title => this.createTabDto(title, groupId));
        return {
            groupId,
            tabs,
            isActive: false,
            viewColumn: 1
        };
    }
    attachListenersToTabBar(tabBar) {
        if (!tabBar) {
            return;
        }
        tabBar.titles.forEach(title => {
            this.connectToSignal(this.disposableTabBarListeners, title.changed, this.onTabTitleChanged);
        });
        this.connectToSignal(this.disposableTabBarListeners, tabBar.tabMoved, this.onTabMoved);
        this.connectToSignal(this.disposableTabBarListeners, tabBar.disposed, this.onTabGroupClosed);
    }
    evaluateTabDtoInput(widget) {
        if (widget instanceof editor_preview_widget_1.EditorPreviewWidget) {
            if (widget.editor instanceof monaco_diff_editor_1.MonacoDiffEditor) {
                return {
                    kind: 2 /* TextDiffInput */,
                    original: (0, hierarchy_types_converters_1.toUriComponents)(widget.editor.originalModel.uri),
                    modified: (0, hierarchy_types_converters_1.toUriComponents)(widget.editor.modifiedModel.uri)
                };
            }
            else {
                return {
                    kind: 1 /* TextInput */,
                    uri: (0, hierarchy_types_converters_1.toUriComponents)(widget.editor.uri.toString())
                };
            }
            // TODO notebook support when implemented
        }
        else if (widget instanceof browser_1.ViewContainer) {
            return {
                kind: 7 /* WebviewEditorInput */,
                viewType: widget.id
            };
        }
        else if (widget instanceof terminal_widget_1.TerminalWidget) {
            return {
                kind: 8 /* TerminalEditorInput */
            };
        }
        return { kind: 0 /* UnknownInput */ };
    }
    connectToSignal(disposableList, signal, listener) {
        signal.connect(listener, this);
        disposableList.push(vscode_languageserver_protocol_1.Disposable.create(() => signal.disconnect(listener)));
    }
    tabDtosEqual(a, b) {
        return a.isActive === b.isActive &&
            a.isDirty === b.isDirty &&
            a.isPinned === b.isPinned &&
            a.isPreview === b.isPreview &&
            a.id === b.id;
    }
    getOrRebuildModel(map, key) {
        // something broke so we rebuild the model
        let item = map.get(key);
        if (!item) {
            this.createTabsModel();
            item = map.get(key);
        }
        return item;
    }
    // #region event listeners
    onTabCreated(tabBar, args) {
        const group = this.getOrRebuildModel(this.tabGroupModel, tabBar);
        this.connectToSignal(this.disposableTabBarListeners, args.title.changed, this.onTabTitleChanged);
        const tabDto = this.createTabDto(args.title, group.groupId);
        this.tabInfoLookup.set(args.title, { group, tab: tabDto, tabIndex: args.index });
        group.tabs.splice(args.index, 0, tabDto);
        this.proxy.$acceptTabOperation({
            kind: 0 /* TAB_OPEN */,
            index: args.index,
            tabDto,
            groupId: group.groupId
        });
    }
    onTabTitleChanged(title) {
        const tabInfo = this.getOrRebuildModel(this.tabInfoLookup, title);
        if (!tabInfo) {
            return;
        }
        const oldTabDto = tabInfo.tab;
        const newTabDto = this.createTabDto(title, tabInfo.group.groupId);
        if (newTabDto.isActive && !tabInfo.group.isActive) {
            tabInfo.group.isActive = true;
            this.currentActiveGroup.isActive = false;
            this.currentActiveGroup = tabInfo.group;
            this.proxy.$acceptTabGroupUpdate(tabInfo.group);
        }
        if (!this.tabDtosEqual(oldTabDto, newTabDto)) {
            tabInfo.group.tabs[tabInfo.tabIndex] = newTabDto;
            tabInfo.tab = newTabDto;
            this.proxy.$acceptTabOperation({
                kind: 2 /* TAB_UPDATE */,
                index: tabInfo.tabIndex,
                tabDto: newTabDto,
                groupId: tabInfo.group.groupId
            });
        }
    }
    onTabClosed(tabInfo, title) {
        tabInfo.group.tabs.splice(tabInfo.tabIndex, 1);
        this.tabInfoLookup.delete(title);
        this.updateTabIndices(tabInfo, tabInfo.tabIndex);
        this.proxy.$acceptTabOperation({
            kind: 1 /* TAB_CLOSE */,
            index: tabInfo.tabIndex,
            tabDto: this.createTabDto(title, tabInfo.group.groupId),
            groupId: tabInfo.group.groupId
        });
    }
    onTabMoved(tabBar, args) {
        const tabInfo = this.getOrRebuildModel(this.tabInfoLookup, args.title);
        tabInfo.tabIndex = args.toIndex;
        const tabDto = this.createTabDto(args.title, tabInfo.group.groupId);
        tabInfo.group.tabs.splice(args.fromIndex, 1);
        tabInfo.group.tabs.splice(args.toIndex, 0, tabDto);
        this.updateTabIndices(tabInfo, args.fromIndex);
        this.proxy.$acceptTabOperation({
            kind: 3 /* TAB_MOVE */,
            index: args.toIndex,
            tabDto,
            groupId: tabInfo.group.groupId,
            oldIndex: args.fromIndex
        });
    }
    onTabGroupCreated(tabBar) {
        this.tabGroupChanged = true;
    }
    onTabGroupClosed(tabBar) {
        this.tabGroupChanged = true;
    }
    // #endregion
    // #region Messages received from Ext Host
    $moveTab(tabId, index, viewColumn, preserveFocus) {
        return;
    }
    updateTabIndices(tabInfo, startIndex) {
        for (const tab of this.tabInfoLookup.values()) {
            if (tab.group === tabInfo.group && tab.tabIndex >= startIndex) {
                tab.tabIndex = tab.group.tabs.indexOf(tab.tab);
            }
        }
    }
    async $closeTab(tabIds, preserveFocus) {
        const widgets = [];
        for (const tabId of tabIds) {
            const cleanedId = tabId.substring(tabId.indexOf('~') + 1);
            const widget = this.applicationShell.getWidgetById(cleanedId);
            if (widget) {
                widgets.push(widget);
            }
        }
        await this.applicationShell.closeMany(widgets);
        return true;
    }
    async $closeGroup(groupIds, preserveFocus) {
        for (const groupId of groupIds) {
            tabGroupModel: for (const [bar, groupDto] of this.tabGroupModel) {
                if (groupDto.groupId === groupId) {
                    this.applicationShell.closeTabs(bar);
                    break tabGroupModel;
                }
            }
        }
        return true;
    }
    // #endregion
    dispose() {
        this.toDisposeOnDestroy.dispose();
        this.disposableTabBarListeners.dispose();
    }
}
exports.TabsMainImpl = TabsMainImpl;
//# sourceMappingURL=tabs-main.js.map