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
exports.DefaultPropertyViewWidgetProvider = exports.PropertyViewWidgetProvider = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const property_data_service_1 = require("./property-data-service");
exports.PropertyViewWidgetProvider = Symbol('PropertyViewWidgetProvider');
/**
 * The `DefaultPropertyViewWidgetProvider` is the default abstract implementation of the {@link PropertyViewWidgetProvider}
 * and should be extended to provide a property view content widget for the given selection.
 */
let DefaultPropertyViewWidgetProvider = class DefaultPropertyViewWidgetProvider {
    constructor() {
        this.propertyDataServices = [];
        this.id = 'default';
        this.label = 'DefaultPropertyViewWidgetProvider';
    }
    init() {
        this.propertyDataServices = this.propertyDataServices.concat(this.contributions.getContributions());
    }
    canHandle(selection) {
        return 0;
    }
    provideWidget(selection) {
        throw new Error('not implemented');
    }
    updateContentWidget(selection) {
        // no-op
    }
    async getPropertyDataService(selection) {
        const dataService = await this.prioritize(selection);
        return dataService !== null && dataService !== void 0 ? dataService : this.propertyDataServices[0];
    }
    async prioritize(selection) {
        const prioritized = await core_1.Prioritizeable.prioritizeAll(this.propertyDataServices, async (service) => {
            try {
                return service.canHandleSelection(selection);
            }
            catch {
                return 0;
            }
        });
        return prioritized.length !== 0 ? prioritized[0].value : undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(property_data_service_1.PropertyDataService),
    __metadata("design:type", Object)
], DefaultPropertyViewWidgetProvider.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DefaultPropertyViewWidgetProvider.prototype, "init", null);
DefaultPropertyViewWidgetProvider = __decorate([
    (0, inversify_1.injectable)()
], DefaultPropertyViewWidgetProvider);
exports.DefaultPropertyViewWidgetProvider = DefaultPropertyViewWidgetProvider;
//# sourceMappingURL=property-view-widget-provider.js.map