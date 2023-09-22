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
exports.RenameAdapter = void 0;
const Converter = require("../type-converters");
const types_impl_1 = require("../types-impl");
const types_1 = require("../../common/types");
class RenameAdapter {
    constructor(provider, documents) {
        this.provider = provider;
        this.documents = documents;
    }
    static supportsResolving(provider) {
        return typeof provider.prepareRename === 'function';
    }
    provideRenameEdits(resource, position, newName, token) {
        const document = this.documents.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const doc = document.document;
        const pos = Converter.toPosition(position);
        return Promise.resolve(this.provider.provideRenameEdits(doc, pos, newName, token)).then(value => {
            if (!value) {
                return undefined;
            }
            return Converter.fromWorkspaceEdit(value);
        }, error => {
            const rejectReason = RenameAdapter.asMessage(error);
            if (rejectReason) {
                return {
                    rejectReason,
                    edits: []
                };
            }
            else {
                return Promise.reject(error);
            }
        });
    }
    resolveRenameLocation(resource, position, token) {
        if (typeof this.provider.prepareRename !== 'function') {
            return Promise.resolve(undefined);
        }
        const document = this.documents.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const doc = document.document;
        const pos = Converter.toPosition(position);
        return Promise.resolve(this.provider.prepareRename(doc, pos, token)).then(rangeOrLocation => {
            let range;
            let text;
            if (rangeOrLocation && types_impl_1.Range.isRange(rangeOrLocation)) {
                range = rangeOrLocation;
                text = doc.getText(rangeOrLocation);
            }
            else if (rangeOrLocation && (0, types_1.isObject)(rangeOrLocation)) {
                range = rangeOrLocation.range;
                text = rangeOrLocation.placeholder;
            }
            if (!range) {
                return undefined;
            }
            if (range.start.line > pos.line || range.end.line < pos.line) {
                console.warn('INVALID rename location: position line must be within range start/end lines');
                return undefined;
            }
            return {
                range: Converter.fromRange(range),
                text: text
            };
        }, error => {
            const rejectReason = RenameAdapter.asMessage(error);
            if (rejectReason) {
                return Promise.resolve({
                    rejectReason,
                    range: undefined,
                    text: undefined
                });
            }
            else {
                return Promise.reject(error);
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static asMessage(err) {
        if (typeof err === 'string') {
            return err;
        }
        else if (err instanceof Error && typeof err.message === 'string') {
            return err.message;
        }
        else {
            return undefined;
        }
    }
}
exports.RenameAdapter = RenameAdapter;
//# sourceMappingURL=rename.js.map