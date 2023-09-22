import { TaskService } from './task-service';
import { TaskInfo, TaskConfiguration, TaskDefinition } from '../common/task-protocol';
import { TaskDefinitionRegistry } from './task-definition-registry';
import { LabelProvider, QuickAccessProvider, QuickAccessRegistry, QuickInputService, QuickPick, PreferenceService } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { TerminalService } from '@theia/terminal/lib/browser/base/terminal-service';
import { TaskNameResolver } from './task-name-resolver';
import { TaskSourceResolver } from './task-source-resolver';
import { TaskConfigurationManager } from './task-configuration-manager';
import { QuickInputButton, QuickPickItem, QuickPickItemOrSeparator, QuickPicks, QuickPickInput, QuickPickValue } from '@theia/core/lib/browser/quick-input/quick-input-service';
import { CancellationToken } from '@theia/core/lib/common';
import { TriggerAction } from '@theia/monaco-editor-core/esm/vs/platform/quickinput/browser/pickerQuickAccess';
export declare namespace ConfigureTaskAction {
    const ID = "workbench.action.tasks.configureTaskRunner";
    const TEXT = "Configure Task";
}
export declare type TaskEntry = QuickPickItemOrSeparator | QuickPickValue<string>;
export declare namespace TaskEntry {
    function isQuickPickValue(item: QuickPickItemOrSeparator | QuickPickValue<String>): item is QuickPickValue<string>;
}
export declare const CHOOSE_TASK: string;
export declare const CONFIGURE_A_TASK: string;
export declare const NO_TASK_TO_RUN: string;
export declare const SHOW_ALL: string;
export declare class QuickOpenTask implements QuickAccessProvider {
    static readonly PREFIX = "task ";
    readonly description: string;
    protected items: Array<TaskEntry>;
    protected readonly taskService: TaskService;
    protected readonly quickInputService: QuickInputService;
    protected readonly quickAccessRegistry: QuickAccessRegistry;
    protected readonly workspaceService: WorkspaceService;
    protected readonly taskDefinitionRegistry: TaskDefinitionRegistry;
    protected readonly taskNameResolver: TaskNameResolver;
    protected readonly taskSourceResolver: TaskSourceResolver;
    protected readonly taskConfigurationManager: TaskConfigurationManager;
    protected readonly preferences: PreferenceService;
    protected readonly labelProvider: LabelProvider;
    init(): Promise<void>;
    protected doInit(token: number): Promise<void>;
    protected createProvidedTypeItems(providedTypes: TaskDefinition[]): TaskEntry[];
    protected toProvidedTaskTypeEntry(type: string, label: string): TaskEntry;
    protected onDidTriggerGearIcon(item: QuickPickItem): void;
    open(): Promise<void>;
    showMultiLevelQuickPick(skipInit?: boolean): Promise<void>;
    protected doPickerFirstLevel(picker: QuickPick<TaskEntry>): Promise<TaskEntry | undefined>;
    protected doSecondLevel(taskType: string): Promise<void>;
    attach(): void;
    configure(): Promise<void>;
    protected resolveItemsToConfigure(): Promise<QuickPickInput<QuickPickItemOrSeparator>[]>;
    private addConfigurationItems;
    protected getTaskItems(): QuickPickItem[];
    runBuildOrTestTask(buildOrTestType: 'build' | 'test'): Promise<void>;
    getPicks(filter: string, token: CancellationToken): Promise<QuickPicks>;
    registerQuickAccessProvider(): void;
    protected getRunningTaskLabel(task: TaskInfo): string;
    private getItems;
    private getFilteredTasks;
    private getGroupedTasksByWorkspaceFolder;
}
export declare class TaskRunQuickOpenItem implements QuickPickItem {
    readonly token: number;
    readonly task: TaskConfiguration;
    protected taskService: TaskService;
    protected isMulti: boolean;
    protected readonly taskDefinitionRegistry: TaskDefinitionRegistry;
    protected readonly taskNameResolver: TaskNameResolver;
    protected readonly taskSourceResolver: TaskSourceResolver;
    protected taskConfigurationManager: TaskConfigurationManager;
    readonly buttons?: QuickInputButton[] | undefined;
    constructor(token: number, task: TaskConfiguration, taskService: TaskService, isMulti: boolean, taskDefinitionRegistry: TaskDefinitionRegistry, taskNameResolver: TaskNameResolver, taskSourceResolver: TaskSourceResolver, taskConfigurationManager: TaskConfigurationManager, buttons?: QuickInputButton[] | undefined);
    get label(): string;
    get description(): string;
    get detail(): string | undefined;
    execute(): void;
    trigger(): TriggerAction;
}
export declare class ConfigureBuildOrTestTaskQuickOpenItem extends TaskRunQuickOpenItem {
    protected readonly isBuildTask: boolean;
    constructor(token: number, task: TaskConfiguration, taskService: TaskService, isMulti: boolean, taskNameResolver: TaskNameResolver, isBuildTask: boolean, taskConfigurationManager: TaskConfigurationManager, taskDefinitionRegistry: TaskDefinitionRegistry, taskSourceResolver: TaskSourceResolver);
    execute(): void;
}
export declare class TaskConfigureQuickOpenItem implements QuickPickItem {
    protected readonly token: number;
    protected readonly task: TaskConfiguration;
    protected readonly taskService: TaskService;
    protected readonly taskNameResolver: TaskNameResolver;
    protected readonly workspaceService: WorkspaceService;
    protected readonly isMulti: boolean;
    protected taskDefinitionRegistry: TaskDefinitionRegistry;
    constructor(token: number, task: TaskConfiguration, taskService: TaskService, taskNameResolver: TaskNameResolver, workspaceService: WorkspaceService, isMulti: boolean);
    get label(): string;
    get description(): string;
    accept(): void;
    execute(): void;
}
export declare class TaskTerminateQuickOpen {
    protected readonly labelProvider: LabelProvider;
    protected readonly quickInputService: QuickInputService;
    protected readonly taskDefinitionRegistry: TaskDefinitionRegistry;
    protected readonly taskNameResolver: TaskNameResolver;
    protected readonly taskSourceResolver: TaskSourceResolver;
    protected readonly taskService: TaskService;
    protected readonly workspaceService: WorkspaceService;
    getItems(): Promise<Array<QuickPickItem>>;
    open(): Promise<void>;
}
export declare class TaskRunningQuickOpen {
    protected readonly labelProvider: LabelProvider;
    protected readonly quickInputService: QuickInputService;
    protected readonly taskDefinitionRegistry: TaskDefinitionRegistry;
    protected readonly taskNameResolver: TaskNameResolver;
    protected readonly taskSourceResolver: TaskSourceResolver;
    protected readonly taskService: TaskService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly terminalService: TerminalService;
    getItems(): Promise<Array<QuickPickItem>>;
    open(): Promise<void>;
}
export declare class RunningTaskQuickOpenItem implements QuickPickItem {
    protected readonly taskInfo: TaskInfo;
    protected readonly taskService: TaskService;
    protected readonly taskNameResolver: TaskNameResolver;
    protected readonly taskSourceResolver: TaskSourceResolver;
    protected readonly taskDefinitionRegistry: TaskDefinitionRegistry;
    protected readonly labelProvider: LabelProvider;
    protected readonly isMulti: boolean;
    readonly execute: () => void;
    constructor(taskInfo: TaskInfo, taskService: TaskService, taskNameResolver: TaskNameResolver, taskSourceResolver: TaskSourceResolver, taskDefinitionRegistry: TaskDefinitionRegistry, labelProvider: LabelProvider, isMulti: boolean, execute: () => void);
    get label(): string;
    get description(): string;
    get detail(): string | undefined;
}
export declare class TaskRestartRunningQuickOpen {
    protected readonly labelProvider: LabelProvider;
    protected readonly quickInputService: QuickInputService;
    protected readonly taskDefinitionRegistry: TaskDefinitionRegistry;
    protected readonly taskNameResolver: TaskNameResolver;
    protected readonly taskSourceResolver: TaskSourceResolver;
    protected readonly taskService: TaskService;
    protected readonly workspaceService: WorkspaceService;
    getItems(): Promise<Array<QuickPickItem>>;
    open(): Promise<void>;
}
//# sourceMappingURL=quick-open-task.d.ts.map