"use strict";
// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.ResourcePropertiesLabelProvider = exports.DEFAULT_INFO_ICON = void 0;
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const resource_property_view_tree_items_1 = require("./resource-property-view-tree-items");
exports.DEFAULT_INFO_ICON = (0, browser_1.codicon)('info');
let ResourcePropertiesLabelProvider = class ResourcePropertiesLabelProvider {
    canHandle(element) {
        return (resource_property_view_tree_items_1.ResourcePropertiesCategoryNode.is(element) || resource_property_view_tree_items_1.ResourcePropertiesItemNode.is(element)) ? 75 : 0;
    }
    getIcon(node) {
        var _a, _b;
        if (resource_property_view_tree_items_1.ResourcePropertiesCategoryNode.is(node)) {
            return (_a = node.icon) !== null && _a !== void 0 ? _a : exports.DEFAULT_INFO_ICON;
        }
        return (_b = node.icon) !== null && _b !== void 0 ? _b : '';
    }
    getName(node) {
        return node.name;
    }
    getLongName(node) {
        if (resource_property_view_tree_items_1.ResourcePropertiesItemNode.is(node)) {
            return node.property;
        }
        return this.getName(node);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], ResourcePropertiesLabelProvider.prototype, "labelProvider", void 0);
ResourcePropertiesLabelProvider = __decorate([
    (0, inversify_1.injectable)()
], ResourcePropertiesLabelProvider);
exports.ResourcePropertiesLabelProvider = ResourcePropertiesLabelProvider;
//# sourceMappingURL=resource-property-view-label-provider.js.map