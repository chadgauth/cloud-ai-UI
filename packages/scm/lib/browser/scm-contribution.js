"use strict";
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
exports.ScmContribution = exports.ScmColors = exports.SCM_COMMANDS = exports.SCM_VIEW_CONTAINER_TITLE_OPTIONS = exports.SCM_VIEW_CONTAINER_ID = exports.SCM_WIDGET_FACTORY_ID = void 0;
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const scm_service_1 = require("./scm-service");
const scm_widget_1 = require("../browser/scm-widget");
const uri_1 = require("@theia/core/lib/common/uri");
const scm_quick_open_service_1 = require("./scm-quick-open-service");
const color_1 = require("@theia/core/lib/common/color");
const scm_decorations_service_1 = require("../browser/decorations/scm-decorations-service");
const nls_1 = require("@theia/core/lib/common/nls");
const theme_1 = require("@theia/core/lib/common/theme");
exports.SCM_WIDGET_FACTORY_ID = scm_widget_1.ScmWidget.ID;
exports.SCM_VIEW_CONTAINER_ID = 'scm-view-container';
exports.SCM_VIEW_CONTAINER_TITLE_OPTIONS = {
    label: nls_1.nls.localizeByDefault('Source Control'),
    iconClass: (0, browser_1.codicon)('source-control'),
    closeable: true
};
var SCM_COMMANDS;
(function (SCM_COMMANDS) {
    SCM_COMMANDS.CHANGE_REPOSITORY = {
        id: 'scm.change.repository',
        category: nls_1.nls.localizeByDefault('Source Control'),
        originalCategory: 'Source Control',
        label: nls_1.nls.localize('theia/scm/changeRepository', 'Change Repository...'),
        originalLabel: 'Change Repository...'
    };
    SCM_COMMANDS.ACCEPT_INPUT = {
        id: 'scm.acceptInput'
    };
    SCM_COMMANDS.TREE_VIEW_MODE = {
        id: 'scm.viewmode.tree',
        tooltip: nls_1.nls.localizeByDefault('View as Tree'),
        iconClass: (0, browser_1.codicon)('list-tree'),
        originalLabel: 'View as Tree',
        label: nls_1.nls.localizeByDefault('View as Tree')
    };
    SCM_COMMANDS.LIST_VIEW_MODE = {
        id: 'scm.viewmode.list',
        tooltip: nls_1.nls.localizeByDefault('View as List'),
        iconClass: (0, browser_1.codicon)('list-flat'),
        originalLabel: 'View as List',
        label: nls_1.nls.localizeByDefault('View as List')
    };
    SCM_COMMANDS.COLLAPSE_ALL = {
        id: 'scm.collapseAll',
        category: nls_1.nls.localizeByDefault('Source Control'),
        originalCategory: 'Source Control',
        tooltip: nls_1.nls.localizeByDefault('Collapse All'),
        iconClass: (0, browser_1.codicon)('collapse-all'),
        label: nls_1.nls.localizeByDefault('Collapse All'),
        originalLabel: 'Collapse All'
    };
})(SCM_COMMANDS = exports.SCM_COMMANDS || (exports.SCM_COMMANDS = {}));
var ScmColors;
(function (ScmColors) {
    ScmColors.editorGutterModifiedBackground = 'editorGutter.modifiedBackground';
    ScmColors.editorGutterAddedBackground = 'editorGutter.addedBackground';
    ScmColors.editorGutterDeletedBackground = 'editorGutter.deletedBackground';
})(ScmColors = exports.ScmColors || (exports.ScmColors = {}));
let ScmContribution = class ScmContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            viewContainerId: exports.SCM_VIEW_CONTAINER_ID,
            widgetId: exports.SCM_WIDGET_FACTORY_ID,
            widgetName: exports.SCM_VIEW_CONTAINER_TITLE_OPTIONS.label,
            defaultWidgetOptions: {
                area: 'left',
                rank: 300
            },
            toggleCommandId: 'scmView:toggle',
            toggleKeybinding: 'ctrlcmd+shift+g'
        });
        this.statusBarDisposable = new common_1.DisposableCollection();
    }
    init() {
        this.scmFocus = this.contextKeys.createKey('scmFocus', false);
    }
    async initializeLayout() {
        await this.openView();
    }
    onStart() {
        this.updateStatusBar();
        this.scmService.onDidAddRepository(() => this.updateStatusBar());
        this.scmService.onDidRemoveRepository(() => this.updateStatusBar());
        this.scmService.onDidChangeSelectedRepository(() => this.updateStatusBar());
        this.scmService.onDidChangeStatusBarCommands(() => this.updateStatusBar());
        this.labelProvider.onDidChange(() => this.updateStatusBar());
        this.updateContextKeys();
        this.shell.onDidChangeCurrentWidget(() => this.updateContextKeys());
    }
    updateContextKeys() {
        this.scmFocus.set(this.shell.currentWidget instanceof scm_widget_1.ScmWidget);
    }
    registerCommands(commandRegistry) {
        super.registerCommands(commandRegistry);
        commandRegistry.registerCommand(SCM_COMMANDS.CHANGE_REPOSITORY, {
            execute: () => this.scmQuickOpenService.changeRepository(),
            isEnabled: () => this.scmService.repositories.length > 1
        });
        commandRegistry.registerCommand(SCM_COMMANDS.ACCEPT_INPUT, {
            execute: () => this.acceptInput(),
            isEnabled: () => !!this.scmFocus.get() && !!this.acceptInputCommand()
        });
    }
    registerToolbarItems(registry) {
        const viewModeEmitter = new event_1.Emitter();
        const registerToggleViewItem = (command, mode) => {
            const id = command.id;
            const item = {
                id,
                command: id,
                tooltip: command.label,
                onDidChange: viewModeEmitter.event
            };
            this.commandRegistry.registerCommand({ id, iconClass: command && command.iconClass }, {
                execute: widget => {
                    if (widget instanceof scm_widget_1.ScmWidget) {
                        widget.viewMode = mode;
                        viewModeEmitter.fire();
                    }
                },
                isVisible: widget => {
                    if (widget instanceof scm_widget_1.ScmWidget) {
                        return !!this.scmService.selectedRepository
                            && widget.viewMode !== mode;
                    }
                    return false;
                },
            });
            registry.registerItem(item);
        };
        registerToggleViewItem(SCM_COMMANDS.TREE_VIEW_MODE, 'tree');
        registerToggleViewItem(SCM_COMMANDS.LIST_VIEW_MODE, 'list');
        this.commandRegistry.registerCommand(SCM_COMMANDS.COLLAPSE_ALL, {
            execute: widget => {
                if (widget instanceof scm_widget_1.ScmWidget && widget.viewMode === 'tree') {
                    widget.collapseScmTree();
                }
            },
            isVisible: widget => {
                if (widget instanceof scm_widget_1.ScmWidget) {
                    return !!this.scmService.selectedRepository && widget.viewMode === 'tree';
                }
                return false;
            }
        });
        registry.registerItem({
            ...SCM_COMMANDS.COLLAPSE_ALL,
            command: SCM_COMMANDS.COLLAPSE_ALL.id
        });
    }
    registerKeybindings(keybindings) {
        super.registerKeybindings(keybindings);
        keybindings.registerKeybinding({
            command: SCM_COMMANDS.ACCEPT_INPUT.id,
            keybinding: 'ctrlcmd+enter',
            when: 'scmFocus'
        });
    }
    async acceptInput() {
        const command = this.acceptInputCommand();
        if (command && command.command) {
            await this.commands.executeCommand(command.command, ...command.arguments ? command.arguments : []);
        }
    }
    acceptInputCommand() {
        const repository = this.scmService.selectedRepository;
        if (!repository) {
            return undefined;
        }
        return repository.provider.acceptInputCommand;
    }
    updateStatusBar() {
        this.statusBarDisposable.dispose();
        const repository = this.scmService.selectedRepository;
        if (!repository) {
            return;
        }
        const name = this.labelProvider.getName(new uri_1.default(repository.provider.rootUri));
        if (this.scmService.repositories.length > 1) {
            this.setStatusBarEntry(SCM_COMMANDS.CHANGE_REPOSITORY.id, {
                text: `$(database) ${name}`,
                tooltip: name.toString(),
                command: SCM_COMMANDS.CHANGE_REPOSITORY.id,
                alignment: browser_1.StatusBarAlignment.LEFT,
                priority: 100
            });
        }
        const label = repository.provider.rootUri ? `${name} (${repository.provider.label})` : repository.provider.label;
        this.scmService.statusBarCommands.forEach((value, index) => this.setStatusBarEntry(`scm.status.${index}`, {
            text: value.title,
            tooltip: label + (value.tooltip ? ` - ${value.tooltip}` : ''),
            command: value.command,
            arguments: value.arguments,
            alignment: browser_1.StatusBarAlignment.LEFT,
            priority: 100
        }));
    }
    setStatusBarEntry(id, entry) {
        this.statusBar.setElement(id, entry);
        this.statusBarDisposable.push(common_1.Disposable.create(() => this.statusBar.removeElement(id)));
    }
    /**
     * It should be aligned with https://github.com/microsoft/vscode/blob/0dfa355b3ad185a6289ba28a99c141ab9e72d2be/src/vs/workbench/contrib/scm/browser/dirtydiffDecorator.ts#L808
     */
    registerColors(colors) {
        colors.register({
            id: ScmColors.editorGutterModifiedBackground, defaults: {
                dark: '#1B81A8',
                light: '#2090D3',
                hcDark: '#1B81A8',
                hcLight: '#2090D3'
            }, description: 'Editor gutter background color for lines that are modified.'
        }, {
            id: ScmColors.editorGutterAddedBackground, defaults: {
                dark: '#487E02',
                light: '#48985D',
                hcDark: '#487E02',
                hcLight: '#48985D'
            }, description: 'Editor gutter background color for lines that are added.'
        }, {
            id: ScmColors.editorGutterDeletedBackground, defaults: {
                dark: 'editorError.foreground',
                light: 'editorError.foreground',
                hcDark: 'editorError.foreground',
                hcLight: 'editorError.foreground'
            }, description: 'Editor gutter background color for lines that are deleted.'
        }, {
            id: 'minimapGutter.modifiedBackground', defaults: {
                dark: 'editorGutter.modifiedBackground',
                light: 'editorGutter.modifiedBackground',
                hcDark: 'editorGutter.modifiedBackground',
                hcLight: 'editorGutter.modifiedBackground'
            }, description: 'Minimap gutter background color for lines that are modified.'
        }, {
            id: 'minimapGutter.addedBackground', defaults: {
                dark: 'editorGutter.addedBackground',
                light: 'editorGutter.addedBackground',
                hcDark: 'editorGutter.modifiedBackground',
                hcLight: 'editorGutter.modifiedBackground'
            }, description: 'Minimap gutter background color for lines that are added.'
        }, {
            id: 'minimapGutter.deletedBackground', defaults: {
                dark: 'editorGutter.deletedBackground',
                light: 'editorGutter.deletedBackground',
                hcDark: 'editorGutter.deletedBackground',
                hcLight: 'editorGutter.deletedBackground'
            }, description: 'Minimap gutter background color for lines that are deleted.'
        }, {
            id: 'editorOverviewRuler.modifiedForeground', defaults: {
                dark: color_1.Color.transparent(ScmColors.editorGutterModifiedBackground, 0.6),
                light: color_1.Color.transparent(ScmColors.editorGutterModifiedBackground, 0.6),
                hcDark: color_1.Color.transparent(ScmColors.editorGutterModifiedBackground, 0.6),
                hcLight: color_1.Color.transparent(ScmColors.editorGutterModifiedBackground, 0.6)
            }, description: 'Overview ruler marker color for modified content.'
        }, {
            id: 'editorOverviewRuler.addedForeground', defaults: {
                dark: color_1.Color.transparent(ScmColors.editorGutterAddedBackground, 0.6),
                light: color_1.Color.transparent(ScmColors.editorGutterAddedBackground, 0.6),
                hcDark: color_1.Color.transparent(ScmColors.editorGutterAddedBackground, 0.6),
                hcLight: color_1.Color.transparent(ScmColors.editorGutterAddedBackground, 0.6)
            }, description: 'Overview ruler marker color for added content.'
        }, {
            id: 'editorOverviewRuler.deletedForeground', defaults: {
                dark: color_1.Color.transparent(ScmColors.editorGutterDeletedBackground, 0.6),
                light: color_1.Color.transparent(ScmColors.editorGutterDeletedBackground, 0.6),
                hcDark: color_1.Color.transparent(ScmColors.editorGutterDeletedBackground, 0.6),
                hcLight: color_1.Color.transparent(ScmColors.editorGutterDeletedBackground, 0.6)
            }, description: 'Overview ruler marker color for deleted content.'
        });
    }
    registerThemeStyle(theme, collector) {
        const contrastBorder = theme.getColor('contrastBorder');
        if (contrastBorder && (0, theme_1.isHighContrast)(theme.type)) {
            collector.addRule(`
                .theia-scm-input-message-container textarea {
                    outline: var(--theia-border-width) solid ${contrastBorder};
                    outline-offset: -1px;
                }
            `);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.StatusBar),
    __metadata("design:type", Object)
], ScmContribution.prototype, "statusBar", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmContribution.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(scm_quick_open_service_1.ScmQuickOpenService),
    __metadata("design:type", scm_quick_open_service_1.ScmQuickOpenService)
], ScmContribution.prototype, "scmQuickOpenService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], ScmContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], ScmContribution.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], ScmContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], ScmContribution.prototype, "contextKeys", void 0);
__decorate([
    (0, inversify_1.inject)(scm_decorations_service_1.ScmDecorationsService),
    __metadata("design:type", scm_decorations_service_1.ScmDecorationsService)
], ScmContribution.prototype, "scmDecorationsService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmContribution.prototype, "init", null);
ScmContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ScmContribution);
exports.ScmContribution = ScmContribution;
//# sourceMappingURL=scm-contribution.js.map