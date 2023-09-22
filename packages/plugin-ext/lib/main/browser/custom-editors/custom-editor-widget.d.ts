import URI from '@theia/core/lib/common/uri';
import { ApplicationShell, NavigatableWidget, Saveable, SaveableSource, SaveOptions } from '@theia/core/lib/browser';
import { SaveResourceService } from '@theia/core/lib/browser/save-resource-service';
import { Reference } from '@theia/core/lib/common/reference';
import { WebviewWidget } from '../webview/webview';
import { UndoRedoService } from '@theia/editor/lib/browser/undo-redo-service';
import { CustomEditorModel } from './custom-editors-main';
export declare class CustomEditorWidget extends WebviewWidget implements SaveableSource, NavigatableWidget {
    static FACTORY_ID: string;
    id: string;
    resource: URI;
    protected _modelRef: Reference<CustomEditorModel>;
    get modelRef(): Reference<CustomEditorModel>;
    set modelRef(modelRef: Reference<CustomEditorModel>);
    get saveable(): Saveable;
    protected readonly undoRedoService: UndoRedoService;
    protected readonly shell: ApplicationShell;
    protected readonly saveService: SaveResourceService;
    protected init(): void;
    undo(): void;
    redo(): void;
    save(options?: SaveOptions): Promise<void>;
    saveAs(source: URI, target: URI, options?: SaveOptions): Promise<void>;
    getResourceUri(): URI | undefined;
    createMoveToUri(resourceUri: URI): URI | undefined;
    storeState(): CustomEditorWidget.State;
    restoreState(oldState: CustomEditorWidget.State): void;
    onMove(handler: (newResource: URI) => Promise<void>): void;
    private _moveHandler?;
    private doMove;
}
export declare namespace CustomEditorWidget {
    interface State extends WebviewWidget.State {
        strResource: string;
    }
}
//# sourceMappingURL=custom-editor-widget.d.ts.map