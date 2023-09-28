/// <reference types="react" />
import { TreeViewsExt, TreeViewItem, TreeViewItemReference, ThemeIcon } from '../../../common/plugin-api-rpc';
import { Command } from '../../../common/plugin-api-rpc-model';
import { TreeNode, NodeProps, SelectableTreeNode, ExpandableTreeNode, CompositeTreeNode, TreeImpl, TreeModelImpl, TreeViewWelcomeWidget, HoverService, ApplicationShell, KeybindingRegistry } from '@theia/core/lib/browser';
import { MenuPath, MenuModelRegistry, ActionMenuNode } from '@theia/core/lib/common/menu';
import * as React from '@theia/core/shared/react';
import { PluginSharedStyle } from '../plugin-shared-style';
import { Widget } from '@theia/core/lib/browser/widgets/widget';
import { Emitter, Event } from '@theia/core/lib/common/event';
import { MessageService } from '@theia/core/lib/common/message-service';
import { View } from '../../../common/plugin-protocol';
import { ContextKeyService } from '@theia/core/lib/browser/context-key-service';
import { MarkdownString } from '@theia/core/lib/common/markdown-rendering';
import { LabelParser } from '@theia/core/lib/browser/label-parser';
import { AccessibilityInformation } from '@theia/plugin';
import { ColorRegistry } from '@theia/core/lib/browser/color-registry';
import { DecoratedTreeNode } from '@theia/core/lib/browser/tree/tree-decorator';
import { WidgetDecoration } from '@theia/core/lib/browser/widget-decoration';
import { CancellationToken, Mutable } from '@theia/core/lib/common';
import { DnDFileContentStore } from './dnd-file-content-store';
export declare const TREE_NODE_HYPERLINK = "theia-TreeNodeHyperlink";
export declare const VIEW_ITEM_CONTEXT_MENU: MenuPath;
export declare const VIEW_ITEM_INLINE_MENU: MenuPath;
export interface SelectionEventHandler {
    readonly node: SelectableTreeNode;
    readonly contextSelection: boolean;
}
export interface TreeViewNode extends SelectableTreeNode, DecoratedTreeNode {
    contextValue?: string;
    command?: Command;
    resourceUri?: string;
    themeIcon?: ThemeIcon;
    tooltip?: string | MarkdownString;
    description?: string | boolean | any;
    accessibilityInformation?: AccessibilityInformation;
}
export declare namespace TreeViewNode {
    function is(arg: TreeNode | undefined): arg is TreeViewNode;
}
export declare class ResolvableTreeViewNode implements TreeViewNode {
    contextValue?: string;
    command?: Command;
    resourceUri?: string;
    themeIcon?: ThemeIcon;
    tooltip?: string | MarkdownString;
    description?: string | boolean | any;
    accessibilityInformation?: AccessibilityInformation;
    selected: boolean;
    focus?: boolean;
    id: string;
    name?: string;
    icon?: string;
    visible?: boolean;
    parent: Readonly<CompositeTreeNode>;
    previousSibling?: TreeNode;
    nextSibling?: TreeNode;
    busy?: number;
    decorationData: WidgetDecoration.Data;
    resolve: ((token: CancellationToken) => Promise<void>);
    private _resolved;
    private resolving;
    constructor(treeViewNode: Partial<TreeViewNode>, resolve: (token: CancellationToken) => Promise<TreeViewItem | undefined>);
    reset(): void;
    get resolved(): boolean;
}
export declare class ResolvableCompositeTreeViewNode extends ResolvableTreeViewNode implements CompositeTreeViewNode {
    expanded: boolean;
    children: readonly TreeNode[];
    constructor(treeViewNode: Pick<CompositeTreeViewNode, 'children' | 'expanded'> & Partial<TreeViewNode>, resolve: (token: CancellationToken) => Promise<TreeViewItem | undefined>);
}
export interface CompositeTreeViewNode extends TreeViewNode, ExpandableTreeNode, CompositeTreeNode {
    description?: string | boolean | any;
}
export declare namespace CompositeTreeViewNode {
    function is(arg: TreeNode | undefined): arg is CompositeTreeViewNode;
}
export declare class TreeViewWidgetOptions {
    id: string;
    manageCheckboxStateManually: boolean | undefined;
    showCollapseAll: boolean | undefined;
    multiSelect: boolean | undefined;
    dragMimeTypes: string[] | undefined;
    dropMimeTypes: string[] | undefined;
}
export declare class PluginTree extends TreeImpl {
    protected readonly sharedStyle: PluginSharedStyle;
    protected readonly options: TreeViewWidgetOptions;
    protected readonly notification: MessageService;
    protected readonly onDidChangeWelcomeStateEmitter: Emitter<void>;
    readonly onDidChangeWelcomeState: Event<void>;
    private _proxy;
    private _viewInfo;
    private _isEmpty;
    private _hasTreeItemResolve;
    set proxy(proxy: TreeViewsExt | undefined);
    get proxy(): TreeViewsExt | undefined;
    get hasTreeItemResolve(): Promise<boolean>;
    set viewInfo(viewInfo: View);
    get isEmpty(): boolean;
    protected resolveChildren(parent: CompositeTreeNode): Promise<TreeNode[]>;
    protected fetchChildren(proxy: TreeViewsExt, parent: CompositeTreeNode): Promise<TreeViewItem[]>;
    protected createTreeNode(item: TreeViewItem, parent: CompositeTreeNode): TreeNode;
    markAsChecked(node: Mutable<TreeNode>, checked: boolean): void;
    /** Creates a resolvable tree node. If a node already exists, reset it because the underlying TreeViewItem might have been disposed in the backend. */
    protected createResolvableTreeNode(item: TreeViewItem, parent: CompositeTreeNode): TreeNode;
    protected createTreeNodeUpdate(item: TreeViewItem): Partial<TreeViewNode>;
    protected toDecorationData(item: TreeViewItem): WidgetDecoration.Data;
    protected toIconClass(item: TreeViewItem): string | undefined;
}
export declare class PluginTreeModel extends TreeModelImpl {
    protected readonly tree: PluginTree;
    set proxy(proxy: TreeViewsExt | undefined);
    get proxy(): TreeViewsExt | undefined;
    get hasTreeItemResolve(): Promise<boolean>;
    set viewInfo(viewInfo: View);
    get isTreeEmpty(): boolean;
    get onDidChangeWelcomeState(): Event<void>;
    doOpenNode(node: TreeNode): void;
}
export declare class TreeViewWidget extends TreeViewWelcomeWidget {
    protected _contextSelection: boolean;
    protected readonly applicationShell: ApplicationShell;
    protected readonly menus: MenuModelRegistry;
    protected readonly keybindings: KeybindingRegistry;
    protected readonly contextKeys: ContextKeyService;
    readonly options: TreeViewWidgetOptions;
    readonly model: PluginTreeModel;
    protected readonly contextKeyService: ContextKeyService;
    protected readonly hoverService: HoverService;
    protected readonly labelParser: LabelParser;
    protected readonly colorRegistry: ColorRegistry;
    protected readonly dndFileContentStore: DnDFileContentStore;
    protected treeDragType: string;
    protected readonly expansionTimeouts: Map<string, number>;
    protected init(): void;
    get showCollapseAll(): boolean;
    protected renderIcon(node: TreeNode, props: NodeProps): React.ReactNode;
    protected renderCaption(node: TreeViewNode, props: NodeProps): React.ReactNode;
    protected createNodeAttributes(node: TreeViewNode, props: NodeProps): React.Attributes & React.HTMLAttributes<HTMLElement>;
    handleDragLeave(node: TreeViewNode, event: React.DragEvent<HTMLElement>): void;
    handleDragEnter(node: TreeViewNode, event: React.DragEvent<HTMLElement>): void;
    protected createContainerAttributes(): React.HTMLAttributes<HTMLElement>;
    protected handleDragStartEvent(node: TreeViewNode, event: React.DragEvent<HTMLElement>): void;
    handleDragEnd(node: TreeViewNode, event: React.DragEvent<HTMLElement>): void;
    handleDragOver(event: React.DragEvent<HTMLElement>): void;
    protected handleDropEvent(node: TreeViewNode | undefined, event: React.DragEvent<HTMLElement>): void;
    protected renderTailDecorations(treeViewNode: TreeViewNode, props: NodeProps): React.ReactNode;
    toTreeViewItemReference(treeNode: TreeNode): TreeViewItemReference;
    protected resolveKeybindingForCommand(command: string | undefined): string;
    protected renderInlineCommand(actionMenuNode: ActionMenuNode, index: number, tabbable: boolean, args: any[]): React.ReactNode;
    protected toContextMenuArgs(target: SelectableTreeNode): [TreeViewItemReference, TreeViewItemReference[]] | [TreeViewItemReference];
    setFlag(flag: Widget.Flag): void;
    clearFlag(flag: Widget.Flag): void;
    handleEnter(event: KeyboardEvent): void;
    protected tapNode(node?: TreeNode): void;
    protected tryExecuteCommand(node?: TreeNode): Promise<void>;
    protected tryExecuteCommandMap(commandMap: Map<string, unknown[]>): void;
    protected findCommands(node?: TreeNode): Promise<Map<string, unknown[]>>;
    private _message;
    get message(): string | undefined;
    set message(message: string | undefined);
    protected render(): React.ReactNode;
    protected renderSearchInfo(): React.ReactNode;
    shouldShowWelcomeView(): boolean;
    protected handleContextMenuEvent(node: TreeNode | undefined, event: React.MouseEvent<HTMLElement, MouseEvent>): void;
}
//# sourceMappingURL=tree-view-widget.d.ts.map