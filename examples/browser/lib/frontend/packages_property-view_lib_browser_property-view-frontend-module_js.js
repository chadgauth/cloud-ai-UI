(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_property-view_lib_browser_property-view-frontend-module_js"],{

/***/ "../../packages/core/lib/common/selection-command-handler.js":
/*!*******************************************************************!*\
  !*** ../../packages/core/lib/common/selection-command-handler.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
exports.SelectionCommandHandler = void 0;
class SelectionCommandHandler {
    constructor(selectionService, toSelection, options) {
        this.selectionService = selectionService;
        this.toSelection = toSelection;
        this.options = options;
    }
    execute(...args) {
        const selection = this.getSelection(...args);
        return selection ? this.options.execute(selection, ...args) : undefined;
    }
    isVisible(...args) {
        const selection = this.getSelection(...args);
        return !!selection && (!this.options.isVisible || this.options.isVisible(selection, ...args));
    }
    isEnabled(...args) {
        const selection = this.getSelection(...args);
        return !!selection && (!this.options.isEnabled || this.options.isEnabled(selection, ...args));
    }
    isMulti() {
        return this.options && !!this.options.multi;
    }
    getSelection(...args) {
        const givenSelection = args.length && this.toSelection(args[0]);
        if (givenSelection) {
            return this.isMulti() ? [givenSelection] : givenSelection;
        }
        const globalSelection = this.getSingleSelection(this.selectionService.selection);
        if (this.isMulti()) {
            return this.getMultiSelection(globalSelection);
        }
        return this.getSingleSelection(globalSelection);
    }
    getSingleSelection(arg) {
        let selection = this.toSelection(arg);
        if (selection) {
            return selection;
        }
        if (Array.isArray(arg)) {
            for (const element of arg) {
                selection = this.toSelection(element);
                if (selection) {
                    return selection;
                }
            }
        }
        return undefined;
    }
    getMultiSelection(arg) {
        let selection = this.toSelection(arg);
        if (selection) {
            return [selection];
        }
        const result = [];
        if (Array.isArray(arg)) {
            for (const element of arg) {
                selection = this.toSelection(element);
                if (selection) {
                    result.push(selection);
                }
            }
        }
        return result.length ? result : undefined;
    }
}
exports.SelectionCommandHandler = SelectionCommandHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/selection-command-handler'] = this;


/***/ }),

