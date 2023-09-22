"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This test suite assumes that we run in a NodeJS environment!
 */
const child_process_1 = require("child_process");
const path_1 = require("path");
const shell_command_builder_1 = require("./shell-command-builder");
const chalk = require("chalk"); // tslint:disable-line:no-implicit-dependencies
const isWindows = process.platform === 'win32';
/**
 * Extra debugging info (very verbose).
 */
const _debug = Boolean(process.env['THEIA_PROCESS_TEST_DEBUG']);
/**
 * On Windows, some shells simply mess up the terminal's output.
 * Enable if you still want to test those.
 */
const _runWeirdShell = Boolean(process.env['THEIA_PROCESS_TEST_WEIRD_SHELL']) || undefined;
/**
 * You might only have issues with a specific shell (`cmd.exe` I am looking at you).
 */
const _onlyTestShell = process.env['THEIA_PROCESS_TEST_ONLY'] || undefined;
/**
 * Only log if environment variable is set.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debug(...parts) {
    if (_debug) {
        console.debug(...parts);
    }
}
const testResources = (0, path_1.join)(__dirname, '../../src/common/tests');
const spawnOptions = {
    // We do our own quoting, don't rely on the one done by NodeJS:
    windowsVerbatimArguments: true,
    stdio: ['pipe', 'pipe', 'pipe'],
};
// Formatting options, used with `scanLines` for debugging.
const stdoutFormat = (prefix) => (data) => `${chalk.bold(chalk.yellow(`${prefix} STDOUT:`))} ${chalk.bgYellow(chalk.black(data))}`;
const stderrFormat = (prefix) => (data) => `${chalk.bold(chalk.red(`${prefix} STDERR:`))} ${chalk.bgRed(chalk.white(data))}`;
// Default error scanner
const errorScanner = (handle) => {
    if (/^\s*\w+Error:/.test(handle.line) ||
        /^\s*Cannot find /.test(handle.line)) {
        throw new Error(handle.text);
    }
};
// Yarn mangles the PATH and creates some proxy script around node(.exe),
// which messes up our environment, failing the tests.
const hostNodePath = process.env['npm_node_execpath'] ||
    process.env['NODE'];
if (!hostNodePath) {
    throw new Error('Could not determine the real node path.');
}
const shellCommandBuilder = new shell_command_builder_1.ShellCommandBuilder();
const shellConfigs = [{
        name: 'bash',
        path: isWindows
            ? _runWeirdShell && execShellCommand('where bash.exe')
            : execShellCommand('command -v bash'),
        nodePath: isWindows && 'node' // Good enough
    }, {
        name: 'wsl',
        path: isWindows
            ? _runWeirdShell && execShellCommand('where wsl.exe')
            : undefined,
        nodePath: isWindows && 'node' // Good enough
    }, {
        name: 'cmd',
        path: isWindows
            ? execShellCommand('where cmd.exe')
            : undefined,
    }, {
        name: 'powershell',
        path: execShellCommand(isWindows
            ? 'where powershell'
            : 'command -v pwsh'),
    }];
/* eslint-disable max-len */
// 18d/12m/19y - Ubuntu 16.04:
// Powershell sometimes fails when running as part of an npm lifecycle script.
// See following error:
//
//
//  FailFast:
//  The type initializer for 'Microsoft.PowerShell.ApplicationInsightsTelemetry' threw an exception.
//
//     at System.Environment.FailFast(System.String, System.Exception)
//     at System.Environment.FailFast(System.String, System.Exception)
//     at Microsoft.PowerShell.UnmanagedPSEntry.Start(System.String, System.String[], Int32)
//     at Microsoft.PowerShell.ManagedPSEntry.Main(System.String[])
//
//  Exception details:
//  System.TypeInitializationException: The type initializer for 'Microsoft.PowerShell.ApplicationInsightsTelemetry' threw an exception. ---> System.ArgumentException: Item has already been added. Key in dictionary: 'SPAWN_WRAP_SHIM_ROOT'  Key being added: 'SPAWN_WRAP_SHIM_ROOT'
//     at System.Collections.Hashtable.Insert(Object key, Object nvalue, Boolean add)
//     at System.Environment.ToHashtable(IEnumerable`1 pairs)
//     at System.Environment.GetEnvironmentVariables()
//     at Microsoft.ApplicationInsights.Extensibility.Implementation.Platform.PlatformImplementation..ctor()
//     at Microsoft.ApplicationInsights.Extensibility.Implementation.Platform.PlatformSingleton.get_Current()
//     at Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryConfigurationFactory.Initialize(TelemetryConfiguration configuration, TelemetryModules modules)
//     at Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration.get_Active()
//     at Microsoft.PowerShell.ApplicationInsightsTelemetry..cctor()
//     --- End of inner exception stack trace ---
//     at Microsoft.PowerShell.ApplicationInsightsTelemetry.SendPSCoreStartupTelemetry()
//     at Microsoft.PowerShell.ConsoleHost.Start(String bannerText, String helpText, String[] args)
//     at Microsoft.PowerShell.ConsoleShell.Start(String bannerText, String helpText, String[] args)
//     at Microsoft.PowerShell.UnmanagedPSEntry.Start(String consoleFilePath, String[] args, Int32 argc)
/* eslint-enable max-len */
let id = 0;
for (const shellConfig of shellConfigs) {
    let skipMessage;
    if (typeof _onlyTestShell === 'string' && shellConfig.name !== _onlyTestShell) {
        skipMessage = `only testing ${_onlyTestShell}`;
    }
    else if (!shellConfig.path) {
        // For each shell, skip if we could not find the executable path.
        skipMessage = 'cannot find shell';
    }
    else {
        // Run a test in the shell to catch runtime issues.
        // CI seems to have issues with some shells depending on the environment...
        try {
            const debugName = `${shellConfig.name}/test`;
            const shellTest = (0, child_process_1.spawnSync)(shellConfig.path, {
                input: 'echo abcdefghijkl\n\n',
                timeout: 5000,
            });
            debug(stdoutFormat(debugName)(shellTest.stdout.toString()));
            debug(stderrFormat(debugName)(shellTest.stderr.toString()));
            if (!/abcdefghijkl/m.test(shellTest.output.toString())) {
                skipMessage = 'wrong test output';
            }
        }
        catch (error) {
            console.error(error);
            skipMessage = 'error occurred';
        }
    }
    /**
     * If skipMessage is set, we should skip the test and explain why.
     */
    const describeOrSkip = (callback) => {
        const describeMessage = `test ${shellConfig.name} commands`;
        if (typeof skipMessage === 'undefined') {
            describe(describeMessage, callback);
        }
        else {
            describe.skip(`${describeMessage} - skip: ${skipMessage}`, callback);
        }
    };
    describeOrSkip(function () {
        this.timeout(10000);
        let nodePath;
        let cwd;
        let submit;
        let processInfo;
        let context;
        beforeEach(() => {
            // In WSL, the node path is different than the host one (Windows vs Linux).
            nodePath = shellConfig.nodePath || hostNodePath;
            // On windows, when running bash we need to convert paths from Windows
            // to their mounting point, assuming bash is running within WSL.
            if (isWindows && /bash|wsl/.test(shellConfig.name)) {
                cwd = convertWindowsPath(testResources);
            }
            else {
                cwd = testResources;
            }
            // When running powershell, it seems like good measure to send `\n` twice...
            if (shellConfig.name === 'powershell') {
                submit = '\n\n';
            }
            // TestContext holds all state for a given test.
            const testContextName = `${shellConfig.name}/${++id}`;
            context = new TestCaseContext(testContextName, submit);
            processInfo = createShell(context, shellConfig.path);
        });
        afterEach(() => {
            processInfo.shell.kill();
            context.finalize();
        });
        it('use simple environment variables', async () => {
            const envName = 'SIMPLE_NAME';
            const envValue = 'SIMPLE_VALUE';
            await testCommandLine(context, processInfo, {
                cwd, args: [nodePath, '-p', `\`[\${process.env['${envName}']}]\``],
                env: {
                    [envName]: envValue,
                }
            }, [
                // stderr
                scanLines(context, processInfo.shell.stderr, errorScanner, stderrFormat(context.name)),
                // stdout
                scanLines(context, processInfo.shell.stdout, handle => {
                    errorScanner(handle);
                    if (handle.line.includes(`[${envValue}]`)) {
                        handle.resolve();
                    }
                }, stdoutFormat(context.name)),
            ]);
        });
        it('use problematic environment variables', async () => {
            const envName = 'A?B_C | D $PATH';
            const envValue = 'SUCCESS';
            await testCommandLine(context, processInfo, {
                cwd, args: [nodePath, '-p', `\`[\${process.env['${envName}']}]\``],
                env: {
                    [envName]: envValue,
                }
            }, [
                // stderr
                scanLines(context, processInfo.shell.stderr, errorScanner, stderrFormat(context.name)),
                // stdout
                scanLines(context, processInfo.shell.stdout, handle => {
                    errorScanner(handle);
                    if (handle.line.includes(`[${envValue}]`)) {
                        handle.resolve();
                    }
                    if (handle.line.includes('[undefined]')) {
                        handle.reject(new Error(handle.text));
                    }
                }, stdoutFormat(context.name)),
            ]);
        });
        it('command with complex arguments', async () => {
            const left = 'ABC';
            const right = 'DEF';
            await testCommandLine(context, processInfo, {
                cwd, args: [nodePath, '-e', `{
                        const left = '${left}';
                        const right = '${right}';
                        console.log(\`[\${left}|\${right}]\`);
                    }`],
            }, [
                // stderr
                scanLines(context, processInfo.shell.stderr, errorScanner, stderrFormat(context.name)),
                // stdout
                scanLines(context, processInfo.shell.stdout, handle => {
                    errorScanner(handle);
                    if (handle.line.includes(`[${left}|${right}]`)) {
                        handle.resolve();
                    }
                }, stdoutFormat(context.name)),
            ]);
        });
    });
}
/**
 * Allow `command` to fail and return undefined instead.
 */
