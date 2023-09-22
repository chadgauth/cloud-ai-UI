(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_monaco_lib_browser_monaco-workspace_js"],{

/***/ "../../packages/core/shared/@phosphor/domutils/index.js":
/*!**************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/domutils/index.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/domutils */ "../../node_modules/@phosphor/domutils/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/domutils'] = this;


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

/***/ "../../packages/monaco/lib/browser/monaco-editor-model.js":
/*!****************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-editor-model.js ***!
  \****************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoEditorModel = exports.TextDocumentSaveReason = void 0;
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
Object.defineProperty(exports, "TextDocumentSaveReason", ({ enumerable: true, get: function () { return vscode_languageserver_protocol_1.TextDocumentSaveReason; } }));
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const resource_1 = __webpack_require__(/*! @theia/core/lib/common/resource */ "../../packages/core/lib/common/resource.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const language_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/languages/language */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/languages/language.js");
const model_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/model */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/model.js");
const textModel_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/model/textModel */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/model/textModel.js");
const editor_generated_preference_schema_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-generated-preference-schema */ "../../packages/editor/lib/browser/editor-generated-preference-schema.js");
class MonacoEditorModel {
    constructor(resource, m2p, p2m, logger, editorPreferences) {
        this.resource = resource;
        this.m2p = m2p;
        this.p2m = p2m;
        this.logger = logger;
        this.editorPreferences = editorPreferences;
        this.autoSave = 'afterDelay';
        this.autoSaveDelay = 500;
        this.suppressOpenEditorWhenDirty = false;
        this.lineNumbersMinChars = 3;
        /* @deprecated there is no general save timeout, each participant should introduce a sensible timeout  */
        this.onWillSaveLoopTimeOut = 1500;
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDisposeOnAutoSave = new disposable_1.DisposableCollection();
        this.onDidChangeContentEmitter = new event_1.Emitter();
        this.onDidChangeContent = this.onDidChangeContentEmitter.event;
        this.onDidSaveModelEmitter = new event_1.Emitter();
        this.onDidSaveModel = this.onDidSaveModelEmitter.event;
        this.onWillSaveModelEmitter = new event_1.Emitter();
        this.onWillSaveModel = this.onWillSaveModelEmitter.event;
        this.onDidChangeValidEmitter = new event_1.Emitter();
        this.onDidChangeValid = this.onDidChangeValidEmitter.event;
        this.onDidChangeEncodingEmitter = new event_1.Emitter();
        this.onDidChangeEncoding = this.onDidChangeEncodingEmitter.event;
        /**
         * Use `valid` to access it.
         * Use `setValid` to mutate it.
         */
        this._valid = false;
        this._dirty = false;
        this.onDirtyChangedEmitter = new event_1.Emitter();
        this.pendingOperation = Promise.resolve();
        this.syncCancellationTokenSource = new cancellation_1.CancellationTokenSource();
        this.ignoreDirtyEdits = false;
        this.saveCancellationTokenSource = new cancellation_1.CancellationTokenSource();
        this.ignoreContentChanges = false;
        this.contentChanges = [];
        this.toDispose.push(resource);
        this.toDispose.push(this.toDisposeOnAutoSave);
        this.toDispose.push(this.onDidChangeContentEmitter);
        this.toDispose.push(this.onDidSaveModelEmitter);
        this.toDispose.push(this.onWillSaveModelEmitter);
        this.toDispose.push(this.onDirtyChangedEmitter);
        this.toDispose.push(this.onDidChangeValidEmitter);
        this.toDispose.push(disposable_1.Disposable.create(() => this.cancelSave()));
        this.toDispose.push(disposable_1.Disposable.create(() => this.cancelSync()));
        this.resolveModel = this.readContents().then(content => this.initialize(content || ''));
    }
    dispose() {
        this.toDispose.dispose();
    }
    isDisposed() {
        return this.toDispose.disposed;
    }
    resolve() {
        return this.resolveModel;
    }
    isResolved() {
        return Boolean(this.model);
    }
    setEncoding(encoding, mode) {
        if (mode === 1 /* Decode */ && this.dirty) {
            return Promise.resolve();
        }
        if (!this.setPreferredEncoding(encoding)) {
            return Promise.resolve();
        }
        if (mode === 1 /* Decode */) {
            return this.sync();
        }
        return this.scheduleSave(vscode_languageserver_protocol_1.TextDocumentSaveReason.Manual, this.cancelSave(), true);
    }
    getEncoding() {
        return this.preferredEncoding || this.contentEncoding;
    }
    setPreferredEncoding(encoding) {
        if (encoding === this.preferredEncoding || (!this.preferredEncoding && encoding === this.contentEncoding)) {
            return false;
        }
        this.preferredEncoding = encoding;
        this.onDidChangeEncodingEmitter.fire(encoding);
        return true;
    }
    updateContentEncoding() {
        const contentEncoding = this.resource.encoding;
        if (!contentEncoding || this.contentEncoding === contentEncoding) {
            return;
        }
        this.contentEncoding = contentEncoding;
        if (!this.preferredEncoding) {
            this.onDidChangeEncodingEmitter.fire(contentEncoding);
        }
    }
    /**
     * #### Important
     * Only this method can create an instance of `monaco.editor.IModel`,
     * there should not be other calls to `monaco.editor.createModel`.
     */
    initialize(value) {
        if (!this.toDispose.disposed) {
            const uri = monaco.Uri.parse(this.resource.uri.toString());
            let firstLine;
            if (typeof value === 'string') {
                firstLine = value;
                const firstLF = value.indexOf('\n');
                if (firstLF !== -1) {
                    firstLine = value.substring(0, firstLF);
                }
            }
            else {
                firstLine = value.getFirstLineText(1000);
            }
            const languageSelection = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService).createByFilepathOrFirstLine(uri, firstLine);
            this.model = standaloneServices_1.StandaloneServices.get(model_1.IModelService).createModel(value, languageSelection, uri);
            this.resourceVersion = this.resource.version;
            this.setDirty(this._dirty || (this.resource.uri.scheme === resource_1.UNTITLED_SCHEME && this.model.getValueLength() > 0));
            this.updateSavedVersionId();
            this.toDispose.push(this.model);
            this.toDispose.push(this.model.onDidChangeContent(event => this.fireDidChangeContent(event)));
            if (this.resource.onDidChangeContents) {
                this.toDispose.push(this.resource.onDidChangeContents(() => this.sync()));
            }
        }
    }
    /**
     * Whether it is possible to load content from the underlying resource.
     */
    get valid() {
        return this._valid;
    }
    setValid(valid) {
        if (valid === this._valid) {
            return;
        }
        this._valid = valid;
        this.onDidChangeValidEmitter.fire(undefined);
    }
    get dirty() {
        return this._dirty;
    }
    setDirty(dirty) {
        if (dirty === this._dirty) {
            return;
        }
        this._dirty = dirty;
        if (dirty === false) {
            this.updateSavedVersionId();
        }
        this.onDirtyChangedEmitter.fire(undefined);
    }
    updateSavedVersionId() {
        this.bufferSavedVersionId = this.model.getAlternativeVersionId();
    }
    get onDirtyChanged() {
        return this.onDirtyChangedEmitter.event;
    }
    get uri() {
        return this.resource.uri.toString();
    }
    get languageId() {
        return this._languageId !== undefined ? this._languageId : this.model.getLanguageId();
    }
    getLanguageId() {
        return this.languageId;
    }
    /**
     * It's a hack to dispatch close notification with an old language id; don't use it.
     */
    setLanguageId(languageId) {
        this._languageId = languageId;
    }
    get version() {
        return this.model.getVersionId();
    }
    /**
     * Return selected text by Range or all text by default
     */
    getText(range) {
        if (!range) {
            return this.model.getValue();
        }
        else {
            return this.model.getValueInRange(this.p2m.asRange(range));
        }
    }
    positionAt(offset) {
        const { lineNumber, column } = this.model.getPositionAt(offset);
        return this.m2p.asPosition(lineNumber, column);
    }
    offsetAt(position) {
        return this.model.getOffsetAt(this.p2m.asPosition(position));
    }
    get lineCount() {
        return this.model.getLineCount();
    }
    /**
     * Retrieves a line in a text document expressed as a one-based position.
     */
    getLineContent(lineNumber) {
        return this.model.getLineContent(lineNumber);
    }
    getLineMaxColumn(lineNumber) {
        return this.model.getLineMaxColumn(lineNumber);
    }
    toValidPosition(position) {
        const { lineNumber, column } = this.model.validatePosition(this.p2m.asPosition(position));
        return this.m2p.asPosition(lineNumber, column);
    }
    toValidRange(range) {
        return this.m2p.asRange(this.model.validateRange(this.p2m.asRange(range)));
    }
    get readOnly() {
        return this.resource.saveContents === undefined;
    }
    isReadonly() {
        return this.readOnly;
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
    get onWillDispose() {
        return this.toDispose.onDispose;
    }
    // We have a TypeScript problem here. There is a const enum `DefaultEndOfLine` used for ITextModel and a non-const redeclaration of that enum in the public API in
    // Monaco.editor. The values will be the same, but TS won't accept that the two enums are equivalent, so it says these types are irreconcilable.
    get textEditorModel() {
        // @ts-expect-error ts(2322)
        return this.model;
    }
    /**
     * Find all matches in an editor for the given options.
     * @param options the options for finding matches.
     *
     * @returns the list of matches.
     */
    findMatches(options) {
        var _a, _b;
        const wordSeparators = (_b = (_a = this.editorPreferences) === null || _a === void 0 ? void 0 : _a['editor.wordSeparators']) !== null && _b !== void 0 ? _b : editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.wordSeparators'].default;
        const results = this.model.findMatches(options.searchString, false, options.isRegex, options.matchCase, 
        // eslint-disable-next-line no-null/no-null
        options.matchWholeWord ? wordSeparators : null, true, options.limitResultCount);
        const extractedMatches = [];
        results.forEach(r => {
            if (r.matches) {
                extractedMatches.push({
                    matches: r.matches,
                    range: vscode_languageserver_protocol_1.Range.create(r.range.startLineNumber, r.range.startColumn, r.range.endLineNumber, r.range.endColumn)
                });
            }
        });
        return extractedMatches;
    }
    async load() {
        await this.resolveModel;
        return this;
    }
    save(options) {
        return this.scheduleSave(vscode_languageserver_protocol_1.TextDocumentSaveReason.Manual, undefined, undefined, options);
    }
    async run(operation) {
        if (this.toDispose.disposed) {
            return;
        }
        return this.pendingOperation = this.pendingOperation.then(async () => {
            try {
                await operation();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    cancelSync() {
        this.trace(log => log('MonacoEditorModel.cancelSync'));
        this.syncCancellationTokenSource.cancel();
        this.syncCancellationTokenSource = new cancellation_1.CancellationTokenSource();
        return this.syncCancellationTokenSource.token;
    }
    async sync() {
        const token = this.cancelSync();
        return this.run(() => this.doSync(token));
    }
    async doSync(token) {
        this.trace(log => log('MonacoEditorModel.doSync - enter'));
        if (token.isCancellationRequested) {
            this.trace(log => log('MonacoEditorModel.doSync - exit - cancelled'));
            return;
        }
        const value = await this.readContents();
        if (value === undefined) {
            this.trace(log => log('MonacoEditorModel.doSync - exit - resource not found'));
            return;
        }
        if (token.isCancellationRequested) {
            this.trace(log => log('MonacoEditorModel.doSync - exit - cancelled while looking for a resource'));
            return;
        }
        if (this._dirty) {
            this.trace(log => log('MonacoEditorModel.doSync - exit - pending dirty changes'));
            return;
        }
        this.resourceVersion = this.resource.version;
        this.updateModel(() => standaloneServices_1.StandaloneServices.get(model_1.IModelService).updateModel(this.model, value), {
            ignoreDirty: true,
            ignoreContentChanges: true
        });
        this.trace(log => log('MonacoEditorModel.doSync - exit'));
    }
    async readContents() {
        try {
            const options = { encoding: this.getEncoding() };
            const content = await (this.resource.readStream ? this.resource.readStream(options) : this.resource.readContents(options));
            let value;
            if (typeof content === 'string') {
                value = content;
            }
            else {
                value = (0, textModel_1.createTextBufferFactoryFromStream)(content);
            }
            this.updateContentEncoding();
            this.setValid(true);
            return value;
        }
        catch (e) {
            this.setValid(false);
            if (resource_1.ResourceError.NotFound.is(e)) {
                return undefined;
            }
            throw e;
        }
    }
    markAsDirty() {
        this.trace(log => log('MonacoEditorModel.markAsDirty - enter'));
        if (this.ignoreDirtyEdits) {
            this.trace(log => log('MonacoEditorModel.markAsDirty - exit - ignoring dirty changes enabled'));
            return;
        }
        this.cancelSync();
        this.setDirty(true);
        this.doAutoSave();
        this.trace(log => log('MonacoEditorModel.markAsDirty - exit'));
    }
    doAutoSave() {
        if (this.autoSave !== 'off' && this.resource.uri.scheme !== resource_1.UNTITLED_SCHEME) {
            const token = this.cancelSave();
            this.toDisposeOnAutoSave.dispose();
            const handle = window.setTimeout(() => {
                this.scheduleSave(vscode_languageserver_protocol_1.TextDocumentSaveReason.AfterDelay, token);
            }, this.autoSaveDelay);
            this.toDisposeOnAutoSave.push(disposable_1.Disposable.create(() => window.clearTimeout(handle)));
        }
    }
    cancelSave() {
        this.trace(log => log('MonacoEditorModel.cancelSave'));
        this.saveCancellationTokenSource.cancel();
        this.saveCancellationTokenSource = new cancellation_1.CancellationTokenSource();
        return this.saveCancellationTokenSource.token;
    }
    scheduleSave(reason, token = this.cancelSave(), overwriteEncoding, options) {
        return this.run(() => this.doSave(reason, token, overwriteEncoding, options));
    }
    pushContentChanges(contentChanges) {
        if (!this.ignoreContentChanges) {
            this.contentChanges.push(...contentChanges);
        }
    }
    fireDidChangeContent(event) {
        this.trace(log => log(`MonacoEditorModel.fireDidChangeContent - enter - ${JSON.stringify(event, undefined, 2)}`));
        if (this.model.getAlternativeVersionId() === this.bufferSavedVersionId) {
            this.setDirty(false);
        }
        else {
            this.markAsDirty();
        }
        const changeContentEvent = this.asContentChangedEvent(event);
        this.onDidChangeContentEmitter.fire(changeContentEvent);
        this.pushContentChanges(changeContentEvent.contentChanges);
        this.trace(log => log('MonacoEditorModel.fireDidChangeContent - exit'));
    }
    asContentChangedEvent(event) {
        const contentChanges = event.changes.map(change => this.asTextDocumentContentChangeEvent(change));
        return { model: this, contentChanges };
    }
    asTextDocumentContentChangeEvent(change) {
        const range = this.m2p.asRange(change.range);
        const rangeLength = change.rangeLength;
        const text = change.text;
        return { range, rangeLength, text };
    }
    applyEdits(operations, options) {
        return this.updateModel(() => this.model.applyEdits(operations), options);
    }
    updateModel(doUpdate, options) {
        const resolvedOptions = {
            ignoreDirty: false,
            ignoreContentChanges: false,
            ...options
        };
        const { ignoreDirtyEdits, ignoreContentChanges } = this;
        this.ignoreDirtyEdits = resolvedOptions.ignoreDirty;
        this.ignoreContentChanges = resolvedOptions.ignoreContentChanges;
        try {
            return doUpdate();
        }
        finally {
            this.ignoreDirtyEdits = ignoreDirtyEdits;
            this.ignoreContentChanges = ignoreContentChanges;
        }
    }
    async doSave(reason, token, overwriteEncoding, options) {
        if (token.isCancellationRequested || !this.resource.saveContents) {
            return;
        }
        await this.fireWillSaveModel(reason, token, options);
        if (token.isCancellationRequested) {
            return;
        }
        const changes = [...this.contentChanges];
        if (changes.length === 0 && !overwriteEncoding && reason !== vscode_languageserver_protocol_1.TextDocumentSaveReason.Manual) {
            return;
        }
        const contentLength = this.model.getValueLength();
        const content = this.model.getValue();
        try {
            const encoding = this.getEncoding();
            const version = this.resourceVersion;
            await resource_1.Resource.save(this.resource, { changes, content, contentLength, options: { encoding, overwriteEncoding, version } }, token);
            this.contentChanges.splice(0, changes.length);
            this.resourceVersion = this.resource.version;
            this.updateContentEncoding();
            this.setValid(true);
            if (token.isCancellationRequested) {
                return;
            }
            this.setDirty(false);
            this.fireDidSaveModel();
        }
        catch (e) {
            if (!resource_1.ResourceError.OutOfSync.is(e)) {
                throw e;
            }
        }
    }
    async fireWillSaveModel(reason, token, options) {
        const firing = this.onWillSaveModelEmitter.sequence(async (listener) => {
            if (token.isCancellationRequested) {
                return false;
            }
            const waitables = [];
            const { version } = this;
            const event = {
                model: this, reason, options,
                waitUntil: (thenable) => {
                    if (Object.isFrozen(waitables)) {
                        throw new Error('waitUntil cannot be called asynchronously.');
                    }
                    waitables.push(thenable);
                }
            };
            // Fire.
            try {
                listener(event);
            }
            catch (err) {
                console.error(err);
                return true;
            }
            // Asynchronous calls to `waitUntil` should fail.
            Object.freeze(waitables);
            // Wait for all promises.
            const edits = await Promise.all(waitables).then(allOperations => [].concat(...allOperations));
            if (token.isCancellationRequested) {
                return false;
            }
            // In a perfect world, we should only apply edits if document is clean.
            if (version !== this.version) {
                console.error('onWillSave listeners should provide edits, not directly alter the document.');
            }
            // Finally apply edits provided by this listener before firing the next.
            if (edits && edits.length > 0) {
                this.applyEdits(edits, {
                    ignoreDirty: true,
                });
            }
            return true;
        });
        try {
            await firing;
        }
        catch (e) {
            console.error(e);
        }
    }
    fireDidSaveModel() {
        this.onDidSaveModelEmitter.fire(this.model);
    }
    async revert(options) {
        this.trace(log => log('MonacoEditorModel.revert - enter'));
        this.cancelSave();
        const soft = options && options.soft;
        if (soft !== true) {
            const dirty = this._dirty;
            this._dirty = false;
            try {
                await this.sync();
            }
            finally {
                this._dirty = dirty;
            }
        }
        this.setDirty(false);
        this.trace(log => log('MonacoEditorModel.revert - exit'));
    }
    createSnapshot(preserveBOM) {
        return { read: () => this.model.getValue(undefined, preserveBOM) };
    }
    applySnapshot(snapshot) {
        var _a;
        const value = 'value' in snapshot ? snapshot.value : (_a = snapshot.read()) !== null && _a !== void 0 ? _a : '';
        this.model.setValue(value);
    }
    trace(loggable) {
        if (this.logger) {
            this.logger.debug((log) => loggable((message, ...params) => log(message, ...params, this.resource.uri.toString(true))));
        }
    }
}
exports.MonacoEditorModel = MonacoEditorModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-editor-model'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-editor.js":
/*!**********************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-editor.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoEditor = exports.MonacoEditorServices = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const domutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/domutils */ "../../packages/core/shared/@phosphor/domutils/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const monaco_to_protocol_converter_1 = __webpack_require__(/*! ./monaco-to-protocol-converter */ "../../packages/monaco/lib/browser/monaco-to-protocol-converter.js");
const protocol_to_monaco_converter_1 = __webpack_require__(/*! ./protocol-to-monaco-converter */ "../../packages/monaco/lib/browser/protocol-to-monaco-converter.js");
const encodings_1 = __webpack_require__(/*! @theia/core/lib/common/encodings */ "../../packages/core/lib/common/encodings.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const language_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/languages/language */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/languages/language.js");
const serviceCollection_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/instantiation/common/serviceCollection */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/instantiation/common/serviceCollection.js");
const standaloneCodeEditor_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor.js");
let MonacoEditorServices = class MonacoEditorServices {
    constructor(services) {
        Object.assign(this, services);
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter),
    __metadata("design:type", monaco_to_protocol_converter_1.MonacoToProtocolConverter)
], MonacoEditorServices.prototype, "m2p", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], MonacoEditorServices.prototype, "p2m", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], MonacoEditorServices.prototype, "contextKeyService", void 0);
MonacoEditorServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.unmanaged)()),
    __metadata("design:paramtypes", [MonacoEditorServices])
], MonacoEditorServices);
exports.MonacoEditorServices = MonacoEditorServices;
class MonacoEditor extends MonacoEditorServices {
    constructor(uri, document, node, services, options, override) {
        super(services);
        this.uri = uri;
        this.document = document;
        this.node = node;
        this.toDispose = new common_1.DisposableCollection();
        this.onCursorPositionChangedEmitter = new common_1.Emitter();
        this.onSelectionChangedEmitter = new common_1.Emitter();
        this.onFocusChangedEmitter = new common_1.Emitter();
        this.onDocumentContentChangedEmitter = new common_1.Emitter();
        this.onMouseDownEmitter = new common_1.Emitter();
        this.onLanguageChangedEmitter = new common_1.Emitter();
        this.onLanguageChanged = this.onLanguageChangedEmitter.event;
        this.onScrollChangedEmitter = new common_1.Emitter();
        this.onEncodingChanged = this.document.onDidChangeEncoding;
        this.onResizeEmitter = new common_1.Emitter();
        this.onDidResize = this.onResizeEmitter.event;
        this.documents = new Set();
        /* `true` because it is derived from an URI during the instantiation */
        this._languageAutoDetected = true;
        this.toDispose.pushAll([
            this.onCursorPositionChangedEmitter,
            this.onSelectionChangedEmitter,
            this.onFocusChangedEmitter,
            this.onDocumentContentChangedEmitter,
            this.onMouseDownEmitter,
            this.onLanguageChangedEmitter,
            this.onScrollChangedEmitter
        ]);
        this.documents.add(document);
        this.autoSizing = options && options.autoSizing !== undefined ? options.autoSizing : false;
        this.minHeight = options && options.minHeight !== undefined ? options.minHeight : -1;
        this.maxHeight = options && options.maxHeight !== undefined ? options.maxHeight : -1;
        this.toDispose.push(this.create(options, override));
        this.addHandlers(this.editor);
    }
    getEncoding() {
        return this.document.getEncoding() || encodings_1.UTF8;
    }
    setEncoding(encoding, mode) {
        return this.document.setEncoding(encoding, mode);
    }
    create(options, override) {
        const combinedOptions = {
            ...options,
            lightbulb: { enabled: true },
            fixedOverflowWidgets: true,
            scrollbar: {
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                ...options === null || options === void 0 ? void 0 : options.scrollbar,
            }
        };
        const instantiator = this.getInstantiatorWithOverrides(override);
        /**
         * @monaco-uplift. Should be guaranteed to work.
         * Incomparable enums prevent TypeScript from believing that public IStandaloneCodeEditor is satisfied by private StandaloneCodeEditor
         */
        return this.editor = instantiator.createInstance(standaloneCodeEditor_1.StandaloneEditor, this.node, combinedOptions);
    }
    getInstantiatorWithOverrides(override) {
        const instantiator = standaloneServices_1.StandaloneServices.initialize({});
        if (override) {
            const overrideServices = new serviceCollection_1.ServiceCollection(...override);
            return instantiator.createChild(overrideServices);
        }
        return instantiator;
    }
    addHandlers(codeEditor) {
        this.toDispose.push(codeEditor.onDidChangeModelLanguage(e => this.fireLanguageChanged(e.newLanguage)));
        this.toDispose.push(codeEditor.onDidChangeConfiguration(() => this.refresh()));
        this.toDispose.push(codeEditor.onDidChangeModel(() => this.refresh()));
        this.toDispose.push(codeEditor.onDidChangeModelContent(e => {
            this.refresh();
            this.onDocumentContentChangedEmitter.fire({ document: this.document, contentChanges: e.changes.map(this.mapModelContentChange.bind(this)) });
        }));
        this.toDispose.push(codeEditor.onDidChangeCursorPosition(() => this.onCursorPositionChangedEmitter.fire(this.cursor)));
        this.toDispose.push(codeEditor.onDidChangeCursorSelection(() => this.onSelectionChangedEmitter.fire(this.selection)));
        this.toDispose.push(codeEditor.onDidFocusEditorText(() => this.onFocusChangedEmitter.fire(this.isFocused())));
        this.toDispose.push(codeEditor.onDidBlurEditorText(() => this.onFocusChangedEmitter.fire(this.isFocused())));
        this.toDispose.push(codeEditor.onMouseDown(e => {
            const { element, position, range } = e.target;
            this.onMouseDownEmitter.fire({
                target: {
                    ...e.target,
                    element: element || undefined,
                    mouseColumn: this.m2p.asPosition(undefined, e.target.mouseColumn).character,
                    range: range && this.m2p.asRange(range) || undefined,
                    position: position && this.m2p.asPosition(position.lineNumber, position.column) || undefined,
                    detail: e.target.detail || {},
                },
                event: e.event.browserEvent
            });
        }));
        this.toDispose.push(codeEditor.onDidScrollChange(e => {
            this.onScrollChangedEmitter.fire(undefined);
        }));
    }
    getVisibleRanges() {
        return this.editor.getVisibleRanges().map(range => this.m2p.asRange(range));
    }
    mapModelContentChange(change) {
        return {
            range: this.m2p.asRange(change.range),
            rangeLength: change.rangeLength,
            text: change.text
        };
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
    get onDocumentContentChanged() {
        return this.onDocumentContentChangedEmitter.event;
    }
    get isReadonly() {
        return this.document.isReadonly();
    }
    get cursor() {
        const { lineNumber, column } = this.editor.getPosition();
        return this.m2p.asPosition(lineNumber, column);
    }
    set cursor(cursor) {
        const position = this.p2m.asPosition(cursor);
        this.editor.setPosition(position);
    }
    get onCursorPositionChanged() {
        return this.onCursorPositionChangedEmitter.event;
    }
    get selection() {
        return this.m2p.asRange(this.editor.getSelection());
    }
    set selection(selection) {
        const range = this.p2m.asRange(selection);
        this.editor.setSelection(range);
    }
    get onSelectionChanged() {
        return this.onSelectionChangedEmitter.event;
    }
    get onScrollChanged() {
        return this.onScrollChangedEmitter.event;
    }
    revealPosition(raw, options = { vertical: 'center' }) {
        const position = this.p2m.asPosition(raw);
        switch (options.vertical) {
            case 'auto':
                this.editor.revealPosition(position);
                break;
            case 'center':
                this.editor.revealPositionInCenter(position);
                break;
            case 'centerIfOutsideViewport':
                this.editor.revealPositionInCenterIfOutsideViewport(position);
                break;
        }
    }
    revealRange(raw, options = { at: 'center' }) {
        const range = this.p2m.asRange(raw);
        switch (options.at) {
            case 'top':
                this.editor.revealRangeAtTop(range);
                break;
            case 'center':
                this.editor.revealRangeInCenter(range);
                break;
            case 'centerIfOutsideViewport':
                this.editor.revealRangeInCenterIfOutsideViewport(range);
                break;
            case 'auto':
                this.editor.revealRange(range);
                break;
        }
    }
    focus() {
        /**
         * `this.editor.focus` forcefully changes the focus editor state,
         * regardless whether the textarea actually received the focus.
         * It could lead to issues like https://github.com/eclipse-theia/theia/issues/7902
         * Instead we focus the underlying textarea.
         */
        const node = this.editor.getDomNode();
        if (node) {
            const textarea = node.querySelector('textarea');
            textarea.focus();
        }
    }
    blur() {
        const node = this.editor.getDomNode();
        if (node) {
            const textarea = node.querySelector('textarea');
            textarea.blur();
        }
    }
    isFocused({ strict } = { strict: false }) {
        if (!this.editor.hasTextFocus()) {
            return false;
        }
        if (strict) {
            return !this.isSuggestWidgetVisible() && !this.isFindWidgetVisible() && !this.isRenameInputVisible();
        }
        return true;
    }
    get onFocusChanged() {
        return this.onFocusChangedEmitter.event;
    }
    get onMouseDown() {
        return this.onMouseDownEmitter.event;
    }
    /**
     * `true` if the suggest widget is visible in the editor. Otherwise, `false`.
     */
    isSuggestWidgetVisible() {
        return this.contextKeyService.match('suggestWidgetVisible', this.editor.getDomNode() || this.node);
    }
    /**
     * `true` if the find (and replace) widget is visible in the editor. Otherwise, `false`.
     */
    isFindWidgetVisible() {
        return this.contextKeyService.match('findWidgetVisible', this.editor.getDomNode() || this.node);
    }
    /**
     * `true` if the name rename refactoring input HTML element is visible. Otherwise, `false`.
     */
    isRenameInputVisible() {
        return this.contextKeyService.match('renameInputVisible', this.editor.getDomNode() || this.node);
    }
    dispose() {
        this.toDispose.dispose();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trigger(source, handlerId, payload) {
        this.editor.trigger(source, handlerId, payload);
    }
    getControl() {
        return this.editor;
    }
    refresh() {
        this.autoresize();
    }
    resizeToFit() {
        this.autoresize();
        // eslint-disable-next-line no-null/no-null
        this.onResizeEmitter.fire(null);
    }
    setSize(dimension) {
        this.resize(dimension);
        this.onResizeEmitter.fire(dimension);
    }
    autoresize() {
        if (this.autoSizing) {
            // eslint-disable-next-line no-null/no-null
            this.resize(null);
        }
    }
    resize(dimension) {
        if (this.node) {
            const layoutSize = this.computeLayoutSize(this.node, dimension);
            this.editor.layout(layoutSize);
        }
    }
    computeLayoutSize(hostNode, dimension) {
        if (dimension && dimension.width >= 0 && dimension.height >= 0) {
            return dimension;
        }
        const boxSizing = domutils_1.ElementExt.boxSizing(hostNode);
        const width = (!dimension || dimension.width < 0) ?
            this.getWidth(hostNode, boxSizing) :
            dimension.width;
        const height = (!dimension || dimension.height < 0) ?
            this.getHeight(hostNode, boxSizing) :
            dimension.height;
        return { width, height };
    }
    getWidth(hostNode, boxSizing) {
        return hostNode.offsetWidth - boxSizing.horizontalSum;
    }
    getHeight(hostNode, boxSizing) {
        if (!this.autoSizing) {
            return hostNode.offsetHeight - boxSizing.verticalSum;
        }
        const lineHeight = this.editor.getOption(monaco.editor.EditorOption.lineHeight);
        const lineCount = this.editor.getModel().getLineCount();
        const contentHeight = lineHeight * lineCount;
        const horizontalScrollbarHeight = this.editor.getLayoutInfo().horizontalScrollbarHeight;
        const editorHeight = contentHeight + horizontalScrollbarHeight;
        if (this.minHeight >= 0) {
            const minHeight = lineHeight * this.minHeight + horizontalScrollbarHeight;
            if (editorHeight < minHeight) {
                return minHeight;
            }
        }
        if (this.maxHeight >= 0) {
            const maxHeight = lineHeight * this.maxHeight + horizontalScrollbarHeight;
            return Math.min(maxHeight, editorHeight);
        }
        return editorHeight;
    }
    isActionSupported(id) {
        const action = this.editor.getAction(id);
        return !!action && action.isSupported();
    }
    async runAction(id) {
        const action = this.editor.getAction(id);
        if (action && action.isSupported()) {
            await action.run();
        }
    }
    deltaDecorations(params) {
        const oldDecorations = params.oldDecorations;
        const newDecorations = this.toDeltaDecorations(params);
        return this.editor.deltaDecorations(oldDecorations, newDecorations);
    }
    toDeltaDecorations(params) {
        return params.newDecorations.map(({ options: theiaOptions, range }) => {
            const options = {
                ...theiaOptions,
                hoverMessage: this.fromStringToMarkdownString(theiaOptions.hoverMessage),
                glyphMarginHoverMessage: this.fromStringToMarkdownString(theiaOptions.glyphMarginHoverMessage)
            };
            return {
                options,
                range: this.p2m.asRange(range),
            };
        });
    }
    fromStringToMarkdownString(hoverMessage) {
        if (typeof hoverMessage === 'string') {
            return { value: hoverMessage };
        }
        return hoverMessage;
    }
    fromMarkdownToString(maybeMarkdown) {
        if (!maybeMarkdown) {
            return undefined;
        }
        if (typeof maybeMarkdown === 'string') {
            return maybeMarkdown;
        }
        if (Array.isArray(maybeMarkdown)) {
            return maybeMarkdown.map(({ value }) => value).join('\n');
        }
        return maybeMarkdown.value;
    }
    getLinesDecorations(startLineNumber, endLineNumber) {
        const toPosition = (line) => this.p2m.asPosition({ line, character: 0 });
        const start = toPosition(startLineNumber).lineNumber;
        const end = toPosition(endLineNumber).lineNumber;
        return this.editor
            .getModel()
            .getLinesDecorations(start, end)
            .map(this.toEditorDecoration.bind(this));
    }
    toEditorDecoration(decoration) {
        const range = this.m2p.asRange(decoration.range);
        const { id, options: monacoOptions } = decoration;
        const options = {
            ...monacoOptions,
            hoverMessage: this.fromMarkdownToString(monacoOptions.hoverMessage),
            glyphMarginHoverMessage: this.fromMarkdownToString(monacoOptions.hoverMessage),
        };
        return {
            options: (0, common_1.nullToUndefined)(options),
            range,
            id
        };
    }
    getVisibleColumn(position) {
        return this.editor.getVisibleColumnFromPosition(this.p2m.asPosition(position));
    }
    async replaceText(params) {
        const edits = params.replaceOperations.map(param => {
            const range = monaco.Range.fromPositions(this.p2m.asPosition(param.range.start), this.p2m.asPosition(param.range.end));
            return {
                forceMoveMarkers: true,
                identifier: {
                    major: range.startLineNumber,
                    minor: range.startColumn
                },
                range,
                text: param.text
            };
        });
        return this.editor.executeEdits(params.source, edits);
    }
    executeEdits(edits) {
        return this.editor.executeEdits('MonacoEditor', this.p2m.asTextEdits(edits));
    }
    storeViewState() {
        return this.editor.saveViewState();
    }
    restoreViewState(state) {
        this.editor.restoreViewState(state);
    }
    get languageAutoDetected() {
        return this._languageAutoDetected;
    }
    async detectLanguage() {
        const languageService = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
        const firstLine = this.document.textEditorModel.getLineContent(1);
        const model = this.getControl().getModel();
        const language = languageService.createByFilepathOrFirstLine(model && model.uri, firstLine);
        this.setLanguage(language.languageId);
        this._languageAutoDetected = true;
    }
    setLanguage(languageId) {
        for (const document of this.documents) {
            monaco.editor.setModelLanguage(document.textEditorModel, languageId);
        }
    }
    fireLanguageChanged(languageId) {
        this._languageAutoDetected = false;
        this.onLanguageChangedEmitter.fire(languageId);
    }
    getResourceUri() {
        return this.uri;
    }
    createMoveToUri(resourceUri) {
        return this.uri.withPath(resourceUri.path);
    }
}
exports.MonacoEditor = MonacoEditor;
(function (MonacoEditor) {
    function getAll(manager) {
        return manager.all.map(e => get(e)).filter(e => !!e);
    }
    MonacoEditor.getAll = getAll;
    function getCurrent(manager) {
        return get(manager.currentEditor);
    }
    MonacoEditor.getCurrent = getCurrent;
    function getActive(manager) {
        return get(manager.activeEditor);
    }
    MonacoEditor.getActive = getActive;
    function get(editorWidget) {
        if (editorWidget && editorWidget.editor instanceof MonacoEditor) {
            return editorWidget.editor;
        }
        return undefined;
    }
    MonacoEditor.get = get;
    function findByDocument(manager, document) {
        return getAll(manager).filter(candidate => candidate.documents.has(document));
    }
    MonacoEditor.findByDocument = findByDocument;
    function getWidgetFor(manager, control) {
        if (!control) {
            return undefined;
        }
        return manager.all.find(widget => {
            const candidate = get(widget);
            return candidate && candidate.getControl() === control;
        });
    }
    MonacoEditor.getWidgetFor = getWidgetFor;
})(MonacoEditor = exports.MonacoEditor || (exports.MonacoEditor = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-editor'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-text-model-service.js":
/*!**********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-text-model-service.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoTextModelService = exports.MonacoEditorModelFactory = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_editor_model_1 = __webpack_require__(/*! ./monaco-editor-model */ "../../packages/monaco/lib/browser/monaco-editor-model.js");
const monaco_to_protocol_converter_1 = __webpack_require__(/*! ./monaco-to-protocol-converter */ "../../packages/monaco/lib/browser/monaco-to-protocol-converter.js");
const protocol_to_monaco_converter_1 = __webpack_require__(/*! ./protocol-to-monaco-converter */ "../../packages/monaco/lib/browser/protocol-to-monaco-converter.js");
const logger_1 = __webpack_require__(/*! @theia/core/lib/common/logger */ "../../packages/core/lib/common/logger.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const textResourceConfiguration_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/textResourceConfiguration */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/textResourceConfiguration.js");
exports.MonacoEditorModelFactory = Symbol('MonacoEditorModelFactory');
let MonacoTextModelService = class MonacoTextModelService {
    constructor() {
        /**
         * This component does some asynchronous work before being fully initialized.
         *
         * @deprecated since 1.25.0. Is instantly resolved.
         */
        this.ready = Promise.resolve();
        this._models = new core_1.ReferenceCollection(uri => this.loadModel(new uri_1.default(uri)));
        this.modelOptions = {
            'editor.tabSize': 'tabSize',
            'editor.insertSpaces': 'insertSpaces'
        };
    }
    init() {
        const resourcePropertiesService = standaloneServices_1.StandaloneServices.get(textResourceConfiguration_1.ITextResourcePropertiesService);
        if (resourcePropertiesService) {
            resourcePropertiesService.getEOL = () => {
                const eol = this.editorPreferences['files.eol'];
                if (eol && eol !== 'auto') {
                    return eol;
                }
                return core_1.OS.backend.EOL;
            };
        }
    }
    get models() {
        return this._models.values();
    }
    get(uri) {
        return this._models.get(uri);
    }
    get onDidCreate() {
        return this._models.onDidCreate;
    }
    createModelReference(raw) {
        return this._models.acquire(raw.toString());
    }
    async loadModel(uri) {
        await this.editorPreferences.ready;
        const resource = await this.resourceProvider(uri);
        const model = await (await this.createModel(resource)).load();
        this.updateModel(model);
        model.textEditorModel.onDidChangeLanguage(() => this.updateModel(model));
        const disposable = this.editorPreferences.onPreferenceChanged(change => this.updateModel(model, change));
        model.onDispose(() => disposable.dispose());
        return model;
    }
    createModel(resource) {
        const factory = this.factories.getContributions().find(({ scheme }) => resource.uri.scheme === scheme);
        return factory ? factory.createModel(resource) : new monaco_editor_model_1.MonacoEditorModel(resource, this.m2p, this.p2m, this.logger, this.editorPreferences);
    }
    toModelOption(editorPreference) {
        switch (editorPreference) {
            case 'editor.tabSize': return 'tabSize';
            case 'editor.insertSpaces': return 'insertSpaces';
            case 'editor.bracketPairColorization.enabled':
            case 'editor.bracketPairColorization.independentColorPoolPerBracketType':
                return 'bracketColorizationOptions';
            case 'editor.trimAutoWhitespace': return 'trimAutoWhitespace';
        }
        return undefined;
    }
    updateModel(model, change) {
        if (!change) {
            model.autoSave = this.editorPreferences.get('files.autoSave', undefined, model.uri);
            model.autoSaveDelay = this.editorPreferences.get('files.autoSaveDelay', undefined, model.uri);
            model.textEditorModel.updateOptions(this.getModelOptions(model));
        }
        else if (change.affects(model.uri, model.languageId)) {
            if (change.preferenceName === 'files.autoSave') {
                model.autoSave = this.editorPreferences.get('files.autoSave', undefined, model.uri);
            }
            if (change.preferenceName === 'files.autoSaveDelay') {
                model.autoSaveDelay = this.editorPreferences.get('files.autoSaveDelay', undefined, model.uri);
            }
            const modelOption = this.toModelOption(change.preferenceName);
            if (modelOption) {
                model.textEditorModel.updateOptions(this.getModelOptions(model));
            }
        }
    }
    getModelOptions(arg) {
        const uri = typeof arg === 'string' ? arg : arg.uri;
        const overrideIdentifier = typeof arg === 'string' ? undefined : arg.languageId;
        return {
            tabSize: this.editorPreferences.get({ preferenceName: 'editor.tabSize', overrideIdentifier }, undefined, uri),
            insertSpaces: this.editorPreferences.get({ preferenceName: 'editor.insertSpaces', overrideIdentifier }, undefined, uri),
            bracketColorizationOptions: {
                enabled: this.editorPreferences.get({ preferenceName: 'editor.bracketPairColorization.enabled', overrideIdentifier }, undefined, uri),
                independentColorPoolPerBracketType: this.editorPreferences.get({ preferenceName: 'editor.bracketPairColorization.independentColorPoolPerBracketType', overrideIdentifier }, undefined, uri),
            },
            trimAutoWhitespace: this.editorPreferences.get({ preferenceName: 'editor.trimAutoWhitespace', overrideIdentifier }, undefined, uri),
        };
    }
    registerTextModelContentProvider(scheme, provider) {
        return {
            dispose() {
                // no-op
            }
        };
    }
    canHandleResource(resource) {
        return this.fileService.canHandleResource(new uri_1.default(resource));
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ResourceProvider),
    __metadata("design:type", Function)
], MonacoTextModelService.prototype, "resourceProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.EditorPreferences),
    __metadata("design:type", Object)
], MonacoTextModelService.prototype, "editorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter),
    __metadata("design:type", monaco_to_protocol_converter_1.MonacoToProtocolConverter)
], MonacoTextModelService.prototype, "m2p", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], MonacoTextModelService.prototype, "p2m", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(exports.MonacoEditorModelFactory),
    __metadata("design:type", Object)
], MonacoTextModelService.prototype, "factories", void 0);
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], MonacoTextModelService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MonacoTextModelService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoTextModelService.prototype, "init", null);
MonacoTextModelService = __decorate([
    (0, inversify_1.injectable)()
], MonacoTextModelService);
exports.MonacoTextModelService = MonacoTextModelService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-text-model-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-to-protocol-converter.js":
/*!*************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-to-protocol-converter.js ***!
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
exports.MonacoToProtocolConverter = exports.MonacoRangeReplace = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
;
var MonacoRangeReplace;
(function (MonacoRangeReplace) {
    function is(v) {
        return v.insert !== undefined;
    }
    MonacoRangeReplace.is = is;
})(MonacoRangeReplace = exports.MonacoRangeReplace || (exports.MonacoRangeReplace = {}));
let MonacoToProtocolConverter = class MonacoToProtocolConverter {
    asPosition(lineNumber, column) {
        const line = typeof lineNumber !== 'number' ? undefined : lineNumber - 1;
        const character = typeof column !== 'number' ? undefined : column - 1;
        return {
            line, character
        };
    }
    asRange(range) {
        if (range === undefined) {
            return undefined;
        }
        if (MonacoRangeReplace.is(range)) {
            return this.asRange(range.insert);
        }
        else {
            const start = this.asPosition(range.startLineNumber, range.startColumn);
            const end = this.asPosition(range.endLineNumber, range.endColumn);
            return {
                start, end
            };
        }
    }
};
MonacoToProtocolConverter = __decorate([
    (0, inversify_1.injectable)()
], MonacoToProtocolConverter);
exports.MonacoToProtocolConverter = MonacoToProtocolConverter;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-to-protocol-converter'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-workspace.js":
/*!*************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-workspace.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoWorkspace = exports.ResourceTextEdit = exports.ResourceFileEdit = exports.WorkspaceTextEdit = exports.WorkspaceFileEdit = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_text_model_service_1 = __webpack_require__(/*! ./monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const browser_3 = __webpack_require__(/*! @theia/markers/lib/browser */ "../../packages/markers/lib/browser/index.js");
const types_1 = __webpack_require__(/*! @theia/core/lib/common/types */ "../../packages/core/lib/common/types.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const bulkEditService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService.js");
const editorWorker_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/editorWorker */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/editorWorker.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const snippetParser_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/contrib/snippet/browser/snippetParser */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/contrib/snippet/browser/snippetParser.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
var WorkspaceFileEdit;
(function (WorkspaceFileEdit) {
    function is(arg) {
        return ('oldResource' in arg && monaco.Uri.isUri(arg.oldResource)) ||
            ('newResource' in arg && monaco.Uri.isUri(arg.newResource));
    }
    WorkspaceFileEdit.is = is;
})(WorkspaceFileEdit = exports.WorkspaceFileEdit || (exports.WorkspaceFileEdit = {}));
var WorkspaceTextEdit;
(function (WorkspaceTextEdit) {
    function is(arg) {
        return (0, common_1.isObject)(arg)
            && monaco.Uri.isUri(arg.resource)
            && (0, common_1.isObject)(arg.textEdit);
    }
    WorkspaceTextEdit.is = is;
})(WorkspaceTextEdit = exports.WorkspaceTextEdit || (exports.WorkspaceTextEdit = {}));
var ResourceFileEdit;
(function (ResourceFileEdit) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && (monaco.Uri.isUri(arg.oldResource) || monaco.Uri.isUri(arg.newResource));
    }
    ResourceFileEdit.is = is;
})(ResourceFileEdit = exports.ResourceFileEdit || (exports.ResourceFileEdit = {}));
var ResourceTextEdit;
(function (ResourceTextEdit) {
    function is(arg) {
        return ('resource' in arg && monaco.Uri.isUri(arg.resource));
    }
    ResourceTextEdit.is = is;
})(ResourceTextEdit = exports.ResourceTextEdit || (exports.ResourceTextEdit = {}));
let MonacoWorkspace = class MonacoWorkspace {
    constructor() {
        this.ready = new Promise(resolve => {
            this.resolveReady = resolve;
        });
        this.onDidOpenTextDocumentEmitter = new event_1.Emitter();
        this.onDidOpenTextDocument = this.onDidOpenTextDocumentEmitter.event;
        this.onDidCloseTextDocumentEmitter = new event_1.Emitter();
        this.onDidCloseTextDocument = this.onDidCloseTextDocumentEmitter.event;
        this.onDidChangeTextDocumentEmitter = new event_1.Emitter();
        this.onDidChangeTextDocument = this.onDidChangeTextDocumentEmitter.event;
        this.onWillSaveTextDocumentEmitter = new event_1.Emitter();
        this.onWillSaveTextDocument = this.onWillSaveTextDocumentEmitter.event;
        this.onDidSaveTextDocumentEmitter = new event_1.Emitter();
        this.onDidSaveTextDocument = this.onDidSaveTextDocumentEmitter.event;
        this.suppressedOpenIfDirty = [];
    }
    init() {
        this.resolveReady();
        for (const model of this.textModelService.models) {
            this.fireDidOpen(model);
        }
        this.textModelService.onDidCreate(model => this.fireDidOpen(model));
    }
    get textDocuments() {
        return this.textModelService.models;
    }
    getTextDocument(uri) {
        return this.textModelService.get(uri);
    }
    fireDidOpen(model) {
        this.doFireDidOpen(model);
        model.textEditorModel.onDidChangeLanguage(e => {
            this.problems.cleanAllMarkers(new uri_1.default(model.uri));
            model.setLanguageId(e.oldLanguage);
            try {
                this.fireDidClose(model);
            }
            finally {
                model.setLanguageId(undefined);
            }
            this.doFireDidOpen(model);
        });
        model.onDidChangeContent(event => this.fireDidChangeContent(event));
        model.onDidSaveModel(() => this.fireDidSave(model));
        model.onWillSaveModel(event => this.fireWillSave(event));
        model.onDirtyChanged(() => this.openEditorIfDirty(model));
        model.onDispose(() => this.fireDidClose(model));
    }
    doFireDidOpen(model) {
        this.onDidOpenTextDocumentEmitter.fire(model);
    }
    fireDidClose(model) {
        this.onDidCloseTextDocumentEmitter.fire(model);
    }
    fireDidChangeContent(event) {
        this.onDidChangeTextDocumentEmitter.fire(event);
    }
    fireWillSave(event) {
        this.onWillSaveTextDocumentEmitter.fire(event);
    }
    fireDidSave(model) {
        this.onDidSaveTextDocumentEmitter.fire(model);
    }
    openEditorIfDirty(model) {
        if (model.suppressOpenEditorWhenDirty || this.suppressedOpenIfDirty.indexOf(model) !== -1) {
            return;
        }
        if (model.dirty && monaco_editor_1.MonacoEditor.findByDocument(this.editorManager, model).length === 0) {
            // create a new reference to make sure the model is not disposed before it is
            // acquired by the editor, thus losing the changes that made it dirty.
            this.textModelService.createModelReference(model.textEditorModel.uri).then(ref => {
                (model.autoSave !== 'off' ? new Promise(resolve => model.onDidSaveModel(resolve)) :
                    this.editorManager.open(new uri_1.default(model.uri), { mode: 'open' })).then(() => ref.dispose());
            });
        }
    }
    async suppressOpenIfDirty(model, cb) {
        this.suppressedOpenIfDirty.push(model);
        try {
            await cb();
        }
        finally {
            const i = this.suppressedOpenIfDirty.indexOf(model);
            if (i !== -1) {
                this.suppressedOpenIfDirty.splice(i, 1);
            }
        }
    }
    /**
     * Applies given edits to the given model.
     * The model is saved if no editors is opened for it.
     */
    applyBackgroundEdit(model, editOperations, shouldSave = true) {
        return this.suppressOpenIfDirty(model, async () => {
            const editor = monaco_editor_1.MonacoEditor.findByDocument(this.editorManager, model)[0];
            const cursorState = editor && editor.getControl().getSelections() || [];
            model.textEditorModel.pushStackElement();
            model.textEditorModel.pushEditOperations(cursorState, editOperations, () => cursorState);
            model.textEditorModel.pushStackElement();
            if (!editor && shouldSave) {
                await model.save();
            }
        });
    }
    async applyBulkEdit(edits, options) {
        try {
            let totalEdits = 0;
            let totalFiles = 0;
            const fileEdits = edits.filter(edit => edit instanceof bulkEditService_1.ResourceFileEdit);
            const [snippetEdits, textEdits] = types_1.ArrayUtils.partition(edits.filter(edit => edit instanceof bulkEditService_1.ResourceTextEdit), edit => { var _a, _b; return edit.textEdit.insertAsSnippet && (edit.resource.toString() === ((_b = (_a = this.editorManager.activeEditor) === null || _a === void 0 ? void 0 : _a.getResourceUri()) === null || _b === void 0 ? void 0 : _b.toString())); });
            if (fileEdits.length > 0) {
                await this.performFileEdits(fileEdits);
            }
            if (textEdits.length > 0) {
                const result = await this.performTextEdits(textEdits);
                totalEdits += result.totalEdits;
                totalFiles += result.totalFiles;
            }
            if (snippetEdits.length > 0) {
                await this.performSnippetEdits(snippetEdits);
            }
            // when enabled (option AND setting) loop over all dirty working copies and trigger save
            // for those that were involved in this bulk edit operation.
            const resources = new Set(edits
                .filter((edit) => edit instanceof bulkEditService_1.ResourceTextEdit)
                .map(edit => edit.resource.toString()));
            if (resources.size > 0 && (options === null || options === void 0 ? void 0 : options.respectAutoSaveConfig) && this.editorPreferences.get('files.refactoring.autoSave') === true) {
                await this.saveAll(resources);
            }
            const ariaSummary = this.getAriaSummary(totalEdits, totalFiles);
            return { ariaSummary, success: true };
        }
        catch (e) {
            console.error('Failed to apply Resource edits:', e);
            return {
                ariaSummary: `Error applying Resource edits: ${e.toString()}`,
                success: false
            };
        }
    }
    async saveAll(resources) {
        await Promise.all(Array.from(resources.values()).map(uri => { var _a; return (_a = this.textModelService.get(uri)) === null || _a === void 0 ? void 0 : _a.save(); }));
    }
    getAriaSummary(totalEdits, totalFiles) {
        if (totalEdits === 0) {
            return common_1.nls.localizeByDefault('Made no edits');
        }
        if (totalEdits > 1 && totalFiles > 1) {
            return common_1.nls.localizeByDefault('Made {0} text edits in {1} files', totalEdits, totalFiles);
        }
        return common_1.nls.localizeByDefault('Made {0} text edits in one file', totalEdits);
    }
    async performTextEdits(edits) {
        let totalEdits = 0;
        let totalFiles = 0;
        const resourceEdits = new Map();
        for (const edit of edits) {
            if (typeof edit.versionId === 'number') {
                const model = this.textModelService.get(edit.resource.toString());
                if (model && model.textEditorModel.getVersionId() !== edit.versionId) {
                    throw new Error(`${model.uri} has changed in the meantime`);
                }
            }
            const key = edit.resource.toString();
            let array = resourceEdits.get(key);
            if (!array) {
                array = [];
                resourceEdits.set(key, array);
            }
            array.push(edit);
        }
        const pending = [];
        for (const [key, value] of resourceEdits) {
            pending.push((async () => {
                var _a;
                const uri = monaco.Uri.parse(key);
                let eol;
                const editOperations = [];
                const minimalEdits = await standaloneServices_1.StandaloneServices.get(editorWorker_1.IEditorWorkerService)
                    .computeMoreMinimalEdits(uri, value.map(edit => this.transformSnippetStringToInsertText(edit)));
                if (minimalEdits) {
                    for (const textEdit of minimalEdits) {
                        if (typeof textEdit.eol === 'number') {
                            eol = textEdit.eol;
                        }
                        if (monaco.Range.isEmpty(textEdit.range) && !textEdit.text) {
                            // skip no-op
                            continue;
                        }
                        editOperations.push({
                            forceMoveMarkers: false,
                            range: monaco.Range.lift(textEdit.range),
                            text: textEdit.text
                        });
                    }
                }
                if (!editOperations.length && eol === undefined) {
                    return;
                }
                const reference = await this.textModelService.createModelReference(uri);
                try {
                    const document = reference.object;
                    const model = document.textEditorModel;
                    const editor = monaco_editor_1.MonacoEditor.findByDocument(this.editorManager, document)[0];
                    const cursorState = (_a = editor === null || editor === void 0 ? void 0 : editor.getControl().getSelections()) !== null && _a !== void 0 ? _a : [];
                    // start a fresh operation
                    model.pushStackElement();
                    if (editOperations.length) {
                        model.pushEditOperations(cursorState, editOperations, () => cursorState);
                    }
                    if (eol !== undefined) {
                        model.pushEOL(eol);
                    }
                    // push again to make this change an undoable operation
                    model.pushStackElement();
                    totalFiles += 1;
                    totalEdits += editOperations.length;
                }
                finally {
                    reference.dispose();
                }
            })());
        }
        await Promise.all(pending);
        return { totalEdits, totalFiles };
    }
    async performFileEdits(edits) {
        for (const edit of edits) {
            const options = edit.options || {};
            if (edit.newResource && edit.oldResource) {
                // rename
                if (options.overwrite === undefined && options.ignoreIfExists && await this.fileService.exists(new uri_1.default(edit.newResource))) {
                    return; // not overwriting, but ignoring, and the target file exists
                }
                await this.fileService.move(new uri_1.default(edit.oldResource), new uri_1.default(edit.newResource), { overwrite: options.overwrite });
            }
            else if (!edit.newResource && edit.oldResource) {
                // delete file
                if (await this.fileService.exists(new uri_1.default(edit.oldResource))) {
                    let useTrash = this.filePreferences['files.enableTrash'];
                    if (useTrash && !(this.fileService.hasCapability(new uri_1.default(edit.oldResource), 4096 /* Trash */))) {
                        useTrash = false; // not supported by provider
                    }
                    await this.fileService.delete(new uri_1.default(edit.oldResource), { useTrash, recursive: options.recursive });
                }
                else if (!options.ignoreIfNotExists) {
                    throw new Error(`${edit.oldResource} does not exist and can not be deleted`);
                }
            }
            else if (edit.newResource && !edit.oldResource) {
                // create file
                if (options.overwrite === undefined && options.ignoreIfExists && await this.fileService.exists(new uri_1.default(edit.newResource))) {
                    return; // not overwriting, but ignoring, and the target file exists
                }
                await this.fileService.create(new uri_1.default(edit.newResource), undefined, { overwrite: options.overwrite });
            }
        }
    }
    async performSnippetEdits(edits) {
        var _a;
        const activeEditor = (_a = monaco_editor_1.MonacoEditor.getActive(this.editorManager)) === null || _a === void 0 ? void 0 : _a.getControl();
        if (activeEditor) {
            const snippetController = activeEditor.getContribution('snippetController2');
            snippetController.apply(edits.map(edit => ({ range: monaco.Range.lift(edit.textEdit.range), template: edit.textEdit.text })));
        }
    }
    transformSnippetStringToInsertText(resourceEdit) {
        if (resourceEdit.textEdit.insertAsSnippet) {
            return { ...resourceEdit.textEdit, insertAsSnippet: false, text: snippetParser_1.SnippetParser.asInsertText(resourceEdit.textEdit.text) };
        }
        else {
            return resourceEdit.textEdit;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MonacoWorkspace.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.FileSystemPreferences),
    __metadata("design:type", Object)
], MonacoWorkspace.prototype, "filePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorPreferences),
    __metadata("design:type", Object)
], MonacoWorkspace.prototype, "editorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], MonacoWorkspace.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], MonacoWorkspace.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.ProblemManager),
    __metadata("design:type", browser_3.ProblemManager)
], MonacoWorkspace.prototype, "problems", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoWorkspace.prototype, "init", null);
MonacoWorkspace = __decorate([
    (0, inversify_1.injectable)()
], MonacoWorkspace);
exports.MonacoWorkspace = MonacoWorkspace;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-workspace'] = this;


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


/***/ })

}]);
//# sourceMappingURL=packages_monaco_lib_browser_monaco-workspace_js.js.map