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
exports.PreferenceTreeGenerator = exports.COMMONLY_USED_SECTION_PREFIX = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
const core_1 = require("@theia/core");
const debounce = require("@theia/core/shared/lodash.debounce");
const preference_types_1 = require("./preference-types");
exports.COMMONLY_USED_SECTION_PREFIX = 'commonly-used';
let PreferenceTreeGenerator = class PreferenceTreeGenerator {
    constructor() {
        this.onSchemaChangedEmitter = new core_1.Emitter();
        this.onSchemaChanged = this.onSchemaChangedEmitter.event;
        this.commonlyUsedPreferences = [
            'files.autoSave', 'files.autoSaveDelay', 'editor.fontSize',
            'editor.fontFamily', 'editor.tabSize', 'editor.renderWhitespace',
            'editor.cursorStyle', 'editor.multiCursorModifier', 'editor.insertSpaces',
            'editor.wordWrap', 'files.exclude', 'files.associations'
        ];
        this.topLevelCategories = new Map([
            [exports.COMMONLY_USED_SECTION_PREFIX, 'Commonly Used'],
            ['editor', 'Text Editor'],
            ['workbench', 'Workbench'],
            ['window', 'Window'],
            ['features', 'Features'],
            ['application', 'Application'],
            ['security', 'Security'],
            ['extensions', 'Extensions']
        ]);
        this.sectionAssignments = new Map([
            ['breadcrumbs', 'workbench'],
            ['comments', 'features'],
            ['debug', 'features'],
            ['diffEditor', 'editor'],
            ['explorer', 'features'],
            ['extensions', 'features'],
            ['files', 'editor'],
            ['hosted-plugin', 'features'],
            ['http', 'application'],
            ['keyboard', 'application'],
            ['notification', 'workbench'],
            ['output', 'features'],
            ['preview', 'features'],
            ['problems', 'features'],
            ['scm', 'features'],
            ['search', 'features'],
            ['task', 'features'],
            ['terminal', 'features'],
            ['toolbar', 'features'],
            ['webview', 'features'],
            ['workspace', 'application'],
        ]);
        this.defaultTopLevelCategory = 'extensions';
        this.handleChangedSchema = debounce(this.doHandleChangedSchema, 200);
    }
    get root() {
        var _a;
        return (_a = this._root) !== null && _a !== void 0 ? _a : this.generateTree();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        await this.schemaProvider.ready;
        this.schemaProvider.onDidPreferenceSchemaChanged(() => this.handleChangedSchema());
        this.handleChangedSchema();
    }
    generateTree() {
        const preferencesSchema = this.schemaProvider.getCombinedSchema();
        const propertyNames = Object.keys(preferencesSchema.properties);
        const groups = new Map();
        const root = this.createRootNode();
        for (const id of this.topLevelCategories.keys()) {
            this.getOrCreatePreferencesGroup(id, id, root, groups);
        }
        const commonlyUsed = this.getOrCreatePreferencesGroup(exports.COMMONLY_USED_SECTION_PREFIX, exports.COMMONLY_USED_SECTION_PREFIX, root, groups);
        for (const preference of this.commonlyUsedPreferences) {
            if (preference in preferencesSchema.properties) {
                this.createLeafNode(preference, commonlyUsed, preferencesSchema.properties[preference]);
            }
        }
        for (const propertyName of propertyNames) {
            const property = preferencesSchema.properties[propertyName];
            if (!this.preferenceConfigs.isSectionName(propertyName) && !browser_1.OVERRIDE_PROPERTY_PATTERN.test(propertyName) && !property.deprecationMessage) {
                const labels = propertyName.split('.');
                const groupID = this.getGroupName(labels);
                const subgroupName = this.getSubgroupName(labels, groupID);
                const subgroupID = [groupID, subgroupName].join('.');
                const toplevelParent = this.getOrCreatePreferencesGroup(groupID, groupID, root, groups);
                const immediateParent = subgroupName && this.getOrCreatePreferencesGroup(subgroupID, groupID, toplevelParent, groups);
                this.createLeafNode(propertyName, immediateParent || toplevelParent, property);
            }
        }
        for (const group of groups.values()) {
            if (group.id !== `${exports.COMMONLY_USED_SECTION_PREFIX}@${exports.COMMONLY_USED_SECTION_PREFIX}`) {
                group.children.sort((a, b) => {
                    const aIsComposite = browser_1.CompositeTreeNode.is(a);
                    const bIsComposite = browser_1.CompositeTreeNode.is(b);
                    if (aIsComposite && !bIsComposite) {
                        return 1;
                    }
                    if (bIsComposite && !aIsComposite) {
                        return -1;
                    }
                    return a.id.localeCompare(b.id);
                });
            }
        }
        this._root = root;
        return root;
    }
    ;
    getNodeId(preferenceId) {
        const expectedGroup = this.getGroupName(preferenceId.split('.'));
        const expectedId = `${expectedGroup}@${preferenceId}`;
        return expectedId;
    }
    getGroupName(labels) {
        const defaultGroup = labels[0];
        if (this.topLevelCategories.has(defaultGroup)) {
            return defaultGroup;
        }
        const assignedGroup = this.sectionAssignments.get(defaultGroup);
        if (assignedGroup) {
            return assignedGroup;
        }
        return this.defaultTopLevelCategory;
    }
    getSubgroupName(labels, computedGroupName) {
        if (computedGroupName !== labels[0]) {
            return labels[0];
        }
        else if (labels.length > 2) {
            return labels[1];
        }
    }
    doHandleChangedSchema() {
        const newTree = this.generateTree();
        this.onSchemaChangedEmitter.fire(newTree);
    }
    createRootNode() {
        return {
            id: 'root-node-id',
            name: '',
            parent: undefined,
            visible: true,
            children: []
        };
    }
    createLeafNode(property, preferencesGroup, data) {
        const { group } = preference_types_1.Preference.TreeNode.getGroupAndIdFromNodeId(preferencesGroup.id);
        const newNode = {
            id: `${group}@${property}`,
            preferenceId: property,
            parent: preferencesGroup,
            preference: { data },
            depth: preference_types_1.Preference.TreeNode.isTopLevel(preferencesGroup) ? 1 : 2,
        };
        browser_1.CompositeTreeNode.addChild(preferencesGroup, newNode);
        return newNode;
    }
    createPreferencesGroup(id, group, root) {
        const newNode = {
            id: `${group}@${id}`,
            visible: true,
            parent: root,
            children: [],
            expanded: false,
            selected: false,
            depth: 0,
        };
        const isTopLevel = preference_types_1.Preference.TreeNode.isTopLevel(newNode);
        if (!isTopLevel) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete newNode.expanded;
        }
        newNode.depth = isTopLevel ? 0 : 1;
        browser_1.CompositeTreeNode.addChild(root, newNode);
        return newNode;
    }
    getCustomLabelFor(id) {
        return this.topLevelCategories.get(id);
    }
    getOrCreatePreferencesGroup(id, group, root, groups) {
        const existingGroup = groups.get(id);
        if (existingGroup) {
            return existingGroup;
        }
        const newNode = this.createPreferencesGroup(id, group, root);
        groups.set(id, newNode);
        return newNode;
    }
    ;
};
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], PreferenceTreeGenerator.prototype, "schemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], PreferenceTreeGenerator.prototype, "preferenceConfigs", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreferenceTreeGenerator.prototype, "init", null);
PreferenceTreeGenerator = __decorate([
    (0, inversify_1.injectable)()
], PreferenceTreeGenerator);
exports.PreferenceTreeGenerator = PreferenceTreeGenerator;
//# sourceMappingURL=preference-tree-generator.js.map