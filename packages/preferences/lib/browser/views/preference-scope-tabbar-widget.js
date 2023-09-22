"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
var PreferencesScopeTabBar_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesScopeTabBar = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const widgets_1 = require("@theia/core/shared/@phosphor/widgets");
const browser_1 = require("@theia/core/lib/browser");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const uri_1 = require("@theia/core/lib/common/uri");
const preference_scope_command_manager_1 = require("../util/preference-scope-command-manager");
const preference_types_1 = require("../util/preference-types");
const common_1 = require("@theia/core/lib/common");
const nls_1 = require("@theia/core/lib/common/nls");
const USER_TAB_LABEL = nls_1.nls.localizeByDefault('User');
const USER_TAB_INDEX = browser_1.PreferenceScope['User'];
const WORKSPACE_TAB_LABEL = nls_1.nls.localizeByDefault('Workspace');
const WORKSPACE_TAB_INDEX = browser_1.PreferenceScope['Workspace'];
const FOLDER_TAB_LABEL = nls_1.nls.localizeByDefault('Folder');
const FOLDER_TAB_INDEX = browser_1.PreferenceScope['Folder'];
const PREFERENCE_TAB_CLASSNAME = 'preferences-scope-tab';
const GENERAL_FOLDER_TAB_CLASSNAME = 'preference-folder';
const LABELED_FOLDER_TAB_CLASSNAME = 'preferences-folder-tab';
const FOLDER_DROPDOWN_CLASSNAME = 'preferences-folder-dropdown';
const FOLDER_DROPDOWN_ICON_CLASSNAME = 'preferences-folder-dropdown-icon ' + (0, browser_1.codicon)('chevron-down');
const TABBAR_UNDERLINE_CLASSNAME = 'tabbar-underline';
const SINGLE_FOLDER_TAB_CLASSNAME = `${PREFERENCE_TAB_CLASSNAME} ${GENERAL_FOLDER_TAB_CLASSNAME} ${LABELED_FOLDER_TAB_CLASSNAME}`;
const UNSELECTED_FOLDER_DROPDOWN_CLASSNAME = `${PREFERENCE_TAB_CLASSNAME} ${GENERAL_FOLDER_TAB_CLASSNAME} ${FOLDER_DROPDOWN_CLASSNAME}`;
const SELECTED_FOLDER_DROPDOWN_CLASSNAME = `${PREFERENCE_TAB_CLASSNAME} ${GENERAL_FOLDER_TAB_CLASSNAME} ${LABELED_FOLDER_TAB_CLASSNAME} ${FOLDER_DROPDOWN_CLASSNAME}`;
const SHADOW_CLASSNAME = 'with-shadow';
let PreferencesScopeTabBar = PreferencesScopeTabBar_1 = class PreferencesScopeTabBar extends widgets_1.TabBar {
    constructor() {
        super(...arguments);
        this.onScopeChangedEmitter = new common_1.Emitter();
        this.onScopeChanged = this.onScopeChangedEmitter.event;
        this.toDispose = new common_1.DisposableCollection();
        this.currentWorkspaceRoots = [];
        this.currentSelection = preference_types_1.Preference.DEFAULT_SCOPE;
        this.editorScrollAtTop = true;
        this.folderSelectionCallback = (newScope) => { this.setNewScopeSelection(newScope); };
    }
    get currentScope() {
        return this.currentSelection;
    }
    setNewScopeSelection(newSelection) {
        const stringifiedSelectionScope = newSelection.scope.toString();
        const newIndex = this.titles.findIndex(title => title.dataset.scope === stringifiedSelectionScope);
        if (newIndex !== -1) {
            this.currentSelection = newSelection;
            this.currentIndex = newIndex;
            if (newSelection.scope === browser_1.PreferenceScope.Folder) {
                this.addOrUpdateFolderTab();
            }
            this.emitNewScope();
        }
    }
    init() {
        this.id = PreferencesScopeTabBar_1.ID;
        this.setupInitialDisplay();
        this.tabActivateRequested.connect((sender, args) => {
            const scopeDetails = this.toScopeDetails(args.title);
            if (scopeDetails) {
                this.setNewScopeSelection(scopeDetails);
            }
        });
        this.toDispose.pushAll([
            this.workspaceService.onWorkspaceChanged(newRoots => this.doUpdateDisplay(newRoots)),
            this.workspaceService.onWorkspaceLocationChanged(() => this.doUpdateDisplay(this.workspaceService.tryGetRoots())),
        ]);
        const tabUnderline = document.createElement('div');
        tabUnderline.className = TABBAR_UNDERLINE_CLASSNAME;
        this.node.append(tabUnderline);
    }
    toScopeDetails(title) {
        if (title) {
            const source = 'dataset' in title ? title.dataset : title;
            const { scope, uri, activeScopeIsFolder } = source;
            return {
                scope: Number(scope),
                uri: uri || undefined,
                activeScopeIsFolder: activeScopeIsFolder === 'true' || activeScopeIsFolder === true,
            };
        }
    }
    toDataSet(scopeDetails) {
        const { scope, uri, activeScopeIsFolder } = scopeDetails;
        return {
            scope: scope.toString(),
            uri: uri !== null && uri !== void 0 ? uri : '',
            activeScopeIsFolder: activeScopeIsFolder.toString()
        };
    }
    setupInitialDisplay() {
        this.addUserTab();
        if (this.workspaceService.workspace) {
            this.addWorkspaceTab(this.workspaceService.workspace);
        }
        this.addOrUpdateFolderTab();
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        this.addTabIndexToTabs();
    }
    addTabIndexToTabs() {
        this.node.querySelectorAll('li').forEach((tab, index) => {
            tab.tabIndex = 0;
            const handler = () => {
                if (tab.className.includes(GENERAL_FOLDER_TAB_CLASSNAME) && this.currentWorkspaceRoots.length > 1) {
                    const tabRect = tab.getBoundingClientRect();
                    this.openContextMenu(tabRect, tab, 'keypress');
                }
                else {
                    const details = this.toScopeDetails(this.titles[index]);
                    if (details) {
                        this.setNewScopeSelection(details);
                    }
                }
            };
            tab.onkeydown = handler;
            tab.onclick = handler;
        });
    }
    addUserTab() {
        this.addTab(new widgets_1.Title({
            dataset: { uri: '', scope: USER_TAB_INDEX.toString() },
            label: USER_TAB_LABEL,
            owner: this,
            className: PREFERENCE_TAB_CLASSNAME
        }));
    }
    addWorkspaceTab(currentWorkspace) {
        const scopeDetails = this.getWorkspaceDataset(currentWorkspace);
        const workspaceTabTitle = new widgets_1.Title({
            dataset: this.toDataSet(scopeDetails),
            label: WORKSPACE_TAB_LABEL,
            owner: this,
            className: PREFERENCE_TAB_CLASSNAME,
        });
        this.addTab(workspaceTabTitle);
        return workspaceTabTitle;
    }
    getWorkspaceDataset(currentWorkspace) {
        const { resource, isDirectory } = currentWorkspace;
        const scope = WORKSPACE_TAB_INDEX;
        return { uri: resource.toString(), activeScopeIsFolder: isDirectory, scope };
    }
    addOrUpdateFolderTab() {
        if (!!this.workspaceService.workspace) {
            this.currentWorkspaceRoots = this.workspaceService.tryGetRoots();
            const multipleFolderRootsAreAvailable = this.currentWorkspaceRoots && this.currentWorkspaceRoots.length > 1;
            const noFolderRootsAreAvailable = this.currentWorkspaceRoots.length === 0;
            const shouldShowFoldersSeparately = this.workspaceService.saved;
            if (!noFolderRootsAreAvailable) {
                if (!this.folderTitle) {
                    this.folderTitle = new widgets_1.Title({
                        label: '',
                        caption: FOLDER_TAB_LABEL,
                        owner: this,
                    });
                }
                this.setFolderTitleProperties(multipleFolderRootsAreAvailable);
                if (multipleFolderRootsAreAvailable || shouldShowFoldersSeparately) {
                    this.addTab(this.folderTitle);
                }
            }
            else {
                const folderTabIndex = this.titles.findIndex(title => title.caption === FOLDER_TAB_LABEL);
                if (folderTabIndex > -1) {
                    this.removeTabAt(folderTabIndex);
                }
            }
        }
    }
    setFolderTitleProperties(multipleFolderRootsAreAvailable) {
        this.folderTitle.iconClass = multipleFolderRootsAreAvailable ? FOLDER_DROPDOWN_ICON_CLASSNAME : '';
        if (this.currentSelection.scope === FOLDER_TAB_INDEX) {
            this.folderTitle.label = this.labelProvider.getName(new uri_1.default(this.currentSelection.uri));
            this.folderTitle.dataset = this.toDataSet(this.currentSelection);
            this.folderTitle.className = multipleFolderRootsAreAvailable ? SELECTED_FOLDER_DROPDOWN_CLASSNAME : SINGLE_FOLDER_TAB_CLASSNAME;
        }
        else {
            const singleFolderRoot = this.currentWorkspaceRoots[0].resource;
            const singleFolderLabel = this.labelProvider.getName(singleFolderRoot);
            const defaultURI = multipleFolderRootsAreAvailable ? '' : singleFolderRoot.toString();
            this.folderTitle.label = multipleFolderRootsAreAvailable ? FOLDER_TAB_LABEL : singleFolderLabel;
            this.folderTitle.className = multipleFolderRootsAreAvailable ? UNSELECTED_FOLDER_DROPDOWN_CLASSNAME : SINGLE_FOLDER_TAB_CLASSNAME;
            this.folderTitle.dataset = { folderTitle: 'true', scope: FOLDER_TAB_INDEX.toString(), uri: defaultURI };
        }
    }
    getFolderContextMenu(workspaceRoots = this.workspaceService.tryGetRoots()) {
        this.preferencesMenuFactory.createFolderWorkspacesMenu(workspaceRoots, this.currentSelection.uri);
    }
    handleEvent() {
        // Don't - the handlers are defined in PreferenceScopeTabbarWidget.addTabIndexToTabs()
    }
    openContextMenu(tabRect, folderTabNode, source) {
        const toDisposeOnHide = new common_1.DisposableCollection();
        for (const root of this.workspaceService.tryGetRoots()) {
            const id = `set-scope-to-${root.resource.toString()}`;
            toDisposeOnHide.pushAll([
                this.commandRegistry.registerCommand({ id }, { execute: () => this.setScope(root.resource) }),
                this.menuModelRegistry.registerMenuAction(preference_types_1.PreferenceMenus.FOLDER_SCOPE_MENU_PATH, {
                    commandId: id,
                    label: this.labelProvider.getName(root),
                })
            ]);
        }
        this.contextMenuRenderer.render({
            menuPath: preference_types_1.PreferenceMenus.FOLDER_SCOPE_MENU_PATH,
            anchor: { x: tabRect.left, y: tabRect.bottom },
            onHide: () => {
                setTimeout(() => toDisposeOnHide.dispose());
                if (source === 'click') {
                    folderTabNode.blur();
                }
            }
        });
    }
    doUpdateDisplay(newRoots) {
        const folderWasRemoved = newRoots.length < this.currentWorkspaceRoots.length;
        this.currentWorkspaceRoots = newRoots;
        if (folderWasRemoved) {
            const removedFolderWasSelectedScope = !this.currentWorkspaceRoots.some(root => root.resource.toString() === this.currentSelection.uri);
            if (removedFolderWasSelectedScope) {
                this.setNewScopeSelection(preference_types_1.Preference.DEFAULT_SCOPE);
            }
        }
        this.updateWorkspaceTab();
        this.addOrUpdateFolderTab();
    }
    updateWorkspaceTab() {
        var _a;
        const currentWorkspace = this.workspaceService.workspace;
        if (currentWorkspace) {
            const workspaceTitle = (_a = this.titles.find(title => title.label === WORKSPACE_TAB_LABEL)) !== null && _a !== void 0 ? _a : this.addWorkspaceTab(currentWorkspace);
            const scopeDetails = this.getWorkspaceDataset(currentWorkspace);
            workspaceTitle.dataset = this.toDataSet(scopeDetails);
            if (this.currentSelection.scope === browser_1.PreferenceScope.Workspace) {
                this.setNewScopeSelection(scopeDetails);
            }
        }
    }
    emitNewScope() {
        this.onScopeChangedEmitter.fire(this.currentSelection);
    }
    setScope(scope) {
        const details = scope instanceof uri_1.default ? this.getDetailsForResource(scope) : this.getDetailsForScope(scope);
        if (details) {
            this.setNewScopeSelection(details);
        }
    }
    getDetailsForScope(scope) {
        const stringifiedSelectionScope = scope.toString();
        const correspondingTitle = this.titles.find(title => title.dataset.scope === stringifiedSelectionScope);
        return this.toScopeDetails(correspondingTitle);
    }
    getDetailsForResource(resource) {
        const parent = this.workspaceService.getWorkspaceRootUri(resource);
        if (!parent) {
            return undefined;
        }
        if (!this.workspaceService.isMultiRootWorkspaceOpened) {
            return this.getDetailsForScope(browser_1.PreferenceScope.Workspace);
        }
        return ({ scope: browser_1.PreferenceScope.Folder, uri: parent.toString(), activeScopeIsFolder: true });
    }
    storeState() {
        return {
            scopeDetails: this.currentScope
        };
    }
    restoreState(oldState) {
        const scopeDetails = this.toScopeDetails(oldState.scopeDetails);
        if (scopeDetails) {
            this.setNewScopeSelection(scopeDetails);
        }
    }
    toggleShadow(showShadow) {
        this.toggleClass(SHADOW_CLASSNAME, showShadow);
    }
    dispose() {
        super.dispose();
        this.toDispose.dispose();
    }
};
PreferencesScopeTabBar.ID = 'preferences-scope-tab-bar';
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], PreferencesScopeTabBar.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(preference_scope_command_manager_1.PreferenceScopeCommandManager),
    __metadata("design:type", preference_scope_command_manager_1.PreferenceScopeCommandManager)
], PreferencesScopeTabBar.prototype, "preferencesMenuFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], PreferencesScopeTabBar.prototype, "contextMenuRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], PreferencesScopeTabBar.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], PreferencesScopeTabBar.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], PreferencesScopeTabBar.prototype, "menuModelRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreferencesScopeTabBar.prototype, "init", null);
PreferencesScopeTabBar = PreferencesScopeTabBar_1 = __decorate([
    (0, inversify_1.injectable)()
], PreferencesScopeTabBar);
exports.PreferencesScopeTabBar = PreferencesScopeTabBar;
//# sourceMappingURL=preference-scope-tabbar-widget.js.map