/***/ "../../packages/core/shared/react/index.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/react/index.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react */ "../../node_modules/react/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-selection.js":
/*!***************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-selection.js ***!
  \***************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileSelection = void 0;
const selection_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/selection-command-handler */ "../../packages/core/lib/common/selection-command-handler.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const files_1 = __webpack_require__(/*! ../common/files */ "../../packages/filesystem/lib/common/files.js");
var FileSelection;
(function (FileSelection) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && files_1.FileStat.is(arg.fileStat);
    }
    FileSelection.is = is;
    class CommandHandler extends selection_command_handler_1.SelectionCommandHandler {
        constructor(selectionService, options) {
            super(selectionService, arg => FileSelection.is(arg) ? arg : undefined, options);
            this.selectionService = selectionService;
            this.options = options;
        }
    }
    FileSelection.CommandHandler = CommandHandler;
})(FileSelection = exports.FileSelection || (exports.FileSelection = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-selection'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/empty-property-view-widget-provider.js":
/*!***************************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/empty-property-view-widget-provider.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
var EmptyPropertyViewWidgetProvider_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmptyPropertyViewWidgetProvider = void 0;
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const property_view_widget_provider_1 = __webpack_require__(/*! ./property-view-widget-provider */ "../../packages/property-view/lib/browser/property-view-widget-provider.js");
/**
 * Property view widget that is shown if no property data or selection is available.
 * This widget is provided by the {@link EmptyPropertyViewWidgetProvider}.
 */
class EmptyPropertyViewWidget extends browser_1.ReactWidget {
    constructor() {
        super();
        this.emptyComponent = React.createElement("div", { className: 'theia-widget-noInfo' }, nls_1.nls.localize('theia/property-view/noProperties', 'No properties available.'));
        this.id = EmptyPropertyViewWidget.ID;
        this.title.label = EmptyPropertyViewWidget.LABEL;
        this.title.caption = EmptyPropertyViewWidget.LABEL;
        this.title.closable = false;
        this.node.tabIndex = 0;
    }
    updatePropertyViewContent() {
        this.update();
    }
    render() {
        return this.emptyComponent;
    }
}
EmptyPropertyViewWidget.ID = 'theia-empty-property-view';
EmptyPropertyViewWidget.LABEL = 'No Properties';
/**
 * `EmptyPropertyViewWidgetProvider` is implemented to provide the {@link EmptyPropertyViewWidget}
 *  if the given selection is undefined or no other provider can handle the given selection.
 */
let EmptyPropertyViewWidgetProvider = EmptyPropertyViewWidgetProvider_1 = class EmptyPropertyViewWidgetProvider extends property_view_widget_provider_1.DefaultPropertyViewWidgetProvider {
    constructor() {
        super();
        this.id = EmptyPropertyViewWidgetProvider_1.ID;
        this.label = 'DefaultPropertyViewWidgetProvider';
        this.emptyWidget = new EmptyPropertyViewWidget();
    }
    canHandle(selection) {
        return selection === undefined ? 1 : 0;
    }
    provideWidget(selection) {
        return Promise.resolve(this.emptyWidget);
    }
    updateContentWidget(selection) {
        this.emptyWidget.updatePropertyViewContent();
    }
};
EmptyPropertyViewWidgetProvider.ID = 'no-properties';
EmptyPropertyViewWidgetProvider = EmptyPropertyViewWidgetProvider_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], EmptyPropertyViewWidgetProvider);
exports.EmptyPropertyViewWidgetProvider = EmptyPropertyViewWidgetProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/empty-property-view-widget-provider'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/property-data-service.js":
/*!*************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/property-data-service.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.PropertyDataService = void 0;
exports.PropertyDataService = Symbol('PropertyDataService');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/property-data-service'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/property-view-contribution.js":
/*!******************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/property-view-contribution.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.PropertyViewContribution = void 0;
const view_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/view-contribution */ "../../packages/core/lib/browser/shell/view-contribution.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const property_view_widget_1 = __webpack_require__(/*! ./property-view-widget */ "../../packages/property-view/lib/browser/property-view-widget.js");
let PropertyViewContribution = class PropertyViewContribution extends view_contribution_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: property_view_widget_1.PropertyViewWidget.ID,
            widgetName: property_view_widget_1.PropertyViewWidget.LABEL,
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: 'property-view:toggle',
            toggleKeybinding: 'shift+alt+p'
        });
    }
};
PropertyViewContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PropertyViewContribution);
exports.PropertyViewContribution = PropertyViewContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/property-view-contribution'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/property-view-frontend-module.js":
/*!*********************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/property-view-frontend-module.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const empty_property_view_widget_provider_1 = __webpack_require__(/*! ./empty-property-view-widget-provider */ "../../packages/property-view/lib/browser/empty-property-view-widget-provider.js");
const property_data_service_1 = __webpack_require__(/*! ./property-data-service */ "../../packages/property-view/lib/browser/property-data-service.js");
const property_view_contribution_1 = __webpack_require__(/*! ./property-view-contribution */ "../../packages/property-view/lib/browser/property-view-contribution.js");
const property_view_service_1 = __webpack_require__(/*! ./property-view-service */ "../../packages/property-view/lib/browser/property-view-service.js");
const property_view_widget_1 = __webpack_require__(/*! ./property-view-widget */ "../../packages/property-view/lib/browser/property-view-widget.js");
const property_view_widget_provider_1 = __webpack_require__(/*! ./property-view-widget-provider */ "../../packages/property-view/lib/browser/property-view-widget-provider.js");
const resource_property_view_1 = __webpack_require__(/*! ./resource-property-view */ "../../packages/property-view/lib/browser/resource-property-view/index.js");
__webpack_require__(/*! ../../src/browser/style/property-view.css */ "../../packages/property-view/src/browser/style/property-view.css");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(property_view_service_1.PropertyViewService).toSelf().inSingletonScope();
    (0, contribution_provider_1.bindContributionProvider)(bind, property_data_service_1.PropertyDataService);
    (0, contribution_provider_1.bindContributionProvider)(bind, property_view_widget_provider_1.PropertyViewWidgetProvider);
    bind(empty_property_view_widget_provider_1.EmptyPropertyViewWidgetProvider).toSelf().inSingletonScope();
    bind(property_view_widget_provider_1.PropertyViewWidgetProvider).to(empty_property_view_widget_provider_1.EmptyPropertyViewWidgetProvider);
    bind(property_view_widget_1.PropertyViewWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: property_view_widget_1.PropertyViewWidget.ID,
        createWidget: () => container.get(property_view_widget_1.PropertyViewWidget)
    })).inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, property_view_contribution_1.PropertyViewContribution);
    (0, resource_property_view_1.bindResourcePropertyView)(bind);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/property-view-frontend-module'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/property-view-service.js":
