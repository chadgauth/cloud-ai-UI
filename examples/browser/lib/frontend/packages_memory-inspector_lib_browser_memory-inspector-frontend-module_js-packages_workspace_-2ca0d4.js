(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_memory-inspector_lib_browser_memory-inspector-frontend-module_js-packages_workspace_-2ca0d4"],{

/***/ "../../packages/core/shared/lodash.debounce/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/shared/lodash.debounce/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! lodash.debounce */ "../../node_modules/lodash.debounce/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/lodash.debounce'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-options-widget.js":
/*!*********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-options-widget.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MemoryDiffOptionsWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryDiffOptionsWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const memory_options_widget_1 = __webpack_require__(/*! ../memory-widget/memory-options-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-options-widget.js");
const memory_widget_components_1 = __webpack_require__(/*! ../utils/memory-widget-components */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-components.js");
const memory_widget_utils_1 = __webpack_require__(/*! ../utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const memory_diff_widget_types_1 = __webpack_require__(/*! ./memory-diff-widget-types */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-widget-types.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let MemoryDiffOptionsWidget = MemoryDiffOptionsWidget_1 = class MemoryDiffOptionsWidget extends memory_options_widget_1.MemoryOptionsWidget {
    constructor() {
        super(...arguments);
        this.doRefresh = (event) => {
            var _a;
            if ('key' in event && ((_a = browser_1.KeyCode.createKeyCode(event.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode) !== browser_1.Key.ENTER.keyCode) {
                return;
            }
            this.fireDidChangeOptions();
        };
    }
    get options() {
        return this.storeState();
    }
    updateDiffData(newDiffData) {
        this.memoryWidgetOptions = { ...this.memoryWidgetOptions, ...newDiffData };
        this.init();
    }
    init() {
        this.addClass(memory_options_widget_1.MemoryOptionsWidget.ID);
        this.addClass('diff-options-widget');
        const { identifier, beforeBytes, afterBytes } = this.memoryWidgetOptions;
        this.id = `${MemoryDiffOptionsWidget_1.ID}-${identifier}`;
        this.title.label = nls_1.nls.localize('theia/memory-inspector/diff/label', 'Diff: {0}', identifier);
        this.title.caption = this.title.label;
        this.title.iconClass = this.iconClass;
        this.title.closable = true;
        this.toDispose.push(this.onOptionsChanged(() => this.update()));
        beforeBytes.label = memory_diff_widget_types_1.DiffLabels.Before;
        afterBytes.label = memory_diff_widget_types_1.DiffLabels.After;
        this.columnsDisplayed = {
            beforeAddress: {
                label: nls_1.nls.localizeByDefault('Address'),
                doRender: true
            },
            beforeData: {
                label: this.memoryWidgetOptions.titles[0],
                doRender: true
            },
            afterAddress: {
                label: nls_1.nls.localizeByDefault('Address'),
                doRender: true
            },
            afterData: {
                label: this.memoryWidgetOptions.titles[1],
                doRender: true
            },
            variables: {
                label: nls_1.nls.localizeByDefault('Variables'),
                doRender: false
            },
            ascii: {
                label: nls_1.nls.localize('theia/memory-inspector/ascii', 'ASCII'),
                doRender: false
            },
        };
        this.update();
    }
    acceptFocus() {
        const settingsCog = this.node.querySelector('.toggle-settings-click-zone');
        settingsCog === null || settingsCog === void 0 ? void 0 : settingsCog.focus();
    }
    renderMemoryLocationGroup() {
        const { titles: [beforeTitle, afterTitle] } = this.memoryWidgetOptions;
        return (React.createElement("div", { className: 't-mv-group view-group' },
            React.createElement(memory_widget_components_1.MWInput, { id: memory_options_widget_1.LOCATION_OFFSET_FIELD_ID, label: nls_1.nls.localize('theia/memory-inspector/diff-widget/offset-label', '{0} Offset', beforeTitle), title: nls_1.nls.localize('theia/memory-inspector/diff-widget/offset-title', 'Bytes to offset the memory from {0}', beforeTitle), defaultValue: '0', passRef: this.assignOffsetRef, onChange: memory_widget_utils_1.Utils.validateNumericalInputs, onKeyDown: this.doRefresh }),
            React.createElement(memory_widget_components_1.MWInput, { id: memory_options_widget_1.LENGTH_FIELD_ID, label: nls_1.nls.localize('theia/memory-inspector/diff-widget/offset-label', '{0} Offset', afterTitle), title: nls_1.nls.localize('theia/memory-inspector/diff-widget/offset-title', 'Bytes to offset the memory from {0}', afterTitle), defaultValue: '0', passRef: this.assignReadLengthRef, onChange: memory_widget_utils_1.Utils.validateNumericalInputs, onKeyDown: this.doRefresh }),
            React.createElement("button", { type: 'button', className: 'theia-button main view-group-go-button', title: nls_1.nls.localizeByDefault('Go'), onClick: this.doRefresh }, nls_1.nls.localizeByDefault('Go'))));
    }
    getObligatoryColumnIds() {
        return ['beforeAddress', 'beforeData', 'afterAddress', 'afterData'];
    }
    storeState() {
        var _a, _b, _c, _d;
        return {
            ...super.storeState(),
            // prefix a 0. It'll do nothing if it's a number, but if it's an empty string or garbage, it'll make parseInt return 0.
            beforeOffset: parseInt(`0${(_b = (_a = this.offsetField) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0}`),
            afterOffset: parseInt(`0${(_d = (_c = this.readLengthField) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 0}`),
        };
    }
};
__decorate([
    (0, inversify_1.inject)(memory_widget_utils_1.MemoryDiffWidgetData),
    __metadata("design:type", Object)
], MemoryDiffOptionsWidget.prototype, "memoryWidgetOptions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryDiffOptionsWidget.prototype, "init", null);
MemoryDiffOptionsWidget = MemoryDiffOptionsWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], MemoryDiffOptionsWidget);
exports.MemoryDiffOptionsWidget = MemoryDiffOptionsWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/diff-widget/memory-diff-options-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-select-widget.js":
/*!********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-select-widget.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MemoryDiffSelectWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryDiffSelectWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const register_widget_types_1 = __webpack_require__(/*! ../register-widget/register-widget-types */ "../../packages/memory-inspector/lib/browser/register-widget/register-widget-types.js");
const memory_widget_components_1 = __webpack_require__(/*! ../utils/memory-widget-components */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-components.js");
const memory_widget_manager_1 = __webpack_require__(/*! ../utils/memory-widget-manager */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-manager.js");
const memory_diff_table_widget_1 = __webpack_require__(/*! ./memory-diff-table-widget */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-table-widget.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let MemoryDiffSelectWidget = MemoryDiffSelectWidget_1 = class MemoryDiffSelectWidget extends browser_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.beforeWidgetLabel = '';
        this.afterWidgetLabel = '';
        this.labelToWidgetMap = new Map();
        this.assignBaseValue = (e) => {
            this.beforeWidgetLabel = e.target.value;
            this.update();
        };
        this.assignLaterValue = (e) => {
            this.afterWidgetLabel = e.target.value;
            this.update();
        };
        this.diffIfEnter = (e) => {
            var _a;
            if (((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode) === browser_1.Key.ENTER.keyCode) {
                this.doDiff();
            }
        };
        this.diff = () => this.doDiff();
    }
    init() {
        this.addClass(MemoryDiffSelectWidget_1.DIFF_SELECT_CLASS);
        this.id = MemoryDiffSelectWidget_1.DIFF_SELECT_CLASS;
        this.updateWidgetMap();
        this.update();
        this.toDispose.push(this.memoryWidgetManager.onChanged(() => this.updateWidgetMap()));
        this.scrollOptions = { ...this.scrollOptions, suppressScrollX: false };
        this.hide();
    }
    onActivateRequest(msg) {
        var _a;
        super.onActivateRequest(msg);
        (_a = this.node.querySelector('select')) === null || _a === void 0 ? void 0 : _a.focus();
    }
    render() {
        const optionLabels = [...this.labelToWidgetMap.keys()];
        const currentBase = this.getBeforeLabel(optionLabels);
        const currentChanged = this.getAfterLabel(optionLabels, currentBase);
        return optionLabels.length > 1 && (React.createElement("div", { className: 'memory-diff-select-wrapper' },
            React.createElement("div", { className: 'diff-select-input-wrapper' },
                React.createElement("div", { className: 't-mv-diff-select-widget-options-wrapper' },
                    React.createElement(memory_widget_components_1.MWSelect, { id: 'diff-selector-before', label: 'compare', value: currentBase, options: optionLabels, onChange: this.assignBaseValue })),
                React.createElement("div", { className: 't-mv-diff-select-widget-options-wrapper' },
                    React.createElement(memory_widget_components_1.MWSelect, { id: 'diff-selector-after', label: 'with', value: currentChanged, options: optionLabels.filter(label => label !== currentBase), onChange: this.assignLaterValue, onKeyDown: this.diffIfEnter }))),
            React.createElement("button", { type: 'button', className: 'theia-button main memory-diff-select-go', title: nls_1.nls.localizeByDefault('Go'), onClick: this.diff }, nls_1.nls.localizeByDefault('Go'))));
    }
    updateWidgetMap() {
        const widgets = this.memoryWidgetManager.availableWidgets.filter(widget => !memory_diff_table_widget_1.MemoryDiffWidget.is(widget) && !register_widget_types_1.RegisterWidget.is(widget));
        this.labelToWidgetMap = new Map(widgets.map((widget) => [widget.title.label, widget]));
        this.update();
    }
    getBeforeLabel(optionLabels = [...this.labelToWidgetMap.keys()]) {
        return this.labelToWidgetMap.has(this.beforeWidgetLabel) && this.beforeWidgetLabel || optionLabels[0];
    }
    getAfterLabel(optionLabels, beforeWidgetLabel = this.getBeforeLabel(optionLabels)) {
        var _a;
        return (_a = (this.afterWidgetLabel && this.afterWidgetLabel !== beforeWidgetLabel
            ? this.afterWidgetLabel
            : optionLabels.find(label => label !== beforeWidgetLabel))) !== null && _a !== void 0 ? _a : '';
    }
    doDiff() {
        const labels = [...this.labelToWidgetMap.keys()];
        const baseLabel = this.getBeforeLabel(labels);
        const changedLabel = this.getAfterLabel(labels, baseLabel);
        const baseWidget = this.labelToWidgetMap.get(baseLabel);
        const changedWidget = this.labelToWidgetMap.get(changedLabel);
        if (baseWidget && changedWidget) {
            const memoryAndAddresses = this.getMemoryArrays(baseWidget, changedWidget);
            this.memoryWidgetManager.doDiff({ ...memoryAndAddresses, titles: [baseLabel, changedLabel] });
        }
    }
    getMemoryArrays(beforeWidget, afterWidget) {
        const { memory: beforeMemory } = beforeWidget.optionsWidget;
        const { memory: afterMemory } = afterWidget.optionsWidget;
        return {
            beforeBytes: beforeMemory.bytes,
            afterBytes: afterMemory.bytes,
            beforeAddress: beforeMemory.address,
            afterAddress: afterMemory.address,
            beforeVariables: beforeMemory.variables,
            afterVariables: afterMemory.variables,
        };
    }
};
MemoryDiffSelectWidget.DIFF_SELECT_CLASS = 'memory-diff-select';
__decorate([
    (0, inversify_1.inject)(memory_widget_manager_1.MemoryWidgetManager),
    __metadata("design:type", memory_widget_manager_1.MemoryWidgetManager)
], MemoryDiffSelectWidget.prototype, "memoryWidgetManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryDiffSelectWidget.prototype, "init", null);
MemoryDiffSelectWidget = MemoryDiffSelectWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], MemoryDiffSelectWidget);
exports.MemoryDiffSelectWidget = MemoryDiffSelectWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/diff-widget/memory-diff-select-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-table-widget.js":
/*!*******************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-table-widget.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
exports.MemoryDiffTableWidget = exports.MemoryDiffWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const Long = __webpack_require__(/*! long */ "../../node_modules/long/src/long.js");
const memory_table_widget_1 = __webpack_require__(/*! ../memory-widget/memory-table-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-table-widget.js");
const memory_widget_utils_1 = __webpack_require__(/*! ../utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const memory_widget_variable_utils_1 = __webpack_require__(/*! ../utils/memory-widget-variable-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-variable-utils.js");
const memory_diff_options_widget_1 = __webpack_require__(/*! ./memory-diff-options-widget */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-options-widget.js");
const memory_diff_widget_types_1 = __webpack_require__(/*! ./memory-diff-widget-types */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-widget-types.js");
var MemoryDiffWidget;
(function (MemoryDiffWidget) {
    MemoryDiffWidget.ID = 'memory.diff.view';
    MemoryDiffWidget.is = (widget) => widget.optionsWidget instanceof memory_diff_options_widget_1.MemoryDiffOptionsWidget;
})(MemoryDiffWidget = exports.MemoryDiffWidget || (exports.MemoryDiffWidget = {}));
let MemoryDiffTableWidget = class MemoryDiffTableWidget extends memory_table_widget_1.MemoryTableWidget {
    constructor() {
        super(...arguments);
        this.diffedSpanCounter = 0;
        this.isHighContrast = false;
    }
    updateDiffData(newDiffData) {
        this.optionsWidget.updateDiffData(newDiffData);
        this.diffData = { ...this.diffData, ...newDiffData };
        this.getStateAndUpdate();
    }
    getState() {
        this.options = this.optionsWidget.options;
        this.isHighContrast = this.themeService.getCurrentTheme().type === 'hc';
        this.beforeVariableFinder = new memory_widget_variable_utils_1.VariableFinder(this.diffData.beforeVariables, this.isHighContrast);
        this.afterVariableFinder = new memory_widget_variable_utils_1.VariableFinder(this.diffData.afterVariables, this.isHighContrast);
        this.memory = { bytes: this.diffData.beforeBytes, address: new Long(0), variables: this.diffData.beforeVariables };
        this.offsetData = this.getOffsetData();
    }
    getOffsetData() {
        const offsetData = {
            before: {
                leading: this.options.beforeOffset * this.options.byteSize / 8,
                trailing: 0,
            },
            after: {
                leading: this.options.afterOffset * this.options.byteSize / 8,
                trailing: 0,
            },
        };
        this.setTrailing(offsetData);
        return offsetData;
    }
    setTrailing(offsetData) {
        const totalBeforeLength = this.diffData.beforeBytes.length - offsetData.before.leading;
        const totalAfterLength = this.diffData.afterBytes.length - offsetData.after.leading;
        const totalDifference = totalBeforeLength - totalAfterLength;
        const realDifference = Math.abs(totalDifference);
        const beforeShorter = totalDifference < 0;
        if (beforeShorter) {
            offsetData.before.trailing = realDifference;
        }
        else {
            offsetData.after.trailing = realDifference;
        }
    }
    /* eslint-enable no-param-reassign */
    getWrapperClass() {
        return `${super.getWrapperClass()} diff-table`;
    }
    getTableHeaderClass() {
        return `${super.getTableHeaderClass()} diff-table`;
    }
    *renderRows() {
        const bytesPerRow = this.options.bytesPerGroup * this.options.groupsPerRow;
        const oldGroupIterator = this.renderGroups(this.diffData.beforeBytes);
        const changeGroupIterator = this.renderGroups(this.diffData.afterBytes);
        let rowsYielded = 0;
        let before = this.getNewRowData();
        let after = this.getNewRowData();
        let isModified = false;
        for (const oldGroup of oldGroupIterator) {
            const nextChanged = changeGroupIterator.next();
            isModified = isModified || !!oldGroup.isHighlighted;
            this.aggregate(before, oldGroup);
            this.aggregate(after, nextChanged.value);
            if (before.groups.length === this.options.groupsPerRow || oldGroup.index === this.diffData.beforeBytes.length - 1) {
                const beforeID = this.diffData.beforeAddress.add(this.options.beforeOffset + (bytesPerRow * rowsYielded));
                const afterID = this.diffData.afterAddress.add(this.options.afterOffset + (bytesPerRow * rowsYielded));
                const beforeAddress = `0x${beforeID.toString(16)}`;
                const afterAddress = `0x${afterID.toString(16)}`;
                const doShowDivider = (rowsYielded % 4) === 3;
                yield this.renderSingleRow({ beforeAddress, afterAddress, doShowDivider, before, after, isModified });
                rowsYielded += 1;
                isModified = false;
                before = this.getNewRowData();
                after = this.getNewRowData();
            }
        }
    }
    renderSingleRow(options, getRowAttributes = this.getRowAttributes.bind(this)) {
        const { beforeAddress, afterAddress, before, after, isModified, doShowDivider } = options;
        const { className } = getRowAttributes({ doShowDivider });
        return (React.createElement("tr", { key: beforeAddress, className: className },
            React.createElement("td", { className: memory_table_widget_1.MemoryTable.ADDRESS_DATA_CLASS }, beforeAddress),
            React.createElement("td", { className: this.getDataCellClass('before', isModified) }, before.groups),
            React.createElement("td", { className: memory_table_widget_1.MemoryTable.ADDRESS_DATA_CLASS }, afterAddress),
            React.createElement("td", { className: this.getDataCellClass('after', isModified) }, after.groups),
            this.getExtraColumn({
                variables: before.variables.slice(),
                ascii: before.ascii,
                afterVariables: after.variables.slice(),
                afterAscii: after.ascii,
            })));
    }
    getExtraColumn(options) {
        const additionalColumns = [];
        if (this.options.columnsDisplayed.variables.doRender) {
            additionalColumns.push(this.getDiffedVariables(options));
        }
        if (this.options.columnsDisplayed.ascii.doRender) {
            additionalColumns.push(this.getDiffedAscii(options));
        }
        return additionalColumns;
    }
    getDiffedAscii(options) {
        const { ascii: beforeAscii, afterAscii } = options;
        const highContrastClass = this.isHighContrast ? ' hc' : '';
        if (beforeAscii === afterAscii) {
            return super.getExtraColumn({ ascii: beforeAscii });
        }
        const EMPTY_TEXT = {
            before: '',
            after: '',
        };
        let currentText = { ...EMPTY_TEXT };
        const beforeSpans = [];
        const afterSpans = [];
        let lastWasSame = true;
        for (let i = 0; i < beforeAscii.length; i += 1) {
            const beforeLetter = beforeAscii[i];
            const afterLetter = afterAscii[i];
            const thisIsSame = beforeLetter === afterLetter;
            if (thisIsSame !== lastWasSame) {
                lastWasSame = thisIsSame;
                this.addTextBits(beforeSpans, afterSpans, currentText);
                currentText = { ...EMPTY_TEXT };
            }
            currentText.before += beforeLetter;
            currentText.after += afterLetter;
        }
        this.addTextBits(beforeSpans, afterSpans, currentText);
        return (React.createElement("td", { key: 'ascii', className: memory_table_widget_1.MemoryTable.EXTRA_COLUMN_DATA_CLASS },
            React.createElement("span", { className: `different t-mv-diffed-ascii before${highContrastClass}` }, beforeSpans),
            React.createElement("span", { className: `different t-mv-diffed-ascii after${highContrastClass}` }, afterSpans)));
    }
    addTextBits(beforeSpans, afterSpans, texts) {
        const [newBeforeSpans, newAfterSpans] = this.getAsciiSpan(texts);
        beforeSpans.push(newBeforeSpans);
        afterSpans.push(newAfterSpans);
    }
    getAsciiSpan({ before, after }) {
        if (!before) {
            return [undefined, undefined];
        }
        const differentClass = before === after ? '' : 'different';
        const highContrastClass = this.isHighContrast ? ' hc' : '';
        // use non-breaking spaces so they show up in the diff.
        return [
            React.createElement("span", { key: before + after + (this.diffedSpanCounter += 1), className: `before ${differentClass}${highContrastClass}` }, before.replace(/ /g, '\xa0')),
            React.createElement("span", { key: before + after + (this.diffedSpanCounter += 1), className: `after ${differentClass}${highContrastClass}` }, after.replace(/ /g, '\xa0')),
        ];
    }
    getDiffedVariables(options) {
        const { variables: beforeVariables, afterVariables } = options;
        const variableSpans = [];
        let areDifferent = false;
        for (const beforeVariable of beforeVariables) {
            const placeInAfterVariables = afterVariables.findIndex(afterVariable => afterVariable.name === beforeVariable.name);
            if (placeInAfterVariables > -1) {
                afterVariables.splice(placeInAfterVariables, 1);
                variableSpans.push(this.getVariableSpan(beforeVariable, memory_diff_widget_types_1.DiffLabels.Before, false));
            }
            else {
                areDifferent = true;
                variableSpans.push(this.getVariableSpan(beforeVariable, memory_diff_widget_types_1.DiffLabels.Before, true));
            }
        }
        for (const afterVariable of afterVariables) {
            variableSpans.push(this.getVariableSpan(afterVariable, memory_diff_widget_types_1.DiffLabels.After, true));
        }
        return React.createElement("td", { key: 'variables', className: `${memory_table_widget_1.MemoryTable.EXTRA_COLUMN_DATA_CLASS}${areDifferent ? ' different' : ''}` }, variableSpans);
    }
    getVariableSpan({ name, color }, origin, isChanged) {
        return (React.createElement("span", { key: name, className: `t-mv-variable-label ${origin} ${isChanged ? ' different' : ''}`, style: { color } }, name));
    }
    getDataCellClass(modifier, isModified) {
        const highContrastClass = this.isHighContrast ? 'hc' : '';
        let base = `${memory_table_widget_1.MemoryTable.MEMORY_DATA_CLASS} ${modifier} ${highContrastClass}`;
        if (isModified) {
            base += ' different';
        }
        return base;
    }
    getNewRowData() {
        return {
            groups: [],
            variables: [],
            ascii: '',
        };
    }
    aggregate(container, newData) {
        if (newData) {
            container.groups.push(newData.node);
            container.variables.push(...newData.variables);
            container.ascii += newData.ascii;
        }
    }
    *renderArrayItems(iteratee = this.memory.bytes, getBitAttributes = this.getBitAttributes.bind(this)) {
        let ignoredItems = 0;
        const iterateeOffsetData = iteratee.label === memory_diff_widget_types_1.DiffLabels.Before ? this.offsetData.before : this.offsetData.after;
        for (const item of super.renderArrayItems(iteratee, getBitAttributes)) {
            if (ignoredItems < iterateeOffsetData.leading) {
                ignoredItems += 1;
                continue;
            }
            yield item;
        }
        for (let i = 0; i < iterateeOffsetData.trailing; i += 1) {
            yield this.getDummySpan(i);
        }
    }
    getDummySpan(key) {
        const node = React.createElement("span", { key: key }, '\xa0'.repeat(2));
        return {
            node,
            content: '',
            index: -1 * key,
        };
    }
    getBitAttributes(arrayOffset, iteratee) {
        var _a;
        const isHighlighted = this.getHighlightStatus(arrayOffset, iteratee);
        const content = iteratee[arrayOffset].toString(16).padStart(2, '0');
        let className = `${memory_table_widget_1.MemoryTable.EIGHT_BIT_SPAN_CLASS} ${(_a = iteratee.label) !== null && _a !== void 0 ? _a : ''}`;
        const highContrastClass = this.isHighContrast ? 'hc' : '';
        if (isHighlighted) {
            className += ` different ${highContrastClass}`;
        }
        const isBeforeChunk = iteratee.label === memory_diff_widget_types_1.DiffLabels.Before;
        const baseAddress = isBeforeChunk ? this.diffData.beforeAddress : this.diffData.afterAddress;
        const itemAddress = baseAddress.add(arrayOffset * 8 / this.options.byteSize);
        const variable = isBeforeChunk
            ? this.beforeVariableFinder.getVariableForAddress(itemAddress)
            : this.afterVariableFinder.getVariableForAddress(itemAddress);
        return { className, content, isHighlighted, variable, style: { color: variable === null || variable === void 0 ? void 0 : variable.color } };
    }
    getHighlightStatus(arrayOffset, iteratee) {
        const source = iteratee.label === memory_diff_widget_types_1.DiffLabels.Before ? memory_diff_widget_types_1.DiffLabels.Before : memory_diff_widget_types_1.DiffLabels.After;
        const targetArray = source === memory_diff_widget_types_1.DiffLabels.Before ? this.diffData.afterBytes : this.diffData.beforeBytes;
        const sourceValue = iteratee[arrayOffset];
        const targetIndex = this.translateBetweenShiftedArrays(arrayOffset, source);
        const targetValue = targetArray[targetIndex];
        return sourceValue !== undefined &&
            targetValue !== undefined &&
            sourceValue !== targetValue;
    }
    translateBetweenShiftedArrays(sourceIndex, source) {
        const sourceOffsets = source === memory_diff_widget_types_1.DiffLabels.Before ? this.offsetData.before : this.offsetData.after;
        const targetOffsets = source === memory_diff_widget_types_1.DiffLabels.Before ? this.offsetData.after : this.offsetData.before;
        return sourceIndex - sourceOffsets.leading + targetOffsets.leading;
    }
    getHoverForVariable(span) {
        var _a, _b;
        const name = (_a = span.textContent) !== null && _a !== void 0 ? _a : '';
        const variable = (_b = this.beforeVariableFinder.searchForVariable(name)) !== null && _b !== void 0 ? _b : this.afterVariableFinder.searchForVariable(name);
        if (variable === null || variable === void 0 ? void 0 : variable.type) {
            return { type: variable.type };
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(memory_widget_utils_1.MemoryDiffWidgetData),
    __metadata("design:type", Object)
], MemoryDiffTableWidget.prototype, "diffData", void 0);
__decorate([
    (0, inversify_1.inject)(memory_diff_options_widget_1.MemoryDiffOptionsWidget),
    __metadata("design:type", memory_diff_options_widget_1.MemoryDiffOptionsWidget)
], MemoryDiffTableWidget.prototype, "optionsWidget", void 0);
MemoryDiffTableWidget = __decorate([
    (0, inversify_1.injectable)()
], MemoryDiffTableWidget);
exports.MemoryDiffTableWidget = MemoryDiffTableWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/diff-widget/memory-diff-table-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-widget-types.js":
/*!*******************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-widget-types.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiffLabels = void 0;
var DiffLabels;
(function (DiffLabels) {
    DiffLabels["Before"] = "before";
    DiffLabels["After"] = "after";
})(DiffLabels = exports.DiffLabels || (exports.DiffLabels = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/diff-widget/memory-diff-widget-types'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/editable-widget/memory-editable-table-widget.js":
/*!***************************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/editable-widget/memory-editable-table-widget.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "../../node_modules/buffer/index.js")["Buffer"];

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryEditableTableWidget = exports.EditableMemoryWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const Long = __webpack_require__(/*! long */ "../../node_modules/long/src/long.js");
const util_1 = __webpack_require__(/*! ../../common/util */ "../../packages/memory-inspector/lib/common/util.js");
const memory_table_widget_1 = __webpack_require__(/*! ../memory-widget/memory-table-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-table-widget.js");
const memory_widget_utils_1 = __webpack_require__(/*! ../utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
var EditableMemoryWidget;
(function (EditableMemoryWidget) {
    EditableMemoryWidget.ID = 'editable.memory.widget';
})(EditableMemoryWidget = exports.EditableMemoryWidget || (exports.EditableMemoryWidget = {}));
let MemoryEditableTableWidget = class MemoryEditableTableWidget extends memory_table_widget_1.MemoryTableWidget {
    constructor() {
        super(...arguments);
        this.pendingMemoryEdits = new Map();
        this.memoryEditsCompleted = new promise_util_1.Deferred();
        this.highlightedField = Long.fromInt(-1);
        this.doShowMoreMemoryBefore = false;
        this.doShowMoreMemoryAfter = false;
        this.handleClearEditClick = () => this.clearEdits();
        this.submitMemoryEdits = async () => {
            this.memoryEditsCompleted = new promise_util_1.Deferred();
            let didUpdateMemory = false;
            for (const [key, edit] of this.createUniqueEdits()) {
                try {
                    await this.doWriteMemory(edit);
                    didUpdateMemory = true;
                    this.pendingMemoryEdits.delete(key);
                }
                catch (e) {
                    console.warn('Problem writing memory with arguments', edit, '\n', e);
                    const text = e instanceof Error ? e.message : 'Unknown error';
                    this.showWriteError(key, text);
                    break;
                }
            }
            this.memoryEditsCompleted.resolve();
            if (didUpdateMemory) {
                this.optionsWidget.fetchNewMemory();
            }
        };
        this.handleTableClick = (event) => {
            var _a, _b;
            const target = event.target;
            if ((_a = target.classList) === null || _a === void 0 ? void 0 : _a.contains('eight-bits')) {
                this.highlightedField = (0, util_1.hexStrToUnsignedLong)((_b = target.getAttribute('data-id')) !== null && _b !== void 0 ? _b : '-0x1');
                this.update();
                event.stopPropagation();
            }
        };
        this.handleTableInput = (event) => {
            var _a, _b;
            if (this.highlightedField.lessThan(0)) {
                return;
            }
            const keyCode = (_a = browser_1.KeyCode.createKeyCode(event.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode;
            const initialHighlight = this.highlightedField;
            const initialHighlightIndex = initialHighlight.subtract(this.memory.address);
            if (keyCode === browser_1.Key.TAB.keyCode) {
                return;
            }
            const arrayElementsPerRow = (this.options.byteSize / 8) * this.options.bytesPerGroup * this.options.groupsPerRow;
            const isAlreadyEdited = this.pendingMemoryEdits.has(this.highlightedField.toString());
            const oldValue = (_b = this.pendingMemoryEdits.get(initialHighlight.toString())) !== null && _b !== void 0 ? _b : this.memory.bytes[initialHighlightIndex.toInt()].toString(16).padStart(2, '0');
            let possibleNewHighlight = new Long(-1);
            let newValue = oldValue;
            switch (keyCode) {
                case browser_1.Key.ARROW_DOWN.keyCode:
                    possibleNewHighlight = initialHighlight.add(arrayElementsPerRow);
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case browser_1.Key.ARROW_UP.keyCode:
                    possibleNewHighlight = initialHighlight.greaterThan(arrayElementsPerRow) ? initialHighlight.subtract(arrayElementsPerRow) : possibleNewHighlight;
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case browser_1.Key.ARROW_RIGHT.keyCode:
                    possibleNewHighlight = initialHighlight.add(1);
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case browser_1.Key.ARROW_LEFT.keyCode:
                    possibleNewHighlight = initialHighlight.greaterThan(0) ? initialHighlight.subtract(1) : possibleNewHighlight;
                    break;
                case browser_1.Key.BACKSPACE.keyCode:
                    newValue = oldValue.slice(0, oldValue.length - 1);
                    break;
                case browser_1.Key.DELETE.keyCode:
                    newValue = '';
                    break;
                case browser_1.Key.ENTER.keyCode:
                    this.submitMemoryEdits();
                    break;
                case browser_1.Key.ESCAPE.keyCode:
                    if (isAlreadyEdited) {
                        this.clearEdits(this.highlightedField);
                    }
                    else {
                        this.clearEdits();
                    }
                    break;
                default: {
                    const keyValue = parseInt(browser_1.KeyCode.createKeyCode(event.nativeEvent).toString(), 16);
                    if (!Number.isNaN(keyValue)) {
                        newValue = isAlreadyEdited ? oldValue : '';
                        if (newValue.length < 2) {
                            newValue += keyValue.toString(16);
                        }
                    }
                }
            }
            if (this.isInBounds(possibleNewHighlight)) {
                this.highlightedField = possibleNewHighlight;
            }
            const valueWasChanged = newValue !== oldValue;
            if (valueWasChanged) {
                this.pendingMemoryEdits.set(this.highlightedField.toString(), newValue);
            }
            if (valueWasChanged || !this.highlightedField.equals(initialHighlight)) {
                this.update();
            }
        };
    }
    async doInit() {
        this.memoryEditsCompleted.resolve();
        await super.doInit();
        this.addClass('editable');
    }
    resetModifiedValue(valueAddress) {
        const didChange = this.pendingMemoryEdits.delete(valueAddress.toString());
        if (didChange) {
            this.update();
        }
    }
    getState() {
        super.getState();
        if (!this.isInBounds(this.highlightedField)) {
            this.highlightedField = this.memory.address;
        }
    }
    async handleMemoryChange(newMemory) {
        await this.memoryEditsCompleted.promise;
        if (newMemory.bytes.length === 0) {
            this.pendingMemoryEdits.clear();
        }
        super.handleMemoryChange(newMemory);
    }
    areSameRegion(a, b) {
        return b !== undefined && a.address.equals(b.address) && a.bytes.length === b.bytes.length;
    }
    getTableFooter() {
        var _a, _b;
        const showButtons = !!this.pendingMemoryEdits.size && !this.writeErrorInfo;
        return ((showButtons || this.writeErrorInfo) && (React.createElement("div", { className: 'memory-edit-button-container' },
            showButtons && React.createElement("button", { className: 'theia-button secondary', onClick: this.handleClearEditClick, type: 'reset', title: nls_1.nls.localize('theia/memory-inspector/editable/clear', 'Clear Changes') }, nls_1.nls.localize('theia/memory-inspector/editable/clear', 'Clear Changes')),
            showButtons && React.createElement("button", { className: 'theia-button main', onClick: this.submitMemoryEdits, type: 'submit', title: nls_1.nls.localize('theia/memory-inspector/editable/apply', 'Apply Changes') }, nls_1.nls.localize('theia/memory-inspector/editable/apply', 'Apply Changes')),
            !!this.writeErrorInfo && React.createElement("div", { className: 'memory-edit-error' },
                React.createElement("div", { className: 'memory-edit-error-location' }, `Error writing to 0x${Long.fromString((_a = this.writeErrorInfo) === null || _a === void 0 ? void 0 : _a.location).toString(16)}`),
                React.createElement("div", { className: 'memory-edit-error-details' }, (_b = this.writeErrorInfo) === null || _b === void 0 ? void 0 : _b.error)))));
    }
    getBitAttributes(arrayOffset, iteratee) {
        var _a, _b, _c;
        const attributes = super.getBitAttributes(arrayOffset, iteratee);
        const classNames = (_b = (_a = attributes.className) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        const itemID = this.memory.address.add(arrayOffset);
        const isHighlight = itemID.equals(this.highlightedField);
        const isEditPending = this.pendingMemoryEdits.has(itemID.toString());
        const padder = isHighlight && isEditPending ? '\xa0' : '0'; // non-breaking space so it doesn't look like plain whitespace.
        const stringValue = ((_c = this.pendingMemoryEdits.get(itemID.toString())) !== null && _c !== void 0 ? _c : this.memory.bytes[arrayOffset].toString(16)).padStart(2, padder);
        if (!this.options.isFrozen) {
            if (isHighlight) {
                classNames.push('highlight');
            }
            if (isEditPending) {
                classNames.push('modified');
            }
        }
        return {
            ...attributes,
            className: classNames.join(' '),
            content: stringValue
        };
    }
    getHoverForChunk(span) {
        const addressAsString = span.getAttribute('data-id');
        if (addressAsString) {
            const address = (0, util_1.hexStrToUnsignedLong)(addressAsString);
            const { value } = this.composeByte(address, true);
            const { value: inMemory } = this.composeByte(address, false);
            const oldValue = this.previousBytes && this.composeByte(address, false, this.previousBytes).value;
            const decimal = parseInt(value, 16);
            const octal = decimal.toString(8).padStart(this.options.byteSize / 8, '0');
            const UTF8 = String.fromCharCode(decimal);
            const binary = this.getPaddedBinary(decimal);
            const toSend = { hex: value, octal, binary, decimal };
            if (UTF8) {
                toSend.UTF8 = UTF8;
            }
            if (inMemory !== value) {
                toSend['Current Value'] = inMemory;
            }
            if (oldValue !== undefined && oldValue !== value) {
                toSend['Previous Value'] = oldValue;
            }
            return toSend;
        }
        return undefined;
    }
    composeByte(addressPlusArrayOffset, usePendingEdits, dataSource = this.memory.bytes) {
        let value = '';
        const offset = addressPlusArrayOffset.subtract(this.memory.address);
        const chunksPerByte = this.options.byteSize / 8;
        const startingChunkIndex = offset.subtract(offset.modulo(chunksPerByte));
        const address = this.memory.address.add(startingChunkIndex.divide(chunksPerByte));
        for (let i = 0; i < chunksPerByte; i += 1) {
            const targetOffset = startingChunkIndex.add(i);
            const targetChunk = this.getFromMapOrArray(targetOffset, usePendingEdits, dataSource);
            value += targetChunk.padStart(2, '0');
        }
        return { address, value };
    }
    getFromMapOrArray(arrayOffset, usePendingEdits, dataSource = this.memory.bytes) {
        var _a, _b;
        let value = usePendingEdits ? this.pendingMemoryEdits.get(arrayOffset.add(this.memory.address).toString()) : undefined;
        if (value === undefined) {
            value = (_b = (_a = dataSource[arrayOffset.toInt()]) === null || _a === void 0 ? void 0 : _a.toString(16)) !== null && _b !== void 0 ? _b : '';
        }
        return value;
    }
    clearEdits(address) {
        if (typeof address === 'number') {
            this.pendingMemoryEdits.delete(address);
        }
        else {
            this.pendingMemoryEdits.clear();
        }
        this.update();
    }
    createUniqueEdits() {
        const addressesSubmitted = new Set();
        const edits = [];
        for (const k of this.pendingMemoryEdits.keys()) {
            const address = Long.fromString(k);
            const { address: addressToSend, value: valueToSend } = this.composeByte(address, true);
            const memoryReference = '0x' + addressToSend.toString(16);
            if (!addressesSubmitted.has(memoryReference)) {
                const data = Buffer.from(valueToSend, 'hex').toString('base64');
                edits.push([k, { memoryReference, data }]);
                addressesSubmitted.add(memoryReference);
            }
        }
        return edits;
    }
    doWriteMemory(writeMemoryArgs) {
        return this.memoryProvider.writeMemory(writeMemoryArgs);
    }
    showWriteError(location, error) {
        if (this.currentErrorTimeout !== undefined) {
            clearTimeout(this.currentErrorTimeout);
        }
        this.writeErrorInfo = { location, error };
        this.update();
        this.currentErrorTimeout = window.setTimeout(() => this.hideWriteError(), memory_widget_utils_1.Constants.ERROR_TIMEOUT);
    }
    hideWriteError() {
        this.currentErrorTimeout = undefined;
        this.writeErrorInfo = undefined;
        this.update();
    }
    getWrapperHandlers() {
        return this.options.isFrozen
            ? super.getWrapperHandlers()
            : {
                onClick: this.handleTableClick,
                onContextMenu: this.handleTableRightClick,
                onKeyDown: this.handleTableInput,
                onMouseMove: this.handleTableMouseMove,
            };
    }
    doHandleTableRightClick(event) {
        var _a, _b;
        const target = event.target;
        if ((_a = target.classList) === null || _a === void 0 ? void 0 : _a.contains('eight-bits')) {
            this.highlightedField = (0, util_1.hexStrToUnsignedLong)((_b = target.getAttribute('data-id')) !== null && _b !== void 0 ? _b : '-0x1');
        }
        super.doHandleTableRightClick(event);
    }
    isInBounds(candidateAddress) {
        const { address, bytes } = this.memory;
        return candidateAddress.greaterThanOrEqual(address) &&
            candidateAddress.lessThan(address.add(bytes.length));
    }
};
MemoryEditableTableWidget = __decorate([
    (0, inversify_1.injectable)()
], MemoryEditableTableWidget);
exports.MemoryEditableTableWidget = MemoryEditableTableWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/editable-widget/memory-editable-table-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/memory-inspector-frontend-contribution.js":
/*!*********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/memory-inspector-frontend-contribution.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
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
exports.DebugFrontendContribution = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const frontend_application_state_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-state */ "../../packages/core/lib/browser/frontend-application-state.js");
const color_1 = __webpack_require__(/*! @theia/core/lib/common/color */ "../../packages/core/lib/common/color.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const debug_console_items_1 = __webpack_require__(/*! @theia/debug/lib/browser/console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const debug_frontend_application_contribution_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-frontend-application-contribution */ "../../packages/debug/lib/browser/debug-frontend-application-contribution.js");
const debug_variables_widget_1 = __webpack_require__(/*! @theia/debug/lib/browser/view/debug-variables-widget */ "../../packages/debug/lib/browser/view/debug-variables-widget.js");
const Long = __webpack_require__(/*! long */ "../../node_modules/long/src/long.js");
const memory_editable_table_widget_1 = __webpack_require__(/*! ./editable-widget/memory-editable-table-widget */ "../../packages/memory-inspector/lib/browser/editable-widget/memory-editable-table-widget.js");
const memory_provider_service_1 = __webpack_require__(/*! ./memory-provider/memory-provider-service */ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider-service.js");
const memory_table_widget_1 = __webpack_require__(/*! ./memory-widget/memory-table-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-table-widget.js");
const register_table_widget_1 = __webpack_require__(/*! ./register-widget/register-table-widget */ "../../packages/memory-inspector/lib/browser/register-widget/register-table-widget.js");
const memory_commands_1 = __webpack_require__(/*! ./utils/memory-commands */ "../../packages/memory-inspector/lib/browser/utils/memory-commands.js");
const memory_widget_manager_1 = __webpack_require__(/*! ./utils/memory-widget-manager */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-manager.js");
const memory_dock_panel_1 = __webpack_require__(/*! ./wrapper-widgets/memory-dock-panel */ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dock-panel.js");
const memory_layout_widget_1 = __webpack_require__(/*! ./wrapper-widgets/memory-layout-widget */ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-layout-widget.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const ONE_HALF_OPACITY = 0.5;
let DebugFrontendContribution = class DebugFrontendContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: memory_layout_widget_1.MemoryLayoutWidget.ID,
            widgetName: memory_layout_widget_1.MemoryLayoutWidget.LABEL,
            defaultWidgetOptions: {
                area: 'right',
            },
            toggleCommandId: memory_commands_1.MemoryCommand.id,
        });
    }
    init() {
        this.stateService.reachedState('initialized_layout').then(() => {
            // Close leftover widgets from previous sessions.
            this.memoryWidgetManager.availableWidgets.forEach(widget => {
                if (!(widget.parent instanceof memory_dock_panel_1.MemoryDockPanel)) {
                    widget.close();
                }
            });
        });
    }
    async initializeLayout() {
        await this.openView({ activate: false });
    }
    registerCommands(registry) {
        super.registerCommands(registry);
        registry.registerCommand(memory_commands_1.ViewVariableInMemoryCommand, {
            execute: async () => {
                const { selectedVariable } = this.debugContribution;
                const referenceText = this.memoryProvider.formatVariableReference(selectedVariable);
                if (referenceText) {
                    await this.openMemoryWidgetAt(referenceText);
                }
            },
            isVisible: () => {
                const { selectedVariable } = this.debugContribution;
                return Boolean(this.memoryProvider.supportsVariableReferenceSyntax(selectedVariable) && this.memoryProvider.formatVariableReference(selectedVariable));
            },
        });
        registry.registerCommand(memory_commands_1.ViewVariableInRegisterViewCommand, {
            execute: async () => {
                var _a;
                const name = (_a = this.debugContribution.selectedVariable) === null || _a === void 0 ? void 0 : _a.name;
                if (name) {
                    await this.openRegisterWidgetWithReg(name);
                }
            },
            isVisible: () => {
                var _a, _b;
                let { selectedVariable: currentLevel } = this.debugContribution;
                if (!currentLevel) {
                    return false;
                }
                // Make sure it looks like it has a numerical value.
                try {
                    BigInt(currentLevel.value);
                }
                catch {
                    return false;
                }
                while (currentLevel.parent instanceof debug_console_items_1.DebugVariable) {
                    currentLevel = currentLevel.parent;
                }
                return currentLevel.parent instanceof debug_console_items_1.DebugScope && ((_b = (_a = currentLevel.parent) === null || _a === void 0 ? void 0 : _a['raw']) === null || _b === void 0 ? void 0 : _b.name) === 'Registers';
            },
        });
        registry.registerCommand(memory_commands_1.FollowPointerDebugCommand, {
            isVisible: () => { var _a; return !!this.isPointer((_a = this.debugContribution.selectedVariable) === null || _a === void 0 ? void 0 : _a.type); },
            isEnabled: () => { var _a; return !!this.isPointer((_a = this.debugContribution.selectedVariable) === null || _a === void 0 ? void 0 : _a.type); },
            execute: async () => {
                var _a;
                const name = (_a = this.debugContribution.selectedVariable) === null || _a === void 0 ? void 0 : _a.name;
                if (name) {
                    await this.openMemoryWidgetAt(name);
                }
            },
        });
        registry.registerCommand(memory_commands_1.ResetModifiedCellCommand, {
            isEnabled: (widgetToActOn, address) => Long.isLong(address) && widgetToActOn instanceof memory_editable_table_widget_1.MemoryEditableTableWidget,
            isVisible: (widgetToActOn, address) => Long.isLong(address) && widgetToActOn instanceof memory_editable_table_widget_1.MemoryEditableTableWidget,
            execute: (widgetToActOn, address) => widgetToActOn.resetModifiedValue(address),
        });
        registry.registerCommand(memory_commands_1.FollowPointerTableCommand, {
            isEnabled: (widgetToActOn, address, variable) => widgetToActOn instanceof memory_table_widget_1.MemoryTableWidget &&
                this.isPointer(variable === null || variable === void 0 ? void 0 : variable.type),
            isVisible: (widgetToActOn, address, variable) => widgetToActOn instanceof memory_table_widget_1.MemoryTableWidget &&
                this.isPointer(variable === null || variable === void 0 ? void 0 : variable.type),
            execute: (widgetToActOn, address, variable) => {
                if (variable === null || variable === void 0 ? void 0 : variable.name) {
                    widgetToActOn.optionsWidget.setAddressAndGo(variable.name);
                }
            },
        });
        registry.registerCommand(memory_commands_1.CreateNewMemoryViewCommand, {
            isEnabled: w => this.withWidget(() => true, w),
            isVisible: w => this.withWidget(() => true, w),
            execute: () => this.memoryWidgetManager.createNewMemoryWidget(),
        });
        registry.registerCommand(memory_commands_1.CreateNewRegisterViewCommand, {
            isEnabled: w => this.withWidget(() => true, w),
            isVisible: w => this.withWidget(() => true, w),
            execute: () => this.memoryWidgetManager.createNewMemoryWidget('register'),
        });
        registry.registerCommand(memory_commands_1.RegisterSetVariableCommand, {
            isEnabled: (widgetToActOn, dVar) => widgetToActOn instanceof register_table_widget_1.RegisterTableWidget &&
                dVar && dVar.supportSetVariable,
            isVisible: (widgetToActOn, dVar) => widgetToActOn instanceof register_table_widget_1.RegisterTableWidget &&
                dVar && dVar.supportSetVariable,
            execute: (widgetToActOn, dVar) => dVar && widgetToActOn.handleSetValue(dVar),
        });
        registry.registerCommand(memory_commands_1.ToggleDiffSelectWidgetVisibilityCommand, {
            isVisible: widget => this.withWidget(() => this.memoryWidgetManager.canCompare, widget),
            execute: (widget) => {
                widget.toggleComparisonVisibility();
            },
        });
    }
    isPointer(type) {
        return !!(type === null || type === void 0 ? void 0 : type.includes('*'));
    }
    /**
     * @param {string} addressReference Should be the exact string to be used in the address bar. I.e. it must resolve to an address value.
     */
    async openMemoryWidgetAt(addressReference) {
        await this.openView({ activate: false });
        const newWidget = await this.memoryWidgetManager.createNewMemoryWidget();
        await this.shell.activateWidget(newWidget.id);
        if (newWidget) {
            newWidget.optionsWidget.setAddressAndGo(addressReference);
        }
        return newWidget;
    }
    async openRegisterWidgetWithReg(name) {
        await this.openView({ activate: false });
        const newWidget = await this.memoryWidgetManager.createNewMemoryWidget('register');
        await this.shell.activateWidget(newWidget.id);
        if (newWidget) {
            newWidget.optionsWidget.setRegAndUpdate(name);
        }
        return newWidget;
    }
    withWidget(fn, widget = this.tryGetWidget()) {
        if (widget instanceof memory_layout_widget_1.MemoryLayoutWidget && widget.id === memory_layout_widget_1.MemoryLayoutWidget.ID) {
            return fn(widget);
        }
        return false;
    }
    registerMenus(registry) {
        super.registerMenus(registry);
        const registerMenuActions = (menuPath, ...commands) => {
            for (const [index, command] of commands.entries()) {
                registry.registerMenuAction(menuPath, {
                    commandId: command.id,
                    label: command.label,
                    icon: command.iconClass,
                    order: String.fromCharCode('a'.charCodeAt(0) + index),
                });
            }
        };
        registry.registerMenuAction(debug_variables_widget_1.DebugVariablesWidget.WATCH_MENU, { commandId: memory_commands_1.ViewVariableInMemoryCommand.id, label: memory_commands_1.ViewVariableInMemoryCommand.label });
        registry.registerMenuAction(debug_variables_widget_1.DebugVariablesWidget.WATCH_MENU, { commandId: memory_commands_1.FollowPointerDebugCommand.id, label: memory_commands_1.FollowPointerDebugCommand.label });
        registry.registerMenuAction(debug_variables_widget_1.DebugVariablesWidget.WATCH_MENU, { commandId: memory_commands_1.ViewVariableInRegisterViewCommand.id, label: memory_commands_1.ViewVariableInRegisterViewCommand.label });
        registry.registerMenuAction(memory_editable_table_widget_1.MemoryEditableTableWidget.CONTEXT_MENU, { commandId: memory_commands_1.ResetModifiedCellCommand.id, label: memory_commands_1.ResetModifiedCellCommand.label });
        registry.registerMenuAction(memory_table_widget_1.MemoryTableWidget.CONTEXT_MENU, { commandId: memory_commands_1.FollowPointerTableCommand.id, label: memory_commands_1.FollowPointerTableCommand.label });
        registerMenuActions(register_table_widget_1.RegisterTableWidget.CONTEXT_MENU, memory_commands_1.RegisterSetVariableCommand);
    }
    registerToolbarItems(toolbarRegistry) {
        toolbarRegistry.registerItem({
            id: memory_commands_1.CreateNewMemoryViewCommand.id,
            command: memory_commands_1.CreateNewMemoryViewCommand.id,
            tooltip: memory_commands_1.CreateNewMemoryViewCommand.label,
            priority: -2,
        });
        toolbarRegistry.registerItem({
            id: memory_commands_1.CreateNewRegisterViewCommand.id,
            command: memory_commands_1.CreateNewRegisterViewCommand.id,
            tooltip: memory_commands_1.CreateNewRegisterViewCommand.label,
            priority: -1,
        });
        toolbarRegistry.registerItem({
            id: memory_commands_1.ToggleDiffSelectWidgetVisibilityCommand.id,
            command: memory_commands_1.ToggleDiffSelectWidgetVisibilityCommand.id,
            tooltip: nls_1.nls.localize('theia/memory-inspector/toggleComparisonWidgetVisibility', 'Toggle Comparison Widget Visibility'),
            priority: -3,
            onDidChange: this.memoryWidgetManager.onChanged,
        });
    }
    registerColors(colorRegistry) {
        colorRegistry.register({
            id: 'memoryDiff.removedTextBackground',
            defaults: {
                dark: color_1.Color.transparent('diffEditor.removedTextBackground', ONE_HALF_OPACITY),
                light: color_1.Color.transparent('diffEditor.removedTextBackground', ONE_HALF_OPACITY),
            },
            description: 'A less opaque diff color for use in the Memory Inspector where various overlays may me in place at once.',
        }, {
            id: 'memoryDiff.insertedTextBackground',
            defaults: {
                dark: color_1.Color.transparent('diffEditor.insertedTextBackground', ONE_HALF_OPACITY),
                light: color_1.Color.transparent('diffEditor.insertedTextBackground', ONE_HALF_OPACITY),
            },
            description: 'A less opaque diff color for use in the Memory Inspector where various overlays may me in place at once.',
        }, {
            id: 'memoryInspector.focusBorder',
            defaults: {
                dark: color_1.Color.transparent('focusBorder', ONE_HALF_OPACITY),
                light: color_1.Color.transparent('focusBorder', ONE_HALF_OPACITY),
            },
            description: 'A less opaque focus border color for use in the Memory Inspector where several overlays may be in place at once.',
        }, {
            id: 'memoryInspector.foreground',
            defaults: {
                dark: color_1.Color.transparent('editor.foreground', ONE_HALF_OPACITY),
                light: color_1.Color.transparent('editor.foreground', ONE_HALF_OPACITY),
            },
            description: 'A less opaque foreground text style for use in the Memory Inspector',
        });
    }
};
__decorate([
    (0, inversify_1.inject)(debug_frontend_application_contribution_1.DebugFrontendApplicationContribution),
    __metadata("design:type", debug_frontend_application_contribution_1.DebugFrontendApplicationContribution)
], DebugFrontendContribution.prototype, "debugContribution", void 0);
__decorate([
    (0, inversify_1.inject)(memory_widget_manager_1.MemoryWidgetManager),
    __metadata("design:type", memory_widget_manager_1.MemoryWidgetManager)
], DebugFrontendContribution.prototype, "memoryWidgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], DebugFrontendContribution.prototype, "stateService", void 0);
__decorate([
    (0, inversify_1.inject)(memory_provider_service_1.MemoryProviderService),
    __metadata("design:type", memory_provider_service_1.MemoryProviderService)
], DebugFrontendContribution.prototype, "memoryProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugFrontendContribution.prototype, "init", null);
DebugFrontendContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DebugFrontendContribution);
exports.DebugFrontendContribution = DebugFrontendContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/memory-inspector-frontend-contribution'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/memory-inspector-frontend-module.js":
/*!***************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/memory-inspector-frontend-module.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../../src/browser/register-widget/register-widget.css */ "../../packages/memory-inspector/src/browser/register-widget/register-widget.css");
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/memory-inspector/src/browser/style/index.css");
__webpack_require__(/*! ../../src/browser/utils/multi-select-bar.css */ "../../packages/memory-inspector/src/browser/utils/multi-select-bar.css");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const color_application_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/color-application-contribution */ "../../packages/core/lib/browser/color-application-contribution.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const memory_inspector_frontend_contribution_1 = __webpack_require__(/*! ./memory-inspector-frontend-contribution */ "../../packages/memory-inspector/lib/browser/memory-inspector-frontend-contribution.js");
const memory_diff_options_widget_1 = __webpack_require__(/*! ./diff-widget/memory-diff-options-widget */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-options-widget.js");
const memory_diff_select_widget_1 = __webpack_require__(/*! ./diff-widget/memory-diff-select-widget */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-select-widget.js");
const memory_diff_table_widget_1 = __webpack_require__(/*! ./diff-widget/memory-diff-table-widget */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-table-widget.js");
const memory_editable_table_widget_1 = __webpack_require__(/*! ./editable-widget/memory-editable-table-widget */ "../../packages/memory-inspector/lib/browser/editable-widget/memory-editable-table-widget.js");
const memory_provider_1 = __webpack_require__(/*! ./memory-provider/memory-provider */ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider.js");
const memory_provider_service_1 = __webpack_require__(/*! ./memory-provider/memory-provider-service */ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider-service.js");
const memory_options_widget_1 = __webpack_require__(/*! ./memory-widget/memory-options-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-options-widget.js");
const memory_table_widget_1 = __webpack_require__(/*! ./memory-widget/memory-table-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-table-widget.js");
const memory_widget_1 = __webpack_require__(/*! ./memory-widget/memory-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-widget.js");
const register_options_widget_1 = __webpack_require__(/*! ./register-widget/register-options-widget */ "../../packages/memory-inspector/lib/browser/register-widget/register-options-widget.js");
const register_table_widget_1 = __webpack_require__(/*! ./register-widget/register-table-widget */ "../../packages/memory-inspector/lib/browser/register-widget/register-table-widget.js");
const register_widget_types_1 = __webpack_require__(/*! ./register-widget/register-widget-types */ "../../packages/memory-inspector/lib/browser/register-widget/register-widget-types.js");
const memory_hover_renderer_1 = __webpack_require__(/*! ./utils/memory-hover-renderer */ "../../packages/memory-inspector/lib/browser/utils/memory-hover-renderer.js");
const memory_widget_manager_1 = __webpack_require__(/*! ./utils/memory-widget-manager */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-manager.js");
const memory_widget_utils_1 = __webpack_require__(/*! ./utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const memory_dock_panel_1 = __webpack_require__(/*! ./wrapper-widgets/memory-dock-panel */ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dock-panel.js");
const memory_dockpanel_placeholder_widget_1 = __webpack_require__(/*! ./wrapper-widgets/memory-dockpanel-placeholder-widget */ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dockpanel-placeholder-widget.js");
const memory_layout_widget_1 = __webpack_require__(/*! ./wrapper-widgets/memory-layout-widget */ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-layout-widget.js");
const cdt_gdb_memory_provider_1 = __webpack_require__(/*! ./memory-provider/cdt-gdb-memory-provider */ "../../packages/memory-inspector/lib/browser/memory-provider/cdt-gdb-memory-provider.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, browser_1.bindViewContribution)(bind, memory_inspector_frontend_contribution_1.DebugFrontendContribution);
    bind(color_application_contribution_1.ColorContribution).toService(memory_inspector_frontend_contribution_1.DebugFrontendContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(memory_inspector_frontend_contribution_1.DebugFrontendContribution);
    bind(browser_1.FrontendApplicationContribution).toService(memory_inspector_frontend_contribution_1.DebugFrontendContribution);
    bind(memory_provider_service_1.MemoryProviderService).toSelf().inSingletonScope();
    bind(memory_provider_1.DefaultMemoryProvider).toSelf().inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, memory_provider_1.MemoryProvider);
    bind(memory_provider_1.MemoryProvider).to(cdt_gdb_memory_provider_1.CDTGDBMemoryProvider).inSingletonScope();
    bind(memory_layout_widget_1.MemoryLayoutWidget).toSelf().inSingletonScope();
    bind(memory_diff_select_widget_1.MemoryDiffSelectWidget).toSelf().inSingletonScope();
    bind(memory_dockpanel_placeholder_widget_1.MemoryDockpanelPlaceholder).toSelf().inSingletonScope();
    bind(memory_hover_renderer_1.MemoryHoverRendererService).toSelf().inSingletonScope();
    bind(memory_widget_manager_1.MemoryWidgetManager).toSelf().inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: memory_dock_panel_1.MemoryDockPanel.ID,
        createWidget: () => memory_dock_panel_1.MemoryDockPanel.createWidget(container),
    }));
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: memory_layout_widget_1.MemoryLayoutWidget.ID,
        createWidget: () => container.get(memory_layout_widget_1.MemoryLayoutWidget),
    })).inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: memory_widget_1.MemoryWidget.ID,
        createWidget: (options) => memory_widget_1.MemoryWidget.createWidget(container, memory_options_widget_1.MemoryOptionsWidget, memory_table_widget_1.MemoryTableWidget, memory_widget_utils_1.MemoryWidgetOptions, options),
    }));
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: memory_editable_table_widget_1.EditableMemoryWidget.ID,
        createWidget: (options) => memory_widget_1.MemoryWidget
            .createWidget(container, memory_options_widget_1.MemoryOptionsWidget, memory_editable_table_widget_1.MemoryEditableTableWidget, memory_widget_utils_1.MemoryWidgetOptions, options),
    }));
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: memory_diff_table_widget_1.MemoryDiffWidget.ID,
        createWidget: (options) => memory_widget_1.MemoryWidget
            .createWidget(container, memory_diff_options_widget_1.MemoryDiffOptionsWidget, memory_diff_table_widget_1.MemoryDiffTableWidget, memory_widget_utils_1.MemoryDiffWidgetData, options),
    }));
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: register_widget_types_1.RegisterWidget.ID,
        createWidget: (options) => register_widget_types_1.RegisterWidget
            .createContainer(container, register_options_widget_1.RegisterOptionsWidget, register_table_widget_1.RegisterTableWidget, memory_widget_utils_1.RegisterWidgetOptions, options).get(memory_widget_1.MemoryWidget),
    }));
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/memory-inspector-frontend-module'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/memory-provider/cdt-gdb-memory-provider.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/memory-provider/cdt-gdb-memory-provider.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CDTGDBMemoryProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const debug_console_items_1 = __webpack_require__(/*! @theia/debug/lib/browser/console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const util_1 = __webpack_require__(/*! ../../common/util */ "../../packages/memory-inspector/lib/common/util.js");
const memory_provider_1 = __webpack_require__(/*! ./memory-provider */ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider.js");
/**
 * @file this file exists to show the customizations possible for specific debug adapters. Within the confines of the DebugAdapterProtocol, different adapters can behave
 * quite differently. In particular, they can differ in the kinds of expressions that they treat as references (in the `memoryReference` field of MemoryReadArguments, for example)
 * and the kinds of expressions that they can evaluate (for example to assist in determining the size of variables). The `MemoryProvider` type exists to allow applications
 * to enhance the base functionality of the Memory Inspector by tapping into specifics of known adapters.
 */
/**
 * Read memory through the current debug session, using the cdt-gdb-adapter
 * extension to read memory.
 */
let CDTGDBMemoryProvider = class CDTGDBMemoryProvider extends memory_provider_1.AbstractMemoryProvider {
    canHandle(session) {
        return session.configuration.type === 'gdb';
    }
    async getLocals(session) {
        if (session === undefined) {
            console.warn('No active debug session.');
            return [];
        }
        const frame = session.currentFrame;
        if (frame === undefined) {
            throw new Error('No active stack frame.');
        }
        const ranges = [];
        const scopes = await frame.getScopes();
        const scopesWithoutRegisters = scopes.filter(x => x.render() !== 'Registers');
        for (const scope of scopesWithoutRegisters) {
            const variables = await scope.getElements();
            for (const v of variables) {
                if (v instanceof debug_console_items_1.DebugVariable) {
                    const addrExp = `&${v.name}`;
                    const sizeExp = `sizeof(${v.name})`;
                    const addrResp = await session.sendRequest('evaluate', {
                        expression: addrExp,
                        context: 'watch',
                        frameId: frame.raw.id,
                    }).catch(e => { console.warn(`Failed to evaluate ${addrExp}. Corresponding variable will be omitted from Memory Inspector display.`, e); });
                    if (!addrResp) {
                        continue;
                    }
                    const sizeResp = await session.sendRequest('evaluate', {
                        expression: sizeExp,
                        context: 'watch',
                        frameId: frame.raw.id,
                    }).catch(e => { console.warn(`Failed to evaluate ${sizeExp}. Corresponding variable will be omitted from Memory Inspector display.`, e); });
                    if (!sizeResp) {
                        continue;
                    }
                    // Make sure the address is in the format we expect.
                    const addressPart = /0x[0-9a-f]+/i.exec(addrResp.body.result);
                    if (!addressPart) {
                        continue;
                    }
                    if (!/^[0-9]+$/.test(sizeResp.body.result)) {
                        continue;
                    }
                    const size = parseInt(sizeResp.body.result);
                    const address = (0, util_1.hexStrToUnsignedLong)(addressPart[0]);
                    const pastTheEndAddress = address.add(size);
                    ranges.push({
                        name: v.name,
                        address,
                        pastTheEndAddress,
                        type: v.type,
                        value: v.value,
                    });
                }
            }
        }
        return ranges;
    }
    supportsVariableReferenceSyntax(session, currentLevel) {
        if (this.canHandle(session)) {
            if (!currentLevel) {
                return false;
            }
            while (currentLevel.parent instanceof debug_console_items_1.DebugVariable) {
                currentLevel = currentLevel.parent;
            }
            return currentLevel.parent instanceof debug_console_items_1.DebugScope && currentLevel.parent['raw'].name === 'Local';
        }
        return false;
    }
    formatVariableReference(session, currentLevel) {
        if (currentLevel && this.canHandle(session)) {
            let { name } = currentLevel;
            while (currentLevel.parent instanceof debug_console_items_1.DebugVariable) {
                const separator = name.startsWith('[') ? '' : '.';
                currentLevel = currentLevel.parent;
                if (name.startsWith(`*${currentLevel.name}.`)) { // Theia has added a layer of pointer dereferencing
                    name = name.replace(`*${currentLevel.name}.`, `(*${currentLevel.name})->`);
                }
                else if (name.startsWith(`*${currentLevel.name}`)) {
                    // that's fine, it's what you clicked on and probably what you want to see.
                }
                else {
                    name = `${currentLevel.name}${separator}${name}`;
                }
            }
            return `&(${name})`;
        }
        return '';
    }
};
CDTGDBMemoryProvider = __decorate([
    (0, inversify_1.injectable)()
], CDTGDBMemoryProvider);
exports.CDTGDBMemoryProvider = CDTGDBMemoryProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/memory-provider/cdt-gdb-memory-provider'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider-service.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/memory-provider/memory-provider-service.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
exports.MemoryProviderService = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const debug_session_manager_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const memory_provider_1 = __webpack_require__(/*! ./memory-provider */ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let MemoryProviderService = class MemoryProviderService {
    readMemory(readMemoryArguments) {
        const readError = nls_1.nls.localize('theia/memory-inspector/provider/readError', 'Cannot read memory. No active debug session.');
        const session = this.getSession(readError);
        if (!session.capabilities.supportsReadMemoryRequest) {
            throw new Error('Cannot read memory. The current session does not support the request.');
        }
        const provider = this.getProvider(session);
        return provider.readMemory(session, readMemoryArguments);
    }
    writeMemory(writeMemoryArguments) {
        const writeError = nls_1.nls.localize('theia/memory-inspector/provider/writeError', 'Cannot write memory. No active debug session.');
        const session = this.getSession(writeError);
        if (!session.capabilities.supportsWriteMemoryRequest) {
            throw new Error('Cannot write memory. The current session does not support the request.');
        }
        const provider = this.getProvider(session, 'writeMemory');
        return provider.writeMemory(session, writeMemoryArguments);
    }
    getLocals() {
        const localsError = nls_1.nls.localize('theia/memory-inspector/provider/localsError', 'Cannot read local variables. No active debug session.');
        const session = this.getSession(localsError);
        const provider = this.getProvider(session, 'getLocals');
        return provider.getLocals(session);
    }
    supportsVariableReferenceSyntax(variable) {
        if (!this.sessionManager.currentSession) {
            return false;
        }
        const provider = this.getProvider(this.sessionManager.currentSession, 'supportsVariableReferenceSyntax');
        return provider.supportsVariableReferenceSyntax(this.sessionManager.currentSession, variable);
    }
    formatVariableReference(variable) {
        if (!this.sessionManager.currentSession) {
            return '';
        }
        const provider = this.getProvider(this.sessionManager.currentSession, 'formatVariableReference');
        return provider.formatVariableReference(this.sessionManager.currentSession, variable);
    }
    /** @throws with {@link message} if there is no active debug session. */
    getSession(message) {
        if (this.sessionManager.currentSession) {
            return this.sessionManager.currentSession;
        }
        throw new Error(message);
    }
    getProvider(session, ensure) {
        var _a;
        return (_a = this.contributions.getContributions()
            .find((candidate) => Boolean(!ensure || candidate[ensure]) && candidate.canHandle(session))) !== null && _a !== void 0 ? _a : this.defaultProvider;
    }
};
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], MemoryProviderService.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(memory_provider_1.DefaultMemoryProvider),
    __metadata("design:type", memory_provider_1.DefaultMemoryProvider)
], MemoryProviderService.prototype, "defaultProvider", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(memory_provider_1.MemoryProvider),
    __metadata("design:type", Object)
], MemoryProviderService.prototype, "contributions", void 0);
MemoryProviderService = __decorate([
    (0, inversify_1.injectable)()
], MemoryProviderService);
exports.MemoryProviderService = MemoryProviderService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/memory-provider/memory-provider-service'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider.js":
/*!**************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/memory-provider/memory-provider.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "../../node_modules/buffer/index.js")["Buffer"];

/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
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
exports.AbstractMemoryProvider = exports.DefaultMemoryProvider = exports.base64ToBytes = exports.MemoryProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const Long = __webpack_require__(/*! long */ "../../node_modules/long/src/long.js");
exports.MemoryProvider = Symbol('MemoryProvider');
/**
 * Convert a base64-encoded string of bytes to the Uint8Array equivalent.
 */
