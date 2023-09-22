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
var VSXExtension_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSXExtensionEditorComponent = exports.VSXExtensionComponent = exports.AbstractVSXExtensionComponent = exports.VSXExtension = exports.VSXExtensionFactory = exports.VSXExtensionOptions = exports.VSXExtensionData = exports.VSXExtensionsContextMenu = exports.EXTENSIONS_CONTEXT_MENU = void 0;
const React = require("@theia/core/shared/react");
const DOMPurify = require("@theia/core/shared/dompurify");
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const opener_service_1 = require("@theia/core/lib/browser/opener-service");
const hosted_plugin_1 = require("@theia/plugin-ext/lib/hosted/browser/hosted-plugin");
const plugin_protocol_1 = require("@theia/plugin-ext/lib/common/plugin-protocol");
const plugin_vscode_uri_1 = require("@theia/plugin-ext-vscode/lib/common/plugin-vscode-uri");
const progress_service_1 = require("@theia/core/lib/common/progress-service");
const endpoint_1 = require("@theia/core/lib/browser/endpoint");
const vsx_environment_1 = require("../common/vsx-environment");
const vsx_extensions_search_model_1 = require("./vsx-extensions-search-model");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const window_service_1 = require("@theia/core/lib/browser/window/window-service");
const markdown_rendering_1 = require("@theia/core/lib/common/markdown-rendering");
exports.EXTENSIONS_CONTEXT_MENU = ['extensions_context_menu'];
var VSXExtensionsContextMenu;
(function (VSXExtensionsContextMenu) {
    VSXExtensionsContextMenu.INSTALL = [...exports.EXTENSIONS_CONTEXT_MENU, '1_install'];
    VSXExtensionsContextMenu.COPY = [...exports.EXTENSIONS_CONTEXT_MENU, '2_copy'];
})(VSXExtensionsContextMenu = exports.VSXExtensionsContextMenu || (exports.VSXExtensionsContextMenu = {}));
let VSXExtensionData = class VSXExtensionData {
};
VSXExtensionData.KEYS = new Set([
    'version',
    'iconUrl',
    'publisher',
    'name',
    'displayName',
    'description',
    'averageRating',
    'downloadCount',
    'downloadUrl',
    'readmeUrl',
    'licenseUrl',
    'repository',
    'license',
    'readme',
    'preview',
    'namespaceAccess',
    'publishedBy'
]);
VSXExtensionData = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionData);
exports.VSXExtensionData = VSXExtensionData;
let VSXExtensionOptions = class VSXExtensionOptions {
};
VSXExtensionOptions = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionOptions);
exports.VSXExtensionOptions = VSXExtensionOptions;
exports.VSXExtensionFactory = Symbol('VSXExtensionFactory');
let VSXExtension = VSXExtension_1 = class VSXExtension {
    constructor() {
        this.data = {};
        this._busy = 0;
    }
    /**
     * Ensure the version string begins with `'v'`.
     */
    static formatVersion(version) {
        if (version && !version.startsWith('v')) {
            return `v${version}`;
        }
        return version;
    }
    postConstruct() {
        this.registryUri = this.environment.getRegistryUri();
    }
    get uri() {
        return plugin_vscode_uri_1.VSCodeExtensionUri.toUri(this.id);
    }
    get id() {
        return this.options.id;
    }
    get visible() {
        return !!this.name;
    }
    get plugin() {
        return this.pluginSupport.getPlugin(this.id);
    }
    get installed() {
        return !!this.plugin;
    }
    get builtin() {
        var _a;
        return ((_a = this.plugin) === null || _a === void 0 ? void 0 : _a.type) === plugin_protocol_1.PluginType.System;
    }
    update(data) {
        for (const key of VSXExtensionData.KEYS) {
            if (key in data) {
                Object.assign(this.data, { [key]: data[key] });
            }
        }
    }
    reloadWindow() {
        this.windowService.reload();
    }
    getData(key) {
        var _a;
        const model = (_a = this.plugin) === null || _a === void 0 ? void 0 : _a.metadata.model;
        if (model && key in model) {
            return model[key];
        }
        return this.data[key];
    }
    get iconUrl() {
        const plugin = this.plugin;
        const iconUrl = plugin && plugin.metadata.model.iconUrl;
        if (iconUrl) {
            return new endpoint_1.Endpoint({ path: iconUrl }).getRestUrl().toString();
        }
        return this.data['iconUrl'];
    }
    get publisher() {
        return this.getData('publisher');
    }
    get name() {
        return this.getData('name');
    }
    get displayName() {
        return this.getData('displayName') || this.name;
    }
    get description() {
        return this.getData('description');
    }
    get version() {
        return this.getData('version');
    }
    get averageRating() {
        return this.getData('averageRating');
    }
    get downloadCount() {
        return this.getData('downloadCount');
    }
    get downloadUrl() {
        return this.getData('downloadUrl');
    }
    get readmeUrl() {
        const plugin = this.plugin;
        const readmeUrl = plugin && plugin.metadata.model.readmeUrl;
        if (readmeUrl) {
            return new endpoint_1.Endpoint({ path: readmeUrl }).getRestUrl().toString();
        }
        return this.data['readmeUrl'];
    }
    get licenseUrl() {
        let licenseUrl = this.data['licenseUrl'];
        if (licenseUrl) {
            return licenseUrl;
        }
        else {
            const plugin = this.plugin;
            licenseUrl = plugin && plugin.metadata.model.licenseUrl;
            if (licenseUrl) {
                return new endpoint_1.Endpoint({ path: licenseUrl }).getRestUrl().toString();
            }
        }
    }
    get repository() {
        return this.getData('repository');
    }
    get license() {
        return this.getData('license');
    }
    get readme() {
        return this.getData('readme');
    }
    get preview() {
        return this.getData('preview');
    }
    get namespaceAccess() {
        return this.getData('namespaceAccess');
    }
    get publishedBy() {
        return this.getData('publishedBy');
    }
    get tooltip() {
        let md = `__${this.displayName}__ ${VSXExtension_1.formatVersion(this.version)}\n\n${this.description}\n_____\n\n${common_1.nls.localizeByDefault('Publisher: {0}', this.publisher)}`;
        if (this.license) {
            md += `  \r${common_1.nls.localize('theia/vsx-registry/license', 'License: {0}', this.license)}`;
        }
        if (this.downloadCount) {
            md += `  \r${common_1.nls.localize('theia/vsx-registry/downloadCount', 'Download count: {0}', downloadCompactFormatter.format(this.downloadCount))}`;
        }
        if (this.averageRating) {
            md += `  \r${getAverageRatingTitle(this.averageRating)}`;
        }
        return md;
    }
    get busy() {
        return !!this._busy;
    }
    async install(options) {
        var _a;
        this._busy++;
        try {
            await this.progressService.withProgress(common_1.nls.localizeByDefault("Installing extension '{0}' v{1}...", this.id, (_a = this.version) !== null && _a !== void 0 ? _a : 0), 'extensions', () => this.pluginServer.deploy(this.uri.toString(), undefined, options));
        }
        finally {
            this._busy--;
        }
    }
    async uninstall() {
        this._busy++;
        try {
            const { plugin } = this;
            if (plugin) {
                await this.progressService.withProgress(common_1.nls.localizeByDefault('Uninstalling {0}...', this.id), 'extensions', () => this.pluginServer.uninstall(plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(plugin.metadata.model)));
            }
        }
        finally {
            this._busy--;
        }
    }
    handleContextMenu(e) {
        e.preventDefault();
        this.contextMenuRenderer.render({
            menuPath: exports.EXTENSIONS_CONTEXT_MENU,
            anchor: {
                x: e.clientX,
                y: e.clientY,
            },
            args: [this]
        });
    }
    /**
     * Get the registry link for the given extension.
     * @param path the url path.
     * @returns the registry link for the given extension at the path.
     */
    async getRegistryLink(path = '') {
        const registryUri = new uri_1.default(await this.registryUri);
        if (this.downloadUrl) {
            const downloadUri = new uri_1.default(this.downloadUrl);
            if (downloadUri.authority !== registryUri.authority) {
                throw new Error('cannot generate a valid URL');
            }
        }
        return registryUri.resolve('extension/' + this.id.replace('.', '/')).resolve(path);
    }
    async serialize() {
        const serializedExtension = [];
        serializedExtension.push(`Name: ${this.displayName}`);
        serializedExtension.push(`Id: ${this.id}`);
        serializedExtension.push(`Description: ${this.description}`);
        serializedExtension.push(`Version: ${this.version}`);
        serializedExtension.push(`Publisher: ${this.publisher}`);
        if (this.downloadUrl !== undefined) {
            const registryLink = await this.getRegistryLink();
            serializedExtension.push(`Open VSX Link: ${registryLink.toString()}`);
        }
        ;
        return serializedExtension.join('\n');
    }
    async open(options = { mode: 'reveal' }) {
        await this.doOpen(this.uri, options);
    }
    async doOpen(uri, options) {
        await (0, opener_service_1.open)(this.openerService, uri, options);
    }
    render(host) {
        return React.createElement(VSXExtensionComponent, { extension: this, host: host, hoverService: this.hoverService });
    }
};
__decorate([
    (0, inversify_1.inject)(VSXExtensionOptions),
    __metadata("design:type", VSXExtensionOptions)
], VSXExtension.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], VSXExtension.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_1.HostedPluginSupport),
    __metadata("design:type", hosted_plugin_1.HostedPluginSupport)
], VSXExtension.prototype, "pluginSupport", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginServer),
    __metadata("design:type", Object)
], VSXExtension.prototype, "pluginServer", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], VSXExtension.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], VSXExtension.prototype, "contextMenuRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_environment_1.VSXEnvironment),
    __metadata("design:type", Object)
], VSXExtension.prototype, "environment", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_search_model_1.VSXExtensionsSearchModel),
    __metadata("design:type", vsx_extensions_search_model_1.VSXExtensionsSearchModel)
], VSXExtension.prototype, "search", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.HoverService),
    __metadata("design:type", browser_1.HoverService)
], VSXExtension.prototype, "hoverService", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], VSXExtension.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], VSXExtension.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtension.prototype, "postConstruct", null);
VSXExtension = VSXExtension_1 = __decorate([
    (0, inversify_1.injectable)()
], VSXExtension);
exports.VSXExtension = VSXExtension;
class AbstractVSXExtensionComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.install = async (event) => {
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            this.forceUpdate();
            try {
                const pending = this.props.extension.install();
                this.forceUpdate();
                await pending;
            }
            finally {
                this.forceUpdate();
            }
        };
        this.uninstall = async (event) => {
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            try {
                const pending = this.props.extension.uninstall();
                this.forceUpdate();
                await pending;
            }
            finally {
                this.forceUpdate();
            }
        };
        this.reloadWindow = (event) => {
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            this.props.extension.reloadWindow();
        };
        this.manage = (e) => {
            e.stopPropagation();
            this.props.extension.handleContextMenu(e);
        };
    }
    renderAction(host) {
        var _a;
        const { builtin, busy, plugin } = this.props.extension;
        const isFocused = ((_a = host === null || host === void 0 ? void 0 : host.model.getFocusedNode()) === null || _a === void 0 ? void 0 : _a.element) === this.props.extension;
        const tabIndex = (!host || isFocused) ? 0 : undefined;
        const installed = !!plugin;
        const outOfSynch = plugin === null || plugin === void 0 ? void 0 : plugin.metadata.outOfSync;
        if (builtin) {
            return React.createElement("div", { className: "codicon codicon-settings-gear action", tabIndex: tabIndex, onClick: this.manage });
        }
        if (busy) {
            if (installed) {
                return React.createElement("button", { className: "theia-button action theia-mod-disabled" }, common_1.nls.localizeByDefault('Uninstalling'));
            }
            return React.createElement("button", { className: "theia-button action prominent theia-mod-disabled" }, common_1.nls.localizeByDefault('Installing'));
        }
        if (installed) {
            return React.createElement("div", null,
                outOfSynch
                    ? React.createElement("button", { className: "theia-button action", onClick: this.reloadWindow }, common_1.nls.localizeByDefault('Reload Required'))
                    : React.createElement("button", { className: "theia-button action", onClick: this.uninstall }, common_1.nls.localizeByDefault('Uninstall')),
                React.createElement("div", { className: "codicon codicon-settings-gear action", onClick: this.manage }));
        }
        return React.createElement("button", { className: "theia-button prominent action", onClick: this.install }, common_1.nls.localizeByDefault('Install'));
    }
}
exports.AbstractVSXExtensionComponent = AbstractVSXExtensionComponent;
const downloadFormatter = new Intl.NumberFormat();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const downloadCompactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' });
const averageRatingFormatter = (averageRating) => Math.round(averageRating * 2) / 2;
const getAverageRatingTitle = (averageRating) => common_1.nls.localizeByDefault('Average rating: {0} out of 5', averageRatingFormatter(averageRating));
class VSXExtensionComponent extends AbstractVSXExtensionComponent {
    render() {
        const { iconUrl, publisher, displayName, description, version, downloadCount, averageRating, tooltip } = this.props.extension;
        return React.createElement("div", { className: 'theia-vsx-extension noselect', onMouseEnter: event => {
                this.props.hoverService.requestHover({
                    content: new markdown_rendering_1.MarkdownStringImpl(tooltip),
                    target: event.currentTarget,
                    position: 'right'
                });
            } },
            iconUrl ?
                React.createElement("img", { className: 'theia-vsx-extension-icon', src: iconUrl }) :
                React.createElement("div", { className: 'theia-vsx-extension-icon placeholder' }),
            React.createElement("div", { className: 'theia-vsx-extension-content' },
                React.createElement("div", { className: 'title' },
                    React.createElement("div", { className: 'noWrapInfo' },
                        React.createElement("span", { className: 'name' }, displayName),
                        " ",
                        React.createElement("span", { className: 'version' }, VSXExtension.formatVersion(version))),
                    React.createElement("div", { className: 'stat' },
                        !!downloadCount && React.createElement("span", { className: 'download-count' },
                            React.createElement("i", { className: (0, browser_1.codicon)('cloud-download') }),
                            downloadCompactFormatter.format(downloadCount)),
                        !!averageRating && React.createElement("span", { className: 'average-rating' },
                            React.createElement("i", { className: (0, browser_1.codicon)('star-full') }),
                            averageRatingFormatter(averageRating)))),
                React.createElement("div", { className: 'noWrapInfo theia-vsx-extension-description' }, description),
                React.createElement("div", { className: 'theia-vsx-extension-action-bar' },
                    React.createElement("span", { className: 'noWrapInfo theia-vsx-extension-publisher' }, publisher),
                    this.renderAction(this.props.host))));
    }
}
exports.VSXExtensionComponent = VSXExtensionComponent;
class VSXExtensionEditorComponent extends AbstractVSXExtensionComponent {
    constructor() {
        super(...arguments);
        // TODO replace with webview
        this.openLink = (event) => {
            if (!this.body) {
                return;
            }
            const target = event.nativeEvent.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }
            let node = target;
            while (node.tagName.toLowerCase() !== 'a') {
                if (node === this.body) {
                    return;
                }
                if (!(node.parentElement instanceof HTMLElement)) {
                    return;
                }
                node = node.parentElement;
            }
            const href = node.getAttribute('href');
            if (href && !href.startsWith('#')) {
                event.preventDefault();
                this.props.extension.doOpen(new uri_1.default(href));
            }
        };
        this.openExtension = async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            const uri = await extension.getRegistryLink();
            extension.doOpen(uri);
        };
        this.searchPublisher = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            if (extension.publisher) {
                extension.search.query = extension.publisher;
            }
        };
        this.openPublishedBy = async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            const homepage = extension.publishedBy && extension.publishedBy.homepage;
            if (homepage) {
                extension.doOpen(new uri_1.default(homepage));
            }
        };
        this.openAverageRating = async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            const uri = await extension.getRegistryLink('reviews');
            extension.doOpen(uri);
        };
        this.openRepository = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            if (extension.repository) {
                extension.doOpen(new uri_1.default(extension.repository));
            }
        };
        this.openLicense = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            const licenseUrl = extension.licenseUrl;
            if (licenseUrl) {
                extension.doOpen(new uri_1.default(licenseUrl));
            }
        };
    }
    get scrollContainer() {
        return this._scrollContainer;
    }
    render() {
        const { builtin, preview, id, iconUrl, publisher, displayName, description, version, averageRating, downloadCount, repository, license, readme } = this.props.extension;
        const sanitizedReadme = !!readme ? DOMPurify.sanitize(readme) : undefined;
        return React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'header', ref: ref => this.header = (ref || undefined) },
                iconUrl ?
                    React.createElement("img", { className: 'icon-container', src: iconUrl }) :
                    React.createElement("div", { className: 'icon-container placeholder' }),
                React.createElement("div", { className: 'details' },
                    React.createElement("div", { className: 'title' },
                        React.createElement("span", { title: 'Extension name', className: 'name', onClick: this.openExtension }, displayName),
                        React.createElement("span", { title: 'Extension identifier', className: 'identifier' }, id),
                        preview && React.createElement("span", { className: 'preview' }, "Preview"),
                        builtin && React.createElement("span", { className: 'builtin' }, "Built-in")),
                    React.createElement("div", { className: 'subtitle' },
                        React.createElement("span", { title: 'Publisher name', className: 'publisher', onClick: this.searchPublisher },
                            this.renderNamespaceAccess(),
                            publisher),
                        !!downloadCount && React.createElement("span", { className: 'download-count', onClick: this.openExtension },
                            React.createElement("i", { className: (0, browser_1.codicon)('cloud-download') }),
                            downloadFormatter.format(downloadCount)),
                        averageRating !== undefined &&
                            React.createElement("span", { className: 'average-rating', title: getAverageRatingTitle(averageRating), onClick: this.openAverageRating }, this.renderStars()),
                        repository && React.createElement("span", { className: 'repository', onClick: this.openRepository }, "Repository"),
                        license && React.createElement("span", { className: 'license', onClick: this.openLicense }, license),
                        version && React.createElement("span", { className: 'version' }, VSXExtension.formatVersion(version))),
                    React.createElement("div", { className: 'description noWrapInfo' }, description),
                    this.renderAction())),
            sanitizedReadme &&
                React.createElement("div", { className: 'scroll-container', ref: ref => this._scrollContainer = (ref || undefined) },
                    React.createElement("div", { className: 'body', ref: ref => this.body = (ref || undefined), onClick: this.openLink, 
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML: { __html: sanitizedReadme } })));
    }
    renderNamespaceAccess() {
        const { publisher, namespaceAccess, publishedBy } = this.props.extension;
        if (namespaceAccess === undefined) {
            return undefined;
        }
        let tooltip = publishedBy ? ` Published by "${publishedBy.loginName}".` : '';
        let icon;
        if (namespaceAccess === 'public') {
            icon = 'globe';
            tooltip = `Everyone can publish to "${publisher}" namespace.` + tooltip;
        }
        else {
            icon = 'shield';
            tooltip = `Only verified owners can publish to "${publisher}" namespace.` + tooltip;
        }
        return React.createElement("i", { className: `${(0, browser_1.codicon)(icon)} namespace-access`, title: tooltip, onClick: this.openPublishedBy });
    }
    renderStars() {
        const rating = this.props.extension.averageRating || 0;
        const renderStarAt = (position) => position <= rating ?
            React.createElement("i", { className: (0, browser_1.codicon)('star-full') }) :
            position > rating && position - rating < 1 ?
                React.createElement("i", { className: (0, browser_1.codicon)('star-half') }) :
                React.createElement("i", { className: (0, browser_1.codicon)('star-empty') });
        return React.createElement(React.Fragment, null,
            renderStarAt(1),
            renderStarAt(2),
            renderStarAt(3),
            renderStarAt(4),
            renderStarAt(5));
    }
}
exports.VSXExtensionEditorComponent = VSXExtensionEditorComponent;
//# sourceMappingURL=vsx-extension.js.map