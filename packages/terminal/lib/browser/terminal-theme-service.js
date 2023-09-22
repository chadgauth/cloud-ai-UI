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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalThemeService = exports.terminalAnsiColorMap = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
const theming_1 = require("@theia/core/lib/browser/theming");
/**
 * It should be aligned with https://github.com/microsoft/vscode/blob/0dfa355b3ad185a6289ba28a99c141ab9e72d2be/src/vs/workbench/contrib/terminal/common/terminalColorRegistry.ts#L40
 */
exports.terminalAnsiColorMap = {
    'terminal.ansiBlack': {
        index: 0,
        defaults: {
            light: '#000000',
            dark: '#000000',
            hcDark: '#000000',
            hcLight: '#292929'
        }
    },
    'terminal.ansiRed': {
        index: 1,
        defaults: {
            light: '#cd3131',
            dark: '#cd3131',
            hcDark: '#cd0000',
            hcLight: '#cd3131'
        }
    },
    'terminal.ansiGreen': {
        index: 2,
        defaults: {
            light: '#00BC00',
            dark: '#0DBC79',
            hcDark: '#00cd00',
            hcLight: '#00bc00'
        }
    },
    'terminal.ansiYellow': {
        index: 3,
        defaults: {
            light: '#949800',
            dark: '#e5e510',
            hcDark: '#cdcd00',
            hcLight: '#949800'
        }
    },
    'terminal.ansiBlue': {
        index: 4,
        defaults: {
            light: '#0451a5',
            dark: '#2472c8',
            hcDark: '#0000ee',
            hcLight: '#0451a5'
        }
    },
    'terminal.ansiMagenta': {
        index: 5,
        defaults: {
            light: '#bc05bc',
            dark: '#bc3fbc',
            hcDark: '#cd00cd',
            hcLight: '#bc05bc'
        }
    },
    'terminal.ansiCyan': {
        index: 6,
        defaults: {
            light: '#0598bc',
            dark: '#11a8cd',
            hcDark: '#00cdcd',
            hcLight: '#0598b'
        }
    },
    'terminal.ansiWhite': {
        index: 7,
        defaults: {
            light: '#555555',
            dark: '#e5e5e5',
            hcDark: '#e5e5e5',
            hcLight: '#555555'
        }
    },
    'terminal.ansiBrightBlack': {
        index: 8,
        defaults: {
            light: '#666666',
            dark: '#666666',
            hcDark: '#7f7f7f',
            hcLight: '#666666'
        }
    },
    'terminal.ansiBrightRed': {
        index: 9,
        defaults: {
            light: '#cd3131',
            dark: '#f14c4c',
            hcDark: '#ff0000',
            hcLight: '#cd3131'
        }
    },
    'terminal.ansiBrightGreen': {
        index: 10,
        defaults: {
            light: '#14CE14',
            dark: '#23d18b',
            hcDark: '#00ff00',
            hcLight: '#00bc00'
        }
    },
    'terminal.ansiBrightYellow': {
        index: 11,
        defaults: {
            light: '#b5ba00',
            dark: '#f5f543',
            hcDark: '#ffff00',
            hcLight: '#b5ba00'
        }
    },
    'terminal.ansiBrightBlue': {
        index: 12,
        defaults: {
            light: '#0451a5',
            dark: '#3b8eea',
            hcDark: '#5c5cff',
            hcLight: '#0451a5'
        }
    },
    'terminal.ansiBrightMagenta': {
        index: 13,
        defaults: {
            light: '#bc05bc',
            dark: '#d670d6',
            hcDark: '#ff00ff',
            hcLight: '#bc05bc'
        }
    },
    'terminal.ansiBrightCyan': {
        index: 14,
        defaults: {
            light: '#0598bc',
            dark: '#29b8db',
            hcDark: '#00ffff',
            hcLight: '#0598bc'
        }
    },
    'terminal.ansiBrightWhite': {
        index: 15,
        defaults: {
            light: '#a5a5a5',
            dark: '#e5e5e5',
            hcDark: '#ffffff',
            hcLight: '#a5a5a5'
        }
    }
};
let TerminalThemeService = class TerminalThemeService {
    get onDidChange() {
        return this.themeService.onDidColorThemeChange;
    }
    get theme() {
        const foregroundColor = this.colorRegistry.getCurrentColor('terminal.foreground');
        const backgroundColor = this.colorRegistry.getCurrentColor('terminal.background') || this.colorRegistry.getCurrentColor('panel.background');
        const cursorColor = this.colorRegistry.getCurrentColor('terminalCursor.foreground') || foregroundColor;
        const cursorAccentColor = this.colorRegistry.getCurrentColor('terminalCursor.background') || backgroundColor;
        const selectionColor = this.colorRegistry.getCurrentColor('terminal.selectionBackground');
        const theme = {
            background: backgroundColor,
            foreground: foregroundColor,
            cursor: cursorColor,
            cursorAccent: cursorAccentColor,
            selection: selectionColor
        };
        // eslint-disable-next-line guard-for-in
        for (const id in exports.terminalAnsiColorMap) {
            const colorId = id.substring(13);
            const colorName = colorId.charAt(0).toLowerCase() + colorId.slice(1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            theme[colorName] = this.colorRegistry.getCurrentColor(id);
        }
        return theme;
    }
};
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], TerminalThemeService.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], TerminalThemeService.prototype, "themeService", void 0);
TerminalThemeService = __decorate([
    (0, inversify_1.injectable)()
], TerminalThemeService);
exports.TerminalThemeService = TerminalThemeService;
//# sourceMappingURL=terminal-theme-service.js.map