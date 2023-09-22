"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.WorkspaceFilePreferenceProvider = exports.WorkspaceFilePreferenceProviderFactory = exports.WorkspaceFilePreferenceProviderOptions = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const preferences_1 = require("@theia/core/lib/browser/preferences");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const abstract_resource_preference_provider_1 = require("./abstract-resource-preference-provider");
let WorkspaceFilePreferenceProviderOptions = class WorkspaceFilePreferenceProviderOptions {
};
WorkspaceFilePreferenceProviderOptions = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceFilePreferenceProviderOptions);
exports.WorkspaceFilePreferenceProviderOptions = WorkspaceFilePreferenceProviderOptions;
exports.WorkspaceFilePreferenceProviderFactory = Symbol('WorkspaceFilePreferenceProviderFactory');
let WorkspaceFilePreferenceProvider = class WorkspaceFilePreferenceProvider extends abstract_resource_preference_provider_1.AbstractResourcePreferenceProvider {
    constructor() {
        super(...arguments);
        this.sectionsInsideSettings = new Set();
    }
    getUri() {
        return this.options.workspaceUri;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse(content) {
        const data = super.parse(content);
        if (workspace_service_1.WorkspaceData.is(data)) {
            const settings = { ...data.settings };
            for (const key of this.configurations.getSectionNames().filter(name => name !== 'settings')) {
                // If the user has written configuration inside the "settings" object, we will respect that.
                if (settings[key]) {
                    this.sectionsInsideSettings.add(key);
                }
                // Favor sections outside the "settings" object to agree with VSCode behavior
                if (data[key]) {
                    settings[key] = data[key];
                    this.sectionsInsideSettings.delete(key);
                }
            }
            return settings;
        }
        return {};
    }
    getPath(preferenceName) {
        var _a;
        const firstSegment = preferenceName.split('.', 1)[0];
        const remainder = preferenceName.slice(firstSegment.length + 1);
        if (this.belongsInSection(firstSegment, remainder)) {
            // Default to writing sections outside the "settings" object.
            const path = [firstSegment];
            if (remainder) {
                path.push(remainder);
            }
            // If the user has already written this section inside the "settings" object, modify it there.
            if (this.sectionsInsideSettings.has(firstSegment)) {
                path.unshift('settings');
            }
            return path;
        }
        return ['settings'].concat((_a = super.getPath(preferenceName)) !== null && _a !== void 0 ? _a : []);
    }
    /**
     * @returns `true` if `firstSegment` is a section name (e.g. `tasks`, `launch`)
     */
    belongsInSection(firstSegment, remainder) {
        return this.configurations.isSectionName(firstSegment);
    }
    getScope() {
        return preferences_1.PreferenceScope.Workspace;
    }
    getDomain() {
        // workspace file is treated as part of the workspace
        return this.workspaceService.tryGetRoots().map(r => r.resource.toString()).concat([this.options.workspaceUri.toString()]);
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceFilePreferenceProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(WorkspaceFilePreferenceProviderOptions),
    __metadata("design:type", WorkspaceFilePreferenceProviderOptions)
], WorkspaceFilePreferenceProvider.prototype, "options", void 0);
WorkspaceFilePreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceFilePreferenceProvider);
exports.WorkspaceFilePreferenceProvider = WorkspaceFilePreferenceProvider;
//# sourceMappingURL=workspace-file-preference-provider.js.map