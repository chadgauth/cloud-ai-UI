import { TreeDataProvider, TreeView, TreeViewExpansionEvent, TreeViewSelectionChangeEvent, TreeViewVisibilityChangeEvent, CancellationToken, TreeViewOptions, ViewBadge, TreeCheckboxChangeEvent } from '@theia/plugin';
import { Disposable } from '@theia/core/lib/common/disposable';
import { Disposable as PluginDisposable } from '../types-impl';
import { Plugin, TreeViewsExt, TreeViewsMain, TreeViewItem, TreeViewRevealOptions, DataTransferFileDTO } from '../../common/plugin-api-rpc';
import { RPCProtocol } from '../../common/rpc-protocol';
import { CommandRegistryImpl, CommandsConverter } from '../command-registry';
import { TreeViewItemReference } from '../../common';
import { UriComponents } from '@theia/core/lib/common/uri';
export declare class TreeViewsExtImpl implements TreeViewsExt {
    readonly commandRegistry: CommandRegistryImpl;
    private proxy;
    private readonly treeViews;
    constructor(rpc: RPCProtocol, commandRegistry: CommandRegistryImpl);
    $checkStateChanged(treeViewId: string, itemIds: {
        id: string;
        checked: boolean;
    }[]): Promise<void>;
    $dragStarted(treeViewId: string, treeItemIds: string[], token: CancellationToken): Promise<UriComponents[] | undefined>;
    $dragEnd(treeViewId: string): Promise<void>;
    $drop(treeViewId: string, treeItemId: string | undefined, dataTransferItems: [string, string | DataTransferFileDTO][], token: CancellationToken): Promise<void>;
    protected toTreeElement(treeViewItemRef: TreeViewItemReference): any;
    registerTreeDataProvider<T>(plugin: Plugin, treeViewId: string, treeDataProvider: TreeDataProvider<T>): PluginDisposable;
    createTreeView<T>(plugin: Plugin, treeViewId: string, options: TreeViewOptions<T>): TreeView<T>;
    $getChildren(treeViewId: string, treeItemId: string): Promise<TreeViewItem[] | undefined>;
    $resolveTreeItem(treeViewId: string, treeItemId: string, token: CancellationToken): Promise<TreeViewItem | undefined>;
    $hasResolveTreeItem(treeViewId: string): Promise<boolean>;
    $setExpanded(treeViewId: string, treeItemId: string, expanded: boolean): Promise<any>;
    $setSelection(treeViewId: string, treeItemIds: string[]): Promise<void>;
    $setVisible(treeViewId: string, isVisible: boolean): Promise<void>;
    protected getTreeView(treeViewId: string): TreeViewExtImpl<any>;
}
declare class TreeViewExtImpl<T> implements Disposable {
    private plugin;
    private treeViewId;
    private options;
    private proxy;
    readonly commandsConverter: CommandsConverter;
    private static readonly ID_COMPUTED;
    private static readonly ID_ITEM;
    private readonly onDidExpandElementEmitter;
    readonly onDidExpandElement: import("@theia/core").Event<TreeViewExpansionEvent<T>>;
    private readonly onDidCollapseElementEmitter;
    readonly onDidCollapseElement: import("@theia/core").Event<TreeViewExpansionEvent<T>>;
    private readonly onDidChangeSelectionEmitter;
    readonly onDidChangeSelection: import("@theia/core").Event<TreeViewSelectionChangeEvent<T>>;
    private readonly onDidChangeVisibilityEmitter;
    readonly onDidChangeVisibility: import("@theia/core").Event<TreeViewVisibilityChangeEvent>;
    private readonly onDidChangeCheckboxStateEmitter;
    readonly onDidChangeCheckboxState: import("@theia/core").Event<TreeCheckboxChangeEvent<T>>;
    private readonly nodes;
    private pendingRefresh;
    private localDataTransfer;
    private readonly toDispose;
    constructor(plugin: Plugin, treeViewId: string, options: TreeViewOptions<T>, proxy: TreeViewsMain, commandsConverter: CommandsConverter);
    dispose(): void;
    reveal(element: T, options?: Partial<TreeViewRevealOptions>): Promise<void>;
    private _message;
    get message(): string;
    set message(message: string);
    private _title;
    get title(): string;
    set title(title: string);
    private _description;
    get description(): string;
    set description(description: string);
    private _badge?;
    get badge(): ViewBadge | undefined;
    set badge(badge: ViewBadge | undefined);
    getElement(treeItemId: string): T | undefined;
    /**
     * calculate the chain of node ids from root to element so that the frontend can expand all of them and reveal element.
     * this is needed as the frontend may not have the full tree nodes.
     * throughout the parent chain this.getChildren is called in order to fill this.nodes cache.
     *
     * returns undefined if wasn't able to calculate the path due to inconsistencies.
     *
     * @param element element to reveal
     */
    private calculateRevealParentChain;
    private getTreeItemLabel;
    private getTreeItemLabelHighlights;
    private getItemLabel;
    private buildTreeItemId;
    getChildren(parentId: string): Promise<TreeViewItem[] | undefined>;
    private clearChildren;
    private clear;
    private clearAll;
    onExpanded(treeItemId: string): Promise<any>;
    onCollapsed(treeItemId: string): Promise<any>;
    checkStateChanged(items: readonly {
        id: string;
        checked: boolean;
    }[]): Promise<void>;
    resolveTreeItem(treeItemId: string, token: CancellationToken): Promise<TreeViewItem | undefined>;
    hasResolveTreeItem(): boolean;
    private selectedItemIds;
    get selectedElements(): T[];
    setSelection(selectedItemIds: string[]): void;
    protected doSetSelection(selectedItemIts: string[]): void;
    private _visible;
    get visible(): boolean;
    setVisible(visible: boolean): void;
    onDragStarted(treeItemIds: string[], token: CancellationToken): Promise<UriComponents[] | undefined>;
    dragEnd(): Promise<void>;
    handleDrop(treeItemId: string | undefined, dataTransferItems: [string, string | DataTransferFileDTO][], token: CancellationToken): Promise<void>;
}
export {};
//# sourceMappingURL=tree-views.d.ts.map