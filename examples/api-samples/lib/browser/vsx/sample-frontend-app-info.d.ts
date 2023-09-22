import { interfaces } from '@theia/core/shared/inversify';
import { SampleAppInfo } from '../../common/vsx/sample-app-info';
export declare class SampleFrontendAppInfo implements SampleAppInfo {
    getSelfOrigin(): Promise<string>;
}
export declare function bindSampleAppInfo(bind: interfaces.Bind): void;
//# sourceMappingURL=sample-frontend-app-info.d.ts.map