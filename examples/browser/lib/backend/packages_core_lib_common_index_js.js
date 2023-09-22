exports.id = "packages_core_lib_common_index_js";
exports.ids = ["packages_core_lib_common_index_js"];
exports.modules = {

/***/ "../../dev-packages/application-package/lib/environment.js":
/*!*****************************************************************!*\
  !*** ../../dev-packages/application-package/lib/environment.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.environment = void 0;
const isElectron = __webpack_require__(/*! is-electron */ "../../node_modules/is-electron/index.js");
/**
 * The electron specific environment.
 */
class ElectronEnv {
    constructor() {
        /**
         * Environment variable that can be accessed on the `process` to check if running in electron or not.
         */
        this.THEIA_ELECTRON_VERSION = 'THEIA_ELECTRON_VERSION';
    }
    /**
     * `true` if running in electron. Otherwise, `false`.
     *
     * Can be called from both the `main` and the render process. Also works for forked cluster workers.
     */
    is() {
        return isElectron();
    }
    /**
     * `true` if running in Electron in development mode. Otherwise, `false`.
     *
     * Cannot be used from the browser. From the browser, it is always `false`.
     */
    isDevMode() {
        return this.is()
            && typeof process !== 'undefined'
            // `defaultApp` does not exist on the Node.js API, but on electron (`electron.d.ts`).
            && (process.defaultApp || /node_modules[/\\]electron[/\\]/.test(process.execPath)); // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    /**
     * Creates and return with a new environment object which always contains the `ELECTRON_RUN_AS_NODE: 1` property pair.
     * This should be used to `spawn` and `fork` a new Node.js process from the Node.js shipped with Electron. Otherwise, a new Electron
     * process will be spawned which [has side-effects](https://github.com/eclipse-theia/theia/issues/5385).
     *
     * If called from the backend and the `env` argument is not defined, it falls back to `process.env` such as Node.js behaves
     * with the [`SpawnOptions`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).
     * If `env` is defined, it will be shallow-copied.
     *
     * Calling this function from the frontend does not make any sense, hence throw an error.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runAsNodeEnv(env) {
        if (typeof process === 'undefined') {
            throw new Error("'process' cannot be undefined.");
        }
        return {
            ...(env === undefined ? process.env : env),
            ELECTRON_RUN_AS_NODE: 1
        };
    }
}
const electron = new ElectronEnv();
const environment = { electron };
exports.environment = environment;


/***/ }),

/***/ "../../packages/core/lib/common/application-error.js":
/*!***********************************************************!*\
  !*** ../../packages/core/lib/common/application-error.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.ApplicationError = void 0;
var ApplicationError;
(function (ApplicationError) {
    const codes = new Set();
    function declare(code, factory) {
        if (codes.has(code)) {
            throw new Error(`An application error for '${code}' code is already declared`);
        }
        codes.add(code);
        const constructorOpt = Object.assign((...args) => new Impl(code, factory(...args), constructorOpt), {
            code,
            is(arg) {
                return arg instanceof Impl && arg.code === code;
            }
        });
        return constructorOpt;
    }
    ApplicationError.declare = declare;
    function is(arg) {
        return arg instanceof Impl;
    }
    ApplicationError.is = is;
    function fromJson(code, raw) {
        return new Impl(code, raw);
    }
    ApplicationError.fromJson = fromJson;
    class Impl extends Error {
        constructor(code, raw, constructorOpt) {
            super(raw.message);
            this.code = code;
            this.data = raw.data;
            Object.setPrototypeOf(this, Impl.prototype);
            if (raw.stack) {
                this.stack = raw.stack;
            }
            else if (Error.captureStackTrace && constructorOpt) {
                Error.captureStackTrace(this, constructorOpt);
            }
        }
        toJson() {
            const { message, data, stack } = this;
            return { message, data, stack };
        }
    }
})(ApplicationError = exports.ApplicationError || (exports.ApplicationError = {}));


/***/ }),

/***/ "../../packages/core/lib/common/array-utils.js":
/*!*****************************************************!*\
  !*** ../../packages/core/lib/common/array-utils.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
exports.ArrayUtils = void 0;
var ArrayUtils;
(function (ArrayUtils) {
    ArrayUtils.TailImpl = {
        tail() {
            return this[this.length - 1];
        },
    };
    ArrayUtils.HeadAndChildrenImpl = {
        head() {
            return this[0];
        },
        children() {
            return Object.assign(this.slice(1), ArrayUtils.TailImpl);
        }
    };
    function asTail(array) {
        return Object.assign(array, ArrayUtils.TailImpl);
    }
    ArrayUtils.asTail = asTail;
    function asHeadAndTail(array) {
        return Object.assign(array, ArrayUtils.HeadAndChildrenImpl, ArrayUtils.TailImpl);
    }
    ArrayUtils.asHeadAndTail = asHeadAndTail;
    let Sort;
    (function (Sort) {
        Sort[Sort["LeftBeforeRight"] = -1] = "LeftBeforeRight";
        Sort[Sort["RightBeforeLeft"] = 1] = "RightBeforeLeft";
        Sort[Sort["Equal"] = 0] = "Equal";
    })(Sort = ArrayUtils.Sort || (ArrayUtils.Sort = {}));
    // Copied from https://github.com/microsoft/vscode/blob/9c29becfad5f68270b9b23efeafb147722c5feba/src/vs/base/common/arrays.ts
    /**
     * Performs a binary search algorithm over a sorted collection. Useful for cases
     * when we need to perform a binary search over something that isn't actually an
     * array, and converting data to an array would defeat the use of binary search
     * in the first place.
     *
     * @param length The collection length.
     * @param compareToKey A function that takes an index of an element in the
     *   collection and returns zero if the value at this index is equal to the
     *   search key, a negative number if the value precedes the search key in the
     *   sorting order, or a positive number if the search key precedes the value.
     * @return A non-negative index of an element, if found. If not found, the
     *   result is -(n+1) (or ~n, using bitwise notation), where n is the index
     *   where the key should be inserted to maintain the sorting order.
     */
    function binarySearch2(length, compareToKey) {
        let low = 0;
        let high = length - 1;
        while (low <= high) {
            const mid = ((low + high) / 2) | 0;
            const comp = compareToKey(mid);
            if (comp < 0) {
                low = mid + 1;
            }
            else if (comp > 0) {
                high = mid - 1;
            }
            else {
                return mid;
            }
        }
        return -(low + 1);
    }
    ArrayUtils.binarySearch2 = binarySearch2;
    function partition(array, filter) {
        const pass = [];
        const fail = [];
        array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
        return [pass, fail];
    }
    ArrayUtils.partition = partition;
    /**
     * @returns New array with all falsy values removed. The original array IS NOT modified.
     */
    function coalesce(array) {
        return array.filter(e => !!e);
    }
    ArrayUtils.coalesce = coalesce;
    /**
     * groups array elements through a comparator function
     * @param data array of elements to group
     * @param compare comparator function: return of 0 means should group, anything above means not group
     * @returns array of arrays with grouped elements
     */
    function groupBy(data, compare) {
        const result = [];
        let currentGroup = undefined;
        for (const element of data.slice(0).sort(compare)) {
            if (!currentGroup || compare(currentGroup[0], element) !== 0) {
                currentGroup = [element];
                result.push(currentGroup);
            }
            else {
                currentGroup.push(element);
            }
        }
        return result;
    }
    ArrayUtils.groupBy = groupBy;
})(ArrayUtils = exports.ArrayUtils || (exports.ArrayUtils = {}));


/***/ }),

/***/ "../../packages/core/lib/common/cancellation.js":
/*!******************************************************!*\
  !*** ../../packages/core/lib/common/cancellation.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation and others. All rights reserved.
 *  Licensed under the MIT License. See https://github.com/Microsoft/vscode/blob/master/LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkCancelled = exports.isCancelled = exports.cancelled = exports.CancellationTokenSource = exports.CancellationError = exports.CancellationToken = void 0;
const event_1 = __webpack_require__(/*! ./event */ "../../packages/core/lib/common/event.js");
const types_1 = __webpack_require__(/*! ./types */ "../../packages/core/lib/common/types.js");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shortcutEvent = Object.freeze(Object.assign(function (callback, context) {
    const handle = setTimeout(callback.bind(context), 0);
    return { dispose() { clearTimeout(handle); } };
}, {
    get maxListeners() { return 0; },
    set maxListeners(maxListeners) { }
}));
var CancellationToken;
(function (CancellationToken) {
    CancellationToken.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: event_1.Event.None
    });
    CancellationToken.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: shortcutEvent
    });
    function is(value) {
        return (0, types_1.isObject)(value) && (value === CancellationToken.None
            || value === CancellationToken.Cancelled
            || ((0, types_1.isBoolean)(value.isCancellationRequested) && !!value.onCancellationRequested));
    }
    CancellationToken.is = is;
})(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
class CancellationError extends Error {
    constructor() {
        super('Canceled');
        this.name = this.message;
    }
}
exports.CancellationError = CancellationError;
class MutableToken {
    constructor() {
        this._isCancelled = false;
    }
    cancel() {
        if (!this._isCancelled) {
            this._isCancelled = true;
            if (this._emitter) {
                this._emitter.fire(undefined);
                this._emitter = undefined;
            }
        }
    }
    get isCancellationRequested() {
        return this._isCancelled;
    }
    get onCancellationRequested() {
        if (this._isCancelled) {
            return shortcutEvent;
        }
        if (!this._emitter) {
            this._emitter = new event_1.Emitter();
        }
        return this._emitter.event;
    }
}
class CancellationTokenSource {
    get token() {
        if (!this._token) {
            // be lazy and create the token only when
            // actually needed
            this._token = new MutableToken();
        }
        return this._token;
    }
    cancel() {
        if (!this._token) {
            // save an object by returning the default
            // cancelled token when cancellation happens
            // before someone asks for the token
            this._token = CancellationToken.Cancelled;
        }
        else if (this._token !== CancellationToken.Cancelled) {
            this._token.cancel();
        }
    }
    dispose() {
        this.cancel();
    }
}
exports.CancellationTokenSource = CancellationTokenSource;
const cancelledMessage = 'Cancelled';
function cancelled() {
    return new Error(cancelledMessage);
}
exports.cancelled = cancelled;
function isCancelled(err) {
    return !!err && err.message === cancelledMessage;
}
exports.isCancelled = isCancelled;
function checkCancelled(token) {
    if (!!token && token.isCancellationRequested) {
        throw cancelled();
    }
}
exports.checkCancelled = checkCancelled;


/***/ }),

/***/ "../../packages/core/lib/common/command.js":
/*!*************************************************!*\
  !*** ../../packages/core/lib/common/command.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommandRegistry = exports.CommandService = exports.commandServicePath = exports.CommandContribution = exports.Command = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const event_1 = __webpack_require__(/*! ./event */ "../../packages/core/lib/common/event.js");
const disposable_1 = __webpack_require__(/*! ./disposable */ "../../packages/core/lib/common/disposable.js");
const contribution_provider_1 = __webpack_require__(/*! ./contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const nls_1 = __webpack_require__(/*! ./nls */ "../../packages/core/lib/common/nls.js");
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const types_1 = __webpack_require__(/*! ./types */ "../../packages/core/lib/common/types.js");
var Command;
(function (Command) {
    /* Determine whether object is a Command */
    function is(arg) {
        return (0, types_1.isObject)(arg) && 'id' in arg;
    }
    Command.is = is;
    /** Utility function to easily translate commands */
    function toLocalizedCommand(command, nlsLabelKey = command.id, nlsCategoryKey) {
        return {
            ...command,
            label: command.label && nls_1.nls.localize(nlsLabelKey, command.label),
            originalLabel: command.label,
            category: nlsCategoryKey && command.category && nls_1.nls.localize(nlsCategoryKey, command.category) || command.category,
            originalCategory: command.category,
        };
    }
    Command.toLocalizedCommand = toLocalizedCommand;
    function toDefaultLocalizedCommand(command) {
        return {
            ...command,
            label: command.label && nls_1.nls.localizeByDefault(command.label),
            originalLabel: command.label,
            category: command.category && nls_1.nls.localizeByDefault(command.category),
            originalCategory: command.category,
        };
    }
    Command.toDefaultLocalizedCommand = toDefaultLocalizedCommand;
    /** Comparator function for when sorting commands */
    function compareCommands(a, b) {
        if (a.label && b.label) {
            const aCommand = (a.category ? `${a.category}: ${a.label}` : a.label).toLowerCase();
            const bCommand = (b.category ? `${b.category}: ${b.label}` : b.label).toLowerCase();
            return (aCommand).localeCompare(bCommand);
        }
        else {
            return 0;
        }
    }
    Command.compareCommands = compareCommands;
    /**
     * Determine if two commands are equal.
     *
     * @param a the first command for comparison.
     * @param b the second command for comparison.
     */
    function equals(a, b) {
        return (a.id === b.id &&
            a.label === b.label &&
            a.iconClass === b.iconClass &&
            a.category === b.category);
    }
    Command.equals = equals;
})(Command = exports.Command || (exports.Command = {}));
exports.CommandContribution = Symbol('CommandContribution');
exports.commandServicePath = '/services/commands';
exports.CommandService = Symbol('CommandService');
/**
 * The command registry manages commands and handlers.
 */
let CommandRegistry = class CommandRegistry {
    constructor(contributionProvider) {
        this.contributionProvider = contributionProvider;
        this._commands = {};
        this._handlers = {};
        this.toUnregisterCommands = new Map();
        // List of recently used commands.
        this._recent = [];
        this.onWillExecuteCommandEmitter = new event_1.Emitter();
        this.onWillExecuteCommand = this.onWillExecuteCommandEmitter.event;
        this.onDidExecuteCommandEmitter = new event_1.Emitter();
        this.onDidExecuteCommand = this.onDidExecuteCommandEmitter.event;
        this.onCommandsChangedEmitter = new event_1.Emitter();
        this.onCommandsChanged = this.onCommandsChangedEmitter.event;
        this.fireDidChange = debounce(() => this.doFireDidChange(), 0);
    }
    onStart() {
        const contributions = this.contributionProvider.getContributions();
        for (const contrib of contributions) {
            contrib.registerCommands(this);
        }
    }
    *getAllCommands() {
        var _a;
        for (const command of Object.values(this._commands)) {
            yield { ...command, handlers: (_a = this._handlers[command.id]) !== null && _a !== void 0 ? _a : [] };
        }
    }
    /**
     * Register the given command and handler if present.
     *
     * Throw if a command is already registered for the given command identifier.
     */
    registerCommand(command, handler) {
        if (this._commands[command.id]) {
            console.warn(`A command ${command.id} is already registered.`);
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection(this.doRegisterCommand(command));
        if (handler) {
            toDispose.push(this.registerHandler(command.id, handler));
        }
        this.toUnregisterCommands.set(command.id, toDispose);
        toDispose.push(disposable_1.Disposable.create(() => this.toUnregisterCommands.delete(command.id)));
        return toDispose;
    }
    doRegisterCommand(command) {
        this._commands[command.id] = command;
        return {
            dispose: () => {
                delete this._commands[command.id];
            }
        };
    }
    unregisterCommand(commandOrId) {
        const id = Command.is(commandOrId) ? commandOrId.id : commandOrId;
        const toUnregister = this.toUnregisterCommands.get(id);
        if (toUnregister) {
            toUnregister.dispose();
        }
    }
    /**
     * Register the given handler for the given command identifier.
     *
     * If there is already a handler for the given command
     * then the given handler is registered as more specific, and
     * has higher priority during enablement, visibility and toggle state evaluations.
     */
    registerHandler(commandId, handler) {
        let handlers = this._handlers[commandId];
        if (!handlers) {
            this._handlers[commandId] = handlers = [];
        }
        handlers.unshift(handler);
        this.fireDidChange();
        return {
            dispose: () => {
                const idx = handlers.indexOf(handler);
                if (idx >= 0) {
                    handlers.splice(idx, 1);
                    this.fireDidChange();
                }
            }
        };
    }
    doFireDidChange() {
        this.onCommandsChangedEmitter.fire();
    }
    /**
     * Test whether there is an active handler for the given command.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isEnabled(command, ...args) {
        return typeof this.getActiveHandler(command, ...args) !== 'undefined';
    }
    /**
     * Test whether there is a visible handler for the given command.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isVisible(command, ...args) {
        return typeof this.getVisibleHandler(command, ...args) !== 'undefined';
    }
    /**
     * Test whether there is a toggled handler for the given command.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isToggled(command, ...args) {
        return typeof this.getToggledHandler(command, ...args) !== 'undefined';
    }
    /**
     * Execute the active handler for the given command and arguments.
     *
     * Reject if a command cannot be executed.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async executeCommand(commandId, ...args) {
        const handler = this.getActiveHandler(commandId, ...args);
        if (handler) {
            await this.fireWillExecuteCommand(commandId, args);
            const result = await handler.execute(...args);
            this.onDidExecuteCommandEmitter.fire({ commandId, args });
            return result;
        }
        throw Object.assign(new Error(`The command '${commandId}' cannot be executed. There are no active handlers available for the command.`), { code: 'NO_ACTIVE_HANDLER' });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fireWillExecuteCommand(commandId, args = []) {
        await event_1.WaitUntilEvent.fire(this.onWillExecuteCommandEmitter, { commandId, args }, 30000);
    }
    /**
     * Get a visible handler for the given command or `undefined`.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getVisibleHandler(commandId, ...args) {
        const handlers = this._handlers[commandId];
        if (handlers) {
            for (const handler of handlers) {
                try {
                    if (!handler.isVisible || handler.isVisible(...args)) {
                        return handler;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        return undefined;
    }
    /**
     * Get an active handler for the given command or `undefined`.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getActiveHandler(commandId, ...args) {
        const handlers = this._handlers[commandId];
        if (handlers) {
            for (const handler of handlers) {
                try {
                    if (!handler.isEnabled || handler.isEnabled(...args)) {
                        return handler;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        return undefined;
    }
    /**
     * Get a toggled handler for the given command or `undefined`.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getToggledHandler(commandId, ...args) {
        const handlers = this._handlers[commandId];
        if (handlers) {
            for (const handler of handlers) {
                try {
                    if (handler.isToggled && handler.isToggled(...args)) {
                        return handler;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        return undefined;
    }
    /**
     * Returns with all handlers for the given command. If the command does not have any handlers,
     * or the command is not registered, returns an empty array.
     */
    getAllHandlers(commandId) {
        const handlers = this._handlers[commandId];
        return handlers ? handlers.slice() : [];
    }
    /**
     * Get all registered commands.
     */
    get commands() {
        return Object.values(this._commands);
    }
    /**
     * Get a command for the given command identifier.
     */
    getCommand(id) {
        return this._commands[id];
    }
    /**
     * Get all registered commands identifiers.
     */
    get commandIds() {
        return Object.keys(this._commands);
    }
    /**
     * Get the list of recently used commands.
     */
    get recent() {
        const commands = [];
        for (const recentId of this._recent) {
            const command = this.getCommand(recentId);
            if (command) {
                commands.push(command);
            }
        }
        return commands;
    }
    /**
     * Set the list of recently used commands.
     * @param commands the list of recently used commands.
     */
    set recent(commands) {
        this._recent = Array.from(new Set(commands.map(e => e.id)));
    }
    /**
     * Adds a command to recently used list.
     * Prioritizes commands that were recently executed to be most recent.
     *
     * @param recent a recent command, or array of recent commands.
     */
    addRecentCommand(recent) {
        for (const recentCommand of Array.isArray(recent) ? recent : [recent]) {
            // Determine if the command currently exists in the recently used list.
            const index = this._recent.findIndex(commandId => commandId === recentCommand.id);
            // If the command exists, remove it from the array so it can later be placed at the top.
            if (index >= 0) {
                this._recent.splice(index, 1);
            }
            // Add the recent command to the beginning of the array (most recent).
            this._recent.unshift(recentCommand.id);
        }
    }
    /**
     * Clear the list of recently used commands.
     */
    clearCommandHistory() {
        this.recent = [];
    }
};
CommandRegistry = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contribution_provider_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.CommandContribution)),
    __metadata("design:paramtypes", [Object])
], CommandRegistry);
exports.CommandRegistry = CommandRegistry;


/***/ }),

/***/ "../../packages/core/lib/common/contribution-filter/contribution-filter-registry.js":
/*!******************************************************************************************!*\
  !*** ../../packages/core/lib/common/contribution-filter/contribution-filter-registry.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 STMicroelectronics and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContributionFilterRegistryImpl = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const contribution_filter_1 = __webpack_require__(/*! ./contribution-filter */ "../../packages/core/lib/common/contribution-filter/contribution-filter.js");
/**
 * Registry of contribution filters.
 *
 * Implement/bind to the `FilterContribution` interface/symbol to register your contribution filters.
 */
let ContributionFilterRegistryImpl = class ContributionFilterRegistryImpl {
    constructor(contributions = []) {
        this.initialized = false;
        this.genericFilters = [];
        this.typeToFilters = new Map();
        for (const contribution of contributions) {
            contribution.registerContributionFilters(this);
        }
        this.initialized = true;
    }
    addFilters(types, filters) {
        if (this.initialized) {
            throw new Error('cannot add filters after initialization is done.');
        }
        else if (types === '*') {
            this.genericFilters.push(...filters);
        }
        else {
            for (const type of types) {
                this.getOrCreate(type).push(...filters);
            }
        }
    }
    applyFilters(toFilter, type) {
        const filters = this.getFilters(type);
        if (filters.length === 0) {
            return toFilter;
        }
        return toFilter.filter(object => filters.every(filter => filter(object)));
    }
    getOrCreate(type) {
        let value = this.typeToFilters.get(type);
        if (value === undefined) {
            this.typeToFilters.set(type, value = []);
        }
        return value;
    }
    getFilters(type) {
        return [
            ...this.typeToFilters.get(type) || [],
            ...this.genericFilters
        ];
    }
};
ContributionFilterRegistryImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.multiInject)(contribution_filter_1.FilterContribution)),
    __param(0, (0, inversify_1.optional)()),
    __metadata("design:paramtypes", [Array])
], ContributionFilterRegistryImpl);
exports.ContributionFilterRegistryImpl = ContributionFilterRegistryImpl;


/***/ }),

/***/ "../../packages/core/lib/common/contribution-filter/contribution-filter.js":
/*!*********************************************************************************!*\
  !*** ../../packages/core/lib/common/contribution-filter/contribution-filter.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 STMicroelectronics and others.
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
exports.FilterContribution = exports.ContributionFilterRegistry = void 0;
exports.ContributionFilterRegistry = Symbol('ContributionFilterRegistry');
exports.FilterContribution = Symbol('FilterContribution');


/***/ }),

/***/ "../../packages/core/lib/common/contribution-filter/filter.js":
/*!********************************************************************!*\
  !*** ../../packages/core/lib/common/contribution-filter/filter.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 STMicroelectronics and others.
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
exports.Filter = void 0;
exports.Filter = Symbol('Filter');


/***/ }),

/***/ "../../packages/core/lib/common/contribution-filter/index.js":
/*!*******************************************************************!*\
  !*** ../../packages/core/lib/common/contribution-filter/index.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 STMicroelectronics and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./contribution-filter */ "../../packages/core/lib/common/contribution-filter/contribution-filter.js"), exports);
__exportStar(__webpack_require__(/*! ./contribution-filter-registry */ "../../packages/core/lib/common/contribution-filter/contribution-filter-registry.js"), exports);
__exportStar(__webpack_require__(/*! ./filter */ "../../packages/core/lib/common/contribution-filter/filter.js"), exports);


/***/ }),

/***/ "../../packages/core/lib/common/contribution-provider.js":
/*!***************************************************************!*\
  !*** ../../packages/core/lib/common/contribution-provider.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindContribution = exports.bindContributionProvider = exports.Bindable = exports.ContributionProvider = void 0;
const contribution_filter_1 = __webpack_require__(/*! ./contribution-filter */ "../../packages/core/lib/common/contribution-filter/index.js");
exports.ContributionProvider = Symbol('ContributionProvider');
class ContainerBasedContributionProvider {
    constructor(serviceIdentifier, container) {
        this.serviceIdentifier = serviceIdentifier;
        this.container = container;
    }
    getContributions(recursive) {
        if (this.services === undefined) {
            const currentServices = [];
            let filterRegistry;
            let currentContainer = this.container;
            // eslint-disable-next-line no-null/no-null
            while (currentContainer !== null) {
                if (currentContainer.isBound(this.serviceIdentifier)) {
                    try {
                        currentServices.push(...currentContainer.getAll(this.serviceIdentifier));
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
                if (filterRegistry === undefined && currentContainer.isBound(contribution_filter_1.ContributionFilterRegistry)) {
                    filterRegistry = currentContainer.get(contribution_filter_1.ContributionFilterRegistry);
                }
                // eslint-disable-next-line no-null/no-null
                currentContainer = recursive === true ? currentContainer.parent : null;
            }
            this.services = filterRegistry ? filterRegistry.applyFilters(currentServices, this.serviceIdentifier) : currentServices;
        }
        return this.services;
    }
}
var Bindable;
(function (Bindable) {
    function isContainer(arg) {
        return typeof arg !== 'function'
            // https://github.com/eclipse-theia/theia/issues/3204#issue-371029654
            // In InversifyJS `4.14.0` containers no longer have a property `guid`.
            && ('guid' in arg || 'parent' in arg);
    }
    Bindable.isContainer = isContainer;
})(Bindable = exports.Bindable || (exports.Bindable = {}));
function bindContributionProvider(bindable, id) {
    const bindingToSyntax = (Bindable.isContainer(bindable) ? bindable.bind(exports.ContributionProvider) : bindable(exports.ContributionProvider));
    bindingToSyntax
        .toDynamicValue(ctx => new ContainerBasedContributionProvider(id, ctx.container))
        .inSingletonScope().whenTargetNamed(id);
}
exports.bindContributionProvider = bindContributionProvider;
/**
 * Helper function to bind a service to a list of contributions easily.
 * @param bindable a Container or the bind function directly.
 * @param service an already bound service to refer the contributions to.
 * @param contributions array of contribution identifiers to bind the service to.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bindContribution(bindable, service, contributions) {
    const bind = Bindable.isContainer(bindable) ? bindable.bind.bind(bindable) : bindable;
    for (const contribution of contributions) {
        bind(contribution).toService(service);
    }
}
exports.bindContribution = bindContribution;


/***/ }),

