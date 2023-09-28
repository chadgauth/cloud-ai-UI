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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSXExtensionsSearchModel = exports.RECOMMENDED_QUERY = exports.INSTALLED_QUERY = exports.BUILTIN_QUERY = exports.VSXSearchMode = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
var VSXSearchMode;
(function (VSXSearchMode) {
    VSXSearchMode[VSXSearchMode["Initial"] = 0] = "Initial";
    VSXSearchMode[VSXSearchMode["None"] = 1] = "None";
    VSXSearchMode[VSXSearchMode["Search"] = 2] = "Search";
    VSXSearchMode[VSXSearchMode["Installed"] = 3] = "Installed";
    VSXSearchMode[VSXSearchMode["Builtin"] = 4] = "Builtin";
    VSXSearchMode[VSXSearchMode["Recommended"] = 5] = "Recommended";
})(VSXSearchMode = exports.VSXSearchMode || (exports.VSXSearchMode = {}));
exports.BUILTIN_QUERY = '@builtin';
exports.INSTALLED_QUERY = '@installed';
exports.RECOMMENDED_QUERY = '@recommended';
let VSXExtensionsSearchModel = class VSXExtensionsSearchModel {
    constructor() {
        this.onDidChangeQueryEmitter = new event_1.Emitter();
        this.onDidChangeQuery = this.onDidChangeQueryEmitter.event;
        this.specialQueries = new Map([
            [exports.BUILTIN_QUERY, VSXSearchMode.Builtin],
            [exports.INSTALLED_QUERY, VSXSearchMode.Installed],
            [exports.RECOMMENDED_QUERY, VSXSearchMode.Recommended],
        ]);
        this._query = '';
    }
    set query(query) {
        if (this._query === query) {
            return;
        }
        this._query = query;
        this.onDidChangeQueryEmitter.fire(this._query);
    }
    get query() {
        return this._query;
    }
    getModeForQuery() {
        var _a;
        return this.query
            ? (_a = this.specialQueries.get(this.query)) !== null && _a !== void 0 ? _a : VSXSearchMode.Search
            : VSXSearchMode.None;
    }
};
VSXExtensionsSearchModel = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsSearchModel);
exports.VSXExtensionsSearchModel = VSXExtensionsSearchModel;
//# sourceMappingURL=vsx-extensions-search-model.js.map