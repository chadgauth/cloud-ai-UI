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
exports.OutlineAdapter = void 0;
const Converter = require("../type-converters");
const types = require("../types-impl");
/** Adapts the calls from main to extension thread for providing the document symbols. */
class OutlineAdapter {
    constructor(documents, provider) {
        this.documents = documents;
        this.provider = provider;
    }
    provideDocumentSymbols(resource, token) {
        const document = this.documents.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const doc = document.document;
        return Promise.resolve(this.provider.provideDocumentSymbols(doc, token)).then(value => {
            if (!value || value.length === 0) {
                return undefined;
            }
            if (value[0] instanceof types.DocumentSymbol) {
                return value.map(Converter.fromDocumentSymbol);
            }
            else {
                return OutlineAdapter.asDocumentSymbolTree(resource, value);
            }
        });
    }
    static asDocumentSymbolTree(resource, infos) {
        // first sort by start (and end) and then loop over all elements
        // and build a tree based on containment.
        infos = infos.slice(0).sort((a, b) => {
            let r = a.location.range.start.compareTo(b.location.range.start);
            if (r === 0) {
                r = b.location.range.end.compareTo(a.location.range.end);
            }
            return r;
        });
        const res = [];
        const parentStack = [];
        for (const info of infos) {
            const element = {
                name: info.name,
                detail: '',
                kind: Converter.SymbolKind.fromSymbolKind(info.kind),
                containerName: info.containerName,
                range: Converter.fromRange(info.location.range),
                selectionRange: Converter.fromRange(info.location.range),
                children: [],
                tags: info.tags && info.tags.length > 0 ? info.tags.map(Converter.fromSymbolTag) : [],
            };
            while (true) {
                if (parentStack.length === 0) {
                    parentStack.push(element);
                    res.push(element);
                    break;
                }
                const parent = parentStack[parentStack.length - 1];
                if (OutlineAdapter.containsRange(parent.range, element.range) && !OutlineAdapter.equalsRange(parent.range, element.range)) {
                    parent.children.push(element);
                    parentStack.push(element);
                    break;
                }
                parentStack.pop();
            }
        }
        return res;
    }
    /**
     * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
     */
    static containsRange(range, otherRange) {
        if (otherRange.startLineNumber < range.startLineNumber || otherRange.endLineNumber < range.startLineNumber) {
            return false;
        }
        if (otherRange.startLineNumber > range.endLineNumber || otherRange.endLineNumber > range.endLineNumber) {
            return false;
        }
        if (otherRange.startLineNumber === range.startLineNumber && otherRange.startColumn < range.startColumn) {
            return false;
        }
        if (otherRange.endLineNumber === range.endLineNumber && otherRange.endColumn > range.endColumn) {
            return false;
        }
        return true;
    }
    /**
     * Test if range `a` equals `b`.
     */
    static equalsRange(a, b) {
        return (!!a &&
            !!b &&
            a.startLineNumber === b.startLineNumber &&
            a.startColumn === b.startColumn &&
            a.endLineNumber === b.endLineNumber &&
            a.endColumn === b.endColumn);
    }
}
exports.OutlineAdapter = OutlineAdapter;
//# sourceMappingURL=outline.js.map