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
var DefaultSecondaryWindowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
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
const inversify_1 = require("inversify");
const window_service_1 = require("./window-service");
const saveable_1 = require("../saveable");
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
//# sourceMappingURL=default-secondary-window-service.js.map