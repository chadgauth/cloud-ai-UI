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
exports.NotificationManager = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const objects_1 = require("@theia/core/lib/common/objects");
const core_1 = require("@theia/core");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const ts_md5_1 = require("ts-md5");
const throttle = require("@theia/core/shared/lodash.throttle");
const notification_preferences_1 = require("./notification-preferences");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const browser_1 = require("@theia/core/lib/browser");
const uri_1 = require("@theia/core/lib/common/uri");
const notification_content_renderer_1 = require("./notification-content-renderer");
let NotificationManager = class NotificationManager extends common_1.MessageClient {
    constructor() {
        super(...arguments);
        this.onUpdatedEmitter = new core_1.Emitter();
        this.onUpdated = this.onUpdatedEmitter.event;
        this.fireUpdatedEvent = throttle(() => {
            const notifications = (0, objects_1.deepClone)(Array.from(this.notifications.values()).filter((notification) => notification.message));
            const toasts = (0, objects_1.deepClone)(Array.from(this.toasts.values()).filter((toast) => toast.message));
            const visibilityState = this.visibilityState;
            this.onUpdatedEmitter.fire({ notifications, toasts, visibilityState });
        }, 250, { leading: true, trailing: true });
        this.deferredResults = new Map();
        this.notifications = new Map();
        this.toasts = new Map();
        this.visibilityState = 'hidden';
        this.hideTimeouts = new Map();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.notificationToastsVisibleKey = this.contextKeyService.createKey('notificationToastsVisible', false);
        this.notificationCenterVisibleKey = this.contextKeyService.createKey('notificationCenterVisible', false);
        this.notificationsVisible = this.contextKeyService.createKey('notificationsVisible', false);
    }
    updateContextKeys() {
        this.notificationToastsVisibleKey.set(this.toastsVisible);
        this.notificationCenterVisibleKey.set(this.centerVisible);
        this.notificationsVisible.set(this.toastsVisible || this.centerVisible);
    }
    get toastsVisible() {
        return this.visibilityState === 'toasts';
    }
    get centerVisible() {
        return this.visibilityState === 'center';
    }
    setVisibilityState(newState) {
        const changed = this.visibilityState !== newState;
        this.visibilityState = newState;
        if (changed) {
            this.fireUpdatedEvent();
            this.updateContextKeys();
        }
    }
    hideCenter() {
        this.setVisibilityState('hidden');
    }
    showCenter() {
        this.setVisibilityState('center');
    }
    toggleCenter() {
        this.setVisibilityState(this.centerVisible ? 'hidden' : 'center');
    }
    accept(notification, action) {
        const messageId = this.getId(notification);
        if (!messageId) {
            return;
        }
        this.notifications.delete(messageId);
        this.toasts.delete(messageId);
        const result = this.deferredResults.get(messageId);
        if (!result) {
            return;
        }
        this.deferredResults.delete(messageId);
        if ((this.centerVisible && !this.notifications.size) || (this.toastsVisible && !this.toasts.size)) {
            this.setVisibilityState('hidden');
        }
        result.resolve(action);
        this.fireUpdatedEvent();
    }
    find(notification) {
        return typeof notification === 'string' ? this.notifications.get(notification) : notification;
    }
    getId(notification) {
        return typeof notification === 'string' ? notification : notification.messageId;
    }
    hide() {
        if (this.toastsVisible) {
            this.toasts.clear();
        }
        this.setVisibilityState('hidden');
    }
    clearAll() {
        this.setVisibilityState('hidden');
        Array.from(this.notifications.values()).forEach(n => this.clear(n));
    }
    clear(notification) {
        this.accept(notification, undefined);
    }
    toggleExpansion(notificationId) {
        const notification = this.find(notificationId);
        if (!notification) {
            return;
        }
        notification.collapsed = !notification.collapsed;
        this.fireUpdatedEvent();
    }
    showMessage(plainMessage) {
        const messageId = this.getMessageId(plainMessage);
        let notification = this.notifications.get(messageId);
        if (!notification) {
            const message = this.contentRenderer.renderMessage(plainMessage.text);
            const type = this.toNotificationType(plainMessage.type);
            const actions = Array.from(new Set(plainMessage.actions));
            const source = plainMessage.source;
            const expandable = this.isExpandable(message, source, actions);
            const collapsed = expandable;
            notification = { messageId, message, type, actions, expandable, collapsed };
            this.notifications.set(messageId, notification);
        }
        const result = this.deferredResults.get(messageId) || new promise_util_1.Deferred();
        this.deferredResults.set(messageId, result);
        if (!this.centerVisible) {
            this.toasts.delete(messageId);
            this.toasts.set(messageId, notification);
            this.startHideTimeout(messageId, this.getTimeout(plainMessage));
            this.setVisibilityState('toasts');
        }
        this.fireUpdatedEvent();
        return result.promise;
    }
    startHideTimeout(messageId, timeout) {
        if (timeout > 0) {
            this.hideTimeouts.set(messageId, window.setTimeout(() => {
                this.hideToast(messageId);
            }, timeout));
        }
    }
    hideToast(messageId) {
        this.toasts.delete(messageId);
        if (this.toastsVisible && !this.toasts.size) {
            this.setVisibilityState('hidden');
        }
        else {
            this.fireUpdatedEvent();
        }
    }
    getTimeout(plainMessage) {
        if (plainMessage.actions && plainMessage.actions.length > 0) {
            // Ignore the timeout if at least one action is set, and we wait for user interaction.
            return 0;
        }
        return plainMessage.options && plainMessage.options.timeout || this.preferences['notification.timeout'];
    }
    isExpandable(message, source, actions) {
        if (!actions.length && source) {
            return true;
        }
        return message.length > 500;
    }
    toNotificationType(type) {
        switch (type) {
            case common_1.MessageType.Error:
                return 'error';
            case common_1.MessageType.Warning:
                return 'warning';
            case common_1.MessageType.Progress:
                return 'progress';
            default:
                return 'info';
        }
    }
    getMessageId(m) {
        return String(ts_md5_1.Md5.hashStr(`[${m.type}] ${m.text} : ${(m.actions || []).join(' | ')};`));
    }
    async showProgress(messageId, plainMessage, cancellationToken) {
        let notification = this.notifications.get(messageId);
        if (!notification) {
            const message = this.contentRenderer.renderMessage(plainMessage.text);
            const type = this.toNotificationType(plainMessage.type);
            const actions = Array.from(new Set(plainMessage.actions));
            const source = plainMessage.source;
            const expandable = this.isExpandable(message, source, actions);
            const collapsed = expandable;
            notification = { messageId, message, type, actions, expandable, collapsed };
            this.notifications.set(messageId, notification);
            notification.progress = 0;
            cancellationToken.onCancellationRequested(() => {
                this.accept(messageId, common_1.ProgressMessage.Cancel);
            });
        }
        const result = this.deferredResults.get(messageId) || new promise_util_1.Deferred();
        this.deferredResults.set(messageId, result);
        if (!this.centerVisible) {
            this.toasts.set(messageId, notification);
            this.setVisibilityState('toasts');
        }
        this.fireUpdatedEvent();
        return result.promise;
    }
    async reportProgress(messageId, update, originalMessage, cancellationToken) {
        const notification = this.find(messageId);
        if (!notification) {
            return;
        }
        if (cancellationToken.isCancellationRequested) {
            this.clear(messageId);
        }
        else {
            const textMessage = originalMessage.text && update.message ? `${originalMessage.text}: ${update.message}` : originalMessage.text || (update === null || update === void 0 ? void 0 : update.message);
            if (textMessage) {
                notification.message = this.contentRenderer.renderMessage(textMessage);
            }
            notification.progress = this.toPlainProgress(update) || notification.progress;
        }
        this.fireUpdatedEvent();
    }
    toPlainProgress(update) {
        return update.work && Math.min(update.work.done / update.work.total * 100, 100);
    }
    async openLink(link) {
        const uri = new uri_1.default(link);
        const opener = await this.openerService.getOpener(uri);
        opener.open(uri);
    }
};
__decorate([
    (0, inversify_1.inject)(notification_preferences_1.NotificationPreferences),
    __metadata("design:type", Object)
], NotificationManager.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], NotificationManager.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], NotificationManager.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(notification_content_renderer_1.NotificationContentRenderer),
    __metadata("design:type", notification_content_renderer_1.NotificationContentRenderer)
], NotificationManager.prototype, "contentRenderer", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationManager.prototype, "init", null);
NotificationManager = __decorate([
    (0, inversify_1.injectable)()
], NotificationManager);
exports.NotificationManager = NotificationManager;
//# sourceMappingURL=notifications-manager.js.map