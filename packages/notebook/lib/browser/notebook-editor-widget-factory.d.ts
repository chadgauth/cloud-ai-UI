import { WidgetFactory, NavigatableWidgetOptions, LabelProvider } from '@theia/core/lib/browser';
import { NotebookEditorWidget, NotebookEditorProps } from './notebook-editor-widget';
import { NotebookService } from './service/notebook-service';
import { NotebookModelResolverService } from './service/notebook-model-resolver-service';
export interface NotebookEditorWidgetOptions extends NavigatableWidgetOptions {
    notebookType: string;
}
export declare class NotebookEditorWidgetFactory implements WidgetFactory {
    readonly id: string;
    protected readonly notebookService: NotebookService;
    protected readonly notebookModelResolver: NotebookModelResolverService;
    protected readonly labelProvider: LabelProvider;
    protected readonly createNotebookEditorWidget: (props: NotebookEditorProps) => NotebookEditorWidget;
    createWidget(options?: NotebookEditorWidgetOptions): Promise<NotebookEditorWidget>;
    private createEditor;
}
//# sourceMappingURL=notebook-editor-widget-factory.d.ts.map