/***/ "../../packages/core/lib/common/disposable.js":
/*!****************************************************!*\
  !*** ../../packages/core/lib/common/disposable.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.disposableTimeout = exports.DisposableGroup = exports.DisposableCollection = exports.Disposable = void 0;
const event_1 = __webpack_require__(/*! ./event */ "../../packages/core/lib/common/event.js");
const types_1 = __webpack_require__(/*! ./types */ "../../packages/core/lib/common/types.js");
var Disposable;
(function (Disposable) {
    function is(arg) {
        return (0, types_1.isObject)(arg) && (0, types_1.isFunction)(arg.dispose);
    }
    Disposable.is = is;
    function create(func) {
        return { dispose: func };
    }
    Disposable.create = create;
})(Disposable = exports.Disposable || (exports.Disposable = {}));
/**
 * Ensures that every reference to {@link Disposable.NULL} returns a new object,
 * as sharing a disposable between multiple {@link DisposableCollection} can have unexpected side effects
 */
Object.defineProperty(Disposable, 'NULL', {
    configurable: false,
    enumerable: true,
    get() {
        return { dispose: () => { } };
    }
});
class DisposableCollection {
    constructor(...toDispose) {
        this.disposables = [];
        this.onDisposeEmitter = new event_1.Emitter();
        this.disposingElements = false;
        toDispose.forEach(d => this.push(d));
    }
    /**
     * This event is fired only once
     * on first dispose of not empty collection.
     */
    get onDispose() {
        return this.onDisposeEmitter.event;
    }
    checkDisposed() {
        if (this.disposed && !this.disposingElements) {
            this.onDisposeEmitter.fire(undefined);
            this.onDisposeEmitter.dispose();
        }
    }
    get disposed() {
        return this.disposables.length === 0;
    }
    dispose() {
        if (this.disposed || this.disposingElements) {
            return;
        }
        this.disposingElements = true;
        while (!this.disposed) {
            try {
                this.disposables.pop().dispose();
            }
            catch (e) {
                console.error(e);
            }
        }
        this.disposingElements = false;
        this.checkDisposed();
    }
    push(disposable) {
        const disposables = this.disposables;
        disposables.push(disposable);
        const originalDispose = disposable.dispose.bind(disposable);
        const toRemove = Disposable.create(() => {
            const index = disposables.indexOf(disposable);
            if (index !== -1) {
                disposables.splice(index, 1);
            }
            this.checkDisposed();
        });
        disposable.dispose = () => {
            toRemove.dispose();
            disposable.dispose = originalDispose;
            originalDispose();
        };
        return toRemove;
    }
    pushAll(disposables) {
        return disposables.map(disposable => this.push(disposable));
    }
}
exports.DisposableCollection = DisposableCollection;
var DisposableGroup;
(function (DisposableGroup) {
    function canPush(candidate) {
        return Boolean(candidate && candidate.push);
    }
    DisposableGroup.canPush = canPush;
    function canAdd(candidate) {
        return Boolean(candidate && candidate.add);
    }
    DisposableGroup.canAdd = canAdd;
})(DisposableGroup = exports.DisposableGroup || (exports.DisposableGroup = {}));
function disposableTimeout(...args) {
    const handle = setTimeout(...args);
    return { dispose: () => clearTimeout(handle) };
}
exports.disposableTimeout = disposableTimeout;


/***/ }),

/***/ "../../packages/core/lib/common/event.js":
/*!***********************************************!*\
  !*** ../../packages/core/lib/common/event.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AsyncEmitter = exports.WaitUntilEvent = exports.Emitter = exports.Event = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const disposable_1 = __webpack_require__(/*! ./disposable */ "../../packages/core/lib/common/disposable.js");
var Event;
(function (Event) {
    const _disposable = { dispose() { } };
    function getMaxListeners(event) {
        const { maxListeners } = event;
        return typeof maxListeners === 'number' ? maxListeners : 0;
    }
    Event.getMaxListeners = getMaxListeners;
    function setMaxListeners(event, maxListeners) {
        if (typeof event.maxListeners === 'number') {
            return event.maxListeners = maxListeners;
        }
        return maxListeners;
    }
    Event.setMaxListeners = setMaxListeners;
    function addMaxListeners(event, add) {
        if (typeof event.maxListeners === 'number') {
            return event.maxListeners += add;
        }
        return add;
    }
    Event.addMaxListeners = addMaxListeners;
    Event.None = Object.assign(function () { return _disposable; }, {
        get maxListeners() { return 0; },
        set maxListeners(maxListeners) { }
    });
    /**
     * Given an event and a `map` function, returns another event which maps each element
     * through the mapping function.
     */
    function map(event, mapFunc) {
        return Object.assign((listener, thisArgs, disposables) => event(i => listener.call(thisArgs, mapFunc(i)), undefined, disposables), {
            get maxListeners() { return 0; },
            set maxListeners(maxListeners) { }
        });
    }
    Event.map = map;
    function any(...events) {
        return (listener, thisArgs = undefined, disposables) => new disposable_1.DisposableCollection(...events.map(event => event(e => listener.call(thisArgs, e), undefined, disposables)));
    }
    Event.any = any;
})(Event = exports.Event || (exports.Event = {}));
class CallbackList {
    get length() {
        return this._callbacks && this._callbacks.length || 0;
    }
    add(callback, context = undefined, bucket) {
        if (!this._callbacks) {
            this._callbacks = [];
            this._contexts = [];
        }
        this._callbacks.push(callback);
        this._contexts.push(context);
        if (Array.isArray(bucket)) {
            bucket.push({ dispose: () => this.remove(callback, context) });
        }
    }
    remove(callback, context = undefined) {
        if (!this._callbacks) {
            return;
        }
        let foundCallbackWithDifferentContext = false;
        for (let i = 0; i < this._callbacks.length; i++) {
            if (this._callbacks[i] === callback) {
                if (this._contexts[i] === context) {
                    // callback & context match => remove it
                    this._callbacks.splice(i, 1);
                    this._contexts.splice(i, 1);
                    return;
                }
                else {
                    foundCallbackWithDifferentContext = true;
                }
            }
        }
        if (foundCallbackWithDifferentContext) {
            throw new Error('When adding a listener with a context, you should remove it with the same context');
        }
    }
    // tslint:disable-next-line:typedef
    [Symbol.iterator]() {
        if (!this._callbacks) {
            return [][Symbol.iterator]();
        }
        const callbacks = this._callbacks.slice(0);
        const contexts = this._contexts.slice(0);
        return callbacks.map((callback, i) => (...args) => callback.apply(contexts[i], args))[Symbol.iterator]();
    }
    invoke(...args) {
        const ret = [];
        for (const callback of this) {
            try {
                ret.push(callback(...args));
            }
            catch (e) {
                console.error(e);
            }
        }
        return ret;
    }
    isEmpty() {
        return !this._callbacks || this._callbacks.length === 0;
    }
    dispose() {
        this._callbacks = undefined;
        this._contexts = undefined;
    }
}
class Emitter {
    constructor(_options) {
        this._options = _options;
        this._disposed = false;
        this._leakWarnCountdown = 0;
    }
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get event() {
        if (!this._event) {
            this._event = Object.assign((listener, thisArgs, disposables) => {
                if (!this._callbacks) {
                    this._callbacks = new CallbackList();
                }
                if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
                    this._options.onFirstListenerAdd(this);
                }
                this._callbacks.add(listener, thisArgs);
                const removeMaxListenersCheck = this.checkMaxListeners(Event.getMaxListeners(this._event));
                const result = {
                    dispose: () => {
                        if (removeMaxListenersCheck) {
                            removeMaxListenersCheck();
                        }
                        result.dispose = Emitter._noop;
                        if (!this._disposed) {
                            this._callbacks.remove(listener, thisArgs);
                            result.dispose = Emitter._noop;
                            if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                                this._options.onLastListenerRemove(this);
                            }
                        }
                    }
                };
                if (disposable_1.DisposableGroup.canPush(disposables)) {
                    disposables.push(result);
                }
                else if (disposable_1.DisposableGroup.canAdd(disposables)) {
                    disposables.add(result);
                }
                return result;
            }, {
                maxListeners: Emitter.LEAK_WARNING_THRESHHOLD
            });
        }
        return this._event;
    }
    checkMaxListeners(maxListeners) {
        if (maxListeners === 0 || !this._callbacks) {
            return undefined;
        }
        const listenerCount = this._callbacks.length;
        if (listenerCount <= maxListeners) {
            return undefined;
        }
        const popStack = this.pushLeakingStack();
        this._leakWarnCountdown -= 1;
        if (this._leakWarnCountdown <= 0) {
            // only warn on first exceed and then every time the limit
            // is exceeded by 50% again
            this._leakWarnCountdown = maxListeners * 0.5;
            let topStack;
            let topCount = 0;
            this._leakingStacks.forEach((stackCount, stack) => {
                if (!topStack || topCount < stackCount) {
                    topStack = stack;
                    topCount = stackCount;
                }
            });
            // eslint-disable-next-line max-len
            console.warn(`Possible Emitter memory leak detected. ${listenerCount} listeners added. Use event.maxListeners to increase the limit (${maxListeners}). MOST frequent listener (${topCount}):`);
            console.warn(topStack);
        }
        return popStack;
    }
    pushLeakingStack() {
        if (!this._leakingStacks) {
            this._leakingStacks = new Map();
        }
        const stack = new Error().stack.split('\n').slice(3).join('\n');
        const count = (this._leakingStacks.get(stack) || 0);
        this._leakingStacks.set(stack, count + 1);
        return () => this.popLeakingStack(stack);
    }
    popLeakingStack(stack) {
        if (!this._leakingStacks) {
            return;
        }
        const count = (this._leakingStacks.get(stack) || 0);
        this._leakingStacks.set(stack, count - 1);
    }
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(event) {
        if (this._callbacks) {
            return this._callbacks.invoke(event);
        }
    }
    /**
     * Process each listener one by one.
     * Return `false` to stop iterating over the listeners, `true` to continue.
     */
    async sequence(processor) {
        if (this._callbacks) {
            for (const listener of this._callbacks) {
                if (!await processor(listener)) {
                    break;
                }
            }
        }
    }
    dispose() {
        if (this._leakingStacks) {
            this._leakingStacks.clear();
            this._leakingStacks = undefined;
        }
        if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = undefined;
        }
        this._disposed = true;
    }
}
exports.Emitter = Emitter;
Emitter.LEAK_WARNING_THRESHHOLD = 175;
Emitter._noop = function () { };
var WaitUntilEvent;
(function (WaitUntilEvent) {
    /**
     * Fire all listeners in the same tick.
     *
     * Use `AsyncEmitter.fire` to fire listeners async one after another.
     */
    async function fire(emitter, event, timeout, token = cancellation_1.CancellationToken.None) {
        const waitables = [];
        const asyncEvent = Object.assign(event, {
            token,
            waitUntil: (thenable) => {
                if (Object.isFrozen(waitables)) {
                    throw new Error('waitUntil cannot be called asynchronously.');
                }
                waitables.push(thenable);
            }
        });
        try {
            emitter.fire(asyncEvent);
            // Asynchronous calls to `waitUntil` should fail.
            Object.freeze(waitables);
        }
        finally {
            delete asyncEvent['waitUntil'];
        }
        if (!waitables.length) {
            return;
        }
        if (timeout !== undefined) {
            await Promise.race([Promise.all(waitables), new Promise(resolve => setTimeout(resolve, timeout))]);
        }
        else {
            await Promise.all(waitables);
        }
    }
    WaitUntilEvent.fire = fire;
})(WaitUntilEvent = exports.WaitUntilEvent || (exports.WaitUntilEvent = {}));
const cancellation_1 = __webpack_require__(/*! ./cancellation */ "../../packages/core/lib/common/cancellation.js");
class AsyncEmitter extends Emitter {
    /**
     * Fire listeners async one after another.
     */
    fire(event, token = cancellation_1.CancellationToken.None, promiseJoin) {
        const callbacks = this._callbacks;
        if (!callbacks) {
            return Promise.resolve();
        }
        const listeners = [...callbacks];
        if (this.deliveryQueue) {
            return this.deliveryQueue = this.deliveryQueue.then(() => this.deliver(listeners, event, token, promiseJoin));
        }
        return this.deliveryQueue = this.deliver(listeners, event, token, promiseJoin);
    }
    async deliver(listeners, event, token, promiseJoin) {
        for (const listener of listeners) {
            if (token.isCancellationRequested) {
                return;
            }
            const waitables = [];
            const asyncEvent = Object.assign(event, {
                token,
                waitUntil: (thenable) => {
                    if (Object.isFrozen(waitables)) {
                        throw new Error('waitUntil cannot be called asynchronously.');
                    }
                    if (promiseJoin) {
                        thenable = promiseJoin(thenable, listener);
                    }
                    waitables.push(thenable);
                }
            });
            try {
                listener(event);
                // Asynchronous calls to `waitUntil` should fail.
                Object.freeze(waitables);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                delete asyncEvent['waitUntil'];
            }
            if (!waitables.length) {
                return;
            }
            try {
                await Promise.all(waitables);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
exports.AsyncEmitter = AsyncEmitter;


/***/ }),

/***/ "../../packages/core/lib/common/i18n/localization.js":
/*!***********************************************************!*\
  !*** ../../packages/core/lib/common/i18n/localization.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 TypeFox and others.
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
exports.Localization = exports.AsyncLocalizationProvider = exports.localizationPath = void 0;
exports.localizationPath = '/services/i18n';
exports.AsyncLocalizationProvider = Symbol('AsyncLocalizationProvider');
var Localization;
(function (Localization) {
    const formatRegexp = /{([^}]+)}/g;
    function format(message, args) {
        return message.replace(formatRegexp, (match, group) => { var _a; return ((_a = args[group]) !== null && _a !== void 0 ? _a : match); });
    }
    Localization.format = format;
    function localize(localization, key, defaultValue, ...args) {
        let value = defaultValue;
        if (localization) {
            const translation = localization.translations[key];
            if (translation) {
                value = normalize(translation);
            }
        }
        return format(value, args);
    }
    Localization.localize = localize;
    /**
     * This function normalizes values from VSCode's localizations, which often contain additional mnemonics (`&&`).
     * The normalization removes the mnemonics from the input string.
     *
     * @param value Localization value coming from VSCode
     * @returns A normalized localized value
     */
    function normalize(value) {
        return value.replace(/&&/g, '');
    }
    Localization.normalize = normalize;
    function transformKey(key) {
        let nlsKey = key;
        const keySlashIndex = key.lastIndexOf('/');
        if (keySlashIndex >= 0) {
            nlsKey = key.substring(keySlashIndex + 1);
        }
        return nlsKey;
    }
    Localization.transformKey = transformKey;
})(Localization = exports.Localization || (exports.Localization = {}));


/***/ }),

/***/ "../../packages/core/lib/common/index.js":
/*!***********************************************!*\
  !*** ../../packages/core/lib/common/index.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.URI = exports.environment = void 0;
var environment_1 = __webpack_require__(/*! @theia/application-package/lib/environment */ "../../dev-packages/application-package/lib/environment.js");
Object.defineProperty(exports, "environment", ({ enumerable: true, get: function () { return environment_1.environment; } }));
__exportStar(__webpack_require__(/*! ./application-error */ "../../packages/core/lib/common/application-error.js"), exports);
__exportStar(__webpack_require__(/*! ./cancellation */ "../../packages/core/lib/common/cancellation.js"), exports);
__exportStar(__webpack_require__(/*! ./command */ "../../packages/core/lib/common/command.js"), exports);
__exportStar(__webpack_require__(/*! ./contribution-filter */ "../../packages/core/lib/common/contribution-filter/index.js"), exports);
__exportStar(__webpack_require__(/*! ./contribution-provider */ "../../packages/core/lib/common/contribution-provider.js"), exports);
__exportStar(__webpack_require__(/*! ./disposable */ "../../packages/core/lib/common/disposable.js"), exports);
__exportStar(__webpack_require__(/*! ./event */ "../../packages/core/lib/common/event.js"), exports);
__exportStar(__webpack_require__(/*! ./logger */ "../../packages/core/lib/common/logger.js"), exports);
__exportStar(__webpack_require__(/*! ./lsp-types */ "../../packages/core/lib/common/lsp-types.js"), exports);
__exportStar(__webpack_require__(/*! ./menu */ "../../packages/core/lib/common/menu/index.js"), exports);
__exportStar(__webpack_require__(/*! ./message-rpc */ "../../packages/core/lib/common/message-rpc/index.js"), exports);
__exportStar(__webpack_require__(/*! ./message-service */ "../../packages/core/lib/common/message-service.js"), exports);
__exportStar(__webpack_require__(/*! ./message-service-protocol */ "../../packages/core/lib/common/message-service-protocol.js"), exports);
__exportStar(__webpack_require__(/*! ./messaging */ "../../packages/core/lib/common/messaging/index.js"), exports);
__exportStar(__webpack_require__(/*! ./nls */ "../../packages/core/lib/common/nls.js"), exports);
__exportStar(__webpack_require__(/*! ./numbers */ "../../packages/core/lib/common/numbers.js"), exports);
__exportStar(__webpack_require__(/*! ./objects */ "../../packages/core/lib/common/objects.js"), exports);
__exportStar(__webpack_require__(/*! ./os */ "../../packages/core/lib/common/os.js"), exports);
__exportStar(__webpack_require__(/*! ./path */ "../../packages/core/lib/common/path.js"), exports);
__exportStar(__webpack_require__(/*! ./performance */ "../../packages/core/lib/common/performance/index.js"), exports);
__exportStar(__webpack_require__(/*! ./progress-service */ "../../packages/core/lib/common/progress-service.js"), exports);
__exportStar(__webpack_require__(/*! ./progress-service-protocol */ "../../packages/core/lib/common/progress-service-protocol.js"), exports);
__exportStar(__webpack_require__(/*! ./quick-pick-service */ "../../packages/core/lib/common/quick-pick-service.js"), exports);
__exportStar(__webpack_require__(/*! ./reference */ "../../packages/core/lib/common/reference.js"), exports);
__exportStar(__webpack_require__(/*! ./resource */ "../../packages/core/lib/common/resource.js"), exports);
__exportStar(__webpack_require__(/*! ./selection */ "../../packages/core/lib/common/selection.js"), exports);
__exportStar(__webpack_require__(/*! ./selection-service */ "../../packages/core/lib/common/selection-service.js"), exports);
__exportStar(__webpack_require__(/*! ./strings */ "../../packages/core/lib/common/strings.js"), exports);
__exportStar(__webpack_require__(/*! ./telemetry */ "../../packages/core/lib/common/telemetry.js"), exports);
__exportStar(__webpack_require__(/*! ./types */ "../../packages/core/lib/common/types.js"), exports);
var uri_1 = __webpack_require__(/*! ./uri */ "../../packages/core/lib/common/uri.js");
Object.defineProperty(exports, "URI", ({ enumerable: true, get: function () { return uri_1.default; } }));
__exportStar(__webpack_require__(/*! ./view-column */ "../../packages/core/lib/common/view-column.js"), exports);


/***/ }),

/***/ "../../packages/core/lib/common/logger-protocol.js":
/*!*********************************************************!*\
  !*** ../../packages/core/lib/common/logger-protocol.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsoleLogger = exports.LogLevel = exports.rootLoggerName = exports.DispatchingLoggerClient = exports.ILoggerClient = exports.loggerPath = exports.ILoggerServer = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
exports.ILoggerServer = Symbol('ILoggerServer');
exports.loggerPath = '/services/logger';
exports.ILoggerClient = Symbol('ILoggerClient');
let DispatchingLoggerClient = class DispatchingLoggerClient {
    constructor() {
        this.clients = new Set();
    }
    onLogLevelChanged(event) {
        this.clients.forEach(client => client.onLogLevelChanged(event));
    }
};
DispatchingLoggerClient = __decorate([
    (0, inversify_1.injectable)()
], DispatchingLoggerClient);
exports.DispatchingLoggerClient = DispatchingLoggerClient;
exports.rootLoggerName = 'root';
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["FATAL"] = 60] = "FATAL";
    LogLevel[LogLevel["ERROR"] = 50] = "ERROR";
    LogLevel[LogLevel["WARN"] = 40] = "WARN";
    LogLevel[LogLevel["INFO"] = 30] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 20] = "DEBUG";
    LogLevel[LogLevel["TRACE"] = 10] = "TRACE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
(function (LogLevel) {
    LogLevel.strings = new Map([
        [LogLevel.FATAL, 'fatal'],
        [LogLevel.ERROR, 'error'],
        [LogLevel.WARN, 'warn'],
        [LogLevel.INFO, 'info'],
        [LogLevel.DEBUG, 'debug'],
        [LogLevel.TRACE, 'trace']
    ]);
    function toString(level) {
        return LogLevel.strings.get(level);
    }
    LogLevel.toString = toString;
    function fromString(levelStr) {
        for (const pair of LogLevel.strings) {
            if (pair[1] === levelStr) {
                return pair[0];
            }
        }
        return undefined;
    }
    LogLevel.fromString = fromString;
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/* eslint-disable @typescript-eslint/no-explicit-any */
var ConsoleLogger;
(function (ConsoleLogger) {
    const originalConsoleLog = console.log;
    const consoles = new Map([
        [LogLevel.FATAL, console.error],
        [LogLevel.ERROR, console.error],
        [LogLevel.WARN, console.warn],
        [LogLevel.INFO, console.info],
        [LogLevel.DEBUG, console.debug],
        [LogLevel.TRACE, console.trace]
    ]);
    function reset() {
        console.error = consoles.get(LogLevel.ERROR);
        console.warn = consoles.get(LogLevel.WARN);
        console.info = consoles.get(LogLevel.INFO);
        console.debug = consoles.get(LogLevel.DEBUG);
        console.trace = consoles.get(LogLevel.TRACE);
        console.log = originalConsoleLog;
    }
    ConsoleLogger.reset = reset;
    function log(name, logLevel, message, params) {
        const console = consoles.get(logLevel) || originalConsoleLog;
        const severity = (LogLevel.strings.get(logLevel) || 'unknown').toUpperCase();
        const now = new Date();
        console(`${now.toISOString()} ${name} ${severity} ${message}`, ...params);
    }
    ConsoleLogger.log = log;
})(ConsoleLogger = exports.ConsoleLogger || (exports.ConsoleLogger = {}));


/***/ }),

/***/ "../../packages/core/lib/common/logger-watcher.js":
/*!********************************************************!*\
  !*** ../../packages/core/lib/common/logger-watcher.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerWatcher = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const event_1 = __webpack_require__(/*! ./event */ "../../packages/core/lib/common/event.js");
let LoggerWatcher = class LoggerWatcher {
    constructor() {
        this.onLogLevelChangedEmitter = new event_1.Emitter();
    }
    getLoggerClient() {
        const emitter = this.onLogLevelChangedEmitter;
        return {
            onLogLevelChanged(event) {
                emitter.fire(event);
            }
        };
    }
    get onLogLevelChanged() {
        return this.onLogLevelChangedEmitter.event;
    }
    // FIXME: get rid of it, backend services should as well set a client on the server
    fireLogLevelChanged(event) {
        this.onLogLevelChangedEmitter.fire(event);
    }
};
LoggerWatcher = __decorate([
    (0, inversify_1.injectable)()
], LoggerWatcher);
exports.LoggerWatcher = LoggerWatcher;


/***/ }),

/***/ "../../packages/core/lib/common/logger.js":
/*!************************************************!*\
  !*** ../../packages/core/lib/common/logger.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.Logger = exports.ILogger = exports.LoggerName = exports.LoggerFactory = exports.setRootLogger = exports.unsetRootLogger = exports.logger = exports.rootLoggerName = exports.LogLevel = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const logger_watcher_1 = __webpack_require__(/*! ./logger-watcher */ "../../packages/core/lib/common/logger-watcher.js");
const logger_protocol_1 = __webpack_require__(/*! ./logger-protocol */ "../../packages/core/lib/common/logger-protocol.js");
Object.defineProperty(exports, "LogLevel", ({ enumerable: true, get: function () { return logger_protocol_1.LogLevel; } }));
Object.defineProperty(exports, "rootLoggerName", ({ enumerable: true, get: function () { return logger_protocol_1.rootLoggerName; } }));
/**
 * Counterpart of the `#setRootLogger(ILogger)`. Restores the `console.xxx` bindings to the original one.
 * Invoking has no side-effect if `setRootLogger` was not called before. Multiple function invocation has
 * no side-effect either.
 */
