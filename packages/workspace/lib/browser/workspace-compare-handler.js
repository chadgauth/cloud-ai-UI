"use strict";
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.WorkspaceCompareHandler = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const diff_service_1 = require("./diff-service");
let WorkspaceCompareHandler = class WorkspaceCompareHandler {
    /**
     * Determine if the command is visible.
     *
     * @param uris URIs of selected resources.
     * @returns `true` if the command is visible.
     */
    isVisible(uris) {
        return uris.length === 2;
    }
    /**
     * Determine if the command is enabled.
     *
     * @param uris URIs of selected resources.
     * @returns `true` if the command is enabled.
     */
    isEnabled(uris) {
        return uris.length === 2;
    }
    /**
     * Execute the command.
     *
     * @param uris URIs of selected resources.
     */
    async execute(uris) {
        const [left, right] = uris;
        await this.diffService.openDiffEditor(left, right);
    }
};
__decorate([
    (0, inversify_1.inject)(diff_service_1.DiffService),
    __metadata("design:type", diff_service_1.DiffService)
], WorkspaceCompareHandler.prototype, "diffService", void 0);
WorkspaceCompareHandler = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceCompareHandler);
exports.WorkspaceCompareHandler = WorkspaceCompareHandler;
//# sourceMappingURL=workspace-compare-handler.js.map