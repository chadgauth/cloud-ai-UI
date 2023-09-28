"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_plugin-ext_lib_common_collections_js-packages_plugin-ext_lib_common_connection_js-pa-6a01d2"],{

/***/ "../../packages/plugin-ext/lib/common/collections.js":
/*!***********************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/collections.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2022 TypeFox and others.
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
exports.diffMaps = exports.diffSets = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.71.2/src/vs/base/common/collections.ts
function diffSets(before, after) {
    const removed = [];
    const added = [];
    for (const element of before) {
        if (!after.has(element)) {
            removed.push(element);
        }
    }
    for (const element of after) {
        if (!before.has(element)) {
            added.push(element);
        }
    }
    return { removed, added };
}
exports.diffSets = diffSets;
function diffMaps(before, after) {
    const removed = [];
    const added = [];
    for (const [index, value] of before) {
        if (!after.has(index)) {
            removed.push(value);
        }
    }
    for (const [index, value] of after) {
        if (!before.has(index)) {
            added.push(value);
        }
    }
    return { removed, added };
}
exports.diffMaps = diffMaps;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/collections'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/connection.js":
/*!**********************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/connection.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectionImpl = exports.PluginChannel = void 0;
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
/**
 * A channel communicating with a counterpart in a plugin host.
 */
class PluginChannel {
    constructor(id, connection) {
        this.id = id;
        this.connection = connection;
        this.messageEmitter = new event_1.Emitter();
        this.errorEmitter = new event_1.Emitter();
        this.closedEmitter = new event_1.Emitter();
    }
    send(content) {
        this.connection.$sendMessage(this.id, content);
    }
    fireMessageReceived(msg) {
        this.messageEmitter.fire(msg);
    }
    fireError(error) {
        this.errorEmitter.fire(error);
    }
    fireClosed() {
        this.closedEmitter.fire();
    }
    onMessage(cb) {
        this.messageEmitter.event(cb);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError(cb) {
        this.errorEmitter.event(cb);
    }
    onClose(cb) {
        this.closedEmitter.event(() => cb(-1, 'closed'));
    }
    close() {
        this.connection.$deleteConnection(this.id);
    }
}
exports.PluginChannel = PluginChannel;
class ConnectionImpl {
    constructor(proxy) {
        this.connections = new Map();
        this.proxy = proxy;
    }
    /**
     * Gets the connection between plugin by id and sends string message to it.
     *
     * @param id connection's id
     * @param message incoming message
     */
    async $sendMessage(id, message) {
        if (this.connections.has(id)) {
            this.connections.get(id).fireMessageReceived(message);
        }
        else {
            console.warn(`Received message for unknown connection: ${id}`);
        }
    }
    /**
     * Instantiates a new connection by the given id.
     * @param id the connection id
     */
    async $createConnection(id) {
        console.debug(`Creating plugin connection: ${id}`);
        await this.doEnsureConnection(id);
    }
    /**
     * Deletes a connection.
     * @param id the connection id
     */
    async $deleteConnection(id) {
        console.debug(`Deleting plugin connection: ${id}`);
        const connection = this.connections.get(id);
        if (connection) {
            this.connections.delete(id);
            connection.fireClosed();
        }
    }
    /**
     * Returns existed connection or creates a new one.
     * @param id the connection id
     */
    async ensureConnection(id) {
        console.debug(`Creating local connection: ${id}`);
        const connection = await this.doEnsureConnection(id);
        await this.proxy.$createConnection(id);
        return connection;
    }
    /**
     * Returns existed connection or creates a new one.
     * @param id the connection id
     */
    async doEnsureConnection(id) {
        const connection = this.connections.get(id) || await this.doCreateConnection(id);
        this.connections.set(id, connection);
        return connection;
    }
    async doCreateConnection(id) {
        const channel = new PluginChannel(id, this.proxy);
        channel.onClose(() => this.connections.delete(id));
        return channel;
    }
}
exports.ConnectionImpl = ConnectionImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/connection'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/editor-options.js":
/*!**************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/editor-options.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.cursorStyleToString = exports.TextEditorCursorStyle = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// enum copied from monaco.d.ts
/**
 * The style in which the editor's cursor should be rendered.
 */
var TextEditorCursorStyle;
(function (TextEditorCursorStyle) {
    /**
     * As a vertical line
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
    /**
     * As a block
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
    /**
     * As a horizontal line, under character
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
    /**
     * As a thin vertical line
     */
    TextEditorCursorStyle[TextEditorCursorStyle["LineThin"] = 4] = "LineThin";
    /**
     * As an outlined block, on top of a character
     */
    TextEditorCursorStyle[TextEditorCursorStyle["BlockOutline"] = 5] = "BlockOutline";
    /**
     * As a thin horizontal line, under a character
     */
    TextEditorCursorStyle[TextEditorCursorStyle["UnderlineThin"] = 6] = "UnderlineThin";
})(TextEditorCursorStyle = exports.TextEditorCursorStyle || (exports.TextEditorCursorStyle = {}));
function cursorStyleToString(cursorStyle) {
    switch (cursorStyle) {
        case TextEditorCursorStyle.Line:
            return 'line';
        case TextEditorCursorStyle.Block:
            return 'block';
        case TextEditorCursorStyle.Underline:
            return 'underline';
        case TextEditorCursorStyle.LineThin:
            return 'line-thin';
        case TextEditorCursorStyle.BlockOutline:
            return 'block-outline';
        case TextEditorCursorStyle.UnderlineThin:
            return 'underline-thin';
        default:
            throw new Error('cursorStyleToString: Unknown cursorStyle');
    }
}
exports.cursorStyleToString = cursorStyleToString;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/editor-options'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/plugin/quick-open.js":
/*!**********************************************************!*\
  !*** ../../packages/plugin-ext/lib/plugin/quick-open.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuickPickExt = exports.InputBoxExt = exports.QuickInputExt = exports.QuickOpenExtImpl = exports.getIconPathOrClass = exports.getDarkIconUri = exports.getLightIconUri = exports.getIconUris = exports.isPromiseCanceledError = void 0;
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
/* eslint-disable @typescript-eslint/no-explicit-any */
const plugin_api_rpc_1 = __webpack_require__(/*! ../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const types_impl_1 = __webpack_require__(/*! ./types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const path = __webpack_require__(/*! path */ "../../node_modules/path-browserify/index.js");
const type_converters_1 = __webpack_require__(/*! ./type-converters */ "../../packages/plugin-ext/lib/plugin/type-converters.js");
const plugin_protocol_1 = __webpack_require__(/*! ../common/plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js");
const severity_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/severity */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/severity.js");
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
const canceledName = 'Canceled';
/**
 * Checks if the given error is a promise in canceled state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPromiseCanceledError(error) {
    return error instanceof Error && error.name === canceledName && error.message === canceledName;
}
exports.isPromiseCanceledError = isPromiseCanceledError;
function getIconUris(iconPath) {
    if (types_impl_1.ThemeIcon.is(iconPath)) {
        return { id: iconPath.id };
    }
    const dark = getDarkIconUri(iconPath);
    const light = getLightIconUri(iconPath);
    // Tolerate strings: https://github.com/microsoft/vscode/issues/110432#issuecomment-726144556
    return {
        dark: typeof dark === 'string' ? vscode_uri_1.URI.file(dark) : dark,
        light: typeof light === 'string' ? vscode_uri_1.URI.file(light) : light
    };
}
exports.getIconUris = getIconUris;
function getLightIconUri(iconPath) {
    return typeof iconPath === 'object' && 'light' in iconPath ? iconPath.light : iconPath;
}
exports.getLightIconUri = getLightIconUri;
function getDarkIconUri(iconPath) {
    return typeof iconPath === 'object' && 'dark' in iconPath ? iconPath.dark : iconPath;
}
exports.getDarkIconUri = getDarkIconUri;
function getIconPathOrClass(button) {
    const iconPathOrIconClass = getIconUris(button.iconPath);
    let iconPath;
    let iconClass;
    if ('id' in iconPathOrIconClass) {
        iconClass = themeService_1.ThemeIcon.asClassName(iconPathOrIconClass);
    }
    else {
        iconPath = iconPathOrIconClass;
    }
    return {
        iconPath,
        iconClass
    };
}
exports.getIconPathOrClass = getIconPathOrClass;
class QuickOpenExtImpl {
    constructor(rpc) {
        this._sessions = new Map(); // Each quickinput will have a number so that we know where to fire events
        this._instances = 0;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.QUICK_OPEN_MAIN);
    }
    showQuickPick(itemsOrItemsPromise, options, token = cancellation_1.CancellationToken.None) {
        this.onDidSelectItem = undefined;
        const itemsPromise = Promise.resolve(itemsOrItemsPromise);
        const instance = ++this._instances;
        const widgetPromise = this.proxy.$show(instance, {
            title: options && options.title,
            canPickMany: options && options.canPickMany,
            placeHolder: options && options.placeHolder,
            matchOnDescription: options && options.matchOnDescription,
            matchOnDetail: options && options.matchOnDetail,
            ignoreFocusLost: options && options.ignoreFocusOut
        }, token);
        const widgetClosedMarker = {};
        const widgetClosedPromise = widgetPromise.then(() => widgetClosedMarker);
        return Promise.race([widgetClosedPromise, itemsPromise]).then(result => {
            if (result === widgetClosedMarker) {
                return undefined;
            }
            return itemsPromise.then(async (items) => {
                const pickItems = (0, type_converters_1.convertToTransferQuickPickItems)(items);
                if (options && typeof options.onDidSelectItem === 'function') {
                    this.onDidSelectItem = handle => {
                        options.onDidSelectItem(items[handle]);
                    };
                }
                this.proxy.$setItems(instance, pickItems);
                return widgetPromise.then(handle => {
                    if (typeof handle === 'number') {
                        if (options && options.canPickMany) {
                            return Array.of(items[handle]);
                        }
                        else {
                            return items[handle];
                        }
                    }
                    else if (Array.isArray(handle)) {
                        return handle.map(h => items[h]);
                    }
                    return undefined;
                });
            });
        }).then(undefined, err => {
            if (isPromiseCanceledError(err)) {
                return undefined;
            }
            this.proxy.$setError(instance, err);
            return Promise.reject(err);
        });
    }
    $onItemSelected(handle) {
        if (this.onDidSelectItem) {
            this.onDidSelectItem(handle);
        }
    }
    // ---- input
    showInput(options, token = cancellation_1.CancellationToken.None) {
        this.validateInputHandler = options === null || options === void 0 ? void 0 : options.validateInput;
        if (!options) {
            options = { placeHolder: '' };
        }
        return this.proxy.$input(options, typeof this.validateInputHandler === 'function', token);
    }
    async showInputBox(options) {
        this.validateInputHandler = typeof options.validateInput === 'function' ? options.validateInput : undefined;
        return this.proxy.$showInputBox(options, typeof this.validateInputHandler === 'function');
    }
    async $validateInput(input) {
        if (!this.validateInputHandler) {
            return;
        }
        const result = await this.validateInputHandler(input);
        if (!result || typeof result === 'string') {
            return result;
        }
        let severity;
        switch (result.severity) {
            case types_impl_1.InputBoxValidationSeverity.Info:
                severity = severity_1.default.Info;
                break;
            case types_impl_1.InputBoxValidationSeverity.Warning:
                severity = severity_1.default.Warning;
                break;
            case types_impl_1.InputBoxValidationSeverity.Error:
                severity = severity_1.default.Error;
                break;
            default:
                severity = result.message ? severity_1.default.Error : severity_1.default.Ignore;
                break;
        }
        return {
            content: result.message,
            severity
        };
    }
    // ---- QuickInput
    createQuickPick(plugin) {
        const session = new QuickPickExt(this, this.proxy, plugin, () => this._sessions.delete(session._id));
        this._sessions.set(session._id, session);
        return session;
    }
    createInputBox(plugin) {
        const session = new InputBoxExt(this, this.proxy, plugin, () => this._sessions.delete(session._id));
        this._sessions.set(session._id, session);
        return session;
    }
    hide() {
        this.proxy.$hide();
    }
    async $acceptOnDidAccept(sessionId) {
        const session = this._sessions.get(sessionId);
        if (session) {
            session._fireAccept();
        }
    }
    async $acceptDidChangeValue(sessionId, changedValue) {
        const session = this._sessions.get(sessionId);
        if (session) {
            session._fireChangedValue(changedValue);
        }
    }
    async $acceptOnDidHide(sessionId) {
        const session = this._sessions.get(sessionId);
        if (session) {
            session._fireHide();
        }
    }
    async $acceptOnDidTriggerButton(sessionId, btn) {
        const session = this._sessions.get(sessionId);
        if (session) {
            if (btn.index === -1) {
                session._fireButtonTrigger(types_impl_1.QuickInputButtons.Back);
            }
            else if (session && (session instanceof InputBoxExt || session instanceof QuickPickExt)) {
                const btnFromIndex = session.buttons[btn.index];
                session._fireButtonTrigger(btnFromIndex);
            }
        }
    }
    $onDidChangeActive(sessionId, handles) {
        const session = this._sessions.get(sessionId);
        if (session instanceof QuickPickExt) {
            session._fireDidChangeActive(handles);
        }
    }
    $onDidChangeSelection(sessionId, handles) {
        const session = this._sessions.get(sessionId);
        if (session instanceof QuickPickExt) {
            session._fireDidChangeSelection(handles);
        }
    }
    $onDidTriggerItemButton(sessionId, itemHandle, buttonHandle) {
        const session = this._sessions.get(sessionId);
        if (session instanceof QuickPickExt) {
            session._fireDidTriggerItemButton(itemHandle, buttonHandle);
        }
    }
}
exports.QuickOpenExtImpl = QuickOpenExtImpl;
class QuickInputExt {
    constructor(quickOpen, quickOpenMain, plugin, _onDidDispose) {
        this.quickOpen = quickOpen;
        this.quickOpenMain = quickOpenMain;
        this.plugin = plugin;
        this._onDidDispose = _onDidDispose;
        this._id = QuickInputExt._nextId++;
        this._buttons = [];
        this._handlesToButtons = new Map();
        this.expectingHide = false;
        this._disposed = false;
        this._pendingUpdate = { id: this._id };
        this.title = undefined;
        this.step = undefined;
        this.totalSteps = undefined;
        this.enabled = true;
        this.busy = false;
        this.ignoreFocusOut = false;
        this.value = '';
        this.visible = false;
        this.disposableCollection = new disposable_1.DisposableCollection();
        this.disposableCollection.push(this.onDidAcceptEmitter = new event_1.Emitter());
        this.disposableCollection.push(this._onDidChangeValueEmitter = new event_1.Emitter());
        this.disposableCollection.push(this.onDidHideEmitter = new event_1.Emitter());
        this.disposableCollection.push(this.onDidTriggerButtonEmitter = new event_1.Emitter());
    }
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
        this.update({ title });
    }
    get step() {
        return this._step;
    }
    set step(step) {
        this._step = step;
        this.update({ step });
    }
    get totalSteps() {
        return this._totalSteps;
    }
    set totalSteps(totalSteps) {
        this._totalSteps = totalSteps;
        this.update({ totalSteps });
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(enabled) {
        this._enabled = enabled;
        this.update({ enabled });
    }
    get busy() {
        return this._busy;
    }
    set busy(busy) {
        this._busy = busy;
        this.update({ busy });
    }
    get ignoreFocusOut() {
        return this._ignoreFocusOut;
    }
    set ignoreFocusOut(ignoreFocusOut) {
        this._ignoreFocusOut = ignoreFocusOut;
        this.update({ ignoreFocusOut });
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.update({ value });
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(placeholder) {
        this._placeholder = placeholder;
        this.update({ placeholder });
    }
    get buttons() {
        return this._buttons;
    }
    set buttons(buttons) {
        this._buttons = buttons.slice();
        this._handlesToButtons.clear();
        buttons.forEach((button, i) => {
            const handle = button === types_impl_1.QuickInputButtons.Back ? -1 : i;
            this._handlesToButtons.set(handle, button);
        });
        this.update({
            buttons: buttons.map((button, i) => ({
                iconPath: getIconUris(button.iconPath),
                iconClass: types_impl_1.ThemeIcon.is(button.iconPath) ? themeService_1.ThemeIcon.asClassName(button.iconPath) : undefined,
                tooltip: button.tooltip,
                handle: button === types_impl_1.QuickInputButtons.Back ? -1 : i,
            }))
        });
    }
    show() {
        this.visible = true;
        this.expectingHide = true;
        this.update({ visible: true });
    }
    dispose() {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        this._fireHide();
        this.disposableCollection.dispose();
        this._onDidDispose();
        this.quickOpenMain.$dispose(this._id);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update(properties) {
        if (this._disposed) {
            return;
        }
        for (const key of Object.keys(properties)) {
            const value = properties[key];
            this._pendingUpdate[key] = value === undefined ? null : value;
        }
        if ('visible' in this._pendingUpdate) {
            if (this._updateTimeout) {
                clearTimeout(this._updateTimeout);
                this._updateTimeout = undefined;
            }
            this.dispatchUpdate();
        }
        else if (this.visible && !this._updateTimeout) {
            // Defer the update so that multiple changes to setters dont cause a redraw each
            this._updateTimeout = setTimeout(() => {
                this._updateTimeout = undefined;
                this.dispatchUpdate();
            }, 0);
        }
    }
    dispatchUpdate() {
        this.quickOpenMain.$createOrUpdate(this._pendingUpdate);
        this._pendingUpdate = { id: this._id };
    }
    hide() {
        this.quickOpenMain.$hide();
        this.dispose();
    }
    convertURL(iconPath) {
        const toUrl = (arg) => {
            arg = arg instanceof vscode_uri_1.URI && arg.scheme === 'file' ? arg.fsPath : arg;
            if (typeof arg !== 'string') {
                return arg.toString(true);
            }
            const { packagePath } = this.plugin.rawModel;
            const absolutePath = path.isAbsolute(arg) ? arg : path.join(packagePath, arg);
            const normalizedPath = path.normalize(absolutePath);
            const relativePath = path.relative(packagePath, normalizedPath);
            return plugin_protocol_1.PluginPackage.toPluginUrl(this.plugin.rawModel, relativePath);
        };
        if (types_impl_1.ThemeIcon.is(iconPath)) {
            return iconPath;
        }
        else if (typeof iconPath === 'string' || iconPath instanceof vscode_uri_1.URI) {
            return vscode_uri_1.URI.parse(toUrl(iconPath));
        }
        else {
            const { light, dark } = iconPath;
            return {
                light: toUrl(light),
                dark: toUrl(dark)
            };
        }
    }
    _fireAccept() {
        this.onDidAcceptEmitter.fire(undefined);
    }
    _fireChangedValue(changedValue) {
        this._value = changedValue;
        this._onDidChangeValueEmitter.fire(changedValue);
    }
    _fireHide() {
        if (this.expectingHide) {
            this.expectingHide = false;
            this.onDidHideEmitter.fire(undefined);
        }
    }
    _fireButtonTrigger(btn) {
        this.onDidTriggerButtonEmitter.fire(btn);
    }
    get onDidHide() {
        return this.onDidHideEmitter.event;
    }
    get onDidAccept() {
        return this.onDidAcceptEmitter.event;
    }
    get onDidChangeValue() {
        return this._onDidChangeValueEmitter.event;
    }
    get onDidTriggerButton() {
        return this.onDidTriggerButtonEmitter.event;
    }
}
exports.QuickInputExt = QuickInputExt;
QuickInputExt._nextId = 1;
/**
 * Base implementation of {@link InputBox} that uses {@link QuickOpenExt}.
 * Missing functionality is going to be implemented in the scope of https://github.com/eclipse-theia/theia/issues/5109
 */
class InputBoxExt extends QuickInputExt {
    constructor(quickOpen, quickOpenMain, plugin, onDispose) {
        super(quickOpen, quickOpenMain, plugin, onDispose);
        this.quickOpen = quickOpen;
        this.quickOpenMain = quickOpenMain;
        this.plugin = plugin;
        this.buttons = [];
        this.password = false;
        this.value = '';
    }
    get password() {
        return this._password;
    }
    set password(password) {
        this._password = password;
        this.update({ password });
    }
    get prompt() {
        return this._prompt;
    }
    set prompt(prompt) {
        this._prompt = prompt;
        this.update({ prompt });
    }
    get valueSelection() {
        return this._valueSelection;
    }
    set valueSelection(valueSelection) {
        this._valueSelection = valueSelection;
        this.update({ valueSelection });
    }
    get validationMessage() {
        return this._validationMessage;
    }
    set validationMessage(validationMessage) {
        if (this._validationMessage !== validationMessage) {
            this._validationMessage = validationMessage;
            this.update({ validationMessage });
        }
    }
}
exports.InputBoxExt = InputBoxExt;
/**
 * Base implementation of {@link QuickPick} that uses {@link QuickOpenExt}.
 * Missing functionality is going to be implemented in the scope of https://github.com/eclipse-theia/theia/issues/5059
 */
class QuickPickExt extends QuickInputExt {
    constructor(quickOpen, quickOpenMain, plugin, onDispose) {
        super(quickOpen, quickOpenMain, plugin, onDispose);
        this.quickOpen = quickOpen;
        this.quickOpenMain = quickOpenMain;
        this.plugin = plugin;
        this._items = [];
        this._handlesToItems = new Map();
        this._itemsToHandles = new Map();
        this._canSelectMany = false;
        this._matchOnDescription = true;
        this._matchOnDetail = true;
        this._sortByLabel = true;
        this._keepScrollPosition = false;
        this._activeItems = [];
        this._selectedItems = [];
        this._onDidChangeActiveEmitter = new event_1.Emitter();
        this._onDidChangeSelectionEmitter = new event_1.Emitter();
        this._onDidTriggerItemButtonEmitter = new event_1.Emitter();
        this.onDidChangeActive = this._onDidChangeActiveEmitter.event;
        this.onDidChangeSelection = this._onDidChangeSelectionEmitter.event;
        this.onDidTriggerItemButton = this._onDidTriggerItemButtonEmitter.event;
        this.buttons = [];
        this.disposableCollection.push(this._onDidChangeActiveEmitter);
        this.disposableCollection.push(this._onDidChangeSelectionEmitter);
        this.disposableCollection.push(this._onDidTriggerItemButtonEmitter);
        this.update({ type: 'quickPick' });
    }
    get items() {
        return this._items;
    }
    set items(items) {
        var _a;
        this._items = items.slice();
        this._handlesToItems.clear();
        this._itemsToHandles.clear();
        items.forEach((item, i) => {
            this._handlesToItems.set(i, item);
            this._itemsToHandles.set(item, i);
        });
        const pickItems = [];
        for (let handle = 0; handle < items.length; handle++) {
            const item = items[handle];
            if (item.kind === types_impl_1.QuickPickItemKind.Separator) {
                pickItems.push({ type: 'separator', label: item.label, handle });
            }
            else {
                pickItems.push({
                    kind: item.kind,
                    label: item.label,
                    description: item.description,
                    handle,
                    detail: item.detail,
                    picked: item.picked,
                    alwaysShow: item.alwaysShow,
                    buttons: (_a = item.buttons) === null || _a === void 0 ? void 0 : _a.map((button, index) => ({
                        iconPath: getIconUris(button.iconPath),
                        iconClass: types_impl_1.ThemeIcon.is(button.iconPath) ? themeService_1.ThemeIcon.asClassName(button.iconPath) : undefined,
                        tooltip: button.tooltip,
                        handle: button === types_impl_1.QuickInputButtons.Back ? -1 : index,
                    }))
                });
            }
        }
        this.update({
            items: pickItems,
        });
    }
    get canSelectMany() {
        return this._canSelectMany;
    }
    set canSelectMany(canSelectMany) {
        this._canSelectMany = canSelectMany;
        this.update({ canSelectMany });
    }
    get matchOnDescription() {
        return this._matchOnDescription;
    }
    set matchOnDescription(matchOnDescription) {
        this._matchOnDescription = matchOnDescription;
        this.update({ matchOnDescription });
    }
    get matchOnDetail() {
        return this._matchOnDetail;
    }
    set matchOnDetail(matchOnDetail) {
        this._matchOnDetail = matchOnDetail;
        this.update({ matchOnDetail });
    }
    get sortByLabel() {
        return this._sortByLabel;
    }
    set sortByLabel(sortByLabel) {
        this._sortByLabel = sortByLabel;
        this.update({ sortByLabel });
    }
    get keepScrollPosition() {
        return this._keepScrollPosition;
    }
    set keepScrollPosition(keepScrollPosition) {
        this._keepScrollPosition = keepScrollPosition;
        this.update({ keepScrollPosition });
    }
    get activeItems() {
        return this._activeItems;
    }
    set activeItems(activeItems) {
        this._activeItems = activeItems.filter(item => this._itemsToHandles.has(item));
        this.update({ activeItems: this._activeItems.map(item => this._itemsToHandles.get(item)) });
    }
    get selectedItems() {
        return this._selectedItems;
    }
    set selectedItems(selectedItems) {
        this._selectedItems = selectedItems.filter(item => this._itemsToHandles.has(item));
        this.update({ selectedItems: this._selectedItems.map(item => this._itemsToHandles.get(item)) });
    }
    _fireDidChangeActive(handles) {
        const items = handles.map(handle => this._handlesToItems.get(handle)).filter(e => !!e);
        this._activeItems = items;
        this._onDidChangeActiveEmitter.fire(items);
    }
    _fireDidChangeSelection(handles) {
        const items = handles.map(handle => this._handlesToItems.get(handle)).filter(e => !!e);
        this._selectedItems = items;
        this._onDidChangeSelectionEmitter.fire(items);
    }
    _fireDidTriggerItemButton(itemHandle, buttonHandle) {
        const item = this._handlesToItems.get(itemHandle);
        if (!item || !item.buttons || !item.buttons.length) {
            return;
        }
        const button = item.buttons[buttonHandle];
        if (button) {
            this._onDidTriggerItemButtonEmitter.fire({
                button,
                item
            });
        }
    }
}
exports.QuickPickExt = QuickPickExt;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/plugin/quick-open'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/plugin/terminal-ext.js":
/*!************************************************************!*\
  !*** ../../packages/plugin-ext/lib/plugin/terminal-ext.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PseudoTerminal = exports.TerminalExtImpl = exports.EnvironmentVariableCollection = exports.TerminalServiceExtImpl = exports.getIconClass = exports.getIconUris = void 0;
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
const coreutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/coreutils */ "../../packages/core/shared/@phosphor/coreutils/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const Converter = __webpack_require__(/*! ./type-converters */ "../../packages/plugin-ext/lib/plugin/type-converters.js");
const types_impl_1 = __webpack_require__(/*! ./types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
function getIconUris(iconPath) {
    if (types_impl_1.ThemeIcon.is(iconPath)) {
        return { id: iconPath.id };
    }
    return undefined;
}
exports.getIconUris = getIconUris;
function getIconClass(options) {
    const iconClass = getIconUris(options.iconPath);
    if (iconClass) {
        return themeService_1.ThemeIcon.asClassName(iconClass);
    }
    return undefined;
}
exports.getIconClass = getIconClass;
/**
 * Provides high level terminal plugin api to use in the Theia plugins.
 * This service allow(with help proxy) create and use terminal emulator.
 */
class TerminalServiceExtImpl {
    constructor(rpc) {
        this._terminals = new Map();
        this._pseudoTerminals = new Map();
        this.terminalLinkProviders = new Map();
        this.terminalProfileProviders = new Map();
        this.onDidCloseTerminalEmitter = new event_1.Emitter();
        this.onDidCloseTerminal = this.onDidCloseTerminalEmitter.event;
        this.onDidOpenTerminalEmitter = new event_1.Emitter();
        this.onDidOpenTerminal = this.onDidOpenTerminalEmitter.event;
        this.onDidChangeActiveTerminalEmitter = new event_1.Emitter();
        this.onDidChangeActiveTerminal = this.onDidChangeActiveTerminalEmitter.event;
        this.onDidChangeTerminalStateEmitter = new event_1.Emitter();
        this.onDidChangeTerminalState = this.onDidChangeTerminalStateEmitter.event;
        this.environmentVariableCollections = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TERMINAL_MAIN);
    }
    get terminals() {
        return [...this._terminals.values()];
    }
    createTerminal(nameOrOptions, shellPath, shellArgs) {
        const id = `plugin-terminal-${coreutils_1.UUID.uuid4()}`;
        let options;
        let pseudoTerminal = undefined;
        if (typeof nameOrOptions === 'object') {
            if ('pty' in nameOrOptions) {
                pseudoTerminal = nameOrOptions.pty;
                options = {
                    name: nameOrOptions.name,
                };
                this._pseudoTerminals.set(id, new PseudoTerminal(id, this.proxy, pseudoTerminal));
            }
            else {
                options = nameOrOptions;
            }
        }
        else {
            options = {
                name: nameOrOptions,
                shellPath: shellPath,
                shellArgs: shellArgs
            };
        }
        let parentId;
        if (options.location && typeof options.location === 'object' && 'parentTerminal' in options.location) {
            const parentTerminal = options.location.parentTerminal;
            if (parentTerminal instanceof TerminalExtImpl) {
                for (const [k, v] of this._terminals) {
                    if (v === parentTerminal) {
                        parentId = k;
                        break;
                    }
                }
            }
        }
        this.proxy.$createTerminal(id, options, parentId, !!pseudoTerminal);
        let creationOptions = options;
        // make sure to pass ExtensionTerminalOptions as creation options
        if (typeof nameOrOptions === 'object' && 'pty' in nameOrOptions) {
            creationOptions = nameOrOptions;
        }
        return this.obtainTerminal(id, options.name || 'Terminal', creationOptions);
    }
    attachPtyToTerminal(terminalId, pty) {
        this._pseudoTerminals.set(terminalId.toString(), new PseudoTerminal(terminalId, this.proxy, pty, true));
    }
    obtainTerminal(id, name, options) {
        let terminal = this._terminals.get(id);
        if (!terminal) {
            terminal = new TerminalExtImpl(this.proxy, options !== null && options !== void 0 ? options : {});
            this._terminals.set(id, terminal);
        }
        terminal.name = name;
        return terminal;
    }
    $terminalOnInput(id, data) {
        const terminal = this._pseudoTerminals.get(id);
        if (!terminal) {
            return;
        }
        terminal.emitOnInput(data);
    }
    $terminalStateChanged(id) {
        const terminal = this._terminals.get(id);
        if (!terminal) {
            return;
        }
        if (!terminal.state.isInteractedWith) {
            terminal.state = { isInteractedWith: true };
            this.onDidChangeTerminalStateEmitter.fire(terminal);
        }
    }
    $terminalSizeChanged(id, clos, rows) {
        const terminal = this._pseudoTerminals.get(id);
        if (!terminal) {
            return;
        }
        terminal.emitOnResize(clos, rows);
    }
    $terminalCreated(id, name) {
        const terminal = this.obtainTerminal(id, name);
        terminal.id.resolve(id);
        this.onDidOpenTerminalEmitter.fire(terminal);
    }
    $terminalNameChanged(id, name) {
        const terminal = this._terminals.get(id);
        if (terminal) {
            terminal.name = name;
        }
    }
    $terminalOpened(id, processId, terminalId, cols, rows) {
        const terminal = this._terminals.get(id);
        if (terminal) {
            // resolve for existing clients
            terminal.deferredProcessId.resolve(processId);
            // install new if terminal is reconnected
            terminal.deferredProcessId = new promise_util_1.Deferred();
            terminal.deferredProcessId.resolve(processId);
        }
        // Switch the pseudoterminal keyed by terminalId to be keyed by terminal ID
        const tId = terminalId.toString();
        if (this._pseudoTerminals.has(tId)) {
            const pseudo = this._pseudoTerminals.get(tId);
            if (pseudo) {
                this._pseudoTerminals.set(id, pseudo);
            }
            this._pseudoTerminals.delete(tId);
        }
        const pseudoTerminal = this._pseudoTerminals.get(id);
        if (pseudoTerminal) {
            pseudoTerminal.emitOnOpen(cols, rows);
        }
    }
    $terminalClosed(id, exitStatus) {
        const terminal = this._terminals.get(id);
        if (terminal) {
            terminal.exitStatus = exitStatus !== null && exitStatus !== void 0 ? exitStatus : { code: undefined, reason: types_impl_1.TerminalExitReason.Unknown };
            this.onDidCloseTerminalEmitter.fire(terminal);
            this._terminals.delete(id);
        }
        const pseudoTerminal = this._pseudoTerminals.get(id);
        if (pseudoTerminal) {
            pseudoTerminal.emitOnClose();
            this._pseudoTerminals.delete(id);
        }
    }
    get activeTerminal() {
        return this.activeTerminalId && this._terminals.get(this.activeTerminalId) || undefined;
    }
    $currentTerminalChanged(id) {
        this.activeTerminalId = id;
        this.onDidChangeActiveTerminalEmitter.fire(this.activeTerminal);
    }
    registerTerminalLinkProvider(provider) {
        const providerId = (TerminalServiceExtImpl.nextProviderId++).toString();
        this.terminalLinkProviders.set(providerId, provider);
        this.proxy.$registerTerminalLinkProvider(providerId);
        return types_impl_1.Disposable.create(() => {
            this.proxy.$unregisterTerminalLinkProvider(providerId);
            this.terminalLinkProviders.delete(providerId);
        });
    }
    registerTerminalProfileProvider(id, provider) {
        this.terminalProfileProviders.set(id, provider);
        return types_impl_1.Disposable.create(() => {
            this.terminalProfileProviders.delete(id);
        });
    }
    /** @stubbed */
    registerTerminalQuickFixProvider(id, provider) {
        return types_impl_1.Disposable.NULL;
    }
    isExtensionTerminalOptions(options) {
        return 'pty' in options;
    }
    async $startProfile(profileId, cancellationToken) {
        const provider = this.terminalProfileProviders.get(profileId);
        if (!provider) {
            throw new Error(`No terminal profile provider with id '${profileId}'`);
        }
        const profile = await provider.provideTerminalProfile(cancellationToken);
        if (!profile) {
            throw new Error(`Profile with id ${profileId} could not be created`);
        }
        const id = `plugin-terminal-${coreutils_1.UUID.uuid4()}`;
        const options = profile.options;
        if (this.isExtensionTerminalOptions(options)) {
            this._pseudoTerminals.set(id, new PseudoTerminal(id, this.proxy, options.pty));
            return this.proxy.$createTerminal(id, { name: options.name }, undefined, true);
        }
        else {
            return this.proxy.$createTerminal(id, profile.options);
        }
    }
    async $provideTerminalLinks(line, terminalId, token) {
        const links = [];
        const terminal = this._terminals.get(terminalId);
        if (terminal) {
            for (const [providerId, provider] of this.terminalLinkProviders) {
                const providedLinks = await provider.provideTerminalLinks({ line, terminal }, token);
                if (providedLinks) {
                    links.push(...providedLinks.map(link => ({ ...link, providerId })));
                }
            }
        }
        return links;
    }
    async $handleTerminalLink(link) {
        const provider = this.terminalLinkProviders.get(link.providerId);
        if (!provider) {
            throw Error('Terminal link provider not found');
        }
        await provider.handleTerminalLink(link);
    }
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    // some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.0/src/vs/workbench/api/common/extHostTerminalService.ts
    getEnvironmentVariableCollection(extensionIdentifier) {
        let collection = this.environmentVariableCollections.get(extensionIdentifier);
        if (!collection) {
            collection = new EnvironmentVariableCollection();
            this.setEnvironmentVariableCollection(extensionIdentifier, collection);
        }
        return collection;
    }
    syncEnvironmentVariableCollection(extensionIdentifier, collection) {
        const serialized = [...collection.map.entries()];
        this.proxy.$setEnvironmentVariableCollection(collection.persistent, {
            extensionIdentifier,
            collection: serialized.length === 0 ? undefined : serialized,
            description: Converter.fromMarkdownOrString(collection.description)
        });
    }
    setEnvironmentVariableCollection(extensionIdentifier, collection) {
        this.environmentVariableCollections.set(extensionIdentifier, collection);
        collection.onDidChangeCollection(() => {
            // When any collection value changes send this immediately, this is done to ensure
            // following calls to createTerminal will be created with the new environment. It will
            // result in more noise by sending multiple updates when called but collections are
            // expected to be small.
            this.syncEnvironmentVariableCollection(extensionIdentifier, collection);
        });
    }
    $initEnvironmentVariableCollections(collections) {
        collections.forEach(entry => {
            const extensionIdentifier = entry[0];
            const collection = new EnvironmentVariableCollection(entry[1]);
            this.setEnvironmentVariableCollection(extensionIdentifier, collection);
        });
    }
}
exports.TerminalServiceExtImpl = TerminalServiceExtImpl;
TerminalServiceExtImpl.nextProviderId = 0;
class EnvironmentVariableCollection {
    constructor(serialized) {
        this.map = new Map();
        this._persistent = true;
        this.onDidChangeCollectionEmitter = new event_1.Emitter();
        this.onDidChangeCollection = this.onDidChangeCollectionEmitter.event;
        this.map = new Map(serialized);
    }
    get description() { return this._description; }
    set description(value) {
        this._description = value;
        this.onDidChangeCollectionEmitter.fire();
    }
    get persistent() { return this._persistent; }
    set persistent(value) {
        this._persistent = value;
        this.onDidChangeCollectionEmitter.fire();
    }
    get size() {
        return this.map.size;
    }
    replace(variable, value) {
        this._setIfDiffers(variable, { value, type: types_impl_1.EnvironmentVariableMutatorType.Replace });
    }
    append(variable, value) {
        this._setIfDiffers(variable, { value, type: types_impl_1.EnvironmentVariableMutatorType.Append });
    }
    prepend(variable, value) {
        this._setIfDiffers(variable, { value, type: types_impl_1.EnvironmentVariableMutatorType.Prepend });
    }
    _setIfDiffers(variable, mutator) {
        const current = this.map.get(variable);
        if (!current || current.value !== mutator.value || current.type !== mutator.type) {
            this.map.set(variable, mutator);
            this.onDidChangeCollectionEmitter.fire();
        }
    }
    get(variable) {
        return this.map.get(variable);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach(callback, thisArg) {
        this.map.forEach((value, key) => callback.call(thisArg, key, value, this));
    }
    delete(variable) {
        this.map.delete(variable);
        this.onDidChangeCollectionEmitter.fire();
    }
    clear() {
        this.map.clear();
        this.onDidChangeCollectionEmitter.fire();
    }
}
exports.EnvironmentVariableCollection = EnvironmentVariableCollection;
class TerminalExtImpl {
    constructor(proxy, options) {
        this.proxy = proxy;
        this.options = options;
        this.id = new promise_util_1.Deferred();
        this.deferredProcessId = new promise_util_1.Deferred();
        this.state = { isInteractedWith: false };
        this.creationOptions = this.options;
    }
    get processId() {
        return this.deferredProcessId.promise;
    }
    sendText(text, addNewLine = true) {
        this.id.promise.then(id => this.proxy.$sendText(id, text, addNewLine));
    }
    show(preserveFocus) {
        this.id.promise.then(id => this.proxy.$show(id, preserveFocus));
    }
    hide() {
        this.id.promise.then(id => this.proxy.$hide(id));
    }
    dispose() {
        this.id.promise.then(id => this.proxy.$dispose(id));
    }
}
exports.TerminalExtImpl = TerminalExtImpl;
class PseudoTerminal {
    constructor(id, proxy, pseudoTerminal, waitOnExit) {
        this.proxy = proxy;
        this.pseudoTerminal = pseudoTerminal;
        pseudoTerminal.onDidWrite(data => {
            if (typeof id === 'string') {
                this.proxy.$write(id, data);
            }
            else {
                this.proxy.$writeByTerminalId(id, data);
            }
        });
        if (pseudoTerminal.onDidClose) {
            pseudoTerminal.onDidClose((e = undefined) => {
                if (typeof id === 'string') {
                    this.proxy.$dispose(id);
                }
                else {
                    this.proxy.$disposeByTerminalId(id, waitOnExit);
                }
            });
        }
        if (pseudoTerminal.onDidOverrideDimensions) {
            pseudoTerminal.onDidOverrideDimensions(e => {
                if (e) {
                    if (typeof id === 'string') {
                        this.proxy.$resize(id, e.columns, e.rows);
                    }
                    else {
                        this.proxy.$resizeByTerminalId(id, e.columns, e.rows);
                    }
                }
            });
        }
        if (pseudoTerminal.onDidChangeName) {
            pseudoTerminal.onDidChangeName(name => {
                if (typeof id === 'string') {
                    this.proxy.$setName(id, name);
                }
                else {
                    this.proxy.$setNameByTerminalId(id, name);
                }
            });
        }
    }
    emitOnClose() {
        this.pseudoTerminal.close();
    }
    emitOnInput(data) {
        if (this.pseudoTerminal.handleInput) {
            this.pseudoTerminal.handleInput(data);
        }
    }
    emitOnOpen(cols, rows) {
        this.pseudoTerminal.open({
            rows,
            columns: cols,
        });
    }
    emitOnResize(cols, rows) {
        if (this.pseudoTerminal.setDimensions) {
            this.pseudoTerminal.setDimensions({ columns: cols, rows });
        }
    }
}
exports.PseudoTerminal = PseudoTerminal;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/plugin/terminal-ext'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_plugin-ext_lib_common_collections_js-packages_plugin-ext_lib_common_connection_js-pa-6a01d2.js.map