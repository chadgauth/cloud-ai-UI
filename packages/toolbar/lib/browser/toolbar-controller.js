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
exports.ToolbarController = void 0;
const core_1 = require("@theia/core");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const inversify_1 = require("@theia/core/shared/inversify");
const toolbar_defaults_1 = require("./toolbar-defaults");
const toolbar_interfaces_1 = require("./toolbar-interfaces");
const toolbar_storage_provider_1 = require("./toolbar-storage-provider");
let ToolbarController = class ToolbarController {
    constructor() {
        this.toolbarModelDidUpdateEmitter = new core_1.Emitter();
        this.onToolbarModelDidUpdate = this.toolbarModelDidUpdateEmitter.event;
        this.toolbarProviderBusyEmitter = new core_1.Emitter();
        this.onToolbarDidChangeBusyState = this.toolbarProviderBusyEmitter.event;
        this.ready = new promise_util_1.Deferred();
    }
    get toolbarItems() {
        return this._toolbarItems;
    }
    set toolbarItems(newTree) {
        this._toolbarItems = newTree;
        this.toolbarModelDidUpdateEmitter.fire();
    }
    inflateItems(schema) {
        const newTree = {
            items: {
                [toolbar_interfaces_1.ToolbarAlignment.LEFT]: [],
                [toolbar_interfaces_1.ToolbarAlignment.CENTER]: [],
                [toolbar_interfaces_1.ToolbarAlignment.RIGHT]: [],
            },
        };
        for (const column of Object.keys(schema.items)) {
            const currentColumn = schema.items[column];
            for (const group of currentColumn) {
                const newGroup = [];
                for (const item of group) {
                    if (item.group === 'contributed') {
                        const contribution = this.getContributionByID(item.id);
                        if (contribution) {
                            newGroup.push(contribution);
                        }
                    }
                    else if (tab_bar_toolbar_1.TabBarToolbarItem.is(item)) {
                        newGroup.push({ ...item });
                    }
                }
                if (newGroup.length) {
                    newTree.items[column].push(newGroup);
                }
            }
        }
        return newTree;
    }
    getContributionByID(id) {
        return this.widgetContributions.getContributions().find(contribution => contribution.id === id);
    }
    init() {
        this.doInit();
    }
    async doInit() {
        await this.appState.reachedState('ready');
        await this.storageProvider.ready;
        this.toolbarItems = await this.resolveToolbarItems();
        this.storageProvider.onToolbarItemsChanged(async () => {
            this.toolbarItems = await this.resolveToolbarItems();
        });
        this.ready.resolve();
        this.widgetContributions.getContributions().forEach(contribution => {
            if (contribution.onDidChange) {
                contribution.onDidChange(() => this.toolbarModelDidUpdateEmitter.fire());
            }
        });
    }
    async resolveToolbarItems() {
        await this.storageProvider.ready;
        if (this.storageProvider.toolbarItems) {
            try {
                return this.inflateItems(this.storageProvider.toolbarItems);
            }
            catch (e) {
                this.messageService.error(toolbar_storage_provider_1.TOOLBAR_BAD_JSON_ERROR_MESSAGE);
            }
        }
        return this.inflateItems(this.defaultsFactory());
    }
    async swapValues(oldPosition, newPosition, direction) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.swapValues(oldPosition, newPosition, direction);
        });
    }
    async clearAll() {
        return this.withBusy(() => this.storageProvider.clearAll());
    }
    async openOrCreateJSONFile(doOpen = false) {
        return this.storageProvider.openOrCreateJSONFile(this.toolbarItems, doOpen);
    }
    async addItem(command, area) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.addItem(command, area);
        });
    }
    async removeItem(position, id) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.removeItem(position);
        });
    }
    async moveItemToEmptySpace(draggedItemPosition, column, centerPosition) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.moveItemToEmptySpace(draggedItemPosition, column, centerPosition);
        });
    }
    async insertGroup(position, insertDirection) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.insertGroup(position, insertDirection);
        });
    }
    async withBusy(action) {
        this.toolbarProviderBusyEmitter.fire(true);
        const toReturn = await action();
        this.toolbarProviderBusyEmitter.fire(false);
        return toReturn;
    }
};
__decorate([
    (0, inversify_1.inject)(toolbar_storage_provider_1.ToolbarStorageProvider),
    __metadata("design:type", toolbar_storage_provider_1.ToolbarStorageProvider)
], ToolbarController.prototype, "storageProvider", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], ToolbarController.prototype, "appState", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], ToolbarController.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_defaults_1.ToolbarDefaultsFactory),
    __metadata("design:type", Function)
], ToolbarController.prototype, "defaultsFactory", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(toolbar_interfaces_1.ToolbarContribution),
    __metadata("design:type", Object)
], ToolbarController.prototype, "widgetContributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarController.prototype, "init", null);
ToolbarController = __decorate([
    (0, inversify_1.injectable)()
], ToolbarController);
exports.ToolbarController = ToolbarController;
//# sourceMappingURL=toolbar-controller.js.map