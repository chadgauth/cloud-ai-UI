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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemingExtImpl = void 0;
const types_impl_1 = require("./types-impl");
const event_1 = require("@theia/core/lib/common/event");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/5ddbda0172d80bfbb2529987ba9020848e8771f7/src/vs/workbench/api/common/extHostTheming.ts
class ThemingExtImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.actual = new types_impl_1.ColorTheme(types_impl_1.ColorThemeKind.Dark);
        this._onDidChangeActiveColorTheme = new event_1.Emitter();
    }
    get activeColorTheme() {
        return this.actual;
    }
    $onColorThemeChange(type) {
        this.actual = new types_impl_1.ColorTheme(this.convertKind(type));
        this._onDidChangeActiveColorTheme.fire(this.actual);
    }
    convertKind(type) {
        let kind;
        switch (type) {
            case 'light':
                kind = types_impl_1.ColorThemeKind.Light;
                break;
            case 'dark':
                kind = types_impl_1.ColorThemeKind.Dark;
                break;
            case 'hc':
                kind = types_impl_1.ColorThemeKind.HighContrast;
                break;
            case 'hcLight':
                kind = types_impl_1.ColorThemeKind.HighContrastLight;
                break;
        }
        return kind;
    }
    get onDidChangeActiveColorTheme() {
        return this._onDidChangeActiveColorTheme.event;
    }
}
exports.ThemingExtImpl = ThemingExtImpl;
//# sourceMappingURL=theming.js.map