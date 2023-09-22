import { interfaces } from '@theia/core/shared/inversify';
export declare const SampleAppInfo: symbol & interfaces.Abstract<SampleAppInfo>;
export interface SampleAppInfo {
    getSelfOrigin(): Promise<string>;
}
//# sourceMappingURL=sample-app-info.d.ts.map