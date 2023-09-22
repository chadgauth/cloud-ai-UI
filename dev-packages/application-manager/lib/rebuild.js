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
exports.rebuild = exports.DEFAULT_MODULES = void 0;
const cp = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const EXIT_SIGNALS = ['SIGINT', 'SIGTERM'];
exports.DEFAULT_MODULES = [
    'node-pty',
    'nsfw',
    'native-keymap',
    'find-git-repositories',
    'drivelist',
    'keytar',
    'ssh2',
    'cpu-features'
];
/**
 * @param target What to rebuild for.
 * @param options
 */
function rebuild(target, options = {}) {
    const { modules = exports.DEFAULT_MODULES, cacheRoot = process.cwd(), forceAbi, } = options;
    const cache = path.resolve(cacheRoot, '.browser_modules');
    const cacheExists = folderExists(cache);
    guardExit(async (token) => {
        if (target === 'electron' && !cacheExists) {
            process.exitCode = await rebuildElectronModules(cache, modules, forceAbi, token);
        }
        else if (target === 'browser' && cacheExists) {
            process.exitCode = await revertBrowserModules(cache, modules);
        }
        else {
            console.log(`native node modules are already rebuilt for ${target}`);
        }
    }).catch(errorOrSignal => {
        if (typeof errorOrSignal === 'string' && errorOrSignal in os.constants.signals) {
            process.kill(process.pid, errorOrSignal);
        }
        else {
            throw errorOrSignal;
        }
    });
}
exports.rebuild = rebuild;
function folderExists(folder) {
    if (fs.existsSync(folder)) {
        if (fs.statSync(folder).isDirectory()) {
            return true;
        }
        else {
            throw new Error(`"${folder}" exists but it is not a directory`);
        }
    }
    return false;
}
async function rebuildElectronModules(browserModuleCache, modules, forceAbi, token) {
    const modulesJsonPath = path.join(browserModuleCache, 'modules.json');
    const modulesJson = await fs.access(modulesJsonPath).then(() => fs.readJson(modulesJsonPath), () => ({}));
    let success = true;
    // Backup already built browser modules.
    await Promise.all(modules.map(async (module) => {
        let modulePath;
        try {
            modulePath = require.resolve(`${module}/package.json`, {
                paths: [process.cwd()],
            });
        }
        catch (_) {
            console.debug(`Module not found: ${module}`);
            return; // Skip current module.
        }
        const src = path.dirname(modulePath);
        const dest = path.join(browserModuleCache, module);
        try {
            await fs.remove(dest);
            await fs.copy(src, dest, { overwrite: true });
            modulesJson[module] = {
                originalLocation: src,
            };
            console.debug(`Processed "${module}"`);
        }
        catch (error) {
            console.error(`Error while doing a backup for "${module}": ${error}`);
            success = false;
        }
    }));
    if (Object.keys(modulesJson).length === 0) {
        console.debug('No module to rebuild.');
        return 0;
    }
    // Update manifest tracking the backups' original locations.
    await fs.writeJson(modulesJsonPath, modulesJson, { spaces: 2 });
    // If we failed to process a module then exit now.
    if (!success) {
        return 1;
    }
    const todo = modules.map(m => {
        // electron-rebuild ignores the module namespace...
        const slash = m.indexOf('/');
        return m.startsWith('@') && slash !== -1
            ? m.substring(slash + 1)
            : m;
    });
    let exitCode;
    try {
        if (process.env.THEIA_REBUILD_NO_WORKAROUND) {
            exitCode = await runElectronRebuild(todo, forceAbi, token);
        }
        else {
            exitCode = await electronRebuildExtraModulesWorkaround(process.cwd(), todo, () => runElectronRebuild(todo, forceAbi, token), token);
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        // If code is undefined or different from zero we need to revert back to the browser modules.
        if (exitCode !== 0) {
            await revertBrowserModules(browserModuleCache, modules);
        }
        return exitCode !== null && exitCode !== void 0 ? exitCode : 1;
    }
}
async function revertBrowserModules(browserModuleCache, modules) {
    let exitCode = 0;
    const modulesJsonPath = path.join(browserModuleCache, 'modules.json');
    const modulesJson = await fs.readJson(modulesJsonPath);
    await Promise.all(Object.entries(modulesJson).map(async ([moduleName, entry]) => {
        if (!modules.includes(moduleName)) {
            return; // Skip modules that weren't requested.
        }
        const src = path.join(browserModuleCache, moduleName);
        if (!await fs.pathExists(src)) {
            delete modulesJson[moduleName];
            console.error(`Missing backup for ${moduleName}!`);
            exitCode = 1;
            return;
        }
        const dest = entry.originalLocation;
        try {
            await fs.remove(dest);
            await fs.copy(src, dest, { overwrite: false });
            await fs.remove(src);
            delete modulesJson[moduleName];
            console.debug(`Reverted "${moduleName}"`);
        }
        catch (error) {
            console.error(`Error while reverting "${moduleName}": ${error}`);
            exitCode = 1;
        }
    }));
    if (Object.keys(modulesJson).length === 0) {
        // We restored everything, so we can delete the cache.
        await fs.remove(browserModuleCache);
    }
    else {
        // Some things were not restored, so we update the manifest.
        await fs.writeJson(modulesJsonPath, modulesJson, { spaces: 2 });
    }
    return exitCode;
}
async function runElectronRebuild(modules, forceAbi, token) {
    const todo = modules.join(',');
    return new Promise(async (resolve, reject) => {
        let command = `npx --no-install electron-rebuild -f -w=${todo} -o=${todo}`;
        if (forceAbi) {
            command += ` --force-abi ${forceAbi}`;
        }
        const electronRebuild = cp.spawn(command, {
            stdio: 'inherit',
            shell: true,
        });
        token.onSignal(signal => electronRebuild.kill(signal));
        electronRebuild.on('error', reject);
        electronRebuild.on('close', (code, signal) => {
            if (signal) {
                reject(new Error(`electron-rebuild exited with "${signal}"`));
            }
            else {
                resolve(code);
            }
        });
    });
}
/**
 * `electron-rebuild` is supposed to accept a list of modules to build, even when not part of the dependencies.
 * But there is a bug that causes `electron-rebuild` to not correctly process this list of modules.
 *
 * This workaround will temporarily modify the current package.json file.
 *
 * PR with fix: https://github.com/electron/electron-rebuild/pull/888
 *
 * TODO: Remove this workaround.
 */
async function electronRebuildExtraModulesWorkaround(cwd, extraModules, run, token) {
    const packageJsonPath = path.resolve(cwd, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
        // package.json exists: We back it up before modifying it then revert it.
        const packageJsonCopyPath = `${packageJsonPath}.copy`;
        const packageJson = await fs.readJson(packageJsonPath);
        await fs.copy(packageJsonPath, packageJsonCopyPath);
        await throwIfSignal(token, async () => {
            await fs.unlink(packageJsonCopyPath);
        });
        if (typeof packageJson.dependencies !== 'object') {
            packageJson.dependencies = {};
        }
        for (const extraModule of extraModules) {
            if (!packageJson.dependencies[extraModule]) {
                packageJson.dependencies[extraModule] = '*';
            }
        }
        try {
            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            await throwIfSignal(token);
            return await run(token);
        }
        finally {
            await fs.move(packageJsonCopyPath, packageJsonPath, { overwrite: true });
        }
    }
    else {
        // package.json does not exist: We create one then remove it.
        const packageJson = {
            name: 'theia-rebuild-workaround',
            version: '0.0.0',
            dependencies: {},
        };
        for (const extraModule of extraModules) {
            packageJson.dependencies[extraModule] = '*';
        }
        try {
            await fs.writeJson(packageJsonPath, packageJson);
            await throwIfSignal(token);
            return await run(token);
        }
        finally {
            await fs.unlink(packageJsonPath);
        }
    }
}
/**
 * Temporarily install hooks to **try** to prevent the process from exiting while `run` is running.
 *
 * Note that it is still possible to kill the process and prevent cleanup logic (e.g. SIGKILL, computer forced shutdown, etc).
 */
async function guardExit(run) {
    const token = new ExitTokenImpl();
    const signalListener = (signal) => token._emitSignal(signal);
    for (const signal of EXIT_SIGNALS) {
        process.on(signal, signalListener);
    }
    try {
        return await run(token);
    }
    finally {
        for (const signal of EXIT_SIGNALS) {
            process.off(signal, signalListener);
        }
    }
}
class ExitTokenImpl {
    constructor() {
        this._listeners = new Set();
    }
    onSignal(callback) {
        this._listeners.add(callback);
    }
    getLastSignal() {
        return this._lastSignal;
    }
    _emitSignal(signal) {
        this._lastSignal = signal;
        for (const listener of this._listeners) {
            listener(signal);
        }
    }
}
/**
 * Throw `signal` if one was received, runs `cleanup` before doing so.
 */
async function throwIfSignal(token, cleanup) {
    if (token.getLastSignal()) {
        try {
            await (cleanup === null || cleanup === void 0 ? void 0 : cleanup());
        }
        finally {
            // eslint-disable-next-line no-throw-literal
            throw token.getLastSignal();
        }
    }
}
//# sourceMappingURL=rebuild.js.map