"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.UserPreferenceProvider = exports.UserPreferenceProviderFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const section_preference_provider_1 = require("./section-preference-provider");
exports.UserPreferenceProviderFactory = Symbol('UserPreferenceProviderFactory');
;
/**
 * A @SectionPreferenceProvider that targets the user-level settings
 */
let UserPreferenceProvider = class UserPreferenceProvider extends section_preference_provider_1.SectionPreferenceProvider {
    getScope() {
        return browser_1.PreferenceScope.User;
    }
};
UserPreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], UserPreferenceProvider);
exports.UserPreferenceProvider = UserPreferenceProvider;
//# sourceMappingURL=user-preference-provider.js.map