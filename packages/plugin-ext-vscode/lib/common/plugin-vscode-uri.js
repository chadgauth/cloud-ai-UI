"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.VSCodeExtensionUri = void 0;
const uri_1 = require("@theia/core/lib/common/uri");
/**
 * Static methods for identifying a plugin as the target of the VSCode deployment system.
 * In practice, this means that it will be resolved and deployed by the Open-VSX system.
 */
var VSCodeExtensionUri;
(function (VSCodeExtensionUri) {
    VSCodeExtensionUri.VSCODE_PREFIX = 'vscode:extension/';
    /**
     * Should be used to prefix a plugin's ID to ensure that it is identified as a VSX Extension.
     * @returns `vscode:extension/${id}`
     */
    function toVsxExtensionUriString(id) {
        return `${VSCodeExtensionUri.VSCODE_PREFIX}${id}`;
    }
    VSCodeExtensionUri.toVsxExtensionUriString = toVsxExtensionUriString;
    function toUri(idOrName, namespace) {
        if (typeof namespace === 'string') {
            return new uri_1.default(toVsxExtensionUriString(`${namespace}.${idOrName}`));
        }
        else {
            return new uri_1.default(toVsxExtensionUriString(idOrName));
        }
    }
    VSCodeExtensionUri.toUri = toUri;
    function toId(uri) {
        if (uri.scheme === 'vscode' && uri.path.dir.toString() === 'extension') {
            return uri.path.base;
        }
        return undefined;
    }
    VSCodeExtensionUri.toId = toId;
})(VSCodeExtensionUri = exports.VSCodeExtensionUri || (exports.VSCodeExtensionUri = {}));
//# sourceMappingURL=plugin-vscode-uri.js.map