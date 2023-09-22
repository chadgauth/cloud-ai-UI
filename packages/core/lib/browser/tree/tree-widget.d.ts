import { Message } from '@phosphor/messaging';
import { MenuPath, SelectionService } from '../../common';
import { ContextMenuRenderer } from '../context-menu-renderer';
import { StatefulWidget } from '../shell';
import { Widget } from '../widgets';
import { TreeNode, CompositeTreeNode } from './tree';
import { TreeModel } from './tree-model';
import { ExpandableTreeNode } from './tree-expansion';
import { SelectableTreeNode } from './tree-selection';
import { TreeDecoratorService, TreeDecoration } from './tree-decorator';
import { ReactWidget } from '../widgets/react-widget';
import * as React from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import { SearchBox, SearchBoxFactory } from './search-box';
import { TreeSearch } from './tree-search';
import { MaybePromise } from '../../common/types';
import { LabelProvider } from '../label-provider';
import { CorePreferences } from '../core-preferences';
import { TreeFocusService } from './tree-focus-service';
export declare const TREE_CLASS = "theia-Tree";
export declare const TREE_CONTAINER_CLASS = "theia-TreeContainer";
export declare const TREE_NODE_CLASS = "theia-TreeNode";
export declare const TREE_NODE_CONTENT_CLASS = "theia-TreeNodeContent";
export declare const TREE_NODE_INFO_CLASS = "theia-TreeNodeInfo";
export declare const TREE_NODE_TAIL_CLASS = "theia-TreeNodeTail";
export declare const TREE_NODE_SEGMENT_CLASS = "theia-TreeNodeSegment";
export declare const TREE_NODE_SEGMENT_GROW_CLASS = "theia-TreeNodeSegmentGrow";
export declare const EXPANDABLE_TREE_NODE_CLASS = "theia-ExpandableTreeNode";
export declare const COMPOSITE_TREE_NODE_CLASS = "theia-CompositeTreeNode";
export declare const TREE_NODE_CAPTION_CLASS = "theia-TreeNodeCaption";
export declare const TREE_NODE_INDENT_GUIDE_CLASS = "theia-tree-node-indent";
export declare const TreeProps: unique symbol;
/**
 * Representation of tree properties.
 */
export interface TreeProps {
    /**
     * The path of the context menu that one can use to contribute context menu items to the tree widget.
     */
    readonly contextMenuPath?: MenuPath;
    /**
     * The size of the padding (in pixels) per hierarchy depth. The root element won't have left padding but
     * the padding for the children will be calculated as `leftPadding * hierarchyDepth` and so on.
     */
    readonly leftPadding: number;
    readonly expansionTogglePadding: number;
    /**
     * `true` if the tree widget support multi-selection. Otherwise, `false`. Defaults to `false`.
     */
    readonly multiSelect?: boolean;
    /**
     * `true` if the tree widget support searching. Otherwise, `false`. Defaults to `false`.
     */
    readonly search?: boolean;
    /**
     * `true` if the tree widget should be virtualized searching. Otherwise, `false`. Defaults to `true`.
     */
    readonly virtualized?: boolean;
    /**
     * `true` if the selected node should be auto scrolled only if the widget is active. Otherwise, `false`. Defaults to `false`.
     */
    readonly scrollIfActive?: boolean;
    /**
     * `true` if a tree widget contributes to the global selection. Defaults to `false`.
     */
    readonly globalSelection?: boolean;
    /**
     *  `true` if the tree widget supports expansion only when clicking the expansion toggle. Defaults to `false`.
     */
    readonly expandOnlyOnExpansionToggleClick?: boolean;
}
/**
 * Representation of node properties.
 */
export interface NodeProps {
    /**
     * A root relative number representing the hierarchical depth of the actual node. Root is `0`, its children have `1` and so on.
     */
    readonly depth: number;
}
/**
 * The default tree properties.
 */
