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
exports.AbstractNavigatorTreeWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const navigator_preferences_1 = require("./navigator-preferences");
const preference_service_1 = require("@theia/core/lib/browser/preferences/preference-service");
const browser_1 = require("@theia/filesystem/lib/browser");
let AbstractNavigatorTreeWidget = class AbstractNavigatorTreeWidget extends browser_1.FileTreeWidget {
    init() {
        super.init();
        this.toDispose.push(this.preferenceService.onPreferenceChanged(preference => {
            if (preference.preferenceName === 'explorer.decorations.colors') {
                this.update();
            }
        }));
    }
    decorateCaption(node, attrs) {
        const attributes = super.decorateCaption(node, attrs);
        if (this.navigatorPreferences.get('explorer.decorations.colors')) {
            return attributes;
        }
        else {
            return {
                ...attributes,
                style: {
                    ...attributes.style,
                    color: undefined,
                }
            };
        }
    }
};
__decorate([
    (0, inversify_1.inject)(preference_service_1.PreferenceService),
    __metadata("design:type", Object)
], AbstractNavigatorTreeWidget.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_preferences_1.FileNavigatorPreferences),
    __metadata("design:type", Object)
], AbstractNavigatorTreeWidget.prototype, "navigatorPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AbstractNavigatorTreeWidget.prototype, "init", null);
AbstractNavigatorTreeWidget = __decorate([
    (0, inversify_1.injectable)()
], AbstractNavigatorTreeWidget);
exports.AbstractNavigatorTreeWidget = AbstractNavigatorTreeWidget;
//# sourceMappingURL=abstract-navigator-tree-widget.js.map