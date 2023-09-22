import { NotebookExtensionDescription, TransientOptions } from '@theia/notebook/lib/common';
import { NotebookService } from '@theia/notebook/lib/browser';
import { NotebooksMain } from '../../../common';
import { RPCProtocol } from '../../../common/rpc-protocol';
import { HostedPluginSupport } from '../../../hosted/browser/hosted-plugin';
export declare class NotebooksMainImpl implements NotebooksMain {
    private notebookService;
    private readonly disposables;
    private readonly proxy;
    private readonly notebookSerializer;
    private readonly notebookCellStatusBarRegistrations;
    constructor(rpc: RPCProtocol, notebookService: NotebookService, plugins: HostedPluginSupport);
    dispose(): void;
    $registerNotebookSerializer(handle: number, extension: NotebookExtensionDescription, viewType: string, options: TransientOptions): void;
    $unregisterNotebookSerializer(handle: number): void;
    $emitCellStatusBarEvent(eventHandle: number): void;
    $registerNotebookCellStatusBarItemProvider(handle: number, eventHandle: number | undefined, viewType: string): Promise<void>;
    $unregisterNotebookCellStatusBarItemProvider(handle: number, eventHandle: number | undefined): Promise<void>;
}
//# sourceMappingURL=notebooks-main.d.ts.map