import { MetricsContribution } from '@theia/metrics/lib/node/metrics-contribution';
import { PluginMetricsContributor } from './metrics-contributor';
import { PluginMetricStringGenerator } from './metric-string-generator';
export declare class PluginMetricsContribution implements MetricsContribution {
    protected readonly metricsContributor: PluginMetricsContributor;
    protected readonly stringGenerator: PluginMetricStringGenerator;
    private metrics;
    getMetrics(): string;
    startCollecting(): void;
}
//# sourceMappingURL=plugin-metrics.d.ts.map