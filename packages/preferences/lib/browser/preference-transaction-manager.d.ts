import { Emitter, Event, MaybePromise, MessageService, WaitUntilEvent } from '@theia/core';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { interfaces } from '@theia/core/shared/inversify';
import { PreferenceScope } from '@theia/core/lib/common/preferences/preference-scope';
import URI from '@theia/core/lib/common/uri';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { Mutex } from 'async-mutex';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { MonacoJSONCEditor } from './monaco-jsonc-editor';
import { EditorManager } from '@theia/editor/lib/browser/editor-manager';
import { IReference } from '@theia/monaco-editor-core/esm/vs/base/common/lifecycle';
export interface OnWillConcludeEvent<T> extends WaitUntilEvent {
    status: T | false;
}
export declare abstract class Transaction<Arguments extends unknown[], Result = unknown, Status = unknown> {
    protected _open: boolean;
    /**
     * Whether the transaction is still accepting new interactions.
     * Enqueueing an action when the Transaction is no longer open will throw an error.
     */
    get open(): boolean;
    protected _result: Deferred<false | Result>;
    /**
     * The status of the transaction when complete.
     */
    get result(): Promise<Result | false>;
    /**
     * The transaction will self-dispose when the queue is empty, once at least one action has been processed.
     */
    protected readonly queue: Mutex;
    protected readonly onWillConcludeEmitter: Emitter<OnWillConcludeEvent<Status>>;
    /**
     * An event fired when the transaction is wrapping up.
     * Consumers can call `waitUntil` on the event to delay the resolution of the `result` Promise.
     */
    get onWillConclude(): Event<OnWillConcludeEvent<Status>>;
    protected status: Deferred<Status>;
    /**
     * Whether any actions have been added to the transaction.
     * The Transaction will not self-dispose until at least one action has been performed.
     */
    protected inUse: boolean;
    protected init(): void;
    protected doInit(): Promise<void>;
    waitFor(delay?: Promise<unknown>, disposeIfRejected?: boolean): Promise<void>;
    /**
     * @returns a promise reflecting the result of performing an action. Typically the promise will not resolve until the whole transaction is complete.
     */
    enqueueAction(...args: Arguments): Promise<Result | false>;
    protected disposeWhenDone(): void;
    protected conclude(): Promise<void>;
    dispose(): void;
    /**
     * Runs any code necessary to initialize the batch of interactions. No interaction will be run until the setup is complete.
     *
     * @returns a representation of the success of setup specific to a given transaction implementation.
     */
    protected abstract setUp(): MaybePromise<Status>;
    /**
     * Performs a single interaction
     *
     * @returns the result of that interaction, specific to a given transaction type.
     */
    protected abstract act(...args: Arguments): MaybePromise<Result>;
    /**
     * Runs any code necessary to complete a transaction and release any resources it holds.
     *
     * @returns implementation-specific information about the success of the transaction. Will be used as the final status of the transaction.
     */
    protected abstract tearDown(): MaybePromise<Result>;
}
export interface PreferenceContext {
    getConfigUri(): URI;
    getScope(): PreferenceScope;
}
export declare const PreferenceContext: unique symbol;
export declare const PreferenceTransactionPreludeProvider: unique symbol;
export declare type PreferenceTransactionPreludeProvider = () => Promise<unknown>;
export declare class PreferenceTransaction extends Transaction<[string, string[], unknown], boolean> {
    reference: IReference<MonacoEditorModel> | undefined;
    protected readonly context: PreferenceContext;
    protected readonly prelude?: PreferenceTransactionPreludeProvider;
    protected readonly textModelService: MonacoTextModelService;
    protected readonly jsoncEditor: MonacoJSONCEditor;
    protected readonly messageService: MessageService;
    protected readonly editorManager: EditorManager;
    protected doInit(): Promise<void>;
    protected setUp(): Promise<boolean>;
    /**
     * @returns whether the setting operation in progress, and any others started in the meantime, should continue.
     */
    protected handleDirtyEditor(): Promise<boolean>;
    protected act(key: string, path: string[], value: unknown): Promise<boolean>;
    protected tearDown(): Promise<boolean>;
}
export interface PreferenceTransactionFactory {
    (context: PreferenceContext, waitFor?: Promise<unknown>): PreferenceTransaction;
}
export declare const PreferenceTransactionFactory: unique symbol;
export declare const preferenceTransactionFactoryCreator: interfaces.FactoryCreator<PreferenceTransaction>;
//# sourceMappingURL=preference-transaction-manager.d.ts.map