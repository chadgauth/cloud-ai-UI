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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguagesMainPluginMetrics = void 0;
const plugin_metrics_resolver_1 = require("./plugin-metrics-resolver");
const languages_main_1 = require("@theia/plugin-ext/lib/main/browser/languages-main");
const inversify_1 = require("@theia/core/shared/inversify");
const vst = require("@theia/core/shared/vscode-languageserver-protocol");
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
//# sourceMappingURL=plugin-metrics-languages-main.js.map