function unsetRootLogger() {
    if (exports.logger !== undefined) {
        logger_protocol_1.ConsoleLogger.reset();
        exports.logger = undefined;
    }
}
exports.unsetRootLogger = unsetRootLogger;
function setRootLogger(aLogger) {
    exports.logger = aLogger;
    const log = (logLevel, message, ...optionalParams) => exports.logger.log(logLevel, message, ...optionalParams);
    console.error = log.bind(undefined, logger_protocol_1.LogLevel.ERROR);
    console.warn = log.bind(undefined, logger_protocol_1.LogLevel.WARN);
    console.info = log.bind(undefined, logger_protocol_1.LogLevel.INFO);
    console.debug = log.bind(undefined, logger_protocol_1.LogLevel.DEBUG);
    console.trace = log.bind(undefined, logger_protocol_1.LogLevel.TRACE);
    console.log = log.bind(undefined, logger_protocol_1.LogLevel.INFO);
}
exports.setRootLogger = setRootLogger;
exports.LoggerFactory = Symbol('LoggerFactory');
exports.LoggerName = Symbol('LoggerName');
exports.ILogger = Symbol('ILogger');
let Logger = class Logger {
    init() {
        if (this.name !== logger_protocol_1.rootLoggerName) {
            /* Creating a child logger.  */
            this.created = this.server.child(this.name);
        }
        else {
            /* Creating the root logger (it already exists at startup).  */
            this.created = Promise.resolve();
        }
        /* Fetch the log level so it's cached in the frontend.  */
        this._logLevel = this.created.then(_ => this.server.getLogLevel(this.name));
        /* Update the log level if it changes in the backend. */
        this.loggerWatcher.onLogLevelChanged(event => {
            this.created.then(() => {
                if (event.loggerName === this.name) {
                    this._logLevel = Promise.resolve(event.newLogLevel);
                }
            });
        });
    }
    setLogLevel(logLevel) {
        return new Promise(resolve => {
            this.created.then(() => {
                this._logLevel.then(oldLevel => {
                    this.server.setLogLevel(this.name, logLevel).then(() => {
                        this._logLevel = Promise.resolve(logLevel);
                        resolve();
                    });
                });
            });
        });
    }
    getLogLevel() {
        return this._logLevel;
    }
    isEnabled(logLevel) {
        return this._logLevel.then(level => logLevel >= level);
    }
    ifEnabled(logLevel) {
        return new Promise(resolve => this.isEnabled(logLevel).then(enabled => {
            if (enabled) {
                resolve();
            }
        }));
    }
    log(logLevel, arg2, ...params) {
        return this.getLog(logLevel).then(log => {
            if (typeof arg2 === 'function') {
                const loggable = arg2;
                loggable(log);
            }
            else if (arg2) {
                log(arg2, ...params);
            }
        });
    }
    getLog(logLevel) {
        return this.ifEnabled(logLevel).then(() => this.created.then(() => (message, ...params) => this.server.log(this.name, logLevel, this.format(message), params.map(p => this.format(p)))));
    }
    format(value) {
        if (value instanceof Error) {
            return value.stack || value.toString();
        }
        return value;
    }
    isTrace() {
        return this.isEnabled(logger_protocol_1.LogLevel.TRACE);
    }
    ifTrace() {
        return this.ifEnabled(logger_protocol_1.LogLevel.TRACE);
    }
    trace(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.TRACE, arg, ...params);
    }
    isDebug() {
        return this.isEnabled(logger_protocol_1.LogLevel.DEBUG);
    }
    ifDebug() {
        return this.ifEnabled(logger_protocol_1.LogLevel.DEBUG);
    }
    debug(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.DEBUG, arg, ...params);
    }
    isInfo() {
        return this.isEnabled(logger_protocol_1.LogLevel.INFO);
    }
    ifInfo() {
        return this.ifEnabled(logger_protocol_1.LogLevel.INFO);
    }
    info(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.INFO, arg, ...params);
    }
    isWarn() {
        return this.isEnabled(logger_protocol_1.LogLevel.WARN);
    }
    ifWarn() {
        return this.ifEnabled(logger_protocol_1.LogLevel.WARN);
    }
    warn(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.WARN, arg, ...params);
    }
    isError() {
        return this.isEnabled(logger_protocol_1.LogLevel.ERROR);
    }
    ifError() {
        return this.ifEnabled(logger_protocol_1.LogLevel.ERROR);
    }
    error(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.ERROR, arg, ...params);
    }
    isFatal() {
        return this.isEnabled(logger_protocol_1.LogLevel.FATAL);
    }
    ifFatal() {
        return this.ifEnabled(logger_protocol_1.LogLevel.FATAL);
    }
    fatal(arg, ...params) {
        return this.log(logger_protocol_1.LogLevel.FATAL, arg, ...params);
    }
    child(name) {
        return this.factory(name);
    }
};
__decorate([
    (0, inversify_1.inject)(logger_protocol_1.ILoggerServer),
    __metadata("design:type", Object)
], Logger.prototype, "server", void 0);
__decorate([
    (0, inversify_1.inject)(logger_watcher_1.LoggerWatcher),
    __metadata("design:type", logger_watcher_1.LoggerWatcher)
], Logger.prototype, "loggerWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(exports.LoggerFactory),
    __metadata("design:type", Function)
], Logger.prototype, "factory", void 0);
__decorate([
    (0, inversify_1.inject)(exports.LoggerName),
    __metadata("design:type", String)
], Logger.prototype, "name", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Logger.prototype, "init", null);
Logger = __decorate([
    (0, inversify_1.injectable)()
], Logger);
exports.Logger = Logger;


/***/ }),

/***/ "../../packages/core/lib/common/lsp-types.js":
/*!***************************************************!*\
  !*** ../../packages/core/lib/common/lsp-types.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.TextDocumentContentChangeDelta = void 0;
const vscode_languageserver_protocol_1 = __webpack_require__(/*! vscode-languageserver-protocol */ "../../node_modules/vscode-languageserver-protocol/lib/node/main.js");
const types_1 = __webpack_require__(/*! ./types */ "../../packages/core/lib/common/types.js");
var TextDocumentContentChangeDelta;
(function (TextDocumentContentChangeDelta) {
    function is(arg) {
        return (0, types_1.isObject)(arg)
            && (0, types_1.isString)(arg.text)
            && ((0, types_1.isNumber)(arg.rangeLength) || (0, types_1.isUndefined)(arg.rangeLength))
            && vscode_languageserver_protocol_1.Range.is(arg.range);
    }
    TextDocumentContentChangeDelta.is = is;
})(TextDocumentContentChangeDelta = exports.TextDocumentContentChangeDelta || (exports.TextDocumentContentChangeDelta = {}));


/***/ }),

/***/ "../../packages/core/lib/common/menu/action-menu-node.js":
/*!***************************************************************!*\
  !*** ../../packages/core/lib/common/menu/action-menu-node.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.ActionMenuNode = void 0;
/**
 * Node representing an action in the menu tree structure.
 * It's based on {@link MenuAction} for which it tries to determine the
 * best label, icon and sortString with the given data.
 */
class ActionMenuNode {
    constructor(action, commands) {
        this.action = action;
        this.commands = commands;
        if (action.alt) {
            this.altNode = new ActionMenuNode({ commandId: action.alt }, commands);
        }
    }
    get command() { return this.action.commandId; }
    ;
    get when() { return this.action.when; }
    get id() { return this.action.commandId; }
    get label() {
        if (this.action.label) {
            return this.action.label;
        }
        const cmd = this.commands.getCommand(this.action.commandId);
        if (!cmd) {
            console.debug(`No label for action menu node: No command "${this.action.commandId}" exists.`);
            return '';
        }
        return cmd.label || cmd.id;
    }
    get icon() {
        if (this.action.icon) {
            return this.action.icon;
        }
        const command = this.commands.getCommand(this.action.commandId);
        return command && command.iconClass;
    }
    get sortString() { return this.action.order || this.label; }
}
exports.ActionMenuNode = ActionMenuNode;


/***/ }),

/***/ "../../packages/core/lib/common/menu/composite-menu-node.js":
/*!******************************************************************!*\
  !*** ../../packages/core/lib/common/menu/composite-menu-node.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.CompositeMenuNodeWrapper = exports.CompositeMenuNode = void 0;
const menu_types_1 = __webpack_require__(/*! ./menu-types */ "../../packages/core/lib/common/menu/menu-types.js");
/**
 * Node representing a (sub)menu in the menu tree structure.
 */
class CompositeMenuNode {
    constructor(id, label, options, parent) {
        this.id = id;
        this.label = label;
        this.parent = parent;
        this._children = [];
        this.updateOptions(options);
    }
    get when() { return this._when; }
    get icon() { return this.iconClass; }
    get children() { return this._children; }
    get role() { var _a; return (_a = this._role) !== null && _a !== void 0 ? _a : (this.label ? 0 /* Submenu */ : 1 /* Group */); }
    addNode(node) {
        this._children.push(node);
        this._children.sort(menu_types_1.CompoundMenuNode.sortChildren);
        return {
            dispose: () => {
                const idx = this._children.indexOf(node);
                if (idx >= 0) {
                    this._children.splice(idx, 1);
                }
            }
        };
    }
    removeNode(id) {
        const idx = this._children.findIndex(n => n.id === id);
        if (idx >= 0) {
            this._children.splice(idx, 1);
        }
    }
    updateOptions(options) {
        var _a, _b, _c, _d, _e, _f;
        if (options) {
            (_a = this.iconClass) !== null && _a !== void 0 ? _a : (this.iconClass = (_b = options.icon) !== null && _b !== void 0 ? _b : options.iconClass);
            (_c = this.label) !== null && _c !== void 0 ? _c : (this.label = options.label);
            (_d = this.order) !== null && _d !== void 0 ? _d : (this.order = options.order);
            (_e = this._role) !== null && _e !== void 0 ? _e : (this._role = options.role);
            (_f = this._when) !== null && _f !== void 0 ? _f : (this._when = options.when);
        }
    }
    get sortString() {
        return this.order || this.id;
    }
    get isSubmenu() {
        return Boolean(this.label);
    }
}
exports.CompositeMenuNode = CompositeMenuNode;
/** @deprecated @since 1.28 use CompoundMenuNode.isNavigationGroup instead */
CompositeMenuNode.isNavigationGroup = menu_types_1.CompoundMenuNode.isNavigationGroup;
class CompositeMenuNodeWrapper {
    constructor(wrapped, parent, options) {
        this.wrapped = wrapped;
        this.parent = parent;
        this.options = options;
    }
    get id() { return this.wrapped.id; }
    get label() { return this.wrapped.label; }
    get sortString() { var _a; return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.order) || this.wrapped.sortString; }
    get isSubmenu() { return Boolean(this.label); }
    get role() { var _a, _b; return (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : this.wrapped.role; }
    get icon() { return this.iconClass; }
    get iconClass() { var _a, _b; return (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.iconClass) !== null && _b !== void 0 ? _b : this.wrapped.icon; }
    get order() { return this.sortString; }
    get when() { var _a, _b; return (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.when) !== null && _b !== void 0 ? _b : this.wrapped.when; }
    get children() { return this.wrapped.children; }
    addNode(node) { return this.wrapped.addNode(node); }
    removeNode(id) { return this.wrapped.removeNode(id); }
    updateOptions(options) { return this.wrapped.updateOptions(options); }
}
exports.CompositeMenuNodeWrapper = CompositeMenuNodeWrapper;


/***/ }),

/***/ "../../packages/core/lib/common/menu/index.js":
/*!****************************************************!*\
  !*** ../../packages/core/lib/common/menu/index.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./action-menu-node */ "../../packages/core/lib/common/menu/action-menu-node.js"), exports);
__exportStar(__webpack_require__(/*! ./composite-menu-node */ "../../packages/core/lib/common/menu/composite-menu-node.js"), exports);
__exportStar(__webpack_require__(/*! ./menu-adapter */ "../../packages/core/lib/common/menu/menu-adapter.js"), exports);
__exportStar(__webpack_require__(/*! ./menu-model-registry */ "../../packages/core/lib/common/menu/menu-model-registry.js"), exports);
__exportStar(__webpack_require__(/*! ./menu-types */ "../../packages/core/lib/common/menu/menu-types.js"), exports);


/***/ }),

/***/ "../../packages/core/lib/common/menu/menu-adapter.js":
/*!***********************************************************!*\
  !*** ../../packages/core/lib/common/menu/menu-adapter.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.MenuCommandAdapterRegistryImpl = exports.MenuCommandExecutorImpl = exports.MenuCommandAdapterRegistry = exports.MenuCommandAdapter = exports.MenuCommandExecutor = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const command_1 = __webpack_require__(/*! ../command */ "../../packages/core/lib/common/command.js");
const disposable_1 = __webpack_require__(/*! ../disposable */ "../../packages/core/lib/common/disposable.js");
exports.MenuCommandExecutor = Symbol('MenuCommandExecutor');
;
exports.MenuCommandAdapter = Symbol('MenuCommandAdapter');
exports.MenuCommandAdapterRegistry = Symbol('MenuCommandAdapterRegistry');
let MenuCommandExecutorImpl = class MenuCommandExecutorImpl {
    executeCommand(menuPath, command, ...commandArgs) {
        return this.delegate(menuPath, command, commandArgs, 'executeCommand');
    }
    isVisible(menuPath, command, ...commandArgs) {
        return this.delegate(menuPath, command, commandArgs, 'isVisible');
    }
    isEnabled(menuPath, command, ...commandArgs) {
        return this.delegate(menuPath, command, commandArgs, 'isEnabled');
    }
    isToggled(menuPath, command, ...commandArgs) {
        return this.delegate(menuPath, command, commandArgs, 'isToggled');
    }
    delegate(menuPath, command, commandArgs, method) {
        const adapter = this.adapterRegistry.getAdapterFor(menuPath, command, commandArgs);
        return (adapter
            ? adapter[method](menuPath, command, ...commandArgs)
            : this.commandRegistry[method](command, ...commandArgs));
    }
};
__decorate([
    (0, inversify_1.inject)(exports.MenuCommandAdapterRegistry),
    __metadata("design:type", Object)
], MenuCommandExecutorImpl.prototype, "adapterRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], MenuCommandExecutorImpl.prototype, "commandRegistry", void 0);
MenuCommandExecutorImpl = __decorate([
    (0, inversify_1.injectable)()
], MenuCommandExecutorImpl);
exports.MenuCommandExecutorImpl = MenuCommandExecutorImpl;
let MenuCommandAdapterRegistryImpl = class MenuCommandAdapterRegistryImpl {
    constructor() {
        this.adapters = new Array();
    }
    registerAdapter(adapter) {
        if (!this.adapters.includes(adapter)) {
            this.adapters.push(adapter);
            return disposable_1.Disposable.create(() => {
                const index = this.adapters.indexOf(adapter);
                if (index !== -1) {
                    this.adapters.splice(index, 1);
                }
            });
        }
        return disposable_1.Disposable.NULL;
    }
    getAdapterFor(menuPath, command, ...commandArgs) {
        let bestAdapter = undefined;
        let bestScore = 0;
        let currentScore = 0;
        for (const adapter of this.adapters) {
            // Greater than or equal: favor later registrations over earlier.
            if ((currentScore = adapter.canHandle(menuPath, command, ...commandArgs)) >= bestScore) {
                bestScore = currentScore;
                bestAdapter = adapter;
            }
        }
        return bestAdapter;
    }
};
MenuCommandAdapterRegistryImpl = __decorate([
    (0, inversify_1.injectable)()
], MenuCommandAdapterRegistryImpl);
exports.MenuCommandAdapterRegistryImpl = MenuCommandAdapterRegistryImpl;


/***/ }),

/***/ "../../packages/core/lib/common/menu/menu-model-registry.js":
/*!******************************************************************!*\
  !*** ../../packages/core/lib/common/menu/menu-model-registry.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuModelRegistry = exports.MenuContribution = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const disposable_1 = __webpack_require__(/*! ../disposable */ "../../packages/core/lib/common/disposable.js");
const command_1 = __webpack_require__(/*! ../command */ "../../packages/core/lib/common/command.js");
const contribution_provider_1 = __webpack_require__(/*! ../contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const composite_menu_node_1 = __webpack_require__(/*! ./composite-menu-node */ "../../packages/core/lib/common/menu/composite-menu-node.js");
const menu_types_1 = __webpack_require__(/*! ./menu-types */ "../../packages/core/lib/common/menu/menu-types.js");
const action_menu_node_1 = __webpack_require__(/*! ./action-menu-node */ "../../packages/core/lib/common/menu/action-menu-node.js");
exports.MenuContribution = Symbol('MenuContribution');
/**
 * The MenuModelRegistry allows to register and unregister menus, submenus and actions
 * via strings and {@link MenuAction}s without the need to access the underlying UI
 * representation.
 */
let MenuModelRegistry = class MenuModelRegistry {
    constructor(contributions, commands) {
        this.contributions = contributions;
        this.commands = commands;
        this.root = new composite_menu_node_1.CompositeMenuNode('');
        this.independentSubmenus = new Map();
    }
    onStart() {
        for (const contrib of this.contributions.getContributions()) {
            contrib.registerMenus(this);
        }
    }
    /**
     * Adds the given menu action to the menu denoted by the given path.
     *
     * @returns a disposable which, when called, will remove the menu action again.
     */
    registerMenuAction(menuPath, item) {
        const menuNode = new action_menu_node_1.ActionMenuNode(item, this.commands);
        return this.registerMenuNode(menuPath, menuNode);
    }
    /**
     * Adds the given menu node to the menu denoted by the given path.
     *
     * @returns a disposable which, when called, will remove the menu node again.
     */
    registerMenuNode(menuPath, menuNode, group) {
        const parent = this.getMenuNode(menuPath, group);
        return parent.addNode(menuNode);
    }
    getMenuNode(menuPath, group) {
        if (typeof menuPath === 'string') {
            const target = this.independentSubmenus.get(menuPath);
            if (!target) {
                throw new Error(`Could not find submenu with id ${menuPath}`);
            }
            if (group) {
                return this.findSubMenu(target, group);
            }
            return target;
        }
        else {
            return this.findGroup(group ? menuPath.concat(group) : menuPath);
        }
    }
    /**
     * Register a new menu at the given path with the given label.
     * (If the menu already exists without a label, iconClass or order this method can be used to set them.)
     *
     * @param menuPath the path for which a new submenu shall be registered.
     * @param label the label to be used for the new submenu.
     * @param options optionally allows to set an icon class and specify the order of the new menu.
     *
     * @returns if the menu was successfully created a disposable will be returned which,
     * when called, will remove the menu again. If the menu already existed a no-op disposable
     * will be returned.
     *
     * Note that if the menu already existed and was registered with a different label an error
     * will be thrown.
     */
    registerSubmenu(menuPath, label, options) {
        if (menuPath.length === 0) {
            throw new Error('The sub menu path cannot be empty.');
        }
        const index = menuPath.length - 1;
        const menuId = menuPath[index];
        const groupPath = index === 0 ? [] : menuPath.slice(0, index);
        const parent = this.findGroup(groupPath, options);
        let groupNode = this.findSubMenu(parent, menuId, options);
        if (!groupNode) {
            groupNode = new composite_menu_node_1.CompositeMenuNode(menuId, label, options, parent);
            return parent.addNode(groupNode);
        }
        else {
            groupNode.updateOptions({ ...options, label });
            return disposable_1.Disposable.NULL;
        }
    }
    registerIndependentSubmenu(id, label, options) {
        if (this.independentSubmenus.has(id)) {
            console.debug(`Independent submenu with path ${id} registered, but given ID already exists.`);
        }
        this.independentSubmenus.set(id, new composite_menu_node_1.CompositeMenuNode(id, label, options));
        return { dispose: () => this.independentSubmenus.delete(id) };
    }
    linkSubmenu(parentPath, childId, options, group) {
        const child = this.getMenuNode(childId);
        const parent = this.getMenuNode(parentPath, group);
        const wrapper = new composite_menu_node_1.CompositeMenuNodeWrapper(child, parent, options);
        return parent.addNode(wrapper);
    }
    unregisterMenuAction(itemOrCommandOrId, menuPath) {
        const id = menu_types_1.MenuAction.is(itemOrCommandOrId) ? itemOrCommandOrId.commandId
            : command_1.Command.is(itemOrCommandOrId) ? itemOrCommandOrId.id
                : itemOrCommandOrId;
        if (menuPath) {
            const parent = this.findGroup(menuPath);
            parent.removeNode(id);
            return;
        }
        this.unregisterMenuNode(id);
    }
    /**
     * Recurse all menus, removing any menus matching the `id`.
     *
     * @param id technical identifier of the `MenuNode`.
     */
    unregisterMenuNode(id) {
        const recurse = (root) => {
            root.children.forEach(node => {
                if (menu_types_1.CompoundMenuNode.isMutable(node)) {
                    node.removeNode(id);
                    recurse(node);
                }
            });
        };
        recurse(this.root);
    }
    /**
     * Finds a submenu as a descendant of the `root` node.
     * See {@link MenuModelRegistry.findSubMenu findSubMenu}.
     */
    findGroup(menuPath, options) {
        let currentMenu = this.root;
        for (const segment of menuPath) {
            currentMenu = this.findSubMenu(currentMenu, segment, options);
        }
        return currentMenu;
    }
    /**
     * Finds or creates a submenu as an immediate child of `current`.
     * @throws if a node with the given `menuId` exists but is not a {@link MutableCompoundMenuNode}.
     */
    findSubMenu(current, menuId, options) {
        const sub = current.children.find(e => e.id === menuId);
        if (menu_types_1.CompoundMenuNode.isMutable(sub)) {
            return sub;
        }
        if (sub) {
            throw new Error(`'${menuId}' is not a menu group.`);
        }
        const newSub = new composite_menu_node_1.CompositeMenuNode(menuId, undefined, options, current);
        current.addNode(newSub);
        return newSub;
    }
    /**
     * Returns the menu at the given path.
     *
     * @param menuPath the path specifying the menu to return. If not given the empty path will be used.
     *
     * @returns the root menu when `menuPath` is empty. If `menuPath` is not empty the specified menu is
     * returned if it exists, otherwise an error is thrown.
     */
    getMenu(menuPath = []) {
        return this.findGroup(menuPath);
    }
    /**
     * Checks the given menu model whether it will show a menu with a single submenu.
     *
     * @param fullMenuModel the menu model to analyze
     * @param menuPath the menu's path
     * @returns if the menu will show a single submenu this returns a menu that will show the child elements of the submenu,
     * otherwise the given `fullMenuModel` is return
     */
    removeSingleRootNode(fullMenuModel, menuPath) {
        // check whether all children are compound menus and that there is only one child that has further children
        if (!this.allChildrenCompound(fullMenuModel.children)) {
            return fullMenuModel;
        }
        let nonEmptyNode = undefined;
        for (const child of fullMenuModel.children) {
            if (!this.isEmpty(child.children || [])) {
                if (nonEmptyNode === undefined) {
                    nonEmptyNode = child;
                }
                else {
                    return fullMenuModel;
                }
            }
        }
        if (menu_types_1.CompoundMenuNode.is(nonEmptyNode) && nonEmptyNode.children.length === 1 && menu_types_1.CompoundMenuNode.is(nonEmptyNode.children[0])) {
            nonEmptyNode = nonEmptyNode.children[0];
        }
        return menu_types_1.CompoundMenuNode.is(nonEmptyNode) ? nonEmptyNode : fullMenuModel;
    }
    allChildrenCompound(children) {
        return children.every(menu_types_1.CompoundMenuNode.is);
    }
    isEmpty(children) {
        if (children.length === 0) {
            return true;
        }
        if (!this.allChildrenCompound(children)) {
            return false;
        }
        for (const child of children) {
            if (!this.isEmpty(child.children || [])) {
                return false;
            }
        }
        return true;
    }
    /**
     * Returns the {@link MenuPath path} at which a given menu node can be accessed from this registry, if it can be determined.
     * Returns `undefined` if the `parent` of any node in the chain is unknown.
     */
    getPath(node) {
        const identifiers = [];
        const visited = [];
        let next = node;
        while (next && !visited.includes(next)) {
            if (next === this.root) {
                return identifiers.reverse();
            }
            visited.push(next);
            identifiers.push(next.id);
            next = next.parent;
        }
        return undefined;
    }
};
MenuModelRegistry = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contribution_provider_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.MenuContribution)),
    __param(1, (0, inversify_1.inject)(command_1.CommandRegistry)),
    __metadata("design:paramtypes", [Object, command_1.CommandRegistry])
], MenuModelRegistry);
exports.MenuModelRegistry = MenuModelRegistry;


/***/ }),

/***/ "../../packages/core/lib/common/menu/menu-types.js":
/*!*********************************************************!*\
  !*** ../../packages/core/lib/common/menu/menu-types.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.CommandMenuNode = exports.CompoundMenuNode = exports.MenuAction = exports.ACCOUNTS_SUBMENU = exports.ACCOUNTS_MENU = exports.SETTINGS_MENU = exports.MAIN_MENU_BAR = void 0;
const types_1 = __webpack_require__(/*! ../types */ "../../packages/core/lib/common/types.js");
exports.MAIN_MENU_BAR = ['menubar'];
exports.SETTINGS_MENU = ['settings_menu'];
exports.ACCOUNTS_MENU = ['accounts_menu'];
exports.ACCOUNTS_SUBMENU = [...exports.ACCOUNTS_MENU, '1_accounts_submenu'];
var MenuAction;
(function (MenuAction) {
    /* Determine whether object is a MenuAction */
    function is(arg) {
        return (0, types_1.isObject)(arg) && 'commandId' in arg;
    }
    MenuAction.is = is;
})(MenuAction = exports.MenuAction || (exports.MenuAction = {}));
var CompoundMenuNode;
(function (CompoundMenuNode) {
    function is(node) { return !!node && Array.isArray(node.children); }
    CompoundMenuNode.is = is;
    function getRole(node) {
        var _a;
        if (!is(node)) {
            return undefined;
        }
        return (_a = node.role) !== null && _a !== void 0 ? _a : (node.label ? 0 /* Submenu */ : 1 /* Group */);
    }
    CompoundMenuNode.getRole = getRole;
    function sortChildren(m1, m2) {
        // The navigation group is special as it will always be sorted to the top/beginning of a menu.
        if (isNavigationGroup(m1)) {
            return -1;
        }
        if (isNavigationGroup(m2)) {
            return 1;
        }
        return m1.sortString.localeCompare(m2.sortString);
    }
    CompoundMenuNode.sortChildren = sortChildren;
    /** Collapses the children of any subemenus with role {@link CompoundMenuNodeRole Flat} and sorts */
    function getFlatChildren(children) {
        const childrenToMerge = [];
        return children.filter(child => {
            if (getRole(child) === 2 /* Flat */) {
                childrenToMerge.push(child.children);
                return false;
            }
            return true;
        }).concat(...childrenToMerge).sort(sortChildren);
    }
    CompoundMenuNode.getFlatChildren = getFlatChildren;
    /**
     * Indicates whether the given node is the special `navigation` menu.
     *
     * @param node the menu node to check.
     * @returns `true` when the given node is a {@link CompoundMenuNode} with id `navigation`,
     * `false` otherwise.
     */
    function isNavigationGroup(node) {
        return is(node) && node.id === 'navigation';
    }
    CompoundMenuNode.isNavigationGroup = isNavigationGroup;
    function isMutable(node) {
        const candidate = node;
        return is(candidate) && typeof candidate.addNode === 'function' && typeof candidate.removeNode === 'function';
    }
    CompoundMenuNode.isMutable = isMutable;
})(CompoundMenuNode = exports.CompoundMenuNode || (exports.CompoundMenuNode = {}));
var CommandMenuNode;
(function (CommandMenuNode) {
    function is(candidate) { return Boolean(candidate === null || candidate === void 0 ? void 0 : candidate.command); }
    CommandMenuNode.is = is;
    function hasAltHandler(candidate) {
        const asAltNode = candidate;
        return is(asAltNode) && is(asAltNode === null || asAltNode === void 0 ? void 0 : asAltNode.altNode);
    }
    CommandMenuNode.hasAltHandler = hasAltHandler;
})(CommandMenuNode = exports.CommandMenuNode || (exports.CommandMenuNode = {}));