export declare const defaultTreeProps: TreeProps;
export declare namespace TreeWidget {
    /**
     * Bare minimum common interface of the keyboard and the mouse event with respect to the key maskings.
     */
    interface ModifierAwareEvent {
        /**
         * Determines if the modifier aware event has the `meta` key masking.
         */
        readonly metaKey: boolean;
        /**
         * Determines if the modifier aware event has the `ctrl` key masking.
         */
        readonly ctrlKey: boolean;
        /**
         * Determines if the modifier aware event has the `shift` key masking.
         */
        readonly shiftKey: boolean;
    }
}
export declare class TreeWidget extends ReactWidget implements StatefulWidget {
    readonly props: TreeProps;
    readonly model: TreeModel;
    protected readonly contextMenuRenderer: ContextMenuRenderer;
    protected searchBox: SearchBox;
    protected searchHighlights: Map<string, TreeDecoration.CaptionHighlight>;
    protected readonly decoratorService: TreeDecoratorService;
    protected readonly treeSearch: TreeSearch;
    protected readonly searchBoxFactory: SearchBoxFactory;
    protected readonly focusService: TreeFocusService;
    protected decorations: Map<string, TreeDecoration.Data[]>;
    protected readonly selectionService: SelectionService;
    protected readonly labelProvider: LabelProvider;
    protected readonly corePreferences: CorePreferences;
    protected shouldScrollToRow: boolean;
    constructor(props: TreeProps, model: TreeModel, contextMenuRenderer: ContextMenuRenderer);
    protected init(): void;
    /**
     * Update the global selection for the tree.
     */
    protected updateGlobalSelection(): void;
    protected rows: Map<string, TreeWidget.NodeRow>;
    protected updateRows: any;
    protected doUpdateRows(): void;
    protected getDepthForNode(node: TreeNode, depths: Map<CompositeTreeNode | undefined, number>): number;
    protected toNodeRow(node: TreeNode, index: number, depth: number): TreeWidget.NodeRow;
    protected shouldDisplayNode(node: TreeNode): boolean;
    /**
     * Row index to ensure visibility.
     * - Used to forcefully scroll if necessary.
     */
    protected scrollToRow: number | undefined;
    /**
     * Update the `scrollToRow`.
     * @param updateOptions the tree widget force update options.
     */
    protected updateScrollToRow(): void;
    protected scheduleUpdateScrollToRow: any;
    /**
     * Get the `scrollToRow`.
     *
     * @returns the `scrollToRow` if available.
     */
    protected getScrollToRow(): number | undefined;
    /**
     * Update tree decorations.
     * - Updating decorations are debounced in order to limit the number of expensive updates.
     */
    protected readonly updateDecorations: any;
    protected doUpdateDecorations(): Promise<void>;
    protected onActivateRequest(msg: Message): void;
    /**
     * Actually focus the tree node.
     */
    protected doFocus(): void;
    /**
     * Get the tree node to focus.
     *
     * @returns the node to focus if available.
     */
    protected getNodeToFocus(): SelectableTreeNode | undefined;
    protected onUpdateRequest(msg: Message): void;
    protected onResize(msg: Widget.ResizeMessage): void;
    protected render(): React.ReactNode;
    /**
     * Create the container attributes for the widget.
     */
    protected createContainerAttributes(): React.HTMLAttributes<HTMLElement>;
    /**
     * Get the container tree node.
     *
     * @returns the tree node for the container if available.
     */
    protected getContainerTreeNode(): TreeNode | undefined;
    protected ScrollingRowRenderer: React.FC<{
        rows: TreeWidget.NodeRow[];
    }>;
    protected view: TreeWidget.View | undefined;
    /**
     * Render the tree widget.
     * @param model the tree model.
     */
    protected renderTree(model: TreeModel): React.ReactNode;
    scrollArea: Element;
    /**
     * Scroll to the selected tree node.
     */
    protected scrollToSelected(): void;
    /**
     * Render the node row.
     */
    protected readonly renderNodeRow: (row: TreeWidget.NodeRow) => React.ReactNode;
    /**
     * Actually render the node row.
     */
    protected doRenderNodeRow({ node, depth }: TreeWidget.NodeRow): React.ReactNode;
    /**
     * Render the tree node given the node properties.
     * @param node the tree node.
     * @param props the node properties.
     */
    protected renderIcon(node: TreeNode, props: NodeProps): React.ReactNode;
    /**
     * Toggle the node.
     */
    protected readonly toggle: (event: React.MouseEvent<HTMLElement>) => void;
    /**
     * Actually toggle the tree node.
     * @param event the mouse click event.
     */
    protected doToggle(event: React.MouseEvent<HTMLElement>): void;
    /**
     * Render the node expansion toggle.
     * @param node the tree node.
     * @param props the node properties.
     */
    protected renderExpansionToggle(node: TreeNode, props: NodeProps): React.ReactNode;
    /**
     * Render the node expansion toggle.
     * @param node the tree node.
     * @param props the node properties.
     */
    protected renderCheckbox(node: TreeNode, props: NodeProps): React.ReactNode;
    protected toggleChecked(event: React.MouseEvent<HTMLElement>): void;
    /**
     * Render the tree node caption given the node properties.
     * @param node the tree node.
     * @param props the node properties.
     */
    protected renderCaption(node: TreeNode, props: NodeProps): React.ReactNode;
    protected getCaptionAttributes(node: TreeNode, props: NodeProps): React.Attributes & React.HTMLAttributes<HTMLElement>;
    protected getCaptionChildren(node: TreeNode, props: NodeProps): React.ReactNode;
    /**
     * Update the node given the caption and highlight.
     * @param caption the caption.
     * @param highlight the tree decoration caption highlight.
     */
    protected toReactNode(caption: string, highlight: TreeDecoration.CaptionHighlight): React.ReactNode[];
    /**
     * Decorate the tree caption.
     * @param node the tree node.
     * @param attrs the additional attributes.
     */
    protected decorateCaption(node: TreeNode, attrs: React.HTMLAttributes<HTMLElement>): React.Attributes & React.HTMLAttributes<HTMLElement>;
    /**
     * Determine if the tree node contains trailing suffixes.
     * @param node the tree node.
     *
     * @returns `true` if the tree node contains trailing suffices.
     */
    protected hasTrailingSuffixes(node: TreeNode): boolean;
    /**
     * Apply font styles to the tree.
     * @param original the original css properties.
     * @param fontData the optional `fontData`.
     */
    protected applyFontStyles(original: React.CSSProperties, fontData: TreeDecoration.FontData | undefined): React.CSSProperties;
    /**
     * Render caption affixes for the given tree node.
     * @param node the tree node.
     * @param props the node properties.
     * @param affixKey the affix key.
     */
    protected renderCaptionAffixes(node: TreeNode, props: NodeProps, affixKey: 'captionPrefixes' | 'captionSuffixes'): React.ReactNode;
    /**
     * Decorate the tree node icon.
     * @param node the tree node.
     * @param icon the icon.
     */
    protected decorateIcon(node: TreeNode, icon: React.ReactNode): React.ReactNode;
    /**
     * Render the tree node tail decorations.
     * @param node the tree node.
     * @param props the node properties.
     */
    protected renderTailDecorations(node: TreeNode, props: NodeProps): React.ReactNode;
    protected renderTailDecorationsForNode(node: TreeNode, props: NodeProps, tailDecorations: TreeDecoration.TailDecoration.AnyPartial[]): React.ReactNode;
    /**
     * Determine the classes to use for an icon
     * - Assumes a Font Awesome name when passed a single string, otherwise uses the passed string array
     * @param iconName the icon name or list of icon names.
     * @param additionalClasses additional CSS classes.
     *
     * @returns the icon class name.
     */
    protected getIconClass(iconName: string | string[], additionalClasses?: string[]): string;
    /**
     * Render indent for the file tree based on the depth
     * @param node the tree node.
     * @param depth the depth of the tree node.
     */
    protected renderIndent(node: TreeNode, props: NodeProps): React.ReactNode;
    protected needsActiveIndentGuideline(node: TreeNode): boolean;
    /**
     * Render the node given the tree node and node properties.
     * @param node the tree node.
     * @param props the node properties.
     */
    protected renderNode(node: TreeNode, props: NodeProps): React.ReactNode;
    /**
     * Create node attributes for the tree node given the node properties.
     * @param node the tree node.
     * @param props the node properties.
     */
    protected createNodeAttributes(node: TreeNode, props: NodeProps): React.Attributes & React.HTMLAttributes<HTMLElement>;
    /**
     * Create the node class names.
     * @param node the tree node.
     * @param props the node properties.
     *
     * @returns the list of tree node class names.
     */
    protected createNodeClassNames(node: TreeNode, props: NodeProps): string[];
    protected rowIsSelected(node: TreeNode, props: NodeProps): boolean;
    /**
     * Get the default node style.
     * @param node the tree node.
     * @param props the node properties.
     *
     * @returns the CSS properties if available.
     */
    protected getDefaultNodeStyle(node: TreeNode, props: NodeProps): React.CSSProperties | undefined;
    protected getPaddingLeft(node: TreeNode, props: NodeProps): number;
    /**
     * If the node is a composite, a toggle will be rendered.
     * Otherwise we need to add the width and the left, right padding => 18px
     */
    protected needsExpansionTogglePadding(node: TreeNode): boolean;
    /**
     * Create the tree node style.
     * @param node the tree node.
     * @param props the node properties.
     */
    protected createNodeStyle(node: TreeNode, props: NodeProps): React.CSSProperties | undefined;
    /**
     * Decorate the node style.
     * @param node the tree node.
     * @param style the optional CSS properties.
     *
     * @returns the CSS styles if available.
     */
    protected decorateNodeStyle(node: TreeNode, style: React.CSSProperties | undefined): React.CSSProperties | undefined;
    /**
     * Determine if the tree node is expandable.
     * @param node the tree node.
     *
     * @returns `true` if the tree node is expandable.
     */
    protected isExpandable(node: TreeNode): node is ExpandableTreeNode;
    /**
     * Get the tree node decorations.
     * @param node the tree node.
     *
     * @returns the list of tree decoration data.
     */
    protected getDecorations(node: TreeNode): TreeDecoration.Data[];
    /**
     * Get the tree decoration data for the given key.
     * @param node the tree node.
     * @param key the tree decoration data key.
     *
     * @returns the tree decoration data at the given key.
     */
    protected getDecorationData<K extends keyof TreeDecoration.Data>(node: TreeNode, key: K): Required<Pick<TreeDecoration.Data, K>>[K][];
    /**
     * Store the last scroll state.
     */
    protected lastScrollState: {
        /**
         * The scroll top value.
         */
        scrollTop: number;
        /**
         * The scroll left value.
         */
        scrollLeft: number;
    } | undefined;
    /**
     * Get the scroll container.
     */
    protected getScrollContainer(): MaybePromise<HTMLElement>;
    protected onAfterAttach(msg: Message): void;
    /**
     * Handle the `left arrow` keyboard event.
     * @param event the `left arrow` keyboard event.
     */
    protected handleLeft(event: KeyboardEvent): Promise<void>;
    /**
     * Handle the `right arrow` keyboard event.
     * @param event the `right arrow` keyboard event.
     */
    protected handleRight(event: KeyboardEvent): Promise<void>;
    /**
     * Handle the `up arrow` keyboard event.
     * @param event the `up arrow` keyboard event.
     */
    protected handleUp(event: KeyboardEvent): void;
    /**
     * Handle the `down arrow` keyboard event.
     * @param event the `down arrow` keyboard event.
     */
    protected handleDown(event: KeyboardEvent): void;
    /**
     * Handle the `enter key` keyboard event.
     * - `enter` opens the tree node.
     * @param event the `enter key` keyboard event.
     */
    protected handleEnter(event: KeyboardEvent): void;
    /**
     * Handle the `space key` keyboard event.
     * - By default should be similar to a single-click action.
     * @param event the `space key` keyboard event.
     */
    protected handleSpace(event: KeyboardEvent): void;
    protected handleEscape(event: KeyboardEvent): void;
    /**
     * Handle the single-click mouse event.
     * @param node the tree node if available.
     * @param event the mouse single-click event.
     */
    protected handleClickEvent(node: TreeNode | undefined, event: React.MouseEvent<HTMLElement>): void;
    /**
     * The effective handler of an unmodified single-click event.
     */
    protected tapNode(node?: TreeNode): void;
    /**
     * Handle the double-click mouse event.
     * @param node the tree node if available.
     * @param event the double-click mouse event.
     */
    protected handleDblClickEvent(node: TreeNode | undefined, event: React.MouseEvent<HTMLElement>): void;
    /**
     * Handle the middle-click mouse event.
     * @param node the tree node if available.
     * @param event the middle-click mouse event.
     */
    protected handleAuxClickEvent(node: TreeNode | undefined, event: React.MouseEvent<HTMLElement>): void;
    /**
     * Handle the middle-click mouse event.
     * @param event the middle-click mouse event.
     */
    protected handleMiddleClickEvent(event: MouseEvent): void;
    /**
     * Handle the context menu click event.
     * - The context menu click event is triggered by the right-click.
     * @param node the tree node if available.
     * @param event the right-click mouse event.
     */
    protected handleContextMenuEvent(node: TreeNode | undefined, event: React.MouseEvent<HTMLElement>): void;
    /**
     * Handle the double-click mouse event on the expansion toggle.
     */
    protected readonly handleExpansionToggleDblClickEvent: (event: React.MouseEvent<HTMLElement>) => void;
    /**
     * Actually handle the double-click mouse event on the expansion toggle.
     * @param event the double-click mouse event.
     */
    protected doHandleExpansionToggleDblClickEvent(event: React.MouseEvent<HTMLElement>): void;
    /**
     * Convert the tree node to context menu arguments.
     * @param node the selectable tree node.
     */
    protected toContextMenuArgs(node: SelectableTreeNode): any[] | undefined;
    /**
     * Determine if the tree modifier aware event has a `ctrlcmd` mask.
     * @param event the tree modifier aware event.
     *
     * @returns `true` if the tree modifier aware event contains the `ctrlcmd` mask.
     */
    protected hasCtrlCmdMask(event: TreeWidget.ModifierAwareEvent): boolean;
    /**
     * Determine if the tree modifier aware event has a `shift` mask.
     * @param event the tree modifier aware event.
     *
     * @returns `true` if the tree modifier aware event contains the `shift` mask.
     */
    protected hasShiftMask(event: TreeWidget.ModifierAwareEvent): boolean;
    /**
     * Deflate the tree node for storage.
     * @param node the tree node.
     */
    protected deflateForStorage(node: TreeNode): object;
    /**
     * Inflate the tree node from storage.
     * @param node the tree node.
     * @param parent the optional tree node.
     */
    protected inflateFromStorage(node: any, parent?: TreeNode): TreeNode;
    /**
     * Store the tree state.
     */
    storeState(): object;
    /**
     * Restore the state.
     * @param oldState the old state object.
     */
    restoreState(oldState: object): void;
    protected toNodeIcon(node: TreeNode): string;
    protected toNodeName(node: TreeNode): string;
    protected toNodeDescription(node: TreeNode): string;
    protected getDepthPadding(depth: number): number;
}
export declare namespace TreeWidget {
    /**
     * Representation of a tree node row.
     */
    interface NodeRow {
        /**
         * The node row index.
         */
        index: number;
        /**
         * The actual node.
         */
        node: TreeNode;
        /**
         * A root relative number representing the hierarchical depth of the actual node. Root is `0`, its children have `1` and so on.
         */
        depth: number;
    }
    /**
     * Representation of the tree view properties.
     */
    interface ViewProps {
        /**
         * The width property.
         */
        width: number;
        /**
         * The height property.
         */
        height: number;
        /**
         * The scroll to row value.
         */
        scrollToRow?: number;
        /**
         * The list of node rows.
         */
        rows: NodeRow[];
        renderNodeRow: (row: NodeRow) => React.ReactNode;
    }
    class View extends React.Component<ViewProps> {
        list: VirtuosoHandle | undefined;
        render(): React.ReactNode;
    }
}
//# sourceMappingURL=tree-widget.d.ts.map