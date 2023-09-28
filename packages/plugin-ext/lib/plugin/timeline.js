"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineExtImpl = void 0;
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
const common_1 = require("../common");
const types_impl_1 = require("./types-impl");
const disposable_1 = require("@theia/core/lib/common/disposable");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// copied and modified from https://github.com/microsoft/theia/blob/afacd2bdfe7060f09df9b9139521718915949757/src/vs/workbench/api/common/extHostTimeline.ts
class TimelineExtImpl {
    constructor(rpc, commands) {
        this.rpc = rpc;
        this.commands = commands;
        this.providers = new Map();
        this.itemsBySourceAndUriMap = new Map();
        this.proxy = rpc.getProxy(common_1.PLUGIN_RPC_CONTEXT.TIMELINE_MAIN);
        commands.registerArgumentProcessor({
            processArgument: arg => {
                var _a, _b, _c;
                if (!common_1.TimelineCommandArg.is(arg)) {
                    return arg;
                }
                else {
                    return (_c = (_a = this.itemsBySourceAndUriMap.get(arg.source)) === null || _a === void 0 ? void 0 : _a.get((_b = arg.uri) === null || _b === void 0 ? void 0 : _b.toString())) === null || _c === void 0 ? void 0 : _c.get(arg.timelineHandle);
                }
            }
        });
    }
    async $getTimeline(id, uri, options, internalOptions) {
        const provider = this.providers.get(id);
        return provider === null || provider === void 0 ? void 0 : provider.provideTimeline(types_impl_1.URI.revive(uri), options, internalOptions);
    }
    registerTimelineProvider(plugin, scheme, provider) {
        const timelineDisposables = new disposable_1.DisposableCollection();
        const convertTimelineItem = this.convertTimelineItem(provider.id, timelineDisposables).bind(this);
        let disposable;
        if (provider.onDidChange) {
            disposable = types_impl_1.Disposable.from(provider.onDidChange(e => this.proxy.$fireTimelineChanged({ uri: undefined, reset: true, ...e, id: provider.id }), this));
        }
        const itemsBySourceAndUriMap = this.itemsBySourceAndUriMap;
        return this.registerTimelineProviderCore({
            ...provider,
            scheme: scheme,
            onDidChange: undefined,
            async provideTimeline(uri, options, internalOptions) {
                if (internalOptions === null || internalOptions === void 0 ? void 0 : internalOptions.resetCache) {
                    timelineDisposables.dispose();
                    const items = itemsBySourceAndUriMap.get(provider.id);
                    if (items) {
                        items.clear();
                    }
                }
                const result = await provider.provideTimeline(uri, options, cancellation_1.CancellationToken.None);
                if (!result) {
                    return undefined;
                }
                const convertItem = convertTimelineItem(uri, internalOptions);
                return {
                    ...result,
                    source: provider.id,
                    items: result.items.map(convertItem)
                };
            },
            dispose() {
                for (const sourceMap of itemsBySourceAndUriMap.values()) {
                    const source = sourceMap.get(provider.id);
                    if (source) {
                        source.clear();
                    }
                }
                if (disposable) {
                    disposable.dispose();
                }
                timelineDisposables.dispose();
            }
        });
    }
    convertTimelineItem(source, disposables) {
        return (uri, options) => {
            let items;
            if (options === null || options === void 0 ? void 0 : options.cacheResults) {
                let itemsByUri = this.itemsBySourceAndUriMap.get(source);
                if (itemsByUri === undefined) {
                    itemsByUri = new Map();
                    this.itemsBySourceAndUriMap.set(source, itemsByUri);
                }
                const uriKey = getUriKey(uri);
                items = itemsByUri.get(uriKey);
                if (items === undefined) {
                    items = new Map();
                    itemsByUri.set(uriKey, items);
                }
            }
            return (item) => {
                var _a, _b;
                const { iconPath, ...props } = item;
                const handle = `${source}|${(_a = item.id) !== null && _a !== void 0 ? _a : item.timestamp}`;
                if (items) {
                    items.set(handle, item);
                }
                return {
                    ...props,
                    uri: uri.toString(),
                    id: (_b = props.id) !== null && _b !== void 0 ? _b : undefined,
                    handle: handle,
                    source: source,
                    command: item.command ? this.commands.converter.toSafeCommand(item.command, disposables) : undefined,
                };
            };
        };
    }
    registerTimelineProviderCore(provider) {
        const existing = this.providers.get(provider.id);
        if (existing) {
            throw new Error(`Timeline Provider ${provider.id} already exists.`);
        }
        this.proxy.$registerTimelineProvider({
            id: provider.id,
            label: provider.label,
            scheme: provider.scheme
        });
        this.providers.set(provider.id, provider);
        return types_impl_1.Disposable.create(() => {
            for (const sourceMap of this.itemsBySourceAndUriMap.values()) {
                const items = sourceMap.get(provider.id);
                if (items) {
                    items.clear();
                }
            }
            this.providers.delete(provider.id);
            this.proxy.$unregisterTimelineProvider(provider.id);
            provider.dispose();
        });
    }
}
exports.TimelineExtImpl = TimelineExtImpl;
function getUriKey(uri) {
    return uri === null || uri === void 0 ? void 0 : uri.toString();
}
//# sourceMappingURL=timeline.js.map