import { Disposable, DisposableCollection, Event, Emitter } from '@theia/core/lib/common';
import URI from '@theia/core/lib/common/uri';
import { DebugSession, DebugState } from '../debug-session';
import { DebugSessionManager } from '../debug-session-manager';
import { DebugThread } from '../model/debug-thread';
import { DebugStackFrame } from '../model/debug-stack-frame';
import { DebugSourceBreakpoint } from '../model/debug-source-breakpoint';
import { DebugWatchExpression } from './debug-watch-expression';
import { DebugWatchManager } from '../debug-watch-manager';
import { DebugFunctionBreakpoint } from '../model/debug-function-breakpoint';
import { DebugInstructionBreakpoint } from '../model/debug-instruction-breakpoint';
export declare class DebugViewModel implements Disposable {
    protected readonly onDidChangeEmitter: Emitter<void>;
    readonly onDidChange: Event<void>;
    protected fireDidChange(): void;
    protected readonly onDidChangeBreakpointsEmitter: Emitter<URI>;
    readonly onDidChangeBreakpoints: Event<URI>;
    protected fireDidChangeBreakpoints(uri: URI): void;
    protected readonly _watchExpressions: Map<number, DebugWatchExpression>;
    protected readonly onDidChangeWatchExpressionsEmitter: Emitter<void>;
    readonly onDidChangeWatchExpressions: Event<void>;
    protected fireDidChangeWatchExpressions(): void;
    protected readonly toDispose: DisposableCollection;
    protected readonly manager: DebugSessionManager;
    protected readonly watch: DebugWatchManager;
    get sessions(): IterableIterator<DebugSession>;
    get sessionCount(): number;
    get session(): DebugSession | undefined;
    get id(): string;
    get label(): string;
    protected init(): void;
    dispose(): void;
    get currentSession(): DebugSession | undefined;
    set currentSession(currentSession: DebugSession | undefined);
    get state(): DebugState;
    get currentThread(): DebugThread | undefined;
    get currentFrame(): DebugStackFrame | undefined;
    get breakpoints(): DebugSourceBreakpoint[];
    get functionBreakpoints(): DebugFunctionBreakpoint[];
    get instructionBreakpoints(): DebugInstructionBreakpoint[];
    start(): Promise<void>;
    restart(): Promise<void>;
    terminate(): Promise<void>;
    get watchExpressions(): IterableIterator<DebugWatchExpression>;
    addWatchExpression(expression?: string): Promise<DebugWatchExpression | undefined>;
    removeWatchExpressions(): void;
    removeWatchExpression(expression: DebugWatchExpression): void;
    protected updateWatchExpressions(): void;
    protected refreshWatchExpressionsQueue: Promise<void>;
    protected refreshWatchExpressions: () => Promise<void>;
}
//# sourceMappingURL=debug-view-model.d.ts.map