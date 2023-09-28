import { Emitter } from '@theia/core/lib/common';
import { StorageService } from '@theia/core/lib/browser';
import { Marker } from '@theia/markers/lib/common/marker';
import { MarkerManager } from '@theia/markers/lib/browser/marker-manager';
import URI from '@theia/core/lib/common/uri';
import { SourceBreakpoint, ExceptionBreakpoint, FunctionBreakpoint, BaseBreakpoint, InstructionBreakpoint } from './breakpoint-marker';
export interface BreakpointsChangeEvent<T extends BaseBreakpoint> {
    uri: URI;
    added: T[];
    removed: T[];
    changed: T[];
}
export declare type SourceBreakpointsChangeEvent = BreakpointsChangeEvent<SourceBreakpoint>;
export declare type FunctionBreakpointsChangeEvent = BreakpointsChangeEvent<FunctionBreakpoint>;
export declare type InstructionBreakpointsChangeEvent = BreakpointsChangeEvent<InstructionBreakpoint>;
export declare class BreakpointManager extends MarkerManager<SourceBreakpoint> {
    static EXCEPTION_URI: URI;
    static FUNCTION_URI: URI;
    static INSTRUCTION_URI: URI;
    protected readonly owner = "breakpoint";
    protected readonly storage: StorageService;
    getKind(): string;
    protected readonly onDidChangeBreakpointsEmitter: Emitter<SourceBreakpointsChangeEvent>;
    readonly onDidChangeBreakpoints: import("@theia/core/lib/common").Event<SourceBreakpointsChangeEvent>;
    protected readonly onDidChangeFunctionBreakpointsEmitter: Emitter<FunctionBreakpointsChangeEvent>;
    readonly onDidChangeFunctionBreakpoints: import("@theia/core/lib/common").Event<FunctionBreakpointsChangeEvent>;
    protected readonly onDidChangeInstructionBreakpointsEmitter: Emitter<InstructionBreakpointsChangeEvent>;
    readonly onDidChangeInstructionBreakpoints: import("@theia/core/lib/common").Event<InstructionBreakpointsChangeEvent>;
    setMarkers(uri: URI, owner: string, newMarkers: SourceBreakpoint[]): Marker<SourceBreakpoint>[];
    getLineBreakpoints(uri: URI, line: number): SourceBreakpoint[];
    getInlineBreakpoint(uri: URI, line: number, column: number): SourceBreakpoint | undefined;
    getBreakpoints(uri?: URI): SourceBreakpoint[];
    setBreakpoints(uri: URI, breakpoints: SourceBreakpoint[]): void;
    addBreakpoint(breakpoint: SourceBreakpoint): boolean;
    enableAllBreakpoints(enabled: boolean): void;
    protected _breakpointsEnabled: boolean;
    get breakpointsEnabled(): boolean;
    set breakpointsEnabled(breakpointsEnabled: boolean);
    protected readonly exceptionBreakpoints: Map<string, ExceptionBreakpoint>;
    getExceptionBreakpoint(filter: string): ExceptionBreakpoint | undefined;
    getExceptionBreakpoints(): IterableIterator<ExceptionBreakpoint>;
    setExceptionBreakpoints(exceptionBreakpoints: ExceptionBreakpoint[]): void;
    toggleExceptionBreakpoint(filter: string): void;
    updateExceptionBreakpoint(filter: string, options: Partial<Pick<ExceptionBreakpoint, 'condition' | 'enabled'>>): void;
    protected functionBreakpoints: FunctionBreakpoint[];
    getFunctionBreakpoints(): FunctionBreakpoint[];
    setFunctionBreakpoints(functionBreakpoints: FunctionBreakpoint[]): void;
    protected instructionBreakpoints: InstructionBreakpoint[];
    getInstructionBreakpoints(): ReadonlyArray<InstructionBreakpoint>;
    hasBreakpoints(): boolean;
    protected setInstructionBreakpoints(newBreakpoints: InstructionBreakpoint[]): void;
    addInstructionBreakpoint(address: string, offset: number, condition?: string, hitCondition?: string): void;
    updateInstructionBreakpoint(id: string, options: Partial<Pick<InstructionBreakpoint, 'condition' | 'hitCondition' | 'enabled'>>): void;
    removeInstructionBreakpoint(address?: string): void;
    clearInstructionBreakpoints(): void;
    removeBreakpoints(): void;
    load(): Promise<void>;
    save(): void;
}
export declare namespace BreakpointManager {
    interface Data {
        breakpointsEnabled: boolean;
        breakpoints: {
            [uri: string]: SourceBreakpoint[];
        };
        exceptionBreakpoints?: ExceptionBreakpoint[];
        functionBreakpoints?: FunctionBreakpoint[];
        instructionBreakpoints?: InstructionBreakpoint[];
    }
}
//# sourceMappingURL=breakpoint-manager.d.ts.map