import { QuickPickItem, LabelProvider, QuickInputService, QuickInputButton, QuickPickSeparator } from '@theia/core/lib/browser';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { WorkspaceService } from './workspace-service';
import { WorkspacePreferences } from './workspace-preferences';
import URI from '@theia/core/lib/common/uri';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { UntitledWorkspaceService } from '../common/untitled-workspace-service';
interface RecentlyOpenedPick extends QuickPickItem {
    resource?: URI;
}
export declare class QuickOpenWorkspace {
    protected items: Array<RecentlyOpenedPick | QuickPickSeparator>;
    protected opened: boolean;
    protected readonly quickInputService: QuickInputService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly fileService: FileService;
    protected readonly labelProvider: LabelProvider;
    protected preferences: WorkspacePreferences;
    protected readonly envServer: EnvVariablesServer;
    protected untitledWorkspaceService: UntitledWorkspaceService;
    protected readonly removeRecentWorkspaceButton: QuickInputButton;
    open(workspaces: string[]): Promise<void>;
    select(): void;
}
export {};
//# sourceMappingURL=quick-open-workspace.d.ts.map