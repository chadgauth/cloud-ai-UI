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
exports.MonacoFrontendApplicationContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const monaco_snippet_suggest_provider_1 = require("./monaco-snippet-suggest-provider");
const monaco = require("@theia/monaco-editor-core");
const suggest_1 = require("@theia/monaco-editor-core/esm/vs/editor/contrib/suggest/browser/suggest");
const monaco_editor_service_1 = require("./monaco-editor-service");
const monaco_text_model_service_1 = require("./monaco-text-model-service");
const contextKeyService_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const codeEditorService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService");
const resolverService_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/resolverService");
const contextkey_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey");
const contextView_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextview/browser/contextView");
const monaco_context_menu_1 = require("./monaco-context-menu");
const monaco_theming_service_1 = require("./monaco-theming-service");
const theme_1 = require("@theia/core/lib/common/theme");
const editorOptions_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/config/editorOptions");
const core_1 = require("@theia/core");
const editor_generated_preference_schema_1 = require("@theia/editor/lib/browser/editor-generated-preference-schema");
let theiaDidInitialize = false;
const originalInitialize = standaloneServices_1.StandaloneServices.initialize;
standaloneServices_1.StandaloneServices.initialize = overrides => {
    if (!theiaDidInitialize) {
        console.warn('Monaco was initialized before overrides were installed by Theia\'s initialization.'
            + ' Please check the lifecycle of services that use Monaco and ensure that Monaco entities are not instantiated before Theia is initialized.', new Error());
    }
    return originalInitialize(overrides);
};
let MonacoFrontendApplicationContribution = class MonacoFrontendApplicationContribution {
    init() {
        this.addAdditionalPreferenceValidations();
        const { codeEditorService, textModelService, contextKeyService, contextMenuService } = this;
        theiaDidInitialize = true;
        standaloneServices_1.StandaloneServices.initialize({
            [codeEditorService_1.ICodeEditorService.toString()]: codeEditorService,
            [resolverService_1.ITextModelService.toString()]: textModelService,
            [contextkey_1.IContextKeyService.toString()]: contextKeyService,
            [contextView_1.IContextMenuService.toString()]: contextMenuService,
        });
        // Monaco registers certain quick access providers (e.g. QuickCommandAccess) at import time, but we want to use our own.
        this.quickAccessRegistry.clear();
        /**
         * @monaco-uplift.Should be guaranteed to work.
         * Incomparable enums prevent TypeScript from believing that public ITextModel satisfied private ITextModel
         */
        (0, suggest_1.setSnippetSuggestSupport)(this.snippetSuggestProvider);
        for (const language of monaco.languages.getLanguages()) {
            this.preferenceSchema.registerOverrideIdentifier(language.id);
        }
        const registerLanguage = monaco.languages.register.bind(monaco.languages);
        monaco.languages.register = language => {
            // first register override identifier, because monaco will immediately update already opened documents and then initialize with bad preferences.
            this.preferenceSchema.registerOverrideIdentifier(language.id);
            registerLanguage(language);
        };
        this.monacoThemingService.initialize();
    }
    initialize() { }
    registerThemeStyle(theme, collector) {
        if ((0, theme_1.isHighContrast)(theme.type)) {
            const focusBorder = theme.getColor('focusBorder');
            const contrastBorder = theme.getColor('contrastBorder');
            if (focusBorder) {
                // Quick input
                collector.addRule(`
                    .quick-input-list .monaco-list-row {
                        outline-offset: -1px;
                    }
                    .quick-input-list .monaco-list-row.focused {
                        outline: 1px dotted ${focusBorder};
                    }
                    .quick-input-list .monaco-list-row:hover {
                        outline: 1px dashed ${focusBorder};
                    }
                `);
                // Input box always displays an outline, even when unfocused
                collector.addRule(`
                    .monaco-editor .find-widget .monaco-inputbox {
                        outline: var(--theia-border-width) solid;
                        outline-offset: calc(-1 * var(--theia-border-width));
                        outline-color: var(--theia-focusBorder);
                    }
                `);
            }
            if (contrastBorder) {
                collector.addRule(`
                    .quick-input-widget {
                        outline: 1px solid ${contrastBorder};
                        outline-offset: -1px;
                    }
                `);
            }
        }
        else {
            collector.addRule(`
                .quick-input-widget {
                    box-shadow: rgb(0 0 0 / 36%) 0px 0px 8px 2px;
                }
            `);
        }
    }
    /**
     * For reasons that are unclear, while most preferences that apply in editors are validated, a few are not.
     * There is a utility in `examples/api-samples/src/browser/monaco-editor-preferences/monaco-editor-preference-extractor.ts` to help determine which are not.
     * Check `src/vs/editor/common/config/editorOptions.ts` for constructor arguments and to make sure that the preference names used to extract constructors are still accurate.
     */
    addAdditionalPreferenceValidations() {
        let editorIntConstructor;
        let editorBoolConstructor;
        let editorStringEnumConstructor;
        for (const validator of editorOptions_1.editorOptionsRegistry) {
            /* eslint-disable @typescript-eslint/no-explicit-any,max-len */
            if (editorIntConstructor && editorBoolConstructor && editorStringEnumConstructor) {
                break;
            }
            if (validator.name === 'acceptSuggestionOnCommitCharacter') {
                editorBoolConstructor = validator.constructor;
            }
            else if (validator.name === 'acceptSuggestionOnEnter') {
                editorStringEnumConstructor = validator.constructor;
            }
            else if (validator.name === 'accessibilityPageSize') {
                editorIntConstructor = validator.constructor;
            }
            /* eslint-enable @typescript-eslint/no-explicit-any */
        }
        if (editorIntConstructor && editorBoolConstructor && editorStringEnumConstructor) {
            let id = 200; // Needs to be bigger than the biggest index in the EditorOption enum.
            editorOptions_1.editorOptionsRegistry.push(new editorIntConstructor(id++, 'tabSize', 4, 1, core_1.MAX_SAFE_INTEGER, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.tabSize']), new editorBoolConstructor(id++, 'insertSpaces', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.insertSpaces']), new editorBoolConstructor(id++, 'detectIndentation', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.detectIndentation']), new editorBoolConstructor(id++, 'trimAutoWhitespace', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.trimAutoWhitespace']), new editorBoolConstructor(id++, 'largeFileOptimizations', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.largeFileOptimizations']), new editorBoolConstructor(id++, 'wordBasedSuggestions', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.wordBasedSuggestions']), new editorStringEnumConstructor(id++, 'wordBasedSuggestionsMode', 'matchingDocuments', editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.wordBasedSuggestionsMode'].enum, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.wordBasedSuggestionsMode']), new editorBoolConstructor(id++, 'stablePeek', false, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.stablePeek']), new editorIntConstructor(id++, 'maxTokenizationLineLength', 20000, 1, core_1.MAX_SAFE_INTEGER, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.maxTokenizationLineLength']));
        }
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService),
    __metadata("design:type", monaco_editor_service_1.MonacoEditorService)
], MonacoFrontendApplicationContribution.prototype, "codeEditorService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], MonacoFrontendApplicationContribution.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(contextKeyService_1.ContextKeyService),
    __metadata("design:type", contextKeyService_1.ContextKeyService)
], MonacoFrontendApplicationContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider),
    __metadata("design:type", monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider)
], MonacoFrontendApplicationContribution.prototype, "snippetSuggestProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], MonacoFrontendApplicationContribution.prototype, "preferenceSchema", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], MonacoFrontendApplicationContribution.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_context_menu_1.MonacoContextMenuService),
    __metadata("design:type", monaco_context_menu_1.MonacoContextMenuService)
], MonacoFrontendApplicationContribution.prototype, "contextMenuService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theming_service_1.MonacoThemingService),
    __metadata("design:type", monaco_theming_service_1.MonacoThemingService)
], MonacoFrontendApplicationContribution.prototype, "monacoThemingService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoFrontendApplicationContribution.prototype, "init", null);
MonacoFrontendApplicationContribution = __decorate([
    (0, inversify_1.injectable)()
], MonacoFrontendApplicationContribution);
exports.MonacoFrontendApplicationContribution = MonacoFrontendApplicationContribution;
//# sourceMappingURL=monaco-frontend-application-contribution.js.map