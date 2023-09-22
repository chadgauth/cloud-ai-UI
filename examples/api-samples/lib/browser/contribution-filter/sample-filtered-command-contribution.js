"use strict";
// *****************************************************************************
// Copyright (C) 2021 STMicroelectronics and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindSampleFilteredCommandContribution = exports.SampleFilterAndCommandContribution = exports.SampleFilteredCommandContribution = exports.SampleFilteredCommand = void 0;
const common_1 = require("@theia/core/lib/common");
const inversify_1 = require("@theia/core/shared/inversify");
var SampleFilteredCommand;
(function (SampleFilteredCommand) {
    const EXAMPLE_CATEGORY = 'Examples';
    SampleFilteredCommand.FILTERED = {
        id: 'example_command.filtered',
        category: EXAMPLE_CATEGORY,
        label: 'This command should be filtered out'
    };
    SampleFilteredCommand.FILTERED2 = {
        id: 'example_command.filtered2',
        category: EXAMPLE_CATEGORY,
        label: 'This command should be filtered out (2)'
    };
})(SampleFilteredCommand = exports.SampleFilteredCommand || (exports.SampleFilteredCommand = {}));
/**
 * This sample command is used to test the runtime filtering of already bound contributions.
 */
let SampleFilteredCommandContribution = class SampleFilteredCommandContribution {
    registerCommands(commands) {
        commands.registerCommand(SampleFilteredCommand.FILTERED, { execute: () => { } });
    }
};
SampleFilteredCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], SampleFilteredCommandContribution);
exports.SampleFilteredCommandContribution = SampleFilteredCommandContribution;
let SampleFilterAndCommandContribution = class SampleFilterAndCommandContribution {
    registerCommands(commands) {
        commands.registerCommand(SampleFilteredCommand.FILTERED2, { execute: () => { } });
    }
    registerContributionFilters(registry) {
        registry.addFilters([common_1.CommandContribution], [
            // filter ourselves out
            contrib => contrib.constructor !== this.constructor
        ]);
        registry.addFilters('*', [
            // filter a contribution based on its class name
            filterClassName(name => name !== 'SampleFilteredCommandContribution')
        ]);
    }
};
SampleFilterAndCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], SampleFilterAndCommandContribution);
exports.SampleFilterAndCommandContribution = SampleFilterAndCommandContribution;
function bindSampleFilteredCommandContribution(bind) {
    bind(common_1.CommandContribution).to(SampleFilteredCommandContribution).inSingletonScope();
    bind(SampleFilterAndCommandContribution).toSelf().inSingletonScope();
    (0, common_1.bindContribution)(bind, SampleFilterAndCommandContribution, [common_1.CommandContribution, common_1.FilterContribution]);
}
exports.bindSampleFilteredCommandContribution = bindSampleFilteredCommandContribution;
function filterClassName(filter) {
    return object => {
        var _a;
        const className = (_a = object === null || object === void 0 ? void 0 : object.constructor) === null || _a === void 0 ? void 0 : _a.name;
        return className
            ? filter(className)
            : false;
    };
}
//# sourceMappingURL=sample-filtered-command-contribution.js.map