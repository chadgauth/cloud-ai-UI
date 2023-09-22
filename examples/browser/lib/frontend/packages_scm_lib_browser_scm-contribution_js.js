"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_scm_lib_browser_scm-contribution_js"],{

/***/ "../../packages/scm/lib/browser/decorations/scm-decorations-service.js":
/*!*****************************************************************************!*\
  !*** ../../packages/scm/lib/browser/decorations/scm-decorations-service.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmDecorationsService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const dirty_diff_decorator_1 = __webpack_require__(/*! ../dirty-diff/dirty-diff-decorator */ "../../packages/scm/lib/browser/dirty-diff/dirty-diff-decorator.js");
const diff_computer_1 = __webpack_require__(/*! ../dirty-diff/diff-computer */ "../../packages/scm/lib/browser/dirty-diff/diff-computer.js");
const content_lines_1 = __webpack_require__(/*! ../dirty-diff/content-lines */ "../../packages/scm/lib/browser/dirty-diff/content-lines.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const scm_service_1 = __webpack_require__(/*! ../scm-service */ "../../packages/scm/lib/browser/scm-service.js");
let ScmDecorationsService = class ScmDecorationsService {
    constructor(decorator, scmService, editorManager, resourceProvider) {
        this.decorator = decorator;
        this.scmService = scmService;
        this.editorManager = editorManager;
        this.resourceProvider = resourceProvider;
        this.dirtyState = true;
        this.diffComputer = new diff_computer_1.DiffComputer();
        this.editorManager.onCreated(async (editor) => this.applyEditorDecorations(editor.editor));
        this.scmService.onDidAddRepository(repository => repository.provider.onDidChange(() => {
            const editor = this.editorManager.currentEditor;
            if (editor) {
                if (this.dirtyState) {
                    this.applyEditorDecorations(editor.editor);
                    this.dirtyState = false;
                }
                else {
                    /** onDidChange event might be called several times one after another, so need to prevent repeated events. */
                    setTimeout(() => {
                        this.dirtyState = true;
                    }, 500);
                }
            }
        }));
        this.scmService.onDidChangeSelectedRepository(() => {
            const editor = this.editorManager.currentEditor;
            if (editor) {
                this.applyEditorDecorations(editor.editor);
            }
        });
    }
    async applyEditorDecorations(editor) {
        const currentRepo = this.scmService.selectedRepository;
        if (currentRepo) {
            try {
                const uri = editor.uri.withScheme(currentRepo.provider.id).withQuery(`{"ref":"", "path":"${editor.uri.path.toString()}"}`);
                const previousResource = await this.resourceProvider(uri);
                const previousContent = await previousResource.readContents();
                const previousLines = content_lines_1.ContentLines.fromString(previousContent);
                const currentResource = await this.resourceProvider(editor.uri);
                const currentContent = await currentResource.readContents();
                const currentLines = content_lines_1.ContentLines.fromString(currentContent);
                const { added, removed, modified } = this.diffComputer.computeDirtyDiff(content_lines_1.ContentLines.arrayLike(previousLines), content_lines_1.ContentLines.arrayLike(currentLines));
                this.decorator.applyDecorations({ editor: editor, added, removed, modified });
                currentResource.dispose();
                previousResource.dispose();
            }
            catch (e) {
                // Scm resource may not be found, do nothing.
            }
        }
    }
};
ScmDecorationsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(dirty_diff_decorator_1.DirtyDiffDecorator)),
    __param(1, (0, inversify_1.inject)(scm_service_1.ScmService)),
    __param(2, (0, inversify_1.inject)(browser_1.EditorManager)),
    __param(3, (0, inversify_1.inject)(core_1.ResourceProvider)),
    __metadata("design:paramtypes", [dirty_diff_decorator_1.DirtyDiffDecorator,
        scm_service_1.ScmService,
        browser_1.EditorManager, Function])
], ScmDecorationsService);
exports.ScmDecorationsService = ScmDecorationsService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/decorations/scm-decorations-service'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/dirty-diff/content-lines.js":
/*!******************************************************************!*\
  !*** ../../packages/scm/lib/browser/dirty-diff/content-lines.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContentLines = void 0;
var ContentLines;
(function (ContentLines) {
    const NL = '\n'.charCodeAt(0);
    const CR = '\r'.charCodeAt(0);
    function fromString(content) {
        const computeLineStarts = s => {
            const result = [0];
            for (let i = 0; i < s.length; i++) {
                const chr = s.charCodeAt(i);
                if (chr === CR) {
                    if (i + 1 < s.length && s.charCodeAt(i + 1) === NL) {
                        result[result.length] = i + 2;
                        i++;
                    }
                    else {
                        result[result.length] = i + 1;
                    }
                }
                else if (chr === NL) {
                    result[result.length] = i + 1;
                }
            }
            return result;
        };
        const lineStarts = computeLineStarts(content);
        return {
            length: lineStarts.length,
            getLineContent: line => {
                if (line >= lineStarts.length) {
                    throw new Error('line index out of bounds');
                }
                const start = lineStarts[line];
                let end = (line === lineStarts.length - 1) ? undefined : lineStarts[line + 1] - 1;
                if (!!end && content.charCodeAt(end - 1) === CR) {
                    end--; // ignore CR at the end
                }
                const lineContent = content.substring(start, end);
                return lineContent;
            }
        };
    }
    ContentLines.fromString = fromString;
    function arrayLike(lines) {
        return new Proxy(lines, getProxyHandler());
    }
    ContentLines.arrayLike = arrayLike;
    function getProxyHandler() {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            get(target, p) {
                switch (p) {
                    case 'prototype':
                        return undefined;
                    case 'length':
                        return target.length;
                    case 'slice':
                        return (start, end) => {
                            if (start !== undefined) {
                                return [start, (end !== undefined ? end - 1 : target.length - 1)];
                            }
                            return [0, target.length - 1];
                        };
                    case Symbol.iterator:
                        return function* () {
                            for (let i = 0; i < target.length; i++) {
                                yield target.getLineContent(i);
                            }
                        };
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const index = Number.parseInt(p);
                if (Number.isInteger(index)) {
                    if (index >= 0 && index < target.length) {
                        const value = target.getLineContent(index);
                        if (value === undefined) {
                            console.log(target);
                        }
                        return value;
                    }
                    else {
                        return undefined;
                    }
                }
                throw new Error(`get ${String(p)} not implemented`);
            }
        };
    }
})(ContentLines = exports.ContentLines || (exports.ContentLines = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/dirty-diff/content-lines'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/dirty-diff/diff-computer.js":
/*!******************************************************************!*\
  !*** ../../packages/scm/lib/browser/dirty-diff/diff-computer.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiffComputer = void 0;
const jsdiff = __webpack_require__(/*! diff */ "../../node_modules/diff/dist/diff.js");
class DiffComputer {
    computeDiff(previous, current) {
        const diffResult = diffArrays(previous, current);
        return diffResult;
    }
    computeDirtyDiff(previous, current) {
        const added = [];
        const removed = [];
        const modified = [];
        const changes = this.computeDiff(previous, current);
        let lastLine = -1;
        for (let i = 0; i < changes.length; i++) {
            const change = changes[i];
            const next = changes[i + 1];
            if (change.added) {
                // case: addition
                const start = lastLine + 1;
                const end = lastLine + change.count;
                added.push({ start, end });
                lastLine = end;
            }
            else if (change.removed && next && next.added) {
                const isFirstChange = i === 0;
                const isLastChange = i === changes.length - 2;
                const isNextEmptyLine = next.value.length > 0 && current[next.value[0]].length === 0;
                const isPrevEmptyLine = change.value.length > 0 && previous[change.value[0]].length === 0;
                if (isFirstChange && isNextEmptyLine) {
                    // special case: removing at the beginning
                    removed.push(0);
                }
                else if (isFirstChange && isPrevEmptyLine) {
                    // special case: adding at the beginning
                    const start = 0;
                    const end = next.count - 1;
                    added.push({ start, end });
                    lastLine = end;
                }
                else if (isLastChange && isNextEmptyLine) {
                    removed.push(lastLine + 1 /* = empty line */);
                }
                else {
                    // default case is a modification
                    const start = lastLine + 1;
                    const end = lastLine + next.count;
                    modified.push({ start, end });
                    lastLine = end;
                }
                i++; // consume next eagerly
            }
            else if (change.removed && !(next && next.added)) {
                removed.push(Math.max(0, lastLine));
            }
            else {
                lastLine += change.count;
            }
        }
        return { added, removed, modified };
    }
}
exports.DiffComputer = DiffComputer;
class ArrayDiff extends jsdiff.Diff {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokenize(value) {
        return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    join(value) {
        return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeEmpty(value) {
        return value;
    }
}
const arrayDiff = new ArrayDiff();
/**
 * Computes diff without copying data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function diffArrays(oldArr, newArr) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return arrayDiff.diff(oldArr, newArr);
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/dirty-diff/diff-computer'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/dirty-diff/dirty-diff-decorator.js":
/*!*************************************************************************!*\
  !*** ../../packages/scm/lib/browser/dirty-diff/dirty-diff-decorator.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DirtyDiffDecorator = exports.DirtyDiffDecorationType = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
var DirtyDiffDecorationType;
(function (DirtyDiffDecorationType) {
    DirtyDiffDecorationType["AddedLine"] = "dirty-diff-added-line";
    DirtyDiffDecorationType["RemovedLine"] = "dirty-diff-removed-line";
    DirtyDiffDecorationType["ModifiedLine"] = "dirty-diff-modified-line";
})(DirtyDiffDecorationType = exports.DirtyDiffDecorationType || (exports.DirtyDiffDecorationType = {}));
const AddedLineDecoration = {
    linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-added-line',
    overviewRuler: {
        color: {
            id: 'editorOverviewRuler.addedForeground'
        },
        position: browser_1.OverviewRulerLane.Left,
    },
    minimap: {
        color: {
            id: 'minimapGutter.addedBackground'
        },
        position: browser_1.MinimapPosition.Gutter
    },
    isWholeLine: true
};
const RemovedLineDecoration = {
    linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-removed-line',
    overviewRuler: {
        color: {
            id: 'editorOverviewRuler.deletedForeground'
        },
        position: browser_1.OverviewRulerLane.Left,
    },
    minimap: {
        color: {
            id: 'minimapGutter.deletedBackground'
        },
        position: browser_1.MinimapPosition.Gutter
    },
    isWholeLine: false
};
const ModifiedLineDecoration = {
    linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-modified-line',
    overviewRuler: {
        color: {
            id: 'editorOverviewRuler.modifiedForeground'
        },
        position: browser_1.OverviewRulerLane.Left,
    },
    minimap: {
        color: {
            id: 'minimapGutter.modifiedBackground'
        },
        position: browser_1.MinimapPosition.Gutter
    },
    isWholeLine: true
};
let DirtyDiffDecorator = class DirtyDiffDecorator extends browser_1.EditorDecorator {
    applyDecorations(update) {
        const modifications = update.modified.map(range => this.toDeltaDecoration(range, ModifiedLineDecoration));
        const additions = update.added.map(range => this.toDeltaDecoration(range, AddedLineDecoration));
        const removals = update.removed.map(line => this.toDeltaDecoration(line, RemovedLineDecoration));
        const decorations = [...modifications, ...additions, ...removals];
        this.setDecorations(update.editor, decorations);
    }
    toDeltaDecoration(from, options) {
        const [start, end] = (typeof from === 'number') ? [from, from] : [from.start, from.end];
        const range = browser_1.Range.create(browser_1.Position.create(start, 0), browser_1.Position.create(end, 0));
        return { range, options };
    }
};
DirtyDiffDecorator = __decorate([
    (0, inversify_1.injectable)()
], DirtyDiffDecorator);
exports.DirtyDiffDecorator = DirtyDiffDecorator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/dirty-diff/dirty-diff-decorator'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-amend-component.js":
/*!*************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-amend-component.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Arm and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmAmendComponent = void 0;
__webpack_require__(/*! ../../src/browser/style/scm-amend-component.css */ "../../packages/scm/src/browser/style/scm-amend-component.css");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const TRANSITION_TIME_MS = 300;
const REPOSITORY_STORAGE_KEY = 'scmRepository';
class ScmAmendComponent extends React.Component {
    constructor(props) {
        super(props);
        /**
         * a hint on how to animate an update, set by certain user action handlers
         * and used when updating the view based on a repository change
         */
        this.transitionHint = 'none';
        this.lastCommitHeight = 0;
        this.lastCommitScrollRef = (instance) => {
            if (instance && this.lastCommitHeight === 0) {
                this.lastCommitHeight = instance.getBoundingClientRect().height;
            }
        };
        this.toDisposeOnUnmount = new core_1.DisposableCollection();
        /**
         * This function will update the 'model' (lastCommit, amendingCommits) only
         * when the repository sees the last commit change.
         * 'render' can be called at any time, so be sure we don't update any 'model'
         * fields until we actually start the transition.
         */
        this.amend = async () => {
            if (this.state.transition.state !== 'none' && this.transitionHint !== 'none') {
                return;
            }
            this.transitionHint = 'amend';
            await this.resetAndSetMessage('HEAD~', 'HEAD');
        };
        this.unamend = async () => {
            if (this.state.transition.state !== 'none' && this.transitionHint !== 'none') {
                return;
            }
            const commitToRestore = (this.state.amendingCommits.length >= 1)
                ? this.state.amendingCommits[this.state.amendingCommits.length - 1]
                : undefined;
            const oldestAmendCommit = (this.state.amendingCommits.length >= 2)
                ? this.state.amendingCommits[this.state.amendingCommits.length - 2]
                : undefined;
            if (commitToRestore) {
                const commitToUseForMessage = oldestAmendCommit
                    ? oldestAmendCommit.commit.id
                    : undefined;
                this.transitionHint = 'unamend';
                await this.resetAndSetMessage(commitToRestore.commit.id, commitToUseForMessage);
            }
        };
        this.unamendAll = () => this.doUnamendAll();
        this.clearAmending = () => this.doClearAmending();
        this.state = {
            transition: { state: 'none' },
            amendingCommits: [],
            lastCommit: undefined
        };
        const setState = this.setState.bind(this);
        this.setState = newState => {
            if (!this.toDisposeOnUnmount.disposed) {
                setState(newState);
            }
        };
    }
    async componentDidMount() {
        this.toDisposeOnUnmount.push(core_1.Disposable.create(() => { }));
        const lastCommit = await this.getLastCommit();
        this.setState({ amendingCommits: await this.buildAmendingList(lastCommit ? lastCommit.commit : undefined), lastCommit });
        if (this.toDisposeOnUnmount.disposed) {
            return;
        }
        this.toDisposeOnUnmount.push(this.props.repository.provider.onDidChange(() => this.fetchStatusAndSetState()));
    }
    componentWillUnmount() {
        this.toDisposeOnUnmount.dispose();
    }
    async fetchStatusAndSetState() {
        const storageKey = this.getStorageKey();
        const nextCommit = await this.getLastCommit();
        if (nextCommit && this.state.lastCommit && nextCommit.commit.id === this.state.lastCommit.commit.id) {
            // No change here
        }
        else if (nextCommit === undefined && this.state.lastCommit === undefined) {
            // No change here
        }
        else if (this.transitionHint === 'none') {
            // If the 'last' commit changes, but we are not expecting an 'amend'
            // or 'unamend' to occur, then we clear out the list of amended commits.
            // This is because an unexpected change has happened to the repository,
            // perhaps the user committed, merged, or something.  The amended commits
            // will no longer be valid.
            // Note that there may or may not have been a previous lastCommit (if the
            // repository was previously empty with no initial commit then lastCommit
            // will be undefined).  Either way we clear the amending commits.
            await this.clearAmendingCommits();
            // There is a change to the last commit, but no transition hint so
            // the view just updates without transition.
            this.setState({ amendingCommits: [], lastCommit: nextCommit });
        }
        else {
            const amendingCommits = this.state.amendingCommits.concat([]); // copy the array
            const direction = this.transitionHint === 'amend' ? 'up' : 'down';
            switch (this.transitionHint) {
                case 'amend':
                    if (this.state.lastCommit) {
                        amendingCommits.push(this.state.lastCommit);
                        const serializedState = JSON.stringify({
                            amendingHeadCommitSha: amendingCommits[0].commit.id,
                            latestCommitSha: nextCommit ? nextCommit.commit.id : undefined
                        });
                        this.props.storageService.setData(storageKey, serializedState);
                    }
                    break;
                case 'unamend':
                    amendingCommits.pop();
                    if (amendingCommits.length === 0) {
                        this.props.storageService.setData(storageKey, undefined);
                    }
                    else {
                        const serializedState = JSON.stringify({
                            amendingHeadCommitSha: amendingCommits[0].commit.id,
                            latestCommitSha: nextCommit ? nextCommit.commit.id : undefined
                        });
                        this.props.storageService.setData(storageKey, serializedState);
                    }
                    break;
            }
            if (this.state.lastCommit && nextCommit) {
                const transitionData = { direction, previousLastCommit: this.state.lastCommit };
                this.setState({ lastCommit: nextCommit, amendingCommits, transition: { ...transitionData, state: 'start' } });
                this.onNextFrame(() => {
                    this.setState({ transition: { ...transitionData, state: 'transitioning' } });
                });
                setTimeout(() => {
                    this.setState({ transition: { state: 'none' } });
                }, TRANSITION_TIME_MS);
            }
            else {
                // No previous last commit so no transition
                this.setState({ transition: { state: 'none' }, amendingCommits, lastCommit: nextCommit });
            }
        }
        this.transitionHint = 'none';
    }
    async clearAmendingCommits() {
        const storageKey = this.getStorageKey();
        await this.props.storageService.setData(storageKey, undefined);
    }
    async buildAmendingList(lastCommit) {
        const storageKey = this.getStorageKey();
        const storedState = await this.props.storageService.getData(storageKey, undefined);
        // Restore list of commits from saved amending head commit up through parents until the
        // current commit.  (If we don't reach the current commit, the repository has been changed in such
        // a way then unamending commits can no longer be done).
        if (storedState) {
            const { amendingHeadCommitSha, latestCommitSha } = JSON.parse(storedState);
            if (!this.commitsAreEqual(lastCommit, latestCommitSha)) {
                // The head commit in the repository has changed.  It is not the same commit that was the
                // head commit after the last 'amend'.
                return [];
            }
            const commits = await this.props.scmAmendSupport.getInitialAmendingCommits(amendingHeadCommitSha, lastCommit ? lastCommit.id : undefined);
            const amendingCommitPromises = commits.map(async (commit) => {
                const avatar = await this.props.avatarService.getAvatar(commit.authorEmail);
                return { commit, avatar };
            });
            return Promise.all(amendingCommitPromises);
        }
        else {
            return [];
        }
    }
    getStorageKey() {
        return REPOSITORY_STORAGE_KEY + ':' + this.props.repository.provider.rootUri;
    }
    /**
     * Commits are equal if the ids are equal or if both are undefined.
     * (If a commit is undefined, it represents the initial empty state of a repository,
     * before the initial commit).
     */
    commitsAreEqual(lastCommit, savedLastCommitId) {
        return lastCommit
            ? lastCommit.id === savedLastCommitId
            : savedLastCommitId === undefined;
    }
    async resetAndSetMessage(commitToRestore, commitToUseForMessage) {
        const message = commitToUseForMessage
            ? await this.props.scmAmendSupport.getMessage(commitToUseForMessage)
            : '';
        await this.props.scmAmendSupport.reset(commitToRestore);
        this.props.setCommitMessage(message);
    }
    render() {
        const neverShrink = this.state.amendingCommits.length <= 3;
        const style = neverShrink
            ? {
                ...this.props.style,
                flexShrink: 0,
            }
            : {
                ...this.props.style,
                flexShrink: 1,
                minHeight: 240 // height with three commits
            };
        return (React.createElement("div", { className: ScmAmendComponent.Styles.COMMIT_CONTAINER + ' no-select', style: style },
            this.state.amendingCommits.length > 0 || (this.state.lastCommit && this.state.transition.state !== 'none' && this.state.transition.direction === 'down')
                ? this.renderAmendingCommits()
                : '',
            this.state.lastCommit ?
                React.createElement("div", null,
                    React.createElement("div", { id: 'lastCommit', className: 'theia-scm-amend' },
                        React.createElement("div", { className: 'theia-header scm-theia-header' }, nls_1.nls.localize('theia/scm/amendHeadCommit', 'HEAD Commit')),
                        this.renderLastCommit()))
                : ''));
    }
    async getLastCommit() {
        const commit = await this.props.scmAmendSupport.getLastCommit();
        if (commit) {
            const avatar = await this.props.avatarService.getAvatar(commit.authorEmail);
            return { commit, avatar };
        }
        return undefined;
    }
    renderAmendingCommits() {
        const neverShrink = this.state.amendingCommits.length <= 3;
        const style = neverShrink
            ? {
                flexShrink: 0,
            }
            : {
                flexShrink: 1,
                // parent minHeight controls height, we just need any value smaller than
                // what the height would be when the parent is at its minHeight
                minHeight: 0
            };
        return React.createElement("div", { id: 'amendedCommits', className: 'theia-scm-amend-outer-container', style: style },
            React.createElement("div", { className: 'theia-header scm-theia-header' },
                React.createElement("div", { className: 'noWrapInfo' }, "Commits being Amended"),
                this.renderAmendCommitListButtons(),
                this.renderCommitCount(this.state.amendingCommits.length)),
            React.createElement("div", { style: this.styleAmendedCommits() },
                this.state.amendingCommits.map((commitData, index, array) => this.renderCommitBeingAmended(commitData, index === array.length - 1)),
                this.state.lastCommit && this.state.transition.state !== 'none' && this.state.transition.direction === 'down'
                    ? this.renderCommitBeingAmended(this.state.lastCommit, false)
                    : ''));
    }
    renderAmendCommitListButtons() {
        return React.createElement("div", { className: 'theia-scm-inline-actions-container' },
            React.createElement("div", { className: 'theia-scm-inline-actions' },
                React.createElement("div", { className: 'theia-scm-inline-action' },
                    React.createElement("a", { className: (0, browser_1.codicon)('dash'), title: 'Unamend All Commits', onClick: this.unamendAll })),
                React.createElement("div", { className: 'theia-scm-inline-action' },
                    React.createElement("a", { className: (0, browser_1.codicon)('close'), title: 'Clear Amending Commits', onClick: this.clearAmending }))));
    }
    renderLastCommit() {
        if (!this.state.lastCommit) {
            return '';
        }
        const canAmend = true;
        return React.createElement("div", { className: ScmAmendComponent.Styles.COMMIT_AND_BUTTON, style: { flexGrow: 0, flexShrink: 0 }, key: this.state.lastCommit.commit.id },
            this.renderLastCommitNoButton(this.state.lastCommit),
            canAmend
                ? React.createElement("div", { className: ScmAmendComponent.Styles.FLEX_CENTER },
                    React.createElement("button", { className: 'theia-button', title: nls_1.nls.localize('theia/scm/amendLastCommit', 'Amend last commit'), onClick: this.amend }, nls_1.nls.localize('theia/scm/amend', 'Amend')))
                : '');
    }
    renderLastCommitNoButton(lastCommit) {
        switch (this.state.transition.state) {
            case 'none':
                return React.createElement("div", { ref: this.lastCommitScrollRef, className: 'theia-scm-scrolling-container' }, this.renderCommitAvatarAndDetail(lastCommit));
            case 'start':
            case 'transitioning':
                switch (this.state.transition.direction) {
                    case 'up':
                        return React.createElement("div", { style: this.styleLastCommitMovingUp(this.state.transition.state) },
                            this.renderCommitAvatarAndDetail(this.state.transition.previousLastCommit),
                            this.renderCommitAvatarAndDetail(lastCommit));
                    case 'down':
                        return React.createElement("div", { style: this.styleLastCommitMovingDown(this.state.transition.state) },
                            this.renderCommitAvatarAndDetail(lastCommit),
                            this.renderCommitAvatarAndDetail(this.state.transition.previousLastCommit));
                }
        }
    }
    /**
     * See https://stackoverflow.com/questions/26556436/react-after-render-code
     *
     * @param callback
     */
    onNextFrame(callback) {
        setTimeout(() => window.requestAnimationFrame(callback), 0);
    }
    renderCommitAvatarAndDetail(commitData) {
        const { commit, avatar } = commitData;
        return React.createElement("div", { className: ScmAmendComponent.Styles.COMMIT_AVATAR_AND_TEXT, key: commit.id },
            React.createElement("div", { className: ScmAmendComponent.Styles.COMMIT_MESSAGE_AVATAR },
                React.createElement("img", { src: avatar })),
            React.createElement("div", { className: ScmAmendComponent.Styles.COMMIT_DETAILS },
                React.createElement("div", { className: ScmAmendComponent.Styles.COMMIT_MESSAGE_SUMMARY }, commit.summary),
                React.createElement("div", { className: ScmAmendComponent.Styles.LAST_COMMIT_MESSAGE_TIME }, `${commit.authorDateRelative} by ${commit.authorName}`)));
    }
    renderCommitCount(commits) {
        return React.createElement("div", { className: 'notification-count-container scm-change-count' },
            React.createElement("span", { className: 'notification-count' }, commits));
    }
    renderCommitBeingAmended(commitData, isOldestAmendCommit) {
        if (isOldestAmendCommit && this.state.transition.state !== 'none' && this.state.transition.direction === 'up') {
            return React.createElement("div", { className: ScmAmendComponent.Styles.COMMIT_AVATAR_AND_TEXT, style: { flexGrow: 0, flexShrink: 0 }, key: commitData.commit.id },
                React.createElement("div", { className: 'fixed-height-commit-container' }, this.renderCommitAvatarAndDetail(commitData)));
        }
        else {
            return React.createElement("div", { className: ScmAmendComponent.Styles.COMMIT_AVATAR_AND_TEXT, style: { flexGrow: 0, flexShrink: 0 }, key: commitData.commit.id },
                this.renderCommitAvatarAndDetail(commitData),
                isOldestAmendCommit
                    ? React.createElement("div", { className: ScmAmendComponent.Styles.FLEX_CENTER },
                        React.createElement("button", { className: 'theia-button', title: nls_1.nls.localize('theia/scm/unamendCommit', 'Unamend commit'), onClick: this.unamend }, nls_1.nls.localize('theia/scm/unamend', 'Unamend')))
                    : '');
        }
    }
    /*
     * The style for the <div> containing the list of commits being amended.
     * This div is scrollable.
     */
    styleAmendedCommits() {
        const base = {
            display: 'flex',
            whitespace: 'nowrap',
            width: '100%',
            minHeight: 0,
            flexShrink: 1,
            paddingTop: '2px',
        };
        switch (this.state.transition.state) {
            case 'none':
                return {
                    ...base,
                    flexDirection: 'column',
                    overflowY: 'auto',
                    marginBottom: '0',
                };
            case 'start':
            case 'transitioning':
                let startingMargin = 0;
                let endingMargin = 0;
                switch (this.state.transition.direction) {
                    case 'down':
                        startingMargin = 0;
                        endingMargin = -32;
                        break;
                    case 'up':
                        startingMargin = -32;
                        endingMargin = 0;
                        break;
                }
                switch (this.state.transition.state) {
                    case 'start':
                        return {
                            ...base,
                            flexDirection: 'column',
                            overflowY: 'hidden',
                            marginBottom: `${startingMargin}px`,
                        };
                    case 'transitioning':
                        return {
                            ...base,
                            flexDirection: 'column',
                            overflowY: 'hidden',
                            marginBottom: `${endingMargin}px`,
                            transitionProperty: 'margin-bottom',
                            transitionDuration: `${TRANSITION_TIME_MS}ms`,
                            transitionTimingFunction: 'linear'
                        };
                }
        }
    }
    styleLastCommitMovingUp(transitionState) {
        return this.styleLastCommit(transitionState, 0, -28);
    }
    styleLastCommitMovingDown(transitionState) {
        return this.styleLastCommit(transitionState, -28, 0);
    }
    styleLastCommit(transitionState, startingMarginTop, startingMarginBottom) {
        const base = {
            display: 'flex',
            width: '100%',
            overflow: 'hidden',
            paddingTop: 0,
            paddingBottom: 0,
            borderTop: 0,
            borderBottom: 0,
            height: this.lastCommitHeight * 2
        };
        // We end with top and bottom margins switched
        const endingMarginTop = startingMarginBottom;
        const endingMarginBottom = startingMarginTop;
        switch (transitionState) {
            case 'start':
                return {
                    ...base,
                    position: 'relative',
                    flexDirection: 'column',
                    marginTop: startingMarginTop,
                    marginBottom: startingMarginBottom,
                };
            case 'transitioning':
                return {
                    ...base,
                    position: 'relative',
                    flexDirection: 'column',
                    marginTop: endingMarginTop,
                    marginBottom: endingMarginBottom,
                    transitionProperty: 'margin-top margin-bottom',
                    transitionDuration: `${TRANSITION_TIME_MS}ms`,
                    transitionTimingFunction: 'linear'
                };
        }
    }
    async doUnamendAll() {
        while (this.state.amendingCommits.length > 0) {
            this.unamend();
            await new Promise(resolve => setTimeout(resolve, TRANSITION_TIME_MS));
        }
    }
    async doClearAmending() {
        await this.clearAmendingCommits();
        this.setState({ amendingCommits: [] });
    }
}
exports.ScmAmendComponent = ScmAmendComponent;
(function (ScmAmendComponent) {
    let Styles;
    (function (Styles) {
        Styles.COMMIT_CONTAINER = 'theia-scm-commit-container';
        Styles.COMMIT_AND_BUTTON = 'theia-scm-commit-and-button';
        Styles.COMMIT_AVATAR_AND_TEXT = 'theia-scm-commit-avatar-and-text';
        Styles.COMMIT_DETAILS = 'theia-scm-commit-details';
        Styles.COMMIT_MESSAGE_AVATAR = 'theia-scm-commit-message-avatar';
        Styles.COMMIT_MESSAGE_SUMMARY = 'theia-scm-commit-message-summary';
        Styles.LAST_COMMIT_MESSAGE_TIME = 'theia-scm-commit-message-time';
        Styles.FLEX_CENTER = 'theia-scm-flex-container-center';
    })(Styles = ScmAmendComponent.Styles || (ScmAmendComponent.Styles = {}));
})(ScmAmendComponent = exports.ScmAmendComponent || (exports.ScmAmendComponent = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-amend-component'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-amend-widget.js":
/*!**********************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-amend-widget.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 Arm and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ScmAmendWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmAmendWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const scm_service_1 = __webpack_require__(/*! ./scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const scm_avatar_service_1 = __webpack_require__(/*! ./scm-avatar-service */ "../../packages/scm/lib/browser/scm-avatar-service.js");
const scm_amend_component_1 = __webpack_require__(/*! ./scm-amend-component */ "../../packages/scm/lib/browser/scm-amend-component.js");
let ScmAmendWidget = ScmAmendWidget_1 = class ScmAmendWidget extends browser_1.ReactWidget {
    constructor(contextMenuRenderer) {
        super();
        this.contextMenuRenderer = contextMenuRenderer;
        this.shouldScrollToRow = true;
        this.setInputValue = (event) => {
            const repository = this.scmService.selectedRepository;
            if (repository) {
                repository.input.value = typeof event === 'string' ? event : event.currentTarget.value;
            }
        };
        this.scrollOptions = {
            suppressScrollX: true,
            minScrollbarLength: 35
        };
        this.id = ScmAmendWidget_1.ID;
    }
    render() {
        const repository = this.scmService.selectedRepository;
        if (repository && repository.provider.amendSupport) {
            return React.createElement(scm_amend_component_1.ScmAmendComponent, {
                key: `amend:${repository.provider.rootUri}`,
                style: { flexGrow: 0 },
                repository: repository,
                scmAmendSupport: repository.provider.amendSupport,
                setCommitMessage: this.setInputValue,
                avatarService: this.avatarService,
                storageService: this.storageService,
            });
        }
    }
};
ScmAmendWidget.ID = 'scm-amend-widget';
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmAmendWidget.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(scm_avatar_service_1.ScmAvatarService),
    __metadata("design:type", scm_avatar_service_1.ScmAvatarService)
], ScmAmendWidget.prototype, "avatarService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], ScmAmendWidget.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], ScmAmendWidget.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], ScmAmendWidget.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], ScmAmendWidget.prototype, "keybindings", void 0);
ScmAmendWidget = ScmAmendWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [browser_1.ContextMenuRenderer])
], ScmAmendWidget);
exports.ScmAmendWidget = ScmAmendWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-amend-widget'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-commit-widget.js":
/*!***********************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-commit-widget.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ScmCommitWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmCommitWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const react_autosize_textarea_1 = __webpack_require__(/*! react-autosize-textarea */ "../../node_modules/react-autosize-textarea/lib/index.js");
const scm_input_1 = __webpack_require__(/*! ./scm-input */ "../../packages/scm/lib/browser/scm-input.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const scm_service_1 = __webpack_require__(/*! ./scm-service */ "../../packages/scm/lib/browser/scm-service.js");
let ScmCommitWidget = ScmCommitWidget_1 = class ScmCommitWidget extends browser_1.ReactWidget {
    constructor(contextMenuRenderer) {
        super();
        this.contextMenuRenderer = contextMenuRenderer;
        this.toDisposeOnRepositoryChange = new core_1.DisposableCollection();
        this.shouldScrollToRow = true;
        /**
         * Don't modify DOM use React! only exposed for `focusInput`
         * Use `this.scmService.selectedRepository?.input.value` as a single source of truth!
         */
        this.inputRef = React.createRef();
        this.setInputValue = (event) => {
            const repository = this.scmService.selectedRepository;
            if (repository) {
                repository.input.value = typeof event === 'string' ? event : event.currentTarget.value;
            }
        };
        this.scrollOptions = {
            suppressScrollX: true,
            minScrollbarLength: 35
        };
        this.addClass('theia-scm-commit');
        this.id = ScmCommitWidget_1.ID;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.refreshOnRepositoryChange();
        this.toDisposeOnDetach.push(this.scmService.onDidChangeSelectedRepository(() => {
            this.refreshOnRepositoryChange();
            this.update();
        }));
    }
    refreshOnRepositoryChange() {
        this.toDisposeOnRepositoryChange.dispose();
        const repository = this.scmService.selectedRepository;
        if (repository) {
            this.toDisposeOnRepositoryChange.push(repository.provider.onDidChange(async () => {
                this.update();
            }));
            this.toDisposeOnRepositoryChange.push(repository.provider.onDidChangeCommitTemplate(e => {
                this.setInputValue(e);
            }));
        }
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.focus();
    }
    focus() {
        (this.inputRef.current || this.node).focus();
    }
    render() {
        const repository = this.scmService.selectedRepository;
        if (repository) {
            return React.createElement('div', this.createContainerAttributes(), this.renderInput(repository.input));
        }
    }
    /**
     * Create the container attributes for the widget.
     */
    createContainerAttributes() {
        return {
            style: { flexGrow: 0 }
        };
    }
    renderInput(input) {
        let validationStatus = 'idle';
        if (input.issue) {
            switch (input.issue.type) {
                case scm_input_1.ScmInputIssueType.Error:
                    validationStatus = 'error';
                    break;
                case scm_input_1.ScmInputIssueType.Information:
                    validationStatus = 'info';
                    break;
                case scm_input_1.ScmInputIssueType.Warning:
                    validationStatus = 'warning';
                    break;
            }
        }
        const validationMessage = input.issue ? input.issue.message : '';
        const format = (value, ...args) => {
            if (args.length !== 0) {
                return value.replace(/{(\d+)}/g, (found, n) => {
                    const i = parseInt(n);
                    return isNaN(i) || i < 0 || i >= args.length ? found : args[i];
                });
            }
            return value;
        };
        const keybinding = this.keybindings.acceleratorFor(this.keybindings.getKeybindingsForCommand('scm.acceptInput')[0]).join('+');
        const message = format(input.placeholder || '', keybinding);
        const textArea = input.visible &&
            React.createElement(react_autosize_textarea_1.default, { className: `${ScmCommitWidget_1.Styles.INPUT_MESSAGE} theia-input theia-scm-input-message-${validationStatus}`, id: ScmCommitWidget_1.Styles.INPUT_MESSAGE, placeholder: message, spellCheck: false, autoFocus: true, value: input.value, disabled: !input.enabled, onChange: this.setInputValue, ref: this.inputRef, rows: 1, maxRows: 6 });
        return React.createElement("div", { className: ScmCommitWidget_1.Styles.INPUT_MESSAGE_CONTAINER },
            textArea,
            React.createElement("div", { className: `${ScmCommitWidget_1.Styles.VALIDATION_MESSAGE} ${ScmCommitWidget_1.Styles.NO_SELECT}
                    theia-scm-validation-message-${validationStatus} theia-scm-input-message-${validationStatus}`, style: {
                    display: !!input.issue ? 'block' : 'none'
                } }, validationMessage));
    }
    /**
     * Store the tree state.
     */
    storeState() {
        var _a;
        const message = (_a = this.scmService.selectedRepository) === null || _a === void 0 ? void 0 : _a.input.value;
        return { message };
    }
    /**
     * Restore the state.
     * @param oldState the old state object.
     */
    restoreState(oldState) {
        const value = oldState.message;
        if (!value) {
            return;
        }
        let repository = this.scmService.selectedRepository;
        if (repository) {
            repository.input.value = value;
        }
        else {
            const listener = this.scmService.onDidChangeSelectedRepository(() => {
                repository = this.scmService.selectedRepository;
                if (repository) {
                    listener.dispose();
                    if (!repository.input.value) {
                        repository.input.value = value;
                    }
                }
            });
            this.toDispose.push(listener);
        }
    }
};
ScmCommitWidget.ID = 'scm-commit-widget';
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmCommitWidget.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], ScmCommitWidget.prototype, "keybindings", void 0);
ScmCommitWidget = ScmCommitWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [browser_1.ContextMenuRenderer])
], ScmCommitWidget);
exports.ScmCommitWidget = ScmCommitWidget;
(function (ScmCommitWidget) {
    let Styles;
    (function (Styles) {
        Styles.INPUT_MESSAGE_CONTAINER = 'theia-scm-input-message-container';
        Styles.INPUT_MESSAGE = 'theia-scm-input-message';
        Styles.VALIDATION_MESSAGE = 'theia-scm-input-validation-message';
        Styles.NO_SELECT = 'no-select';
    })(Styles = ScmCommitWidget.Styles || (ScmCommitWidget.Styles = {}));
})(ScmCommitWidget = exports.ScmCommitWidget || (exports.ScmCommitWidget = {}));
exports.ScmCommitWidget = ScmCommitWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-commit-widget'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-contribution.js":
/*!**********************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-contribution.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmContribution = exports.ScmColors = exports.SCM_COMMANDS = exports.SCM_VIEW_CONTAINER_TITLE_OPTIONS = exports.SCM_VIEW_CONTAINER_ID = exports.SCM_WIDGET_FACTORY_ID = void 0;
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const scm_service_1 = __webpack_require__(/*! ./scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const scm_widget_1 = __webpack_require__(/*! ../browser/scm-widget */ "../../packages/scm/lib/browser/scm-widget.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const scm_quick_open_service_1 = __webpack_require__(/*! ./scm-quick-open-service */ "../../packages/scm/lib/browser/scm-quick-open-service.js");
const color_1 = __webpack_require__(/*! @theia/core/lib/common/color */ "../../packages/core/lib/common/color.js");
const scm_decorations_service_1 = __webpack_require__(/*! ../browser/decorations/scm-decorations-service */ "../../packages/scm/lib/browser/decorations/scm-decorations-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const theme_1 = __webpack_require__(/*! @theia/core/lib/common/theme */ "../../packages/core/lib/common/theme.js");
exports.SCM_WIDGET_FACTORY_ID = scm_widget_1.ScmWidget.ID;
exports.SCM_VIEW_CONTAINER_ID = 'scm-view-container';
exports.SCM_VIEW_CONTAINER_TITLE_OPTIONS = {
    label: nls_1.nls.localizeByDefault('Source Control'),
    iconClass: (0, browser_1.codicon)('source-control'),
    closeable: true
};
var SCM_COMMANDS;
(function (SCM_COMMANDS) {
    SCM_COMMANDS.CHANGE_REPOSITORY = {
        id: 'scm.change.repository',
        category: nls_1.nls.localizeByDefault('Source Control'),
        originalCategory: 'Source Control',
        label: nls_1.nls.localize('theia/scm/changeRepository', 'Change Repository...'),
        originalLabel: 'Change Repository...'
    };
    SCM_COMMANDS.ACCEPT_INPUT = {
        id: 'scm.acceptInput'
    };
    SCM_COMMANDS.TREE_VIEW_MODE = {
        id: 'scm.viewmode.tree',
        tooltip: nls_1.nls.localizeByDefault('View as Tree'),
        iconClass: (0, browser_1.codicon)('list-tree'),
        originalLabel: 'View as Tree',
        label: nls_1.nls.localizeByDefault('View as Tree')
    };
    SCM_COMMANDS.LIST_VIEW_MODE = {
        id: 'scm.viewmode.list',
        tooltip: nls_1.nls.localizeByDefault('View as List'),
        iconClass: (0, browser_1.codicon)('list-flat'),
        originalLabel: 'View as List',
        label: nls_1.nls.localizeByDefault('View as List')
    };
    SCM_COMMANDS.COLLAPSE_ALL = {
        id: 'scm.collapseAll',
        category: nls_1.nls.localizeByDefault('Source Control'),
        originalCategory: 'Source Control',
        tooltip: nls_1.nls.localizeByDefault('Collapse All'),
        iconClass: (0, browser_1.codicon)('collapse-all'),
        label: nls_1.nls.localizeByDefault('Collapse All'),
        originalLabel: 'Collapse All'
    };
})(SCM_COMMANDS = exports.SCM_COMMANDS || (exports.SCM_COMMANDS = {}));
var ScmColors;
(function (ScmColors) {
    ScmColors.editorGutterModifiedBackground = 'editorGutter.modifiedBackground';
    ScmColors.editorGutterAddedBackground = 'editorGutter.addedBackground';
    ScmColors.editorGutterDeletedBackground = 'editorGutter.deletedBackground';
})(ScmColors = exports.ScmColors || (exports.ScmColors = {}));
let ScmContribution = class ScmContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            viewContainerId: exports.SCM_VIEW_CONTAINER_ID,
            widgetId: exports.SCM_WIDGET_FACTORY_ID,
            widgetName: exports.SCM_VIEW_CONTAINER_TITLE_OPTIONS.label,
            defaultWidgetOptions: {
                area: 'left',
                rank: 300
            },
            toggleCommandId: 'scmView:toggle',
            toggleKeybinding: 'ctrlcmd+shift+g'
        });
        this.statusBarDisposable = new common_1.DisposableCollection();
    }
    init() {
        this.scmFocus = this.contextKeys.createKey('scmFocus', false);
    }
    async initializeLayout() {
        await this.openView();
    }
    onStart() {
        this.updateStatusBar();
        this.scmService.onDidAddRepository(() => this.updateStatusBar());
        this.scmService.onDidRemoveRepository(() => this.updateStatusBar());
        this.scmService.onDidChangeSelectedRepository(() => this.updateStatusBar());
        this.scmService.onDidChangeStatusBarCommands(() => this.updateStatusBar());
        this.labelProvider.onDidChange(() => this.updateStatusBar());
        this.updateContextKeys();
        this.shell.onDidChangeCurrentWidget(() => this.updateContextKeys());
    }
    updateContextKeys() {
        this.scmFocus.set(this.shell.currentWidget instanceof scm_widget_1.ScmWidget);
    }
    registerCommands(commandRegistry) {
        super.registerCommands(commandRegistry);
        commandRegistry.registerCommand(SCM_COMMANDS.CHANGE_REPOSITORY, {
            execute: () => this.scmQuickOpenService.changeRepository(),
            isEnabled: () => this.scmService.repositories.length > 1
        });
        commandRegistry.registerCommand(SCM_COMMANDS.ACCEPT_INPUT, {
            execute: () => this.acceptInput(),
            isEnabled: () => !!this.scmFocus.get() && !!this.acceptInputCommand()
        });
    }
    registerToolbarItems(registry) {
        const viewModeEmitter = new event_1.Emitter();
        const registerToggleViewItem = (command, mode) => {
            const id = command.id;
            const item = {
                id,
                command: id,
                tooltip: command.label,
                onDidChange: viewModeEmitter.event
            };
            this.commandRegistry.registerCommand({ id, iconClass: command && command.iconClass }, {
                execute: widget => {
                    if (widget instanceof scm_widget_1.ScmWidget) {
                        widget.viewMode = mode;
                        viewModeEmitter.fire();
                    }
                },
                isVisible: widget => {
                    if (widget instanceof scm_widget_1.ScmWidget) {
                        return !!this.scmService.selectedRepository
                            && widget.viewMode !== mode;
                    }
                    return false;
                },
            });
            registry.registerItem(item);
        };
        registerToggleViewItem(SCM_COMMANDS.TREE_VIEW_MODE, 'tree');
        registerToggleViewItem(SCM_COMMANDS.LIST_VIEW_MODE, 'list');
        this.commandRegistry.registerCommand(SCM_COMMANDS.COLLAPSE_ALL, {
            execute: widget => {
                if (widget instanceof scm_widget_1.ScmWidget && widget.viewMode === 'tree') {
                    widget.collapseScmTree();
                }
            },
            isVisible: widget => {
                if (widget instanceof scm_widget_1.ScmWidget) {
                    return !!this.scmService.selectedRepository && widget.viewMode === 'tree';
                }
                return false;
            }
        });
        registry.registerItem({
            ...SCM_COMMANDS.COLLAPSE_ALL,
            command: SCM_COMMANDS.COLLAPSE_ALL.id
        });
    }
    registerKeybindings(keybindings) {
        super.registerKeybindings(keybindings);
        keybindings.registerKeybinding({
            command: SCM_COMMANDS.ACCEPT_INPUT.id,
            keybinding: 'ctrlcmd+enter',
            when: 'scmFocus'
        });
    }
    async acceptInput() {
        const command = this.acceptInputCommand();
        if (command && command.command) {
            await this.commands.executeCommand(command.command, ...command.arguments ? command.arguments : []);
        }
    }
    acceptInputCommand() {
        const repository = this.scmService.selectedRepository;
        if (!repository) {
            return undefined;
        }
        return repository.provider.acceptInputCommand;
    }
    updateStatusBar() {
        this.statusBarDisposable.dispose();
        const repository = this.scmService.selectedRepository;
        if (!repository) {
            return;
        }
        const name = this.labelProvider.getName(new uri_1.default(repository.provider.rootUri));
        if (this.scmService.repositories.length > 1) {
            this.setStatusBarEntry(SCM_COMMANDS.CHANGE_REPOSITORY.id, {
                text: `$(database) ${name}`,
                tooltip: name.toString(),
                command: SCM_COMMANDS.CHANGE_REPOSITORY.id,
                alignment: browser_1.StatusBarAlignment.LEFT,
                priority: 100
            });
        }
        const label = repository.provider.rootUri ? `${name} (${repository.provider.label})` : repository.provider.label;
        this.scmService.statusBarCommands.forEach((value, index) => this.setStatusBarEntry(`scm.status.${index}`, {
            text: value.title,
            tooltip: label + (value.tooltip ? ` - ${value.tooltip}` : ''),
            command: value.command,
            arguments: value.arguments,
            alignment: browser_1.StatusBarAlignment.LEFT,
            priority: 100
        }));
    }
    setStatusBarEntry(id, entry) {
        this.statusBar.setElement(id, entry);
        this.statusBarDisposable.push(common_1.Disposable.create(() => this.statusBar.removeElement(id)));
    }
    /**
     * It should be aligned with https://github.com/microsoft/vscode/blob/0dfa355b3ad185a6289ba28a99c141ab9e72d2be/src/vs/workbench/contrib/scm/browser/dirtydiffDecorator.ts#L808
     */
    registerColors(colors) {
        colors.register({
            id: ScmColors.editorGutterModifiedBackground, defaults: {
                dark: '#1B81A8',
                light: '#2090D3',
                hcDark: '#1B81A8',
                hcLight: '#2090D3'
            }, description: 'Editor gutter background color for lines that are modified.'
        }, {
            id: ScmColors.editorGutterAddedBackground, defaults: {
                dark: '#487E02',
                light: '#48985D',
                hcDark: '#487E02',
                hcLight: '#48985D'
            }, description: 'Editor gutter background color for lines that are added.'
        }, {
            id: ScmColors.editorGutterDeletedBackground, defaults: {
                dark: 'editorError.foreground',
                light: 'editorError.foreground',
                hcDark: 'editorError.foreground',
                hcLight: 'editorError.foreground'
            }, description: 'Editor gutter background color for lines that are deleted.'
        }, {
            id: 'minimapGutter.modifiedBackground', defaults: {
                dark: 'editorGutter.modifiedBackground',
                light: 'editorGutter.modifiedBackground',
                hcDark: 'editorGutter.modifiedBackground',
                hcLight: 'editorGutter.modifiedBackground'
            }, description: 'Minimap gutter background color for lines that are modified.'
        }, {
            id: 'minimapGutter.addedBackground', defaults: {
                dark: 'editorGutter.addedBackground',
                light: 'editorGutter.addedBackground',
                hcDark: 'editorGutter.modifiedBackground',
                hcLight: 'editorGutter.modifiedBackground'
            }, description: 'Minimap gutter background color for lines that are added.'
        }, {
            id: 'minimapGutter.deletedBackground', defaults: {
                dark: 'editorGutter.deletedBackground',
                light: 'editorGutter.deletedBackground',
                hcDark: 'editorGutter.deletedBackground',
                hcLight: 'editorGutter.deletedBackground'
            }, description: 'Minimap gutter background color for lines that are deleted.'
        }, {
            id: 'editorOverviewRuler.modifiedForeground', defaults: {
                dark: color_1.Color.transparent(ScmColors.editorGutterModifiedBackground, 0.6),
                light: color_1.Color.transparent(ScmColors.editorGutterModifiedBackground, 0.6),
                hcDark: color_1.Color.transparent(ScmColors.editorGutterModifiedBackground, 0.6),
                hcLight: color_1.Color.transparent(ScmColors.editorGutterModifiedBackground, 0.6)
            }, description: 'Overview ruler marker color for modified content.'
        }, {
            id: 'editorOverviewRuler.addedForeground', defaults: {
                dark: color_1.Color.transparent(ScmColors.editorGutterAddedBackground, 0.6),
                light: color_1.Color.transparent(ScmColors.editorGutterAddedBackground, 0.6),
                hcDark: color_1.Color.transparent(ScmColors.editorGutterAddedBackground, 0.6),
                hcLight: color_1.Color.transparent(ScmColors.editorGutterAddedBackground, 0.6)
            }, description: 'Overview ruler marker color for added content.'
        }, {
            id: 'editorOverviewRuler.deletedForeground', defaults: {
                dark: color_1.Color.transparent(ScmColors.editorGutterDeletedBackground, 0.6),
                light: color_1.Color.transparent(ScmColors.editorGutterDeletedBackground, 0.6),
                hcDark: color_1.Color.transparent(ScmColors.editorGutterDeletedBackground, 0.6),
                hcLight: color_1.Color.transparent(ScmColors.editorGutterDeletedBackground, 0.6)
            }, description: 'Overview ruler marker color for deleted content.'
        });
    }
    registerThemeStyle(theme, collector) {
        const contrastBorder = theme.getColor('contrastBorder');
        if (contrastBorder && (0, theme_1.isHighContrast)(theme.type)) {
            collector.addRule(`
                .theia-scm-input-message-container textarea {
                    outline: var(--theia-border-width) solid ${contrastBorder};
                    outline-offset: -1px;
                }
            `);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.StatusBar),
    __metadata("design:type", Object)
], ScmContribution.prototype, "statusBar", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmContribution.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(scm_quick_open_service_1.ScmQuickOpenService),
    __metadata("design:type", scm_quick_open_service_1.ScmQuickOpenService)
], ScmContribution.prototype, "scmQuickOpenService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], ScmContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], ScmContribution.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], ScmContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], ScmContribution.prototype, "contextKeys", void 0);
__decorate([
    (0, inversify_1.inject)(scm_decorations_service_1.ScmDecorationsService),
    __metadata("design:type", scm_decorations_service_1.ScmDecorationsService)
], ScmContribution.prototype, "scmDecorationsService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmContribution.prototype, "init", null);
ScmContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ScmContribution);
exports.ScmContribution = ScmContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-contribution'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-no-repository-widget.js":
/*!******************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-no-repository-widget.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 Arm and others.
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
var ScmNoRepositoryWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmNoRepositoryWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const alert_message_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/alert-message */ "../../packages/core/lib/browser/widgets/alert-message.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let ScmNoRepositoryWidget = ScmNoRepositoryWidget_1 = class ScmNoRepositoryWidget extends browser_1.ReactWidget {
    constructor() {
        super();
        this.addClass('theia-scm-no-repository');
        this.id = ScmNoRepositoryWidget_1.ID;
    }
    render() {
        return React.createElement(alert_message_1.AlertMessage, { type: 'WARNING', header: nls_1.nls.localize('theia/scm/noRepositoryFound', 'No repository found') });
    }
};
ScmNoRepositoryWidget.ID = 'scm-no-repository-widget';
ScmNoRepositoryWidget = ScmNoRepositoryWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ScmNoRepositoryWidget);
exports.ScmNoRepositoryWidget = ScmNoRepositoryWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-no-repository-widget'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-preferences.js":
/*!*********************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-preferences.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindScmPreferences = exports.createScmPreferences = exports.ScmPreferences = exports.ScmPreferenceContribution = exports.scmPreferenceSchema = void 0;
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.scmPreferenceSchema = {
    type: 'object',
    properties: {
        'scm.defaultViewMode': {
            type: 'string',
            enum: ['tree', 'list'],
            enumDescriptions: [
                nls_1.nls.localizeByDefault('Show the repository changes as a tree.'),
                nls_1.nls.localizeByDefault('Show the repository changes as a list.')
            ],
            description: nls_1.nls.localizeByDefault('Controls the default Source Control repository view mode.'),
            default: 'list'
        }
    }
};
exports.ScmPreferenceContribution = Symbol('ScmPreferenceContribution');
exports.ScmPreferences = Symbol('ScmPreferences');
function createScmPreferences(preferences, schema = exports.scmPreferenceSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createScmPreferences = createScmPreferences;
function bindScmPreferences(bind) {
    bind(exports.ScmPreferences).toDynamicValue((ctx) => {
        const preferences = ctx.container.get(preferences_1.PreferenceService);
        const contribution = ctx.container.get(exports.ScmPreferenceContribution);
        return createScmPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.ScmPreferenceContribution).toConstantValue({ schema: exports.scmPreferenceSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.ScmPreferenceContribution);
}
exports.bindScmPreferences = bindScmPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-preferences'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-quick-open-service.js":
/*!****************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-quick-open-service.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmQuickOpenService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const scm_service_1 = __webpack_require__(/*! ./scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
let ScmQuickOpenService = class ScmQuickOpenService {
    async changeRepository() {
        var _a;
        const repositories = this.scmService.repositories;
        if (repositories.length > 1) {
            const items = await Promise.all(repositories.map(async (repository) => {
                const uri = new uri_1.default(repository.provider.rootUri);
                return {
                    label: this.labelProvider.getName(uri),
                    description: this.labelProvider.getLongName(uri),
                    execute: () => {
                        this.scmService.selectedRepository = repository;
                    }
                };
            }));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: 'Select repository to work with:' });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], ScmQuickOpenService.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], ScmQuickOpenService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], ScmQuickOpenService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmQuickOpenService.prototype, "scmService", void 0);
ScmQuickOpenService = __decorate([
    (0, inversify_1.injectable)()
], ScmQuickOpenService);
exports.ScmQuickOpenService = ScmQuickOpenService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-quick-open-service'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-widget.js":
/*!****************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-widget.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
var ScmWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const scm_commit_widget_1 = __webpack_require__(/*! ./scm-commit-widget */ "../../packages/scm/lib/browser/scm-commit-widget.js");
const scm_amend_widget_1 = __webpack_require__(/*! ./scm-amend-widget */ "../../packages/scm/lib/browser/scm-amend-widget.js");
const scm_no_repository_widget_1 = __webpack_require__(/*! ./scm-no-repository-widget */ "../../packages/scm/lib/browser/scm-no-repository-widget.js");
const scm_service_1 = __webpack_require__(/*! ./scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const scm_tree_widget_1 = __webpack_require__(/*! ./scm-tree-widget */ "../../packages/scm/lib/browser/scm-tree-widget.js");
const scm_preferences_1 = __webpack_require__(/*! ./scm-preferences */ "../../packages/scm/lib/browser/scm-preferences.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let ScmWidget = ScmWidget_1 = class ScmWidget extends browser_1.BaseWidget {
    constructor() {
        super();
        this.toDisposeOnRefresh = new disposable_1.DisposableCollection();
        this.node.tabIndex = 0;
        this.id = ScmWidget_1.ID;
        this.addClass('theia-scm');
        this.addClass('theia-scm-main-container');
    }
    set viewMode(mode) {
        this.resourceWidget.viewMode = mode;
    }
    get viewMode() {
        return this.resourceWidget.viewMode;
    }
    init() {
        const layout = new browser_1.PanelLayout();
        this.layout = layout;
        this.panel = new browser_1.Panel({
            layout: new browser_1.PanelLayout({})
        });
        this.panel.node.tabIndex = -1;
        this.panel.node.setAttribute('class', 'theia-scm-panel');
        layout.addWidget(this.panel);
        this.containerLayout.addWidget(this.commitWidget);
        this.containerLayout.addWidget(this.resourceWidget);
        this.containerLayout.addWidget(this.amendWidget);
        this.containerLayout.addWidget(this.noRepositoryWidget);
        this.refresh();
        this.toDispose.push(this.scmService.onDidChangeSelectedRepository(() => this.refresh()));
        this.updateViewMode(this.scmPreferences.get('scm.defaultViewMode'));
        this.toDispose.push(this.scmPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'scm.defaultViewMode') {
                this.updateViewMode(e.newValue);
            }
        }));
        this.toDispose.push(this.shell.onDidChangeCurrentWidget(({ newValue }) => {
            const uri = browser_1.NavigatableWidget.getUri(newValue || undefined);
            if (uri) {
                this.resourceWidget.selectNodeByUri(uri);
            }
        }));
    }
    get containerLayout() {
        return this.panel.layout;
    }
    /**
     * Updates the view mode based on the preference value.
     * @param preference the view mode preference.
     */
    updateViewMode(preference) {
        this.viewMode = preference;
    }
    refresh() {
        this.toDisposeOnRefresh.dispose();
        this.toDispose.push(this.toDisposeOnRefresh);
        const repository = this.scmService.selectedRepository;
        this.title.label = repository ? repository.provider.label : nls_1.nls.localize('theia/scm/noRepositoryFound', 'No repository found');
        this.title.caption = this.title.label;
        this.update();
        if (repository) {
            this.toDisposeOnRefresh.push(repository.onDidChange(() => this.update()));
            // render synchronously to avoid cursor jumping
            // see https://stackoverflow.com/questions/28922275/in-reactjs-why-does-setstate-behave-differently-when-called-synchronously/28922465#28922465
            this.toDisposeOnRefresh.push(repository.input.onDidChange(() => this.updateImmediately()));
            this.toDisposeOnRefresh.push(repository.input.onDidFocus(() => this.focusInput()));
            this.commitWidget.show();
            this.resourceWidget.show();
            this.amendWidget.show();
            this.noRepositoryWidget.hide();
        }
        else {
            this.commitWidget.hide();
            this.resourceWidget.hide();
            this.amendWidget.hide();
            this.noRepositoryWidget.show();
        }
    }
    updateImmediately() {
        this.onUpdateRequest(browser_1.Widget.Msg.UpdateRequest);
    }
    onUpdateRequest(msg) {
        browser_1.MessageLoop.sendMessage(this.commitWidget, msg);
        browser_1.MessageLoop.sendMessage(this.resourceWidget, msg);
        browser_1.MessageLoop.sendMessage(this.amendWidget, msg);
        browser_1.MessageLoop.sendMessage(this.noRepositoryWidget, msg);
        super.onUpdateRequest(msg);
    }
    onAfterAttach(msg) {
        this.node.appendChild(this.commitWidget.node);
        this.node.appendChild(this.resourceWidget.node);
        this.node.appendChild(this.amendWidget.node);
        this.node.appendChild(this.noRepositoryWidget.node);
        super.onAfterAttach(msg);
        this.update();
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.refresh();
        if (this.commitWidget.isVisible) {
            this.commitWidget.focus();
        }
        else {
            this.node.focus();
        }
    }
    focusInput() {
        this.commitWidget.focus();
    }
    storeState() {
        const state = {
            commitState: this.commitWidget.storeState(),
            changesTreeState: this.resourceWidget.storeState(),
        };
        return state;
    }
    restoreState(oldState) {
        const { commitState, changesTreeState } = oldState;
        this.commitWidget.restoreState(commitState);
        this.resourceWidget.restoreState(changesTreeState);
    }
    collapseScmTree() {
        const { model } = this.resourceWidget;
        const root = model.root;
        if (browser_1.CompositeTreeNode.is(root)) {
            root.children.map(group => {
                if (browser_1.CompositeTreeNode.is(group)) {
                    group.children.map(folderNode => {
                        if (browser_1.CompositeTreeNode.is(folderNode)) {
                            model.collapseAll(folderNode);
                        }
                        if (browser_1.SelectableTreeNode.isSelected(folderNode)) {
                            model.toggleNode(folderNode);
                        }
                    });
                }
            });
        }
    }
};
ScmWidget.ID = 'scm-view';
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], ScmWidget.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmWidget.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(scm_commit_widget_1.ScmCommitWidget),
    __metadata("design:type", scm_commit_widget_1.ScmCommitWidget)
], ScmWidget.prototype, "commitWidget", void 0);
__decorate([
    (0, inversify_1.inject)(scm_tree_widget_1.ScmTreeWidget),
    __metadata("design:type", scm_tree_widget_1.ScmTreeWidget)
], ScmWidget.prototype, "resourceWidget", void 0);
__decorate([
    (0, inversify_1.inject)(scm_amend_widget_1.ScmAmendWidget),
    __metadata("design:type", scm_amend_widget_1.ScmAmendWidget)
], ScmWidget.prototype, "amendWidget", void 0);
__decorate([
    (0, inversify_1.inject)(scm_no_repository_widget_1.ScmNoRepositoryWidget),
    __metadata("design:type", scm_no_repository_widget_1.ScmNoRepositoryWidget)
], ScmWidget.prototype, "noRepositoryWidget", void 0);
__decorate([
    (0, inversify_1.inject)(scm_preferences_1.ScmPreferences),
    __metadata("design:type", Object)
], ScmWidget.prototype, "scmPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmWidget.prototype, "init", null);
ScmWidget = ScmWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ScmWidget);
exports.ScmWidget = ScmWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-widget'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/scm-amend-component.css":
/*!**************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/scm-amend-component.css ***!
  \**************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-scm-commit-container {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--theia-sideBarSectionHeader-border);
  width: 100%;
  padding-top: 6px;
}

.theia-scm-amend-outer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
}

.theia-scm-commit-and-button {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}

.theia-scm-commit-avatar-and-text {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  padding-top: 2px;
}

.theia-scm-commit-avatar-and-text img {
  width: 27px;
}

.theia-scm-commit-details {
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.theia-scm-commit-message-avatar {
  margin-right: 5px;
}

.theia-scm-commit-message-summary {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.theia-scm-commit-message-time {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--theia-descriptionForeground);
  font-size: smaller;
}

.theia-scm-flex-container-center {
  display: flex;
  align-items: center;
}

.theia-scm-scrolling-container {
  position: relative;
  width: 100%;
  overflow: hidden;

  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-top: 0;
  border-bottom: 0;
}
`, "",{"version":3,"sources":["webpack://./../../packages/scm/src/browser/style/scm-amend-component.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,aAAa;EACb,sBAAsB;EACtB,8DAA8D;EAC9D,WAAW;EACX,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,WAAW;EACX,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,gBAAgB;EAChB,WAAW;AACb;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,gBAAgB;EAChB,WAAW;EACX,gBAAgB;AAClB;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;EACvB,WAAW;AACb;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB;;AAEA;EACE,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;EACvB,yCAAyC;EACzC,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,kBAAkB;EAClB,WAAW;EACX,gBAAgB;;EAEhB,aAAa;EACb,gBAAgB;EAChB,cAAc;EACd,iBAAiB;EACjB,aAAa;EACb,gBAAgB;AAClB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-scm-commit-container {\n  display: flex;\n  flex-direction: column;\n  border-top: 1px solid var(--theia-sideBarSectionHeader-border);\n  width: 100%;\n  padding-top: 6px;\n}\n\n.theia-scm-amend-outer-container {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  overflow: auto;\n}\n\n.theia-scm-commit-and-button {\n  display: flex;\n  white-space: nowrap;\n  overflow: hidden;\n  width: 100%;\n}\n\n.theia-scm-commit-avatar-and-text {\n  display: flex;\n  white-space: nowrap;\n  overflow: hidden;\n  width: 100%;\n  padding-top: 2px;\n}\n\n.theia-scm-commit-avatar-and-text img {\n  width: 27px;\n}\n\n.theia-scm-commit-details {\n  display: flex;\n  flex-direction: column;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  width: 100%;\n}\n\n.theia-scm-commit-message-avatar {\n  margin-right: 5px;\n}\n\n.theia-scm-commit-message-summary {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.theia-scm-commit-message-time {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--theia-descriptionForeground);\n  font-size: smaller;\n}\n\n.theia-scm-flex-container-center {\n  display: flex;\n  align-items: center;\n}\n\n.theia-scm-scrolling-container {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  border-top: 0;\n  border-bottom: 0;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/scm/src/browser/style/scm-amend-component.css":
/*!********************************************************************!*\
  !*** ../../packages/scm/src/browser/style/scm-amend-component.css ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_scm_amend_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./scm-amend-component.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/scm-amend-component.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_scm_amend_component_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_scm_amend_component_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_scm_lib_browser_scm-contribution_js.js.map