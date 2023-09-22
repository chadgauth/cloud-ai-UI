"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_process_lib_common_process-common-module_js"],{

/***/ "../../packages/process/lib/common/process-common-module.js":
/*!******************************************************************!*\
  !*** ../../packages/process/lib/common/process-common-module.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
const shell_command_builder_1 = __webpack_require__(/*! ./shell-command-builder */ "../../packages/process/lib/common/shell-command-builder.js");
exports["default"] = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(shell_command_builder_1.ShellCommandBuilder).toSelf().inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/process/lib/common/process-common-module'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_process_lib_common_process-common-module_js.js.map