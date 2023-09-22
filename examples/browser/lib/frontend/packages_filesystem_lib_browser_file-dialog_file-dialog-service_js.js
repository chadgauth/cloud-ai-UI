(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_filesystem_lib_browser_file-dialog_file-dialog-service_js"],{

/***/ "../../packages/core/shared/dompurify/index.js":
/*!*****************************************************!*\
  !*** ../../packages/core/shared/dompurify/index.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! dompurify */ "../../node_modules/dompurify/dist/purify.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/dompurify'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-hidden-files-renderer.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-dialog/file-dialog-hidden-files-renderer.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDialogHiddenFilesToggleRenderer = exports.HiddenFilesToggleRendererFactory = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const file_dialog_tree_1 = __webpack_require__(/*! ./file-dialog-tree */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree.js");
const TOGGLE_HIDDEN_PANEL_CLASS = 'theia-ToggleHiddenPanel';
const TOGGLE_HIDDEN_CONTAINER_CLASS = 'theia-ToggleHiddenInputContainer';
const CHECKBOX_CLASS = 'theia-ToggleHiddenInputCheckbox';
exports.HiddenFilesToggleRendererFactory = Symbol('HiddenFilesToggleRendererFactory');
class FileDialogHiddenFilesToggleRenderer extends browser_1.ReactRenderer {
    constructor() {
        super(...arguments);
        this.handleCheckboxChanged = (e) => this.onCheckboxChanged(e);
    }
    init() {
        this.host.classList.add(TOGGLE_HIDDEN_PANEL_CLASS);
        this.render();
    }
    doRender() {
        return (React.createElement("div", { className: TOGGLE_HIDDEN_CONTAINER_CLASS },
            core_1.nls.localize('theia/fileDialog/showHidden', 'Show hidden files'),
            React.createElement("input", { type: 'checkbox', className: CHECKBOX_CLASS, onChange: this.handleCheckboxChanged })));
    }
    onCheckboxChanged(e) {
        const { checked } = e.target;
        this.fileDialogTree.showHidden = checked;
        e.stopPropagation();
    }
}
__decorate([
    (0, inversify_1.inject)(file_dialog_tree_1.FileDialogTree),
    __metadata("design:type", file_dialog_tree_1.FileDialogTree)
], FileDialogHiddenFilesToggleRenderer.prototype, "fileDialogTree", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileDialogHiddenFilesToggleRenderer.prototype, "init", null);
exports.FileDialogHiddenFilesToggleRenderer = FileDialogHiddenFilesToggleRenderer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-dialog/file-dialog-hidden-files-renderer'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-model.js":
/*!******************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-dialog/file-dialog-model.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDialogModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const file_tree_1 = __webpack_require__(/*! ../file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js");
const file_dialog_tree_1 = __webpack_require__(/*! ./file-dialog-tree */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree.js");
let FileDialogModel = class FileDialogModel extends file_tree_1.FileTreeModel {
    constructor() {
        super(...arguments);
        this.onDidOpenFileEmitter = new common_1.Emitter();
        this._disableFileSelection = false;
    }
    init() {
        super.init();
        this.toDispose.push(this.onDidOpenFileEmitter);
    }
    /**
     * Returns the first valid location that was set by calling the `navigateTo` method. Once the initial location has a defined value, it will not change.
     * Can be `undefined`.
     */
    get initialLocation() {
        return this._initialLocation;
    }
    set disableFileSelection(isSelectable) {
        this._disableFileSelection = isSelectable;
    }
    async navigateTo(nodeOrId) {
        const result = await super.navigateTo(nodeOrId);
        if (!this._initialLocation && file_tree_1.FileStatNode.is(result)) {
            this._initialLocation = result.uri;
        }
        return result;
    }
    get onDidOpenFile() {
        return this.onDidOpenFileEmitter.event;
    }
    doOpenNode(node) {
        if (file_tree_1.FileNode.is(node)) {
            this.onDidOpenFileEmitter.fire(undefined);
        }
        else if (file_tree_1.DirNode.is(node)) {
            this.navigateTo(node);
        }
        else {
            super.doOpenNode(node);
        }
    }
    getNextSelectableNode(node = this.getFocusedNode()) {
        let nextNode = node;
        do {
            nextNode = super.getNextSelectableNode(nextNode);
        } while (file_tree_1.FileStatNode.is(nextNode) && !this.isFileStatNodeSelectable(nextNode));
        return nextNode;
    }
    getPrevSelectableNode(node = this.getFocusedNode()) {
        let prevNode = node;
        do {
            prevNode = super.getPrevSelectableNode(prevNode);
        } while (file_tree_1.FileStatNode.is(prevNode) && !this.isFileStatNodeSelectable(prevNode));
        return prevNode;
    }
    isFileStatNodeSelectable(node) {
        return !(!node.fileStat.isDirectory && this._disableFileSelection);
    }
    canNavigateUpward() {
        const treeRoot = this.tree.root;
        return file_tree_1.FileStatNode.is(treeRoot) && !treeRoot.uri.path.isRoot;
    }
};
__decorate([
    (0, inversify_1.inject)(file_dialog_tree_1.FileDialogTree),
    __metadata("design:type", file_dialog_tree_1.FileDialogTree)
], FileDialogModel.prototype, "tree", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileDialogModel.prototype, "init", null);
FileDialogModel = __decorate([
    (0, inversify_1.injectable)()
], FileDialogModel);
exports.FileDialogModel = FileDialogModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-dialog/file-dialog-model'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-service.js":
/*!********************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-dialog/file-dialog-service.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultFileDialogService = exports.FileDialogService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_tree_1 = __webpack_require__(/*! ../file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js");
const file_dialog_1 = __webpack_require__(/*! ./file-dialog */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog.js");
const file_service_1 = __webpack_require__(/*! ../file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const user_working_directory_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/user-working-directory-provider */ "../../packages/core/lib/browser/user-working-directory-provider.js");
exports.FileDialogService = Symbol('FileDialogService');
let DefaultFileDialogService = class DefaultFileDialogService {
    async showOpenDialog(props, folder) {
        const title = props.title || common_1.nls.localizeByDefault('Open');
        const rootNode = await this.getRootNode(folder);
        if (rootNode) {
            const dialog = this.openFileDialogFactory(Object.assign(props, { title }));
            await dialog.model.navigateTo(rootNode);
            const value = await dialog.open();
            if (value) {
                if (!Array.isArray(value)) {
                    return value.uri;
                }
                return value.map(node => node.uri);
            }
        }
        return undefined;
    }
    async showSaveDialog(props, folder) {
        const title = props.title || common_1.nls.localizeByDefault('Save');
        const rootNode = await this.getRootNode(folder);
        if (rootNode) {
            const dialog = this.saveFileDialogFactory(Object.assign(props, { title }));
            await dialog.model.navigateTo(rootNode);
            return dialog.open();
        }
        return undefined;
    }
    async getRootNode(folderToOpen) {
        const folderExists = folderToOpen && await this.fileService.exists(folderToOpen.resource);
        const folder = folderToOpen && folderExists ? folderToOpen : {
            resource: await this.rootProvider.getUserWorkingDir(),
            isDirectory: true
        };
        const folderUri = folder.resource;
        const rootUri = folder.isDirectory ? folderUri : folderUri.parent;
        try {
            const rootStat = await this.fileService.resolve(rootUri);
            return file_tree_1.DirNode.createRoot(rootStat);
        }
        catch { }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], DefaultFileDialogService.prototype, "environments", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], DefaultFileDialogService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(file_dialog_1.OpenFileDialogFactory),
    __metadata("design:type", Function)
], DefaultFileDialogService.prototype, "openFileDialogFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], DefaultFileDialogService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(file_dialog_1.SaveFileDialogFactory),
    __metadata("design:type", Function)
], DefaultFileDialogService.prototype, "saveFileDialogFactory", void 0);
__decorate([
    (0, inversify_1.inject)(user_working_directory_provider_1.UserWorkingDirectoryProvider),
    __metadata("design:type", user_working_directory_provider_1.UserWorkingDirectoryProvider)
], DefaultFileDialogService.prototype, "rootProvider", void 0);
DefaultFileDialogService = __decorate([
    (0, inversify_1.injectable)()
], DefaultFileDialogService);
exports.DefaultFileDialogService = DefaultFileDialogService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-dialog/file-dialog-service'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree-filters-renderer.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree-filters-renderer.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDialogTreeFiltersRenderer = exports.FileDialogTreeFiltersRendererOptions = exports.FileDialogTreeFiltersRendererFactory = exports.FileDialogTreeFilters = exports.FILE_TREE_FILTERS_LIST_CLASS = void 0;
const react_renderer_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/react-renderer */ "../../packages/core/lib/browser/widgets/react-renderer.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-dialog/file-dialog-tree-filters-renderer'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree.js":
/*!*****************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDialogTree = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const file_tree_1 = __webpack_require__(/*! ../file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-dialog/file-dialog-tree'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-widget.js":
/*!*******************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-dialog/file-dialog-widget.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDialogWidget = exports.NOT_SELECTABLE_CLASS = exports.FILE_DIALOG_CLASS = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_tree_1 = __webpack_require__(/*! ../file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js");
const file_dialog_model_1 = __webpack_require__(/*! ./file-dialog-model */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-model.js");
exports.FILE_DIALOG_CLASS = 'theia-FileDialog';
exports.NOT_SELECTABLE_CLASS = 'theia-mod-not-selectable';
let FileDialogWidget = class FileDialogWidget extends file_tree_1.FileTreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        this._disableFileSelection = false;
        this.addClass(exports.FILE_DIALOG_CLASS);
    }
    set disableFileSelection(isSelectable) {
        this._disableFileSelection = isSelectable;
        this.model.disableFileSelection = isSelectable;
    }
    createNodeAttributes(node, props) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attr = super.createNodeAttributes(node, props);
        if (this.shouldDisableSelection(node)) {
            const keys = Object.keys(attr);
            keys.forEach(k => {
                if (['className', 'style', 'title'].indexOf(k) < 0) {
                    delete attr[k];
                }
            });
        }
        return attr;
    }
    createNodeClassNames(node, props) {
        const classNames = super.createNodeClassNames(node, props);
        if (this.shouldDisableSelection(node)) {
            [browser_1.SELECTED_CLASS, browser_1.FOCUS_CLASS].forEach(name => {
                const ind = classNames.indexOf(name);
                if (ind >= 0) {
                    classNames.splice(ind, 1);
                }
            });
            classNames.push(exports.NOT_SELECTABLE_CLASS);
        }
        return classNames;
    }
    shouldDisableSelection(node) {
        return file_tree_1.FileStatNode.is(node) && !node.fileStat.isDirectory && this._disableFileSelection;
    }
};
FileDialogWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(file_dialog_model_1.FileDialogModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, file_dialog_model_1.FileDialogModel,
        browser_1.ContextMenuRenderer])
], FileDialogWidget);
exports.FileDialogWidget = FileDialogWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-dialog/file-dialog-widget'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-dialog/file-dialog.js":
/*!************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-dialog/file-dialog.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SaveFileDialog = exports.OpenFileDialog = exports.FileDialog = exports.SaveFileDialogProps = exports.OpenFileDialogProps = exports.FileDialogProps = exports.TOOLBAR_ITEM_TRANSFORM_TIMEOUT = exports.CONTROL_PANEL_CLASS = exports.FILENAME_TEXTFIELD_CLASS = exports.FILENAME_LABEL_CLASS = exports.FILENAME_PANEL_CLASS = exports.FILTERS_LIST_PANEL_CLASS = exports.FILTERS_LABEL_CLASS = exports.FILTERS_PANEL_CLASS = exports.NAVIGATION_LOCATION_LIST_PANEL_CLASS = exports.NAVIGATION_UP_CLASS = exports.NAVIGATION_HOME_CLASS = exports.NAVIGATION_FORWARD_CLASS = exports.NAVIGATION_BACK_CLASS = exports.NAVIGATION_PANEL_CLASS = exports.SAVE_DIALOG_CLASS = exports.SaveFileDialogFactory = exports.OpenFileDialogFactory = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const location_1 = __webpack_require__(/*! ../location */ "../../packages/filesystem/lib/browser/location/index.js");
const file_dialog_widget_1 = __webpack_require__(/*! ./file-dialog-widget */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-widget.js");
const file_dialog_tree_filters_renderer_1 = __webpack_require__(/*! ./file-dialog-tree-filters-renderer */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree-filters-renderer.js");
const widgets_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/widgets */ "../../packages/core/shared/@phosphor/widgets/index.js");
const DOMPurify = __webpack_require__(/*! @theia/core/shared/dompurify */ "../../packages/core/shared/dompurify/index.js");
const file_dialog_hidden_files_renderer_1 = __webpack_require__(/*! ./file-dialog-hidden-files-renderer */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-hidden-files-renderer.js");
exports.OpenFileDialogFactory = Symbol('OpenFileDialogFactory');
exports.SaveFileDialogFactory = Symbol('SaveFileDialogFactory');
exports.SAVE_DIALOG_CLASS = 'theia-SaveFileDialog';
exports.NAVIGATION_PANEL_CLASS = 'theia-NavigationPanel';
exports.NAVIGATION_BACK_CLASS = 'theia-NavigationBack';
exports.NAVIGATION_FORWARD_CLASS = 'theia-NavigationForward';
exports.NAVIGATION_HOME_CLASS = 'theia-NavigationHome';
exports.NAVIGATION_UP_CLASS = 'theia-NavigationUp';
exports.NAVIGATION_LOCATION_LIST_PANEL_CLASS = 'theia-LocationListPanel';
exports.FILTERS_PANEL_CLASS = 'theia-FiltersPanel';
exports.FILTERS_LABEL_CLASS = 'theia-FiltersLabel';
exports.FILTERS_LIST_PANEL_CLASS = 'theia-FiltersListPanel';
exports.FILENAME_PANEL_CLASS = 'theia-FileNamePanel';
exports.FILENAME_LABEL_CLASS = 'theia-FileNameLabel';
exports.FILENAME_TEXTFIELD_CLASS = 'theia-FileNameTextField';
exports.CONTROL_PANEL_CLASS = 'theia-ControlPanel';
exports.TOOLBAR_ITEM_TRANSFORM_TIMEOUT = 100;
class FileDialogProps extends browser_1.DialogProps {
}
exports.FileDialogProps = FileDialogProps;
let OpenFileDialogProps = class OpenFileDialogProps extends FileDialogProps {
};
OpenFileDialogProps = __decorate([
    (0, inversify_1.injectable)()
], OpenFileDialogProps);
exports.OpenFileDialogProps = OpenFileDialogProps;
let SaveFileDialogProps = class SaveFileDialogProps extends FileDialogProps {
};
SaveFileDialogProps = __decorate([
    (0, inversify_1.injectable)()
], SaveFileDialogProps);
exports.SaveFileDialogProps = SaveFileDialogProps;
let FileDialog = class FileDialog extends browser_1.AbstractDialog {
    constructor(props) {
        super(props);
        this.props = props;
    }
    init() {
        this.treePanel = new widgets_1.Panel();
        this.treePanel.addWidget(this.widget);
        this.toDispose.push(this.treePanel);
        this.toDispose.push(this.model.onChanged(() => this.update()));
        this.toDispose.push(this.model.onDidOpenFile(() => this.accept()));
        this.toDispose.push(this.model.onSelectionChanged(() => this.update()));
        const navigationPanel = document.createElement('div');
        navigationPanel.classList.add(exports.NAVIGATION_PANEL_CLASS);
        this.contentNode.appendChild(navigationPanel);
        navigationPanel.appendChild(this.back = (0, browser_1.createIconButton)(...(0, browser_1.codiconArray)('chevron-left', true)));
        this.back.classList.add(exports.NAVIGATION_BACK_CLASS);
        this.back.title = common_1.nls.localize('theia/filesystem/dialog/navigateBack', 'Navigate Back');
        navigationPanel.appendChild(this.forward = (0, browser_1.createIconButton)(...(0, browser_1.codiconArray)('chevron-right', true)));
        this.forward.classList.add(exports.NAVIGATION_FORWARD_CLASS);
        this.forward.title = common_1.nls.localize('theia/filesystem/dialog/navigateForward', 'Navigate Forward');
        navigationPanel.appendChild(this.home = (0, browser_1.createIconButton)(...(0, browser_1.codiconArray)('home', true)));
        this.home.classList.add(exports.NAVIGATION_HOME_CLASS);
        this.home.title = common_1.nls.localize('theia/filesystem/dialog/initialLocation', 'Go To Initial Location');
        navigationPanel.appendChild(this.up = (0, browser_1.createIconButton)(...(0, browser_1.codiconArray)('arrow-up', true)));
        this.up.classList.add(exports.NAVIGATION_UP_CLASS);
        this.up.title = common_1.nls.localize('theia/filesystem/dialog/navigateUp', 'Navigate Up One Directory');
        const locationListRendererHost = document.createElement('div');
        this.locationListRenderer = this.locationListFactory({ model: this.model, host: locationListRendererHost });
        this.toDispose.push(this.locationListRenderer);
        this.locationListRenderer.host.classList.add(exports.NAVIGATION_LOCATION_LIST_PANEL_CLASS);
        navigationPanel.appendChild(this.locationListRenderer.host);
        this.hiddenFilesToggleRenderer = this.hiddenFilesToggleFactory(this.widget.model.tree);
        this.contentNode.appendChild(this.hiddenFilesToggleRenderer.host);
        if (this.props.filters) {
            this.treeFiltersRenderer = this.treeFiltersFactory({ suppliedFilters: this.props.filters, fileDialogTree: this.widget.model.tree });
            const filters = Object.keys(this.props.filters);
            if (filters.length) {
                this.widget.model.tree.setFilter(this.props.filters[filters[0]]);
            }
        }
    }
    get model() {
        return this.widget.model;
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        (0, browser_1.setEnabled)(this.back, this.model.canNavigateBackward());
        (0, browser_1.setEnabled)(this.forward, this.model.canNavigateForward());
        (0, browser_1.setEnabled)(this.home, !!this.model.initialLocation
            && !!this.model.location
            && this.model.initialLocation.toString() !== this.model.location.toString());
        (0, browser_1.setEnabled)(this.up, this.model.canNavigateUpward());
        this.locationListRenderer.render();
        if (this.treeFiltersRenderer) {
            this.treeFiltersRenderer.render();
        }
        this.widget.update();
    }
    handleEnter(event) {
        if (event.target instanceof HTMLTextAreaElement || this.targetIsDirectoryInput(event.target) || this.targetIsInputToggle(event.target)) {
            return false;
        }
        this.accept();
    }
    handleEscape(event) {
        if (event.target instanceof HTMLTextAreaElement || this.targetIsDirectoryInput(event.target)) {
            return false;
        }
        this.close();
    }
    targetIsDirectoryInput(target) {
        return target instanceof HTMLInputElement && target.classList.contains(location_1.LocationListRenderer.Styles.LOCATION_TEXT_INPUT_CLASS);
    }
    targetIsInputToggle(target) {
        return target instanceof HTMLSpanElement && target.classList.contains(location_1.LocationListRenderer.Styles.LOCATION_INPUT_TOGGLE_CLASS);
    }
    appendFiltersPanel() {
        if (this.treeFiltersRenderer) {
            const filtersPanel = document.createElement('div');
            filtersPanel.classList.add(exports.FILTERS_PANEL_CLASS);
            this.contentNode.appendChild(filtersPanel);
            const titlePanel = document.createElement('div');
            titlePanel.innerHTML = DOMPurify.sanitize(common_1.nls.localize('theia/filesystem/format', 'Format:'));
            titlePanel.classList.add(exports.FILTERS_LABEL_CLASS);
            filtersPanel.appendChild(titlePanel);
            this.treeFiltersRenderer.host.classList.add(exports.FILTERS_LIST_PANEL_CLASS);
            filtersPanel.appendChild(this.treeFiltersRenderer.host);
        }
    }
    onAfterAttach(msg) {
        browser_1.Widget.attach(this.treePanel, this.contentNode);
        this.toDisposeOnDetach.push(common_1.Disposable.create(() => {
            browser_1.Widget.detach(this.treePanel);
            this.locationListRenderer.dispose();
            if (this.treeFiltersRenderer) {
                this.treeFiltersRenderer.dispose();
            }
        }));
        this.appendFiltersPanel();
        this.appendCloseButton(common_1.nls.localizeByDefault('Cancel'));
        this.appendAcceptButton(this.getAcceptButtonLabel());
        this.addKeyListener(this.back, browser_1.Key.ENTER, () => {
            this.addTransformEffectToIcon(this.back);
            this.model.navigateBackward();
        }, 'click');
        this.addKeyListener(this.forward, browser_1.Key.ENTER, () => {
            this.addTransformEffectToIcon(this.forward);
            this.model.navigateForward();
        }, 'click');
        this.addKeyListener(this.home, browser_1.Key.ENTER, () => {
            this.addTransformEffectToIcon(this.home);
            if (this.model.initialLocation) {
                this.model.location = this.model.initialLocation;
            }
        }, 'click');
        this.addKeyListener(this.up, browser_1.Key.ENTER, () => {
            this.addTransformEffectToIcon(this.up);
            if (this.model.location) {
                this.model.location = this.model.location.parent;
            }
        }, 'click');
        super.onAfterAttach(msg);
    }
    addTransformEffectToIcon(element) {
        const icon = element.getElementsByTagName('i')[0];
        icon.classList.add('active');
        setTimeout(() => icon.classList.remove('active'), exports.TOOLBAR_ITEM_TRANSFORM_TIMEOUT);
    }
    onActivateRequest(msg) {
        this.widget.activate();
    }
};
__decorate([
    (0, inversify_1.inject)(file_dialog_widget_1.FileDialogWidget),
    __metadata("design:type", file_dialog_widget_1.FileDialogWidget)
], FileDialog.prototype, "widget", void 0);
__decorate([
    (0, inversify_1.inject)(location_1.LocationListRendererFactory),
    __metadata("design:type", Function)
], FileDialog.prototype, "locationListFactory", void 0);
__decorate([
    (0, inversify_1.inject)(file_dialog_tree_filters_renderer_1.FileDialogTreeFiltersRendererFactory),
    __metadata("design:type", Function)
], FileDialog.prototype, "treeFiltersFactory", void 0);
__decorate([
    (0, inversify_1.inject)(file_dialog_hidden_files_renderer_1.HiddenFilesToggleRendererFactory),
    __metadata("design:type", Function)
], FileDialog.prototype, "hiddenFilesToggleFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileDialog.prototype, "init", null);
FileDialog = __decorate([
    __param(0, (0, inversify_1.inject)(FileDialogProps)),
    __metadata("design:paramtypes", [FileDialogProps])
], FileDialog);
exports.FileDialog = FileDialog;
let OpenFileDialog = class OpenFileDialog extends FileDialog {
    constructor(props) {
        super(props);
        this.props = props;
    }
    init() {
        super.init();
        const { props } = this;
        if (props.canSelectFiles !== undefined) {
            this.widget.disableFileSelection = !props.canSelectFiles;
        }
    }
    getAcceptButtonLabel() {
        return this.props.openLabel ? this.props.openLabel : common_1.nls.localizeByDefault('Open');
    }
    isValid(value) {
        if (value && !this.props.canSelectMany && value instanceof Array) {
            return common_1.nls.localize('theia/filesystem/dialog/multipleItemMessage', 'You can select only one item');
        }
        return '';
    }
    get value() {
        if (this.widget.model.selectedFileStatNodes.length === 1) {
            return this.widget.model.selectedFileStatNodes[0];
        }
        else {
            return this.widget.model.selectedFileStatNodes;
        }
    }
    async accept() {
        const selection = this.value;
        if (!this.props.canSelectFolders
            && !Array.isArray(selection)
            && selection.fileStat.isDirectory) {
            this.widget.model.openNode(selection);
            return;
        }
        super.accept();
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OpenFileDialog.prototype, "init", null);
OpenFileDialog = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(OpenFileDialogProps)),
    __metadata("design:paramtypes", [OpenFileDialogProps])
], OpenFileDialog);
exports.OpenFileDialog = OpenFileDialog;
let SaveFileDialog = class SaveFileDialog extends FileDialog {
    constructor(props) {
        super(props);
        this.props = props;
    }
    init() {
        super.init();
        const { widget } = this;
        widget.addClass(exports.SAVE_DIALOG_CLASS);
    }
    getAcceptButtonLabel() {
        return this.props.saveLabel ? this.props.saveLabel : common_1.nls.localizeByDefault('Save');
    }
    onUpdateRequest(msg) {
        // Update file name field when changing a selection
        if (this.fileNameField) {
            if (this.widget.model.selectedFileStatNodes.length === 1) {
                const node = this.widget.model.selectedFileStatNodes[0];
                if (!node.fileStat.isDirectory) {
                    this.fileNameField.value = this.labelProvider.getName(node);
                }
            }
            else {
                this.fileNameField.value = '';
            }
        }
        // Continue updating the dialog
        super.onUpdateRequest(msg);
    }
    isValid(value) {
        if (this.fileNameField && this.fileNameField.value) {
            return '';
        }
        return false;
    }
    get value() {
        if (this.fileNameField && this.widget.model.selectedFileStatNodes.length === 1) {
            const node = this.widget.model.selectedFileStatNodes[0];
            if (node.fileStat.isDirectory) {
                return node.uri.resolve(this.fileNameField.value);
            }
            return node.uri.parent.resolve(this.fileNameField.value);
        }
        return undefined;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        const fileNamePanel = document.createElement('div');
        fileNamePanel.classList.add(exports.FILENAME_PANEL_CLASS);
        this.contentNode.appendChild(fileNamePanel);
        const titlePanel = document.createElement('div');
        titlePanel.innerHTML = DOMPurify.sanitize(common_1.nls.localize('theia/filesystem/dialog/name', 'Name:'));
        titlePanel.classList.add(exports.FILENAME_LABEL_CLASS);
        fileNamePanel.appendChild(titlePanel);
        this.fileNameField = document.createElement('input');
        this.fileNameField.type = 'text';
        this.fileNameField.spellcheck = false;
        this.fileNameField.classList.add('theia-input', exports.FILENAME_TEXTFIELD_CLASS);
        this.fileNameField.value = this.props.inputValue || '';
        fileNamePanel.appendChild(this.fileNameField);
        this.fileNameField.onkeyup = () => this.validate();
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], SaveFileDialog.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SaveFileDialog.prototype, "init", null);
SaveFileDialog = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(SaveFileDialogProps)),
    __metadata("design:paramtypes", [SaveFileDialogProps])
], SaveFileDialog);
exports.SaveFileDialog = SaveFileDialog;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-dialog/file-dialog'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-tree/file-tree-container.js":
/*!******************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-tree/file-tree-container.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createFileTreeContainer = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_tree_1 = __webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/file-tree.js");
const file_tree_model_1 = __webpack_require__(/*! ./file-tree-model */ "../../packages/filesystem/lib/browser/file-tree/file-tree-model.js");
const file_tree_widget_1 = __webpack_require__(/*! ./file-tree-widget */ "../../packages/filesystem/lib/browser/file-tree/file-tree-widget.js");
const fileTreeDefaults = {
    tree: file_tree_1.FileTree,
    model: file_tree_model_1.FileTreeModel,
    widget: file_tree_widget_1.FileTreeWidget,
    expansionService: browser_1.CompressedExpansionService,
};
function createFileTreeContainer(parent, overrides) {
    const child = (0, browser_1.createTreeContainer)(parent, { ...fileTreeDefaults, ...overrides });
    child.bind(browser_1.CompressionToggle).toConstantValue({ compress: false });
    child.bind(browser_1.TreeCompressionService).toSelf().inSingletonScope();
    return child;
}
exports.createFileTreeContainer = createFileTreeContainer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-tree/file-tree-container'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-tree/file-tree-decorator-adapter.js":
/*!**************************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-tree/file-tree-decorator-adapter.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileTreeDecoratorAdapter = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const decorations_service_1 = __webpack_require__(/*! @theia/core/lib/browser/decorations-service */ "../../packages/core/lib/browser/decorations-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const file_tree_1 = __webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/file-tree.js");
let FileTreeDecoratorAdapter = class FileTreeDecoratorAdapter {
    constructor() {
        this.id = 'decorations-service-tree-decorator-adapter';
        this.bubbleTooltip = common_1.nls.localizeByDefault('Contains emphasized items');
        this.onDidChangeDecorationsEmitter = new common_1.Emitter();
        this.decorationsByUri = new Map();
        this.parentDecorations = new Map();
    }
    get onDidChangeDecorations() {
        return this.onDidChangeDecorationsEmitter.event;
    }
    init() {
        this.decorationsService.onDidChangeDecorations(newDecorations => {
            this.updateDecorations(this.decorationsByUri.keys(), newDecorations.keys());
            this.fireDidChangeDecorations();
        });
    }
    decorations(tree) {
        return this.collectDecorations(tree);
    }
    collectDecorations(tree) {
        const decorations = new Map();
        if (tree.root) {
            for (const node of new browser_1.TopDownTreeIterator(tree.root)) {
                const uri = this.getUriForNode(node);
                if (uri) {
                    const stringified = uri.toString();
                    const ownDecoration = this.decorationsByUri.get(stringified);
                    const bubbledDecoration = this.parentDecorations.get(stringified);
                    const combined = this.mergeDecorations(ownDecoration, bubbledDecoration);
                    if (combined) {
                        decorations.set(node.id, combined);
                    }
                }
            }
        }
        return decorations;
    }
    mergeDecorations(ownDecoration, bubbledDecoration) {
        var _a, _b;
        if (!ownDecoration) {
            return bubbledDecoration;
        }
        else if (!bubbledDecoration) {
            return ownDecoration;
        }
        else {
            const tailDecorations = ((_a = bubbledDecoration.tailDecorations) !== null && _a !== void 0 ? _a : []).concat((_b = ownDecoration.tailDecorations) !== null && _b !== void 0 ? _b : []);
            return {
                ...bubbledDecoration,
                tailDecorations
            };
        }
    }
    updateDecorations(oldKeys, newKeys) {
        this.parentDecorations.clear();
        const newDecorations = new Map();
        const handleUri = (rawUri) => {
            if (!newDecorations.has(rawUri)) {
                const uri = new uri_1.default(rawUri);
                const decorations = this.decorationsService.getDecoration(uri, false);
                if (decorations.length) {
                    newDecorations.set(rawUri, this.toTheiaDecoration(decorations, false));
                    this.propagateDecorationsByUri(uri, decorations);
                }
            }
        };
        for (const rawUri of oldKeys) {
            handleUri(rawUri);
        }
        for (const rawUri of newKeys) {
            handleUri(rawUri);
        }
        this.decorationsByUri = newDecorations;
    }
    toTheiaDecoration(decorations, bubble) {
        const color = decorations[0].colorId ? `var(${this.colorRegistry.toCssVariableName(decorations[0].colorId)})` : undefined;
        const fontData = color ? { color } : undefined;
        return {
            priority: decorations[0].weight,
            fontData,
            tailDecorations: decorations.map(decoration => this.toTailDecoration(decoration, fontData, bubble))
        };
    }
    toTailDecoration(decoration, fontData, bubble) {
        var _a;
        if (bubble) {
            return { icon: 'circle', fontData, tooltip: this.bubbleTooltip };
        }
        return { data: (_a = decoration.letter) !== null && _a !== void 0 ? _a : '', fontData, tooltip: decoration.tooltip };
    }
    propagateDecorationsByUri(child, decorations) {
        const highestPriorityBubblingDecoration = decorations.find(decoration => decoration.bubble);
        if (highestPriorityBubblingDecoration) {
            const bubbleDecoration = this.toTheiaDecoration([highestPriorityBubblingDecoration], true);
            let parent = child.parent;
            let handledRoot = false;
            while (!handledRoot) {
                handledRoot = parent.path.isRoot;
                const parentString = parent.toString();
                const existingDecoration = this.parentDecorations.get(parentString);
                if (!existingDecoration || this.compareWeight(bubbleDecoration, existingDecoration) < 0) {
                    this.parentDecorations.set(parentString, bubbleDecoration);
                }
                else {
                    break;
                }
                parent = parent.parent;
            }
        }
    }
    /**
     *  Sort higher priorities earlier. I.e. positive number means right higher than left.
     */
    compareWeight(left, right) {
        var _a, _b;
        return ((_a = right.weight) !== null && _a !== void 0 ? _a : 0) - ((_b = left.weight) !== null && _b !== void 0 ? _b : 0);
    }
    getUriForNode(node) {
        return file_tree_1.FileStatNode.getUri(node);
    }
    fireDidChangeDecorations() {
        this.onDidChangeDecorationsEmitter.fire(tree => this.collectDecorations(tree));
    }
};
__decorate([
    (0, inversify_1.inject)(decorations_service_1.DecorationsService),
    __metadata("design:type", Object)
], FileTreeDecoratorAdapter.prototype, "decorationsService", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], FileTreeDecoratorAdapter.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileTreeDecoratorAdapter.prototype, "init", null);
FileTreeDecoratorAdapter = __decorate([
    (0, inversify_1.injectable)()
], FileTreeDecoratorAdapter);
exports.FileTreeDecoratorAdapter = FileTreeDecoratorAdapter;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-tree/file-tree-decorator-adapter'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-tree/file-tree-label-provider.js":
/*!***********************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-tree/file-tree-label-provider.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileTreeLabelProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const file_tree_1 = __webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/file-tree.js");
const tree_label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-label-provider */ "../../packages/core/lib/browser/tree/tree-label-provider.js");
let FileTreeLabelProvider = class FileTreeLabelProvider {
    canHandle(element) {
        return file_tree_1.FileStatNode.is(element) ?
            this.treeLabelProvider.canHandle(element) + 1 :
            0;
    }
    getIcon(node) {
        return this.labelProvider.getIcon(node.fileStat);
    }
    getName(node) {
        return this.labelProvider.getName(node.fileStat);
    }
    getDescription(node) {
        return this.labelProvider.getLongName(node.fileStat);
    }
    affects(node, event) {
        return event.affects(node.fileStat);
    }
};
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], FileTreeLabelProvider.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(tree_label_provider_1.TreeLabelProvider),
    __metadata("design:type", tree_label_provider_1.TreeLabelProvider)
], FileTreeLabelProvider.prototype, "treeLabelProvider", void 0);
FileTreeLabelProvider = __decorate([
    (0, inversify_1.injectable)()
], FileTreeLabelProvider);
exports.FileTreeLabelProvider = FileTreeLabelProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-tree/file-tree-label-provider'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-tree/file-tree-model.js":
/*!**************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-tree/file-tree-model.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileTreeModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_tree_1 = __webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/file-tree.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const file_service_1 = __webpack_require__(/*! ../file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const files_1 = __webpack_require__(/*! ../../common/files */ "../../packages/filesystem/lib/common/files.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/filesystem/lib/common/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let FileTreeModel = class FileTreeModel extends browser_1.CompressedTreeModel {
    init() {
        super.init();
        this.toDispose.push(this.fileService.onDidFilesChange(changes => this.onFilesChanged(changes)));
        this.toDispose.push(this.fileService.onDidRunOperation(event => this.onDidMove(event)));
    }
    get location() {
        const root = this.root;
        if (file_tree_1.FileStatNode.is(root)) {
            return root.uri;
        }
        return undefined;
    }
    set location(uri) {
        if (uri) {
            this.fileService.resolve(uri).then(fileStat => {
                if (fileStat) {
                    const node = file_tree_1.DirNode.createRoot(fileStat);
                    this.navigateTo(node);
                }
            }).catch(() => {
                // no-op, allow failures for file dialog text input
            });
        }
        else {
            this.navigateTo(undefined);
        }
    }
    async drives() {
        try {
            const drives = await this.environments.getDrives();
            return drives.map(uri => new uri_1.default(uri));
        }
        catch (e) {
            this.logger.error('Error when loading drives.', e);
            return [];
        }
    }
    get selectedFileStatNodes() {
        return this.selectedNodes.filter(file_tree_1.FileStatNode.is);
    }
    *getNodesByUri(uri) {
        const node = this.getNode(uri.toString());
        if (node) {
            yield node;
        }
    }
    /**
     * to workaround https://github.com/Axosoft/nsfw/issues/42
     */
    onDidMove(event) {
        if (!event.isOperation(2 /* MOVE */)) {
            return;
        }
        if (event.resource.parent.toString() === event.target.resource.parent.toString()) {
            // file rename
            return;
        }
        this.refreshAffectedNodes([
            event.resource,
            event.target.resource
        ]);
    }
    onFilesChanged(changes) {
        if (!this.refreshAffectedNodes(this.getAffectedUris(changes)) && this.isRootAffected(changes)) {
            this.refresh();
        }
    }
    isRootAffected(changes) {
        const root = this.root;
        if (file_tree_1.FileStatNode.is(root)) {
            return changes.contains(root.uri, 1 /* ADDED */) || changes.contains(root.uri, 0 /* UPDATED */);
        }
        return false;
    }
    getAffectedUris(changes) {
        return changes.changes.filter(change => !this.isFileContentChanged(change)).map(change => change.resource);
    }
    isFileContentChanged(change) {
        return change.type === 0 /* UPDATED */ && file_tree_1.FileNode.is(this.getNodesByUri(change.resource).next().value);
    }
    refreshAffectedNodes(uris) {
        const nodes = this.getAffectedNodes(uris);
        for (const node of nodes.values()) {
            this.refresh(node);
        }
        return nodes.size !== 0;
    }
    getAffectedNodes(uris) {
        const nodes = new Map();
        for (const uri of uris) {
            for (const node of this.getNodesByUri(uri.parent)) {
                if (file_tree_1.DirNode.is(node) && (node.expanded || (this.compressionToggle.compress && this.compressionService.isCompressionParticipant(node)))) {
                    nodes.set(node.id, node);
                }
            }
        }
        return nodes;
    }
    async copy(source, target) {
        /** If the target is a file or if the target is a directory, but is the same as the source, use the parent of the target as a destination. */
        const parentNode = (target.fileStat.isFile || target.uri.isEqual(source)) ? target.parent : target;
        if (!file_tree_1.FileStatNode.is(parentNode)) {
            throw new Error('Parent of file has to be a FileStatNode');
        }
        let targetUri = parentNode.uri.resolve(source.path.base);
        try {
            const parent = await this.fileService.resolve(parentNode.uri);
            const sourceFileStat = await this.fileService.resolve(source);
            targetUri = common_1.FileSystemUtils.generateUniqueResourceURI(parent, targetUri, sourceFileStat.isDirectory, 'copy');
            await this.fileService.copy(source, targetUri);
        }
        catch (e) {
            this.messageService.error(e.message);
        }
        return targetUri;
    }
    /**
     * Move the given source file or directory to the given target directory.
     */
    async move(source, target) {
        if (file_tree_1.DirNode.is(target) && file_tree_1.FileStatNode.is(source)) {
            const name = source.fileStat.name;
            const targetUri = target.uri.resolve(name);
            if (source.uri.isEqual(targetUri)) {
                return;
            }
            try {
                await this.fileService.move(source.uri, targetUri);
                return targetUri;
            }
            catch (e) {
                if (e instanceof files_1.FileOperationError && e.fileOperationResult === 4 /* FILE_MOVE_CONFLICT */) {
                    const fileName = this.labelProvider.getName(source);
                    if (await this.shouldReplace(fileName)) {
                        try {
                            await this.fileService.move(source.uri, targetUri, { overwrite: true });
                            return targetUri;
                        }
                        catch (e2) {
                            this.messageService.error(e2.message);
                        }
                    }
                }
                else {
                    this.messageService.error(e.message);
                }
            }
        }
        return undefined;
    }
    async shouldReplace(fileName) {
        const dialog = new browser_1.ConfirmDialog({
            title: core_1.nls.localize('theia/filesystem/replaceTitle', 'Replace File'),
            msg: core_1.nls.localizeByDefault('{0} already exists. Are you sure you want to overwrite it?', fileName),
            ok: browser_1.Dialog.YES,
            cancel: browser_1.Dialog.NO
        });
        return !!await dialog.open();
    }
};
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], FileTreeModel.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FileTreeModel.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], FileTreeModel.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], FileTreeModel.prototype, "environments", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileTreeModel.prototype, "init", null);
FileTreeModel = __decorate([
    (0, inversify_1.injectable)()
], FileTreeModel);
exports.FileTreeModel = FileTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-tree/file-tree-model'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-tree/file-tree-widget.js":
/*!***************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-tree/file-tree-widget.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileTreeWidget = exports.FILE_STAT_ICON_CLASS = exports.DIR_NODE_CLASS = exports.FILE_STAT_NODE_CLASS = exports.FILE_TREE_CLASS = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const selection_1 = __webpack_require__(/*! @theia/core/lib/common/selection */ "../../packages/core/lib/common/selection.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_upload_service_1 = __webpack_require__(/*! ../file-upload-service */ "../../packages/filesystem/lib/browser/file-upload-service.js");
const file_tree_1 = __webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/file-tree.js");
const file_tree_model_1 = __webpack_require__(/*! ./file-tree-model */ "../../packages/filesystem/lib/browser/file-tree/file-tree-model.js");
const icon_theme_service_1 = __webpack_require__(/*! @theia/core/lib/browser/icon-theme-service */ "../../packages/core/lib/browser/icon-theme-service.js");
const shell_1 = __webpack_require__(/*! @theia/core/lib/browser/shell */ "../../packages/core/lib/browser/shell/index.js");
const files_1 = __webpack_require__(/*! ../../common/files */ "../../packages/filesystem/lib/common/files.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
exports.FILE_TREE_CLASS = 'theia-FileTree';
exports.FILE_STAT_NODE_CLASS = 'theia-FileStatNode';
exports.DIR_NODE_CLASS = 'theia-DirNode';
exports.FILE_STAT_ICON_CLASS = 'theia-FileStatIcon';
let FileTreeWidget = class FileTreeWidget extends browser_1.CompressedTreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        this.toCancelNodeExpansion = new disposable_1.DisposableCollection();
        this.addClass(exports.FILE_TREE_CLASS);
        this.toDispose.push(this.toCancelNodeExpansion);
    }
    createNodeClassNames(node, props) {
        const classNames = super.createNodeClassNames(node, props);
        if (file_tree_1.FileStatNode.is(node)) {
            classNames.push(exports.FILE_STAT_NODE_CLASS);
        }
        if (file_tree_1.DirNode.is(node)) {
            classNames.push(exports.DIR_NODE_CLASS);
        }
        return classNames;
    }
    renderIcon(node, props) {
        const icon = this.toNodeIcon(node);
        if (icon) {
            return React.createElement("div", { className: icon + ' file-icon' });
        }
        // eslint-disable-next-line no-null/no-null
        return null;
    }
    createContainerAttributes() {
        const attrs = super.createContainerAttributes();
        return {
            ...attrs,
            onDragEnter: event => this.handleDragEnterEvent(this.model.root, event),
            onDragOver: event => this.handleDragOverEvent(this.model.root, event),
            onDragLeave: event => this.handleDragLeaveEvent(this.model.root, event),
            onDrop: event => this.handleDropEvent(this.model.root, event)
        };
    }
    createNodeAttributes(node, props) {
        return {
            ...super.createNodeAttributes(node, props),
            ...this.getNodeDragHandlers(node, props),
            title: this.getNodeTooltip(node)
        };
    }
    getNodeTooltip(node) {
        var _a, _b;
        const operativeNode = (_b = (_a = this.compressionService.getCompressionChain(node)) === null || _a === void 0 ? void 0 : _a.tail()) !== null && _b !== void 0 ? _b : node;
        const uri = selection_1.UriSelection.getUri(operativeNode);
        return uri ? uri.path.fsPath() : undefined;
    }
    getCaptionChildEventHandlers(node, props) {
        return {
            ...super.getCaptionChildEventHandlers(node, props),
            ...this.getNodeDragHandlers(node, props),
        };
    }
    getNodeDragHandlers(node, props) {
        return {
            onDragStart: event => this.handleDragStartEvent(node, event),
            onDragEnter: event => this.handleDragEnterEvent(node, event),
            onDragOver: event => this.handleDragOverEvent(node, event),
            onDragLeave: event => this.handleDragLeaveEvent(node, event),
            onDrop: event => this.handleDropEvent(node, event),
            draggable: file_tree_1.FileStatNode.is(node),
        };
    }
    handleDragStartEvent(node, event) {
        event.stopPropagation();
        if (event.dataTransfer) {
            let selectedNodes;
            if (this.model.selectedNodes.find(selected => browser_1.TreeNode.equals(selected, node))) {
                selectedNodes = [...this.model.selectedNodes];
            }
            else {
                selectedNodes = [node];
            }
            this.setSelectedTreeNodesAsData(event.dataTransfer, node, selectedNodes);
            const uris = selectedNodes.filter(file_tree_1.FileStatNode.is).map(n => n.fileStat.resource);
            if (uris.length > 0) {
                shell_1.ApplicationShell.setDraggedEditorUris(event.dataTransfer, uris);
            }
            let label;
            if (selectedNodes.length === 1) {
                label = this.toNodeName(node);
            }
            else {
                label = String(selectedNodes.length);
            }
            const dragImage = document.createElement('div');
            dragImage.className = 'theia-file-tree-drag-image';
            dragImage.textContent = label;
            document.body.appendChild(dragImage);
            event.dataTransfer.setDragImage(dragImage, -10, -10);
            setTimeout(() => document.body.removeChild(dragImage), 0);
        }
    }
    handleDragEnterEvent(node, event) {
        event.preventDefault();
        event.stopPropagation();
        this.toCancelNodeExpansion.dispose();
        const containing = file_tree_1.DirNode.getContainingDir(node);
        if (!!containing && !containing.selected) {
            this.model.selectNode(containing);
        }
    }
    handleDragOverEvent(node, event) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = this.getDropEffect(event);
        if (!this.toCancelNodeExpansion.disposed) {
            return;
        }
        const timer = setTimeout(() => {
            const containing = file_tree_1.DirNode.getContainingDir(node);
            if (!!containing && !containing.expanded) {
                this.model.expandNode(containing);
            }
        }, 500);
        this.toCancelNodeExpansion.push(disposable_1.Disposable.create(() => clearTimeout(timer)));
    }
    handleDragLeaveEvent(node, event) {
        event.preventDefault();
        event.stopPropagation();
        this.toCancelNodeExpansion.dispose();
    }
    async handleDropEvent(node, event) {
        try {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = this.getDropEffect(event);
            const containing = this.getDropTargetDirNode(node);
            if (containing) {
                const resources = this.getSelectedTreeNodesFromData(event.dataTransfer);
                if (resources.length > 0) {
                    for (const treeNode of resources) {
                        if (event.dataTransfer.dropEffect === 'copy' && file_tree_1.FileStatNode.is(treeNode)) {
                            await this.model.copy(treeNode.uri, containing);
                        }
                        else {
                            await this.model.move(treeNode, containing);
                        }
                    }
                }
                else {
                    await this.uploadService.upload(containing.uri, { source: event.dataTransfer });
                }
            }
        }
        catch (e) {
            if (!(0, cancellation_1.isCancelled)(e)) {
                console.error(e);
            }
        }
    }
    getDropTargetDirNode(node) {
        if (browser_1.CompositeTreeNode.is(node) && node.id === 'WorkspaceNodeId') {
            if (node.children.length === 1) {
                return file_tree_1.DirNode.getContainingDir(node.children[0]);
            }
            else if (node.children.length > 1) {
                // move file to the last root folder in multi-root scenario
                return file_tree_1.DirNode.getContainingDir(node.children[node.children.length - 1]);
            }
        }
        return file_tree_1.DirNode.getContainingDir(node);
    }
    getDropEffect(event) {
        const isCopy = core_1.isOSX ? event.altKey : event.ctrlKey;
        return isCopy ? 'copy' : 'move';
    }
    setTreeNodeAsData(data, node) {
        data.setData('tree-node', node.id);
    }
    setSelectedTreeNodesAsData(data, sourceNode, relatedNodes) {
        this.setTreeNodeAsData(data, sourceNode);
        data.setData('selected-tree-nodes', JSON.stringify(relatedNodes.map(node => node.id)));
    }
    getTreeNodeFromData(data) {
        const id = data.getData('tree-node');
        return this.model.getNode(id);
    }
    getSelectedTreeNodesFromData(data) {
        const resources = data.getData('selected-tree-nodes');
        if (!resources) {
            return [];
        }
        const ids = JSON.parse(resources);
        return ids.map(id => this.model.getNode(id)).filter(node => node !== undefined);
    }
    get hidesExplorerArrows() {
        const theme = this.iconThemeService.getDefinition(this.iconThemeService.current);
        return !!theme && !!theme.hidesExplorerArrows;
    }
    renderExpansionToggle(node, props) {
        if (this.hidesExplorerArrows) {
            // eslint-disable-next-line no-null/no-null
            return null;
        }
        return super.renderExpansionToggle(node, props);
    }
    getPaddingLeft(node, props) {
        if (this.hidesExplorerArrows) {
            // additional left padding instead of top-level expansion toggle
            return super.getPaddingLeft(node, props) + this.props.leftPadding;
        }
        return super.getPaddingLeft(node, props);
    }
    needsExpansionTogglePadding(node) {
        const theme = this.iconThemeService.getDefinition(this.iconThemeService.current);
        if (theme && (theme.hidesExplorerArrows || (theme.hasFileIcons && !theme.hasFolderIcons))) {
            return false;
        }
        return super.needsExpansionTogglePadding(node);
    }
    deflateForStorage(node) {
        const deflated = super.deflateForStorage(node);
        if (file_tree_1.FileStatNode.is(node) && file_tree_1.FileStatNodeData.is(deflated)) {
            deflated.uri = node.uri.toString();
            delete deflated['fileStat'];
            deflated.stat = files_1.FileStat.toStat(node.fileStat);
        }
        return deflated;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inflateFromStorage(node, parent) {
        if (file_tree_1.FileStatNodeData.is(node)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileStatNode = node;
            const resource = new uri_1.default(node.uri);
            fileStatNode.uri = resource;
            let stat;
            // in order to support deprecated FileStat
            if (node.fileStat) {
                stat = {
                    type: node.fileStat.isDirectory ? files_1.FileType.Directory : files_1.FileType.File,
                    mtime: node.fileStat.mtime,
                    size: node.fileStat.size
                };
                delete node['fileStat'];
            }
            else if (node.stat) {
                stat = node.stat;
                delete node['stat'];
            }
            if (stat) {
                fileStatNode.fileStat = files_1.FileStat.fromStat(resource, stat);
            }
        }
        const inflated = super.inflateFromStorage(node, parent);
        if (file_tree_1.DirNode.is(inflated)) {
            inflated.fileStat.children = [];
            for (const child of inflated.children) {
                if (file_tree_1.FileStatNode.is(child)) {
                    inflated.fileStat.children.push(child.fileStat);
                }
            }
        }
        return inflated;
    }
    getDepthPadding(depth) {
        // add additional depth so file nodes are rendered with padding in relation to the top level root node.
        return super.getDepthPadding(depth + 1);
    }
};
__decorate([
    (0, inversify_1.inject)(file_upload_service_1.FileUploadService),
    __metadata("design:type", file_upload_service_1.FileUploadService)
], FileTreeWidget.prototype, "uploadService", void 0);
__decorate([
    (0, inversify_1.inject)(icon_theme_service_1.IconThemeService),
    __metadata("design:type", icon_theme_service_1.IconThemeService)
], FileTreeWidget.prototype, "iconThemeService", void 0);
FileTreeWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(file_tree_model_1.FileTreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, file_tree_model_1.FileTreeModel,
        browser_1.ContextMenuRenderer])
], FileTreeWidget);
exports.FileTreeWidget = FileTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-tree/file-tree-widget'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-tree/file-tree.js":
/*!********************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-tree/file-tree.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DirNode = exports.FileNode = exports.FileStatNodeData = exports.FileStatNode = exports.FileTree = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const files_1 = __webpack_require__(/*! ../../common/files */ "../../packages/filesystem/lib/common/files.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const file_service_1 = __webpack_require__(/*! ../file-service */ "../../packages/filesystem/lib/browser/file-service.js");
let FileTree = class FileTree extends browser_1.TreeImpl {
    async resolveChildren(parent) {
        if (FileStatNode.is(parent)) {
            const fileStat = await this.resolveFileStat(parent);
            if (fileStat) {
                return this.toNodes(fileStat, parent);
            }
            return [];
        }
        return super.resolveChildren(parent);
    }
    async resolveFileStat(node) {
        try {
            const fileStat = await this.fileService.resolve(node.uri);
            node.fileStat = fileStat;
            return fileStat;
        }
        catch (e) {
            if (!(e instanceof files_1.FileOperationError && e.fileOperationResult === 1 /* FILE_NOT_FOUND */)) {
                this.messagingService.error(e.message);
            }
            return undefined;
        }
    }
    async toNodes(fileStat, parent) {
        if (!fileStat.children) {
            return [];
        }
        const result = await Promise.all(fileStat.children.map(async (child) => this.toNode(child, parent)));
        return result.sort(DirNode.compare);
    }
    toNode(fileStat, parent) {
        const uri = fileStat.resource;
        const id = this.toNodeId(uri, parent);
        const node = this.getNode(id);
        if (fileStat.isDirectory) {
            if (DirNode.is(node)) {
                node.fileStat = fileStat;
                return node;
            }
            return {
                id, uri, fileStat, parent,
                expanded: false,
                selected: false,
                children: []
            };
        }
        if (FileNode.is(node)) {
            node.fileStat = fileStat;
            return node;
        }
        return {
            id, uri, fileStat, parent,
            selected: false
        };
    }
    toNodeId(uri, parent) {
        return uri.path.toString();
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FileTree.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], FileTree.prototype, "messagingService", void 0);
FileTree = __decorate([
    (0, inversify_1.injectable)()
], FileTree);
exports.FileTree = FileTree;
var FileStatNode;
(function (FileStatNode) {
    function is(node) {
        return (0, common_1.isObject)(node) && 'fileStat' in node;
    }
    FileStatNode.is = is;
    function getUri(node) {
        if (is(node)) {
            return node.fileStat.resource.toString();
        }
        return undefined;
    }
    FileStatNode.getUri = getUri;
})(FileStatNode = exports.FileStatNode || (exports.FileStatNode = {}));
var FileStatNodeData;
(function (FileStatNodeData) {
    function is(node) {
        return (0, common_1.isObject)(node) && 'uri' in node && ('fileStat' in node || 'stat' in node);
    }
    FileStatNodeData.is = is;
})(FileStatNodeData = exports.FileStatNodeData || (exports.FileStatNodeData = {}));
var FileNode;
(function (FileNode) {
    function is(node) {
        return FileStatNode.is(node) && !node.fileStat.isDirectory;
    }
    FileNode.is = is;
})(FileNode = exports.FileNode || (exports.FileNode = {}));
var DirNode;
(function (DirNode) {
    function is(node) {
        return FileStatNode.is(node) && node.fileStat.isDirectory;
    }
    DirNode.is = is;
    function compare(node, node2) {
        return DirNode.dirCompare(node, node2) || uriCompare(node, node2);
    }
    DirNode.compare = compare;
    function uriCompare(node, node2) {
        if (FileStatNode.is(node)) {
            if (FileStatNode.is(node2)) {
                return node.uri.displayName.localeCompare(node2.uri.displayName);
            }
            return 1;
        }
        if (FileStatNode.is(node2)) {
            return -1;
        }
        return 0;
    }
    DirNode.uriCompare = uriCompare;
    function dirCompare(node, node2) {
        const a = DirNode.is(node) ? 1 : 0;
        const b = DirNode.is(node2) ? 1 : 0;
        return b - a;
    }
    DirNode.dirCompare = dirCompare;
    function createRoot(fileStat) {
        const uri = fileStat.resource;
        const id = uri.toString();
        return {
            id, uri, fileStat,
            visible: true,
            parent: undefined,
            children: [],
            expanded: true,
            selected: false
        };
    }
    DirNode.createRoot = createRoot;
    function getContainingDir(node) {
        let containing = node;
        while (!!containing && !is(containing)) {
            containing = containing.parent;
        }
        return containing;
    }
    DirNode.getContainingDir = getContainingDir;
})(DirNode = exports.DirNode || (exports.DirNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-tree/file-tree'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-tree/index.js":
/*!****************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-tree/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/file-tree.js"), exports);
__exportStar(__webpack_require__(/*! ./file-tree-model */ "../../packages/filesystem/lib/browser/file-tree/file-tree-model.js"), exports);
__exportStar(__webpack_require__(/*! ./file-tree-widget */ "../../packages/filesystem/lib/browser/file-tree/file-tree-widget.js"), exports);
__exportStar(__webpack_require__(/*! ./file-tree-container */ "../../packages/filesystem/lib/browser/file-tree/file-tree-container.js"), exports);
__exportStar(__webpack_require__(/*! ./file-tree-decorator-adapter */ "../../packages/filesystem/lib/browser/file-tree/file-tree-decorator-adapter.js"), exports);
__exportStar(__webpack_require__(/*! ./file-tree-label-provider */ "../../packages/filesystem/lib/browser/file-tree/file-tree-label-provider.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-tree'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/location/index.js":
/*!***************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/location/index.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./location-service */ "../../packages/filesystem/lib/browser/location/location-service.js"), exports);
__exportStar(__webpack_require__(/*! ./location-renderer */ "../../packages/filesystem/lib/browser/location/location-renderer.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/location'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/location/location-renderer.js":
/*!***************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/location/location-renderer.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var LocationListRenderer_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocationListRenderer = exports.LocationListRendererOptions = exports.LocationListRendererFactory = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const file_service_1 = __webpack_require__(/*! ../file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const react_renderer_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/react-renderer */ "../../packages/core/lib/browser/widgets/react-renderer.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
class ResolvedDirectoryCache {
    constructor(fileService) {
        this.fileService = fileService;
        this.pendingResolvedDirectories = new Map();
        this.cachedDirectories = new Map();
        this.directoryResolvedEmitter = new common_1.Emitter();
        this.onDirectoryDidResolve = this.directoryResolvedEmitter.event;
    }
    tryResolveChildDirectories(inputAsURI) {
        const parentDirectory = inputAsURI.path.dir.toString();
        const cachedDirectories = this.cachedDirectories.get(parentDirectory);
        const pendingDirectories = this.pendingResolvedDirectories.get(parentDirectory);
        if (cachedDirectories) {
            return cachedDirectories;
        }
        else if (!pendingDirectories) {
            this.pendingResolvedDirectories.set(parentDirectory, this.createResolutionPromise(parentDirectory));
        }
        return undefined;
    }
    async createResolutionPromise(directoryToResolve) {
        return this.fileService.resolve(new uri_1.default(directoryToResolve)).then(({ children }) => {
            if (children) {
                const childDirectories = children.filter(child => child.isDirectory)
                    .map(directory => `${directory.resource.path}/`);
                this.cachedDirectories.set(directoryToResolve, childDirectories);
                this.directoryResolvedEmitter.fire({ parent: directoryToResolve, children: childDirectories });
            }
        }).catch(e => {
            // no-op
        });
    }
}
exports.LocationListRendererFactory = Symbol('LocationListRendererFactory');
exports.LocationListRendererOptions = Symbol('LocationListRendererOptions');
let LocationListRenderer = LocationListRenderer_1 = class LocationListRenderer extends react_renderer_1.ReactRenderer {
    constructor(options) {
        super(options.host);
        this.options = options;
        this.toDisposeOnNewCache = new common_1.DisposableCollection();
        this._doShowTextInput = false;
        this.doAttemptAutocomplete = true;
        this.doAfterRender = () => {
            const locationList = this.locationList;
            const locationListTextInput = this.locationTextInput;
            if (locationList) {
                const currentLocation = this.service.location;
                locationList.value = currentLocation ? currentLocation.toString() : '';
            }
            else if (locationListTextInput) {
                locationListTextInput.focus();
            }
        };
        this.handleLocationChanged = (e) => this.onLocationChanged(e);
        this.handleTextInputOnChange = (e) => this.trySuggestDirectory(e);
        this.handleTextInputKeyDown = (e) => this.handleControlKeys(e);
        this.handleIconKeyDown = (e) => this.toggleInputOnKeyDown(e);
        this.handleTextInputOnBlur = () => this.toggleToSelectInput();
        this.handleTextInputMouseDown = (e) => this.toggleToTextInputOnMouseDown(e);
        this.service = options.model;
        this.doLoadDrives();
        this.doAfterRender = this.doAfterRender.bind(this);
    }
    get doShowTextInput() {
        return this._doShowTextInput;
    }
    set doShowTextInput(doShow) {
        this._doShowTextInput = doShow;
        if (doShow) {
            this.initResolveDirectoryCache();
        }
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const homeDirWithPrefix = await this.variablesServer.getHomeDirUri();
        this.homeDir = (new uri_1.default(homeDirWithPrefix)).path.toString();
    }
    render() {
        this.hostRoot.render(this.doRender());
    }
    initResolveDirectoryCache() {
        this.toDisposeOnNewCache.dispose();
        this.directoryCache = new ResolvedDirectoryCache(this.fileService);
        this.toDisposeOnNewCache.push(this.directoryCache.onDirectoryDidResolve(({ parent, children }) => {
            if (this.locationTextInput) {
                const expandedPath = common_1.Path.untildify(this.locationTextInput.value, this.homeDir);
                const inputParent = (new uri_1.default(expandedPath)).path.dir.toString();
                if (inputParent === parent) {
                    this.tryRenderFirstMatch(this.locationTextInput, children);
                }
            }
        }));
    }
    doRender() {
        return (React.createElement(React.Fragment, null,
            this.renderInputIcon(),
            this.doShowTextInput
                ? this.renderTextInput()
                : this.renderSelectInput()));
    }
    renderInputIcon() {
        return (React.createElement("span", { 
            // onMouseDown is used since it will fire before 'onBlur'. This prevents
            // a re-render when textinput is in focus and user clicks toggle icon
            onMouseDown: this.handleTextInputMouseDown, onKeyDown: this.handleIconKeyDown, className: LocationListRenderer_1.Styles.LOCATION_INPUT_TOGGLE_CLASS, tabIndex: 0, id: `${this.doShowTextInput ? 'text-input' : 'select-input'}`, title: this.doShowTextInput
                ? LocationListRenderer_1.Tooltips.TOGGLE_SELECT_INPUT
                : LocationListRenderer_1.Tooltips.TOGGLE_TEXT_INPUT, ref: this.doAfterRender },
            React.createElement("i", { className: (0, browser_1.codicon)(this.doShowTextInput ? 'folder-opened' : 'edit') })));
    }
    renderTextInput() {
        var _a;
        return (React.createElement("input", { className: 'theia-select ' + LocationListRenderer_1.Styles.LOCATION_TEXT_INPUT_CLASS, defaultValue: (_a = this.service.location) === null || _a === void 0 ? void 0 : _a.path.fsPath(), onBlur: this.handleTextInputOnBlur, onChange: this.handleTextInputOnChange, onKeyDown: this.handleTextInputKeyDown, spellCheck: false }));
    }
    renderSelectInput() {
        const options = this.collectLocations().map(value => this.renderLocation(value));
        return (React.createElement("select", { className: `theia-select ${LocationListRenderer_1.Styles.LOCATION_LIST_CLASS}`, onChange: this.handleLocationChanged }, ...options));
    }
    toggleInputOnKeyDown(e) {
        if (e.key === 'Enter') {
            this.doShowTextInput = true;
            this.render();
        }
    }
    toggleToTextInputOnMouseDown(e) {
        if (e.currentTarget.id === 'select-input') {
            e.preventDefault();
            this.doShowTextInput = true;
            this.render();
        }
    }
    toggleToSelectInput() {
        if (this.doShowTextInput) {
            this.doShowTextInput = false;
            this.render();
        }
    }
    /**
     * Collects the available locations based on the currently selected, and appends the available drives to it.
     */
    collectLocations() {
        const location = this.service.location;
        const locations = (!!location ? location.allLocations : []).map(uri => ({ uri }));
        if (this._drives) {
            const drives = this._drives.map(uri => ({ uri, isDrive: true }));
            // `URI.allLocations` returns with the URI without the trailing slash unlike `FileUri.create(fsPath)`.
            // to be able to compare file:///path/to/resource with file:///path/to/resource/.
            const toUriString = (uri) => {
                const toString = uri.toString();
                return toString.endsWith('/') ? toString.slice(0, -1) : toString;
            };
            drives.forEach(drive => {
                const index = locations.findIndex(loc => toUriString(loc.uri) === toUriString(drive.uri));
                // Ignore drives which are already discovered as a location based on the current model root URI.
                if (index === -1) {
                    // Make sure, it does not have the trailing slash.
                    locations.push({ uri: new uri_1.default(toUriString(drive.uri)), isDrive: true });
                }
                else {
                    // This is necessary for Windows to be able to show `/e:/` as a drive and `c:` as "non-drive" in the same way.
                    // `URI.path.toString()` Vs. `URI.displayName` behaves a bit differently on Windows.
                    // https://github.com/eclipse-theia/theia/pull/3038#issuecomment-425944189
                    locations[index].isDrive = true;
                }
            });
        }
        this.doLoadDrives();
        return locations;
    }
    /**
     * Asynchronously loads the drives (if not yet available) and triggers a UI update on success with the new values.
     */
    doLoadDrives() {
        if (!this._drives) {
            this.service.drives().then(drives => {
                // If the `drives` are empty, something already went wrong.
                if (drives.length > 0) {
                    this._drives = drives;
                    this.render();
                }
            });
        }
    }
    renderLocation(location) {
        const { uri, isDrive } = location;
        const value = uri.toString();
        return React.createElement("option", { value: value, key: uri.toString() }, isDrive ? uri.path.fsPath() : uri.displayName);
    }
    onLocationChanged(e) {
        const locationList = this.locationList;
        if (locationList) {
            const value = locationList.value;
            const uri = new uri_1.default(value);
            this.trySetNewLocation(uri);
            e.preventDefault();
            e.stopPropagation();
        }
    }
    trySetNewLocation(newLocation) {
        var _a;
        if (this.lastUniqueTextInputLocation === undefined) {
            this.lastUniqueTextInputLocation = this.service.location;
        }
        // prevent consecutive repeated locations from being added to location history
        if (((_a = this.lastUniqueTextInputLocation) === null || _a === void 0 ? void 0 : _a.path.toString()) !== newLocation.path.toString()) {
            this.lastUniqueTextInputLocation = newLocation;
            this.service.location = newLocation;
        }
    }
    trySuggestDirectory(e) {
        if (this.doAttemptAutocomplete) {
            const inputElement = e.currentTarget;
            const { value } = inputElement;
            if ((value.startsWith('/') || value.startsWith('~/')) && value.slice(-1) !== '/') {
                const expandedPath = common_1.Path.untildify(value, this.homeDir);
                const valueAsURI = new uri_1.default(expandedPath);
                const autocompleteDirectories = this.directoryCache.tryResolveChildDirectories(valueAsURI);
                if (autocompleteDirectories) {
                    this.tryRenderFirstMatch(inputElement, autocompleteDirectories);
                }
            }
        }
    }
    tryRenderFirstMatch(inputElement, children) {
        const { value, selectionStart } = inputElement;
        if (this.locationTextInput) {
            const expandedPath = common_1.Path.untildify(value, this.homeDir);
            const firstMatch = children === null || children === void 0 ? void 0 : children.find(child => child.includes(expandedPath));
            if (firstMatch) {
                const contractedPath = value.startsWith('~') ? common_1.Path.tildify(firstMatch, this.homeDir) : firstMatch;
                this.locationTextInput.value = contractedPath;
                this.locationTextInput.selectionStart = selectionStart;
                this.locationTextInput.selectionEnd = firstMatch.length;
            }
        }
    }
    handleControlKeys(e) {
        this.doAttemptAutocomplete = e.key !== 'Backspace';
        if (e.key === 'Enter') {
            const locationTextInput = this.locationTextInput;
            if (locationTextInput) {
                // expand '~' if present and remove extra whitespace and any trailing slashes or periods.
                const sanitizedInput = locationTextInput.value.trim().replace(/[\/\\.]*$/, '');
                const untildifiedInput = common_1.Path.untildify(sanitizedInput, this.homeDir);
                const uri = new uri_1.default(untildifiedInput);
                this.trySetNewLocation(uri);
                this.toggleToSelectInput();
            }
        }
        else if (e.key === 'Escape') {
            this.toggleToSelectInput();
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            const textInput = this.locationTextInput;
            if (textInput) {
                textInput.selectionStart = textInput.value.length;
            }
        }
        e.stopPropagation();
    }
    get locationList() {
        const locationList = this.host.getElementsByClassName(LocationListRenderer_1.Styles.LOCATION_LIST_CLASS)[0];
        if (locationList instanceof HTMLSelectElement) {
            return locationList;
        }
        return undefined;
    }
    get locationTextInput() {
        const locationTextInput = this.host.getElementsByClassName(LocationListRenderer_1.Styles.LOCATION_TEXT_INPUT_CLASS)[0];
        if (locationTextInput instanceof HTMLInputElement) {
            return locationTextInput;
        }
        return undefined;
    }
    dispose() {
        super.dispose();
        this.toDisposeOnNewCache.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], LocationListRenderer.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], LocationListRenderer.prototype, "variablesServer", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationListRenderer.prototype, "init", null);
LocationListRenderer = LocationListRenderer_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.LocationListRendererOptions)),
    __metadata("design:paramtypes", [Object])
], LocationListRenderer);
exports.LocationListRenderer = LocationListRenderer;
(function (LocationListRenderer) {
    let Styles;
    (function (Styles) {
        Styles.LOCATION_LIST_CLASS = 'theia-LocationList';
        Styles.LOCATION_INPUT_TOGGLE_CLASS = 'theia-LocationInputToggle';
        Styles.LOCATION_TEXT_INPUT_CLASS = 'theia-LocationTextInput';
    })(Styles = LocationListRenderer.Styles || (LocationListRenderer.Styles = {}));
    let Tooltips;
    (function (Tooltips) {
        Tooltips.TOGGLE_TEXT_INPUT = 'Switch to text-based input';
        Tooltips.TOGGLE_SELECT_INPUT = 'Switch to location list';
    })(Tooltips = LocationListRenderer.Tooltips || (LocationListRenderer.Tooltips = {}));
})(LocationListRenderer = exports.LocationListRenderer || (exports.LocationListRenderer = {}));
exports.LocationListRenderer = LocationListRenderer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/location/location-renderer'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/location/location-service.js":
/*!**************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/location/location-service.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/location/location-service'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/common/filesystem.js":
/*!**********************************************************!*\
  !*** ../../packages/filesystem/lib/common/filesystem.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileAccess = void 0;
var FileAccess;
(function (FileAccess) {
    let Constants;
    (function (Constants) {
        /**
         * Flag indicating that the file is visible to the calling process.
         * This is useful for determining if a file exists, but says nothing about rwx permissions. Default if no mode is specified.
         */
        Constants.F_OK = 0;
        /**
         * Flag indicating that the file can be read by the calling process.
         */
        Constants.R_OK = 4;
        /**
         * Flag indicating that the file can be written by the calling process.
         */
        Constants.W_OK = 2;
        /**
         * Flag indicating that the file can be executed by the calling process.
         * This has no effect on Windows (will behave like `FileAccess.F_OK`).
         */
        Constants.X_OK = 1;
    })(Constants = FileAccess.Constants || (FileAccess.Constants = {}));
})(FileAccess = exports.FileAccess || (exports.FileAccess = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/common/filesystem'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/common/index.js":
/*!*****************************************************!*\
  !*** ../../packages/filesystem/lib/common/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./filesystem */ "../../packages/filesystem/lib/common/filesystem.js"), exports);
__exportStar(__webpack_require__(/*! ./filesystem-utils */ "../../packages/filesystem/lib/common/filesystem-utils.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/common'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_filesystem_lib_browser_file-dialog_file-dialog-service_js.js.map