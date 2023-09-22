import { RpcServer } from '@theia/core/lib/common/messaging/proxy-factory';
export declare enum UpdateStatus {
    InProgress = "in-progress",
    Available = "available",
    NotAvailable = "not-available"
}
export declare const SampleUpdaterPath = "/services/sample-updater";
export declare const SampleUpdater: unique symbol;
export interface SampleUpdater extends RpcServer<SampleUpdaterClient> {
    checkForUpdates(): Promise<{
        status: UpdateStatus;
    }>;
    onRestartToUpdateRequested(): void;
    disconnectClient(client: SampleUpdaterClient): void;
    setUpdateAvailable(available: boolean): Promise<void>;
}
export declare const SampleUpdaterClient: unique symbol;
export interface SampleUpdaterClient {
    notifyReadyToInstall(): void;
}
//# sourceMappingURL=sample-updater.d.ts.map