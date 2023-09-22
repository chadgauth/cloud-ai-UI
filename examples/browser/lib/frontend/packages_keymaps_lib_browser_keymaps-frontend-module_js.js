(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_keymaps_lib_browser_keymaps-frontend-module_js"],{

/***/ "../../packages/core/lib/browser/widgets/alert-message.js":
/*!****************************************************************!*\
  !*** ../../packages/core/lib/browser/widgets/alert-message.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
exports.AlertMessage = void 0;
const React = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
const widget_1 = __webpack_require__(/*! ./widget */ "../../packages/core/lib/browser/widgets/widget.js");
const AlertMessageIcon = {
    INFO: (0, widget_1.codicon)('info'),
    SUCCESS: (0, widget_1.codicon)('pass'),
    WARNING: (0, widget_1.codicon)('warning'),
    ERROR: (0, widget_1.codicon)('error')
};
class AlertMessage extends React.Component {
    render() {
        return React.createElement("div", { className: 'theia-alert-message-container' },
            React.createElement("div", { className: `theia-${this.props.type.toLowerCase()}-alert` },
                React.createElement("div", { className: 'theia-message-header' },
                    React.createElement("i", { className: AlertMessageIcon[this.props.type] }),
                    "\u00A0",
                    this.props.header),
                React.createElement("div", { className: 'theia-message-content' }, this.props.children)));
    }
}
exports.AlertMessage = AlertMessage;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/widgets/alert-message'] = this;


/***/ }),

/***/ "../../packages/core/shared/fuzzy/index.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/fuzzy/index.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! fuzzy */ "../../node_modules/fuzzy/lib/fuzzy.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/fuzzy'] = this;


/***/ }),

/***/ "../../packages/keymaps/lib/browser/keybinding-schema-updater.js":
/*!***********************************************************************!*\
  !*** ../../packages/keymaps/lib/browser/keybinding-schema-updater.js ***!
  \***********************************************************************/
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
exports.keybindingSchema = exports.KeybindingSchemaUpdater = void 0;
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
let KeybindingSchemaUpdater = class KeybindingSchemaUpdater {
    constructor() {
        this.uri = new uri_1.default(keybindingSchemaId);
    }
    init() {
        this.inMemoryResources.add(new uri_1.default(keybindingSchemaId), '');
        this.updateSchema();
        this.commandRegistry.onCommandsChanged(() => this.updateSchema());
    }
    registerSchemas(store) {
        store.registerSchema({
            fileMatch: ['keybindings.json', 'keymaps.json'],
            url: this.uri.toString(),
        });
    }
    updateSchema() {
        var _a;
        const schema = (0, common_1.deepClone)(exports.keybindingSchema);
        const enumValues = schema.items.allOf[0].properties.command.anyOf[1].enum;
        const enumDescriptions = schema.items.allOf[0].properties.command.anyOf[1].enumDescriptions;
        for (const command of this.commandRegistry.getAllCommands()) {
            if (command.handlers.length > 0 && !command.id.startsWith('_')) {
                enumValues.push(command.id);
                enumDescriptions.push((_a = command.label) !== null && _a !== void 0 ? _a : '');
            }
        }
        this.inMemoryResources.update(this.uri, JSON.stringify(schema));
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], KeybindingSchemaUpdater.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.InMemoryResources),
    __metadata("design:type", common_1.InMemoryResources)
], KeybindingSchemaUpdater.prototype, "inMemoryResources", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeybindingSchemaUpdater.prototype, "init", null);
KeybindingSchemaUpdater = __decorate([
    (0, inversify_1.injectable)()
], KeybindingSchemaUpdater);
exports.KeybindingSchemaUpdater = KeybindingSchemaUpdater;
const keybindingSchemaId = 'vscode://schemas/keybindings';
exports.keybindingSchema = {
    $id: keybindingSchemaId,
    type: 'array',
    title: 'Keybinding Configuration File',
    default: [],
    definitions: {
        key: { type: 'string', description: common_1.nls.localizeByDefault('Key or key sequence (separated by space)') },
    },
    items: {
        type: 'object',
        defaultSnippets: [{ body: { key: '$1', command: '$2', when: '$3' } }],
        allOf: [
            {
                required: ['command'],
                properties: {
                    command: {
                        anyOf: [{ type: 'string' }, { enum: [], enumDescriptions: [] }], description: common_1.nls.localizeByDefault('Name of the command to execute')
                    },
                    when: { type: 'string', description: common_1.nls.localizeByDefault('Condition when the key is active.') },
                    args: { description: common_1.nls.localizeByDefault('Arguments to pass to the command to execute.') },
                    context: {
                        type: 'string',
                        description: common_1.nls.localizeByDefault('Condition when the key is active.'),
                        deprecationMessage: common_1.nls.localize('theia/keybinding-schema-updater/deprecation', 'Use `when` clause instead.')
                    }
                }
            },
            {
                anyOf: [
                    { required: ['key'], properties: { key: { $ref: '#/definitions/key' }, } },
                    { required: ['keybinding'], properties: { keybinding: { $ref: '#/definitions/key' } } }
                ]
            }
        ]
    },
    allowComments: true,
    allowTrailingCommas: true,
};

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/keymaps/lib/browser/keybinding-schema-updater'] = this;


/***/ }),

/***/ "../../packages/keymaps/lib/browser/keybindings-widget.js":
/*!****************************************************************!*\
  !*** ../../packages/keymaps/lib/browser/keybindings-widget.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var KeybindingWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeybindingWidget = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const fuzzy = __webpack_require__(/*! @theia/core/shared/fuzzy */ "../../packages/core/shared/fuzzy/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const react_widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/react-widget */ "../../packages/core/lib/browser/widgets/react-widget.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const keymaps_service_1 = __webpack_require__(/*! ./keymaps-service */ "../../packages/keymaps/lib/browser/keymaps-service.js");
