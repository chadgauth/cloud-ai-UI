"use strict";
// *****************************************************************************
// Copyright (C) 2018-2021 Google and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorPreviewManager = void 0;
const browser_1 = require("@theia/editor/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const editor_preview_preferences_1 = require("./editor-preview-preferences");
const editor_preview_widget_factory_1 = require("./editor-preview-widget-factory");
const editor_preview_widget_1 = require("./editor-preview-widget");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
let EditorPreviewManager = class EditorPreviewManager extends browser_1.EditorManager {
    constructor() {
        super(...arguments);
        this.id = editor_preview_widget_factory_1.EditorPreviewWidgetFactory.ID;
        /**
         * Until the layout has been restored, widget state is not reliable, so we ignore creation events.
         */
        this.layoutIsSet = false;
    }
    init() {
        super.init();
        // All editors are created, but not all are opened. This sets up the logic to swap previews when the editor is attached.
        this.onCreated((widget) => {
            if (this.layoutIsSet && widget.isPreview) {
                const oneTimeDisposable = widget.onDidChangeVisibility(() => {
                    this.handleNewPreview(widget);
                    oneTimeDisposable.dispose();
                });
            }
        });
        this.preferences.onPreferenceChanged(change => {
            if (change.preferenceName === 'editor.enablePreview' && !change.newValue) {
                this.all.forEach((editor) => {
                    if (editor.isPreview) {
                        editor.convertToNonPreview();
                    }
                });
            }
            ;
        });
        this.stateService.reachedState('initialized_layout').then(() => {
            const editors = this.all;
            const currentPreview = editors.find(editor => editor.isPreview);
            if (currentPreview) {
                this.handleNewPreview(currentPreview);
            }
            this.layoutIsSet = true;
        });
        document.addEventListener('dblclick', this.convertEditorOnDoubleClick.bind(this));
    }
    async doOpen(widget, options) {
        const { preview, widgetOptions = { area: 'main' }, mode = 'activate' } = options !== null && options !== void 0 ? options : {};
        if (!widget.isAttached) {
            this.shell.addWidget(widget, widgetOptions);
        }
        else if (!preview && widget.isPreview) {
            widget.convertToNonPreview();
        }
        if (mode === 'activate') {
            await this.shell.activateWidget(widget.id);
        }
        else if (mode === 'reveal') {
            await this.shell.revealWidget(widget.id);
        }
    }
    handleNewPreview(newPreviewWidget) {
        if (newPreviewWidget.isPreview) {
            const tabbar = this.shell.getTabBarFor(newPreviewWidget);
            if (tabbar) {
                for (const title of tabbar.titles) {
                    if (title.owner !== newPreviewWidget && title.owner instanceof editor_preview_widget_1.EditorPreviewWidget && title.owner.isPreview) {
                        title.owner.dispose();
                    }
                }
            }
        }
    }
    tryGetPendingWidget(uri, options) {
        var _a;
        return (_a = super.tryGetPendingWidget(uri, { ...options, preview: true })) !== null && _a !== void 0 ? _a : super.tryGetPendingWidget(uri, { ...options, preview: false });
    }
    async getWidget(uri, options) {
        var _a;
        return (_a = (await super.getWidget(uri, { ...options, preview: true }))) !== null && _a !== void 0 ? _a : super.getWidget(uri, { ...options, preview: false });
    }
    async getOrCreateWidget(uri, options) {
        var _a;
        return (_a = this.tryGetPendingWidget(uri, options)) !== null && _a !== void 0 ? _a : super.getOrCreateWidget(uri, options);
    }
    createWidgetOptions(uri, options) {
        const navigatableOptions = super.createWidgetOptions(uri, options);
        navigatableOptions.preview = !!((options === null || options === void 0 ? void 0 : options.preview) && this.preferences['editor.enablePreview']);
        return navigatableOptions;
    }
    convertEditorOnDoubleClick(event) {
        const widget = this.shell.findTargetedWidget(event);
        if (widget instanceof editor_preview_widget_1.EditorPreviewWidget && widget.isPreview) {
            widget.convertToNonPreview();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(editor_preview_preferences_1.EditorPreviewPreferences),
    __metadata("design:type", Object)
], EditorPreviewManager.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], EditorPreviewManager.prototype, "stateService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EditorPreviewManager.prototype, "init", null);
EditorPreviewManager = __decorate([
    (0, inversify_1.injectable)()
], EditorPreviewManager);
exports.EditorPreviewManager = EditorPreviewManager;
//# sourceMappingURL=editor-preview-manager.js.map