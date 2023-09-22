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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNavigatorFilterPredicate = exports.FileNavigatorFilter = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const minimatch_1 = require("minimatch");
const event_1 = require("@theia/core/lib/common/event");
const filesystem_preferences_1 = require("@theia/filesystem/lib/browser/filesystem-preferences");
const navigator_preferences_1 = require("./navigator-preferences");
/**
 * Filter for omitting elements from the navigator. For more details on the exclusion patterns,
 * one should check either the manual with `man 5 gitignore` or just [here](https://git-scm.com/docs/gitignore).
 */
let FileNavigatorFilter = class FileNavigatorFilter {
    constructor(preferences) {
        this.preferences = preferences;
        this.emitter = new event_1.Emitter();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.filterPredicate = this.createFilterPredicate(this.filesPreferences['files.exclude']);
        this.filesPreferences.onPreferenceChanged(event => this.onFilesPreferenceChanged(event));
        this.preferences.onPreferenceChanged(event => this.onPreferenceChanged(event));
    }
    async filter(items) {
        return (await items).filter(item => this.filterItem(item));
    }
    get onFilterChanged() {
        return this.emitter.event;
    }
    filterItem(item) {
        return this.filterPredicate.filter(item);
    }
    fireFilterChanged() {
        this.emitter.fire(undefined);
    }
    onFilesPreferenceChanged(event) {
        const { preferenceName, newValue } = event;
        if (preferenceName === 'files.exclude') {
            this.filterPredicate = this.createFilterPredicate(newValue || {});
            this.fireFilterChanged();
        }
    }
    onPreferenceChanged(event) {
    }
    createFilterPredicate(exclusions) {
        return new FileNavigatorFilterPredicate(this.interceptExclusions(exclusions));
    }
    toggleHiddenFiles() {
        this.showHiddenFiles = !this.showHiddenFiles;
        const filesExcludes = this.filesPreferences['files.exclude'];
        this.filterPredicate = this.createFilterPredicate(filesExcludes || {});
        this.fireFilterChanged();
    }
    interceptExclusions(exclusions) {
        return {
            ...exclusions,
            '**/.*': this.showHiddenFiles
        };
    }
};
__decorate([
    (0, inversify_1.inject)(filesystem_preferences_1.FileSystemPreferences),
    __metadata("design:type", Object)
], FileNavigatorFilter.prototype, "filesPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileNavigatorFilter.prototype, "init", null);
FileNavigatorFilter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(navigator_preferences_1.FileNavigatorPreferences)),
    __metadata("design:paramtypes", [Object])
], FileNavigatorFilter);
exports.FileNavigatorFilter = FileNavigatorFilter;
(function (FileNavigatorFilter) {
    let Predicate;
    (function (Predicate) {
        /**
         * Wraps a bunch of predicates and returns with a new one that evaluates to `true` if
         * each of the wrapped predicates evaluates to `true`. Otherwise, `false`.
         */
        function and(...predicates) {
            return {
                filter: id => predicates.every(predicate => predicate.filter(id))
            };
        }
        Predicate.and = and;
    })(Predicate = FileNavigatorFilter.Predicate || (FileNavigatorFilter.Predicate = {}));
})(FileNavigatorFilter = exports.FileNavigatorFilter || (exports.FileNavigatorFilter = {}));
exports.FileNavigatorFilter = FileNavigatorFilter;
/**
 * Concrete filter navigator filter predicate that is decoupled from the preferences.
 */
class FileNavigatorFilterPredicate {
    constructor(exclusions) {
        const patterns = Object.keys(exclusions).map(pattern => ({ pattern, enabled: exclusions[pattern] })).filter(object => object.enabled).map(object => object.pattern);
        this.delegate = FileNavigatorFilter.Predicate.and(...patterns.map(pattern => this.createDelegate(pattern)));
    }
    filter(item) {
        return this.delegate.filter(item);
    }
    createDelegate(pattern) {
        const delegate = new minimatch_1.Minimatch(pattern, { matchBase: true });
        return {
            filter: item => !delegate.match(item.id)
        };
    }
}
exports.FileNavigatorFilterPredicate = FileNavigatorFilterPredicate;
//# sourceMappingURL=navigator-filter.js.map