/***/ }),

/***/ "../../packages/core/lib/common/message-rpc/channel.js":
/*!*************************************************************!*\
  !*** ../../packages/core/lib/common/message-rpc/channel.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Red Hat, Inc. and others.
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
exports.ChannelMultiplexer = exports.MessageTypes = exports.ForwardingChannel = exports.BasicChannel = exports.AbstractChannel = void 0;
const disposable_1 = __webpack_require__(/*! ../disposable */ "../../packages/core/lib/common/disposable.js");
const event_1 = __webpack_require__(/*! ../event */ "../../packages/core/lib/common/event.js");
;
/**
 *  Reusable abstract {@link Channel} implementation that sets up
 *  the basic channel event listeners and offers a generic close method.
 */
class AbstractChannel {
    constructor() {
        this.onCloseEmitter = new event_1.Emitter();
        this.onErrorEmitter = new event_1.Emitter();
        this.onMessageEmitter = new event_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDispose.pushAll([this.onCloseEmitter, this.onErrorEmitter, this.onMessageEmitter]);
    }
    get onClose() {
        return this.onCloseEmitter.event;
    }
    ;
    get onError() {
        return this.onErrorEmitter.event;
    }
    ;
    get onMessage() {
        return this.onMessageEmitter.event;
    }
    ;
    close() {
        this.toDispose.dispose();
    }
}
exports.AbstractChannel = AbstractChannel;
/**
 * A very basic {@link AbstractChannel} implementation which takes a function
 * for retrieving the {@link WriteBuffer} as constructor argument.
 */
class BasicChannel extends AbstractChannel {
    constructor(writeBufferProvider) {
        super();
        this.writeBufferProvider = writeBufferProvider;
    }
    getWriteBuffer() {
        return this.writeBufferProvider();
    }
}
exports.BasicChannel = BasicChannel;
/**
 * Helper class to implement the single channels on a {@link ChannelMultiplexer}. Simply forwards write requests to
 * the given write buffer source i.e. the main channel of the {@link ChannelMultiplexer}.
 */
class ForwardingChannel extends AbstractChannel {
    constructor(id, closeHandler, writeBufferSource) {
        super();
        this.id = id;
        this.closeHandler = closeHandler;
        this.writeBufferSource = writeBufferSource;
    }
    getWriteBuffer() {
        return this.writeBufferSource();
    }
    close() {
        super.close();
        this.closeHandler();
    }
}
exports.ForwardingChannel = ForwardingChannel;
/**
 * The different message types used in the messaging protocol of the {@link ChannelMultiplexer}
 */
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["Open"] = 1] = "Open";
    MessageTypes[MessageTypes["Close"] = 2] = "Close";
    MessageTypes[MessageTypes["AckOpen"] = 3] = "AckOpen";
    MessageTypes[MessageTypes["Data"] = 4] = "Data";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
/**
 * The write buffers in this implementation immediately write to the underlying
 * channel, so we rely on writers to the multiplexed channels to always commit their
 * messages and always in one go.
 */
class ChannelMultiplexer {
    constructor(underlyingChannel) {
        this.underlyingChannel = underlyingChannel;
        this.pendingOpen = new Map();
        this.openChannels = new Map();
        this.onOpenChannelEmitter = new event_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDispose.pushAll([
            this.underlyingChannel.onMessage(buffer => this.handleMessage(buffer())),
            this.underlyingChannel.onClose(event => this.onUnderlyingChannelClose(event)),
            this.underlyingChannel.onError(error => this.handleError(error)),
            this.onOpenChannelEmitter
        ]);
    }
    get onDidOpenChannel() {
        return this.onOpenChannelEmitter.event;
    }
    handleError(error) {
        this.openChannels.forEach(channel => {
            channel.onErrorEmitter.fire(error);
        });
    }
    onUnderlyingChannelClose(event) {
        if (!this.toDispose.disposed) {
            this.toDispose.push(disposable_1.Disposable.create(() => {
                this.pendingOpen.clear();
                this.openChannels.forEach(channel => {
                    channel.onCloseEmitter.fire(event !== null && event !== void 0 ? event : { reason: 'Multiplexer main channel has been closed from the remote side!' });
                });
                this.openChannels.clear();
            }));
            this.dispose();
        }
    }
    handleMessage(buffer) {
        const type = buffer.readUint8();
        const id = buffer.readString();
        switch (type) {
            case MessageTypes.AckOpen: {
                return this.handleAckOpen(id);
            }
            case MessageTypes.Open: {
                return this.handleOpen(id);
            }
            case MessageTypes.Close: {
                return this.handleClose(id);
            }
            case MessageTypes.Data: {
                return this.handleData(id, buffer);
            }
        }
    }
    handleAckOpen(id) {
        // edge case: both side try to open a channel at the same time.
        const resolve = this.pendingOpen.get(id);
        if (resolve) {
            const channel = this.createChannel(id);
            this.pendingOpen.delete(id);
            this.openChannels.set(id, channel);
            resolve(channel);
            this.onOpenChannelEmitter.fire({ id, channel });
        }
    }
    handleOpen(id) {
        if (!this.openChannels.has(id)) {
            const channel = this.createChannel(id);
            this.openChannels.set(id, channel);
            const resolve = this.pendingOpen.get(id);
            if (resolve) {
                // edge case: both side try to open a channel at the same time.
                resolve(channel);
            }
            this.underlyingChannel.getWriteBuffer().writeUint8(MessageTypes.AckOpen).writeString(id).commit();
            this.onOpenChannelEmitter.fire({ id, channel });
        }
    }
    handleClose(id) {
        const channel = this.openChannels.get(id);
        if (channel) {
            channel.onCloseEmitter.fire({ reason: 'Channel has been closed from the remote side' });
            this.openChannels.delete(id);
        }
    }
    handleData(id, data) {
        const channel = this.openChannels.get(id);
        if (channel) {
            channel.onMessageEmitter.fire(() => data.sliceAtReadPosition());
        }
    }
    createChannel(id) {
        return new ForwardingChannel(id, () => this.closeChannel(id), () => this.prepareWriteBuffer(id));
    }
    // Prepare the write buffer for the channel with the give, id. The channel id has to be encoded
    // and written to the buffer before the actual message.
    prepareWriteBuffer(id) {
        const underlying = this.underlyingChannel.getWriteBuffer();
        underlying.writeUint8(MessageTypes.Data);
        underlying.writeString(id);
        return underlying;
    }
    closeChannel(id) {
        this.underlyingChannel.getWriteBuffer()
            .writeUint8(MessageTypes.Close)
            .writeString(id)
            .commit();
        this.openChannels.delete(id);
    }
    open(id) {
        if (this.openChannels.has(id)) {
            throw new Error(`Another channel with the id '${id}' is already open.`);
        }
        const result = new Promise((resolve, reject) => {
            this.pendingOpen.set(id, resolve);
        });
        this.underlyingChannel.getWriteBuffer().writeUint8(MessageTypes.Open).writeString(id).commit();
        return result;
    }
    getOpenChannel(id) {
        return this.openChannels.get(id);
    }
    dispose() {
        this.toDispose.dispose();
    }
}
exports.ChannelMultiplexer = ChannelMultiplexer;


/***/ }),

/***/ "../../packages/core/lib/common/message-rpc/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/lib/common/message-rpc/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcProtocol = exports.AbstractChannel = void 0;
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
var channel_1 = __webpack_require__(/*! ./channel */ "../../packages/core/lib/common/message-rpc/channel.js");
Object.defineProperty(exports, "AbstractChannel", ({ enumerable: true, get: function () { return channel_1.AbstractChannel; } }));
var rpc_protocol_1 = __webpack_require__(/*! ./rpc-protocol */ "../../packages/core/lib/common/message-rpc/rpc-protocol.js");
Object.defineProperty(exports, "RpcProtocol", ({ enumerable: true, get: function () { return rpc_protocol_1.RpcProtocol; } }));
const rpc_message_encoder_1 = __webpack_require__(/*! ./rpc-message-encoder */ "../../packages/core/lib/common/message-rpc/rpc-message-encoder.js");
(0, rpc_message_encoder_1.registerMsgPackExtensions)();


/***/ }),

/***/ "../../packages/core/lib/common/message-rpc/msg-pack-extension-manager.js":
/*!********************************************************************************!*\
  !*** ../../packages/core/lib/common/message-rpc/msg-pack-extension-manager.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MsgPackExtensionManager = void 0;
const msgpackr_1 = __webpack_require__(/*! msgpackr */ "../../node_modules/msgpackr/dist/node.cjs");
/**
 * Handles the global registration of custom MsgPackR extensions
 * required for the default RPC communication. MsgPackR extensions
 * are installed globally on both ends of the communication channel.
 * (frontend-backend, pluginExt-pluginMain).
 * Is implemented as singleton as it is  also used in plugin child processes which have no access to inversify.
 */
class MsgPackExtensionManager {
    constructor() {
        this.extensions = new Map();
    }
    static getInstance() {
        return this.INSTANCE;
    }
    registerExtensions(...extensions) {
        extensions.forEach(extension => {
            if (extension.tag < 1 || extension.tag > 100) {
                // MsgPackR reserves the tag range 1-100 for custom extensions.
                throw new Error(`MsgPack extension tag should be a number from 1-100 but was '${extension.tag}'`);
            }
            if (this.extensions.has(extension.tag)) {
                throw new Error(`Another MsgPack extension with the tag '${extension.tag}' is already registered`);
            }
            this.extensions.set(extension.tag, extension);
            (0, msgpackr_1.addExtension)({
                Class: extension.class,
                type: extension.tag,
                write: extension.serialize,
                read: extension.deserialize
            });
        });
    }
    getExtension(tag) {
        return this.extensions.get(tag);
    }
}
exports.MsgPackExtensionManager = MsgPackExtensionManager;
MsgPackExtensionManager.INSTANCE = new MsgPackExtensionManager();


/***/ }),

/***/ "../../packages/core/lib/common/message-rpc/rpc-message-encoder.js":
/*!*************************************************************************!*\
  !*** ../../packages/core/lib/common/message-rpc/rpc-message-encoder.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerMsgPackExtensions = exports.MsgPackMessageDecoder = exports.MsgPackMessageEncoder = exports.defaultMsgPack = exports.EncodingError = exports.ResponseError = void 0;
const msgpackr_1 = __webpack_require__(/*! msgpackr */ "../../node_modules/msgpackr/dist/node.cjs");
const msg_pack_extension_manager_1 = __webpack_require__(/*! ./msg-pack-extension-manager */ "../../packages/core/lib/common/message-rpc/msg-pack-extension-manager.js");
/**
 * A special error that can be returned in case a request
 * has failed. Provides additional information i.e. an error code
 * and additional error data.
 */
class ResponseError extends Error {
    constructor(code, message, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
exports.ResponseError = ResponseError;
/**
 * Custom error thrown by the {@link RpcMessageEncoder} if an error occurred during the encoding and the
 * object could not be written to the given {@link WriteBuffer}
 */
class EncodingError extends Error {
    constructor(msg, cause) {
        super(msg);
        this.cause = cause;
    }
}
exports.EncodingError = EncodingError;
exports.defaultMsgPack = new msgpackr_1.Packr({ moreTypes: true, encodeUndefinedAsNil: false, bundleStrings: false });
class MsgPackMessageEncoder {
    constructor(msgPack = exports.defaultMsgPack) {
        this.msgPack = msgPack;
    }
    cancel(buf, requestId) {
        this.encode(buf, { type: 5 /* Cancel */, id: requestId });
    }
    notification(buf, method, args, id) {
        this.encode(buf, { type: 2 /* Notification */, method, args, id });
    }
    request(buf, requestId, method, args) {
        this.encode(buf, { type: 1 /* Request */, id: requestId, method, args });
    }
    replyOK(buf, requestId, res) {
        this.encode(buf, { type: 3 /* Reply */, id: requestId, res });
    }
    replyErr(buf, requestId, err) {
        this.encode(buf, { type: 4 /* ReplyErr */, id: requestId, err });
    }
    encode(buf, value) {
        try {
            buf.writeBytes(this.msgPack.encode(value));
        }
        catch (err) {
            if (err instanceof Error) {
                throw new EncodingError(`Error during encoding: '${err.message}'`, err);
            }
            throw err;
        }
    }
}
exports.MsgPackMessageEncoder = MsgPackMessageEncoder;
class MsgPackMessageDecoder {
    constructor(msgPack = exports.defaultMsgPack) {
        this.msgPack = msgPack;
    }
    decode(buf) {
        const bytes = buf.readBytes();
        return this.msgPack.decode(bytes);
    }
    parse(buffer) {
        return this.decode(buffer);
    }
}
exports.MsgPackMessageDecoder = MsgPackMessageDecoder;
function registerMsgPackExtensions() {
    // Register custom msgPack extension for Errors.
    msg_pack_extension_manager_1.MsgPackExtensionManager.getInstance().registerExtensions({
        class: Error,
        tag: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize: (error) => {
            var _a;
            const { code, data, message, name } = error;
            const stack = (_a = error.stacktrace) !== null && _a !== void 0 ? _a : error.stack;
            const isResponseError = error instanceof ResponseError;
            return { code, data, message, name, stack, isResponseError };
        },
        deserialize: data => {
            const error = data.isResponseError ? new ResponseError(data.code, data.message, data.data) : new Error(data.message);
            error.name = data.name;
            error.stack = data.stack;
            return error;
        }
    });
}
exports.registerMsgPackExtensions = registerMsgPackExtensions;


/***/ }),

/***/ "../../packages/core/lib/common/message-rpc/rpc-protocol.js":
/*!******************************************************************!*\
  !*** ../../packages/core/lib/common/message-rpc/rpc-protocol.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcProtocol = void 0;
const cancellation_1 = __webpack_require__(/*! ../cancellation */ "../../packages/core/lib/common/cancellation.js");
const disposable_1 = __webpack_require__(/*! ../disposable */ "../../packages/core/lib/common/disposable.js");
const event_1 = __webpack_require__(/*! ../event */ "../../packages/core/lib/common/event.js");
const promise_util_1 = __webpack_require__(/*! ../promise-util */ "../../packages/core/lib/common/promise-util.js");
const rpc_message_encoder_1 = __webpack_require__(/*! ./rpc-message-encoder */ "../../packages/core/lib/common/message-rpc/rpc-message-encoder.js");
/**
 * Establish a RPC protocol on top of a given channel. By default the rpc protocol is bi-directional, meaning it is possible to send
 * requests and notifications to the remote side (i.e. acts as client) as well as receiving requests and notifications from the remote side (i.e. acts as a server).
 * Clients can get a promise for a remote request result that will be either resolved or
 * rejected depending on the success of the request. Keeps track of outstanding requests and matches replies to the appropriate request
 * Currently, there is no timeout handling for long running requests implemented.
 * The bi-directional mode can be reconfigured using the {@link RpcProtocolOptions} to construct an RPC protocol instance that acts only as client or server instead.
 */
class RpcProtocol {
    constructor(channel, requestHandler, options = {}) {
        var _a, _b, _c;
        this.channel = channel;
        this.requestHandler = requestHandler;
        this.pendingRequests = new Map();
        this.nextMessageId = 0;
        this.onNotificationEmitter = new event_1.Emitter();
        this.cancellationTokenSources = new Map();
        this.toDispose = new disposable_1.DisposableCollection();
        this.encoder = (_a = options.encoder) !== null && _a !== void 0 ? _a : new rpc_message_encoder_1.MsgPackMessageEncoder();
        this.decoder = (_b = options.decoder) !== null && _b !== void 0 ? _b : new rpc_message_encoder_1.MsgPackMessageDecoder();
        this.toDispose.push(this.onNotificationEmitter);
        channel.onClose(event => {
            this.pendingRequests.forEach(pending => pending.reject(new Error(event.reason)));
            this.pendingRequests.clear();
            this.toDispose.dispose();
        });
        this.toDispose.push(channel.onMessage(readBuffer => this.handleMessage(this.decoder.parse(readBuffer()))));
        this.mode = (_c = options.mode) !== null && _c !== void 0 ? _c : 'default';
        if (this.mode !== 'clientOnly' && requestHandler === undefined) {
            console.error('RPCProtocol was initialized without a request handler but was not set to clientOnly mode.');
        }
    }
    get onNotification() {
        return this.onNotificationEmitter.event;
    }
    handleMessage(message) {
        if (this.mode !== 'clientOnly') {
            switch (message.type) {
                case 5 /* Cancel */: {
                    this.handleCancel(message.id);
                    return;
                }
                case 1 /* Request */: {
                    this.handleRequest(message.id, message.method, message.args);
                    return;
                }
                case 2 /* Notification */: {
                    this.handleNotify(message.method, message.args, message.id);
                    return;
                }
            }
        }
        if (this.mode !== 'serverOnly') {
            switch (message.type) {
                case 3 /* Reply */: {
                    this.handleReply(message.id, message.res);
                    return;
                }
                case 4 /* ReplyErr */: {
                    this.handleReplyErr(message.id, message.err);
                    return;
                }
            }
        }
        // If the message was not handled until here, it is incompatible with the mode.
        console.warn(`Received message incompatible with this RPCProtocol's mode '${this.mode}'. Type: ${message.type}. ID: ${message.id}.`);
    }
    handleReply(id, value) {
        const replyHandler = this.pendingRequests.get(id);
        if (replyHandler) {
            this.pendingRequests.delete(id);
            replyHandler.resolve(value);
        }
        else {
            throw new Error(`No reply handler for reply with id: ${id}`);
        }
    }
    handleReplyErr(id, error) {
        try {
            const replyHandler = this.pendingRequests.get(id);
            if (replyHandler) {
                this.pendingRequests.delete(id);
                replyHandler.reject(error);
            }
            else {
                throw new Error(`No reply handler for error reply with id: ${id}`);
            }
        }
        catch (err) {
            throw err;
        }
    }
    sendRequest(method, args) {
        // The last element of the request args might be a cancellation token. As these tokens are not serializable we have to remove it from the
        // args array and the `CANCELLATION_TOKEN_KEY` string instead.
        const cancellationToken = args.length && cancellation_1.CancellationToken.is(args[args.length - 1]) ? args.pop() : undefined;
        const id = this.nextMessageId++;
        const reply = new promise_util_1.Deferred();
        if (cancellationToken) {
            args.push(RpcProtocol.CANCELLATION_TOKEN_KEY);
        }
        this.pendingRequests.set(id, reply);
        const output = this.channel.getWriteBuffer();
        this.encoder.request(output, id, method, args);
        output.commit();
        if (cancellationToken === null || cancellationToken === void 0 ? void 0 : cancellationToken.isCancellationRequested) {
            this.sendCancel(id);
        }
        else {
            cancellationToken === null || cancellationToken === void 0 ? void 0 : cancellationToken.onCancellationRequested(() => this.sendCancel(id));
        }
        return reply.promise;
    }
    sendNotification(method, args) {
        // If the notification supports a CancellationToken, it needs to be treated like a request
        // because cancellation does not work with the simplified "fire and forget" approach of simple notifications.
        if (args.length && cancellation_1.CancellationToken.is(args[args.length - 1])) {
            this.sendRequest(method, args);
            return;
        }
        const output = this.channel.getWriteBuffer();
        this.encoder.notification(output, method, args, this.nextMessageId++);
        output.commit();
    }
    sendCancel(requestId) {
        const output = this.channel.getWriteBuffer();
        this.encoder.cancel(output, requestId);
        output.commit();
    }
    handleCancel(id) {
        const cancellationTokenSource = this.cancellationTokenSources.get(id);
        if (cancellationTokenSource) {
            cancellationTokenSource.cancel();
        }
    }
    async handleRequest(id, method, args) {
        const output = this.channel.getWriteBuffer();
        // Check if the last argument of the received args is the key for indicating that a cancellation token should be used
        // If so remove the key from the args and create a new cancellation token.
        const addToken = args.length && args[args.length - 1] === RpcProtocol.CANCELLATION_TOKEN_KEY ? args.pop() : false;
        if (addToken) {
            const tokenSource = new cancellation_1.CancellationTokenSource();
            this.cancellationTokenSources.set(id, tokenSource);
            args.push(tokenSource.token);
        }
        try {
            const result = await this.requestHandler(method, args);
            this.cancellationTokenSources.delete(id);
            this.encoder.replyOK(output, id, result);
            output.commit();
        }
        catch (err) {
            // In case of an error the output buffer might already contains parts of an message.
            // => Dispose the current buffer and retrieve a new, clean one for writing the response error.
            if (disposable_1.Disposable.is(output)) {
                output.dispose();
            }
            const errorOutput = this.channel.getWriteBuffer();
            this.cancellationTokenSources.delete(id);
            this.encoder.replyErr(errorOutput, id, err);
            errorOutput.commit();
        }
    }
    async handleNotify(method, args, id) {
        if (this.toDispose.disposed) {
            return;
        }
        this.onNotificationEmitter.fire({ method, args });
    }
}
exports.RpcProtocol = RpcProtocol;
RpcProtocol.CANCELLATION_TOKEN_KEY = 'add.cancellation.token';


/***/ }),

/***/ "../../packages/core/lib/common/message-service-protocol.js":
/*!******************************************************************!*\
  !*** ../../packages/core/lib/common/message-service-protocol.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageClient = exports.ProgressMessage = exports.MessageType = exports.messageServicePath = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const nls_1 = __webpack_require__(/*! ./nls */ "../../packages/core/lib/common/nls.js");
exports.messageServicePath = '/services/messageService';
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Error"] = 1] = "Error";
    MessageType[MessageType["Warning"] = 2] = "Warning";
    MessageType[MessageType["Info"] = 3] = "Info";
    MessageType[MessageType["Log"] = 4] = "Log";
    MessageType[MessageType["Progress"] = 5] = "Progress";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var ProgressMessage;
(function (ProgressMessage) {
    ProgressMessage.Cancel = nls_1.nls.localizeByDefault('Cancel');
    function isCancelable(message) {
        var _a;
        return !!((_a = message.options) === null || _a === void 0 ? void 0 : _a.cancelable);
    }
    ProgressMessage.isCancelable = isCancelable;
})(ProgressMessage = exports.ProgressMessage || (exports.ProgressMessage = {}));
let MessageClient = class MessageClient {
    /**
     * Show a message of the given type and possible actions to the user.
     * Resolve to a chosen action.
     * Never reject.
     *
     * To be implemented by an extension, e.g. by the messages extension.
     */
    showMessage(message) {
        console.info(message.text);
        return Promise.resolve(undefined);
    }
    /**
     * Show a progress message with possible actions to user.
     *
     * To be implemented by an extension, e.g. by the messages extension.
     */
    showProgress(progressId, message, cancellationToken) {
        console.info(message.text);
        return Promise.resolve(undefined);
    }
    /**
     * Update a previously created progress message.
     *
     * To be implemented by an extension, e.g. by the messages extension.
     */
    reportProgress(progressId, update, message, cancellationToken) {
        return Promise.resolve(undefined);
    }
};
MessageClient = __decorate([
    (0, inversify_1.injectable)()
], MessageClient);
exports.MessageClient = MessageClient;


/***/ }),

/***/ "../../packages/core/lib/common/message-service.js":
/*!*********************************************************!*\
  !*** ../../packages/core/lib/common/message-service.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageService = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const message_service_protocol_1 = __webpack_require__(/*! ./message-service-protocol */ "../../packages/core/lib/common/message-service-protocol.js");
const cancellation_1 = __webpack_require__(/*! ./cancellation */ "../../packages/core/lib/common/cancellation.js");
/**
 * Service to log and categorize messages, show progress information and offer actions.
 *
 * The messages are processed by this service and forwarded to an injected {@link MessageClient}.
 * For example "@theia/messages" provides such a client, rendering messages as notifications
 * in the frontend.
 *
 * ### Example usage
 *
 * ```typescript
 *   @inject(MessageService)
 *   protected readonly messageService: MessageService;
 *
 *   messageService.warn("Typings not available");
 *
 *   messageService.error("Could not restore state", ["Rollback", "Ignore"])
 *   .then(action => action === "Rollback" && rollback());
 * ```
 */
