"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
var DebugWatchWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugWatchWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const source_tree_1 = require("@theia/core/lib/browser/source-tree");
const debug_watch_source_1 = require("./debug-watch-source");
const debug_view_model_1 = require("./debug-view-model");
const nls_1 = require("@theia/core/lib/common/nls");
let DebugWatchWidget = DebugWatchWidget_1 = class DebugWatchWidget extends source_tree_1.SourceTreeWidget {
    static createContainer(parent) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            contextMenuPath: DebugWatchWidget_1.CONTEXT_MENU,
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(debug_watch_source_1.DebugWatchSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(DebugWatchWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugWatchWidget_1.createContainer(parent).get(DebugWatchWidget_1);
    }
    init() {
        super.init();
        this.id = DebugWatchWidget_1.FACTORY_ID + ':' + this.viewModel.id;
        this.title.label = nls_1.nls.localizeByDefault('Watch');
        this.toDispose.push(this.variables);
        this.source = this.variables;
    }
};
DebugWatchWidget.CONTEXT_MENU = ['debug-watch-context-menu'];
DebugWatchWidget.EDIT_MENU = [...DebugWatchWidget_1.CONTEXT_MENU, 'a_edit'];
DebugWatchWidget.REMOVE_MENU = [...DebugWatchWidget_1.CONTEXT_MENU, 'b_remove'];
DebugWatchWidget.FACTORY_ID = 'debug:watch';
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugWatchWidget.prototype, "viewModel", void 0);
__decorate([
    (0, inversify_1.inject)(debug_watch_source_1.DebugWatchSource),
    __metadata("design:type", debug_watch_source_1.DebugWatchSource)
], DebugWatchWidget.prototype, "variables", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugWatchWidget.prototype, "init", null);
DebugWatchWidget = DebugWatchWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugWatchWidget);
exports.DebugWatchWidget = DebugWatchWidget;
//# sourceMappingURL=debug-watch-widget.js.map