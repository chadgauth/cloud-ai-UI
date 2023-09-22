"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["api-samples_lib_browser_menu_sample-menu-contribution_js"],{

/***/ "../api-samples/lib/browser/menu/sample-menu-contribution.js":
/*!*******************************************************************!*\
  !*** ../api-samples/lib/browser/menu/sample-menu-contribution.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TORO Limited and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindSampleMenu = exports.PlaceholderMenuNode = exports.SampleMenuContribution = exports.SampleCommandContribution = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const SampleCommand = {
    id: 'sample-command',
    label: 'Sample Command'
};
const SampleCommand2 = {
    id: 'sample-command2',
    label: 'Sample Command2'
};
const SampleCommandConfirmDialog = {
    id: 'sample-command-confirm-dialog',
    label: 'Sample Confirm Dialog'
};
const SampleComplexCommandConfirmDialog = {
    id: 'sample-command-complex-confirm-dialog',
    label: 'Sample Complex Confirm Dialog'
};
const SampleCommandWithProgressMessage = {
    id: 'sample-command-with-progress',
    label: 'Sample Command With Progress Message'
};
const SampleCommandWithIndeterminateProgressMessage = {
    id: 'sample-command-with-indeterminate-progress',
    label: 'Sample Command With Indeterminate Progress Message'
};
const SampleQuickInputCommand = {
    id: 'sample-quick-input-command',
    category: 'Quick Input',
    label: 'Test Positive Integer'
};
let SampleCommandContribution = class SampleCommandContribution {
    registerCommands(commands) {
        commands.registerCommand({ id: 'create-quick-pick-sample', label: 'Internal QuickPick' }, {
            execute: () => {
                const pick = this.quickInputService.createQuickPick();
                pick.items = [{ label: '1' }, { label: '2' }, { label: '3' }];
                pick.onDidAccept(() => {
                    var _a;
                    console.log(`accepted: ${(_a = pick.selectedItems[0]) === null || _a === void 0 ? void 0 : _a.label}`);
                    pick.hide();
                });
                pick.show();
            }
        });
        commands.registerCommand(SampleCommand, {
            execute: () => {
                alert('This is a sample command!');
            }
        });
        commands.registerCommand(SampleCommand2, {
            execute: () => {
                alert('This is sample command2!');
            }
        });
        commands.registerCommand(SampleCommandConfirmDialog, {
            execute: async () => {
                const choice = await new browser_1.ConfirmDialog({
                    title: 'Sample Confirm Dialog',
                    msg: 'This is a sample with lots of text:' + Array(100)
                        .fill(undefined)
                        .map((element, index) => `\n\nExtra line #${index}`)
                        .join('')
                }).open();
                this.messageService.info(`Sample confirm dialog returned with: \`${JSON.stringify(choice)}\``);
            }
        });
        commands.registerCommand(SampleComplexCommandConfirmDialog, {
            execute: async () => {
                const mainDiv = document.createElement('div');
                for (const color of ['#FF00007F', '#00FF007F', '#0000FF7F']) {
                    const innerDiv = document.createElement('div');
                    innerDiv.textContent = 'This is a sample with lots of text:' + Array(50)
                        .fill(undefined)
                        .map((_, index) => `\n\nExtra line #${index}`)
                        .join('');
                    innerDiv.style.backgroundColor = color;
                    innerDiv.style.padding = '5px';
                    mainDiv.appendChild(innerDiv);
                }
                const choice = await new browser_1.ConfirmDialog({
                    title: 'Sample Confirm Dialog',
                    msg: mainDiv
                }).open();
                this.messageService.info(`Sample confirm dialog returned with: \`${JSON.stringify(choice)}\``);
            }
        });
        commands.registerCommand(SampleQuickInputCommand, {
            execute: async () => {
                const result = await this.quickInputService.input({
                    placeHolder: 'Please provide a positive integer',
                    validateInput: async (input) => {
                        const numericValue = Number(input);
                        if (isNaN(numericValue)) {
                            return 'Invalid: NaN';
                        }
                        else if (numericValue % 2 === 1) {
                            return 'Invalid: Odd Number';
                        }
                        else if (numericValue < 0) {
                            return 'Invalid: Negative Number';
                        }
                        else if (!Number.isInteger(numericValue)) {
                            return 'Invalid: Only Integers Allowed';
                        }
                    }
                });
                if (result) {
                    this.messageService.info(`Positive Integer: ${result}`);
                }
            }
        });
        commands.registerCommand(SampleCommandWithProgressMessage, {
            execute: () => {
                this.messageService
                    .showProgress({
                    text: 'Starting to report progress',
                })
                    .then(progress => {
                    window.setTimeout(() => {
                        progress.report({
                            message: 'First step completed',
                            work: { done: 25, total: 100 }
                        });
                    }, 2000);
                    window.setTimeout(() => {
                        progress.report({
                            message: 'Next step completed',
                            work: { done: 60, total: 100 }
                        });
                    }, 4000);
                    window.setTimeout(() => {
                        progress.report({
                            message: 'Complete',
                            work: { done: 100, total: 100 }
                        });
                    }, 6000);
                    window.setTimeout(() => progress.cancel(), 7000);
                });
            }
        });
        commands.registerCommand(SampleCommandWithIndeterminateProgressMessage, {
            execute: () => {
                this.messageService
                    .showProgress({
                    text: 'Starting to report indeterminate progress',
                })
                    .then(progress => {
                    window.setTimeout(() => {
                        progress.report({
                            message: 'First step completed',
                        });
                    }, 2000);
                    window.setTimeout(() => {
                        progress.report({
                            message: 'Next step completed',
                        });
                    }, 4000);
                    window.setTimeout(() => {
                        progress.report({
                            message: 'Complete',
                        });
                    }, 6000);
                    window.setTimeout(() => progress.cancel(), 7000);
                });
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    __metadata("design:type", Object)
], SampleCommandContribution.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], SampleCommandContribution.prototype, "messageService", void 0);
SampleCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], SampleCommandContribution);
exports.SampleCommandContribution = SampleCommandContribution;
let SampleMenuContribution = class SampleMenuContribution {
    registerMenus(menus) {
        const subMenuPath = [...common_1.MAIN_MENU_BAR, 'sample-menu'];
        menus.registerSubmenu(subMenuPath, 'Sample Menu', {
            order: '2' // that should put the menu right next to the File menu
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: SampleCommand.id,
            order: '0'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: SampleCommand2.id,
            order: '2'
        });
        const subSubMenuPath = [...subMenuPath, 'sample-sub-menu'];
        menus.registerSubmenu(subSubMenuPath, 'Sample sub menu', { order: '2' });
        menus.registerMenuAction(subSubMenuPath, {
            commandId: SampleCommand.id,
            order: '1'
        });
        menus.registerMenuAction(subSubMenuPath, {
            commandId: SampleCommand2.id,
            order: '3'
        });
        const placeholder = new PlaceholderMenuNode([...subSubMenuPath, 'placeholder'].join('-'), 'Placeholder', { order: '0' });
        menus.registerMenuNode(subSubMenuPath, placeholder);
        /**
         * Register an action menu with an invalid command (un-registered and without a label) in order
         * to determine that menus and the layout does not break on startup.
         */
        menus.registerMenuAction(subMenuPath, { commandId: 'invalid-command' });
    }
};
SampleMenuContribution = __decorate([
    (0, inversify_1.injectable)()
], SampleMenuContribution);
exports.SampleMenuContribution = SampleMenuContribution;
/**
 * Special menu node that is not backed by any commands and is always disabled.
 */
class PlaceholderMenuNode {
    constructor(id, label, options) {
        this.id = id;
        this.label = label;
        this.options = options;
    }
    get icon() {
        var _a;
        return (_a = this.options) === null || _a === void 0 ? void 0 : _a.iconClass;
    }
    get sortString() {
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.order) || this.label;
    }
}
exports.PlaceholderMenuNode = PlaceholderMenuNode;
const bindSampleMenu = (bind) => {
    bind(common_1.CommandContribution).to(SampleCommandContribution).inSingletonScope();
    bind(common_1.MenuContribution).to(SampleMenuContribution).inSingletonScope();
};
exports.bindSampleMenu = bindSampleMenu;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/api-samples/lib/browser/menu/sample-menu-contribution'] = this;


/***/ })

}]);
//# sourceMappingURL=api-samples_lib_browser_menu_sample-menu-contribution_js.js.map