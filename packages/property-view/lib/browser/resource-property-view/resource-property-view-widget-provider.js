"use strict";
// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.ResourcePropertyViewWidgetProvider = void 0;
const browser_1 = require("@theia/core/lib/browser");
const file_selection_1 = require("@theia/filesystem/lib/browser/file-selection");
const inversify_1 = require("@theia/core/shared/inversify");
const property_view_widget_provider_1 = require("../property-view-widget-provider");
const resource_property_view_tree_widget_1 = require("./resource-property-view-tree-widget");
/**
 * Provides the {@link ResourcePropertyViewTreeWidget} for
 * {@link FileSelection}s and selections of {@link Navigatable}s.
 */
let ResourcePropertyViewWidgetProvider = class ResourcePropertyViewWidgetProvider extends property_view_widget_provider_1.DefaultPropertyViewWidgetProvider {
    constructor() {
        super(...arguments);
        this.id = 'resources';
        this.label = 'ResourcePropertyViewWidgetProvider';
    }
    canHandle(selection) {
        return (this.isFileSelection(selection) || this.isNavigatableSelection(selection)) ? 1 : 0;
    }
    isFileSelection(selection) {
        return !!selection && Array.isArray(selection) && file_selection_1.FileSelection.is(selection[0]);
    }
    isNavigatableSelection(selection) {
        return !!selection && browser_1.Navigatable.is(selection);
    }
    provideWidget(selection) {
        return Promise.resolve(this.treeWidget);
    }
    updateContentWidget(selection) {
        this.getPropertyDataService(selection).then(service => this.treeWidget.updatePropertyViewContent(service, selection));
    }
};
__decorate([
    (0, inversify_1.inject)(resource_property_view_tree_widget_1.ResourcePropertyViewTreeWidget),
    __metadata("design:type", resource_property_view_tree_widget_1.ResourcePropertyViewTreeWidget)
], ResourcePropertyViewWidgetProvider.prototype, "treeWidget", void 0);
ResourcePropertyViewWidgetProvider = __decorate([
    (0, inversify_1.injectable)()
], ResourcePropertyViewWidgetProvider);
exports.ResourcePropertyViewWidgetProvider = ResourcePropertyViewWidgetProvider;
//# sourceMappingURL=resource-property-view-widget-provider.js.map