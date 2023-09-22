/**
 * This class helps resolve language server requests into successes or failures
 * and sends the data to the metricsExtractor
 */
export declare class PluginMetricsResolver {
    private metricsCreator;
    /**
     * Resolve a request for pluginID and create a metric based on whether or not
     * the language server errored.
     *
     * @param pluginID the ID of the plugin that made the request
     * @param method  the method that was request
     * @param request the result of the language server request
     */
    resolveRequest(pluginID: string, method: string, request: PromiseLike<any> | Promise<any> | Thenable<any> | any): Promise<any>;
    private createAndSetMetric;
}
//# sourceMappingURL=plugin-metrics-resolver.d.ts.map