"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.DeclarationAdapter = void 0;
const types = require("../types-impl");
const Converter = require("../type-converters");
const util_1 = require("./util");
class DeclarationAdapter {
    constructor(provider, documents) {
        this.provider = provider;
        this.documents = documents;
    }
    provideDeclaration(resource, position, token) {
        const documentData = this.documents.getDocumentData(resource);
        if (!documentData) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const document = documentData.document;
        const zeroBasedPosition = Converter.toPosition(position);
        return Promise.resolve(this.provider.provideDeclaration(document, zeroBasedPosition, token)).then(definition => {
            if (!definition) {
                return undefined;
            }
            if (definition instanceof types.Location) {
                return Converter.fromLocation(definition);
            }
            if ((0, util_1.isLocationArray)(definition)) {
                const locations = [];
                for (const location of definition) {
                    locations.push(Converter.fromLocation(location));
                }
                return locations;
            }
            if ((0, util_1.isDefinitionLinkArray)(definition)) {
                const definitionLinks = [];
                for (const definitionLink of definition) {
                    definitionLinks.push(Converter.fromDefinitionLink(definitionLink));
                }
                return definitionLinks;
            }
        });
    }
}
exports.DeclarationAdapter = DeclarationAdapter;
//# sourceMappingURL=declaration.js.map