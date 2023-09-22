"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
var DebugToolBar_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugToolBar = void 0;
const React = require("@theia/core/shared/react");
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const widgets_1 = require("@theia/core/lib/browser/widgets");
const debug_view_model_1 = require("./debug-view-model");
const debug_session_1 = require("../debug-session");
const debug_action_1 = require("./debug-action");
const nls_1 = require("@theia/core/lib/common/nls");
let DebugToolBar = DebugToolBar_1 = class DebugToolBar extends widgets_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.onRender = new core_1.DisposableCollection();
        this.setStepRef = (stepRef) => {
            this.stepRef = stepRef || undefined;
            this.onRender.dispose();
        };
        this.start = () => this.model.start();
        this.restart = () => this.model.restart();
        this.stop = () => this.model.terminate();
        this.continue = () => this.model.currentThread && this.model.currentThread.continue();
        this.pause = () => this.model.currentThread && this.model.currentThread.pause();
        this.stepOver = () => this.model.currentThread && this.model.currentThread.stepOver();
        this.stepIn = () => this.model.currentThread && this.model.currentThread.stepIn();
        this.stepOut = () => this.model.currentThread && this.model.currentThread.stepOut();
    }
    init() {
        this.id = 'debug:toolbar:' + this.model.id;
        this.addClass('debug-toolbar');
        this.toDispose.push(this.model);
        this.toDispose.push(this.model.onDidChange(() => this.update()));
        this.scrollOptions = undefined;
        this.update();
    }
    focus() {
        if (!this.doFocus()) {
            this.onRender.push(core_1.Disposable.create(() => this.doFocus()));
            this.update();
        }
    }
    doFocus() {
        if (!this.stepRef) {
            return false;
        }
        this.stepRef.focus();
        return true;
    }
    render() {
        const { state } = this.model;
        return React.createElement(React.Fragment, null,
            this.renderContributedCommands(),
            this.renderContinue(),
            React.createElement(debug_action_1.DebugAction, { enabled: state === debug_session_1.DebugState.Stopped, run: this.stepOver, label: nls_1.nls.localizeByDefault('Step Over'), iconClass: 'debug-step-over', ref: this.setStepRef }),
            React.createElement(debug_action_1.DebugAction, { enabled: state === debug_session_1.DebugState.Stopped, run: this.stepIn, label: nls_1.nls.localizeByDefault('Step Into'), iconClass: 'debug-step-into' }),
            React.createElement(debug_action_1.DebugAction, { enabled: state === debug_session_1.DebugState.Stopped, run: this.stepOut, label: nls_1.nls.localizeByDefault('Step Out'), iconClass: 'debug-step-out' }),
            React.createElement(debug_action_1.DebugAction, { enabled: state !== debug_session_1.DebugState.Inactive, run: this.restart, label: nls_1.nls.localizeByDefault('Restart'), iconClass: 'debug-restart' }),
            this.renderStart());
    }
    renderContributedCommands() {
        const debugActions = [];
        // first, search for CompoundMenuNodes:
        this.menuModelRegistry.getMenu(DebugToolBar_1.MENU).children.forEach(compoundMenuNode => {
            if (core_1.CompoundMenuNode.is(compoundMenuNode) && this.matchContext(compoundMenuNode.when)) {
                // second, search for nested CommandMenuNodes:
                compoundMenuNode.children.forEach(commandMenuNode => {
                    if (core_1.CommandMenuNode.is(commandMenuNode) && this.matchContext(commandMenuNode.when)) {
                        debugActions.push(this.debugAction(commandMenuNode));
                    }
                });
            }
        });
        return debugActions;
    }
    matchContext(when) {
        return !when || this.contextKeyService.match(when);
    }
    debugAction(commandMenuNode) {
        const { command, icon = '', label = '' } = commandMenuNode;
        if (!label && !icon) {
            const { when } = commandMenuNode;
            console.warn(`Neither 'label' nor 'icon' properties were defined for the command menu node. (${JSON.stringify({ command, when })}}. Skipping.`);
            return;
        }
        const run = () => this.commandRegistry.executeCommand(command);
        return React.createElement(debug_action_1.DebugAction, { key: command, enabled: true, label: label, iconClass: icon, run: run });
    }
    renderStart() {
        const { state } = this.model;
        if (state === debug_session_1.DebugState.Inactive && this.model.sessionCount === 1) {
            return React.createElement(debug_action_1.DebugAction, { run: this.start, label: nls_1.nls.localizeByDefault('Start'), iconClass: 'debug-start' });
        }
        return React.createElement(debug_action_1.DebugAction, { enabled: state !== debug_session_1.DebugState.Inactive, run: this.stop, label: nls_1.nls.localizeByDefault('Stop'), iconClass: 'debug-stop' });
    }
    renderContinue() {
        const { state } = this.model;
        if (state === debug_session_1.DebugState.Stopped) {
            return React.createElement(debug_action_1.DebugAction, { run: this.continue, label: nls_1.nls.localizeByDefault('Continue'), iconClass: 'debug-continue' });
        }
        return React.createElement(debug_action_1.DebugAction, { enabled: state === debug_session_1.DebugState.Running, run: this.pause, label: nls_1.nls.localizeByDefault('Pause'), iconClass: 'debug-pause' });
    }
};
DebugToolBar.MENU = ['debug-toolbar-menu'];
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], DebugToolBar.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MenuModelRegistry),
    __metadata("design:type", core_1.MenuModelRegistry)
], DebugToolBar.prototype, "menuModelRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], DebugToolBar.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugToolBar.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugToolBar.prototype, "init", null);
DebugToolBar = DebugToolBar_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugToolBar);
exports.DebugToolBar = DebugToolBar;
//# sourceMappingURL=debug-toolbar-widget.js.map