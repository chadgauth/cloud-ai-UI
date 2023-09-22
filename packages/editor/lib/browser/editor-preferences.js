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
exports.bindEditorPreferences = exports.createEditorPreferences = exports.EditorPreferences = exports.EditorPreferenceContribution = exports.editorPreferenceSchema = void 0;
const preferences_1 = require("@theia/core/lib/browser/preferences");
const injectable_preference_proxy_1 = require("@theia/core/lib/browser/preferences/injectable-preference-proxy");
const nls_1 = require("@theia/core/lib/common/nls");
const core_1 = require("@theia/core");
const editor_generated_preference_schema_1 = require("./editor-generated-preference-schema");
/* eslint-disable @theia/localization-check,max-len,no-null/no-null */
// #region src/vs/workbench/contrib/codeActions/browser/codeActionsContribution.ts
const codeActionsContributionSchema = {
    'editor.codeActionsOnSave': {
        oneOf: [
            {
                type: 'object',
                properties: {
                    'source.fixAll': {
                        type: 'boolean',
                        description: nls_1.nls.localizeByDefault('Controls whether auto fix action should be run on file save.')
                    }
                },
                additionalProperties: {
                    type: 'boolean'
                },
            },
            {
                type: 'array',
                items: { type: 'string' }
            }
        ],
        default: {},
        description: nls_1.nls.localizeByDefault('Code action kinds to be run on save.'),
        scope: 'language-overridable',
    }
};
// #endregion
// #region src/vs/workbench/contrib/files/browser/files.contribution.ts
const fileContributionSchema = {
    'editor.formatOnSave': {
        'type': 'boolean',
        'description': nls_1.nls.localizeByDefault('Format a file on save. A formatter must be available, the file must not be saved after delay, and the editor must not be shutting down.'),
        'scope': preferences_1.PreferenceScope.fromString('language-overridable'),
    },
    'editor.formatOnSaveMode': {
        'type': 'string',
        'default': 'file',
        'enum': [
            'file',
            'modifications',
            'modificationsIfAvailable'
        ],
        'enumDescriptions': [
            nls_1.nls.localizeByDefault('Format the whole file.'),
            nls_1.nls.localizeByDefault('Format modifications (requires source control).'),
            nls_1.nls.localize('theia/editor/editor.formatOnSaveMode.modificationsIfAvailable', "Will attempt to format modifications only (requires source control). If source control can't be used, then the whole file will be formatted."),
        ],
        'markdownDescription': nls_1.nls.localizeByDefault('Controls if format on save formats the whole file or only modifications. Only applies when `#editor.formatOnSave#` is enabled.'),
        'scope': preferences_1.PreferenceScope.fromString('language-overridable'),
    },
    // Include this, even though it is not strictly an `editor`preference.
    'files.eol': {
        'type': 'string',
        'enum': [
            '\n',
            '\r\n',
            'auto'
        ],
        'enumDescriptions': [
            nls_1.nls.localizeByDefault('LF'),
            nls_1.nls.localizeByDefault('CRLF'),
            nls_1.nls.localizeByDefault('Uses operating system specific end of line character.')
        ],
        'default': 'auto',
        'description': nls_1.nls.localizeByDefault('The default end of line character.'),
        'scope': preferences_1.PreferenceScope.fromString('language-overridable')
    },
    // We used to call these `editor.autoSave` and `editor.autoSaveDelay`.
    'files.autoSave': {
        'type': 'string',
        'enum': ['off', 'afterDelay', 'onFocusChange', 'onWindowChange'],
        'markdownEnumDescriptions': [
            nls_1.nls.localize('theia/editor/files.autoSave.off', 'An editor with changes is never automatically saved.'),
            nls_1.nls.localize('theia/editor/files.autoSave.afterDelay', 'An editor with changes is automatically saved after the configured `#files.autoSaveDelay#`.'),
            nls_1.nls.localize('theia/editor/files.autoSave.onFocusChange', 'An editor with changes is automatically saved when the editor loses focus.'),
            nls_1.nls.localize('theia/editor/files.autoSave.onWindowChange', 'An editor with changes is automatically saved when the window loses focus.')
        ],
        'default': core_1.environment.electron.is() ? 'off' : 'afterDelay',
        'markdownDescription': nls_1.nls.localize('theia/editor/files.autoSave', 'Controls [auto save](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save) of editors that have unsaved changes.', 'off', 'afterDelay', 'onFocusChange', 'onWindowChange', 'afterDelay')
    },
    'files.autoSaveDelay': {
        'type': 'number',
        'default': 1000,
        'minimum': 0,
        'markdownDescription': nls_1.nls.localizeByDefault('Controls the delay in milliseconds after which an editor with unsaved changes is saved automatically. Only applies when `#files.autoSave#` is set to `{0}`.', 'afterDelay')
    },
    'files.refactoring.autoSave': {
        'type': 'boolean',
        'default': true,
        'description': nls_1.nls.localizeByDefault('Controls if files that were part of a refactoring are saved automatically')
    }
};
// #endregion
// #region src/vs/workbench/contrib/format/browser/formatActionsMultiple.ts
// This schema depends on a lot of private stuff in the file, so this is a stripped down version.
const formatActionsMultipleSchema = {
    'editor.defaultFormatter': {
        description: nls_1.nls.localizeByDefault('Defines a default formatter which takes precedence over all other formatter settings. Must be the identifier of an extension contributing a formatter.'),
        type: ['string', 'null'],
        default: null,
    }
};
// #endregion
// #region Custom Theia extensions to editor preferences
const theiaEditorSchema = {
    'editor.formatOnSaveTimeout': {
        'type': 'number',
        'default': 750,
        'description': nls_1.nls.localize('theia/editor/formatOnSaveTimeout', 'Timeout in milliseconds after which the formatting that is run on file save is cancelled.')
    },
    'editor.history.persistClosedEditors': {
        'type': 'boolean',
        'default': false,
        'description': nls_1.nls.localize('theia/editor/persistClosedEditors', 'Controls whether to persist closed editor history for the workspace across window reloads.')
    },
};
// #endregion
const combinedProperties = {
    ...editor_generated_preference_schema_1.editorGeneratedPreferenceProperties,
    ...codeActionsContributionSchema,
    ...fileContributionSchema,
    ...formatActionsMultipleSchema,
    ...theiaEditorSchema
};
exports.editorPreferenceSchema = {
    'type': 'object',
    'scope': 'resource',
    'overridable': true,
    'properties': combinedProperties,
};
exports.EditorPreferenceContribution = Symbol('EditorPreferenceContribution');
exports.EditorPreferences = Symbol('EditorPreferences');
/**
 * @deprecated @since 1.23.0
 *
 * By default, editor preferences now use a validated preference proxy created by the PreferenceProxyFactory binding.
 * This function will create an unvalidated preference proxy.
 * See {@link bindEditorPreferences}
 */
function createEditorPreferences(preferences, schema = exports.editorPreferenceSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createEditorPreferences = createEditorPreferences;
function bindEditorPreferences(bind) {
    bind(exports.EditorPreferences).toDynamicValue(ctx => {
        const factory = ctx.container.get(injectable_preference_proxy_1.PreferenceProxyFactory);
        return factory(exports.editorPreferenceSchema);
    }).inSingletonScope();
    bind(exports.EditorPreferenceContribution).toConstantValue({ schema: exports.editorPreferenceSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.EditorPreferenceContribution);
}
exports.bindEditorPreferences = bindEditorPreferences;
//# sourceMappingURL=editor-preferences.js.map