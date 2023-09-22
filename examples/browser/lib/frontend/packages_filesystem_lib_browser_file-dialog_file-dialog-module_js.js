"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_filesystem_lib_browser_file-dialog_file-dialog-module_js"],{

/***/ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-module.js":
/*!*******************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-dialog/file-dialog-module.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const location_1 = __webpack_require__(/*! ../location */ "../../packages/filesystem/lib/browser/location/index.js");
const file_dialog_hidden_files_renderer_1 = __webpack_require__(/*! ./file-dialog-hidden-files-renderer */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-hidden-files-renderer.js");
const file_dialog_service_1 = __webpack_require__(/*! ./file-dialog-service */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-service.js");
const file_dialog_tree_1 = __webpack_require__(/*! ./file-dialog-tree */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree.js");
const file_dialog_tree_filters_renderer_1 = __webpack_require__(/*! ./file-dialog-tree-filters-renderer */ "../../packages/filesystem/lib/browser/file-dialog/file-dialog-tree-filters-renderer.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(file_dialog_service_1.DefaultFileDialogService).toSelf().inSingletonScope();
    bind(file_dialog_service_1.FileDialogService).toService(file_dialog_service_1.DefaultFileDialogService);
    bind(location_1.LocationListRendererFactory).toFactory(context => (options) => {
        const childContainer = context.container.createChild();
        childContainer.bind(location_1.LocationListRendererOptions).toConstantValue(options);
        childContainer.bind(location_1.LocationListRenderer).toSelf().inSingletonScope();
        return childContainer.get(location_1.LocationListRenderer);
    });
    bind(file_dialog_tree_filters_renderer_1.FileDialogTreeFiltersRendererFactory).toFactory(context => (options) => {
        const childContainer = context.container.createChild();
        childContainer.bind(file_dialog_tree_filters_renderer_1.FileDialogTreeFiltersRendererOptions).toConstantValue(options);
        childContainer.bind(file_dialog_tree_filters_renderer_1.FileDialogTreeFiltersRenderer).toSelf().inSingletonScope();
        return childContainer.get(file_dialog_tree_filters_renderer_1.FileDialogTreeFiltersRenderer);
    });
    bind(file_dialog_hidden_files_renderer_1.HiddenFilesToggleRendererFactory).toFactory(({ container }) => (fileDialogTree) => {
        const child = container.createChild();
        child.bind(file_dialog_tree_1.FileDialogTree).toConstantValue(fileDialogTree);
        child.bind(file_dialog_hidden_files_renderer_1.FileDialogHiddenFilesToggleRenderer).toSelf().inSingletonScope();
        return child.get(file_dialog_hidden_files_renderer_1.FileDialogHiddenFilesToggleRenderer);
    });
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-dialog/file-dialog-module'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_filesystem_lib_browser_file-dialog_file-dialog-module_js.js.map