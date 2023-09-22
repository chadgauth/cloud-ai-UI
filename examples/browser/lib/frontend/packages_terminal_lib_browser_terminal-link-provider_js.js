"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_terminal_lib_browser_terminal-link-provider_js"],{

/***/ "../../packages/terminal/lib/browser/terminal-link-helpers.js":
/*!********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-link-helpers.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertLinkRangeToBuffer = exports.getLinkContext = exports.LinkContext = void 0;
exports.LinkContext = Symbol('LinkContext');
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation and others. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/
function getLinkContext(terminal, line, maxLinkLength = 2000) {
    var _a, _b;
    // The following method is based on VS Code's TerminalLinkDetectorAdapter._provideLinks()
    // https://github.com/microsoft/vscode/blob/7888ff3a6b104e9e2e3d0f7890ca92dd0828215f/src/vs/workbench/contrib/terminal/browser/links/terminalLinkDetectorAdapter.ts#L51
    let startLine = line - 1;
    let endLine = startLine;
    const lines = [terminal.buffer.active.getLine(startLine)];
    // Cap the maximum context on either side of the line being provided, by taking the context
    // around the line being provided for this ensures the line the pointer is on will have
    // links provided.
    const maxLineContext = Math.max(maxLinkLength / terminal.cols);
    const minStartLine = Math.max(startLine - maxLineContext, 0);
    const maxEndLine = Math.min(endLine + maxLineContext, terminal.buffer.active.length);
    while (startLine >= minStartLine && ((_a = terminal.buffer.active.getLine(startLine)) === null || _a === void 0 ? void 0 : _a.isWrapped)) {
        lines.unshift(terminal.buffer.active.getLine(startLine - 1));
        startLine--;
    }
    while (endLine < maxEndLine && ((_b = terminal.buffer.active.getLine(endLine + 1)) === null || _b === void 0 ? void 0 : _b.isWrapped)) {
        lines.push(terminal.buffer.active.getLine(endLine + 1));
        endLine++;
    }
    const text = getXtermLineContent(terminal.buffer.active, startLine, endLine, terminal.cols);
    return { text, startLine, lines };
}
exports.getLinkContext = getLinkContext;
// The following code is taken as is from
// https://github.com/microsoft/vscode/blob/7888ff3a6b104e9e2e3d0f7890ca92dd0828215f/src/vs/workbench/contrib/terminal/browser/links/terminalLinkHelpers.ts#L1
/**
 * Converts a possibly wrapped link's range (comprised of string indices) into a buffer range that plays nicely with xterm.js
 *
 * @param lines A single line (not the entire buffer)
 * @param bufferWidth The number of columns in the terminal
 * @param range The link range - string indices
 * @param startLine The absolute y position (on the buffer) of the line
 */
function convertLinkRangeToBuffer(lines, bufferWidth, range, startLine) {
    const bufferRange = {
        start: {
            x: range.startColumn,
            y: range.startLineNumber + startLine
        },
        end: {
            x: range.endColumn - 1,
            y: range.endLineNumber + startLine
        }
    };
    // Shift start range right for each wide character before the link
    let startOffset = 0;
    const startWrappedLineCount = Math.ceil(range.startColumn / bufferWidth);
    for (let y = 0; y < Math.min(startWrappedLineCount); y++) {
        const lineLength = Math.min(bufferWidth, range.startColumn - y * bufferWidth);
        let lineOffset = 0;
        const line = lines[y];
        // Sanity check for line, apparently this can happen but it's not clear under what
        // circumstances this happens. Continue on, skipping the remainder of start offset if this
        // happens to minimize impact.
        if (!line) {
            break;
        }
        for (let x = 0; x < Math.min(bufferWidth, lineLength + lineOffset); x++) {
            const cell = line.getCell(x);
            const width = cell.getWidth();
            if (width === 2) {
                lineOffset++;
            }
            const char = cell.getChars();
            if (char.length > 1) {
                lineOffset -= char.length - 1;
            }
        }
        startOffset += lineOffset;
    }
    // Shift end range right for each wide character inside the link
    let endOffset = 0;
    const endWrappedLineCount = Math.ceil(range.endColumn / bufferWidth);
    for (let y = Math.max(0, startWrappedLineCount - 1); y < endWrappedLineCount; y++) {
        const start = (y === startWrappedLineCount - 1 ? (range.startColumn + startOffset) % bufferWidth : 0);
        const lineLength = Math.min(bufferWidth, range.endColumn + startOffset - y * bufferWidth);
        const startLineOffset = (y === startWrappedLineCount - 1 ? startOffset : 0);
        let lineOffset = 0;
        const line = lines[y];
        // Sanity check for line, apparently this can happen but it's not clear under what
        // circumstances this happens. Continue on, skipping the remainder of start offset if this
        // happens to minimize impact.
        if (!line) {
            break;
        }
        for (let x = start; x < Math.min(bufferWidth, lineLength + lineOffset + startLineOffset); x++) {
            const cell = line.getCell(x);
            const width = cell.getWidth();
            // Offset for 0 cells following wide characters
            if (width === 2) {
                lineOffset++;
            }
            // Offset for early wrapping when the last cell in row is a wide character
            if (x === bufferWidth - 1 && cell.getChars() === '') {
                lineOffset++;
            }
        }
        endOffset += lineOffset;
    }
    // Apply the width character offsets to the result
    bufferRange.start.x += startOffset;
    bufferRange.end.x += startOffset + endOffset;
    // Convert back to wrapped lines
    while (bufferRange.start.x > bufferWidth) {
        bufferRange.start.x -= bufferWidth;
        bufferRange.start.y++;
    }
    while (bufferRange.end.x > bufferWidth) {
        bufferRange.end.x -= bufferWidth;
        bufferRange.end.y++;
    }
    return bufferRange;
}
exports.convertLinkRangeToBuffer = convertLinkRangeToBuffer;
function getXtermLineContent(buffer, lineStart, lineEnd, cols) {
    // Cap the maximum number of lines generated to prevent potential performance problems. This is
    // more of a sanity check as the wrapped line should already be trimmed down at this point.
    const maxLineLength = Math.max(2048 / cols * 2);
    lineEnd = Math.min(lineEnd, lineStart + maxLineLength);
    let content = '';
    for (let i = lineStart; i <= lineEnd; i++) {
        // Make sure only 0 to cols are considered as resizing when windows mode is enabled will
        // retain buffer data outside of the terminal width as reflow is disabled.
        const line = buffer.getLine(i);
        if (line) {
            content += line.translateToString(true, 0, cols);
        }
    }
    return content;
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-link-helpers'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-link-provider.js":
/*!*********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-link-provider.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XtermLinkAdapter = exports.TerminalLinkProviderContribution = exports.createXtermLinkFactory = exports.XtermLinkFactory = exports.XtermLink = exports.TerminalLink = exports.TerminalLinkProvider = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const terminal_link_helpers_1 = __webpack_require__(/*! ./terminal-link-helpers */ "../../packages/terminal/lib/browser/terminal-link-helpers.js");
const terminal_widget_impl_1 = __webpack_require__(/*! ./terminal-widget-impl */ "../../packages/terminal/lib/browser/terminal-widget-impl.js");
exports.TerminalLinkProvider = Symbol('TerminalLinkProvider');
exports.TerminalLink = Symbol('TerminalLink');
exports.XtermLink = Symbol('XtermLink');
exports.XtermLinkFactory = Symbol('XtermLinkFactory');
function createXtermLinkFactory(ctx) {
    return (link, terminal, context) => {
        const container = ctx.container.createChild();
        container.bind(exports.TerminalLink).toConstantValue(link);
        container.bind(terminal_widget_impl_1.TerminalWidgetImpl).toConstantValue(terminal);
        container.bind(terminal_link_helpers_1.LinkContext).toConstantValue(context);
        container.bind(XtermLinkAdapter).toSelf().inSingletonScope();
        container.bind(exports.XtermLink).toService(XtermLinkAdapter);
        const provider = container.get(exports.XtermLink);
        return provider;
    };
}
exports.createXtermLinkFactory = createXtermLinkFactory;
let TerminalLinkProviderContribution = class TerminalLinkProviderContribution {
    onCreate(terminalWidget) {
        terminalWidget.getTerminal().registerLinkProvider({
            provideLinks: (line, provideLinks) => this.provideTerminalLinks(terminalWidget, line, provideLinks)
        });
    }
    async provideTerminalLinks(terminal, line, provideLinks) {
        const context = (0, terminal_link_helpers_1.getLinkContext)(terminal.getTerminal(), line);
        const linkProviderPromises = [];
        for (const provider of this.terminalLinkContributionProvider.getContributions()) {
            linkProviderPromises.push(provider.provideLinks(context.text, terminal));
        }
        const xtermLinks = [];
        for (const providerResult of await Promise.allSettled(linkProviderPromises)) {
            if (providerResult.status === 'fulfilled') {
                const providedLinks = providerResult.value;
                xtermLinks.push(...providedLinks.map(link => this.xtermLinkFactory(link, terminal, context)));
            }
            else {
                console.warn('Terminal link provider failed to provide links', providerResult.reason);
            }
        }
        provideLinks(xtermLinks);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(exports.TerminalLinkProvider),
    __metadata("design:type", Object)
], TerminalLinkProviderContribution.prototype, "terminalLinkContributionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(exports.XtermLinkFactory),
    __metadata("design:type", Function)
], TerminalLinkProviderContribution.prototype, "xtermLinkFactory", void 0);
TerminalLinkProviderContribution = __decorate([
    (0, inversify_1.injectable)()
], TerminalLinkProviderContribution);
exports.TerminalLinkProviderContribution = TerminalLinkProviderContribution;
const DELAY_PREFERENCE = 'workbench.hover.delay';
let XtermLinkAdapter = class XtermLinkAdapter {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
        this.mouseEnteredHover = false;
        this.mouseLeftHover = false;
    }
    initializeLinkFields() {
        const range = {
            startColumn: this.link.startIndex + 1,
            startLineNumber: 1,
            endColumn: this.link.startIndex + this.link.length + 1,
            endLineNumber: 1
        };
        const terminal = this.terminalWidget.getTerminal();
        this.range = (0, terminal_link_helpers_1.convertLinkRangeToBuffer)(this.context.lines, terminal.cols, range, this.context.startLine);
        this.text = this.context.text.substring(this.link.startIndex, this.link.startIndex + this.link.length) || '';
    }
    hover(event, text) {
        this.scheduleHover(event);
    }
    scheduleHover(event) {
        var _a;
        this.cancelHover();
        const delay = (_a = this.preferences.get(DELAY_PREFERENCE)) !== null && _a !== void 0 ? _a : 500;
        this.toDispose.push((0, core_1.disposableTimeout)(() => this.showHover(event), delay));
    }
    showHover(event) {
        this.toDispose.push(this.terminalWidget.onMouseEnterLinkHover(() => this.mouseEnteredHover = true));
        this.toDispose.push(this.terminalWidget.onMouseLeaveLinkHover(mouseEvent => {
            this.mouseLeftHover = true;
            this.leave(mouseEvent);
        }));
        this.terminalWidget.showLinkHover(() => this.executeLinkHandler(), event.clientX, event.clientY, this.link.tooltip);
    }
    leave(event) {
        this.toDispose.push((0, core_1.disposableTimeout)(() => {
            if (!this.mouseEnteredHover || this.mouseLeftHover) {
                this.cancelHover();
            }
        }, 50));
    }
    cancelHover() {
        this.mouseEnteredHover = false;
        this.mouseLeftHover = false;
        this.toDispose.dispose();
        this.terminalWidget.hideLinkHover();
    }
    activate(event, text) {
        event.preventDefault();
        if (this.isModifierKeyDown(event) || this.wasTouchEvent(event, this.terminalWidget.lastTouchEndEvent)) {
            this.executeLinkHandler();
        }
        else {
            this.terminalWidget.getTerminal().focus();
        }
    }
    executeLinkHandler() {
        this.link.handle();
        this.cancelHover();
    }
    isModifierKeyDown(event) {
        return core_1.isOSX ? event.metaKey : event.ctrlKey;
    }
    wasTouchEvent(event, lastTouchEnd) {
        if (!lastTouchEnd) {
            return false;
        }
        if ((event.timeStamp - lastTouchEnd.timeStamp) > 400) {
            // A 'touchend' event typically precedes a matching 'click' event by 50ms.
            return false;
        }
        if (Math.abs(event.pageX - lastTouchEnd.pageX) > 5) {
            // Matching 'touchend' and 'click' events typically have the same page coordinates,
            // plus or minus 1 pixel.
            return false;
        }
        if (Math.abs(event.pageY - lastTouchEnd.pageY) > 5) {
            return false;
        }
        // We have a match! This link was tapped.
        return true;
    }
};
__decorate([
    (0, inversify_1.inject)(exports.TerminalLink),
    __metadata("design:type", Object)
], XtermLinkAdapter.prototype, "link", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_widget_impl_1.TerminalWidgetImpl),
    __metadata("design:type", terminal_widget_impl_1.TerminalWidgetImpl)
], XtermLinkAdapter.prototype, "terminalWidget", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_link_helpers_1.LinkContext),
    __metadata("design:type", Object)
], XtermLinkAdapter.prototype, "context", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], XtermLinkAdapter.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], XtermLinkAdapter.prototype, "initializeLinkFields", null);
XtermLinkAdapter = __decorate([
    (0, inversify_1.injectable)()
], XtermLinkAdapter);
exports.XtermLinkAdapter = XtermLinkAdapter;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-link-provider'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_terminal_lib_browser_terminal-link-provider_js.js.map