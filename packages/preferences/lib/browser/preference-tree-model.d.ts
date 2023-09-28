import { TreeModelImpl, TreeWidget, CompositeTreeNode, TreeNode, PreferenceSchemaProvider, PreferenceDataProperty, NodeProps, SelectableTreeNode, PreferenceService } from '@theia/core/lib/browser';
import { Emitter } from '@theia/core';
import { PreferencesSearchbarWidget } from './views/preference-searchbar-widget';
import { PreferenceTreeGenerator } from './util/preference-tree-generator';
import { PreferencesScopeTabBar } from './views/preference-scope-tabbar-widget';
import { Preference } from './util/preference-types';
import { Event } from '@theia/core/lib/common';
export interface PreferenceTreeNodeProps extends NodeProps {
    visibleChildren: number;
    isExpansible?: boolean;
}
export interface PreferenceTreeNodeRow extends Readonly<TreeWidget.NodeRow>, PreferenceTreeNodeProps {
    node: Preference.TreeNode;
}
export declare enum PreferenceFilterChangeSource {
    Schema = 0,
    Search = 1,
    Scope = 2
}
export interface PreferenceFilterChangeEvent {
    source: PreferenceFilterChangeSource;
}
export declare class PreferenceTreeModel extends TreeModelImpl {
    protected readonly schemaProvider: PreferenceSchemaProvider;
    protected readonly filterInput: PreferencesSearchbarWidget;
    protected readonly treeGenerator: PreferenceTreeGenerator;
    protected readonly scopeTracker: PreferencesScopeTabBar;
    protected readonly preferenceService: PreferenceService;
    protected readonly onTreeFilterChangedEmitter: Emitter<PreferenceFilterChangeEvent>;
    readonly onFilterChanged: Event<PreferenceFilterChangeEvent>;
    protected lastSearchedFuzzy: string;
    protected lastSearchedLiteral: string;
    protected _currentScope: number;
    protected _isFiltered: boolean;
    protected _currentRows: Map<string, PreferenceTreeNodeRow>;
    protected _totalVisibleLeaves: number;
    get currentRows(): Readonly<Map<string, PreferenceTreeNodeRow>>;
    get totalVisibleLeaves(): number;
    get isFiltered(): boolean;
    get propertyList(): {
        [key: string]: PreferenceDataProperty;
    };
    get currentScope(): Preference.SelectedScopeDetails;
    get onSchemaChanged(): Event<CompositeTreeNode>;
    protected init(): void;
    protected doInit(): Promise<void>;
    private handleNewSchema;
    protected updateRows(): void;
    protected updateFilteredRows(source: PreferenceFilterChangeSource): void;
    protected passesCurrentFilters(node: Preference.LeafNode, prefID: string): boolean;
    protected isVisibleSelectableNode(node: TreeNode): node is SelectableTreeNode;
    protected updateVisibleChildren(node: TreeNode): void;
    collapseAllExcept(openNode: TreeNode | undefined): void;
    protected expandAll(): void;
    getNodeFromPreferenceId(id: string): Preference.TreeNode | undefined;
    /**
     * @returns true if selection changed, false otherwise
     */
    selectIfNotSelected(node: SelectableTreeNode): boolean;
}
//# sourceMappingURL=preference-tree-model.d.ts.map