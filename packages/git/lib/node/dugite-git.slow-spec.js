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
const temp = require("temp");
const chai_1 = require("chai");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const common_1 = require("../common");
const binding_helper_1 = require("./test/binding-helper");
const track = temp.track();
describe('git-slow', async function () {
    after(async () => {
        track.cleanupSync();
    });
    describe('diff-slow', async () => {
        it('diff with rename/move', async function () {
            this.timeout(50000);
            const root = track.mkdirSync('diff-slow-rename');
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            const git = await (0, binding_helper_1.createGit)();
            await git.clone('https://github.com/kittaakos/eclipse.jdt.ls.git', { localUri });
            await git.checkout(repository, { branch: 'Java9' });
            await git.checkout(repository, { branch: 'docker' });
            const result = await git.diff(repository, { range: { fromRevision: 'docker', toRevision: 'Java9' } });
            const renamedItem = result.find(change => change.uri.toString().endsWith('org.eclipse.jdt.ls.core/.classpath'));
            (0, chai_1.expect)(renamedItem).to.be.not.undefined;
            (0, chai_1.expect)(renamedItem.oldUri).to.be.not.undefined;
            (0, chai_1.expect)(renamedItem.oldUri.toString().endsWith('org.jboss.tools.vscode.java/.classpath')).to.be.true;
            (0, chai_1.expect)(renamedItem.status).to.be.equal(common_1.GitFileStatus.Renamed);
        });
    });
});
//# sourceMappingURL=dugite-git.slow-spec.js.map