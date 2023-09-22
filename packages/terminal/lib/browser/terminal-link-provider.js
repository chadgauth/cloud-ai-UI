"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XtermLinkAdapter = exports.TerminalLinkProviderContribution = exports.createXtermLinkFactory = exports.XtermLinkFactory = exports.XtermLink = exports.TerminalLink = exports.TerminalLinkProvider = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const terminal_link_helpers_1 = require("./terminal-link-helpers");
const terminal_widget_impl_1 = require("./terminal-widget-impl");
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
//# sourceMappingURL=terminal-link-provider.js.map