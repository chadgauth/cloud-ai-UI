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
const temp = require("temp");
const chai = require("chai");
const cp = require("child_process");
const fs = require("@theia/core/shared/fs-extra");
const assert = require("assert");
const node_1 = require("@theia/core/lib/node");
const nsfw_filesystem_service_1 = require("./nsfw-filesystem-service");
const expect = chai.expect;
const track = temp.track();
describe('nsfw-filesystem-watcher', function () {
    let root;
    let watcherService;
    let watcherId;
    this.timeout(10000);
    beforeEach(async () => {
        let tempPath = temp.mkdirSync('node-fs-root');
        // Sometimes tempPath will use some Windows 8.3 short name in its path. This is a problem
        // since NSFW always returns paths with long names. We need to convert here.
        // See: https://stackoverflow.com/a/34473971/7983255
        if (process.platform === 'win32') {
            tempPath = cp.execSync(`powershell "(Get-Item -LiteralPath '${tempPath}').FullName"`, {
                encoding: 'utf8',
            }).trim();
        }
        root = node_1.FileUri.create(fs.realpathSync(tempPath));
        watcherService = createNsfwFileSystemWatcherService();
        watcherId = await watcherService.watchFileChanges(0, root.toString());
        await sleep(2000);
    });
    afterEach(async () => {
        track.cleanupSync();
        watcherService.dispose();
    });
    it('Should receive file changes events from in the workspace by default.', async function () {
        const actualUris = new Set();
        const watcherClient = {
            onDidFilesChanged(event) {
                event.changes.forEach(c => actualUris.add(c.uri.toString()));
            },
            onError() {
            }
        };
        watcherService.setClient(watcherClient);
        const expectedUris = [
            root.resolve('foo').toString(),
            root.withPath(root.path.join('foo', 'bar')).toString(),
            root.withPath(root.path.join('foo', 'bar', 'baz.txt')).toString()
        ];
        fs.mkdirSync(node_1.FileUri.fsPath(root.resolve('foo')));
        expect(fs.statSync(node_1.FileUri.fsPath(root.resolve('foo'))).isDirectory()).to.be.true;
        await sleep(2000);
        fs.mkdirSync(node_1.FileUri.fsPath(root.resolve('foo').resolve('bar')));
        expect(fs.statSync(node_1.FileUri.fsPath(root.resolve('foo').resolve('bar'))).isDirectory()).to.be.true;
        await sleep(2000);
        fs.writeFileSync(node_1.FileUri.fsPath(root.resolve('foo').resolve('bar').resolve('baz.txt')), 'baz');
        expect(fs.readFileSync(node_1.FileUri.fsPath(root.resolve('foo').resolve('bar').resolve('baz.txt')), 'utf8')).to.be.equal('baz');
        await sleep(2000);
        assert.deepStrictEqual([...actualUris], expectedUris);
    });
    it('Should not receive file changes events from in the workspace by default if unwatched', async function () {
        const actualUris = new Set();
        const watcherClient = {
            onDidFilesChanged(event) {
                event.changes.forEach(c => actualUris.add(c.uri.toString()));
            },
            onError() {
            }
        };
        watcherService.setClient(watcherClient);
        /* Unwatch root */
        await watcherService.unwatchFileChanges(watcherId);
        fs.mkdirSync(node_1.FileUri.fsPath(root.resolve('foo')));
        expect(fs.statSync(node_1.FileUri.fsPath(root.resolve('foo'))).isDirectory()).to.be.true;
        await sleep(2000);
        fs.mkdirSync(node_1.FileUri.fsPath(root.resolve('foo').resolve('bar')));
        expect(fs.statSync(node_1.FileUri.fsPath(root.resolve('foo').resolve('bar'))).isDirectory()).to.be.true;
        await sleep(2000);
        fs.writeFileSync(node_1.FileUri.fsPath(root.resolve('foo').resolve('bar').resolve('baz.txt')), 'baz');
        expect(fs.readFileSync(node_1.FileUri.fsPath(root.resolve('foo').resolve('bar').resolve('baz.txt')), 'utf8')).to.be.equal('baz');
        await sleep(2000);
        assert.deepStrictEqual(actualUris.size, 0);
    });
    it('Renaming should emit a DELETED change followed by ADDED', async function () {
        const file_txt = root.resolve('file.txt');
        const FILE_txt = root.resolve('FILE.txt');
        const changes = [];
        watcherService.setClient({
            onDidFilesChanged: event => event.changes.forEach(change => changes.push(change)),
            onError: console.error
        });
        await fs.promises.writeFile(node_1.FileUri.fsPath(file_txt), 'random content\n');
        await sleep(1000);
        await fs.promises.rename(node_1.FileUri.fsPath(file_txt), node_1.FileUri.fsPath(FILE_txt));
        await sleep(1000);
        try {
            expect(changes).deep.eq([
                // initial file creation change event:
                { type: 1 /* ADDED */, uri: file_txt.toString() },
                // rename change events:
                { type: 2 /* DELETED */, uri: file_txt.toString() },
                { type: 1 /* ADDED */, uri: FILE_txt.toString() }
            ]);
        }
        catch (error) {
            // TODO: remove this try/catch once the bug on macOS is fixed.
            // See https://github.com/Axosoft/nsfw/issues/146
            if (process.platform !== 'darwin') {
                throw error;
            }
            // On macOS we only get ADDED events for some reason
            expect(changes).deep.eq([
                // initial file creation change event:
                { type: 1 /* ADDED */, uri: file_txt.toString() },
                // rename change events:
                { type: 1 /* ADDED */, uri: file_txt.toString() },
                { type: 1 /* ADDED */, uri: FILE_txt.toString() }
            ]);
            // Mark the test case as skipped so it stands out that the bogus branch got tested
            this.skip();
        }
    });
    function createNsfwFileSystemWatcherService() {
        return new nsfw_filesystem_service_1.NsfwFileSystemWatcherService({
            verbose: true
        });
    }
    function sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection: ' + reason);
});
//# sourceMappingURL=nsfw-filesystem-watcher.spec.js.map