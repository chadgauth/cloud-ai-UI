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
var DebugBreakpointsWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugBreakpointsWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const source_tree_1 = require("@theia/core/lib/browser/source-tree");
const debug_breakpoints_source_1 = require("./debug-breakpoints-source");
const breakpoint_manager_1 = require("../breakpoint/breakpoint-manager");
const debug_view_model_1 = require("./debug-view-model");
const nls_1 = require("@theia/core/lib/common/nls");
let DebugBreakpointsWidget = DebugBreakpointsWidget_1 = class DebugBreakpointsWidget extends source_tree_1.SourceTreeWidget {
    static createContainer(parent) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            contextMenuPath: DebugBreakpointsWidget_1.CONTEXT_MENU,
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(debug_breakpoints_source_1.DebugBreakpointsSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(DebugBreakpointsWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugBreakpointsWidget_1.createContainer(parent).get(DebugBreakpointsWidget_1);
    }
    init() {
        super.init();
        this.id = DebugBreakpointsWidget_1.FACTORY_ID + ':' + this.viewModel.id;
        this.title.label = nls_1.nls.localizeByDefault('Breakpoints');
        this.toDispose.push(this.breakpointsSource);
        this.source = this.breakpointsSource;
    }
    getDefaultNodeStyle(node, props) {
        return undefined;
    }
};
DebugBreakpointsWidget.CONTEXT_MENU = ['debug-breakpoints-context-menu'];
DebugBreakpointsWidget.EDIT_MENU = [...DebugBreakpointsWidget_1.CONTEXT_MENU, 'a_edit'];
DebugBreakpointsWidget.REMOVE_MENU = [...DebugBreakpointsWidget_1.CONTEXT_MENU, 'b_remove'];
DebugBreakpointsWidget.ENABLE_MENU = [...DebugBreakpointsWidget_1.CONTEXT_MENU, 'c_enable'];
DebugBreakpointsWidget.FACTORY_ID = 'debug:breakpoints';
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugBreakpointsWidget.prototype, "viewModel", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugBreakpointsWidget.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(debug_breakpoints_source_1.DebugBreakpointsSource),
    __metadata("design:type", debug_breakpoints_source_1.DebugBreakpointsSource)
], DebugBreakpointsWidget.prototype, "breakpointsSource", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugBreakpointsWidget.prototype, "init", null);
DebugBreakpointsWidget = DebugBreakpointsWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugBreakpointsWidget);
exports.DebugBreakpointsWidget = DebugBreakpointsWidget;
//# sourceMappingURL=debug-breakpoints-widget.js.map