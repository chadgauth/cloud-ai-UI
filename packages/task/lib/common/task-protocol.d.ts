import { Event } from '@theia/core';
import { RpcServer } from '@theia/core/lib/common/messaging/proxy-factory';
import { IJSONSchema } from '@theia/core/lib/common/json-schema';
import { ProblemMatcher, ProblemMatch, WatchingMatcherContribution, ProblemMatcherContribution, ProblemPatternContribution } from './problem-matcher-protocol';
export { WatchingMatcherContribution, ProblemMatcherContribution, ProblemPatternContribution };
export declare const taskPath = "/services/task";
export declare const TaskServer: unique symbol;
export declare const TaskClient: unique symbol;
export declare enum DependsOrder {
    Sequence = "sequence",
    Parallel = "parallel"
}
export declare enum RevealKind {
    Always = "always",
    Silent = "silent",
    Never = "never"
}
export declare enum PanelKind {
    Shared = "shared",
    Dedicated = "dedicated",
    New = "new"
}
export interface TaskOutputPresentation {
    echo?: boolean;
    focus?: boolean;
    reveal?: RevealKind;
    panel?: PanelKind;
    showReuseMessage?: boolean;
    clear?: boolean;
    close?: boolean;
    [name: string]: any;
}
export declare namespace TaskOutputPresentation {
    function getDefault(): TaskOutputPresentation;
    function fromJson(task: any): TaskOutputPresentation;
    function shouldAlwaysRevealTerminal(task: TaskCustomization): boolean;
    function shouldSetFocusToTerminal(task: TaskCustomization): boolean;
    function shouldClearTerminalBeforeRun(task: TaskCustomization): boolean;
    function shouldCloseTerminalOnFinish(task: TaskCustomization): boolean;
    function shouldShowReuseMessage(task: TaskCustomization): boolean;
}
export interface TaskCustomization {
    type: string;
    group?: 'build' | 'test' | 'rebuild' | 'clean' | 'none' | {
        kind: 'build' | 'test' | 'rebuild' | 'clean';
        isDefault: boolean;
    };
    problemMatcher?: string | ProblemMatcherContribution | (string | ProblemMatcherContribution)[];
    presentation?: TaskOutputPresentation;
    detail?: string;
    /** Whether the task is a background task or not. */
    isBackground?: boolean;
    /** The other tasks the task depend on. */
    dependsOn?: string | TaskIdentifier | Array<string | TaskIdentifier>;
    /** The order the dependsOn tasks should be executed in. */
    dependsOrder?: DependsOrder;
    runOptions?: RunOptions;
    [name: string]: any;
}
export declare namespace TaskCustomization {
    function isBuildTask(task: TaskCustomization): boolean;
    function isDefaultBuildTask(task: TaskCustomization): boolean;
    function isDefaultTask(task: TaskCustomization): boolean;
    function isTestTask(task: TaskCustomization): boolean;
    function isDefaultTestTask(task: TaskCustomization): boolean;
}
export declare enum TaskScope {
    Global = 1,
    Workspace = 2
}
/**
 * The task configuration scopes.
 * - `string` represents the associated workspace folder uri.
 */
export declare type TaskConfigurationScope = string | TaskScope.Workspace | TaskScope.Global;
export interface TaskConfiguration extends TaskCustomization {
    /** A label that uniquely identifies a task configuration per source */
    readonly label: string;
    readonly _scope: TaskConfigurationScope;
}
export interface ContributedTaskConfiguration extends TaskConfiguration {
    /**
     * Source of the task configuration.
     * For a configured task, it is the name of the root folder, while for a provided task, it is the name of the provider.
     * This field is not supposed to be used in `tasks.json`
     */
    readonly _source: string;
}
/** A task identifier */
export interface TaskIdentifier {
    type: string;
    [name: string]: string;
}
/** Runtime information about Task. */
export interface TaskInfo {
    /** internal unique task id */
    readonly taskId: number;
    /** terminal id. Defined if task is run as a terminal process */
    readonly terminalId?: number;
    /** context that was passed as part of task creation, if any */
    readonly ctx?: string;
    /** task config used for launching a task */
    readonly config: TaskConfiguration;
    /** Additional properties specific for a particular Task Runner. */
    readonly [key: string]: any;
}
export interface TaskServer extends RpcServer<TaskClient> {
    /** Run a task. Optionally pass a context.  */
    run(task: TaskConfiguration, ctx?: string, option?: RunTaskOption): Promise<TaskInfo>;
    /** Kill a task, by id. */
    kill(taskId: number): Promise<void>;
    /**
     * Returns a list of currently running tasks. If a context is provided,
     * only the tasks started in that context will be provided. Using an
     * undefined context matches all tasks, no matter the creation context.
     */
    getTasks(ctx?: string): Promise<TaskInfo[]>;
    /** removes the client that has disconnected */
    disconnectClient(client: TaskClient): void;
    /** Returns the list of default and registered task runners */
    getRegisteredTaskTypes(): Promise<string[]>;
    /** plugin callback task complete */
    customExecutionComplete(id: number, exitCode: number | undefined): Promise<void>;
}
export interface TaskCustomizationData {
    type: string;
    problemMatcher?: ProblemMatcher[];
    [name: string]: any;
}
export interface RunTaskOption {
    customization?: TaskCustomizationData;
}
export interface RunOptions {
    reevaluateOnRerun?: boolean;
}
/** Event sent when a task has concluded its execution */
export interface TaskExitedEvent {
    readonly taskId: number;
    readonly ctx?: string;
    readonly code?: number;
    readonly signal?: string;
    readonly config?: TaskConfiguration;
    readonly terminalId?: number;
    readonly processId?: number;
}
export interface TaskOutputEvent {
    readonly taskId: number;
    readonly ctx?: string;
    readonly line: string;
}
export interface TaskOutputProcessedEvent {
    readonly taskId: number;
    readonly config: TaskConfiguration;
    readonly ctx?: string;
    readonly problems?: ProblemMatch[];
}
export interface BackgroundTaskEndedEvent {
    readonly taskId: number;
    readonly ctx?: string;
}
export interface TaskClient {
    onTaskExit(event: TaskExitedEvent): void;
    onTaskCreated(event: TaskInfo): void;
    onDidStartTaskProcess(event: TaskInfo): void;
    onDidEndTaskProcess(event: TaskExitedEvent): void;
    onDidProcessTaskOutput(event: TaskOutputProcessedEvent): void;
    onBackgroundTaskEnded(event: BackgroundTaskEndedEvent): void;
}
export interface TaskDefinition {
    taskType: string;
    source: string;
    properties: {
        /**
         * Should be treated as an empty array if omitted.
         * https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6.5.3
         */
        required?: string[];
        all: string[];
        schema: IJSONSchema;
    };
}
export interface ManagedTask {
    id: number;
    context?: string;
}
export interface ManagedTaskManager<T extends ManagedTask> {
    onDelete: Event<number>;
    register(task: T, context?: string): number;
    get(id: number): T | undefined;
    getTasks(context?: string): T[] | undefined;
    delete(task: T): void;
}
//# sourceMappingURL=task-protocol.d.ts.map