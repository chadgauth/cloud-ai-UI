import { interfaces } from '@theia/core/shared/inversify';
import { VSXEnvironment } from '@theia/vsx-registry/lib/common/vsx-environment';
import { Command, CommandContribution, CommandRegistry, MessageService } from '@theia/core/lib/common';
export declare class VSXCommandContribution implements CommandContribution {
    protected readonly messageService: MessageService;
    protected readonly environment: VSXEnvironment;
    protected readonly command: Command;
    registerCommands(commands: CommandRegistry): void;
}
export declare const bindVSXCommand: (bind: interfaces.Bind) => void;
//# sourceMappingURL=sample-vsx-command-contribution.d.ts.map