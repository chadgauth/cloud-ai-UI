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
const upath = require("upath");
const path = require("path");
const temp = require("temp");
const fs = require("@theia/core/shared/fs-extra");
const chai_1 = require("chai");
const git_1 = require("dugite-extra/lib/core/git");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const common_1 = require("../common");
const test_helper_1 = require("dugite-extra/lib/command/test-helper");
const binding_helper_1 = require("./test/binding-helper");
const os_1 = require("@theia/core/lib/common/os");
/* eslint-disable max-len */
const track = temp.track();
describe('git', async function () {
    this.timeout(10000);
    after(async () => {
        track.cleanupSync();
    });
    describe('repositories', async () => {
        it('should discover only first repository', async () => {
            const root = track.mkdirSync('discovery-test-1');
            fs.mkdirSync(path.join(root, 'A'));
            fs.mkdirSync(path.join(root, 'B'));
            fs.mkdirSync(path.join(root, 'C'));
            const git = await (0, binding_helper_1.createGit)();
            await (0, test_helper_1.initRepository)(path.join(root, 'A'));
            await (0, test_helper_1.initRepository)(path.join(root, 'B'));
            await (0, test_helper_1.initRepository)(path.join(root, 'C'));
            const workspaceRootUri = file_uri_1.FileUri.create(root).toString();
            const repositories = await git.repositories(workspaceRootUri, { maxCount: 1 });
            (0, chai_1.expect)(repositories.length).to.deep.equal(1);
        });
        it('should discover all nested repositories', async () => {
            const root = track.mkdirSync('discovery-test-2');
            fs.mkdirSync(path.join(root, 'A'));
            fs.mkdirSync(path.join(root, 'B'));
            fs.mkdirSync(path.join(root, 'C'));
            const git = await (0, binding_helper_1.createGit)();
            await (0, test_helper_1.initRepository)(path.join(root, 'A'));
            await (0, test_helper_1.initRepository)(path.join(root, 'B'));
            await (0, test_helper_1.initRepository)(path.join(root, 'C'));
            const workspaceRootUri = file_uri_1.FileUri.create(root).toString();
            const repositories = await git.repositories(workspaceRootUri, {});
            (0, chai_1.expect)(repositories.map(r => path.basename(file_uri_1.FileUri.fsPath(r.localUri))).sort()).to.deep.equal(['A', 'B', 'C']);
        });
        it('should discover all nested repositories and the root repository which is at the workspace root', async function () {
            if (os_1.isWindows) {
                // https://github.com/eclipse-theia/theia/issues/933
                this.skip();
                return;
            }
            const root = track.mkdirSync('discovery-test-3');
            fs.mkdirSync(path.join(root, 'BASE'));
            fs.mkdirSync(path.join(root, 'BASE', 'A'));
            fs.mkdirSync(path.join(root, 'BASE', 'B'));
            fs.mkdirSync(path.join(root, 'BASE', 'C'));
            const git = await (0, binding_helper_1.createGit)();
            await (0, test_helper_1.initRepository)(path.join(root, 'BASE'));
            await (0, test_helper_1.initRepository)(path.join(root, 'BASE', 'A'));
            await (0, test_helper_1.initRepository)(path.join(root, 'BASE', 'B'));
            await (0, test_helper_1.initRepository)(path.join(root, 'BASE', 'C'));
            const workspaceRootUri = file_uri_1.FileUri.create(path.join(root, 'BASE')).toString();
            const repositories = await git.repositories(workspaceRootUri, {});
            (0, chai_1.expect)(repositories.map(r => path.basename(file_uri_1.FileUri.fsPath(r.localUri))).sort()).to.deep.equal(['A', 'B', 'BASE', 'C']);
        });
        it('should discover all nested repositories and the container repository', async () => {
            const root = track.mkdirSync('discovery-test-4');
            fs.mkdirSync(path.join(root, 'BASE'));
            fs.mkdirSync(path.join(root, 'BASE', 'WS_ROOT'));
            fs.mkdirSync(path.join(root, 'BASE', 'WS_ROOT', 'A'));
            fs.mkdirSync(path.join(root, 'BASE', 'WS_ROOT', 'B'));
            fs.mkdirSync(path.join(root, 'BASE', 'WS_ROOT', 'C'));
            const git = await (0, binding_helper_1.createGit)();
            await (0, test_helper_1.initRepository)(path.join(root, 'BASE'));
            await (0, test_helper_1.initRepository)(path.join(root, 'BASE', 'WS_ROOT', 'A'));
            await (0, test_helper_1.initRepository)(path.join(root, 'BASE', 'WS_ROOT', 'B'));
            await (0, test_helper_1.initRepository)(path.join(root, 'BASE', 'WS_ROOT', 'C'));
            const workspaceRootUri = file_uri_1.FileUri.create(path.join(root, 'BASE', 'WS_ROOT')).toString();
            const repositories = await git.repositories(workspaceRootUri, {});
            const repositoryNames = repositories.map(r => path.basename(file_uri_1.FileUri.fsPath(r.localUri)));
            (0, chai_1.expect)(repositoryNames.shift()).to.equal('BASE'); // The first must be the container repository.
            (0, chai_1.expect)(repositoryNames.sort()).to.deep.equal(['A', 'B', 'C']);
        });
    });
    describe('status', async () => {
        it('modifying a staged file should result in two changes', async () => {
            // Init repository.
            const root = await (0, test_helper_1.createTestRepository)(track.mkdirSync('status-test'));
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            const git = await (0, binding_helper_1.createGit)();
            // // Check status. Expect empty.
            let status = await git.status(repository);
            (0, chai_1.expect)(status.changes).to.be.empty;
            // Modify a file.
            const filePath = path.join(root, 'A.txt');
            const fileUri = file_uri_1.FileUri.create(filePath).toString();
            fs.writeFileSync(filePath, 'new content');
            (0, chai_1.expect)(fs.readFileSync(filePath, { encoding: 'utf8' })).to.be.equal('new content');
            await git.add(repository, fileUri);
            // Check the status again. Expect one single change.
            status = await git.status(repository);
            (0, chai_1.expect)(status.changes).to.be.have.lengthOf(1);
            (0, chai_1.expect)(status.changes[0].uri).to.be.equal(fileUri);
            (0, chai_1.expect)(status.changes[0].staged).to.be.true;
            // Change the same file again.
            fs.writeFileSync(filePath, 'yet another new content');
            (0, chai_1.expect)(fs.readFileSync(filePath, { encoding: 'utf8' })).to.be.equal('yet another new content');
            // We expect two changes; one is staged, the other is in the working directory.
            status = await git.status(repository);
            (0, chai_1.expect)(status.changes).to.be.have.lengthOf(2);
            (0, chai_1.expect)(status.changes.map(f => f.uri)).to.be.deep.equal([fileUri, fileUri]);
            (0, chai_1.expect)(status.changes.map(f => f.staged).sort()).to.be.deep.equal([false, true]);
        });
    });
    describe('WorkingDirectoryStatus#equals', async () => {
        it('staged change should matter', async () => {
            const left = JSON.parse(`
            {
                "exists":true,
                "branch":"GH-165",
                "upstreamBranch":"origin/GH-165",
                "aheadBehind":{
                   "ahead":0,
                   "behind":0
                },
                "changes":[
                   {
                      "uri":"bar.foo",
                      "status":0,
                      "staged":false
                   }
                ],
                "currentHead":"a274d43dbfba5d1ff9d52db42dc90c6f03071656"
             }
            `);
            const right = JSON.parse(`
            {
                "exists":true,
                "branch":"GH-165",
                "upstreamBranch":"origin/GH-165",
                "aheadBehind":{
                   "ahead":0,
                   "behind":0
                },
                "changes":[
                   {
                      "uri":"bar.foo",
                      "status":0,
                      "staged":true
                   }
                ],
                "currentHead":"a274d43dbfba5d1ff9d52db42dc90c6f03071656"
             }
            `);
            (0, chai_1.expect)(common_1.WorkingDirectoryStatus.equals(left, right)).to.be.false;
        });
    });
    describe('show', async () => {
        let repository;
        let git;
        beforeEach(async () => {
            const root = await (0, test_helper_1.createTestRepository)(track.mkdirSync('status-test'));
            const localUri = file_uri_1.FileUri.create(root).toString();
            repository = { localUri };
            git = await (0, binding_helper_1.createGit)();
        });
        it('modified in working directory', async () => {
            const repositoryPath = file_uri_1.FileUri.fsPath(repository.localUri);
            fs.writeFileSync(path.join(repositoryPath, 'A.txt'), 'new content');
            (0, chai_1.expect)(fs.readFileSync(path.join(repositoryPath, 'A.txt'), { encoding: 'utf8' })).to.be.equal('new content');
            const content = await git.show(repository, file_uri_1.FileUri.create(path.join(repositoryPath, 'A.txt')).toString(), { commitish: 'HEAD' });
            (0, chai_1.expect)(content).to.be.equal('A');
        });
        it('modified in working directory (nested)', async () => {
            const repositoryPath = file_uri_1.FileUri.fsPath(repository.localUri);
            fs.writeFileSync(path.join(repositoryPath, 'folder', 'C.txt'), 'new content');
            (0, chai_1.expect)(fs.readFileSync(path.join(repositoryPath, 'folder', 'C.txt'), { encoding: 'utf8' })).to.be.equal('new content');
            const content = await git.show(repository, file_uri_1.FileUri.create(path.join(repositoryPath, 'folder', 'C.txt')).toString(), { commitish: 'HEAD' });
            (0, chai_1.expect)(content).to.be.equal('C');
        });
        it('modified in index', async () => {
            const repositoryPath = file_uri_1.FileUri.fsPath(repository.localUri);
            fs.writeFileSync(path.join(repositoryPath, 'A.txt'), 'new content');
            (0, chai_1.expect)(fs.readFileSync(path.join(repositoryPath, 'A.txt'), { encoding: 'utf8' })).to.be.equal('new content');
            await git.add(repository, file_uri_1.FileUri.create(path.join(repositoryPath, 'A.txt')).toString());
            const content = await git.show(repository, file_uri_1.FileUri.create(path.join(repositoryPath, 'A.txt')).toString(), { commitish: 'index' });
            (0, chai_1.expect)(content).to.be.equal('new content');
        });
        it('modified in index and in working directory', async () => {
            const repositoryPath = file_uri_1.FileUri.fsPath(repository.localUri);
            fs.writeFileSync(path.join(repositoryPath, 'A.txt'), 'new content');
            (0, chai_1.expect)(fs.readFileSync(path.join(repositoryPath, 'A.txt'), { encoding: 'utf8' })).to.be.equal('new content');
            await git.add(repository, file_uri_1.FileUri.create(path.join(repositoryPath, 'A.txt')).toString());
            (0, chai_1.expect)(await git.show(repository, file_uri_1.FileUri.create(path.join(repositoryPath, 'A.txt')).toString(), { commitish: 'index' })).to.be.equal('new content');
            (0, chai_1.expect)(await git.show(repository, file_uri_1.FileUri.create(path.join(repositoryPath, 'A.txt')).toString(), { commitish: 'HEAD' })).to.be.equal('A');
        });
    });
    describe('remote', async () => {
        it('remotes are not set by default', async () => {
            const root = track.mkdirSync('remote-with-init');
            const localUri = file_uri_1.FileUri.create(root).toString();
            await (0, test_helper_1.initRepository)(root);
            const git = await (0, binding_helper_1.createGit)();
            const remotes = await git.remote({ localUri });
            (0, chai_1.expect)(remotes).to.be.empty;
        });
        it('origin is the default after a fresh clone', async () => {
            const git = await (0, binding_helper_1.createGit)();
            const remoteUrl = 'https://github.com/TypeFox/find-git-exec.git';
            const localUri = file_uri_1.FileUri.create(track.mkdirSync('remote-with-clone')).toString();
            const options = { localUri };
            await git.clone(remoteUrl, options);
            const remotes = await git.remote({ localUri });
            (0, chai_1.expect)(remotes).to.be.lengthOf(1);
            (0, chai_1.expect)(remotes.shift()).to.be.equal('origin');
        });
        it('remotes can be added and queried', async () => {
            const root = track.mkdirSync('remote-with-init');
            const localUri = file_uri_1.FileUri.create(root).toString();
            await (0, test_helper_1.initRepository)(root);
            await (0, git_1.git)(['remote', 'add', 'first', 'some/location'], root, 'addRemote');
            await (0, git_1.git)(['remote', 'add', 'second', 'some/location'], root, 'addRemote');
            const git = await (0, binding_helper_1.createGit)();
            const remotes = await git.remote({ localUri });
            (0, chai_1.expect)(remotes).to.be.deep.equal(['first', 'second']);
        });
    });
    describe('exec', async () => {
        it('version', async () => {
            const root = track.mkdirSync('exec-version');
            const localUri = file_uri_1.FileUri.create(root).toString();
            await (0, test_helper_1.initRepository)(root);
            const git = await (0, binding_helper_1.createGit)();
            const result = await git.exec({ localUri }, ['--version']);
            (0, chai_1.expect)(result.stdout.trim().replace(/^git version /, '').startsWith('2')).to.be.true;
            (0, chai_1.expect)(result.stderr.trim()).to.be.empty;
            (0, chai_1.expect)(result.exitCode).to.be.equal(0);
        });
        it('config', async () => {
            const root = track.mkdirSync('exec-config');
            const localUri = file_uri_1.FileUri.create(root).toString();
            await (0, test_helper_1.initRepository)(root);
            const git = await (0, binding_helper_1.createGit)();
            const result = await git.exec({ localUri }, ['config', '-l']);
            (0, chai_1.expect)(result.stdout.trim()).to.be.not.empty;
            (0, chai_1.expect)(result.stderr.trim()).to.be.empty;
            (0, chai_1.expect)(result.exitCode).to.be.equal(0);
        });
    });
    describe('map-status', async () => {
        it('deleted', () => {
            (0, chai_1.expect)(common_1.GitUtils.mapStatus('D')).to.be.equal(common_1.GitFileStatus.Deleted);
        });
        it('added with leading whitespace', () => {
            (0, chai_1.expect)(common_1.GitUtils.mapStatus(' A')).to.be.equal(common_1.GitFileStatus.New);
        });
        it('modified with trailing whitespace', () => {
            (0, chai_1.expect)(common_1.GitUtils.mapStatus('M ')).to.be.equal(common_1.GitFileStatus.Modified);
        });
        it('copied with percentage', () => {
            (0, chai_1.expect)(common_1.GitUtils.mapStatus('C100')).to.be.equal(common_1.GitFileStatus.Copied);
        });
        it('renamed with percentage', () => {
            (0, chai_1.expect)(common_1.GitUtils.mapStatus('R10')).to.be.equal(common_1.GitFileStatus.Renamed);
        });
    });
    describe('similarity-status', async () => {
        it('copied (2)', () => {
            (0, chai_1.expect)(common_1.GitUtils.isSimilarityStatus('C2')).to.be.false;
        });
        it('copied (20)', () => {
            (0, chai_1.expect)(common_1.GitUtils.isSimilarityStatus('C20')).to.be.false;
        });
        it('copied (020)', () => {
            (0, chai_1.expect)(common_1.GitUtils.isSimilarityStatus('C020')).to.be.true;
        });
        it('renamed (2)', () => {
            (0, chai_1.expect)(common_1.GitUtils.isSimilarityStatus('R2')).to.be.false;
        });
        it('renamed (20)', () => {
            (0, chai_1.expect)(common_1.GitUtils.isSimilarityStatus('R20')).to.be.false;
        });
        it('renamed (020)', () => {
            (0, chai_1.expect)(common_1.GitUtils.isSimilarityStatus('R020')).to.be.true;
        });
        it('invalid', () => {
            (0, chai_1.expect)(common_1.GitUtils.isSimilarityStatus('invalid')).to.be.false;
        });
    });
    describe('blame', async () => {
        const init = async (git, repository) => {
            await git.exec(repository, ['init']);
            if ((await git.exec(repository, ['config', 'user.name'], { successExitCodes: [0, 1] })).exitCode !== 0) {
                await git.exec(repository, ['config', 'user.name', 'User Name']);
            }
            if ((await git.exec(repository, ['config', 'user.email'], { successExitCodes: [0, 1] })).exitCode !== 0) {
                await git.exec(repository, ['config', 'user.email', 'user.name@domain.com']);
            }
        };
        it('blame file with dirty content', async () => {
            const fileName = 'blame.me.not';
            const root = track.mkdirSync('blame-dirty-file');
            const filePath = path.join(root, fileName);
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            const writeContentLines = async (lines) => fs.writeFile(filePath, lines.join('\n'), { encoding: 'utf8' });
            const addAndCommit = async (message) => {
                await git.exec(repository, ['add', '.']);
                await git.exec(repository, ['commit', '-m', `${message}`]);
            };
            const expectBlame = async (content, expected) => {
                const uri = file_uri_1.FileUri.create(path.join(root, fileName)).toString();
                const actual = await git.blame(repository, uri, { content });
                (0, chai_1.expect)(actual).to.be.not.undefined;
                const messages = new Map(actual.commits.map(c => [c.sha, c.summary]));
                const lineMessages = actual.lines.map(l => [l.line, messages.get(l.sha)]);
                (0, chai_1.expect)(lineMessages).to.be.deep.equal(expected);
            };
            const git = await (0, binding_helper_1.createGit)();
            await init(git, repository);
            await fs.createFile(filePath);
            await writeContentLines(['🍏', '🍏', '🍏', '🍏', '🍏', '🍏']);
            await addAndCommit('six 🍏');
            await expectBlame(['🍏', '🍐', '🍐', '🍏', '🍏', '🍏'].join('\n'), [
                [0, 'six 🍏'],
                [1, 'uncommitted'],
                [2, 'uncommitted'],
                [3, 'six 🍏'],
                [4, 'six 🍏'],
                [5, 'six 🍏'],
            ]);
        });
        it('uncommitted file', async () => {
            const fileName = 'uncommitted.file';
            const root = track.mkdirSync('try-blame');
            const filePath = path.join(root, fileName);
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            const writeContentLines = async (lines) => fs.writeFile(filePath, lines.join('\n'), { encoding: 'utf8' });
            const add = async () => {
                await git.exec(repository, ['add', '.']);
            };
            const expectUndefinedBlame = async () => {
                const uri = file_uri_1.FileUri.create(path.join(root, fileName)).toString();
                const actual = await git.blame(repository, uri);
                (0, chai_1.expect)(actual).to.be.undefined;
            };
            const git = await (0, binding_helper_1.createGit)();
            await init(git, repository);
            await fs.createFile(filePath);
            await writeContentLines(['🍏', '🍏', '🍏', '🍏', '🍏', '🍏']);
            await expectUndefinedBlame();
            await add();
            await expectUndefinedBlame();
            await writeContentLines(['🍏', '🍐', '🍐', '🍏', '🍏', '🍏']);
            await expectUndefinedBlame();
        });
        it('blame file', async () => {
            const fileName = 'blame.me';
            const root = track.mkdirSync('blame-file');
            const filePath = path.join(root, fileName);
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            const writeContentLines = async (lines) => fs.writeFile(filePath, lines.join('\n'), { encoding: 'utf8' });
            const addAndCommit = async (message) => {
                await git.exec(repository, ['add', '.']);
                await git.exec(repository, ['commit', '-m', `${message}`]);
            };
            const expectBlame = async (expected) => {
                const uri = file_uri_1.FileUri.create(path.join(root, fileName)).toString();
                const actual = await git.blame(repository, uri);
                (0, chai_1.expect)(actual).to.be.not.undefined;
                const messages = new Map(actual.commits.map(c => [c.sha, c.summary]));
                const lineMessages = actual.lines.map(l => [l.line, messages.get(l.sha)]);
                (0, chai_1.expect)(lineMessages).to.be.deep.equal(expected);
            };
            const git = await (0, binding_helper_1.createGit)();
            await init(git, repository);
            await fs.createFile(filePath);
            await writeContentLines(['🍏', '🍏', '🍏', '🍏', '🍏', '🍏']);
            await addAndCommit('six 🍏');
            await writeContentLines(['🍏', '🍐', '🍐', '🍏', '🍏', '🍏']);
            await addAndCommit('replace two with 🍐');
            await writeContentLines(['🍏', '🍐', '🍋', '🍋', '🍏', '🍏']);
            await addAndCommit('replace two with 🍋');
            await writeContentLines(['🍏', '🍐', '🍋', '🍌', '🍌', '🍏']);
            await expectBlame([
                [0, 'six 🍏'],
                [1, 'replace two with 🍐'],
                [2, 'replace two with 🍋'],
                [3, 'uncommitted'],
                [4, 'uncommitted'],
                [5, 'six 🍏'],
            ]);
        });
        it('commit summary and body', async () => {
            const fileName = 'blame.me';
            const root = track.mkdirSync('blame-with-commit-body');
            const filePath = path.join(root, fileName);
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            const writeContentLines = async (lines) => fs.writeFile(filePath, lines.join('\n'), { encoding: 'utf8' });
            const addAndCommit = async (message) => {
                await git.exec(repository, ['add', '.']);
                await git.exec(repository, ['commit', '-m', `${message}`]);
            };
            const expectBlame = async (expected) => {
                const uri = file_uri_1.FileUri.create(path.join(root, fileName)).toString();
                const actual = await git.blame(repository, uri);
                (0, chai_1.expect)(actual).to.be.not.undefined;
                const messages = new Map(actual.commits.map(c => [c.sha, [c.summary, c.body]]));
                const lineMessages = actual.lines.map(l => [l.line, ...messages.get(l.sha)]);
                (0, chai_1.expect)(lineMessages).to.be.deep.equal(expected);
            };
            const git = await (0, binding_helper_1.createGit)();
            await init(git, repository);
            await fs.createFile(filePath);
            await writeContentLines(['🍏']);
            await addAndCommit('add 🍏\n* green\n* red');
            await expectBlame([
                [0, 'add 🍏', '* green\n* red']
            ]);
        });
    });
    describe('diff', async () => {
        const init = async (git, repository) => {
            await git.exec(repository, ['init']);
            if ((await git.exec(repository, ['config', 'user.name'], { successExitCodes: [0, 1] })).exitCode !== 0) {
                await git.exec(repository, ['config', 'user.name', 'User Name']);
            }
            if ((await git.exec(repository, ['config', 'user.email'], { successExitCodes: [0, 1] })).exitCode !== 0) {
                await git.exec(repository, ['config', 'user.email', 'user.name@domain.com']);
            }
        };
        it('diff without ranges / unstaged', async () => {
            const root = track.mkdirSync('diff-without-ranges');
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            await fs.createFile(path.join(root, 'A.txt'));
            await fs.writeFile(path.join(root, 'A.txt'), 'A content', { encoding: 'utf8' });
            const git = await (0, binding_helper_1.createGit)();
            await init(git, repository);
            const expectDiff = async (expected) => {
                const actual = (await git.diff(repository)).map(change => ChangeDelta.map(repository, change)).sort(ChangeDelta.compare);
                (0, chai_1.expect)(actual).to.be.deep.equal(expected);
            };
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Initialized."']); // HEAD
            await fs.createFile(path.join(root, 'B.txt'));
            await fs.writeFile(path.join(root, 'B.txt'), 'B content', { encoding: 'utf8' });
            await expectDiff([]); // Unstaged (new)
            await fs.writeFile(path.join(root, 'A.txt'), 'updated A content', { encoding: 'utf8' });
            await expectDiff([{ pathSegment: 'A.txt', status: common_1.GitFileStatus.Modified }]); // Unstaged (modified)
            await fs.unlink(path.join(root, 'A.txt'));
            await expectDiff([{ pathSegment: 'A.txt', status: common_1.GitFileStatus.Deleted }]); // Unstaged (deleted)
        });
        it('diff without ranges / staged', async () => {
            const root = track.mkdirSync('diff-without-ranges');
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            await fs.createFile(path.join(root, 'A.txt'));
            await fs.writeFile(path.join(root, 'A.txt'), 'A content', { encoding: 'utf8' });
            const git = await (0, binding_helper_1.createGit)();
            await init(git, repository);
            const expectDiff = async (expected) => {
                const actual = (await git.diff(repository)).map(change => ChangeDelta.map(repository, change)).sort(ChangeDelta.compare);
                (0, chai_1.expect)(actual).to.be.deep.equal(expected);
            };
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Initialized."']); // HEAD
            await fs.createFile(path.join(root, 'B.txt'));
            await fs.writeFile(path.join(root, 'B.txt'), 'B content', { encoding: 'utf8' });
            await git.add(repository, file_uri_1.FileUri.create(path.join(root, 'B.txt')).toString());
            await expectDiff([{ pathSegment: 'B.txt', status: common_1.GitFileStatus.New }]); // Staged (new)
            await fs.writeFile(path.join(root, 'A.txt'), 'updated A content', { encoding: 'utf8' });
            await git.add(repository, file_uri_1.FileUri.create(path.join(root, 'A.txt')).toString());
            await expectDiff([{ pathSegment: 'A.txt', status: common_1.GitFileStatus.Modified }, { pathSegment: 'B.txt', status: common_1.GitFileStatus.New }]); // Staged (modified)
            await fs.unlink(path.join(root, 'A.txt'));
            await git.add(repository, file_uri_1.FileUri.create(path.join(root, 'A.txt')).toString());
            await expectDiff([{ pathSegment: 'A.txt', status: common_1.GitFileStatus.Deleted }, { pathSegment: 'B.txt', status: common_1.GitFileStatus.New }]); // Staged (deleted)
        });
        it('diff with ranges', async () => {
            const root = track.mkdirSync('diff-with-ranges');
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            await fs.createFile(path.join(root, 'A.txt'));
            await fs.writeFile(path.join(root, 'A.txt'), 'A content', { encoding: 'utf8' });
            await fs.createFile(path.join(root, 'B.txt'));
            await fs.writeFile(path.join(root, 'B.txt'), 'B content', { encoding: 'utf8' });
            await fs.mkdir(path.join(root, 'folder'));
            await fs.createFile(path.join(root, 'folder', 'F1.txt'));
            await fs.writeFile(path.join(root, 'folder', 'F1.txt'), 'F1 content', { encoding: 'utf8' });
            await fs.createFile(path.join(root, 'folder', 'F2.txt'));
            await fs.writeFile(path.join(root, 'folder', 'F2.txt'), 'F2 content', { encoding: 'utf8' });
            const git = await (0, binding_helper_1.createGit)();
            await init(git, repository);
            const expectDiff = async (fromRevision, toRevision, expected, filePath) => {
                const range = { fromRevision, toRevision };
                let uri;
                if (filePath) {
                    uri = file_uri_1.FileUri.create(path.join(root, filePath)).toString();
                }
                const options = { range, uri };
                const actual = (await git.diff(repository, options)).map(change => ChangeDelta.map(repository, change)).sort(ChangeDelta.compare);
                (0, chai_1.expect)(actual).to.be.deep.equal(expected, `Between ${fromRevision}..${toRevision}`);
            };
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Commit 1 on master."']); // HEAD~4
            await git.exec(repository, ['checkout', '-b', 'new-branch']);
            await fs.writeFile(path.join(root, 'A.txt'), 'updated A content', { encoding: 'utf8' });
            await fs.unlink(path.join(root, 'B.txt'));
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Commit 1 on new-branch."']); // new-branch~2
            await fs.createFile(path.join(root, 'C.txt'));
            await fs.writeFile(path.join(root, 'C.txt'), 'C content', { encoding: 'utf8' });
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Commit 2 on new-branch."']); // new-branch~1
            await fs.createFile(path.join(root, 'B.txt'));
            await fs.writeFile(path.join(root, 'B.txt'), 'B content', { encoding: 'utf8' });
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Commit 3 on new-branch."']); // new-branch
            await git.exec(repository, ['checkout', 'master']);
            await fs.createFile(path.join(root, 'C.txt'));
            await fs.writeFile(path.join(root, 'C.txt'), 'C content', { encoding: 'utf8' });
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Commit 2 on master."']); // HEAD~3
            await fs.createFile(path.join(root, 'D.txt'));
            await fs.writeFile(path.join(root, 'D.txt'), 'D content', { encoding: 'utf8' });
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Commit 3 on master."']); // HEAD~2
            await fs.unlink(path.join(root, 'B.txt'));
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Commit 4 on master."']); // HEAD~1
            await fs.unlink(path.join(root, 'folder', 'F1.txt'));
            await fs.writeFile(path.join(root, 'folder', 'F2.txt'), 'updated F2 content', { encoding: 'utf8' });
            await fs.createFile(path.join(root, 'folder', 'F3 with space.txt'));
            await fs.writeFile(path.join(root, 'folder', 'F3 with space.txt'), 'F3 content', { encoding: 'utf8' });
            await git.exec(repository, ['add', '.']);
            await git.exec(repository, ['commit', '-m', '"Commit 5 on master."']); // HEAD
            await expectDiff('HEAD~4', 'HEAD~3', [{ pathSegment: 'C.txt', status: common_1.GitFileStatus.New }]);
            await expectDiff('HEAD~4', 'HEAD~2', [{ pathSegment: 'C.txt', status: common_1.GitFileStatus.New }, { pathSegment: 'D.txt', status: common_1.GitFileStatus.New }]);
            await expectDiff('HEAD~4', 'HEAD~1', [{ pathSegment: 'B.txt', status: common_1.GitFileStatus.Deleted }, { pathSegment: 'C.txt', status: common_1.GitFileStatus.New }, { pathSegment: 'D.txt', status: common_1.GitFileStatus.New }]);
            await expectDiff('HEAD~3', 'HEAD~2', [{ pathSegment: 'D.txt', status: common_1.GitFileStatus.New }]);
            await expectDiff('HEAD~3', 'HEAD~1', [{ pathSegment: 'B.txt', status: common_1.GitFileStatus.Deleted }, { pathSegment: 'D.txt', status: common_1.GitFileStatus.New }]);
            await expectDiff('HEAD~2', 'HEAD~1', [{ pathSegment: 'B.txt', status: common_1.GitFileStatus.Deleted }]);
            await expectDiff('new-branch~2', 'new-branch~1', [{ pathSegment: 'C.txt', status: common_1.GitFileStatus.New }]);
            await expectDiff('new-branch~2', 'new-branch', [{ pathSegment: 'B.txt', status: common_1.GitFileStatus.New }, { pathSegment: 'C.txt', status: common_1.GitFileStatus.New }]);
            await expectDiff('new-branch~1', 'new-branch', [{ pathSegment: 'B.txt', status: common_1.GitFileStatus.New }]);
            // Filter for a whole folder and its descendants.
            await expectDiff('HEAD~4', 'HEAD~3', [], 'folder');
            await expectDiff('HEAD~4', 'HEAD', [
                { pathSegment: 'folder/F1.txt', status: common_1.GitFileStatus.Deleted },
                { pathSegment: 'folder/F2.txt', status: common_1.GitFileStatus.Modified },
                { pathSegment: 'folder/F3 with space.txt', status: common_1.GitFileStatus.New },
            ], 'folder');
            // Filter for a single file.
            await expectDiff('HEAD~4', 'HEAD~3', [], 'folder/F1.txt');
            await expectDiff('HEAD~4', 'HEAD', [
                { pathSegment: 'folder/F1.txt', status: common_1.GitFileStatus.Deleted },
            ], 'folder/F1.txt');
            // Filter for a non-existing file.
            await expectDiff('HEAD~4', 'HEAD~3', [], 'does not exist');
            await expectDiff('HEAD~4', 'HEAD', [], 'does not exist');
        });
    });
    describe('branch', () => {
        // Skip the test case as it is dependent on the git version.
        it.skip('should list the branch in chronological order', async function () {
            if (os_1.isWindows) {
                this.skip(); // https://github.com/eclipse-theia/theia/issues/8023
                return;
            }
            const root = track.mkdirSync('branch-order');
            const localUri = file_uri_1.FileUri.create(root).toString();
            const repository = { localUri };
            const git = await (0, binding_helper_1.createGit)();
            await (0, test_helper_1.createTestRepository)(root);
            await git.exec(repository, ['checkout', '-b', 'a']);
            await git.exec(repository, ['checkout', 'master']);
            await git.exec(repository, ['checkout', '-b', 'b']);
            await git.exec(repository, ['checkout', 'master']);
            await git.exec(repository, ['checkout', '-b', 'c']);
            await git.exec(repository, ['checkout', 'master']);
            (0, chai_1.expect)((await git.branch(repository, { type: 'local' })).map(b => b.nameWithoutRemote)).to.be.deep.equal(['master', 'c', 'b', 'a']);
        });
    });
    describe('ls-files', () => {
        let git;
        let root;
        let localUri;
        before(async () => {
            root = track.mkdirSync('ls-files');
            localUri = file_uri_1.FileUri.create(root).toString();
            git = await (0, binding_helper_1.createGit)();
            await (0, test_helper_1.createTestRepository)(root);
        });
        [
            ['A.txt', true],
            ['missing.txt', false],
            ['../outside.txt', false],
        ].forEach(test => {
            const [relativePath, expectation] = test;
            const message = `${expectation ? '' : 'not '}exist`;
            it(`errorUnmatched - ${relativePath} should ${message}`, async () => {
                const uri = relativePath.startsWith('.') ? relativePath : file_uri_1.FileUri.create(path.join(root, relativePath)).toString();
                const testMe = async () => git.lsFiles({ localUri }, uri, { errorUnmatch: true });
                (0, chai_1.expect)(await testMe()).to.be.equal(expectation);
            });
        });
    });
});
describe('log', function () {
    // See https://github.com/eclipse-theia/theia/issues/2143
    it('should not fail when executed from the repository root', async () => {
        const git = await (0, binding_helper_1.createGit)();
        const root = await (0, test_helper_1.createTestRepository)(track.mkdirSync('log-test'));
        const localUri = file_uri_1.FileUri.create(root).toString();
        const repository = { localUri };
        const result = await git.log(repository, { uri: localUri });
        (0, chai_1.expect)(result.length).to.be.equal(1);
        (0, chai_1.expect)(result[0].author.email).to.be.equal('jon@doe.com');
    });
    it('should not fail when executed against an empty repository', async () => {
        const git = await (0, binding_helper_1.createGit)();
        const root = await (0, test_helper_1.initRepository)(track.mkdirSync('empty-log-test'));
        const localUri = file_uri_1.FileUri.create(root).toString();
        const repository = { localUri };
        const result = await git.log(repository, { uri: localUri });
        (0, chai_1.expect)(result.length).to.be.equal(0);
    });
});
function toPathSegment(repository, uri) {
    return upath.relative(file_uri_1.FileUri.fsPath(repository.localUri), file_uri_1.FileUri.fsPath(uri));
}
var ChangeDelta;
(function (ChangeDelta) {
    function compare(left, right) {
        const result = left.pathSegment.localeCompare(right.pathSegment);
        if (result === 0) {
            return left.status - right.status;
        }
        return result;
    }
    ChangeDelta.compare = compare;
    function map(repository, fileChange) {
        return {
            pathSegment: toPathSegment(repository, fileChange.uri),
            status: fileChange.status
        };
    }
    ChangeDelta.map = map;
})(ChangeDelta || (ChangeDelta = {}));
//# sourceMappingURL=dugite-git.spec.js.map