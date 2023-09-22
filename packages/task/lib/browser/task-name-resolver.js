"use strict";
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.TaskNameResolver = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const task_definition_registry_1 = require("./task-definition-registry");
const task_configurations_1 = require("./task-configurations");
let TaskNameResolver = class TaskNameResolver {
    /**
     * Returns task name to display.
     * It is aligned with VS Code.
     */
    resolve(task) {
        if (this.isDetectedTask(task)) {
            const scope = task._scope;
            const rawConfigs = this.taskConfigurations.getRawTaskConfigurations(scope);
            const jsonConfig = rawConfigs.find(rawConfig => this.taskDefinitionRegistry.compareTasks({
                ...rawConfig, _scope: scope
            }, task));
            // detected task that has a `label` defined in `tasks.json`
            if (jsonConfig && jsonConfig.label) {
                return jsonConfig.label;
            }
            return `${task.source || task._source}: ${task.label}`;
        }
        // it is a hack, when task is customized but extension is absent
        return task.label || `${task.type}: ${task.task}`;
    }
    isDetectedTask(task) {
        return !!this.taskDefinitionRegistry.getDefinition(task);
    }
};
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskNameResolver.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_configurations_1.TaskConfigurations),
    __metadata("design:type", task_configurations_1.TaskConfigurations)
], TaskNameResolver.prototype, "taskConfigurations", void 0);
TaskNameResolver = __decorate([
    (0, inversify_1.injectable)()
], TaskNameResolver);
exports.TaskNameResolver = TaskNameResolver;
//# sourceMappingURL=task-name-resolver.js.map