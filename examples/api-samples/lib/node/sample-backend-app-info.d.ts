/// <reference types="node" />
import { Deferred } from '@theia/core/lib/common/promise-util';
import { BackendApplicationCliContribution, BackendApplicationContribution } from '@theia/core/lib/node';
import * as net from 'net';
import { SampleAppInfo } from '../common/vsx/sample-app-info';
export declare class SampleBackendAppInfo implements SampleAppInfo, BackendApplicationContribution {
    protected addressDeferred: Deferred<net.AddressInfo>;
    protected backendCli: BackendApplicationCliContribution;
    onStart(server: net.Server): void;
    getSelfOrigin(): Promise<string>;
}
//# sourceMappingURL=sample-backend-app-info.d.ts.map