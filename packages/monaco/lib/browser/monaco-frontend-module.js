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
exports.createMonacoConfigurationService = exports.MonacoConfigurationService = void 0;
const MonacoNls = require("@theia/monaco-editor-core/esm/vs/nls");
const nls_1 = require("@theia/core/lib/common/nls");
const localization_1 = require("@theia/core/lib/common/i18n/localization");
Object.assign(MonacoNls, {
    localize(_key, label, ...args) {
        if (nls_1.nls.locale) {
            const defaultKey = nls_1.nls.getDefaultKey(label);
            if (defaultKey) {
                return nls_1.nls.localize(defaultKey, label, ...args);
            }
        }
        return localization_1.Localization.format(label, args);
    }
});
require("../../src/browser/style/index.css");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const monaco_editor_provider_1 = require("./monaco-editor-provider");
const monaco_menu_1 = require("./monaco-menu");
const monaco_command_1 = require("./monaco-command");
const monaco_keybinding_1 = require("./monaco-keybinding");
const monaco_languages_1 = require("./monaco-languages");
const monaco_workspace_1 = require("./monaco-workspace");
const monaco_editor_service_1 = require("./monaco-editor-service");
const monaco_text_model_service_1 = require("./monaco-text-model-service");
const monaco_context_menu_1 = require("./monaco-context-menu");
const monaco_outline_contribution_1 = require("./monaco-outline-contribution");
const monaco_status_bar_contribution_1 = require("./monaco-status-bar-contribution");
const monaco_command_service_1 = require("./monaco-command-service");
const monaco_command_registry_1 = require("./monaco-command-registry");
const monaco_diff_navigator_factory_1 = require("./monaco-diff-navigator-factory");
const monaco_frontend_application_contribution_1 = require("./monaco-frontend-application-contribution");
const monaco_textmate_frontend_bindings_1 = require("./textmate/monaco-textmate-frontend-bindings");
const monaco_bulk_edit_service_1 = require("./monaco-bulk-edit-service");
const monaco_outline_decorator_1 = require("./monaco-outline-decorator");
const outline_decorator_service_1 = require("@theia/outline-view/lib/browser/outline-decorator-service");
const monaco_snippet_suggest_provider_1 = require("./monaco-snippet-suggest-provider");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const monaco_context_key_service_1 = require("./monaco-context-key-service");
const monaco_mime_service_1 = require("./monaco-mime-service");
const mime_service_1 = require("@theia/core/lib/browser/mime-service");
const monaco_editor_1 = require("./monaco-editor");
const monaco_color_registry_1 = require("./monaco-color-registry");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
const monaco_theming_service_1 = require("./monaco-theming-service");
const core_1 = require("@theia/core");
const workspace_symbol_command_1 = require("./workspace-symbol-command");
const language_service_1 = require("@theia/core/lib/browser/language-service");
const monaco_to_protocol_converter_1 = require("./monaco-to-protocol-converter");
const protocol_to_monaco_converter_1 = require("./protocol-to-monaco-converter");
const monaco_formatting_conflicts_1 = require("./monaco-formatting-conflicts");
const monaco_quick_input_service_1 = require("./monaco-quick-input-service");
const monaco_gotoline_quick_access_1 = require("./monaco-gotoline-quick-access");
const monaco_gotosymbol_quick_access_1 = require("./monaco-gotosymbol-quick-access");
const quick_access_1 = require("@theia/core/lib/browser/quick-input/quick-access");
const monaco_quick_access_registry_1 = require("./monaco-quick-access-registry");
const contextKeyService_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService");
const configuration_1 = require("@theia/monaco-editor-core/esm/vs/platform/configuration/common/configuration");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const markdown_renderer_1 = require("@theia/core/lib/browser/markdown-rendering/markdown-renderer");
const monaco_markdown_renderer_1 = require("./markdown-renderer/monaco-markdown-renderer");
const theming_1 = require("@theia/core/lib/browser/theming");
const monaco_indexed_db_1 = require("./monaco-indexed-db");
(0, inversify_1.decorate)((0, inversify_1.injectable)(), contextKeyService_1.ContextKeyService);
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(monaco_theming_service_1.MonacoThemingService).toSelf().inSingletonScope();
    bind(monaco_context_key_service_1.MonacoContextKeyService).toSelf().inSingletonScope();
    rebind(context_key_service_1.ContextKeyService).toService(monaco_context_key_service_1.MonacoContextKeyService);
    bind(monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider).toSelf().inSingletonScope();
    bind(monaco_frontend_application_contribution_1.MonacoFrontendApplicationContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_frontend_application_contribution_1.MonacoFrontendApplicationContribution);
    bind(browser_1.StylingParticipant).toService(monaco_frontend_application_contribution_1.MonacoFrontendApplicationContribution);
    bind(monaco_to_protocol_converter_1.MonacoToProtocolConverter).toSelf().inSingletonScope();
    bind(protocol_to_monaco_converter_1.ProtocolToMonacoConverter).toSelf().inSingletonScope();
    bind(monaco_languages_1.MonacoLanguages).toSelf().inSingletonScope();
    rebind(language_service_1.LanguageService).toService(monaco_languages_1.MonacoLanguages);
    bind(workspace_symbol_command_1.WorkspaceSymbolCommand).toSelf().inSingletonScope();
    for (const identifier of [common_1.CommandContribution, browser_1.KeybindingContribution, common_1.MenuContribution, quick_access_1.QuickAccessContribution]) {
        bind(identifier).toService(workspace_symbol_command_1.WorkspaceSymbolCommand);
    }
    bind(monaco_workspace_1.MonacoWorkspace).toSelf().inSingletonScope();
    bind(exports.MonacoConfigurationService).toDynamicValue(({ container }) => createMonacoConfigurationService(container)).inSingletonScope();
    bind(contextKeyService_1.ContextKeyService).toDynamicValue(({ container }) => new contextKeyService_1.ContextKeyService(container.get(exports.MonacoConfigurationService))).inSingletonScope();
    bind(monaco_bulk_edit_service_1.MonacoBulkEditService).toSelf().inSingletonScope();
    bind(monaco_editor_service_1.MonacoEditorService).toSelf().inSingletonScope();
    bind(monaco_text_model_service_1.MonacoTextModelService).toSelf().inSingletonScope();
    bind(monaco_context_menu_1.MonacoContextMenuService).toSelf().inSingletonScope();
    bind(monaco_editor_1.MonacoEditorServices).toSelf().inSingletonScope();
    bind(monaco_editor_provider_1.MonacoEditorProvider).toSelf().inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, monaco_editor_provider_1.MonacoEditorFactory);
    (0, core_1.bindContributionProvider)(bind, monaco_text_model_service_1.MonacoEditorModelFactory);
    bind(monaco_command_service_1.MonacoCommandService).toSelf().inTransientScope();
    bind(monaco_command_service_1.MonacoCommandServiceFactory).toAutoFactory(monaco_command_service_1.MonacoCommandService);
    bind(browser_2.TextEditorProvider).toProvider(context => uri => context.container.get(monaco_editor_provider_1.MonacoEditorProvider).get(uri));
    bind(monaco_diff_navigator_factory_1.MonacoDiffNavigatorFactory).toSelf().inSingletonScope();
    bind(browser_2.DiffNavigatorProvider).toFactory(context => (editor) => context.container.get(monaco_editor_provider_1.MonacoEditorProvider).getDiffNavigator(editor));
    bind(monaco_outline_contribution_1.MonacoOutlineContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_outline_contribution_1.MonacoOutlineContribution);
    rebind(markdown_renderer_1.MarkdownRenderer).to(monaco_markdown_renderer_1.MonacoMarkdownRenderer).inSingletonScope();
    bind(monaco_formatting_conflicts_1.MonacoFormattingConflictsContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_formatting_conflicts_1.MonacoFormattingConflictsContribution);
    bind(monaco_status_bar_contribution_1.MonacoStatusBarContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_status_bar_contribution_1.MonacoStatusBarContribution);
    bind(monaco_command_registry_1.MonacoCommandRegistry).toSelf().inSingletonScope();
    bind(monaco_command_1.MonacoEditorCommandHandlers).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(monaco_command_1.MonacoEditorCommandHandlers);
    bind(monaco_menu_1.MonacoEditorMenuContribution).toSelf().inSingletonScope();
    bind(common_1.MenuContribution).toService(monaco_menu_1.MonacoEditorMenuContribution);
    bind(monaco_keybinding_1.MonacoKeybindingContribution).toSelf().inSingletonScope();
    bind(browser_1.KeybindingContribution).toService(monaco_keybinding_1.MonacoKeybindingContribution);
    bind(monaco_quick_input_service_1.MonacoQuickInputImplementation).toSelf().inSingletonScope();
    bind(monaco_quick_input_service_1.MonacoQuickInputService).toSelf().inSingletonScope();
    bind(browser_1.QuickInputService).toService(monaco_quick_input_service_1.MonacoQuickInputService);
    bind(monaco_quick_access_registry_1.MonacoQuickAccessRegistry).toSelf().inSingletonScope();
    bind(quick_access_1.QuickAccessRegistry).toService(monaco_quick_access_registry_1.MonacoQuickAccessRegistry);
    bind(monaco_gotoline_quick_access_1.GotoLineQuickAccessContribution).toSelf().inSingletonScope();
    bind(quick_access_1.QuickAccessContribution).toService(monaco_gotoline_quick_access_1.GotoLineQuickAccessContribution);
    bind(monaco_gotosymbol_quick_access_1.GotoSymbolQuickAccessContribution).toSelf().inSingletonScope();
    bind(quick_access_1.QuickAccessContribution).toService(monaco_gotosymbol_quick_access_1.GotoSymbolQuickAccessContribution);
    (0, monaco_textmate_frontend_bindings_1.default)(bind, unbind, isBound, rebind);
    bind(monaco_outline_decorator_1.MonacoOutlineDecorator).toSelf().inSingletonScope();
    bind(outline_decorator_service_1.OutlineTreeDecorator).toService(monaco_outline_decorator_1.MonacoOutlineDecorator);
    bind(monaco_mime_service_1.MonacoMimeService).toSelf().inSingletonScope();
    rebind(mime_service_1.MimeService).toService(monaco_mime_service_1.MonacoMimeService);
    bind(monaco_color_registry_1.MonacoColorRegistry).toSelf().inSingletonScope();
    rebind(color_registry_1.ColorRegistry).toService(monaco_color_registry_1.MonacoColorRegistry);
    bind(monaco_indexed_db_1.ThemeServiceWithDB).toSelf().inSingletonScope();
    rebind(theming_1.ThemeService).toService(monaco_indexed_db_1.ThemeServiceWithDB);
});
exports.MonacoConfigurationService = Symbol('MonacoConfigurationService');
function createMonacoConfigurationService(container) {
    const preferences = container.get(browser_1.PreferenceService);
    const preferenceSchemaProvider = container.get(browser_1.PreferenceSchemaProvider);
    const service = standaloneServices_1.StandaloneServices.get(configuration_1.IConfigurationService);
    const _configuration = service['_configuration'];
    _configuration.getValue = (section, overrides) => {
        const overrideIdentifier = (overrides && 'overrideIdentifier' in overrides && typeof overrides.overrideIdentifier === 'string')
            ? overrides['overrideIdentifier']
            : undefined;
        const resourceUri = (overrides && 'resource' in overrides && !!overrides['resource']) ? overrides['resource'].toString() : undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const proxy = (0, browser_1.createPreferenceProxy)(preferences, preferenceSchemaProvider.getCombinedSchema(), {
            resourceUri, overrideIdentifier, style: 'both'
        });
        if (section) {
            return proxy[section];
        }
        return proxy;
    };
    const toTarget = (scope) => {
        switch (scope) {
            case browser_1.PreferenceScope.Default: return 7 /* DEFAULT */;
            case browser_1.PreferenceScope.User: return 2 /* USER */;
            case browser_1.PreferenceScope.Workspace: return 5 /* WORKSPACE */;
            case browser_1.PreferenceScope.Folder: return 6 /* WORKSPACE_FOLDER */;
        }
    };
    const newFireDidChangeConfigurationContext = () => ({
        changes: [],
        affectedKeys: new Set(),
        keys: new Set(),
        overrides: new Map()
    });
    const fireDidChangeConfiguration = (source, context) => {
        if (!context.affectedKeys.size) {
            return;
        }
        const overrides = [];
        for (const [override, values] of context.overrides) {
            overrides.push([override, [...values]]);
        }
        service['_onDidChangeConfiguration'].fire({
            change: {
                keys: [...context.keys],
                overrides
            },
            affectedKeys: [...context.affectedKeys],
            source,
            affectsConfiguration: (prefix, options) => {
                var _a;
                if (!context.affectedKeys.has(prefix)) {
                    return false;
                }
                for (const change of context.changes) {
                    const overridden = preferences.overriddenPreferenceName(change.preferenceName);
                    const preferenceName = overridden ? overridden.preferenceName : change.preferenceName;
                    if (preferenceName.startsWith(prefix)) {
                        if ((options === null || options === void 0 ? void 0 : options.overrideIdentifier) !== undefined) {
                            if (overridden && overridden.overrideIdentifier !== (options === null || options === void 0 ? void 0 : options.overrideIdentifier)) {
                                continue;
                            }
                        }
                        if (change.affects((_a = options === null || options === void 0 ? void 0 : options.resource) === null || _a === void 0 ? void 0 : _a.toString())) {
                            return true;
                        }
                    }
                }
                return false;
            }
        });
    };
    preferences.onPreferencesChanged(event => {
        var _a;
        let source;
        let context = newFireDidChangeConfigurationContext();
        for (let key of Object.keys(event)) {
            const change = event[key];
            const target = toTarget(change.scope);
            if (source !== undefined && target !== source) {
                fireDidChangeConfiguration(source, context);
                context = newFireDidChangeConfigurationContext();
            }
            context.changes.push(change);
            source = target;
            let overrideKeys;
            if (key.startsWith('[')) {
                const index = key.indexOf('.');
                const override = key.substring(0, index);
                const overrideIdentifier = (_a = override.match(browser_1.OVERRIDE_PROPERTY_PATTERN)) === null || _a === void 0 ? void 0 : _a[1];
                if (overrideIdentifier) {
                    context.keys.add(override);
                    context.affectedKeys.add(override);
                    overrideKeys = context.overrides.get(overrideIdentifier) || new Set();
                    context.overrides.set(overrideIdentifier, overrideKeys);
                    key = key.substring(index + 1);
                }
            }
            while (key) {
                if (overrideKeys) {
                    overrideKeys.add(key);
                }
                context.keys.add(key);
                context.affectedKeys.add(key);
                const index = key.lastIndexOf('.');
                key = key.substring(0, index);
            }
        }
        if (source) {
            fireDidChangeConfiguration(source, context);
        }
    });
    return service;
}
exports.createMonacoConfigurationService = createMonacoConfigurationService;
//# sourceMappingURL=monaco-frontend-module.js.map