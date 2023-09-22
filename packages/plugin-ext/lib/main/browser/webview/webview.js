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
// copied and modified from https://github.com/microsoft/vscode/blob/ba40bd16433d5a817bfae15f3b4350e18f144af4/src/vs/workbench/contrib/webview/browser/baseWebviewElement.ts
// copied and modified from https://github.com/microsoft/vscode/blob/ba40bd16433d5a817bfae15f3b4350e18f144af4/src/vs/workbench/contrib/webview/browser/webviewElement.ts#
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebviewWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewWidget = exports.WebviewWidgetExternalEndpoint = exports.WebviewWidgetIdentifier = void 0;
const mime = require("mime");
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const inversify_1 = require("@theia/core/shared/inversify");
const widget_1 = require("@theia/core/lib/browser/widgets/widget");
const disposable_1 = require("@theia/core/lib/common/disposable");
const application_shell_mouse_tracker_1 = require("@theia/core/lib/browser/shell/application-shell-mouse-tracker");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const webview_environment_1 = require("./webview-environment");
const uri_1 = require("@theia/core/lib/common/uri");
const event_1 = require("@theia/core/lib/common/event");
const opener_service_1 = require("@theia/core/lib/browser/opener-service");
const keybinding_1 = require("@theia/core/lib/browser/keybinding");
const uri_components_1 = require("../../../common/uri-components");
const plugin_shared_style_1 = require("../plugin-shared-style");
const webview_theme_data_provider_1 = require("./webview-theme-data-provider");
const external_uri_service_1 = require("@theia/core/lib/browser/external-uri-service");
const output_channel_1 = require("@theia/output/lib/browser/output-channel");
const webview_preferences_1 = require("./webview-preferences");
const webview_resource_cache_1 = require("./webview-resource-cache");
const endpoint_1 = require("@theia/core/lib/browser/endpoint");
const browser_1 = require("@theia/core/lib/browser/browser");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const files_1 = require("@theia/filesystem/lib/common/files");
const buffer_1 = require("@theia/core/lib/common/buffer");
// Style from core
const TRANSPARENT_OVERLAY_STYLE = 'theia-transparent-overlay';
let WebviewWidgetIdentifier = class WebviewWidgetIdentifier {
};
WebviewWidgetIdentifier = __decorate([
    (0, inversify_1.injectable)()
], WebviewWidgetIdentifier);
exports.WebviewWidgetIdentifier = WebviewWidgetIdentifier;
exports.WebviewWidgetExternalEndpoint = Symbol('WebviewWidgetExternalEndpoint');
let WebviewWidget = WebviewWidget_1 = class WebviewWidget extends widget_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.viewState = {
            visible: false,
            active: false,
            position: 0
        };
        this.html = '';
        this._contentOptions = {};
        this.options = {};
        this.ready = new promise_util_1.Deferred();
        this.onMessageEmitter = new event_1.Emitter();
        this.onMessage = this.onMessageEmitter.event;
        this.pendingMessages = [];
        this.toHide = new disposable_1.DisposableCollection();
        this.isExtractable = true;
        this.secondaryWindow = undefined;
        this.onDidChangeBadgeEmitter = new event_1.Emitter();
        this.onDidChangeBadgeTooltipEmitter = new event_1.Emitter();
        this.toDisposeOnIcon = new disposable_1.DisposableCollection();
    }
    get contentOptions() {
        return this._contentOptions;
    }
    get state() {
        return this._state;
    }
    init() {
        this.node.tabIndex = 0;
        this.id = WebviewWidget_1.FACTORY_ID + ':' + this.identifier.id;
        this.title.closable = true;
        this.addClass(WebviewWidget_1.Styles.WEBVIEW);
        this.toDispose.push(this.onMessageEmitter);
        this.toDispose.push(this.onDidChangeBadgeEmitter);
        this.toDispose.push(this.onDidChangeBadgeTooltipEmitter);
        this.transparentOverlay = document.createElement('div');
        this.transparentOverlay.classList.add(TRANSPARENT_OVERLAY_STYLE);
        this.transparentOverlay.style.display = 'none';
        this.node.appendChild(this.transparentOverlay);
        this.toDispose.push(this.mouseTracker.onMousedown(() => {
            if (this.element && this.element.style.display !== 'none') {
                this.transparentOverlay.style.display = 'block';
            }
        }));
        this.toDispose.push(this.mouseTracker.onMouseup(() => {
            if (this.element && this.element.style.display !== 'none') {
                this.transparentOverlay.style.display = 'none';
            }
        }));
    }
    get onDidChangeBadge() {
        return this.onDidChangeBadgeEmitter.event;
    }
    get onDidChangeBadgeTooltip() {
        return this.onDidChangeBadgeTooltipEmitter.event;
    }
    get badge() {
        return this._badge;
    }
    set badge(badge) {
        this._badge = badge;
        this.onDidChangeBadgeEmitter.fire();
    }
    get badgeTooltip() {
        return this._badgeTooltip;
    }
    set badgeTooltip(badgeTooltip) {
        this._badgeTooltip = badgeTooltip;
        this.onDidChangeBadgeTooltipEmitter.fire();
    }
    onBeforeAttach(msg) {
        super.onBeforeAttach(msg);
        this.doShow();
        // iframe has to be reloaded when moved to another DOM element
        this.toDisposeOnDetach.push(disposable_1.Disposable.create(() => this.forceHide()));
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.addEventListener(this.node, 'focus', () => {
            if (this.element) {
                this.doSend('focus');
            }
        });
    }
    onBeforeShow(msg) {
        super.onBeforeShow(msg);
        this.doShow();
    }
    onAfterHide(msg) {
        super.onAfterHide(msg);
        this.doHide();
    }
    doHide() {
        if (this.options.retainContextWhenHidden !== true) {
            if (this.hideTimeout === undefined) {
                // avoid removing iframe if a widget moved quickly
                this.hideTimeout = setTimeout(() => this.forceHide(), 50);
            }
        }
    }
    forceHide() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = undefined;
        this.toHide.dispose();
    }
    doShow() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = undefined;
        if (!this.toHide.disposed) {
            return;
        }
        this.toDispose.push(this.toHide);
        const element = document.createElement('iframe');
        element.className = 'webview';
        element.sandbox.add('allow-scripts', 'allow-forms', 'allow-same-origin', 'allow-downloads');
        if (!browser_1.isFirefox) {
            element.setAttribute('allow', 'clipboard-read; clipboard-write; usb; serial; hid;');
        }
        element.setAttribute('src', `${this.externalEndpoint}/index.html?id=${this.identifier.id}`);
        element.style.border = 'none';
        element.style.width = '100%';
        element.style.height = '100%';
        this.element = element;
        this.node.appendChild(this.element);
        this.toHide.push(disposable_1.Disposable.create(() => {
            if (this.element) {
                this.element.remove();
                this.element = undefined;
            }
        }));
        const oldReady = this.ready;
        const ready = new promise_util_1.Deferred();
        ready.promise.then(() => oldReady.resolve());
        this.ready = ready;
        this.toHide.push(disposable_1.Disposable.create(() => this.ready = new promise_util_1.Deferred()));
        const subscription = this.on("webview-ready" /* webviewReady */, () => {
            subscription.dispose();
            ready.resolve();
        });
        this.toHide.push(subscription);
        this.toHide.push(this.on("onmessage" /* onmessage */, (data) => this.onMessageEmitter.fire(data)));
        this.toHide.push(this.on("did-click-link" /* didClickLink */, (uri) => this.openLink(new uri_1.default(uri))));
        this.toHide.push(this.on("do-update-state" /* doUpdateState */, (state) => {
            this._state = state;
        }));
        this.toHide.push(this.on("did-focus" /* didFocus */, () => 
        // emulate the webview focus without actually changing focus
        this.node.dispatchEvent(new FocusEvent('focus'))));
        this.toHide.push(this.on("did-blur" /* didBlur */, () => {
            /* no-op: webview loses focus only if another element gains focus in the main window */
        }));
        this.toHide.push(this.on("do-reload" /* doReload */, () => this.reload()));
        this.toHide.push(this.on("load-resource" /* loadResource */, (entry) => this.loadResource(entry.path)));
        this.toHide.push(this.on("load-localhost" /* loadLocalhost */, (entry) => this.loadLocalhost(entry.origin)));
        this.toHide.push(this.on("did-keydown" /* didKeydown */, (data) => {
            // Electron: workaround for https://github.com/electron/electron/issues/14258
            // We have to detect keyboard events in the <webview> and dispatch them to our
            // keybinding service because these events do not bubble to the parent window anymore.
            this.keybindings.dispatchKeyDown(data, this.element);
        }));
        this.toHide.push(this.on("did-mousedown" /* didMouseDown */, (data) => {
            // We have to dispatch mousedown events so menus will be closed when clicking inside webviews.
            // See: https://github.com/eclipse-theia/theia/issues/7752
            this.dispatchMouseEvent('mousedown', data);
        }));
        this.toHide.push(this.on("did-mouseup" /* didMouseUp */, (data) => {
            this.dispatchMouseEvent('mouseup', data);
        }));
        this.style();
        this.toHide.push(this.themeDataProvider.onDidChangeThemeData(() => this.style()));
        this.doUpdateContent();
        while (this.pendingMessages.length) {
            this.sendMessage(this.pendingMessages.shift());
        }
    }
    async loadLocalhost(origin) {
        const redirect = await this.getRedirect(origin);
        return this.doSend('did-load-localhost', { origin, location: redirect });
    }
    dispatchMouseEvent(type, data) {
        const domRect = this.node.getBoundingClientRect();
        document.dispatchEvent(new MouseEvent(type, {
            ...data,
            clientX: domRect.x + data.clientX,
            clientY: domRect.y + data.clientY
        }));
    }
    async getRedirect(url) {
        const uri = new uri_1.default(url);
        const localhost = this.externalUriService.parseLocalhost(uri);
        if (!localhost) {
            return undefined;
        }
        if (this._contentOptions.portMapping) {
            for (const mapping of this._contentOptions.portMapping) {
                if (mapping.webviewPort === localhost.port) {
                    if (mapping.webviewPort !== mapping.extensionHostPort) {
                        return this.toRemoteUrl(uri.withAuthority(`${localhost.address}:${mapping.extensionHostPort}`));
                    }
                }
            }
        }
        return this.toRemoteUrl(uri);
    }
    async toRemoteUrl(localUri) {
        const remoteUri = await this.externalUriService.resolve(localUri);
        const remoteUrl = remoteUri.toString();
        if (remoteUrl[remoteUrl.length - 1] === '/') {
            return remoteUrl.slice(0, remoteUrl.length - 1);
        }
        return remoteUrl;
    }
    setContentOptions(contentOptions) {
        if (coreutils_1.JSONExt.deepEqual(this.contentOptions, contentOptions)) {
            return;
        }
        this._contentOptions = contentOptions;
        this.doUpdateContent();
    }
    setIconUrl(iconUrl) {
        if ((this.iconUrl && iconUrl && coreutils_1.JSONExt.deepEqual(this.iconUrl, iconUrl)) || (this.iconUrl === iconUrl)) {
            return;
        }
        this.toDisposeOnIcon.dispose();
        this.toDispose.push(this.toDisposeOnIcon);
        this.iconUrl = iconUrl;
        if (iconUrl) {
            const darkIconUrl = typeof iconUrl === 'object' ? iconUrl.dark : iconUrl;
            const lightIconUrl = typeof iconUrl === 'object' ? iconUrl.light : iconUrl;
            const iconClass = `webview-${this.identifier.id}-file-icon`;
            this.toDisposeOnIcon.push(this.sharedStyle.insertRule(`.theia-webview-icon.${iconClass}::before`, theme => `background-image: url(${this.toEndpoint(theme.type === 'light' ? lightIconUrl : darkIconUrl)});`));
            this.title.iconClass = `theia-webview-icon ${iconClass}`;
        }
        else {
            this.title.iconClass = '';
        }
    }
    toEndpoint(pathname) {
        return new endpoint_1.Endpoint({ path: pathname }).getRestUrl().toString();
    }
    setHTML(value) {
        this.html = this.preprocessHtml(value);
        this.doUpdateContent();
    }
    preprocessHtml(value) {
        return value
            .replace(/(["'])(?:vscode|theia)-resource:(\/\/([^\s\/'"]+?)(?=\/))?([^\s'"]+?)(["'])/gi, (_, startQuote, _1, scheme, path, endQuote) => {
            if (scheme) {
                return `${startQuote}${this.externalEndpoint}/theia-resource/${scheme}${path}${endQuote}`;
            }
            return `${startQuote}${this.externalEndpoint}/theia-resource/file${path}${endQuote}`;
        });
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
    }
    reload() {
        this.doUpdateContent();
    }
    style() {
        const { styles, activeThemeType, activeThemeName } = this.themeDataProvider.getThemeData();
        this.doSend('styles', { styles, activeThemeType, activeThemeName });
    }
    openLink(link) {
        const supported = this.toSupportedLink(link);
        if (supported) {
            (0, opener_service_1.open)(this.openerService, supported);
        }
    }
    toSupportedLink(link) {
        if (WebviewWidget_1.standardSupportedLinkSchemes.has(link.scheme)) {
            const linkAsString = link.toString();
            for (const resourceRoot of [this.externalEndpoint + '/theia-resource', this.externalEndpoint + '/vscode-resource']) {
                if (linkAsString.startsWith(resourceRoot + '/')) {
                    return this.normalizeRequestUri(linkAsString.substring(resourceRoot.length));
                }
            }
            return link;
        }
        if (link.scheme === uri_components_1.Schemes.command) {
            if (Array.isArray(this.contentOptions.enableCommandUris) && this.contentOptions.enableCommandUris.some(value => value === link.path.toString())) {
                return link;
            }
            else if (this.contentOptions.enableCommandUris === true) {
                return link;
            }
        }
        return undefined;
    }
    async loadResource(requestPath) {
        const normalizedUri = this.normalizeRequestUri(requestPath);
        // browser cache does not support file scheme, normalize to current endpoint scheme and host
        const cacheUrl = new endpoint_1.Endpoint({ path: normalizedUri.path.toString() }).getRestUrl().toString();
        try {
            if (this.contentOptions.localResourceRoots) {
                for (const root of this.contentOptions.localResourceRoots) {
                    if (!new uri_1.default(root).path.isEqualOrParent(normalizedUri.path)) {
                        continue;
                    }
                    let cached = await this.resourceCache.match(cacheUrl);
                    try {
                        const result = await this.fileService.readFileStream(normalizedUri, { etag: cached === null || cached === void 0 ? void 0 : cached.eTag });
                        const { buffer } = await buffer_1.BinaryBufferReadableStream.toBuffer(result.value);
                        cached = { body: () => buffer, eTag: result.etag };
                        this.resourceCache.put(cacheUrl, cached);
                    }
                    catch (e) {
                        if (!(e instanceof files_1.FileOperationError && e.fileOperationResult === 2 /* FILE_NOT_MODIFIED_SINCE */)) {
                            throw e;
                        }
                    }
                    if (cached) {
                        const data = await cached.body();
                        return this.doSend('did-load-resource', {
                            status: 200,
                            path: requestPath,
                            mime: mime.getType(normalizedUri.path.toString()) || 'application/octet-stream',
                            data
                        });
                    }
                }
            }
        }
        catch {
            // no-op
        }
        this.resourceCache.delete(cacheUrl);
        return this.doSend('did-load-resource', {
            status: 404,
            path: requestPath
        });
    }
    normalizeRequestUri(requestPath) {
        const normalizedPath = decodeURIComponent(requestPath);
        const requestUri = new uri_1.default(normalizedPath.replace(/^\/([a-zA-Z0-9.\-+]+)\/(.+)$/, (_, scheme, path) => scheme + ':/' + path));
        if (requestUri.scheme !== 'theia-resource' && requestUri.scheme !== 'vscode-resource') {
            return requestUri;
        }
        // Modern vscode-resources uris put the scheme of the requested resource as the authority
        if (requestUri.authority) {
            return new uri_1.default(requestUri.authority + ':' + requestUri.path);
        }
        // Old style vscode-resource uris lose the scheme of the resource which means they are unable to
        // load a mix of local and remote content properly.
        return requestUri.withScheme('file');
    }
    sendMessage(data) {
        if (this.element) {
            this.doSend('message', data);
        }
        else {
            this.pendingMessages.push(data);
        }
    }
    doUpdateContent() {
        this.doSend('content', {
            contents: this.html,
            options: this.contentOptions,
            state: this.state
        });
    }
    storeState() {
        return {
            viewType: this.viewType,
            title: this.title.label,
            iconUrl: this.iconUrl,
            options: this.options,
            contentOptions: this.contentOptions,
            state: this.state
        };
    }
    restoreState(oldState) {
        const { viewType, title, iconUrl, options, contentOptions, state } = oldState;
        this.viewType = viewType;
        this.title.label = title;
        this.setIconUrl(iconUrl);
        this.options = options;
        this._contentOptions = contentOptions;
        this._state = state;
    }
    setIframeHeight(height) {
        if (this.element) {
            this.element.style.height = `${height}px`;
        }
    }
    async doSend(channel, data) {
        if (!this.element) {
            return;
        }
        try {
            await this.ready.promise;
            this.postMessage(channel, data);
        }
        catch (e) {
            console.error(e);
        }
    }
    postMessage(channel, data) {
        if (this.element) {
            this.trace('out', channel, data);
            if (this.secondaryWindow) {
                this.secondaryWindow.postMessage({ channel, args: data }, '*');
            }
            else {
                this.element.contentWindow.postMessage({ channel, args: data }, '*');
            }
        }
    }
    on(channel, handler) {
        const listener = (e) => {
            if (!e || !e.data || e.data.target !== this.identifier.id) {
                return;
            }
            if (e.data.channel === channel) {
                this.trace('in', e.data.channel, e.data.data);
                handler(e.data.data);
            }
        };
        window.addEventListener('message', listener);
        return disposable_1.Disposable.create(() => window.removeEventListener('message', listener));
    }
    trace(kind, channel, data) {
        const value = this.preferences['webview.trace'];
        if (value === 'off') {
            return;
        }
        const output = this.outputManager.getChannel('webviews');
        output.append('\n' + this.identifier.id);
        output.append(kind === 'out' ? ' => ' : ' <= ');
        output.append(channel);
        if (value === 'verbose') {
            if (data) {
                output.append('\n' + JSON.stringify(data, undefined, 2));
            }
        }
    }
};
WebviewWidget.standardSupportedLinkSchemes = new Set([
    uri_components_1.Schemes.http,
    uri_components_1.Schemes.https,
    uri_components_1.Schemes.mailto,
    uri_components_1.Schemes.vscode
]);
WebviewWidget.FACTORY_ID = 'plugin-webview';
__decorate([
    (0, inversify_1.inject)(WebviewWidgetIdentifier),
    __metadata("design:type", WebviewWidgetIdentifier)
], WebviewWidget.prototype, "identifier", void 0);
__decorate([
    (0, inversify_1.inject)(exports.WebviewWidgetExternalEndpoint),
    __metadata("design:type", String)
], WebviewWidget.prototype, "externalEndpoint", void 0);
__decorate([
    (0, inversify_1.inject)(application_shell_mouse_tracker_1.ApplicationShellMouseTracker),
    __metadata("design:type", application_shell_mouse_tracker_1.ApplicationShellMouseTracker)
], WebviewWidget.prototype, "mouseTracker", void 0);
__decorate([
    (0, inversify_1.inject)(webview_environment_1.WebviewEnvironment),
    __metadata("design:type", webview_environment_1.WebviewEnvironment)
], WebviewWidget.prototype, "environment", void 0);
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], WebviewWidget.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(keybinding_1.KeybindingRegistry),
    __metadata("design:type", keybinding_1.KeybindingRegistry)
], WebviewWidget.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], WebviewWidget.prototype, "sharedStyle", void 0);
__decorate([
    (0, inversify_1.inject)(webview_theme_data_provider_1.WebviewThemeDataProvider),
    __metadata("design:type", webview_theme_data_provider_1.WebviewThemeDataProvider)
], WebviewWidget.prototype, "themeDataProvider", void 0);
__decorate([
    (0, inversify_1.inject)(external_uri_service_1.ExternalUriService),
    __metadata("design:type", external_uri_service_1.ExternalUriService)
], WebviewWidget.prototype, "externalUriService", void 0);
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], WebviewWidget.prototype, "outputManager", void 0);
__decorate([
    (0, inversify_1.inject)(webview_preferences_1.WebviewPreferences),
    __metadata("design:type", Object)
], WebviewWidget.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], WebviewWidget.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(webview_resource_cache_1.WebviewResourceCache),
    __metadata("design:type", webview_resource_cache_1.WebviewResourceCache)
], WebviewWidget.prototype, "resourceCache", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebviewWidget.prototype, "init", null);
WebviewWidget = WebviewWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], WebviewWidget);
exports.WebviewWidget = WebviewWidget;
(function (WebviewWidget) {
    let Styles;
    (function (Styles) {
        Styles.WEBVIEW = 'theia-webview';
    })(Styles = WebviewWidget.Styles || (WebviewWidget.Styles = {}));
})(WebviewWidget = exports.WebviewWidget || (exports.WebviewWidget = {}));
exports.WebviewWidget = WebviewWidget;
//# sourceMappingURL=webview.js.map