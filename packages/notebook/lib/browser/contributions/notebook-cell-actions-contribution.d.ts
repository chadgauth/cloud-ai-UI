import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ContextKeyService } from '@theia/core/lib/browser/context-key-service';
import { NotebookExecutionService } from '../service/notebook-execution-service';
export declare namespace NotebookCellCommands {
    const EDIT_COMMAND: Command;
    const STOP_EDIT_COMMAND: Command;
    const DELETE_COMMAND: Command;
    const SPLIT_CELL_COMMAND: Command;
    const EXECUTE_SINGLE_CELL_COMMAND: Command;
    const STOP_CELL_EXECUTION_COMMAND: Command;
    const CLEAR_OUTPUTS_COMMAND: Command;
    const CHANGE_OUTPUT_PRESENTATION_COMMAND: Command;
}
export declare class NotebookCellActionContribution implements MenuContribution, CommandContribution {
    protected contextKeyService: ContextKeyService;
    protected notebookExecutionService: NotebookExecutionService;
    protected init(): void;
    registerMenus(menus: MenuModelRegistry): void;
    registerCommands(commands: CommandRegistry): void;
}
export declare namespace NotebookCellActionContribution {
    const ACTION_MENU: string[];
    const ADDITIONAL_ACTION_MENU: string[];
    const CONTRIBUTED_CELL_ACTION_MENU = "notebook/cell/title";
    const CONTRIBUTED_CELL_EXECUTION_MENU = "notebook/cell/execute";
    const CODE_CELL_SIDEBAR_MENU: string[];
    const OUTPUT_SIDEBAR_MENU: string[];
    const ADDITIONAL_OUTPUT_SIDEBAR_MENU: string[];
}
//# sourceMappingURL=notebook-cell-actions-contribution.d.ts.map