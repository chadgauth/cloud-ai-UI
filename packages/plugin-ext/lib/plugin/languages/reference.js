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
exports.ReferenceAdapter = void 0;
const Converter = require("../type-converters");
const util_1 = require("./util");
class ReferenceAdapter {
    constructor(provider, documents) {
        this.provider = provider;
        this.documents = documents;
    }
    provideReferences(resource, position, context, token) {
        const documentData = this.documents.getDocumentData(resource);
        if (!documentData) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const document = documentData.document;
        const zeroBasedPosition = Converter.toPosition(position);
        return Promise.resolve(this.provider.provideReferences(document, zeroBasedPosition, context, token)).then(reference => {
            if (!reference) {
                return undefined;
            }
            if ((0, util_1.isLocationArray)(reference)) {
                const locations = [];
                for (const location of reference) {
                    locations.push(Converter.fromLocation(location));
                }
                return locations;
            }
        });
    }
}
exports.ReferenceAdapter = ReferenceAdapter;
//# sourceMappingURL=reference.js.map