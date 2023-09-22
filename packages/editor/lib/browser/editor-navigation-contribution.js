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
var EditorNavigationContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorNavigationContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const logger_1 = require("@theia/core/lib/common/logger");
const storage_service_1 = require("@theia/core/lib/browser/storage-service");
const disposable_1 = require("@theia/core/lib/common/disposable");
const command_1 = require("@theia/core/lib/common/command");
const editor_command_1 = require("./editor-command");
const editor_manager_1 = require("./editor-manager");
const navigation_location_1 = require("./navigation/navigation-location");
const navigation_location_service_1 = require("./navigation/navigation-location-service");
const browser_1 = require("@theia/core/lib/browser");
const dialogs_1 = require("@theia/core/lib/browser/dialogs");
const core_1 = require("@theia/core");
let EditorNavigationContribution = EditorNavigationContribution_1 = class EditorNavigationContribution {
    constructor() {
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDisposePerCurrentEditor = new disposable_1.DisposableCollection();
    }
    init() {
        this.toDispose.pushAll([
            // TODO listen on file resource changes, if a file gets deleted, remove the corresponding navigation locations (if any).
            // This would require introducing the FS dependency in the editor extension.
            this.editorManager.onCurrentEditorChanged(this.onCurrentEditorChanged.bind(this)),
            this.editorManager.onCreated(widget => {
                this.locationStack.removeClosedEditor(widget.editor.uri);
                widget.disposed.connect(() => this.locationStack.addClosedEditor({
                    uri: widget.editor.uri,
                    viewState: widget.editor.storeViewState()
                }));
            })
        ]);
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.GO_BACK.id, {
            execute: () => this.locationStack.back(),
            isEnabled: () => this.locationStack.canGoBack()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.GO_FORWARD.id, {
            execute: () => this.locationStack.forward(),
            isEnabled: () => this.locationStack.canGoForward()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.GO_LAST_EDIT.id, {
            execute: () => this.locationStack.reveal(this.locationStack.lastEditLocation()),
            isEnabled: () => !!this.locationStack.lastEditLocation()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.CLEAR_EDITOR_HISTORY.id, {
            execute: async () => {
                const shouldClear = await new dialogs_1.ConfirmDialog({
                    title: core_1.nls.localizeByDefault('Clear Editor History'),
                    msg: core_1.nls.localizeByDefault('Do you want to clear the history of recently opened editors?'),
                    ok: dialogs_1.Dialog.YES,
                    cancel: dialogs_1.Dialog.NO
                }).open();
                if (shouldClear) {
                    this.locationStack.clearHistory();
                }
            },
            isEnabled: () => this.locationStack.locations().length > 0
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.TOGGLE_MINIMAP.id, {
            execute: () => this.toggleMinimap(),
            isEnabled: () => true,
            isToggled: () => this.isMinimapEnabled()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.TOGGLE_RENDER_WHITESPACE.id, {
            execute: () => this.toggleRenderWhitespace(),
            isEnabled: () => true,
            isToggled: () => this.isRenderWhitespaceEnabled()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.TOGGLE_WORD_WRAP.id, {
            execute: () => this.toggleWordWrap(),
            isEnabled: () => true,
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.TOGGLE_STICKY_SCROLL.id, {
            execute: () => this.toggleStickyScroll(),
            isEnabled: () => true,
            isToggled: () => this.isStickyScrollEnabled()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.REOPEN_CLOSED_EDITOR.id, {
            execute: () => this.reopenLastClosedEditor()
        });
        this.installMouseNavigationSupport();
    }
    async installMouseNavigationSupport() {
        const mouseNavigationSupport = new disposable_1.DisposableCollection();
        const updateMouseNavigationListener = () => {
            mouseNavigationSupport.dispose();
            if (this.shouldNavigateWithMouse()) {
                mouseNavigationSupport.push((0, browser_1.addEventListener)(document.body, 'mousedown', event => this.onMouseDown(event), true));
            }
        };
        this.toDispose.push(this.preferenceService.onPreferenceChanged(change => {
            if (change.preferenceName === EditorNavigationContribution_1.MOUSE_NAVIGATION_PREFERENCE) {
                updateMouseNavigationListener();
            }
        }));
        updateMouseNavigationListener();
        this.toDispose.push(mouseNavigationSupport);
    }
    async onMouseDown(event) {
        // Support navigation in history when mouse buttons 4/5 are pressed
        switch (event.button) {
            case 3:
                event.preventDefault();
                this.locationStack.back();
                break;
            case 4:
                event.preventDefault();
                this.locationStack.forward();
                break;
        }
    }
    /**
     * Reopens the last closed editor with its stored view state if possible from history.
     * If the editor cannot be restored, continue to the next editor in history.
     */
    async reopenLastClosedEditor() {
        const lastClosedEditor = this.locationStack.getLastClosedEditor();
        if (lastClosedEditor === undefined) {
            return;
        }
        try {
            const widget = await this.editorManager.open(lastClosedEditor.uri);
            widget.editor.restoreViewState(lastClosedEditor.viewState);
        }
        catch {
            this.locationStack.removeClosedEditor(lastClosedEditor.uri);
            this.reopenLastClosedEditor();
        }
    }
    async onStart() {
        await this.restoreState();
    }
    onStop() {
        this.storeState();
        this.dispose();
    }
    dispose() {
        this.toDispose.dispose();
    }
    /**
     * Toggle the editor word wrap behavior.
     */
    async toggleWordWrap() {
        // Get the current word wrap.
        const wordWrap = this.preferenceService.get('editor.wordWrap');
        if (wordWrap === undefined) {
            return;
        }
        // The list of allowed word wrap values.
        const values = ['off', 'on', 'wordWrapColumn', 'bounded'];
        // Get the index of the current value, and toggle to the next available value.
        const index = values.indexOf(wordWrap) + 1;
        if (index > -1) {
            this.preferenceService.set('editor.wordWrap', values[index % values.length], browser_1.PreferenceScope.User);
        }
    }
    /**
     * Toggle the display of sticky scroll in the editor.
     */
    async toggleStickyScroll() {
        const value = this.preferenceService.get('editor.stickyScroll.enabled');
        this.preferenceService.set('editor.stickyScroll.enabled', !value, browser_1.PreferenceScope.User);
    }
    /**
     * Toggle the display of minimap in the editor.
     */
    async toggleMinimap() {
        const value = this.preferenceService.get('editor.minimap.enabled');
        this.preferenceService.set('editor.minimap.enabled', !value, browser_1.PreferenceScope.User);
    }
    /**
     * Toggle the rendering of whitespace in the editor.
     */
    async toggleRenderWhitespace() {
        const renderWhitespace = this.preferenceService.get('editor.renderWhitespace');
        let updatedRenderWhitespace;
        if (renderWhitespace === 'none') {
            updatedRenderWhitespace = 'all';
        }
        else {
            updatedRenderWhitespace = 'none';
        }
        this.preferenceService.set('editor.renderWhitespace', updatedRenderWhitespace, browser_1.PreferenceScope.User);
    }
    onCurrentEditorChanged(editorWidget) {
        this.toDisposePerCurrentEditor.dispose();
        if (editorWidget) {
            const { editor } = editorWidget;
            this.toDisposePerCurrentEditor.pushAll([
                // Instead of registering an `onCursorPositionChanged` listener, we treat the zero length selection as a cursor position change.
                // Otherwise we would have two events for a single cursor change interaction.
                editor.onSelectionChanged(selection => this.onSelectionChanged(editor, selection)),
                editor.onDocumentContentChanged(event => this.onDocumentContentChanged(editor, event))
            ]);
            this.locationStack.register(navigation_location_1.NavigationLocation.create(editor, editor.selection));
        }
    }
    onCursorPositionChanged(editor, position) {
        this.locationStack.register(navigation_location_1.NavigationLocation.create(editor, position));
    }
    onSelectionChanged(editor, selection) {
        if (this.isZeroLengthRange(selection)) {
            this.onCursorPositionChanged(editor, selection.start);
        }
        else {
            this.locationStack.register(navigation_location_1.NavigationLocation.create(editor, selection));
        }
    }
    onDocumentContentChanged(editor, event) {
        if (event.contentChanges.length > 0) {
            this.locationStack.register(navigation_location_1.NavigationLocation.create(editor, event.contentChanges[0]));
        }
    }
    /**
     * `true` if the `range` argument has zero length. In other words, the `start` and the `end` positions are the same. Otherwise, `false`.
     */
    isZeroLengthRange(range) {
        const { start, end } = range;
        return start.line === end.line && start.character === end.character;
    }
    async storeState() {
        this.storageService.setData(EditorNavigationContribution_1.ID, {
            locations: this.locationStack.locations().map(navigation_location_1.NavigationLocation.toObject)
        });
        this.storageService.setData(EditorNavigationContribution_1.CLOSED_EDITORS_KEY, {
            closedEditors: this.shouldStoreClosedEditors() ? this.locationStack.closedEditorsStack.map(navigation_location_1.RecentlyClosedEditor.toObject) : []
        });
    }
    async restoreState() {
        await this.restoreNavigationLocations();
        await this.restoreClosedEditors();
    }
    async restoreNavigationLocations() {
        const raw = await this.storageService.getData(EditorNavigationContribution_1.ID);
        if (raw && raw.locations) {
            const locations = [];
            for (let i = 0; i < raw.locations.length; i++) {
                const location = navigation_location_1.NavigationLocation.fromObject(raw.locations[i]);
                if (location) {
                    locations.push(location);
                }
                else {
                    this.logger.warn('Could not restore the state of the editor navigation history.');
                    return;
                }
            }
            this.locationStack.register(...locations);
        }
    }
    async restoreClosedEditors() {
        const raw = await this.storageService.getData(EditorNavigationContribution_1.CLOSED_EDITORS_KEY);
        if (raw && raw.closedEditors) {
            for (let i = 0; i < raw.closedEditors.length; i++) {
                const editor = navigation_location_1.RecentlyClosedEditor.fromObject(raw.closedEditors[i]);
                if (editor) {
                    this.locationStack.addClosedEditor(editor);
                }
                else {
                    this.logger.warn('Could not restore the state of the closed editors stack.');
                }
            }
        }
    }
    isMinimapEnabled() {
        return !!this.preferenceService.get('editor.minimap.enabled');
    }
    isRenderWhitespaceEnabled() {
        const renderWhitespace = this.preferenceService.get('editor.renderWhitespace');
        return renderWhitespace === 'none' ? false : true;
    }
    shouldStoreClosedEditors() {
        return !!this.preferenceService.get('editor.history.persistClosedEditors');
    }
    shouldNavigateWithMouse() {
        return !!this.preferenceService.get(EditorNavigationContribution_1.MOUSE_NAVIGATION_PREFERENCE);
    }
    isStickyScrollEnabled() {
        return !!this.preferenceService.get('editor.stickyScroll.enabled');
    }
};
EditorNavigationContribution.ID = 'editor-navigation-contribution';
EditorNavigationContribution.CLOSED_EDITORS_KEY = 'recently-closed-editors';
EditorNavigationContribution.MOUSE_NAVIGATION_PREFERENCE = 'workbench.editor.mouseBackForwardToNavigate';
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], EditorNavigationContribution.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], EditorNavigationContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(navigation_location_service_1.NavigationLocationService),
    __metadata("design:type", navigation_location_service_1.NavigationLocationService)
], EditorNavigationContribution.prototype, "locationStack", void 0);
__decorate([
    (0, inversify_1.inject)(storage_service_1.StorageService),
    __metadata("design:type", Object)
], EditorNavigationContribution.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], EditorNavigationContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], EditorNavigationContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EditorNavigationContribution.prototype, "init", null);
EditorNavigationContribution = EditorNavigationContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], EditorNavigationContribution);
exports.EditorNavigationContribution = EditorNavigationContribution;
//# sourceMappingURL=editor-navigation-contribution.js.map