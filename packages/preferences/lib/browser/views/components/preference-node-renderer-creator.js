"use strict";
// *****************************************************************************
// Copyright (C) 2022 EclipseSource and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PreferenceHeaderRendererContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceHeaderRendererContribution = exports.PreferenceLeafNodeRendererContribution = exports.DefaultPreferenceNodeRendererCreatorRegistry = exports.PreferenceNodeRendererCreator = exports.PreferenceNodeRendererContribution = exports.PreferenceNodeRendererCreatorRegistry = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const preference_types_1 = require("../../util/preference-types");
const preference_node_renderer_1 = require("./preference-node-renderer");
exports.PreferenceNodeRendererCreatorRegistry = Symbol('PreferenceNodeRendererCreatorRegistry');
exports.PreferenceNodeRendererContribution = Symbol('PreferenceNodeRendererContribution');
exports.PreferenceNodeRendererCreator = Symbol('PreferenceNodeRendererCreator');
let DefaultPreferenceNodeRendererCreatorRegistry = class DefaultPreferenceNodeRendererCreatorRegistry {
    constructor(contributionProvider) {
        this.contributionProvider = contributionProvider;
        this._creators = new Map();
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        const contributions = this.contributionProvider.getContributions();
        for (const contrib of contributions) {
            contrib.registerPreferenceNodeRendererCreator(this);
        }
    }
    registerPreferenceNodeRendererCreator(creator) {
        if (this._creators.has(creator.id)) {
            console.warn(`A preference node renderer creator ${creator.id} is already registered.`);
            return core_1.Disposable.NULL;
        }
        this._creators.set(creator.id, creator);
        this.fireDidChange();
        return core_1.Disposable.create(() => this._creators.delete(creator.id));
    }
    unregisterPreferenceNodeRendererCreator(creator) {
        const id = typeof creator === 'string' ? creator : creator.id;
        if (this._creators.delete(id)) {
            this.fireDidChange();
        }
    }
    getPreferenceNodeRendererCreator(node) {
        const contributions = this.prioritize(node);
        if (contributions.length >= 1) {
            return contributions[0];
        }
        // we already bind a default creator contribution so if that happens it was deliberate
        throw new Error(`There is no contribution for ${node.id}.`);
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    prioritize(node) {
        const prioritized = core_1.Prioritizeable.prioritizeAllSync(Array.from(this._creators.values()), creator => {
            try {
                return creator.canHandle(node);
            }
            catch {
                return 0;
            }
        });
        return prioritized.map(p => p.value);
    }
};
DefaultPreferenceNodeRendererCreatorRegistry = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(core_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.PreferenceNodeRendererContribution)),
    __metadata("design:paramtypes", [Object])
], DefaultPreferenceNodeRendererCreatorRegistry);
exports.DefaultPreferenceNodeRendererCreatorRegistry = DefaultPreferenceNodeRendererCreatorRegistry;
let PreferenceLeafNodeRendererContribution = class PreferenceLeafNodeRendererContribution {
    canHandle(node) {
        return preference_types_1.Preference.LeafNode.is(node) ? this.canHandleLeafNode(node) : 0;
    }
    registerPreferenceNodeRendererCreator(registry) {
        registry.registerPreferenceNodeRendererCreator(this);
    }
    createRenderer(node, container) {
        const child = container.createChild();
        child.bind(preference_types_1.Preference.Node).toConstantValue(node);
        return this.createLeafNodeRenderer(child);
    }
};
PreferenceLeafNodeRendererContribution = __decorate([
    (0, inversify_1.injectable)()
], PreferenceLeafNodeRendererContribution);
exports.PreferenceLeafNodeRendererContribution = PreferenceLeafNodeRendererContribution;
let PreferenceHeaderRendererContribution = PreferenceHeaderRendererContribution_1 = class PreferenceHeaderRendererContribution {
    constructor() {
        this.id = PreferenceHeaderRendererContribution_1.ID;
    }
    registerPreferenceNodeRendererCreator(registry) {
        registry.registerPreferenceNodeRendererCreator(this);
    }
    canHandle(node) {
        return !preference_types_1.Preference.LeafNode.is(node) ? 1 : 0;
    }
    createRenderer(node, container) {
        const grandchild = container.createChild();
        grandchild.bind(preference_types_1.Preference.Node).toConstantValue(node);
        return grandchild.get(preference_node_renderer_1.PreferenceHeaderRenderer);
    }
};
PreferenceHeaderRendererContribution.ID = 'preference-header-renderer';
PreferenceHeaderRendererContribution = PreferenceHeaderRendererContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], PreferenceHeaderRendererContribution);
exports.PreferenceHeaderRendererContribution = PreferenceHeaderRendererContribution;
//# sourceMappingURL=preference-node-renderer-creator.js.map