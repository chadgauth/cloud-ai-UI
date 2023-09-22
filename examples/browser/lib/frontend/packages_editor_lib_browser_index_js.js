"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_editor_lib_browser_index_js"],{

/***/ "../../packages/editor/lib/browser/decorations/editor-decoration-style.js":
/*!********************************************************************************!*\
  !*** ../../packages/editor/lib/browser/decorations/editor-decoration-style.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.EditorDecorationStyle = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
class EditorDecorationStyle {
    constructor(selector, styleProvider, decorationsStyleSheet) {
        this.selector = selector;
        this.decorationsStyleSheet = decorationsStyleSheet;
        const styleRule = browser_1.DecorationStyle.getOrCreateStyleRule(selector, decorationsStyleSheet);
        if (styleRule) {
            styleProvider(styleRule.style);
        }
    }
    get className() {
        return this.selector.split('::')[0];
    }
    dispose() {
        browser_1.DecorationStyle.deleteStyleRule(this.selector, this.decorationsStyleSheet);
    }
}
exports.EditorDecorationStyle = EditorDecorationStyle;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/decorations/editor-decoration-style'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/decorations/editor-decoration.js":
/*!**************************************************************************!*\
  !*** ../../packages/editor/lib/browser/decorations/editor-decoration.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.TrackedRangeStickiness = exports.OverviewRulerLane = exports.MinimapPosition = void 0;
var MinimapPosition;
(function (MinimapPosition) {
    MinimapPosition[MinimapPosition["Inline"] = 1] = "Inline";
    MinimapPosition[MinimapPosition["Gutter"] = 2] = "Gutter";
})(MinimapPosition = exports.MinimapPosition || (exports.MinimapPosition = {}));
var OverviewRulerLane;
(function (OverviewRulerLane) {
    OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
    OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
    OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
    OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
})(OverviewRulerLane = exports.OverviewRulerLane || (exports.OverviewRulerLane = {}));
var TrackedRangeStickiness;
(function (TrackedRangeStickiness) {
    TrackedRangeStickiness[TrackedRangeStickiness["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
    TrackedRangeStickiness[TrackedRangeStickiness["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
    TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
    TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
})(TrackedRangeStickiness = exports.TrackedRangeStickiness || (exports.TrackedRangeStickiness = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/decorations/editor-decoration'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/decorations/editor-decorator.js":
/*!*************************************************************************!*\
  !*** ../../packages/editor/lib/browser/decorations/editor-decorator.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let EditorDecorator = class EditorDecorator {
    constructor() {
        this.appliedDecorations = new Map();
    }
    setDecorations(editor, newDecorations) {
        const uri = editor.uri.toString();
        const oldDecorations = this.appliedDecorations.get(uri) || [];
        if (oldDecorations.length === 0 && newDecorations.length === 0) {
            return;
        }
        const decorationIds = editor.deltaDecorations({ oldDecorations, newDecorations });
        this.appliedDecorations.set(uri, decorationIds);
    }
};
EditorDecorator = __decorate([
    (0, inversify_1.injectable)()
], EditorDecorator);
exports.EditorDecorator = EditorDecorator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/decorations/editor-decorator'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/decorations/index.js":
/*!**************************************************************!*\
  !*** ../../packages/editor/lib/browser/decorations/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
__exportStar(__webpack_require__(/*! ./editor-decoration */ "../../packages/editor/lib/browser/decorations/editor-decoration.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-decoration-style */ "../../packages/editor/lib/browser/decorations/editor-decoration-style.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-decorator */ "../../packages/editor/lib/browser/decorations/editor-decorator.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/decorations'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/diff-navigator.js":
/*!***********************************************************!*\
  !*** ../../packages/editor/lib/browser/diff-navigator.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.DiffNavigatorProvider = void 0;
exports.DiffNavigatorProvider = Symbol('DiffNavigatorProvider');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/diff-navigator'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/index.js":
/*!**************************************************!*\
  !*** ../../packages/editor/lib/browser/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
__exportStar(__webpack_require__(/*! ./diff-navigator */ "../../packages/editor/lib/browser/diff-navigator.js"), exports);
__exportStar(__webpack_require__(/*! ./editor */ "../../packages/editor/lib/browser/editor.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-widget */ "../../packages/editor/lib/browser/editor-widget.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-manager */ "../../packages/editor/lib/browser/editor-manager.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-command */ "../../packages/editor/lib/browser/editor-command.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-menu */ "../../packages/editor/lib/browser/editor-menu.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-frontend-module */ "../../packages/editor/lib/browser/editor-frontend-module.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-preferences */ "../../packages/editor/lib/browser/editor-preferences.js"), exports);
__exportStar(__webpack_require__(/*! ./decorations */ "../../packages/editor/lib/browser/decorations/index.js"), exports);
__exportStar(__webpack_require__(/*! ./editor-linenumber-contribution */ "../../packages/editor/lib/browser/editor-linenumber-contribution.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_editor_lib_browser_index_js.js.map