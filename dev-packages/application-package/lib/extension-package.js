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
exports.RawExtensionPackage = exports.ExtensionPackage = void 0;
const fs = require("fs-extra");
const paths = require("path");
const semver = require("semver");
const npm_registry_1 = require("./npm-registry");
class ExtensionPackage {
    constructor(raw, registry, options = {}) {
        var _a;
        this.raw = raw;
        this.registry = registry;
        this._name = (_a = options.alias) !== null && _a !== void 0 ? _a : raw.name;
    }
    /**
     * The name of the extension's package as defined in "dependencies" (might be aliased)
     */
    get name() {
        return this._name;
    }
    get version() {
        if (this.raw.installed) {
            return this.raw.installed.version;
        }
        if (this.raw.view) {
            const latestVersion = this.raw.view.latestVersion;
            if (latestVersion) {
                return latestVersion;
            }
        }
        return this.raw.version;
    }
    get description() {
        return this.raw.description || '';
    }
    get theiaExtensions() {
        return this.raw.theiaExtensions || [];
    }
    get installed() {
        return !!this.raw.installed;
    }
    get dependent() {
        if (!this.transitive) {
            return undefined;
        }
        let current = this.parent;
        let parent = current.parent;
        while (parent !== undefined) {
            current = parent;
            parent = current.parent;
        }
        return current.name;
    }
    get transitive() {
        return !!this.raw.installed && this.raw.installed.transitive;
    }
    get parent() {
        if (this.raw.installed) {
            return this.raw.installed.parent;
        }
        return undefined;
    }
    async view() {
        if (this.raw.view === undefined) {
            const raw = await RawExtensionPackage.view(this.registry, this.name, this.version);
            this.raw.view = raw ? raw.view : new RawExtensionPackage.ViewState(this.registry);
        }
        return this.raw.view;
    }
    async getReadme() {
        if (this.readme === undefined) {
            this.readme = await this.resolveReadme();
        }
        return this.readme;
    }
    async resolveReadme() {
        const raw = await this.view();
        if (raw && raw.readme) {
            return raw.readme;
        }
        if (this.raw.installed) {
            const readmePath = paths.resolve(this.raw.installed.packagePath, '..', 'README.md');
            if (await fs.pathExists(readmePath)) {
                return fs.readFile(readmePath, { encoding: 'utf8' });
            }
            return '';
        }
        return '';
    }
    getAuthor() {
        if (this.raw.publisher) {
            return this.raw.publisher.username;
        }
        if (typeof this.raw.author === 'string') {
            return this.raw.author;
        }
        if (this.raw.author && this.raw.author.name) {
            return this.raw.author.name;
        }
        if (!!this.raw.maintainers && this.raw.maintainers.length > 0) {
            return this.raw.maintainers[0].username;
        }
        return '';
    }
}
exports.ExtensionPackage = ExtensionPackage;
var RawExtensionPackage;
(function (RawExtensionPackage) {
    class ViewState {
        constructor(registry) {
            this.registry = registry;
        }
        get latestVersion() {
            if (this.tags) {
                if (this.registry.props.next) {
                    const next = this.tags['next'];
                    if (next !== undefined) {
                        return next;
                    }
                }
                const latest = this.tags['latest'];
                if (this.registry.props.next || !semver.prerelease(latest)) {
                    return latest;
                }
                return undefined;
            }
            return undefined;
        }
    }
    RawExtensionPackage.ViewState = ViewState;
    function is(pck) {
        return npm_registry_1.PublishedNodePackage.is(pck) && !!pck.theiaExtensions;
    }
    RawExtensionPackage.is = is;
    async function view(registry, name, version) {
        const result = await registry.view(name).catch(() => undefined);
        if (!result) {
            return undefined;
        }
        const tags = result['dist-tags'];
        const versions = [tags['latest']];
        if (registry.props.next) {
            versions.push(tags['next']);
        }
        if (version) {
            versions.push(tags[version], version);
        }
        for (const current of versions.reverse()) {
            const raw = result.versions[current];
            if (is(raw)) {
                const viewState = new ViewState(registry);
                viewState.readme = result.readme;
                viewState.tags = tags;
                raw.view = viewState;
                return raw;
            }
        }
        return undefined;
    }
    RawExtensionPackage.view = view;
})(RawExtensionPackage = exports.RawExtensionPackage || (exports.RawExtensionPackage = {}));
//# sourceMappingURL=extension-package.js.map