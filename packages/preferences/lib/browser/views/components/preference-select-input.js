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
var PreferenceSelectInputRendererContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceSelectInputRendererContribution = exports.PreferenceSelectInputRenderer = void 0;
const preference_node_renderer_1 = require("./preference-node-renderer");
const inversify_1 = require("@theia/core/shared/inversify");
const preference_provider_1 = require("@theia/core/lib/browser/preferences/preference-provider");
const select_component_1 = require("@theia/core/lib/browser/widgets/select-component");
const preference_node_renderer_creator_1 = require("./preference-node-renderer-creator");
const React = require("@theia/core/shared/react");
const client_1 = require("@theia/core/shared/react-dom/client");
const strings_1 = require("@theia/core/lib/common/strings");
let PreferenceSelectInputRenderer = class PreferenceSelectInputRenderer extends preference_node_renderer_1.PreferenceLeafNodeRenderer {
    constructor() {
        super(...arguments);
        this.selectComponent = React.createRef();
        this.selectOptions = [];
    }
    get enumValues() {
        return this.preferenceNode.preference.data.enum;
    }
    updateSelectOptions() {
        var _a, _b, _c, _d;
        const updatedSelectOptions = [];
        const values = this.enumValues;
        const preferenceData = this.preferenceNode.preference.data;
        const defaultValue = preferenceData.default;
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const stringValue = `${value}`;
            const label = (0, strings_1.escapeInvisibleChars)((_b = (_a = preferenceData.enumItemLabels) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : stringValue);
            const detail = preference_provider_1.PreferenceProvider.deepEqual(defaultValue, value) ? 'default' : undefined;
            let enumDescription = (_c = preferenceData.enumDescriptions) === null || _c === void 0 ? void 0 : _c[i];
            let markdown = false;
            const markdownEnumDescription = (_d = preferenceData.markdownEnumDescriptions) === null || _d === void 0 ? void 0 : _d[i];
            if (markdownEnumDescription) {
                enumDescription = this.markdownRenderer.renderInline(markdownEnumDescription);
                markdown = true;
            }
            updatedSelectOptions.push({
                label,
                value: stringValue,
                detail,
                description: enumDescription,
                markdown
            });
        }
        this.selectOptions = updatedSelectOptions;
    }
    createInteractable(parent) {
        this.updateSelectOptions();
        const interactable = document.createElement('div');
        const selectComponent = React.createElement(select_component_1.SelectComponent, {
            options: this.selectOptions,
            defaultValue: this.getDataValue(),
            onChange: (_, index) => this.handleUserInteraction(index),
            ref: this.selectComponent
        });
        this.interactable = interactable;
        const root = (0, client_1.createRoot)(interactable);
        root.render(selectComponent);
        parent.appendChild(interactable);
    }
    getFallbackValue() {
        const { default: schemaDefault, defaultValue, enum: enumValues } = this.preferenceNode.preference.data;
        return schemaDefault !== undefined
            ? schemaDefault : defaultValue !== undefined
            ? defaultValue
            : enumValues[0];
    }
    doHandleValueChange() {
        this.updateInspection();
        this.updateSelectOptions();
        const newValue = this.getDataValue();
        this.updateModificationStatus(this.getValue());
        if (document.activeElement !== this.interactable && this.selectComponent.current) {
            this.selectComponent.current.value = newValue;
        }
    }
    /**
     * Returns the stringified index corresponding to the currently selected value.
     */
    getDataValue() {
        const currentValue = this.getValue();
        let selected = this.enumValues.findIndex(value => preference_provider_1.PreferenceProvider.deepEqual(value, currentValue));
        if (selected === -1) {
            const fallback = this.getFallbackValue();
            selected = this.enumValues.findIndex(value => preference_provider_1.PreferenceProvider.deepEqual(value, fallback));
        }
        return Math.max(selected, 0);
    }
    handleUserInteraction(selected) {
        const value = this.enumValues[selected];
        this.setPreferenceImmediately(value);
    }
};
PreferenceSelectInputRenderer = __decorate([
    (0, inversify_1.injectable)()
], PreferenceSelectInputRenderer);
exports.PreferenceSelectInputRenderer = PreferenceSelectInputRenderer;
let PreferenceSelectInputRendererContribution = PreferenceSelectInputRendererContribution_1 = class PreferenceSelectInputRendererContribution extends preference_node_renderer_creator_1.PreferenceLeafNodeRendererContribution {
    constructor() {
        super(...arguments);
        this.id = PreferenceSelectInputRendererContribution_1.ID;
    }
    canHandleLeafNode(node) {
        return node.preference.data.enum ? 3 : 0;
    }
    createLeafNodeRenderer(container) {
        return container.get(PreferenceSelectInputRenderer);
    }
};
PreferenceSelectInputRendererContribution.ID = 'preference-select-input-renderer';
PreferenceSelectInputRendererContribution = PreferenceSelectInputRendererContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], PreferenceSelectInputRendererContribution);
exports.PreferenceSelectInputRendererContribution = PreferenceSelectInputRendererContribution;
//# sourceMappingURL=preference-select-input.js.map