const alert_message_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/alert-message */ "../../packages/core/lib/browser/widgets/alert-message.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let KeybindingWidget = KeybindingWidget_1 = class KeybindingWidget extends react_widget_1.ReactWidget {
    constructor(options) {
        super(options);
        /**
         * The list of all available keybindings.
         */
        this.items = [];
        /**
         * The current user search query.
         */
        this.query = '';
        /**
         * The regular expression used to extract values between fuzzy results.
         */
        this.regexp = /<match>(.*?)<\/match>/g;
        /**
         * The regular expression used to extract values between the keybinding separator.
         */
        this.keybindingSeparator = /<match>\+<\/match>/g;
        /**
         * The fuzzy search options.
         * The `pre` and `post` options are used to wrap fuzzy matches.
         */
        this.fuzzyOptions = {
            pre: '<match>',
            post: '</match>',
        };
        this.onDidUpdateEmitter = new event_1.Emitter();
        this.onDidUpdate = this.onDidUpdateEmitter.event;
        this.onRenderCallbacks = new core_1.DisposableCollection();
        this.onRender = () => this.onRenderCallbacks.dispose();
        /**
         * Search keybindings.
         */
        this.searchKeybindings = debounce(() => this.doSearchKeybindings(), 50);
        this.updateItemsAndRerender = debounce(() => {
            this.items = this.getItems();
            this.update();
            if (this.hasSearch()) {
                this.doSearchKeybindings();
            }
        }, 100, { leading: false, trailing: true });
        this.onRender = this.onRender.bind(this);
    }
    /**
     * Initialize the widget.
     */
    init() {
        this.id = KeybindingWidget_1.ID;
        this.title.label = KeybindingWidget_1.LABEL;
        this.title.caption = KeybindingWidget_1.LABEL;
        this.title.iconClass = (0, browser_1.codicon)('three-bars');
        this.title.closable = true;
        this.updateItemsAndRerender();
        // Listen to changes made in the `keymaps.json` and update the view accordingly.
        if (this.keymapsService.onDidChangeKeymaps) {
            this.toDispose.push(this.keymapsService.onDidChangeKeymaps(() => {
                this.items = this.getItems();
                this.doSearchKeybindings();
            }));
        }
        this.toDispose.push(this.keybindingRegistry.onKeybindingsChanged(this.updateItemsAndRerender));
    }
    /**
     * Determine if there currently is a search term.
     * @returns `true` if a search term is present.
     */
    hasSearch() {
        return !!this.query.length;
    }
    /**
     * Clear the search and reset the view.
     */
    clearSearch() {
        const search = this.findSearchField();
        if (search) {
            search.value = '';
            this.query = '';
            this.doSearchKeybindings();
        }
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.focusInputField();
    }
    /**
     * Perform a search based on the user's search query.
     */
    doSearchKeybindings() {
        this.onDidUpdateEmitter.fire(undefined);
        const searchField = this.findSearchField();
        this.query = searchField ? searchField.value.trim().toLocaleLowerCase() : '';
        const queryItems = this.query.split(/[+\s]/);
        this.items.forEach(item => {
            let matched = !this.query;
            matched = this.formatAndMatchCommand(item) || matched;
            matched = this.formatAndMatchKeybinding(item, queryItems) || matched;
            matched = this.formatAndMatchContext(item) || matched;
            matched = this.formatAndMatchSource(item) || matched;
            item.visible = matched;
        });
        this.update();
    }
    formatAndMatchCommand(item) {
        item.labels.command = this.toRenderableLabel(item.labels.command.value);
        return Boolean(item.labels.command.segments);
    }
    formatAndMatchKeybinding(item, queryItems) {
        if (item.keybinding) {
            const unmatchedTerms = queryItems.filter(Boolean);
            const segments = this.keybindingRegistry.resolveKeybinding(item.keybinding).reduce((collection, code, codeIndex) => {
                if (codeIndex !== 0) {
                    // Two non-breaking spaces.
                    collection.push({ value: '\u00a0\u00a0', match: false, key: false });
                }
                const displayChunks = this.keybindingRegistry.componentsForKeyCode(code);
                const matchChunks = core_1.isOSX ? this.keybindingRegistry.componentsForKeyCode(code, true) : displayChunks;
                displayChunks.forEach((chunk, chunkIndex) => {
                    if (chunkIndex !== 0) {
                        collection.push({ value: '+', match: false, key: false });
                    }
                    const indexOfTerm = unmatchedTerms.indexOf(matchChunks[chunkIndex].toLocaleLowerCase());
                    const chunkMatches = indexOfTerm > -1;
                    if (chunkMatches) {
                        unmatchedTerms.splice(indexOfTerm, 1);
                    }
                    collection.push({ value: chunk, match: chunkMatches, key: true });
                });
                return collection;
            }, []);
            item.labels.keybinding = { value: item.labels.keybinding.value, segments };
            return !unmatchedTerms.length;
        }
        item.labels.keybinding = { value: '' };
        return false;
    }
    formatAndMatchContext(item) {
        item.labels.context = this.toRenderableLabel(item.labels.context.value);
        return Boolean(item.labels.context.segments);
    }
    formatAndMatchSource(item) {
        item.labels.source = this.toRenderableLabel(item.labels.source.value);
        return Boolean(item.labels.source.segments);
    }
    toRenderableLabel(label, query = this.query) {
        if (label && query) {
            const fuzzyMatch = fuzzy.match(query, label, this.fuzzyOptions);
            if (fuzzyMatch) {
                return {
                    value: label,
                    segments: fuzzyMatch.rendered.split(this.fuzzyOptions.pre).reduce((collection, segment) => {
                        const [maybeMatch, notMatch] = segment.split(this.fuzzyOptions.post);
                        if (notMatch === undefined) {
                            collection.push({ value: maybeMatch, match: false });
                        }
                        else {
                            collection.push({ value: maybeMatch, match: true }, { value: notMatch, match: false });
                        }
                        return collection;
                    }, [])
                };
            }
        }
        return { value: label };
    }
    /**
     * Get the search input if available.
     * @returns the search input if available.
     */
    findSearchField() {
        return document.getElementById('search-kb');
    }
    /**
     * Set the focus the search input field if available.
     */
    focusInputField() {
        const input = document.getElementById('search-kb');
        if (input) {
            input.focus();
            input.select();
        }
    }
    /**
     * Render the view.
     */
    render() {
        return React.createElement("div", { id: 'kb-main-container' },
            this.renderSearch(),
            (this.items.length > 0) ? this.renderTable() : this.renderMessage());
    }
    /**
     * Render the search container with the search input.
     */
    renderSearch() {
        return React.createElement("div", null,
            React.createElement("div", { className: 'search-kb-container' },
                React.createElement("input", { id: 'search-kb', ref: this.onRender, className: `theia-input${(this.items.length > 0) ? '' : ' no-kb'}`, type: 'text', spellCheck: false, placeholder: nls_1.nls.localizeByDefault('Type to search in keybindings'), autoComplete: 'off', onKeyUp: this.searchKeybindings })));
    }
    /**
     * Render the warning message when no search results are found.
     */
    renderMessage() {
        return React.createElement(alert_message_1.AlertMessage, { type: 'WARNING', header: 'No results found!' });
    }
    /**
     * Render the keybindings table.
     */
    renderTable() {
        return React.createElement("div", { id: 'kb-table-container' },
            React.createElement("div", { className: 'kb' },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", { className: 'th-action' }),
                            React.createElement("th", { className: 'th-label' }, nls_1.nls.localizeByDefault('Command')),
                            React.createElement("th", { className: 'th-keybinding' }, nls_1.nls.localizeByDefault('Keybinding')),
                            React.createElement("th", { className: 'th-context' }, nls_1.nls.localizeByDefault('When')),
                            React.createElement("th", { className: 'th-source' }, nls_1.nls.localizeByDefault('Source')))),
                    React.createElement("tbody", null, this.renderRows()))));
    }
    /**
     * Render the table rows.
     */
    renderRows() {
        return React.createElement(React.Fragment, null, this.items.map((item, index) => item.visible !== false && this.renderRow(item, index)));
    }
    renderRow(item, index) {
        const { command, keybinding } = item;
        // TODO get rid of array functions in event handlers
        return React.createElement("tr", { className: 'kb-item-row', key: index, onDoubleClick: () => this.editKeybinding(item) },
            React.createElement("td", { className: 'kb-actions' }, this.renderActions(item)),
            React.createElement("td", { className: 'kb-label', title: this.getCommandLabel(command) }, this.renderMatchedData(item.labels.command)),
            React.createElement("td", { title: this.getKeybindingLabel(keybinding), className: 'kb-keybinding monaco-keybinding' }, this.renderKeybinding(item)),
            React.createElement("td", { className: 'kb-context', title: this.getContextLabel(keybinding) },
                React.createElement("code", null, this.renderMatchedData(item.labels.context))),
            React.createElement("td", { className: 'kb-source', title: this.getScopeLabel(keybinding) },
                React.createElement("code", { className: 'td-source' }, this.renderMatchedData(item.labels.source))));
    }
    /**
     * Render the actions container with action icons.
     * @param item the keybinding item for the row.
     */
    renderActions(item) {
        return React.createElement("span", { className: 'kb-actions-icons' },
            this.renderEdit(item),
            this.renderReset(item));
    }
    /**
     * Render the edit action used to update a keybinding.
     * @param item the keybinding item for the row.
     */
    renderEdit(item) {
        return React.createElement("a", { title: 'Edit Keybinding', href: '#', onClick: e => {
                e.preventDefault();
                this.editKeybinding(item);
            } },
            React.createElement("i", { className: `${(0, browser_1.codicon)('edit', true)} kb-action-item` }));
    }
    /**
     * Render the reset action to reset the custom keybinding.
     * Only visible if a keybinding has a `user` scope.
     * @param item the keybinding item for the row.
     */
    renderReset(item) {
        return (item.keybinding && item.keybinding.scope === browser_1.KeybindingScope.USER)
            ? React.createElement("a", { title: 'Reset Keybinding', href: '#', onClick: e => {
                    e.preventDefault();
                    this.resetKeybinding(item);
                } },
                React.createElement("i", { className: `${(0, browser_1.codicon)('discard', true)} kb-action-item` })) : '';
    }
    /**
     * Render the keybinding.
     * @param keybinding the keybinding value.
     */
    renderKeybinding(keybinding) {
        if (!keybinding.keybinding) {
            return undefined;
        }
        if (keybinding.labels.keybinding.segments) {
            return keybinding.labels.keybinding.segments.map((segment, index) => {
                if (segment.key) {
                    return React.createElement("span", { key: index, className: 'monaco-keybinding-key' },
                        React.createElement("span", { className: `${segment.match ? 'fuzzy-match' : ''}` }, segment.value));
                }
                else {
                    return React.createElement("span", { key: index, className: 'monaco-keybinding-separator' }, segment.value);
                }
            });
        }
        console.warn('Unexpectedly encountered a keybinding without segment divisions');
        return keybinding.labels.keybinding.value;
    }
    /**
     * Get the list of keybinding items.
     *
     * @returns the list of keybinding items.
     */
    getItems() {
        // Sort the commands alphabetically.
        const commands = this.commandRegistry.commands;
        const items = [];
        // Build the keybinding items.
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            // Skip internal commands prefixed by `_`.
            if (command.id.startsWith('_')) {
                continue;
            }
            const keybindings = this.keybindingRegistry.getKeybindingsForCommand(command.id);
            keybindings.forEach(keybinding => {
                const item = this.createKeybindingItem(command, keybinding);
                items.push(item);
            });
            // we might not have any keybindings for the command
            if (keybindings.length < 1) {
                const item = this.createKeybindingItem(command);
                items.push(item);
            }
        }
        return this.sortKeybindings(items);
    }
    createKeybindingItem(command, keybinding) {
        const item = {
            command,
            keybinding,
            labels: {
                id: { value: command.id },
                command: { value: this.getCommandLabel(command) },
                keybinding: { value: this.getKeybindingLabel(keybinding) || '' },
                context: { value: this.getContextLabel(keybinding) || '' },
                source: { value: this.getScopeLabel(keybinding) || '' }
            }
        };
        this.formatAndMatchCommand(item);
        this.formatAndMatchKeybinding(item, []);
        this.formatAndMatchContext(item);
        this.formatAndMatchSource(item);
        return item;
    }
    /**
     * @returns the input array, sorted.
     * The sort priority is as follows: items with keybindings before those without, then alphabetical by command.
     */
    sortKeybindings(bindings) {
        return bindings.sort((a, b) => {
            if (a.keybinding && !b.keybinding) {
                return -1;
            }
            if (b.keybinding && !a.keybinding) {
                return 1;
            }
            return this.compareItem(a.command, b.command);
        });
    }
    /**
     * Get the human-readable label for a given command.
     * @param command the command.
     *
     * @returns a human-readable label for the given command.
     */
    getCommandLabel(command) {
        if (command.label) {
            // Prefix the command label with the category if it exists, else return the simple label.
            return command.category ? `${command.category}: ${command.label}` : command.label;
        }
        return command.id;
    }
    getKeybindingLabel(keybinding) {
        return keybinding && keybinding.keybinding;
    }
    getContextLabel(keybinding) {
        return keybinding ? keybinding.context || keybinding.when : undefined;
    }
    getScopeLabel(keybinding) {
        let scope = keybinding && keybinding.scope;
        if (scope !== undefined) {
            if (scope < browser_1.KeybindingScope.USER) {
                scope = browser_1.KeybindingScope.DEFAULT;
            }
            return browser_1.KeybindingScope[scope].toLocaleLowerCase();
        }
        return undefined;
    }
    /**
     * Compare two commands.
     * - Commands with a label should be prioritized and alphabetically sorted.
     * - Commands without a label (id) should be placed at the bottom.
     * @param a the first command.
     * @param b the second command.
     *
     * @returns an integer indicating whether `a` comes before, after or is equivalent to `b`.
     * - returns `-1` if `a` occurs before `b`.
     * - returns `1` if `a` occurs after `b`.
     * - returns `0` if they are equivalent.
     */
    compareItem(a, b) {
        const labelA = this.getCommandLabel(a);
        const labelB = this.getCommandLabel(b);
        if (labelA === a.id && labelB === b.id) {
            return labelA.toLowerCase().localeCompare(labelB.toLowerCase());
        }
        if (labelA === a.id) {
            return 1;
        }
        if (labelB === b.id) {
            return -1;
        }
        return labelA.toLowerCase().localeCompare(labelB.toLowerCase());
    }
    /**
     * Prompt users to update the keybinding for the given command.
     * @param item the keybinding item.
     */
    editKeybinding(item) {
        const command = item.command.id;
        const oldKeybinding = item.keybinding;
        const dialog = new EditKeybindingDialog({
            title: nls_1.nls.localize('theia/keymaps/editKeybindingTitle', 'Edit Keybinding for {0}', command),
            maxWidth: 400,
            initialValue: oldKeybinding === null || oldKeybinding === void 0 ? void 0 : oldKeybinding.keybinding,
            validate: newKeybinding => this.validateKeybinding(command, oldKeybinding === null || oldKeybinding === void 0 ? void 0 : oldKeybinding.keybinding, newKeybinding),
        }, this.keymapsService, item);
        dialog.open().then(async (keybinding) => {
            if (keybinding) {
                await this.keymapsService.setKeybinding({
                    ...item.keybinding,
                    command,
                    keybinding
                }, oldKeybinding);
            }
        });
    }
    /**
     * Prompt users for confirmation before resetting.
     * @param command the command label.
     *
     * @returns a Promise which resolves to `true` if a user accepts resetting.
     */
    async confirmResetKeybinding(item) {
        const message = document.createElement('div');
        const question = document.createElement('p');
        question.textContent = nls_1.nls.localize('theia/keymaps/resetKeybindingConfirmation', 'Do you really want to reset this keybinding to its default value?');
        message.append(question);
        const info = document.createElement('p');
        info.textContent = nls_1.nls.localize('theia/keymaps/resetMultipleKeybindingsWarning', 'If multiple keybindings exist for this command, all of them will be reset.');
        message.append(info);
        const dialog = new browser_1.ConfirmDialog({
            title: nls_1.nls.localize('theia/keymaps/resetKeybindingTitle', 'Reset keybinding for {0}', this.getCommandLabel(item.command)),
            msg: message
        });
        return !!await dialog.open();
    }
    /**
     * Reset the keybinding to its default value.
     * @param item the keybinding item.
     */
    async resetKeybinding(item) {
        const confirmed = await this.confirmResetKeybinding(item);
        if (confirmed) {
            this.keymapsService.removeKeybinding(item.command.id);
        }
    }
    /**
     * Validate the provided keybinding value against its previous value.
     * @param command the command label.
     * @param oldKeybinding the old keybinding value.
     * @param keybinding the new keybinding value.
     *
     * @returns the end user message to display.
     */
    validateKeybinding(command, oldKeybinding, keybinding) {
        if (!keybinding) {
            return nls_1.nls.localize('theia/keymaps/requiredKeybindingValidation', 'keybinding value is required');
        }
        try {
            const binding = { command, keybinding };
            browser_1.KeySequence.parse(keybinding);
            if (oldKeybinding === keybinding) {
                return ''; // if old and new keybindings match, quietly reject update
            }
            if (this.keybindingRegistry.containsKeybindingInScope(binding)) {
                return nls_1.nls.localize('theia/keymaps/keybindingCollidesValidation', 'keybinding currently collides');
            }
            return '';
        }
        catch (error) {
            return error;
        }
    }
    /**
     * Build the cell data with highlights if applicable.
     * @param raw the raw cell value.
     *
     * @returns the list of cell data.
     */
    buildCellData(raw) {
        const data = [];
        if (this.query === '') {
            return data;
        }
        let following = raw;
        let leading;
        let result;
        const regexp = new RegExp(this.regexp);
        while (result = regexp.exec(raw)) {
            const splitLeftIndex = following.indexOf(result[0]);
            const splitRightIndex = splitLeftIndex + result[0].length;
            leading = following.slice(0, splitLeftIndex);
            following = following.slice(splitRightIndex);
            if (leading) {
                data.push({ value: leading, highlighted: false });
            }
            data.push({ value: result[1], highlighted: true });
        }
        if (following) {
            data.push({ value: following, highlighted: false });
        }
        return data;
    }
    /**
     * Render the fuzzy representation of a matched result.
     * @param property one of the `KeybindingItem` properties.
     */
    renderMatchedData(property) {
        if (property.segments) {
            return React.createElement(React.Fragment, null, property.segments.map((segment, index) => segment.match
                ? React.createElement("span", { key: index, className: 'fuzzy-match' }, segment.value)
                : React.createElement("span", { key: index }, segment.value)));
        }
        return property.value;
    }
    storeState() {
        return { query: this.query };
    }
    restoreState(oldState) {
        if (typeof (oldState === null || oldState === void 0 ? void 0 : oldState.query) === 'string') {
            this.onRenderCallbacks.push({
                dispose: () => {
                    const searchField = this.findSearchField();
                    if (searchField) {
                        searchField.value = oldState.query;
                        this.searchKeybindings();
                    }
                }
            });
        }
    }
};
KeybindingWidget.ID = 'keybindings.view.widget';
KeybindingWidget.LABEL = nls_1.nls.localizeByDefault('Keyboard Shortcuts');
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], KeybindingWidget.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], KeybindingWidget.prototype, "keybindingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(keymaps_service_1.KeymapsService),
    __metadata("design:type", keymaps_service_1.KeymapsService)
], KeybindingWidget.prototype, "keymapsService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeybindingWidget.prototype, "init", null);
KeybindingWidget = KeybindingWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.unmanaged)()),
    __metadata("design:paramtypes", [Object])
], KeybindingWidget);
exports.KeybindingWidget = KeybindingWidget;
/**
 * Dialog used to edit keybindings, and reset custom keybindings.
 */
