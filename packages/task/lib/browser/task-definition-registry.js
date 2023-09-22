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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDefinitionRegistry = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const common_1 = require("@theia/core/lib/common");
const disposable_1 = require("@theia/core/lib/common/disposable");
let TaskDefinitionRegistry = class TaskDefinitionRegistry {
    constructor() {
        // task type - array of task definitions
        this.definitions = new Map();
        this.onDidRegisterTaskDefinitionEmitter = new common_1.Emitter();
        this.onDidUnregisterTaskDefinitionEmitter = new common_1.Emitter();
    }
    get onDidRegisterTaskDefinition() {
        return this.onDidRegisterTaskDefinitionEmitter.event;
    }
    get onDidUnregisterTaskDefinition() {
        return this.onDidUnregisterTaskDefinitionEmitter.event;
    }
    /**
     * Returns all task definitions that are registered
     * @return the task definitions that are registered
     */
    getAll() {
        const all = [];
        for (const definitions of this.definitions.values()) {
            all.push(...definitions);
        }
        return all;
    }
    /**
     * Finds the task definition(s) from the registry with the given `taskType`.
     *
     * @param taskType the type of the task
     * @return an array of the task definitions. If no task definitions are found, an empty array is returned.
     */
    getDefinitions(taskType) {
        return this.definitions.get(taskType) || [];
    }
    /**
     * Finds the task definition from the registry for the task configuration.
     * The task configuration is considered as a "match" to the task definition if it has all the `required` properties.
     * In case that more than one task definition is found, return the one that has the biggest number of matched properties.
     *
     * @param taskConfiguration the task configuration
     * @return the task definition for the task configuration. If the task definition is not found, `undefined` is returned.
     */
    getDefinition(taskConfiguration) {
        const definitions = this.getDefinitions(taskConfiguration.type);
        let matchedDefinition;
        let highest = -1;
        for (const def of definitions) {
            const required = def.properties.required || [];
            if (!required.every(requiredProp => taskConfiguration[requiredProp] !== undefined)) {
                continue;
            }
            let score = required.length; // number of required properties
            const requiredProps = new Set(required);
            // number of optional properties
            score += def.properties.all.filter(p => !requiredProps.has(p) && taskConfiguration[p] !== undefined).length;
            if (score > highest) {
                highest = score;
                matchedDefinition = def;
            }
        }
        return matchedDefinition;
    }
    /**
     * Add a task definition to the registry.
     *
     * @param definition the task definition to be added.
     */
    register(definition) {
        const taskType = definition.taskType;
        const definitions = this.definitions.get(taskType) || [];
        definitions.push(definition);
        this.definitions.set(taskType, definitions);
        this.onDidRegisterTaskDefinitionEmitter.fire(undefined);
        return disposable_1.Disposable.create(() => {
            const index = definitions.indexOf(definition);
            if (index !== -1) {
                definitions.splice(index, 1);
            }
            this.onDidUnregisterTaskDefinitionEmitter.fire(undefined);
        });
    }
    compareTasks(one, other) {
        const oneType = one.type;
        const otherType = other.type;
        if (oneType !== otherType) {
            return false;
        }
        if (one['taskType'] !== other['taskType']) {
            return false;
        }
        const def = this.getDefinition(one);
        if (def) {
            // scope is either a string or an enum value. Anyway...they must exactly match
            // "_scope" may hold the Uri to the associated workspace whereas
            // "scope" reflects the original TaskConfigurationScope as provided by plugins,
            // Matching "_scope" or "scope" are both accepted in order to correlate provided task
            // configurations (e.g. TaskScope.Workspace) against already configured tasks.
            return def.properties.all.every(p => p === 'type' || coreutils_1.JSONExt.deepEqual(one[p], other[p]))
                && (one._scope === other._scope || one.scope === other.scope);
        }
        return one.label === other.label && one._source === other._source;
    }
};
TaskDefinitionRegistry = __decorate([
    (0, inversify_1.injectable)()
], TaskDefinitionRegistry);
exports.TaskDefinitionRegistry = TaskDefinitionRegistry;
//# sourceMappingURL=task-definition-registry.js.map