"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
require("../../src/browser/style/index.css");
require("../../src/browser/language-status/editor-language-status.css");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/variable-resolver/lib/browser");
const editor_manager_1 = require("./editor-manager");
const editor_contribution_1 = require("./editor-contribution");
const editor_menu_1 = require("./editor-menu");
const editor_command_1 = require("./editor-command");
const editor_keybinding_1 = require("./editor-keybinding");
const editor_preferences_1 = require("./editor-preferences");
const editor_widget_factory_1 = require("./editor-widget-factory");
const editor_navigation_contribution_1 = require("./editor-navigation-contribution");
const navigation_location_updater_1 = require("./navigation/navigation-location-updater");
const navigation_location_service_1 = require("./navigation/navigation-location-service");
const navigation_location_similarity_1 = require("./navigation/navigation-location-similarity");
const editor_variable_contribution_1 = require("./editor-variable-contribution");
const quick_access_1 = require("@theia/core/lib/browser/quick-input/quick-access");
const quick_editor_service_1 = require("./quick-editor-service");
const editor_language_status_service_1 = require("./language-status/editor-language-status-service");
const editor_linenumber_contribution_1 = require("./editor-linenumber-contribution");
const undo_redo_service_1 = require("./undo-redo-service");
exports.default = new inversify_1.ContainerModule(bind => {
    (0, editor_preferences_1.bindEditorPreferences)(bind);
    bind(editor_widget_factory_1.EditorWidgetFactory).toSelf().inSingletonScope();
    bind(browser_1.WidgetFactory).toService(editor_widget_factory_1.EditorWidgetFactory);
    bind(editor_manager_1.EditorManager).toSelf().inSingletonScope();
    bind(browser_1.OpenHandler).toService(editor_manager_1.EditorManager);
    bind(editor_command_1.EditorCommandContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(editor_command_1.EditorCommandContribution);
    bind(editor_menu_1.EditorMenuContribution).toSelf().inSingletonScope();
    bind(common_1.MenuContribution).toService(editor_menu_1.EditorMenuContribution);
    bind(editor_keybinding_1.EditorKeybindingContribution).toSelf().inSingletonScope();
    bind(browser_1.KeybindingContribution).toService(editor_keybinding_1.EditorKeybindingContribution);
    bind(editor_contribution_1.EditorContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(editor_contribution_1.EditorContribution);
    bind(editor_language_status_service_1.EditorLanguageStatusService).toSelf().inSingletonScope();
    bind(editor_linenumber_contribution_1.EditorLineNumberContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(editor_linenumber_contribution_1.EditorLineNumberContribution);
    bind(editor_navigation_contribution_1.EditorNavigationContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(editor_navigation_contribution_1.EditorNavigationContribution);
    bind(navigation_location_service_1.NavigationLocationService).toSelf().inSingletonScope();
    bind(navigation_location_updater_1.NavigationLocationUpdater).toSelf().inSingletonScope();
    bind(navigation_location_similarity_1.NavigationLocationSimilarity).toSelf().inSingletonScope();
    bind(browser_2.VariableContribution).to(editor_variable_contribution_1.EditorVariableContribution).inSingletonScope();
    [common_1.CommandContribution, browser_1.KeybindingContribution, common_1.MenuContribution].forEach(serviceIdentifier => {
        bind(serviceIdentifier).toService(editor_contribution_1.EditorContribution);
    });
    bind(quick_editor_service_1.QuickEditorService).toSelf().inSingletonScope();
    bind(quick_access_1.QuickAccessContribution).to(quick_editor_service_1.QuickEditorService);
    bind(editor_manager_1.CurrentEditorAccess).toSelf().inSingletonScope();
    bind(editor_manager_1.ActiveEditorAccess).toSelf().inSingletonScope();
    bind(editor_manager_1.EditorAccess).to(editor_manager_1.CurrentEditorAccess).inSingletonScope().whenTargetNamed(editor_manager_1.EditorAccess.CURRENT);
    bind(editor_manager_1.EditorAccess).to(editor_manager_1.ActiveEditorAccess).inSingletonScope().whenTargetNamed(editor_manager_1.EditorAccess.ACTIVE);
    bind(undo_redo_service_1.UndoRedoService).toSelf().inSingletonScope();
});
//# sourceMappingURL=editor-frontend-module.js.map