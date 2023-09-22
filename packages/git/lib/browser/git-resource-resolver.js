"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.GitResourceResolver = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("../common");
const uri_1 = require("@theia/core/lib/common/uri");
const git_repository_provider_1 = require("./git-repository-provider");
const git_resource_1 = require("./git-resource");
let GitResourceResolver = class GitResourceResolver {
    constructor(git, repositoryProvider) {
        this.git = git;
        this.repositoryProvider = repositoryProvider;
    }
    resolve(uri) {
        if (uri.scheme !== git_resource_1.GIT_RESOURCE_SCHEME) {
            throw new Error(`Expected a URI with ${git_resource_1.GIT_RESOURCE_SCHEME} scheme. Was: ${uri}.`);
        }
        return this.getResource(uri);
    }
    async getResource(uri) {
        const repository = await this.getRepository(uri);
        return new git_resource_1.GitResource(uri, repository, this.git);
    }
    async getRepository(uri) {
        const fileUri = uri.withScheme('file');
        const repositories = this.repositoryProvider.allRepositories;
        // The layout restorer might ask for the known repositories this point.
        if (repositories.length === 0) {
            // So let's make sure, the repository provider state is in sync with the backend.
            await this.repositoryProvider.refresh();
            repositories.push(...this.repositoryProvider.allRepositories);
        }
        // We sort by length so that we visit the nested repositories first.
        // We do not want to get the repository A instead of B if we have:
        // repository A, another repository B inside A and a resource A/B/C.ext.
        const sortedRepositories = repositories.sort((a, b) => b.localUri.length - a.localUri.length);
        for (const repository of sortedRepositories) {
            const localUri = new uri_1.default(repository.localUri);
            // make sure that localUri of repository has file scheme.
            const localUriStr = localUri.withScheme('file').toString();
            if (fileUri.toString().startsWith(localUriStr)) {
                return { localUri: localUriStr };
            }
        }
        return undefined;
    }
};
GitResourceResolver = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(common_1.Git)),
    __param(1, (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider)),
    __metadata("design:paramtypes", [Object, git_repository_provider_1.GitRepositoryProvider])
], GitResourceResolver);
exports.GitResourceResolver = GitResourceResolver;
//# sourceMappingURL=git-resource-resolver.js.map