"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.DebugAdapterContributionRegistry = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const debug_service_1 = require("./debug-service");
const debug_model_1 = require("./debug-model");
/**
 * Contributions registry.
 */
let DebugAdapterContributionRegistry = class DebugAdapterContributionRegistry {
    *getContributions(debugType) {
        for (const contribution of this.contributions.getContributions()) {
            if (contribution.type === debugType || contribution.type === '*' || debugType === '*') {
                yield contribution;
            }
        }
    }
    debugTypes() {
        if (!this._debugTypes) {
            const result = new Set();
            for (const contribution of this.contributions.getContributions()) {
                result.add(contribution.type);
            }
            this._debugTypes = [...result];
        }
        return this._debugTypes;
    }
    async getDebuggersForLanguage(language) {
        const debuggers = [];
        for (const contribution of this.contributions.getContributions()) {
            if (contribution.languages && contribution.label) {
                const label = await contribution.label;
                if (label && (await contribution.languages || []).indexOf(language) !== -1) {
                    debuggers.push({
                        type: contribution.type,
                        label
                    });
                }
            }
        }
        return debuggers;
    }
    /**
     * Provides initial [debug configuration](#DebugConfiguration).
     * @param debugType The registered debug type
     * @returns An array of [debug configurations](#DebugConfiguration)
     */
    async provideDebugConfigurations(debugType, workspaceFolderUri) {
        const configurations = [];
        for (const contribution of this.getContributions(debugType)) {
            if (contribution.provideDebugConfigurations) {
                try {
                    const result = await contribution.provideDebugConfigurations(workspaceFolderUri);
                    configurations.push(...result);
                }
                catch (e) {
                    console.error('provideDebugConfigurations failed:', e);
                }
            }
        }
        return configurations;
    }
    /**
     * Resolves a [debug configuration](#DebugConfiguration) by filling in missing values
     * or by adding/changing/removing attributes before variable substitution.
     * @param debugConfiguration The [debug configuration](#DebugConfiguration) to resolve.
     * @returns The resolved debug configuration.
     */
    async resolveDebugConfiguration(config, workspaceFolderUri) {
        let current = config;
        for (const contribution of this.getContributions(config.type)) {
            if (contribution.resolveDebugConfiguration) {
                try {
                    const next = await contribution.resolveDebugConfiguration(config, workspaceFolderUri);
                    if (next) {
                        current = next;
                    }
                    else {
                        return current;
                    }
                }
                catch (e) {
                    console.error('resolveDebugConfiguration failed:', e);
                }
            }
        }
        return current;
    }
    /**
     * Resolves a [debug configuration](#DebugConfiguration) by filling in missing values
     * or by adding/changing/removing attributes with substituted variables.
     * @param debugConfiguration The [debug configuration](#DebugConfiguration) to resolve.
     * @returns The resolved debug configuration.
     */
    async resolveDebugConfigurationWithSubstitutedVariables(config, workspaceFolderUri) {
        let current = config;
        for (const contribution of this.getContributions(config.type)) {
            if (contribution.resolveDebugConfigurationWithSubstitutedVariables) {
                try {
                    const next = await contribution.resolveDebugConfigurationWithSubstitutedVariables(config, workspaceFolderUri);
                    if (next) {
                        current = next;
                    }
                    else {
                        return current;
                    }
                }
                catch (e) {
                    console.error('resolveDebugConfigurationWithSubstitutedVariables failed:', e);
                }
            }
        }
        return current;
    }
    /**
     * Provides schema attributes.
     * @param debugType The registered debug type
     * @returns Schema attributes for the given debug type
     */
    async getSchemaAttributes(debugType) {
        const schemas = [];
        for (const contribution of this.getContributions(debugType)) {
            if (contribution.getSchemaAttributes) {
                try {
                    schemas.push(...await contribution.getSchemaAttributes());
                }
                catch (e) {
                    console.error('getSchemaAttributes failed:', e);
                }
            }
        }
        return schemas;
    }
    async getConfigurationSnippets() {
        const schemas = [];
        for (const contribution of this.getContributions('*')) {
            if (contribution.getConfigurationSnippets) {
                try {
                    schemas.push(...await contribution.getConfigurationSnippets());
                }
                catch (e) {
                    console.error('getConfigurationSnippets failed:', e);
                }
            }
        }
        return schemas;
    }
    /**
     * Provides a [debug adapter executable](#DebugAdapterExecutable)
     * based on [debug configuration](#DebugConfiguration) to launch a new debug adapter.
     * @param config The resolved [debug configuration](#DebugConfiguration).
     * @returns The [debug adapter executable](#DebugAdapterExecutable).
     */
    async provideDebugAdapterExecutable(config) {
        for (const contribution of this.getContributions(config.type)) {
            if (contribution.provideDebugAdapterExecutable) {
                const executable = await contribution.provideDebugAdapterExecutable(config);
                if (executable) {
                    return executable;
                }
            }
        }
        throw debug_service_1.DebugError.NotFound(config.type);
    }
    /**
     * Returns a [debug adapter session factory](#DebugAdapterSessionFactory).
     * @param debugType The registered debug type
     * @returns An [debug adapter session factory](#DebugAdapterSessionFactory)
     */
    debugAdapterSessionFactory(debugType) {
        for (const contribution of this.getContributions(debugType)) {
            if (contribution.debugAdapterSessionFactory) {
                return contribution.debugAdapterSessionFactory;
            }
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(debug_model_1.DebugAdapterContribution),
    __metadata("design:type", Object)
], DebugAdapterContributionRegistry.prototype, "contributions", void 0);
DebugAdapterContributionRegistry = __decorate([
    (0, inversify_1.injectable)()
], DebugAdapterContributionRegistry);
exports.DebugAdapterContributionRegistry = DebugAdapterContributionRegistry;
//# sourceMappingURL=debug-adapter-contribution-registry.js.map