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
exports.NotebookCellOutputModel = void 0;
const core_1 = require("@theia/core");
class NotebookCellOutputModel {
    constructor(rawOutput) {
        this.rawOutput = rawOutput;
        this.didChangeDataEmitter = new core_1.Emitter();
        this.onDidChangeData = this.didChangeDataEmitter.event;
        this.requestOutputPresentationChangeEmitter = new core_1.Emitter();
        this.onRequestOutputPresentationChange = this.requestOutputPresentationChangeEmitter.event;
    }
    get outputId() {
        return this.rawOutput.outputId;
    }
    get outputs() {
        return this.rawOutput.outputs || [];
    }
    get metadata() {
        return this.rawOutput.metadata;
    }
    replaceData(rawData) {
        this.rawOutput = rawData;
        this.didChangeDataEmitter.fire();
    }
    appendData(items) {
        this.rawOutput.outputs.push(...items);
        this.didChangeDataEmitter.fire();
    }
    dispose() {
        this.didChangeDataEmitter.dispose();
        this.requestOutputPresentationChangeEmitter.dispose();
    }
    requestOutputPresentationUpdate() {
        this.requestOutputPresentationChangeEmitter.fire();
    }
    getData() {
        return {
            outputs: this.outputs,
            metadata: this.metadata,
            outputId: this.outputId
        };
    }
}
exports.NotebookCellOutputModel = NotebookCellOutputModel;
//# sourceMappingURL=notebook-cell-output-model.js.map