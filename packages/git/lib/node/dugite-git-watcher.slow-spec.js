"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
const fs = require("@theia/core/shared/fs-extra");
const temp = require("temp");
const path = require("path");
const chai_1 = require("chai");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const dugite_git_1 = require("./dugite-git");
const binding_helper_1 = require("./test/binding-helper");
const dugite_git_watcher_1 = require("./dugite-git-watcher");
const git_backend_module_1 = require("./git-backend-module");
const track = temp.track();
describe('git-watcher-slow', () => {
    let git;
    let repository;
    let watcher;
    beforeEach(async function () {
        this.timeout(40000);
        const root = track.mkdirSync('git-watcher-slow');
        const localUri = file_uri_1.FileUri.create(root).toString();
        const { container, bind } = (0, binding_helper_1.initializeBindings)();
        (0, git_backend_module_1.bindGit)(bind);
        (0, git_backend_module_1.bindRepositoryWatcher)(bind);
        git = container.get(dugite_git_1.DugiteGit);
        watcher = container.get(dugite_git_watcher_1.DugiteGitWatcherServer);
        repository = { localUri };
        await git.clone('https://github.com/TypeFox/find-git-exec.git', { localUri });
    });
    after(function () {
        this.timeout(40000);
        track.cleanupSync();
    });
    it('watching the same repository multiple times should not duplicate the events', async function () {
        this.timeout(40000);
        let ignoredEvents = 1;
        const events = [];
        const watchers = [];
        const client = {
            async onGitChanged(event) {
                // Ignore that event which is fired when one subscribes to the repository changes via #watchGitChanges(repository).
                if (ignoredEvents > 0) {
                    (0, chai_1.expect)(event.status.changes).to.be.empty;
                    ignoredEvents--;
                    if (ignoredEvents === 0) {
                        // Once we consumed all the events we wanted to ignore, make the FS change.
                        await fs.createFile(path.join(file_uri_1.FileUri.fsPath(repository.localUri), 'A.txt'));
                        await sleep(6000);
                    }
                }
                else {
                    events.push(event);
                }
            }
        };
        watcher.setClient(client);
        watchers.push(await watcher.watchGitChanges(repository));
        watchers.push(await watcher.watchGitChanges(repository));
        await sleep(6000);
        watchers.forEach(async (watcherId) => watcher.unwatchGitChanges(watcherId));
        (0, chai_1.expect)(events.length).to.be.equal(1, JSON.stringify(events));
        (0, chai_1.expect)(events[0].status.changes.length).to.be.equal(1, JSON.stringify(events));
        (0, chai_1.expect)(events[0].status.changes[0].uri.toString().endsWith('A.txt')).to.be.true;
        events.length = 0;
        // Revert the change we've made, and check for the notifications. Zero should be received.
        await fs.unlink(path.join(file_uri_1.FileUri.fsPath(repository.localUri), 'A.txt'));
        await sleep(6000);
        (0, chai_1.expect)(events).to.be.empty;
    });
});
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
//# sourceMappingURL=dugite-git-watcher.slow-spec.js.map