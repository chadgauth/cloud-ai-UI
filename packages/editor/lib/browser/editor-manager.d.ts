import URI from '@theia/core/lib/common/uri';
import { RecursivePartial, Emitter, Event, MaybePromise, CommandService } from '@theia/core/lib/common';
import { WidgetOpenerOptions, NavigatableWidgetOpenHandler, NavigatableWidgetOptions, PreferenceService } from '@theia/core/lib/browser';
import { EditorWidget } from './editor-widget';
import { Range, Position, Location, TextEditor } from './editor';
export interface WidgetId {
    id: number;
    uri: string;
}
export interface EditorOpenerOptions extends WidgetOpenerOptions {
    selection?: RecursivePartial<Range>;
    preview?: boolean;
    counter?: number;
}
export declare class EditorManager extends NavigatableWidgetOpenHandler<EditorWidget> {
    readonly id: string;
    readonly label = "Code Editor";
    protected readonly editorCounters: Map<string, number>;
    protected readonly onActiveEditorChangedEmitter: Emitter<EditorWidget | undefined>;
    /**
     * Emit when the active editor is changed.
     */
    readonly onActiveEditorChanged: Event<EditorWidget | undefined>;
    protected readonly onCurrentEditorChangedEmitter: Emitter<EditorWidget | undefined>;
    /**
     * Emit when the current editor is changed.
     */
    readonly onCurrentEditorChanged: Event<EditorWidget | undefined>;
    protected readonly commands: CommandService;
    protected readonly preferenceService: PreferenceService;
    protected init(): void;
    getByUri(uri: URI, options?: EditorOpenerOptions): Promise<EditorWidget | undefined>;
    getOrCreateByUri(uri: URI, options?: EditorOpenerOptions): Promise<EditorWidget>;
    protected tryGetPendingWidget(uri: URI, options?: EditorOpenerOptions): MaybePromise<EditorWidget> | undefined;
    protected getWidget(uri: URI, options?: EditorOpenerOptions): Promise<EditorWidget | undefined>;
    protected getOrCreateWidget(uri: URI, options?: EditorOpenerOptions): Promise<EditorWidget>;
    protected readonly recentlyVisibleIds: string[];
    protected get recentlyVisible(): EditorWidget | undefined;
    protected addRecentlyVisible(widget: EditorWidget): void;
    protected removeRecentlyVisible(widget: EditorWidget): void;
    protected _activeEditor: EditorWidget | undefined;
    /**
     * The active editor.
     * If there is an active editor (one that has focus), active and current are the same.
     */
    get activeEditor(): EditorWidget | undefined;
    protected setActiveEditor(active: EditorWidget | undefined): void;
    protected updateActiveEditor(): void;
    protected _currentEditor: EditorWidget | undefined;
    /**
     * The most recently activated editor (which might not have the focus anymore, hence it is not active).
     * If no editor has focus, e.g. when a context menu is shown, the active editor is `undefined`, but current might be the editor that was active before the menu popped up.
     */
    get currentEditor(): EditorWidget | undefined;
    protected setCurrentEditor(current: EditorWidget | undefined): void;
    protected updateCurrentEditor(): void;
    canHandle(uri: URI, options?: WidgetOpenerOptions): number;
    open(uri: URI, options?: EditorOpenerOptions): Promise<EditorWidget>;
    /**
     * Opens an editor to the side of the current editor. Defaults to opening to the right.
     * To modify direction, pass options with `{widgetOptions: {mode: ...}}`
     */
    openToSide(uri: URI, options?: EditorOpenerOptions): Promise<EditorWidget>;
    protected revealSelection(widget: EditorWidget, input?: EditorOpenerOptions, uri?: URI): void;
    protected getSelection(widget: EditorWidget, selection: RecursivePartial<Range>): Range | Position | undefined;
    protected removeFromCounter(widget: EditorWidget): void;
    protected extractIdFromWidget(widget: EditorWidget): WidgetId;
    protected checkCounterForWidget(widget: EditorWidget): void;
    protected createCounterForUri(uri: URI): number;
    protected getCounterForUri(uri: URI): number | undefined;
    protected getOrCreateCounterForUri(uri: URI): number;
    protected createWidgetOptions(uri: URI, options?: EditorOpenerOptions): NavigatableWidgetOptions;
}
/**
 * Provides direct access to the underlying text editor.
 */
export declare abstract class EditorAccess {
    protected readonly editorManager: EditorManager;
    /**
     * The URI of the underlying document from the editor.
     */
    get uri(): string | undefined;
    /**
     * The selection location from the text editor.
     */
    get selection(): Location | undefined;
    /**
     * The unique identifier of the language the current editor belongs to.
     */
    get languageId(): string | undefined;
    /**
     * The text editor.
     */
    get editor(): TextEditor | undefined;
    /**
     * The editor widget, or `undefined` if not applicable.
     */
    protected abstract editorWidget(): EditorWidget | undefined;
}
/**
 * Provides direct access to the currently active text editor.
 */
export declare class CurrentEditorAccess extends EditorAccess {
    protected editorWidget(): EditorWidget | undefined;
}
/**
 * Provides access to the active text editor.
 */
export declare class ActiveEditorAccess extends EditorAccess {
    protected editorWidget(): EditorWidget | undefined;
}
export declare namespace EditorAccess {
    const CURRENT = "current-editor-access";
    const ACTIVE = "active-editor-access";
}
//# sourceMappingURL=editor-manager.d.ts.map