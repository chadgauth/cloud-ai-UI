"use strict";
// *****************************************************************************
// Copyright (C) 2020 EclipseSource and others.
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
var PropertyViewWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyViewWidget = void 0;
const core_1 = require("@theia/core");
const widget_1 = require("@theia/core/lib/browser/widgets/widget");
const disposable_1 = require("@theia/core/lib/common/disposable");
const inversify_1 = require("@theia/core/shared/inversify");
const property_view_service_1 = require("./property-view-service");
const nls_1 = require("@theia/core/lib/common/nls");
/**
 * The main container for the selection-specific property widgets.
 * Based on the given selection, the registered `PropertyViewWidgetProvider` provides the
 * content widget that displays the corresponding properties.
 */
let PropertyViewWidget = PropertyViewWidget_1 = class PropertyViewWidget extends widget_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.toDisposeOnDetach = new disposable_1.DisposableCollection();
    }
    init() {
        this.id = PropertyViewWidget_1.ID;
        this.title.label = PropertyViewWidget_1.LABEL;
        this.title.caption = PropertyViewWidget_1.LABEL;
        this.title.iconClass = (0, widget_1.codicon)('table');
        this.title.closable = true;
        this.addClass('theia-property-view-widget');
        this.node.tabIndex = 0;
        let disposed = false;
        this.toDispose.push(core_1.Disposable.create(() => disposed = true));
        this.toDispose.push(this.selectionService.onSelectionChanged((selection) => {
            this.propertyViewService.getProvider(selection).then(provider => {
                provider.provideWidget(selection).then(contentWidget => {
                    if (!disposed) {
                        this.replaceContentWidget(contentWidget);
                        provider.updateContentWidget(selection);
                    }
                });
            });
        }));
    }
    initializeContentWidget(selection) {
        this.propertyViewService.getProvider(selection).then(provider => {
            provider.provideWidget(selection).then(contentWidget => {
                this.attachContentWidget(contentWidget);
                provider.updateContentWidget(selection);
            });
        });
    }
    replaceContentWidget(newContentWidget) {
        if (this.contentWidget.id !== newContentWidget.id) {
            if (this.contentWidget) {
                widget_1.Widget.detach(this.contentWidget);
            }
            this.attachContentWidget(newContentWidget);
        }
    }
    attachContentWidget(newContentWidget) {
        this.contentWidget = newContentWidget;
        widget_1.Widget.attach(this.contentWidget, this.node);
        this.toDisposeOnDetach = new disposable_1.DisposableCollection();
        this.toDisposeOnDetach.push(core_1.Disposable.create(() => {
            if (this.contentWidget) {
                widget_1.Widget.detach(this.contentWidget);
            }
        }));
        this.update();
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.initializeContentWidget(this.selectionService.selection);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
        if (this.contentWidget) {
            this.contentWidget.activate();
        }
    }
    onResize(msg) {
        super.onResize(msg);
        if (this.contentWidget) {
            widget_1.MessageLoop.sendMessage(this.contentWidget, msg);
        }
    }
};
PropertyViewWidget.ID = 'property-view';
PropertyViewWidget.LABEL = nls_1.nls.localize('theia/property-view/properties', 'Properties');
__decorate([
    (0, inversify_1.inject)(property_view_service_1.PropertyViewService),
    __metadata("design:type", property_view_service_1.PropertyViewService)
], PropertyViewWidget.prototype, "propertyViewService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], PropertyViewWidget.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PropertyViewWidget.prototype, "init", null);
PropertyViewWidget = PropertyViewWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], PropertyViewWidget);
exports.PropertyViewWidget = PropertyViewWidget;
//# sourceMappingURL=property-view-widget.js.map