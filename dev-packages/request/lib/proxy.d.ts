/********************************************************************************
 * Copyright (C) 2022 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
import * as httpAgent from 'http-proxy-agent';
import * as httpsAgent from 'https-proxy-agent';
export declare type ProxyAgent = httpAgent.HttpProxyAgent | httpsAgent.HttpsProxyAgent;
export interface ProxySettings {
    proxyUrl?: string;
    strictSSL?: boolean;
}
export declare function getProxyAgent(rawRequestURL: string, env: typeof process.env, options?: ProxySettings): ProxyAgent | undefined;
//# sourceMappingURL=proxy.d.ts.map