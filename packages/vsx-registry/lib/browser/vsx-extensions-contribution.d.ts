import { CommandRegistry } from '@theia/core/lib/common/command';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { VSXExtensionsViewContainer } from './vsx-extensions-view-container';
import { VSXExtensionsModel } from './vsx-extensions-model';
import { ColorContribution } from '@theia/core/lib/browser/color-application-contribution';
import { ColorRegistry } from '@theia/core/lib/browser/color-registry';
import { FrontendApplicationContribution, FrontendApplication } from '@theia/core/lib/browser/frontend-application';
import { MenuModelRegistry, MessageService } from '@theia/core/lib/common';
import { FileDialogService } from '@theia/filesystem/lib/browser';
import { LabelProvider, PreferenceService, QuickInputService } from '@theia/core/lib/browser';
import { VSXExtension } from './vsx-extension';
import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
import { OVSXApiFilter } from '@theia/ovsx-client';
import { OVSXClientProvider } from '../common/ovsx-client-provider';
export declare class VSXExtensionsContribution extends AbstractViewContribution<VSXExtensionsViewContainer> implements ColorContribution, FrontendApplicationContribution {
    protected model: VSXExtensionsModel;
    protected commandRegistry: CommandRegistry;
    protected fileDialogService: FileDialogService;
    protected messageService: MessageService;
    protected labelProvider: LabelProvider;
    protected clipboardService: ClipboardService;
    protected preferenceService: PreferenceService;
    protected clientProvider: OVSXClientProvider;
    protected vsxApiFilter: OVSXApiFilter;
    protected quickInput: QuickInputService;
    constructor();
    protected init(): void;
    initializeLayout(app: FrontendApplication): Promise<void>;
    registerCommands(commands: CommandRegistry): void;
    registerMenus(menus: MenuModelRegistry): void;
    registerColors(colors: ColorRegistry): void;
    /**
     * Installs a local .vsix file after prompting the `Open File` dialog. Resolves to the URI of the file.
     */
    protected installFromVSIX(): Promise<void>;
    /**
     * Given an extension, displays a quick pick of other compatible versions and installs the selected version.
     *
     * @param extension a VSX extension.
     */
    protected installAnotherVersion(extension: VSXExtension): Promise<void>;
    protected copy(extension: VSXExtension): Promise<void>;
    protected copyExtensionId(extension: VSXExtension): void;
    /**
     * Updates an extension to a specific version.
     *
     * @param extension the extension to update.
     * @param updateToVersion the version to update to.
     * @param revertToVersion the version to revert to (in case of failure).
     */
    protected updateVersion(extension: VSXExtension, updateToVersion: string): Promise<void>;
    protected showRecommendedToast(): Promise<void>;
    protected showBuiltinExtensions(): Promise<void>;
    protected showInstalledExtensions(): Promise<void>;
    protected showRecommendedExtensions(): Promise<void>;
}
//# sourceMappingURL=vsx-extensions-contribution.d.ts.map