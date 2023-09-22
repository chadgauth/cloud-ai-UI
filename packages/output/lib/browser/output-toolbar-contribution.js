"use strict";
// *****************************************************************************
// Copyright (C) 2019 Arm and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputToolbarContribution = void 0;
const React = require("@theia/core/shared/react");
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const select_component_1 = require("@theia/core/lib/browser/widgets/select-component");
const output_widget_1 = require("./output-widget");
const output_commands_1 = require("./output-commands");
const output_contribution_1 = require("./output-contribution");
const output_channel_1 = require("./output-channel");
const nls_1 = require("@theia/core/lib/common/nls");
let OutputToolbarContribution = class OutputToolbarContribution {
    constructor() {
        this.onOutputWidgetStateChangedEmitter = new event_1.Emitter();
        this.onOutputWidgetStateChanged = this.onOutputWidgetStateChangedEmitter.event;
        this.onChannelsChangedEmitter = new event_1.Emitter();
        this.onChannelsChanged = this.onChannelsChangedEmitter.event;
        this.NONE = '<no channels>';
        this.OUTPUT_CHANNEL_LIST_ID = 'outputChannelList';
        this.changeChannel = (option) => {
            const channelName = option.value;
            if (channelName !== this.NONE && channelName) {
                this.outputChannelManager.getChannel(channelName).show();
            }
        };
    }
    init() {
        this.outputContribution.widget.then(widget => {
            widget.onStateChanged(() => this.onOutputWidgetStateChangedEmitter.fire());
        });
        const fireChannelsChanged = () => this.onChannelsChangedEmitter.fire();
        this.outputChannelManager.onSelectedChannelChanged(fireChannelsChanged);
        this.outputChannelManager.onChannelAdded(fireChannelsChanged);
        this.outputChannelManager.onChannelDeleted(fireChannelsChanged);
        this.outputChannelManager.onChannelWasShown(fireChannelsChanged);
        this.outputChannelManager.onChannelWasHidden(fireChannelsChanged);
    }
    registerToolbarItems(toolbarRegistry) {
        toolbarRegistry.registerItem({
            id: 'channels',
            render: () => this.renderChannelSelector(),
            isVisible: widget => widget instanceof output_widget_1.OutputWidget,
            onDidChange: this.onChannelsChanged
        });
        toolbarRegistry.registerItem({
            id: output_commands_1.OutputCommands.CLEAR__WIDGET.id,
            command: output_commands_1.OutputCommands.CLEAR__WIDGET.id,
            tooltip: nls_1.nls.localizeByDefault('Clear Output'),
            priority: 1,
        });
        toolbarRegistry.registerItem({
            id: output_commands_1.OutputCommands.LOCK__WIDGET.id,
            command: output_commands_1.OutputCommands.LOCK__WIDGET.id,
            tooltip: nls_1.nls.localizeByDefault('Turn Auto Scrolling Off'),
            onDidChange: this.onOutputWidgetStateChanged,
            priority: 2
        });
        toolbarRegistry.registerItem({
            id: output_commands_1.OutputCommands.UNLOCK__WIDGET.id,
            command: output_commands_1.OutputCommands.UNLOCK__WIDGET.id,
            tooltip: nls_1.nls.localizeByDefault('Turn Auto Scrolling On'),
            onDidChange: this.onOutputWidgetStateChanged,
            priority: 2
        });
    }
    renderChannelSelector() {
        var _a, _b;
        const channelOptionElements = [];
        this.outputChannelManager.getVisibleChannels().forEach((channel, i) => {
            channelOptionElements.push({
                value: channel.name
            });
        });
        if (channelOptionElements.length === 0) {
            channelOptionElements.push({
                value: this.NONE
            });
        }
        return React.createElement("div", { id: this.OUTPUT_CHANNEL_LIST_ID, key: this.OUTPUT_CHANNEL_LIST_ID },
            React.createElement(select_component_1.SelectComponent, { key: (_a = this.outputChannelManager.selectedChannel) === null || _a === void 0 ? void 0 : _a.name, options: channelOptionElements, defaultValue: (_b = this.outputChannelManager.selectedChannel) === null || _b === void 0 ? void 0 : _b.name, onChange: option => this.changeChannel(option) }));
    }
};
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], OutputToolbarContribution.prototype, "outputChannelManager", void 0);
__decorate([
    (0, inversify_1.inject)(output_contribution_1.OutputContribution),
    __metadata("design:type", output_contribution_1.OutputContribution)
], OutputToolbarContribution.prototype, "outputContribution", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OutputToolbarContribution.prototype, "init", null);
OutputToolbarContribution = __decorate([
    (0, inversify_1.injectable)()
], OutputToolbarContribution);
exports.OutputToolbarContribution = OutputToolbarContribution;
//# sourceMappingURL=output-toolbar-contribution.js.map