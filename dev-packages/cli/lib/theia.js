"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
const fs = require("fs");
const path = require("path");
const temp = require("temp");
const yargs = require("yargs");
const yargsFactory = require("yargs/yargs");
const application_manager_1 = require("@theia/application-manager");
const application_package_1 = require("@theia/application-package");
const check_dependencies_1 = require("./check-dependencies");
const download_plugins_1 = require("./download-plugins");
const run_test_1 = require("./run-test");
const localization_manager_1 = require("@theia/localization-manager");
const node_request_service_1 = require("@theia/request/lib/node-request-service");
const ovsx_client_1 = require("@theia/ovsx-client");
const { executablePath } = require('puppeteer');
process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});
process.on('uncaughtException', error => {
    if (error) {
        console.error('Uncaught Exception: ', error.toString());
        if (error.stack) {
            console.error(error.stack);
        }
    }
    process.exit(1);
});
theiaCli();
function toStringArray(argv) {
    return argv === null || argv === void 0 ? void 0 : argv.map(arg => String(arg));
}
function rebuildCommand(command, target) {
    return {
        command,
        describe: `Rebuild/revert native node modules for "${target}"`,
        builder: {
            'cacheRoot': {
                type: 'string',
                describe: 'Root folder where to store the .browser_modules cache'
            },
            'modules': {
                alias: 'm',
                type: 'array',
                describe: 'List of modules to rebuild/revert'
            },
            'forceAbi': {
                type: 'number',
                describe: 'The Node ABI version to rebuild for'
            }
        },
        handler: ({ cacheRoot, modules, forceAbi }) => {
            // Note: `modules` is actually `string[] | undefined`.
            if (modules) {
                // It is ergonomic to pass arguments as --modules="a,b,c,..."
                // but yargs doesn't parse it this way by default.
                const flattened = [];
                for (const value of modules) {
                    if (value.includes(',')) {
                        flattened.push(...value.split(',').map(mod => mod.trim()));
                    }
                    else {
                        flattened.push(value);
                    }
                }
                modules = flattened;
            }
            (0, application_manager_1.rebuild)(target, { cacheRoot, modules, forceAbi });
        }
    };
}
function defineCommonOptions(cli) {
    return cli
        .option('app-target', {
        description: 'The target application type. Overrides `theia.target` in the application\'s package.json',
        choices: ['browser', 'electron'],
    });
}
async function theiaCli() {
    const { version } = await fs.promises.readFile(path.join(__dirname, '../package.json'), 'utf8').then(JSON.parse);
    yargs.scriptName('theia').version(version);
    const projectPath = process.cwd();
    // Create a sub `yargs` parser to read `app-target` without
    // affecting the global `yargs` instance used by the CLI.
    const { appTarget } = defineCommonOptions(yargsFactory()).help(false).parse();
    const manager = new application_manager_1.ApplicationPackageManager({ projectPath, appTarget });
    const localizationManager = new localization_manager_1.LocalizationManager();
    const { target } = manager.pck;
    defineCommonOptions(yargs)
        .command({
        command: 'start [theia-args...]',
        describe: `Start the ${target} backend`,
        // Disable this command's `--help` option so that it is forwarded to Theia's CLI
        builder: cli => cli.help(false),
        handler: async ({ theiaArgs }) => {
            manager.start(toStringArray(theiaArgs));
        }
    })
        .command({
        command: 'clean',
        describe: `Clean for the ${target} target`,
        handler: async () => {
            await manager.clean();
        }
    })
        .command({
        command: 'copy',
        describe: 'Copy various files from `src-gen` to `lib`',
        handler: async () => {
            await manager.copy();
        }
    })
        .command({
        command: 'generate',
        describe: `Generate various files for the ${target} target`,
        builder: cli => application_manager_1.ApplicationPackageManager.defineGeneratorOptions(cli),
        handler: async ({ mode, splitFrontend }) => {
            await manager.generate({ mode, splitFrontend });
        }
    })
        .command({
        command: 'build [webpack-args...]',
        describe: `Generate and bundle the ${target} frontend using webpack`,
        builder: cli => application_manager_1.ApplicationPackageManager.defineGeneratorOptions(cli)
            .option('webpack-help', {
            boolean: true,
            description: 'Display Webpack\'s help',
            default: false
        }),
        handler: async ({ mode, splitFrontend, webpackHelp, webpackArgs = [] }) => {
            await manager.build(webpackHelp
                ? ['--help']
                : [
                    // Forward the `mode` argument to Webpack too:
                    '--mode', mode,
                    ...toStringArray(webpackArgs)
                ], { mode, splitFrontend });
        }
    })
        .command(rebuildCommand('rebuild', target))
        .command(rebuildCommand('rebuild:browser', 'browser'))
        .command(rebuildCommand('rebuild:electron', 'electron'))
        .command({
        command: 'check:hoisted',
        describe: 'Check that all dependencies are hoisted',
        builder: {
            'suppress': {
                alias: 's',
                describe: 'Suppress exiting with failure code',
                boolean: true,
                default: false
            }
        },
        handler: ({ suppress }) => {
            (0, check_dependencies_1.default)({
                workspaces: ['packages/*'],
                include: ['**'],
                exclude: ['.bin/**', '.cache/**'],
                skipHoisted: false,
                skipUniqueness: true,
                skipSingleTheiaVersion: true,
                onlyTheiaExtensions: false,
                suppress
            });
        }
    })
        .command({
        command: 'check:theia-version',
        describe: 'Check that all dependencies have been resolved to the same Theia version',
        builder: {
            'suppress': {
                alias: 's',
                describe: 'Suppress exiting with failure code',
                boolean: true,
                default: false
            }
        },
        handler: ({ suppress }) => {
            (0, check_dependencies_1.default)({
                workspaces: undefined,
                include: ['@theia/**'],
                exclude: [],
                skipHoisted: true,
                skipUniqueness: false,
                skipSingleTheiaVersion: false,
                onlyTheiaExtensions: false,
                suppress
            });
        }
    })
        .command({
        command: 'check:theia-extensions',
        describe: 'Check uniqueness of Theia extension versions or whether they are hoisted',
        builder: {
            'suppress': {
                alias: 's',
                describe: 'Suppress exiting with failure code',
                boolean: true,
                default: false
            }
        },
        handler: ({ suppress }) => {
            (0, check_dependencies_1.default)({
                workspaces: undefined,
                include: ['**'],
                exclude: [],
                skipHoisted: true,
                skipUniqueness: false,
                skipSingleTheiaVersion: true,
                onlyTheiaExtensions: true,
                suppress
            });
        }
    })
        .command({
        command: 'check:dependencies',
        describe: 'Check uniqueness of dependency versions or whether they are hoisted',
        builder: {
            'workspaces': {
                alias: 'w',
                describe: 'Glob patterns of workspaces to analyze, relative to `cwd`',
                array: true,
                defaultDescription: 'All glob patterns listed in the package.json\'s workspaces',
                demandOption: false
            },
            'include': {
                alias: 'i',
                describe: 'Glob pattern of dependencies\' package names to be included, e.g. -i "@theia/**"',
                array: true,
                default: ['**']
            },
            'exclude': {
                alias: 'e',
                describe: 'Glob pattern of dependencies\' package names to be excluded',
                array: true,
                defaultDescription: 'None',
                default: []
            },
            'skip-hoisted': {
                alias: 'h',
                describe: 'Skip checking whether dependencies are hoisted',
                boolean: true,
                default: false
            },
            'skip-uniqueness': {
                alias: 'u',
                describe: 'Skip checking whether all dependencies are resolved to a unique version',
                boolean: true,
                default: false
            },
            'skip-single-theia-version': {
                alias: 't',
                describe: 'Skip checking whether all @theia/* dependencies are resolved to a single version',
                boolean: true,
                default: false
            },
            'only-theia-extensions': {
                alias: 'o',
                describe: 'Only check dependencies which are Theia extensions',
                boolean: true,
                default: false
            },
            'suppress': {
                alias: 's',
                describe: 'Suppress exiting with failure code',
                boolean: true,
                default: false
            }
        },
        handler: ({ workspaces, include, exclude, skipHoisted, skipUniqueness, skipSingleTheiaVersion, onlyTheiaExtensions, suppress }) => {
            (0, check_dependencies_1.default)({
                workspaces,
                include,
                exclude,
                skipHoisted,
                skipUniqueness,
                skipSingleTheiaVersion,
                onlyTheiaExtensions,
                suppress
            });
        }
    })
        .command({
        command: 'download:plugins',
        describe: 'Download defined external plugins',
        builder: {
            'packed': {
                alias: 'p',
                describe: 'Controls whether to pack or unpack plugins',
                boolean: true,
                default: false,
            },
            'ignore-errors': {
                alias: 'i',
                describe: 'Ignore errors while downloading plugins',
                boolean: true,
                default: false,
            },
            'api-version': {
                alias: 'v',
                describe: 'Supported API version for plugins',
                default: application_package_1.DEFAULT_SUPPORTED_API_VERSION
            },
            'api-url': {
                alias: 'u',
                describe: 'Open-VSX Registry API URL',
                default: 'https://open-vsx.org/api'
            },
            'parallel': {
                describe: 'Download in parallel',
                boolean: true,
                default: true
            },
            'rate-limit': {
                describe: 'Amount of maximum open-vsx requests per second',
                number: true,
                default: 15
            },
            'proxy-url': {
                describe: 'Proxy URL'
            },
            'proxy-authorization': {
                describe: 'Proxy authorization information'
            },
            'strict-ssl': {
                describe: 'Whether to enable strict SSL mode',
                boolean: true,
                default: false
            },
            'ovsx-router-config': {
                describe: 'JSON configuration file for the OVSX router client',
                type: 'string'
            }
        },
        handler: async ({ apiUrl, proxyUrl, proxyAuthorization, strictSsl, ovsxRouterConfig, ...options }) => {
            const requestService = new node_request_service_1.NodeRequestService();
            await requestService.configure({
                proxyUrl,
                proxyAuthorization,
                strictSSL: strictSsl
            });
            let client;
            if (ovsxRouterConfig) {
                const routerConfig = await fs.promises.readFile(ovsxRouterConfig, 'utf8').then(JSON.parse, error => {
                    console.error(error);
                });
                if (routerConfig) {
                    client = await ovsx_client_1.OVSXRouterClient.FromConfig(routerConfig, ovsx_client_1.OVSXHttpClient.createClientFactory(requestService), [ovsx_client_1.RequestContainsFilterFactory, ovsx_client_1.ExtensionIdMatchesFilterFactory]);
                }
            }
            if (!client) {
                client = new ovsx_client_1.OVSXHttpClient(apiUrl, requestService);
            }
            await (0, download_plugins_1.default)(client, requestService, options);
        },
    })
        .command({
        command: 'nls-localize [languages...]',
        describe: 'Localize json files using the DeepL API',
        builder: {
            'file': {
                alias: 'f',
                describe: 'The source file which should be translated',
                demandOption: true
            },
            'deepl-key': {
                alias: 'k',
                describe: 'DeepL key used for API access. See https://www.deepl.com/docs-api for more information',
                demandOption: true
            },
            'free-api': {
                describe: 'Indicates whether the specified DeepL API key belongs to the free API',
                boolean: true,
                default: false,
            },
            'source-language': {
                alias: 's',
                describe: 'The source language of the translation file'
            }
        },
        handler: async ({ freeApi, deeplKey, file, sourceLanguage, languages = [] }) => {
            await localizationManager.localize({
                sourceFile: file,
                freeApi: freeApi !== null && freeApi !== void 0 ? freeApi : true,
                authKey: deeplKey,
                targetLanguages: languages,
                sourceLanguage
            });
        }
    })
        .command({
        command: 'nls-extract',
        describe: 'Extract translation key/value pairs from source code',
        builder: {
            'output': {
                alias: 'o',
                describe: 'Output file for the extracted translations',
                demandOption: true
            },
            'root': {
                alias: 'r',
                describe: 'The directory which contains the source code',
                default: '.'
            },
            'merge': {
                alias: 'm',
                describe: 'Whether to merge new with existing translation values',
                boolean: true,
                default: false
            },
            'exclude': {
                alias: 'e',
                describe: 'Allows to exclude translation keys starting with this value'
            },
            'files': {
                alias: 'f',
                describe: 'Glob pattern matching the files to extract from (starting from --root).',
                array: true
            },
            'logs': {
                alias: 'l',
                describe: 'File path to a log file'
            },
            'quiet': {
                alias: 'q',
                describe: 'Prevents errors from being logged to console',
                boolean: true,
                default: false
            }
        },
        handler: async (options) => {
            await (0, localization_manager_1.extract)(options);
        }
    })
        .command({
        command: 'test [theia-args...]',
        builder: {
            'test-inspect': {
                describe: 'Whether to auto-open a DevTools panel for test page.',
                boolean: true,
                default: false
            },
            'test-extension': {
                describe: 'Test file extension(s) to load',
                array: true,
                default: ['js']
            },
            'test-file': {
                describe: 'Specify test file(s) to be loaded prior to root suite execution',
                array: true,
                default: []
            },
            'test-ignore': {
                describe: 'Ignore test file(s) or glob pattern(s)',
                array: true,
                default: []
            },
            'test-recursive': {
                describe: 'Look for tests in subdirectories',
                boolean: true,
                default: false
            },
            'test-sort': {
                describe: 'Sort test files',
                boolean: true,
                default: false
            },
            'test-spec': {
                describe: 'One or more test files, directories, or globs to test',
                array: true,
                default: ['test']
            },
            'test-coverage': {
                describe: 'Report test coverage consumable by istanbul',
                boolean: true,
                default: false
            }
        },
        handler: async ({ testInspect, testExtension, testFile, testIgnore, testRecursive, testSort, testSpec, testCoverage, theiaArgs }) => {
            if (!process.env.THEIA_CONFIG_DIR) {
                process.env.THEIA_CONFIG_DIR = temp.track().mkdirSync('theia-test-config-dir');
            }
            await (0, run_test_1.default)({
                start: () => new Promise((resolve, reject) => {
                    const serverProcess = manager.start(toStringArray(theiaArgs));
                    serverProcess.on('message', resolve);
                    serverProcess.on('error', reject);
                    serverProcess.on('close', (code, signal) => reject(`Server process exited unexpectedly: ${code !== null && code !== void 0 ? code : signal}`));
                }),
                launch: {
                    args: ['--no-sandbox'],
                    // eslint-disable-next-line no-null/no-null
                    defaultViewport: null,
                    devtools: testInspect,
                    executablePath: executablePath()
                },
                files: {
                    extension: testExtension,
                    file: testFile,
                    ignore: testIgnore,
                    recursive: testRecursive,
                    sort: testSort,
                    spec: testSpec
                },
                coverage: testCoverage
            });
        }
    })
        .command({
        command: 'ffmpeg:replace [ffmpeg-path]',
        describe: '',
        builder: {
            'electronDist': {
                description: 'Electron distribution location.',
            },
            'electronVersion': {
                description: 'Electron version for which to pull the "clean" ffmpeg library.',
            },
            'ffmpegPath': {
                description: 'Absolute path to the ffmpeg shared library.',
            },
            'platform': {
                description: 'Dictates where the library is located within the Electron distribution.',
                choices: ['darwin', 'linux', 'win32'],
            },
        },
        handler: async (options) => {
            const ffmpeg = await Promise.resolve().then(() => require('@theia/ffmpeg'));
            await ffmpeg.replaceFfmpeg(options);
        },
    })
        .command({
        command: 'ffmpeg:check [ffmpeg-path]',
        describe: '(electron-only) Check that ffmpeg doesn\'t contain proprietary codecs',
        builder: {
            'electronDist': {
                description: 'Electron distribution location',
            },
            'ffmpegPath': {
                describe: 'Absolute path to the ffmpeg shared library',
            },
            'json': {
                description: 'Output the found codecs as JSON on stdout',
                boolean: true,
            },
            'platform': {
                description: 'Dictates where the library is located within the Electron distribution',
                choices: ['darwin', 'linux', 'win32'],
            },
        },
        handler: async (options) => {
            const ffmpeg = await Promise.resolve().then(() => require('@theia/ffmpeg'));
            await ffmpeg.checkFfmpeg(options);
        },
    })
        .parserConfiguration({
        'unknown-options-as-args': true,
    })
        .strictCommands()
        .demandCommand(1, 'Please run a command')
        .fail((msg, err, cli) => {
        process.exitCode = 1;
        if (err) {
            // One of the handlers threw an error:
            console.error(err);
        }
        else {
            // Yargs detected a problem with commands and/or arguments while parsing:
            cli.showHelp();
            console.error(msg);
        }
    })
        .parse();
}
//# sourceMappingURL=theia.js.map