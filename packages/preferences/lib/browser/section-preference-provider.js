"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.SectionPreferenceProvider = exports.SectionPreferenceProviderSection = exports.SectionPreferenceProviderUri = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const abstract_resource_preference_provider_1 = require("./abstract-resource-preference-provider");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
exports.SectionPreferenceProviderUri = Symbol('SectionPreferenceProviderUri');
exports.SectionPreferenceProviderSection = Symbol('SectionPreferenceProviderSection');
/**
 * This class encapsulates the logic of using separate files for some workspace configuration like 'launch.json' or 'tasks.json'.
 * Anything that is not a contributed section will be in the main config file.
 */
let SectionPreferenceProvider = class SectionPreferenceProvider extends abstract_resource_preference_provider_1.AbstractResourcePreferenceProvider {
    get isSection() {
        if (typeof this._isSection === 'undefined') {
            this._isSection = this.preferenceConfigurations.isSectionName(this.section);
        }
        return this._isSection;
    }
    getUri() {
        return this.uri;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse(content) {
        const prefs = super.parse(content);
        if (this.isSection) {
            if (prefs === undefined) {
                return undefined;
            }
            const result = {};
            result[this.section] = { ...prefs };
            return result;
        }
        else {
            return prefs;
        }
    }
    getPath(preferenceName) {
        if (!this.isSection) {
            return super.getPath(preferenceName);
        }
        if (preferenceName === this.section) {
            return [];
        }
        if (preferenceName.startsWith(`${this.section}.`)) {
            return [preferenceName.slice(this.section.length + 1)];
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], SectionPreferenceProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(exports.SectionPreferenceProviderUri),
    __metadata("design:type", uri_1.default)
], SectionPreferenceProvider.prototype, "uri", void 0);
__decorate([
    (0, inversify_1.inject)(exports.SectionPreferenceProviderSection),
    __metadata("design:type", String)
], SectionPreferenceProvider.prototype, "section", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], SectionPreferenceProvider.prototype, "preferenceConfigurations", void 0);
SectionPreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], SectionPreferenceProvider);
exports.SectionPreferenceProvider = SectionPreferenceProvider;
//# sourceMappingURL=section-preference-provider.js.map