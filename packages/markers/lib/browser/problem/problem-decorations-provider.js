"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.ProblemDecorationContribution = exports.ProblemDecorationsProvider = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const decorations_service_1 = require("@theia/core/lib/browser/decorations-service");
const problem_manager_1 = require("./problem-manager");
const problem_utils_1 = require("./problem-utils");
const core_1 = require("@theia/core");
const debounce = require("@theia/core/shared/lodash.debounce");
let ProblemDecorationsProvider = class ProblemDecorationsProvider {
    constructor() {
        this.currentUris = [];
        this.onDidChangeEmitter = new core_1.Emitter();
        this.fireDidDecorationsChanged = debounce(() => this.doFireDidDecorationsChanged(), 50);
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    init() {
        this.problemManager.onDidChangeMarkers(() => this.fireDidDecorationsChanged());
    }
    doFireDidDecorationsChanged() {
        const newUris = Array.from(this.problemManager.getUris(), stringified => new uri_1.default(stringified));
        this.onDidChangeEmitter.fire(newUris.concat(this.currentUris));
        this.currentUris = newUris;
    }
    provideDecorations(uri, token) {
        const markers = this.problemManager.findMarkers({ uri }).filter(problem_utils_1.ProblemUtils.filterMarker).sort(problem_utils_1.ProblemUtils.severityCompareMarker);
        if (markers.length) {
            return {
                bubble: true,
                letter: markers.length.toString(),
                weight: problem_utils_1.ProblemUtils.getPriority(markers[0]),
                colorId: problem_utils_1.ProblemUtils.getColor(markers[0]),
                tooltip: markers.length === 1 ? core_1.nls.localizeByDefault('1 problem in this file') : core_1.nls.localizeByDefault('{0} problems in this file', markers.length),
            };
        }
    }
};
__decorate([
    (0, inversify_1.inject)(problem_manager_1.ProblemManager),
    __metadata("design:type", problem_manager_1.ProblemManager)
], ProblemDecorationsProvider.prototype, "problemManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProblemDecorationsProvider.prototype, "init", null);
ProblemDecorationsProvider = __decorate([
    (0, inversify_1.injectable)()
], ProblemDecorationsProvider);
exports.ProblemDecorationsProvider = ProblemDecorationsProvider;
let ProblemDecorationContribution = class ProblemDecorationContribution {
    initialize() {
        this.decorationsService.registerDecorationsProvider(this.problemDecorationProvider);
    }
};
__decorate([
    (0, inversify_1.inject)(decorations_service_1.DecorationsService),
    __metadata("design:type", Object)
], ProblemDecorationContribution.prototype, "decorationsService", void 0);
__decorate([
    (0, inversify_1.inject)(ProblemDecorationsProvider),
    __metadata("design:type", ProblemDecorationsProvider)
], ProblemDecorationContribution.prototype, "problemDecorationProvider", void 0);
ProblemDecorationContribution = __decorate([
    (0, inversify_1.injectable)()
], ProblemDecorationContribution);
exports.ProblemDecorationContribution = ProblemDecorationContribution;
//# sourceMappingURL=problem-decorations-provider.js.map