"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
exports.KernelPickerMRUStrategy = exports.NotebookKernelQuickPickServiceImpl = exports.NotebookKernelQuickPickService = exports.JUPYTER_EXTENSION_ID = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const notebook_kernel_service_1 = require("./notebook-kernel-service");
const browser_1 = require("@theia/core/lib/browser");
const notebook_kernel_history_service_1 = require("./notebook-kernel-history-service");
const debounce = require("@theia/core/shared/lodash.debounce");
exports.JUPYTER_EXTENSION_ID = 'ms-toolsai.jupyter';
exports.NotebookKernelQuickPickService = Symbol('NotebookKernelQuickPickService');
function isKernelPick(item) {
    return 'kernel' in item;
}
function isGroupedKernelsPick(item) {
    return 'kernels' in item;
}
function isSourcePick(item) {
    return 'action' in item;
}
function isKernelSourceQuickPickItem(item) {
    return 'command' in item;
}
function supportAutoRun(item) {
    return 'autoRun' in item && !!item.autoRun;
}
const KERNEL_PICKER_UPDATE_DEBOUNCE = 200;
function toKernelQuickPick(kernel, selected) {
    const res = {
        kernel,
        label: kernel.label,
        description: kernel.description,
        detail: kernel.detail
    };
    if (kernel.id === (selected === null || selected === void 0 ? void 0 : selected.id)) {
        if (!res.description) {
            res.description = core_1.nls.localizeByDefault('Currently Selected');
        }
        else {
            res.description = core_1.nls.localizeByDefault('{0} - Currently Selected', res.description);
        }
    }
    return res;
}
let NotebookKernelQuickPickServiceImpl = class NotebookKernelQuickPickServiceImpl {
    async showQuickPick(editor, wantedId, skipAutoRun) {
        const notebook = editor;
        const matchResult = this.getMatchingResult(notebook);
        const { selected, all } = matchResult;
        let newKernel;
        if (wantedId) {
            for (const candidate of all) {
                if (candidate.id === wantedId) {
                    newKernel = candidate;
                    break;
                }
            }
            if (!newKernel) {
                console.warn(`wanted kernel DOES NOT EXIST, wanted: ${wantedId}, all: ${all.map(k => k.id)}`);
                return false;
            }
        }
        if (newKernel) {
            this.selectKernel(notebook, newKernel);
            return true;
        }
        const quickPick = this.quickInputService.createQuickPick();
        const quickPickItems = this.getKernelPickerQuickPickItems(matchResult);
        if (quickPickItems.length === 1 && supportAutoRun(quickPickItems[0]) && !skipAutoRun) {
            return this.handleQuickPick(editor, quickPickItems[0], quickPickItems);
        }
        quickPick.items = quickPickItems;
        quickPick.canSelectMany = false;
        quickPick.placeholder = selected
            ? core_1.nls.localizeByDefault("Change kernel for '{0}'", 'current') // TODO get label for current notebook from a label provider
            : core_1.nls.localizeByDefault("Select kernel for '{0}'", 'current');
        quickPick.busy = this.notebookKernelService.getKernelDetectionTasks(notebook).length > 0;
        const kernelDetectionTaskListener = this.notebookKernelService.onDidChangeKernelDetectionTasks(() => {
            quickPick.busy = this.notebookKernelService.getKernelDetectionTasks(notebook).length > 0;
        });
        const kernelChangeEventListener = debounce(core_1.Event.any(this.notebookKernelService.onDidChangeSourceActions, this.notebookKernelService.onDidAddKernel, this.notebookKernelService.onDidRemoveKernel, this.notebookKernelService.onDidChangeNotebookAffinity), KERNEL_PICKER_UPDATE_DEBOUNCE)(async () => {
            // reset quick pick progress
            quickPick.busy = false;
            const currentActiveItems = quickPick.activeItems;
            const newMatchResult = this.getMatchingResult(notebook);
            const newQuickPickItems = this.getKernelPickerQuickPickItems(newMatchResult);
            quickPick.keepScrollPosition = true;
            // recalculate active items
            const activeItems = [];
            for (const item of currentActiveItems) {
                if (isKernelPick(item)) {
                    const kernelId = item.kernel.id;
                    const sameItem = newQuickPickItems.find(pi => isKernelPick(pi) && pi.kernel.id === kernelId);
                    if (sameItem) {
                        activeItems.push(sameItem);
                    }
                }
                else if (isSourcePick(item)) {
                    const sameItem = newQuickPickItems.find(pi => isSourcePick(pi) && pi.action.command.id === item.action.command.id);
                    if (sameItem) {
                        activeItems.push(sameItem);
                    }
                }
            }
            quickPick.items = newQuickPickItems;
            quickPick.activeItems = activeItems;
        }, this);
        const pick = await new Promise((resolve, reject) => {
            quickPick.onDidAccept(() => {
                const item = quickPick.selectedItems[0];
                if (item) {
                    resolve({ selected: item, items: quickPick.items });
                }
                else {
                    resolve({ selected: undefined, items: quickPick.items });
                }
                quickPick.hide();
            });
            quickPick.onDidHide(() => {
                kernelDetectionTaskListener.dispose();
                kernelChangeEventListener === null || kernelChangeEventListener === void 0 ? void 0 : kernelChangeEventListener.dispose();
                quickPick.dispose();
                resolve({ selected: undefined, items: quickPick.items });
            });
            quickPick.show();
        });
        if (pick.selected) {
            return this.handleQuickPick(editor, pick.selected, pick.items);
        }
        return false;
    }
    getMatchingResult(notebook) {
        return this.notebookKernelService.getMatchingKernel(notebook);
    }
    async handleQuickPick(editor, pick, quickPickItems) {
        if (isKernelPick(pick)) {
            const newKernel = pick.kernel;
            this.selectKernel(editor, newKernel);
            return true;
        }
        if (isSourcePick(pick)) {
            // selected explicitly, it should trigger the execution?
            pick.action.run();
        }
        return true;
    }
    selectKernel(notebook, kernel) {
        this.notebookKernelService.selectKernelForNotebook(kernel, notebook);
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_kernel_service_1.NotebookKernelService),
    __metadata("design:type", notebook_kernel_service_1.NotebookKernelService)
], NotebookKernelQuickPickServiceImpl.prototype, "notebookKernelService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.QuickInputService),
    __metadata("design:type", Object)
], NotebookKernelQuickPickServiceImpl.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandService),
    __metadata("design:type", Object)
], NotebookKernelQuickPickServiceImpl.prototype, "commandService", void 0);
NotebookKernelQuickPickServiceImpl = __decorate([
    (0, inversify_1.injectable)()
], NotebookKernelQuickPickServiceImpl);
exports.NotebookKernelQuickPickServiceImpl = NotebookKernelQuickPickServiceImpl;
let KernelPickerMRUStrategy = class KernelPickerMRUStrategy extends NotebookKernelQuickPickServiceImpl {
    getKernelPickerQuickPickItems(matchResult) {
        const quickPickItems = [];
        if (matchResult.selected) {
            const kernelItem = toKernelQuickPick(matchResult.selected, matchResult.selected);
            quickPickItems.push(kernelItem);
        }
        // TODO use suggested here when kernel affinity is implemented. For now though show all kernels
        matchResult.all.filter(kernel => { var _a; return kernel.id !== ((_a = matchResult.selected) === null || _a === void 0 ? void 0 : _a.id); }).map(kernel => toKernelQuickPick(kernel, matchResult.selected))
            .forEach(kernel => {
            quickPickItems.push(kernel);
        });
        const shouldAutoRun = quickPickItems.length === 0;
        if (quickPickItems.length > 0) {
            quickPickItems.push({
                type: 'separator'
            });
        }
        // select another kernel quick pick
        quickPickItems.push({
            id: 'selectAnother',
            label: core_1.nls.localizeByDefault('Select Another Kernel...'),
            autoRun: shouldAutoRun
        });
        return quickPickItems;
    }
    selectKernel(notebook, kernel) {
        const currentInfo = this.notebookKernelService.getMatchingKernel(notebook);
        if (currentInfo.selected) {
            // there is already a selected kernel
            this.notebookKernelHistoryService.addMostRecentKernel(currentInfo.selected);
        }
        super.selectKernel(notebook, kernel);
        this.notebookKernelHistoryService.addMostRecentKernel(kernel);
    }
    getMatchingResult(notebook) {
        const { selected, all } = this.notebookKernelHistoryService.getKernels(notebook);
        const matchingResult = this.notebookKernelService.getMatchingKernel(notebook);
        return {
            selected: selected,
            all: matchingResult.all,
            suggestions: all,
            hidden: []
        };
    }
    async handleQuickPick(editor, pick, items) {
        if (pick.id === 'selectAnother') {
            return this.displaySelectAnotherQuickPick(editor, items.length === 1 && items[0] === pick);
        }
        return super.handleQuickPick(editor, pick, items);
    }
    async displaySelectAnotherQuickPick(editor, kernelListEmpty) {
        const notebook = editor;
        const disposables = new core_1.DisposableCollection();
        const quickPick = this.quickInputService.createQuickPick();
        const quickPickItem = await new Promise(resolve => {
            // select from kernel sources
            quickPick.title = kernelListEmpty ? core_1.nls.localizeByDefault('Select Kernel') : core_1.nls.localizeByDefault('Select Another Kernel');
            quickPick.placeholder = core_1.nls.localizeByDefault('Type to choose a kernel source');
            quickPick.busy = true;
            // quickPick.buttons = [this.quickInputService.backButton];
            quickPick.show();
            disposables.push(quickPick.onDidTriggerButton(button => {
                if (button === this.quickInputService.backButton) {
                    resolve(button);
                }
            }));
            quickPick.onDidTriggerItemButton(async (e) => {
                if (isKernelSourceQuickPickItem(e.item) && e.item.documentation !== undefined) {
                    const uri = core_1.URI.isUri(e.item.documentation) ? new core_1.URI(e.item.documentation) : await this.commandService.executeCommand(e.item.documentation);
                    if (uri) {
                        (await this.openerService.getOpener(uri, { openExternal: true })).open(uri, { openExternal: true });
                    }
                }
            });
            disposables.push(quickPick.onDidAccept(async () => {
                resolve(quickPick.selectedItems[0]);
            }));
            disposables.push(quickPick.onDidHide(() => {
                resolve(undefined);
            }));
            this.calculateKernelSources(editor).then(quickPickItems => {
                quickPick.items = quickPickItems;
                if (quickPick.items.length > 0) {
                    quickPick.busy = false;
                }
            });
            debounce(core_1.Event.any(this.notebookKernelService.onDidChangeSourceActions, this.notebookKernelService.onDidAddKernel, this.notebookKernelService.onDidRemoveKernel), KERNEL_PICKER_UPDATE_DEBOUNCE)(async () => {
                quickPick.busy = true;
                const quickPickItems = await this.calculateKernelSources(editor);
                quickPick.items = quickPickItems;
                quickPick.busy = false;
            });
        });
        quickPick.hide();
        disposables.dispose();
        if (quickPickItem === this.quickInputService.backButton) {
            return this.showQuickPick(editor, undefined, true);
        }
        if (quickPickItem) {
            const selectedKernelPickItem = quickPickItem;
            if (isKernelSourceQuickPickItem(selectedKernelPickItem)) {
                try {
                    const selectedKernelId = await this.executeCommand(notebook, selectedKernelPickItem.command);
                    if (selectedKernelId) {
                        const { all } = this.getMatchingResult(notebook);
                        const notebookKernel = all.find(kernel => kernel.id === `ms-toolsai.jupyter/${selectedKernelId}`);
                        if (notebookKernel) {
                            this.selectKernel(notebook, notebookKernel);
                            return true;
                        }
                        return true;
                    }
                    else {
                        return this.displaySelectAnotherQuickPick(editor, false);
                    }
                }
                catch (ex) {
                    return false;
                }
            }
            else if (isKernelPick(selectedKernelPickItem)) {
                this.selectKernel(notebook, selectedKernelPickItem.kernel);
                return true;
            }
            else if (isGroupedKernelsPick(selectedKernelPickItem)) {
                await this.selectOneKernel(notebook, selectedKernelPickItem.source, selectedKernelPickItem.kernels);
                return true;
            }
            else if (isSourcePick(selectedKernelPickItem)) {
                // selected explicilty, it should trigger the execution?
                try {
                    await selectedKernelPickItem.action.run();
                    return true;
                }
                catch (ex) {
                    return false;
                }
            }
            // } else if (isSearchMarketplacePick(selectedKernelPickItem)) {
            //     await this.showKernelExtension(
            //         this.paneCompositePartService,
            //         this.extensionWorkbenchService,
            //         this.extensionService,
            //         editor.textModel.viewType,
            //         []
            //     );
            //     return true;
            // } else if (isInstallExtensionPick(selectedKernelPickItem)) {
            //     await this.showKernelExtension(
            //         this.paneCompositePartService,
            //         this.extensionWorkbenchService,
            //         this.extensionService,
            //         editor.textModel.viewType,
            //         selectedKernelPickItem.extensionIds,
            //     );
            //     return true;
            // }
        }
        return false;
    }
    async calculateKernelSources(editor) {
        const notebook = editor;
        const actions = await this.notebookKernelService.getKernelSourceActionsFromProviders(notebook);
        const matchResult = this.getMatchingResult(notebook);
        const others = matchResult.all.filter(item => item.extension !== exports.JUPYTER_EXTENSION_ID);
        const quickPickItems = [];
        // group controllers by extension
        for (const group of core_1.ArrayUtils.groupBy(others, (a, b) => a.extension === b.extension ? 0 : 1)) {
            const source = group[0].extension;
            if (group.length > 1) {
                quickPickItems.push({
                    label: source,
                    kernels: group
                });
            }
            else {
                quickPickItems.push({
                    label: group[0].label,
                    kernel: group[0]
                });
            }
        }
        const validActions = actions.filter(action => action.command);
        quickPickItems.push(...validActions.map(action => {
            const buttons = action.documentation ? [{
                    iconClass: (0, browser_1.codicon)('info'),
                    tooltip: core_1.nls.localizeByDefault('Learn More'),
                }] : [];
            return {
                id: typeof action.command === 'string' ? action.command : action.command.id,
                label: action.label,
                description: action.description,
                command: action.command,
                documentation: action.documentation,
                buttons
            };
        }));
        return quickPickItems;
    }
    async selectOneKernel(notebook, source, kernels) {
        const quickPickItems = kernels.map(kernel => toKernelQuickPick(kernel, undefined));
        const quickPick = this.quickInputService.createQuickPick();
        quickPick.items = quickPickItems;
        quickPick.canSelectMany = false;
        quickPick.title = core_1.nls.localizeByDefault('Select Kernel from {0}', source);
        quickPick.onDidAccept(async () => {
            if (quickPick.selectedItems && quickPick.selectedItems.length > 0 && isKernelPick(quickPick.selectedItems[0])) {
                this.selectKernel(notebook, quickPick.selectedItems[0].kernel);
            }
            quickPick.hide();
            quickPick.dispose();
        });
        quickPick.onDidHide(() => {
            quickPick.dispose();
        });
        quickPick.show();
    }
    async executeCommand(notebook, command) {
        const id = typeof command === 'string' ? command : command.id;
        return this.commandService.executeCommand(id, { uri: notebook.uri });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], KernelPickerMRUStrategy.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_history_service_1.NotebookKernelHistoryService),
    __metadata("design:type", notebook_kernel_history_service_1.NotebookKernelHistoryService)
], KernelPickerMRUStrategy.prototype, "notebookKernelHistoryService", void 0);
KernelPickerMRUStrategy = __decorate([
    (0, inversify_1.injectable)()
], KernelPickerMRUStrategy);
exports.KernelPickerMRUStrategy = KernelPickerMRUStrategy;
//# sourceMappingURL=notebook-kernel-quick-pick-service.js.map