let EditKeybindingDialog = class EditKeybindingDialog extends browser_1.SingleTextInputDialog {
    constructor(props, keymapsService, item) {
        super(props);
        this.keymapsService = keymapsService;
        this.item = item;
        // Add the `Reset` button if the command currently has a custom keybinding.
        if (this.item.keybinding && this.item.keybinding.scope === browser_1.KeybindingScope.USER) {
            this.appendResetButton();
        }
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        if (this.resetButton) {
            this.addResetAction(this.resetButton, 'click');
        }
    }
    /**
     * Add `Reset` action used to reset a custom keybinding, and close the dialog.
     * @param element the HTML element in question.
     * @param additionalEventTypes additional event types.
     */
    addResetAction(element, ...additionalEventTypes) {
        this.addKeyListener(element, browser_1.Key.ENTER, () => {
            this.reset();
            this.close();
        }, ...additionalEventTypes);
    }
    /**
     * Create the `Reset` button, and append it to the dialog.
     *
     * @returns the `Reset` button.
     */
    appendResetButton() {
        // Create the `Reset` button.
        const resetButtonTitle = nls_1.nls.localizeByDefault('Reset');
        this.resetButton = this.createButton(resetButtonTitle);
        // Add the `Reset` button to the dialog control panel, before the `Accept` button.
        this.controlPanel.insertBefore(this.resetButton, this.acceptButton);
        this.resetButton.title = nls_1.nls.localizeByDefault('Reset Keybinding');
        this.resetButton.classList.add('secondary');
        return this.resetButton;
    }
    /**
     * Perform keybinding reset.
     */
    reset() {
        this.keymapsService.removeKeybinding(this.item.command.id);
    }
};
EditKeybindingDialog = __decorate([
    __param(0, (0, inversify_1.inject)(browser_1.SingleTextInputDialogProps)),
    __param(1, (0, inversify_1.inject)(keymaps_service_1.KeymapsService)),
    __metadata("design:paramtypes", [browser_1.SingleTextInputDialogProps,
        keymaps_service_1.KeymapsService, Object])
], EditKeybindingDialog);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/keymaps/lib/browser/keybindings-widget'] = this;


