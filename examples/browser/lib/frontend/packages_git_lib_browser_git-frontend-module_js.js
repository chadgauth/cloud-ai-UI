"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_git_lib_browser_git-frontend-module_js"],{

/***/ "../../packages/git/lib/browser/blame/blame-contribution.js":
/*!******************************************************************!*\
  !*** ../../packages/git/lib/browser/blame/blame-contribution.js ***!
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
exports.BlameContribution = exports.BlameCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const blame_decorator_1 = __webpack_require__(/*! ./blame-decorator */ "../../packages/git/lib/browser/blame/blame-decorator.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const blame_manager_1 = __webpack_require__(/*! ./blame-manager */ "../../packages/git/lib/browser/blame/blame-manager.js");
const scm_extra_contribution_1 = __webpack_require__(/*! @theia/scm-extra/lib/browser/scm-extra-contribution */ "../../packages/scm-extra/lib/browser/scm-extra-contribution.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
var BlameCommands;
(function (BlameCommands) {
    BlameCommands.TOGGLE_GIT_ANNOTATIONS = common_1.Command.toLocalizedCommand({
        id: 'git.editor.toggle.annotations',
        category: 'Git',
        label: 'Toggle Blame Annotations'
    }, 'theia/git/toggleBlameAnnotations', 'vscode.git/package/displayName');
    BlameCommands.CLEAR_GIT_ANNOTATIONS = {
        id: 'git.editor.clear.annotations'
    };
})(BlameCommands = exports.BlameCommands || (exports.BlameCommands = {}));
let BlameContribution = class BlameContribution {
    constructor() {
        this.appliedDecorations = new Map();
    }
    init() {
        this._visibleBlameAnnotations = this.contextKeyService.createKey('showsBlameAnnotations', this.visibleBlameAnnotations());
        this.editorManager.onActiveEditorChanged(() => this.updateContext());
    }
    updateContext() {
        this._visibleBlameAnnotations.set(this.visibleBlameAnnotations());
    }
    registerCommands(commands) {
        commands.registerCommand(BlameCommands.TOGGLE_GIT_ANNOTATIONS, {
            execute: () => {
                const editorWidget = this.currentFileEditorWidget;
                if (editorWidget) {
                    if (this.showsBlameAnnotations(editorWidget.editor.uri)) {
                        this.clearBlame(editorWidget.editor.uri);
                    }
                    else {
                        this.showBlame(editorWidget);
                    }
                }
            },
            isVisible: () => !!this.currentFileEditorWidget,
            isEnabled: () => {
                const editorWidget = this.currentFileEditorWidget;
                return !!editorWidget && this.isBlameable(editorWidget.editor.uri);
            }
        });
        commands.registerCommand(BlameCommands.CLEAR_GIT_ANNOTATIONS, {
            execute: () => {
                const editorWidget = this.currentFileEditorWidget;
                if (editorWidget) {
                    this.clearBlame(editorWidget.editor.uri);
                }
            },
            isVisible: () => !!this.currentFileEditorWidget,
            isEnabled: () => {
                const editorWidget = this.currentFileEditorWidget;
                const enabled = !!editorWidget && this.showsBlameAnnotations(editorWidget.editor.uri);
                return enabled;
            }
        });
    }
    showsBlameAnnotations(uri) {
        var _a;
        return ((_a = this.appliedDecorations.get(uri.toString())) === null || _a === void 0 ? void 0 : _a.disposed) === false;
    }
    get currentFileEditorWidget() {
        const editorWidget = this.editorManager.currentEditor;
        if (editorWidget) {
            if (editorWidget.editor.uri.scheme === 'file') {
                return editorWidget;
            }
        }
        return undefined;
    }
    isBlameable(uri) {
        return this.blameManager.isBlameable(uri.toString());
    }
    visibleBlameAnnotations() {
        const widget = this.editorManager.activeEditor;
        if (widget && widget.editor.isFocused() && this.showsBlameAnnotations(widget.editor.uri)) {
            return true;
        }
        return false;
    }
    async showBlame(editorWidget) {
        const uri = editorWidget.editor.uri.toString();
        if (this.appliedDecorations.get(uri)) {
            return;
        }
        const toDispose = new common_1.DisposableCollection();
        this.appliedDecorations.set(uri, toDispose);
        try {
            const editor = editorWidget.editor;
            const document = editor.document;
            const content = document.dirty ? document.getText() : undefined;
            const blame = await this.blameManager.getBlame(uri, content);
            if (blame) {
                toDispose.push(this.decorator.decorate(blame, editor, editor.cursor.line));
                toDispose.push(editor.onDocumentContentChanged(() => this.clearBlame(uri)));
                toDispose.push(editor.onCursorPositionChanged(debounce(_position => {
                    if (!toDispose.disposed) {
                        this.decorator.decorate(blame, editor, editor.cursor.line);
                    }
                }, 50)));
                editorWidget.disposed.connect(() => this.clearBlame(uri));
            }
        }
        finally {
            if (toDispose.disposed) {
                this.appliedDecorations.delete(uri);
            }
            ;
            this.updateContext();
        }
    }
    clearBlame(uri) {
        const decorations = this.appliedDecorations.get(uri.toString());
        if (decorations) {
            this.appliedDecorations.delete(uri.toString());
            decorations.dispose();
            this.updateContext();
        }
    }
    registerMenus(menus) {
        menus.registerMenuAction(scm_extra_contribution_1.EDITOR_CONTEXT_MENU_SCM, {
            commandId: BlameCommands.TOGGLE_GIT_ANNOTATIONS.id,
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: BlameCommands.TOGGLE_GIT_ANNOTATIONS.id,
            when: 'editorTextFocus',
            keybinding: 'alt+b'
        });
        keybindings.registerKeybinding({
            command: BlameCommands.CLEAR_GIT_ANNOTATIONS.id,
            when: 'showsBlameAnnotations',
            keybinding: 'esc'
        });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], BlameContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(blame_decorator_1.BlameDecorator),
    __metadata("design:type", blame_decorator_1.BlameDecorator)
], BlameContribution.prototype, "decorator", void 0);
__decorate([
    (0, inversify_1.inject)(blame_manager_1.BlameManager),
    __metadata("design:type", blame_manager_1.BlameManager)
], BlameContribution.prototype, "blameManager", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], BlameContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlameContribution.prototype, "init", null);
BlameContribution = __decorate([
    (0, inversify_1.injectable)()
], BlameContribution);
exports.BlameContribution = BlameContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/blame/blame-contribution'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/blame/blame-decorator.js":
/*!***************************************************************!*\
  !*** ../../packages/git/lib/browser/blame/blame-decorator.js ***!
  \***************************************************************/
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
var BlameDecorator_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppliedBlameDecorations = exports.BlameDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const luxon_1 = __webpack_require__(/*! luxon */ "../../node_modules/luxon/build/node/luxon.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
let BlameDecorator = BlameDecorator_1 = class BlameDecorator {
    constructor(blameDecorationsStyleSheet = browser_2.DecorationStyle.createStyleSheet('gitBlameDecorationsStyle')) {
        this.blameDecorationsStyleSheet = blameDecorationsStyleSheet;
        this.emptyHover = {
            contents: [{
                    value: ''
                }]
        };
        this.appliedDecorations = new Map();
        this.now = luxon_1.DateTime.now();
        browser_2.DecorationStyle.getOrCreateStyleRule(`.${BlameDecorator_1.GIT_BLAME_HIGHLIGHT}`, this.blameDecorationsStyleSheet).style.backgroundColor = 'var(--theia-gitlens-lineHighlightBackgroundColor)';
        browser_2.DecorationStyle.getOrCreateStyleRule(`.${BlameDecorator_1.GIT_BLAME_CONTINUATION_LINE}::before`, this.blameDecorationsStyleSheet).style.content = "'\u2007'"; // blank
        browser_2.DecorationStyle.getOrCreateStyleRule(`.${BlameDecorator_1.GIT_BLAME_CONTINUATION_LINE}::after`, this.blameDecorationsStyleSheet).style.content = "'\u2007'"; // blank;
    }
    registerHoverProvider(uri) {
        // The public typedef of this method only accepts strings, but it immediately delegates to a method that accepts LanguageSelectors.
        return monaco.languages.registerHoverProvider([{ pattern: new uri_1.default(uri).path.toString() }], this);
    }
    async provideHover(model, position, token) {
        const line = position.lineNumber - 1;
        const uri = model.uri.toString();
        const applications = this.appliedDecorations.get(uri);
        if (!applications) {
            return this.emptyHover;
        }
        const blame = applications.blame;
        if (!blame) {
            return this.emptyHover;
        }
        const commitLine = blame.lines.find(l => l.line === line);
        if (!commitLine) {
            return this.emptyHover;
        }
        const sha = commitLine.sha;
        const commit = blame.commits.find(c => c.sha === sha);
        const date = new Date(commit.author.timestamp);
        let commitMessage = commit.summary + '\n' + (commit.body || '');
        commitMessage = commitMessage.replace(/[`\>\#\*\_\-\+]/g, '\\$&').replace(/\n/g, '  \n');
        const value = `${commit.sha}\n \n ${commit.author.name}, ${date.toString()}\n \n> ${commitMessage}`;
        const hover = {
            contents: [{ value }],
            range: monaco.Range.fromPositions(new monaco.Position(position.lineNumber, 1), new monaco.Position(position.lineNumber, 10 ^ 10))
        };
        return hover;
    }
    decorate(blame, editor, highlightLine) {
        const uri = editor.uri.toString();
        let applications = this.appliedDecorations.get(uri);
        if (!applications) {
            const that = applications = new AppliedBlameDecorations();
            this.appliedDecorations.set(uri, applications);
            applications.toDispose.push(this.registerHoverProvider(uri));
            applications.toDispose.push(core_1.Disposable.create(() => {
                this.appliedDecorations.delete(uri);
            }));
            applications.toDispose.push(core_1.Disposable.create(() => {
                editor.deltaDecorations({ oldDecorations: that.previousDecorations, newDecorations: [] });
            }));
        }
        if (applications.highlightedSha) {
            const sha = this.getShaForLine(blame, highlightLine);
            if (applications.highlightedSha === sha) {
                return applications;
            }
            applications.highlightedSha = sha;
        }
        applications.previousStyles.dispose();
        const blameDecorations = this.toDecorations(blame, highlightLine);
        applications.previousStyles.pushAll(blameDecorations.styles);
        const newDecorations = blameDecorations.editorDecorations;
        const oldDecorations = applications.previousDecorations;
        const appliedDecorations = editor.deltaDecorations({ oldDecorations, newDecorations });
        applications.previousDecorations.length = 0;
        applications.previousDecorations.push(...appliedDecorations);
        applications.blame = blame;
        return applications;
    }
    getShaForLine(blame, line) {
        const commitLines = blame.lines;
        const commitLine = commitLines.find(c => c.line === line);
        return commitLine ? commitLine.sha : undefined;
    }
    toDecorations(blame, highlightLine) {
        const beforeContentStyles = new Map();
        const commits = blame.commits;
        for (const commit of commits) {
            const sha = commit.sha;
            const commitTime = luxon_1.DateTime.fromISO(commit.author.timestamp);
            const heat = this.getHeatColor(commitTime);
            const content = commit.summary.replace('\n', '↩︎').replace(/'/g, "\\'");
            const short = sha.substring(0, 7);
            new browser_1.EditorDecorationStyle('.git-' + short, style => {
                Object.assign(style, BlameDecorator_1.defaultGutterStyles);
                style.borderColor = heat;
            }, this.blameDecorationsStyleSheet);
            beforeContentStyles.set(sha, new browser_1.EditorDecorationStyle('.git-' + short + '::before', style => {
                Object.assign(style, BlameDecorator_1.defaultGutterBeforeStyles);
                style.content = `'${content}'`;
            }, this.blameDecorationsStyleSheet));
            new browser_1.EditorDecorationStyle('.git-' + short + '::after', style => {
                var _a;
                Object.assign(style, BlameDecorator_1.defaultGutterAfterStyles);
                style.content = ((_a = this.now.diff(commitTime, 'seconds').toObject().seconds) !== null && _a !== void 0 ? _a : 0) < 60
                    ? `'${core_1.nls.localize('theia/git/aFewSecondsAgo', 'a few seconds ago')}'`
                    : `'${commitTime.toRelative({ locale: core_1.nls.locale })}'`;
            }, this.blameDecorationsStyleSheet);
        }
        const commitLines = blame.lines;
        const highlightedSha = this.getShaForLine(blame, highlightLine) || '';
        let previousLineSha = '';
        const editorDecorations = [];
        for (const commitLine of commitLines) {
            const { line, sha } = commitLine;
            const beforeContentClassName = beforeContentStyles.get(sha).className;
            const options = {
                beforeContentClassName,
            };
            if (sha === highlightedSha) {
                options.beforeContentClassName += ' ' + BlameDecorator_1.GIT_BLAME_HIGHLIGHT;
            }
            if (sha === previousLineSha) {
                options.beforeContentClassName += ' ' + BlameDecorator_1.GIT_BLAME_CONTINUATION_LINE + ' ' + BlameDecorator_1.GIT_BLAME_CONTINUATION_LINE;
            }
            previousLineSha = sha;
            const range = browser_1.Range.create(browser_1.Position.create(line, 0), browser_1.Position.create(line, 0));
            editorDecorations.push({ range, options });
        }
        const styles = [...beforeContentStyles.values()];
        return { editorDecorations, styles };
    }
    getHeatColor(commitTime) {
        var _a;
        const daysFromNow = (_a = this.now.diff(commitTime, 'days').toObject().days) !== null && _a !== void 0 ? _a : 0;
        if (daysFromNow <= 2) {
            return 'var(--md-orange-50)';
        }
        if (daysFromNow <= 5) {
            return 'var(--md-orange-100)';
        }
        if (daysFromNow <= 10) {
            return 'var(--md-orange-200)';
        }
        if (daysFromNow <= 15) {
            return 'var(--md-orange-300)';
        }
        if (daysFromNow <= 60) {
            return 'var(--md-orange-400)';
        }
        if (daysFromNow <= 180) {
            return 'var(--md-deep-orange-600)';
        }
        if (daysFromNow <= 365) {
            return 'var(--md-deep-orange-700)';
        }
        if (daysFromNow <= 720) {
            return 'var(--md-deep-orange-800)';
        }
        return 'var(--md-deep-orange-900)';
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], BlameDecorator.prototype, "editorManager", void 0);
BlameDecorator = BlameDecorator_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [CSSStyleSheet])
], BlameDecorator);
exports.BlameDecorator = BlameDecorator;
(function (BlameDecorator) {
    BlameDecorator.GIT_BLAME_HIGHLIGHT = 'git-blame-highlight';
    BlameDecorator.GIT_BLAME_CONTINUATION_LINE = 'git-blame-continuation-line';
    BlameDecorator.defaultGutterStyles = {
        display: 'inline-flex',
        width: '50ch',
        marginRight: '26px',
        justifyContent: 'space-between',
        backgroundColor: 'var(--theia-gitlens-gutterBackgroundColor)',
        borderRight: '2px solid',
        height: '100%',
        overflow: 'hidden'
    };
    BlameDecorator.defaultGutterBeforeStyles = {
        color: 'var(--theia-gitlens-gutterForegroundColor)',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };
    BlameDecorator.defaultGutterAfterStyles = {
        color: 'var(--theia-gitlens-gutterForegroundColor)',
        marginLeft: '12px'
    };
})(BlameDecorator = exports.BlameDecorator || (exports.BlameDecorator = {}));
exports.BlameDecorator = BlameDecorator;
class AppliedBlameDecorations {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
        this.previousStyles = new core_1.DisposableCollection();
        this.previousDecorations = [];
    }
    dispose() {
        this.previousStyles.dispose();
        this.toDispose.dispose();
        this.blame = undefined;
    }
}
exports.AppliedBlameDecorations = AppliedBlameDecorations;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/blame/blame-decorator'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/blame/blame-manager.js":
/*!*************************************************************!*\
  !*** ../../packages/git/lib/browser/blame/blame-manager.js ***!
  \*************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlameManager = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/git/lib/common/index.js");
const git_repository_tracker_1 = __webpack_require__(/*! ../git-repository-tracker */ "../../packages/git/lib/browser/git-repository-tracker.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
let BlameManager = class BlameManager {
    isBlameable(uri) {
        return !!this.repositoryTracker.getPath(new uri_1.default(uri));
    }
    async getBlame(uri, content) {
        const repository = this.repositoryTracker.selectedRepository;
        if (!repository) {
            return undefined;
        }
        return this.git.blame(repository, uri, { content });
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], BlameManager.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], BlameManager.prototype, "repositoryTracker", void 0);
BlameManager = __decorate([
    (0, inversify_1.injectable)()
], BlameManager);
exports.BlameManager = BlameManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/blame/blame-manager'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/blame/blame-module.js":
/*!************************************************************!*\
  !*** ../../packages/git/lib/browser/blame/blame-module.js ***!
  \************************************************************/
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
exports.bindBlame = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const blame_contribution_1 = __webpack_require__(/*! ./blame-contribution */ "../../packages/git/lib/browser/blame/blame-contribution.js");
const blame_decorator_1 = __webpack_require__(/*! ./blame-decorator */ "../../packages/git/lib/browser/blame/blame-decorator.js");
const blame_manager_1 = __webpack_require__(/*! ./blame-manager */ "../../packages/git/lib/browser/blame/blame-manager.js");
function bindBlame(bind) {
    bind(blame_contribution_1.BlameContribution).toSelf().inSingletonScope();
    bind(blame_manager_1.BlameManager).toSelf().inSingletonScope();
    bind(blame_decorator_1.BlameDecorator).toSelf().inSingletonScope();
    for (const serviceIdentifier of [common_1.CommandContribution, browser_1.KeybindingContribution, common_1.MenuContribution]) {
        bind(serviceIdentifier).toService(blame_contribution_1.BlameContribution);
    }
}
exports.bindBlame = bindBlame;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/blame/blame-module'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/diff/git-diff-contribution.js":
/*!********************************************************************!*\
  !*** ../../packages/git/lib/browser/diff/git-diff-contribution.js ***!
  \********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitDiffContribution = exports.ScmNavigatorMoreToolbarGroups = exports.GitDiffCommands = void 0;
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const git_diff_widget_1 = __webpack_require__(/*! ./git-diff-widget */ "../../packages/git/lib/browser/diff/git-diff-widget.js");
const git_commit_detail_widget_1 = __webpack_require__(/*! ../history/git-commit-detail-widget */ "../../packages/git/lib/browser/history/git-commit-detail-widget.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const navigator_contribution_1 = __webpack_require__(/*! @theia/navigator/lib/browser/navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const git_quick_open_service_1 = __webpack_require__(/*! ../git-quick-open-service */ "../../packages/git/lib/browser/git-quick-open-service.js");
const diff_uris_1 = __webpack_require__(/*! @theia/core/lib/browser/diff-uris */ "../../packages/core/lib/browser/diff-uris.js");
const git_resource_1 = __webpack_require__(/*! ../git-resource */ "../../packages/git/lib/browser/git-resource.js");
const workspace_commands_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-commands */ "../../packages/workspace/lib/browser/workspace-commands.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
var GitDiffCommands;
(function (GitDiffCommands) {
    GitDiffCommands.OPEN_FILE_DIFF = common_1.Command.toLocalizedCommand({
        id: 'git-diff:open-file-diff',
        category: 'Git Diff',
        label: 'Compare With...'
    }, 'theia/git/compareWith');
    GitDiffCommands.TREE_VIEW_MODE = {
        id: 'git.viewmode.tree',
        tooltip: nls_1.nls.localizeByDefault('View as Tree'),
        iconClass: (0, browser_1.codicon)('list-tree'),
        originalLabel: 'View as Tree',
        label: nls_1.nls.localizeByDefault('View as Tree')
    };
    GitDiffCommands.LIST_VIEW_MODE = {
        id: 'git.viewmode.list',
        tooltip: nls_1.nls.localizeByDefault('View as List'),
        iconClass: (0, browser_1.codicon)('list-flat'),
        originalLabel: 'View as List',
        label: nls_1.nls.localizeByDefault('View as List')
    };
    GitDiffCommands.PREVIOUS_CHANGE = {
        id: 'git.navigate-changes.previous',
        tooltip: nls_1.nls.localizeByDefault('Previous Change'),
        iconClass: (0, browser_1.codicon)('arrow-left'),
        originalLabel: 'Previous Change',
        label: nls_1.nls.localizeByDefault('Previous Change')
    };
    GitDiffCommands.NEXT_CHANGE = {
        id: 'git.navigate-changes.next',
        tooltip: nls_1.nls.localizeByDefault('Next Change'),
        iconClass: (0, browser_1.codicon)('arrow-right'),
        originalLabel: 'Next Change',
        label: nls_1.nls.localizeByDefault('Next Change')
    };
})(GitDiffCommands = exports.GitDiffCommands || (exports.GitDiffCommands = {}));
var ScmNavigatorMoreToolbarGroups;
(function (ScmNavigatorMoreToolbarGroups) {
    ScmNavigatorMoreToolbarGroups.SCM = '3_navigator_scm';
})(ScmNavigatorMoreToolbarGroups = exports.ScmNavigatorMoreToolbarGroups || (exports.ScmNavigatorMoreToolbarGroups = {}));
let GitDiffContribution = class GitDiffContribution extends browser_1.AbstractViewContribution {
    constructor(selectionService, widgetManager, app, quickOpenService, fileService, openerService, notifications, scmService) {
        super({
            widgetId: git_diff_widget_1.GIT_DIFF,
            widgetName: 'Git diff',
            defaultWidgetOptions: {
                area: 'left',
                rank: 500
            }
        });
        this.selectionService = selectionService;
        this.widgetManager = widgetManager;
        this.app = app;
        this.quickOpenService = quickOpenService;
        this.fileService = fileService;
        this.openerService = openerService;
        this.notifications = notifications;
        this.scmService = scmService;
    }
    registerMenus(menus) {
        menus.registerMenuAction(navigator_contribution_1.NavigatorContextMenu.COMPARE, {
            commandId: GitDiffCommands.OPEN_FILE_DIFF.id
        });
    }
    registerCommands(commands) {
        commands.registerCommand(GitDiffCommands.OPEN_FILE_DIFF, this.newWorkspaceRootUriAwareCommandHandler({
            isVisible: uri => !!this.findGitRepository(uri),
            isEnabled: uri => !!this.findGitRepository(uri),
            execute: async (fileUri) => {
                const repository = this.findGitRepository(fileUri);
                if (repository) {
                    await this.quickOpenService.chooseTagsAndBranches(async (fromRevision, toRevision) => {
                        const uri = fileUri.toString();
                        const fileStat = await this.fileService.resolve(fileUri);
                        const diffOptions = {
                            uri,
                            range: {
                                fromRevision
                            }
                        };
                        if (fileStat.isDirectory) {
                            this.showWidget({ rootUri: repository.localUri, diffOptions });
                        }
                        else {
                            const fromURI = fileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery(fromRevision);
                            const toURI = fileUri;
                            const diffUri = diff_uris_1.DiffUris.encode(fromURI, toURI);
                            if (diffUri) {
                                (0, browser_1.open)(this.openerService, diffUri).catch(e => {
                                    this.notifications.error(e.message);
                                });
                            }
                        }
                    }, repository);
                }
            }
        }));
        commands.registerCommand(GitDiffCommands.PREVIOUS_CHANGE, {
            execute: widget => {
                if (widget instanceof git_diff_widget_1.GitDiffWidget) {
                    widget.goToPreviousChange();
                }
            },
            isVisible: widget => widget instanceof git_diff_widget_1.GitDiffWidget,
        });
        commands.registerCommand(GitDiffCommands.NEXT_CHANGE, {
            execute: widget => {
                if (widget instanceof git_diff_widget_1.GitDiffWidget) {
                    widget.goToNextChange();
                }
            },
            isVisible: widget => widget instanceof git_diff_widget_1.GitDiffWidget,
        });
    }
    registerToolbarItems(registry) {
        this.fileNavigatorContribution.registerMoreToolbarItem({
            id: GitDiffCommands.OPEN_FILE_DIFF.id,
            command: GitDiffCommands.OPEN_FILE_DIFF.id,
            tooltip: GitDiffCommands.OPEN_FILE_DIFF.label,
            group: ScmNavigatorMoreToolbarGroups.SCM,
        });
        const viewModeEmitter = new event_1.Emitter();
        const extractDiffWidget = (widget) => {
            if (widget instanceof git_diff_widget_1.GitDiffWidget) {
                return widget;
            }
        };
        const extractCommitDetailWidget = (widget) => {
            const ref = widget ? widget : this.editorManager.currentEditor;
            if (ref instanceof git_commit_detail_widget_1.GitCommitDetailWidget) {
                return ref;
            }
            return undefined;
        };
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
                    const widgetWithChanges = extractDiffWidget(widget) || extractCommitDetailWidget(widget);
                    if (widgetWithChanges) {
                        widgetWithChanges.viewMode = mode;
                        viewModeEmitter.fire();
                    }
                },
                isVisible: widget => {
                    const widgetWithChanges = extractDiffWidget(widget) || extractCommitDetailWidget(widget);
                    if (widgetWithChanges) {
                        return widgetWithChanges.viewMode !== mode;
                    }
                    return false;
                },
            });
            registry.registerItem(item);
        };
        registerToggleViewItem(GitDiffCommands.TREE_VIEW_MODE, 'tree');
        registerToggleViewItem(GitDiffCommands.LIST_VIEW_MODE, 'list');
        registry.registerItem({
            id: GitDiffCommands.PREVIOUS_CHANGE.id,
            command: GitDiffCommands.PREVIOUS_CHANGE.id,
            tooltip: GitDiffCommands.PREVIOUS_CHANGE.label,
        });
        registry.registerItem({
            id: GitDiffCommands.NEXT_CHANGE.id,
            command: GitDiffCommands.NEXT_CHANGE.id,
            tooltip: GitDiffCommands.NEXT_CHANGE.label,
        });
    }
    findGitRepository(uri) {
        const repo = this.scmService.findRepository(uri);
        if (repo && repo.provider.id === 'git') {
            return { localUri: repo.provider.rootUri };
        }
        return undefined;
    }
    async showWidget(options) {
        const widget = await this.widget;
        await widget.setContent(options);
        return this.openView({
            activate: true
        });
    }
    newWorkspaceRootUriAwareCommandHandler(handler) {
        return new workspace_commands_1.WorkspaceRootUriAwareCommandHandler(this.workspaceService, this.selectionService, handler);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], GitDiffContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], GitDiffContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_contribution_1.FileNavigatorContribution),
    __metadata("design:type", navigator_contribution_1.FileNavigatorContribution)
], GitDiffContribution.prototype, "fileNavigatorContribution", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], GitDiffContribution.prototype, "workspaceService", void 0);
GitDiffContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(common_1.SelectionService)),
    __param(1, (0, inversify_1.inject)(widget_manager_1.WidgetManager)),
    __param(2, (0, inversify_1.inject)(browser_1.FrontendApplication)),
    __param(3, (0, inversify_1.inject)(git_quick_open_service_1.GitQuickOpenService)),
    __param(4, (0, inversify_1.inject)(file_service_1.FileService)),
    __param(5, (0, inversify_1.inject)(browser_1.OpenerService)),
    __param(6, (0, inversify_1.inject)(common_1.MessageService)),
    __param(7, (0, inversify_1.inject)(scm_service_1.ScmService)),
    __metadata("design:paramtypes", [common_1.SelectionService,
        widget_manager_1.WidgetManager,
        browser_1.FrontendApplication,
        git_quick_open_service_1.GitQuickOpenService,
        file_service_1.FileService, Object, common_1.MessageService,
        scm_service_1.ScmService])
], GitDiffContribution);
exports.GitDiffContribution = GitDiffContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/diff/git-diff-contribution'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/diff/git-diff-frontend-module.js":
/*!***********************************************************************!*\
  !*** ../../packages/git/lib/browser/diff/git-diff-frontend-module.js ***!
  \***********************************************************************/
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
exports.createGitDiffWidgetContainer = exports.bindGitDiffModule = void 0;
const git_diff_contribution_1 = __webpack_require__(/*! ./git-diff-contribution */ "../../packages/git/lib/browser/diff/git-diff-contribution.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const git_diff_widget_1 = __webpack_require__(/*! ./git-diff-widget */ "../../packages/git/lib/browser/diff/git-diff-widget.js");
const git_diff_header_widget_1 = __webpack_require__(/*! ./git-diff-header-widget */ "../../packages/git/lib/browser/diff/git-diff-header-widget.js");
const git_diff_tree_model_1 = __webpack_require__(/*! ./git-diff-tree-model */ "../../packages/git/lib/browser/diff/git-diff-tree-model.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const scm_frontend_module_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-frontend-module */ "../../packages/scm/lib/browser/scm-frontend-module.js");
const git_resource_opener_1 = __webpack_require__(/*! ./git-resource-opener */ "../../packages/git/lib/browser/diff/git-resource-opener.js");
const git_opener_in_primary_area_1 = __webpack_require__(/*! ./git-opener-in-primary-area */ "../../packages/git/lib/browser/diff/git-opener-in-primary-area.js");
__webpack_require__(/*! ../../../src/browser/style/diff.css */ "../../packages/git/src/browser/style/diff.css");
function bindGitDiffModule(bind) {
    bind(git_diff_widget_1.GitDiffWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: git_diff_widget_1.GIT_DIFF,
        createWidget: () => {
            const child = createGitDiffWidgetContainer(ctx.container);
            return child.get(git_diff_widget_1.GitDiffWidget);
        }
    })).inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, git_diff_contribution_1.GitDiffContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(git_diff_contribution_1.GitDiffContribution);
}
exports.bindGitDiffModule = bindGitDiffModule;
function createGitDiffWidgetContainer(parent) {
    const child = (0, scm_frontend_module_1.createScmTreeContainer)(parent);
    child.bind(git_diff_header_widget_1.GitDiffHeaderWidget).toSelf();
    child.bind(git_diff_tree_model_1.GitDiffTreeModel).toSelf();
    child.bind(browser_1.TreeModel).toService(git_diff_tree_model_1.GitDiffTreeModel);
    child.bind(git_resource_opener_1.GitResourceOpener).to(git_opener_in_primary_area_1.GitOpenerInPrimaryArea);
    return child;
}
exports.createGitDiffWidgetContainer = createGitDiffWidgetContainer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/diff/git-diff-frontend-module'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/diff/git-diff-header-widget.js":
/*!*********************************************************************!*\
  !*** ../../packages/git/lib/browser/diff/git-diff-header-widget.js ***!
  \*********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitDiffHeaderWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const scm_file_change_label_provider_1 = __webpack_require__(/*! @theia/scm-extra/lib/browser/scm-file-change-label-provider */ "../../packages/scm-extra/lib/browser/scm-file-change-label-provider.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
/* eslint-disable no-null/no-null */
let GitDiffHeaderWidget = class GitDiffHeaderWidget extends browser_1.ReactWidget {
    constructor() {
        super();
        this.id = 'git-diff-header';
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('git-commit');
    }
    async setContent(options) {
        this.options = options;
        this.update();
    }
    render() {
        return React.createElement('div', this.createContainerAttributes(), this.renderDiffListHeader());
    }
    /**
     * Create the container attributes for the widget.
     */
    createContainerAttributes() {
        return {
            style: { flexGrow: 0 }
        };
    }
    renderDiffListHeader() {
        return this.doRenderDiffListHeader(this.renderRepositoryHeader(), this.renderPathHeader(), this.renderRevisionHeader());
    }
    doRenderDiffListHeader(...children) {
        return React.createElement("div", { className: 'diff-header' }, ...children);
    }
    renderRepositoryHeader() {
        if (this.options && this.options.uri) {
            return this.renderHeaderRow({ name: 'repository', value: this.getRepositoryLabel(this.options.uri) });
        }
        return undefined;
    }
    getRepositoryLabel(uri) {
        const repository = this.scmService.findRepository(new uri_1.default(uri));
        const isSelectedRepo = this.scmService.selectedRepository && repository && this.scmService.selectedRepository.provider.rootUri === repository.provider.rootUri;
        return repository && !isSelectedRepo ? this.labelProvider.getLongName(new uri_1.default(repository.provider.rootUri)) : undefined;
    }
    renderPathHeader() {
        return this.renderHeaderRow({
            classNames: ['diff-header'],
            name: 'path',
            value: this.renderPath()
        });
    }
    renderPath() {
        if (this.options.uri) {
            const path = this.scmLabelProvider.relativePath(this.options.uri);
            if (path.length > 0) {
                return '/' + path;
            }
            else {
                return this.labelProvider.getLongName(new uri_1.default(this.options.uri));
            }
        }
        return null;
    }
    renderRevisionHeader() {
        return this.renderHeaderRow({
            classNames: ['diff-header'],
            name: 'revision: ',
            value: this.renderRevision()
        });
    }
    renderRevision() {
        if (!this.fromRevision) {
            return null;
        }
        if (typeof this.fromRevision === 'string') {
            return this.fromRevision;
        }
        return (this.toRevision || 'HEAD') + '~' + this.fromRevision;
    }
    renderHeaderRow({ name, value, classNames, title }) {
        if (!value) {
            return;
        }
        const className = ['header-row', ...(classNames || [])].join(' ');
        return React.createElement("div", { key: name, className: className, title: title },
            React.createElement("div", { className: 'theia-header' }, name),
            React.createElement("div", { className: 'header-value' }, value));
    }
    get toRevision() {
        return this.options.range && this.options.range.toRevision;
    }
    get fromRevision() {
        return this.options.range && this.options.range.fromRevision;
    }
    storeState() {
        const { options } = this;
        return {
            options
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    restoreState(oldState) {
        const options = oldState['options'];
        this.setContent(options);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], GitDiffHeaderWidget.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], GitDiffHeaderWidget.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], GitDiffHeaderWidget.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(scm_file_change_label_provider_1.ScmFileChangeLabelProvider),
    __metadata("design:type", scm_file_change_label_provider_1.ScmFileChangeLabelProvider)
], GitDiffHeaderWidget.prototype, "scmLabelProvider", void 0);
GitDiffHeaderWidget = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], GitDiffHeaderWidget);
exports.GitDiffHeaderWidget = GitDiffHeaderWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/diff/git-diff-header-widget'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/diff/git-diff-tree-model.js":
/*!******************************************************************!*\
  !*** ../../packages/git/lib/browser/diff/git-diff-tree-model.js ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitDiffTreeModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const scm_tree_model_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-tree-model */ "../../packages/scm/lib/browser/scm-tree-model.js");
const common_2 = __webpack_require__(/*! ../../common */ "../../packages/git/lib/common/index.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const git_scm_provider_1 = __webpack_require__(/*! ../git-scm-provider */ "../../packages/git/lib/browser/git-scm-provider.js");
const git_resource_opener_1 = __webpack_require__(/*! ./git-resource-opener */ "../../packages/git/lib/browser/diff/git-resource-opener.js");
let GitDiffTreeModel = class GitDiffTreeModel extends scm_tree_model_1.ScmTreeModel {
    constructor() {
        super();
        this._groups = [];
        this.toDisposeOnContentChange = new common_1.DisposableCollection();
        this.toDispose.push(this.toDisposeOnContentChange);
    }
    async setContent(options) {
        const { rootUri, diffOptions } = options;
        this.toDisposeOnContentChange.dispose();
        const scmRepository = this.scmService.findRepository(new uri_1.default(rootUri));
        if (scmRepository && scmRepository.provider.id === 'git') {
            const provider = scmRepository.provider;
            this.provider = provider;
            this.diffOptions = diffOptions;
            this.refreshRepository(provider);
            this.toDisposeOnContentChange.push(provider.onDidChange(() => {
                this.refreshRepository(provider);
            }));
        }
    }
    async refreshRepository(provider) {
        const repository = { localUri: provider.rootUri };
        const gitFileChanges = await this.git.diff(repository, this.diffOptions);
        const group = { id: 'changes', label: 'Files Changed', resources: [], provider, dispose: () => { } };
        const resources = gitFileChanges
            .map(change => new git_scm_provider_1.GitScmFileChange(change, provider, this.diffOptions.range))
            .map(change => ({
            sourceUri: new uri_1.default(change.uri),
            decorations: {
                letter: common_2.GitFileStatus.toAbbreviation(change.gitFileChange.status, true),
                color: common_2.GitFileStatus.getColor(change.gitFileChange.status, true),
                tooltip: common_2.GitFileStatus.toString(change.gitFileChange.status, true)
            },
            open: async () => this.open(change),
            group,
        }));
        const changesGroup = { ...group, resources };
        this._groups = [changesGroup];
        this.root = this.createTree();
    }
    get rootUri() {
        if (this.provider) {
            return this.provider.rootUri;
        }
    }
    ;
    canTabToWidget() {
        return true;
    }
    get groups() {
        return this._groups;
    }
    ;
    async open(change) {
        const uriToOpen = change.getUriToOpen();
        await this.resourceOpener.open(uriToOpen);
    }
    storeState() {
        if (this.provider) {
            return {
                ...super.storeState(),
                rootUri: this.provider.rootUri,
                diffOptions: this.diffOptions,
            };
        }
        else {
            return super.storeState();
        }
    }
    restoreState(oldState) {
        super.restoreState(oldState);
        if (oldState.rootUri && oldState.diffOptions) {
            this.setContent(oldState);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_2.Git),
    __metadata("design:type", Object)
], GitDiffTreeModel.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], GitDiffTreeModel.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(git_resource_opener_1.GitResourceOpener),
    __metadata("design:type", Object)
], GitDiffTreeModel.prototype, "resourceOpener", void 0);
GitDiffTreeModel = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], GitDiffTreeModel);
exports.GitDiffTreeModel = GitDiffTreeModel;
(function (GitDiffTreeModel) {
    ;
})(GitDiffTreeModel = exports.GitDiffTreeModel || (exports.GitDiffTreeModel = {}));
exports.GitDiffTreeModel = GitDiffTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/diff/git-diff-tree-model'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/diff/git-diff-widget.js":
/*!**************************************************************!*\
  !*** ../../packages/git/lib/browser/diff/git-diff-widget.js ***!
  \**************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitDiffWidget = exports.GIT_DIFF = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const git_diff_tree_model_1 = __webpack_require__(/*! ./git-diff-tree-model */ "../../packages/git/lib/browser/diff/git-diff-tree-model.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/git/lib/common/index.js");
const git_diff_header_widget_1 = __webpack_require__(/*! ./git-diff-header-widget */ "../../packages/git/lib/browser/diff/git-diff-header-widget.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const git_repository_provider_1 = __webpack_require__(/*! ../git-repository-provider */ "../../packages/git/lib/browser/git-repository-provider.js");
const scm_tree_widget_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-tree-widget */ "../../packages/scm/lib/browser/scm-tree-widget.js");
const scm_preferences_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-preferences */ "../../packages/scm/lib/browser/scm-preferences.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
exports.GIT_DIFF = 'git-diff';
let GitDiffWidget = class GitDiffWidget extends browser_1.BaseWidget {
    constructor() {
        super();
        this.GIT_DIFF_TITLE = core_1.nls.localize('theia/git/diff', 'Diff');
        this.id = exports.GIT_DIFF;
        this.title.label = this.GIT_DIFF_TITLE;
        this.title.caption = this.GIT_DIFF_TITLE;
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('git-compare');
        this.addClass('theia-scm');
        this.addClass('theia-git');
        this.addClass('git-diff-container');
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
        this.containerLayout.addWidget(this.diffHeaderWidget);
        this.containerLayout.addWidget(this.resourceWidget);
        this.updateViewMode(this.scmPreferences.get('scm.defaultViewMode'));
        this.toDispose.push(this.scmPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'scm.defaultViewMode') {
                this.updateViewMode(e.newValue);
            }
        }));
    }
    set viewMode(mode) {
        this.resourceWidget.viewMode = mode;
    }
    get viewMode() {
        return this.resourceWidget.viewMode;
    }
    async setContent(options) {
        this.model.setContent(options);
        this.diffHeaderWidget.setContent(options.diffOptions);
        this.update();
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
    updateImmediately() {
        this.onUpdateRequest(browser_1.Widget.Msg.UpdateRequest);
    }
    onUpdateRequest(msg) {
        browser_1.MessageLoop.sendMessage(this.diffHeaderWidget, msg);
        browser_1.MessageLoop.sendMessage(this.resourceWidget, msg);
        super.onUpdateRequest(msg);
    }
    onAfterAttach(msg) {
        this.node.appendChild(this.diffHeaderWidget.node);
        this.node.appendChild(this.resourceWidget.node);
        super.onAfterAttach(msg);
        this.update();
    }
    goToPreviousChange() {
        this.resourceWidget.goToPreviousChange();
    }
    goToNextChange() {
        this.resourceWidget.goToNextChange();
    }
    storeState() {
        const state = {
            commitState: this.diffHeaderWidget.storeState(),
            changesTreeState: this.resourceWidget.storeState(),
        };
        return state;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    restoreState(oldState) {
        const { commitState, changesTreeState } = oldState;
        this.diffHeaderWidget.restoreState(commitState);
        this.resourceWidget.restoreState(changesTreeState);
    }
};
__decorate([
    (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider),
    __metadata("design:type", git_repository_provider_1.GitRepositoryProvider)
], GitDiffWidget.prototype, "repositoryProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.DiffNavigatorProvider),
    __metadata("design:type", Function)
], GitDiffWidget.prototype, "diffNavigatorProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], GitDiffWidget.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.GitWatcher),
    __metadata("design:type", common_1.GitWatcher)
], GitDiffWidget.prototype, "gitWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(git_diff_header_widget_1.GitDiffHeaderWidget),
    __metadata("design:type", git_diff_header_widget_1.GitDiffHeaderWidget)
], GitDiffWidget.prototype, "diffHeaderWidget", void 0);
__decorate([
    (0, inversify_1.inject)(scm_tree_widget_1.ScmTreeWidget),
    __metadata("design:type", scm_tree_widget_1.ScmTreeWidget)
], GitDiffWidget.prototype, "resourceWidget", void 0);
__decorate([
    (0, inversify_1.inject)(git_diff_tree_model_1.GitDiffTreeModel),
    __metadata("design:type", git_diff_tree_model_1.GitDiffTreeModel)
], GitDiffWidget.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], GitDiffWidget.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(scm_preferences_1.ScmPreferences),
    __metadata("design:type", Object)
], GitDiffWidget.prototype, "scmPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitDiffWidget.prototype, "init", null);
GitDiffWidget = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], GitDiffWidget);
exports.GitDiffWidget = GitDiffWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/diff/git-diff-widget'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/diff/git-opener-in-primary-area.js":
/*!*************************************************************************!*\
  !*** ../../packages/git/lib/browser/diff/git-opener-in-primary-area.js ***!
  \*************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitOpenerInPrimaryArea = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const editor_manager_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
let GitOpenerInPrimaryArea = class GitOpenerInPrimaryArea {
    async open(changeUri) {
        await this.editorManager.open(changeUri, { mode: 'reveal' });
    }
};
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], GitOpenerInPrimaryArea.prototype, "editorManager", void 0);
GitOpenerInPrimaryArea = __decorate([
    (0, inversify_1.injectable)()
], GitOpenerInPrimaryArea);
exports.GitOpenerInPrimaryArea = GitOpenerInPrimaryArea;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/diff/git-opener-in-primary-area'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/diff/git-resource-opener.js":
/*!******************************************************************!*\
  !*** ../../packages/git/lib/browser/diff/git-resource-opener.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitResourceOpener = void 0;
exports.GitResourceOpener = Symbol('GitResourceOpener');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/diff/git-resource-opener'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/dirty-diff/dirty-diff-contribution.js":
/*!****************************************************************************!*\
  !*** ../../packages/git/lib/browser/dirty-diff/dirty-diff-contribution.js ***!
  \****************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DirtyDiffContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const dirty_diff_decorator_1 = __webpack_require__(/*! @theia/scm/lib/browser/dirty-diff/dirty-diff-decorator */ "../../packages/scm/lib/browser/dirty-diff/dirty-diff-decorator.js");
const dirty_diff_manager_1 = __webpack_require__(/*! ./dirty-diff-manager */ "../../packages/git/lib/browser/dirty-diff/dirty-diff-manager.js");
let DirtyDiffContribution = class DirtyDiffContribution {
    constructor(dirtyDiffManager, dirtyDiffDecorator) {
        this.dirtyDiffManager = dirtyDiffManager;
        this.dirtyDiffDecorator = dirtyDiffDecorator;
    }
    onStart(app) {
        this.dirtyDiffManager.onDirtyDiffUpdate(update => this.dirtyDiffDecorator.applyDecorations(update));
    }
};
DirtyDiffContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(dirty_diff_manager_1.DirtyDiffManager)),
    __param(1, (0, inversify_1.inject)(dirty_diff_decorator_1.DirtyDiffDecorator)),
    __metadata("design:paramtypes", [dirty_diff_manager_1.DirtyDiffManager,
        dirty_diff_decorator_1.DirtyDiffDecorator])
], DirtyDiffContribution);
exports.DirtyDiffContribution = DirtyDiffContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/dirty-diff/dirty-diff-contribution'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/dirty-diff/dirty-diff-manager.js":
/*!***********************************************************************!*\
  !*** ../../packages/git/lib/browser/dirty-diff/dirty-diff-manager.js ***!
  \***********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DirtyDiffModel = exports.DirtyDiffManager = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const content_lines_1 = __webpack_require__(/*! @theia/scm/lib/browser/dirty-diff/content-lines */ "../../packages/scm/lib/browser/dirty-diff/content-lines.js");
const diff_computer_1 = __webpack_require__(/*! @theia/scm/lib/browser/dirty-diff/diff-computer */ "../../packages/scm/lib/browser/dirty-diff/diff-computer.js");
const git_preferences_1 = __webpack_require__(/*! ../git-preferences */ "../../packages/git/lib/browser/git-preferences.js");
const git_resource_1 = __webpack_require__(/*! ../git-resource */ "../../packages/git/lib/browser/git-resource.js");
const git_resource_resolver_1 = __webpack_require__(/*! ../git-resource-resolver */ "../../packages/git/lib/browser/git-resource-resolver.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/git/lib/common/index.js");
const git_repository_tracker_1 = __webpack_require__(/*! ../git-repository-tracker */ "../../packages/git/lib/browser/git-repository-tracker.js");
const throttle = __webpack_require__(/*! @theia/core/shared/lodash.throttle */ "../../packages/core/shared/lodash.throttle/index.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/dirty-diff/dirty-diff-manager'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/dirty-diff/dirty-diff-module.js":
/*!**********************************************************************!*\
  !*** ../../packages/git/lib/browser/dirty-diff/dirty-diff-module.js ***!
  \**********************************************************************/
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
exports.bindDirtyDiff = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const dirty_diff_contribution_1 = __webpack_require__(/*! ./dirty-diff-contribution */ "../../packages/git/lib/browser/dirty-diff/dirty-diff-contribution.js");
const dirty_diff_manager_1 = __webpack_require__(/*! ./dirty-diff-manager */ "../../packages/git/lib/browser/dirty-diff/dirty-diff-manager.js");
function bindDirtyDiff(bind) {
    bind(dirty_diff_manager_1.DirtyDiffManager).toSelf().inSingletonScope();
    bind(dirty_diff_contribution_1.DirtyDiffContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(dirty_diff_contribution_1.DirtyDiffContribution);
}
exports.bindDirtyDiff = bindDirtyDiff;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/dirty-diff/dirty-diff-module'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-commit-message-validator.js":
/*!**********************************************************************!*\
  !*** ../../packages/git/lib/browser/git-commit-message-validator.js ***!
  \**********************************************************************/
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
var GitCommitMessageValidator_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitCommitMessageValidator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const scm_input_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-input */ "../../packages/scm/lib/browser/scm-input.js");
let GitCommitMessageValidator = GitCommitMessageValidator_1 = class GitCommitMessageValidator {
    /**
     * Validates the input and returns with either a validation result with the status and message, or `undefined` if everything went fine.
     */
    validate(input) {
        if (input) {
            const lines = input.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const result = this.isLineValid(line, i);
                if (!!result) {
                    return result;
                }
            }
        }
        return undefined;
    }
    isLineValid(line, index) {
        if (index === 1 && line.length !== 0) {
            return {
                status: scm_input_1.ScmInputIssueType.Warning,
                message: 'The second line should be empty to separate the commit message from the body'
            };
        }
        const diff = line.length - this.maxCharsPerLine();
        if (diff > 0) {
            return {
                status: scm_input_1.ScmInputIssueType.Warning,
                message: `${diff} characters over ${this.maxCharsPerLine()} in current line`
            };
        }
        return undefined;
    }
    maxCharsPerLine() {
        return GitCommitMessageValidator_1.MAX_CHARS_PER_LINE;
    }
};
GitCommitMessageValidator.MAX_CHARS_PER_LINE = 72;
GitCommitMessageValidator = GitCommitMessageValidator_1 = __decorate([
    (0, inversify_1.injectable)()
], GitCommitMessageValidator);
exports.GitCommitMessageValidator = GitCommitMessageValidator;
(function (GitCommitMessageValidator) {
    let Result;
    (function (Result) {
        /**
         * `true` if the `message` and the `status` properties are the same on both `left` and `right`. Or both arguments are `undefined`. Otherwise, `false`.
         */
        function equal(left, right) {
            if (left && right) {
                return left.message === right.message && left.status === right.status;
            }
            return left === right;
        }
        Result.equal = equal;
    })(Result = GitCommitMessageValidator.Result || (GitCommitMessageValidator.Result = {}));
})(GitCommitMessageValidator = exports.GitCommitMessageValidator || (exports.GitCommitMessageValidator = {}));
exports.GitCommitMessageValidator = GitCommitMessageValidator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-commit-message-validator'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-contribution.js":
/*!**********************************************************!*\
  !*** ../../packages/git/lib/browser/git-contribution.js ***!
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
exports.GitContribution = exports.GIT_MENUS = exports.GIT_COMMANDS = void 0;
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
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const git_repository_tracker_1 = __webpack_require__(/*! ./git-repository-tracker */ "../../packages/git/lib/browser/git-repository-tracker.js");
const git_quick_open_service_1 = __webpack_require__(/*! ./git-quick-open-service */ "../../packages/git/lib/browser/git-quick-open-service.js");
const git_sync_service_1 = __webpack_require__(/*! ./git-sync-service */ "../../packages/git/lib/browser/git-sync-service.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const git_repository_provider_1 = __webpack_require__(/*! ./git-repository-provider */ "../../packages/git/lib/browser/git-repository-provider.js");
const git_error_handler_1 = __webpack_require__(/*! ../browser/git-error-handler */ "../../packages/git/lib/browser/git-error-handler.js");
const scm_widget_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-widget */ "../../packages/scm/lib/browser/scm-widget.js");
const scm_tree_widget_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-tree-widget */ "../../packages/scm/lib/browser/scm-tree-widget.js");
const progress_service_1 = __webpack_require__(/*! @theia/core/lib/common/progress-service */ "../../packages/core/lib/common/progress-service.js");
const git_preferences_1 = __webpack_require__(/*! ./git-preferences */ "../../packages/git/lib/browser/git-preferences.js");
const scm_input_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-input */ "../../packages/scm/lib/browser/scm-input.js");
const decorations_service_1 = __webpack_require__(/*! @theia/core/lib/browser/decorations-service */ "../../packages/core/lib/browser/decorations-service.js");
const git_decoration_provider_1 = __webpack_require__(/*! ./git-decoration-provider */ "../../packages/git/lib/browser/git-decoration-provider.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
var GIT_COMMANDS;
(function (GIT_COMMANDS) {
    const GIT_CATEGORY_KEY = 'vscode.git/package/displayName';
    const GIT_CATEGORY = 'Git';
    GIT_COMMANDS.CLONE = core_1.Command.toLocalizedCommand({
        id: 'git.clone',
        category: GIT_CATEGORY,
        label: 'Clone...'
    }, 'vscode.git/package/command.clone', GIT_CATEGORY_KEY);
    GIT_COMMANDS.FETCH = core_1.Command.toLocalizedCommand({
        id: 'git.fetch',
        category: GIT_CATEGORY,
        label: 'Fetch...'
    }, 'vscode.git/package/command.fetch', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PULL_DEFAULT = core_1.Command.toLocalizedCommand({
        id: 'git.pull.default',
        category: GIT_CATEGORY,
        label: 'Pull'
    }, 'vscode.git/package/command.pull', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PULL_DEFAULT_FAVORITE = {
        id: GIT_COMMANDS.PULL_DEFAULT.id + '.favorite',
        label: GIT_COMMANDS.PULL_DEFAULT.label,
        originalLabel: GIT_COMMANDS.PULL_DEFAULT.originalLabel
    };
    GIT_COMMANDS.PULL = core_1.Command.toLocalizedCommand({
        id: 'git.pull',
        category: GIT_CATEGORY,
        label: 'Pull from...'
    }, 'vscode.git/package/command.pullFrom', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PUSH_DEFAULT = core_1.Command.toLocalizedCommand({
        id: 'git.push.default',
        category: GIT_CATEGORY,
        label: 'Push'
    }, 'vscode.git/package/command.push', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PUSH_DEFAULT_FAVORITE = {
        id: GIT_COMMANDS.PUSH_DEFAULT.id + '.favorite',
        label: GIT_COMMANDS.PUSH_DEFAULT.label,
        originalLabel: GIT_COMMANDS.PUSH_DEFAULT.originalLabel
    };
    GIT_COMMANDS.PUSH = core_1.Command.toLocalizedCommand({
        id: 'git.push',
        category: GIT_CATEGORY,
        label: 'Push to...'
    }, 'vscode.git/package/command.pushTo', GIT_CATEGORY_KEY);
    GIT_COMMANDS.MERGE = core_1.Command.toLocalizedCommand({
        id: 'git.merge',
        category: GIT_CATEGORY,
        label: 'Merge...'
    }, 'vscode.git/package/command.merge', GIT_CATEGORY_KEY);
    GIT_COMMANDS.CHECKOUT = core_1.Command.toLocalizedCommand({
        id: 'git.checkout',
        category: GIT_CATEGORY,
        label: 'Checkout'
    }, 'vscode.git/package/command.checkout', GIT_CATEGORY_KEY);
    GIT_COMMANDS.COMMIT = {
        ...core_1.Command.toLocalizedCommand({
            id: 'git.commit.all',
            label: 'Commit',
            iconClass: (0, browser_1.codicon)('check')
        }, 'vscode.git/package/command.commit'),
        tooltip: 'Commit all the staged changes',
    };
    GIT_COMMANDS.COMMIT_ADD_SIGN_OFF = core_1.Command.toLocalizedCommand({
        id: 'git-commit-add-sign-off',
        label: 'Add Signed-off-by',
        category: GIT_CATEGORY,
        iconClass: (0, browser_1.codicon)('edit')
    }, 'theia/git/addSignedOff', GIT_CATEGORY_KEY);
    GIT_COMMANDS.COMMIT_AMEND = {
        id: 'git.commit.amend'
    };
    GIT_COMMANDS.COMMIT_SIGN_OFF = {
        id: 'git.commit.signOff'
    };
    GIT_COMMANDS.OPEN_FILE = core_1.Command.toLocalizedCommand({
        id: 'git.open.file',
        category: GIT_CATEGORY,
        label: 'Open File',
        iconClass: (0, browser_1.codicon)('go-to-file')
    }, 'vscode.git/package/command.openFile', GIT_CATEGORY_KEY);
    GIT_COMMANDS.OPEN_CHANGED_FILE = core_1.Command.toLocalizedCommand({
        id: 'git.open.changed.file',
        category: GIT_CATEGORY,
        label: 'Open File',
        iconClass: (0, browser_1.codicon)('go-to-file')
    }, 'vscode.git/package/command.openFile', GIT_CATEGORY_KEY);
    GIT_COMMANDS.OPEN_CHANGES = core_1.Command.toLocalizedCommand({
        id: 'git.open.changes',
        category: GIT_CATEGORY,
        label: 'Open Changes',
        iconClass: (0, browser_1.codicon)('git-compare')
    }, 'vscode.git/package/command.openChange', GIT_CATEGORY_KEY);
    GIT_COMMANDS.SYNC = core_1.Command.toLocalizedCommand({
        id: 'git.sync',
        category: GIT_CATEGORY,
        label: 'Sync'
    }, 'vscode.git/package/command.sync', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PUBLISH = core_1.Command.toLocalizedCommand({
        id: 'git.publish',
        category: GIT_CATEGORY,
        label: 'Publish Branch'
    }, 'vscode.git/package/command.publish', GIT_CATEGORY_KEY);
    GIT_COMMANDS.STAGE = core_1.Command.toLocalizedCommand({
        id: 'git.stage',
        category: GIT_CATEGORY,
        label: 'Stage Changes',
        iconClass: (0, browser_1.codicon)('add')
    }, 'vscode.git/package/command.stage', GIT_CATEGORY_KEY);
    GIT_COMMANDS.STAGE_ALL = core_1.Command.toLocalizedCommand({
        id: 'git.stage.all',
        category: GIT_CATEGORY,
        label: 'Stage All Changes',
        iconClass: (0, browser_1.codicon)('add')
    }, 'vscode.git/package/command.stageAll', GIT_CATEGORY_KEY);
    GIT_COMMANDS.UNSTAGE = core_1.Command.toLocalizedCommand({
        id: 'git.unstage',
        category: GIT_CATEGORY,
        label: 'Unstage Changes',
        iconClass: (0, browser_1.codicon)('dash')
    }, 'vscode.git/package/command.unstage', GIT_CATEGORY_KEY);
    GIT_COMMANDS.UNSTAGE_ALL = core_1.Command.toLocalizedCommand({
        id: 'git.unstage.all',
        category: GIT_CATEGORY,
        label: 'Unstage All',
        iconClass: (0, browser_1.codicon)('dash')
    }, 'vscode.git/package/command.unstageAll', GIT_CATEGORY_KEY);
    GIT_COMMANDS.DISCARD = core_1.Command.toLocalizedCommand({
        id: 'git.discard',
        iconClass: (0, browser_1.codicon)('discard'),
        category: GIT_CATEGORY,
        label: 'Discard Changes'
    }, 'vscode.git/package/command.clean', GIT_CATEGORY_KEY);
    GIT_COMMANDS.DISCARD_ALL = core_1.Command.toLocalizedCommand({
        id: 'git.discard.all',
        category: GIT_CATEGORY,
        label: 'Discard All Changes',
        iconClass: (0, browser_1.codicon)('discard')
    }, 'vscode.git/package/command.cleanAll', GIT_CATEGORY_KEY);
    GIT_COMMANDS.STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash',
        category: GIT_CATEGORY,
        label: 'Stash...'
    }, 'vscode.git/package/command.stash', GIT_CATEGORY_KEY);
    GIT_COMMANDS.APPLY_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.apply',
        category: GIT_CATEGORY,
        label: 'Apply Stash...'
    }, 'vscode.git/package/command.stashApply', GIT_CATEGORY_KEY);
    GIT_COMMANDS.APPLY_LATEST_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.apply.latest',
        category: GIT_CATEGORY,
        label: 'Apply Latest Stash'
    }, 'vscode.git/package/command.stashApplyLatest', GIT_CATEGORY_KEY);
    GIT_COMMANDS.POP_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.pop',
        category: GIT_CATEGORY,
        label: 'Pop Stash...'
    }, 'vscode.git/package/command.stashPop', GIT_CATEGORY_KEY);
    GIT_COMMANDS.POP_LATEST_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.pop.latest',
        category: GIT_CATEGORY,
        label: 'Pop Latest Stash'
    }, 'vscode.git/package/command.stashPopLatest', GIT_CATEGORY_KEY);
    GIT_COMMANDS.DROP_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.drop',
        category: GIT_CATEGORY,
        label: 'Drop Stash...'
    }, 'vscode.git/package/command.stashDrop', GIT_CATEGORY_KEY);
    GIT_COMMANDS.REFRESH = core_1.Command.toLocalizedCommand({
        id: 'git-refresh',
        label: 'Refresh',
        category: GIT_CATEGORY,
        iconClass: (0, browser_1.codicon)('refresh')
    }, 'vscode.git/package/command.refresh', GIT_CATEGORY_KEY);
    GIT_COMMANDS.INIT_REPOSITORY = core_1.Command.toLocalizedCommand({
        id: 'git-init',
        label: 'Initialize Repository',
        category: GIT_CATEGORY,
        iconClass: (0, browser_1.codicon)('add')
    }, 'vscode.git/package/command.init', GIT_CATEGORY_KEY);
})(GIT_COMMANDS = exports.GIT_COMMANDS || (exports.GIT_COMMANDS = {}));
var GIT_MENUS;
(function (GIT_MENUS) {
    // Top level Groups
    GIT_MENUS.FAV_GROUP = '2_favorites';
    GIT_MENUS.COMMANDS_GROUP = '3_commands';
    GIT_MENUS.SUBMENU_COMMIT = {
        group: GIT_MENUS.COMMANDS_GROUP,
        label: nls_1.nls.localize('vscode.git/package/submenu.commit', 'Commit'),
        menuGroups: ['1_commit'],
    };
    GIT_MENUS.SUBMENU_CHANGES = {
        group: GIT_MENUS.COMMANDS_GROUP,
        label: nls_1.nls.localize('vscode.git/package/submenu.changes', 'Changes'),
        menuGroups: ['1_changes']
    };
    GIT_MENUS.SUBMENU_PULL_PUSH = {
        group: GIT_MENUS.COMMANDS_GROUP,
        label: nls_1.nls.localize('vscode.git/package/submenu.pullpush', 'Pull, Push'),
        menuGroups: ['2_pull', '3_push', '4_fetch']
    };
    GIT_MENUS.SUBMENU_STASH = {
        group: GIT_MENUS.COMMANDS_GROUP,
        label: nls_1.nls.localize('vscode.git/package/submenu.stash', 'Stash'),
        menuGroups: ['1_stash']
    };
})(GIT_MENUS = exports.GIT_MENUS || (exports.GIT_MENUS = {}));
let GitContribution = class GitContribution {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
    }
    onStart() {
        this.updateStatusBar();
        this.repositoryTracker.onGitEvent(() => this.updateStatusBar());
        this.syncService.onDidChange(() => this.updateStatusBar());
        this.decorationsService.registerDecorationsProvider(this.gitDecorationProvider);
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_2.EditorContextMenu.NAVIGATION, {
            commandId: GIT_COMMANDS.OPEN_FILE.id
        });
        menus.registerMenuAction(browser_2.EditorContextMenu.NAVIGATION, {
            commandId: GIT_COMMANDS.OPEN_CHANGES.id
        });
        const registerResourceAction = (group, action) => {
            menus.registerMenuAction(scm_tree_widget_1.ScmTreeWidget.RESOURCE_INLINE_MENU, action);
            menus.registerMenuAction([...scm_tree_widget_1.ScmTreeWidget.RESOURCE_CONTEXT_MENU, group], action);
        };
        registerResourceAction('navigation', {
            commandId: GIT_COMMANDS.OPEN_CHANGED_FILE.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceAction('navigation', {
            commandId: GIT_COMMANDS.OPEN_CHANGED_FILE.id,
            when: 'scmProvider == git && scmResourceGroup == index'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.UNSTAGE.id,
            when: 'scmProvider == git && scmResourceGroup == index'
        });
        registerResourceAction('navigation', {
            commandId: GIT_COMMANDS.OPEN_CHANGED_FILE.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        const registerResourceFolderAction = (group, action) => {
            menus.registerMenuAction(scm_tree_widget_1.ScmTreeWidget.RESOURCE_FOLDER_INLINE_MENU, action);
            menus.registerMenuAction([...scm_tree_widget_1.ScmTreeWidget.RESOURCE_FOLDER_CONTEXT_MENU, group], action);
        };
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.UNSTAGE.id,
            when: 'scmProvider == git && scmResourceGroup == index'
        });
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        const registerResourceGroupAction = (group, action) => {
            menus.registerMenuAction(scm_tree_widget_1.ScmTreeWidget.RESOURCE_GROUP_INLINE_MENU, action);
            menus.registerMenuAction([...scm_tree_widget_1.ScmTreeWidget.RESOURCE_GROUP_CONTEXT_MENU, group], action);
        };
        registerResourceGroupAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE_ALL.id,
            when: 'scmProvider == git && scmResourceGroup == merge',
        });
        registerResourceGroupAction('1_modification', {
            commandId: GIT_COMMANDS.UNSTAGE_ALL.id,
            when: 'scmProvider == git && scmResourceGroup == index',
        });
        registerResourceGroupAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE_ALL.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges',
        });
        registerResourceGroupAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD_ALL.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges',
        });
    }
    registerCommands(registry) {
        registry.registerCommand(GIT_COMMANDS.FETCH, {
            execute: () => this.withProgress(() => this.quickOpenService.fetch()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PULL_DEFAULT, {
            execute: () => this.withProgress(() => this.quickOpenService.performDefaultGitAction(git_quick_open_service_1.GitAction.PULL)),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PULL_DEFAULT_FAVORITE, {
            execute: () => registry.executeCommand(GIT_COMMANDS.PULL_DEFAULT.id),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PULL, {
            execute: () => this.withProgress(() => this.quickOpenService.pull()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PUSH_DEFAULT, {
            execute: () => this.withProgress(() => this.quickOpenService.performDefaultGitAction(git_quick_open_service_1.GitAction.PUSH)),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PUSH_DEFAULT_FAVORITE, {
            execute: () => registry.executeCommand(GIT_COMMANDS.PUSH_DEFAULT.id),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PUSH, {
            execute: () => this.withProgress(() => this.quickOpenService.push()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.MERGE, {
            execute: () => this.withProgress(() => this.quickOpenService.merge()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.CHECKOUT, {
            execute: () => this.withProgress(() => this.quickOpenService.checkout()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.COMMIT_SIGN_OFF, {
            execute: () => this.withProgress(() => this.commit({ signOff: true })),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.COMMIT_AMEND, {
            execute: () => this.withProgress(async () => this.amend()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.STAGE_ALL, {
            execute: () => {
                const provider = this.repositoryProvider.selectedScmProvider;
                if (provider) {
                    if (this.gitPreferences['git.untrackedChanges'] === 'mixed') {
                        return this.withProgress(() => provider.stageAll());
                    }
                    else {
                        const toStage = provider.unstagedChanges.concat(provider.mergeChanges)
                            .filter(change => change.status !== common_1.GitFileStatus.New)
                            .map(change => change.uri.toString());
                        return this.withProgress(() => provider.stage(toStage));
                    }
                }
            },
            isEnabled: () => {
                const provider = this.repositoryProvider.selectedScmProvider;
                if (!provider) {
                    return false;
                }
                if (this.gitPreferences['git.untrackedChanges'] === 'mixed') {
                    return Boolean(provider.unstagedChanges.length || provider.mergeChanges.length);
                }
                else {
                    const isNotUntracked = (change) => change.status !== common_1.GitFileStatus.New;
                    return Boolean(provider.unstagedChanges.filter(isNotUntracked).length || provider.mergeChanges.filter(isNotUntracked).length);
                }
            }
        });
        registry.registerCommand(GIT_COMMANDS.UNSTAGE_ALL, {
            execute: () => {
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.unstageAll());
            },
            isEnabled: () => !!this.repositoryProvider.selectedScmProvider
        });
        registry.registerCommand(GIT_COMMANDS.DISCARD_ALL, {
            execute: () => {
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.discardAll());
            },
            isEnabled: () => !!this.repositoryProvider.selectedScmProvider
        });
        registry.registerCommand(GIT_COMMANDS.OPEN_FILE, {
            execute: widget => this.openFile(widget),
            isEnabled: widget => !!this.getOpenFileOptions(widget),
            isVisible: widget => !!this.getOpenFileOptions(widget)
        });
        registry.registerCommand(GIT_COMMANDS.OPEN_CHANGES, {
            execute: widget => this.openChanges(widget),
            isEnabled: widget => !!this.getOpenChangesOptions(widget),
            isVisible: widget => !!this.getOpenChangesOptions(widget)
        });
        registry.registerCommand(GIT_COMMANDS.SYNC, {
            execute: () => this.withProgress(() => this.syncService.sync()),
            isEnabled: () => this.syncService.canSync(),
            isVisible: () => this.syncService.canSync()
        });
        registry.registerCommand(GIT_COMMANDS.PUBLISH, {
            execute: () => this.withProgress(() => this.syncService.publish()),
            isEnabled: () => this.syncService.canPublish(),
            isVisible: () => this.syncService.canPublish()
        });
        registry.registerCommand(GIT_COMMANDS.CLONE, {
            isEnabled: () => this.workspaceService.opened,
            execute: (url, folder, branch) => this.quickOpenService.clone(url, folder, branch)
        });
        registry.registerCommand(GIT_COMMANDS.COMMIT, {
            execute: () => this.withProgress(() => this.commit()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.REFRESH, {
            execute: () => this.withProgress(() => this.repositoryProvider.refresh())
        });
        registry.registerCommand(GIT_COMMANDS.COMMIT_ADD_SIGN_OFF, {
            execute: async () => this.withProgress(() => this.addSignOff()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.UNSTAGE, {
            execute: (...arg) => {
                const resources = arg.filter(r => r.sourceUri).map(r => r.sourceUri.toString());
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.unstage(resources));
            },
            isEnabled: (...arg) => !!this.repositoryProvider.selectedScmProvider
                && arg.some(r => r.sourceUri)
        });
        registry.registerCommand(GIT_COMMANDS.STAGE, {
            execute: (...arg) => {
                const resources = arg.filter(r => r.sourceUri).map(r => r.sourceUri.toString());
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.stage(resources));
            },
            isEnabled: (...arg) => !!this.repositoryProvider.selectedScmProvider
                && arg.some(r => r.sourceUri)
        });
        registry.registerCommand(GIT_COMMANDS.DISCARD, {
            execute: (...arg) => {
                const resources = arg.filter(r => r.sourceUri).map(r => r.sourceUri.toString());
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.discard(resources));
            },
            isEnabled: (...arg) => !!this.repositoryProvider.selectedScmProvider
                && arg.some(r => r.sourceUri)
        });
        registry.registerCommand(GIT_COMMANDS.OPEN_CHANGED_FILE, {
            execute: (...arg) => {
                for (const resource of arg) {
                    this.editorManager.open(resource.sourceUri, { mode: 'reveal' });
                }
            }
        });
        registry.registerCommand(GIT_COMMANDS.STASH, {
            execute: () => this.quickOpenService.stash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository &&
                !!this.repositoryTracker.selectedRepositoryStatus &&
                this.repositoryTracker.selectedRepositoryStatus.changes.length > 0
        });
        registry.registerCommand(GIT_COMMANDS.APPLY_STASH, {
            execute: () => this.quickOpenService.applyStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.APPLY_LATEST_STASH, {
            execute: () => this.quickOpenService.applyLatestStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.POP_STASH, {
            execute: () => this.quickOpenService.popStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.POP_LATEST_STASH, {
            execute: () => this.quickOpenService.popLatestStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.DROP_STASH, {
            execute: () => this.quickOpenService.dropStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.INIT_REPOSITORY, {
            execute: () => this.quickOpenService.initRepository(),
            isEnabled: widget => this.workspaceService.opened && (!widget || widget instanceof scm_widget_1.ScmWidget) && !this.repositoryProvider.selectedRepository,
            isVisible: widget => this.workspaceService.opened && (!widget || widget instanceof scm_widget_1.ScmWidget) && !this.repositoryProvider.selectedRepository
        });
    }
    async amend() {
        {
            const scmRepository = this.repositoryProvider.selectedScmRepository;
            if (!scmRepository) {
                return;
            }
            try {
                const lastCommit = await scmRepository.provider.amendSupport.getLastCommit();
                if (lastCommit === undefined) {
                    scmRepository.input.issue = {
                        type: scm_input_1.ScmInputIssueType.Error,
                        message: nls_1.nls.localize('theia/git/noPreviousCommit', 'No previous commit to amend')
                    };
                    scmRepository.input.focus();
                    return;
                }
                const message = await this.quickOpenService.commitMessageForAmend();
                await this.commit({ message, amend: true });
            }
            catch (e) {
                if (!(e instanceof Error) || e.message !== 'User abort.') {
                    throw e;
                }
            }
        }
    }
    withProgress(task) {
        return this.progressService.withProgress('', 'scm', task);
    }
    registerToolbarItems(registry) {
        registry.registerItem({
            id: GIT_COMMANDS.OPEN_FILE.id,
            command: GIT_COMMANDS.OPEN_FILE.id,
            tooltip: GIT_COMMANDS.OPEN_FILE.label
        });
        registry.registerItem({
            id: GIT_COMMANDS.OPEN_CHANGES.id,
            command: GIT_COMMANDS.OPEN_CHANGES.id,
            tooltip: GIT_COMMANDS.OPEN_CHANGES.label
        });
        registry.registerItem({
            id: GIT_COMMANDS.INIT_REPOSITORY.id,
            command: GIT_COMMANDS.INIT_REPOSITORY.id,
            tooltip: GIT_COMMANDS.INIT_REPOSITORY.label
        });
        const registerItem = (item) => {
            const commandId = item.command;
            const id = '__git.tabbar.toolbar.' + commandId;
            const command = this.commands.getCommand(commandId);
            this.commands.registerCommand({ id, iconClass: command && command.iconClass }, {
                execute: (widget, ...args) => widget instanceof scm_widget_1.ScmWidget && this.commands.executeCommand(commandId, ...args),
                isEnabled: (widget, ...args) => widget instanceof scm_widget_1.ScmWidget && this.commands.isEnabled(commandId, ...args),
                isVisible: (widget, ...args) => widget instanceof scm_widget_1.ScmWidget &&
                    this.commands.isVisible(commandId, ...args) &&
                    !!this.repositoryProvider.selectedRepository
            });
            item.command = id;
            registry.registerItem(item);
        };
        registerItem({
            id: GIT_COMMANDS.COMMIT.id,
            command: GIT_COMMANDS.COMMIT.id,
            tooltip: GIT_COMMANDS.COMMIT.label
        });
        registerItem({
            id: GIT_COMMANDS.REFRESH.id,
            command: GIT_COMMANDS.REFRESH.id,
            tooltip: GIT_COMMANDS.REFRESH.label
        });
        registerItem({
            id: GIT_COMMANDS.COMMIT_ADD_SIGN_OFF.id,
            command: GIT_COMMANDS.COMMIT_ADD_SIGN_OFF.id,
            tooltip: GIT_COMMANDS.COMMIT_ADD_SIGN_OFF.label
        });
        // Favorites menu group
        [GIT_COMMANDS.PULL_DEFAULT_FAVORITE, GIT_COMMANDS.PUSH_DEFAULT_FAVORITE].forEach((command, index) => registerItem({
            id: command.id + '_fav',
            command: command.id,
            tooltip: command.label,
            group: GIT_MENUS.FAV_GROUP,
            priority: 100 - index
        }));
        registerItem({
            id: GIT_COMMANDS.COMMIT_AMEND.id,
            command: GIT_COMMANDS.COMMIT_AMEND.id,
            tooltip: nls_1.nls.localize('vscode.git/package/command.commitStagedAmend', 'Commit (Amend)'),
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_COMMIT)
        });
        registerItem({
            id: GIT_COMMANDS.COMMIT_SIGN_OFF.id,
            command: GIT_COMMANDS.COMMIT_SIGN_OFF.id,
            tooltip: nls_1.nls.localize('vscode.git/package/command.commitStagedSigned', 'Commit (Signed Off)'),
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_COMMIT)
        });
        [GIT_COMMANDS.PULL_DEFAULT, GIT_COMMANDS.PULL].forEach(command => registerItem({
            id: command.id,
            command: command.id,
            tooltip: command.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_PULL_PUSH)
        }));
        [GIT_COMMANDS.PUSH_DEFAULT, GIT_COMMANDS.PUSH].forEach(command => registerItem({
            id: command.id,
            command: command.id,
            tooltip: command.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_PULL_PUSH, 1)
        }));
        registerItem({
            id: GIT_COMMANDS.FETCH.id,
            command: GIT_COMMANDS.FETCH.id,
            tooltip: GIT_COMMANDS.FETCH.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_PULL_PUSH, 2)
        });
        [
            GIT_COMMANDS.STASH, GIT_COMMANDS.APPLY_STASH,
            GIT_COMMANDS.APPLY_LATEST_STASH, GIT_COMMANDS.POP_STASH,
            GIT_COMMANDS.POP_LATEST_STASH, GIT_COMMANDS.DROP_STASH
        ].forEach((command, index) => registerItem({
            id: command.id,
            command: command.id,
            tooltip: command.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_STASH),
            priority: 100 - index
        }));
        registerItem({
            id: GIT_COMMANDS.STAGE_ALL.id,
            command: GIT_COMMANDS.STAGE_ALL.id,
            tooltip: GIT_COMMANDS.STAGE_ALL.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_CHANGES),
            priority: 30
        });
        registerItem({
            id: GIT_COMMANDS.UNSTAGE_ALL.id,
            command: GIT_COMMANDS.UNSTAGE_ALL.id,
            tooltip: GIT_COMMANDS.UNSTAGE_ALL.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_CHANGES),
            priority: 20
        });
        registerItem({
            id: GIT_COMMANDS.DISCARD_ALL.id,
            command: GIT_COMMANDS.DISCARD_ALL.id,
            tooltip: GIT_COMMANDS.DISCARD_ALL.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_CHANGES),
            priority: 10
        });
        registerItem({
            id: GIT_COMMANDS.MERGE.id,
            command: GIT_COMMANDS.MERGE.id,
            tooltip: GIT_COMMANDS.MERGE.label,
            group: GIT_MENUS.COMMANDS_GROUP
        });
    }
    asSubMenuItemOf(submenu, groupIdx = 0) {
        return submenu.group + '/' + submenu.label + '/' + submenu.menuGroups[groupIdx];
    }
    hasConflicts(changes) {
        return changes.some(c => c.status === common_1.GitFileStatus.Conflicted);
    }
    allStaged(changes) {
        return !changes.some(c => !c.staged);
    }
    async openFile(widget) {
        const options = this.getOpenFileOptions(widget);
        return options && this.editorManager.open(options.uri, options.options);
    }
    getOpenFileOptions(widget) {
        const ref = widget ? widget : this.editorManager.currentEditor;
        if (ref instanceof browser_2.EditorWidget && browser_1.DiffUris.isDiffUri(ref.editor.uri)) {
            const [, right] = browser_1.DiffUris.decode(ref.editor.uri);
            const uri = right.withScheme('file');
            const selection = ref.editor.selection;
            return { uri, options: { selection, widgetOptions: { ref } } };
        }
        return undefined;
    }
    async openChanges(widget) {
        const options = this.getOpenChangesOptions(widget);
        if (options) {
            const provider = this.repositoryProvider.selectedScmProvider;
            return provider && provider.openChange(options.change, options.options);
        }
        return undefined;
    }
    getOpenChangesOptions(widget) {
        const provider = this.repositoryProvider.selectedScmProvider;
        if (!provider) {
            return undefined;
        }
        const ref = widget ? widget : this.editorManager.currentEditor;
        if (ref instanceof browser_2.EditorWidget && !browser_1.DiffUris.isDiffUri(ref.editor.uri)) {
            const uri = ref.editor.uri;
            const change = provider.findChange(uri);
            if (change && provider.getUriToOpen(change).toString() !== uri.toString()) {
                const selection = ref.editor.selection;
                return { change, options: { selection, widgetOptions: { ref } } };
            }
        }
        return undefined;
    }
    updateStatusBar() {
        const scmProvider = this.repositoryProvider.selectedScmProvider;
        if (!scmProvider) {
            return;
        }
        const statusBarCommands = [];
        const checkoutCommand = this.getCheckoutStatusBarCommand();
        if (checkoutCommand) {
            statusBarCommands.push(checkoutCommand);
        }
        const syncCommand = this.getSyncStatusBarCommand();
        if (syncCommand) {
            statusBarCommands.push(syncCommand);
        }
        scmProvider.statusBarCommands = statusBarCommands;
    }
    getCheckoutStatusBarCommand() {
        const scmProvider = this.repositoryProvider.selectedScmProvider;
        if (!scmProvider) {
            return undefined;
        }
        const status = scmProvider.getStatus();
        if (!status) {
            return undefined;
        }
        const branch = status.branch ? status.branch : status.currentHead ? status.currentHead.substring(0, 8) : 'NO-HEAD';
        const changes = (scmProvider.unstagedChanges.length > 0 ? '*' : '')
            + (scmProvider.stagedChanges.length > 0 ? '+' : '')
            + (scmProvider.mergeChanges.length > 0 ? '!' : '');
        return {
            command: GIT_COMMANDS.CHECKOUT.id,
            title: `$(codicon-source-control) ${branch}${changes}`,
            tooltip: `${branch}${changes}`
        };
    }
    getSyncStatusBarCommand() {
        const status = this.repositoryTracker.selectedRepositoryStatus;
        if (!status || !status.branch) {
            return undefined;
        }
        if (this.syncService.isSyncing()) {
            return {
                title: '$(codicon-sync~spin)',
                tooltip: nls_1.nls.localize('vscode.git/statusbar/syncing changes', 'Synchronizing Changes...')
            };
        }
        const { upstreamBranch, aheadBehind } = status;
        if (upstreamBranch) {
            return {
                title: '$(codicon-sync)' + (aheadBehind && (aheadBehind.ahead + aheadBehind.behind) > 0 ? ` ${aheadBehind.behind}↓ ${aheadBehind.ahead}↑` : ''),
                command: GIT_COMMANDS.SYNC.id,
                tooltip: nls_1.nls.localize('vscode.git/repository/sync changes', 'Synchronize Changes')
            };
        }
        return {
            title: '$(codicon-cloud-upload)',
            command: GIT_COMMANDS.PUBLISH.id,
            tooltip: nls_1.nls.localize('vscode.git/statusbar/publish changes', 'Publish Changes')
        };
    }
    async commit(options = {}) {
        const scmRepository = this.repositoryProvider.selectedScmRepository;
        if (!scmRepository) {
            return;
        }
        const message = options.message || scmRepository.input.value;
        if (!message.trim()) {
            scmRepository.input.issue = {
                type: scm_input_1.ScmInputIssueType.Error,
                message: nls_1.nls.localize('vscode.git/repository/commitMessageWhitespacesOnlyWarning', 'Please provide a commit message')
            };
            scmRepository.input.focus();
            return;
        }
        if (!scmRepository.provider.stagedChanges.length) {
            scmRepository.input.issue = {
                type: scm_input_1.ScmInputIssueType.Error,
                message: nls_1.nls.localize('vscode.git/commands/no changes', 'No changes added to commit')
            };
            scmRepository.input.focus();
            return;
        }
        scmRepository.input.issue = undefined;
        try {
            // We can make sure, repository exists, otherwise we would not have this button.
            const amend = options.amend;
            const signOff = options.signOff || this.gitPreferences['git.alwaysSignOff'];
            const repository = scmRepository.provider.repository;
            await this.git.commit(repository, message, { signOff, amend });
            scmRepository.input.value = '';
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async addSignOff() {
        const scmRepository = this.repositoryProvider.selectedScmRepository;
        if (!scmRepository) {
            return;
        }
        try {
            const repository = scmRepository.provider.repository;
            const [username, email] = (await Promise.all([
                this.git.exec(repository, ['config', 'user.name']),
                this.git.exec(repository, ['config', 'user.email'])
            ])).map(result => result.stdout.trim());
            const signOff = `\n\nSigned-off-by: ${username} <${email}>`;
            const value = scmRepository.input.value;
            if (value.endsWith(signOff)) {
                scmRepository.input.value = value.substring(0, value.length - signOff.length);
            }
            else {
                scmRepository.input.value = `${value}${signOff}`;
            }
            scmRepository.input.focus();
        }
        catch (e) {
            scmRepository.input.issue = {
                type: scm_input_1.ScmInputIssueType.Warning,
                message: nls_1.nls.localize('theia/git/missingUserInfo', 'Make sure you configure your \'user.name\' and \'user.email\' in git.')
            };
        }
    }
    /**
     * It should be aligned with https://code.visualstudio.com/api/references/theme-color#git-colors
     */
    registerColors(colors) {
        colors.register({
            id: 'gitDecoration.addedResourceForeground',
            description: 'Color for added resources.',
            defaults: {
                light: '#587c0c',
                dark: '#81b88b',
                hcDark: '#a1e3ad',
                hcLight: '#374e06'
            }
        }, {
            id: 'gitDecoration.modifiedResourceForeground',
            description: 'Color for modified resources.',
            defaults: {
                light: '#895503',
                dark: '#E2C08D',
                hcDark: '#E2C08D',
                hcLight: '#895503'
            }
        }, {
            id: 'gitDecoration.deletedResourceForeground',
            description: 'Color for deleted resources.',
            defaults: {
                light: '#ad0707',
                dark: '#c74e39',
                hcDark: '#c74e39',
                hcLight: '#ad0707'
            }
        }, {
            id: 'gitDecoration.untrackedResourceForeground',
            description: 'Color for untracked resources.',
            defaults: {
                light: '#007100',
                dark: '#73C991',
                hcDark: '#73C991',
                hcLight: '#007100'
            }
        }, {
            id: 'gitDecoration.conflictingResourceForeground',
            description: 'Color for resources with conflicts.',
            defaults: {
                light: '#6c6cc4',
                dark: '#6c6cc4',
                hcDark: '#c74e39',
                hcLight: '#ad0707'
            }
        }, {
            id: 'gitlens.gutterBackgroundColor',
            description: 'Specifies the background color of the gutter blame annotations',
            defaults: {
                dark: '#FFFFFF13',
                light: '#0000000C',
                hcDark: '#FFFFFF13'
            }
        }, {
            id: 'gitlens.gutterForegroundColor',
            description: 'Specifies the foreground color of the gutter blame annotations',
            defaults: {
                dark: '#BEBEBE',
                light: '#747474',
                hcDark: '#BEBEBE'
            }
        }, {
            id: 'gitlens.lineHighlightBackgroundColor',
            description: 'Specifies the background color of the associated line highlights in blame annotations',
            defaults: {
                dark: '#00BCF233',
                light: '#00BCF233',
                hcDark: '#00BCF233'
            }
        });
    }
};
GitContribution.GIT_CHECKOUT = 'git.checkout';
GitContribution.GIT_SYNC_STATUS = 'git-sync-status';
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], GitContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(git_quick_open_service_1.GitQuickOpenService),
    __metadata("design:type", git_quick_open_service_1.GitQuickOpenService)
], GitContribution.prototype, "quickOpenService", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], GitContribution.prototype, "repositoryTracker", void 0);
__decorate([
    (0, inversify_1.inject)(git_sync_service_1.GitSyncService),
    __metadata("design:type", git_sync_service_1.GitSyncService)
], GitContribution.prototype, "syncService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], GitContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider),
    __metadata("design:type", git_repository_provider_1.GitRepositoryProvider)
], GitContribution.prototype, "repositoryProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitContribution.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_error_handler_1.GitErrorHandler),
    __metadata("design:type", git_error_handler_1.GitErrorHandler)
], GitContribution.prototype, "gitErrorHandler", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], GitContribution.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], GitContribution.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(git_preferences_1.GitPreferences),
    __metadata("design:type", Object)
], GitContribution.prototype, "gitPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(decorations_service_1.DecorationsService),
    __metadata("design:type", Object)
], GitContribution.prototype, "decorationsService", void 0);
__decorate([
    (0, inversify_1.inject)(git_decoration_provider_1.GitDecorationProvider),
    __metadata("design:type", git_decoration_provider_1.GitDecorationProvider)
], GitContribution.prototype, "gitDecorationProvider", void 0);
GitContribution = __decorate([
    (0, inversify_1.injectable)()
], GitContribution);
exports.GitContribution = GitContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-contribution'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-decoration-provider.js":
/*!*****************************************************************!*\
  !*** ../../packages/git/lib/browser/git-decoration-provider.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.GitDecorationProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const common_2 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const git_repository_tracker_1 = __webpack_require__(/*! ./git-repository-tracker */ "../../packages/git/lib/browser/git-repository-tracker.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const git_preferences_1 = __webpack_require__(/*! ./git-preferences */ "../../packages/git/lib/browser/git-preferences.js");
let GitDecorationProvider = class GitDecorationProvider {
    constructor() {
        this.decorations = new Map();
        this.uris = new Set();
        this.onDidChangeDecorationsEmitter = new common_2.Emitter();
        this.onDidChange = this.onDidChangeDecorationsEmitter.event;
    }
    init() {
        this.decorationsEnabled = this.preferences['git.decorations.enabled'];
        this.colorsEnabled = this.preferences['git.decorations.colors'];
        this.gitRepositoryTracker.onGitEvent((event) => this.handleGitEvent(event));
        this.preferences.onPreferenceChanged((event) => this.handlePreferenceChange(event));
    }
    async handleGitEvent(event) {
        this.updateDecorations(event);
        this.triggerDecorationChange();
    }
    updateDecorations(event) {
        if (!event) {
            return;
        }
        const newDecorations = new Map();
        this.collectDecorationData(event.status.changes, newDecorations);
        this.uris = new Set([...this.decorations.keys()].concat([...newDecorations.keys()]));
        this.decorations = newDecorations;
    }
    collectDecorationData(changes, bucket) {
        changes.forEach(change => {
            const color = common_1.GitFileStatus.getColor(change.status, change.staged);
            bucket.set(change.uri, {
                bubble: true,
                colorId: color.substring(12, color.length - 1).replace(/-/g, '.'),
                tooltip: common_1.GitFileStatus.toString(change.status),
                letter: common_1.GitFileStatus.toAbbreviation(change.status, change.staged)
            });
        });
    }
    provideDecorations(uri, token) {
        if (this.decorationsEnabled) {
            const decoration = this.decorations.get(uri.toString());
            if (decoration && !this.colorsEnabled) {
                // Remove decoration color if disabled.
                return {
                    ...decoration,
                    colorId: undefined
                };
            }
            return decoration;
        }
        return undefined;
    }
    handlePreferenceChange(event) {
        const { preferenceName, newValue } = event;
        let updateDecorations = false;
        if (preferenceName === 'git.decorations.enabled') {
            updateDecorations = true;
            const decorationsEnabled = !!newValue;
            if (this.decorationsEnabled !== decorationsEnabled) {
                this.decorationsEnabled = decorationsEnabled;
            }
        }
        if (preferenceName === 'git.decorations.colors') {
            updateDecorations = true;
            const colorsEnabled = !!newValue;
            if (this.colorsEnabled !== colorsEnabled) {
                this.colorsEnabled = colorsEnabled;
            }
        }
        if (updateDecorations) {
            this.triggerDecorationChange();
        }
    }
    /**
     * Notify that the provider has been updated to trigger a re-render of decorations.
     */
    triggerDecorationChange() {
        this.onDidChangeDecorationsEmitter.fire(Array.from(this.uris, value => new uri_1.default(value)));
    }
};
__decorate([
    (0, inversify_1.inject)(git_preferences_1.GitPreferences),
    __metadata("design:type", Object)
], GitDecorationProvider.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], GitDecorationProvider.prototype, "gitRepositoryTracker", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitDecorationProvider.prototype, "init", null);
GitDecorationProvider = __decorate([
    (0, inversify_1.injectable)()
], GitDecorationProvider);
exports.GitDecorationProvider = GitDecorationProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-decoration-provider'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-error-handler.js":
/*!***********************************************************!*\
  !*** ../../packages/git/lib/browser/git-error-handler.js ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitErrorHandler = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let GitErrorHandler = class GitErrorHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleError(error) {
        const message = error instanceof Error ? error.message : error;
        if (message) {
            this.messageService.error(message, { timeout: 0 });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], GitErrorHandler.prototype, "messageService", void 0);
GitErrorHandler = __decorate([
    (0, inversify_1.injectable)()
], GitErrorHandler);
exports.GitErrorHandler = GitErrorHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-error-handler'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-frontend-module.js":
/*!*************************************************************!*\
  !*** ../../packages/git/lib/browser/git-frontend-module.js ***!
  \*************************************************************/
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
exports.createGitScmProviderFactory = void 0;
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/git/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const common_2 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const git_contribution_1 = __webpack_require__(/*! ./git-contribution */ "../../packages/git/lib/browser/git-contribution.js");
const git_diff_frontend_module_1 = __webpack_require__(/*! ./diff/git-diff-frontend-module */ "../../packages/git/lib/browser/diff/git-diff-frontend-module.js");
const git_history_frontend_module_1 = __webpack_require__(/*! ./history/git-history-frontend-module */ "../../packages/git/lib/browser/history/git-history-frontend-module.js");
const git_resource_resolver_1 = __webpack_require__(/*! ./git-resource-resolver */ "../../packages/git/lib/browser/git-resource-resolver.js");
const git_repository_provider_1 = __webpack_require__(/*! ./git-repository-provider */ "../../packages/git/lib/browser/git-repository-provider.js");
const git_quick_open_service_1 = __webpack_require__(/*! ./git-quick-open-service */ "../../packages/git/lib/browser/git-quick-open-service.js");
const git_preferences_1 = __webpack_require__(/*! ./git-preferences */ "../../packages/git/lib/browser/git-preferences.js");
const dirty_diff_module_1 = __webpack_require__(/*! ./dirty-diff/dirty-diff-module */ "../../packages/git/lib/browser/dirty-diff/dirty-diff-module.js");
const blame_module_1 = __webpack_require__(/*! ./blame/blame-module */ "../../packages/git/lib/browser/blame/blame-module.js");
const git_repository_tracker_1 = __webpack_require__(/*! ./git-repository-tracker */ "../../packages/git/lib/browser/git-repository-tracker.js");
const git_commit_message_validator_1 = __webpack_require__(/*! ./git-commit-message-validator */ "../../packages/git/lib/browser/git-commit-message-validator.js");
const git_sync_service_1 = __webpack_require__(/*! ./git-sync-service */ "../../packages/git/lib/browser/git-sync-service.js");
const git_error_handler_1 = __webpack_require__(/*! ./git-error-handler */ "../../packages/git/lib/browser/git-error-handler.js");
const git_scm_provider_1 = __webpack_require__(/*! ./git-scm-provider */ "../../packages/git/lib/browser/git-scm-provider.js");
const color_application_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/color-application-contribution */ "../../packages/core/lib/browser/color-application-contribution.js");
const scm_history_widget_1 = __webpack_require__(/*! @theia/scm-extra/lib/browser/history/scm-history-widget */ "../../packages/scm-extra/lib/browser/history/scm-history-widget.js");
const git_history_support_1 = __webpack_require__(/*! ./history/git-history-support */ "../../packages/git/lib/browser/history/git-history-support.js");
const git_decoration_provider_1 = __webpack_require__(/*! ./git-decoration-provider */ "../../packages/git/lib/browser/git-decoration-provider.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, git_preferences_1.bindGitPreferences)(bind);
    (0, git_diff_frontend_module_1.bindGitDiffModule)(bind);
    (0, git_history_frontend_module_1.bindGitHistoryModule)(bind);
    (0, dirty_diff_module_1.bindDirtyDiff)(bind);
    (0, blame_module_1.bindBlame)(bind);
    bind(git_repository_tracker_1.GitRepositoryTracker).toSelf().inSingletonScope();
    bind(common_2.GitWatcherServerProxy).toDynamicValue(context => browser_1.WebSocketConnectionProvider.createProxy(context.container, common_2.GitWatcherPath)).inSingletonScope();
    bind(common_2.GitWatcherServer).to(common_2.ReconnectingGitWatcherServer).inSingletonScope();
    bind(common_2.GitWatcher).toSelf().inSingletonScope();
    bind(common_2.Git).toDynamicValue(context => browser_1.WebSocketConnectionProvider.createProxy(context.container, common_2.GitPath)).inSingletonScope();
    bind(git_contribution_1.GitContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(git_contribution_1.GitContribution);
    bind(common_1.MenuContribution).toService(git_contribution_1.GitContribution);
    bind(browser_1.FrontendApplicationContribution).toService(git_contribution_1.GitContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(git_contribution_1.GitContribution);
    bind(color_application_contribution_1.ColorContribution).toService(git_contribution_1.GitContribution);
    bind(git_resource_resolver_1.GitResourceResolver).toSelf().inSingletonScope();
    bind(common_1.ResourceResolver).toService(git_resource_resolver_1.GitResourceResolver);
    bind(git_scm_provider_1.GitScmProvider.Factory).toFactory(createGitScmProviderFactory);
    bind(git_repository_provider_1.GitRepositoryProvider).toSelf().inSingletonScope();
    bind(git_decoration_provider_1.GitDecorationProvider).toSelf().inSingletonScope();
    bind(git_quick_open_service_1.GitQuickOpenService).toSelf().inSingletonScope();
    bind(git_commit_message_validator_1.GitCommitMessageValidator).toSelf().inSingletonScope();
    bind(git_sync_service_1.GitSyncService).toSelf().inSingletonScope();
    bind(git_error_handler_1.GitErrorHandler).toSelf().inSingletonScope();
});
function createGitScmProviderFactory(ctx) {
    return (options) => {
        const container = ctx.container.createChild();
        container.bind(git_scm_provider_1.GitScmProviderOptions).toConstantValue(options);
        container.bind(git_scm_provider_1.GitScmProvider).toSelf().inSingletonScope();
        container.bind(git_history_support_1.GitHistorySupport).toSelf().inSingletonScope();
        container.bind(scm_history_widget_1.ScmHistorySupport).toService(git_history_support_1.GitHistorySupport);
        const provider = container.get(git_scm_provider_1.GitScmProvider);
        const historySupport = container.get(git_history_support_1.GitHistorySupport);
        provider.historySupport = historySupport;
        return provider;
    };
}
exports.createGitScmProviderFactory = createGitScmProviderFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-frontend-module'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-preferences.js":
/*!*********************************************************!*\
  !*** ../../packages/git/lib/browser/git-preferences.js ***!
  \*********************************************************/
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
exports.bindGitPreferences = exports.createGitPreferences = exports.GitPreferences = exports.GitPreferenceContribution = exports.GitConfigSchema = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
/* eslint-disable max-len */
exports.GitConfigSchema = {
    'type': 'object',
    'properties': {
        'git.decorations.enabled': {
            'type': 'boolean',
            'description': nls_1.nls.localize('vscode.git/package/config.decorations.enabled', 'Show Git file status in the navigator.'),
            'default': true
        },
        'git.decorations.colors': {
            'type': 'boolean',
            'description': nls_1.nls.localize('theia/git/gitDecorationsColors', 'Use color decoration in the navigator.'),
            'default': true
        },
        'git.editor.decorations.enabled': {
            'type': 'boolean',
            'description': nls_1.nls.localize('theia/git/editorDecorationsEnabled', 'Show git decorations in the editor.'),
            'default': true
        },
        'git.editor.dirtyDiff.linesLimit': {
            'type': 'number',
            'description': nls_1.nls.localize('theia/git/dirtyDiffLinesLimit', 'Do not show dirty diff decorations, if editor\'s line count exceeds this limit.'),
            'default': 1000
        },
        'git.alwaysSignOff': {
            'type': 'boolean',
            'description': nls_1.nls.localize('vscode.git/package/config.alwaysSignOff', 'Always sign off commits.'),
            'default': false
        },
        'git.untrackedChanges': {
            type: 'string',
            enum: [
                nls_1.nls.localize('theia/scm/config.untrackedChanges.mixed', 'mixed'),
                nls_1.nls.localize('theia/scm/config.untrackedChanges.separate', 'separate'),
                nls_1.nls.localize('theia/scm/config.untrackedChanges.hidden', 'hidden')
            ],
            enumDescriptions: [
                nls_1.nls.localize('theia/scm/config.untrackedChanges.mixed/description', 'All changes, tracked and untracked, appear together and behave equally.'),
                nls_1.nls.localize('theia/scm/config.untrackedChanges.separate/description', 'Untracked changes appear separately in the Source Control view. They are also excluded from several actions.'),
                nls_1.nls.localize('theia/scm/config.untrackedChanges.hidden/description', 'Untracked changes are hidden and excluded from several actions.'),
            ],
            description: nls_1.nls.localize('theia/scm/config.untrackedChanges', 'Controls how untracked changes behave.'),
            default: 'mixed',
            scope: 'resource',
        }
    }
};
exports.GitPreferenceContribution = Symbol('GitPreferenceContribution');
exports.GitPreferences = Symbol('GitPreferences');
function createGitPreferences(preferences, schema = exports.GitConfigSchema) {
    return (0, browser_1.createPreferenceProxy)(preferences, schema);
}
exports.createGitPreferences = createGitPreferences;
function bindGitPreferences(bind) {
    bind(exports.GitPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(browser_1.PreferenceService);
        const contribution = ctx.container.get(exports.GitPreferenceContribution);
        return createGitPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.GitPreferenceContribution).toConstantValue({ schema: exports.GitConfigSchema });
    bind(browser_1.PreferenceContribution).toService(exports.GitPreferenceContribution);
}
exports.bindGitPreferences = bindGitPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-preferences'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-quick-open-service.js":
/*!****************************************************************!*\
  !*** ../../packages/git/lib/browser/git-quick-open-service.js ***!
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
exports.GitQuickOpenService = exports.GitAction = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const git_repository_provider_1 = __webpack_require__(/*! ./git-repository-provider */ "../../packages/git/lib/browser/git-repository-provider.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const git_error_handler_1 = __webpack_require__(/*! ./git-error-handler */ "../../packages/git/lib/browser/git-error-handler.js");
const progress_service_1 = __webpack_require__(/*! @theia/core/lib/common/progress-service */ "../../packages/core/lib/common/progress-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
var GitAction;
(function (GitAction) {
    GitAction[GitAction["PULL"] = 0] = "PULL";
    GitAction[GitAction["PUSH"] = 1] = "PUSH";
})(GitAction = exports.GitAction || (exports.GitAction = {}));
/**
 * Service delegating into the `Quick Input Service`, so that the Git commands can be further refined.
 * For instance, the `remote` can be specified for `pull`, `push`, and `fetch`. And the branch can be
 * specified for `git merge`.
 */
let GitQuickOpenService = class GitQuickOpenService {
    constructor() {
        this.buildDefaultProjectPath = this.doBuildDefaultProjectPath.bind(this);
        this.wrapWithProgress = (fn) => this.doWrapWithProgress(fn);
    }
    async clone(url, folder, branch) {
        return this.withProgress(async () => {
            var _a;
            if (!folder) {
                const roots = await this.workspaceService.roots;
                folder = roots[0].resource.toString();
            }
            if (url) {
                const repo = await this.git.clone(url, {
                    localUri: await this.buildDefaultProjectPath(folder, url),
                    branch: branch
                });
                return repo.localUri;
            }
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick([
                new GitQuickPickItem(nls_1.nls.localize('theia/git/cloneQuickInputLabel', 'Please provide a Git repository location. Press \'Enter\' to confirm or \'Escape\' to cancel.'))
            ], {
                placeholder: nls_1.nls.localize('vscode.git/dist/commands/selectFolder', 'Select Repository Location'),
                onDidChangeValue: (quickPick, filter) => this.query(quickPick, filter, folder)
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query(quickPick, filter, folder) {
        quickPick.busy = true;
        const { git, buildDefaultProjectPath, gitErrorHandler, wrapWithProgress } = this;
        try {
            if (filter === undefined || filter.length === 0) {
                quickPick.items = [
                    new GitQuickPickItem(nls_1.nls.localize('theia/git/cloneQuickInputLabel', 'Please provide a Git repository location. Press \'Enter\' to confirm or \'Escape\' to cancel.'))
                ];
            }
            else {
                quickPick.items = [
                    new GitQuickPickItem(nls_1.nls.localize('theia/git/cloneRepository', 'Clone the Git repository: {0}. Press \'Enter\' to confirm or \'Escape\' to cancel.', filter), wrapWithProgress(async () => {
                        try {
                            await git.clone(filter, { localUri: await buildDefaultProjectPath(folder, filter) });
                        }
                        catch (error) {
                            gitErrorHandler.handleError(error);
                        }
                    }))
                ];
            }
        }
        catch (err) {
            quickPick.items = [new GitQuickPickItem('$(error) ' + nls_1.nls.localizeByDefault('Error: {0}', err.message))];
            console.error(err);
        }
        finally {
            quickPick.busy = false;
        }
    }
    async doBuildDefaultProjectPath(folderPath, gitURI) {
        if (!(await this.fileService.exists(new uri_1.default(folderPath)))) {
            // user specifies its own project path, doesn't want us to guess it
            return folderPath;
        }
        const uriSplitted = gitURI.split('/');
        let projectPath = folderPath + '/' + (uriSplitted.pop() || uriSplitted.pop());
        if (projectPath.endsWith('.git')) {
            projectPath = projectPath.substring(0, projectPath.length - '.git'.length);
        }
        return projectPath;
    }
    async fetch() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const remotes = await this.getRemotes();
            const execute = async (item) => {
                try {
                    await this.git.fetch(repository, { remote: item.ref.name });
                }
                catch (error) {
                    this.gitErrorHandler.handleError(error);
                }
            };
            const items = remotes.map(remote => new GitQuickPickItem(remote.name, execute, remote, remote.fetch));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localize('theia/git/fetchPickRemote', 'Pick a remote to fetch from:') });
        });
    }
    async performDefaultGitAction(action) {
        var _a;
        const remote = await this.getRemotes();
        const defaultRemote = (_a = remote[0]) === null || _a === void 0 ? void 0 : _a.name;
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            try {
                if (action === GitAction.PULL) {
                    await this.git.pull(repository, { remote: defaultRemote });
                    console.log(`Git Pull: successfully completed from ${defaultRemote}.`);
                }
                else if (action === GitAction.PUSH) {
                    await this.git.push(repository, { remote: defaultRemote, setUpstream: true });
                    console.log(`Git Push: successfully completed to ${defaultRemote}.`);
                }
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        });
    }
    async push() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const [remotes, currentBranch] = await Promise.all([this.getRemotes(), this.getCurrentBranch()]);
            const execute = async (item) => {
                try {
                    await this.git.push(repository, { remote: item.label, setUpstream: true });
                }
                catch (error) {
                    this.gitErrorHandler.handleError(error);
                }
            };
            const items = remotes.map(remote => new GitQuickPickItem(remote.name, execute, remote, remote.push));
            const branchName = currentBranch ? `'${currentBranch.name}' ` : '';
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, {
                placeholder: nls_1.nls.localize('vscode.git/dist/commands/pick remote', "Pick a remote to publish the branch '{0}' to:", branchName)
            });
        });
    }
    async pull() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const remotes = await this.getRemotes();
            const defaultRemote = remotes[0].name; // I wish I could use assignment destructuring here. (GH-413)
            const executeRemote = async (remoteItem) => {
                var _a;
                // The first remote is the default.
                if (remoteItem.ref.name === defaultRemote) {
                    try {
                        await this.git.pull(repository, { remote: remoteItem.label });
                    }
                    catch (error) {
                        this.gitErrorHandler.handleError(error);
                    }
                }
                else {
                    // Otherwise we need to propose the branches from
                    const branches = await this.getBranches();
                    const executeBranch = async (branchItem) => {
                        try {
                            await this.git.pull(repository, { remote: remoteItem.ref.name, branch: branchItem.ref.nameWithoutRemote });
                        }
                        catch (error) {
                            this.gitErrorHandler.handleError(error);
                        }
                    };
                    const branchItems = branches
                        .filter(branch => branch.type === common_1.BranchType.Remote)
                        .filter(branch => (branch.name || '').startsWith(`${remoteItem.label}/`))
                        .map(branch => new GitQuickPickItem(branch.name, executeBranch, branch));
                    (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(branchItems, {
                        placeholder: nls_1.nls.localize('vscode.git/dist/commands/pick branch pull', 'Pick a branch to pull from')
                    });
                }
            };
            const remoteItems = remotes.map(remote => new GitQuickPickItem(remote.name, executeRemote, remote, remote.fetch));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(remoteItems, {
                placeholder: nls_1.nls.localize('vscode.git/dist/commands/pick remote pull repo', 'Pick a remote to pull the branch from')
            });
        });
    }
    async merge() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const [branches, currentBranch] = await Promise.all([this.getBranches(), this.getCurrentBranch()]);
            const execute = async (item) => {
                try {
                    await this.git.merge(repository, { branch: item.label });
                }
                catch (error) {
                    this.gitErrorHandler.handleError(error);
                }
            };
            const items = branches.map(branch => new GitQuickPickItem(branch.name, execute, branch));
            const branchName = currentBranch ? `'${currentBranch.name}' ` : '';
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, {
                placeholder: nls_1.nls.localize('theia/git/mergeQuickPickPlaceholder', 'Pick a branch to merge into the currently active {0} branch:', branchName)
            });
        });
    }
    async checkout() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const [branches, currentBranch] = await Promise.all([this.getBranches(), this.getCurrentBranch()]);
            if (currentBranch) {
                // We do not show the current branch.
                const index = branches.findIndex(branch => branch && branch.name === currentBranch.name);
                branches.splice(index, 1);
            }
            const switchBranch = async (item) => {
                try {
                    await this.git.checkout(repository, { branch: item.ref.nameWithoutRemote });
                }
                catch (error) {
                    this.gitErrorHandler.handleError(error);
                }
            };
            const items = branches.map(branch => new GitQuickPickItem(branch.type === common_1.BranchType.Remote ? branch.name : branch.nameWithoutRemote, switchBranch, branch, branch.type === common_1.BranchType.Remote
                ? nls_1.nls.localize('vscode.git/dist/commands/remote branch at', 'Remote branch at {0}', (branch.tip.sha.length > 8 ? ` ${branch.tip.sha.slice(0, 7)}` : ''))
                : (branch.tip.sha.length > 8 ? ` ${branch.tip.sha.slice(0, 7)}` : '')));
            const createBranchItem = async () => {
                var _a;
                const { git, gitErrorHandler, wrapWithProgress } = this;
                const getItems = (lookFor) => {
                    const dynamicItems = [];
                    if (lookFor === undefined || lookFor.length === 0) {
                        dynamicItems.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/checkoutProvideBranchName', 'Please provide a branch name. '), () => { }));
                    }
                    else {
                        dynamicItems.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/checkoutCreateLocalBranchWithName', "Create a new local branch with name: {0}. Press 'Enter' to confirm or 'Escape' to cancel.", lookFor), wrapWithProgress(async () => {
                            try {
                                await git.branch(repository, { toCreate: lookFor });
                                await git.checkout(repository, { branch: lookFor });
                            }
                            catch (error) {
                                gitErrorHandler.handleError(error);
                            }
                        })));
                    }
                    return dynamicItems;
                };
                (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(getItems(), {
                    placeholder: nls_1.nls.localize('vscode.git/dist/commands/branch name', 'Branch name'),
                    onDidChangeValue: (quickPick, filter) => {
                        quickPick.items = getItems(filter);
                    }
                });
            };
            items.unshift(new GitQuickPickItem(nls_1.nls.localize('vscode.git/dist/commands/create branch', 'Create new branch...'), createBranchItem));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localize('theia/git/checkoutSelectRef', 'Select a ref to checkout or create a new local branch:') });
        });
    }
    async chooseTagsAndBranches(execFunc, repository = this.getRepository()) {
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const [branches, tags, currentBranch] = await Promise.all([this.getBranches(repository), this.getTags(repository), this.getCurrentBranch(repository)]);
            const execute = async (item) => {
                execFunc(item.ref.name, currentBranch ? currentBranch.name : '');
            };
            const branchItems = branches.map(branch => new GitQuickPickItem(branch.name, execute, branch));
            const branchName = currentBranch ? `'${currentBranch.name}' ` : '';
            const tagItems = tags.map(tag => new GitQuickPickItem(tag.name, execute, tag));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick([...branchItems, ...tagItems], { placeholder: nls_1.nls.localize('theia/git/compareWithBranchOrTag', 'Pick a branch or tag to compare with the currently active {0} branch:', branchName) });
        });
    }
    async commitMessageForAmend() {
        const repository = this.getRepository();
        if (!repository) {
            throw new Error(nls_1.nls.localize('theia/git/noRepositoriesSelected', 'No repositories were selected.'));
        }
        return this.withProgress(async () => {
            const lastMessage = (await this.git.exec(repository, ['log', '--format=%B', '-n', '1'])).stdout.trim();
            if (lastMessage.length === 0) {
                throw new Error(nls_1.nls.localize('theia/git/repositoryNotInitialized', 'Repository {0} is not yet initialized.', repository.localUri));
            }
            const message = lastMessage.replace(/[\r\n]+/g, ' ');
            const result = await new Promise(async (resolve, reject) => {
                var _a;
                const getItems = (lookFor) => {
                    const items = [];
                    if (!lookFor) {
                        const label = nls_1.nls.localize('theia/git/amendReuseMessag', "To reuse the last commit message, press 'Enter' or 'Escape' to cancel.");
                        items.push(new GitQuickPickItem(label, () => resolve(lastMessage), label));
                    }
                    else {
                        items.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/amendRewrite', "Rewrite previous commit message. Press 'Enter' to confirm or 'Escape' to cancel."), () => resolve(lookFor)));
                    }
                    return items;
                };
                const updateItems = (quickPick, filter) => {
                    quickPick.items = getItems(filter);
                };
                (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(getItems(), { placeholder: message, onDidChangeValue: updateItems });
            });
            return result;
        });
    }
    async stash() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const doStash = this.wrapWithProgress(async (message) => {
                this.git.stash(repository, { message });
            });
            const getItems = (lookFor) => {
                const items = [];
                if (lookFor === undefined || lookFor.length === 0) {
                    items.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/stashChanges', "Stash changes. Press 'Enter' to confirm or 'Escape' to cancel."), () => doStash('')));
                }
                else {
                    items.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/stashChangesWithMessage', "Stash changes with message: {0}. Press 'Enter' to confirm or 'Escape' to cancel.", lookFor), () => doStash(lookFor)));
                }
                return items;
            };
            const updateItems = (quickPick, filter) => {
                quickPick.items = getItems(filter);
            };
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(getItems(), {
                placeholder: nls_1.nls.localize('vscode.git/dist/commands/stash message', 'Stash message'), onDidChangeValue: updateItems
            });
        });
    }
    async doStashAction(action, text, getMessage) {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const list = await this.git.stash(repository, { action: 'list' });
            if (list) {
                const items = list.map(stash => new GitQuickPickItem(stash.message, this.wrapWithProgress(async () => {
                    try {
                        await this.git.stash(repository, { action, id: stash.id });
                        if (getMessage) {
                            this.messageService.info(await getMessage());
                        }
                    }
                    catch (error) {
                        this.gitErrorHandler.handleError(error);
                    }
                })));
                (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: text });
            }
        });
    }
    async applyStash() {
        this.doStashAction('apply', nls_1.nls.localize('vscode.git/dist/commands/pick stash to apply', 'Pick a stash to apply'));
    }
    async popStash() {
        this.doStashAction('pop', nls_1.nls.localize('vscode.git/dist/commands/pick stash to pop', 'Pick a stash to pop'));
    }
    async dropStash() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        this.doStashAction('drop', nls_1.nls.localize('vscode.git/dist/commands/pick stash to drop', 'Pick a stash to drop'), async () => nls_1.nls.localize('theia/git/dropStashMessage', 'Stash successfully removed.'));
    }
    async applyLatestStash() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            try {
                await this.git.stash(repository, {
                    action: 'apply'
                });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        });
    }
    async popLatestStash() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            try {
                await this.git.stash(repository, {
                    action: 'pop'
                });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        });
    }
    async initRepository() {
        var _a;
        const wsRoots = await this.workspaceService.roots;
        if (wsRoots && wsRoots.length > 1) {
            const items = wsRoots.map(root => this.toRepositoryPathQuickOpenItem(root));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localize('vscode.git/dist/commands/init', 'Pick workspace folder to initialize git repo in') });
        }
        else {
            const rootUri = wsRoots[0].resource;
            this.doInitRepository(rootUri.toString());
        }
    }
    async doInitRepository(uri) {
        this.withProgress(async () => this.git.exec({ localUri: uri }, ['init']));
    }
    toRepositoryPathQuickOpenItem(root) {
        const rootUri = root.resource;
        const execute = async (item) => {
            const wsRoot = item.ref.toString();
            this.doInitRepository(wsRoot);
        };
        return new GitQuickPickItem(this.labelProvider.getName(rootUri), execute, rootUri, this.labelProvider.getLongName(rootUri.parent));
    }
    getRepository() {
        return this.repositoryProvider.selectedRepository;
    }
    async getRemotes() {
        const repository = this.getRepository();
        if (!repository) {
            return [];
        }
        return this.withProgress(async () => {
            try {
                return await this.git.remote(repository, { verbose: true });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
                return [];
            }
        });
    }
    async getTags(repository = this.getRepository()) {
        if (!repository) {
            return [];
        }
        return this.withProgress(async () => {
            const result = await this.git.exec(repository, ['tag', '--sort=-creatordate']);
            return result.stdout !== '' ? result.stdout.trim().split('\n').map(tag => ({ name: tag })) : [];
        });
    }
    async getBranches(repository = this.getRepository()) {
        if (!repository) {
            return [];
        }
        return this.withProgress(async () => {
            try {
                const [local, remote] = await Promise.all([
                    this.git.branch(repository, { type: 'local' }),
                    this.git.branch(repository, { type: 'remote' })
                ]);
                return [...local, ...remote];
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
                return [];
            }
        });
    }
    async getCurrentBranch(repository = this.getRepository()) {
        if (!repository) {
            return undefined;
        }
        return this.withProgress(async () => {
            try {
                return await this.git.branch(repository, { type: 'current' });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
                return undefined;
            }
        });
    }
    withProgress(fn) {
        return this.progressService.withProgress('', 'scm', fn);
    }
    doWrapWithProgress(fn) {
        return (...args) => this.withProgress(() => fn(...args));
    }
};
__decorate([
    (0, inversify_1.inject)(git_error_handler_1.GitErrorHandler),
    __metadata("design:type", git_error_handler_1.GitErrorHandler)
], GitQuickOpenService.prototype, "gitErrorHandler", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], GitQuickOpenService.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], GitQuickOpenService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitQuickOpenService.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider),
    __metadata("design:type", git_repository_provider_1.GitRepositoryProvider)
], GitQuickOpenService.prototype, "repositoryProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], GitQuickOpenService.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], GitQuickOpenService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], GitQuickOpenService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], GitQuickOpenService.prototype, "fileService", void 0);
GitQuickOpenService = __decorate([
    (0, inversify_1.injectable)()
], GitQuickOpenService);
exports.GitQuickOpenService = GitQuickOpenService;
class GitQuickPickItem {
    constructor(label, execute, ref, description, alwaysShow = true, sortByLabel = false) {
        this.label = label;
        this.ref = ref;
        this.description = description;
        this.alwaysShow = alwaysShow;
        this.sortByLabel = sortByLabel;
        this.execute = execute ? createExecFunction(execute, this) : undefined;
    }
}
function createExecFunction(f, item) {
    return () => { f(item); };
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-quick-open-service'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-repository-provider.js":
/*!*****************************************************************!*\
  !*** ../../packages/git/lib/browser/git-repository-provider.js ***!
  \*****************************************************************/
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
exports.GitScmRepository = exports.GitRepositoryProvider = void 0;
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const storage_service_1 = __webpack_require__(/*! @theia/core/lib/browser/storage-service */ "../../packages/core/lib/browser/storage-service.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const git_commit_message_validator_1 = __webpack_require__(/*! ./git-commit-message-validator */ "../../packages/git/lib/browser/git-commit-message-validator.js");
const git_scm_provider_1 = __webpack_require__(/*! ./git-scm-provider */ "../../packages/git/lib/browser/git-scm-provider.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
let GitRepositoryProvider = class GitRepositoryProvider {
    constructor() {
        this.onDidChangeRepositoryEmitter = new event_1.Emitter();
        this.selectedRepoStorageKey = 'theia-git-selected-repository';
        this.allRepoStorageKey = 'theia-git-all-repositories';
        this.lazyRefresh = debounce(() => this.refresh(), 1000);
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const [selectedRepository, allRepositories] = await Promise.all([
            this.storageService.getData(this.selectedRepoStorageKey),
            this.storageService.getData(this.allRepoStorageKey)
        ]);
        this.scmService.onDidChangeSelectedRepository(scmRepository => this.fireDidChangeRepository(this.toGitRepository(scmRepository)));
        if (allRepositories) {
            this.updateRepositories(allRepositories);
        }
        else {
            await this.refresh({ maxCount: 1 });
        }
        this.selectedRepository = selectedRepository;
        await this.refresh();
        this.fileService.onDidFilesChange(_ => this.lazyRefresh());
    }
    /**
     * Returns with the previously selected repository, or if no repository has been selected yet,
     * it picks the first available repository from the backend and sets it as the selected one and returns with that.
     * If no repositories are available, returns `undefined`.
     */
    get selectedRepository() {
        return this.toGitRepository(this.scmService.selectedRepository);
    }
    /**
     * Sets the selected repository, but do nothing if the given repository is not a Git repository
     * registered with the SCM service.  We must be sure not to clear the selection if the selected
     * repository is managed by an SCM other than Git.
     */
    set selectedRepository(repository) {
        const scmRepository = this.toScmRepository(repository);
        if (scmRepository) {
            this.scmService.selectedRepository = scmRepository;
        }
    }
    get selectedScmRepository() {
        return this.toGitScmRepository(this.scmService.selectedRepository);
    }
    get selectedScmProvider() {
        return this.toGitScmProvider(this.scmService.selectedRepository);
    }
    get onDidChangeRepository() {
        return this.onDidChangeRepositoryEmitter.event;
    }
    fireDidChangeRepository(repository) {
        this.storageService.setData(this.selectedRepoStorageKey, repository);
        this.onDidChangeRepositoryEmitter.fire(repository);
    }
    /**
     * Returns with all know repositories.
     */
    get allRepositories() {
        const repositories = [];
        for (const scmRepository of this.scmService.repositories) {
            const repository = this.toGitRepository(scmRepository);
            if (repository) {
                repositories.push(repository);
            }
        }
        return repositories;
    }
    async refresh(options) {
        const repositories = [];
        const refreshing = [];
        for (const root of await this.workspaceService.roots) {
            refreshing.push(this.git.repositories(root.resource.toString(), { ...options }).then(result => { repositories.push(...result); }, () => { }));
        }
        await Promise.all(refreshing);
        this.updateRepositories(repositories);
    }
    updateRepositories(repositories) {
        this.storageService.setData(this.allRepoStorageKey, repositories);
        const registered = new Set();
        const toUnregister = new Map();
        for (const scmRepository of this.scmService.repositories) {
            const repository = this.toGitRepository(scmRepository);
            if (repository) {
                registered.add(repository.localUri);
                toUnregister.set(repository.localUri, scmRepository);
            }
        }
        for (const repository of repositories) {
            toUnregister.delete(repository.localUri);
            if (!registered.has(repository.localUri)) {
                registered.add(repository.localUri);
                this.registerScmProvider(repository);
            }
        }
        for (const [, scmRepository] of toUnregister) {
            scmRepository.dispose();
        }
    }
    registerScmProvider(repository) {
        const provider = this.scmProviderFactory({ repository });
        const scmRepository = this.scmService.registerScmProvider(provider, {
            input: {
                placeholder: 'Message (press {0} to commit)',
                validator: async (value) => {
                    const issue = await this.commitMessageValidator.validate(value);
                    return issue && {
                        message: issue.message,
                        type: issue.status
                    };
                }
            }
        });
        provider.input = scmRepository.input;
    }
    toScmRepository(repository) {
        return repository && this.scmService.repositories.find(scmRepository => common_1.Repository.equal(this.toGitRepository(scmRepository), repository));
    }
    toGitRepository(scmRepository) {
        const provider = this.toGitScmProvider(scmRepository);
        return provider && provider.repository;
    }
    toGitScmProvider(scmRepository) {
        const gitScmRepository = this.toGitScmRepository(scmRepository);
        return gitScmRepository && gitScmRepository.provider;
    }
    toGitScmRepository(scmRepository) {
        return GitScmRepository.is(scmRepository) ? scmRepository : undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(git_scm_provider_1.GitScmProvider.Factory),
    __metadata("design:type", Function)
], GitRepositoryProvider.prototype, "scmProviderFactory", void 0);
__decorate([
    (0, inversify_1.inject)(git_commit_message_validator_1.GitCommitMessageValidator),
    __metadata("design:type", git_commit_message_validator_1.GitCommitMessageValidator)
], GitRepositoryProvider.prototype, "commitMessageValidator", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitRepositoryProvider.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], GitRepositoryProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], GitRepositoryProvider.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(storage_service_1.StorageService),
    __metadata("design:type", Object)
], GitRepositoryProvider.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], GitRepositoryProvider.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitRepositoryProvider.prototype, "init", null);
GitRepositoryProvider = __decorate([
    (0, inversify_1.injectable)()
], GitRepositoryProvider);
exports.GitRepositoryProvider = GitRepositoryProvider;
var GitScmRepository;
(function (GitScmRepository) {
    function is(scmRepository) {
        return !!scmRepository && scmRepository.provider instanceof git_scm_provider_1.GitScmProvider;
    }
    GitScmRepository.is = is;
})(GitScmRepository = exports.GitScmRepository || (exports.GitScmRepository = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-repository-provider'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-repository-tracker.js":
/*!****************************************************************!*\
  !*** ../../packages/git/lib/browser/git-repository-tracker.js ***!
  \****************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitRepositoryTracker = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const git_repository_provider_1 = __webpack_require__(/*! ./git-repository-provider */ "../../packages/git/lib/browser/git-repository-provider.js");
const git_watcher_1 = __webpack_require__(/*! ../common/git-watcher */ "../../packages/git/lib/common/git-watcher.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
/**
 * The repository tracker watches the selected repository for status changes. It provides a convenient way to listen on status updates.
 */
let GitRepositoryTracker = class GitRepositoryTracker {
    constructor(git, repositoryProvider, gitWatcher) {
        this.git = git;
        this.repositoryProvider = repositoryProvider;
        this.gitWatcher = gitWatcher;
        this.toDispose = new core_1.DisposableCollection();
        this.onGitEventEmitter = new core_1.Emitter();
        this.updateStatus = debounce(async () => {
            this.toDispose.dispose();
            const tokenSource = new core_1.CancellationTokenSource();
            this.toDispose.push(core_1.Disposable.create(() => tokenSource.cancel()));
            const token = tokenSource.token;
            const source = this.selectedRepository;
            if (source) {
                const status = await this.git.status(source);
                this.setStatus({ source, status }, token);
                this.toDispose.push(this.gitWatcher.onGitEvent(event => {
                    if (event.source.localUri === source.localUri) {
                        this.setStatus(event, token);
                    }
                }));
                this.toDispose.push(await this.gitWatcher.watchGitChanges(source));
            }
            else {
                this.setStatus(undefined, token);
            }
        }, 50);
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.updateStatus();
        this.repositoryProvider.onDidChangeRepository(() => this.updateStatus());
    }
    setStatus(event, token) {
        const status = event && event.status;
        const scmProvider = this.repositoryProvider.selectedScmProvider;
        if (scmProvider) {
            scmProvider.setStatus(status);
        }
        this.workingDirectoryStatus = status;
        this.onGitEventEmitter.fire(event);
    }
    /**
     * Returns the selected repository, or `undefined` if no repositories are available.
     */
    get selectedRepository() {
        return this.repositoryProvider.selectedRepository;
    }
    /**
     * Returns all known repositories.
     */
    get allRepositories() {
        return this.repositoryProvider.allRepositories;
    }
    /**
     * Returns the last known status of the selected repository, or `undefined` if no repositories are available.
     */
    get selectedRepositoryStatus() {
        return this.workingDirectoryStatus;
    }
    /**
     * Emits when the selected repository has changed.
     */
    get onDidChangeRepository() {
        return this.repositoryProvider.onDidChangeRepository;
    }
    /**
     * Emits when status has changed in the selected repository.
     */
    get onGitEvent() {
        return this.onGitEventEmitter.event;
    }
    getPath(uri) {
        const { repositoryUri } = this;
        const relativePath = repositoryUri && common_1.Repository.relativePath(repositoryUri, uri);
        return relativePath && relativePath.toString();
    }
    getUri(path) {
        const { repositoryUri } = this;
        return repositoryUri && repositoryUri.resolve(path);
    }
    get repositoryUri() {
        const repository = this.selectedRepository;
        return repository && new uri_1.default(repository.localUri);
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitRepositoryTracker.prototype, "init", null);
GitRepositoryTracker = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(common_1.Git)),
    __param(1, (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider)),
    __param(2, (0, inversify_1.inject)(git_watcher_1.GitWatcher)),
    __metadata("design:paramtypes", [Object, git_repository_provider_1.GitRepositoryProvider,
        git_watcher_1.GitWatcher])
], GitRepositoryTracker);
exports.GitRepositoryTracker = GitRepositoryTracker;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-repository-tracker'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-resource-resolver.js":
/*!***************************************************************!*\
  !*** ../../packages/git/lib/browser/git-resource-resolver.js ***!
  \***************************************************************/
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitResourceResolver = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const git_repository_provider_1 = __webpack_require__(/*! ./git-repository-provider */ "../../packages/git/lib/browser/git-repository-provider.js");
const git_resource_1 = __webpack_require__(/*! ./git-resource */ "../../packages/git/lib/browser/git-resource.js");
let GitResourceResolver = class GitResourceResolver {
    constructor(git, repositoryProvider) {
        this.git = git;
        this.repositoryProvider = repositoryProvider;
    }
    resolve(uri) {
        if (uri.scheme !== git_resource_1.GIT_RESOURCE_SCHEME) {
            throw new Error(`Expected a URI with ${git_resource_1.GIT_RESOURCE_SCHEME} scheme. Was: ${uri}.`);
        }
        return this.getResource(uri);
    }
    async getResource(uri) {
        const repository = await this.getRepository(uri);
        return new git_resource_1.GitResource(uri, repository, this.git);
    }
    async getRepository(uri) {
        const fileUri = uri.withScheme('file');
        const repositories = this.repositoryProvider.allRepositories;
        // The layout restorer might ask for the known repositories this point.
        if (repositories.length === 0) {
            // So let's make sure, the repository provider state is in sync with the backend.
            await this.repositoryProvider.refresh();
            repositories.push(...this.repositoryProvider.allRepositories);
        }
        // We sort by length so that we visit the nested repositories first.
        // We do not want to get the repository A instead of B if we have:
        // repository A, another repository B inside A and a resource A/B/C.ext.
        const sortedRepositories = repositories.sort((a, b) => b.localUri.length - a.localUri.length);
        for (const repository of sortedRepositories) {
            const localUri = new uri_1.default(repository.localUri);
            // make sure that localUri of repository has file scheme.
            const localUriStr = localUri.withScheme('file').toString();
            if (fileUri.toString().startsWith(localUriStr)) {
                return { localUri: localUriStr };
            }
        }
        return undefined;
    }
};
GitResourceResolver = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(common_1.Git)),
    __param(1, (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider)),
    __metadata("design:paramtypes", [Object, git_repository_provider_1.GitRepositoryProvider])
], GitResourceResolver);
exports.GitResourceResolver = GitResourceResolver;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-resource-resolver'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-resource.js":
/*!******************************************************!*\
  !*** ../../packages/git/lib/browser/git-resource.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitResource = exports.GIT_RESOURCE_SCHEME = void 0;
exports.GIT_RESOURCE_SCHEME = 'gitrev';
class GitResource {
    constructor(uri, repository, git) {
        this.uri = uri;
        this.repository = repository;
        this.git = git;
    }
    async readContents(options) {
        if (this.repository) {
            const commitish = this.uri.query;
            let encoding;
            if ((options === null || options === void 0 ? void 0 : options.encoding) === 'utf8' || (options === null || options === void 0 ? void 0 : options.encoding) === 'binary') {
                encoding = options === null || options === void 0 ? void 0 : options.encoding;
            }
            return this.git.show(this.repository, this.uri.toString(), { commitish, encoding });
        }
        return '';
    }
    dispose() { }
}
exports.GitResource = GitResource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-resource'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-scm-provider.js":
/*!**********************************************************!*\
  !*** ../../packages/git/lib/browser/git-scm-provider.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
var GitScmProvider_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitScmFileChange = exports.GitAmendSupport = exports.GitScmProvider = exports.GitScmProviderOptions = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const diff_uris_1 = __webpack_require__(/*! @theia/core/lib/browser/diff-uris */ "../../packages/core/lib/browser/diff-uris.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const dialogs_1 = __webpack_require__(/*! @theia/core/lib/browser/dialogs */ "../../packages/core/lib/browser/dialogs.js");
const editor_manager_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const git_resource_1 = __webpack_require__(/*! ./git-resource */ "../../packages/git/lib/browser/git-resource.js");
const git_error_handler_1 = __webpack_require__(/*! ./git-error-handler */ "../../packages/git/lib/browser/git-error-handler.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const git_preferences_1 = __webpack_require__(/*! ./git-preferences */ "../../packages/git/lib/browser/git-preferences.js");
let GitScmProviderOptions = class GitScmProviderOptions {
};
GitScmProviderOptions = __decorate([
    (0, inversify_1.injectable)()
], GitScmProviderOptions);
exports.GitScmProviderOptions = GitScmProviderOptions;
let GitScmProvider = GitScmProvider_1 = class GitScmProvider {
    constructor() {
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onDidChangeCommitTemplateEmitter = new core_1.Emitter();
        this.onDidChangeCommitTemplate = this.onDidChangeCommitTemplateEmitter.event;
        this.onDidChangeStatusBarCommandsEmitter = new core_1.Emitter();
        this.onDidChangeStatusBarCommands = this.onDidChangeStatusBarCommandsEmitter.event;
        this.toDispose = new disposable_1.DisposableCollection(this.onDidChangeEmitter, this.onDidChangeCommitTemplateEmitter, this.onDidChangeStatusBarCommandsEmitter);
        this.id = 'git';
        this.label = nls_1.nls.localize('vscode.git/package/displayName', 'Git');
        this.state = GitScmProvider_1.initState();
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    dispose() {
        this.toDispose.dispose();
    }
    init() {
        this._amendSupport = new GitAmendSupport(this, this.repository, this.git);
        this.toDispose.push(this.gitPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'git.untrackedChanges' && e.affects(this.rootUri)) {
                this.setStatus(this.getStatus());
            }
        }));
    }
    get repository() {
        return this.options.repository;
    }
    get rootUri() {
        return this.repository.localUri;
    }
    get amendSupport() {
        return this._amendSupport;
    }
    get acceptInputCommand() {
        return {
            command: 'git.commit.all',
            tooltip: nls_1.nls.localize('vscode.git/package/command.commitAll', 'Commit all the staged changes'),
            title: nls_1.nls.localize('vscode.git/package/command.commit', 'Commit')
        };
    }
    get statusBarCommands() {
        return this._statusBarCommands;
    }
    set statusBarCommands(statusBarCommands) {
        this._statusBarCommands = statusBarCommands;
        this.onDidChangeStatusBarCommandsEmitter.fire(statusBarCommands);
    }
    get groups() {
        return this.state.groups;
    }
    get stagedChanges() {
        return this.state.stagedChanges;
    }
    get unstagedChanges() {
        return this.state.unstagedChanges;
    }
    get mergeChanges() {
        return this.state.mergeChanges;
    }
    getStatus() {
        return this.state.status;
    }
    setStatus(status) {
        const state = GitScmProvider_1.initState(status);
        if (status) {
            for (const change of status.changes) {
                if (common_1.GitFileStatus[common_1.GitFileStatus.Conflicted.valueOf()] !== common_1.GitFileStatus[change.status]) {
                    if (change.staged) {
                        state.stagedChanges.push(change);
                    }
                    else {
                        state.unstagedChanges.push(change);
                    }
                }
                else {
                    if (!change.staged) {
                        state.mergeChanges.push(change);
                    }
                }
            }
        }
        const untrackedChangesPreference = this.gitPreferences['git.untrackedChanges'];
        const forWorkingTree = untrackedChangesPreference === 'mixed'
            ? state.unstagedChanges
            : state.unstagedChanges.filter(change => change.status !== common_1.GitFileStatus.New);
        const forUntracked = untrackedChangesPreference === 'separate'
            ? state.unstagedChanges.filter(change => change.status === common_1.GitFileStatus.New)
            : [];
        const hideWorkingIfEmpty = forUntracked.length > 0;
        state.groups.push(this.createGroup('merge', nls_1.nls.localize('vscode.git/repository/merge changes', 'Merge Changes'), state.mergeChanges, true));
        state.groups.push(this.createGroup('index', nls_1.nls.localize('vscode.git/repository/staged changes', 'Staged changes'), state.stagedChanges, true));
        state.groups.push(this.createGroup('workingTree', nls_1.nls.localize('vscode.git/repository/changes', 'Changes'), forWorkingTree, hideWorkingIfEmpty));
        state.groups.push(this.createGroup('untrackedChanges', nls_1.nls.localize('vscode.git/repository/untracked changes', 'Untracked Changes'), forUntracked, true));
        this.state = state;
        if (status && status.branch) {
            this.input.placeholder = nls_1.nls.localize('vscode.git/repository/commitMessageWithHeadLabel', 'Message (press {0} to commit on {1})', '{0}', status.branch);
        }
        else {
            this.input.placeholder = nls_1.nls.localize('vscode.git/repository/commitMessage', 'Message (press {0} to commit)');
        }
        this.fireDidChange();
    }
    createGroup(id, label, changes, hideWhenEmpty) {
        const group = {
            id,
            label,
            hideWhenEmpty,
            provider: this,
            resources: [],
            dispose: () => { }
        };
        for (const change of changes) {
            this.addScmResource(group, change);
        }
        return group;
    }
    addScmResource(group, change) {
        const sourceUri = new uri_1.default(change.uri);
        group.resources.push({
            group,
            sourceUri,
            decorations: {
                letter: common_1.GitFileStatus.toAbbreviation(change.status, change.staged),
                color: common_1.GitFileStatus.getColor(change.status, change.staged),
                tooltip: common_1.GitFileStatus.toString(change.status),
                strikeThrough: common_1.GitFileStatus.toStrikethrough(change.status)
            },
            open: async () => this.open(change, { mode: 'reveal' })
        });
    }
    async open(change, options) {
        const uriToOpen = this.getUriToOpen(change);
        await this.editorManager.open(uriToOpen, options);
    }
    getUriToOpen(change) {
        const changeUri = new uri_1.default(change.uri);
        const fromFileUri = change.oldUri ? new uri_1.default(change.oldUri) : changeUri; // set oldUri on renamed and copied
        if (change.status === common_1.GitFileStatus.Deleted) {
            if (change.staged) {
                return changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery('HEAD');
            }
            else {
                return changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME);
            }
        }
        if (change.status !== common_1.GitFileStatus.New) {
            if (change.staged) {
                return diff_uris_1.DiffUris.encode(fromFileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery('HEAD'), changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME), nls_1.nls.localize('theia/git/tabTitleIndex', '{0} (Index)', this.labelProvider.getName(changeUri)));
            }
            if (this.stagedChanges.find(c => c.uri === change.uri)) {
                return diff_uris_1.DiffUris.encode(fromFileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME), changeUri, nls_1.nls.localize('theia/git/tabTitleWorkingTree', '{0} (Working tree)', this.labelProvider.getName(changeUri)));
            }
            if (this.mergeChanges.find(c => c.uri === change.uri)) {
                return changeUri;
            }
            return diff_uris_1.DiffUris.encode(fromFileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery('HEAD'), changeUri, nls_1.nls.localize('theia/git/tabTitleWorkingTree', '{0} (Working tree)', this.labelProvider.getName(changeUri)));
        }
        if (change.staged) {
            return changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME);
        }
        if (this.stagedChanges.find(c => c.uri === change.uri)) {
            return diff_uris_1.DiffUris.encode(changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME), changeUri, nls_1.nls.localize('theia/git/tabTitleWorkingTree', '{0} (Working tree)', this.labelProvider.getName(changeUri)));
        }
        return changeUri;
    }
    async openChange(change, options) {
        const uriToOpen = this.getUriToOpen(change);
        return this.editorManager.open(uriToOpen, options);
    }
    findChange(uri) {
        const stringUri = uri.toString();
        const merge = this.mergeChanges.find(c => c.uri.toString() === stringUri);
        if (merge) {
            return merge;
        }
        const unstaged = this.unstagedChanges.find(c => c.uri.toString() === stringUri);
        if (unstaged) {
            return unstaged;
        }
        return this.stagedChanges.find(c => c.uri.toString() === stringUri);
    }
    async stageAll() {
        try {
            // TODO resolve deletion conflicts
            // TODO confirm staging unresolved files
            await this.git.add(this.repository, []);
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async stage(uriArg) {
        try {
            const { repository, unstagedChanges, mergeChanges } = this;
            const uris = Array.isArray(uriArg) ? uriArg : [uriArg];
            const unstagedUris = uris
                .filter(uri => {
                const resourceUri = new uri_1.default(uri);
                return unstagedChanges.some(change => resourceUri.isEqualOrParent(new uri_1.default(change.uri)))
                    || mergeChanges.some(change => resourceUri.isEqualOrParent(new uri_1.default(change.uri)));
            });
            if (unstagedUris.length !== 0) {
                // TODO resolve deletion conflicts
                // TODO confirm staging of a unresolved file
                await this.git.add(repository, uris);
            }
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async unstageAll() {
        try {
            const { repository, stagedChanges } = this;
            const uris = stagedChanges.map(c => c.uri);
            await this.git.unstage(repository, uris, { reset: 'index' });
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async unstage(uriArg) {
        try {
            const { repository, stagedChanges } = this;
            const uris = Array.isArray(uriArg) ? uriArg : [uriArg];
            const stagedUris = uris
                .filter(uri => {
                const resourceUri = new uri_1.default(uri);
                return stagedChanges.some(change => resourceUri.isEqualOrParent(new uri_1.default(change.uri)));
            });
            if (stagedUris.length !== 0) {
                await this.git.unstage(repository, uris, { reset: 'index' });
            }
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async discardAll() {
        if (await this.confirmAll()) {
            try {
                // discard new files
                const newUris = this.unstagedChanges.filter(c => c.status === common_1.GitFileStatus.New).map(c => c.uri);
                await this.deleteAll(newUris);
                // unstage changes
                const uris = this.unstagedChanges.filter(c => c.status !== common_1.GitFileStatus.New).map(c => c.uri);
                await this.git.unstage(this.repository, uris, { treeish: 'HEAD', reset: 'working-tree' });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        }
    }
    async discard(uriArg) {
        const { repository } = this;
        const uris = Array.isArray(uriArg) ? uriArg : [uriArg];
        const status = this.getStatus();
        if (!status) {
            return;
        }
        const pairs = await Promise.all(uris
            .filter(uri => {
            const uriAsUri = new uri_1.default(uri);
            return status.changes.some(change => uriAsUri.isEqualOrParent(new uri_1.default(change.uri)));
        })
            .map(uri => {
            const includeIndexFlag = async () => {
                // Allow deletion, only iff the same file is not yet in the Git index.
                const isInIndex = await this.git.lsFiles(repository, uri, { errorUnmatch: true });
                return { uri, isInIndex };
            };
            return includeIndexFlag();
        }));
        const urisInIndex = pairs.filter(pair => pair.isInIndex).map(pair => pair.uri);
        if (urisInIndex.length !== 0) {
            if (!await this.confirm(urisInIndex)) {
                return;
            }
        }
        await Promise.all(pairs.map(pair => {
            const discardSingle = async () => {
                if (pair.isInIndex) {
                    try {
                        await this.git.unstage(repository, pair.uri, { treeish: 'HEAD', reset: 'working-tree' });
                    }
                    catch (error) {
                        this.gitErrorHandler.handleError(error);
                    }
                }
                else {
                    await this.commands.executeCommand(browser_1.WorkspaceCommands.FILE_DELETE.id, [new uri_1.default(pair.uri)]);
                }
            };
            return discardSingle();
        }));
    }
    confirm(paths) {
        let fileText;
        if (paths.length <= 3) {
            fileText = paths.map(path => this.labelProvider.getName(new uri_1.default(path))).join(', ');
        }
        else {
            fileText = `${paths.length} files`;
        }
        return new dialogs_1.ConfirmDialog({
            title: nls_1.nls.localize('vscode.git/package/command.clean', 'Discard Changes'),
            msg: nls_1.nls.localize('vscode.git/commands/confirm discard', 'Do you really want to discard changes in {0}?', fileText)
        }).open();
    }
    confirmAll() {
        return new dialogs_1.ConfirmDialog({
            title: nls_1.nls.localize('vscode.git/package/command.cleanAll', 'Discard All Changes'),
            msg: nls_1.nls.localize('vscode.git/commands/confirm discard all', 'Do you really want to discard all changes?')
        }).open();
    }
    async delete(uri) {
        try {
            await this.fileService.delete(uri, { recursive: true });
        }
        catch (e) {
            console.error(e);
        }
    }
    async deleteAll(uris) {
        await Promise.all(uris.map(uri => this.delete(new uri_1.default(uri))));
    }
    createScmCommit(gitCommit) {
        const scmCommit = {
            id: gitCommit.sha,
            summary: gitCommit.summary,
            authorName: gitCommit.author.name,
            authorEmail: gitCommit.author.email,
            authorDateRelative: gitCommit.authorDateRelative,
        };
        return scmCommit;
    }
    createScmHistoryCommit(gitCommit) {
        const range = {
            fromRevision: gitCommit.sha + '~1',
            toRevision: gitCommit.sha
        };
        const scmCommit = {
            ...this.createScmCommit(gitCommit),
            commitDetailUri: this.toCommitDetailUri(gitCommit.sha),
            scmProvider: this,
            gitFileChanges: gitCommit.fileChanges.map(change => new GitScmFileChange(change, this, range)),
            get fileChanges() {
                return this.gitFileChanges;
            },
            get commitDetailOptions() {
                return {
                    rootUri: this.scmProvider.rootUri,
                    commitSha: gitCommit.sha,
                    commitMessage: gitCommit.summary,
                    messageBody: gitCommit.body,
                    authorName: gitCommit.author.name,
                    authorEmail: gitCommit.author.email,
                    authorDate: gitCommit.author.timestamp,
                    authorDateRelative: gitCommit.authorDateRelative,
                };
            }
        };
        return scmCommit;
    }
    relativePath(uri) {
        const parsedUri = new uri_1.default(uri);
        const gitRepo = { localUri: this.rootUri };
        const relativePath = common_1.Repository.relativePath(gitRepo, parsedUri);
        if (relativePath) {
            return relativePath.toString();
        }
        return this.labelProvider.getLongName(parsedUri);
    }
    toCommitDetailUri(commitSha) {
        return new uri_1.default('').withScheme(GitScmProvider_1.GIT_COMMIT_DETAIL).withFragment(commitSha);
    }
};
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], GitScmProvider.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(git_error_handler_1.GitErrorHandler),
    __metadata("design:type", git_error_handler_1.GitErrorHandler)
], GitScmProvider.prototype, "gitErrorHandler", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], GitScmProvider.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitScmProvider.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandService),
    __metadata("design:type", Object)
], GitScmProvider.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(GitScmProviderOptions),
    __metadata("design:type", GitScmProviderOptions)
], GitScmProvider.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], GitScmProvider.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(git_preferences_1.GitPreferences),
    __metadata("design:type", Object)
], GitScmProvider.prototype, "gitPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitScmProvider.prototype, "init", null);
GitScmProvider = GitScmProvider_1 = __decorate([
    (0, inversify_1.injectable)()
], GitScmProvider);
exports.GitScmProvider = GitScmProvider;
(function (GitScmProvider) {
    GitScmProvider.GIT_COMMIT_DETAIL = 'git-commit-detail-widget';
    function initState(status) {
        return {
            status,
            stagedChanges: [],
            unstagedChanges: [],
            mergeChanges: [],
            groups: []
        };
    }
    GitScmProvider.initState = initState;
    GitScmProvider.Factory = Symbol('GitScmProvider.Factory');
})(GitScmProvider = exports.GitScmProvider || (exports.GitScmProvider = {}));
exports.GitScmProvider = GitScmProvider;
class GitAmendSupport {
    constructor(provider, repository, git) {
        this.provider = provider;
        this.repository = repository;
        this.git = git;
    }
    async getInitialAmendingCommits(amendingHeadCommitSha, latestCommitSha) {
        const commits = await this.git.log(this.repository, {
            range: { toRevision: amendingHeadCommitSha, fromRevision: latestCommitSha },
            maxCount: 50
        });
        return commits.map(commit => this.provider.createScmCommit(commit));
    }
    async getMessage(commit) {
        return (await this.git.exec(this.repository, ['log', '-n', '1', '--format=%B', commit])).stdout.trim();
    }
    async reset(commit) {
        if (commit === 'HEAD~' && await this.isHeadInitialCommit()) {
            await this.git.exec(this.repository, ['update-ref', '-d', 'HEAD']);
        }
        else {
            await this.git.exec(this.repository, ['reset', commit, '--soft']);
        }
    }
    async isHeadInitialCommit() {
        const result = await this.git.revParse(this.repository, { ref: 'HEAD~' });
        return !result;
    }
    async getLastCommit() {
        const commits = await this.git.log(this.repository, { maxCount: 1 });
        if (commits.length > 0) {
            return this.provider.createScmCommit(commits[0]);
        }
    }
}
exports.GitAmendSupport = GitAmendSupport;
class GitScmFileChange {
    constructor(fileChange, scmProvider, range) {
        this.fileChange = fileChange;
        this.scmProvider = scmProvider;
        this.range = range;
    }
    get gitFileChange() {
        return this.fileChange;
    }
    get uri() {
        return this.fileChange.uri;
    }
    getCaption() {
        const provider = this.scmProvider;
        let result = `${provider.relativePath(this.fileChange.uri)} - ${common_1.GitFileStatus.toString(this.fileChange.status, true)}`;
        if (this.fileChange.oldUri) {
            result = `${provider.relativePath(this.fileChange.oldUri)} -> ${result}`;
        }
        return result;
    }
    getStatusCaption() {
        return common_1.GitFileStatus.toString(this.fileChange.status, true);
    }
    getStatusAbbreviation() {
        return common_1.GitFileStatus.toAbbreviation(this.fileChange.status, this.fileChange.staged);
    }
    getClassNameForStatus() {
        return 'git-status staged ' + common_1.GitFileStatus[this.fileChange.status].toLowerCase();
    }
    getUriToOpen() {
        const uri = new uri_1.default(this.fileChange.uri);
        const fromFileURI = this.fileChange.oldUri ? new uri_1.default(this.fileChange.oldUri) : uri; // set oldUri on renamed and copied
        if (!this.range) {
            return uri;
        }
        const fromURI = this.range.fromRevision
            ? fromFileURI.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery(this.range.fromRevision.toString())
            : fromFileURI;
        const toURI = this.range.toRevision
            ? uri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery(this.range.toRevision.toString())
            : uri;
        let uriToOpen = uri;
        if (this.fileChange.status === common_1.GitFileStatus.Deleted) {
            uriToOpen = fromURI;
        }
        else if (this.fileChange.status === common_1.GitFileStatus.New) {
            uriToOpen = toURI;
        }
        else {
            uriToOpen = diff_uris_1.DiffUris.encode(fromURI, toURI);
        }
        return uriToOpen;
    }
}
exports.GitScmFileChange = GitScmFileChange;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-scm-provider'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/git-sync-service.js":
/*!**********************************************************!*\
  !*** ../../packages/git/lib/browser/git-sync-service.js ***!
  \**********************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitSyncService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const git_repository_tracker_1 = __webpack_require__(/*! ./git-repository-tracker */ "../../packages/git/lib/browser/git-repository-tracker.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/git/lib/common/index.js");
const git_error_handler_1 = __webpack_require__(/*! ./git-error-handler */ "../../packages/git/lib/browser/git-error-handler.js");
let GitSyncService = class GitSyncService {
    constructor() {
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.syncing = false;
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    isSyncing() {
        return this.syncing;
    }
    setSyncing(syncing) {
        this.syncing = syncing;
        this.fireDidChange();
    }
    canSync() {
        if (this.isSyncing()) {
            return false;
        }
        const status = this.repositoryTracker.selectedRepositoryStatus;
        return !!status && !!status.branch && !!status.upstreamBranch;
    }
    async sync() {
        const repository = this.repositoryTracker.selectedRepository;
        if (!this.canSync() || !repository) {
            return;
        }
        this.setSyncing(true);
        try {
            await this.git.fetch(repository);
            let status = await this.git.status(repository);
            this.setSyncing(false);
            const method = await this.getSyncMethod(status);
            if (method === undefined) {
                return;
            }
            this.setSyncing(true);
            if (method === 'pull-push' || method === 'rebase-push') {
                await this.git.pull(repository, {
                    rebase: method === 'rebase-push'
                });
                status = await this.git.status(repository);
            }
            if (this.shouldPush(status)) {
                await this.git.push(repository, {
                    force: method === 'force-push'
                });
            }
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
        finally {
            this.setSyncing(false);
        }
    }
    async getSyncMethod(status) {
        var _a;
        if (!status.upstreamBranch || !status.branch) {
            return undefined;
        }
        const { branch, upstreamBranch } = status;
        if (!this.shouldPull(status) && !this.shouldPush(status)) {
            this.messageService.info(`${branch} is already in sync with ${upstreamBranch}`);
            return undefined;
        }
        const methods = [{
                label: `Pull and push commits from and to '${upstreamBranch}'`,
                warning: `This action will pull and push commits from and to '${upstreamBranch}'.`,
                detail: 'pull-push'
            }, {
                label: `Fetch, rebase and push commits from and to '${upstreamBranch}'`,
                warning: `This action will fetch, rebase and push commits from and to '${upstreamBranch}'.`,
                detail: 'rebase-push'
            }, {
                label: `Force push commits to '${upstreamBranch}'`,
                warning: `This action will override commits in '${upstreamBranch}'.`,
                detail: 'force-push'
            }];
        const selectedCWD = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(methods, { placeholder: 'Select current working directory for new terminal' }));
        if (selectedCWD && await this.confirm('Synchronize Changes', methods.find(({ detail }) => detail === selectedCWD.detail).warning)) {
            return selectedCWD.detail;
        }
        else {
            return (undefined);
        }
    }
    canPublish() {
        if (this.isSyncing()) {
            return false;
        }
        const status = this.repositoryTracker.selectedRepositoryStatus;
        return !!status && !!status.branch && !status.upstreamBranch;
    }
    async publish() {
        const repository = this.repositoryTracker.selectedRepository;
        const status = this.repositoryTracker.selectedRepositoryStatus;
        const localBranch = status && status.branch;
        if (!this.canPublish() || !repository || !localBranch) {
            return;
        }
        const remote = await this.getRemote(repository, localBranch);
        if (remote &&
            await this.confirm('Publish changes', `This action will push commits to '${remote}/${localBranch}' and track it as an upstream branch.`)) {
            try {
                await this.git.push(repository, {
                    remote, localBranch, setUpstream: true
                });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        }
    }
    async getRemote(repository, branch) {
        var _a;
        const remotes = await this.git.remote(repository);
        if (remotes.length === 0) {
            this.messageService.warn('Your repository has no remotes configured to publish to.');
        }
        const selectedRemote = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(remotes.map(remote => ({ label: remote })), { placeholder: `Pick a remote to publish the branch ${branch} to:` }));
        return selectedRemote === null || selectedRemote === void 0 ? void 0 : selectedRemote.label;
    }
    shouldPush(status) {
        return status.aheadBehind ? status.aheadBehind.ahead > 0 : true;
    }
    shouldPull(status) {
        return status.aheadBehind ? status.aheadBehind.behind > 0 : true;
    }
    async confirm(title, msg) {
        return !!await new browser_1.ConfirmDialog({ title, msg, }).open();
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitSyncService.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], GitSyncService.prototype, "repositoryTracker", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], GitSyncService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(git_error_handler_1.GitErrorHandler),
    __metadata("design:type", git_error_handler_1.GitErrorHandler)
], GitSyncService.prototype, "gitErrorHandler", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], GitSyncService.prototype, "quickInputService", void 0);
GitSyncService = __decorate([
    (0, inversify_1.injectable)()
], GitSyncService);
exports.GitSyncService = GitSyncService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/git-sync-service'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/history/git-commit-detail-header-widget.js":
/*!*********************************************************************************!*\
  !*** ../../packages/git/lib/browser/history/git-commit-detail-header-widget.js ***!
  \*********************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitCommitDetailHeaderWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const scm_avatar_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-avatar-service */ "../../packages/scm/lib/browser/scm-avatar-service.js");
const git_commit_detail_widget_options_1 = __webpack_require__(/*! ./git-commit-detail-widget-options */ "../../packages/git/lib/browser/history/git-commit-detail-widget-options.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
let GitCommitDetailHeaderWidget = class GitCommitDetailHeaderWidget extends browser_1.ReactWidget {
    constructor(commitDetailOptions) {
        super();
        this.commitDetailOptions = commitDetailOptions;
        this.id = 'commit-header' + commitDetailOptions.commitSha;
        this.title.label = commitDetailOptions.commitSha.substring(0, 8);
        this.options = {
            range: {
                fromRevision: commitDetailOptions.commitSha + '~1',
                toRevision: commitDetailOptions.commitSha
            }
        };
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('git-commit');
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.authorAvatar = await this.avatarService.getAvatar(this.commitDetailOptions.authorEmail);
    }
    render() {
        return React.createElement('div', this.createContainerAttributes(), this.renderDiffListHeader());
    }
    createContainerAttributes() {
        return {
            style: { flexGrow: 0 }
        };
    }
    renderDiffListHeader() {
        const authorEMail = this.commitDetailOptions.authorEmail;
        const subject = React.createElement("div", { className: 'subject' }, this.commitDetailOptions.commitMessage);
        const body = React.createElement("div", { className: 'body' }, this.commitDetailOptions.messageBody || '');
        const subjectRow = React.createElement("div", { className: 'header-row' },
            React.createElement("div", { className: 'subjectContainer' },
                subject,
                body));
        const author = React.createElement("div", { className: 'author header-value noWrapInfo' }, this.commitDetailOptions.authorName);
        const mail = React.createElement("div", { className: 'mail header-value noWrapInfo' }, `<${authorEMail}>`);
        const authorRow = React.createElement("div", { className: 'header-row noWrapInfo' },
            React.createElement("div", { className: 'theia-header' }, "author: "),
            author);
        const mailRow = React.createElement("div", { className: 'header-row noWrapInfo' },
            React.createElement("div", { className: 'theia-header' }, "e-mail: "),
            mail);
        const authorDate = new Date(this.commitDetailOptions.authorDate);
        const dateStr = authorDate.toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
        });
        const date = React.createElement("div", { className: 'date header-value noWrapInfo' }, dateStr);
        const dateRow = React.createElement("div", { className: 'header-row noWrapInfo' },
            React.createElement("div", { className: 'theia-header' }, "date: "),
            date);
        const revisionRow = React.createElement("div", { className: 'header-row noWrapInfo' },
            React.createElement("div", { className: 'theia-header' }, "revision: "),
            React.createElement("div", { className: 'header-value noWrapInfo' }, this.commitDetailOptions.commitSha));
        const gravatar = React.createElement("div", { className: 'image-container' },
            React.createElement("img", { className: 'gravatar', src: this.authorAvatar }));
        const commitInfo = React.createElement("div", { className: 'header-row commit-info-row' },
            gravatar,
            React.createElement("div", { className: 'commit-info' },
                authorRow,
                mailRow,
                dateRow,
                revisionRow));
        return React.createElement("div", { className: 'diff-header' },
            subjectRow,
            commitInfo);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], GitCommitDetailHeaderWidget.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(scm_avatar_service_1.ScmAvatarService),
    __metadata("design:type", scm_avatar_service_1.ScmAvatarService)
], GitCommitDetailHeaderWidget.prototype, "avatarService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitCommitDetailHeaderWidget.prototype, "init", null);
GitCommitDetailHeaderWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(git_commit_detail_widget_options_1.GitCommitDetailWidgetOptions)),
    __metadata("design:paramtypes", [Object])
], GitCommitDetailHeaderWidget);
exports.GitCommitDetailHeaderWidget = GitCommitDetailHeaderWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/history/git-commit-detail-header-widget'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/history/git-commit-detail-open-handler.js":
/*!********************************************************************************!*\
  !*** ../../packages/git/lib/browser/history/git-commit-detail-open-handler.js ***!
  \********************************************************************************/
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
exports.GitCommitDetailOpenHandler = exports.GitCommitDetailUri = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const git_scm_provider_1 = __webpack_require__(/*! ../git-scm-provider */ "../../packages/git/lib/browser/git-scm-provider.js");
var GitCommitDetailUri;
(function (GitCommitDetailUri) {
    GitCommitDetailUri.scheme = git_scm_provider_1.GitScmProvider.GIT_COMMIT_DETAIL;
    function toCommitSha(uri) {
        if (uri.scheme === GitCommitDetailUri.scheme) {
            return uri.fragment;
        }
        throw new Error('The given uri is not an commit detail URI, uri: ' + uri);
    }
    GitCommitDetailUri.toCommitSha = toCommitSha;
})(GitCommitDetailUri = exports.GitCommitDetailUri || (exports.GitCommitDetailUri = {}));
let GitCommitDetailOpenHandler = class GitCommitDetailOpenHandler extends browser_1.WidgetOpenHandler {
    constructor() {
        super(...arguments);
        this.id = git_scm_provider_1.GitScmProvider.GIT_COMMIT_DETAIL;
    }
    canHandle(uri) {
        try {
            GitCommitDetailUri.toCommitSha(uri);
            return 200;
        }
        catch {
            return 0;
        }
    }
    async doOpen(widget, options) {
        await super.doOpen(widget, options);
    }
    createWidgetOptions(uri, commit) {
        return commit;
    }
};
GitCommitDetailOpenHandler = __decorate([
    (0, inversify_1.injectable)()
], GitCommitDetailOpenHandler);
exports.GitCommitDetailOpenHandler = GitCommitDetailOpenHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/history/git-commit-detail-open-handler'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/history/git-commit-detail-widget-options.js":
/*!**********************************************************************************!*\
  !*** ../../packages/git/lib/browser/history/git-commit-detail-widget-options.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitCommitDetailWidgetOptions = void 0;
exports.GitCommitDetailWidgetOptions = Symbol('GitCommitDetailWidgetOptions');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/history/git-commit-detail-widget-options'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/history/git-commit-detail-widget.js":
/*!**************************************************************************!*\
  !*** ../../packages/git/lib/browser/history/git-commit-detail-widget.js ***!
  \**************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitCommitDetailWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const git_commit_detail_widget_options_1 = __webpack_require__(/*! ./git-commit-detail-widget-options */ "../../packages/git/lib/browser/history/git-commit-detail-widget-options.js");
const git_commit_detail_header_widget_1 = __webpack_require__(/*! ./git-commit-detail-header-widget */ "../../packages/git/lib/browser/history/git-commit-detail-header-widget.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const git_diff_tree_model_1 = __webpack_require__(/*! ../diff/git-diff-tree-model */ "../../packages/git/lib/browser/diff/git-diff-tree-model.js");
const scm_tree_widget_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-tree-widget */ "../../packages/scm/lib/browser/scm-tree-widget.js");
const scm_preferences_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-preferences */ "../../packages/scm/lib/browser/scm-preferences.js");
let GitCommitDetailWidget = class GitCommitDetailWidget extends browser_1.BaseWidget {
    constructor(options) {
        super();
        this.options = options;
        this.id = 'commit' + options.commitSha;
        this.title.label = options.commitSha.substring(0, 8);
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('git-commit');
        this.addClass('theia-scm');
        this.addClass('theia-git');
        this.addClass('git-diff-container');
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
        this.containerLayout.addWidget(this.commitDetailHeaderWidget);
        this.containerLayout.addWidget(this.resourceWidget);
        this.updateViewMode(this.scmPreferences.get('scm.defaultViewMode'));
        this.toDispose.push(this.scmPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'scm.defaultViewMode') {
                this.updateViewMode(e.newValue);
            }
        }));
        const diffOptions = {
            range: {
                fromRevision: this.options.commitSha + '~1',
                toRevision: this.options.commitSha
            }
        };
        this.model.setContent({ rootUri: this.options.rootUri, diffOptions });
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
    updateImmediately() {
        this.onUpdateRequest(browser_1.Widget.Msg.UpdateRequest);
    }
    onUpdateRequest(msg) {
        browser_1.MessageLoop.sendMessage(this.commitDetailHeaderWidget, msg);
        browser_1.MessageLoop.sendMessage(this.resourceWidget, msg);
        super.onUpdateRequest(msg);
    }
    onAfterAttach(msg) {
        this.node.appendChild(this.commitDetailHeaderWidget.node);
        this.node.appendChild(this.resourceWidget.node);
        super.onAfterAttach(msg);
        this.update();
    }
    storeState() {
        const state = {
            changesTreeState: this.resourceWidget.storeState(),
        };
        return state;
    }
    restoreState(oldState) {
        const { changesTreeState } = oldState;
        this.resourceWidget.restoreState(changesTreeState);
    }
};
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], GitCommitDetailWidget.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(git_commit_detail_header_widget_1.GitCommitDetailHeaderWidget),
    __metadata("design:type", git_commit_detail_header_widget_1.GitCommitDetailHeaderWidget)
], GitCommitDetailWidget.prototype, "commitDetailHeaderWidget", void 0);
__decorate([
    (0, inversify_1.inject)(scm_tree_widget_1.ScmTreeWidget),
    __metadata("design:type", scm_tree_widget_1.ScmTreeWidget)
], GitCommitDetailWidget.prototype, "resourceWidget", void 0);
__decorate([
    (0, inversify_1.inject)(git_diff_tree_model_1.GitDiffTreeModel),
    __metadata("design:type", git_diff_tree_model_1.GitDiffTreeModel)
], GitCommitDetailWidget.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(scm_preferences_1.ScmPreferences),
    __metadata("design:type", Object)
], GitCommitDetailWidget.prototype, "scmPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitCommitDetailWidget.prototype, "init", null);
GitCommitDetailWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(git_commit_detail_widget_options_1.GitCommitDetailWidgetOptions)),
    __metadata("design:paramtypes", [Object])
], GitCommitDetailWidget);
exports.GitCommitDetailWidget = GitCommitDetailWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/history/git-commit-detail-widget'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/history/git-history-frontend-module.js":
/*!*****************************************************************************!*\
  !*** ../../packages/git/lib/browser/history/git-history-frontend-module.js ***!
  \*****************************************************************************/
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
exports.createGitCommitDetailWidgetContainer = exports.bindGitHistoryModule = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const git_commit_detail_widget_options_1 = __webpack_require__(/*! ./git-commit-detail-widget-options */ "../../packages/git/lib/browser/history/git-commit-detail-widget-options.js");
const git_commit_detail_widget_1 = __webpack_require__(/*! ./git-commit-detail-widget */ "../../packages/git/lib/browser/history/git-commit-detail-widget.js");
const git_commit_detail_header_widget_1 = __webpack_require__(/*! ./git-commit-detail-header-widget */ "../../packages/git/lib/browser/history/git-commit-detail-header-widget.js");
const git_diff_tree_model_1 = __webpack_require__(/*! ../diff/git-diff-tree-model */ "../../packages/git/lib/browser/diff/git-diff-tree-model.js");
const git_commit_detail_open_handler_1 = __webpack_require__(/*! ./git-commit-detail-open-handler */ "../../packages/git/lib/browser/history/git-commit-detail-open-handler.js");
const git_scm_provider_1 = __webpack_require__(/*! ../git-scm-provider */ "../../packages/git/lib/browser/git-scm-provider.js");
const scm_frontend_module_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-frontend-module */ "../../packages/scm/lib/browser/scm-frontend-module.js");
const git_resource_opener_1 = __webpack_require__(/*! ../diff/git-resource-opener */ "../../packages/git/lib/browser/diff/git-resource-opener.js");
const git_opener_in_secondary_area_1 = __webpack_require__(/*! ./git-opener-in-secondary-area */ "../../packages/git/lib/browser/history/git-opener-in-secondary-area.js");
__webpack_require__(/*! ../../../src/browser/style/git-icons.css */ "../../packages/git/src/browser/style/git-icons.css");
function bindGitHistoryModule(bind) {
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: git_scm_provider_1.GitScmProvider.GIT_COMMIT_DETAIL,
        createWidget: (options) => {
            const child = createGitCommitDetailWidgetContainer(ctx.container, options);
            return child.get(git_commit_detail_widget_1.GitCommitDetailWidget);
        }
    }));
    bind(git_commit_detail_open_handler_1.GitCommitDetailOpenHandler).toSelf();
    bind(browser_1.OpenHandler).toService(git_commit_detail_open_handler_1.GitCommitDetailOpenHandler);
}
exports.bindGitHistoryModule = bindGitHistoryModule;
function createGitCommitDetailWidgetContainer(parent, options) {
    const child = (0, scm_frontend_module_1.createScmTreeContainer)(parent);
    child.bind(git_commit_detail_widget_1.GitCommitDetailWidget).toSelf();
    child.bind(git_commit_detail_header_widget_1.GitCommitDetailHeaderWidget).toSelf();
    child.bind(git_diff_tree_model_1.GitDiffTreeModel).toSelf();
    child.bind(browser_1.TreeModel).toService(git_diff_tree_model_1.GitDiffTreeModel);
    child.bind(git_opener_in_secondary_area_1.GitOpenerInSecondaryArea).toSelf();
    child.bind(git_resource_opener_1.GitResourceOpener).toService(git_opener_in_secondary_area_1.GitOpenerInSecondaryArea);
    child.bind(git_commit_detail_widget_options_1.GitCommitDetailWidgetOptions).toConstantValue(options);
    const opener = child.get(git_opener_in_secondary_area_1.GitOpenerInSecondaryArea);
    const widget = child.get(git_commit_detail_widget_1.GitCommitDetailWidget);
    opener.setRefWidget(widget);
    return child;
}
exports.createGitCommitDetailWidgetContainer = createGitCommitDetailWidgetContainer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/history/git-history-frontend-module'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/history/git-history-support.js":
/*!*********************************************************************!*\
  !*** ../../packages/git/lib/browser/history/git-history-support.js ***!
  \*********************************************************************/
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
exports.GitHistorySupport = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/git/lib/common/index.js");
const git_scm_provider_1 = __webpack_require__(/*! ../git-scm-provider */ "../../packages/git/lib/browser/git-scm-provider.js");
const git_repository_tracker_1 = __webpack_require__(/*! ../git-repository-tracker */ "../../packages/git/lib/browser/git-repository-tracker.js");
let GitHistorySupport = class GitHistorySupport {
    constructor() {
        this.onDidChangeHistoryEmitter = new core_1.Emitter({
            onFirstListenerAdd: () => this.onFirstListenerAdd(),
            onLastListenerRemove: () => this.onLastListenerRemove()
        });
        this.onDidChangeHistory = this.onDidChangeHistoryEmitter.event;
    }
    async getCommitHistory(options) {
        const repository = this.provider.repository;
        const gitOptions = {
            uri: options ? options.uri : undefined,
            maxCount: options ? options.maxCount : undefined,
            range: options === null || options === void 0 ? void 0 : options.range,
            shortSha: true
        };
        const commits = await this.git.log(repository, gitOptions);
        if (commits.length > 0) {
            return commits.map(commit => this.provider.createScmHistoryCommit(commit));
        }
        else {
            const pathIsUnderVersionControl = !options || !options.uri || await this.git.lsFiles(repository, options.uri, { errorUnmatch: true });
            if (!pathIsUnderVersionControl) {
                throw new Error('It is not under version control.');
            }
            else {
                throw new Error('No commits have been committed.');
            }
        }
    }
    onFirstListenerAdd() {
        this.onGitEventDisposable = this.repositoryTracker.onGitEvent(event => {
            const { status, oldStatus } = event || { status: undefined, oldStatus: undefined };
            let isBranchChanged = false;
            let isHeaderChanged = false;
            if (oldStatus) {
                isBranchChanged = !!status && status.branch !== oldStatus.branch;
                isHeaderChanged = !!status && status.currentHead !== oldStatus.currentHead;
            }
            if (isBranchChanged || isHeaderChanged || oldStatus === undefined) {
                this.onDidChangeHistoryEmitter.fire(undefined);
            }
        });
    }
    onLastListenerRemove() {
        if (this.onGitEventDisposable) {
            this.onGitEventDisposable.dispose();
            this.onGitEventDisposable = undefined;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(git_scm_provider_1.GitScmProvider),
    __metadata("design:type", git_scm_provider_1.GitScmProvider)
], GitHistorySupport.prototype, "provider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitHistorySupport.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], GitHistorySupport.prototype, "repositoryTracker", void 0);
GitHistorySupport = __decorate([
    (0, inversify_1.injectable)()
], GitHistorySupport);
exports.GitHistorySupport = GitHistorySupport;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/history/git-history-support'] = this;


/***/ }),

/***/ "../../packages/git/lib/browser/history/git-opener-in-secondary-area.js":
/*!******************************************************************************!*\
  !*** ../../packages/git/lib/browser/history/git-opener-in-secondary-area.js ***!
  \******************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitOpenerInSecondaryArea = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const widgets_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/widgets */ "../../packages/core/shared/@phosphor/widgets/index.js");
const editor_manager_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
let GitOpenerInSecondaryArea = class GitOpenerInSecondaryArea {
    setRefWidget(refWidget) {
        this.refWidget = refWidget;
    }
    async open(changeUri) {
        const ref = this.ref;
        const widget = await this.editorManager.open(changeUri, {
            mode: 'reveal',
            widgetOptions: ref ?
                { area: 'main', mode: 'tab-after', ref } :
                { area: 'main', mode: 'split-right', ref: this.refWidget }
        });
        this.ref = widget instanceof widgets_1.Widget ? widget : undefined;
        if (this.ref) {
            this.ref.disposed.connect(() => {
                if (this.ref === widget) {
                    this.ref = undefined;
                }
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], GitOpenerInSecondaryArea.prototype, "editorManager", void 0);
GitOpenerInSecondaryArea = __decorate([
    (0, inversify_1.injectable)()
], GitOpenerInSecondaryArea);
exports.GitOpenerInSecondaryArea = GitOpenerInSecondaryArea;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/browser/history/git-opener-in-secondary-area'] = this;


/***/ }),

/***/ "../../packages/git/lib/common/git-model.js":
/*!**************************************************!*\
  !*** ../../packages/git/lib/common/git-model.js ***!
  \**************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitError = exports.BranchType = exports.Repository = exports.GitFileStatus = exports.WorkingDirectoryStatus = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
var WorkingDirectoryStatus;
(function (WorkingDirectoryStatus) {
    /**
     * `true` if the directory statuses are deep equal, otherwise `false`.
     */
    function equals(left, right) {
        if (left && right) {
            return left.exists === right.exists
                && left.branch === right.branch
                && left.upstreamBranch === right.upstreamBranch
                && left.currentHead === right.currentHead
                && (left.aheadBehind ? left.aheadBehind.ahead : -1) === (right.aheadBehind ? right.aheadBehind.ahead : -1)
                && (left.aheadBehind ? left.aheadBehind.behind : -1) === (right.aheadBehind ? right.aheadBehind.behind : -1)
                && left.changes.length === right.changes.length
                && !!left.incomplete === !!right.incomplete
                && JSON.stringify(left) === JSON.stringify(right);
        }
        else {
            return left === right;
        }
    }
    WorkingDirectoryStatus.equals = equals;
})(WorkingDirectoryStatus = exports.WorkingDirectoryStatus || (exports.WorkingDirectoryStatus = {}));
/**
 * Enumeration of states that a file resource can have in the working directory.
 */
var GitFileStatus;
(function (GitFileStatus) {
    GitFileStatus[GitFileStatus["New"] = 0] = "New";
    GitFileStatus[GitFileStatus["Copied"] = 1] = "Copied";
    GitFileStatus[GitFileStatus["Modified"] = 2] = "Modified";
    GitFileStatus[GitFileStatus["Renamed"] = 3] = "Renamed";
    GitFileStatus[GitFileStatus["Deleted"] = 4] = "Deleted";
    GitFileStatus[GitFileStatus["Conflicted"] = 5] = "Conflicted";
})(GitFileStatus = exports.GitFileStatus || (exports.GitFileStatus = {}));
(function (GitFileStatus) {
    /**
     * Compares the statuses based on the natural order of the enumeration.
     */
    GitFileStatus.statusCompare = (left, right) => left - right;
    /**
     * Returns with human readable representation of the Git file status argument. If the `staged` argument is `undefined`,
     * it will be treated as `false`.
     */
    GitFileStatus.toString = (status, staged) => {
        switch (status) {
            case GitFileStatus.New: return !!staged ? core_1.nls.localize('theia/git/added', 'Added') : core_1.nls.localize('theia/git/unstaged', 'Unstaged');
            case GitFileStatus.Renamed: return core_1.nls.localize('theia/git/renamed', 'Renamed');
            case GitFileStatus.Copied: return core_1.nls.localize('theia/git/copied', 'Copied');
            // eslint-disable-next-line @theia/localization-check
            case GitFileStatus.Modified: return core_1.nls.localize('vscode.git/repository/modified', 'Modified');
            // eslint-disable-next-line @theia/localization-check
            case GitFileStatus.Deleted: return core_1.nls.localize('vscode.git/repository/deleted', 'Deleted');
            case GitFileStatus.Conflicted: return core_1.nls.localize('theia/git/conflicted', 'Conflicted');
            default: throw new Error(`Unexpected Git file stats: ${status}.`);
        }
    };
    /**
     * Returns with the human readable abbreviation of the Git file status argument. `staged` argument defaults to `false`.
     */
    GitFileStatus.toAbbreviation = (status, staged) => {
        switch (status) {
            case GitFileStatus.New: return !!staged ? 'A' : 'U';
            case GitFileStatus.Renamed: return 'R';
            case GitFileStatus.Copied: return 'C';
            case GitFileStatus.Modified: return 'M';
            case GitFileStatus.Deleted: return 'D';
            case GitFileStatus.Conflicted: return 'C';
            default: throw new Error(`Unexpected Git file stats: ${status}.`);
        }
    };
    /**
     * It should be aligned with https://github.com/microsoft/vscode/blob/0dfa355b3ad185a6289ba28a99c141ab9e72d2be/extensions/git/src/repository.ts#L197
     */
    function getColor(status, staged) {
        switch (status) {
            case GitFileStatus.New: {
                if (!staged) {
                    return 'var(--theia-gitDecoration-untrackedResourceForeground)';
                }
                return 'var(--theia-gitDecoration-addedResourceForeground)';
            }
            case GitFileStatus.Renamed: return 'var(--theia-gitDecoration-untrackedResourceForeground)';
            case GitFileStatus.Copied: // Fall through.
            case GitFileStatus.Modified: return 'var(--theia-gitDecoration-modifiedResourceForeground)';
            case GitFileStatus.Deleted: return 'var(--theia-gitDecoration-deletedResourceForeground)';
            case GitFileStatus.Conflicted: return 'var(--theia-gitDecoration-conflictingResourceForeground)';
        }
    }
    GitFileStatus.getColor = getColor;
    function toStrikethrough(status) {
        return status === GitFileStatus.Deleted;
    }
    GitFileStatus.toStrikethrough = toStrikethrough;
})(GitFileStatus = exports.GitFileStatus || (exports.GitFileStatus = {}));
var Repository;
(function (Repository) {
    function equal(repository, repository2) {
        if (repository && repository2) {
            return repository.localUri === repository2.localUri;
        }
        return repository === repository2;
    }
    Repository.equal = equal;
    function is(repository) {
        return (0, core_1.isObject)(repository) && 'localUri' in repository;
    }
    Repository.is = is;
    function relativePath(repository, uri) {
        const repositoryUri = new uri_1.default(Repository.is(repository) ? repository.localUri : String(repository));
        return repositoryUri.relative(new uri_1.default(String(uri)));
    }
    Repository.relativePath = relativePath;
})(Repository = exports.Repository || (exports.Repository = {}));
/**
 * The branch type. Either local or remote.
 * The order matters.
 */
var BranchType;
(function (BranchType) {
    /**
     * The local branch type.
     */
    BranchType[BranchType["Local"] = 0] = "Local";
    /**
     * The remote branch type.
     */
    BranchType[BranchType["Remote"] = 1] = "Remote";
})(BranchType = exports.BranchType || (exports.BranchType = {}));
/**
 * The Git errors which can be parsed from failed Git commands.
 */
var GitError;
(function (GitError) {
    GitError[GitError["SSHKeyAuditUnverified"] = 0] = "SSHKeyAuditUnverified";
    GitError[GitError["SSHAuthenticationFailed"] = 1] = "SSHAuthenticationFailed";
    GitError[GitError["SSHPermissionDenied"] = 2] = "SSHPermissionDenied";
    GitError[GitError["HTTPSAuthenticationFailed"] = 3] = "HTTPSAuthenticationFailed";
    GitError[GitError["RemoteDisconnection"] = 4] = "RemoteDisconnection";
    GitError[GitError["HostDown"] = 5] = "HostDown";
    GitError[GitError["RebaseConflicts"] = 6] = "RebaseConflicts";
    GitError[GitError["MergeConflicts"] = 7] = "MergeConflicts";
    GitError[GitError["HTTPSRepositoryNotFound"] = 8] = "HTTPSRepositoryNotFound";
    GitError[GitError["SSHRepositoryNotFound"] = 9] = "SSHRepositoryNotFound";
    GitError[GitError["PushNotFastForward"] = 10] = "PushNotFastForward";
    GitError[GitError["BranchDeletionFailed"] = 11] = "BranchDeletionFailed";
    GitError[GitError["DefaultBranchDeletionFailed"] = 12] = "DefaultBranchDeletionFailed";
    GitError[GitError["RevertConflicts"] = 13] = "RevertConflicts";
    GitError[GitError["EmptyRebasePatch"] = 14] = "EmptyRebasePatch";
    GitError[GitError["NoMatchingRemoteBranch"] = 15] = "NoMatchingRemoteBranch";
    GitError[GitError["NoExistingRemoteBranch"] = 16] = "NoExistingRemoteBranch";
    GitError[GitError["NothingToCommit"] = 17] = "NothingToCommit";
    GitError[GitError["NoSubmoduleMapping"] = 18] = "NoSubmoduleMapping";
    GitError[GitError["SubmoduleRepositoryDoesNotExist"] = 19] = "SubmoduleRepositoryDoesNotExist";
    GitError[GitError["InvalidSubmoduleSHA"] = 20] = "InvalidSubmoduleSHA";
    GitError[GitError["LocalPermissionDenied"] = 21] = "LocalPermissionDenied";
    GitError[GitError["InvalidMerge"] = 22] = "InvalidMerge";
    GitError[GitError["InvalidRebase"] = 23] = "InvalidRebase";
    GitError[GitError["NonFastForwardMergeIntoEmptyHead"] = 24] = "NonFastForwardMergeIntoEmptyHead";
    GitError[GitError["PatchDoesNotApply"] = 25] = "PatchDoesNotApply";
    GitError[GitError["BranchAlreadyExists"] = 26] = "BranchAlreadyExists";
    GitError[GitError["BadRevision"] = 27] = "BadRevision";
    GitError[GitError["NotAGitRepository"] = 28] = "NotAGitRepository";
    GitError[GitError["CannotMergeUnrelatedHistories"] = 29] = "CannotMergeUnrelatedHistories";
    GitError[GitError["LFSAttributeDoesNotMatch"] = 30] = "LFSAttributeDoesNotMatch";
    GitError[GitError["BranchRenameFailed"] = 31] = "BranchRenameFailed";
    GitError[GitError["PathDoesNotExist"] = 32] = "PathDoesNotExist";
    GitError[GitError["InvalidObjectName"] = 33] = "InvalidObjectName";
    GitError[GitError["OutsideRepository"] = 34] = "OutsideRepository";
    GitError[GitError["LockFileAlreadyExists"] = 35] = "LockFileAlreadyExists";
    GitError[GitError["NoMergeToAbort"] = 36] = "NoMergeToAbort";
    GitError[GitError["LocalChangesOverwritten"] = 37] = "LocalChangesOverwritten";
    GitError[GitError["UnresolvedConflicts"] = 38] = "UnresolvedConflicts";
    GitError[GitError["GPGFailedToSignData"] = 39] = "GPGFailedToSignData";
    GitError[GitError["ConflictModifyDeletedInBranch"] = 40] = "ConflictModifyDeletedInBranch";
    // GitHub-specific error codes
    GitError[GitError["PushWithFileSizeExceedingLimit"] = 41] = "PushWithFileSizeExceedingLimit";
    GitError[GitError["HexBranchNameRejected"] = 42] = "HexBranchNameRejected";
    GitError[GitError["ForcePushRejected"] = 43] = "ForcePushRejected";
    GitError[GitError["InvalidRefLength"] = 44] = "InvalidRefLength";
    GitError[GitError["ProtectedBranchRequiresReview"] = 45] = "ProtectedBranchRequiresReview";
    GitError[GitError["ProtectedBranchForcePush"] = 46] = "ProtectedBranchForcePush";
    GitError[GitError["ProtectedBranchDeleteRejected"] = 47] = "ProtectedBranchDeleteRejected";
    GitError[GitError["ProtectedBranchRequiredStatus"] = 48] = "ProtectedBranchRequiredStatus";
    GitError[GitError["PushWithPrivateEmail"] = 49] = "PushWithPrivateEmail";
    // End of GitHub-specific error codes
    GitError[GitError["ConfigLockFileAlreadyExists"] = 50] = "ConfigLockFileAlreadyExists";
    GitError[GitError["RemoteAlreadyExists"] = 51] = "RemoteAlreadyExists";
    GitError[GitError["TagAlreadyExists"] = 52] = "TagAlreadyExists";
    GitError[GitError["MergeWithLocalChanges"] = 53] = "MergeWithLocalChanges";
    GitError[GitError["RebaseWithLocalChanges"] = 54] = "RebaseWithLocalChanges";
    GitError[GitError["MergeCommitNoMainlineOption"] = 55] = "MergeCommitNoMainlineOption";
    GitError[GitError["UnsafeDirectory"] = 56] = "UnsafeDirectory";
    GitError[GitError["PathExistsButNotInRef"] = 57] = "PathExistsButNotInRef";
})(GitError = exports.GitError || (exports.GitError = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/common/git-model'] = this;


/***/ }),

/***/ "../../packages/git/lib/common/git-watcher.js":
/*!****************************************************!*\
  !*** ../../packages/git/lib/common/git-watcher.js ***!
  \****************************************************/
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitWatcher = exports.GitWatcherPath = exports.ReconnectingGitWatcherServer = exports.GitWatcherServerProxy = exports.GitWatcherServer = exports.GitStatusChangeEvent = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
var GitStatusChangeEvent;
(function (GitStatusChangeEvent) {
    /**
     * `true` if the argument is a `GitStatusEvent`, otherwise `false`.
     * @param event the argument to check whether it is a Git status change event or not.
     */
    function is(event) {
        return (0, core_1.isObject)(event) && ('source' in event) && ('status' in event);
    }
    GitStatusChangeEvent.is = is;
})(GitStatusChangeEvent = exports.GitStatusChangeEvent || (exports.GitStatusChangeEvent = {}));
/**
 * The symbol of the Git watcher backend for DI.
 */
exports.GitWatcherServer = Symbol('GitWatcherServer');
exports.GitWatcherServerProxy = Symbol('GitWatcherServerProxy');
let ReconnectingGitWatcherServer = class ReconnectingGitWatcherServer {
    constructor(proxy) {
        this.proxy = proxy;
        this.watcherSequence = 1;
        this.watchParams = new Map();
        this.localToRemoteWatcher = new Map();
        this.proxy.onDidOpenConnection(() => this.reconnect());
    }
    async watchGitChanges(repository) {
        const watcher = this.watcherSequence++;
        this.watchParams.set(watcher, repository);
        return this.doWatchGitChanges([watcher, repository]);
    }
    async unwatchGitChanges(watcher) {
        this.watchParams.delete(watcher);
        const remote = this.localToRemoteWatcher.get(watcher);
        if (remote) {
            this.localToRemoteWatcher.delete(remote);
            return this.proxy.unwatchGitChanges(remote);
        }
        else {
            throw new Error(`No Git watchers were registered with ID: ${watcher}.`);
        }
    }
    dispose() {
        this.proxy.dispose();
    }
    setClient(client) {
        this.proxy.setClient(client);
    }
    reconnect() {
        [...this.watchParams.entries()].forEach(entry => this.doWatchGitChanges(entry));
    }
    async doWatchGitChanges(entry) {
        const [watcher, repository] = entry;
        const remote = await this.proxy.watchGitChanges(repository);
        this.localToRemoteWatcher.set(watcher, remote);
        return watcher;
    }
};
ReconnectingGitWatcherServer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.GitWatcherServerProxy)),
    __metadata("design:paramtypes", [Object])
], ReconnectingGitWatcherServer);
exports.ReconnectingGitWatcherServer = ReconnectingGitWatcherServer;
/**
 * Unique WS endpoint path to the Git watcher service.
 */
exports.GitWatcherPath = '/services/git-watcher';
let GitWatcher = class GitWatcher {
    constructor(server) {
        this.server = server;
        this.toDispose = new common_1.DisposableCollection();
        this.onGitEventEmitter = new common_1.Emitter();
        this.toDispose.push(this.onGitEventEmitter);
        this.server.setClient({ onGitChanged: e => this.onGitChanged(e) });
    }
    dispose() {
        this.toDispose.dispose();
    }
    get onGitEvent() {
        return this.onGitEventEmitter.event;
    }
    async onGitChanged(event) {
        this.onGitEventEmitter.fire(event);
    }
    async watchGitChanges(repository) {
        const watcher = await this.server.watchGitChanges(repository);
        const toDispose = new common_1.DisposableCollection();
        toDispose.push(common_1.Disposable.create(() => this.server.unwatchGitChanges(watcher)));
        return toDispose;
    }
};
GitWatcher = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.GitWatcherServer)),
    __metadata("design:paramtypes", [Object])
], GitWatcher);
exports.GitWatcher = GitWatcher;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/common/git-watcher'] = this;


/***/ }),

/***/ "../../packages/git/lib/common/git.js":
/*!********************************************!*\
  !*** ../../packages/git/lib/common/git.js ***!
  \********************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitUtils = exports.Git = exports.GitPath = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const git_model_1 = __webpack_require__(/*! ./git-model */ "../../packages/git/lib/common/git-model.js");
/**
 * The WS endpoint path to the Git service.
 */
exports.GitPath = '/services/git';
/**
 * Git symbol for DI.
 */
exports.Git = Symbol('Git');
/**
 * Contains a set of utility functions for {@link Git}.
 */
var GitUtils;
(function (GitUtils) {
    /**
     * `true` if the argument is an option for renaming an existing branch in the repository.
     */
    function isBranchRename(arg) {
        return (0, core_1.isObject)(arg) && 'newName' in arg;
    }
    GitUtils.isBranchRename = isBranchRename;
    /**
     * `true` if the argument is an option for deleting an existing branch in the repository.
     */
    function isBranchDelete(arg) {
        return (0, core_1.isObject)(arg) && 'toDelete' in arg;
    }
    GitUtils.isBranchDelete = isBranchDelete;
    /**
     * `true` if the argument is an option for creating a new branch in the repository.
     */
    function isBranchCreate(arg) {
        return (0, core_1.isObject)(arg) && 'toCreate' in arg;
    }
    GitUtils.isBranchCreate = isBranchCreate;
    /**
     * `true` if the argument is an option for listing the branches in a repository.
     */
    function isBranchList(arg) {
        return (0, core_1.isObject)(arg) && 'type' in arg;
    }
    GitUtils.isBranchList = isBranchList;
    /**
     * `true` if the argument is an option for checking out a new local branch.
     */
    function isBranchCheckout(arg) {
        return (0, core_1.isObject)(arg) && 'branch' in arg;
    }
    GitUtils.isBranchCheckout = isBranchCheckout;
    /**
     * `true` if the argument is an option for checking out a working tree file.
     */
    function isWorkingTreeFileCheckout(arg) {
        return (0, core_1.isObject)(arg) && 'paths' in arg;
    }
    GitUtils.isWorkingTreeFileCheckout = isWorkingTreeFileCheckout;
    /**
     * The error code for when the path to a repository doesn't exist.
     */
    const RepositoryDoesNotExistErrorCode = 'repository-does-not-exist-error';
    /**
     * `true` if the argument is an error indicating the absence of a local Git repository.
     * Otherwise, `false`.
     */
    function isRepositoryDoesNotExistError(error) {
        // TODO this is odd here.This piece of code is already implementation specific, so this should go to the Git API.
        // But how can we ensure that the `any` type error is serializable?
        if (error instanceof Error && ('code' in error)) {
            return error.code === RepositoryDoesNotExistErrorCode;
        }
        return false;
    }
    GitUtils.isRepositoryDoesNotExistError = isRepositoryDoesNotExistError;
    /**
     * Maps the raw status text from Git to a Git file status enumeration.
     */
    function mapStatus(rawStatus) {
        const status = rawStatus.trim();
        if (status === 'M') {
            return git_model_1.GitFileStatus.Modified;
        } // modified
        if (status === 'A') {
            return git_model_1.GitFileStatus.New;
        } // added
        if (status === 'D') {
            return git_model_1.GitFileStatus.Deleted;
        } // deleted
        if (status === 'R') {
            return git_model_1.GitFileStatus.Renamed;
        } // renamed
        if (status === 'C') {
            return git_model_1.GitFileStatus.Copied;
        } // copied
        // git log -M --name-status will return a RXXX - where XXX is a percentage
        if (status.match(/R[0-9]+/)) {
            return git_model_1.GitFileStatus.Renamed;
        }
        // git log -C --name-status will return a CXXX - where XXX is a percentage
        if (status.match(/C[0-9]+/)) {
            return git_model_1.GitFileStatus.Copied;
        }
        return git_model_1.GitFileStatus.Modified;
    }
    GitUtils.mapStatus = mapStatus;
    /**
     * `true` if the argument is a raw Git status with similarity percentage. Otherwise, `false`.
     */
    function isSimilarityStatus(rawStatus) {
        return !!rawStatus.match(/R[0-9][0-9][0-9]/) || !!rawStatus.match(/C[0-9][0-9][0-9]/);
    }
    GitUtils.isSimilarityStatus = isSimilarityStatus;
})(GitUtils = exports.GitUtils || (exports.GitUtils = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/common/git'] = this;


/***/ }),

/***/ "../../packages/git/lib/common/index.js":
/*!**********************************************!*\
  !*** ../../packages/git/lib/common/index.js ***!
  \**********************************************/
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./git */ "../../packages/git/lib/common/git.js"), exports);
__exportStar(__webpack_require__(/*! ./git-model */ "../../packages/git/lib/common/git-model.js"), exports);
__exportStar(__webpack_require__(/*! ./git-watcher */ "../../packages/git/lib/common/git-watcher.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/git/lib/common'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/diff.css":
/*!***********************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/diff.css ***!
  \***********************************************************************************************/
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

.theia-git.git-diff-container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.theia-git.git-diff-container .noWrapInfo {
  width: 100%;
}

.theia-git .listContainer {
  flex: 1;
  position: relative;
}

.theia-git .listContainer .commitList {
  height: 100%;
}

.theia-git .subject {
  font-size: var(--theia-ui-font-size2);
  font-weight: bold;
}

.theia-git .revision .row-title {
  width: 35px;
  display: inline-block;
}

.theia-git .diff-header {
  flex-shrink: 0;
}

.theia-git .header-row {
  display: flex;
  flex-direction: row;
}

.theia-git .header-row.diff-header,
.theia-git .header-row.diff-nav {
  margin-bottom: 10px;
}

.theia-git .header-value {
  margin: 9px 0px 5px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theia-git .diff-header .header-value {
  align-self: center;
  margin: 0px;
}

.theia-git .diff-header .theia-header {
  align-self: center;
  padding-right: 5px;
}

.theia-git .diff-header .subject {
  font-size: var(--theia-ui-font-size2);
  font-weight: bold;
}

.theia-git .commit-info {
  padding-left: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.theia-git .commit-info-row {
  align-items: center;
  margin-top: 10px;
}

.theia-git .commit-info .header-row {
  margin: 4px 0;
}

.theia-git .commit-info .header-row .theia-header {
  margin: 1px 0;
}

.theia-git .commit-info .header-row .header-value {
  margin: 0 0 0 5px;
}

.theia-git .commit-info-row .image-container {
  display: flex;
}
`, "",{"version":3,"sources":["webpack://./../../packages/git/src/browser/style/diff.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,aAAa;EACb,sBAAsB;EACtB,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,OAAO;EACP,kBAAkB;AACpB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,qCAAqC;EACrC,iBAAiB;AACnB;;AAEA;EACE,WAAW;EACX,qBAAqB;AACvB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;;EAEE,mBAAmB;AACrB;;AAEA;EACE,uBAAuB;EACvB,gBAAgB;EAChB,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,kBAAkB;EAClB,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,kBAAkB;AACpB;;AAEA;EACE,qCAAqC;EACrC,iBAAiB;AACnB;;AAEA;EACE,kBAAkB;EAClB,sBAAsB;EACtB,gBAAgB;AAClB;;AAEA;EACE,mBAAmB;EACnB,gBAAgB;AAClB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,aAAa;AACf","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-git.git-diff-container {\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  height: 100%;\n}\n\n.theia-git.git-diff-container .noWrapInfo {\n  width: 100%;\n}\n\n.theia-git .listContainer {\n  flex: 1;\n  position: relative;\n}\n\n.theia-git .listContainer .commitList {\n  height: 100%;\n}\n\n.theia-git .subject {\n  font-size: var(--theia-ui-font-size2);\n  font-weight: bold;\n}\n\n.theia-git .revision .row-title {\n  width: 35px;\n  display: inline-block;\n}\n\n.theia-git .diff-header {\n  flex-shrink: 0;\n}\n\n.theia-git .header-row {\n  display: flex;\n  flex-direction: row;\n}\n\n.theia-git .header-row.diff-header,\n.theia-git .header-row.diff-nav {\n  margin-bottom: 10px;\n}\n\n.theia-git .header-value {\n  margin: 9px 0px 5px 5px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.theia-git .diff-header .header-value {\n  align-self: center;\n  margin: 0px;\n}\n\n.theia-git .diff-header .theia-header {\n  align-self: center;\n  padding-right: 5px;\n}\n\n.theia-git .diff-header .subject {\n  font-size: var(--theia-ui-font-size2);\n  font-weight: bold;\n}\n\n.theia-git .commit-info {\n  padding-left: 10px;\n  box-sizing: border-box;\n  overflow: hidden;\n}\n\n.theia-git .commit-info-row {\n  align-items: center;\n  margin-top: 10px;\n}\n\n.theia-git .commit-info .header-row {\n  margin: 4px 0;\n}\n\n.theia-git .commit-info .header-row .theia-header {\n  margin: 1px 0;\n}\n\n.theia-git .commit-info .header-row .header-value {\n  margin: 0 0 0 5px;\n}\n\n.theia-git .commit-info-row .image-container {\n  display: flex;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/git-icons.css":
/*!****************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/git-icons.css ***!
  \****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/getUrl.js */ "../../node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! octicons/build/svg/git-commit.svg */ "../../node_modules/octicons/build/svg/git-commit.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
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

.icon-git-commit {
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  -webkit-mask-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
}
`, "",{"version":3,"sources":["webpack://./../../packages/git/src/browser/style/git-icons.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,sBAAsB;EACtB,qBAAqB;EACrB,8BAA8B;EAC9B,6BAA6B;EAC7B,mDAAqD;EACrD,2DAA6D;AAC/D","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.icon-git-commit {\n  mask-repeat: no-repeat;\n  mask-position: center;\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center;\n  mask-image: url(\"~octicons/build/svg/git-commit.svg\");\n  -webkit-mask-image: url(\"~octicons/build/svg/git-commit.svg\");\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/index.css":
/*!************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/index.css ***!
  \************************************************************************************************/
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

.theia-git {
  padding: 5px;
  box-sizing: border-box;
}

.theia-side-panel .theia-git {
  padding-left: 19px;
}

.theia-git .space-between {
  justify-content: space-between;
}

.theia-scm .scmItem .git-status.new {
  color: var(--theia-gitDecoration-untrackedResourceForeground);
}

.theia-scm .scmItem .git-status.new.staged {
  color: var(--theia-gitDecoration-addedResourceForeground);
}

.theia-scm .scmItem .git-status.modified {
  color: var(--theia-gitDecoration-modifiedResourceForeground);
}

.theia-scm .scmItem .git-status.deleted {
  color: var(--theia-gitDecoration-deletedResourceForeground);
}

.theia-scm .scmItem .git-status.renamed {
  color: var(--theia-gitDecoration-untrackedResourceForeground);
}

.theia-scm .scmItem .git-status.conflicted {
  color: var(--theia-gitDecoration-conflictingResourceForeground);
}

.theia-scm .scmItem .git-status.copied {
  color: var(--theia-gitDecoration-modifiedResourceForeground);
}
`, "",{"version":3,"sources":["webpack://./../../packages/git/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,YAAY;EACZ,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,8BAA8B;AAChC;;AAEA;EACE,6DAA6D;AAC/D;;AAEA;EACE,yDAAyD;AAC3D;;AAEA;EACE,4DAA4D;AAC9D;;AAEA;EACE,2DAA2D;AAC7D;;AAEA;EACE,6DAA6D;AAC/D;;AAEA;EACE,+DAA+D;AACjE;;AAEA;EACE,4DAA4D;AAC9D","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-git {\n  padding: 5px;\n  box-sizing: border-box;\n}\n\n.theia-side-panel .theia-git {\n  padding-left: 19px;\n}\n\n.theia-git .space-between {\n  justify-content: space-between;\n}\n\n.theia-scm .scmItem .git-status.new {\n  color: var(--theia-gitDecoration-untrackedResourceForeground);\n}\n\n.theia-scm .scmItem .git-status.new.staged {\n  color: var(--theia-gitDecoration-addedResourceForeground);\n}\n\n.theia-scm .scmItem .git-status.modified {\n  color: var(--theia-gitDecoration-modifiedResourceForeground);\n}\n\n.theia-scm .scmItem .git-status.deleted {\n  color: var(--theia-gitDecoration-deletedResourceForeground);\n}\n\n.theia-scm .scmItem .git-status.renamed {\n  color: var(--theia-gitDecoration-untrackedResourceForeground);\n}\n\n.theia-scm .scmItem .git-status.conflicted {\n  color: var(--theia-gitDecoration-conflictingResourceForeground);\n}\n\n.theia-scm .scmItem .git-status.copied {\n  color: var(--theia-gitDecoration-modifiedResourceForeground);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/git/src/browser/style/diff.css":
/*!*****************************************************!*\
  !*** ../../packages/git/src/browser/style/diff.css ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_diff_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./diff.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/diff.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_diff_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_diff_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/git/src/browser/style/git-icons.css":
/*!**********************************************************!*\
  !*** ../../packages/git/src/browser/style/git-icons.css ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_git_icons_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./git-icons.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/git-icons.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_git_icons_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_git_icons_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/git/src/browser/style/index.css":
/*!******************************************************!*\
  !*** ../../packages/git/src/browser/style/index.css ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/git/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../node_modules/octicons/build/svg/git-commit.svg":
/*!************************************************************!*\
  !*** ../../node_modules/octicons/build/svg/git-commit.svg ***!
  \************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE0IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC44NiA3Yy0uNDUtMS43Mi0yLTMtMy44Ni0zLTEuODYgMC0zLjQxIDEuMjgtMy44NiAzSDB2MmgzLjE0Yy40NSAxLjcyIDIgMyAzLjg2IDMgMS44NiAwIDMuNDEtMS4yOCAzLjg2LTNIMTRWN2gtMy4xNHpNNyAxMC4yYy0xLjIyIDAtMi4yLS45OC0yLjItMi4yIDAtMS4yMi45OC0yLjIgMi4yLTIuMiAxLjIyIDAgMi4yLjk4IDIuMiAyLjIgMCAxLjIyLS45OCAyLjItMi4yIDIuMnoiLz48L3N2Zz4=";

/***/ })

}]);
//# sourceMappingURL=packages_git_lib_browser_git-frontend-module_js.js.map