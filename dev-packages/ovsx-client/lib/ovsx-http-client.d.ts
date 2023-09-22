import { OVSXClient, VSXQueryOptions, VSXQueryResult, VSXSearchOptions, VSXSearchResult } from './ovsx-types';
import { RequestService } from '@theia/request';
export declare class OVSXHttpClient implements OVSXClient {
    protected vsxRegistryUrl: string;
    protected requestService: RequestService;
    /**
     * @param requestService
     * @returns factory that will cache clients based on the requested input URL.
     */
    static createClientFactory(requestService: RequestService): (url: string) => OVSXClient;
    constructor(vsxRegistryUrl: string, requestService: RequestService);
    search(searchOptions?: VSXSearchOptions): Promise<VSXSearchResult>;
    query(queryOptions?: VSXQueryOptions): Promise<VSXQueryResult>;
    protected requestJson<R>(url: string): Promise<R>;
    protected buildUrl(url: string, query?: object): string;
    protected buildQueryString(searchQuery?: object): string;
}
//# sourceMappingURL=ovsx-http-client.d.ts.map