"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
var NavigationLocationSimilarity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationLocationSimilarity = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const navigation_location_1 = require("./navigation-location");
/**
 * Service for checking whether two navigation locations are similar or not.
 */
let NavigationLocationSimilarity = NavigationLocationSimilarity_1 = class NavigationLocationSimilarity {
    /**
     * `true` if the `left` and `right` locations are withing +- 10 lines in the same editor. Otherwise, `false`.
     */
    similar(left, right) {
        if (left === undefined || right === undefined) {
            return left === right;
        }
        if (left.uri.toString() !== right.uri.toString()) {
            return false;
        }
        const leftRange = navigation_location_1.NavigationLocation.range(left);
        const rightRange = navigation_location_1.NavigationLocation.range(right);
        if (leftRange === undefined || rightRange === undefined) {
            return leftRange === rightRange;
        }
        const leftLineNumber = Math.min(leftRange.start.line, leftRange.end.line);
        const rightLineNumber = Math.min(rightRange.start.line, rightRange.end.line);
        return Math.abs(leftLineNumber - rightLineNumber) < this.getThreshold();
    }
    getThreshold() {
        return NavigationLocationSimilarity_1.EDITOR_SELECTION_THRESHOLD;
    }
};
/**
 * The number of lines to move in the editor to justify for new state.
 */
NavigationLocationSimilarity.EDITOR_SELECTION_THRESHOLD = 10;
NavigationLocationSimilarity = NavigationLocationSimilarity_1 = __decorate([
    (0, inversify_1.injectable)()
], NavigationLocationSimilarity);
exports.NavigationLocationSimilarity = NavigationLocationSimilarity;
//# sourceMappingURL=navigation-location-similarity.js.map