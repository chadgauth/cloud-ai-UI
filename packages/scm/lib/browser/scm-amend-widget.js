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
var ScmAmendWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScmAmendWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const React = require("@theia/core/shared/react");
const browser_1 = require("@theia/core/lib/browser");
const scm_service_1 = require("./scm-service");
const scm_avatar_service_1 = require("./scm-avatar-service");
const scm_amend_component_1 = require("./scm-amend-component");
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
//# sourceMappingURL=scm-amend-widget.js.map