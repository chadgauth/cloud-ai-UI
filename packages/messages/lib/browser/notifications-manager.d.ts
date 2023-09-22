/// <reference types="lodash" />
import { MessageClient, MessageType, Message as PlainMessage, ProgressMessage, ProgressUpdate, CancellationToken } from '@theia/core/lib/common';
import { Emitter } from '@theia/core';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { NotificationPreferences } from './notification-preferences';
import { ContextKeyService, ContextKey } from '@theia/core/lib/browser/context-key-service';
import { OpenerService } from '@theia/core/lib/browser';
import { NotificationContentRenderer } from './notification-content-renderer';
export interface NotificationUpdateEvent {
    readonly notifications: Notification[];
    readonly toasts: Notification[];
    readonly visibilityState: Notification.Visibility;
}
export interface Notification {
    messageId: string;
    message: string;
    source?: string;
    expandable: boolean;
    collapsed: boolean;
    type: Notification.Type;
    actions: string[];
    progress?: number;
}
export declare namespace Notification {
    type Visibility = 'hidden' | 'toasts' | 'center';
    type Type = 'info' | 'warning' | 'error' | 'progress';
}
export declare class NotificationManager extends MessageClient {
    protected readonly preferences: NotificationPreferences;
    protected readonly contextKeyService: ContextKeyService;
    protected readonly openerService: OpenerService;
    protected readonly contentRenderer: NotificationContentRenderer;
    protected readonly onUpdatedEmitter: Emitter<NotificationUpdateEvent>;
    readonly onUpdated: import("@theia/core/lib/common").Event<NotificationUpdateEvent>;
    protected readonly fireUpdatedEvent: import("lodash").DebouncedFunc<() => void>;
    protected readonly deferredResults: Map<string, Deferred<string | undefined>>;
    protected readonly notifications: Map<string, Notification>;
    protected readonly toasts: Map<string, Notification>;
    protected notificationToastsVisibleKey: ContextKey<boolean>;
    protected notificationCenterVisibleKey: ContextKey<boolean>;
    protected notificationsVisible: ContextKey<boolean>;
    protected init(): void;
    protected doInit(): Promise<void>;
    protected updateContextKeys(): void;
    get toastsVisible(): boolean;
    get centerVisible(): boolean;
    protected visibilityState: Notification.Visibility;
    protected setVisibilityState(newState: Notification.Visibility): void;
    hideCenter(): void;
    showCenter(): void;
    toggleCenter(): void;
    accept(notification: Notification | string, action: string | undefined): void;
    protected find(notification: Notification | string): Notification | undefined;
    protected getId(notification: Notification | string): string;
    hide(): void;
    clearAll(): void;
    clear(notification: Notification | string): void;
    toggleExpansion(notificationId: string): void;
    showMessage(plainMessage: PlainMessage): Promise<string | undefined>;
    protected hideTimeouts: Map<string, number>;
    protected startHideTimeout(messageId: string, timeout: number): void;
    protected hideToast(messageId: string): void;
    protected getTimeout(plainMessage: PlainMessage): number;
    protected isExpandable(message: string, source: string | undefined, actions: string[]): boolean;
    protected toNotificationType(type?: MessageType): Notification.Type;
    protected getMessageId(m: PlainMessage): string;
    showProgress(messageId: string, plainMessage: ProgressMessage, cancellationToken: CancellationToken): Promise<string | undefined>;
    reportProgress(messageId: string, update: ProgressUpdate, originalMessage: ProgressMessage, cancellationToken: CancellationToken): Promise<void>;
    protected toPlainProgress(update: ProgressUpdate): number | undefined;
    openLink(link: string): Promise<void>;
}
//# sourceMappingURL=notifications-manager.d.ts.map