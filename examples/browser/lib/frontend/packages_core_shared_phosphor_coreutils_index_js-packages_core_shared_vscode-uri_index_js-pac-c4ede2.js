(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_phosphor_coreutils_index_js-packages_core_shared_vscode-uri_index_js-pac-c4ede2"],{

/***/ "../../packages/core/shared/@phosphor/coreutils/index.js":
/*!***************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/coreutils/index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/coreutils */ "../../node_modules/@phosphor/coreutils/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/coreutils'] = this;


/***/ }),

/***/ "../../packages/core/shared/vscode-uri/index.js":
/*!******************************************************!*\
  !*** ../../packages/core/shared/vscode-uri/index.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! vscode-uri */ "../../node_modules/vscode-uri/lib/esm/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/vscode-uri'] = this;


/***/ }),

/***/ "../../packages/markers/lib/browser/index.js":
/*!***************************************************!*\
  !*** ../../packages/markers/lib/browser/index.js ***!
  \***************************************************/
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
__exportStar(__webpack_require__(/*! ./marker-manager */ "../../packages/markers/lib/browser/marker-manager.js"), exports);
__exportStar(__webpack_require__(/*! ./problem/problem-manager */ "../../packages/markers/lib/browser/problem/problem-manager.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-languages.js":
/*!*************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-languages.js ***!
  \*************************************************************/
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
exports.MonacoLanguages = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const problem_manager_1 = __webpack_require__(/*! @theia/markers/lib/browser/problem/problem-manager */ "../../packages/markers/lib/browser/problem/problem-manager.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const monaco_marker_collection_1 = __webpack_require__(/*! ./monaco-marker-collection */ "../../packages/monaco/lib/browser/monaco-marker-collection.js");
const protocol_to_monaco_converter_1 = __webpack_require__(/*! ./protocol-to-monaco-converter */ "../../packages/monaco/lib/browser/protocol-to-monaco-converter.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
let MonacoLanguages = class MonacoLanguages {
    constructor() {
        this.workspaceSymbolProviders = [];
        this.markers = new Map();
    }
    init() {
        this.problemManager.onDidChangeMarkers(uri => this.updateMarkers(uri));
        monaco.editor.onDidCreateModel(model => this.updateModelMarkers(model));
    }
    updateMarkers(uri) {
        const markers = this.problemManager.findMarkers({ uri });
        const uriString = uri.toString();
        const collection = this.markers.get(uriString) || new monaco_marker_collection_1.MonacoMarkerCollection(uri, this.p2m);
        this.markers.set(uriString, collection);
        collection.updateMarkers(markers);
    }
    updateModelMarkers(model) {
        const uriString = model.uri.toString();
        const uri = new uri_1.default(uriString);
        const collection = this.markers.get(uriString) || new monaco_marker_collection_1.MonacoMarkerCollection(uri, this.p2m);
        this.markers.set(uriString, collection);
        collection.updateModelMarkers(model);
    }
    registerWorkspaceSymbolProvider(provider) {
        this.workspaceSymbolProviders.push(provider);
        return disposable_1.Disposable.create(() => {
            const index = this.workspaceSymbolProviders.indexOf(provider);
            if (index !== -1) {
                this.workspaceSymbolProviders.splice(index, 1);
            }
        });
    }
    get languages() {
        return [...this.mergeLanguages(monaco.languages.getLanguages()).values()];
    }
    getLanguage(languageId) {
        return this.mergeLanguages(monaco.languages.getLanguages().filter(language => language.id === languageId)).get(languageId);
    }
    getExtension(languageId) {
        var _a;
        return (_a = this.getLanguage(languageId)) === null || _a === void 0 ? void 0 : _a.extensions.values().next().value;
    }
    getLanguageIdByLanguageName(languageName) {
        var _a;
        return (_a = monaco.languages.getLanguages().find(language => { var _a; return (_a = language.aliases) === null || _a === void 0 ? void 0 : _a.includes(languageName); })) === null || _a === void 0 ? void 0 : _a.id;
    }
    mergeLanguages(registered) {
        const languages = new Map();
        for (const { id, aliases, extensions, filenames } of registered) {
            const merged = languages.get(id) || {
                id,
                name: '',
                extensions: new Set(),
                filenames: new Set()
            };
            if (!merged.name && aliases && aliases.length) {
                merged.name = aliases[0];
            }
            if (extensions && extensions.length) {
                for (const extension of extensions) {
                    merged.extensions.add(extension);
                }
            }
            if (filenames && filenames.length) {
                for (const filename of filenames) {
                    merged.filenames.add(filename);
                }
            }
            languages.set(id, merged);
        }
        for (const [id, language] of languages) {
            if (!language.name) {
                language.name = id;
            }
        }
        return languages;
    }
};
__decorate([
    (0, inversify_1.inject)(problem_manager_1.ProblemManager),
    __metadata("design:type", problem_manager_1.ProblemManager)
], MonacoLanguages.prototype, "problemManager", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], MonacoLanguages.prototype, "p2m", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoLanguages.prototype, "init", null);
MonacoLanguages = __decorate([
    (0, inversify_1.injectable)()
], MonacoLanguages);
exports.MonacoLanguages = MonacoLanguages;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-languages'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-marker-collection.js":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-marker-collection.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.MonacoMarkerCollection = void 0;
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
class MonacoMarkerCollection {
    constructor(uri, p2m) {
        this.markers = [];
        this.owners = new Map();
        this.didUpdate = false;
        this.uri = monaco.Uri.parse(uri.toString());
        this.p2m = p2m;
    }
    updateMarkers(markers) {
        this.markers = markers;
        const model = monaco.editor.getModel(this.uri);
        this.doUpdateMarkers(model ? model : undefined);
    }
    updateModelMarkers(model) {
        if (!this.didUpdate) {
            this.doUpdateMarkers(model);
            return;
        }
        for (const [owner, diagnostics] of this.owners) {
            this.setModelMarkers(model, owner, diagnostics);
        }
    }
    doUpdateMarkers(model) {
        if (!model) {
            this.didUpdate = false;
            return;
        }
        this.didUpdate = true;
        const toClean = new Set(this.owners.keys());
        this.owners.clear();
        for (const marker of this.markers) {
            const diagnostics = this.owners.get(marker.owner) || [];
            diagnostics.push(marker.data);
            this.owners.set(marker.owner, diagnostics);
        }
        for (const [owner, diagnostics] of this.owners) {
            toClean.delete(owner);
            this.setModelMarkers(model, owner, diagnostics);
        }
        for (const owner of toClean) {
            this.clearModelMarkers(model, owner);
        }
    }
    setModelMarkers(model, owner, diagnostics) {
        monaco.editor.setModelMarkers(model, owner, this.p2m.asDiagnostics(diagnostics));
    }
    clearModelMarkers(model, owner) {
        monaco.editor.setModelMarkers(model, owner, []);
    }
}
exports.MonacoMarkerCollection = MonacoMarkerCollection;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-marker-collection'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/protocol-to-monaco-converter.js":
/*!*************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/protocol-to-monaco-converter.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.ProtocolToMonacoConverter = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
let ProtocolToMonacoConverter = class ProtocolToMonacoConverter {
    asRange(range) {
        if (range === undefined) {
            return undefined;
        }
        const start = this.asPosition(range.start);
        const end = this.asPosition(range.end);
        if (start instanceof monaco.Position && end instanceof monaco.Position) {
            return new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column);
        }
        const startLineNumber = !start || start.lineNumber === undefined ? undefined : start.lineNumber;
        const startColumn = !start || start.column === undefined ? undefined : start.column;
        const endLineNumber = !end || end.lineNumber === undefined ? undefined : end.lineNumber;
        const endColumn = !end || end.column === undefined ? undefined : end.column;
        return { startLineNumber, startColumn, endLineNumber, endColumn };
    }
    asPosition(position) {
        if (position === undefined) {
            return undefined;
        }
        const { line, character } = position;
        const lineNumber = line === undefined ? undefined : line + 1;
        const column = character === undefined ? undefined : character + 1;
        if (lineNumber !== undefined && column !== undefined) {
            return new monaco.Position(lineNumber, column);
        }
        return { lineNumber, column };
    }
    asLocation(item) {
        if (!item) {
            return undefined;
        }
        const uri = monaco.Uri.parse(item.uri);
        const range = this.asRange(item.range);
        return {
            uri, range
        };
    }
    asTextEdit(edit) {
        if (!edit) {
            return undefined;
        }
        const range = this.asRange(edit.range);
        return {
            range,
            text: edit.newText
        };
    }
    asTextEdits(items) {
        if (!items) {
            return undefined;
        }
        return items.map(item => this.asTextEdit(item));
    }
    asSeverity(severity) {
        if (severity === 1) {
            return monaco.MarkerSeverity.Error;
        }
        if (severity === 2) {
            return monaco.MarkerSeverity.Warning;
        }
        if (severity === 3) {
            return monaco.MarkerSeverity.Info;
        }
        return monaco.MarkerSeverity.Hint;
    }
    asDiagnostics(diagnostics) {
        if (!diagnostics) {
            return undefined;
        }
        return diagnostics.map(diagnostic => this.asDiagnostic(diagnostic));
    }
    asDiagnostic(diagnostic) {
        return {
            code: typeof diagnostic.code === 'number' ? diagnostic.code.toString() : diagnostic.code,
            severity: this.asSeverity(diagnostic.severity),
            message: diagnostic.message,
            source: diagnostic.source,
            startLineNumber: diagnostic.range.start.line + 1,
            startColumn: diagnostic.range.start.character + 1,
            endLineNumber: diagnostic.range.end.line + 1,
            endColumn: diagnostic.range.end.character + 1,
            relatedInformation: this.asRelatedInformations(diagnostic.relatedInformation),
            tags: diagnostic.tags
        };
    }
    asRelatedInformations(relatedInformation) {
        if (!relatedInformation) {
            return undefined;
        }
        return relatedInformation.map(item => this.asRelatedInformation(item));
    }
    asRelatedInformation(relatedInformation) {
        return {
            resource: monaco.Uri.parse(relatedInformation.location.uri),
            startLineNumber: relatedInformation.location.range.start.line + 1,
            startColumn: relatedInformation.location.range.start.character + 1,
            endLineNumber: relatedInformation.location.range.end.line + 1,
            endColumn: relatedInformation.location.range.end.character + 1,
            message: relatedInformation.message
        };
    }
};
ProtocolToMonacoConverter = __decorate([
    (0, inversify_1.injectable)()
], ProtocolToMonacoConverter);
exports.ProtocolToMonacoConverter = ProtocolToMonacoConverter;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/protocol-to-monaco-converter'] = this;


/***/ }),

/***/ "../../packages/output/lib/browser/output-commands.js":
/*!************************************************************!*\
  !*** ../../packages/output/lib/browser/output-commands.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.OutputCommands = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
var OutputCommands;
(function (OutputCommands) {
    const OUTPUT_CATEGORY = 'Output';
    const OUTPUT_CATEGORY_KEY = common_1.nls.getDefaultKey(OUTPUT_CATEGORY);
    /* #region VS Code `OutputChannel` API */
    // Based on: https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/vscode.d.ts#L4692-L4745
    OutputCommands.APPEND = {
        id: 'output:append'
    };
    OutputCommands.APPEND_LINE = {
        id: 'output:appendLine'
    };
    OutputCommands.CLEAR = {
        id: 'output:clear'
    };
    OutputCommands.SHOW = {
        id: 'output:show'
    };
    OutputCommands.HIDE = {
        id: 'output:hide'
    };
    OutputCommands.DISPOSE = {
        id: 'output:dispose'
    };
    /* #endregion VS Code `OutputChannel` API */
    OutputCommands.CLEAR__WIDGET = common_1.Command.toLocalizedCommand({
        id: 'output:widget:clear',
        category: OUTPUT_CATEGORY,
        iconClass: (0, browser_1.codicon)('clear-all')
    }, '', OUTPUT_CATEGORY_KEY);
    OutputCommands.LOCK__WIDGET = common_1.Command.toLocalizedCommand({
        id: 'output:widget:lock',
        category: OUTPUT_CATEGORY,
        iconClass: (0, browser_1.codicon)('unlock')
    }, '', OUTPUT_CATEGORY_KEY);
    OutputCommands.UNLOCK__WIDGET = common_1.Command.toLocalizedCommand({
        id: 'output:widget:unlock',
        category: OUTPUT_CATEGORY,
        iconClass: (0, browser_1.codicon)('lock')
    }, '', OUTPUT_CATEGORY_KEY);
    OutputCommands.CLEAR__QUICK_PICK = common_1.Command.toLocalizedCommand({
        id: 'output:pick-clear',
        label: 'Clear Output Channel...',
        category: OUTPUT_CATEGORY
    }, 'theia/output/clearOutputChannel', OUTPUT_CATEGORY_KEY);
    OutputCommands.SHOW__QUICK_PICK = common_1.Command.toLocalizedCommand({
        id: 'output:pick-show',
        label: 'Show Output Channel...',
        category: OUTPUT_CATEGORY
    }, 'theia/output/showOutputChannel', OUTPUT_CATEGORY_KEY);
    OutputCommands.HIDE__QUICK_PICK = common_1.Command.toLocalizedCommand({
        id: 'output:pick-hide',
        label: 'Hide Output Channel...',
        category: OUTPUT_CATEGORY
    }, 'theia/output/hideOutputChannel', OUTPUT_CATEGORY_KEY);
    OutputCommands.DISPOSE__QUICK_PICK = common_1.Command.toLocalizedCommand({
        id: 'output:pick-dispose',
        label: 'Close Output Channel...',
        category: OUTPUT_CATEGORY
    }, 'theia/output/closeOutputChannel', OUTPUT_CATEGORY_KEY);
    OutputCommands.COPY_ALL = {
        id: 'output:copy-all',
    };
})(OutputCommands = exports.OutputCommands || (exports.OutputCommands = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/output/lib/browser/output-commands'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/output-channel-registry-main.js":
/*!**********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/output-channel-registry-main.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OutputChannelRegistryMainImpl = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const output_commands_1 = __webpack_require__(/*! @theia/output/lib/browser/output-commands */ "../../packages/output/lib/browser/output-commands.js");
let OutputChannelRegistryMainImpl = class OutputChannelRegistryMainImpl {
    $append(name, text, pluginInfo) {
        this.commandService.executeCommand(output_commands_1.OutputCommands.APPEND.id, { name, text });
        return Promise.resolve();
    }
    $clear(name) {
        this.commandService.executeCommand(output_commands_1.OutputCommands.CLEAR.id, { name });
        return Promise.resolve();
    }
    $dispose(name) {
        this.commandService.executeCommand(output_commands_1.OutputCommands.DISPOSE.id, { name });
        return Promise.resolve();
    }
    async $reveal(name, preserveFocus) {
        const options = { preserveFocus };
        this.commandService.executeCommand(output_commands_1.OutputCommands.SHOW.id, { name, options });
    }
    $close(name) {
        this.commandService.executeCommand(output_commands_1.OutputCommands.HIDE.id, { name });
        return Promise.resolve();
    }
};
__decorate([
    (0, inversify_1.inject)(command_1.CommandService),
    __metadata("design:type", Object)
], OutputChannelRegistryMainImpl.prototype, "commandService", void 0);
OutputChannelRegistryMainImpl = __decorate([
    (0, inversify_1.injectable)()
], OutputChannelRegistryMainImpl);
exports.OutputChannelRegistryMainImpl = OutputChannelRegistryMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/output-channel-registry-main'] = this;


/***/ }),

