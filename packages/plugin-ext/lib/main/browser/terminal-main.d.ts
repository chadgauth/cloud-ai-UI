import { interfaces } from '@theia/core/shared/inversify';
import { TerminalEditorLocationOptions, TerminalOptions } from '@theia/plugin';
import { TerminalLocation, TerminalWidget } from '@theia/terminal/lib/browser/base/terminal-widget';
import { TerminalServiceMain } from '../../common/plugin-api-rpc';
import { RPCProtocol } from '../../common/rpc-protocol';
import { Disposable } from '@theia/core/lib/common/disposable';
import { SerializableExtensionEnvironmentVariableCollection } from '@theia/terminal/lib/common/base-terminal-protocol';
import { TerminalLink, TerminalLinkProvider } from '@theia/terminal/lib/browser/terminal-link-provider';
import { CancellationToken } from '@theia/core';
/**
 * Plugin api service allows working with terminal emulator.
 */
export declare class TerminalServiceMainImpl implements TerminalServiceMain, TerminalLinkProvider, Disposable {
    private readonly terminals;
    private readonly pluginTerminalRegistry;
    private readonly hostedPluginSupport;
    private readonly shell;
    private readonly extProxy;
    private readonly shellTerminalServer;
    private readonly terminalLinkProviders;
    private readonly toDispose;
    constructor(rpc: RPCProtocol, container: interfaces.Container);
    startProfile(id: string): Promise<string>;
    $setEnvironmentVariableCollection(persistent: boolean, collection: SerializableExtensionEnvironmentVariableCollection): void;
    dispose(): void;
    protected updateCurrentTerminal(): void;
    protected trackTerminal(terminal: TerminalWidget): Promise<void>;
    $write(id: string, data: string): void;
    $resize(id: string, cols: number, rows: number): void;
    $createTerminal(id: string, options: TerminalOptions, parentId?: string, isPseudoTerminal?: boolean): Promise<string>;
    protected getTerminalLocation(options: TerminalOptions, parentId?: string): TerminalLocation | TerminalEditorLocationOptions | {
        parentTerminal: string;
    } | undefined;
    $sendText(id: string, text: string, addNewLine?: boolean): void;
    $show(id: string, preserveFocus?: boolean): void;
    $hide(id: string): void;
    $dispose(id: string): void;
    $setName(id: string, name: string): void;
    $sendTextByTerminalId(id: number, text: string, addNewLine?: boolean): void;
    $writeByTerminalId(id: number, data: string): void;
    $resizeByTerminalId(id: number, cols: number, rows: number): void;
    $showByTerminalId(id: number, preserveFocus?: boolean): void;
    $hideByTerminalId(id: number): void;
    $disposeByTerminalId(id: number, waitOnExit?: boolean | string): void;
    $setNameByTerminalId(id: number, name: string): void;
    $registerTerminalLinkProvider(providerId: string): Promise<void>;
    $unregisterTerminalLinkProvider(providerId: string): Promise<void>;
    provideLinks(line: string, terminal: TerminalWidget, cancellationToken?: CancellationToken | undefined): Promise<TerminalLink[]>;
}
//# sourceMappingURL=terminal-main.d.ts.map