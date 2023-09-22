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
exports.SearchInWorkspaceContextKeyService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
let SearchInWorkspaceContextKeyService = class SearchInWorkspaceContextKeyService {
    get searchViewletVisible() {
        return this._searchViewletVisible;
    }
    get searchViewletFocus() {
        return this._searchViewletFocus;
    }
    setSearchInputBoxFocus(searchInputBoxFocus) {
        this.searchInputBoxFocus.set(searchInputBoxFocus);
        this.updateInputBoxFocus();
    }
    setReplaceInputBoxFocus(replaceInputBoxFocus) {
        this.replaceInputBoxFocus.set(replaceInputBoxFocus);
        this.updateInputBoxFocus();
    }
    setPatternIncludesInputBoxFocus(patternIncludesInputBoxFocus) {
        this.patternIncludesInputBoxFocus.set(patternIncludesInputBoxFocus);
        this.updateInputBoxFocus();
    }
    setPatternExcludesInputBoxFocus(patternExcludesInputBoxFocus) {
        this.patternExcludesInputBoxFocus.set(patternExcludesInputBoxFocus);
        this.updateInputBoxFocus();
    }
    updateInputBoxFocus() {
        this.inputBoxFocus.set(this.searchInputBoxFocus.get() ||
            this.replaceInputBoxFocus.get() ||
            this.patternIncludesInputBoxFocus.get() ||
            this.patternExcludesInputBoxFocus.get());
    }
    get replaceActive() {
        return this._replaceActive;
    }
    get hasSearchResult() {
        return this._hasSearchResult;
    }
    init() {
        this._searchViewletVisible = this.contextKeyService.createKey('searchViewletVisible', false);
        this._searchViewletFocus = this.contextKeyService.createKey('searchViewletFocus', false);
        this.inputBoxFocus = this.contextKeyService.createKey('inputBoxFocus', false);
        this.searchInputBoxFocus = this.contextKeyService.createKey('searchInputBoxFocus', false);
        this.replaceInputBoxFocus = this.contextKeyService.createKey('replaceInputBoxFocus', false);
        this.patternIncludesInputBoxFocus = this.contextKeyService.createKey('patternIncludesInputBoxFocus', false);
        this.patternExcludesInputBoxFocus = this.contextKeyService.createKey('patternExcludesInputBoxFocus', false);
        this._replaceActive = this.contextKeyService.createKey('replaceActive', false);
        this._hasSearchResult = this.contextKeyService.createKey('hasSearchResult', false);
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], SearchInWorkspaceContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchInWorkspaceContextKeyService.prototype, "init", null);
SearchInWorkspaceContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], SearchInWorkspaceContextKeyService);
exports.SearchInWorkspaceContextKeyService = SearchInWorkspaceContextKeyService;
//# sourceMappingURL=search-in-workspace-context-key-service.js.map