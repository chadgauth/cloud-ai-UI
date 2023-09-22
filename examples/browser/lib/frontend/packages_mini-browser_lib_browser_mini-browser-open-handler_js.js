(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_mini-browser_lib_browser_mini-browser-open-handler_js"],{

/***/ "../../packages/core/shared/lodash.debounce/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/shared/lodash.debounce/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! lodash.debounce */ "../../node_modules/lodash.debounce/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/lodash.debounce'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/environment/mini-browser-environment.js":
/*!***************************************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/environment/mini-browser-environment.js ***!
  \***************************************************************************************/
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
exports.MiniBrowserEnvironment = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const environment_1 = __webpack_require__(/*! @theia/core/shared/@theia/application-package/lib/environment */ "../../packages/core/shared/@theia/application-package/lib/environment/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uuid_1 = __webpack_require__(/*! uuid */ "../../node_modules/uuid/dist/esm-browser/index.js");
const mini_browser_endpoint_1 = __webpack_require__(/*! ../../common/mini-browser-endpoint */ "../../packages/mini-browser/lib/common/mini-browser-endpoint.js");
/**
 * Fetch values from the backend's environment and caches them locally.
 * Helps with deploying various mini-browser endpoints.
 */
let MiniBrowserEnvironment = class MiniBrowserEnvironment {
    init() {
        this._hostPatternPromise = this.getHostPattern()
            .then(pattern => this._hostPattern = pattern);
    }
    get hostPatternPromise() {
        return this._hostPatternPromise;
    }
    get hostPattern() {
        return this._hostPattern;
    }
    async onStart() {
        await this._hostPatternPromise;
    }
    /**
     * Throws if `hostPatternPromise` is not yet resolved.
     */
    getEndpoint(uuid, hostname) {
        if (this._hostPattern === undefined) {
            throw new Error('MiniBrowserEnvironment is not finished initializing');
        }
        return new browser_1.Endpoint({
            path: mini_browser_endpoint_1.MiniBrowserEndpoint.PATH,
            host: this._hostPattern
                .replace('{{uuid}}', uuid)
                .replace('{{hostname}}', hostname || this.getDefaultHostname()),
        });
    }
    /**
     * Throws if `hostPatternPromise` is not yet resolved.
     */
    getRandomEndpoint() {
        return this.getEndpoint((0, uuid_1.v4)());
    }
    async getHostPattern() {
        return environment_1.environment.electron.is()
            ? mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT
            : this.environment.getValue(mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_ENV)
                .then(envVar => (envVar === null || envVar === void 0 ? void 0 : envVar.value) || mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT);
    }
    getDefaultHostname() {
        return self.location.host;
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], MiniBrowserEnvironment.prototype, "environment", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MiniBrowserEnvironment.prototype, "init", null);
MiniBrowserEnvironment = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserEnvironment);
exports.MiniBrowserEnvironment = MiniBrowserEnvironment;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/environment/mini-browser-environment'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/location-mapper-service.js":
/*!**************************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/location-mapper-service.js ***!
  \**************************************************************************/
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
exports.FileLocationMapper = exports.LocationWithoutSchemeMapper = exports.HttpsLocationMapper = exports.HttpLocationMapper = exports.LocationMapperService = exports.LocationMapper = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const types_1 = __webpack_require__(/*! @theia/core/lib/common/types */ "../../packages/core/lib/common/types.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const mini_browser_environment_1 = __webpack_require__(/*! ./environment/mini-browser-environment */ "../../packages/mini-browser/lib/browser/environment/mini-browser-environment.js");
/**
 * Contribution for the `LocationMapperService`.
 */
exports.LocationMapper = Symbol('LocationMapper');
/**
 * Location mapper service.
 */
let LocationMapperService = class LocationMapperService {
    async map(location) {
        const contributions = await this.prioritize(location);
        if (contributions.length === 0) {
            return this.defaultMapper()(location);
        }
        return contributions[0].map(location);
    }
    defaultMapper() {
        return location => `${new browser_1.Endpoint().httpScheme}//${location}`;
    }
    async prioritize(location) {
        const prioritized = await types_1.Prioritizeable.prioritizeAll(this.getContributions(), contribution => contribution.canHandle(location));
        return prioritized.map(p => p.value);
    }
    getContributions() {
        return this.contributions.getContributions();
    }
};
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(exports.LocationMapper),
    __metadata("design:type", Object)
], LocationMapperService.prototype, "contributions", void 0);
LocationMapperService = __decorate([
    (0, inversify_1.injectable)()
], LocationMapperService);
exports.LocationMapperService = LocationMapperService;
/**
 * HTTP location mapper.
 */
let HttpLocationMapper = class HttpLocationMapper {
    canHandle(location) {
        return location.startsWith('http://') ? 1 : 0;
    }
    map(location) {
        return location;
    }
};
HttpLocationMapper = __decorate([
    (0, inversify_1.injectable)()
], HttpLocationMapper);
exports.HttpLocationMapper = HttpLocationMapper;
/**
 * HTTPS location mapper.
 */
let HttpsLocationMapper = class HttpsLocationMapper {
    canHandle(location) {
        return location.startsWith('https://') ? 1 : 0;
    }
    map(location) {
        return location;
    }
};
HttpsLocationMapper = __decorate([
    (0, inversify_1.injectable)()
], HttpsLocationMapper);
exports.HttpsLocationMapper = HttpsLocationMapper;
/**
 * Location mapper for locations without a scheme.
 */
