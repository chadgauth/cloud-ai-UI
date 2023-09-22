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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CommitDetailsParser_1, GitBlameParser_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DugiteGit = exports.GitBlameParser = exports.CommitDetailsParser = exports.CommitPlaceholders = exports.NameStatusParser = exports.OutputParser = void 0;
const fs = require("@theia/core/shared/fs-extra");
const Path = require("path");
const inversify_1 = require("@theia/core/shared/inversify");
const git_1 = require("dugite-extra/lib/core/git");
const push_1 = require("dugite-extra/lib/command/push");
const pull_1 = require("dugite-extra/lib/command/pull");
const clone_1 = require("dugite-extra/lib/command/clone");
const fetch_1 = require("dugite-extra/lib/command/fetch");
const stash_1 = require("dugite-extra/lib/command/stash");
const merge_1 = require("dugite-extra/lib/command/merge");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const status_1 = require("dugite-extra/lib/command/status");
const commit_1 = require("dugite-extra/lib/command/commit");
const stage_1 = require("dugite-extra/lib/command/stage");
const reset_1 = require("dugite-extra/lib/command/reset");
const show_1 = require("dugite-extra/lib/command/show");
const checkout_1 = require("dugite-extra/lib/command/checkout");
const branch_1 = require("dugite-extra/lib/command/branch");
const status_2 = require("dugite-extra/lib/model/status");
const core_1 = require("@theia/core");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const strings = require("@theia/core/lib/common/strings");
const common_1 = require("../common");
const git_repository_manager_1 = require("./git-repository-manager");
const git_locator_protocol_1 = require("./git-locator/git-locator-protocol");
const git_exec_provider_1 = require("./git-exec-provider");
const git_env_provider_1 = require("./env/git-env-provider");
const git_init_1 = require("./init/git-init");
/**
 * Parsing and converting raw Git output into Git model instances.
 */
let OutputParser = class OutputParser {
    toUri(repositoryUri, pathSegment) {
        return file_uri_1.FileUri.create(Path.join(file_uri_1.FileUri.fsPath(repositoryUri), pathSegment)).toString();
    }
    split(input, delimiter) {
        return (Array.isArray(input) ? input : input.split(delimiter)).filter(item => item && item.length > 0);
    }
};
/** This is the `NUL` delimiter. Equals `%x00`. */
OutputParser.LINE_DELIMITER = '\0';
OutputParser = __decorate([
    (0, inversify_1.injectable)()
], OutputParser);
exports.OutputParser = OutputParser;
/**
 * Status parser for converting raw Git `--name-status` output into file change objects.
 */
let NameStatusParser = class NameStatusParser extends OutputParser {
    parse(repositoryUri, input, delimiter = OutputParser.LINE_DELIMITER) {
        const items = this.split(input, delimiter);
        const changes = [];
        let index = 0;
        while (index < items.length) {
            const rawStatus = items[index];
            const status = common_1.GitUtils.mapStatus(rawStatus);
            if (common_1.GitUtils.isSimilarityStatus(rawStatus)) {
                const uri = this.toUri(repositoryUri, items[index + 2]);
                const oldUri = this.toUri(repositoryUri, items[index + 1]);
                changes.push({
                    status,
                    uri,
                    oldUri,
                    staged: true
                });
                index = index + 3;
            }
            else {
                const uri = this.toUri(repositoryUri, items[index + 1]);
                changes.push({
                    status,
                    uri,
                    staged: true
                });
                index = index + 2;
            }
        }
        return changes;
    }
};
NameStatusParser = __decorate([
    (0, inversify_1.injectable)()
], NameStatusParser);
exports.NameStatusParser = NameStatusParser;
/**
 * Built-in Git placeholders for tuning the `--format` option for `git diff` or `git log`.
 */
var CommitPlaceholders;
(function (CommitPlaceholders) {
    CommitPlaceholders["HASH"] = "%H";
    CommitPlaceholders["SHORT_HASH"] = "%h";
    CommitPlaceholders["AUTHOR_EMAIL"] = "%aE";
    CommitPlaceholders["AUTHOR_NAME"] = "%aN";
    CommitPlaceholders["AUTHOR_DATE"] = "%aI";
    CommitPlaceholders["AUTHOR_RELATIVE_DATE"] = "%ar";
    CommitPlaceholders["SUBJECT"] = "%s";
    CommitPlaceholders["BODY"] = "%b";
})(CommitPlaceholders = exports.CommitPlaceholders || (exports.CommitPlaceholders = {}));
/**
 * Parser for converting raw, Git commit details into `CommitWithChanges` instances.
 */
