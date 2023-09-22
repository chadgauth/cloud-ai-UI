"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
var PreferenceNumberInputRendererContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceNumberInputRendererContribution = exports.PreferenceNumberInputRenderer = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const preference_types_1 = require("../../util/preference-types");
const preference_node_renderer_1 = require("./preference-node-renderer");
const preference_node_renderer_creator_1 = require("./preference-node-renderer-creator");
let PreferenceNumberInputRenderer = class PreferenceNumberInputRenderer extends preference_node_renderer_1.PreferenceLeafNodeRenderer {
    get errorMessage() {
        if (!this._errorMessage) {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('pref-error-notification');
            this._errorMessage = errorMessage;
        }
        return this._errorMessage;
    }
    createInteractable(parent) {
        var _a, _b;
        const interactableWrapper = document.createElement('div');
        this.interactableWrapper = interactableWrapper;
        interactableWrapper.classList.add('pref-input-container');
        const interactable = document.createElement('input');
        this.interactable = interactable;
        interactable.type = 'number';
        interactable.step = this.preferenceNode.preference.data.type === 'integer' ? '1' : 'any';
        interactable.classList.add('theia-input');
        interactable.defaultValue = (_b = (_a = this.getValue()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
        interactable.oninput = this.handleUserInteraction.bind(this);
        interactable.onblur = this.handleBlur.bind(this);
        interactableWrapper.appendChild(interactable);
        parent.appendChild(interactableWrapper);
    }
    getFallbackValue() {
        return 0;
    }
    handleUserInteraction() {
        const { value, message } = this.getInputValidation(this.interactable.value);
        if (isNaN(value)) {
            this.showErrorMessage(message);
        }
        else {
            this.hideErrorMessage();
            this.setPreferenceWithDebounce(value);
        }
    }
    async handleBlur() {
        this.hideErrorMessage();
        await this.setPreferenceWithDebounce.flush();
        this.handleValueChange();
    }
    doHandleValueChange() {
        var _a;
        const { value } = this.interactable;
        const currentValue = value.length ? Number(value) : NaN;
        this.updateInspection();
        const newValue = (_a = this.getValue()) !== null && _a !== void 0 ? _a : '';
        this.updateModificationStatus(newValue);
        if (newValue !== currentValue) {
            if (document.activeElement !== this.interactable) {
                this.interactable.value = newValue.toString();
            }
            else {
                this.handleUserInteraction(); // give priority to the value of the input if it is focused.
            }
        }
    }
    getInputValidation(input) {
        const { preference: { data } } = this.preferenceNode;
        const inputValue = Number(input);
        const errorMessages = [];
        if (input === '' || isNaN(inputValue)) {
            return { value: NaN, message: core_1.nls.localizeByDefault('Value must be a number.') };
        }
        if (data.minimum && inputValue < data.minimum) {
            errorMessages.push(core_1.nls.localizeByDefault('Value must be greater than or equal to {0}.', data.minimum));
        }
        ;
        if (data.maximum && inputValue > data.maximum) {
            errorMessages.push(core_1.nls.localizeByDefault('Value must be less than or equal to {0}.', data.maximum));
        }
        ;
        if (data.type === 'integer' && !Number.isInteger(inputValue)) {
            errorMessages.push(core_1.nls.localizeByDefault('Value must be an integer.'));
        }
        return {
            value: errorMessages.length ? NaN : inputValue,
            message: errorMessages.join(' ')
        };
    }
    showErrorMessage(message) {
        this.errorMessage.textContent = message;
        this.interactableWrapper.appendChild(this.errorMessage);
    }
    hideErrorMessage() {
        this.errorMessage.remove();
    }
};
PreferenceNumberInputRenderer = __decorate([
    (0, inversify_1.injectable)()
], PreferenceNumberInputRenderer);
exports.PreferenceNumberInputRenderer = PreferenceNumberInputRenderer;
let PreferenceNumberInputRendererContribution = PreferenceNumberInputRendererContribution_1 = class PreferenceNumberInputRendererContribution extends preference_node_renderer_creator_1.PreferenceLeafNodeRendererContribution {
    constructor() {
        super(...arguments);
        this.id = PreferenceNumberInputRendererContribution_1.ID;
    }
    canHandleLeafNode(node) {
        const type = preference_types_1.Preference.LeafNode.getType(node);
        return type === 'integer' || type === 'number' ? 2 : 0;
    }
    createLeafNodeRenderer(container) {
        return container.get(PreferenceNumberInputRenderer);
    }
};
PreferenceNumberInputRendererContribution.ID = 'preference-number-input-renderer';
PreferenceNumberInputRendererContribution = PreferenceNumberInputRendererContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], PreferenceNumberInputRendererContribution);
exports.PreferenceNumberInputRendererContribution = PreferenceNumberInputRendererContribution;
//# sourceMappingURL=preference-number-input.js.map