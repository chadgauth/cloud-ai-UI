import { MetricOutput, AnalyticsFromRequests } from '../../common/plugin-metrics-types';
export declare class PluginMetricTimeSum implements MetricOutput {
    header: string;
    createMetricOutput(id: string, method: string, requestAnalytics: AnalyticsFromRequests): string;
}
//# sourceMappingURL=plugin-metrics-time-sum.d.ts.map