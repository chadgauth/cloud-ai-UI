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
var QuickEditorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickEditorService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const quick_access_1 = require("@theia/core/lib/browser/quick-input/quick-access");
const quick_input_service_1 = require("@theia/core/lib/browser/quick-input/quick-input-service");
const browser_1 = require("@theia/core/lib/browser");
let QuickEditorService = QuickEditorService_1 = class QuickEditorService {
    constructor() {
        this.groupLocalizations = [];
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: QuickEditorService_1.PREFIX,
            placeholder: '',
            helpEntries: [{ description: 'Show All Opened Editors', needsEditor: false }]
        });
    }
    getPicks(filter, token) {
        const editorItems = [];
        const hasUri = (widget) => Boolean(browser_1.NavigatableWidget.getUri(widget));
        const handleWidgets = (widgets, label) => {
            if (widgets.length) {
                editorItems.push({ type: 'separator', label });
            }
            editorItems.push(...widgets.map(widget => this.toItem(widget)));
        };
        const handleSplittableArea = (tabbars, labelPrefix) => {
            tabbars.forEach((tabbar, index) => {
                const editorsOnTabbar = tabbar.titles.reduce((widgets, title) => {
                    if (hasUri(title.owner)) {
                        widgets.push(title.owner);
                    }
                    return widgets;
                }, []);
                const label = tabbars.length > 1 ? `${labelPrefix} ${this.getGroupLocalization(index)}` : labelPrefix;
                handleWidgets(editorsOnTabbar, label);
            });
        };
        handleSplittableArea(this.shell.mainAreaTabBars, browser_1.ApplicationShell.areaLabels.main);
        handleSplittableArea(this.shell.bottomAreaTabBars, browser_1.ApplicationShell.areaLabels.bottom);
        for (const area of ['left', 'right']) {
            const editorsInArea = this.shell.getWidgets(area).filter(hasUri);
            handleWidgets(editorsInArea, browser_1.ApplicationShell.areaLabels[area]);
        }
        return (0, quick_input_service_1.filterItems)(editorItems.slice(), filter);
    }
    getGroupLocalization(index) {
        return this.groupLocalizations[index] || common_1.nls.localizeByDefault('Group {0}', index + 1);
    }
    toItem(widget) {
        const uri = browser_1.NavigatableWidget.getUri(widget);
        const icon = this.labelProvider.getIcon(uri);
        const iconClasses = icon === '' ? undefined : [icon + ' file-icon'];
        return {
            label: this.labelProvider.getName(uri),
            description: this.labelProvider.getDetails(uri),
            iconClasses,
            ariaLabel: uri.path.fsPath(),
            alwaysShow: true,
            execute: () => this.shell.activateWidget(widget.id),
        };
    }
};
QuickEditorService.PREFIX = 'edt ';
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], QuickEditorService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(quick_access_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], QuickEditorService.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], QuickEditorService.prototype, "shell", void 0);
QuickEditorService = QuickEditorService_1 = __decorate([
    (0, inversify_1.injectable)()
], QuickEditorService);
exports.QuickEditorService = QuickEditorService;
//# sourceMappingURL=quick-editor-service.js.map