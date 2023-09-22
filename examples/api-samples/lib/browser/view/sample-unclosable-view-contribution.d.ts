import { interfaces } from '@theia/core/shared/inversify';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { Command, CommandRegistry, MessageService } from '@theia/core/lib/common';
import { Widget } from '@theia/core/lib/browser';
import { SampleViewUnclosableView } from './sample-unclosable-view';
export declare const SampleToolBarCommand: Command;
export declare class SampleUnclosableViewContribution extends AbstractViewContribution<SampleViewUnclosableView> implements TabBarToolbarContribution {
    static readonly SAMPLE_UNCLOSABLE_VIEW_TOGGLE_COMMAND_ID = "sampleUnclosableView:toggle";
    protected toolbarItemState: boolean;
    protected readonly messageService: MessageService;
    constructor();
    registerCommands(registry: CommandRegistry): void;
    registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): Promise<void>;
    protected withWidget<T>(widget: Widget | undefined, cb: (sampleView: SampleViewUnclosableView) => T): T | false;
}
export declare const bindSampleUnclosableView: (bind: interfaces.Bind) => void;
//# sourceMappingURL=sample-unclosable-view-contribution.d.ts.map