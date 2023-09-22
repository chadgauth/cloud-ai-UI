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
var MemoryDockpanelPlaceholder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryDockpanelPlaceholder = void 0;
/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const React = require("@theia/core/shared/react");
let MemoryDockpanelPlaceholder = MemoryDockpanelPlaceholder_1 = class MemoryDockpanelPlaceholder extends browser_1.ReactWidget {
    init() {
        this.id = MemoryDockpanelPlaceholder_1.ID;
        this.addClass(MemoryDockpanelPlaceholder_1.ID);
        this.update();
    }
    render() {
        return (React.createElement("div", { className: 't-mv-memory-fetch-error' },
            "Click the ",
            React.createElement("i", { className: 'memory-view-icon toolbar' }),
            " icon to add a new memory view or the ",
            React.createElement("i", { className: 'register-view-icon toolbar' }),
            " icon to add a register view."));
    }
};
MemoryDockpanelPlaceholder.ID = 'memory-dockpanel-placeholder';
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryDockpanelPlaceholder.prototype, "init", null);
MemoryDockpanelPlaceholder = MemoryDockpanelPlaceholder_1 = __decorate([
    (0, inversify_1.injectable)()
], MemoryDockpanelPlaceholder);
exports.MemoryDockpanelPlaceholder = MemoryDockpanelPlaceholder;
//# sourceMappingURL=memory-dockpanel-placeholder-widget.js.map