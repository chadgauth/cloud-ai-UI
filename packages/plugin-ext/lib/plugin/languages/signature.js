"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.SignatureHelpAdapter = void 0;
const Converter = require("../type-converters");
class SignatureHelpAdapter {
    constructor(delegate, documents) {
        this.delegate = delegate;
        this.documents = documents;
        this.idSequence = 1;
        this.cache = new Map();
    }
    async provideSignatureHelp(resource, position, token, context) {
        var _a;
        const documentData = this.documents.getDocumentData(resource);
        if (!documentData) {
            return Promise.reject(new Error(`There are no document for  ${resource}`));
        }
        const document = documentData.document;
        const zeroBasedPosition = Converter.toPosition(position);
        const pluginHelpContext = this.reviveContext(context);
        const value = await this.delegate.provideSignatureHelp(document, zeroBasedPosition, token, pluginHelpContext);
        if (!value) {
            return undefined;
        }
        value.activeParameter = (_a = value.signatures[value.activeSignature].activeParameter) !== null && _a !== void 0 ? _a : value.activeParameter;
        const id = this.idSequence++;
        this.cache.set(id, value);
        return Converter.SignatureHelp.from(id, value);
    }
    reviveContext(context) {
        var _a;
        let activeSignatureHelp = undefined;
        if (context.activeSignatureHelp) {
            const revivedSignatureHelp = Converter.SignatureHelp.to(context.activeSignatureHelp);
            const saved = typeof context.activeSignatureHelp.id === 'number' && this.cache.get(context.activeSignatureHelp.id);
            if (saved) {
                activeSignatureHelp = saved;
                activeSignatureHelp.activeSignature = revivedSignatureHelp.activeSignature;
                const { activeSignature } = revivedSignatureHelp;
                activeSignatureHelp.activeParameter = (_a = revivedSignatureHelp.signatures[activeSignature].activeParameter) !== null && _a !== void 0 ? _a : revivedSignatureHelp.activeParameter;
            }
            else {
                activeSignatureHelp = revivedSignatureHelp;
            }
        }
        return { ...context, activeSignatureHelp };
    }
    releaseSignatureHelp(id) {
        this.cache.delete(id);
    }
}
exports.SignatureHelpAdapter = SignatureHelpAdapter;
//# sourceMappingURL=signature.js.map