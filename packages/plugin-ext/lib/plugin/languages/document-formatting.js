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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentFormattingAdapter = void 0;
const Converter = require("../type-converters");
class DocumentFormattingAdapter {
    constructor(provider, documents) {
        this.provider = provider;
        this.documents = documents;
    }
    provideDocumentFormattingEdits(resource, options, token) {
        const document = this.documents.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There are no document for ${resource}`));
        }
        const doc = document.document;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Promise.resolve(this.provider.provideDocumentFormattingEdits(doc, options, token)).then(value => {
            if (Array.isArray(value)) {
                return value.map(Converter.fromTextEdit);
            }
            return undefined;
        });
    }
}
exports.DocumentFormattingAdapter = DocumentFormattingAdapter;
//# sourceMappingURL=document-formatting.js.map