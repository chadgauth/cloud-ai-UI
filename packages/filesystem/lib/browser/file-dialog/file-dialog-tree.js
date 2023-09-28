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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDialogTree = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const file_tree_1 = require("../file-tree");
let FileDialogTree = class FileDialogTree extends file_tree_1.FileTree {
    constructor() {
        super(...arguments);
        this._showHidden = false;
        this.isHiddenFile = (fileStat) => {
            const { name } = fileStat;
            const filename = name !== null && name !== void 0 ? name : '';
            const isHidden = filename.startsWith('.');
            return isHidden;
        };
        /**
         * Extensions for files to be shown
         */
        this.fileExtensions = [];
    }
    set showHidden(show) {
        this._showHidden = show;
        this.refresh();
    }
    get showHidden() {
        return this._showHidden;
    }
    /**
     * Sets extensions for filtering files
     *
     * @param fileExtensions array of extensions
     */
    setFilter(fileExtensions) {
        this.fileExtensions = fileExtensions.slice();
        this.refresh();
    }
    async toNodes(fileStat, parent) {
        if (!fileStat.children) {
            return [];
        }
        const result = await Promise.all(fileStat.children
            .filter(child => this.isVisible(child))
            .map(child => this.toNode(child, parent)));
        return result.sort(file_tree_1.DirNode.compare);
    }
    /**
     * Determines whether file or folder can be shown
     *
     * @param fileStat resource to check
     */
    isVisible(fileStat) {
        if (!this._showHidden && this.isHiddenFile(fileStat)) {
            return false;
        }
        if (fileStat.isDirectory) {
            return true;
        }
        if (this.fileExtensions.length === 0) {
            return true;
        }
        return !this.fileExtensions.every(value => fileStat.resource.path.ext !== '.' + value);
    }
};
FileDialogTree = __decorate([
    (0, inversify_1.injectable)()
], FileDialogTree);
exports.FileDialogTree = FileDialogTree;
//# sourceMappingURL=file-dialog-tree.js.map