"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.PreferenceLeafNodeRenderer = exports.PreferenceHeaderRenderer = exports.PreferenceNodeRenderer = exports.SUBHEADER_CLASS = exports.HEADER_CLASS = exports.PreferenceNodeRendererFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const preference_types_1 = require("../../util/preference-types");
const preference_tree_label_provider_1 = require("../../util/preference-tree-label-provider");
const preference_scope_tabbar_widget_1 = require("../preference-scope-tabbar-widget");
const common_1 = require("@theia/core/lib/common");
const debounce = require("@theia/core/shared/lodash.debounce");
const preference_tree_model_1 = require("../../preference-tree-model");
const preference_searchbar_widget_1 = require("../preference-searchbar-widget");
const DOMPurify = require("@theia/core/shared/dompurify");
const uri_1 = require("@theia/core/lib/common/uri");
const preference_markdown_renderer_1 = require("./preference-markdown-renderer");
exports.PreferenceNodeRendererFactory = Symbol('PreferenceNodeRendererFactory');
exports.HEADER_CLASS = 'settings-section-category-title';
exports.SUBHEADER_CLASS = 'settings-section-subcategory-title';
let PreferenceNodeRenderer = class PreferenceNodeRenderer {
    constructor() {
        this.attached = false;
    }
    get node() {
        return this.domNode;
    }
    get nodeId() {
        return this.preferenceNode.id;
    }
    get id() {
        return this._id;
    }
    get group() {
        return this._group;
    }
    get visible() {
        return !this.node.classList.contains('hidden');
    }
    init() {
        this.setId();
        this.domNode = this.createDomNode();
    }
    setId() {
        var _a;
        const { id, group } = preference_types_1.Preference.TreeNode.getGroupAndIdFromNodeId(this.preferenceNode.id);
        const segments = id.split('.');
        this._id = id;
        this._group = group;
        this._subgroup = (_a = (group === segments[0] ? segments[1] : segments[0])) !== null && _a !== void 0 ? _a : '';
    }
    getAdditionalNodeClassnames() {
        return [];
    }
    insertBefore(nextSibling) {
        nextSibling.insertAdjacentElement('beforebegin', this.domNode);
        this.attached = true;
    }
    insertAfter(previousSibling) {
        previousSibling.insertAdjacentElement('afterend', this.domNode);
    }
    appendTo(parent) {
        parent.appendChild(this.domNode);
    }
    prependTo(parent) {
        parent.prepend(this.domNode);
    }
    hide() {
        this.domNode.classList.add('hidden');
    }
    show() {
        this.domNode.classList.remove('hidden');
    }
    dispose() {
        this.domNode.remove();
    }
};
__decorate([
    (0, inversify_1.inject)(preference_types_1.Preference.Node),
    __metadata("design:type", Object)
], PreferenceNodeRenderer.prototype, "preferenceNode", void 0);
__decorate([
    (0, inversify_1.inject)(preference_tree_label_provider_1.PreferenceTreeLabelProvider),
    __metadata("design:type", preference_tree_label_provider_1.PreferenceTreeLabelProvider)
], PreferenceNodeRenderer.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreferenceNodeRenderer.prototype, "init", null);
PreferenceNodeRenderer = __decorate([
    (0, inversify_1.injectable)()
], PreferenceNodeRenderer);
exports.PreferenceNodeRenderer = PreferenceNodeRenderer;
class PreferenceHeaderRenderer extends PreferenceNodeRenderer {
    createDomNode() {
        const wrapper = document.createElement('ul');
        wrapper.className = 'settings-section';
        wrapper.id = `${this.preferenceNode.id}-editor`;
        const isCategory = preference_types_1.Preference.TreeNode.isTopLevel(this.preferenceNode);
        const hierarchyClassName = isCategory ? exports.HEADER_CLASS : exports.SUBHEADER_CLASS;
        const name = this.labelProvider.getName(this.preferenceNode);
        const label = document.createElement('li');
        label.classList.add('settings-section-title', hierarchyClassName);
        label.textContent = name;
        wrapper.appendChild(label);
        return wrapper;
    }
}
exports.PreferenceHeaderRenderer = PreferenceHeaderRenderer;
let PreferenceLeafNodeRenderer = class PreferenceLeafNodeRenderer extends PreferenceNodeRenderer {
    constructor() {
        super(...arguments);
        this.isModifiedFromDefault = false;
        this.setPreferenceWithDebounce = debounce(this.setPreferenceImmediately.bind(this), 500, { leading: false, trailing: true });
    }
    get schema() {
        return this.preferenceNode.preference.data;
    }
    init() {
        this.setId();
        this.updateInspection();
        this.domNode = this.createDomNode();
        this.updateModificationStatus();
    }
    updateInspection() {
        this.inspection = this.preferenceService.inspect(this.id, this.scopeTracker.currentScope.uri);
    }
    openLink(event) {
        if (event.target instanceof HTMLAnchorElement) {
            event.preventDefault();
            event.stopPropagation();
            // Exclude right click
            if (event.button < 2) {
                const uri = new uri_1.default(event.target.href);
                (0, browser_1.open)(this.openerService, uri);
            }
        }
    }
    createDomNode() {
        const wrapper = document.createElement('li');
        wrapper.classList.add('single-pref');
        wrapper.id = `${this.id}-editor`;
        wrapper.tabIndex = 0;
        wrapper.setAttribute('data-pref-id', this.id);
        wrapper.setAttribute('data-node-id', this.preferenceNode.id);
        const headlineWrapper = document.createElement('div');
        headlineWrapper.classList.add('pref-name');
        headlineWrapper.title = this.id;
        this.headlineWrapper = headlineWrapper;
        wrapper.appendChild(headlineWrapper);
        this.updateHeadline();
        const gutter = document.createElement('div');
        gutter.classList.add('pref-context-gutter');
        this.gutter = gutter;
        wrapper.appendChild(gutter);
        const cog = document.createElement('i');
        cog.className = `${(0, browser_1.codicon)('settings-gear', true)} settings-context-menu-btn`;
        cog.setAttribute('aria-label', 'Open Context Menu');
        cog.setAttribute('role', 'button');
        cog.onclick = this.handleCogAction.bind(this);
        cog.onkeydown = this.handleCogAction.bind(this);
        cog.title = common_1.nls.localizeByDefault('More Actions...');
        gutter.appendChild(cog);
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('pref-content-container', ...this.getAdditionalNodeClassnames());
        wrapper.appendChild(contentWrapper);
        const { description, markdownDescription } = this.preferenceNode.preference.data;
        if (markdownDescription || description) {
            const descriptionWrapper = document.createElement('div');
            descriptionWrapper.classList.add('pref-description');
            if (markdownDescription) {
                const renderedDescription = this.markdownRenderer.render(markdownDescription);
                descriptionWrapper.onauxclick = this.openLink.bind(this);
                descriptionWrapper.onclick = this.openLink.bind(this);
                descriptionWrapper.oncontextmenu = () => false;
                descriptionWrapper.innerHTML = DOMPurify.sanitize(renderedDescription, {
                    ALLOW_UNKNOWN_PROTOCOLS: true
                });
            }
            else if (description) {
                descriptionWrapper.textContent = description;
            }
            contentWrapper.appendChild(descriptionWrapper);
        }
        const interactableWrapper = document.createElement('div');
        interactableWrapper.classList.add('pref-input');
        contentWrapper.appendChild(interactableWrapper);
        this.createInteractable(interactableWrapper);
        return wrapper;
    }
    handleCogAction({ currentTarget }) {
        var _a, _b;
        const value = (_a = preference_types_1.Preference.getValueInScope(this.inspection, this.scopeTracker.currentScope.scope)) !== null && _a !== void 0 ? _a : (_b = this.inspection) === null || _b === void 0 ? void 0 : _b.defaultValue;
        const target = currentTarget;
        if (target && value !== undefined) {
            this.showCog();
            const domRect = target.getBoundingClientRect();
            this.menuRenderer.render({
                menuPath: preference_types_1.PreferenceMenus.PREFERENCE_EDITOR_CONTEXT_MENU,
                anchor: { x: domRect.left, y: domRect.bottom },
                args: [{ id: this.id, value }],
                onHide: () => this.hideCog()
            });
        }
    }
    addModifiedMarking() {
        this.gutter.classList.add('theia-mod-item-modified');
    }
    removeModifiedMarking() {
        this.gutter.classList.remove('theia-mod-item-modified');
    }
    showCog() {
        this.gutter.classList.add('show-cog');
    }
    hideCog() {
        this.gutter.classList.remove('show-cog');
    }
    updateModificationStatus(knownCurrentValue) {
        const wasModified = this.isModifiedFromDefault;
        const { inspection } = this;
        const valueInCurrentScope = knownCurrentValue !== null && knownCurrentValue !== void 0 ? knownCurrentValue : preference_types_1.Preference.getValueInScope(inspection, this.scopeTracker.currentScope.scope);
        this.isModifiedFromDefault = valueInCurrentScope !== undefined && !browser_1.PreferenceProvider.deepEqual(valueInCurrentScope, inspection === null || inspection === void 0 ? void 0 : inspection.defaultValue);
        if (wasModified !== this.isModifiedFromDefault) {
            this.gutter.classList.toggle('theia-mod-item-modified', this.isModifiedFromDefault);
        }
    }
    updateHeadline(filtered = this.model.isFiltered) {
        const { headlineWrapper } = this;
        if (this.headlineWrapper.childElementCount === 0) {
            const name = this.labelProvider.getName(this.preferenceNode);
            const nameWrapper = document.createElement('span');
            nameWrapper.classList.add('preference-leaf-headline-name');
            nameWrapper.textContent = name;
            headlineWrapper.appendChild(nameWrapper);
        }
        const prefix = this.labelProvider.getPrefix(this.preferenceNode, filtered);
        const currentFirstChild = headlineWrapper.children[0];
        const currentFirstChildIsPrefix = currentFirstChild.classList.contains('preference-leaf-headline-prefix');
        if (prefix) {
            let prefixWrapper;
            if (currentFirstChildIsPrefix) {
                prefixWrapper = currentFirstChild;
            }
            else {
                prefixWrapper = document.createElement('span');
                prefixWrapper.classList.add('preference-leaf-headline-prefix');
                headlineWrapper.insertBefore(prefixWrapper, currentFirstChild);
            }
            prefixWrapper.textContent = prefix;
        }
        else if (currentFirstChildIsPrefix) {
            headlineWrapper.removeChild(currentFirstChild);
        }
        const currentLastChild = headlineWrapper.lastChild;
        if (currentLastChild.classList.contains('preference-leaf-headline-suffix')) {
            this.compareOtherModifiedScopes(headlineWrapper, currentLastChild);
        }
        else {
            this.createOtherModifiedScopes(headlineWrapper);
        }
    }
    compareOtherModifiedScopes(headlineWrapper, currentSuffix) {
        const modifiedScopes = this.getModifiedScopesAsStrings();
        if (modifiedScopes.length === 0) {
            headlineWrapper.removeChild(currentSuffix);
        }
        else {
            const modifiedMessagePrefix = currentSuffix.children[0];
            const newMessagePrefix = this.getModifiedMessagePrefix();
            if (modifiedMessagePrefix.textContent !== newMessagePrefix) {
                modifiedMessagePrefix.textContent = newMessagePrefix;
            }
            const [firstModifiedScope, secondModifiedScope] = modifiedScopes;
            const firstScopeMessage = currentSuffix.children[1];
            const secondScopeMessage = currentSuffix.children[2];
            firstScopeMessage.children[0].textContent = browser_1.PreferenceScope[firstModifiedScope];
            this.addEventHandlerToModifiedScope(firstModifiedScope, firstScopeMessage.children[0]);
            if (modifiedScopes.length === 1 && secondScopeMessage) {
                currentSuffix.removeChild(secondScopeMessage);
            }
            else if (modifiedScopes.length === 2 && !secondScopeMessage) {
                const newSecondMessage = this.createModifiedScopeMessage(secondModifiedScope);
                currentSuffix.appendChild(newSecondMessage);
            }
            // If both scopes are modified and both messages are present, do nothing.
        }
    }
    createOtherModifiedScopes(headlineWrapper) {
        const modifiedScopes = this.getModifiedScopesAsStrings();
        if (modifiedScopes.length !== 0) {
            const wrapper = document.createElement('i');
            wrapper.classList.add('preference-leaf-headline-suffix');
            headlineWrapper.appendChild(wrapper);
            const messagePrefix = this.getModifiedMessagePrefix();
            const messageWrapper = document.createElement('span');
            messageWrapper.classList.add('preference-other-modified-scope-alert');
            messageWrapper.textContent = messagePrefix;
            wrapper.appendChild(messageWrapper);
            modifiedScopes.forEach((scopeName, i) => {
                const scopeWrapper = this.createModifiedScopeMessage(scopeName);
                wrapper.appendChild(scopeWrapper);
            });
        }
    }
    createModifiedScopeMessage(scope) {
        const scopeWrapper = document.createElement('span');
        scopeWrapper.classList.add('preference-modified-scope-wrapper');
        const scopeInteractable = document.createElement('span');
        scopeInteractable.classList.add('preference-scope-underlined');
        const scopeName = browser_1.PreferenceScope[scope];
        this.addEventHandlerToModifiedScope(scope, scopeInteractable);
        scopeInteractable.textContent = scopeName;
        scopeWrapper.appendChild(scopeInteractable);
        return scopeWrapper;
    }
    getModifiedMessagePrefix() {
        return (this.isModifiedFromDefault ? common_1.nls.localizeByDefault('Also modified in') : common_1.nls.localizeByDefault('Modified in')) + ': ';
    }
    addEventHandlerToModifiedScope(scope, scopeWrapper) {
        if (scope === browser_1.PreferenceScope.User || scope === browser_1.PreferenceScope.Workspace) {
            const eventHandler = () => {
                this.scopeTracker.setScope(scope);
                this.searchbar.updateSearchTerm(this.id);
            };
            scopeWrapper.onclick = eventHandler;
            scopeWrapper.onkeydown = eventHandler;
            scopeWrapper.tabIndex = 0;
        }
        else {
            scopeWrapper.onclick = null; // eslint-disable-line no-null/no-null
            scopeWrapper.onkeydown = null; // eslint-disable-line no-null/no-null
            scopeWrapper.tabIndex = -1;
        }
    }
    getModifiedScopesAsStrings() {
        const currentScopeInView = this.scopeTracker.currentScope.scope;
        const { inspection } = this;
        const modifiedScopes = [];
        if (inspection) {
            for (const otherScope of [browser_1.PreferenceScope.User, browser_1.PreferenceScope.Workspace]) {
                if (otherScope !== currentScopeInView) {
                    const valueInOtherScope = preference_types_1.Preference.getValueInScope(inspection, otherScope);
                    if (valueInOtherScope !== undefined && !browser_1.PreferenceProvider.deepEqual(valueInOtherScope, inspection.defaultValue)) {
                        modifiedScopes.push(otherScope);
                    }
                }
            }
        }
        return modifiedScopes;
    }
    // Many preferences allow `null` and even use it as a default regardless of the declared type.
    getValue() {
        var _a;
        let currentValue = preference_types_1.Preference.getValueInScope(this.inspection, this.scopeTracker.currentScope.scope);
        if (currentValue === undefined) {
            currentValue = (_a = this.inspection) === null || _a === void 0 ? void 0 : _a.defaultValue;
        }
        return currentValue !== undefined ? currentValue : this.getFallbackValue();
    }
    setPreferenceImmediately(value) {
        return this.preferenceService.set(this.id, value, this.scopeTracker.currentScope.scope, this.scopeTracker.currentScope.uri)
            .catch(() => this.handleValueChange());
    }
    handleSearchChange(isFiltered = this.model.isFiltered) {
        this.updateHeadline(isFiltered);
    }
    handleScopeChange(isFiltered = this.model.isFiltered) {
        this.handleValueChange();
        this.updateHeadline(isFiltered);
    }
    handleValueChange() {
        this.doHandleValueChange();
        this.updateHeadline();
    }
};
__decorate([
    (0, inversify_1.inject)(preference_types_1.Preference.Node),
    __metadata("design:type", Object)
], PreferenceLeafNodeRenderer.prototype, "preferenceNode", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], PreferenceLeafNodeRenderer.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], PreferenceLeafNodeRenderer.prototype, "menuRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(preference_scope_tabbar_widget_1.PreferencesScopeTabBar),
    __metadata("design:type", preference_scope_tabbar_widget_1.PreferencesScopeTabBar)
], PreferenceLeafNodeRenderer.prototype, "scopeTracker", void 0);
__decorate([
    (0, inversify_1.inject)(preference_tree_model_1.PreferenceTreeModel),
    __metadata("design:type", preference_tree_model_1.PreferenceTreeModel)
], PreferenceLeafNodeRenderer.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(preference_searchbar_widget_1.PreferencesSearchbarWidget),
    __metadata("design:type", preference_searchbar_widget_1.PreferencesSearchbarWidget)
], PreferenceLeafNodeRenderer.prototype, "searchbar", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], PreferenceLeafNodeRenderer.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(preference_markdown_renderer_1.PreferenceMarkdownRenderer),
    __metadata("design:type", preference_markdown_renderer_1.PreferenceMarkdownRenderer)
], PreferenceLeafNodeRenderer.prototype, "markdownRenderer", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreferenceLeafNodeRenderer.prototype, "init", null);
PreferenceLeafNodeRenderer = __decorate([
    (0, inversify_1.injectable)()
], PreferenceLeafNodeRenderer);
exports.PreferenceLeafNodeRenderer = PreferenceLeafNodeRenderer;
//# sourceMappingURL=preference-node-renderer.js.map