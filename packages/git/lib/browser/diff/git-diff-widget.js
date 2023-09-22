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
exports.GitDiffWidget = exports.GIT_DIFF = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const git_diff_tree_model_1 = require("./git-diff-tree-model");
const common_1 = require("../../common");
const git_diff_header_widget_1 = require("./git-diff-header-widget");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const git_repository_provider_1 = require("../git-repository-provider");
const scm_tree_widget_1 = require("@theia/scm/lib/browser/scm-tree-widget");
const scm_preferences_1 = require("@theia/scm/lib/browser/scm-preferences");
const core_1 = require("@theia/core");
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
//# sourceMappingURL=git-diff-widget.js.map