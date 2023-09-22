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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirtyDiffModel = exports.DirtyDiffManager = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/editor/lib/browser");
const uri_1 = require("@theia/core/lib/common/uri");
const core_1 = require("@theia/core");
const content_lines_1 = require("@theia/scm/lib/browser/dirty-diff/content-lines");
const diff_computer_1 = require("@theia/scm/lib/browser/dirty-diff/diff-computer");
const git_preferences_1 = require("../git-preferences");
const git_resource_1 = require("../git-resource");
const git_resource_resolver_1 = require("../git-resource-resolver");
const common_1 = require("../../common");
const git_repository_tracker_1 = require("../git-repository-tracker");
const throttle = require("@theia/core/shared/lodash.throttle");
let DirtyDiffManager = class DirtyDiffManager {
    constructor() {
        this.models = new Map();
        this.onDirtyDiffUpdateEmitter = new core_1.Emitter();
        this.onDirtyDiffUpdate = this.onDirtyDiffUpdateEmitter.event;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.editorManager.onCreated(async (e) => this.handleEditorCreated(e));
        this.repositoryTracker.onGitEvent(throttle(async (event) => this.handleGitStatusUpdate(event && event.source, event && event.status), 500));
        const gitStatus = this.repositoryTracker.selectedRepositoryStatus;
        const repository = this.repositoryTracker.selectedRepository;
        if (gitStatus && repository) {
            await this.handleGitStatusUpdate(repository, gitStatus);
        }
    }
    async handleEditorCreated(editorWidget) {
        const editor = editorWidget.editor;
        const uri = editor.uri.toString();
        if (editor.uri.scheme !== 'file') {
            return;
        }
        const toDispose = new core_1.DisposableCollection();
        const model = this.createNewModel(editor);
        toDispose.push(model);
        this.models.set(uri, model);
        toDispose.push(editor.onDocumentContentChanged(throttle((event) => model.handleDocumentChanged(event.document), 1000)));
        editorWidget.disposed.connect(() => {
            this.models.delete(uri);
            toDispose.dispose();
        });
        const gitStatus = this.repositoryTracker.selectedRepositoryStatus;
        const repository = this.repositoryTracker.selectedRepository;
        if (gitStatus && repository) {
            const changes = gitStatus.changes.filter(c => c.uri === uri);
            await model.handleGitStatusUpdate(repository, changes);
        }
        model.handleDocumentChanged(editor.document);
    }
    createNewModel(editor) {
        const previousRevision = this.createPreviousFileRevision(editor.uri);
        const model = new DirtyDiffModel(editor, this.preferences, previousRevision);
        model.onDirtyDiffUpdate(e => this.onDirtyDiffUpdateEmitter.fire(e));
        return model;
    }
    createPreviousFileRevision(fileUri) {
        return {
            fileUri,
            getContents: async (staged) => {
                const query = staged ? '' : 'HEAD';
                const uri = fileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery(query);
                const gitResource = await this.gitResourceResolver.getResource(uri);
                return gitResource.readContents();
            },
            isVersionControlled: async () => {
                const repository = this.repositoryTracker.selectedRepository;
                if (repository) {
                    return this.git.lsFiles(repository, fileUri.toString(), { errorUnmatch: true });
                }
                return false;
            }
        };
    }
    async handleGitStatusUpdate(repository, status) {
        const uris = new Set(this.models.keys());
        const relevantChanges = status ? status.changes.filter(c => uris.has(c.uri)) : [];
        for (const model of this.models.values()) {
            const uri = model.editor.uri.toString();
            const changes = relevantChanges.filter(c => c.uri === uri);
            await model.handleGitStatusUpdate(repository, changes);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], DirtyDiffManager.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], DirtyDiffManager.prototype, "repositoryTracker", void 0);
