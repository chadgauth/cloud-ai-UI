"use strict";
// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
exports.bindGettingStartedPreferences = exports.createGettingStartedPreferences = exports.GettingStartedPreferences = exports.GettingStartedPreferenceContribution = exports.GettingStartedPreferenceSchema = void 0;
const preferences_1 = require("@theia/core/lib/browser/preferences");
const frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
const nls_1 = require("@theia/core/lib/common/nls");
exports.GettingStartedPreferenceSchema = {
    'type': 'object',
    properties: {
        'workbench.startupEditor': {
            type: 'string',
            enum: ['none', 'welcomePage', 'readme', 'newUntitledFile', 'welcomePageInEmptyWorkbench'],
            enumDescriptions: [
                nls_1.nls.localizeByDefault('Start without an editor.'),
                nls_1.nls.localize('theia/getting-started/startup-editor/welcomePage', 'Open the Welcome page, with content to aid in getting started with {0} and extensions.', frontend_application_config_provider_1.FrontendApplicationConfigProvider.get().applicationName),
                nls_1.nls.localizeByDefault(`Open the README when opening a folder that contains one, fallback to \'welcomePage\' otherwise. 
                Note: This is only observed as a global configuration, it will be ignored if set in a workspace or folder configuration.`),
                nls_1.nls.localizeByDefault('Open a new untitled text file (only applies when opening an empty window).'),
                nls_1.nls.localizeByDefault('Open the Welcome page when opening an empty workbench.'),
            ],
            default: 'welcomePage',
            description: nls_1.nls.localizeByDefault('Controls which editor is shown at startup, if none are restored from the previous session.')
        },
    }
};
exports.GettingStartedPreferenceContribution = Symbol('GettingStartedPreferenceContribution');
exports.GettingStartedPreferences = Symbol('GettingStartedPreferences');
function createGettingStartedPreferences(preferences, schema = exports.GettingStartedPreferenceSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createGettingStartedPreferences = createGettingStartedPreferences;
function bindGettingStartedPreferences(bind) {
    bind(exports.GettingStartedPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(preferences_1.PreferenceService);
        const contribution = ctx.container.get(exports.GettingStartedPreferenceContribution);
        return createGettingStartedPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.GettingStartedPreferenceContribution).toConstantValue({ schema: exports.GettingStartedPreferenceSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.GettingStartedPreferenceContribution);
}
exports.bindGettingStartedPreferences = bindGettingStartedPreferences;
//# sourceMappingURL=getting-started-preferences.js.map