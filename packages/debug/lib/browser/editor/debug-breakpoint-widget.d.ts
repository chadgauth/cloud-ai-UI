import { Root } from '@theia/core/shared/react-dom/client';
import { DebugProtocol } from '@vscode/debugprotocol';
import { Disposable, DisposableCollection } from '@theia/core';
import { MonacoEditorProvider } from '@theia/monaco/lib/browser/monaco-editor-provider';
import { MonacoEditorZoneWidget } from '@theia/monaco/lib/browser/monaco-editor-zone-widget';
import { MonacoEditor } from '@theia/monaco/lib/browser/monaco-editor';
import { DebugEditor } from './debug-editor';
import { DebugSourceBreakpoint } from '../model/debug-source-breakpoint';
import { Dimension } from '@theia/editor/lib/browser';
import * as monaco from '@theia/monaco-editor-core';
import { SelectOption } from '@theia/core/lib/browser/widgets/select-component';
export declare type ShowDebugBreakpointOptions = DebugSourceBreakpoint | {
    position: monaco.Position;
    context: DebugBreakpointWidget.Context;
} | {
    breakpoint: DebugSourceBreakpoint;
    context: DebugBreakpointWidget.Context;
};
export declare class DebugBreakpointWidget implements Disposable {
    readonly editor: DebugEditor;
    protected readonly editorProvider: MonacoEditorProvider;
    protected selectNode: HTMLDivElement;
    protected selectNodeRoot: Root;
    protected zone: MonacoEditorZoneWidget;
    protected readonly toDispose: DisposableCollection;
    protected context: DebugBreakpointWidget.Context;
    protected _values: {
        [context in DebugBreakpointWidget.Context]?: string;
    };
    get values(): {
        [context in DebugBreakpointWidget.Context]?: string;
    } | undefined;
    protected _input: MonacoEditor | undefined;
    get input(): MonacoEditor | undefined;
    set inputSize(dimension: Dimension | null);
    private readonly selectComponentRef;
    protected init(): void;
    protected doInit(): Promise<void>;
    dispose(): void;
    get position(): monaco.Position | undefined;
    show(options: ShowDebugBreakpointOptions): void;
    hide(): void;
    protected layout(dimension: monaco.editor.IDimension): void;
    protected createInput(node: HTMLElement): Promise<MonacoEditor>;
    protected render(): void;
    protected readonly updateInput: (option: SelectOption) => void;
    static PLACEHOLDER_DECORATION: string;
    protected updatePlaceholder(): void;
    protected get placeholder(): string;
}
export declare namespace DebugBreakpointWidget {
    type Context = keyof Pick<DebugProtocol.SourceBreakpoint, 'condition' | 'hitCondition' | 'logMessage'>;
}
//# sourceMappingURL=debug-breakpoint-widget.d.ts.map