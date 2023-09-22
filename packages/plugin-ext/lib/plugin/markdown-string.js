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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MarkdownString_delegate;
var MarkdownString_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownString = void 0;
const markdown_rendering_1 = require("@theia/core/lib/common/markdown-rendering");
const types_1 = require("../common/types");
const types_impl_1 = require("./types-impl");
// Copied from https://github.com/microsoft/vscode/blob/7d9b1c37f8e5ae3772782ba3b09d827eb3fdd833/src/vs/workbench/api/common/extHostTypes.ts
let MarkdownString = MarkdownString_1 = class MarkdownString {
    constructor(value, supportThemeIcons = false) {
        _MarkdownString_delegate.set(this, void 0);
        __classPrivateFieldSet(this, _MarkdownString_delegate, new markdown_rendering_1.MarkdownStringImpl(value, { supportThemeIcons }), "f");
    }
    /**
     * @returns whether the thing is a markdown string implementation with helper methods.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static isMarkdownString(thing) {
        if (thing instanceof MarkdownString_1) {
            return true;
        }
        return thing && thing.appendCodeblock && thing.appendMarkdown && thing.appendText && (thing.value !== undefined);
    }
    get value() {
        return __classPrivateFieldGet(this, _MarkdownString_delegate, "f").value;
    }
    set value(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").value = value;
    }
    get isTrusted() {
        return __classPrivateFieldGet(this, _MarkdownString_delegate, "f").isTrusted;
    }
    set isTrusted(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").isTrusted = value;
    }
    get supportThemeIcons() {
        return __classPrivateFieldGet(this, _MarkdownString_delegate, "f").supportThemeIcons;
    }
    set supportThemeIcons(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").supportThemeIcons = value;
    }
    get supportHtml() {
        return __classPrivateFieldGet(this, _MarkdownString_delegate, "f").supportHtml;
    }
    set supportHtml(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").supportHtml = value;
    }
    get baseUri() {
        return types_impl_1.URI.revive(__classPrivateFieldGet(this, _MarkdownString_delegate, "f").baseUri);
    }
    set baseUri(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").baseUri = value;
    }
    appendText(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").appendText(value);
        return this;
    }
    appendMarkdown(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").appendMarkdown(value);
        return this;
    }
    appendCodeblock(value, language) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").appendCodeblock(language !== null && language !== void 0 ? language : '', value);
        return this;
    }
    toJSON() {
        const plainObject = { value: this.value };
        if (this.isTrusted !== undefined) {
            plainObject.isTrusted = this.isTrusted;
        }
        if (this.supportThemeIcons !== undefined) {
            plainObject.supportThemeIcons = this.supportThemeIcons;
        }
        if (this.supportHtml !== undefined) {
            plainObject.supportHtml = this.supportHtml;
        }
        if (this.baseUri !== undefined) {
            plainObject.baseUri = this.baseUri.toJSON();
        }
        return plainObject;
    }
};
_MarkdownString_delegate = new WeakMap();
MarkdownString = MarkdownString_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Boolean])
], MarkdownString);
exports.MarkdownString = MarkdownString;
//# sourceMappingURL=markdown-string.js.map