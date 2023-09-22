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
exports.PluginMenuCommandAdapter = exports.ReferenceCountingSet = void 0;
const core_1 = require("@theia/core");
const resource_context_key_1 = require("@theia/core/lib/browser/resource-context-key");
const inversify_1 = require("@theia/core/shared/inversify");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const tree_widget_selection_1 = require("@theia/core/lib/browser/tree/tree-widget-selection");
const scm_repository_1 = require("@theia/scm/lib/browser/scm-repository");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const common_1 = require("../../../common");
const scm_main_1 = require("../scm-main");
const tree_view_widget_1 = require("../view/tree-view-widget");
const vscode_theia_menu_mappings_1 = require("./vscode-theia-menu-mappings");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
class ReferenceCountingSet {
    constructor(initialMembers) {
        this.references = new Map();
        if (initialMembers) {
            for (const member of initialMembers) {
                this.add(member);
            }
        }
    }
    add(newMember) {
        var _a;
        const value = (_a = this.references.get(newMember)) !== null && _a !== void 0 ? _a : 0;
        this.references.set(newMember, value + 1);
        return this;
    }
    /** @returns true if the deletion results in the removal of the element from the set */
    delete(member) {
        const value = this.references.get(member);
        if (value === undefined) { }
        else if (value <= 1) {
            this.references.delete(member);
            return true;
        }
        else {
            this.references.set(member, value - 1);
        }
        return false;
    }
    has(maybeMember) {
        return this.references.has(maybeMember);
    }
}
exports.ReferenceCountingSet = ReferenceCountingSet;
let PluginMenuCommandAdapter = class PluginMenuCommandAdapter {
    constructor() {
        this.commands = new ReferenceCountingSet();
        this.argumentAdapters = new Map();
        this.separator = ':)(:';
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
    init() {
        const toCommentArgs = (...args) => this.toCommentArgs(...args);
        const firstArgOnly = (...args) => [args[0]];
        const noArgs = () => [];
        const toScmArgs = (...args) => this.toScmArgs(...args);
        const selectedResource = () => this.getSelectedResources();
        const widgetURI = widget => this.codeEditorUtil.is(widget) ? [this.codeEditorUtil.getResourceUri(widget)] : [];
        [
            ['comments/comment/context', toCommentArgs],
            ['comments/comment/title', toCommentArgs],
            ['comments/commentThread/context', toCommentArgs],
            ['debug/callstack/context', firstArgOnly],
            ['debug/variables/context', firstArgOnly],
            ['debug/toolBar', noArgs],
            ['editor/context', selectedResource],
            ['editor/title', widgetURI],
            ['editor/title/context', selectedResource],
            ['editor/title/run', widgetURI],
            ['explorer/context', selectedResource],
            ['scm/resourceFolder/context', toScmArgs],
            ['scm/resourceGroup/context', toScmArgs],
            ['scm/resourceState/context', toScmArgs],
            ['scm/title', () => [this.toScmArg(this.scmService.selectedRepository)]],
            ['timeline/item/context', (...args) => this.toTimelineArgs(...args)],
            ['view/item/context', (...args) => this.toTreeArgs(...args)],
            ['view/title', noArgs],
        ].forEach(([contributionPoint, adapter]) => {
            if (adapter) {
                const paths = vscode_theia_menu_mappings_1.codeToTheiaMappings.get(contributionPoint);
                if (paths) {
                    paths.forEach(path => this.addArgumentAdapter(path, adapter));
                }
            }
        });
        this.addArgumentAdapter(tab_bar_toolbar_1.TAB_BAR_TOOLBAR_CONTEXT_MENU, widgetURI);
    }
    canHandle(menuPath, command, ...commandArgs) {
        if (this.commands.has(command) && this.getArgumentAdapterForMenu(menuPath)) {
            return 500;
        }
        return -1;
    }
    executeCommand(menuPath, command, ...commandArgs) {
        const argumentAdapter = this.getAdapterOrThrow(menuPath);
        return this.commandRegistry.executeCommand(command, ...argumentAdapter(...commandArgs));
    }
    isVisible(menuPath, command, ...commandArgs) {
        const argumentAdapter = this.getAdapterOrThrow(menuPath);
        return this.commandRegistry.isVisible(command, ...argumentAdapter(...commandArgs));
    }
    isEnabled(menuPath, command, ...commandArgs) {
        const argumentAdapter = this.getAdapterOrThrow(menuPath);
        return this.commandRegistry.isEnabled(command, ...argumentAdapter(...commandArgs));
    }
    isToggled(menuPath, command, ...commandArgs) {
        const argumentAdapter = this.getAdapterOrThrow(menuPath);
        return this.commandRegistry.isToggled(command, ...argumentAdapter(...commandArgs));
    }
    getAdapterOrThrow(menuPath) {
        const argumentAdapter = this.getArgumentAdapterForMenu(menuPath);
        if (!argumentAdapter) {
            throw new Error('PluginMenuCommandAdapter attempted to execute command for unregistered menu: ' + JSON.stringify(menuPath));
        }
        return argumentAdapter;
    }
    addCommand(commandId) {
        this.commands.add(commandId);
        return core_1.Disposable.create(() => this.commands.delete(commandId));
    }
    getArgumentAdapterForMenu(menuPath) {
        return this.argumentAdapters.get(menuPath.join(this.separator));
    }
    addArgumentAdapter(menuPath, adapter) {
        this.argumentAdapters.set(menuPath.join(this.separator), adapter);
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    toCommentArgs(...args) {
        const arg = args[0];
        if ('text' in arg) {
            if ('commentUniqueId' in arg) {
                return [{
                        commentControlHandle: arg.thread.controllerHandle,
                        commentThreadHandle: arg.thread.commentThreadHandle,
                        text: arg.text,
                        commentUniqueId: arg.commentUniqueId
                    }];
            }
            return [{
                    commentControlHandle: arg.thread.controllerHandle,
                    commentThreadHandle: arg.thread.commentThreadHandle,
                    text: arg.text
                }];
        }
        return [{
                commentControlHandle: arg.thread.controllerHandle,
                commentThreadHandle: arg.thread.commentThreadHandle,
                commentUniqueId: arg.commentUniqueId
            }];
    }
    toScmArgs(...args) {
        const scmArgs = [];
        for (const arg of args) {
            const scmArg = this.toScmArg(arg);
            if (scmArg) {
                scmArgs.push(scmArg);
            }
        }
        return scmArgs;
    }
    toScmArg(arg) {
        if (arg instanceof scm_repository_1.ScmRepository && arg.provider instanceof scm_main_1.PluginScmProvider) {
            return {
                sourceControlHandle: arg.provider.handle
            };
        }
        if (arg instanceof scm_main_1.PluginScmResourceGroup) {
            return {
                sourceControlHandle: arg.provider.handle,
                resourceGroupHandle: arg.handle
            };
        }
        if (arg instanceof scm_main_1.PluginScmResource) {
            return {
                sourceControlHandle: arg.group.provider.handle,
                resourceGroupHandle: arg.group.handle,
                resourceStateHandle: arg.handle
            };
        }
    }
    toTimelineArgs(...args) {
        var _a;
        const timelineArgs = [];
        const arg = args[0];
        timelineArgs.push(this.toTimelineArg(arg));
        timelineArgs.push(vscode_uri_1.URI.parse(arg.uri));
        timelineArgs.push((_a = arg.source) !== null && _a !== void 0 ? _a : '');
        return timelineArgs;
    }
    toTimelineArg(arg) {
        return {
            timelineHandle: arg.handle,
            source: arg.source,
            uri: arg.uri
        };
    }
    toTreeArgs(...args) {
        const treeArgs = [];
        for (const arg of args) {
            if (common_1.TreeViewItemReference.is(arg)) {
                treeArgs.push(arg);
            }
            else if (Array.isArray(arg)) {
                treeArgs.push(arg.filter(common_1.TreeViewItemReference.is));
            }
        }
        return treeArgs;
    }
    getSelectedResources() {
        var _a, _b;
        const selection = this.selectionService.selection;
        const resourceKey = this.resourceContextKey.get();
        const resourceUri = resourceKey ? vscode_uri_1.URI.parse(resourceKey) : undefined;
        const firstMember = tree_widget_selection_1.TreeWidgetSelection.is(selection) && selection.source instanceof tree_view_widget_1.TreeViewWidget && selection[0]
            ? selection.source.toTreeViewItemReference(selection[0])
            : (_b = (_a = core_1.UriSelection.getUri(selection)) === null || _a === void 0 ? void 0 : _a['codeUri']) !== null && _b !== void 0 ? _b : resourceUri;
        const secondMember = tree_widget_selection_1.TreeWidgetSelection.is(selection)
            ? core_1.UriSelection.getUris(selection).map(uri => uri['codeUri'])
            : undefined;
        return [firstMember, secondMember];
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], PluginMenuCommandAdapter.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(vscode_theia_menu_mappings_1.CodeEditorWidgetUtil),
    __metadata("design:type", vscode_theia_menu_mappings_1.CodeEditorWidgetUtil)
], PluginMenuCommandAdapter.prototype, "codeEditorUtil", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], PluginMenuCommandAdapter.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], PluginMenuCommandAdapter.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(resource_context_key_1.ResourceContextKey),
    __metadata("design:type", resource_context_key_1.ResourceContextKey)
], PluginMenuCommandAdapter.prototype, "resourceContextKey", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginMenuCommandAdapter.prototype, "init", null);
PluginMenuCommandAdapter = __decorate([
    (0, inversify_1.injectable)()
], PluginMenuCommandAdapter);
exports.PluginMenuCommandAdapter = PluginMenuCommandAdapter;
//# sourceMappingURL=plugin-menu-command-adapter.js.map