/***/ }),

/***/ "../../packages/keymaps/lib/browser/keymaps-frontend-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/keymaps/lib/browser/keymaps-frontend-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
exports.KeymapsFrontendContribution = exports.KeymapsCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_frontend_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/common-frontend-contribution */ "../../packages/core/lib/browser/common-frontend-contribution.js");
const keymaps_service_1 = __webpack_require__(/*! ./keymaps-service */ "../../packages/keymaps/lib/browser/keymaps-service.js");
const keybindings_widget_1 = __webpack_require__(/*! ./keybindings-widget */ "../../packages/keymaps/lib/browser/keybindings-widget.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
var KeymapsCommands;
(function (KeymapsCommands) {
    KeymapsCommands.OPEN_KEYMAPS = common_1.Command.toDefaultLocalizedCommand({
        id: 'keymaps:open',
        category: common_frontend_contribution_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Keyboard Shortcuts',
    });
    KeymapsCommands.OPEN_KEYMAPS_JSON = common_1.Command.toDefaultLocalizedCommand({
        id: 'keymaps:openJson',
        category: common_frontend_contribution_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Keyboard Shortcuts (JSON)',
    });
    KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR = {
        id: 'keymaps:openJson.toolbar',
        iconClass: (0, browser_1.codicon)('json')
    };
    KeymapsCommands.CLEAR_KEYBINDINGS_SEARCH = {
        id: 'keymaps.clearSearch',
        iconClass: (0, browser_1.codicon)('clear-all')
    };
})(KeymapsCommands = exports.KeymapsCommands || (exports.KeymapsCommands = {}));
let KeymapsFrontendContribution = class KeymapsFrontendContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: keybindings_widget_1.KeybindingWidget.ID,
            widgetName: keybindings_widget_1.KeybindingWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main'
            },
        });
    }
    registerCommands(commands) {
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS, {
            isEnabled: () => true,
            execute: () => this.openView({ activate: true })
        });
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS_JSON, {
            isEnabled: () => true,
            execute: () => this.keymaps.open()
        });
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR, {
            isEnabled: w => this.withWidget(w, () => true),
            isVisible: w => this.withWidget(w, () => true),
            execute: w => this.withWidget(w, widget => this.keymaps.open(widget)),
        });
        commands.registerCommand(KeymapsCommands.CLEAR_KEYBINDINGS_SEARCH, {
            isEnabled: w => this.withWidget(w, widget => widget.hasSearch()),
            isVisible: w => this.withWidget(w, () => true),
            execute: w => this.withWidget(w, widget => widget.clearSearch()),
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(common_frontend_contribution_1.CommonMenus.FILE_SETTINGS_SUBMENU_OPEN, {
            commandId: KeymapsCommands.OPEN_KEYMAPS.id,
            label: nls_1.nls.localizeByDefault('Keyboard Shortcuts'),
            order: 'a20'
        });
        menus.registerMenuAction(common_frontend_contribution_1.CommonMenus.SETTINGS_OPEN, {
            commandId: KeymapsCommands.OPEN_KEYMAPS.id,
            label: nls_1.nls.localizeByDefault('Keyboard Shortcuts'),
            order: 'a20'
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: KeymapsCommands.OPEN_KEYMAPS.id,
            keybinding: 'ctrl+alt+,'
        });
    }
    async registerToolbarItems(toolbar) {
        const widget = await this.widget;
        const onDidChange = widget.onDidUpdate;
        toolbar.registerItem({
            id: KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR.id,
            command: KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR.id,
            tooltip: nls_1.nls.localizeByDefault('Open Keyboard Shortcuts (JSON)'),
            priority: 0,
        });
        toolbar.registerItem({
            id: KeymapsCommands.CLEAR_KEYBINDINGS_SEARCH.id,
            command: KeymapsCommands.CLEAR_KEYBINDINGS_SEARCH.id,
            tooltip: nls_1.nls.localizeByDefault('Clear Keybindings Search Input'),
            priority: 1,
            onDidChange,
        });
    }
    /**
     * Determine if the current widget is the keybindings widget.
     */
    withWidget(widget = this.tryGetWidget(), fn) {
        if (widget instanceof keybindings_widget_1.KeybindingWidget && widget.id === keybindings_widget_1.KeybindingWidget.ID) {
            return fn(widget);
        }
        return false;
    }
};
__decorate([
    (0, inversify_1.inject)(keymaps_service_1.KeymapsService),
    __metadata("design:type", keymaps_service_1.KeymapsService)
], KeymapsFrontendContribution.prototype, "keymaps", void 0);
KeymapsFrontendContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], KeymapsFrontendContribution);
exports.KeymapsFrontendContribution = KeymapsFrontendContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/keymaps/lib/browser/keymaps-frontend-contribution'] = this;


