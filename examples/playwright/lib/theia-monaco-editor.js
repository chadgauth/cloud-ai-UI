"use strict";
// *****************************************************************************
// Copyright (C) 2023 EclipseSource and others.
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
exports.TheiaMonacoEditor = void 0;
const theia_page_object_1 = require("./theia-page-object");
class TheiaMonacoEditor extends theia_page_object_1.TheiaPageObject {
    constructor(selector, app) {
        super(app);
        this.selector = selector;
    }
    async waitForVisible() {
        await this.page.waitForSelector(this.selector, { state: 'visible' });
    }
    viewElement() {
        return this.page.$(this.selector);
    }
    async numberOfLines() {
        await this.waitForVisible();
        const viewElement = await this.viewElement();
        const lineElements = await (viewElement === null || viewElement === void 0 ? void 0 : viewElement.$$('.view-lines .view-line'));
        return lineElements === null || lineElements === void 0 ? void 0 : lineElements.length;
    }
    async textContentOfLineByLineNumber(lineNumber) {
        await this.waitForVisible();
        const lineElement = await this.lineByLineNumber(lineNumber);
        const content = await (lineElement === null || lineElement === void 0 ? void 0 : lineElement.textContent());
        return content ? this.replaceEditorSymbolsWithSpace(content) : undefined;
    }
    async lineByLineNumber(lineNumber) {
        await this.waitForVisible();
        const viewElement = await this.viewElement();
        const lines = await (viewElement === null || viewElement === void 0 ? void 0 : viewElement.$$('.view-lines > .view-line'));
        if (!lines) {
            throw new Error('Couldn\'t retrieve lines of monaco editor');
        }
        const linesWithXCoordinates = [];
        for (const lineElement of lines) {
            const box = await lineElement.boundingBox();
            linesWithXCoordinates.push({ x: box ? box.x : Number.MAX_VALUE, lineElement });
        }
        linesWithXCoordinates.sort((a, b) => a.x.toString().localeCompare(b.x.toString()));
        return linesWithXCoordinates[lineNumber - 1].lineElement;
    }
    async textContentOfLineContainingText(text) {
        await this.waitForVisible();
        const lineElement = await this.lineContainingText(text);
        const content = await (lineElement === null || lineElement === void 0 ? void 0 : lineElement.textContent());
        return content ? this.replaceEditorSymbolsWithSpace(content) : undefined;
    }
    async lineContainingText(text) {
        const viewElement = await this.viewElement();
        return viewElement === null || viewElement === void 0 ? void 0 : viewElement.waitForSelector(`.view-lines .view-line:has-text("${text}")`);
    }
    replaceEditorSymbolsWithSpace(content) {
        // [ ] &nbsp; => \u00a0 -- NO-BREAK SPACE
        // [·] &middot; => \u00b7 -- MIDDLE DOT
        // [] &zwnj; => \u200c -- ZERO WIDTH NON-JOINER
        return content.replace(/[\u00a0\u00b7]/g, ' ').replace(/[\u200c]/g, '');
    }
}
exports.TheiaMonacoEditor = TheiaMonacoEditor;
//# sourceMappingURL=theia-monaco-editor.js.map