/*!*************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/property-view-service.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.PropertyViewService = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const empty_property_view_widget_provider_1 = __webpack_require__(/*! ./empty-property-view-widget-provider */ "../../packages/property-view/lib/browser/empty-property-view-widget-provider.js");
const property_view_widget_provider_1 = __webpack_require__(/*! ./property-view-widget-provider */ "../../packages/property-view/lib/browser/property-view-widget-provider.js");
/**
 * `PropertyViewService` provides an access to existing property view widget providers.
 */
let PropertyViewService = class PropertyViewService {
    constructor() {
        this.providers = [];
    }
    init() {
        this.providers = this.providers.concat(this.contributions.getContributions());
    }
    /**
     * Return a property view widget provider with the highest priority for the given selection.
     * Never reject, return the default provider ({@link EmptyPropertyViewWidgetProvider};
     * displays `No properties available`) if there are no other matches.
     */
    async getProvider(selection) {
        const provider = await this.prioritize(selection);
        return provider !== null && provider !== void 0 ? provider : this.emptyWidgetProvider;
    }
    async prioritize(selection) {
        const prioritized = await core_1.Prioritizeable.prioritizeAll(this.providers, async (provider) => {
            try {
                return await provider.canHandle(selection);
            }
            catch {
                return 0;
            }
        });
        return prioritized.length !== 0 ? prioritized[0].value : undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(property_view_widget_provider_1.PropertyViewWidgetProvider),
    __metadata("design:type", Object)
], PropertyViewService.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.inject)(empty_property_view_widget_provider_1.EmptyPropertyViewWidgetProvider),
    __metadata("design:type", empty_property_view_widget_provider_1.EmptyPropertyViewWidgetProvider)
], PropertyViewService.prototype, "emptyWidgetProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PropertyViewService.prototype, "init", null);
PropertyViewService = __decorate([
    (0, inversify_1.injectable)()
], PropertyViewService);
exports.PropertyViewService = PropertyViewService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/property-view-service'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/property-view-widget-provider.js":
/*!*********************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/property-view-widget-provider.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.DefaultPropertyViewWidgetProvider = exports.PropertyViewWidgetProvider = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const property_data_service_1 = __webpack_require__(/*! ./property-data-service */ "../../packages/property-view/lib/browser/property-data-service.js");
exports.PropertyViewWidgetProvider = Symbol('PropertyViewWidgetProvider');
/**
 * The `DefaultPropertyViewWidgetProvider` is the default abstract implementation of the {@link PropertyViewWidgetProvider}
 * and should be extended to provide a property view content widget for the given selection.
 */
let DefaultPropertyViewWidgetProvider = class DefaultPropertyViewWidgetProvider {
    constructor() {
        this.propertyDataServices = [];
        this.id = 'default';
        this.label = 'DefaultPropertyViewWidgetProvider';
    }
    init() {
        this.propertyDataServices = this.propertyDataServices.concat(this.contributions.getContributions());
    }
    canHandle(selection) {
        return 0;
    }
    provideWidget(selection) {
        throw new Error('not implemented');
    }
    updateContentWidget(selection) {
        // no-op
    }
    async getPropertyDataService(selection) {
        const dataService = await this.prioritize(selection);
        return dataService !== null && dataService !== void 0 ? dataService : this.propertyDataServices[0];
    }
    async prioritize(selection) {
        const prioritized = await core_1.Prioritizeable.prioritizeAll(this.propertyDataServices, async (service) => {
            try {
                return service.canHandleSelection(selection);
            }
            catch {
                return 0;
            }
        });
        return prioritized.length !== 0 ? prioritized[0].value : undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(property_data_service_1.PropertyDataService),
    __metadata("design:type", Object)
], DefaultPropertyViewWidgetProvider.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DefaultPropertyViewWidgetProvider.prototype, "init", null);
DefaultPropertyViewWidgetProvider = __decorate([
    (0, inversify_1.injectable)()
], DefaultPropertyViewWidgetProvider);
exports.DefaultPropertyViewWidgetProvider = DefaultPropertyViewWidgetProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/property-view-widget-provider'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/property-view-widget.js":
/*!************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/property-view-widget.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
var PropertyViewWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyViewWidget = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/widget */ "../../packages/core/lib/browser/widgets/widget.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const property_view_service_1 = __webpack_require__(/*! ./property-view-service */ "../../packages/property-view/lib/browser/property-view-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
/**
 * The main container for the selection-specific property widgets.
 * Based on the given selection, the registered `PropertyViewWidgetProvider` provides the
 * content widget that displays the corresponding properties.
 */
