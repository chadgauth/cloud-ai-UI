(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_theia_application-package_lib_environment_index_js-packages_filesystem_l-f5e3ab"],{

/***/ "../../packages/core/shared/@theia/application-package/lib/environment/index.js":
/*!**************************************************************************************!*\
  !*** ../../packages/core/shared/@theia/application-package/lib/environment/index.js ***!
  \**************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @theia/application-package/lib/environment */ "../../dev-packages/application-package/lib/environment.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@theia/application-package/lib/environment'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/download/file-download-frontend-module.js":
/*!***************************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/download/file-download-frontend-module.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const file_download_service_1 = __webpack_require__(/*! ./file-download-service */ "../../packages/filesystem/lib/browser/download/file-download-service.js");
const file_download_command_contribution_1 = __webpack_require__(/*! ./file-download-command-contribution */ "../../packages/filesystem/lib/browser/download/file-download-command-contribution.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(file_download_service_1.FileDownloadService).toSelf().inSingletonScope();
    bind(command_1.CommandContribution).to(file_download_command_contribution_1.FileDownloadCommandContribution).inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/download/file-download-frontend-module'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_shared_theia_application-package_lib_environment_index_js-packages_filesystem_l-f5e3ab.js.map