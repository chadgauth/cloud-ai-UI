"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var TerminalWidgetImpl_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalWidgetImpl = exports.TerminalContribution = exports.TERMINAL_WIDGET_FACTORY_ID = void 0;
const xterm_1 = require("xterm");
const xterm_addon_fit_1 = require("xterm-addon-fit");
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
const browser_2 = require("@theia/workspace/lib/browser");
const shell_terminal_protocol_1 = require("../common/shell-terminal-protocol");
const terminal_protocol_1 = require("../common/terminal-protocol");
const base_terminal_protocol_1 = require("../common/base-terminal-protocol");
const terminal_watcher_1 = require("../common/terminal-watcher");
const terminal_widget_1 = require("./base/terminal-widget");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const terminal_preferences_1 = require("./terminal-preferences");
const uri_1 = require("@theia/core/lib/common/uri");
const terminal_service_1 = require("./base/terminal-service");
const terminal_search_widget_1 = require("./search/terminal-search-widget");
const terminal_copy_on_selection_handler_1 = require("./terminal-copy-on-selection-handler");
const terminal_theme_service_1 = require("./terminal-theme-service");
const shell_command_builder_1 = require("@theia/process/lib/common/shell-command-builder");
const keys_1 = require("@theia/core/lib/browser/keys");
const nls_1 = require("@theia/core/lib/common/nls");
const terminal_frontend_contribution_1 = require("./terminal-frontend-contribution");
const debounce = require("p-debounce");
const markdown_string_1 = require("@theia/core/lib/common/markdown-rendering/markdown-string");
const markdown_renderer_1 = require("@theia/core/lib/browser/markdown-rendering/markdown-renderer");
exports.TERMINAL_WIDGET_FACTORY_ID = 'terminal';
exports.TerminalContribution = Symbol('TerminalContribution');
let TerminalWidgetImpl = TerminalWidgetImpl_1 = class TerminalWidgetImpl extends terminal_widget_1.TerminalWidget {
    constructor() {
        super(...arguments);
        this.isExtractable = true;
        this.terminalKind = 'user';
        this._terminalId = -1;
        this.onTermDidClose = new core_1.Emitter();
        this.restored = false;
        this.closeOnDispose = true;
        this.isAttachedCloseListener = false;
        this.shown = false;
        this.lastCwd = new uri_1.default();
        this.onDidOpenEmitter = new core_1.Emitter();
        this.onDidOpen = this.onDidOpenEmitter.event;
        this.onDidOpenFailureEmitter = new core_1.Emitter();
        this.onDidOpenFailure = this.onDidOpenFailureEmitter.event;
        this.onSizeChangedEmitter = new core_1.Emitter();
        this.onSizeChanged = this.onSizeChangedEmitter.event;
        this.onDataEmitter = new core_1.Emitter();
        this.onData = this.onDataEmitter.event;
        this.onKeyEmitter = new core_1.Emitter();
        this.onKey = this.onKeyEmitter.event;
        this.onMouseEnterLinkHoverEmitter = new core_1.Emitter();
        this.onMouseEnterLinkHover = this.onMouseEnterLinkHoverEmitter.event;
        this.onMouseLeaveLinkHoverEmitter = new core_1.Emitter();
        this.onMouseLeaveLinkHover = this.onMouseLeaveLinkHoverEmitter.event;
        this.toDisposeOnConnect = new core_1.DisposableCollection();
        this.needsResize = true;
        // Device status code emitted by Xterm.js
        // Check: https://github.com/xtermjs/xterm.js/blob/release/3.14/src/InputHandler.ts#L1055-L1082
        this.deviceStatusCodes = new Set(['\u001B[>0;276;0c', '\u001B[>85;95;0c', '\u001B[>83;40003;0c', '\u001B[?1;2c', '\u001B[?6c']);
        this.termOpened = false;
        this.initialData = '';
        this.resizeTerminal = debounce(() => this.doResizeTerminal(), 50);
    }
    get markdownRenderer() {
        this._markdownRenderer || (this._markdownRenderer = this.markdownRendererFactory());
        return this._markdownRenderer;
    }
    init() {
        this.setTitle(this.options.title || TerminalWidgetImpl_1.LABEL);
        if (this.options.iconClass) {
            this.title.iconClass = this.options.iconClass;
        }
        else {
            this.title.iconClass = (0, browser_1.codicon)('terminal');
        }
        if (this.options.kind) {
            this.terminalKind = this.options.kind;
        }
        if (this.options.destroyTermOnClose === true) {
            this.toDispose.push(core_1.Disposable.create(() => this.term.dispose()));
        }
        this.location = this.options.location || terminal_widget_1.TerminalLocation.Panel;
        this.title.closable = true;
        this.addClass('terminal-container');
        this.term = new xterm_1.Terminal({
            cursorBlink: this.preferences['terminal.integrated.cursorBlinking'],
            cursorStyle: this.getCursorStyle(),
            cursorWidth: this.preferences['terminal.integrated.cursorWidth'],
            fontFamily: this.preferences['terminal.integrated.fontFamily'],
            fontSize: this.preferences['terminal.integrated.fontSize'],
            fontWeight: this.preferences['terminal.integrated.fontWeight'],
            fontWeightBold: this.preferences['terminal.integrated.fontWeightBold'],
            drawBoldTextInBrightColors: this.preferences['terminal.integrated.drawBoldTextInBrightColors'],
            letterSpacing: this.preferences['terminal.integrated.letterSpacing'],
            lineHeight: this.preferences['terminal.integrated.lineHeight'],
            scrollback: this.preferences['terminal.integrated.scrollback'],
            fastScrollSensitivity: this.preferences['terminal.integrated.fastScrollSensitivity'],
            rendererType: this.getTerminalRendererType(this.preferences['terminal.integrated.rendererType']),
            theme: this.themeService.theme
        });
        this.fitAddon = new xterm_addon_fit_1.FitAddon();
        this.term.loadAddon(this.fitAddon);
        this.initializeLinkHover();
        this.toDispose.push(this.preferences.onPreferenceChanged(change => {
            const lastSeparator = change.preferenceName.lastIndexOf('.');
            if (lastSeparator > 0) {
                let preferenceName = change.preferenceName.substring(lastSeparator + 1);
                let preferenceValue = change.newValue;
                if (preferenceName === 'rendererType') {
                    const newRendererType = preferenceValue;
                    if (newRendererType !== this.getTerminalRendererType(newRendererType)) {
                        // Given terminal renderer type is not supported or invalid
                        preferenceValue = terminal_preferences_1.DEFAULT_TERMINAL_RENDERER_TYPE;
                    }
                }
                else if (preferenceName === 'cursorBlinking') {
                    // Convert the terminal preference into a valid `xterm` option
                    preferenceName = 'cursorBlink';
                }
                else if (preferenceName === 'cursorStyle') {
                    preferenceValue = this.getCursorStyle();
                }
                try {
                    this.term.setOption(preferenceName, preferenceValue);
                }
                catch (e) {
                    console.debug(`xterm configuration: '${preferenceName}' with value '${preferenceValue}' is not valid.`);
                }
                this.needsResize = true;
                this.update();
            }
        }));
        this.toDispose.push(this.themeService.onDidChange(() => this.term.setOption('theme', this.themeService.theme)));
        this.attachCustomKeyEventHandler();
        const titleChangeListenerDispose = this.term.onTitleChange((title) => {
            if (this.options.useServerTitle) {
                this.title.label = title;
            }
        });
        this.toDispose.push(titleChangeListenerDispose);
        this.toDispose.push(this.terminalWatcher.onTerminalError(({ terminalId, error, attached }) => {
            if (terminalId === this.terminalId) {
                this.exitStatus = { code: undefined, reason: base_terminal_protocol_1.TerminalExitReason.Process };
                this.logger.error(`The terminal process terminated. Cause: ${error}`);
                if (!attached) {
                    this.dispose();
                }
            }
        }));
        this.toDispose.push(this.terminalWatcher.onTerminalExit(({ terminalId, code, reason, attached }) => {
            if (terminalId === this.terminalId) {
                if (reason) {
                    this.exitStatus = { code, reason };
                }
                else {
                    this.exitStatus = { code, reason: base_terminal_protocol_1.TerminalExitReason.Process };
                }
                if (!attached) {
                    this.dispose();
                }
            }
        }));
        this.toDispose.push(this.toDisposeOnConnect);
        this.toDispose.push(this.shellTerminalServer.onDidCloseConnection(() => {
            const disposable = this.shellTerminalServer.onDidOpenConnection(() => {
                disposable.dispose();
                this.reconnectTerminalProcess();
            });
            this.toDispose.push(disposable);
        }));
        this.toDispose.push(this.onTermDidClose);
        this.toDispose.push(this.onDidOpenEmitter);
        this.toDispose.push(this.onDidOpenFailureEmitter);
        this.toDispose.push(this.onSizeChangedEmitter);
        this.toDispose.push(this.onDataEmitter);
        this.toDispose.push(this.onKeyEmitter);
        const touchEndListener = (event) => {
            if (this.node.contains(event.target)) {
                this.lastTouchEnd = event;
            }
        };
        document.addEventListener('touchend', touchEndListener, { passive: true });
        this.onDispose(() => {
            document.removeEventListener('touchend', touchEndListener);
        });
        const mouseListener = (event) => {
            this.lastMousePosition = { x: event.x, y: event.y };
        };
        this.node.addEventListener('mousemove', mouseListener);
        this.onDispose(() => {
            this.node.removeEventListener('mousemove', mouseListener);
        });
        const contextMenuListener = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.contextMenuRenderer.render({ menuPath: terminal_frontend_contribution_1.TerminalMenus.TERMINAL_CONTEXT_MENU, anchor: event });
        };
        this.node.addEventListener('contextmenu', contextMenuListener);
        this.onDispose(() => this.node.removeEventListener('contextmenu', contextMenuListener));
        this.toDispose.push(this.term.onSelectionChange(() => {
            if (this.copyOnSelection) {
                this.copyOnSelectionHandler.copy(this.term.getSelection());
            }
        }));
        this.toDispose.push(this.term.onResize(data => {
            this.onSizeChangedEmitter.fire(data);
        }));
        this.toDispose.push(this.term.onData(data => {
            this.onDataEmitter.fire(data);
        }));
        this.toDispose.push(this.term.onBinary(data => {
            this.onDataEmitter.fire(data);
        }));
        this.toDispose.push(this.term.onKey(data => {
            this.onKeyEmitter.fire(data);
        }));
        for (const contribution of this.terminalContributionProvider.getContributions()) {
            contribution.onCreate(this);
        }
        this.searchBox = this.terminalSearchBoxFactory(this.term);
        this.toDispose.push(this.searchBox);
    }
    get kind() {
        return this.terminalKind;
    }
    /**
     * Get the cursor style compatible with `xterm`.
     * @returns CursorStyle
     */
    getCursorStyle() {
        const value = this.preferences['terminal.integrated.cursorStyle'];
        return value === 'line' ? 'bar' : value;
    }
    /**
     * Returns given renderer type if it is valid and supported or default renderer otherwise.
     *
     * @param terminalRendererType desired terminal renderer type
     */
    getTerminalRendererType(terminalRendererType) {
        if (terminalRendererType && (0, terminal_preferences_1.isTerminalRendererType)(terminalRendererType)) {
            return terminalRendererType;
        }
        return terminal_preferences_1.DEFAULT_TERMINAL_RENDERER_TYPE;
    }
    initializeLinkHover() {
        this.linkHover = document.createElement('div');
        this.linkHover.style.position = 'fixed';
        this.linkHover.style.color = 'var(--theia-editorHoverWidget-foreground)';
        this.linkHover.style.backgroundColor = 'var(--theia-editorHoverWidget-background)';
        this.linkHover.style.borderColor = 'var(--theia-editorHoverWidget-border)';
        this.linkHover.style.borderWidth = '0.5px';
        this.linkHover.style.borderStyle = 'solid';
        this.linkHover.style.padding = '5px';
        // Above the xterm.js canvas layers:
        // https://github.com/xtermjs/xterm.js/blob/ff790236c1b205469f17a21246141f512d844295/src/renderer/Renderer.ts#L41-L46
        this.linkHover.style.zIndex = '10';
        // Initially invisible:
        this.linkHover.style.display = 'none';
        this.linkHoverButton = document.createElement('a');
        this.linkHoverButton.textContent = this.linkHoverMessage();
        this.linkHoverButton.style.cursor = 'pointer';
        this.linkHover.appendChild(this.linkHoverButton);
        const cmdCtrl = common_1.isOSX ? 'cmd' : 'ctrl';
        const cmdHint = document.createTextNode(` (${nls_1.nls.localizeByDefault(`${cmdCtrl} + click`)})`);
        this.linkHover.appendChild(cmdHint);
        const onMouseEnter = (mouseEvent) => this.onMouseEnterLinkHoverEmitter.fire(mouseEvent);
        this.linkHover.addEventListener('mouseenter', onMouseEnter);
        this.toDispose.push(core_1.Disposable.create(() => this.linkHover.removeEventListener('mouseenter', onMouseEnter)));
        const onMouseLeave = (mouseEvent) => this.onMouseLeaveLinkHoverEmitter.fire(mouseEvent);
        this.linkHover.addEventListener('mouseleave', onMouseLeave);
        this.toDispose.push(core_1.Disposable.create(() => this.linkHover.removeEventListener('mouseleave', onMouseLeave)));
        this.node.appendChild(this.linkHover);
    }
    showLinkHover(invokeAction, x, y, message) {
        var _a, _b, _c, _d;
        const mouseY = (_b = (_a = this.lastMousePosition) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : y;
        const mouseX = (_d = (_c = this.lastMousePosition) === null || _c === void 0 ? void 0 : _c.x) !== null && _d !== void 0 ? _d : x;
        this.linkHoverButton.textContent = this.linkHoverMessage(message);
        this.linkHoverButton.onclick = (mouseEvent) => invokeAction(mouseEvent);
        this.linkHover.style.display = 'inline';
        this.linkHover.style.top = `${mouseY - 30}px`;
        this.linkHover.style.left = `${mouseX - 60}px`;
    }
    linkHoverMessage(message) {
        return message !== null && message !== void 0 ? message : nls_1.nls.localizeByDefault('Follow link');
    }
    hideLinkHover() {
        this.linkHover.style.display = 'none';
        // eslint-disable-next-line no-null/no-null
        this.linkHoverButton.onclick = null;
    }
    getTerminal() {
        return this.term;
    }
    getSearchBox() {
        return this.searchBox;
    }
    onCloseRequest(msg) {
        this.exitStatus = { code: undefined, reason: base_terminal_protocol_1.TerminalExitReason.User };
        super.onCloseRequest(msg);
    }
    get dimensions() {
        return {
            cols: this.term.cols,
            rows: this.term.rows,
        };
    }
    get cwd() {
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            return Promise.reject(new Error('terminal is not started'));
        }
        if (this.terminalService.getById(this.id)) {
            return this.shellTerminalServer.getCwdURI(this.terminalId)
                .then(cwdUrl => {
                this.lastCwd = new uri_1.default(cwdUrl);
                return this.lastCwd;
            }).catch(() => this.lastCwd);
        }
        return Promise.resolve(new uri_1.default());
    }
    get processId() {
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            return Promise.reject(new Error('terminal is not started'));
        }
        return this.shellTerminalServer.getProcessId(this.terminalId);
    }
    get processInfo() {
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            return Promise.reject(new Error('terminal is not started'));
        }
        return this.shellTerminalServer.getProcessInfo(this.terminalId);
    }
    get envVarCollectionDescriptionsByExtension() {
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            return Promise.reject(new Error('terminal is not started'));
        }
        return this.shellTerminalServer.getEnvVarCollectionDescriptionsByExtension(this.terminalId);
    }
    get terminalId() {
        return this._terminalId;
    }
    get lastTouchEndEvent() {
        return this.lastTouchEnd;
    }
    get hiddenFromUser() {
        var _a;
        if (this.shown) {
            return false;
        }
        return (_a = this.options.hideFromUser) !== null && _a !== void 0 ? _a : false;
    }
    get transient() {
        // The terminal is transient if session persistence is disabled or it's explicitly marked as transient
        return !this.preferences['terminal.integrated.enablePersistentSessions'] || !!this.options.isTransient;
    }
    onDispose(onDispose) {
        this.toDispose.push(core_1.Disposable.create(onDispose));
    }
    clearOutput() {
        this.term.clear();
    }
    selectAll() {
        this.term.selectAll();
    }
    async hasChildProcesses() {
        return this.shellTerminalServer.hasChildProcesses(await this.processId);
    }
    storeState() {
        this.closeOnDispose = false;
        if (this.transient || this.options.isPseudoTerminal) {
            return {};
        }
        return { terminalId: this.terminalId, titleLabel: this.title.label };
    }
    restoreState(oldState) {
        // transient terminals and pseudo terminals are not restored
        if (this.transient || this.options.isPseudoTerminal) {
            this.dispose();
            return;
        }
        if (this.restored === false) {
            const state = oldState;
            /* This is a workaround to issue #879 */
            this.restored = true;
            this.title.label = state.titleLabel;
            this.start(state.terminalId);
        }
    }
    /**
     * Create a new shell terminal in the back-end and attach it to a
     * new terminal widget.
     * If id is provided attach to the terminal for this id.
     */
    async start(id) {
        this._terminalId = typeof id !== 'number' ? await this.createTerminal() : await this.attachTerminal(id);
        this.resizeTerminalProcess();
        this.connectTerminalProcess();
        if (base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            this.onDidOpenEmitter.fire(undefined);
            await this.shellTerminalServer.onAttachAttempted(this._terminalId);
            return this.terminalId;
        }
        this.onDidOpenFailureEmitter.fire(undefined);
        throw new Error('Failed to start terminal' + (id ? ` for id: ${id}.` : '.'));
    }
    async attachTerminal(id) {
        const terminalId = await this.shellTerminalServer.attach(id);
        if (base_terminal_protocol_1.IBaseTerminalServer.validateId(terminalId)) {
            // reset exit status if a new terminal process is attached
            this.exitStatus = undefined;
            return terminalId;
        }
        this.logger.warn(`Failed attaching to terminal id ${id}, the terminal is most likely gone. Starting up a new terminal instead.`);
        if (this.kind === 'user') {
            return this.createTerminal();
        }
        else {
            return -1;
        }
    }
    async createTerminal() {
        var _a, _b;
        let rootURI = (_a = this.options.cwd) === null || _a === void 0 ? void 0 : _a.toString();
        if (!rootURI) {
            const root = (await this.workspaceService.roots)[0];
            rootURI = (_b = root === null || root === void 0 ? void 0 : root.resource) === null || _b === void 0 ? void 0 : _b.toString();
        }
        const { cols, rows } = this.term;
        const terminalId = await this.shellTerminalServer.create({
            shell: this.options.shellPath || this.shellPreferences.shell[core_1.OS.backend.type()],
            args: this.options.shellArgs || this.shellPreferences.shellArgs[core_1.OS.backend.type()],
            env: this.options.env,
            strictEnv: this.options.strictEnv,
            isPseudo: this.options.isPseudoTerminal,
            rootURI,
            cols,
            rows
        });
        if (base_terminal_protocol_1.IBaseTerminalServer.validateId(terminalId)) {
            return terminalId;
        }
        throw new Error('Error creating terminal widget, see the backend error log for more information.');
    }
    processMessage(msg) {
        super.processMessage(msg);
        switch (msg.type) {
            case 'fit-request':
                this.onFitRequest(msg);
                break;
            default:
                break;
        }
    }
    onFitRequest(msg) {
        super.onFitRequest(msg);
        browser_1.MessageLoop.sendMessage(this, browser_1.Widget.ResizeMessage.UnknownSize);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.term.focus();
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.update();
        this.shown = true;
    }
    onAfterAttach(msg) {
        browser_1.Widget.attach(this.searchBox, this.node);
        super.onAfterAttach(msg);
        this.update();
    }
    onBeforeDetach(msg) {
        browser_1.Widget.detach(this.searchBox);
        super.onBeforeDetach(msg);
    }
    onResize(msg) {
        super.onResize(msg);
        this.needsResize = true;
        this.update();
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        if (!this.isVisible || !this.isAttached) {
            return;
        }
        this.open();
        if (this.needsResize) {
            this.resizeTerminal();
            this.needsResize = false;
            this.resizeTerminalProcess();
        }
    }
    connectTerminalProcess() {
        if (typeof this.terminalId !== 'number') {
            return;
        }
        if (this.options.isPseudoTerminal) {
            return;
        }
        this.toDisposeOnConnect.dispose();
        this.toDispose.push(this.toDisposeOnConnect);
        const waitForConnection = this.waitForConnection = new promise_util_1.Deferred();
        this.webSocketConnectionProvider.listen({
            path: `${terminal_protocol_1.terminalsPath}/${this.terminalId}`,
            onConnection: connection => {
                connection.onMessage(e => {
                    this.write(e().readString());
                });
                // Excludes the device status code emitted by Xterm.js
                const sendData = (data) => {
                    if (data && !this.deviceStatusCodes.has(data) && !this.disableEnterWhenAttachCloseListener()) {
                        connection.getWriteBuffer().writeString(data).commit();
                    }
                };
                const disposable = new core_1.DisposableCollection();
                disposable.push(this.term.onData(sendData));
                disposable.push(this.term.onBinary(sendData));
                connection.onClose(() => disposable.dispose());
                if (waitForConnection) {
                    waitForConnection.resolve(connection);
                }
            }
        }, { reconnecting: false });
    }
    async reconnectTerminalProcess() {
        if (this.options.isPseudoTerminal) {
            return;
        }
        if (typeof this.terminalId === 'number') {
            await this.start(this.terminalId);
        }
    }
    open() {
        if (this.termOpened) {
            return;
        }
        this.term.open(this.node);
        if (browser_1.isFirefox) {
            // monkey patching intersection observer handling for secondary window support
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const renderService = this.term._core._renderService;
            const originalFunc = renderService._onIntersectionChange.bind(renderService);
            const replacement = function (entry) {
                if (entry.target.ownerDocument !== document) {
                    // in Firefox, the intersection observer always reports the widget as non-intersecting if the dom element
                    // is in a different document from when the IntersectionObserver started observing. Since we know
                    // that the widget is always "visible" when in a secondary window, so we mark the entry as "intersecting"
                    const patchedEvent = {
                        ...entry,
                        isIntersecting: true,
                    };
                    originalFunc(patchedEvent);
                }
                else {
                    originalFunc(entry);
                }
            };
            renderService._onIntersectionChange = replacement;
        }
        if (this.initialData) {
            this.term.write(this.initialData);
        }
        this.termOpened = true;
        this.initialData = '';
        if (browser_1.isFirefox) {
            // The software scrollbars don't work with xterm.js, so we disable the scrollbar if we are on firefox.
            if (this.term.element) {
                this.term.element.children.item(0).style.overflow = 'hidden';
            }
        }
    }
    write(data) {
        if (this.termOpened) {
            this.term.write(data);
        }
        else {
            this.initialData += data;
        }
    }
    resize(cols, rows) {
        this.term.resize(cols, rows);
    }
    sendText(text) {
        if (this.waitForConnection) {
            this.waitForConnection.promise.then(connection => connection.getWriteBuffer().writeString(text).commit());
        }
    }
    async executeCommand(commandOptions) {
        this.sendText(this.shellCommandBuilder.buildCommand(await this.processInfo, commandOptions) + core_1.OS.backend.EOL);
    }
    scrollLineUp() {
        this.term.scrollLines(-1);
    }
    scrollLineDown() {
        this.term.scrollLines(1);
    }
    scrollToTop() {
        this.term.scrollToTop();
    }
    scrollToBottom() {
        this.term.scrollToBottom();
    }
    scrollPageUp() {
        this.term.scrollPages(-1);
    }
    scrollPageDown() {
        this.term.scrollPages(1);
    }
    resetTerminal() {
        this.term.reset();
    }
    writeLine(text) {
        this.term.writeln(text);
    }
    get onTerminalDidClose() {
        return this.onTermDidClose.event;
    }
    dispose() {
        if (this.closeOnDispose === true && typeof this.terminalId === 'number' && !this.exitStatus) {
            // Close the backend terminal only when explicitly closing the terminal
            // a refresh for example won't close it.
            this.shellTerminalServer.close(this.terminalId);
            // Exit status is set when terminal is closed by user or by process, so most likely an extension closed it.
            this.exitStatus = { code: undefined, reason: base_terminal_protocol_1.TerminalExitReason.Extension };
        }
        if (this.exitStatus) {
            this.onTermDidClose.fire(this);
        }
        if (this.enhancedPreviewNode) {
            // don't use preview node anymore. rendered markdown will be disposed on super call
            this.enhancedPreviewNode = undefined;
        }
        super.dispose();
    }
    doResizeTerminal() {
        if (this.isDisposed) {
            return;
        }
        const geo = this.fitAddon.proposeDimensions();
        const cols = geo.cols;
        const rows = geo.rows - 1; // subtract one row for margin
        this.term.resize(cols, rows);
    }
    resizeTerminalProcess() {
        if (this.options.isPseudoTerminal) {
            return;
        }
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)
            || this.exitStatus
            || !this.terminalService.getById(this.id)) {
            return;
        }
        const { cols, rows } = this.term;
        this.shellTerminalServer.resize(this.terminalId, cols, rows);
    }
    get enableCopy() {
        return this.preferences['terminal.enableCopy'];
    }
    get enablePaste() {
        return this.preferences['terminal.enablePaste'];
    }
    get shellPreferences() {
        var _a, _b, _c;
        return {
            shell: {
                Windows: (_a = this.preferences['terminal.integrated.shell.windows']) !== null && _a !== void 0 ? _a : undefined,
                Linux: (_b = this.preferences['terminal.integrated.shell.linux']) !== null && _b !== void 0 ? _b : undefined,
                OSX: (_c = this.preferences['terminal.integrated.shell.osx']) !== null && _c !== void 0 ? _c : undefined,
            },
            shellArgs: {
                Windows: this.preferences['terminal.integrated.shellArgs.windows'],
                Linux: this.preferences['terminal.integrated.shellArgs.linux'],
                OSX: this.preferences['terminal.integrated.shellArgs.osx'],
            }
        };
    }
    customKeyHandler(event) {
        const keyBindings = browser_1.KeyCode.createKeyCode(event).toString();
        const ctrlCmdCopy = (common_1.isOSX && keyBindings === 'meta+c') || (!common_1.isOSX && keyBindings === 'ctrl+c');
        const ctrlCmdPaste = (common_1.isOSX && keyBindings === 'meta+v') || (!common_1.isOSX && keyBindings === 'ctrl+v');
        if (ctrlCmdCopy && this.enableCopy && this.term.hasSelection()) {
            return false;
        }
        if (ctrlCmdPaste && this.enablePaste) {
            return false;
        }
        return true;
    }
    get copyOnSelection() {
        return this.preferences['terminal.integrated.copyOnSelection'];
    }
    attachCustomKeyEventHandler() {
        this.term.attachCustomKeyEventHandler(e => this.customKeyHandler(e));
    }
    setTitle(title) {
        this.title.caption = title;
        this.title.label = title;
    }
    waitOnExit(waitOnExit) {
        if (waitOnExit) {
            if (typeof waitOnExit === 'string') {
                let message = waitOnExit;
                // Bold the message and add an extra new line to make it stand out from the rest of the output
                message = `\r\n\x1b[1m${message}\x1b[0m`;
                this.write(message);
            }
            this.attachPressEnterKeyToCloseListener(this.term);
            return;
        }
        this.dispose();
    }
    attachPressEnterKeyToCloseListener(term) {
        if (term.textarea) {
            this.isAttachedCloseListener = true;
            this.addKeyListener(term.textarea, keys_1.Key.ENTER, (event) => {
                this.dispose();
                this.isAttachedCloseListener = false;
            });
        }
    }
    disableEnterWhenAttachCloseListener() {
        return this.isAttachedCloseListener;
    }
    getEnhancedPreviewNode() {
        if (this.enhancedPreviewNode) {
            return this.enhancedPreviewNode;
        }
        this.enhancedPreviewNode = document.createElement('div');
        Promise.all([this.envVarCollectionDescriptionsByExtension, this.processId, this.processInfo])
            .then((values) => {
            const extensions = values[0];
            const processId = values[1];
            const processInfo = values[2];
            const markdown = new markdown_string_1.MarkdownStringImpl();
            markdown.appendMarkdown('Process ID: ' + processId + '\\\n');
            markdown.appendMarkdown('Command line: ' +
                processInfo.executable +
                ' ' +
                processInfo.arguments.join(' ') +
                '\n\n---\n\n');
            markdown.appendMarkdown('The following extensions have contributed to this terminal\'s environment:\n');
            extensions.forEach((value, key) => {
                if (value === undefined) {
                    markdown.appendMarkdown('* ' + key + '\n');
                }
                else if (typeof value === 'string') {
                    markdown.appendMarkdown('* ' + key + ': ' + value + '\n');
                }
                else {
                    markdown.appendMarkdown('* ' + key + ': ' + value.value + '\n');
                }
            });
            const enhancedPreviewNode = this.enhancedPreviewNode;
            if (!this.isDisposed && enhancedPreviewNode) {
                const result = this.markdownRenderer.render(markdown);
                this.toDispose.push(result);
                enhancedPreviewNode.appendChild(result.element);
            }
        });
        return this.enhancedPreviewNode;
    }
};
TerminalWidgetImpl.LABEL = nls_1.nls.localizeByDefault('Terminal');
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TerminalWidgetImpl.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WebSocketConnectionProvider),
    __metadata("design:type", browser_1.WebSocketConnectionProvider)
], TerminalWidgetImpl.prototype, "webSocketConnectionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_widget_1.TerminalWidgetOptions),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(shell_terminal_protocol_1.ShellTerminalServerProxy),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "shellTerminalServer", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_watcher_1.TerminalWatcher),
    __metadata("design:type", terminal_watcher_1.TerminalWatcher)
], TerminalWidgetImpl.prototype, "terminalWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    (0, inversify_1.named)('terminal'),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)('terminal-dom-id'),
    __metadata("design:type", String)
], TerminalWidgetImpl.prototype, "id", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_preferences_1.TerminalPreferences),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(exports.TerminalContribution),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "terminalContributionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_search_widget_1.TerminalSearchWidgetFactory),
    __metadata("design:type", Function)
], TerminalWidgetImpl.prototype, "terminalSearchBoxFactory", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_copy_on_selection_handler_1.TerminalCopyOnSelectionHandler),
    __metadata("design:type", terminal_copy_on_selection_handler_1.TerminalCopyOnSelectionHandler)
], TerminalWidgetImpl.prototype, "copyOnSelectionHandler", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_theme_service_1.TerminalThemeService),
    __metadata("design:type", terminal_theme_service_1.TerminalThemeService)
], TerminalWidgetImpl.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.inject)(shell_command_builder_1.ShellCommandBuilder),
    __metadata("design:type", shell_command_builder_1.ShellCommandBuilder)
], TerminalWidgetImpl.prototype, "shellCommandBuilder", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], TerminalWidgetImpl.prototype, "contextMenuRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(markdown_renderer_1.MarkdownRendererFactory),
    __metadata("design:type", Function)
], TerminalWidgetImpl.prototype, "markdownRendererFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TerminalWidgetImpl.prototype, "init", null);
TerminalWidgetImpl = TerminalWidgetImpl_1 = __decorate([
    (0, inversify_1.injectable)()
], TerminalWidgetImpl);
exports.TerminalWidgetImpl = TerminalWidgetImpl;
//# sourceMappingURL=terminal-widget-impl.js.map