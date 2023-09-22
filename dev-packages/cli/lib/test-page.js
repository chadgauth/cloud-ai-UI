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
const collectFiles = require('mocha/lib/cli/collect-files');
async function newTestPage(options) {
    const { newPage, matchAppUrl, onWillRun, onDidRun } = options;
    const fileOptions = {
        ignore: options.files && options.files.ignore || [],
        extension: options.files && options.files.extension || [],
        file: options.files && options.files.file || [],
        spec: options.files && options.files.spec || [],
        recursive: options.files && options.files.recursive || false,
        sort: options.files && options.files.sort || false
    };
    // quick check whether test files exist
    const files = collectFiles(fileOptions);
    const page = await newPage();
    page.on('dialog', dialog => dialog.dismiss());
    page.on('pageerror', console.error);
    let theiaLoaded = false;
    page.exposeFunction('fireDidUnloadTheia', () => theiaLoaded = false);
    const preLoad = (frame) => {
        const frameUrl = frame.url();
        if (matchAppUrl && !matchAppUrl(frameUrl)) {
            return;
        }
        if (theiaLoaded) {
            return;
        }
        console.log('loading chai...');
        theiaLoaded = true;
        page.addScriptTag({ path: require.resolve('chai/chai.js') });
        page.evaluate(() => window.addEventListener('beforeunload', () => window['fireDidUnloadTheia']()));
    };
    page.on('frameattached', preLoad);
    page.on('framenavigated', preLoad);
    page.on('load', async () => {
        if (matchAppUrl && !matchAppUrl(page.url())) {
            return;
        }
        console.log('loading mocha...');
        // replace console.log by theia logger for mocha
        await page.waitForFunction(() => { var _a, _b; return !!((_b = (_a = window['theia']) === null || _a === void 0 ? void 0 : _a['@theia/core/lib/common/logger']) === null || _b === void 0 ? void 0 : _b.logger); }, {
            timeout: 30 * 1000
        });
        await page.addScriptTag({ path: require.resolve('mocha/mocha.js') });
        await page.waitForFunction(() => !!window['chai'] && !!window['mocha'] && !!window['theia'].container, { timeout: 30 * 1000 });
        console.log('loading Theia...');
        await page.evaluate(() => {
            const { FrontendApplicationStateService } = window['theia']['@theia/core/lib/browser/frontend-application-state'];
            const { PreferenceService } = window['theia']['@theia/core/lib/browser/preferences/preference-service'];
            const { WorkspaceService } = window['theia']['@theia/workspace/lib/browser/workspace-service'];
            const container = window['theia'].container;
            const frontendApplicationState = container.get(FrontendApplicationStateService);
            const preferenceService = container.get(PreferenceService);
            const workspaceService = container.get(WorkspaceService);
            return Promise.all([
                frontendApplicationState.reachedState('ready'),
                preferenceService.ready,
                workspaceService.roots
            ]);
        });
        console.log('loading test files...');
        await page.evaluate(() => {
            // replace require to load modules from theia namespace
            window['require'] = (moduleName) => window['theia'][moduleName];
            mocha.setup({
                reporter: 'spec',
                ui: 'bdd',
                color: true,
                retries: 0
            });
        });
        if (onWillRun) {
            await onWillRun();
        }
        for (const file of files) {
            await page.addScriptTag({ path: file });
        }
        console.log('running test files...');
        const failures = await page.evaluate(() => new Promise(resolve => mocha.run(resolve)));
        if (onDidRun) {
            await onDidRun(failures);
        }
    });
    return page;
}
exports.default = newTestPage;
//# sourceMappingURL=test-page.js.map