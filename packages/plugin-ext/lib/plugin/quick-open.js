"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const event_1 = require("@theia/core/lib/common/event");
const disposable_1 = require("@theia/core/lib/common/disposable");
const types_impl_1 = require("./types-impl");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const path = require("path");
const type_converters_1 = require("./type-converters");
const plugin_protocol_1 = require("../common/plugin-protocol");
const severity_1 = require("@theia/monaco-editor-core/esm/vs/base/common/severity");
const themeService_1 = require("@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService");
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
//# sourceMappingURL=quick-open.js.map