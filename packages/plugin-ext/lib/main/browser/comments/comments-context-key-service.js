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
exports.CommentsContextKeyService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const common_1 = require("@theia/core/lib/common");
let CommentsContextKeyService = class CommentsContextKeyService {
    constructor() {
        this.contextKeys = new Set();
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    get commentController() {
        return this._commentController;
    }
    get comment() {
        return this._comment;
    }
    get commentIsEmpty() {
        return this._commentIsEmpty;
    }
    init() {
        this.contextKeys.add('commentIsEmpty');
        this._commentController = this.contextKeyService.createKey('commentController', undefined);
        this._comment = this.contextKeyService.createKey('comment', undefined);
        this._commentIsEmpty = this.contextKeyService.createKey('commentIsEmpty', true);
        this.contextKeyService.onDidChange(event => {
            if (event.affects(this.contextKeys)) {
                this.onDidChangeEmitter.fire();
            }
        });
    }
    setExpression(expression) {
        var _a;
        (_a = this.contextKeyService.parseKeys(expression)) === null || _a === void 0 ? void 0 : _a.forEach(key => {
            this.contextKeys.add(key);
        });
    }
    match(expression) {
        return !expression || this.contextKeyService.match(expression);
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], CommentsContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommentsContextKeyService.prototype, "init", null);
CommentsContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], CommentsContextKeyService);
exports.CommentsContextKeyService = CommentsContextKeyService;
//# sourceMappingURL=comments-context-key-service.js.map