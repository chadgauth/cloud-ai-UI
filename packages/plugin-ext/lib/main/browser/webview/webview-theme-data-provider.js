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
// copied and modified from https://github.com/microsoft/vscode/blob/ba40bd16433d5a817bfae15f3b4350e18f144af4/src/vs/workbench/contrib/webview/common/themeing.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewThemeDataProvider = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const editor_preferences_1 = require("@theia/editor/lib/browser/editor-preferences");
const theming_1 = require("@theia/core/lib/browser/theming");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
const color_application_contribution_1 = require("@theia/core/lib/browser/color-application-contribution");
let WebviewThemeDataProvider = class WebviewThemeDataProvider {
    constructor() {
        this.onDidChangeThemeDataEmitter = new event_1.Emitter();
        this.onDidChangeThemeData = this.onDidChangeThemeDataEmitter.event;
        this.editorStyles = new Map([
            ['editor.fontFamily', 'editor-font-family'],
            ['editor.fontWeight', 'editor-font-weight'],
            ['editor.fontSize', 'editor-font-size']
        ]);
    }
    init() {
        this.colorContribution.onDidChange(() => this.reset());
        this.editorPreferences.onPreferenceChanged(e => {
            if (this.editorStyles.has(e.preferenceName)) {
                this.reset();
            }
        });
    }
    reset() {
        if (this.themeData) {
            this.themeData = undefined;
            this.onDidChangeThemeDataEmitter.fire(undefined);
        }
    }
    getThemeData() {
        if (!this.themeData) {
            this.themeData = this.computeThemeData();
        }
        return this.themeData;
    }
    computeThemeData() {
        const styles = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addStyle = (id, rawValue) => {
            if (rawValue) {
                const value = typeof rawValue === 'number' || typeof rawValue === 'string' ? rawValue : String(rawValue);
                styles[this.colors.toCssVariableName(id).substring(2)] = value;
                styles[this.colors.toCssVariableName(id, 'vscode').substring(2)] = value;
            }
        };
        addStyle('font-family', '-apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "Ubuntu", "Droid Sans", sans-serif');
        addStyle('font-weight', 'normal');
        addStyle('font-size', '13px');
        this.editorStyles.forEach((value, key) => addStyle(value, this.editorPreferences[key]));
        for (const id of this.colors.getColors()) {
            const color = this.colors.getCurrentColor(id);
            if (color) {
                addStyle(id, color.toString());
            }
        }
        const activeTheme = this.getActiveTheme();
        return {
            styles,
            activeThemeName: activeTheme.label,
            activeThemeType: this.getThemeType(activeTheme)
        };
    }
    getActiveTheme() {
        return this.themeService.getCurrentTheme();
    }
    getThemeType(theme) {
        switch (theme.type) {
            case 'light': return 'vscode-light';
            case 'dark': return 'vscode-dark';
            default: return 'vscode-high-contrast';
        }
    }
};
__decorate([
    (0, inversify_1.inject)(editor_preferences_1.EditorPreferences),
    __metadata("design:type", Object)
], WebviewThemeDataProvider.prototype, "editorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], WebviewThemeDataProvider.prototype, "colors", void 0);
__decorate([
    (0, inversify_1.inject)(color_application_contribution_1.ColorApplicationContribution),
    __metadata("design:type", color_application_contribution_1.ColorApplicationContribution)
], WebviewThemeDataProvider.prototype, "colorContribution", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], WebviewThemeDataProvider.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebviewThemeDataProvider.prototype, "init", null);
WebviewThemeDataProvider = __decorate([
    (0, inversify_1.injectable)()
], WebviewThemeDataProvider);
exports.WebviewThemeDataProvider = WebviewThemeDataProvider;
//# sourceMappingURL=webview-theme-data-provider.js.map