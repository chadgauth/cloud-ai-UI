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
exports.TextContentResource = exports.TextContentResourceResolver = exports.WorkspaceMainImpl = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const file_search_service_1 = require("@theia/file-search/lib/common/file-search-service");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/workspace/lib/browser");
const disposable_1 = require("@theia/core/lib/common/disposable");
const core_1 = require("@theia/core");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const browser_2 = require("@theia/filesystem/lib/browser");
const search_in_workspace_service_1 = require("@theia/search-in-workspace/lib/browser/search-in-workspace-service");
const monaco_quick_input_service_1 = require("@theia/monaco/lib/browser/monaco-quick-input-service");
const request_1 = require("@theia/core/shared/@theia/request");
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
//# sourceMappingURL=workspace-main.js.map