let MessageService = class MessageService {
    constructor(client) {
        this.client = client;
        this.progressIdPrefix = Math.random().toString(36).substring(5);
        this.counter = 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(message, ...args) {
        return this.processMessage(message_service_protocol_1.MessageType.Log, message, args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(message, ...args) {
        return this.processMessage(message_service_protocol_1.MessageType.Info, message, args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(message, ...args) {
        return this.processMessage(message_service_protocol_1.MessageType.Warning, message, args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(message, ...args) {
        return this.processMessage(message_service_protocol_1.MessageType.Error, message, args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processMessage(type, text, args) {
        if (!!args && args.length > 0) {
            const first = args[0];
            const actions = Array.from(new Set(args.filter(a => typeof a === 'string')));
            const options = (typeof first === 'object' && !Array.isArray(first))
                ? first
                : undefined;
            return this.client.showMessage({ type, options, text, actions });
        }
        return this.client.showMessage({ type, text });
    }
    /**
     * Shows the given message as a progress.
     *
     * @param message the message to show for the progress.
     * @param onDidCancel an optional callback which will be invoked if the progress indicator was canceled.
     *
     * @returns a promise resolving to a {@link Progress} object with which the progress can be updated.
     *
     * ### Example usage
     *
     * ```typescript
     *   @inject(MessageService)
     *   protected readonly messageService: MessageService;
     *
     *   // this will show "Progress" as a cancelable message
     *   this.messageService.showProgress({text: 'Progress'});
     *
     *   // this will show "Rolling back" with "Cancel" and an additional "Skip" action
     *   this.messageService.showProgress({
     *     text: `Rolling back`,
     *     actions: ["Skip"],
     *   },
     *   () => console.log("canceled"))
     *   .then((progress) => {
     *     // register if interested in the result (only necessary for custom actions)
     *     progress.result.then((result) => {
     *       // will be 'Cancel', 'Skip' or `undefined`
     *       console.log("result is", result);
     *     });
     *     progress.report({message: "Cleaning references", work: {done: 10, total: 100}});
     *     progress.report({message: "Restoring previous state", work: {done: 80, total: 100}});
     *     progress.report({message: "Complete", work: {done: 100, total: 100}});
     *     // we are done so we can cancel the progress message, note that this will also invoke `onDidCancel`
     *     progress.cancel();
     *   });
     * ```
     */
    async showProgress(message, onDidCancel) {
        var _a;
        const id = this.newProgressId();
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        const report = (update) => {
            this.client.reportProgress(id, update, message, cancellationSource.token);
        };
        const type = (_a = message.type) !== null && _a !== void 0 ? _a : message_service_protocol_1.MessageType.Progress;
        const actions = new Set(message.actions);
        if (message_service_protocol_1.ProgressMessage.isCancelable(message)) {
            actions.delete(message_service_protocol_1.ProgressMessage.Cancel);
            actions.add(message_service_protocol_1.ProgressMessage.Cancel);
        }
        const clientMessage = { ...message, type, actions: Array.from(actions) };
        const result = this.client.showProgress(id, clientMessage, cancellationSource.token);
        if (message_service_protocol_1.ProgressMessage.isCancelable(message) && typeof onDidCancel === 'function') {
            result.then(value => {
                if (value === message_service_protocol_1.ProgressMessage.Cancel) {
                    onDidCancel();
                }
            });
        }
        return {
            id,
            cancel: () => cancellationSource.cancel(),
            result,
            report
        };
    }
    newProgressId() {
        return `${this.progressIdPrefix}-${++this.counter}`;
    }
};
MessageService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(message_service_protocol_1.MessageClient)),
    __metadata("design:paramtypes", [message_service_protocol_1.MessageClient])
], MessageService);
exports.MessageService = MessageService;


/***/ }),

/***/ "../../packages/core/lib/common/messaging/connection-error-handler.js":
/*!****************************************************************************!*\
  !*** ../../packages/core/lib/common/messaging/connection-error-handler.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectionErrorHandler = void 0;
class ConnectionErrorHandler {
    constructor(options) {
        this.restarts = [];
        this.options = {
            maxErrors: 3,
            maxRestarts: 5,
            restartInterval: 3,
            ...options
        };
    }
    shouldStop(error, count) {
        return !count || count > this.options.maxErrors;
    }
    shouldRestart() {
        this.restarts.push(Date.now());
        if (this.restarts.length <= this.options.maxRestarts) {
            return true;
        }
        const diff = this.restarts[this.restarts.length - 1] - this.restarts[0];
        if (diff <= this.options.restartInterval * 60 * 1000) {
            // eslint-disable-next-line max-len
            this.options.logger.error(`The ${this.options.serverName} server crashed ${this.options.maxRestarts} times in the last ${this.options.restartInterval} minutes. The server will not be restarted.`);
            return false;
        }
        this.restarts.shift();
        return true;
    }
}
exports.ConnectionErrorHandler = ConnectionErrorHandler;


/***/ }),

/***/ "../../packages/core/lib/common/messaging/handler.js":
/*!***********************************************************!*\
  !*** ../../packages/core/lib/common/messaging/handler.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectionHandler = void 0;
exports.ConnectionHandler = Symbol('ConnectionHandler');


/***/ }),

/***/ "../../packages/core/lib/common/messaging/index.js":
/*!*********************************************************!*\
  !*** ../../packages/core/lib/common/messaging/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./handler */ "../../packages/core/lib/common/messaging/handler.js"), exports);
__exportStar(__webpack_require__(/*! ./proxy-factory */ "../../packages/core/lib/common/messaging/proxy-factory.js"), exports);
__exportStar(__webpack_require__(/*! ./connection-error-handler */ "../../packages/core/lib/common/messaging/connection-error-handler.js"), exports);


/***/ }),

/***/ "../../packages/core/lib/common/messaging/proxy-factory.js":
/*!*****************************************************************!*\
  !*** ../../packages/core/lib/common/messaging/proxy-factory.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JsonRpcProxyFactory = exports.JsonRpcConnectionHandler = exports.RpcProxyFactory = exports.RpcConnectionHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const rpc_message_encoder_1 = __webpack_require__(/*! ../message-rpc/rpc-message-encoder */ "../../packages/core/lib/common/message-rpc/rpc-message-encoder.js");
const application_error_1 = __webpack_require__(/*! ../application-error */ "../../packages/core/lib/common/application-error.js");
const event_1 = __webpack_require__(/*! ../event */ "../../packages/core/lib/common/event.js");
const rpc_protocol_1 = __webpack_require__(/*! ../message-rpc/rpc-protocol */ "../../packages/core/lib/common/message-rpc/rpc-protocol.js");
const promise_util_1 = __webpack_require__(/*! ../promise-util */ "../../packages/core/lib/common/promise-util.js");
const inversify_1 = __webpack_require__(/*! ../../../shared/inversify */ "../../packages/core/shared/inversify/index.js");
class RpcConnectionHandler {
    constructor(path, targetFactory, factoryConstructor = RpcProxyFactory) {
        this.path = path;
        this.targetFactory = targetFactory;
        this.factoryConstructor = factoryConstructor;
    }
    onConnection(connection) {
        const factory = new this.factoryConstructor();
        const proxy = factory.createProxy();
        factory.target = this.targetFactory(proxy);
        factory.listen(connection);
    }
}
exports.RpcConnectionHandler = RpcConnectionHandler;
const defaultRpcProtocolFactory = (channel, requestHandler) => new rpc_protocol_1.RpcProtocol(channel, requestHandler);
/**
 * Factory for RPC proxy objects.
 *
 * A RPC proxy exposes the programmatic interface of an object through
 * Theia's RPC protocol. This allows remote programs to call methods of this objects by
 * sending RPC requests. This takes place over a bi-directional stream,
 * where both ends can expose an object and both can call methods on each other'
 * exposed object.
 *
 * For example, assuming we have an object of the following type on one end:
 *
 *     class Foo {
 *         bar(baz: number): number { return baz + 1 }
 *     }
 *
 * which we want to expose through a RPC interface.  We would do:
 *
 *     let target = new Foo()
 *     let factory = new RpcProxyFactory<Foo>('/foo', target)
 *     factory.onConnection(connection)
 *
 * The party at the other end of the `connection`, in order to remotely call
 * methods on this object would do:
 *
 *     let factory = new RpcProxyFactory<Foo>('/foo')
 *     factory.onConnection(connection)
 *     let proxy = factory.createProxy();
 *     let result = proxy.bar(42)
 *     // result is equal to 43
 *
 * One the wire, it would look like this:
 *
 *     --> { "type":"1", "id": 1, "method": "bar", "args": [42]}
 *     <-- { "type":"3", "id": 1, "res": 43}
 *
 * Note that in the code of the caller, we didn't pass a target object to
 * RpcProxyFactory, because we don't want/need to expose an object.
 * If we had passed a target object, the other side could've called methods on
 * it.
 *
 * @param <T> - The type of the object to expose to RPC.
 */
class RpcProxyFactory {
    /**
     * Build a new RpcProxyFactory.
     *
     * @param target - The object to expose to RPC methods calls.  If this
     *   is omitted, the proxy won't be able to handle requests, only send them.
     */
    constructor(target, rpcProtocolFactory = defaultRpcProtocolFactory) {
        this.target = target;
        this.rpcProtocolFactory = rpcProtocolFactory;
        this.onDidOpenConnectionEmitter = new event_1.Emitter();
        this.onDidCloseConnectionEmitter = new event_1.Emitter();
        this.waitForConnection();
    }
    waitForConnection() {
        this.rpcDeferred = new promise_util_1.Deferred();
        this.rpcDeferred.promise.then(protocol => {
            protocol.channel.onClose(() => {
                this.onDidCloseConnectionEmitter.fire(undefined);
                // Wait for connection in case the backend reconnects
                this.waitForConnection();
            });
            this.onDidOpenConnectionEmitter.fire(undefined);
        });
    }
    /**
     * Connect a {@link Channel} to the factory by creating an {@link RpcProtocol} on top of it.
     *
     * This protocol will be used to send/receive RPC requests and
     * responses.
     */
    listen(channel) {
        const protocol = this.rpcProtocolFactory(channel, (meth, args) => this.onRequest(meth, ...args));
        protocol.onNotification(event => this.onNotification(event.method, ...event.args));
        this.rpcDeferred.resolve(protocol);
    }
    /**
     * Process an incoming RPC method call.
     *
     * onRequest is called when the RPC connection received a method call
     * request.  It calls the corresponding method on [[target]].
     *
     * The return value is a Promise object that is resolved with the return
     * value of the method call, if it is successful.  The promise is rejected
     * if the called method does not exist or if it throws.
     *
     * @returns A promise of the method call completion.
     */
    async onRequest(method, ...args) {
        try {
            if (this.target) {
                return await this.target[method](...args);
            }
            else {
                throw new Error(`no target was set to handle ${method}`);
            }
        }
        catch (error) {
            const e = this.serializeError(error);
            if (e instanceof rpc_message_encoder_1.ResponseError) {
                throw e;
            }
            const reason = e.message || '';
            const stack = e.stack || '';
            console.error(`Request ${method} failed with error: ${reason}`, stack);
            throw e;
        }
    }
    /**
     * Process an incoming RPC notification.
     *
     * Same as [[onRequest]], but called on incoming notifications rather than
     * methods calls.
     */
    onNotification(method, ...args) {
        if (this.target) {
            this.target[method](...args);
        }
    }
    /**
     * Create a Proxy exposing the interface of an object of type T.  This Proxy
     * can be used to do RPC method calls on the remote target object as
     * if it was local.
     *
     * If `T` implements `RpcServer` then a client is used as a target object for a remote target object.
     */
    createProxy() {
        const result = new Proxy(this, this);
        return result;
    }
    /**
     * Get a callable object that executes a RPC method call.
     *
     * Getting a property on the Proxy object returns a callable that, when
     * called, executes a RPC call.  The name of the property defines the
     * method to be called.  The callable takes a variable number of arguments,
     * which are passed in the RPC method call.
     *
     * For example, if you have a Proxy object:
     *
     *     let fooProxyFactory = RpcProxyFactory<Foo>('/foo')
     *     let fooProxy = fooProxyFactory.createProxy()
     *
     * accessing `fooProxy.bar` will return a callable that, when called,
     * executes a RPC method call to method `bar`.  Therefore, doing
     * `fooProxy.bar()` will call the `bar` method on the remote Foo object.
     *
     * @param target - unused.
     * @param p - The property accessed on the Proxy object.
     * @param receiver - unused.
     * @returns A callable that executes the RPC call.
     */
    get(target, p, receiver) {
        if (p === 'setClient') {
            return (client) => {
                this.target = client;
            };
        }
        if (p === 'getClient') {
            return () => this.target;
        }
        if (p === 'onDidOpenConnection') {
            return this.onDidOpenConnectionEmitter.event;
        }
        if (p === 'onDidCloseConnection') {
            return this.onDidCloseConnectionEmitter.event;
        }
        if (p === 'then') {
            // Prevent inversify from identifying this proxy as a promise object.
            return undefined;
        }
        const isNotify = this.isNotification(p);
        return (...args) => {
            const method = p.toString();
            const capturedError = new Error(`Request '${method}' failed`);
            return this.rpcDeferred.promise.then(connection => new Promise((resolve, reject) => {
                try {
                    if (isNotify) {
                        connection.sendNotification(method, args);
                        resolve(undefined);
                    }
                    else {
                        const resultPromise = connection.sendRequest(method, args);
                        resultPromise
                            .catch((err) => reject(this.deserializeError(capturedError, err)))
                            .then((result) => resolve(result));
                    }
                }
                catch (err) {
                    reject(err);
                }
            }));
        };
    }
    /**
     * Return whether the given property represents a notification.
     *
     * A property leads to a notification rather than a method call if its name
     * begins with `notify` or `on`.
     *
     * @param p - The property being called on the proxy.
     * @return Whether `p` represents a notification.
     */
    isNotification(p) {
        return p.toString().startsWith('notify') || p.toString().startsWith('on');
    }
    serializeError(e) {
        if (application_error_1.ApplicationError.is(e)) {
            return new rpc_message_encoder_1.ResponseError(e.code, '', Object.assign({ kind: 'application' }, e.toJson()));
        }
        return e;
    }
    deserializeError(capturedError, e) {
        if (e instanceof rpc_message_encoder_1.ResponseError) {
            const capturedStack = capturedError.stack || '';
            if (e.data && e.data.kind === 'application') {
                const { stack, data, message } = e.data;
                return application_error_1.ApplicationError.fromJson(e.code, {
                    message: message || capturedError.message,
                    data,
                    stack: `${capturedStack}\nCaused by: ${stack}`
                });
            }
            e.stack = capturedStack;
        }
        return e;
    }
}
exports.RpcProxyFactory = RpcProxyFactory;
/**
 * @deprecated since 1.39.0 use `RpcConnectionHandler` instead
 */
class JsonRpcConnectionHandler extends RpcConnectionHandler {
}
exports.JsonRpcConnectionHandler = JsonRpcConnectionHandler;
/**
 * @deprecated since 1.39.0 use `RpcProxyFactory` instead
 */
class JsonRpcProxyFactory extends RpcProxyFactory {
}
exports.JsonRpcProxyFactory = JsonRpcProxyFactory;
// eslint-disable-next-line deprecation/deprecation
(0, inversify_1.decorate)((0, inversify_1.injectable)(), JsonRpcProxyFactory);
// eslint-disable-next-line deprecation/deprecation
(0, inversify_1.decorate)((0, inversify_1.unmanaged)(), JsonRpcProxyFactory, 0);


/***/ }),

/***/ "../../packages/core/lib/common/nls.js":
/*!*********************************************!*\
  !*** ../../packages/core/lib/common/nls.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 TypeFox and others.
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
exports.nls = void 0;
const localization_1 = __webpack_require__(/*! ./i18n/localization */ "../../packages/core/lib/common/i18n/localization.js");
var nls;
(function (nls) {
    nls.defaultLocale = 'en';
    nls.localeId = 'localeId';
    nls.locale = typeof window === 'object' && window && window.localStorage.getItem(nls.localeId) || undefined;
    let keyProvider;
    /**
     * Automatically localizes a text if that text also exists in the vscode repository.
     */
    function localizeByDefault(defaultValue, ...args) {
        if (nls.localization) {
            const key = getDefaultKey(defaultValue);
            if (key) {
                return localize(key, defaultValue, ...args);
            }
            else {
                console.warn(`Could not find translation key for default value: "${defaultValue}"`);
            }
        }
        return localization_1.Localization.format(defaultValue, args);
    }
    nls.localizeByDefault = localizeByDefault;
    function getDefaultKey(defaultValue) {
        if (!keyProvider) {
            keyProvider = new LocalizationKeyProvider();
        }
        const key = keyProvider.get(defaultValue);
        if (key) {
            return key;
        }
        return '';
    }
    nls.getDefaultKey = getDefaultKey;
    function localize(key, defaultValue, ...args) {
        return localization_1.Localization.localize(nls.localization, key, defaultValue, ...args);
    }
    nls.localize = localize;
    function isSelectedLocale(id) {
        if (nls.locale === undefined && id === nls.defaultLocale) {
            return true;
        }
        return nls.locale === id;
    }
    nls.isSelectedLocale = isSelectedLocale;
    function setLocale(id) {
        window.localStorage.setItem(nls.localeId, id);
    }
    nls.setLocale = setLocale;
})(nls = exports.nls || (exports.nls = {}));
class LocalizationKeyProvider {
    constructor() {
        this.data = this.buildData();
    }
    get(defaultValue) {
        const normalized = localization_1.Localization.normalize(defaultValue);
        return this.data.get(normalized) || this.data.get(normalized.toUpperCase());
    }
    /**
     * Transforms the data coming from the `nls.metadata.json` file into a map.
     * The original data contains arrays of keys and messages.
     * The result is a map that matches each message to the key that belongs to it.
     *
     * This allows us to skip the key in the localization process and map the original english default values to their translations in different languages.
     */
    buildData() {
        const bundles = __webpack_require__(/*! ../../src/common/i18n/nls.metadata.json */ "../../packages/core/src/common/i18n/nls.metadata.json");
        const keys = bundles.keys;
        const messages = bundles.messages;
        const data = new Map();
        const keysAndMessages = this.buildKeyMessageTuples(keys, messages);
        for (const { key, message } of keysAndMessages) {
            data.set(message, key);
        }
        // Second pass adds each message again in upper case, if the message doesn't already exist in upper case
        // The second pass is needed to not accidentally override any translations which actually use the upper case message
        for (const { key, message } of keysAndMessages) {
            const upperMessage = message.toUpperCase();
            if (!data.has(upperMessage)) {
                data.set(upperMessage, key);
            }
        }
        return data;
    }
    buildKeyMessageTuples(keys, messages) {
        const list = [];
        for (const [fileKey, messageBundle] of Object.entries(messages)) {
            const keyBundle = keys[fileKey];
            for (let i = 0; i < messageBundle.length; i++) {
                const message = localization_1.Localization.normalize(messageBundle[i]);
                const key = keyBundle[i];
                const localizationKey = this.buildKey(typeof key === 'string' ? key : key.key, fileKey);
                list.push({
                    key: localizationKey,
                    message
                });
            }
        }
        return list;
    }
    buildKey(key, filepath) {
        return `vscode/${localization_1.Localization.transformKey(filepath)}/${key}`;
    }
}


/***/ }),

/***/ "../../packages/core/lib/common/numbers.js":
/*!*************************************************!*\
  !*** ../../packages/core/lib/common/numbers.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 TypeFox and others.
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
exports.MAX_SAFE_INTEGER = void 0;
/**
 * The maximum safe integer (`2^32-1`) is used as a placeholder for large numbers which are not allowed to be floats.
 * For example as line/column arguments for monaco-ranges.
 */
exports.MAX_SAFE_INTEGER = 2147483647;


/***/ }),

/***/ "../../packages/core/lib/common/objects.js":
/*!*************************************************!*\
  !*** ../../packages/core/lib/common/objects.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.cloneAndChange = exports.isEmpty = exports.notEmpty = exports.deepFreeze = exports.deepClone = void 0;
const types_1 = __webpack_require__(/*! ./types */ "../../packages/core/lib/common/types.js");
function deepClone(obj) {
    if (!(0, types_1.isObject)(obj)) {
        return obj;
    }
    if (obj instanceof RegExp) {
        return obj;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach((key) => {
        const prop = obj[key];
        if ((0, types_1.isObject)(prop)) {
            result[key] = deepClone(prop);
        }
        else {
            result[key] = prop;
        }
    });
    return result;
}
exports.deepClone = deepClone;
function deepFreeze(obj) {
    if (!(0, types_1.isObject)(obj)) {
        return obj;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stack = [obj];
    while (stack.length > 0) {
        const objectToFreeze = stack.shift();
        Object.freeze(objectToFreeze);
        for (const key in objectToFreeze) {
            if (_hasOwnProperty.call(objectToFreeze, key)) {
                const prop = objectToFreeze[key];
                if ((0, types_1.isObject)(prop) && !Object.isFrozen(prop)) {
                    stack.push(prop);
                }
            }
        }
    }
    return obj;
}
exports.deepFreeze = deepFreeze;
const _hasOwnProperty = Object.prototype.hasOwnProperty;
function notEmpty(arg) {
    // eslint-disable-next-line no-null/no-null
    return arg !== undefined && arg !== null;
}
exports.notEmpty = notEmpty;
/**
 * `true` if the argument is an empty object. Otherwise, `false`.
 */
function isEmpty(arg) {
    return Object.keys(arg).length === 0 && arg.constructor === Object;
}
exports.isEmpty = isEmpty;
// copied and modified from https://github.com/microsoft/vscode/blob/1.76.0/src/vs/base/common/objects.ts#L45-L83
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cloneAndChange(obj, changer, seen) {
    // impossible to clone an undefined or null object
    // eslint-disable-next-line no-null/no-null
    if ((0, types_1.isUndefined)(obj) || obj === null) {
        return obj;
    }
    const changed = changer(obj);
    if (!(0, types_1.isUndefined)(changed)) {
        return changed;
    }
    if (Array.isArray(obj)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r1 = [];
        for (const e of obj) {
            r1.push(cloneAndChange(e, changer, seen));
        }
        return r1;
    }
    if ((0, types_1.isObject)(obj)) {
        if (seen.has(obj)) {
            throw new Error('Cannot clone recursive data-structure');
        }
        seen.add(obj);
        const r2 = {};
        for (const i2 in obj) {
            if (_hasOwnProperty.call(obj, i2)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                r2[i2] = cloneAndChange(obj[i2], changer, seen);
            }
        }
        seen.delete(obj);
        return r2;
    }
    return obj;
}
exports.cloneAndChange = cloneAndChange;


/***/ }),

/***/ "../../packages/core/lib/common/os.js":
/*!********************************************!*\
  !*** ../../packages/core/lib/common/os.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OSBackendProvider = exports.OSBackendProviderPath = exports.OS = exports.cmd = exports.EOL = exports.isOSX = exports.isWindows = void 0;
function is(userAgent, platform) {
    if (typeof navigator !== 'undefined') {
        if (navigator.userAgent && navigator.userAgent.indexOf(userAgent) >= 0) {
            return true;
        }
    }
    if (typeof process !== 'undefined') {
        return (process.platform === platform);
    }
    return false;
}
exports.isWindows = is('Windows', 'win32');
exports.isOSX = is('Mac', 'darwin');
exports.EOL = exports.isWindows ? '\r\n' : '\n';
function cmd(command, ...args) {
    return [
        exports.isWindows ? 'cmd' : command,
        exports.isWindows ? ['/c', command, ...args] : args
    ];
}
exports.cmd = cmd;
var OS;
(function (OS) {
    /**
     * Enumeration of the supported operating systems.
     */
    let Type;
    (function (Type) {
        Type["Windows"] = "Windows";
        Type["Linux"] = "Linux";
        Type["OSX"] = "OSX";
    })(Type = OS.Type || (OS.Type = {}));
    /**
     * Returns with the type of the operating system. If it is neither [Windows](isWindows) nor [OS X](isOSX), then
     * it always return with the `Linux` OS type.
     */
    function type() {
        if (exports.isWindows) {
            return Type.Windows;
        }
        if (exports.isOSX) {
            return Type.OSX;
        }
        return Type.Linux;
    }
    OS.type = type;
    OS.backend = {
        type,
        isWindows: exports.isWindows,
        isOSX: exports.isOSX,
        EOL: exports.EOL
    };
})(OS = exports.OS || (exports.OS = {}));
exports.OSBackendProviderPath = '/os';
exports.OSBackendProvider = Symbol('OSBackendProvider');


/***/ }),

/***/ "../../packages/core/lib/common/path.js":
/*!**********************************************!*\
  !*** ../../packages/core/lib/common/path.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Path = void 0;
/**
 * On POSIX:
 * ┌──────────────────────┬────────────┐
 * │          dir         │    base    │
 * ├──────┬               ├──────┬─────┤
 * │ root │               │ name │ ext │
 * "  /     home/user/dir / file  .txt "
 * └──────┴───────────────┴──────┴─────┘
 *
 * On Windows:
 * ┌──────────────────────┬────────────┐
 * │           dir        │    base    │
 * ├──────┬               ├──────┬─────┤
 * │ root │               │ name │ ext │
 * "  /c: / home/user/dir / file  .txt "
 * └──────┴───────────────┴──────┴─────┘
 */
