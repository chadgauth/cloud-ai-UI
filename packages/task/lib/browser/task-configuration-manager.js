"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.TaskConfigurationManager = void 0;
const jsoncparser = require("jsonc-parser");
const debounce = require("p-debounce");
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const browser_1 = require("@theia/editor/lib/browser");
const browser_2 = require("@theia/core/lib/browser");
const quick_pick_service_1 = require("@theia/core/lib/common/quick-pick-service");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const task_configuration_model_1 = require("./task-configuration-model");
const task_templates_1 = require("./task-templates");
const task_protocol_1 = require("../common/task-protocol");
const workspace_variable_contribution_1 = require("@theia/workspace/lib/browser/workspace-variable-contribution");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const common_1 = require("@theia/core/lib/common");
const task_schema_updater_1 = require("./task-schema-updater");
/**
 * This class connects the the "tasks" preferences sections to task system: it collects tasks preference values and
 * provides them to the task system as raw, parsed JSON.
 */
let TaskConfigurationManager = class TaskConfigurationManager {
    constructor() {
        this.onDidChangeTaskConfigEmitter = new event_1.Emitter();
        this.onDidChangeTaskConfig = this.onDidChangeTaskConfigEmitter.event;
        this.models = new Map();
        this.updateModels = debounce(async () => {
            const roots = await this.workspaceService.roots;
            const toDelete = new Set([...this.models.keys()]
                .filter(key => key !== task_protocol_1.TaskScope.Global && key !== task_protocol_1.TaskScope.Workspace));
            this.updateWorkspaceModel();
            for (const rootStat of roots) {
                const key = rootStat.resource.toString();
                toDelete.delete(key);
                if (!this.models.has(key)) {
                    const model = new task_configuration_model_1.TaskConfigurationModel(key, this.folderPreferences);
                    model.onDidChange(() => this.onDidChangeTaskConfigEmitter.fire({ scope: key, type: 0 /* UPDATED */ }));
                    model.onDispose(() => this.models.delete(key));
                    this.models.set(key, model);
                    this.onDidChangeTaskConfigEmitter.fire({ scope: key, type: 0 /* UPDATED */ });
                }
            }
            for (const uri of toDelete) {
                const model = this.models.get(uri);
                if (model) {
                    model.dispose();
                }
                this.onDidChangeTaskConfigEmitter.fire({ scope: uri, type: 2 /* DELETED */ });
            }
        }, 500);
        this.toDisposeOnDelegateChange = new common_1.DisposableCollection();
    }
    init() {
        this.createModels();
        this.folderPreferences.onDidPreferencesChanged(e => {
            if (e['tasks']) {
                this.updateModels();
            }
        });
        this.workspaceService.onWorkspaceChanged(() => {
            this.updateModels();
        });
        this.workspaceService.onWorkspaceLocationChanged(() => {
            this.updateModels();
        });
    }
    createModels() {
        const userModel = new task_configuration_model_1.TaskConfigurationModel(task_protocol_1.TaskScope.Global, this.userPreferences);
        userModel.onDidChange(() => this.onDidChangeTaskConfigEmitter.fire({ scope: task_protocol_1.TaskScope.Global, type: 0 /* UPDATED */ }));
        this.models.set(task_protocol_1.TaskScope.Global, userModel);
        this.updateModels();
    }
    getTasks(scope) {
        var _a, _b;
        return (_b = (_a = this.getModel(scope)) === null || _a === void 0 ? void 0 : _a.configurations) !== null && _b !== void 0 ? _b : [];
    }
    getTask(name, scope) {
        return this.getTasks(scope).find((configuration) => configuration.name === name);
    }
    async openConfiguration(scope) {
        const taskPrefModel = this.getModel(scope);
        const maybeURI = typeof scope === 'string' ? scope : undefined;
        const configURI = this.preferenceService.getConfigUri(this.getMatchingPreferenceScope(scope), maybeURI, 'tasks');
        if (taskPrefModel && configURI) {
            await this.doOpen(taskPrefModel, configURI);
        }
    }
    async addTaskConfiguration(scope, taskConfig) {
        const taskPrefModel = this.getModel(scope);
        if (taskPrefModel) {
            const configurations = taskPrefModel.configurations;
            return this.setTaskConfigurations(scope, [...configurations, taskConfig]);
        }
        return false;
    }
    async setTaskConfigurations(scope, taskConfigs) {
        const taskPrefModel = this.getModel(scope);
        if (taskPrefModel) {
            return taskPrefModel.setConfigurations(taskConfigs);
        }
        return false;
    }
    getModel(scope) {
        return this.models.get(scope);
    }
    async doOpen(model, configURI) {
        if (!model.uri) {
            // The file has not yet been created.
            await this.doCreate(model, configURI);
        }
        return this.editorManager.open(configURI, {
            mode: 'activate'
        });
    }
    async doCreate(model, configURI) {
        var _a;
        const content = await this.getInitialConfigurationContent();
        if (content) {
            // All scopes but workspace.
            if (this.preferenceConfigurations.getName(configURI) === 'tasks') {
                await this.fileService.write(configURI, content);
            }
            else {
                let taskContent;
                try {
                    taskContent = jsoncparser.parse(content);
                }
                catch {
                    taskContent = (_a = this.taskSchemaProvider.getTaskSchema().default) !== null && _a !== void 0 ? _a : {};
                }
                await model.preferences.setPreference('tasks', taskContent);
            }
        }
    }
    getMatchingPreferenceScope(scope) {
        switch (scope) {
            case task_protocol_1.TaskScope.Global:
                return browser_2.PreferenceScope.User;
            case task_protocol_1.TaskScope.Workspace:
                return browser_2.PreferenceScope.Workspace;
            default:
                return browser_2.PreferenceScope.Folder;
        }
    }
    async getInitialConfigurationContent() {
        var _a;
        const selected = await this.quickPickService.show(this.taskTemplateSelector.selectTemplates(), {
            placeholder: 'Select a Task Template'
        });
        if (selected) {
            return (_a = selected.value) === null || _a === void 0 ? void 0 : _a.content;
        }
    }
    updateWorkspaceModel() {
        var _a;
        const isFolderWorkspace = this.workspaceService.opened && !this.workspaceService.saved;
        const newDelegate = isFolderWorkspace ? this.folderPreferences : this.workspacePreferences;
        const effectiveScope = isFolderWorkspace ? (_a = this.workspaceService.tryGetRoots()[0]) === null || _a === void 0 ? void 0 : _a.resource.toString() : task_protocol_1.TaskScope.Workspace;
        if (newDelegate !== this.workspaceDelegate) {
            this.workspaceDelegate = newDelegate;
            this.toDisposeOnDelegateChange.dispose();
            const workspaceModel = new task_configuration_model_1.TaskConfigurationModel(effectiveScope, newDelegate);
            this.toDisposeOnDelegateChange.push(workspaceModel);
            // If the delegate is the folder preference provider, its events will be relayed via the folder scope models.
            if (newDelegate === this.workspacePreferences) {
                this.toDisposeOnDelegateChange.push(workspaceModel.onDidChange(() => {
                    this.onDidChangeTaskConfigEmitter.fire({ scope: task_protocol_1.TaskScope.Workspace, type: 0 /* UPDATED */ });
                }));
            }
            this.models.set(task_protocol_1.TaskScope.Workspace, workspaceModel);
            this.onDidChangeTaskConfigEmitter.fire({ scope: effectiveScope, type: 0 /* UPDATED */ });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], TaskConfigurationManager.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], TaskConfigurationManager.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(quick_pick_service_1.QuickPickService),
    __metadata("design:type", Object)
], TaskConfigurationManager.prototype, "quickPickService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], TaskConfigurationManager.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceService),
    __metadata("design:type", Object)
], TaskConfigurationManager.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(task_schema_updater_1.TaskSchemaUpdater),
    __metadata("design:type", task_schema_updater_1.TaskSchemaUpdater)
], TaskConfigurationManager.prototype, "taskSchemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceProvider),
    (0, inversify_1.named)(browser_2.PreferenceScope.Folder),
    __metadata("design:type", browser_2.PreferenceProvider)
], TaskConfigurationManager.prototype, "folderPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceProvider),
    (0, inversify_1.named)(browser_2.PreferenceScope.User),
    __metadata("design:type", browser_2.PreferenceProvider)
], TaskConfigurationManager.prototype, "userPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceProvider),
    (0, inversify_1.named)(browser_2.PreferenceScope.Workspace),
    __metadata("design:type", browser_2.PreferenceProvider)
], TaskConfigurationManager.prototype, "workspacePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], TaskConfigurationManager.prototype, "preferenceConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_variable_contribution_1.WorkspaceVariableContribution),
    __metadata("design:type", workspace_variable_contribution_1.WorkspaceVariableContribution)
], TaskConfigurationManager.prototype, "workspaceVariables", void 0);
__decorate([
    (0, inversify_1.inject)(task_templates_1.TaskTemplateSelector),
    __metadata("design:type", task_templates_1.TaskTemplateSelector)
], TaskConfigurationManager.prototype, "taskTemplateSelector", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskConfigurationManager.prototype, "init", null);
TaskConfigurationManager = __decorate([
    (0, inversify_1.injectable)()
], TaskConfigurationManager);
exports.TaskConfigurationManager = TaskConfigurationManager;
//# sourceMappingURL=task-configuration-manager.js.map