/***/ "../../packages/plugin-metrics/lib/browser/plugin-metrics-creator.js":
/*!***************************************************************************!*\
  !*** ../../packages/plugin-metrics/lib/browser/plugin-metrics-creator.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
exports.PluginMetricsCreator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const metrics_protocol_1 = __webpack_require__(/*! ../common/metrics-protocol */ "../../packages/plugin-metrics/lib/common/metrics-protocol.js");
const plugin_metrics_types_1 = __webpack_require__(/*! ../common/plugin-metrics-types */ "../../packages/plugin-metrics/lib/common/plugin-metrics-types.js");
let PluginMetricsCreator = class PluginMetricsCreator {
    constructor() {
        this.NODE_BASED_REGEX = /Request(.*?)failed/;
        this.setPluginMetrics();
        this._extensionIDAnalytics = {};
    }
    /**
     * Create an error metric for requestData.pluginID by attempting to extract the erroring
     * language server method from the requestData.errorContentsOrMethod. If it cannot extract the
     * error language server method from requestData.errorContentsOrMethod then it will not
     * create a metric.
     *
     * @param pluginID The id of the plugin
     * @param errorContents The contents that the language server error has produced
     */
    async createErrorMetric(requestData) {
        if (!requestData.pluginID) {
            return;
        }
        const method = this.extractMethodFromValue(requestData.errorContentsOrMethod);
        // only log the metric if we can find the method that it occurred in
        if (method) {
            const createdMetric = (0, plugin_metrics_types_1.createRequestData)(requestData.pluginID, method, requestData.timeTaken);
            this.createMetric(createdMetric, false);
            this.decreaseExtensionRequests(requestData.pluginID, method);
        }
    }
    /**
     * Decreases the total requests and the successful responses for pluginID with method by 1.
     *
     * This is needed because an error and a successful language server request aren't currently
     * associated together because of https://github.com/microsoft/vscode-languageserver-node/issues/517.
     * That means that every language server request that resolves counts as a successful language server request.
     * Therefore, we need to decrease the extension requests for pluginID when we know there is an error.
     * Otherwise, for every language server request that errors we would count it as both a success and a failure.
     *
     * @param pluginID The id of the plugin that should have the decreased requests
     */
    decreaseExtensionRequests(pluginID, method) {
        const thisExtension = this._extensionIDAnalytics[pluginID];
        if (thisExtension) {
            const currentAnalytics = thisExtension[method];
            if (currentAnalytics) {
                currentAnalytics.totalRequests -= 1;
                currentAnalytics.successfulResponses -= 1;
            }
        }
    }
    /**
     * Update the internal metrics structure for pluginID with method when a request is made
     *
     * @param requestData The data from the request that was made
     * @param isRequestSuccessful If the language server request was successful or not
     */
    async createMetric(requestData, isRequestSuccessful) {
        if (!requestData.pluginID) {
            return;
        }
        // When we are in this function we know its a method so we can make it clearer
        const method = requestData.errorContentsOrMethod;
        const defaultAnalytic = (0, plugin_metrics_types_1.createDefaultAnalytics)(requestData.timeTaken, isRequestSuccessful);
        this.createExtensionIDAnalyticIfNotFound(requestData, defaultAnalytic);
        this.createExtensionIDMethodIfNotFound(requestData, defaultAnalytic);
        const thisExtension = this._extensionIDAnalytics[requestData.pluginID];
        if (thisExtension) {
            const currentAnalytic = thisExtension[method];
            if (currentAnalytic) {
                currentAnalytic.totalRequests += 1;
                if (isRequestSuccessful) {
                    currentAnalytic.successfulResponses += 1;
                }
                if (isRequestSuccessful) {
                    currentAnalytic.sumOfTimeForSuccess = currentAnalytic.sumOfTimeForSuccess + requestData.timeTaken;
                }
                else {
                    currentAnalytic.sumOfTimeForFailure = currentAnalytic.sumOfTimeForFailure + requestData.timeTaken;
                }
            }
        }
    }
    /**
     * Create an entry in _extensionIDAnalytics with createdAnalytic if there does not exist one
     *
     * @param requestData data that we will turn into metrics
     * @param createdAnalytic the analytic being created
     */
    createExtensionIDAnalyticIfNotFound(requestData, createdAnalytic) {
        const method = requestData.errorContentsOrMethod; // We know its a metric if this is being called
        if (!this._extensionIDAnalytics[requestData.pluginID]) {
            this._extensionIDAnalytics[requestData.pluginID] = {
                [method]: createdAnalytic
            };
        }
    }
    /**
     * Create an entry in _extensionIDAnalytics for requestData.pluginID with requestData.errorContentsOrMethod as the method
     * if there does not exist one
     *
     * @param requestData data that we will turn into metrics
     * @param createdAnalytic the analytic being created
     */
    createExtensionIDMethodIfNotFound(requestData, createdAnalytic) {
        const method = requestData.errorContentsOrMethod; // We know its a metric if this is being called
        if (this._extensionIDAnalytics[requestData.pluginID]) {
            const methodToAnalyticMap = this._extensionIDAnalytics[requestData.pluginID];
            if (!methodToAnalyticMap[method]) {
                methodToAnalyticMap[method] = createdAnalytic;
            }
        }
    }
    /**
     * setPluginMetrics is a constant running function that sets
     * pluginMetrics every {$METRICS_TIMEOUT} seconds so that it doesn't
     * update /metrics on every request
     */
    setPluginMetrics() {
        const self = this;
        setInterval(() => {
            if (Object.keys(self._extensionIDAnalytics).length !== 0) {
                self.pluginMetrics.setMetrics(JSON.stringify(self._extensionIDAnalytics));
            }
        }, metrics_protocol_1.METRICS_TIMEOUT);
    }
    // Map of plugin extension id to method to analytic
    get extensionIDAnalytics() {
        return this._extensionIDAnalytics;
    }
    /**
     * Attempts to extract the method name from the current errorContents using the
     * vscode-languageclient matching regex.
     *
     * If it cannot find a match in the errorContents it returns undefined
     *
     * @param errorContents The contents of the current error or undefined
     */
    extractMethodFromValue(errorContents) {
        if (!errorContents) {
            return undefined;
        }
        const matches = errorContents.match(this.NODE_BASED_REGEX);
        if (matches) {
            return matches[1].trim();
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(metrics_protocol_1.PluginMetrics),
    __metadata("design:type", Object)
], PluginMetricsCreator.prototype, "pluginMetrics", void 0);
PluginMetricsCreator = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginMetricsCreator);
exports.PluginMetricsCreator = PluginMetricsCreator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-metrics/lib/browser/plugin-metrics-creator'] = this;


