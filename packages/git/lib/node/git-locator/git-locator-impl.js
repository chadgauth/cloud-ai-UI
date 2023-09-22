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
exports.GitLocatorImpl = void 0;
const fs = require("@theia/core/shared/fs-extra");
const path = require("path");
const findGitRepositories = require('find-git-repositories');
class GitLocatorImpl {
    constructor(options) {
        this.options = {
            info: (message, ...args) => console.info(message, ...args),
            error: (message, ...args) => console.error(message, ...args),
            ...options
        };
    }
    dispose() {
    }
    async locate(basePath, options) {
        return this.doLocate(basePath, {
            maxCount: typeof options.maxCount === 'number' ? options.maxCount : -1,
            visited: new Map()
        });
    }
    async doLocate(basePath, context) {
        const realBasePath = await fs.realpath(basePath);
        if (context.visited.has(realBasePath)) {
            return [];
        }
        context.visited.set(realBasePath, true);
        try {
            const stat = await fs.stat(realBasePath);
            if (!stat.isDirectory()) {
                return [];
            }
            const progress = [];
            const paths = await findGitRepositories(realBasePath, repositories => {
                progress.push(...repositories);
                if (context.maxCount >= 0 && progress.length >= context.maxCount) {
                    return progress.slice(0, context.maxCount).map(GitLocatorImpl.map);
                }
            });
            if (context.maxCount >= 0 && paths.length >= context.maxCount) {
                return await Promise.all(paths.slice(0, context.maxCount).map(GitLocatorImpl.map));
            }
            const repositoryPaths = await Promise.all(paths.map(GitLocatorImpl.map));
            return this.locateFrom(newContext => this.generateNested(repositoryPaths, newContext), context, repositoryPaths);
        }
        catch (e) {
            return [];
        }
    }
    *generateNested(repositoryPaths, context) {
        for (const repository of repositoryPaths) {
            yield this.locateNested(repository, context);
        }
    }
    locateNested(repositoryPath, context) {
        return new Promise(resolve => {
            fs.readdir(repositoryPath, async (err, files) => {
                if (err) {
                    this.options.error(err.message, err);
                    resolve([]);
                }
                else {
                    resolve(this.locateFrom(newContext => this.generateRepositories(repositoryPath, files, newContext), context));
                }
            });
        });
    }
    *generateRepositories(repositoryPath, files, context) {
        for (const file of files) {
            if (file !== '.git') {
                yield this.doLocate(path.join(repositoryPath, file), {
                    ...context
                });
            }
        }
    }
    async locateFrom(generator, parentContext, initial) {
        const result = [];
        if (initial) {
            result.push(...initial);
        }
        const context = {
            ...parentContext,
            maxCount: parentContext.maxCount - result.length
        };
        for (const locateRepositories of generator(context)) {
            const repositories = await locateRepositories;
            result.push(...repositories);
            if (context.maxCount >= 0) {
                if (result.length >= context.maxCount) {
                    return result.slice(0, context.maxCount);
                }
                context.maxCount -= repositories.length;
            }
        }
        return result;
    }
    static async map(repository) {
        return fs.realpath(path.dirname(repository));
    }
}
exports.GitLocatorImpl = GitLocatorImpl;
//# sourceMappingURL=git-locator-impl.js.map