function execShellCommand(command) {
    try {
        // If trimmed output is an empty string, return `undefined` instead:
        return (0, child_process_1.execSync)(command).toString().trim() || undefined;
    }
    catch (error) {
        console.error(command, error);
        return undefined;
    }
}
/**
 * When executing `bash.exe` on Windows, the `C:`, `D:`, etc drives are mounted under `/mnt/<drive>/...`
 */
function convertWindowsPath(windowsPath) {
    return windowsPath
        // Convert back-slashes to forward-slashes
        .replace(/\\/g, '/')
        // Convert drive-letter to usual mounting point in WSL
        .replace(/^[A-Za-z]:\//, s => `/mnt/${s[0].toLowerCase()}/`);
}
/**
 * Display trailing whitespace in a string, such as \r and \n.
 */
function displayWhitespaces(line) {
    return line
        .replace(/\r?\n/, s => s.length === 2 ? '<\\r\\n>\r\n' : '<\\n>\n');
}
/**
 * Actually run `prepareCommandLine`.
 */
async function testCommandLine(context, processInfo, options, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
firstOf) {
    const commandLine = shellCommandBuilder.buildCommand(processInfo, options);
    debug(`${chalk.bold(chalk.white(`${context.name} STDIN:`))} ${chalk.bgWhite(chalk.black(displayWhitespaces(commandLine)))}`);
    processInfo.shell.stdin.write(commandLine + context.submit);
    return Promise.race(firstOf);
}
/**
 * Creates a `(Test)ProcessInfo` object by spawning the specified shell.
 */
function createShell(context, shellExecutable, shellArguments = []) {
    const shell = (0, child_process_1.spawn)(shellExecutable, shellArguments, spawnOptions);
    debug(chalk.magenta(`${chalk.bold(`${context.name} SPAWN:`)} ${shellExecutable} ${shellArguments.join(' ')}`));
    shell.on('close', (code, signal) => debug(chalk.magenta(`${chalk.bold(`${context.name} CLOSE:`)} ${shellExecutable} code(${code}) signal(${signal})`)));
    return {
        executable: shellExecutable,
        arguments: [],
        shell,
    };
}
/**
 * Fire `callback` once per new detected line.
 */
async function scanLines(context, stream, callback, debugFormat = (s) => s) {
    return new Promise((resolve, reject) => {
        let line = '';
        let text = '';
        stream.on('close', () => {
            debug(debugFormat('<CLOSED>'));
        });
        // The `data` listener will be collected on 'close', which will happen
        // once we kill the process.
        stream.on('data', data => {
            if (context.resolved) {
                return;
            }
            const split = data.toString().split('\n');
            while (!context.resolved && split.length > 1) {
                line += split.shift() + '\n';
                text += line;
                debug(debugFormat(displayWhitespaces(line)));
                try {
                    callback({
                        resolve: (value) => {
                            if (!context.resolved) {
                                context.resolve();
                                resolve(value);
                                debug(chalk.bold(chalk.green(`${context.name} SCANLINES RESOLVED`)));
                            }
                        },
                        reject: (reason) => {
                            if (!context.resolved) {
                                context.resolve();
                                reject(reason);
                                debug(chalk.bold(chalk.red(`${context.name} SCANLINES REJECTED`)));
                            }
                        },
                        line,
                        text,
                    });
                }
                catch (error) {
                    debug(chalk.bold(chalk.red(`${context.name} SCANLINES THROWED`)));
                    context.resolve();
                    reject(error);
                    break;
                }
                line = '';
            }
            line += split[0];
        });
    });
}
/**
 * We need a test case context to help with catching listeners that timed-out,
 * and synchronize multiple listeners so that when one resolves the test case,
 * the others can be put in "sleep mode" until destruction.
 */
class TestCaseContext {
    constructor(
    /**
     * A name associated with this context, to help with debugging.
     */
    name, 
    /**
     * The characters to send in order to submit a command (mostly
     * powershell is causing issues).
     */
    submit = '\n', 
    /**
     * @internal Current state of the test case, if it is finished or not.
     */
    resolved = false) {
        this.name = name;
        this.submit = submit;
        this.resolved = resolved;
    }
    resolve() {
        this.resolved = true;
    }
    finalize() {
        if (!this.resolved) {
            this.resolve();
            debug(chalk.red(`${chalk.bold(`${this.name} CONTEXT:`)} context wasn't resolved when finalizing, resolving!`));
        }
    }
}
//# sourceMappingURL=shell-command-builder.slow-spec.js.map