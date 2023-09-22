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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_CODE_MAP = void 0;
const browser = require("@theia/core/lib/browser");
const MonacoPlatform = require("@theia/monaco-editor-core/esm/vs/base/common/platform");
exports.KEY_CODE_MAP = [];
(function () {
    exports.KEY_CODE_MAP[3] = 7 /* PauseBreak */; // VK_CANCEL 0x03 Control-break processing
    exports.KEY_CODE_MAP[8] = 1 /* Backspace */;
    exports.KEY_CODE_MAP[9] = 2 /* Tab */;
    exports.KEY_CODE_MAP[13] = 3 /* Enter */;
    exports.KEY_CODE_MAP[16] = 4 /* Shift */;
    exports.KEY_CODE_MAP[17] = 5 /* Ctrl */;
    exports.KEY_CODE_MAP[18] = 6 /* Alt */;
    exports.KEY_CODE_MAP[19] = 7 /* PauseBreak */;
    exports.KEY_CODE_MAP[20] = 8 /* CapsLock */;
    exports.KEY_CODE_MAP[27] = 9 /* Escape */;
    exports.KEY_CODE_MAP[32] = 10 /* Space */;
    exports.KEY_CODE_MAP[33] = 11 /* PageUp */;
    exports.KEY_CODE_MAP[34] = 12 /* PageDown */;
    exports.KEY_CODE_MAP[35] = 13 /* End */;
    exports.KEY_CODE_MAP[36] = 14 /* Home */;
    exports.KEY_CODE_MAP[37] = 15 /* LeftArrow */;
    exports.KEY_CODE_MAP[38] = 16 /* UpArrow */;
    exports.KEY_CODE_MAP[39] = 17 /* RightArrow */;
    exports.KEY_CODE_MAP[40] = 18 /* DownArrow */;
    exports.KEY_CODE_MAP[45] = 19 /* Insert */;
    exports.KEY_CODE_MAP[46] = 20 /* Delete */;
    exports.KEY_CODE_MAP[48] = 21 /* Digit0 */;
    exports.KEY_CODE_MAP[49] = 22 /* Digit1 */;
    exports.KEY_CODE_MAP[50] = 23 /* Digit2 */;
    exports.KEY_CODE_MAP[51] = 24 /* Digit3 */;
    exports.KEY_CODE_MAP[52] = 25 /* Digit4 */;
    exports.KEY_CODE_MAP[53] = 26 /* Digit5 */;
    exports.KEY_CODE_MAP[54] = 27 /* Digit6 */;
    exports.KEY_CODE_MAP[55] = 28 /* Digit7 */;
    exports.KEY_CODE_MAP[56] = 29 /* Digit8 */;
    exports.KEY_CODE_MAP[57] = 30 /* Digit9 */;
    exports.KEY_CODE_MAP[65] = 31 /* KeyA */;
    exports.KEY_CODE_MAP[66] = 32 /* KeyB */;
    exports.KEY_CODE_MAP[67] = 33 /* KeyC */;
    exports.KEY_CODE_MAP[68] = 34 /* KeyD */;
    exports.KEY_CODE_MAP[69] = 35 /* KeyE */;
    exports.KEY_CODE_MAP[70] = 36 /* KeyF */;
    exports.KEY_CODE_MAP[71] = 37 /* KeyG */;
    exports.KEY_CODE_MAP[72] = 38 /* KeyH */;
    exports.KEY_CODE_MAP[73] = 39 /* KeyI */;
    exports.KEY_CODE_MAP[74] = 40 /* KeyJ */;
    exports.KEY_CODE_MAP[75] = 41 /* KeyK */;
    exports.KEY_CODE_MAP[76] = 42 /* KeyL */;
    exports.KEY_CODE_MAP[77] = 43 /* KeyM */;
    exports.KEY_CODE_MAP[78] = 44 /* KeyN */;
    exports.KEY_CODE_MAP[79] = 45 /* KeyO */;
    exports.KEY_CODE_MAP[80] = 46 /* KeyP */;
    exports.KEY_CODE_MAP[81] = 47 /* KeyQ */;
    exports.KEY_CODE_MAP[82] = 48 /* KeyR */;
    exports.KEY_CODE_MAP[83] = 49 /* KeyS */;
    exports.KEY_CODE_MAP[84] = 50 /* KeyT */;
    exports.KEY_CODE_MAP[85] = 51 /* KeyU */;
    exports.KEY_CODE_MAP[86] = 52 /* KeyV */;
    exports.KEY_CODE_MAP[87] = 53 /* KeyW */;
    exports.KEY_CODE_MAP[88] = 54 /* KeyX */;
    exports.KEY_CODE_MAP[89] = 55 /* KeyY */;
    exports.KEY_CODE_MAP[90] = 56 /* KeyZ */;
    exports.KEY_CODE_MAP[93] = 58 /* ContextMenu */;
    exports.KEY_CODE_MAP[96] = 93 /* Numpad0 */;
    exports.KEY_CODE_MAP[97] = 94 /* Numpad1 */;
    exports.KEY_CODE_MAP[98] = 95 /* Numpad2 */;
    exports.KEY_CODE_MAP[99] = 96 /* Numpad3 */;
    exports.KEY_CODE_MAP[100] = 97 /* Numpad4 */;
    exports.KEY_CODE_MAP[101] = 98 /* Numpad5 */;
    exports.KEY_CODE_MAP[102] = 99 /* Numpad6 */;
    exports.KEY_CODE_MAP[103] = 100 /* Numpad7 */;
    exports.KEY_CODE_MAP[104] = 101 /* Numpad8 */;
    exports.KEY_CODE_MAP[105] = 102 /* Numpad9 */;
    exports.KEY_CODE_MAP[106] = 103 /* NumpadMultiply */;
    exports.KEY_CODE_MAP[107] = 104 /* NumpadAdd */;
    exports.KEY_CODE_MAP[108] = 105 /* NUMPAD_SEPARATOR */;
    exports.KEY_CODE_MAP[109] = 106 /* NumpadSubtract */;
    exports.KEY_CODE_MAP[110] = 107 /* NumpadDecimal */;
    exports.KEY_CODE_MAP[111] = 108 /* NumpadDivide */;
    exports.KEY_CODE_MAP[112] = 59 /* F1 */;
    exports.KEY_CODE_MAP[113] = 60 /* F2 */;
    exports.KEY_CODE_MAP[114] = 61 /* F3 */;
    exports.KEY_CODE_MAP[115] = 62 /* F4 */;
    exports.KEY_CODE_MAP[116] = 63 /* F5 */;
    exports.KEY_CODE_MAP[117] = 64 /* F6 */;
    exports.KEY_CODE_MAP[118] = 65 /* F7 */;
    exports.KEY_CODE_MAP[119] = 66 /* F8 */;
    exports.KEY_CODE_MAP[120] = 67 /* F9 */;
    exports.KEY_CODE_MAP[121] = 68 /* F10 */;
    exports.KEY_CODE_MAP[122] = 69 /* F11 */;
    exports.KEY_CODE_MAP[123] = 70 /* F12 */;
    exports.KEY_CODE_MAP[124] = 71 /* F13 */;
    exports.KEY_CODE_MAP[125] = 72 /* F14 */;
    exports.KEY_CODE_MAP[126] = 73 /* F15 */;
    exports.KEY_CODE_MAP[127] = 74 /* F16 */;
    exports.KEY_CODE_MAP[128] = 75 /* F17 */;
    exports.KEY_CODE_MAP[129] = 76 /* F18 */;
    exports.KEY_CODE_MAP[130] = 77 /* F19 */;
    exports.KEY_CODE_MAP[144] = 78 /* NumLock */;
    exports.KEY_CODE_MAP[145] = 79 /* ScrollLock */;
    exports.KEY_CODE_MAP[186] = 80 /* Semicolon */;
    exports.KEY_CODE_MAP[187] = 81 /* Equal */;
    exports.KEY_CODE_MAP[188] = 82 /* Comma */;
    exports.KEY_CODE_MAP[189] = 83 /* Minus */;
    exports.KEY_CODE_MAP[190] = 84 /* Period */;
    exports.KEY_CODE_MAP[191] = 85 /* Slash */;
    exports.KEY_CODE_MAP[192] = 86 /* Backquote */;
    exports.KEY_CODE_MAP[193] = 110 /* ABNT_C1 */;
    exports.KEY_CODE_MAP[194] = 111 /* ABNT_C2 */;
    exports.KEY_CODE_MAP[219] = 87 /* BracketLeft */;
    exports.KEY_CODE_MAP[220] = 88 /* Backslash */;
    exports.KEY_CODE_MAP[221] = 89 /* BracketRight */;
    exports.KEY_CODE_MAP[222] = 90 /* Quote */;
    exports.KEY_CODE_MAP[223] = 91 /* OEM_8 */;
    exports.KEY_CODE_MAP[226] = 92 /* IntlBackslash */;
    /**
     * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
     * If an Input Method Editor is processing key input and the event is keydown, return 229.
     */
    exports.KEY_CODE_MAP[229] = 109 /* KEY_IN_COMPOSITION */;
    if (browser.isIE) {
        exports.KEY_CODE_MAP[91] = 57 /* Meta */;
    }
    else if (browser.isFirefox) {
        exports.KEY_CODE_MAP[59] = 80 /* Semicolon */;
        exports.KEY_CODE_MAP[107] = 81 /* Equal */;
        exports.KEY_CODE_MAP[109] = 83 /* Minus */;
        if (MonacoPlatform.OS === 2 /* Macintosh */) {
            exports.KEY_CODE_MAP[224] = 57 /* Meta */;
        }
    }
    else if (browser.isWebKit) {
        exports.KEY_CODE_MAP[91] = 57 /* Meta */;
        if (MonacoPlatform.OS === 2 /* Macintosh */) {
            // the two meta keys in the Mac have different key codes (91 and 93)
            exports.KEY_CODE_MAP[93] = 57 /* Meta */;
        }
        else {
            exports.KEY_CODE_MAP[92] = 57 /* Meta */;
        }
    }
})();
//# sourceMappingURL=monaco-keycode-map.js.map