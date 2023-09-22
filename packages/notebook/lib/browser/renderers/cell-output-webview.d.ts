/// <reference types="react" />
import { Disposable } from '@theia/core';
import { NotebookCellModel } from '../view-model/notebook-cell-model';
export declare const CellOutputWebviewFactory: unique symbol;
export declare type CellOutputWebviewFactory = (cell: NotebookCellModel) => Promise<CellOutputWebview>;
export interface CellOutputWebview extends Disposable {
    readonly id: string;
    render(): React.JSX.Element;
    attachWebview(): void;
    isAttached(): boolean;
}
//# sourceMappingURL=cell-output-webview.d.ts.map