/// <reference types="lodash" />
import { PreferenceService, SelectableTreeNode, StatefulWidget, PreferenceChanges, PreferenceSchemaProvider } from '@theia/core/lib/browser';
import { BaseWidget } from '@theia/core/lib/browser/widgets/widget';
import { PreferenceTreeModel, PreferenceFilterChangeEvent } from '../preference-tree-model';
import { PreferenceNodeRendererFactory, GeneralPreferenceNodeRenderer } from './components/preference-node-renderer';
import { Preference } from '../util/preference-types';
import { PreferencesScopeTabBar } from './preference-scope-tabbar-widget';
import { PreferenceNodeRendererCreatorRegistry } from './components/preference-node-renderer-creator';
export interface PreferencesEditorState {
    firstVisibleChildID: string;
}
export declare class PreferencesEditorWidget extends BaseWidget implements StatefulWidget {
    static readonly ID = "settings.editor";
    static readonly LABEL = "Settings Editor";
    scrollOptions: import("perfect-scrollbar").default.Options;
    protected scrollContainer: HTMLDivElement;
    /**
     * Guards against scroll events and selection events looping into each other. Set before this widget initiates a selection.
     */
    protected currentModelSelectionId: string;
    /**
     * Permits the user to expand multiple nodes without each one being collapsed on a new selection.
     */
    protected lastUserSelection: string;
    protected isAtScrollTop: boolean;
    protected firstVisibleChildID: string;
    protected renderers: Map<string, GeneralPreferenceNodeRenderer>;
    protected preferenceDataKeys: Map<string, string>;
    protected commonlyUsedRenderers: Map<string, GeneralPreferenceNodeRenderer>;
    protected readonly preferenceService: PreferenceService;
    protected readonly model: PreferenceTreeModel;
    protected readonly rendererFactory: PreferenceNodeRendererFactory;
    protected readonly rendererRegistry: PreferenceNodeRendererCreatorRegistry;
    protected readonly schemaProvider: PreferenceSchemaProvider;
    protected readonly tabbar: PreferencesScopeTabBar;
    protected init(): void;
    protected doInit(): Promise<void>;
    protected createContainers(): void;
    protected handleDisplayChange(e: PreferenceFilterChangeEvent): void;
    protected handleRegistryChange(): void;
    protected handleSchemaChange(isFiltered: boolean): void;
    protected handleScopeChange(isFiltered?: boolean): void;
    protected hasSchemaChanged(renderer: GeneralPreferenceNodeRenderer, node: Preference.LeafNode): boolean;
    protected handleSearchChange(isFiltered: boolean, leavesAreVisible: boolean): void;
    protected areLeavesVisible(): boolean;
    protected allRenderers(): IterableIterator<[string, GeneralPreferenceNodeRenderer, Map<string, GeneralPreferenceNodeRenderer>]>;
    protected handlePreferenceChanges(e: PreferenceChanges): void;
    /**
     * @returns true if the renderer is hidden, false otherwise.
     */
    protected hideIfFailsFilters(renderer: GeneralPreferenceNodeRenderer, isFiltered: boolean): boolean;
    protected resetScroll(nodeIDToScrollTo?: string, filterWasCleared?: boolean): void;
    protected doResetScroll(nodeIDToScrollTo?: string, filterWasCleared?: boolean): void;
    protected doOnScroll(): void;
    onScroll: import("lodash").DebouncedFunc<any>;
    protected findFirstVisibleChildID(): string | undefined;
    protected setFirstVisibleChildID(id?: string): void;
    protected handleSelectionChange(selectionEvent: readonly Readonly<SelectableTreeNode>[]): void;
    protected analyzeIDAndGetRendererGroup(nodeID: string): {
        id: string;
        group: string;
        collection: Map<string, GeneralPreferenceNodeRenderer>;
    };
    protected getScrollContainer(): HTMLElement;
    storeState(): PreferencesEditorState;
    restoreState(oldState: PreferencesEditorState): void;
}
//# sourceMappingURL=preference-editor-widget.d.ts.map