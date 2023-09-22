"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.FileDialogTreeFiltersRenderer = exports.FileDialogTreeFiltersRendererOptions = exports.FileDialogTreeFiltersRendererFactory = exports.FileDialogTreeFilters = exports.FILE_TREE_FILTERS_LIST_CLASS = void 0;
const react_renderer_1 = require("@theia/core/lib/browser/widgets/react-renderer");
const React = require("@theia/core/shared/react");
const inversify_1 = require("@theia/core/shared/inversify");
exports.FILE_TREE_FILTERS_LIST_CLASS = 'theia-FileTreeFiltersList';
/**
 * A set of file filters that are used by the dialog. Each entry is a human readable label,
 * like "TypeScript", and an array of extensions, e.g.
 * ```ts
 * {
 *  'Images': ['png', 'jpg']
 *  'TypeScript': ['ts', 'tsx']
 * }
 * ```
 */
class FileDialogTreeFilters {
}
exports.FileDialogTreeFilters = FileDialogTreeFilters;
exports.FileDialogTreeFiltersRendererFactory = Symbol('FileDialogTreeFiltersRendererFactory');
exports.FileDialogTreeFiltersRendererOptions = Symbol('FileDialogTreeFiltersRendererOptions');
let FileDialogTreeFiltersRenderer = class FileDialogTreeFiltersRenderer extends react_renderer_1.ReactRenderer {
    constructor(options) {
        super();
        this.options = options;
        this.handleFilterChanged = (e) => this.onFilterChanged(e);
        this.suppliedFilters = options.suppliedFilters;
        this.fileDialogTree = options.fileDialogTree;
        this.appliedFilters = { ...this.suppliedFilters, 'All Files': [], };
    }
    doRender() {
        if (!this.appliedFilters) {
            return undefined;
        }
        const options = Object.keys(this.appliedFilters).map(value => this.renderLocation(value));
        return React.createElement("select", { className: 'theia-select ' + exports.FILE_TREE_FILTERS_LIST_CLASS, onChange: this.handleFilterChanged }, ...options);
    }
    renderLocation(value) {
        return React.createElement("option", { value: value, key: value }, value);
    }
    onFilterChanged(e) {
        const locationList = this.locationList;
        if (locationList) {
            const value = locationList.value;
            const filters = this.appliedFilters[value];
            this.fileDialogTree.setFilter(filters);
        }
        e.preventDefault();
        e.stopPropagation();
    }
    get locationList() {
        const locationList = this.host.getElementsByClassName(exports.FILE_TREE_FILTERS_LIST_CLASS)[0];
        if (locationList instanceof HTMLSelectElement) {
            return locationList;
        }
        return undefined;
    }
};
FileDialogTreeFiltersRenderer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.FileDialogTreeFiltersRendererOptions)),
    __metadata("design:paramtypes", [Object])
], FileDialogTreeFiltersRenderer);
exports.FileDialogTreeFiltersRenderer = FileDialogTreeFiltersRenderer;
//# sourceMappingURL=file-dialog-tree-filters-renderer.js.map