const os_1 = __webpack_require__(/*! ./os */ "../../packages/core/lib/common/os.js");
class Path {
    /**
     * The raw should be normalized, meaning that only '/' is allowed as a path separator.
     */
    constructor(raw) {
        raw = Path.normalizePathSeparator(raw);
        this.raw = Path.normalizeDrive(raw);
        const firstIndex = this.raw.indexOf(Path.separator);
        const lastIndex = this.raw.lastIndexOf(Path.separator);
        this.isAbsolute = firstIndex === 0;
        this.base = lastIndex === -1 ? this.raw : this.raw.substring(lastIndex + 1);
        this.isRoot = this.isAbsolute && firstIndex === lastIndex && (!this.base || Path.isDrive(this.base));
        this.root = this.computeRoot();
        const extIndex = this.base.lastIndexOf('.');
        this.name = extIndex === -1 ? this.base : this.base.substring(0, extIndex);
        this.ext = extIndex === -1 ? '' : this.base.substring(extIndex);
    }
    static isDrive(segment) {
        return segment.endsWith(':');
    }
    /**
     * vscode-uri always normalizes drive letters to lower case:
     * https://github.com/Microsoft/vscode-uri/blob/b1d3221579f97f28a839b6f996d76fc45e9964d8/src/index.ts#L1025
     * Theia path should be adjusted to this.
     */
    static normalizeDrive(path) {
        // lower-case windows drive letters in /C:/fff or C:/fff
        if (path.length >= 3 && path.charCodeAt(0) === 47 /* '/' */ && path.charCodeAt(2) === 58 /* ':' */) {
            const code = path.charCodeAt(1);
            if (code >= 65 /* A */ && code <= 90 /* Z */) {
                path = `/${String.fromCharCode(code + 32)}:${path.substring(3)}`; // "/c:".length === 3
            }
        }
        else if (path.length >= 2 && path.charCodeAt(1) === 58 /* ':' */) {
            const code = path.charCodeAt(0);
            if (code >= 65 /* A */ && code <= 90 /* Z */) {
                path = `${String.fromCharCode(code + 32)}:${path.substring(2)}`; // "c:".length === 2
            }
            if (path.charCodeAt(0) !== 47 /* '/' */) {
                path = `${String.fromCharCode(47)}${path}`;
            }
        }
        return path;
    }
    /**
     * Normalize path separator to use Path.separator
     * @param Path candidate to normalize
     * @returns Normalized string path
     */
    static normalizePathSeparator(path) {
        return path.split(/[\\]/).join(Path.separator);
    }
    /**
     * Creates a windows path from the given path string.
     * A windows path uses an upper case drive letter and backwards slashes.
     * @param path The input path
     * @returns Windows style path
     */
    static windowsPath(path) {
        const offset = path.charAt(0) === '/' ? 1 : 0;
        if (path.charAt(offset + 1) === ':') {
            const driveLetter = path.charAt(offset).toUpperCase();
            const substring = path.substring(offset + 2).replace(/\//g, '\\');
            return `${driveLetter}:${substring || '\\'}`;
        }
        return path.replace(/\//g, '\\');
    }
    /**
     * Tildify path, replacing `home` with `~` if user's `home` is present at the beginning of the path.
     * This is a non-operation for Windows.
     *
     * @param resourcePath
     * @param home
     */
    static tildify(resourcePath, home) {
        const path = new Path(resourcePath);
        const isWindows = path.root && Path.isDrive(path.root.base);
        if (!isWindows && home && resourcePath.indexOf(`${home}/`) === 0) {
            return resourcePath.replace(`${home}/`, '~/');
        }
        return resourcePath;
    }
    /**
     * Untildify path, replacing `~` with `home` if `~` present at the beginning of the path.
     * This is a non-operation for Windows.
     *
     * @param resourcePath
     * @param home
     */
    static untildify(resourcePath, home) {
        if (resourcePath.startsWith('~')) {
            const untildifiedResource = resourcePath.replace(/^~/, home);
            const untildifiedPath = new Path(untildifiedResource);
            const isWindows = untildifiedPath.root && Path.isDrive(untildifiedPath.root.base);
            if (!isWindows && home && untildifiedResource.startsWith(`${home}`)) {
                return untildifiedResource;
            }
        }
        return resourcePath;
    }
    computeRoot() {
        // '/' -> '/'
        // '/c:' -> '/c:'
        if (this.isRoot) {
            return this;
        }
        // 'foo/bar' -> `undefined`
        if (!this.isAbsolute) {
            return undefined;
        }
        const index = this.raw.indexOf(Path.separator, Path.separator.length);
        if (index === -1) {
            // '/foo/bar' -> '/'
            return new Path(Path.separator);
        }
        // '/c:/foo/bar' -> '/c:'
        // '/foo/bar' -> '/'
        return new Path(this.raw.substring(0, index)).root;
    }
    /**
     * Returns the parent directory if it exists (`hasDir === true`) or `this` otherwise.
     */
    get dir() {
        if (this._dir === undefined) {
            this._dir = this.computeDir();
        }
        return this._dir;
    }
    /**
     * Returns `true` if this has a parent directory, `false` otherwise.
     *
     * _This implementation returns `true` if and only if this is not the root dir and
     * there is a path separator in the raw path._
     */
    get hasDir() {
        return !this.isRoot && this.raw.lastIndexOf(Path.separator) !== -1;
    }
    computeDir() {
        if (!this.hasDir) {
            return this;
        }
        const lastIndex = this.raw.lastIndexOf(Path.separator);
        if (this.isAbsolute) {
            const firstIndex = this.raw.indexOf(Path.separator);
            if (firstIndex === lastIndex) {
                return new Path(this.raw.substring(0, firstIndex + 1));
            }
        }
        return new Path(this.raw.substring(0, lastIndex));
    }
    join(...paths) {
        const relativePath = paths.filter(s => !!s).join(Path.separator);
        if (!relativePath) {
            return this;
        }
        if (this.raw.endsWith(Path.separator)) {
            return new Path(this.raw + relativePath);
        }
        return new Path(this.raw + Path.separator + relativePath);
    }
    /**
     *
     * @param paths portions of a path
     * @returns a new Path if an absolute path can be computed from the segments passed in + this.raw
     * If no absolute path can be computed, returns undefined.
     *
     * Processes the path segments passed in from right to left (reverse order) concatenating until an
     * absolute path is found.
     */
    resolve(...paths) {
        const segments = paths.slice().reverse(); // Don't mutate the caller's array.
        segments.push(this.raw);
        let result = new Path('');
        for (const segment of segments) {
            if (segment) {
                const next = new Path(segment).join(result.raw);
                if (next.isAbsolute) {
                    return next.normalize();
                }
                result = next;
            }
        }
    }
    toString() {
        return this.raw;
    }
    /**
     * Converts the current path into a file system path.
     * @param format Determines the format of the path.
     * If `undefined`, the format will be determined by the `OS.backend.type` value.
     * @returns A file system path.
     */
    fsPath(format) {
        if (format === Path.Format.Windows || (format === undefined && os_1.OS.backend.isWindows)) {
            return Path.windowsPath(this.raw);
        }
        else {
            return this.raw;
        }
    }
    relative(path) {
        if (this.raw === path.raw) {
            return new Path('');
        }
        if (!this.raw || !path.raw) {
            return undefined;
        }
        const raw = this.base ? this.raw + Path.separator : this.raw;
        if (!path.raw.startsWith(raw)) {
            return undefined;
        }
        const relativePath = path.raw.substring(raw.length);
        return new Path(relativePath);
    }
    isEqualOrParent(path) {
        return !!this.relative(path);
    }
    relativity(path) {
        const relative = this.relative(path);
        if (relative) {
            const relativeStr = relative.toString();
            if (relativeStr === '') {
                return 0;
            }
            return relativeStr.split(Path.separator).length;
        }
        return -1;
    }
    /*
     * return a normalized Path, resolving '..' and '.' segments
     */
    normalize() {
        const trailingSlash = this.raw.endsWith('/');
        const pathArray = this.toString().split('/');
        const resultArray = [];
        pathArray.forEach((value, index) => {
            if (!value || value === '.') {
                return;
            }
            if (value === '..') {
                if (resultArray.length && resultArray[resultArray.length - 1] !== '..') {
                    resultArray.pop();
                }
                else if (!this.isAbsolute) {
                    resultArray.push('..');
                }
            }
            else {
                resultArray.push(value);
            }
        });
        if (resultArray.length === 0) {
            if (this.isRoot) {
                return new Path('/');
            }
            else {
                return new Path('.');
            }
        }
        return new Path((this.isAbsolute ? '/' : '') + resultArray.join('/') + (trailingSlash ? '/' : ''));
    }
}
exports.Path = Path;
Path.separator = '/';
(function (Path) {
    let Format;
    (function (Format) {
        Format[Format["Posix"] = 0] = "Posix";
        Format[Format["Windows"] = 1] = "Windows";
    })(Format = Path.Format || (Path.Format = {}));
})(Path = exports.Path || (exports.Path = {}));


/***/ }),

/***/ "../../packages/core/lib/common/performance/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/lib/common/performance/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 STMicroelectronics and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./measurement */ "../../packages/core/lib/common/performance/measurement.js"), exports);
__exportStar(__webpack_require__(/*! ./stopwatch */ "../../packages/core/lib/common/performance/stopwatch.js"), exports);
__exportStar(__webpack_require__(/*! ./measurement-protocol */ "../../packages/core/lib/common/performance/measurement-protocol.js"), exports);


/***/ }),

/***/ "../../packages/core/lib/common/performance/measurement-protocol.js":
/*!**************************************************************************!*\
  !*** ../../packages/core/lib/common/performance/measurement-protocol.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
* Copyright (c) 2021 STMicroelectronics and others.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License 2.0 which is available at
* http://www.eclipse.org/legal/epl-2.0.
*
* This Source Code may also be made available under the following Secondary
* Licenses when the conditions for such availability set forth in the Eclipse
* Public License v. 2.0 are satisfied: GNU General Public License, version 2
* with the GNU Classpath Exception which is available at
* https://www.gnu.org/software/classpath/license.html.
*
* SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
*******************************************************************************/
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
exports.NullBackendStopwatch = exports.DefaultBackendStopwatch = exports.BackendStopwatchOptions = exports.stopwatchPath = exports.BackendStopwatch = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const stopwatch_1 = __webpack_require__(/*! ./stopwatch */ "../../packages/core/lib/common/performance/stopwatch.js");
exports.BackendStopwatch = Symbol('BackendStopwatch');
/** API path of the stopwatch service that exposes the back-end stopwatch to clients. */
exports.stopwatchPath = '/services/stopwatch';
exports.BackendStopwatchOptions = Symbol('BackendStopwatchOptions');
/**
 * Default implementation of the (remote) back-end stopwatch service.
 */
let DefaultBackendStopwatch = class DefaultBackendStopwatch {
    constructor() {
        this.measurements = new Map();
        this.idSequence = 0;
    }
    start(name, options) {
        const result = ++this.idSequence;
        this.measurements.set(result, this.stopwatch.start(name, options));
        return result;
    }
    stop(measurementToken, message, messageArgs) {
        const measurement = this.measurements.get(measurementToken);
        if (measurement) {
            this.measurements.delete(measurementToken);
            measurement.log(message, ...messageArgs);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(stopwatch_1.Stopwatch),
    __metadata("design:type", stopwatch_1.Stopwatch)
], DefaultBackendStopwatch.prototype, "stopwatch", void 0);
DefaultBackendStopwatch = __decorate([
    (0, inversify_1.injectable)()
], DefaultBackendStopwatch);
exports.DefaultBackendStopwatch = DefaultBackendStopwatch;
/**
 * No-op implementation of the (remote) back-end stopwatch service.
 */
let NullBackendStopwatch = class NullBackendStopwatch {
    start() {
        return Promise.resolve(0);
    }
    stop() {
        return Promise.resolve();
    }
};
NullBackendStopwatch = __decorate([
    (0, inversify_1.injectable)()
], NullBackendStopwatch);
exports.NullBackendStopwatch = NullBackendStopwatch;


/***/ }),

/***/ "../../packages/core/lib/common/performance/measurement.js":
/*!*****************************************************************!*\
  !*** ../../packages/core/lib/common/performance/measurement.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/********************************************************************************
* Copyright (c) 2021 STMicroelectronics and others.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License 2.0 which is available at
* http://www.eclipse.org/legal/epl-2.0.
*
* This Source Code may also be made available under the following Secondary
* Licenses when the conditions for such availability set forth in the Eclipse
* Public License v. 2.0 are satisfied: GNU General Public License, version 2
* with the GNU Classpath Exception which is available at
* https://www.gnu.org/software/classpath/license.html.
*
* SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
*******************************************************************************/
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "../../packages/core/lib/common/performance/stopwatch.js":
/*!***************************************************************!*\
  !*** ../../packages/core/lib/common/performance/stopwatch.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
* Copyright (c) 2021 STMicroelectronics and others.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License 2.0 which is available at
* http://www.eclipse.org/legal/epl-2.0.
*
* This Source Code may also be made available under the following Secondary
* Licenses when the conditions for such availability set forth in the Eclipse
* Public License v. 2.0 are satisfied: GNU General Public License, version 2
* with the GNU Classpath Exception which is available at
* https://www.gnu.org/software/classpath/license.html.
*
* SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
*******************************************************************************/
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
exports.Stopwatch = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const logger_1 = __webpack_require__(/*! ../logger */ "../../packages/core/lib/common/logger.js");
const event_1 = __webpack_require__(/*! ../event */ "../../packages/core/lib/common/event.js");
/** The default log level for measurements that are not otherwise configured with a default. */
const DEFAULT_LOG_LEVEL = logger_1.LogLevel.INFO;
/**
 * A factory of {@link Measurement}s for performance logging.
 */
let Stopwatch = class Stopwatch {
    constructor(defaultLogOptions) {
        this.defaultLogOptions = defaultLogOptions;
        this._storedMeasurements = [];
        this.onDidAddMeasurementResultEmitter = new event_1.Emitter();
        if (!defaultLogOptions.defaultLogLevel) {
            defaultLogOptions.defaultLogLevel = DEFAULT_LOG_LEVEL;
        }
        if (defaultLogOptions.storeResults === undefined) {
            defaultLogOptions.storeResults = true;
        }
    }
    get onDidAddMeasurementResult() {
        return this.onDidAddMeasurementResultEmitter.event;
    }
    /**
     * Wrap an asynchronous function in a {@link Measurement} that logs itself on completion.
     * If obtaining and awaiting the `computation` runs too long according to the threshold
     * set in the `options`, then the log message is a warning, otherwise a debug log.
     *
     * @param name the {@link Measurement.name name of the measurement} to wrap around the function
     * @param description a description of what the function does, to be included in the log
     * @param computation a supplier of the asynchronous function to wrap
     * @param options optional addition configuration as for {@link measure}
     * @returns the wrapped `computation`
     *
     * @see {@link MeasurementOptions.thresholdMillis}
     */
    async startAsync(name, description, computation, options) {
        var _a;
        const threshold = (_a = options === null || options === void 0 ? void 0 : options.thresholdMillis) !== null && _a !== void 0 ? _a : Number.POSITIVE_INFINITY;
        const measure = this.start(name, options);
        const result = await computation();
        if (measure.stop() > threshold) {
            measure.warn(`${description} took longer than the expected maximum ${threshold} milliseconds`);
        }
        else {
            measure.log(description);
        }
        return result;
    }
    createMeasurement(name, measure, options) {
        const logOptions = this.mergeLogOptions(options);
        const measurement = {
            name,
            stop: () => {
                if (measurement.elapsed === undefined) {
                    const { startTime, duration } = measure();
                    measurement.elapsed = duration;
                    const result = {
                        name,
                        elapsed: duration,
                        startTime,
                        owner: logOptions.owner
                    };
                    if (logOptions.storeResults) {
                        this._storedMeasurements.push(result);
                    }
                    this.onDidAddMeasurementResultEmitter.fire(result);
                }
                return measurement.elapsed;
            },
            log: (activity, ...optionalArgs) => this.log(measurement, activity, this.atLevel(logOptions, undefined, optionalArgs)),
            debug: (activity, ...optionalArgs) => this.log(measurement, activity, this.atLevel(logOptions, logger_1.LogLevel.DEBUG, optionalArgs)),
            info: (activity, ...optionalArgs) => this.log(measurement, activity, this.atLevel(logOptions, logger_1.LogLevel.INFO, optionalArgs)),
            warn: (activity, ...optionalArgs) => this.log(measurement, activity, this.atLevel(logOptions, logger_1.LogLevel.WARN, optionalArgs)),
            error: (activity, ...optionalArgs) => this.log(measurement, activity, this.atLevel(logOptions, logger_1.LogLevel.ERROR, optionalArgs)),
        };
        return measurement;
    }
    mergeLogOptions(logOptions) {
        const result = { ...this.defaultLogOptions };
        if (logOptions) {
            Object.assign(result, logOptions);
        }
        return result;
    }
    atLevel(logOptions, levelOverride, optionalArgs) {
        return { ...logOptions, levelOverride, arguments: optionalArgs };
    }
    logLevel(elapsed, options) {
        var _a, _b;
        if (options === null || options === void 0 ? void 0 : options.levelOverride) {
            return options.levelOverride;
        }
        return (_b = (_a = options === null || options === void 0 ? void 0 : options.defaultLogLevel) !== null && _a !== void 0 ? _a : this.defaultLogOptions.defaultLogLevel) !== null && _b !== void 0 ? _b : DEFAULT_LOG_LEVEL;
    }
    log(measurement, activity, options) {
        var _a;
        const elapsed = measurement.stop();
        const level = this.logLevel(elapsed, options);
        if (Number.isNaN(elapsed)) {
            switch (level) {
                case logger_1.LogLevel.ERROR:
                case logger_1.LogLevel.FATAL:
                    // Always log errors, even if NaN duration from native API preventing a measurement
                    break;
                default:
                    // Measurement was prevented by native API, do not log NaN duration
                    return;
            }
        }
        const start = options.owner ? `${options.owner} start` : 'start';
        const timeFromStart = `Finished ${(options.now() / 1000).toFixed(3)} s after ${start}`;
        const whatWasMeasured = options.context ? `[${options.context}] ${activity}` : activity;
        this.logger.log(level, `${whatWasMeasured}: ${elapsed.toFixed(1)} ms [${timeFromStart}]`, ...((_a = options.arguments) !== null && _a !== void 0 ? _a : []));
    }
    get storedMeasurements() {
        return this._storedMeasurements;
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], Stopwatch.prototype, "logger", void 0);
Stopwatch = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], Stopwatch);
exports.Stopwatch = Stopwatch;


/***/ }),

/***/ "../../packages/core/lib/common/prioritizeable.js":
/*!********************************************************!*\
  !*** ../../packages/core/lib/common/prioritizeable.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
exports.Prioritizeable = void 0;
var Prioritizeable;
(function (Prioritizeable) {
    async function toPrioritizeable(rawValue, getPriority) {
        if (rawValue instanceof Array) {
            return Promise.all(rawValue.map(v => toPrioritizeable(v, getPriority)));
        }
        const value = await rawValue;
        const priority = await getPriority(value);
        return { priority, value };
    }
    Prioritizeable.toPrioritizeable = toPrioritizeable;
    function toPrioritizeableSync(rawValue, getPriority) {
        return rawValue.map(v => ({
            value: v,
            priority: getPriority(v)
        }));
    }
    Prioritizeable.toPrioritizeableSync = toPrioritizeableSync;
    function prioritizeAllSync(values, getPriority) {
        const prioritizeable = toPrioritizeableSync(values, getPriority);
        return prioritizeable.filter(isValid).sort(compare);
    }
    Prioritizeable.prioritizeAllSync = prioritizeAllSync;
    async function prioritizeAll(values, getPriority) {
        const prioritizeable = await toPrioritizeable(values, getPriority);
        return prioritizeable.filter(isValid).sort(compare);
    }
    Prioritizeable.prioritizeAll = prioritizeAll;
    function isValid(p) {
        return p.priority > 0;
    }
    Prioritizeable.isValid = isValid;
    function compare(p, p2) {
        return p2.priority - p.priority;
    }
    Prioritizeable.compare = compare;
})(Prioritizeable = exports.Prioritizeable || (exports.Prioritizeable = {}));


/***/ }),

/***/ "../../packages/core/lib/common/progress-service-protocol.js":
/*!*******************************************************************!*\
  !*** ../../packages/core/lib/common/progress-service-protocol.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.ProgressClient = void 0;
exports.ProgressClient = Symbol('ProgressClient');


/***/ }),

/***/ "../../packages/core/lib/common/progress-service.js":
/*!**********************************************************!*\
  !*** ../../packages/core/lib/common/progress-service.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.ProgressService = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const message_service_protocol_1 = __webpack_require__(/*! ./message-service-protocol */ "../../packages/core/lib/common/message-service-protocol.js");
const cancellation_1 = __webpack_require__(/*! ./cancellation */ "../../packages/core/lib/common/cancellation.js");
const progress_service_protocol_1 = __webpack_require__(/*! ./progress-service-protocol */ "../../packages/core/lib/common/progress-service-protocol.js");
const message_service_1 = __webpack_require__(/*! ./message-service */ "../../packages/core/lib/common/message-service.js");
let ProgressService = class ProgressService {
    constructor() {
        this.progressIdPrefix = Math.random().toString(36).substring(5);
        this.counter = 0;
    }
    async showProgress(message, onDidCancel) {
        if (this.shouldDelegate(message)) {
            return this.messageService.showProgress(message, onDidCancel);
        }
        const id = this.newProgressId();
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        const report = (update) => {
            this.client.reportProgress(id, update, message, cancellationSource.token);
        };
        const actions = new Set(message.actions);
        if (message_service_protocol_1.ProgressMessage.isCancelable(message)) {
            actions.delete(message_service_protocol_1.ProgressMessage.Cancel);
            actions.add(message_service_protocol_1.ProgressMessage.Cancel);
        }
        const clientMessage = { ...message, actions: Array.from(actions) };
        const result = this.client.showProgress(id, clientMessage, cancellationSource.token);
        if (message_service_protocol_1.ProgressMessage.isCancelable(message) && typeof onDidCancel === 'function') {
            result.then(value => {
                if (value === message_service_protocol_1.ProgressMessage.Cancel) {
                    onDidCancel();
                }
            });
        }
        return {
            id,
            cancel: () => cancellationSource.cancel(),
            result,
            report
        };
    }
    shouldDelegate(message) {
        const location = message.options && message.options.location;
        return location === 'notification';
    }
    newProgressId() {
        return `${this.progressIdPrefix}-${++this.counter}`;
    }
    async withProgress(text, locationId, task, onDidCancel) {
        const progress = await this.showProgress({ text, options: { cancelable: true, location: locationId } }, onDidCancel);
        try {
            return await task();
        }
        finally {
            progress.cancel();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(progress_service_protocol_1.ProgressClient),
    __metadata("design:type", Object)
], ProgressService.prototype, "client", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], ProgressService.prototype, "messageService", void 0);
ProgressService = __decorate([
    (0, inversify_1.injectable)()
], ProgressService);
exports.ProgressService = ProgressService;


/***/ }),

/***/ "../../packages/core/lib/common/promise-util.js":
/*!******************************************************!*\
  !*** ../../packages/core/lib/common/promise-util.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.firstTrue = exports.isThenable = exports.waitForEvent = exports.wait = exports.delay = exports.retry = exports.timeoutReject = exports.timeout = exports.Deferred = void 0;
const cancellation_1 = __webpack_require__(/*! ./cancellation */ "../../packages/core/lib/common/cancellation.js");
const types_1 = __webpack_require__(/*! ./types */ "../../packages/core/lib/common/types.js");
/**
 * Simple implementation of the deferred pattern.
 * An object that exposes a promise and functions to resolve and reject it.
 */
class Deferred {
    constructor() {
        this.state = 'unresolved';
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        }).then(res => (this.setState('resolved'), res), err => (this.setState('rejected'), Promise.reject(err)));
    }
    setState(state) {
        if (this.state === 'unresolved') {
            this.state = state;
        }
    }
}
exports.Deferred = Deferred;
/**
 * @returns resolves after a specified number of milliseconds
 * @throws cancelled if a given token is cancelled before a specified number of milliseconds
 */
function timeout(ms, token = cancellation_1.CancellationToken.None) {
    const deferred = new Deferred();
    const handle = setTimeout(() => deferred.resolve(), ms);
    token.onCancellationRequested(() => {
        clearTimeout(handle);
        deferred.reject((0, cancellation_1.cancelled)());
    });
    return deferred.promise;
}
exports.timeout = timeout;
/**
 * Creates a promise that is rejected after the given amount of time. A typical use case is to wait for another promise until a specified timeout using:
 * ```
 * Promise.race([ promiseToPerform, timeoutReject(timeout, 'Timeout error message') ]);
 * ```
 *
 * @param ms timeout in milliseconds
 * @param message error message on promise rejection
 * @returns rejection promise
 */
function timeoutReject(ms, message) {
    const deferred = new Deferred();
    setTimeout(() => deferred.reject(new Error(message)), ms);
    return deferred.promise;
}
exports.timeoutReject = timeoutReject;
async function retry(task, retryDelay, retries) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await task();
        }
        catch (error) {
            lastError = error;
            await timeout(retryDelay);
        }
    }
    throw lastError;
}
exports.retry = retry;
/**
 * A function to allow a promise resolution to be delayed by a number of milliseconds. Usage is as follows:
 *
 * `const stringValue = await myPromise.then(delay(600)).then(value => value.toString());`
 *
 * @param ms the number of millisecond to delay
 * @returns a function that returns a promise that returns the given value, but delayed
 */
function delay(ms) {
    return value => new Promise((resolve, reject) => { setTimeout(() => resolve(value), ms); });
}
exports.delay = delay;
/**
 * Constructs a promise that will resolve after a given delay.
 * @param ms the number of milliseconds to wait
 */
async function wait(ms) {
    await delay(ms)(undefined);
}
exports.wait = wait;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function waitForEvent(event, ms, thisArg, disposables) {
    return new Promise((resolve, reject) => {
        const registration = setTimeout(() => {
            listener.dispose();
            reject(new cancellation_1.CancellationError());
        }, ms);
        const listener = event((evt) => {
            clearTimeout(registration);
            listener.dispose();
            resolve(evt);
        }, thisArg, disposables);
    });
}
exports.waitForEvent = waitForEvent;
function isThenable(obj) {
    return (0, types_1.isObject)(obj) && (0, types_1.isFunction)(obj.then);
}
exports.isThenable = isThenable;
/**
 * Returns with a promise that waits until the first promise resolves to `true`.
 */
