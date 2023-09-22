"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.SampleUpdaterFrontendContribution = exports.ElectronMenuUpdater = exports.SampleUpdaterClientImpl = exports.SampleUpdaterMenu = exports.SampleUpdaterCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
const electron_main_menu_factory_1 = require("@theia/core/lib/electron-browser/menu/electron-main-menu-factory");
const frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
const sample_updater_1 = require("../../common/updater/sample-updater");
var SampleUpdaterCommands;
(function (SampleUpdaterCommands) {
    const category = 'Electron Updater Sample';
    SampleUpdaterCommands.CHECK_FOR_UPDATES = {
        id: 'electron-sample:check-for-updates',
        label: 'Check for Updates...',
        category
    };
    SampleUpdaterCommands.RESTART_TO_UPDATE = {
        id: 'electron-sample:restart-to-update',
        label: 'Restart to Update',
        category
    };
    // Mock
    SampleUpdaterCommands.MOCK_UPDATE_AVAILABLE = {
        id: 'electron-sample:mock-update-available',
        label: 'Mock - Available',
        category
    };
    SampleUpdaterCommands.MOCK_UPDATE_NOT_AVAILABLE = {
        id: 'electron-sample:mock-update-not-available',
        label: 'Mock - Not Available',
        category
    };
})(SampleUpdaterCommands = exports.SampleUpdaterCommands || (exports.SampleUpdaterCommands = {}));
var SampleUpdaterMenu;
(function (SampleUpdaterMenu) {
    SampleUpdaterMenu.MENU_PATH = [...browser_1.CommonMenus.FILE_SETTINGS_SUBMENU, '3_settings_submenu_update'];
})(SampleUpdaterMenu = exports.SampleUpdaterMenu || (exports.SampleUpdaterMenu = {}));
let SampleUpdaterClientImpl = class SampleUpdaterClientImpl {
    constructor() {
        this.onReadyToInstallEmitter = new common_1.Emitter();
        this.onReadyToInstall = this.onReadyToInstallEmitter.event;
    }
    notifyReadyToInstall() {
        this.onReadyToInstallEmitter.fire();
    }
};
SampleUpdaterClientImpl = __decorate([
    (0, inversify_1.injectable)()
], SampleUpdaterClientImpl);
exports.SampleUpdaterClientImpl = SampleUpdaterClientImpl;
// Dynamic menus aren't yet supported by electron: https://github.com/eclipse-theia/theia/issues/446
let ElectronMenuUpdater = class ElectronMenuUpdater {
    update() {
        this.setMenu();
    }
    setMenu() {
        window.electronTheiaCore.setMenu(this.factory.createElectronMenuBar());
    }
};
__decorate([
    (0, inversify_1.inject)(electron_main_menu_factory_1.ElectronMainMenuFactory),
    __metadata("design:type", electron_main_menu_factory_1.ElectronMainMenuFactory)
], ElectronMenuUpdater.prototype, "factory", void 0);
ElectronMenuUpdater = __decorate([
    (0, inversify_1.injectable)()
], ElectronMenuUpdater);
exports.ElectronMenuUpdater = ElectronMenuUpdater;
let SampleUpdaterFrontendContribution = class SampleUpdaterFrontendContribution {
    constructor() {
        this.readyToUpdate = false;
    }
    init() {
        this.updaterClient.onReadyToInstall(async () => {
            this.readyToUpdate = true;
            this.menuUpdater.update();
            this.handleUpdatesAvailable();
        });
    }
    registerCommands(registry) {
        registry.registerCommand(SampleUpdaterCommands.CHECK_FOR_UPDATES, {
            execute: async () => {
                const { status } = await this.updater.checkForUpdates();
                switch (status) {
                    case sample_updater_1.UpdateStatus.Available: {
                        this.handleUpdatesAvailable();
                        break;
                    }
                    case sample_updater_1.UpdateStatus.NotAvailable: {
                        const { applicationName } = frontend_application_config_provider_1.FrontendApplicationConfigProvider.get();
                        this.messageService.info(`[Not Available]: You’re all good. You’ve got the latest version of ${applicationName}.`, { timeout: 3000 });
                        break;
                    }
                    case sample_updater_1.UpdateStatus.InProgress: {
                        this.messageService.warn('[Downloading]: Work in progress...', { timeout: 3000 });
                        break;
                    }
                    default: throw new Error(`Unexpected status: ${status}`);
                }
            },
            isEnabled: () => !this.readyToUpdate,
            isVisible: () => !this.readyToUpdate
        });
        registry.registerCommand(SampleUpdaterCommands.RESTART_TO_UPDATE, {
            execute: () => this.updater.onRestartToUpdateRequested(),
            isEnabled: () => this.readyToUpdate,
            isVisible: () => this.readyToUpdate
        });
        registry.registerCommand(SampleUpdaterCommands.MOCK_UPDATE_AVAILABLE, {
            execute: () => this.updater.setUpdateAvailable(true)
        });
        registry.registerCommand(SampleUpdaterCommands.MOCK_UPDATE_NOT_AVAILABLE, {
            execute: () => this.updater.setUpdateAvailable(false)
        });
    }
    registerMenus(registry) {
        registry.registerMenuAction(SampleUpdaterMenu.MENU_PATH, {
            commandId: SampleUpdaterCommands.CHECK_FOR_UPDATES.id
        });
        registry.registerMenuAction(SampleUpdaterMenu.MENU_PATH, {
            commandId: SampleUpdaterCommands.RESTART_TO_UPDATE.id
        });
    }
    async handleUpdatesAvailable() {
        const answer = await this.messageService.info('[Available]: Found updates, do you want update now?', 'No', 'Yes');
        if (answer === 'Yes') {
            this.updater.onRestartToUpdateRequested();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], SampleUpdaterFrontendContribution.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(ElectronMenuUpdater),
    __metadata("design:type", ElectronMenuUpdater)
], SampleUpdaterFrontendContribution.prototype, "menuUpdater", void 0);
__decorate([
    (0, inversify_1.inject)(sample_updater_1.SampleUpdater),
    __metadata("design:type", Object)
], SampleUpdaterFrontendContribution.prototype, "updater", void 0);
__decorate([
    (0, inversify_1.inject)(SampleUpdaterClientImpl),
    __metadata("design:type", SampleUpdaterClientImpl)
], SampleUpdaterFrontendContribution.prototype, "updaterClient", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SampleUpdaterFrontendContribution.prototype, "init", null);
SampleUpdaterFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], SampleUpdaterFrontendContribution);
exports.SampleUpdaterFrontendContribution = SampleUpdaterFrontendContribution;
//# sourceMappingURL=sample-updater-frontend-contribution.js.map