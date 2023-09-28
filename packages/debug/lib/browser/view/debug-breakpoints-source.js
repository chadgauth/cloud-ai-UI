"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.DebugBreakpointsSource = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const source_tree_1 = require("@theia/core/lib/browser/source-tree");
const debug_view_model_1 = require("./debug-view-model");
const breakpoint_manager_1 = require("../breakpoint/breakpoint-manager");
const debug_exception_breakpoint_1 = require("./debug-exception-breakpoint");
let DebugBreakpointsSource = class DebugBreakpointsSource extends source_tree_1.TreeSource {
    init() {
        this.fireDidChange();
        this.toDispose.push(this.model.onDidChangeBreakpoints(() => this.fireDidChange()));
    }
    *getElements() {
        for (const exceptionBreakpoint of this.breakpoints.getExceptionBreakpoints()) {
            yield new debug_exception_breakpoint_1.DebugExceptionBreakpoint(exceptionBreakpoint, this.breakpoints);
        }
        for (const functionBreakpoint of this.model.functionBreakpoints) {
            yield functionBreakpoint;
        }
        for (const instructionBreakpoint of this.model.instructionBreakpoints) {
            yield instructionBreakpoint;
        }
        for (const breakpoint of this.model.breakpoints) {
            yield breakpoint;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugBreakpointsSource.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugBreakpointsSource.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugBreakpointsSource.prototype, "init", null);
DebugBreakpointsSource = __decorate([
    (0, inversify_1.injectable)()
], DebugBreakpointsSource);
exports.DebugBreakpointsSource = DebugBreakpointsSource;
//# sourceMappingURL=debug-breakpoints-source.js.map