/***/ }),

/***/ "../../packages/plugin-metrics/lib/browser/plugin-metrics-frontend-module.js":
/*!***********************************************************************************!*\
  !*** ../../packages/plugin-metrics/lib/browser/plugin-metrics-frontend-module.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Red Hat and others.
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
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const plugin_metrics_languages_main_1 = __webpack_require__(/*! ./plugin-metrics-languages-main */ "../../packages/plugin-metrics/lib/browser/plugin-metrics-languages-main.js");
const metrics_protocol_1 = __webpack_require__(/*! ../common/metrics-protocol */ "../../packages/plugin-metrics/lib/common/metrics-protocol.js");
const ws_connection_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/messaging/ws-connection-provider */ "../../packages/core/lib/browser/messaging/ws-connection-provider.js");
const plugin_metrics_creator_1 = __webpack_require__(/*! ./plugin-metrics-creator */ "../../packages/plugin-metrics/lib/browser/plugin-metrics-creator.js");
const plugin_metrics_resolver_1 = __webpack_require__(/*! ./plugin-metrics-resolver */ "../../packages/plugin-metrics/lib/browser/plugin-metrics-resolver.js");
const plugin_metrics_output_registry_1 = __webpack_require__(/*! ./plugin-metrics-output-registry */ "../../packages/plugin-metrics/lib/browser/plugin-metrics-output-registry.js");
const languages_main_1 = __webpack_require__(/*! @theia/plugin-ext/lib/main/browser/languages-main */ "../../packages/plugin-ext/lib/main/browser/languages-main.js");
const output_channel_registry_main_1 = __webpack_require__(/*! @theia/plugin-ext/lib/main/browser/output-channel-registry-main */ "../../packages/plugin-ext/lib/main/browser/output-channel-registry-main.js");
exports["default"] = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(plugin_metrics_resolver_1.PluginMetricsResolver).toSelf().inSingletonScope();
    bind(plugin_metrics_creator_1.PluginMetricsCreator).toSelf().inSingletonScope();
    rebind(languages_main_1.LanguagesMainImpl).to(plugin_metrics_languages_main_1.LanguagesMainPluginMetrics).inTransientScope();
    rebind(output_channel_registry_main_1.OutputChannelRegistryMainImpl).to(plugin_metrics_output_registry_1.PluginMetricsOutputChannelRegistry).inTransientScope();
    bind(metrics_protocol_1.PluginMetrics).toDynamicValue(ctx => {
        const connection = ctx.container.get(ws_connection_provider_1.WebSocketConnectionProvider);
        return connection.createProxy(metrics_protocol_1.metricsJsonRpcPath);
    }).inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-metrics/lib/browser/plugin-metrics-frontend-module'] = this;


