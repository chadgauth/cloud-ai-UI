(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_metrics_lib_browser_metrics-frontend-module_js"],{

/***/ "../../packages/core/shared/@phosphor/coreutils/index.js":
/*!***************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/coreutils/index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/coreutils */ "../../node_modules/@phosphor/coreutils/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/coreutils'] = this;


/***/ }),

/***/ "../../packages/metrics/lib/browser/metrics-frontend-application-contribution.js":
/*!***************************************************************************************!*\
  !*** ../../packages/metrics/lib/browser/metrics-frontend-application-contribution.js ***!
  \***************************************************************************************/
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
exports.MetricsFrontendApplicationContribution = void 0;
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
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const coreutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/coreutils */ "../../packages/core/shared/@phosphor/coreutils/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/metrics/lib/common/index.js");
let MetricsFrontendApplicationContribution = class MetricsFrontendApplicationContribution {
    constructor() {
        this.id = coreutils_1.UUID.uuid4();
    }
    initialize() {
        this.doInitialize();
    }
    async doInitialize() {
        const logLevel = await this.logger.getLogLevel();
        if (logLevel !== core_1.LogLevel.DEBUG) {
            return;
        }
        this.stopwatch.storedMeasurements.forEach(result => this.notify(result));
        this.stopwatch.onDidAddMeasurementResult(result => this.notify(result));
    }
    notify(result) {
        this.notificationService.onFrontendMeasurement(this.id, result);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.Stopwatch),
    __metadata("design:type", core_1.Stopwatch)
], MetricsFrontendApplicationContribution.prototype, "stopwatch", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MeasurementNotificationService),
    __metadata("design:type", Object)
], MetricsFrontendApplicationContribution.prototype, "notificationService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], MetricsFrontendApplicationContribution.prototype, "logger", void 0);
MetricsFrontendApplicationContribution = __decorate([
    (0, inversify_1.injectable)()
], MetricsFrontendApplicationContribution);
exports.MetricsFrontendApplicationContribution = MetricsFrontendApplicationContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/metrics/lib/browser/metrics-frontend-application-contribution'] = this;


/***/ }),

/***/ "../../packages/metrics/lib/browser/metrics-frontend-module.js":
/*!*********************************************************************!*\
  !*** ../../packages/metrics/lib/browser/metrics-frontend-module.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const metrics_frontend_application_contribution_1 = __webpack_require__(/*! ./metrics-frontend-application-contribution */ "../../packages/metrics/lib/browser/metrics-frontend-application-contribution.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/metrics/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(browser_1.FrontendApplicationContribution).to(metrics_frontend_application_contribution_1.MetricsFrontendApplicationContribution).inSingletonScope();
    bind(common_1.MeasurementNotificationService).toDynamicValue(ctx => {
        const connection = ctx.container.get(browser_1.WebSocketConnectionProvider);
        return connection.createProxy(common_1.measurementNotificationServicePath);
    });
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/metrics/lib/browser/metrics-frontend-module'] = this;


/***/ }),

/***/ "../../packages/metrics/lib/common/index.js":
/*!**************************************************!*\
  !*** ../../packages/metrics/lib/common/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
__exportStar(__webpack_require__(/*! ./measurement-notification-service */ "../../packages/metrics/lib/common/measurement-notification-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/metrics/lib/common'] = this;


/***/ }),

/***/ "../../packages/metrics/lib/common/measurement-notification-service.js":
/*!*****************************************************************************!*\
  !*** ../../packages/metrics/lib/common/measurement-notification-service.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
exports.MeasurementNotificationService = exports.measurementNotificationServicePath = void 0;
exports.measurementNotificationServicePath = '/services/measurement-notification';
exports.MeasurementNotificationService = Symbol('MeasurementNotificationService');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/metrics/lib/common/measurement-notification-service'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_metrics_lib_browser_metrics-frontend-module_js.js.map