/***/ }),

/***/ "../../packages/keymaps/lib/browser/keymaps-frontend-module.js":
/*!*********************************************************************!*\
  !*** ../../packages/keymaps/lib/browser/keymaps-frontend-module.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
__webpack_require__(/*! ./keymaps-monaco-contribution */ "../../packages/keymaps/lib/browser/keymaps-monaco-contribution.js");
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/keymaps/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const keymaps_service_1 = __webpack_require__(/*! ./keymaps-service */ "../../packages/keymaps/lib/browser/keymaps-service.js");
const keymaps_frontend_contribution_1 = __webpack_require__(/*! ./keymaps-frontend-contribution */ "../../packages/keymaps/lib/browser/keymaps-frontend-contribution.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const keybinding_1 = __webpack_require__(/*! @theia/core/lib/browser/keybinding */ "../../packages/core/lib/browser/keybinding.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const keybindings_widget_1 = __webpack_require__(/*! ./keybindings-widget */ "../../packages/keymaps/lib/browser/keybindings-widget.js");
const keybinding_schema_updater_1 = __webpack_require__(/*! ./keybinding-schema-updater */ "../../packages/keymaps/lib/browser/keybinding-schema-updater.js");
const json_schema_store_1 = __webpack_require__(/*! @theia/core/lib/browser/json-schema-store */ "../../packages/core/lib/browser/json-schema-store.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(keymaps_service_1.KeymapsService).toSelf().inSingletonScope();
    bind(keymaps_frontend_contribution_1.KeymapsFrontendContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(keymaps_frontend_contribution_1.KeymapsFrontendContribution);
    bind(keybinding_1.KeybindingContribution).toService(keymaps_frontend_contribution_1.KeymapsFrontendContribution);
    bind(common_1.MenuContribution).toService(keymaps_frontend_contribution_1.KeymapsFrontendContribution);
    bind(keybindings_widget_1.KeybindingWidget).toSelf();
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(keymaps_frontend_contribution_1.KeymapsFrontendContribution);
    bind(browser_1.WidgetFactory).toDynamicValue(context => ({
        id: keybindings_widget_1.KeybindingWidget.ID,
        createWidget: () => context.container.get(keybindings_widget_1.KeybindingWidget),
    })).inSingletonScope();
    bind(keybinding_schema_updater_1.KeybindingSchemaUpdater).toSelf().inSingletonScope();
    bind(json_schema_store_1.JsonSchemaContribution).toService(keybinding_schema_updater_1.KeybindingSchemaUpdater);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/keymaps/lib/browser/keymaps-frontend-module'] = this;


/***/ }),

/***/ "../../packages/keymaps/lib/browser/keymaps-monaco-contribution.js":
/*!*************************************************************************!*\
  !*** ../../packages/keymaps/lib/browser/keymaps-monaco-contribution.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
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
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
monaco.languages.register({
    id: 'jsonc',
    'aliases': [
        'JSON with Comments'
    ],
    'filenames': [
        'keymaps.json'
    ]
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/keymaps/lib/browser/keymaps-monaco-contribution'] = this;


/***/ }),

