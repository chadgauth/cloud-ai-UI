import { interfaces } from '@theia/core/shared/inversify';
import { TreeViewsMain, TreeViewRevealOptions, RegisterTreeDataProviderOptions } from '../../../common/plugin-api-rpc';
import { RPCProtocol } from '../../../common/rpc-protocol';
import { Disposable } from '@theia/core';
import { TreeViewWidget, TreeViewNode } from './tree-view-widget';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { ViewBadge } from '@theia/plugin';
export declare class TreeViewsMainImpl implements TreeViewsMain, Disposable {
    private container;
    private readonly proxy;
    private readonly viewRegistry;
    private readonly contextKeys;
    private readonly widgetManager;
    private readonly fileContentStore;
    private readonly treeViewProviders;
    private readonly toDispose;
    constructor(rpc: RPCProtocol, container: interfaces.Container);
    dispose(): void;
    $registerTreeDataProvider(treeViewId: string, $options: RegisterTreeDataProviderOptions): Promise<void>;
    $unregisterTreeDataProvider(treeViewId: string): Promise<void>;
    $readDroppedFile(contentId: string): Promise<BinaryBuffer>;
    $refresh(treeViewId: string): Promise<void>;
    $reveal(treeViewId: string, elementParentChain: string[], options: TreeViewRevealOptions): Promise<any>;
    /**
     * Expand all parents of the node to reveal from root. This should also fetch missing nodes to the frontend.
     */
    private expandParentChain;
    $setMessage(treeViewId: string, message: string): Promise<void>;
    $setTitle(treeViewId: string, title: string): Promise<void>;
    $setDescription(treeViewId: string, description: string): Promise<void>;
    $setBadge(treeViewId: string, badge: ViewBadge | undefined): Promise<void>;
    setChecked(treeViewWidget: TreeViewWidget, changedNodes: TreeViewNode[]): Promise<void>;
    protected handleTreeEvents(treeViewId: string, treeViewWidget: TreeViewWidget): void;
}
//# sourceMappingURL=tree-views-main.d.ts.map