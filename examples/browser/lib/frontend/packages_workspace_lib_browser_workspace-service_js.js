(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_workspace_lib_browser_workspace-service_js"],{

/***/ "../../packages/core/lib/common/window.js":
/*!************************************************!*\
  !*** ../../packages/core/lib/common/window.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
exports.DEFAULT_WINDOW_HASH = void 0;
/**
 * The window hash value that is used to spawn a new default window.
 */
exports.DEFAULT_WINDOW_HASH = '!empty';

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/window'] = this;


/***/ }),

/***/ "../../packages/core/shared/ajv/index.js":
/*!***********************************************!*\
  !*** ../../packages/core/shared/ajv/index.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ajv */ "../../node_modules/ajv/lib/ajv.js");
;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/ajv'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/index.js":
/*!******************************************************!*\
  !*** ../../packages/filesystem/lib/browser/index.js ***!
  \******************************************************/
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
__exportStar(__webpack_require__(/*! ./location */ "../../packages/filesystem/lib/browser/location/index.js"), exports);
__exportStar(__webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js"), exports);
__exportStar(__webpack_require__(/*! ./file-dialog */ "../../packages/filesystem/lib/browser/file-dialog/index.js"), exports);
__exportStar(__webpack_require__(/*! ./filesystem-preferences */ "../../packages/filesystem/lib/browser/filesystem-preferences.js"), exports);
__exportStar(__webpack_require__(/*! ./file-resource */ "../../packages/filesystem/lib/browser/file-resource.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/browser/workspace-preferences.js":
/*!*********************************************************************!*\
  !*** ../../packages/workspace/lib/browser/workspace-preferences.js ***!
  \*********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindWorkspacePreferences = exports.createWorkspacePreferences = exports.WorkspacePreferences = exports.WorkspacePreferenceContribution = exports.workspacePreferenceSchema = void 0;
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.workspacePreferenceSchema = {
    type: 'object',
    properties: {
        'workspace.preserveWindow': {
            description: nls_1.nls.localize('theia/workspace/preserveWindow', 'Enable opening workspaces in current window.'),
            type: 'boolean',
            default: false
        },
    }
};
exports.WorkspacePreferenceContribution = Symbol('WorkspacePreferenceContribution');
exports.WorkspacePreferences = Symbol('WorkspacePreferences');
function createWorkspacePreferences(preferences, schema = exports.workspacePreferenceSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createWorkspacePreferences = createWorkspacePreferences;
function bindWorkspacePreferences(bind) {
    bind(exports.WorkspacePreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(preferences_1.PreferenceService);
        const contribution = ctx.container.get(exports.WorkspacePreferenceContribution);
        return createWorkspacePreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.WorkspacePreferenceContribution).toConstantValue({ schema: exports.workspacePreferenceSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.WorkspacePreferenceContribution);
}
exports.bindWorkspacePreferences = bindWorkspacePreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/browser/workspace-preferences'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/browser/workspace-schema-updater.js":
/*!************************************************************************!*\
  !*** ../../packages/workspace/lib/browser/workspace-schema-updater.js ***!
  \************************************************************************/
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
exports.workspaceSchema = exports.workspaceSchemaId = exports.WorkspaceSchema = exports.WorkspaceSchemaUpdater = exports.AddKeyMessage = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const common_2 = __webpack_require__(/*! ../common */ "../../packages/workspace/lib/common/index.js");
var AddKeyMessage;
(function (AddKeyMessage) {
    AddKeyMessage.is = (message) => !!message && message.schema !== undefined;
})(AddKeyMessage = exports.AddKeyMessage || (exports.AddKeyMessage = {}));
let WorkspaceSchemaUpdater = class WorkspaceSchemaUpdater {
    constructor() {
        this.uri = new uri_1.default(exports.workspaceSchemaId);
        this.editQueue = [];
        this.safeToHandleQueue = new promise_util_1.Deferred();
    }
    init() {
        this.inmemoryResources.add(this.uri, JSON.stringify(exports.workspaceSchema));
        this.safeToHandleQueue.resolve();
    }
    registerSchemas(context) {
        context.registerSchema({
            fileMatch: this.workspaceFileService.getWorkspaceFileExtensions(true),
            url: this.uri.toString()
        });
    }
    async retrieveCurrent() {
        const current = await this.inmemoryResources.resolve(this.uri).readContents();
        const content = JSON.parse(current);
        if (!WorkspaceSchema.is(content)) {
            throw new Error('Failed to retrieve current workspace schema.');
        }
        return content;
    }
    async updateSchema(message) {
        const doHandle = this.editQueue.length === 0;
        const deferred = new promise_util_1.Deferred();
        this.editQueue.push({ ...message, deferred });
        if (doHandle) {
            this.handleQueue();
        }
        return deferred.promise;
    }
    async handleQueue() {
        await this.safeToHandleQueue.promise;
        this.safeToHandleQueue = new promise_util_1.Deferred();
        const cache = await this.retrieveCurrent();
        while (this.editQueue.length) {
            const nextMessage = this.editQueue.shift();
            if (AddKeyMessage.is(nextMessage)) {
                this.addKey(nextMessage, cache);
            }
            else if (nextMessage) {
                this.removeKey(nextMessage, cache);
            }
        }
        this.inmemoryResources.update(this.uri, JSON.stringify(cache));
        this.safeToHandleQueue.resolve();
    }
    addKey({ key, schema, deferred }, cache) {
        if (key in cache.properties) {
            return deferred.resolve(false);
        }
        cache.properties[key] = schema;
        deferred.resolve(true);
    }
    removeKey({ key, deferred }, cache) {
        const canDelete = !cache.required.includes(key);
        if (!canDelete) {
            return deferred.resolve(false);
        }
        const keyPresent = delete cache.properties[key];
        deferred.resolve(keyPresent);
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.InMemoryResources),
    __metadata("design:type", common_1.InMemoryResources)
], WorkspaceSchemaUpdater.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.WorkspaceFileService),
    __metadata("design:type", common_2.WorkspaceFileService)
], WorkspaceSchemaUpdater.prototype, "workspaceFileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspaceSchemaUpdater.prototype, "init", null);
WorkspaceSchemaUpdater = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceSchemaUpdater);
exports.WorkspaceSchemaUpdater = WorkspaceSchemaUpdater;
var WorkspaceSchema;
(function (WorkspaceSchema) {
    function is(candidate) {
        return (0, common_1.isObject)(candidate)
            && typeof candidate.properties === 'object'
            && (0, common_1.isArray)(candidate.required);
    }
    WorkspaceSchema.is = is;
})(WorkspaceSchema = exports.WorkspaceSchema || (exports.WorkspaceSchema = {}));
exports.workspaceSchemaId = 'vscode://schemas/workspace';
exports.workspaceSchema = {
    $id: exports.workspaceSchemaId,
    type: 'object',
    title: 'Workspace File',
    required: ['folders'],
    default: { folders: [{ path: '' }], settings: {} },
    properties: {
        folders: {
            description: 'Root folders in the workspace',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    path: {
                        type: 'string',
                    }
                },
                required: ['path']
            }
        }
    },
    allowComments: true,
    allowTrailingCommas: true,
};

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/browser/workspace-schema-updater'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/browser/workspace-service.js":
/*!*****************************************************************!*\
  !*** ../../packages/workspace/lib/browser/workspace-service.js ***!
  \*****************************************************************/
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
exports.WorkspaceData = exports.WorkspaceService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/workspace/lib/common/index.js");
const window_service_1 = __webpack_require__(/*! @theia/core/lib/browser/window/window-service */ "../../packages/core/lib/browser/window/window-service.js");
const window_1 = __webpack_require__(/*! @theia/core/lib/common/window */ "../../packages/core/lib/common/window.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const workspace_preferences_1 = __webpack_require__(/*! ./workspace-preferences */ "../../packages/workspace/lib/browser/workspace-preferences.js");
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const Ajv = __webpack_require__(/*! @theia/core/shared/ajv */ "../../packages/core/shared/ajv/index.js");
const files_1 = __webpack_require__(/*! @theia/filesystem/lib/common/files */ "../../packages/filesystem/lib/common/files.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const window_title_service_1 = __webpack_require__(/*! @theia/core/lib/browser/window/window-title-service */ "../../packages/core/lib/browser/window/window-title-service.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const workspace_schema_updater_1 = __webpack_require__(/*! ./workspace-schema-updater */ "../../packages/workspace/lib/browser/workspace-schema-updater.js");
const frontend_application_state_1 = __webpack_require__(/*! @theia/core/lib/common/frontend-application-state */ "../../packages/core/lib/common/frontend-application-state.js");
/**
 * The workspace service.
 */
let WorkspaceService = class WorkspaceService {
    constructor() {
        this._roots = [];
        this.deferredRoots = new promise_util_1.Deferred();
        this._ready = new promise_util_1.Deferred();
        this.onWorkspaceChangeEmitter = new core_1.Emitter();
        this.onWorkspaceLocationChangedEmitter = new core_1.Emitter();
        this.toDisposeOnWorkspace = new core_1.DisposableCollection();
        this.rootWatchers = new Map();
    }
    get ready() {
        return this._ready.promise;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const wsUriString = await this.getDefaultWorkspaceUri();
        const wsStat = await this.toFileStat(wsUriString);
        await this.setWorkspace(wsStat);
        this.fileService.onDidFilesChange(event => {
            if (this._workspace && this._workspace.isFile && event.contains(this._workspace.resource)) {
                this.updateWorkspace();
            }
        });
        this.fsPreferences.onPreferenceChanged(event => {
            if (event.preferenceName === 'files.watcherExclude') {
                this.refreshRootWatchers();
            }
        });
        this._ready.resolve();
    }
    /**
     * Resolves to the default workspace URI as string.
     *
     * The default implementation tries to extract the default workspace location
     * from the `window.location.hash`, then falls-back to the most recently
     * used workspace root from the server.
     *
     * It is not ensured that the resolved workspace URI is valid, it can point
     * to a non-existing location.
     */
    getDefaultWorkspaceUri() {
        return this.doGetDefaultWorkspaceUri();
    }
    async doGetDefaultWorkspaceUri() {
        // If an empty window is explicitly requested do not restore a previous workspace.
        // Note: `window.location.hash` includes leading "#" if non-empty.
        if (window.location.hash === `#${window_1.DEFAULT_WINDOW_HASH}`) {
            window.location.hash = '';
            return undefined;
        }
        // Prefer the workspace path specified as the URL fragment, if present.
        if (window.location.hash.length > 1) {
            // Remove the leading # and decode the URI.
            const wpPath = decodeURI(window.location.hash.substring(1));
            const workspaceUri = new uri_1.default().withPath(wpPath).withScheme('file');
            let workspaceStat;
            try {
                workspaceStat = await this.fileService.resolve(workspaceUri);
            }
            catch { }
            if (workspaceStat && !workspaceStat.isDirectory && !this.isWorkspaceFile(workspaceStat)) {
                this.messageService.error(`Not a valid workspace file: ${workspaceUri}`);
                return undefined;
            }
            return workspaceUri.toString();
        }
        else {
            // Else, ask the server for its suggested workspace (usually the one
            // specified on the CLI, or the most recent).
            return this.server.getMostRecentlyUsedWorkspace();
        }
    }
    /**
     * Set the URL fragment to the given workspace path.
     */
    setURLFragment(workspacePath) {
        window.location.hash = encodeURI(workspacePath);
    }
    get roots() {
        return this.deferredRoots.promise;
    }
    tryGetRoots() {
        return this._roots;
    }
    get workspace() {
        return this._workspace;
    }
    get onWorkspaceChanged() {
        return this.onWorkspaceChangeEmitter.event;
    }
    get onWorkspaceLocationChanged() {
        return this.onWorkspaceLocationChangedEmitter.event;
    }
    async setWorkspace(workspaceStat) {
        if (this._workspace && workspaceStat &&
            this._workspace.resource === workspaceStat.resource &&
            this._workspace.mtime === workspaceStat.mtime &&
            this._workspace.etag === workspaceStat.etag &&
            this._workspace.size === workspaceStat.size) {
            return;
        }
        this.toDisposeOnWorkspace.dispose();
        this._workspace = workspaceStat;
        if (this._workspace) {
            const uri = this._workspace.resource;
            if (this._workspace.isFile) {
                this.toDisposeOnWorkspace.push(this.fileService.watch(uri));
                this.onWorkspaceLocationChangedEmitter.fire(this._workspace);
            }
            this.setURLFragment(uri.path.toString());
        }
        else {
            this.setURLFragment('');
        }
        this.updateTitle();
        await this.server.setMostRecentlyUsedWorkspace(this._workspace ? this._workspace.resource.toString() : '');
        await this.updateWorkspace();
    }
    async updateWorkspace() {
        await this.updateRoots();
        this.watchRoots();
    }
    async updateRoots() {
        const newRoots = await this.computeRoots();
        let rootsChanged = false;
        if (newRoots.length !== this._roots.length || newRoots.length === 0) {
            rootsChanged = true;
        }
        else {
            for (const newRoot of newRoots) {
                if (!this._roots.some(r => r.resource.toString() === newRoot.resource.toString())) {
                    rootsChanged = true;
                    break;
                }
            }
        }
        if (rootsChanged) {
            this._roots = newRoots;
            this.deferredRoots.resolve(this._roots); // in order to resolve first
            this.deferredRoots = new promise_util_1.Deferred();
            this.deferredRoots.resolve(this._roots);
            this.onWorkspaceChangeEmitter.fire(this._roots);
        }
    }
    async computeRoots() {
        const roots = [];
        if (this._workspace) {
            if (this._workspace.isDirectory) {
                return [this._workspace];
            }
            const workspaceData = await this.getWorkspaceDataFromFile();
            if (workspaceData) {
                for (const { path } of workspaceData.folders) {
                    const valid = await this.toValidRoot(path);
                    if (valid) {
                        roots.push(valid);
                    }
                    else {
                        roots.push(files_1.FileStat.dir(path));
                    }
                }
            }
        }
        return roots;
    }
    async getWorkspaceDataFromFile() {
        if (this._workspace && await this.fileService.exists(this._workspace.resource)) {
            if (this._workspace.isDirectory) {
                return {
                    folders: [{ path: this._workspace.resource.toString() }]
                };
            }
            else if (this.isWorkspaceFile(this._workspace)) {
                const stat = await this.fileService.read(this._workspace.resource);
                const strippedContent = jsoncparser.stripComments(stat.value);
                const data = jsoncparser.parse(strippedContent);
                if (data && WorkspaceData.is(data)) {
                    return WorkspaceData.transformToAbsolute(data, stat);
                }
                this.logger.error(`Unable to retrieve workspace data from the file: '${this.labelProvider.getLongName(this._workspace)}'. Please check if the file is corrupted.`);
            }
            else {
                this.logger.warn(`Not a valid workspace file: ${this.labelProvider.getLongName(this._workspace)}`);
            }
        }
    }
    updateTitle() {
        let rootName;
        let rootPath;
        if (this._workspace) {
            const displayName = this._workspace.name;
            const fullName = this._workspace.resource.path.toString();
            if (this.isWorkspaceFile(this._workspace)) {
                if (this.isUntitledWorkspace(this._workspace.resource)) {
                    const untitled = core_1.nls.localizeByDefault('Untitled (Workspace)');
                    rootName = untitled;
                    rootPath = untitled;
                }
                else {
                    rootName = displayName.slice(0, displayName.lastIndexOf('.'));
                    rootPath = fullName.slice(0, fullName.lastIndexOf('.'));
                }
            }
            else {
                rootName = displayName;
                rootPath = fullName;
            }
        }
        this.windowTitleService.update({
            rootName,
            rootPath
        });
    }
    /**
     * on unload, we set our workspace root as the last recently used on the backend.
     */
    onStop() {
        this.server.setMostRecentlyUsedWorkspace(this._workspace ? this._workspace.resource.toString() : '');
    }
    async recentWorkspaces() {
        return this.server.getRecentWorkspaces();
    }
    async removeRecentWorkspace(uri) {
        return this.server.removeRecentWorkspace(uri);
    }
    /**
     * Returns `true` if theia has an opened workspace or folder
     * @returns {boolean}
     */
    get opened() {
        return !!this._workspace;
    }
    /**
     * Returns `true` if a multiple-root workspace is currently open.
     * @returns {boolean}
     */
    get isMultiRootWorkspaceOpened() {
        return !!this.workspace && !this.workspace.isDirectory;
    }
    /**
     * Opens directory, or recreates a workspace from the file that `uri` points to.
     */
    open(uri, options) {
        this.doOpen(uri, options);
    }
    async doOpen(uri, options) {
        const stat = await this.toFileStat(uri);
        if (stat) {
            if (!stat.isDirectory && !this.isWorkspaceFile(stat)) {
                const message = `Not a valid workspace: ${uri.path.toString()}`;
                this.messageService.error(message);
                throw new Error(message);
            }
            // The same window has to be preserved too (instead of opening a new one), if the workspace root is not yet available and we are setting it for the first time.
            // Option passed as parameter has the highest priority (for api developers), then the preference, then the default.
            await this.roots;
            const { preserveWindow } = {
                preserveWindow: this.preferences['workspace.preserveWindow'] || !this.opened,
                ...options
            };
            await this.server.setMostRecentlyUsedWorkspace(uri.toString());
            if (preserveWindow) {
                this._workspace = stat;
            }
            this.openWindow(stat, Object.assign(options !== null && options !== void 0 ? options : {}, { preserveWindow }));
            return;
        }
        throw new Error('Invalid workspace root URI. Expected an existing directory or workspace file.');
    }
    /**
     * Adds root folder(s) to the workspace
     * @param uris URI or URIs of the root folder(s) to add
     */
    async addRoot(uris) {
        const toAdd = Array.isArray(uris) ? uris : [uris];
        await this.spliceRoots(this._roots.length, 0, ...toAdd);
    }
    /**
     * Removes root folder(s) from workspace.
     */
    async removeRoots(uris) {
        if (!this.opened) {
            throw new Error('Folder cannot be removed as there is no active folder in the current workspace.');
        }
        if (this._workspace) {
            const workspaceData = await this.getWorkspaceDataFromFile();
            this._workspace = await this.writeWorkspaceFile(this._workspace, WorkspaceData.buildWorkspaceData(this._roots.filter(root => uris.findIndex(u => u.toString() === root.resource.toString()) < 0), workspaceData));
            await this.updateWorkspace();
        }
    }
    async spliceRoots(start, deleteCount, ...rootsToAdd) {
        if (!this._workspace) {
            throw new Error('There is no active workspace');
        }
        const dedup = new Set();
        const roots = this._roots.map(root => (dedup.add(root.resource.toString()), root.resource.toString()));
        const toAdd = [];
        for (const root of rootsToAdd) {
            const uri = root.toString();
            if (!dedup.has(uri)) {
                dedup.add(uri);
                toAdd.push(uri);
            }
        }
        const toRemove = roots.splice(start, deleteCount || 0, ...toAdd);
        if (!toRemove.length && !toAdd.length) {
            return [];
        }
        if (this._workspace.isDirectory) {
            const untitledWorkspace = await this.getUntitledWorkspace();
            await this.save(untitledWorkspace);
        }
        const currentData = await this.getWorkspaceDataFromFile();
        const newData = WorkspaceData.buildWorkspaceData(roots, currentData);
        await this.writeWorkspaceFile(this._workspace, newData);
        await this.updateWorkspace();
        return toRemove.map(root => new uri_1.default(root));
    }
    async getUntitledWorkspace() {
        const configDirURI = new uri_1.default(await this.envVariableServer.getConfigDirUri());
        return this.untitledWorkspaceService.getUntitledWorkspaceUri(configDirURI, uri => this.fileService.exists(uri).then(exists => !exists), () => this.messageService.warn(core_1.nls.localize('theia/workspace/untitled-cleanup', 'There appear to be many untitled workspace files. Please check {0} and remove any unused files.', configDirURI.resolve('workspaces').path.fsPath())));
    }
    async writeWorkspaceFile(workspaceFile, workspaceData) {
        if (workspaceFile) {
            const data = JSON.stringify(WorkspaceData.transformToRelative(workspaceData, workspaceFile));
            const edits = jsoncparser.format(data, undefined, { tabSize: 2, insertSpaces: true, eol: '' });
            const result = jsoncparser.applyEdits(data, edits);
            await this.fileService.write(workspaceFile.resource, result);
            return this.fileService.resolve(workspaceFile.resource);
        }
    }
    /**
     * Clears current workspace root.
     */
    async close() {
        if (await this.windowService.isSafeToShutDown(frontend_application_state_1.StopReason.Reload)) {
            this.windowService.setSafeToShutDown();
            this._workspace = undefined;
            this._roots.length = 0;
            await this.server.setMostRecentlyUsedWorkspace('');
            this.reloadWindow();
        }
    }
    /**
     * returns a FileStat if the argument URI points to an existing directory. Otherwise, `undefined`.
     */
    async toValidRoot(uri) {
        const fileStat = await this.toFileStat(uri);
        if (fileStat && fileStat.isDirectory) {
            return fileStat;
        }
        return undefined;
    }
    /**
     * returns a FileStat if the argument URI points to a file or directory. Otherwise, `undefined`.
     */
    async toFileStat(uri) {
        if (!uri) {
            return undefined;
        }
        let uriStr = uri.toString();
        try {
            if (uriStr.endsWith('/')) {
                uriStr = uriStr.slice(0, -1);
            }
            const normalizedUri = new uri_1.default(uriStr).normalizePath();
            return await this.fileService.resolve(normalizedUri);
        }
        catch (error) {
            return undefined;
        }
    }
    openWindow(uri, options) {
        const workspacePath = uri.resource.path.toString();
        if (this.shouldPreserveWindow(options)) {
            this.reloadWindow(options);
        }
        else {
            try {
                this.openNewWindow(workspacePath, options);
            }
            catch (error) {
                // Fall back to reloading the current window in case the browser has blocked the new window
                this._workspace = uri;
                this.logger.error(error.toString()).then(() => this.reloadWindow());
            }
        }
    }
    reloadWindow(options) {
        // Set the new workspace path as the URL fragment.
        if (this._workspace !== undefined) {
            this.setURLFragment(this._workspace.resource.path.toString());
        }
        else {
            this.setURLFragment('');
        }
        this.windowService.reload();
    }
    openNewWindow(workspacePath, options) {
        const url = new URL(window.location.href);
        url.hash = encodeURI(workspacePath);
        this.windowService.openNewWindow(url.toString());
    }
    shouldPreserveWindow(options) {
        return options !== undefined && !!options.preserveWindow;
    }
    /**
     * Return true if one of the paths in paths array is present in the workspace
     * NOTE: You should always explicitly use `/` as the separator between the path segments.
     */
    async containsSome(paths) {
        await this.roots;
        if (this.opened) {
            for (const root of this._roots) {
                const uri = root.resource;
                for (const path of paths) {
                    const fileUri = uri.resolve(path);
                    const exists = await this.fileService.exists(fileUri);
                    if (exists) {
                        return exists;
                    }
                }
            }
        }
        return false;
    }
    /**
     * `true` if the current workspace is configured using a configuration file.
     *
     * `false` if there is no workspace or the workspace is simply a folder.
     */
    get saved() {
        return !!this._workspace && !this._workspace.isDirectory;
    }
    /**
     * Save workspace data into a file
     * @param uri URI or FileStat of the workspace file
     */
    async save(uri) {
        var _a;
        const resource = uri instanceof uri_1.default ? uri : uri.resource;
        if (!await this.fileService.exists(resource)) {
            await this.fileService.create(resource);
        }
        const workspaceData = { folders: [], settings: {} };
        if (!this.saved) {
            for (const p of Object.keys(this.schemaProvider.getCombinedSchema().properties)) {
                if (this.schemaProvider.isValidInScope(p, browser_1.PreferenceScope.Folder)) {
                    continue;
                }
                const preferences = this.preferenceImpl.inspect(p);
                if (preferences && preferences.workspaceValue) {
                    workspaceData.settings[p] = preferences.workspaceValue;
                }
            }
        }
        let stat = await this.toFileStat(resource);
        Object.assign(workspaceData, await this.getWorkspaceDataFromFile());
        stat = await this.writeWorkspaceFile(stat, WorkspaceData.buildWorkspaceData(this._roots, workspaceData));
        await this.server.setMostRecentlyUsedWorkspace(resource.toString());
        // If saving a workspace based on an untitled workspace, delete the old file.
        const toDelete = this.isUntitledWorkspace((_a = this.workspace) === null || _a === void 0 ? void 0 : _a.resource) && this.workspace.resource;
        await this.setWorkspace(stat);
        if (toDelete && stat && !toDelete.isEqual(stat.resource)) {
            await this.fileService.delete(toDelete).catch(() => { });
        }
        this.onWorkspaceLocationChangedEmitter.fire(stat);
    }
    async watchRoots() {
        const rootUris = new Set(this._roots.map(r => r.resource.toString()));
        for (const [uri, watcher] of this.rootWatchers.entries()) {
            if (!rootUris.has(uri)) {
                watcher.dispose();
            }
        }
        for (const root of this._roots) {
            this.watchRoot(root);
        }
    }
    async refreshRootWatchers() {
        for (const watcher of this.rootWatchers.values()) {
            watcher.dispose();
        }
        await this.watchRoots();
    }
    async watchRoot(root) {
        const uriStr = root.resource.toString();
        if (this.rootWatchers.has(uriStr)) {
            return;
        }
        const excludes = this.getExcludes(uriStr);
        const watcher = this.fileService.watch(new uri_1.default(uriStr), {
            recursive: true,
            excludes
        });
        this.rootWatchers.set(uriStr, new core_1.DisposableCollection(watcher, core_1.Disposable.create(() => this.rootWatchers.delete(uriStr))));
    }
    getExcludes(uri) {
        const patterns = this.fsPreferences.get('files.watcherExclude', undefined, uri);
        return Object.keys(patterns).filter(pattern => patterns[pattern]);
    }
    /**
     * Returns the workspace root uri that the given file belongs to.
     * In case that the file is found in more than one workspace roots, returns the root that is closest to the file.
     * If the file is not from the current workspace, returns `undefined`.
     * @param uri URI of the file
     */
    getWorkspaceRootUri(uri) {
        if (!uri) {
            const root = this.tryGetRoots()[0];
            if (root) {
                return root.resource;
            }
            return undefined;
        }
        const rootUris = [];
        for (const root of this.tryGetRoots()) {
            const rootUri = root.resource;
            if (rootUri && rootUri.isEqualOrParent(uri)) {
                rootUris.push(rootUri);
            }
        }
        return rootUris.sort((r1, r2) => r2.toString().length - r1.toString().length)[0];
    }
    areWorkspaceRoots(uris) {
        if (!uris.length) {
            return false;
        }
        const rootUris = new Set(this.tryGetRoots().map(root => root.resource.toString()));
        return uris.every(uri => rootUris.has(uri.toString()));
    }
    /**
     * Check if the file should be considered as a workspace file.
     *
     * Example: We should not try to read the contents of an .exe file.
     */
    isWorkspaceFile(candidate) {
        return this.workspaceFileService.isWorkspaceFile(candidate);
    }
    isUntitledWorkspace(candidate) {
        return this.untitledWorkspaceService.isUntitledWorkspace(candidate);
    }
    async isSafeToReload(withURI) {
        return !withURI || !this.untitledWorkspaceService.isUntitledWorkspace(withURI) || new uri_1.default(await this.getDefaultWorkspaceUri()).isEqual(withURI);
    }
    /**
     *
     * @param key the property key under which to store the schema (e.g. tasks, launch)
     * @param schema the schema for the property. If none is supplied, the update is treated as a deletion.
     */
    async updateSchema(key, schema) {
        return this.schemaUpdater.updateSchema({ key, schema });
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], WorkspaceService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.WorkspaceServer),
    __metadata("design:type", Object)
], WorkspaceService.prototype, "server", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], WorkspaceService.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], WorkspaceService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_preferences_1.WorkspacePreferences),
    __metadata("design:type", Object)
], WorkspaceService.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceServiceImpl),
    __metadata("design:type", browser_1.PreferenceServiceImpl)
], WorkspaceService.prototype, "preferenceImpl", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], WorkspaceService.prototype, "schemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], WorkspaceService.prototype, "envVariableServer", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], WorkspaceService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], WorkspaceService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.FileSystemPreferences),
    __metadata("design:type", Object)
], WorkspaceService.prototype, "fsPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_schema_updater_1.WorkspaceSchemaUpdater),
    __metadata("design:type", workspace_schema_updater_1.WorkspaceSchemaUpdater)
], WorkspaceService.prototype, "schemaUpdater", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.UntitledWorkspaceService),
    __metadata("design:type", common_1.UntitledWorkspaceService)
], WorkspaceService.prototype, "untitledWorkspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.WorkspaceFileService),
    __metadata("design:type", common_1.WorkspaceFileService)
], WorkspaceService.prototype, "workspaceFileService", void 0);
__decorate([
    (0, inversify_1.inject)(window_title_service_1.WindowTitleService),
    __metadata("design:type", window_title_service_1.WindowTitleService)
], WorkspaceService.prototype, "windowTitleService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspaceService.prototype, "init", null);
WorkspaceService = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceService);
exports.WorkspaceService = WorkspaceService;
var WorkspaceData;
(function (WorkspaceData) {
    const validateSchema = new Ajv().compile(workspace_schema_updater_1.workspaceSchema);
    function is(data) {
        return !!validateSchema(data);
    }
    WorkspaceData.is = is;
    function buildWorkspaceData(folders, additionalFields) {
        const roots = new Set();
        if (folders.length > 0) {
            if (typeof folders[0] !== 'string') {
                folders.forEach(folder => roots.add(folder.resource.toString()));
            }
            else {
                folders.forEach(folder => roots.add(folder));
            }
        }
        const data = {
            folders: Array.from(roots, folder => ({ path: folder }))
        };
        if (additionalFields) {
            delete additionalFields.folders;
            Object.assign(data, additionalFields);
        }
        return data;
    }
    WorkspaceData.buildWorkspaceData = buildWorkspaceData;
    function transformToRelative(data, workspaceFile) {
        const folderUris = [];
        const workspaceFileUri = new uri_1.default(workspaceFile ? workspaceFile.resource.toString() : '').withScheme('file');
        for (const { path } of data.folders) {
            const folderUri = new uri_1.default(path).withScheme('file');
            const rel = workspaceFileUri.parent.relative(folderUri);
            if (rel) {
                folderUris.push(rel.toString());
            }
            else {
                folderUris.push(folderUri.toString());
            }
        }
        return buildWorkspaceData(folderUris, data);
    }
    WorkspaceData.transformToRelative = transformToRelative;
    function transformToAbsolute(data, workspaceFile) {
        var _a;
        if (workspaceFile) {
            const folders = [];
            for (const folder of data.folders) {
                const path = folder.path;
                if (path.startsWith('file:///')) {
                    folders.push(path);
                }
                else {
                    const absolutePath = (_a = workspaceFile.resource.withScheme('file').parent.resolveToAbsolute(path)) === null || _a === void 0 ? void 0 : _a.toString();
                    if (absolutePath) {
                        folders.push(absolutePath.toString());
                    }
                }
            }
            return Object.assign(data, buildWorkspaceData(folders, data));
        }
        return data;
    }
    WorkspaceData.transformToAbsolute = transformToAbsolute;
})(WorkspaceData = exports.WorkspaceData || (exports.WorkspaceData = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/browser/workspace-service'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/common/index.js":
/*!****************************************************!*\
  !*** ../../packages/workspace/lib/common/index.js ***!
  \****************************************************/
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
__exportStar(__webpack_require__(/*! ./workspace-protocol */ "../../packages/workspace/lib/common/workspace-protocol.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-file-service */ "../../packages/workspace/lib/common/workspace-file-service.js"), exports);
__exportStar(__webpack_require__(/*! ./untitled-workspace-service */ "../../packages/workspace/lib/common/untitled-workspace-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/common'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/common/untitled-workspace-service.js":
/*!*************************************************************************!*\
  !*** ../../packages/workspace/lib/common/untitled-workspace-service.js ***!
  \*************************************************************************/
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
exports.UntitledWorkspaceService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const workspace_file_service_1 = __webpack_require__(/*! ./workspace-file-service */ "../../packages/workspace/lib/common/workspace-file-service.js");
let UntitledWorkspaceService = class UntitledWorkspaceService {
    isUntitledWorkspace(candidate) {
        return !!candidate && this.workspaceFileService.isWorkspaceFile(candidate) && candidate.path.base.startsWith('Untitled');
    }
    async getUntitledWorkspaceUri(configDirUri, isAcceptable, warnOnHits) {
        const parentDir = configDirUri.resolve('workspaces');
        const workspaceExtensions = this.workspaceFileService.getWorkspaceFileExtensions();
        const defaultFileExtension = workspaceExtensions[this.workspaceFileService.defaultFileTypeIndex];
        let uri;
        let attempts = 0;
        do {
            attempts++;
            uri = parentDir.resolve(`Untitled-${Math.round(Math.random() * 1000)}.${defaultFileExtension}`);
            if (attempts === 10) {
                warnOnHits === null || warnOnHits === void 0 ? void 0 : warnOnHits();
            }
            if (attempts === 50) {
                throw new Error('Workspace Service: too many attempts to find unused filename.');
            }
        } while (!(await isAcceptable(uri)));
        return uri;
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_file_service_1.WorkspaceFileService),
    __metadata("design:type", workspace_file_service_1.WorkspaceFileService)
], UntitledWorkspaceService.prototype, "workspaceFileService", void 0);
UntitledWorkspaceService = __decorate([
    (0, inversify_1.injectable)()
], UntitledWorkspaceService);
exports.UntitledWorkspaceService = UntitledWorkspaceService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/common/untitled-workspace-service'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/common/workspace-file-service.js":
/*!*********************************************************************!*\
  !*** ../../packages/workspace/lib/common/workspace-file-service.js ***!
  \*********************************************************************/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspaceFileService = exports.VSCODE_EXT = exports.THEIA_EXT = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const files_1 = __webpack_require__(/*! @theia/filesystem/lib/common/files */ "../../packages/filesystem/lib/common/files.js");
/**
 * @deprecated Since 1.39.0. Use `WorkspaceFileService#getWorkspaceFileTypes` instead.
 */
exports.THEIA_EXT = 'theia-workspace';
/**
 * @deprecated Since 1.39.0. Use `WorkspaceFileService#getWorkspaceFileTypes` instead.
 */
exports.VSCODE_EXT = 'code-workspace';
let WorkspaceFileService = class WorkspaceFileService {
    constructor() {
        this._defaultFileTypeIndex = 0;
    }
    get defaultFileTypeIndex() {
        return this._defaultFileTypeIndex;
    }
    /**
     * Check if the file should be considered as a workspace file.
     *
     * Example: We should not try to read the contents of an .exe file.
     */
    isWorkspaceFile(candidate) {
        const uri = files_1.FileStat.is(candidate) ? candidate.resource : candidate;
        const extensions = this.getWorkspaceFileExtensions(true);
        return extensions.includes(uri.path.ext);
    }
    getWorkspaceFileTypes() {
        return [
            {
                name: 'Theia',
                extension: exports.THEIA_EXT
            },
            {
                name: 'Visual Studio Code',
                extension: exports.VSCODE_EXT
            }
        ];
    }
    getWorkspaceFileExtensions(dot) {
        return this.getWorkspaceFileTypes().map(type => dot ? `.${type.extension}` : type.extension);
    }
};
WorkspaceFileService = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceFileService);
exports.WorkspaceFileService = WorkspaceFileService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/common/workspace-file-service'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/common/workspace-protocol.js":
/*!*****************************************************************!*\
  !*** ../../packages/workspace/lib/common/workspace-protocol.js ***!
  \*****************************************************************/
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
exports.WorkspaceServer = exports.workspacePath = void 0;
exports.workspacePath = '/services/workspace';
/**
 * The JSON-RPC workspace interface.
 */
exports.WorkspaceServer = Symbol('WorkspaceServer');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/common/workspace-protocol'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_workspace_lib_browser_workspace-service_js.js.map