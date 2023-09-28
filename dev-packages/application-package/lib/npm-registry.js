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
exports.NpmRegistry = exports.NpmRegistryOptions = exports.sortByKey = exports.PublishedNodePackage = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const nano = require("nano");
const request_1 = require("@theia/request");
const node_request_service_1 = require("@theia/request/lib/node-request-service");
const application_props_1 = require("./application-props");
var PublishedNodePackage;
(function (PublishedNodePackage) {
    function is(pck) {
        return !!pck && !!pck.name && !!pck.version;
    }
    PublishedNodePackage.is = is;
})(PublishedNodePackage = exports.PublishedNodePackage || (exports.PublishedNodePackage = {}));
function sortByKey(object) {
    return Object.keys(object).sort().reduce((sorted, key) => {
        sorted[key] = object[key];
        return sorted;
    }, {});
}
exports.sortByKey = sortByKey;
class NpmRegistryOptions {
}
exports.NpmRegistryOptions = NpmRegistryOptions;
class NpmRegistry {
    constructor(options) {
        this.props = { ...application_props_1.NpmRegistryProps.DEFAULT };
        this.index = new Map();
        this.options = {
            watchChanges: false,
            ...options
        };
        this.resetIndex();
        this.request = new node_request_service_1.NodeRequestService();
    }
    updateProps(props) {
        const oldRegistry = this.props.registry;
        Object.assign(this.props, props);
        const newRegistry = this.props.registry;
        if (oldRegistry !== newRegistry) {
            this.resetIndex();
        }
    }
    resetIndex() {
        this.index.clear();
        if (this.options.watchChanges && this.props.registry === application_props_1.NpmRegistryProps.DEFAULT.registry) {
            if (this.changes) {
                this.changes.stop();
            }
            // Invalidate index with NPM registry web hooks
            this.changes = nano('https://replicate.npmjs.com').use('registry').changesReader;
            this.changes.get({}).on('change', change => this.invalidate(change.id));
        }
    }
    invalidate(name) {
        if (this.index.delete(name)) {
            this.view(name);
        }
    }
    view(name) {
        const indexed = this.index.get(name);
        if (indexed) {
            return indexed;
        }
        const result = this.doView(name);
        this.index.set(name, result);
        result.catch(() => this.index.delete(name));
        return result;
    }
    async doView(name) {
        let url = this.props.registry;
        if (name[0] === '@') {
            url += '@' + encodeURIComponent(name.substring(1));
        }
        else {
            url += encodeURIComponent(name);
        }
        const response = await this.request.request({ url });
        if (response.res.statusCode !== 200) {
            throw new Error(`HTTP ${response.res.statusCode}: for ${url}`);
        }
        return request_1.RequestContext.asJson(response);
    }
}
exports.NpmRegistry = NpmRegistry;
//# sourceMappingURL=npm-registry.js.map