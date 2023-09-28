"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.MonacoQuickPickItem = exports.MonacoQuickInputService = exports.MonacoQuickInputImplementation = void 0;
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const quickInput_1 = require("@theia/monaco-editor-core/esm/vs/base/parts/quickinput/browser/quickInput");
const monaco_resolved_keybinding_1 = require("./monaco-resolved-keybinding");
const quickAccess_1 = require("@theia/monaco-editor-core/esm/vs/platform/quickinput/browser/quickAccess");
const contextKeyService_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService");
const listWidget_1 = require("@theia/monaco-editor-core/esm/vs/base/browser/ui/list/listWidget");
const instantiation_1 = require("@theia/monaco-editor-core/esm/vs/platform/instantiation/common/instantiation");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const core_1 = require("@theia/core");
const monaco_color_registry_1 = require("./monaco-color-registry");
const theming_1 = require("@theia/core/lib/browser/theming");
const standaloneTheme_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme");
let MonacoQuickInputImplementation = class MonacoQuickInputImplementation {
    get backButton() { return this.controller.backButton; }
    get onShow() { return this.controller.onShow; }
    get onHide() { return this.controller.onHide; }
    init() {
        this.initContainer();
        this.initController();
        this.quickAccess = new quickAccess_1.QuickAccessController(this, standaloneServices_1.StandaloneServices.get(instantiation_1.IInstantiationService));
        this.inQuickOpen = this.contextKeyService.createKey('inQuickOpen', false);
        this.controller.onShow(() => {
            this.container.style.top = this.shell.mainPanel.node.getBoundingClientRect().top + 'px';
            this.inQuickOpen.set(true);
        });
        this.controller.onHide(() => this.inQuickOpen.set(false));
        this.themeService.initialized.then(() => this.controller.applyStyles(this.getStyles()));
        // Hook into the theming service of Monaco to ensure that the updates are ready.
        standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService).onDidColorThemeChange(() => this.controller.applyStyles(this.getStyles()));
        window.addEventListener('resize', () => this.updateLayout());
    }
    setContextKey(key) {
        if (key) {
            this.contextKeyService.createKey(key, undefined);
        }
    }
    createQuickPick() {
        return this.controller.createQuickPick();
    }
    createInputBox() {
        return this.controller.createInputBox();
    }
    open(filter) {
        this.quickAccess.show(filter);
        setTimeout(() => {
            this.quickInputList.focusNth(0);
        }, 300);
    }
    input(options, token) {
        return this.controller.input(options, token);
    }
    pick(picks, options, token) {
        return this.controller.pick(picks, options, token);
    }
    hide() {
        this.controller.hide();
    }
    focus() {
        this.controller.focus();
    }
    toggle() {
        this.controller.toggle();
    }
    applyStyles(styles) {
        this.controller.applyStyles(styles);
    }
    layout(dimension, titleBarOffset) {
        this.controller.layout(dimension, titleBarOffset);
    }
    navigate(next, quickNavigate) {
        this.controller.navigate(next, quickNavigate);
    }
    dispose() {
        this.controller.dispose();
    }
    async cancel() {
        this.controller.cancel();
    }
    async back() {
        this.controller.back();
    }
    async accept(keyMods) {
        this.controller.accept(keyMods);
    }
    initContainer() {
        const container = this.container = document.createElement('div');
        container.id = 'quick-input-container';
        document.body.appendChild(this.container);
    }
    initController() {
        this.controller = new quickInput_1.QuickInputController(this.getOptions());
        this.updateLayout();
    }
    updateLayout() {
        // Initialize the layout using screen dimensions as monaco computes the actual sizing.
        // https://github.com/microsoft/vscode/blob/6261075646f055b99068d3688932416f2346dd3b/src/vs/base/parts/quickinput/browser/quickInput.ts#L1799
        this.controller.layout(this.getClientDimension(), 0);
    }
    getClientDimension() {
        return { width: window.innerWidth, height: window.innerHeight };
    }
    getOptions() {
        const options = {
            idPrefix: 'quickInput_',
            container: this.container,
            styles: { widget: {}, list: {}, inputBox: {}, countBadge: {}, button: {}, progressBar: {}, keybindingLabel: {}, },
            ignoreFocusOut: () => false,
            isScreenReaderOptimized: () => false,
            backKeybindingLabel: () => undefined,
            setContextKey: (id) => this.setContextKey(id),
            returnFocus: () => this.container.focus(),
            createList: (user, container, delegate, renderers, listOptions) => this.quickInputList = new listWidget_1.List(user, container, delegate, renderers, listOptions),
        };
        return options;
    }
    // @monaco-uplift
    // Keep the styles up to date with https://github.com/microsoft/vscode/blob/7888ff3a6b104e9e2e3d0f7890ca92dd0828215f/src/vs/platform/quickinput/browser/quickInput.ts#L171.
    getStyles() {
        return {
            widget: {
                quickInputBackground: this.colorRegistry.getColor('quickInput.background'),
                quickInputForeground: this.colorRegistry.getColor('quickInput.foreground'),
                quickInputTitleBackground: this.colorRegistry.getColor('quickInputTitle.background')
            },
            list: {
                listBackground: this.colorRegistry.getColor('quickInput.background'),
                listInactiveFocusForeground: this.colorRegistry.getColor('quickInputList.focusForeground'),
                listInactiveSelectionIconForeground: this.colorRegistry.getColor('quickInputList.focusIconForeground'),
                listInactiveFocusBackground: this.colorRegistry.getColor('quickInputList.focusBackground'),
                listFocusOutline: this.colorRegistry.getColor('activeContrastBorder'),
                listInactiveFocusOutline: this.colorRegistry.getColor('activeContrastBorder'),
                pickerGroupBorder: this.colorRegistry.getColor('pickerGroup.border'),
                pickerGroupForeground: this.colorRegistry.getColor('pickerGroup.foreground')
            },
            inputBox: {
                inputForeground: this.colorRegistry.getColor('inputForeground'),
                inputBackground: this.colorRegistry.getColor('inputBackground'),
                inputBorder: this.colorRegistry.getColor('inputBorder'),
                inputValidationInfoBackground: this.colorRegistry.getColor('inputValidation.infoBackground'),
                inputValidationInfoForeground: this.colorRegistry.getColor('inputValidation.infoForeground'),
                inputValidationInfoBorder: this.colorRegistry.getColor('inputValidation.infoBorder'),
                inputValidationWarningBackground: this.colorRegistry.getColor('inputValidation.warningBackground'),
                inputValidationWarningForeground: this.colorRegistry.getColor('inputValidation.warningForeground'),
                inputValidationWarningBorder: this.colorRegistry.getColor('inputValidation.warningBorder'),
                inputValidationErrorBackground: this.colorRegistry.getColor('inputValidation.errorBackground'),
                inputValidationErrorForeground: this.colorRegistry.getColor('inputValidation.errorForeground'),
                inputValidationErrorBorder: this.colorRegistry.getColor('inputValidation.errorBorder'),
            },
            countBadge: {
                badgeBackground: this.colorRegistry.getColor('badge.background'),
                badgeForeground: this.colorRegistry.getColor('badge.foreground'),
                badgeBorder: this.colorRegistry.getColor('contrastBorder')
            },
            button: {
                buttonForeground: this.colorRegistry.getColor('button.foreground'),
                buttonBackground: this.colorRegistry.getColor('button.background'),
                buttonHoverBackground: this.colorRegistry.getColor('button.hoverBackground'),
                buttonBorder: this.colorRegistry.getColor('contrastBorder')
            },
            progressBar: {
                progressBarBackground: this.colorRegistry.getColor('progressBar.background')
            },
            keybindingLabel: {
                keybindingLabelBackground: this.colorRegistry.getColor('keybindingLabe.background'),
                keybindingLabelForeground: this.colorRegistry.getColor('keybindingLabel.foreground'),
                keybindingLabelBorder: this.colorRegistry.getColor('keybindingLabel.border'),
                keybindingLabelBottomBorder: this.colorRegistry.getColor('keybindingLabel.bottomBorder'),
                keybindingLabelShadow: this.colorRegistry.getColor('widget.shadow')
            },
        };
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], MonacoQuickInputImplementation.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_color_registry_1.MonacoColorRegistry),
    __metadata("design:type", monaco_color_registry_1.MonacoColorRegistry)
], MonacoQuickInputImplementation.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], MonacoQuickInputImplementation.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.inject)(contextKeyService_1.ContextKeyService),
    __metadata("design:type", contextKeyService_1.ContextKeyService)
], MonacoQuickInputImplementation.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoQuickInputImplementation.prototype, "init", null);
MonacoQuickInputImplementation = __decorate([
    (0, inversify_1.injectable)()
], MonacoQuickInputImplementation);
exports.MonacoQuickInputImplementation = MonacoQuickInputImplementation;
let MonacoQuickInputService = class MonacoQuickInputService {
    get backButton() {
        return this.monacoService.backButton;
    }
    get onShow() { return this.monacoService.onShow; }
    get onHide() { return this.monacoService.onHide; }
    open(filter) {
        this.monacoService.open(filter);
    }
    createInputBox() {
        return this.monacoService.createInputBox();
    }
    input(options, token) {
        let inputOptions;
        if (options) {
            const { validateInput, ...props } = options;
            inputOptions = { ...props };
            if (validateInput) {
                inputOptions.validateInput = async (input) => validateInput(input);
            }
        }
        return this.monacoService.input(inputOptions, token);
    }
    async pick(picks, options, token) {
        const monacoPicks = new Promise(async (resolve) => {
            const updatedPicks = (await picks).map(pick => {
                if (pick.type !== 'separator') {
                    pick.buttons && (pick.buttons = pick.buttons.map(browser_1.QuickInputButton.normalize));
                }
                return pick;
            });
            resolve(updatedPicks);
        });
        const monacoOptions = options;
        const picked = await this.monacoService.pick(monacoPicks, monacoOptions, token);
        if (!picked) {
            return picked;
        }
        if (options === null || options === void 0 ? void 0 : options.canPickMany) {
            return (Array.isArray(picked) ? picked : [picked]);
        }
        return Array.isArray(picked) ? picked[0] : picked;
    }
    showQuickPick(items, options) {
        return new Promise((resolve, reject) => {
            var _a, _b, _c, _d;
            const wrapped = this.createQuickPick();
            wrapped.items = items;
            if (options) {
                wrapped.canSelectMany = !!options.canSelectMany;
                wrapped.contextKey = options.contextKey;
                wrapped.description = options.description;
                wrapped.enabled = (_a = options.enabled) !== null && _a !== void 0 ? _a : true;
                wrapped.ignoreFocusOut = !!options.ignoreFocusOut;
                wrapped.matchOnDescription = (_b = options.matchOnDescription) !== null && _b !== void 0 ? _b : true;
                wrapped.matchOnDetail = (_c = options.matchOnDetail) !== null && _c !== void 0 ? _c : true;
                wrapped.keepScrollPosition = (_d = options.keepScrollPosition) !== null && _d !== void 0 ? _d : false;
                wrapped.placeholder = options.placeholder;
                wrapped.step = options.step;
                wrapped.title = options.title;
                wrapped.totalSteps = options.totalSteps;
                if (options.activeItem) {
                    wrapped.activeItems = [options.activeItem];
                }
                wrapped.onDidAccept(() => {
                    if (options === null || options === void 0 ? void 0 : options.onDidAccept) {
                        options.onDidAccept();
                    }
                    wrapped.hide();
                    resolve(wrapped.selectedItems[0]);
                });
                wrapped.onDidHide(() => {
                    if (options.onDidHide) {
                        options.onDidHide();
                    }
                    ;
                    wrapped.dispose();
                    setTimeout(() => resolve(undefined));
                });
                wrapped.onDidChangeValue((filter) => {
                    if (options.onDidChangeValue) {
                        options.onDidChangeValue(wrapped, filter);
                    }
                });
                wrapped.onDidChangeActive((activeItems) => {
                    if (options.onDidChangeActive) {
                        options.onDidChangeActive(wrapped, activeItems);
                    }
                });
                wrapped.onDidTriggerButton((button) => {
                    if (options.onDidTriggerButton) {
                        options.onDidTriggerButton(button);
                    }
                });
                wrapped.onDidTriggerItemButton((event) => {
                    if (options.onDidTriggerItemButton) {
                        // https://github.com/theia-ide/vscode/blob/standalone/0.23.x/src/vs/base/parts/quickinput/browser/quickInput.ts#L1387
                        options.onDidTriggerItemButton({
                            ...event,
                            removeItem: () => {
                                wrapped.items = wrapped.items.filter(item => item !== event.item);
                                wrapped.activeItems = wrapped.activeItems.filter(item => item !== event.item);
                            }
                        });
                    }
                });
                wrapped.onDidChangeSelection((selectedItems) => {
                    if (options.onDidChangeSelection) {
                        options.onDidChangeSelection(wrapped, selectedItems);
                    }
                });
            }
            wrapped.show();
        }).then(item => {
            if (item === null || item === void 0 ? void 0 : item.execute) {
                item.execute();
            }
            return item;
        });
    }
    createQuickPick() {
        const quickPick = this.monacoService.createQuickPick();
        return this.wrapQuickPick(quickPick);
    }
    wrapQuickPick(wrapped) {
        return new MonacoQuickPick(wrapped, this.keybindingRegistry);
    }
    convertItems(item) {
        return new MonacoQuickPickItem(item, this.keybindingRegistry);
    }
    hide() {
        return this.monacoService.hide();
    }
};
__decorate([
    (0, inversify_1.inject)(MonacoQuickInputImplementation),
    __metadata("design:type", MonacoQuickInputImplementation)
], MonacoQuickInputService.prototype, "monacoService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], MonacoQuickInputService.prototype, "keybindingRegistry", void 0);
MonacoQuickInputService = __decorate([
    (0, inversify_1.injectable)()
], MonacoQuickInputService);
exports.MonacoQuickInputService = MonacoQuickInputService;
class MonacoQuickInput {
    constructor(wrapped) {
        this.wrapped = wrapped;
    }
    get onDidHide() { return this.wrapped.onDidHide; }
    get onDispose() { return this.wrapped.onDispose; }
    get title() {
        return this.wrapped.title;
    }
    set title(v) {
        this.wrapped.title = v;
    }
    get description() {
        return this.wrapped.description;
    }
    set description(v) {
        this.wrapped.description = v;
    }
    get step() {
        return this.wrapped.step;
    }
    set step(v) {
        this.wrapped.step = v;
    }
    get enabled() {
        return this.wrapped.enabled;
    }
    set enabled(v) {
        this.wrapped.enabled = v;
    }
    get totalSteps() {
        return this.wrapped.totalSteps;
    }
    set totalSteps(v) {
        this.wrapped.totalSteps = v;
    }
    get contextKey() {
        return this.wrapped.contextKey;
    }
    set contextKey(v) {
        this.wrapped.contextKey = v;
    }
    get busy() {
        return this.wrapped.busy;
    }
    set busy(v) {
        this.wrapped.busy = v;
    }
    get ignoreFocusOut() {
        return this.wrapped.ignoreFocusOut;
    }
    set ignoreFocusOut(v) {
        this.wrapped.ignoreFocusOut = v;
    }
    show() {
        this.wrapped.show();
    }
    hide() {
        this.wrapped.hide();
    }
    dispose() {
        this.wrapped.dispose();
    }
}
class MonacoQuickPick extends MonacoQuickInput {
    constructor(wrapped, keybindingRegistry) {
        super(wrapped);
        this.wrapped = wrapped;
        this.keybindingRegistry = keybindingRegistry;
        this.onDidAccept = this.wrapped.onDidAccept;
        this.onDidChangeValue = this.wrapped.onDidChangeValue;
        this.onDidTriggerButton = this.wrapped.onDidTriggerButton;
        this.onDidTriggerItemButton = core_1.Event.map(this.wrapped.onDidTriggerItemButton, (evt) => ({
            item: evt.item.item,
            button: evt.button
        }));
        this.onDidChangeActive = core_1.Event.map(this.wrapped.onDidChangeActive, (items) => items.map(item => item.item));
        this.onDidChangeSelection = core_1.Event.map(this.wrapped.onDidChangeSelection, (items) => items.map(item => item.item));
    }
    get value() {
        return this.wrapped.value;
    }
    ;
    set value(v) {
        this.wrapped.value = v;
    }
    get placeholder() {
        return this.wrapped.placeholder;
    }
    set placeholder(v) {
        this.wrapped.placeholder = v;
    }
    get canSelectMany() {
        return this.wrapped.canSelectMany;
    }
    set canSelectMany(v) {
        this.wrapped.canSelectMany = v;
    }
    get matchOnDescription() {
        return this.wrapped.matchOnDescription;
    }
    set matchOnDescription(v) {
        this.wrapped.matchOnDescription = v;
    }
    get matchOnDetail() {
        return this.wrapped.matchOnDetail;
    }
    set matchOnDetail(v) {
        this.wrapped.matchOnDetail = v;
    }
    get keepScrollPosition() {
        return this.wrapped.keepScrollPosition;
    }
    set keepScrollPosition(v) {
        this.wrapped.keepScrollPosition = v;
    }
    get items() {
        return this.wrapped.items.map(item => browser_1.QuickPickSeparator.is(item) ? item : item.item);
    }
    set items(itemList) {
        // We need to store and apply the currently selected active items.
        // Since monaco compares these items by reference equality, creating new wrapped items will unmark any active items.
        // Assigning the `activeItems` again will restore all active items even after the items array has changed.
        // See also the `findMonacoItemReferences` method.
        const active = this.activeItems;
        this.wrapped.items = itemList.map(item => browser_1.QuickPickSeparator.is(item) ? item : new MonacoQuickPickItem(item, this.keybindingRegistry));
        if (active.length !== 0) {
            this.activeItems = active; // If this is done with an empty activeItems array, then it will undo first item focus on quick menus.
        }
    }
    set activeItems(itemList) {
        this.wrapped.activeItems = this.findMonacoItemReferences(this.wrapped.items, itemList);
    }
    get activeItems() {
        return this.wrapped.activeItems.map(item => item.item);
    }
    set selectedItems(itemList) {
        this.wrapped.selectedItems = this.findMonacoItemReferences(this.wrapped.items, itemList);
    }
    get selectedItems() {
        return this.wrapped.selectedItems.map(item => item.item);
    }
    /**
     * Monaco doesn't check for deep equality when setting the `activeItems` or `selectedItems`.
     * Instead we have to find the references of the monaco wrappers that contain the selected/active items
     */
    findMonacoItemReferences(source, items) {
        const monacoReferences = [];
        for (const item of items) {
            for (const wrappedItem of source) {
                if (!browser_1.QuickPickSeparator.is(wrappedItem) && wrappedItem.item === item) {
                    monacoReferences.push(wrappedItem);
                }
            }
        }
        return monacoReferences;
    }
}
class MonacoQuickPickItem {
    constructor(item, kbRegistry) {
        var _a;
        this.item = item;
        this.type = item.type;
        this.id = item.id;
        this.label = item.label;
        this.meta = item.meta;
        this.ariaLabel = item.ariaLabel;
        this.description = item.description;
        this.detail = item.detail;
        this.keybinding = item.keySequence ? new monaco_resolved_keybinding_1.MonacoResolvedKeybinding(item.keySequence, kbRegistry) : undefined;
        this.iconClasses = item.iconClasses;
        this.buttons = (_a = item.buttons) === null || _a === void 0 ? void 0 : _a.map(browser_1.QuickInputButton.normalize);
        this.alwaysShow = item.alwaysShow;
        this.highlights = item.highlights;
    }
    accept() {
        if (this.item.execute) {
            this.item.execute();
        }
    }
}
exports.MonacoQuickPickItem = MonacoQuickPickItem;
//# sourceMappingURL=monaco-quick-input-service.js.map