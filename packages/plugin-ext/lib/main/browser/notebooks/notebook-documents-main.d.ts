import { UriComponents } from '@theia/core/lib/common/uri';
import { interfaces } from '@theia/core/shared/inversify';
import { NotebookModel } from '@theia/notebook/lib/browser/view-model/notebook-model';
import { NotebookDataDto, NotebookDocumentsMain } from '../../../common';
import { RPCProtocol } from '../../../common/rpc-protocol';
export declare class NotebookDocumentsMainImpl implements NotebookDocumentsMain {
    private readonly disposables;
    private readonly proxy;
    private readonly documentEventListenersMapping;
    private readonly notebookModelResolverService;
    constructor(rpc: RPCProtocol, container: interfaces.Container);
    dispose(): void;
    handleNotebooksAdded(notebooks: readonly NotebookModel[]): void;
    handleNotebooksRemoved(uris: UriComponents[]): void;
    $tryCreateNotebook(options: {
        viewType: string;
        content?: NotebookDataDto;
    }): Promise<UriComponents>;
    $tryOpenNotebook(uriComponents: UriComponents): Promise<UriComponents>;
    $trySaveNotebook(uriComponents: UriComponents): Promise<boolean>;
}
//# sourceMappingURL=notebook-documents-main.d.ts.map