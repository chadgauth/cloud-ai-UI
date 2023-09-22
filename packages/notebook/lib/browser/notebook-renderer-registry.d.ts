import { Disposable } from '@theia/core';
import { NotebookRendererDescriptor } from '../common/notebook-protocol';
export interface NotebookRendererInfo {
    readonly id: string;
    readonly displayName: string;
    readonly mimeTypes: string[];
    readonly entrypoint: {
        readonly extends?: string;
        readonly uri: string;
    };
    readonly requiresMessaging: boolean;
}
export declare class NotebookRendererRegistry {
    readonly notebookRenderers: NotebookRendererInfo[];
    registerNotebookRenderer(type: NotebookRendererDescriptor, basePath: string): Disposable;
}
//# sourceMappingURL=notebook-renderer-registry.d.ts.map