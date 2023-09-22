import { PreferenceChange, StorageService } from '@theia/core/lib/browser';
import { PreferenceService } from '@theia/core/lib/browser/preferences/preference-service';
import { MessageService } from '@theia/core/lib/common/message-service';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
import { WorkspaceTrustPreferences } from './workspace-trust-preferences';
import { WorkspaceService } from './workspace-service';
export declare class WorkspaceTrustService {
    protected readonly workspaceService: WorkspaceService;
    protected readonly preferences: PreferenceService;
    protected readonly storage: StorageService;
    protected readonly messageService: MessageService;
    protected readonly workspaceTrustPref: WorkspaceTrustPreferences;
    protected readonly windowService: WindowService;
    protected workspaceTrust: Deferred<boolean>;
    protected init(): void;
    protected doInit(): Promise<void>;
    getWorkspaceTrust(): Promise<boolean>;
    protected resolveWorkspaceTrust(givenTrust?: boolean): Promise<void>;
    protected isWorkspaceTrustResolved(): boolean;
    protected calculateWorkspaceTrust(): Promise<boolean | undefined>;
    protected loadWorkspaceTrust(): Promise<boolean | undefined>;
    protected storeWorkspaceTrust(trust: boolean): Promise<void>;
    protected handlePreferenceChange(change: PreferenceChange): Promise<void>;
    protected confirmRestart(): Promise<boolean>;
    requestWorkspaceTrust(): Promise<boolean | undefined>;
}
//# sourceMappingURL=workspace-trust-service.d.ts.map