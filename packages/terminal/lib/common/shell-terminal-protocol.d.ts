import { RpcProxy } from '@theia/core';
import { IBaseTerminalServer, IBaseTerminalServerOptions } from './base-terminal-protocol';
import { OS } from '@theia/core/lib/common/os';
export declare const IShellTerminalServer: unique symbol;
export interface IShellTerminalServer extends IBaseTerminalServer {
    hasChildProcesses(processId: number | undefined): Promise<boolean>;
}
export declare const shellTerminalPath = "/services/shell-terminal";
export declare type ShellTerminalOSPreferences<T> = {
    [key in OS.Type]: T;
};
export interface IShellTerminalPreferences {
    shell: ShellTerminalOSPreferences<string | undefined>;
    shellArgs: ShellTerminalOSPreferences<string[]>;
}
export interface IShellTerminalServerOptions extends IBaseTerminalServerOptions {
    shell?: string;
    args?: string[] | string;
    rootURI?: string;
    cols?: number;
    rows?: number;
    env?: {
        [key: string]: string | null;
    };
    strictEnv?: boolean;
    isPseudo?: boolean;
}
export declare const ShellTerminalServerProxy: unique symbol;
export declare type ShellTerminalServerProxy = RpcProxy<IShellTerminalServer>;
//# sourceMappingURL=shell-terminal-protocol.d.ts.map