"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_plugin-ext_lib_main_browser_languages-main_js"],{

/***/ "../../packages/plugin-ext/lib/common/object-identifier.js":
/*!*****************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/object-identifier.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ObjectIdentifier = void 0;
var ObjectIdentifier;
(function (ObjectIdentifier) {
    ObjectIdentifier.name = '$ident';
    function mixin(obj, id) {
        Object.defineProperty(obj, ObjectIdentifier.name, { value: id, enumerable: true });
        return obj;
    }
    ObjectIdentifier.mixin = mixin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function of(obj) {
        return obj[ObjectIdentifier.name];
    }
    ObjectIdentifier.of = of;
})(ObjectIdentifier = exports.ObjectIdentifier || (exports.ObjectIdentifier = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/object-identifier'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/semantic-tokens-dto.js":
/*!*******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/semantic-tokens-dto.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeSemanticTokensDto = exports.encodeSemanticTokensDto = void 0;
// copied and modified from https://github.com/microsoft/vscode/blob/0eb3a02ca2bcfab5faa3dc6e52d7c079efafcab0/src/vs/workbench/api/common/shared/semanticTokensDto.ts
const buffer_1 = __webpack_require__(/*! @theia/core/lib/common/buffer */ "../../packages/core/lib/common/buffer.js");
let _isLittleEndian = true;
let _isLittleEndianComputed = false;
function isLittleEndian() {
    if (!_isLittleEndianComputed) {
        _isLittleEndianComputed = true;
        const test = new Uint8Array(2);
        test[0] = 1;
        test[1] = 2;
        const view = new Uint16Array(test.buffer);
        _isLittleEndian = (view[0] === (2 << 8) + 1);
    }
    return _isLittleEndian;
}
function reverseEndianness(arr) {
    for (let i = 0, len = arr.length; i < len; i += 4) {
        // flip bytes 0<->3 and 1<->2
        const b0 = arr[i + 0];
        const b1 = arr[i + 1];
        const b2 = arr[i + 2];
        const b3 = arr[i + 3];
        arr[i + 0] = b3;
        arr[i + 1] = b2;
        arr[i + 2] = b1;
        arr[i + 3] = b0;
    }
}
function toLittleEndianBuffer(arr) {
    const uint8Arr = new Uint8Array(arr.buffer, arr.byteOffset, arr.length * 4);
    if (!isLittleEndian()) {
        // the byte order must be changed
        reverseEndianness(uint8Arr);
    }
    return buffer_1.BinaryBuffer.wrap(uint8Arr);
}
function fromLittleEndianBuffer(buff) {
    const uint8Arr = buff.buffer;
    if (!isLittleEndian()) {
        // the byte order must be changed
        reverseEndianness(uint8Arr);
    }
    if (uint8Arr.byteOffset % 4 === 0) {
        return new Uint32Array(uint8Arr.buffer, uint8Arr.byteOffset, uint8Arr.length / 4);
    }
    else {
        // unaligned memory access doesn't work on all platforms
        const data = new Uint8Array(uint8Arr.byteLength);
        data.set(uint8Arr);
        return new Uint32Array(data.buffer, data.byteOffset, data.length / 4);
    }
}
function encodeSemanticTokensDto(semanticTokens) {
    const dest = new Uint32Array(encodeSemanticTokensDtoSize(semanticTokens));
    let offset = 0;
    dest[offset++] = semanticTokens.id;
    if (semanticTokens.type === 'full') {
        dest[offset++] = 1 /* Full */;
        dest[offset++] = semanticTokens.data.length;
        dest.set(semanticTokens.data, offset);
        offset += semanticTokens.data.length;
    }
    else {
        dest[offset++] = 2 /* Delta */;
        dest[offset++] = semanticTokens.deltas.length;
        for (const delta of semanticTokens.deltas) {
            dest[offset++] = delta.start;
            dest[offset++] = delta.deleteCount;
            if (delta.data) {
                dest[offset++] = delta.data.length;
                dest.set(delta.data, offset);
                offset += delta.data.length;
            }
            else {
                dest[offset++] = 0;
            }
        }
    }
    return toLittleEndianBuffer(dest);
}
exports.encodeSemanticTokensDto = encodeSemanticTokensDto;
function encodeSemanticTokensDtoSize(semanticTokens) {
    let result = 0;
    result += (+1 // id
        + 1 // type
    );
    if (semanticTokens.type === 'full') {
        result += (+1 // data length
            + semanticTokens.data.length);
    }
    else {
        result += (+1 // delta count
        );
        result += (+1 // start
            + 1 // deleteCount
            + 1 // data length
        ) * semanticTokens.deltas.length;
        for (const delta of semanticTokens.deltas) {
            if (delta.data) {
                result += delta.data.length;
            }
        }
    }
    return result;
}
function decodeSemanticTokensDto(_buff) {
    const src = fromLittleEndianBuffer(_buff);
    let offset = 0;
    const id = src[offset++];
    const type = src[offset++];
    if (type === 1 /* Full */) {
        const length = src[offset++];
        const data = src.subarray(offset, offset + length);
        offset += length;
        return {
            id: id,
            type: 'full',
            data: data
        };
    }
    const deltaCount = src[offset++];
    const deltas = [];
    for (let i = 0; i < deltaCount; i++) {
        const start = src[offset++];
        const deleteCount = src[offset++];
        const length = src[offset++];
        let data;
        if (length > 0) {
            data = src.subarray(offset, offset + length);
            offset += length;
        }
        deltas[i] = { start, deleteCount, data };
    }
    return {
        id: id,
        type: 'delta',
        deltas: deltas
    };
}
exports.decodeSemanticTokensDto = decodeSemanticTokensDto;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/semantic-tokens-dto'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/data-transfer/data-transfer-type-converters.js":
/*!*************************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/data-transfer/data-transfer-type-converters.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2023 Red Hat, Inc. and others.
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
exports.DataTransfer = exports.DataTransferItem = void 0;
const types_impl_1 = __webpack_require__(/*! ../../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
var DataTransferItem;
(function (DataTransferItem) {
    async function from(mime, item) {
        const stringValue = await item.asString();
        if (mime === 'text/uri-list') {
            return {
                id: item.id,
                asString: '',
                fileData: undefined,
                uriListData: serializeUriList(stringValue),
            };
        }
        const fileValue = item.asFile();
        return {
            id: item.id,
            asString: stringValue,
            fileData: fileValue ? { name: fileValue.name, uri: fileValue.uri } : undefined,
        };
    }
    DataTransferItem.from = from;
    function serializeUriList(stringValue) {
        return stringValue.split('\r\n').map(part => {
            if (part.startsWith('#')) {
                return part;
            }
            try {
                return types_impl_1.URI.parse(part);
            }
            catch {
                // noop
            }
            return part;
        });
    }
})(DataTransferItem = exports.DataTransferItem || (exports.DataTransferItem = {}));
var DataTransfer;
(function (DataTransfer) {
    async function toDataTransferDTO(value) {
        return {
            items: await Promise.all(Array.from(value.entries())
                .map(async ([mime, item]) => [mime, await DataTransferItem.from(mime, item)]))
        };
    }
    DataTransfer.toDataTransferDTO = toDataTransferDTO;
})(DataTransfer = exports.DataTransfer || (exports.DataTransfer = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/data-transfer/data-transfer-type-converters'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/languages-main.js":
/*!********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/languages-main.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toMonacoWorkspaceEdit = exports.LanguagesMainImpl = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// Method `$changeLanguage` copied and modified
// from https://github.com/microsoft/vscode/blob/e9c50663154c369a06355ce752b447af5b580dc3/src/vs/workbench/api/browser/mainThreadLanguages.ts#L30-L42
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const plugin_api_rpc_model_1 = __webpack_require__(/*! ../../common/plugin-api-rpc-model */ "../../packages/plugin-ext/lib/common/plugin-api-rpc-model.js");
const rpc_protocol_1 = __webpack_require__(/*! ../../common/rpc-protocol */ "../../packages/plugin-ext/lib/common/rpc-protocol.js");
const monaco_languages_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-languages */ "../../packages/monaco/lib/browser/monaco-languages.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const browser_1 = __webpack_require__(/*! @theia/markers/lib/browser */ "../../packages/markers/lib/browser/index.js");
const vst = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const browser_2 = __webpack_require__(/*! @theia/callhierarchy/lib/browser */ "../../packages/callhierarchy/lib/browser/index.js");
const hierarchy_types_converters_1 = __webpack_require__(/*! ./hierarchy/hierarchy-types-converters */ "../../packages/plugin-ext/lib/main/browser/hierarchy/hierarchy-types-converters.js");
const browser_3 = __webpack_require__(/*! @theia/typehierarchy/lib/browser */ "../../packages/typehierarchy/lib/browser/index.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const object_identifier_1 = __webpack_require__(/*! ../../common/object-identifier */ "../../packages/plugin-ext/lib/common/object-identifier.js");
const types_1 = __webpack_require__(/*! ../../common/types */ "../../packages/plugin-ext/lib/common/types.js");
const paths_util_1 = __webpack_require__(/*! ../../common/paths-util */ "../../packages/plugin-ext/lib/common/paths-util.js");
const semantic_tokens_dto_1 = __webpack_require__(/*! ../../common/semantic-tokens-dto */ "../../packages/plugin-ext/lib/common/semantic-tokens-dto.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const extensions_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/extensions/common/extensions */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/extensions/common/extensions.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const markers_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/markers/common/markers */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/markers/common/markers.js");
const MonacoPath = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/path */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/path.js");
const editor_language_status_service_1 = __webpack_require__(/*! @theia/editor/lib/browser/language-status/editor-language-status-service */ "../../packages/editor/lib/browser/language-status/editor-language-status-service.js");
const languageFeatures_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures.js");
const types_impl_1 = __webpack_require__(/*! ../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
const data_transfer_type_converters_1 = __webpack_require__(/*! ./data-transfer/data-transfer-type-converters */ "../../packages/plugin-ext/lib/main/browser/data-transfer/data-transfer-type-converters.js");
const file_upload_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-upload-service */ "../../packages/filesystem/lib/browser/file-upload-service.js");
let LanguagesMainImpl = class LanguagesMainImpl {
    constructor(rpc) {
        this.services = new Map();
        this.toDispose = new disposable_1.DisposableCollection();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.LANGUAGES_EXT);
    }
    dispose() {
        this.toDispose.dispose();
    }
    $getLanguages() {
        return Promise.resolve(monaco.languages.getLanguages().map(l => l.id));
    }
    $changeLanguage(resource, languageId) {
        const uri = monaco.Uri.revive(resource);
        const model = monaco.editor.getModel(uri);
        if (!model) {
            return Promise.reject(new Error('Invalid uri'));
        }
        const langId = monaco.languages.getEncodedLanguageId(languageId);
        if (!langId) {
            return Promise.reject(new Error(`Unknown language ID: ${languageId}`));
        }
        monaco.editor.setModelLanguage(model, languageId);
        return Promise.resolve(undefined);
    }
    register(handle, service) {
        this.services.set(handle, service);
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregister(handle)));
    }
    $unregister(handle) {
        const disposable = this.services.get(handle);
        if (disposable) {
            this.services.delete(handle);
            disposable.dispose();
        }
    }
    $setLanguageConfiguration(handle, languageId, configuration) {
        const config = {
            comments: configuration.comments,
            brackets: configuration.brackets,
            wordPattern: reviveRegExp(configuration.wordPattern),
            indentationRules: reviveIndentationRule(configuration.indentationRules),
            onEnterRules: reviveOnEnterRules(configuration.onEnterRules),
        };
        this.register(handle, monaco.languages.setLanguageConfiguration(languageId, config));
    }
    $registerCompletionSupport(handle, pluginInfo, selector, triggerCharacters, supportsResolveDetails) {
        this.register(handle, monaco.languages.registerCompletionItemProvider(this.toLanguageSelector(selector), {
            triggerCharacters,
            provideCompletionItems: (model, position, context, token) => this.provideCompletionItems(handle, model, position, context, token),
            resolveCompletionItem: supportsResolveDetails
                ? (suggestion, token) => Promise.resolve(this.resolveCompletionItem(handle, suggestion, token))
                : undefined
        }));
    }
    provideCompletionItems(handle, model, position, context, token) {
        return this.proxy.$provideCompletionItems(handle, model.uri, position, context, token).then(result => {
            if (!result) {
                return undefined;
            }
            return {
                suggestions: result.completions.map(c => Object.assign(c, {
                    range: c.range || result.defaultRange
                })),
                incomplete: result.incomplete,
                dispose: () => this.proxy.$releaseCompletionItems(handle, result.id)
            };
        });
    }
    resolveCompletionItem(handle, item, token) {
        const { parentId, id } = item;
        return this.proxy.$resolveCompletionItem(handle, [parentId, id], token).then(resolved => {
            if (resolved) {
                (0, types_1.mixin)(item, resolved, true);
            }
            return item;
        });
    }
    $registerDefinitionProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const definitionProvider = this.createDefinitionProvider(handle);
        this.register(handle, monaco.languages.registerDefinitionProvider(languageSelector, definitionProvider));
    }
    $registerDeclarationProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const declarationProvider = this.createDeclarationProvider(handle);
        this.register(handle, monaco.languages.registerDeclarationProvider(languageSelector, declarationProvider));
    }
    $registerReferenceProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const referenceProvider = this.createReferenceProvider(handle);
        this.register(handle, monaco.languages.registerReferenceProvider(languageSelector, referenceProvider));
    }
    createReferenceProvider(handle) {
        return {
            provideReferences: (model, position, context, token) => this.provideReferences(handle, model, position, context, token)
        };
    }
    provideReferences(handle, model, position, context, token) {
        return this.proxy.$provideReferences(handle, model.uri, position, context, token).then(result => {
            if (!result) {
                return undefined;
            }
            if (Array.isArray(result)) {
                const references = [];
                for (const item of result) {
                    references.push({ ...item, uri: monaco.Uri.revive(item.uri) });
                }
                return references;
            }
            return undefined;
        });
    }
    $registerSignatureHelpProvider(handle, pluginInfo, selector, metadata) {
        const languageSelector = this.toLanguageSelector(selector);
        const signatureHelpProvider = this.createSignatureHelpProvider(handle, metadata);
        this.register(handle, monaco.languages.registerSignatureHelpProvider(languageSelector, signatureHelpProvider));
    }
    $clearDiagnostics(id) {
        for (const uri of this.problemManager.getUris()) {
            this.problemManager.setMarkers(new uri_1.URI(uri), id, []);
        }
    }
    $changeDiagnostics(id, delta) {
        for (const [uriString, markers] of delta) {
            const uri = new uri_1.URI(uriString);
            this.problemManager.setMarkers(uri, id, markers.map(reviveMarker));
        }
    }
    $registerImplementationProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const implementationProvider = this.createImplementationProvider(handle);
        this.register(handle, monaco.languages.registerImplementationProvider(languageSelector, implementationProvider));
    }
    createImplementationProvider(handle) {
        return {
            provideImplementation: (model, position, token) => this.provideImplementation(handle, model, position, token)
        };
    }
    provideImplementation(handle, model, position, token) {
        return this.proxy.$provideImplementation(handle, model.uri, position, token).then(result => {
            if (!result) {
                return undefined;
            }
            if (Array.isArray(result)) {
                // using DefinitionLink because Location is mandatory part of DefinitionLink
                const definitionLinks = [];
                for (const item of result) {
                    definitionLinks.push({ ...item, uri: monaco.Uri.revive(item.uri) });
                }
                return definitionLinks;
            }
            else {
                // single Location
                return {
                    uri: monaco.Uri.revive(result.uri),
                    range: result.range
                };
            }
        });
    }
    $registerTypeDefinitionProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const typeDefinitionProvider = this.createTypeDefinitionProvider(handle);
        this.register(handle, monaco.languages.registerTypeDefinitionProvider(languageSelector, typeDefinitionProvider));
    }
    createTypeDefinitionProvider(handle) {
        return {
            provideTypeDefinition: (model, position, token) => this.provideTypeDefinition(handle, model, position, token)
        };
    }
    provideTypeDefinition(handle, model, position, token) {
        return this.proxy.$provideTypeDefinition(handle, model.uri, position, token).then(result => {
            if (!result) {
                return undefined;
            }
            if (Array.isArray(result)) {
                // using DefinitionLink because Location is mandatory part of DefinitionLink
                const definitionLinks = [];
                for (const item of result) {
                    definitionLinks.push({ ...item, uri: monaco.Uri.revive(item.uri) });
                }
                return definitionLinks;
            }
            else {
                // single Location
                return {
                    uri: monaco.Uri.revive(result.uri),
                    range: result.range
                };
            }
        });
    }
    $registerHoverProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const hoverProvider = this.createHoverProvider(handle);
        this.register(handle, monaco.languages.registerHoverProvider(languageSelector, hoverProvider));
    }
    createHoverProvider(handle) {
        return {
            provideHover: (model, position, token) => this.provideHover(handle, model, position, token)
        };
    }
    provideHover(handle, model, position, token) {
        return this.proxy.$provideHover(handle, model.uri, position, token);
    }
    $registerEvaluatableExpressionProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const evaluatableExpressionProvider = this.createEvaluatableExpressionProvider(handle);
        this.register(handle, standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).evaluatableExpressionProvider.register(languageSelector, evaluatableExpressionProvider));
    }
    createEvaluatableExpressionProvider(handle) {
        return {
            provideEvaluatableExpression: (model, position, token) => this.provideEvaluatableExpression(handle, model, position, token)
        };
    }
    provideEvaluatableExpression(handle, model, position, token) {
        return this.proxy.$provideEvaluatableExpression(handle, model.uri, position, token);
    }
    $registerInlineValuesProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const inlineValuesProvider = this.createInlineValuesProvider(handle);
        this.register(handle, standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).inlineValuesProvider.register(languageSelector, inlineValuesProvider));
    }
    createInlineValuesProvider(handle) {
        return {
            provideInlineValues: (model, range, context, token) => this.provideInlineValues(handle, model, range, context, token)
        };
    }
    provideInlineValues(handle, model, range, context, token) {
        return this.proxy.$provideInlineValues(handle, model.uri, range, context, token);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $emitInlineValuesEvent(eventHandle, event) {
        const obj = this.services.get(eventHandle);
        if (obj instanceof event_1.Emitter) {
            obj.fire(event);
        }
    }
    $registerDocumentHighlightProvider(handle, _pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const documentHighlightProvider = this.createDocumentHighlightProvider(handle);
        this.register(handle, monaco.languages.registerDocumentHighlightProvider(languageSelector, documentHighlightProvider));
    }
    createDocumentHighlightProvider(handle) {
        return {
            provideDocumentHighlights: (model, position, token) => this.provideDocumentHighlights(handle, model, position, token)
        };
    }
    provideDocumentHighlights(handle, model, position, token) {
        return this.proxy.$provideDocumentHighlights(handle, model.uri, position, token).then(result => {
            if (!result) {
                return undefined;
            }
            if (Array.isArray(result)) {
                const highlights = [];
                for (const item of result) {
                    highlights.push({
                        ...item,
                        kind: (item.kind ? item.kind : monaco.languages.DocumentHighlightKind.Text)
                    });
                }
                return highlights;
            }
            return undefined;
        });
    }
    $registerWorkspaceSymbolProvider(handle, pluginInfo) {
        const workspaceSymbolProvider = this.createWorkspaceSymbolProvider(handle);
        this.register(handle, this.monacoLanguages.registerWorkspaceSymbolProvider(workspaceSymbolProvider));
    }
    createWorkspaceSymbolProvider(handle) {
        return {
            provideWorkspaceSymbols: (params, token) => this.provideWorkspaceSymbols(handle, params, token),
            resolveWorkspaceSymbol: (symbol, token) => this.resolveWorkspaceSymbol(handle, symbol, token)
        };
    }
    provideWorkspaceSymbols(handle, params, token) {
        return this.proxy.$provideWorkspaceSymbols(handle, params.query, token);
    }
    resolveWorkspaceSymbol(handle, symbol, token) {
        return this.proxy.$resolveWorkspaceSymbol(handle, symbol, token);
    }
    $registerDocumentLinkProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const linkProvider = this.createLinkProvider(handle);
        this.register(handle, monaco.languages.registerLinkProvider(languageSelector, linkProvider));
    }
    createLinkProvider(handle) {
        return {
            provideLinks: async (model, token) => this.provideLinks(handle, model, token),
            resolveLink: async (link, token) => this.resolveLink(handle, link, token)
        };
    }
    async provideLinks(handle, model, token) {
        const links = await this.proxy.$provideDocumentLinks(handle, model.uri, token);
        if (!links) {
            return undefined;
        }
        return {
            links: links.map(link => this.toMonacoLink(link)),
            dispose: () => {
                if (links && Array.isArray(links)) {
                    this.proxy.$releaseDocumentLinks(handle, links.map(link => object_identifier_1.ObjectIdentifier.of(link)));
                }
            }
        };
    }
    async resolveLink(handle, link, token) {
        const resolved = await this.proxy.$resolveDocumentLink(handle, link, token);
        return resolved && this.toMonacoLink(resolved);
    }
    toMonacoLink(link) {
        return {
            ...link,
            url: !!link.url && typeof link.url !== 'string' ? monaco.Uri.revive(link.url) : link.url
        };
    }
    $registerCodeLensSupport(handle, pluginInfo, selector, eventHandle) {
        const languageSelector = this.toLanguageSelector(selector);
        const lensProvider = this.createCodeLensProvider(handle);
        if (typeof eventHandle === 'number') {
            const emitter = new event_1.Emitter();
            this.register(eventHandle, emitter);
            lensProvider.onDidChange = emitter.event;
        }
        this.register(handle, monaco.languages.registerCodeLensProvider(languageSelector, lensProvider));
    }
    createCodeLensProvider(handle) {
        return {
            provideCodeLenses: async (model, token) => this.provideCodeLenses(handle, model, token),
            resolveCodeLens: (model, codeLens, token) => this.resolveCodeLens(handle, model, codeLens, token)
        };
    }
    async provideCodeLenses(handle, model, token) {
        const lenses = await this.proxy.$provideCodeLenses(handle, model.uri, token);
        if (!lenses) {
            return undefined;
        }
        return {
            lenses,
            dispose: () => {
                if (lenses && Array.isArray(lenses)) {
                    this.proxy.$releaseCodeLenses(handle, lenses.map(symbol => object_identifier_1.ObjectIdentifier.of(symbol)));
                }
            }
        };
    }
    resolveCodeLens(handle, model, codeLens, token) {
        return this.proxy.$resolveCodeLens(handle, model.uri, codeLens, token);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $emitCodeLensEvent(eventHandle, event) {
        const obj = this.services.get(eventHandle);
        if (obj instanceof event_1.Emitter) {
            obj.fire(event);
        }
    }
    $registerOutlineSupport(handle, pluginInfo, selector, displayName) {
        const languageSelector = this.toLanguageSelector(selector);
        const symbolProvider = this.createDocumentSymbolProvider(handle, displayName);
        this.register(handle, monaco.languages.registerDocumentSymbolProvider(languageSelector, symbolProvider));
    }
    createDocumentSymbolProvider(handle, displayName) {
        return {
            displayName,
            provideDocumentSymbols: (model, token) => this.provideDocumentSymbols(handle, model, token)
        };
    }
    provideDocumentSymbols(handle, model, token) {
        return this.proxy.$provideDocumentSymbols(handle, model.uri, token);
    }
    createDefinitionProvider(handle) {
        return {
            provideDefinition: (model, position, token) => this.provideDefinition(handle, model, position, token)
        };
    }
    createDeclarationProvider(handle) {
        return {
            provideDeclaration: (model, position, token) => this.provideDeclaration(handle, model, position, token)
        };
    }
    provideDeclaration(handle, model, position, token) {
        return this.proxy.$provideDeclaration(handle, model.uri, position, token).then(result => {
            if (!result) {
                return undefined;
            }
            if (Array.isArray(result)) {
                // using DefinitionLink because Location is mandatory part of DefinitionLink
                const definitionLinks = [];
                for (const item of result) {
                    definitionLinks.push({ ...item, uri: monaco.Uri.revive(item.uri) });
                }
                return definitionLinks;
            }
            else {
                // single Location
                return {
                    uri: monaco.Uri.revive(result.uri),
                    range: result.range
                };
            }
        });
    }
    provideDefinition(handle, model, position, token) {
        return this.proxy.$provideDefinition(handle, model.uri, position, token).then(result => {
            if (!result) {
                return undefined;
            }
            if (Array.isArray(result)) {
                // using DefinitionLink because Location is mandatory part of DefinitionLink
                const definitionLinks = [];
                for (const item of result) {
                    definitionLinks.push({ ...item, uri: monaco.Uri.revive(item.uri) });
                }
                return definitionLinks;
            }
            else {
                // single Location
                return {
                    uri: monaco.Uri.revive(result.uri),
                    range: result.range
                };
            }
        });
    }
    createSignatureHelpProvider(handle, metadata) {
        return {
            signatureHelpTriggerCharacters: metadata.triggerCharacters,
            signatureHelpRetriggerCharacters: metadata.retriggerCharacters,
            provideSignatureHelp: async (model, position, token, context) => this.provideSignatureHelp(handle, model, position, token, context)
        };
    }
    async provideSignatureHelp(handle, model, position, token, context) {
        const value = await this.proxy.$provideSignatureHelp(handle, model.uri, position, context, token);
        if (!value) {
            return undefined;
        }
        return {
            value,
            dispose: () => {
                if (typeof value.id === 'number') {
                    this.proxy.$releaseSignatureHelp(handle, value.id);
                }
            }
        };
    }
    $registerDocumentFormattingSupport(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const documentFormattingEditSupport = this.createDocumentFormattingSupport(handle, pluginInfo);
        this.register(handle, monaco.languages.registerDocumentFormattingEditProvider(languageSelector, documentFormattingEditSupport));
    }
    createDocumentFormattingSupport(handle, pluginInfo) {
        const provider = {
            extensionId: new extensions_1.ExtensionIdentifier(pluginInfo.id),
            displayName: pluginInfo.name,
            provideDocumentFormattingEdits: (model, options, token) => this.provideDocumentFormattingEdits(handle, model, options, token)
        };
        return provider;
    }
    provideDocumentFormattingEdits(handle, model, options, token) {
        return this.proxy.$provideDocumentFormattingEdits(handle, model.uri, options, token);
    }
    $registerRangeFormattingSupport(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const rangeFormattingEditProvider = this.createRangeFormattingSupport(handle, pluginInfo);
        this.register(handle, monaco.languages.registerDocumentRangeFormattingEditProvider(languageSelector, rangeFormattingEditProvider));
    }
    createRangeFormattingSupport(handle, pluginInfo) {
        const provider = {
            extensionId: new extensions_1.ExtensionIdentifier(pluginInfo.id),
            displayName: pluginInfo.name,
            provideDocumentRangeFormattingEdits: (model, range, options, token) => this.provideDocumentRangeFormattingEdits(handle, model, range, options, token)
        };
        return provider;
    }
    provideDocumentRangeFormattingEdits(handle, model, range, options, token) {
        return this.proxy.$provideDocumentRangeFormattingEdits(handle, model.uri, range, options, token);
    }
    $registerOnTypeFormattingProvider(handle, pluginInfo, selector, autoFormatTriggerCharacters) {
        const languageSelector = this.toLanguageSelector(selector);
        const onTypeFormattingProvider = this.createOnTypeFormattingProvider(handle, autoFormatTriggerCharacters);
        this.register(handle, monaco.languages.registerOnTypeFormattingEditProvider(languageSelector, onTypeFormattingProvider));
    }
    createOnTypeFormattingProvider(handle, autoFormatTriggerCharacters) {
        return {
            autoFormatTriggerCharacters,
            provideOnTypeFormattingEdits: (model, position, ch, options, token) => this.provideOnTypeFormattingEdits(handle, model, position, ch, options, token)
        };
    }
    provideOnTypeFormattingEdits(handle, model, position, ch, options, token) {
        return this.proxy.$provideOnTypeFormattingEdits(handle, model.uri, position, ch, options, token);
    }
    $registerDocumentDropEditProvider(handle, selector, metadata) {
        this.register(handle, standaloneServices_1.StandaloneServices
            .get(languageFeatures_1.ILanguageFeaturesService)
            .documentOnDropEditProvider
            .register(selector, this.createDocumentDropEditProvider(handle, metadata)));
    }
    createDocumentDropEditProvider(handle, _metadata) {
        return {
            // @monaco-uplift dropMimeTypes should be supported by the monaco drop editor provider after 1.79.0
            // dropMimeTypes: metadata?.dropMimeTypes ?? ['*/*'],
            provideDocumentOnDropEdits: async (model, position, dataTransfer, token) => this.provideDocumentDropEdits(handle, model, position, dataTransfer, token)
        };
    }
    async provideDocumentDropEdits(handle, model, position, dataTransfer, token) {
        await this.fileUploadService.upload(new uri_1.URI(), { source: dataTransfer, leaveInTemp: true });
        const edit = await this.proxy.$provideDocumentDropEdits(handle, model.uri, position, await data_transfer_type_converters_1.DataTransfer.toDataTransferDTO(dataTransfer), token);
        if (edit) {
            return {
                // @monaco-uplift id, priority and label should be supported by monaco after 1.79.0. The implementation relies on a copy of the plugin data
                // id: edit.id ? plugin.identifier.value + '.' + edit.id : plugin.identifier.value,
                // label: edit.label ?? nls.localizeByDefault("Drop using '{0}' extension", plugin.displayName || plugin.name),
                // priority: edit.priority ?? 0,
                insertText: edit.insertText instanceof types_impl_1.SnippetString ? { snippet: edit.insertText.value } : edit.insertText,
                additionalEdit: toMonacoWorkspaceEdit(edit === null || edit === void 0 ? void 0 : edit.additionalEdit)
            };
        }
    }
    $registerFoldingRangeProvider(handle, pluginInfo, selector, eventHandle) {
        const languageSelector = this.toLanguageSelector(selector);
        const provider = this.createFoldingRangeProvider(handle);
        if (typeof eventHandle === 'number') {
            const emitter = new event_1.Emitter();
            this.services.set(eventHandle, emitter);
            provider.onDidChange = emitter.event;
        }
        this.register(handle, monaco.languages.registerFoldingRangeProvider(languageSelector, provider));
    }
    createFoldingRangeProvider(handle) {
        return {
            provideFoldingRanges: (model, context, token) => this.provideFoldingRanges(handle, model, context, token)
        };
    }
    $emitFoldingRangeEvent(eventHandle, event) {
        const obj = this.services.get(eventHandle);
        if (obj instanceof event_1.Emitter) {
            obj.fire(event);
        }
    }
    provideFoldingRanges(handle, model, context, token) {
        return this.proxy.$provideFoldingRange(handle, model.uri, context, token);
    }
    $registerSelectionRangeProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const provider = this.createSelectionRangeProvider(handle);
        this.register(handle, monaco.languages.registerSelectionRangeProvider(languageSelector, provider));
    }
    createSelectionRangeProvider(handle) {
        return {
            provideSelectionRanges: (model, positions, token) => this.provideSelectionRanges(handle, model, positions, token)
        };
    }
    provideSelectionRanges(handle, model, positions, token) {
        return this.proxy.$provideSelectionRanges(handle, model.uri, positions, token);
    }
    $registerDocumentColorProvider(handle, pluginInfo, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const colorProvider = this.createColorProvider(handle);
        this.register(handle, monaco.languages.registerColorProvider(languageSelector, colorProvider));
    }
    createColorProvider(handle) {
        return {
            provideDocumentColors: (model, token) => this.provideDocumentColors(handle, model, token),
            provideColorPresentations: (model, colorInfo, token) => this.provideColorPresentations(handle, model, colorInfo, token)
        };
    }
    provideDocumentColors(handle, model, token) {
        return this.proxy.$provideDocumentColors(handle, model.uri, token).then(documentColors => documentColors.map(documentColor => {
            const [red, green, blue, alpha] = documentColor.color;
            const color = {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha
            };
            return {
                color,
                range: documentColor.range
            };
        }));
    }
    provideColorPresentations(handle, model, colorInfo, token) {
        return this.proxy.$provideColorPresentations(handle, model.uri, {
            color: [
                colorInfo.color.red,
                colorInfo.color.green,
                colorInfo.color.blue,
                colorInfo.color.alpha
            ],
            range: colorInfo.range
        }, token);
    }
    $registerInlayHintsProvider(handle, pluginInfo, selector, displayName, eventHandle) {
        const languageSelector = this.toLanguageSelector(selector);
        const inlayHintsProvider = this.createInlayHintsProvider(handle);
        if (typeof eventHandle === 'number') {
            const emitter = new event_1.Emitter();
            this.register(eventHandle, emitter);
            inlayHintsProvider.onDidChangeInlayHints = emitter.event;
        }
        this.register(handle, monaco.languages.registerInlayHintsProvider(languageSelector, inlayHintsProvider));
    }
    createInlayHintsProvider(handle) {
        return {
            provideInlayHints: async (model, range, token) => {
                const result = await this.proxy.$provideInlayHints(handle, model.uri, range, token);
                if (!result) {
                    return;
                }
                return {
                    hints: result.hints.map(hint => reviveHint(hint)),
                    dispose: () => {
                        if (typeof result.cacheId === 'number') {
                            this.proxy.$releaseInlayHints(handle, result.cacheId);
                        }
                    }
                };
            },
            resolveInlayHint: async (hint, token) => {
                const dto = hint;
                if (typeof dto.cacheId !== 'number') {
                    return hint;
                }
                const result = await this.proxy.$resolveInlayHint(handle, dto.cacheId, token);
                if (token.isCancellationRequested) {
                    return undefined;
                }
                if (!result) {
                    return hint;
                }
                return {
                    ...hint,
                    tooltip: result.tooltip,
                    label: reviveInlayLabel(result.label)
                };
            },
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $emitInlayHintsEvent(eventHandle, event) {
        const obj = this.services.get(eventHandle);
        if (obj instanceof event_1.Emitter) {
            obj.fire(event);
        }
    }
    $registerInlineCompletionsSupport(handle, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const provider = {
            provideInlineCompletions: async (model, position, context, token) => this.proxy.$provideInlineCompletions(handle, model.uri, position, context, token),
            freeInlineCompletions: (completions) => {
                this.proxy.$freeInlineCompletionsList(handle, completions.pid);
            }
        };
        this.register(handle, monaco.languages.registerInlineCompletionsProvider(languageSelector, provider));
    }
    $registerQuickFixProvider(handle, pluginInfo, selector, providedCodeActionKinds, documentation) {
        const languageSelector = this.toLanguageSelector(selector);
        const quickFixProvider = {
            provideCodeActions: (model, range, context, token) => {
                const markers = standaloneServices_1.StandaloneServices.get(markers_1.IMarkerService)
                    .read({ resource: model.uri })
                    .filter(m => monaco.Range.areIntersectingOrTouching(m, range));
                return this.provideCodeActions(handle, model, range, { ...context, markers }, token);
            },
            resolveCodeAction: (codeAction, token) => this.resolveCodeAction(handle, codeAction, token)
        };
        this.register(handle, monaco.languages.registerCodeActionProvider(languageSelector, quickFixProvider));
    }
    async provideCodeActions(handle, model, rangeOrSelection, context, token) {
        const actions = await this.proxy.$provideCodeActions(handle, model.uri, rangeOrSelection, this.toModelCodeActionContext(context), token);
        if (!actions) {
            return undefined;
        }
        return {
            actions: actions.map(a => toMonacoAction(a)),
            dispose: () => this.proxy.$releaseCodeActions(handle, actions.map(a => a.cacheId))
        };
    }
    toModelCodeActionContext(context) {
        return {
            ...context,
            trigger: this.toCodeActionTriggerKind(context.trigger)
        };
    }
    toCodeActionTriggerKind(type) {
        switch (type) {
            case monaco.languages.CodeActionTriggerType.Auto:
                return types_impl_1.CodeActionTriggerKind.Automatic;
            case monaco.languages.CodeActionTriggerType.Invoke:
                return types_impl_1.CodeActionTriggerKind.Invoke;
        }
    }
    async resolveCodeAction(handle, codeAction, token) {
        // The cacheId is kept in toMonacoAction when converting a received CodeAction DTO to a monaco code action
        const cacheId = codeAction.cacheId;
        if (cacheId !== undefined) {
            const resolvedEdit = await this.proxy.$resolveCodeAction(handle, cacheId, token);
            codeAction.edit = resolvedEdit && toMonacoWorkspaceEdit(resolvedEdit);
        }
        return codeAction;
    }
    $registerRenameProvider(handle, pluginInfo, selector, supportsResolveLocation) {
        const languageSelector = this.toLanguageSelector(selector);
        const renameProvider = this.createRenameProvider(handle, supportsResolveLocation);
        this.register(handle, monaco.languages.registerRenameProvider(languageSelector, renameProvider));
    }
    createRenameProvider(handle, supportsResolveLocation) {
        return {
            provideRenameEdits: (model, position, newName, token) => this.provideRenameEdits(handle, model, position, newName, token),
            resolveRenameLocation: supportsResolveLocation
                ? (model, position, token) => this.resolveRenameLocation(handle, model, position, token)
                : undefined
        };
    }
    provideRenameEdits(handle, model, position, newName, token) {
        return this.proxy.$provideRenameEdits(handle, model.uri, position, newName, token).then(toMonacoWorkspaceEdit);
    }
    $registerCallHierarchyProvider(handle, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const callHierarchyService = this.createCallHierarchyService(handle, languageSelector);
        this.register(handle, this.callHierarchyServiceContributionRegistry.add(callHierarchyService));
    }
    createCallHierarchyService(handle, language) {
        return {
            selector: language,
            getRootDefinition: (uri, position, cancellationToken) => this.proxy.$provideRootDefinition(handle, (0, hierarchy_types_converters_1.toUriComponents)(uri), (0, hierarchy_types_converters_1.fromPosition)(position), cancellationToken)
                .then(def => {
                if (!def) {
                    return undefined;
                }
                const defs = Array.isArray(def) ? def : [def];
                return { dispose: () => { var _a; return this.proxy.$releaseCallHierarchy(handle, (_a = defs[0]) === null || _a === void 0 ? void 0 : _a._sessionId); }, items: defs.map(item => (0, hierarchy_types_converters_1.toItemHierarchyDefinition)(item)) };
            }),
            getCallers: (definition, cancellationToken) => this.proxy.$provideCallers(handle, (0, hierarchy_types_converters_1.fromItemHierarchyDefinition)(definition), cancellationToken)
                .then(result => {
                if (!result) {
                    return undefined;
                }
                if (Array.isArray(result)) {
                    return result.map(hierarchy_types_converters_1.toCaller);
                }
                return undefined;
            }),
            getCallees: (definition, cancellationToken) => this.proxy.$provideCallees(handle, (0, hierarchy_types_converters_1.fromItemHierarchyDefinition)(definition), cancellationToken)
                .then(result => {
                if (!result) {
                    return undefined;
                }
                if (Array.isArray(result)) {
                    return result.map(hierarchy_types_converters_1.toCallee);
                }
                return undefined;
            })
        };
    }
    resolveRenameLocation(handle, model, position, token) {
        return this.proxy.$resolveRenameLocation(handle, model.uri, position, token);
    }
    // --- type hierarchy
    $registerTypeHierarchyProvider(handle, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const typeHierarchyService = this.createTypeHierarchyService(handle, languageSelector);
        this.register(handle, this.typeHierarchyServiceContributionRegistry.add(typeHierarchyService));
    }
    createTypeHierarchyService(handle, language) {
        return {
            selector: language,
            prepareSession: (uri, position, cancellationToken) => this.proxy.$prepareTypeHierarchy(handle, (0, hierarchy_types_converters_1.toUriComponents)(uri), (0, hierarchy_types_converters_1.fromPosition)(position), cancellationToken)
                .then(result => {
                if (!result) {
                    return undefined;
                }
                const items = Array.isArray(result) ? result : [result];
                return {
                    dispose: () => { var _a; return this.proxy.$releaseTypeHierarchy(handle, (_a = items[0]) === null || _a === void 0 ? void 0 : _a._sessionId); },
                    items: items.map(item => (0, hierarchy_types_converters_1.toItemHierarchyDefinition)(item))
                };
            }),
            provideSuperTypes: (sessionId, itemId, cancellationToken) => this.proxy.$provideSuperTypes(handle, sessionId, itemId, cancellationToken)
                .then(results => {
                if (!results) {
                    return undefined;
                }
                if (Array.isArray(results)) {
                    return results.map(hierarchy_types_converters_1.toItemHierarchyDefinition);
                }
                return undefined;
            }),
            provideSubTypes: async (sessionId, itemId, cancellationToken) => this.proxy.$provideSubTypes(handle, sessionId, itemId, cancellationToken)
                .then(results => {
                if (!results) {
                    return undefined;
                }
                if (Array.isArray(results)) {
                    return results.map(hierarchy_types_converters_1.toItemHierarchyDefinition);
                }
                return undefined;
            })
        };
    }
    // --- semantic tokens
    $registerDocumentSemanticTokensProvider(handle, pluginInfo, selector, legend, eventHandle) {
        const languageSelector = this.toLanguageSelector(selector);
        let event = undefined;
        if (typeof eventHandle === 'number') {
            const emitter = new event_1.Emitter();
            this.register(eventHandle, emitter);
            event = emitter.event;
        }
        const provider = this.createDocumentSemanticTokensProvider(handle, legend, event);
        this.register(handle, monaco.languages.registerDocumentSemanticTokensProvider(languageSelector, provider));
    }
    createDocumentSemanticTokensProvider(handle, legend, event) {
        return {
            releaseDocumentSemanticTokens: resultId => {
                if (resultId) {
                    this.proxy.$releaseDocumentSemanticTokens(handle, parseInt(resultId, 10));
                }
            },
            getLegend: () => legend,
            provideDocumentSemanticTokens: async (model, lastResultId, token) => {
                const nLastResultId = lastResultId ? parseInt(lastResultId, 10) : 0;
                const encodedDto = await this.proxy.$provideDocumentSemanticTokens(handle, model.uri, nLastResultId, token);
                if (!encodedDto) {
                    return null;
                }
                if (token.isCancellationRequested) {
                    return null;
                }
                const dto = (0, semantic_tokens_dto_1.decodeSemanticTokensDto)(encodedDto);
                if (dto.type === 'full') {
                    return {
                        resultId: String(dto.id),
                        data: dto.data
                    };
                }
                return {
                    resultId: String(dto.id),
                    edits: dto.deltas
                };
            }
        };
    }
    $emitDocumentSemanticTokensEvent(eventHandle) {
        const obj = this.services.get(eventHandle);
        if (obj instanceof event_1.Emitter) {
            obj.fire(undefined);
        }
    }
    $registerDocumentRangeSemanticTokensProvider(handle, pluginInfo, selector, legend) {
        const languageSelector = this.toLanguageSelector(selector);
        const provider = this.createDocumentRangeSemanticTokensProvider(handle, legend);
        this.register(handle, monaco.languages.registerDocumentRangeSemanticTokensProvider(languageSelector, provider));
    }
    createDocumentRangeSemanticTokensProvider(handle, legend) {
        return {
            getLegend: () => legend,
            provideDocumentRangeSemanticTokens: async (model, range, token) => {
                const encodedDto = await this.proxy.$provideDocumentRangeSemanticTokens(handle, model.uri, range, token);
                if (!encodedDto) {
                    return null;
                }
                if (token.isCancellationRequested) {
                    return null;
                }
                const dto = (0, semantic_tokens_dto_1.decodeSemanticTokensDto)(encodedDto);
                if (dto.type === 'full') {
                    return {
                        resultId: String(dto.id),
                        data: dto.data
                    };
                }
                throw new Error('Unexpected');
            }
        };
    }
    // --- suggest
    toLanguageSelector(filters) {
        return filters.map(filter => {
            let pattern;
            if (typeof filter.pattern === 'string') {
                pattern = filter.pattern;
            }
            else if (filter.pattern) {
                pattern = {
                    base: MonacoPath.normalize(filter.pattern.baseUri.toString()),
                    pattern: filter.pattern.pattern,
                    pathToRelative: paths_util_1.relative
                };
            }
            return {
                language: filter.language,
                scheme: filter.scheme,
                pattern
            };
        });
    }
    // --- linked editing range
    $registerLinkedEditingRangeProvider(handle, selector) {
        const languageSelector = this.toLanguageSelector(selector);
        const linkedEditingRangeProvider = this.createLinkedEditingRangeProvider(handle);
        this.register(handle, monaco.languages.registerLinkedEditingRangeProvider(languageSelector, linkedEditingRangeProvider));
    }
    createLinkedEditingRangeProvider(handle) {
        return {
            provideLinkedEditingRanges: async (model, position, token) => {
                const res = await this.proxy.$provideLinkedEditingRanges(handle, model.uri, position, token);
                if (res) {
                    return {
                        ranges: res.ranges,
                        wordPattern: reviveRegExp(res.wordPattern)
                    };
                }
                return undefined;
            }
        };
    }
    ;
    // -- Language status
    $setLanguageStatus(handle, status) {
        const internal = { ...status, selector: this.toLanguageSelector(status.selector) };
        this.languageStatusService.setLanguageStatusItem(handle, internal);
    }
    ;
    $removeLanguageStatus(handle) {
        this.languageStatusService.removeLanguageStatusItem(handle);
    }
    ;
};
__decorate([
    (0, inversify_1.inject)(monaco_languages_1.MonacoLanguages),
    __metadata("design:type", monaco_languages_1.MonacoLanguages)
], LanguagesMainImpl.prototype, "monacoLanguages", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ProblemManager),
    __metadata("design:type", browser_1.ProblemManager)
], LanguagesMainImpl.prototype, "problemManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.CallHierarchyServiceProvider),
    __metadata("design:type", browser_2.CallHierarchyServiceProvider)
], LanguagesMainImpl.prototype, "callHierarchyServiceContributionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.TypeHierarchyServiceProvider),
    __metadata("design:type", browser_3.TypeHierarchyServiceProvider)
], LanguagesMainImpl.prototype, "typeHierarchyServiceContributionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(editor_language_status_service_1.EditorLanguageStatusService),
    __metadata("design:type", editor_language_status_service_1.EditorLanguageStatusService)
], LanguagesMainImpl.prototype, "languageStatusService", void 0);
__decorate([
    (0, inversify_1.inject)(file_upload_service_1.FileUploadService),
    __metadata("design:type", file_upload_service_1.FileUploadService)
], LanguagesMainImpl.prototype, "fileUploadService", void 0);
LanguagesMainImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(rpc_protocol_1.RPCProtocol)),
    __metadata("design:paramtypes", [Object])
], LanguagesMainImpl);
exports.LanguagesMainImpl = LanguagesMainImpl;
function reviveMarker(marker) {
    const monacoMarker = {
        code: marker.code,
        severity: reviveSeverity(marker.severity),
        range: reviveRange(marker.startLineNumber, marker.startColumn, marker.endLineNumber, marker.endColumn),
        message: marker.message,
        source: marker.source,
        relatedInformation: undefined
    };
    if (marker.relatedInformation) {
        monacoMarker.relatedInformation = marker.relatedInformation.map(reviveRelated);
    }
    if (marker.tags) {
        monacoMarker.tags = marker.tags.map(reviveTag);
    }
    return monacoMarker;
}
function reviveSeverity(severity) {
    switch (severity) {
        case plugin_api_rpc_model_1.MarkerSeverity.Error: return vst.DiagnosticSeverity.Error;
        case plugin_api_rpc_model_1.MarkerSeverity.Warning: return vst.DiagnosticSeverity.Warning;
        case plugin_api_rpc_model_1.MarkerSeverity.Info: return vst.DiagnosticSeverity.Information;
        case plugin_api_rpc_model_1.MarkerSeverity.Hint: return vst.DiagnosticSeverity.Hint;
    }
}
function reviveRange(startLine, startColumn, endLine, endColumn) {
    // note: language server range is 0-based, marker is 1-based, so need to deduct 1 here
    return {
        start: {
            line: startLine - 1,
            character: startColumn - 1
        },
        end: {
            line: endLine - 1,
            character: endColumn - 1
        }
    };
}
function reviveRelated(related) {
    return {
        message: related.message,
        location: {
            uri: related.resource,
            range: reviveRange(related.startLineNumber, related.startColumn, related.endLineNumber, related.endColumn)
        }
    };
}
function reviveTag(tag) {
    switch (tag) {
        case 1: return vscode_languageserver_protocol_1.DiagnosticTag.Unnecessary;
        case 2: return vscode_languageserver_protocol_1.DiagnosticTag.Deprecated;
    }
}
function reviveRegExp(regExp) {
    if (typeof regExp === 'undefined' || regExp === null) {
        return undefined;
    }
    return new RegExp(regExp.pattern, regExp.flags);
}
function reviveIndentationRule(indentationRule) {
    if (typeof indentationRule === 'undefined' || indentationRule === null) {
        return undefined;
    }
    return {
        increaseIndentPattern: reviveRegExp(indentationRule.increaseIndentPattern),
        decreaseIndentPattern: reviveRegExp(indentationRule.decreaseIndentPattern),
        indentNextLinePattern: reviveRegExp(indentationRule.indentNextLinePattern),
        unIndentedLinePattern: reviveRegExp(indentationRule.unIndentedLinePattern),
    };
}
function reviveOnEnterRule(onEnterRule) {
    return {
        beforeText: reviveRegExp(onEnterRule.beforeText),
        afterText: reviveRegExp(onEnterRule.afterText),
        previousLineText: reviveRegExp(onEnterRule.previousLineText),
        action: onEnterRule.action,
    };
}
function reviveOnEnterRules(onEnterRules) {
    if (typeof onEnterRules === 'undefined' || onEnterRules === null) {
        return undefined;
    }
    return onEnterRules.map(reviveOnEnterRule);
}
function reviveInlayLabel(label) {
    var _a;
    let monacoLabel;
    if (typeof label === 'string') {
        monacoLabel = label;
    }
    else {
        const parts = [];
        for (const part of label) {
            const result = {
                ...part,
                location: !!part.location ? { range: (_a = part.location) === null || _a === void 0 ? void 0 : _a.range, uri: monaco.Uri.revive(part.location.uri) } : undefined
            };
            parts.push(result);
        }
        monacoLabel = parts;
    }
    return monacoLabel;
}
function reviveHint(hint) {
    return {
        ...hint,
        label: reviveInlayLabel(hint.label)
    };
}
function toMonacoAction(action) {
    var _a;
    return {
        ...action,
        diagnostics: action.diagnostics ? action.diagnostics.map(m => toMonacoMarkerData(m)) : undefined,
        disabled: (_a = action.disabled) === null || _a === void 0 ? void 0 : _a.reason,
        edit: action.edit ? toMonacoWorkspaceEdit(action.edit) : undefined
    };
}
function toMonacoMarkerData(marker) {
    return {
        ...marker,
        relatedInformation: marker.relatedInformation
            ? marker.relatedInformation.map(i => toMonacoRelatedInformation(i))
            : undefined
    };
}
function toMonacoRelatedInformation(relatedInfo) {
    return {
        ...relatedInfo,
        resource: monaco.Uri.parse(relatedInfo.resource)
    };
}
function toMonacoWorkspaceEdit(data) {
    return {
        edits: (data && data.edits || []).map(edit => {
            if (plugin_api_rpc_1.WorkspaceTextEditDto.is(edit)) {
                return {
                    resource: monaco.Uri.revive(edit.resource),
                    textEdit: edit.textEdit,
                    metadata: edit.metadata
                };
            }
            else {
                const fileEdit = edit;
                return {
                    newResource: monaco.Uri.revive(fileEdit.newResource),
                    oldResource: monaco.Uri.revive(fileEdit.oldResource),
                    options: fileEdit.options,
                    metadata: fileEdit.metadata
                };
            }
            // TODO implement WorkspaceNotebookCellEditDto
        })
    };
}
exports.toMonacoWorkspaceEdit = toMonacoWorkspaceEdit;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/languages-main'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_plugin-ext_lib_main_browser_languages-main_js.js.map