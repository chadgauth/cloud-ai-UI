export interface RendererMetadata {
    readonly id: string;
    readonly entrypoint: {
        readonly uri: string;
        readonly extends?: string;
    };
    readonly mimeTypes: readonly string[];
    readonly requiresMessaging: boolean;
}
export interface CustomRendererMessage {
    readonly type: 'customRendererMessage';
    readonly rendererId: string;
    readonly message: unknown;
}
export interface UpdateRenderersMessage {
    readonly type: 'updateRenderers';
    readonly rendererData: readonly RendererMetadata[];
}
export interface OutputChangedMessage {
    readonly type: 'outputChanged';
    readonly newOutputs?: Output[];
    readonly deletedOutputIds?: string[];
}
export interface ChangePreferredMimetypeMessage {
    readonly type: 'changePreferredMimetype';
    readonly outputId: string;
    readonly mimeType: string;
}
export declare type ToWebviewMessage = UpdateRenderersMessage | OutputChangedMessage | ChangePreferredMimetypeMessage | CustomRendererMessage;
export interface WebviewInitialized {
    readonly type: 'initialized';
}
export interface OnDidRenderOutput {
    readonly type: 'didRenderOutput';
    contentHeight: number;
}
export interface WheelMessage {
    readonly type: 'did-scroll-wheel';
    readonly deltaY: number;
    readonly deltaX: number;
}
export declare type FromWebviewMessage = WebviewInitialized | OnDidRenderOutput | WheelMessage | CustomRendererMessage;
export interface Output {
    id: string;
    metadata?: Record<string, unknown>;
    items: OutputItem[];
}
export interface OutputItem {
    readonly mime: string;
    readonly data: Uint8Array;
}
//# sourceMappingURL=webview-communication.d.ts.map