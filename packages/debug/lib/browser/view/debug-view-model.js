"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.DebugViewModel = void 0;
const p_debounce_1 = require("p-debounce");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const debug_session_1 = require("../debug-session");
const debug_session_manager_1 = require("../debug-session-manager");
const debug_watch_expression_1 = require("./debug-watch-expression");
const debug_watch_manager_1 = require("../debug-watch-manager");
let DebugViewModel = class DebugViewModel {
    constructor() {
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onDidChangeBreakpointsEmitter = new common_1.Emitter();
        this.onDidChangeBreakpoints = this.onDidChangeBreakpointsEmitter.event;
        this._watchExpressions = new Map();
        this.onDidChangeWatchExpressionsEmitter = new common_1.Emitter();
        this.onDidChangeWatchExpressions = this.onDidChangeWatchExpressionsEmitter.event;
        this.toDispose = new common_1.DisposableCollection(this.onDidChangeEmitter, this.onDidChangeBreakpointsEmitter, this.onDidChangeWatchExpressionsEmitter);
        this.refreshWatchExpressionsQueue = Promise.resolve();
        this.refreshWatchExpressions = (0, p_debounce_1.default)(() => {
            this.refreshWatchExpressionsQueue = this.refreshWatchExpressionsQueue.then(async () => {
                try {
                    for (const watchExpression of this.watchExpressions) {
                        await watchExpression.evaluate();
                    }
                }
                catch (e) {
                    console.error('Failed to refresh watch expressions: ', e);
                }
            });
        }, 50);
    }
    fireDidChange() {
        this.refreshWatchExpressions();
        this.onDidChangeEmitter.fire(undefined);
    }
    fireDidChangeBreakpoints(uri) {
        this.onDidChangeBreakpointsEmitter.fire(uri);
    }
    fireDidChangeWatchExpressions() {
        this.onDidChangeWatchExpressionsEmitter.fire(undefined);
    }
    get sessions() {
        return this.manager.sessions[Symbol.iterator]();
    }
    get sessionCount() {
        return this.manager.sessions.length;
    }
    get session() {
        return this.currentSession;
    }
    get id() {
        return this.session && this.session.id || '-1';
    }
    get label() {
        return this.session && this.session.label || 'Unknown Session';
    }
    init() {
        this.toDispose.push(this.manager.onDidChangeActiveDebugSession(() => {
            this.fireDidChange();
        }));
        this.toDispose.push(this.manager.onDidChange(current => {
            if (current === this.currentSession) {
                this.fireDidChange();
            }
        }));
        this.toDispose.push(this.manager.onDidChangeBreakpoints(({ session, uri }) => {
            if (!session || session === this.currentSession) {
                this.fireDidChangeBreakpoints(uri);
            }
        }));
        this.updateWatchExpressions();
        this.toDispose.push(this.watch.onDidChange(() => this.updateWatchExpressions()));
    }
    dispose() {
        this.toDispose.dispose();
    }
    get currentSession() {
        const { currentSession } = this.manager;
        return currentSession;
    }
    set currentSession(currentSession) {
        this.manager.currentSession = currentSession;
    }
    get state() {
        const { currentSession } = this;
        return currentSession && currentSession.state || debug_session_1.DebugState.Inactive;
    }
    get currentThread() {
        const { currentSession } = this;
        return currentSession && currentSession.currentThread;
    }
    get currentFrame() {
        const { currentThread } = this;
        return currentThread && currentThread.currentFrame;
    }
    get breakpoints() {
        return this.manager.getBreakpoints(this.currentSession);
    }
    get functionBreakpoints() {
        return this.manager.getFunctionBreakpoints(this.currentSession);
    }
    get instructionBreakpoints() {
        return this.manager.getInstructionBreakpoints(this.currentSession);
    }
    async start() {
        const { session } = this;
        if (!session) {
            return;
        }
        const newSession = await this.manager.start(session.options);
        if (newSession) {
            this.fireDidChange();
        }
    }
    async restart() {
        const { session } = this;
        if (!session) {
            return;
        }
        await this.manager.restartSession(session);
        this.fireDidChange();
    }
    async terminate() {
        this.manager.terminateSession();
    }
    get watchExpressions() {
        return this._watchExpressions.values();
    }
    async addWatchExpression(expression = '') {
        const watchExpression = new debug_watch_expression_1.DebugWatchExpression({
            id: Number.MAX_SAFE_INTEGER,
            expression,
            session: () => this.currentSession,
            remove: () => this.removeWatchExpression(watchExpression),
            onDidChange: () => { },
        });
        await watchExpression.open();
        if (!watchExpression.expression) {
            return undefined;
        }
        const id = this.watch.addWatchExpression(watchExpression.expression);
        return this._watchExpressions.get(id);
    }
    removeWatchExpressions() {
        this.watch.removeWatchExpressions();
    }
    removeWatchExpression(expression) {
        this.watch.removeWatchExpression(expression.id);
    }
    updateWatchExpressions() {
        let added = false;
        const toRemove = new Set(this._watchExpressions.keys());
        for (const [id, expression] of this.watch.watchExpressions) {
            toRemove.delete(id);
            if (!this._watchExpressions.has(id)) {
                added = true;
                const watchExpression = new debug_watch_expression_1.DebugWatchExpression({
                    id,
                    expression,
                    session: () => this.currentSession,
                    remove: () => this.removeWatchExpression(watchExpression),
                    onDidChange: () => this.fireDidChangeWatchExpressions()
                });
                this._watchExpressions.set(id, watchExpression);
                watchExpression.evaluate();
            }
        }
        for (const id of toRemove) {
            this._watchExpressions.delete(id);
        }
        if (added || toRemove.size) {
            this.fireDidChangeWatchExpressions();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugViewModel.prototype, "manager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_watch_manager_1.DebugWatchManager),
    __metadata("design:type", debug_watch_manager_1.DebugWatchManager)
], DebugViewModel.prototype, "watch", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugViewModel.prototype, "init", null);
DebugViewModel = __decorate([
    (0, inversify_1.injectable)()
], DebugViewModel);
exports.DebugViewModel = DebugViewModel;
//# sourceMappingURL=debug-view-model.js.map