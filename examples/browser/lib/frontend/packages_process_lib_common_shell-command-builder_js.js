"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_process_lib_common_shell-command-builder_js"],{

/***/ "../../packages/process/lib/common/shell-command-builder.js":
/*!******************************************************************!*\
  !*** ../../packages/process/lib/common/shell-command-builder.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShellCommandBuilder = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable no-null/no-null */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const shell_quoting_1 = __webpack_require__(/*! ../common/shell-quoting */ "../../packages/process/lib/common/shell-quoting.js");
/**
 * Create command lines ready to be sent to a shell's stdin for evaluation.
 */
let ShellCommandBuilder = class ShellCommandBuilder {
    /**
     * Constructs a command line to run in a shell. The shell could be
     * re-used/long-lived, this means we cannot spawn a new process with a nice
     * and fresh environment, we need to encode environment modifications into
     * the returned command.
     *
     * Inspired by VS Code implementation, see:
     * https://github.com/microsoft/vscode/blob/f395cac4fff0721a8099126172c01411812bcb4a/src/vs/workbench/contrib/debug/node/terminals.ts#L79
     *
     * @param hostProcessInfo the host terminal process infos
     * @param commandOptions program to execute in the host terminal
     */
    buildCommand(hostProcessInfo, commandOptions) {
        const host = hostProcessInfo && hostProcessInfo.executable;
        const cwd = commandOptions.cwd;
        const args = commandOptions.args.map(value => ({
            value, quoting: "strong" /* Strong */,
        }));
        const env = [];
        if (commandOptions.env) {
            for (const key of Object.keys(commandOptions.env)) {
                env.push([key, commandOptions.env[key]]);
            }
        }
        if (host) {
            if (/(bash|wsl)(.exe)?$/.test(host)) {
                return this.buildForBash(args, cwd, env);
            }
            else if (/(ps|pwsh|powershell)(.exe)?$/i.test(host)) {
                return this.buildForPowershell(args, cwd, env);
            }
            else if (/cmd(.exe)?$/i.test(host)) {
                return this.buildForCmd(args, cwd, env);
            }
        }
        return this.buildForDefault(args, cwd, env);
    }
    buildForBash(args, cwd, env) {
        let command = '';
        if (cwd) {
            command += `cd ${shell_quoting_1.BashQuotingFunctions.strong(cwd)} && `;
        }
        if (env === null || env === void 0 ? void 0 : env.length) {
            command += 'env';
            for (const [key, value] of env) {
                if (value === null) {
                    command += ` -u ${shell_quoting_1.BashQuotingFunctions.strong(key)}`;
                }
                else {
                    command += ` ${shell_quoting_1.BashQuotingFunctions.strong(`${key}=${value}`)}`;
                }
            }
            command += ' ';
        }
        command += this.createShellCommandLine(args, shell_quoting_1.BashQuotingFunctions);
        return command;
    }
    buildForPowershell(args, cwd, env) {
        let command = '';
        if (cwd) {
            command += `cd ${shell_quoting_1.PowershellQuotingFunctions.strong(cwd)}; `;
        }
        if (env === null || env === void 0 ? void 0 : env.length) {
            for (const [key, value] of env) {
                // Powershell requires special quoting when dealing with
                // environment variable names.
                const quotedKey = key
                    .replace(/`/g, '````')
                    .replace(/\?/g, '``?');
                if (value === null) {
                    command += `Remove-Item \${env:${quotedKey}}; `;
                }
                else {
                    command += `\${env:${quotedKey}}=${shell_quoting_1.PowershellQuotingFunctions.strong(value)}; `;
                }
            }
        }
        command += '& ' + this.createShellCommandLine(args, shell_quoting_1.PowershellQuotingFunctions);
        return command;
    }
    buildForCmd(args, cwd, env) {
        let command = '';
        if (cwd) {
            command += `cd ${shell_quoting_1.CmdQuotingFunctions.strong(cwd)} && `;
        }
        // Current quoting mechanism only works within a nested `cmd` call:
        command += 'cmd /C "';
        if (env === null || env === void 0 ? void 0 : env.length) {
            for (const [key, value] of env) {
                if (value === null) {
                    command += `set ${shell_quoting_1.CmdQuotingFunctions.strong(key)}="" && `;
                }
                else {
                    command += `set ${shell_quoting_1.CmdQuotingFunctions.strong(`${key}=${value}`)} && `;
                }
            }
        }
        command += this.createShellCommandLine(args, shell_quoting_1.CmdQuotingFunctions);
        command += '"';
        return command;
    }
    buildForDefault(args, cwd, env) {
        return this.buildForBash(args, cwd, env);
    }
    /**
     * This method will try to leave `arg[0]` unescaped if possible. The reason
     * is that shells like `cmd` expect their own commands like `dir` to be
     * unescaped.
     *
     * @returns empty string if `args` is empty, otherwise an escaped command.
     */
    createShellCommandLine(args, quotingFunctions) {
        let command = '';
        if (args.length > 0) {
            const [exec, ...execArgs] = args;
            // Some commands like `dir` should not be quoted for `cmd` to understand:
            command += this.quoteExecutableIfNecessary(exec, quotingFunctions);
            if (execArgs.length > 0) {
                command += ' ' + (0, shell_quoting_1.createShellCommandLine)(execArgs, quotingFunctions);
            }
        }
        return command;
    }
    quoteExecutableIfNecessary(exec, quotingFunctions) {
        return typeof exec === 'string' && !this.needsQuoting(exec) ? exec : (0, shell_quoting_1.escapeForShell)(exec, quotingFunctions);
    }
    /**
     * If this method returns `false` then we definitely need quoting.
     *
     * May return false positives.
     */
    needsQuoting(arg) {
        return /\W/.test(arg);
    }
};
ShellCommandBuilder = __decorate([
    (0, inversify_1.injectable)()
], ShellCommandBuilder);
exports.ShellCommandBuilder = ShellCommandBuilder;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/process/lib/common/shell-command-builder'] = this;


/***/ }),

/***/ "../../packages/process/lib/common/shell-quoting.js":
/*!**********************************************************!*\
  !*** ../../packages/process/lib/common/shell-quoting.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PowershellQuotingFunctions = exports.CmdQuotingFunctions = exports.BashQuotingFunctions = exports.escapeForShell = exports.createShellCommandLine = void 0;
/**
 * Converts a list of args into an escaped shell command.
 *
 * There are two main use cases when handling command/arguments for a shell:
 * 1. User already wrote the escaped commandline, then just use that.
 * 2. User wants a specific process to be invoked with some arguments.
 *
 * The `createShellCommandLine` function is useful for the latter.
 *
 * @param args Standard list of spawn/exec arguments, first item is the command.
 * @param quotingFunctions Collection of functions to process arguments.
 */
function createShellCommandLine(args, quotingFunctions) {
    return args.map(arg => escapeForShell(arg, quotingFunctions)).join(' ');
}
exports.createShellCommandLine = createShellCommandLine;
/**
 * Escape (or quote) a given input.
 *
 * @param arg Input to escape.
 * @param quotingFunctions Collection of functions to process the given `arg`.
 * @param quotingType Override the quoting type specified by the given `arg`.
 */
function escapeForShell(arg, quotingFunctions, quotingType) {
    let value;
    let quoting = quotingType;
    if (typeof arg === 'string') {
        if (!quoting) {
            return arg;
        }
        value = arg;
    }
    else {
        if (!quoting) {
            quoting = arg.quoting;
        }
        value = arg.value;
    }
    if (quotingFunctions && typeof quotingFunctions[quoting] === 'function') {
        return quotingFunctions[quoting](value);
    }
    return value;
}
exports.escapeForShell = escapeForShell;
exports.BashQuotingFunctions = {
    characters: {
        needQuotes: '()',
        escape: '\\',
        strong: '\'',
        weak: '"',
    },
    escape(arg) {
        return arg
            .replace(/[\s\\|(){}<>$&;"']/g, '\\$&');
    },
    strong(arg) {
        // ('+) becomes ('"'+"')
        return `'${arg
            .replace(/'+/g, '\'"$&"\'')}'`;
    },
    weak(arg) {
        return `"${arg
            // Escape escape-characters.
            .replace(/\\"/g, '\\\\"')
            // Escape user-specified double-quotes.
            .replace(/"/g, '\\"')
            // Escape trailing (\), we don't want the user to escape our last quote.
            .replace(/\\$/g, '\\\\')}"`;
    },
};
exports.CmdQuotingFunctions = {
    characters: {
        weak: '"',
    },
    escape(arg) {
        return arg
            // Escape forbidden characters (see: cmd /?).
            .replace(/[%&<>()@^|]/g, '^$&')
            // Some characters must be escaped using `\`.
            .replace(/[\\"]/g, '\\$&')
            // Double-quote whitespaces, else we cannot escape it.
            .replace(/\s+/g, '"$&"');
    },
    strong(arg) {
        return this.weak(arg)
            // Try to prevent variable expansion.
            .replace(/%/g, '"%"');
    },
    weak(arg) {
        return `"${arg
            // Escape double quotes.
            .replace(/\\"/g, '\\\\"')
            .replace(/"/g, '\\"')
            // Escape forbidden characters (see: cmd /?)
            .replace(/[&<>()@^|]/g, '^$&')
            // Escape trailing backslash, we don't want the user to escape our last quote.
            .replace(/\\$/g, '\\\\')
            // Escape line returns
            .replace(/\r?\n/g, '^$&')}"`;
    },
};
exports.PowershellQuotingFunctions = {
    characters: {
        needQuotes: '()',
        escape: '`',
        strong: '\'',
        weak: '"',
    },
    escape(arg) {
        return arg.replace(/[`|{}()<>;"' ]/g, '`$&');
    },
    strong(arg) {
        // In powershell, one must write ('') for a single quote to be displayed
        // within a single quoted string.
        return `'${arg
            .replace(/'/g, '\'\'')}'`;
    },
    weak(arg) {
        return `"${arg
            // Escape escape-characters.
            .replace(/`"/g, '``"')
            // Escape user-specified backticks.
            .replace(/"/g, '`"')
            // Escape trailing (`), we don't want the user to escape our last quote.
            .replace(/`$/g, '``')}"`;
    },
};

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/process/lib/common/shell-quoting'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_process_lib_common_shell-command-builder_js.js.map