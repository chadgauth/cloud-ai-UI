import { UriComponents } from '@theia/core/lib/common/uri';
import { CellRange } from '@theia/notebook/lib/common';
import { NotebookEditorWidget } from '@theia/notebook/lib/browser';
import { NotebookDocumentShowOptions, NotebookEditorRevealType, NotebookEditorsExt, NotebookEditorsMain } from '../../../common';
import { RPCProtocol } from '../../../common/rpc-protocol';
import { interfaces } from '@theia/core/shared/inversify';
import { OpenerService } from '@theia/core/lib/browser';
export declare class NotebookEditorsMainImpl implements NotebookEditorsMain {
    protected readonly proxy: NotebookEditorsExt;
    protected readonly openerService: OpenerService;
    protected readonly mainThreadEditors: Map<string, NotebookEditorWidget>;
    constructor(rpc: RPCProtocol, container: interfaces.Container);
    $tryShowNotebookDocument(uriComponents: UriComponents, viewType: string, options: NotebookDocumentShowOptions): Promise<string>;
    $tryRevealRange(id: string, range: CellRange, revealType: NotebookEditorRevealType): Promise<void>;
    $trySetSelections(id: string, range: CellRange[]): void;
    handleEditorsAdded(editors: readonly NotebookEditorWidget[]): void;
    handleEditorsRemoved(editorIds: readonly string[]): void;
    dispose(): void;
}
//# sourceMappingURL=notebook-editors-main.d.ts.map