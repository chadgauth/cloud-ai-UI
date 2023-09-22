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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitResource = exports.GIT_RESOURCE_SCHEME = void 0;
exports.GIT_RESOURCE_SCHEME = 'gitrev';
class GitResource {
    constructor(uri, repository, git) {
        this.uri = uri;
        this.repository = repository;
        this.git = git;
    }
    async readContents(options) {
        if (this.repository) {
            const commitish = this.uri.query;
            let encoding;
            if ((options === null || options === void 0 ? void 0 : options.encoding) === 'utf8' || (options === null || options === void 0 ? void 0 : options.encoding) === 'binary') {
                encoding = options === null || options === void 0 ? void 0 : options.encoding;
            }
            return this.git.show(this.repository, this.uri.toString(), { commitish, encoding });
        }
        return '';
    }
    dispose() { }
}
exports.GitResource = GitResource;
//# sourceMappingURL=git-resource.js.map