/***/ "../../packages/keymaps/lib/browser/keymaps-service.js":
/*!*************************************************************!*\
  !*** ../../packages/keymaps/lib/browser/keymaps-service.js ***!
  \*************************************************************/
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
exports.KeymapsService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const keybinding_1 = __webpack_require__(/*! @theia/core/lib/browser/keybinding */ "../../packages/core/lib/browser/keybinding.js");
const keybinding_2 = __webpack_require__(/*! @theia/core/lib/common/keybinding */ "../../packages/core/lib/common/keybinding.js");
const browser_2 = __webpack_require__(/*! @theia/userstorage/lib/browser */ "../../packages/userstorage/lib/browser/index.js");
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const monaco_workspace_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const monaco_jsonc_editor_1 = __webpack_require__(/*! @theia/preferences/lib/browser/monaco-jsonc-editor */ "../../packages/preferences/lib/browser/monaco-jsonc-editor.js");
let KeymapsService = class KeymapsService {
    constructor() {
        this.changeKeymapEmitter = new event_1.Emitter();
        this.onDidChangeKeymaps = this.changeKeymapEmitter.event;
        this.deferredModel = new promise_util_1.Deferred();
    }
    /**
     * Initialize the keybinding service.
     */
    init() {
        this.doInit();
    }
    async doInit() {
        const reference = await this.textModelService.createModelReference(browser_2.UserStorageUri.resolve('keymaps.json'));
        this.model = reference.object;
        this.deferredModel.resolve(this.model);
        this.reconcile();
        this.model.onDidChangeContent(() => this.reconcile());
        this.model.onDirtyChanged(() => this.reconcile());
        this.model.onDidChangeValid(() => this.reconcile());
        this.keybindingRegistry.onKeybindingsChanged(() => this.changeKeymapEmitter.fire(undefined));
    }
    /**
     * Reconcile all the keybindings, registering them to the registry.
     */
    reconcile() {
        const model = this.model;
        if (!model || model.dirty) {
            return;
        }
        try {
            const keybindings = [];
            if (model.valid) {
                const content = model.getText();
                const json = jsoncparser.parse(content, undefined, { disallowComments: false });
                if (Array.isArray(json)) {
                    for (const value of json) {
                        if (keybinding_2.Keybinding.is(value)) {
                            keybindings.push(value);
                        }
                        else if (keybinding_2.RawKeybinding.is(value)) {
                            keybindings.push(keybinding_2.Keybinding.apiObjectify(value));
                        }
                    }
                }
            }
            this.keybindingRegistry.setKeymap(keybinding_1.KeybindingScope.USER, keybindings);
        }
        catch (e) {
            console.error(`Failed to load keymaps from '${model.uri}'.`, e);
        }
    }
    /**
     * Open the keybindings widget.
     * @param ref the optional reference for opening the widget.
     */
    async open(ref) {
        const model = await this.deferredModel.promise;
        const options = {
            widgetOptions: ref ? { area: 'main', mode: 'split-right', ref } : { area: 'main' },
            mode: 'activate'
        };
        if (!model.valid) {
            await model.save();
        }
        await (0, browser_1.open)(this.opener, new uri_1.default(model.uri), options);
    }
    /**
     * Set the keybinding in the JSON.
     * @param newKeybinding the new JSON keybinding
     * @param oldKeybinding the old JSON keybinding
     */
    async setKeybinding(newKeybinding, oldKeybinding) {
        return this.updateKeymap(() => {
            let newAdded = false;
            let isOldKeybindingDisabled = false;
            let addedDisabledEntry = false;
            const keybindings = [];
            for (let keybinding of this.keybindingRegistry.getKeybindingsByScope(keybinding_1.KeybindingScope.USER)) {
                // search for the old keybinding and modify it
                if (oldKeybinding && keybinding_2.Keybinding.equals(keybinding, oldKeybinding, false, true)) {
                    newAdded = true;
                    keybinding = {
                        ...keybinding,
                        keybinding: newKeybinding.keybinding
                    };
                }
                // we have an disabled entry for the same command and the oldKeybinding
                if ((oldKeybinding === null || oldKeybinding === void 0 ? void 0 : oldKeybinding.keybinding) &&
                    keybinding_2.Keybinding.equals(keybinding, { ...newKeybinding, keybinding: oldKeybinding.keybinding, command: '-' + newKeybinding.command }, false, true)) {
                    isOldKeybindingDisabled = true;
                }
                keybindings.push(keybinding);
            }
            if (!newAdded) {
                keybindings.push({
                    command: newKeybinding.command,
                    keybinding: newKeybinding.keybinding,
                    context: newKeybinding.context,
                    when: newKeybinding.when,
                    args: newKeybinding.args
                });
                newAdded = true;
            }
            // we want to add a disabled entry for the old keybinding only when we are modifying the default value
            if (!isOldKeybindingDisabled && (oldKeybinding === null || oldKeybinding === void 0 ? void 0 : oldKeybinding.scope) === keybinding_1.KeybindingScope.DEFAULT) {
                const disabledBinding = {
                    command: '-' + newKeybinding.command,
                    // TODO key: oldKeybinding, see https://github.com/eclipse-theia/theia/issues/6879
                    keybinding: oldKeybinding.keybinding,
                    context: newKeybinding.context,
                    when: newKeybinding.when,
                    args: newKeybinding.args
                };
                // Add disablement of the old keybinding if it isn't already disabled in the list to avoid duplicate disabled entries
                if (!keybindings.some(binding => keybinding_2.Keybinding.equals(binding, disabledBinding, false, true))) {
                    keybindings.push(disabledBinding);
                }
                isOldKeybindingDisabled = true;
                addedDisabledEntry = true;
            }
            if (newAdded || addedDisabledEntry) {
                return keybindings;
            }
        });
    }
    /**
     * Remove the given keybinding with the given command id from the JSON.
     * @param commandId the keybinding command id.
     */
    removeKeybinding(commandId) {
        return this.updateKeymap(() => {
            const keybindings = this.keybindingRegistry.getKeybindingsByScope(keybinding_1.KeybindingScope.USER);
            const removedCommand = '-' + commandId;
            const filtered = keybindings.filter(a => a.command !== commandId && a.command !== removedCommand);
            if (filtered.length !== keybindings.length) {
                return filtered;
            }
        });
    }
    async updateKeymap(op) {
        const model = await this.deferredModel.promise;
        try {
            const keybindings = op();
            if (keybindings && this.model) {
                await this.jsoncEditor.setValue(this.model, [], keybindings.map(binding => keybinding_2.Keybinding.apiObjectify(binding)));
            }
        }
        catch (e) {
            const message = `Failed to update a keymap in '${model.uri}'.`;
            this.messageService.error(`${message} Please check if it is corrupted.`);
            console.error(`${message}`, e);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace),
    __metadata("design:type", monaco_workspace_1.MonacoWorkspace)
], KeymapsService.prototype, "workspace", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], KeymapsService.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(keybinding_1.KeybindingRegistry),
    __metadata("design:type", keybinding_1.KeybindingRegistry)
], KeymapsService.prototype, "keybindingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], KeymapsService.prototype, "opener", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], KeymapsService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_jsonc_editor_1.MonacoJSONCEditor),
    __metadata("design:type", monaco_jsonc_editor_1.MonacoJSONCEditor)
], KeymapsService.prototype, "jsoncEditor", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeymapsService.prototype, "init", null);
KeymapsService = __decorate([
    (0, inversify_1.injectable)()
], KeymapsService);
exports.KeymapsService = KeymapsService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/keymaps/lib/browser/keymaps-service'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/monaco-jsonc-editor.js":
/*!*********************************************************************!*\
  !*** ../../packages/preferences/lib/browser/monaco-jsonc-editor.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.MonacoJSONCEditor = void 0;
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const monaco_workspace_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
let MonacoJSONCEditor = class MonacoJSONCEditor {
    async setValue(model, path, value, shouldSave = true) {
        const edits = this.getEditOperations(model, path, value);
        if (edits.length > 0) {
            await this.workspace.applyBackgroundEdit(model, edits, shouldSave);
        }
    }
    getEditOperations(model, path, value) {
        const textModel = model.textEditorModel;
        const content = model.getText().trim();
        // Everything is already undefined - no need for changes.
        if (!content && value === undefined) {
            return [];
        }
        // Delete the entire document.
        if (!path.length && value === undefined) {
            return [{
                    range: textModel.getFullModelRange(),
                    text: null,
                    forceMoveMarkers: false
                }];
        }
        const { insertSpaces, tabSize, defaultEOL } = textModel.getOptions();
        const jsonCOptions = {
            formattingOptions: {
                insertSpaces,
                tabSize,
                eol: defaultEOL === monaco.editor.DefaultEndOfLine.LF ? '\n' : '\r\n'
            }
        };
        return jsoncparser.modify(content, path, value, jsonCOptions).map(edit => {
            const start = textModel.getPositionAt(edit.offset);
            const end = textModel.getPositionAt(edit.offset + edit.length);
            return {
                range: monaco.Range.fromPositions(start, end),
                text: edit.content || null,
                forceMoveMarkers: false
            };
        });
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace),
    __metadata("design:type", monaco_workspace_1.MonacoWorkspace)
], MonacoJSONCEditor.prototype, "workspace", void 0);
MonacoJSONCEditor = __decorate([
    (0, inversify_1.injectable)()
], MonacoJSONCEditor);
exports.MonacoJSONCEditor = MonacoJSONCEditor;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/monaco-jsonc-editor'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/index.js":
/*!*******************************************************!*\
  !*** ../../packages/userstorage/lib/browser/index.js ***!
  \*******************************************************/
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
__exportStar(__webpack_require__(/*! ./user-storage-uri */ "../../packages/userstorage/lib/browser/user-storage-uri.js"), exports);
__exportStar(__webpack_require__(/*! ./user-storage-frontend-module */ "../../packages/userstorage/lib/browser/user-storage-frontend-module.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/user-storage-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
exports.UserStorageContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const delegating_file_system_provider_1 = __webpack_require__(/*! @theia/filesystem/lib/common/delegating-file-system-provider */ "../../packages/filesystem/lib/common/delegating-file-system-provider.js");
const user_storage_uri_1 = __webpack_require__(/*! ./user-storage-uri */ "../../packages/userstorage/lib/browser/user-storage-uri.js");
let UserStorageContribution = class UserStorageContribution {
    registerFileSystemProviders(service) {
        service.onWillActivateFileSystemProvider(event => {
            if (event.scheme === user_storage_uri_1.UserStorageUri.scheme) {
                event.waitUntil((async () => {
                    const provider = await this.createProvider(service);
                    service.registerProvider(user_storage_uri_1.UserStorageUri.scheme, provider);
                })());
            }
        });
    }
    async createProvider(service) {
        const delegate = await service.activateProvider('file');
        const configDirUri = new uri_1.default(await this.environments.getConfigDirUri());
        return new delegating_file_system_provider_1.DelegatingFileSystemProvider(delegate, {
            uriConverter: {
                to: resource => {
                    const relativePath = user_storage_uri_1.UserStorageUri.relative(resource);
                    if (relativePath) {
                        return configDirUri.resolve(relativePath).normalizePath();
                    }
                    return undefined;
                },
                from: resource => {
                    const relativePath = configDirUri.relative(resource);
                    if (relativePath) {
                        return user_storage_uri_1.UserStorageUri.resolve(relativePath);
                    }
                    return undefined;
                }
            }
        }, new disposable_1.DisposableCollection(delegate.watch(configDirUri, { excludes: [], recursive: true })));
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], UserStorageContribution.prototype, "environments", void 0);
UserStorageContribution = __decorate([
    (0, inversify_1.injectable)()
], UserStorageContribution);
exports.UserStorageContribution = UserStorageContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-contribution'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/user-storage-frontend-module.js":
/*!******************************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-frontend-module.js ***!
  \******************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const user_storage_contribution_1 = __webpack_require__(/*! ./user-storage-contribution */ "../../packages/userstorage/lib/browser/user-storage-contribution.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(user_storage_contribution_1.UserStorageContribution).toSelf().inSingletonScope();
    bind(file_service_1.FileServiceContribution).toService(user_storage_contribution_1.UserStorageContribution);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-frontend-module'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/user-storage-uri.js":
/*!******************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-uri.js ***!
  \******************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStorageUri = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
exports.UserStorageUri = new uri_1.default('user-storage:/user');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-uri'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/keymaps/src/browser/style/index.css":
/*!****************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/keymaps/src/browser/style/index.css ***!
  \****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

#kb-main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#kb-table-container {
  flex: 1;
  overflow: auto;
}

.fuzzy-match {
  font-weight: 600;
  color: var(--theia-list-highlightForeground);
}

.kb-actions {
  text-align: center;
  vertical-align: middle;
}

.kb-action-item {
  visibility: hidden;
}

.kb table {
  border-spacing: 0;
  border-collapse: separate;
  background-color: var(--theia-editor-background);
  width: 100%;
  table-layout: fixed;
}

.kb table tr {
  min-height: var(--theia-icon-size);
}

.th-action,
.th-keybinding,
.kb-actions,
.kb-keybinding {
  min-height: 18px;
  overflow: hidden;
  vertical-align: middle;
  white-space: nowrap;
}

.th-action,
.kb-actions {
  padding: 2px 0px 5px 0px;
}

.th-keybinding,
.kb-keybinding {
  padding: 2px 10px 5px 10px;
}

.th-label,
.th-source,
.th-context,
.th-keybinding,
.kb-label,
.kb-source,
.kb-context {
  padding: 2px 10px 5px 10px;
  min-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
}

.kb table th {
  font-size: var(--theia-ui-font-size1);
}

.kb table td code {
  font-size: 90%;
}

.td-source {
  text-transform: lowercase;
}

.kb table tr:nth-child(odd) {
  background-color: rgba(130, 130, 130, 0.04);
}

.kb table tbody tr:hover {
  background-color: var(--theia-list-focusBackground);
}

.kb table tbody tr:hover .kb-action-item {
  visibility: visible;
  color: var(--theia-icon-foreground);
  text-decoration: none;
}

.kb table th {
  word-break: keep-all;
  padding-bottom: 5px;
  padding-top: 5px;
  text-align: left;
  vertical-align: middle;
  position: sticky;
  top: 0;
  background-color: var(--theia-editorWidget-background);
  text-transform: capitalize;
}

.kb table .th-action {
  width: 4%;
}

.kb table .th-label {
  width: 25%;
}

.kb table .th-keybinding {
  width: 20%;
}

.kb table .th-source {
  width: 10%;
}

.kb table .th-context {
  width: 25%;
}

.no-kb {
  border: 1px solid var(--theia-editorWarning-foreground);
}

#search-kb {
  height: 25px;
  flex: 1;
}

.vs #search-kb {
  border: 1px solid #ddd;
}

.search-kb-container {
  padding: 10px;
  display: flex;
}

.kb-item-row td a,
.kb-item-row td a:active,
.kb-item-row td a:focus {
  outline: 0;
  border: none;
}

.kb-actions-icons {
  display: block;
}
`, "",{"version":3,"sources":["webpack://./../../packages/keymaps/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,aAAa;EACb,sBAAsB;EACtB,YAAY;AACd;;AAEA;EACE,OAAO;EACP,cAAc;AAChB;;AAEA;EACE,gBAAgB;EAChB,4CAA4C;AAC9C;;AAEA;EACE,kBAAkB;EAClB,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,iBAAiB;EACjB,yBAAyB;EACzB,gDAAgD;EAChD,WAAW;EACX,mBAAmB;AACrB;;AAEA;EACE,kCAAkC;AACpC;;AAEA;;;;EAIE,gBAAgB;EAChB,gBAAgB;EAChB,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;;EAEE,wBAAwB;AAC1B;;AAEA;;EAEE,0BAA0B;AAC5B;;AAEA;;;;;;;EAOE,0BAA0B;EAC1B,gBAAgB;EAChB,gBAAgB;EAChB,uBAAuB;EACvB,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,2CAA2C;AAC7C;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,mBAAmB;EACnB,mCAAmC;EACnC,qBAAqB;AACvB;;AAEA;EACE,oBAAoB;EACpB,mBAAmB;EACnB,gBAAgB;EAChB,gBAAgB;EAChB,sBAAsB;EACtB,gBAAgB;EAChB,MAAM;EACN,sDAAsD;EACtD,0BAA0B;AAC5B;;AAEA;EACE,SAAS;AACX;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,uDAAuD;AACzD;;AAEA;EACE,YAAY;EACZ,OAAO;AACT;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,aAAa;EACb,aAAa;AACf;;AAEA;;;EAGE,UAAU;EACV,YAAY;AACd;;AAEA;EACE,cAAc;AAChB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 Ericsson and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n#kb-main-container {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n#kb-table-container {\n  flex: 1;\n  overflow: auto;\n}\n\n.fuzzy-match {\n  font-weight: 600;\n  color: var(--theia-list-highlightForeground);\n}\n\n.kb-actions {\n  text-align: center;\n  vertical-align: middle;\n}\n\n.kb-action-item {\n  visibility: hidden;\n}\n\n.kb table {\n  border-spacing: 0;\n  border-collapse: separate;\n  background-color: var(--theia-editor-background);\n  width: 100%;\n  table-layout: fixed;\n}\n\n.kb table tr {\n  min-height: var(--theia-icon-size);\n}\n\n.th-action,\n.th-keybinding,\n.kb-actions,\n.kb-keybinding {\n  min-height: 18px;\n  overflow: hidden;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n.th-action,\n.kb-actions {\n  padding: 2px 0px 5px 0px;\n}\n\n.th-keybinding,\n.kb-keybinding {\n  padding: 2px 10px 5px 10px;\n}\n\n.th-label,\n.th-source,\n.th-context,\n.th-keybinding,\n.kb-label,\n.kb-source,\n.kb-context {\n  padding: 2px 10px 5px 10px;\n  min-height: 18px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n.kb table th {\n  font-size: var(--theia-ui-font-size1);\n}\n\n.kb table td code {\n  font-size: 90%;\n}\n\n.td-source {\n  text-transform: lowercase;\n}\n\n.kb table tr:nth-child(odd) {\n  background-color: rgba(130, 130, 130, 0.04);\n}\n\n.kb table tbody tr:hover {\n  background-color: var(--theia-list-focusBackground);\n}\n\n.kb table tbody tr:hover .kb-action-item {\n  visibility: visible;\n  color: var(--theia-icon-foreground);\n  text-decoration: none;\n}\n\n.kb table th {\n  word-break: keep-all;\n  padding-bottom: 5px;\n  padding-top: 5px;\n  text-align: left;\n  vertical-align: middle;\n  position: sticky;\n  top: 0;\n  background-color: var(--theia-editorWidget-background);\n  text-transform: capitalize;\n}\n\n.kb table .th-action {\n  width: 4%;\n}\n\n.kb table .th-label {\n  width: 25%;\n}\n\n.kb table .th-keybinding {\n  width: 20%;\n}\n\n.kb table .th-source {\n  width: 10%;\n}\n\n.kb table .th-context {\n  width: 25%;\n}\n\n.no-kb {\n  border: 1px solid var(--theia-editorWarning-foreground);\n}\n\n#search-kb {\n  height: 25px;\n  flex: 1;\n}\n\n.vs #search-kb {\n  border: 1px solid #ddd;\n}\n\n.search-kb-container {\n  padding: 10px;\n  display: flex;\n}\n\n.kb-item-row td a,\n.kb-item-row td a:active,\n.kb-item-row td a:focus {\n  outline: 0;\n  border: none;\n}\n\n.kb-actions-icons {\n  display: block;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/keymaps/src/browser/style/index.css":
/*!**********************************************************!*\
  !*** ../../packages/keymaps/src/browser/style/index.css ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/keymaps/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_keymaps_lib_browser_keymaps-frontend-module_js.js.map