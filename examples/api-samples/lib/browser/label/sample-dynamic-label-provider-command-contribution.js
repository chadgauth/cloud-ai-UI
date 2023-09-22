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
exports.bindDynamicLabelProvider = exports.ExampleLabelProviderCommandHandler = exports.SampleDynamicLabelProviderCommandContribution = exports.ExampleLabelProviderCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const sample_dynamic_label_provider_contribution_1 = require("./sample-dynamic-label-provider-contribution");
var ExampleLabelProviderCommands;
(function (ExampleLabelProviderCommands) {
    const EXAMPLE_CATEGORY = 'Examples';
    ExampleLabelProviderCommands.TOGGLE_SAMPLE = {
        id: 'example_label_provider.toggle',
        category: EXAMPLE_CATEGORY,
        label: 'Toggle Dynamically-Changing Labels'
    };
})(ExampleLabelProviderCommands = exports.ExampleLabelProviderCommands || (exports.ExampleLabelProviderCommands = {}));
let SampleDynamicLabelProviderCommandContribution = class SampleDynamicLabelProviderCommandContribution {
    initialize() { }
    registerCommands(commands) {
        commands.registerCommand(ExampleLabelProviderCommands.TOGGLE_SAMPLE, new ExampleLabelProviderCommandHandler(this.labelProviderContribution));
    }
};
__decorate([
    (0, inversify_1.inject)(sample_dynamic_label_provider_contribution_1.SampleDynamicLabelProviderContribution),
    __metadata("design:type", sample_dynamic_label_provider_contribution_1.SampleDynamicLabelProviderContribution)
], SampleDynamicLabelProviderCommandContribution.prototype, "labelProviderContribution", void 0);
SampleDynamicLabelProviderCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], SampleDynamicLabelProviderCommandContribution);
exports.SampleDynamicLabelProviderCommandContribution = SampleDynamicLabelProviderCommandContribution;
class ExampleLabelProviderCommandHandler {
    constructor(labelProviderContribution) {
        this.labelProviderContribution = labelProviderContribution;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(...args) {
        this.labelProviderContribution.toggle();
    }
}
exports.ExampleLabelProviderCommandHandler = ExampleLabelProviderCommandHandler;
const bindDynamicLabelProvider = (bind) => {
    bind(sample_dynamic_label_provider_contribution_1.SampleDynamicLabelProviderContribution).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(sample_dynamic_label_provider_contribution_1.SampleDynamicLabelProviderContribution);
    bind(core_1.CommandContribution).to(SampleDynamicLabelProviderCommandContribution).inSingletonScope();
};
exports.bindDynamicLabelProvider = bindDynamicLabelProvider;
//# sourceMappingURL=sample-dynamic-label-provider-command-contribution.js.map