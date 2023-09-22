"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_lib_browser_window_browser-window-module_js"],{

/***/ "../../packages/core/lib/browser/browser-clipboard-service.js":
/*!********************************************************************!*\
  !*** ../../packages/core/lib/browser/browser-clipboard-service.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.BrowserClipboardService = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const browser_1 = __webpack_require__(/*! ./browser */ "../../packages/core/lib/browser/browser.js");
const logger_1 = __webpack_require__(/*! ../common/logger */ "../../packages/core/lib/common/logger.js");
const message_service_1 = __webpack_require__(/*! ../common/message-service */ "../../packages/core/lib/common/message-service.js");
const nls_1 = __webpack_require__(/*! ../common/nls */ "../../packages/core/lib/common/nls.js");
let BrowserClipboardService = class BrowserClipboardService {
    async readText() {
        let permission;
        try {
            permission = await this.queryPermission('clipboard-read');
        }
        catch (e1) {
            this.logger.error('Failed checking a clipboard-read permission.', e1);
            // in FireFox, Clipboard API isn't gated with the permissions
            try {
                return await this.getClipboardAPI().readText();
            }
            catch (e2) {
                this.logger.error('Failed reading clipboard content.', e2);
                if (browser_1.isFirefox) {
                    this.messageService.warn(nls_1.nls.localize('theia/navigator/clipboardWarnFirefox', 
                    // eslint-disable-next-line max-len
                    "Clipboard API is not available. It can be enabled by '{0}' preference on '{1}' page. Then reload Theia. Note, it will allow FireFox getting full access to the system clipboard.", 'dom.events.testing.asyncClipboard', 'about:config'));
                }
                return '';
            }
        }
        if (permission.state === 'denied') {
            // most likely, the user intentionally denied the access
            this.messageService.warn(nls_1.nls.localize('theia/navigator/clipboardWarn', "Access to the clipboard is denied. Check your browser's permission."));
            return '';
        }
        return this.getClipboardAPI().readText();
    }
    async writeText(value) {
        let permission;
        try {
            permission = await this.queryPermission('clipboard-write');
        }
        catch (e1) {
            this.logger.error('Failed checking a clipboard-write permission.', e1);
            // in FireFox, Clipboard API isn't gated with the permissions
            try {
                await this.getClipboardAPI().writeText(value);
                return;
            }
            catch (e2) {
                this.logger.error('Failed writing to the clipboard.', e2);
                if (browser_1.isFirefox) {
                    this.messageService.warn(nls_1.nls.localize('theia/core/navigator/clipboardWarnFirefox', 
                    // eslint-disable-next-line max-len
                    "Clipboard API is not available. It can be enabled by '{0}' preference on '{1}' page. Then reload Theia. Note, it will allow FireFox getting full access to the system clipboard.", 'dom.events.testing.asyncClipboard', 'about:config'));
                }
                return;
            }
        }
        if (permission.state === 'denied') {
            // most likely, the user intentionally denied the access
            this.messageService.warn(nls_1.nls.localize('theia/core/navigator/clipboardWarn', "Access to the clipboard is denied. Check your browser's permission."));
            return;
        }
        return this.getClipboardAPI().writeText(value);
    }
    async queryPermission(name) {
        if ('permissions' in navigator) {
            return navigator['permissions'].query({ name: name });
        }
        throw new Error('Permissions API unavailable');
    }
    getClipboardAPI() {
        if ('clipboard' in navigator) {
            return navigator['clipboard'];
        }
        throw new Error('Async Clipboard API unavailable');
    }
};
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], BrowserClipboardService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], BrowserClipboardService.prototype, "logger", void 0);
BrowserClipboardService = __decorate([
    (0, inversify_1.injectable)()
], BrowserClipboardService);
exports.BrowserClipboardService = BrowserClipboardService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/browser-clipboard-service'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/window/browser-window-module.js":
/*!***********************************************************************!*\
  !*** ../../packages/core/lib/browser/window/browser-window-module.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const window_service_1 = __webpack_require__(/*! ../../browser/window/window-service */ "../../packages/core/lib/browser/window/window-service.js");
