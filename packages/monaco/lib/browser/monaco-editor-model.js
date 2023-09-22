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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoEditorModel = exports.TextDocumentSaveReason = void 0;
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
Object.defineProperty(exports, "TextDocumentSaveReason", { enumerable: true, get: function () { return vscode_languageserver_protocol_1.TextDocumentSaveReason; } });
const disposable_1 = require("@theia/core/lib/common/disposable");
const event_1 = require("@theia/core/lib/common/event");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const resource_1 = require("@theia/core/lib/common/resource");
const monaco = require("@theia/monaco-editor-core");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const language_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/languages/language");
const model_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/model");
const textModel_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/model/textModel");
const editor_generated_preference_schema_1 = require("@theia/editor/lib/browser/editor-generated-preference-schema");
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
//# sourceMappingURL=monaco-editor-model.js.map