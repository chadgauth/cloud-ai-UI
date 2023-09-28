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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTaskResolver = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/variable-resolver/lib/browser");
const task_definition_registry_1 = require("../task-definition-registry");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_2 = require("@theia/workspace/lib/browser");
let ProcessTaskResolver = class ProcessTaskResolver {
    /**
     * Perform some adjustments to the task launch configuration, before sending
     * it to the backend to be executed. We can make sure that parameters that
     * are optional to the user but required by the server will be defined, with
     * sane default values. Also, resolve all known variables, e.g. `${workspaceFolder}`.
     */
    async resolveTask(taskConfig) {
        var _a;
        const type = taskConfig.taskType || taskConfig.type;
        if (type !== 'process' && type !== 'shell') {
            throw new Error('Unsupported task configuration type.');
        }
        const context = typeof taskConfig._scope === 'string' ? new uri_1.default(taskConfig._scope) : undefined;
        const variableResolverOptions = {
            context, configurationSection: 'tasks'
        };
        const processTaskConfig = taskConfig;
        let cwd = processTaskConfig.options && processTaskConfig.options.cwd;
        if (!cwd) {
            const rootURI = this.workspaceService.getWorkspaceRootUri(context);
            if (rootURI) {
                cwd = rootURI.toString();
            }
        }
        const result = {
            ...processTaskConfig,
            command: await this.variableResolverService.resolve(processTaskConfig.command, variableResolverOptions),
            args: processTaskConfig.args ? await this.variableResolverService.resolve(processTaskConfig.args, variableResolverOptions) : undefined,
            windows: processTaskConfig.windows ? {
                command: await this.variableResolverService.resolve(processTaskConfig.windows.command, variableResolverOptions),
                args: processTaskConfig.windows.args ? await this.variableResolverService.resolve(processTaskConfig.windows.args, variableResolverOptions) : undefined,
                options: processTaskConfig.windows.options
            } : undefined,
            osx: processTaskConfig.osx ? {
                command: await this.variableResolverService.resolve(processTaskConfig.osx.command, variableResolverOptions),
                args: processTaskConfig.osx.args ? await this.variableResolverService.resolve(processTaskConfig.osx.args, variableResolverOptions) : undefined,
                options: processTaskConfig.osx.options
            } : undefined,
            linux: processTaskConfig.linux ? {
                command: await this.variableResolverService.resolve(processTaskConfig.linux.command, variableResolverOptions),
                args: processTaskConfig.linux.args ? await this.variableResolverService.resolve(processTaskConfig.linux.args, variableResolverOptions) : undefined,
                options: processTaskConfig.linux.options
            } : undefined,
            options: {
                cwd: await this.variableResolverService.resolve(cwd, variableResolverOptions),
                env: ((_a = processTaskConfig.options) === null || _a === void 0 ? void 0 : _a.env) && await this.variableResolverService.resolve(processTaskConfig.options.env, variableResolverOptions),
                shell: processTaskConfig.options && processTaskConfig.options.shell
            }
        };
        return result;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.VariableResolverService),
    __metadata("design:type", browser_1.VariableResolverService)
], ProcessTaskResolver.prototype, "variableResolverService", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], ProcessTaskResolver.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], ProcessTaskResolver.prototype, "workspaceService", void 0);
ProcessTaskResolver = __decorate([
    (0, inversify_1.injectable)()
], ProcessTaskResolver);
exports.ProcessTaskResolver = ProcessTaskResolver;
//# sourceMappingURL=process-task-resolver.js.map