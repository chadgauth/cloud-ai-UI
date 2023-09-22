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
exports.PreferenceMarkdownRenderer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const preference_tree_model_1 = require("../../preference-tree-model");
const preference_tree_label_provider_1 = require("../../util/preference-tree-label-provider");
const markdownit = require("@theia/core/shared/markdown-it");
let PreferenceMarkdownRenderer = class PreferenceMarkdownRenderer {
    render(text) {
        return this.getRenderer().render(text);
    }
    renderInline(text) {
        return this.getRenderer().renderInline(text);
    }
    getRenderer() {
        var _a;
        (_a = this._renderer) !== null && _a !== void 0 ? _a : (this._renderer = this.buildMarkdownRenderer());
        return this._renderer;
    }
    buildMarkdownRenderer() {
        const engine = markdownit();
        const inlineCode = engine.renderer.rules.code_inline;
        engine.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const content = token.content;
            if (content.startsWith('#') && content.endsWith('#')) {
                const preferenceId = content.substring(1, content.length - 1);
                const preferenceNode = this.model.getNodeFromPreferenceId(preferenceId);
                if (preferenceNode) {
                    let name = this.labelProvider.getName(preferenceNode);
                    const prefix = this.labelProvider.getPrefix(preferenceNode, true);
                    if (prefix) {
                        name = prefix + name;
                    }
                    return `<a title="${preferenceId}" href="preference:${preferenceId}">${name}</a>`;
                }
                else {
                    console.warn(`Linked preference "${preferenceId}" not found.`);
                }
            }
            return inlineCode ? inlineCode(tokens, idx, options, env, self) : '';
        };
        return engine;
    }
};
__decorate([
    (0, inversify_1.inject)(preference_tree_model_1.PreferenceTreeModel),
    __metadata("design:type", preference_tree_model_1.PreferenceTreeModel)
], PreferenceMarkdownRenderer.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(preference_tree_label_provider_1.PreferenceTreeLabelProvider),
    __metadata("design:type", preference_tree_label_provider_1.PreferenceTreeLabelProvider)
], PreferenceMarkdownRenderer.prototype, "labelProvider", void 0);
PreferenceMarkdownRenderer = __decorate([
    (0, inversify_1.injectable)()
], PreferenceMarkdownRenderer);
exports.PreferenceMarkdownRenderer = PreferenceMarkdownRenderer;
//# sourceMappingURL=preference-markdown-renderer.js.map