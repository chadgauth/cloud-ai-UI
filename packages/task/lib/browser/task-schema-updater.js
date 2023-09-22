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
// This file is inspired by VSCode and partially copied from https://github.com/Microsoft/vscode/blob/1.33.1/src/vs/workbench/contrib/tasks/common/problemMatcher.ts
// 'problemMatcher.ts' copyright:
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
exports.TaskSchemaUpdater = exports.taskSchemaId = void 0;
const Ajv = require("@theia/core/shared/ajv");
const debounce = require("p-debounce");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const variable_input_schema_1 = require("@theia/variable-resolver/lib/browser/variable-input-schema");
const uri_1 = require("@theia/core/lib/common/uri");
const task_problem_matcher_registry_1 = require("./task-problem-matcher-registry");
const task_definition_registry_1 = require("./task-definition-registry");
const common_2 = require("../common");
const browser_1 = require("@theia/userstorage/lib/browser");
const browser_2 = require("@theia/workspace/lib/browser");
exports.taskSchemaId = 'vscode://schemas/tasks';
let TaskSchemaUpdater = class TaskSchemaUpdater {
    constructor() {
        this.onDidChangeTaskSchemaEmitter = new common_1.Emitter();
        this.onDidChangeTaskSchema = this.onDidChangeTaskSchemaEmitter.event;
        this.uri = new uri_1.default(exports.taskSchemaId);
        this.update = debounce(() => this.doUpdate(), 0);
    }
    init() {
        const resource = this.inmemoryResources.add(this.uri, '');
        if (resource.onDidChangeContents) {
            resource.onDidChangeContents(() => {
                this.onDidChangeTaskSchemaEmitter.fire(undefined);
            });
        }
        this.updateProblemMatcherNames();
        this.updateSupportedTaskTypes();
        // update problem matcher names in the task schema every time a problem matcher is added or disposed
        this.problemMatcherRegistry.onDidChangeProblemMatcher(() => this.updateProblemMatcherNames());
        // update supported task types in the task schema every time a task definition is registered or removed
        this.taskDefinitionRegistry.onDidRegisterTaskDefinition(() => this.updateSupportedTaskTypes());
        this.taskDefinitionRegistry.onDidUnregisterTaskDefinition(() => this.updateSupportedTaskTypes());
    }
    registerSchemas(context) {
        context.registerSchema({
            fileMatch: ['tasks.json', browser_1.UserStorageUri.resolve('tasks.json').toString()],
            url: this.uri.toString()
        });
        this.workspaceService.updateSchema('tasks', { $ref: this.uri.toString() });
    }
    doUpdate() {
        taskConfigurationSchema.anyOf = [processTaskConfigurationSchema, ...customizedDetectedTasks, ...customSchemas];
        const schema = this.getTaskSchema();
        this.doValidate = new Ajv().compile(schema);
        const schemaContent = JSON.stringify(schema);
        this.inmemoryResources.update(this.uri, schemaContent);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(data) {
        return !!this.doValidate && !!this.doValidate(data);
    }
    /**
     * Adds given task schema to `taskConfigurationSchema` as `oneOf` subschema.
     * Replaces existed subschema by given schema if the corresponding `$id` properties are equal.
     *
     * Note: please provide `$id` property for subschema to have ability remove/replace it.
     * @param schema subschema for adding to `taskConfigurationSchema`
     */
    addSubschema(schema) {
        const schemaId = schema.$id;
        if (schemaId) {
            this.doRemoveSubschema(schemaId);
        }
        customSchemas.push(schema);
        this.update();
    }
    /**
     * Removes task subschema from `taskConfigurationSchema`.
     *
     * @param arg `$id` property of subschema
     */
    removeSubschema(arg) {
        const isRemoved = this.doRemoveSubschema(arg);
        if (isRemoved) {
            this.update();
        }
    }
    /**
     * Removes task subschema from `customSchemas`, use `update()` to apply the changes for `taskConfigurationSchema`.
     *
     * @param arg `$id` property of subschema
     * @returns `true` if subschema was removed, `false` otherwise
     */
    doRemoveSubschema(arg) {
        const index = customSchemas.findIndex(existed => !!existed.$id && existed.$id === arg);
        if (index > -1) {
            customSchemas.splice(index, 1);
            return true;
        }
        return false;
    }
    /** Returns an array of task types that are registered, including the default types */
    async getRegisteredTaskTypes() {
        const serverSupportedTypes = await this.taskServer.getRegisteredTaskTypes();
        const browserSupportedTypes = this.taskDefinitionRegistry.getAll().map(def => def.taskType);
        const allTypes = new Set([...serverSupportedTypes, ...browserSupportedTypes]);
        return Array.from(allTypes.values()).sort();
    }
    updateSchemasForRegisteredTasks() {
        customizedDetectedTasks.length = 0;
        const definitions = this.taskDefinitionRegistry.getAll();
        definitions.forEach(def => {
            const customizedDetectedTask = {
                type: 'object',
                required: ['type'],
                properties: {}
            };
            const taskType = {
                ...defaultTaskType,
                enum: [def.taskType],
                default: def.taskType,
                description: 'The task type to customize'
            };
            customizedDetectedTask.properties.type = taskType;
            const required = def.properties.required || [];
            def.properties.all.forEach(taskProp => {
                if (required.find(requiredProp => requiredProp === taskProp)) { // property is mandatory
                    customizedDetectedTask.required.push(taskProp);
                }
                customizedDetectedTask.properties[taskProp] = { ...def.properties.schema.properties[taskProp] };
            });
            customizedDetectedTask.properties.label = taskLabel;
            customizedDetectedTask.properties.problemMatcher = problemMatcher;
            customizedDetectedTask.properties.presentation = presentation;
            customizedDetectedTask.properties.options = commandOptionsSchema;
            customizedDetectedTask.properties.group = group;
            customizedDetectedTask.properties.detail = detail;
            customizedDetectedTask.additionalProperties = true;
            customizedDetectedTasks.push(customizedDetectedTask);
        });
    }
    /** Returns the task's JSON schema */
    getTaskSchema() {
        return {
            type: 'object',
            default: { version: '2.0.0', tasks: [] },
            properties: {
                version: {
                    type: 'string',
                    default: '2.0.0'
                },
                tasks: {
                    type: 'array',
                    items: {
                        ...(0, common_1.deepClone)(taskConfigurationSchema)
                    }
                },
                inputs: variable_input_schema_1.inputsSchema.definitions.inputs
            },
            additionalProperties: false,
            allowComments: true,
            allowTrailingCommas: true,
        };
    }
    /** Gets the most up-to-date names of problem matchers from the registry and update the task schema */
    updateProblemMatcherNames() {
        const matcherNames = this.problemMatcherRegistry.getAll().map(m => (0, common_2.asVariableName)(m.name));
        problemMatcherNames.length = 0;
        problemMatcherNames.push(...matcherNames);
        this.update();
    }
    async updateSupportedTaskTypes() {
        this.updateSchemasForRegisteredTasks();
        this.update();
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.InMemoryResources),
    __metadata("design:type", common_1.InMemoryResources)
], TaskSchemaUpdater.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(task_problem_matcher_registry_1.ProblemMatcherRegistry),
    __metadata("design:type", task_problem_matcher_registry_1.ProblemMatcherRegistry)
], TaskSchemaUpdater.prototype, "problemMatcherRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskSchemaUpdater.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.TaskServer),
    __metadata("design:type", Object)
], TaskSchemaUpdater.prototype, "taskServer", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TaskSchemaUpdater.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskSchemaUpdater.prototype, "init", null);
TaskSchemaUpdater = __decorate([
    (0, inversify_1.injectable)()
], TaskSchemaUpdater);
exports.TaskSchemaUpdater = TaskSchemaUpdater;
const commandSchema = {
    type: 'string',
    description: 'The actual command or script to execute'
};
const commandArgSchema = {
    type: 'array',
    description: 'A list of strings, each one being one argument to pass to the command',
    items: {
        type: 'string'
    }
};
const commandOptionsSchema = {
    type: 'object',
    description: 'The command options used when the command is executed',
    properties: {
        cwd: {
            type: 'string',
            description: 'The directory in which the command will be executed',
            default: '${workspaceFolder}'
        },
        env: {
            type: 'object',
            description: 'The environment of the executed program or shell. If omitted the parent process\' environment is used'
        },
        shell: {
            type: 'object',
            description: 'Configuration of the shell when task type is `shell`',
            properties: {
                executable: {
                    type: 'string',
                    description: 'The shell to use'
                },
                args: {
                    type: 'array',
                    description: `The arguments to be passed to the shell executable to run in command mode
                        (e.g ['-c'] for bash or ['/S', '/C'] for cmd.exe)`,
                    items: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
const problemMatcherNames = [];
const defaultTaskTypes = ['shell', 'process'];
const supportedTaskTypes = [...defaultTaskTypes];
const taskLabel = {
    type: 'string',
    description: 'A unique string that identifies the task that is also used as task\'s user interface label'
};
const defaultTaskType = {
    type: 'string',
    enum: supportedTaskTypes,
    default: defaultTaskTypes[0],
    description: 'Determines what type of process will be used to execute the task. Only shell types will have output shown on the user interface'
};
const commandAndArgs = {
    command: commandSchema,
    args: commandArgSchema,
    options: commandOptionsSchema
};
const group = {
    oneOf: [
        {
            type: 'string'
        },
        {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    default: 'none',
                    description: 'The task\'s execution group.'
                },
                isDefault: {
                    type: 'boolean',
                    default: false,
                    description: 'Defines if this task is the default task in the group.'
                }
            }
        }
    ],
    enum: [
        { kind: 'build', isDefault: true },
        { kind: 'test', isDefault: true },
        'build',
        'test',
        'none'
    ],
    enumDescriptions: [
        'Marks the task as the default build task.',
        'Marks the task as the default test task.',
        'Marks the task as a build task accessible through the \'Run Build Task\' command.',
        'Marks the task as a test task accessible through the \'Run Test Task\' command.',
        'Assigns the task to no group'
    ],
    // eslint-disable-next-line max-len
    description: 'Defines to which execution group this task belongs to. It supports "build" to add it to the build group and "test" to add it to the test group.'
};
const problemPattern = {
    default: {
        regexp: '^([^\\\\s].*)\\\\((\\\\d+,\\\\d+)\\\\):\\\\s*(.*)$',
        file: 1,
        location: 2,
        message: 3
    },
    type: 'object',
    properties: {
        regexp: {
            type: 'string',
            description: 'The regular expression to find an error, warning or info in the output.'
        },
        kind: {
            type: 'string',
            description: 'whether the pattern matches a location (file and line) or only a file.'
        },
        file: {
            type: 'integer',
            description: 'The match group index of the filename. If omitted 1 is used.'
        },
        location: {
            type: 'integer',
            // eslint-disable-next-line max-len
            description: 'The match group index of the problem\'s location. Valid location patterns are: (line), (line,column) and (startLine,startColumn,endLine,endColumn). If omitted (line,column) is assumed.'
        },
        line: {
            type: 'integer',
            description: 'The match group index of the problem\'s line. Defaults to 2'
        },
        column: {
            type: 'integer',
            description: 'The match group index of the problem\'s line character. Defaults to 3'
        },
        endLine: {
            type: 'integer',
            description: 'The match group index of the problem\'s end line. Defaults to undefined'
        },
        endColumn: {
            type: 'integer',
            description: 'The match group index of the problem\'s end line character. Defaults to undefined'
        },
        severity: {
            type: 'integer',
            description: 'The match group index of the problem\'s severity. Defaults to undefined'
        },
        code: {
            type: 'integer',
            description: 'The match group index of the problem\'s code. Defaults to undefined'
        },
        message: {
            type: 'integer',
            description: 'The match group index of the message. If omitted it defaults to 4 if location is specified. Otherwise it defaults to 5.'
        },
        loop: {
            type: 'boolean',
            // eslint-disable-next-line max-len
            description: 'In a multi line matcher loop indicated whether this pattern is executed in a loop as long as it matches. Can only specified on a last pattern in a multi line pattern.'
        }
    }
};
const multiLineProblemPattern = {
    type: 'array',
    items: problemPattern
};
const watchingPattern = {
    type: 'object',
    additionalProperties: false,
    properties: {
        regexp: {
            type: 'string',
            description: 'The regular expression to detect the begin or end of a background task.'
        },
        file: {
            type: 'integer',
            description: 'The match group index of the filename. Can be omitted.'
        },
    }
};
const patternType = {
    anyOf: [
        {
            type: 'string',
            description: 'The name of a contributed or predefined pattern'
        },
        problemPattern,
        multiLineProblemPattern
    ],
    description: 'A problem pattern or the name of a contributed or predefined problem pattern. Can be omitted if base is specified.'
};
const problemMatcherObject = {
    type: 'object',
    properties: {
        base: {
            type: 'string',
            enum: problemMatcherNames,
            description: 'The name of a base problem matcher to use.'
        },
        owner: {
            type: 'string',
            description: 'The owner of the problem inside Code. Can be omitted if base is specified. Defaults to \'external\' if omitted and base is not specified.'
        },
        source: {
            type: 'string',
            description: 'A human-readable string describing the source of this diagnostic, e.g. \'typescript\' or \'super lint\'.'
        },
        severity: {
            type: 'string',
            enum: ['error', 'warning', 'info'],
            description: 'The default severity for captures problems. Is used if the pattern doesn\'t define a match group for severity.'
        },
        applyTo: {
            type: 'string',
            enum: ['allDocuments', 'openDocuments', 'closedDocuments'],
            description: 'Controls if a problem reported on a text document is applied only to open, closed or all documents.'
        },
        pattern: patternType,
        fileLocation: {
            oneOf: [
                {
                    type: 'string',
                    enum: ['absolute', 'relative', 'autoDetect']
                },
                {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            ],
            description: 'Defines how file names reported in a problem pattern should be interpreted.'
        },
        background: {
            type: 'object',
            additionalProperties: false,
            description: 'Patterns to track the begin and end of a matcher active on a background task.',
            properties: {
                activeOnStart: {
                    type: 'boolean',
                    description: 'If set to true the background monitor is in active mode when the task starts. This is equals of issuing a line that matches the beginsPattern'
                },
                beginsPattern: {
                    oneOf: [
                        {
                            type: 'string'
                        },
                        watchingPattern
                    ],
                    description: 'If matched in the output the start of a background task is signaled.'
                },
                endsPattern: {
                    oneOf: [
                        {
                            type: 'string'
                        },
                        watchingPattern
                    ],
                    description: 'If matched in the output the end of a background task is signaled.'
                }
            }
        },
        watching: {
            type: 'object',
            additionalProperties: false,
            deprecationMessage: 'The watching property is deprecated. Use background instead.',
            description: 'Patterns to track the begin and end of a watching matcher.',
            properties: {
                activeOnStart: {
                    type: 'boolean',
                    description: 'If set to true the watcher is in active mode when the task starts. This is equals of issuing a line that matches the beginPattern'
                },
                beginsPattern: {
                    oneOf: [
                        {
                            type: 'string'
                        },
                        watchingPattern
                    ],
                    description: 'If matched in the output the start of a watching task is signaled.'
                },
                endsPattern: {
                    oneOf: [
                        {
                            type: 'string'
                        },
                        watchingPattern
                    ],
                    description: 'If matched in the output the end of a watching task is signaled.'
                }
            }
        }
    }
};
const problemMatcher = {
    anyOf: [
        {
            type: 'string',
            description: 'Name of the problem matcher to parse the output of the task',
            enum: problemMatcherNames
        },
        {
            type: 'array',
            description: 'Name(s) of the problem matcher(s) to parse the output of the task',
            items: {
                type: 'string',
                enum: problemMatcherNames
            }
        },
        problemMatcherObject,
        {
            type: 'array',
            description: 'User defined problem matcher(s) to parse the output of the task',
            items: problemMatcherObject
        }
    ]
};
const presentation = {
    type: 'object',
    default: {
        echo: true,
        reveal: 'always',
        focus: false,
        panel: 'shared',
        showReuseMessage: true,
        clear: false
    },
    description: 'Configures the panel that is used to present the task\'s output and reads its input.',
    additionalProperties: true,
    properties: {
        echo: {
            type: 'boolean',
            default: true,
            description: 'Controls whether the executed command is echoed to the panel. Default is true.'
        },
        focus: {
            type: 'boolean',
            default: false,
            description: 'Controls whether the panel takes focus. Default is false. If set to true the panel is revealed as well.'
        },
        reveal: {
            type: 'string',
            enum: ['always', 'silent', 'never'],
            enumDescriptions: [
                'Always reveals the terminal when this task is executed.',
                'Only reveals the terminal if the task exits with an error or the problem matcher finds an error.',
                'Never reveals the terminal when this task is executed.'
            ],
            default: 'always',
            description: 'Controls whether the terminal running the task is revealed or not. May be overridden by option \"revealProblems\". Default is \"always\".'
        },
        panel: {
            type: 'string',
            enum: ['shared', 'dedicated', 'new'],
            enumDescriptions: [
                'The terminal is shared and the output of other task runs are added to the same terminal.',
                // eslint-disable-next-line max-len
                'The terminal is dedicated to a specific task. If that task is executed again, the terminal is reused. However, the output of a different task is presented in a different terminal.',
                'Every execution of that task is using a new clean terminal.'
            ],
            default: 'shared',
            description: 'Controls if the panel is shared between tasks, dedicated to this task or a new one is created on every run.'
        },
        showReuseMessage: {
            type: 'boolean',
            default: true,
            description: 'Controls whether to show the "Terminal will be reused by tasks" message.'
        },
        clear: {
            type: 'boolean',
            default: false,
            description: 'Controls whether the terminal is cleared before this task is run.'
        }
    }
};
const detail = {
    type: 'string',
    description: 'An optional description of a task that shows in the Run Task quick pick as a detail.'
};
const taskIdentifier = {
    type: 'object',
    additionalProperties: true,
    properties: {
        type: {
            type: 'string',
            description: 'The task identifier.'
        }
    }
};
const processTaskConfigurationSchema = {
    type: 'object',
    required: ['type', 'label', 'command'],
    properties: {
        label: taskLabel,
        type: defaultTaskType,
        ...commandAndArgs,
        isBackground: {
            type: 'boolean',
            default: false,
            description: 'Whether the executed task is kept alive and is running in the background.'
        },
        dependsOn: {
            anyOf: [
                {
                    type: 'string',
                    description: 'Another task this task depends on.'
                },
                taskIdentifier,
                {
                    type: 'array',
                    description: 'The other tasks this task depends on.',
                    items: {
                        anyOf: [
                            {
                                type: 'string'
                            },
                            taskIdentifier
                        ]
                    }
                }
            ],
            description: 'Either a string representing another task or an array of other tasks that this task depends on.'
        },
        dependsOrder: {
            type: 'string',
            enum: ['parallel', 'sequence'],
            enumDescriptions: [
                'Run all dependsOn tasks in parallel.',
                'Run all dependsOn tasks in sequence.'
            ],
            default: 'parallel',
            description: 'Determines the order of the dependsOn tasks for this task. Note that this property is not recursive.'
        },
        windows: {
            type: 'object',
            description: 'Windows specific command configuration that overrides the command, args, and options',
            properties: commandAndArgs
        },
        osx: {
            type: 'object',
            description: 'MacOS specific command configuration that overrides the command, args, and options',
            properties: commandAndArgs
        },
        linux: {
            type: 'object',
            description: 'Linux specific command configuration that overrides the default command, args, and options',
            properties: commandAndArgs
        },
        group,
        problemMatcher,
        presentation,
        detail,
    },
    additionalProperties: true
};
const customizedDetectedTasks = [];
const customSchemas = [];
const taskConfigurationSchema = {
    $id: exports.taskSchemaId,
    anyOf: [processTaskConfigurationSchema, ...customizedDetectedTasks, ...customSchemas]
};
//# sourceMappingURL=task-schema-updater.js.map