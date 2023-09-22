/// <reference types="express" />
import { BackendApplicationContribution } from '@theia/core/lib/node';
import * as express from '@theia/core/shared/express';
import { VSXExtensionRaw } from '@theia/ovsx-client';
import { SampleAppInfo } from '../common/vsx/sample-app-info';
declare type VersionedId = `${string}.${string}@${string}`;
/**
 * This class implements a very crude OpenVSX mock server for testing.
 *
 * See {@link configure}'s implementation for supported REST APIs.
 */
export declare class SampleMockOpenVsxServer implements BackendApplicationContribution {
    protected appInfo: SampleAppInfo;
    get mockServerPath(): string;
    get pluginsDbPath(): string;
    configure(app: express.Application): Promise<void>;
    protected getVersionedId(namespace: string, name: string, version: string): VersionedId;
    protected sanitizeQuery(query?: Record<string, unknown>): Record<string, string>;
    /**
     * This method expects the following folder hierarchy: `pluginsDbPath/namespace/pluginName/pluginFiles...`
     * @param pluginsDbPath where to look for plugins on the disk.
     * @param baseUrl used when generating the URLs for {@link VSXExtensionRaw} properties.
     */
    protected findMockPlugins(pluginsDbPath: string, baseUrl: string): Promise<Map<VersionedId, {
        path: string;
        data: VSXExtensionRaw;
    }>>;
    protected isDirectory(fsPath: string): Promise<boolean>;
}
export {};
//# sourceMappingURL=sample-mock-open-vsx-server.d.ts.map