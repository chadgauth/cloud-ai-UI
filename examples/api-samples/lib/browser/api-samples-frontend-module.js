"use strict";
// *****************************************************************************
// Copyright (C) 2019 Arm and others.
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
const inversify_1 = require("@theia/core/shared/inversify");
const sample_dynamic_label_provider_command_contribution_1 = require("./label/sample-dynamic-label-provider-command-contribution");
const sample_filtered_command_contribution_1 = require("./contribution-filter/sample-filtered-command-contribution");
const sample_unclosable_view_contribution_1 = require("./view/sample-unclosable-view-contribution");
const sample_output_channel_with_severity_1 = require("./output/sample-output-channel-with-severity");
const sample_menu_contribution_1 = require("./menu/sample-menu-contribution");
const sample_file_watching_contribution_1 = require("./file-watching/sample-file-watching-contribution");
const sample_vsx_command_contribution_1 = require("./vsx/sample-vsx-command-contribution");
const sample_toolbar_contribution_1 = require("./toolbar/sample-toolbar-contribution");
require("../../src/browser/style/branding.css");
const monaco_editor_preference_extractor_1 = require("./monaco-editor-preferences/monaco-editor-preference-extractor");
const sample_ovsx_client_factory_1 = require("../common/vsx/sample-ovsx-client-factory");
const sample_frontend_app_info_1 = require("./vsx/sample-frontend-app-info");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    (0, sample_dynamic_label_provider_command_contribution_1.bindDynamicLabelProvider)(bind);
    (0, sample_unclosable_view_contribution_1.bindSampleUnclosableView)(bind);
    (0, sample_output_channel_with_severity_1.bindSampleOutputChannelWithSeverity)(bind);
    (0, sample_menu_contribution_1.bindSampleMenu)(bind);
    (0, sample_file_watching_contribution_1.bindSampleFileWatching)(bind);
    (0, sample_vsx_command_contribution_1.bindVSXCommand)(bind);
    (0, sample_filtered_command_contribution_1.bindSampleFilteredCommandContribution)(bind);
    (0, sample_toolbar_contribution_1.bindSampleToolbarContribution)(bind, rebind);
    (0, monaco_editor_preference_extractor_1.bindMonacoPreferenceExtractor)(bind);
    (0, sample_frontend_app_info_1.bindSampleAppInfo)(bind);
    (0, sample_ovsx_client_factory_1.rebindOVSXClientFactory)(rebind);
});
//# sourceMappingURL=api-samples-frontend-module.js.map