const default_window_service_1 = __webpack_require__(/*! ../../browser/window/default-window-service */ "../../packages/core/lib/browser/window/default-window-service.js");
const frontend_application_1 = __webpack_require__(/*! ../frontend-application */ "../../packages/core/lib/browser/frontend-application.js");
const clipboard_service_1 = __webpack_require__(/*! ../clipboard-service */ "../../packages/core/lib/browser/clipboard-service.js");
const browser_clipboard_service_1 = __webpack_require__(/*! ../browser-clipboard-service */ "../../packages/core/lib/browser/browser-clipboard-service.js");
const secondary_window_service_1 = __webpack_require__(/*! ./secondary-window-service */ "../../packages/core/lib/browser/window/secondary-window-service.js");
const default_secondary_window_service_1 = __webpack_require__(/*! ./default-secondary-window-service */ "../../packages/core/lib/browser/window/default-secondary-window-service.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(default_window_service_1.DefaultWindowService).toSelf().inSingletonScope();
    bind(window_service_1.WindowService).toService(default_window_service_1.DefaultWindowService);
    bind(frontend_application_1.FrontendApplicationContribution).toService(default_window_service_1.DefaultWindowService);
    bind(clipboard_service_1.ClipboardService).to(browser_clipboard_service_1.BrowserClipboardService).inSingletonScope();
    bind(secondary_window_service_1.SecondaryWindowService).to(default_secondary_window_service_1.DefaultSecondaryWindowService).inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/window/browser-window-module'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/window/default-secondary-window-service.js":
/*!**********************************************************************************!*\
  !*** ../../packages/core/lib/browser/window/default-secondary-window-service.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DefaultSecondaryWindowService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultSecondaryWindowService = void 0;
// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics, Ericsson, ARM, EclipseSource and others.
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
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const window_service_1 = __webpack_require__(/*! ./window-service */ "../../packages/core/lib/browser/window/window-service.js");
const saveable_1 = __webpack_require__(/*! ../saveable */ "../../packages/core/lib/browser/saveable.js");
let DefaultSecondaryWindowService = DefaultSecondaryWindowService_1 = class DefaultSecondaryWindowService {
    constructor() {
        /**
         * Randomized prefix to be included in opened windows' ids.
         * This avoids conflicts when creating sub-windows from multiple theia instances (e.g. by opening Theia multiple times in the same browser)
         */
        this.prefix = crypto.getRandomValues(new Uint32Array(1))[0];
        /** Unique id. Increase after every access. */
        this.nextId = 0;
        this.secondaryWindows = [];
    }
    init() {
        // Set up messaging with secondary windows
        window.addEventListener('message', (event) => {
            console.trace('Message on main window', event);
            if (event.data.fromSecondary) {
                console.trace('Message comes from secondary window');
                return;
            }
            if (event.data.fromMain) {
                console.trace('Message has mainWindow marker, therefore ignore it');
                return;
            }
            // Filter setImmediate messages. Do not forward because these come in with very high frequency.
            // They are not needed in secondary windows because these messages are just a work around
            // to make setImmediate work in the main window: https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
            if (typeof event.data === 'string' && event.data.startsWith('setImmediate')) {
                return;
            }
            console.trace('Delegate main window message to secondary windows', event);
            this.secondaryWindows.forEach(secondaryWindow => {
                if (!secondaryWindow.window.closed) {
                    secondaryWindow.window.postMessage({ ...event.data, fromMain: true }, '*');
                }
            });
        });
        // Close all open windows when the main window is closed.
        this.windowService.onUnload(() => {
            // Iterate backwards because calling window.close might remove the window from the array
            for (let i = this.secondaryWindows.length - 1; i >= 0; i--) {
                this.secondaryWindows[i].close();
            }
        });
    }
    createSecondaryWindow(widget, shell) {
        const win = this.doCreateSecondaryWindow(widget, shell);
        if (win) {
            this.secondaryWindows.push(win);
            win.addEventListener('close', () => {
                const extIndex = this.secondaryWindows.indexOf(win);
                if (extIndex > -1) {
                    this.secondaryWindows.splice(extIndex, 1);
                }
                ;
            });
        }
        return win;
    }
    findWindow(windowName) {
        for (const w of this.secondaryWindows) {
            if (w.name === windowName) {
                return w;
            }
        }
        return undefined;
    }
    doCreateSecondaryWindow(widget, shell) {
        var _a;
        const newWindow = (_a = window.open(DefaultSecondaryWindowService_1.SECONDARY_WINDOW_URL, this.nextWindowId(), 'popup')) !== null && _a !== void 0 ? _a : undefined;
        if (newWindow) {
            newWindow.addEventListener('DOMContentLoaded', () => {
                newWindow.addEventListener('beforeunload', evt => {
                    const saveable = saveable_1.Saveable.get(widget);
                    const wouldLoseState = !!saveable && saveable.dirty && saveable.autoSave === 'off';
                    if (wouldLoseState) {
                        evt.returnValue = '';
                        evt.preventDefault();
                        return 'non-empty';
                    }
                }, { capture: true });
                newWindow.addEventListener('close', () => {
                    const saveable = saveable_1.Saveable.get(widget);
                    shell.closeWidget(widget.id, {
                        save: !!saveable && saveable.dirty && saveable.autoSave !== 'off'
                    });
                });
            });
        }
        return newWindow;
    }
    focus(win) {
        win.focus();
    }
    nextWindowId() {
        return `${this.prefix}-secondaryWindow-${this.nextId++}`;
    }
};
// secondary-window.html is part of Theia's generated code. It is generated by dev-packages/application-manager/src/generator/frontend-generator.ts
DefaultSecondaryWindowService.SECONDARY_WINDOW_URL = 'secondary-window.html';
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], DefaultSecondaryWindowService.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DefaultSecondaryWindowService.prototype, "init", null);
DefaultSecondaryWindowService = DefaultSecondaryWindowService_1 = __decorate([
    (0, inversify_1.injectable)()
], DefaultSecondaryWindowService);
exports.DefaultSecondaryWindowService = DefaultSecondaryWindowService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/window/default-secondary-window-service'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/window/default-window-service.js":
/*!************************************************************************!*\
  !*** ../../packages/core/lib/browser/window/default-window-service.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.DefaultWindowService = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/core/lib/common/index.js");
const core_preferences_1 = __webpack_require__(/*! ../core-preferences */ "../../packages/core/lib/browser/core-preferences.js");
const contribution_provider_1 = __webpack_require__(/*! ../../common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const frontend_application_1 = __webpack_require__(/*! ../frontend-application */ "../../packages/core/lib/browser/frontend-application.js");
const window_1 = __webpack_require__(/*! ../../common/window */ "../../packages/core/lib/common/window.js");
const dialogs_1 = __webpack_require__(/*! ../dialogs */ "../../packages/core/lib/browser/dialogs.js");
const frontend_application_state_1 = __webpack_require__(/*! ../../common/frontend-application-state */ "../../packages/core/lib/common/frontend-application-state.js");
let DefaultWindowService = class DefaultWindowService {
    constructor() {
        this.allowVetoes = true;
        this.onUnloadEmitter = new common_1.Emitter();
    }
    get onUnload() {
        return this.onUnloadEmitter.event;
    }
    onStart(app) {
        this.frontendApplication = app;
        this.registerUnloadListeners();
    }
    openNewWindow(url) {
        window.open(url, undefined, 'noopener');
        return undefined;
    }
    openNewDefaultWindow() {
        this.openNewWindow(`#${window_1.DEFAULT_WINDOW_HASH}`);
    }
    /**
     * Returns a list of actions that {@link FrontendApplicationContribution}s would like to take before shutdown
     * It is expected that this will succeed - i.e. return an empty array - at most once per session. If no vetoes are received
     * during any cycle, no further checks will be made. In that case, shutdown should proceed unconditionally.
     */
    collectContributionUnloadVetoes() {
        var _a;
        const vetoes = [];
        if (this.allowVetoes) {
            const shouldConfirmExit = this.corePreferences['application.confirmExit'];
            for (const contribution of this.contributions.getContributions()) {
                const veto = (_a = contribution.onWillStop) === null || _a === void 0 ? void 0 : _a.call(contribution, this.frontendApplication);
                if (veto && shouldConfirmExit !== 'never') { // Ignore vetoes if we should not prompt the user on exit.
                    if (frontend_application_1.OnWillStopAction.is(veto)) {
                        vetoes.push(veto);
                    }
                    else {
                        vetoes.push({ reason: 'No reason given', action: () => false });
                    }
                }
            }
            vetoes.sort((a, b) => { var _a, _b; return ((_a = a.priority) !== null && _a !== void 0 ? _a : -Infinity) - ((_b = b.priority) !== null && _b !== void 0 ? _b : -Infinity); });
            if (vetoes.length === 0 && shouldConfirmExit === 'always') {
                vetoes.push({ reason: 'application.confirmExit preference', action: () => (0, dialogs_1.confirmExit)() });
            }
            if (vetoes.length === 0) {
                this.allowVetoes = false;
            }
        }
        return vetoes;
    }
    /**
     * Implement the mechanism to detect unloading of the page.
     */
    registerUnloadListeners() {
        window.addEventListener('beforeunload', event => this.handleBeforeUnloadEvent(event));
        // In a browser, `unload` is correctly fired when the page unloads, unlike Electron.
        // If `beforeunload` is cancelled, the user will be prompted to leave or stay.
        // If the user stays, the page won't be unloaded, so `unload` is not fired.
        // If the user leaves, the page will be unloaded, so `unload` is fired.
        window.addEventListener('unload', () => this.onUnloadEmitter.fire());
    }
    async isSafeToShutDown(stopReason) {
        const vetoes = this.collectContributionUnloadVetoes();
        if (vetoes.length === 0) {
            return true;
        }
        const preparedValues = await Promise.all(vetoes.map(e => { var _a; return (_a = e.prepare) === null || _a === void 0 ? void 0 : _a.call(e, stopReason); }));
        console.debug('Shutdown prevented by', vetoes.map(({ reason }) => reason).join(', '));
        for (let i = 0; i < vetoes.length; i++) {
            try {
                const result = await vetoes[i].action(preparedValues[i], stopReason);
                if (!result) {
                    return false;
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        console.debug('OnWillStop actions resolved; allowing shutdown');
        this.allowVetoes = false;
        return true;
    }
    setSafeToShutDown() {
        this.allowVetoes = false;
    }
    /**
     * Called when the `window` is about to `unload` its resources.
     * At this point, the `document` is still visible and the [`BeforeUnloadEvent`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)
     * event will be canceled if the return value of this method is `false`.
     *
     * In Electron, handleCloseRequestEvent is is run instead.
     */
    handleBeforeUnloadEvent(event) {
        const vetoes = this.collectContributionUnloadVetoes();
        if (vetoes.length) {
            // In the browser, we don't call the functions because this has to finish in a single tick, so we treat any desired action as a veto.
            console.debug('Shutdown prevented by', vetoes.map(({ reason }) => reason).join(', '));
            return this.preventUnload(event);
        }
        console.debug('Shutdown will proceed.');
    }
    /**
     * Notify the browser that we do not want to unload.
     *
     * Notes:
     *  - Shows a confirmation popup in browsers.
     *  - Prevents the window from closing without confirmation in electron.
     *
     * @param event The beforeunload event
     */
    preventUnload(event) {
        event.returnValue = '';
        event.preventDefault();
        return '';
    }
    reload() {
        this.isSafeToShutDown(frontend_application_state_1.StopReason.Reload).then(isSafe => {
            if (isSafe) {
                window.location.reload();
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(core_preferences_1.CorePreferences),
    __metadata("design:type", Object)
], DefaultWindowService.prototype, "corePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(frontend_application_1.FrontendApplicationContribution),
    __metadata("design:type", Object)
], DefaultWindowService.prototype, "contributions", void 0);
DefaultWindowService = __decorate([
    (0, inversify_1.injectable)()
], DefaultWindowService);
exports.DefaultWindowService = DefaultWindowService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/window/default-window-service'] = this;


/***/ }),

/***/ "../../packages/core/lib/common/window.js":
/*!************************************************!*\
  !*** ../../packages/core/lib/common/window.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {


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


/***/ })

}]);
//# sourceMappingURL=packages_core_lib_browser_window_browser-window-module_js.js.map