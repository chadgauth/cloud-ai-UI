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
exports.BlameManager = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("../../common");
const git_repository_tracker_1 = require("../git-repository-tracker");
const uri_1 = require("@theia/core/lib/common/uri");
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
//# sourceMappingURL=blame-manager.js.map