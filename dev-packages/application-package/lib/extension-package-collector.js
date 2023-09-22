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
exports.ExtensionPackageCollector = void 0;
const json_file_1 = require("./json-file");
const extension_package_1 = require("./extension-package");
class ExtensionPackageCollector {
    constructor(extensionPackageFactory, resolveModule) {
        this.extensionPackageFactory = extensionPackageFactory;
        this.resolveModule = resolveModule;
        this.sorted = [];
        this.visited = new Map();
    }
    collect(pck) {
        this.root = pck;
        this.collectPackages(pck);
        return this.sorted;
    }
    collectPackages(pck) {
        var _a, _b;
        for (const [dependency, versionRange] of [
            ...Object.entries((_a = pck.dependencies) !== null && _a !== void 0 ? _a : {}),
            ...Object.entries((_b = pck.peerDependencies) !== null && _b !== void 0 ? _b : {})
        ]) {
            this.collectPackage(dependency, versionRange);
        }
    }
    collectPackagesWithParent(pck, parent) {
        const current = this.parent;
        this.parent = parent;
        this.collectPackages(pck);
        this.parent = current;
    }
    collectPackage(name, versionRange) {
        if (this.visited.has(name)) {
            return;
        }
        this.visited.set(name, true);
        let packagePath;
        try {
            packagePath = this.resolveModule(name);
        }
        catch {
            console.debug(`Failed to resolve module: ${name}`);
        }
        if (!packagePath) {
            return;
        }
        const pck = (0, json_file_1.readJsonFile)(packagePath);
        if (extension_package_1.RawExtensionPackage.is(pck)) {
            const parent = this.parent;
            const version = pck.version;
            const transitive = !(name in this.root.dependencies);
            pck.installed = { packagePath, version, parent, transitive };
            pck.version = versionRange;
            const extensionPackage = this.extensionPackageFactory(pck, { alias: name });
            this.collectPackagesWithParent(pck, extensionPackage);
            this.sorted.push(extensionPackage);
        }
    }
}
exports.ExtensionPackageCollector = ExtensionPackageCollector;
//# sourceMappingURL=extension-package-collector.js.map