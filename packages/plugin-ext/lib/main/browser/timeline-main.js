"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineMainImpl = void 0;
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const timeline_service_1 = require("@theia/timeline/lib/browser/timeline-service");
const common_1 = require("@theia/core/lib/common");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/afacd2bdfe7060f09df9b9139521718915949757/src/vs/workbench/api/browser/mainThreadTimeline.ts
class TimelineMainImpl {
    constructor(rpc, container) {
        this.providerEmitters = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TIMELINE_EXT);
        this.timelineService = container.get(timeline_service_1.TimelineService);
    }
    async $registerTimelineProvider(provider) {
        const proxy = this.proxy;
        const emitters = this.providerEmitters;
        let onDidChange = emitters.get(provider.id);
        if (onDidChange === undefined) {
            onDidChange = new common_1.Emitter();
            emitters.set(provider.id, onDidChange);
        }
        this.timelineService.registerTimelineProvider({
            ...provider,
            onDidChange: onDidChange.event,
            provideTimeline(uri, options, internalOptions) {
                return proxy.$getTimeline(provider.id, uri, options, internalOptions);
            },
            dispose() {
                emitters.delete(provider.id);
                if (onDidChange) {
                    onDidChange.dispose();
                }
            }
        });
    }
    async $unregisterTimelineProvider(id) {
        this.timelineService.unregisterTimelineProvider(id);
    }
    async $fireTimelineChanged(e) {
        const emitter = this.providerEmitters.get(e.id);
        if (emitter) {
            emitter.fire(e);
        }
    }
}
exports.TimelineMainImpl = TimelineMainImpl;
//# sourceMappingURL=timeline-main.js.map