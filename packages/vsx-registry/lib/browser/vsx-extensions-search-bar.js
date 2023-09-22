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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSXExtensionsSearchBar = void 0;
const React = require("@theia/core/shared/react");
const inversify_1 = require("@theia/core/shared/inversify");
const widgets_1 = require("@theia/core/lib/browser/widgets");
const vsx_extensions_search_model_1 = require("./vsx-extensions-search-model");
const nls_1 = require("@theia/core/lib/common/nls");
let VSXExtensionsSearchBar = class VSXExtensionsSearchBar extends widgets_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.updateQuery = (e) => this.model.query = e.target.value;
    }
    init() {
        this.id = 'vsx-extensions-search-bar';
        this.addClass('theia-vsx-extensions-search-bar');
        this.model.onDidChangeQuery((query) => this.updateSearchTerm(query));
    }
    render() {
        return React.createElement("input", { type: 'text', ref: input => this.input = input || undefined, defaultValue: this.model.query, spellCheck: false, className: 'theia-input', placeholder: nls_1.nls.localize('theia/vsx-registry/searchPlaceholder', 'Search Extensions in {0}', 'Open VSX Registry'), onChange: this.updateQuery });
    }
    updateSearchTerm(term) {
        if (this.input) {
            this.input.value = term;
        }
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        if (this.input) {
            this.input.focus();
        }
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.update();
    }
};
__decorate([
    (0, inversify_1.inject)(vsx_extensions_search_model_1.VSXExtensionsSearchModel),
    __metadata("design:type", vsx_extensions_search_model_1.VSXExtensionsSearchModel)
], VSXExtensionsSearchBar.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsSearchBar.prototype, "init", null);
VSXExtensionsSearchBar = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsSearchBar);
exports.VSXExtensionsSearchBar = VSXExtensionsSearchBar;
//# sourceMappingURL=vsx-extensions-search-bar.js.map