(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_lib_common_markdown-rendering_markdown-string_js-packages_core_shared_lodash_de-7061bd"],{

/***/ "../../packages/core/lib/common/markdown-rendering/icon-utilities.js":
/*!***************************************************************************!*\
  !*** ../../packages/core/lib/common/markdown-rendering/icon-utilities.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.escapeIcons = exports.CSSIcon = void 0;
// Copied from https://github.com/microsoft/vscode/blob/7d9b1c37f8e5ae3772782ba3b09d827eb3fdd833/src/vs/base/common/codicons.ts
var CSSIcon;
(function (CSSIcon) {
    CSSIcon.iconNameSegment = '[A-Za-z0-9]+';
    CSSIcon.iconNameExpression = '[A-Za-z0-9-]+';
    CSSIcon.iconModifierExpression = '~[A-Za-z]+';
    CSSIcon.iconNameCharacter = '[A-Za-z0-9~-]';
})(CSSIcon = exports.CSSIcon || (exports.CSSIcon = {}));
const iconsRegex = new RegExp(`\\$\\(${CSSIcon.iconNameExpression}(?:${CSSIcon.iconModifierExpression})?\\)`, 'g'); // no capturing groups
const escapeIconsRegex = new RegExp(`(\\\\)?${iconsRegex.source}`, 'g');
function escapeIcons(text) {
    return text.replace(escapeIconsRegex, (match, escaped) => escaped ? match : `\\${match}`);
}
exports.escapeIcons = escapeIcons;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/markdown-rendering/icon-utilities'] = this;


/***/ }),

