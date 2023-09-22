"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.LabelServiceMainImpl = void 0;
const disposable_1 = require("@theia/core/lib/common/disposable");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
class LabelServiceMainImpl {
    constructor(container) {
        this.resourceLabelFormatters = new Map();
        this.contributionProvider = container.getNamed(common_1.ContributionProvider, browser_1.LabelProviderContribution);
    }
    $registerResourceLabelFormatter(handle, formatter) {
        // Dynamically registered formatters should have priority over those contributed via package.json
        formatter.priority = true;
        const disposables = new disposable_1.DisposableCollection();
        for (const contribution of this.contributionProvider.getContributions()) {
            if (contribution instanceof browser_1.DefaultUriLabelProviderContribution) {
                disposables.push(contribution.registerFormatter(formatter));
            }
        }
        this.resourceLabelFormatters.set(handle, disposables);
    }
    $unregisterResourceLabelFormatter(handle) {
        const toDispose = this.resourceLabelFormatters.get(handle);
        if (toDispose) {
            toDispose.dispose();
        }
        this.resourceLabelFormatters.delete(handle);
    }
}
exports.LabelServiceMainImpl = LabelServiceMainImpl;
//# sourceMappingURL=label-service-main.js.map