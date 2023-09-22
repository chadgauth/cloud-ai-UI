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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindProblemPreferences = exports.createProblemPreferences = exports.ProblemPreferences = exports.ProblemPreferenceContribution = exports.ProblemConfigSchema = void 0;
const browser_1 = require("@theia/core/lib/browser");
const nls_1 = require("@theia/core/lib/common/nls");
exports.ProblemConfigSchema = {
    'type': 'object',
    'properties': {
        'problems.decorations.enabled': {
            'type': 'boolean',
            'description': nls_1.nls.localizeByDefault('Show Errors & Warnings on files and folder.'),
            'default': true,
        },
        'problems.decorations.tabbar.enabled': {
            'type': 'boolean',
            'description': nls_1.nls.localize('theia/markers/tabbarDecorationsEnabled', 'Show problem decorators (diagnostic markers) in the tab bars.'),
            'default': true
        },
        'problems.autoReveal': {
            'type': 'boolean',
            'description': nls_1.nls.localizeByDefault('Controls whether Problems view should automatically reveal files when opening them.'),
            'default': true
        }
    }
};
exports.ProblemPreferenceContribution = Symbol('ProblemPreferenceContribution');
exports.ProblemPreferences = Symbol('ProblemPreferences');
function createProblemPreferences(preferences, schema = exports.ProblemConfigSchema) {
    return (0, browser_1.createPreferenceProxy)(preferences, schema);
}
exports.createProblemPreferences = createProblemPreferences;
const bindProblemPreferences = (bind) => {
    bind(exports.ProblemPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(browser_1.PreferenceService);
        const contribution = ctx.container.get(exports.ProblemPreferenceContribution);
        return createProblemPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.ProblemPreferenceContribution).toConstantValue({ schema: exports.ProblemConfigSchema });
    bind(browser_1.PreferenceContribution).toService(exports.ProblemPreferenceContribution);
};
exports.bindProblemPreferences = bindProblemPreferences;
//# sourceMappingURL=problem-preferences.js.map