let CommitDetailsParser = CommitDetailsParser_1 = class CommitDetailsParser extends OutputParser {
    parse(repositoryUri, input, delimiter = CommitDetailsParser_1.COMMIT_CHUNK_DELIMITER) {
        const chunks = this.split(input, delimiter);
        const changes = [];
        for (const chunk of chunks) {
            const [sha, email, name, timestamp, authorDateRelative, summary, body, rawChanges] = chunk.trim().split(CommitDetailsParser_1.ENTRY_DELIMITER);
            const fileChanges = this.nameStatusParser.parse(repositoryUri, (rawChanges || '').trim());
            changes.push({
                sha,
                author: { timestamp, email, name },
                authorDateRelative,
                summary,
                body,
                fileChanges
            });
        }
        return changes;
    }
    getFormat(...placeholders) {
        return '%x02' + placeholders.join('%x01') + '%x01';
    }
};
CommitDetailsParser.ENTRY_DELIMITER = '\x01';
CommitDetailsParser.COMMIT_CHUNK_DELIMITER = '\x02';
CommitDetailsParser.DEFAULT_PLACEHOLDERS = [
    CommitPlaceholders.HASH,
    CommitPlaceholders.AUTHOR_EMAIL,
    CommitPlaceholders.AUTHOR_NAME,
    CommitPlaceholders.AUTHOR_DATE,
    CommitPlaceholders.AUTHOR_RELATIVE_DATE,
    CommitPlaceholders.SUBJECT,
    CommitPlaceholders.BODY
];
__decorate([
    (0, inversify_1.inject)(NameStatusParser),
    __metadata("design:type", NameStatusParser)
], CommitDetailsParser.prototype, "nameStatusParser", void 0);
CommitDetailsParser = CommitDetailsParser_1 = __decorate([
    (0, inversify_1.injectable)()
], CommitDetailsParser);
exports.CommitDetailsParser = CommitDetailsParser;
let GitBlameParser = GitBlameParser_1 = class GitBlameParser {
    async parse(fileUri, gitBlameOutput, commitBody) {
        if (!gitBlameOutput) {
            return undefined;
        }
        const parsedEntries = this.parseEntries(gitBlameOutput);
        return this.createFileBlame(fileUri, parsedEntries, commitBody);
    }
    parseEntries(rawOutput) {
        const result = [];
        let current;
        for (const line of strings.split(rawOutput, '\n')) {
            if (current === undefined) {
                current = {};
            }
            if (GitBlameParser_1.pumpEntry(current, line)) {
                result.push(current);
                current = undefined;
            }
        }
        return result;
    }
    async createFileBlame(uri, blameEntries, commitBody) {
        const commits = new Map();
        const lines = [];
        for (const entry of blameEntries) {
            const sha = entry.sha;
            let commit = commits.get(sha);
            if (!commit) {
                commit = {
                    sha,
                    author: {
                        name: entry.author,
                        email: entry.authorMail,
                        timestamp: entry.authorTime ? new Date(entry.authorTime * 1000).toISOString() : '',
                    },
                    summary: entry.summary,
                    body: await commitBody(sha)
                };
                commits.set(sha, commit);
            }
            const lineCount = entry.lineCount;
            for (let lineOffset = 0; lineOffset < lineCount; lineOffset++) {
                const line = {
                    sha,
                    line: entry.line + lineOffset
                };
                lines[line.line] = line;
            }
        }
        const fileBlame = { uri, commits: Array.from(commits.values()), lines };
        return fileBlame;
    }
};
GitBlameParser = GitBlameParser_1 = __decorate([
    (0, inversify_1.injectable)()
], GitBlameParser);
exports.GitBlameParser = GitBlameParser;
(function (GitBlameParser) {
    function isUncommittedSha(sha) {
        return (sha || '').startsWith('0000000');
    }
    GitBlameParser.isUncommittedSha = isUncommittedSha;
    function pumpEntry(entry, outputLine) {
        const parts = outputLine.split(' ');
        if (parts.length < 2) {
            return false;
        }
        const uncommitted = isUncommittedSha(entry.sha);
        const firstPart = parts[0];
        if (entry.sha === undefined) {
            entry.sha = firstPart;
            entry.line = parseInt(parts[2], 10) - 1; // to zero based
            entry.lineCount = parseInt(parts[3], 10);
        }
        else if (firstPart === 'author') {
            entry.author = uncommitted ? 'You' : parts.slice(1).join(' ');
        }
        else if (firstPart === 'author-mail') {
            const rest = parts.slice(1).join(' ');
            const matches = rest.match(/(<(.*)>)/);
            entry.authorMail = matches ? matches[2] : rest;
        }
        else if (firstPart === 'author-time') {
            entry.authorTime = parseInt(parts[1], 10);
        }
        else if (firstPart === 'summary') {
            let summary = parts.slice(1).join(' ');
            if (summary.startsWith('"') && summary.endsWith('"')) {
                summary = summary.substring(1, summary.length - 1);
            }
            entry.summary = uncommitted ? 'uncommitted' : summary;
        }
        else if (firstPart === 'previous') {
            entry.previousSha = parts[1];
        }
        else if (firstPart === 'filename') {
            entry.fileName = parts.slice(1).join(' ');
            return true;
        }
        return false;
    }
    GitBlameParser.pumpEntry = pumpEntry;
})(GitBlameParser = exports.GitBlameParser || (exports.GitBlameParser = {}));
exports.GitBlameParser = GitBlameParser;
/**
 * `dugite-extra` based Git implementation.
 */
