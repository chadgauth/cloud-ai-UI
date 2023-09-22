/// <reference types="lodash" />
import { PreferenceService, ContextMenuRenderer, PreferenceInspection, PreferenceScope, OpenerService, PreferenceDataProperty } from '@theia/core/lib/browser';
import { Preference } from '../../util/preference-types';
import { PreferenceTreeLabelProvider } from '../../util/preference-tree-label-provider';
import { PreferencesScopeTabBar } from '../preference-scope-tabbar-widget';
import { Disposable } from '@theia/core/lib/common';
import { JSONValue } from '@theia/core/shared/@phosphor/coreutils';
import { PreferenceTreeModel } from '../../preference-tree-model';
import { PreferencesSearchbarWidget } from '../preference-searchbar-widget';
import { PreferenceMarkdownRenderer } from './preference-markdown-renderer';
export declare const PreferenceNodeRendererFactory: unique symbol;
export declare type PreferenceNodeRendererFactory = (node: Preference.TreeNode) => PreferenceNodeRenderer;
export declare const HEADER_CLASS = "settings-section-category-title";
export declare const SUBHEADER_CLASS = "settings-section-subcategory-title";
export interface GeneralPreferenceNodeRenderer extends Disposable {
    node: HTMLElement;
    id: string;
    schema?: PreferenceDataProperty;
    group: string;
    nodeId: string;
    visible: boolean;
    insertBefore(nextSibling: HTMLElement): void;
    insertAfter(previousSibling: HTMLElement): void;
    appendTo(parent: HTMLElement): void;
    prependTo(parent: HTMLElement): void;
    handleValueChange?(): void;
    handleSearchChange?(isFiltered?: boolean): void;
    handleScopeChange?(isFiltered?: boolean): void;
    hide(): void;
    show(): void;
}
export declare abstract class PreferenceNodeRenderer implements Disposable, GeneralPreferenceNodeRenderer {
    protected readonly preferenceNode: Preference.Node;
    protected readonly labelProvider: PreferenceTreeLabelProvider;
    protected attached: boolean;
    _id: string;
    _group: string;
    _subgroup: string;
    protected domNode: HTMLElement;
    get node(): HTMLElement;
    get nodeId(): string;
    get id(): string;
    get group(): string;
    get visible(): boolean;
    protected init(): void;
    protected setId(): void;
    protected abstract createDomNode(): HTMLElement;
    protected getAdditionalNodeClassnames(): Iterable<string>;
    insertBefore(nextSibling: HTMLElement): void;
    insertAfter(previousSibling: HTMLElement): void;
    appendTo(parent: HTMLElement): void;
    prependTo(parent: HTMLElement): void;
    hide(): void;
    show(): void;
    dispose(): void;
}
export declare class PreferenceHeaderRenderer extends PreferenceNodeRenderer {
    protected createDomNode(): HTMLElement;
}
export declare abstract class PreferenceLeafNodeRenderer<ValueType extends JSONValue, InteractableType extends HTMLElement> extends PreferenceNodeRenderer implements Required<GeneralPreferenceNodeRenderer> {
    protected readonly preferenceNode: Preference.LeafNode;
    protected readonly preferenceService: PreferenceService;
    protected readonly menuRenderer: ContextMenuRenderer;
    protected readonly scopeTracker: PreferencesScopeTabBar;
    protected readonly model: PreferenceTreeModel;
    protected readonly searchbar: PreferencesSearchbarWidget;
    protected readonly openerService: OpenerService;
    protected readonly markdownRenderer: PreferenceMarkdownRenderer;
    protected headlineWrapper: HTMLDivElement;
    protected gutter: HTMLDivElement;
    protected interactable: InteractableType;
    protected inspection: PreferenceInspection<ValueType> | undefined;
    protected isModifiedFromDefault: boolean;
    get schema(): PreferenceDataProperty;
    protected init(): void;
    protected updateInspection(): void;
    protected openLink(event: MouseEvent): void;
    protected createDomNode(): HTMLLIElement;
    protected handleCogAction({ currentTarget }: KeyboardEvent | MouseEvent): void;
    protected addModifiedMarking(): void;
    protected removeModifiedMarking(): void;
    protected showCog(): void;
    protected hideCog(): void;
    protected updateModificationStatus(knownCurrentValue?: JSONValue): void;
    protected updateHeadline(filtered?: boolean): void;
    protected compareOtherModifiedScopes(headlineWrapper: HTMLDivElement, currentSuffix: HTMLElement): void;
    protected createOtherModifiedScopes(headlineWrapper: HTMLDivElement): void;
    protected createModifiedScopeMessage(scope: PreferenceScope): HTMLSpanElement;
    protected getModifiedMessagePrefix(): string;
    protected addEventHandlerToModifiedScope(scope: PreferenceScope, scopeWrapper: HTMLElement): void;
    protected getModifiedScopesAsStrings(): PreferenceScope[];
    protected getValue(): ValueType | null;
    protected setPreferenceWithDebounce: import("lodash").DebouncedFunc<any>;
    protected setPreferenceImmediately(value: ValueType | undefined): Promise<void>;
    handleSearchChange(isFiltered?: boolean): void;
    handleScopeChange(isFiltered?: boolean): void;
    handleValueChange(): void;
    /**
     * Should create an HTML element that the user can interact with to change the value of the preference.
     * @param container the parent element for the interactable. This method is responsible for adding the new element to its parent.
     */
    protected abstract createInteractable(container: HTMLElement): void;
    /**
     * @returns a fallback default value for a preference of the type implemented by a concrete leaf renderer
     * This function is only called if the default value for a given preference is not specified in its schema.
     */
    protected abstract getFallbackValue(): ValueType;
    /**
     * This function is responsible for reconciling the display of the preference value with the value reported by the PreferenceService.
     */
    protected abstract doHandleValueChange(): void;
}
//# sourceMappingURL=preference-node-renderer.d.ts.map