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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("@theia/core/shared/inversify");
const electron_main_menu_factory_1 = require("@theia/core/lib/electron-browser/menu/electron-main-menu-factory");
const sample_menu_contribution_1 = require("../../browser/menu/sample-menu-contribution");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(electron_main_menu_factory_1.ElectronMainMenuFactory).to(SampleElectronMainMenuFactory).inSingletonScope();
});
let SampleElectronMainMenuFactory = class SampleElectronMainMenuFactory extends electron_main_menu_factory_1.ElectronMainMenuFactory {
    fillMenuTemplate(parentItems, menu, args = [], options) {
        if (menu instanceof sample_menu_contribution_1.PlaceholderMenuNode) {
            parentItems.push({ label: menu.label, enabled: false, visible: true });
        }
        else {
            super.fillMenuTemplate(parentItems, menu, args, options);
        }
        return parentItems;
    }
};
SampleElectronMainMenuFactory = __decorate([
    (0, inversify_1.injectable)()
], SampleElectronMainMenuFactory);
//# sourceMappingURL=sample-electron-menu-module.js.map