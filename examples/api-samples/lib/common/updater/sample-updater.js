"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleUpdaterClient = exports.SampleUpdater = exports.SampleUpdaterPath = exports.UpdateStatus = void 0;
var UpdateStatus;
(function (UpdateStatus) {
    UpdateStatus["InProgress"] = "in-progress";
    UpdateStatus["Available"] = "available";
    UpdateStatus["NotAvailable"] = "not-available";
})(UpdateStatus = exports.UpdateStatus || (exports.UpdateStatus = {}));
exports.SampleUpdaterPath = '/services/sample-updater';
exports.SampleUpdater = Symbol('SampleUpdater');
exports.SampleUpdaterClient = Symbol('SampleUpdaterClient');
//# sourceMappingURL=sample-updater.js.map