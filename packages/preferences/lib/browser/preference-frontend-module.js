"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.bindPreferences = void 0;
require("../../src/browser/style/index.css");
require("./preferences-monaco-contribution");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const preference_tree_generator_1 = require("./util/preference-tree-generator");
const preference_bindings_1 = require("./preference-bindings");
const preference_widget_bindings_1 = require("./views/preference-widget-bindings");
const preferences_contribution_1 = require("./preferences-contribution");
const preference_scope_command_manager_1 = require("./util/preference-scope-command-manager");
const json_schema_store_1 = require("@theia/core/lib/browser/json-schema-store");
const preferences_json_schema_contribution_1 = require("./preferences-json-schema-contribution");
const monaco_jsonc_editor_1 = require("./monaco-jsonc-editor");
const preference_transaction_manager_1 = require("./preference-transaction-manager");
const preference_open_handler_1 = require("./preference-open-handler");
function bindPreferences(bind, unbind) {
    (0, preference_bindings_1.bindPreferenceProviders)(bind, unbind);
    (0, preference_widget_bindings_1.bindPreferencesWidgets)(bind);
    bind(preference_tree_generator_1.PreferenceTreeGenerator).toSelf().inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, preferences_contribution_1.PreferencesContribution);
    bind(preference_open_handler_1.PreferenceOpenHandler).toSelf().inSingletonScope();
    bind(browser_1.OpenHandler).toService(preference_open_handler_1.PreferenceOpenHandler);
    bind(preference_scope_command_manager_1.PreferenceScopeCommandManager).toSelf().inSingletonScope();
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(preferences_contribution_1.PreferencesContribution);
    bind(preferences_json_schema_contribution_1.PreferencesJsonSchemaContribution).toSelf().inSingletonScope();
    bind(json_schema_store_1.JsonSchemaContribution).toService(preferences_json_schema_contribution_1.PreferencesJsonSchemaContribution);
    bind(monaco_jsonc_editor_1.MonacoJSONCEditor).toSelf().inSingletonScope();
    bind(preference_transaction_manager_1.PreferenceTransaction).toSelf();
    bind(preference_transaction_manager_1.PreferenceTransactionFactory).toFactory(preference_transaction_manager_1.preferenceTransactionFactoryCreator);
}
exports.bindPreferences = bindPreferences;
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bindPreferences(bind, unbind);
});
//# sourceMappingURL=preference-frontend-module.js.map