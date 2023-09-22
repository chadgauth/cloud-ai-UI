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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeybindingWidget = void 0;
const React = require("@theia/core/shared/react");
const debounce = require("@theia/core/shared/lodash.debounce");
const fuzzy = require("@theia/core/shared/fuzzy");
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const command_1 = require("@theia/core/lib/common/command");
const react_widget_1 = require("@theia/core/lib/browser/widgets/react-widget");
const browser_1 = require("@theia/core/lib/browser");
const keymaps_service_1 = require("./keymaps-service");
const alert_message_1 = require("@theia/core/lib/browser/widgets/alert-message");
const core_1 = require("@theia/core");
const nls_1 = require("@theia/core/lib/common/nls");
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
//# sourceMappingURL=keybindings-widget.js.map