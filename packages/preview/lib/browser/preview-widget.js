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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewWidget = exports.PreviewWidgetOptions = exports.PREVIEW_WIDGET_CLASS = void 0;
const throttle = require("@theia/core/shared/lodash.throttle");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
const preview_handler_1 = require("./preview-handler");
const theming_1 = require("@theia/core/lib/browser/theming");
const browser_2 = require("@theia/editor/lib/browser");
const monaco_workspace_1 = require("@theia/monaco/lib/browser/monaco-workspace");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
exports.PREVIEW_WIDGET_CLASS = 'theia-preview-widget';
const DEFAULT_ICON = (0, browser_1.codicon)('eye');
let widgetCounter = 0;
exports.PreviewWidgetOptions = Symbol('PreviewWidgetOptions');
let PreviewWidget = class PreviewWidget extends browser_1.BaseWidget {
    constructor(options, previewHandlerProvider, themeService, workspace, editorPreferences) {
        super();
        this.options = options;
        this.previewHandlerProvider = previewHandlerProvider;
        this.themeService = themeService;
        this.workspace = workspace;
        this.editorPreferences = editorPreferences;
        this.firstUpdate = undefined;
        this.onDidScrollEmitter = new common_1.Emitter();
        this.onDidDoubleClickEmitter = new common_1.Emitter();
        this.preventScrollNotification = false;
        this.previousContent = undefined;
        this.internalRevealForSourceLine = throttle((sourceLine) => {
            if (!this.previewHandler || !this.previewHandler.findElementForSourceLine) {
                return;
            }
            const elementToReveal = this.previewHandler.findElementForSourceLine(this.node, sourceLine);
            if (elementToReveal) {
                this.preventScrollNotification = true;
                elementToReveal.scrollIntoView();
                window.setTimeout(() => {
                    this.preventScrollNotification = false;
                }, 50);
            }
        }, 50);
        this.resource = this.options.resource;
        this.uri = this.resource.uri;
        this.id = 'preview-widget-' + widgetCounter++;
        this.title.closable = true;
        this.title.label = `Preview ${this.uri.path.base}`;
        this.title.caption = this.title.label;
        this.title.closable = true;
        this.toDispose.push(this.onDidScrollEmitter);
        this.toDispose.push(this.onDidDoubleClickEmitter);
        this.addClass(exports.PREVIEW_WIDGET_CLASS);
        this.node.tabIndex = 0;
        const previewHandler = this.previewHandler = this.previewHandlerProvider.findContribution(this.uri)[0];
        if (!previewHandler) {
            return;
        }
        this.title.iconClass = previewHandler.iconClass || DEFAULT_ICON;
        this.initialize();
    }
    async initialize() {
        this.scrollBeyondLastLine = !!this.editorPreferences['editor.scrollBeyondLastLine'];
        this.toDispose.push(this.editorPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'editor.scrollBeyondLastLine') {
                this.scrollBeyondLastLine = Boolean(e.newValue);
                this.forceUpdate();
            }
        }));
        this.toDispose.push(this.resource);
        if (this.resource.onDidChangeContents) {
            this.toDispose.push(this.resource.onDidChangeContents(() => this.update()));
        }
        const updateIfAffected = (affectedUri) => {
            if (!affectedUri || affectedUri === this.uri.toString()) {
                this.update();
            }
        };
        this.toDispose.push(this.workspace.onDidOpenTextDocument(document => updateIfAffected(document.uri)));
        this.toDispose.push(this.workspace.onDidChangeTextDocument(params => updateIfAffected(params.model.uri)));
        this.toDispose.push(this.workspace.onDidCloseTextDocument(document => updateIfAffected(document.uri)));
        this.toDispose.push(this.themeService.onDidColorThemeChange(() => this.update()));
        this.firstUpdate = () => {
            this.revealFragment(this.uri);
        };
        this.update();
    }
    onBeforeAttach(msg) {
        super.onBeforeAttach(msg);
        this.toDispose.push(this.startScrollSync());
        this.toDispose.push(this.startDoubleClickListener());
    }
    startScrollSync() {
        return (0, browser_1.addEventListener)(this.node, 'scroll', throttle((event) => {
            if (this.preventScrollNotification) {
                return;
            }
            const scrollTop = this.node.scrollTop;
            this.didScroll(scrollTop);
        }, 50));
    }
    startDoubleClickListener() {
        return (0, browser_1.addEventListener)(this.node, 'dblclick', (event) => {
            if (!(event.target instanceof HTMLElement)) {
                return;
            }
            const target = event.target;
            let node = target;
            while (node && node instanceof HTMLElement) {
                if (node.tagName === 'A') {
                    return;
                }
                node = node.parentElement;
            }
            const offsetParent = target.offsetParent;
            const offset = offsetParent.classList.contains(exports.PREVIEW_WIDGET_CLASS) ? target.offsetTop : offsetParent.offsetTop;
            this.didDoubleClick(offset);
        });
    }
    getUri() {
        return this.uri;
    }
    getResourceUri() {
        return this.uri;
    }
    createMoveToUri(resourceUri) {
        return this.uri.withPath(resourceUri.path);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
        this.update();
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        this.performUpdate();
    }
    forceUpdate() {
        this.previousContent = undefined;
        this.update();
    }
    async performUpdate() {
        if (!this.resource) {
            return;
        }
        const uri = this.resource.uri;
        const document = this.workspace.textDocuments.find(d => d.uri === uri.toString());
        const content = document ? document.getText() : await this.resource.readContents();
        if (content === this.previousContent) {
            return;
        }
        this.previousContent = content;
        const contentElement = await this.render(content, uri);
        this.node.innerHTML = '';
        if (contentElement) {
            if (this.scrollBeyondLastLine) {
                contentElement.classList.add('scrollBeyondLastLine');
            }
            this.node.appendChild(contentElement);
            if (this.firstUpdate) {
                this.firstUpdate();
                this.firstUpdate = undefined;
            }
        }
    }
    async render(content, originUri) {
        if (!this.previewHandler || !this.resource) {
            return undefined;
        }
        return this.previewHandler.renderContent({ content, originUri });
    }
    revealFragment(uri) {
        if (uri.fragment === '' || !this.previewHandler || !this.previewHandler.findElementForFragment) {
            return;
        }
        const elementToReveal = this.previewHandler.findElementForFragment(this.node, uri.fragment);
        if (elementToReveal) {
            this.preventScrollNotification = true;
            elementToReveal.scrollIntoView();
            window.setTimeout(() => {
                this.preventScrollNotification = false;
            }, 50);
        }
    }
    revealForSourceLine(sourceLine) {
        this.internalRevealForSourceLine(sourceLine);
    }
    get onDidScroll() {
        return this.onDidScrollEmitter.event;
    }
    fireDidScrollToSourceLine(line) {
        this.onDidScrollEmitter.fire(line);
    }
    didScroll(scrollTop) {
        if (!this.previewHandler || !this.previewHandler.getSourceLineForOffset) {
            return;
        }
        const offset = scrollTop;
        const line = this.previewHandler.getSourceLineForOffset(this.node, offset);
        if (line) {
            this.fireDidScrollToSourceLine(line);
        }
    }
    get onDidDoubleClick() {
        return this.onDidDoubleClickEmitter.event;
    }
    fireDidDoubleClickToSourceLine(line) {
        if (!this.resource) {
            return;
        }
        this.onDidDoubleClickEmitter.fire({
            uri: this.resource.uri.toString(),
            range: vscode_languageserver_protocol_1.Range.create({ line, character: 0 }, { line, character: 0 })
        });
    }
    didDoubleClick(offsetTop) {
        if (!this.previewHandler || !this.previewHandler.getSourceLineForOffset) {
            return;
        }
        const line = this.previewHandler.getSourceLineForOffset(this.node, offsetTop) || 0;
        this.fireDidDoubleClickToSourceLine(line);
    }
};
PreviewWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.PreviewWidgetOptions)),
    __param(1, (0, inversify_1.inject)(preview_handler_1.PreviewHandlerProvider)),
    __param(2, (0, inversify_1.inject)(theming_1.ThemeService)),
    __param(3, (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace)),
    __param(4, (0, inversify_1.inject)(browser_2.EditorPreferences)),
    __metadata("design:paramtypes", [Object, preview_handler_1.PreviewHandlerProvider,
        theming_1.ThemeService,
        monaco_workspace_1.MonacoWorkspace, Object])
], PreviewWidget);
exports.PreviewWidget = PreviewWidget;
//# sourceMappingURL=preview-widget.js.map