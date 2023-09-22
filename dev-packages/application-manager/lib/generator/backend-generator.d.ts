import { AbstractGenerator } from './abstract-generator';
export declare class BackendGenerator extends AbstractGenerator {
    generate(): Promise<void>;
    protected compileElectronMain(electronMainModules?: Map<string, string>): string;
    protected compileServer(backendModules: Map<string, string>): string;
    protected compileMain(backendModules: Map<string, string>): string;
}
//# sourceMappingURL=backend-generator.d.ts.map