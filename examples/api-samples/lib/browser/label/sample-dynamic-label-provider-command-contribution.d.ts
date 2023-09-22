import { interfaces } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, CommandHandler } from '@theia/core';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { SampleDynamicLabelProviderContribution } from './sample-dynamic-label-provider-contribution';
export declare namespace ExampleLabelProviderCommands {
    const TOGGLE_SAMPLE: Command;
}
export declare class SampleDynamicLabelProviderCommandContribution implements FrontendApplicationContribution, CommandContribution {
    protected readonly labelProviderContribution: SampleDynamicLabelProviderContribution;
    initialize(): void;
    registerCommands(commands: CommandRegistry): void;
}
export declare class ExampleLabelProviderCommandHandler implements CommandHandler {
    private readonly labelProviderContribution;
    constructor(labelProviderContribution: SampleDynamicLabelProviderContribution);
    execute(...args: any[]): any;
}
export declare const bindDynamicLabelProvider: (bind: interfaces.Bind) => void;
//# sourceMappingURL=sample-dynamic-label-provider-command-contribution.d.ts.map