import * as React from 'react';
import { ContextKeyService } from '../../context-key-service';
import { CommandRegistry, Disposable, DisposableCollection, MenuCommandExecutor, MenuModelRegistry, MenuPath } from '../../../common';
import { Anchor, ContextMenuAccess, ContextMenuRenderer } from '../../context-menu-renderer';
import { LabelParser } from '../../label-parser';
import { ReactWidget, Widget } from '../../widgets';
import { TabBarToolbarRegistry } from './tab-bar-toolbar-registry';
import { AnyToolbarItem, ReactTabBarToolbarItem, TabBarToolbarItem, MenuToolbarItem } from './tab-bar-toolbar-types';
import { KeybindingRegistry } from '../..//keybinding';
/**
 * Factory for instantiating tab-bar toolbars.
 */
export declare const TabBarToolbarFactory: unique symbol;
export interface TabBarToolbarFactory {
    (): TabBarToolbar;
}
/**
 * Tab-bar toolbar widget representing the active [tab-bar toolbar items](TabBarToolbarItem).
 */
export declare class TabBarToolbar extends ReactWidget {
    protected current: Widget | undefined;
    protected inline: Map<string, TabBarToolbarItem | ReactTabBarToolbarItem>;
    protected more: Map<string, TabBarToolbarItem>;
    protected contextKeyListener: Disposable | undefined;
    protected toDisposeOnUpdateItems: DisposableCollection;
    protected keybindingContextKeys: Set<string>;
    protected readonly commands: CommandRegistry;
    protected readonly labelParser: LabelParser;
    protected readonly menus: MenuModelRegistry;
    protected readonly menuCommandExecutor: MenuCommandExecutor;
    protected readonly contextMenuRenderer: ContextMenuRenderer;
    protected readonly toolbarRegistry: TabBarToolbarRegistry;
    protected readonly contextKeyService: ContextKeyService;
    protected readonly keybindings: KeybindingRegistry;
    constructor();
    protected init(): void;
    updateItems(items: Array<TabBarToolbarItem | ReactTabBarToolbarItem>, current: Widget | undefined): void;
    updateTarget(current?: Widget): void;
    protected readonly toDisposeOnSetCurrent: DisposableCollection;
    protected setCurrent(current: Widget | undefined): void;
    protected updateContextKeyListener(contextKeys: Set<string>): void;
    protected render(): React.ReactNode;
    protected resolveKeybindingForCommand(command: string | undefined): string;
    protected renderItem(item: AnyToolbarItem): React.ReactNode;
    protected isEnabled(item: AnyToolbarItem): boolean;
    protected getToolbarItemClassNames(item: AnyToolbarItem): string[];
    protected renderMore(): React.ReactNode;
    protected showMoreContextMenu: (event: React.MouseEvent) => void;
    protected toAnchor(event: React.MouseEvent): Anchor;
    renderMoreContextMenu(anchor: Anchor, subpath?: MenuPath): ContextMenuAccess;
    /**
     * Renders a toolbar item that is a menu, presenting it as a button with a little
     * chevron decoration that pops up a floating menu when clicked.
     *
     * @param item a toolbar item that is a menu item
     * @returns the rendered toolbar item
     */
    protected renderMenuItem(item: TabBarToolbarItem & MenuToolbarItem): React.ReactNode;
    /**
     * Presents the menu to popup on the `event` that is the clicking of
     * a menu toolbar item.
     *
     * @param menuPath the path of the registered menu to show
     * @param event the mouse event triggering the menu
     */
    protected showPopupMenu: (menuPath: MenuPath, event: React.MouseEvent) => void;
    /**
     * Renders the menu popped up on a menu toolbar item.
     *
     * @param menuPath the path of the registered menu to render
     * @param anchor a description of where to render the menu
     * @returns platform-specific access to the rendered context menu
     */
    protected renderPopupMenu(menuPath: MenuPath, anchor: Anchor): ContextMenuAccess;
    shouldHandleMouseEvent(event: MouseEvent): boolean;
    protected commandIsEnabled(command: string): boolean;
    protected commandIsToggled(command: string): boolean;
    protected evaluateWhenClause(whenClause: string | undefined): boolean;
    protected executeCommand: (e: React.MouseEvent<HTMLElement>) => void;
    protected onMouseDownEvent: (e: React.MouseEvent<HTMLElement>) => void;
    protected onMouseUpEvent: (e: React.MouseEvent<HTMLElement>) => void;
}
export declare namespace TabBarToolbar {
    namespace Styles {
        const TAB_BAR_TOOLBAR = "p-TabBar-toolbar";
        const TAB_BAR_TOOLBAR_ITEM = "item";
    }
}
//# sourceMappingURL=tab-bar-toolbar.d.ts.map