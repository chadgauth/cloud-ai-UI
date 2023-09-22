"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_toolbar_lib_browser_toolbar-constants_js-packages_toolbar_lib_browser_toolbar-defaults_js"],{

/***/ "../../packages/toolbar/lib/browser/toolbar-constants.js":
/*!***************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-constants.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReactKeyboardEvent = exports.ToolbarMenus = exports.USER_TOOLBAR_URI = exports.UserToolbarURI = exports.ToolbarCommands = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_2 = __webpack_require__(/*! @theia/userstorage/lib/browser */ "../../packages/userstorage/lib/browser/index.js");
var ToolbarCommands;
(function (ToolbarCommands) {
    ToolbarCommands.TOGGLE_TOOLBAR = core_1.Command.toLocalizedCommand({
        id: 'toolbar.view.toggle',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Toggle Toolbar',
    }, 'theia/toolbar/toggleToolbar', core_1.nls.getDefaultKey(browser_1.CommonCommands.VIEW_CATEGORY));
    ToolbarCommands.REMOVE_COMMAND_FROM_TOOLBAR = core_1.Command.toLocalizedCommand({
        id: 'toolbar.remove.command',
        category: 'Toolbar',
        label: 'Remove Command From Toolbar',
    }, 'theia/toolbar/removeCommand');
    ToolbarCommands.INSERT_GROUP_LEFT = core_1.Command.toLocalizedCommand({
        id: 'toolbar.insert.group.left',
        category: 'Toolbar',
        label: 'Insert Group Separator (Left)',
    }, 'theia/toolbar/insertGroupLeft');
    ToolbarCommands.INSERT_GROUP_RIGHT = core_1.Command.toLocalizedCommand({
        id: 'toolbar.insert.group.right',
        category: 'Toolbar',
        label: 'Insert Group Separator (Right)',
    }, 'theia/toolbar/insertGroupRight');
    ToolbarCommands.ADD_COMMAND_TO_TOOLBAR = core_1.Command.toLocalizedCommand({
        id: 'toolbar.add.command',
        category: 'Toolbar',
        label: 'Add Command to Toolbar',
    }, 'theia/toolbar/addCommand');
    ToolbarCommands.RESET_TOOLBAR = core_1.Command.toLocalizedCommand({
        id: 'toolbar.restore.defaults',
        category: 'Toolbar',
        label: 'Restore Toolbar Defaults',
    }, 'theia/toolbar/restoreDefaults');
    ToolbarCommands.CUSTOMIZE_TOOLBAR = core_1.Command.toLocalizedCommand({
        id: 'toolbar.customize',
        category: 'Toolbar',
        label: 'Customize Toolbar (Open JSON)',
    }, 'theia/toolbar/openJSON');
})(ToolbarCommands = exports.ToolbarCommands || (exports.ToolbarCommands = {}));
exports.UserToolbarURI = Symbol('UserToolbarURI');
exports.USER_TOOLBAR_URI = new uri_1.default().withScheme(browser_2.UserStorageUri.scheme).withPath('/user/toolbar.json');
var ToolbarMenus;
(function (ToolbarMenus) {
    ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU = ['toolbar:toolbarItemContextMenu'];
    ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU = ['toolbar:backgroundContextMenu'];
    ToolbarMenus.SEARCH_WIDGET_DROPDOWN_MENU = ['searchToolbar:dropdown'];
})(ToolbarMenus = exports.ToolbarMenus || (exports.ToolbarMenus = {}));
var ReactKeyboardEvent;
(function (ReactKeyboardEvent) {
    function is(obj) {
        return (0, core_1.isObject)(obj) && 'key' in obj;
    }
    ReactKeyboardEvent.is = is;
})(ReactKeyboardEvent = exports.ReactKeyboardEvent || (exports.ReactKeyboardEvent = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-constants'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-defaults.js":
/*!**************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-defaults.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarDefaults = exports.ToolbarDefaultsFactory = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const toolbar_interfaces_1 = __webpack_require__(/*! ./toolbar-interfaces */ "../../packages/toolbar/lib/browser/toolbar-interfaces.js");
// This file specifies the default layout of the toolbar. This binding should be overridden for extenders.
// Both Toolbar Command Items and Toolbar Contributions can be specified here.
exports.ToolbarDefaultsFactory = Symbol('ToolbarDefaultsFactory');
const ToolbarDefaults = () => ({
    items: {
        [toolbar_interfaces_1.ToolbarAlignment.LEFT]: [
            [
                {
                    id: 'textEditor.commands.go.back',
                    command: 'textEditor.commands.go.back',
                    icon: 'codicon codicon-arrow-left',
                },
                {
                    id: 'textEditor.commands.go.forward',
                    command: 'textEditor.commands.go.forward',
                    icon: 'codicon codicon-arrow-right',
                },
            ],
            [
                {
                    id: 'workbench.action.splitEditorRight',
                    command: 'workbench.action.splitEditorRight',
                    icon: 'codicon codicon-split-horizontal',
                },
            ],
        ],
        [toolbar_interfaces_1.ToolbarAlignment.CENTER]: [[]],
        [toolbar_interfaces_1.ToolbarAlignment.RIGHT]: [
            [
                {
                    id: 'workbench.action.showCommands',
                    command: 'workbench.action.showCommands',
                    icon: 'codicon codicon-terminal',
                    tooltip: core_1.nls.localizeByDefault('Command Palette'),
                },
            ]
        ]
    },
});
exports.ToolbarDefaults = ToolbarDefaults;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-defaults'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-interfaces.js":
/*!****************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-interfaces.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IconSet = exports.lateInjector = exports.LateInjector = exports.ToolbarFactory = exports.Toolbar = exports.ToolbarContribution = exports.ToolbarAlignmentString = exports.ToolbarAlignment = void 0;
var ToolbarAlignment;
(function (ToolbarAlignment) {
    ToolbarAlignment["LEFT"] = "left";
    ToolbarAlignment["CENTER"] = "center";
    ToolbarAlignment["RIGHT"] = "right";
})(ToolbarAlignment = exports.ToolbarAlignment || (exports.ToolbarAlignment = {}));
var ToolbarAlignmentString;
(function (ToolbarAlignmentString) {
    ToolbarAlignmentString.is = (obj) => obj === ToolbarAlignment.LEFT
        || obj === ToolbarAlignment.CENTER
        || obj === ToolbarAlignment.RIGHT;
})(ToolbarAlignmentString = exports.ToolbarAlignmentString || (exports.ToolbarAlignmentString = {}));
exports.ToolbarContribution = Symbol('ToolbarContribution');
exports.Toolbar = Symbol('Toolbar');
exports.ToolbarFactory = Symbol('ToolbarFactory');
;
exports.LateInjector = Symbol('LateInjector');
const lateInjector = (context, serviceIdentifier) => context.get(serviceIdentifier);
exports.lateInjector = lateInjector;
var IconSet;
(function (IconSet) {
    IconSet["FA"] = "fa";
    IconSet["CODICON"] = "codicon";
})(IconSet = exports.IconSet || (exports.IconSet = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-interfaces'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/index.js":
/*!*******************************************************!*\
  !*** ../../packages/userstorage/lib/browser/index.js ***!
  \*******************************************************/
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
__exportStar(__webpack_require__(/*! ./user-storage-uri */ "../../packages/userstorage/lib/browser/user-storage-uri.js"), exports);
__exportStar(__webpack_require__(/*! ./user-storage-frontend-module */ "../../packages/userstorage/lib/browser/user-storage-frontend-module.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser'] = this;


/***/ }),

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
//# sourceMappingURL=packages_toolbar_lib_browser_toolbar-constants_js-packages_toolbar_lib_browser_toolbar-defaults_js.js.map