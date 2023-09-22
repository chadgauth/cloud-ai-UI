/// <reference types="react" />
import { CommandContribution, CommandRegistry, CommandService, MenuContribution, MenuModelRegistry } from '@theia/core';
import { LabelProvider, QuickInputService, QuickPickItem } from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';
import * as React from '@theia/core/shared/react';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { AbstractToolbarContribution } from '@theia/toolbar/lib/browser/abstract-toolbar-contribution';
import { ReactInteraction } from '@theia/toolbar/lib/browser/toolbar-constants';
import '../../../src/browser/toolbar/sample-toolbar-contribution.css';
export declare const bindSampleToolbarContribution: (bind: interfaces.Bind, rebind: interfaces.Rebind) => void;
export declare const FIND_IN_WORKSPACE_ROOT: {
    id: string;
    category: string;
    label: string;
};
export declare class SearchInWorkspaceQuickInputService {
    protected readonly quickInputService: QuickInputService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly labelProvider: LabelProvider;
    protected readonly commandService: CommandService;
    protected quickPickItems: QuickPickItem[];
    open(): void;
    protected createWorkspaceList(): QuickPickItem[];
}
export declare class SampleToolbarContribution extends AbstractToolbarContribution implements CommandContribution, MenuContribution {
    protected readonly searchPickService: SearchInWorkspaceQuickInputService;
    protected readonly workspaceService: WorkspaceService;
    static ID: string;
    id: string;
    protected handleOnClick: (e: ReactInteraction<HTMLSpanElement>) => void;
    protected doHandleOnClick(e: ReactInteraction<HTMLSpanElement>): void;
    render(): React.ReactNode;
    registerCommands(registry: CommandRegistry): void;
    registerMenus(registry: MenuModelRegistry): void;
}
//# sourceMappingURL=sample-toolbar-contribution.d.ts.map