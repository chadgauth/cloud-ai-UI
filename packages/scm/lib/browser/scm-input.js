"use strict";
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.ScmInput = exports.ScmInputIssueType = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const debounce = require("p-debounce");
const common_1 = require("@theia/core/lib/common");
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
var ScmInputIssueType;
(function (ScmInputIssueType) {
    ScmInputIssueType[ScmInputIssueType["Error"] = 0] = "Error";
    ScmInputIssueType[ScmInputIssueType["Warning"] = 1] = "Warning";
    ScmInputIssueType[ScmInputIssueType["Information"] = 2] = "Information";
})(ScmInputIssueType = exports.ScmInputIssueType || (exports.ScmInputIssueType = {}));
class ScmInput {
    constructor(options = {}) {
        var _a;
        this.options = options;
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onDidFocusEmitter = new common_1.Emitter();
        this.onDidFocus = this.onDidFocusEmitter.event;
        this.toDispose = new common_1.DisposableCollection(this.onDidChangeEmitter, this.onDidFocusEmitter);
        this._placeholder = this.options.placeholder;
        this._visible = this.options.visible;
        this._enabled = (_a = this.options.enabled) !== null && _a !== void 0 ? _a : true;
        this.validate = debounce(async () => {
            if (this.options.validator) {
                this.issue = await this.options.validator(this.value);
            }
        }, 200);
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    dispose() {
        this.toDispose.dispose();
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(placeholder) {
        if (this._placeholder === placeholder) {
            return;
        }
        this._placeholder = placeholder;
        this.fireDidChange();
    }
    get value() {
        return this._value || '';
    }
    set value(value) {
        if (this.value === value) {
            return;
        }
        this._value = value;
        this.fireDidChange();
        this.validate();
    }
    get visible() {
        var _a;
        return (_a = this._visible) !== null && _a !== void 0 ? _a : true;
    }
    set visible(visible) {
        if (this.visible === visible) {
            return;
        }
        this._visible = visible;
        this.fireDidChange();
        this.validate();
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(enabled) {
        if (this._enabled === enabled) {
            return;
        }
        this._enabled = enabled;
        this.fireDidChange();
        this.validate();
    }
    get issue() {
        return this._issue;
    }
    set issue(issue) {
        if (coreutils_1.JSONExt.deepEqual((this._issue || {}), (issue || {}))) {
            return;
        }
        this._issue = issue;
        this.fireDidChange();
    }
    focus() {
        this.onDidFocusEmitter.fire(undefined);
    }
    toJSON() {
        return {
            value: this._value,
            issue: this._issue
        };
    }
    fromJSON(data) {
        if (this._value !== undefined) {
            return;
        }
        if ('value' in data) {
            this._value = data.value;
            this._issue = data.issue;
            this.fireDidChange();
        }
    }
}
exports.ScmInput = ScmInput;
//# sourceMappingURL=scm-input.js.map