__decorate([
    (0, inversify_1.inject)(git_resource_resolver_1.GitResourceResolver),
    __metadata("design:type", git_resource_resolver_1.GitResourceResolver)
], DirtyDiffManager.prototype, "gitResourceResolver", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], DirtyDiffManager.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(git_preferences_1.GitPreferences),
    __metadata("design:type", Object)
], DirtyDiffManager.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DirtyDiffManager.prototype, "init", null);
DirtyDiffManager = __decorate([
    (0, inversify_1.injectable)()
], DirtyDiffManager);
exports.DirtyDiffManager = DirtyDiffManager;
class DirtyDiffModel {
    constructor(editor, preferences, previousRevision) {
        this.editor = editor;
        this.preferences = preferences;
        this.previousRevision = previousRevision;
        this.toDispose = new core_1.DisposableCollection();
        this.enabled = true;
        this.onDirtyDiffUpdateEmitter = new core_1.Emitter();
        this.onDirtyDiffUpdate = this.onDirtyDiffUpdateEmitter.event;
        this.toDispose.push(this.preferences.onPreferenceChanged(e => this.handlePreferenceChange(e)));
    }
    async handlePreferenceChange(event) {
        const { preferenceName, newValue } = event;
        if (preferenceName === 'git.editor.decorations.enabled') {
            const enabled = !!newValue;
            this.enabled = enabled;
            this.update();
        }
        if (preferenceName === 'git.editor.dirtyDiff.linesLimit') {
            this.update();
        }
    }
    get linesLimit() {
        const limit = this.preferences['git.editor.dirtyDiff.linesLimit'];
        return limit > 0 ? limit : Number.MAX_SAFE_INTEGER;
    }
    shouldRender() {
        if (!this.enabled || !this.previousContent || !this.currentContent) {
            return false;
        }
        const limit = this.linesLimit;
        return this.previousContent.length < limit && this.currentContent.length < limit;
    }
    update() {
        const editor = this.editor;
        if (!this.shouldRender()) {
            this.onDirtyDiffUpdateEmitter.fire({ editor, added: [], removed: [], modified: [] });
            return;
        }
        if (this.updateTimeout) {
            window.clearTimeout(this.updateTimeout);
        }
        this.updateTimeout = window.setTimeout(() => {
            const previous = this.previousContent;
            const current = this.currentContent;
            if (!previous || !current) {
                return;
            }
            this.updateTimeout = undefined;
            const dirtyDiff = DirtyDiffModel.computeDirtyDiff(previous, current);
            if (!dirtyDiff) {
                // if the computation fails, it might be because of changes in the editor, in that case
                // a new update task should be scheduled anyway.
                return;
            }
            const dirtyDiffUpdate = { editor, ...dirtyDiff };
            this.onDirtyDiffUpdateEmitter.fire(dirtyDiffUpdate);
        }, 100);
    }
    handleDocumentChanged(document) {
        if (this.toDispose.disposed) {
            return;
        }
        this.currentContent = DirtyDiffModel.documentContentLines(document);
        this.update();
    }
    async handleGitStatusUpdate(repository, relevantChanges) {
        const noRelevantChanges = relevantChanges.length === 0;
        const isNewAndStaged = relevantChanges.some(c => c.status === common_1.GitFileStatus.New && !!c.staged);
        const isNewAndUnstaged = relevantChanges.some(c => c.status === common_1.GitFileStatus.New && !c.staged);
        const modifiedChange = relevantChanges.find(c => c.status === common_1.GitFileStatus.Modified);
        const isModified = !!modifiedChange;
        const readPreviousRevisionContent = async () => {
            try {
                this.previousContent = await this.getPreviousRevisionContent();
            }
            catch {
                this.previousContent = undefined;
            }
        };
        if (isModified || isNewAndStaged) {
            this.staged = isNewAndStaged || modifiedChange.staged || false;
            await readPreviousRevisionContent();
        }
        if (isNewAndUnstaged && !isNewAndStaged) {
            this.previousContent = undefined;
        }
        if (noRelevantChanges) {
            const inGitRepository = await this.isInGitRepository(repository);
            if (inGitRepository) {
                await readPreviousRevisionContent();
            }
        }
        this.update();
    }
    async isInGitRepository(repository) {
        if (!repository) {
            return false;
        }
        const modelUri = this.editor.uri.withScheme('file').toString();
        const repoUri = new uri_1.default(repository.localUri).withScheme('file').toString();
        return modelUri.startsWith(repoUri) && this.previousRevision.isVersionControlled();
    }
    async getPreviousRevisionContent() {
        const contents = await this.previousRevision.getContents(this.staged);
        return contents ? content_lines_1.ContentLines.fromString(contents) : undefined;
    }
    dispose() {
        this.toDispose.dispose();
        this.onDirtyDiffUpdateEmitter.dispose();
    }
}
exports.DirtyDiffModel = DirtyDiffModel;
(function (DirtyDiffModel) {
    const diffComputer = new diff_computer_1.DiffComputer();
    /**
     * Returns an eventually consistent result. E.g. it can happen, that lines are deleted during the computation,
     * which will internally produce 'line out of bound' errors, then it will return `undefined`.
     *
     * `ContentLines` are to avoid copying contents which improves the performance, therefore handling of the `undefined`
     * result, and rescheduling of the computation should be done by caller.
     */
    function computeDirtyDiff(previous, current) {
        try {
            return diffComputer.computeDirtyDiff(content_lines_1.ContentLines.arrayLike(previous), content_lines_1.ContentLines.arrayLike(current));
        }
        catch {
            return undefined;
        }
    }
    DirtyDiffModel.computeDirtyDiff = computeDirtyDiff;
    function documentContentLines(document) {
        return {
            length: document.lineCount,
            getLineContent: line => document.getLineContent(line + 1),
        };
    }
    DirtyDiffModel.documentContentLines = documentContentLines;
})(DirtyDiffModel = exports.DirtyDiffModel || (exports.DirtyDiffModel = {}));
//# sourceMappingURL=dirty-diff-manager.js.map