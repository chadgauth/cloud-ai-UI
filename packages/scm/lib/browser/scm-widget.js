"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScmWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const disposable_1 = require("@theia/core/lib/common/disposable");
const browser_1 = require("@theia/core/lib/browser");
const scm_commit_widget_1 = require("./scm-commit-widget");
const scm_amend_widget_1 = require("./scm-amend-widget");
const scm_no_repository_widget_1 = require("./scm-no-repository-widget");
const scm_service_1 = require("./scm-service");
const scm_tree_widget_1 = require("./scm-tree-widget");
const scm_preferences_1 = require("./scm-preferences");
const nls_1 = require("@theia/core/lib/common/nls");
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
//# sourceMappingURL=scm-widget.js.map