"use strict";
/********************************************************************************
 * Copyright (C) 2022 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
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
exports.bindMonacoPreferenceExtractor = exports.MonacoEditorPreferenceSchemaExtractor = void 0;
/**
 * The command contributed in this file allows us to generate a copy of the schema expected for editor preferences by Monaco,
 * as well as an interface corresponding to those properties for use with our EditorPreferences PreferenceProxy.
 * It examines the schemata registered with the Monaco `ConfigurationRegistry` and writes any configurations associated with the editor
 * to a file in the `editor` package. It also generates an interface based on the types specified in the schema.
 * The only manual work required during a Monaco uplift is to run the command and then update any fields of the interface where the
 * schema type is `array` or `object`, since it is tricky to extract the type details for such fields automatically.
 */
const configurationRegistry_1 = require("@theia/monaco-editor-core/esm/vs/platform/configuration/common/configurationRegistry");
const platform_1 = require("@theia/monaco-editor-core/esm/vs/platform/registry/common/platform");
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const browser_1 = require("@theia/workspace/lib/browser");
const browser_2 = require("@theia/core/lib/browser");
const editorOptions_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/config/editorOptions");
const monaco_editor_provider_1 = require("@theia/monaco/lib/browser/monaco-editor-provider");
function generateContent(properties, interfaceEntries) {
    return `/********************************************************************************
 * Copyright (C) 2022 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

import { isOSX, isWindows, nls } from '@theia/core';
import { PreferenceSchema } from '@theia/core/lib/browser';

/* eslint-disable @typescript-eslint/quotes,max-len,no-null/no-null */

/**
 * Please do not modify this file by hand. It should be generated automatically
 * during a Monaco uplift using the command registered by monaco-editor-preference-extractor.ts
 * The only manual work required is fixing preferences with type 'array' or 'object'.
 */

export const editorGeneratedPreferenceProperties: PreferenceSchema['properties'] = ${properties};

export interface GeneratedEditorPreferences {
    ${interfaceEntries.join('\n    ')}
}
`;
}
const dequoteMarker = '@#@';
// From src/vs/editor/common/config/editorOptions.ts
const DEFAULT_WINDOWS_FONT_FAMILY = "Consolas, \\'Courier New\\', monospace";
const DEFAULT_MAC_FONT_FAMILY = "Menlo, Monaco, \\'Courier New\\', monospace";
const DEFAULT_LINUX_FONT_FAMILY = "\\'Droid Sans Mono\\', \\'monospace\\', monospace";
const fontFamilyText = `${dequoteMarker}isOSX ? '${DEFAULT_MAC_FONT_FAMILY}' : isWindows ? '${DEFAULT_WINDOWS_FONT_FAMILY}' : '${DEFAULT_LINUX_FONT_FAMILY}'${dequoteMarker}`;
const fontSizeText = `${dequoteMarker}isOSX ? 12 : 14${dequoteMarker}`;
/**
 * This class is intended for use when uplifting Monaco.
 */