/***/ }),

/***/ "../../packages/plugin-metrics/lib/browser/plugin-metrics-languages-main.js":
/*!**********************************************************************************!*\
  !*** ../../packages/plugin-metrics/lib/browser/plugin-metrics-languages-main.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Red Hat and others.
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
exports.LanguagesMainPluginMetrics = void 0;
const plugin_metrics_resolver_1 = __webpack_require__(/*! ./plugin-metrics-resolver */ "../../packages/plugin-metrics/lib/browser/plugin-metrics-resolver.js");
const languages_main_1 = __webpack_require__(/*! @theia/plugin-ext/lib/main/browser/languages-main */ "../../packages/plugin-ext/lib/main/browser/languages-main.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const vst = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
let LanguagesMainPluginMetrics = class LanguagesMainPluginMetrics extends languages_main_1.LanguagesMainImpl {
    constructor() {
        super(...arguments);
        // Map of handle to extension id
        this.handleToExtensionID = new Map();
    }
    $unregister(handle) {
        this.handleToExtensionID.delete(handle);
        super.$unregister(handle);
    }
    provideCompletionItems(handle, model, position, context, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.CompletionRequest.type.method, super.provideCompletionItems(handle, model, position, context, token));
    }
    resolveCompletionItem(handle, item, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.CompletionRequest.type.method, super.resolveCompletionItem(handle, item, token));
    }
    provideReferences(handle, model, position, context, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.ReferencesRequest.type.method, super.provideReferences(handle, model, position, context, token));
    }
    provideImplementation(handle, model, position, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.ImplementationRequest.type.method, super.provideImplementation(handle, model, position, token));
    }
    provideTypeDefinition(handle, model, position, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.TypeDefinitionRequest.type.method, super.provideTypeDefinition(handle, model, position, token));
    }
    provideHover(handle, model, position, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.HoverRequest.type.method, super.provideHover(handle, model, position, token));
    }
    provideDocumentHighlights(handle, model, position, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DocumentHighlightRequest.type.method, super.provideDocumentHighlights(handle, model, position, token));
    }
    provideWorkspaceSymbols(handle, params, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.WorkspaceSymbolRequest.type.method, super.provideWorkspaceSymbols(handle, params, token));
    }
    resolveWorkspaceSymbol(handle, symbol, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.WorkspaceSymbolRequest.type.method, super.resolveWorkspaceSymbol(handle, symbol, token));
    }
    async provideLinks(handle, model, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DocumentLinkRequest.type.method, super.provideLinks(handle, model, token));
    }
    async resolveLink(handle, link, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DocumentLinkRequest.type.method, super.resolveLink(handle, link, token));
    }
    async provideCodeLenses(handle, model, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.CodeLensRequest.type.method, super.provideCodeLenses(handle, model, token));
    }
    resolveCodeLens(handle, model, codeLens, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.CodeLensResolveRequest.type.method, super.resolveCodeLens(handle, model, codeLens, token));
    }
    provideDocumentSymbols(handle, model, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DocumentSymbolRequest.type.method, super.provideDocumentSymbols(handle, model, token));
    }
    provideDefinition(handle, model, position, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DefinitionRequest.type.method, super.provideDefinition(handle, model, position, token));
    }
    async provideSignatureHelp(handle, model, position, token, context) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.SignatureHelpRequest.type.method, super.provideSignatureHelp(handle, model, position, token, context));
    }
    provideDocumentFormattingEdits(handle, model, options, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DocumentFormattingRequest.type.method, super.provideDocumentFormattingEdits(handle, model, options, token));
    }
    provideDocumentRangeFormattingEdits(handle, model, range, options, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DocumentRangeFormattingRequest.type.method, super.provideDocumentRangeFormattingEdits(handle, model, range, options, token));
    }
    provideOnTypeFormattingEdits(handle, model, position, ch, options, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DocumentOnTypeFormattingRequest.type.method, super.provideOnTypeFormattingEdits(handle, model, position, ch, options, token));
    }
    provideFoldingRanges(handle, model, context, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.FoldingRangeRequest.type.method, super.provideFoldingRanges(handle, model, context, token));
    }
    provideDocumentColors(handle, model, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.DocumentColorRequest.type.method, super.provideDocumentColors(handle, model, token));
    }
    provideColorPresentations(handle, model, colorInfo, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.ColorPresentationRequest.type.method, super.provideColorPresentations(handle, model, colorInfo, token));
    }
    async provideCodeActions(handle, model, rangeOrSelection, context, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.CodeActionRequest.type.method, super.provideCodeActions(handle, model, rangeOrSelection, context, token));
    }
    provideRenameEdits(handle, model, position, newName, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.RenameRequest.type.method, super.provideRenameEdits(handle, model, position, newName, token));
    }
    resolveRenameLocation(handle, model, position, token) {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle), vst.RenameRequest.type.method, super.resolveRenameLocation(handle, model, position, token));
    }
    $registerCompletionSupport(handle, pluginInfo, selector, triggerCharacters, supportsResolveDetails) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerCompletionSupport(handle, pluginInfo, selector, triggerCharacters, supportsResolveDetails);
    }
    $registerDefinitionProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerDefinitionProvider(handle, pluginInfo, selector);
    }
    $registerDeclarationProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerDeclarationProvider(handle, pluginInfo, selector);
    }
    $registerReferenceProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerReferenceProvider(handle, pluginInfo, selector);
    }
    $registerSignatureHelpProvider(handle, pluginInfo, selector, metadata) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerSignatureHelpProvider(handle, pluginInfo, selector, metadata);
    }
    $registerImplementationProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerImplementationProvider(handle, pluginInfo, selector);
    }
    $registerTypeDefinitionProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerTypeDefinitionProvider(handle, pluginInfo, selector);
    }
    $registerHoverProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerHoverProvider(handle, pluginInfo, selector);
    }
    $registerDocumentHighlightProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerDocumentHighlightProvider(handle, pluginInfo, selector);
    }
    $registerWorkspaceSymbolProvider(handle, pluginInfo) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerWorkspaceSymbolProvider(handle, pluginInfo);
    }
    $registerDocumentLinkProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerDocumentLinkProvider(handle, pluginInfo, selector);
    }
    $registerCodeLensSupport(handle, pluginInfo, selector, eventHandle) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerCodeLensSupport(handle, pluginInfo, selector, eventHandle);
    }
    $registerOutlineSupport(handle, pluginInfo, selector, displayName) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerOutlineSupport(handle, pluginInfo, selector, displayName);
    }
    $registerDocumentFormattingSupport(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerDocumentFormattingSupport(handle, pluginInfo, selector);
    }
    $registerRangeFormattingSupport(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerRangeFormattingSupport(handle, pluginInfo, selector);
    }
    $registerOnTypeFormattingProvider(handle, pluginInfo, selector, autoFormatTriggerCharacters) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerOnTypeFormattingProvider(handle, pluginInfo, selector, autoFormatTriggerCharacters);
    }
    $registerFoldingRangeProvider(handle, pluginInfo, selector, eventHandle) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerFoldingRangeProvider(handle, pluginInfo, selector, eventHandle);
    }
    $registerDocumentColorProvider(handle, pluginInfo, selector) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerDocumentColorProvider(handle, pluginInfo, selector);
    }
    $registerQuickFixProvider(handle, pluginInfo, selector, codeActionKinds, documentation) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerQuickFixProvider(handle, pluginInfo, selector, codeActionKinds, documentation);
    }
    $registerRenameProvider(handle, pluginInfo, selector, supportsResolveLocation) {
        this.registerPluginWithFeatureHandle(handle, pluginInfo.id);
        super.$registerRenameProvider(handle, pluginInfo, selector, supportsResolveLocation);
    }
    registerPluginWithFeatureHandle(handle, pluginID) {
        this.handleToExtensionID.set(handle, pluginID);
    }
    handleToExtensionName(handle) {
        return this.handleToExtensionID.get(handle);
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_metrics_resolver_1.PluginMetricsResolver),
    __metadata("design:type", plugin_metrics_resolver_1.PluginMetricsResolver)
], LanguagesMainPluginMetrics.prototype, "pluginMetricsResolver", void 0);
LanguagesMainPluginMetrics = __decorate([
    (0, inversify_1.injectable)()
], LanguagesMainPluginMetrics);
exports.LanguagesMainPluginMetrics = LanguagesMainPluginMetrics;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-metrics/lib/browser/plugin-metrics-languages-main'] = this;


