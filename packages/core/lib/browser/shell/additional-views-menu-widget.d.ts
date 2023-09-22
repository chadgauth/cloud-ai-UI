import { CommandRegistry, Disposable, MenuModelRegistry, MenuPath } from '../../common';
import { Title, Widget } from '../widgets';
import { SidebarMenuWidget } from './sidebar-menu-widget';
import { SideTabBar } from './tab-bars';
export declare const AdditionalViewsMenuWidgetFactory: unique symbol;
export declare type AdditionalViewsMenuWidgetFactory = (side: 'left' | 'right') => AdditionalViewsMenuWidget;
export declare const ADDITIONAL_VIEWS_MENU_PATH: MenuPath;
export declare class AdditionalViewsMenuWidget extends SidebarMenuWidget {
    static readonly ID = "sidebar.additional.views";
    side: 'left' | 'right';
    protected readonly commandRegistry: CommandRegistry;
    protected readonly menuModelRegistry: MenuModelRegistry;
    protected menuDisposables: Disposable[];
    updateAdditionalViews(sender: SideTabBar, event: {
        titles: Title<Widget>[];
        startIndex: number;
    }): void;
    protected registerMenuAction(sender: SideTabBar, title: Title<Widget>, index: number): void;
}
//# sourceMappingURL=additional-views-menu-widget.d.ts.map