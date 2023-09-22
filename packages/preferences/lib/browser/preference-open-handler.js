"use strict";
// *****************************************************************************
// Copyright (C) 2022 TypeFox and others.
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
exports.PreferenceOpenHandler = void 0;
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const preferences_contribution_1 = require("./preferences-contribution");
let PreferenceOpenHandler = class PreferenceOpenHandler {
    constructor() {
        this.id = 'preference';
    }
    canHandle(uri) {
        return uri.scheme === this.id ? 500 : -1;
    }
    async open(uri) {
        const preferencesWidget = await this.preferencesContribution.openView();
        const selector = `li[data-pref-id="${uri.path.toString()}"]:not([data-node-id^="commonly-used@"])`;
        const element = document.querySelector(selector);
        if (element instanceof HTMLElement) {
            if (element.classList.contains('hidden')) {
                // We clear the search term as we have clicked on a hidden preference
                await preferencesWidget.setSearchTerm('');
                await (0, browser_1.animationFrame)();
            }
            element.scrollIntoView({
                block: 'center'
            });
            element.focus();
            return true;
        }
        return false;
    }
};
__decorate([
    (0, inversify_1.inject)(preferences_contribution_1.PreferencesContribution),
    __metadata("design:type", preferences_contribution_1.PreferencesContribution)
], PreferenceOpenHandler.prototype, "preferencesContribution", void 0);
PreferenceOpenHandler = __decorate([
    (0, inversify_1.injectable)()
], PreferenceOpenHandler);
exports.PreferenceOpenHandler = PreferenceOpenHandler;
//# sourceMappingURL=preference-open-handler.js.map