/***/ "../../packages/core/lib/common/markdown-rendering/markdown-string.js":
/*!****************************************************************************!*\
  !*** ../../packages/core/lib/common/markdown-rendering/markdown-string.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.escapeMarkdownSyntaxTokens = exports.MarkdownStringImpl = exports.MarkdownString = exports.MarkdownStringTextNewlineStyle = void 0;
const strings_1 = __webpack_require__(/*! ../strings */ "../../packages/core/lib/common/strings.js");
const icon_utilities_1 = __webpack_require__(/*! ./icon-utilities */ "../../packages/core/lib/common/markdown-rendering/icon-utilities.js");
const types_1 = __webpack_require__(/*! ../types */ "../../packages/core/lib/common/types.js");
var MarkdownStringTextNewlineStyle;
(function (MarkdownStringTextNewlineStyle) {
    MarkdownStringTextNewlineStyle[MarkdownStringTextNewlineStyle["Paragraph"] = 0] = "Paragraph";
    MarkdownStringTextNewlineStyle[MarkdownStringTextNewlineStyle["Break"] = 1] = "Break";
})(MarkdownStringTextNewlineStyle = exports.MarkdownStringTextNewlineStyle || (exports.MarkdownStringTextNewlineStyle = {}));
var MarkdownString;
(function (MarkdownString) {
    /**
     * @returns whether the candidate satisfies the interface of a markdown string
     */
    function is(candidate) {
        return (0, types_1.isObject)(candidate) && (0, types_1.isString)(candidate.value);
    }
    MarkdownString.is = is;
})(MarkdownString = exports.MarkdownString || (exports.MarkdownString = {}));
// Copied from https://github.com/microsoft/vscode/blob/7d9b1c37f8e5ae3772782ba3b09d827eb3fdd833/src/vs/base/common/htmlContent.ts
class MarkdownStringImpl {
    constructor(value = '', isTrustedOrOptions = false) {
        var _a, _b, _c;
        this.value = value;
        if (typeof this.value !== 'string') {
            throw new Error('Illegal value for MarkdownString. Expected string, got ' + typeof this.value);
        }
        if (typeof isTrustedOrOptions === 'boolean') {
            this.isTrusted = isTrustedOrOptions;
            this.supportThemeIcons = false;
            this.supportHtml = false;
        }
        else {
            this.isTrusted = (_a = isTrustedOrOptions.isTrusted) !== null && _a !== void 0 ? _a : undefined;
            this.supportThemeIcons = (_b = isTrustedOrOptions.supportThemeIcons) !== null && _b !== void 0 ? _b : false;
            this.supportHtml = (_c = isTrustedOrOptions.supportHtml) !== null && _c !== void 0 ? _c : false;
        }
    }
    appendText(value, newlineStyle = MarkdownStringTextNewlineStyle.Paragraph) {
        this.value += escapeMarkdownSyntaxTokens(this.supportThemeIcons ? (0, icon_utilities_1.escapeIcons)(value) : value)
            .replace(/([ \t]+)/g, (_match, g1) => '&nbsp;'.repeat(g1.length))
            .replace(/\>/gm, '\\>')
            .replace(/\n/g, newlineStyle === MarkdownStringTextNewlineStyle.Break ? '\\\n' : '\n\n');
        return this;
    }
    appendMarkdown(value) {
        this.value += value;
        return this;
    }
    appendCodeblock(langId, code) {
        this.value += '\n```';
        this.value += langId;
        this.value += '\n';
        this.value += code;
        this.value += '\n```\n';
        return this;
    }
    appendLink(target, label, title) {
        this.value += '[';
        this.value += this._escape(label, ']');
        this.value += '](';
        this.value += this._escape(String(target), ')');
        if (title) {
            this.value += ` "${this._escape(this._escape(title, '"'), ')')}"`;
        }
        this.value += ')';
        return this;
    }
    _escape(value, ch) {
        const r = new RegExp((0, strings_1.escapeRegExpCharacters)(ch), 'g');
        return value.replace(r, (match, offset) => {
            if (value.charAt(offset - 1) !== '\\') {
                return `\\${match}`;
            }
            else {
                return match;
            }
        });
    }
}
exports.MarkdownStringImpl = MarkdownStringImpl;
function escapeMarkdownSyntaxTokens(text) {
    // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
    return text.replace(/[\\`*_{}[\]()#+\-!]/g, '\\$&');
}
exports.escapeMarkdownSyntaxTokens = escapeMarkdownSyntaxTokens;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/markdown-rendering/markdown-string'] = this;


/***/ }),

/***/ "../../packages/core/shared/lodash.debounce/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/shared/lodash.debounce/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! lodash.debounce */ "../../node_modules/lodash.debounce/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/lodash.debounce'] = this;


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

/***/ "../../packages/notebook/lib/browser/contributions/notebook-color-contribution.js":
/*!****************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/contributions/notebook-color-contribution.js ***!
  \****************************************************************************************/
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
exports.NotebookColorContribution = void 0;
const color_1 = __webpack_require__(/*! @theia/core/lib/common/color */ "../../packages/core/lib/common/color.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let NotebookColorContribution = class NotebookColorContribution {
    registerColors(colors) {
        colors.register({
            id: 'notebook.cellBorderColor',
            defaults: {
                dark: color_1.Color.transparent('list.inactiveSelectionBackground', 1),
                light: color_1.Color.transparent('list.inactiveSelectionBackground', 1),
                hcDark: 'panel.border',
                hcLight: 'panel.border'
            },
            description: 'The border color for notebook cells.'
        }, {
            id: 'notebook.focusedEditorBorder',
            defaults: {
                dark: 'focusBorder',
                light: 'focusBorder',
                hcDark: 'focusBorder',
                hcLight: 'focusBorder'
            },
            description: 'The color of the notebook cell editor border.'
        }, {
            id: 'notebookStatusSuccessIcon.foreground',
            defaults: {
                dark: 'debugIcon.startForeground',
                light: 'debugIcon.startForeground',
                hcDark: 'debugIcon.startForeground',
                hcLight: 'debugIcon.startForeground'
            },
            description: 'The error icon color of notebook cells in the cell status bar.'
        }, {
            id: 'notebookEditorOverviewRuler.runningCellForeground',
            defaults: {
                dark: 'debugIcon.startForeground',
                light: 'debugIcon.startForeground',
                hcDark: 'debugIcon.startForeground',
                hcLight: 'debugIcon.startForeground'
            },
            description: 'The color of the running cell decoration in the notebook editor overview ruler.'
        }, {
            id: 'notebookStatusErrorIcon.foreground',
            defaults: {
                dark: 'errorForeground',
                light: 'errorForeground',
                hcDark: 'errorForeground',
                hcLight: 'errorForeground'
            },
            description: 'The error icon color of notebook cells in the cell status bar.'
        }, {
            id: 'notebookStatusRunningIcon.foreground',
            defaults: {
                dark: 'foreground',
                light: 'foreground',
                hcDark: 'foreground',
                hcLight: 'foreground'
            },
            description: 'The running icon color of notebook cells in the cell status bar.'
        }, {
            id: 'notebook.outputContainerBorderColor',
            defaults: {
                dark: undefined,
                light: undefined,
                hcDark: undefined,
                hcLight: undefined
            },
            description: 'The border color of the notebook output container.'
        }, {
            id: 'notebook.outputContainerBackgroundColor',
            defaults: {
                dark: undefined,
                light: undefined,
                hcDark: undefined,
                hcLight: undefined
            },
            description: 'The color of the notebook output container background.'
        }, {
            id: 'notebook.cellToolbarSeparator',
            defaults: {
                dark: color_1.Color.rgba(128, 128, 128, 0.35),
                light: color_1.Color.rgba(128, 128, 128, 0.35),
                hcDark: 'contrastBorder',
                hcLight: 'contrastBorder'
            },
            description: 'The color of the separator in the cell bottom toolbar'
        }, {
            id: 'notebook.focusedCellBackground',
            defaults: {
                dark: undefined,
                light: undefined,
                hcDark: undefined,
                hcLight: undefined
            },
            description: 'The background color of a cell when the cell is focused.'
        }, {
            id: 'notebook.selectedCellBackground',
            defaults: {
                dark: 'list.inactiveSelectionBackground',
                light: 'list.inactiveSelectionBackground',
                hcDark: undefined,
                hcLight: undefined
            },
            description: 'The background color of a cell when the cell is selected.'
        }, {
            id: 'notebook.cellHoverBackground',
            defaults: {
                dark: color_1.Color.transparent('notebook.focusedCellBackground', 0.5),
                light: color_1.Color.transparent('notebook.focusedCellBackground', 0.7),
                hcDark: undefined,
                hcLight: undefined
            },
            description: 'The background color of a cell when the cell is hovered.'
        }, {
            id: 'notebook.selectedCellBorder',
            defaults: {
                dark: 'notebook.cellBorderColor',
                light: 'notebook.cellBorderColor',
                hcDark: 'contrastBorder',
                hcLight: 'contrastBorder'
            },
            description: "The color of the cell's top and bottom border when the cell is selected but not focused."
        }, {
            id: 'notebook.inactiveSelectedCellBorder',
            defaults: {
                dark: undefined,
                light: undefined,
                hcDark: 'focusBorder',
                hcLight: 'focusBorder'
            },
            description: "The color of the cell's borders when multiple cells are selected."
        }, {
            id: 'notebook.focusedCellBorder',
            defaults: {
                dark: 'focusBorder',
                light: 'focusBorder',
                hcDark: 'focusBorder',
                hcLight: 'focusBorder'
            },
            description: "The color of the cell's focus indicator borders when the cell is focused."
        }, {
            id: 'notebook.inactiveFocusedCellBorder',
            defaults: {
                dark: 'notebook.cellBorderColor',
                light: 'notebook.cellBorderColor',
                hcDark: 'notebook.cellBorderColor',
                hcLight: 'notebook.cellBorderColor'
            },
            description: "The color of the cell's top and bottom border when a cell is focused while the primary focus is outside of the editor."
        }, {
            id: 'notebook.cellStatusBarItemHoverBackground',
            defaults: {
                dark: color_1.Color.rgba(0, 0, 0, 0.08),
                light: color_1.Color.rgba(255, 255, 255, 0.15),
                hcDark: color_1.Color.rgba(0, 0, 0, 0.08),
                hcLight: color_1.Color.rgba(255, 255, 255, 0.15)
            },
            description: 'The background color of notebook cell status bar items.'
        }, {
            id: 'notebook.cellInsertionIndicator',
            defaults: {
                dark: 'focusBorder',
                light: 'focusBorder',
                hcDark: 'focusBorder',
                hcLight: undefined
            },
            description: 'Notebook background color.'
        }, {
            id: 'notebookScrollbarSlider.background',
            defaults: {
                dark: 'scrollbarSlider.background',
                light: 'scrollbarSlider.background',
                hcDark: 'scrollbarSlider.background',
                hcLight: 'scrollbarSlider.background'
            },
            description: 'Notebook scrollbar slider background color.'
        }, {
            id: 'notebookScrollbarSlider.hoverBackground',
            defaults: {
                dark: 'scrollbarSlider.hoverBackground',
                light: 'scrollbarSlider.hoverBackground',
                hcDark: 'scrollbarSlider.hoverBackground',
                hcLight: 'scrollbarSlider.hoverBackground'
            },
            description: 'Notebook scrollbar slider background color when hovering.'
        }, {
            id: 'notebookScrollbarSlider.activeBackground',
            defaults: {
                dark: 'scrollbarSlider.activeBackground',
                light: 'scrollbarSlider.activeBackground',
                hcDark: 'scrollbarSlider.activeBackground',
                hcLight: 'scrollbarSlider.activeBackground'
            },
            description: 'Notebook scrollbar slider background color when clicked on.'
        }, {
            id: 'notebook.symbolHighlightBackground',
            defaults: {
                dark: color_1.Color.rgba(255, 255, 255, 0.04),
                light: color_1.Color.rgba(253, 255, 0, 0.2),
                hcDark: undefined,
                hcLight: undefined
            },
            description: 'Background color of highlighted cell'
        }, {
            id: 'notebook.cellEditorBackground',
            defaults: {
                dark: 'sideBar.background',
                light: 'sideBar.background',
                hcDark: undefined,
                hcLight: undefined
            },
            description: 'Cell editor background color.'
        }, {
            id: 'notebook.editorBackground',
            defaults: {
                dark: 'editorPane.background',
                light: 'editorPane.background',
                hcDark: undefined,
                hcLight: undefined
            },
            description: 'Notebook background color.'
        });
    }
};
NotebookColorContribution = __decorate([
    (0, inversify_1.injectable)()
], NotebookColorContribution);
exports.NotebookColorContribution = NotebookColorContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/contributions/notebook-color-contribution'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/notebook-cell-resource-resolver.js":
/*!******************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/notebook-cell-resource-resolver.js ***!
  \******************************************************************************/
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCellResourceResolver = exports.NotebookCellResource = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/notebook/lib/common/index.js");
const notebook_service_1 = __webpack_require__(/*! ./service/notebook-service */ "../../packages/notebook/lib/browser/service/notebook-service.js");
class NotebookCellResource {
    constructor(uri, cell) {
        this.uri = uri;
        this.didChangeContentsEmitter = new core_1.Emitter();
        this.onDidChangeContents = this.didChangeContentsEmitter.event;
        this.cell = cell;
    }
    readContents(options) {
        return Promise.resolve(this.cell.source);
    }
    dispose() {
        this.didChangeContentsEmitter.dispose();
    }
}
exports.NotebookCellResource = NotebookCellResource;
let NotebookCellResourceResolver = class NotebookCellResourceResolver {
    async resolve(uri) {
        if (uri.scheme !== common_1.CellUri.scheme) {
            throw new Error(`Cannot resolve cell uri with scheme '${uri.scheme}'`);
        }
        const parsedUri = common_1.CellUri.parse(uri);
        if (!parsedUri) {
            throw new Error(`Cannot parse uri '${uri.toString()}'`);
        }
        const notebookModel = this.notebookService.getNotebookEditorModel(parsedUri.notebook);
        if (!notebookModel) {
            throw new Error(`No notebook found for uri '${parsedUri.notebook}'`);
        }
        const notebookCellModel = notebookModel.cells.find(cell => cell.handle === parsedUri.handle);
        if (!notebookCellModel) {
            throw new Error(`No cell found with handle '${parsedUri.handle}' in '${parsedUri.notebook}'`);
        }
        return new NotebookCellResource(uri, notebookCellModel);
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookCellResourceResolver.prototype, "notebookService", void 0);
NotebookCellResourceResolver = __decorate([
    (0, inversify_1.injectable)()
], NotebookCellResourceResolver);
exports.NotebookCellResourceResolver = NotebookCellResourceResolver;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/notebook-cell-resource-resolver'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/notebook-editor-widget-factory.js":
/*!*****************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/notebook-editor-widget-factory.js ***!
  \*****************************************************************************/
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookEditorWidgetFactory = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const notebook_editor_widget_1 = __webpack_require__(/*! ./notebook-editor-widget */ "../../packages/notebook/lib/browser/notebook-editor-widget.js");
const notebook_service_1 = __webpack_require__(/*! ./service/notebook-service */ "../../packages/notebook/lib/browser/service/notebook-service.js");
const notebook_model_resolver_service_1 = __webpack_require__(/*! ./service/notebook-model-resolver-service */ "../../packages/notebook/lib/browser/service/notebook-model-resolver-service.js");
let NotebookEditorWidgetFactory = class NotebookEditorWidgetFactory {
    constructor() {
        this.id = notebook_editor_widget_1.NotebookEditorWidget.ID;
    }
    async createWidget(options) {
        if (!options) {
            throw new Error('no options found for widget. Need at least uri and notebookType');
        }
        const uri = new core_1.URI(options.uri);
        await this.notebookService.willOpenNotebook(options.notebookType);
        const editor = await this.createEditor(uri, options.notebookType);
        const icon = this.labelProvider.getIcon(uri);
        editor.title.label = this.labelProvider.getName(uri);
        editor.title.iconClass = icon + ' file-icon';
        return editor;
    }
    async createEditor(uri, notebookType) {
        return this.createNotebookEditorWidget({
            uri,
            notebookType,
            notebookData: this.notebookModelResolver.resolve(uri, notebookType),
        });
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookEditorWidgetFactory.prototype, "notebookService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_model_resolver_service_1.NotebookModelResolverService),
    __metadata("design:type", notebook_model_resolver_service_1.NotebookModelResolverService)
], NotebookEditorWidgetFactory.prototype, "notebookModelResolver", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], NotebookEditorWidgetFactory.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_editor_widget_1.NotebookEditorContainerFactory),
    __metadata("design:type", Function)
], NotebookEditorWidgetFactory.prototype, "createNotebookEditorWidget", void 0);
NotebookEditorWidgetFactory = __decorate([
    (0, inversify_1.injectable)()
], NotebookEditorWidgetFactory);
exports.NotebookEditorWidgetFactory = NotebookEditorWidgetFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/notebook-editor-widget-factory'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/notebook-frontend-module.js":
/*!***********************************************************************!*\
  !*** ../../packages/notebook/lib/browser/notebook-frontend-module.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
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
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/notebook/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const color_application_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/color-application-contribution */ "../../packages/core/lib/browser/color-application-contribution.js");
const notebook_open_handler_1 = __webpack_require__(/*! ./notebook-open-handler */ "../../packages/notebook/lib/browser/notebook-open-handler.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const notebook_type_registry_1 = __webpack_require__(/*! ./notebook-type-registry */ "../../packages/notebook/lib/browser/notebook-type-registry.js");
const notebook_renderer_registry_1 = __webpack_require__(/*! ./notebook-renderer-registry */ "../../packages/notebook/lib/browser/notebook-renderer-registry.js");
const notebook_service_1 = __webpack_require__(/*! ./service/notebook-service */ "../../packages/notebook/lib/browser/service/notebook-service.js");
const notebook_editor_widget_factory_1 = __webpack_require__(/*! ./notebook-editor-widget-factory */ "../../packages/notebook/lib/browser/notebook-editor-widget-factory.js");
const notebook_cell_resource_resolver_1 = __webpack_require__(/*! ./notebook-cell-resource-resolver */ "../../packages/notebook/lib/browser/notebook-cell-resource-resolver.js");
const notebook_model_resolver_service_1 = __webpack_require__(/*! ./service/notebook-model-resolver-service */ "../../packages/notebook/lib/browser/service/notebook-model-resolver-service.js");
const notebook_cell_actions_contribution_1 = __webpack_require__(/*! ./contributions/notebook-cell-actions-contribution */ "../../packages/notebook/lib/browser/contributions/notebook-cell-actions-contribution.js");
const notebook_cell_toolbar_factory_1 = __webpack_require__(/*! ./view/notebook-cell-toolbar-factory */ "../../packages/notebook/lib/browser/view/notebook-cell-toolbar-factory.js");
const notebook_model_1 = __webpack_require__(/*! ./view-model/notebook-model */ "../../packages/notebook/lib/browser/view-model/notebook-model.js");
const notebook_cell_model_1 = __webpack_require__(/*! ./view-model/notebook-cell-model */ "../../packages/notebook/lib/browser/view-model/notebook-cell-model.js");
const notebook_editor_widget_1 = __webpack_require__(/*! ./notebook-editor-widget */ "../../packages/notebook/lib/browser/notebook-editor-widget.js");
const notebook_code_cell_view_1 = __webpack_require__(/*! ./view/notebook-code-cell-view */ "../../packages/notebook/lib/browser/view/notebook-code-cell-view.js");
const notebook_markdown_cell_view_1 = __webpack_require__(/*! ./view/notebook-markdown-cell-view */ "../../packages/notebook/lib/browser/view/notebook-markdown-cell-view.js");
const notebook_actions_contribution_1 = __webpack_require__(/*! ./contributions/notebook-actions-contribution */ "../../packages/notebook/lib/browser/contributions/notebook-actions-contribution.js");
const notebook_execution_service_1 = __webpack_require__(/*! ./service/notebook-execution-service */ "../../packages/notebook/lib/browser/service/notebook-execution-service.js");
const notebook_execution_state_service_1 = __webpack_require__(/*! ./service/notebook-execution-state-service */ "../../packages/notebook/lib/browser/service/notebook-execution-state-service.js");
const notebook_kernel_service_1 = __webpack_require__(/*! ./service/notebook-kernel-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-service.js");
const notebook_kernel_quick_pick_service_1 = __webpack_require__(/*! ./service/notebook-kernel-quick-pick-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-quick-pick-service.js");
const notebook_kernel_history_service_1 = __webpack_require__(/*! ./service/notebook-kernel-history-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-history-service.js");
const notebook_editor_service_1 = __webpack_require__(/*! ./service/notebook-editor-service */ "../../packages/notebook/lib/browser/service/notebook-editor-service.js");
const notebook_renderer_messaging_service_1 = __webpack_require__(/*! ./service/notebook-renderer-messaging-service */ "../../packages/notebook/lib/browser/service/notebook-renderer-messaging-service.js");
const notebook_color_contribution_1 = __webpack_require__(/*! ./contributions/notebook-color-contribution */ "../../packages/notebook/lib/browser/contributions/notebook-color-contribution.js");
const notebook_cell_context_manager_1 = __webpack_require__(/*! ./service/notebook-cell-context-manager */ "../../packages/notebook/lib/browser/service/notebook-cell-context-manager.js");
const notebook_main_toolbar_1 = __webpack_require__(/*! ./view/notebook-main-toolbar */ "../../packages/notebook/lib/browser/view/notebook-main-toolbar.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(notebook_color_contribution_1.NotebookColorContribution).toSelf().inSingletonScope();
    bind(color_application_contribution_1.ColorContribution).toService(notebook_color_contribution_1.NotebookColorContribution);
    bind(notebook_open_handler_1.NotebookOpenHandler).toSelf().inSingletonScope();
    bind(browser_1.OpenHandler).toService(notebook_open_handler_1.NotebookOpenHandler);
    bind(notebook_type_registry_1.NotebookTypeRegistry).toSelf().inSingletonScope();
    bind(notebook_renderer_registry_1.NotebookRendererRegistry).toSelf().inSingletonScope();
    bind(browser_1.WidgetFactory).to(notebook_editor_widget_factory_1.NotebookEditorWidgetFactory).inSingletonScope();
    bind(notebook_cell_toolbar_factory_1.NotebookCellToolbarFactory).toSelf().inSingletonScope();
    bind(notebook_service_1.NotebookService).toSelf().inSingletonScope();
    bind(notebook_editor_service_1.NotebookEditorWidgetService).toSelf().inSingletonScope();
    bind(notebook_execution_service_1.NotebookExecutionService).toSelf().inSingletonScope();
    bind(notebook_execution_state_service_1.NotebookExecutionStateService).toSelf().inSingletonScope();
    bind(notebook_kernel_service_1.NotebookKernelService).toSelf().inSingletonScope();
    bind(notebook_renderer_messaging_service_1.NotebookRendererMessagingService).toSelf().inSingletonScope();
    bind(notebook_kernel_history_service_1.NotebookKernelHistoryService).toSelf().inSingletonScope();
    bind(notebook_kernel_quick_pick_service_1.NotebookKernelQuickPickService).to(notebook_kernel_quick_pick_service_1.KernelPickerMRUStrategy).inSingletonScope();
    bind(notebook_cell_resource_resolver_1.NotebookCellResourceResolver).toSelf().inSingletonScope();
    bind(core_1.ResourceResolver).toService(notebook_cell_resource_resolver_1.NotebookCellResourceResolver);
    bind(notebook_model_resolver_service_1.NotebookModelResolverService).toSelf().inSingletonScope();
    bind(notebook_cell_actions_contribution_1.NotebookCellActionContribution).toSelf().inSingletonScope();
    bind(core_1.MenuContribution).toService(notebook_cell_actions_contribution_1.NotebookCellActionContribution);
    bind(core_1.CommandContribution).toService(notebook_cell_actions_contribution_1.NotebookCellActionContribution);
    bind(notebook_actions_contribution_1.NotebookActionsContribution).toSelf().inSingletonScope();
    bind(core_1.CommandContribution).toService(notebook_actions_contribution_1.NotebookActionsContribution);
    bind(core_1.MenuContribution).toService(notebook_actions_contribution_1.NotebookActionsContribution);
    bind(notebook_code_cell_view_1.NotebookCodeCellRenderer).toSelf().inSingletonScope();
    bind(notebook_markdown_cell_view_1.NotebookMarkdownCellRenderer).toSelf().inSingletonScope();
    bind(notebook_main_toolbar_1.NotebookMainToolbarRenderer).toSelf().inSingletonScope();
    bind(notebook_editor_widget_1.NotebookEditorContainerFactory).toFactory(ctx => (props) => (0, notebook_editor_widget_1.createNotebookEditorWidgetContainer)(ctx.container, props).get(notebook_editor_widget_1.NotebookEditorWidget));
    bind(notebook_model_1.NotebookModelFactory).toFactory(ctx => (props) => (0, notebook_model_1.createNotebookModelContainer)(ctx.container, props).get(notebook_model_1.NotebookModel));
    bind(notebook_cell_model_1.NotebookCellModelFactory).toFactory(ctx => (props) => (0, notebook_cell_model_1.createNotebookCellModelContainer)(ctx.container, props, notebook_cell_context_manager_1.NotebookCellContextManager).get(notebook_cell_model_1.NotebookCellModel));
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/notebook-frontend-module'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/notebook-open-handler.js":
/*!********************************************************************!*\
  !*** ../../packages/notebook/lib/browser/notebook-open-handler.js ***!
  \********************************************************************/
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookOpenHandler = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const notebook_type_registry_1 = __webpack_require__(/*! ./notebook-type-registry */ "../../packages/notebook/lib/browser/notebook-type-registry.js");
const glob_1 = __webpack_require__(/*! @theia/core/lib/common/glob */ "../../packages/core/lib/common/glob.js");
let NotebookOpenHandler = class NotebookOpenHandler extends browser_1.NavigatableWidgetOpenHandler {
    constructor(notebookTypeRegistry) {
        super();
        this.notebookTypeRegistry = notebookTypeRegistry;
        this.id = 'notebook';
    }
    canHandle(uri, options) {
        const priorities = this.notebookTypeRegistry.notebookTypes
            .filter(notebook => notebook.selector && this.matches(notebook.selector, uri))
            .map(notebook => this.calculatePriority(notebook));
        return Math.max(...priorities);
    }
    findHighestPriorityType(uri) {
        const matchingTypes = this.notebookTypeRegistry.notebookTypes
            .filter(notebookType => notebookType.selector && this.matches(notebookType.selector, uri))
            .map(notebookType => ({ descriptor: notebookType, priority: this.calculatePriority(notebookType) }));
        if (matchingTypes.length === 0) {
            return undefined;
        }
        let type = matchingTypes[0];
        for (let i = 1; i < matchingTypes.length; i++) {
            const notebookType = matchingTypes[i];
            if (notebookType.priority > type.priority) {
                type = notebookType;
            }
        }
        return type.descriptor;
    }
    calculatePriority(notebookType) {
        if (!notebookType) {
            return -1;
        }
        return notebookType.priority === 'option' ? 100 : 200;
    }
    createWidgetOptions(uri, options) {
        const widgetOptions = super.createWidgetOptions(uri, options);
        const notebookType = this.findHighestPriorityType(uri);
        if (!notebookType) {
            throw new Error('No notebook types registered for uri: ' + uri.toString());
        }
        return {
            notebookType: notebookType.type,
            ...widgetOptions
        };
    }
    matches(selectors, resource) {
        return selectors.some(selector => this.selectorMatches(selector, resource));
    }
    selectorMatches(selector, resource) {
        return !!selector.filenamePattern
            && (0, glob_1.match)(selector.filenamePattern, resource.path.name + resource.path.ext);
    }
};
NotebookOpenHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(notebook_type_registry_1.NotebookTypeRegistry)),
    __metadata("design:paramtypes", [notebook_type_registry_1.NotebookTypeRegistry])
], NotebookOpenHandler);
exports.NotebookOpenHandler = NotebookOpenHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/notebook-open-handler'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-cell-context-manager.js":
/*!************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-cell-context-manager.js ***!
  \************************************************************************************/
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCellContextManager = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const notebook_context_keys_1 = __webpack_require__(/*! ../contributions/notebook-context-keys */ "../../packages/notebook/lib/browser/contributions/notebook-context-keys.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/notebook/lib/common/index.js");
const notebook_execution_state_service_1 = __webpack_require__(/*! ../service/notebook-execution-state-service */ "../../packages/notebook/lib/browser/service/notebook-execution-state-service.js");
let NotebookCellContextManager = class NotebookCellContextManager {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
        this.onDidChangeContextEmitter = new core_1.Emitter();
        this.onDidChangeContext = this.onDidChangeContextEmitter.event;
    }
    updateCellContext(cell, newHtmlContext) {
        var _a;
        if (newHtmlContext !== this.currentContext) {
            this.toDispose.dispose();
            (_a = this.currentStore) === null || _a === void 0 ? void 0 : _a.dispose();
            this.currentContext = newHtmlContext;
            this.currentStore = this.contextKeyService.createScoped(newHtmlContext);
            this.currentStore.setContext(notebook_context_keys_1.NOTEBOOK_CELL_TYPE, cell.cellKind === common_1.CellKind.Code ? 'code' : 'markdown');
            this.toDispose.push(cell.onDidRequestCellEditChange(cellEdit => {
                var _a;
                (_a = this.currentStore) === null || _a === void 0 ? void 0 : _a.setContext(notebook_context_keys_1.NOTEBOOK_CELL_MARKDOWN_EDIT_MODE, cellEdit);
                this.onDidChangeContextEmitter.fire();
            }));
            this.toDispose.push(this.executionStateService.onDidChangeExecution(e => {
                var _a, _b, _c, _d;
                if (e.affectsCell(cell.uri)) {
                    (_a = this.currentStore) === null || _a === void 0 ? void 0 : _a.setContext(notebook_context_keys_1.NOTEBOOK_CELL_EXECUTING, !!e.changed);
                    (_b = this.currentStore) === null || _b === void 0 ? void 0 : _b.setContext(notebook_context_keys_1.NOTEBOOK_CELL_EXECUTION_STATE, (_d = (_c = e.changed) === null || _c === void 0 ? void 0 : _c.state) !== null && _d !== void 0 ? _d : 'idle');
                    this.onDidChangeContextEmitter.fire();
                }
            }));
            this.onDidChangeContextEmitter.fire();
        }
    }
    dispose() {
        var _a;
        this.toDispose.dispose();
        (_a = this.currentStore) === null || _a === void 0 ? void 0 : _a.dispose();
        this.onDidChangeContextEmitter.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], NotebookCellContextManager.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_execution_state_service_1.NotebookExecutionStateService),
    __metadata("design:type", notebook_execution_state_service_1.NotebookExecutionStateService)
], NotebookCellContextManager.prototype, "executionStateService", void 0);
NotebookCellContextManager = __decorate([
    (0, inversify_1.injectable)()
], NotebookCellContextManager);
exports.NotebookCellContextManager = NotebookCellContextManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-cell-context-manager'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/common/index.js":
/*!***************************************************!*\
  !*** ../../packages/notebook/lib/common/index.js ***!
  \***************************************************/
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
__exportStar(__webpack_require__(/*! ./notebook-common */ "../../packages/notebook/lib/common/notebook-common.js"), exports);
__exportStar(__webpack_require__(/*! ./notebook-range */ "../../packages/notebook/lib/common/notebook-range.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/common'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/common/notebook-common.js":
/*!*************************************************************!*\
  !*** ../../packages/notebook/lib/common/notebook-common.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "../../node_modules/buffer/index.js")["Buffer"];

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CellUri = exports.isTextStreamMime = exports.CellExecutionUpdateType = exports.NotebookCellExecutionState = exports.SelectionStateType = exports.NotebookCellsChangeType = exports.CellKind = void 0;
const buffer_1 = __webpack_require__(/*! @theia/core/lib/common/buffer */ "../../packages/core/lib/common/buffer.js");
var CellKind;
(function (CellKind) {
    CellKind[CellKind["Markup"] = 1] = "Markup";
    CellKind[CellKind["Code"] = 2] = "Code";
})(CellKind = exports.CellKind || (exports.CellKind = {}));
;
var NotebookCellsChangeType;
(function (NotebookCellsChangeType) {
    NotebookCellsChangeType[NotebookCellsChangeType["ModelChange"] = 1] = "ModelChange";
    NotebookCellsChangeType[NotebookCellsChangeType["Move"] = 2] = "Move";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeCellLanguage"] = 5] = "ChangeCellLanguage";
    NotebookCellsChangeType[NotebookCellsChangeType["Initialize"] = 6] = "Initialize";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeCellMetadata"] = 7] = "ChangeCellMetadata";
    NotebookCellsChangeType[NotebookCellsChangeType["Output"] = 8] = "Output";
    NotebookCellsChangeType[NotebookCellsChangeType["OutputItem"] = 9] = "OutputItem";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeCellContent"] = 10] = "ChangeCellContent";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeDocumentMetadata"] = 11] = "ChangeDocumentMetadata";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeCellInternalMetadata"] = 12] = "ChangeCellInternalMetadata";
    // ChangeCellMime = 13,
    NotebookCellsChangeType[NotebookCellsChangeType["Unknown"] = 100] = "Unknown";
})(NotebookCellsChangeType = exports.NotebookCellsChangeType || (exports.NotebookCellsChangeType = {}));
var SelectionStateType;
(function (SelectionStateType) {
    SelectionStateType[SelectionStateType["Handle"] = 0] = "Handle";
    SelectionStateType[SelectionStateType["Index"] = 1] = "Index";
})(SelectionStateType = exports.SelectionStateType || (exports.SelectionStateType = {}));
;
;
;
var NotebookCellExecutionState;
(function (NotebookCellExecutionState) {
    NotebookCellExecutionState[NotebookCellExecutionState["Unconfirmed"] = 1] = "Unconfirmed";
    NotebookCellExecutionState[NotebookCellExecutionState["Pending"] = 2] = "Pending";
    NotebookCellExecutionState[NotebookCellExecutionState["Executing"] = 3] = "Executing";
})(NotebookCellExecutionState = exports.NotebookCellExecutionState || (exports.NotebookCellExecutionState = {}));
var CellExecutionUpdateType;
(function (CellExecutionUpdateType) {
    CellExecutionUpdateType[CellExecutionUpdateType["Output"] = 1] = "Output";
    CellExecutionUpdateType[CellExecutionUpdateType["OutputItems"] = 2] = "OutputItems";
    CellExecutionUpdateType[CellExecutionUpdateType["ExecutionState"] = 3] = "ExecutionState";
})(CellExecutionUpdateType = exports.CellExecutionUpdateType || (exports.CellExecutionUpdateType = {}));
/**
 * Whether the provided mime type is a text stream like `stdout`, `stderr`.
 */
function isTextStreamMime(mimeType) {
    return ['application/vnd.code.notebook.stdout', 'application/vnd.code.notebook.stderr'].includes(mimeType);
}
exports.isTextStreamMime = isTextStreamMime;
var CellUri;
(function (CellUri) {
    CellUri.scheme = 'vscode-notebook-cell';
    const _lengths = ['W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f'];
    const _padRegexp = new RegExp(`^[${_lengths.join('')}]+`);
    const _radix = 7;
    function generate(notebook, handle) {
        const s = handle.toString(_radix);
        const p = s.length < _lengths.length ? _lengths[s.length - 1] : 'z';
        const fragment = `${p}${s}s${Buffer.from(buffer_1.BinaryBuffer.fromString(notebook.scheme).buffer).toString('base64')} `;
        return notebook.withScheme(CellUri.scheme).withFragment(fragment);
    }
    CellUri.generate = generate;
    function parse(cell) {
        if (cell.scheme !== CellUri.scheme) {
            return undefined;
        }
        const idx = cell.fragment.indexOf('s');
        if (idx < 0) {
            return undefined;
        }
        const handle = parseInt(cell.fragment.substring(0, idx).replace(_padRegexp, ''), _radix);
        const parsedScheme = Buffer.from(cell.fragment.substring(idx + 1), 'base64').toString();
        if (isNaN(handle)) {
            return undefined;
        }
        return {
            handle,
            notebook: cell.withScheme(parsedScheme).withoutFragment()
        };
    }
    CellUri.parse = parse;
    function generateCellPropertyUri(notebook, handle, cellScheme) {
        return CellUri.generate(notebook, handle).withScheme(cellScheme);
    }
    CellUri.generateCellPropertyUri = generateCellPropertyUri;
    function parseCellPropertyUri(uri, propertyScheme) {
        if (uri.scheme !== propertyScheme) {
            return undefined;
        }
        return CellUri.parse(uri.withScheme(CellUri.scheme));
    }
    CellUri.parseCellPropertyUri = parseCellPropertyUri;
})(CellUri = exports.CellUri || (exports.CellUri = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/common/notebook-common'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/common/notebook-range.js":
/*!************************************************************!*\
  !*** ../../packages/notebook/lib/common/notebook-range.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 Typefox and others.
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/common/notebook-range'] = this;


/***/ }),

/***/ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common sync recursive":
/*!*****************************************************************************!*\
  !*** ../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/ sync ***!
  \*****************************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/notebook/src/browser/style/index.css":
/*!*****************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/notebook/src/browser/style/index.css ***!
  \*****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2023 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

:root {
  --theia-notebook-markdown-size: 17px;
}

.theia-notebook-cell-list {
  overflow-y: auto;
  list-style: none;
  padding-left: 0px;
  background-color: var(--theia-notebook-editorBackground);
}

.theia-notebook-cell {
  cursor: grab;
  display: flex;
  margin: 10px 0px;
}

.theia-notebook-cell:hover .theia-notebook-cell-marker {
  visibility: visible;
}

.theia-notebook-cell-marker {
  background-color: var(--theia-notebook-inactiveFocusedCellBorder);
  width: 3px;
  margin: 0px 8px 0px 4px;
  border-radius: 4px;
  visibility: hidden;
}

.theia-notebook-cell-marker-selected {
  visibility: visible;
  background-color: var(--theia-notebook-focusedCellBorder);
}

.theia-notebook-cell-marker:hover {
  width: 5px;
  margin: 0px 6px 0px 4px;
}

.theia-notebook-cell-content {
  flex: 1;
  width: calc(100% - 15px);
}

.theia-notebook-markdown-content {
  padding: 8px 16px 8px 36px;
  font-size: var(--theia-notebook-markdown-size);
}

.theia-notebook-markdown-content > *:first-child {
  margin-top: 0;
  padding-top: 0;
}

.theia-notebook-markdown-content > *:only-child,
.theia-notebook-markdown-content > *:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
}

.theia-notebook-empty-markdown {
  opacity: 0.6;
}

.theia-notebook-cell-editor {
  padding: 10px 10px 0 10px;
}

.theia-notebook-cell-editor-container {
  width: calc(100% - 46px);
  flex: 1;
  outline: 1px solid var(--theia-notebook-cellBorderColor);
  margin: 0px 10px;
}

.theia-notebook-cell.focused .theia-notebook-cell-editor-container {
  outline-color: var(--theia-notebook-focusedEditorBorder);
}

.notebook-cell-status {
  display: flex;
  flex-direction: row;
  font-size: 12px;
  height: 16px;
}

.notebook-cell-status-left {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}

.notebook-cell-status-right {
  margin: 0 5px;
}

.notebook-cell-status-item {
  margin: 0 3px;
  padding: 0 3px;
  display: flex;
  align-items: center;
}

.theia-notebook-cell-toolbar {
  border: 1px solid var(--theia-notebook-cellToolbarSeparator);
  display: flex;
  position: absolute;
  margin: -20px 0 0 66px;
  padding: 2px;
  background-color: var(--theia-editor-background);
}

.theia-notebook-cell-sidebar {
  display: flex;
  flex-direction: column;
  padding: 2px;
  background-color: var(--theia-editor-background);
}

.theia-notebook-cell-toolbar-item {
  height: 18px;
  width: 18px;
}

.theia-notebook-cell-toolbar-item:hover {
  background-color: var(--theia-toolbar-hoverBackground);
}

.theia-notebook-cell-toolbar-item:active {
  background-color: var(--theia-toolbar-active);
}

.theia-notebook-cell-divider {
  height: 20px;
  width: 100%;
}

.theia-notebook-cell-with-sidebar {
  display: flex;
  flex-direction: row;
}

.theia-notebook-cell-sidebar {
  display: flex;
  flex-direction: column;
}

.theia-notebook-main-toolbar {
  position: sticky;
  top: 0;
  background: var(--theia-editor-background);
  display: flex;
  flex-direction: row;
  z-index: 1;
  /*needed to be on rendered on top of monaco editors*/
}

.theia-notebook-main-toolbar-item {
  height: 22px;
  display: flex;
  align-items: center;
  margin: 0 4px;
  padding: 2px;
  text-align: center;
  color: var(--theia-foreground) !important;
  cursor: pointer;
}

.theia-notebook-main-toolbar-item:hover {
  background-color: var(--theia-toolbar-hoverBackground);
}

.theia-notebook-main-toolbar-item-text {
  padding: 0 4px;
}

.theia-notebook-toolbar-separator {
  width: 1px;
  background-color: var(--theia-notebook-cellToolbarSeparator);
  margin: 0 4px;
}

.theia-notebook-add-cell-buttons {
  justify-content: center;
  display: flex;
}

.theia-notebook-add-cell-button {
  border: 1px solid var(--theia-notebook-cellToolbarSeparator);
  background-color: var(--theia-editor-background);
  color: var(--theia-foreground);
  vertical-align: middle;
  text-align: center;
  height: 24px;
  margin: 0 8px;
}

.theia-notebook-add-cell-button:hover {
  background-color: var(--theia-toolbar-hoverBackground);
}

.theia-notebook-add-cell-button:active {
  background-color: var(--theia-toolbar-active);
}

.theia-notebook-add-cell-button-icon {
  vertical-align: middle;
}

.theia-notebook-cell-output-webview {
  padding: 5px 0px;
  margin: 0px 10px;
  width: 100%;
}

.theia-notebook-cell-drop-indicator {
  height: 2px;
  background-color: var(--theia-notebook-focusedCellBorder);
  width: 100%;
}
`, "",{"version":3,"sources":["webpack://./../../packages/notebook/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,oCAAoC;AACtC;;AAEA;EACE,gBAAgB;EAChB,gBAAgB;EAChB,iBAAiB;EACjB,wDAAwD;AAC1D;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,gBAAgB;AAClB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,iEAAiE;EACjE,UAAU;EACV,uBAAuB;EACvB,kBAAkB;EAClB,kBAAkB;AACpB;;AAEA;EACE,mBAAmB;EACnB,yDAAyD;AAC3D;;AAEA;EACE,UAAU;EACV,uBAAuB;AACzB;;AAEA;EACE,OAAO;EACP,wBAAwB;AAC1B;;AAEA;EACE,0BAA0B;EAC1B,8CAA8C;AAChD;;AAEA;EACE,aAAa;EACb,cAAc;AAChB;;AAEA;;EAEE,gBAAgB;EAChB,iBAAiB;AACnB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,wBAAwB;EACxB,OAAO;EACP,wDAAwD;EACxD,gBAAgB;AAClB;;AAEA;EACE,wDAAwD;AAC1D;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,eAAe;EACf,YAAY;AACd;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,YAAY;AACd;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,aAAa;EACb,cAAc;EACd,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,4DAA4D;EAC5D,aAAa;EACb,kBAAkB;EAClB,sBAAsB;EACtB,YAAY;EACZ,gDAAgD;AAClD;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,YAAY;EACZ,gDAAgD;AAClD;;AAEA;EACE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,sDAAsD;AACxD;;AAEA;EACE,6CAA6C;AAC/C;;AAEA;EACE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,gBAAgB;EAChB,MAAM;EACN,0CAA0C;EAC1C,aAAa;EACb,mBAAmB;EACnB,UAAU;EACV,oDAAoD;AACtD;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,aAAa;EACb,YAAY;EACZ,kBAAkB;EAClB,yCAAyC;EACzC,eAAe;AACjB;;AAEA;EACE,sDAAsD;AACxD;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,UAAU;EACV,4DAA4D;EAC5D,aAAa;AACf;;AAEA;EACE,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,4DAA4D;EAC5D,gDAAgD;EAChD,8BAA8B;EAC9B,sBAAsB;EACtB,kBAAkB;EAClB,YAAY;EACZ,aAAa;AACf;;AAEA;EACE,sDAAsD;AACxD;;AAEA;EACE,6CAA6C;AAC/C;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,gBAAgB;EAChB,gBAAgB;EAChB,WAAW;AACb;;AAEA;EACE,WAAW;EACX,yDAAyD;EACzD,WAAW;AACb","sourcesContent":["/********************************************************************************\n * Copyright (C) 2023 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n:root {\n  --theia-notebook-markdown-size: 17px;\n}\n\n.theia-notebook-cell-list {\n  overflow-y: auto;\n  list-style: none;\n  padding-left: 0px;\n  background-color: var(--theia-notebook-editorBackground);\n}\n\n.theia-notebook-cell {\n  cursor: grab;\n  display: flex;\n  margin: 10px 0px;\n}\n\n.theia-notebook-cell:hover .theia-notebook-cell-marker {\n  visibility: visible;\n}\n\n.theia-notebook-cell-marker {\n  background-color: var(--theia-notebook-inactiveFocusedCellBorder);\n  width: 3px;\n  margin: 0px 8px 0px 4px;\n  border-radius: 4px;\n  visibility: hidden;\n}\n\n.theia-notebook-cell-marker-selected {\n  visibility: visible;\n  background-color: var(--theia-notebook-focusedCellBorder);\n}\n\n.theia-notebook-cell-marker:hover {\n  width: 5px;\n  margin: 0px 6px 0px 4px;\n}\n\n.theia-notebook-cell-content {\n  flex: 1;\n  width: calc(100% - 15px);\n}\n\n.theia-notebook-markdown-content {\n  padding: 8px 16px 8px 36px;\n  font-size: var(--theia-notebook-markdown-size);\n}\n\n.theia-notebook-markdown-content > *:first-child {\n  margin-top: 0;\n  padding-top: 0;\n}\n\n.theia-notebook-markdown-content > *:only-child,\n.theia-notebook-markdown-content > *:last-child {\n  margin-bottom: 0;\n  padding-bottom: 0;\n}\n\n.theia-notebook-empty-markdown {\n  opacity: 0.6;\n}\n\n.theia-notebook-cell-editor {\n  padding: 10px 10px 0 10px;\n}\n\n.theia-notebook-cell-editor-container {\n  width: calc(100% - 46px);\n  flex: 1;\n  outline: 1px solid var(--theia-notebook-cellBorderColor);\n  margin: 0px 10px;\n}\n\n.theia-notebook-cell.focused .theia-notebook-cell-editor-container {\n  outline-color: var(--theia-notebook-focusedEditorBorder);\n}\n\n.notebook-cell-status {\n  display: flex;\n  flex-direction: row;\n  font-size: 12px;\n  height: 16px;\n}\n\n.notebook-cell-status-left {\n  display: flex;\n  flex-direction: row;\n  flex-grow: 1;\n}\n\n.notebook-cell-status-right {\n  margin: 0 5px;\n}\n\n.notebook-cell-status-item {\n  margin: 0 3px;\n  padding: 0 3px;\n  display: flex;\n  align-items: center;\n}\n\n.theia-notebook-cell-toolbar {\n  border: 1px solid var(--theia-notebook-cellToolbarSeparator);\n  display: flex;\n  position: absolute;\n  margin: -20px 0 0 66px;\n  padding: 2px;\n  background-color: var(--theia-editor-background);\n}\n\n.theia-notebook-cell-sidebar {\n  display: flex;\n  flex-direction: column;\n  padding: 2px;\n  background-color: var(--theia-editor-background);\n}\n\n.theia-notebook-cell-toolbar-item {\n  height: 18px;\n  width: 18px;\n}\n\n.theia-notebook-cell-toolbar-item:hover {\n  background-color: var(--theia-toolbar-hoverBackground);\n}\n\n.theia-notebook-cell-toolbar-item:active {\n  background-color: var(--theia-toolbar-active);\n}\n\n.theia-notebook-cell-divider {\n  height: 20px;\n  width: 100%;\n}\n\n.theia-notebook-cell-with-sidebar {\n  display: flex;\n  flex-direction: row;\n}\n\n.theia-notebook-cell-sidebar {\n  display: flex;\n  flex-direction: column;\n}\n\n.theia-notebook-main-toolbar {\n  position: sticky;\n  top: 0;\n  background: var(--theia-editor-background);\n  display: flex;\n  flex-direction: row;\n  z-index: 1;\n  /*needed to be on rendered on top of monaco editors*/\n}\n\n.theia-notebook-main-toolbar-item {\n  height: 22px;\n  display: flex;\n  align-items: center;\n  margin: 0 4px;\n  padding: 2px;\n  text-align: center;\n  color: var(--theia-foreground) !important;\n  cursor: pointer;\n}\n\n.theia-notebook-main-toolbar-item:hover {\n  background-color: var(--theia-toolbar-hoverBackground);\n}\n\n.theia-notebook-main-toolbar-item-text {\n  padding: 0 4px;\n}\n\n.theia-notebook-toolbar-separator {\n  width: 1px;\n  background-color: var(--theia-notebook-cellToolbarSeparator);\n  margin: 0 4px;\n}\n\n.theia-notebook-add-cell-buttons {\n  justify-content: center;\n  display: flex;\n}\n\n.theia-notebook-add-cell-button {\n  border: 1px solid var(--theia-notebook-cellToolbarSeparator);\n  background-color: var(--theia-editor-background);\n  color: var(--theia-foreground);\n  vertical-align: middle;\n  text-align: center;\n  height: 24px;\n  margin: 0 8px;\n}\n\n.theia-notebook-add-cell-button:hover {\n  background-color: var(--theia-toolbar-hoverBackground);\n}\n\n.theia-notebook-add-cell-button:active {\n  background-color: var(--theia-toolbar-active);\n}\n\n.theia-notebook-add-cell-button-icon {\n  vertical-align: middle;\n}\n\n.theia-notebook-cell-output-webview {\n  padding: 5px 0px;\n  margin: 0px 10px;\n  width: 100%;\n}\n\n.theia-notebook-cell-drop-indicator {\n  height: 2px;\n  background-color: var(--theia-notebook-focusedCellBorder);\n  width: 100%;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/notebook/src/browser/style/index.css":
/*!***********************************************************!*\
  !*** ../../packages/notebook/src/browser/style/index.css ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/notebook/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII= ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=";

/***/ }),

/***/ "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg== ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

/***/ }),

/***/ "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg== ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

/***/ })

}]);
//# sourceMappingURL=packages_core_lib_common_markdown-rendering_markdown-string_js-packages_core_shared_lodash_de-7061bd.js.map