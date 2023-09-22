import { Terminal, TerminalOptions, PseudoTerminalOptions, ExtensionTerminalOptions, TerminalState } from '@theia/plugin';
import { TerminalServiceExt, TerminalServiceMain } from '../common/plugin-api-rpc';
import { RPCProtocol } from '../common/rpc-protocol';
import { Event, Emitter } from '@theia/core/lib/common/event';
import { Deferred } from '@theia/core/lib/common/promise-util';
import * as theia from '@theia/plugin';
import { SerializableEnvironmentVariableCollection } from '@theia/terminal/lib/common/base-terminal-protocol';
import { ProvidedTerminalLink } from '../common/plugin-api-rpc-model';
export declare function getIconUris(iconPath: theia.TerminalOptions['iconPath']): {
    id: string;
} | undefined;
export declare function getIconClass(options: theia.TerminalOptions | theia.ExtensionTerminalOptions): string | undefined;
/**
 * Provides high level terminal plugin api to use in the Theia plugins.
 * This service allow(with help proxy) create and use terminal emulator.
 */
export declare class TerminalServiceExtImpl implements TerminalServiceExt {
    private readonly proxy;
    private readonly _terminals;
    private readonly _pseudoTerminals;
    private static nextProviderId;
    private readonly terminalLinkProviders;
    private readonly terminalProfileProviders;
    private readonly onDidCloseTerminalEmitter;
    readonly onDidCloseTerminal: theia.Event<Terminal>;
    private readonly onDidOpenTerminalEmitter;
    readonly onDidOpenTerminal: theia.Event<Terminal>;
    private readonly onDidChangeActiveTerminalEmitter;
    readonly onDidChangeActiveTerminal: theia.Event<Terminal | undefined>;
    private readonly onDidChangeTerminalStateEmitter;
    readonly onDidChangeTerminalState: theia.Event<Terminal>;
    protected environmentVariableCollections: Map<string, EnvironmentVariableCollection>;
    constructor(rpc: RPCProtocol);
    get terminals(): TerminalExtImpl[];
    createTerminal(nameOrOptions: TerminalOptions | PseudoTerminalOptions | ExtensionTerminalOptions | (string | undefined), shellPath?: string, shellArgs?: string[] | string): Terminal;
    attachPtyToTerminal(terminalId: number, pty: theia.Pseudoterminal): void;
    protected obtainTerminal(id: string, name: string, options?: theia.TerminalOptions | theia.ExtensionTerminalOptions): TerminalExtImpl;
    $terminalOnInput(id: string, data: string): void;
    $terminalStateChanged(id: string): void;
    $terminalSizeChanged(id: string, clos: number, rows: number): void;
    $terminalCreated(id: string, name: string): void;
    $terminalNameChanged(id: string, name: string): void;
    $terminalOpened(id: string, processId: number, terminalId: number, cols: number, rows: number): void;
    $terminalClosed(id: string, exitStatus: theia.TerminalExitStatus | undefined): void;
    private activeTerminalId;
    get activeTerminal(): TerminalExtImpl | undefined;
    $currentTerminalChanged(id: string | undefined): void;
    registerTerminalLinkProvider(provider: theia.TerminalLinkProvider): theia.Disposable;
    registerTerminalProfileProvider(id: string, provider: theia.TerminalProfileProvider): theia.Disposable;
    /** @stubbed */
    registerTerminalQuickFixProvider(id: string, provider: theia.TerminalQuickFixProvider): theia.Disposable;
    protected isExtensionTerminalOptions(options: theia.TerminalOptions | theia.ExtensionTerminalOptions): options is theia.ExtensionTerminalOptions;
    $startProfile(profileId: string, cancellationToken: theia.CancellationToken): Promise<string>;
    $provideTerminalLinks(line: string, terminalId: string, token: theia.CancellationToken): Promise<ProvidedTerminalLink[]>;
    $handleTerminalLink(link: ProvidedTerminalLink): Promise<void>;
    getEnvironmentVariableCollection(extensionIdentifier: string): theia.EnvironmentVariableCollection;
    private syncEnvironmentVariableCollection;
    private setEnvironmentVariableCollection;
    $initEnvironmentVariableCollections(collections: [string, SerializableEnvironmentVariableCollection][]): void;
}
export declare class EnvironmentVariableCollection implements theia.EnvironmentVariableCollection {
    readonly map: Map<string, theia.EnvironmentVariableMutator>;
    private _description?;
    private _persistent;
    get description(): string | theia.MarkdownString | undefined;
    set description(value: string | theia.MarkdownString | undefined);
    get persistent(): boolean;
    set persistent(value: boolean);
    protected readonly onDidChangeCollectionEmitter: Emitter<void>;
    onDidChangeCollection: Event<void>;
    constructor(serialized?: SerializableEnvironmentVariableCollection);
    get size(): number;
    replace(variable: string, value: string): void;
    append(variable: string, value: string): void;
    prepend(variable: string, value: string): void;
    private _setIfDiffers;
    get(variable: string): theia.EnvironmentVariableMutator | undefined;
    forEach(callback: (variable: string, mutator: theia.EnvironmentVariableMutator, collection: theia.EnvironmentVariableCollection) => any, thisArg?: any): void;
    delete(variable: string): void;
    clear(): void;
}
export declare class TerminalExtImpl implements Terminal {
    private readonly proxy;
    private readonly options;
    name: string;
    readonly id: Deferred<string>;
    exitStatus: theia.TerminalExitStatus | undefined;
    deferredProcessId: Deferred<number>;
    get processId(): Thenable<number>;
    readonly creationOptions: Readonly<TerminalOptions | ExtensionTerminalOptions>;
    state: TerminalState;
    constructor(proxy: TerminalServiceMain, options: theia.TerminalOptions | theia.ExtensionTerminalOptions);
    sendText(text: string, addNewLine?: boolean): void;
    show(preserveFocus?: boolean): void;
    hide(): void;
    dispose(): void;
}
export declare class PseudoTerminal {
    private readonly proxy;
    private readonly pseudoTerminal;
    constructor(id: string | number, proxy: TerminalServiceMain, pseudoTerminal: theia.Pseudoterminal, waitOnExit?: boolean | string);
    emitOnClose(): void;
    emitOnInput(data: string): void;
    emitOnOpen(cols: number, rows: number): void;
    emitOnResize(cols: number, rows: number): void;
}
//# sourceMappingURL=terminal-ext.d.ts.map