let PropertyViewWidget = PropertyViewWidget_1 = class PropertyViewWidget extends widget_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.toDisposeOnDetach = new disposable_1.DisposableCollection();
    }
    init() {
        this.id = PropertyViewWidget_1.ID;
        this.title.label = PropertyViewWidget_1.LABEL;
        this.title.caption = PropertyViewWidget_1.LABEL;
        this.title.iconClass = (0, widget_1.codicon)('table');
        this.title.closable = true;
        this.addClass('theia-property-view-widget');
        this.node.tabIndex = 0;
        let disposed = false;
        this.toDispose.push(core_1.Disposable.create(() => disposed = true));
        this.toDispose.push(this.selectionService.onSelectionChanged((selection) => {
            this.propertyViewService.getProvider(selection).then(provider => {
                provider.provideWidget(selection).then(contentWidget => {
                    if (!disposed) {
                        this.replaceContentWidget(contentWidget);
                        provider.updateContentWidget(selection);
                    }
                });
            });
        }));
    }
    initializeContentWidget(selection) {
        this.propertyViewService.getProvider(selection).then(provider => {
            provider.provideWidget(selection).then(contentWidget => {
                this.attachContentWidget(contentWidget);
                provider.updateContentWidget(selection);
            });
        });
    }
    replaceContentWidget(newContentWidget) {
        if (this.contentWidget.id !== newContentWidget.id) {
            if (this.contentWidget) {
                widget_1.Widget.detach(this.contentWidget);
            }
            this.attachContentWidget(newContentWidget);
        }
    }
    attachContentWidget(newContentWidget) {
        this.contentWidget = newContentWidget;
        widget_1.Widget.attach(this.contentWidget, this.node);
        this.toDisposeOnDetach = new disposable_1.DisposableCollection();
        this.toDisposeOnDetach.push(core_1.Disposable.create(() => {
            if (this.contentWidget) {
                widget_1.Widget.detach(this.contentWidget);
            }
        }));
        this.update();
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.initializeContentWidget(this.selectionService.selection);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
        if (this.contentWidget) {
            this.contentWidget.activate();
        }
    }
    onResize(msg) {
        super.onResize(msg);
        if (this.contentWidget) {
            widget_1.MessageLoop.sendMessage(this.contentWidget, msg);
        }
    }
};
PropertyViewWidget.ID = 'property-view';
PropertyViewWidget.LABEL = nls_1.nls.localize('theia/property-view/properties', 'Properties');
__decorate([
    (0, inversify_1.inject)(property_view_service_1.PropertyViewService),
    __metadata("design:type", property_view_service_1.PropertyViewService)
], PropertyViewWidget.prototype, "propertyViewService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], PropertyViewWidget.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PropertyViewWidget.prototype, "init", null);
PropertyViewWidget = PropertyViewWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], PropertyViewWidget);
exports.PropertyViewWidget = PropertyViewWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/property-view-widget'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/resource-property-view/index.js":
/*!********************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/resource-property-view/index.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
__exportStar(__webpack_require__(/*! ./resource-property-view-tree-container */ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-container.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/resource-property-view'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/resource-property-view/resource-property-data-service.js":
/*!*********************************************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/resource-property-view/resource-property-data-service.js ***!
  \*********************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.ResourcePropertyDataService = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_selection_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-selection */ "../../packages/filesystem/lib/browser/file-selection.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
/**
 * This data service provides property data for {@link FileSelection}s and selections of {@link Navigatable}s.
 */
