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
exports.CodeActionAdapter = void 0;
const Converter = require("../type-converters");
const types_impl_1 = require("../types-impl");
const disposable_1 = require("@theia/core/lib/common/disposable");
const common_1 = require("@theia/core/lib/common");
class CodeActionAdapter {
    constructor(provider, document, diagnostics, pluginId, commands) {
        this.provider = provider;
        this.document = document;
        this.diagnostics = diagnostics;
        this.pluginId = pluginId;
        this.commands = commands;
        this.cache = new Map();
        this.disposables = new Map();
        this.cacheId = 0;
    }
    async provideCodeAction(resource, rangeOrSelection, context, token) {
        const document = this.document.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There are no document for ${resource}`));
        }
        const doc = document.document;
        const ran = CodeActionAdapter._isSelection(rangeOrSelection)
            ? Converter.toSelection(rangeOrSelection)
            : Converter.toRange(rangeOrSelection);
        const allDiagnostics = [];
        for (const diagnostic of this.diagnostics.getDiagnostics(resource)) {
            if (ran.intersection(diagnostic.range)) {
                allDiagnostics.push(diagnostic);
            }
        }
        const codeActionContext = {
            diagnostics: allDiagnostics,
            only: context.only ? new types_impl_1.CodeActionKind(context.only) : undefined,
            triggerKind: Converter.toCodeActionTriggerKind(context.trigger)
        };
        const commandsOrActions = await this.provider.provideCodeActions(doc, ran, codeActionContext, token);
        if (!Array.isArray(commandsOrActions) || commandsOrActions.length === 0) {
            return undefined;
        }
        const result = [];
        for (const candidate of commandsOrActions) {
            if (!candidate) {
                continue;
            }
            // Cache candidates and created commands.
            const nextCacheId = this.nextCacheId();
            const toDispose = new disposable_1.DisposableCollection();
            this.cache.set(nextCacheId, candidate);
            this.disposables.set(nextCacheId, toDispose);
            if (CodeActionAdapter._isCommand(candidate)) {
                result.push({
                    cacheId: nextCacheId,
                    title: candidate.title || '',
                    command: this.commands.converter.toSafeCommand(candidate, toDispose)
                });
            }
            else {
                if (codeActionContext.only) {
                    if (!candidate.kind) {
                        /* eslint-disable-next-line max-len */
                        console.warn(`${this.pluginId} - Code actions of kind '${codeActionContext.only.value}' requested but returned code action does not have a 'kind'. Code action will be dropped. Please set 'CodeAction.kind'.`);
                    }
                    else if (!codeActionContext.only.contains(candidate.kind)) {
                        /* eslint-disable-next-line max-len */
                        console.warn(`${this.pluginId} - Code actions of kind '${codeActionContext.only.value}' requested but returned code action is of kind '${candidate.kind.value}'. Code action will be dropped. Please check 'CodeActionContext.only' to only return requested code action.`);
                    }
                }
                result.push({
                    cacheId: nextCacheId,
                    title: candidate.title,
                    command: this.commands.converter.toSafeCommand(candidate.command, toDispose),
                    diagnostics: candidate.diagnostics && candidate.diagnostics.map(Converter.convertDiagnosticToMarkerData),
                    edit: candidate.edit && Converter.fromWorkspaceEdit(candidate.edit),
                    kind: candidate.kind && candidate.kind.value,
                    disabled: candidate.disabled,
                    isPreferred: candidate.isPreferred
                });
            }
        }
        return result;
    }
    async releaseCodeActions(cacheIds) {
        cacheIds.forEach(id => {
            this.cache.delete(id);
            const toDispose = this.disposables.get(id);
            if (toDispose) {
                toDispose.dispose();
                this.disposables.delete(id);
            }
        });
    }
    async resolveCodeAction(cacheId, token) {
        if (!this.provider.resolveCodeAction) {
            return undefined;
        }
        // Code actions are only resolved if they are not legacy commands and don't have an edit property
        // https://code.visualstudio.com/api/references/vscode-api#CodeActionProvider
        const candidate = this.cache.get(cacheId);
        if (!candidate || CodeActionAdapter._isCommand(candidate) || candidate.edit) {
            return undefined;
        }
        const resolved = await this.provider.resolveCodeAction(candidate, token);
        return (resolved === null || resolved === void 0 ? void 0 : resolved.edit) && Converter.fromWorkspaceEdit(resolved.edit);
    }
    nextCacheId() {
        return this.cacheId++;
    }
    static _isCommand(arg) {
        return (0, common_1.isObject)(arg) && typeof arg.command === 'string';
    }
    static _isSelection(arg) {
        return (0, common_1.isObject)(arg)
            && typeof arg.selectionStartLineNumber === 'number'
            && typeof arg.selectionStartColumn === 'number'
            && typeof arg.positionLineNumber === 'number'
            && typeof arg.positionColumn === 'number';
    }
}
exports.CodeActionAdapter = CodeActionAdapter;
//# sourceMappingURL=code-action.js.map