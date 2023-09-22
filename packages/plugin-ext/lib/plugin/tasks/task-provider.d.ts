import * as theia from '@theia/plugin';
import { TaskDto } from '../../common';
export declare class TaskProviderAdapter {
    private readonly provider;
    constructor(provider: theia.TaskProvider);
    provideTasks(token: theia.CancellationToken): Promise<TaskDto[]>;
    resolveTask(task: TaskDto, token: theia.CancellationToken): Promise<TaskDto>;
}
//# sourceMappingURL=task-provider.d.ts.map