let MonacoEditorPreferenceSchemaExtractor = class MonacoEditorPreferenceSchemaExtractor {
    registerCommands(commands) {
        commands.registerCommand({ id: 'check-for-unvalidated-editor-preferences', label: 'Check for unvalidated editor preferences in Monaco' }, {
            execute: () => {
                var _a;
                const firstRootUri = (_a = this.workspaceService.tryGetRoots()[0]) === null || _a === void 0 ? void 0 : _a.resource;
                if (firstRootUri) {
                    const validatedEditorPreferences = new Set(editorOptions_1.editorOptionsRegistry.map(validator => validator.name));
                    const allEditorPreferenceKeys = Object.keys(this.monacoEditorProvider['createOptions'](this.monacoEditorProvider['preferencePrefixes'], firstRootUri.toString(), 'typescript'));
                    const unvalidatedKeys = allEditorPreferenceKeys.filter(key => !validatedEditorPreferences.has(key));
                    console.log('Unvalidated keys are:', unvalidatedKeys);
                }
            }
        });
        commands.registerCommand({ id: 'extract-editor-preference-schema', label: 'Extract editor preference schema from Monaco' }, {
            execute: async () => {
                var _a;
                const roots = this.workspaceService.tryGetRoots();
                if (roots.length !== 1 || !((_a = roots[0].resource.path.toString()) !== null && _a !== void 0 ? _a : '').includes('theia')) {
                    this.messageService.warn('This command should only be executed in the Theia workspace.');
                }
                const theiaRoot = roots[0];
                const fileToWrite = theiaRoot.resource.resolve('packages/editor/src/browser/editor-generated-preference-schema.ts');
                const properties = {};
                platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurations().forEach(config => {
                    if (config.id === 'editor' && config.properties) {
                        Object.assign(properties, config.properties);
                    }
                });
                this.guaranteePlatformOptions(properties);
                const interfaceEntries = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                for (const [name, description] of Object.entries(properties)) {
                    description.scope = this.getScope(description.scope);
                    delete description.defaultDefaultValue;
                    if (name === 'editor.fontSize') {
                        description.default = fontSizeText;
                    }
                    else if (name === 'editor.fontFamily') {
                        description.default = fontFamilyText;
                    }
                    interfaceEntries.push(`'${name}': ${this.formatSchemaForInterface(description)};`);
                }
                const stringified = JSON.stringify(properties, this.codeSnippetReplacer(), 4);
                const propertyList = this.dequoteCodeSnippets(stringified);
                const content = generateContent(propertyList, interfaceEntries);
                await this.fileService.write(fileToWrite, content);
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    codeSnippetReplacer() {
        // JSON.stringify doesn't give back the whole context when serializing so we use state...
        let lastPreferenceName;
        return (key, value) => {
            if (key.startsWith('editor.') || key.startsWith('diffEditor.')) {
                lastPreferenceName = key;
            }
            if ((key === 'description' || key === 'markdownDescription') && typeof value === 'string') {
                if (value.length === 0) {
                    return value;
                }
                const defaultKey = core_1.nls.getDefaultKey(value);
                if (defaultKey) {
                    return `${dequoteMarker}nls.localizeByDefault(${dequoteMarker}"${value}${dequoteMarker}")${dequoteMarker}`;
                }
                else {
                    const localizationKey = `${dequoteMarker}"theia/editor/${lastPreferenceName}${dequoteMarker}"`;
                    return `${dequoteMarker}nls.localize(${localizationKey}, ${dequoteMarker}"${value}${dequoteMarker}")${dequoteMarker}`;
                }
            }
            if ((key === 'enumDescriptions' || key === 'markdownEnumDescriptions') && Array.isArray(value)) {
                return value.map((description, i) => {
                    if (description.length === 0) {
                        return description;
                    }
                    const defaultKey = core_1.nls.getDefaultKey(description);
                    if (defaultKey) {
                        return `${dequoteMarker}nls.localizeByDefault(${dequoteMarker}"${description}${dequoteMarker}")${dequoteMarker}`;
                    }
                    else {
                        const localizationKey = `${dequoteMarker}"theia/editor/${lastPreferenceName}${i}${dequoteMarker}"`;
                        return `${dequoteMarker}nls.localize(${localizationKey}, ${dequoteMarker}"${description}${dequoteMarker}")${dequoteMarker}`;
                    }
                });
            }
            return value;
        };
    }
    ;
    getScope(monacoScope) {
        switch (monacoScope) {
            case 6 /* MACHINE_OVERRIDABLE */:
            case 3 /* WINDOW */:
                return 'window';
            case 4 /* RESOURCE */:
                return 'resource';
            case 5 /* LANGUAGE_OVERRIDABLE */:
                return 'language-overridable';
            case 1 /* APPLICATION */:
            case 2 /* MACHINE */:
                return 'application';
        }
        return undefined;
    }
    formatSchemaForInterface(schema) {
        var _a, _b;
        const defaultValue = schema.default !== undefined ? schema.default : schema.defaultValue;
        // There are a few preferences for which VSCode uses defaults that do not match the schema. We have to handle those manually.
        if (defaultValue !== undefined && this.preferenceValidationService.validateBySchema('any-preference', defaultValue, schema) !== defaultValue) {
            return 'HelpBadDefaultValue';
        }
        const jsonType = schema.const !== undefined ? schema.const : ((_a = schema.enum) !== null && _a !== void 0 ? _a : schema.type);
        if (jsonType === undefined) {
            const subschemata = (_b = schema.anyOf) !== null && _b !== void 0 ? _b : schema.oneOf;
            if (subschemata) {
                const permittedTypes = [].concat.apply(subschemata.map(subschema => this.formatSchemaForInterface(subschema).split(' | ')));
                return Array.from(new Set(permittedTypes)).join(' | ');
            }
        }
        return this.formatTypeForInterface(jsonType);
    }
    formatTypeForInterface(jsonType) {
        if (Array.isArray(jsonType)) {
            return jsonType.map(subtype => this.formatTypeForInterface(subtype)).join(' | ');
        }
        switch (jsonType) {
            case 'boolean':
            case 'number':
            case 'string':
            case 'true':
            case 'false':
                return jsonType;
            case true:
            case false:
            case null: // eslint-disable-line no-null/no-null
                return `${jsonType}`;
            case 'integer':
                return 'number';
            case 'array':
            case 'object':
            case undefined:
                // These have to be fixed manually, so we output a type that will cause a TS error.
                return 'Help';
        }
        // Most of the rest are string literals.
        return `'${jsonType}'`;
    }
    dequoteCodeSnippets(stringification) {
        return stringification
            .replace(new RegExp(`${dequoteMarker}"|"${dequoteMarker}|${dequoteMarker}\\\\`, 'g'), '')
            .replace(new RegExp(`\\\\"${dequoteMarker}`, 'g'), '"')
            .replace(/\\\\'/g, "\\'");
    }
    /**
     * Ensures that options that are only relevant on certain platforms are caught.
     * Check for use of `platform` in src/vs/editor/common/config/editorOptions.ts
     */
    guaranteePlatformOptions(properties) {
        Object.assign(properties, {
            'editor.find.globalFindClipboard': {
                type: 'boolean',
                default: false,
                description: 'Controls whether the Find Widget should read or modify the shared find clipboard on macOS.',
                included: `${dequoteMarker}isOSX${dequoteMarker}`,
            },
            'editor.selectionClipboard': {
                type: 'boolean',
                default: true,
                description: 'Controls whether the Linux primary clipboard should be supported.',
                included: `${dequoteMarker}!isOSX && !isWindows${dequoteMarker}`
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], MonacoEditorPreferenceSchemaExtractor.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], MonacoEditorPreferenceSchemaExtractor.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MonacoEditorPreferenceSchemaExtractor.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceValidationService),
    __metadata("design:type", browser_2.PreferenceValidationService)
], MonacoEditorPreferenceSchemaExtractor.prototype, "preferenceValidationService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_provider_1.MonacoEditorProvider),
    __metadata("design:type", monaco_editor_provider_1.MonacoEditorProvider)
], MonacoEditorPreferenceSchemaExtractor.prototype, "monacoEditorProvider", void 0);
MonacoEditorPreferenceSchemaExtractor = __decorate([
    (0, inversify_1.injectable)()
], MonacoEditorPreferenceSchemaExtractor);
exports.MonacoEditorPreferenceSchemaExtractor = MonacoEditorPreferenceSchemaExtractor;
// Utility to assist with Monaco uplifts to generate preference schema. Not for regular use in the application.
function bindMonacoPreferenceExtractor(bind) {
    // bind(MonacoEditorPreferenceSchemaExtractor).toSelf().inSingletonScope();
    // bind(CommandContribution).toService(MonacoEditorPreferenceSchemaExtractor);
}
exports.bindMonacoPreferenceExtractor = bindMonacoPreferenceExtractor;
//# sourceMappingURL=monaco-editor-preference-extractor.js.map