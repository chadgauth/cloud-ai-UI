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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEditorOpener = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("../../../common");
const custom_editor_widget_1 = require("./custom-editor-widget");
const uuid_1 = require("uuid");
const core_1 = require("@theia/core");
const glob_1 = require("@theia/core/lib/common/glob");
let CustomEditorOpener = class CustomEditorOpener {
    constructor(editor, shell, widgetManager) {
        this.editor = editor;
        this.shell = shell;
        this.widgetManager = widgetManager;
        this.onDidOpenCustomEditorEmitter = new core_1.Emitter();
        this.onDidOpenCustomEditor = this.onDidOpenCustomEditorEmitter.event;
        this.pendingWidgetPromises = new Map();
        this.id = CustomEditorOpener.toCustomEditorId(this.editor.viewType);
        this.label = this.editor.displayName;
    }
    static toCustomEditorId(editorViewType) {
        return `custom-editor-${editorViewType}`;
    }
    canHandle(uri) {
        if (this.matches(this.editor.selector, uri)) {
            return this.getPriority();
        }
        return 0;
    }
    getPriority() {
        switch (this.editor.priority) {
            case common_1.CustomEditorPriority.default: return 500;
            case common_1.CustomEditorPriority.builtin: return 400;
            /** `option` should not open the custom-editor by default. */
            case common_1.CustomEditorPriority.option: return 1;
            default: return 200;
        }
    }
    async open(uri, options) {
        let widget;
        const widgets = this.widgetManager.getWidgets(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID);
        widget = widgets.find(w => w.viewType === this.editor.viewType && w.resource.toString() === uri.toString());
        if (widget === null || widget === void 0 ? void 0 : widget.isVisible) {
            return this.shell.revealWidget(widget.id);
        }
        if (widget === null || widget === void 0 ? void 0 : widget.isAttached) {
            return this.shell.activateWidget(widget.id);
        }
        if (!widget) {
            const uriString = uri.toString();
            let widgetPromise = this.pendingWidgetPromises.get(uriString);
            if (!widgetPromise) {
                const id = (0, uuid_1.v4)();
                widgetPromise = this.widgetManager.getOrCreateWidget(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID, { id });
                this.pendingWidgetPromises.set(uriString, widgetPromise);
                widget = await widgetPromise;
                this.pendingWidgetPromises.delete(uriString);
                widget.viewType = this.editor.viewType;
                widget.resource = uri;
                this.onDidOpenCustomEditorEmitter.fire([widget, options]);
            }
        }
        return widget;
    }
    matches(selectors, resource) {
        return selectors.some(selector => this.selectorMatches(selector, resource));
    }
    selectorMatches(selector, resource) {
        if (selector.filenamePattern) {
            if ((0, glob_1.match)(selector.filenamePattern.toLowerCase(), resource.path.name.toLowerCase() + resource.path.ext.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
};
CustomEditorOpener = __decorate([
    __param(1, (0, inversify_1.inject)(browser_1.ApplicationShell)),
    __param(2, (0, inversify_1.inject)(browser_1.WidgetManager)),
    __metadata("design:paramtypes", [Object, browser_1.ApplicationShell,
        browser_1.WidgetManager])
], CustomEditorOpener);
exports.CustomEditorOpener = CustomEditorOpener;
//# sourceMappingURL=custom-editor-opener.js.map