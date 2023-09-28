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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitCommitDetailOpenHandler = exports.GitCommitDetailUri = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const git_scm_provider_1 = require("../git-scm-provider");
var GitCommitDetailUri;
(function (GitCommitDetailUri) {
    GitCommitDetailUri.scheme = git_scm_provider_1.GitScmProvider.GIT_COMMIT_DETAIL;
    function toCommitSha(uri) {
        if (uri.scheme === GitCommitDetailUri.scheme) {
            return uri.fragment;
        }
        throw new Error('The given uri is not an commit detail URI, uri: ' + uri);
    }
    GitCommitDetailUri.toCommitSha = toCommitSha;
})(GitCommitDetailUri = exports.GitCommitDetailUri || (exports.GitCommitDetailUri = {}));
let GitCommitDetailOpenHandler = class GitCommitDetailOpenHandler extends browser_1.WidgetOpenHandler {
    constructor() {
        super(...arguments);
        this.id = git_scm_provider_1.GitScmProvider.GIT_COMMIT_DETAIL;
    }
    canHandle(uri) {
        try {
            GitCommitDetailUri.toCommitSha(uri);
            return 200;
        }
        catch {
            return 0;
        }
    }
    async doOpen(widget, options) {
        await super.doOpen(widget, options);
    }
    createWidgetOptions(uri, commit) {
        return commit;
    }
};
GitCommitDetailOpenHandler = __decorate([
    (0, inversify_1.injectable)()
], GitCommitDetailOpenHandler);
exports.GitCommitDetailOpenHandler = GitCommitDetailOpenHandler;
//# sourceMappingURL=git-commit-detail-open-handler.js.map