let ResourcePropertyDataService = class ResourcePropertyDataService {
    constructor() {
        this.id = 'resources';
        this.label = 'ResourcePropertyDataService';
    }
    canHandleSelection(selection) {
        return (this.isFileSelection(selection) || this.isNavigatableSelection(selection)) ? 1 : 0;
    }
    isFileSelection(selection) {
        return !!selection && Array.isArray(selection) && file_selection_1.FileSelection.is(selection[0]);
    }
    isNavigatableSelection(selection) {
        return !!selection && browser_1.Navigatable.is(selection);
    }
    async getFileStat(uri) {
        return this.fileService.resolve(uri);
    }
    async providePropertyData(selection) {
        if (this.isFileSelection(selection) && Array.isArray(selection)) {
            return this.getFileStat(selection[0].fileStat.resource);
        }
        else if (this.isNavigatableSelection(selection)) {
            const navigatableUri = selection.getResourceUri();
            if (navigatableUri) {
                return this.getFileStat(navigatableUri);
            }
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], ResourcePropertyDataService.prototype, "fileService", void 0);
ResourcePropertyDataService = __decorate([
    (0, inversify_1.injectable)()
], ResourcePropertyDataService);
exports.ResourcePropertyDataService = ResourcePropertyDataService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/resource-property-view/resource-property-data-service'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-label-provider.js":
/*!****************************************************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/resource-property-view/resource-property-view-label-provider.js ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.ResourcePropertiesLabelProvider = exports.DEFAULT_INFO_ICON = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const resource_property_view_tree_items_1 = __webpack_require__(/*! ./resource-property-view-tree-items */ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-items.js");
exports.DEFAULT_INFO_ICON = (0, browser_1.codicon)('info');
let ResourcePropertiesLabelProvider = class ResourcePropertiesLabelProvider {
    canHandle(element) {
        return (resource_property_view_tree_items_1.ResourcePropertiesCategoryNode.is(element) || resource_property_view_tree_items_1.ResourcePropertiesItemNode.is(element)) ? 75 : 0;
    }
    getIcon(node) {
        var _a, _b;
        if (resource_property_view_tree_items_1.ResourcePropertiesCategoryNode.is(node)) {
            return (_a = node.icon) !== null && _a !== void 0 ? _a : exports.DEFAULT_INFO_ICON;
        }
        return (_b = node.icon) !== null && _b !== void 0 ? _b : '';
    }
    getName(node) {
        return node.name;
    }
    getLongName(node) {
        if (resource_property_view_tree_items_1.ResourcePropertiesItemNode.is(node)) {
            return node.property;
        }
        return this.getName(node);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], ResourcePropertiesLabelProvider.prototype, "labelProvider", void 0);
ResourcePropertiesLabelProvider = __decorate([
    (0, inversify_1.injectable)()
], ResourcePropertiesLabelProvider);
exports.ResourcePropertiesLabelProvider = ResourcePropertiesLabelProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/resource-property-view/resource-property-view-label-provider'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-container.js":
/*!****************************************************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-container.js ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.bindResourcePropertyView = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const property_data_service_1 = __webpack_require__(/*! ../property-data-service */ "../../packages/property-view/lib/browser/property-data-service.js");
const property_view_widget_provider_1 = __webpack_require__(/*! ../property-view-widget-provider */ "../../packages/property-view/lib/browser/property-view-widget-provider.js");
const resource_property_data_service_1 = __webpack_require__(/*! ./resource-property-data-service */ "../../packages/property-view/lib/browser/resource-property-view/resource-property-data-service.js");
const resource_property_view_label_provider_1 = __webpack_require__(/*! ./resource-property-view-label-provider */ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-label-provider.js");
const resource_property_view_tree_widget_1 = __webpack_require__(/*! ./resource-property-view-tree-widget */ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-widget.js");
const resource_property_view_widget_provider_1 = __webpack_require__(/*! ./resource-property-view-widget-provider */ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-widget-provider.js");
const RESOURCE_PROPERTY_VIEW_TREE_PROPS = {
    multiSelect: true,
    search: true,
};
function createResourcePropertyViewTreeWidget(parent) {
    const child = (0, browser_1.createTreeContainer)(parent, {
        props: RESOURCE_PROPERTY_VIEW_TREE_PROPS,
        widget: resource_property_view_tree_widget_1.ResourcePropertyViewTreeWidget,
    });
    return child.get(resource_property_view_tree_widget_1.ResourcePropertyViewTreeWidget);
}
function bindResourcePropertyView(bind) {
    bind(browser_1.LabelProviderContribution).to(resource_property_view_label_provider_1.ResourcePropertiesLabelProvider).inSingletonScope();
    bind(property_data_service_1.PropertyDataService).to(resource_property_data_service_1.ResourcePropertyDataService).inSingletonScope();
    bind(property_view_widget_provider_1.PropertyViewWidgetProvider).to(resource_property_view_widget_provider_1.ResourcePropertyViewWidgetProvider).inSingletonScope();
    bind(resource_property_view_tree_widget_1.ResourcePropertyViewTreeWidget).toDynamicValue(ctx => createResourcePropertyViewTreeWidget(ctx.container));
}
exports.bindResourcePropertyView = bindResourcePropertyView;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/resource-property-view/resource-property-view-tree-container'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-items.js":
/*!************************************************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-items.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.ResourcePropertiesItemNode = exports.ResourcePropertiesCategoryNode = exports.ResourcePropertiesRoot = exports.ROOT_ID = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
exports.ROOT_ID = 'ResourcePropertiesTree';
var ResourcePropertiesRoot;
(function (ResourcePropertiesRoot) {
    function is(node) {
        return browser_1.CompositeTreeNode.is(node) && node.id === exports.ROOT_ID;
    }
    ResourcePropertiesRoot.is = is;
})(ResourcePropertiesRoot = exports.ResourcePropertiesRoot || (exports.ResourcePropertiesRoot = {}));
var ResourcePropertiesCategoryNode;
(function (ResourcePropertiesCategoryNode) {
    function is(node) {
        return browser_1.ExpandableTreeNode.is(node) && browser_1.SelectableTreeNode.is(node) && 'categoryId' in node;
    }
    ResourcePropertiesCategoryNode.is = is;
})(ResourcePropertiesCategoryNode = exports.ResourcePropertiesCategoryNode || (exports.ResourcePropertiesCategoryNode = {}));
var ResourcePropertiesItemNode;
(function (ResourcePropertiesItemNode) {
    function is(node) {
        return !!node && browser_1.SelectableTreeNode.is(node) && 'property' in node;
    }
    ResourcePropertiesItemNode.is = is;
})(ResourcePropertiesItemNode = exports.ResourcePropertiesItemNode || (exports.ResourcePropertiesItemNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/resource-property-view/resource-property-view-tree-items'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-widget.js":
/*!*************************************************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-widget.js ***!
  \*************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
var ResourcePropertyViewTreeWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourcePropertyViewTreeWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const resource_property_view_tree_items_1 = __webpack_require__(/*! ./resource-property-view-tree-items */ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-items.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
/**
 * This widget fetches the property data for {@link FileSelection}s and selections of {@link Navigatable}s
 * and renders that property data as a {@link TreeWidget}.
 * This widget is provided by the registered `ResourcePropertyViewWidgetProvider`.
 */
let ResourcePropertyViewTreeWidget = ResourcePropertyViewTreeWidget_1 = class ResourcePropertyViewTreeWidget extends browser_1.TreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        model.root = {
            id: resource_property_view_tree_items_1.ROOT_ID,
            name: ResourcePropertyViewTreeWidget_1.LABEL,
            parent: undefined,
            visible: false,
            children: []
        };
        this.propertiesTree = new Map();
    }
    init() {
        super.init();
        this.id = ResourcePropertyViewTreeWidget_1.ID + '-treeContainer';
        this.addClass('treeContainer');
        this.fillPropertiesTree();
    }
    updateNeeded(selection) {
        return this.currentSelection !== selection;
    }
    updatePropertyViewContent(propertyDataService, selection) {
        if (this.updateNeeded(selection)) {
            this.currentSelection = selection;
            if (propertyDataService) {
                propertyDataService.providePropertyData(selection).then((fileStatObject) => {
                    this.fillPropertiesTree(fileStatObject);
                });
            }
        }
    }
    fillPropertiesTree(fileStatObject) {
        if (fileStatObject) {
            this.propertiesTree.clear();
            const infoNode = this.createCategoryNode('info', nls_1.nls.localizeByDefault('Info'));
            this.propertiesTree.set('info', infoNode);
            infoNode.children.push(this.createResultLineNode('isDirectory', nls_1.nls.localize('theia/property-view/directory', 'Directory'), fileStatObject.isDirectory, infoNode));
            infoNode.children.push(this.createResultLineNode('isFile', nls_1.nls.localizeByDefault('File'), fileStatObject.isFile, infoNode));
            infoNode.children.push(this.createResultLineNode('isSymbolicLink', nls_1.nls.localize('theia/property-view/symbolicLink', 'Symbolic link'), fileStatObject.isSymbolicLink, infoNode));
            infoNode.children.push(this.createResultLineNode('location', nls_1.nls.localize('theia/property-view/location', 'Location'), this.getLocationString(fileStatObject), infoNode));
            infoNode.children.push(this.createResultLineNode('name', nls_1.nls.localizeByDefault('Name'), this.getFileName(fileStatObject), infoNode));
            infoNode.children.push(this.createResultLineNode('path', nls_1.nls.localizeByDefault('Path'), this.getFilePath(fileStatObject), infoNode));
            infoNode.children.push(this.createResultLineNode('lastModification', nls_1.nls.localize('theia/property-view/lastModified', 'Last modified'), this.getLastModificationString(fileStatObject), infoNode));
            infoNode.children.push(this.createResultLineNode('created', nls_1.nls.localize('theia/property-view/created', 'Created'), this.getCreationTimeString(fileStatObject), infoNode));
            infoNode.children.push(this.createResultLineNode('size', nls_1.nls.localize('theia/property-view/size', 'Size'), this.getSizeString(fileStatObject), infoNode));
            this.refreshModelChildren();
        }
    }
    getLocationString(fileStat) {
        return fileStat.resource.path.fsPath();
    }
    getFileName(fileStat) {
        return this.labelProvider.getName(fileStat.resource);
    }
    getFilePath(fileStat) {
        return this.labelProvider.getLongName(fileStat.resource);
    }
    getLastModificationString(fileStat) {
        return fileStat.mtime ? new Date(fileStat.mtime).toLocaleString() : '';
    }
    getCreationTimeString(fileStat) {
        return fileStat.ctime ? new Date(fileStat.ctime).toLocaleString() : '';
    }
    getSizeString(fileStat) {
        return fileStat.size ? nls_1.nls.localizeByDefault('{0}B', fileStat.size.toString()) : '';
    }
    /*
    * Creating TreeNodes
    */
    createCategoryNode(categoryId, name) {
        return {
            id: categoryId,
            parent: this.model.root,
            name,
            children: [],
            categoryId,
            selected: false,
            expanded: true
        };
    }
    createResultLineNode(id, name, property, parent) {
        return {
            id: `${parent.id}::${id}`,
            parent,
            name: name,
            property: property !== undefined ? String(property) : '',
            selected: false
        };
    }
    /**
     * Rendering
     */
    async refreshModelChildren() {
        if (resource_property_view_tree_items_1.ResourcePropertiesRoot.is(this.model.root)) {
            this.model.root.children = Array.from(this.propertiesTree.values());
            this.model.refresh();
        }
    }
    renderCaption(node, props) {
        if (resource_property_view_tree_items_1.ResourcePropertiesCategoryNode.is(node)) {
            return this.renderExpandableNode(node);
        }
        else if (resource_property_view_tree_items_1.ResourcePropertiesItemNode.is(node)) {
            return this.renderItemNode(node);
        }
        return undefined;
    }
    renderExpandableNode(node) {
        return React.createElement(React.Fragment, null,
            React.createElement("div", { className: `theia-resource-tree-node-icon ${this.toNodeIcon(node)}` }),
            React.createElement("div", { className: 'theia-resource-tree-node-name theia-TreeNodeSegment theia-TreeNodeSegmentGrow' }, this.toNodeName(node)));
    }
    renderItemNode(node) {
        return React.createElement(React.Fragment, null,
            React.createElement("div", { className: `theia-resource-tree-node-icon ${this.toNodeIcon(node)}` }),
            React.createElement("div", { className: 'theia-resource-tree-node-name theia-TreeNodeSegment theia-TreeNodeSegmentGrow' }, this.toNodeName(node)),
            React.createElement("div", { className: 'theia-resource-tree-node-property theia-TreeNodeSegment theia-TreeNodeSegmentGrow' }, this.toNodeDescription(node)));
    }
    createNodeAttributes(node, props) {
        return {
            ...super.createNodeAttributes(node, props),
            title: this.getNodeTooltip(node)
        };
    }
    getNodeTooltip(node) {
        if (resource_property_view_tree_items_1.ResourcePropertiesCategoryNode.is(node)) {
            return this.labelProvider.getName(node);
        }
        else if (resource_property_view_tree_items_1.ResourcePropertiesItemNode.is(node)) {
            return `${this.labelProvider.getName(node)}: ${this.labelProvider.getLongName(node)}`;
        }
        return undefined;
    }
};
ResourcePropertyViewTreeWidget.ID = 'resource-properties-tree-widget';
ResourcePropertyViewTreeWidget.LABEL = 'Resource Properties Tree';
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResourcePropertyViewTreeWidget.prototype, "init", null);
ResourcePropertyViewTreeWidget = ResourcePropertyViewTreeWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(browser_1.TreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, Object, browser_1.ContextMenuRenderer])
], ResourcePropertyViewTreeWidget);
exports.ResourcePropertyViewTreeWidget = ResourcePropertyViewTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/resource-property-view/resource-property-view-tree-widget'] = this;


