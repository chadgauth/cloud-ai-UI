import { Disposable } from '@theia/core/shared/vscode-languageserver-protocol';
interface MessageToSend {
    editorId: string;
    rendererId: string;
    message: unknown;
}
export interface ScopedRendererMessaging extends Disposable {
    /**
     * Method called when a message is received. Should return a boolean
     * indicating whether a renderer received it.
     */
    receiveMessageHandler?: (rendererId: string, message: unknown) => Promise<boolean>;
    /**
     * Sends a message to an extension from a renderer.
     */
    postMessage(rendererId: string, message: unknown): void;
}
export declare class NotebookRendererMessagingService implements Disposable {
    private readonly postMessageEmitter;
    readonly onShouldPostMessage: import("@theia/core").Event<MessageToSend>;
    private readonly activations;
    private readonly scopedMessaging;
    receiveMessage(editorId: string | undefined, rendererId: string, message: unknown): Promise<boolean>;
    prepare(rendererId: string): void;
    getScoped(editorId: string): ScopedRendererMessaging;
    private postMessage;
    dispose(): void;
}
export {};
//# sourceMappingURL=notebook-renderer-messaging-service.d.ts.map