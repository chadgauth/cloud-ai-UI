"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyAgent = void 0;
const url_1 = require("url");
const httpAgent = require("http-proxy-agent");
const httpsAgent = require("https-proxy-agent");
function getSystemProxyURI(requestURL, env) {
    if (requestURL.protocol === 'http:') {
        return env.HTTP_PROXY || env.http_proxy;
    }
    else if (requestURL.protocol === 'https:') {
        return env.HTTPS_PROXY || env.https_proxy || env.HTTP_PROXY || env.http_proxy;
    }
    return undefined;
}
function getProxyAgent(rawRequestURL, env, options = {}) {
    const requestURL = (0, url_1.parse)(rawRequestURL);
    const proxyURL = options.proxyUrl || getSystemProxyURI(requestURL, env);
    if (!proxyURL) {
        return undefined;
    }
    const proxyEndpoint = (0, url_1.parse)(proxyURL);
    if (!/^https?:$/.test(proxyEndpoint.protocol || '')) {
        return undefined;
    }
    const opts = {
        host: proxyEndpoint.hostname || '',
        port: proxyEndpoint.port || (proxyEndpoint.protocol === 'https' ? '443' : '80'),
        auth: proxyEndpoint.auth,
        rejectUnauthorized: !!options.strictSSL,
    };
    const createAgent = requestURL.protocol === 'http:' ? httpAgent : httpsAgent;
    return createAgent(opts);
}
exports.getProxyAgent = getProxyAgent;
//# sourceMappingURL=proxy.js.map