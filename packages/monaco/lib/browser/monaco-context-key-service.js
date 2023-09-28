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
exports.MonacoContextKeyService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const contextKeyService_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService");
const contextkey_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey");
let MonacoContextKeyService = class MonacoContextKeyService {
    constructor() {
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.expressions = new Map();
    }
    init() {
        this.contextKeyService.onDidChangeContext(e => this.onDidChangeEmitter.fire({
            affects: keys => e.affectsSome(keys)
        }));
    }
    createKey(key, defaultValue) {
        return this.contextKeyService.createKey(key, defaultValue);
    }
    match(expression, context) {
        const parsed = this.parse(expression);
        if (parsed) {
            const ctx = this.identifyContext(context);
            if (!ctx) {
                return this.contextKeyService.contextMatchesRules(parsed);
            }
            return parsed.evaluate(ctx);
        }
        return true;
    }
    identifyContext(callersContext, service = this.contextKeyService) {
        var _a;
        if (callersContext && 'getValue' in callersContext) {
            return callersContext;
        }
        else if (this.activeContext && 'getValue' in this.activeContext) {
            return this.activeContext;
        }
        const browserContext = (_a = callersContext !== null && callersContext !== void 0 ? callersContext : this.activeContext) !== null && _a !== void 0 ? _a : (document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
        if (browserContext) {
            return service.getContext(browserContext);
        }
        return undefined;
    }
    parse(when) {
        let expression = this.expressions.get(when);
        if (!expression) {
            expression = contextkey_1.ContextKeyExpr.deserialize(when);
            if (expression) {
                this.expressions.set(when, expression);
            }
        }
        return expression;
    }
    parseKeys(expression) {
        const expr = contextkey_1.ContextKeyExpr.deserialize(expression);
        return expr ? new Set(expr.keys()) : expr;
    }
    with(values, callback) {
        const oldActive = this.activeContext;
        const id = this.contextKeyService.createChildContext();
        const child = this.contextKeyService.getContextValuesContainer(id);
        for (const [key, value] of Object.entries(values)) {
            child.setValue(key, value);
        }
        this.activeContext = child;
        try {
            return callback();
        }
        finally {
            this.activeContext = oldActive;
            this.contextKeyService.disposeContext(id);
        }
    }
    createScoped(target) {
        const scoped = this.contextKeyService.createScoped(target);
        if (scoped instanceof contextKeyService_1.AbstractContextKeyService) {
            return scoped;
        }
        return this;
    }
    createOverlay(overlay) {
        const delegate = this.contextKeyService.createOverlay(overlay);
        return {
            match: (expression, context) => {
                const parsed = this.parse(expression);
                if (parsed) {
                    const ctx = this.identifyContext(context, delegate);
                    if (!ctx) {
                        return delegate.contextMatchesRules(parsed);
                    }
                    return parsed.evaluate(ctx);
                }
                return true;
            },
            dispose: () => delegate.dispose(),
        };
    }
    setContext(key, value) {
        this.contextKeyService.setContext(key, value);
    }
    dispose() {
        this.activeContext = undefined;
        this.onDidChangeEmitter.dispose();
        this.contextKeyService.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(contextKeyService_1.ContextKeyService),
    __metadata("design:type", contextKeyService_1.ContextKeyService)
], MonacoContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoContextKeyService.prototype, "init", null);
MonacoContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], MonacoContextKeyService);
exports.MonacoContextKeyService = MonacoContextKeyService;
//# sourceMappingURL=monaco-context-key-service.js.map