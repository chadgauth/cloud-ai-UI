"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const proxy_factory_1 = require("./proxy-factory");
const channel_spec_1 = require("../message-rpc/channel.spec");
const expect = chai.expect;
class TestServer {
    constructor() {
        this.requests = [];
    }
    doStuff(arg) {
        this.requests.push(arg);
        return Promise.resolve(`done: ${arg}`);
    }
    fails(arg, otherArg) {
        throw new Error('fails failed');
    }
    fails2(arg, otherArg) {
        return Promise.reject(new Error('fails2 failed'));
    }
}
class TestClient {
    constructor() {
        this.notifications = [];
    }
    notifyThat(arg) {
        this.notifications.push(arg);
    }
}
describe('Proxy-Factory', () => {
    it('Should correctly send notifications and requests.', done => {
        const it = getSetup();
        it.clientProxy.notifyThat('hello');
        function check() {
            if (it.client.notifications.length === 0) {
                console.log('waiting another 50 ms');
                setTimeout(check, 50);
            }
            else {
                expect(it.client.notifications[0]).eq('hello');
                it.serverProxy.doStuff('foo').then(result => {
                    expect(result).to.be.eq('done: foo');
                    done();
                });
            }
        }
        check();
    });
    it('Rejected Promise should result in rejected Promise.', done => {
        const it = getSetup();
        const handle = setTimeout(() => done('timeout'), 500);
        it.serverProxy.fails('a', 'b').catch(err => {
            expect(err.message).to.contain('fails failed');
            clearTimeout(handle);
            done();
        });
    });
    it('Remote Exceptions should result in rejected Promise.', done => {
        const { serverProxy } = getSetup();
        const handle = setTimeout(() => done('timeout'), 500);
        serverProxy.fails2('a', 'b').catch(err => {
            expect(err.message).to.contain('fails2 failed');
            clearTimeout(handle);
            done();
        });
    });
});
function getSetup() {
    const client = new TestClient();
    const server = new TestServer();
    const serverProxyFactory = new proxy_factory_1.RpcProxyFactory(client);
    const pipe = new channel_spec_1.ChannelPipe();
    serverProxyFactory.listen(pipe.right);
    const serverProxy = serverProxyFactory.createProxy();
    const clientProxyFactory = new proxy_factory_1.RpcProxyFactory(server);
    clientProxyFactory.listen(pipe.left);
    const clientProxy = clientProxyFactory.createProxy();
    return {
        client,
        clientProxy,
        server,
        serverProxy
    };
}
//# sourceMappingURL=proxy-factory.spec.js.map