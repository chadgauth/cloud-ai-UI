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
exports.DebugWatchManager = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const storage_service_1 = require("@theia/core/lib/browser/storage-service");
let DebugWatchManager = class DebugWatchManager {
    constructor() {
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.idSequence = 0;
        this._watchExpressions = new Map();
    }
    get watchExpressions() {
        return this._watchExpressions.entries();
    }
    addWatchExpression(expression) {
        const id = this.idSequence++;
        this._watchExpressions.set(id, expression);
        this.onDidChangeEmitter.fire(undefined);
        return id;
    }
    removeWatchExpression(id) {
        if (!this._watchExpressions.has(id)) {
            return false;
        }
        this._watchExpressions.delete(id);
        this.onDidChangeEmitter.fire(undefined);
        return true;
    }
    removeWatchExpressions() {
        if (this._watchExpressions.size) {
            this.idSequence = 0;
            this._watchExpressions.clear();
            this.onDidChangeEmitter.fire(undefined);
        }
    }
    async load() {
        const data = await this.storage.getData(this.storageKey, {
            expressions: []
        });
        this.restoreState(data);
    }
    save() {
        const data = this.storeState();
        this.storage.setData(this.storageKey, data);
    }
    get storageKey() {
        return 'debug:watch';
    }
    storeState() {
        return {
            expressions: [...this._watchExpressions.values()]
        };
    }
    restoreState(state) {
        for (const expression of state.expressions) {
            this.addWatchExpression(expression);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(storage_service_1.StorageService),
    __metadata("design:type", Object)
], DebugWatchManager.prototype, "storage", void 0);
DebugWatchManager = __decorate([
    (0, inversify_1.injectable)()
], DebugWatchManager);
exports.DebugWatchManager = DebugWatchManager;
//# sourceMappingURL=debug-watch-manager.js.map