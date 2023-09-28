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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindWebviewPreferences = exports.createWebviewPreferences = exports.WebviewPreferences = exports.WebviewPreferenceContribution = exports.WebviewConfigSchema = void 0;
const frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
const preferences_1 = require("@theia/core/lib/browser/preferences");
const nls_1 = require("@theia/core/lib/common/nls");
const frontendConfig = frontend_application_config_provider_1.FrontendApplicationConfigProvider.get();
exports.WebviewConfigSchema = {
    type: 'object',
    properties: {
        'webview.trace': {
            type: 'string',
            enum: ['off', 'on', 'verbose'],
            description: nls_1.nls.localize('theia/plugin-ext/webviewTrace', 'Controls communication tracing with webviews.'),
            default: 'off'
        }
    }
};
if (frontendConfig.securityWarnings) {
    exports.WebviewConfigSchema.properties['webview.warnIfUnsecure'] = {
        scope: 'application',
        type: 'boolean',
        description: nls_1.nls.localize('theia/plugin-ext/webviewWarnIfUnsecure', 'Warns users that webviews are currently deployed unsecurely.'),
        default: true,
    };
}
exports.WebviewPreferenceContribution = Symbol('WebviewPreferenceContribution');
exports.WebviewPreferences = Symbol('WebviewPreferences');
function createWebviewPreferences(preferences, schema = exports.WebviewConfigSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createWebviewPreferences = createWebviewPreferences;
function bindWebviewPreferences(bind) {
    bind(exports.WebviewPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(preferences_1.PreferenceService);
        const contribution = ctx.container.get(exports.WebviewPreferenceContribution);
        return createWebviewPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.WebviewPreferenceContribution).toConstantValue({ schema: exports.WebviewConfigSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.WebviewPreferenceContribution);
}
exports.bindWebviewPreferences = bindWebviewPreferences;
//# sourceMappingURL=webview-preferences.js.map