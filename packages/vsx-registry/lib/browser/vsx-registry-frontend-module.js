"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const vsx_extensions_view_container_1 = require("./vsx-extensions-view-container");
const vsx_extensions_contribution_1 = require("./vsx-extensions-contribution");
const vsx_extensions_search_bar_1 = require("./vsx-extensions-search-bar");
const vsx_extensions_model_1 = require("./vsx-extensions-model");
const color_application_contribution_1 = require("@theia/core/lib/browser/color-application-contribution");
const vsx_extensions_widget_1 = require("./vsx-extensions-widget");
const vsx_extension_1 = require("./vsx-extension");
const vsx_extension_editor_1 = require("./vsx-extension-editor");
const vsx_extension_editor_manager_1 = require("./vsx-extension-editor-manager");
const vsx_extensions_source_1 = require("./vsx-extensions-source");
const vsx_extensions_search_model_1 = require("./vsx-extensions-search-model");
const recommended_extensions_preference_contribution_1 = require("./recommended-extensions/recommended-extensions-preference-contribution");
const preference_provider_overrides_1 = require("./recommended-extensions/preference-provider-overrides");
const vsx_environment_1 = require("../common/vsx-environment");
const language_quick_pick_service_1 = require("@theia/core/lib/browser/i18n/language-quick-pick-service");
const vsx_language_quick_pick_service_1 = require("./vsx-language-quick-pick-service");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(vsx_environment_1.VSXEnvironment)
        .toDynamicValue(ctx => browser_1.WebSocketConnectionProvider.createProxy(ctx.container, vsx_environment_1.VSX_ENVIRONMENT_PATH))
        .inSingletonScope();
    bind(vsx_extension_1.VSXExtension).toSelf();
    bind(vsx_extension_1.VSXExtensionFactory).toFactory(ctx => (option) => {
        const child = ctx.container.createChild();
        child.bind(vsx_extension_1.VSXExtensionOptions).toConstantValue(option);
        return child.get(vsx_extension_1.VSXExtension);
    });
    bind(vsx_extensions_model_1.VSXExtensionsModel).toSelf().inSingletonScope();
    bind(vsx_extension_editor_1.VSXExtensionEditor).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: vsx_extension_editor_1.VSXExtensionEditor.ID,
        createWidget: async (options) => {
            const extension = await ctx.container.get(vsx_extensions_model_1.VSXExtensionsModel).resolve(options.id);
            const child = ctx.container.createChild();
            child.bind(vsx_extension_1.VSXExtension).toConstantValue(extension);
            return child.get(vsx_extension_editor_1.VSXExtensionEditor);
        }
    })).inSingletonScope();
    bind(vsx_extension_editor_manager_1.VSXExtensionEditorManager).toSelf().inSingletonScope();
    bind(browser_1.OpenHandler).toService(vsx_extension_editor_manager_1.VSXExtensionEditorManager);
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: vsx_extensions_widget_1.VSXExtensionsWidget.ID,
        createWidget: async (options) => vsx_extensions_widget_1.VSXExtensionsWidget.createWidget(container, options)
    })).inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: vsx_extensions_view_container_1.VSXExtensionsViewContainer.ID,
        createWidget: async () => {
            const child = ctx.container.createChild();
            child.bind(browser_1.ViewContainerIdentifier).toConstantValue({
                id: vsx_extensions_view_container_1.VSXExtensionsViewContainer.ID,
                progressLocationId: 'extensions'
            });
            child.bind(vsx_extensions_view_container_1.VSXExtensionsViewContainer).toSelf();
            const viewContainer = child.get(vsx_extensions_view_container_1.VSXExtensionsViewContainer);
            const widgetManager = child.get(browser_1.WidgetManager);
            for (const id of [
                vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT,
                vsx_extensions_source_1.VSXExtensionsSourceOptions.RECOMMENDED,
                vsx_extensions_source_1.VSXExtensionsSourceOptions.INSTALLED,
                vsx_extensions_source_1.VSXExtensionsSourceOptions.BUILT_IN,
            ]) {
                const widget = await widgetManager.getOrCreateWidget(vsx_extensions_widget_1.VSXExtensionsWidget.ID, { id });
                viewContainer.addWidget(widget, {
                    initiallyCollapsed: id === vsx_extensions_source_1.VSXExtensionsSourceOptions.BUILT_IN
                });
            }
            return viewContainer;
        }
    })).inSingletonScope();
    bind(vsx_extensions_search_model_1.VSXExtensionsSearchModel).toSelf().inSingletonScope();
    bind(vsx_extensions_search_bar_1.VSXExtensionsSearchBar).toSelf().inSingletonScope();
    rebind(language_quick_pick_service_1.LanguageQuickPickService).to(vsx_language_quick_pick_service_1.VSXLanguageQuickPickService).inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, vsx_extensions_contribution_1.VSXExtensionsContribution);
    bind(browser_1.FrontendApplicationContribution).toService(vsx_extensions_contribution_1.VSXExtensionsContribution);
    bind(color_application_contribution_1.ColorContribution).toService(vsx_extensions_contribution_1.VSXExtensionsContribution);
    (0, recommended_extensions_preference_contribution_1.bindExtensionPreferences)(bind);
    (0, preference_provider_overrides_1.bindPreferenceProviderOverrides)(bind, unbind);
});
//# sourceMappingURL=vsx-registry-frontend-module.js.map