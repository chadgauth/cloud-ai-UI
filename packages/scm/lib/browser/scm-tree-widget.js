"use strict";
// *****************************************************************************
// Copyright (C) 2020 Arm and others.
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
var ScmTreeWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScmInlineAction = exports.ScmInlineActions = exports.ScmResourceFolderElement = exports.ScmResourceGroupElement = exports.ScmResourceComponent = exports.ScmElement = exports.ScmTreeWidget = void 0;
/* eslint-disable no-null/no-null, @typescript-eslint/no-explicit-any */
const React = require("@theia/core/shared/react");
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const os_1 = require("@theia/core/lib/common/os");
const disposable_1 = require("@theia/core/lib/common/disposable");
const tree_1 = require("@theia/core/lib/browser/tree");
const scm_tree_model_1 = require("./scm-tree-model");
const menu_1 = require("@theia/core/lib/common/menu");
const browser_1 = require("@theia/core/lib/browser");
const scm_context_key_service_1 = require("./scm-context-key-service");
const browser_2 = require("@theia/editor/lib/browser");
const icon_theme_service_1 = require("@theia/core/lib/browser/icon-theme-service");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
const decorations_service_1 = require("@theia/core/lib/browser/decorations-service");
const files_1 = require("@theia/filesystem/lib/common/files");
const theming_1 = require("@theia/core/lib/browser/theming");
let ScmTreeWidget = ScmTreeWidget_1 = class ScmTreeWidget extends tree_1.TreeWidget {
    constructor(props, treeModel, contextMenuRenderer) {
        super(props, treeModel, contextMenuRenderer);
        this.id = ScmTreeWidget_1.ID;
        this.addClass('groups-outer-container');
    }
    init() {
        super.init();
        this.toDispose.push(this.themeService.onDidColorThemeChange(() => this.update()));
    }
    set viewMode(id) {
        // Close the search box because the structure of the tree will change dramatically
        // and the search results will be out of date.
        this.searchBox.hide();
        this.model.viewMode = id;
    }
    get viewMode() {
        return this.model.viewMode;
    }
    /**
     * Render the node given the tree node and node properties.
     * @param node the tree node.
     * @param props the node properties.
     */
    renderNode(node, props) {
        var _a;
        if (!tree_1.TreeNode.isVisible(node)) {
            return undefined;
        }
        const attributes = this.createNodeAttributes(node, props);
        const label = this.labelProvider.getName(node);
        const searchHighlights = (_a = this.searchHighlights) === null || _a === void 0 ? void 0 : _a.get(node.id);
        // The group nodes should not be subject to highlighting.
        const caption = (searchHighlights && !scm_tree_model_1.ScmFileChangeGroupNode.is(node)) ? this.toReactNode(label, searchHighlights) : label;
        if (scm_tree_model_1.ScmFileChangeGroupNode.is(node)) {
            const content = React.createElement(ScmResourceGroupElement, { key: `${node.groupId}`, model: this.model, treeNode: node, renderExpansionToggle: () => this.renderExpansionToggle(node, props), commandExecutor: this.menuCommandExecutor, contextMenuRenderer: this.contextMenuRenderer, menus: this.menus, contextKeys: this.contextKeys, labelProvider: this.labelProvider, corePreferences: this.corePreferences, caption: caption });
            return React.createElement('div', attributes, content);
        }
        if (scm_tree_model_1.ScmFileChangeFolderNode.is(node)) {
            const content = React.createElement(ScmResourceFolderElement, { key: String(node.sourceUri), model: this.model, treeNode: node, sourceUri: node.sourceUri, renderExpansionToggle: () => this.renderExpansionToggle(node, props), commandExecutor: this.menuCommandExecutor, contextMenuRenderer: this.contextMenuRenderer, menus: this.menus, contextKeys: this.contextKeys, labelProvider: this.labelProvider, corePreferences: this.corePreferences, caption: caption });
            return React.createElement('div', attributes, content);
        }
        if (scm_tree_model_1.ScmFileChangeNode.is(node)) {
            const parentPath = (node.parent && scm_tree_model_1.ScmFileChangeFolderNode.is(node.parent))
                ? new uri_1.default(node.parent.sourceUri) : new uri_1.default(this.model.rootUri);
            const content = React.createElement(ScmResourceComponent, { key: node.sourceUri, model: this.model, treeNode: node, contextMenuRenderer: this.contextMenuRenderer, commandExecutor: this.menuCommandExecutor, menus: this.menus, contextKeys: this.contextKeys, labelProvider: this.labelProvider, corePreferences: this.corePreferences, caption: caption, ...{
                    ...this.props,
                    parentPath,
                    sourceUri: node.sourceUri,
                    decoration: this.decorationsService.getDecoration(new uri_1.default(node.sourceUri), true)[0],
                    colors: this.colors,
                    isLightTheme: this.isCurrentThemeLight(),
                    renderExpansionToggle: () => this.renderExpansionToggle(node, props),
                } });
            return React.createElement('div', attributes, content);
        }
        return super.renderNode(node, props);
    }
    createContainerAttributes() {
        if (this.model.canTabToWidget()) {
            return {
                ...super.createContainerAttributes(),
                tabIndex: 0
            };
        }
        return super.createContainerAttributes();
    }
    /**
     * The ARROW_LEFT key controls both the movement around the file tree and also
     * the movement through the change chunks within a file.
     *
     * If the selected tree node is a folder then the ARROW_LEFT key behaves exactly
     * as it does in explorer.  It collapses the tree node if the folder is expanded and
     * it moves the selection up to the parent folder if the folder is collapsed (no-op if no parent folder, as
     * group headers are not selectable).  This behavior is the default behavior implemented
     * in the TreeWidget super class.
     *
     * If the selected tree node is a file then the ARROW_LEFT key moves up through the
     * change chunks within each file.  If the selected chunk is the first chunk in the file
     * then the file selection is moved to the previous file (no-op if no previous file).
     *
     * Note that when cursoring through change chunks, the ARROW_LEFT key cannot be used to
     * move up through the parent folders of the file tree.  If users want to do this, using
     * keys only, then they must press ARROW_UP repeatedly until the selected node is the folder
     * node and then press ARROW_LEFT.
     */
    async handleLeft(event) {
        if (this.model.selectedNodes.length === 1) {
            const selectedNode = this.model.selectedNodes[0];
            if (scm_tree_model_1.ScmFileChangeNode.is(selectedNode)) {
                const selectedResource = this.model.getResourceFromNode(selectedNode);
                if (!selectedResource) {
                    return super.handleLeft(event);
                }
                const widget = await this.openResource(selectedResource);
                if (widget) {
                    const diffNavigator = this.diffNavigatorProvider(widget.editor);
                    if (diffNavigator.hasPrevious()) {
                        diffNavigator.previous();
                    }
                    else {
                        const previousNode = this.moveToPreviousFileNode();
                        if (previousNode) {
                            const previousResource = this.model.getResourceFromNode(previousNode);
                            if (previousResource) {
                                this.openResource(previousResource);
                            }
                        }
                    }
                    return;
                }
            }
        }
        return super.handleLeft(event);
    }
    /**
     * The ARROW_RIGHT key controls both the movement around the file tree and also
     * the movement through the change chunks within a file.
     *
     * If the selected tree node is a folder then the ARROW_RIGHT key behaves exactly
     * as it does in explorer.  It expands the tree node if the folder is collapsed and
     * it moves the selection to the first child node if the folder is expanded.
     * This behavior is the default behavior implemented
     * in the TreeWidget super class.
     *
     * If the selected tree node is a file then the ARROW_RIGHT key moves down through the
     * change chunks within each file.  If the selected chunk is the last chunk in the file
     * then the file selection is moved to the next file (no-op if no next file).
     */
    async handleRight(event) {
        if (this.model.selectedNodes.length === 0) {
            const firstNode = this.getFirstSelectableNode();
            // Selects the first visible resource as none are selected.
            if (!firstNode) {
                return;
            }
            this.model.selectNode(firstNode);
            return;
        }
        if (this.model.selectedNodes.length === 1) {
            const selectedNode = this.model.selectedNodes[0];
            if (scm_tree_model_1.ScmFileChangeNode.is(selectedNode)) {
                const selectedResource = this.model.getResourceFromNode(selectedNode);
                if (!selectedResource) {
                    return super.handleRight(event);
                }
                const widget = await this.openResource(selectedResource);
                if (widget) {
                    const diffNavigator = this.diffNavigatorProvider(widget.editor);
                    if (diffNavigator.hasNext()) {
                        diffNavigator.next();
                    }
                    else {
                        const nextNode = this.moveToNextFileNode();
                        if (nextNode) {
                            const nextResource = this.model.getResourceFromNode(nextNode);
                            if (nextResource) {
                                this.openResource(nextResource);
                            }
                        }
                    }
                }
                return;
            }
        }
        return super.handleRight(event);
    }
    handleEnter(event) {
        if (this.model.selectedNodes.length === 1) {
            const selectedNode = this.model.selectedNodes[0];
            if (scm_tree_model_1.ScmFileChangeNode.is(selectedNode)) {
                const selectedResource = this.model.getResourceFromNode(selectedNode);
                if (selectedResource) {
                    this.openResource(selectedResource);
                }
                return;
            }
        }
        super.handleEnter(event);
    }
    async goToPreviousChange() {
        if (this.model.selectedNodes.length === 1) {
            const selectedNode = this.model.selectedNodes[0];
            if (scm_tree_model_1.ScmFileChangeNode.is(selectedNode)) {
                if (scm_tree_model_1.ScmFileChangeNode.is(selectedNode)) {
                    const selectedResource = this.model.getResourceFromNode(selectedNode);
                    if (!selectedResource) {
                        return;
                    }
                    const widget = await this.openResource(selectedResource);
                    if (widget) {
                        const diffNavigator = this.diffNavigatorProvider(widget.editor);
                        if (diffNavigator.hasPrevious()) {
                            diffNavigator.previous();
                        }
                        else {
                            const previousNode = this.moveToPreviousFileNode();
                            if (previousNode) {
                                const previousResource = this.model.getResourceFromNode(previousNode);
                                if (previousResource) {
                                    this.openResource(previousResource);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    async goToNextChange() {
        if (this.model.selectedNodes.length === 0) {
            const firstNode = this.getFirstSelectableNode();
            // Selects the first visible resource as none are selected.
            if (!firstNode) {
                return;
            }
            this.model.selectNode(firstNode);
            return;
        }
        if (this.model.selectedNodes.length === 1) {
            const selectedNode = this.model.selectedNodes[0];
            if (scm_tree_model_1.ScmFileChangeNode.is(selectedNode)) {
                const selectedResource = this.model.getResourceFromNode(selectedNode);
                if (!selectedResource) {
                    return;
                }
                const widget = await this.openResource(selectedResource);
                if (widget) {
                    const diffNavigator = this.diffNavigatorProvider(widget.editor);
                    if (diffNavigator.hasNext()) {
                        diffNavigator.next();
                    }
                    else {
                        const nextNode = this.moveToNextFileNode();
                        if (nextNode) {
                            const nextResource = this.model.getResourceFromNode(nextNode);
                            if (nextResource) {
                                this.openResource(nextResource);
                            }
                        }
                    }
                }
            }
        }
    }
    selectNodeByUri(uri) {
        for (const group of this.model.groups) {
            const sourceUri = new uri_1.default(uri.path.toString());
            const id = `${group.id}:${sourceUri.toString()}`;
            const node = this.model.getNode(id);
            if (tree_1.SelectableTreeNode.is(node)) {
                this.model.selectNode(node);
                return;
            }
        }
    }
    getFirstSelectableNode() {
        if (this.model.root) {
            const root = this.model.root;
            const groupNode = root.children[0];
            return groupNode.children[0];
        }
    }
    moveToPreviousFileNode() {
        let previousNode = this.model.getPrevSelectableNode();
        while (previousNode) {
            if (scm_tree_model_1.ScmFileChangeNode.is(previousNode)) {
                this.model.selectNode(previousNode);
                return previousNode;
            }
            previousNode = this.model.getPrevSelectableNode(previousNode);
        }
        ;
    }
    moveToNextFileNode() {
        let nextNode = this.model.getNextSelectableNode();
        while (nextNode) {
            if (scm_tree_model_1.ScmFileChangeNode.is(nextNode)) {
                this.model.selectNode(nextNode);
                return nextNode;
            }
            nextNode = this.model.getNextSelectableNode(nextNode);
        }
        ;
    }
    async openResource(resource) {
        try {
            await resource.open();
        }
        catch (e) {
            console.error('Failed to open a SCM resource', e);
            return undefined;
        }
        let standaloneEditor;
        const resourcePath = resource.sourceUri.path.toString();
        for (const widget of this.editorManager.all) {
            const resourceUri = widget.editor.document.uri;
            const editorResourcePath = new uri_1.default(resourceUri).path.toString();
            if (resourcePath === editorResourcePath) {
                if (widget.editor.uri.scheme === browser_1.DiffUris.DIFF_SCHEME) {
                    // prefer diff editor
                    return widget;
                }
                else {
                    standaloneEditor = widget;
                }
            }
            if (widget.editor.uri.scheme === browser_1.DiffUris.DIFF_SCHEME
                && resourceUri === resource.sourceUri.toString()) {
                return widget;
            }
        }
        // fallback to standalone editor
        return standaloneEditor;
    }
    getPaddingLeft(node, props) {
        if (this.viewMode === 'list') {
            if (props.depth === 1) {
                return this.props.expansionTogglePadding;
            }
        }
        return super.getPaddingLeft(node, props);
    }
    getDepthPadding(depth) {
        return super.getDepthPadding(depth) + 5;
    }
    isCurrentThemeLight() {
        const type = this.themeService.getCurrentTheme().type;
        return type.toLocaleLowerCase().includes('light');
    }
    needsExpansionTogglePadding(node) {
        const theme = this.iconThemeService.getDefinition(this.iconThemeService.current);
        if (theme && (theme.hidesExplorerArrows || (theme.hasFileIcons && !theme.hasFolderIcons))) {
            return false;
        }
        return super.needsExpansionTogglePadding(node);
    }
};
ScmTreeWidget.ID = 'scm-resource-widget';
ScmTreeWidget.RESOURCE_GROUP_CONTEXT_MENU = ['RESOURCE_GROUP_CONTEXT_MENU'];
ScmTreeWidget.RESOURCE_GROUP_INLINE_MENU = ['RESOURCE_GROUP_CONTEXT_MENU', 'inline'];
ScmTreeWidget.RESOURCE_FOLDER_CONTEXT_MENU = ['RESOURCE_FOLDER_CONTEXT_MENU'];
ScmTreeWidget.RESOURCE_FOLDER_INLINE_MENU = ['RESOURCE_FOLDER_CONTEXT_MENU', 'inline'];
ScmTreeWidget.RESOURCE_CONTEXT_MENU = ['RESOURCE_CONTEXT_MENU'];
ScmTreeWidget.RESOURCE_INLINE_MENU = ['RESOURCE_CONTEXT_MENU', 'inline'];
__decorate([
    (0, inversify_1.inject)(menu_1.MenuCommandExecutor),
    __metadata("design:type", Object)
], ScmTreeWidget.prototype, "menuCommandExecutor", void 0);
__decorate([
    (0, inversify_1.inject)(menu_1.MenuModelRegistry),
    __metadata("design:type", menu_1.MenuModelRegistry)
], ScmTreeWidget.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(scm_context_key_service_1.ScmContextKeyService),
    __metadata("design:type", scm_context_key_service_1.ScmContextKeyService)
], ScmTreeWidget.prototype, "contextKeys", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], ScmTreeWidget.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.DiffNavigatorProvider),
    __metadata("design:type", Function)
], ScmTreeWidget.prototype, "diffNavigatorProvider", void 0);
__decorate([
    (0, inversify_1.inject)(icon_theme_service_1.IconThemeService),
    __metadata("design:type", icon_theme_service_1.IconThemeService)
], ScmTreeWidget.prototype, "iconThemeService", void 0);
__decorate([
    (0, inversify_1.inject)(decorations_service_1.DecorationsService),
    __metadata("design:type", Object)
], ScmTreeWidget.prototype, "decorationsService", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], ScmTreeWidget.prototype, "colors", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], ScmTreeWidget.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmTreeWidget.prototype, "init", null);
ScmTreeWidget = ScmTreeWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tree_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(tree_1.TreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, scm_tree_model_1.ScmTreeModel,
        browser_1.ContextMenuRenderer])
], ScmTreeWidget);
exports.ScmTreeWidget = ScmTreeWidget;
(function (ScmTreeWidget) {
    let Styles;
    (function (Styles) {
        Styles.NO_SELECT = 'no-select';
    })(Styles = ScmTreeWidget.Styles || (ScmTreeWidget.Styles = {}));
})(ScmTreeWidget = exports.ScmTreeWidget || (exports.ScmTreeWidget = {}));
exports.ScmTreeWidget = ScmTreeWidget;
class ScmElement extends React.Component {
    constructor(props) {
        super(props);
        this.toDisposeOnUnmount = new disposable_1.DisposableCollection();
        this.detectHover = (element) => {
            if (element) {
                window.requestAnimationFrame(() => {
                    const hover = element.matches(':hover');
                    this.setState({ hover });
                });
            }
        };
        this.showHover = () => this.setState({ hover: true });
        this.hideHover = () => this.setState({ hover: false });
        this.renderContextMenu = (event) => {
            event.preventDefault();
            const { treeNode: node, contextMenuRenderer } = this.props;
            this.props.model.execInNodeContext(node, () => {
                contextMenuRenderer.render({
                    menuPath: this.contextMenuPath,
                    anchor: event.nativeEvent,
                    args: this.contextMenuArgs
                });
            });
        };
        this.state = {
            hover: false
        };
        const setState = this.setState.bind(this);
        this.setState = newState => {
            if (!this.toDisposeOnUnmount.disposed) {
                setState(newState);
            }
        };
    }
    componentDidMount() {
        this.toDisposeOnUnmount.push(disposable_1.Disposable.create(() => { }));
    }
    componentWillUnmount() {
        this.toDisposeOnUnmount.dispose();
    }
}
exports.ScmElement = ScmElement;
class ScmResourceComponent extends ScmElement {
    constructor() {
        super(...arguments);
        this.open = () => {
            const resource = this.props.model.getResourceFromNode(this.props.treeNode);
            if (resource) {
                resource.open();
            }
        };
        this.contextMenuPath = ScmTreeWidget.RESOURCE_CONTEXT_MENU;
        /**
         * Handle the single clicking of nodes present in the widget.
         */
        this.handleClick = (event) => {
            if (!this.hasCtrlCmdOrShiftMask(event)) {
                // Determine the behavior based on the preference value.
                const isSingle = this.props.corePreferences && this.props.corePreferences['workbench.list.openMode'] === 'singleClick';
                if (isSingle) {
                    this.open();
                }
            }
        };
        /**
         * Handle the double clicking of nodes present in the widget.
         */
        this.handleDoubleClick = () => {
            // Determine the behavior based on the preference value.
            const isDouble = this.props.corePreferences && this.props.corePreferences['workbench.list.openMode'] === 'doubleClick';
            // Nodes should only be opened through double clicking if the correct preference is set.
            if (isDouble) {
                this.open();
            }
        };
    }
    render() {
        var _a;
        const { hover } = this.state;
        const { model, treeNode, colors, parentPath, sourceUri, decoration, labelProvider, commandExecutor, menus, contextKeys, caption, isLightTheme } = this.props;
        const resourceUri = new uri_1.default(sourceUri);
        const decorationIcon = treeNode.decorations;
        const themedIcon = isLightTheme ? decorationIcon === null || decorationIcon === void 0 ? void 0 : decorationIcon.icon : decorationIcon === null || decorationIcon === void 0 ? void 0 : decorationIcon.iconDark;
        const classNames = themedIcon ? ['decoration-icon', themedIcon] : ['decoration-icon', 'status'];
        const icon = labelProvider.getIcon(resourceUri);
        const color = decoration && decoration.colorId && !themedIcon ? `var(${colors.toCssVariableName(decoration.colorId)})` : '';
        const letter = decoration && decoration.letter && !themedIcon ? decoration.letter : '';
        const tooltip = decoration && decoration.tooltip || '';
        const textDecoration = ((_a = treeNode.decorations) === null || _a === void 0 ? void 0 : _a.strikeThrough) === true ? 'line-through' : 'normal';
        const relativePath = parentPath.relative(resourceUri.parent);
        const path = relativePath ? relativePath.fsPath() : labelProvider.getLongName(resourceUri.parent);
        const title = tooltip.length !== 0
            ? `${resourceUri.path.fsPath()} • ${tooltip}`
            : resourceUri.path.fsPath();
        return React.createElement("div", { key: sourceUri, className: `scmItem ${tree_1.TREE_NODE_SEGMENT_CLASS} ${tree_1.TREE_NODE_SEGMENT_GROW_CLASS}`, onContextMenu: this.renderContextMenu, onMouseEnter: this.showHover, onMouseLeave: this.hideHover, ref: this.detectHover, title: title, onClick: this.handleClick, onDoubleClick: this.handleDoubleClick },
            React.createElement("span", { className: icon + ' file-icon' }),
            this.props.renderExpansionToggle(),
            React.createElement("div", { className: `noWrapInfo ${tree_1.TREE_NODE_SEGMENT_GROW_CLASS}` },
                React.createElement("span", { className: 'name', style: { textDecoration } }, caption),
                React.createElement("span", { className: 'path', style: { textDecoration } }, path)),
            React.createElement(ScmInlineActions, { ...{
                    hover,
                    menu: menus.getMenu(ScmTreeWidget.RESOURCE_INLINE_MENU),
                    menuPath: ScmTreeWidget.RESOURCE_INLINE_MENU,
                    commandExecutor,
                    args: this.contextMenuArgs,
                    contextKeys,
                    model,
                    treeNode
                } },
                React.createElement("div", { title: tooltip, className: classNames.join(' '), style: { color } }, letter)));
    }
    get contextMenuArgs() {
        if (!this.props.model.selectedNodes.some(node => scm_tree_model_1.ScmFileChangeNode.is(node) && node.sourceUri === this.props.sourceUri)) {
            // Clicked node is not in selection, so ignore selection and action on just clicked node
            return this.singleNodeArgs;
        }
        else {
            return this.props.model.getSelectionArgs(this.props.model.selectedNodes);
        }
    }
    get singleNodeArgs() {
        const selectedResource = this.props.model.getResourceFromNode(this.props.treeNode);
        if (selectedResource) {
            return [selectedResource];
        }
        else {
            // Repository status not yet available. Empty args disables the action.
            return [];
        }
    }
    hasCtrlCmdOrShiftMask(event) {
        const { metaKey, ctrlKey, shiftKey } = event;
        return (os_1.isOSX && metaKey) || ctrlKey || shiftKey;
    }
}
exports.ScmResourceComponent = ScmResourceComponent;
class ScmResourceGroupElement extends ScmElement {
    constructor() {
        super(...arguments);
        this.contextMenuPath = ScmTreeWidget.RESOURCE_GROUP_CONTEXT_MENU;
    }
    render() {
        const { hover } = this.state;
        const { model, treeNode, menus, commandExecutor, contextKeys, caption } = this.props;
        return React.createElement("div", { className: `theia-header scm-theia-header ${tree_1.TREE_NODE_SEGMENT_GROW_CLASS}`, onContextMenu: this.renderContextMenu, onMouseEnter: this.showHover, onMouseLeave: this.hideHover, ref: this.detectHover },
            this.props.renderExpansionToggle(),
            React.createElement("div", { className: `noWrapInfo ${tree_1.TREE_NODE_SEGMENT_GROW_CLASS}` }, caption),
            React.createElement(ScmInlineActions, { ...{
                    hover,
                    args: this.contextMenuArgs,
                    menu: menus.getMenu(ScmTreeWidget.RESOURCE_GROUP_INLINE_MENU),
                    menuPath: ScmTreeWidget.RESOURCE_GROUP_INLINE_MENU,
                    commandExecutor,
                    contextKeys,
                    model,
                    treeNode
                } }, this.renderChangeCount()));
    }
    renderChangeCount() {
        const group = this.props.model.getResourceGroupFromNode(this.props.treeNode);
        return React.createElement("div", { className: 'notification-count-container scm-change-count' },
            React.createElement("span", { className: 'notification-count' }, group ? group.resources.length : 0));
    }
    get contextMenuArgs() {
        const group = this.props.model.getResourceGroupFromNode(this.props.treeNode);
        if (group) {
            return [group];
        }
        else {
            // Repository status not yet available. Empty args disables the action.
            return [];
        }
    }
}
exports.ScmResourceGroupElement = ScmResourceGroupElement;
class ScmResourceFolderElement extends ScmElement {
    constructor() {
        super(...arguments);
        this.contextMenuPath = ScmTreeWidget.RESOURCE_FOLDER_CONTEXT_MENU;
    }
    render() {
        const { hover } = this.state;
        const { model, treeNode, sourceUri, labelProvider, commandExecutor, menus, contextKeys, caption } = this.props;
        const sourceFileStat = files_1.FileStat.dir(sourceUri);
        const icon = labelProvider.getIcon(sourceFileStat);
        const title = new uri_1.default(sourceUri).path.fsPath();
        return React.createElement("div", { key: sourceUri, className: `scmItem  ${tree_1.TREE_NODE_SEGMENT_CLASS} ${tree_1.TREE_NODE_SEGMENT_GROW_CLASS} ${ScmTreeWidget.Styles.NO_SELECT}`, title: title, onContextMenu: this.renderContextMenu, onMouseEnter: this.showHover, onMouseLeave: this.hideHover, ref: this.detectHover },
            this.props.renderExpansionToggle(),
            React.createElement("span", { className: icon + ' file-icon' }),
            React.createElement("div", { className: `noWrapInfo ${tree_1.TREE_NODE_SEGMENT_GROW_CLASS}` },
                React.createElement("span", { className: 'name' }, caption)),
            React.createElement(ScmInlineActions, { ...{
                    hover,
                    menu: menus.getMenu(ScmTreeWidget.RESOURCE_FOLDER_INLINE_MENU),
                    menuPath: ScmTreeWidget.RESOURCE_FOLDER_INLINE_MENU,
                    commandExecutor,
                    args: this.contextMenuArgs,
                    contextKeys,
                    model,
                    treeNode
                } }));
    }
    get contextMenuArgs() {
        if (!this.props.model.selectedNodes.some(node => scm_tree_model_1.ScmFileChangeFolderNode.is(node) && node.sourceUri === this.props.sourceUri)) {
            // Clicked node is not in selection, so ignore selection and action on just clicked node
            return this.singleNodeArgs;
        }
        else {
            return this.props.model.getSelectionArgs(this.props.model.selectedNodes);
        }
    }
    get singleNodeArgs() {
        return this.props.model.getResourcesFromFolderNode(this.props.treeNode);
    }
}
exports.ScmResourceFolderElement = ScmResourceFolderElement;
class ScmInlineActions extends React.Component {
    render() {
        const { hover, menu, menuPath, args, commandExecutor, model, treeNode, contextKeys, children } = this.props;
        return React.createElement("div", { className: 'theia-scm-inline-actions-container' },
            React.createElement("div", { className: 'theia-scm-inline-actions' }, hover && menu.children
                .map((node, index) => node instanceof menu_1.ActionMenuNode &&
                React.createElement(ScmInlineAction, { key: index, ...{ node, menuPath, args, commandExecutor, model, treeNode, contextKeys } }))),
            children);
    }
}
exports.ScmInlineActions = ScmInlineActions;
class ScmInlineAction extends React.Component {
    constructor() {
        super(...arguments);
        this.execute = (event) => {
            event.stopPropagation();
            const { commandExecutor, menuPath, node, args } = this.props;
            commandExecutor.executeCommand([menuPath[0]], node.command, ...args);
        };
    }
    render() {
        const { node, model, treeNode, args, commandExecutor, menuPath, contextKeys } = this.props;
        let isActive = false;
        model.execInNodeContext(treeNode, () => {
            isActive = contextKeys.match(node.when);
        });
        if (!commandExecutor.isVisible(menuPath, node.command, ...args) || !isActive) {
            return false;
        }
        return React.createElement("div", { className: 'theia-scm-inline-action' },
            React.createElement("a", { className: `${node.icon} ${browser_1.ACTION_ITEM}`, title: node.label, onClick: this.execute }));
    }
}
exports.ScmInlineAction = ScmInlineAction;
//# sourceMappingURL=scm-tree-widget.js.map