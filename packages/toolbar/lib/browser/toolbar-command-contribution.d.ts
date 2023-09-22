import { CommandContribution, CommandRegistry, CommandService, InMemoryResources, MenuContribution, MenuModelRegistry } from '@theia/core';
import { KeybindingContribution, KeybindingRegistry, PreferenceService, QuickInputService } from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';
import { EditorManager } from '@theia/editor/lib/browser';
import { ToolbarCommandQuickInputService } from './toolbar-command-quick-input-service';
import { ToolbarController } from './toolbar-controller';
import { JsonSchemaContribution, JsonSchemaRegisterContext } from '@theia/core/lib/browser/json-schema-store';
import URI from '@theia/core/lib/common/uri';
export declare class ToolbarCommandContribution implements CommandContribution, KeybindingContribution, MenuContribution, JsonSchemaContribution {
    protected readonly model: ToolbarController;
    protected readonly quickInputService: QuickInputService;
    protected toolbarCommandPickService: ToolbarCommandQuickInputService;
    protected readonly commandService: CommandService;
    protected readonly editorManager: EditorManager;
    protected readonly preferenceService: PreferenceService;
    protected readonly toolbarModel: ToolbarController;
    protected readonly inMemoryResources: InMemoryResources;
    protected readonly schemaURI: URI;
    registerSchemas(context: JsonSchemaRegisterContext): void;
    registerCommands(registry: CommandRegistry): void;
    protected isToolbarWidget(arg: unknown): boolean;
    registerKeybindings(keys: KeybindingRegistry): void;
    registerMenus(registry: MenuModelRegistry): void;
}
export declare function bindToolbar(bind: interfaces.Bind): void;
//# sourceMappingURL=toolbar-command-contribution.d.ts.map