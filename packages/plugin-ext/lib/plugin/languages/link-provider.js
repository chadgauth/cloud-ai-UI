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
exports.LinkProviderAdapter = void 0;
const Converter = require("../type-converters");
const object_identifier_1 = require("../../common/object-identifier");
class LinkProviderAdapter {
    constructor(provider, documents) {
        this.provider = provider;
        this.documents = documents;
        this.cacheId = 0;
        this.cache = new Map();
    }
    provideLinks(resource, token) {
        const document = this.documents.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const doc = document.document;
        return Promise.resolve(this.provider.provideDocumentLinks(doc, token)).then(links => {
            if (!Array.isArray(links)) {
                return undefined;
            }
            const result = [];
            for (const link of links) {
                const data = Converter.DocumentLink.from(link);
                const id = this.cacheId++;
                object_identifier_1.ObjectIdentifier.mixin(data, id);
                this.cache.set(id, link);
                result.push(data);
            }
            return result;
        });
    }
    resolveLink(link, token) {
        if (typeof this.provider.resolveDocumentLink !== 'function') {
            return Promise.resolve(undefined);
        }
        const id = object_identifier_1.ObjectIdentifier.of(link);
        const item = this.cache.get(id);
        if (!item) {
            return Promise.resolve(undefined);
        }
        return Promise.resolve(this.provider.resolveDocumentLink(item, token)).then(value => {
            if (value) {
                return Converter.DocumentLink.from(value);
            }
            return undefined;
        });
    }
    releaseDocumentLinks(ids) {
        ids.forEach(id => {
            this.cache.delete(id);
        });
    }
}
exports.LinkProviderAdapter = LinkProviderAdapter;
//# sourceMappingURL=link-provider.js.map