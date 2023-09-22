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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScmGroupsTreeModel = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const disposable_1 = require("@theia/core/lib/common/disposable");
const scm_service_1 = require("./scm-service");
const scm_tree_model_1 = require("./scm-tree-model");
let ScmGroupsTreeModel = class ScmGroupsTreeModel extends scm_tree_model_1.ScmTreeModel {
    constructor() {
        super(...arguments);
        this.toDisposeOnRepositoryChange = new disposable_1.DisposableCollection();
    }
    init() {
        super.init();
        this.refreshOnRepositoryChange();
        this.toDispose.push(this.scmService.onDidChangeSelectedRepository(() => {
            this.refreshOnRepositoryChange();
        }));
    }
    refreshOnRepositoryChange() {
        const repository = this.scmService.selectedRepository;
        if (repository) {
            this.changeRepository(repository.provider);
        }
        else {
            this.changeRepository(undefined);
        }
    }
    changeRepository(provider) {
        this.toDisposeOnRepositoryChange.dispose();
        this.contextKeys.scmProvider.set(provider ? provider.id : undefined);
        this.provider = provider;
        if (provider) {
            this.toDisposeOnRepositoryChange.push(provider.onDidChange(() => this.root = this.createTree()));
            if (provider.onDidChangeResources) {
                this.toDisposeOnRepositoryChange.push(provider.onDidChangeResources(() => this.root = this.createTree()));
            }
            this.root = this.createTree();
        }
    }
    get rootUri() {
        if (this.provider) {
            return this.provider.rootUri;
        }
    }
    ;
    get groups() {
        if (this.provider) {
            return this.provider.groups;
        }
        else {
            return [];
        }
    }
    ;
    canTabToWidget() {
        return !!this.provider;
    }
};
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmGroupsTreeModel.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmGroupsTreeModel.prototype, "init", null);
ScmGroupsTreeModel = __decorate([
    (0, inversify_1.injectable)()
], ScmGroupsTreeModel);
exports.ScmGroupsTreeModel = ScmGroupsTreeModel;
//# sourceMappingURL=scm-groups-tree-model.js.map