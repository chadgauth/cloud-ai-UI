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
exports.VSXExtensionsSource = exports.VSXExtensionsSourceOptions = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const source_tree_1 = require("@theia/core/lib/browser/source-tree");
const vsx_extensions_model_1 = require("./vsx-extensions-model");
const debounce = require("@theia/core/shared/lodash.debounce");
let VSXExtensionsSourceOptions = class VSXExtensionsSourceOptions {
};
VSXExtensionsSourceOptions.INSTALLED = 'installed';
VSXExtensionsSourceOptions.BUILT_IN = 'builtin';
VSXExtensionsSourceOptions.SEARCH_RESULT = 'searchResult';
VSXExtensionsSourceOptions.RECOMMENDED = 'recommended';
VSXExtensionsSourceOptions = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsSourceOptions);
exports.VSXExtensionsSourceOptions = VSXExtensionsSourceOptions;
let VSXExtensionsSource = class VSXExtensionsSource extends source_tree_1.TreeSource {
    constructor() {
        super(...arguments);
        this.scheduleFireDidChange = debounce(() => this.fireDidChange(), 100, { leading: false, trailing: true });
    }
    init() {
        this.fireDidChange();
        this.toDispose.push(this.model.onDidChange(() => this.scheduleFireDidChange()));
    }
    getModel() {
        return this.model;
    }
    *getElements() {
        for (const id of this.doGetElements()) {
            const extension = this.model.getExtension(id);
            if (!extension) {
                continue;
            }
            if (this.options.id === VSXExtensionsSourceOptions.RECOMMENDED) {
                if (this.model.isInstalled(id)) {
                    continue;
                }
            }
            if (this.options.id === VSXExtensionsSourceOptions.BUILT_IN) {
                if (extension.builtin) {
                    yield extension;
                }
            }
            else if (!extension.builtin) {
                yield extension;
            }
        }
    }
    doGetElements() {
        if (this.options.id === VSXExtensionsSourceOptions.SEARCH_RESULT) {
            return this.model.searchResult;
        }
        if (this.options.id === VSXExtensionsSourceOptions.RECOMMENDED) {
            return this.model.recommended;
        }
        return this.model.installed;
    }
};
__decorate([
    (0, inversify_1.inject)(VSXExtensionsSourceOptions),
    __metadata("design:type", VSXExtensionsSourceOptions)
], VSXExtensionsSource.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_model_1.VSXExtensionsModel),
    __metadata("design:type", vsx_extensions_model_1.VSXExtensionsModel)
], VSXExtensionsSource.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsSource.prototype, "init", null);
VSXExtensionsSource = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsSource);
exports.VSXExtensionsSource = VSXExtensionsSource;
//# sourceMappingURL=vsx-extensions-source.js.map