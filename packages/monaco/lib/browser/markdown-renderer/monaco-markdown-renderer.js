"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.MonacoMarkdownRenderer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const language_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/languages/language");
const markdownRenderer_1 = require("@theia/monaco-editor-core/esm/vs/editor/contrib/markdownRenderer/browser/markdownRenderer");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const monaco_command_service_1 = require("../monaco-command-service");
const monaco_editor_service_1 = require("../monaco-editor-service");
const openerService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/openerService");
const browser_1 = require("@theia/core/lib/browser");
const uri_1 = require("@theia/core/lib/common/uri");
const lifecycle_1 = require("@theia/monaco-editor-core/esm/vs/base/common/lifecycle");
const core_1 = require("@theia/core");
let MonacoMarkdownRenderer = class MonacoMarkdownRenderer {
    render(markdown, options, markedOptions) {
        return this.delegate.render(markdown, this.transformOptions(options), markedOptions);
    }
    transformOptions(options) {
        if (!(options === null || options === void 0 ? void 0 : options.actionHandler)) {
            return options;
        }
        const monacoActionHandler = {
            disposables: this.toDisposableStore(options.actionHandler.disposables),
            callback: (content, e) => options.actionHandler.callback(content, e === null || e === void 0 ? void 0 : e.browserEvent)
        };
        return { ...options, actionHandler: monacoActionHandler };
    }
    toDisposableStore(current) {
        if (current instanceof lifecycle_1.DisposableStore) {
            return current;
        }
        else if (current instanceof core_1.DisposableCollection) {
            const store = new lifecycle_1.DisposableStore();
            current['disposables'].forEach(disposable => store.add(disposable));
            return store;
        }
        else {
            return new lifecycle_1.DisposableStore();
        }
    }
    init() {
        const languages = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
        const openerService = new openerService_1.OpenerService(this.codeEditorService, this.commandServiceFactory());
        openerService.registerOpener({
            open: (u, options) => this.interceptOpen(u, options)
        });
        const getPreference = () => this.preferences.get('editor.fontFamily');
        const rendererOptions = new Proxy(Object.create(null), {
            get(_, field) {
                if (field === 'codeBlockFontFamily') {
                    return getPreference();
                }
                else {
                    return undefined;
                }
            }
        });
        this.delegate = new markdownRenderer_1.MarkdownRenderer(rendererOptions, languages, openerService);
    }
    async interceptOpen(monacoUri, monacoOptions) {
        let options = undefined;
        if (monacoOptions) {
            if ('openToSide' in monacoOptions && monacoOptions.openToSide) {
                options = Object.assign(options || {}, {
                    widgetOptions: {
                        mode: 'split-right'
                    }
                });
            }
            if ('openExternal' in monacoOptions && monacoOptions.openExternal) {
                options = Object.assign(options || {}, {
                    openExternal: true
                });
            }
        }
        const uri = new uri_1.URI(monacoUri.toString());
        try {
            await (0, browser_1.open)(this.openerService, uri, options);
            return true;
        }
        catch (e) {
            console.error(`Fail to open '${uri.toString()}':`, e);
            return false;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService),
    __metadata("design:type", monaco_editor_service_1.MonacoEditorService)
], MonacoMarkdownRenderer.prototype, "codeEditorService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_command_service_1.MonacoCommandServiceFactory),
    __metadata("design:type", Function)
], MonacoMarkdownRenderer.prototype, "commandServiceFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], MonacoMarkdownRenderer.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], MonacoMarkdownRenderer.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoMarkdownRenderer.prototype, "init", null);
MonacoMarkdownRenderer = __decorate([
    (0, inversify_1.injectable)()
], MonacoMarkdownRenderer);
exports.MonacoMarkdownRenderer = MonacoMarkdownRenderer;
//# sourceMappingURL=monaco-markdown-renderer.js.map