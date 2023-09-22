import { Command, ContributionProvider, Emitter, MaybePromise, MessageService } from '@theia/core';
import { Widget } from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { DeflatedToolbarTree, ToolbarContribution, ToolbarTreeSchema, ToolbarAlignment, ToolbarItemPosition } from './toolbar-interfaces';
import { ToolbarStorageProvider } from './toolbar-storage-provider';
export declare class ToolbarController {
    protected readonly storageProvider: ToolbarStorageProvider;
    protected readonly appState: FrontendApplicationStateService;
    protected readonly messageService: MessageService;
    protected readonly defaultsFactory: () => DeflatedToolbarTree;
    protected widgetContributions: ContributionProvider<ToolbarContribution>;
    protected toolbarModelDidUpdateEmitter: Emitter<void>;
    readonly onToolbarModelDidUpdate: import("@theia/core").Event<void>;
    protected toolbarProviderBusyEmitter: Emitter<boolean>;
    readonly onToolbarDidChangeBusyState: import("@theia/core").Event<boolean>;
    readonly ready: Deferred<void>;
    protected _toolbarItems: ToolbarTreeSchema;
    get toolbarItems(): ToolbarTreeSchema;
    set toolbarItems(newTree: ToolbarTreeSchema);
    protected inflateItems(schema: DeflatedToolbarTree): ToolbarTreeSchema;
    getContributionByID(id: string): ToolbarContribution | undefined;
    protected init(): void;
    protected doInit(): Promise<void>;
    protected resolveToolbarItems(): Promise<ToolbarTreeSchema>;
    swapValues(oldPosition: ToolbarItemPosition, newPosition: ToolbarItemPosition, direction: 'location-left' | 'location-right'): Promise<boolean>;
    clearAll(): Promise<boolean>;
    openOrCreateJSONFile(doOpen?: boolean): Promise<Widget | undefined>;
    addItem(command: Command, area: ToolbarAlignment): Promise<boolean>;
    removeItem(position: ToolbarItemPosition, id?: string): Promise<boolean>;
    moveItemToEmptySpace(draggedItemPosition: ToolbarItemPosition, column: ToolbarAlignment, centerPosition?: 'left' | 'right'): Promise<boolean>;
    insertGroup(position: ToolbarItemPosition, insertDirection: 'left' | 'right'): Promise<boolean>;
    withBusy<T = unknown>(action: () => MaybePromise<T>): Promise<T>;
}
//# sourceMappingURL=toolbar-controller.d.ts.map