"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_userstorage_lib_browser_user-storage-frontend-module_js"],{

/***/ "../../packages/userstorage/lib/browser/user-storage-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.UserStorageContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const delegating_file_system_provider_1 = __webpack_require__(/*! @theia/filesystem/lib/common/delegating-file-system-provider */ "../../packages/filesystem/lib/common/delegating-file-system-provider.js");
const user_storage_uri_1 = __webpack_require__(/*! ./user-storage-uri */ "../../packages/userstorage/lib/browser/user-storage-uri.js");
let UserStorageContribution = class UserStorageContribution {
    registerFileSystemProviders(service) {
        service.onWillActivateFileSystemProvider(event => {
            if (event.scheme === user_storage_uri_1.UserStorageUri.scheme) {
                event.waitUntil((async () => {
                    const provider = await this.createProvider(service);
                    service.registerProvider(user_storage_uri_1.UserStorageUri.scheme, provider);
                })());
            }
        });
    }
    async createProvider(service) {
        const delegate = await service.activateProvider('file');
        const configDirUri = new uri_1.default(await this.environments.getConfigDirUri());
        return new delegating_file_system_provider_1.DelegatingFileSystemProvider(delegate, {
            uriConverter: {
                to: resource => {
                    const relativePath = user_storage_uri_1.UserStorageUri.relative(resource);
                    if (relativePath) {
                        return configDirUri.resolve(relativePath).normalizePath();
                    }
                    return undefined;
                },
                from: resource => {
                    const relativePath = configDirUri.relative(resource);
                    if (relativePath) {
                        return user_storage_uri_1.UserStorageUri.resolve(relativePath);
                    }
                    return undefined;
                }
            }
        }, new disposable_1.DisposableCollection(delegate.watch(configDirUri, { excludes: [], recursive: true })));
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], UserStorageContribution.prototype, "environments", void 0);
UserStorageContribution = __decorate([
    (0, inversify_1.injectable)()
], UserStorageContribution);
exports.UserStorageContribution = UserStorageContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-contribution'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/user-storage-frontend-module.js":
/*!******************************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-frontend-module.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const user_storage_contribution_1 = __webpack_require__(/*! ./user-storage-contribution */ "../../packages/userstorage/lib/browser/user-storage-contribution.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(user_storage_contribution_1.UserStorageContribution).toSelf().inSingletonScope();
    bind(file_service_1.FileServiceContribution).toService(user_storage_contribution_1.UserStorageContribution);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-frontend-module'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/user-storage-uri.js":
/*!******************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-uri.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.UserStorageUri = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
exports.UserStorageUri = new uri_1.default('user-storage:/user');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-uri'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_userstorage_lib_browser_user-storage-frontend-module_js.js.map