/***/ }),

/***/ "../../packages/plugin-metrics/lib/browser/plugin-metrics-output-registry.js":
/*!***********************************************************************************!*\
  !*** ../../packages/plugin-metrics/lib/browser/plugin-metrics-output-registry.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
exports.PluginMetricsOutputChannelRegistry = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const output_channel_registry_main_1 = __webpack_require__(/*! @theia/plugin-ext/lib/main/browser/output-channel-registry-main */ "../../packages/plugin-ext/lib/main/browser/output-channel-registry-main.js");
const plugin_metrics_creator_1 = __webpack_require__(/*! ./plugin-metrics-creator */ "../../packages/plugin-metrics/lib/browser/plugin-metrics-creator.js");
const plugin_metrics_types_1 = __webpack_require__(/*! ../common/plugin-metrics-types */ "../../packages/plugin-metrics/lib/common/plugin-metrics-types.js");
let PluginMetricsOutputChannelRegistry = class PluginMetricsOutputChannelRegistry extends output_channel_registry_main_1.OutputChannelRegistryMainImpl {
    $append(channelName, errorOrValue, pluginInfo) {
        if (errorOrValue.startsWith('[Error')) {
            const createdMetric = (0, plugin_metrics_types_1.createDefaultRequestData)(pluginInfo.id, errorOrValue);
            this.pluginMetricsCreator.createErrorMetric(createdMetric);
        }
        return super.$append(channelName, errorOrValue, pluginInfo);
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_metrics_creator_1.PluginMetricsCreator),
    __metadata("design:type", plugin_metrics_creator_1.PluginMetricsCreator)
], PluginMetricsOutputChannelRegistry.prototype, "pluginMetricsCreator", void 0);
PluginMetricsOutputChannelRegistry = __decorate([
    (0, inversify_1.injectable)()
], PluginMetricsOutputChannelRegistry);
exports.PluginMetricsOutputChannelRegistry = PluginMetricsOutputChannelRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-metrics/lib/browser/plugin-metrics-output-registry'] = this;