let LocationWithoutSchemeMapper = class LocationWithoutSchemeMapper {
    canHandle(location) {
        return new uri_1.default(location).scheme === '' ? 1 : 0;
    }
    map(location) {
        return `http://${location}`;
    }
};
LocationWithoutSchemeMapper = __decorate([
    (0, inversify_1.injectable)()
], LocationWithoutSchemeMapper);
exports.LocationWithoutSchemeMapper = LocationWithoutSchemeMapper;
/**
 * `file` URI location mapper.
 */
let FileLocationMapper = class FileLocationMapper {
    canHandle(location) {
        return location.startsWith('file://') ? 1 : 0;
    }
    async map(location) {
        const uri = new uri_1.default(location);
        if (uri.scheme !== 'file') {
            throw new Error(`Only URIs with 'file' scheme can be mapped to an URL. URI was: ${uri}.`);
        }
        let rawLocation = uri.path.toString();
        if (rawLocation.charAt(0) === '/') {
            rawLocation = rawLocation.substring(1);
        }
        return this.miniBrowserEnvironment.getRandomEndpoint().getRestUrl().resolve(rawLocation).toString();
    }
};
__decorate([
    (0, inversify_1.inject)(mini_browser_environment_1.MiniBrowserEnvironment),
    __metadata("design:type", mini_browser_environment_1.MiniBrowserEnvironment)
], FileLocationMapper.prototype, "miniBrowserEnvironment", void 0);
FileLocationMapper = __decorate([
    (0, inversify_1.injectable)()
], FileLocationMapper);
exports.FileLocationMapper = FileLocationMapper;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/location-mapper-service'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/mini-browser-content-style.js":
/*!*****************************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/mini-browser-content-style.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MiniBrowserContentStyle = void 0;
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
var MiniBrowserContentStyle;
(function (MiniBrowserContentStyle) {
    MiniBrowserContentStyle.MINI_BROWSER = 'theia-mini-browser';
    MiniBrowserContentStyle.TOOLBAR = 'theia-mini-browser-toolbar';
    MiniBrowserContentStyle.TOOLBAR_READ_ONLY = 'theia-mini-browser-toolbar-read-only';
    MiniBrowserContentStyle.PRE_LOAD = 'theia-mini-browser-load-indicator';
    MiniBrowserContentStyle.FADE_OUT = 'theia-fade-out';
    MiniBrowserContentStyle.CONTENT_AREA = 'theia-mini-browser-content-area';
    MiniBrowserContentStyle.PDF_CONTAINER = 'theia-mini-browser-pdf-container';
    MiniBrowserContentStyle.PREVIOUS = 'theia-mini-browser-previous';
    MiniBrowserContentStyle.NEXT = 'theia-mini-browser-next';
    MiniBrowserContentStyle.REFRESH = 'theia-mini-browser-refresh';
    MiniBrowserContentStyle.OPEN = 'theia-mini-browser-open';
    MiniBrowserContentStyle.BUTTON = 'theia-mini-browser-button';
    MiniBrowserContentStyle.DISABLED = 'theia-mini-browser-button-disabled';
    MiniBrowserContentStyle.TRANSPARENT_OVERLAY = 'theia-transparent-overlay';
    MiniBrowserContentStyle.ERROR_BAR = 'theia-mini-browser-error-bar';
})(MiniBrowserContentStyle = exports.MiniBrowserContentStyle || (exports.MiniBrowserContentStyle = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/mini-browser-content-style'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/mini-browser-content.js":
/*!***********************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/mini-browser-content.js ***!
  \***********************************************************************/
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
exports.MiniBrowserContent = exports.MiniBrowserContentFactory = exports.MiniBrowserProps = void 0;
const PDFObject = __webpack_require__(/*! pdfobject */ "../../node_modules/pdfobject/pdfobject.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const logger_1 = __webpack_require__(/*! @theia/core/lib/common/logger */ "../../packages/core/lib/common/logger.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const keybinding_1 = __webpack_require__(/*! @theia/core/lib/browser/keybinding */ "../../packages/core/lib/browser/keybinding.js");
const window_service_1 = __webpack_require__(/*! @theia/core/lib/browser/window/window-service */ "../../packages/core/lib/browser/window/window-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/widget */ "../../packages/core/lib/browser/widgets/widget.js");
const location_mapper_service_1 = __webpack_require__(/*! ./location-mapper-service */ "../../packages/mini-browser/lib/browser/location-mapper-service.js");
const application_shell_mouse_tracker_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/application-shell-mouse-tracker */ "../../packages/core/lib/browser/shell/application-shell-mouse-tracker.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const mini_browser_content_style_1 = __webpack_require__(/*! ./mini-browser-content-style */ "../../packages/mini-browser/lib/browser/mini-browser-content-style.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
/**
 * Initializer properties for the embedded browser widget.
 */
let MiniBrowserProps = class MiniBrowserProps {
};
MiniBrowserProps = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserProps);
exports.MiniBrowserProps = MiniBrowserProps;
(function (MiniBrowserProps) {
    /**
     * Enumeration of the supported `sandbox` options for the `iframe`.
     */
    let SandboxOptions;
    (function (SandboxOptions) {
        /**
         * Allows form submissions.
         */
        SandboxOptions[SandboxOptions["allow-forms"] = 0] = "allow-forms";
        /**
         * Allows popups, such as `window.open()`, `showModalDialog()`, `target=”_blank”`, etc.
         */
        SandboxOptions[SandboxOptions["allow-popups"] = 1] = "allow-popups";
        /**
         * Allows pointer lock.
         */
        SandboxOptions[SandboxOptions["allow-pointer-lock"] = 2] = "allow-pointer-lock";
        /**
         * Allows the document to maintain its origin. Pages loaded from https://example.com/ will retain access to that origin’s data.
         */
        SandboxOptions[SandboxOptions["allow-same-origin"] = 3] = "allow-same-origin";
        /**
         * Allows JavaScript execution. Also allows features to trigger automatically (as they’d be trivial to implement via JavaScript).
         */
        SandboxOptions[SandboxOptions["allow-scripts"] = 4] = "allow-scripts";
        /**
         * Allows the document to break out of the frame by navigating the top-level `window`.
         */
        SandboxOptions[SandboxOptions["allow-top-navigation"] = 5] = "allow-top-navigation";
        /**
         * Allows the embedded browsing context to open modal windows.
         */
        SandboxOptions[SandboxOptions["allow-modals"] = 6] = "allow-modals";
        /**
         * Allows the embedded browsing context to disable the ability to lock the screen orientation.
         */
        SandboxOptions[SandboxOptions["allow-orientation-lock"] = 7] = "allow-orientation-lock";
        /**
         * Allows a sandboxed document to open new windows without forcing the sandboxing flags upon them.
         * This will allow, for example, a third-party advertisement to be safely sandboxed without forcing the same restrictions upon a landing page.
         */
        SandboxOptions[SandboxOptions["allow-popups-to-escape-sandbox"] = 8] = "allow-popups-to-escape-sandbox";
        /**
         * Allows embedders to have control over whether an iframe can start a presentation session.
         */
        SandboxOptions[SandboxOptions["allow-presentation"] = 9] = "allow-presentation";
        /**
         * Allows the embedded browsing context to navigate (load) content to the top-level browsing context only when initiated by a user gesture.
         * If this keyword is not used, this operation is not allowed.
         */
        SandboxOptions[SandboxOptions["allow-top-navigation-by-user-activation"] = 10] = "allow-top-navigation-by-user-activation";
    })(SandboxOptions = MiniBrowserProps.SandboxOptions || (MiniBrowserProps.SandboxOptions = {}));
    (function (SandboxOptions) {
        /**
         * The default `sandbox` options, if other is not provided.
         *
         * See: https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/
         */
        SandboxOptions.DEFAULT = [
            SandboxOptions['allow-same-origin'],
            SandboxOptions['allow-scripts'],
            SandboxOptions['allow-popups'],
            SandboxOptions['allow-forms'],
            SandboxOptions['allow-modals']
        ];
    })(SandboxOptions = MiniBrowserProps.SandboxOptions || (MiniBrowserProps.SandboxOptions = {}));
})(MiniBrowserProps = exports.MiniBrowserProps || (exports.MiniBrowserProps = {}));
exports.MiniBrowserProps = MiniBrowserProps;
exports.MiniBrowserContentFactory = Symbol('MiniBrowserContentFactory');
let MiniBrowserContent = class MiniBrowserContent extends widget_1.BaseWidget {
    constructor(props) {
        super();
        this.props = props;
        this.submitInputEmitter = new event_1.Emitter();
        this.navigateBackEmitter = new event_1.Emitter();
        this.navigateForwardEmitter = new event_1.Emitter();
        this.refreshEmitter = new event_1.Emitter();
        this.openEmitter = new event_1.Emitter();
        this.toDisposeOnGo = new disposable_1.DisposableCollection();
        this.node.tabIndex = 0;
        this.addClass(mini_browser_content_style_1.MiniBrowserContentStyle.MINI_BROWSER);
        this.input = this.createToolbar(this.node).input;
        const contentArea = this.createContentArea(this.node);
        this.frame = contentArea.frame;
        this.transparentOverlay = contentArea.transparentOverlay;
        this.loadIndicator = contentArea.loadIndicator;
        this.errorBar = contentArea.errorBar;
        this.pdfContainer = contentArea.pdfContainer;
        this.initialHistoryLength = history.length;
        this.toDispose.pushAll([
            this.submitInputEmitter,
            this.navigateBackEmitter,
            this.navigateForwardEmitter,
            this.refreshEmitter,
            this.openEmitter
        ]);
    }
    init() {
        this.toDispose.push(this.mouseTracker.onMousedown(e => {
            if (this.frame.style.display !== 'none') {
                this.transparentOverlay.style.display = 'block';
            }
        }));
        this.toDispose.push(this.mouseTracker.onMouseup(e => {
            if (this.frame.style.display !== 'none') {
                this.transparentOverlay.style.display = 'none';
            }
        }));
        const { startPage } = this.props;
        if (startPage) {
            setTimeout(() => this.go(startPage), 500);
            this.listenOnContentChange(startPage);
        }
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        if (this.getToolbarProps() !== 'hide') {
            this.input.focus();
        }
        else {
            this.node.focus();
        }
    }
    async listenOnContentChange(location) {
        if (await this.fileService.exists(new uri_1.default(location))) {
            const fileUri = new uri_1.default(location);
            const watcher = this.fileService.watch(fileUri);
            this.toDispose.push(watcher);
            const onFileChange = (event) => {
                if (event.contains(fileUri, 1 /* ADDED */) || event.contains(fileUri, 0 /* UPDATED */)) {
                    this.go(location, {
                        showLoadIndicator: false
                    });
                }
            };
            this.toDispose.push(this.fileService.onDidFilesChange(debounce(onFileChange, 500)));
        }
    }
    createToolbar(parent) {
        const toolbar = document.createElement('div');
        toolbar.classList.add(this.getToolbarProps() === 'read-only' ? mini_browser_content_style_1.MiniBrowserContentStyle.TOOLBAR_READ_ONLY : mini_browser_content_style_1.MiniBrowserContentStyle.TOOLBAR);
        parent.appendChild(toolbar);
        this.createPrevious(toolbar);
        this.createNext(toolbar);
        this.createRefresh(toolbar);
        const input = this.createInput(toolbar);
        input.readOnly = this.getToolbarProps() === 'read-only';
        this.createOpen(toolbar);
        if (this.getToolbarProps() === 'hide') {
            toolbar.style.display = 'none';
        }
        return Object.assign(toolbar, { input });
    }
    getToolbarProps() {
        return !this.props.startPage ? 'show' : this.props.toolbar || 'show';
    }
    // eslint-disable-next-line max-len
    createContentArea(parent) {
        const contentArea = document.createElement('div');
        contentArea.classList.add(mini_browser_content_style_1.MiniBrowserContentStyle.CONTENT_AREA);
        const loadIndicator = document.createElement('div');
        loadIndicator.classList.add(mini_browser_content_style_1.MiniBrowserContentStyle.PRE_LOAD);
        loadIndicator.style.display = 'none';
        const errorBar = this.createErrorBar();
        const frame = this.createIFrame();
        this.submitInputEmitter.event(input => this.go(input, {
            preserveFocus: false
        }));
        this.navigateBackEmitter.event(this.handleBack.bind(this));
        this.navigateForwardEmitter.event(this.handleForward.bind(this));
        this.refreshEmitter.event(this.handleRefresh.bind(this));
        this.openEmitter.event(this.handleOpen.bind(this));
        const transparentOverlay = document.createElement('div');
        transparentOverlay.classList.add(mini_browser_content_style_1.MiniBrowserContentStyle.TRANSPARENT_OVERLAY);
        transparentOverlay.style.display = 'none';
        const pdfContainer = document.createElement('div');
        pdfContainer.classList.add(mini_browser_content_style_1.MiniBrowserContentStyle.PDF_CONTAINER);
        pdfContainer.id = `${this.id}-pdf-container`;
        pdfContainer.style.display = 'none';
        contentArea.appendChild(errorBar);
        contentArea.appendChild(transparentOverlay);
        contentArea.appendChild(pdfContainer);
        contentArea.appendChild(loadIndicator);
        contentArea.appendChild(frame);
        parent.appendChild(contentArea);
        return Object.assign(contentArea, { frame, loadIndicator, errorBar, pdfContainer, transparentOverlay });
    }
    createIFrame() {
        const frame = document.createElement('iframe');
        const sandbox = (this.props.sandbox || MiniBrowserProps.SandboxOptions.DEFAULT).map(name => MiniBrowserProps.SandboxOptions[name]);
        frame.sandbox.add(...sandbox);
        this.toDispose.push((0, widget_1.addEventListener)(frame, 'load', this.onFrameLoad.bind(this)));
        this.toDispose.push((0, widget_1.addEventListener)(frame, 'error', this.onFrameError.bind(this)));
        return frame;
    }
    createErrorBar() {
        const errorBar = document.createElement('div');
        errorBar.classList.add(mini_browser_content_style_1.MiniBrowserContentStyle.ERROR_BAR);
        errorBar.style.display = 'none';
        const icon = document.createElement('span');
        icon.classList.add(...(0, widget_1.codiconArray)('info'));
        errorBar.appendChild(icon);
        const message = document.createElement('span');
        errorBar.appendChild(message);
        return Object.assign(errorBar, { message });
    }
    onFrameLoad() {
        clearTimeout(this.frameLoadTimeout);
        this.maybeResetBackground();
        this.hideLoadIndicator();
        this.hideErrorBar();
    }
    onFrameError() {
        clearTimeout(this.frameLoadTimeout);
        this.maybeResetBackground();
        this.hideLoadIndicator();
        this.showErrorBar('An error occurred while loading this page');
    }
    onFrameTimeout() {
        clearTimeout(this.frameLoadTimeout);
        this.maybeResetBackground();
        this.hideLoadIndicator();
        this.showErrorBar('Still loading...');
    }
    showLoadIndicator() {
        this.loadIndicator.classList.remove(mini_browser_content_style_1.MiniBrowserContentStyle.FADE_OUT);
        this.loadIndicator.style.display = 'block';
    }
    hideLoadIndicator() {
        // Start the fade-out transition.
        this.loadIndicator.classList.add(mini_browser_content_style_1.MiniBrowserContentStyle.FADE_OUT);
        // Actually hide the load indicator after the transition is finished.
        const preloadStyle = window.getComputedStyle(this.loadIndicator);
        const transitionDuration = (0, browser_1.parseCssTime)(preloadStyle.transitionDuration, 0);
        setTimeout(() => {
            // But don't hide it if it was shown again since the transition started.
            if (this.loadIndicator.classList.contains(mini_browser_content_style_1.MiniBrowserContentStyle.FADE_OUT)) {
                this.loadIndicator.style.display = 'none';
                this.loadIndicator.classList.remove(mini_browser_content_style_1.MiniBrowserContentStyle.FADE_OUT);
            }
        }, transitionDuration);
    }
    showErrorBar(message) {
        this.errorBar.message.textContent = message;
        this.errorBar.style.display = 'block';
    }
    hideErrorBar() {
        this.errorBar.message.textContent = '';
        this.errorBar.style.display = 'none';
    }
    maybeResetBackground() {
        if (this.props.resetBackground === true) {
            this.frame.style.backgroundColor = 'white';
        }
    }
    handleBack() {
        if (history.length - this.initialHistoryLength > 0) {
            history.back();
        }
    }
    handleForward() {
        if (history.length > this.initialHistoryLength) {
            history.forward();
        }
    }
    handleRefresh() {
        // Initial pessimism; use the location of the input.
        let location = this.props.startPage;
        // Use the the location from the `input`.
        if (this.input && this.input.value) {
            location = this.input.value;
        }
        try {
            const { contentDocument } = this.frame;
            if (contentDocument && contentDocument.location) {
                location = contentDocument.location.href;
            }
        }
        catch {
            // Security exception due to CORS when trying to access the `location.href` of the content document.
        }
        if (location) {
            this.go(location, {
                preserveFocus: false
            });
        }
    }
    handleOpen() {
        const location = this.frameSrc() || this.input.value;
        if (location) {
            this.windowService.openNewWindow(location);
        }
    }
    createInput(parent) {
        const input = document.createElement('input');
        input.type = 'text';
        input.spellcheck = false;
        input.classList.add('theia-input');
        this.toDispose.pushAll([
            (0, widget_1.addEventListener)(input, 'keydown', this.handleInputChange.bind(this)),
            (0, widget_1.addEventListener)(input, 'click', () => {
                if (this.getToolbarProps() === 'read-only') {
                    this.handleOpen();
                }
                else {
                    if (input.value) {
                        input.select();
                    }
                }
            })
        ]);
        parent.appendChild(input);
        return input;
    }
    handleInputChange(e) {
        const { key } = browser_1.KeyCode.createKeyCode(e);
        if (key && browser_1.Key.ENTER.keyCode === key.keyCode && this.getToolbarProps() === 'show') {
            const { target } = e;
            if (target instanceof HTMLInputElement) {
                this.mapLocation(target.value).then(location => this.submitInputEmitter.fire(location));
            }
        }
    }
    createPrevious(parent) {
        return this.onClick(this.createButton(parent, 'Show The Previous Page', mini_browser_content_style_1.MiniBrowserContentStyle.PREVIOUS), this.navigateBackEmitter);
    }
    createNext(parent) {
        return this.onClick(this.createButton(parent, 'Show The Next Page', mini_browser_content_style_1.MiniBrowserContentStyle.NEXT), this.navigateForwardEmitter);
    }
    createRefresh(parent) {
        return this.onClick(this.createButton(parent, 'Reload This Page', mini_browser_content_style_1.MiniBrowserContentStyle.REFRESH), this.refreshEmitter);
    }
    createOpen(parent) {
        const button = this.onClick(this.createButton(parent, 'Open In A New Window', mini_browser_content_style_1.MiniBrowserContentStyle.OPEN), this.openEmitter);
        return button;
    }
    createButton(parent, title, ...className) {
        const button = document.createElement('div');
        button.title = title;
        button.classList.add(...className, mini_browser_content_style_1.MiniBrowserContentStyle.BUTTON);
        parent.appendChild(button);
        return button;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick(element, emitter) {
        this.toDispose.push((0, widget_1.addEventListener)(element, 'click', () => {
            if (!element.classList.contains(mini_browser_content_style_1.MiniBrowserContentStyle.DISABLED)) {
                emitter.fire(undefined);
            }
        }));
        return element;
    }
    mapLocation(location) {
        return this.locationMapper.map(location);
    }
    setInput(value) {
        if (this.input.value !== value) {
            this.input.value = value;
        }
    }
    frameSrc() {
        let src = this.frame.src;
        try {
            const { contentWindow } = this.frame;
            if (contentWindow) {
                src = contentWindow.location.href;
            }
        }
        catch {
            // CORS issue. Ignored.
        }
        if (src === 'about:blank') {
            src = '';
        }
        return src;
    }
    contentDocument() {
        try {
            let { contentDocument } = this.frame;
            // eslint-disable-next-line no-null/no-null
            if (contentDocument === null) {
                const { contentWindow } = this.frame;
                if (contentWindow) {
                    contentDocument = contentWindow.document;
                }
            }
            return contentDocument;
        }
        catch {
            // eslint-disable-next-line no-null/no-null
            return null;
        }
    }
    async go(location, options) {
        const { showLoadIndicator, preserveFocus } = {
            showLoadIndicator: true,
            preserveFocus: true,
            ...options
        };
        if (location) {
            try {
                this.toDisposeOnGo.dispose();
                const url = await this.mapLocation(location);
                this.setInput(url);
                if (this.getToolbarProps() === 'read-only') {
                    this.input.title = `Open ${url} In A New Window`;
                }
                clearTimeout(this.frameLoadTimeout);
                this.frameLoadTimeout = window.setTimeout(this.onFrameTimeout.bind(this), 4000);
                if (showLoadIndicator) {
                    this.showLoadIndicator();
                }
                if (url.endsWith('.pdf')) {
                    this.pdfContainer.style.display = 'block';
                    this.frame.style.display = 'none';
                    PDFObject.embed(url, this.pdfContainer, {
                        // eslint-disable-next-line max-len, @typescript-eslint/quotes
                        fallbackLink: `<p style="padding: 0px 15px 0px 15px">Your browser does not support inline PDFs. Click on this <a href='[url]' target="_blank">link</a> to open the PDF in a new tab.</p>`
                    });
                    clearTimeout(this.frameLoadTimeout);
                    this.hideLoadIndicator();
                    if (!preserveFocus) {
                        this.pdfContainer.focus();
                    }
                }
                else {
                    this.pdfContainer.style.display = 'none';
                    this.frame.style.display = 'block';
                    this.frame.src = url;
                    // The load indicator will hide itself if the content of the iframe was loaded.
                    if (!preserveFocus) {
                        this.frame.addEventListener('load', () => {
                            const window = this.frame.contentWindow;
                            if (window) {
                                window.focus();
                            }
                        }, { once: true });
                    }
                }
                // Delegate all the `keypress` events from the `iframe` to the application.
                this.toDisposeOnGo.push((0, widget_1.addEventListener)(this.frame, 'load', () => {
                    try {
                        const { contentDocument } = this.frame;
                        if (contentDocument) {
                            const keypressHandler = (e) => this.keybindings.run(e);
                            contentDocument.addEventListener('keypress', keypressHandler, true);
                            this.toDisposeOnDetach.push(disposable_1.Disposable.create(() => contentDocument.removeEventListener('keypress', keypressHandler)));
                        }
                    }
                    catch {
                        // There is not much we could do with the security exceptions due to CORS.
                    }
                }));
            }
            catch (e) {
                clearTimeout(this.frameLoadTimeout);
                this.hideLoadIndicator();
                this.showErrorBar(String(e));
                console.log(e);
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], MiniBrowserContent.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], MiniBrowserContent.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.inject)(location_mapper_service_1.LocationMapperService),
    __metadata("design:type", location_mapper_service_1.LocationMapperService)
], MiniBrowserContent.prototype, "locationMapper", void 0);
__decorate([
    (0, inversify_1.inject)(keybinding_1.KeybindingRegistry),
    __metadata("design:type", keybinding_1.KeybindingRegistry)
], MiniBrowserContent.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(application_shell_mouse_tracker_1.ApplicationShellMouseTracker),
    __metadata("design:type", application_shell_mouse_tracker_1.ApplicationShellMouseTracker)
], MiniBrowserContent.prototype, "mouseTracker", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MiniBrowserContent.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MiniBrowserContent.prototype, "init", null);
MiniBrowserContent = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(MiniBrowserProps)),
    __metadata("design:paramtypes", [MiniBrowserProps])
], MiniBrowserContent);
exports.MiniBrowserContent = MiniBrowserContent;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/mini-browser-content'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/mini-browser-open-handler.js":
/*!****************************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/mini-browser-open-handler.js ***!
  \****************************************************************************/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MiniBrowserOpenHandler_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MiniBrowserOpenHandler = exports.MiniBrowserCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const navigatable_1 = __webpack_require__(/*! @theia/core/lib/browser/navigatable */ "../../packages/core/lib/browser/navigatable.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const mini_browser_service_1 = __webpack_require__(/*! ../common/mini-browser-service */ "../../packages/mini-browser/lib/common/mini-browser-service.js");
const mini_browser_1 = __webpack_require__(/*! ./mini-browser */ "../../packages/mini-browser/lib/browser/mini-browser.js");
const location_mapper_service_1 = __webpack_require__(/*! ./location-mapper-service */ "../../packages/mini-browser/lib/browser/location-mapper-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
var MiniBrowserCommands;
(function (MiniBrowserCommands) {
    MiniBrowserCommands.PREVIEW_CATEGORY = 'Preview';
    MiniBrowserCommands.PREVIEW_CATEGORY_KEY = nls_1.nls.getDefaultKey(MiniBrowserCommands.PREVIEW_CATEGORY);
    MiniBrowserCommands.PREVIEW = command_1.Command.toLocalizedCommand({
        id: 'mini-browser.preview',
        label: 'Open Preview',
        iconClass: (0, browser_1.codicon)('open-preview')
    }, 'vscode.markdown-language-features/package/markdown.preview.title');
    MiniBrowserCommands.OPEN_SOURCE = {
        id: 'mini-browser.open.source',
        iconClass: (0, browser_1.codicon)('go-to-file')
    };
    MiniBrowserCommands.OPEN_URL = command_1.Command.toDefaultLocalizedCommand({
        id: 'mini-browser.openUrl',
        category: MiniBrowserCommands.PREVIEW_CATEGORY,
        label: 'Open URL'
    });
})(MiniBrowserCommands = exports.MiniBrowserCommands || (exports.MiniBrowserCommands = {}));
let MiniBrowserOpenHandler = MiniBrowserOpenHandler_1 = class MiniBrowserOpenHandler extends navigatable_1.NavigatableWidgetOpenHandler {
    constructor() {
        super(...arguments);
        /**
         * Instead of going to the backend with each file URI to ask whether it can handle the current file or not,
         * we have this map of extension and priority pairs that we populate at application startup.
         * The real advantage of this approach is the following: [Phosphor cannot run async code when invoking `isEnabled`/`isVisible`
         * for the command handlers](https://github.com/eclipse-theia/theia/issues/1958#issuecomment-392829371)
         * so the menu item would be always visible for the user even if the file type cannot be handled eventually.
         * Hopefully, we could get rid of this hack once we have migrated the existing Phosphor code to [React](https://github.com/eclipse-theia/theia/issues/1915).
         */
        this.supportedExtensions = new Map();
        this.id = mini_browser_1.MiniBrowser.ID;
        this.label = nls_1.nls.localize(MiniBrowserCommands.PREVIEW_CATEGORY_KEY, MiniBrowserCommands.PREVIEW_CATEGORY);
    }
    onStart() {
        this.miniBrowserService.supportedFileExtensions().then(entries => {
            entries.forEach(entry => {
                const { extension, priority } = entry;
                this.supportedExtensions.set(extension, priority);
            });
        });
    }
    canHandle(uri, options) {
        // It does not guard against directories. For instance, a folder with this name: `Hahahah.html`.
        // We could check with the FS, but then, this method would become async again.
        const extension = uri.toString().split('.').pop();
        if (!extension) {
            return 0;
        }
        if ((options === null || options === void 0 ? void 0 : options.openFor) === 'source') {
            return -100;
        }
        else if ((options === null || options === void 0 ? void 0 : options.openFor) === 'preview') {
            return 200; // higher than that of the editor.
        }
        else {
            return this.supportedExtensions.get(extension.toLocaleLowerCase()) || 0;
        }
    }
    async open(uri, options) {
        const widget = await super.open(uri, options);
        const area = this.shell.getAreaFor(widget);
        if (area === 'right' || area === 'left') {
            const panelLayout = area === 'right' ? this.shell.getLayoutData().rightPanel : this.shell.getLayoutData().leftPanel;
            const minSize = this.shell.mainPanel.node.offsetWidth / 2;
            if (panelLayout && panelLayout.size && panelLayout.size <= minSize) {
                requestAnimationFrame(() => this.shell.resize(minSize, area));
            }
        }
        return widget;
    }
    async getOrCreateWidget(uri, options) {
        const props = await this.options(uri, options);
        const widget = await super.getOrCreateWidget(uri, props);
        widget.setProps(props);
        return widget;
    }
    async options(uri, options) {
        // Get the default options.
        let result = await this.defaultOptions();
        if (uri) {
            // Decorate it with a few properties inferred from the URI.
            const startPage = uri.toString(true);
            const name = this.labelProvider.getName(uri);
            const iconClass = `${this.labelProvider.getIcon(uri)} file-icon`;
            // The background has to be reset to white only for "real" web-pages but not for images, for instance.
            const resetBackground = await this.resetBackground(uri);
            result = {
                ...result,
                startPage,
                name,
                iconClass,
                // Make sure the toolbar is not visible. We have the `iframe.src` anyway.
                toolbar: 'hide',
                resetBackground
            };
        }
        if (options) {
            // Explicit options overrule everything.
            result = {
                ...result,
                ...options
            };
        }
        return result;
    }
    resetBackground(uri) {
        const { scheme } = uri;
        const uriStr = uri.toString();
        return scheme === 'http'
            || scheme === 'https'
            || (scheme === 'file'
                && (uriStr.endsWith('html') || uriStr.endsWith('.htm')));
    }
    async defaultOptions() {
        return {
            mode: 'activate',
            widgetOptions: { area: 'main' },
            sandbox: mini_browser_1.MiniBrowserProps.SandboxOptions.DEFAULT,
            toolbar: 'show'
        };
    }
    registerCommands(commands) {
        commands.registerCommand(MiniBrowserCommands.PREVIEW, {
            execute: widget => this.preview(widget),
            isEnabled: widget => this.canPreviewWidget(widget),
            isVisible: widget => this.canPreviewWidget(widget)
        });
        commands.registerCommand(MiniBrowserCommands.OPEN_SOURCE, {
            execute: widget => this.openSource(widget),
            isEnabled: widget => !!this.getSourceUri(widget),
            isVisible: widget => !!this.getSourceUri(widget)
        });
        commands.registerCommand(MiniBrowserCommands.OPEN_URL, {
            execute: (arg) => this.openUrl(arg)
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(['editor_context_menu', 'navigation'], {
            commandId: MiniBrowserCommands.PREVIEW.id
        });
    }
    registerToolbarItems(toolbar) {
        toolbar.registerItem({
            id: MiniBrowserCommands.PREVIEW.id,
            command: MiniBrowserCommands.PREVIEW.id,
            tooltip: nls_1.nls.localize('vscode.markdown-language-features/package/markdown.previewSide.title', 'Open Preview to the Side')
        });
        toolbar.registerItem({
            id: MiniBrowserCommands.OPEN_SOURCE.id,
            command: MiniBrowserCommands.OPEN_SOURCE.id,
            tooltip: nls_1.nls.localize('vscode.markdown-language-features/package/markdown.showSource.title', 'Open Source')
        });
    }
    canPreviewWidget(widget) {
        const uri = this.getUriToPreview(widget);
        return !!uri && !!this.canHandle(uri);
    }
    getUriToPreview(widget) {
        const current = this.getWidgetToPreview(widget);
        return current && current.getResourceUri();
    }
    getWidgetToPreview(widget) {
        const current = widget ? widget : this.shell.currentWidget;
        // MiniBrowser is NavigatableWidget and should be excluded from widgets to preview
        return !(current instanceof mini_browser_1.MiniBrowser) && navigatable_1.NavigatableWidget.is(current) && current || undefined;
    }
    async preview(widget) {
        const ref = this.getWidgetToPreview(widget);
        if (!ref) {
            return;
        }
        const uri = ref.getResourceUri();
        if (!uri) {
            return;
        }
        await this.open(uri, {
            mode: 'reveal',
            widgetOptions: { ref, mode: 'open-to-right' },
            openFor: 'preview'
        });
    }
    async openSource(ref) {
        const uri = this.getSourceUri(ref);
        if (uri) {
            await (0, opener_service_1.open)(this.openerService, uri, {
                widgetOptions: { ref, mode: 'tab-after' },
                openFor: 'source'
            });
        }
    }
    getSourceUri(ref) {
        const uri = ref instanceof mini_browser_1.MiniBrowser && ref.getResourceUri() || undefined;
        if (!uri || uri.scheme === 'http' || uri.scheme === 'https' || uri.isEqual(MiniBrowserOpenHandler_1.PREVIEW_URI)) {
            return undefined;
        }
        return uri;
    }
    async openUrl(arg) {
        var _a;
        const url = arg ? arg : await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.input({
            prompt: nls_1.nls.localizeByDefault('URL to open'),
            placeHolder: nls_1.nls.localize('theia/mini-browser/typeUrl', 'Type a URL')
        }));
        if (url) {
            await this.openPreview(url);
        }
    }
    async openPreview(startPage) {
        const props = await this.getOpenPreviewProps(await this.locationMapperService.map(startPage));
        return this.open(MiniBrowserOpenHandler_1.PREVIEW_URI, props);
    }
    async getOpenPreviewProps(startPage) {
        const resetBackground = await this.resetBackground(new uri_1.default(startPage));
        return {
            name: nls_1.nls.localize(MiniBrowserCommands.PREVIEW_CATEGORY_KEY, MiniBrowserCommands.PREVIEW_CATEGORY),
            startPage,
            toolbar: 'read-only',
            widgetOptions: {
                area: 'right'
            },
            resetBackground,
            iconClass: (0, browser_1.codicon)('preview'),
            openFor: 'preview'
        };
    }
};
MiniBrowserOpenHandler.PREVIEW_URI = new uri_1.default().withScheme('__minibrowser__preview__');
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], MiniBrowserOpenHandler.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], MiniBrowserOpenHandler.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], MiniBrowserOpenHandler.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(mini_browser_service_1.MiniBrowserService),
    __metadata("design:type", Object)
], MiniBrowserOpenHandler.prototype, "miniBrowserService", void 0);
__decorate([
    (0, inversify_1.inject)(location_mapper_service_1.LocationMapperService),
    __metadata("design:type", location_mapper_service_1.LocationMapperService)
], MiniBrowserOpenHandler.prototype, "locationMapperService", void 0);
MiniBrowserOpenHandler = MiniBrowserOpenHandler_1 = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserOpenHandler);
exports.MiniBrowserOpenHandler = MiniBrowserOpenHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/mini-browser-open-handler'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/mini-browser.js":
/*!***************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/mini-browser.js ***!
  \***************************************************************/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MiniBrowser_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MiniBrowser = exports.MiniBrowserOptions = exports.MiniBrowserProps = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/widget */ "../../packages/core/lib/browser/widgets/widget.js");
