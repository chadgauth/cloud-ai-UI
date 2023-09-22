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
Object.defineProperty(exports, "__esModule", { value: true });
const getting_started_contribution_1 = require("./getting-started-contribution");
const inversify_1 = require("@theia/core/shared/inversify");
const getting_started_widget_1 = require("./getting-started-widget");
const browser_1 = require("@theia/core/lib/browser");
const getting_started_preferences_1 = require("./getting-started-preferences");
require("../../src/browser/style/index.css");
exports.default = new inversify_1.ContainerModule((bind) => {
    (0, browser_1.bindViewContribution)(bind, getting_started_contribution_1.GettingStartedContribution);
    bind(browser_1.FrontendApplicationContribution).toService(getting_started_contribution_1.GettingStartedContribution);
    bind(getting_started_widget_1.GettingStartedWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(context => ({
        id: getting_started_widget_1.GettingStartedWidget.ID,
        createWidget: () => context.container.get(getting_started_widget_1.GettingStartedWidget),
    })).inSingletonScope();
    (0, getting_started_preferences_1.bindGettingStartedPreferences)(bind);
});
//# sourceMappingURL=getting-started-frontend-module.js.map