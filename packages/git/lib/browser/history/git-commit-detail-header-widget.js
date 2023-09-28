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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitCommitDetailHeaderWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const scm_avatar_service_1 = require("@theia/scm/lib/browser/scm-avatar-service");
const git_commit_detail_widget_options_1 = require("./git-commit-detail-widget-options");
const browser_1 = require("@theia/core/lib/browser");
const React = require("@theia/core/shared/react");
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
//# sourceMappingURL=git-commit-detail-header-widget.js.map