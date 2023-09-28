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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveEditorAccess = exports.CurrentEditorAccess = exports.EditorAccess = exports.EditorManager = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const editor_widget_1 = require("./editor-widget");
const editor_1 = require("./editor");
const editor_widget_factory_1 = require("./editor-widget-factory");
let EditorManager = class EditorManager extends browser_1.NavigatableWidgetOpenHandler {
    constructor() {
        super(...arguments);
        this.id = editor_widget_factory_1.EditorWidgetFactory.ID;
        this.label = 'Code Editor';
        this.editorCounters = new Map();
        this.onActiveEditorChangedEmitter = new common_1.Emitter();
        /**
         * Emit when the active editor is changed.
         */
        this.onActiveEditorChanged = this.onActiveEditorChangedEmitter.event;
        this.onCurrentEditorChangedEmitter = new common_1.Emitter();
        /**
         * Emit when the current editor is changed.
         */
        this.onCurrentEditorChanged = this.onCurrentEditorChangedEmitter.event;
        this.recentlyVisibleIds = [];
    }
    init() {
        super.init();
        this.shell.onDidChangeActiveWidget(() => this.updateActiveEditor());
        this.shell.onDidChangeCurrentWidget(() => this.updateCurrentEditor());
        this.shell.onDidDoubleClickMainArea(() => this.commands.executeCommand(browser_1.CommonCommands.NEW_UNTITLED_TEXT_FILE.id));
        this.onCreated(widget => {
            widget.onDidChangeVisibility(() => {
                if (widget.isVisible) {
                    this.addRecentlyVisible(widget);
                }
                this.updateCurrentEditor();
            });
            this.checkCounterForWidget(widget);
            widget.disposed.connect(() => {
                this.removeFromCounter(widget);
                this.removeRecentlyVisible(widget);
                this.updateCurrentEditor();
            });
        });
        for (const widget of this.all) {
            if (widget.isVisible) {
                this.addRecentlyVisible(widget);
            }
        }
        this.updateCurrentEditor();
    }
    getByUri(uri, options) {
        return this.getWidget(uri, options);
    }
    getOrCreateByUri(uri, options) {
        return this.getOrCreateWidget(uri, options);
    }
    tryGetPendingWidget(uri, options) {
        const editorPromise = super.tryGetPendingWidget(uri, options);
        if (editorPromise) {
            // Reveal selection before attachment to manage nav stack. (https://github.com/eclipse-theia/theia/issues/8955)
            if (!(editorPromise instanceof browser_1.Widget)) {
                editorPromise.then(editor => this.revealSelection(editor, options, uri));
            }
            else {
                this.revealSelection(editorPromise, options);
            }
        }
        return editorPromise;
    }
    async getWidget(uri, options) {
        const editor = await super.getWidget(uri, options);
        if (editor) {
            // Reveal selection before attachment to manage nav stack. (https://github.com/eclipse-theia/theia/issues/8955)
            this.revealSelection(editor, options, uri);
        }
        return editor;
    }
    async getOrCreateWidget(uri, options) {
        const editor = await super.getOrCreateWidget(uri, options);
        // Reveal selection before attachment to manage nav stack. (https://github.com/eclipse-theia/theia/issues/8955)
        this.revealSelection(editor, options, uri);
        return editor;
    }
    get recentlyVisible() {
        const id = this.recentlyVisibleIds[0];
        return id && this.all.find(w => w.id === id) || undefined;
    }
    addRecentlyVisible(widget) {
        this.removeRecentlyVisible(widget);
        this.recentlyVisibleIds.unshift(widget.id);
    }
    removeRecentlyVisible(widget) {
        const index = this.recentlyVisibleIds.indexOf(widget.id);
        if (index !== -1) {
            this.recentlyVisibleIds.splice(index, 1);
        }
    }
    /**
     * The active editor.
     * If there is an active editor (one that has focus), active and current are the same.
     */
    get activeEditor() {
        return this._activeEditor;
    }
    setActiveEditor(active) {
        if (this._activeEditor !== active) {
            this._activeEditor = active;
            this.onActiveEditorChangedEmitter.fire(this._activeEditor);
        }
    }
    updateActiveEditor() {
        const widget = this.shell.activeWidget;
        if (widget instanceof editor_widget_1.EditorWidget) {
            this.addRecentlyVisible(widget);
            this.setActiveEditor(widget);
        }
        else {
            this.setActiveEditor(undefined);
        }
    }
    /**
     * The most recently activated editor (which might not have the focus anymore, hence it is not active).
     * If no editor has focus, e.g. when a context menu is shown, the active editor is `undefined`, but current might be the editor that was active before the menu popped up.
     */
    get currentEditor() {
        return this._currentEditor;
    }
    setCurrentEditor(current) {
        if (this._currentEditor !== current) {
            this._currentEditor = current;
            this.onCurrentEditorChangedEmitter.fire(this._currentEditor);
        }
    }
    updateCurrentEditor() {
        const widget = this.shell.currentWidget;
        if (widget instanceof editor_widget_1.EditorWidget) {
            this.setCurrentEditor(widget);
        }
        else if (!this._currentEditor || !this._currentEditor.isVisible || this.currentEditor !== this.recentlyVisible) {
            this.setCurrentEditor(this.recentlyVisible);
        }
    }
    canHandle(uri, options) {
        return 100;
    }
    open(uri, options) {
        var _a;
        if ((options === null || options === void 0 ? void 0 : options.counter) === undefined) {
            const insertionOptions = this.shell.getInsertionOptions(options === null || options === void 0 ? void 0 : options.widgetOptions);
            // Definitely creating a new tabbar - no widget can match.
            if ((_a = insertionOptions.addOptions.mode) === null || _a === void 0 ? void 0 : _a.startsWith('split')) {
                return super.open(uri, { counter: this.createCounterForUri(uri), ...options });
            }
            // Check the target tabbar for an existing widget.
            const tabbar = insertionOptions.addOptions.ref && this.shell.getTabBarFor(insertionOptions.addOptions.ref);
            if (tabbar) {
                const currentUri = uri.toString();
                for (const title of tabbar.titles) {
                    if (title.owner instanceof editor_widget_1.EditorWidget) {
                        const { uri: otherWidgetUri, id } = this.extractIdFromWidget(title.owner);
                        if (otherWidgetUri === currentUri) {
                            return super.open(uri, { counter: id, ...options });
                        }
                    }
                }
            }
            // If the user has opted to prefer to open an existing editor even if it's on a different tab, check if we have anything about the URI.
            if (this.preferenceService.get('workbench.editor.revealIfOpen', false)) {
                const counter = this.getCounterForUri(uri);
                if (counter !== undefined) {
                    return super.open(uri, { counter, ...options });
                }
            }
            // Open a new widget.
            return super.open(uri, { counter: this.createCounterForUri(uri), ...options });
        }
        return super.open(uri, options);
    }
    /**
     * Opens an editor to the side of the current editor. Defaults to opening to the right.
     * To modify direction, pass options with `{widgetOptions: {mode: ...}}`
     */
    openToSide(uri, options) {
        const counter = this.createCounterForUri(uri);
        const splitOptions = { widgetOptions: { mode: 'split-right' }, ...options, counter };
        return this.open(uri, splitOptions);
    }
    revealSelection(widget, input, uri) {
        let inputSelection = input === null || input === void 0 ? void 0 : input.selection;
        if (!inputSelection && uri) {
            const match = /^L?(\d+)(?:,(\d+))?/.exec(uri.fragment);
            if (match) {
                // support file:///some/file.js#73,84
                // support file:///some/file.js#L73
                inputSelection = {
                    start: {
                        line: parseInt(match[1]) - 1,
                        character: match[2] ? parseInt(match[2]) - 1 : 0
                    }
                };
            }
        }
        if (inputSelection) {
            const editor = widget.editor;
            const selection = this.getSelection(widget, inputSelection);
            if (editor_1.Position.is(selection)) {
                editor.cursor = selection;
                editor.revealPosition(selection);
            }
            else if (editor_1.Range.is(selection)) {
                editor.cursor = selection.end;
                editor.selection = selection;
                editor.revealRange(selection);
            }
        }
    }
    getSelection(widget, selection) {
        const { start, end } = selection;
        if (editor_1.Position.is(start)) {
            if (editor_1.Position.is(end)) {
                return widget.editor.document.toValidRange({ start, end });
            }
            return widget.editor.document.toValidPosition(start);
        }
        const line = start && start.line !== undefined && start.line >= 0 ? start.line : undefined;
        if (line === undefined) {
            return undefined;
        }
        const character = start && start.character !== undefined && start.character >= 0 ? start.character : widget.editor.document.getLineMaxColumn(line);
        const endLine = end && end.line !== undefined && end.line >= 0 ? end.line : undefined;
        if (endLine === undefined) {
            return { line, character };
        }
        const endCharacter = end && end.character !== undefined && end.character >= 0 ? end.character : widget.editor.document.getLineMaxColumn(endLine);
        return {
            start: { line, character },
            end: { line: endLine, character: endCharacter }
        };
    }
    removeFromCounter(widget) {
        const { id, uri } = this.extractIdFromWidget(widget);
        if (uri && !Number.isNaN(id)) {
            let max = -Infinity;
            this.all.forEach(editor => {
                const candidateID = this.extractIdFromWidget(editor);
                if ((candidateID.uri === uri) && (candidateID.id > max)) {
                    max = candidateID.id;
                }
            });
            if (max > -Infinity) {
                this.editorCounters.set(uri, max);
            }
            else {
                this.editorCounters.delete(uri);
            }
        }
    }
    extractIdFromWidget(widget) {
        const uri = widget.editor.uri.toString();
        const id = Number(widget.id.slice(widget.id.lastIndexOf(':') + 1));
        return { id, uri };
    }
    checkCounterForWidget(widget) {
        var _a;
        const { id, uri } = this.extractIdFromWidget(widget);
        const numericalId = Number(id);
        if (uri && !Number.isNaN(numericalId)) {
            const highestKnownId = (_a = this.editorCounters.get(uri)) !== null && _a !== void 0 ? _a : -Infinity;
            if (numericalId > highestKnownId) {
                this.editorCounters.set(uri, numericalId);
            }
        }
    }
    createCounterForUri(uri) {
        var _a;
        const identifier = uri.toString();
        const next = ((_a = this.editorCounters.get(identifier)) !== null && _a !== void 0 ? _a : 0) + 1;
        return next;
    }
    getCounterForUri(uri) {
        var _a;
        const idWithoutCounter = editor_widget_factory_1.EditorWidgetFactory.createID(uri);
        const counterOfMostRecentlyVisibleEditor = (_a = this.recentlyVisibleIds.find(id => id.startsWith(idWithoutCounter))) === null || _a === void 0 ? void 0 : _a.slice(idWithoutCounter.length + 1);
        return counterOfMostRecentlyVisibleEditor === undefined ? undefined : parseInt(counterOfMostRecentlyVisibleEditor);
    }
    getOrCreateCounterForUri(uri) {
        var _a;
        return (_a = this.getCounterForUri(uri)) !== null && _a !== void 0 ? _a : this.createCounterForUri(uri);
    }
    createWidgetOptions(uri, options) {
        var _a;
        const navigatableOptions = super.createWidgetOptions(uri, options);
        navigatableOptions.counter = (_a = options === null || options === void 0 ? void 0 : options.counter) !== null && _a !== void 0 ? _a : this.getOrCreateCounterForUri(uri);
        return navigatableOptions;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], EditorManager.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], EditorManager.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EditorManager.prototype, "init", null);
