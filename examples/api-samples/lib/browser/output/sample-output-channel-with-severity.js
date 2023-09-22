"use strict";
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
exports.bindSampleOutputChannelWithSeverity = exports.SampleOutputChannelWithSeverity = void 0;
// *****************************************************************************
// Copyright (C) 2020 SAP SE or an SAP affiliate company and others.
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
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const output_channel_1 = require("@theia/output/lib/browser/output-channel");
let SampleOutputChannelWithSeverity = class SampleOutputChannelWithSeverity {
    onStart() {
        const channel = this.outputChannelManager.getChannel('API Sample: my test channel');
        channel.appendLine('hello info1'); // showed without color
        channel.appendLine('hello info2', output_channel_1.OutputChannelSeverity.Info);
        channel.appendLine('hello error', output_channel_1.OutputChannelSeverity.Error);
        channel.appendLine('hello warning', output_channel_1.OutputChannelSeverity.Warning);
        channel.append('inlineInfo1 ');
        channel.append('inlineWarning ', output_channel_1.OutputChannelSeverity.Warning);
        channel.append('inlineError ', output_channel_1.OutputChannelSeverity.Error);
        channel.append('inlineInfo2', output_channel_1.OutputChannelSeverity.Info);
    }
};
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], SampleOutputChannelWithSeverity.prototype, "outputChannelManager", void 0);
SampleOutputChannelWithSeverity = __decorate([
    (0, inversify_1.injectable)()
], SampleOutputChannelWithSeverity);
exports.SampleOutputChannelWithSeverity = SampleOutputChannelWithSeverity;
const bindSampleOutputChannelWithSeverity = (bind) => {
    bind(browser_1.FrontendApplicationContribution)
        .to(SampleOutputChannelWithSeverity)
        .inSingletonScope();
};
exports.bindSampleOutputChannelWithSeverity = bindSampleOutputChannelWithSeverity;
//# sourceMappingURL=sample-output-channel-with-severity.js.map