/***/ }),

/***/ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-widget-provider.js":
/*!*****************************************************************************************************************!*\
  !*** ../../packages/property-view/lib/browser/resource-property-view/resource-property-view-widget-provider.js ***!
  \*****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
exports.ResourcePropertyViewWidgetProvider = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_selection_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-selection */ "../../packages/filesystem/lib/browser/file-selection.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const property_view_widget_provider_1 = __webpack_require__(/*! ../property-view-widget-provider */ "../../packages/property-view/lib/browser/property-view-widget-provider.js");
const resource_property_view_tree_widget_1 = __webpack_require__(/*! ./resource-property-view-tree-widget */ "../../packages/property-view/lib/browser/resource-property-view/resource-property-view-tree-widget.js");
/**
 * Provides the {@link ResourcePropertyViewTreeWidget} for
 * {@link FileSelection}s and selections of {@link Navigatable}s.
 */
let ResourcePropertyViewWidgetProvider = class ResourcePropertyViewWidgetProvider extends property_view_widget_provider_1.DefaultPropertyViewWidgetProvider {
    constructor() {
        super(...arguments);
        this.id = 'resources';
        this.label = 'ResourcePropertyViewWidgetProvider';
    }
    canHandle(selection) {
        return (this.isFileSelection(selection) || this.isNavigatableSelection(selection)) ? 1 : 0;
    }
    isFileSelection(selection) {
        return !!selection && Array.isArray(selection) && file_selection_1.FileSelection.is(selection[0]);
    }
    isNavigatableSelection(selection) {
        return !!selection && browser_1.Navigatable.is(selection);
    }
    provideWidget(selection) {
        return Promise.resolve(this.treeWidget);
    }
    updateContentWidget(selection) {
        this.getPropertyDataService(selection).then(service => this.treeWidget.updatePropertyViewContent(service, selection));
    }
};
__decorate([
    (0, inversify_1.inject)(resource_property_view_tree_widget_1.ResourcePropertyViewTreeWidget),
    __metadata("design:type", resource_property_view_tree_widget_1.ResourcePropertyViewTreeWidget)
], ResourcePropertyViewWidgetProvider.prototype, "treeWidget", void 0);
ResourcePropertyViewWidgetProvider = __decorate([
    (0, inversify_1.injectable)()
], ResourcePropertyViewWidgetProvider);
exports.ResourcePropertyViewWidgetProvider = ResourcePropertyViewWidgetProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/property-view/lib/browser/resource-property-view/resource-property-view-widget-provider'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/property-view/src/browser/style/property-view.css":
/*!******************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/property-view/src/browser/style/property-view.css ***!
  \******************************************************************************************************************/
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
 * Copyright (C) 2020 EclipseSource and others.
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
  --theia-property-view-widget-padding: 5px;
  --theia-empty-property-view-widget-padding: 8px;
  --theia-resource-tree-node-icon-margin: 0 3px;
  --theia-resource-tree-node-icon-flex-basis: 1.5%;
  --theia-resource-tree-node-name-flex-basis: 30%;
  --theia-resource-tree-node-property-flex-basis: 70%;
}