// Based on https://stackoverflow.com/a/51160727/5529090
function firstTrue(...promises) {
    const newPromises = promises.map(promise => new Promise((resolve, reject) => promise.then(result => result && resolve(true), reject)));
    newPromises.push(Promise.all(promises).then(() => false));
    return Promise.race(newPromises);
}
exports.firstTrue = firstTrue;


/***/ }),

/***/ "../../packages/core/lib/common/quick-pick-service.js":
/*!************************************************************!*\
  !*** ../../packages/core/lib/common/quick-pick-service.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.findMatches = exports.filterItems = exports.QuickInputService = exports.QuickInputHideReason = exports.QuickInputButton = exports.QuickPickSeparator = exports.QuickPickItem = exports.QuickPickService = exports.quickPickServicePath = void 0;
const uri_1 = __webpack_require__(/*! ./uri */ "../../packages/core/lib/common/uri.js");
const fuzzy = __webpack_require__(/*! fuzzy */ "../../node_modules/fuzzy/lib/fuzzy.js");
const vscode_uri_1 = __webpack_require__(/*! vscode-uri */ "../../node_modules/vscode-uri/lib/esm/index.js");
exports.quickPickServicePath = '/services/quickPick';
exports.QuickPickService = Symbol('QuickPickService');
var QuickPickItem;
(function (QuickPickItem) {
    function is(item) {
        // if it's not a separator, it's an item
        return item.type !== 'separator';
    }
    QuickPickItem.is = is;
})(QuickPickItem = exports.QuickPickItem || (exports.QuickPickItem = {}));
var QuickPickSeparator;
(function (QuickPickSeparator) {
    function is(item) {
        return item.type === 'separator';
    }
    QuickPickSeparator.is = is;
})(QuickPickSeparator = exports.QuickPickSeparator || (exports.QuickPickSeparator = {}));
var QuickInputButton;
(function (QuickInputButton) {
    function normalize(button) {
        var _a;
        if (!button) {
            return button;
        }
        let iconPath = undefined;
        if (button.iconPath instanceof uri_1.default) {
            iconPath = { dark: button.iconPath['codeUri'] };
        }
        else if (button.iconPath && 'dark' in button.iconPath) {
            const dark = vscode_uri_1.URI.isUri(button.iconPath.dark) ? button.iconPath.dark : button.iconPath.dark['codeUri'];
            const light = vscode_uri_1.URI.isUri(button.iconPath.light) ? button.iconPath.light : (_a = button.iconPath.light) === null || _a === void 0 ? void 0 : _a['codeUri'];
            iconPath = { dark, light };
        }
        return {
            ...button,
            iconPath,
        };
    }
    QuickInputButton.normalize = normalize;
})(QuickInputButton = exports.QuickInputButton || (exports.QuickInputButton = {}));
var QuickInputHideReason;
(function (QuickInputHideReason) {
    /**
     * Focus was moved away from the input, but the user may not have explicitly closed it.
     */
    QuickInputHideReason[QuickInputHideReason["Blur"] = 1] = "Blur";
    /**
     * An explicit close gesture, like striking the Escape key
     */
    QuickInputHideReason[QuickInputHideReason["Gesture"] = 2] = "Gesture";
    /**
     * Any other reason
     */
    QuickInputHideReason[QuickInputHideReason["Other"] = 3] = "Other";
})(QuickInputHideReason = exports.QuickInputHideReason || (exports.QuickInputHideReason = {}));
exports.QuickInputService = Symbol('QuickInputService');
/**
 * Filter the list of quick pick items based on the provided filter.
 * Items are filtered based on if:
 * - their `label` satisfies the filter using `fuzzy`.
 * - their `description` satisfies the filter using `fuzzy`.
 * - their `detail` satisfies the filter using `fuzzy`.
 * Filtered items are also updated to display proper highlights based on how they were filtered.
 * @param items the list of quick pick items.
 * @param filter the filter to search for.
 * @returns the list of quick pick items that satisfy the filter.
 */
function filterItems(items, filter) {
    filter = filter.trim().toLowerCase();
    if (filter.length === 0) {
        for (const item of items) {
            if (item.type !== 'separator') {
                item.highlights = undefined; // reset highlights from previous filtering.
            }
        }
        return items;
    }
    const filteredItems = [];
    for (const item of items) {
        if (item.type === 'separator') {
            filteredItems.push(item);
        }
        else if (fuzzy.test(filter, item.label) ||
            (item.description && fuzzy.test(filter, item.description)) ||
            (item.detail && fuzzy.test(filter, item.detail))) {
            item.highlights = {
                label: findMatches(item.label, filter),
                description: item.description ? findMatches(item.description, filter) : undefined,
                detail: item.detail ? findMatches(item.detail, filter) : undefined
            };
            filteredItems.push(item);
        }
    }
    return filteredItems;
}
exports.filterItems = filterItems;
/**
 * Find match highlights when testing a word against a pattern.
 * @param word the word to test.
 * @param pattern the word to match against.
 * @returns the list of highlights if present.
 */
function findMatches(word, pattern) {
    word = word.toLocaleLowerCase();
    pattern = pattern.toLocaleLowerCase();
    if (pattern.trim().length === 0) {
        return undefined;
    }
    const delimiter = '\u0000'; // null byte that shouldn't appear in the input and is used to denote matches.
    const matchResult = fuzzy.match(pattern.replace(/\u0000/gu, ''), word, { pre: delimiter, post: delimiter });
    if (!matchResult) {
        return undefined;
    }
    const match = matchResult.rendered;
    const highlights = [];
    let lastIndex = 0;
    /** We need to account for the extra markers by removing them from the range */
    let offset = 0;
    while (true) {
        const start = match.indexOf(delimiter, lastIndex);
        if (start === -1) {
            break;
        }
        const end = match.indexOf(delimiter, start + 1);
        if (end === -1) {
            break;
        }
        highlights.push({
            start: start - offset++,
            end: end - offset++
        });
        lastIndex = end + 1;
    }
    return highlights.length > 0 ? highlights : undefined;
}
exports.findMatches = findMatches;


/***/ }),

/***/ "../../packages/core/lib/common/reference.js":
/*!***************************************************!*\
  !*** ../../packages/core/lib/common/reference.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.SyncReferenceCollection = exports.ReferenceCollection = exports.AbstractReferenceCollection = void 0;
const disposable_1 = __webpack_require__(/*! ./disposable */ "../../packages/core/lib/common/disposable.js");
const event_1 = __webpack_require__(/*! ./event */ "../../packages/core/lib/common/event.js");
class AbstractReferenceCollection {
    constructor() {
        this._keys = new Map();
        this._values = new Map();
        this.references = new Map();
        this.onDidCreateEmitter = new event_1.Emitter();
        this.onDidCreate = this.onDidCreateEmitter.event;
        this.onWillDisposeEmitter = new event_1.Emitter();
        this.onWillDispose = this.onWillDisposeEmitter.event;
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDispose.push(this.onDidCreateEmitter);
        this.toDispose.push(this.onWillDisposeEmitter);
        this.toDispose.push(disposable_1.Disposable.create(() => this.clear()));
    }
    dispose() {
        this.toDispose.dispose();
    }
    clear() {
        for (const value of this._values.values()) {
            try {
                value.dispose();
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    has(args) {
        const key = this.toKey(args);
        return this.references.has(key);
    }
    keys() {
        return [...this._keys.values()];
    }
    values() {
        return [...this._values.values()];
    }
    get(args) {
        const key = this.toKey(args);
        return this._values.get(key);
    }
    doAcquire(key, object) {
        const references = this.references.get(key) || this.createReferences(key, object);
        const reference = {
            object,
            dispose: () => { }
        };
        references.push(reference);
        return reference;
    }
    toKey(args) {
        return JSON.stringify(args);
    }
    createReferences(key, value) {
        const references = new disposable_1.DisposableCollection();
        references.onDispose(() => value.dispose());
        const disposeObject = value.dispose.bind(value);
        value.dispose = () => {
            this.onWillDisposeEmitter.fire(value);
            disposeObject();
            this._values.delete(key);
            this._keys.delete(key);
            this.references.delete(key);
            references.dispose();
        };
        this.references.set(key, references);
        return references;
    }
}
exports.AbstractReferenceCollection = AbstractReferenceCollection;
class ReferenceCollection extends AbstractReferenceCollection {
    constructor(factory) {
        super();
        this.factory = factory;
        this.pendingValues = new Map();
    }
    async acquire(args) {
        const key = this.toKey(args);
        const existing = this._values.get(key);
        if (existing) {
            return this.doAcquire(key, existing);
        }
        const object = await this.getOrCreateValue(key, args);
        return this.doAcquire(key, object);
    }
    async getOrCreateValue(key, args) {
        const existing = this.pendingValues.get(key);
        if (existing) {
            return existing;
        }
        const pending = this.factory(args);
        this._keys.set(key, args);
        this.pendingValues.set(key, pending);
        try {
            const value = await pending;
            this._values.set(key, value);
            this.onDidCreateEmitter.fire(value);
            return value;
        }
        catch (e) {
            this._keys.delete(key);
            throw e;
        }
        finally {
            this.pendingValues.delete(key);
        }
    }
}
exports.ReferenceCollection = ReferenceCollection;
class SyncReferenceCollection extends AbstractReferenceCollection {
    constructor(factory) {
        super();
        this.factory = factory;
    }
    acquire(args) {
        const key = this.toKey(args);
        const object = this.getOrCreateValue(key, args);
        return this.doAcquire(key, object);
    }
    getOrCreateValue(key, args) {
        const existing = this._values.get(key);
        if (existing) {
            return existing;
        }
        const value = this.factory(args);
        this._keys.set(key, args);
        this._values.set(key, value);
        this.onDidCreateEmitter.fire(value);
        return value;
    }
}
exports.SyncReferenceCollection = SyncReferenceCollection;


/***/ }),

/***/ "../../packages/core/lib/common/resource.js":
/*!**************************************************!*\
  !*** ../../packages/core/lib/common/resource.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createUntitledURI = exports.UntitledResource = exports.UntitledResourceResolver = exports.UNTITLED_SCHEME = exports.InMemoryTextResourceResolver = exports.InMemoryTextResource = exports.MEMORY_TEXT = exports.InMemoryResources = exports.ReferenceMutableResource = exports.MutableResource = exports.DefaultResourceProvider = exports.ResourceProvider = exports.ResourceResolver = exports.ResourceError = exports.Resource = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const uri_1 = __webpack_require__(/*! ../common/uri */ "../../packages/core/lib/common/uri.js");
const contribution_provider_1 = __webpack_require__(/*! ./contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const event_1 = __webpack_require__(/*! ./event */ "../../packages/core/lib/common/event.js");
const application_error_1 = __webpack_require__(/*! ./application-error */ "../../packages/core/lib/common/application-error.js");
const stream_1 = __webpack_require__(/*! ./stream */ "../../packages/core/lib/common/stream.js");
const reference_1 = __webpack_require__(/*! ./reference */ "../../packages/core/lib/common/reference.js");
var Resource;
(function (Resource) {
    async function save(resource, context, token) {
        if (!resource.saveContents) {
            return;
        }
        if (await trySaveContentChanges(resource, context)) {
            return;
        }
        if (token && token.isCancellationRequested) {
            return;
        }
        if (typeof context.content !== 'string' && resource.saveStream) {
            await resource.saveStream(context.content, context.options);
        }
        else {
            const content = typeof context.content === 'string' ? context.content : stream_1.Readable.toString(context.content);
            await resource.saveContents(content, context.options);
        }
    }
    Resource.save = save;
    async function trySaveContentChanges(resource, context) {
        if (!context.changes || !resource.saveContentChanges || shouldSaveContent(resource, context)) {
            return false;
        }
        try {
            await resource.saveContentChanges(context.changes, context.options);
            return true;
        }
        catch (e) {
            if (!ResourceError.NotFound.is(e) && !ResourceError.OutOfSync.is(e)) {
                console.error(`Failed to apply incremental changes to '${resource.uri.toString()}':`, e);
            }
            return false;
        }
    }
    Resource.trySaveContentChanges = trySaveContentChanges;
    function shouldSaveContent(resource, { contentLength, changes }) {
        if (!changes || (resource.saveStream && contentLength > 32 * 1024 * 1024)) {
            return true;
        }
        let contentChangesLength = 0;
        for (const change of changes) {
            contentChangesLength += JSON.stringify(change).length;
            if (contentChangesLength > contentLength) {
                return true;
            }
        }
        return contentChangesLength > contentLength;
    }
    Resource.shouldSaveContent = shouldSaveContent;
})(Resource = exports.Resource || (exports.Resource = {}));
var ResourceError;
(function (ResourceError) {
    ResourceError.NotFound = application_error_1.ApplicationError.declare(-40000, (raw) => raw);
    ResourceError.OutOfSync = application_error_1.ApplicationError.declare(-40001, (raw) => raw);
})(ResourceError = exports.ResourceError || (exports.ResourceError = {}));
exports.ResourceResolver = Symbol('ResourceResolver');
exports.ResourceProvider = Symbol('ResourceProvider');
let DefaultResourceProvider = class DefaultResourceProvider {
    constructor(resolversProvider) {
        this.resolversProvider = resolversProvider;
    }
    /**
     * Reject if a resource cannot be provided.
     */
    async get(uri) {
        const resolvers = this.resolversProvider.getContributions();
        for (const resolver of resolvers) {
            try {
                return await resolver.resolve(uri);
            }
            catch (err) {
                // no-op
            }
        }
        return Promise.reject(new Error(`A resource provider for '${uri.toString()}' is not registered.`));
    }
};
DefaultResourceProvider = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contribution_provider_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.ResourceResolver)),
    __metadata("design:paramtypes", [Object])
], DefaultResourceProvider);
exports.DefaultResourceProvider = DefaultResourceProvider;
class MutableResource {
    constructor(uri) {
        this.uri = uri;
        this.contents = '';
        this.onDidChangeContentsEmitter = new event_1.Emitter();
        this.onDidChangeContents = this.onDidChangeContentsEmitter.event;
    }
    dispose() { }
    async readContents() {
        return this.contents;
    }
    async saveContents(contents) {
        this.contents = contents;
        this.fireDidChangeContents();
    }
    fireDidChangeContents() {
        this.onDidChangeContentsEmitter.fire(undefined);
    }
}
exports.MutableResource = MutableResource;
class ReferenceMutableResource {
    constructor(reference) {
        this.reference = reference;
    }
    get uri() {
        return this.reference.object.uri;
    }
    get onDidChangeContents() {
        return this.reference.object.onDidChangeContents;
    }
    dispose() {
        this.reference.dispose();
    }
    readContents() {
        return this.reference.object.readContents();
    }
    saveContents(contents) {
        return this.reference.object.saveContents(contents);
    }
}
exports.ReferenceMutableResource = ReferenceMutableResource;
let InMemoryResources = class InMemoryResources {
    constructor() {
        this.resources = new reference_1.SyncReferenceCollection(uri => new MutableResource(new uri_1.default(uri)));
    }
    add(uri, contents) {
        const resourceUri = uri.toString();
        if (this.resources.has(resourceUri)) {
            throw new Error(`Cannot add already existing in-memory resource '${resourceUri}'`);
        }
        const resource = this.acquire(resourceUri);
        resource.saveContents(contents);
        return resource;
    }
    update(uri, contents) {
        const resourceUri = uri.toString();
        const resource = this.resources.get(resourceUri);
        if (!resource) {
            throw new Error(`Cannot update non-existed in-memory resource '${resourceUri}'`);
        }
        resource.saveContents(contents);
        return resource;
    }
    resolve(uri) {
        const uriString = uri.toString();
        if (!this.resources.has(uriString)) {
            throw new Error(`In memory '${uriString}' resource does not exist.`);
        }
        return this.acquire(uriString);
    }
    acquire(uri) {
        const reference = this.resources.acquire(uri);
        return new ReferenceMutableResource(reference);
    }
};
InMemoryResources = __decorate([
    (0, inversify_1.injectable)()
], InMemoryResources);
exports.InMemoryResources = InMemoryResources;
exports.MEMORY_TEXT = 'mem-txt';
/**
 * Resource implementation for 'mem-txt' URI scheme where content is saved in URI query.
 */
class InMemoryTextResource {
    constructor(uri) {
        this.uri = uri;
    }
    async readContents(options) {
        return this.uri.query;
    }
    dispose() { }
}
exports.InMemoryTextResource = InMemoryTextResource;
/**
 * ResourceResolver implementation for 'mem-txt' URI scheme.
 */
let InMemoryTextResourceResolver = class InMemoryTextResourceResolver {
    resolve(uri) {
        if (uri.scheme !== exports.MEMORY_TEXT) {
            throw new Error(`Expected a URI with ${exports.MEMORY_TEXT} scheme. Was: ${uri}.`);
        }
        return new InMemoryTextResource(uri);
    }
};
InMemoryTextResourceResolver = __decorate([
    (0, inversify_1.injectable)()
], InMemoryTextResourceResolver);
exports.InMemoryTextResourceResolver = InMemoryTextResourceResolver;
exports.UNTITLED_SCHEME = 'untitled';
let untitledResourceSequenceIndex = 0;
let UntitledResourceResolver = class UntitledResourceResolver {
    constructor() {
        this.resources = new Map();
    }
    has(uri) {
        if (uri.scheme !== exports.UNTITLED_SCHEME) {
            throw new Error('The given uri is not untitled file uri: ' + uri);
        }
        else {
            return this.resources.has(uri.toString());
        }
    }
    async resolve(uri) {
        if (uri.scheme !== exports.UNTITLED_SCHEME) {
            throw new Error('The given uri is not untitled file uri: ' + uri);
        }
        else {
            const untitledResource = this.resources.get(uri.toString());
            if (!untitledResource) {
                return this.createUntitledResource('', '', uri);
            }
            else {
                return untitledResource;
            }
        }
    }
    async createUntitledResource(content, extension, uri) {
        if (!uri) {
            uri = this.createUntitledURI(extension);
        }
        return new UntitledResource(this.resources, uri, content);
    }
    createUntitledURI(extension, parent) {
        let counter = 1; // vscode starts at 1
        let untitledUri;
        do {
            const name = `Untitled-${counter}${extension !== null && extension !== void 0 ? extension : ''}`;
            if (parent) {
                untitledUri = parent.resolve(name).withScheme(exports.UNTITLED_SCHEME);
            }
            untitledUri = new uri_1.default().resolve(name).withScheme(exports.UNTITLED_SCHEME);
            counter++;
        } while (this.has(untitledUri));
        return untitledUri;
    }
};
UntitledResourceResolver = __decorate([
    (0, inversify_1.injectable)()
], UntitledResourceResolver);
exports.UntitledResourceResolver = UntitledResourceResolver;
class UntitledResource {
    constructor(resources, uri, content) {
        this.resources = resources;
        this.uri = uri;
        this.content = content;
        this.onDidChangeContentsEmitter = new event_1.Emitter();
        this.resources.set(this.uri.toString(), this);
    }
    get onDidChangeContents() {
        return this.onDidChangeContentsEmitter.event;
    }
    dispose() {
        this.resources.delete(this.uri.toString());
        this.onDidChangeContentsEmitter.dispose();
    }
    async readContents(options) {
        if (this.content) {
            return this.content;
        }
        else {
            return '';
        }
    }
    async saveContents(content, options) {
        // This function must exist to ensure readOnly is false for the Monaco editor.
        // However it should not be called because saving 'untitled' is always processed as 'Save As'.
        throw Error('Untitled resources cannot be saved.');
    }
    fireDidChangeContents() {
        this.onDidChangeContentsEmitter.fire(undefined);
    }
    get version() {
        return undefined;
    }
    get encoding() {
        return undefined;
    }
}
exports.UntitledResource = UntitledResource;
/**
 * @deprecated Since 1.27.0. Please use `UntitledResourceResolver.createUntitledURI` instead.
 */
function createUntitledURI(extension, parent) {
    const name = `Untitled-${untitledResourceSequenceIndex++}${extension !== null && extension !== void 0 ? extension : ''}`;
    if (parent) {
        return parent.resolve(name).withScheme(exports.UNTITLED_SCHEME);
    }
    return new uri_1.default().resolve(name).withScheme(exports.UNTITLED_SCHEME);
}
exports.createUntitledURI = createUntitledURI;


/***/ }),

/***/ "../../packages/core/lib/common/selection-service.js":
/*!***********************************************************!*\
  !*** ../../packages/core/lib/common/selection-service.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
/* eslint-disable @typescript-eslint/no-explicit-any */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectionService = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const event_1 = __webpack_require__(/*! ../common/event */ "../../packages/core/lib/common/event.js");
/**
 * Singleton service that is used to share the current selection globally in a Theia application.
 * On each change of selection, subscribers are notified and receive the updated selection object.
 */
let SelectionService = class SelectionService {
    constructor() {
        this.onSelectionChangedEmitter = new event_1.Emitter();
        this.onSelectionChanged = this.onSelectionChangedEmitter.event;
    }
    get selection() {
        return this.currentSelection;
    }
    set selection(selection) {
        this.currentSelection = selection;
        this.onSelectionChangedEmitter.fire(this.currentSelection);
    }
};
SelectionService = __decorate([
    (0, inversify_1.injectable)()
], SelectionService);
exports.SelectionService = SelectionService;


/***/ }),

/***/ "../../packages/core/lib/common/selection.js":
/*!***************************************************!*\
  !*** ../../packages/core/lib/common/selection.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.UriSelection = void 0;
const types_1 = __webpack_require__(/*! ./types */ "../../packages/core/lib/common/types.js");
const uri_1 = __webpack_require__(/*! ./uri */ "../../packages/core/lib/common/uri.js");
var UriSelection;
(function (UriSelection) {
    function is(arg) {
        return (0, types_1.isObject)(arg) && arg.uri instanceof uri_1.default;
    }
    UriSelection.is = is;
    function getUri(selection) {
        if (is(selection)) {
            return selection.uri;
        }
        if (Array.isArray(selection) && is(selection[0])) {
            return selection[0].uri;
        }
        return undefined;
    }
    UriSelection.getUri = getUri;
    function getUris(selection) {
        if (is(selection)) {
            return [selection.uri];
        }
        if (Array.isArray(selection)) {
            return selection.filter(is).map(s => s.uri);
        }
        return [];
    }
    UriSelection.getUris = getUris;
})(UriSelection = exports.UriSelection || (exports.UriSelection = {}));


/***/ }),

/***/ "../../packages/core/lib/common/stream.js":
/*!************************************************!*\
  !*** ../../packages/core/lib/common/stream.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transform = exports.toReadable = exports.toStream = exports.consumeStreamWithLimit = exports.peekStream = exports.consumeStream = exports.peekReadable = exports.consumeReadableWithLimit = exports.consumeReadable = exports.newWriteableStream = exports.isReadableBufferedStream = exports.isReadableStream = exports.Readable = void 0;
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/base/common/stream.ts
/* eslint-disable max-len */
/* eslint-disable no-null/no-null */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-explicit-any */
const disposable_1 = __webpack_require__(/*! ./disposable */ "../../packages/core/lib/common/disposable.js");
var Readable;
(function (Readable) {
    function fromString(value) {
        let done = false;
        return {
            read() {
                if (!done) {
                    done = true;
                    return value;
                }
                return null;
            }
        };
    }
    Readable.fromString = fromString;
    function toString(readable) {
        let result = '';
        let chunk;
        while ((chunk = readable.read()) != null) {
            result += chunk;
        }
        return result;
    }
    Readable.toString = toString;
})(Readable = exports.Readable || (exports.Readable = {}));
function isReadableStream(obj) {
    const candidate = obj;
    return candidate && [candidate.on, candidate.pause, candidate.resume, candidate.destroy].every(fn => typeof fn === 'function');
}
exports.isReadableStream = isReadableStream;
function isReadableBufferedStream(obj) {
    const candidate = obj;
    return candidate && isReadableStream(candidate.stream) && Array.isArray(candidate.buffer) && typeof candidate.ended === 'boolean';
}
exports.isReadableBufferedStream = isReadableBufferedStream;
function newWriteableStream(reducer, options) {
    return new WriteableStreamImpl(reducer);
}
exports.newWriteableStream = newWriteableStream;
class WriteableStreamImpl {
    constructor(reducer, options) {
        this.reducer = reducer;
        this.options = options;
        this.state = {
            flowing: false,
            ended: false,
            destroyed: false
        };
        this.buffer = {
            data: [],
            error: []
        };
        this.listeners = {
            data: [],
            error: [],
            end: []
        };
        this.pendingWritePromises = [];
    }
    pause() {
        if (this.state.destroyed) {
            return;
        }
        this.state.flowing = false;
    }
    resume() {
        if (this.state.destroyed) {
            return;
        }
        if (!this.state.flowing) {
            this.state.flowing = true;
            // emit buffered events
            this.flowData();
            this.flowErrors();
            this.flowEnd();
        }
    }
    write(data) {
        var _a;
        if (this.state.destroyed) {
            return;
        }
        // flowing: directly send the data to listeners
        if (this.state.flowing) {
            this.listeners.data.forEach(listener => listener(data));
        }
        // not yet flowing: buffer data until flowing
        else {
            this.buffer.data.push(data);
            // highWaterMark: if configured, signal back when buffer reached limits
            if (typeof ((_a = this.options) === null || _a === void 0 ? void 0 : _a.highWaterMark) === 'number' && this.buffer.data.length > this.options.highWaterMark) {
                return new Promise(resolve => this.pendingWritePromises.push(resolve));
            }
        }
    }
    error(error) {
        if (this.state.destroyed) {
            return;
        }
        // flowing: directly send the error to listeners
        if (this.state.flowing) {
            this.listeners.error.forEach(listener => listener(error));
        }
        // not yet flowing: buffer errors until flowing
        else {
            this.buffer.error.push(error);
        }
    }
    end(result) {
        if (this.state.destroyed) {
            return;
        }
        // end with data or error if provided
        if (result instanceof Error) {
            this.error(result);
        }
        else if (result) {
            this.write(result);
        }
        // flowing: send end event to listeners
        if (this.state.flowing) {
            this.listeners.end.forEach(listener => listener());
            this.destroy();
        }
        // not yet flowing: remember state
        else {
            this.state.ended = true;
        }
    }
    on(event, callback) {
        if (this.state.destroyed) {
            return;
        }
        switch (event) {
            case 'data':
                this.listeners.data.push(callback);
                // switch into flowing mode as soon as the first 'data'
                // listener is added and we are not yet in flowing mode
                this.resume();
                break;
            case 'end':
                this.listeners.end.push(callback);
                // emit 'end' event directly if we are flowing
                // and the end has already been reached
                //
                // finish() when it went through
                if (this.state.flowing && this.flowEnd()) {
                    this.destroy();
                }
                break;
            case 'error':
                this.listeners.error.push(callback);
                // emit buffered 'error' events unless done already
                // now that we know that we have at least one listener
                if (this.state.flowing) {
                    this.flowErrors();
                }
                break;
        }
    }
    removeListener(event, callback) {
        if (this.state.destroyed) {
            return;
        }
        let listeners = undefined;
        switch (event) {
            case 'data':
                listeners = this.listeners.data;
                break;
            case 'end':
                listeners = this.listeners.end;
                break;
            case 'error':
                listeners = this.listeners.error;
                break;
        }
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index >= 0) {
                listeners.splice(index, 1);
            }
        }
    }
    flowData() {
        if (this.buffer.data.length > 0) {
            const fullDataBuffer = this.reducer(this.buffer.data);
            this.listeners.data.forEach(listener => listener(fullDataBuffer));
            this.buffer.data.length = 0;
            // When the buffer is empty, resolve all pending writers
            const pendingWritePromises = [...this.pendingWritePromises];
            this.pendingWritePromises.length = 0;
            pendingWritePromises.forEach(pendingWritePromise => pendingWritePromise());
        }
    }
    flowErrors() {
        if (this.listeners.error.length > 0) {
            for (const error of this.buffer.error) {
                this.listeners.error.forEach(listener => listener(error));
            }
            this.buffer.error.length = 0;
        }
    }
    flowEnd() {
        if (this.state.ended) {
            this.listeners.end.forEach(listener => listener());
            return this.listeners.end.length > 0;
        }
        return false;
    }
    destroy() {
        if (!this.state.destroyed) {
            this.state.destroyed = true;
            this.state.ended = true;
            this.buffer.data.length = 0;
            this.buffer.error.length = 0;
            this.listeners.data.length = 0;
            this.listeners.error.length = 0;
            this.listeners.end.length = 0;
            this.pendingWritePromises.length = 0;
        }
    }
}
/**
 * Helper to fully read a T readable into a T.
 */
