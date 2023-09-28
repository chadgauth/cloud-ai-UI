"use strict";
// *****************************************************************************
// Copyright (C) 2017-2018 Ericsson and others.
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
exports.SearchInWorkspaceServer = exports.SIW_WS_PATH = exports.SearchInWorkspaceClient = exports.SearchInWorkspaceResult = void 0;
var SearchInWorkspaceResult;
(function (SearchInWorkspaceResult) {
    /**
     * Sort search in workspace results according to file, line, character position
     * and then length.
     */
    function compare(a, b) {
        if (a.fileUri !== b.fileUri) {
            return a.fileUri < b.fileUri ? -1 : 1;
        }
        return 0;
    }
    SearchInWorkspaceResult.compare = compare;
})(SearchInWorkspaceResult = exports.SearchInWorkspaceResult || (exports.SearchInWorkspaceResult = {}));
exports.SearchInWorkspaceClient = Symbol('SearchInWorkspaceClient');
exports.SIW_WS_PATH = '/services/search-in-workspace';
exports.SearchInWorkspaceServer = Symbol('SearchInWorkspaceServer');
//# sourceMappingURL=search-in-workspace-interface.js.map