const mini_browser_content_1 = __webpack_require__(/*! ./mini-browser-content */ "../../packages/mini-browser/lib/browser/mini-browser-content.js");
Object.defineProperty(exports, "MiniBrowserProps", ({ enumerable: true, get: function () { return mini_browser_content_1.MiniBrowserProps; } }));
let MiniBrowserOptions = class MiniBrowserOptions {
};
MiniBrowserOptions = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserOptions);
exports.MiniBrowserOptions = MiniBrowserOptions;
let MiniBrowser = MiniBrowser_1 = class MiniBrowser extends widget_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.toDisposeOnProps = new disposable_1.DisposableCollection();
    }
    init() {
        const { uri } = this.options;
        this.id = `${MiniBrowser_1.ID}:${uri.toString()}`;
        this.title.closable = true;
        this.layout = new widget_1.PanelLayout({ fitPolicy: 'set-no-constraint' });
    }
    getResourceUri() {
        return this.options.uri;
    }
    createMoveToUri(resourceUri) {
        return this.options.uri && this.options.uri.withPath(resourceUri.path);
    }
    setProps(raw) {
        const props = {
            toolbar: raw.toolbar,
            startPage: raw.startPage,
            sandbox: raw.sandbox,
            iconClass: raw.iconClass,
            name: raw.name,
            resetBackground: raw.resetBackground
        };
        if (JSON.stringify(props) === JSON.stringify(this.props)) {
            return;
        }
        this.toDisposeOnProps.dispose();
        this.toDispose.push(this.toDisposeOnProps);
        this.props = props;
        this.title.caption = this.title.label = props.name || 'Browser';
        this.title.iconClass = props.iconClass || MiniBrowser_1.ICON;
        const content = this.createContent(props);
        this.layout.addWidget(content);
        this.toDisposeOnProps.push(content);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        const widget = this.layout.widgets[0];
        if (widget) {
            widget.activate();
        }
    }
    storeState() {
        const { props } = this;
        return { props };
    }
    restoreState(oldState) {
        if (!this.toDisposeOnProps.disposed) {
            return;
        }
        if ('props' in oldState) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.setProps(oldState['props']);
        }
    }
};
MiniBrowser.ID = 'mini-browser';
MiniBrowser.ICON = (0, widget_1.codicon)('globe');
__decorate([
    (0, inversify_1.inject)(MiniBrowserOptions),
    __metadata("design:type", MiniBrowserOptions)
], MiniBrowser.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(mini_browser_content_1.MiniBrowserContentFactory),
    __metadata("design:type", Function)
], MiniBrowser.prototype, "createContent", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MiniBrowser.prototype, "init", null);
MiniBrowser = MiniBrowser_1 = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowser);
exports.MiniBrowser = MiniBrowser;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/mini-browser'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/common/mini-browser-endpoint.js":
/*!***********************************************************************!*\
  !*** ../../packages/mini-browser/lib/common/mini-browser-endpoint.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
exports.MiniBrowserEndpoint = void 0;
/**
 * The mini-browser can now serve content on its own host/origin.
 *
 * The virtual host can be configured with this `THEIA_MINI_BROWSER_HOST_PATTERN`
 * environment variable. `{{hostname}}` represents the current host, and `{{uuid}}`
 * will be replace by a random uuid value.
 */
var MiniBrowserEndpoint;
(function (MiniBrowserEndpoint) {
    MiniBrowserEndpoint.PATH = '/mini-browser';
    MiniBrowserEndpoint.HOST_PATTERN_ENV = 'THEIA_MINI_BROWSER_HOST_PATTERN';
    MiniBrowserEndpoint.HOST_PATTERN_DEFAULT = '{{uuid}}.mini-browser.{{hostname}}';
})(MiniBrowserEndpoint = exports.MiniBrowserEndpoint || (exports.MiniBrowserEndpoint = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/common/mini-browser-endpoint'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/common/mini-browser-service.js":
/*!**********************************************************************!*\
  !*** ../../packages/mini-browser/lib/common/mini-browser-service.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
exports.MiniBrowserService = exports.MiniBrowserServicePath = void 0;
exports.MiniBrowserServicePath = '/services/mini-browser-service';
exports.MiniBrowserService = Symbol('MiniBrowserService');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/common/mini-browser-service'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_mini-browser_lib_browser_mini-browser-open-handler_js.js.map