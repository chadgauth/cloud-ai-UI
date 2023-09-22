export interface MetricsMap {
    [extensionID: string]: MethodToAnalytics;
}
export interface MethodToAnalytics {
    [methodID: string]: AnalyticsFromRequests;
}
export interface AnalyticsFromRequests {
    totalRequests: number;
    successfulResponses: number;
    sumOfTimeForSuccess: number;
    sumOfTimeForFailure: number;
}
export interface DataFromRequest {
    pluginID: string;
    errorContentsOrMethod: string;
    timeTaken: number;
}
export interface MetricOutput {
    header: string;
    createMetricOutput(pluginID: string, method: string, requestAnalytics: AnalyticsFromRequests): string;
}
/**
 * Helper functions for creating an object that corresponds to the DataFromRequest interface
 */
export declare function createRequestData(pluginID: string, errorContentsOrMethod: string, timeTaken: number): DataFromRequest;
export declare function createDefaultRequestData(pluginID: string, errorContentsOrMethod: string): DataFromRequest;
export declare function createDefaultAnalytics(timeTaken: number, isRequestSuccessful: boolean): AnalyticsFromRequests;
//# sourceMappingURL=plugin-metrics-types.d.ts.map