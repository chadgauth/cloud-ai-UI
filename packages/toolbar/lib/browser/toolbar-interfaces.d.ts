import { interfaces } from '@theia/core/shared/inversify';
import { ReactTabBarToolbarItem, TabBarToolbar, TabBarToolbarItem } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
export declare enum ToolbarAlignment {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}
export interface ToolbarTreeSchema {
    items: {
        [key in ToolbarAlignment]: ToolbarItem[][];
    };
}
export interface DeflatedToolbarTree {
    items: {
        [key in ToolbarAlignment]: ToolbarItemDeflated[][];
    };
}
export declare namespace ToolbarAlignmentString {
    const is: (obj: unknown) => obj is ToolbarAlignment;
}
export interface ToolbarContributionProperties {
    toJSON(): DeflatedContributedToolbarItem;
}
export declare type ToolbarContribution = ReactTabBarToolbarItem & ToolbarContributionProperties;
export declare const ToolbarContribution: unique symbol;
export declare const Toolbar: unique symbol;
export declare const ToolbarFactory: unique symbol;
export declare type Toolbar = TabBarToolbar;
export declare type ToolbarItem = ToolbarContribution | TabBarToolbarItem;
export interface DeflatedContributedToolbarItem {
    id: string;
    group: 'contributed';
}
export declare type ToolbarItemDeflated = DeflatedContributedToolbarItem | TabBarToolbarItem;
export declare const LateInjector: unique symbol;
export declare const lateInjector: <T>(context: interfaces.Container, serviceIdentifier: interfaces.ServiceIdentifier<T>) => T;
export interface ToolbarItemPosition {
    alignment: ToolbarAlignment;
    groupIndex: number;
    itemIndex: number;
}
export declare enum IconSet {
    FA = "fa",
    CODICON = "codicon"
}
//# sourceMappingURL=toolbar-interfaces.d.ts.map