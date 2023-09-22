"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.PreferenceTreeLabelProvider = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const preference_types_1 = require("./preference-types");
const preference_tree_generator_1 = require("./preference-tree-generator");
let PreferenceTreeLabelProvider = class PreferenceTreeLabelProvider {
    canHandle(element) {
        return browser_1.TreeNode.is(element) && preference_types_1.Preference.TreeNode.is(element) ? 150 : 0;
    }
    getName(node) {
        var _a;
        const { id } = preference_types_1.Preference.TreeNode.getGroupAndIdFromNodeId(node.id);
        return this.formatString((_a = this.treeGenerator.getCustomLabelFor(id)) !== null && _a !== void 0 ? _a : id.split('.').pop());
    }
    getPrefix(node, fullPath = false) {
        const { depth } = node;
        const { id, group } = preference_types_1.Preference.TreeNode.getGroupAndIdFromNodeId(node.id);
        const segments = id.split('.');
        const segmentsHandled = group === segments[0] ? depth : depth - 1;
        segments.pop(); // Ignore the leaf name.
        const prefixSegments = fullPath ? segments : segments.slice(segmentsHandled);
        if (prefixSegments.length) {
            let output = prefixSegments.length > 1 ? `${this.formatString(prefixSegments[0])} › ` : `${this.formatString(prefixSegments[0])}: `;
            for (const segment of prefixSegments.slice(1)) {
                output += `${this.formatString(segment)}: `;
            }
            return output;
        }
    }
    formatString(string) {
        let formattedString = string[0].toLocaleUpperCase();
        for (let i = 1; i < string.length; i++) {
            if (this.isUpperCase(string[i]) && !/\s/.test(string[i - 1]) && !this.isUpperCase(string[i - 1])) {
                formattedString += ' ';
            }
            formattedString += string[i];
        }
        return formattedString.trim();
    }
    isUpperCase(char) {
        return char === char.toLocaleUpperCase() && char.toLocaleLowerCase() !== char.toLocaleUpperCase();
    }
};
__decorate([
    (0, inversify_1.inject)(preference_tree_generator_1.PreferenceTreeGenerator),
    __metadata("design:type", preference_tree_generator_1.PreferenceTreeGenerator)
], PreferenceTreeLabelProvider.prototype, "treeGenerator", void 0);
PreferenceTreeLabelProvider = __decorate([
    (0, inversify_1.injectable)()
], PreferenceTreeLabelProvider);
exports.PreferenceTreeLabelProvider = PreferenceTreeLabelProvider;
//# sourceMappingURL=preference-tree-label-provider.js.map