.theia-property-view-widget {
  padding: var(--theia-border-width);
}

#theia-empty-property-view .theia-widget-noInfo {
  padding: var(--theia-empty-property-view-widget-padding);
}

.theia-property-view-widget .treeContainer {
  height: 100%;
}

.theia-resource-tree-node-icon {
  margin: var(--theia-resource-tree-node-icon-margin);
  flex-basis: var(--theia-resource-tree-node-icon-flex-basis);
  align-self: center;
  text-align: center;
}

.theia-resource-tree-node-name {
  flex-basis: var(--theia-resource-tree-node-name-flex-basis);
}

.theia-resource-tree-node-property {
  flex-basis: var(--theia-resource-tree-node-property-flex-basis);
}
`, "",{"version":3,"sources":["webpack://./../../packages/property-view/src/browser/style/property-view.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,yCAAyC;EACzC,+CAA+C;EAC/C,6CAA6C;EAC7C,gDAAgD;EAChD,+CAA+C;EAC/C,mDAAmD;AACrD;;AAEA;EACE,kCAAkC;AACpC;;AAEA;EACE,wDAAwD;AAC1D;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,mDAAmD;EACnD,2DAA2D;EAC3D,kBAAkB;EAClB,kBAAkB;AACpB;;AAEA;EACE,2DAA2D;AAC7D;;AAEA;EACE,+DAA+D;AACjE","sourcesContent":["/********************************************************************************\n * Copyright (C) 2020 EclipseSource and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n:root {\n  --theia-property-view-widget-padding: 5px;\n  --theia-empty-property-view-widget-padding: 8px;\n  --theia-resource-tree-node-icon-margin: 0 3px;\n  --theia-resource-tree-node-icon-flex-basis: 1.5%;\n  --theia-resource-tree-node-name-flex-basis: 30%;\n  --theia-resource-tree-node-property-flex-basis: 70%;\n}\n\n.theia-property-view-widget {\n  padding: var(--theia-border-width);\n}\n\n#theia-empty-property-view .theia-widget-noInfo {\n  padding: var(--theia-empty-property-view-widget-padding);\n}\n\n.theia-property-view-widget .treeContainer {\n  height: 100%;\n}\n\n.theia-resource-tree-node-icon {\n  margin: var(--theia-resource-tree-node-icon-margin);\n  flex-basis: var(--theia-resource-tree-node-icon-flex-basis);\n  align-self: center;\n  text-align: center;\n}\n\n.theia-resource-tree-node-name {\n  flex-basis: var(--theia-resource-tree-node-name-flex-basis);\n}\n\n.theia-resource-tree-node-property {\n  flex-basis: var(--theia-resource-tree-node-property-flex-basis);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/property-view/src/browser/style/property-view.css":
/*!************************************************************************!*\
  !*** ../../packages/property-view/src/browser/style/property-view.css ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_property_view_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./property-view.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/property-view/src/browser/style/property-view.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_property_view_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_property_view_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_property-view_lib_browser_property-view-frontend-module_js.js.map