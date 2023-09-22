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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputChannel = exports.OutputChannelSeverity = exports.OutputChannelManager = void 0;
const PQueue = require("p-queue");
const inversify_1 = require("@theia/core/shared/inversify");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const core_1 = require("@theia/core");
const monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
const output_uri_1 = require("../common/output-uri");
const output_resource_1 = require("../browser/output-resource");
const output_preferences_1 = require("./output-preferences");
const monaco = require("@theia/monaco-editor-core");
let OutputChannelManager = class OutputChannelManager {
    constructor() {
        this.channels = new Map();
        this.resources = new Map();
        this.channelAddedEmitter = new core_1.Emitter();
        this.channelDeletedEmitter = new core_1.Emitter();
        this.channelWasShownEmitter = new core_1.Emitter();
        this.channelWasHiddenEmitter = new core_1.Emitter();
        this.selectedChannelChangedEmitter = new core_1.Emitter();
        this.onChannelAdded = this.channelAddedEmitter.event;
        this.onChannelDeleted = this.channelDeletedEmitter.event;
        this.onChannelWasShown = this.channelWasShownEmitter.event;
        this.onChannelWasHidden = this.channelWasHiddenEmitter.event;
        this.onSelectedChannelChanged = this.selectedChannelChangedEmitter.event;
        this.toDispose = new core_1.DisposableCollection();
        this.toDisposeOnChannelDeletion = new Map();
    }
    getChannel(name) {
        const existing = this.channels.get(name);
        if (existing) {
            return existing;
        }
        // We have to register the resource first, because `textModelService#createModelReference` will require it
        // right after creating the monaco.editor.ITextModel.
        // All `append` and `appendLine` will be deferred until the underlying text-model instantiation.
        let resource = this.resources.get(name);
        if (!resource) {
            const uri = output_uri_1.OutputUri.create(name);
            const editorModelRef = new promise_util_1.Deferred();
            resource = this.createResource({ uri, editorModelRef });
            this.resources.set(name, resource);
            this.textModelService.createModelReference(uri).then(ref => editorModelRef.resolve(ref));
        }
        const channel = this.createChannel(resource);
        this.channels.set(name, channel);
        this.toDisposeOnChannelDeletion.set(name, this.registerListeners(channel));
        this.channelAddedEmitter.fire(channel);
        if (!this.selectedChannel) {
            this.selectedChannel = channel;
        }
        return channel;
    }
    registerListeners(channel) {
        const { name } = channel;
        return new core_1.DisposableCollection(channel, channel.onVisibilityChange(({ isVisible, preserveFocus }) => {
            if (isVisible) {
                this.selectedChannel = channel;
                this.channelWasShownEmitter.fire({ name, preserveFocus });
            }
            else {
                if (channel === this.selectedChannel) {
                    this.selectedChannel = this.getVisibleChannels()[0];
                }
                this.channelWasHiddenEmitter.fire({ name });
            }
        }), channel.onDisposed(() => this.deleteChannel(name)), core_1.Disposable.create(() => {
            const resource = this.resources.get(name);
            if (resource) {
                resource.dispose();
                this.resources.delete(name);
            }
            else {
                console.warn(`Could not dispose. No resource was for output channel: '${name}'.`);
            }
        }), core_1.Disposable.create(() => {
            const toDispose = this.channels.get(name);
            if (!toDispose) {
                console.warn(`Could not dispose. No channel exist with name: '${name}'.`);
                return;
            }
            this.channels.delete(name);
            toDispose.dispose();
            this.channelDeletedEmitter.fire({ name });
            if (this.selectedChannel && this.selectedChannel.name === name) {
                this.selectedChannel = this.getVisibleChannels()[0];
            }
        }));
    }
    deleteChannel(name) {
        const toDispose = this.toDisposeOnChannelDeletion.get(name);
        if (toDispose) {
            toDispose.dispose();
        }
    }
    getChannels() {
        return Array.from(this.channels.values()).sort(this.channelComparator);
    }
    getVisibleChannels() {
        return this.getChannels().filter(channel => channel.isVisible);
    }
    get channelComparator() {
        return (left, right) => {
            if (left.isVisible !== right.isVisible) {
                return left.isVisible ? -1 : 1;
            }
            return left.name.toLocaleLowerCase().localeCompare(right.name.toLocaleLowerCase());
        };
    }
    dispose() {
        this.toDispose.dispose();
    }
    get selectedChannel() {
        return this._selectedChannel;
    }
    set selectedChannel(channel) {
        this._selectedChannel = channel;
        if (this._selectedChannel) {
            this.selectedChannelChangedEmitter.fire({ name: this._selectedChannel.name });
        }
        else {
            this.selectedChannelChangedEmitter.fire(undefined);
        }
    }
    /**
     * Non-API: do not call directly.
     */
    async resolve(uri) {
        if (!output_uri_1.OutputUri.is(uri)) {
            throw new Error(`Expected '${output_uri_1.OutputUri.SCHEME}' URI scheme. Got: ${uri} instead.`);
        }
        const resource = this.resources.get(output_uri_1.OutputUri.channelName(uri));
        if (!resource) {
            throw new Error(`No output resource was registered with URI: ${uri.toString()}`);
        }
        return resource;
    }
    createResource({ uri, editorModelRef }) {
        return new output_resource_1.OutputResource(uri, editorModelRef);
    }
    createChannel(resource) {
        return new OutputChannel(resource, this.preferences);
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], OutputChannelManager.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(output_preferences_1.OutputPreferences),
    __metadata("design:type", Object)
], OutputChannelManager.prototype, "preferences", void 0);
OutputChannelManager = __decorate([
    (0, inversify_1.injectable)()
], OutputChannelManager);
exports.OutputChannelManager = OutputChannelManager;
var OutputChannelSeverity;
(function (OutputChannelSeverity) {
    OutputChannelSeverity[OutputChannelSeverity["Error"] = 1] = "Error";
    OutputChannelSeverity[OutputChannelSeverity["Warning"] = 2] = "Warning";
    OutputChannelSeverity[OutputChannelSeverity["Info"] = 3] = "Info";
})(OutputChannelSeverity = exports.OutputChannelSeverity || (exports.OutputChannelSeverity = {}));
class OutputChannel {
    constructor(resource, preferences) {
        this.resource = resource;
        this.preferences = preferences;
        this.contentChangeEmitter = new core_1.Emitter();
        this.visibilityChangeEmitter = new core_1.Emitter();
        this.disposedEmitter = new core_1.Emitter();
        this.textModifyQueue = new PQueue({ autoStart: true, concurrency: 1 });
        this.toDispose = new core_1.DisposableCollection(core_1.Disposable.create(() => this.textModifyQueue.clear()), this.contentChangeEmitter, this.visibilityChangeEmitter, this.disposedEmitter);
        this.disposed = false;
        this.visible = true;
        this.decorationIds = new Set();
        this.onVisibilityChange = this.visibilityChangeEmitter.event;
        this.onContentChange = this.contentChangeEmitter.event;
        this.onDisposed = this.disposedEmitter.event;
        this._maxLineNumber = this.preferences['output.maxChannelHistory'];
        this.toDispose.push(resource);
        this.toDispose.push(core_1.Disposable.create(() => this.decorationIds.clear()));
        this.toDispose.push(this.preferences.onPreferenceChanged(event => {
            if (event.preferenceName === 'output.maxChannelHistory') {
                const maxLineNumber = event.newValue;
                if (this.maxLineNumber !== maxLineNumber) {
                    this.maxLineNumber = maxLineNumber;
                }
            }
        }));
    }
    get name() {
        return output_uri_1.OutputUri.channelName(this.uri);
    }
    get uri() {
        return this.resource.uri;
    }
    hide() {
        this.visible = false;
        this.visibilityChangeEmitter.fire({ isVisible: this.isVisible });
    }
    /**
     * If `preserveFocus` is `true`, the channel will not take focus. It is `false` by default.
     *  - Calling `show` without args or with `preserveFocus: false` will reveal **and** activate the `Output` widget.
     *  - Calling `show` with `preserveFocus: true` will reveal the `Output` widget but **won't** activate it.
     */
    show({ preserveFocus } = { preserveFocus: false }) {
        this.visible = true;
        this.visibilityChangeEmitter.fire({ isVisible: this.isVisible, preserveFocus });
    }
    /**
     * Note: if `false` it does not meant it is disposed or not available, it is only hidden from the UI.
     */
    get isVisible() {
        return this.visible;
    }
    clear() {
        this.textModifyQueue.add(async () => {
            const textModel = (await this.resource.editorModelRef.promise).object.textEditorModel;
            textModel.deltaDecorations(Array.from(this.decorationIds), []);
            this.decorationIds.clear();
            textModel.setValue('');
            this.contentChangeEmitter.fire();
        });
    }
    dispose() {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        this.toDispose.dispose();
        this.disposedEmitter.fire();
    }
    append(content, severity = OutputChannelSeverity.Info) {
        this.textModifyQueue.add(() => this.doAppend({ content, severity }));
    }
    appendLine(content, severity = OutputChannelSeverity.Info) {
        this.textModifyQueue.add(() => this.doAppend({ content, severity, appendEol: true }));
    }
    async doAppend({ content, severity, appendEol }) {
        const textModel = (await this.resource.editorModelRef.promise).object.textEditorModel;
        const lastLine = textModel.getLineCount();
        const lastLineMaxColumn = textModel.getLineMaxColumn(lastLine);
        const position = new monaco.Position(lastLine, lastLineMaxColumn);
        const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
        const edits = [{
                range,
                text: !!appendEol ? `${content}${textModel.getEOL()}` : content,
                forceMoveMarkers: true
            }];
        // We do not use `pushEditOperations` as we do not need undo/redo support. VS Code uses `applyEdits` too.
        // https://github.com/microsoft/vscode/blob/dc348340fd1a6c583cb63a1e7e6b4fd657e01e01/src/vs/workbench/services/output/common/outputChannelModel.ts#L108-L115
        textModel.applyEdits(edits);
        if (severity !== OutputChannelSeverity.Info) {
            const inlineClassName = severity === OutputChannelSeverity.Error ? 'theia-output-error' : 'theia-output-warning';
            let endLineNumber = textModel.getLineCount();
            // If last line is empty (the first non-whitespace is 0), apply decorator to previous line's last non-whitespace instead
            // Note: if the user appends `inlineWarning `, the new decorator's range includes the trailing whitespace.
            if (!textModel.getLineFirstNonWhitespaceColumn(endLineNumber)) {
                endLineNumber--;
            }
            const endColumn = textModel.getLineLastNonWhitespaceColumn(endLineNumber);
            const newDecorations = [{
                    range: new monaco.Range(range.startLineNumber, range.startColumn, endLineNumber, endColumn), options: {
                        inlineClassName
                    }
                }];
            for (const decorationId of textModel.deltaDecorations([], newDecorations)) {
                this.decorationIds.add(decorationId);
            }
        }
        this.ensureMaxChannelHistory(textModel);
        this.contentChangeEmitter.fire();
    }
    ensureMaxChannelHistory(textModel) {
        this.contentChangeEmitter.fire();
        const linesToRemove = textModel.getLineCount() - this.maxLineNumber - 1; // -1 as the last line is usually empty -> `appendLine`.
        if (linesToRemove > 0) {
            const endColumn = textModel.getLineMaxColumn(linesToRemove);
            // `endLineNumber` is `linesToRemove` + 1 as monaco is one based.
            const range = new monaco.Range(1, 1, linesToRemove, endColumn + 1);
            // eslint-disable-next-line no-null/no-null
            const text = null;
            const decorationsToRemove = textModel.getLinesDecorations(range.startLineNumber, range.endLineNumber)
                .filter(({ id }) => this.decorationIds.has(id)).map(({ id }) => id); // Do we need to filter here? Who else can put decorations to the output model?
            if (decorationsToRemove.length) {
                for (const newId of textModel.deltaDecorations(decorationsToRemove, [])) {
                    this.decorationIds.add(newId);
                }
                for (const toRemoveId of decorationsToRemove) {
                    this.decorationIds.delete(toRemoveId);
                }
            }
            textModel.applyEdits([
                {
                    range: new monaco.Range(1, 1, linesToRemove + 1, textModel.getLineFirstNonWhitespaceColumn(linesToRemove + 1)),
                    text,
                    forceMoveMarkers: true
                }
            ]);
        }
    }
    get maxLineNumber() {
        return this._maxLineNumber;
    }
    set maxLineNumber(maxLineNumber) {
        this._maxLineNumber = maxLineNumber;
        this.append(''); // will trigger an `ensureMaxChannelHistory` call and will refresh the content.
    }
}
exports.OutputChannel = OutputChannel;
//# sourceMappingURL=output-channel.js.map