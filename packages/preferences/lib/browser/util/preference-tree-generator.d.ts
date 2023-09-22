/// <reference types="lodash" />
import { CompositeTreeNode, PreferenceSchemaProvider, PreferenceDataProperty } from '@theia/core/lib/browser';
import { PreferenceConfigurations } from '@theia/core/lib/browser/preferences/preference-configurations';
import { Emitter } from '@theia/core';
import { Preference } from './preference-types';
export declare const COMMONLY_USED_SECTION_PREFIX = "commonly-used";
export declare class PreferenceTreeGenerator {
    protected readonly schemaProvider: PreferenceSchemaProvider;
    protected readonly preferenceConfigs: PreferenceConfigurations;
    protected _root: CompositeTreeNode;
    protected readonly onSchemaChangedEmitter: Emitter<CompositeTreeNode>;
    readonly onSchemaChanged: import("@theia/core").Event<CompositeTreeNode>;
    protected readonly commonlyUsedPreferences: string[];
    protected readonly topLevelCategories: Map<string, string>;
    protected readonly sectionAssignments: Map<string, string>;
    protected readonly defaultTopLevelCategory = "extensions";
    get root(): CompositeTreeNode;
    protected init(): void;
    protected doInit(): Promise<void>;
    generateTree(): CompositeTreeNode;
    getNodeId(preferenceId: string): string;
    protected getGroupName(labels: string[]): string;
    protected getSubgroupName(labels: string[], computedGroupName: string): string | undefined;
    doHandleChangedSchema(): void;
    handleChangedSchema: import("lodash").DebouncedFunc<() => void>;
    protected createRootNode(): CompositeTreeNode;
    protected createLeafNode(property: string, preferencesGroup: Preference.CompositeTreeNode, data: PreferenceDataProperty): Preference.LeafNode;
    protected createPreferencesGroup(id: string, group: string, root: CompositeTreeNode): Preference.CompositeTreeNode;
    getCustomLabelFor(id: string): string | undefined;
    protected getOrCreatePreferencesGroup(id: string, group: string, root: CompositeTreeNode, groups: Map<string, Preference.CompositeTreeNode>): Preference.CompositeTreeNode;
}
//# sourceMappingURL=preference-tree-generator.d.ts.map