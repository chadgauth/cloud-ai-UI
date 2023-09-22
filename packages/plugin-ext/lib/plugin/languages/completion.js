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
exports.CompletionAdapter = void 0;
const types_impl_1 = require("../types-impl");
const Converter = require("../type-converters");
const plugin_api_rpc_model_1 = require("../../common/plugin-api-rpc-model");
const disposable_1 = require("@theia/core/lib/common/disposable");
class CompletionAdapter {
    constructor(delegate, documents, commands) {
        this.delegate = delegate;
        this.documents = documents;
        this.commands = commands;
        this.cacheId = 0;
        this.cache = new Map();
        this.disposables = new Map();
    }
    provideCompletionItems(resource, position, context, token) {
        const document = this.documents.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There are no document for  ${resource}`));
        }
        const doc = document.document;
        const pos = Converter.toPosition(position);
        // The default insert/replace ranges. It's important to compute them
        // before asynchronously asking the provider for its results. See
        // https://github.com/microsoft/vscode/issues/83400#issuecomment-546851421
        const replacing = doc.getWordRangeAtPosition(pos) || new types_impl_1.Range(pos, pos);
        const inserting = replacing.with({ end: pos });
        return Promise.resolve(this.delegate.provideCompletionItems(doc, pos, token, context)).then(value => {
            const id = this.cacheId++;
            const toDispose = new disposable_1.DisposableCollection();
            this.disposables.set(id, toDispose);
            const result = {
                id,
                completions: [],
                defaultRange: {
                    insert: Converter.fromRange(inserting),
                    replace: Converter.fromRange(replacing)
                }
            };
            let list;
            if (!value) {
                return undefined;
            }
            else if (Array.isArray(value)) {
                list = new types_impl_1.CompletionList(value);
            }
            else {
                list = value;
                result.incomplete = list.isIncomplete;
            }
            for (let i = 0; i < list.items.length; i++) {
                const suggestion = this.convertCompletionItem(list.items[i], i, id, inserting, replacing);
                if (suggestion) {
                    result.completions.push(suggestion);
                }
            }
            this.cache.set(id, list.items);
            return result;
        });
    }
    async resolveCompletionItem(chainedId, token) {
        var _a;
        const [parentId, id] = chainedId;
        if (typeof this.delegate.resolveCompletionItem !== 'function') {
            return undefined;
        }
        const item = (_a = this.cache.get(parentId)) === null || _a === void 0 ? void 0 : _a[id];
        if (!item) {
            return undefined;
        }
        const resolvedItem = await this.delegate.resolveCompletionItem(item, token);
        if (!resolvedItem) {
            return undefined;
        }
        return this.convertCompletionItem(resolvedItem, id, parentId);
    }
    async releaseCompletionItems(id) {
        this.cache.delete(id);
        const toDispose = this.disposables.get(id);
        if (toDispose) {
            toDispose.dispose();
            this.disposables.delete(id);
        }
    }
    convertCompletionItem(item, id, parentId, defaultInserting, defaultReplacing) {
        var _a, _b;
        const itemLabel = typeof item.label === 'string' ? item.label : item.label.label;
        if (itemLabel.length === 0) {
            console.warn('Invalid Completion Item -> must have at least a label');
            return undefined;
        }
        const toDispose = this.disposables.get(parentId);
        if (!toDispose) {
            throw Error('DisposableCollection is missing...');
        }
        let insertText = itemLabel;
        let insertTextRules = item.keepWhitespace ? plugin_api_rpc_model_1.CompletionItemInsertTextRule.KeepWhitespace : 0;
        if (item.textEdit) {
            insertText = item.textEdit.newText;
        }
        else if (typeof item.insertText === 'string') {
            insertText = item.insertText;
        }
        else if (item.insertText instanceof types_impl_1.SnippetString) {
            insertText = item.insertText.value;
            insertTextRules |= plugin_api_rpc_model_1.CompletionItemInsertTextRule.InsertAsSnippet;
        }
        let range;
        const itemRange = ((_a = item.textEdit) === null || _a === void 0 ? void 0 : _a.range) || item.range;
        if (types_impl_1.Range.isRange(itemRange)) {
            range = Converter.fromRange(itemRange);
        }
        else if (itemRange && (!(defaultInserting === null || defaultInserting === void 0 ? void 0 : defaultInserting.isEqual(itemRange.inserting)) || !(defaultReplacing === null || defaultReplacing === void 0 ? void 0 : defaultReplacing.isEqual(itemRange.replacing)))) {
            range = {
                insert: Converter.fromRange(itemRange.inserting),
                replace: Converter.fromRange(itemRange.replacing)
            };
        }
        const tags = (!!((_b = item.tags) === null || _b === void 0 ? void 0 : _b.length) || item.deprecated === true)
            ? [types_impl_1.CompletionItemTag.Deprecated]
            : undefined;
        const documentation = typeof item.documentation !== 'undefined'
            ? Converter.fromMarkdown(item.documentation)
            : undefined;
        return {
            id,
            parentId,
            label: item.label,
            kind: Converter.fromCompletionItemKind(item.kind),
            detail: item.detail,
            documentation,
            filterText: item.filterText,
            sortText: item.sortText,
            preselect: item.preselect,
            insertText,
            insertTextRules,
            range,
            additionalTextEdits: item.additionalTextEdits && item.additionalTextEdits.map(Converter.fromTextEdit),
            command: this.commands.converter.toSafeCommand(item.command, toDispose),
            commitCharacters: item.commitCharacters,
            tags
        };
    }
    static hasResolveSupport(provider) {
        return typeof provider.resolveCompletionItem === 'function';
    }
}
exports.CompletionAdapter = CompletionAdapter;
//# sourceMappingURL=completion.js.map