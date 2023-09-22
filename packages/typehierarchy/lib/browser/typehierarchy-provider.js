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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeHierarchyRegistry = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const disposable_1 = require("@theia/core/lib/common/disposable");
let TypeHierarchyRegistry = class TypeHierarchyRegistry {
    constructor() {
        this.providers = new Map();
    }
    async get(languageId) {
        return languageId ? this.providers.get(languageId) : undefined;
    }
    register(provider) {
        const { languageId } = provider;
        if (this.providers.has(languageId)) {
            throw new Error(`type hierarchy provider for '${languageId}' language is already registered`);
        }
        this.providers.set(languageId, provider);
        return disposable_1.Disposable.create(() => this.providers.delete(languageId));
    }
};
TypeHierarchyRegistry = __decorate([
    (0, inversify_1.injectable)()
], TypeHierarchyRegistry);
exports.TypeHierarchyRegistry = TypeHierarchyRegistry;
//# sourceMappingURL=typehierarchy-provider.js.map