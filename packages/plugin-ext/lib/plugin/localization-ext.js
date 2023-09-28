"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.LocalizationExtImpl = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const core_1 = require("@theia/core");
const localization_1 = require("@theia/core/lib/common/i18n/localization");
const common_1 = require("../common");
const types_impl_1 = require("./types-impl");
class LocalizationExtImpl {
    constructor(rpc) {
        this.isDefaultLanguage = true;
        this.bundleCache = new Map();
        this._proxy = rpc.getProxy(common_1.PLUGIN_RPC_CONTEXT.LOCALIZATION_MAIN);
    }
    translateMessage(pluginId, details) {
        var _a;
        const { message, args, comment } = details;
        if (this.isDefaultLanguage) {
            return localization_1.Localization.format(message, (args !== null && args !== void 0 ? args : {}));
        }
        let key = message;
        if (comment && comment.length > 0) {
            key += `/${Array.isArray(comment) ? comment.join() : comment}`;
        }
        const str = (_a = this.bundleCache.get(pluginId)) === null || _a === void 0 ? void 0 : _a.contents[key];
        return localization_1.Localization.format(str !== null && str !== void 0 ? str : message, (args !== null && args !== void 0 ? args : {}));
    }
    getBundle(pluginId) {
        var _a;
        return (_a = this.bundleCache.get(pluginId)) === null || _a === void 0 ? void 0 : _a.contents;
    }
    getBundleUri(pluginId) {
        var _a;
        const uri = (_a = this.bundleCache.get(pluginId)) === null || _a === void 0 ? void 0 : _a.uri;
        return uri ? types_impl_1.URI.parse(uri) : undefined;
    }
    async initializeLocalizedMessages(plugin, currentLanguage) {
        var _a;
        (_a = this.currentLanguage) !== null && _a !== void 0 ? _a : (this.currentLanguage = currentLanguage);
        this.isDefaultLanguage = this.currentLanguage === core_1.nls.defaultLocale;
        if (this.isDefaultLanguage) {
            return;
        }
        if (this.bundleCache.has(plugin.model.id)) {
            return;
        }
        let bundle;
        try {
            bundle = await this._proxy.$fetchBundle(plugin.model.id);
        }
        catch (e) {
            console.error(`Failed to load translations for ${plugin.model.id}: ${e.message}`);
            return;
        }
        this.bundleCache.set(plugin.model.id, bundle);
    }
}
exports.LocalizationExtImpl = LocalizationExtImpl;
//# sourceMappingURL=localization-ext.js.map