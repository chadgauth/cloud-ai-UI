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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PreferenceJSONLinkRendererContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceJSONLinkRendererContribution = exports.PreferenceJSONLinkRenderer = void 0;
const preference_node_renderer_1 = require("./preference-node-renderer");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const preference_types_1 = require("../../util/preference-types");
const preference_node_renderer_creator_1 = require("./preference-node-renderer-creator");
let PreferenceJSONLinkRenderer = class PreferenceJSONLinkRenderer extends preference_node_renderer_1.PreferenceLeafNodeRenderer {
    createInteractable(parent) {
        const message = common_1.nls.localizeByDefault('Edit in settings.json');
        const interactable = document.createElement('a');
        this.interactable = interactable;
        interactable.classList.add('theia-json-input');
        interactable.setAttribute('role', 'button');
        interactable.title = message;
        interactable.textContent = message;
        interactable.onclick = this.handleUserInteraction.bind(this);
        interactable.onkeydown = this.handleUserInteraction.bind(this);
        parent.appendChild(interactable);
    }
    getFallbackValue() {
        const node = this.preferenceNode;
        const type = Array.isArray(node.preference.data.type) ? node.preference.data.type[0] : node.preference.data.type;
        switch (type) {
            case 'object':
                return {};
            case 'array':
                return [];
            case 'null':
                return null; // eslint-disable-line no-null/no-null
            default: // Should all be handled by other input types.
                return '';
        }
    }
    doHandleValueChange() {
        this.updateInspection();
        this.updateModificationStatus();
    }
    handleUserInteraction() {
        this.commandService.executeCommand(preference_types_1.PreferencesCommands.OPEN_PREFERENCES_JSON_TOOLBAR.id, this.id);
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], PreferenceJSONLinkRenderer.prototype, "commandService", void 0);
PreferenceJSONLinkRenderer = __decorate([
    (0, inversify_1.injectable)()
], PreferenceJSONLinkRenderer);
exports.PreferenceJSONLinkRenderer = PreferenceJSONLinkRenderer;
let PreferenceJSONLinkRendererContribution = PreferenceJSONLinkRendererContribution_1 = class PreferenceJSONLinkRendererContribution extends preference_node_renderer_creator_1.PreferenceLeafNodeRendererContribution {
    constructor() {
        super(...arguments);
        this.id = PreferenceJSONLinkRendererContribution_1.ID;
    }
    canHandleLeafNode(_node) {
        return 1;
    }
    createLeafNodeRenderer(container) {
        return container.get(PreferenceJSONLinkRenderer);
    }
};
PreferenceJSONLinkRendererContribution.ID = 'preference-json-link-renderer';
PreferenceJSONLinkRendererContribution = PreferenceJSONLinkRendererContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], PreferenceJSONLinkRendererContribution);
exports.PreferenceJSONLinkRendererContribution = PreferenceJSONLinkRendererContribution;
//# sourceMappingURL=preference-json-input.js.map