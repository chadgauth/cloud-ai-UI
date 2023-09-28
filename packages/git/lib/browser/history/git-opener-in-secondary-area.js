"use strict";
// *****************************************************************************
// Copyright (C) 2020 Arm and others.
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
exports.GitOpenerInSecondaryArea = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const widgets_1 = require("@theia/core/shared/@phosphor/widgets");
const editor_manager_1 = require("@theia/editor/lib/browser/editor-manager");
let GitOpenerInSecondaryArea = class GitOpenerInSecondaryArea {
    setRefWidget(refWidget) {
        this.refWidget = refWidget;
    }
    async open(changeUri) {
        const ref = this.ref;
        const widget = await this.editorManager.open(changeUri, {
            mode: 'reveal',
            widgetOptions: ref ?
                { area: 'main', mode: 'tab-after', ref } :
                { area: 'main', mode: 'split-right', ref: this.refWidget }
        });
        this.ref = widget instanceof widgets_1.Widget ? widget : undefined;
        if (this.ref) {
            this.ref.disposed.connect(() => {
                if (this.ref === widget) {
                    this.ref = undefined;
                }
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], GitOpenerInSecondaryArea.prototype, "editorManager", void 0);
GitOpenerInSecondaryArea = __decorate([
    (0, inversify_1.injectable)()
], GitOpenerInSecondaryArea);
exports.GitOpenerInSecondaryArea = GitOpenerInSecondaryArea;
//# sourceMappingURL=git-opener-in-secondary-area.js.map