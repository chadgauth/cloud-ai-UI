"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
var MiniBrowserOpenHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniBrowserOpenHandler = exports.MiniBrowserCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/core/lib/browser");
const command_1 = require("@theia/core/lib/common/command");
const navigatable_1 = require("@theia/core/lib/browser/navigatable");
const opener_service_1 = require("@theia/core/lib/browser/opener-service");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const mini_browser_service_1 = require("../common/mini-browser-service");
const mini_browser_1 = require("./mini-browser");
const location_mapper_service_1 = require("./location-mapper-service");
const nls_1 = require("@theia/core/lib/common/nls");
var MiniBrowserCommands;
(function (MiniBrowserCommands) {
    MiniBrowserCommands.PREVIEW_CATEGORY = 'Preview';
    MiniBrowserCommands.PREVIEW_CATEGORY_KEY = nls_1.nls.getDefaultKey(MiniBrowserCommands.PREVIEW_CATEGORY);
    MiniBrowserCommands.PREVIEW = command_1.Command.toLocalizedCommand({
        id: 'mini-browser.preview',
        label: 'Open Preview',
        iconClass: (0, browser_1.codicon)('open-preview')
    }, 'vscode.markdown-language-features/package/markdown.preview.title');
    MiniBrowserCommands.OPEN_SOURCE = {
        id: 'mini-browser.open.source',
        iconClass: (0, browser_1.codicon)('go-to-file')
    };
    MiniBrowserCommands.OPEN_URL = command_1.Command.toDefaultLocalizedCommand({
        id: 'mini-browser.openUrl',
        category: MiniBrowserCommands.PREVIEW_CATEGORY,
        label: 'Open URL'
    });
})(MiniBrowserCommands = exports.MiniBrowserCommands || (exports.MiniBrowserCommands = {}));
let MiniBrowserOpenHandler = MiniBrowserOpenHandler_1 = class MiniBrowserOpenHandler extends navigatable_1.NavigatableWidgetOpenHandler {
    constructor() {
        super(...arguments);
        /**
         * Instead of going to the backend with each file URI to ask whether it can handle the current file or not,
         * we have this map of extension and priority pairs that we populate at application startup.
         * The real advantage of this approach is the following: [Phosphor cannot run async code when invoking `isEnabled`/`isVisible`
         * for the command handlers](https://github.com/eclipse-theia/theia/issues/1958#issuecomment-392829371)
         * so the menu item would be always visible for the user even if the file type cannot be handled eventually.
         * Hopefully, we could get rid of this hack once we have migrated the existing Phosphor code to [React](https://github.com/eclipse-theia/theia/issues/1915).
         */
        this.supportedExtensions = new Map();
        this.id = mini_browser_1.MiniBrowser.ID;
        this.label = nls_1.nls.localize(MiniBrowserCommands.PREVIEW_CATEGORY_KEY, MiniBrowserCommands.PREVIEW_CATEGORY);
    }
    onStart() {
        this.miniBrowserService.supportedFileExtensions().then(entries => {
            entries.forEach(entry => {
                const { extension, priority } = entry;
                this.supportedExtensions.set(extension, priority);
            });
        });
    }
    canHandle(uri, options) {
        // It does not guard against directories. For instance, a folder with this name: `Hahahah.html`.
        // We could check with the FS, but then, this method would become async again.
        const extension = uri.toString().split('.').pop();
        if (!extension) {
            return 0;
        }
        if ((options === null || options === void 0 ? void 0 : options.openFor) === 'source') {
            return -100;
        }
        else if ((options === null || options === void 0 ? void 0 : options.openFor) === 'preview') {
            return 200; // higher than that of the editor.
        }
        else {
            return this.supportedExtensions.get(extension.toLocaleLowerCase()) || 0;
        }
    }
    async open(uri, options) {
        const widget = await super.open(uri, options);
        const area = this.shell.getAreaFor(widget);
        if (area === 'right' || area === 'left') {
            const panelLayout = area === 'right' ? this.shell.getLayoutData().rightPanel : this.shell.getLayoutData().leftPanel;
            const minSize = this.shell.mainPanel.node.offsetWidth / 2;
            if (panelLayout && panelLayout.size && panelLayout.size <= minSize) {
                requestAnimationFrame(() => this.shell.resize(minSize, area));
            }
        }
        return widget;
    }
    async getOrCreateWidget(uri, options) {
        const props = await this.options(uri, options);
        const widget = await super.getOrCreateWidget(uri, props);
        widget.setProps(props);
        return widget;
    }
    async options(uri, options) {
        // Get the default options.
        let result = await this.defaultOptions();
        if (uri) {
            // Decorate it with a few properties inferred from the URI.
            const startPage = uri.toString(true);
            const name = this.labelProvider.getName(uri);
            const iconClass = `${this.labelProvider.getIcon(uri)} file-icon`;
            // The background has to be reset to white only for "real" web-pages but not for images, for instance.
            const resetBackground = await this.resetBackground(uri);
            result = {
                ...result,
                startPage,
                name,
                iconClass,
                // Make sure the toolbar is not visible. We have the `iframe.src` anyway.
                toolbar: 'hide',
                resetBackground
            };
        }
        if (options) {
            // Explicit options overrule everything.
            result = {
                ...result,
                ...options
            };
        }
        return result;
    }
    resetBackground(uri) {
        const { scheme } = uri;
        const uriStr = uri.toString();
        return scheme === 'http'
            || scheme === 'https'
            || (scheme === 'file'
                && (uriStr.endsWith('html') || uriStr.endsWith('.htm')));
    }
    async defaultOptions() {
        return {
            mode: 'activate',
            widgetOptions: { area: 'main' },
            sandbox: mini_browser_1.MiniBrowserProps.SandboxOptions.DEFAULT,
            toolbar: 'show'
        };
    }
    registerCommands(commands) {
        commands.registerCommand(MiniBrowserCommands.PREVIEW, {
            execute: widget => this.preview(widget),
            isEnabled: widget => this.canPreviewWidget(widget),
            isVisible: widget => this.canPreviewWidget(widget)
        });
        commands.registerCommand(MiniBrowserCommands.OPEN_SOURCE, {
            execute: widget => this.openSource(widget),
            isEnabled: widget => !!this.getSourceUri(widget),
            isVisible: widget => !!this.getSourceUri(widget)
        });
        commands.registerCommand(MiniBrowserCommands.OPEN_URL, {
            execute: (arg) => this.openUrl(arg)
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(['editor_context_menu', 'navigation'], {
            commandId: MiniBrowserCommands.PREVIEW.id
        });
    }
    registerToolbarItems(toolbar) {
        toolbar.registerItem({
            id: MiniBrowserCommands.PREVIEW.id,
            command: MiniBrowserCommands.PREVIEW.id,
            tooltip: nls_1.nls.localize('vscode.markdown-language-features/package/markdown.previewSide.title', 'Open Preview to the Side')
        });
        toolbar.registerItem({
            id: MiniBrowserCommands.OPEN_SOURCE.id,
            command: MiniBrowserCommands.OPEN_SOURCE.id,
            tooltip: nls_1.nls.localize('vscode.markdown-language-features/package/markdown.showSource.title', 'Open Source')
        });
    }
    canPreviewWidget(widget) {
        const uri = this.getUriToPreview(widget);
        return !!uri && !!this.canHandle(uri);
    }
    getUriToPreview(widget) {
        const current = this.getWidgetToPreview(widget);
        return current && current.getResourceUri();
    }
    getWidgetToPreview(widget) {
        const current = widget ? widget : this.shell.currentWidget;
        // MiniBrowser is NavigatableWidget and should be excluded from widgets to preview
        return !(current instanceof mini_browser_1.MiniBrowser) && navigatable_1.NavigatableWidget.is(current) && current || undefined;
    }
    async preview(widget) {
        const ref = this.getWidgetToPreview(widget);
        if (!ref) {
            return;
        }
        const uri = ref.getResourceUri();
        if (!uri) {
            return;
        }
        await this.open(uri, {
            mode: 'reveal',
            widgetOptions: { ref, mode: 'open-to-right' },
            openFor: 'preview'
        });
    }
    async openSource(ref) {
        const uri = this.getSourceUri(ref);
        if (uri) {
            await (0, opener_service_1.open)(this.openerService, uri, {
                widgetOptions: { ref, mode: 'tab-after' },
                openFor: 'source'
            });
        }
    }
    getSourceUri(ref) {
        const uri = ref instanceof mini_browser_1.MiniBrowser && ref.getResourceUri() || undefined;
        if (!uri || uri.scheme === 'http' || uri.scheme === 'https' || uri.isEqual(MiniBrowserOpenHandler_1.PREVIEW_URI)) {
            return undefined;
        }
        return uri;
    }
    async openUrl(arg) {
        var _a;
        const url = arg ? arg : await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.input({
            prompt: nls_1.nls.localizeByDefault('URL to open'),
            placeHolder: nls_1.nls.localize('theia/mini-browser/typeUrl', 'Type a URL')
        }));
        if (url) {
            await this.openPreview(url);
        }
    }
    async openPreview(startPage) {
        const props = await this.getOpenPreviewProps(await this.locationMapperService.map(startPage));
        return this.open(MiniBrowserOpenHandler_1.PREVIEW_URI, props);
    }
    async getOpenPreviewProps(startPage) {
        const resetBackground = await this.resetBackground(new uri_1.default(startPage));
        return {
            name: nls_1.nls.localize(MiniBrowserCommands.PREVIEW_CATEGORY_KEY, MiniBrowserCommands.PREVIEW_CATEGORY),
            startPage,
            toolbar: 'read-only',
            widgetOptions: {
                area: 'right'
            },
            resetBackground,
            iconClass: (0, browser_1.codicon)('preview'),
            openFor: 'preview'
        };
    }
};
MiniBrowserOpenHandler.PREVIEW_URI = new uri_1.default().withScheme('__minibrowser__preview__');
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], MiniBrowserOpenHandler.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], MiniBrowserOpenHandler.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], MiniBrowserOpenHandler.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(mini_browser_service_1.MiniBrowserService),
    __metadata("design:type", Object)
], MiniBrowserOpenHandler.prototype, "miniBrowserService", void 0);
__decorate([
    (0, inversify_1.inject)(location_mapper_service_1.LocationMapperService),
    __metadata("design:type", location_mapper_service_1.LocationMapperService)
], MiniBrowserOpenHandler.prototype, "locationMapperService", void 0);
MiniBrowserOpenHandler = MiniBrowserOpenHandler_1 = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserOpenHandler);
exports.MiniBrowserOpenHandler = MiniBrowserOpenHandler;
//# sourceMappingURL=mini-browser-open-handler.js.map