function consumeReadable(readable, reducer) {
    const chunks = [];
    let chunk;
    while ((chunk = readable.read()) !== null) {
        chunks.push(chunk);
    }
    return reducer(chunks);
}
exports.consumeReadable = consumeReadable;
/**
 * Helper to read a T readable up to a maximum of chunks. If the limit is
 * reached, will return a readable instead to ensure all data can still
 * be read.
 */
function consumeReadableWithLimit(readable, reducer, maxChunks) {
    const chunks = [];
    let chunk = undefined;
    while ((chunk = readable.read()) !== null && chunks.length < maxChunks) {
        chunks.push(chunk);
    }
    // If the last chunk is null, it means we reached the end of
    // the readable and return all the data at once
    if (chunk === null && chunks.length > 0) {
        return reducer(chunks);
    }
    // Otherwise, we still have a chunk, it means we reached the maxChunks
    // value and as such we return a new Readable that first returns
    // the existing read chunks and then continues with reading from
    // the underlying readable.
    return {
        read: () => {
            // First consume chunks from our array
            if (chunks.length > 0) {
                return chunks.shift();
            }
            // Then ensure to return our last read chunk
            if (typeof chunk !== 'undefined') {
                const lastReadChunk = chunk;
                // explicitly use undefined here to indicate that we consumed
                // the chunk, which could have either been null or valued.
                chunk = undefined;
                return lastReadChunk;
            }
            // Finally delegate back to the Readable
            return readable.read();
        }
    };
}
exports.consumeReadableWithLimit = consumeReadableWithLimit;
/**
 * Helper to read a T readable up to a maximum of chunks. If the limit is
 * reached, will return a readable instead to ensure all data can still
 * be read.
 */
function peekReadable(readable, reducer, maxChunks) {
    const chunks = [];
    let chunk = undefined;
    while ((chunk = readable.read()) !== null && chunks.length < maxChunks) {
        chunks.push(chunk);
    }
    // If the last chunk is null, it means we reached the end of
    // the readable and return all the data at once
    if (chunk === null && chunks.length > 0) {
        return reducer(chunks);
    }
    // Otherwise, we still have a chunk, it means we reached the maxChunks
    // value and as such we return a new Readable that first returns
    // the existing read chunks and then continues with reading from
    // the underlying readable.
    return {
        read: () => {
            // First consume chunks from our array
            if (chunks.length > 0) {
                return chunks.shift();
            }
            // Then ensure to return our last read chunk
            if (typeof chunk !== 'undefined') {
                const lastReadChunk = chunk;
                // explicitly use undefined here to indicate that we consumed
                // the chunk, which could have either been null or valued.
                chunk = undefined;
                return lastReadChunk;
            }
            // Finally delegate back to the Readable
            return readable.read();
        }
    };
}
exports.peekReadable = peekReadable;
/**
 * Helper to fully read a T stream into a T.
 */
function consumeStream(stream, reducer) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', data => chunks.push(data));
        stream.on('error', error => reject(error));
        stream.on('end', () => resolve(reducer(chunks)));
    });
}
exports.consumeStream = consumeStream;
/**
 * Helper to peek up to `maxChunks` into a stream. The return type signals if
 * the stream has ended or not. If not, caller needs to add a `data` listener
 * to continue reading.
 */
function peekStream(stream, maxChunks) {
    return new Promise((resolve, reject) => {
        const streamListeners = new disposable_1.DisposableCollection();
        // Data Listener
        const buffer = [];
        const dataListener = (chunk) => {
            // Add to buffer
            buffer.push(chunk);
            // We reached maxChunks and thus need to return
            if (buffer.length > maxChunks) {
                // Dispose any listeners and ensure to pause the
                // stream so that it can be consumed again by caller
                streamListeners.dispose();
                stream.pause();
                return resolve({ stream, buffer, ended: false });
            }
        };
        streamListeners.push(disposable_1.Disposable.create(() => stream.removeListener('data', dataListener)));
        stream.on('data', dataListener);
        // Error Listener
        const errorListener = (error) => reject(error);
        streamListeners.push(disposable_1.Disposable.create(() => stream.removeListener('error', errorListener)));
        stream.on('error', errorListener);
        const endListener = () => resolve({ stream, buffer, ended: true });
        streamListeners.push(disposable_1.Disposable.create(() => stream.removeListener('end', endListener)));
        stream.on('end', endListener);
    });
}
exports.peekStream = peekStream;
/**
 * Helper to read a T stream up to a maximum of chunks. If the limit is
 * reached, will return a stream instead to ensure all data can still
 * be read.
 */
function consumeStreamWithLimit(stream, reducer, maxChunks) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let wrapperStream = undefined;
        stream.on('data', data => {
            // If we reach maxChunks, we start to return a stream
            // and make sure that any data we have already read
            // is in it as well
            if (!wrapperStream && chunks.length === maxChunks) {
                wrapperStream = newWriteableStream(reducer);
                while (chunks.length) {
                    wrapperStream.write(chunks.shift());
                }
                wrapperStream.write(data);
                return resolve(wrapperStream);
            }
            if (wrapperStream) {
                wrapperStream.write(data);
            }
            else {
                chunks.push(data);
            }
        });
        stream.on('error', error => {
            if (wrapperStream) {
                wrapperStream.error(error);
            }
            else {
                return reject(error);
            }
        });
        stream.on('end', () => {
            if (wrapperStream) {
                while (chunks.length) {
                    wrapperStream.write(chunks.shift());
                }
                wrapperStream.end();
            }
            else {
                return resolve(reducer(chunks));
            }
        });
    });
}
exports.consumeStreamWithLimit = consumeStreamWithLimit;
/**
 * Helper to create a readable stream from an existing T.
 */
function toStream(t, reducer) {
    const stream = newWriteableStream(reducer);
    stream.end(t);
    return stream;
}
exports.toStream = toStream;
/**
 * Helper to convert a T into a Readable<T>.
 */
function toReadable(t) {
    let consumed = false;
    return {
        read: () => {
            if (consumed) {
                return null;
            }
            consumed = true;
            return t;
        }
    };
}
exports.toReadable = toReadable;
/**
 * Helper to transform a readable stream into another stream.
 */
function transform(stream, transformer, reducer) {
    const target = newWriteableStream(reducer);
    stream.on('data', data => target.write(transformer.data(data)));
    stream.on('end', () => target.end());
    stream.on('error', error => target.error(transformer.error ? transformer.error(error) : error));
    return target;
}
exports.transform = transform;


/***/ }),

/***/ "../../packages/core/lib/common/strings.js":
/*!*************************************************!*\
  !*** ../../packages/core/lib/common/strings.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compareSubstringIgnoreCase = exports.compareIgnoreCase = exports.compareSubstring = exports.compare = exports.unescapeInvisibleChars = exports.escapeInvisibleChars = exports.split = exports.startsWithIgnoreCase = exports.escapeRegExpCharacters = exports.commonPrefixLength = exports.equalsIgnoreCase = exports.isUpperAsciiLetter = exports.isLowerAsciiLetter = exports.endsWith = void 0;
/**
 * Determines if haystack ends with needle.
 */
function endsWith(haystack, needle) {
    const diff = haystack.length - needle.length;
    if (diff > 0) {
        return haystack.indexOf(needle, diff) === diff;
    }
    else if (diff === 0) {
        return haystack === needle;
    }
    else {
        return false;
    }
}
exports.endsWith = endsWith;
function isLowerAsciiLetter(code) {
    return code >= 97 /* a */ && code <= 122 /* z */;
}
exports.isLowerAsciiLetter = isLowerAsciiLetter;
function isUpperAsciiLetter(code) {
    return code >= 65 /* A */ && code <= 90 /* Z */;
}
exports.isUpperAsciiLetter = isUpperAsciiLetter;
function isAsciiLetter(code) {
    return isLowerAsciiLetter(code) || isUpperAsciiLetter(code);
}
function equalsIgnoreCase(a, b) {
    const len1 = a ? a.length : 0;
    const len2 = b ? b.length : 0;
    if (len1 !== len2) {
        return false;
    }
    return doEqualsIgnoreCase(a, b);
}
exports.equalsIgnoreCase = equalsIgnoreCase;
function doEqualsIgnoreCase(a, b, stopAt = a.length) {
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }
    for (let i = 0; i < stopAt; i++) {
        const codeA = a.charCodeAt(i);
        const codeB = b.charCodeAt(i);
        if (codeA === codeB) {
            continue;
        }
        // a-z A-Z
        if (isAsciiLetter(codeA) && isAsciiLetter(codeB)) {
            const diff = Math.abs(codeA - codeB);
            if (diff !== 0 && diff !== 32) {
                return false;
            }
        }
        // Any other charcode
        // tslint:disable-next-line:one-line
        else {
            if (String.fromCharCode(codeA).toLowerCase() !== String.fromCharCode(codeB).toLowerCase()) {
                return false;
            }
        }
    }
    return true;
}
/**
 * @returns the length of the common prefix of the two strings.
 */
function commonPrefixLength(a, b) {
    let i;
    const len = Math.min(a.length, b.length);
    for (i = 0; i < len; i++) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
            return i;
        }
    }
    return len;
}
exports.commonPrefixLength = commonPrefixLength;
/**
 * Escapes regular expression characters in a given string
 */
function escapeRegExpCharacters(value) {
    return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\[\]\(\)\#]/g, '\\$&');
}
exports.escapeRegExpCharacters = escapeRegExpCharacters;
function startsWithIgnoreCase(str, candidate) {
    const candidateLength = candidate.length;
    if (candidate.length > str.length) {
        return false;
    }
    return doEqualsIgnoreCase(str, candidate, candidateLength);
}
exports.startsWithIgnoreCase = startsWithIgnoreCase;
function* split(s, splitter) {
    let start = 0;
    while (start < s.length) {
        let end = s.indexOf(splitter, start);
        if (end === -1) {
            end = s.length;
        }
        yield s.substring(start, end);
        start = end + splitter.length;
    }
}
exports.split = split;
function escapeInvisibleChars(value) {
    return value.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}
exports.escapeInvisibleChars = escapeInvisibleChars;
function unescapeInvisibleChars(value) {
    return value.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
}
exports.unescapeInvisibleChars = unescapeInvisibleChars;
function compare(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else {
        return 0;
    }
}
exports.compare = compare;
function compareSubstring(a, b, aStart = 0, aEnd = a.length, bStart = 0, bEnd = b.length) {
    for (; aStart < aEnd && bStart < bEnd; aStart++, bStart++) {
        const codeA = a.charCodeAt(aStart);
        const codeB = b.charCodeAt(bStart);
        if (codeA < codeB) {
            return -1;
        }
        else if (codeA > codeB) {
            return 1;
        }
    }
    const aLen = aEnd - aStart;
    const bLen = bEnd - bStart;
    if (aLen < bLen) {
        return -1;
    }
    else if (aLen > bLen) {
        return 1;
    }
    return 0;
}
exports.compareSubstring = compareSubstring;
function compareIgnoreCase(a, b) {
    return compareSubstringIgnoreCase(a, b, 0, a.length, 0, b.length);
}
exports.compareIgnoreCase = compareIgnoreCase;
function compareSubstringIgnoreCase(a, b, aStart = 0, aEnd = a.length, bStart = 0, bEnd = b.length) {
    for (; aStart < aEnd && bStart < bEnd; aStart++, bStart++) {
        const codeA = a.charCodeAt(aStart);
        const codeB = b.charCodeAt(bStart);
        if (codeA === codeB) {
            // equal
            continue;
        }
        const diff = codeA - codeB;
        if (diff === 32 && isUpperAsciiLetter(codeB)) { // codeB =[65-90] && codeA =[97-122]
            continue;
        }
        else if (diff === -32 && isUpperAsciiLetter(codeA)) { // codeB =[97-122] && codeA =[65-90]
            continue;
        }
        if (isLowerAsciiLetter(codeA) && isLowerAsciiLetter(codeB)) {
            //
            return diff;
        }
        else {
            return compareSubstring(a.toLowerCase(), b.toLowerCase(), aStart, aEnd, bStart, bEnd);
        }
    }
    const aLen = aEnd - aStart;
    const bLen = bEnd - bStart;
    if (aLen < bLen) {
        return -1;
    }
    else if (aLen > bLen) {
        return 1;
    }
    return 0;
}
exports.compareSubstringIgnoreCase = compareSubstringIgnoreCase;


/***/ }),

/***/ "../../packages/core/lib/common/telemetry.js":
/*!***************************************************!*\
  !*** ../../packages/core/lib/common/telemetry.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
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
exports.TelemetryTrustedValue = void 0;
class TelemetryTrustedValue {
    constructor(value) {
        this.value = value;
    }
}
exports.TelemetryTrustedValue = TelemetryTrustedValue;


/***/ }),

/***/ "../../packages/core/lib/common/types.js":
/*!***********************************************!*\
  !*** ../../packages/core/lib/common/types.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unreachable = exports.nullToUndefined = exports.isStringArray = exports.isArray = exports.isUndefined = exports.isObject = exports.isEmptyObject = exports.isFunction = exports.isErrorLike = exports.isError = exports.isNumber = exports.isString = exports.isBoolean = exports.Prioritizeable = exports.ArrayUtils = void 0;
var array_utils_1 = __webpack_require__(/*! ./array-utils */ "../../packages/core/lib/common/array-utils.js");
Object.defineProperty(exports, "ArrayUtils", ({ enumerable: true, get: function () { return array_utils_1.ArrayUtils; } }));
var prioritizeable_1 = __webpack_require__(/*! ./prioritizeable */ "../../packages/core/lib/common/prioritizeable.js");
Object.defineProperty(exports, "Prioritizeable", ({ enumerable: true, get: function () { return prioritizeable_1.Prioritizeable; } }));
function isBoolean(value) {
    return value === true || value === false;
}
exports.isBoolean = isBoolean;
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
exports.isString = isString;
function isNumber(value) {
    return typeof value === 'number' || value instanceof Number;
}
exports.isNumber = isNumber;
function isError(value) {
    return value instanceof Error;
}
exports.isError = isError;
function isErrorLike(value) {
    return isObject(value) && isString(value.name) && isString(value.message) && (isUndefined(value.stack) || isString(value.stack));
}
exports.isErrorLike = isErrorLike;
// eslint-disable-next-line space-before-function-paren
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
/**
 * @returns whether the provided parameter is an empty JavaScript Object or not.
 */
function isEmptyObject(obj) {
    if (!isObject(obj)) {
        return false;
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
exports.isEmptyObject = isEmptyObject;
function isObject(value) {
    // eslint-disable-next-line no-null/no-null
    return typeof value === 'object' && value !== null;
}
exports.isObject = isObject;
function isUndefined(value) {
    return typeof value === 'undefined';
}
exports.isUndefined = isUndefined;
/**
 * @param value value to check.
 * @param every optional predicate ran on every element of the array.
 * @param thisArg value to substitute `this` with when invoking in the predicate.
 * @returns whether or not `value` is an array.
 */
function isArray(value, every, thisArg) {
    return Array.isArray(value) && (!isFunction(every) || value.every(every, thisArg));
}
exports.isArray = isArray;
function isStringArray(value) {
    return isArray(value, isString);
}
exports.isStringArray = isStringArray;
/**
 * Creates a shallow copy with all ownkeys of the original object that are `null` made `undefined`
 */
function nullToUndefined(nullable) {
    const undefinable = { ...nullable };
    for (const key in nullable) {
        // eslint-disable-next-line no-null/no-null
        if (nullable[key] === null && Object.prototype.hasOwnProperty.call(nullable, key)) {
            undefinable[key] = undefined;
        }
    }
    return undefinable;
}
exports.nullToUndefined = nullToUndefined;
/**
 * Throws when called and statically makes sure that all variants of a type were consumed.
 */
function unreachable(_never, message = 'unhandled case') {
    throw new Error(message);
}
exports.unreachable = unreachable;


/***/ }),

/***/ "../../packages/core/lib/common/uri.js":
/*!*********************************************!*\
  !*** ../../packages/core/lib/common/uri.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.URI = void 0;
const vscode_uri_1 = __webpack_require__(/*! vscode-uri */ "../../node_modules/vscode-uri/lib/esm/index.js");
const path_1 = __webpack_require__(/*! ./path */ "../../packages/core/lib/common/path.js");
class URI {
    constructor(uri = '') {
        if (uri instanceof vscode_uri_1.URI) {
            this.codeUri = uri;
        }
        else {
            this.codeUri = vscode_uri_1.URI.parse(uri);
        }
    }
    static fromComponents(components) {
        return new URI(vscode_uri_1.URI.revive(components));
    }
    static fromFilePath(path) {
        return new URI(vscode_uri_1.URI.file(path));
    }
    static isUri(uri) {
        return vscode_uri_1.URI.isUri(uri);
    }
    /**
     * TODO move implementation to `DefaultUriLabelProviderContribution.getName`
     *
     * @deprecated use `LabelProvider.getName` instead
     */
    get displayName() {
        const base = this.path.base;
        if (base) {
            return base;
        }
        if (this.path.isRoot) {
            return this.path.fsPath();
        }
        return '';
    }
    /**
     * Return all uri from the current to the top most.
     */
    get allLocations() {
        const locations = [];
        let location = this;
        while (!location.path.isRoot && location.path.hasDir) {
            locations.push(location);
            location = location.parent;
        }
        locations.push(location);
        return locations;
    }
    get parent() {
        if (this.path.isRoot) {
            return this;
        }
        return this.withPath(this.path.dir);
    }
    relative(uri) {
        if (this.authority !== uri.authority || this.scheme !== uri.scheme) {
            return undefined;
        }
        return this.path.relative(uri.path);
    }
    resolve(path) {
        return this.withPath(this.path.join(path.toString()));
    }
    /**
     * @returns a new, absolute URI if one can be computed from the path segments passed in.
     */
    resolveToAbsolute(...pathSegments) {
        const absolutePath = this.path.resolve(...pathSegments.map(path => path.toString()));
        if (absolutePath) {
            return this.withPath(absolutePath);
        }
    }
    /**
     * return a new URI replacing the current with the given scheme
     */
    withScheme(scheme) {
        const newCodeUri = vscode_uri_1.URI.from({
            ...this.codeUri.toJSON(),
            scheme
        });
        return new URI(newCodeUri);
    }
    /**
     * return a new URI replacing the current with the given authority
     */
    withAuthority(authority) {
        const newCodeUri = vscode_uri_1.URI.from({
            ...this.codeUri.toJSON(),
            scheme: this.codeUri.scheme,
            authority
        });
        return new URI(newCodeUri);
    }
    /**
     * return this URI without a authority
     */
    withoutAuthority() {
        return this.withAuthority('');
    }
    /**
     * return a new URI replacing the current with the given path
     */
    withPath(path) {
        const newCodeUri = vscode_uri_1.URI.from({
            ...this.codeUri.toJSON(),
            scheme: this.codeUri.scheme,
            path: path.toString()
        });
        return new URI(newCodeUri);
    }
    /**
     * return this URI without a path
     */
    withoutPath() {
        return this.withPath('');
    }
    /**
     * return a new URI replacing the current with the given query
     */
    withQuery(query) {
        const newCodeUri = vscode_uri_1.URI.from({
            ...this.codeUri.toJSON(),
            scheme: this.codeUri.scheme,
            query
        });
        return new URI(newCodeUri);
    }
    /**
     * return this URI without a query
     */
    withoutQuery() {
        return this.withQuery('');
    }
    /**
     * return a new URI replacing the current with the given fragment
     */
    withFragment(fragment) {
        const newCodeUri = vscode_uri_1.URI.from({
            ...this.codeUri.toJSON(),
            scheme: this.codeUri.scheme,
            fragment
        });
        return new URI(newCodeUri);
    }
    /**
     * return this URI without a fragment
     */
    withoutFragment() {
        return this.withFragment('');
    }
    /**
     * return a new URI replacing the current with its normalized path, resolving '..' and '.' segments
     */
    normalizePath() {
        return this.withPath(this.path.normalize());
    }
    get scheme() {
        return this.codeUri.scheme;
    }
    get authority() {
        return this.codeUri.authority;
    }
    get path() {
        if (this._path === undefined) {
            this._path = new path_1.Path(this.codeUri.path);
        }
        return this._path;
    }
    get query() {
        return this.codeUri.query;
    }
    get fragment() {
        return this.codeUri.fragment;
    }
    toString(skipEncoding) {
        return this.codeUri.toString(skipEncoding);
    }
    isEqual(uri, caseSensitive = true) {
        if (!this.hasSameOrigin(uri)) {
            return false;
        }
        return caseSensitive
            ? this.toString() === uri.toString()
            : this.toString().toLowerCase() === uri.toString().toLowerCase();
    }
    isEqualOrParent(uri, caseSensitive = true) {
        if (!this.hasSameOrigin(uri)) {
            return false;
        }
        let left = this.path;
        let right = uri.path;
        if (!caseSensitive) {
            left = new path_1.Path(left.toString().toLowerCase());
            right = new path_1.Path(right.toString().toLowerCase());
        }
        return left.isEqualOrParent(right);
    }
    static getDistinctParents(uris) {
        const result = [];
        uris.forEach((uri, i) => {
            if (!uris.some((otherUri, index) => index !== i && otherUri.isEqualOrParent(uri))) {
                result.push(uri);
            }
        });
        return result;
    }
    hasSameOrigin(uri) {
        return (this.authority === uri.authority) && (this.scheme === uri.scheme);
    }
    toComponents() {
        return {
            scheme: this.scheme,
            authority: this.authority,
            path: this.path.toString(),
            query: this.query,
            fragment: this.fragment
        };
    }
}
exports.URI = URI;
exports["default"] = URI;


/***/ }),

/***/ "../../packages/core/lib/common/view-column.js":
/*!*****************************************************!*\
  !*** ../../packages/core/lib/common/view-column.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics.
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
exports.ViewColumn = void 0;
/**
 * Denotes a column in the editor window.
 * Columns are used to show editors side by side.
 */
var ViewColumn;
(function (ViewColumn) {
    ViewColumn[ViewColumn["Active"] = -1] = "Active";
    ViewColumn[ViewColumn["Beside"] = -2] = "Beside";
    ViewColumn[ViewColumn["One"] = 1] = "One";
    ViewColumn[ViewColumn["Two"] = 2] = "Two";
    ViewColumn[ViewColumn["Three"] = 3] = "Three";
    ViewColumn[ViewColumn["Four"] = 4] = "Four";
    ViewColumn[ViewColumn["Five"] = 5] = "Five";
    ViewColumn[ViewColumn["Six"] = 6] = "Six";
    ViewColumn[ViewColumn["Seven"] = 7] = "Seven";
    ViewColumn[ViewColumn["Eight"] = 8] = "Eight";
    ViewColumn[ViewColumn["Nine"] = 9] = "Nine";
})(ViewColumn = exports.ViewColumn || (exports.ViewColumn = {}));


/***/ }),

/***/ "../../packages/core/shared/inversify/index.js":
/*!*****************************************************!*\
  !*** ../../packages/core/shared/inversify/index.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");


/***/ }),

/***/ "../../packages/core/src/common/i18n/nls.metadata.json":
/*!*************************************************************!*\
  !*** ../../packages/core/src/common/i18n/nls.metadata.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";

/***/ })

};
;
//# sourceMappingURL=packages_core_lib_common_index_js.js.map