function base64ToBytes(base64) {
    return Buffer.from(base64, 'base64');
}
exports.base64ToBytes = base64ToBytes;
let DefaultMemoryProvider = class DefaultMemoryProvider {
    // This provider should only be used a fallback - it shouldn't volunteer to handle any session.
    canHandle() {
        return false;
    }
    async readMemory(session, readMemoryArguments) {
        var _a;
        console.log('Requesting memory with the following arguments:', readMemoryArguments);
        const result = await session.sendRequest('readMemory', readMemoryArguments);
        if ((_a = result.body) === null || _a === void 0 ? void 0 : _a.data) {
            const { body: { data, address } } = result;
            const bytes = base64ToBytes(data);
            const longAddress = result.body.address.startsWith('0x') ? Long.fromString(address, true, 16) : Long.fromString(address, true, 10);
            return { bytes, address: longAddress };
        }
        throw new Error('Received no data from debug adapter.');
    }
    async writeMemory(session, writeMemoryArguments) {
        return session.sendRequest('writeMemory', writeMemoryArguments);
    }
    async getLocals(session) {
        return [];
    }
    supportsVariableReferenceSyntax(session, variable) {
        return false;
    }
    formatVariableReference(session, variable) {
        return '';
    }
};
DefaultMemoryProvider = __decorate([
    (0, inversify_1.injectable)()
], DefaultMemoryProvider);
exports.DefaultMemoryProvider = DefaultMemoryProvider;
let AbstractMemoryProvider = class AbstractMemoryProvider {
    readMemory(session, readMemoryArguments) {
        return this.defaultProvider.readMemory(session, readMemoryArguments);
    }
    writeMemory(session, writeMemoryArguments) {
        return this.defaultProvider.writeMemory(session, writeMemoryArguments);
    }
    getLocals(session) {
        return this.defaultProvider.getLocals(session);
    }
    supportsVariableReferenceSyntax(session, variable) {
        return this.defaultProvider.supportsVariableReferenceSyntax(session, variable);
    }
    formatVariableReference(session, variable) {
        return this.defaultProvider.formatVariableReference(session, variable);
    }
};
__decorate([
    (0, inversify_1.inject)(DefaultMemoryProvider),
    __metadata("design:type", DefaultMemoryProvider)
], AbstractMemoryProvider.prototype, "defaultProvider", void 0);
AbstractMemoryProvider = __decorate([
    (0, inversify_1.injectable)()
], AbstractMemoryProvider);
exports.AbstractMemoryProvider = AbstractMemoryProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/memory-provider/memory-provider'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/memory-widget/memory-options-widget.js":
/*!******************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/memory-widget/memory-options-widget.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MemoryOptionsWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryOptionsWidget = exports.AUTO_UPDATE_TOGGLE_ID = exports.ASCII_TOGGLE_ID = exports.ENDIAN_SELECT_ID = exports.BYTES_PER_GROUP_FIELD_ID = exports.BYTES_PER_ROW_FIELD_ID = exports.LOCATION_OFFSET_FIELD_ID = exports.LENGTH_FIELD_ID = exports.LOCATION_FIELD_ID = exports.EMPTY_MEMORY = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const debug_session_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const debug_session_manager_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const Long = __webpack_require__(/*! long */ "../../node_modules/long/src/long.js");
const memory_provider_service_1 = __webpack_require__(/*! ../memory-provider/memory-provider-service */ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider-service.js");
const memory_recents_1 = __webpack_require__(/*! ../utils/memory-recents */ "../../packages/memory-inspector/lib/browser/utils/memory-recents.js");
const memory_widget_components_1 = __webpack_require__(/*! ../utils/memory-widget-components */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-components.js");
const memory_widget_utils_1 = __webpack_require__(/*! ../utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const multi_select_bar_1 = __webpack_require__(/*! ../utils/multi-select-bar */ "../../packages/memory-inspector/lib/browser/utils/multi-select-bar.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
exports.EMPTY_MEMORY = (0, core_1.deepFreeze)({
    bytes: new Uint8Array(),
    address: new Long(0, 0, true),
});
exports.LOCATION_FIELD_ID = 't-mv-location';
exports.LENGTH_FIELD_ID = 't-mv-length';
exports.LOCATION_OFFSET_FIELD_ID = 't-mv-location-offset';
exports.BYTES_PER_ROW_FIELD_ID = 't-mv-bytesrow';
exports.BYTES_PER_GROUP_FIELD_ID = 't-mv-bytesgroup';
exports.ENDIAN_SELECT_ID = 't-mv-endiannesss';
exports.ASCII_TOGGLE_ID = 't-mv-ascii-toggle';
exports.AUTO_UPDATE_TOGGLE_ID = 't-mv-auto-update-toggle';
let MemoryOptionsWidget = MemoryOptionsWidget_1 = class MemoryOptionsWidget extends browser_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.iconClass = 'memory-view-icon';
        this.lockIconClass = 'memory-lock-icon';
        this.additionalColumnSelectLabel = core_1.nls.localize('theia/memory-inspector/extraColumn', 'Extra Column');
        this.sessionListeners = new core_1.DisposableCollection();
        this.onOptionsChangedEmitter = new core_1.Emitter();
        this.onOptionsChanged = this.onOptionsChangedEmitter.event;
        this.onMemoryChangedEmitter = new core_1.Emitter();
        this.onMemoryChanged = this.onMemoryChangedEmitter.event;
        this.memoryReadResult = exports.EMPTY_MEMORY;
        this.columnsDisplayed = {
            address: {
                label: core_1.nls.localizeByDefault('Address'),
                doRender: true
            },
            data: {
                label: core_1.nls.localize('theia/memory-inspector/data', 'Data'),
                doRender: true
            },
            variables: {
                label: core_1.nls.localizeByDefault('Variables'),
                doRender: true
            },
            ascii: {
                label: core_1.nls.localize('theia/memory-inspector/ascii', 'ASCII'),
                doRender: false
            },
        };
        this.byteSize = 8;
        this.bytesPerGroup = 1;
        this.groupsPerRow = 4;
        this.variables = [];
        this.endianness = memory_widget_utils_1.Interfaces.Endianness.Little;
        this.memoryReadError = core_1.nls.localize('theia/memory-inspector/memory/readError/noContents', 'No memory contents currently available.');
        this.address = 0;
        this.offset = 0;
        this.readLength = 256;
        this.doDisplaySettings = false;
        this.doUpdateAutomatically = true;
        this.showMemoryError = false;
        this.errorTimeout = undefined;
        this.recentLocations = new memory_recents_1.Recents();
        this.showTitleEditIcon = false;
        this.isTitleEditable = false;
        this.handleColumnSelectionChange = (columnLabel, doShow) => this.doHandleColumnSelectionChange(columnLabel, doShow);
        this.toggleAutoUpdate = (e) => {
            var _a;
            if (e.nativeEvent.type === 'click') {
                e.currentTarget.blur();
            }
            if ('key' in e && ((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode) === browser_1.Key.TAB.keyCode) {
                return;
            }
            this.doUpdateAutomatically = !this.doUpdateAutomatically;
            if (this.doUpdateAutomatically) {
                this.title.iconClass = this.iconClass;
            }
            else {
                this.title.iconClass = this.lockIconClass;
            }
            this.fireDidChangeOptions();
        };
        this.onByteSizeChange = (event) => {
            this.byteSize = parseInt(event.target.value);
            this.fireDidChangeOptions(event.target.id);
        };
        this.toggleDoShowSettings = (e) => {
            var _a;
            if (!('key' in e) || ((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode) === browser_1.Key.TAB.keyCode) {
                this.doDisplaySettings = !this.doDisplaySettings;
                this.update();
            }
        };
        this.assignLocationRef = location => {
            this.addressField = location !== null && location !== void 0 ? location : undefined;
        };
        this.assignReadLengthRef = readLength => {
            this.readLengthField = readLength !== null && readLength !== void 0 ? readLength : undefined;
        };
        this.assignOffsetRef = offset => {
            this.offsetField = offset !== null && offset !== void 0 ? offset : undefined;
        };
        this.setAddressFromSelect = (e) => {
            if (this.addressField) {
                this.addressField.value = e.target.value;
            }
        };
        this.activateHeaderInputField = (e) => {
            var _a, _b;
            if (!this.isTitleEditable) {
                const isMouseDown = !('key' in e);
                const isActivationKey = 'key' in e && (((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode) === browser_1.Key.SPACE.keyCode
                    || ((_b = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _b === void 0 ? void 0 : _b.keyCode) === browser_1.Key.ENTER.keyCode);
                if (isMouseDown || isActivationKey) {
                    if (isMouseDown) {
                        e.currentTarget.blur();
                    }
                    this.isTitleEditable = true;
                    this.update();
                }
            }
        };
        this.saveHeaderInputValue = (e) => {
            const isMouseDown = !('key' in e);
            const isSaveKey = 'key' in e && e.key === 'Enter';
            const isCancelKey = 'key' in e && e.key === 'Escape';
            e.stopPropagation();
            if (isMouseDown || isSaveKey || isCancelKey) {
                this.updateHeader(isCancelKey);
            }
        };
        this.assignHeaderInputRef = (element) => {
            if (element) {
                this.headerInputField = element;
                element.focus();
            }
        };
        this.doShowMemoryErrors = (doClearError = false) => {
            if (this.errorTimeout !== undefined) {
                clearTimeout(this.errorTimeout);
            }
            if (doClearError) {
                this.showMemoryError = false;
                this.update();
                this.errorTimeout = undefined;
                return;
            }
            this.showMemoryError = true;
            this.update();
            this.errorTimeout = setTimeout(() => {
                this.showMemoryError = false;
                this.update();
                this.errorTimeout = undefined;
            }, memory_widget_utils_1.Constants.ERROR_TIMEOUT);
        };
        this.doRefresh = (event) => {
            if ('key' in event && event.key !== 'Enter') {
                return;
            }
            this.updateMemoryView();
        };
        this.updateMemoryView = debounce(this.doUpdateMemoryView.bind(this), memory_widget_utils_1.Constants.DEBOUNCE_TIME, { trailing: true });
        // Callbacks for when the various view parameters change.
        /**
         * Handle bytes per row changed event.
         */
        this.onGroupsPerRowChange = (event) => {
            const { value, id } = event.target;
            this.groupsPerRow = parseInt(value);
            this.fireDidChangeOptions(id);
        };
        /**
         * Handle bytes per group changed event.
         */
        this.onBytesPerGroupChange = (event) => {
            const { value, id } = event.target;
            this.bytesPerGroup = parseInt(value);
            this.fireDidChangeOptions(id);
        };
        /**
         * Handle endianness changed event.
         */
        this.onEndiannessChange = (event) => {
            const { value, id } = event.target;
            if (value !== memory_widget_utils_1.Interfaces.Endianness.Big && value !== memory_widget_utils_1.Interfaces.Endianness.Little) {
                return;
            }
            this.endianness = value;
            this.fireDidChangeOptions(id);
        };
    }
    get memory() {
        return {
            ...this.memoryReadResult,
            variables: this.variables,
        };
    }
    get options() {
        return this.storeState();
    }
    init() {
        this.addClass(MemoryOptionsWidget_1.ID);
        this.title.label = core_1.nls.localize('theia/memory-inspector/memory', 'Memory ({0})', this.memoryWidgetOptions.displayId);
        this.title.caption = core_1.nls.localize('theia/memory-inspector/memory', 'Memory ({0})', this.memoryWidgetOptions.displayId);
        this.title.iconClass = this.iconClass;
        this.title.closable = true;
        if (this.memoryWidgetOptions.dynamic !== false) {
            this.toDispose.push(this.sessionManager.onDidChangeActiveDebugSession(({ current }) => {
                this.setUpListeners(current);
            }));
            this.toDispose.push(this.sessionManager.onDidCreateDebugSession(current => {
                this.setUpListeners(current);
            }));
            this.setUpListeners(this.sessionManager.currentSession);
        }
        this.toDispose.push(this.onOptionsChanged(() => this.update()));
        this.update();
    }
    async setAddressAndGo(newAddress, newOffset, newLength, direction) {
        let doUpdate = false;
        const originalValues = {
            offset: '',
            length: '',
        };
        if (this.addressField) {
            this.addressField.value = newAddress;
            doUpdate = true;
        }
        if (this.offsetField && newOffset !== undefined) {
            originalValues.offset = this.offsetField.value;
            this.offsetField.value = newOffset.toString();
            doUpdate = true;
        }
        if (this.readLengthField && newLength !== undefined) {
            originalValues.length = this.readLengthField.value;
            this.readLengthField.value = newLength.toString();
            doUpdate = true;
        }
        if (doUpdate && this.readLengthField && this.offsetField) {
            this.pinnedMemoryReadResult = new promise_util_1.Deferred();
            this.updateMemoryView();
            const result = await this.pinnedMemoryReadResult.promise;
            if (result === false) {
                // Memory request errored
                this.readLengthField.value = originalValues.length;
                this.offsetField.value = originalValues.offset;
            }
            if (result) {
                // Memory request returned some memory
                const resultLength = result.bytes.length * 8 / this.byteSize;
                const lengthFieldValue = parseInt(this.readLengthField.value);
                if (lengthFieldValue !== resultLength) {
                    this.memoryReadError = core_1.nls.localize('theia/memory-inspector/memory/readError/bounds', 'Memory bounds exceeded, result will be truncated.');
                    this.doShowMemoryErrors();
                    this.readLengthField.value = resultLength.toString();
                    if (direction === 'above') {
                        this.offsetField.value = `${parseInt(originalValues.offset) - (resultLength - parseInt(originalValues.length))}`;
                    }
                    this.update();
                }
            }
        }
        return undefined;
    }
    setUpListeners(session) {
        this.sessionListeners.dispose();
        this.sessionListeners = new core_1.DisposableCollection(core_1.Disposable.create(() => this.handleActiveSessionChange()));
        if (session) {
            this.sessionListeners.push(session.onDidChange(() => this.handleSessionChange()));
        }
    }
    handleActiveSessionChange() {
        const isDynamic = this.memoryWidgetOptions.dynamic !== false;
        if (isDynamic && this.doUpdateAutomatically) {
            this.memoryReadResult = exports.EMPTY_MEMORY;
            this.fireDidChangeMemory();
        }
    }
    handleSessionChange() {
        var _a, _b;
        const isStopped = ((_a = this.sessionManager.currentSession) === null || _a === void 0 ? void 0 : _a.state) === debug_session_1.DebugState.Stopped;
        const isReadyForQuery = !!((_b = this.sessionManager.currentSession) === null || _b === void 0 ? void 0 : _b.currentFrame);
        const isDynamic = this.memoryWidgetOptions.dynamic !== false;
        if (isStopped && isReadyForQuery && isDynamic && this.doUpdateAutomatically && this.memoryReadResult !== exports.EMPTY_MEMORY) {
            this.updateMemoryView();
        }
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.acceptFocus();
    }
    acceptFocus() {
        if (this.doUpdateAutomatically) {
            if (this.addressField) {
                this.addressField.focus();
                this.addressField.select();
            }
        }
        else {
            const settingsCog = this.node.querySelector('.toggle-settings-click-zone');
            settingsCog === null || settingsCog === void 0 ? void 0 : settingsCog.focus();
        }
    }
    doHandleColumnSelectionChange(columnLabel, doShow) {
        if (columnLabel in this.columnsDisplayed) {
            this.columnsDisplayed[columnLabel].doRender = doShow;
            this.fireDidChangeOptions(exports.ASCII_TOGGLE_ID);
        }
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        if (this.memoryWidgetOptions.dynamic !== false) {
            if (this.addressField) {
                this.addressField.value = this.address.toString();
            }
        }
    }
    render() {
        return (React.createElement("div", { className: 't-mv-container' }, this.renderInputContainer()));
    }
    renderInputContainer() {
        return (React.createElement("div", { className: 't-mv-settings-container' },
            React.createElement("div", { className: 't-mv-wrapper' },
                this.renderToolbar(),
                this.renderMemoryLocationGroup(),
                this.doDisplaySettings && (React.createElement("div", { className: 't-mv-toggle-settings-wrapper' }, this.renderByteDisplayGroup())))));
    }
    renderByteDisplayGroup() {
        return (React.createElement("div", { className: 't-mv-group settings-group' },
            React.createElement(memory_widget_components_1.MWSelect, { id: 'byte-size-select', label: core_1.nls.localize('theia/memory-inspector/byteSize', 'Byte Size'), value: this.byteSize.toString(), onChange: this.onByteSizeChange, options: ['8', '16', '32', '64'] }),
            React.createElement(memory_widget_components_1.MWSelect, { id: exports.BYTES_PER_GROUP_FIELD_ID, label: core_1.nls.localize('theia/memory-inspector/bytesPerGroup', 'Bytes Per Group'), value: this.bytesPerGroup.toString(), onChange: this.onBytesPerGroupChange, options: ['1', '2', '4', '8', '16'] }),
            React.createElement(memory_widget_components_1.MWSelect, { id: exports.BYTES_PER_ROW_FIELD_ID, label: core_1.nls.localize('theia/memory-inspector/groupsPerRow', 'Groups Per Row'), value: this.groupsPerRow.toString(), onChange: this.onGroupsPerRowChange, options: ['1', '2', '4', '8', '16', '32'] }),
            React.createElement(memory_widget_components_1.MWSelect, { id: exports.ENDIAN_SELECT_ID, label: core_1.nls.localize('theia/memory-inspector/endianness', 'Endianness'), value: this.endianness, onChange: this.onEndiannessChange, options: [memory_widget_utils_1.Interfaces.Endianness.Little, memory_widget_utils_1.Interfaces.Endianness.Big] }),
            React.createElement(multi_select_bar_1.MWMultiSelect, { id: exports.ASCII_TOGGLE_ID, label: core_1.nls.localize('theia/memory-inspector/columns', 'Columns'), items: this.getOptionalColumns(), onSelectionChanged: this.handleColumnSelectionChange })));
    }
    getObligatoryColumnIds() {
        return ['address', 'data'];
    }
    getOptionalColumns() {
        const obligatoryColumns = new Set(this.getObligatoryColumnIds());
        return Object.entries(this.columnsDisplayed)
            .reduce((accumulated, [id, { doRender, label }]) => {
            if (!obligatoryColumns.has(id)) {
                accumulated.push({ id, label, defaultChecked: doRender });
            }
            return accumulated;
        }, []);
    }
    renderMemoryLocationGroup() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: 't-mv-group view-group' },
                React.createElement(memory_widget_components_1.MWInputWithSelect, { id: exports.LOCATION_FIELD_ID, label: core_1.nls.localizeByDefault('Address'), title: core_1.nls.localize('theia/memory-inspector/addressTooltip', 'Memory location to display, an address or expression evaluating to an address'), defaultValue: `${this.address}`, onSelectChange: this.setAddressFromSelect, passRef: this.assignLocationRef, onKeyDown: this.doRefresh, options: [...this.recentLocations.values], disabled: !this.doUpdateAutomatically }),
                React.createElement(memory_widget_components_1.MWInput, { id: exports.LOCATION_OFFSET_FIELD_ID, label: core_1.nls.localize('theia/memory-inspector/offset', 'Offset'), title: core_1.nls.localize('theia/memory-inspector/offsetTooltip', 'Offset to be added to the current memory location, when navigating'), defaultValue: '0', passRef: this.assignOffsetRef, onKeyDown: this.doRefresh, disabled: !this.doUpdateAutomatically }),
                React.createElement(memory_widget_components_1.MWInput, { id: exports.LENGTH_FIELD_ID, label: core_1.nls.localize('theia/memory-inspector/length', 'Length'), title: core_1.nls.localize('theia/memory-inspector/lengthTooltip', 'Number of bytes to fetch, in decimal or hexadecimal'), defaultValue: this.readLength.toString(), passRef: this.assignReadLengthRef, onChange: memory_widget_utils_1.Utils.validateNumericalInputs, onKeyDown: this.doRefresh, disabled: !this.doUpdateAutomatically }),
                React.createElement("button", { type: 'button', className: 'theia-button main view-group-go-button', onClick: this.doRefresh, disabled: !this.doUpdateAutomatically, title: core_1.nls.localizeByDefault('Go') }, core_1.nls.localizeByDefault('Go'))),
            React.createElement("div", { className: `t-mv-memory-fetch-error${this.showMemoryError ? ' show' : ' hide'}` }, this.memoryReadError)));
    }
    updateHeader(isCancelKey) {
        if (!isCancelKey && this.headerInputField) {
            this.title.label = this.headerInputField.value;
            this.title.caption = this.headerInputField.value;
        }
        this.isTitleEditable = false;
        this.update();
    }
    renderToolbar() {
        return (React.createElement("div", { className: 'memory-widget-toolbar' },
            this.renderLockIcon(),
            this.renderEditableTitleField(),
            this.renderSettingsContainer()));
    }
    renderSettingsContainer() {
        return React.createElement("div", { className: 'toggle-settings-container' },
            React.createElement("div", { className: 'toggle-settings-click-zone no-select', tabIndex: 0, "aria-label": this.doDisplaySettings ?
                    core_1.nls.localize('theia/memory-inspector/memory/hideSettings', 'Hide Settings Panel') :
                    core_1.nls.localize('theia/memory-inspector/memory/showSettings', 'Show Settings Panel'), role: 'button', onClick: this.toggleDoShowSettings, onKeyDown: this.toggleDoShowSettings, title: this.doDisplaySettings ?
                    core_1.nls.localize('theia/memory-inspector/memory/hideSettings', 'Hide Settings Panel') :
                    core_1.nls.localize('theia/memory-inspector/memory/showSettings', 'Show Settings Panel') },
                React.createElement("i", { className: 'codicon codicon-settings-gear' }),
                React.createElement("span", null, this.doDisplaySettings ?
                    core_1.nls.localize('theia/memory-inspector/closeSettings', 'Close Settings') :
                    core_1.nls.localizeByDefault('Settings'))));
    }
    renderLockIcon() {
        return this.memoryWidgetOptions.dynamic !== false && (React.createElement("div", { className: 'memory-widget-auto-updates-container' },
            React.createElement("div", { className: `fa fa-${this.doUpdateAutomatically ? 'unlock' : 'lock'}`, id: exports.AUTO_UPDATE_TOGGLE_ID, title: this.doUpdateAutomatically ?
                    core_1.nls.localize('theia/memory-inspector/memory/freeze', 'Freeze Memory View') :
                    core_1.nls.localize('theia/memory-inspector/memory/unfreeze', 'Unfreeze Memory View'), onClick: this.toggleAutoUpdate, onKeyDown: this.toggleAutoUpdate, role: 'button', tabIndex: 0 })));
    }
    renderEditableTitleField() {
        return (React.createElement("div", { className: 'memory-widget-header-click-zone', tabIndex: 0, onClick: this.activateHeaderInputField, onKeyDown: this.activateHeaderInputField, role: 'button' },
            !this.isTitleEditable
                ? (React.createElement("h2", { className: `${MemoryOptionsWidget_1.WIDGET_H2_CLASS}${!this.doUpdateAutomatically ? ' disabled' : ''} no-select` }, this.title.label))
                : React.createElement("input", { className: 'theia-input', type: 'text', defaultValue: this.title.label, onKeyDown: this.saveHeaderInputValue, spellCheck: false, ref: this.assignHeaderInputRef }),
            !this.isTitleEditable && (React.createElement("div", { className: `fa fa-pencil${this.showTitleEditIcon ? ' show' : ' hide'}` })),
            this.isTitleEditable && (React.createElement("div", { className: 'fa fa-save', onClick: this.saveHeaderInputValue, onKeyDown: this.saveHeaderInputValue, role: 'button', tabIndex: 0, title: core_1.nls.localizeByDefault('Save') }))));
    }
    storeState() {
        var _a, _b, _c, _d, _e, _f;
        return {
            address: (_b = (_a = this.addressField) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : this.address,
            offset: (_d = parseInt(`${(_c = this.offsetField) === null || _c === void 0 ? void 0 : _c.value}`)) !== null && _d !== void 0 ? _d : this.offset,
            length: (_f = parseInt(`${(_e = this.readLengthField) === null || _e === void 0 ? void 0 : _e.value}`)) !== null && _f !== void 0 ? _f : this.readLength,
            byteSize: this.byteSize,
            bytesPerGroup: this.bytesPerGroup,
            groupsPerRow: this.groupsPerRow,
            endianness: this.endianness,
            doDisplaySettings: this.doDisplaySettings,
            columnsDisplayed: this.columnsDisplayed,
            recentLocationsArray: this.recentLocations.values,
            isFrozen: !this.doUpdateAutomatically,
            doUpdateAutomatically: this.doUpdateAutomatically,
        };
    }
    restoreState(oldState) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.address = (_a = oldState.address) !== null && _a !== void 0 ? _a : this.address;
        this.offset = (_b = oldState.offset) !== null && _b !== void 0 ? _b : this.offset;
        this.readLength = (_c = oldState.length) !== null && _c !== void 0 ? _c : this.readLength;
        this.byteSize = (_d = oldState.byteSize) !== null && _d !== void 0 ? _d : this.byteSize;
        this.bytesPerGroup = (_e = oldState.bytesPerGroup) !== null && _e !== void 0 ? _e : this.bytesPerGroup;
        this.groupsPerRow = (_f = oldState.groupsPerRow) !== null && _f !== void 0 ? _f : this.groupsPerRow;
        this.endianness = (_g = oldState.endianness) !== null && _g !== void 0 ? _g : this.endianness;
        this.recentLocations = (_h = new memory_recents_1.Recents(oldState.recentLocationsArray)) !== null && _h !== void 0 ? _h : this.recentLocations;
        this.doDisplaySettings = !!oldState.doDisplaySettings;
        if (oldState.columnsDisplayed) {
            this.columnsDisplayed = oldState.columnsDisplayed;
        }
    }
    fetchNewMemory() {
        this.updateMemoryView();
    }
    async doUpdateMemoryView() {
        var _a, _b;
        if (!(this.addressField && this.readLengthField)) {
            return;
        }
        if (((_a = this.addressField) === null || _a === void 0 ? void 0 : _a.value.trim().length) === 0) {
            this.memoryReadError = core_1.nls.localize('theia/memory-inspector/memory/addressField/memoryReadError', 'Enter an address or expression in the Location field.');
            this.doShowMemoryErrors();
            return;
        }
        if (this.readLengthField.value.trim().length === 0) {
            this.memoryReadError = core_1.nls.localize('theia/memory-inspector/memory/readLength/memoryReadError', 'Enter a length (decimal or hexadecimal number) in the Length field.');
            this.doShowMemoryErrors();
            return;
        }
        const startAddress = this.addressField.value;
        const locationOffset = parseInt(`${(_b = this.offsetField) === null || _b === void 0 ? void 0 : _b.value}`) || 0;
        const readLength = parseInt(this.readLengthField.value);
        try {
            this.memoryReadResult = await this.getMemory(startAddress, readLength, locationOffset);
            this.fireDidChangeMemory();
            if (this.pinnedMemoryReadResult) {
                this.pinnedMemoryReadResult.resolve(this.memoryReadResult);
            }
            this.doShowMemoryErrors(true);
        }
        catch (err) {
            this.memoryReadError = this.getUserError(err);
            console.error('Failed to read memory', err);
            this.doShowMemoryErrors();
            if (this.pinnedMemoryReadResult) {
                this.pinnedMemoryReadResult.resolve(this.memoryReadResult);
            }
        }
        finally {
            this.pinnedMemoryReadResult = undefined;
            this.update();
        }
    }
    getUserError(err) {
        return err instanceof Error ? err.message : core_1.nls.localize('theia/memory-inspector/memory/userError', 'There was an error fetching memory.');
    }
    async getMemory(memoryReference, count, offset) {
        const result = await this.retrieveMemory(memoryReference, count, offset);
        try {
            this.variables = await this.memoryProvider.getLocals();
        }
        catch {
            this.variables = [];
        }
        this.recentLocations.add(memoryReference);
        this.updateDefaults(memoryReference, count, offset);
        return result;
    }
    async retrieveMemory(memoryReference, count, offset) {
        return this.memoryProvider.readMemory({ memoryReference, count, offset });
    }
    // TODO: This may not be necessary if we change how state is stored (currently in the text fields themselves.)
    updateDefaults(address, readLength, offset) {
        this.address = address;
        this.readLength = readLength;
        this.offset = offset;
    }
    fireDidChangeOptions(targetId) {
        this.onOptionsChangedEmitter.fire(targetId);
    }
    fireDidChangeMemory() {
        this.onMemoryChangedEmitter.fire(this.memoryReadResult);
    }
};
MemoryOptionsWidget.ID = 'memory-view-options-widget';
MemoryOptionsWidget.LABEL = core_1.nls.localize('theia/memory-inspector/memoryTitle', 'Memory');
MemoryOptionsWidget.WIDGET_H2_CLASS = 'memory-widget-header';
MemoryOptionsWidget.WIDGET_HEADER_INPUT_CLASS = 'memory-widget-header-input';
__decorate([
    (0, inversify_1.inject)(memory_provider_service_1.MemoryProviderService),
    __metadata("design:type", memory_provider_service_1.MemoryProviderService)
], MemoryOptionsWidget.prototype, "memoryProvider", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], MemoryOptionsWidget.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(memory_widget_utils_1.MemoryWidgetOptions),
    __metadata("design:type", Object)
], MemoryOptionsWidget.prototype, "memoryWidgetOptions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryOptionsWidget.prototype, "init", null);
MemoryOptionsWidget = MemoryOptionsWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], MemoryOptionsWidget);
exports.MemoryOptionsWidget = MemoryOptionsWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/memory-widget/memory-options-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/memory-widget/memory-table-widget.js":
/*!****************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/memory-widget/memory-table-widget.js ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MemoryTableWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryTableWidget = exports.MemoryTable = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const util_1 = __webpack_require__(/*! ../../common/util */ "../../packages/memory-inspector/lib/common/util.js");
const memory_provider_service_1 = __webpack_require__(/*! ../memory-provider/memory-provider-service */ "../../packages/memory-inspector/lib/browser/memory-provider/memory-provider-service.js");
const memory_hover_renderer_1 = __webpack_require__(/*! ../utils/memory-hover-renderer */ "../../packages/memory-inspector/lib/browser/utils/memory-hover-renderer.js");
const memory_widget_components_1 = __webpack_require__(/*! ../utils/memory-widget-components */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-components.js");
const memory_widget_utils_1 = __webpack_require__(/*! ../utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const memory_widget_variable_utils_1 = __webpack_require__(/*! ../utils/memory-widget-variable-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-variable-utils.js");
const memory_options_widget_1 = __webpack_require__(/*! ./memory-options-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-options-widget.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
/* eslint-disable @typescript-eslint/no-explicit-any */
var MemoryTable;
(function (MemoryTable) {
    MemoryTable.ROW_CLASS = 't-mv-view-row';
    MemoryTable.ROW_DIVIDER_CLASS = 't-mv-view-row-highlight';
    MemoryTable.ADDRESS_DATA_CLASS = 't-mv-view-address';
    MemoryTable.MEMORY_DATA_CLASS = 't-mv-view-data';
    MemoryTable.EXTRA_COLUMN_DATA_CLASS = 't-mv-view-code';
    MemoryTable.GROUP_SPAN_CLASS = 'byte-group';
    MemoryTable.BYTE_SPAN_CLASS = 'single-byte';
    MemoryTable.EIGHT_BIT_SPAN_CLASS = 'eight-bits';
    MemoryTable.HEADER_LABEL_CONTAINER_CLASS = 't-mv-header-label-container';
    MemoryTable.HEADER_LABEL_CLASS = 't-mv-header-label';
    MemoryTable.VARIABLE_LABEL_CLASS = 't-mv-variable-label';
    MemoryTable.HEADER_ROW_CLASS = 't-mv-header';
})(MemoryTable = exports.MemoryTable || (exports.MemoryTable = {}));
let MemoryTableWidget = MemoryTableWidget_1 = class MemoryTableWidget extends browser_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.deferredScrollContainer = new promise_util_1.Deferred();
        this.updateColumnWidths = debounce(this.doUpdateColumnWidths.bind(this), memory_widget_utils_1.Constants.DEBOUNCE_TIME);
        this.assignScrollContainerRef = (element) => {
            this.deferredScrollContainer.resolve(element);
        };
        this.loadMoreMemory = async (options) => {
            const { direction, numBytes } = options;
            const { address, offset, length } = this.optionsWidget.options;
            let newOffset = 0;
            const newLength = length + numBytes;
            if (direction === 'above') {
                newOffset = offset - numBytes;
            }
            await this.optionsWidget.setAddressAndGo(`${address}`, newOffset, newLength, direction);
        };
        this.handleTableMouseMove = (e) => {
            const { target } = e; // react events can't be put into the debouncer
            this.debounceHandleMouseTableMove(target);
        };
        this.debounceHandleMouseTableMove = debounce(this.doHandleTableMouseMove.bind(this), memory_widget_utils_1.Constants.DEBOUNCE_TIME, { trailing: true });
        this.handleTableRightClick = (e) => this.doHandleTableRightClick(e);
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.id = MemoryTableWidget_1.ID;
        this.addClass(MemoryTableWidget_1.ID);
        this.scrollOptions = { ...this.scrollOptions, suppressScrollX: false };
        this.toDispose.push(this.optionsWidget.onOptionsChanged(optionId => this.handleOptionChange(optionId)));
        this.toDispose.push(this.optionsWidget.onMemoryChanged(e => this.handleMemoryChange(e)));
        this.toDispose.push(this.themeService.onDidColorThemeChange(e => this.handleThemeChange(e)));
        this.getStateAndUpdate();
    }
    handleOptionChange(_id) {
        this.getStateAndUpdate();
        return Promise.resolve();
    }
    update() {
        super.update();
        this.updateColumnWidths();
    }
    onResize(msg) {
        this.updateColumnWidths();
        super.onResize(msg);
    }
    doUpdateColumnWidths() {
        setTimeout(() => {
            const firstTR = this.node.querySelector('tr');
            const header = this.node.querySelector(`.${MemoryTable.HEADER_ROW_CLASS}`);
            if (firstTR && header) {
                const allTDs = Array.from(firstTR.querySelectorAll('td'));
                const allSizes = allTDs.map(td => `minmax(max-content, ${td.clientWidth}px)`);
                header.style.gridTemplateColumns = allSizes.join(' ');
            }
        });
    }
    areSameRegion(a, b) {
        return a.address.equals(b === null || b === void 0 ? void 0 : b.address) && a.bytes.length === (b === null || b === void 0 ? void 0 : b.bytes.length);
    }
    handleMemoryChange(newMemory) {
        if (this.areSameRegion(this.memory, newMemory)) {
            this.previousBytes = this.memory.bytes;
        }
        else {
            this.previousBytes = undefined;
        }
        this.getStateAndUpdate();
    }
    handleThemeChange(_themeChange) {
        this.getStateAndUpdate();
    }
    getState() {
        this.options = this.optionsWidget.options;
        this.memory = this.optionsWidget.memory;
        const isHighContrast = this.themeService.getCurrentTheme().type === 'hc';
        this.variableFinder = this.optionsWidget.options.columnsDisplayed.variables.doRender
            ? new memory_widget_variable_utils_1.VariableFinder(this.memory.variables, isHighContrast)
            : undefined;
    }
    getStateAndUpdate() {
        this.getState();
        this.update();
        this.scrollIntoViewIfNecessary();
    }
    scrollIntoViewIfNecessary() {
        return new Promise(resolve => setTimeout(() => {
            this.deferredScrollContainer.promise.then(scrollContainer => {
                var _a;
                const table = scrollContainer.querySelector('table');
                if (table && scrollContainer.scrollTop > table.clientHeight) {
                    const valueToGetInWindow = table.clientHeight - this.node.clientHeight;
                    const scrollHere = Math.max(valueToGetInWindow, 0);
                    scrollContainer.scrollTo(scrollContainer.scrollLeft, scrollHere);
                }
                (_a = this.scrollBar) === null || _a === void 0 ? void 0 : _a.update();
                resolve();
            });
        }));
    }
    getWrapperHandlers() {
        return { onMouseMove: this.handleTableMouseMove };
    }
    async getScrollContainer() {
        return this.deferredScrollContainer.promise;
    }
    render() {
        const rows = this.getTableRows();
        const { onClick, onContextMenu, onFocus, onBlur, onKeyDown, onMouseMove } = this.getWrapperHandlers();
        const headers = Object.entries(this.options.columnsDisplayed)
            .filter(([, { doRender }]) => doRender)
            .map(([id, { label }]) => ({ label, id }));
        return (React.createElement("div", { className: this.getWrapperClass(), onClick: onClick, onContextMenu: onContextMenu, onFocus: onFocus, onBlur: onBlur, onKeyDown: onKeyDown, onMouseMove: onMouseMove, role: 'textbox', tabIndex: 0 },
            React.createElement("div", { className: this.getTableHeaderClass(), style: this.getTableHeaderStyle(headers.length) }, this.getTableHeaders(headers)),
            React.createElement("div", { className: 't-mv-view-container', style: { position: 'relative' }, ref: this.assignScrollContainerRef },
                this.getBeforeTableContent(),
                React.createElement("table", { className: 't-mv-view' },
                    React.createElement("tbody", null, rows)),
                this.getAfterTableContent()),
            this.getTableFooter()));
    }
    getWrapperClass() {
        return `t-mv-memory-container${this.options.isFrozen ? ' frozen' : ''}`;
    }
    getTableHeaderClass() {
        return MemoryTable.HEADER_ROW_CLASS + ' no-select';
    }
    getTableHeaderStyle(numLabels) {
        const safePercentage = Math.floor(100 / numLabels);
        const gridTemplateColumns = ` ${safePercentage}% `.repeat(numLabels);
        return { gridTemplateColumns };
    }
    getTableHeaders(labels) {
        return labels.map(label => this.getTableHeader(label));
    }
    getTableHeader({ label, id }) {
        return (React.createElement("div", { key: id, className: MemoryTable.HEADER_LABEL_CONTAINER_CLASS },
            React.createElement("span", { className: 't-mv-header-label' }, label)));
    }
    getBeforeTableContent() {
        return (!!this.memory.bytes.length && (React.createElement(memory_widget_components_1.MWMoreMemorySelect, { options: [128, 256, 512], direction: 'above', handler: this.loadMoreMemory })));
    }
    getAfterTableContent() {
        return (!!this.memory.bytes.length && (React.createElement(memory_widget_components_1.MWMoreMemorySelect, { options: [128, 256, 512], direction: 'below', handler: this.loadMoreMemory })));
    }
    getTableFooter() {
        return undefined;
    }
    getTableRows() {
        return [...this.renderRows()];
    }
    *renderRows(iteratee = this.memory.bytes) {
        const bytesPerRow = this.options.bytesPerGroup * this.options.groupsPerRow;
        let rowsYielded = 0;
        let groups = [];
        let ascii = '';
        let variables = [];
        let isRowHighlighted = false;
        for (const { node, index, ascii: groupAscii, variables: groupVariables, isHighlighted = false } of this.renderGroups(iteratee)) {
            groups.push(node);
            ascii += groupAscii;
            variables.push(...groupVariables);
            isRowHighlighted = isRowHighlighted || isHighlighted;
            if (groups.length === this.options.groupsPerRow || index === iteratee.length - 1) {
                const rowAddress = this.memory.address.add(bytesPerRow * rowsYielded);
                const options = {
                    address: `0x${rowAddress.toString(16)}`,
                    doShowDivider: (rowsYielded % 4) === 3,
                    isHighlighted: isRowHighlighted,
                    ascii,
                    groups,
                    variables,
                    index,
                };
                yield this.renderRow(options);
                ascii = '';
                variables = [];
                groups = [];
                rowsYielded += 1;
                isRowHighlighted = false;
            }
        }
    }
    renderRow(options, getRowAttributes = this.getRowAttributes.bind(this)) {
        const { address, groups } = options;
        const { className, style, title } = getRowAttributes(options);
        return (React.createElement("tr", { 
            // Add a marker to help visual navigation when scrolling
            className: className, style: style, title: title, key: address },
            React.createElement("td", { className: MemoryTable.ADDRESS_DATA_CLASS }, address),
            React.createElement("td", { className: MemoryTable.MEMORY_DATA_CLASS }, groups),
            this.getExtraColumn(options)));
    }
    getRowAttributes(options) {
        let className = MemoryTable.ROW_CLASS;
        if (options.doShowDivider) {
            className += ` ${MemoryTable.ROW_DIVIDER_CLASS}`;
        }
        return { className };
    }
    getExtraColumn(options) {
        const { variables } = options;
        const additionalColumns = [];
        if (this.options.columnsDisplayed.variables.doRender) {
            additionalColumns.push(React.createElement("td", { className: MemoryTable.EXTRA_COLUMN_DATA_CLASS, key: 'variables' }, !!(variables === null || variables === void 0 ? void 0 : variables.length) && (React.createElement("span", { className: 'variable-container' }, variables.map(({ name, color }) => (React.createElement("span", { key: name, className: MemoryTable.VARIABLE_LABEL_CLASS, style: { color } }, name)))))));
        }
        if (this.options.columnsDisplayed.ascii.doRender) {
            const asciiColumn = this.options.columnsDisplayed.ascii.doRender && React.createElement("td", { className: MemoryTable.EXTRA_COLUMN_DATA_CLASS, key: 'ascii' }, options.ascii);
            additionalColumns.push(asciiColumn);
        }
        return additionalColumns;
    }
    *renderGroups(iteratee = this.memory.bytes) {
        let bytesInGroup = [];
        let ascii = '';
        let variables = [];
        let isGroupHighlighted = false;
        for (const { node, index, ascii: byteAscii, variables: byteVariables, isHighlighted = false } of this.renderBytes(iteratee)) {
            this.buildGroupByEndianness(bytesInGroup, node);
            ascii += byteAscii;
            variables.push(...byteVariables);
            isGroupHighlighted = isGroupHighlighted || isHighlighted;
            if (bytesInGroup.length === this.options.bytesPerGroup || index === iteratee.length - 1) {
                const itemID = this.memory.address.add(index);
                yield {
                    node: React.createElement("span", { className: 'byte-group', key: itemID.toString(16) }, bytesInGroup),
                    ascii,
                    index,
                    variables,
                    isHighlighted: isGroupHighlighted,
                };
                bytesInGroup = [];
                ascii = '';
                variables = [];
                isGroupHighlighted = false;
            }
        }
    }
    buildGroupByEndianness(oldBytes, newByte) {
        if (this.options.endianness === memory_widget_utils_1.Interfaces.Endianness.Big) {
            oldBytes.push(newByte);
        }
        else {
            oldBytes.unshift(newByte);
        }
    }
    *renderBytes(iteratee = this.memory.bytes) {
        const itemsPerByte = this.options.byteSize / 8;
        let currentByte = 0;
        let chunksInByte = [];
        let variables = [];
        let isByteHighlighted = false;
        for (const { node, content, index, variable, isHighlighted = false } of this.renderArrayItems(iteratee)) {
            chunksInByte.push(node);
            const numericalValue = parseInt(content, 16);
            currentByte = (currentByte << 8) + numericalValue;
            isByteHighlighted = isByteHighlighted || isHighlighted;
            if (variable === null || variable === void 0 ? void 0 : variable.firstAppearance) {
                variables.push(variable);
            }
            if (chunksInByte.length === itemsPerByte || index === iteratee.length - 1) {
                const itemID = this.memory.address.add(index);
                const ascii = this.getASCIIForSingleByte(currentByte);
                yield {
                    node: React.createElement("span", { className: 'single-byte', key: itemID.toString(16) }, chunksInByte),
                    ascii,
                    index,
                    variables,
                    isHighlighted: isByteHighlighted,
                };
                currentByte = 0;
                chunksInByte = [];
                variables = [];
                isByteHighlighted = false;
            }
        }
    }
    getASCIIForSingleByte(byte) {
        return typeof byte === 'undefined'
            ? ' ' : memory_widget_utils_1.Utils.isPrintableAsAscii(byte) ? String.fromCharCode(byte) : '.';
    }
    *renderArrayItems(iteratee = this.memory.bytes, getBitAttributes = this.getBitAttributes.bind(this)) {
        const { address } = this.memory;
        for (let i = 0; i < iteratee.length; i += 1) {
            const itemID = address.add(i).toString(16);
            const { content = '', className, style, variable, title, isHighlighted } = getBitAttributes(i, iteratee);
            const node = (React.createElement("span", { style: style, key: itemID, className: className, "data-id": itemID, title: title }, content));
            yield {
                node,
                content,
                index: i,
                variable,
                isHighlighted,
            };
        }
    }
    getBitAttributes(arrayOffset, iteratee) {
        var _a;
        const itemAddress = this.memory.address.add(arrayOffset * 8 / this.options.byteSize);
        const classNames = [MemoryTable.EIGHT_BIT_SPAN_CLASS];
        const isChanged = this.previousBytes && iteratee[arrayOffset] !== this.previousBytes[arrayOffset];
        const variable = (_a = this.variableFinder) === null || _a === void 0 ? void 0 : _a.getVariableForAddress(itemAddress);
        if (!this.options.isFrozen) {
            if (isChanged) {
                classNames.push('changed');
            }
        }
        return {
            className: classNames.join(' '),
            variable,
            style: { color: variable === null || variable === void 0 ? void 0 : variable.color },
            content: iteratee[arrayOffset].toString(16).padStart(2, '0')
        };
    }
    doHandleTableMouseMove(targetSpan) {
        const target = targetSpan instanceof HTMLElement && targetSpan;
        if (target) {
            const { x, y } = target.getBoundingClientRect();
            const anchor = { x: Math.round(x), y: Math.round(y + target.clientHeight) };
            if (target.classList.contains(MemoryTable.EIGHT_BIT_SPAN_CLASS)) {
                const properties = this.getHoverForChunk(target);
                this.hoverRenderer.render(this.node, anchor, properties);
            }
            else if (target.classList.contains(MemoryTable.VARIABLE_LABEL_CLASS)) {
                const properties = this.getHoverForVariable(target);
                this.hoverRenderer.render(this.node, anchor, properties);
            }
            else {
                this.hoverRenderer.hide();
            }
        }
        else {
            this.hoverRenderer.hide();
        }
    }
    getHoverForChunk(span) {
        var _a;
        if (span.classList.contains(MemoryTable.EIGHT_BIT_SPAN_CLASS)) {
            const parentByteContainer = span.parentElement;
            if (parentByteContainer === null || parentByteContainer === void 0 ? void 0 : parentByteContainer.textContent) {
                const hex = (_a = parentByteContainer.textContent) !== null && _a !== void 0 ? _a : '';
                const decimal = parseInt(hex, 16);
                const binary = this.getPaddedBinary(decimal);
                const UTF8 = String.fromCodePoint(decimal);
                return { hex, binary, decimal, UTF8 };
            }
        }
        return undefined;
    }
    getPaddedBinary(decimal) {
        const paddedBinary = decimal.toString(2).padStart(this.options.byteSize, '0');
        let paddedAndSpacedBinary = '';
        for (let i = 8; i <= paddedBinary.length; i += 8) {
            paddedAndSpacedBinary += ` ${paddedBinary.slice(i - 8, i)}`;
        }
        return paddedAndSpacedBinary.trim();
    }
    getHoverForVariable(span) {
        var _a, _b;
        const variable = (_a = this.variableFinder) === null || _a === void 0 ? void 0 : _a.searchForVariable((_b = span.textContent) !== null && _b !== void 0 ? _b : '');
        if (variable === null || variable === void 0 ? void 0 : variable.type) {
            return { type: variable.type };
        }
        return undefined;
    }
    doHandleTableRightClick(event) {
        var _a;
        event.preventDefault();
        const target = event.target;
        if ((_a = target.classList) === null || _a === void 0 ? void 0 : _a.contains('eight-bits')) {
            const { right, top } = target.getBoundingClientRect();
            this.update();
            event.stopPropagation();
            this.contextMenuRenderer.render({
                menuPath: MemoryTableWidget_1.CONTEXT_MENU,
                anchor: { x: right, y: top },
                args: this.getContextMenuArgs(event),
            });
        }
    }
    getContextMenuArgs(event) {
        var _a;
        const args = [this];
        const id = event.target.getAttribute('data-id');
        if (id) {
            const location = (0, util_1.hexStrToUnsignedLong)(id);
            args.push(location);
            const offset = this.memory.address.multiply(-1).add(location);
            const cellAddress = this.memory.address.add(offset.multiply(8 / this.options.byteSize));
            const variableAtLocation = (_a = this.variableFinder) === null || _a === void 0 ? void 0 : _a.searchForVariable(cellAddress);
            args.push(variableAtLocation);
        }
        return args;
    }
};
MemoryTableWidget.CONTEXT_MENU = ['memory.view.context.menu'];
MemoryTableWidget.ID = 'memory-table-widget';
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], MemoryTableWidget.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.inject)(memory_options_widget_1.MemoryOptionsWidget),
    __metadata("design:type", memory_options_widget_1.MemoryOptionsWidget)
], MemoryTableWidget.prototype, "optionsWidget", void 0);
__decorate([
    (0, inversify_1.inject)(memory_provider_service_1.MemoryProviderService),
    __metadata("design:type", memory_provider_service_1.MemoryProviderService)
], MemoryTableWidget.prototype, "memoryProvider", void 0);
__decorate([
    (0, inversify_1.inject)(memory_hover_renderer_1.MemoryHoverRendererService),
    __metadata("design:type", memory_hover_renderer_1.MemoryHoverRendererService)
], MemoryTableWidget.prototype, "hoverRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], MemoryTableWidget.prototype, "contextMenuRenderer", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryTableWidget.prototype, "init", null);
MemoryTableWidget = MemoryTableWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], MemoryTableWidget);
exports.MemoryTableWidget = MemoryTableWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/memory-widget/memory-table-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/memory-widget/memory-widget.js":
/*!**********************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/memory-widget/memory-widget.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MemoryWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryWidget = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const memory_widget_utils_1 = __webpack_require__(/*! ../utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const memory_options_widget_1 = __webpack_require__(/*! ./memory-options-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-options-widget.js");
const memory_table_widget_1 = __webpack_require__(/*! ./memory-table-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-table-widget.js");
let MemoryWidget = MemoryWidget_1 = class MemoryWidget extends browser_1.BaseWidget {
    static createWidget(parent, optionsWidget, tableWidget, optionSymbol = memory_widget_utils_1.MemoryWidgetOptions, options) {
        const child = MemoryWidget_1.createContainer(parent, optionsWidget, tableWidget, optionSymbol, options);
        return child.get(MemoryWidget_1);
    }
    static createContainer(parent, optionsWidget, tableWidget, optionSymbol = memory_widget_utils_1.MemoryWidgetOptions, options) {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = parent;
        child.bind(optionsWidget).toSelf();
        child.bind(tableWidget).toSelf();
        child.bind(memory_widget_utils_1.MemoryWidgetOptions).toConstantValue(options);
        if (optionsWidget !== memory_options_widget_1.MemoryOptionsWidget) {
            child.bind(memory_options_widget_1.MemoryOptionsWidget).toService(optionsWidget);
        }
        if (tableWidget !== memory_table_widget_1.MemoryTableWidget) {
            child.bind(memory_table_widget_1.MemoryTableWidget).toService(tableWidget);
        }
        if (optionSymbol !== memory_widget_utils_1.MemoryWidgetOptions) {
            child.bind(optionSymbol).toConstantValue(options);
        }
        child.bind(MemoryWidget_1).toSelf();
        return child;
    }
    static getIdentifier(optionsWidgetID) {
        return `${MemoryWidget_1.ID}-${optionsWidgetID}`;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.id = MemoryWidget_1.getIdentifier(this.memoryWidgetOptions.identifier.toString());
        this.addClass(MemoryWidget_1.ID);
        this.title.label = this.optionsWidget.title.label;
        this.title.caption = this.optionsWidget.title.caption;
        this.title.iconClass = this.optionsWidget.title.iconClass;
        this.title.closable = this.optionsWidget.title.closable;
        const layout = this.layout = new browser_1.PanelLayout();
        layout.addWidget(this.optionsWidget);
        layout.addWidget(this.tableWidget);
        this.toDispose.pushAll([
            this.layout,
            this.optionsWidget,
            this.tableWidget,
        ]);
        this.optionsWidget.title.changed.connect(title => {
            this.title.label = title.label;
            this.title.caption = title.caption;
            this.title.iconClass = title.iconClass;
        });
    }
    onActivateRequest() {
        this.optionsWidget.activate();
    }
};
MemoryWidget.ID = 'memory-view-wrapper';
MemoryWidget.LABEL = core_1.nls.localize('theia/memory-inspector/memoryTitle', 'Memory');
__decorate([
    (0, inversify_1.inject)(memory_widget_utils_1.MemoryWidgetOptions),
    __metadata("design:type", Object)
], MemoryWidget.prototype, "memoryWidgetOptions", void 0);
__decorate([
    (0, inversify_1.inject)(memory_options_widget_1.MemoryOptionsWidget),
    __metadata("design:type", Object)
], MemoryWidget.prototype, "optionsWidget", void 0);
__decorate([
    (0, inversify_1.inject)(memory_table_widget_1.MemoryTableWidget),
    __metadata("design:type", Object)
], MemoryWidget.prototype, "tableWidget", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryWidget.prototype, "init", null);
MemoryWidget = MemoryWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], MemoryWidget);
exports.MemoryWidget = MemoryWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/memory-widget/memory-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/register-widget/register-filter-service.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/register-widget/register-filter-service.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
exports.RegisterFilterServiceImpl = exports.RegisterFilterServiceOptions = exports.RegisterFilterService = exports.AllOrCustom = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
var AllOrCustom;
(function (AllOrCustom) {
    AllOrCustom["All"] = "All";
    AllOrCustom["Custom"] = "Custom";
})(AllOrCustom = exports.AllOrCustom || (exports.AllOrCustom = {}));
exports.RegisterFilterService = Symbol('RegisterFilterService');
exports.RegisterFilterServiceOptions = Symbol('RegisterFilterServiceOptions');
let RegisterFilterServiceImpl = class RegisterFilterServiceImpl {
    constructor() {
        this.filters = new Map();
        this.currentFilter = AllOrCustom.All;
    }
    get filterLabels() {
        return [...this.filters.keys()];
    }
    get currentFilterLabel() {
        return this.currentFilter;
    }
    init() {
        this.filters.set(AllOrCustom.All, undefined);
        this.filters.set(AllOrCustom.Custom, new Set());
        for (const [key, values] of Object.entries(this.options)) {
            this.filters.set(key, new Set(values));
        }
    }
    setFilter(filterLabel) {
        if (this.filters.has(filterLabel)) {
            this.currentFilter = filterLabel;
        }
    }
    shouldDisplayRegister(registerName) {
        const currentFilter = this.filters.get(this.currentFilter);
        return !currentFilter || currentFilter.has(registerName);
    }
    currentFilterRegisters() {
        const currentFilterRegisters = this.filters.get(this.currentFilter);
        return currentFilterRegisters ? Array.from(currentFilterRegisters) : [];
    }
};
__decorate([
    (0, inversify_1.inject)(exports.RegisterFilterServiceOptions),
    __metadata("design:type", Object)
], RegisterFilterServiceImpl.prototype, "options", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RegisterFilterServiceImpl.prototype, "init", null);
RegisterFilterServiceImpl = __decorate([
    (0, inversify_1.injectable)()
], RegisterFilterServiceImpl);
exports.RegisterFilterServiceImpl = RegisterFilterServiceImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/register-widget/register-filter-service'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/register-widget/register-options-widget.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/register-widget/register-options-widget.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
exports.RegisterOptionsWidget = exports.REGISTER_PRE_SETS_ID = exports.REGISTER_RADIX_ID = exports.REGISTER_FIELD_ID = exports.EMPTY_REGISTERS = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const debug_session_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const memory_options_widget_1 = __webpack_require__(/*! ../memory-widget/memory-options-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-options-widget.js");
const memory_widget_components_1 = __webpack_require__(/*! ../utils/memory-widget-components */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-components.js");
const memory_widget_utils_1 = __webpack_require__(/*! ../utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const memory_widget_variable_utils_1 = __webpack_require__(/*! ../utils/memory-widget-variable-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-variable-utils.js");
const multi_select_bar_1 = __webpack_require__(/*! ../utils/multi-select-bar */ "../../packages/memory-inspector/lib/browser/utils/multi-select-bar.js");
const register_filter_service_1 = __webpack_require__(/*! ./register-filter-service */ "../../packages/memory-inspector/lib/browser/register-widget/register-filter-service.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
exports.EMPTY_REGISTERS = {
    threadId: undefined,
    registers: [],
};
exports.REGISTER_FIELD_ID = 't-mv-register';
exports.REGISTER_RADIX_ID = 't-mv-radix';
exports.REGISTER_PRE_SETS_ID = 't-mv-pre-set';
let RegisterOptionsWidget = class RegisterOptionsWidget extends memory_options_widget_1.MemoryOptionsWidget {
    constructor() {
        super(...arguments);
        this.iconClass = 'register-view-icon';
        this.lockIconClass = 'register-lock-icon';
        this.LABEL_PREFIX = core_1.nls.localize('theia/memory-inspector/register', 'Register');
        this.onRegisterChangedEmitter = new core_1.Emitter();
        this.onRegisterChanged = this.onRegisterChangedEmitter.event;
        this.registerReadResult = exports.EMPTY_REGISTERS;
        this.registerDisplaySet = new Set();
        this.registerDisplayAll = true;
        this.registerFilterUpdate = false;
        this.registerReadError = core_1.nls.localize('theia/memory-inspector/register/readError', 'No Registers currently available.');
        this.showRegisterError = false;
        this.noRadixColumnDisplayed = this.noRadixDisplayed();
        this.columnsDisplayed = {
            register: {
                label: core_1.nls.localize('theia/memory-inspector/register', 'Register'),
                doRender: true
            },
            hexadecimal: {
                label: core_1.nls.localize('theia/memory-inspector/hexadecimal', 'Hexadecimal'),
                doRender: true
            },
            decimal: {
                label: core_1.nls.localize('theia/memory-inspector/decimal', 'Decimal'),
                doRender: false
            },
            octal: {
                label: core_1.nls.localize('theia/memory-inspector/octal', 'Octal'),
                doRender: false
            },
            binary: {
                label: core_1.nls.localize('theia/memory-inspector/binary', 'Binary'),
                doRender: false
            },
        };
        this.assignRegisterRef = reg => {
            this.registerField = reg !== null && reg !== void 0 ? reg : undefined;
        };
        this.setRegFilterFromSelect = (e) => {
            if (this.registerField) {
                this.registerField.value = e.target.value;
            }
        };
        this.updateRegisterView = debounce(this.doUpdateRegisterView.bind(this), memory_widget_utils_1.Constants.DEBOUNCE_TIME, { trailing: true });
        this.doRefresh = (event) => {
            if ('key' in event && event.key !== 'Enter') {
                return;
            }
            this.registerFilterUpdate = true;
            this.updateRegisterView();
        };
        this.doShowRegisterErrors = (doClearError = false) => {
            if (this.errorTimeout !== undefined) {
                clearTimeout(this.errorTimeout);
            }
            if (doClearError) {
                this.showRegisterError = false;
                this.update();
                this.errorTimeout = undefined;
                return;
            }
            this.showRegisterError = true;
            this.update();
            this.errorTimeout = setTimeout(() => {
                this.showRegisterError = false;
                this.update();
                this.errorTimeout = undefined;
            }, memory_widget_utils_1.Constants.ERROR_TIMEOUT);
        };
    }
    get registers() {
        return {
            ...this.registerReadResult,
        };
    }
    get options() {
        return this.storeState();
    }
    displayReg(element) {
        return this.registerDisplayAll ||
            this.registerDisplaySet.has(element);
    }
    handleRadixRendering(regVal, radix, _regName) {
        // check if too big for integer
        const bInt = BigInt(regVal);
        return bInt.toString(radix);
    }
    init() {
        this.addClass(memory_options_widget_1.MemoryOptionsWidget.ID);
        this.addClass('reg-options-widget');
        this.title.label = `${this.LABEL_PREFIX} (${this.memoryWidgetOptions.identifier})`;
        this.title.caption = `${this.LABEL_PREFIX} (${this.memoryWidgetOptions.identifier})`;
        this.title.iconClass = this.iconClass;
        this.title.closable = true;
        if (this.memoryWidgetOptions.dynamic !== false) {
            this.toDispose.push(this.sessionManager.onDidChangeActiveDebugSession(({ current }) => {
                this.setUpListeners(current);
            }));
            this.toDispose.push(this.sessionManager.onDidCreateDebugSession(current => {
                this.setUpListeners(current);
            }));
            this.setUpListeners(this.sessionManager.currentSession);
        }
        this.toDispose.push(this.onOptionsChanged(() => this.update()));
        this.update();
    }
    setRegAndUpdate(regName) {
        this.handleRegFromDebugWidgetSelection(regName);
    }
    setUpListeners(session) {
        this.sessionListeners.dispose();
        this.sessionListeners = new core_1.DisposableCollection(core_1.Disposable.create(() => this.handleActiveSessionChange()));
        if (session) {
            this.sessionListeners.push(session.onDidChange(() => this.handleSessionChange()));
        }
    }
    handleActiveSessionChange() {
        const isDynamic = this.memoryWidgetOptions.dynamic !== false;
        if (isDynamic && this.doUpdateAutomatically) {
            this.registerReadResult = exports.EMPTY_REGISTERS;
            this.fireDidChangeRegister();
        }
    }
    handleSessionChange() {
        var _a, _b;
        const debugState = (_a = this.sessionManager.currentSession) === null || _a === void 0 ? void 0 : _a.state;
        if (debugState === debug_session_1.DebugState.Inactive) {
            this.registerReadResult = exports.EMPTY_REGISTERS;
            this.fireDidChangeRegister();
        }
        else if (debugState === debug_session_1.DebugState.Stopped) {
            const isReadyForQuery = !!((_b = this.sessionManager.currentSession) === null || _b === void 0 ? void 0 : _b.currentFrame);
            const isDynamic = this.memoryWidgetOptions.dynamic !== false;
            if (isReadyForQuery && isDynamic && this.doUpdateAutomatically && this.registerReadResult !== exports.EMPTY_REGISTERS) {
                this.updateRegisterView();
            }
        }
    }
    acceptFocus() {
        if (this.doUpdateAutomatically) {
            if (this.registerField) {
                this.registerField.focus();
                this.registerField.select();
            }
        }
        else {
            const multiSelectBar = this.node.querySelector('.multi-select-bar');
            multiSelectBar === null || multiSelectBar === void 0 ? void 0 : multiSelectBar.focus();
        }
    }
    radixDisplayed() {
        const { register, ...radices } = this.columnsDisplayed;
        for (const val of Object.values(radices)) {
            if (val['doRender']) {
                return true;
            }
        }
        return false;
    }
    noRadixDisplayed() {
        return !this.radixDisplayed();
    }
    renderRegisterFieldGroup() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: 't-mv-group view-group' },
                React.createElement(memory_widget_components_1.MWInputWithSelect, { id: exports.REGISTER_FIELD_ID, label: core_1.nls.localize('theia/memory-inspector/registers', 'Registers'), placeholder: core_1.nls.localize('theia/memory-inspector/register-widget/filter-placeholder', 'Filter (starts with)'), onSelectChange: this.setRegFilterFromSelect, passRef: this.assignRegisterRef, onKeyDown: this.doRefresh, options: [...this.recentLocations.values], disabled: !this.doUpdateAutomatically }),
                React.createElement(multi_select_bar_1.MWMultiSelect, { id: memory_options_widget_1.ASCII_TOGGLE_ID, label: core_1.nls.localize('theia/memory-inspector/columns', 'Columns'), items: this.getOptionalColumns().map(column => ({ ...column, label: column.label.slice(0, 3) })), onSelectionChanged: this.handleColumnSelectionChange }),
                React.createElement("button", { type: 'button', className: 'theia-button main view-group-go-button', onClick: this.doRefresh, disabled: !this.doUpdateAutomatically }, core_1.nls.localizeByDefault('Go'))),
            React.createElement("div", { className: `t-mv-memory-fetch-error${this.showRegisterError ? ' show' : ' hide'}` }, this.registerReadError)));
    }
    doHandleColumnSelectionChange(columnLabel, doShow) {
        const trueColumnLabel = Object.keys(this.columnsDisplayed).find(key => key.startsWith(columnLabel));
        if (trueColumnLabel) {
            super.doHandleColumnSelectionChange(trueColumnLabel, doShow);
        }
    }
    getObligatoryColumnIds() {
        return ['register'];
    }
    renderInputContainer() {
        return (React.createElement("div", { className: 't-mv-settings-container' },
            React.createElement("div", { className: 't-mv-wrapper' },
                this.renderToolbar(),
                this.renderRegisterFieldGroup())));
    }
    handleRegFromDebugWidgetSelection(regName) {
        this.registerDisplaySet.clear();
        if (this.registerField) {
            this.registerField.value = regName;
            this.registerDisplayAll = false;
        }
        this.doUpdateRegisterView();
    }
    renderToolbar() {
        return (React.createElement("div", { className: 'memory-widget-toolbar' },
            this.memoryWidgetOptions.dynamic !== false && (React.createElement("div", { className: 'memory-widget-auto-updates-container' },
                React.createElement("div", { className: `fa fa-${this.doUpdateAutomatically ? 'unlock' : 'lock'}`, id: memory_options_widget_1.AUTO_UPDATE_TOGGLE_ID, title: this.doUpdateAutomatically ?
                        core_1.nls.localize('theia/memory-inspector/register/freeze', 'Freeze memory view') :
                        core_1.nls.localize('theia/memory-inspector/register/unfreeze', 'Unfreeze memory view'), onClick: this.toggleAutoUpdate, onKeyDown: this.toggleAutoUpdate, role: 'button', tabIndex: 0 }))),
            this.renderEditableTitleField()));
    }
    validateInputRegs(input) {
        var _a;
        // identify sequences of alphanumeric characters
        const searchTexts = (_a = input.match(/\w+/g)) !== null && _a !== void 0 ? _a : [];
        if (searchTexts.length !== 0) {
            this.registerDisplayAll = false;
            this.registerDisplaySet.clear();
            this.recentLocations.add(input);
            for (const { name } of this.registerReadResult.registers) {
                if (searchTexts.some(x => name.startsWith(x))) {
                    this.registerDisplaySet.add(name);
                }
            }
        }
        else {
            this.registerDisplayAll = true;
            this.registerDisplaySet.clear();
        }
    }
    async doUpdateRegisterView() {
        var _a;
        try {
            if (!this.registerReadResult.registers || this.registerReadResult.threadId !== ((_a = this.sessionManager.currentThread) === null || _a === void 0 ? void 0 : _a.id)) {
                this.registerReadResult = await this.getRegisters();
            }
            this.updateRegDisplayFilter();
            this.fireDidChangeRegister();
            this.doShowRegisterErrors(true);
        }
        catch (err) {
            this.registerReadError = core_1.nls.localize('theia/memory-inspector/registerReadError', 'There was an error fetching registers.');
            console.error('Failed to read registers', err);
            this.doShowRegisterErrors();
        }
        finally {
            this.registerFilterUpdate = false;
            this.update();
        }
    }
    updateRegDisplayFilter() {
        if (this.registerField) {
            if (this.registerField.value.length === 0) {
                this.registerDisplayAll = true;
            }
            else {
                this.validateInputRegs(this.registerField.value);
            }
        }
    }
    async getRegisters() {
        var _a, _b;
        const regResult = await (0, memory_widget_variable_utils_1.getRegisters)(this.sessionManager.currentSession);
        const threadResult = (_b = (_a = this.sessionManager.currentSession) === null || _a === void 0 ? void 0 : _a.currentThread) === null || _b === void 0 ? void 0 : _b.id;
        return { threadId: threadResult, registers: regResult };
    }
    fireDidChangeRegister() {
        this.onRegisterChangedEmitter.fire([this.registerReadResult, this.registerFilterUpdate]);
    }
    storeState() {
        var _a, _b;
        return {
            ...super.storeState(),
            reg: (_b = (_a = this.registerField) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : this.reg,
            noRadixColumnDisplayed: this.noRadixDisplayed(),
        };
    }
    restoreState(oldState) {
        var _a;
        this.reg = (_a = oldState.reg) !== null && _a !== void 0 ? _a : this.reg;
        this.noRadixColumnDisplayed = oldState.noRadixColumnDisplayed;
    }
};
__decorate([
    (0, inversify_1.inject)(memory_widget_utils_1.RegisterWidgetOptions),
    __metadata("design:type", Object)
], RegisterOptionsWidget.prototype, "memoryWidgetOptions", void 0);
__decorate([
    (0, inversify_1.inject)(register_filter_service_1.RegisterFilterService),
    __metadata("design:type", Object)
], RegisterOptionsWidget.prototype, "filterService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RegisterOptionsWidget.prototype, "init", null);
RegisterOptionsWidget = __decorate([
    (0, inversify_1.injectable)()
], RegisterOptionsWidget);
exports.RegisterOptionsWidget = RegisterOptionsWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/register-widget/register-options-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/register-widget/register-table-widget.js":
/*!********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/register-widget/register-table-widget.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
exports.RegisterTableWidget = exports.RegisterTable = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const memory_options_widget_1 = __webpack_require__(/*! ../memory-widget/memory-options-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-options-widget.js");
const memory_table_widget_1 = __webpack_require__(/*! ../memory-widget/memory-table-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-table-widget.js");
const register_options_widget_1 = __webpack_require__(/*! ./register-options-widget */ "../../packages/memory-inspector/lib/browser/register-widget/register-options-widget.js");
var RegisterTable;
(function (RegisterTable) {
    RegisterTable.ROW_CLASS = 't-mv-view-row';
    RegisterTable.ROW_DIVIDER_CLASS = 't-mv-view-row-highlight';
    RegisterTable.REGISTER_NAME_CLASS = 't-mv-view-address';
    RegisterTable.REGISTER_DATA_CLASS = 't-mv-view-data';
    RegisterTable.EXTRA_COLUMN_DATA_CLASS = 't-mv-view-code';
    RegisterTable.HEADER_ROW_CLASS = 't-mv-header';
})(RegisterTable = exports.RegisterTable || (exports.RegisterTable = {}));
class RegisterTableWidget extends memory_table_widget_1.MemoryTableWidget {
    constructor() {
        super(...arguments);
        this.registerNotSaved = '<not saved>';
        this.memory = { ...memory_options_widget_1.EMPTY_MEMORY, variables: [] };
        this.handleRowKeyDown = (event) => {
            var _a;
            const keyCode = (_a = browser_1.KeyCode.createKeyCode(event.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode;
            switch (keyCode) {
                case browser_1.Key.ENTER.keyCode:
                    this.openDebugVariableByCurrentTarget(event);
                    break;
                default:
                    break;
            }
        };
        this.openDebugVariableByCurrentTarget = (event) => {
            this.openDebugVariableByDataId(event.currentTarget);
        };
    }
    async doInit() {
        this.id = RegisterTableWidget.ID;
        this.addClass(RegisterTableWidget.ID);
        this.scrollOptions = { ...this.scrollOptions, suppressScrollX: false };
        this.toDispose.push(this.optionsWidget.onOptionsChanged(optionId => this.handleOptionChange(optionId)));
        this.toDispose.push(this.optionsWidget.onRegisterChanged(e => this.handleRegisterChange(e)));
        this.toDispose.push(this.themeService.onDidColorThemeChange(e => this.handleThemeChange(e)));
        this.getStateAndUpdate();
    }
    handleSetValue(dVar) {
        if (dVar) {
            dVar.open();
        }
    }
    handleRegisterChange(newRegister) {
        const regResult = newRegister[0];
        const updatePrevRegs = !newRegister[1];
        if (this.registers.threadId !== regResult.threadId) {
            // if not same thread Id, dont highlighting register changes
            this.previousRegisters = undefined;
        }
        else {
            if (updatePrevRegs) {
                this.previousRegisters = this.registers;
            }
        }
        this.getStateAndUpdate();
    }
    getState() {
        this.options = this.optionsWidget.options;
        this.registers = this.optionsWidget.registers;
    }
    getTableRows() {
        return [...this.renderRegRows()];
    }
    *renderRegRows(result = this.registers) {
        let rowsYielded = 0;
        // For each row...
        for (const reg of result.registers) {
            if (this.optionsWidget.displayReg(reg.name)) {
                const notSaved = reg.value === this.registerNotSaved;
                const isChanged = this.previousRegisters && reg.value !== this.getPrevRegVal(reg.name, this.previousRegisters);
                const options = {
                    regName: reg.name,
                    regVal: reg.value,
                    hexadecimal: notSaved ? reg.value : this.optionsWidget.handleRadixRendering(reg.value, 16, reg.name),
                    decimal: notSaved ? reg.value : this.optionsWidget.handleRadixRendering(reg.value, 10),
                    octal: notSaved ? reg.value : this.optionsWidget.handleRadixRendering(reg.value, 8),
                    binary: notSaved ? reg.value : this.optionsWidget.handleRadixRendering(reg.value, 2, reg.name),
                    doShowDivider: (rowsYielded % 4) === 3,
                    isChanged,
                };
                yield this.renderRegRow(options);
                rowsYielded += 1;
            }
        }
    }
    getPrevRegVal(regName, inRegs) {
        var _a;
        return (_a = inRegs.registers.find(element => element.name === regName)) === null || _a === void 0 ? void 0 : _a.value;
    }
    renderRegRow(options, getRowAttributes = this.getRowAttributes.bind(this)) {
        var _a;
        const { regName } = options;
        const { className, style, title } = getRowAttributes(options);
        return (React.createElement("tr", { 
            // Add a marker to help visual navigation when scrolling
            className: className, style: style, title: title, key: regName, "data-id": regName, "data-value": (_a = options.decimal) !== null && _a !== void 0 ? _a : 'none', tabIndex: 0, onKeyDown: this.handleRowKeyDown, onContextMenu: this.options.isFrozen ? undefined : this.handleTableRightClick, onDoubleClick: this.options.isFrozen ? undefined : this.openDebugVariableByCurrentTarget },
            React.createElement("td", { className: RegisterTable.REGISTER_NAME_CLASS }, regName),
            this.getExtraRegColumn(options)));
    }
    getRowAttributes(options) {
        let className = RegisterTable.ROW_CLASS;
        if (options.doShowDivider) {
            className += ` ${RegisterTable.ROW_DIVIDER_CLASS}`;
        }
        if (options.isChanged) {
            // use the eight-bits change CSS class
            className += ' eight-bits changed';
        }
        return { className };
    }
    getExtraRegColumn(options) {
        const additionalColumns = [];
        if (this.options.columnsDisplayed.hexadecimal.doRender) {
            additionalColumns.push(React.createElement("td", { className: RegisterTable.EXTRA_COLUMN_DATA_CLASS, key: 'hexadecimal' }, options.hexadecimal));
        }
        if (this.options.columnsDisplayed.decimal.doRender) {
            additionalColumns.push(React.createElement("td", { className: RegisterTable.EXTRA_COLUMN_DATA_CLASS, key: 'decimal' }, options.decimal));
        }
        if (this.options.columnsDisplayed.octal.doRender) {
            additionalColumns.push(React.createElement("td", { className: RegisterTable.EXTRA_COLUMN_DATA_CLASS, key: 'octal' }, options.octal));
        }
        if (this.options.columnsDisplayed.binary.doRender) {
            additionalColumns.push(React.createElement("td", { className: RegisterTable.EXTRA_COLUMN_DATA_CLASS, key: 'binary' }, options.binary));
        }
        return additionalColumns;
    }
    getWrapperHandlers() {
        return this.options.isFrozen || this.options.noRadixColumnDisplayed
            ? super.getWrapperHandlers()
            : {
                onMouseMove: this.handleTableMouseMove,
                onContextMenu: this.handleTableRightClick,
            };
    }
    doHandleTableMouseMove(targetElement) {
        var _a;
        const tempTarget = targetElement;
        const target = ((_a = tempTarget.parentElement) === null || _a === void 0 ? void 0 : _a.tagName) === 'TR' ? tempTarget.parentElement : tempTarget;
        if (target.tagName === 'TR') {
            const { x, y } = target.getBoundingClientRect();
            const anchor = { x: Math.round(x), y: Math.round(y + target.clientHeight) };
            const value = Number(target.getAttribute('data-value'));
            if (!isNaN(value)) {
                const register = target.getAttribute('data-id');
                const properties = {
                    register,
                    hex: `0x${value.toString(16)}`,
                    binary: `0b${value.toString(2)}`,
                    decimal: value.toString(10),
                    octal: `0o${value.toString(8)}`,
                };
                return this.hoverRenderer.render(this.node, anchor, properties);
            }
        }
        return this.hoverRenderer.hide();
    }
    openDebugVariableByDataId(element) {
        const registerName = element.getAttribute('data-id');
        if (registerName) {
            this.openDebugVariableByName(registerName);
        }
    }
    openDebugVariableByName(registerName) {
        const debugVariable = this.registers.registers.find(element => element.name === registerName);
        this.handleSetValue(debugVariable);
    }
    doHandleTableRightClick(event) {
        event.preventDefault();
        const curTarget = event.currentTarget;
        if (curTarget.tagName === 'TR') {
            this.update();
            event.stopPropagation();
            this.contextMenuRenderer.render({
                menuPath: RegisterTableWidget.CONTEXT_MENU,
                anchor: event.nativeEvent,
                args: this.getContextMenuArgs(event),
            });
        }
    }
    getContextMenuArgs(event) {
        const args = [this];
        const regName = event.currentTarget.getAttribute('data-id');
        if (regName) {
            const dVar = this.registers.registers.find(element => element.name === regName);
            args.push(dVar);
        }
        return args;
    }
}
RegisterTableWidget.CONTEXT_MENU = ['register.view.context.menu'];
RegisterTableWidget.ID = 'register-table-widget';
__decorate([
    (0, inversify_1.inject)(register_options_widget_1.RegisterOptionsWidget),
    __metadata("design:type", register_options_widget_1.RegisterOptionsWidget)
], RegisterTableWidget.prototype, "optionsWidget", void 0);
exports.RegisterTableWidget = RegisterTableWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/register-widget/register-table-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/register-widget/register-widget-types.js":
/*!********************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/register-widget/register-widget-types.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterWidget = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const memory_widget_1 = __webpack_require__(/*! ../memory-widget/memory-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-widget.js");
const memory_widget_utils_1 = __webpack_require__(/*! ../utils/memory-widget-utils */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js");
const register_filter_service_1 = __webpack_require__(/*! ./register-filter-service */ "../../packages/memory-inspector/lib/browser/register-widget/register-filter-service.js");
const register_options_widget_1 = __webpack_require__(/*! ./register-options-widget */ "../../packages/memory-inspector/lib/browser/register-widget/register-options-widget.js");
var RegisterWidget;
(function (RegisterWidget) {
    RegisterWidget.ID = 'register-view-options-widget';
    RegisterWidget.LABEL = core_1.nls.localize('theia/memory-inspector/register', 'Register');
    RegisterWidget.is = (widget) => widget.optionsWidget instanceof register_options_widget_1.RegisterOptionsWidget;
    RegisterWidget.createContainer = (parent, optionsWidget, tableWidget, optionSymbol = memory_widget_utils_1.MemoryWidgetOptions, options) => {
        const child = memory_widget_1.MemoryWidget.createContainer(parent, optionsWidget, tableWidget, optionSymbol, options);
        child.bind(register_filter_service_1.RegisterFilterService).to(register_filter_service_1.RegisterFilterServiceImpl).inSingletonScope();
        child.bind(register_filter_service_1.RegisterFilterServiceOptions).toConstantValue({});
        return child;
    };
})(RegisterWidget = exports.RegisterWidget || (exports.RegisterWidget = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/register-widget/register-widget-types'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/utils/memory-commands.js":
/*!****************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/utils/memory-commands.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToggleDiffSelectWidgetVisibilityCommand = exports.RegisterSetVariableCommand = exports.CreateNewRegisterViewCommand = exports.FollowPointerDebugCommand = exports.FollowPointerTableCommand = exports.CreateNewMemoryViewCommand = exports.ResetModifiedCellCommand = exports.ViewVariableInRegisterViewCommand = exports.ViewVariableInMemoryCommand = exports.MemoryCategory = exports.MemoryCommand = void 0;
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.MemoryCommand = { id: 'memory-inspector-command' };
exports.MemoryCategory = nls_1.nls.localize('theia/memory-inspector/memoryCategory', 'Memory Inspector');
exports.ViewVariableInMemoryCommand = {
    id: 'view-variable-in-memory',
    category: exports.MemoryCategory,
    label: nls_1.nls.localize('theia/memory-inspector/command/viewVariable', 'Show Variable in Memory Inspector'),
};
exports.ViewVariableInRegisterViewCommand = {
    id: 'view-variable-in-register-view',
    category: exports.MemoryCategory,
    label: nls_1.nls.localize('theia/memory-inspector/command/showRegister', 'Show Register in Memory Inspector'),
};
exports.ResetModifiedCellCommand = {
    id: 'reset-modified-cell',
    category: exports.MemoryCategory,
    label: nls_1.nls.localize('theia/memory-inspector/command/resetValue', 'Reset Value'),
};
exports.CreateNewMemoryViewCommand = {
    id: 'create-new-memory-view',
    category: exports.MemoryCategory,
    label: nls_1.nls.localize('theia/memory-inspector/command/createNewMemory', 'Create New Memory Inspector'),
    iconClass: 'memory-view-icon toolbar',
};
exports.FollowPointerTableCommand = {
    id: 'follow-pointer-table',
    category: exports.MemoryCategory,
    label: nls_1.nls.localize('theia/memory-inspector/command/followPointer', 'Follow Pointer'),
};
exports.FollowPointerDebugCommand = {
    id: 'follow-pointer-debug',
    category: exports.MemoryCategory,
    label: nls_1.nls.localize('theia/memory-inspector/command/followPointerMemory', 'Follow Pointer in Memory Inspector'),
};
exports.CreateNewRegisterViewCommand = {
    id: 'create-new-register-view',
    category: exports.MemoryCategory,
    label: nls_1.nls.localize('theia/memory-inspector/command/createNewRegisterView', 'Create New Register View'),
    iconClass: 'register-view-icon toolbar',
};
exports.RegisterSetVariableCommand = {
    id: 'register-set-variable-value',
    category: exports.MemoryCategory,
    label: nls_1.nls.localizeByDefault('Set Value')
};
exports.ToggleDiffSelectWidgetVisibilityCommand = {
    id: 'toggle-diff-select-visibility',
    iconClass: 'codicon codicon-git-compare',
};

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/utils/memory-commands'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/utils/memory-hover-renderer.js":
/*!**********************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/utils/memory-hover-renderer.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
exports.MemoryHoverRendererService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let MemoryHoverRendererService = class MemoryHoverRendererService {
    constructor() {
        this.isShown = false;
        this.closeIfHoverOff = (e) => {
            const { target } = e;
            if (!(target instanceof HTMLElement)) {
                return;
            }
            if (!this.currentRenderContainer.contains(target) && !this.container.contains(target)) {
                this.hide();
            }
        };
        this.container = document.createElement('div');
        this.container.classList.add('t-mv-hover', 'hidden');
        document.body.appendChild(this.container);
    }
    render(container, anchor, properties) {
        this.clearAll();
        if (!this.isShown) {
            document.addEventListener('mousemove', this.closeIfHoverOff);
            this.currentRenderContainer = container;
        }
        if (properties) {
            for (const [key, value] of Object.entries(properties)) {
                const label = key.toLowerCase().replace(/[\W]/g, '-');
                const keySpan = document.createElement('span');
                keySpan.classList.add('t-mv-hover-key', label);
                keySpan.textContent = `${key}:`;
                const valueSpan = document.createElement('span');
                valueSpan.classList.add('t-mv-hover-value', label);
                // stringify as decimal number by default.
                valueSpan.textContent = value.toString(10);
                this.container.appendChild(keySpan);
                this.container.appendChild(valueSpan);
            }
        }
        if (this.container.children.length) {
            this.show(anchor);
            this.isShown = true;
        }
        else {
            this.hide();
        }
    }
    hide() {
        if (this.isShown) {
            document.removeEventListener('mousemove', this.closeIfHoverOff);
            this.container.classList.add('hidden');
            this.isShown = false;
        }
    }
    show({ x, y }) {
        this.container.classList.remove('hidden');
        this.container.style.top = `${y}px`;
        this.container.style.left = `${x}px`;
        setTimeout(() => this.checkNotOffScreen());
    }
    checkNotOffScreen() {
        var _a;
        const left = parseInt(((_a = this.container.style.left) !== null && _a !== void 0 ? _a : '').replace('px', ''));
        const width = this.container.clientWidth;
        const overflow = left + width - document.body.clientWidth;
        if (overflow > 0) {
            const safeLeft = Math.round(left - overflow);
            this.container.style.left = `${safeLeft}px`;
        }
    }
    clearAll() {
        let toRemove = this.container.lastChild;
        while (toRemove) {
            this.container.removeChild(toRemove);
            toRemove = this.container.lastChild;
        }
    }
    dispose() {
        this.container.remove();
    }
};
MemoryHoverRendererService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], MemoryHoverRendererService);
exports.MemoryHoverRendererService = MemoryHoverRendererService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/utils/memory-hover-renderer'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/utils/memory-recents.js":
/*!***************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/utils/memory-recents.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Recents = void 0;
class Recents {
    constructor(initialValues, opts) {
        var _a;
        this._values = [];
        this.maxValues = (_a = opts === null || opts === void 0 ? void 0 : opts.maxValues) !== null && _a !== void 0 ? _a : 10;
        if (initialValues) {
            if (initialValues.length <= this.maxValues) {
                this._values = initialValues;
                return;
            }
            console.error('Initial values length is greater than allowed length, resetting to empty array');
        }
        this._values = [];
    }
    get values() {
        return this._values;
    }
    add(locationString) {
        const indexOf = this.has(locationString);
        if (indexOf > -1) {
            this._values.splice(indexOf, 1);
        }
        else {
            if (this._values.length === this.maxValues) {
                this._values.shift();
            }
        }
        this._values.push(locationString);
    }
    has(locationString) {
        return this._values.indexOf(locationString);
    }
}
exports.Recents = Recents;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/utils/memory-recents'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/utils/memory-widget-components.js":
/*!*************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/utils/memory-widget-components.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MWMoreMemorySelect = exports.MWInputWithSelect = exports.MWSelectWithName = exports.MWSelect = exports.MWInput = exports.MWLabel = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const MWLabel = ({ id, label, disabled, classNames }) => {
    const additionalClassNames = classNames ? classNames.join(' ') : '';
    return React.createElement("label", { htmlFor: id, className: `t-mv-label theia-header no-select ${additionalClassNames}${disabled ? ' disabled' : ''}` }, label);
};
exports.MWLabel = MWLabel;
const MWInput = ({ id, label, passRef, defaultValue, onChange, title, onKeyDown, disabled }) => (React.createElement(React.Fragment, null,
    React.createElement(exports.MWLabel, { id: id, label: label, disabled: disabled }),
    React.createElement("input", { tabIndex: 0, type: 'text', ref: passRef, id: id, className: 'theia-input t-mv-input', defaultValue: defaultValue, onChange: onChange, onKeyDown: onKeyDown, title: title, spellCheck: false, disabled: disabled })));
exports.MWInput = MWInput;
const MWSelect = ({ id, label, options, passRef, onChange, title, value, disabled }) => (React.createElement(React.Fragment, null,
    React.createElement(exports.MWLabel, { id: id, label: label, disabled: disabled }),
    React.createElement("select", { tabIndex: 0, ref: passRef, id: id, className: 'theia-select t-mv-select', value: value, onChange: onChange, title: title, disabled: disabled }, options.map(option => React.createElement("option", { value: option, key: option }, option)))));
exports.MWSelect = MWSelect;
const MWSelectWithName = ({ id, label, options, passRef, onChange, title, value, disabled }) => (React.createElement(React.Fragment, null,
    React.createElement(exports.MWLabel, { id: id, label: label, disabled: disabled }),
    React.createElement("select", { tabIndex: 0, ref: passRef, id: id, className: 'theia-select', value: value, onChange: onChange, title: title, disabled: disabled }, options.map(option => React.createElement("option", { value: option[0], key: option[0] }, option[1])))));
exports.MWSelectWithName = MWSelectWithName;
const MWInputWithSelect = ({ id, label, passRef, onKeyDown, title, options, onSelectChange, defaultValue, disabled, placeholder }) => (React.createElement(React.Fragment, null,
    React.createElement(exports.MWLabel, { id: id, label: label, disabled: disabled }),
    React.createElement("div", { className: 'mw-input-select' },
        React.createElement("input", { tabIndex: 0, type: 'text', ref: passRef, id: id, className: 'theia-input t-mv-input', defaultValue: defaultValue, onKeyDown: onKeyDown, title: title, spellCheck: false, disabled: disabled, placeholder: placeholder }),
        React.createElement("select", { className: 'theia-select t-mv-select', onChange: onSelectChange, disabled: disabled || (options.length === 0) }, options.reverse().map(option => React.createElement("option", { key: `'mw-input-select'-${id}-${option}`, value: option }, option))))));
exports.MWInputWithSelect = MWInputWithSelect;
const MWMoreMemorySelect = ({ options, handler, direction }) => {
    const [numBytes, setNumBytes] = React.useState(options[0]);
    const containerRef = React.createRef();
    const onSelectChange = (e) => {
        e.stopPropagation();
        const { value } = e.currentTarget;
        setNumBytes(parseInt(value));
    };
    const loadMoreMemory = (e) => {
        var _a, _b;
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.blur();
        const doHandle = !('key' in e) || ((_b = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _b === void 0 ? void 0 : _b.keyCode) === browser_1.Key.ENTER.keyCode;
        if (doHandle) {
            handler({
                numBytes,
                direction,
            });
        }
    };
    return (React.createElement("div", { className: 'mw-more-memory-select', tabIndex: 0, role: 'button', onClick: loadMoreMemory, onKeyDown: loadMoreMemory, ref: containerRef },
        React.createElement("div", { className: 'mw-more-memory-select-top no-select' },
            "Load",
            React.createElement("select", { className: 'theia-select', onChange: onSelectChange, tabIndex: 0 }, options.map(option => (React.createElement("option", { key: `mw-more-memory-select-${option}`, value: option }, option)))),
            `more bytes ${direction}`)));
};
exports.MWMoreMemorySelect = MWMoreMemorySelect;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/utils/memory-widget-components'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/utils/memory-widget-manager.js":
/*!**********************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/utils/memory-widget-manager.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.MemoryWidgetManager = void 0;
/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const memory_diff_table_widget_1 = __webpack_require__(/*! ../diff-widget/memory-diff-table-widget */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-table-widget.js");
const memory_widget_1 = __webpack_require__(/*! ../memory-widget/memory-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-widget.js");
const register_widget_types_1 = __webpack_require__(/*! ../register-widget/register-widget-types */ "../../packages/memory-inspector/lib/browser/register-widget/register-widget-types.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const memory_editable_table_widget_1 = __webpack_require__(/*! ../editable-widget/memory-editable-table-widget */ "../../packages/memory-inspector/lib/browser/editable-widget/memory-editable-table-widget.js");
let MemoryWidgetManager = class MemoryWidgetManager {
    constructor() {
        this.createdWidgetCount = 0;
        this.widgetDisplayId = 0;
        this.toDispose = new core_1.DisposableCollection();
        this.onNewWidgetCreated = new core_1.Emitter();
        this.onDidCreateNewWidget = this.onNewWidgetCreated.event;
        this.onSelectedWidgetChanged = new core_1.Emitter();
        this.onDidChangeSelectedWidget = this.onSelectedWidgetChanged.event;
        this.onChangedEmitter = new core_1.Emitter();
        this.onChanged = this.onChangedEmitter.event;
        this._availableWidgets = new Map();
        this._canCompare = false;
    }
    get availableWidgets() {
        return Array.from(this._availableWidgets.values());
    }
    get canCompare() {
        return this._canCompare;
    }
    init() {
        this.toDispose.pushAll([
            this.shell.onDidChangeActiveWidget(({ newValue }) => {
                if (newValue instanceof memory_widget_1.MemoryWidget) {
                    this._focusedWidget = newValue;
                }
            }),
            this.widgetManager.onDidCreateWidget(e => {
                const { widget } = e;
                if (widget instanceof memory_widget_1.MemoryWidget) {
                    this._availableWidgets.set(widget.id, widget);
                    this.toDispose.push(widget.onDidDispose(() => {
                        this._availableWidgets.delete(widget.id);
                        if (widget === this._focusedWidget) {
                            this.focusedWidget = undefined;
                        }
                        this.onChangedEmitter.fire();
                    }));
                }
            }),
            this.onChanged(() => this.setCanCompare()),
            this.onNewWidgetCreated,
            this.onChangedEmitter,
            this.onSelectedWidgetChanged,
        ]);
    }
    get focusedWidget() {
        var _a;
        return (_a = this._focusedWidget) !== null && _a !== void 0 ? _a : this._availableWidgets.values().next().value;
    }
    set focusedWidget(title) {
        this._focusedWidget = title;
        this.onSelectedWidgetChanged.fire(title);
    }
    setCanCompare() {
        this._canCompare = this.availableWidgets.filter(widget => !register_widget_types_1.RegisterWidget.is(widget) && !memory_diff_table_widget_1.MemoryDiffWidget.is(widget)).length > 1;
    }
    async createNewMemoryWidget(kind = 'memory') {
        this.widgetDisplayId = this._availableWidgets.size !== 0 ? this.widgetDisplayId + 1 : 1;
        const widget = await this.getWidgetOfKind(kind);
        this._availableWidgets.set(widget.id, widget);
        widget.title.changed.connect(() => this.onChangedEmitter.fire());
        widget.activate();
        this.fireNewWidget(widget);
        return widget;
    }
    getWidgetOfKind(kind) {
        const widgetId = this.getWidgetIdForKind(kind);
        const options = this.getWidgetOptionsForId(widgetId);
        return this.widgetManager.getOrCreateWidget(widgetId, options);
    }
    getWidgetIdForKind(kind) {
        switch (kind) {
            case 'register':
            case register_widget_types_1.RegisterWidget.ID:
                return register_widget_types_1.RegisterWidget.ID;
            case 'writable':
            case memory_editable_table_widget_1.EditableMemoryWidget.ID:
                return memory_editable_table_widget_1.EditableMemoryWidget.ID;
            default:
                return memory_widget_1.MemoryWidget.ID;
        }
    }
    getWidgetOptionsForId(widgetId) {
        return { identifier: this.createdWidgetCount += 1, displayId: this.widgetDisplayId };
    }
    dispose() {
        this.toDispose.dispose();
    }
    fireNewWidget(widget) {
        this.onNewWidgetCreated.fire(widget);
        this.onChangedEmitter.fire();
    }
    async doDiff(options) {
        if (options.beforeBytes.length === 0) {
            // eslint-disable-next-line max-len
            const beforeBytesMessage = nls_1.nls.localize('theia/memory-inspector/utils/bytesMessage', 'You must load memory in both widgets you would like to compare. {0} has no memory loaded.', options.titles[0]);
            this.messageService.warn(beforeBytesMessage);
            return undefined;
        }
        else if (options.afterBytes.length === 0) {
            // eslint-disable-next-line max-len
            const afterBytesMessage = nls_1.nls.localize('theia/memory-inspector/utils/afterBytes', 'You must load memory in both widgets you would like to compare. {0} has no memory loaded.', options.titles[1]);
            this.messageService.warn(afterBytesMessage);
            return undefined;
        }
        const fullOptions = { ...options, dynamic: false, identifier: options.titles.join('-') };
        const existingWidget = this._availableWidgets.get(memory_widget_1.MemoryWidget.getIdentifier(fullOptions.identifier.toString()));
        if (existingWidget && existingWidget.tableWidget instanceof memory_diff_table_widget_1.MemoryDiffTableWidget) {
            existingWidget.tableWidget.updateDiffData(options);
        }
        const widget = existingWidget !== null && existingWidget !== void 0 ? existingWidget : await this.widgetManager
            .getOrCreateWidget(memory_diff_table_widget_1.MemoryDiffWidget.ID, { ...options, dynamic: false, identifier: options.titles.join('-') });
        const tabBar = this.shell.getTabBarFor(widget);
        if (!tabBar) {
            // The widget is not attached yet, so add it to the shell
            const widgetArgs = {
                area: 'main',
            };
            await this.shell.addWidget(widget, widgetArgs);
        }
        await this.shell.activateWidget(widget.id);
        return widget;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], MemoryWidgetManager.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], MemoryWidgetManager.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], MemoryWidgetManager.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryWidgetManager.prototype, "init", null);
MemoryWidgetManager = __decorate([
    (0, inversify_1.injectable)()
], MemoryWidgetManager);
exports.MemoryWidgetManager = MemoryWidgetManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/utils/memory-widget-manager'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js":
/*!********************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/utils/memory-widget-utils.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterWidgetOptions = exports.MemoryDiffWidgetData = exports.MemoryWidgetOptions = exports.Interfaces = exports.Utils = exports.Constants = void 0;
var Constants;
(function (Constants) {
    Constants.DEBOUNCE_TIME = 200;
    Constants.ERROR_TIMEOUT = 5000;
})(Constants = exports.Constants || (exports.Constants = {}));
var Utils;
(function (Utils) {
    Utils.validateNumericalInputs = (e, allowNegative = true) => {
        const toReplace = allowNegative ? /[^\d-]/g : /[^\d]/g;
        e.target.value = e.target.value.replace(toReplace, '');
    };
    Utils.isPrintableAsAscii = (byte) => byte >= 32 && byte < (128 - 1);
})(Utils = exports.Utils || (exports.Utils = {}));
var Interfaces;
(function (Interfaces) {
    let Endianness;
    (function (Endianness) {
        Endianness["Little"] = "Little Endian";
        Endianness["Big"] = "Big Endian";
    })(Endianness = Interfaces.Endianness || (Interfaces.Endianness = {}));
})(Interfaces = exports.Interfaces || (exports.Interfaces = {}));
exports.MemoryWidgetOptions = Symbol('MemoryWidgetOptions');
exports.MemoryDiffWidgetData = Symbol('MemoryDiffWidgetData');
exports.RegisterWidgetOptions = Symbol('RegisterWidgetData');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/utils/memory-widget-utils'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/utils/memory-widget-variable-utils.js":
/*!*****************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/utils/memory-widget-variable-utils.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRegisters = exports.VariableFinder = void 0;
const debug_console_items_1 = __webpack_require__(/*! @theia/debug/lib/browser/console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const Long = __webpack_require__(/*! long */ "../../node_modules/long/src/long.js");
class VariableFinder {
    constructor(variables, highContrast = false) {
        this.HIGH_CONTRAST_COLORS = [
            'var(--theia-contrastActiveBorder)',
            'var(--theia-contrastBorder)',
        ];
        this.NON_HC_COLORS = [
            'var(--theia-terminal-ansiBlue)',
            'var(--theia-terminal-ansiGreen)',
            'var(--theia-terminal-ansiRed)',
            'var(--theia-terminal-ansiYellow)',
            'var(--theia-terminal-ansiMagenta)',
        ];
        this.currentIndex = -1;
        this.currentVariable = undefined;
        this.handledVariables = new Map();
        this.lastCall = Long.MAX_UNSIGNED_VALUE;
        this.variables = variables.sort((a, b) => a.address.lessThan(b.address) ? -1 : 1);
        this.workingColors = highContrast ? this.HIGH_CONTRAST_COLORS : this.NON_HC_COLORS;
    }
    /**
     * @param address the address of interest.
     *
     * This function should be called with a sequence of addresses in increasing order
     */
    getVariableForAddress(address) {
        if (address.lessThan(this.lastCall)) {
            this.initialize(address);
        }
        this.lastCall = address;
        if (this.currentVariable && address.greaterThanOrEqual(this.currentVariable.pastTheEndAddress)) {
            this.currentIndex += 1;
            this.currentVariable = this.variables[this.currentIndex];
        }
        if (!this.currentVariable) {
            return undefined;
        }
        const { name } = this.currentVariable;
        // const color = `hsl(${HSL_BASIS * this.currentIndex / this.variables.length}, 60%, 60%)`;
        const color = this.workingColors[this.currentIndex % this.workingColors.length];
        const decoration = {
            name,
            color,
            firstAppearance: this.handledVariables.get(name) === address || !this.handledVariables.has(name),
        };
        if (address.greaterThanOrEqual(this.currentVariable.address) && address.lessThan(this.currentVariable.pastTheEndAddress)) {
            this.handledVariables.set(name, address);
            return decoration;
        }
        return undefined;
    }
    initialize(address) {
        this.handledVariables.clear();
        const firstCandidateIndex = this.variables.findIndex(variable => address.lessThan(variable.pastTheEndAddress));
        if (firstCandidateIndex === -1) {
            this.currentIndex = this.variables.length;
        }
        else {
            this.currentVariable = this.variables[firstCandidateIndex];
            this.currentIndex = firstCandidateIndex;
        }
    }
    searchForVariable(addressOrName) {
        if (typeof addressOrName === 'string') {
            return this.variables.find(variable => variable.name === addressOrName);
        }
        let upperLimit = this.variables.length - 1;
        let lowerLimit = 0;
        while (upperLimit >= lowerLimit) {
            const target = Math.floor((lowerLimit + upperLimit) / 2);
            const candidate = this.variables[target];
            if (addressOrName >= candidate.address && addressOrName < candidate.pastTheEndAddress) {
                return candidate;
            }
            if (addressOrName < candidate.address) {
                upperLimit = target - 1;
            }
            if (addressOrName >= candidate.pastTheEndAddress) {
                lowerLimit = target + 1;
            }
        }
        return undefined;
    }
}
exports.VariableFinder = VariableFinder;
/**
 * Get the Registers of the currently selected frame.
 */
async function getRegisters(session) {
    if (session === undefined) {
        console.warn('No active debug session.');
        return [];
    }
    const frame = session.currentFrame;
    if (frame === undefined) {
        throw new Error('No active stack frame.');
    }
    const registers = [];
    const scopes = await frame.getScopes();
    const regScope = scopes.find(x => x.render() === 'Registers');
    if (regScope !== undefined) {
        const handleRegisterScope = async (scope) => {
            const variables = await scope.getElements();
            for (const v of variables) {
                if (v instanceof debug_console_items_1.DebugVariable) {
                    try {
                        BigInt(v.value); // Make sure the value looks like a numerical value
                        registers.push(v);
                    }
                    catch {
                        handleRegisterScope(v);
                    }
                }
            }
        };
        handleRegisterScope(regScope);
    }
    else {
        throw new Error('No Register scope in active stack frame.');
    }
    return registers;
}
exports.getRegisters = getRegisters;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/utils/memory-widget-variable-utils'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/utils/multi-select-bar.js":
/*!*****************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/utils/multi-select-bar.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MWMultiSelect = exports.MultiSelectBar = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const memory_widget_components_1 = __webpack_require__(/*! ./memory-widget-components */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-components.js");
const MultiSelectBar = ({ items, onSelectionChanged, id }) => {
    const changeHandler = React.useCallback(e => {
        onSelectionChanged(e.target.id, e.target.checked);
    }, [onSelectionChanged]);
    return (React.createElement("div", { className: 'multi-select-bar', id: id }, items.map(({ label, id: itemId, defaultChecked }) => (React.createElement(LabeledCheckbox, { label: label, onChange: changeHandler, defaultChecked: !!defaultChecked, id: itemId, key: `${label}-${id}-checkbox` })))));
};
exports.MultiSelectBar = MultiSelectBar;
const LabeledCheckbox = ({ defaultChecked, label, onChange, id }) => (React.createElement("div", { className: 'multi-select-checkbox-wrapper' },
    React.createElement("input", { tabIndex: 0, type: 'checkbox', id: id, className: 'multi-select-checkbox', defaultChecked: defaultChecked, onChange: onChange }),
    React.createElement(memory_widget_components_1.MWLabel, { id: id, label: label, classNames: ['multi-select-label'] })));
const MWMultiSelect = ({ id, label, disabled, items, onSelectionChanged }) => (React.createElement(React.Fragment, null,
    React.createElement(memory_widget_components_1.MWLabel, { id: id, label: label, disabled: disabled }),
    React.createElement(exports.MultiSelectBar, { id: id, items: items, onSelectionChanged: onSelectionChanged })));
exports.MWMultiSelect = MWMultiSelect;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/utils/multi-select-bar'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dock-panel.js":
/*!****************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dock-panel.js ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryDockPanel = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const theia_dock_panel_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/theia-dock-panel */ "../../packages/core/lib/browser/shell/theia-dock-panel.js");
class MemoryDockPanel extends theia_dock_panel_1.TheiaDockPanel {
    toggleMaximized() { }
}
exports.MemoryDockPanel = MemoryDockPanel;
(function (MemoryDockPanel) {
    MemoryDockPanel.ID = 'memory-dock-panel-widget';
    const DOCK_PANEL_ID = 'theia-main-content-panel';
    const THEIA_TABBAR_CLASSES = ['theia-app-centers', 'theia-app-main'];
    const MEMORY_INSPECTOR_TABBAR_CLASS = 'memory-dock-tabbar';
    const DOCK_PANEL_CLASS = 'memory-dock-panel';
    const createDockPanel = (factory) => {
        const renderer = factory();
        renderer.tabBarClasses.push(...THEIA_TABBAR_CLASSES, MEMORY_INSPECTOR_TABBAR_CLASS);
        const dockPanel = new MemoryDockPanel({
            mode: 'multiple-document',
            renderer,
            spacing: 0,
        });
        dockPanel.addClass(DOCK_PANEL_CLASS);
        dockPanel.id = DOCK_PANEL_ID;
        return dockPanel;
    };
    MemoryDockPanel.createWidget = (parent) => {
        const dockFactory = parent.get(browser_1.DockPanelRendererFactory);
        const dockPanel = createDockPanel(dockFactory);
        return dockPanel;
    };
})(MemoryDockPanel = exports.MemoryDockPanel || (exports.MemoryDockPanel = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/wrapper-widgets/memory-dock-panel'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dockpanel-placeholder-widget.js":
/*!**********************************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dockpanel-placeholder-widget.js ***!
  \**********************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MemoryDockpanelPlaceholder_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryDockpanelPlaceholder = void 0;
/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
let MemoryDockpanelPlaceholder = MemoryDockpanelPlaceholder_1 = class MemoryDockpanelPlaceholder extends browser_1.ReactWidget {
    init() {
        this.id = MemoryDockpanelPlaceholder_1.ID;
        this.addClass(MemoryDockpanelPlaceholder_1.ID);
        this.update();
    }
    render() {
        return (React.createElement("div", { className: 't-mv-memory-fetch-error' },
            "Click the ",
            React.createElement("i", { className: 'memory-view-icon toolbar' }),
            " icon to add a new memory view or the ",
            React.createElement("i", { className: 'register-view-icon toolbar' }),
            " icon to add a register view."));
    }
};
MemoryDockpanelPlaceholder.ID = 'memory-dockpanel-placeholder';
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryDockpanelPlaceholder.prototype, "init", null);
MemoryDockpanelPlaceholder = MemoryDockpanelPlaceholder_1 = __decorate([
    (0, inversify_1.injectable)()
], MemoryDockpanelPlaceholder);
exports.MemoryDockpanelPlaceholder = MemoryDockpanelPlaceholder;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/wrapper-widgets/memory-dockpanel-placeholder-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-layout-widget.js":
/*!*******************************************************************************************!*\
  !*** ../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-layout-widget.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MemoryLayoutWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryLayoutWidget = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const memory_diff_select_widget_1 = __webpack_require__(/*! ../diff-widget/memory-diff-select-widget */ "../../packages/memory-inspector/lib/browser/diff-widget/memory-diff-select-widget.js");
const memory_widget_1 = __webpack_require__(/*! ../memory-widget/memory-widget */ "../../packages/memory-inspector/lib/browser/memory-widget/memory-widget.js");
const memory_widget_manager_1 = __webpack_require__(/*! ../utils/memory-widget-manager */ "../../packages/memory-inspector/lib/browser/utils/memory-widget-manager.js");
const memory_dock_panel_1 = __webpack_require__(/*! ./memory-dock-panel */ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dock-panel.js");
const memory_dockpanel_placeholder_widget_1 = __webpack_require__(/*! ./memory-dockpanel-placeholder-widget */ "../../packages/memory-inspector/lib/browser/wrapper-widgets/memory-dockpanel-placeholder-widget.js");
let MemoryLayoutWidget = MemoryLayoutWidget_1 = class MemoryLayoutWidget extends browser_1.Panel {
    constructor() {
        super(...arguments);
        this.onDidChangeTrackableWidgetsEmitter = new core_1.Emitter();
        this.onDidChangeTrackableWidgets = this.onDidChangeTrackableWidgetsEmitter.event;
        this.toDispose = new core_1.DisposableCollection();
        this.hasGeneratedWidgetAutomatically = false;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.id = MemoryLayoutWidget_1.ID;
        this.addClass(MemoryLayoutWidget_1.ID);
        this.title.label = MemoryLayoutWidget_1.LABEL;
        this.title.caption = MemoryLayoutWidget_1.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'memory-view-icon';
        this.dockPanel = await this.widgetManager.getOrCreateWidget(memory_dock_panel_1.MemoryDockPanel.ID);
        this.addWidget(this.dockPanel);
        this.addWidget(this.diffSelectWidget);
        this.addWidget(this.placeholderWidget);
        this.toDispose.push(this.memoryWidgetManager.onDidCreateNewWidget(widget => {
            this.dockPanel.addWidget(widget);
            this.dockPanel.activateWidget(widget);
            this.onDidChangeTrackableWidgetsEmitter.fire([widget]);
        }));
        this.toDispose.push(this.memoryWidgetManager.onChanged(() => {
            if (!this.memoryWidgetManager.canCompare) {
                this.diffSelectWidget.hide();
            }
        }));
        this.dockPanel.widgetRemoved.connect(this.handleWidgetRemoved.bind(this), this);
        this.dockPanel.widgetAdded.connect(this.handleWidgetsChanged.bind(this), this);
        this.toDispose.push(this.onDidChangeTrackableWidgetsEmitter);
        this.diffSelectWidget.hide();
        this.update();
    }
    toggleComparisonVisibility() {
        if (this.diffSelectWidget.isHidden) {
            this.diffSelectWidget.show();
        }
        else {
            this.diffSelectWidget.hide();
        }
        this.update();
    }
    dispose() {
        this.toDispose.dispose();
        super.dispose();
    }
    dockPanelHoldsWidgets() {
        const iter = this.dockPanel.tabBars();
        let tabBar = iter.next();
        while (tabBar) {
            if (tabBar.titles.length) {
                return true;
            }
            tabBar = iter.next();
        }
        return false;
    }
    handleWidgetsChanged() {
        if (this.dockPanelHoldsWidgets()) {
            this.placeholderWidget.hide();
        }
        else {
            this.placeholderWidget.show();
        }
    }
    handleWidgetRemoved(_sender, widgetRemoved) {
        if (widgetRemoved instanceof memory_widget_1.MemoryWidget) { // Sometimes it's the tabbar.
            this.handleWidgetsChanged();
            this.shell.activateWidget(this.id);
        }
    }
    async createAndFocusWidget() {
        const widget = await this.memoryWidgetManager.createNewMemoryWidget();
        widget.activate();
    }
    async onAfterShow(msg) {
        if (!this.hasGeneratedWidgetAutomatically && !this.dockPanelHoldsWidgets()) {
            await this.createAndFocusWidget();
            this.hasGeneratedWidgetAutomatically = true;
        }
        super.onAfterShow(msg);
    }
    getTrackableWidgets() {
        const children = [];
        const childIterator = this.dockPanel.children();
        let currentChild = childIterator.next();
        while (currentChild) {
            children.push(currentChild);
            currentChild = childIterator.next();
        }
        return children;
    }
    activateWidget(id) {
        const widget = this.getTrackableWidgets().find(candidateWidget => candidateWidget.id === id);
        if (widget) {
            this.dockPanel.activateWidget(widget);
        }
        return widget;
    }
    onActivateRequest(msg) {
        var _a, _b;
        const displayedWidget = (_b = (_a = this.dockPanel.currentTabBar) === null || _a === void 0 ? void 0 : _a.currentTitle) === null || _b === void 0 ? void 0 : _b.owner;
        if (displayedWidget) {
            displayedWidget.activate();
        }
        else {
            // Only happens if you remove all widgets, then close the view.
            this.node.tabIndex = -1;
            this.node.focus();
        }
        super.onActivateRequest(msg);
    }
};
MemoryLayoutWidget.ID = 'memory-layout-widget';
MemoryLayoutWidget.LABEL = core_1.nls.localize('theia/memory-inspector/memoryInspector', 'Memory Inspector');
// Necessary to inherit theia's tabbar styling
MemoryLayoutWidget.DOCK_PANEL_ID = 'theia-main-content-panel';
MemoryLayoutWidget.THEIA_TABBAR_CLASSES = ['theia-app-centers', 'theia-app-main'];
MemoryLayoutWidget.MEMORY_INSPECTOR_TABBAR_CLASS = 'memory-dock-tabbar';
MemoryLayoutWidget.DOCK_PANEL_CLASS = 'memory-dock-panel';
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], MemoryLayoutWidget.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(memory_widget_manager_1.MemoryWidgetManager),
    __metadata("design:type", memory_widget_manager_1.MemoryWidgetManager)
], MemoryLayoutWidget.prototype, "memoryWidgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(memory_diff_select_widget_1.MemoryDiffSelectWidget),
    __metadata("design:type", memory_diff_select_widget_1.MemoryDiffSelectWidget)
], MemoryLayoutWidget.prototype, "diffSelectWidget", void 0);
__decorate([
    (0, inversify_1.inject)(memory_dockpanel_placeholder_widget_1.MemoryDockpanelPlaceholder),
    __metadata("design:type", memory_dockpanel_placeholder_widget_1.MemoryDockpanelPlaceholder)
], MemoryLayoutWidget.prototype, "placeholderWidget", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], MemoryLayoutWidget.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemoryLayoutWidget.prototype, "init", null);
MemoryLayoutWidget = MemoryLayoutWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], MemoryLayoutWidget);
exports.MemoryLayoutWidget = MemoryLayoutWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/browser/wrapper-widgets/memory-layout-widget'] = this;


