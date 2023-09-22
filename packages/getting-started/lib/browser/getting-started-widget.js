"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
var GettingStartedWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GettingStartedWidget = void 0;
const React = require("@theia/core/shared/react");
const uri_1 = require("@theia/core/lib/common/uri");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/workspace/lib/browser");
const browser_2 = require("@theia/keymaps/lib/browser");
const browser_3 = require("@theia/core/lib/browser");
const application_protocol_1 = require("@theia/core/lib/common/application-protocol");
const frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
const env_variables_1 = require("@theia/core/lib/common/env-variables");
const window_service_1 = require("@theia/core/lib/browser/window/window-service");
const nls_1 = require("@theia/core/lib/common/nls");
/**
 * Default implementation of the `GettingStartedWidget`.
 * The widget is displayed when there are currently no workspaces present.
 * Some of the features displayed include:
 * - `open` commands.
 * - `recently used workspaces`.
 * - `settings` commands.
 * - `help` commands.
 * - helpful links.
 */
let GettingStartedWidget = GettingStartedWidget_1 = class GettingStartedWidget extends browser_3.ReactWidget {
    constructor() {
        super(...arguments);
        /**
         * The application name which is used for display purposes.
         */
        this.applicationName = frontend_application_config_provider_1.FrontendApplicationConfigProvider.get().applicationName;
        /**
         * The recently used workspaces limit.
         * Used in order to limit the number of recently used workspaces to display.
         */
        this.recentLimit = 5;
        /**
         * The list of recently used workspaces.
         */
        this.recentWorkspaces = [];
        /**
         * Collection of useful links to display for end users.
         */
        this.documentationUrl = 'https://www.theia-ide.org/docs/';
        this.compatibilityUrl = 'https://eclipse-theia.github.io/vscode-theia-comparator/status.html';
        this.extensionUrl = 'https://www.theia-ide.org/docs/authoring_extensions';
        this.pluginUrl = 'https://www.theia-ide.org/docs/authoring_plugins';
        /**
         * Trigger the open command.
         */
        this.doOpen = () => this.commandRegistry.executeCommand(browser_1.WorkspaceCommands.OPEN.id);
        this.doOpenEnter = (e) => {
            if (this.isEnterKey(e)) {
                this.doOpen();
            }
        };
        /**
         * Trigger the open file command.
         */
        this.doOpenFile = () => this.commandRegistry.executeCommand(browser_1.WorkspaceCommands.OPEN_FILE.id);
        this.doOpenFileEnter = (e) => {
            if (this.isEnterKey(e)) {
                this.doOpenFile();
            }
        };
        /**
         * Trigger the open folder command.
         */
        this.doOpenFolder = () => this.commandRegistry.executeCommand(browser_1.WorkspaceCommands.OPEN_FOLDER.id);
        this.doOpenFolderEnter = (e) => {
            if (this.isEnterKey(e)) {
                this.doOpenFolder();
            }
        };
        /**
         * Trigger the open workspace command.
         */
        this.doOpenWorkspace = () => this.commandRegistry.executeCommand(browser_1.WorkspaceCommands.OPEN_WORKSPACE.id);
        this.doOpenWorkspaceEnter = (e) => {
            if (this.isEnterKey(e)) {
                this.doOpenWorkspace();
            }
        };
        /**
         * Trigger the open recent workspace command.
         */
        this.doOpenRecentWorkspace = () => this.commandRegistry.executeCommand(browser_1.WorkspaceCommands.OPEN_RECENT_WORKSPACE.id);
        this.doOpenRecentWorkspaceEnter = (e) => {
            if (this.isEnterKey(e)) {
                this.doOpenRecentWorkspace();
            }
        };
        /**
         * Trigger the open preferences command.
         * Used to open the preferences widget.
         */
        this.doOpenPreferences = () => this.commandRegistry.executeCommand(browser_3.CommonCommands.OPEN_PREFERENCES.id);
        this.doOpenPreferencesEnter = (e) => {
            if (this.isEnterKey(e)) {
                this.doOpenPreferences();
            }
        };
        /**
         * Trigger the open keyboard shortcuts command.
         * Used to open the keyboard shortcuts widget.
         */
        this.doOpenKeyboardShortcuts = () => this.commandRegistry.executeCommand(browser_2.KeymapsCommands.OPEN_KEYMAPS.id);
        this.doOpenKeyboardShortcutsEnter = (e) => {
            if (this.isEnterKey(e)) {
                this.doOpenKeyboardShortcuts();
            }
        };
        /**
         * Open a workspace given its uri.
         * @param uri {URI} the workspace uri.
         */
        this.open = (uri) => this.workspaceService.open(uri);
        this.openEnter = (e, uri) => {
            if (this.isEnterKey(e)) {
                this.open(uri);
            }
        };
        /**
         * Open a link in an external window.
         * @param url the link.
         */
        this.doOpenExternalLink = (url) => this.windowService.openNewWindow(url, { external: true });
        this.doOpenExternalLinkEnter = (e, url) => {
            if (this.isEnterKey(e)) {
                this.doOpenExternalLink(url);
            }
        };
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.id = GettingStartedWidget_1.ID;
        this.title.label = GettingStartedWidget_1.LABEL;
        this.title.caption = GettingStartedWidget_1.LABEL;
        this.title.closable = true;
        this.applicationInfo = await this.appServer.getApplicationInfo();
        this.recentWorkspaces = await this.workspaceService.recentWorkspaces();
        this.home = new uri_1.default(await this.environments.getHomeDirUri()).path.toString();
        this.update();
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        const elArr = this.node.getElementsByTagName('a');
        if (elArr && elArr.length > 0) {
            elArr[0].focus();
        }
    }
    /**
     * Render the content of the widget.
     */
    render() {
        return React.createElement("div", { className: 'gs-container' },
            React.createElement("div", { className: 'gs-content-container' },
                this.renderHeader(),
                React.createElement("hr", { className: 'gs-hr' }),
                React.createElement("div", { className: 'flex-grid' },
                    React.createElement("div", { className: 'col' }, this.renderOpen())),
                React.createElement("div", { className: 'flex-grid' },
                    React.createElement("div", { className: 'col' }, this.renderRecentWorkspaces())),
                React.createElement("div", { className: 'flex-grid' },
                    React.createElement("div", { className: 'col' }, this.renderSettings())),
                React.createElement("div", { className: 'flex-grid' },
                    React.createElement("div", { className: 'col' }, this.renderHelp())),
                React.createElement("div", { className: 'flex-grid' },
                    React.createElement("div", { className: 'col' }, this.renderVersion()))),
            React.createElement("div", { className: 'gs-preference-container' }, this.renderPreferences()));
    }
    /**
     * Render the widget header.
     * Renders the title `{applicationName} Getting Started`.
     */
    renderHeader() {
        return React.createElement("div", { className: 'gs-header' },
            React.createElement("h1", null,
                this.applicationName,
                React.createElement("span", { className: 'gs-sub-header' }, ' ' + GettingStartedWidget_1.LABEL)));
    }
    /**
     * Render the `open` section.
     * Displays a collection of `open` commands.
     */
    renderOpen() {
        const requireSingleOpen = common_1.isOSX || !common_1.environment.electron.is();
        const open = requireSingleOpen && React.createElement("div", { className: 'gs-action-container' },
            React.createElement("a", { role: 'button', tabIndex: 0, onClick: this.doOpen, onKeyDown: this.doOpenEnter }, nls_1.nls.localizeByDefault('Open')));
        const openFile = !requireSingleOpen && React.createElement("div", { className: 'gs-action-container' },
            React.createElement("a", { role: 'button', tabIndex: 0, onClick: this.doOpenFile, onKeyDown: this.doOpenFileEnter }, nls_1.nls.localizeByDefault('Open File')));
        const openFolder = !requireSingleOpen && React.createElement("div", { className: 'gs-action-container' },
            React.createElement("a", { role: 'button', tabIndex: 0, onClick: this.doOpenFolder, onKeyDown: this.doOpenFolderEnter }, nls_1.nls.localizeByDefault('Open Folder')));
        const openWorkspace = (React.createElement("a", { role: 'button', tabIndex: 0, onClick: this.doOpenWorkspace, onKeyDown: this.doOpenWorkspaceEnter }, nls_1.nls.localizeByDefault('Open Workspace')));
        return React.createElement("div", { className: 'gs-section' },
            React.createElement("h3", { className: 'gs-section-header' },
                React.createElement("i", { className: (0, browser_3.codicon)('folder-opened') }),
                nls_1.nls.localizeByDefault('Open')),
            open,
            openFile,
            openFolder,
            openWorkspace);
    }
    /**
     * Render the recently used workspaces section.
     */
    renderRecentWorkspaces() {
        const items = this.recentWorkspaces;
        const paths = this.buildPaths(items);
        const content = paths.slice(0, this.recentLimit).map((item, index) => React.createElement("div", { className: 'gs-action-container', key: index },
            React.createElement("a", { role: 'button', tabIndex: 0, onClick: () => this.open(new uri_1.default(items[index])), onKeyDown: (e) => this.openEnter(e, new uri_1.default(items[index])) }, new uri_1.default(items[index]).path.base),
            React.createElement("span", { className: 'gs-action-details' }, item)));
        // If the recently used workspaces list exceeds the limit, display `More...` which triggers the recently used workspaces quick-open menu upon selection.
        const more = paths.length > this.recentLimit && React.createElement("div", { className: 'gs-action-container' },
            React.createElement("a", { role: 'button', tabIndex: 0, onClick: this.doOpenRecentWorkspace, onKeyDown: this.doOpenRecentWorkspaceEnter }, nls_1.nls.localizeByDefault('More...')));
        return React.createElement("div", { className: 'gs-section' },
            React.createElement("h3", { className: 'gs-section-header' },
                React.createElement("i", { className: (0, browser_3.codicon)('history') }),
                nls_1.nls.localizeByDefault('Recent')),
            items.length > 0 ? content : React.createElement("p", { className: 'gs-no-recent' },
                nls_1.nls.localizeByDefault('You have no recent folders,') + ' ',
                React.createElement("a", { role: 'button', tabIndex: 0, onClick: this.doOpenFolder, onKeyDown: this.doOpenFolderEnter }, nls_1.nls.localizeByDefault('open a folder')),
                ' ' + nls_1.nls.localizeByDefault('to start.')),
            more);
    }
    /**
     * Render the settings section.
     * Generally used to display useful links.
     */
    renderSettings() {
        return React.createElement("div", { className: 'gs-section' },
            React.createElement("h3", { className: 'gs-section-header' },
                React.createElement("i", { className: (0, browser_3.codicon)('settings-gear') }),
                nls_1.nls.localizeByDefault('Settings')),
            React.createElement("div", { className: 'gs-action-container' },
                React.createElement("a", { role: 'button', tabIndex: 0, onClick: this.doOpenPreferences, onKeyDown: this.doOpenPreferencesEnter }, nls_1.nls.localizeByDefault('Open Settings'))),
            React.createElement("div", { className: 'gs-action-container' },
                React.createElement("a", { role: 'button', tabIndex: 0, onClick: this.doOpenKeyboardShortcuts, onKeyDown: this.doOpenKeyboardShortcutsEnter }, nls_1.nls.localizeByDefault('Open Keyboard Shortcuts'))));
    }
    /**
     * Render the help section.
     */
    renderHelp() {
        return React.createElement("div", { className: 'gs-section' },
            React.createElement("h3", { className: 'gs-section-header' },
                React.createElement("i", { className: (0, browser_3.codicon)('question') }),
                nls_1.nls.localizeByDefault('Help')),
            React.createElement("div", { className: 'gs-action-container' },
                React.createElement("a", { role: 'button', tabIndex: 0, onClick: () => this.doOpenExternalLink(this.documentationUrl), onKeyDown: (e) => this.doOpenExternalLinkEnter(e, this.documentationUrl) }, nls_1.nls.localizeByDefault('Documentation'))),
            React.createElement("div", { className: 'gs-action-container' },
                React.createElement("a", { role: 'button', tabIndex: 0, onClick: () => this.doOpenExternalLink(this.compatibilityUrl), onKeyDown: (e) => this.doOpenExternalLinkEnter(e, this.compatibilityUrl) }, nls_1.nls.localize('theia/getting-started/apiComparator', '{0} API Compatibility', 'VS Code'))),
            React.createElement("div", { className: 'gs-action-container' },
                React.createElement("a", { role: 'button', tabIndex: 0, onClick: () => this.doOpenExternalLink(this.extensionUrl), onKeyDown: (e) => this.doOpenExternalLinkEnter(e, this.extensionUrl) }, nls_1.nls.localize('theia/getting-started/newExtension', 'Building a New Extension'))),
            React.createElement("div", { className: 'gs-action-container' },
                React.createElement("a", { role: 'button', tabIndex: 0, onClick: () => this.doOpenExternalLink(this.pluginUrl), onKeyDown: (e) => this.doOpenExternalLinkEnter(e, this.pluginUrl) }, nls_1.nls.localize('theia/getting-started/newPlugin', 'Building a New Plugin'))));
    }
    /**
     * Render the version section.
     */
    renderVersion() {
        return React.createElement("div", { className: 'gs-section' },
            React.createElement("div", { className: 'gs-action-container' },
                React.createElement("p", { className: 'gs-sub-header' }, this.applicationInfo ? nls_1.nls.localizeByDefault('Version: {0}', this.applicationInfo.version) : '')));
    }
    renderPreferences() {
        return React.createElement(WelcomePreferences, { preferenceService: this.preferenceService });
    }
    /**
     * Build the list of workspace paths.
     * @param workspaces {string[]} the list of workspaces.
     * @returns {string[]} the list of workspace paths.
     */
    buildPaths(workspaces) {
        const paths = [];
        workspaces.forEach(workspace => {
            const uri = new uri_1.default(workspace);
            const pathLabel = this.labelProvider.getLongName(uri);
            const path = this.home ? common_1.Path.tildify(pathLabel, this.home) : pathLabel;
            paths.push(path);
        });
        return paths;
    }
    isEnterKey(e) {
        var _a;
        return browser_3.Key.ENTER.keyCode === ((_a = browser_3.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode);
    }
};
/**
 * The widget `id`.
 */
GettingStartedWidget.ID = 'getting.started.widget';
/**
 * The widget `label` which is used for display purposes.
 */
GettingStartedWidget.LABEL = nls_1.nls.localizeByDefault('Welcome');
__decorate([
    (0, inversify_1.inject)(application_protocol_1.ApplicationServer),
    __metadata("design:type", Object)
], GettingStartedWidget.prototype, "appServer", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], GettingStartedWidget.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], GettingStartedWidget.prototype, "environments", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.LabelProvider),
    __metadata("design:type", browser_3.LabelProvider)
], GettingStartedWidget.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], GettingStartedWidget.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], GettingStartedWidget.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.PreferenceService),
    __metadata("design:type", Object)
], GettingStartedWidget.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GettingStartedWidget.prototype, "init", null);
GettingStartedWidget = GettingStartedWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], GettingStartedWidget);
exports.GettingStartedWidget = GettingStartedWidget;
function WelcomePreferences(props) {
    const [startupEditor, setStartupEditor] = React.useState(props.preferenceService.get('workbench.startupEditor', 'welcomePage'));
    React.useEffect(() => {
        const prefListener = props.preferenceService.onPreferenceChanged(change => {
            if (change.preferenceName === 'workbench.startupEditor') {
                const prefValue = change.newValue;
                setStartupEditor(prefValue);
            }
        });
        return () => prefListener.dispose();
    }, [props.preferenceService]);
    const handleChange = (e) => {
        const newValue = e.target.checked ? 'welcomePage' : 'none';
        props.preferenceService.updateValue('workbench.startupEditor', newValue);
    };
    return (React.createElement("div", { className: 'gs-preference' },
        React.createElement("input", { type: "checkbox", className: "theia-input", id: "startupEditor", onChange: handleChange, checked: startupEditor === 'welcomePage' || startupEditor === 'welcomePageInEmptyWorkbench' }),
        React.createElement("label", { htmlFor: "startupEditor" }, nls_1.nls.localizeByDefault('Show welcome page on startup'))));
}
//# sourceMappingURL=getting-started-widget.js.map