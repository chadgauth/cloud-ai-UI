import { Disposable } from '@theia/core';
import { CellOutput, CellOutputItem } from '../../common';
export declare class NotebookCellOutputModel implements Disposable {
    private rawOutput;
    private didChangeDataEmitter;
    readonly onDidChangeData: import("@theia/core").Event<void>;
    private requestOutputPresentationChangeEmitter;
    readonly onRequestOutputPresentationChange: import("@theia/core").Event<void>;
    get outputId(): string;
    get outputs(): CellOutputItem[];
    get metadata(): Record<string, unknown> | undefined;
    constructor(rawOutput: CellOutput);
    replaceData(rawData: CellOutput): void;
    appendData(items: CellOutputItem[]): void;
    dispose(): void;
    requestOutputPresentationUpdate(): void;
    getData(): CellOutput;
}
//# sourceMappingURL=notebook-cell-output-model.d.ts.map