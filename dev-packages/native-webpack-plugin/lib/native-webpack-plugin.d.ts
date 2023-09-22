import type { Compiler } from 'webpack';
export interface NativeWebpackPluginOptions {
    out: string;
    ripgrep: boolean;
    pty: boolean;
    replacements?: Record<string, string>;
    nativeBindings?: Record<string, string>;
}
export declare class NativeWebpackPlugin {
    private bindings;
    private options;
    private tracker;
    constructor(options: NativeWebpackPluginOptions);
    nativeBinding(dependency: string, nodePath: string): void;
    apply(compiler: Compiler): void;
    protected copyRipgrep(compiler: Compiler): Promise<void>;
    protected copyNodePtySpawnHelper(compiler: Compiler): Promise<void>;
    protected copyTrashHelper(compiler: Compiler): Promise<void>;
    protected copyExecutable(source: string, target: string): Promise<void>;
}
//# sourceMappingURL=native-webpack-plugin.d.ts.map