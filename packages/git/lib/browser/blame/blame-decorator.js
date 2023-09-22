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
var BlameDecorator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppliedBlameDecorations = exports.BlameDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/editor/lib/browser");
const core_1 = require("@theia/core");
const luxon_1 = require("luxon");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_2 = require("@theia/core/lib/browser");
const monaco = require("@theia/monaco-editor-core");
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
//# sourceMappingURL=blame-decorator.js.map