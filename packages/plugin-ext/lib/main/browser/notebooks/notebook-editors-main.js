"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookEditorsMainImpl = void 0;
const uri_1 = require("@theia/core/lib/common/uri");
const common_1 = require("../../../common");
const browser_1 = require("@theia/core/lib/browser");
class NotebookEditorsMainImpl {
    constructor(rpc, container) {
        this.mainThreadEditors = new Map();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOK_EDITORS_EXT);
        this.openerService = container.get(browser_1.OpenerService);
    }
    async $tryShowNotebookDocument(uriComponents, viewType, options) {
        const editor = await (0, browser_1.open)(this.openerService, uri_1.URI.fromComponents(uriComponents), {});
        return editor.id;
    }
    $tryRevealRange(id, range, revealType) {
        throw new Error('Method not implemented.');
    }
    $trySetSelections(id, range) {
        throw new Error('Method not implemented.');
    }
    handleEditorsAdded(editors) {
        for (const editor of editors) {
            this.mainThreadEditors.set(editor.id, editor);
        }
    }
    handleEditorsRemoved(editorIds) {
        var _a;
        for (const id of editorIds) {
            (_a = this.mainThreadEditors.get(id)) === null || _a === void 0 ? void 0 : _a.dispose();
            this.mainThreadEditors.delete(id);
        }
    }
    dispose() {
    }
}
exports.NotebookEditorsMainImpl = NotebookEditorsMainImpl;
//# sourceMappingURL=notebook-editors-main.js.map