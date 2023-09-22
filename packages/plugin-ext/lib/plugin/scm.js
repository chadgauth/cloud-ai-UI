"use strict";
// *****************************************************************************
// Copyright (C) 2019-2021 Red Hat, Inc. and others.
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
exports.ScmExtImpl = exports.ScmInputBoxImpl = void 0;
const event_1 = require("@theia/core/lib/common/event");
const common_1 = require("../common");
const disposable_1 = require("@theia/core/lib/common/disposable");
const types_impl_1 = require("./types-impl");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const paths_1 = require("@theia/core/lib/common/paths");
const plugin_icon_path_1 = require("./plugin-icon-path");
function getIconResource(decorations) {
    if (!decorations || !decorations.iconPath) {
        return undefined;
    }
    else if (typeof decorations.iconPath === 'string') {
        return types_impl_1.URI.file(decorations.iconPath);
    }
    else if (types_impl_1.URI.isUri(decorations.iconPath)) {
        return decorations.iconPath;
    }
    else if (types_impl_1.ThemeIcon.is(decorations.iconPath)) {
        return decorations.iconPath;
    }
    else {
        console.warn(`Unexpected Value ${decorations.iconPath} in Source Control Resource Themable Decoration. URI, ThemeIcon or string expected.`);
        return undefined;
    }
}
function comparePaths(one, other, caseSensitive = false) {
    const oneParts = one.split(paths_1.sep);
    const otherParts = other.split(paths_1.sep);
    const lastOne = oneParts.length - 1;
    const lastOther = otherParts.length - 1;
    let endOne;
    let endOther;
    for (let i = 0;; i++) {
        endOne = lastOne === i;
        endOther = lastOther === i;
        if (endOne && endOther) {
            const onePart = caseSensitive ? oneParts[i].toLocaleLowerCase() : oneParts[i];
            const otherPart = caseSensitive ? otherParts[i].toLocaleLowerCase() : otherParts[i];
            return onePart > otherPart ? -1 : 1;
        }
        else if (endOne) {
            return -1;
        }
        else if (endOther) {
            return 1;
        }
        if (endOne) {
            return -1;
        }
        else if (endOther) {
            return 1;
        }
        const result = comparePathComponents(oneParts[i], otherParts[i], caseSensitive);
        if (result !== 0) {
            return result;
        }
    }
}
function comparePathComponents(one, other, caseSensitive = false) {
    if (!caseSensitive) {
        one = one && one.toLowerCase();
        other = other && other.toLowerCase();
    }
    if (one === other) {
        return 0;
    }
    return one < other ? -1 : 1;
}
function compareResourceThemableDecorations(a, b) {
    if (!a.iconPath && !b.iconPath) {
        return 0;
    }
    else if (!a.iconPath) {
        return -1;
    }
    else if (!b.iconPath) {
        return 1;
    }
    const aPath = typeof a.iconPath === 'string' ? a.iconPath : types_impl_1.URI.isUri(a.iconPath) ? a.iconPath.fsPath : a.iconPath.id;
    const bPath = typeof b.iconPath === 'string' ? b.iconPath : types_impl_1.URI.isUri(b.iconPath) ? b.iconPath.fsPath : b.iconPath.id;
    return comparePaths(aPath, bPath);
}
function compareResourceStatesDecorations(a, b) {
    let result = 0;
    if (a.strikeThrough !== b.strikeThrough) {
        return a.strikeThrough ? 1 : -1;
    }
    if (a.faded !== b.faded) {
        return a.faded ? 1 : -1;
    }
    if (a.tooltip !== b.tooltip) {
        return (a.tooltip || '').localeCompare(b.tooltip || '');
    }
    result = compareResourceThemableDecorations(a, b);
    if (result !== 0) {
        return result;
    }
    if (a.light && b.light) {
        result = compareResourceThemableDecorations(a.light, b.light);
    }
    else if (a.light) {
        return 1;
    }
    else if (b.light) {
        return -1;
    }
    if (result !== 0) {
        return result;
    }
    if (a.dark && b.dark) {
        result = compareResourceThemableDecorations(a.dark, b.dark);
    }
    else if (a.dark) {
        return 1;
    }
    else if (b.dark) {
        return -1;
    }
    return result;
}
function compareCommands(a, b) {
    if (a.command !== b.command) {
        return a.command < b.command ? -1 : 1;
    }
    if (a.title !== b.title) {
        return a.title < b.title ? -1 : 1;
    }
    if (a.tooltip !== b.tooltip) {
        if (a.tooltip !== undefined && b.tooltip !== undefined) {
            return a.tooltip < b.tooltip ? -1 : 1;
        }
        else if (a.tooltip !== undefined) {
            return 1;
        }
        else if (b.tooltip !== undefined) {
            return -1;
        }
    }
    if (a.arguments === b.arguments) {
        return 0;
    }
    else if (!a.arguments) {
        return -1;
    }
    else if (!b.arguments) {
        return 1;
    }
    else if (a.arguments.length !== b.arguments.length) {
        return a.arguments.length - b.arguments.length;
    }
    for (let i = 0; i < a.arguments.length; i++) {
        const aArg = a.arguments[i];
        const bArg = b.arguments[i];
        if (aArg === bArg) {
            continue;
        }
        return aArg < bArg ? -1 : 1;
    }
    return 0;
}
function compareResourceStates(a, b) {
    let result = comparePaths(a.resourceUri.fsPath, b.resourceUri.fsPath, true);
    if (result !== 0) {
        return result;
    }
    if (a.command && b.command) {
        result = compareCommands(a.command, b.command);
    }
    else if (a.command) {
        return 1;
    }
    else if (b.command) {
        return -1;
    }
    if (result !== 0) {
        return result;
    }
    if (a.decorations && b.decorations) {
        result = compareResourceStatesDecorations(a.decorations, b.decorations);
    }
    else if (a.decorations) {
        return 1;
    }
    else if (b.decorations) {
        return -1;
    }
    return result;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compareArgs(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
function commandEquals(a, b) {
    return a.command === b.command
        && a.title === b.title
        && a.tooltip === b.tooltip
        && (a.arguments && b.arguments ? compareArgs(a.arguments, b.arguments) : a.arguments === b.arguments);
}
function commandListEquals(a, b) {
    return equals(a, b, commandEquals);
}
function equals(one, other, itemEquals = (a, b) => a === b) {
    if (one === other) {
        return true;
    }
    if (!one || !other) {
        return false;
    }
    if (one.length !== other.length) {
        return false;
    }
    for (let i = 0, len = one.length; i < len; i++) {
        if (!itemEquals(one[i], other[i])) {
            return false;
        }
    }
    return true;
}
class ScmInputBoxImpl {
    constructor(plugin, proxy, sourceControlHandle) {
        this.plugin = plugin;
        this.proxy = proxy;
        this.sourceControlHandle = sourceControlHandle;
        this._value = '';
        this.onDidChangeEmitter = new event_1.Emitter();
        this._placeholder = '';
        this._visible = true;
        // noop
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this.proxy.$setInputBoxValue(this.sourceControlHandle, value);
        this.updateValue(value);
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(placeholder) {
        this.proxy.$setInputBoxPlaceholder(this.sourceControlHandle, placeholder);
        this._placeholder = placeholder;
    }
    get visible() {
        return this._visible;
    }
    set visible(visible) {
        this.proxy.$setInputBoxVisible(this.sourceControlHandle, visible);
        this._visible = visible;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(enabled) {
        this.proxy.$setInputBoxEnabled(this.sourceControlHandle, enabled);
        this._enabled = enabled;
    }
    get validateInput() {
        return this._validateInput;
    }
    set validateInput(fn) {
        if (fn && typeof fn !== 'function') {
            throw new Error(`[${this.plugin.model.id}]: Invalid SCM input box validation function`);
        }
        this._validateInput = fn;
    }
    onInputBoxValueChange(value) {
        this.updateValue(value);
    }
    updateValue(value) {
        this._value = value;
        this.onDidChangeEmitter.fire(value);
    }
}
exports.ScmInputBoxImpl = ScmInputBoxImpl;
class ScmResourceGroupImpl {
    constructor(proxy, commands, sourceControlHandle, plugin, _id, _label) {
        this.proxy = proxy;
        this.commands = commands;
        this.sourceControlHandle = sourceControlHandle;
        this.plugin = plugin;
        this._id = _id;
        this._label = _label;
        this.resourceHandlePool = 0;
        this._resourceStates = [];
        this.resourceStatesMap = new Map();
        this.resourceStatesCommandsMap = new Map();
        this.resourceStatesDisposablesMap = new Map();
        this.onDidUpdateResourceStatesEmitter = new event_1.Emitter();
        this.onDidUpdateResourceStates = this.onDidUpdateResourceStatesEmitter.event;
        this._disposed = false;
        this.onDidDisposeEmitter = new event_1.Emitter();
        this.onDidDispose = this.onDidDisposeEmitter.event;
        this.handlesSnapshot = [];
        this.resourceSnapshot = [];
        this._hideWhenEmpty = undefined;
        this.handle = ScmResourceGroupImpl.handlePool++;
    }
    get disposed() { return this._disposed; }
    get id() { return this._id; }
    get label() { return this._label; }
    set label(label) {
        this._label = label;
        this.proxy.$updateGroupLabel(this.sourceControlHandle, this.handle, label);
    }
    get hideWhenEmpty() { return this._hideWhenEmpty; }
    set hideWhenEmpty(hideWhenEmpty) {
        this._hideWhenEmpty = hideWhenEmpty;
        this.proxy.$updateGroup(this.sourceControlHandle, this.handle, this.features);
    }
    get features() {
        return {
            hideWhenEmpty: this.hideWhenEmpty
        };
    }
    get resourceStates() { return [...this._resourceStates]; }
    set resourceStates(resources) {
        this._resourceStates = [...resources];
        this.onDidUpdateResourceStatesEmitter.fire();
    }
    getResourceState(handle) {
        return this.resourceStatesMap.get(handle);
    }
    executeResourceCommand(handle) {
        const command = this.resourceStatesCommandsMap.get(handle);
        if (!command) {
            return Promise.resolve(undefined);
        }
        return new Promise(() => this.commands.executeCommand(command.command, ...(command.arguments || [])));
    }
    takeResourceStateSnapshot() {
        var _a;
        const snapshot = [...this._resourceStates];
        const diffs = sortedDiff(this.resourceSnapshot, snapshot, compareResourceStates);
        const splices = diffs.map(diff => {
            const toInsert = diff.toInsert.map(r => {
                const handle = this.resourceHandlePool++;
                this.resourceStatesMap.set(handle, r);
                const sourceUri = r.resourceUri;
                const icon = getIconResource(r.decorations);
                const lightIcon = r.decorations && getIconResource(r.decorations.light) || icon;
                const darkIcon = r.decorations && getIconResource(r.decorations.dark) || icon;
                const icons = [this.getThemableIcon(lightIcon), this.getThemableIcon(darkIcon)];
                let command;
                if (r.command) {
                    if (r.command.command === 'theia.open' || r.command.command === 'theia.diff') {
                        const disposables = new disposable_1.DisposableCollection();
                        command = this.commands.converter.toSafeCommand(r.command, disposables);
                        this.resourceStatesDisposablesMap.set(handle, disposables);
                    }
                    else {
                        this.resourceStatesCommandsMap.set(handle, r.command);
                    }
                }
                const tooltip = (r.decorations && r.decorations.tooltip) || '';
                const strikeThrough = r.decorations && !!r.decorations.strikeThrough;
                const faded = r.decorations && !!r.decorations.faded;
                const contextValue = r.contextValue || '';
                // TODO remove the letter and colorId fields when the FileDecorationProvider is applied, see https://github.com/eclipse-theia/theia/pull/8911
                const rawResource = {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    handle, sourceUri, letter: r.letter, colorId: r.color.id, icons,
                    tooltip, strikeThrough, faded, contextValue, command
                };
                return { rawResource, handle };
            });
            const { start, deleteCount } = diff;
            return { start, deleteCount, toInsert };
        });
        const rawResourceSplices = splices
            .map(({ start, deleteCount, toInsert }) => ({
            start: start,
            deleteCount: deleteCount,
            rawResources: toInsert.map(i => i.rawResource)
        }));
        const reverseSplices = splices.reverse();
        for (const { start, deleteCount, toInsert } of reverseSplices) {
            const handles = toInsert.map(i => i.handle);
            const handlesToDelete = this.handlesSnapshot.splice(start, deleteCount, ...handles);
            for (const handle of handlesToDelete) {
                this.resourceStatesMap.delete(handle);
                this.resourceStatesCommandsMap.delete(handle);
                (_a = this.resourceStatesDisposablesMap.get(handle)) === null || _a === void 0 ? void 0 : _a.dispose();
                this.resourceStatesDisposablesMap.delete(handle);
            }
        }
        this.resourceSnapshot = snapshot;
        return rawResourceSplices;
    }
    getThemableIcon(icon) {
        if (!icon) {
            return undefined;
        }
        else if (types_impl_1.ThemeIcon.is(icon)) {
            return icon;
        }
        return plugin_icon_path_1.PluginIconPath.asString(types_impl_1.URI.revive(icon), this.plugin);
    }
    dispose() {
        this._disposed = true;
        this.onDidDisposeEmitter.fire();
    }
}
ScmResourceGroupImpl.handlePool = 0;
class SourceControlImpl {
    constructor(plugin, proxy, commands, _id, _label, _rootUri) {
        this.plugin = plugin;
        this.proxy = proxy;
        this.commands = commands;
        this._id = _id;
        this._label = _label;
        this._rootUri = _rootUri;
        this.groups = new Map();
        this._count = undefined;
        this._quickDiffProvider = undefined;
        this._commitTemplate = undefined;
        this.acceptInputDisposables = new disposable_1.DisposableCollection();
        this._acceptInputCommand = undefined;
        this._statusBarDisposables = new disposable_1.DisposableCollection();
        this._statusBarCommands = undefined;
        this._selected = false;
        this.onDidChangeSelectionEmitter = new event_1.Emitter();
        this.onDidChangeSelection = this.onDidChangeSelectionEmitter.event;
        this.handle = SourceControlImpl.handlePool++;
        this.createdResourceGroups = new Map();
        this.updatedResourceGroups = new Set();
        this._inputBox = new ScmInputBoxImpl(plugin, this.proxy, this.handle);
        this.proxy.$registerSourceControl(this.handle, _id, _label, _rootUri);
    }
    get id() {
        return this._id;
    }
    get label() {
        return this._label;
    }
    get rootUri() {
        return this._rootUri;
    }
    get inputBox() { return this._inputBox; }
    get count() {
        return this._count;
    }
    set count(count) {
        if (this._count === count) {
            return;
        }
        this._count = count;
        this.proxy.$updateSourceControl(this.handle, { count });
    }
    get quickDiffProvider() {
        return this._quickDiffProvider;
    }
    set quickDiffProvider(quickDiffProvider) {
        this._quickDiffProvider = quickDiffProvider;
        this.proxy.$updateSourceControl(this.handle, { hasQuickDiffProvider: !!quickDiffProvider });
    }
    get commitTemplate() {
        return this._commitTemplate;
    }
    set commitTemplate(commitTemplate) {
        if (commitTemplate === this._commitTemplate) {
            return;
        }
        this._commitTemplate = commitTemplate;
        this.proxy.$updateSourceControl(this.handle, { commitTemplate });
    }
    get acceptInputCommand() {
        return this._acceptInputCommand;
    }
    set acceptInputCommand(acceptInputCommand) {
        this.acceptInputDisposables = new disposable_1.DisposableCollection();
        this._acceptInputCommand = acceptInputCommand;
        const internal = this.commands.converter.toSafeCommand(acceptInputCommand, this.acceptInputDisposables);
        this.proxy.$updateSourceControl(this.handle, { acceptInputCommand: internal });
    }
    get statusBarCommands() {
        return this._statusBarCommands;
    }
    set statusBarCommands(statusBarCommands) {
        if (this._statusBarCommands && statusBarCommands && commandListEquals(this._statusBarCommands, statusBarCommands)) {
            return;
        }
        this._statusBarDisposables = new disposable_1.DisposableCollection();
        this._statusBarCommands = statusBarCommands;
        const internal = (statusBarCommands || []).map(c => this.commands.converter.toSafeCommand(c, this._statusBarDisposables));
        this.proxy.$updateSourceControl(this.handle, { statusBarCommands: internal });
    }
    get selected() {
        return this._selected;
    }
    createResourceGroup(id, label) {
        const group = new ScmResourceGroupImpl(this.proxy, this.commands, this.handle, this.plugin, id, label);
        const disposable = group.onDidDispose(() => this.createdResourceGroups.delete(group));
        this.createdResourceGroups.set(group, disposable);
        this.eventuallyAddResourceGroups();
        return group;
    }
    eventuallyAddResourceGroups() {
        const groups = [];
        const splices = [];
        for (const [group, disposable] of this.createdResourceGroups) {
            disposable.dispose();
            const updateListener = group.onDidUpdateResourceStates(() => {
                this.updatedResourceGroups.add(group);
                this.eventuallyUpdateResourceStates();
            });
            group.onDidDispose(() => {
                this.updatedResourceGroups.delete(group);
                updateListener.dispose();
                this.groups.delete(group.handle);
                this.proxy.$unregisterGroup(this.handle, group.handle);
            });
            const { handle, id, label, features } = group;
            groups.push({ handle, id, label, features });
            const snapshot = group.takeResourceStateSnapshot();
            if (snapshot.length > 0) {
                splices.push({ handle: group.handle, splices: snapshot });
            }
            this.groups.set(group.handle, group);
        }
        this.proxy.$registerGroups(this.handle, groups, splices);
        this.createdResourceGroups.clear();
    }
    eventuallyUpdateResourceStates() {
        const splices = [];
        this.updatedResourceGroups.forEach(group => {
            const snapshot = group.takeResourceStateSnapshot();
            if (snapshot.length === 0) {
                return;
            }
            splices.push({ handle: group.handle, splices: snapshot });
        });
        if (splices.length > 0) {
            this.proxy.$spliceResourceStates(this.handle, splices);
        }
        this.updatedResourceGroups.clear();
    }
    getResourceGroup(handle) {
        return this.groups.get(handle);
    }
    setSelectionState(selected) {
        this._selected = selected;
        this.onDidChangeSelectionEmitter.fire(selected);
    }
    dispose() {
        this.acceptInputDisposables.dispose();
        this._statusBarDisposables.dispose();
        this.groups.forEach(group => group.dispose());
        this.proxy.$unregisterSourceControl(this.handle);
    }
}
SourceControlImpl.handlePool = 0;
class ScmExtImpl {
    constructor(rpc, commands) {
        this.commands = commands;
        this.sourceControls = new Map();
        this.sourceControlsByExtension = new Map();
        this.onDidChangeActiveProviderEmitter = new event_1.Emitter();
        this.proxy = rpc.getProxy(common_1.PLUGIN_RPC_CONTEXT.SCM_MAIN);
        commands.registerArgumentProcessor({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            processArgument: (arg) => {
                if (!plugin_api_rpc_1.ScmCommandArg.is(arg)) {
                    return arg;
                }
                const sourceControl = this.sourceControls.get(arg.sourceControlHandle);
                if (!sourceControl) {
                    return undefined;
                }
                if (typeof arg.resourceGroupHandle !== 'number') {
                    return sourceControl;
                }
                const resourceGroup = sourceControl.getResourceGroup(arg.resourceGroupHandle);
                if (typeof arg.resourceStateHandle !== 'number') {
                    return resourceGroup;
                }
                return resourceGroup && resourceGroup.getResourceState(arg.resourceStateHandle);
            }
        });
    }
    get onDidChangeActiveProvider() { return this.onDidChangeActiveProviderEmitter.event; }
    createSourceControl(extension, id, label, rootUri) {
        const handle = ScmExtImpl.handlePool++;
        const sourceControl = new SourceControlImpl(extension, this.proxy, this.commands, id, label, rootUri);
        this.sourceControls.set(handle, sourceControl);
        const sourceControls = this.sourceControlsByExtension.get(extension.model.id) || [];
        sourceControls.push(sourceControl);
        this.sourceControlsByExtension.set(extension.model.id, sourceControls);
        return sourceControl;
    }
    getLastInputBox(extension) {
        const sourceControls = this.sourceControlsByExtension.get(extension.model.id);
        const sourceControl = sourceControls && sourceControls[sourceControls.length - 1];
        return sourceControl && sourceControl.inputBox;
    }
    $provideOriginalResource(sourceControlHandle, uriComponents, token) {
        const sourceControl = this.sourceControls.get(sourceControlHandle);
        if (!sourceControl || !sourceControl.quickDiffProvider || !sourceControl.quickDiffProvider.provideOriginalResource) {
            return Promise.resolve(undefined);
        }
        return new Promise(() => sourceControl.quickDiffProvider.provideOriginalResource(types_impl_1.URI.file(uriComponents), token))
            .then(r => r || undefined);
    }
    $onInputBoxValueChange(sourceControlHandle, value) {
        const sourceControl = this.sourceControls.get(sourceControlHandle);
        if (!sourceControl) {
            return Promise.resolve(undefined);
        }
        sourceControl.inputBox.onInputBoxValueChange(value);
        return Promise.resolve(undefined);
    }
    $executeResourceCommand(sourceControlHandle, groupHandle, handle) {
        const sourceControl = this.sourceControls.get(sourceControlHandle);
        if (!sourceControl) {
            return Promise.resolve(undefined);
        }
        const group = sourceControl.getResourceGroup(groupHandle);
        if (!group) {
            return Promise.resolve(undefined);
        }
        return group.executeResourceCommand(handle);
    }
    async $validateInput(sourceControlHandle, value, cursorPosition) {
        const sourceControl = this.sourceControls.get(sourceControlHandle);
        if (!sourceControl) {
            return Promise.resolve(undefined);
        }
        if (!sourceControl.inputBox.validateInput) {
            return Promise.resolve(undefined);
        }
        const result = await sourceControl.inputBox.validateInput(value, cursorPosition);
        if (!result) {
            return Promise.resolve(undefined);
        }
        return [result.message, result.type];
    }
    $setSelectedSourceControl(selectedSourceControlHandle) {
        var _a, _b;
        if (selectedSourceControlHandle !== undefined) {
            (_a = this.sourceControls.get(selectedSourceControlHandle)) === null || _a === void 0 ? void 0 : _a.setSelectionState(true);
        }
        if (this.selectedSourceControlHandle !== undefined) {
            (_b = this.sourceControls.get(this.selectedSourceControlHandle)) === null || _b === void 0 ? void 0 : _b.setSelectionState(false);
        }
        this.selectedSourceControlHandle = selectedSourceControlHandle;
        return Promise.resolve(undefined);
    }
}
exports.ScmExtImpl = ScmExtImpl;
ScmExtImpl.handlePool = 0;
/**
 * Diffs two *sorted* arrays and computes the splices which apply the diff.
 */
function sortedDiff(before, after, compare) {
    const result = [];
    function pushSplice(start, deleteCount, toInsert) {
        if (deleteCount === 0 && toInsert.length === 0) {
            return;
        }
        const latest = result[result.length - 1];
        if (latest && latest.start + latest.deleteCount === start) {
            latest.deleteCount += deleteCount;
            latest.toInsert.push(...toInsert);
        }
        else {
            result.push({ start, deleteCount, toInsert });
        }
    }
    let beforeIdx = 0;
    let afterIdx = 0;
    while (true) {
        if (beforeIdx === before.length) {
            pushSplice(beforeIdx, 0, after.slice(afterIdx));
            break;
        }
        if (afterIdx === after.length) {
            pushSplice(beforeIdx, before.length - beforeIdx, []);
            break;
        }
        const beforeElement = before[beforeIdx];
        const afterElement = after[afterIdx];
        const n = compare(beforeElement, afterElement);
        if (n === 0) {
            // equal
            beforeIdx += 1;
            afterIdx += 1;
        }
        else if (n < 0) {
            // beforeElement is smaller -> before element removed
            pushSplice(beforeIdx, 1, []);
            beforeIdx += 1;
        }
        else if (n > 0) {
            // beforeElement is greater -> after element added
            pushSplice(beforeIdx, 0, [afterElement]);
            afterIdx += 1;
        }
    }
    return result;
}
//# sourceMappingURL=scm.js.map