"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.preferenceTransactionFactoryCreator = exports.PreferenceTransactionFactory = exports.PreferenceTransaction = exports.PreferenceTransactionPreludeProvider = exports.PreferenceContext = exports.Transaction = void 0;
const core_1 = require("@theia/core");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const inversify_1 = require("@theia/core/shared/inversify");
const preference_scope_1 = require("@theia/core/lib/common/preferences/preference-scope");
const uri_1 = require("@theia/core/lib/common/uri");
const async_mutex_1 = require("async-mutex");
const monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
const monaco_jsonc_editor_1 = require("./monaco-jsonc-editor");
const editor_manager_1 = require("@theia/editor/lib/browser/editor-manager");
let Transaction = 
/**
 * Represents a batch of interactions with an underlying resource.
 */
class Transaction {
    constructor() {
        this._open = true;
        this._result = new promise_util_1.Deferred();
        /**
         * The transaction will self-dispose when the queue is empty, once at least one action has been processed.
         */
        this.queue = new async_mutex_1.Mutex(new core_1.CancellationError());
        this.onWillConcludeEmitter = new core_1.Emitter();
        this.status = new promise_util_1.Deferred();
        /**
         * Whether any actions have been added to the transaction.
         * The Transaction will not self-dispose until at least one action has been performed.
         */
        this.inUse = false;
    }
    /**
     * Whether the transaction is still accepting new interactions.
     * Enqueueing an action when the Transaction is no longer open will throw an error.
     */
    get open() {
        return this._open;
    }
    /**
     * The status of the transaction when complete.
     */
    get result() {
        return this._result.promise;
    }
    /**
     * An event fired when the transaction is wrapping up.
     * Consumers can call `waitUntil` on the event to delay the resolution of the `result` Promise.
     */
    get onWillConclude() {
        return this.onWillConcludeEmitter.event;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const release = await this.queue.acquire();
        try {
            const status = await this.setUp();
            this.status.resolve(status);
        }
        catch {
            this.dispose();
        }
        finally {
            release();
        }
    }
    async waitFor(delay, disposeIfRejected) {
        try {
            await this.queue.runExclusive(() => delay);
        }
        catch {
            if (disposeIfRejected) {
                this.dispose();
            }
        }
    }
    /**
     * @returns a promise reflecting the result of performing an action. Typically the promise will not resolve until the whole transaction is complete.
     */
    async enqueueAction(...args) {
        if (this._open) {
            let release;
            try {
                release = await this.queue.acquire();
                if (!this.inUse) {
                    this.inUse = true;
                    this.disposeWhenDone();
                }
                return this.act(...args);
            }
            catch (e) {
                if (e instanceof core_1.CancellationError) {
                    throw e;
                }
                return false;
            }
            finally {
                release === null || release === void 0 ? void 0 : release();
            }
        }
        else {
            throw new Error('Transaction used after disposal.');
        }
    }
    disposeWhenDone() {
        // Due to properties of the micro task system, it's possible for something to have been enqueued between
        // the resolution of the waitForUnlock() promise and the the time this code runs, so we have to check.
        this.queue.waitForUnlock().then(() => {
            if (!this.queue.isLocked()) {
                this.dispose();
            }
            else {
                this.disposeWhenDone();
            }
        });
    }
    async conclude() {
        if (this._open) {
            try {
                this._open = false;
                this.queue.cancel();
                const result = await this.tearDown();
                const status = this.status.state === 'unresolved' || this.status.state === 'rejected' ? false : await this.status.promise;
                await core_1.WaitUntilEvent.fire(this.onWillConcludeEmitter, { status });
                this.onWillConcludeEmitter.dispose();
                this._result.resolve(result);
            }
            catch {
                this._result.resolve(false);
            }
        }
    }
    dispose() {
        this.conclude();
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Transaction.prototype, "init", null);
Transaction = __decorate([
    (0, inversify_1.injectable)()
    /**
     * Represents a batch of interactions with an underlying resource.
     */
], Transaction);
exports.Transaction = Transaction;
exports.PreferenceContext = Symbol('PreferenceContext');
exports.PreferenceTransactionPreludeProvider = Symbol('PreferenceTransactionPreludeProvider');
let PreferenceTransaction = class PreferenceTransaction extends Transaction {
    async doInit() {
        var _a;
        this.waitFor((_a = this.prelude) === null || _a === void 0 ? void 0 : _a.call(this));
        await super.doInit();
    }
    async setUp() {
        const reference = await this.textModelService.createModelReference(this.context.getConfigUri());
        if (this._open) {
            this.reference = reference;
        }
        else {
            reference.dispose();
            return false;
        }
        if (reference.object.dirty) {
            const shouldContinue = await this.handleDirtyEditor();
            if (!shouldContinue) {
                this.dispose();
                return false;
            }
        }
        return true;
    }
    /**
     * @returns whether the setting operation in progress, and any others started in the meantime, should continue.
     */
    async handleDirtyEditor() {
        var _a;
        const saveAndRetry = core_1.nls.localizeByDefault('Save and Retry');
        const open = core_1.nls.localizeByDefault('Open File');
        const msg = await this.messageService.error(
        // eslint-disable-next-line @theia/localization-check
        core_1.nls.localizeByDefault('Unable to write into {0} settings because the file has unsaved changes. Please save the {0} settings file first and then try again.', core_1.nls.localizeByDefault(preference_scope_1.PreferenceScope[this.context.getScope()].toLocaleLowerCase())), saveAndRetry, open);
        if ((_a = this.reference) === null || _a === void 0 ? void 0 : _a.object) {
            if (msg === open) {
                this.editorManager.open(new uri_1.default(this.reference.object.uri));
            }
            else if (msg === saveAndRetry) {
                await this.reference.object.save();
                return true;
            }
        }
        return false;
    }
    async act(key, path, value) {
        var _a;
        const model = (_a = this.reference) === null || _a === void 0 ? void 0 : _a.object;
        try {
            if (model) {
                await this.jsoncEditor.setValue(model, path, value);
                return this.result;
            }
            return false;
        }
        catch (e) {
            const message = `Failed to update the value of '${key}' in '${this.context.getConfigUri()}'.`;
            this.messageService.error(`${message} Please check if it is corrupted.`);
            console.error(`${message}`, e);
            return false;
        }
    }
    async tearDown() {
        var _a, _b;
        try {
            const model = (_a = this.reference) === null || _a === void 0 ? void 0 : _a.object;
            if (model) {
                if (this.status.state === 'resolved' && await this.status.promise) {
                    await model.save();
                    return true;
                }
            }
            return false;
        }
        finally {
            (_b = this.reference) === null || _b === void 0 ? void 0 : _b.dispose();
            this.reference = undefined;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(exports.PreferenceContext),
    __metadata("design:type", Object)
], PreferenceTransaction.prototype, "context", void 0);
__decorate([
    (0, inversify_1.inject)(exports.PreferenceTransactionPreludeProvider),
    __metadata("design:type", Function)
], PreferenceTransaction.prototype, "prelude", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], PreferenceTransaction.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_jsonc_editor_1.MonacoJSONCEditor),
    __metadata("design:type", monaco_jsonc_editor_1.MonacoJSONCEditor)
], PreferenceTransaction.prototype, "jsoncEditor", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], PreferenceTransaction.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], PreferenceTransaction.prototype, "editorManager", void 0);
PreferenceTransaction = __decorate([
    (0, inversify_1.injectable)()
], PreferenceTransaction);
exports.PreferenceTransaction = PreferenceTransaction;
exports.PreferenceTransactionFactory = Symbol('PreferenceTransactionFactory');
const preferenceTransactionFactoryCreator = ({ container }) => (context, waitFor) => {
    const child = container.createChild();
    child.bind(exports.PreferenceContext).toConstantValue(context);
    child.bind(exports.PreferenceTransactionPreludeProvider).toConstantValue(() => waitFor);
    return child.get(PreferenceTransaction);
};
exports.preferenceTransactionFactoryCreator = preferenceTransactionFactoryCreator;
//# sourceMappingURL=preference-transaction-manager.js.map