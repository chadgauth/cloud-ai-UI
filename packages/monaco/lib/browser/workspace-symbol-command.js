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
var WorkspaceSymbolCommand_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSymbolCommand = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const environment_1 = require("@theia/core/shared/@theia/application-package/lib/environment");
const browser_1 = require("@theia/core/lib/browser");
const quick_input_1 = require("@theia/core/lib/browser/quick-input");
const common_1 = require("@theia/core/lib/common");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const monaco_languages_1 = require("./monaco-languages");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_2 = require("@theia/editor/lib/browser");
let WorkspaceSymbolCommand = WorkspaceSymbolCommand_1 = class WorkspaceSymbolCommand {
    constructor() {
        this.command = common_1.Command.toDefaultLocalizedCommand({
            id: 'languages.workspace.symbol',
            label: 'Go to Symbol in Workspace...'
        });
    }
    isEnabled() {
        return this.languages.workspaceSymbolProviders !== undefined;
    }
    execute() {
        this.quickInputService.open(WorkspaceSymbolCommand_1.PREFIX);
    }
    registerCommands(commands) {
        commands.registerCommand(this.command, this);
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_2.EditorMainMenu.WORKSPACE_GROUP, {
            commandId: this.command.id,
            order: '2'
        });
    }
    isElectron() {
        return environment_1.environment.electron.is();
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: this.command.id,
            keybinding: this.isElectron() ? 'ctrlcmd+t' : 'ctrlcmd+o',
        });
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: WorkspaceSymbolCommand_1.PREFIX,
            placeholder: '',
            helpEntries: [{ description: common_1.nls.localizeByDefault('Go to Symbol in Workspace'), needsEditor: false }]
        });
    }
    async getPicks(filter, token) {
        const items = [];
        if (this.languages.workspaceSymbolProviders) {
            const param = {
                query: filter
            };
            const workspaceProviderPromises = [];
            for (const provider of this.languages.workspaceSymbolProviders) {
                workspaceProviderPromises.push((async () => {
                    const symbols = await provider.provideWorkspaceSymbols(param, token);
                    if (symbols && !token.isCancellationRequested) {
                        for (const symbol of symbols) {
                            items.push(this.createItem(symbol, provider, filter, token));
                        }
                    }
                    return symbols;
                })());
            }
            await Promise.all(workspaceProviderPromises.map(p => p.then(sym => sym, _ => undefined)))
                .then(symbols => {
                const filteredSymbols = symbols.filter(el => el && el.length !== 0);
                if (filteredSymbols.length === 0) {
                    items.push({
                        label: filter.length === 0
                            ? common_1.nls.localize('theia/monaco/typeToSearchForSymbols', 'Type to search for symbols')
                            : common_1.nls.localize('theia/monaco/noSymbolsMatching', 'No symbols matching'),
                    });
                }
            }).catch();
        }
        return items;
    }
    createItem(sym, provider, filter, token) {
        const uri = new uri_1.default(sym.location.uri);
        const iconClasses = this.toCssClassName(sym.kind);
        let parent = sym.containerName;
        if (parent) {
            parent += ' - ';
        }
        const description = (parent || '') + this.labelProvider.getName(uri);
        return ({
            label: sym.name,
            description,
            ariaLabel: uri.toString(),
            iconClasses,
            highlights: {
                label: (0, quick_input_1.findMatches)(sym.name, filter),
                description: (0, quick_input_1.findMatches)(description, filter)
            },
            execute: () => {
                if (provider.resolveWorkspaceSymbol) {
                    provider.resolveWorkspaceSymbol(sym, token).then(resolvedSymbol => {
                        if (resolvedSymbol) {
                            this.openURL(uri, resolvedSymbol.location.range.start, resolvedSymbol.location.range.end);
                        }
                        else {
                            // the symbol didn't resolve -> use given symbol
                            this.openURL(uri, sym.location.range.start, sym.location.range.end);
                        }
                    });
                }
                else {
                    // resolveWorkspaceSymbol wasn't specified
                    this.openURL(uri, sym.location.range.start, sym.location.range.end);
                }
            }
        });
    }
    toCssClassName(symbolKind, inline) {
        const kind = SymbolKind[symbolKind];
        if (!kind) {
            return undefined;
        }
        return [`codicon ${inline ? 'inline' : 'block'} codicon-symbol-${kind.toLowerCase() || 'property'}`];
    }
    openURL(uri, start, end) {
        this.openerService.getOpener(uri).then(opener => opener.open(uri, {
            selection: vscode_languageserver_protocol_1.Range.create(start, end)
        }));
    }
};
WorkspaceSymbolCommand.PREFIX = '#';
__decorate([
    (0, inversify_1.inject)(monaco_languages_1.MonacoLanguages),
    __metadata("design:type", monaco_languages_1.MonacoLanguages)
], WorkspaceSymbolCommand.prototype, "languages", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], WorkspaceSymbolCommand.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(quick_input_1.QuickInputService),
    __metadata("design:type", Object)
], WorkspaceSymbolCommand.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(quick_input_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], WorkspaceSymbolCommand.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], WorkspaceSymbolCommand.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], WorkspaceSymbolCommand.prototype, "labelProvider", void 0);
WorkspaceSymbolCommand = WorkspaceSymbolCommand_1 = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceSymbolCommand);
exports.WorkspaceSymbolCommand = WorkspaceSymbolCommand;
var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 1] = "File";
    SymbolKind[SymbolKind["Module"] = 2] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 3] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 4] = "Package";
    SymbolKind[SymbolKind["Class"] = 5] = "Class";
    SymbolKind[SymbolKind["Method"] = 6] = "Method";
    SymbolKind[SymbolKind["Property"] = 7] = "Property";
    SymbolKind[SymbolKind["Field"] = 8] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 9] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 10] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 11] = "Interface";
    SymbolKind[SymbolKind["Function"] = 12] = "Function";
    SymbolKind[SymbolKind["Variable"] = 13] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 14] = "Constant";
    SymbolKind[SymbolKind["String"] = 15] = "String";
    SymbolKind[SymbolKind["Number"] = 16] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 17] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 18] = "Array";
    SymbolKind[SymbolKind["Object"] = 19] = "Object";
    SymbolKind[SymbolKind["Key"] = 20] = "Key";
    SymbolKind[SymbolKind["Null"] = 21] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 22] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 23] = "Struct";
    SymbolKind[SymbolKind["Event"] = 24] = "Event";
    SymbolKind[SymbolKind["Operator"] = 25] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 26] = "TypeParameter";
})(SymbolKind || (SymbolKind = {}));
//# sourceMappingURL=workspace-symbol-command.js.map