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
exports.DocumentHighlightAdapter = void 0;
const types = require("../types-impl");
const Converter = require("../type-converters");
class DocumentHighlightAdapter {
    constructor(provider, documents) {
        this.provider = provider;
        this.documents = documents;
    }
    provideDocumentHighlights(resource, position, token) {
        const documentData = this.documents.getDocumentData(resource);
        if (!documentData) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const document = documentData.document;
        const zeroBasedPosition = Converter.toPosition(position);
        return Promise.resolve(this.provider.provideDocumentHighlights(document, zeroBasedPosition, token)).then(documentHighlights => {
            if (!documentHighlights) {
                return undefined;
            }
            if (this.isDocumentHighlightArray(documentHighlights)) {
                const highlights = [];
                for (const highlight of documentHighlights) {
                    highlights.push(Converter.fromDocumentHighlight(highlight));
                }
                return highlights;
            }
        });
    }
    isDocumentHighlightArray(array) {
        return Array.isArray(array) && array.length > 0 && array[0] instanceof types.DocumentHighlight;
    }
}
exports.DocumentHighlightAdapter = DocumentHighlightAdapter;
//# sourceMappingURL=document-highlight.js.map