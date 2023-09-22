/**
 * The JSON-RPC interface for plugin metrics
 */
export declare const metricsJsonRpcPath = "/services/plugin-ext/metrics";
export declare const PluginMetrics: unique symbol;
export interface PluginMetrics {
    setMetrics(metrics: string): void;
    getMetrics(): string;
}
export declare const METRICS_TIMEOUT = 10000;
//# sourceMappingURL=metrics-protocol.d.ts.map