/***/ }),

/***/ "../../packages/memory-inspector/lib/common/util.js":
/*!**********************************************************!*\
  !*** ../../packages/memory-inspector/lib/common/util.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hexStrToUnsignedLong = void 0;
const Long = __webpack_require__(/*! long */ "../../node_modules/long/src/long.js");
/**
 * Parse `hexStr` as an hexadecimal string (with or without the leading 0x)
 * and return the value as a Long.
 */
function hexStrToUnsignedLong(hexStr) {
    if (hexStr.trim().length === 0) {
        return new Long(0, 0, true);
    }
    return Long.fromString(hexStr, true, 16);
}
exports.hexStrToUnsignedLong = hexStrToUnsignedLong;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/memory-inspector/lib/common/util'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/browser/index.js":
/*!*****************************************************!*\
  !*** ../../packages/workspace/lib/browser/index.js ***!
  \*****************************************************/
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
__exportStar(__webpack_require__(/*! ./workspace-commands */ "../../packages/workspace/lib/browser/workspace-commands.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js"), exports);
__exportStar(__webpack_require__(/*! ./canonical-uri-service */ "../../packages/workspace/lib/browser/canonical-uri-service.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-frontend-contribution */ "../../packages/workspace/lib/browser/workspace-frontend-contribution.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-frontend-module */ "../../packages/workspace/lib/browser/workspace-frontend-module.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-preferences */ "../../packages/workspace/lib/browser/workspace-preferences.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-trust-service */ "../../packages/workspace/lib/browser/workspace-trust-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/browser'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/register-widget/register-widget.css":
/*!*********************************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/register-widget/register-widget.css ***!
  \*********************************************************************************************************************************/
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
 * Copyright (C) 2021 Ericsson and others.
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

.register-table-widget table.t-mv-view {
  table-layout: fixed;
  width: 100%;
}

.register-table-widget table.t-mv-view td,
.register-table-widget table.t-mv-view th {
  overflow: hidden;
  text-overflow: ellipsis;
}

.reg-options-widget .t-mv-group.view-group {
  grid-template-columns: 3fr 2fr 30px;
}

.reg-options-widget .multi-select-bar {
  height: 100%;
}
`, "",{"version":3,"sources":["webpack://./../../packages/memory-inspector/src/browser/register-widget/register-widget.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,mBAAmB;EACnB,WAAW;AACb;;AAEA;;EAEE,gBAAgB;EAChB,uBAAuB;AACzB;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,YAAY;AACd","sourcesContent":["/********************************************************************************\n * Copyright (C) 2021 Ericsson and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.register-table-widget table.t-mv-view {\n  table-layout: fixed;\n  width: 100%;\n}\n\n.register-table-widget table.t-mv-view td,\n.register-table-widget table.t-mv-view th {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.reg-options-widget .t-mv-group.view-group {\n  grid-template-columns: 3fr 2fr 30px;\n}\n\n.reg-options-widget .multi-select-bar {\n  height: 100%;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/style/index.css":
/*!*************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/style/index.css ***!
  \*************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/getUrl.js */ "../../node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! memory-view.svg */ "../../packages/memory-inspector/src/browser/style/memory-view.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! register-view.svg */ "../../packages/memory-inspector/src/browser/style/register-view.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! memory-lock.svg */ "../../packages/memory-inspector/src/browser/style/memory-lock.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! register-lock.svg */ "../../packages/memory-inspector/src/browser/style/register-lock.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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

:root {
  --memory-widget-disabled-opacity: 0.7;
  --memory-widget-placeholder-text-line-height: 24px;
}

.memory-view-options-widget {
  display: flex;
  overflow: unset !important;
}

.memory-view-icon {
  -webkit-mask: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  mask: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
}

.register-view-icon {
  -webkit-mask: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
  mask: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
}

.memory-view-icon.toolbar,
.register-view-icon.toolbar {
  display: inline-block;
  background-color: var(--theia-settings-headerForeground);
  mask-size: 16px 15px;
  mask-repeat: no-repeat;
  mask-position: center center;
  -webkit-mask-size: 16px 15px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center center;
  min-width: var(--theia-icon-size);
  min-height: var(--theia-icon-size);
  cursor: pointer;
}

.memory-lock-icon {
  -webkit-mask: url(${___CSS_LOADER_URL_REPLACEMENT_2___});
  mask: url(${___CSS_LOADER_URL_REPLACEMENT_2___});
}

.register-lock-icon {
  -webkit-mask: url(${___CSS_LOADER_URL_REPLACEMENT_3___});
  mask: url(${___CSS_LOADER_URL_REPLACEMENT_3___});
}

.t-mv-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 10px;
  overflow: hidden;
}

.t-mv-container button:focus {
  /* Fixes a padding issue when clicking a button */
  border: none;
}

.memory-view-wrapper {
  display: flex;
  flex-direction: column;
}

.t-mv-memory-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--theia-editor-background);
  height: 100%;
  white-space: nowrap;
}

.t-mv-memory-container:focus {
  outline: none;
}

.t-mv-memory-container.frozen,
.t-mv-memory-container.frozen:focus {
  font-style: italic;
  opacity: var(--memory-widget-disabled-opacity) !important;
}

.t-mv-memory-fetch-error {
  margin: var(--theia-ui-padding);
  color: var(--theia-editorWarning-foreground);
}

.t-mv-memory-fetch-error.show {
  display: block;
}

.t-mv-memory-fetch-error.hide {
  display: none;
}

.t-mv-header {
  margin-top: var(--theia-ui-padding);
  display: grid;
  box-shadow: 0px 6px 5px -5px var(--theia-widget-shadow);
  padding-bottom: var(--theia-ui-padding);
}

.t-mv-header-label {
  background-color: var(--theia-editor-background);
  border-radius: 10px;
  font-weight: 400;
  padding: 2px 5px 2px 5px;
}

.t-mv-view {
  width: 100%;
}

.t-mv-view .eight-bits.changed {
  background-color: var(--theia-memoryInspector-foreground);
  color: var(--theia-editor-background);
}

.t-mv-view .eight-bits.changed:hover {
  background-color: var(--theia-memoryInspector-foreground);
  opacity: 0.85;
}

.t-mv-view .eight-bits {
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
}

.t-mv-view .eight-bits:not(.changed):not(.highlight):hover {
  background-color: var(--theia-editor-inactiveSelectionBackground);
}

.t-mv-memory-container:focus .eight-bits.highlight {
  background-color: var(--theia-editor-selectionBackground);
  border-radius: 1px;
  border-bottom: solid 1px var(--theia-editorCursor-foreground);
}

.t-mv-memory-container:focus .eight-bits.changed.highlight {
  background-color: var(--theia-memoryInspector-focusBorder);
}

.t-mv-memory-container:not(:focus) .eight-bits.highlight {
  background-color: var(--theia-editor-inactiveSelectionBackground);
}

.t-mv-view .eight-bits.modified {
  outline-width: 1px;
  outline-style: solid;
  outline-offset: -1px;
  outline-color: var(--theia-editorWarning-foreground);
  border: none;
}

.t-mv-view .byte-group:not(:first-of-type) {
  display: inline-block;
  padding-left: var(--theia-ui-padding);
}

.t-mv-view .data-address-col {
  width: unset;
}

.t-mv-view-container {
  flex: 1;
  overflow: hidden;
  margin-top: var(--theia-ui-padding);
  height: 100%;
}

.t-mv-view-container thead {
  position: absolute;
}

.t-mv-view-container .ps__rail-y {
  left: unset !important;
}

.t-mv-view-container:focus {
  /* Fixes a padding issue when clicking inside the container */
  border: none;
}

.memory-diff-select .theia-select:focus,
.t-mv-container .theia-select:focus {
  outline-width: 1px;
  outline-style: solid;
  outline-offset: -1px;
  opacity: 1 !important;
  outline-color: var(--theia-focusBorder);
}

.t-mv-settings-container {
  flex: none;
  padding-bottom: var(--theia-ui-padding);
}

.t-mv-settings-container .t-mv-settings-group-header {
  padding-bottom: calc(var(--theia-ui-padding) / 2);
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);
}

.memory-widget-toolbar {
  display: flex;
  flex-flow: row nowrap;
  height: 24px;
  align-items: center;
  max-width: 100%;
}

.memory-widget-toolbar * {
  flex: none;
}

.memory-widget-toolbar .memory-widget-header-click-zone {
  min-width: 0;
}

.memory-widget-header-click-zone * {
  flex: none;
}

.memory-widget-auto-updates-container {
  width: 16px;
  margin-right: var(--theia-ui-padding);
  font-size: 1.3em;
}

.toggle-settings-container {
  margin-left: auto;
}

.toggle-settings-container .toggle-settings-click-zone {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: var(--theia-ui-padding);
  user-select: none;
  box-sizing: content-box;
  border-top: 1px solid transparent;
}

.toggle-settings-container .toggle-settings-click-zone:focus {
  outline: none;
  border-top: 1px solid var(--theia-focusBorder);
}

.toggle-settings-container .toggle-settings-click-zone span {
  white-space: nowrap;
}

.toggle-settings-container .codicon-settings-gear {
  font-size: 1.1em;
  margin-right: var(--theia-ui-padding);
}

.toggle-settings-container + div > .t-mv-settings-group-header:first-of-type,
.toggle-settings-container + .t-mv-settings-group-header {
  margin-top: 0;
}

.t-mv-wrapper button.theia-button {
  min-width: 30px;
  margin: unset;
  padding: unset;
}

.view-group {
  grid-template-columns: 70px 1fr;
}

.settings-group {
  grid-template-columns: 110px 1fr;
  margin-top: calc(2 * var(--theia-ui-padding));
}

.ascii-group {
  grid-template-columns: 70px 1fr;
}

.t-mv-group.view-group {
  grid-template-columns: 3fr repeat(2, 1fr) 30px;
  grid-template-rows: repeat(2, 24px);
  grid-auto-flow: column;
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);
  border-top: 1px solid hsla(0, 0%, 50%, 0.5);
  padding-bottom: var(--theia-ui-padding);
}

.view-group-go-button {
  grid-row: 2 / 3;
  height: 100%;
}

.t-mv-group {
  display: grid;
  grid-column-gap: var(--theia-ui-padding);
  grid-row-gap: calc(var(--theia-ui-padding) / 2);
  align-items: center;
}

.t-mv-group .theia-select,
.t-mv-group .theia-input {
  width: 100%;
  box-sizing: border-box;
}

.t-mv-group .multi-select-bar {
  min-height: 19px;
}

.t-mv-group .multi-select-label {
  line-height: 17px;
}

.t-mv-input-group.button-wrapper {
  margin: 2px;
  width: 100%;
  display: block;
  text-align: center;
}

.t-mv-input-group.button-wrapper .theia-button.main {
  margin: var(--theia-ui-padding) 0 0 0;
}

table.t-mv-view {
  align-self: center;
  border-collapse: collapse;
  border: none;
}

table.t-mv-view {
  font-size: var(--theia-ui-font-size1);
  font-weight: 400;
  text-align: left;
  padding: 10px;
}

table.t-mv-view td,
table.t-mv-view th {
  font-family: monospace;
  padding-right: 15px;
  white-space: pre;
}

table.t-mv-view .t-mv-view-row.t-mv-view-row-highlight {
  border-bottom: 1px var(--theia-editorGroup-border) solid;
}

table.t-mv-view .t-mv-view-row:hover {
  background-color: var(--theia-sideBar-background);
}

table.t-mv-view .t-mv-view-address {
  font-weight: 700;
  text-align: left;
}

.t-mv-settings-group-header.small-margin {
  margin-bottom: var(--theia-ui-padding);
  margin-top: var(--theia-ui-padding);
}

.t-mv-variable-label:not(:last-of-type)::after {
  content: ",";
  margin-right: var(--theia-ui-padding);
  color: var(--theia-editor-foreground);
}

.mw-input-select {
  position: relative;
  height: 100%;
}

.mw-input-select .theia-input {
  position: absolute;
  z-index: 1;
  width: calc(100% - 18px);
}

.mw-input-select .theia-input:focus {
  outline: unset;
}

.mw-input-select .theia-select {
  position: absolute;
  z-index: 0;
  height: calc(var(--theia-content-line-height) + 2px);
}

.mw-input-select .theia-select:focus {
  outline: unset;
}

.memory-layout-widget {
  display: flex;
  flex-direction: column;
}

.memory-dock-panel {
  flex-grow: 1;
  margin: var(--theia-ui-padding);
  margin-top: 0;
}

.memory-edit-button-container {
  padding: var(--theia-ui-padding) 0;
  width: 100%;
  display: flex;
  justify-content: center;
  box-shadow: 0px 6px 6px 6px var(--theia-widget-shadow);
}

.memory-edit-button-container .memory-edit-error {
  width: 100%;
  height: 100%;
  bottom: 0;
  box-sizing: border-box;
  white-space: normal;
  padding: var(--theia-ui-padding);
  background-color: var(--theia-editor-background);
  color: var(--theia-editorWarning-foreground);
}

.memory-diff-select {
  padding: var(--theia-ui-padding);
}

.memory-diff-select-wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  border-top: 1px solid hsla(0, 0%, 50%, 0.5);
  padding-top: var(--theia-ui-padding);
}

.diff-select-input-wrapper {
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: center;
  flex-flow: row wrap;
}

.memory-diff-select-go {
  min-width: unset;
  text-align: center;
  width: 30px;
  margin: 0 var(--theia-ui-padding);
  margin-top: var(--theia-ui-padding);
  align-self: flex-end;
}

.t-mv-diff-select-widget-options-wrapper {
  display: grid;
  grid-template-rows: 12px 24px;
  grid-auto-flow: column;
  gap: calc(var(--theia-ui-padding) / 2);
  max-width: 215px;
  margin: 0 var(--theia-ui-padding);
  align-items: center;
}

.t-mv-diff-select-widget-options-wrapper .t-mv-label,
.t-mv-diff-select-widget-options-wrapper .t-mv-select {
  min-width: 0;
}

.t-mv-diff-select-widget-options-wrapper .t-mv-select {
  height: 100%;
}

.theia-input:disabled {
  opacity: var(--memory-widget-disabled-opacity);
}

.t-mv-label.disabled {
  font-style: italic;
  opacity: var(--memory-widget-disabled-opacity);
}

.memory-widget-header {
  font-weight: normal;
}

.memory-widget-header-click-zone {
  display: flex;
  flex: 1 1 0;
  align-items: center;
}

.memory-widget-header-click-zone .memory-widget-header {
  margin: 0;
  white-space: nowrap;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.memory-widget-header-click-zone input {
  flex-grow: 1;
  width: 0;
  height: 18px;
}

.memory-widget-toolbar .fa.fa-pencil,
.memory-widget-toolbar .fa.fa-save {
  font-size: 1.2em;
  margin: 0 var(--theia-ui-padding);
  transition: opacity 0.3s;
}

.memory-widget-header-click-zone:hover .fa.fa-pencil {
  opacity: 1;
}

.memory-widget-header-click-zone .fa.fa-pencil {
  opacity: 0;
}

.memory-widget-header-click-zone .theia-input {
  font-size: 1.5em;
  /* same as theia h2 */
}

.t-mv-settings-group-header.disabled,
.memory-widget-header.disabled {
  font-style: italic;
  opacity: var(--memory-widget-disabled-opacity);
}

.t-mv-view-container span {
  display: inline-block;
}

.t-mv-diffed-ascii:not(:last-of-type) {
  margin-right: var(--theia-ui-padding);
}

.t-mv-view-container span.different {
  position: relative;
}

.t-mv-view-container span.different::before {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

.t-mv-view-container span.before.different::before,
.t-mv-view-container .before.different {
  background-color: var(--theia-memoryDiff-removedTextBackground);
}

.t-mv-view-container span.after.different::before,
.t-mv-view-container .after.different {
  background-color: var(--theia-memoryDiff-insertedTextBackground);
}

.t-mv-view-container span.before.different.hc::before,
.t-mv-view-container .before.different.hc {
  border-top: dotted 1px var(--theia-contrastActiveBorder);
  border-bottom: dotted 1px var(--theia-contrastActiveBorder);
  box-sizing: border-box;
}

.t-mv-view-container span.after.different.hc::before,
.t-mv-view-container .after.different.hc {
  border-top: dashed 1px var(--theia-contrastBorder);
  border-bottom: dashed 1px var(--theia-contrastBorder);
  box-sizing: border-box;
}

.memory-dockpanel-placeholder {
  position: absolute;
  top: 10px;
  padding: calc(2 * var(--theia-ui-padding));
  width: 100%;
  line-height: var(--memory-widget-placeholder-text-line-height);
}

.memory-dockpanel-placeholder i.toolbar {
  background-color: var(--theia-errorForeground);
  vertical-align: middle;
  cursor: default;
}

.t-mv-hover {
  position: fixed;
  font-family: monospace;
  box-sizing: border-box;
  padding: var(--theia-ui-padding);
  font-size: var(--theia-ui-font-size1);
  background: var(--theia-editorHoverWidget-background);
  border: 2px solid var(--theia-editorHoverWidget-border);
  /* This ensures that the hover is visible over the widget even when focused */
  z-index: 1000;

  display: grid;
  grid-template-columns: max-content max-content;
  gap: calc(var(--theia-ui-padding) / 2) var(--theia-ui-padding);
}

.t-mv-hover.hidden {
  display: none;
}

.t-mv-hover-key {
  color: var(--theia-symbolIcon-variableForeground);
}

.t-mv-hover-value {
  color: var(--theia-variable-number-variable-color);
}

.t-mv-hover-value.utf8 {
  color: var(--theia-variable-string-variable-color);
}

.mw-more-memory-select {
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
  opacity: 0.7;
}

.mw-more-memory-select-top {
  display: flex;
  justify-content: center;
  height: 16px;
  padding-bottom: 1px;
  transition: border-color 0.1s;
  border-color: transparent;
}

.mw-more-memory-select-top:hover {
  border-bottom: 1px solid;
  padding-bottom: 0;
  border-color: var(--theia-sideBar-foreground);
}

.mw-more-memory-select select {
  border: none;
  background: none;
  border-radius: 3px;
  margin: 0 2px;
  position: relative;
  bottom: 1px;
  transition: background 0.1s;
  font-style: italic;
}

.mw-more-memory-select select:hover {
  background: var(--theia-dropdown-background);
}

.mw-more-memory-select button {
  background-color: unset;
  border: none;
  padding: 2px;
  color: var(--theia-sideBar-foreground);
}

.mw-bookmarks-bar {
  padding: calc(var(--theia-ui-padding) / 2) 0;
}

.mw-bookmarks-bar .bookmark-container {
  display: inline;
  position: relative;
  cursor: pointer;
  padding: 0 var(--theia-ui-padding);
}

.mw-bookmarks-bar .bookmark-container .bookmark-radio-button {
  height: 100%;
  z-index: -1;
  border-radius: 3px;
  padding: 0 var(--theia-ui-padding);
  background-color: var(--theia-button-secondaryBackground);
  color: var(--theia-button-secondaryForeground);
  box-shadow: 0 2px 0 rgba(187, 187, 187, 0.4);
}

.mw-bookmarks-bar input {
  position: absolute;
  left: 0;
  appearance: none;
  -webkit-appearance: none;
}

.mw-bookmarks-bar input:checked ~ .bookmark-radio-button {
  background-color: var(--theia-button-background);
  color: var(--theia-button-foreground);
}

.diff-options-widget .t-mv-group.view-group {
  grid-template-columns: repeat(2, 1fr) 30px;
  grid-template-rows: 18px 24px;
}

#memory-table-widget.editable .t-mv-view .eight-bits:hover {
  cursor: pointer;
}

#memory-table-widget.editable
  .t-mv-memory-container:focus
  .eight-bits.highlight {
  cursor: text;
}

.diff-options-widget .memory-widget-header-click-zone,
.diff-options-widget .toggle-settings-click-zone,
#memory-layout-widget .memory-widget-header-click-zone,
#memory-layout-widget .toggle-settings-click-zone,
#memory-layout-widget .fa-unlock,
#memory-layout-widget .fa-lock {
  cursor: pointer;
}
`, "",{"version":3,"sources":["webpack://./../../packages/memory-inspector/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,qCAAqC;EACrC,kDAAkD;AACpD;;AAEA;EACE,aAAa;EACb,0BAA0B;AAC5B;;AAEA;EACE,qDAAoC;EACpC,6CAA4B;AAC9B;;AAEA;EACE,qDAAsC;EACtC,6CAA8B;AAChC;;AAEA;;EAEE,qBAAqB;EACrB,wDAAwD;EACxD,oBAAoB;EACpB,sBAAsB;EACtB,4BAA4B;EAC5B,4BAA4B;EAC5B,8BAA8B;EAC9B,oCAAoC;EACpC,iCAAiC;EACjC,kCAAkC;EAClC,eAAe;AACjB;;AAEA;EACE,qDAAoC;EACpC,6CAA4B;AAC9B;;AAEA;EACE,qDAAsC;EACtC,6CAA8B;AAChC;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,iBAAiB;EACjB,sBAAsB;EACtB,YAAY;EACZ,WAAW;EACX,aAAa;EACb,gBAAgB;AAClB;;AAEA;EACE,iDAAiD;EACjD,YAAY;AACd;;AAEA;EACE,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,gBAAgB;EAChB,gDAAgD;EAChD,YAAY;EACZ,mBAAmB;AACrB;;AAEA;EACE,aAAa;AACf;;AAEA;;EAEE,kBAAkB;EAClB,yDAAyD;AAC3D;;AAEA;EACE,+BAA+B;EAC/B,4CAA4C;AAC9C;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,mCAAmC;EACnC,aAAa;EACb,uDAAuD;EACvD,uCAAuC;AACzC;;AAEA;EACE,gDAAgD;EAChD,mBAAmB;EACnB,gBAAgB;EAChB,wBAAwB;AAC1B;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,yDAAyD;EACzD,qCAAqC;AACvC;;AAEA;EACE,yDAAyD;EACzD,aAAa;AACf;;AAEA;EACE,oCAAoC;EACpC,sBAAsB;AACxB;;AAEA;EACE,iEAAiE;AACnE;;AAEA;EACE,yDAAyD;EACzD,kBAAkB;EAClB,6DAA6D;AAC/D;;AAEA;EACE,0DAA0D;AAC5D;;AAEA;EACE,iEAAiE;AACnE;;AAEA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,oBAAoB;EACpB,oDAAoD;EACpD,YAAY;AACd;;AAEA;EACE,qBAAqB;EACrB,qCAAqC;AACvC;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,OAAO;EACP,gBAAgB;EAChB,mCAAmC;EACnC,YAAY;AACd;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,6DAA6D;EAC7D,YAAY;AACd;;AAEA;;EAEE,kBAAkB;EAClB,oBAAoB;EACpB,oBAAoB;EACpB,qBAAqB;EACrB,uCAAuC;AACzC;;AAEA;EACE,UAAU;EACV,uCAAuC;AACzC;;AAEA;EACE,iDAAiD;EACjD,8CAA8C;AAChD;;AAEA;EACE,aAAa;EACb,qBAAqB;EACrB,YAAY;EACZ,mBAAmB;EACnB,eAAe;AACjB;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,WAAW;EACX,qCAAqC;EACrC,gBAAgB;AAClB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,yBAAyB;EACzB,oCAAoC;EACpC,iBAAiB;EACjB,uBAAuB;EACvB,iCAAiC;AACnC;;AAEA;EACE,aAAa;EACb,8CAA8C;AAChD;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;EAChB,qCAAqC;AACvC;;AAEA;;EAEE,aAAa;AACf;;AAEA;EACE,eAAe;EACf,aAAa;EACb,cAAc;AAChB;;AAEA;EACE,+BAA+B;AACjC;;AAEA;EACE,gCAAgC;EAChC,6CAA6C;AAC/C;;AAEA;EACE,+BAA+B;AACjC;;AAEA;EACE,8CAA8C;EAC9C,mCAAmC;EACnC,sBAAsB;EACtB,8CAA8C;EAC9C,2CAA2C;EAC3C,uCAAuC;AACzC;;AAEA;EACE,eAAe;EACf,YAAY;AACd;;AAEA;EACE,aAAa;EACb,wCAAwC;EACxC,+CAA+C;EAC/C,mBAAmB;AACrB;;AAEA;;EAEE,WAAW;EACX,sBAAsB;AACxB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,WAAW;EACX,WAAW;EACX,cAAc;EACd,kBAAkB;AACpB;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,kBAAkB;EAClB,yBAAyB;EACzB,YAAY;AACd;;AAEA;EACE,qCAAqC;EACrC,gBAAgB;EAChB,gBAAgB;EAChB,aAAa;AACf;;AAEA;;EAEE,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;AAClB;;AAEA;EACE,wDAAwD;AAC1D;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,gBAAgB;EAChB,gBAAgB;AAClB;;AAEA;EACE,sCAAsC;EACtC,mCAAmC;AACrC;;AAEA;EACE,YAAY;EACZ,qCAAqC;EACrC,qCAAqC;AACvC;;AAEA;EACE,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,wBAAwB;AAC1B;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,oDAAoD;AACtD;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,YAAY;EACZ,+BAA+B;EAC/B,aAAa;AACf;;AAEA;EACE,kCAAkC;EAClC,WAAW;EACX,aAAa;EACb,uBAAuB;EACvB,sDAAsD;AACxD;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,SAAS;EACT,sBAAsB;EACtB,mBAAmB;EACnB,gCAAgC;EAChC,gDAAgD;EAChD,4CAA4C;AAC9C;;AAEA;EACE,gCAAgC;AAClC;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,qBAAqB;EACrB,mBAAmB;EACnB,2CAA2C;EAC3C,oCAAoC;AACtC;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,WAAW;EACX,iCAAiC;EACjC,mCAAmC;EACnC,oBAAoB;AACtB;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,sBAAsB;EACtB,sCAAsC;EACtC,gBAAgB;EAChB,iCAAiC;EACjC,mBAAmB;AACrB;;AAEA;;EAEE,YAAY;AACd;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,8CAA8C;AAChD;;AAEA;EACE,kBAAkB;EAClB,8CAA8C;AAChD;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,WAAW;EACX,mBAAmB;AACrB;;AAEA;EACE,SAAS;EACT,mBAAmB;EACnB,cAAc;EACd,YAAY;EACZ,gBAAgB;EAChB,uBAAuB;AACzB;;AAEA;EACE,YAAY;EACZ,QAAQ;EACR,YAAY;AACd;;AAEA;;EAEE,gBAAgB;EAChB,iCAAiC;EACjC,wBAAwB;AAC1B;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,gBAAgB;EAChB,qBAAqB;AACvB;;AAEA;;EAEE,kBAAkB;EAClB,8CAA8C;AAChD;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,MAAM;EACN,OAAO;AACT;;AAEA;;EAEE,+DAA+D;AACjE;;AAEA;;EAEE,gEAAgE;AAClE;;AAEA;;EAEE,wDAAwD;EACxD,2DAA2D;EAC3D,sBAAsB;AACxB;;AAEA;;EAEE,kDAAkD;EAClD,qDAAqD;EACrD,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,0CAA0C;EAC1C,WAAW;EACX,8DAA8D;AAChE;;AAEA;EACE,8CAA8C;EAC9C,sBAAsB;EACtB,eAAe;AACjB;;AAEA;EACE,eAAe;EACf,sBAAsB;EACtB,sBAAsB;EACtB,gCAAgC;EAChC,qCAAqC;EACrC,qDAAqD;EACrD,uDAAuD;EACvD,6EAA6E;EAC7E,aAAa;;EAEb,aAAa;EACb,8CAA8C;EAC9C,8DAA8D;AAChE;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,kDAAkD;AACpD;;AAEA;EACE,kDAAkD;AACpD;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,YAAY;EACZ,mBAAmB;EACnB,6BAA6B;EAC7B,yBAAyB;AAC3B;;AAEA;EACE,wBAAwB;EACxB,iBAAiB;EACjB,6CAA6C;AAC/C;;AAEA;EACE,YAAY;EACZ,gBAAgB;EAChB,kBAAkB;EAClB,aAAa;EACb,kBAAkB;EAClB,WAAW;EACX,2BAA2B;EAC3B,kBAAkB;AACpB;;AAEA;EACE,4CAA4C;AAC9C;;AAEA;EACE,uBAAuB;EACvB,YAAY;EACZ,YAAY;EACZ,sCAAsC;AACxC;;AAEA;EACE,4CAA4C;AAC9C;;AAEA;EACE,eAAe;EACf,kBAAkB;EAClB,eAAe;EACf,kCAAkC;AACpC;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,kCAAkC;EAClC,yDAAyD;EACzD,8CAA8C;EAC9C,4CAA4C;AAC9C;;AAEA;EACE,kBAAkB;EAClB,OAAO;EACP,gBAAgB;EAChB,wBAAwB;AAC1B;;AAEA;EACE,gDAAgD;EAChD,qCAAqC;AACvC;;AAEA;EACE,0CAA0C;EAC1C,6BAA6B;AAC/B;;AAEA;EACE,eAAe;AACjB;;AAEA;;;EAGE,YAAY;AACd;;AAEA;;;;;;EAME,eAAe;AACjB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2021 Ericsson and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n:root {\n  --memory-widget-disabled-opacity: 0.7;\n  --memory-widget-placeholder-text-line-height: 24px;\n}\n\n.memory-view-options-widget {\n  display: flex;\n  overflow: unset !important;\n}\n\n.memory-view-icon {\n  -webkit-mask: url(\"memory-view.svg\");\n  mask: url(\"memory-view.svg\");\n}\n\n.register-view-icon {\n  -webkit-mask: url(\"register-view.svg\");\n  mask: url(\"register-view.svg\");\n}\n\n.memory-view-icon.toolbar,\n.register-view-icon.toolbar {\n  display: inline-block;\n  background-color: var(--theia-settings-headerForeground);\n  mask-size: 16px 15px;\n  mask-repeat: no-repeat;\n  mask-position: center center;\n  -webkit-mask-size: 16px 15px;\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center center;\n  min-width: var(--theia-icon-size);\n  min-height: var(--theia-icon-size);\n  cursor: pointer;\n}\n\n.memory-lock-icon {\n  -webkit-mask: url(\"memory-lock.svg\");\n  mask: url(\"memory-lock.svg\");\n}\n\n.register-lock-icon {\n  -webkit-mask: url(\"register-lock.svg\");\n  mask: url(\"register-lock.svg\");\n}\n\n.t-mv-container {\n  display: flex;\n  flex-direction: column;\n  align-items: left;\n  box-sizing: border-box;\n  height: 100%;\n  width: 100%;\n  padding: 10px;\n  overflow: hidden;\n}\n\n.t-mv-container button:focus {\n  /* Fixes a padding issue when clicking a button */\n  border: none;\n}\n\n.memory-view-wrapper {\n  display: flex;\n  flex-direction: column;\n}\n\n.t-mv-memory-container {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  background-color: var(--theia-editor-background);\n  height: 100%;\n  white-space: nowrap;\n}\n\n.t-mv-memory-container:focus {\n  outline: none;\n}\n\n.t-mv-memory-container.frozen,\n.t-mv-memory-container.frozen:focus {\n  font-style: italic;\n  opacity: var(--memory-widget-disabled-opacity) !important;\n}\n\n.t-mv-memory-fetch-error {\n  margin: var(--theia-ui-padding);\n  color: var(--theia-editorWarning-foreground);\n}\n\n.t-mv-memory-fetch-error.show {\n  display: block;\n}\n\n.t-mv-memory-fetch-error.hide {\n  display: none;\n}\n\n.t-mv-header {\n  margin-top: var(--theia-ui-padding);\n  display: grid;\n  box-shadow: 0px 6px 5px -5px var(--theia-widget-shadow);\n  padding-bottom: var(--theia-ui-padding);\n}\n\n.t-mv-header-label {\n  background-color: var(--theia-editor-background);\n  border-radius: 10px;\n  font-weight: 400;\n  padding: 2px 5px 2px 5px;\n}\n\n.t-mv-view {\n  width: 100%;\n}\n\n.t-mv-view .eight-bits.changed {\n  background-color: var(--theia-memoryInspector-foreground);\n  color: var(--theia-editor-background);\n}\n\n.t-mv-view .eight-bits.changed:hover {\n  background-color: var(--theia-memoryInspector-foreground);\n  opacity: 0.85;\n}\n\n.t-mv-view .eight-bits {\n  border-bottom: 1px solid transparent;\n  box-sizing: border-box;\n}\n\n.t-mv-view .eight-bits:not(.changed):not(.highlight):hover {\n  background-color: var(--theia-editor-inactiveSelectionBackground);\n}\n\n.t-mv-memory-container:focus .eight-bits.highlight {\n  background-color: var(--theia-editor-selectionBackground);\n  border-radius: 1px;\n  border-bottom: solid 1px var(--theia-editorCursor-foreground);\n}\n\n.t-mv-memory-container:focus .eight-bits.changed.highlight {\n  background-color: var(--theia-memoryInspector-focusBorder);\n}\n\n.t-mv-memory-container:not(:focus) .eight-bits.highlight {\n  background-color: var(--theia-editor-inactiveSelectionBackground);\n}\n\n.t-mv-view .eight-bits.modified {\n  outline-width: 1px;\n  outline-style: solid;\n  outline-offset: -1px;\n  outline-color: var(--theia-editorWarning-foreground);\n  border: none;\n}\n\n.t-mv-view .byte-group:not(:first-of-type) {\n  display: inline-block;\n  padding-left: var(--theia-ui-padding);\n}\n\n.t-mv-view .data-address-col {\n  width: unset;\n}\n\n.t-mv-view-container {\n  flex: 1;\n  overflow: hidden;\n  margin-top: var(--theia-ui-padding);\n  height: 100%;\n}\n\n.t-mv-view-container thead {\n  position: absolute;\n}\n\n.t-mv-view-container .ps__rail-y {\n  left: unset !important;\n}\n\n.t-mv-view-container:focus {\n  /* Fixes a padding issue when clicking inside the container */\n  border: none;\n}\n\n.memory-diff-select .theia-select:focus,\n.t-mv-container .theia-select:focus {\n  outline-width: 1px;\n  outline-style: solid;\n  outline-offset: -1px;\n  opacity: 1 !important;\n  outline-color: var(--theia-focusBorder);\n}\n\n.t-mv-settings-container {\n  flex: none;\n  padding-bottom: var(--theia-ui-padding);\n}\n\n.t-mv-settings-container .t-mv-settings-group-header {\n  padding-bottom: calc(var(--theia-ui-padding) / 2);\n  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);\n}\n\n.memory-widget-toolbar {\n  display: flex;\n  flex-flow: row nowrap;\n  height: 24px;\n  align-items: center;\n  max-width: 100%;\n}\n\n.memory-widget-toolbar * {\n  flex: none;\n}\n\n.memory-widget-toolbar .memory-widget-header-click-zone {\n  min-width: 0;\n}\n\n.memory-widget-header-click-zone * {\n  flex: none;\n}\n\n.memory-widget-auto-updates-container {\n  width: 16px;\n  margin-right: var(--theia-ui-padding);\n  font-size: 1.3em;\n}\n\n.toggle-settings-container {\n  margin-left: auto;\n}\n\n.toggle-settings-container .toggle-settings-click-zone {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  margin-left: var(--theia-ui-padding);\n  user-select: none;\n  box-sizing: content-box;\n  border-top: 1px solid transparent;\n}\n\n.toggle-settings-container .toggle-settings-click-zone:focus {\n  outline: none;\n  border-top: 1px solid var(--theia-focusBorder);\n}\n\n.toggle-settings-container .toggle-settings-click-zone span {\n  white-space: nowrap;\n}\n\n.toggle-settings-container .codicon-settings-gear {\n  font-size: 1.1em;\n  margin-right: var(--theia-ui-padding);\n}\n\n.toggle-settings-container + div > .t-mv-settings-group-header:first-of-type,\n.toggle-settings-container + .t-mv-settings-group-header {\n  margin-top: 0;\n}\n\n.t-mv-wrapper button.theia-button {\n  min-width: 30px;\n  margin: unset;\n  padding: unset;\n}\n\n.view-group {\n  grid-template-columns: 70px 1fr;\n}\n\n.settings-group {\n  grid-template-columns: 110px 1fr;\n  margin-top: calc(2 * var(--theia-ui-padding));\n}\n\n.ascii-group {\n  grid-template-columns: 70px 1fr;\n}\n\n.t-mv-group.view-group {\n  grid-template-columns: 3fr repeat(2, 1fr) 30px;\n  grid-template-rows: repeat(2, 24px);\n  grid-auto-flow: column;\n  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);\n  border-top: 1px solid hsla(0, 0%, 50%, 0.5);\n  padding-bottom: var(--theia-ui-padding);\n}\n\n.view-group-go-button {\n  grid-row: 2 / 3;\n  height: 100%;\n}\n\n.t-mv-group {\n  display: grid;\n  grid-column-gap: var(--theia-ui-padding);\n  grid-row-gap: calc(var(--theia-ui-padding) / 2);\n  align-items: center;\n}\n\n.t-mv-group .theia-select,\n.t-mv-group .theia-input {\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.t-mv-group .multi-select-bar {\n  min-height: 19px;\n}\n\n.t-mv-group .multi-select-label {\n  line-height: 17px;\n}\n\n.t-mv-input-group.button-wrapper {\n  margin: 2px;\n  width: 100%;\n  display: block;\n  text-align: center;\n}\n\n.t-mv-input-group.button-wrapper .theia-button.main {\n  margin: var(--theia-ui-padding) 0 0 0;\n}\n\ntable.t-mv-view {\n  align-self: center;\n  border-collapse: collapse;\n  border: none;\n}\n\ntable.t-mv-view {\n  font-size: var(--theia-ui-font-size1);\n  font-weight: 400;\n  text-align: left;\n  padding: 10px;\n}\n\ntable.t-mv-view td,\ntable.t-mv-view th {\n  font-family: monospace;\n  padding-right: 15px;\n  white-space: pre;\n}\n\ntable.t-mv-view .t-mv-view-row.t-mv-view-row-highlight {\n  border-bottom: 1px var(--theia-editorGroup-border) solid;\n}\n\ntable.t-mv-view .t-mv-view-row:hover {\n  background-color: var(--theia-sideBar-background);\n}\n\ntable.t-mv-view .t-mv-view-address {\n  font-weight: 700;\n  text-align: left;\n}\n\n.t-mv-settings-group-header.small-margin {\n  margin-bottom: var(--theia-ui-padding);\n  margin-top: var(--theia-ui-padding);\n}\n\n.t-mv-variable-label:not(:last-of-type)::after {\n  content: \",\";\n  margin-right: var(--theia-ui-padding);\n  color: var(--theia-editor-foreground);\n}\n\n.mw-input-select {\n  position: relative;\n  height: 100%;\n}\n\n.mw-input-select .theia-input {\n  position: absolute;\n  z-index: 1;\n  width: calc(100% - 18px);\n}\n\n.mw-input-select .theia-input:focus {\n  outline: unset;\n}\n\n.mw-input-select .theia-select {\n  position: absolute;\n  z-index: 0;\n  height: calc(var(--theia-content-line-height) + 2px);\n}\n\n.mw-input-select .theia-select:focus {\n  outline: unset;\n}\n\n.memory-layout-widget {\n  display: flex;\n  flex-direction: column;\n}\n\n.memory-dock-panel {\n  flex-grow: 1;\n  margin: var(--theia-ui-padding);\n  margin-top: 0;\n}\n\n.memory-edit-button-container {\n  padding: var(--theia-ui-padding) 0;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  box-shadow: 0px 6px 6px 6px var(--theia-widget-shadow);\n}\n\n.memory-edit-button-container .memory-edit-error {\n  width: 100%;\n  height: 100%;\n  bottom: 0;\n  box-sizing: border-box;\n  white-space: normal;\n  padding: var(--theia-ui-padding);\n  background-color: var(--theia-editor-background);\n  color: var(--theia-editorWarning-foreground);\n}\n\n.memory-diff-select {\n  padding: var(--theia-ui-padding);\n}\n\n.memory-diff-select-wrapper {\n  display: flex;\n  flex-flow: row wrap;\n  justify-content: center;\n  align-content: center;\n  align-items: center;\n  border-top: 1px solid hsla(0, 0%, 50%, 0.5);\n  padding-top: var(--theia-ui-padding);\n}\n\n.diff-select-input-wrapper {\n  display: flex;\n  justify-content: space-around;\n  align-content: center;\n  align-items: center;\n  flex-flow: row wrap;\n}\n\n.memory-diff-select-go {\n  min-width: unset;\n  text-align: center;\n  width: 30px;\n  margin: 0 var(--theia-ui-padding);\n  margin-top: var(--theia-ui-padding);\n  align-self: flex-end;\n}\n\n.t-mv-diff-select-widget-options-wrapper {\n  display: grid;\n  grid-template-rows: 12px 24px;\n  grid-auto-flow: column;\n  gap: calc(var(--theia-ui-padding) / 2);\n  max-width: 215px;\n  margin: 0 var(--theia-ui-padding);\n  align-items: center;\n}\n\n.t-mv-diff-select-widget-options-wrapper .t-mv-label,\n.t-mv-diff-select-widget-options-wrapper .t-mv-select {\n  min-width: 0;\n}\n\n.t-mv-diff-select-widget-options-wrapper .t-mv-select {\n  height: 100%;\n}\n\n.theia-input:disabled {\n  opacity: var(--memory-widget-disabled-opacity);\n}\n\n.t-mv-label.disabled {\n  font-style: italic;\n  opacity: var(--memory-widget-disabled-opacity);\n}\n\n.memory-widget-header {\n  font-weight: normal;\n}\n\n.memory-widget-header-click-zone {\n  display: flex;\n  flex: 1 1 0;\n  align-items: center;\n}\n\n.memory-widget-header-click-zone .memory-widget-header {\n  margin: 0;\n  white-space: nowrap;\n  flex-shrink: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.memory-widget-header-click-zone input {\n  flex-grow: 1;\n  width: 0;\n  height: 18px;\n}\n\n.memory-widget-toolbar .fa.fa-pencil,\n.memory-widget-toolbar .fa.fa-save {\n  font-size: 1.2em;\n  margin: 0 var(--theia-ui-padding);\n  transition: opacity 0.3s;\n}\n\n.memory-widget-header-click-zone:hover .fa.fa-pencil {\n  opacity: 1;\n}\n\n.memory-widget-header-click-zone .fa.fa-pencil {\n  opacity: 0;\n}\n\n.memory-widget-header-click-zone .theia-input {\n  font-size: 1.5em;\n  /* same as theia h2 */\n}\n\n.t-mv-settings-group-header.disabled,\n.memory-widget-header.disabled {\n  font-style: italic;\n  opacity: var(--memory-widget-disabled-opacity);\n}\n\n.t-mv-view-container span {\n  display: inline-block;\n}\n\n.t-mv-diffed-ascii:not(:last-of-type) {\n  margin-right: var(--theia-ui-padding);\n}\n\n.t-mv-view-container span.different {\n  position: relative;\n}\n\n.t-mv-view-container span.different::before {\n  content: \"\";\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  top: 0;\n  left: 0;\n}\n\n.t-mv-view-container span.before.different::before,\n.t-mv-view-container .before.different {\n  background-color: var(--theia-memoryDiff-removedTextBackground);\n}\n\n.t-mv-view-container span.after.different::before,\n.t-mv-view-container .after.different {\n  background-color: var(--theia-memoryDiff-insertedTextBackground);\n}\n\n.t-mv-view-container span.before.different.hc::before,\n.t-mv-view-container .before.different.hc {\n  border-top: dotted 1px var(--theia-contrastActiveBorder);\n  border-bottom: dotted 1px var(--theia-contrastActiveBorder);\n  box-sizing: border-box;\n}\n\n.t-mv-view-container span.after.different.hc::before,\n.t-mv-view-container .after.different.hc {\n  border-top: dashed 1px var(--theia-contrastBorder);\n  border-bottom: dashed 1px var(--theia-contrastBorder);\n  box-sizing: border-box;\n}\n\n.memory-dockpanel-placeholder {\n  position: absolute;\n  top: 10px;\n  padding: calc(2 * var(--theia-ui-padding));\n  width: 100%;\n  line-height: var(--memory-widget-placeholder-text-line-height);\n}\n\n.memory-dockpanel-placeholder i.toolbar {\n  background-color: var(--theia-errorForeground);\n  vertical-align: middle;\n  cursor: default;\n}\n\n.t-mv-hover {\n  position: fixed;\n  font-family: monospace;\n  box-sizing: border-box;\n  padding: var(--theia-ui-padding);\n  font-size: var(--theia-ui-font-size1);\n  background: var(--theia-editorHoverWidget-background);\n  border: 2px solid var(--theia-editorHoverWidget-border);\n  /* This ensures that the hover is visible over the widget even when focused */\n  z-index: 1000;\n\n  display: grid;\n  grid-template-columns: max-content max-content;\n  gap: calc(var(--theia-ui-padding) / 2) var(--theia-ui-padding);\n}\n\n.t-mv-hover.hidden {\n  display: none;\n}\n\n.t-mv-hover-key {\n  color: var(--theia-symbolIcon-variableForeground);\n}\n\n.t-mv-hover-value {\n  color: var(--theia-variable-number-variable-color);\n}\n\n.t-mv-hover-value.utf8 {\n  color: var(--theia-variable-string-variable-color);\n}\n\n.mw-more-memory-select {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-style: italic;\n  opacity: 0.7;\n}\n\n.mw-more-memory-select-top {\n  display: flex;\n  justify-content: center;\n  height: 16px;\n  padding-bottom: 1px;\n  transition: border-color 0.1s;\n  border-color: transparent;\n}\n\n.mw-more-memory-select-top:hover {\n  border-bottom: 1px solid;\n  padding-bottom: 0;\n  border-color: var(--theia-sideBar-foreground);\n}\n\n.mw-more-memory-select select {\n  border: none;\n  background: none;\n  border-radius: 3px;\n  margin: 0 2px;\n  position: relative;\n  bottom: 1px;\n  transition: background 0.1s;\n  font-style: italic;\n}\n\n.mw-more-memory-select select:hover {\n  background: var(--theia-dropdown-background);\n}\n\n.mw-more-memory-select button {\n  background-color: unset;\n  border: none;\n  padding: 2px;\n  color: var(--theia-sideBar-foreground);\n}\n\n.mw-bookmarks-bar {\n  padding: calc(var(--theia-ui-padding) / 2) 0;\n}\n\n.mw-bookmarks-bar .bookmark-container {\n  display: inline;\n  position: relative;\n  cursor: pointer;\n  padding: 0 var(--theia-ui-padding);\n}\n\n.mw-bookmarks-bar .bookmark-container .bookmark-radio-button {\n  height: 100%;\n  z-index: -1;\n  border-radius: 3px;\n  padding: 0 var(--theia-ui-padding);\n  background-color: var(--theia-button-secondaryBackground);\n  color: var(--theia-button-secondaryForeground);\n  box-shadow: 0 2px 0 rgba(187, 187, 187, 0.4);\n}\n\n.mw-bookmarks-bar input {\n  position: absolute;\n  left: 0;\n  appearance: none;\n  -webkit-appearance: none;\n}\n\n.mw-bookmarks-bar input:checked ~ .bookmark-radio-button {\n  background-color: var(--theia-button-background);\n  color: var(--theia-button-foreground);\n}\n\n.diff-options-widget .t-mv-group.view-group {\n  grid-template-columns: repeat(2, 1fr) 30px;\n  grid-template-rows: 18px 24px;\n}\n\n#memory-table-widget.editable .t-mv-view .eight-bits:hover {\n  cursor: pointer;\n}\n\n#memory-table-widget.editable\n  .t-mv-memory-container:focus\n  .eight-bits.highlight {\n  cursor: text;\n}\n\n.diff-options-widget .memory-widget-header-click-zone,\n.diff-options-widget .toggle-settings-click-zone,\n#memory-layout-widget .memory-widget-header-click-zone,\n#memory-layout-widget .toggle-settings-click-zone,\n#memory-layout-widget .fa-unlock,\n#memory-layout-widget .fa-lock {\n  cursor: pointer;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/utils/multi-select-bar.css":
/*!************************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/utils/multi-select-bar.css ***!
  \************************************************************************************************************************/
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
 * Copyright (C) 2021 Ericsson and others.
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

.multi-select-bar {
  display: flex;
  flex-flow: row nowrap;
  user-select: none;
  box-sizing: border-box;
}

.multi-select-checkbox-wrapper {
  display: flex;
  position: relative;
  flex: auto;
  text-align: center;
}

.multi-select-label {
  height: 100%;
  flex: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  padding: 0 var(--theia-ui-padding);
  background-color: var(--theia-editor-background);
  border-color: var(--theia-dropdown-border);
  box-sizing: border-box;
}

.multi-select-checkbox-wrapper input:checked ~ .multi-select-label {
  background-color: var(--theia-input-background);
  border-color: var(--theia-sideBar-foreground);
  text-decoration: underline;
  font-weight: bolder;
}

.multi-select-checkbox {
  appearance: none;
  -webkit-appearance: none;
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
}
`, "",{"version":3,"sources":["webpack://./../../packages/memory-inspector/src/browser/utils/multi-select-bar.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,aAAa;EACb,qBAAqB;EACrB,iBAAiB;EACjB,sBAAsB;AACxB;;AAEA;EACE,aAAa;EACb,kBAAkB;EAClB,UAAU;EACV,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,UAAU;EACV,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,iBAAiB;EACjB,kCAAkC;EAClC,gDAAgD;EAChD,0CAA0C;EAC1C,sBAAsB;AACxB;;AAEA;EACE,+CAA+C;EAC/C,6CAA6C;EAC7C,0BAA0B;EAC1B,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;EAChB,wBAAwB;EACxB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,SAAS;EACT,YAAY;EACZ,WAAW;EACX,eAAe;AACjB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2021 Ericsson and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.multi-select-bar {\n  display: flex;\n  flex-flow: row nowrap;\n  user-select: none;\n  box-sizing: border-box;\n}\n\n.multi-select-checkbox-wrapper {\n  display: flex;\n  position: relative;\n  flex: auto;\n  text-align: center;\n}\n\n.multi-select-label {\n  height: 100%;\n  flex: auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid;\n  padding: 0 var(--theia-ui-padding);\n  background-color: var(--theia-editor-background);\n  border-color: var(--theia-dropdown-border);\n  box-sizing: border-box;\n}\n\n.multi-select-checkbox-wrapper input:checked ~ .multi-select-label {\n  background-color: var(--theia-input-background);\n  border-color: var(--theia-sideBar-foreground);\n  text-decoration: underline;\n  font-weight: bolder;\n}\n\n.multi-select-checkbox {\n  appearance: none;\n  -webkit-appearance: none;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  height: 100%;\n  width: 100%;\n  cursor: pointer;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/memory-inspector/src/browser/register-widget/register-widget.css":
/*!***************************************************************************************!*\
  !*** ../../packages/memory-inspector/src/browser/register-widget/register-widget.css ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_register_widget_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./register-widget.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/register-widget/register-widget.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_register_widget_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_register_widget_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/memory-inspector/src/browser/style/index.css":
/*!*******************************************************************!*\
  !*** ../../packages/memory-inspector/src/browser/style/index.css ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/memory-inspector/src/browser/utils/multi-select-bar.css":
/*!******************************************************************************!*\
  !*** ../../packages/memory-inspector/src/browser/utils/multi-select-bar.css ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_multi_select_bar_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./multi-select-bar.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/memory-inspector/src/browser/utils/multi-select-bar.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_multi_select_bar_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_multi_select_bar_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/memory-inspector/src/browser/style/memory-lock.svg":
/*!*************************************************************************!*\
  !*** ../../packages/memory-inspector/src/browser/style/memory-lock.svg ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PCEtLSAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioKICogQ29weXJpZ2h0IChDKSAyMDIxIEVyaWNzc29uIGFuZCBvdGhlcnMuCiAqCiAqIFRoaXMgcHJvZ3JhbSBhbmQgdGhlIGFjY29tcGFueWluZyBtYXRlcmlhbHMgYXJlIG1hZGUgYXZhaWxhYmxlIHVuZGVyIHRoZQogKiB0ZXJtcyBvZiB0aGUgRWNsaXBzZSBQdWJsaWMgTGljZW5zZSB2LiAyLjAgd2hpY2ggaXMgYXZhaWxhYmxlIGF0CiAqIGh0dHA6Ly93d3cuZWNsaXBzZS5vcmcvbGVnYWwvZXBsLTIuMC4KICoKICogVGhpcyBTb3VyY2UgQ29kZSBtYXkgYWxzbyBiZSBtYWRlIGF2YWlsYWJsZSB1bmRlciB0aGUgZm9sbG93aW5nIFNlY29uZGFyeQogKiBMaWNlbnNlcyB3aGVuIHRoZSBjb25kaXRpb25zIGZvciBzdWNoIGF2YWlsYWJpbGl0eSBzZXQgZm9ydGggaW4gdGhlIEVjbGlwc2UKICogUHVibGljIExpY2Vuc2Ugdi4gMi4wIGFyZSBzYXRpc2ZpZWQ6IEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLCB2ZXJzaW9uIDIKICogd2l0aCB0aGUgR05VIENsYXNzcGF0aCBFeGNlcHRpb24gd2hpY2ggaXMgYXZhaWxhYmxlIGF0CiAqIGh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvY2xhc3NwYXRoL2xpY2Vuc2UuaHRtbC4KICoKICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEVQTC0yLjAgT1IgR1BMLTIuMC1vbmx5IFdJVEggQ2xhc3NwYXRoLWV4Y2VwdGlvbi0yLjAKICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqLyAtLT4KCjxzdmcgd2lkdGg9IjM2OSIgaGVpZ2h0PSIzNjkiIHZpZXdCb3g9IjAgMCAzNjkgMzY5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMzUuNzE4MyA5OC42MDA5TDE4NC41IDEyLjcwMTdMMzMzLjI4MiA5OC42MDA4VjI3MC4zOTlMMTg0LjUgMzU2LjI5OEwzNS43MTgzIDI3MC4zOTlWOTguNjAwOVoiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMjIiLz4KPHJlY3QgeD0iOTQiIHk9IjE1MyIgd2lkdGg9IjE4MSIgaGVpZ2h0PSIxMTQiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTg0Ljc1NiA2MUMyMjIuNzU2IDYxIDI1My41NjEgOTEuODA1MiAyNTMuNTYxIDEyOS44MDVMMjUzLjU2MSAyMTkuNzIxSDExNS45NTFWMTI5Ljg1TDExNS45NTEgMTI5LjgwNUMxMTUuOTUxIDkxLjgwNTIgMTQ2Ljc1NiA2MSAxODQuNzU2IDYxWk0yMjguMzg0IDEyOS41NjdDMjI4LjM4MyAxMjkuNjAyIDIyOC4zODMgMTI5LjYzNyAyMjguMzgzIDEyOS42NzJWMTg2LjkyNEgxNDAuNDM0VjEyOS40NTdIMTQwLjQzNUMxNDAuNDM1IDEwNS4xNzEgMTYwLjEyMyA4NS40ODM2IDE4NC40MDkgODUuNDgzNkMyMDguNjk2IDg1LjQ4MzYgMjI4LjM4NCAxMDUuMTcyIDIyOC4zODQgMTI5LjQ1OEMyMjguMzg0IDEyOS40OTQgMjI4LjM4NCAxMjkuNTMxIDIyOC4zODQgMTI5LjU2N1oiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=";

/***/ }),

/***/ "../../packages/memory-inspector/src/browser/style/memory-view.svg":
/*!*************************************************************************!*\
  !*** ../../packages/memory-inspector/src/browser/style/memory-view.svg ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PCEtLSAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioKICogQ29weXJpZ2h0IChDKSAyMDIxIEVyaWNzc29uIGFuZCBvdGhlcnMuCiAqCiAqIFRoaXMgcHJvZ3JhbSBhbmQgdGhlIGFjY29tcGFueWluZyBtYXRlcmlhbHMgYXJlIG1hZGUgYXZhaWxhYmxlIHVuZGVyIHRoZQogKiB0ZXJtcyBvZiB0aGUgRWNsaXBzZSBQdWJsaWMgTGljZW5zZSB2LiAyLjAgd2hpY2ggaXMgYXZhaWxhYmxlIGF0CiAqIGh0dHA6Ly93d3cuZWNsaXBzZS5vcmcvbGVnYWwvZXBsLTIuMC4KICoKICogVGhpcyBTb3VyY2UgQ29kZSBtYXkgYWxzbyBiZSBtYWRlIGF2YWlsYWJsZSB1bmRlciB0aGUgZm9sbG93aW5nIFNlY29uZGFyeQogKiBMaWNlbnNlcyB3aGVuIHRoZSBjb25kaXRpb25zIGZvciBzdWNoIGF2YWlsYWJpbGl0eSBzZXQgZm9ydGggaW4gdGhlIEVjbGlwc2UKICogUHVibGljIExpY2Vuc2Ugdi4gMi4wIGFyZSBzYXRpc2ZpZWQ6IEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLCB2ZXJzaW9uIDIKICogd2l0aCB0aGUgR05VIENsYXNzcGF0aCBFeGNlcHRpb24gd2hpY2ggaXMgYXZhaWxhYmxlIGF0CiAqIGh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvY2xhc3NwYXRoL2xpY2Vuc2UuaHRtbC4KICoKICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEVQTC0yLjAgT1IgR1BMLTIuMC1vbmx5IFdJVEggQ2xhc3NwYXRoLWV4Y2VwdGlvbi0yLjAKICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqLyAtLT4KCjxzdmcgd2lkdGg9IjM2OSIgaGVpZ2h0PSIzNjkiIHZpZXdCb3g9IjAgMCAzNjkgMzY5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTMxLjggMjUzQzEyNS45MzMgMjUzIDEyMS4xMzMgMjUyLjggMTE3LjQgMjUyLjRDMTEzLjggMjUyIDEwOS45MzMgMjUxLjIgMTA1LjggMjUwQzEwMS40IDI0OC44IDk3Ljg2NjcgMjQ3LjA2NyA5NS4yIDI0NC44QzkyLjY2NjcgMjQyLjQgOTAuNTMzMyAyMzkuMDY3IDg4LjggMjM0LjhDODcuMDY2NyAyMzAuOCA4Ni4yIDIyNS44IDg2LjIgMjE5LjhWMTU0LjJDODYuMiAxNDguMiA4Ny4wNjY3IDE0Mi45MzMgODguOCAxMzguNEM5MC41MzMzIDEzMy44NjcgOTIuOCAxMzAuMjY3IDk1LjYgMTI3LjZDOTguMTMzMyAxMjUuMzMzIDEwMS40NjcgMTIzLjUzMyAxMDUuNiAxMjIuMkMxMDkuODY3IDEyMC43MzMgMTE0LjEzMyAxMTkuOCAxMTguNCAxMTkuNEMxMjMuMiAxMTkuMTMzIDEyNy42NjcgMTE5IDEzMS44IDExOUMxMzcuNjY3IDExOSAxNDIuNCAxMTkuMiAxNDYgMTE5LjZDMTQ5LjczMyAxMjAgMTUzLjY2NyAxMjAuOCAxNTcuOCAxMjJDMTYyLjIgMTIzLjMzMyAxNjUuNzMzIDEyNS4yIDE2OC40IDEyNy42QzE3MS4yIDEzMCAxNzMuNDY3IDEzMy40IDE3NS4yIDEzNy44QzE3Ni45MzMgMTQyLjIgMTc3LjggMTQ3LjYgMTc3LjggMTU0VjIxOS44QzE3Ny44IDIyNS4yNjcgMTc2LjkzMyAyMzAuMTMzIDE3NS4yIDIzNC40QzE3My40NjcgMjM4LjY2NyAxNzEuMiAyNDIgMTY4LjQgMjQ0LjRDMTY1LjczMyAyNDYuNjY3IDE2Mi4zMzMgMjQ4LjUzMyAxNTguMiAyNTBDMTU0LjA2NyAyNTEuMzMzIDE0OS44NjcgMjUyLjEzMyAxNDUuNiAyNTIuNEMxNDEuODY3IDI1Mi44IDEzNy4yNjcgMjUzIDEzMS44IDI1M1pNMTMyLjIgMjQxLjJDMTM5LjI2NyAyNDEuMiAxNDQuNzMzIDI0MC43MzMgMTQ4LjYgMjM5LjhDMTUyLjQ2NyAyMzguNzMzIDE1NS4yNjcgMjM2LjczMyAxNTcgMjMzLjhDMTU4LjczMyAyMzAuODY3IDE1OS42IDIyNi41MzMgMTU5LjYgMjIwLjhWMTUyLjhDMTU5LjYgMTQ2LjUzMyAxNTguNjY3IDE0MS44NjcgMTU2LjggMTM4LjhDMTU1LjA2NyAxMzUuNiAxNTIuMjY3IDEzMy40NjcgMTQ4LjQgMTMyLjRDMTQ0LjY2NyAxMzEuMzMzIDEzOS4yIDEzMC44IDEzMiAxMzAuOEMxMjQuNjY3IDEzMC44IDExOS4wNjcgMTMxLjMzMyAxMTUuMiAxMzIuNEMxMTEuNDY3IDEzMy40NjcgMTA4LjczMyAxMzUuNiAxMDcgMTM4LjhDMTA1LjI2NyAxNDEuODY3IDEwNC40IDE0Ni41MzMgMTA0LjQgMTUyLjhWMjIwLjhDMTA0LjQgMjI2LjUzMyAxMDUuMjY3IDIzMC44NjcgMTA3IDIzMy44QzEwOC44NjcgMjM2LjczMyAxMTEuNzMzIDIzOC43MzMgMTE1LjYgMjM5LjhDMTE5LjQ2NyAyNDAuNzMzIDEyNSAyNDEuMiAxMzIuMiAyNDEuMlpNMjI4LjAxNiAyMDEuMkwxOTQuMDE2IDE1NC4ySDIxMy44MTZMMjM3LjgxNiAxODkuNkwyNjIuMDE2IDE1NC4ySDI4MS44MTZMMjQ3LjgxNiAyMDEuMkwyODMuODE2IDI1MUgyNjQuMDE2TDIzNy44MTYgMjEyLjhMMjExLjgxNiAyNTFIMTkyLjAxNkwyMjguMDE2IDIwMS4yWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTM1LjcxODMgOTguNjAwOUwxODQuNSAxMi43MDE3TDMzMy4yODIgOTguNjAwOFYyNzAuMzk5TDE4NC41IDM1Ni4yOThMMzUuNzE4MyAyNzAuMzk5Vjk4LjYwMDlaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIyIi8+Cjwvc3ZnPgo=";

/***/ }),

/***/ "../../packages/memory-inspector/src/browser/style/register-lock.svg":
/*!***************************************************************************!*\
  !*** ../../packages/memory-inspector/src/browser/style/register-lock.svg ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PCEtLSAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioKICogQ29weXJpZ2h0IChDKSAyMDIxIEVyaWNzc29uIGFuZCBvdGhlcnMuCiAqCiAqIFRoaXMgcHJvZ3JhbSBhbmQgdGhlIGFjY29tcGFueWluZyBtYXRlcmlhbHMgYXJlIG1hZGUgYXZhaWxhYmxlIHVuZGVyIHRoZQogKiB0ZXJtcyBvZiB0aGUgRWNsaXBzZSBQdWJsaWMgTGljZW5zZSB2LiAyLjAgd2hpY2ggaXMgYXZhaWxhYmxlIGF0CiAqIGh0dHA6Ly93d3cuZWNsaXBzZS5vcmcvbGVnYWwvZXBsLTIuMC4KICoKICogVGhpcyBTb3VyY2UgQ29kZSBtYXkgYWxzbyBiZSBtYWRlIGF2YWlsYWJsZSB1bmRlciB0aGUgZm9sbG93aW5nIFNlY29uZGFyeQogKiBMaWNlbnNlcyB3aGVuIHRoZSBjb25kaXRpb25zIGZvciBzdWNoIGF2YWlsYWJpbGl0eSBzZXQgZm9ydGggaW4gdGhlIEVjbGlwc2UKICogUHVibGljIExpY2Vuc2Ugdi4gMi4wIGFyZSBzYXRpc2ZpZWQ6IEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLCB2ZXJzaW9uIDIKICogd2l0aCB0aGUgR05VIENsYXNzcGF0aCBFeGNlcHRpb24gd2hpY2ggaXMgYXZhaWxhYmxlIGF0CiAqIGh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvY2xhc3NwYXRoL2xpY2Vuc2UuaHRtbC4KICoKICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEVQTC0yLjAgT1IgR1BMLTIuMC1vbmx5IFdJVEggQ2xhc3NwYXRoLWV4Y2VwdGlvbi0yLjAKICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqLyAtLT4KCjxzdmcgd2lkdGg9IjM2OSIgaGVpZ2h0PSIzNjkiIHZpZXdCb3g9IjAgMCAzNjkgMzY5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB4PSIxNSIgeT0iNTUiIHdpZHRoPSI2MiIgaGVpZ2h0PSI0OSIgcng9IjEzIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIyOTMiIHk9IjU1IiB3aWR0aD0iNjIiIGhlaWdodD0iNDkiIHJ4PSIxMyIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTUiIHk9IjI2NSIgd2lkdGg9IjYyIiBoZWlnaHQ9IjQ5IiByeD0iMTMiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjI5MyIgeT0iMjY1IiB3aWR0aD0iNjIiIGhlaWdodD0iNDkiIHJ4PSIxMyIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTUiIHk9IjE5NSIgd2lkdGg9IjYyIiBoZWlnaHQ9IjQ5IiByeD0iMTMiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjI5MyIgeT0iMTk1IiB3aWR0aD0iNjIiIGhlaWdodD0iNDkiIHJ4PSIxMyIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTUiIHk9IjEyNSIgd2lkdGg9IjYyIiBoZWlnaHQ9IjQ5IiByeD0iMTMiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjI5MyIgeT0iMTI1IiB3aWR0aD0iNjIiIGhlaWdodD0iNDkiIHJ4PSIxMyIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTAxIiB5PSIxNjAiIHdpZHRoPSIxNjciIGhlaWdodD0iMTE4IiBmaWxsPSJibGFjayIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIzOS41NjEgMTk5LjU3NlYxMjYuMTcxQzIzOS41NjEgOTUuMTQ4NiAyMTUuMjU5IDcwIDE4NS4yODEgNzBDMTU1LjMwMiA3MCAxMzEgOTUuMTQ4NiAxMzEgMTI2LjE3MVYxOTkuNTc2SDIzOS41NjFaTTIxOS42OTkgMTI1Ljg4N0MyMTkuNjk5IDEyNS45NTQgMjE5LjY5OCAxMjYuMDIgMjE5LjY5OCAxMjYuMDg2VjE3Mi44MDFIMTUwLjMxNVYxMjUuODg3SDE1MC4zMTZDMTUwLjMxNiAxMDYuMDYgMTY1Ljg0OCA4OS45ODc4IDE4NS4wMDcgODkuOTg3OEMyMDQuMTY3IDg5Ljk4NzggMjE5LjY5OSAxMDYuMDYxIDIxOS42OTkgMTI1Ljg4N1oiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHdpZHRoPSIzNjkiIGhlaWdodD0iMzY5IiBzdHJva2U9ImJsYWNrIi8+Cjwvc3ZnPgo=";

/***/ }),

/***/ "../../packages/memory-inspector/src/browser/style/register-view.svg":
/*!***************************************************************************!*\
  !*** ../../packages/memory-inspector/src/browser/style/register-view.svg ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PCEtLSAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioKICogQ29weXJpZ2h0IChDKSAyMDIxIEVyaWNzc29uIGFuZCBvdGhlcnMuCiAqCiAqIFRoaXMgcHJvZ3JhbSBhbmQgdGhlIGFjY29tcGFueWluZyBtYXRlcmlhbHMgYXJlIG1hZGUgYXZhaWxhYmxlIHVuZGVyIHRoZQogKiB0ZXJtcyBvZiB0aGUgRWNsaXBzZSBQdWJsaWMgTGljZW5zZSB2LiAyLjAgd2hpY2ggaXMgYXZhaWxhYmxlIGF0CiAqIGh0dHA6Ly93d3cuZWNsaXBzZS5vcmcvbGVnYWwvZXBsLTIuMC4KICoKICogVGhpcyBTb3VyY2UgQ29kZSBtYXkgYWxzbyBiZSBtYWRlIGF2YWlsYWJsZSB1bmRlciB0aGUgZm9sbG93aW5nIFNlY29uZGFyeQogKiBMaWNlbnNlcyB3aGVuIHRoZSBjb25kaXRpb25zIGZvciBzdWNoIGF2YWlsYWJpbGl0eSBzZXQgZm9ydGggaW4gdGhlIEVjbGlwc2UKICogUHVibGljIExpY2Vuc2Ugdi4gMi4wIGFyZSBzYXRpc2ZpZWQ6IEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLCB2ZXJzaW9uIDIKICogd2l0aCB0aGUgR05VIENsYXNzcGF0aCBFeGNlcHRpb24gd2hpY2ggaXMgYXZhaWxhYmxlIGF0CiAqIGh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvY2xhc3NwYXRoL2xpY2Vuc2UuaHRtbC4KICoKICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEVQTC0yLjAgT1IgR1BMLTIuMC1vbmx5IFdJVEggQ2xhc3NwYXRoLWV4Y2VwdGlvbi0yLjAKICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqLyAtLT4KCjxzdmcgd2lkdGg9IjM2OSIgaGVpZ2h0PSIzNjkiIHZpZXdCb3g9IjAgMCAzNjkgMzY5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB4PSIxMDIiIHk9IjMwIiB3aWR0aD0iMTY2IiBoZWlnaHQ9IjMwOSIgcng9IjI3IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjI0Ii8+CjxyZWN0IHg9IjE1IiB5PSI1NSIgd2lkdGg9IjYyIiBoZWlnaHQ9IjQ5IiByeD0iMTMiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjI5MyIgeT0iNTUiIHdpZHRoPSI2MiIgaGVpZ2h0PSI0OSIgcng9IjEzIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxNSIgeT0iMjY1IiB3aWR0aD0iNjIiIGhlaWdodD0iNDkiIHJ4PSIxMyIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMjkzIiB5PSIyNjUiIHdpZHRoPSI2MiIgaGVpZ2h0PSI0OSIgcng9IjEzIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxNSIgeT0iMTk1IiB3aWR0aD0iNjIiIGhlaWdodD0iNDkiIHJ4PSIxMyIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMjkzIiB5PSIxOTUiIHdpZHRoPSI2MiIgaGVpZ2h0PSI0OSIgcng9IjEzIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxNSIgeT0iMTI1IiB3aWR0aD0iNjIiIGhlaWdodD0iNDkiIHJ4PSIxMyIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMjkzIiB5PSIxMjUiIHdpZHRoPSI2MiIgaGVpZ2h0PSI0OSIgcng9IjEzIiBmaWxsPSJibGFjayIvPgo8cmVjdCB3aWR0aD0iMzY5IiBoZWlnaHQ9IjM2OSIgc3Ryb2tlPSJibGFjayIvPgo8L3N2Zz4K";

/***/ })

}]);
//# sourceMappingURL=packages_memory-inspector_lib_browser_memory-inspector-frontend-module_js-packages_workspace_-2ca0d4.js.map