/***/ }),

/***/ "../../packages/plugin-metrics/lib/browser/plugin-metrics-resolver.js":
/*!****************************************************************************!*\
  !*** ../../packages/plugin-metrics/lib/browser/plugin-metrics-resolver.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
exports.PluginMetricsResolver = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const plugin_metrics_creator_1 = __webpack_require__(/*! ./plugin-metrics-creator */ "../../packages/plugin-metrics/lib/browser/plugin-metrics-creator.js");
const plugin_metrics_types_1 = __webpack_require__(/*! ../common/plugin-metrics-types */ "../../packages/plugin-metrics/lib/common/plugin-metrics-types.js");
/**
 * This class helps resolve language server requests into successes or failures
 * and sends the data to the metricsExtractor
 */
let PluginMetricsResolver = class PluginMetricsResolver {
    /**
     * Resolve a request for pluginID and create a metric based on whether or not
     * the language server errored.
     *
     * @param pluginID the ID of the plugin that made the request
     * @param method  the method that was request
     * @param request the result of the language server request
     */
    async resolveRequest(pluginID, method, request) {
        const currentTime = performance.now();
        try {
            const value = await request;
            this.createAndSetMetric(pluginID, method, performance.now() - currentTime, true);
            return value;
        }
        catch (error) {
            this.createAndSetMetric(pluginID, method, performance.now() - currentTime, false);
            return Promise.reject(error);
        }
    }
    createAndSetMetric(pluginID, method, time, successful) {
        const createdSuccessMetric = (0, plugin_metrics_types_1.createRequestData)(pluginID, method, time);
        this.metricsCreator.createMetric(createdSuccessMetric, successful);
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_metrics_creator_1.PluginMetricsCreator),
    __metadata("design:type", plugin_metrics_creator_1.PluginMetricsCreator)
], PluginMetricsResolver.prototype, "metricsCreator", void 0);
PluginMetricsResolver = __decorate([
    (0, inversify_1.injectable)()
], PluginMetricsResolver);
exports.PluginMetricsResolver = PluginMetricsResolver;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-metrics/lib/browser/plugin-metrics-resolver'] = this;


