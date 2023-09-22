"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookDto = void 0;
const core_1 = require("@theia/core");
var NotebookDto;
(function (NotebookDto) {
    function toNotebookOutputItemDto(item) {
        return {
            mime: item.mime,
            valueBytes: item.data
        };
    }
    NotebookDto.toNotebookOutputItemDto = toNotebookOutputItemDto;
    function toNotebookOutputDto(output) {
        return {
            outputId: output.outputId,
            metadata: output.metadata,
            items: output.outputs.map(toNotebookOutputItemDto)
        };
    }
    NotebookDto.toNotebookOutputDto = toNotebookOutputDto;
    function toNotebookCellDataDto(cell) {
        return {
            cellKind: cell.cellKind,
            language: cell.language,
            source: cell.source,
            internalMetadata: cell.internalMetadata,
            metadata: cell.metadata,
            outputs: cell.outputs.map(toNotebookOutputDto)
        };
    }
    NotebookDto.toNotebookCellDataDto = toNotebookCellDataDto;
    function toNotebookDataDto(data) {
        return {
            metadata: data.metadata,
            cells: data.cells.map(toNotebookCellDataDto)
        };
    }
    NotebookDto.toNotebookDataDto = toNotebookDataDto;
    function fromNotebookOutputItemDto(item) {
        return {
            mime: item.mime,
            data: item.valueBytes
        };
    }
    NotebookDto.fromNotebookOutputItemDto = fromNotebookOutputItemDto;
    function fromNotebookOutputDto(output) {
        return {
            outputId: output.outputId,
            metadata: output.metadata,
            outputs: output.items.map(fromNotebookOutputItemDto)
        };
    }
    NotebookDto.fromNotebookOutputDto = fromNotebookOutputDto;
    function fromNotebookCellDataDto(cell) {
        return {
            cellKind: cell.cellKind,
            language: cell.language,
            source: cell.source,
            outputs: cell.outputs.map(fromNotebookOutputDto),
            metadata: cell.metadata,
            internalMetadata: cell.internalMetadata
        };
    }
    NotebookDto.fromNotebookCellDataDto = fromNotebookCellDataDto;
    function fromNotebookDataDto(data) {
        return {
            metadata: data.metadata,
            cells: data.cells.map(fromNotebookCellDataDto)
        };
    }
    NotebookDto.fromNotebookDataDto = fromNotebookDataDto;
    function toNotebookCellDto(cell) {
        const eol = core_1.OS.backend.isWindows ? '\r\n' : '\n';
        return {
            handle: cell.handle,
            uri: cell.uri.toComponents(),
            source: cell.textBuffer.split(eol),
            eol,
            language: cell.language,
            cellKind: cell.cellKind,
            outputs: cell.outputs.map(toNotebookOutputDto),
            metadata: cell.metadata,
            internalMetadata: cell.internalMetadata,
        };
    }
    NotebookDto.toNotebookCellDto = toNotebookCellDto;
    // export function fromCellExecuteUpdateDto(data: extHostProtocol.ICellExecuteUpdateDto): ICellExecuteUpdate {
    //     if (data.editType === CellExecutionUpdateType.Output) {
    //         return {
    //             editType: data.editType,
    //             cellHandle: data.cellHandle,
    //             append: data.append,
    //             outputs: data.outputs.map(fromNotebookOutputDto)
    //         };
    //     } else if (data.editType === CellExecutionUpdateType.OutputItems) {
    //         return {
    //             editType: data.editType,
    //             append: data.append,
    //             outputId: data.outputId,
    //             items: data.items.map(fromNotebookOutputItemDto)
    //         };
    //     } else {
    //         return data;
    //     }
    // }
    // export function fromCellExecuteCompleteDto(data: extHostProtocol.ICellExecutionCompleteDto): ICellExecutionComplete {
    //     return data;
    // }
    // export function fromCellEditOperationDto(edit: extHostProtocol.ICellEditOperationDto): notebookCommon.ICellEditOperation {
    //     if (edit.editType === notebookCommon.CellEditType.Replace) {
    //         return {
    //             editType: edit.editType,
    //             index: edit.index,
    //             count: edit.count,
    //             cells: edit.cells.map(fromNotebookCellDataDto)
    //         };
    //     } else {
    //         return edit;
    //     }
    // }
})(NotebookDto = exports.NotebookDto || (exports.NotebookDto = {}));
//# sourceMappingURL=notebook-dto.js.map