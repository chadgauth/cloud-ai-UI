import { interfaces } from '@theia/core/shared/inversify';
import { TabBar, Title, Widget } from '@theia/core/lib/browser';
import { AnyInputDto, TabDto, TabGroupDto, TabsMain } from '../../../common/plugin-api-rpc';
import { RPCProtocol } from '../../../common/rpc-protocol';
import { Disposable } from '@theia/core/shared/vscode-languageserver-protocol';
import { DisposableCollection } from '@theia/core';
interface TabInfo {
    tab: TabDto;
    tabIndex: number;
    group: TabGroupDto;
}
export declare class TabsMainImpl implements TabsMain, Disposable {
    private readonly proxy;
    private tabGroupModel;
    private tabInfoLookup;
    private applicationShell;
    private disposableTabBarListeners;
    private toDisposeOnDestroy;
    private groupIdCounter;
    private currentActiveGroup;
    private tabGroupChanged;
    constructor(rpc: RPCProtocol, container: interfaces.Container);
    protected createTabsModel(): void;
    protected createTabDto(tabTitle: Title<Widget>, groupId: number): TabDto;
    protected createTabId(tabTitle: Title<Widget>, groupId: number): string;
    protected createTabGroupDto(tabBar: TabBar<Widget>): TabGroupDto;
    protected attachListenersToTabBar(tabBar: TabBar<Widget> | undefined): void;
    protected evaluateTabDtoInput(widget: Widget): AnyInputDto;
    protected connectToSignal<T>(disposableList: DisposableCollection, signal: {
        connect(listener: T, context: unknown): void;
        disconnect(listener: T): void;
    }, listener: T): void;
    protected tabDtosEqual(a: TabDto, b: TabDto): boolean;
    protected getOrRebuildModel<T, R>(map: Map<T, R>, key: T): R;
    private onTabCreated;
    private onTabTitleChanged;
    private onTabClosed;
    private onTabMoved;
    private onTabGroupCreated;
    private onTabGroupClosed;
    $moveTab(tabId: string, index: number, viewColumn: number, preserveFocus?: boolean): void;
    updateTabIndices(tabInfo: TabInfo, startIndex: number): void;
    $closeTab(tabIds: string[], preserveFocus?: boolean): Promise<boolean>;
    $closeGroup(groupIds: number[], preserveFocus?: boolean): Promise<boolean>;
    dispose(): void;
}
export {};
//# sourceMappingURL=tabs-main.d.ts.map