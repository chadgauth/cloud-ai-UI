"use strict";
// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
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
var AdditionalViewsMenuWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionalViewsMenuWidget = exports.ADDITIONAL_VIEWS_MENU_PATH = exports.AdditionalViewsMenuWidgetFactory = void 0;
const inversify_1 = require("../../../shared/inversify");
const common_1 = require("../../common");
const widgets_1 = require("../widgets");
const sidebar_menu_widget_1 = require("./sidebar-menu-widget");
exports.AdditionalViewsMenuWidgetFactory = Symbol('AdditionalViewsMenuWidgetFactory');
exports.ADDITIONAL_VIEWS_MENU_PATH = ['additional_views_menu'];
let AdditionalViewsMenuWidget = AdditionalViewsMenuWidget_1 = class AdditionalViewsMenuWidget extends sidebar_menu_widget_1.SidebarMenuWidget {
    constructor() {
        super(...arguments);
        this.menuDisposables = [];
    }
    updateAdditionalViews(sender, event) {
        if (event.startIndex === -1) {
            this.removeMenu(AdditionalViewsMenuWidget_1.ID);
        }
        else {
            this.addMenu({
                title: common_1.nls.localizeByDefault('Additional Views'),
                iconClass: (0, widgets_1.codicon)('ellipsis'),
                id: AdditionalViewsMenuWidget_1.ID,
                menuPath: exports.ADDITIONAL_VIEWS_MENU_PATH,
                order: 0
            });
        }
        this.menuDisposables.forEach(disposable => disposable.dispose());
        this.menuDisposables = [];
        event.titles.forEach((title, i) => this.registerMenuAction(sender, title, i));
    }
    registerMenuAction(sender, title, index) {
        const command = { id: `reveal.${title.label}.${index}`, label: title.label };
        this.menuDisposables.push(this.commandRegistry.registerCommand(command, {
            execute: () => {
                window.requestAnimationFrame(() => {
                    sender.currentIndex = sender.titles.indexOf(title);
                });
            }
        }));
        this.menuDisposables.push(this.menuModelRegistry.registerMenuAction(exports.ADDITIONAL_VIEWS_MENU_PATH, { commandId: command.id, order: index.toString() }));
    }
};
AdditionalViewsMenuWidget.ID = 'sidebar.additional.views';
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], AdditionalViewsMenuWidget.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], AdditionalViewsMenuWidget.prototype, "menuModelRegistry", void 0);
AdditionalViewsMenuWidget = AdditionalViewsMenuWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], AdditionalViewsMenuWidget);
exports.AdditionalViewsMenuWidget = AdditionalViewsMenuWidget;
//# sourceMappingURL=additional-views-menu-widget.js.map