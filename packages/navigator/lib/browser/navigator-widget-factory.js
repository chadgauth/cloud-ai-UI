"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
var NavigatorWidgetFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigatorWidgetFactory = exports.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS = exports.EXPLORER_VIEW_CONTAINER_ID = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const navigator_widget_1 = require("./navigator-widget");
const navigator_open_editors_widget_1 = require("./open-editors-widget/navigator-open-editors-widget");
const nls_1 = require("@theia/core/lib/common/nls");
exports.EXPLORER_VIEW_CONTAINER_ID = 'explorer-view-container';
exports.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS = {
    label: nls_1.nls.localizeByDefault('Explorer'),
    iconClass: (0, browser_1.codicon)('files'),
    closeable: true
};
let NavigatorWidgetFactory = NavigatorWidgetFactory_1 = class NavigatorWidgetFactory {
    constructor() {
        this.id = NavigatorWidgetFactory_1.ID;
        this.openEditorsWidgetOptions = {
            order: 0,
            canHide: true,
            initiallyCollapsed: true,
            // this property currently has no effect (https://github.com/eclipse-theia/theia/issues/7755)
            weight: 20
        };
        this.fileNavigatorWidgetOptions = {
            order: 1,
            canHide: false,
            initiallyCollapsed: false,
            weight: 80,
            disableDraggingToOtherContainers: true
        };
    }
    async createWidget() {
        const viewContainer = this.viewContainerFactory({
            id: exports.EXPLORER_VIEW_CONTAINER_ID,
            progressLocationId: 'explorer'
        });
        viewContainer.setTitleOptions(exports.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS);
        const openEditorsWidget = await this.widgetManager.getOrCreateWidget(navigator_open_editors_widget_1.OpenEditorsWidget.ID);
        const navigatorWidget = await this.widgetManager.getOrCreateWidget(navigator_widget_1.FILE_NAVIGATOR_ID);
        viewContainer.addWidget(navigatorWidget, this.fileNavigatorWidgetOptions);
        viewContainer.addWidget(openEditorsWidget, this.openEditorsWidgetOptions);
        return viewContainer;
    }
};
NavigatorWidgetFactory.ID = exports.EXPLORER_VIEW_CONTAINER_ID;
__decorate([
    (0, inversify_1.inject)(browser_1.ViewContainer.Factory),
    __metadata("design:type", Function)
], NavigatorWidgetFactory.prototype, "viewContainerFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], NavigatorWidgetFactory.prototype, "widgetManager", void 0);
NavigatorWidgetFactory = NavigatorWidgetFactory_1 = __decorate([
    (0, inversify_1.injectable)()
], NavigatorWidgetFactory);
exports.NavigatorWidgetFactory = NavigatorWidgetFactory;
//# sourceMappingURL=navigator-widget-factory.js.map