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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEditorWidgetFactory = void 0;
const custom_editor_widget_1 = require("../custom-editors/custom-editor-widget");
const webview_1 = require("../webview/webview");
const webview_environment_1 = require("../webview/webview-environment");
class CustomEditorWidgetFactory {
    constructor(container) {
        this.id = custom_editor_widget_1.CustomEditorWidget.FACTORY_ID;
        this.container = container;
    }
    async createWidget(identifier) {
        const externalEndpoint = await this.container.get(webview_environment_1.WebviewEnvironment).externalEndpoint();
        let endpoint = externalEndpoint.replace('{{uuid}}', identifier.id);
        if (endpoint[endpoint.length - 1] === '/') {
            endpoint = endpoint.slice(0, endpoint.length - 1);
        }
        const child = this.container.createChild();
        child.bind(webview_1.WebviewWidgetIdentifier).toConstantValue(identifier);
        child.bind(webview_1.WebviewWidgetExternalEndpoint).toConstantValue(endpoint);
        return child.get(custom_editor_widget_1.CustomEditorWidget);
    }
}
exports.CustomEditorWidgetFactory = CustomEditorWidgetFactory;
//# sourceMappingURL=custom-editor-widget-factory.js.map