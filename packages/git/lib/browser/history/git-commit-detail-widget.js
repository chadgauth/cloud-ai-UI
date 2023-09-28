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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitCommitDetailWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const git_commit_detail_widget_options_1 = require("./git-commit-detail-widget-options");
const git_commit_detail_header_widget_1 = require("./git-commit-detail-header-widget");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const git_diff_tree_model_1 = require("../diff/git-diff-tree-model");
const scm_tree_widget_1 = require("@theia/scm/lib/browser/scm-tree-widget");
const scm_preferences_1 = require("@theia/scm/lib/browser/scm-preferences");
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
//# sourceMappingURL=git-commit-detail-widget.js.map