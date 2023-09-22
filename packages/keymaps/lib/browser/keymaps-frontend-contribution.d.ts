import { CommandContribution, Command, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import { AbstractViewContribution, Widget } from '@theia/core/lib/browser';
import { KeymapsService } from './keymaps-service';
import { KeybindingRegistry } from '@theia/core/lib/browser/keybinding';
import { KeybindingWidget } from './keybindings-widget';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
export declare namespace KeymapsCommands {
    const OPEN_KEYMAPS: Command;
    const OPEN_KEYMAPS_JSON: Command;
    const OPEN_KEYMAPS_JSON_TOOLBAR: Command;
    const CLEAR_KEYBINDINGS_SEARCH: Command;
}
export declare class KeymapsFrontendContribution extends AbstractViewContribution<KeybindingWidget> implements CommandContribution, MenuContribution, TabBarToolbarContribution {
    protected readonly keymaps: KeymapsService;
    constructor();
    registerCommands(commands: CommandRegistry): void;
    registerMenus(menus: MenuModelRegistry): void;
    registerKeybindings(keybindings: KeybindingRegistry): void;
    registerToolbarItems(toolbar: TabBarToolbarRegistry): Promise<void>;
    /**
     * Determine if the current widget is the keybindings widget.
     */
    protected withWidget<T>(widget: Widget | undefined, fn: (widget: KeybindingWidget) => T): T | false;
}
//# sourceMappingURL=keymaps-frontend-contribution.d.ts.map