/***/ }),

/***/ "../../packages/plugin-metrics/lib/common/metrics-protocol.js":
/*!********************************************************************!*\
  !*** ../../packages/plugin-metrics/lib/common/metrics-protocol.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.METRICS_TIMEOUT = exports.PluginMetrics = exports.metricsJsonRpcPath = void 0;
/**
 * The JSON-RPC interface for plugin metrics
 */
exports.metricsJsonRpcPath = '/services/plugin-ext/metrics';
exports.PluginMetrics = Symbol('PluginMetrics');
exports.METRICS_TIMEOUT = 10000;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-metrics/lib/common/metrics-protocol'] = this;


/***/ }),

/***/ "../../packages/plugin-metrics/lib/common/plugin-metrics-types.js":
/*!************************************************************************!*\
  !*** ../../packages/plugin-metrics/lib/common/plugin-metrics-types.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDefaultAnalytics = exports.createDefaultRequestData = exports.createRequestData = void 0;
/**
 * Helper functions for creating an object that corresponds to the DataFromRequest interface
 */
function createRequestData(pluginID, errorContentsOrMethod, timeTaken) {
    return {
        pluginID,
        errorContentsOrMethod,
        timeTaken
    };
}
exports.createRequestData = createRequestData;
function createDefaultRequestData(pluginID, errorContentsOrMethod) {
    return {
        pluginID,
        errorContentsOrMethod,
        timeTaken: 0
    };
}
exports.createDefaultRequestData = createDefaultRequestData;
function createDefaultAnalytics(timeTaken, isRequestSuccessful) {
    if (isRequestSuccessful) {
        return {
            sumOfTimeForSuccess: timeTaken,
            sumOfTimeForFailure: 0,
            successfulResponses: 0,
            totalRequests: 0
        };
    }
    else {
        return {
            sumOfTimeForSuccess: 0,
            sumOfTimeForFailure: timeTaken,
            successfulResponses: 0,
            totalRequests: 0
        };
    }
}
exports.createDefaultAnalytics = createDefaultAnalytics;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-metrics/lib/common/plugin-metrics-types'] = this;


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
//# sourceMappingURL=packages_core_shared_phosphor_coreutils_index_js-packages_core_shared_vscode-uri_index_js-pac-c4ede2.js.map