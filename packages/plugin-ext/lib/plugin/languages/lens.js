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
exports.CodeLensAdapter = void 0;
const Converter = require("../type-converters");
const object_identifier_1 = require("../../common/object-identifier");
const disposable_1 = require("@theia/core/lib/common/disposable");
/** Adapts the calls from main to extension thread for providing/resolving the code lenses. */
class CodeLensAdapter {
    constructor(provider, documents, commands) {
        this.provider = provider;
        this.documents = documents;
        this.commands = commands;
        this.cacheId = 0;
        this.cache = new Map();
        this.disposables = new Map();
    }
    provideCodeLenses(resource, token) {
        const document = this.documents.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const doc = document.document;
        return Promise.resolve(this.provider.provideCodeLenses(doc, token)).then(lenses => {
            if (Array.isArray(lenses)) {
                return lenses.map(lens => {
                    const cacheId = this.cacheId++;
                    const toDispose = new disposable_1.DisposableCollection();
                    const lensSymbol = object_identifier_1.ObjectIdentifier.mixin({
                        range: Converter.fromRange(lens.range),
                        command: this.commands.converter.toSafeCommand(lens.command, toDispose)
                    }, cacheId);
                    this.cache.set(cacheId, lens);
                    this.disposables.set(cacheId, toDispose);
                    return lensSymbol;
                });
            }
            return undefined;
        });
    }
    async resolveCodeLens(resource, symbol, token) {
        const cacheId = object_identifier_1.ObjectIdentifier.of(symbol);
        const lens = this.cache.get(cacheId);
        if (!lens) {
            return undefined;
        }
        let newLens;
        if (typeof this.provider.resolveCodeLens === 'function' && !lens.isResolved) {
            newLens = await this.provider.resolveCodeLens(lens, token);
            if (token.isCancellationRequested) {
                return undefined;
            }
        }
        newLens = newLens || lens;
        const disposables = this.disposables.get(cacheId);
        if (!disposables) {
            // already been disposed of
            return undefined;
        }
        symbol.command = this.commands.converter.toSafeCommand(newLens.command ? newLens.command : CodeLensAdapter.BAD_CMD, disposables);
        return symbol;
    }
    releaseCodeLenses(ids) {
        ids.forEach(id => {
            this.cache.delete(id);
            const toDispose = this.disposables.get(id);
            if (toDispose) {
                toDispose.dispose();
                this.disposables.delete(id);
            }
        });
    }
}
exports.CodeLensAdapter = CodeLensAdapter;
CodeLensAdapter.BAD_CMD = { command: 'missing', title: '<<MISSING COMMAND>>' };
//# sourceMappingURL=lens.js.map