/// <reference types="node" />
import * as http from 'http';
import * as https from 'https';
import { AddressInfo } from 'net';
import { MaybePromise } from '../common/types';
export declare function start(serverModule: MaybePromise<http.Server | https.Server>): Promise<AddressInfo>;
export default start;
//# sourceMappingURL=main.d.ts.map