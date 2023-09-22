import { Command, CommandContribution, CommandRegistry, FilterContribution, ContributionFilterRegistry } from '@theia/core/lib/common';
import { interfaces } from '@theia/core/shared/inversify';
export declare namespace SampleFilteredCommand {
    const FILTERED: Command;
    const FILTERED2: Command;
}
/**
 * This sample command is used to test the runtime filtering of already bound contributions.
 */
export declare class SampleFilteredCommandContribution implements CommandContribution {
    registerCommands(commands: CommandRegistry): void;
}
export declare class SampleFilterAndCommandContribution implements FilterContribution, CommandContribution {
    registerCommands(commands: CommandRegistry): void;
    registerContributionFilters(registry: ContributionFilterRegistry): void;
}
export declare function bindSampleFilteredCommandContribution(bind: interfaces.Bind): void;
//# sourceMappingURL=sample-filtered-command-contribution.d.ts.map