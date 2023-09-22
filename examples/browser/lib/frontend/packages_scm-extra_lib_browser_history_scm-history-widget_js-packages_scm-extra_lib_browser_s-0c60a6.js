(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_scm-extra_lib_browser_history_scm-history-widget_js-packages_scm-extra_lib_browser_s-0c60a6"],{

/***/ "../../packages/core/shared/@phosphor/domutils/index.js":
/*!**************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/domutils/index.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/domutils */ "../../node_modules/@phosphor/domutils/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/domutils'] = this;


/***/ }),

/***/ "../../packages/core/shared/react-virtuoso/index.js":
/*!**********************************************************!*\
  !*** ../../packages/core/shared/react-virtuoso/index.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react-virtuoso */ "../../node_modules/react-virtuoso/dist/index.m.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react-virtuoso'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/history/scm-history-constants.js":
/*!*****************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/history/scm-history-constants.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.ScmCommitNode = exports.ScmHistorySupport = exports.ScmHistoryCommands = exports.SCM_HISTORY_MAX_COUNT = exports.SCM_HISTORY_TOGGLE_KEYBINDING = exports.SCM_HISTORY_LABEL = exports.SCM_HISTORY_ID = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
exports.SCM_HISTORY_ID = 'scm-history';
exports.SCM_HISTORY_LABEL = core_1.nls.localize('theia/scm/history', 'History');
exports.SCM_HISTORY_TOGGLE_KEYBINDING = 'alt+h';
exports.SCM_HISTORY_MAX_COUNT = 100;
var ScmHistoryCommands;
(function (ScmHistoryCommands) {
    ScmHistoryCommands.OPEN_FILE_HISTORY = {
        id: 'scm-history:open-file-history',
    };
    ScmHistoryCommands.OPEN_BRANCH_HISTORY = {
        id: 'scm-history:open-branch-history',
        label: exports.SCM_HISTORY_LABEL
    };
})(ScmHistoryCommands = exports.ScmHistoryCommands || (exports.ScmHistoryCommands = {}));
exports.ScmHistorySupport = Symbol('scm-history-support');
var ScmCommitNode;
(function (ScmCommitNode) {
    function is(node) {
        return !!node && typeof node === 'object' && 'commitDetails' in node && 'expanded' in node && 'selected' in node;
    }
    ScmCommitNode.is = is;
})(ScmCommitNode = exports.ScmCommitNode || (exports.ScmCommitNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/history/scm-history-constants'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/history/scm-history-provider.js":
/*!****************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/history/scm-history-provider.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

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
exports.ScmHistoryProvider = void 0;
var ScmHistoryProvider;
(function (ScmHistoryProvider) {
    function is(scmProvider) {
        return !!scmProvider && 'historySupport' in scmProvider;
    }
    ScmHistoryProvider.is = is;
})(ScmHistoryProvider = exports.ScmHistoryProvider || (exports.ScmHistoryProvider = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/history/scm-history-provider'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/history/scm-history-widget.js":
/*!**************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/history/scm-history-widget.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmHistoryList = exports.ScmHistoryWidget = exports.ScmHistorySupport = exports.ScmCommitNode = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const react_virtuoso_1 = __webpack_require__(/*! @theia/core/shared/react-virtuoso */ "../../packages/core/shared/react-virtuoso/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const scm_file_change_node_1 = __webpack_require__(/*! ../scm-file-change-node */ "../../packages/scm-extra/lib/browser/scm-file-change-node.js");
const scm_avatar_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-avatar-service */ "../../packages/scm/lib/browser/scm-avatar-service.js");
const scm_navigable_list_widget_1 = __webpack_require__(/*! ../scm-navigable-list-widget */ "../../packages/scm-extra/lib/browser/scm-navigable-list-widget.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const alert_message_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/alert-message */ "../../packages/core/lib/browser/widgets/alert-message.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const scm_history_provider_1 = __webpack_require__(/*! ./scm-history-provider */ "../../packages/scm-extra/lib/browser/history/scm-history-provider.js");
const throttle = __webpack_require__(/*! @theia/core/shared/lodash.throttle */ "../../packages/core/shared/lodash.throttle/index.js");
const scm_history_constants_1 = __webpack_require__(/*! ./scm-history-constants */ "../../packages/scm-extra/lib/browser/history/scm-history-constants.js");
Object.defineProperty(exports, "ScmCommitNode", ({ enumerable: true, get: function () { return scm_history_constants_1.ScmCommitNode; } }));
Object.defineProperty(exports, "ScmHistorySupport", ({ enumerable: true, get: function () { return scm_history_constants_1.ScmHistorySupport; } }));
let ScmHistoryWidget = class ScmHistoryWidget extends scm_navigable_list_widget_1.ScmNavigableListWidget {
    constructor(openerService, shell, fileService, avatarService, widgetManager) {
        super();
        this.openerService = openerService;
        this.shell = shell;
        this.fileService = fileService;
        this.avatarService = avatarService;
        this.widgetManager = widgetManager;
        this.toDisposeOnRepositoryChange = new core_1.DisposableCollection();
        this.toDisposeOnRefresh = new core_1.DisposableCollection();
        this.setContent = throttle((options) => this.doSetContent(options), 100);
        this.loadMoreRows = (index) => this.doLoadMoreRows(index);
        this.renderCommit = (commit) => this.doRenderCommit(commit);
        this.renderFileChangeList = (fileChange) => this.doRenderFileChangeList(fileChange);
        this.id = scm_history_constants_1.SCM_HISTORY_ID;
        this.scrollContainer = 'scm-history-list-container';
        this.title.label = scm_history_constants_1.SCM_HISTORY_LABEL;
        this.title.caption = scm_history_constants_1.SCM_HISTORY_LABEL;
        this.title.iconClass = (0, browser_1.codicon)('history');
        this.title.closable = true;
        this.addClass('theia-scm');
        this.addClass('theia-scm-history');
        this.status = { state: 'loading' };
        this.resetState();
        this.cancelIndicator = new cancellation_1.CancellationTokenSource();
    }
    init() {
        this.refreshOnRepositoryChange();
        this.toDispose.push(this.scmService.onDidChangeSelectedRepository(() => this.refreshOnRepositoryChange()));
        this.toDispose.push(this.labelProvider.onDidChange(event => {
            if (this.scmNodes.some(node => scm_file_change_node_1.ScmFileChangeNode.is(node) && event.affects(new uri_1.default(node.fileChange.uri)))) {
                this.update();
            }
        }));
    }
    refreshOnRepositoryChange() {
        this.toDisposeOnRepositoryChange.dispose();
        const repository = this.scmService.selectedRepository;
        if (repository && scm_history_provider_1.ScmHistoryProvider.is(repository.provider)) {
            this.historySupport = repository.provider.historySupport;
            if (this.historySupport) {
                this.toDisposeOnRepositoryChange.push(this.historySupport.onDidChangeHistory(() => this.setContent(this.options)));
            }
        }
        else {
            this.historySupport = undefined;
        }
        this.setContent(this.options);
        // If switching repository, discard options because they are specific to a repository
        this.options = this.createHistoryOptions();
        this.refresh();
    }
    createHistoryOptions() {
        return {
            maxCount: scm_history_constants_1.SCM_HISTORY_MAX_COUNT
        };
    }
    refresh() {
        this.toDisposeOnRefresh.dispose();
        this.toDispose.push(this.toDisposeOnRefresh);
        const repository = this.scmService.selectedRepository;
        this.title.label = scm_history_constants_1.SCM_HISTORY_LABEL;
        if (repository) {
            this.title.label += ': ' + repository.provider.label;
        }
        const area = this.shell.getAreaFor(this);
        if (area === 'left') {
            this.shell.leftPanelHandler.refresh();
        }
        else if (area === 'right') {
            this.shell.rightPanelHandler.refresh();
        }
        this.update();
        if (repository) {
            this.toDisposeOnRefresh.push(repository.onDidChange(() => this.update()));
            // render synchronously to avoid cursor jumping
            // see https://stackoverflow.com/questions/28922275/in-reactjs-why-does-setstate-behave-differently-when-called-synchronously/28922465#28922465
            this.toDisposeOnRefresh.push(repository.input.onDidChange(() => this.setContent(this.options)));
        }
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.addListNavigationKeyListeners(this.node);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.addEventListener(this.node, 'ps-scroll-y', (e) => {
            var _a;
            if ((_a = this.listView) === null || _a === void 0 ? void 0 : _a.list) {
                const { scrollTop } = e.target;
                this.listView.list.scrollTo({
                    top: scrollTop
                });
            }
        });
    }
    async doSetContent(options) {
        this.resetState(options);
        if (options && options.uri) {
            try {
                const fileStat = await this.fileService.resolve(new uri_1.default(options.uri));
                this.singleFileMode = !fileStat.isDirectory;
            }
            catch {
                this.singleFileMode = true;
            }
        }
        await this.addCommits(options);
        this.onDataReady();
        if (this.scmNodes.length > 0) {
            this.selectNode(this.scmNodes[0]);
        }
    }
    resetState(options) {
        this.options = options || this.createHistoryOptions();
        this.hasMoreCommits = true;
        this.allowScrollToSelected = true;
    }
    async addCommits(options) {
        const repository = this.scmService.selectedRepository;
        this.cancelIndicator.cancel();
        this.cancelIndicator = new cancellation_1.CancellationTokenSource();
        const token = this.cancelIndicator.token;
        if (repository) {
            if (this.historySupport) {
                try {
                    const history = await this.historySupport.getCommitHistory(options);
                    if (token.isCancellationRequested || !this.hasMoreCommits) {
                        return;
                    }
                    if (options && (options.maxCount && history.length < options.maxCount)) {
                        this.hasMoreCommits = false;
                    }
                    const avatarCache = new Map();
                    const commits = [];
                    for (const commit of history) {
                        const fileChangeNodes = [];
                        await Promise.all(commit.fileChanges.map(async (fileChange) => {
                            fileChangeNodes.push({
                                fileChange, commitId: commit.id
                            });
                        }));
                        let avatarUrl = '';
                        if (avatarCache.has(commit.authorEmail)) {
                            avatarUrl = avatarCache.get(commit.authorEmail);
                        }
                        else {
                            avatarUrl = await this.avatarService.getAvatar(commit.authorEmail);
                            avatarCache.set(commit.authorEmail, avatarUrl);
                        }
                        commits.push({
                            commitDetails: commit,
                            authorAvatar: avatarUrl,
                            fileChangeNodes,
                            expanded: false,
                            selected: false
                        });
                    }
                    this.status = { state: 'ready', commits };
                }
                catch (error) {
                    if (options && options.uri && repository) {
                        this.hasMoreCommits = false;
                    }
                    this.status = { state: 'error', errorMessage: React.createElement(React.Fragment, null,
                            " ",
                            error.message,
                            " ") };
                }
            }
            else {
                this.status = { state: 'error', errorMessage: React.createElement(React.Fragment, null,
                        "History is not supported for ",
                        repository.provider.label,
                        " source control.") };
            }
        }
        else {
            this.status = {
                state: 'error',
                errorMessage: React.createElement(React.Fragment, null, nls_1.nls.localizeByDefault('No source control providers registered.'))
            };
        }
    }
    async addOrRemoveFileChangeNodes(commit) {
        const id = this.scmNodes.findIndex(node => node === commit);
        if (commit.expanded) {
            this.removeFileChangeNodes(commit, id);
        }
        else {
            await this.addFileChangeNodes(commit, id);
        }
        commit.expanded = !commit.expanded;
        this.update();
    }
    async addFileChangeNodes(commit, scmNodesArrayIndex) {
        if (commit.fileChangeNodes) {
            this.scmNodes.splice(scmNodesArrayIndex + 1, 0, ...commit.fileChangeNodes.map(node => Object.assign(node, { commitSha: commit.commitDetails.id })));
        }
    }
    removeFileChangeNodes(commit, scmNodesArrayIndex) {
        if (commit.fileChangeNodes) {
            this.scmNodes.splice(scmNodesArrayIndex + 1, commit.fileChangeNodes.length);
        }
    }
    storeState() {
        const { options, singleFileMode } = this;
        return {
            options,
            singleFileMode
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    restoreState(oldState) {
        this.options = oldState['options'];
        this.options.maxCount = scm_history_constants_1.SCM_HISTORY_MAX_COUNT;
        this.singleFileMode = oldState['singleFileMode'];
        this.setContent(this.options);
    }
    onDataReady() {
        if (this.status.state === 'ready') {
            this.scmNodes = this.status.commits;
        }
        this.update();
    }
    render() {
        let content;
        switch (this.status.state) {
            case 'ready':
                content = React.createElement(React.Fragment, null,
                    this.renderHistoryHeader(),
                    this.renderCommitList());
                break;
            case 'error':
                const reason = this.status.errorMessage;
                let path = '';
                if (this.options.uri) {
                    const relPathEncoded = this.scmLabelProvider.relativePath(this.options.uri);
                    const relPath = relPathEncoded ? `${decodeURIComponent(relPathEncoded)}` : '';
                    const repo = this.scmService.findRepository(new uri_1.default(this.options.uri));
                    const repoName = repo ? `${this.labelProvider.getName(new uri_1.default(repo.provider.rootUri))}` : '';
                    const relPathAndRepo = [relPath, repoName].filter(Boolean).join(` ${nls_1.nls.localize('theia/git/prepositionIn', 'in')} `);
                    path = `${relPathAndRepo}`;
                }
                content = React.createElement(alert_message_1.AlertMessage, { type: 'WARNING', header: nls_1.nls.localize('theia/git/noHistoryForError', 'There is no history available for {0}', `${path}`) }, reason);
                break;
            case 'loading':
                content = React.createElement("div", { className: 'spinnerContainer' },
                    React.createElement("span", { className: `${(0, browser_1.codicon)('loading')} theia-animation-spin large-spinner` }));
                break;
        }
        return React.createElement("div", { className: 'history-container' }, content);
    }
    renderHistoryHeader() {
        if (this.options.uri) {
            const path = this.scmLabelProvider.relativePath(this.options.uri);
            const fileName = path.split('/').pop();
            return React.createElement("div", { className: 'diff-header' },
                this.renderHeaderRow({ name: 'repository', value: this.getRepositoryLabel(this.options.uri) }),
                this.renderHeaderRow({ name: 'file', value: fileName, title: path }),
                React.createElement("div", { className: 'theia-header' }, "Commits"));
        }
    }
    renderCommitList() {
        const list = React.createElement("div", { className: 'listContainer', id: this.scrollContainer },
            React.createElement(ScmHistoryList, { ref: listView => this.listView = (listView || undefined), rows: this.scmNodes, hasMoreRows: this.hasMoreCommits, loadMoreRows: this.loadMoreRows, renderCommit: this.renderCommit, renderFileChangeList: this.renderFileChangeList }));
        this.allowScrollToSelected = true;
        return list;
    }
    doLoadMoreRows(index) {
        let resolver;
        const promise = new Promise(resolve => resolver = resolve);
        const lastRow = this.scmNodes[index - 1];
        if (scm_history_constants_1.ScmCommitNode.is(lastRow)) {
            const toRevision = lastRow.commitDetails.id;
            this.addCommits({
                range: { toRevision },
                maxCount: scm_history_constants_1.SCM_HISTORY_MAX_COUNT,
                uri: this.options.uri
            }).then(() => {
                this.allowScrollToSelected = false;
                this.onDataReady();
                resolver();
            });
        }
        return promise;
    }
    doRenderCommit(commit) {
        let expansionToggleIcon = (0, browser_1.codicon)('chevron-right');
        if (commit && commit.expanded) {
            expansionToggleIcon = (0, browser_1.codicon)('chevron-down');
        }
        return React.createElement("div", { className: `containerHead${commit.selected ? ' ' + browser_1.SELECTED_CLASS : ''}`, onClick: e => {
                if (commit.selected && !this.singleFileMode) {
                    this.addOrRemoveFileChangeNodes(commit);
                }
                else {
                    this.selectNode(commit);
                }
                e.preventDefault();
            }, onDoubleClick: e => {
                if (this.singleFileMode && commit.fileChangeNodes.length > 0) {
                    this.openFile(commit.fileChangeNodes[0].fileChange);
                }
                e.preventDefault();
            } },
            React.createElement("div", { className: 'headContent' },
                React.createElement("div", { className: 'image-container' },
                    React.createElement("img", { className: 'gravatar', src: commit.authorAvatar })),
                React.createElement("div", { className: `headLabelContainer${this.singleFileMode ? ' singleFileMode' : ''}` },
                    React.createElement("div", { className: 'headLabel noWrapInfo noselect' }, commit.commitDetails.summary),
                    React.createElement("div", { className: 'commitTime noWrapInfo noselect' }, commit.commitDetails.authorDateRelative + ' by ' + commit.commitDetails.authorName)),
                React.createElement("div", { className: `${(0, browser_1.codicon)('eye')} detailButton`, onClick: () => this.openDetailWidget(commit) }),
                !this.singleFileMode && React.createElement("div", { className: 'expansionToggle noselect' },
                    React.createElement("div", { className: 'toggle' },
                        React.createElement("div", { className: 'number' }, commit.commitDetails.fileChanges.length.toString()),
                        React.createElement("div", { className: 'icon ' + expansionToggleIcon })))));
    }
    async openDetailWidget(commitNode) {
        const options = {
            ...commitNode.commitDetails.commitDetailOptions,
            mode: 'reveal'
        };
        (0, browser_1.open)(this.openerService, commitNode.commitDetails.commitDetailUri, options);
    }
    doRenderFileChangeList(fileChange) {
        const fileChangeElement = this.renderScmItem(fileChange, fileChange.commitId);
        return fileChangeElement;
    }
    renderScmItem(change, commitSha) {
        return React.createElement(scm_navigable_list_widget_1.ScmItemComponent, { key: change.fileChange.uri.toString(), ...{
                labelProvider: this.labelProvider,
                scmLabelProvider: this.scmLabelProvider,
                change,
                revealChange: () => this.openFile(change.fileChange),
                selectNode: () => this.selectNode(change)
            } });
    }
    navigateLeft() {
        const selected = this.getSelected();
        if (selected && this.status.state === 'ready') {
            if (scm_history_constants_1.ScmCommitNode.is(selected)) {
                const idx = this.status.commits.findIndex(c => c.commitDetails.id === selected.commitDetails.id);
                if (selected.expanded) {
                    this.addOrRemoveFileChangeNodes(selected);
                }
                else {
                    if (idx > 0) {
                        this.selectNode(this.status.commits[idx - 1]);
                    }
                }
            }
            else if (scm_file_change_node_1.ScmFileChangeNode.is(selected)) {
                const idx = this.status.commits.findIndex(c => c.commitDetails.id === selected.commitId);
                this.selectNode(this.status.commits[idx]);
            }
        }
        this.update();
    }
    navigateRight() {
        const selected = this.getSelected();
        if (selected) {
            if (scm_history_constants_1.ScmCommitNode.is(selected) && !selected.expanded && !this.singleFileMode) {
                this.addOrRemoveFileChangeNodes(selected);
            }
            else {
                this.selectNextNode();
            }
        }
        this.update();
    }
    handleListEnter() {
        const selected = this.getSelected();
        if (selected) {
            if (scm_history_constants_1.ScmCommitNode.is(selected)) {
                if (this.singleFileMode) {
                    this.openFile(selected.fileChangeNodes[0].fileChange);
                }
                else {
                    this.openDetailWidget(selected);
                }
            }
            else if (scm_file_change_node_1.ScmFileChangeNode.is(selected)) {
                this.openFile(selected.fileChange);
            }
        }
        this.update();
    }
    openFile(change) {
        const uriToOpen = change.getUriToOpen();
        (0, browser_1.open)(this.openerService, uriToOpen, { mode: 'reveal' });
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmHistoryWidget.prototype, "init", null);
ScmHistoryWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.OpenerService)),
    __param(1, (0, inversify_1.inject)(browser_1.ApplicationShell)),
    __param(2, (0, inversify_1.inject)(file_service_1.FileService)),
    __param(3, (0, inversify_1.inject)(scm_avatar_service_1.ScmAvatarService)),
    __param(4, (0, inversify_1.inject)(browser_1.WidgetManager)),
    __metadata("design:paramtypes", [Object, browser_1.ApplicationShell,
        file_service_1.FileService,
        scm_avatar_service_1.ScmAvatarService,
        browser_1.WidgetManager])
], ScmHistoryWidget);
exports.ScmHistoryWidget = ScmHistoryWidget;
class ScmHistoryList extends React.Component {
    constructor() {
        super(...arguments);
        this.checkIfRowIsLoaded = (opts) => this.doCheckIfRowIsLoaded(opts);
    }
    doCheckIfRowIsLoaded(opts) {
        const row = this.props.rows[opts.index];
        return !!row;
    }
    render() {
        const { hasMoreRows, loadMoreRows, rows } = this.props;
        return React.createElement(react_virtuoso_1.Virtuoso, { ref: list => this.list = (list || undefined), data: rows, itemContent: index => this.renderRow(index), endReached: hasMoreRows ? loadMoreRows : undefined, overscan: 500, style: {
                overflowX: 'hidden'
            } });
    }
    renderRow(index) {
        if (this.checkIfRowIsLoaded({ index })) {
            const row = this.props.rows[index];
            if (scm_history_constants_1.ScmCommitNode.is(row)) {
                const head = this.props.renderCommit(row);
                return React.createElement("div", { className: `commitListElement${index === 0 ? ' first' : ''}` }, head);
            }
            else if (scm_file_change_node_1.ScmFileChangeNode.is(row)) {
                return React.createElement("div", { className: 'fileChangeListElement' }, this.props.renderFileChangeList(row));
            }
        }
        else {
            return React.createElement("div", { className: `commitListElement${index === 0 ? ' first' : ''}` },
                React.createElement("span", { className: `${(0, browser_1.codicon)('loading')} theia-animation-spin` }));
        }
    }
    ;
}
exports.ScmHistoryList = ScmHistoryList;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/history/scm-history-widget'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/scm-extra-contribution.js":
/*!**********************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/scm-extra-contribution.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EDITOR_CONTEXT_MENU_SCM = void 0;
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
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
exports.EDITOR_CONTEXT_MENU_SCM = [...browser_1.EDITOR_CONTEXT_MENU, '3_scm'];

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/scm-extra-contribution'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/scm-file-change-label-provider.js":
/*!******************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/scm-file-change-label-provider.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmFileChangeLabelProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const scm_file_change_node_1 = __webpack_require__(/*! ./scm-file-change-node */ "../../packages/scm-extra/lib/browser/scm-file-change-node.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
let ScmFileChangeLabelProvider = class ScmFileChangeLabelProvider {
    canHandle(element) {
        return scm_file_change_node_1.ScmFileChangeNode.is(element) ? 100 : 0;
    }
    getIcon(node) {
        return this.labelProvider.getIcon(new uri_1.default(node.fileChange.uri));
    }
    getName(node) {
        return this.labelProvider.getName(new uri_1.default(node.fileChange.uri));
    }
    getDescription(node) {
        return this.relativePath(new uri_1.default(node.fileChange.uri).parent);
    }
    affects(node, event) {
        return event.affects(new uri_1.default(node.fileChange.uri));
    }
    getCaption(node) {
        return node.fileChange.getCaption();
    }
    relativePath(uri) {
        const parsedUri = typeof uri === 'string' ? new uri_1.default(uri) : uri;
        const repo = this.scmService.findRepository(parsedUri);
        if (repo) {
            const repositoryUri = new uri_1.default(repo.provider.rootUri);
            const relativePath = repositoryUri.relative(parsedUri);
            if (relativePath) {
                return relativePath.toString();
            }
        }
        return this.labelProvider.getLongName(parsedUri);
    }
    getStatusCaption(node) {
        return node.fileChange.getStatusCaption();
    }
};
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], ScmFileChangeLabelProvider.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmFileChangeLabelProvider.prototype, "scmService", void 0);
ScmFileChangeLabelProvider = __decorate([
    (0, inversify_1.injectable)()
], ScmFileChangeLabelProvider);
exports.ScmFileChangeLabelProvider = ScmFileChangeLabelProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/scm-file-change-label-provider'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/scm-file-change-node.js":
/*!********************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/scm-file-change-node.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmFileChangeNode = void 0;
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
var ScmFileChangeNode;
(function (ScmFileChangeNode) {
    function is(node) {
        return (0, common_1.isObject)(node) && 'fileChange' in node && 'commitId' in node;
    }
    ScmFileChangeNode.is = is;
})(ScmFileChangeNode = exports.ScmFileChangeNode || (exports.ScmFileChangeNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/scm-file-change-node'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/scm-navigable-list-widget.js":
/*!*************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/scm-navigable-list-widget.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmItemComponent = exports.ScmNavigableListWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const domutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/domutils */ "../../packages/core/shared/@phosphor/domutils/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const react_widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/react-widget */ "../../packages/core/lib/browser/widgets/react-widget.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const scm_file_change_label_provider_1 = __webpack_require__(/*! ./scm-file-change-label-provider */ "../../packages/scm-extra/lib/browser/scm-file-change-label-provider.js");
let ScmNavigableListWidget = class ScmNavigableListWidget extends react_widget_1.ReactWidget {
    constructor() {
        super();
        this.scmNodes = [];
        this.node.tabIndex = 0;
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.update();
        this.node.focus();
    }
    set scrollContainer(id) {
        this._scrollContainer = id + Date.now();
    }
    get scrollContainer() {
        return this._scrollContainer;
    }
    onUpdateRequest(msg) {
        if (!this.isAttached || !this.isVisible) {
            return;
        }
        super.onUpdateRequest(msg);
        (async () => {
            const selected = this.node.getElementsByClassName(browser_1.SELECTED_CLASS)[0];
            if (selected) {
                const container = document.getElementById(this.scrollContainer);
                if (container) {
                    domutils_1.ElementExt.scrollIntoViewIfNeeded(container, selected);
                }
            }
        })();
    }
    onResize(msg) {
        super.onResize(msg);
        this.update();
    }
    getRepositoryLabel(uri) {
        const repository = this.scmService.findRepository(new uri_1.default(uri));
        const isSelectedRepo = this.scmService.selectedRepository && repository && this.scmService.selectedRepository.provider.rootUri === repository.provider.rootUri;
        return repository && !isSelectedRepo ? this.labelProvider.getLongName(new uri_1.default(repository.provider.rootUri)) : undefined;
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
    addListNavigationKeyListeners(container) {
        this.addKeyListener(container, browser_1.Key.ARROW_LEFT, () => this.navigateLeft());
        this.addKeyListener(container, browser_1.Key.ARROW_RIGHT, () => this.navigateRight());
        this.addKeyListener(container, browser_1.Key.ARROW_UP, () => this.navigateUp());
        this.addKeyListener(container, browser_1.Key.ARROW_DOWN, () => this.navigateDown());
        this.addKeyListener(container, browser_1.Key.ENTER, () => this.handleListEnter());
    }
    navigateLeft() {
        this.selectPreviousNode();
    }
    navigateRight() {
        this.selectNextNode();
    }
    navigateUp() {
        this.selectPreviousNode();
    }
    navigateDown() {
        this.selectNextNode();
    }
    handleListEnter() {
    }
    getSelected() {
        return this.scmNodes ? this.scmNodes.find(c => c.selected || false) : undefined;
    }
    selectNode(node) {
        const n = this.getSelected();
        if (n) {
            n.selected = false;
        }
        node.selected = true;
        this.update();
    }
    selectNextNode() {
        const idx = this.indexOfSelected;
        if (idx >= 0 && idx < this.scmNodes.length - 1) {
            this.selectNode(this.scmNodes[idx + 1]);
        }
        else if (this.scmNodes.length > 0 && idx === -1) {
            this.selectNode(this.scmNodes[0]);
        }
    }
    selectPreviousNode() {
        const idx = this.indexOfSelected;
        if (idx > 0) {
            this.selectNode(this.scmNodes[idx - 1]);
        }
    }
    get indexOfSelected() {
        if (this.scmNodes && this.scmNodes.length > 0) {
            return this.scmNodes.findIndex(c => c.selected || false);
        }
        return -1;
    }
};
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmNavigableListWidget.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], ScmNavigableListWidget.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(scm_file_change_label_provider_1.ScmFileChangeLabelProvider),
    __metadata("design:type", scm_file_change_label_provider_1.ScmFileChangeLabelProvider)
], ScmNavigableListWidget.prototype, "scmLabelProvider", void 0);
ScmNavigableListWidget = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ScmNavigableListWidget);
exports.ScmNavigableListWidget = ScmNavigableListWidget;
class ScmItemComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.revealChange = () => this.props.revealChange(this.props.change);
        this.selectNode = () => this.props.selectNode(this.props.change);
    }
    render() {
        const { labelProvider, scmLabelProvider, change } = this.props;
        const icon = labelProvider.getIcon(change);
        const label = labelProvider.getName(change);
        const description = labelProvider.getLongName(change);
        const caption = scmLabelProvider.getCaption(change);
        const statusCaption = scmLabelProvider.getStatusCaption(change);
        return React.createElement("div", { className: `scmItem noselect${change.selected ? ' ' + browser_1.SELECTED_CLASS : ''}`, onDoubleClick: this.revealChange, onClick: this.selectNode },
            React.createElement("span", { className: icon + ' file-icon' }),
            React.createElement("div", { className: 'noWrapInfo', title: caption },
                React.createElement("span", { className: 'name' }, label + ' '),
                React.createElement("span", { className: 'path' }, description)),
            React.createElement("div", { title: caption, className: change.fileChange.getClassNameForStatus() }, statusCaption.charAt(0)));
    }
}
exports.ScmItemComponent = ScmItemComponent;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/scm-navigable-list-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_scm-extra_lib_browser_history_scm-history-widget_js-packages_scm-extra_lib_browser_s-0c60a6.js.map