"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.ElectronCustomEditorWidgetFactory = exports.ElectronWebviewWidgetFactory = void 0;
const webview_widget_factory_1 = require("../../browser/webview/webview-widget-factory");
const custom_editor_widget_factory_1 = require("../../browser/custom-editors/custom-editor-widget-factory");
require("@theia/core/lib/electron-common/electron-api");
class ElectronWebviewWidgetFactory extends webview_widget_factory_1.WebviewWidgetFactory {
    async createWidget(identifier) {
        const widget = await super.createWidget(identifier);
        await this.attachElectronSecurityCookie(widget.externalEndpoint);
        return widget;
    }
    /**
     * Attach the ElectronSecurityToken to a cookie that will be sent with each webview request.
     *
     * @param endpoint cookie's target url
     */
    attachElectronSecurityCookie(endpoint) {
        return window.electronTheiaCore.attachSecurityToken(endpoint);
    }
}
exports.ElectronWebviewWidgetFactory = ElectronWebviewWidgetFactory;
class ElectronCustomEditorWidgetFactory extends custom_editor_widget_factory_1.CustomEditorWidgetFactory {
    async createWidget(identifier) {
        const widget = await super.createWidget(identifier);
        await this.attachElectronSecurityCookie(widget.externalEndpoint);
        return widget;
    }
    /**
     * Attach the ElectronSecurityToken to a cookie that will be sent with each webview request.
     *
     * @param endpoint cookie's target url
     */
    async attachElectronSecurityCookie(endpoint) {
        return window.electronTheiaCore.attachSecurityToken(endpoint);
    }
}
exports.ElectronCustomEditorWidgetFactory = ElectronCustomEditorWidgetFactory;
//# sourceMappingURL=electron-webview-widget-factory.js.map