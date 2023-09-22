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
exports.GitDiffHeaderWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const scm_file_change_label_provider_1 = require("@theia/scm-extra/lib/browser/scm-file-change-label-provider");
const browser_1 = require("@theia/core/lib/browser");
const React = require("@theia/core/shared/react");
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
//# sourceMappingURL=git-diff-header-widget.js.map