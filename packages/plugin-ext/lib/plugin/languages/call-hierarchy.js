"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.CallHierarchyAdapter = void 0;
const types = require("../types-impl");
const type_converters_1 = require("../type-converters");
class CallHierarchyAdapter {
    constructor(provider, documents) {
        this.provider = provider;
        this.documents = documents;
        this.sessionIds = 0;
        this.cache = new Map();
    }
    async provideRootDefinition(resource, position, token) {
        const documentData = this.documents.getDocumentData(resource);
        if (!documentData) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }
        const definition = await this.provider.prepareCallHierarchy(documentData.document, new types.Position(position.lineNumber, position.column), token);
        if (!definition) {
            return undefined;
        }
        const sessionId = (this.sessionIds++).toString(36);
        this.cache.set(sessionId, new Map());
        return Array.isArray(definition) ? definition.map(item => this.fromCallHierarchyItem(item, sessionId)) : [this.fromCallHierarchyItem(definition, sessionId)];
    }
    async provideCallers(definition, token) {
        const callers = await this.provider.provideCallHierarchyIncomingCalls(this.toCallHierarchyItem(definition), token);
        if (!callers) {
            return undefined;
        }
        return callers.map(item => this.fromCallHierarchyIncomingCall(item, definition._sessionId));
    }
    async provideCallees(definition, token) {
        const callees = await this.provider.provideCallHierarchyOutgoingCalls(this.toCallHierarchyItem(definition), token);
        if (!callees) {
            return undefined;
        }
        return callees.map(item => this.fromCallHierarchyOutgoingCall(item, definition._sessionId));
    }
    fromCallHierarchyItem(item, sessionId) {
        const sessionCache = this.cache.get(sessionId);
        const itemId = sessionCache.size.toString(36);
        const definition = {
            uri: item.uri,
            range: (0, type_converters_1.fromRange)(item.range),
            selectionRange: (0, type_converters_1.fromRange)(item.selectionRange),
            name: item.name,
            kind: type_converters_1.SymbolKind.fromSymbolKind(item.kind),
            tags: item.tags,
            _itemId: itemId,
            _sessionId: sessionId,
        };
        sessionCache.set(itemId, item);
        return definition;
    }
    toCallHierarchyItem(definition) {
        var _a;
        const cached = (_a = this.cache.get(definition._sessionId)) === null || _a === void 0 ? void 0 : _a.get(definition._itemId);
        if (!cached) {
            throw new Error(`Found no cached item corresponding to ${definition.name} in ${definition.uri.path} with ID ${definition.data}.`);
        }
        return cached;
    }
    fromCallHierarchyIncomingCall(caller, sessionId) {
        return {
            from: this.fromCallHierarchyItem(caller.from, sessionId),
            fromRanges: caller.fromRanges.map(r => (0, type_converters_1.fromRange)(r))
        };
    }
    fromCallHierarchyOutgoingCall(caller, sessionId) {
        return {
            to: this.fromCallHierarchyItem(caller.to, sessionId),
            fromRanges: caller.fromRanges.map(r => (0, type_converters_1.fromRange)(r)),
        };
    }
    releaseSession(session) {
        if (session !== undefined) {
            return Promise.resolve(this.cache.delete(session));
        }
        else {
            this.cache.clear();
            return Promise.resolve(true);
        }
    }
}
exports.CallHierarchyAdapter = CallHierarchyAdapter;
//# sourceMappingURL=call-hierarchy.js.map