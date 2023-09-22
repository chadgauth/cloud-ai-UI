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
var ScmNoRepositoryWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScmNoRepositoryWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const React = require("@theia/core/shared/react");
const browser_1 = require("@theia/core/lib/browser");
const alert_message_1 = require("@theia/core/lib/browser/widgets/alert-message");
const nls_1 = require("@theia/core/lib/common/nls");
let ScmNoRepositoryWidget = ScmNoRepositoryWidget_1 = class ScmNoRepositoryWidget extends browser_1.ReactWidget {
    constructor() {
        super();
        this.addClass('theia-scm-no-repository');
        this.id = ScmNoRepositoryWidget_1.ID;
    }
    render() {
        return React.createElement(alert_message_1.AlertMessage, { type: 'WARNING', header: nls_1.nls.localize('theia/scm/noRepositoryFound', 'No repository found') });
    }
};
ScmNoRepositoryWidget.ID = 'scm-no-repository-widget';
ScmNoRepositoryWidget = ScmNoRepositoryWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ScmNoRepositoryWidget);
exports.ScmNoRepositoryWidget = ScmNoRepositoryWidget;
//# sourceMappingURL=scm-no-repository-widget.js.map