EditorManager = __decorate([
    (0, inversify_1.injectable)()
], EditorManager);
exports.EditorManager = EditorManager;
/**
 * Provides direct access to the underlying text editor.
 */
let EditorAccess = class EditorAccess {
    /**
     * The URI of the underlying document from the editor.
     */
    get uri() {
        const editor = this.editor;
        if (editor) {
            return editor.uri.toString();
        }
        return undefined;
    }
    /**
     * The selection location from the text editor.
     */
    get selection() {
        const editor = this.editor;
        if (editor) {
            const uri = editor.uri.toString();
            const range = editor.selection;
            return {
                range,
                uri
            };
        }
        return undefined;
    }
    /**
     * The unique identifier of the language the current editor belongs to.
     */
    get languageId() {
        const editor = this.editor;
        if (editor) {
            return editor.document.languageId;
        }
        return undefined;
    }
    /**
     * The text editor.
     */
    get editor() {
        const editorWidget = this.editorWidget();
        if (editorWidget) {
            return editorWidget.editor;
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(EditorManager),
    __metadata("design:type", EditorManager)
], EditorAccess.prototype, "editorManager", void 0);
EditorAccess = __decorate([
    (0, inversify_1.injectable)()
], EditorAccess);
exports.EditorAccess = EditorAccess;
/**
 * Provides direct access to the currently active text editor.
 */
let CurrentEditorAccess = class CurrentEditorAccess extends EditorAccess {
    editorWidget() {
        return this.editorManager.currentEditor;
    }
};
CurrentEditorAccess = __decorate([
    (0, inversify_1.injectable)()
], CurrentEditorAccess);
exports.CurrentEditorAccess = CurrentEditorAccess;
/**
 * Provides access to the active text editor.
 */
let ActiveEditorAccess = class ActiveEditorAccess extends EditorAccess {
    editorWidget() {
        return this.editorManager.activeEditor;
    }
};
ActiveEditorAccess = __decorate([
    (0, inversify_1.injectable)()
], ActiveEditorAccess);
exports.ActiveEditorAccess = ActiveEditorAccess;
(function (EditorAccess) {
    EditorAccess.CURRENT = 'current-editor-access';
    EditorAccess.ACTIVE = 'active-editor-access';
})(EditorAccess = exports.EditorAccess || (exports.EditorAccess = {}));
exports.EditorAccess = EditorAccess;
//# sourceMappingURL=editor-manager.js.map