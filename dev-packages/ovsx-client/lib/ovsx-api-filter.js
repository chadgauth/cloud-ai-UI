"use strict";
// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
exports.OVSXApiFilterImpl = exports.OVSXApiFilter = void 0;
const semver = require("semver");
const ovsx_types_1 = require("./ovsx-types");
exports.OVSXApiFilter = Symbol('OVSXApiFilter');
class OVSXApiFilterImpl {
    constructor(supportedApiVersion) {
        this.supportedApiVersion = supportedApiVersion;
    }
    getLatestCompatibleExtension(extensions) {
        if (extensions.length === 0) {
            return;
        }
        else if (this.isBuiltinNamespace(extensions[0].namespace.toLowerCase())) {
            return extensions.find(extension => this.versionGreaterThanOrEqualTo(extension.version, this.supportedApiVersion));
        }
        else {
            return extensions.find(extension => { var _a, _b; return this.supportedVscodeApiSatisfies((_b = (_a = extension.engines) === null || _a === void 0 ? void 0 : _a.vscode) !== null && _b !== void 0 ? _b : '*'); });
        }
    }
    getLatestCompatibleVersion(searchEntry) {
        function getLatestCompatibleVersion(predicate) {
            if (searchEntry.allVersions) {
                return searchEntry.allVersions.find(predicate);
            }
            // If the allVersions field is missing then try to use the
            // searchEntry as VSXAllVersions and check if it's compatible:
            if (predicate(searchEntry)) {
                return searchEntry;
            }
        }
        if (this.isBuiltinNamespace(searchEntry.namespace)) {
            return getLatestCompatibleVersion(allVersions => this.versionGreaterThanOrEqualTo(allVersions.version, this.supportedApiVersion));
        }
        else {
            return getLatestCompatibleVersion(allVersions => { var _a, _b; return this.supportedVscodeApiSatisfies((_b = (_a = allVersions.engines) === null || _a === void 0 ? void 0 : _a.vscode) !== null && _b !== void 0 ? _b : '*'); });
        }
    }
    isBuiltinNamespace(namespace) {
        return ovsx_types_1.VSXBuiltinNamespaces.is(namespace);
    }
    /**
     * @returns `a >= b`
     */
    versionGreaterThanOrEqualTo(a, b) {
        const versionA = semver.clean(a);
        const versionB = semver.clean(b);
        if (!versionA || !versionB) {
            return false;
        }
        return semver.lte(versionA, versionB);
    }
    supportedVscodeApiSatisfies(vscodeApiRange) {
        return semver.satisfies(this.supportedApiVersion, vscodeApiRange);
    }
}
exports.OVSXApiFilterImpl = OVSXApiFilterImpl;
//# sourceMappingURL=ovsx-api-filter.js.map