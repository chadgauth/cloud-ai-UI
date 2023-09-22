import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ContributionProvider, Event, Emitter, ILogger, DisposableCollection, Channel } from '@theia/core';
import { Widget, Message, WebSocketConnectionProvider, StatefulWidget, ExtractableWidget, ContextMenuRenderer } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { ShellTerminalServerProxy, IShellTerminalPreferences } from '../common/shell-terminal-protocol';
import { TerminalProcessInfo } from '../common/base-terminal-protocol';
import { TerminalWatcher } from '../common/terminal-watcher';
import { TerminalWidgetOptions, TerminalWidget, TerminalDimensions, TerminalExitStatus, TerminalLocationOptions } from './base/terminal-widget';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { TerminalPreferences } from './terminal-preferences';
import URI from '@theia/core/lib/common/uri';
import { TerminalService } from './base/terminal-service';
import { TerminalSearchWidgetFactory, TerminalSearchWidget } from './search/terminal-search-widget';
import { TerminalCopyOnSelectionHandler } from './terminal-copy-on-selection-handler';
import { TerminalThemeService } from './terminal-theme-service';
import { CommandLineOptions, ShellCommandBuilder } from '@theia/process/lib/common/shell-command-builder';
import { MarkdownString } from '@theia/core/lib/common/markdown-rendering/markdown-string';
import { EnhancedPreviewWidget } from '@theia/core/lib/browser/widgets/enhanced-preview-widget';
import { MarkdownRenderer, MarkdownRendererFactory } from '@theia/core/lib/browser/markdown-rendering/markdown-renderer';
export declare const TERMINAL_WIDGET_FACTORY_ID = "terminal";
export interface TerminalWidgetFactoryOptions extends Partial<TerminalWidgetOptions> {
    created: string;
}
export declare const TerminalContribution: unique symbol;
export interface TerminalContribution {
    onCreate(term: TerminalWidgetImpl): void;
}
export declare class TerminalWidgetImpl extends TerminalWidget implements StatefulWidget, ExtractableWidget, EnhancedPreviewWidget {
    readonly isExtractable: boolean;
    secondaryWindow: Window | undefined;
    location: TerminalLocationOptions;
    static LABEL: string;
    exitStatus: TerminalExitStatus | undefined;
    protected terminalKind: string;
    protected _terminalId: number;
    protected readonly onTermDidClose: Emitter<TerminalWidget>;
    protected fitAddon: FitAddon;
    protected term: Terminal;
    protected searchBox: TerminalSearchWidget;
    protected restored: boolean;
    protected closeOnDispose: boolean;
    protected waitForConnection: Deferred<Channel> | undefined;
    protected linkHover: HTMLDivElement;
    protected linkHoverButton: HTMLAnchorElement;
    protected lastTouchEnd: TouchEvent | undefined;
    protected lastMousePosition: {
        x: number;
        y: number;
    } | undefined;
    protected isAttachedCloseListener: boolean;
    protected shown: boolean;
    protected enhancedPreviewNode: Node | undefined;
    lastCwd: URI;
    protected readonly workspaceService: WorkspaceService;
    protected readonly webSocketConnectionProvider: WebSocketConnectionProvider;
    options: TerminalWidgetOptions;
    protected readonly shellTerminalServer: ShellTerminalServerProxy;
    protected readonly terminalWatcher: TerminalWatcher;
    protected readonly logger: ILogger;
    readonly id: string;
    protected readonly preferences: TerminalPreferences;
    protected readonly terminalContributionProvider: ContributionProvider<TerminalContribution>;
    protected readonly terminalService: TerminalService;
    protected readonly terminalSearchBoxFactory: TerminalSearchWidgetFactory;
    protected readonly copyOnSelectionHandler: TerminalCopyOnSelectionHandler;
    protected readonly themeService: TerminalThemeService;
    protected readonly shellCommandBuilder: ShellCommandBuilder;
    protected readonly contextMenuRenderer: ContextMenuRenderer;
    protected readonly markdownRendererFactory: MarkdownRendererFactory;
    protected _markdownRenderer: MarkdownRenderer | undefined;
    protected get markdownRenderer(): MarkdownRenderer;
    protected readonly onDidOpenEmitter: Emitter<void>;
    readonly onDidOpen: Event<void>;
    protected readonly onDidOpenFailureEmitter: Emitter<void>;
    readonly onDidOpenFailure: Event<void>;
    protected readonly onSizeChangedEmitter: Emitter<{
        cols: number;
        rows: number;
    }>;
    readonly onSizeChanged: Event<{
        cols: number;
        rows: number;
    }>;
    protected readonly onDataEmitter: Emitter<string>;
    readonly onData: Event<string>;
    protected readonly onKeyEmitter: Emitter<{
        key: string;
        domEvent: KeyboardEvent;
    }>;
    readonly onKey: Event<{
        key: string;
        domEvent: KeyboardEvent;
    }>;
    protected readonly onMouseEnterLinkHoverEmitter: Emitter<MouseEvent>;
    readonly onMouseEnterLinkHover: Event<MouseEvent>;
    protected readonly onMouseLeaveLinkHoverEmitter: Emitter<MouseEvent>;
    readonly onMouseLeaveLinkHover: Event<MouseEvent>;
    protected readonly toDisposeOnConnect: DisposableCollection;
    protected init(): void;
    get kind(): 'user' | string;
    /**
     * Get the cursor style compatible with `xterm`.
     * @returns CursorStyle
     */
    private getCursorStyle;
    /**
     * Returns given renderer type if it is valid and supported or default renderer otherwise.
     *
     * @param terminalRendererType desired terminal renderer type
     */
    private getTerminalRendererType;
    protected initializeLinkHover(): void;
    showLinkHover(invokeAction: (event: MouseEvent) => void, x: number, y: number, message?: string): void;
    protected linkHoverMessage(message?: string): string;
    hideLinkHover(): void;
    getTerminal(): Terminal;
    getSearchBox(): TerminalSearchWidget;
    protected onCloseRequest(msg: Message): void;
    get dimensions(): TerminalDimensions;
    get cwd(): Promise<URI>;
    get processId(): Promise<number>;
    get processInfo(): Promise<TerminalProcessInfo>;
    get envVarCollectionDescriptionsByExtension(): Promise<Map<string, string | MarkdownString | undefined>>;
    get terminalId(): number;
    get lastTouchEndEvent(): TouchEvent | undefined;
    get hiddenFromUser(): boolean;
    get transient(): boolean;
    onDispose(onDispose: () => void): void;
    clearOutput(): void;
    selectAll(): void;
    hasChildProcesses(): Promise<boolean>;
    storeState(): object;
    restoreState(oldState: object): void;
    /**
     * Create a new shell terminal in the back-end and attach it to a
     * new terminal widget.
     * If id is provided attach to the terminal for this id.
     */
    start(id?: number): Promise<number>;
    protected attachTerminal(id: number): Promise<number>;
    protected createTerminal(): Promise<number>;
    processMessage(msg: Message): void;
    protected onFitRequest(msg: Message): void;
    protected onActivateRequest(msg: Message): void;
    protected onAfterShow(msg: Message): void;
    protected onAfterAttach(msg: Message): void;
    protected onBeforeDetach(msg: Message): void;
    protected onResize(msg: Widget.ResizeMessage): void;
    protected needsResize: boolean;
    protected onUpdateRequest(msg: Message): void;
    protected readonly deviceStatusCodes: Set<string>;
    protected connectTerminalProcess(): void;
    protected reconnectTerminalProcess(): Promise<void>;
    protected termOpened: boolean;
    protected initialData: string;
    protected open(): void;
    write(data: string): void;
    resize(cols: number, rows: number): void;
    sendText(text: string): void;
    executeCommand(commandOptions: CommandLineOptions): Promise<void>;
    scrollLineUp(): void;
    scrollLineDown(): void;
    scrollToTop(): void;
    scrollToBottom(): void;
    scrollPageUp(): void;
    scrollPageDown(): void;
    resetTerminal(): void;
    writeLine(text: string): void;
    get onTerminalDidClose(): Event<TerminalWidget>;
    dispose(): void;
    protected resizeTerminal: () => Promise<void>;
    protected doResizeTerminal(): void;
    protected resizeTerminalProcess(): void;
    protected get enableCopy(): boolean;
    protected get enablePaste(): boolean;
    protected get shellPreferences(): IShellTerminalPreferences;
    protected customKeyHandler(event: KeyboardEvent): boolean;
    protected get copyOnSelection(): boolean;
    protected attachCustomKeyEventHandler(): void;
    setTitle(title: string): void;
    waitOnExit(waitOnExit?: boolean | string): void;
    private attachPressEnterKeyToCloseListener;
    private disableEnterWhenAttachCloseListener;
    getEnhancedPreviewNode(): Node | undefined;
}
//# sourceMappingURL=terminal-widget-impl.d.ts.map