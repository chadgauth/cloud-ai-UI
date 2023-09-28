"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.DocumentRangeSemanticTokensAdapter = exports.DocumentSemanticTokensAdapter = void 0;
const types_impl_1 = require("../types-impl");
const type_converters_1 = require("../type-converters");
const semantic_tokens_dto_1 = require("../../common/semantic-tokens-dto");
class SemanticTokensPreviousResult {
    constructor(resultId, tokens) {
        this.resultId = resultId;
        this.tokens = tokens;
    }
}
class DocumentSemanticTokensAdapter {
    constructor(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
        this._nextResultId = 1;
        this._previousResults = new Map();
    }
    async provideDocumentSemanticTokens(resource, previousResultId, token) {
        const doc = this._documents.getDocument(resource);
        const previousResult = (previousResultId !== 0 ? this._previousResults.get(previousResultId) : null);
        let value;
        if (previousResult && typeof previousResult.resultId === 'string' && typeof this._provider.provideDocumentSemanticTokensEdits === 'function') {
            value = await this._provider.provideDocumentSemanticTokensEdits(doc, previousResult.resultId, token);
        }
        else {
            value = await this._provider.provideDocumentSemanticTokens(doc, token);
        }
        if (previousResult) {
            this._previousResults.delete(previousResultId);
        }
        if (!value) {
            return null;
        }
        value = DocumentSemanticTokensAdapter._fixProvidedSemanticTokens(value);
        return this._send(DocumentSemanticTokensAdapter._convertToEdits(previousResult, value), value);
    }
    async releaseDocumentSemanticColoring(semanticColoringResultId) {
        this._previousResults.delete(semanticColoringResultId);
    }
    static _fixProvidedSemanticTokens(v) {
        if (DocumentSemanticTokensAdapter._isSemanticTokens(v)) {
            if (DocumentSemanticTokensAdapter._isCorrectSemanticTokens(v)) {
                return v;
            }
            return new types_impl_1.SemanticTokens(new Uint32Array(v.data), v.resultId);
        }
        else if (DocumentSemanticTokensAdapter._isSemanticTokensEdits(v)) {
            if (DocumentSemanticTokensAdapter._isCorrectSemanticTokensEdits(v)) {
                return v;
            }
            return new types_impl_1.SemanticTokensEdits(v.edits.map(edit => new types_impl_1.SemanticTokensEdit(edit.start, edit.deleteCount, edit.data ?
                new Uint32Array(edit.data) : edit.data)), v.resultId);
        }
        return v;
    }
    static _isSemanticTokens(v) {
        return v && !!(v.data);
    }
    static _isCorrectSemanticTokens(v) {
        return (v.data instanceof Uint32Array);
    }
    static _isSemanticTokensEdits(v) {
        return v && Array.isArray(v.edits);
    }
    static _isCorrectSemanticTokensEdits(v) {
        for (const edit of v.edits) {
            if (!(edit.data instanceof Uint32Array)) {
                return false;
            }
        }
        return true;
    }
    static _convertToEdits(previousResult, newResult) {
        if (!DocumentSemanticTokensAdapter._isSemanticTokens(newResult)) {
            return newResult;
        }
        if (!previousResult || !previousResult.tokens) {
            return newResult;
        }
        const oldData = previousResult.tokens;
        const oldLength = oldData.length;
        const newData = newResult.data;
        const newLength = newData.length;
        let commonPrefixLength = 0;
        const maxCommonPrefixLength = Math.min(oldLength, newLength);
        while (commonPrefixLength < maxCommonPrefixLength && oldData[commonPrefixLength] === newData[commonPrefixLength]) {
            commonPrefixLength++;
        }
        if (commonPrefixLength === oldLength && commonPrefixLength === newLength) {
            // complete overlap!
            return new types_impl_1.SemanticTokensEdits([], newResult.resultId);
        }
        let commonSuffixLength = 0;
        const maxCommonSuffixLength = maxCommonPrefixLength - commonPrefixLength;
        while (commonSuffixLength < maxCommonSuffixLength && oldData[oldLength - commonSuffixLength - 1] === newData[newLength - commonSuffixLength - 1]) {
            commonSuffixLength++;
        }
        return new types_impl_1.SemanticTokensEdits([{
                start: commonPrefixLength,
                deleteCount: (oldLength - commonPrefixLength - commonSuffixLength),
                data: newData.subarray(commonPrefixLength, newLength - commonSuffixLength)
            }], newResult.resultId);
    }
    _send(value, original) {
        if (DocumentSemanticTokensAdapter._isSemanticTokens(value)) {
            const myId = this._nextResultId++;
            this._previousResults.set(myId, new SemanticTokensPreviousResult(value.resultId, value.data));
            return (0, semantic_tokens_dto_1.encodeSemanticTokensDto)({
                id: myId,
                type: 'full',
                data: value.data
            });
        }
        if (DocumentSemanticTokensAdapter._isSemanticTokensEdits(value)) {
            const myId = this._nextResultId++;
            if (DocumentSemanticTokensAdapter._isSemanticTokens(original)) {
                // store the original
                this._previousResults.set(myId, new SemanticTokensPreviousResult(original.resultId, original.data));
            }
            else {
                this._previousResults.set(myId, new SemanticTokensPreviousResult(value.resultId));
            }
            return (0, semantic_tokens_dto_1.encodeSemanticTokensDto)({
                id: myId,
                type: 'delta',
                deltas: (value.edits || []).map(edit => ({ start: edit.start, deleteCount: edit.deleteCount, data: edit.data }))
            });
        }
        return null;
    }
}
exports.DocumentSemanticTokensAdapter = DocumentSemanticTokensAdapter;
class DocumentRangeSemanticTokensAdapter {
    constructor(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    async provideDocumentRangeSemanticTokens(resource, range, token) {
        const doc = this._documents.getDocument(resource);
        const value = await this._provider.provideDocumentRangeSemanticTokens(doc, (0, type_converters_1.toRange)(range), token);
        if (!value) {
            return null;
        }
        return this._send(value);
    }
    _send(value) {
        return (0, semantic_tokens_dto_1.encodeSemanticTokensDto)({
            id: 0,
            type: 'full',
            data: value.data
        });
    }
}
exports.DocumentRangeSemanticTokensAdapter = DocumentRangeSemanticTokensAdapter;
//# sourceMappingURL=semantic-highlighting.js.map