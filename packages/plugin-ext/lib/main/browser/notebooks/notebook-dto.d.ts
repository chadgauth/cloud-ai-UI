import * as notebookCommon from '@theia/notebook/lib/common';
import { NotebookCellModel } from '@theia/notebook/lib/browser/view-model/notebook-cell-model';
import * as rpc from '../../../common';
export declare namespace NotebookDto {
    function toNotebookOutputItemDto(item: notebookCommon.CellOutputItem): rpc.NotebookOutputItemDto;
    function toNotebookOutputDto(output: notebookCommon.CellOutput): rpc.NotebookOutputDto;
    function toNotebookCellDataDto(cell: notebookCommon.CellData): rpc.NotebookCellDataDto;
    function toNotebookDataDto(data: notebookCommon.NotebookData): rpc.NotebookDataDto;
    function fromNotebookOutputItemDto(item: rpc.NotebookOutputItemDto): notebookCommon.CellOutputItem;
    function fromNotebookOutputDto(output: rpc.NotebookOutputDto): notebookCommon.CellOutput;
    function fromNotebookCellDataDto(cell: rpc.NotebookCellDataDto): notebookCommon.CellData;
    function fromNotebookDataDto(data: rpc.NotebookDataDto): notebookCommon.NotebookData;
    function toNotebookCellDto(cell: NotebookCellModel): rpc.NotebookCellDto;
}
//# sourceMappingURL=notebook-dto.d.ts.map