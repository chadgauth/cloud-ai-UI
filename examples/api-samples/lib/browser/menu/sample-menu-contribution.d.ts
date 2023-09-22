import { QuickInputService } from '@theia/core/lib/browser';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MenuNode, MessageService, SubMenuOptions } from '@theia/core/lib/common';
import { interfaces } from '@theia/core/shared/inversify';
export declare class SampleCommandContribution implements CommandContribution {
    protected readonly quickInputService: QuickInputService;
    protected readonly messageService: MessageService;
    registerCommands(commands: CommandRegistry): void;
}
export declare class SampleMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void;
}
/**
 * Special menu node that is not backed by any commands and is always disabled.
 */
export declare class PlaceholderMenuNode implements MenuNode {
    readonly id: string;
    readonly label: string;
    protected options?: SubMenuOptions | undefined;
    constructor(id: string, label: string, options?: SubMenuOptions | undefined);
    get icon(): string | undefined;
    get sortString(): string;
}
export declare const bindSampleMenu: (bind: interfaces.Bind) => void;
//# sourceMappingURL=sample-menu-contribution.d.ts.map