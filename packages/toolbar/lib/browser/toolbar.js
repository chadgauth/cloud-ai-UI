"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.ToolbarImpl = exports.TOOLBAR_PROGRESSBAR_ID = void 0;
const React = require("@theia/core/shared/react");
const browser_1 = require("@theia/core/lib/browser");
const label_parser_1 = require("@theia/core/lib/browser/label-parser");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
const progress_bar_factory_1 = require("@theia/core/lib/browser/progress-bar-factory");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const toolbar_interfaces_1 = require("./toolbar-interfaces");
const toolbar_controller_1 = require("./toolbar-controller");
const toolbar_constants_1 = require("./toolbar-constants");
const TOOLBAR_BACKGROUND_DATA_ID = 'toolbar-wrapper';
exports.TOOLBAR_PROGRESSBAR_ID = 'main-toolbar-progress';
let ToolbarImpl = class ToolbarImpl extends tab_bar_toolbar_1.TabBarToolbar {
    constructor() {
        super(...arguments);
        this.deferredRef = new promise_util_1.Deferred();
        this.isBusyDeferred = new promise_util_1.Deferred();
        this.handleContextMenu = (e) => this.doHandleContextMenu(e);
        this.assignRef = (element) => this.doAssignRef(element);
        this.handleOnDragStart = (e) => this.doHandleOnDragStart(e);
        this.handleOnDragEnter = (e) => this.doHandleItemOnDragEnter(e);
        this.handleOnDragLeave = (e) => this.doHandleOnDragLeave(e);
        this.handleOnDrop = (e) => this.doHandleOnDrop(e);
        this.handleOnDragEnd = (e) => this.doHandleOnDragEnd(e);
    }
    init() {
        super.init();
        this.doInit();
    }
    async doInit() {
        this.hide();
        await this.model.ready.promise;
        this.updateInlineItems();
        this.update();
        this.model.onToolbarModelDidUpdate(() => {
            this.updateInlineItems();
            this.update();
        });
        this.model.onToolbarDidChangeBusyState(isBusy => {
            if (isBusy) {
                this.isBusyDeferred = new promise_util_1.Deferred();
                this.progressService.withProgress('', exports.TOOLBAR_PROGRESSBAR_ID, async () => this.isBusyDeferred.promise);
            }
            else {
                this.isBusyDeferred.resolve();
            }
        });
        await this.deferredRef.promise;
        this.progressFactory({ container: this.node, insertMode: 'append', locationId: exports.TOOLBAR_PROGRESSBAR_ID });
    }
    updateInlineItems() {
        var _a;
        this.inline.clear();
        const { items } = this.model.toolbarItems;
        const contextKeys = new Set();
        for (const column of Object.keys(items)) {
            for (const group of items[column]) {
                for (const item of group) {
                    this.inline.set(item.id, item);
                    if (item.when) {
                        (_a = this.contextKeyService.parseKeys(item.when)) === null || _a === void 0 ? void 0 : _a.forEach(key => contextKeys.add(key));
                    }
                }
            }
        }
        this.updateContextKeyListener(contextKeys);
    }
    doHandleContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        const contextMenuArgs = this.getContextMenuArgs(event);
        const { menuPath, anchor } = this.getMenuDetailsForClick(event);
        return this.contextMenuRenderer.render({
            args: contextMenuArgs,
            menuPath,
            anchor,
        });
    }
    getMenuDetailsForClick(event) {
        const clickId = event.currentTarget.getAttribute('data-id');
        let menuPath;
        let anchor;
        if (clickId === TOOLBAR_BACKGROUND_DATA_ID) {
            menuPath = toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU;
            const { clientX, clientY } = event;
            anchor = { x: clientX, y: clientY };
        }
        else {
            menuPath = toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU;
            const { left, bottom } = event.currentTarget.getBoundingClientRect();
            anchor = { x: left, y: bottom };
        }
        return { menuPath, anchor };
    }
    getContextMenuArgs(event) {
        const args = [this];
        // data-position is the stringified position of a given toolbar item, this allows
        // the model to be aware of start/stop positions during drag & drop and CRUD operations
        const position = event.currentTarget.getAttribute('data-position');
        const id = event.currentTarget.getAttribute('data-id');
        if (position) {
            args.push(JSON.parse(position));
        }
        else if (id) {
            args.push(id);
        }
        return args;
    }
    renderGroupsInColumn(groups, alignment) {
        const nodes = [];
        groups.forEach((group, groupIndex) => {
            if (nodes.length && group.length) {
                nodes.push(React.createElement("div", { key: `toolbar-separator-${groupIndex}`, className: 'separator' }));
            }
            group.forEach((item, itemIndex) => {
                const position = { alignment, groupIndex, itemIndex };
                nodes.push(this.renderItemWithDraggableWrapper(item, position));
            });
        });
        return nodes;
    }
    doAssignRef(element) {
        this.deferredRef.resolve(element);
    }
    render() {
        var _a, _b, _c;
        const leftGroups = (_a = this.model.toolbarItems) === null || _a === void 0 ? void 0 : _a.items[toolbar_interfaces_1.ToolbarAlignment.LEFT];
        const centerGroups = (_b = this.model.toolbarItems) === null || _b === void 0 ? void 0 : _b.items[toolbar_interfaces_1.ToolbarAlignment.CENTER];
        const rightGroups = (_c = this.model.toolbarItems) === null || _c === void 0 ? void 0 : _c.items[toolbar_interfaces_1.ToolbarAlignment.RIGHT];
        return (React.createElement("div", { className: 'toolbar-wrapper', onContextMenu: this.handleContextMenu, "data-id": TOOLBAR_BACKGROUND_DATA_ID, role: 'menu', tabIndex: 0, ref: this.assignRef },
            this.renderColumnWrapper(toolbar_interfaces_1.ToolbarAlignment.LEFT, leftGroups),
            this.renderColumnWrapper(toolbar_interfaces_1.ToolbarAlignment.CENTER, centerGroups),
            this.renderColumnWrapper(toolbar_interfaces_1.ToolbarAlignment.RIGHT, rightGroups)));
    }
    renderColumnWrapper(alignment, columnGroup) {
        let children;
        if (alignment === toolbar_interfaces_1.ToolbarAlignment.LEFT) {
            children = (React.createElement(React.Fragment, null,
                this.renderGroupsInColumn(columnGroup, alignment),
                this.renderColumnSpace(alignment)));
        }
        else if (alignment === toolbar_interfaces_1.ToolbarAlignment.CENTER) {
            const isCenterColumnEmpty = !columnGroup.length;
            if (isCenterColumnEmpty) {
                children = this.renderColumnSpace(alignment, 'left');
            }
            else {
                children = (React.createElement(React.Fragment, null,
                    this.renderColumnSpace(alignment, 'left'),
                    this.renderGroupsInColumn(columnGroup, alignment),
                    this.renderColumnSpace(alignment, 'right')));
            }
        }
        else if (alignment === toolbar_interfaces_1.ToolbarAlignment.RIGHT) {
            children = (React.createElement(React.Fragment, null,
                this.renderColumnSpace(alignment),
                this.renderGroupsInColumn(columnGroup, alignment)));
        }
        return (React.createElement("div", { role: 'group', className: `toolbar-column ${alignment}` }, children));
    }
    renderColumnSpace(alignment, position) {
        return (React.createElement("div", { className: 'empty-column-space', "data-column": `${alignment}`, "data-center-position": position, onDrop: this.handleOnDrop, onDragOver: this.handleOnDragEnter, onDragEnter: this.handleOnDragEnter, onDragLeave: this.handleOnDragLeave, key: `column-space-${alignment}-${position}` }));
    }
    renderItemWithDraggableWrapper(item, position) {
        const stringifiedPosition = JSON.stringify(position);
        let toolbarItemClassNames = '';
        let renderBody;
        if (tab_bar_toolbar_1.TabBarToolbarItem.is(item)) {
            toolbarItemClassNames = tab_bar_toolbar_1.TabBarToolbar.Styles.TAB_BAR_TOOLBAR_ITEM;
            if (this.evaluateWhenClause(item.when)) {
                toolbarItemClassNames += ' enabled';
            }
            renderBody = this.renderItem(item);
        }
        else {
            const contribution = this.model.getContributionByID(item.id);
            if (contribution) {
                renderBody = contribution.render();
            }
        }
        return (React.createElement("div", { role: 'button', tabIndex: 0, "data-id": item.id, id: item.id, "data-position": stringifiedPosition, key: `${item.id}-${stringifiedPosition}`, className: `${toolbarItemClassNames} toolbar-item action-label`, onMouseDown: this.onMouseDownEvent, onMouseUp: this.onMouseUpEvent, onMouseOut: this.onMouseUpEvent, draggable: true, onDragStart: this.handleOnDragStart, onClick: this.executeCommand, onDragOver: this.handleOnDragEnter, onDragLeave: this.handleOnDragLeave, onContextMenu: this.handleContextMenu, onDragEnd: this.handleOnDragEnd, onDrop: this.handleOnDrop },
            renderBody,
            React.createElement("div", { className: 'hover-overlay' })));
    }
    renderItem(item) {
        const classNames = [];
        if (item.text) {
            for (const labelPart of this.labelParser.parse(item.text)) {
                if (typeof labelPart !== 'string' && label_parser_1.LabelIcon.is(labelPart)) {
                    const className = `fa fa-${labelPart.name}${labelPart.animation ? ' fa-' + labelPart.animation : ''}`;
                    classNames.push(...className.split(' '));
                }
            }
        }
        const command = this.commands.getCommand(item.command);
        const iconClass = (typeof item.icon === 'function' && item.icon()) || item.icon || (command === null || command === void 0 ? void 0 : command.iconClass);
        if (iconClass) {
            classNames.push(iconClass);
        }
        let itemTooltip = '';
        if (item.tooltip) {
            itemTooltip = item.tooltip;
        }
        else if (command === null || command === void 0 ? void 0 : command.label) {
            itemTooltip = command.label;
        }
        const keybindingString = this.resolveKeybindingForCommand(command === null || command === void 0 ? void 0 : command.id);
        itemTooltip = `${itemTooltip}${keybindingString}`;
        return (React.createElement("div", { id: item.id, className: classNames.join(' '), title: itemTooltip }));
    }
    doHandleOnDragStart(e) {
        var _a;
        const draggedElement = e.currentTarget;
        draggedElement.classList.add('dragging');
        e.dataTransfer.setDragImage(draggedElement, 0, 0);
        const position = JSON.parse((_a = e.currentTarget.getAttribute('data-position')) !== null && _a !== void 0 ? _a : '');
        this.currentlyDraggedItem = e.currentTarget;
        this.draggedStartingPosition = position;
    }
    doHandleItemOnDragEnter(e) {
        var _a;
        e.preventDefault();
        e.stopPropagation();
        const targetItemDOMElement = e.currentTarget;
        const targetItemHoverOverlay = targetItemDOMElement.querySelector('.hover-overlay');
        const targetItemId = e.currentTarget.getAttribute('data-id');
        if (targetItemDOMElement.classList.contains('empty-column-space')) {
            targetItemDOMElement.classList.add('drag-over');
        }
        else if (targetItemDOMElement.classList.contains('toolbar-item') && targetItemHoverOverlay) {
            const { clientX } = e;
            const { left, right } = e.currentTarget.getBoundingClientRect();
            const targetMiddleX = (left + right) / 2;
            if (targetItemId !== ((_a = this.currentlyDraggedItem) === null || _a === void 0 ? void 0 : _a.getAttribute('data-id'))) {
                targetItemHoverOverlay.classList.add('drag-over');
                if (clientX <= targetMiddleX) {
                    targetItemHoverOverlay.classList.add('location-left');
                    targetItemHoverOverlay.classList.remove('location-right');
                }
                else {
                    targetItemHoverOverlay.classList.add('location-right');
                    targetItemHoverOverlay.classList.remove('location-left');
                }
            }
        }
    }
    doHandleOnDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetItemDOMElement = e.currentTarget;
        const targetItemHoverOverlay = targetItemDOMElement.querySelector('.hover-overlay');
        if (targetItemDOMElement.classList.contains('empty-column-space')) {
            targetItemDOMElement.classList.remove('drag-over');
        }
        else if (targetItemHoverOverlay && targetItemDOMElement.classList.contains('toolbar-item')) {
            targetItemHoverOverlay === null || targetItemHoverOverlay === void 0 ? void 0 : targetItemHoverOverlay.classList.remove('drag-over', 'location-left', 'location-right');
        }
    }
    doHandleOnDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetItemDOMElement = e.currentTarget;
        const targetItemHoverOverlay = targetItemDOMElement.querySelector('.hover-overlay');
        if (targetItemDOMElement.classList.contains('empty-column-space')) {
            this.handleDropInEmptySpace(targetItemDOMElement);
            targetItemDOMElement.classList.remove('drag-over');
        }
        else if (targetItemHoverOverlay && targetItemDOMElement.classList.contains('toolbar-item')) {
            this.handleDropInExistingGroup(targetItemDOMElement);
            targetItemHoverOverlay.classList.remove('drag-over', 'location-left', 'location-right');
        }
        this.currentlyDraggedItem = undefined;
        this.draggedStartingPosition = undefined;
    }
    handleDropInExistingGroup(element) {
        var _a;
        const position = element.getAttribute('data-position');
        const targetDirection = (_a = element.querySelector('.hover-overlay')) === null || _a === void 0 ? void 0 : _a.classList.toString().split(' ').find(className => className.includes('location'));
        const dropPosition = JSON.parse(position !== null && position !== void 0 ? position : '');
        if (this.currentlyDraggedItem && targetDirection
            && this.draggedStartingPosition && !this.arePositionsEquivalent(this.draggedStartingPosition, dropPosition)) {
            this.model.swapValues(this.draggedStartingPosition, dropPosition, targetDirection);
        }
    }
    handleDropInEmptySpace(element) {
        const column = element.getAttribute('data-column');
        if (toolbar_interfaces_1.ToolbarAlignmentString.is(column) && this.draggedStartingPosition) {
            if (column === toolbar_interfaces_1.ToolbarAlignment.CENTER) {
                const centerPosition = element.getAttribute('data-center-position');
                this.model.moveItemToEmptySpace(this.draggedStartingPosition, column, centerPosition);
            }
            else {
                this.model.moveItemToEmptySpace(this.draggedStartingPosition, column);
            }
        }
    }
    arePositionsEquivalent(start, end) {
        return start.alignment === end.alignment
            && start.groupIndex === end.groupIndex
            && start.itemIndex === end.itemIndex;
    }
    doHandleOnDragEnd(e) {
        e.preventDefault();
        e.stopPropagation();
        this.currentlyDraggedItem = undefined;
        this.draggedStartingPosition = undefined;
        e.currentTarget.classList.remove('dragging');
    }
};
__decorate([
    (0, inversify_1.inject)(tab_bar_toolbar_1.TabBarToolbarFactory),
    __metadata("design:type", Function)
], ToolbarImpl.prototype, "tabbarToolbarFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], ToolbarImpl.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], ToolbarImpl.prototype, "appState", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_controller_1.ToolbarController),
    __metadata("design:type", toolbar_controller_1.ToolbarController)
], ToolbarImpl.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], ToolbarImpl.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], ToolbarImpl.prototype, "keybindingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(progress_bar_factory_1.ProgressBarFactory),
    __metadata("design:type", Function)
], ToolbarImpl.prototype, "progressFactory", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ProgressService),
    __metadata("design:type", core_1.ProgressService)
], ToolbarImpl.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarImpl.prototype, "init", null);
ToolbarImpl = __decorate([
    (0, inversify_1.injectable)()
], ToolbarImpl);
exports.ToolbarImpl = ToolbarImpl;
//# sourceMappingURL=toolbar.js.map