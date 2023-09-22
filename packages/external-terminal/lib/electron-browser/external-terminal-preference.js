"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.getExternalTerminalSchema = exports.ExternalTerminalPreferenceService = exports.bindExternalTerminalPreferences = exports.ExternalTerminalSchemaProvider = exports.ExternalTerminalPreferences = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const injectable_preference_proxy_1 = require("@theia/core/lib/browser/preferences/injectable-preference-proxy");
const preference_contribution_1 = require("@theia/core/lib/browser/preferences/preference-contribution");
const os_1 = require("@theia/core/lib/common/os");
const external_terminal_1 = require("../common/external-terminal");
const nls_1 = require("@theia/core/lib/common/nls");
exports.ExternalTerminalPreferences = Symbol('ExternalTerminalPreferences');
exports.ExternalTerminalSchemaProvider = Symbol('ExternalTerminalSchemaPromise');
function bindExternalTerminalPreferences(bind) {
    bind(ExternalTerminalPreferenceService).toSelf().inSingletonScope();
    bind(exports.ExternalTerminalSchemaProvider)
        .toProvider(ctx => {
        const schema = getExternalTerminalSchema(ctx.container.get(external_terminal_1.ExternalTerminalService));
        return () => schema;
    });
    bind(exports.ExternalTerminalPreferences)
        .toDynamicValue(ctx => {
        const factory = ctx.container.get(injectable_preference_proxy_1.PreferenceProxyFactory);
        const schemaProvider = ctx.container.get(exports.ExternalTerminalSchemaProvider);
        return factory(schemaProvider());
    })
        .inSingletonScope();
}
exports.bindExternalTerminalPreferences = bindExternalTerminalPreferences;
let ExternalTerminalPreferenceService = class ExternalTerminalPreferenceService {
    init() {
        this.doInit();
    }
    async doInit() {
        this.preferenceSchemaProvider.setSchema(await this.promisedSchema());
    }
    /**
     * Get the external terminal configurations from preferences.
     */
    getExternalTerminalConfiguration() {
        return {
            'terminal.external.linuxExec': this.preferences['terminal.external.linuxExec'],
            'terminal.external.osxExec': this.preferences['terminal.external.osxExec'],
            'terminal.external.windowsExec': this.preferences['terminal.external.windowsExec'],
        };
    }
};
__decorate([
    (0, inversify_1.inject)(exports.ExternalTerminalPreferences),
    __metadata("design:type", Object)
], ExternalTerminalPreferenceService.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(preference_contribution_1.PreferenceSchemaProvider),
    __metadata("design:type", preference_contribution_1.PreferenceSchemaProvider)
], ExternalTerminalPreferenceService.prototype, "preferenceSchemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(exports.ExternalTerminalSchemaProvider),
    __metadata("design:type", Function)
], ExternalTerminalPreferenceService.prototype, "promisedSchema", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExternalTerminalPreferenceService.prototype, "init", null);
ExternalTerminalPreferenceService = __decorate([
    (0, inversify_1.injectable)()
], ExternalTerminalPreferenceService);
exports.ExternalTerminalPreferenceService = ExternalTerminalPreferenceService;
/**
 * Use the backend {@link ExternalTerminalService} to establish the schema for the `ExternalTerminalPreferences`.
 *
 * @param externalTerminalService the external terminal backend service.
 * @returns a preference schema with the OS default exec set by the backend service.
 */
async function getExternalTerminalSchema(externalTerminalService) {
    const hostExec = await externalTerminalService.getDefaultExec();
    return {
        type: 'object',
        properties: {
            'terminal.external.windowsExec': {
                type: 'string',
                typeDetails: { isFilepath: true },
                description: nls_1.nls.localizeByDefault('Customizes which terminal to run on Windows.'),
                default: `${os_1.isWindows ? hostExec : 'C:\\WINDOWS\\System32\\cmd.exe'}`
            },
            'terminal.external.osxExec': {
                type: 'string',
                description: nls_1.nls.localizeByDefault('Customizes which terminal application to run on macOS.'),
                default: `${os_1.isOSX ? hostExec : 'Terminal.app'}`
            },
            'terminal.external.linuxExec': {
                type: 'string',
                description: nls_1.nls.localizeByDefault('Customizes which terminal to run on Linux.'),
                default: `${!(os_1.isWindows || os_1.isOSX) ? hostExec : 'xterm'}`
            }
        }
    };
}
exports.getExternalTerminalSchema = getExternalTerminalSchema;
//# sourceMappingURL=external-terminal-preference.js.map