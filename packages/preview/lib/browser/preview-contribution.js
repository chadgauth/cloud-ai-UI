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
exports.PreviewContribution = exports.PreviewCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const common_1 = require("@theia/core/lib/common");
const mini_browser_open_handler_1 = require("@theia/mini-browser/lib/browser/mini-browser-open-handler");
const preview_widget_1 = require("./preview-widget");
const preview_handler_1 = require("./preview-handler");
const preview_uri_1 = require("./preview-uri");
const preview_preferences_1 = require("./preview-preferences");
const nls_1 = require("@theia/core/lib/common/nls");
const debounce = require("@theia/core/shared/lodash.debounce");
var PreviewCommands;
(function (PreviewCommands) {
    /**
     * No `label`. Otherwise, it would show up in the `Command Palette` and we already have the `Preview` open handler.
     * See in (`WorkspaceCommandContribution`)[https://bit.ly/2DncrSD].
     */
    PreviewCommands.OPEN = common_1.Command.toLocalizedCommand({
        id: 'preview:open',
        label: 'Open Preview',
        iconClass: (0, browser_1.codicon)('open-preview')
    }, 'vscode.markdown-language-features/package/markdown.preview.title');
    PreviewCommands.OPEN_SOURCE = {
        id: 'preview.open.source',
        iconClass: (0, browser_1.codicon)('go-to-file')
    };
})(PreviewCommands = exports.PreviewCommands || (exports.PreviewCommands = {}));
let PreviewContribution = 
// eslint-disable-next-line max-len
class PreviewContribution extends browser_1.NavigatableWidgetOpenHandler {
    constructor() {
        super(...arguments);
        this.id = preview_uri_1.PreviewUri.id;
        this.label = nls_1.nls.localize(mini_browser_open_handler_1.MiniBrowserCommands.PREVIEW_CATEGORY_KEY, mini_browser_open_handler_1.MiniBrowserCommands.PREVIEW_CATEGORY);
        this.synchronizedUris = new Set();
        this.scrollSyncLockOn = undefined;
    }
    onStart() {
        this.onCreated(previewWidget => {
            this.registerOpenOnDoubleClick(previewWidget);
            this.registerEditorAndPreviewSync(previewWidget);
        });
        this.editorManager.onCreated(editorWidget => {
            this.registerEditorAndPreviewSync(editorWidget);
        });
    }
    async lockScrollSync(on, delay = 50) {
        this.scrollSyncLockOn = on;
        if (this.scrollSyncLockTimeout) {
            window.clearTimeout(this.scrollSyncLockTimeout);
        }
        this.scrollSyncLockTimeout = window.setTimeout(() => {
            this.scrollSyncLockOn = undefined;
        }, delay);
    }
    async registerEditorAndPreviewSync(source) {
        let uri;
        let editorWidget;
        let previewWidget;
        if (source instanceof browser_2.EditorWidget) {
            editorWidget = source;
            uri = editorWidget.editor.uri.toString();
            previewWidget = await this.getWidget(editorWidget.editor.uri);
        }
        else {
            previewWidget = source;
            uri = previewWidget.getUri().toString();
            editorWidget = await this.editorManager.getByUri(previewWidget.getUri());
        }
        if (!previewWidget || !editorWidget || !uri) {
            return;
        }
        if (this.synchronizedUris.has(uri)) {
            return;
        }
        const syncDisposables = new common_1.DisposableCollection();
        previewWidget.disposed.connect(() => syncDisposables.dispose());
        editorWidget.disposed.connect(() => syncDisposables.dispose());
        const editor = editorWidget.editor;
        syncDisposables.push(editor.onScrollChanged(debounce(() => {
            if (this.scrollSyncLockOn === 'editor') {
                // avoid recursive scroll synchronization
                return;
            }
            this.lockScrollSync('preview');
            const range = editor.getVisibleRanges();
            if (range.length > 0) {
                this.revealSourceLineInPreview(previewWidget, range[0].start);
            }
        }), 100));
        syncDisposables.push(this.synchronizeScrollToEditor(previewWidget, editor));
        this.synchronizedUris.add(uri);
        syncDisposables.push(common_1.Disposable.create(() => this.synchronizedUris.delete(uri)));
    }
    revealSourceLineInPreview(previewWidget, position) {
        previewWidget.revealForSourceLine(position.line);
    }
    synchronizeScrollToEditor(previewWidget, editor) {
        return previewWidget.onDidScroll(sourceLine => {
            if (this.scrollSyncLockOn === 'preview') {
                // avoid recursive scroll synchronization
                return;
            }
            const line = Math.floor(sourceLine);
            this.lockScrollSync('editor'); // avoid recursive scroll synchronization
            editor.revealRange({
                start: {
                    line,
                    character: 0
                },
                end: {
                    line: line + 1,
                    character: 0
                }
            }, { at: 'top' });
        });
    }
    registerOpenOnDoubleClick(ref) {
        const disposable = ref.onDidDoubleClick(async (location) => {
            const { editor } = await this.openSource(ref);
            editor.revealPosition(location.range.start);
            editor.selection = location.range;
            ref.revealForSourceLine(location.range.start.line);
        });
        ref.disposed.connect(() => disposable.dispose());
    }
    canHandle(uri) {
        if (!this.previewHandlerProvider.canHandle(uri)) {
            return 0;
        }
        const editorPriority = this.editorManager.canHandle(uri);
        if (editorPriority === 0) {
            return 200;
        }
        if (preview_uri_1.PreviewUri.match(uri)) {
            return editorPriority * 2;
        }
        return editorPriority * (this.openByDefault ? 2 : 0.5);
    }
    get openByDefault() {
        return this.preferences['preview.openByDefault'];
    }
    async open(uri, options) {
        const resolvedOptions = await this.resolveOpenerOptions(options);
        return super.open(uri, resolvedOptions);
    }
    serializeUri(uri) {
        return super.serializeUri(preview_uri_1.PreviewUri.decode(uri));
    }
    async resolveOpenerOptions(options) {
        const resolved = { mode: 'activate', ...options };
        if (resolved.originUri) {
            const ref = await this.getWidget(resolved.originUri);
            if (ref) {
                resolved.widgetOptions = { ...resolved.widgetOptions, ref };
            }
        }
        return resolved;
    }
    registerCommands(registry) {
        registry.registerCommand(PreviewCommands.OPEN, {
            execute: widget => this.openForEditor(widget),
            isEnabled: widget => this.canHandleEditorUri(widget),
            isVisible: widget => this.canHandleEditorUri(widget)
        });
        registry.registerCommand(PreviewCommands.OPEN_SOURCE, {
            execute: widget => this.openSource(widget),
            isEnabled: widget => widget instanceof preview_widget_1.PreviewWidget,
            isVisible: widget => widget instanceof preview_widget_1.PreviewWidget
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_2.EditorContextMenu.NAVIGATION, {
            commandId: PreviewCommands.OPEN.id
        });
    }
    registerToolbarItems(registry) {
        registry.registerItem({
            id: PreviewCommands.OPEN.id,
            command: PreviewCommands.OPEN.id,
            tooltip: nls_1.nls.localize('vscode.markdown-language-features/package/markdown.previewSide.title', 'Open Preview to the Side')
        });
        registry.registerItem({
            id: PreviewCommands.OPEN_SOURCE.id,
            command: PreviewCommands.OPEN_SOURCE.id,
            tooltip: nls_1.nls.localize('vscode.markdown-language-features/package/markdown.showSource.title', 'Open Source')
        });
    }
    canHandleEditorUri(widget) {
        const uri = this.getCurrentEditorUri(widget);
        return !!uri && this.previewHandlerProvider.canHandle(uri);
    }
    getCurrentEditorUri(widget) {
        const current = this.getCurrentEditor(widget);
        return current && current.editor.uri;
    }
    getCurrentEditor(widget) {
        const current = widget ? widget : this.editorManager.currentEditor;
        return current instanceof browser_2.EditorWidget && current || undefined;
    }
    async openForEditor(widget) {
        const ref = this.getCurrentEditor(widget);
        if (!ref) {
            return;
        }
        await this.open(ref.editor.uri, {
            mode: 'reveal',
            widgetOptions: { ref, mode: 'open-to-right' }
        });
    }
    async openSource(ref) {
        if (ref instanceof preview_widget_1.PreviewWidget) {
            return this.editorManager.open(ref.uri, {
                widgetOptions: { ref, mode: 'tab-after' }
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], PreviewContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(preview_handler_1.PreviewHandlerProvider),
    __metadata("design:type", preview_handler_1.PreviewHandlerProvider)
], PreviewContribution.prototype, "previewHandlerProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preview_preferences_1.PreviewPreferences),
    __metadata("design:type", Object)
], PreviewContribution.prototype, "preferences", void 0);
PreviewContribution = __decorate([
    (0, inversify_1.injectable)()
    // eslint-disable-next-line max-len
], PreviewContribution);
exports.PreviewContribution = PreviewContribution;
//# sourceMappingURL=preview-contribution.js.map