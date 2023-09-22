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
exports.PropertyViewService = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const empty_property_view_widget_provider_1 = require("./empty-property-view-widget-provider");
const property_view_widget_provider_1 = require("./property-view-widget-provider");
/**
 * `PropertyViewService` provides an access to existing property view widget providers.
 */
let PropertyViewService = class PropertyViewService {
    constructor() {
        this.providers = [];
    }
    init() {
        this.providers = this.providers.concat(this.contributions.getContributions());
    }
    /**
     * Return a property view widget provider with the highest priority for the given selection.
     * Never reject, return the default provider ({@link EmptyPropertyViewWidgetProvider};
     * displays `No properties available`) if there are no other matches.
     */
    async getProvider(selection) {
        const provider = await this.prioritize(selection);
        return provider !== null && provider !== void 0 ? provider : this.emptyWidgetProvider;
    }
    async prioritize(selection) {
        const prioritized = await core_1.Prioritizeable.prioritizeAll(this.providers, async (provider) => {
            try {
                return await provider.canHandle(selection);
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
    (0, inversify_1.named)(property_view_widget_provider_1.PropertyViewWidgetProvider),
    __metadata("design:type", Object)
], PropertyViewService.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.inject)(empty_property_view_widget_provider_1.EmptyPropertyViewWidgetProvider),
    __metadata("design:type", empty_property_view_widget_provider_1.EmptyPropertyViewWidgetProvider)
], PropertyViewService.prototype, "emptyWidgetProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PropertyViewService.prototype, "init", null);
PropertyViewService = __decorate([
    (0, inversify_1.injectable)()
], PropertyViewService);
exports.PropertyViewService = PropertyViewService;
//# sourceMappingURL=property-view-service.js.map