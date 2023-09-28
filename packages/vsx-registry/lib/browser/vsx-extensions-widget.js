"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
var VSXExtensionsWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSXExtensionsWidget = exports.generateExtensionWidgetId = exports.VSXExtensionsWidgetOptions = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const source_tree_1 = require("@theia/core/lib/browser/source-tree");
const vsx_extensions_source_1 = require("./vsx-extensions-source");
const nls_1 = require("@theia/core/lib/common/nls");
const common_1 = require("@theia/core/lib/common");
const alert_message_1 = require("@theia/core/lib/browser/widgets/alert-message");
const React = require("@theia/core/shared/react");
let VSXExtensionsWidgetOptions = class VSXExtensionsWidgetOptions extends vsx_extensions_source_1.VSXExtensionsSourceOptions {
};
VSXExtensionsWidgetOptions = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsWidgetOptions);
exports.VSXExtensionsWidgetOptions = VSXExtensionsWidgetOptions;
const generateExtensionWidgetId = (widgetId) => VSXExtensionsWidget.ID + ':' + widgetId;
exports.generateExtensionWidgetId = generateExtensionWidgetId;
let VSXExtensionsWidget = VSXExtensionsWidget_1 = class VSXExtensionsWidget extends source_tree_1.SourceTreeWidget {
    constructor() {
        super(...arguments);
        this.onDidChangeBadgeEmitter = new common_1.Emitter();
        this.onDidChangeBadgeTooltipEmitter = new common_1.Emitter();
    }
    static createWidget(parent, options) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(vsx_extensions_source_1.VSXExtensionsSourceOptions).toConstantValue(options);
        child.bind(vsx_extensions_source_1.VSXExtensionsSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(VSXExtensionsWidgetOptions).toConstantValue(options);
        child.bind(VSXExtensionsWidget_1).toSelf();
        return child.get(VSXExtensionsWidget_1);
    }
    init() {
        var _a;
        super.init();
        this.addClass('theia-vsx-extensions');
        this.id = (0, exports.generateExtensionWidgetId)(this.options.id);
        this.toDispose.push(this.extensionsSource);
        this.source = this.extensionsSource;
        const title = (_a = this.options.title) !== null && _a !== void 0 ? _a : this.computeTitle();
        this.title.label = title;
        this.title.caption = title;
        this.toDispose.push(this.source.onDidChange(async () => {
            this.badge = await this.resolveCount();
        }));
    }
    get onDidChangeBadge() {
        return this.onDidChangeBadgeEmitter.event;
    }
    get badge() {
        return this._badge;
    }
    set badge(count) {
        this._badge = count;
        this.onDidChangeBadgeEmitter.fire();
    }
    get onDidChangeBadgeTooltip() {
        return this.onDidChangeBadgeTooltipEmitter.event;
    }
    get badgeTooltip() {
        return this._badgeTooltip;
    }
    set badgeTooltip(tooltip) {
        this._badgeTooltip = tooltip;
        this.onDidChangeBadgeTooltipEmitter.fire();
    }
    computeTitle() {
        switch (this.options.id) {
            case vsx_extensions_source_1.VSXExtensionsSourceOptions.INSTALLED:
                return nls_1.nls.localizeByDefault('Installed');
            case vsx_extensions_source_1.VSXExtensionsSourceOptions.BUILT_IN:
                return nls_1.nls.localizeByDefault('Built-in');
            case vsx_extensions_source_1.VSXExtensionsSourceOptions.RECOMMENDED:
                return nls_1.nls.localizeByDefault('Recommended');
            case vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT:
                return 'Open VSX Registry';
            default:
                return '';
        }
    }
    async resolveCount() {
        var _a;
        if (this.options.id !== vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT) {
            const elements = await ((_a = this.source) === null || _a === void 0 ? void 0 : _a.getElements()) || [];
            return [...elements].length;
        }
        return undefined;
    }
    tapNode(node) {
        super.tapNode(node);
        this.model.openNode(node);
    }
    handleDblClickEvent() {
        // Don't open the editor view on a double click.
    }
    renderTree(model) {
        if (this.options.id === vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT) {
            const searchError = this.extensionsSource.getModel().searchError;
            if (!!searchError) {
                const message = nls_1.nls.localize('theia/vsx-registry/errorFetching', 'Error fetching extensions.');
                const configurationHint = nls_1.nls.localize('theia/vsx-registry/errorFetchingConfigurationHint', 'This could be caused by network configuration issues.');
                const hint = searchError.includes('ENOTFOUND') ? configurationHint : '';
                return React.createElement(alert_message_1.AlertMessage, { type: 'ERROR', header: `${message} ${searchError} ${hint}` });
            }
        }
        return super.renderTree(model);
    }
};
VSXExtensionsWidget.ID = 'vsx-extensions';
__decorate([
    (0, inversify_1.inject)(VSXExtensionsWidgetOptions),
    __metadata("design:type", VSXExtensionsWidgetOptions)
], VSXExtensionsWidget.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_source_1.VSXExtensionsSource),
    __metadata("design:type", vsx_extensions_source_1.VSXExtensionsSource)
], VSXExtensionsWidget.prototype, "extensionsSource", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsWidget.prototype, "init", null);
VSXExtensionsWidget = VSXExtensionsWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsWidget);
exports.VSXExtensionsWidget = VSXExtensionsWidget;
//# sourceMappingURL=vsx-extensions-widget.js.map