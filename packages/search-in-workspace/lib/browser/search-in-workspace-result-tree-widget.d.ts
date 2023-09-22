/// <reference types="lodash" />
/// <reference types="react" />
import { TreeWidget, CompositeTreeNode, ContextMenuRenderer, ExpandableTreeNode, SelectableTreeNode, TreeModel, TreeNode, NodeProps, TreeProps, TreeExpansionService, ApplicationShell } from '@theia/core/lib/browser';
import { CancellationTokenSource, Emitter, Event, ProgressService } from '@theia/core';
import { EditorManager, EditorDecoration, EditorWidget } from '@theia/editor/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileResourceResolver, FileSystemPreferences } from '@theia/filesystem/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { SearchInWorkspaceResult, SearchInWorkspaceOptions, SearchMatch } from '../common/search-in-workspace-interface';
import { SearchInWorkspaceService } from './search-in-workspace-service';
import URI from '@theia/core/lib/common/uri';
import * as React from '@theia/core/shared/react';
import { SearchInWorkspacePreferences } from './search-in-workspace-preferences';
import { ColorRegistry } from '@theia/core/lib/browser/color-registry';
import { DisposableCollection } from '@theia/core/lib/common/disposable';
export interface SearchInWorkspaceRoot extends CompositeTreeNode {
    children: SearchInWorkspaceRootFolderNode[];
}
export declare namespace SearchInWorkspaceRoot {
    function is(node: unknown): node is SearchInWorkspaceRoot;
}
export interface SearchInWorkspaceRootFolderNode extends ExpandableTreeNode, SelectableTreeNode {
    name?: undefined;
    icon?: undefined;
    children: SearchInWorkspaceFileNode[];
    parent: SearchInWorkspaceRoot;
    path: string;
    folderUri: string;
    uri: URI;
}
export declare namespace SearchInWorkspaceRootFolderNode {
    function is(node: unknown): node is SearchInWorkspaceRootFolderNode;
}
export interface SearchInWorkspaceFileNode extends ExpandableTreeNode, SelectableTreeNode {
    name?: undefined;
    icon?: undefined;
    children: SearchInWorkspaceResultLineNode[];
    parent: SearchInWorkspaceRootFolderNode;
    path: string;
    fileUri: string;
    uri: URI;
}
export declare namespace SearchInWorkspaceFileNode {
    function is(node: unknown): node is SearchInWorkspaceFileNode;
}
export interface SearchInWorkspaceResultLineNode extends SelectableTreeNode, SearchInWorkspaceResult, SearchMatch {
    parent: SearchInWorkspaceFileNode;
}
export declare namespace SearchInWorkspaceResultLineNode {
    function is(node: unknown): node is SearchInWorkspaceResultLineNode;
}
export declare class SearchInWorkspaceResultTreeWidget extends TreeWidget {
    protected resultTree: Map<string, SearchInWorkspaceRootFolderNode>;
    protected _showReplaceButtons: boolean;
    protected _replaceTerm: string;
    protected searchTerm: string;
    protected searchOptions: SearchInWorkspaceOptions;
    protected readonly startSearchOnModification: (activeEditor: EditorWidget) => import("lodash").DebouncedFunc<() => void>;
    protected readonly searchOnEditorModificationDelay = 300;
    protected readonly toDisposeOnActiveEditorChanged: DisposableCollection;
    protected readonly defaultRootName: string;
    protected forceVisibleRootNode: boolean;
    protected appliedDecorations: Map<string, string[]>;
    cancelIndicator?: CancellationTokenSource;
    protected changeEmitter: Emitter<Map<string, SearchInWorkspaceRootFolderNode>>;
    protected onExpansionChangedEmitter: Emitter<any>;
    readonly onExpansionChanged: Event<void>;
    protected focusInputEmitter: Emitter<any>;
    protected readonly searchService: SearchInWorkspaceService;
    protected readonly editorManager: EditorManager;
    protected readonly fileResourceResolver: FileResourceResolver;
    protected readonly shell: ApplicationShell;
    protected readonly workspaceService: WorkspaceService;
    protected readonly expansionService: TreeExpansionService;
    protected readonly searchInWorkspacePreferences: SearchInWorkspacePreferences;
    protected readonly progressService: ProgressService;
    protected readonly colorRegistry: ColorRegistry;
    protected readonly filesystemPreferences: FileSystemPreferences;
    protected readonly fileService: FileService;
    constructor(props: TreeProps, model: TreeModel, contextMenuRenderer: ContextMenuRenderer);
    protected init(): void;
    get fileNumber(): number;
    set showReplaceButtons(srb: boolean);
    set replaceTerm(rt: string);
    get isReplacing(): boolean;
    get onChange(): Event<Map<string, SearchInWorkspaceRootFolderNode>>;
    get onFocusInput(): Event<void>;
    collapseAll(): void;
    expandAll(): void;
    areResultsCollapsed(): boolean;
    /**
     * Find matches for the given editor.
     * @param searchTerm the search term.
     * @param widget the editor widget.
     * @param searchOptions the search options to apply.
     *
     * @returns the list of matches.
     */
    protected findMatches(searchTerm: string, widget: EditorWidget, searchOptions: SearchInWorkspaceOptions): SearchMatch[];
    /**
     * Convert a pattern to match all directories.
     * @param workspaceRootUri the uri of the current workspace root.
     * @param pattern the pattern to be converted.
     */
    protected convertPatternToGlob(workspaceRootUri: URI | undefined, pattern: string): string;
    /**
     * Determine if the URI matches any of the patterns.
     * @param uri the editor URI.
     * @param patterns the glob patterns to verify.
     */
    protected inPatternList(uri: URI, patterns: string[]): boolean;
    /**
     * Determine if the given editor satisfies the filtering criteria.
     * An editor should be searched only if:
     * - it is not excluded through the `excludes` list.
     * - it is not explicitly present in a non-empty `includes` list.
     */
    protected shouldApplySearch(editorWidget: EditorWidget, searchOptions: SearchInWorkspaceOptions): boolean;
    /**
     * Search the active editor only and update the tree with those results.
     */
    protected searchActiveEditor(activeEditor: EditorWidget, searchTerm: string, searchOptions: SearchInWorkspaceOptions): void;
    /**
     * Perform a search in all open editors.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     *
     * @returns the tuple of result count, and the list of search results.
     */
    protected searchInOpenEditors(searchTerm: string, searchOptions: SearchInWorkspaceOptions): {
        numberOfResults: number;
        matches: SearchInWorkspaceResult[];
    };
    /**
     * Perform a search in the target editor.
     * @param editorWidget the editor widget.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     *
     * @returns the search results from the given editor, undefined if the editor is either filtered or has no matches found.
     */
    protected searchInEditor(editorWidget: EditorWidget, searchTerm: string, searchOptions: SearchInWorkspaceOptions): SearchInWorkspaceResult | undefined;
    /**
     * Append search results to the result tree.
     * @param result Search result.
     */
    protected appendToResultTree(result: SearchInWorkspaceResult): void;
    /**
     * Handle when searching completed.
     */
    protected handleSearchCompleted(cancelIndicator?: CancellationTokenSource): void;
    /**
     * Sort the result tree by URIs.
     */
    protected sortResultTree(): void;
    /**
     * Search and populate the result tree with matches.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     */
    search(searchTerm: string, searchOptions: SearchInWorkspaceOptions): Promise<void>;
    focusFirstResult(): void;
    /**
     * Collapse the search-in-workspace file node
     * based on the preference value.
     */
    protected collapseFileNode(node: SearchInWorkspaceFileNode, preferenceValue: string): void;
    protected handleUp(event: KeyboardEvent): void;
    protected refreshModelChildren(): Promise<void>;
    protected updateCurrentEditorDecorations(): void;
    protected createRootFolderNode(rootUri: string): SearchInWorkspaceRootFolderNode;
    protected createFileNode(rootUri: string, path: string, fileUri: string, parent: SearchInWorkspaceRootFolderNode): SearchInWorkspaceFileNode;
    protected createResultLineNode(result: SearchInWorkspaceResult, match: SearchMatch, fileNode: SearchInWorkspaceFileNode): SearchInWorkspaceResultLineNode;
    protected getFileNodesByUri(uri: URI): SearchInWorkspaceFileNode[];
    protected filenameAndPath(rootUriStr: string, uriStr: string): {
        name: string;
        path: string;
    };
    protected getDepthPadding(depth: number): number;
    protected renderCaption(node: TreeNode, props: NodeProps): React.ReactNode;
    protected renderTailDecorations(node: TreeNode, props: NodeProps): React.ReactNode;
    protected doReplace(node: TreeNode, e: React.MouseEvent<HTMLElement>): void;
    protected renderReplaceButton(node: TreeNode): React.ReactNode;
    protected getFileCount(node: TreeNode): number;
    protected getResultCount(node: TreeNode): number;
    /**
     * Replace results under the node passed into the function. If node is undefined, replace all results.
     * @param node Node in the tree widget where the "replace all" operation is performed
     */
    replace(node: TreeNode | undefined): Promise<void>;
    protected confirmReplaceAll(resultNumber: number, fileNumber: number, replacementText: string): Promise<boolean | undefined>;
    protected buildReplaceAllConfirmationMessage(occurrences: number, fileCount: number, replaceValue: string): string;
    protected updateRightResults(node: SearchInWorkspaceResultLineNode): void;
    /**
     * Replace text either in all search matches under a node or in all search matches, and save the changes.
     * @param node - node in the tree widget in which the "replace all" is performed.
     * @param {boolean} replaceOne - whether the function is to replace all matches under a node. If it is false, replace all.
     * @param replacementText - text to be used for all replacements in the current replacement cycle.
     */
    protected replaceResult(node: TreeNode, replaceOne: boolean, replacementText: string): Promise<void>;
    protected readonly remove: (node: TreeNode, e: React.MouseEvent<HTMLElement>) => void;
    protected doRemove(node: TreeNode, e: React.MouseEvent<HTMLElement>): void;
    protected renderRemoveButton(node: TreeNode): React.ReactNode;
    removeNode(node: TreeNode): void;
    private removeRootFolderNode;
    private removeFileNode;
    private removeResultLineNode;
    protected renderRootFolderNode(node: SearchInWorkspaceRootFolderNode): React.ReactNode;
    protected renderFileNode(node: SearchInWorkspaceFileNode): React.ReactNode;
    protected renderResultLineNode(node: SearchInWorkspaceResultLineNode): React.ReactNode;
    protected renderMatchLinePart(node: SearchInWorkspaceResultLineNode): React.ReactNode;
    /**
     * Get the editor widget by the node.
     * @param {SearchInWorkspaceResultLineNode} node - the node representing a match in the search results.
     * @returns The editor widget to which the text replace will be done.
     */
    protected doGetWidget(node: SearchInWorkspaceResultLineNode): Promise<EditorWidget>;
    protected doOpen(node: SearchInWorkspaceResultLineNode, asDiffWidget?: boolean, preview?: boolean): Promise<EditorWidget>;
    protected createReplacePreview(node: SearchInWorkspaceFileNode): Promise<URI>;
    protected decorateEditor(node: SearchInWorkspaceFileNode | undefined, editorWidget: EditorWidget): void;
    protected createEditorDecorations(resultNode: SearchInWorkspaceFileNode | undefined): EditorDecoration[];
    /**
     * Get the list of exclude globs.
     * @param excludeOptions the exclude search option.
     *
     * @returns the list of exclude globs.
     */
    protected getExcludeGlobs(excludeOptions?: string[]): string[];
    /**
     * Compare two normalized strings.
     *
     * @param a {string} the first string.
     * @param b {string} the second string.
     */
    private compare;
    /**
     * @param recursive if true, all child nodes will be included in the stringified result.
     */
    nodeToString(node: TreeNode, recursive: boolean): string;
    treeToString(): string;
    protected getVisibleNodes(): IterableIterator<TreeNode>;
    protected nodeIteratorToString(nodes: Iterable<TreeNode>): string;
}
export declare namespace SearchInWorkspaceResultTreeWidget {
    namespace Menus {
        const BASE: string[];
        /** Dismiss command, or others that only affect the widget itself */
        const INTERNAL: string[];
        /** Copy a stringified representation of content */
        const COPY: string[];
        /** Commands that lead out of the widget, like revealing a file in the navigator */
        const EXTERNAL: string[];
    }
}
//# sourceMappingURL=search-in-workspace-result-tree-widget.d.ts.map