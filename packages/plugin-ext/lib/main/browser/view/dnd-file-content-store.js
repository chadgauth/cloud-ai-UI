"use strict";
// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
var DnDFileContentStore_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnDFileContentStore = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
let DnDFileContentStore = DnDFileContentStore_1 = class DnDFileContentStore {
    constructor() {
        this.files = new Map();
    }
    addFile(f) {
        const id = (DnDFileContentStore_1.id++).toString();
        this.files.set(id, f);
        return id;
    }
    removeFile(id) {
        return this.files.delete(id);
    }
    getFile(id) {
        const file = this.files.get(id);
        if (file) {
            return file;
        }
        throw new Error(`File with id ${id} not found in dnd operation`);
    }
};
DnDFileContentStore.id = 0;
DnDFileContentStore = DnDFileContentStore_1 = __decorate([
    (0, inversify_1.injectable)()
], DnDFileContentStore);
exports.DnDFileContentStore = DnDFileContentStore;
//# sourceMappingURL=dnd-file-content-store.js.map