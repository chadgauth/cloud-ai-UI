/// <reference types="node" />
import { ElectronMainApplication, ElectronMainApplicationContribution } from '@theia/core/lib/electron-main/electron-main-application';
import { SampleUpdater, SampleUpdaterClient, UpdateStatus } from '../../common/updater/sample-updater';
export declare class SampleUpdaterImpl implements SampleUpdater, ElectronMainApplicationContribution {
    protected clients: Array<SampleUpdaterClient>;
    protected inProgressTimer: NodeJS.Timer | undefined;
    protected available: boolean;
    checkForUpdates(): Promise<{
        status: UpdateStatus;
    }>;
    onRestartToUpdateRequested(): void;
    setUpdateAvailable(available: boolean): Promise<void>;
    onStart(application: ElectronMainApplication): void;
    onStop(application: ElectronMainApplication): void;
    setClient(client: SampleUpdaterClient | undefined): void;
    disconnectClient(client: SampleUpdaterClient): void;
    dispose(): void;
}
//# sourceMappingURL=sample-updater-impl.d.ts.map