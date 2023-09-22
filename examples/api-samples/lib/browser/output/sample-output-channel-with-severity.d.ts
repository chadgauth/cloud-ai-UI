import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';
import { OutputChannelManager } from '@theia/output/lib/browser/output-channel';
export declare class SampleOutputChannelWithSeverity implements FrontendApplicationContribution {
    protected readonly outputChannelManager: OutputChannelManager;
    onStart(): void;
}
export declare const bindSampleOutputChannelWithSeverity: (bind: interfaces.Bind) => void;
//# sourceMappingURL=sample-output-channel-with-severity.d.ts.map