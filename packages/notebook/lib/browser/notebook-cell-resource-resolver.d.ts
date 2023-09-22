import { Emitter, Resource, ResourceReadOptions, ResourceResolver, ResourceVersion, URI } from '@theia/core';
import { NotebookService } from './service/notebook-service';
import { NotebookCellModel } from './view-model/notebook-cell-model';
export declare class NotebookCellResource implements Resource {
    uri: URI;
    protected readonly didChangeContentsEmitter: Emitter<void>;
    readonly onDidChangeContents: import("@theia/core").Event<void>;
    version?: ResourceVersion | undefined;
    encoding?: string | undefined;
    isReadonly?: boolean | undefined;
    private cell;
    constructor(uri: URI, cell: NotebookCellModel);
    readContents(options?: ResourceReadOptions | undefined): Promise<string>;
    dispose(): void;
}
export declare class NotebookCellResourceResolver implements ResourceResolver {
    protected readonly notebookService: NotebookService;
    resolve(uri: URI): Promise<Resource>;
}
//# sourceMappingURL=notebook-cell-resource-resolver.d.ts.map