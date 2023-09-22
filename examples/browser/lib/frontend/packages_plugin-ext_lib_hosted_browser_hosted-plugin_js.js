(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_plugin-ext_lib_hosted_browser_hosted-plugin_js"],{

/***/ "../../packages/core/shared/@theia/request/index.js":
/*!**********************************************************!*\
  !*** ../../packages/core/shared/@theia/request/index.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @theia/request */ "../../dev-packages/request/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@theia/request'] = this;


/***/ }),

/***/ "../../packages/editor-preview/lib/browser/editor-preview-widget.js":
/*!**************************************************************************!*\
  !*** ../../packages/editor-preview/lib/browser/editor-preview-widget.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.EditorPreviewWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const PREVIEW_TITLE_CLASS = 'theia-editor-preview-title-unpinned';
class EditorPreviewWidget extends browser_2.EditorWidget {
    constructor(editor, selectionService) {
        super(editor, selectionService);
        this._isPreview = false;
        this.onDidChangePreviewStateEmitter = new common_1.Emitter();
        this.onDidChangePreviewState = this.onDidChangePreviewStateEmitter.event;
        this.toDispose.push(this.onDidChangePreviewStateEmitter);
    }
    get isPreview() {
        return this._isPreview;
    }
    initializePreview() {
        const oneTimeListeners = new common_1.DisposableCollection();
        this._isPreview = true;
        this.title.className += ` ${PREVIEW_TITLE_CLASS}`;
        const oneTimeDirtyChangeListener = this.saveable.onDirtyChanged(() => {
            this.convertToNonPreview();
            oneTimeListeners.dispose();
        });
        oneTimeListeners.push(oneTimeDirtyChangeListener);
        const oneTimeTitleChangeHandler = () => {
            if (this.title.className.includes(browser_1.PINNED_CLASS)) {
                this.convertToNonPreview();
                oneTimeListeners.dispose();
            }
        };
        this.title.changed.connect(oneTimeTitleChangeHandler);
        oneTimeListeners.push(common_1.Disposable.create(() => this.title.changed.disconnect(oneTimeTitleChangeHandler)));
        this.toDispose.push(oneTimeListeners);
    }
    convertToNonPreview() {
        if (this._isPreview) {
            this._isPreview = false;
            this.currentTabbar = undefined;
            this.title.className = this.title.className.replace(PREVIEW_TITLE_CLASS, '');
            this.onDidChangePreviewStateEmitter.fire();
            this.onDidChangePreviewStateEmitter.dispose();
        }
    }
    handleTabBarChange(oldTabBar, newTabBar) {
        super.handleTabBarChange(oldTabBar, newTabBar);
        if (this._isPreview) {
            if (oldTabBar && newTabBar) {
                this.convertToNonPreview();
            }
        }
    }
    storeState() {
        var _a;
        if (((_a = this.getResourceUri()) === null || _a === void 0 ? void 0 : _a.scheme) !== common_1.UNTITLED_SCHEME) {
            const { _isPreview: isPreview } = this;
            return { isPreview, editorState: this.editor.storeViewState() };
        }
    }
    restoreState(oldState) {
        if (!oldState.isPreview) {
            this.convertToNonPreview();
        }
        this.editor.restoreViewState(oldState.editorState);
    }
}
exports.EditorPreviewWidget = EditorPreviewWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor-preview/lib/browser/editor-preview-widget'] = this;


/***/ }),

/***/ "../../packages/file-search/lib/common/file-search-service.js":
/*!********************************************************************!*\
  !*** ../../packages/file-search/lib/common/file-search-service.js ***!
  \********************************************************************/
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
exports.WHITESPACE_QUERY_SEPARATOR = exports.FileSearchService = exports.fileSearchServicePath = void 0;
exports.fileSearchServicePath = '/services/search';
exports.FileSearchService = Symbol('FileSearchService');
exports.WHITESPACE_QUERY_SEPARATOR = /\s+/;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/file-search/lib/common/file-search-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/textmate/index.js":
/*!***********************************************************!*\
  !*** ../../packages/monaco/lib/browser/textmate/index.js ***!
  \***********************************************************/
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
__exportStar(__webpack_require__(/*! ./textmate-registry */ "../../packages/monaco/lib/browser/textmate/textmate-registry.js"), exports);
__exportStar(__webpack_require__(/*! ./textmate-contribution */ "../../packages/monaco/lib/browser/textmate/textmate-contribution.js"), exports);
__exportStar(__webpack_require__(/*! ./monaco-textmate-service */ "../../packages/monaco/lib/browser/textmate/monaco-textmate-service.js"), exports);
__exportStar(__webpack_require__(/*! ./monaco-textmate-frontend-bindings */ "../../packages/monaco/lib/browser/textmate/monaco-textmate-frontend-bindings.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/textmate'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/index.js":
/*!****************************************************!*\
  !*** ../../packages/notebook/lib/browser/index.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
__exportStar(__webpack_require__(/*! ./notebook-type-registry */ "../../packages/notebook/lib/browser/notebook-type-registry.js"), exports);
__exportStar(__webpack_require__(/*! ./notebook-renderer-registry */ "../../packages/notebook/lib/browser/notebook-renderer-registry.js"), exports);
__exportStar(__webpack_require__(/*! ./notebook-editor-widget */ "../../packages/notebook/lib/browser/notebook-editor-widget.js"), exports);
__exportStar(__webpack_require__(/*! ./service/notebook-service */ "../../packages/notebook/lib/browser/service/notebook-service.js"), exports);
__exportStar(__webpack_require__(/*! ./service/notebook-editor-service */ "../../packages/notebook/lib/browser/service/notebook-editor-service.js"), exports);
__exportStar(__webpack_require__(/*! ./service/notebook-kernel-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-service.js"), exports);
__exportStar(__webpack_require__(/*! ./service/notebook-execution-state-service */ "../../packages/notebook/lib/browser/service/notebook-execution-state-service.js"), exports);
__exportStar(__webpack_require__(/*! ./service/notebook-model-resolver-service */ "../../packages/notebook/lib/browser/service/notebook-model-resolver-service.js"), exports);
__exportStar(__webpack_require__(/*! ./service/notebook-renderer-messaging-service */ "../../packages/notebook/lib/browser/service/notebook-renderer-messaging-service.js"), exports);
__exportStar(__webpack_require__(/*! ./renderers/cell-output-webview */ "../../packages/notebook/lib/browser/renderers/cell-output-webview.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/language-pack-service.js":
/*!*********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/language-pack-service.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.LanguagePackService = exports.languagePackServicePath = void 0;
exports.languagePackServicePath = '/services/languagePackService';
exports.LanguagePackService = Symbol('LanguagePackService');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/language-pack-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin-watcher.js":
/*!*****************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/hosted/browser/hosted-plugin-watcher.js ***!
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
exports.HostedPluginWatcher = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
let HostedPluginWatcher = class HostedPluginWatcher {
    constructor() {
        this.onPostMessage = new event_1.Emitter();
        this.onLogMessage = new event_1.Emitter();
        this.onDidDeployEmitter = new event_1.Emitter();
        this.onDidDeploy = this.onDidDeployEmitter.event;
    }
    getHostedPluginClient() {
        const messageEmitter = this.onPostMessage;
        const logEmitter = this.onLogMessage;
        return {
            postMessage(pluginHostId, message) {
                messageEmitter.fire({ pluginHostId, message });
                return Promise.resolve();
            },
            log(logPart) {
                logEmitter.fire(logPart);
                return Promise.resolve();
            },
            onDidDeploy: () => this.onDidDeployEmitter.fire(undefined)
        };
    }
    get onPostMessageEvent() {
        return this.onPostMessage.event;
    }
    get onLogMessageEvent() {
        return this.onLogMessage.event;
    }
};
HostedPluginWatcher = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginWatcher);
exports.HostedPluginWatcher = HostedPluginWatcher;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/hosted/browser/hosted-plugin-watcher'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js":
/*!*********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js ***!
  \*********************************************************************/
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/da5fb7d5b865aa522abc7e82c10b746834b98639/src/vs/workbench/api/node/extHostExtensionService.ts
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
exports.PluginContributions = exports.HostedPluginSupport = exports.ALL_ACTIVATION_EVENT = exports.PluginProgressLocation = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const coreutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/coreutils */ "../../packages/core/shared/@phosphor/coreutils/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const plugin_worker_1 = __webpack_require__(/*! ./plugin-worker */ "../../packages/plugin-ext/lib/hosted/browser/plugin-worker.js");
const plugin_protocol_1 = __webpack_require__(/*! ../../common/plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js");
const hosted_plugin_watcher_1 = __webpack_require__(/*! ./hosted-plugin-watcher */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin-watcher.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const main_context_1 = __webpack_require__(/*! ../../main/browser/main-context */ "../../packages/plugin-ext/lib/main/browser/main-context.js");
const rpc_protocol_1 = __webpack_require__(/*! ../../common/rpc-protocol */ "../../packages/plugin-ext/lib/common/rpc-protocol.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const plugin_contribution_handler_1 = __webpack_require__(/*! ../../main/browser/plugin-contribution-handler */ "../../packages/plugin-ext/lib/main/browser/plugin-contribution-handler.js");
const env_main_1 = __webpack_require__(/*! ../../main/browser/env-main */ "../../packages/plugin-ext/lib/main/browser/env-main.js");
const plugin_ext_api_contribution_1 = __webpack_require__(/*! ../../common/plugin-ext-api-contribution */ "../../packages/plugin-ext/lib/common/plugin-ext-api-contribution.js");
const plugin_paths_protocol_1 = __webpack_require__(/*! ../../main/common/plugin-paths-protocol */ "../../packages/plugin-ext/lib/main/common/plugin-paths-protocol.js");
const preference_registry_main_1 = __webpack_require__(/*! ../../main/browser/preference-registry-main */ "../../packages/plugin-ext/lib/main/browser/preference-registry-main.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const debug_session_manager_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const debug_configuration_manager_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-configuration-manager */ "../../packages/debug/lib/browser/debug-configuration-manager.js");
const file_search_service_1 = __webpack_require__(/*! @theia/file-search/lib/common/file-search-service */ "../../packages/file-search/lib/common/file-search-service.js");
const frontend_application_state_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-state */ "../../packages/core/lib/browser/frontend-application-state.js");
const plugin_view_registry_1 = __webpack_require__(/*! ../../main/browser/view/plugin-view-registry */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-registry.js");
const task_contribution_1 = __webpack_require__(/*! @theia/task/lib/browser/task-contribution */ "../../packages/task/lib/browser/task-contribution.js");
const task_definition_registry_1 = __webpack_require__(/*! @theia/task/lib/browser/task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
const webview_environment_1 = __webpack_require__(/*! ../../main/browser/webview/webview-environment */ "../../packages/plugin-ext/lib/main/browser/webview/webview-environment.js");
const webview_1 = __webpack_require__(/*! ../../main/browser/webview/webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const frontend_application_config_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-config-provider */ "../../packages/core/lib/browser/frontend-application-config-provider.js");
const environment_1 = __webpack_require__(/*! @theia/core/shared/@theia/application-package/lib/environment */ "../../packages/core/shared/@theia/application-package/lib/environment/index.js");
const json_schema_store_1 = __webpack_require__(/*! @theia/core/lib/browser/json-schema-store */ "../../packages/core/lib/browser/json-schema-store.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const plugin_custom_editor_registry_1 = __webpack_require__(/*! ../../main/browser/custom-editors/plugin-custom-editor-registry */ "../../packages/plugin-ext/lib/main/browser/custom-editors/plugin-custom-editor-registry.js");
const custom_editor_widget_1 = __webpack_require__(/*! ../../main/browser/custom-editors/custom-editor-widget */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const language_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/languages/language */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/languages/language.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const uint8_array_message_buffer_1 = __webpack_require__(/*! @theia/core/lib/common/message-rpc/uint8-array-message-buffer */ "../../packages/core/lib/common/message-rpc/uint8-array-message-buffer.js");
const channel_1 = __webpack_require__(/*! @theia/core/lib/common/message-rpc/channel */ "../../packages/core/lib/common/message-rpc/channel.js");
const browser_2 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
exports.PluginProgressLocation = 'plugin';
exports.ALL_ACTIVATION_EVENT = '*';
let HostedPluginSupport = class HostedPluginSupport {
    constructor() {
        this.clientId = coreutils_1.UUID.uuid4();
        this.managers = new Map();
        this.contributions = new Map();
        this.activationEvents = new Set();
        this.onDidChangePluginsEmitter = new core_1.Emitter();
        this.onDidChangePlugins = this.onDidChangePluginsEmitter.event;
        this.deferredWillStart = new promise_util_1.Deferred();
        this.deferredDidStart = new promise_util_1.Deferred();
        this.loadQueue = Promise.resolve(undefined);
        this.load = debounce(() => this.loadQueue = this.loadQueue.then(async () => {
            try {
                await this.progressService.withProgress('', exports.PluginProgressLocation, () => this.doLoad());
            }
            catch (e) {
                console.error('Failed to load plugins:', e);
            }
        }), 50, { leading: true });
        this.webviewsToRestore = new Map();
        this.webviewRevivers = new Map();
    }
    /**
     * Resolves when the initial plugins are loaded and about to be started.
     */
    get willStart() {
        return this.deferredWillStart.promise;
    }
    /**
     * Resolves when the initial plugins are started.
     */
    get didStart() {
        return this.deferredDidStart.promise;
    }
    init() {
        this.theiaReadyPromise = Promise.all([this.preferenceServiceImpl.ready, this.workspaceService.roots]);
        this.workspaceService.onWorkspaceChanged(() => this.updateStoragePath());
        const languageService = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
        for (const language of languageService['_encounteredLanguages']) {
            this.activateByLanguage(language);
        }
        languageService.onDidEncounterLanguage(language => this.activateByLanguage(language));
        this.commands.onWillExecuteCommand(event => this.ensureCommandHandlerRegistration(event));
        this.debugSessionManager.onWillStartDebugSession(event => this.ensureDebugActivation(event));
        this.debugSessionManager.onWillResolveDebugConfiguration(event => this.ensureDebugActivation(event, 'onDebugResolve', event.debugType));
        this.debugConfigurationManager.onWillProvideDebugConfiguration(event => this.ensureDebugActivation(event, 'onDebugInitialConfigurations'));
        // Activate all providers of dynamic configurations, i.e. Let the user pick a configuration from all the available ones.
        this.debugConfigurationManager.onWillProvideDynamicDebugConfiguration(event => this.ensureDebugActivation(event, 'onDebugDynamicConfigurations', exports.ALL_ACTIVATION_EVENT));
        this.viewRegistry.onDidExpandView(id => this.activateByView(id));
        this.taskProviderRegistry.onWillProvideTaskProvider(event => this.ensureTaskActivation(event));
        this.taskResolverRegistry.onWillProvideTaskResolver(event => this.ensureTaskActivation(event));
        this.fileService.onWillActivateFileSystemProvider(event => this.ensureFileSystemActivation(event));
        this.customEditorRegistry.onWillOpenCustomEditor(event => this.activateByCustomEditor(event));
        this.notebookService.onWillOpenNotebook(async (event) => this.activateByNotebook(event));
        this.widgets.onDidCreateWidget(({ factoryId, widget }) => {
            if ((factoryId === webview_1.WebviewWidget.FACTORY_ID || factoryId === custom_editor_widget_1.CustomEditorWidget.FACTORY_ID) && widget instanceof webview_1.WebviewWidget) {
                const storeState = widget.storeState.bind(widget);
                const restoreState = widget.restoreState.bind(widget);
                widget.storeState = () => {
                    if (this.webviewRevivers.has(widget.viewType)) {
                        return storeState();
                    }
                    return undefined;
                };
                widget.restoreState = state => {
                    if (state.viewType) {
                        restoreState(state);
                        this.preserveWebview(widget);
                    }
                    else {
                        widget.dispose();
                    }
                };
            }
        });
    }
    get plugins() {
        const plugins = [];
        this.contributions.forEach(contributions => plugins.push(contributions.plugin.metadata));
        return plugins;
    }
    getPlugin(id) {
        const contributions = this.contributions.get(id);
        return contributions && contributions.plugin;
    }
    /** do not call it, except from the plugin frontend contribution */
    onStart(container) {
        this.container = container;
        this.load();
        this.watcher.onDidDeploy(() => this.load());
        this.server.onDidOpenConnection(() => this.load());
    }
    async doLoad() {
        const toDisconnect = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        toDisconnect.push(core_1.Disposable.create(() => this.preserveWebviews()));
        this.server.onDidCloseConnection(() => toDisconnect.dispose());
        // process empty plugins as well in order to properly remove stale plugin widgets
        await this.syncPlugins();
        // it has to be resolved before awaiting layout is initialized
        // otherwise clients can hang forever in the initialization phase
        this.deferredWillStart.resolve();
        // make sure that the previous state, including plugin widgets, is restored
        // and core layout is initialized, i.e. explorer, scm, debug views are already added to the shell
        // but shell is not yet revealed
        await this.appState.reachedState('initialized_layout');
        if (toDisconnect.disposed) {
            // if disconnected then don't try to load plugin contributions
            return;
        }
        const contributionsByHost = this.loadContributions(toDisconnect);
        await this.viewRegistry.initWidgets();
        // remove restored plugin widgets which were not registered by contributions
        this.viewRegistry.removeStaleWidgets();
        await this.theiaReadyPromise;
        if (toDisconnect.disposed) {
            // if disconnected then don't try to init plugin code and dynamic contributions
            return;
        }
        await this.startPlugins(contributionsByHost, toDisconnect);
        this.deferredDidStart.resolve();
    }
    /**
     * Sync loaded and deployed plugins:
     * - undeployed plugins are unloaded
     * - newly deployed plugins are initialized
     */
    async syncPlugins() {
        var _a;
        let initialized = 0;
        const waitPluginsMeasurement = this.measure('waitForDeployment');
        let syncPluginsMeasurement;
        const toUnload = new Set(this.contributions.keys());
        let didChangeInstallationStatus = false;
        try {
            const newPluginIds = [];
            const [deployedPluginIds, uninstalledPluginIds] = await Promise.all([this.server.getDeployedPluginIds(), this.server.getUninstalledPluginIds()]);
            waitPluginsMeasurement.log('Waiting for backend deployment');
            syncPluginsMeasurement = this.measure('syncPlugins');
            for (const versionedId of deployedPluginIds) {
                const unversionedId = plugin_protocol_1.PluginIdentifiers.unversionedFromVersioned(versionedId);
                toUnload.delete(unversionedId);
                if (!this.contributions.has(unversionedId)) {
                    newPluginIds.push(versionedId);
                }
            }
            for (const pluginId of toUnload) {
                (_a = this.contributions.get(pluginId)) === null || _a === void 0 ? void 0 : _a.dispose();
            }
            for (const versionedId of uninstalledPluginIds) {
                const plugin = this.getPlugin(plugin_protocol_1.PluginIdentifiers.unversionedFromVersioned(versionedId));
                if (plugin && plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(plugin.metadata.model) === versionedId && !plugin.metadata.outOfSync) {
                    plugin.metadata.outOfSync = didChangeInstallationStatus = true;
                }
            }
            for (const contribution of this.contributions.values()) {
                if (contribution.plugin.metadata.outOfSync && !uninstalledPluginIds.includes(plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(contribution.plugin.metadata.model))) {
                    contribution.plugin.metadata.outOfSync = false;
                    didChangeInstallationStatus = true;
                }
            }
            if (newPluginIds.length) {
                const plugins = await this.server.getDeployedPlugins({ pluginIds: newPluginIds });
                for (const plugin of plugins) {
                    const pluginId = plugin_protocol_1.PluginIdentifiers.componentsToUnversionedId(plugin.metadata.model);
                    const contributions = new PluginContributions(plugin);
                    this.contributions.set(pluginId, contributions);
                    contributions.push(core_1.Disposable.create(() => this.contributions.delete(pluginId)));
                    initialized++;
                }
            }
        }
        finally {
            if (initialized || toUnload.size || didChangeInstallationStatus) {
                this.onDidChangePluginsEmitter.fire(undefined);
            }
            if (!syncPluginsMeasurement) {
                // await didn't complete normally
                waitPluginsMeasurement.error('Backend deployment failed.');
            }
        }
        syncPluginsMeasurement === null || syncPluginsMeasurement === void 0 ? void 0 : syncPluginsMeasurement.log(`Sync of ${this.getPluginCount(initialized)}`);
    }
    /**
     * Always synchronous in order to simplify handling disconnections.
     * @throws never
     */
    loadContributions(toDisconnect) {
        let loaded = 0;
        const loadPluginsMeasurement = this.measure('loadPlugins');
        const hostContributions = new Map();
        console.log(`[${this.clientId}] Loading plugin contributions`);
        for (const contributions of this.contributions.values()) {
            const plugin = contributions.plugin.metadata;
            const pluginId = plugin.model.id;
            if (contributions.state === PluginContributions.State.INITIALIZING) {
                contributions.state = PluginContributions.State.LOADING;
                contributions.push(core_1.Disposable.create(() => console.log(`[${pluginId}]: Unloaded plugin.`)));
                contributions.push(this.contributionHandler.handleContributions(this.clientId, contributions.plugin));
                contributions.state = PluginContributions.State.LOADED;
                console.debug(`[${this.clientId}][${pluginId}]: Loaded contributions.`);
                loaded++;
            }
            if (contributions.state === PluginContributions.State.LOADED) {
                contributions.state = PluginContributions.State.STARTING;
                const host = plugin.model.entryPoint.frontend ? 'frontend' : plugin.host;
                const dynamicContributions = hostContributions.get(host) || [];
                dynamicContributions.push(contributions);
                hostContributions.set(host, dynamicContributions);
                toDisconnect.push(core_1.Disposable.create(() => {
                    contributions.state = PluginContributions.State.LOADED;
                    console.debug(`[${this.clientId}][${pluginId}]: Disconnected.`);
                }));
            }
        }
        loadPluginsMeasurement.log(`Load contributions of ${this.getPluginCount(loaded)}`);
        return hostContributions;
    }
    async startPlugins(contributionsByHost, toDisconnect) {
        let started = 0;
        const startPluginsMeasurement = this.measure('startPlugins');
        const [hostLogPath, hostStoragePath, hostGlobalStoragePath] = await Promise.all([
            this.pluginPathsService.getHostLogPath(),
            this.getStoragePath(),
            this.getHostGlobalStoragePath()
        ]);
        if (toDisconnect.disposed) {
            return;
        }
        const thenable = [];
        const configStorage = {
            hostLogPath,
            hostStoragePath,
            hostGlobalStoragePath
        };
        for (const [host, hostContributions] of contributionsByHost) {
            // do not start plugins for electron browser
            if (host === 'frontend' && environment_1.environment.electron.is()) {
                continue;
            }
            const manager = await this.obtainManager(host, hostContributions, toDisconnect);
            if (!manager) {
                continue;
            }
            const plugins = hostContributions.map(contributions => contributions.plugin.metadata);
            thenable.push((async () => {
                try {
                    const activationEvents = [...this.activationEvents];
                    await manager.$start({ plugins, configStorage, activationEvents });
                    if (toDisconnect.disposed) {
                        return;
                    }
                    console.log(`[${this.clientId}] Starting plugins.`);
                    for (const contributions of hostContributions) {
                        started++;
                        const plugin = contributions.plugin;
                        const id = plugin.metadata.model.id;
                        contributions.state = PluginContributions.State.STARTED;
                        console.debug(`[${this.clientId}][${id}]: Started plugin.`);
                        toDisconnect.push(contributions.push(core_1.Disposable.create(() => {
                            console.debug(`[${this.clientId}][${id}]: Stopped plugin.`);
                            manager.$stop(id);
                        })));
                        this.activateByWorkspaceContains(manager, plugin);
                    }
                }
                catch (e) {
                    console.error(`Failed to start plugins for '${host}' host`, e);
                }
            })());
        }
        await Promise.all(thenable);
        await this.activateByEvent('onStartupFinished');
        if (toDisconnect.disposed) {
            return;
        }
        startPluginsMeasurement.log(`Start of ${this.getPluginCount(started)}`);
    }
    async obtainManager(host, hostContributions, toDisconnect) {
        var _a;
        let manager = this.managers.get(host);
        if (!manager) {
            const pluginId = (0, plugin_protocol_1.getPluginId)(hostContributions[0].plugin.metadata.model);
            const rpc = this.initRpc(host, pluginId);
            toDisconnect.push(rpc);
            manager = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.HOSTED_PLUGIN_MANAGER_EXT);
            this.managers.set(host, manager);
            toDisconnect.push(core_1.Disposable.create(() => this.managers.delete(host)));
            const [extApi, globalState, workspaceState, webviewResourceRoot, webviewCspSource, defaultShell, jsonValidation] = await Promise.all([
                this.server.getExtPluginAPI(),
                this.pluginServer.getAllStorageValues(undefined),
                this.pluginServer.getAllStorageValues({
                    workspace: (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.toString(),
                    roots: this.workspaceService.tryGetRoots().map(root => root.resource.toString())
                }),
                this.webviewEnvironment.resourceRoot(host),
                this.webviewEnvironment.cspSource(),
                this.terminalService.getDefaultShell(),
                this.jsonSchemaStore.schemas
            ]);
            if (toDisconnect.disposed) {
                return undefined;
            }
            const isElectron = environment_1.environment.electron.is();
            await manager.$init({
                preferences: (0, preference_registry_main_1.getPreferences)(this.preferenceProviderProvider, this.workspaceService.tryGetRoots()),
                globalState,
                workspaceState,
                env: {
                    queryParams: (0, env_main_1.getQueryParameters)(),
                    language: core_1.nls.locale || core_1.nls.defaultLocale,
                    shell: defaultShell,
                    uiKind: isElectron ? plugin_api_rpc_1.UIKind.Desktop : plugin_api_rpc_1.UIKind.Web,
                    appName: frontend_application_config_provider_1.FrontendApplicationConfigProvider.get().applicationName,
                    appHost: isElectron ? 'desktop' : 'web' // TODO: 'web' could be the embedder's name, e.g. 'github.dev'
                },
                extApi,
                webview: {
                    webviewResourceRoot,
                    webviewCspSource
                },
                jsonValidation
            });
            if (toDisconnect.disposed) {
                return undefined;
            }
        }
        return manager;
    }
    initRpc(host, pluginId) {
        const rpc = host === 'frontend' ? new plugin_worker_1.PluginWorker().rpc : this.createServerRpc(host);
        (0, main_context_1.setUpPluginApi)(rpc, this.container);
        this.mainPluginApiProviders.getContributions().forEach(p => p.initialize(rpc, this.container));
        return rpc;
    }
    createServerRpc(pluginHostId) {
        const channel = new channel_1.BasicChannel(() => {
            const writer = new uint8_array_message_buffer_1.Uint8ArrayWriteBuffer();
            writer.onCommit(buffer => {
                this.server.onMessage(pluginHostId, buffer);
            });
            return writer;
        });
        // Create RPC protocol before adding the listener to the watcher to receive the watcher's cached messages after the rpc protocol was created.
        const rpc = new rpc_protocol_1.RPCProtocolImpl(channel);
        this.watcher.onPostMessageEvent(received => {
            if (pluginHostId === received.pluginHostId) {
                channel.onMessageEmitter.fire(() => new uint8_array_message_buffer_1.Uint8ArrayReadBuffer(received.message));
            }
        });
        return rpc;
    }
    async updateStoragePath() {
        const path = await this.getStoragePath();
        for (const manager of this.managers.values()) {
            manager.$updateStoragePath(path);
        }
    }
    async getStoragePath() {
        var _a;
        const roots = await this.workspaceService.roots;
        return this.pluginPathsService.getHostStoragePath((_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.toString(), roots.map(root => root.resource.toString()));
    }
    async getHostGlobalStoragePath() {
        const configDirUri = await this.envServer.getConfigDirUri();
        const globalStorageFolderUri = new uri_1.default(configDirUri).resolve('globalStorage');
        // Make sure that folder by the path exists
        if (!await this.fileService.exists(globalStorageFolderUri)) {
            await this.fileService.createFolder(globalStorageFolderUri, { fromUserGesture: false });
        }
        const globalStorageFolderFsPath = await this.fileService.fsPath(globalStorageFolderUri);
        if (!globalStorageFolderFsPath) {
            throw new Error(`Could not resolve the FS path for URI: ${globalStorageFolderUri}`);
        }
        return globalStorageFolderFsPath;
    }
    async activateByEvent(activationEvent) {
        if (this.activationEvents.has(activationEvent)) {
            return;
        }
        this.activationEvents.add(activationEvent);
        await Promise.all(Array.from(this.managers.values(), manager => manager.$activateByEvent(activationEvent)));
    }
    async activateByViewContainer(viewContainerId) {
        await Promise.all(this.viewRegistry.getContainerViews(viewContainerId).map(viewId => this.activateByView(viewId)));
    }
    async activateByView(viewId) {
        await this.activateByEvent(`onView:${viewId}`);
    }
    async activateByLanguage(languageId) {
        await this.activateByEvent(`onLanguage:${languageId}`);
    }
    async activateByCommand(commandId) {
        await this.activateByEvent(`onCommand:${commandId}`);
    }
    async activateByTaskType(taskType) {
        await this.activateByEvent(`onTaskType:${taskType}`);
    }
    async activateByCustomEditor(viewType) {
        await this.activateByEvent(`onCustomEditor:${viewType}`);
    }
    async activateByNotebook(viewType) {
        await this.activateByEvent(`onNotebook:${viewType}`);
    }
    activateByFileSystem(event) {
        return this.activateByEvent(`onFileSystem:${event.scheme}`);
    }
    activateByTerminalProfile(profileId) {
        return this.activateByEvent(`onTerminalProfile:${profileId}`);
    }
    ensureFileSystemActivation(event) {
        event.waitUntil(this.activateByFileSystem(event));
    }
    ensureCommandHandlerRegistration(event) {
        const activation = this.activateByCommand(event.commandId);
        if (this.commands.getCommand(event.commandId) &&
            (!this.contributionHandler.hasCommand(event.commandId) ||
                this.contributionHandler.hasCommandHandler(event.commandId))) {
            return;
        }
        const waitForCommandHandler = new promise_util_1.Deferred();
        const listener = this.contributionHandler.onDidRegisterCommandHandler(id => {
            if (id === event.commandId) {
                listener.dispose();
                waitForCommandHandler.resolve();
            }
        });
        const p = Promise.all([
            activation,
            waitForCommandHandler.promise
        ]);
        p.then(() => listener.dispose(), () => listener.dispose());
        event.waitUntil(p);
    }
    ensureTaskActivation(event) {
        const promises = [this.activateByCommand('workbench.action.tasks.runTask')];
        const taskType = event.taskType;
        if (taskType) {
            if (taskType === exports.ALL_ACTIVATION_EVENT) {
                for (const taskDefinition of this.taskDefinitionRegistry.getAll()) {
                    promises.push(this.activateByTaskType(taskDefinition.taskType));
                }
            }
            else {
                promises.push(this.activateByTaskType(taskType));
            }
        }
        event.waitUntil(Promise.all(promises));
    }
    ensureDebugActivation(event, activationEvent, debugType) {
        event.waitUntil(this.activateByDebug(activationEvent, debugType));
    }
    async activateByDebug(activationEvent, debugType) {
        const promises = [this.activateByEvent('onDebug')];
        if (activationEvent) {
            promises.push(this.activateByEvent(activationEvent));
            if (debugType) {
                promises.push(this.activateByEvent(activationEvent + ':' + debugType));
            }
        }
        await Promise.all(promises);
    }
    async activateByWorkspaceContains(manager, plugin) {
        const activationEvents = plugin.contributes && plugin.contributes.activationEvents;
        if (!activationEvents) {
            return;
        }
        const paths = [];
        const includePatterns = [];
        // should be aligned with https://github.com/microsoft/vscode/blob/da5fb7d5b865aa522abc7e82c10b746834b98639/src/vs/workbench/api/node/extHostExtensionService.ts#L460-L469
        for (const activationEvent of activationEvents) {
            if (/^workspaceContains:/.test(activationEvent)) {
                const fileNameOrGlob = activationEvent.substring('workspaceContains:'.length);
                if (fileNameOrGlob.indexOf(exports.ALL_ACTIVATION_EVENT) >= 0 || fileNameOrGlob.indexOf('?') >= 0) {
                    includePatterns.push(fileNameOrGlob);
                }
                else {
                    paths.push(fileNameOrGlob);
                }
            }
        }
        const activatePlugin = () => manager.$activateByEvent(`onPlugin:${plugin.metadata.model.id}`);
        const promises = [];
        if (paths.length) {
            promises.push(this.workspaceService.containsSome(paths));
        }
        if (includePatterns.length) {
            const tokenSource = new core_1.CancellationTokenSource();
            const searchTimeout = setTimeout(() => {
                tokenSource.cancel();
                // activate eagerly if took to long to search
                activatePlugin();
            }, 7000);
            promises.push((async () => {
                try {
                    const result = await this.fileSearchService.find('', {
                        rootUris: this.workspaceService.tryGetRoots().map(r => r.resource.toString()),
                        includePatterns,
                        limit: 1
                    }, tokenSource.token);
                    return result.length > 0;
                }
                catch (e) {
                    if (!(0, core_1.isCancelled)(e)) {
                        console.error(e);
                    }
                    return false;
                }
                finally {
                    clearTimeout(searchTimeout);
                }
            })());
        }
        if (promises.length && await Promise.all(promises).then(exists => exists.some(v => v))) {
            await activatePlugin();
        }
    }
    async activatePlugin(id) {
        const activation = [];
        for (const manager of this.managers.values()) {
            activation.push(manager.$activatePlugin(id));
        }
        await Promise.all(activation);
    }
    measure(name) {
        return this.stopwatch.start(name, { context: this.clientId });
    }
    getPluginCount(plugins) {
        return `${plugins} plugin${plugins === 1 ? '' : 's'}`;
    }
    registerWebviewReviver(viewType, reviver) {
        if (this.webviewRevivers.has(viewType)) {
            throw new Error(`Reviver for ${viewType} already registered`);
        }
        this.webviewRevivers.set(viewType, reviver);
        if (this.webviewsToRestore.has(viewType)) {
            this.restoreWebview(this.webviewsToRestore.get(viewType));
        }
    }
    unregisterWebviewReviver(viewType) {
        this.webviewRevivers.delete(viewType);
    }
    async preserveWebviews() {
        for (const webview of this.widgets.getWidgets(webview_1.WebviewWidget.FACTORY_ID)) {
            this.preserveWebview(webview);
        }
        for (const webview of this.widgets.getWidgets(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID)) {
            webview.modelRef.dispose();
            if (webview['closeWithoutSaving']) {
                delete webview['closeWithoutSaving'];
            }
            this.customEditorRegistry.resolveWidget(webview);
        }
    }
    preserveWebview(webview) {
        if (!this.webviewsToRestore.has(webview.viewType)) {
            this.activateByEvent(`onWebviewPanel:${webview.viewType}`);
            this.webviewsToRestore.set(webview.viewType, webview);
            webview.disposed.connect(() => this.webviewsToRestore.delete(webview.viewType));
        }
    }
    async restoreWebview(webview) {
        const restore = this.webviewRevivers.get(webview.viewType);
        if (restore) {
            try {
                await restore(webview);
            }
            catch (e) {
                webview.setHTML(this.getDeserializationFailedContents(`
                An error occurred while restoring '${webview.viewType}' view. Please check logs.
                `));
                console.error('Failed to restore the webview', e);
            }
        }
    }
    getDeserializationFailedContents(message) {
        return `<!DOCTYPE html>
        <html>
            <head>
                <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
            </head>
            <body>${message}</body>
        </html>`;
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.HostedPluginServer),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "server", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_watcher_1.HostedPluginWatcher),
    __metadata("design:type", hosted_plugin_watcher_1.HostedPluginWatcher)
], HostedPluginSupport.prototype, "watcher", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_contribution_handler_1.PluginContributionHandler),
    __metadata("design:type", plugin_contribution_handler_1.PluginContributionHandler)
], HostedPluginSupport.prototype, "contributionHandler", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(plugin_ext_api_contribution_1.MainPluginApiProvider),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "mainPluginApiProviders", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginServer),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "pluginServer", void 0);
__decorate([
    (0, inversify_1.inject)(preferences_1.PreferenceProviderProvider),
    __metadata("design:type", Function)
], HostedPluginSupport.prototype, "preferenceProviderProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preferences_1.PreferenceServiceImpl),
    __metadata("design:type", preferences_1.PreferenceServiceImpl)
], HostedPluginSupport.prototype, "preferenceServiceImpl", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_paths_protocol_1.PluginPathsService),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "pluginPathsService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], HostedPluginSupport.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.NotebookService),
    __metadata("design:type", browser_2.NotebookService)
], HostedPluginSupport.prototype, "notebookService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], HostedPluginSupport.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], HostedPluginSupport.prototype, "debugSessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_configuration_manager_1.DebugConfigurationManager),
    __metadata("design:type", debug_configuration_manager_1.DebugConfigurationManager)
], HostedPluginSupport.prototype, "debugConfigurationManager", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], HostedPluginSupport.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(file_search_service_1.FileSearchService),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "fileSearchService", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], HostedPluginSupport.prototype, "appState", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.NotebookTypeRegistry),
    __metadata("design:type", browser_2.NotebookTypeRegistry)
], HostedPluginSupport.prototype, "notebookTypeRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_view_registry_1.PluginViewRegistry),
    __metadata("design:type", plugin_view_registry_1.PluginViewRegistry)
], HostedPluginSupport.prototype, "viewRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_contribution_1.TaskProviderRegistry),
    __metadata("design:type", task_contribution_1.TaskProviderRegistry)
], HostedPluginSupport.prototype, "taskProviderRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_contribution_1.TaskResolverRegistry),
    __metadata("design:type", task_contribution_1.TaskResolverRegistry)
], HostedPluginSupport.prototype, "taskResolverRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], HostedPluginSupport.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ProgressService),
    __metadata("design:type", core_1.ProgressService)
], HostedPluginSupport.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(webview_environment_1.WebviewEnvironment),
    __metadata("design:type", webview_environment_1.WebviewEnvironment)
], HostedPluginSupport.prototype, "webviewEnvironment", void 0);
__decorate([
    (0, inversify_1.inject)(widget_manager_1.WidgetManager),
    __metadata("design:type", widget_manager_1.WidgetManager)
], HostedPluginSupport.prototype, "widgets", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "envServer", void 0);
__decorate([
    (0, inversify_1.inject)(json_schema_store_1.JsonSchemaStore),
    __metadata("design:type", json_schema_store_1.JsonSchemaStore)
], HostedPluginSupport.prototype, "jsonSchemaStore", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_custom_editor_registry_1.PluginCustomEditorRegistry),
    __metadata("design:type", plugin_custom_editor_registry_1.PluginCustomEditorRegistry)
], HostedPluginSupport.prototype, "customEditorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Stopwatch),
    __metadata("design:type", common_1.Stopwatch)
], HostedPluginSupport.prototype, "stopwatch", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostedPluginSupport.prototype, "init", null);
HostedPluginSupport = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginSupport);
exports.HostedPluginSupport = HostedPluginSupport;
class PluginContributions extends core_1.DisposableCollection {
    constructor(plugin) {
        super();
        this.plugin = plugin;
        this.state = PluginContributions.State.INITIALIZING;
    }
}
exports.PluginContributions = PluginContributions;
(function (PluginContributions) {
    let State;
    (function (State) {
        State[State["INITIALIZING"] = 0] = "INITIALIZING";
        State[State["LOADING"] = 1] = "LOADING";
        State[State["LOADED"] = 2] = "LOADED";
        State[State["STARTING"] = 3] = "STARTING";
        State[State["STARTED"] = 4] = "STARTED";
    })(State = PluginContributions.State || (PluginContributions.State = {}));
})(PluginContributions = exports.PluginContributions || (exports.PluginContributions = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/hosted/browser/hosted-plugin'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/hosted/browser/plugin-worker.js":
/*!*********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/hosted/browser/plugin-worker.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.PluginWorker = void 0;
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
const channel_1 = __webpack_require__(/*! @theia/core/lib/common/message-rpc/channel */ "../../packages/core/lib/common/message-rpc/channel.js");
const uint8_array_message_buffer_1 = __webpack_require__(/*! @theia/core/lib/common/message-rpc/uint8-array-message-buffer */ "../../packages/core/lib/common/message-rpc/uint8-array-message-buffer.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const rpc_protocol_1 = __webpack_require__(/*! ../../common/rpc-protocol */ "../../packages/plugin-ext/lib/common/rpc-protocol.js");
let PluginWorker = class PluginWorker {
    constructor() {
        this.worker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("packages_plugin-ext_lib_hosted_browser_worker_worker-main_js"), __webpack_require__.b));
        const channel = new channel_1.BasicChannel(() => {
            const writer = new uint8_array_message_buffer_1.Uint8ArrayWriteBuffer();
            writer.onCommit(buffer => {
                this.worker.postMessage(buffer);
            });
            return writer;
        });
        this.rpc = new rpc_protocol_1.RPCProtocolImpl(channel);
        // eslint-disable-next-line arrow-body-style
        this.worker.onmessage = buffer => channel.onMessageEmitter.fire(() => {
            return new uint8_array_message_buffer_1.Uint8ArrayReadBuffer(buffer.data);
        });
        this.worker.onerror = e => channel.onErrorEmitter.fire(e);
    }
};
PluginWorker = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginWorker);
exports.PluginWorker = PluginWorker;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/hosted/browser/plugin-worker'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/authentication-main.js":
/*!*************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/authentication-main.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.AuthenticationProviderImpl = exports.AuthenticationMainImpl = exports.getAuthenticationProviderActivationEvent = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const authentication_service_1 = __webpack_require__(/*! @theia/core/lib/browser/authentication-service */ "../../packages/core/lib/browser/authentication-service.js");
const quick_pick_service_1 = __webpack_require__(/*! @theia/core/lib/common/quick-pick-service */ "../../packages/core/lib/common/quick-pick-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
function getAuthenticationProviderActivationEvent(id) { return `onAuthenticationRequest:${id}`; }
exports.getAuthenticationProviderActivationEvent = getAuthenticationProviderActivationEvent;
class AuthenticationMainImpl {
    constructor(rpc, container) {
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.AUTHENTICATION_EXT);
        this.messageService = container.get(message_service_1.MessageService);
        this.storageService = container.get(browser_1.StorageService);
        this.authenticationService = container.get(authentication_service_1.AuthenticationService);
        this.quickPickService = container.get(quick_pick_service_1.QuickPickService);
        this.authenticationService.onDidChangeSessions(e => {
            this.proxy.$onDidChangeAuthenticationSessions({ id: e.providerId, label: e.label });
        });
    }
    async $registerAuthenticationProvider(id, label, supportsMultipleAccounts) {
        const provider = new AuthenticationProviderImpl(this.proxy, id, label, supportsMultipleAccounts, this.storageService, this.messageService);
        this.authenticationService.registerAuthenticationProvider(id, provider);
    }
    async $unregisterAuthenticationProvider(id) {
        this.authenticationService.unregisterAuthenticationProvider(id);
    }
    async $updateSessions(id, event) {
        this.authenticationService.updateSessions(id, event);
    }
    $logout(providerId, sessionId) {
        return this.authenticationService.logout(providerId, sessionId);
    }
    async requestNewSession(providerId, scopes, extensionId, extensionName) {
        return this.authenticationService.requestNewSession(providerId, scopes, extensionId, extensionName);
    }
    async $getSession(providerId, scopes, extensionId, extensionName, options) {
        const sessions = await this.authenticationService.getSessions(providerId, scopes);
        // Error cases
        if (options.forceNewSession && !sessions.length) {
            throw new Error('No existing sessions found.');
        }
        if (options.forceNewSession && options.createIfNone) {
            throw new Error('Invalid combination of options. Please remove one of the following: forceNewSession, createIfNone');
        }
        if (options.forceNewSession && options.silent) {
            throw new Error('Invalid combination of options. Please remove one of the following: forceNewSession, silent');
        }
        if (options.createIfNone && options.silent) {
            throw new Error('Invalid combination of options. Please remove one of the following: createIfNone, silent');
        }
        const supportsMultipleAccounts = this.authenticationService.supportsMultipleAccounts(providerId);
        // Check if the sessions we have are valid
        if (!options.forceNewSession && sessions.length) {
            if (supportsMultipleAccounts) {
                if (options.clearSessionPreference) {
                    await this.storageService.setData(`authentication-session-${extensionName}-${providerId}`, undefined);
                }
                else {
                    const existingSessionPreference = await this.storageService.getData(`authentication-session-${extensionName}-${providerId}`);
                    if (existingSessionPreference) {
                        const matchingSession = sessions.find(session => session.id === existingSessionPreference);
                        if (matchingSession && await this.isAccessAllowed(providerId, matchingSession.account.label, extensionId)) {
                            return matchingSession;
                        }
                    }
                }
            }
            else if (await this.isAccessAllowed(providerId, sessions[0].account.label, extensionId)) {
                return sessions[0];
            }
        }
        // We may need to prompt because we don't have a valid session modal flows
        if (options.createIfNone || options.forceNewSession) {
            const providerName = this.authenticationService.getLabel(providerId);
            const detail = isAuthenticationForceNewSessionOptions(options.forceNewSession) ? options.forceNewSession.detail : undefined;
            const isAllowed = await this.loginPrompt(providerName, extensionName, !!options.forceNewSession, detail);
            if (!isAllowed) {
                throw new Error('User did not consent to login.');
            }
            const session = (sessions === null || sessions === void 0 ? void 0 : sessions.length) && !options.forceNewSession && supportsMultipleAccounts
                ? await this.selectSession(providerId, providerName, extensionId, extensionName, sessions, scopes, !!options.clearSessionPreference)
                : await this.authenticationService.login(providerId, scopes);
            await this.setTrustedExtensionAndAccountPreference(providerId, session.account.label, extensionId, extensionName, session.id);
            return session;
        }
        // passive flows (silent or default)
        const validSession = sessions.find(s => this.isAccessAllowed(providerId, s.account.label, extensionId));
        if (!options.silent && !validSession) {
            this.authenticationService.requestNewSession(providerId, scopes, extensionId, extensionName);
        }
        return validSession;
    }
    async selectSession(providerId, providerName, extensionId, extensionName, potentialSessions, scopes, clearSessionPreference) {
        if (!potentialSessions.length) {
            throw new Error('No potential sessions found');
        }
        return new Promise(async (resolve, reject) => {
            var _a, _b;
            const items = potentialSessions.map(session => ({
                label: session.account.label,
                value: { session }
            }));
            items.push({
                label: nls_1.nls.localizeByDefault('Sign in to another account'),
                value: { session: undefined }
            });
            const selected = await this.quickPickService.show(items, {
                title: nls_1.nls.localizeByDefault("The extension '{0}' wants to access a {1} account", extensionName, providerName),
                ignoreFocusOut: true
            });
            if (selected) {
                const session = (_b = (_a = selected.value) === null || _a === void 0 ? void 0 : _a.session) !== null && _b !== void 0 ? _b : await this.authenticationService.login(providerId, scopes);
                const accountName = session.account.label;
                const allowList = await (0, authentication_service_1.readAllowedExtensions)(this.storageService, providerId, accountName);
                if (!allowList.find(allowed => allowed.id === extensionId)) {
                    allowList.push({ id: extensionId, name: extensionName });
                    this.storageService.setData(`authentication-trusted-extensions-${providerId}-${accountName}`, JSON.stringify(allowList));
                }
                this.storageService.setData(`authentication-session-${extensionName}-${providerId}`, session.id);
                resolve(session);
            }
            else {
                reject('User did not consent to account access');
            }
        });
    }
    async getSessionsPrompt(providerId, accountName, providerName, extensionId, extensionName) {
        const allowList = await (0, authentication_service_1.readAllowedExtensions)(this.storageService, providerId, accountName);
        const extensionData = allowList.find(extension => extension.id === extensionId);
        if (extensionData) {
            addAccountUsage(this.storageService, providerId, accountName, extensionId, extensionName);
            return true;
        }
        const choice = await this.messageService.info(`The extension '${extensionName}' wants to access the ${providerName} account '${accountName}'.`, 'Allow', 'Cancel');
        const allow = choice === 'Allow';
        if (allow) {
            await addAccountUsage(this.storageService, providerId, accountName, extensionId, extensionName);
            allowList.push({ id: extensionId, name: extensionName });
            this.storageService.setData(`authentication-trusted-extensions-${providerId}-${accountName}`, JSON.stringify(allowList));
        }
        return allow;
    }
    async loginPrompt(providerName, extensionName, recreatingSession, detail) {
        const msg = document.createElement('span');
        msg.textContent = recreatingSession
            ? nls_1.nls.localizeByDefault("The extension '{0}' wants you to sign in again using {1}.", extensionName, providerName)
            : nls_1.nls.localizeByDefault("The extension '{0}' wants to sign in using {1}.", extensionName, providerName);
        if (detail) {
            const detailElement = document.createElement('p');
            detailElement.textContent = detail;
            msg.appendChild(detailElement);
        }
        return !!await new browser_1.ConfirmDialog({
            title: nls_1.nls.localize('theia/plugin-ext/authentication-main/loginTitle', 'Login'),
            msg,
            ok: nls_1.nls.localizeByDefault('Allow'),
            cancel: browser_1.Dialog.CANCEL
        }).open();
    }
    async isAccessAllowed(providerId, accountName, extensionId) {
        const allowList = await (0, authentication_service_1.readAllowedExtensions)(this.storageService, providerId, accountName);
        return !!allowList.find(allowed => allowed.id === extensionId);
    }
    async setTrustedExtensionAndAccountPreference(providerId, accountName, extensionId, extensionName, sessionId) {
        const allowList = await (0, authentication_service_1.readAllowedExtensions)(this.storageService, providerId, accountName);
        if (!allowList.find(allowed => allowed.id === extensionId)) {
            allowList.push({ id: extensionId, name: extensionName });
            this.storageService.setData(`authentication-trusted-extensions-${providerId}-${accountName}`, JSON.stringify(allowList));
        }
        this.storageService.setData(`authentication-session-${extensionName}-${providerId}`, sessionId);
    }
    $onDidChangeSessions(providerId, event) {
        this.authenticationService.updateSessions(providerId, event);
    }
}
exports.AuthenticationMainImpl = AuthenticationMainImpl;
function isAuthenticationForceNewSessionOptions(arg) {
    return (0, core_1.isObject)(arg) && typeof arg.detail === 'string';
}
async function addAccountUsage(storageService, providerId, accountName, extensionId, extensionName) {
    const accountKey = `authentication-${providerId}-${accountName}-usages`;
    const usages = await readAccountUsages(storageService, providerId, accountName);
    const existingUsageIndex = usages.findIndex(usage => usage.extensionId === extensionId);
    if (existingUsageIndex > -1) {
        usages.splice(existingUsageIndex, 1, {
            extensionId,
            extensionName,
            lastUsed: Date.now()
        });
    }
    else {
        usages.push({
            extensionId,
            extensionName,
            lastUsed: Date.now()
        });
    }
    await storageService.setData(accountKey, JSON.stringify(usages));
}
class AuthenticationProviderImpl {
    constructor(proxy, id, label, supportsMultipleAccounts, storageService, messageService) {
        this.proxy = proxy;
        this.id = id;
        this.label = label;
        this.supportsMultipleAccounts = supportsMultipleAccounts;
        this.storageService = storageService;
        this.messageService = messageService;
        /** map from account name to session ids */
        this.accounts = new Map();
        /** map from session id to account name */
        this.sessions = new Map();
    }
    hasSessions() {
        return !!this.sessions.size;
    }
    registerSession(session) {
        this.sessions.set(session.id, session.account.label);
        const existingSessionsForAccount = this.accounts.get(session.account.label);
        if (existingSessionsForAccount) {
            this.accounts.set(session.account.label, existingSessionsForAccount.concat(session.id));
            return;
        }
        else {
            this.accounts.set(session.account.label, [session.id]);
        }
    }
    async signOut(accountName) {
        const accountUsages = await readAccountUsages(this.storageService, this.id, accountName);
        const sessionsForAccount = this.accounts.get(accountName);
        const result = await this.messageService.info(accountUsages.length
            ? nls_1.nls.localizeByDefault("The account '{0}' has been used by: \n\n{1}\n\n Sign out from these extensions?", accountName, accountUsages.map(usage => usage.extensionName).join(', '))
            : nls_1.nls.localizeByDefault("Sign out of '{0}'?", accountName), nls_1.nls.localizeByDefault('Sign Out'), browser_1.Dialog.CANCEL);
        if (result && result === nls_1.nls.localizeByDefault('Sign Out') && sessionsForAccount) {
            sessionsForAccount.forEach(sessionId => this.removeSession(sessionId));
            removeAccountUsage(this.storageService, this.id, accountName);
        }
    }
    async getSessions(scopes) {
        return this.proxy.$getSessions(this.id, scopes);
    }
    async updateSessionItems(event) {
        const { added, removed } = event;
        const session = await this.proxy.$getSessions(this.id);
        const addedSessions = added ? session.filter(s => added.some(addedSession => addedSession.id === s.id)) : [];
        removed === null || removed === void 0 ? void 0 : removed.forEach(removedSession => {
            const sessionId = removedSession.id;
            if (sessionId) {
                const accountName = this.sessions.get(sessionId);
                if (accountName) {
                    this.sessions.delete(sessionId);
                    const sessionsForAccount = this.accounts.get(accountName) || [];
                    const sessionIndex = sessionsForAccount.indexOf(sessionId);
                    sessionsForAccount.splice(sessionIndex);
                    if (!sessionsForAccount.length) {
                        this.accounts.delete(accountName);
                    }
                }
            }
        });
        addedSessions.forEach(s => this.registerSession(s));
    }
    async login(scopes) {
        return this.createSession(scopes);
    }
    async logout(sessionId) {
        return this.removeSession(sessionId);
    }
    createSession(scopes) {
        return this.proxy.$createSession(this.id, scopes);
    }
    removeSession(sessionId) {
        return this.proxy.$removeSession(this.id, sessionId)
            .then(() => { this.messageService.info('Successfully signed out.'); });
    }
}
exports.AuthenticationProviderImpl = AuthenticationProviderImpl;
async function readAccountUsages(storageService, providerId, accountName) {
    const accountKey = `authentication-${providerId}-${accountName}-usages`;
    const storedUsages = await storageService.getData(accountKey);
    let usages = [];
    if (storedUsages) {
        try {
            usages = JSON.parse(storedUsages);
        }
        catch (e) {
            console.log(e);
        }
    }
    return usages;
}
function removeAccountUsage(storageService, providerId, accountName) {
    const accountKey = `authentication-${providerId}-${accountName}-usages`;
    storageService.setData(accountKey, undefined);
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/authentication-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/clipboard-main.js":
/*!********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/clipboard-main.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 RedHat and others.
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
exports.ClipboardMainImpl = void 0;
const clipboard_service_1 = __webpack_require__(/*! @theia/core/lib/browser/clipboard-service */ "../../packages/core/lib/browser/clipboard-service.js");
class ClipboardMainImpl {
    constructor(container) {
        this.clipboardService = container.get(clipboard_service_1.ClipboardService);
    }
    async $readText() {
        const result = await this.clipboardService.readText();
        return result;
    }
    async $writeText(value) {
        await this.clipboardService.writeText(value);
    }
}
exports.ClipboardMainImpl = ClipboardMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/clipboard-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/command-registry-main.js":
/*!***************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/command-registry-main.js ***!
  \***************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommandRegistryMainImpl = void 0;
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const plugin_contribution_handler_1 = __webpack_require__(/*! ./plugin-contribution-handler */ "../../packages/plugin-ext/lib/main/browser/plugin-contribution-handler.js");
class CommandRegistryMainImpl {
    constructor(rpc, container) {
        this.commands = new Map();
        this.handlers = new Map();
        this.toDispose = new disposable_1.DisposableCollection();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.COMMAND_REGISTRY_EXT);
        this.delegate = container.get(command_1.CommandRegistry);
        this.keyBinding = container.get(browser_1.KeybindingRegistry);
        this.contributions = container.get(plugin_contribution_handler_1.PluginContributionHandler);
    }
    dispose() {
        this.toDispose.dispose();
    }
    $registerCommand(command) {
        const id = command.id;
        this.commands.set(id, this.contributions.registerCommand(command));
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregisterCommand(id)));
    }
    $unregisterCommand(id) {
        const command = this.commands.get(id);
        if (command) {
            command.dispose();
            this.commands.delete(id);
        }
    }
    $registerHandler(id) {
        this.handlers.set(id, this.contributions.registerCommandHandler(id, (...args) => this.proxy.$executeCommand(id, ...args)));
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregisterHandler(id)));
    }
    $unregisterHandler(id) {
        const handler = this.handlers.get(id);
        if (handler) {
            handler.dispose();
            this.handlers.delete(id);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $executeCommand(id, ...args) {
        if (!this.delegate.getCommand(id)) {
            throw new Error(`Command with id '${id}' is not registered.`);
        }
        try {
            return await this.delegate.executeCommand(id, ...args);
        }
        catch (e) {
            // Command handler may be not active at the moment so the error must be caught. See https://github.com/eclipse-theia/theia/pull/6687#discussion_r354810079
            if ('code' in e && e['code'] === 'NO_ACTIVE_HANDLER') {
                return;
            }
            else {
                throw e;
            }
        }
    }
    $getKeyBinding(commandId) {
        try {
            const keyBindings = this.keyBinding.getKeybindingsForCommand(commandId);
            if (keyBindings) {
                // transform inner type to CommandKeyBinding
                return Promise.resolve(keyBindings.map(keyBinding => ({ id: commandId, value: keyBinding.keybinding })));
            }
            else {
                return Promise.resolve(undefined);
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    $getCommands() {
        return Promise.resolve(this.delegate.commandIds);
    }
}
exports.CommandRegistryMainImpl = CommandRegistryMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/command-registry-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/comments/comments-context-key-service.js":
/*!*******************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/comments/comments-context-key-service.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.CommentsContextKeyService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
let CommentsContextKeyService = class CommentsContextKeyService {
    constructor() {
        this.contextKeys = new Set();
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    get commentController() {
        return this._commentController;
    }
    get comment() {
        return this._comment;
    }
    get commentIsEmpty() {
        return this._commentIsEmpty;
    }
    init() {
        this.contextKeys.add('commentIsEmpty');
        this._commentController = this.contextKeyService.createKey('commentController', undefined);
        this._comment = this.contextKeyService.createKey('comment', undefined);
        this._commentIsEmpty = this.contextKeyService.createKey('commentIsEmpty', true);
        this.contextKeyService.onDidChange(event => {
            if (event.affects(this.contextKeys)) {
                this.onDidChangeEmitter.fire();
            }
        });
    }
    setExpression(expression) {
        var _a;
        (_a = this.contextKeyService.parseKeys(expression)) === null || _a === void 0 ? void 0 : _a.forEach(key => {
            this.contextKeys.add(key);
        });
    }
    match(expression) {
        return !expression || this.contextKeyService.match(expression);
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], CommentsContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommentsContextKeyService.prototype, "init", null);
CommentsContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], CommentsContextKeyService);
exports.CommentsContextKeyService = CommentsContextKeyService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/comments/comments-context-key-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/comments/comments-contribution.js":
/*!************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/comments/comments-contribution.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.CommentsContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const comments_decorator_1 = __webpack_require__(/*! ./comments-decorator */ "../../packages/plugin-ext/lib/main/browser/comments/comments-decorator.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_diff_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-diff-editor */ "../../packages/monaco/lib/browser/monaco-diff-editor.js");
const comment_thread_widget_1 = __webpack_require__(/*! ./comment-thread-widget */ "../../packages/plugin-ext/lib/main/browser/comments/comment-thread-widget.js");
const comments_service_1 = __webpack_require__(/*! ./comments-service */ "../../packages/plugin-ext/lib/main/browser/comments/comments-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const comments_context_key_service_1 = __webpack_require__(/*! ./comments-context-key-service */ "../../packages/plugin-ext/lib/main/browser/comments/comments-context-key-service.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/contrib/comments/browser/comments.contribution.ts
let CommentsContribution = class CommentsContribution {
    constructor(rangeDecorator, commentService, editorManager) {
        this.rangeDecorator = rangeDecorator;
        this.commentService = commentService;
        this.editorManager = editorManager;
        this.emptyThreadsToAddQueue = [];
        this.commentWidgets = [];
        this.commentInfos = [];
        this.commentService.onDidSetResourceCommentInfos(e => {
            const editor = this.getCurrentEditor();
            const editorURI = editor && editor.editor instanceof monaco_diff_editor_1.MonacoDiffEditor && editor.editor.diffEditor.getModifiedEditor().getModel();
            if (editorURI && editorURI.toString() === e.resource.toString()) {
                this.setComments(e.commentInfos.filter(commentInfo => commentInfo !== null));
            }
        });
        this.editorManager.onCreated(async (widget) => {
            const disposables = new common_1.DisposableCollection();
            const editor = widget.editor;
            if (editor instanceof monaco_diff_editor_1.MonacoDiffEditor) {
                const originalEditorModel = editor.diffEditor.getOriginalEditor().getModel();
                if (originalEditorModel) {
                    const originalComments = await this.commentService.getComments(originalEditorModel.uri);
                    if (originalComments) {
                        this.rangeDecorator.update(editor.diffEditor.getOriginalEditor(), originalComments.filter(c => !!c));
                    }
                }
                const modifiedEditorModel = editor.diffEditor.getModifiedEditor().getModel();
                if (modifiedEditorModel) {
                    const modifiedComments = await this.commentService.getComments(modifiedEditorModel.uri);
                    if (modifiedComments) {
                        this.rangeDecorator.update(editor.diffEditor.getModifiedEditor(), modifiedComments.filter(c => !!c));
                    }
                }
                disposables.push(editor.onMouseDown(e => this.onEditorMouseDown(e)));
                disposables.push(this.commentService.onDidUpdateCommentThreads(async (e) => {
                    const editorURI = editor.document.uri;
                    const commentInfo = this.commentInfos.filter(info => info.owner === e.owner);
                    if (!commentInfo || !commentInfo.length) {
                        return;
                    }
                    const added = e.added.filter(thread => thread.resource && thread.resource.toString() === editorURI.toString());
                    const removed = e.removed.filter(thread => thread.resource && thread.resource.toString() === editorURI.toString());
                    const changed = e.changed.filter(thread => thread.resource && thread.resource.toString() === editorURI.toString());
                    removed.forEach(thread => {
                        const matchedZones = this.commentWidgets.filter(zoneWidget => zoneWidget.owner === e.owner
                            && zoneWidget.commentThread.threadId === thread.threadId && zoneWidget.commentThread.threadId !== '');
                        if (matchedZones.length) {
                            const matchedZone = matchedZones[0];
                            const index = this.commentWidgets.indexOf(matchedZone);
                            this.commentWidgets.splice(index, 1);
                            matchedZone.dispose();
                        }
                    });
                    changed.forEach(thread => {
                        const matchedZones = this.commentWidgets.filter(zoneWidget => zoneWidget.owner === e.owner
                            && zoneWidget.commentThread.threadId === thread.threadId);
                        if (matchedZones.length) {
                            const matchedZone = matchedZones[0];
                            matchedZone.update();
                        }
                    });
                    added.forEach(thread => {
                        this.displayCommentThread(e.owner, thread);
                        this.commentInfos.filter(info => info.owner === e.owner)[0].threads.push(thread);
                    });
                }));
                editor.onDispose(() => {
                    disposables.dispose();
                });
                this.beginCompute();
            }
        });
    }
    onEditorMouseDown(e) {
        let mouseDownInfo = null;
        const range = e.target.range;
        if (!range) {
            return;
        }
        if (e.target.type !== monaco.editor.MouseTargetType.GUTTER_LINE_DECORATIONS) {
            return;
        }
        const data = e.target.detail;
        const gutterOffsetX = data.offsetX - data.glyphMarginWidth - data.lineNumbersWidth - data.glyphMarginLeft;
        // don't collide with folding and git decorations
        if (gutterOffsetX > 14) {
            return;
        }
        mouseDownInfo = { lineNumber: range.start };
        const { lineNumber } = mouseDownInfo;
        mouseDownInfo = null;
        if (!range || range.start !== lineNumber) {
            return;
        }
        if (!e.target.element) {
            return;
        }
        if (e.target.element.className.indexOf('comment-diff-added') >= 0) {
            this.addOrToggleCommentAtLine(e.target.position.line + 1, e);
        }
    }
    async beginCompute() {
        const editorModel = this.editor && this.editor.getModel();
        const editorURI = this.editor && editorModel && editorModel.uri;
        if (editorURI) {
            const comments = await this.commentService.getComments(editorURI);
            this.setComments(comments.filter(c => !!c));
        }
    }
    setComments(commentInfos) {
        if (!this.editor) {
            return;
        }
        this.commentInfos = commentInfos;
    }
    get editor() {
        const editor = this.getCurrentEditor();
        if (editor && editor.editor instanceof monaco_diff_editor_1.MonacoDiffEditor) {
            return editor.editor.diffEditor.getModifiedEditor();
        }
    }
    displayCommentThread(owner, thread) {
        const editor = this.editor;
        if (editor) {
            const provider = this.commentService.getCommentController(owner);
            if (provider) {
                this.commentsContextKeyService.commentController.set(provider.id);
            }
            const zoneWidget = new comment_thread_widget_1.CommentThreadWidget(editor, owner, thread, this.commentService, this.menus, this.commentsContextKeyService, this.commands);
            zoneWidget.display({ afterLineNumber: thread.range.startLineNumber, heightInLines: 5 });
            const currentEditor = this.getCurrentEditor();
            if (currentEditor) {
                currentEditor.onDispose(() => zoneWidget.dispose());
            }
            this.commentWidgets.push(zoneWidget);
        }
    }
    async addOrToggleCommentAtLine(lineNumber, e) {
        // If an add is already in progress, queue the next add and process it after the current one finishes to
        // prevent empty comment threads from being added to the same line.
        if (!this.addInProgress) {
            this.addInProgress = true;
            // The widget's position is undefined until the widget has been displayed, so rely on the glyph position instead
            const existingCommentsAtLine = this.commentWidgets.filter(widget => widget.getGlyphPosition() === lineNumber);
            if (existingCommentsAtLine.length) {
                existingCommentsAtLine.forEach(widget => widget.toggleExpand(lineNumber));
                this.processNextThreadToAdd();
                return;
            }
            else {
                this.addCommentAtLine(lineNumber, e);
            }
        }
        else {
            this.emptyThreadsToAddQueue.push([lineNumber, e]);
        }
    }
    processNextThreadToAdd() {
        this.addInProgress = false;
        const info = this.emptyThreadsToAddQueue.shift();
        if (info) {
            this.addOrToggleCommentAtLine(info[0], info[1]);
        }
    }
    getCurrentEditor() {
        return this.editorManager.currentEditor;
    }
    addCommentAtLine(lineNumber, e) {
        const newCommentInfos = this.rangeDecorator.getMatchedCommentAction(lineNumber);
        const editor = this.getCurrentEditor();
        if (!editor) {
            return Promise.resolve();
        }
        if (!newCommentInfos.length) {
            return Promise.resolve();
        }
        const { ownerId } = newCommentInfos[0];
        this.addCommentAtLine2(lineNumber, ownerId);
        return Promise.resolve();
    }
    addCommentAtLine2(lineNumber, ownerId) {
        const editorModel = this.editor && this.editor.getModel();
        const editorURI = this.editor && editorModel && editorModel.uri;
        if (editorURI) {
            this.commentService.createCommentThreadTemplate(ownerId, vscode_uri_1.URI.parse(editorURI.toString()), {
                startLineNumber: lineNumber,
                endLineNumber: lineNumber,
                startColumn: 1,
                endColumn: 1
            });
            this.processNextThreadToAdd();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], CommentsContribution.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(comments_context_key_service_1.CommentsContextKeyService),
    __metadata("design:type", comments_context_key_service_1.CommentsContextKeyService)
], CommentsContribution.prototype, "commentsContextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], CommentsContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], CommentsContribution.prototype, "commands", void 0);
CommentsContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_decorator_1.CommentingRangeDecorator)),
    __param(1, (0, inversify_1.inject)(comments_service_1.CommentsService)),
    __param(2, (0, inversify_1.inject)(browser_1.EditorManager)),
    __metadata("design:paramtypes", [comments_decorator_1.CommentingRangeDecorator, Object, browser_1.EditorManager])
], CommentsContribution);
exports.CommentsContribution = CommentsContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/comments/comments-contribution'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/comments/comments-decorator.js":
/*!*********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/comments/comments-decorator.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.CommentingRangeDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let CommentingRangeDecorator = class CommentingRangeDecorator {
    constructor() {
        this.commentingRangeDecorations = [];
        this.decorationOptions = {
            isWholeLine: true,
            linesDecorationsClassName: 'comment-range-glyph comment-diff-added'
        };
    }
    update(editor, commentInfos) {
        const model = editor.getModel();
        if (!model) {
            return;
        }
        const commentingRangeDecorations = [];
        for (const info of commentInfos) {
            info.commentingRanges.ranges.forEach(range => {
                commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.owner, info.extensionId, info.label, range, this.decorationOptions, info.commentingRanges));
            });
        }
        const oldDecorations = this.commentingRangeDecorations.map(decoration => decoration.id);
        editor.deltaDecorations(oldDecorations, []);
        this.commentingRangeDecorations = commentingRangeDecorations;
    }
    getMatchedCommentAction(line) {
        const result = [];
        for (const decoration of this.commentingRangeDecorations) {
            const range = decoration.getActiveRange();
            if (range && range.startLineNumber <= line && line <= range.endLineNumber) {
                result.push(decoration.getCommentAction());
            }
        }
        return result;
    }
};
CommentingRangeDecorator = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CommentingRangeDecorator);
exports.CommentingRangeDecorator = CommentingRangeDecorator;
class CommentingRangeDecoration {
    constructor(_editor, _ownerId, _extensionId, _label, _range, commentingOptions, commentingRangesInfo) {
        this._editor = _editor;
        this._ownerId = _ownerId;
        this._extensionId = _extensionId;
        this._label = _label;
        this._range = _range;
        this.commentingRangesInfo = commentingRangesInfo;
        const startLineNumber = _range.startLineNumber;
        const endLineNumber = _range.endLineNumber;
        const commentingRangeDecorations = [{
                range: {
                    startLineNumber: startLineNumber, startColumn: 1,
                    endLineNumber: endLineNumber, endColumn: 1
                },
                options: commentingOptions
            }];
        this.decorationId = this._editor.deltaDecorations([], commentingRangeDecorations)[0];
    }
    get id() {
        return this.decorationId;
    }
    getCommentAction() {
        return {
            extensionId: this._extensionId,
            label: this._label,
            ownerId: this._ownerId,
            commentingRangesInfo: this.commentingRangesInfo
        };
    }
    getOriginalRange() {
        return this._range;
    }
    getActiveRange() {
        const range = this._editor.getModel().getDecorationRange(this.decorationId);
        if (range) {
            return range;
        }
    }
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/comments/comments-decorator'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/comments/comments-main.js":
/*!****************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/comments/comments-main.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.CommentsMainImp = exports.CommentController = exports.CommentThreadImpl = void 0;
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const comments_service_1 = __webpack_require__(/*! ./comments-service */ "../../packages/plugin-ext/lib/main/browser/comments/comments-service.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const uuid_1 = __webpack_require__(/*! uuid */ "../../node_modules/uuid/dist/esm-browser/index.js");
const comments_contribution_1 = __webpack_require__(/*! ./comments-contribution */ "../../packages/plugin-ext/lib/main/browser/comments/comments-contribution.js");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/api/browser/mainThreadComments.ts
class CommentThreadImpl {
    constructor(commentThreadHandle, controllerHandle, extensionId, threadId, resource, _range) {
        this.commentThreadHandle = commentThreadHandle;
        this.controllerHandle = controllerHandle;
        this.extensionId = extensionId;
        this.threadId = threadId;
        this.resource = resource;
        this._range = _range;
        this.onDidChangeInputEmitter = new event_1.Emitter();
        this.onDidChangeLabelEmitter = new event_1.Emitter();
        this.onDidChangeLabel = this.onDidChangeLabelEmitter.event;
        this.onDidChangeCommentsEmitter = new event_1.Emitter();
        this.onDidChangeRangeEmitter = new event_1.Emitter();
        this.onDidChangeRange = this.onDidChangeRangeEmitter.event;
        this.onDidChangeCollapsibleStateEmitter = new event_1.Emitter();
        this.onDidChangeCollapsibleState = this.onDidChangeCollapsibleStateEmitter.event;
        this.onDidChangeStateEmitter = new event_1.Emitter();
        this.onDidChangeState = this.onDidChangeStateEmitter.event;
        this.onDidChangeCanReplyEmitter = new event_1.Emitter();
        this.onDidChangeCanReply = this.onDidChangeCanReplyEmitter.event;
        this._canReply = true;
        this._isDisposed = false;
    }
    get input() {
        return this._input;
    }
    set input(value) {
        this._input = value;
        this.onDidChangeInputEmitter.fire(value);
    }
    get onDidChangeInput() { return this.onDidChangeInputEmitter.event; }
    get label() {
        return this._label;
    }
    set label(label) {
        this._label = label;
        this.onDidChangeLabelEmitter.fire(this._label);
    }
    get contextValue() {
        return this._contextValue;
    }
    set contextValue(context) {
        this._contextValue = context;
    }
    get comments() {
        return this._comments;
    }
    set comments(newComments) {
        this._comments = newComments;
        this.onDidChangeCommentsEmitter.fire(this._comments);
    }
    get onDidChangeComments() { return this.onDidChangeCommentsEmitter.event; }
    set range(range) {
        this._range = range;
        this.onDidChangeRangeEmitter.fire(this._range);
    }
    get range() {
        return this._range;
    }
    get collapsibleState() {
        return this._collapsibleState;
    }
    set collapsibleState(newState) {
        this._collapsibleState = newState;
        this.onDidChangeCollapsibleStateEmitter.fire(this._collapsibleState);
    }
    get state() {
        return this._state;
    }
    set state(newState) {
        if (this._state !== newState) {
            this._state = newState;
            this.onDidChangeStateEmitter.fire(this._state);
        }
    }
    get isDisposed() {
        return this._isDisposed;
    }
    get canReply() {
        return this._canReply;
    }
    set canReply(canReply) {
        this._canReply = canReply;
        this.onDidChangeCanReplyEmitter.fire(this._canReply);
    }
    batchUpdate(changes) {
        const modified = (value) => Object.prototype.hasOwnProperty.call(changes, value);
        if (modified('range')) {
            this._range = changes.range;
        }
        if (modified('label')) {
            this._label = changes.label;
        }
        if (modified('contextValue')) {
            this._contextValue = changes.contextValue;
        }
        if (modified('comments')) {
            this._comments = changes.comments;
        }
        if (modified('collapseState')) {
            this._collapsibleState = changes.collapseState;
        }
        if (modified('state')) {
            this._state = changes.state;
        }
        if (modified('canReply')) {
            this._canReply = changes.canReply;
        }
    }
    dispose() {
        this._isDisposed = true;
        this.onDidChangeCollapsibleStateEmitter.dispose();
        this.onDidChangeStateEmitter.dispose();
        this.onDidChangeCommentsEmitter.dispose();
        this.onDidChangeInputEmitter.dispose();
        this.onDidChangeLabelEmitter.dispose();
        this.onDidChangeRangeEmitter.dispose();
        this.onDidChangeCanReplyEmitter.dispose();
    }
}
exports.CommentThreadImpl = CommentThreadImpl;
class CommentController {
    constructor(_proxy, _commentService, _handle, _uniqueId, _id, _label, _features) {
        this._proxy = _proxy;
        this._commentService = _commentService;
        this._handle = _handle;
        this._uniqueId = _uniqueId;
        this._id = _id;
        this._label = _label;
        this._features = _features;
        this.threads = new Map();
    }
    get handle() {
        return this._handle;
    }
    get id() {
        return this._id;
    }
    get contextValue() {
        return this._id;
    }
    get proxy() {
        return this._proxy;
    }
    get label() {
        return this._label;
    }
    get options() {
        return this._features.options;
    }
    get features() {
        return this._features;
    }
    updateFeatures(features) {
        this._features = features;
    }
    createCommentThread(extensionId, commentThreadHandle, threadId, resource, range) {
        const thread = new CommentThreadImpl(commentThreadHandle, this.handle, extensionId, threadId, vscode_uri_1.URI.revive(resource).toString(), range);
        this.threads.set(commentThreadHandle, thread);
        this._commentService.updateComments(this._uniqueId, {
            added: [thread],
            removed: [],
            changed: []
        });
        return thread;
    }
    updateCommentThread(commentThreadHandle, threadId, resource, changes) {
        const thread = this.getKnownThread(commentThreadHandle);
        thread.batchUpdate(changes);
        this._commentService.updateComments(this._uniqueId, {
            added: [],
            removed: [],
            changed: [thread]
        });
    }
    deleteCommentThread(commentThreadHandle) {
        const thread = this.getKnownThread(commentThreadHandle);
        this.threads.delete(commentThreadHandle);
        this._commentService.updateComments(this._uniqueId, {
            added: [],
            removed: [thread],
            changed: []
        });
        thread.dispose();
    }
    deleteCommentThreadMain(commentThreadId) {
        this.threads.forEach(thread => {
            if (thread.threadId === commentThreadId) {
                this._proxy.$deleteCommentThread(this._handle, thread.commentThreadHandle);
            }
        });
    }
    updateInput(input) {
        const thread = this.activeCommentThread;
        if (thread && thread.input) {
            const commentInput = thread.input;
            commentInput.value = input;
            thread.input = commentInput;
        }
    }
    getKnownThread(commentThreadHandle) {
        const thread = this.threads.get(commentThreadHandle);
        if (!thread) {
            throw new Error('unknown thread');
        }
        return thread;
    }
    async getDocumentComments(resource, token) {
        const ret = [];
        for (const thread of [...this.threads.keys()]) {
            const commentThread = this.threads.get(thread);
            if (commentThread.resource === resource.toString()) {
                ret.push(commentThread);
            }
        }
        const commentingRanges = await this._proxy.$provideCommentingRanges(this.handle, resource, token);
        return {
            owner: this._uniqueId,
            label: this.label,
            threads: ret,
            commentingRanges: {
                resource: resource,
                ranges: commentingRanges || []
            }
        };
    }
    async getCommentingRanges(resource, token) {
        const commentingRanges = await this._proxy.$provideCommentingRanges(this.handle, resource, token);
        return commentingRanges || [];
    }
    getAllComments() {
        const ret = [];
        for (const thread of [...this.threads.keys()]) {
            ret.push(this.threads.get(thread));
        }
        return ret;
    }
    createCommentThreadTemplate(resource, range) {
        this._proxy.$createCommentThreadTemplate(this.handle, resource, range);
    }
    async updateCommentThreadTemplate(threadHandle, range) {
        await this._proxy.$updateCommentThreadTemplate(this.handle, threadHandle, range);
    }
}
exports.CommentController = CommentController;
class CommentsMainImp {
    constructor(rpc, container) {
        this.documentProviders = new Map();
        this.workspaceProviders = new Map();
        this.handlers = new Map();
        this.commentControllers = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.COMMENTS_EXT);
        container.get(comments_contribution_1.CommentsContribution);
        this.commentService = container.get(comments_service_1.CommentsService);
        this.commentService.onDidChangeActiveCommentThread(async (thread) => {
            const handle = thread.controllerHandle;
            const controller = this.commentControllers.get(handle);
            if (!controller) {
                return;
            }
            this.activeCommentThread = thread;
            controller.activeCommentThread = this.activeCommentThread;
        });
    }
    $registerCommentController(handle, id, label) {
        const providerId = (0, uuid_1.v4)();
        this.handlers.set(handle, providerId);
        const provider = new CommentController(this.proxy, this.commentService, handle, providerId, id, label, {});
        this.commentService.registerCommentController(providerId, provider);
        this.commentControllers.set(handle, provider);
        this.commentService.setWorkspaceComments(String(handle), []);
    }
    $unregisterCommentController(handle) {
        const providerId = this.handlers.get(handle);
        if (typeof providerId !== 'string') {
            throw new Error('unknown handler');
        }
        this.commentService.unregisterCommentController(providerId);
        this.handlers.delete(handle);
        this.commentControllers.delete(handle);
    }
    $updateCommentControllerFeatures(handle, features) {
        const provider = this.commentControllers.get(handle);
        if (!provider) {
            return undefined;
        }
        provider.updateFeatures(features);
    }
    $createCommentThread(handle, commentThreadHandle, threadId, resource, range, extensionId) {
        const provider = this.commentControllers.get(handle);
        if (!provider) {
            return undefined;
        }
        return provider.createCommentThread(extensionId, commentThreadHandle, threadId, resource, range);
    }
    $updateCommentThread(handle, commentThreadHandle, threadId, resource, changes) {
        const provider = this.commentControllers.get(handle);
        if (!provider) {
            return undefined;
        }
        return provider.updateCommentThread(commentThreadHandle, threadId, resource, changes);
    }
    $deleteCommentThread(handle, commentThreadHandle) {
        const provider = this.commentControllers.get(handle);
        if (!provider) {
            return;
        }
        return provider.deleteCommentThread(commentThreadHandle);
    }
    getHandler(handle) {
        if (!this.handlers.has(handle)) {
            throw new Error('Unknown handler');
        }
        return this.handlers.get(handle);
    }
    $onDidCommentThreadsChange(handle, event) {
        const providerId = this.getHandler(handle);
        this.commentService.updateComments(providerId, event);
    }
    dispose() {
        this.workspaceProviders.forEach(value => value.dispose());
        this.workspaceProviders.clear();
        this.documentProviders.forEach(value => value.dispose());
        this.documentProviders.clear();
    }
}
exports.CommentsMainImp = CommentsMainImp;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/comments/comments-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/comments/comments-service.js":
/*!*******************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/comments/comments-service.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.PluginCommentService = exports.CommentsService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
exports.CommentsService = Symbol('CommentsService');
let PluginCommentService = class PluginCommentService {
    constructor() {
        this.onDidSetDataProviderEmitter = new event_1.Emitter();
        this.onDidSetDataProvider = this.onDidSetDataProviderEmitter.event;
        this.onDidDeleteDataProviderEmitter = new event_1.Emitter();
        this.onDidDeleteDataProvider = this.onDidDeleteDataProviderEmitter.event;
        this.onDidSetResourceCommentInfosEmitter = new event_1.Emitter();
        this.onDidSetResourceCommentInfos = this.onDidSetResourceCommentInfosEmitter.event;
        this.onDidSetAllCommentThreadsEmitter = new event_1.Emitter();
        this.onDidSetAllCommentThreads = this.onDidSetAllCommentThreadsEmitter.event;
        this.onDidUpdateCommentThreadsEmitter = new event_1.Emitter();
        this.onDidUpdateCommentThreads = this.onDidUpdateCommentThreadsEmitter.event;
        this.onDidChangeActiveCommentThreadEmitter = new event_1.Emitter();
        this.onDidChangeActiveCommentThread = this.onDidChangeActiveCommentThreadEmitter.event;
        this.onDidChangeActiveCommentingRangeEmitter = new event_1.Emitter();
        this.onDidChangeActiveCommentingRange = this.onDidChangeActiveCommentingRangeEmitter.event;
        this.commentControls = new Map();
    }
    setActiveCommentThread(commentThread) {
        this.onDidChangeActiveCommentThreadEmitter.fire(commentThread);
    }
    setDocumentComments(resource, commentInfos) {
        this.onDidSetResourceCommentInfosEmitter.fire({ resource, commentInfos });
    }
    setWorkspaceComments(owner, commentsByResource) {
        this.onDidSetAllCommentThreadsEmitter.fire({ ownerId: owner, commentThreads: commentsByResource });
    }
    removeWorkspaceComments(owner) {
        this.onDidSetAllCommentThreadsEmitter.fire({ ownerId: owner, commentThreads: [] });
    }
    registerCommentController(owner, commentControl) {
        this.commentControls.set(owner, commentControl);
        this.onDidSetDataProviderEmitter.fire();
    }
    unregisterCommentController(owner) {
        this.commentControls.delete(owner);
        this.onDidDeleteDataProviderEmitter.fire(owner);
    }
    getCommentController(owner) {
        return this.commentControls.get(owner);
    }
    createCommentThreadTemplate(owner, resource, range) {
        const commentController = this.commentControls.get(owner);
        if (!commentController) {
            return;
        }
        commentController.createCommentThreadTemplate(resource, range);
    }
    async updateCommentThreadTemplate(owner, threadHandle, range) {
        const commentController = this.commentControls.get(owner);
        if (!commentController) {
            return;
        }
        await commentController.updateCommentThreadTemplate(threadHandle, range);
    }
    disposeCommentThread(owner, threadId) {
        const controller = this.getCommentController(owner);
        if (controller) {
            controller.deleteCommentThreadMain(threadId);
        }
    }
    updateComments(ownerId, event) {
        const evt = Object.assign({}, event, { owner: ownerId });
        this.onDidUpdateCommentThreadsEmitter.fire(evt);
    }
    async getComments(resource) {
        const commentControlResult = [];
        this.commentControls.forEach(control => {
            commentControlResult.push(control.getDocumentComments(resource, cancellation_1.CancellationToken.None)
                .catch(e => {
                console.log(e);
                return null;
            }));
        });
        return Promise.all(commentControlResult);
    }
    async getCommentingRanges(resource) {
        const commentControlResult = [];
        this.commentControls.forEach(control => {
            commentControlResult.push(control.getCommentingRanges(resource, cancellation_1.CancellationToken.None));
        });
        const ret = await Promise.all(commentControlResult);
        return ret.reduce((prev, curr) => {
            prev.push(...curr);
            return prev;
        }, []);
    }
};
PluginCommentService = __decorate([
    (0, inversify_1.injectable)()
], PluginCommentService);
exports.PluginCommentService = PluginCommentService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/comments/comments-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-service.js":
/*!******************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-service.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// copied and modified from https://github.com/microsoft/vscode/blob/53eac52308c4611000a171cc7bf1214293473c78/src/vs/workbench/contrib/customEditor/browser/customEditors.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.once = exports.CustomEditorModelManager = exports.CustomEditorService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let CustomEditorService = class CustomEditorService {
    constructor() {
        this._models = new CustomEditorModelManager();
    }
    get models() { return this._models; }
};
CustomEditorService = __decorate([
    (0, inversify_1.injectable)()
], CustomEditorService);
exports.CustomEditorService = CustomEditorService;
class CustomEditorModelManager {
    constructor() {
        this.references = new Map();
    }
    add(resource, viewType, model) {
        const key = this.key(resource, viewType);
        const existing = this.references.get(key);
        if (existing) {
            throw new Error('Model already exists');
        }
        this.references.set(key, { viewType, model, counter: 0 });
        return this.tryRetain(resource, viewType);
    }
    async get(resource, viewType) {
        const key = this.key(resource, viewType);
        const entry = this.references.get(key);
        return entry === null || entry === void 0 ? void 0 : entry.model;
    }
    tryRetain(resource, viewType) {
        const key = this.key(resource, viewType);
        const entry = this.references.get(key);
        if (!entry) {
            return undefined;
        }
        entry.counter++;
        return entry.model.then(model => ({
            object: model,
            dispose: once(() => {
                if (--entry.counter <= 0) {
                    entry.model.then(x => x.dispose());
                    this.references.delete(key);
                }
            }),
        }));
    }
    disposeAllModelsForView(viewType) {
        for (const [key, value] of this.references) {
            if (value.viewType === viewType) {
                value.model.then(x => x.dispose());
                this.references.delete(key);
            }
        }
    }
    key(resource, viewType) {
        return `${resource.toString()}@@@${viewType}`;
    }
}
exports.CustomEditorModelManager = CustomEditorModelManager;
function once(fn) {
    const _this = this;
    let didCall = false;
    let result;
    return function () {
        if (didCall) {
            return result;
        }
        didCall = true;
        result = fn.apply(_this, arguments);
        return result;
    };
}
exports.once = once;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/custom-editors/custom-editor-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editors-main.js":
/*!****************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editors-main.js ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/53eac52308c4611000a171cc7bf1214293473c78/src/vs/workbench/api/browser/mainThreadCustomEditors.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomTextEditorModel = exports.MainCustomEditorModel = exports.CustomEditorsMainImpl = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const hosted_plugin_1 = __webpack_require__(/*! ../../../hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
const plugin_custom_editor_registry_1 = __webpack_require__(/*! ./plugin-custom-editor-registry */ "../../packages/plugin-ext/lib/main/browser/custom-editors/plugin-custom-editor-registry.js");
const custom_editor_widget_1 = __webpack_require__(/*! ./custom-editor-widget */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const text_editor_model_service_1 = __webpack_require__(/*! ../text-editor-model-service */ "../../packages/plugin-ext/lib/main/browser/text-editor-model-service.js");
const custom_editor_service_1 = __webpack_require__(/*! ./custom-editor-service */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-service.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const undo_redo_service_1 = __webpack_require__(/*! @theia/editor/lib/browser/undo-redo-service */ "../../packages/editor/lib/browser/undo-redo-service.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const types_impl_1 = __webpack_require__(/*! ../../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
class CustomEditorsMainImpl {
    constructor(rpc, container, webviewsMain) {
        this.webviewsMain = webviewsMain;
        this.editorProviders = new Map();
        this.pluginService = container.get(hosted_plugin_1.HostedPluginSupport);
        this.shell = container.get(browser_1.ApplicationShell);
        this.textModelService = container.get(text_editor_model_service_1.EditorModelService);
        this.fileService = container.get(file_service_1.FileService);
        this.customEditorService = container.get(custom_editor_service_1.CustomEditorService);
        this.undoRedoService = container.get(undo_redo_service_1.UndoRedoService);
        this.customEditorRegistry = container.get(plugin_custom_editor_registry_1.PluginCustomEditorRegistry);
        this.labelProvider = container.get(browser_1.DefaultUriLabelProviderContribution);
        this.editorPreferences = container.get(browser_2.EditorPreferences);
        this.widgetManager = container.get(widget_manager_1.WidgetManager);
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.CUSTOM_EDITORS_EXT);
    }
    dispose() {
        for (const disposable of this.editorProviders.values()) {
            disposable.dispose();
        }
        this.editorProviders.clear();
    }
    $registerTextEditorProvider(viewType, options, capabilities) {
        this.registerEditorProvider(1 /* Text */, viewType, options, capabilities, true);
    }
    $registerCustomEditorProvider(viewType, options, supportsMultipleEditorsPerDocument) {
        this.registerEditorProvider(0 /* Custom */, viewType, options, {}, supportsMultipleEditorsPerDocument);
    }
    async registerEditorProvider(modelType, viewType, options, capabilities, supportsMultipleEditorsPerDocument) {
        if (this.editorProviders.has(viewType)) {
            throw new Error(`Provider for ${viewType} already registered`);
        }
        const disposables = new disposable_1.DisposableCollection();
        disposables.push(this.customEditorRegistry.registerResolver(viewType, async (widget, widgetOpenerOptions) => {
            const { resource, identifier } = widget;
            widget.options = options;
            const cancellationSource = new cancellation_1.CancellationTokenSource();
            let modelRef = await this.getOrCreateCustomEditorModel(modelType, resource, viewType, cancellationSource.token);
            widget.modelRef = modelRef;
            widget.onDidDispose(() => {
                // If the model is still dirty, make sure we have time to save it
                if (modelRef.object.dirty) {
                    const sub = modelRef.object.onDirtyChanged(() => {
                        if (!modelRef.object.dirty) {
                            sub.dispose();
                            modelRef.dispose();
                        }
                    });
                    return;
                }
                modelRef.dispose();
            });
            if (capabilities.supportsMove) {
                const onMoveCancelTokenSource = new cancellation_1.CancellationTokenSource();
                widget.onMove(async (newResource) => {
                    const oldModel = modelRef;
                    modelRef = await this.getOrCreateCustomEditorModel(modelType, newResource, viewType, onMoveCancelTokenSource.token);
                    this.proxy.$onMoveCustomEditor(identifier.id, vscode_uri_1.URI.file(newResource.path.toString()), viewType);
                    oldModel.dispose();
                });
            }
            const _cancellationSource = new cancellation_1.CancellationTokenSource();
            await this.proxy.$resolveWebviewEditor(vscode_uri_1.URI.file(resource.path.toString()), identifier.id, viewType, this.labelProvider.getName(resource), widgetOpenerOptions, options, _cancellationSource.token);
        }));
        this.editorProviders.set(viewType, disposables);
    }
    $unregisterEditorProvider(viewType) {
        const provider = this.editorProviders.get(viewType);
        if (!provider) {
            throw new Error(`No provider for ${viewType} registered`);
        }
        provider.dispose();
        this.editorProviders.delete(viewType);
        this.customEditorService.models.disposeAllModelsForView(viewType);
    }
    async getOrCreateCustomEditorModel(modelType, resource, viewType, cancellationToken) {
        const existingModel = this.customEditorService.models.tryRetain(resource, viewType);
        if (existingModel) {
            return existingModel;
        }
        switch (modelType) {
            case 1 /* Text */: {
                const model = CustomTextEditorModel.create(viewType, resource, this.textModelService, this.fileService);
                return this.customEditorService.models.add(resource, viewType, model);
            }
            case 0 /* Custom */: {
                const model = MainCustomEditorModel.create(this.proxy, viewType, resource, this.undoRedoService, this.fileService, this.editorPreferences, cancellationToken);
                return this.customEditorService.models.add(resource, viewType, model);
            }
        }
    }
    async getCustomEditorModel(resourceComponents, viewType) {
        const resource = vscode_uri_1.URI.revive(resourceComponents);
        const model = await this.customEditorService.models.get(new uri_1.default(resource), viewType);
        if (!model || !(model instanceof MainCustomEditorModel)) {
            throw new Error('Could not find model for custom editor');
        }
        return model;
    }
    async $onDidEdit(resourceComponents, viewType, editId, label) {
        const model = await this.getCustomEditorModel(resourceComponents, viewType);
        model.pushEdit(editId, label);
    }
    async $onContentChange(resourceComponents, viewType) {
        const model = await this.getCustomEditorModel(resourceComponents, viewType);
        model.changeContent();
    }
    async $createCustomEditorPanel(panelId, title, widgetOpenerOptions, options) {
        const view = await this.widgetManager.getOrCreateWidget(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID, { id: panelId });
        this.webviewsMain.hookWebview(view);
        view.title.label = title;
        const { enableFindWidget, retainContextWhenHidden, enableScripts, enableForms, localResourceRoots, ...contentOptions } = options;
        view.viewColumn = types_impl_1.ViewColumn.One; // behaviour might be overridden later using widgetOpenerOptions (if available)
        view.options = { enableFindWidget, retainContextWhenHidden };
        view.setContentOptions({
            allowScripts: enableScripts,
            allowForms: enableForms,
            localResourceRoots: localResourceRoots && localResourceRoots.map(root => root.toString()),
            ...contentOptions,
            ...view.contentOptions
        });
        if (view.isAttached) {
            if (view.isVisible) {
                this.shell.revealWidget(view.id);
            }
            return;
        }
        const showOptions = {
            preserveFocus: true
        };
        if (widgetOpenerOptions) {
            if (widgetOpenerOptions.mode === 'reveal') {
                showOptions.preserveFocus = false;
            }
            if (widgetOpenerOptions.widgetOptions) {
                let area;
                switch (widgetOpenerOptions.widgetOptions.area) {
                    case 'main':
                        area = types_impl_1.WebviewPanelTargetArea.Main;
                    case 'left':
                        area = types_impl_1.WebviewPanelTargetArea.Left;
                    case 'right':
                        area = types_impl_1.WebviewPanelTargetArea.Right;
                    case 'bottom':
                        area = types_impl_1.WebviewPanelTargetArea.Bottom;
                    default: // includes 'top' and 'secondaryWindow'
                        area = types_impl_1.WebviewPanelTargetArea.Main;
                }
                showOptions.area = area;
                if (widgetOpenerOptions.widgetOptions.mode === 'split-right' ||
                    widgetOpenerOptions.widgetOptions.mode === 'open-to-right') {
                    showOptions.viewColumn = types_impl_1.ViewColumn.Beside;
                }
            }
        }
        this.webviewsMain.addOrReattachWidget(view, showOptions);
    }
}
exports.CustomEditorsMainImpl = CustomEditorsMainImpl;
class MainCustomEditorModel {
    constructor(proxy, viewType, editorResource, editable, undoRedoService, fileService, editorPreferences) {
        this.proxy = proxy;
        this.viewType = viewType;
        this.editorResource = editorResource;
        this.editable = editable;
        this.undoRedoService = undoRedoService;
        this.fileService = fileService;
        this.editorPreferences = editorPreferences;
        this.currentEditIndex = -1;
        this.savePoint = -1;
        this.isDirtyFromContentChange = false;
        this.edits = [];
        this.toDispose = new disposable_1.DisposableCollection();
        this.onDirtyChangedEmitter = new core_1.Emitter();
        this.onDirtyChanged = this.onDirtyChangedEmitter.event;
        this.autoSave = this.editorPreferences.get('files.autoSave', undefined, editorResource.toString());
        this.autoSaveDelay = this.editorPreferences.get('files.autoSaveDelay', undefined, editorResource.toString());
        this.toDispose.push(this.editorPreferences.onPreferenceChanged(event => {
            if (event.preferenceName === 'files.autoSave') {
                this.autoSave = this.editorPreferences.get('files.autoSave', undefined, editorResource.toString());
            }
            if (event.preferenceName === 'files.autoSaveDelay') {
                this.autoSaveDelay = this.editorPreferences.get('files.autoSaveDelay', undefined, editorResource.toString());
            }
        }));
        this.toDispose.push(this.onDirtyChangedEmitter);
    }
    static async create(proxy, viewType, resource, undoRedoService, fileService, editorPreferences, cancellation) {
        const { editable } = await proxy.$createCustomDocument(vscode_uri_1.URI.file(resource.path.toString()), viewType, {}, cancellation);
        return new MainCustomEditorModel(proxy, viewType, resource, editable, undoRedoService, fileService, editorPreferences);
    }
    get resource() {
        return vscode_uri_1.URI.file(this.editorResource.path.toString());
    }
    get dirty() {
        if (this.isDirtyFromContentChange) {
            return true;
        }
        if (this.edits.length > 0) {
            return this.savePoint !== this.currentEditIndex;
        }
        return false;
    }
    get readonly() {
        return !this.editable;
    }
    setProxy(proxy) {
        this.proxy = proxy;
    }
    dispose() {
        if (this.editable) {
            this.undoRedoService.removeElements(this.editorResource);
        }
        this.proxy.$disposeCustomDocument(this.resource, this.viewType);
    }
    changeContent() {
        this.change(() => {
            this.isDirtyFromContentChange = true;
        });
    }
    pushEdit(editId, label) {
        if (!this.editable) {
            throw new Error('Document is not editable');
        }
        this.change(() => {
            this.spliceEdits(editId);
            this.currentEditIndex = this.edits.length - 1;
        });
        this.undoRedoService.pushElement(this.editorResource, () => this.undo(), () => this.redo());
    }
    async revert(options) {
        if (!this.editable) {
            return;
        }
        if (this.currentEditIndex === this.savePoint && !this.isDirtyFromContentChange) {
            return;
        }
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        this.proxy.$revert(this.resource, this.viewType, cancellationSource.token);
        this.change(() => {
            this.isDirtyFromContentChange = false;
            this.currentEditIndex = this.savePoint;
            this.spliceEdits();
        });
    }
    async save(options) {
        await this.saveCustomEditor(options);
    }
    async saveCustomEditor(options) {
        var _a;
        if (!this.editable) {
            return;
        }
        const cancelable = new cancellation_1.CancellationTokenSource();
        const savePromise = this.proxy.$onSave(this.resource, this.viewType, cancelable.token);
        (_a = this.ongoingSave) === null || _a === void 0 ? void 0 : _a.cancel();
        this.ongoingSave = cancelable;
        try {
            await savePromise;
            if (this.ongoingSave === cancelable) { // Make sure we are still doing the same save
                this.change(() => {
                    this.isDirtyFromContentChange = false;
                    this.savePoint = this.currentEditIndex;
                });
            }
        }
        finally {
            if (this.ongoingSave === cancelable) { // Make sure we are still doing the same save
                this.ongoingSave = undefined;
            }
        }
    }
    async saveCustomEditorAs(resource, targetResource, options) {
        if (this.editable) {
            const source = new cancellation_1.CancellationTokenSource();
            await this.proxy.$onSaveAs(this.resource, this.viewType, vscode_uri_1.URI.file(targetResource.path.toString()), source.token);
            this.change(() => {
                this.savePoint = this.currentEditIndex;
            });
        }
        else {
            // Since the editor is readonly, just copy the file over
            await this.fileService.copy(resource, targetResource, { overwrite: false });
        }
    }
    async undo() {
        if (!this.editable) {
            return;
        }
        if (this.currentEditIndex < 0) {
            // nothing to undo
            return;
        }
        const undoneEdit = this.edits[this.currentEditIndex];
        this.change(() => {
            --this.currentEditIndex;
        });
        await this.proxy.$undo(this.resource, this.viewType, undoneEdit, this.dirty);
    }
    async redo() {
        if (!this.editable) {
            return;
        }
        if (this.currentEditIndex >= this.edits.length - 1) {
            // nothing to redo
            return;
        }
        const redoneEdit = this.edits[this.currentEditIndex + 1];
        this.change(() => {
            ++this.currentEditIndex;
        });
        await this.proxy.$redo(this.resource, this.viewType, redoneEdit, this.dirty);
    }
    spliceEdits(editToInsert) {
        const start = this.currentEditIndex + 1;
        const toRemove = this.edits.length - this.currentEditIndex;
        const removedEdits = typeof editToInsert === 'number'
            ? this.edits.splice(start, toRemove, editToInsert)
            : this.edits.splice(start, toRemove);
        if (removedEdits.length) {
            this.proxy.$disposeEdits(this.resource, this.viewType, removedEdits);
        }
    }
    change(makeEdit) {
        const wasDirty = this.dirty;
        makeEdit();
        if (this.dirty !== wasDirty) {
            this.onDirtyChangedEmitter.fire();
        }
        if (this.autoSave !== 'off' && this.dirty && this.resource.scheme !== core_1.UNTITLED_SCHEME) {
            const handle = window.setTimeout(() => {
                this.save();
                window.clearTimeout(handle);
            }, this.autoSaveDelay);
        }
    }
}
exports.MainCustomEditorModel = MainCustomEditorModel;
// copied from https://github.com/microsoft/vscode/blob/53eac52308c4611000a171cc7bf1214293473c78/src/vs/workbench/contrib/customEditor/common/customTextEditorModel.ts
class CustomTextEditorModel {
    constructor(viewType, editorResource, model, fileService) {
        this.viewType = viewType;
        this.editorResource = editorResource;
        this.model = model;
        this.fileService = fileService;
        this.toDispose = new disposable_1.DisposableCollection();
        this.onDirtyChangedEmitter = new core_1.Emitter();
        this.onDirtyChanged = this.onDirtyChangedEmitter.event;
        this.toDispose.push(this.editorTextModel.onDirtyChanged(e => {
            this.onDirtyChangedEmitter.fire();
        }));
        this.toDispose.push(this.onDirtyChangedEmitter);
    }
    static async create(viewType, resource, editorModelService, fileService) {
        const model = await editorModelService.createModelReference(resource);
        model.object.suppressOpenEditorWhenDirty = true;
        return new CustomTextEditorModel(viewType, resource, model, fileService);
    }
    get autoSave() {
        return this.editorTextModel.autoSave;
    }
    get autoSaveDelay() {
        return this.editorTextModel.autoSaveDelay;
    }
    dispose() {
        this.toDispose.dispose();
        this.model.dispose();
    }
    get resource() {
        return vscode_uri_1.URI.file(this.editorResource.path.toString());
    }
    get dirty() {
        return this.editorTextModel.dirty;
    }
    ;
    get readonly() {
        return this.editorTextModel.readOnly;
    }
    get editorTextModel() {
        return this.model.object;
    }
    revert(options) {
        return this.editorTextModel.revert(options);
    }
    save(options) {
        return this.saveCustomEditor(options);
    }
    saveCustomEditor(options) {
        return this.editorTextModel.save(options);
    }
    async saveCustomEditorAs(resource, targetResource, options) {
        await this.saveCustomEditor(options);
        await this.fileService.copy(resource, targetResource, { overwrite: false });
    }
}
exports.CustomTextEditorModel = CustomTextEditorModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/custom-editors/custom-editors-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/custom-editors/plugin-custom-editor-registry.js":
/*!**************************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/custom-editors/plugin-custom-editor-registry.js ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.PluginCustomEditorRegistry = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const custom_editor_opener_1 = __webpack_require__(/*! ./custom-editor-opener */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-opener.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const uri_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/uri-command-handler */ "../../packages/core/lib/common/uri-command-handler.js");
const navigator_contribution_1 = __webpack_require__(/*! @theia/navigator/lib//browser/navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const custom_editor_widget_1 = __webpack_require__(/*! ./custom-editor-widget */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js");
let PluginCustomEditorRegistry = class PluginCustomEditorRegistry {
    constructor() {
        this.editors = new Map();
        this.pendingEditors = new Set();
        this.resolvers = new Map();
        this.onWillOpenCustomEditorEmitter = new core_1.Emitter();
        this.onWillOpenCustomEditor = this.onWillOpenCustomEditorEmitter.event;
        this.resolveWidget = (widget, options) => {
            const resolver = this.resolvers.get(widget.viewType);
            if (resolver) {
                resolver(widget, options);
            }
            else {
                this.pendingEditors.add(widget);
                this.onWillOpenCustomEditorEmitter.fire(widget.viewType);
            }
        };
    }
    init() {
        this.widgetManager.onDidCreateWidget(({ factoryId, widget }) => {
            if (factoryId === custom_editor_widget_1.CustomEditorWidget.FACTORY_ID && widget instanceof custom_editor_widget_1.CustomEditorWidget) {
                const restoreState = widget.restoreState.bind(widget);
                widget.restoreState = state => {
                    if (state.viewType && state.strResource) {
                        restoreState(state);
                        this.resolveWidget(widget);
                    }
                    else {
                        widget.dispose();
                    }
                };
            }
        });
    }
    registerCustomEditor(editor) {
        if (this.editors.has(editor.viewType)) {
            console.warn('editor with such id already registered: ', JSON.stringify(editor));
            return disposable_1.Disposable.NULL;
        }
        this.editors.set(editor.viewType, editor);
        const toDispose = new disposable_1.DisposableCollection();
        toDispose.push(disposable_1.Disposable.create(() => this.editors.delete(editor.viewType)));
        const editorOpenHandler = new custom_editor_opener_1.CustomEditorOpener(editor, this.shell, this.widgetManager);
        toDispose.push(this.defaultOpenerService.addHandler(editorOpenHandler));
        const openWithCommand = browser_1.WorkspaceCommands.FILE_OPEN_WITH(editorOpenHandler);
        toDispose.push(this.menuModelRegistry.registerMenuAction(navigator_contribution_1.NavigatorContextMenu.OPEN_WITH, {
            commandId: openWithCommand.id,
            label: editorOpenHandler.label
        }));
        toDispose.push(this.commandRegistry.registerCommand(openWithCommand, uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, {
            execute: uri => editorOpenHandler.open(uri),
            isEnabled: uri => editorOpenHandler.canHandle(uri) > 0,
            isVisible: uri => editorOpenHandler.canHandle(uri) > 0
        })));
        toDispose.push(editorOpenHandler.onDidOpenCustomEditor(event => this.resolveWidget(event[0], event[1])));
        return toDispose;
    }
    registerResolver(viewType, resolver) {
        if (this.resolvers.has(viewType)) {
            throw new Error(`Resolver for ${viewType} already registered`);
        }
        for (const editorWidget of this.pendingEditors) {
            if (editorWidget.viewType === viewType) {
                resolver(editorWidget);
                this.pendingEditors.delete(editorWidget);
            }
        }
        this.resolvers.set(viewType, resolver);
        return disposable_1.Disposable.create(() => this.resolvers.delete(viewType));
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.DefaultOpenerService),
    __metadata("design:type", browser_2.DefaultOpenerService)
], PluginCustomEditorRegistry.prototype, "defaultOpenerService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MenuModelRegistry),
    __metadata("design:type", core_1.MenuModelRegistry)
], PluginCustomEditorRegistry.prototype, "menuModelRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], PluginCustomEditorRegistry.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], PluginCustomEditorRegistry.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WidgetManager),
    __metadata("design:type", browser_2.WidgetManager)
], PluginCustomEditorRegistry.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.ApplicationShell),
    __metadata("design:type", browser_2.ApplicationShell)
], PluginCustomEditorRegistry.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginCustomEditorRegistry.prototype, "init", null);
PluginCustomEditorRegistry = __decorate([
    (0, inversify_1.injectable)()
], PluginCustomEditorRegistry);
exports.PluginCustomEditorRegistry = PluginCustomEditorRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/custom-editors/plugin-custom-editor-registry'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/debug/debug-main.js":
/*!**********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/debug/debug-main.js ***!
  \**********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugMainImpl = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const debug_session_manager_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const breakpoint_manager_1 = __webpack_require__(/*! @theia/debug/lib/browser/breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_source_breakpoint_1 = __webpack_require__(/*! @theia/debug/lib/browser/model/debug-source-breakpoint */ "../../packages/debug/lib/browser/model/debug-source-breakpoint.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const debug_configuration_manager_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-configuration-manager */ "../../packages/debug/lib/browser/debug-configuration-manager.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const message_service_protocol_1 = __webpack_require__(/*! @theia/core/lib/common/message-service-protocol */ "../../packages/core/lib/common/message-service-protocol.js");
const output_channel_1 = __webpack_require__(/*! @theia/output/lib/browser/output-channel */ "../../packages/output/lib/browser/output-channel.js");
const debug_preferences_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-preferences */ "../../packages/debug/lib/browser/debug-preferences.js");
const plugin_debug_adapter_contribution_1 = __webpack_require__(/*! ./plugin-debug-adapter-contribution */ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-adapter-contribution.js");
const plugin_debug_configuration_provider_1 = __webpack_require__(/*! ./plugin-debug-configuration-provider */ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-configuration-provider.js");
const plugin_debug_session_contribution_registry_1 = __webpack_require__(/*! ./plugin-debug-session-contribution-registry */ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-session-contribution-registry.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const plugin_debug_session_factory_1 = __webpack_require__(/*! ./plugin-debug-session-factory */ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-session-factory.js");
const plugin_debug_service_1 = __webpack_require__(/*! ./plugin-debug-service */ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-service.js");
const hosted_plugin_1 = __webpack_require__(/*! ../../../hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
const debug_function_breakpoint_1 = __webpack_require__(/*! @theia/debug/lib/browser/model/debug-function-breakpoint */ "../../packages/debug/lib/browser/model/debug-function-breakpoint.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const console_session_manager_1 = __webpack_require__(/*! @theia/console/lib/browser/console-session-manager */ "../../packages/console/lib/browser/console-session-manager.js");
const debug_console_session_1 = __webpack_require__(/*! @theia/debug/lib/browser/console/debug-console-session */ "../../packages/debug/lib/browser/console/debug-console-session.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const debug_contribution_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-contribution */ "../../packages/debug/lib/browser/debug-contribution.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const debug_session_options_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-options */ "../../packages/debug/lib/browser/debug-session-options.js");
class DebugMainImpl {
    constructor(rpc, connectionMain, container) {
        this.connectionMain = connectionMain;
        this.debuggerContributions = new Map();
        this.configurationProviders = new Map();
        this.toDispose = new disposable_1.DisposableCollection();
        this.debugExt = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DEBUG_EXT);
        this.sessionManager = container.get(debug_session_manager_1.DebugSessionManager);
        this.labelProvider = container.get(browser_1.LabelProvider);
        this.editorManager = container.get(browser_2.EditorManager);
        this.breakpointsManager = container.get(breakpoint_manager_1.BreakpointManager);
        this.consoleSessionManager = container.get(console_session_manager_1.ConsoleSessionManager);
        this.configurationManager = container.get(debug_configuration_manager_1.DebugConfigurationManager);
        this.terminalService = container.get(terminal_service_1.TerminalService);
        this.messages = container.get(message_service_protocol_1.MessageClient);
        this.outputChannelManager = container.get(output_channel_1.OutputChannelManager);
        this.debugPreferences = container.get(debug_preferences_1.DebugPreferences);
        this.pluginDebugService = container.get(plugin_debug_service_1.PluginDebugService);
        this.sessionContributionRegistrator = container.get(plugin_debug_session_contribution_registry_1.PluginDebugSessionContributionRegistry);
        this.debugContributionProvider = container.getNamed(common_1.ContributionProvider, debug_contribution_1.DebugContribution);
        this.fileService = container.get(file_service_1.FileService);
        this.pluginService = container.get(hosted_plugin_1.HostedPluginSupport);
        this.workspaceService = container.get(browser_3.WorkspaceService);
        const fireDidChangeBreakpoints = ({ added, removed, changed }) => {
            this.debugExt.$breakpointsDidChange(this.toTheiaPluginApiBreakpoints(added), removed.map(b => b.id), this.toTheiaPluginApiBreakpoints(changed));
        };
        this.debugExt.$breakpointsDidChange(this.toTheiaPluginApiBreakpoints(this.breakpointsManager.getBreakpoints()), [], []);
        this.debugExt.$breakpointsDidChange(this.toTheiaPluginApiBreakpoints(this.breakpointsManager.getFunctionBreakpoints()), [], []);
        this.toDispose.pushAll([
            this.breakpointsManager.onDidChangeBreakpoints(fireDidChangeBreakpoints),
            this.breakpointsManager.onDidChangeFunctionBreakpoints(fireDidChangeBreakpoints),
            this.sessionManager.onDidCreateDebugSession(debugSession => this.debugExt.$sessionDidCreate(debugSession.id)),
            this.sessionManager.onDidStartDebugSession(debugSession => this.debugExt.$sessionDidStart(debugSession.id)),
            this.sessionManager.onDidDestroyDebugSession(debugSession => this.debugExt.$sessionDidDestroy(debugSession.id)),
            this.sessionManager.onDidChangeActiveDebugSession(event => this.debugExt.$sessionDidChange(event.current && event.current.id)),
            this.sessionManager.onDidReceiveDebugSessionCustomEvent(event => this.debugExt.$onSessionCustomEvent(event.session.id, event.event, event.body))
        ]);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $appendToDebugConsole(value) {
        const session = this.consoleSessionManager.selectedSession;
        if (session instanceof debug_console_session_1.DebugConsoleSession) {
            session.append(value);
        }
    }
    async $appendLineToDebugConsole(value) {
        const session = this.consoleSessionManager.selectedSession;
        if (session instanceof debug_console_session_1.DebugConsoleSession) {
            session.appendLine(value);
        }
    }
    async $registerDebuggerContribution(description) {
        const debugType = description.type;
        const terminalOptionsExt = await this.debugExt.$getTerminalCreationOptions(debugType);
        if (this.toDispose.disposed) {
            return;
        }
        const debugSessionFactory = new plugin_debug_session_factory_1.PluginDebugSessionFactory(this.terminalService, this.editorManager, this.breakpointsManager, this.labelProvider, this.messages, this.outputChannelManager, this.debugPreferences, async (sessionId) => {
            const connection = await this.connectionMain.ensureConnection(sessionId);
            return connection;
        }, this.fileService, terminalOptionsExt, this.debugContributionProvider, this.workspaceService);
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => this.debuggerContributions.delete(debugType)));
        this.debuggerContributions.set(debugType, toDispose);
        toDispose.pushAll([
            this.pluginDebugService.registerDebugAdapterContribution(new plugin_debug_adapter_contribution_1.PluginDebugAdapterContribution(description, this.debugExt, this.pluginService)),
            this.sessionContributionRegistrator.registerDebugSessionContribution({
                debugType: description.type,
                debugSessionFactory: () => debugSessionFactory
            })
        ]);
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregisterDebuggerConfiguration(debugType)));
    }
    async $unregisterDebuggerConfiguration(debugType) {
        const disposable = this.debuggerContributions.get(debugType);
        if (disposable) {
            disposable.dispose();
        }
    }
    $registerDebugConfigurationProvider(description) {
        const handle = description.handle;
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => this.configurationProviders.delete(handle)));
        this.configurationProviders.set(handle, toDispose);
        toDispose.push(this.pluginDebugService.registerDebugConfigurationProvider(new plugin_debug_configuration_provider_1.PluginDebugConfigurationProvider(description, this.debugExt)));
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregisterDebugConfigurationProvider(handle)));
    }
    async $unregisterDebugConfigurationProvider(handle) {
        const disposable = this.configurationProviders.get(handle);
        if (disposable) {
            disposable.dispose();
        }
    }
    async $addBreakpoints(breakpoints) {
        const newBreakpoints = new Map();
        breakpoints.forEach(b => newBreakpoints.set(b.id, b));
        this.breakpointsManager.findMarkers({
            dataFilter: data => {
                // install only new breakpoints
                if (newBreakpoints.has(data.id)) {
                    newBreakpoints.delete(data.id);
                }
                return false;
            }
        });
        let addedFunctionBreakpoints = false;
        const functionBreakpoints = this.breakpointsManager.getFunctionBreakpoints();
        for (const breakpoint of functionBreakpoints) {
            // install only new breakpoints
            if (newBreakpoints.has(breakpoint.id)) {
                newBreakpoints.delete(breakpoint.id);
            }
        }
        for (const breakpoint of newBreakpoints.values()) {
            if (breakpoint.location) {
                const location = breakpoint.location;
                const column = breakpoint.location.range.startColumn;
                this.breakpointsManager.addBreakpoint({
                    id: breakpoint.id,
                    uri: vscode_uri_1.URI.revive(location.uri).toString(),
                    enabled: breakpoint.enabled,
                    raw: {
                        line: breakpoint.location.range.startLineNumber + 1,
                        column: column > 0 ? column + 1 : undefined,
                        condition: breakpoint.condition,
                        hitCondition: breakpoint.hitCondition,
                        logMessage: breakpoint.logMessage
                    }
                });
            }
            else if (breakpoint.functionName) {
                addedFunctionBreakpoints = true;
                functionBreakpoints.push({
                    id: breakpoint.id,
                    enabled: breakpoint.enabled,
                    raw: {
                        name: breakpoint.functionName
                    }
                });
            }
        }
        if (addedFunctionBreakpoints) {
            this.breakpointsManager.setFunctionBreakpoints(functionBreakpoints);
        }
    }
    async $getDebugProtocolBreakpoint(sessionId, breakpointId) {
        var _a;
        const session = this.sessionManager.getSession(sessionId);
        if (session) {
            return (_a = session.getBreakpoint(breakpointId)) === null || _a === void 0 ? void 0 : _a.raw;
        }
        else {
            throw new Error(`Debug session '${sessionId}' not found`);
        }
    }
    async $removeBreakpoints(breakpoints) {
        const { labelProvider, breakpointsManager, editorManager } = this;
        const session = this.sessionManager.currentSession;
        const ids = new Set(breakpoints);
        for (const origin of this.breakpointsManager.findMarkers({ dataFilter: data => ids.has(data.id) })) {
            const breakpoint = new debug_source_breakpoint_1.DebugSourceBreakpoint(origin.data, { labelProvider, breakpoints: breakpointsManager, editorManager, session });
            breakpoint.remove();
        }
        for (const origin of this.breakpointsManager.getFunctionBreakpoints()) {
            if (ids.has(origin.id)) {
                const breakpoint = new debug_function_breakpoint_1.DebugFunctionBreakpoint(origin, { labelProvider, breakpoints: breakpointsManager, editorManager, session });
                breakpoint.remove();
            }
        }
    }
    async $customRequest(sessionId, command, args) {
        const session = this.sessionManager.getSession(sessionId);
        if (session) {
            return session.sendCustomRequest(command, args);
        }
        throw new Error(`Debug session '${sessionId}' not found`);
    }
    async $startDebugging(folder, nameOrConfiguration, options) {
        // search for matching options
        let sessionOptions;
        if (typeof nameOrConfiguration === 'string') {
            for (const configOptions of this.configurationManager.all) {
                if (configOptions.name === nameOrConfiguration) {
                    sessionOptions = configOptions;
                }
            }
        }
        else {
            sessionOptions = {
                name: nameOrConfiguration.name,
                configuration: nameOrConfiguration
            };
        }
        if (!sessionOptions) {
            console.error(`There is no debug configuration for ${nameOrConfiguration}`);
            return false;
        }
        // translate given extra data
        const workspaceFolderUri = folder && vscode_uri_1.URI.revive(folder.uri).toString();
        if (debug_session_options_1.DebugSessionOptions.isConfiguration(sessionOptions)) {
            sessionOptions = { ...sessionOptions, configuration: { ...sessionOptions.configuration, ...options }, workspaceFolderUri };
        }
        else {
            sessionOptions = { ...sessionOptions, ...options, workspaceFolderUri };
        }
        // start options
        const session = await this.sessionManager.start(sessionOptions);
        return !!session;
    }
    async $stopDebugging(sessionId) {
        if (sessionId) {
            const session = this.sessionManager.getSession(sessionId);
            return this.sessionManager.terminateSession(session);
        }
        // Terminate all sessions if no session is provided.
        for (const session of this.sessionManager.sessions) {
            this.sessionManager.terminateSession(session);
        }
    }
    toTheiaPluginApiBreakpoints(breakpoints) {
        return breakpoints.map(b => this.toTheiaPluginApiBreakpoint(b));
    }
    toTheiaPluginApiBreakpoint(breakpoint) {
        if ('uri' in breakpoint) {
            const raw = breakpoint.raw;
            return {
                id: breakpoint.id,
                enabled: breakpoint.enabled,
                condition: breakpoint.raw.condition,
                hitCondition: breakpoint.raw.hitCondition,
                logMessage: raw.logMessage,
                location: {
                    uri: vscode_uri_1.URI.parse(breakpoint.uri),
                    range: {
                        startLineNumber: raw.line - 1,
                        startColumn: (raw.column || 1) - 1,
                        endLineNumber: raw.line - 1,
                        endColumn: (raw.column || 1) - 1
                    }
                }
            };
        }
        return {
            id: breakpoint.id,
            enabled: breakpoint.enabled,
            functionName: breakpoint.raw.name
        };
    }
}
exports.DebugMainImpl = DebugMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/debug/debug-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-adapter-contribution.js":
/*!*********************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-adapter-contribution.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginDebugAdapterContribution = void 0;
/**
 * Plugin [DebugAdapterContribution](#DebugAdapterContribution).
 */
class PluginDebugAdapterContribution {
    constructor(description, debugExt, pluginService) {
        this.description = description;
        this.debugExt = debugExt;
        this.pluginService = pluginService;
    }
    get type() {
        return this.description.type;
    }
    get label() {
        return this.description.label;
    }
    async createDebugSession(config, workspaceFolder) {
        await this.pluginService.activateByDebug('onDebugAdapterProtocolTracker', config.type);
        return this.debugExt.$createDebugSession(config, workspaceFolder);
    }
    async terminateDebugSession(sessionId) {
        this.debugExt.$terminateDebugSession(sessionId);
    }
}
exports.PluginDebugAdapterContribution = PluginDebugAdapterContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/debug/plugin-debug-adapter-contribution'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-configuration-provider.js":
/*!***********************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-configuration-provider.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginDebugConfigurationProvider = void 0;
class PluginDebugConfigurationProvider {
    constructor(description, debugExt) {
        this.debugExt = debugExt;
        this.handle = description.handle;
        this.type = description.type;
        this.triggerKind = description.trigger;
        if (description.provideDebugConfiguration) {
            this.provideDebugConfigurations = async (folder) => this.debugExt.$provideDebugConfigurationsByHandle(this.handle, folder);
        }
        if (description.resolveDebugConfigurations) {
            this.resolveDebugConfiguration =
                async (folder, debugConfiguration) => this.debugExt.$resolveDebugConfigurationByHandle(this.handle, folder, debugConfiguration);
        }
        if (description.resolveDebugConfigurationWithSubstitutedVariables) {
            this.resolveDebugConfigurationWithSubstitutedVariables =
                async (folder, debugConfiguration) => this.debugExt.$resolveDebugConfigurationWithSubstitutedVariablesByHandle(this.handle, folder, debugConfiguration);
        }
    }
}
exports.PluginDebugConfigurationProvider = PluginDebugConfigurationProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/debug/plugin-debug-configuration-provider'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-service.js":
/*!********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-service.js ***!
  \********************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginDebugService = void 0;
const debug_service_1 = __webpack_require__(/*! @theia/debug/lib/common/debug-service */ "../../packages/debug/lib/common/debug-service.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const ws_connection_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/messaging/ws-connection-provider */ "../../packages/core/lib/browser/messaging/ws-connection-provider.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
/**
 * Debug service to work with plugin and extension contributions.
 */
let PluginDebugService = class PluginDebugService {
    constructor() {
        this.onDidChangeDebuggersEmitter = new core_1.Emitter();
        this.debuggers = [];
        this.contributors = new Map();
        this.configurationProviders = new Map();
        this.toDispose = new disposable_1.DisposableCollection(this.onDidChangeDebuggersEmitter);
        this.onDidChangeDebugConfigurationProvidersEmitter = new core_1.Emitter();
        // maps session and contribution
        this.sessionId2contrib = new Map();
        // debouncing to send a single notification for multiple registrations at initialization time
        this.fireOnDidConfigurationProvidersChanged = debounce(() => {
            this.onDidChangeDebugConfigurationProvidersEmitter.fire();
        }, 100);
    }
    get onDidChangeDebuggers() {
        return this.onDidChangeDebuggersEmitter.event;
    }
    get onDidChangeDebugConfigurationProviders() {
        return this.onDidChangeDebugConfigurationProvidersEmitter.event;
    }
    init() {
        this.delegated = this.connectionProvider.createProxy(debug_service_1.DebugPath);
        this.toDispose.pushAll([
            disposable_1.Disposable.create(() => this.delegated.dispose()),
            disposable_1.Disposable.create(() => {
                for (const sessionId of this.sessionId2contrib.keys()) {
                    const contrib = this.sessionId2contrib.get(sessionId);
                    contrib.terminateDebugSession(sessionId);
                }
                this.sessionId2contrib.clear();
            })
        ]);
    }
    registerDebugAdapterContribution(contrib) {
        const { type } = contrib;
        if (this.contributors.has(type)) {
            console.warn(`Debugger with type '${type}' already registered.`);
            return disposable_1.Disposable.NULL;
        }
        this.contributors.set(type, contrib);
        return disposable_1.Disposable.create(() => this.unregisterDebugAdapterContribution(type));
    }
    unregisterDebugAdapterContribution(debugType) {
        this.contributors.delete(debugType);
    }
    registerDebugConfigurationProvider(provider) {
        const handle = provider.handle;
        this.configurationProviders.set(handle, provider);
        this.fireOnDidConfigurationProvidersChanged();
        return disposable_1.Disposable.create(() => this.unregisterDebugConfigurationProvider(handle));
    }
    unregisterDebugConfigurationProvider(handle) {
        this.configurationProviders.delete(handle);
        this.fireOnDidConfigurationProvidersChanged();
    }
    async debugTypes() {
        const debugTypes = new Set(await this.delegated.debugTypes());
        for (const contribution of this.debuggers) {
            debugTypes.add(contribution.type);
        }
        for (const debugType of this.contributors.keys()) {
            debugTypes.add(debugType);
        }
        return [...debugTypes];
    }
    async provideDebugConfigurations(debugType, workspaceFolderUri) {
        const pluginProviders = Array.from(this.configurationProviders.values()).filter(p => (p.triggerKind === plugin_api_rpc_1.DebugConfigurationProviderTriggerKind.Initial &&
            (p.type === debugType || p.type === '*') &&
            p.provideDebugConfigurations));
        if (pluginProviders.length === 0) {
            return this.delegated.provideDebugConfigurations(debugType, workspaceFolderUri);
        }
        const results = [];
        await Promise.all(pluginProviders.map(async (p) => {
            const result = await p.provideDebugConfigurations(workspaceFolderUri);
            if (result) {
                results.push(...result);
            }
        }));
        return results;
    }
    async fetchDynamicDebugConfiguration(name, providerType, folder) {
        const pluginProviders = Array.from(this.configurationProviders.values()).filter(p => (p.triggerKind === plugin_api_rpc_1.DebugConfigurationProviderTriggerKind.Dynamic &&
            p.type === providerType &&
            p.provideDebugConfigurations));
        for (const provider of pluginProviders) {
            const configurations = await provider.provideDebugConfigurations(folder);
            for (const configuration of configurations) {
                if (configuration.name === name) {
                    return configuration;
                }
            }
        }
    }
    async provideDynamicDebugConfigurations(folder) {
        const pluginProviders = Array.from(this.configurationProviders.values()).filter(p => (p.triggerKind === plugin_api_rpc_1.DebugConfigurationProviderTriggerKind.Dynamic &&
            p.provideDebugConfigurations));
        const configurationsRecord = {};
        await Promise.all(pluginProviders.map(async (provider) => {
            const configurations = await provider.provideDebugConfigurations(folder);
            let configurationsPerType = configurationsRecord[provider.type];
            configurationsPerType = configurationsPerType ? configurationsPerType.concat(configurations) : configurations;
            if (configurationsPerType.length > 0) {
                configurationsRecord[provider.type] = configurationsPerType;
            }
        }));
        return configurationsRecord;
    }
    async resolveDebugConfiguration(config, workspaceFolderUri) {
        const allProviders = Array.from(this.configurationProviders.values());
        const resolvers = allProviders
            .filter(p => p.type === config.type && !!p.resolveDebugConfiguration)
            .map(p => p.resolveDebugConfiguration);
        // Append debug type '*' at the end
        resolvers.push(...allProviders
            .filter(p => p.type === '*' && !!p.resolveDebugConfiguration)
            .map(p => p.resolveDebugConfiguration));
        const resolved = await this.resolveDebugConfigurationByResolversChain(config, workspaceFolderUri, resolvers);
        return resolved ? this.delegated.resolveDebugConfiguration(resolved, workspaceFolderUri) : resolved;
    }
    async resolveDebugConfigurationWithSubstitutedVariables(config, workspaceFolderUri) {
        const allProviders = Array.from(this.configurationProviders.values());
        const resolvers = allProviders
            .filter(p => p.type === config.type && !!p.resolveDebugConfigurationWithSubstitutedVariables)
            .map(p => p.resolveDebugConfigurationWithSubstitutedVariables);
        // Append debug type '*' at the end
        resolvers.push(...allProviders
            .filter(p => p.type === '*' && !!p.resolveDebugConfigurationWithSubstitutedVariables)
            .map(p => p.resolveDebugConfigurationWithSubstitutedVariables));
        const resolved = await this.resolveDebugConfigurationByResolversChain(config, workspaceFolderUri, resolvers);
        return resolved
            ? this.delegated.resolveDebugConfigurationWithSubstitutedVariables(resolved, workspaceFolderUri)
            : resolved;
    }
    async resolveDebugConfigurationByResolversChain(config, workspaceFolderUri, resolvers) {
        let resolved = config;
        for (const resolver of resolvers) {
            try {
                if (!resolved) {
                    // A provider has indicated to stop and process undefined or null as per specified in the vscode API
                    // https://code.visualstudio.com/api/references/vscode-api#DebugConfigurationProvider
                    break;
                }
                resolved = await resolver(workspaceFolderUri, resolved);
            }
            catch (e) {
                console.error(e);
            }
        }
        return resolved;
    }
    registerDebugger(contribution) {
        this.debuggers.push(contribution);
        return disposable_1.Disposable.create(() => {
            const index = this.debuggers.indexOf(contribution);
            if (index !== -1) {
                this.debuggers.splice(index, 1);
            }
        });
    }
    async provideDebuggerVariables(debugType) {
        for (const contribution of this.debuggers) {
            if (contribution.type === debugType) {
                const variables = contribution.variables;
                if (variables && Object.keys(variables).length > 0) {
                    return variables;
                }
            }
        }
        return {};
    }
    async getDebuggersForLanguage(language) {
        const debuggers = await this.delegated.getDebuggersForLanguage(language);
        for (const contributor of this.debuggers) {
            const languages = contributor.languages;
            if (languages && languages.indexOf(language) !== -1) {
                const { label, type } = contributor;
                debuggers.push({ type, label: label || type });
            }
        }
        return debuggers;
    }
    async getSchemaAttributes(debugType) {
        let schemas = await this.delegated.getSchemaAttributes(debugType);
        for (const contribution of this.debuggers) {
            if (contribution.configurationAttributes &&
                (contribution.type === debugType || contribution.type === '*' || debugType === '*')) {
                schemas = schemas.concat(contribution.configurationAttributes);
            }
        }
        return schemas;
    }
    async getConfigurationSnippets() {
        let snippets = await this.delegated.getConfigurationSnippets();
        for (const contribution of this.debuggers) {
            if (contribution.configurationSnippets) {
                snippets = snippets.concat(contribution.configurationSnippets);
            }
        }
        return snippets;
    }
    async createDebugSession(config, workspaceFolder) {
        const contributor = this.contributors.get(config.type);
        if (contributor) {
            const sessionId = await contributor.createDebugSession(config, workspaceFolder);
            this.sessionId2contrib.set(sessionId, contributor);
            return sessionId;
        }
        else {
            return this.delegated.createDebugSession(config, workspaceFolder);
        }
    }
    async terminateDebugSession(sessionId) {
        const contributor = this.sessionId2contrib.get(sessionId);
        if (contributor) {
            this.sessionId2contrib.delete(sessionId);
            return contributor.terminateDebugSession(sessionId);
        }
        else {
            return this.delegated.terminateDebugSession(sessionId);
        }
    }
    dispose() {
        this.toDispose.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(ws_connection_provider_1.WebSocketConnectionProvider),
    __metadata("design:type", ws_connection_provider_1.WebSocketConnectionProvider)
], PluginDebugService.prototype, "connectionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], PluginDebugService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginDebugService.prototype, "init", null);
PluginDebugService = __decorate([
    (0, inversify_1.injectable)()
], PluginDebugService);
exports.PluginDebugService = PluginDebugService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/debug/plugin-debug-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-session-contribution-registry.js":
/*!******************************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-session-contribution-registry.js ***!
  \******************************************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginDebugSessionContributionRegistry = void 0;
const debug_session_contribution_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-contribution */ "../../packages/debug/lib/browser/debug-session-contribution.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
/**
 * Plugin debug session contribution registry implementation with functionality
 * to register / unregister plugin contributions.
 */
let PluginDebugSessionContributionRegistry = class PluginDebugSessionContributionRegistry {
    constructor() {
        this.contribs = new Map();
    }
    init() {
        for (const contrib of this.contributions.getContributions()) {
            this.contribs.set(contrib.debugType, contrib);
        }
    }
    get(debugType) {
        return this.contribs.get(debugType);
    }
    registerDebugSessionContribution(contrib) {
        const { debugType } = contrib;
        if (this.contribs.has(debugType)) {
            console.warn(`Debug session contribution already registered for ${debugType}`);
            return disposable_1.Disposable.NULL;
        }
        this.contribs.set(debugType, contrib);
        return disposable_1.Disposable.create(() => this.unregisterDebugSessionContribution(debugType));
    }
    unregisterDebugSessionContribution(debugType) {
        this.contribs.delete(debugType);
    }
};
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(debug_session_contribution_1.DebugSessionContribution),
    __metadata("design:type", Object)
], PluginDebugSessionContributionRegistry.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginDebugSessionContributionRegistry.prototype, "init", null);
PluginDebugSessionContributionRegistry = __decorate([
    (0, inversify_1.injectable)()
], PluginDebugSessionContributionRegistry);
exports.PluginDebugSessionContributionRegistry = PluginDebugSessionContributionRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/debug/plugin-debug-session-contribution-registry'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-session-factory.js":
/*!****************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-session-factory.js ***!
  \****************************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginDebugSessionFactory = exports.PluginDebugSession = void 0;
const debug_session_contribution_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-contribution */ "../../packages/debug/lib/browser/debug-session-contribution.js");
const debug_session_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const debug_session_connection_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-connection */ "../../packages/debug/lib/browser/debug-session-connection.js");
class PluginDebugSession extends debug_session_1.DebugSession {
    constructor(id, options, parentSession, connection, terminalServer, editorManager, breakpoints, labelProvider, messages, fileService, terminalOptionsExt, debugContributionProvider, workspaceService) {
        super(id, options, parentSession, connection, terminalServer, editorManager, breakpoints, labelProvider, messages, fileService, debugContributionProvider, workspaceService);
        this.id = id;
        this.options = options;
        this.parentSession = parentSession;
        this.connection = connection;
        this.terminalServer = terminalServer;
        this.editorManager = editorManager;
        this.breakpoints = breakpoints;
        this.labelProvider = labelProvider;
        this.messages = messages;
        this.fileService = fileService;
        this.terminalOptionsExt = terminalOptionsExt;
        this.debugContributionProvider = debugContributionProvider;
        this.workspaceService = workspaceService;
    }
    async doCreateTerminal(terminalWidgetOptions) {
        terminalWidgetOptions = Object.assign({}, terminalWidgetOptions, this.terminalOptionsExt);
        return super.doCreateTerminal(terminalWidgetOptions);
    }
}
exports.PluginDebugSession = PluginDebugSession;
/**
 * Session factory for a client debug session that communicates with debug adapter contributed as plugin.
 * The main difference is to use a connection factory that creates [Channel](#Channel) over Rpc channel.
 */
class PluginDebugSessionFactory extends debug_session_contribution_1.DefaultDebugSessionFactory {
    constructor(terminalService, editorManager, breakpoints, labelProvider, messages, outputChannelManager, debugPreferences, connectionFactory, fileService, terminalOptionsExt, debugContributionProvider, workspaceService) {
        super();
        this.terminalService = terminalService;
        this.editorManager = editorManager;
        this.breakpoints = breakpoints;
        this.labelProvider = labelProvider;
        this.messages = messages;
        this.outputChannelManager = outputChannelManager;
        this.debugPreferences = debugPreferences;
        this.connectionFactory = connectionFactory;
        this.fileService = fileService;
        this.terminalOptionsExt = terminalOptionsExt;
        this.debugContributionProvider = debugContributionProvider;
        this.workspaceService = workspaceService;
    }
    get(sessionId, options, parentSession) {
        const connection = new debug_session_connection_1.DebugSessionConnection(sessionId, this.connectionFactory, this.getTraceOutputChannel());
        return new PluginDebugSession(sessionId, options, parentSession, connection, this.terminalService, this.editorManager, this.breakpoints, this.labelProvider, this.messages, this.fileService, this.terminalOptionsExt, this.debugContributionProvider, this.workspaceService);
    }
}
exports.PluginDebugSessionFactory = PluginDebugSessionFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/debug/plugin-debug-session-factory'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/decorations/decorations-main.js":
/*!**********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/decorations/decorations-main.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecorationsMainImpl = void 0;
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const decorations_service_1 = __webpack_require__(/*! @theia/core/lib/browser/decorations-service */ "../../packages/core/lib/browser/decorations-service.js");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.52.1/src/vs/workbench/api/browser/mainThreadDecorations.ts#L85
class DecorationRequestsQueue {
    constructor(proxy, handle) {
        this.proxy = proxy;
        this.handle = handle;
        this.idPool = 0;
        this.requests = new Map();
        this.resolver = new Map();
    }
    enqueue(uri, token) {
        const id = ++this.idPool;
        const result = new Promise(resolve => {
            this.requests.set(id, { id, uri: vscode_uri_1.URI.parse(uri.toString()) });
            this.resolver.set(id, resolve);
            this.processQueue();
        });
        token.onCancellationRequested(() => {
            this.requests.delete(id);
            this.resolver.delete(id);
        });
        return result;
    }
    processQueue() {
        if (typeof this.timer === 'number') {
            // already queued
            return;
        }
        this.timer = setTimeout(() => {
            // make request
            const requests = this.requests;
            const resolver = this.resolver;
            this.proxy.$provideDecorations(this.handle, [...requests.values()], cancellation_1.CancellationToken.None).then(data => {
                for (const [id, resolve] of resolver) {
                    resolve(data[id]);
                }
            });
            // reset
            this.requests = new Map();
            this.resolver = new Map();
            this.timer = undefined;
        }, 0);
    }
}
class DecorationsMainImpl {
    constructor(rpc, container) {
        this.providers = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DECORATIONS_EXT);
        this.decorationsService = container.get(decorations_service_1.DecorationsService);
    }
    dispose() {
        this.providers.forEach(value => value.forEach(v => v.dispose()));
        this.providers.clear();
    }
    async $registerDecorationProvider(handle) {
        const emitter = new event_1.Emitter();
        const queue = new DecorationRequestsQueue(this.proxy, handle);
        const registration = this.decorationsService.registerDecorationsProvider({
            onDidChange: emitter.event,
            provideDecorations: async (uri, token) => {
                const data = await queue.enqueue(uri, token);
                if (!data) {
                    return undefined;
                }
                const [bubble, tooltip, letter, themeColor] = data;
                return {
                    weight: 10,
                    bubble: bubble !== null && bubble !== void 0 ? bubble : false,
                    colorId: themeColor === null || themeColor === void 0 ? void 0 : themeColor.id,
                    tooltip,
                    letter
                };
            }
        });
        this.providers.set(handle, [emitter, registration]);
    }
    $onDidChange(handle, resources) {
        const providerSet = this.providers.get(handle);
        if (providerSet) {
            const [emitter] = providerSet;
            emitter.fire(resources && resources.map(r => new uri_1.default(vscode_uri_1.URI.revive(r).toString())));
        }
    }
    $unregisterDecorationProvider(handle) {
        const provider = this.providers.get(handle);
        if (provider) {
            provider.forEach(p => p.dispose());
            this.providers.delete(handle);
        }
    }
}
exports.DecorationsMainImpl = DecorationsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/decorations/decorations-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/dialogs-main.js":
/*!******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/dialogs-main.js ***!
  \******************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DialogsMainImpl = void 0;
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const file_upload_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-upload-service */ "../../packages/filesystem/lib/browser/file-upload-service.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class DialogsMainImpl {
    constructor(rpc, container) {
        this.workspaceService = container.get(browser_2.WorkspaceService);
        this.fileService = container.get(file_service_1.FileService);
        this.environments = container.get(env_variables_1.EnvVariablesServer);
        this.fileDialogService = container.get(browser_1.FileDialogService);
        this.uploadService = container.get(file_upload_service_1.FileUploadService);
    }
    async getRootStat(defaultUri) {
        let rootStat;
        // Try to use default URI as root
        if (defaultUri) {
            try {
                rootStat = await this.fileService.resolve(new uri_1.default(defaultUri));
            }
            catch {
                rootStat = undefined;
            }
            // Try to use as root the parent folder of existing file URI/non existing URI
            if (rootStat && !rootStat.isDirectory || !rootStat) {
                try {
                    rootStat = await this.fileService.resolve(new uri_1.default(defaultUri).parent);
                }
                catch {
                    rootStat = undefined;
                }
            }
        }
        // Try to use workspace service root if there is no pre-configured URI
        if (!rootStat) {
            rootStat = (await this.workspaceService.roots)[0];
        }
        // Try to use current user home if root folder is still not taken
        if (!rootStat) {
            const homeDirUri = await this.environments.getHomeDirUri();
            try {
                rootStat = await this.fileService.resolve(new uri_1.default(homeDirUri));
            }
            catch { }
        }
        return rootStat;
    }
    async $showOpenDialog(options) {
        const rootStat = await this.getRootStat(options.defaultUri ? options.defaultUri : undefined);
        if (!rootStat) {
            throw new Error('Unable to find the rootStat');
        }
        try {
            const canSelectFiles = typeof options.canSelectFiles === 'boolean' ? options.canSelectFiles : true;
            const canSelectFolders = typeof options.canSelectFolders === 'boolean' ? options.canSelectFolders : true;
            let title = options.title;
            if (!title) {
                if (canSelectFiles && canSelectFolders) {
                    title = 'Open';
                }
                else {
                    if (canSelectFiles) {
                        title = 'Open File';
                    }
                    else {
                        title = 'Open Folder';
                    }
                    if (options.canSelectMany) {
                        title += '(s)';
                    }
                }
            }
            // Create open file dialog props
            const dialogProps = {
                title: title,
                openLabel: options.openLabel,
                canSelectFiles: options.canSelectFiles,
                canSelectFolders: options.canSelectFolders,
                canSelectMany: options.canSelectMany,
                filters: options.filters
            };
            const result = await this.fileDialogService.showOpenDialog(dialogProps, rootStat);
            if (Array.isArray(result)) {
                return result.map(uri => uri.path.toString());
            }
            else {
                return result ? [result].map(uri => uri.path.toString()) : undefined;
            }
        }
        catch (error) {
            console.error(error);
        }
        return undefined;
    }
    async $showSaveDialog(options) {
        var _a;
        const rootStat = await this.getRootStat(options.defaultUri ? options.defaultUri : undefined);
        // File name field should be empty unless the URI is a file
        let fileNameValue = '';
        if (options.defaultUri) {
            let defaultURIStat;
            try {
                defaultURIStat = await this.fileService.resolve(new uri_1.default(options.defaultUri));
            }
            catch { }
            if (defaultURIStat && !defaultURIStat.isDirectory || !defaultURIStat) {
                fileNameValue = new uri_1.default(options.defaultUri).path.base;
            }
        }
        try {
            // Create save file dialog props
            const dialogProps = {
                title: (_a = options.title) !== null && _a !== void 0 ? _a : core_1.nls.localizeByDefault('Save'),
                saveLabel: options.saveLabel,
                filters: options.filters,
                inputValue: fileNameValue
            };
            const result = await this.fileDialogService.showSaveDialog(dialogProps, rootStat);
            if (result) {
                return result.path.toString();
            }
            return undefined;
        }
        catch (error) {
            console.error(error);
        }
        return undefined;
    }
    async $showUploadDialog(options) {
        const rootStat = await this.getRootStat(options.defaultUri);
        // Fail if root not fount
        if (!rootStat) {
            throw new Error('Failed to resolve base directory where files should be uploaded');
        }
        const uploadResult = await this.uploadService.upload(rootStat.resource.toString());
        if (uploadResult) {
            return uploadResult.uploaded;
        }
        return undefined;
    }
}
exports.DialogsMainImpl = DialogsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/dialogs-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/dialogs/modal-notification.js":
/*!********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/dialogs/modal-notification.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.ModalNotification = exports.MessageType = void 0;
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
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const dialogs_1 = __webpack_require__(/*! @theia/core/lib/browser/dialogs */ "../../packages/core/lib/browser/dialogs.js");
__webpack_require__(/*! ../../../../src/main/browser/dialogs/style/modal-notification.css */ "../../packages/plugin-ext/src/main/browser/dialogs/style/modal-notification.css");
const frontend_application_config_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-config-provider */ "../../packages/core/lib/browser/frontend-application-config-provider.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
var MessageType;
(function (MessageType) {
    MessageType["Error"] = "error";
    MessageType["Warning"] = "warning";
    MessageType["Info"] = "info";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
const NOTIFICATION = 'modal-Notification';
const ICON = 'icon';
const TEXT = 'text';
const DETAIL = 'detail';
let ModalNotification = class ModalNotification extends dialogs_1.AbstractDialog {
    constructor() {
        super({ title: frontend_application_config_provider_1.FrontendApplicationConfigProvider.get().applicationName });
    }
    onCloseRequest(msg) {
        this.actionTitle = undefined;
        this.accept();
    }
    get value() {
        return this.actionTitle;
    }
    showDialog(messageType, text, options, actions) {
        this.contentNode.appendChild(this.createMessageNode(messageType, text, options, actions));
        return this.open();
    }
    createMessageNode(messageType, text, options, actions) {
        const messageNode = document.createElement('div');
        messageNode.classList.add(NOTIFICATION);
        const iconContainer = messageNode.appendChild(document.createElement('div'));
        iconContainer.classList.add(ICON);
        const iconElement = iconContainer.appendChild(document.createElement('i'));
        iconElement.classList.add(...this.toIconClass(messageType), messageType.toString());
        const textContainer = messageNode.appendChild(document.createElement('div'));
        textContainer.classList.add(TEXT);
        const textElement = textContainer.appendChild(document.createElement('p'));
        textElement.textContent = text;
        if (options.detail) {
            const detailContainer = textContainer.appendChild(document.createElement('div'));
            detailContainer.classList.add(DETAIL);
            const detailElement = detailContainer.appendChild(document.createElement('p'));
            detailElement.textContent = options.detail;
        }
        actions.forEach((action, index) => {
            const button = index === 0
                ? this.appendAcceptButton(action.title)
                : this.createButton(action.title);
            button.classList.add('main');
            this.controlPanel.appendChild(button);
            this.addKeyListener(button, browser_1.Key.ENTER, () => {
                this.actionTitle = action.title;
                this.accept();
            }, 'click');
        });
        if (actions.length <= 0) {
            this.appendAcceptButton();
        }
        else if (!actions.some(action => action.isCloseAffordance === true)) {
            this.appendCloseButton(nls_1.nls.localizeByDefault('Close'));
        }
        return messageNode;
    }
    toIconClass(icon) {
        if (icon === MessageType.Error) {
            return (0, browser_1.codiconArray)('error');
        }
        if (icon === MessageType.Warning) {
            return (0, browser_1.codiconArray)('warning');
        }
        return (0, browser_1.codiconArray)('info');
    }
};
ModalNotification = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ModalNotification);
exports.ModalNotification = ModalNotification;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/dialogs/modal-notification'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/editors-and-documents-main.js":
/*!********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/editors-and-documents-main.js ***!
  \********************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorsAndDocumentsMain = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const text_editor_model_service_1 = __webpack_require__(/*! ./text-editor-model-service */ "../../packages/plugin-ext/lib/main/browser/text-editor-model-service.js");
const monaco_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const text_editor_main_1 = __webpack_require__(/*! ./text-editor-main */ "../../packages/plugin-ext/lib/main/browser/text-editor-main.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
class EditorsAndDocumentsMain {
    constructor(rpc, container) {
        this.textEditors = new Map();
        this.onTextEditorAddEmitter = new core_1.Emitter();
        this.onTextEditorRemoveEmitter = new core_1.Emitter();
        this.onDocumentAddEmitter = new core_1.Emitter();
        this.onDocumentRemoveEmitter = new core_1.Emitter();
        this.onTextEditorAdd = this.onTextEditorAddEmitter.event;
        this.onTextEditorRemove = this.onTextEditorRemoveEmitter.event;
        this.onDocumentAdd = this.onDocumentAddEmitter.event;
        this.onDocumentRemove = this.onDocumentRemoveEmitter.event;
        this.toDispose = new core_1.DisposableCollection(disposable_1.Disposable.create(() => this.textEditors.clear()));
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.EDITORS_AND_DOCUMENTS_EXT);
        this.editorService = container.get(browser_1.EditorManager);
        this.modelService = container.get(text_editor_model_service_1.EditorModelService);
        this.stateComputer = new EditorAndDocumentStateComputer(d => this.onDelta(d), this.editorService, this.modelService);
        this.toDispose.push(this.stateComputer);
        this.toDispose.push(this.onTextEditorAddEmitter);
        this.toDispose.push(this.onTextEditorRemoveEmitter);
        this.toDispose.push(this.onDocumentAddEmitter);
        this.toDispose.push(this.onDocumentRemoveEmitter);
    }
    listen() {
        this.stateComputer.listen();
    }
    dispose() {
        this.toDispose.dispose();
    }
    onDelta(delta) {
        const removedEditors = new Array();
        const addedEditors = new Array();
        const removedDocuments = delta.removedDocuments.map(d => d.textEditorModel.uri);
        for (const editor of delta.addedEditors) {
            const textEditorMain = new text_editor_main_1.TextEditorMain(editor.id, editor.editor.getControl().getModel(), editor.editor);
            this.textEditors.set(editor.id, textEditorMain);
            this.toDispose.push(textEditorMain);
            addedEditors.push(textEditorMain);
        }
        for (const { id } of delta.removedEditors) {
            const textEditorMain = this.textEditors.get(id);
            if (textEditorMain) {
                textEditorMain.dispose();
                this.textEditors.delete(id);
                removedEditors.push(id);
            }
        }
        const deltaExt = {};
        let empty = true;
        if (delta.newActiveEditor !== undefined) {
            empty = false;
            deltaExt.newActiveEditor = delta.newActiveEditor;
        }
        if (removedDocuments.length > 0) {
            empty = false;
            deltaExt.removedDocuments = removedDocuments;
        }
        if (removedEditors.length > 0) {
            empty = false;
            deltaExt.removedEditors = removedEditors;
        }
        if (delta.addedDocuments.length > 0) {
            empty = false;
            deltaExt.addedDocuments = delta.addedDocuments.map(d => this.toModelAddData(d));
        }
        if (delta.addedEditors.length > 0) {
            empty = false;
            deltaExt.addedEditors = addedEditors.map(e => this.toTextEditorAddData(e));
        }
        if (!empty) {
            this.proxy.$acceptEditorsAndDocumentsDelta(deltaExt);
            this.onDocumentRemoveEmitter.fire(removedDocuments);
            this.onDocumentAddEmitter.fire(delta.addedDocuments);
            this.onTextEditorRemoveEmitter.fire(removedEditors);
            this.onTextEditorAddEmitter.fire(addedEditors);
        }
    }
    toModelAddData(model) {
        return {
            uri: model.textEditorModel.uri,
            versionId: model.textEditorModel.getVersionId(),
            lines: model.textEditorModel.getLinesContent(),
            languageId: model.getLanguageId(),
            EOL: model.textEditorModel.getEOL(),
            modeId: model.languageId,
            isDirty: model.dirty
        };
    }
    toTextEditorAddData(textEditor) {
        const properties = textEditor.getProperties();
        return {
            id: textEditor.getId(),
            documentUri: textEditor.getModel().uri,
            options: properties.options,
            selections: properties.selections,
            visibleRanges: properties.visibleRanges,
            editorPosition: this.findEditorPosition(textEditor)
        };
    }
    findEditorPosition(editor) {
        return plugin_api_rpc_1.EditorPosition.ONE; // TODO: fix this when Theia has support splitting editors
    }
    getEditor(id) {
        return this.textEditors.get(id);
    }
    saveAll(includeUntitled) {
        return this.modelService.saveAll(includeUntitled);
    }
    hideEditor(id) {
        for (const editorWidget of this.editorService.all) {
            const monacoEditor = monaco_editor_1.MonacoEditor.get(editorWidget);
            if (monacoEditor) {
                if (id === new EditorSnapshot(monacoEditor).id) {
                    editorWidget.close();
                    break;
                }
            }
        }
        return Promise.resolve();
    }
}
exports.EditorsAndDocumentsMain = EditorsAndDocumentsMain;
class EditorAndDocumentStateComputer {
    constructor(callback, editorService, modelService) {
        this.callback = callback;
        this.editorService = editorService;
        this.modelService = modelService;
        this.editors = new Map();
        this.toDispose = new core_1.DisposableCollection(disposable_1.Disposable.create(() => this.currentState = undefined));
    }
    listen() {
        if (this.toDispose.disposed) {
            return;
        }
        this.toDispose.push(this.editorService.onCreated(widget => {
            this.onTextEditorAdd(widget);
            this.update();
        }));
        this.toDispose.push(this.editorService.onCurrentEditorChanged(() => this.update()));
        this.toDispose.push(this.modelService.onModelAdded(this.onModelAdded, this));
        this.toDispose.push(this.modelService.onModelRemoved(() => this.update()));
        for (const widget of this.editorService.all) {
            this.onTextEditorAdd(widget);
        }
        this.update();
    }
    dispose() {
        this.toDispose.dispose();
    }
    onModelAdded(model) {
        if (!this.currentState) {
            this.update();
            return;
        }
        this.currentState = new EditorAndDocumentState(this.currentState.documents.add(model), this.currentState.editors, this.currentState.activeEditor);
        this.callback(new EditorAndDocumentStateDelta([], [model], [], [], undefined, undefined));
    }
    onTextEditorAdd(widget) {
        const editor = monaco_editor_1.MonacoEditor.get(widget);
        if (!editor) {
            return;
        }
        const id = editor.getControl().getId();
        const toDispose = new core_1.DisposableCollection(editor.onDispose(() => this.onTextEditorRemove(editor)), disposable_1.Disposable.create(() => this.editors.delete(id)));
        this.editors.set(id, toDispose);
        this.toDispose.push(toDispose);
    }
    onTextEditorRemove(e) {
        const toDispose = this.editors.get(e.getControl().getId());
        if (toDispose) {
            toDispose.dispose();
            this.update();
        }
    }
    update() {
        const models = new Set();
        for (const model of this.modelService.getModels()) {
            models.add(model);
        }
        let activeId = null;
        const activeEditor = monaco_editor_1.MonacoEditor.getCurrent(this.editorService);
        const editors = new Map();
        for (const widget of this.editorService.all) {
            const editor = monaco_editor_1.MonacoEditor.get(widget);
            // VS Code tracks only visible widgets
            if (!editor || !widget.isVisible) {
                continue;
            }
            const model = editor.getControl().getModel();
            if (model && !model.isDisposed()) {
                const editorSnapshot = new EditorSnapshot(editor);
                editors.set(editorSnapshot.id, editorSnapshot);
                if (activeEditor === editor) {
                    activeId = editorSnapshot.id;
                }
            }
        }
        const newState = new EditorAndDocumentState(models, editors, activeId);
        const delta = EditorAndDocumentState.compute(this.currentState, newState);
        if (!delta.isEmpty) {
            this.currentState = newState;
            this.callback(delta);
        }
    }
}
class EditorAndDocumentStateDelta {
    constructor(removedDocuments, addedDocuments, removedEditors, addedEditors, oldActiveEditor, newActiveEditor) {
        this.removedDocuments = removedDocuments;
        this.addedDocuments = addedDocuments;
        this.removedEditors = removedEditors;
        this.addedEditors = addedEditors;
        this.oldActiveEditor = oldActiveEditor;
        this.newActiveEditor = newActiveEditor;
        this.isEmpty = this.removedDocuments.length === 0
            && this.addedDocuments.length === 0
            && this.addedEditors.length === 0
            && this.removedEditors.length === 0
            && this.newActiveEditor === this.oldActiveEditor;
    }
}
class EditorAndDocumentState {
    constructor(documents, editors, activeEditor) {
        this.documents = documents;
        this.editors = editors;
        this.activeEditor = activeEditor;
    }
    static compute(before, after) {
        if (!before) {
            return new EditorAndDocumentStateDelta([], Array.from(after.documents), [], Array.from(after.editors.values()), undefined, after.activeEditor);
        }
        const documentDelta = Delta.ofSets(before.documents, after.documents);
        const editorDelta = Delta.ofMaps(before.editors, after.editors);
        const oldActiveEditor = before.activeEditor !== after.activeEditor ? before.activeEditor : undefined;
        const newActiveEditor = before.activeEditor !== after.activeEditor ? after.activeEditor : undefined;
        return new EditorAndDocumentStateDelta(documentDelta.removed, documentDelta.added, editorDelta.removed, editorDelta.added, oldActiveEditor, newActiveEditor);
    }
}
class EditorSnapshot {
    constructor(editor) {
        this.editor = editor;
        this.id = `${editor.getControl().getId()},${editor.getControl().getModel().id}`;
    }
}
var Delta;
(function (Delta) {
    function ofSets(before, after) {
        const removed = [];
        const added = [];
        before.forEach(element => {
            if (!after.has(element)) {
                removed.push(element);
            }
        });
        after.forEach(element => {
            if (!before.has(element)) {
                added.push(element);
            }
        });
        return { removed, added };
    }
    Delta.ofSets = ofSets;
    function ofMaps(before, after) {
        const removed = [];
        const added = [];
        before.forEach((value, index) => {
            if (!after.has(index)) {
                removed.push(value);
            }
        });
        after.forEach((value, index) => {
            if (!before.has(index)) {
                added.push(value);
            }
        });
        return { removed, added };
    }
    Delta.ofMaps = ofMaps;
})(Delta || (Delta = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/editors-and-documents-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/env-main.js":
/*!**************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/env-main.js ***!
  \**************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getQueryParameters = exports.EnvMainImpl = void 0;
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const types_impl_1 = __webpack_require__(/*! ../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
class EnvMainImpl {
    constructor(rpc, container) {
        this.envVariableServer = container.get(env_variables_1.EnvVariablesServer);
    }
    $getEnvVariable(envVarName) {
        return this.envVariableServer.getValue(envVarName).then(result => result ? result.value : undefined);
    }
    async $getClientOperatingSystem() {
        if (core_1.isWindows) {
            return types_impl_1.OperatingSystem.Windows;
        }
        if (core_1.isOSX) {
            return types_impl_1.OperatingSystem.OSX;
        }
        return types_impl_1.OperatingSystem.Linux;
    }
}
exports.EnvMainImpl = EnvMainImpl;
/**
 * Returns query parameters from current page.
 */
function getQueryParameters() {
    const queryParameters = {};
    if (window.location.search !== '') {
        const queryParametersString = window.location.search.substring(1); // remove question mark
        const params = queryParametersString.split('&');
        for (const pair of params) {
            if (pair === '') {
                continue;
            }
            const keyValue = pair.split('=');
            let key = keyValue[0];
            let value = keyValue[1] ? keyValue[1] : '';
            try {
                key = decodeURIComponent(key);
                if (value !== '') {
                    value = decodeURIComponent(value);
                }
            }
            catch (error) {
                // skip malformed URI sequence
                continue;
            }
            const existedValue = queryParameters[key];
            if (existedValue) {
                if (existedValue instanceof Array) {
                    existedValue.push(value);
                }
                else {
                    // existed value is string
                    queryParameters[key] = [existedValue, value];
                }
            }
            else {
                queryParameters[key] = value;
            }
        }
    }
    return queryParameters;
}
exports.getQueryParameters = getQueryParameters;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/env-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/file-system-main-impl.js":
/*!***************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/file-system-main-impl.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/api/browser/mainThreadFileSystem.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileSystemMainImpl = void 0;
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-explicit-any */
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const buffer_1 = __webpack_require__(/*! @theia/core/lib/common/buffer */ "../../packages/core/lib/common/buffer.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const files_1 = __webpack_require__(/*! @theia/filesystem/lib/common/files */ "../../packages/filesystem/lib/common/files.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
class FileSystemMainImpl {
    constructor(rpc, container) {
        this._fileProvider = new Map();
        this._disposables = new disposable_1.DisposableCollection();
        this._proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.FILE_SYSTEM_EXT);
        this._fileService = container.get(file_service_1.FileService);
        for (const { scheme, capabilities } of this._fileService.listCapabilities()) {
            this._proxy.$acceptProviderInfos(scheme, capabilities);
        }
        this._disposables.push(this._fileService.onDidChangeFileSystemProviderRegistrations(e => { var _a; return this._proxy.$acceptProviderInfos(e.scheme, (_a = e.provider) === null || _a === void 0 ? void 0 : _a.capabilities); }));
        this._disposables.push(this._fileService.onDidChangeFileSystemProviderCapabilities(e => this._proxy.$acceptProviderInfos(e.scheme, e.provider.capabilities)));
        this._disposables.push(disposable_1.Disposable.create(() => this._fileProvider.forEach(value => value.dispose())));
        this._disposables.push(disposable_1.Disposable.create(() => this._fileProvider.clear()));
    }
    dispose() {
        this._disposables.dispose();
    }
    $registerFileSystemProvider(handle, scheme, capabilities) {
        this._fileProvider.set(handle, new RemoteFileSystemProvider(this._fileService, scheme, capabilities, handle, this._proxy));
    }
    $unregisterProvider(handle) {
        const provider = this._fileProvider.get(handle);
        if (provider) {
            provider.dispose();
            this._fileProvider.delete(handle);
        }
    }
    $onFileSystemChange(handle, changes) {
        const fileProvider = this._fileProvider.get(handle);
        if (!fileProvider) {
            throw new Error('Unknown file provider');
        }
        fileProvider.$onFileSystemChange(changes);
    }
    // --- consumer fs, vscode.workspace.fs
    $stat(uri) {
        return this._fileService.resolve(new uri_1.default(vscode_uri_1.URI.revive(uri)), { resolveMetadata: true }).then(stat => ({
            ctime: stat.ctime,
            mtime: stat.mtime,
            size: stat.size,
            type: files_1.FileStat.asFileType(stat)
        })).catch(FileSystemMainImpl._handleError);
    }
    $readdir(uri) {
        return this._fileService.resolve(new uri_1.default(vscode_uri_1.URI.revive(uri)), { resolveMetadata: false }).then(stat => {
            if (!stat.isDirectory) {
                const err = new Error(stat.name);
                err.name = files_1.FileSystemProviderErrorCode.FileNotADirectory;
                throw err;
            }
            return !stat.children ? [] : stat.children.map(child => [child.name, files_1.FileStat.asFileType(child)]);
        }).catch(FileSystemMainImpl._handleError);
    }
    $readFile(uri) {
        return this._fileService.readFile(new uri_1.default(vscode_uri_1.URI.revive(uri))).then(file => file.value).catch(FileSystemMainImpl._handleError);
    }
    $writeFile(uri, content) {
        return this._fileService.writeFile(new uri_1.default(vscode_uri_1.URI.revive(uri)), content)
            .then(() => undefined).catch(FileSystemMainImpl._handleError);
    }
    $rename(source, target, opts) {
        return this._fileService.move(new uri_1.default(vscode_uri_1.URI.revive(source)), new uri_1.default(vscode_uri_1.URI.revive(target)), {
            ...opts,
            fromUserGesture: false
        }).then(() => undefined).catch(FileSystemMainImpl._handleError);
    }
    $copy(source, target, opts) {
        return this._fileService.copy(new uri_1.default(vscode_uri_1.URI.revive(source)), new uri_1.default(vscode_uri_1.URI.revive(target)), {
            ...opts,
            fromUserGesture: false
        }).then(() => undefined).catch(FileSystemMainImpl._handleError);
    }
    $mkdir(uri) {
        return this._fileService.createFolder(new uri_1.default(vscode_uri_1.URI.revive(uri)), { fromUserGesture: false })
            .then(() => undefined).catch(FileSystemMainImpl._handleError);
    }
    $delete(uri, opts) {
        return this._fileService.delete(new uri_1.default(vscode_uri_1.URI.revive(uri)), opts).catch(FileSystemMainImpl._handleError);
    }
    static _handleError(err) {
        if (err instanceof files_1.FileOperationError) {
            switch (err.fileOperationResult) {
                case 1 /* FILE_NOT_FOUND */:
                    err.name = files_1.FileSystemProviderErrorCode.FileNotFound;
                    break;
                case 0 /* FILE_IS_DIRECTORY */:
                    err.name = files_1.FileSystemProviderErrorCode.FileIsADirectory;
                    break;
                case 6 /* FILE_PERMISSION_DENIED */:
                    err.name = files_1.FileSystemProviderErrorCode.NoPermissions;
                    break;
                case 4 /* FILE_MOVE_CONFLICT */:
                    err.name = files_1.FileSystemProviderErrorCode.FileExists;
                    break;
            }
        }
        throw err;
    }
}
exports.FileSystemMainImpl = FileSystemMainImpl;
class RemoteFileSystemProvider {
    constructor(fileService, scheme, capabilities, _handle, _proxy) {
        this._handle = _handle;
        this._proxy = _proxy;
        this._onDidChange = new event_1.Emitter();
        this.onDidChangeFile = this._onDidChange.event;
        this.onFileWatchError = new event_1.Emitter().event; // dummy, never fired
        this.onDidChangeCapabilities = event_1.Event.None;
        this.capabilities = capabilities;
        this._registration = fileService.registerProvider(scheme, this);
    }
    dispose() {
        this._registration.dispose();
        this._onDidChange.dispose();
    }
    watch(resource, opts) {
        const session = Math.random();
        this._proxy.$watch(this._handle, session, resource['codeUri'], opts);
        return disposable_1.Disposable.create(() => {
            this._proxy.$unwatch(this._handle, session);
        });
    }
    $onFileSystemChange(changes) {
        this._onDidChange.fire(changes.map(RemoteFileSystemProvider._createFileChange));
    }
    static _createFileChange(dto) {
        return { resource: new uri_1.default(vscode_uri_1.URI.revive(dto.resource)), type: dto.type };
    }
    // --- forwarding calls
    stat(resource) {
        return this._proxy.$stat(this._handle, resource['codeUri']).then(undefined, err => {
            throw err;
        });
    }
    readFile(resource) {
        return this._proxy.$readFile(this._handle, resource['codeUri']).then(buffer => buffer.buffer);
    }
    writeFile(resource, content, opts) {
        return this._proxy.$writeFile(this._handle, resource['codeUri'], buffer_1.BinaryBuffer.wrap(content), opts);
    }
    delete(resource, opts) {
        return this._proxy.$delete(this._handle, resource['codeUri'], opts);
    }
    mkdir(resource) {
        return this._proxy.$mkdir(this._handle, resource['codeUri']);
    }
    readdir(resource) {
        return this._proxy.$readdir(this._handle, resource['codeUri']);
    }
    rename(resource, target, opts) {
        return this._proxy.$rename(this._handle, resource['codeUri'], target['codeUri'], opts);
    }
    copy(resource, target, opts) {
        return this._proxy.$copy(this._handle, resource['codeUri'], target['codeUri'], opts);
    }
    open(resource, opts) {
        return this._proxy.$open(this._handle, resource['codeUri'], opts);
    }
    close(fd) {
        return this._proxy.$close(this._handle, fd);
    }
    read(fd, pos, data, offset, length) {
        return this._proxy.$read(this._handle, fd, pos, length).then(readData => {
            data.set(readData.buffer, offset);
            return readData.byteLength;
        });
    }
    write(fd, pos, data, offset, length) {
        return this._proxy.$write(this._handle, fd, pos, buffer_1.BinaryBuffer.wrap(data).slice(offset, offset + length));
    }
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/file-system-main-impl'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/keybindings/keybindings-contribution-handler.js":
/*!**************************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/keybindings/keybindings-contribution-handler.js ***!
  \**************************************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeybindingsContributionPointHandler = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const keybinding_1 = __webpack_require__(/*! @theia/core/lib/browser/keybinding */ "../../packages/core/lib/browser/keybinding.js");
const os_1 = __webpack_require__(/*! @theia/core/lib/common/os */ "../../packages/core/lib/common/os.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let KeybindingsContributionPointHandler = class KeybindingsContributionPointHandler {
    handle(contributions) {
        if (!contributions || !contributions.keybindings) {
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new core_1.DisposableCollection();
        for (const raw of contributions.keybindings) {
            const keybinding = this.toKeybinding(raw);
            if (keybinding) {
                toDispose.push(this.keybindingRegistry.registerKeybinding(keybinding));
            }
        }
        return toDispose;
    }
    toKeybinding(pluginKeybinding) {
        const keybinding = this.toOSKeybinding(pluginKeybinding);
        if (!keybinding) {
            return undefined;
        }
        const { command, when, args } = pluginKeybinding;
        return { keybinding, command, when, args };
    }
    toOSKeybinding(pluginKeybinding) {
        let keybinding;
        const os = os_1.OS.type();
        if (os === os_1.OS.Type.Windows) {
            keybinding = pluginKeybinding.win;
        }
        else if (os === os_1.OS.Type.OSX) {
            keybinding = pluginKeybinding.mac;
        }
        else {
            keybinding = pluginKeybinding.linux;
        }
        return keybinding || pluginKeybinding.keybinding;
    }
};
__decorate([
    (0, inversify_1.inject)(keybinding_1.KeybindingRegistry),
    __metadata("design:type", keybinding_1.KeybindingRegistry)
], KeybindingsContributionPointHandler.prototype, "keybindingRegistry", void 0);
KeybindingsContributionPointHandler = __decorate([
    (0, inversify_1.injectable)()
], KeybindingsContributionPointHandler);
exports.KeybindingsContributionPointHandler = KeybindingsContributionPointHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/keybindings/keybindings-contribution-handler'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/label-service-main.js":
/*!************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/label-service-main.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.LabelServiceMainImpl = void 0;
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
class LabelServiceMainImpl {
    constructor(container) {
        this.resourceLabelFormatters = new Map();
        this.contributionProvider = container.getNamed(common_1.ContributionProvider, browser_1.LabelProviderContribution);
    }
    $registerResourceLabelFormatter(handle, formatter) {
        // Dynamically registered formatters should have priority over those contributed via package.json
        formatter.priority = true;
        const disposables = new disposable_1.DisposableCollection();
        for (const contribution of this.contributionProvider.getContributions()) {
            if (contribution instanceof browser_1.DefaultUriLabelProviderContribution) {
                disposables.push(contribution.registerFormatter(formatter));
            }
        }
        this.resourceLabelFormatters.set(handle, disposables);
    }
    $unregisterResourceLabelFormatter(handle) {
        const toDispose = this.resourceLabelFormatters.get(handle);
        if (toDispose) {
            toDispose.dispose();
        }
        this.resourceLabelFormatters.delete(handle);
    }
}
exports.LabelServiceMainImpl = LabelServiceMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/label-service-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/localization-main.js":
/*!***********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/localization-main.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.LocalizationMainImpl = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const language_pack_service_1 = __webpack_require__(/*! ../../common/language-pack-service */ "../../packages/plugin-ext/lib/common/language-pack-service.js");
class LocalizationMainImpl {
    constructor(container) {
        this.languagePackService = container.get(language_pack_service_1.LanguagePackService);
    }
    async $fetchBundle(id) {
        var _a;
        const bundle = await this.languagePackService.getBundle(id, (_a = core_1.nls.locale) !== null && _a !== void 0 ? _a : core_1.nls.defaultLocale);
        return bundle;
    }
}
exports.LocalizationMainImpl = LocalizationMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/localization-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/main-context.js":
/*!******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/main-context.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setUpPluginApi = void 0;
const command_registry_main_1 = __webpack_require__(/*! ./command-registry-main */ "../../packages/plugin-ext/lib/main/browser/command-registry-main.js");
const preference_registry_main_1 = __webpack_require__(/*! ./preference-registry-main */ "../../packages/plugin-ext/lib/main/browser/preference-registry-main.js");
const quick_open_main_1 = __webpack_require__(/*! ./quick-open-main */ "../../packages/plugin-ext/lib/main/browser/quick-open-main.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const message_registry_main_1 = __webpack_require__(/*! ./message-registry-main */ "../../packages/plugin-ext/lib/main/browser/message-registry-main.js");
const window_state_main_1 = __webpack_require__(/*! ./window-state-main */ "../../packages/plugin-ext/lib/main/browser/window-state-main.js");
const workspace_main_1 = __webpack_require__(/*! ./workspace-main */ "../../packages/plugin-ext/lib/main/browser/workspace-main.js");
const status_bar_message_registry_main_1 = __webpack_require__(/*! ./status-bar-message-registry-main */ "../../packages/plugin-ext/lib/main/browser/status-bar-message-registry-main.js");
const env_main_1 = __webpack_require__(/*! ./env-main */ "../../packages/plugin-ext/lib/main/browser/env-main.js");
const editors_and_documents_main_1 = __webpack_require__(/*! ./editors-and-documents-main */ "../../packages/plugin-ext/lib/main/browser/editors-and-documents-main.js");
const terminal_main_1 = __webpack_require__(/*! ./terminal-main */ "../../packages/plugin-ext/lib/main/browser/terminal-main.js");
const dialogs_main_1 = __webpack_require__(/*! ./dialogs-main */ "../../packages/plugin-ext/lib/main/browser/dialogs-main.js");
const tree_views_main_1 = __webpack_require__(/*! ./view/tree-views-main */ "../../packages/plugin-ext/lib/main/browser/view/tree-views-main.js");
const notification_main_1 = __webpack_require__(/*! ./notification-main */ "../../packages/plugin-ext/lib/main/browser/notification-main.js");
const connection_1 = __webpack_require__(/*! ../../common/connection */ "../../packages/plugin-ext/lib/common/connection.js");
const webviews_main_1 = __webpack_require__(/*! ./webviews-main */ "../../packages/plugin-ext/lib/main/browser/webviews-main.js");
const tasks_main_1 = __webpack_require__(/*! ./tasks-main */ "../../packages/plugin-ext/lib/main/browser/tasks-main.js");
const plugin_storage_1 = __webpack_require__(/*! ./plugin-storage */ "../../packages/plugin-ext/lib/main/browser/plugin-storage.js");
const debug_main_1 = __webpack_require__(/*! ./debug/debug-main */ "../../packages/plugin-ext/lib/main/browser/debug/debug-main.js");
const file_system_main_impl_1 = __webpack_require__(/*! ./file-system-main-impl */ "../../packages/plugin-ext/lib/main/browser/file-system-main-impl.js");
const scm_main_1 = __webpack_require__(/*! ./scm-main */ "../../packages/plugin-ext/lib/main/browser/scm-main.js");
const decorations_main_1 = __webpack_require__(/*! ./decorations/decorations-main */ "../../packages/plugin-ext/lib/main/browser/decorations/decorations-main.js");
const clipboard_main_1 = __webpack_require__(/*! ./clipboard-main */ "../../packages/plugin-ext/lib/main/browser/clipboard-main.js");
const documents_main_1 = __webpack_require__(/*! ./documents-main */ "../../packages/plugin-ext/lib/main/browser/documents-main.js");
const text_editors_main_1 = __webpack_require__(/*! ./text-editors-main */ "../../packages/plugin-ext/lib/main/browser/text-editors-main.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const text_editor_model_service_1 = __webpack_require__(/*! ./text-editor-model-service */ "../../packages/plugin-ext/lib/main/browser/text-editor-model-service.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const application_shell_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/application-shell */ "../../packages/core/lib/browser/shell/application-shell.js");
const monaco_bulk_edit_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-bulk-edit-service */ "../../packages/monaco/lib/browser/monaco-bulk-edit-service.js");
const monaco_editor_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-service */ "../../packages/monaco/lib/browser/monaco-editor-service.js");
const main_file_system_event_service_1 = __webpack_require__(/*! ./main-file-system-event-service */ "../../packages/plugin-ext/lib/main/browser/main-file-system-event-service.js");
const label_service_main_1 = __webpack_require__(/*! ./label-service-main */ "../../packages/plugin-ext/lib/main/browser/label-service-main.js");
const timeline_main_1 = __webpack_require__(/*! ./timeline-main */ "../../packages/plugin-ext/lib/main/browser/timeline-main.js");
const authentication_main_1 = __webpack_require__(/*! ./authentication-main */ "../../packages/plugin-ext/lib/main/browser/authentication-main.js");
const theming_main_1 = __webpack_require__(/*! ./theming-main */ "../../packages/plugin-ext/lib/main/browser/theming-main.js");
const comments_main_1 = __webpack_require__(/*! ./comments/comments-main */ "../../packages/plugin-ext/lib/main/browser/comments/comments-main.js");
const custom_editors_main_1 = __webpack_require__(/*! ./custom-editors/custom-editors-main */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editors-main.js");
const secrets_main_1 = __webpack_require__(/*! ./secrets-main */ "../../packages/plugin-ext/lib/main/browser/secrets-main.js");
const webview_views_main_1 = __webpack_require__(/*! ./webview-views/webview-views-main */ "../../packages/plugin-ext/lib/main/browser/webview-views/webview-views-main.js");
const monaco_languages_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-languages */ "../../packages/monaco/lib/browser/monaco-languages.js");
const resource_1 = __webpack_require__(/*! @theia/core/lib/common/resource */ "../../packages/core/lib/common/resource.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const tabs_main_1 = __webpack_require__(/*! ./tabs/tabs-main */ "../../packages/plugin-ext/lib/main/browser/tabs/tabs-main.js");
const notebooks_main_1 = __webpack_require__(/*! ./notebooks/notebooks-main */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebooks-main.js");
const browser_2 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
const localization_main_1 = __webpack_require__(/*! ./localization-main */ "../../packages/plugin-ext/lib/main/browser/localization-main.js");
const notebook_renderers_main_1 = __webpack_require__(/*! ./notebooks/notebook-renderers-main */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-renderers-main.js");
const hosted_plugin_1 = __webpack_require__(/*! ../../hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
const notebook_editors_main_1 = __webpack_require__(/*! ./notebooks/notebook-editors-main */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-editors-main.js");
const notebook_documents_main_1 = __webpack_require__(/*! ./notebooks/notebook-documents-main */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-documents-main.js");
const notebook_kernels_main_1 = __webpack_require__(/*! ./notebooks/notebook-kernels-main */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-kernels-main.js");
const notebook_documents_and_editors_main_1 = __webpack_require__(/*! ./notebooks/notebook-documents-and-editors-main */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-documents-and-editors-main.js");
function setUpPluginApi(rpc, container) {
    const authenticationMain = new authentication_main_1.AuthenticationMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.AUTHENTICATION_MAIN, authenticationMain);
    const commandRegistryMain = new command_registry_main_1.CommandRegistryMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.COMMAND_REGISTRY_MAIN, commandRegistryMain);
    const quickOpenMain = new quick_open_main_1.QuickOpenMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.QUICK_OPEN_MAIN, quickOpenMain);
    const workspaceMain = new workspace_main_1.WorkspaceMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.WORKSPACE_MAIN, workspaceMain);
    const dialogsMain = new dialogs_main_1.DialogsMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DIALOGS_MAIN, dialogsMain);
    const messageRegistryMain = new message_registry_main_1.MessageRegistryMainImpl(container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.MESSAGE_REGISTRY_MAIN, messageRegistryMain);
    const preferenceRegistryMain = new preference_registry_main_1.PreferenceRegistryMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.PREFERENCE_REGISTRY_MAIN, preferenceRegistryMain);
    const editorsAndDocuments = new editors_and_documents_main_1.EditorsAndDocumentsMain(rpc, container);
    const modelService = container.get(text_editor_model_service_1.EditorModelService);
    const editorManager = container.get(browser_1.EditorManager);
    const openerService = container.get(opener_service_1.OpenerService);
    const shell = container.get(application_shell_1.ApplicationShell);
    const untitledResourceResolver = container.get(resource_1.UntitledResourceResolver);
    const languageService = container.get(monaco_languages_1.MonacoLanguages);
    const documentsMain = new documents_main_1.DocumentsMainImpl(editorsAndDocuments, modelService, rpc, editorManager, openerService, shell, untitledResourceResolver, languageService);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DOCUMENTS_MAIN, documentsMain);
    const notebookService = container.get(browser_2.NotebookService);
    const pluginSupport = container.get(hosted_plugin_1.HostedPluginSupport);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTEBOOKS_MAIN, new notebooks_main_1.NotebooksMainImpl(rpc, notebookService, pluginSupport));
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTEBOOK_RENDERERS_MAIN, new notebook_renderers_main_1.NotebookRenderersMainImpl(rpc, container));
    const notebookEditorsMain = new notebook_editors_main_1.NotebookEditorsMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTEBOOK_EDITORS_MAIN, notebookEditorsMain);
    const notebookDocumentsMain = new notebook_documents_main_1.NotebookDocumentsMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTEBOOK_DOCUMENTS_MAIN, notebookDocumentsMain);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTEBOOK_DOCUMENTS_AND_EDITORS_MAIN, new notebook_documents_and_editors_main_1.NotebooksAndEditorsMain(rpc, container, notebookDocumentsMain, notebookEditorsMain));
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTEBOOK_KERNELS_MAIN, new notebook_kernels_main_1.NotebookKernelsMainImpl(rpc, container));
    const bulkEditService = container.get(monaco_bulk_edit_service_1.MonacoBulkEditService);
    const monacoEditorService = container.get(monaco_editor_service_1.MonacoEditorService);
    const editorsMain = new text_editors_main_1.TextEditorsMainImpl(editorsAndDocuments, documentsMain, rpc, bulkEditService, monacoEditorService);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TEXT_EDITORS_MAIN, editorsMain);
    // start listening only after all clients are subscribed to events
    editorsAndDocuments.listen();
    const statusBarMessageRegistryMain = new status_bar_message_registry_main_1.StatusBarMessageRegistryMainImpl(container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.STATUS_BAR_MESSAGE_REGISTRY_MAIN, statusBarMessageRegistryMain);
    const envMain = new env_main_1.EnvMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.ENV_MAIN, envMain);
    const notificationMain = new notification_main_1.NotificationMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTIFICATION_MAIN, notificationMain);
    const terminalMain = new terminal_main_1.TerminalServiceMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TERMINAL_MAIN, terminalMain);
    const treeViewsMain = new tree_views_main_1.TreeViewsMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TREE_VIEWS_MAIN, treeViewsMain);
    const outputChannelRegistryFactory = container.get(plugin_api_rpc_1.OutputChannelRegistryFactory);
    const outputChannelRegistryMain = outputChannelRegistryFactory();
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.OUTPUT_CHANNEL_REGISTRY_MAIN, outputChannelRegistryMain);
    const languagesMainFactory = container.get(plugin_api_rpc_1.LanguagesMainFactory);
    const languagesMain = languagesMainFactory(rpc);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.LANGUAGES_MAIN, languagesMain);
    const webviewsMain = new webviews_main_1.WebviewsMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.WEBVIEWS_MAIN, webviewsMain);
    const customEditorsMain = new custom_editors_main_1.CustomEditorsMainImpl(rpc, container, webviewsMain);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.CUSTOM_EDITORS_MAIN, customEditorsMain);
    const webviewViewsMain = new webview_views_main_1.WebviewViewsMainImpl(rpc, container, webviewsMain);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.WEBVIEW_VIEWS_MAIN, webviewViewsMain);
    const storageMain = new plugin_storage_1.StorageMainImpl(container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.STORAGE_MAIN, storageMain);
    const connectionMain = new connection_1.ConnectionImpl(rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.CONNECTION_EXT));
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.CONNECTION_MAIN, connectionMain);
    const tasksMain = new tasks_main_1.TasksMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TASKS_MAIN, tasksMain);
    const debugMain = new debug_main_1.DebugMainImpl(rpc, connectionMain, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DEBUG_MAIN, debugMain);
    const fs = new file_system_main_impl_1.FileSystemMainImpl(rpc, container);
    const fsEventService = new main_file_system_event_service_1.MainFileSystemEventService(rpc, container);
    const disposeFS = fs.dispose.bind(fs);
    fs.dispose = () => {
        fsEventService.dispose();
        disposeFS();
    };
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.FILE_SYSTEM_MAIN, fs);
    const scmMain = new scm_main_1.ScmMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.SCM_MAIN, scmMain);
    const secretsMain = new secrets_main_1.SecretsMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.SECRETS_MAIN, secretsMain);
    const decorationsMain = new decorations_main_1.DecorationsMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DECORATIONS_MAIN, decorationsMain);
    const windowMain = new window_state_main_1.WindowStateMain(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.WINDOW_MAIN, windowMain);
    const clipboardMain = new clipboard_main_1.ClipboardMainImpl(container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.CLIPBOARD_MAIN, clipboardMain);
    const labelServiceMain = new label_service_main_1.LabelServiceMainImpl(container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.LABEL_SERVICE_MAIN, labelServiceMain);
    const timelineMain = new timeline_main_1.TimelineMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TIMELINE_MAIN, timelineMain);
    const themingMain = new theming_main_1.ThemingMainImpl(rpc, container.get(theming_1.ThemeService));
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.THEMING_MAIN, themingMain);
    const commentsMain = new comments_main_1.CommentsMainImp(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.COMMENTS_MAIN, commentsMain);
    const tabsMain = new tabs_main_1.TabsMainImpl(rpc, container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TABS_MAIN, tabsMain);
    const localizationMain = new localization_main_1.LocalizationMainImpl(container);
    rpc.set(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.LOCALIZATION_MAIN, localizationMain);
}
exports.setUpPluginApi = setUpPluginApi;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/main-context'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/main-file-system-event-service.js":
/*!************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/main-file-system-event-service.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/api/browser/mainThreadFileSystemEventService.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainFileSystemEventService = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
class MainFileSystemEventService {
    constructor(rpc, container) {
        this.toDispose = new disposable_1.DisposableCollection();
        const proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.ExtHostFileSystemEventService);
        const fileService = container.get(file_service_1.FileService);
        this.toDispose.push(fileService.onDidFilesChange(event => {
            // file system events - (changes the editor and others make)
            const events = {
                created: [],
                changed: [],
                deleted: []
            };
            for (const change of event.changes) {
                switch (change.type) {
                    case 1 /* ADDED */:
                        events.created.push(change.resource['codeUri']);
                        break;
                    case 0 /* UPDATED */:
                        events.changed.push(change.resource['codeUri']);
                        break;
                    case 2 /* DELETED */:
                        events.deleted.push(change.resource['codeUri']);
                        break;
                }
            }
            proxy.$onFileEvent(events);
        }));
        // BEFORE file operation
        fileService.addFileOperationParticipant({
            participate: (target, source, operation, timeout, token) => proxy.$onWillRunFileOperation(operation, target['codeUri'], source === null || source === void 0 ? void 0 : source['codeUri'], timeout, token)
        });
        // AFTER file operation
        this.toDispose.push(fileService.onDidRunUserOperation(e => { var _a; return proxy.$onDidRunFileOperation(e.operation, e.target['codeUri'], (_a = e.source) === null || _a === void 0 ? void 0 : _a['codeUri']); }));
    }
    dispose() {
        this.toDispose.dispose();
    }
}
exports.MainFileSystemEventService = MainFileSystemEventService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/main-file-system-event-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/menus/menus-contribution-handler.js":
/*!**************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/menus/menus-contribution-handler.js ***!
  \**************************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenusContributionPointHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const scm_widget_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-widget */ "../../packages/scm/lib/browser/scm-widget.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const vscode_theia_menu_mappings_1 = __webpack_require__(/*! ./vscode-theia-menu-mappings */ "../../packages/plugin-ext/lib/main/browser/menus/vscode-theia-menu-mappings.js");
const plugin_menu_command_adapter_1 = __webpack_require__(/*! ./plugin-menu-command-adapter */ "../../packages/plugin-ext/lib/main/browser/menus/plugin-menu-command-adapter.js");
const contextkey_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const plugin_shared_style_1 = __webpack_require__(/*! ../plugin-shared-style */ "../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js");
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
let MenusContributionPointHandler = class MenusContributionPointHandler {
    constructor() {
        this.titleContributionContextKeys = new plugin_menu_command_adapter_1.ReferenceCountingSet();
        this.onDidChangeTitleContributionEmitter = new core_1.Emitter();
        this.initialized = false;
    }
    initialize() {
        this.initialized = true;
        this.commandAdapterRegistry.registerAdapter(this.commandAdapter);
        this.tabBarToolbar.registerMenuDelegate(vscode_theia_menu_mappings_1.PLUGIN_EDITOR_TITLE_MENU, widget => this.codeEditorWidgetUtil.is(widget));
        this.tabBarToolbar.registerItem({
            id: this.tabBarToolbar.toElementId(vscode_theia_menu_mappings_1.PLUGIN_EDITOR_TITLE_RUN_MENU), menuPath: vscode_theia_menu_mappings_1.PLUGIN_EDITOR_TITLE_RUN_MENU,
            icon: 'debug-alt', text: core_1.nls.localizeByDefault('Run or Debug...'),
            command: '', group: 'navigation', isVisible: widget => this.codeEditorWidgetUtil.is(widget)
        });
        this.tabBarToolbar.registerMenuDelegate(vscode_theia_menu_mappings_1.PLUGIN_SCM_TITLE_MENU, widget => widget instanceof scm_widget_1.ScmWidget);
        this.tabBarToolbar.registerMenuDelegate(vscode_theia_menu_mappings_1.PLUGIN_VIEW_TITLE_MENU, widget => !this.codeEditorWidgetUtil.is(widget));
        this.tabBarToolbar.registerItem({ id: 'plugin-menu-contribution-title-contribution', command: '_never_', onDidChange: this.onDidChangeTitleContributionEmitter.event });
        this.contextKeyService.onDidChange(event => {
            if (event.affects(this.titleContributionContextKeys)) {
                this.onDidChangeTitleContributionEmitter.fire();
            }
        });
    }
    getMatchingMenu(contributionPoint) {
        return vscode_theia_menu_mappings_1.codeToTheiaMappings.get(contributionPoint);
    }
    handle(plugin) {
        var _a, _b, _c, _d;
        const allMenus = (_a = plugin.contributes) === null || _a === void 0 ? void 0 : _a.menus;
        if (!allMenus) {
            return core_1.Disposable.NULL;
        }
        if (!this.initialized) {
            this.initialize();
        }
        const toDispose = new core_1.DisposableCollection();
        const submenus = (_c = (_b = plugin.contributes) === null || _b === void 0 ? void 0 : _b.submenus) !== null && _c !== void 0 ? _c : [];
        for (const submenu of submenus) {
            const iconClass = submenu.icon && this.toIconClass(submenu.icon, toDispose);
            this.menuRegistry.registerIndependentSubmenu(submenu.id, submenu.label, iconClass ? { iconClass } : undefined);
        }
        for (const [contributionPoint, items] of Object.entries(allMenus)) {
            for (const item of items) {
                try {
                    if (contributionPoint === 'commandPalette') {
                        toDispose.push(this.registerCommandPaletteAction(item));
                    }
                    else {
                        this.checkTitleContribution(contributionPoint, item, toDispose);
                        const targets = (_d = this.getMatchingMenu(contributionPoint)) !== null && _d !== void 0 ? _d : [contributionPoint];
                        const { group, order } = this.parseGroup(item.group);
                        const { submenu, command } = item;
                        if (submenu) {
                            targets.forEach(target => toDispose.push(this.menuRegistry.linkSubmenu(target, submenu, { order, when: item.when }, group)));
                        }
                        else if (command) {
                            toDispose.push(this.commandAdapter.addCommand(command));
                            targets.forEach(target => {
                                const node = new core_1.ActionMenuNode({
                                    commandId: command,
                                    when: item.when,
                                    order,
                                }, this.commands);
                                const parent = this.menuRegistry.getMenuNode(target, group);
                                toDispose.push(parent.addNode(node));
                            });
                        }
                    }
                }
                catch (error) {
                    console.warn(`Failed to register a menu item for plugin ${plugin.metadata.model.id} contributed to ${contributionPoint}`, item, error);
                }
            }
        }
        return toDispose;
    }
    parseGroup(rawGroup) {
        if (!rawGroup) {
            return {};
        }
        const separatorIndex = rawGroup.lastIndexOf('@');
        if (separatorIndex > -1) {
            return { group: rawGroup.substring(0, separatorIndex), order: rawGroup.substring(separatorIndex + 1) || undefined };
        }
        return { group: rawGroup };
    }
    registerCommandPaletteAction(menu) {
        if (menu.command && menu.when) {
            return this.quickCommandService.pushCommandContext(menu.command, menu.when);
        }
        return core_1.Disposable.NULL;
    }
    checkTitleContribution(contributionPoint, contribution, toDispose) {
        if (contribution.when && contributionPoint.endsWith('title')) {
            const expression = contextkey_1.ContextKeyExpr.deserialize(contribution.when);
            if (expression) {
                for (const key of expression.keys()) {
                    this.titleContributionContextKeys.add(key);
                    toDispose.push(core_1.Disposable.create(() => this.titleContributionContextKeys.delete(key)));
                }
                toDispose.push(core_1.Disposable.create(() => this.onDidChangeTitleContributionEmitter.fire()));
            }
        }
    }
    toIconClass(url, toDispose) {
        if (typeof url === 'string') {
            const asThemeIcon = themeService_1.ThemeIcon.fromString(url);
            if (asThemeIcon) {
                return themeService_1.ThemeIcon.asClassName(asThemeIcon);
            }
        }
        const reference = this.style.toIconClass(url);
        toDispose.push(reference);
        return reference.object.iconClass;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], MenusContributionPointHandler.prototype, "menuRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], MenusContributionPointHandler.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(tab_bar_toolbar_1.TabBarToolbarRegistry),
    __metadata("design:type", tab_bar_toolbar_1.TabBarToolbarRegistry)
], MenusContributionPointHandler.prototype, "tabBarToolbar", void 0);
__decorate([
    (0, inversify_1.inject)(vscode_theia_menu_mappings_1.CodeEditorWidgetUtil),
    __metadata("design:type", vscode_theia_menu_mappings_1.CodeEditorWidgetUtil)
], MenusContributionPointHandler.prototype, "codeEditorWidgetUtil", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_menu_command_adapter_1.PluginMenuCommandAdapter),
    __metadata("design:type", plugin_menu_command_adapter_1.PluginMenuCommandAdapter)
], MenusContributionPointHandler.prototype, "commandAdapter", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MenuCommandAdapterRegistry),
    __metadata("design:type", Object)
], MenusContributionPointHandler.prototype, "commandAdapterRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], MenusContributionPointHandler.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], MenusContributionPointHandler.prototype, "style", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickCommandService),
    (0, inversify_1.optional)(),
    __metadata("design:type", browser_1.QuickCommandService)
], MenusContributionPointHandler.prototype, "quickCommandService", void 0);
MenusContributionPointHandler = __decorate([
    (0, inversify_1.injectable)()
], MenusContributionPointHandler);
exports.MenusContributionPointHandler = MenusContributionPointHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/menus/menus-contribution-handler'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/menus/plugin-menu-command-adapter.js":
/*!***************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/menus/plugin-menu-command-adapter.js ***!
  \***************************************************************************************/
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
exports.PluginMenuCommandAdapter = exports.ReferenceCountingSet = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const resource_context_key_1 = __webpack_require__(/*! @theia/core/lib/browser/resource-context-key */ "../../packages/core/lib/browser/resource-context-key.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const tree_widget_selection_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-widget-selection */ "../../packages/core/lib/browser/tree/tree-widget-selection.js");
const scm_repository_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-repository */ "../../packages/scm/lib/browser/scm-repository.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const common_1 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
const scm_main_1 = __webpack_require__(/*! ../scm-main */ "../../packages/plugin-ext/lib/main/browser/scm-main.js");
const tree_view_widget_1 = __webpack_require__(/*! ../view/tree-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/tree-view-widget.js");
const vscode_theia_menu_mappings_1 = __webpack_require__(/*! ./vscode-theia-menu-mappings */ "../../packages/plugin-ext/lib/main/browser/menus/vscode-theia-menu-mappings.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
class ReferenceCountingSet {
    constructor(initialMembers) {
        this.references = new Map();
        if (initialMembers) {
            for (const member of initialMembers) {
                this.add(member);
            }
        }
    }
    add(newMember) {
        var _a;
        const value = (_a = this.references.get(newMember)) !== null && _a !== void 0 ? _a : 0;
        this.references.set(newMember, value + 1);
        return this;
    }
    /** @returns true if the deletion results in the removal of the element from the set */
    delete(member) {
        const value = this.references.get(member);
        if (value === undefined) { }
        else if (value <= 1) {
            this.references.delete(member);
            return true;
        }
        else {
            this.references.set(member, value - 1);
        }
        return false;
    }
    has(maybeMember) {
        return this.references.has(maybeMember);
    }
}
exports.ReferenceCountingSet = ReferenceCountingSet;
let PluginMenuCommandAdapter = class PluginMenuCommandAdapter {
    constructor() {
        this.commands = new ReferenceCountingSet();
        this.argumentAdapters = new Map();
        this.separator = ':)(:';
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
    init() {
        const toCommentArgs = (...args) => this.toCommentArgs(...args);
        const firstArgOnly = (...args) => [args[0]];
        const noArgs = () => [];
        const toScmArgs = (...args) => this.toScmArgs(...args);
        const selectedResource = () => this.getSelectedResources();
        const widgetURI = widget => this.codeEditorUtil.is(widget) ? [this.codeEditorUtil.getResourceUri(widget)] : [];
        [
            ['comments/comment/context', toCommentArgs],
            ['comments/comment/title', toCommentArgs],
            ['comments/commentThread/context', toCommentArgs],
            ['debug/callstack/context', firstArgOnly],
            ['debug/variables/context', firstArgOnly],
            ['debug/toolBar', noArgs],
            ['editor/context', selectedResource],
            ['editor/title', widgetURI],
            ['editor/title/context', selectedResource],
            ['editor/title/run', widgetURI],
            ['explorer/context', selectedResource],
            ['scm/resourceFolder/context', toScmArgs],
            ['scm/resourceGroup/context', toScmArgs],
            ['scm/resourceState/context', toScmArgs],
            ['scm/title', () => [this.toScmArg(this.scmService.selectedRepository)]],
            ['timeline/item/context', (...args) => this.toTimelineArgs(...args)],
            ['view/item/context', (...args) => this.toTreeArgs(...args)],
            ['view/title', noArgs],
        ].forEach(([contributionPoint, adapter]) => {
            if (adapter) {
                const paths = vscode_theia_menu_mappings_1.codeToTheiaMappings.get(contributionPoint);
                if (paths) {
                    paths.forEach(path => this.addArgumentAdapter(path, adapter));
                }
            }
        });
        this.addArgumentAdapter(tab_bar_toolbar_1.TAB_BAR_TOOLBAR_CONTEXT_MENU, widgetURI);
    }
    canHandle(menuPath, command, ...commandArgs) {
        if (this.commands.has(command) && this.getArgumentAdapterForMenu(menuPath)) {
            return 500;
        }
        return -1;
    }
    executeCommand(menuPath, command, ...commandArgs) {
        const argumentAdapter = this.getAdapterOrThrow(menuPath);
        return this.commandRegistry.executeCommand(command, ...argumentAdapter(...commandArgs));
    }
    isVisible(menuPath, command, ...commandArgs) {
        const argumentAdapter = this.getAdapterOrThrow(menuPath);
        return this.commandRegistry.isVisible(command, ...argumentAdapter(...commandArgs));
    }
    isEnabled(menuPath, command, ...commandArgs) {
        const argumentAdapter = this.getAdapterOrThrow(menuPath);
        return this.commandRegistry.isEnabled(command, ...argumentAdapter(...commandArgs));
    }
    isToggled(menuPath, command, ...commandArgs) {
        const argumentAdapter = this.getAdapterOrThrow(menuPath);
        return this.commandRegistry.isToggled(command, ...argumentAdapter(...commandArgs));
    }
    getAdapterOrThrow(menuPath) {
        const argumentAdapter = this.getArgumentAdapterForMenu(menuPath);
        if (!argumentAdapter) {
            throw new Error('PluginMenuCommandAdapter attempted to execute command for unregistered menu: ' + JSON.stringify(menuPath));
        }
        return argumentAdapter;
    }
    addCommand(commandId) {
        this.commands.add(commandId);
        return core_1.Disposable.create(() => this.commands.delete(commandId));
    }
    getArgumentAdapterForMenu(menuPath) {
        return this.argumentAdapters.get(menuPath.join(this.separator));
    }
    addArgumentAdapter(menuPath, adapter) {
        this.argumentAdapters.set(menuPath.join(this.separator), adapter);
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    toCommentArgs(...args) {
        const arg = args[0];
        if ('text' in arg) {
            if ('commentUniqueId' in arg) {
                return [{
                        commentControlHandle: arg.thread.controllerHandle,
                        commentThreadHandle: arg.thread.commentThreadHandle,
                        text: arg.text,
                        commentUniqueId: arg.commentUniqueId
                    }];
            }
            return [{
                    commentControlHandle: arg.thread.controllerHandle,
                    commentThreadHandle: arg.thread.commentThreadHandle,
                    text: arg.text
                }];
        }
        return [{
                commentControlHandle: arg.thread.controllerHandle,
                commentThreadHandle: arg.thread.commentThreadHandle,
                commentUniqueId: arg.commentUniqueId
            }];
    }
    toScmArgs(...args) {
        const scmArgs = [];
        for (const arg of args) {
            const scmArg = this.toScmArg(arg);
            if (scmArg) {
                scmArgs.push(scmArg);
            }
        }
        return scmArgs;
    }
    toScmArg(arg) {
        if (arg instanceof scm_repository_1.ScmRepository && arg.provider instanceof scm_main_1.PluginScmProvider) {
            return {
                sourceControlHandle: arg.provider.handle
            };
        }
        if (arg instanceof scm_main_1.PluginScmResourceGroup) {
            return {
                sourceControlHandle: arg.provider.handle,
                resourceGroupHandle: arg.handle
            };
        }
        if (arg instanceof scm_main_1.PluginScmResource) {
            return {
                sourceControlHandle: arg.group.provider.handle,
                resourceGroupHandle: arg.group.handle,
                resourceStateHandle: arg.handle
            };
        }
    }
    toTimelineArgs(...args) {
        var _a;
        const timelineArgs = [];
        const arg = args[0];
        timelineArgs.push(this.toTimelineArg(arg));
        timelineArgs.push(vscode_uri_1.URI.parse(arg.uri));
        timelineArgs.push((_a = arg.source) !== null && _a !== void 0 ? _a : '');
        return timelineArgs;
    }
    toTimelineArg(arg) {
        return {
            timelineHandle: arg.handle,
            source: arg.source,
            uri: arg.uri
        };
    }
    toTreeArgs(...args) {
        const treeArgs = [];
        for (const arg of args) {
            if (common_1.TreeViewItemReference.is(arg)) {
                treeArgs.push(arg);
            }
            else if (Array.isArray(arg)) {
                treeArgs.push(arg.filter(common_1.TreeViewItemReference.is));
            }
        }
        return treeArgs;
    }
    getSelectedResources() {
        var _a, _b;
        const selection = this.selectionService.selection;
        const resourceKey = this.resourceContextKey.get();
        const resourceUri = resourceKey ? vscode_uri_1.URI.parse(resourceKey) : undefined;
        const firstMember = tree_widget_selection_1.TreeWidgetSelection.is(selection) && selection.source instanceof tree_view_widget_1.TreeViewWidget && selection[0]
            ? selection.source.toTreeViewItemReference(selection[0])
            : (_b = (_a = core_1.UriSelection.getUri(selection)) === null || _a === void 0 ? void 0 : _a['codeUri']) !== null && _b !== void 0 ? _b : resourceUri;
        const secondMember = tree_widget_selection_1.TreeWidgetSelection.is(selection)
            ? core_1.UriSelection.getUris(selection).map(uri => uri['codeUri'])
            : undefined;
        return [firstMember, secondMember];
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], PluginMenuCommandAdapter.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(vscode_theia_menu_mappings_1.CodeEditorWidgetUtil),
    __metadata("design:type", vscode_theia_menu_mappings_1.CodeEditorWidgetUtil)
], PluginMenuCommandAdapter.prototype, "codeEditorUtil", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], PluginMenuCommandAdapter.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], PluginMenuCommandAdapter.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(resource_context_key_1.ResourceContextKey),
    __metadata("design:type", resource_context_key_1.ResourceContextKey)
], PluginMenuCommandAdapter.prototype, "resourceContextKey", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginMenuCommandAdapter.prototype, "init", null);
PluginMenuCommandAdapter = __decorate([
    (0, inversify_1.injectable)()
], PluginMenuCommandAdapter);
exports.PluginMenuCommandAdapter = PluginMenuCommandAdapter;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/menus/plugin-menu-command-adapter'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/message-registry-main.js":
/*!***************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/message-registry-main.js ***!
  \***************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageRegistryMainImpl = void 0;
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const modal_notification_1 = __webpack_require__(/*! ./dialogs/modal-notification */ "../../packages/plugin-ext/lib/main/browser/dialogs/modal-notification.js");
class MessageRegistryMainImpl {
    constructor(container) {
        this.messageService = container.get(message_service_1.MessageService);
    }
    async $showMessage(type, message, options, actions) {
        const action = await this.doShowMessage(type, message, options, actions);
        const handle = action
            ? actions.map(a => a.title).indexOf(action)
            : undefined;
        return handle === undefined && options.modal ? options.onCloseActionHandle : handle;
    }
    async doShowMessage(type, message, options, actions) {
        if (options.modal) {
            const messageType = type === plugin_api_rpc_1.MainMessageType.Error ? modal_notification_1.MessageType.Error :
                type === plugin_api_rpc_1.MainMessageType.Warning ? modal_notification_1.MessageType.Warning :
                    modal_notification_1.MessageType.Info;
            const modalNotification = new modal_notification_1.ModalNotification();
            return modalNotification.showDialog(messageType, message, options, actions);
        }
        switch (type) {
            case plugin_api_rpc_1.MainMessageType.Info:
                return this.messageService.info(message, ...actions.map(a => a.title));
            case plugin_api_rpc_1.MainMessageType.Warning:
                return this.messageService.warn(message, ...actions.map(a => a.title));
            case plugin_api_rpc_1.MainMessageType.Error:
                return this.messageService.error(message, ...actions.map(a => a.title));
        }
        throw new Error(`Message type '${type}' is not supported yet!`);
    }
}
exports.MessageRegistryMainImpl = MessageRegistryMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/message-registry-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-documents-and-editors-main.js":
/*!***************************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/notebook-documents-and-editors-main.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebooksAndEditorsMain = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
const common_1 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
const notebook_dto_1 = __webpack_require__(/*! ./notebook-dto */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-dto.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const collections_1 = __webpack_require__(/*! ../../../common/collections */ "../../packages/plugin-ext/lib/common/collections.js");
const async_mutex_1 = __webpack_require__(/*! async-mutex */ "../../packages/plugin-ext/node_modules/async-mutex/lib/index.js");
class NotebookAndEditorState {
    constructor(documents, textEditors, activeEditor, visibleEditors) {
        this.documents = documents;
        this.textEditors = textEditors;
        this.activeEditor = activeEditor;
        this.visibleEditors = visibleEditors;
        //
    }
    static delta(before, after) {
        if (!before) {
            return {
                addedDocuments: [...after.documents],
                removedDocuments: [],
                addedEditors: [...after.textEditors.values()],
                removedEditors: [],
                visibleEditors: [...after.visibleEditors].map(editor => editor[0])
            };
        }
        const documentDelta = (0, collections_1.diffSets)(before.documents, after.documents);
        const editorDelta = (0, collections_1.diffMaps)(before.textEditors, after.textEditors);
        const newActiveEditor = before.activeEditor !== after.activeEditor ? after.activeEditor : undefined;
        const visibleEditorDelta = (0, collections_1.diffMaps)(before.visibleEditors, after.visibleEditors);
        return {
            addedDocuments: documentDelta.added,
            removedDocuments: documentDelta.removed.map(e => e.uri.toComponents()),
            addedEditors: editorDelta.added,
            removedEditors: editorDelta.removed.map(removed => removed.id),
            newActiveEditor: newActiveEditor,
            visibleEditors: visibleEditorDelta.added.length === 0 && visibleEditorDelta.removed.length === 0
                ? undefined
                : [...after.visibleEditors].map(editor => editor[0])
        };
    }
}
class NotebooksAndEditorsMain {
    constructor(rpc, container, notebookDocumentsMain, notebookEditorsMain) {
        this.notebookDocumentsMain = notebookDocumentsMain;
        this.notebookEditorsMain = notebookEditorsMain;
        this.disposables = new core_1.DisposableCollection();
        this.editorListeners = new Map();
        this.updateMutex = new async_mutex_1.Mutex();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOKS_EXT);
        this.notebookService = container.get(browser_1.NotebookService);
        this.notebookEditorService = container.get(browser_1.NotebookEditorWidgetService);
        this.WidgetManager = container.get(browser_2.WidgetManager);
        this.notebookService.onDidAddNotebookDocument(async () => this.updateState(), this, this.disposables);
        this.notebookService.onDidRemoveNotebookDocument(async () => this.updateState(), this, this.disposables);
        // this.WidgetManager.onActiveEditorChanged(() => this.updateState(), this, this.disposables);
        this.notebookEditorService.onDidAddNotebookEditor(async (editor) => this.handleEditorAdd(editor), this, this.disposables);
        this.notebookEditorService.onDidRemoveNotebookEditor(async (editor) => this.handleEditorRemove(editor), this, this.disposables);
        this.notebookEditorService.onFocusedEditorChanged(async (editor) => this.updateState(editor), this, this.disposables);
    }
    dispose() {
        this.notebookDocumentsMain.dispose();
        this.notebookEditorsMain.dispose();
        this.disposables.dispose();
        this.editorListeners.forEach(listeners => listeners.forEach(listener => listener.dispose()));
    }
    async handleEditorAdd(editor) {
        const listeners = this.editorListeners.get(editor.id);
        const disposable = editor.onDidChangeModel(() => this.updateState());
        if (listeners) {
            listeners.push(disposable);
        }
        else {
            this.editorListeners.set(editor.id, [disposable]);
        }
        await this.updateState();
    }
    handleEditorRemove(editor) {
        const listeners = this.editorListeners.get(editor.id);
        listeners === null || listeners === void 0 ? void 0 : listeners.forEach(listener => listener.dispose());
        this.editorListeners.delete(editor.id);
        this.updateState();
    }
    async updateState(focusedEditor) {
        await this.updateMutex.runExclusive(async () => this.doUpdateState(focusedEditor));
    }
    async doUpdateState(focusedEditor) {
        const editors = new Map();
        const visibleEditorsMap = new Map();
        for (const editor of this.notebookEditorService.listNotebookEditors()) {
            if (editor.model) {
                editors.set(editor.id, editor);
            }
        }
        const activeNotebookEditor = this.notebookEditorService.currentFocusedEditor;
        let activeEditor = null;
        if (activeNotebookEditor) {
            activeEditor = activeNotebookEditor.id;
        }
        else if (focusedEditor === null || focusedEditor === void 0 ? void 0 : focusedEditor.model) {
            activeEditor = focusedEditor.id;
        }
        if (activeEditor && !editors.has(activeEditor)) {
            activeEditor = null;
        }
        const notebookEditors = this.WidgetManager.getWidgets(browser_1.NotebookEditorWidget.ID);
        for (const notebookEditor of notebookEditors) {
            if ((notebookEditor === null || notebookEditor === void 0 ? void 0 : notebookEditor.model) && editors.has(notebookEditor.id) && notebookEditor.isVisible) {
                visibleEditorsMap.set(notebookEditor.id, notebookEditor);
            }
        }
        const newState = new NotebookAndEditorState(new Set(this.notebookService.listNotebookDocuments()), editors, activeEditor, visibleEditorsMap);
        await this.onDelta(NotebookAndEditorState.delta(this.currentState, newState));
        this.currentState = newState;
    }
    async onDelta(delta) {
        if (NotebooksAndEditorsMain._isDeltaEmpty(delta)) {
            return;
        }
        const dto = {
            removedDocuments: delta.removedDocuments,
            removedEditors: delta.removedEditors,
            newActiveEditor: delta.newActiveEditor,
            visibleEditors: delta.visibleEditors,
            addedDocuments: delta.addedDocuments.map(NotebooksAndEditorsMain.asModelAddData),
            // addedEditors: delta.addedEditors.map(this.asEditorAddData, this),
        };
        // send to extension FIRST
        await this.proxy.$acceptDocumentsAndEditorsDelta(dto);
        // handle internally
        this.notebookEditorsMain.handleEditorsRemoved(delta.removedEditors);
        this.notebookDocumentsMain.handleNotebooksRemoved(delta.removedDocuments);
        this.notebookDocumentsMain.handleNotebooksAdded(delta.addedDocuments);
        this.notebookEditorsMain.handleEditorsAdded(delta.addedEditors);
    }
    static _isDeltaEmpty(delta) {
        if (delta.addedDocuments !== undefined && delta.addedDocuments.length > 0) {
            return false;
        }
        if (delta.removedDocuments !== undefined && delta.removedDocuments.length > 0) {
            return false;
        }
        if (delta.addedEditors !== undefined && delta.addedEditors.length > 0) {
            return false;
        }
        if (delta.removedEditors !== undefined && delta.removedEditors.length > 0) {
            return false;
        }
        if (delta.visibleEditors !== undefined && delta.visibleEditors.length > 0) {
            return false;
        }
        if (delta.newActiveEditor !== undefined) {
            return false;
        }
        return true;
    }
    static asModelAddData(e) {
        return {
            viewType: e.viewType,
            uri: e.uri.toComponents(),
            metadata: e.metadata,
            versionId: 1,
            cells: e.cells.map(notebook_dto_1.NotebookDto.toNotebookCellDto)
        };
    }
}
exports.NotebooksAndEditorsMain = NotebooksAndEditorsMain;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/notebook-documents-and-editors-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-documents-main.js":
/*!***************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/notebook-documents-main.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.NotebookDocumentsMainImpl = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/notebook/lib/common */ "../../packages/notebook/lib/common/index.js");
const common_2 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
const notebook_dto_1 = __webpack_require__(/*! ./notebook-dto */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-dto.js");
class NotebookDocumentsMainImpl {
    constructor(rpc, container) {
        this.disposables = new core_1.DisposableCollection();
        this.documentEventListenersMapping = new Map();
        this.proxy = rpc.getProxy(common_2.MAIN_RPC_CONTEXT.NOTEBOOK_DOCUMENTS_EXT);
        this.notebookModelResolverService = container.get(browser_1.NotebookModelResolverService);
        // forward dirty and save events
        this.disposables.push(this.notebookModelResolverService.onDidChangeDirty(model => this.proxy.$acceptDirtyStateChanged(model.uri.toComponents(), model.isDirty())));
        this.disposables.push(this.notebookModelResolverService.onDidSaveNotebook(e => this.proxy.$acceptModelSaved(e)));
    }
    dispose() {
        this.disposables.dispose();
        // this.modelReferenceCollection.dispose();
        this.documentEventListenersMapping.forEach(value => value.dispose());
    }
    handleNotebooksAdded(notebooks) {
        for (const textModel of notebooks) {
            const disposableStore = new core_1.DisposableCollection();
            disposableStore.push(textModel.onDidChangeContent(event => {
                const eventDto = {
                    versionId: 1,
                    rawEvents: []
                };
                for (const e of event.rawEvents) {
                    switch (e.kind) {
                        case common_1.NotebookCellsChangeType.ModelChange:
                            eventDto.rawEvents.push({
                                kind: e.kind,
                                changes: e.changes.map(diff => [diff[0], diff[1], diff[2].map(notebook_dto_1.NotebookDto.toNotebookCellDto)])
                            });
                            break;
                        case common_1.NotebookCellsChangeType.Move:
                            eventDto.rawEvents.push({
                                kind: e.kind,
                                index: e.index,
                                length: e.length,
                                newIdx: e.newIdx,
                            });
                            break;
                        case common_1.NotebookCellsChangeType.Output:
                            eventDto.rawEvents.push({
                                kind: e.kind,
                                index: e.index,
                                outputs: e.outputs.map(notebook_dto_1.NotebookDto.toNotebookOutputDto)
                            });
                            break;
                        case common_1.NotebookCellsChangeType.OutputItem:
                            eventDto.rawEvents.push({
                                kind: e.kind,
                                index: e.index,
                                outputId: e.outputId,
                                outputItems: e.outputItems.map(notebook_dto_1.NotebookDto.toNotebookOutputItemDto),
                                append: e.append
                            });
                            break;
                        case common_1.NotebookCellsChangeType.ChangeCellLanguage:
                        case common_1.NotebookCellsChangeType.ChangeCellContent:
                        case common_1.NotebookCellsChangeType.ChangeCellMetadata:
                        case common_1.NotebookCellsChangeType.ChangeCellInternalMetadata:
                            eventDto.rawEvents.push(e);
                            break;
                    }
                }
                const hasDocumentMetadataChangeEvent = event.rawEvents.find(e => e.kind === common_1.NotebookCellsChangeType.ChangeDocumentMetadata);
                // using the model resolver service to know if the model is dirty or not.
                // assuming this is the first listener it can mean that at first the model
                // is marked as dirty and that another event is fired
                this.proxy.$acceptModelChanged(textModel.uri.toComponents(), eventDto, textModel.isDirty(), hasDocumentMetadataChangeEvent ? textModel.metadata : undefined);
            }));
            this.documentEventListenersMapping.set(textModel.uri.toString(), disposableStore);
        }
    }
    handleNotebooksRemoved(uris) {
        var _a;
        for (const uri of uris) {
            (_a = this.documentEventListenersMapping.get(uri.toString())) === null || _a === void 0 ? void 0 : _a.dispose();
            this.documentEventListenersMapping.delete(uri.toString());
        }
    }
    async $tryCreateNotebook(options) {
        const ref = await this.notebookModelResolverService.resolve({ untitledResource: undefined }, options.viewType);
        // untitled notebooks are disposed when they get saved. we should not hold a reference
        // to such a disposed notebook and therefore dispose the reference as well
        // ref.onWillDispose(() => {
        //     ref.dispose();
        // });
        // untitled notebooks are dirty by default
        this.proxy.$acceptDirtyStateChanged(ref.uri.toComponents(), true);
        // apply content changes... slightly HACKY -> this triggers a change event
        // if (options.content) {
        //     const data = NotebookDto.fromNotebookDataDto(options.content);
        //     ref.notebook.reset(data.cells, data.metadata, ref.object.notebook.transientOptions);
        // }
        return ref.uri.toComponents();
    }
    async $tryOpenNotebook(uriComponents) {
        const uri = uri_1.URI.fromComponents(uriComponents);
        return uri.toComponents();
    }
    async $trySaveNotebook(uriComponents) {
        const uri = uri_1.URI.fromComponents(uriComponents);
        const ref = await this.notebookModelResolverService.resolve(uri);
        await ref.save({});
        ref.dispose();
        return true;
    }
}
exports.NotebookDocumentsMainImpl = NotebookDocumentsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/notebook-documents-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-dto.js":
/*!****************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/notebook-dto.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.NotebookDto = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
var NotebookDto;
(function (NotebookDto) {
    function toNotebookOutputItemDto(item) {
        return {
            mime: item.mime,
            valueBytes: item.data
        };
    }
    NotebookDto.toNotebookOutputItemDto = toNotebookOutputItemDto;
    function toNotebookOutputDto(output) {
        return {
            outputId: output.outputId,
            metadata: output.metadata,
            items: output.outputs.map(toNotebookOutputItemDto)
        };
    }
    NotebookDto.toNotebookOutputDto = toNotebookOutputDto;
    function toNotebookCellDataDto(cell) {
        return {
            cellKind: cell.cellKind,
            language: cell.language,
            source: cell.source,
            internalMetadata: cell.internalMetadata,
            metadata: cell.metadata,
            outputs: cell.outputs.map(toNotebookOutputDto)
        };
    }
    NotebookDto.toNotebookCellDataDto = toNotebookCellDataDto;
    function toNotebookDataDto(data) {
        return {
            metadata: data.metadata,
            cells: data.cells.map(toNotebookCellDataDto)
        };
    }
    NotebookDto.toNotebookDataDto = toNotebookDataDto;
    function fromNotebookOutputItemDto(item) {
        return {
            mime: item.mime,
            data: item.valueBytes
        };
    }
    NotebookDto.fromNotebookOutputItemDto = fromNotebookOutputItemDto;
    function fromNotebookOutputDto(output) {
        return {
            outputId: output.outputId,
            metadata: output.metadata,
            outputs: output.items.map(fromNotebookOutputItemDto)
        };
    }
    NotebookDto.fromNotebookOutputDto = fromNotebookOutputDto;
    function fromNotebookCellDataDto(cell) {
        return {
            cellKind: cell.cellKind,
            language: cell.language,
            source: cell.source,
            outputs: cell.outputs.map(fromNotebookOutputDto),
            metadata: cell.metadata,
            internalMetadata: cell.internalMetadata
        };
    }
    NotebookDto.fromNotebookCellDataDto = fromNotebookCellDataDto;
    function fromNotebookDataDto(data) {
        return {
            metadata: data.metadata,
            cells: data.cells.map(fromNotebookCellDataDto)
        };
    }
    NotebookDto.fromNotebookDataDto = fromNotebookDataDto;
    function toNotebookCellDto(cell) {
        const eol = core_1.OS.backend.isWindows ? '\r\n' : '\n';
        return {
            handle: cell.handle,
            uri: cell.uri.toComponents(),
            source: cell.textBuffer.split(eol),
            eol,
            language: cell.language,
            cellKind: cell.cellKind,
            outputs: cell.outputs.map(toNotebookOutputDto),
            metadata: cell.metadata,
            internalMetadata: cell.internalMetadata,
        };
    }
    NotebookDto.toNotebookCellDto = toNotebookCellDto;
    // export function fromCellExecuteUpdateDto(data: extHostProtocol.ICellExecuteUpdateDto): ICellExecuteUpdate {
    //     if (data.editType === CellExecutionUpdateType.Output) {
    //         return {
    //             editType: data.editType,
    //             cellHandle: data.cellHandle,
    //             append: data.append,
    //             outputs: data.outputs.map(fromNotebookOutputDto)
    //         };
    //     } else if (data.editType === CellExecutionUpdateType.OutputItems) {
    //         return {
    //             editType: data.editType,
    //             append: data.append,
    //             outputId: data.outputId,
    //             items: data.items.map(fromNotebookOutputItemDto)
    //         };
    //     } else {
    //         return data;
    //     }
    // }
    // export function fromCellExecuteCompleteDto(data: extHostProtocol.ICellExecutionCompleteDto): ICellExecutionComplete {
    //     return data;
    // }
    // export function fromCellEditOperationDto(edit: extHostProtocol.ICellEditOperationDto): notebookCommon.ICellEditOperation {
    //     if (edit.editType === notebookCommon.CellEditType.Replace) {
    //         return {
    //             editType: edit.editType,
    //             index: edit.index,
    //             count: edit.count,
    //             cells: edit.cells.map(fromNotebookCellDataDto)
    //         };
    //     } else {
    //         return edit;
    //     }
    // }
})(NotebookDto = exports.NotebookDto || (exports.NotebookDto = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/notebook-dto'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-editors-main.js":
/*!*************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/notebook-editors-main.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookEditorsMainImpl = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const common_1 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
class NotebookEditorsMainImpl {
    constructor(rpc, container) {
        this.mainThreadEditors = new Map();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOK_EDITORS_EXT);
        this.openerService = container.get(browser_1.OpenerService);
    }
    async $tryShowNotebookDocument(uriComponents, viewType, options) {
        const editor = await (0, browser_1.open)(this.openerService, uri_1.URI.fromComponents(uriComponents), {});
        return editor.id;
    }
    $tryRevealRange(id, range, revealType) {
        throw new Error('Method not implemented.');
    }
    $trySetSelections(id, range) {
        throw new Error('Method not implemented.');
    }
    handleEditorsAdded(editors) {
        for (const editor of editors) {
            this.mainThreadEditors.set(editor.id, editor);
        }
    }
    handleEditorsRemoved(editorIds) {
        var _a;
        for (const id of editorIds) {
            (_a = this.mainThreadEditors.get(id)) === null || _a === void 0 ? void 0 : _a.dispose();
            this.mainThreadEditors.delete(id);
        }
    }
    dispose() {
    }
}
exports.NotebookEditorsMainImpl = NotebookEditorsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/notebook-editors-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-kernels-main.js":
/*!*************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/notebook-kernels-main.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookKernelsMainImpl = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const language_service_1 = __webpack_require__(/*! @theia/core/lib/browser/language-service */ "../../packages/core/lib/browser/language-service.js");
const common_1 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
const lifecycle_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/lifecycle */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/lifecycle.js");
const type_converters_1 = __webpack_require__(/*! ../../../plugin/type-converters */ "../../packages/plugin-ext/lib/plugin/type-converters.js");
class NotebookKernel {
    constructor(data, languageService) {
        var _a, _b, _c, _d;
        this.languageService = languageService;
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.id = data.id;
        this.viewType = data.notebookType;
        this.extension = data.extensionId;
        this.implementsInterrupt = (_a = data.supportsInterrupt) !== null && _a !== void 0 ? _a : false;
        this.label = data.label;
        this.description = data.description;
        this.detail = data.detail;
        this.supportedLanguages = (data.supportedLanguages && data.supportedLanguages.length > 0) ? data.supportedLanguages : languageService.languages.map(lang => lang.id);
        this.implementsExecutionOrder = (_b = data.supportsExecutionOrder) !== null && _b !== void 0 ? _b : false;
        this.preloads = (_d = (_c = data.preloads) === null || _c === void 0 ? void 0 : _c.map(u => ({ uri: core_1.URI.fromComponents(u.uri), provides: u.provides }))) !== null && _d !== void 0 ? _d : [];
    }
    get preloadUris() {
        return this.preloads.map(p => p.uri);
    }
    get preloadProvides() {
        return this.preloads.map(p => p.provides).flat();
    }
    update(data) {
        const event = Object.create(null);
        if (data.label !== undefined) {
            this.label = data.label;
            event.label = true;
        }
        if (data.description !== undefined) {
            this.description = data.description;
            event.description = true;
        }
        if (data.detail !== undefined) {
            this.detail = data.detail;
            event.detail = true;
        }
        if (data.supportedLanguages !== undefined) {
            this.supportedLanguages = (data.supportedLanguages && data.supportedLanguages.length > 0) ?
                data.supportedLanguages :
                this.languageService.languages.map(lang => lang.id);
            event.supportedLanguages = true;
        }
        if (data.supportsExecutionOrder !== undefined) {
            this.implementsExecutionOrder = data.supportsExecutionOrder;
            event.hasExecutionOrder = true;
        }
        if (data.supportsInterrupt !== undefined) {
            this.implementsInterrupt = data.supportsInterrupt;
            event.hasInterruptHandler = true;
        }
        this.onDidChangeEmitter.fire(event);
    }
}
class KernelDetectionTask {
    constructor(notebookType) {
        this.notebookType = notebookType;
    }
}
class NotebookKernelsMainImpl {
    constructor(rpc, container) {
        this.kernels = new Map();
        this.kernelDetectionTasks = new Map();
        this.kernelSourceActionProviders = new Map();
        this.kernelSourceActionProvidersEventRegistrations = new Map();
        this.executions = new Map();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOK_KERNELS_EXT);
        this.notebookKernelService = container.get(browser_1.NotebookKernelService);
        this.notebookExecutionStateService = container.get(browser_1.NotebookExecutionStateService);
        this.notebookService = container.get(browser_1.NotebookService);
        this.languageService = container.get(language_service_1.LanguageService);
    }
    $postMessage(handle, editorId, message) {
        throw new Error('Method not implemented.');
    }
    async $addKernel(handle, data) {
        const that = this;
        const kernel = new class extends NotebookKernel {
            async executeNotebookCellsRequest(uri, handles) {
                await that.proxy.$executeCells(handle, uri.toComponents(), handles);
            }
            async cancelNotebookCellExecution(uri, handles) {
                await that.proxy.$cancelCells(handle, uri.toComponents(), handles);
            }
        }(data, this.languageService);
        const listener = this.notebookKernelService.onDidChangeSelectedKernel(e => {
            if (e.oldKernel === kernel.id) {
                this.proxy.$acceptNotebookAssociation(handle, e.notebook.toComponents(), false);
            }
            else if (e.newKernel === kernel.id) {
                this.proxy.$acceptNotebookAssociation(handle, e.notebook.toComponents(), true);
            }
        });
        const registration = this.notebookKernelService.registerKernel(kernel);
        this.kernels.set(handle, [kernel, (0, lifecycle_1.combinedDisposable)(listener, registration)]);
    }
    $updateKernel(handle, data) {
        const tuple = this.kernels.get(handle);
        if (tuple) {
            tuple[0].update(data);
        }
    }
    $removeKernel(handle) {
        const tuple = this.kernels.get(handle);
        if (tuple) {
            tuple[1].dispose();
            this.kernels.delete(handle);
        }
    }
    $updateNotebookPriority(handle, uri, value) {
        throw new Error('Method not implemented.');
    }
    $createExecution(handle, controllerId, uriComponents, cellHandle) {
        var _a;
        const uri = core_1.URI.fromComponents(uriComponents);
        const notebook = this.notebookService.getNotebookEditorModel(uri);
        if (!notebook) {
            throw new Error(`Notebook not found: ${uri.toString()}`);
        }
        const kernel = this.notebookKernelService.getMatchingKernel(notebook);
        if (!kernel.selected || kernel.selected.id !== controllerId) {
            throw new Error(`Kernel is not selected: ${(_a = kernel.selected) === null || _a === void 0 ? void 0 : _a.id} !== ${controllerId}`);
        }
        const execution = this.notebookExecutionStateService.createCellExecution(uri, cellHandle);
        execution.confirm();
        this.executions.set(handle, execution);
    }
    $updateExecution(handle, updates) {
        const execution = this.executions.get(handle);
        execution === null || execution === void 0 ? void 0 : execution.update(updates.map(type_converters_1.NotebookDto.fromCellExecuteUpdateDto));
    }
    $completeExecution(handle, data) {
        try {
            const execution = this.executions.get(handle);
            execution === null || execution === void 0 ? void 0 : execution.complete(type_converters_1.NotebookDto.fromCellExecuteCompleteDto(data));
        }
        finally {
            this.executions.delete(handle);
        }
    }
    // TODO implement notebook execution (special api for executing full notebook instead of just cells)
    $createNotebookExecution(handle, controllerId, uri) {
        throw new Error('Method not implemented.');
    }
    $beginNotebookExecution(handle) {
        throw new Error('Method not implemented.');
    }
    $completeNotebookExecution(handle) {
        throw new Error('Method not implemented.');
    }
    async $addKernelDetectionTask(handle, notebookType) {
        const kernelDetectionTask = new KernelDetectionTask(notebookType);
        const registration = this.notebookKernelService.registerNotebookKernelDetectionTask(kernelDetectionTask);
        this.kernelDetectionTasks.set(handle, [kernelDetectionTask, registration]);
    }
    $removeKernelDetectionTask(handle) {
        const tuple = this.kernelDetectionTasks.get(handle);
        if (tuple) {
            tuple[1].dispose();
            this.kernelDetectionTasks.delete(handle);
        }
    }
    async $addKernelSourceActionProvider(handle, eventHandle, notebookType) {
        const kernelSourceActionProvider = {
            viewType: notebookType,
            provideKernelSourceActions: async () => {
                const actions = await this.proxy.$provideKernelSourceActions(handle, core_1.CancellationToken.None);
                return actions.map(action => ({
                    label: action.label,
                    command: action.command,
                    description: action.description,
                    detail: action.detail,
                    documentation: action.documentation,
                }));
            }
        };
        if (typeof eventHandle === 'number') {
            const emitter = new core_1.Emitter();
            this.kernelSourceActionProvidersEventRegistrations.set(eventHandle, emitter);
            kernelSourceActionProvider.onDidChangeSourceActions = emitter.event;
        }
        const registration = this.notebookKernelService.registerKernelSourceActionProvider(notebookType, kernelSourceActionProvider);
        this.kernelSourceActionProviders.set(handle, [kernelSourceActionProvider, registration]);
    }
    $removeKernelSourceActionProvider(handle, eventHandle) {
        const tuple = this.kernelSourceActionProviders.get(handle);
        if (tuple) {
            tuple[1].dispose();
            this.kernelSourceActionProviders.delete(handle);
        }
        if (typeof eventHandle === 'number') {
            this.kernelSourceActionProvidersEventRegistrations.delete(eventHandle);
        }
    }
    $emitNotebookKernelSourceActionsChangeEvent(eventHandle) {
    }
    dispose() {
        this.kernels.forEach(kernel => kernel[1].dispose());
    }
}
exports.NotebookKernelsMainImpl = NotebookKernelsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/notebook-kernels-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-renderers-main.js":
/*!***************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/notebook-renderers-main.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.NotebookRenderersMainImpl = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
const common_1 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
class NotebookRenderersMainImpl {
    constructor(rpc, container) {
        this.disposables = new core_1.DisposableCollection();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOK_RENDERERS_EXT);
        this.rendererMessagingService = container.get(browser_1.NotebookRendererMessagingService);
        this.rendererMessagingService.onShouldPostMessage(e => {
            this.proxy.$postRendererMessage(e.editorId, e.rendererId, e.message);
        });
    }
    $postMessage(editorId, rendererId, message) {
        return this.rendererMessagingService.receiveMessage(editorId, rendererId, message);
    }
    dispose() {
        this.disposables.dispose();
    }
}
exports.NotebookRenderersMainImpl = NotebookRenderersMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/notebook-renderers-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/notebooks-main.js":
/*!******************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/notebooks-main.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.NotebooksMainImpl = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const common_1 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
const notebook_dto_1 = __webpack_require__(/*! ./notebook-dto */ "../../packages/plugin-ext/lib/main/browser/notebooks/notebook-dto.js");
class NotebooksMainImpl {
    constructor(rpc, notebookService, plugins) {
        this.notebookService = notebookService;
        this.disposables = new core_1.DisposableCollection();
        this.notebookSerializer = new Map();
        this.notebookCellStatusBarRegistrations = new Map();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOKS_EXT);
        notebookService.onNotebookSerializer(async (event) => plugins.activateByEvent(event));
        notebookService.markReady();
    }
    dispose() {
        this.disposables.dispose();
        for (const disposable of this.notebookSerializer.values()) {
            disposable.dispose();
        }
    }
    $registerNotebookSerializer(handle, extension, viewType, options) {
        const disposables = new core_1.DisposableCollection();
        disposables.push(this.notebookService.registerNotebookSerializer(viewType, extension, {
            options,
            dataToNotebook: async (data) => {
                const dto = await this.proxy.$dataToNotebook(handle, data, core_1.CancellationToken.None);
                return notebook_dto_1.NotebookDto.fromNotebookDataDto(dto);
            },
            notebookToData: (data) => this.proxy.$notebookToData(handle, notebook_dto_1.NotebookDto.toNotebookDataDto(data), core_1.CancellationToken.None)
        }));
        this.notebookSerializer.set(handle, disposables);
    }
    $unregisterNotebookSerializer(handle) {
        var _a;
        (_a = this.notebookSerializer.get(handle)) === null || _a === void 0 ? void 0 : _a.dispose();
        this.notebookSerializer.delete(handle);
    }
    $emitCellStatusBarEvent(eventHandle) {
        const emitter = this.notebookCellStatusBarRegistrations.get(eventHandle);
        if (emitter instanceof core_1.Emitter) {
            emitter.fire(undefined);
        }
    }
    async $registerNotebookCellStatusBarItemProvider(handle, eventHandle, viewType) {
        const that = this;
        const provider = {
            async provideCellStatusBarItems(uri, index, token) {
                var _a;
                const result = await that.proxy.$provideNotebookCellStatusBarItems(handle, uri, index, token);
                return {
                    items: (_a = result === null || result === void 0 ? void 0 : result.items) !== null && _a !== void 0 ? _a : [],
                    dispose() {
                        if (result) {
                            that.proxy.$releaseNotebookCellStatusBarItems(result.cacheId);
                        }
                    }
                };
            },
            viewType
        };
        if (typeof eventHandle === 'number') {
            const emitter = new core_1.Emitter();
            this.notebookCellStatusBarRegistrations.set(eventHandle, emitter);
            provider.onDidChangeStatusBarItems = emitter.event;
        }
        // const disposable = this._cellStatusBarService.registerCellStatusBarItemProvider(provider);
        // this.notebookCellStatusBarRegistrations.set(handle, disposable);
    }
    async $unregisterNotebookCellStatusBarItemProvider(handle, eventHandle) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const unregisterThing = (statusBarHandle) => {
            var _a;
            const entry = this.notebookCellStatusBarRegistrations.get(statusBarHandle);
            if (entry) {
                (_a = this.notebookCellStatusBarRegistrations.get(statusBarHandle)) === null || _a === void 0 ? void 0 : _a.dispose();
                this.notebookCellStatusBarRegistrations.delete(statusBarHandle);
            }
        };
        unregisterThing(handle);
        if (typeof eventHandle === 'number') {
            unregisterThing(eventHandle);
        }
    }
}
exports.NotebooksMainImpl = NotebooksMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/notebooks-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notification-main.js":
/*!***********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notification-main.js ***!
  \***********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationMainImpl = void 0;
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/plugin-ext/lib/common/index.js");
const common_2 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
class NotificationMainImpl {
    constructor(rpc, container) {
        this.progressMap = new Map();
        this.progress2Work = new Map();
        this.toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
        this.progressService = container.get(common_2.ProgressService);
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTIFICATION_EXT);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $startProgress(options) {
        const onDidCancel = () => {
            // If the map does not contain current id, it has already stopped and should not be cancelled
            if (this.progressMap.has(id)) {
                this.proxy.$acceptProgressCanceled(id);
            }
        };
        const progressMessage = this.mapOptions(options);
        const progress = await this.progressService.showProgress(progressMessage, onDidCancel);
        const id = progress.id;
        this.progressMap.set(id, progress);
        this.progress2Work.set(id, 0);
        if (this.toDispose.disposed) {
            this.$stopProgress(id);
        }
        else {
            this.toDispose.push(disposable_1.Disposable.create(() => this.$stopProgress(id)));
        }
        return id;
    }
    mapOptions(options) {
        const { title, location, cancellable } = options;
        return { text: title, options: { location, cancelable: cancellable } };
    }
    $stopProgress(id) {
        const progress = this.progressMap.get(id);
        if (progress) {
            this.progressMap.delete(id);
            this.progress2Work.delete(id);
            progress.cancel();
        }
    }
    $updateProgress(id, item) {
        const progress = this.progressMap.get(id);
        if (!progress) {
            return;
        }
        const done = Math.min((this.progress2Work.get(id) || 0) + (item.increment || 0), 100);
        this.progress2Work.set(id, done);
        progress.report({ message: item.message, work: done ? { done, total: 100 } : undefined });
    }
}
exports.NotificationMainImpl = NotificationMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notification-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-contribution-handler.js":
/*!*********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-contribution-handler.js ***!
  \*********************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginContributionHandler = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const textmate_1 = __webpack_require__(/*! @theia/monaco/lib/browser/textmate */ "../../packages/monaco/lib/browser/textmate/index.js");
const menus_contribution_handler_1 = __webpack_require__(/*! ./menus/menus-contribution-handler */ "../../packages/plugin-ext/lib/main/browser/menus/menus-contribution-handler.js");
const plugin_view_registry_1 = __webpack_require__(/*! ./view/plugin-view-registry */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-registry.js");
const plugin_custom_editor_registry_1 = __webpack_require__(/*! ./custom-editors/plugin-custom-editor-registry */ "../../packages/plugin-ext/lib/main/browser/custom-editors/plugin-custom-editor-registry.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/plugin-ext/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const keybindings_contribution_handler_1 = __webpack_require__(/*! ./keybindings/keybindings-contribution-handler */ "../../packages/plugin-ext/lib/main/browser/keybindings/keybindings-contribution-handler.js");
const monaco_snippet_suggest_provider_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-snippet-suggest-provider */ "../../packages/monaco/lib/browser/monaco-snippet-suggest-provider.js");
const plugin_shared_style_1 = __webpack_require__(/*! ./plugin-shared-style */ "../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const browser_2 = __webpack_require__(/*! @theia/task/lib/browser */ "../../packages/task/lib/browser/index.js");
const browser_3 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
const plugin_debug_service_1 = __webpack_require__(/*! ./debug/plugin-debug-service */ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-service.js");
const debug_schema_updater_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-schema-updater */ "../../packages/debug/lib/browser/debug-schema-updater.js");
const monaco_theming_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-theming-service */ "../../packages/monaco/lib/browser/monaco-theming-service.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const plugin_icon_theme_service_1 = __webpack_require__(/*! ./plugin-icon-theme-service */ "../../packages/plugin-ext/lib/main/browser/plugin-icon-theme-service.js");
const common_2 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
const terminal_profile_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/terminal-profile-service */ "../../packages/terminal/lib/browser/terminal-profile-service.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const plugin_terminal_registry_1 = __webpack_require__(/*! ./plugin-terminal-registry */ "../../packages/plugin-ext/lib/main/browser/plugin-terminal-registry.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let PluginContributionHandler = class PluginContributionHandler {
    constructor() {
        this.injections = new Map();
        this.commandHandlers = new Map();
        this.onDidRegisterCommandHandlerEmitter = new event_1.Emitter();
        this.onDidRegisterCommandHandler = this.onDidRegisterCommandHandlerEmitter.event;
    }
    /**
     * Always synchronous in order to simplify handling disconnections.
     * @throws never, loading of each contribution should handle errors
     * in order to avoid preventing loading of other contributions or extensions
     */
    handleContributions(clientId, plugin) {
        const contributions = plugin.contributes;
        if (!contributions) {
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const logError = (message, ...args) => console.error(`[${clientId}][${plugin.metadata.model.id}]: ${message}`, ...args);
        const logWarning = (message, ...args) => console.warn(`[${clientId}][${plugin.metadata.model.id}]: ${message}`, ...args);
        const pushContribution = (id, contribute) => {
            if (toDispose.disposed) {
                return;
            }
            try {
                toDispose.push(contribute());
            }
            catch (e) {
                logError(`Failed to load '${id}' contribution.`, e);
            }
        };
        const configuration = contributions.configuration;
        if (configuration) {
            for (const config of configuration) {
                pushContribution('configuration', () => this.preferenceSchemaProvider.setSchema(config));
            }
        }
        const configurationDefaults = contributions.configurationDefaults;
        if (configurationDefaults) {
            pushContribution('configurationDefaults', () => this.updateDefaultOverridesSchema(configurationDefaults));
        }
        const languages = contributions.languages;
        if (languages && languages.length) {
            for (const lang of languages) {
                // it is not possible to unregister a language
                monaco.languages.register({
                    id: lang.id,
                    aliases: lang.aliases,
                    extensions: lang.extensions,
                    filenamePatterns: lang.filenamePatterns,
                    filenames: lang.filenames,
                    firstLine: lang.firstLine,
                    mimetypes: lang.mimetypes
                });
                const langConfiguration = lang.configuration;
                if (langConfiguration) {
                    pushContribution(`language.${lang.id}.configuration`, () => monaco.languages.setLanguageConfiguration(lang.id, {
                        wordPattern: this.createRegex(langConfiguration.wordPattern),
                        autoClosingPairs: langConfiguration.autoClosingPairs,
                        brackets: langConfiguration.brackets,
                        comments: langConfiguration.comments,
                        folding: this.convertFolding(langConfiguration.folding),
                        surroundingPairs: langConfiguration.surroundingPairs,
                        indentationRules: this.convertIndentationRules(langConfiguration.indentationRules),
                        onEnterRules: this.convertOnEnterRules(langConfiguration.onEnterRules),
                    }));
                }
            }
        }
        const grammars = contributions.grammars;
        if (grammars && grammars.length) {
            const grammarsWithLanguage = [];
            for (const grammar of grammars) {
                if (grammar.injectTo) {
                    for (const injectScope of grammar.injectTo) {
                        pushContribution(`grammar.injectTo.${injectScope}`, () => {
                            const injections = this.injections.get(injectScope) || [];
                            injections.push(grammar.scope);
                            this.injections.set(injectScope, injections);
                            return disposable_1.Disposable.create(() => {
                                const index = injections.indexOf(grammar.scope);
                                if (index !== -1) {
                                    injections.splice(index, 1);
                                }
                            });
                        });
                    }
                }
                if (grammar.language) {
                    // processing is deferred.
                    grammarsWithLanguage.push(grammar);
                }
                pushContribution(`grammar.textmate.scope.${grammar.scope}`, () => this.grammarsRegistry.registerTextmateGrammarScope(grammar.scope, {
                    async getGrammarDefinition() {
                        return {
                            format: grammar.format,
                            content: grammar.grammar || '',
                            location: grammar.grammarLocation
                        };
                    },
                    getInjections: (scopeName) => this.injections.get(scopeName)
                }));
            }
            // load grammars on next tick to await registration of languages from all plugins in current tick
            // see https://github.com/eclipse-theia/theia/issues/6907#issuecomment-578600243
            setTimeout(() => {
                for (const grammar of grammarsWithLanguage) {
                    const language = grammar.language;
                    pushContribution(`grammar.language.${language}.scope`, () => this.grammarsRegistry.mapLanguageIdToTextmateGrammar(language, grammar.scope));
                    pushContribution(`grammar.language.${language}.configuration`, () => {
                        var _a;
                        return this.grammarsRegistry.registerGrammarConfiguration(language, {
                            embeddedLanguages: this.convertEmbeddedLanguages(grammar.embeddedLanguages, logWarning),
                            tokenTypes: this.convertTokenTypes(grammar.tokenTypes),
                            balancedBracketSelectors: (_a = grammar.balancedBracketScopes) !== null && _a !== void 0 ? _a : ['*'],
                            unbalancedBracketSelectors: grammar.balancedBracketScopes,
                        });
                    });
                }
                // activate grammars only once everything else is loaded.
                // see https://github.com/eclipse-theia/theia-cpp-extensions/issues/100#issuecomment-610643866
                setTimeout(() => {
                    for (const grammar of grammarsWithLanguage) {
                        const language = grammar.language;
                        pushContribution(`grammar.language.${language}.activation`, () => this.monacoTextmateService.activateLanguage(language));
                    }
                });
            });
        }
        pushContribution('commands', () => this.registerCommands(contributions));
        pushContribution('menus', () => this.menusContributionHandler.handle(plugin));
        pushContribution('keybindings', () => this.keybindingsContributionHandler.handle(contributions));
        if (contributions.customEditors) {
            for (const customEditor of contributions.customEditors) {
                pushContribution(`customEditors.${customEditor.viewType}`, () => this.customEditorRegistry.registerCustomEditor(customEditor));
            }
        }
        if (contributions.viewsContainers) {
            for (const location in contributions.viewsContainers) {
                if (contributions.viewsContainers.hasOwnProperty(location)) {
                    for (const viewContainer of contributions.viewsContainers[location]) {
                        pushContribution(`viewContainers.${viewContainer.id}`, () => this.viewRegistry.registerViewContainer(location, viewContainer));
                    }
                }
            }
        }
        if (contributions.views) {
            // eslint-disable-next-line guard-for-in
            for (const location in contributions.views) {
                for (const view of contributions.views[location]) {
                    pushContribution(`views.${view.id}`, () => this.viewRegistry.registerView(location, view));
                }
            }
        }
        if (contributions.viewsWelcome) {
            for (const [index, viewWelcome] of contributions.viewsWelcome.entries()) {
                pushContribution(`viewsWelcome.${viewWelcome.view}.${index}`, () => this.viewRegistry.registerViewWelcome(viewWelcome));
            }
        }
        if (contributions.snippets) {
            for (const snippet of contributions.snippets) {
                pushContribution(`snippets.${snippet.uri}`, () => this.snippetSuggestProvider.fromURI(snippet.uri, {
                    language: snippet.language,
                    source: snippet.source
                }));
            }
        }
        if (contributions.themes && contributions.themes.length) {
            const pending = {};
            for (const theme of contributions.themes) {
                pushContribution(`themes.${theme.uri}`, () => this.monacoThemingService.register(theme, pending));
            }
        }
        if (contributions.iconThemes && contributions.iconThemes.length) {
            for (const iconTheme of contributions.iconThemes) {
                pushContribution(`iconThemes.${iconTheme.uri}`, () => this.iconThemeService.register(iconTheme, plugin));
            }
        }
        const colors = contributions.colors;
        if (colors) {
            pushContribution('colors', () => this.colors.register(...colors));
        }
        if (contributions.taskDefinitions) {
            for (const taskDefinition of contributions.taskDefinitions) {
                pushContribution(`taskDefinitions.${taskDefinition.taskType}`, () => this.taskDefinitionRegistry.register(taskDefinition));
            }
        }
        if (contributions.problemPatterns) {
            for (const problemPattern of contributions.problemPatterns) {
                pushContribution(`problemPatterns.${problemPattern.name || problemPattern.regexp}`, () => this.problemPatternRegistry.register(problemPattern));
            }
        }
        if (contributions.problemMatchers) {
            for (const problemMatcher of contributions.problemMatchers) {
                pushContribution(`problemMatchers.${problemMatcher.label}`, () => this.problemMatcherRegistry.register(problemMatcher));
            }
        }
        if (contributions.debuggers && contributions.debuggers.length) {
            toDispose.push(disposable_1.Disposable.create(() => this.debugSchema.update()));
            for (const contribution of contributions.debuggers) {
                pushContribution(`debuggers.${contribution.type}`, () => this.debugService.registerDebugger(contribution));
            }
            this.debugSchema.update();
        }
        if (contributions.resourceLabelFormatters) {
            for (const formatter of contributions.resourceLabelFormatters) {
                for (const contribution of this.contributionProvider.getContributions()) {
                    if (contribution instanceof browser_1.DefaultUriLabelProviderContribution) {
                        pushContribution(`resourceLabelFormatters.${formatter.scheme}`, () => contribution.registerFormatter(formatter));
                    }
                }
            }
        }
        const self = this;
        if (contributions.terminalProfiles) {
            for (const profile of contributions.terminalProfiles) {
                pushContribution(`terminalProfiles.${profile.id}`, () => {
                    this.contributedProfileStore.registerTerminalProfile(profile.title, {
                        async start() {
                            const terminalId = await self.pluginTerminalRegistry.start(profile.id);
                            const result = self.terminalService.getById(terminalId);
                            if (!result) {
                                throw new Error(`Error starting terminal from profile ${profile.id}`);
                            }
                            return result;
                        }
                    });
                    return disposable_1.Disposable.create(() => {
                        this.contributedProfileStore.unregisterTerminalProfile(profile.id);
                    });
                });
            }
        }
        if (contributions.notebooks) {
            for (const notebook of contributions.notebooks) {
                pushContribution(`notebook.${notebook.type}`, () => this.notebookTypeRegistry.registerNotebookType(notebook));
            }
        }
        if (contributions.notebookRenderer) {
            for (const renderer of contributions.notebookRenderer) {
                pushContribution(`notebookRenderer.${renderer.id}`, () => this.notebookRendererRegistry.registerNotebookRenderer(renderer, `/hostedPlugin/${(0, common_1.getPluginId)(plugin.metadata.model)}`));
            }
        }
        return toDispose;
    }
    registerCommands(contribution) {
        if (!contribution.commands) {
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection();
        for (const { iconUrl, themeIcon, command, category, title, originalTitle, enablement } of contribution.commands) {
            const reference = iconUrl && this.style.toIconClass(iconUrl);
            const icon = themeIcon && themeService_1.ThemeIcon.fromString(themeIcon);
            let iconClass;
            if (reference) {
                toDispose.push(reference);
                iconClass = reference.object.iconClass;
            }
            else if (icon) {
                iconClass = themeService_1.ThemeIcon.asClassName(icon);
            }
            toDispose.push(this.registerCommand({ id: command, category, label: title, originalLabel: originalTitle, iconClass }, enablement));
        }
        return toDispose;
    }
    registerCommand(command, enablement) {
        if (this.hasCommand(command.id)) {
            console.warn(`command '${command.id}' already registered`);
            return disposable_1.Disposable.NULL;
        }
        const commandHandler = {
            execute: async (...args) => {
                const handler = this.commandHandlers.get(command.id);
                if (!handler) {
                    throw new Error(`command '${command.id}' not found`);
                }
                return handler(...args);
            },
            // Always enabled - a command can be executed programmatically or via the commands palette.
            isEnabled: () => {
                if (enablement) {
                    return this.contextKeyService.match(enablement);
                }
                return true;
            },
            // Visibility rules are defined via the `menus` contribution point.
            isVisible() { return true; }
        };
        if (enablement) {
            const contextKeys = this.contextKeyService.parseKeys(enablement);
            if (contextKeys && contextKeys.size > 0) {
                commandHandler.onDidChangeEnabled = (listener) => this.contextKeyService.onDidChange(e => {
                    if (e.affects(contextKeys)) {
                        listener();
                    }
                });
            }
        }
        const toDispose = new disposable_1.DisposableCollection();
        if (this.commands.getCommand(command.id)) {
            // overriding built-in command, i.e. `type` by the VSCodeVim extension
            toDispose.push(this.commands.registerHandler(command.id, commandHandler));
        }
        else {
            toDispose.push(this.commands.registerCommand(command, commandHandler));
        }
        this.commandHandlers.set(command.id, undefined);
        toDispose.push(disposable_1.Disposable.create(() => this.commandHandlers.delete(command.id)));
        return toDispose;
    }
    registerCommandHandler(id, execute) {
        if (this.hasCommandHandler(id)) {
            console.warn(`command handler '${id}' already registered`);
            return disposable_1.Disposable.NULL;
        }
        this.commandHandlers.set(id, execute);
        this.onDidRegisterCommandHandlerEmitter.fire(id);
        return disposable_1.Disposable.create(() => this.commandHandlers.set(id, undefined));
    }
    hasCommand(id) {
        return this.commandHandlers.has(id);
    }
    hasCommandHandler(id) {
        return !!this.commandHandlers.get(id);
    }
    updateDefaultOverridesSchema(configurationDefaults) {
        const defaultOverrides = {
            id: preferences_1.DefaultOverridesPreferenceSchemaId,
            title: 'Default Configuration Overrides',
            properties: {}
        };
        // eslint-disable-next-line guard-for-in
        for (const key in configurationDefaults) {
            const defaultValue = configurationDefaults[key];
            if (this.preferenceOverrideService.testOverrideValue(key, defaultValue)) {
                // language specific override
                defaultOverrides.properties[key] = {
                    type: 'object',
                    default: defaultValue,
                    description: `Configure editor settings to be overridden for ${key} language.`
                };
            }
            else {
                // regular configuration override
                defaultOverrides.properties[key] = {
                    default: defaultValue,
                    description: `Configure default setting for ${key}.`
                };
            }
        }
        if (Object.keys(defaultOverrides.properties).length) {
            return this.preferenceSchemaProvider.setSchema(defaultOverrides);
        }
        return disposable_1.Disposable.NULL;
    }
    createRegex(value) {
        if (typeof value === 'string') {
            return new RegExp(value, '');
        }
        if (typeof value == 'undefined') {
            return undefined;
        }
        return new RegExp(value.pattern, value.flags);
    }
    convertIndentationRules(rules) {
        if (!rules) {
            return undefined;
        }
        return {
            decreaseIndentPattern: this.createRegex(rules.decreaseIndentPattern),
            increaseIndentPattern: this.createRegex(rules.increaseIndentPattern),
            indentNextLinePattern: this.createRegex(rules.indentNextLinePattern),
            unIndentedLinePattern: this.createRegex(rules.unIndentedLinePattern)
        };
    }
    convertFolding(folding) {
        if (!folding) {
            return undefined;
        }
        const result = {
            offSide: folding.offSide
        };
        if (folding.markers) {
            result.markers = {
                end: this.createRegex(folding.markers.end),
                start: this.createRegex(folding.markers.start)
            };
        }
        return result;
    }
    convertTokenTypes(tokenTypes) {
        if (typeof tokenTypes === 'undefined' || tokenTypes === null) {
            return undefined;
        }
        const result = Object.create(null);
        const scopes = Object.keys(tokenTypes);
        const len = scopes.length;
        for (let i = 0; i < len; i++) {
            const scope = scopes[i];
            const tokenType = tokenTypes[scope];
            switch (tokenType) {
                case 'string':
                    result[scope] = 2 /* String */;
                    break;
                case 'other':
                    result[scope] = 0 /* Other */;
                    break;
                case 'comment':
                    result[scope] = 1 /* Comment */;
                    break;
            }
        }
        return result;
    }
    convertEmbeddedLanguages(languages, logWarning) {
        if (typeof languages === 'undefined' || languages === null) {
            return undefined;
        }
        const result = Object.create(null);
        const scopes = Object.keys(languages);
        const len = scopes.length;
        for (let i = 0; i < len; i++) {
            const scope = scopes[i];
            const langId = languages[scope];
            result[scope] = (0, textmate_1.getEncodedLanguageId)(langId);
            if (!result[scope]) {
                logWarning(`Language for '${scope}' not found.`);
            }
        }
        return result;
    }
    convertOnEnterRules(onEnterRules) {
        if (!onEnterRules) {
            return undefined;
        }
        const result = [];
        for (const onEnterRule of onEnterRules) {
            const rule = {
                beforeText: this.createRegex(onEnterRule.beforeText),
                afterText: this.createRegex(onEnterRule.afterText),
                previousLineText: this.createRegex(onEnterRule.previousLineText),
                action: this.createEnterAction(onEnterRule.action),
            };
            result.push(rule);
        }
        return result;
    }
    createEnterAction(action) {
        let indentAction;
        switch (action.indent) {
            case 'indent':
                indentAction = monaco.languages.IndentAction.Indent;
                break;
            case 'indentOutdent':
                indentAction = monaco.languages.IndentAction.IndentOutdent;
                break;
            case 'outdent':
                indentAction = monaco.languages.IndentAction.Outdent;
                break;
            default:
                indentAction = monaco.languages.IndentAction.None;
                break;
        }
        return { indentAction, appendText: action.appendText, removeText: action.removeText };
    }
};
__decorate([
    (0, inversify_1.inject)(textmate_1.TextmateRegistry),
    __metadata("design:type", textmate_1.TextmateRegistry)
], PluginContributionHandler.prototype, "grammarsRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_view_registry_1.PluginViewRegistry),
    __metadata("design:type", plugin_view_registry_1.PluginViewRegistry)
], PluginContributionHandler.prototype, "viewRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_custom_editor_registry_1.PluginCustomEditorRegistry),
    __metadata("design:type", plugin_custom_editor_registry_1.PluginCustomEditorRegistry)
], PluginContributionHandler.prototype, "customEditorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(menus_contribution_handler_1.MenusContributionPointHandler),
    __metadata("design:type", menus_contribution_handler_1.MenusContributionPointHandler)
], PluginContributionHandler.prototype, "menusContributionHandler", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], PluginContributionHandler.prototype, "preferenceSchemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preferences_1.PreferenceLanguageOverrideService),
    __metadata("design:type", preferences_1.PreferenceLanguageOverrideService)
], PluginContributionHandler.prototype, "preferenceOverrideService", void 0);
__decorate([
    (0, inversify_1.inject)(textmate_1.MonacoTextmateService),
    __metadata("design:type", textmate_1.MonacoTextmateService)
], PluginContributionHandler.prototype, "monacoTextmateService", void 0);
__decorate([
    (0, inversify_1.inject)(keybindings_contribution_handler_1.KeybindingsContributionPointHandler),
    __metadata("design:type", keybindings_contribution_handler_1.KeybindingsContributionPointHandler)
], PluginContributionHandler.prototype, "keybindingsContributionHandler", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider),
    __metadata("design:type", monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider)
], PluginContributionHandler.prototype, "snippetSuggestProvider", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], PluginContributionHandler.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], PluginContributionHandler.prototype, "style", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.TaskDefinitionRegistry),
    __metadata("design:type", browser_2.TaskDefinitionRegistry)
], PluginContributionHandler.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.ProblemMatcherRegistry),
    __metadata("design:type", browser_2.ProblemMatcherRegistry)
], PluginContributionHandler.prototype, "problemMatcherRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.ProblemPatternRegistry),
    __metadata("design:type", browser_2.ProblemPatternRegistry)
], PluginContributionHandler.prototype, "problemPatternRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_debug_service_1.PluginDebugService),
    __metadata("design:type", plugin_debug_service_1.PluginDebugService)
], PluginContributionHandler.prototype, "debugService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_schema_updater_1.DebugSchemaUpdater),
    __metadata("design:type", debug_schema_updater_1.DebugSchemaUpdater)
], PluginContributionHandler.prototype, "debugSchema", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theming_service_1.MonacoThemingService),
    __metadata("design:type", monaco_theming_service_1.MonacoThemingService)
], PluginContributionHandler.prototype, "monacoThemingService", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], PluginContributionHandler.prototype, "colors", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_icon_theme_service_1.PluginIconThemeService),
    __metadata("design:type", plugin_icon_theme_service_1.PluginIconThemeService)
], PluginContributionHandler.prototype, "iconThemeService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], PluginContributionHandler.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_terminal_registry_1.PluginTerminalRegistry),
    __metadata("design:type", plugin_terminal_registry_1.PluginTerminalRegistry)
], PluginContributionHandler.prototype, "pluginTerminalRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_profile_service_1.ContributedTerminalProfileStore),
    __metadata("design:type", Object)
], PluginContributionHandler.prototype, "contributedProfileStore", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.NotebookTypeRegistry),
    __metadata("design:type", browser_3.NotebookTypeRegistry)
], PluginContributionHandler.prototype, "notebookTypeRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.NotebookRendererRegistry),
    __metadata("design:type", browser_3.NotebookRendererRegistry)
], PluginContributionHandler.prototype, "notebookRendererRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.ContributionProvider),
    (0, inversify_1.named)(browser_1.LabelProviderContribution),
    __metadata("design:type", Object)
], PluginContributionHandler.prototype, "contributionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], PluginContributionHandler.prototype, "contextKeyService", void 0);
PluginContributionHandler = __decorate([
    (0, inversify_1.injectable)()
], PluginContributionHandler);
exports.PluginContributionHandler = PluginContributionHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-contribution-handler'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-icon-theme-service.js":
/*!*******************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-icon-theme-service.js ***!
  \*******************************************************************************/
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code is copied and modified from:
// https://github.com/microsoft/vscode/blob/7cf4cca47aa025a590fc939af54932042302be63/src/vs/workbench/services/themes/browser/fileIconThemeData.ts
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
exports.PluginIconThemeService = exports.PluginIconTheme = exports.PluginIconThemeDefinition = exports.PluginIconThemeFactory = void 0;
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const icon_theme_service_1 = __webpack_require__(/*! @theia/core/lib/browser/icon-theme-service */ "../../packages/core/lib/browser/icon-theme-service.js");
const plugin_protocol_1 = __webpack_require__(/*! ../../common/plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const navigator_tree_1 = __webpack_require__(/*! @theia/navigator/lib/browser/navigator-tree */ "../../packages/navigator/lib/browser/navigator-tree.js");
const endpoint_1 = __webpack_require__(/*! @theia/core/lib/browser/endpoint */ "../../packages/core/lib/browser/endpoint.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const files_1 = __webpack_require__(/*! @theia/filesystem/lib/common/files */ "../../packages/filesystem/lib/common/files.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const language_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/languages/language */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/languages/language.js");
exports.PluginIconThemeFactory = Symbol('PluginIconThemeFactory');
let PluginIconThemeDefinition = class PluginIconThemeDefinition {
};
PluginIconThemeDefinition = __decorate([
    (0, inversify_1.injectable)()
], PluginIconThemeDefinition);
exports.PluginIconThemeDefinition = PluginIconThemeDefinition;
let PluginIconTheme = class PluginIconTheme extends PluginIconThemeDefinition {
    constructor() {
        super(...arguments);
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.toDeactivate = new disposable_1.DisposableCollection();
        this.toUnload = new disposable_1.DisposableCollection();
        this.toDisposeStyleElement = new disposable_1.DisposableCollection();
        this.toDispose = new disposable_1.DisposableCollection(this.toDeactivate, this.toDisposeStyleElement, this.toUnload, this.onDidChangeEmitter);
        this.icons = new Set();
        this.reload = debounce(() => {
            this.toUnload.dispose();
            this.doActivate();
        }, 50);
        this.fileIcon = 'theia-plugin-file-icon';
        this.folderIcon = 'theia-plugin-folder-icon';
        this.folderExpandedIcon = 'theia-plugin-folder-expanded-icon';
        this.rootFolderIcon = 'theia-plugin-root-folder-icon';
        this.rootFolderExpandedIcon = 'theia-plugin-root-folder-expanded-icon';
    }
    init() {
        Object.assign(this, this.definition);
        this.packageRootUri = new uri_1.default(this.packageUri);
        this.locationUri = new uri_1.default(this.uri).parent;
    }
    dispose() {
        this.toDispose.dispose();
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire({ affects: () => true });
    }
    activate() {
        if (!this.toDeactivate.disposed) {
            return this.toDeactivate;
        }
        this.toDeactivate.push(disposable_1.Disposable.create(() => this.fireDidChange()));
        this.doActivate();
        return this.toDeactivate;
    }
    async doActivate() {
        await this.load();
        this.updateStyleElement();
    }
    updateStyleElement() {
        this.toDisposeStyleElement.dispose();
        if (this.toDeactivate.disposed || !this.styleSheetContent) {
            return;
        }
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.className = 'theia-icon-theme';
        styleElement.innerText = this.styleSheetContent;
        document.head.appendChild(styleElement);
        const toRemoveStyleElement = disposable_1.Disposable.create(() => styleElement.remove());
        this.toDisposeStyleElement.push(toRemoveStyleElement);
        this.toDeactivate.push(toRemoveStyleElement);
        this.fireDidChange();
    }
    /**
     * This should be aligned with
     * https://github.com/microsoft/vscode/blob/7cf4cca47aa025a590fc939af54932042302be63/src/vs/workbench/services/themes/browser/fileIconThemeData.ts#L201
     */
    async load() {
        if (this.styleSheetContent !== undefined) {
            return;
        }
        this.styleSheetContent = '';
        this.toUnload.push(disposable_1.Disposable.create(() => {
            this.styleSheetContent = undefined;
            this.hasFileIcons = undefined;
            this.hasFolderIcons = undefined;
            this.hidesExplorerArrows = undefined;
            this.icons.clear();
        }));
        const uri = new uri_1.default(this.uri);
        const result = await this.fileService.read(uri);
        const content = result.value;
        const json = jsoncparser.parse(content, undefined, { disallowComments: false });
        this.hidesExplorerArrows = !!json.hidesExplorerArrows;
        const toUnwatch = this.fileService.watch(uri);
        if (this.toUnload.disposed) {
            toUnwatch.dispose();
        }
        else {
            this.toUnload.push(toUnwatch);
            this.toUnload.push(this.fileService.onDidFilesChange(e => {
                if (e.contains(uri, 1 /* ADDED */) || e.contains(uri, 0 /* UPDATED */)) {
                    this.reload();
                }
            }));
        }
        const iconDefinitions = json.iconDefinitions;
        if (!iconDefinitions) {
            return;
        }
        const definitionSelectors = new Map();
        const acceptSelector = (themeType, definitionId, ...icons) => {
            if (!iconDefinitions[definitionId]) {
                return;
            }
            let selector = '';
            for (const icon of icons) {
                if (icon) {
                    selector += '.' + icon;
                    this.icons.add(icon);
                }
            }
            if (!selector) {
                return;
            }
            const selectors = definitionSelectors.get(definitionId) || [];
            if (themeType !== 'dark') {
                selector = '.theia-' + themeType + ' ' + selector;
            }
            selectors.push(selector + '::before');
            definitionSelectors.set(definitionId, selectors);
        };
        this.collectSelectors(json, acceptSelector.bind(undefined, 'dark'));
        if (json.light) {
            this.collectSelectors(json.light, acceptSelector.bind(undefined, 'light'));
        }
        if (json.highContrast) {
            this.collectSelectors(json.highContrast, acceptSelector.bind(undefined, 'hc'));
        }
        if (!this.icons.size) {
            return;
        }
        const fonts = json.fonts;
        if (Array.isArray(fonts)) {
            for (const font of fonts) {
                if (font) {
                    let src = '';
                    if (Array.isArray(font.src)) {
                        for (const srcLocation of font.src) {
                            if (srcLocation && srcLocation.path) {
                                const cssUrl = this.toCSSUrl(srcLocation.path);
                                if (cssUrl) {
                                    if (src) {
                                        src += ', ';
                                    }
                                    src += `${cssUrl} format('${srcLocation.format}')`;
                                }
                            }
                        }
                    }
                    if (src) {
                        this.styleSheetContent += `@font-face {
    src: ${src};
    font-family: '${font.id}';
    font-weight: ${font.weight};
    font-style: ${font.style};
}
`;
                    }
                }
            }
            const firstFont = fonts[0];
            if (firstFont && firstFont.id) {
                this.styleSheetContent += `.${this.fileIcon}::before, .${this.folderIcon}::before, .${this.rootFolderIcon}::before {
    font-family: '${firstFont.id}';
    font-size: ${firstFont.size || '150%'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: top;
}
`;
            }
        }
        for (const definitionId of definitionSelectors.keys()) {
            const iconDefinition = iconDefinitions[definitionId];
            const selectors = definitionSelectors.get(definitionId);
            if (selectors && iconDefinition) {
                const cssUrl = this.toCSSUrl(iconDefinition.iconPath);
                if (cssUrl) {
                    this.styleSheetContent += `${selectors.join(', ')} {
    content: ' ';
    background-image: ${cssUrl};
    background-size: 16px;
    background-position: left center;
    background-repeat: no-repeat;
}
`;
                }
                if (iconDefinition.fontCharacter || iconDefinition.fontColor) {
                    let body = '';
                    if (iconDefinition.fontColor) {
                        body += ` color: ${iconDefinition.fontColor};`;
                    }
                    if (iconDefinition.fontCharacter) {
                        body += ` content: '${iconDefinition.fontCharacter}';`;
                    }
                    if (iconDefinition.fontSize) {
                        body += ` font-size: ${iconDefinition.fontSize};`;
                    }
                    if (iconDefinition.fontId) {
                        body += ` font-family: ${iconDefinition.fontId};`;
                    }
                    this.styleSheetContent += `${selectors.join(', ')} {${body} }\n`;
                }
            }
        }
    }
    toCSSUrl(iconPath) {
        if (!iconPath) {
            return undefined;
        }
        const iconUri = this.locationUri.resolve(iconPath);
        const relativePath = this.packageRootUri.path.relative(iconUri.path.normalize());
        return relativePath && `url('${new endpoint_1.Endpoint({
            path: `hostedPlugin/${this.pluginId}/${encodeURIComponent(relativePath.normalize().toString())}`
        }).getRestUrl().toString()}')`;
    }
    escapeCSS(value) {
        value = value.replace(/[^\-a-zA-Z0-9]/g, '-');
        if (value.charAt(0).match(/[0-9\-]/)) {
            value = '-' + value;
        }
        return value;
    }
    folderNameIcon(folderName) {
        return 'theia-plugin-' + this.escapeCSS(folderName.toLowerCase()) + '-folder-name-icon';
    }
    expandedFolderNameIcon(folderName) {
        return 'theia-plugin-' + this.escapeCSS(folderName.toLowerCase()) + '-expanded-folder-name-icon';
    }
    fileNameIcon(fileName) {
        fileName = fileName.toLowerCase();
        const extIndex = fileName.indexOf('.');
        const icons = extIndex !== -1 ? this.fileExtensionIcon(fileName.substring(extIndex + 1)) : [];
        icons.unshift('theia-plugin-' + this.escapeCSS(fileName) + '-file-name-icon');
        return icons;
    }
    fileExtensionIcon(fileExtension) {
        fileExtension = fileExtension.toString();
        const icons = [];
        const segments = fileExtension.split('.');
        if (segments.length) {
            if (segments.length) {
                for (let i = 0; i < segments.length; i++) {
                    icons.push('theia-plugin-' + this.escapeCSS(segments.slice(i).join('.')) + '-ext-file-icon');
                }
                icons.push('theia-plugin-ext-file-icon'); // extra segment to increase file-ext score
            }
        }
        return icons;
    }
    languageIcon(languageId) {
        return 'theia-plugin-' + this.escapeCSS(languageId) + '-lang-file-icon';
    }
    collectSelectors(associations, accept) {
        if (associations.folder) {
            accept(associations.folder, this.folderIcon);
            if (associations.folderExpanded === undefined) {
                // Use the same icon for expanded state (issue #12727). Check for
                // undefined folderExpanded property to allow for
                // "folderExpanded": null in case a developer really wants that
                accept(associations.folder, this.folderExpandedIcon);
            }
            this.hasFolderIcons = true;
        }
        if (associations.folderExpanded) {
            accept(associations.folderExpanded, this.folderExpandedIcon);
            this.hasFolderIcons = true;
        }
        const rootFolder = associations.rootFolder || associations.folder;
        if (rootFolder) {
            accept(rootFolder, this.rootFolderIcon);
            this.hasFolderIcons = true;
        }
        const rootFolderExpanded = associations.rootFolderExpanded || associations.folderExpanded;
        if (rootFolderExpanded) {
            accept(rootFolderExpanded, this.rootFolderExpandedIcon);
            this.hasFolderIcons = true;
        }
        if (associations.file) {
            accept(associations.file, this.fileIcon);
            this.hasFileIcons = true;
        }
        const folderNames = associations.folderNames;
        if (folderNames) {
            // eslint-disable-next-line guard-for-in
            for (const folderName in folderNames) {
                accept(folderNames[folderName], this.folderNameIcon(folderName), this.folderIcon);
                this.hasFolderIcons = true;
            }
        }
        const folderNamesExpanded = associations.folderNamesExpanded;
        if (folderNamesExpanded) {
            // eslint-disable-next-line guard-for-in
            for (const folderName in folderNamesExpanded) {
                accept(folderNamesExpanded[folderName], this.expandedFolderNameIcon(folderName), this.folderExpandedIcon);
                this.hasFolderIcons = true;
            }
        }
        const languageIds = associations.languageIds;
        if (languageIds) {
            if (!languageIds.jsonc && languageIds.json) {
                languageIds.jsonc = languageIds.json;
            }
            // eslint-disable-next-line guard-for-in
            for (const languageId in languageIds) {
                accept(languageIds[languageId], this.languageIcon(languageId), this.fileIcon);
                this.hasFileIcons = true;
            }
        }
        const fileExtensions = associations.fileExtensions;
        if (fileExtensions) {
            // eslint-disable-next-line guard-for-in
            for (const fileExtension in fileExtensions) {
                accept(fileExtensions[fileExtension], ...this.fileExtensionIcon(fileExtension), this.fileIcon);
                this.hasFileIcons = true;
            }
        }
        const fileNames = associations.fileNames;
        if (fileNames) {
            // eslint-disable-next-line guard-for-in
            for (const fileName in fileNames) {
                accept(fileNames[fileName], ...this.fileNameIcon(fileName), this.fileIcon);
                this.hasFileIcons = true;
            }
        }
    }
    /**
     * This should be aligned with
     * https://github.com/microsoft/vscode/blob/7cf4cca47aa025a590fc939af54932042302be63/src/vs/editor/common/services/getIconClasses.ts#L5
     */
    getIcon(element) {
        let icon = '';
        for (const className of this.getClassNames(element)) {
            if (this.icons.has(className)) {
                if (icon) {
                    icon += ' ';
                }
                icon += className;
            }
        }
        return icon;
    }
    getClassNames(element) {
        if (navigator_tree_1.WorkspaceRootNode.is(element)) {
            const name = this.labelProvider.getName(element);
            if (element.expanded) {
                return [this.rootFolderExpandedIcon, this.expandedFolderNameIcon(name)];
            }
            return [this.rootFolderIcon, this.folderNameIcon(name)];
        }
        if (browser_1.DirNode.is(element)) {
            if (element.expanded) {
                const name = this.labelProvider.getName(element);
                return [this.folderExpandedIcon, this.expandedFolderNameIcon(name)];
            }
            return this.getFolderClassNames(element);
        }
        if (browser_1.FileStatNode.is(element)) {
            return this.getFileClassNames(element, element.fileStat.resource.toString());
        }
        if (files_1.FileStat.is(element)) {
            if (element.isDirectory) {
                return this.getFolderClassNames(element);
            }
            return this.getFileClassNames(element, element.resource.toString());
        }
        if (label_provider_1.URIIconReference.is(element)) {
            if (element.id === 'folder') {
                return this.getFolderClassNames(element);
            }
            return this.getFileClassNames(element, element.uri && element.uri.toString());
        }
        return this.getFileClassNames(element, element.toString());
    }
    getFolderClassNames(element) {
        const name = this.labelProvider.getName(element);
        return [this.folderIcon, this.folderNameIcon(name)];
    }
    getFileClassNames(element, uri) {
        var _a;
        const name = this.labelProvider.getName(element);
        const classNames = this.fileNameIcon(name);
        if (uri) {
            const parsedURI = new uri_1.default(uri);
            const isRoot = (_a = this.workspaceService.getWorkspaceRootUri(new uri_1.default(uri))) === null || _a === void 0 ? void 0 : _a.isEqual(parsedURI);
            if (isRoot) {
                classNames.unshift(this.rootFolderIcon);
            }
            else {
                classNames.unshift(this.fileIcon);
            }
            const language = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService).createByFilepathOrFirstLine(parsedURI['codeUri']);
            classNames.push(this.languageIcon(language.languageId));
        }
        return classNames;
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], PluginIconTheme.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], PluginIconTheme.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(PluginIconThemeDefinition),
    __metadata("design:type", PluginIconThemeDefinition)
], PluginIconTheme.prototype, "definition", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], PluginIconTheme.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginIconTheme.prototype, "init", null);
PluginIconTheme = __decorate([
    (0, inversify_1.injectable)()
], PluginIconTheme);
exports.PluginIconTheme = PluginIconTheme;
let PluginIconThemeService = class PluginIconThemeService {
    constructor() {
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire({ affects: () => true });
    }
    register(contribution, plugin) {
        const pluginId = (0, plugin_protocol_1.getPluginId)(plugin.metadata.model);
        const packageUri = plugin.metadata.model.packageUri;
        const iconTheme = this.iconThemeFactory({
            id: contribution.id,
            label: contribution.label || new uri_1.default(contribution.uri).path.base,
            description: contribution.description,
            uri: contribution.uri,
            uiTheme: contribution.uiTheme,
            pluginId,
            packageUri
        });
        return new disposable_1.DisposableCollection(iconTheme, iconTheme.onDidChange(() => this.fireDidChange()), this.iconThemeService.register(iconTheme));
    }
    canHandle(element) {
        const current = this.iconThemeService.getDefinition(this.iconThemeService.current);
        if (current instanceof PluginIconTheme && ((element instanceof uri_1.default && element.scheme === 'file') || label_provider_1.URIIconReference.is(element) || files_1.FileStat.is(element) || browser_1.FileStatNode.is(element))) {
            return Number.MAX_SAFE_INTEGER;
        }
        return 0;
    }
    getIcon(element) {
        const current = this.iconThemeService.getDefinition(this.iconThemeService.current);
        if (current instanceof PluginIconTheme) {
            return current.getIcon(element);
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(icon_theme_service_1.IconThemeService),
    __metadata("design:type", icon_theme_service_1.IconThemeService)
], PluginIconThemeService.prototype, "iconThemeService", void 0);
__decorate([
    (0, inversify_1.inject)(exports.PluginIconThemeFactory),
    __metadata("design:type", Function)
], PluginIconThemeService.prototype, "iconThemeFactory", void 0);
PluginIconThemeService = __decorate([
    (0, inversify_1.injectable)()
], PluginIconThemeService);
exports.PluginIconThemeService = PluginIconThemeService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-icon-theme-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-storage.js":
/*!********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-storage.js ***!
  \********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StorageMainImpl = void 0;
const plugin_protocol_1 = __webpack_require__(/*! ../../common/plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
class StorageMainImpl {
    constructor(container) {
        this.pluginServer = container.get(plugin_protocol_1.PluginServer);
        this.workspaceService = container.get(workspace_service_1.WorkspaceService);
    }
    $set(key, value, isGlobal) {
        return this.pluginServer.setStorageValue(key, value, this.toKind(isGlobal));
    }
    $get(key, isGlobal) {
        return this.pluginServer.getStorageValue(key, this.toKind(isGlobal));
    }
    $getAll(isGlobal) {
        return this.pluginServer.getAllStorageValues(this.toKind(isGlobal));
    }
    toKind(isGlobal) {
        var _a;
        if (isGlobal) {
            return undefined;
        }
        return {
            workspace: (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.toString(),
            roots: this.workspaceService.tryGetRoots().map(root => root.resource.toString())
        };
    }
}
exports.StorageMainImpl = StorageMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-storage'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-terminal-registry.js":
/*!******************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-terminal-registry.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
exports.PluginTerminalRegistry = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let PluginTerminalRegistry = class PluginTerminalRegistry {
    start(profileId) {
        return this.startCallback(profileId);
    }
};
PluginTerminalRegistry = __decorate([
    (0, inversify_1.injectable)()
], PluginTerminalRegistry);
exports.PluginTerminalRegistry = PluginTerminalRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-terminal-registry'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/preference-registry-main.js":
/*!******************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/preference-registry-main.js ***!
  \******************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreferenceRegistryMainImpl = exports.getPreferences = void 0;
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const types_impl_1 = __webpack_require__(/*! ../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
function getPreferences(preferenceProviderProvider, rootFolders) {
    const folders = rootFolders.map(root => root.resource.toString());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return preferences_1.PreferenceScope.getScopes().reduce((result, scope) => {
        result[scope] = {};
        const provider = preferenceProviderProvider(scope);
        if (scope === preferences_1.PreferenceScope.Folder) {
            for (const f of folders) {
                const folderPrefs = provider.getPreferences(f);
                result[scope][f] = folderPrefs;
            }
        }
        else {
            result[scope] = provider.getPreferences();
        }
        return result;
    }, {});
}
exports.getPreferences = getPreferences;
class PreferenceRegistryMainImpl {
    constructor(prc, container) {
        this.toDispose = new disposable_1.DisposableCollection();
        this.proxy = prc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.PREFERENCE_REGISTRY_EXT);
        this.preferenceService = container.get(preferences_1.PreferenceService);
        const preferenceProviderProvider = container.get(preferences_1.PreferenceProviderProvider);
        const preferenceServiceImpl = container.get(preferences_1.PreferenceServiceImpl);
        const workspaceService = container.get(browser_1.WorkspaceService);
        this.toDispose.push(preferenceServiceImpl.onPreferencesChanged(changes => {
            // it HAS to be synchronous to propagate changes before update/remove response
            const roots = workspaceService.tryGetRoots();
            const data = getPreferences(preferenceProviderProvider, roots);
            const eventData = Object.values(changes).map(({ scope, newValue, domain, preferenceName }) => {
                const extScope = scope === preferences_1.PreferenceScope.User ? undefined : domain === null || domain === void 0 ? void 0 : domain[0];
                return { preferenceName, newValue, scope: extScope };
            });
            this.proxy.$acceptConfigurationChanged(data, eventData);
        }));
    }
    dispose() {
        this.toDispose.dispose();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $updateConfigurationOption(target, key, value, resource, withLanguageOverride) {
        const scope = this.parseConfigurationTarget(target, resource);
        const effectiveKey = this.getEffectiveKey(key, scope, withLanguageOverride, resource);
        await this.preferenceService.set(effectiveKey, value, scope, resource);
    }
    async $removeConfigurationOption(target, key, resource, withLanguageOverride) {
        const scope = this.parseConfigurationTarget(target, resource);
        const effectiveKey = this.getEffectiveKey(key, scope, withLanguageOverride, resource);
        await this.preferenceService.set(effectiveKey, undefined, scope, resource);
    }
    parseConfigurationTarget(target, resource) {
        if (typeof target === 'boolean') {
            return target ? preferences_1.PreferenceScope.User : preferences_1.PreferenceScope.Workspace;
        }
        switch (target) {
            case types_impl_1.ConfigurationTarget.Global:
                return preferences_1.PreferenceScope.User;
            case types_impl_1.ConfigurationTarget.Workspace:
                return preferences_1.PreferenceScope.Workspace;
            case types_impl_1.ConfigurationTarget.WorkspaceFolder:
                return preferences_1.PreferenceScope.Folder;
            default:
                return resource ? preferences_1.PreferenceScope.Folder : preferences_1.PreferenceScope.Workspace;
        }
    }
    // If the caller does not set `withLanguageOverride = true`, we have to check whether the setting exists with that override already.
    getEffectiveKey(key, scope, withLanguageOverride, resource) {
        if (withLanguageOverride) {
            return key;
        }
        const overridden = this.preferenceService.overriddenPreferenceName(key);
        if (!overridden) {
            return key;
        }
        const value = this.preferenceService.inspectInScope(key, scope, resource, withLanguageOverride);
        return value === undefined ? overridden.preferenceName : key;
    }
}
exports.PreferenceRegistryMainImpl = PreferenceRegistryMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/preference-registry-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/quick-open-main.js":
/*!*********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/quick-open-main.js ***!
  \*********************************************************************/
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
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuickOpenMainImpl = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const monaco_quick_input_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-quick-input-service */ "../../packages/monaco/lib/browser/monaco-quick-input-service.js");
const types_impl_1 = __webpack_require__(/*! ../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
const quick_open_1 = __webpack_require__(/*! ../../plugin/quick-open */ "../../packages/plugin-ext/lib/plugin/quick-open.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
class QuickOpenMainImpl {
    constructor(rpc, container) {
        this.items = {};
        this.toDispose = new disposable_1.DisposableCollection();
        this.sessions = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.QUICK_OPEN_EXT);
        this.delegate = container.get(monaco_quick_input_service_1.MonacoQuickInputService);
        this.quickInputService = container.get(browser_1.QuickInputService);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $show(instance, options, token) {
        const contents = new Promise((resolve, reject) => {
            this.items[instance] = { resolve, reject };
        });
        options = {
            ...options,
            onDidFocus: (el) => {
                if (el) {
                    this.proxy.$onItemSelected(el.handle);
                }
            }
        };
        const result = await this.delegate.pick(contents, options, token);
        if (Array.isArray(result)) {
            return result.map(({ handle }) => handle);
        }
        else if (result) {
            return result.handle;
        }
        return undefined;
    }
    $setItems(instance, items) {
        if (this.items[instance]) {
            this.items[instance].resolve(items);
            delete this.items[instance];
        }
        return Promise.resolve();
    }
    $setError(instance, error) {
        if (this.items[instance]) {
            this.items[instance].reject(error);
            delete this.items[instance];
        }
        return Promise.resolve();
    }
    $input(options, validateInput, token) {
        var _a;
        const inputOptions = Object.create(null);
        if (options) {
            inputOptions.title = options.title;
            inputOptions.password = options.password;
            inputOptions.placeHolder = options.placeHolder;
            inputOptions.valueSelection = options.valueSelection;
            inputOptions.prompt = options.prompt;
            inputOptions.value = options.value;
            inputOptions.ignoreFocusLost = options.ignoreFocusOut;
        }
        if (validateInput) {
            inputOptions.validateInput = (val) => this.proxy.$validateInput(val);
        }
        return (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.input(inputOptions, token);
    }
    async $showInputBox(options, validateInput) {
        return new Promise((resolve, reject) => {
            var _a;
            const sessionId = options.id;
            const toDispose = new disposable_1.DisposableCollection();
            const inputBox = (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.createInputBox();
            inputBox.prompt = options.prompt;
            inputBox.placeholder = options.placeHolder;
            inputBox.value = options.value;
            if (options.busy) {
                inputBox.busy = options.busy;
            }
            if (options.enabled) {
                inputBox.enabled = options.enabled;
            }
            inputBox.ignoreFocusOut = options.ignoreFocusOut;
            inputBox.contextKey = options.contextKey;
            if (options.password) {
                inputBox.password = options.password;
            }
            inputBox.step = options.step;
            inputBox.title = options.title;
            inputBox.description = options.description;
            inputBox.totalSteps = options.totalSteps;
            inputBox.buttons = options.buttons ? this.convertToQuickInputButtons(options.buttons) : [];
            inputBox.validationMessage = options.validationMessage;
            if (validateInput) {
                options.validateInput = (val) => {
                    this.proxy.$validateInput(val);
                };
            }
            toDispose.push(inputBox.onDidAccept(() => {
                this.proxy.$acceptOnDidAccept(sessionId);
                resolve(inputBox.value);
            }));
            toDispose.push(inputBox.onDidChangeValue((value) => {
                this.proxy.$acceptDidChangeValue(sessionId, value);
                inputBox.validationMessage = options.validateInput(value);
            }));
            toDispose.push(inputBox.onDidTriggerButton((button) => {
                this.proxy.$acceptOnDidTriggerButton(sessionId, button);
            }));
            toDispose.push(inputBox.onDidHide(() => {
                if (toDispose.disposed) {
                    return;
                }
                this.proxy.$acceptOnDidHide(sessionId);
                toDispose.dispose();
                resolve(undefined);
            }));
            this.toDispose.push(toDispose);
            inputBox.show();
        });
    }
    $createOrUpdate(params) {
        const sessionId = params.id;
        let session;
        const candidate = this.sessions.get(sessionId);
        if (!candidate) {
            if (params.type === 'quickPick') {
                const quickPick = this.quickInputService.createQuickPick();
                quickPick.onDidAccept(() => {
                    this.proxy.$acceptOnDidAccept(sessionId);
                });
                quickPick.onDidChangeActive((items) => {
                    this.proxy.$onDidChangeActive(sessionId, items.map(item => item.handle));
                });
                quickPick.onDidChangeSelection((items) => {
                    this.proxy.$onDidChangeSelection(sessionId, items.map(item => item.handle));
                });
                quickPick.onDidTriggerButton((button) => {
                    this.proxy.$acceptOnDidTriggerButton(sessionId, button);
                });
                quickPick.onDidTriggerItemButton(e => {
                    this.proxy.$onDidTriggerItemButton(sessionId, e.item.handle, e.button.handle);
                });
                quickPick.onDidChangeValue((value) => {
                    this.proxy.$acceptDidChangeValue(sessionId, value);
                });
                quickPick.onDidHide(() => {
                    this.proxy.$acceptOnDidHide(sessionId);
                });
                session = {
                    input: quickPick,
                    handlesToItems: new Map()
                };
            }
            else {
                const inputBox = this.quickInputService.createInputBox();
                inputBox.onDidAccept(() => {
                    this.proxy.$acceptOnDidAccept(sessionId);
                });
                inputBox.onDidTriggerButton((button) => {
                    this.proxy.$acceptOnDidTriggerButton(sessionId, button);
                });
                inputBox.onDidChangeValue((value) => {
                    this.proxy.$acceptDidChangeValue(sessionId, value);
                });
                inputBox.onDidHide(() => {
                    this.proxy.$acceptOnDidHide(sessionId);
                });
                session = {
                    input: inputBox,
                    handlesToItems: new Map()
                };
            }
            this.sessions.set(sessionId, session);
        }
        else {
            session = candidate;
        }
        if (session) {
            const { input, handlesToItems } = session;
            for (const param in params) {
                if (param === 'id' || param === 'type') {
                    continue;
                }
                if (param === 'visible') {
                    if (params.visible) {
                        input.show();
                    }
                    else {
                        input.hide();
                    }
                }
                else if (param === 'items') {
                    handlesToItems.clear();
                    params[param].forEach((item) => {
                        handlesToItems.set(item.handle, item);
                    });
                    input[param] = params[param];
                }
                else if (param === 'activeItems' || param === 'selectedItems') {
                    input[param] = params[param]
                        .filter((handle) => handlesToItems.has(handle))
                        .map((handle) => handlesToItems.get(handle));
                }
                else if (param === 'buttons') {
                    input[param] = params.buttons.map(button => {
                        if (button.handle === -1) {
                            return this.quickInputService.backButton;
                        }
                        const { iconPath, tooltip, handle } = button;
                        if ('id' in iconPath) {
                            return {
                                iconClass: themeService_1.ThemeIcon.asClassName(iconPath),
                                tooltip,
                                handle
                            };
                        }
                        else {
                            const monacoIconPath = iconPath;
                            return {
                                iconPath: {
                                    dark: monaco.Uri.revive(monacoIconPath.dark),
                                    light: monacoIconPath.light && monaco.Uri.revive(monacoIconPath.light)
                                },
                                tooltip,
                                handle
                            };
                        }
                    });
                }
                else {
                    input[param] = params[param];
                }
            }
        }
        return Promise.resolve(undefined);
    }
    $hide() {
        this.delegate.hide();
    }
    $dispose(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.input.dispose();
            this.sessions.delete(sessionId);
        }
        return Promise.resolve(undefined);
    }
    convertToQuickInputButtons(buttons) {
        return buttons.map((button, i) => ({
            ...(0, quick_open_1.getIconPathOrClass)(button),
            tooltip: button.tooltip,
            handle: button === types_impl_1.QuickInputButtons.Back ? -1 : i,
        }));
    }
}
exports.QuickOpenMainImpl = QuickOpenMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/quick-open-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/scm-main.js":
/*!**************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/scm-main.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019-2021 Red Hat, Inc. and others.
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
exports.ScmMainImpl = exports.PluginScmProvider = exports.PluginScmResource = exports.PluginScmResourceGroup = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// code copied and modified from https://github.com/microsoft/vscode/blob/1.52.1/src/vs/workbench/api/browser/mainThreadSCM.ts
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const plugin_shared_style_1 = __webpack_require__(/*! ./plugin-shared-style */ "../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js");
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
class PluginScmResourceGroup {
    constructor(handle, provider, features, label, id) {
        this.handle = handle;
        this.provider = provider;
        this.features = features;
        this.label = label;
        this.id = id;
        this.resources = [];
        this.onDidSpliceEmitter = new event_1.Emitter();
        this.onDidSplice = this.onDidSpliceEmitter.event;
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    get hideWhenEmpty() { return !!this.features.hideWhenEmpty; }
    splice(start, deleteCount, toInsert) {
        this.resources.splice(start, deleteCount, ...toInsert);
        this.onDidSpliceEmitter.fire({ start, deleteCount, toInsert });
    }
    updateGroup(features) {
        this.features = { ...this.features, ...features };
        this.onDidChangeEmitter.fire();
    }
    updateGroupLabel(label) {
        this.label = label;
        this.onDidChangeEmitter.fire();
    }
    dispose() { }
}
exports.PluginScmResourceGroup = PluginScmResourceGroup;
class PluginScmResource {
    constructor(proxy, sourceControlHandle, groupHandle, handle, sourceUri, group, decorations, contextValue, command) {
        this.proxy = proxy;
        this.sourceControlHandle = sourceControlHandle;
        this.groupHandle = groupHandle;
        this.handle = handle;
        this.sourceUri = sourceUri;
        this.group = group;
        this.decorations = decorations;
        this.contextValue = contextValue;
        this.command = command;
    }
    open() {
        return this.proxy.$executeResourceCommand(this.sourceControlHandle, this.groupHandle, this.handle);
    }
}
exports.PluginScmResource = PluginScmResource;
class PluginScmProvider {
    constructor(proxy, colors, sharedStyle, _handle, _contextValue, _label, _rootUri, disposables) {
        this.proxy = proxy;
        this.colors = colors;
        this.sharedStyle = sharedStyle;
        this._handle = _handle;
        this._contextValue = _contextValue;
        this._label = _label;
        this._rootUri = _rootUri;
        this.disposables = disposables;
        this._id = this.contextValue;
        this.groups = [];
        this.groupsByHandle = Object.create(null);
        this.onDidChangeResourcesEmitter = new event_1.Emitter();
        this.onDidChangeResources = this.onDidChangeResourcesEmitter.event;
        this.features = {};
        this.onDidChangeCommitTemplateEmitter = new event_1.Emitter();
        this.onDidChangeCommitTemplate = this.onDidChangeCommitTemplateEmitter.event;
        this.onDidChangeStatusBarCommandsEmitter = new event_1.Emitter();
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    get id() { return this._id; }
    get handle() { return this._handle; }
    get label() { return this._label; }
    get rootUri() { return this._rootUri ? this._rootUri.toString() : ''; }
    get contextValue() { return this._contextValue; }
    get commitTemplate() { return this.features.commitTemplate || ''; }
    get acceptInputCommand() {
        const command = this.features.acceptInputCommand;
        if (command) {
            const scmCommand = command;
            scmCommand.command = command.id;
            return scmCommand;
        }
    }
    get statusBarCommands() {
        const commands = this.features.statusBarCommands;
        return commands === null || commands === void 0 ? void 0 : commands.map(command => {
            const scmCommand = command;
            scmCommand.command = command.id;
            return scmCommand;
        });
    }
    get count() { return this.features.count; }
    get onDidChangeStatusBarCommands() { return this.onDidChangeStatusBarCommandsEmitter.event; }
    updateSourceControl(features) {
        this.features = { ...this.features, ...features };
        this.onDidChangeEmitter.fire();
        if (typeof features.commitTemplate !== 'undefined') {
            this.onDidChangeCommitTemplateEmitter.fire(this.commitTemplate);
        }
        if (typeof features.statusBarCommands !== 'undefined') {
            this.onDidChangeStatusBarCommandsEmitter.fire(this.statusBarCommands);
        }
    }
    registerGroups(resourceGroups) {
        const groups = resourceGroups.map(resourceGroup => {
            const { handle, id, label, features } = resourceGroup;
            const group = new PluginScmResourceGroup(handle, this, features, label, id);
            this.groupsByHandle[handle] = group;
            return group;
        });
        this.groups.splice(this.groups.length, 0, ...groups);
    }
    updateGroup(handle, features) {
        const group = this.groupsByHandle[handle];
        if (!group) {
            return;
        }
        group.updateGroup(features);
    }
    updateGroupLabel(handle, label) {
        const group = this.groupsByHandle[handle];
        if (!group) {
            return;
        }
        group.updateGroupLabel(label);
    }
    spliceGroupResourceStates(splices) {
        for (const splice of splices) {
            const groupHandle = splice.handle;
            const groupSlices = splice.splices;
            const group = this.groupsByHandle[groupHandle];
            if (!group) {
                console.warn(`SCM group ${groupHandle} not found in provider ${this.label}`);
                continue;
            }
            // reverse the splices sequence in order to apply them correctly
            groupSlices.reverse();
            for (const groupSlice of groupSlices) {
                const { start, deleteCount, rawResources } = groupSlice;
                const resources = rawResources.map(rawResource => {
                    const { handle, sourceUri, icons, tooltip, strikeThrough, faded, contextValue, command } = rawResource;
                    const icon = this.toIconClass(icons[0]);
                    const iconDark = this.toIconClass(icons[1]) || icon;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const colorVariable = rawResource.colorId && this.colors.toCssVariableName(rawResource.colorId);
                    const decorations = {
                        icon,
                        iconDark,
                        tooltip,
                        strikeThrough,
                        // TODO remove the letter and colorId fields when the FileDecorationProvider is applied, see https://github.com/eclipse-theia/theia/pull/8911
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        letter: rawResource.letter || '',
                        color: colorVariable && `var(${colorVariable})`,
                        faded
                    };
                    return new PluginScmResource(this.proxy, this.handle, groupHandle, handle, new uri_1.default(vscode_uri_1.URI.revive(sourceUri)), group, decorations, contextValue || undefined, command);
                });
                group.splice(start, deleteCount, resources);
            }
        }
        this.onDidChangeResourcesEmitter.fire();
    }
    toIconClass(icon) {
        if (!icon) {
            return undefined;
        }
        if (themeService_1.ThemeIcon.isThemeIcon(icon)) {
            return themeService_1.ThemeIcon.asClassName(icon);
        }
        const reference = this.sharedStyle.toIconClass(icon);
        this.disposables.push(reference);
        return reference.object.iconClass;
    }
    unregisterGroup(handle) {
        const group = this.groupsByHandle[handle];
        if (!group) {
            return;
        }
        delete this.groupsByHandle[handle];
        this.groups.splice(this.groups.indexOf(group), 1);
    }
    dispose() { }
}
exports.PluginScmProvider = PluginScmProvider;
class ScmMainImpl {
    constructor(rpc, container) {
        this.repositories = new Map();
        this.repositoryDisposables = new Map();
        this.disposables = new disposable_1.DisposableCollection();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.SCM_EXT);
        this.scmService = container.get(scm_service_1.ScmService);
        this.colors = container.get(color_registry_1.ColorRegistry);
        this.sharedStyle = container.get(plugin_shared_style_1.PluginSharedStyle);
    }
    dispose() {
        this.repositories.forEach(r => r.dispose());
        this.repositories.clear();
        this.repositoryDisposables.forEach(d => d.dispose());
        this.repositoryDisposables.clear();
        this.disposables.dispose();
    }
    async $registerSourceControl(handle, id, label, rootUri) {
        const provider = new PluginScmProvider(this.proxy, this.colors, this.sharedStyle, handle, id, label, rootUri ? vscode_uri_1.URI.revive(rootUri) : undefined, this.disposables);
        const repository = this.scmService.registerScmProvider(provider, {
            input: {
                validator: async (value) => {
                    const result = await this.proxy.$validateInput(handle, value, value.length);
                    return result && { message: result[0], type: result[1] };
                }
            }
        });
        this.repositories.set(handle, repository);
        const disposables = new disposable_1.DisposableCollection(this.scmService.onDidChangeSelectedRepository(r => {
            if (r === repository) {
                this.proxy.$setSelectedSourceControl(handle);
            }
        }), repository.input.onDidChange(() => this.proxy.$onInputBoxValueChange(handle, repository.input.value)));
        if (this.scmService.selectedRepository === repository) {
            setTimeout(() => this.proxy.$setSelectedSourceControl(handle), 0);
        }
        if (repository.input.value) {
            setTimeout(() => this.proxy.$onInputBoxValueChange(handle, repository.input.value), 0);
        }
        this.repositoryDisposables.set(handle, disposables);
    }
    async $updateSourceControl(handle, features) {
        const repository = this.repositories.get(handle);
        if (!repository) {
            return;
        }
        const provider = repository.provider;
        provider.updateSourceControl(features);
    }
    async $unregisterSourceControl(handle) {
        const repository = this.repositories.get(handle);
        if (!repository) {
            return;
        }
        this.repositoryDisposables.get(handle).dispose();
        this.repositoryDisposables.delete(handle);
        repository.dispose();
        this.repositories.delete(handle);
    }
    $registerGroups(sourceControlHandle, groups, splices) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        const provider = repository.provider;
        provider.registerGroups(groups);
        provider.spliceGroupResourceStates(splices);
    }
    $updateGroup(sourceControlHandle, groupHandle, features) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        const provider = repository.provider;
        provider.updateGroup(groupHandle, features);
    }
    $updateGroupLabel(sourceControlHandle, groupHandle, label) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        const provider = repository.provider;
        provider.updateGroupLabel(groupHandle, label);
    }
    $spliceResourceStates(sourceControlHandle, splices) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        const provider = repository.provider;
        provider.spliceGroupResourceStates(splices);
    }
    $unregisterGroup(sourceControlHandle, handle) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        const provider = repository.provider;
        provider.unregisterGroup(handle);
    }
    $setInputBoxValue(sourceControlHandle, value) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        repository.input.value = value;
    }
    $setInputBoxPlaceholder(sourceControlHandle, placeholder) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        repository.input.placeholder = placeholder;
    }
    $setInputBoxVisible(sourceControlHandle, visible) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        repository.input.visible = visible;
    }
    $setInputBoxEnabled(sourceControlHandle, enabled) {
        const repository = this.repositories.get(sourceControlHandle);
        if (!repository) {
            return;
        }
        repository.input.enabled = enabled;
    }
}
exports.ScmMainImpl = ScmMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/scm-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/secrets-main.js":
/*!******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/secrets-main.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Red Hat, Inc. and others.
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
exports.SecretsMainImpl = void 0;
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/plugin-ext/lib/common/index.js");
const credentials_service_1 = __webpack_require__(/*! @theia/core/lib/browser/credentials-service */ "../../packages/core/lib/browser/credentials-service.js");
class SecretsMainImpl {
    constructor(rpc, container) {
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.SECRETS_EXT);
        this.credentialsService = container.get(credentials_service_1.CredentialsService);
        this.credentialsService.onDidChangePassword(e => {
            const extensionId = e.service.substring(window.location.hostname.length + 1);
            this.proxy.$onDidChangePassword({ extensionId, key: e.account });
        });
    }
    static getFullKey(extensionId) {
        return `${window.location.hostname}-${extensionId}`;
    }
    async $getPassword(extensionId, key) {
        const fullKey = SecretsMainImpl.getFullKey(extensionId);
        const passwordData = await this.credentialsService.getPassword(fullKey, key);
        if (passwordData) {
            try {
                const data = JSON.parse(passwordData);
                if (data.extensionId === extensionId) {
                    return data.content;
                }
            }
            catch (e) {
                throw new Error('Cannot get password');
            }
        }
        return undefined;
    }
    async $setPassword(extensionId, key, value) {
        const fullKey = SecretsMainImpl.getFullKey(extensionId);
        const passwordData = JSON.stringify({
            extensionId,
            content: value
        });
        return this.credentialsService.setPassword(fullKey, key, passwordData);
    }
    async $deletePassword(extensionId, key) {
        try {
            const fullKey = SecretsMainImpl.getFullKey(extensionId);
            await this.credentialsService.deletePassword(fullKey, key);
        }
        catch (e) {
            throw new Error('Cannot delete password');
        }
    }
}
exports.SecretsMainImpl = SecretsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/secrets-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/status-bar-message-registry-main.js":
/*!**************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/status-bar-message-registry-main.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatusBarMessageRegistryMainImpl = void 0;
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const types = __webpack_require__(/*! ../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
const status_bar_1 = __webpack_require__(/*! @theia/core/lib/browser/status-bar/status-bar */ "../../packages/core/lib/browser/status-bar/status-bar.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
class StatusBarMessageRegistryMainImpl {
    constructor(container) {
        this.entries = new Map();
        this.toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
        this.delegate = container.get(status_bar_1.StatusBar);
        this.colorRegistry = container.get(color_registry_1.ColorRegistry);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $setMessage(id, name, text, priority, alignment, color, backgroundColor, tooltip, command, accessibilityInformation, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args) {
        const ariaLabel = accessibilityInformation === null || accessibilityInformation === void 0 ? void 0 : accessibilityInformation.label;
        const role = accessibilityInformation === null || accessibilityInformation === void 0 ? void 0 : accessibilityInformation.role;
        const entry = {
            name,
            text: text || '',
            ariaLabel,
            role,
            priority,
            alignment: alignment === types.StatusBarAlignment.Left ? status_bar_1.StatusBarAlignment.LEFT : status_bar_1.StatusBarAlignment.RIGHT,
            color: color && (this.colorRegistry.getCurrentColor(color) || color),
            // In contrast to color, the backgroundColor must be a theme color. Thus, do not hand in the plain string if it cannot be resolved.
            backgroundColor: backgroundColor && (this.colorRegistry.getCurrentColor(backgroundColor)),
            tooltip,
            command,
            accessibilityInformation,
            args
        };
        this.entries.set(id, entry);
        await this.delegate.setElement(id, entry);
        if (this.toDispose.disposed) {
            this.$dispose(id);
        }
        else {
            this.toDispose.push(disposable_1.Disposable.create(() => this.$dispose(id)));
        }
    }
    $dispose(id) {
        const entry = this.entries.get(id);
        if (entry) {
            this.entries.delete(id);
            this.delegate.removeElement(id);
        }
    }
}
exports.StatusBarMessageRegistryMainImpl = StatusBarMessageRegistryMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/status-bar-message-registry-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/tabs/tabs-main.js":
/*!********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/tabs/tabs-main.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 TypeFox and others.
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
exports.TabsMainImpl = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const editor_preview_widget_1 = __webpack_require__(/*! @theia/editor-preview/lib/browser/editor-preview-widget */ "../../packages/editor-preview/lib/browser/editor-preview-widget.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const monaco_diff_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-diff-editor */ "../../packages/monaco/lib/browser/monaco-diff-editor.js");
const hierarchy_types_converters_1 = __webpack_require__(/*! ../hierarchy/hierarchy-types-converters */ "../../packages/plugin-ext/lib/main/browser/hierarchy/hierarchy-types-converters.js");
const terminal_widget_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-widget */ "../../packages/terminal/lib/browser/base/terminal-widget.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class TabsMainImpl {
    constructor(rpc, container) {
        this.tabGroupModel = new Map();
        this.tabInfoLookup = new Map();
        this.disposableTabBarListeners = new core_1.DisposableCollection();
        this.toDisposeOnDestroy = new core_1.DisposableCollection();
        this.groupIdCounter = 0;
        this.tabGroupChanged = false;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TABS_EXT);
        this.applicationShell = container.get(browser_1.ApplicationShell);
        this.createTabsModel();
        const tabBars = this.applicationShell.mainPanel.tabBars();
        for (let tabBar; tabBar = tabBars.next();) {
            this.attachListenersToTabBar(tabBar);
        }
        this.toDisposeOnDestroy.push(this.applicationShell.mainPanelRenderer.onDidCreateTabBar(tabBar => {
            this.attachListenersToTabBar(tabBar);
            this.onTabGroupCreated(tabBar);
        }));
        this.connectToSignal(this.toDisposeOnDestroy, this.applicationShell.mainPanel.widgetAdded, (mainPanel, widget) => {
            if (this.tabGroupChanged || this.tabGroupModel.size === 0) {
                this.tabGroupChanged = false;
                this.createTabsModel();
                // tab Open event is done in backend
            }
            else {
                const tabBar = mainPanel.findTabBar(widget.title);
                const oldTabInfo = this.tabInfoLookup.get(widget.title);
                const group = this.tabGroupModel.get(tabBar);
                if (group !== (oldTabInfo === null || oldTabInfo === void 0 ? void 0 : oldTabInfo.group)) {
                    if (oldTabInfo) {
                        this.onTabClosed(oldTabInfo, widget.title);
                    }
                    this.onTabCreated(tabBar, { index: tabBar.titles.indexOf(widget.title), title: widget.title });
                }
            }
        });
        this.connectToSignal(this.toDisposeOnDestroy, this.applicationShell.mainPanel.widgetRemoved, (mainPanel, widget) => {
            if (!(widget instanceof browser_1.TabBar)) {
                const tabInfo = this.getOrRebuildModel(this.tabInfoLookup, widget.title);
                this.onTabClosed(tabInfo, widget.title);
                if (this.tabGroupChanged) {
                    this.tabGroupChanged = false;
                    this.createTabsModel();
                }
            }
        });
    }
    createTabsModel() {
        var _a, _b;
        const newTabGroupModel = new Map();
        this.tabInfoLookup.clear();
        this.disposableTabBarListeners.dispose();
        this.applicationShell.mainAreaTabBars.forEach(tabBar => {
            this.attachListenersToTabBar(tabBar);
            const groupDto = this.createTabGroupDto(tabBar);
            tabBar.titles.forEach((title, index) => this.tabInfoLookup.set(title, { group: groupDto, tab: groupDto.tabs[index], tabIndex: index }));
            newTabGroupModel.set(tabBar, groupDto);
        });
        if (newTabGroupModel.size > 0 && Array.from(newTabGroupModel.values()).indexOf(this.currentActiveGroup) < 0) {
            this.currentActiveGroup = (_b = (_a = this.tabInfoLookup.get(this.applicationShell.mainPanel.currentTitle)) === null || _a === void 0 ? void 0 : _a.group) !== null && _b !== void 0 ? _b : newTabGroupModel.values().next().value;
            this.currentActiveGroup.isActive = true;
        }
        this.tabGroupModel = newTabGroupModel;
        this.proxy.$acceptEditorTabModel(Array.from(this.tabGroupModel.values()));
    }
    createTabDto(tabTitle, groupId) {
        const widget = tabTitle.owner;
        return {
            id: this.createTabId(tabTitle, groupId),
            label: tabTitle.label,
            input: this.evaluateTabDtoInput(widget),
            isActive: tabTitle.owner.isVisible,
            isPinned: tabTitle.className.includes(browser_1.PINNED_CLASS),
            isDirty: browser_1.Saveable.isDirty(widget),
            isPreview: widget instanceof editor_preview_widget_1.EditorPreviewWidget && widget.isPreview
        };
    }
    createTabId(tabTitle, groupId) {
        return `${groupId}~${tabTitle.owner.id}`;
    }
    createTabGroupDto(tabBar) {
        var _a;
        const oldDto = this.tabGroupModel.get(tabBar);
        const groupId = (_a = oldDto === null || oldDto === void 0 ? void 0 : oldDto.groupId) !== null && _a !== void 0 ? _a : this.groupIdCounter++;
        const tabs = tabBar.titles.map(title => this.createTabDto(title, groupId));
        return {
            groupId,
            tabs,
            isActive: false,
            viewColumn: 1
        };
    }
    attachListenersToTabBar(tabBar) {
        if (!tabBar) {
            return;
        }
        tabBar.titles.forEach(title => {
            this.connectToSignal(this.disposableTabBarListeners, title.changed, this.onTabTitleChanged);
        });
        this.connectToSignal(this.disposableTabBarListeners, tabBar.tabMoved, this.onTabMoved);
        this.connectToSignal(this.disposableTabBarListeners, tabBar.disposed, this.onTabGroupClosed);
    }
    evaluateTabDtoInput(widget) {
        if (widget instanceof editor_preview_widget_1.EditorPreviewWidget) {
            if (widget.editor instanceof monaco_diff_editor_1.MonacoDiffEditor) {
                return {
                    kind: 2 /* TextDiffInput */,
                    original: (0, hierarchy_types_converters_1.toUriComponents)(widget.editor.originalModel.uri),
                    modified: (0, hierarchy_types_converters_1.toUriComponents)(widget.editor.modifiedModel.uri)
                };
            }
            else {
                return {
                    kind: 1 /* TextInput */,
                    uri: (0, hierarchy_types_converters_1.toUriComponents)(widget.editor.uri.toString())
                };
            }
            // TODO notebook support when implemented
        }
        else if (widget instanceof browser_1.ViewContainer) {
            return {
                kind: 7 /* WebviewEditorInput */,
                viewType: widget.id
            };
        }
        else if (widget instanceof terminal_widget_1.TerminalWidget) {
            return {
                kind: 8 /* TerminalEditorInput */
            };
        }
        return { kind: 0 /* UnknownInput */ };
    }
    connectToSignal(disposableList, signal, listener) {
        signal.connect(listener, this);
        disposableList.push(vscode_languageserver_protocol_1.Disposable.create(() => signal.disconnect(listener)));
    }
    tabDtosEqual(a, b) {
        return a.isActive === b.isActive &&
            a.isDirty === b.isDirty &&
            a.isPinned === b.isPinned &&
            a.isPreview === b.isPreview &&
            a.id === b.id;
    }
    getOrRebuildModel(map, key) {
        // something broke so we rebuild the model
        let item = map.get(key);
        if (!item) {
            this.createTabsModel();
            item = map.get(key);
        }
        return item;
    }
    // #region event listeners
    onTabCreated(tabBar, args) {
        const group = this.getOrRebuildModel(this.tabGroupModel, tabBar);
        this.connectToSignal(this.disposableTabBarListeners, args.title.changed, this.onTabTitleChanged);
        const tabDto = this.createTabDto(args.title, group.groupId);
        this.tabInfoLookup.set(args.title, { group, tab: tabDto, tabIndex: args.index });
        group.tabs.splice(args.index, 0, tabDto);
        this.proxy.$acceptTabOperation({
            kind: 0 /* TAB_OPEN */,
            index: args.index,
            tabDto,
            groupId: group.groupId
        });
    }
    onTabTitleChanged(title) {
        const tabInfo = this.getOrRebuildModel(this.tabInfoLookup, title);
        if (!tabInfo) {
            return;
        }
        const oldTabDto = tabInfo.tab;
        const newTabDto = this.createTabDto(title, tabInfo.group.groupId);
        if (newTabDto.isActive && !tabInfo.group.isActive) {
            tabInfo.group.isActive = true;
            this.currentActiveGroup.isActive = false;
            this.currentActiveGroup = tabInfo.group;
            this.proxy.$acceptTabGroupUpdate(tabInfo.group);
        }
        if (!this.tabDtosEqual(oldTabDto, newTabDto)) {
            tabInfo.group.tabs[tabInfo.tabIndex] = newTabDto;
            tabInfo.tab = newTabDto;
            this.proxy.$acceptTabOperation({
                kind: 2 /* TAB_UPDATE */,
                index: tabInfo.tabIndex,
                tabDto: newTabDto,
                groupId: tabInfo.group.groupId
            });
        }
    }
    onTabClosed(tabInfo, title) {
        tabInfo.group.tabs.splice(tabInfo.tabIndex, 1);
        this.tabInfoLookup.delete(title);
        this.updateTabIndices(tabInfo, tabInfo.tabIndex);
        this.proxy.$acceptTabOperation({
            kind: 1 /* TAB_CLOSE */,
            index: tabInfo.tabIndex,
            tabDto: this.createTabDto(title, tabInfo.group.groupId),
            groupId: tabInfo.group.groupId
        });
    }
    onTabMoved(tabBar, args) {
        const tabInfo = this.getOrRebuildModel(this.tabInfoLookup, args.title);
        tabInfo.tabIndex = args.toIndex;
        const tabDto = this.createTabDto(args.title, tabInfo.group.groupId);
        tabInfo.group.tabs.splice(args.fromIndex, 1);
        tabInfo.group.tabs.splice(args.toIndex, 0, tabDto);
        this.updateTabIndices(tabInfo, args.fromIndex);
        this.proxy.$acceptTabOperation({
            kind: 3 /* TAB_MOVE */,
            index: args.toIndex,
            tabDto,
            groupId: tabInfo.group.groupId,
            oldIndex: args.fromIndex
        });
    }
    onTabGroupCreated(tabBar) {
        this.tabGroupChanged = true;
    }
    onTabGroupClosed(tabBar) {
        this.tabGroupChanged = true;
    }
    // #endregion
    // #region Messages received from Ext Host
    $moveTab(tabId, index, viewColumn, preserveFocus) {
        return;
    }
    updateTabIndices(tabInfo, startIndex) {
        for (const tab of this.tabInfoLookup.values()) {
            if (tab.group === tabInfo.group && tab.tabIndex >= startIndex) {
                tab.tabIndex = tab.group.tabs.indexOf(tab.tab);
            }
        }
    }
    async $closeTab(tabIds, preserveFocus) {
        const widgets = [];
        for (const tabId of tabIds) {
            const cleanedId = tabId.substring(tabId.indexOf('~') + 1);
            const widget = this.applicationShell.getWidgetById(cleanedId);
            if (widget) {
                widgets.push(widget);
            }
        }
        await this.applicationShell.closeMany(widgets);
        return true;
    }
    async $closeGroup(groupIds, preserveFocus) {
        for (const groupId of groupIds) {
            tabGroupModel: for (const [bar, groupDto] of this.tabGroupModel) {
                if (groupDto.groupId === groupId) {
                    this.applicationShell.closeTabs(bar);
                    break tabGroupModel;
                }
            }
        }
        return true;
    }
    // #endregion
    dispose() {
        this.toDisposeOnDestroy.dispose();
        this.disposableTabBarListeners.dispose();
    }
}
exports.TabsMainImpl = TabsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/tabs/tabs-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/tasks-main.js":
/*!****************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/tasks-main.js ***!
  \****************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksMainImpl = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const task_contribution_1 = __webpack_require__(/*! @theia/task/lib/browser/task-contribution */ "../../packages/task/lib/browser/task-contribution.js");
const task_protocol_1 = __webpack_require__(/*! @theia/task/lib/common/task-protocol */ "../../packages/task/lib/common/task-protocol.js");
const task_watcher_1 = __webpack_require__(/*! @theia/task/lib/common/task-watcher */ "../../packages/task/lib/common/task-watcher.js");
const task_service_1 = __webpack_require__(/*! @theia/task/lib/browser/task-service */ "../../packages/task/lib/browser/task-service.js");
const browser_1 = __webpack_require__(/*! @theia/task/lib/browser */ "../../packages/task/lib/browser/index.js");
const revealKindMap = new Map([
    [1, task_protocol_1.RevealKind.Always],
    [2, task_protocol_1.RevealKind.Silent],
    [3, task_protocol_1.RevealKind.Never],
    [task_protocol_1.RevealKind.Always, 1],
    [task_protocol_1.RevealKind.Silent, 2],
    [task_protocol_1.RevealKind.Never, 3]
]);
const panelKindMap = new Map([
    [1, task_protocol_1.PanelKind.Shared],
    [2, task_protocol_1.PanelKind.Dedicated],
    [3, task_protocol_1.PanelKind.New],
    [task_protocol_1.PanelKind.Shared, 1],
    [task_protocol_1.PanelKind.Dedicated, 2],
    [task_protocol_1.PanelKind.New, 3]
]);
class TasksMainImpl {
    constructor(rpc, container) {
        this.taskProviders = new Map();
        this.toDispose = new common_1.DisposableCollection();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TASKS_EXT);
        this.taskProviderRegistry = container.get(task_contribution_1.TaskProviderRegistry);
        this.taskResolverRegistry = container.get(task_contribution_1.TaskResolverRegistry);
        this.taskWatcher = container.get(task_watcher_1.TaskWatcher);
        this.taskService = container.get(task_service_1.TaskService);
        this.taskDefinitionRegistry = container.get(browser_1.TaskDefinitionRegistry);
        this.toDispose.push(this.taskWatcher.onTaskCreated((event) => {
            this.proxy.$onDidStartTask({
                id: event.taskId,
                task: this.fromTaskConfiguration(event.config)
            }, event.terminalId);
        }));
        this.toDispose.push(this.taskWatcher.onTaskExit((event) => {
            this.proxy.$onDidEndTask(event.taskId);
        }));
        this.toDispose.push(this.taskWatcher.onDidStartTaskProcess((event) => {
            if (event.processId !== undefined) {
                this.proxy.$onDidStartTaskProcess(event.processId, {
                    id: event.taskId,
                    task: this.fromTaskConfiguration(event.config)
                });
            }
        }));
        this.toDispose.push(this.taskWatcher.onDidEndTaskProcess((event) => {
            if (event.code !== undefined) {
                this.proxy.$onDidEndTaskProcess(event.code, event.taskId);
            }
        }));
        // Inform proxy about running tasks form previous session
        this.$taskExecutions().then(executions => {
            if (executions.length > 0) {
                this.proxy.$initLoadedTasks(executions);
            }
        });
    }
    dispose() {
        this.toDispose.dispose();
    }
    $registerTaskProvider(handle, type) {
        const taskProvider = this.createTaskProvider(handle);
        const taskResolver = this.createTaskResolver(handle);
        const toDispose = new common_1.DisposableCollection(this.taskProviderRegistry.register(type, taskProvider, handle), this.taskResolverRegistry.registerTaskResolver(type, taskResolver), common_1.Disposable.create(() => this.taskProviders.delete(handle)));
        this.taskProviders.set(handle, toDispose);
        this.toDispose.push(toDispose);
    }
    $unregister(handle) {
        const disposable = this.taskProviders.get(handle);
        if (disposable) {
            disposable.dispose();
        }
    }
    async $fetchTasks(taskVersion, taskType) {
        if (taskVersion && !taskVersion.startsWith('2.')) { // Theia does not support 1.x or earlier task versions
            return [];
        }
        const token = this.taskService.startUserAction();
        const [configured, provided] = await Promise.all([
            this.taskService.getConfiguredTasks(token),
            this.taskService.getProvidedTasks(token)
        ]);
        const result = [];
        for (const tasks of [configured, provided]) {
            for (const task of tasks) {
                if (!taskType || (!!this.taskDefinitionRegistry.getDefinition(task) ? task._source === taskType : task.type === taskType)) {
                    result.push(this.fromTaskConfiguration(task));
                }
            }
        }
        return result;
    }
    async $executeTask(taskDto) {
        const taskConfig = this.toTaskConfiguration(taskDto);
        const taskInfo = await this.taskService.runTask(taskConfig);
        if (taskInfo) {
            return {
                id: taskInfo.taskId,
                task: this.fromTaskConfiguration(taskInfo.config)
            };
        }
    }
    async $taskExecutions() {
        const runningTasks = await this.taskService.getRunningTasks();
        return runningTasks.map(taskInfo => ({
            id: taskInfo.taskId,
            task: this.fromTaskConfiguration(taskInfo.config)
        }));
    }
    $terminateTask(id) {
        this.taskService.kill(id);
    }
    async $customExecutionComplete(id, exitCode) {
        this.taskService.customExecutionComplete(id, exitCode);
    }
    createTaskProvider(handle) {
        return {
            provideTasks: () => this.proxy.$provideTasks(handle).then(tasks => tasks.map(taskDto => this.toTaskConfiguration(taskDto)))
        };
    }
    createTaskResolver(handle) {
        return {
            resolveTask: taskConfig => this.proxy.$resolveTask(handle, this.fromTaskConfiguration(taskConfig)).then(task => this.toTaskConfiguration(task))
        };
    }
    toTaskConfiguration(taskDto) {
        const { group, presentation, scope, source, runOptions, ...common } = taskDto !== null && taskDto !== void 0 ? taskDto : {};
        const partialConfig = {};
        if (presentation) {
            partialConfig.presentation = this.convertTaskPresentation(presentation);
        }
        if (group) {
            partialConfig.group = {
                kind: group.kind,
                isDefault: group.isDefault
            };
        }
        return {
            ...common,
            ...partialConfig,
            runOptions,
            _scope: scope,
            _source: source,
        };
    }
    fromTaskConfiguration(task) {
        const { group, presentation, _scope, _source, ...common } = task;
        const partialDto = {};
        if (presentation) {
            partialDto.presentation = this.convertTaskPresentation(presentation);
        }
        if (group === 'build' || group === 'test') {
            partialDto.group = {
                kind: group,
                isDefault: false
            };
        }
        else if (typeof group === 'object') {
            partialDto.group = group;
        }
        return {
            ...common,
            ...partialDto,
            scope: _scope,
            source: _source,
        };
    }
    convertTaskPresentation(presentationFrom) {
        if (presentationFrom) {
            const { reveal, panel, ...common } = presentationFrom;
            const presentationTo = {};
            if (reveal) {
                presentationTo.reveal = revealKindMap.get(reveal);
            }
            if (panel) {
                presentationTo.panel = panelKindMap.get(panel);
            }
            return {
                ...common,
                ...presentationTo,
            };
        }
    }
}
exports.TasksMainImpl = TasksMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/tasks-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/terminal-main.js":
/*!*******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/terminal-main.js ***!
  \*******************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerminalServiceMainImpl = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const terminal_widget_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-widget */ "../../packages/terminal/lib/browser/base/terminal-widget.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const shell_terminal_protocol_1 = __webpack_require__(/*! @theia/terminal/lib/common/shell-terminal-protocol */ "../../packages/terminal/lib/common/shell-terminal-protocol.js");
const terminal_link_provider_1 = __webpack_require__(/*! @theia/terminal/lib/browser/terminal-link-provider */ "../../packages/terminal/lib/browser/terminal-link-provider.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const terminal_ext_1 = __webpack_require__(/*! ../../plugin/terminal-ext */ "../../packages/plugin-ext/lib/plugin/terminal-ext.js");
const plugin_terminal_registry_1 = __webpack_require__(/*! ./plugin-terminal-registry */ "../../packages/plugin-ext/lib/main/browser/plugin-terminal-registry.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const hosted_plugin_1 = __webpack_require__(/*! ../../hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
/**
 * Plugin api service allows working with terminal emulator.
 */
class TerminalServiceMainImpl {
    constructor(rpc, container) {
        this.terminalLinkProviders = [];
        this.toDispose = new disposable_1.DisposableCollection();
        this.terminals = container.get(terminal_service_1.TerminalService);
        this.pluginTerminalRegistry = container.get(plugin_terminal_registry_1.PluginTerminalRegistry);
        this.hostedPluginSupport = container.get(hosted_plugin_1.HostedPluginSupport);
        this.shell = container.get(browser_1.ApplicationShell);
        this.shellTerminalServer = container.get(shell_terminal_protocol_1.ShellTerminalServerProxy);
        this.extProxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TERMINAL_EXT);
        this.toDispose.push(this.terminals.onDidCreateTerminal(terminal => this.trackTerminal(terminal)));
        for (const terminal of this.terminals.all) {
            this.trackTerminal(terminal);
        }
        this.toDispose.push(this.terminals.onDidChangeCurrentTerminal(() => this.updateCurrentTerminal()));
        this.updateCurrentTerminal();
        if (this.shellTerminalServer.collections.size > 0) {
            const collectionAsArray = [...this.shellTerminalServer.collections.entries()];
            const serializedCollections = collectionAsArray.map(e => [e[0], [...e[1].map.entries()]]);
            this.extProxy.$initEnvironmentVariableCollections(serializedCollections);
        }
        this.pluginTerminalRegistry.startCallback = id => this.startProfile(id);
        container.bind(terminal_link_provider_1.TerminalLinkProvider).toDynamicValue(() => this);
    }
    async startProfile(id) {
        await this.hostedPluginSupport.activateByTerminalProfile(id);
        return this.extProxy.$startProfile(id, core_1.CancellationToken.None);
    }
    $setEnvironmentVariableCollection(persistent, collection) {
        if (collection.collection) {
            this.shellTerminalServer.setCollection(collection.extensionIdentifier, persistent, collection.collection, collection.description);
        }
        else {
            this.shellTerminalServer.deleteCollection(collection.extensionIdentifier);
        }
    }
    dispose() {
        this.toDispose.dispose();
    }
    updateCurrentTerminal() {
        const { currentTerminal } = this.terminals;
        this.extProxy.$currentTerminalChanged(currentTerminal && currentTerminal.id);
    }
    async trackTerminal(terminal) {
        let name = terminal.title.label;
        this.extProxy.$terminalCreated(terminal.id, name);
        const updateTitle = () => {
            if (name !== terminal.title.label) {
                name = terminal.title.label;
                this.extProxy.$terminalNameChanged(terminal.id, name);
            }
        };
        terminal.title.changed.connect(updateTitle);
        this.toDispose.push(disposable_1.Disposable.create(() => terminal.title.changed.disconnect(updateTitle)));
        const updateProcessId = () => terminal.processId.then(processId => this.extProxy.$terminalOpened(terminal.id, processId, terminal.terminalId, terminal.dimensions.cols, terminal.dimensions.rows), () => { });
        updateProcessId();
        this.toDispose.push(terminal.onDidOpen(() => updateProcessId()));
        this.toDispose.push(terminal.onTerminalDidClose(term => this.extProxy.$terminalClosed(term.id, term.exitStatus)));
        this.toDispose.push(terminal.onSizeChanged(({ cols, rows }) => {
            this.extProxy.$terminalSizeChanged(terminal.id, cols, rows);
        }));
        this.toDispose.push(terminal.onData(data => {
            this.extProxy.$terminalOnInput(terminal.id, data);
            this.extProxy.$terminalStateChanged(terminal.id);
        }));
    }
    $write(id, data) {
        const terminal = this.terminals.getById(id);
        if (!terminal) {
            return;
        }
        terminal.write(data);
    }
    $resize(id, cols, rows) {
        const terminal = this.terminals.getById(id);
        if (!terminal) {
            return;
        }
        terminal.resize(cols, rows);
    }
    async $createTerminal(id, options, parentId, isPseudoTerminal) {
        const terminal = await this.terminals.newTerminal({
            id,
            title: options.name,
            iconClass: (0, terminal_ext_1.getIconClass)(options),
            shellPath: options.shellPath,
            shellArgs: options.shellArgs,
            cwd: options.cwd ? new uri_1.URI(options.cwd) : undefined,
            env: options.env,
            strictEnv: options.strictEnv,
            destroyTermOnClose: true,
            useServerTitle: false,
            attributes: options.attributes,
            hideFromUser: options.hideFromUser,
            location: this.getTerminalLocation(options, parentId),
            isPseudoTerminal,
            isTransient: options.isTransient
        });
        if (options.message) {
            terminal.writeLine(options.message);
        }
        terminal.start();
        return terminal.id;
    }
    getTerminalLocation(options, parentId) {
        if (typeof options.location === 'number' && Object.values(terminal_widget_1.TerminalLocation).includes(options.location)) {
            return options.location;
        }
        else if (options.location && typeof options.location === 'object') {
            if ('parentTerminal' in options.location) {
                if (!parentId) {
                    throw new Error('parentTerminal is set but no parentId is provided');
                }
                return { 'parentTerminal': parentId };
            }
            else {
                return options.location;
            }
        }
        return undefined;
    }
    $sendText(id, text, addNewLine) {
        const terminal = this.terminals.getById(id);
        if (terminal) {
            text = text.replace(/\r?\n/g, '\r');
            if (addNewLine && text.charAt(text.length - 1) !== '\r') {
                text += '\r';
            }
            terminal.sendText(text);
        }
    }
    $show(id, preserveFocus) {
        const terminal = this.terminals.getById(id);
        if (terminal) {
            const options = {};
            if (preserveFocus) {
                options.mode = 'reveal';
            }
            this.terminals.open(terminal, options);
        }
    }
    $hide(id) {
        const terminal = this.terminals.getById(id);
        if (terminal && terminal.isVisible) {
            const area = this.shell.getAreaFor(terminal);
            if (area) {
                this.shell.collapsePanel(area);
            }
        }
    }
    $dispose(id) {
        const terminal = this.terminals.getById(id);
        if (terminal) {
            terminal.dispose();
        }
    }
    $setName(id, name) {
        var _a;
        (_a = this.terminals.getById(id)) === null || _a === void 0 ? void 0 : _a.setTitle(name);
    }
    $sendTextByTerminalId(id, text, addNewLine) {
        const terminal = this.terminals.getByTerminalId(id);
        if (terminal) {
            text = text.replace(/\r?\n/g, '\r');
            if (addNewLine && text.charAt(text.length - 1) !== '\r') {
                text += '\r';
            }
            terminal.sendText(text);
        }
    }
    $writeByTerminalId(id, data) {
        const terminal = this.terminals.getByTerminalId(id);
        if (!terminal) {
            return;
        }
        terminal.write(data);
    }
    $resizeByTerminalId(id, cols, rows) {
        const terminal = this.terminals.getByTerminalId(id);
        if (!terminal) {
            return;
        }
        terminal.resize(cols, rows);
    }
    $showByTerminalId(id, preserveFocus) {
        const terminal = this.terminals.getByTerminalId(id);
        if (terminal) {
            const options = {};
            if (preserveFocus) {
                options.mode = 'reveal';
            }
            this.terminals.open(terminal, options);
        }
    }
    $hideByTerminalId(id) {
        const terminal = this.terminals.getByTerminalId(id);
        if (terminal && terminal.isVisible) {
            const area = this.shell.getAreaFor(terminal);
            if (area) {
                this.shell.collapsePanel(area);
            }
        }
    }
    $disposeByTerminalId(id, waitOnExit) {
        const terminal = this.terminals.getByTerminalId(id);
        if (terminal) {
            if (waitOnExit) {
                terminal.waitOnExit(waitOnExit);
                return;
            }
            terminal.dispose();
        }
    }
    $setNameByTerminalId(id, name) {
        var _a;
        (_a = this.terminals.getByTerminalId(id)) === null || _a === void 0 ? void 0 : _a.setTitle(name);
    }
    async $registerTerminalLinkProvider(providerId) {
        this.terminalLinkProviders.push(providerId);
    }
    async $unregisterTerminalLinkProvider(providerId) {
        const index = this.terminalLinkProviders.indexOf(providerId);
        if (index > -1) {
            this.terminalLinkProviders.splice(index, 1);
        }
    }
    async provideLinks(line, terminal, cancellationToken) {
        if (this.terminalLinkProviders.length < 1) {
            return [];
        }
        const links = await this.extProxy.$provideTerminalLinks(line, terminal.id, cancellationToken !== null && cancellationToken !== void 0 ? cancellationToken : core_1.CancellationToken.None);
        return links.map(link => ({ ...link, handle: () => this.extProxy.$handleTerminalLink(link) }));
    }
}
exports.TerminalServiceMainImpl = TerminalServiceMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/terminal-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/text-editor-main.js":
/*!**********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/text-editor-main.js ***!
  \**********************************************************************/
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
exports.TextEditorPropertiesMain = exports.TextEditorMain = void 0;
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const editor_options_1 = __webpack_require__(/*! ../../common/editor-options */ "../../packages/plugin-ext/lib/common/editor-options.js");
const types_impl_1 = __webpack_require__(/*! ../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
class TextEditorMain {
    constructor(id, model, editor) {
        this.id = id;
        this.model = model;
        this.onPropertiesChangedEmitter = new core_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => this.properties = undefined), this.onPropertiesChangedEmitter);
        this.toDisposeOnEditor = new disposable_1.DisposableCollection();
        this.toDispose.push(this.model.onDidChangeOptions(() => this.updateProperties(undefined)));
        this.setEditor(editor);
        this.updateProperties(undefined);
    }
    dispose() {
        this.toDispose.dispose();
    }
    updateProperties(source) {
        this.setProperties(TextEditorPropertiesMain.readFromEditor(this.properties, this.model, this.editor), source);
    }
    setProperties(newProperties, source) {
        const result = newProperties.generateDelta(this.properties, source);
        this.properties = newProperties;
        if (result) {
            this.onPropertiesChangedEmitter.fire(result);
        }
    }
    setEditor(editor) {
        if (this.editor === editor) {
            return;
        }
        this.toDisposeOnEditor.dispose();
        this.toDispose.push(this.toDisposeOnEditor);
        this.editor = editor;
        this.toDisposeOnEditor.push(disposable_1.Disposable.create(() => this.editor = undefined));
        if (this.editor) {
            const monacoEditor = this.editor.getControl();
            this.toDisposeOnEditor.push(this.editor.onSelectionChanged(_ => {
                this.updateProperties();
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidChangeModel(() => {
                this.setEditor(undefined);
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidChangeCursorSelection(e => {
                this.updateProperties(e.source);
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidChangeConfiguration(() => {
                this.updateProperties();
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidLayoutChange(() => {
                this.updateProperties();
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidScrollChange(() => {
                this.updateProperties();
            }));
            this.updateProperties();
        }
    }
    getId() {
        return this.id;
    }
    getModel() {
        return this.model;
    }
    getProperties() {
        return this.properties;
    }
    get onPropertiesChangedEvent() {
        return this.onPropertiesChangedEmitter.event;
    }
    setSelections(selections) {
        if (this.editor) {
            this.editor.getControl().setSelections(selections);
            return;
        }
        const monacoSelections = selections.map(TextEditorMain.toMonacoSelections);
        this.setProperties(new TextEditorPropertiesMain(monacoSelections, this.properties.options, this.properties.visibleRanges), undefined);
    }
    setConfiguration(newConfiguration) {
        this.setIndentConfiguration(newConfiguration);
        if (!this.editor) {
            return;
        }
        if (newConfiguration.cursorStyle) {
            const newCursorStyle = (0, editor_options_1.cursorStyleToString)(newConfiguration.cursorStyle);
            this.editor.getControl().updateOptions({
                cursorStyle: newCursorStyle
            });
        }
        if (typeof newConfiguration.lineNumbers !== 'undefined') {
            let lineNumbers;
            switch (newConfiguration.lineNumbers) {
                case types_impl_1.TextEditorLineNumbersStyle.On:
                    lineNumbers = 'on';
                    break;
                case types_impl_1.TextEditorLineNumbersStyle.Relative:
                    lineNumbers = 'relative';
                    break;
                default:
                    lineNumbers = 'off';
            }
            this.editor.getControl().updateOptions({
                lineNumbers: lineNumbers
            });
        }
    }
    setIndentConfiguration(newConfiguration) {
        if (newConfiguration.tabSize === 'auto' || newConfiguration.insertSpaces === 'auto') {
            const creationOpts = this.model.getOptions();
            let insertSpaces = creationOpts.insertSpaces;
            let tabSize = creationOpts.tabSize;
            if (newConfiguration.insertSpaces !== 'auto' && typeof newConfiguration.insertSpaces !== 'undefined') {
                insertSpaces = newConfiguration.insertSpaces;
            }
            if (newConfiguration.tabSize !== 'auto' && typeof newConfiguration.tabSize !== 'undefined') {
                tabSize = newConfiguration.tabSize;
            }
            this.model.detectIndentation(insertSpaces, tabSize);
            return;
        }
        const newOpts = {};
        if (typeof newConfiguration.insertSpaces !== 'undefined') {
            newOpts.insertSpaces = newConfiguration.insertSpaces;
        }
        if (typeof newConfiguration.tabSize !== 'undefined') {
            newOpts.tabSize = newConfiguration.tabSize;
        }
        this.model.updateOptions(newOpts);
    }
    revealRange(range, revealType) {
        if (!this.editor) {
            return;
        }
        switch (revealType) {
            case plugin_api_rpc_1.TextEditorRevealType.Default:
                this.editor.getControl().revealRange(range, monaco.editor.ScrollType.Smooth);
                break;
            case plugin_api_rpc_1.TextEditorRevealType.InCenter:
                this.editor.getControl().revealRangeInCenter(range, monaco.editor.ScrollType.Smooth);
                break;
            case plugin_api_rpc_1.TextEditorRevealType.InCenterIfOutsideViewport:
                this.editor.getControl().revealRangeInCenterIfOutsideViewport(range, monaco.editor.ScrollType.Smooth);
                break;
            case plugin_api_rpc_1.TextEditorRevealType.AtTop:
                this.editor.getControl().revealRangeAtTop(range, monaco.editor.ScrollType.Smooth);
                break;
            default:
                console.warn(`Unknown revealType: ${revealType}`);
                break;
        }
    }
    applyEdits(versionId, edits, opts) {
        if (this.model.getVersionId() !== versionId) {
            // model changed in the meantime
            return false;
        }
        if (!this.editor) {
            return false;
        }
        if (opts.setEndOfLine === types_impl_1.EndOfLine.CRLF) {
            this.model.setEOL(monaco.editor.EndOfLineSequence.CRLF);
        }
        else if (opts.setEndOfLine === types_impl_1.EndOfLine.LF) {
            this.model.setEOL(monaco.editor.EndOfLineSequence.LF);
        }
        const editOperations = [];
        for (const edit of edits) {
            const { range, text } = edit;
            if (!range && !text) {
                continue;
            }
            if (range && range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn && !edit.text) {
                continue;
            }
            editOperations.push({
                range: range ? monaco.Range.lift(range) : this.editor.getControl().getModel().getFullModelRange(),
                /* eslint-disable-next-line no-null/no-null */
                text: text || null,
                forceMoveMarkers: edit.forceMoveMarkers
            });
        }
        if (opts.undoStopBefore) {
            this.editor.getControl().pushUndoStop();
        }
        this.editor.getControl().executeEdits('MainThreadTextEditor', editOperations);
        if (opts.undoStopAfter) {
            this.editor.getControl().pushUndoStop();
        }
        return true;
    }
    insertSnippet(template, ranges, opts) {
        var _a;
        const snippetController = (_a = this.editor) === null || _a === void 0 ? void 0 : _a.getControl().getContribution('snippetController2');
        if (!snippetController || !this.editor) {
            return false;
        }
        const selections = ranges.map(r => new monaco.Selection(r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn));
        this.editor.getControl().setSelections(selections);
        this.editor.focus();
        snippetController.insert(template, 0, 0, opts.undoStopBefore, opts.undoStopAfter);
        return true;
    }
    setDecorations(key, ranges) {
        if (!this.editor) {
            return;
        }
        this.editor.getControl()
            .setDecorationsByType('Plugin decorations', key, ranges.map(option => Object.assign(option, { color: undefined })));
    }
    setDecorationsFast(key, _ranges) {
        if (!this.editor) {
            return;
        }
        const ranges = [];
        const len = Math.floor(_ranges.length / 4);
        for (let i = 0; i < len; i++) {
            ranges[i] = new monaco.Range(_ranges[4 * i], _ranges[4 * i + 1], _ranges[4 * i + 2], _ranges[4 * i + 3]);
        }
        this.editor.getControl().setDecorationsByTypeFast(key, ranges);
    }
    static toMonacoSelections(selection) {
        return new monaco.Selection(selection.selectionStartLineNumber, selection.selectionStartColumn, selection.positionLineNumber, selection.positionColumn);
    }
}
exports.TextEditorMain = TextEditorMain;
class TextEditorPropertiesMain {
    constructor(selections, options, visibleRanges) {
        this.selections = selections;
        this.options = options;
        this.visibleRanges = visibleRanges;
    }
    generateDelta(old, source) {
        const result = {
            options: undefined,
            selections: undefined,
            visibleRanges: undefined
        };
        if (!old || !TextEditorPropertiesMain.selectionsEqual(old.selections, this.selections)) {
            result.selections = {
                selections: this.selections,
                source: source
            };
        }
        if (!old || !TextEditorPropertiesMain.optionsEqual(old.options, this.options)) {
            result.options = this.options;
        }
        if (!old || !TextEditorPropertiesMain.rangesEqual(old.visibleRanges, this.visibleRanges)) {
            result.visibleRanges = this.visibleRanges;
        }
        if (result.selections || result.visibleRanges || result.options) {
            return result;
        }
        return undefined;
    }
    static readFromEditor(prevProperties, model, editor) {
        const selections = TextEditorPropertiesMain.getSelectionsFromEditor(prevProperties, editor);
        const options = TextEditorPropertiesMain.getOptionsFromEditor(prevProperties, model, editor);
        const visibleRanges = TextEditorPropertiesMain.getVisibleRangesFromEditor(prevProperties, editor);
        return new TextEditorPropertiesMain(selections, options, visibleRanges);
    }
    static getSelectionsFromEditor(prevProperties, editor) {
        let result = undefined;
        if (editor) {
            result = editor.getControl().getSelections() || undefined;
        }
        if (!result && prevProperties) {
            result = prevProperties.selections;
        }
        if (!result) {
            result = [new monaco.Selection(1, 1, 1, 1)];
        }
        return result;
    }
    static getOptionsFromEditor(prevProperties, model, editor) {
        if (model.isDisposed()) {
            return prevProperties.options;
        }
        let cursorStyle;
        let lineNumbers;
        if (editor) {
            const editorOptions = editor.getControl().getOptions();
            const lineNumbersOpts = editorOptions.get(monaco.editor.EditorOption.lineNumbers);
            cursorStyle = editorOptions.get(monaco.editor.EditorOption.cursorStyle);
            switch (lineNumbersOpts.renderType) {
                case monaco.editor.RenderLineNumbersType.Off:
                    lineNumbers = types_impl_1.TextEditorLineNumbersStyle.Off;
                    break;
                case monaco.editor.RenderLineNumbersType.Relative:
                    lineNumbers = types_impl_1.TextEditorLineNumbersStyle.Relative;
                    break;
                default:
                    lineNumbers = types_impl_1.TextEditorLineNumbersStyle.On;
                    break;
            }
        }
        else if (prevProperties) {
            cursorStyle = prevProperties.options.cursorStyle;
            lineNumbers = prevProperties.options.lineNumbers;
        }
        else {
            cursorStyle = editor_options_1.TextEditorCursorStyle.Line;
            lineNumbers = types_impl_1.TextEditorLineNumbersStyle.On;
        }
        const modelOptions = model.getOptions();
        return {
            insertSpaces: modelOptions.insertSpaces,
            tabSize: modelOptions.tabSize,
            cursorStyle,
            lineNumbers,
        };
    }
    static getVisibleRangesFromEditor(prevProperties, editor) {
        if (editor) {
            return editor.getControl().getVisibleRanges();
        }
        return [];
    }
    static selectionsEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!a[i].equalsSelection(b[i])) {
                return false;
            }
        }
        return true;
    }
    static optionsEqual(a, b) {
        if (a && !b || !a && b) {
            return false;
        }
        if (!a && !b) {
            return true;
        }
        return (a.tabSize === b.tabSize
            && a.insertSpaces === b.insertSpaces
            && a.cursorStyle === b.cursorStyle
            && a.lineNumbers === b.lineNumbers);
    }
    static rangesEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!a[i].equalsRange(b[i])) {
                return false;
            }
        }
        return true;
    }
}
exports.TextEditorPropertiesMain = TextEditorPropertiesMain;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/text-editor-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/text-editor-model-service.js":
/*!*******************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/text-editor-model-service.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.EditorModelService = void 0;
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
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const monaco_workspace_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const uri_components_1 = __webpack_require__(/*! ../../common/uri-components */ "../../packages/plugin-ext/lib/common/uri-components.js");
let EditorModelService = class EditorModelService {
    constructor(monacoModelService, monacoWorkspace) {
        this.modelModeChangedEmitter = new core_1.Emitter();
        this.onModelRemovedEmitter = new core_1.Emitter();
        this.modelDirtyEmitter = new core_1.Emitter();
        this.modelSavedEmitter = new core_1.Emitter();
        this.onModelWillSavedEmitter = new core_1.Emitter();
        this.onModelDirtyChanged = this.modelDirtyEmitter.event;
        this.onModelSaved = this.modelSavedEmitter.event;
        this.onModelModeChanged = this.modelModeChangedEmitter.event;
        this.onModelRemoved = this.onModelRemovedEmitter.event;
        this.onModelWillSave = this.onModelWillSavedEmitter.event;
        this.monacoModelService = monacoModelService;
        monacoModelService.models.forEach(model => this.modelCreated(model));
        monacoModelService.onDidCreate(this.modelCreated, this);
        monacoWorkspace.onDidCloseTextDocument(model => {
            setTimeout(() => {
                this.onModelRemovedEmitter.fire(model);
            }, 1);
        });
    }
    modelCreated(model) {
        model.textEditorModel.onDidChangeLanguage(e => {
            this.modelModeChangedEmitter.fire({ model, oldModeId: e.oldLanguage });
        });
        model.onDidSaveModel(_ => {
            this.modelSavedEmitter.fire(model);
        });
        model.onDirtyChanged(_ => {
            this.modelDirtyEmitter.fire(model);
        });
        model.onWillSaveModel(willSaveModelEvent => {
            this.onModelWillSavedEmitter.fire(willSaveModelEvent);
        });
    }
    get onModelAdded() {
        return this.monacoModelService.onDidCreate;
    }
    getModels() {
        return this.monacoModelService.models;
    }
    async saveAll(includeUntitled) {
        const saves = [];
        for (const model of this.monacoModelService.models) {
            const { uri } = model.textEditorModel;
            if (model.dirty && (includeUntitled || uri.scheme !== uri_components_1.Schemes.untitled)) {
                saves.push((async () => {
                    try {
                        await model.save();
                        return true;
                    }
                    catch (e) {
                        console.error('Failed to save ', uri.toString(), e);
                        return false;
                    }
                })());
            }
        }
        const results = await Promise.all(saves);
        return results.reduce((a, b) => a && b, true);
    }
    async createModelReference(uri) {
        return this.monacoModelService.createModelReference(uri);
    }
};
EditorModelService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService)),
    __param(1, (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace)),
    __metadata("design:paramtypes", [monaco_text_model_service_1.MonacoTextModelService,
        monaco_workspace_1.MonacoWorkspace])
], EditorModelService);
exports.EditorModelService = EditorModelService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/text-editor-model-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/text-editors-main.js":
/*!***********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/text-editors-main.js ***!
  \***********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextEditorsMainImpl = void 0;
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const errors_1 = __webpack_require__(/*! ../../common/errors */ "../../packages/plugin-ext/lib/common/errors.js");
const languages_main_1 = __webpack_require__(/*! ./languages-main */ "../../packages/plugin-ext/lib/main/browser/languages-main.js");
const uri_components_1 = __webpack_require__(/*! ../../common/uri-components */ "../../packages/plugin-ext/lib/common/uri-components.js");
const endpoint_1 = __webpack_require__(/*! @theia/core/lib/browser/endpoint */ "../../packages/core/lib/browser/endpoint.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const bulkEditService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService.js");
class TextEditorsMainImpl {
    constructor(editorsAndDocuments, documents, rpc, bulkEditService, monacoEditorService) {
        this.editorsAndDocuments = editorsAndDocuments;
        this.documents = documents;
        this.bulkEditService = bulkEditService;
        this.monacoEditorService = monacoEditorService;
        this.toDispose = new disposable_1.DisposableCollection();
        this.editorsToDispose = new Map();
        this.fileEndpoint = new endpoint_1.Endpoint({ path: 'file' }).getRestUrl();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TEXT_EDITORS_EXT);
        this.toDispose.push(editorsAndDocuments);
        this.toDispose.push(editorsAndDocuments.onTextEditorAdd(editors => editors.forEach(this.onTextEditorAdd, this)));
        this.toDispose.push(editorsAndDocuments.onTextEditorRemove(editors => editors.forEach(this.onTextEditorRemove, this)));
    }
    dispose() {
        this.toDispose.dispose();
    }
    onTextEditorAdd(editor) {
        const id = editor.getId();
        const toDispose = new disposable_1.DisposableCollection(editor.onPropertiesChangedEvent(e => {
            this.proxy.$acceptEditorPropertiesChanged(id, e);
        }), disposable_1.Disposable.create(() => this.editorsToDispose.delete(id)));
        this.editorsToDispose.set(id, toDispose);
        this.toDispose.push(toDispose);
    }
    onTextEditorRemove(id) {
        const disposables = this.editorsToDispose.get(id);
        if (disposables) {
            disposables.dispose();
        }
    }
    $tryShowTextDocument(uri, options) {
        return this.documents.$tryShowDocument(uri, options);
    }
    $trySetOptions(id, options) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor: ${id}`));
        }
        this.editorsAndDocuments.getEditor(id).setConfiguration(options);
        return Promise.resolve();
    }
    $trySetSelections(id, selections) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor: ${id}`));
        }
        this.editorsAndDocuments.getEditor(id).setSelections(selections);
        return Promise.resolve();
    }
    $tryRevealRange(id, range, revealType) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        this.editorsAndDocuments.getEditor(id).revealRange(new monaco.Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn), revealType);
        return Promise.resolve();
    }
    $tryApplyEdits(id, modelVersionId, edits, opts) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        return Promise.resolve(this.editorsAndDocuments.getEditor(id).applyEdits(modelVersionId, edits, opts));
    }
    async $tryApplyWorkspaceEdit(dto, metadata) {
        const workspaceEdit = (0, languages_main_1.toMonacoWorkspaceEdit)(dto);
        try {
            const edits = bulkEditService_1.ResourceEdit.convert(workspaceEdit);
            const { success } = await this.bulkEditService.apply(edits, { respectAutoSaveConfig: metadata === null || metadata === void 0 ? void 0 : metadata.isRefactoring });
            return success;
        }
        catch {
            return false;
        }
    }
    $tryInsertSnippet(id, template, ranges, opts) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        return Promise.resolve(this.editorsAndDocuments.getEditor(id).insertSnippet(template, ranges, opts));
    }
    $registerTextEditorDecorationType(key, options) {
        this.injectRemoteUris(options);
        this.monacoEditorService.registerDecorationType('Plugin decoration', key, options);
        this.toDispose.push(disposable_1.Disposable.create(() => this.$removeTextEditorDecorationType(key)));
    }
    injectRemoteUris(options) {
        if (options.before) {
            options.before.contentIconPath = this.toRemoteUri(options.before.contentIconPath);
        }
        if (options.after) {
            options.after.contentIconPath = this.toRemoteUri(options.after.contentIconPath);
        }
        if ('gutterIconPath' in options) {
            options.gutterIconPath = this.toRemoteUri(options.gutterIconPath);
        }
        if ('dark' in options && options.dark) {
            this.injectRemoteUris(options.dark);
        }
        if ('light' in options && options.light) {
            this.injectRemoteUris(options.light);
        }
    }
    toRemoteUri(uri) {
        if (uri && uri.scheme === 'file') {
            return (0, uri_components_1.theiaUritoUriComponents)(this.fileEndpoint.withQuery(vscode_uri_1.URI.revive(uri).toString()));
        }
        return uri;
    }
    $removeTextEditorDecorationType(key) {
        this.monacoEditorService.removeDecorationType(key);
    }
    $tryHideEditor(id) {
        return this.editorsAndDocuments.hideEditor(id);
    }
    $trySetDecorations(id, key, ranges) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        this.editorsAndDocuments.getEditor(id).setDecorations(key, ranges);
        return Promise.resolve();
    }
    $trySetDecorationsFast(id, key, ranges) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        this.editorsAndDocuments.getEditor(id).setDecorationsFast(key, ranges);
        return Promise.resolve();
    }
    $saveAll(includeUntitled) {
        return this.editorsAndDocuments.saveAll(includeUntitled);
    }
}
exports.TextEditorsMainImpl = TextEditorsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/text-editors-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/theming-main.js":
/*!******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/theming-main.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.ThemingMainImpl = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/bafca191f55a234fad20ab67bb689aacc80e7a1a/src/vs/workbench/api/browser/mainThreadTheming.ts
class ThemingMainImpl {
    constructor(rpc, themeService) {
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.THEMING_EXT);
        this.themeChangeListener = themeService.onDidColorThemeChange(e => this.proxy.$onColorThemeChange(e.newTheme.type));
        this.proxy.$onColorThemeChange(themeService.getCurrentTheme().type);
    }
    dispose() {
        this.themeChangeListener.dispose();
    }
}
exports.ThemingMainImpl = ThemingMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/theming-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/timeline-main.js":
/*!*******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/timeline-main.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimelineMainImpl = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const timeline_service_1 = __webpack_require__(/*! @theia/timeline/lib/browser/timeline-service */ "../../packages/timeline/lib/browser/timeline-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/afacd2bdfe7060f09df9b9139521718915949757/src/vs/workbench/api/browser/mainThreadTimeline.ts
class TimelineMainImpl {
    constructor(rpc, container) {
        this.providerEmitters = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TIMELINE_EXT);
        this.timelineService = container.get(timeline_service_1.TimelineService);
    }
    async $registerTimelineProvider(provider) {
        const proxy = this.proxy;
        const emitters = this.providerEmitters;
        let onDidChange = emitters.get(provider.id);
        if (onDidChange === undefined) {
            onDidChange = new common_1.Emitter();
            emitters.set(provider.id, onDidChange);
        }
        this.timelineService.registerTimelineProvider({
            ...provider,
            onDidChange: onDidChange.event,
            provideTimeline(uri, options, internalOptions) {
                return proxy.$getTimeline(provider.id, uri, options, internalOptions);
            },
            dispose() {
                emitters.delete(provider.id);
                if (onDidChange) {
                    onDidChange.dispose();
                }
            }
        });
    }
    async $unregisterTimelineProvider(id) {
        this.timelineService.unregisterTimelineProvider(id);
    }
    async $fireTimelineChanged(e) {
        const emitter = this.providerEmitters.get(e.id);
        if (emitter) {
            emitter.fire(e);
        }
    }
}
exports.TimelineMainImpl = TimelineMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/timeline-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view-column-service.js":
/*!*************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view-column-service.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.ViewColumnService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const application_shell_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/application-shell */ "../../packages/core/lib/browser/shell/application-shell.js");
const algorithm_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/algorithm */ "../../packages/core/shared/@phosphor/algorithm/index.js");
let ViewColumnService = class ViewColumnService {
    constructor(shell) {
        this.shell = shell;
        this.columnValues = new Map();
        this.viewColumnIds = new Map();
        this.onViewColumnChangedEmitter = new event_1.Emitter();
        let oldColumnValues = new Map();
        const update = async () => {
            await new Promise((resolve => setTimeout(resolve)));
            this.updateViewColumns();
            this.viewColumnIds.forEach((ids, viewColumn) => {
                ids.forEach((id) => {
                    if (!oldColumnValues.has(id) || oldColumnValues.get(id) !== viewColumn) {
                        this.onViewColumnChangedEmitter.fire({ id, viewColumn });
                    }
                });
            });
            oldColumnValues = new Map(this.columnValues.entries());
        };
        this.shell.mainPanel.widgetAdded.connect(() => update());
        this.shell.mainPanel.widgetRemoved.connect(() => update());
    }
    get onViewColumnChanged() {
        return this.onViewColumnChangedEmitter.event;
    }
    updateViewColumns() {
        this.columnValues.clear();
        this.viewColumnIds.clear();
        const rows = new Map();
        const columns = new Map();
        for (const tabBar of (0, algorithm_1.toArray)(this.shell.mainPanel.tabBars())) {
            if (!tabBar.node.style.top || !tabBar.node.style.left) {
                continue;
            }
            const top = parseInt(tabBar.node.style.top);
            const left = parseInt(tabBar.node.style.left);
            const row = rows.get(top) || new Set();
            row.add(left);
            rows.set(top, row);
            const column = columns.get(left) || new Map();
            column.set(top, tabBar);
            columns.set(left, column);
        }
        const firstRow = rows.get([...rows.keys()].sort()[0]);
        if (!firstRow) {
            return;
        }
        const lefts = [...firstRow.keys()].sort();
        for (let i = 0; i < lefts.length; i++) {
            const column = columns.get(lefts[i]);
            if (!column) {
                break;
            }
            const cellIndexes = [...column.keys()].sort();
            let viewColumn = Math.min(i, 2);
            for (let j = 0; j < cellIndexes.length; j++) {
                const cell = column.get(cellIndexes[j]);
                if (!cell) {
                    break;
                }
                this.setViewColumn(cell, viewColumn);
                if (viewColumn < 7) {
                    viewColumn += 3;
                }
            }
        }
    }
    setViewColumn(tabBar, viewColumn) {
        const ids = [];
        for (const title of tabBar.titles) {
            const id = title.owner.id;
            ids.push(id);
            this.columnValues.set(id, viewColumn);
        }
        this.viewColumnIds.set(viewColumn, ids);
    }
    getViewColumnIds(viewColumn) {
        return this.viewColumnIds.get(viewColumn) || [];
    }
    getViewColumn(id) {
        return this.columnValues.get(id);
    }
    hasViewColumn(id) {
        return this.columnValues.has(id);
    }
    viewColumnsSize() {
        return this.viewColumnIds.size;
    }
};
ViewColumnService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(application_shell_1.ApplicationShell)),
    __metadata("design:paramtypes", [application_shell_1.ApplicationShell])
], ViewColumnService);
exports.ViewColumnService = ViewColumnService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view-column-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-registry.js":
/*!*******************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view/plugin-view-registry.js ***!
  \*******************************************************************************/
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
var PluginViewRegistry_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginViewRegistry = exports.PLUGIN_VIEW_DATA_FACTORY_ID = exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID = exports.PLUGIN_VIEW_FACTORY_ID = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
const plugin_shared_style_1 = __webpack_require__(/*! ../plugin-shared-style */ "../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js");
const debug_widget_1 = __webpack_require__(/*! @theia/debug/lib/browser/view/debug-widget */ "../../packages/debug/lib/browser/view/debug-widget.js");
const plugin_view_widget_1 = __webpack_require__(/*! ./plugin-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-widget.js");
const scm_contribution_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-contribution */ "../../packages/scm/lib/browser/scm-contribution.js");
const browser_2 = __webpack_require__(/*! @theia/navigator/lib/browser */ "../../packages/navigator/lib/browser/index.js");
const navigator_contribution_1 = __webpack_require__(/*! @theia/navigator/lib/browser/navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const debug_frontend_application_contribution_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-frontend-application-contribution */ "../../packages/debug/lib/browser/debug-frontend-application-contribution.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const menu_1 = __webpack_require__(/*! @theia/core/lib/common/menu */ "../../packages/core/lib/common/menu/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const view_context_key_service_1 = __webpack_require__(/*! ./view-context-key-service */ "../../packages/plugin-ext/lib/main/browser/view/view-context-key-service.js");
const problem_widget_1 = __webpack_require__(/*! @theia/markers/lib/browser/problem/problem-widget */ "../../packages/markers/lib/browser/problem/problem-widget.js");
const output_widget_1 = __webpack_require__(/*! @theia/output/lib/browser/output-widget */ "../../packages/output/lib/browser/output-widget.js");
const debug_console_contribution_1 = __webpack_require__(/*! @theia/debug/lib/browser/console/debug-console-contribution */ "../../packages/debug/lib/browser/console/debug-console-contribution.js");
const search_in_workspace_factory_1 = __webpack_require__(/*! @theia/search-in-workspace/lib/browser/search-in-workspace-factory */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-factory.js");
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
const webview_1 = __webpack_require__(/*! ../webview/webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const uuid_1 = __webpack_require__(/*! uuid */ "../../node_modules/uuid/dist/esm-browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
exports.PLUGIN_VIEW_FACTORY_ID = 'plugin-view';
exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID = 'plugin-view-container';
exports.PLUGIN_VIEW_DATA_FACTORY_ID = 'plugin-view-data';
let PluginViewRegistry = PluginViewRegistry_1 = class PluginViewRegistry {
    constructor() {
        this.onDidExpandViewEmitter = new event_1.Emitter();
        this.onDidExpandView = this.onDidExpandViewEmitter.event;
        this.views = new Map();
        this.viewsWelcome = new Map();
        this.viewContainers = new Map();
        this.containerViews = new Map();
        this.viewClauseContexts = new Map();
        this.viewDataProviders = new Map();
        this.viewDataState = new Map();
        this.webviewViewResolvers = new Map();
    }
    init() {
        // TODO workbench.panel.comments - Theia does not have a proper comments view yet
        this.updateFocusedView();
        this.shell.onDidChangeActiveWidget(() => this.updateFocusedView());
        this.widgetManager.onWillCreateWidget(({ factoryId, widget, waitUntil }) => {
            if (factoryId === browser_2.EXPLORER_VIEW_CONTAINER_ID && widget instanceof browser_1.ViewContainer) {
                waitUntil(this.prepareViewContainer('explorer', widget));
            }
            if (factoryId === scm_contribution_1.SCM_VIEW_CONTAINER_ID && widget instanceof browser_1.ViewContainer) {
                waitUntil(this.prepareViewContainer('scm', widget));
            }
            if (factoryId === search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID && widget instanceof browser_1.ViewContainer) {
                waitUntil(this.prepareViewContainer('search', widget));
            }
            if (factoryId === debug_widget_1.DebugWidget.ID && widget instanceof debug_widget_1.DebugWidget) {
                const viewContainer = widget['sessionWidget']['viewContainer'];
                waitUntil(this.prepareViewContainer('debug', viewContainer));
            }
            if (factoryId === exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID && widget instanceof browser_1.ViewContainer) {
                waitUntil(this.prepareViewContainer(this.toViewContainerId(widget.options), widget));
            }
            if (factoryId === exports.PLUGIN_VIEW_FACTORY_ID && widget instanceof plugin_view_widget_1.PluginViewWidget) {
                waitUntil(this.prepareView(widget));
            }
        });
        this.widgetManager.onDidCreateWidget(event => {
            if (event.widget instanceof browser_2.FileNavigatorWidget) {
                const disposable = new disposable_1.DisposableCollection();
                disposable.push(this.registerViewWelcome({
                    view: 'explorer',
                    content: core_1.nls.localizeByDefault('You have not yet opened a folder.\n{0}', `[${core_1.nls.localizeByDefault('Open Folder')}](command:workbench.action.files.openFolder)`),
                    order: 0
                }));
                disposable.push(event.widget.onDidDispose(() => disposable.dispose()));
            }
        });
        this.doRegisterViewContainer('test', 'left', {
            label: core_1.nls.localizeByDefault('Test'),
            iconClass: (0, browser_1.codicon)('beaker'),
            closeable: true
        });
        this.contextKeyService.onDidChange(e => {
            for (const [, view] of this.views.values()) {
                const clauseContext = this.viewClauseContexts.get(view.id);
                if (clauseContext && e.affects(clauseContext)) {
                    this.updateViewVisibility(view.id);
                }
            }
            for (const [viewId, viewWelcomes] of this.viewsWelcome) {
                for (const [index] of viewWelcomes.entries()) {
                    const viewWelcomeId = this.toViewWelcomeId(index, viewId);
                    const clauseContext = this.viewClauseContexts.get(viewWelcomeId);
                    if (clauseContext && e.affects(clauseContext)) {
                        this.updateViewWelcomeVisibility(viewId);
                    }
                }
            }
        });
        const hookDockPanelKey = (panel, key) => {
            let toDisposeOnActivate = new disposable_1.DisposableCollection();
            panel.onDidChangeCurrent(title => {
                toDisposeOnActivate.dispose();
                toDisposeOnActivate = new disposable_1.DisposableCollection();
                if (title && title.owner instanceof browser_1.BaseWidget) {
                    const widget = title.owner;
                    let value = PluginViewRegistry_1.ID_MAPPINGS.get(widget.id);
                    if (!value) {
                        if (widget.id.startsWith(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID)) {
                            value = this.toViewContainerId({ id: widget.id });
                        }
                    }
                    const setKey = () => {
                        if (widget.isVisible && value) {
                            key.set(value);
                        }
                        else {
                            key.reset();
                        }
                    };
                    toDisposeOnActivate.push(widget.onDidChangeVisibility(() => {
                        setKey();
                    }));
                    setKey();
                }
            });
        };
        hookDockPanelKey(this.shell.leftPanelHandler.dockPanel, this.viewContextKeys.activeViewlet);
        hookDockPanelKey(this.shell.rightPanelHandler.dockPanel, this.viewContextKeys.activeAuxiliary);
        hookDockPanelKey(this.shell.bottomPanel, this.viewContextKeys.activePanel);
    }
    async updateViewWelcomeVisibility(viewId) {
        const widget = await this.getTreeViewWelcomeWidget(viewId);
        if (widget) {
            widget.handleWelcomeContextChange();
        }
    }
    async updateViewVisibility(viewId) {
        const widget = await this.getView(viewId);
        if (!widget) {
            if (this.isViewVisible(viewId)) {
                await this.openView(viewId);
            }
            return;
        }
        const viewInfo = this.views.get(viewId);
        if (!viewInfo) {
            return;
        }
        const [viewContainerId] = viewInfo;
        const viewContainer = await this.getPluginViewContainer(viewContainerId);
        if (!viewContainer) {
            return;
        }
        const part = viewContainer.getPartFor(widget);
        if (!part) {
            return;
        }
        widget.updateViewVisibility(() => part.setHidden(!this.isViewVisible(viewId)));
    }
    isViewVisible(viewId) {
        const viewInfo = this.views.get(viewId);
        if (!viewInfo) {
            return false;
        }
        const [, view] = viewInfo;
        return view.when === undefined || view.when === 'true' || this.contextKeyService.match(view.when);
    }
    registerViewContainer(location, viewContainer) {
        var _a;
        if (this.viewContainers.has(viewContainer.id)) {
            console.warn('view container such id already registered: ', JSON.stringify(viewContainer));
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection();
        const containerClass = 'theia-plugin-view-container';
        let themeIconClass = '';
        const iconClass = 'plugin-view-container-icon-' + viewContainer.id;
        if (viewContainer.themeIcon) {
            const icon = themeService_1.ThemeIcon.fromString(viewContainer.themeIcon);
            if (icon) {
                themeIconClass = (_a = themeService_1.ThemeIcon.asClassName(icon)) !== null && _a !== void 0 ? _a : '';
            }
        }
        if (!themeIconClass) {
            const iconUrl = plugin_shared_style_1.PluginSharedStyle.toExternalIconUrl(viewContainer.iconUrl);
            toDispose.push(this.style.insertRule('.' + containerClass + '.' + iconClass, () => `
                mask: url('${iconUrl}') no-repeat 50% 50%;
                -webkit-mask: url('${iconUrl}') no-repeat 50% 50%;
            `));
        }
        toDispose.push(this.doRegisterViewContainer(viewContainer.id, location, {
            label: viewContainer.title,
            // The container class automatically sets a mask; if we're using a theme icon, we don't want one.
            iconClass: (themeIconClass || containerClass) + ' ' + iconClass,
            closeable: true
        }));
        return toDispose;
    }
    async toggleViewContainer(id) {
        let widget = await this.getPluginViewContainer(id);
        if (widget && widget.isAttached) {
            widget.dispose();
        }
        else {
            widget = await this.openViewContainer(id);
            if (widget) {
                this.shell.activateWidget(widget.id);
            }
        }
    }
    doRegisterViewContainer(id, location, options) {
        var _a;
        const toDispose = new disposable_1.DisposableCollection();
        this.viewContainers.set(id, [location, options]);
        toDispose.push(disposable_1.Disposable.create(() => this.viewContainers.delete(id)));
        const toggleCommandId = `plugin.view-container.${id}.toggle`;
        toDispose.push(this.commands.registerCommand({
            id: toggleCommandId,
            label: 'Toggle ' + options.label + ' View'
        }, {
            execute: () => this.toggleViewContainer(id)
        }));
        toDispose.push(this.menus.registerMenuAction(browser_1.CommonMenus.VIEW_VIEWS, {
            commandId: toggleCommandId,
            label: options.label
        }));
        toDispose.push((_a = this.quickView) === null || _a === void 0 ? void 0 : _a.registerItem({
            label: options.label,
            open: async () => {
                const widget = await this.openViewContainer(id);
                if (widget) {
                    this.shell.activateWidget(widget.id);
                }
            }
        }));
        toDispose.push(disposable_1.Disposable.create(async () => {
            const widget = await this.getPluginViewContainer(id);
            if (widget) {
                widget.dispose();
            }
        }));
        return toDispose;
    }
    getContainerViews(viewContainerId) {
        return this.containerViews.get(viewContainerId) || [];
    }
    registerView(viewContainerId, view) {
        var _a, _b;
        if (this.views.has(view.id)) {
            console.warn('view with such id already registered: ', JSON.stringify(view));
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection();
        view.when = (_a = view.when) === null || _a === void 0 ? void 0 : _a.trim();
        this.views.set(view.id, [viewContainerId, view]);
        toDispose.push(disposable_1.Disposable.create(() => this.views.delete(view.id)));
        const containerViews = this.getContainerViews(viewContainerId);
        containerViews.push(view.id);
        this.containerViews.set(viewContainerId, containerViews);
        toDispose.push(disposable_1.Disposable.create(() => {
            const index = containerViews.indexOf(view.id);
            if (index !== -1) {
                containerViews.splice(index, 1);
            }
        }));
        if (view.when && view.when !== 'false' && view.when !== 'true') {
            const keys = this.contextKeyService.parseKeys(view.when);
            if (keys) {
                this.viewClauseContexts.set(view.id, keys);
                toDispose.push(disposable_1.Disposable.create(() => this.viewClauseContexts.delete(view.id)));
            }
        }
        toDispose.push((_b = this.quickView) === null || _b === void 0 ? void 0 : _b.registerItem({
            label: view.name,
            when: view.when,
            open: () => this.openView(view.id, { activate: true })
        }));
        toDispose.push(this.commands.registerCommand({ id: `${view.id}.focus` }, {
            execute: async () => { await this.openView(view.id, { activate: true }); }
        }));
        return toDispose;
    }
    async registerWebviewView(viewId, resolver) {
        if (this.webviewViewResolvers.has(viewId)) {
            throw new Error(`View resolver already registered for ${viewId}`);
        }
        this.webviewViewResolvers.set(viewId, resolver);
        const webviewView = await this.createNewWebviewView();
        const token = cancellation_1.CancellationToken.None;
        this.getView(viewId).then(async (view) => {
            if (view) {
                if (view.isVisible) {
                    await this.prepareView(view, webviewView.webview.identifier.id);
                }
                else {
                    const toDisposeOnDidExpandView = new disposable_1.DisposableCollection(this.onDidExpandView(async (id) => {
                        if (id === viewId) {
                            dispose();
                            await this.prepareView(view, webviewView.webview.identifier.id);
                        }
                    }));
                    const dispose = () => toDisposeOnDidExpandView.dispose();
                    view.disposed.connect(dispose);
                    toDisposeOnDidExpandView.push(disposable_1.Disposable.create(() => view.disposed.disconnect(dispose)));
                }
            }
        });
        resolver.resolve(webviewView, token);
        return disposable_1.Disposable.create(() => {
            this.webviewViewResolvers.delete(viewId);
        });
    }
    async createNewWebviewView() {
        const webview = await this.widgetManager.getOrCreateWidget(webview_1.WebviewWidget.FACTORY_ID, { id: (0, uuid_1.v4)() });
        webview.setContentOptions({ allowScripts: true });
        let _description;
        return {
            webview,
            get onDidChangeVisibility() { return webview.onDidChangeVisibility; },
            get onDidDispose() { return webview.onDidDispose; },
            get title() { return webview.title.label; },
            set title(value) { webview.title.label = value || ''; },
            get description() { return _description; },
            set description(value) { _description = value; },
            get badge() { return webview.badge; },
            set badge(badge) { webview.badge = badge; },
            get badgeTooltip() { return webview.badgeTooltip; },
            set badgeTooltip(badgeTooltip) { webview.badgeTooltip = badgeTooltip; },
            onDidChangeBadge: webview.onDidChangeBadge,
            onDidChangeBadgeTooltip: webview.onDidChangeBadgeTooltip,
            dispose: webview.dispose,
            show: webview.show
        };
    }
    registerViewWelcome(viewWelcome) {
        const toDispose = new disposable_1.DisposableCollection();
        const viewsWelcome = this.viewsWelcome.get(viewWelcome.view) || [];
        if (viewsWelcome.some(e => e.content === viewWelcome.content)) {
            return toDispose;
        }
        viewsWelcome.push(viewWelcome);
        this.viewsWelcome.set(viewWelcome.view, viewsWelcome);
        this.handleViewWelcomeChange(viewWelcome.view);
        toDispose.push(disposable_1.Disposable.create(() => {
            const index = viewsWelcome.indexOf(viewWelcome);
            if (index !== -1) {
                viewsWelcome.splice(index, 1);
            }
            this.handleViewWelcomeChange(viewWelcome.view);
        }));
        if (viewWelcome.when) {
            const index = viewsWelcome.indexOf(viewWelcome);
            const viewWelcomeId = this.toViewWelcomeId(index, viewWelcome.view);
            this.viewClauseContexts.set(viewWelcomeId, this.contextKeyService.parseKeys(viewWelcome.when));
            toDispose.push(disposable_1.Disposable.create(() => this.viewClauseContexts.delete(viewWelcomeId)));
        }
        return toDispose;
    }
    async handleViewWelcomeChange(viewId) {
        const widget = await this.getTreeViewWelcomeWidget(viewId);
        if (widget) {
            widget.handleViewWelcomeContentChange(this.getViewWelcomes(viewId));
        }
    }
    async getTreeViewWelcomeWidget(viewId) {
        switch (viewId) {
            case 'explorer':
                return this.widgetManager.getWidget(browser_2.FILE_NAVIGATOR_ID);
            default:
                return this.widgetManager.getWidget(exports.PLUGIN_VIEW_DATA_FACTORY_ID, { id: viewId });
        }
    }
    getViewWelcomes(viewId) {
        return this.viewsWelcome.get(viewId) || [];
    }
    async getView(viewId) {
        if (!this.views.has(viewId)) {
            return undefined;
        }
        return this.widgetManager.getWidget(exports.PLUGIN_VIEW_FACTORY_ID, this.toPluginViewWidgetIdentifier(viewId));
    }
    async openView(viewId, options) {
        const view = await this.doOpenView(viewId);
        if (view && options) {
            if (options.activate === true) {
                await this.shell.activateWidget(view.id);
            }
            else if (options.reveal === true) {
                await this.shell.revealWidget(view.id);
            }
        }
        return view;
    }
    async doOpenView(viewId) {
        const widget = await this.getView(viewId);
        if (widget) {
            return widget;
        }
        const data = this.views.get(viewId);
        if (!data) {
            return undefined;
        }
        const [containerId] = data;
        await this.openViewContainer(containerId);
        return this.getView(viewId);
    }
    async prepareView(widget, webviewId) {
        const data = this.views.get(widget.options.viewId);
        if (!data) {
            return;
        }
        const [, view] = data;
        if (!widget.title.label) {
            widget.title.label = view.name;
        }
        const currentDataWidget = widget.widgets[0];
        const viewDataWidget = await this.createViewDataWidget(view.id, webviewId);
        if (widget.isDisposed) {
            viewDataWidget === null || viewDataWidget === void 0 ? void 0 : viewDataWidget.dispose();
            return;
        }
        if (currentDataWidget !== viewDataWidget) {
            if (currentDataWidget) {
                currentDataWidget.dispose();
            }
            if (viewDataWidget) {
                widget.addWidget(viewDataWidget);
            }
        }
    }
    getOrCreateViewContainerWidget(containerId) {
        const identifier = this.toViewContainerIdentifier(containerId);
        return this.widgetManager.getOrCreateWidget(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID, identifier);
    }
    async openViewContainer(containerId) {
        if (containerId === 'explorer') {
            const widget = await this.explorer.openView();
            if (widget.parent instanceof browser_1.ViewContainer) {
                return widget.parent;
            }
            return undefined;
        }
        if (containerId === 'scm') {
            const widget = await this.scm.openView();
            if (widget.parent instanceof browser_1.ViewContainer) {
                return widget.parent;
            }
            return undefined;
        }
        if (containerId === 'debug') {
            const widget = await this.debug.openView();
            return widget['sessionWidget']['viewContainer'];
        }
        const data = this.viewContainers.get(containerId);
        if (!data) {
            return undefined;
        }
        const [location] = data;
        const containerWidget = await this.getOrCreateViewContainerWidget(containerId);
        if (!containerWidget.isAttached) {
            await this.shell.addWidget(containerWidget, {
                area: browser_1.ApplicationShell.isSideArea(location) ? location : 'left',
                rank: Number.MAX_SAFE_INTEGER
            });
        }
        return containerWidget;
    }
    async prepareViewContainer(viewContainerId, containerWidget) {
        const data = this.viewContainers.get(viewContainerId);
        if (data) {
            const [, options] = data;
            containerWidget.setTitleOptions(options);
        }
        for (const viewId of this.getContainerViews(viewContainerId)) {
            const identifier = this.toPluginViewWidgetIdentifier(viewId);
            // Keep existing widget in its current container and reregister its part to the plugin view widget events.
            const existingWidget = this.widgetManager.tryGetWidget(exports.PLUGIN_VIEW_FACTORY_ID, identifier);
            if (existingWidget && existingWidget.currentViewContainerId) {
                const currentContainer = await this.getPluginViewContainer(existingWidget.currentViewContainerId);
                if (currentContainer && this.registerWidgetPartEvents(existingWidget, currentContainer)) {
                    continue;
                }
            }
            const widget = await this.widgetManager.getOrCreateWidget(exports.PLUGIN_VIEW_FACTORY_ID, identifier);
            if (containerWidget.getTrackableWidgets().indexOf(widget) === -1) {
                containerWidget.addWidget(widget, {
                    initiallyCollapsed: !!containerWidget.getParts().length,
                    initiallyHidden: !this.isViewVisible(viewId)
                });
            }
            this.registerWidgetPartEvents(widget, containerWidget);
        }
    }
    registerWidgetPartEvents(widget, containerWidget) {
        const part = containerWidget.getPartFor(widget);
        if (part) {
            widget.currentViewContainerId = this.getViewContainerId(containerWidget);
            part.onDidMove(event => { widget.currentViewContainerId = this.getViewContainerId(event); });
            // if a view is explicitly hidden then suppress updating visibility based on `when` closure
            part.onDidChangeVisibility(() => widget.suppressUpdateViewVisibility = part.isHidden);
            const tryFireOnDidExpandView = () => {
                if (widget.widgets.length === 0) {
                    if (!part.collapsed && part.isVisible) {
                        const viewId = this.toViewId(widget.options);
                        this.onDidExpandViewEmitter.fire(viewId);
                    }
                }
                else {
                    toFire.dispose();
                }
            };
            const toFire = new disposable_1.DisposableCollection(part.onCollapsed(tryFireOnDidExpandView), part.onDidChangeVisibility(tryFireOnDidExpandView));
            tryFireOnDidExpandView();
            return part;
        }
    }
    ;
    getViewContainerId(container) {
        var _a;
        const description = this.widgetManager.getDescription(container);
        switch (description === null || description === void 0 ? void 0 : description.factoryId) {
            case browser_2.EXPLORER_VIEW_CONTAINER_ID: return 'explorer';
            case scm_contribution_1.SCM_VIEW_CONTAINER_ID: return 'scm';
            case search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID: return 'search';
            case undefined: return ((_a = container.parent) === null || _a === void 0 ? void 0 : _a.parent) instanceof debug_widget_1.DebugWidget ? 'debug' : container.id;
            case exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID: return this.toViewContainerId(description.options);
            default: return container.id;
        }
    }
    async getPluginViewContainer(viewContainerId) {
        if (viewContainerId === 'explorer') {
            return this.widgetManager.getWidget(browser_2.EXPLORER_VIEW_CONTAINER_ID);
        }
        if (viewContainerId === 'scm') {
            return this.widgetManager.getWidget(scm_contribution_1.SCM_VIEW_CONTAINER_ID);
        }
        if (viewContainerId === 'search') {
            return this.widgetManager.getWidget(search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID);
        }
        if (viewContainerId === 'debug') {
            const debug = await this.widgetManager.getWidget(debug_widget_1.DebugWidget.ID);
            if (debug instanceof debug_widget_1.DebugWidget) {
                return debug['sessionWidget']['viewContainer'];
            }
        }
        const identifier = this.toViewContainerIdentifier(viewContainerId);
        return this.widgetManager.getWidget(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID, identifier);
    }
    async initViewContainer(containerId) {
        let viewContainer = await this.getPluginViewContainer(containerId);
        if (!viewContainer) {
            viewContainer = await this.openViewContainer(containerId);
            if (viewContainer && !viewContainer.getParts().filter(part => !part.isHidden).length) {
                // close view containers without any visible view parts
                viewContainer.dispose();
            }
        }
        else {
            await this.prepareViewContainer(this.toViewContainerId(viewContainer.options), viewContainer);
        }
    }
    async initWidgets() {
        const promises = [];
        for (const id of this.viewContainers.keys()) {
            promises.push((async () => {
                await this.initViewContainer(id);
            })().catch(console.error));
        }
        promises.push((async () => {
            const explorer = await this.widgetManager.getWidget(browser_2.EXPLORER_VIEW_CONTAINER_ID);
            if (explorer instanceof browser_1.ViewContainer) {
                await this.prepareViewContainer('explorer', explorer);
            }
        })().catch(console.error));
        promises.push((async () => {
            const scm = await this.widgetManager.getWidget(scm_contribution_1.SCM_VIEW_CONTAINER_ID);
            if (scm instanceof browser_1.ViewContainer) {
                await this.prepareViewContainer('scm', scm);
            }
        })().catch(console.error));
        promises.push((async () => {
            const search = await this.widgetManager.getWidget(search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID);
            if (search instanceof browser_1.ViewContainer) {
                await this.prepareViewContainer('search', search);
            }
        })().catch(console.error));
        promises.push((async () => {
            const debug = await this.widgetManager.getWidget(debug_widget_1.DebugWidget.ID);
            if (debug instanceof debug_widget_1.DebugWidget) {
                const viewContainer = debug['sessionWidget']['viewContainer'];
                await this.prepareViewContainer('debug', viewContainer);
            }
        })().catch(console.error));
        await Promise.all(promises);
    }
    async removeStaleWidgets() {
        const views = this.widgetManager.getWidgets(exports.PLUGIN_VIEW_FACTORY_ID);
        for (const view of views) {
            if (view instanceof plugin_view_widget_1.PluginViewWidget) {
                const id = this.toViewId(view.options);
                if (!this.views.has(id)) {
                    view.dispose();
                }
            }
        }
        const viewContainers = this.widgetManager.getWidgets(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID);
        for (const viewContainer of viewContainers) {
            if (viewContainer instanceof browser_1.ViewContainer) {
                const id = this.toViewContainerId(viewContainer.options);
                if (!this.viewContainers.has(id)) {
                    viewContainer.dispose();
                }
            }
        }
    }
    toViewContainerIdentifier(viewContainerId) {
        return { id: exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID + ':' + viewContainerId, progressLocationId: viewContainerId };
    }
    toViewContainerId(identifier) {
        return identifier.id.substring(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID.length + 1);
    }
    toPluginViewWidgetIdentifier(viewId) {
        return { id: exports.PLUGIN_VIEW_FACTORY_ID + ':' + viewId, viewId };
    }
    toViewId(identifier) {
        return identifier.viewId;
    }
    toViewWelcomeId(index, viewId) {
        return `view-welcome.${viewId}.${index}`;
    }
    /**
     * retrieve restored layout state from previous user session but close widgets
     * widgets should be opened only when view data providers are registered
     */
    onDidInitializeLayout() {
        const widgets = this.widgetManager.getWidgets(exports.PLUGIN_VIEW_DATA_FACTORY_ID);
        for (const widget of widgets) {
            if (browser_1.StatefulWidget.is(widget)) {
                const state = widget.storeState();
                if (state) {
                    this.viewDataState.set(widget.id, state);
                }
            }
            widget.dispose();
        }
    }
    registerViewDataProvider(viewId, provider) {
        if (this.viewDataProviders.has(viewId)) {
            console.error(`data provider for '${viewId}' view is already registered`);
            return disposable_1.Disposable.NULL;
        }
        this.viewDataProviders.set(viewId, provider);
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => {
            this.viewDataProviders.delete(viewId);
            this.viewDataState.delete(viewId);
        }));
        this.getView(viewId).then(async (view) => {
            if (toDispose.disposed) {
                return;
            }
            if (view) {
                if (view.isVisible) {
                    await this.prepareView(view);
                }
                else {
                    const toDisposeOnDidExpandView = new disposable_1.DisposableCollection(this.onDidExpandView(async (id) => {
                        if (id === viewId) {
                            unsubscribe();
                            await this.prepareView(view);
                        }
                    }));
                    const unsubscribe = () => toDisposeOnDidExpandView.dispose();
                    view.disposed.connect(unsubscribe);
                    toDisposeOnDidExpandView.push(disposable_1.Disposable.create(() => view.disposed.disconnect(unsubscribe)));
                    toDispose.push(toDisposeOnDidExpandView);
                }
            }
        });
        return toDispose;
    }
    async createViewDataWidget(viewId, webviewId) {
        var _a;
        const view = this.views.get(viewId);
        if (((_a = view === null || view === void 0 ? void 0 : view[1]) === null || _a === void 0 ? void 0 : _a.type) === common_1.PluginViewType.Webview) {
            const webviewWidget = this.widgetManager.getWidget(webview_1.WebviewWidget.FACTORY_ID, { id: webviewId });
            return webviewWidget;
        }
        const provider = this.viewDataProviders.get(viewId);
        if (!view || !provider) {
            return undefined;
        }
        const [, viewInfo] = view;
        const state = this.viewDataState.get(viewId);
        const widget = await provider({ state, viewInfo });
        widget.handleViewWelcomeContentChange(this.getViewWelcomes(viewId));
        if (browser_1.StatefulWidget.is(widget)) {
            this.storeViewDataStateOnDispose(viewId, widget);
        }
        else {
            this.viewDataState.delete(viewId);
        }
        return widget;
    }
    storeViewDataStateOnDispose(viewId, widget) {
        const dispose = widget.dispose.bind(widget);
        widget.dispose = () => {
            const state = widget.storeState();
            if (state) {
                this.viewDataState.set(viewId, state);
            }
            dispose();
        };
    }
    isVisibleWidget(widget) {
        return !widget.isDisposed && widget.isVisible;
    }
    updateFocusedView() {
        const widget = this.shell.activeWidget;
        if (widget instanceof plugin_view_widget_1.PluginViewWidget) {
            this.viewContextKeys.focusedView.set(widget.options.viewId);
        }
        else {
            this.viewContextKeys.focusedView.reset();
        }
    }
};
PluginViewRegistry.ID_MAPPINGS = new Map([
    // VS Code Viewlets
    [browser_2.EXPLORER_VIEW_CONTAINER_ID, 'workbench.view.explorer'],
    [scm_contribution_1.SCM_VIEW_CONTAINER_ID, 'workbench.view.scm'],
    [search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID, 'workbench.view.search'],
    [debug_widget_1.DebugWidget.ID, 'workbench.view.debug'],
    ['vsx-extensions-view-container', 'workbench.view.extensions'],
    [problem_widget_1.PROBLEMS_WIDGET_ID, 'workbench.panel.markers'],
    [output_widget_1.OutputWidget.ID, 'workbench.panel.output'],
    [debug_console_contribution_1.DebugConsoleContribution.options.id, 'workbench.panel.repl'],
    // Theia does not have a single terminal widget, but instead each terminal gets its own widget. Therefore "the terminal widget is active" doesn't make sense in Theia
    // [TERMINAL_WIDGET_FACTORY_ID, 'workbench.panel.terminal'],
    // [?? , 'workbench.panel.comments'] not sure what this mean: we don't show comments in sidebars nor the bottom
]);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], PluginViewRegistry.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], PluginViewRegistry.prototype, "style", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], PluginViewRegistry.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(scm_contribution_1.ScmContribution),
    __metadata("design:type", scm_contribution_1.ScmContribution)
], PluginViewRegistry.prototype, "scm", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_contribution_1.FileNavigatorContribution),
    __metadata("design:type", navigator_contribution_1.FileNavigatorContribution)
], PluginViewRegistry.prototype, "explorer", void 0);
__decorate([
    (0, inversify_1.inject)(debug_frontend_application_contribution_1.DebugFrontendApplicationContribution),
    __metadata("design:type", debug_frontend_application_contribution_1.DebugFrontendApplicationContribution)
], PluginViewRegistry.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], PluginViewRegistry.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(menu_1.MenuModelRegistry),
    __metadata("design:type", menu_1.MenuModelRegistry)
], PluginViewRegistry.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickViewService),
    (0, inversify_1.optional)(),
    __metadata("design:type", browser_1.QuickViewService)
], PluginViewRegistry.prototype, "quickView", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], PluginViewRegistry.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(view_context_key_service_1.ViewContextKeyService),
    __metadata("design:type", view_context_key_service_1.ViewContextKeyService)
], PluginViewRegistry.prototype, "viewContextKeys", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginViewRegistry.prototype, "init", null);
PluginViewRegistry = PluginViewRegistry_1 = __decorate([
    (0, inversify_1.injectable)()
], PluginViewRegistry);
exports.PluginViewRegistry = PluginViewRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view/plugin-view-registry'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-widget.js":
/*!*****************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view/plugin-view-widget.js ***!
  \*****************************************************************************/
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
exports.PluginViewWidget = exports.PluginViewWidgetIdentifier = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const widgets_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/widgets */ "../../packages/core/shared/@phosphor/widgets/index.js");
const menu_1 = __webpack_require__(/*! @theia/core/lib/common/menu */ "../../packages/core/lib/common/menu/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const tree_view_widget_1 = __webpack_require__(/*! ./tree-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/tree-view-widget.js");
const view_container_1 = __webpack_require__(/*! @theia/core/lib/browser/view-container */ "../../packages/core/lib/browser/view-container.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let PluginViewWidgetIdentifier = class PluginViewWidgetIdentifier {
};
PluginViewWidgetIdentifier = __decorate([
    (0, inversify_1.injectable)()
], PluginViewWidgetIdentifier);
exports.PluginViewWidgetIdentifier = PluginViewWidgetIdentifier;
let PluginViewWidget = class PluginViewWidget extends widgets_1.Panel {
    constructor() {
        super();
        this._description = '';
        this._suppressUpdateViewVisibility = false;
        this.updatingViewVisibility = false;
        this.onDidChangeDescriptionEmitter = new common_1.Emitter();
        this.onDidChangeBadgeEmitter = new common_1.Emitter();
        this.onDidChangeBadgeTooltipEmitter = new common_1.Emitter();
        this.toDispose = new common_1.DisposableCollection(this.onDidChangeDescriptionEmitter, this.onDidChangeBadgeEmitter, this.onDidChangeBadgeTooltipEmitter);
        this.onDidChangeToolbarItemsEmitter = new common_1.Emitter();
        this.node.tabIndex = -1;
        this.node.style.height = '100%';
    }
    get onDidChangeToolbarItems() {
        return this.onDidChangeToolbarItemsEmitter.event;
    }
    init() {
        this.id = this.options.id;
        const localContext = this.contextKeyService.createScoped(this.node);
        localContext.setContext('view', this.options.viewId);
        this.toDispose.push(localContext);
    }
    get onDidChangeDescription() {
        return this.onDidChangeDescriptionEmitter.event;
    }
    get onDidChangeBadge() {
        return this.onDidChangeBadgeEmitter.event;
    }
    get onDidChangeBadgeTooltip() {
        return this.onDidChangeBadgeTooltipEmitter.event;
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        const widget = this.widgets[0];
        if (widget) {
            widget.activate();
            this.updateWidgetMessage();
        }
        else {
            this.node.focus();
        }
    }
    storeState() {
        return {
            label: this.title.label,
            message: this.message,
            widgets: this.widgets,
            suppressUpdateViewVisibility: this._suppressUpdateViewVisibility,
            currentViewContainerId: this.currentViewContainerId
        };
    }
    restoreState(state) {
        this.title.label = state.label;
        this.message = state.message;
        this.suppressUpdateViewVisibility = state.suppressUpdateViewVisibility;
        this.currentViewContainerId = state.currentViewContainerId;
        for (const widget of state.widgets) {
            this.addWidget(widget);
        }
    }
    set suppressUpdateViewVisibility(suppressUpdateViewVisibility) {
        this._suppressUpdateViewVisibility = !this.updatingViewVisibility && suppressUpdateViewVisibility;
    }
    updateViewVisibility(cb) {
        if (this._suppressUpdateViewVisibility) {
            return;
        }
        try {
            this.updatingViewVisibility = true;
            cb();
        }
        finally {
            this.updatingViewVisibility = false;
        }
    }
    get message() {
        return this._message;
    }
    set message(message) {
        this._message = message;
        this.updateWidgetMessage();
    }
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
        this.onDidChangeDescriptionEmitter.fire();
    }
    get badge() {
        const widget = this.widgets[0];
        if (view_container_1.BadgeWidget.is(widget)) {
            return widget.badge;
        }
        return this._badge;
    }
    set badge(badge) {
        this._badge = badge;
        this.onDidChangeBadgeEmitter.fire();
    }
    get badgeTooltip() {
        const widget = this.widgets[0];
        if (view_container_1.BadgeWidget.is(widget)) {
            return widget.badgeTooltip;
        }
        return this._badgeTooltip;
    }
    set badgeTooltip(badgeTooltip) {
        this._badgeTooltip = badgeTooltip;
        this.onDidChangeBadgeTooltipEmitter.fire();
    }
    updateWidgetMessage() {
        const widget = this.widgets[0];
        if (widget) {
            if (widget instanceof tree_view_widget_1.TreeViewWidget) {
                widget.message = this._message;
            }
        }
    }
    addWidget(widget) {
        super.addWidget(widget);
        if (view_container_1.BadgeWidget.is(widget)) {
            widget.onDidChangeBadge(() => this.onDidChangeBadgeEmitter.fire());
            widget.onDidChangeBadgeTooltip(() => this.onDidChangeBadgeTooltipEmitter.fire());
        }
        this.updateWidgetMessage();
        this.onDidChangeToolbarItemsEmitter.fire();
    }
    insertWidget(index, widget) {
        super.insertWidget(index, widget);
        this.updateWidgetMessage();
        this.onDidChangeToolbarItemsEmitter.fire();
    }
    dispose() {
        this.toDispose.dispose();
        super.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(menu_1.MenuModelRegistry),
    __metadata("design:type", menu_1.MenuModelRegistry)
], PluginViewWidget.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], PluginViewWidget.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], PluginViewWidget.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(PluginViewWidgetIdentifier),
    __metadata("design:type", PluginViewWidgetIdentifier)
], PluginViewWidget.prototype, "options", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginViewWidget.prototype, "init", null);
PluginViewWidget = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginViewWidget);
exports.PluginViewWidget = PluginViewWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view/plugin-view-widget'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view/tree-views-main.js":
/*!**************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view/tree-views-main.js ***!
  \**************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreeViewsMainImpl = void 0;
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const plugin_view_registry_1 = __webpack_require__(/*! ./plugin-view-registry */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-registry.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const view_context_key_service_1 = __webpack_require__(/*! ./view-context-key-service */ "../../packages/plugin-ext/lib/main/browser/view/view-context-key-service.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const tree_view_widget_1 = __webpack_require__(/*! ./tree-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/tree-view-widget.js");
const plugin_view_widget_1 = __webpack_require__(/*! ./plugin-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-widget.js");
const buffer_1 = __webpack_require__(/*! @theia/core/lib/common/buffer */ "../../packages/core/lib/common/buffer.js");
const dnd_file_content_store_1 = __webpack_require__(/*! ./dnd-file-content-store */ "../../packages/plugin-ext/lib/main/browser/view/dnd-file-content-store.js");
class TreeViewsMainImpl {
    constructor(rpc, container) {
        this.container = container;
        this.treeViewProviders = new Map();
        this.toDispose = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TREE_VIEWS_EXT);
        this.viewRegistry = container.get(plugin_view_registry_1.PluginViewRegistry);
        this.contextKeys = this.container.get(view_context_key_service_1.ViewContextKeyService);
        this.widgetManager = this.container.get(browser_1.WidgetManager);
        this.fileContentStore = this.container.get(dnd_file_content_store_1.DnDFileContentStore);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $registerTreeDataProvider(treeViewId, $options) {
        this.treeViewProviders.set(treeViewId, this.viewRegistry.registerViewDataProvider(treeViewId, async ({ state, viewInfo }) => {
            const options = {
                id: treeViewId,
                manageCheckboxStateManually: $options.manageCheckboxStateManually,
                showCollapseAll: $options.showCollapseAll,
                multiSelect: $options.canSelectMany,
                dragMimeTypes: $options.dragMimeTypes,
                dropMimeTypes: $options.dropMimeTypes
            };
            const widget = await this.widgetManager.getOrCreateWidget(plugin_view_registry_1.PLUGIN_VIEW_DATA_FACTORY_ID, options);
            widget.model.viewInfo = viewInfo;
            if (state) {
                widget.restoreState(state);
                // ensure that state is completely restored
                await widget.model.refresh();
            }
            else if (!widget.model.root) {
                const root = {
                    id: '',
                    parent: undefined,
                    name: '',
                    visible: false,
                    expanded: true,
                    children: []
                };
                widget.model.root = root;
            }
            if (this.toDispose.disposed) {
                widget.model.proxy = undefined;
            }
            else {
                widget.model.proxy = this.proxy;
                this.toDispose.push(core_1.Disposable.create(() => widget.model.proxy = undefined));
                this.handleTreeEvents(widget.id, widget);
            }
            await widget.model.refresh();
            return widget;
        }));
        this.toDispose.push(core_1.Disposable.create(() => this.$unregisterTreeDataProvider(treeViewId)));
    }
    async $unregisterTreeDataProvider(treeViewId) {
        const treeDataProvider = this.treeViewProviders.get(treeViewId);
        if (treeDataProvider) {
            this.treeViewProviders.delete(treeViewId);
            treeDataProvider.dispose();
        }
    }
    async $readDroppedFile(contentId) {
        const file = this.fileContentStore.getFile(contentId);
        const buffer = await file.arrayBuffer();
        return buffer_1.BinaryBuffer.wrap(new Uint8Array(buffer));
    }
    async $refresh(treeViewId) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        const widget = viewPanel && viewPanel.widgets[0];
        if (widget instanceof tree_view_widget_1.TreeViewWidget) {
            await widget.model.refresh();
        }
    }
    // elementParentChain parameter contain a list of tree ids from root to the revealed node
    // all parents of the revealed node should be fetched and expanded in order for it to reveal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $reveal(treeViewId, elementParentChain, options) {
        const viewPanel = await this.viewRegistry.openView(treeViewId, { activate: options.focus, reveal: true });
        const widget = viewPanel && viewPanel.widgets[0];
        if (widget instanceof tree_view_widget_1.TreeViewWidget) {
            // pop last element which is the node to reveal
            const elementId = elementParentChain.pop();
            await this.expandParentChain(widget.model, elementParentChain);
            const treeNode = widget.model.getNode(elementId);
            if (treeNode) {
                if (options.expand && browser_1.ExpandableTreeNode.is(treeNode)) {
                    await widget.model.expandNode(treeNode);
                }
                if (options.select && browser_1.SelectableTreeNode.is(treeNode)) {
                    widget.model.selectNode(treeNode);
                }
            }
        }
    }
    /**
     * Expand all parents of the node to reveal from root. This should also fetch missing nodes to the frontend.
     */
    async expandParentChain(model, elementParentChain) {
        for (const elementId of elementParentChain) {
            const treeNode = model.getNode(elementId);
            if (browser_1.ExpandableTreeNode.is(treeNode)) {
                await model.expandNode(treeNode);
            }
        }
    }
    async $setMessage(treeViewId, message) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        if (viewPanel instanceof plugin_view_widget_1.PluginViewWidget) {
            viewPanel.message = message;
        }
    }
    async $setTitle(treeViewId, title) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        if (viewPanel) {
            viewPanel.title.label = title;
        }
    }
    async $setDescription(treeViewId, description) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        if (viewPanel) {
            viewPanel.description = description;
        }
    }
    async $setBadge(treeViewId, badge) {
        const viewPanel = await this.viewRegistry.getView(treeViewId);
        if (viewPanel) {
            viewPanel.badge = badge === null || badge === void 0 ? void 0 : badge.value;
            viewPanel.badgeTooltip = badge === null || badge === void 0 ? void 0 : badge.tooltip;
        }
    }
    async setChecked(treeViewWidget, changedNodes) {
        await this.proxy.$checkStateChanged(treeViewWidget.id, changedNodes.map(node => {
            var _a;
            return ({
                id: node.id,
                checked: !!((_a = node.checkboxInfo) === null || _a === void 0 ? void 0 : _a.checked)
            });
        }));
    }
    handleTreeEvents(treeViewId, treeViewWidget) {
        this.toDispose.push(treeViewWidget.model.onExpansionChanged(event => {
            this.proxy.$setExpanded(treeViewId, event.id, event.expanded);
        }));
        this.toDispose.push(treeViewWidget.model.onSelectionChanged(event => {
            this.contextKeys.view.set(treeViewId);
            this.proxy.$setSelection(treeViewId, event.map((node) => node.id));
        }));
        const updateVisible = () => this.proxy.$setVisible(treeViewId, treeViewWidget.isVisible);
        updateVisible();
        this.toDispose.push(treeViewWidget.onDidChangeVisibility(() => updateVisible()));
    }
}
exports.TreeViewsMainImpl = TreeViewsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view/tree-views-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view/view-context-key-service.js":
/*!***********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view/view-context-key-service.js ***!
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
exports.ViewContextKeyService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let ViewContextKeyService = class ViewContextKeyService {
    get view() {
        return this._view;
    }
    get viewItem() {
        return this._viewItem;
    }
    get activeViewlet() {
        return this._activeViewlet;
    }
    get activePanel() {
        return this._activePanel;
    }
    get activeAuxiliary() {
        return this._activeAuxiliary;
    }
    get focusedView() {
        return this._focusedView;
    }
    init() {
        this._view = this.contextKeyService.createKey('view', '');
        this._viewItem = this.contextKeyService.createKey('viewItem', '');
        this._activeViewlet = this.contextKeyService.createKey('activeViewlet', '');
        this._activePanel = this.contextKeyService.createKey('activePanel', '');
        this._activeAuxiliary = this.contextKeyService.createKey('activeAuxiliary', '');
        this._focusedView = this.contextKeyService.createKey('focusedView', '');
    }
    match(expression) {
        return !expression || this.contextKeyService.match(expression);
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], ViewContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ViewContextKeyService.prototype, "init", null);
ViewContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], ViewContextKeyService);
exports.ViewContextKeyService = ViewContextKeyService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view/view-context-key-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview-views/webview-views-main.js":
/*!**************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview-views/webview-views-main.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/e1f0f8f51390dea5df9096718fb6b647ed5a9534/src/vs/workbench/api/browser/mainThreadWebviewViews.ts
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
exports.WebviewViewsMainImpl = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const plugin_view_registry_1 = __webpack_require__(/*! ../view/plugin-view-registry */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-registry.js");
class WebviewViewsMainImpl {
    constructor(rpc, container, webviewsMain) {
        this.webviewsMain = webviewsMain;
        this.toDispose = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        this.webviewViews = new Map();
        this.webviewViewProviders = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WEBVIEW_VIEWS_EXT);
        this.widgetManager = container.get(browser_1.WidgetManager);
        this.pluginViewRegistry = container.get(plugin_view_registry_1.PluginViewRegistry);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $registerWebviewViewProvider(viewType, options) {
        if (this.webviewViewProviders.has(viewType)) {
            throw new Error(`View provider for ${viewType} already registered`);
        }
        const registration = await this.pluginViewRegistry.registerWebviewView(viewType, {
            resolve: async (webviewView, cancellation) => {
                const handle = webviewView.webview.identifier.id;
                this.webviewViews.set(handle, webviewView);
                this.webviewsMain.hookWebview(webviewView.webview);
                let state;
                if (webviewView.webview.state) {
                    try {
                        state = JSON.parse(webviewView.webview.state);
                        console.log(state);
                    }
                    catch (e) {
                        console.error('Could not load webview state', e, webviewView.webview.state);
                    }
                }
                if (options) {
                    webviewView.webview.options = options;
                }
                webviewView.onDidChangeVisibility(visible => {
                    this.proxy.$onDidChangeWebviewViewVisibility(handle, visible);
                });
                webviewView.onDidDispose(() => {
                    this.proxy.$disposeWebviewView(handle);
                    this.webviewViews.delete(handle);
                });
                try {
                    this.proxy.$resolveWebviewView(handle, viewType, webviewView.title, state, cancellation);
                }
                catch (error) {
                    this.logger.error(`Error resolving webview view '${viewType}': ${error}`);
                    webviewView.webview.setHTML('failed to load plugin webview view');
                }
            }
        });
        this.webviewViewProviders.set(viewType, registration);
    }
    getWebview(handle) {
        return this.widgetManager.tryGetWidget(handle);
    }
    $unregisterWebviewViewProvider(viewType) {
        const provider = this.webviewViewProviders.get(viewType);
        if (!provider) {
            throw new Error(`No view provider for ${viewType} registered`);
        }
        provider.dispose();
        this.webviewViewProviders.delete(viewType);
    }
    $setWebviewViewTitle(handle, value) {
        const webviewView = this.getWebviewView(handle);
        webviewView.title = value;
    }
    $setWebviewViewDescription(handle, value) {
        const webviewView = this.getWebviewView(handle);
        webviewView.description = value;
    }
    async $setBadge(handle, badge) {
        const webviewView = this.getWebviewView(handle);
        if (webviewView) {
            webviewView.badge = badge === null || badge === void 0 ? void 0 : badge.value;
            webviewView.badgeTooltip = badge === null || badge === void 0 ? void 0 : badge.tooltip;
        }
    }
    $show(handle, preserveFocus) {
        const webviewView = this.getWebviewView(handle);
        webviewView.show(preserveFocus);
    }
    getWebviewView(handle) {
        const webviewView = this.webviewViews.get(handle);
        if (!webviewView) {
            throw new Error(`No webview view registered for handle '${handle}'`);
        }
        return webviewView;
    }
}
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], WebviewViewsMainImpl.prototype, "logger", void 0);
exports.WebviewViewsMainImpl = WebviewViewsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview-views/webview-views-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webviews-main.js":
/*!*******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webviews-main.js ***!
  \*******************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebviewsMainImpl = void 0;
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const application_shell_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/application-shell */ "../../packages/core/lib/browser/shell/application-shell.js");
const webview_1 = __webpack_require__(/*! ./webview/webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const view_column_service_1 = __webpack_require__(/*! ./view-column-service */ "../../packages/plugin-ext/lib/main/browser/view-column-service.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const coreutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/coreutils */ "../../packages/core/shared/@phosphor/coreutils/index.js");
const hosted_plugin_1 = __webpack_require__(/*! ../../hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
const custom_editor_widget_1 = __webpack_require__(/*! ./custom-editors/custom-editor-widget */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js");
const types_impl_1 = __webpack_require__(/*! ../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
class WebviewsMainImpl {
    constructor(rpc, container) {
        this.toDispose = new disposable_1.DisposableCollection();
        this.updateViewStates = debounce(() => {
            const widgets = this.widgetManager.getWidgets(webview_1.WebviewWidget.FACTORY_ID);
            const customEditors = this.widgetManager.getWidgets(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID);
            for (const widget of widgets.concat(customEditors)) {
                if (widget instanceof webview_1.WebviewWidget) {
                    this.updateViewState(widget);
                }
            }
        }, 100);
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WEBVIEWS_EXT);
        this.shell = container.get(application_shell_1.ApplicationShell);
        this.viewColumnService = container.get(view_column_service_1.ViewColumnService);
        this.widgetManager = container.get(widget_manager_1.WidgetManager);
        this.pluginService = container.get(hosted_plugin_1.HostedPluginSupport);
        this.toDispose.push(this.shell.onDidChangeActiveWidget(() => this.updateViewStates()));
        this.toDispose.push(this.shell.onDidChangeCurrentWidget(() => this.updateViewStates()));
        this.toDispose.push(this.viewColumnService.onViewColumnChanged(() => this.updateViewStates()));
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $createWebviewPanel(panelId, viewType, title, showOptions, options) {
        const view = await this.widgetManager.getOrCreateWidget(webview_1.WebviewWidget.FACTORY_ID, { id: panelId });
        this.hookWebview(view);
        view.viewType = viewType;
        view.title.label = title;
        const { enableFindWidget, retainContextWhenHidden, enableScripts, enableForms, localResourceRoots, ...contentOptions } = options;
        view.options = { enableFindWidget, retainContextWhenHidden };
        view.setContentOptions({
            allowScripts: enableScripts,
            allowForms: enableForms,
            localResourceRoots: localResourceRoots && localResourceRoots.map(root => root.toString()),
            ...contentOptions
        });
        this.addOrReattachWidget(view, showOptions);
    }
    hookWebview(view) {
        const handle = view.identifier.id;
        this.toDispose.push(view.onDidChangeVisibility(() => this.updateViewState(view)));
        this.toDispose.push(view.onMessage(data => this.proxy.$onMessage(handle, data)));
        view.disposed.connect(() => {
            if (this.toDispose.disposed) {
                return;
            }
            this.proxy.$onDidDisposeWebviewPanel(handle);
        });
    }
    addOrReattachWidget(widget, showOptions) {
        var _a;
        const area = showOptions.area ? showOptions.area : types_impl_1.WebviewPanelTargetArea.Main;
        const widgetOptions = { area };
        let mode = 'open-to-right';
        const canOpenBeside = showOptions.viewColumn === types_impl_1.ViewColumn.Beside && (area === types_impl_1.WebviewPanelTargetArea.Main || area === types_impl_1.WebviewPanelTargetArea.Bottom);
        if (canOpenBeside) {
            const activeOrRightmostTabbar = this.shell.getTabBarFor(area);
            const ref = (_a = activeOrRightmostTabbar === null || activeOrRightmostTabbar === void 0 ? void 0 : activeOrRightmostTabbar.currentTitle) === null || _a === void 0 ? void 0 : _a.owner;
            if (ref) {
                Object.assign(widgetOptions, { ref, mode });
            }
        }
        else if (widgetOptions.area === 'main' && showOptions.viewColumn !== undefined) {
            this.viewColumnService.updateViewColumns();
            let widgetIds = this.viewColumnService.getViewColumnIds(showOptions.viewColumn);
            if (widgetIds.length > 0) {
                mode = 'tab-after';
            }
            else if (showOptions.viewColumn >= 0) {
                const columnsSize = this.viewColumnService.viewColumnsSize();
                if (columnsSize) {
                    showOptions.viewColumn = columnsSize - 1;
                    widgetIds = this.viewColumnService.getViewColumnIds(showOptions.viewColumn);
                }
            }
            const ref = this.shell.getWidgets(widgetOptions.area).find(w => !w.isHidden && widgetIds.indexOf(w.id) !== -1);
            if (ref) {
                Object.assign(widgetOptions, { ref, mode });
            }
        }
        this.shell.addWidget(widget, widgetOptions);
        if (showOptions.preserveFocus) {
            this.shell.revealWidget(widget.id);
        }
        else {
            this.shell.activateWidget(widget.id);
        }
    }
    async $disposeWebview(handle) {
        const view = await this.tryGetWebview(handle);
        if (view) {
            view.dispose();
        }
    }
    async $reveal(handle, showOptions) {
        const widget = await this.getWebview(handle);
        if (widget.isDisposed) {
            return;
        }
        if ((showOptions.viewColumn !== undefined && showOptions.viewColumn !== widget.viewState.position) || showOptions.area !== undefined) {
            this.viewColumnService.updateViewColumns();
            const columnIds = showOptions.viewColumn ? this.viewColumnService.getViewColumnIds(showOptions.viewColumn) : [];
            const area = this.shell.getAreaFor(widget);
            if (columnIds.indexOf(widget.id) === -1 || area !== showOptions.area) {
                this.addOrReattachWidget(widget, showOptions);
                return;
            }
        }
        if (showOptions.preserveFocus) {
            this.shell.revealWidget(widget.id);
        }
        else {
            this.shell.activateWidget(widget.id);
        }
    }
    async $setTitle(handle, value) {
        const webview = await this.getWebview(handle);
        webview.title.label = value;
    }
    async $setBadge(handle, badge) {
        const webview = await this.getWebview(handle);
        if (webview) {
            webview.badge = badge === null || badge === void 0 ? void 0 : badge.value;
            webview.badgeTooltip = badge === null || badge === void 0 ? void 0 : badge.tooltip;
        }
    }
    async $setIconPath(handle, iconUrl) {
        const webview = await this.getWebview(handle);
        webview.setIconUrl(iconUrl);
    }
    async $setHtml(handle, value) {
        const webview = await this.getWebview(handle);
        webview.setHTML(value);
    }
    async $setOptions(handle, options) {
        const webview = await this.getWebview(handle);
        const { enableScripts, enableForms, localResourceRoots, ...contentOptions } = options;
        webview.setContentOptions({
            allowScripts: enableScripts,
            allowForms: enableForms,
            localResourceRoots: localResourceRoots && localResourceRoots.map(root => root.toString()),
            ...contentOptions
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $postMessage(handle, value) {
        const webview = await this.getWebview(handle);
        webview.sendMessage(value);
        return true;
    }
    $registerSerializer(viewType) {
        this.pluginService.registerWebviewReviver(viewType, widget => this.restoreWidget(widget));
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregisterSerializer(viewType)));
    }
    $unregisterSerializer(viewType) {
        this.pluginService.unregisterWebviewReviver(viewType);
    }
    async restoreWidget(widget) {
        this.hookWebview(widget);
        const handle = widget.identifier.id;
        const title = widget.title.label;
        let state = undefined;
        if (widget.state) {
            try {
                state = JSON.parse(widget.state);
            }
            catch {
                // noop
            }
        }
        const options = widget.options;
        const { allowScripts, allowForms, localResourceRoots, ...contentOptions } = widget.contentOptions;
        this.updateViewState(widget);
        await this.proxy.$deserializeWebviewPanel(handle, widget.viewType, title, state, widget.viewState, {
            enableScripts: allowScripts,
            enableForms: allowForms,
            localResourceRoots: localResourceRoots && localResourceRoots.map(root => vscode_uri_1.URI.parse(root)),
            ...contentOptions,
            ...options
        });
    }
    updateViewState(widget, viewColumn) {
        const viewState = {
            active: this.shell.activeWidget === widget,
            visible: !widget.isHidden,
            position: viewColumn || 0
        };
        if (typeof viewColumn !== 'number') {
            this.viewColumnService.updateViewColumns();
            viewState.position = this.viewColumnService.getViewColumn(widget.id) || 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (coreutils_1.JSONExt.deepEqual(viewState, widget.viewState)) {
            return;
        }
        widget.viewState = viewState;
        this.proxy.$onDidChangeWebviewPanelViewState(widget.identifier.id, widget.viewState);
    }
    async getWebview(viewId) {
        const webview = await this.tryGetWebview(viewId);
        if (!webview) {
            throw new Error(`Unknown Webview: ${viewId}`);
        }
        return webview;
    }
    async tryGetWebview(id) {
        const webview = await this.widgetManager.getWidget(webview_1.WebviewWidget.FACTORY_ID, { id })
            || await this.widgetManager.getWidget(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID, { id });
        return webview;
    }
}
exports.WebviewsMainImpl = WebviewsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webviews-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/window-state-main.js":
/*!***********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/window-state-main.js ***!
  \***********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WindowStateMain = void 0;
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const external_uri_service_1 = __webpack_require__(/*! @theia/core/lib/browser/external-uri-service */ "../../packages/core/lib/browser/external-uri-service.js");
class WindowStateMain {
    constructor(rpc, container) {
        this.toDispose = new disposable_1.DisposableCollection();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WINDOW_STATE_EXT);
        this.openerService = container.get(opener_service_1.OpenerService);
        this.externalUriService = container.get(external_uri_service_1.ExternalUriService);
        const fireDidFocus = () => this.onFocusChanged(true);
        window.addEventListener('focus', fireDidFocus);
        this.toDispose.push(disposable_1.Disposable.create(() => window.removeEventListener('focus', fireDidFocus)));
        const fireDidBlur = () => this.onFocusChanged(false);
        window.addEventListener('blur', fireDidBlur);
        this.toDispose.push(disposable_1.Disposable.create(() => window.removeEventListener('blur', fireDidBlur)));
    }
    dispose() {
        this.toDispose.dispose();
    }
    onFocusChanged(focused) {
        this.proxy.$onWindowStateChanged(focused);
    }
    async $openUri(uriComponent) {
        const uri = vscode_uri_1.URI.revive(uriComponent);
        const url = new uri_1.default(encodeURI(uri.toString(true)));
        try {
            await (0, opener_service_1.open)(this.openerService, url);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async $asExternalUri(uriComponents) {
        const uri = vscode_uri_1.URI.revive(uriComponents);
        const resolved = await this.externalUriService.resolve(new uri_1.default(uri));
        return vscode_uri_1.URI.parse(resolved.toString());
    }
}
exports.WindowStateMain = WindowStateMain;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/window-state-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/workspace-main.js":
/*!********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/workspace-main.js ***!
  \********************************************************************/
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
exports.TextContentResource = exports.TextContentResourceResolver = exports.WorkspaceMainImpl = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const file_search_service_1 = __webpack_require__(/*! @theia/file-search/lib/common/file-search-service */ "../../packages/file-search/lib/common/file-search-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const plugin_protocol_1 = __webpack_require__(/*! ../../common/plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const search_in_workspace_service_1 = __webpack_require__(/*! @theia/search-in-workspace/lib/browser/search-in-workspace-service */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-service.js");
const monaco_quick_input_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-quick-input-service */ "../../packages/monaco/lib/browser/monaco-quick-input-service.js");
const request_1 = __webpack_require__(/*! @theia/core/shared/@theia/request */ "../../packages/core/shared/@theia/request/index.js");
class WorkspaceMainImpl {
    constructor(rpc, container) {
        this.toDispose = new disposable_1.DisposableCollection();
        this.workspaceSearch = new Set();
        this.canonicalUriProviders = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WORKSPACE_EXT);
        this.storageProxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.STORAGE_EXT);
        this.monacoQuickInputService = container.get(monaco_quick_input_service_1.MonacoQuickInputService);
        this.fileSearchService = container.get(file_search_service_1.FileSearchService);
        this.searchInWorkspaceService = container.get(search_in_workspace_service_1.SearchInWorkspaceService);
        this.resourceResolver = container.get(TextContentResourceResolver);
        this.pluginServer = container.get(plugin_protocol_1.PluginServer);
        this.requestService = container.get(request_1.RequestService);
        this.workspaceService = container.get(browser_1.WorkspaceService);
        this.canonicalUriService = container.get(browser_1.CanonicalUriService);
        this.workspaceTrustService = container.get(browser_1.WorkspaceTrustService);
        this.fsPreferences = container.get(browser_2.FileSystemPreferences);
        this.processWorkspaceFoldersChanged(this.workspaceService.tryGetRoots().map(root => root.resource.toString()));
        this.toDispose.push(this.workspaceService.onWorkspaceChanged(roots => {
            this.processWorkspaceFoldersChanged(roots.map(root => root.resource.toString()));
        }));
        this.toDispose.push(this.workspaceService.onWorkspaceLocationChanged(stat => {
            this.proxy.$onWorkspaceLocationChanged(stat);
        }));
        this.workspaceTrustService.getWorkspaceTrust().then(trust => this.proxy.$onWorkspaceTrustChanged(trust));
    }
    dispose() {
        this.toDispose.dispose();
    }
    $resolveProxy(url) {
        return this.requestService.resolveProxy(url);
    }
    async processWorkspaceFoldersChanged(roots) {
        var _a;
        if (this.isAnyRootChanged(roots) === false) {
            return;
        }
        this.roots = roots;
        this.proxy.$onWorkspaceFoldersChanged({ roots });
        const keyValueStorageWorkspacesData = await this.pluginServer.getAllStorageValues({
            workspace: (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.toString(),
            roots: this.workspaceService.tryGetRoots().map(root => root.resource.toString())
        });
        this.storageProxy.$updatePluginsWorkspaceData(keyValueStorageWorkspacesData);
    }
    isAnyRootChanged(roots) {
        if (!this.roots || this.roots.length !== roots.length) {
            return true;
        }
        return this.roots.some((root, index) => root !== roots[index]);
    }
    async $getWorkspace() {
        return this.workspaceService.workspace;
    }
    $pickWorkspaceFolder(options) {
        return new Promise((resolve, reject) => {
            // Return undefined if workspace root is not set
            if (!this.roots || !this.roots.length) {
                resolve(undefined);
                return;
            }
            // Active before appearing the pick menu
            const activeElement = window.document.activeElement;
            // WorkspaceFolder to be returned
            let returnValue;
            const items = this.roots.map(root => {
                const rootUri = vscode_uri_1.URI.parse(root);
                const rootPathName = rootUri.path.substring(rootUri.path.lastIndexOf('/') + 1);
                return {
                    label: rootPathName,
                    detail: rootUri.path,
                    execute: () => {
                        returnValue = {
                            uri: rootUri,
                            name: rootPathName,
                            index: 0
                        };
                    }
                };
            });
            // Show pick menu
            this.monacoQuickInputService.showQuickPick(items, {
                onDidHide: () => {
                    if (activeElement) {
                        activeElement.focus({ preventScroll: true });
                    }
                    resolve(returnValue);
                }
            });
        });
    }
    async $startFileSearch(includePattern, includeFolderUri, excludePatternOrDisregardExcludes, maxResults) {
        const roots = {};
        const rootUris = includeFolderUri ? [includeFolderUri] : this.roots;
        for (const rootUri of rootUris) {
            roots[rootUri] = {};
        }
        const opts = {
            rootOptions: roots,
            useGitIgnore: excludePatternOrDisregardExcludes !== false
        };
        if (includePattern) {
            opts.includePatterns = [includePattern];
        }
        if (typeof excludePatternOrDisregardExcludes === 'string') {
            opts.excludePatterns = [excludePatternOrDisregardExcludes];
        }
        if (excludePatternOrDisregardExcludes !== false) {
            for (const rootUri of rootUris) {
                const filesExclude = this.fsPreferences.get('files.exclude', undefined, rootUri);
                if (filesExclude) {
                    for (const excludePattern in filesExclude) {
                        if (filesExclude[excludePattern]) {
                            const rootOptions = roots[rootUri];
                            const rootExcludePatterns = rootOptions.excludePatterns || [];
                            rootExcludePatterns.push(excludePattern);
                            rootOptions.excludePatterns = rootExcludePatterns;
                        }
                    }
                }
            }
        }
        if (typeof maxResults === 'number') {
            opts.limit = maxResults;
        }
        const uriStrs = await this.fileSearchService.find('', opts);
        return uriStrs.map(uriStr => vscode_uri_1.URI.parse(uriStr));
    }
    async $findTextInFiles(query, options, searchRequestId, token = core_1.CancellationToken.None) {
        const maxHits = options.maxResults ? options.maxResults : 150;
        const excludes = options.exclude ? (typeof options.exclude === 'string' ? options.exclude : options.exclude.pattern) : undefined;
        const includes = options.include ? (typeof options.include === 'string' ? options.include : options.include.pattern) : undefined;
        let canceledRequest = false;
        return new Promise(resolve => {
            let matches = 0;
            const what = query.pattern;
            this.searchInWorkspaceService.searchWithCallback(what, this.roots, {
                onResult: (searchId, result) => {
                    if (canceledRequest) {
                        return;
                    }
                    const hasSearch = this.workspaceSearch.has(searchId);
                    if (!hasSearch) {
                        this.workspaceSearch.add(searchId);
                        token.onCancellationRequested(() => {
                            this.searchInWorkspaceService.cancel(searchId);
                            canceledRequest = true;
                        });
                    }
                    if (token.isCancellationRequested) {
                        this.searchInWorkspaceService.cancel(searchId);
                        canceledRequest = true;
                        return;
                    }
                    if (result && result.matches && result.matches.length) {
                        while ((matches + result.matches.length) > maxHits) {
                            result.matches.splice(result.matches.length - 1, 1);
                        }
                        this.proxy.$onTextSearchResult(searchRequestId, false, result);
                        matches += result.matches.length;
                        if (maxHits <= matches) {
                            this.searchInWorkspaceService.cancel(searchId);
                        }
                    }
                },
                onDone: (searchId, _error) => {
                    const hasSearch = this.workspaceSearch.has(searchId);
                    if (hasSearch) {
                        this.searchInWorkspaceService.cancel(searchId);
                        this.workspaceSearch.delete(searchId);
                    }
                    this.proxy.$onTextSearchResult(searchRequestId, true);
                    if (maxHits <= matches) {
                        resolve({ limitHit: true });
                    }
                    else {
                        resolve({ limitHit: false });
                    }
                }
            }, {
                useRegExp: query.isRegExp,
                matchCase: query.isCaseSensitive,
                matchWholeWord: query.isWordMatch,
                exclude: excludes ? [excludes] : undefined,
                include: includes ? [includes] : undefined,
                maxResults: maxHits
            });
        });
    }
    async $registerTextDocumentContentProvider(scheme) {
        this.resourceResolver.registerContentProvider(scheme, this.proxy);
        this.toDispose.push(disposable_1.Disposable.create(() => this.resourceResolver.unregisterContentProvider(scheme)));
    }
    $unregisterTextDocumentContentProvider(scheme) {
        this.resourceResolver.unregisterContentProvider(scheme);
    }
    $onTextDocumentContentChange(uri, content) {
        this.resourceResolver.onContentChange(uri, content);
    }
    async $updateWorkspaceFolders(start, deleteCount, ...rootsToAdd) {
        await this.workspaceService.spliceRoots(start, deleteCount, ...rootsToAdd.map(root => new uri_1.default(root)));
    }
    async $requestWorkspaceTrust(_options) {
        return this.workspaceTrustService.requestWorkspaceTrust();
    }
    async $registerCanonicalUriProvider(scheme) {
        this.canonicalUriProviders.set(scheme, this.canonicalUriService.registerCanonicalUriProvider(scheme, {
            provideCanonicalUri: async (uri, targetScheme, token) => {
                const canonicalUri = await this.proxy.$provideCanonicalUri(uri.toString(), targetScheme, core_1.CancellationToken.None);
                return (0, core_1.isUndefined)(uri) ? undefined : new uri_1.default(canonicalUri);
            },
            dispose: () => {
                this.proxy.$disposeCanonicalUriProvider(scheme);
            },
        }));
    }
    $unregisterCanonicalUriProvider(scheme) {
        const disposable = this.canonicalUriProviders.get(scheme);
        if (disposable) {
            this.canonicalUriProviders.delete(scheme);
            disposable.dispose();
        }
        else {
            console.warn(`No canonical uri provider registered for '${scheme}'`);
        }
    }
    async $getCanonicalUri(uri, targetScheme, token) {
        const canonicalUri = await this.canonicalUriService.provideCanonicalUri(new uri_1.default(uri), targetScheme, token);
        return (0, core_1.isUndefined)(canonicalUri) ? undefined : canonicalUri.toString();
    }
}
exports.WorkspaceMainImpl = WorkspaceMainImpl;
let TextContentResourceResolver = class TextContentResourceResolver {
    constructor() {
        // Resource providers for different schemes
        this.providers = new Map();
        // Opened resources
        this.resources = new Map();
    }
    async resolve(uri) {
        const provider = this.providers.get(uri.scheme);
        if (provider) {
            return provider.provideResource(uri);
        }
        throw new Error(`Unable to find Text Content Resource Provider for scheme '${uri.scheme}'`);
    }
    registerContentProvider(scheme, proxy) {
        if (this.providers.has(scheme)) {
            throw new Error(`Text Content Resource Provider for scheme '${scheme}' is already registered`);
        }
        const instance = this;
        this.providers.set(scheme, {
            provideResource: (uri) => {
                let resource = instance.resources.get(uri.toString());
                if (resource) {
                    return resource;
                }
                resource = new TextContentResource(uri, proxy, {
                    dispose() {
                        instance.resources.delete(uri.toString());
                    }
                });
                instance.resources.set(uri.toString(), resource);
                return resource;
            }
        });
    }
    unregisterContentProvider(scheme) {
        if (!this.providers.delete(scheme)) {
            throw new Error(`Text Content Resource Provider for scheme '${scheme}' has not been registered`);
        }
    }
    onContentChange(uri, content) {
        const resource = this.resources.get(uri);
        if (resource) {
            resource.setContent(content);
        }
    }
};
TextContentResourceResolver = __decorate([
    (0, inversify_1.injectable)()
], TextContentResourceResolver);
exports.TextContentResourceResolver = TextContentResourceResolver;
class TextContentResource {
    constructor(uri, proxy, disposable) {
        this.uri = uri;
        this.proxy = proxy;
        this.disposable = disposable;
        this.onDidChangeContentsEmitter = new core_1.Emitter();
        this.onDidChangeContents = this.onDidChangeContentsEmitter.event;
    }
    async readContents(options) {
        if (this.cache) {
            const content = this.cache;
            this.cache = undefined;
            return content;
        }
        else {
            const content = await this.proxy.$provideTextDocumentContent(this.uri.toString());
            return content !== null && content !== void 0 ? content : '';
        }
    }
    dispose() {
        this.disposable.dispose();
    }
    setContent(content) {
        this.cache = content;
        this.onDidChangeContentsEmitter.fire(undefined);
    }
}
exports.TextContentResource = TextContentResource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/workspace-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/common/plugin-paths-protocol.js":
/*!**************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/common/plugin-paths-protocol.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginPathsService = exports.pluginPathsServicePath = void 0;
exports.pluginPathsServicePath = '/services/plugin-paths';
// Service to create plugin configuration folders for different purpose.
exports.PluginPathsService = Symbol('PluginPathsService');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/common/plugin-paths-protocol'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/index.js":
/*!************************************************!*\
  !*** ../../packages/task/lib/browser/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
__exportStar(__webpack_require__(/*! ./task-service */ "../../packages/task/lib/browser/task-service.js"), exports);
__exportStar(__webpack_require__(/*! ./task-contribution */ "../../packages/task/lib/browser/task-contribution.js"), exports);
__exportStar(__webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js"), exports);
__exportStar(__webpack_require__(/*! ./task-problem-matcher-registry */ "../../packages/task/lib/browser/task-problem-matcher-registry.js"), exports);
__exportStar(__webpack_require__(/*! ./task-problem-pattern-registry */ "../../packages/task/lib/browser/task-problem-pattern-registry.js"), exports);
__exportStar(__webpack_require__(/*! ./task-schema-updater */ "../../packages/task/lib/browser/task-schema-updater.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/dialogs/style/modal-notification.css":
/*!*********************************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/dialogs/style/modal-notification.css ***!
  \*********************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
.modal-Notification {
  pointer-events: all;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  flex-direction: row;
  -webkit-justify-content: center;
  justify-content: center;
  clear: both;
  box-sizing: border-box;
  position: relative;
  min-width: 200px;
  max-width: min(66vw, 800px);
  background-color: var(--theia-editorWidget-background);
  min-height: 35px;
  margin-bottom: 1px;
  color: var(--theia-editorWidget-foreground);
}

.modal-Notification .icon {
  display: inline-block;
  font-size: 20px;
  padding: 5px 0;
  width: 35px;
  order: 1;
}

.modal-Notification .icon .codicon {
  line-height: inherit;
  vertical-align: middle;
  font-size: calc(var(--theia-ui-padding) * 5);
  color: var(--theia-editorInfo-foreground);
}

.modal-Notification .icon .error {
  color: var(--theia-editorError-foreground);
}

.modal-Notification .icon .warning {
  color: var(--theia-editorWarning-foreground);
}

.modal-Notification .text {
  order: 2;
  display: inline-block;
  max-height: min(66vh, 600px);
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  align-self: center;
  flex: 1 100%;
  padding: 10px;
  overflow: auto;
  white-space: pre-wrap;
}

.modal-Notification .text > p {
  margin: 0;
  font-size: var(--theia-ui-font-size1);
  font-family: var(--theia-ui-font-family);
  vertical-align: middle;
}

.modal-Notification .buttons {
  display: flex;
  flex-direction: row;
  order: 3;
  white-space: nowrap;
  align-self: flex-end;
  height: 40px;
}

.modal-Notification .buttons > button {
  background-color: var(--theia-button-background);
  color: var(--theia-button-foreground);
  border: none;
  border-radius: 0;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  padding: 0 10px;
  margin: 0;
  font-size: var(--theia-ui-font-size1);
  outline: none;
  cursor: pointer;
}

.modal-Notification .buttons > button:hover {
  background-color: var(--theia-button-hoverBackground);
}

.modal-Notification .detail {
  align-self: center;
  order: 3;
  flex: 1 100%;
  color: var(--theia-descriptionForeground);
}

.modal-Notification .detail > p {
  margin: calc(var(--theia-ui-padding) * 2) 0px 0px 0px;
}

.modal-Notification .text {
  padding: calc(var(--theia-ui-padding) * 1.5);
}
`, "",{"version":3,"sources":["webpack://./../../packages/plugin-ext/src/main/browser/dialogs/style/modal-notification.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;AACjF;EACE,mBAAmB;EACnB,yBAAyB;EACzB,sBAAsB;EACtB,qBAAqB;EACrB,iBAAiB;EACjB,aAAa;EACb,mBAAmB;EACnB,+BAA+B;EAC/B,uBAAuB;EACvB,WAAW;EACX,sBAAsB;EACtB,kBAAkB;EAClB,gBAAgB;EAChB,2BAA2B;EAC3B,sDAAsD;EACtD,gBAAgB;EAChB,kBAAkB;EAClB,2CAA2C;AAC7C;;AAEA;EACE,qBAAqB;EACrB,eAAe;EACf,cAAc;EACd,WAAW;EACX,QAAQ;AACV;;AAEA;EACE,oBAAoB;EACpB,sBAAsB;EACtB,4CAA4C;EAC5C,yCAAyC;AAC3C;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,4CAA4C;AAC9C;;AAEA;EACE,QAAQ;EACR,qBAAqB;EACrB,4BAA4B;EAC5B,yBAAyB;EACzB,sBAAsB;EACtB,qBAAqB;EACrB,iBAAiB;EACjB,kBAAkB;EAClB,YAAY;EACZ,aAAa;EACb,cAAc;EACd,qBAAqB;AACvB;;AAEA;EACE,SAAS;EACT,qCAAqC;EACrC,wCAAwC;EACxC,sBAAsB;AACxB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,QAAQ;EACR,mBAAmB;EACnB,oBAAoB;EACpB,YAAY;AACd;;AAEA;EACE,gDAAgD;EAChD,qCAAqC;EACrC,YAAY;EACZ,gBAAgB;EAChB,kBAAkB;EAClB,qBAAqB;EACrB,qBAAqB;EACrB,eAAe;EACf,SAAS;EACT,qCAAqC;EACrC,aAAa;EACb,eAAe;AACjB;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,kBAAkB;EAClB,QAAQ;EACR,YAAY;EACZ,yCAAyC;AAC3C;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,4CAA4C;AAC9C","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 Red Hat, Inc. and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n.modal-Notification {\n  pointer-events: all;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  display: flex;\n  flex-direction: row;\n  -webkit-justify-content: center;\n  justify-content: center;\n  clear: both;\n  box-sizing: border-box;\n  position: relative;\n  min-width: 200px;\n  max-width: min(66vw, 800px);\n  background-color: var(--theia-editorWidget-background);\n  min-height: 35px;\n  margin-bottom: 1px;\n  color: var(--theia-editorWidget-foreground);\n}\n\n.modal-Notification .icon {\n  display: inline-block;\n  font-size: 20px;\n  padding: 5px 0;\n  width: 35px;\n  order: 1;\n}\n\n.modal-Notification .icon .codicon {\n  line-height: inherit;\n  vertical-align: middle;\n  font-size: calc(var(--theia-ui-padding) * 5);\n  color: var(--theia-editorInfo-foreground);\n}\n\n.modal-Notification .icon .error {\n  color: var(--theia-editorError-foreground);\n}\n\n.modal-Notification .icon .warning {\n  color: var(--theia-editorWarning-foreground);\n}\n\n.modal-Notification .text {\n  order: 2;\n  display: inline-block;\n  max-height: min(66vh, 600px);\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n  user-select: text;\n  align-self: center;\n  flex: 1 100%;\n  padding: 10px;\n  overflow: auto;\n  white-space: pre-wrap;\n}\n\n.modal-Notification .text > p {\n  margin: 0;\n  font-size: var(--theia-ui-font-size1);\n  font-family: var(--theia-ui-font-family);\n  vertical-align: middle;\n}\n\n.modal-Notification .buttons {\n  display: flex;\n  flex-direction: row;\n  order: 3;\n  white-space: nowrap;\n  align-self: flex-end;\n  height: 40px;\n}\n\n.modal-Notification .buttons > button {\n  background-color: var(--theia-button-background);\n  color: var(--theia-button-foreground);\n  border: none;\n  border-radius: 0;\n  text-align: center;\n  text-decoration: none;\n  display: inline-block;\n  padding: 0 10px;\n  margin: 0;\n  font-size: var(--theia-ui-font-size1);\n  outline: none;\n  cursor: pointer;\n}\n\n.modal-Notification .buttons > button:hover {\n  background-color: var(--theia-button-hoverBackground);\n}\n\n.modal-Notification .detail {\n  align-self: center;\n  order: 3;\n  flex: 1 100%;\n  color: var(--theia-descriptionForeground);\n}\n\n.modal-Notification .detail > p {\n  margin: calc(var(--theia-ui-padding) * 2) 0px 0px 0px;\n}\n\n.modal-Notification .text {\n  padding: calc(var(--theia-ui-padding) * 1.5);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/plugin-ext/src/main/browser/dialogs/style/modal-notification.css":
/*!***************************************************************************************!*\
  !*** ../../packages/plugin-ext/src/main/browser/dialogs/style/modal-notification.css ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_modal_notification_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../../node_modules/css-loader/dist/cjs.js!./modal-notification.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/dialogs/style/modal-notification.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_modal_notification_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_modal_notification_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_plugin-ext_lib_hosted_browser_hosted-plugin_js.js.map