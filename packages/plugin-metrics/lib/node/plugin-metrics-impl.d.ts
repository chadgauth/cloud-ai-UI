import { PluginMetrics } from '../common/metrics-protocol';
export declare class PluginMetricsImpl implements PluginMetrics {
    private metrics;
    setMetrics(metrics: string): void;
    /**
     * This sends all the information about metrics inside of the plugins to the backend
     * where it is served on the /metrics endpoint
     */
    getMetrics(): string;
}
//# sourceMappingURL=plugin-metrics-impl.d.ts.map