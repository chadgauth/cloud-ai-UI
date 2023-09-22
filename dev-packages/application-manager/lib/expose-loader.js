"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
const fs = require("fs-extra");
const path = require("path");
const application_package_1 = require("@theia/application-package/lib/application-package");
const modulePackages = [];
for (const extensionPackage of new application_package_1.ApplicationPackage({ projectPath: process.cwd() }).extensionPackages) {
    modulePackages.push({
        name: extensionPackage.name,
        dir: path.dirname(extensionPackage.raw.installed.packagePath)
    });
}
function exposeModule(modulePackage, resourcePath, source) {
    if (!modulePackage.name) {
        return source;
    }
    const { dir, name } = path.parse(resourcePath);
    let moduleName = path.join(modulePackage.name, dir.substring(modulePackage.dir.length));
    if (name !== 'index') {
        moduleName = path.join(moduleName, name);
    }
    if (path.sep !== '/') {
        moduleName = moduleName.split(path.sep).join('/');
    }
    return source + `\n;(globalThis['theia'] = globalThis['theia'] || {})['${moduleName}'] = this;\n`;
}
module.exports = function (source, sourceMap) {
    if (this.cacheable) {
        this.cacheable();
    }
    let modulePackage = modulePackages.find(({ dir }) => this.resourcePath.startsWith(dir + path.sep));
    if (modulePackage) {
        this.callback(undefined, exposeModule(modulePackage, this.resourcePath, source), sourceMap);
        return;
    }
    const searchString = path.sep + 'node_modules';
    const index = this.resourcePath.lastIndexOf(searchString);
    if (index !== -1) {
        const nodeModulesPath = this.resourcePath.substring(0, index + searchString.length);
        let dir = this.resourcePath;
        while ((dir = path.dirname(dir)) !== nodeModulesPath) {
            try {
                const { name } = fs.readJSONSync(path.join(dir, 'package.json'));
                modulePackage = { name, dir };
                modulePackages.push(modulePackage);
                this.callback(undefined, exposeModule(modulePackage, this.resourcePath, source), sourceMap);
                return;
            }
            catch {
                /** no-op */
            }
        }
    }
    this.callback(undefined, source, sourceMap);
};
//# sourceMappingURL=expose-loader.js.map