let DugiteGit = class DugiteGit {
    constructor() {
        this.limit = 1000;
        this.ready = new promise_util_1.Deferred();
        this.gitEnv = new promise_util_1.Deferred();
    }
    init() {
        this.envProvider.getEnv().then(env => this.gitEnv.resolve(env));
        this.gitInit.init()
            .catch(err => {
            this.logger.error('An error occurred during the Git initialization.', err);
            this.ready.resolve();
        })
            .then(() => this.ready.resolve());
    }
    dispose() {
        this.locator.dispose();
        this.execProvider.dispose();
        this.gitInit.dispose();
    }
    async clone(remoteUrl, options) {
        await this.ready.promise;
        const { localUri, branch } = options;
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        await (0, clone_1.clone)(remoteUrl, this.getFsPath(localUri), { branch }, { exec, env });
        return { localUri };
    }
    async repositories(workspaceRootUri, options) {
        await this.ready.promise;
        const workspaceRootPath = this.getFsPath(workspaceRootUri);
        const repositories = [];
        const containingPath = await this.resolveContainingPath(workspaceRootPath);
        if (containingPath) {
            repositories.push({
                localUri: this.getUri(containingPath)
            });
        }
        const maxCount = typeof options.maxCount === 'number' ? options.maxCount - repositories.length : undefined;
        if (typeof maxCount === 'number' && maxCount <= 0) {
            return repositories;
        }
        for (const repositoryPath of await this.locator.locate(workspaceRootPath, {
            maxCount
        })) {
            if (containingPath !== repositoryPath) {
                repositories.push({
                    localUri: this.getUri(repositoryPath)
                });
            }
        }
        return repositories;
    }
    async status(repository) {
        await this.ready.promise;
        const repositoryPath = this.getFsPath(repository);
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        const dugiteStatus = await (0, status_1.getStatus)(repositoryPath, true, this.limit, { exec, env });
        return this.mapStatus(dugiteStatus, repository);
    }
    async add(repository, uri) {
        await this.ready.promise;
        const paths = (Array.isArray(uri) ? uri : [uri]).map(file_uri_1.FileUri.fsPath);
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        return this.manager.run(repository, () => (0, stage_1.stage)(this.getFsPath(repository), paths, { exec, env }));
    }
    async unstage(repository, uri, options) {
        await this.ready.promise;
        const paths = (Array.isArray(uri) ? uri : [uri]).map(file_uri_1.FileUri.fsPath);
        const treeish = options && options.treeish ? options.treeish : undefined;
        const where = options && options.reset ? options.reset : undefined;
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        return this.manager.run(repository, () => (0, stage_1.unstage)(this.getFsPath(repository), paths, treeish, where, { exec, env }));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async branch(repository, options) {
        await this.ready.promise;
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        const repositoryPath = this.getFsPath(repository);
        if (common_1.GitUtils.isBranchList(options)) {
            if (options.type === 'current') {
                const currentBranch = await (0, branch_1.listBranch)(repositoryPath, options.type, { exec, env });
                return currentBranch ? this.mapBranch(currentBranch) : undefined;
            }
            const branches = await (0, branch_1.listBranch)(repositoryPath, options.type, { exec, env });
            return Promise.all(branches.map(branch => this.mapBranch(branch)));
        }
        return this.manager.run(repository, () => {
            if (common_1.GitUtils.isBranchCreate(options)) {
                return (0, branch_1.createBranch)(repositoryPath, options.toCreate, { startPoint: options.startPoint }, { exec, env });
            }
            if (common_1.GitUtils.isBranchRename(options)) {
                return (0, branch_1.renameBranch)(repositoryPath, options.newName, options.newName, { force: !!options.force }, { exec, env });
            }
            if (common_1.GitUtils.isBranchDelete(options)) {
                return (0, branch_1.deleteBranch)(repositoryPath, options.toDelete, { force: !!options.force, remote: !!options.remote }, { exec, env });
            }
            return this.fail(repository, `Unexpected git branch options: ${options}.`);
        });
    }
    async checkout(repository, options) {
        await this.ready.promise;
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        return this.manager.run(repository, () => {
            const repositoryPath = this.getFsPath(repository);
            if (common_1.GitUtils.isBranchCheckout(options)) {
                return (0, checkout_1.checkoutBranch)(repositoryPath, options.branch, { exec, env });
            }
            if (common_1.GitUtils.isWorkingTreeFileCheckout(options)) {
                const paths = (Array.isArray(options.paths) ? options.paths : [options.paths]).map(file_uri_1.FileUri.fsPath);
                return (0, checkout_1.checkoutPaths)(repositoryPath, paths, { exec, env });
            }
            return this.fail(repository, `Unexpected git checkout options: ${options}.`);
        });
    }
    async commit(repository, message, options) {
        await this.ready.promise;
        const signOff = options && options.signOff;
        const amend = options && options.amend;
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        return this.manager.run(repository, () => (0, commit_1.createCommit)(this.getFsPath(repository), message || '', signOff, amend, { exec, env }));
    }
    async fetch(repository, options) {
        await this.ready.promise;
        const repositoryPath = this.getFsPath(repository);
        const r = await this.getDefaultRemote(repositoryPath, options ? options.remote : undefined);
        if (r) {
            const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
            return this.manager.run(repository, () => (0, fetch_1.fetch)(repositoryPath, r, { exec, env }));
        }
        this.fail(repository, 'No remote repository specified. Please, specify either a URL or a remote name from which new revisions should be fetched.');
    }
    async push(repository, { remote, localBranch, remoteBranch, setUpstream, force } = {}) {
        await this.ready.promise;
        const repositoryPath = this.getFsPath(repository);
        const currentRemote = await this.getDefaultRemote(repositoryPath, remote);
        if (currentRemote === undefined) {
            this.fail(repository, 'No configured push destination.');
        }
        const branch = await this.getCurrentBranch(repositoryPath, localBranch);
        const branchName = typeof branch === 'string' ? branch : branch.name;
        if (setUpstream || force) {
            const args = ['push'];
            if (force) {
                args.push('--force');
            }
            if (setUpstream) {
                args.push('--set-upstream');
            }
            if (currentRemote) {
                args.push(currentRemote);
            }
            args.push(branchName + (remoteBranch ? `:${remoteBranch}` : ''));
            await this.exec(repository, args);
        }
        else {
            const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
            return this.manager.run(repository, () => (0, push_1.push)(repositoryPath, currentRemote, branchName, remoteBranch, { exec, env }));
        }
    }
    async pull(repository, { remote, branch, rebase } = {}) {
        await this.ready.promise;
        const repositoryPath = this.getFsPath(repository);
        const currentRemote = await this.getDefaultRemote(repositoryPath, remote);
        if (currentRemote === undefined) {
            this.fail(repository, 'No remote repository specified. Please, specify either a URL or a remote name from which new revisions should be fetched.');
        }
        if (rebase) {
            const args = ['pull'];
            if (rebase) {
                args.push('-r');
            }
            if (currentRemote) {
                args.push(currentRemote);
            }
            if (branch) {
                args.push(branch);
            }
            await this.exec(repository, args);
        }
        else {
            const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
            return this.manager.run(repository, () => (0, pull_1.pull)(repositoryPath, currentRemote, branch, { exec, env }));
        }
    }
    async reset(repository, options) {
        await this.ready.promise;
        const repositoryPath = this.getFsPath(repository);
        const mode = this.getResetMode(options.mode);
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        return this.manager.run(repository, () => (0, reset_1.reset)(repositoryPath, mode, options.ref ? options.ref : 'HEAD', { exec, env }));
    }
    async merge(repository, options) {
        await this.ready.promise;
        const repositoryPath = this.getFsPath(repository);
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        return this.manager.run(repository, () => (0, merge_1.merge)(repositoryPath, options.branch, { exec, env }));
    }
    async show(repository, uri, options) {
        await this.ready.promise;
        const encoding = options ? options.encoding || 'utf8' : 'utf8';
        const commitish = this.getCommitish(options);
        const repositoryPath = this.getFsPath(repository);
        const path = this.getFsPath(uri);
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        if (encoding === 'binary') {
            return (await (0, show_1.getBlobContents)(repositoryPath, commitish, path, { exec, env })).toString();
        }
        return (await (0, show_1.getTextContents)(repositoryPath, commitish, path, { exec, env })).toString();
    }
    async stash(repository, options) {
        const repositoryPath = this.getFsPath(repository);
        try {
            if (!options || (options && !options.action)) {
                await stash_1.stash.push(repositoryPath, options ? options.message : undefined);
                return;
            }
            switch (options.action) {
                case 'push':
                    await stash_1.stash.push(repositoryPath, options.message);
                    break;
                case 'apply':
                    await stash_1.stash.apply(repositoryPath, options.id);
                    break;
                case 'pop':
                    await stash_1.stash.pop(repositoryPath, options.id);
                    break;
                case 'list':
                    const stashList = await stash_1.stash.list(repositoryPath);
                    const stashes = [];
                    stashList.forEach(stashItem => {
                        const splitIndex = stashItem.indexOf(':');
                        stashes.push({
                            id: stashItem.substring(0, splitIndex),
                            message: stashItem.substring(splitIndex + 1)
                        });
                    });
                    return stashes;
                case 'drop':
                    await stash_1.stash.drop(repositoryPath, options.id);
                    break;
            }
        }
        catch (err) {
            this.fail(repository, err);
        }
    }
    async remote(repository, options) {
        await this.ready.promise;
        const repositoryPath = this.getFsPath(repository);
        const remotes = await this.getRemotes(repositoryPath);
        const names = remotes.map(a => a.name);
        return (options && options.verbose === true) ? remotes : names;
    }
    async exec(repository, args, options) {
        await this.ready.promise;
        const repositoryPath = this.getFsPath(repository);
        return this.manager.run(repository, async () => {
            const name = options && options.name ? options.name : '';
            const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
            let opts = {};
            if (options) {
                opts = {
                    ...options
                };
                if (options.successExitCodes) {
                    opts = { ...opts, successExitCodes: new Set(options.successExitCodes) };
                }
                if (options.expectedErrors) {
                    opts = { ...opts, expectedErrors: new Set(options.expectedErrors) };
                }
            }
            opts = {
                ...opts,
                exec,
                env
            };
            return (0, git_1.git)(args, repositoryPath, name, opts);
        });
    }
    async diff(repository, options) {
        await this.ready.promise;
        const args = ['diff', '--name-status', '-C', '-M', '-z'];
        args.push(this.mapRange((options || {}).range));
        if (options && options.uri) {
            const relativePath = Path.relative(this.getFsPath(repository), this.getFsPath(options.uri));
            args.push(...['--', relativePath !== '' ? relativePath : '.']);
        }
        const result = await this.exec(repository, args);
        return this.nameStatusParser.parse(repository.localUri, result.stdout.trim());
    }
    async log(repository, options) {
        await this.ready.promise;
        // If remaining commits should be calculated by the backend, then run `git rev-list --count ${fromRevision | HEAD~fromRevision}`.
        // How to use `mailmap` to map authors: https://www.kernel.org/pub/software/scm/git/docs/git-shortlog.html.
        const args = ['log'];
        if (options && options.branch) {
            args.push(options.branch);
        }
        const range = this.mapRange((options || {}).range);
        args.push(...[range, '-C', '-M', '-m', '--first-parent']);
        const maxCount = options && options.maxCount ? options.maxCount : 0;
        if (Number.isInteger(maxCount) && maxCount > 0) {
            args.push(...['-n', `${maxCount}`]);
        }
        const placeholders = options && options.shortSha ?
            [CommitPlaceholders.SHORT_HASH, ...CommitDetailsParser.DEFAULT_PLACEHOLDERS.slice(1)] : CommitDetailsParser.DEFAULT_PLACEHOLDERS;
        args.push(...['--name-status', '--date=unix', `--format=${this.commitDetailsParser.getFormat(...placeholders)}`, '-z', '--']);
        if (options && options.uri) {
            const file = Path.relative(this.getFsPath(repository), this.getFsPath(options.uri)) || '.';
            args.push(...[file]);
        }
        const successExitCodes = [0, 128];
        let result = await this.exec(repository, args, { successExitCodes });
        if (result.exitCode !== 0) {
            // Note that if no range specified then the 'to revision' defaults to HEAD
            const rangeInvolvesHead = !options || !options.range || options.range.toRevision === 'HEAD';
            const repositoryHasNoHead = !await this.revParse(repository, { ref: 'HEAD' });
            // The 'log' command could potentially be valid when no HEAD if the revision range does not involve HEAD */
            if (rangeInvolvesHead && repositoryHasNoHead) {
                // The range involves HEAD but there is no HEAD.  'no head' most likely means a newly created repository with
                // no commits, but could potentially have commits with no HEAD.  This is effectively an empty repository.
                return [];
            }
            // Either the range did not involve HEAD or HEAD exists.  The error must be something else,
            // so re-run but this time we don't ignore the error.
            result = await this.exec(repository, args);
        }
        return this.commitDetailsParser.parse(repository.localUri, result.stdout.trim()
            .split(CommitDetailsParser.COMMIT_CHUNK_DELIMITER)
            .filter(item => item && item.length > 0));
    }
    async revParse(repository, options) {
        const ref = options.ref;
        const successExitCodes = [0, 128];
        const result = await this.exec(repository, ['rev-parse', ref], { successExitCodes });
        if (result.exitCode === 0) {
            return result.stdout; // sha
        }
    }
    async blame(repository, uri, options) {
        await this.ready.promise;
        const args = ['blame', '--root', '--incremental'];
        const file = Path.relative(this.getFsPath(repository), this.getFsPath(uri));
        const repositoryPath = this.getFsPath(repository);
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        const status = await (0, status_1.getStatus)(repositoryPath, true, this.limit, { exec, env });
        const isUncommitted = (change) => change.status === status_2.AppFileStatus.New && change.path === file;
        const changes = status.workingDirectory.files;
        if (changes.some(isUncommitted)) {
            return undefined;
        }
        const stdin = options ? options.content : undefined;
        if (stdin) {
            args.push('--contents', '-');
        }
        const gitResult = await this.exec(repository, [...args, '--', file], { stdin });
        const output = gitResult.stdout.trim();
        const commitBodyReader = async (sha) => {
            if (GitBlameParser.isUncommittedSha(sha)) {
                return '';
            }
            const revResult = await this.exec(repository, ['rev-list', '--format=%B', '--max-count=1', sha]);
            const revOutput = revResult.stdout;
            let nl = revOutput.indexOf('\n');
            if (nl > 0) {
                nl = revOutput.indexOf('\n', nl + 1);
            }
            return revOutput.substring(Math.max(0, nl)).trim();
        };
        const blame = await this.blameParser.parse(uri, output, commitBodyReader);
        return blame;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async lsFiles(repository, uri, options) {
        await this.ready.promise;
        const args = ['ls-files'];
        const relativePath = Path.relative(this.getFsPath(repository), this.getFsPath(uri));
        const file = (relativePath === '') ? '.' : relativePath;
        if (options && options.errorUnmatch) {
            args.push('--error-unmatch', file);
            const successExitCodes = [0, 1];
            const expectedErrors = [common_1.GitError.OutsideRepository];
            const result = await this.exec(repository, args, { successExitCodes, expectedErrors });
            const { exitCode } = result;
            return exitCode === 0;
        }
    }
    getCommitish(options) {
        if (options && options.commitish) {
            return 'index' === options.commitish ? '' : options.commitish;
        }
        return '';
    }
    // TODO: akitta what about symlinks? What if the workspace root is a symlink?
    // Maybe, we should use `--show-cdup` here instead of `--show-toplevel` because `show-toplevel` dereferences symlinks.
    async resolveContainingPath(repositoryPath) {
        await this.ready.promise;
        // Do not log an error if we are not contained in a Git repository. Treat exit code 128 as a success too.
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        const options = { successExitCodes: new Set([0, 128]), exec, env };
        const result = await (0, git_1.git)(['rev-parse', '--show-toplevel'], repositoryPath, 'rev-parse', options);
        const out = result.stdout;
        if (out && out.length !== 0) {
            try {
                const realpath = await fs.realpath(out.trim());
                return realpath;
            }
            catch (e) {
                this.logger.error(e);
                return undefined;
            }
        }
        return undefined;
    }
    async getRemotes(repositoryPath) {
        await this.ready.promise;
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        const result = await (0, git_1.git)(['remote', '-v'], repositoryPath, 'remote', { exec, env });
        const out = result.stdout || '';
        const results = out.trim().match(/\S+/g);
        if (results) {
            const values = [];
            for (let i = 0; i < results.length; i += 6) {
                values.push({ name: results[i], fetch: results[i + 1], push: results[i + 4] });
            }
            return values;
        }
        else {
            return [];
        }
    }
    async getDefaultRemote(repositoryPath, remote) {
        if (remote === undefined) {
            const remotes = await this.getRemotes(repositoryPath);
            const name = remotes.map(a => a.name);
            return name.shift();
        }
        return remote;
    }
    async getCurrentBranch(repositoryPath, localBranch) {
        await this.ready.promise;
        if (localBranch !== undefined) {
            return localBranch;
        }
        const [exec, env] = await Promise.all([this.execProvider.exec(), this.gitEnv.promise]);
        const branch = await (0, branch_1.listBranch)(repositoryPath, 'current', { exec, env });
        if (branch === undefined) {
            return this.fail(repositoryPath, 'No current branch.');
        }
        if (Array.isArray(branch)) {
            return this.fail(repositoryPath, `Implementation error. Listing branch with the 'current' flag must return with single value. Was: ${branch}`);
        }
        return this.mapBranch(branch);
    }
    getResetMode(mode) {
        switch (mode) {
            case 'hard': return 0 /* Hard */;
            case 'soft': return 1 /* Soft */;
            case 'mixed': return 2 /* Mixed */;
            default: throw new Error(`Unexpected Git reset mode: ${mode}.`);
        }
    }
    async mapBranch(toMap) {
        const tip = await this.mapTip(toMap.tip);
        return {
            name: toMap.name,
            nameWithoutRemote: toMap.nameWithoutRemote,
            remote: toMap.remote,
            type: toMap.type,
            upstream: toMap.upstream,
            upstreamWithoutRemote: toMap.upstreamWithoutRemote,
            tip
        };
    }
    async mapTip(toMap) {
        const author = await this.mapCommitIdentity(toMap.author);
        return {
            author,
            body: toMap.body,
            parentSHAs: [...toMap.parentSHAs],
            sha: toMap.sha,
            summary: toMap.summary
        };
    }
    async mapCommitIdentity(toMap) {
        return {
            timestamp: toMap.date.toISOString(),
            email: toMap.email,
            name: toMap.name,
        };
    }
    async mapStatus(toMap, repository) {
        const repositoryPath = this.getFsPath(repository);
        const [aheadBehind, changes] = await Promise.all([this.mapAheadBehind(toMap.branchAheadBehind), this.mapFileChanges(toMap.workingDirectory, repositoryPath)]);
        return {
            exists: toMap.exists,
            branch: toMap.currentBranch,
            upstreamBranch: toMap.currentUpstreamBranch,
            aheadBehind,
            changes,
            currentHead: toMap.currentTip,
            incomplete: toMap.incomplete
        };
    }
    async mapAheadBehind(toMap) {
        return toMap ? { ...toMap } : undefined;
    }
    async mapFileChanges(toMap, repositoryPath) {
        return Promise.all(toMap.files
            .filter(file => !this.isNestedGitRepository(file))
            .map(file => this.mapFileChange(file, repositoryPath)));
    }
    isNestedGitRepository(fileChange) {
        return fileChange.path.endsWith('/');
    }
    async mapFileChange(toMap, repositoryPath) {
        const [uri, status, oldUri] = await Promise.all([
            this.getUri(Path.join(repositoryPath, toMap.path)),
            this.mapFileStatus(toMap.status),
            toMap.oldPath ? this.getUri(Path.join(repositoryPath, toMap.oldPath)) : undefined
        ]);
        return {
            uri,
            status,
            oldUri,
            staged: toMap.staged
        };
    }
    mapFileStatus(toMap) {
        switch (toMap) {
            case status_2.AppFileStatus.Conflicted: return common_1.GitFileStatus.Conflicted;
            case status_2.AppFileStatus.Copied: return common_1.GitFileStatus.Copied;
            case status_2.AppFileStatus.Deleted: return common_1.GitFileStatus.Deleted;
            case status_2.AppFileStatus.Modified: return common_1.GitFileStatus.Modified;
            case status_2.AppFileStatus.New: return common_1.GitFileStatus.New;
            case status_2.AppFileStatus.Renamed: return common_1.GitFileStatus.Renamed;
            default: throw new Error(`Unexpected application file status: ${toMap}`);
        }
    }
    mapRange(toMap) {
        let range = 'HEAD';
        if (toMap) {
            if (typeof toMap.fromRevision === 'number') {
                const toRevision = toMap.toRevision || 'HEAD';
                range = `${toRevision}~${toMap.fromRevision}..${toRevision}`;
            }
            else if (typeof toMap.fromRevision === 'string') {
                range = `${toMap.fromRevision}${toMap.toRevision ? '..' + toMap.toRevision : ''}`;
            }
            else if (toMap.toRevision) {
                range = toMap.toRevision;
            }
        }
        return range;
    }
    getFsPath(repository) {
        const uri = typeof repository === 'string' ? repository : repository.localUri;
        return file_uri_1.FileUri.fsPath(uri);
    }
    getUri(path) {
        return file_uri_1.FileUri.create(path).toString();
    }
    fail(repository, message) {
        const p = typeof repository === 'string' ? repository : repository.localUri;
        const m = message ? `${message} ` : '';
        throw new Error(`${m}[${p}]`);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], DugiteGit.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(git_locator_protocol_1.GitLocator),
    __metadata("design:type", Object)
], DugiteGit.prototype, "locator", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_manager_1.GitRepositoryManager),
    __metadata("design:type", git_repository_manager_1.GitRepositoryManager)
], DugiteGit.prototype, "manager", void 0);
__decorate([
    (0, inversify_1.inject)(NameStatusParser),
    __metadata("design:type", NameStatusParser)
], DugiteGit.prototype, "nameStatusParser", void 0);
__decorate([
    (0, inversify_1.inject)(CommitDetailsParser),
    __metadata("design:type", CommitDetailsParser)
], DugiteGit.prototype, "commitDetailsParser", void 0);
__decorate([
    (0, inversify_1.inject)(GitBlameParser),
    __metadata("design:type", GitBlameParser)
], DugiteGit.prototype, "blameParser", void 0);
__decorate([
    (0, inversify_1.inject)(git_exec_provider_1.GitExecProvider),
    __metadata("design:type", git_exec_provider_1.GitExecProvider)
], DugiteGit.prototype, "execProvider", void 0);
__decorate([
    (0, inversify_1.inject)(git_env_provider_1.GitEnvProvider),
    __metadata("design:type", Object)
], DugiteGit.prototype, "envProvider", void 0);
__decorate([
    (0, inversify_1.inject)(git_init_1.GitInit),
    __metadata("design:type", Object)
], DugiteGit.prototype, "gitInit", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DugiteGit.prototype, "init", null);
DugiteGit = __decorate([
    (0, inversify_1.injectable)()
], DugiteGit);
exports.DugiteGit = DugiteGit;
//# sourceMappingURL=dugite-git.js.map