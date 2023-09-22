"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_lib_browser_widgets_alert-message_js-packages_scm_lib_browser_scm-avatar-servic-9a4677"],{

/***/ "../../packages/core/lib/browser/widgets/alert-message.js":
/*!****************************************************************!*\
  !*** ../../packages/core/lib/browser/widgets/alert-message.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.AlertMessage = void 0;
const React = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
const widget_1 = __webpack_require__(/*! ./widget */ "../../packages/core/lib/browser/widgets/widget.js");
const AlertMessageIcon = {
    INFO: (0, widget_1.codicon)('info'),
    SUCCESS: (0, widget_1.codicon)('pass'),
    WARNING: (0, widget_1.codicon)('warning'),
    ERROR: (0, widget_1.codicon)('error')
};
class AlertMessage extends React.Component {
    render() {
        return React.createElement("div", { className: 'theia-alert-message-container' },
            React.createElement("div", { className: `theia-${this.props.type.toLowerCase()}-alert` },
                React.createElement("div", { className: 'theia-message-header' },
                    React.createElement("i", { className: AlertMessageIcon[this.props.type] }),
                    "\u00A0",
                    this.props.header),
                React.createElement("div", { className: 'theia-message-content' }, this.props.children)));
    }
}
exports.AlertMessage = AlertMessage;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/widgets/alert-message'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-avatar-service.js":
/*!************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-avatar-service.js ***!
  \************************************************************/
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
exports.ScmAvatarService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const ts_md5_1 = __webpack_require__(/*! ts-md5 */ "../../node_modules/ts-md5/dist/esm/index.js");
let ScmAvatarService = class ScmAvatarService {
    async getAvatar(email) {
        const hash = ts_md5_1.Md5.hashStr(email);
        return `https://www.gravatar.com/avatar/${hash}?d=robohash`;
    }
};
ScmAvatarService = __decorate([
    (0, inversify_1.injectable)()
], ScmAvatarService);
exports.ScmAvatarService = ScmAvatarService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-avatar-service'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-input.js":
/*!***************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-input.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmInput = exports.ScmInputIssueType = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const coreutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/coreutils */ "../../packages/core/shared/@phosphor/coreutils/index.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-input'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-repository.js":
/*!********************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-repository.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmRepository = void 0;
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const scm_input_1 = __webpack_require__(/*! ./scm-input */ "../../packages/scm/lib/browser/scm-input.js");
class ScmRepository {
    constructor(provider, options = {}) {
        this.provider = provider;
        this.options = options;
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.toDispose = new common_1.DisposableCollection(this.onDidChangeEmitter);
        this.toDispose.pushAll([
            this.provider,
            this.input = new scm_input_1.ScmInput(options.input),
            this.input.onDidChange(() => this.fireDidChange())
        ]);
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    dispose() {
        this.toDispose.dispose();
    }
}
exports.ScmRepository = ScmRepository;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-repository'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-service.js":
/*!*****************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-service.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.ScmService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const scm_context_key_service_1 = __webpack_require__(/*! ./scm-context-key-service */ "../../packages/scm/lib/browser/scm-context-key-service.js");
const scm_repository_1 = __webpack_require__(/*! ./scm-repository */ "../../packages/scm/lib/browser/scm-repository.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
let ScmService = class ScmService {
    constructor() {
        this._repositories = new Map();
        this.onDidChangeSelectedRepositoryEmitter = new common_1.Emitter();
        this.onDidChangeSelectedRepository = this.onDidChangeSelectedRepositoryEmitter.event;
        this.onDidAddRepositoryEmitter = new common_1.Emitter();
        this.onDidAddRepository = this.onDidAddRepositoryEmitter.event;
        this.onDidRemoveRepositoryEmitter = new common_1.Emitter();
        this.onDidRemoveRepository = this.onDidAddRepositoryEmitter.event;
        this.onDidChangeStatusBarCommandsEmitter = new common_1.Emitter();
        this.onDidChangeStatusBarCommands = this.onDidChangeStatusBarCommandsEmitter.event;
        this.toDisposeOnSelected = new common_1.DisposableCollection();
    }
    fireDidChangeStatusBarCommands() {
        this.onDidChangeStatusBarCommandsEmitter.fire(this.statusBarCommands);
    }
    get statusBarCommands() {
        const repository = this.selectedRepository;
        return repository && repository.provider.statusBarCommands || [];
    }
    get repositories() {
        return [...this._repositories.values()];
    }
    get selectedRepository() {
        return this._selectedRepository;
    }
    set selectedRepository(repository) {
        if (this._selectedRepository === repository) {
            return;
        }
        this.toDisposeOnSelected.dispose();
        this._selectedRepository = repository;
        if (this._selectedRepository) {
            if (this._selectedRepository.provider.onDidChangeStatusBarCommands) {
                this.toDisposeOnSelected.push(this._selectedRepository.provider.onDidChangeStatusBarCommands(() => this.fireDidChangeStatusBarCommands()));
            }
        }
        this.onDidChangeSelectedRepositoryEmitter.fire(this._selectedRepository);
        this.fireDidChangeStatusBarCommands();
    }
    findRepository(uri) {
        const reposSorted = this.repositories.sort((ra, rb) => rb.provider.rootUri.length - ra.provider.rootUri.length);
        return reposSorted.find(repo => new uri_1.default(repo.provider.rootUri).isEqualOrParent(uri));
    }
    registerScmProvider(provider, options = {}) {
        const key = provider.id + ':' + provider.rootUri;
        if (this._repositories.has(key)) {
            throw new Error(`${provider.label} provider for '${provider.rootUri}' already exists.`);
        }
        const repository = new scm_repository_1.ScmRepository(provider, options);
        const dispose = repository.dispose;
        repository.dispose = () => {
            this._repositories.delete(key);
            dispose.bind(repository)();
            this.onDidRemoveRepositoryEmitter.fire(repository);
            if (this._selectedRepository === repository) {
                this.selectedRepository = this._repositories.values().next().value;
            }
        };
        this._repositories.set(key, repository);
        this.onDidAddRepositoryEmitter.fire(repository);
        if (this._repositories.size === 1) {
            this.selectedRepository = repository;
        }
        return repository;
    }
};
__decorate([
    (0, inversify_1.inject)(scm_context_key_service_1.ScmContextKeyService),
    __metadata("design:type", scm_context_key_service_1.ScmContextKeyService)
], ScmService.prototype, "contextKeys", void 0);
ScmService = __decorate([
    (0, inversify_1.injectable)()
], ScmService);
exports.ScmService = ScmService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-service'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_lib_browser_widgets_alert-message_js-packages_scm_lib_browser_scm-avatar-servic-9a4677.js.map