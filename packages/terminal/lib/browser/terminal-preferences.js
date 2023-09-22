"use strict";
// *****************************************************************************
// Copyright (C) 2018 Bitsler and others.
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
exports.bindTerminalPreferences = exports.createTerminalPreferences = exports.TerminalPreferences = exports.TerminalPreferenceContribution = exports.isTerminalRendererType = exports.DEFAULT_TERMINAL_RENDERER_TYPE = exports.TerminalConfigSchema = void 0;
const browser_1 = require("@theia/core/lib/browser");
const nls_1 = require("@theia/core/lib/common/nls");
const editor_generated_preference_schema_1 = require("@theia/editor/lib/browser/editor-generated-preference-schema");
const core_1 = require("@theia/core");
const terminal_theme_service_1 = require("./terminal-theme-service");
const commonProfileProperties = {
    env: {
        type: 'object',
        additionalProperties: {
            type: 'string'
        },
        markdownDescription: nls_1.nls.localizeByDefault('An object with environment variables that will be added to the terminal profile process. Set to `null` to delete environment variables from the base environment.'),
    },
    overrideName: {
        type: 'boolean',
        description: nls_1.nls.localizeByDefault('Controls whether or not the profile name overrides the auto detected one.')
    },
    icon: {
        type: 'string',
        markdownDescription: nls_1.nls.localize('theia/terminal/profileIcon', 'A codicon ID to associate with the terminal icon.\nterminal-tmux:"$(terminal-tmux)"')
    },
    color: {
        type: 'string',
        enum: Object.getOwnPropertyNames(terminal_theme_service_1.terminalAnsiColorMap),
        description: nls_1.nls.localize('theia/terminal/profileColor', 'A terminal theme color ID to associate with the terminal.')
    }
};
const stringOrStringArray = {
    oneOf: [
        { type: 'string' },
        {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    ]
};
const pathProperty = {
    description: nls_1.nls.localize('theia/terminal/profilePath', 'The path of the shell that this profile uses.'),
    ...stringOrStringArray
};
function shellArgsDeprecatedMessage(type) {
    return nls_1.nls.localize('theia/terminal/shell.deprecated', 'This is deprecated, the new recommended way to configure your default shell is by creating a terminal profile in \'terminal.integrated.profiles.{0}\' and setting its profile name as the default in \'terminal.integrated.defaultProfile.{0}.\'', type.toString().toLowerCase());
}
exports.TerminalConfigSchema = {
    type: 'object',
    properties: {
        'terminal.enableCopy': {
            type: 'boolean',
            description: nls_1.nls.localize('theia/terminal/enableCopy', 'Enable ctrl-c (cmd-c on macOS) to copy selected text'),
            default: true
        },
        'terminal.enablePaste': {
            type: 'boolean',
            description: nls_1.nls.localize('theia/terminal/enablePaste', 'Enable ctrl-v (cmd-v on macOS) to paste from clipboard'),
            default: true
        },
        'terminal.integrated.fontFamily': {
            type: 'string',
            markdownDescription: nls_1.nls.localizeByDefault('Controls the font family of the terminal. Defaults to {0}\'s value.', '`#editor.fontFamily#`'),
            default: editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.fontFamily'].default,
        },
        'terminal.integrated.fontSize': {
            type: 'number',
            description: nls_1.nls.localizeByDefault('Controls the font size in pixels of the terminal.'),
            minimum: 6,
            default: editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.fontSize'].default
        },
        'terminal.integrated.fontWeight': {
            type: 'string',
            enum: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            description: nls_1.nls.localizeByDefault('The font weight to use within the terminal for non-bold text. Accepts \"normal\" and \"bold\" keywords or numbers between 1 and 1000.'),
            default: 'normal'
        },
        'terminal.integrated.fontWeightBold': {
            type: 'string',
            enum: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            description: nls_1.nls.localizeByDefault('The font weight to use within the terminal for bold text. Accepts \"normal\" and \"bold\" keywords or numbers between 1 and 1000.'),
            default: 'bold'
        },
        'terminal.integrated.drawBoldTextInBrightColors': {
            description: nls_1.nls.localizeByDefault('Controls whether bold text in the terminal will always use the \"bright\" ANSI color variant.'),
            type: 'boolean',
            default: true,
        },
        'terminal.integrated.letterSpacing': {
            description: nls_1.nls.localizeByDefault('Controls the letter spacing of the terminal. This is an integer value which represents the number of additional pixels to add between characters.'),
            type: 'number',
            default: 1
        },
        'terminal.integrated.lineHeight': {
            description: nls_1.nls.localizeByDefault('Controls the line height of the terminal. This number is multiplied by the terminal font size to get the actual line-height in pixels.'),
            type: 'number',
            minimum: 1,
            default: 1
        },
        'terminal.integrated.scrollback': {
            description: nls_1.nls.localizeByDefault('Controls the maximum number of lines the terminal keeps in its buffer. We pre-allocate memory based on this value in order to ensure a smooth experience. As such, as the value increases, so will the amount of memory.'),
            type: 'number',
            default: 1000
        },
        'terminal.integrated.fastScrollSensitivity': {
            markdownDescription: nls_1.nls.localizeByDefault('Scrolling speed multiplier when pressing `Alt`.'),
            type: 'number',
            default: 5,
        },
        'terminal.integrated.rendererType': {
            description: nls_1.nls.localize('theia/terminal/rendererType', 'Controls how the terminal is rendered.'),
            type: 'string',
            enum: ['canvas', 'dom'],
            default: 'canvas'
        },
        'terminal.integrated.copyOnSelection': {
            description: nls_1.nls.localizeByDefault('Controls whether text selected in the terminal will be copied to the clipboard.'),
            type: 'boolean',
            default: false,
        },
        'terminal.integrated.cursorBlinking': {
            description: nls_1.nls.localizeByDefault('Controls whether the terminal cursor blinks.'),
            type: 'boolean',
            default: false
        },
        'terminal.integrated.cursorStyle': {
            description: nls_1.nls.localizeByDefault('Controls the style of terminal cursor.'),
            enum: ['block', 'underline', 'line'],
            default: 'block'
        },
        'terminal.integrated.cursorWidth': {
            markdownDescription: nls_1.nls.localizeByDefault('Controls the width of the cursor when {0} is set to {1}.', '`#terminal.integrated.cursorStyle#`', '`line`'),
            type: 'number',
            default: 1
        },
        'terminal.integrated.shell.windows': {
            type: ['string', 'null'],
            typeDetails: { isFilepath: true },
            markdownDescription: nls_1.nls.localize('theia/terminal/shellWindows', 'The path of the shell that the terminal uses on Windows. (default: \'{0}\').', 'C:\\Windows\\System32\\cmd.exe'),
            default: undefined,
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.Windows),
        },
        'terminal.integrated.shell.osx': {
            type: ['string', 'null'],
            markdownDescription: nls_1.nls.localize('theia/terminal/shellOsx', 'The path of the shell that the terminal uses on macOS (default: \'{0}\'}).', '/bin/bash'),
            default: undefined,
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.OSX),
        },
        'terminal.integrated.shell.linux': {
            type: ['string', 'null'],
            markdownDescription: nls_1.nls.localize('theia/terminal/shellLinux', 'The path of the shell that the terminal uses on Linux (default: \'{0}\'}).', '/bin/bash'),
            default: undefined,
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.Linux),
        },
        'terminal.integrated.shellArgs.windows': {
            type: 'array',
            markdownDescription: nls_1.nls.localize('theia/terminal/shellArgsWindows', 'The command line arguments to use when on the Windows terminal.'),
            default: [],
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.Windows),
        },
        'terminal.integrated.shellArgs.osx': {
            type: 'array',
            markdownDescription: nls_1.nls.localize('theia/terminal/shellArgsOsx', 'The command line arguments to use when on the macOS terminal.'),
            default: [
                '-l'
            ],
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.OSX),
        },
        'terminal.integrated.shellArgs.linux': {
            type: 'array',
            markdownDescription: nls_1.nls.localize('theia/terminal/shellArgsLinux', 'The command line arguments to use when on the Linux terminal.'),
            default: [],
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.Linux),
        },
        'terminal.integrated.confirmOnExit': {
            type: 'string',
            description: nls_1.nls.localizeByDefault('Controls whether to confirm when the window closes if there are active terminal sessions.'),
            enum: ['never', 'always', 'hasChildProcesses'],
            enumDescriptions: [
                nls_1.nls.localizeByDefault('Never confirm.'),
                nls_1.nls.localizeByDefault('Always confirm if there are terminals.'),
                nls_1.nls.localizeByDefault('Confirm if there are any terminals that have child processes.'),
            ],
            default: 'never'
        },
        'terminal.integrated.enablePersistentSessions': {
            type: 'boolean',
            description: nls_1.nls.localizeByDefault('Persist terminal sessions/history for the workspace across window reloads.'),
            default: true
        },
        'terminal.integrated.defaultProfile.windows': {
            type: 'string',
            description: nls_1.nls.localize('theia/terminal/defaultProfile', 'The default profile used on {0}', core_1.OS.Type.Windows.toString())
        },
        'terminal.integrated.defaultProfile.linux': {
            type: 'string',
            description: nls_1.nls.localize('theia/terminal/defaultProfile', 'The default profile used on {0}', core_1.OS.Type.Linux.toString())
        },
        'terminal.integrated.defaultProfile.osx': {
            type: 'string',
            description: nls_1.nls.localize('theia/terminal/defaultProfile', 'The default profile used on {0}', core_1.OS.Type.OSX.toString())
        },
        'terminal.integrated.profiles.windows': {
            markdownDescription: nls_1.nls.localize('theia/terminal/profiles', 'The profiles to present when creating a new terminal. Set the path property manually with optional args.\nSet an existing profile to `null` to hide the profile from the list, for example: `"{0}": null`.', 'cmd'),
            anyOf: [
                {
                    type: 'object',
                    properties: {},
                    additionalProperties: {
                        oneOf: [{
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                    path: pathProperty,
                                    args: {
                                        ...stringOrStringArray,
                                        description: nls_1.nls.localize('theia/terminal/profileArgs', 'The shell arguments that this profile uses.'),
                                    },
                                    ...commonProfileProperties
                                },
                                required: ['path']
                            },
                            {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                    source: {
                                        type: 'string',
                                        description: nls_1.nls.localizeByDefault('A profile source that will auto detect the paths to the shell. Note that non-standard executable locations are not supported and must be created manually in a new profile.')
                                    },
                                    args: {
                                        ...stringOrStringArray,
                                        description: nls_1.nls.localize('theia/terminal/profileArgs', 'The shell arguments that this profile uses.'),
                                    },
                                    ...commonProfileProperties
                                },
                                required: ['source'],
                                default: {
                                    path: 'C:\\Windows\\System32\\cmd.exe'
                                }
                            }, {
                                type: 'null'
                            }]
                    },
                    default: {
                        cmd: {
                            path: 'C:\\Windows\\System32\\cmd.exe'
                        }
                    }
                },
                { type: 'null' }
            ]
        },
        'terminal.integrated.profiles.linux': {
            markdownDescription: nls_1.nls.localize('theia/terminal/profiles', 'The profiles to present when creating a new terminal. Set the path property manually with optional args.\nSet an existing profile to `null` to hide the profile from the list, for example: `"{0}": null`.', 'bash'),
            anyOf: [{
                    type: 'object',
                    properties: {},
                    additionalProperties: {
                        oneOf: [
                            {
                                type: 'object',
                                properties: {
                                    path: pathProperty,
                                    args: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: nls_1.nls.localize('theia/terminal/profileArgs', 'The shell arguments that this profile uses.'),
                                    },
                                    ...commonProfileProperties
                                },
                                required: ['path'],
                                additionalProperties: false,
                            },
                            { type: 'null' }
                        ]
                    },
                    default: {
                        path: '${env:SHELL}',
                        args: ['-l']
                    }
                },
                { type: 'null' }
            ]
        },
        'terminal.integrated.profiles.osx': {
            markdownDescription: nls_1.nls.localize('theia/terminal/profiles', 'The profiles to present when creating a new terminal. Set the path property manually with optional args.\nSet an existing profile to `null` to hide the profile from the list, for example: `"{0}": null`.', 'zsh'),
            anyOf: [{
                    type: 'object',
                    properties: {},
                    additionalProperties: {
                        oneOf: [
                            {
                                type: 'object',
                                properties: {
                                    path: pathProperty,
                                    args: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: nls_1.nls.localize('theia/terminal/profileArgs', 'The shell arguments that this profile uses.'),
                                    },
                                    ...commonProfileProperties
                                },
                                required: ['path'],
                                additionalProperties: false,
                            },
                            { type: 'null' }
                        ]
                    },
                    default: {
                        path: '${env:SHELL}',
                        args: ['-l']
                    }
                },
                { type: 'null' }
            ]
        },
    }
};
exports.DEFAULT_TERMINAL_RENDERER_TYPE = 'canvas';
function isTerminalRendererType(arg) {
    return typeof arg === 'string' && (arg === 'canvas' || arg === 'dom');
}
exports.isTerminalRendererType = isTerminalRendererType;
exports.TerminalPreferenceContribution = Symbol('TerminalPreferenceContribution');
exports.TerminalPreferences = Symbol('TerminalPreferences');
function createTerminalPreferences(preferences, schema = exports.TerminalConfigSchema) {
    return (0, browser_1.createPreferenceProxy)(preferences, schema);
}
exports.createTerminalPreferences = createTerminalPreferences;
function bindTerminalPreferences(bind) {
    bind(exports.TerminalPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(browser_1.PreferenceService);
        const contribution = ctx.container.get(exports.TerminalPreferenceContribution);
        return createTerminalPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.TerminalPreferenceContribution).toConstantValue({ schema: exports.TerminalConfigSchema });
    bind(browser_1.PreferenceContribution).toService(exports.TerminalPreferenceContribution);
}
exports.bindTerminalPreferences = bindTerminalPreferences;
//# sourceMappingURL=terminal-preferences.js.map