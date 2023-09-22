import { NotebookRenderersExt } from '../../common';
import { RPCProtocol } from '../../common/rpc-protocol';
import { NotebooksExtImpl } from './notebooks';
import * as theia from '@theia/plugin';
export declare class NotebookRenderersExtImpl implements NotebookRenderersExt {
    private readonly notebooksExt;
    private readonly rendererMessageEmitters;
    private readonly proxy;
    constructor(rpc: RPCProtocol, notebooksExt: NotebooksExtImpl);
    $postRendererMessage(editorId: string, rendererId: string, message: unknown): void;
    createRendererMessaging(rendererId: string): theia.NotebookRendererMessaging;
    private getOrCreateEmitterFor;
}
//# sourceMappingURL=notebook-renderers.d.ts.map