import { URI, MaybePromise } from '@theia/core';
import { NavigatableWidgetOpenHandler, WidgetOpenerOptions } from '@theia/core/lib/browser';
import { NotebookFileSelector, NotebookTypeDescriptor } from '../common/notebook-protocol';
import { NotebookTypeRegistry } from './notebook-type-registry';
import { NotebookEditorWidget } from './notebook-editor-widget';
import { NotebookEditorWidgetOptions } from './notebook-editor-widget-factory';
export declare class NotebookOpenHandler extends NavigatableWidgetOpenHandler<NotebookEditorWidget> {
    private notebookTypeRegistry;
    id: string;
    constructor(notebookTypeRegistry: NotebookTypeRegistry);
    canHandle(uri: URI, options?: WidgetOpenerOptions | undefined): MaybePromise<number>;
    protected findHighestPriorityType(uri: URI): NotebookTypeDescriptor | undefined;
    protected calculatePriority(notebookType: NotebookTypeDescriptor | undefined): number;
    protected createWidgetOptions(uri: URI, options?: WidgetOpenerOptions | undefined): NotebookEditorWidgetOptions;
    matches(selectors: readonly NotebookFileSelector[], resource: URI): boolean;
    selectorMatches(selector: NotebookFileSelector, resource: URI): boolean;
}
//# sourceMappingURL=notebook-open-handler.d.ts.map