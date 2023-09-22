(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_filesystem_lib_browser_index_js-packages_toolbar_lib_browser_toolbar-frontend-module-09d901"],{

/***/ "../../packages/core/shared/ajv/index.js":
/*!***********************************************!*\
  !*** ../../packages/core/shared/ajv/index.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ajv */ "../../node_modules/ajv/lib/ajv.js");
;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/ajv'] = this;


/***/ }),

/***/ "../../packages/core/shared/lodash.debounce/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/shared/lodash.debounce/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! lodash.debounce */ "../../node_modules/lodash.debounce/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/lodash.debounce'] = this;


/***/ }),

/***/ "../../packages/core/shared/react-dom/client/index.js":
/*!************************************************************!*\
  !*** ../../packages/core/shared/react-dom/client/index.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react-dom/client */ "../../node_modules/react-dom/client.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react-dom/client'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/index.js":
/*!******************************************************!*\
  !*** ../../packages/filesystem/lib/browser/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./location */ "../../packages/filesystem/lib/browser/location/index.js"), exports);
__exportStar(__webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js"), exports);
__exportStar(__webpack_require__(/*! ./file-dialog */ "../../packages/filesystem/lib/browser/file-dialog/index.js"), exports);
__exportStar(__webpack_require__(/*! ./filesystem-preferences */ "../../packages/filesystem/lib/browser/filesystem-preferences.js"), exports);
__exportStar(__webpack_require__(/*! ./file-resource */ "../../packages/filesystem/lib/browser/file-resource.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/application-shell-with-toolbar-override.js":
/*!*************************************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/application-shell-with-toolbar-override.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindToolbarApplicationShell = exports.ApplicationShellWithToolbarOverride = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const theia_dock_panel_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/theia-dock-panel */ "../../packages/core/lib/browser/shell/theia-dock-panel.js");
const toolbar_interfaces_1 = __webpack_require__(/*! ./toolbar-interfaces */ "../../packages/toolbar/lib/browser/toolbar-interfaces.js");
const toolbar_preference_contribution_1 = __webpack_require__(/*! ./toolbar-preference-contribution */ "../../packages/toolbar/lib/browser/toolbar-preference-contribution.js");
let ApplicationShellWithToolbarOverride = class ApplicationShellWithToolbarOverride extends browser_1.ApplicationShell {
    init() {
        this.doInit();
    }
    async doInit() {
        this.toolbar = this.toolbarFactory();
        this.toolbar.id = 'main-toolbar';
        super.init();
        await this.toolbarPreferences.ready;
        this.tryShowToolbar();
        this.mainPanel.onDidToggleMaximized(() => {
            this.tryShowToolbar();
        });
        this.bottomPanel.onDidToggleMaximized(() => {
            this.tryShowToolbar();
        });
        this.preferenceService.onPreferenceChanged(event => {
            if (event.preferenceName === toolbar_preference_contribution_1.TOOLBAR_ENABLE_PREFERENCE_ID) {
                this.tryShowToolbar();
            }
        });
    }
    tryShowToolbar() {
        const doShowToolbarFromPreference = this.toolbarPreferences[toolbar_preference_contribution_1.TOOLBAR_ENABLE_PREFERENCE_ID];
        const isShellMaximized = this.mainPanel.hasClass(theia_dock_panel_1.MAXIMIZED_CLASS) || this.bottomPanel.hasClass(theia_dock_panel_1.MAXIMIZED_CLASS);
        if (doShowToolbarFromPreference && !isShellMaximized) {
            this.toolbar.show();
            return true;
        }
        this.toolbar.hide();
        return false;
    }
    createLayout() {
        const bottomSplitLayout = this.createSplitLayout([this.mainPanel, this.bottomPanel], [1, 0], { orientation: 'vertical', spacing: 0 });
        const panelForBottomArea = new browser_1.SplitPanel({ layout: bottomSplitLayout });
        panelForBottomArea.id = 'theia-bottom-split-panel';
        const leftRightSplitLayout = this.createSplitLayout([this.leftPanelHandler.container, panelForBottomArea, this.rightPanelHandler.container], [0, 1, 0], { orientation: 'horizontal', spacing: 0 });
        const panelForSideAreas = new browser_1.SplitPanel({ layout: leftRightSplitLayout });
        panelForSideAreas.id = 'theia-left-right-split-panel';
        return this.createBoxLayout([this.topPanel, this.toolbar, panelForSideAreas, this.statusBar], [0, 0, 1, 0], { direction: 'top-to-bottom', spacing: 0 });
    }
};
__decorate([
    (0, inversify_1.inject)(toolbar_preference_contribution_1.ToolbarPreferences),
    __metadata("design:type", Object)
], ApplicationShellWithToolbarOverride.prototype, "toolbarPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], ApplicationShellWithToolbarOverride.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_interfaces_1.ToolbarFactory),
    __metadata("design:type", Function)
], ApplicationShellWithToolbarOverride.prototype, "toolbarFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApplicationShellWithToolbarOverride.prototype, "init", null);
ApplicationShellWithToolbarOverride = __decorate([
    (0, inversify_1.injectable)()
], ApplicationShellWithToolbarOverride);
exports.ApplicationShellWithToolbarOverride = ApplicationShellWithToolbarOverride;
const bindToolbarApplicationShell = (bind, rebind, unbind) => {
    bind(ApplicationShellWithToolbarOverride).toSelf().inSingletonScope();
    rebind(browser_1.ApplicationShell).toService(ApplicationShellWithToolbarOverride);
};
exports.bindToolbarApplicationShell = bindToolbarApplicationShell;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/application-shell-with-toolbar-override'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/codicons.js":
/*!******************************************************!*\
  !*** ../../packages/toolbar/lib/browser/codicons.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.codicons = void 0;
/* eslint-disable @typescript-eslint/quotes, max-len */
exports.codicons = ["codicon-add", "codicon-plus", "codicon-gist-new", "codicon-repo-create", "codicon-lightbulb", "codicon-light-bulb", "codicon-repo", "codicon-repo-delete", "codicon-gist-fork", "codicon-repo-forked", "codicon-git-pull-request", "codicon-git-pull-request-abandoned", "codicon-record-keys", "codicon-keyboard", "codicon-tag", "codicon-tag-add", "codicon-tag-remove", "codicon-person", "codicon-person-follow", "codicon-person-outline", "codicon-person-filled", "codicon-git-branch", "codicon-git-branch-create", "codicon-git-branch-delete", "codicon-source-control", "codicon-mirror", "codicon-mirror-public", "codicon-star", "codicon-star-add", "codicon-star-delete", "codicon-star-empty", "codicon-comment", "codicon-comment-add", "codicon-alert", "codicon-warning", "codicon-search", "codicon-search-save", "codicon-log-out", "codicon-sign-out", "codicon-log-in", "codicon-sign-in", "codicon-eye", "codicon-eye-unwatch", "codicon-eye-watch", "codicon-circle-filled", "codicon-primitive-dot", "codicon-close-dirty", "codicon-debug-breakpoint", "codicon-debug-breakpoint-disabled", "codicon-debug-hint", "codicon-primitive-square", "codicon-edit", "codicon-pencil", "codicon-info", "codicon-issue-opened", "codicon-gist-private", "codicon-git-fork-private", "codicon-lock", "codicon-mirror-private", "codicon-close", "codicon-remove-close", "codicon-x", "codicon-repo-sync", "codicon-sync", "codicon-clone", "codicon-desktop-download", "codicon-beaker", "codicon-microscope", "codicon-vm", "codicon-device-desktop", "codicon-file", "codicon-file-text", "codicon-more", "codicon-ellipsis", "codicon-kebab-horizontal", "codicon-mail-reply", "codicon-reply", "codicon-organization", "codicon-organization-filled", "codicon-organization-outline", "codicon-new-file", "codicon-file-add", "codicon-new-folder", "codicon-file-directory-create", "codicon-trash", "codicon-trashcan", "codicon-history", "codicon-clock", "codicon-folder", "codicon-file-directory", "codicon-symbol-folder", "codicon-logo-github", "codicon-mark-github", "codicon-github", "codicon-terminal", "codicon-console", "codicon-repl", "codicon-zap", "codicon-symbol-event", "codicon-error", "codicon-stop", "codicon-variable", "codicon-symbol-variable", "codicon-array", "codicon-symbol-array", "codicon-symbol-module", "codicon-symbol-package", "codicon-symbol-namespace", "codicon-symbol-object", "codicon-symbol-method", "codicon-symbol-function", "codicon-symbol-constructor", "codicon-symbol-boolean", "codicon-symbol-null", "codicon-symbol-numeric", "codicon-symbol-number", "codicon-symbol-structure", "codicon-symbol-struct", "codicon-symbol-parameter", "codicon-symbol-type-parameter", "codicon-symbol-key", "codicon-symbol-text", "codicon-symbol-reference", "codicon-go-to-file", "codicon-symbol-enum", "codicon-symbol-value", "codicon-symbol-ruler", "codicon-symbol-unit", "codicon-activate-breakpoints", "codicon-archive", "codicon-arrow-both", "codicon-arrow-down", "codicon-arrow-left", "codicon-arrow-right", "codicon-arrow-small-down", "codicon-arrow-small-left", "codicon-arrow-small-right", "codicon-arrow-small-up", "codicon-arrow-up", "codicon-bell", "codicon-bold", "codicon-book", "codicon-bookmark", "codicon-debug-breakpoint-conditional-unverified", "codicon-debug-breakpoint-conditional", "codicon-debug-breakpoint-conditional-disabled", "codicon-debug-breakpoint-data-unverified", "codicon-debug-breakpoint-data", "codicon-debug-breakpoint-data-disabled", "codicon-debug-breakpoint-log-unverified", "codicon-debug-breakpoint-log", "codicon-debug-breakpoint-log-disabled", "codicon-briefcase", "codicon-broadcast", "codicon-browser", "codicon-bug", "codicon-calendar", "codicon-case-sensitive", "codicon-check", "codicon-checklist", "codicon-chevron-down", "codicon-chevron-left", "codicon-chevron-right", "codicon-chevron-up", "codicon-chrome-close", "codicon-chrome-maximize", "codicon-chrome-minimize", "codicon-chrome-restore", "codicon-circle-outline", "codicon-debug-breakpoint-unverified", "codicon-circle-slash", "codicon-circuit-board", "codicon-clear-all", "codicon-clippy", "codicon-close-all", "codicon-cloud-download", "codicon-cloud-upload", "codicon-code", "codicon-collapse-all", "codicon-color-mode", "codicon-comment-discussion", "codicon-credit-card", "codicon-dash", "codicon-dashboard", "codicon-database", "codicon-debug-continue", "codicon-debug-disconnect", "codicon-debug-pause", "codicon-debug-restart", "codicon-debug-start", "codicon-debug-step-into", "codicon-debug-step-out", "codicon-debug-step-over", "codicon-debug-stop", "codicon-debug", "codicon-device-camera-video", "codicon-device-camera", "codicon-device-mobile", "codicon-diff-added", "codicon-diff-ignored", "codicon-diff-modified", "codicon-diff-removed", "codicon-diff-renamed", "codicon-diff", "codicon-discard", "codicon-editor-layout", "codicon-empty-window", "codicon-exclude", "codicon-extensions", "codicon-eye-closed", "codicon-file-binary", "codicon-file-code", "codicon-file-media", "codicon-file-pdf", "codicon-file-submodule", "codicon-file-symlink-directory", "codicon-file-symlink-file", "codicon-file-zip", "codicon-files", "codicon-filter", "codicon-flame", "codicon-fold-down", "codicon-fold-up", "codicon-fold", "codicon-folder-active", "codicon-folder-opened", "codicon-gear", "codicon-gift", "codicon-gist-secret", "codicon-gist", "codicon-git-commit", "codicon-git-compare", "codicon-compare-changes", "codicon-git-merge", "codicon-github-action", "codicon-github-alt", "codicon-globe", "codicon-grabber", "codicon-graph", "codicon-gripper", "codicon-heart", "codicon-home", "codicon-horizontal-rule", "codicon-hubot", "codicon-inbox", "codicon-issue-reopened", "codicon-issues", "codicon-italic", "codicon-jersey", "codicon-json", "codicon-kebab-vertical", "codicon-key", "codicon-law", "codicon-lightbulb-autofix", "codicon-link-external", "codicon-link", "codicon-list-ordered", "codicon-list-unordered", "codicon-live-share", "codicon-loading", "codicon-location", "codicon-mail-read", "codicon-mail", "codicon-markdown", "codicon-megaphone", "codicon-mention", "codicon-milestone", "codicon-mortar-board", "codicon-move", "codicon-multiple-windows", "codicon-mute", "codicon-no-newline", "codicon-note", "codicon-octoface", "codicon-open-preview", "codicon-package", "codicon-paintcan", "codicon-pin", "codicon-play", "codicon-run", "codicon-plug", "codicon-preserve-case", "codicon-preview", "codicon-project", "codicon-pulse", "codicon-question", "codicon-quote", "codicon-radio-tower", "codicon-reactions", "codicon-references", "codicon-refresh", "codicon-regex", "codicon-remote-explorer", "codicon-remote", "codicon-remove", "codicon-replace-all", "codicon-replace", "codicon-repo-clone", "codicon-repo-force-push", "codicon-repo-pull", "codicon-repo-push", "codicon-report", "codicon-request-changes", "codicon-rocket", "codicon-root-folder-opened", "codicon-root-folder", "codicon-rss", "codicon-ruby", "codicon-save-all", "codicon-save-as", "codicon-save", "codicon-screen-full", "codicon-screen-normal", "codicon-search-stop", "codicon-server", "codicon-settings-gear", "codicon-settings", "codicon-shield", "codicon-smiley", "codicon-sort-precedence", "codicon-split-horizontal", "codicon-split-vertical", "codicon-squirrel", "codicon-star-full", "codicon-star-half", "codicon-symbol-class", "codicon-symbol-color", "codicon-symbol-constant", "codicon-symbol-enum-member", "codicon-symbol-field", "codicon-symbol-file", "codicon-symbol-interface", "codicon-symbol-keyword", "codicon-symbol-misc", "codicon-symbol-operator", "codicon-symbol-property", "codicon-wrench", "codicon-wrench-subaction", "codicon-symbol-snippet", "codicon-tasklist", "codicon-telescope", "codicon-text-size", "codicon-three-bars", "codicon-thumbsdown", "codicon-thumbsup", "codicon-tools", "codicon-triangle-down", "codicon-triangle-left", "codicon-triangle-right", "codicon-triangle-up", "codicon-twitter", "codicon-unfold", "codicon-unlock", "codicon-unmute", "codicon-unverified", "codicon-verified", "codicon-versions", "codicon-vm-active", "codicon-vm-outline", "codicon-vm-running", "codicon-watch", "codicon-whitespace", "codicon-whole-word", "codicon-window", "codicon-word-wrap", "codicon-zoom-in", "codicon-zoom-out", "codicon-list-filter", "codicon-list-flat", "codicon-list-selection", "codicon-selection", "codicon-list-tree", "codicon-debug-breakpoint-function-unverified", "codicon-debug-breakpoint-function", "codicon-debug-breakpoint-function-disabled", "codicon-debug-stackframe-active", "codicon-debug-stackframe-dot", "codicon-debug-stackframe", "codicon-debug-stackframe-focused", "codicon-debug-breakpoint-unsupported", "codicon-symbol-string", "codicon-debug-reverse-continue", "codicon-debug-step-back", "codicon-debug-restart-frame", "codicon-debug-alt", "codicon-call-incoming", "codicon-call-outgoing", "codicon-menu", "codicon-expand-all", "codicon-feedback", "codicon-group-by-ref-type", "codicon-ungroup-by-ref-type", "codicon-account", "codicon-bell-dot", "codicon-debug-console", "codicon-library", "codicon-output", "codicon-run-all", "codicon-sync-ignored", "codicon-pinned", "codicon-github-inverted", "codicon-server-process", "codicon-server-environment", "codicon-pass", "codicon-issue-closed", "codicon-stop-circle", "codicon-play-circle", "codicon-record", "codicon-debug-alt-small", "codicon-vm-connect", "codicon-cloud", "codicon-merge", "codicon-export", "codicon-graph-left", "codicon-magnet", "codicon-notebook", "codicon-redo", "codicon-check-all", "codicon-pinned-dirty", "codicon-pass-filled", "codicon-circle-large-filled", "codicon-circle-large-outline", "codicon-combine", "codicon-gather", "codicon-table", "codicon-variable-group", "codicon-type-hierarchy", "codicon-type-hierarchy-sub", "codicon-type-hierarchy-super", "codicon-git-pull-request-create", "codicon-run-above", "codicon-run-below", "codicon-notebook-template", "codicon-debug-rerun", "codicon-workspace-trusted", "codicon-workspace-untrusted", "codicon-workspace-unknown", "codicon-terminal-cmd", "codicon-terminal-debian", "codicon-terminal-linux", "codicon-terminal-powershell", "codicon-terminal-tmux", "codicon-terminal-ubuntu", "codicon-terminal-bash", "codicon-arrow-swap", "codicon-copy", "codicon-person-add", "codicon-filter-filled", "codicon-wand", "codicon-debug-line-by-line", "codicon-inspect", "codicon-layers", "codicon-layers-dot", "codicon-layers-active", "codicon-compass", "codicon-compass-dot", "codicon-compass-active", "codicon-azure", "codicon-issue-draft", "codicon-git-pull-request-closed", "codicon-git-pull-request-draft", "codicon-debug-all", "codicon-debug-coverage"];

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/codicons'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/font-awesome-icons.js":
/*!****************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/font-awesome-icons.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fontAwesomeIcons = void 0;
/* eslint-disable @typescript-eslint/quotes, max-len */
exports.fontAwesomeIcons = ["fa-glass", "fa-music", "fa-search", "fa-envelope-o", "fa-heart", "fa-star", "fa-star-o", "fa-user", "fa-film", "fa-th-large", "fa-th", "fa-th-list", "fa-check", "fa-remove", "fa-close", "fa-times", "fa-search-plus", "fa-search-minus", "fa-power-off", "fa-signal", "fa-gear", "fa-cog", "fa-trash-o", "fa-home", "fa-file-o", "fa-clock-o", "fa-road", "fa-download", "fa-arrow-circle-o-down", "fa-arrow-circle-o-up", "fa-inbox", "fa-play-circle-o", "fa-rotate-right", "fa-repeat", "fa-refresh", "fa-list-alt", "fa-lock", "fa-flag", "fa-headphones", "fa-volume-off", "fa-volume-down", "fa-volume-up", "fa-qrcode", "fa-barcode", "fa-tag", "fa-tags", "fa-book", "fa-bookmark", "fa-print", "fa-camera", "fa-font", "fa-bold", "fa-italic", "fa-text-height", "fa-text-width", "fa-align-left", "fa-align-center", "fa-align-right", "fa-align-justify", "fa-list", "fa-dedent", "fa-outdent", "fa-indent", "fa-video-camera", "fa-photo", "fa-image", "fa-picture-o", "fa-pencil", "fa-map-marker", "fa-adjust", "fa-tint", "fa-edit", "fa-pencil-square-o", "fa-share-square-o", "fa-check-square-o", "fa-arrows", "fa-step-backward", "fa-fast-backward", "fa-backward", "fa-play", "fa-pause", "fa-stop", "fa-forward", "fa-fast-forward", "fa-step-forward", "fa-eject", "fa-chevron-left", "fa-chevron-right", "fa-plus-circle", "fa-minus-circle", "fa-times-circle", "fa-check-circle", "fa-question-circle", "fa-info-circle", "fa-crosshairs", "fa-times-circle-o", "fa-check-circle-o", "fa-ban", "fa-arrow-left", "fa-arrow-right", "fa-arrow-up", "fa-arrow-down", "fa-mail-forward", "fa-share", "fa-expand", "fa-compress", "fa-plus", "fa-minus", "fa-asterisk", "fa-exclamation-circle", "fa-gift", "fa-leaf", "fa-fire", "fa-eye", "fa-eye-slash", "fa-warning", "fa-exclamation-triangle", "fa-plane", "fa-calendar", "fa-random", "fa-comment", "fa-magnet", "fa-chevron-up", "fa-chevron-down", "fa-retweet", "fa-shopping-cart", "fa-folder", "fa-folder-open", "fa-arrows-v", "fa-arrows-h", "fa-bar-chart-o", "fa-bar-chart", "fa-twitter-square", "fa-facebook-square", "fa-camera-retro", "fa-key", "fa-gears", "fa-cogs", "fa-comments", "fa-thumbs-o-up", "fa-thumbs-o-down", "fa-star-half", "fa-heart-o", "fa-sign-out", "fa-linkedin-square", "fa-thumb-tack", "fa-external-link", "fa-sign-in", "fa-trophy", "fa-github-square", "fa-upload", "fa-lemon-o", "fa-phone", "fa-square-o", "fa-bookmark-o", "fa-phone-square", "fa-twitter", "fa-facebook-f", "fa-facebook", "fa-github", "fa-unlock", "fa-credit-card", "fa-feed", "fa-rss", "fa-hdd-o", "fa-bullhorn", "fa-bell", "fa-certificate", "fa-hand-o-right", "fa-hand-o-left", "fa-hand-o-up", "fa-hand-o-down", "fa-arrow-circle-left", "fa-arrow-circle-right", "fa-arrow-circle-up", "fa-arrow-circle-down", "fa-globe", "fa-wrench", "fa-tasks", "fa-filter", "fa-briefcase", "fa-arrows-alt", "fa-group", "fa-users", "fa-chain", "fa-link", "fa-cloud", "fa-flask", "fa-cut", "fa-scissors", "fa-copy", "fa-files-o", "fa-paperclip", "fa-save", "fa-floppy-o", "fa-square", "fa-navicon", "fa-reorder", "fa-bars", "fa-list-ul", "fa-list-ol", "fa-strikethrough", "fa-underline", "fa-table", "fa-magic", "fa-truck", "fa-pinterest", "fa-pinterest-square", "fa-google-plus-square", "fa-google-plus", "fa-money", "fa-caret-down", "fa-caret-up", "fa-caret-left", "fa-caret-right", "fa-columns", "fa-unsorted", "fa-sort", "fa-sort-down", "fa-sort-desc", "fa-sort-up", "fa-sort-asc", "fa-envelope", "fa-linkedin", "fa-rotate-left", "fa-undo", "fa-legal", "fa-gavel", "fa-dashboard", "fa-tachometer", "fa-comment-o", "fa-comments-o", "fa-flash", "fa-bolt", "fa-sitemap", "fa-umbrella", "fa-paste", "fa-clipboard", "fa-lightbulb-o", "fa-exchange", "fa-cloud-download", "fa-cloud-upload", "fa-user-md", "fa-stethoscope", "fa-suitcase", "fa-bell-o", "fa-coffee", "fa-cutlery", "fa-file-text-o", "fa-building-o", "fa-hospital-o", "fa-ambulance", "fa-medkit", "fa-fighter-jet", "fa-beer", "fa-h-square", "fa-plus-square", "fa-angle-double-left", "fa-angle-double-right", "fa-angle-double-up", "fa-angle-double-down", "fa-angle-left", "fa-angle-right", "fa-angle-up", "fa-angle-down", "fa-desktop", "fa-laptop", "fa-tablet", "fa-mobile-phone", "fa-mobile", "fa-circle-o", "fa-quote-left", "fa-quote-right", "fa-spinner", "fa-circle", "fa-mail-reply", "fa-reply", "fa-github-alt", "fa-folder-o", "fa-folder-open-o", "fa-smile-o", "fa-frown-o", "fa-meh-o", "fa-gamepad", "fa-keyboard-o", "fa-flag-o", "fa-flag-checkered", "fa-terminal", "fa-code", "fa-mail-reply-all", "fa-reply-all", "fa-star-half-empty", "fa-star-half-full", "fa-star-half-o", "fa-location-arrow", "fa-crop", "fa-code-fork", "fa-unlink", "fa-chain-broken", "fa-question", "fa-info", "fa-exclamation", "fa-superscript", "fa-subscript", "fa-eraser", "fa-puzzle-piece", "fa-microphone", "fa-microphone-slash", "fa-shield", "fa-calendar-o", "fa-fire-extinguisher", "fa-rocket", "fa-maxcdn", "fa-chevron-circle-left", "fa-chevron-circle-right", "fa-chevron-circle-up", "fa-chevron-circle-down", "fa-html5", "fa-css3", "fa-anchor", "fa-unlock-alt", "fa-bullseye", "fa-ellipsis-h", "fa-ellipsis-v", "fa-rss-square", "fa-play-circle", "fa-ticket", "fa-minus-square", "fa-minus-square-o", "fa-level-up", "fa-level-down", "fa-check-square", "fa-pencil-square", "fa-external-link-square", "fa-share-square", "fa-compass", "fa-toggle-down", "fa-caret-square-o-down", "fa-toggle-up", "fa-caret-square-o-up", "fa-toggle-right", "fa-caret-square-o-right", "fa-euro", "fa-eur", "fa-gbp", "fa-dollar", "fa-usd", "fa-rupee", "fa-inr", "fa-cny", "fa-rmb", "fa-yen", "fa-jpy", "fa-ruble", "fa-rouble", "fa-rub", "fa-won", "fa-krw", "fa-bitcoin", "fa-btc", "fa-file", "fa-file-text", "fa-sort-alpha-asc", "fa-sort-alpha-desc", "fa-sort-amount-asc", "fa-sort-amount-desc", "fa-sort-numeric-asc", "fa-sort-numeric-desc", "fa-thumbs-up", "fa-thumbs-down", "fa-youtube-square", "fa-youtube", "fa-xing", "fa-xing-square", "fa-youtube-play", "fa-dropbox", "fa-stack-overflow", "fa-instagram", "fa-flickr", "fa-adn", "fa-bitbucket", "fa-bitbucket-square", "fa-tumblr", "fa-tumblr-square", "fa-long-arrow-down", "fa-long-arrow-up", "fa-long-arrow-left", "fa-long-arrow-right", "fa-apple", "fa-windows", "fa-android", "fa-linux", "fa-dribbble", "fa-skype", "fa-foursquare", "fa-trello", "fa-female", "fa-male", "fa-gittip", "fa-gratipay", "fa-sun-o", "fa-moon-o", "fa-archive", "fa-bug", "fa-vk", "fa-weibo", "fa-renren", "fa-pagelines", "fa-stack-exchange", "fa-arrow-circle-o-right", "fa-arrow-circle-o-left", "fa-toggle-left", "fa-caret-square-o-left", "fa-dot-circle-o", "fa-wheelchair", "fa-vimeo-square", "fa-turkish-lira", "fa-try", "fa-plus-square-o", "fa-space-shuttle", "fa-slack", "fa-envelope-square", "fa-wordpress", "fa-openid", "fa-institution", "fa-bank", "fa-university", "fa-mortar-board", "fa-graduation-cap", "fa-yahoo", "fa-google", "fa-reddit", "fa-reddit-square", "fa-stumbleupon-circle", "fa-stumbleupon", "fa-delicious", "fa-digg", "fa-pied-piper-pp", "fa-pied-piper-alt", "fa-drupal", "fa-joomla", "fa-language", "fa-fax", "fa-building", "fa-child", "fa-paw", "fa-spoon", "fa-cube", "fa-cubes", "fa-behance", "fa-behance-square", "fa-steam", "fa-steam-square", "fa-recycle", "fa-automobile", "fa-car", "fa-cab", "fa-taxi", "fa-tree", "fa-spotify", "fa-deviantart", "fa-soundcloud", "fa-database", "fa-file-pdf-o", "fa-file-word-o", "fa-file-excel-o", "fa-file-powerpoint-o", "fa-file-photo-o", "fa-file-picture-o", "fa-file-image-o", "fa-file-zip-o", "fa-file-archive-o", "fa-file-sound-o", "fa-file-audio-o", "fa-file-movie-o", "fa-file-video-o", "fa-file-code-o", "fa-vine", "fa-codepen", "fa-jsfiddle", "fa-life-bouy", "fa-life-buoy", "fa-life-saver", "fa-support", "fa-life-ring", "fa-circle-o-notch", "fa-ra", "fa-resistance", "fa-rebel", "fa-ge", "fa-empire", "fa-git-square", "fa-git", "fa-y-combinator-square", "fa-yc-square", "fa-hacker-news", "fa-tencent-weibo", "fa-qq", "fa-wechat", "fa-weixin", "fa-send", "fa-paper-plane", "fa-send-o", "fa-paper-plane-o", "fa-history", "fa-circle-thin", "fa-header", "fa-paragraph", "fa-sliders", "fa-share-alt", "fa-share-alt-square", "fa-bomb", "fa-soccer-ball-o", "fa-futbol-o", "fa-tty", "fa-binoculars", "fa-plug", "fa-slideshare", "fa-twitch", "fa-yelp", "fa-newspaper-o", "fa-wifi", "fa-calculator", "fa-paypal", "fa-google-wallet", "fa-cc-visa", "fa-cc-mastercard", "fa-cc-discover", "fa-cc-amex", "fa-cc-paypal", "fa-cc-stripe", "fa-bell-slash", "fa-bell-slash-o", "fa-trash", "fa-copyright", "fa-at", "fa-eyedropper", "fa-paint-brush", "fa-birthday-cake", "fa-area-chart", "fa-pie-chart", "fa-line-chart", "fa-lastfm", "fa-lastfm-square", "fa-toggle-off", "fa-toggle-on", "fa-bicycle", "fa-bus", "fa-ioxhost", "fa-angellist", "fa-cc", "fa-shekel", "fa-sheqel", "fa-ils", "fa-meanpath", "fa-buysellads", "fa-connectdevelop", "fa-dashcube", "fa-forumbee", "fa-leanpub", "fa-sellsy", "fa-shirtsinbulk", "fa-simplybuilt", "fa-skyatlas", "fa-cart-plus", "fa-cart-arrow-down", "fa-diamond", "fa-ship", "fa-user-secret", "fa-motorcycle", "fa-street-view", "fa-heartbeat", "fa-venus", "fa-mars", "fa-mercury", "fa-intersex", "fa-transgender", "fa-transgender-alt", "fa-venus-double", "fa-mars-double", "fa-venus-mars", "fa-mars-stroke", "fa-mars-stroke-v", "fa-mars-stroke-h", "fa-neuter", "fa-genderless", "fa-facebook-official", "fa-pinterest-p", "fa-whatsapp", "fa-server", "fa-user-plus", "fa-user-times", "fa-hotel", "fa-bed", "fa-viacoin", "fa-train", "fa-subway", "fa-medium", "fa-yc", "fa-y-combinator", "fa-optin-monster", "fa-opencart", "fa-expeditedssl", "fa-battery-4", "fa-battery", "fa-battery-full", "fa-battery-3", "fa-battery-three-quarters", "fa-battery-2", "fa-battery-half", "fa-battery-1", "fa-battery-quarter", "fa-battery-0", "fa-battery-empty", "fa-mouse-pointer", "fa-i-cursor", "fa-object-group", "fa-object-ungroup", "fa-sticky-note", "fa-sticky-note-o", "fa-cc-jcb", "fa-cc-diners-club", "fa-clone", "fa-balance-scale", "fa-hourglass-o", "fa-hourglass-1", "fa-hourglass-start", "fa-hourglass-2", "fa-hourglass-half", "fa-hourglass-3", "fa-hourglass-end", "fa-hourglass", "fa-hand-grab-o", "fa-hand-rock-o", "fa-hand-stop-o", "fa-hand-paper-o", "fa-hand-scissors-o", "fa-hand-lizard-o", "fa-hand-spock-o", "fa-hand-pointer-o", "fa-hand-peace-o", "fa-trademark", "fa-registered", "fa-creative-commons", "fa-gg", "fa-gg-circle", "fa-tripadvisor", "fa-odnoklassniki", "fa-odnoklassniki-square", "fa-get-pocket", "fa-wikipedia-w", "fa-safari", "fa-chrome", "fa-firefox", "fa-opera", "fa-internet-explorer", "fa-tv", "fa-television", "fa-contao", "fa-500px", "fa-amazon", "fa-calendar-plus-o", "fa-calendar-minus-o", "fa-calendar-times-o", "fa-calendar-check-o", "fa-industry", "fa-map-pin", "fa-map-signs", "fa-map-o", "fa-map", "fa-commenting", "fa-commenting-o", "fa-houzz", "fa-vimeo", "fa-black-tie", "fa-fonticons", "fa-reddit-alien", "fa-edge", "fa-credit-card-alt", "fa-codiepie", "fa-modx", "fa-fort-awesome", "fa-usb", "fa-product-hunt", "fa-mixcloud", "fa-scribd", "fa-pause-circle", "fa-pause-circle-o", "fa-stop-circle", "fa-stop-circle-o", "fa-shopping-bag", "fa-shopping-basket", "fa-hashtag", "fa-bluetooth", "fa-bluetooth-b", "fa-percent", "fa-gitlab", "fa-wpbeginner", "fa-wpforms", "fa-envira", "fa-universal-access", "fa-wheelchair-alt", "fa-question-circle-o", "fa-blind", "fa-audio-description", "fa-volume-control-phone", "fa-braille", "fa-assistive-listening-systems", "fa-asl-interpreting", "fa-american-sign-language-interpreting", "fa-deafness", "fa-hard-of-hearing", "fa-deaf", "fa-glide", "fa-glide-g", "fa-signing", "fa-sign-language", "fa-low-vision", "fa-viadeo", "fa-viadeo-square", "fa-snapchat", "fa-snapchat-ghost", "fa-snapchat-square", "fa-pied-piper", "fa-first-order", "fa-yoast", "fa-themeisle", "fa-google-plus-circle", "fa-google-plus-official", "fa-fa", "fa-font-awesome", "fa-handshake-o", "fa-envelope-open", "fa-envelope-open-o", "fa-linode", "fa-address-book", "fa-address-book-o", "fa-vcard", "fa-address-card", "fa-vcard-o", "fa-address-card-o", "fa-user-circle", "fa-user-circle-o", "fa-user-o", "fa-id-badge", "fa-drivers-license", "fa-id-card", "fa-drivers-license-o", "fa-id-card-o", "fa-quora", "fa-free-code-camp", "fa-telegram", "fa-thermometer-4", "fa-thermometer", "fa-thermometer-full", "fa-thermometer-3", "fa-thermometer-three-quarters", "fa-thermometer-2", "fa-thermometer-half", "fa-thermometer-1", "fa-thermometer-quarter", "fa-thermometer-0", "fa-thermometer-empty", "fa-shower", "fa-bathtub", "fa-s15", "fa-bath", "fa-podcast", "fa-window-maximize", "fa-window-minimize", "fa-window-restore", "fa-times-rectangle", "fa-window-close", "fa-times-rectangle-o", "fa-window-close-o", "fa-bandcamp", "fa-grav", "fa-etsy", "fa-imdb", "fa-ravelry", "fa-eercast", "fa-microchip", "fa-snowflake-o", "fa-superpowers", "fa-wpexplorer", "fa-meetup"];

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/font-awesome-icons'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-command-contribution.js":
/*!**************************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-command-contribution.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindToolbar = exports.ToolbarCommandContribution = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const toolbar_1 = __webpack_require__(/*! ./toolbar */ "../../packages/toolbar/lib/browser/toolbar.js");
const toolbar_icon_selector_dialog_1 = __webpack_require__(/*! ./toolbar-icon-selector-dialog */ "../../packages/toolbar/lib/browser/toolbar-icon-selector-dialog.js");
const toolbar_interfaces_1 = __webpack_require__(/*! ./toolbar-interfaces */ "../../packages/toolbar/lib/browser/toolbar-interfaces.js");
const toolbar_command_quick_input_service_1 = __webpack_require__(/*! ./toolbar-command-quick-input-service */ "../../packages/toolbar/lib/browser/toolbar-command-quick-input-service.js");
const toolbar_storage_provider_1 = __webpack_require__(/*! ./toolbar-storage-provider */ "../../packages/toolbar/lib/browser/toolbar-storage-provider.js");
const toolbar_controller_1 = __webpack_require__(/*! ./toolbar-controller */ "../../packages/toolbar/lib/browser/toolbar-controller.js");
const toolbar_preference_contribution_1 = __webpack_require__(/*! ./toolbar-preference-contribution */ "../../packages/toolbar/lib/browser/toolbar-preference-contribution.js");
const toolbar_defaults_1 = __webpack_require__(/*! ./toolbar-defaults */ "../../packages/toolbar/lib/browser/toolbar-defaults.js");
const toolbar_constants_1 = __webpack_require__(/*! ./toolbar-constants */ "../../packages/toolbar/lib/browser/toolbar-constants.js");
const json_schema_store_1 = __webpack_require__(/*! @theia/core/lib/browser/json-schema-store */ "../../packages/core/lib/browser/json-schema-store.js");
const toolbar_preference_schema_1 = __webpack_require__(/*! ./toolbar-preference-schema */ "../../packages/toolbar/lib/browser/toolbar-preference-schema.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
let ToolbarCommandContribution = class ToolbarCommandContribution {
    constructor() {
        this.schemaURI = new uri_1.default(toolbar_preference_schema_1.toolbarSchemaId);
    }
    registerSchemas(context) {
        this.inMemoryResources.add(this.schemaURI, JSON.stringify(toolbar_preference_schema_1.toolbarConfigurationSchema));
        context.registerSchema({
            fileMatch: ['toolbar.json'],
            url: this.schemaURI.toString(),
        });
    }
    registerCommands(registry) {
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.CUSTOMIZE_TOOLBAR, {
            execute: () => this.model.openOrCreateJSONFile(true),
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.RESET_TOOLBAR, {
            execute: () => this.model.clearAll(),
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.TOGGLE_TOOLBAR, {
            execute: () => {
                const isVisible = this.preferenceService.get(toolbar_preference_contribution_1.TOOLBAR_ENABLE_PREFERENCE_ID);
                this.preferenceService.set(toolbar_preference_contribution_1.TOOLBAR_ENABLE_PREFERENCE_ID, !isVisible, browser_1.PreferenceScope.User);
            },
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.REMOVE_COMMAND_FROM_TOOLBAR, {
            execute: async (_widget, position, id) => position && this.model.removeItem(position, id),
            isVisible: (...args) => this.isToolbarWidget(args[0]),
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.INSERT_GROUP_LEFT, {
            execute: async (_widget, position) => position && this.model.insertGroup(position, 'left'),
            isVisible: (widget, position) => {
                if (position) {
                    const { alignment, groupIndex, itemIndex } = position;
                    const owningGroupLength = this.toolbarModel.toolbarItems.items[alignment][groupIndex].length;
                    return this.isToolbarWidget(widget) && (owningGroupLength > 1) && (itemIndex > 0);
                }
                return false;
            },
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.INSERT_GROUP_RIGHT, {
            execute: async (_widget, position) => position && this.model.insertGroup(position, 'right'),
            isVisible: (widget, position) => {
                if (position) {
                    const { alignment, groupIndex, itemIndex } = position;
                    const owningGroupLength = this.toolbarModel.toolbarItems.items[alignment][groupIndex].length;
                    const isNotLastItem = itemIndex < (owningGroupLength - 1);
                    return this.isToolbarWidget(widget) && owningGroupLength > 1 && isNotLastItem;
                }
                return false;
            },
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.ADD_COMMAND_TO_TOOLBAR, {
            execute: () => this.toolbarCommandPickService.openIconDialog(),
        });
    }
    isToolbarWidget(arg) {
        return arg instanceof toolbar_1.ToolbarImpl;
    }
    registerKeybindings(keys) {
        keys.registerKeybinding({
            command: toolbar_constants_1.ToolbarCommands.TOGGLE_TOOLBAR.id,
            keybinding: 'alt+t',
        });
    }
    registerMenus(registry) {
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_LAYOUT, {
            commandId: toolbar_constants_1.ToolbarCommands.TOGGLE_TOOLBAR.id,
            order: 'z',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.ADD_COMMAND_TO_TOOLBAR.id,
            order: 'a',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.INSERT_GROUP_LEFT.id,
            order: 'b',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.INSERT_GROUP_RIGHT.id,
            order: 'c',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.REMOVE_COMMAND_FROM_TOOLBAR.id,
            order: 'd',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.ADD_COMMAND_TO_TOOLBAR.id,
            order: 'a',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.CUSTOMIZE_TOOLBAR.id,
            order: 'b',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.TOGGLE_TOOLBAR.id,
            order: 'c',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.RESET_TOOLBAR.id,
            order: 'd',
        });
    }
};
__decorate([
    (0, inversify_1.inject)(toolbar_controller_1.ToolbarController),
    __metadata("design:type", toolbar_controller_1.ToolbarController)
], ToolbarCommandContribution.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    __metadata("design:type", Object)
], ToolbarCommandContribution.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_command_quick_input_service_1.ToolbarCommandQuickInputService),
    __metadata("design:type", toolbar_command_quick_input_service_1.ToolbarCommandQuickInputService)
], ToolbarCommandContribution.prototype, "toolbarCommandPickService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandService),
    __metadata("design:type", Object)
], ToolbarCommandContribution.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], ToolbarCommandContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], ToolbarCommandContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_controller_1.ToolbarController),
    __metadata("design:type", toolbar_controller_1.ToolbarController)
], ToolbarCommandContribution.prototype, "toolbarModel", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.InMemoryResources),
    __metadata("design:type", core_1.InMemoryResources)
], ToolbarCommandContribution.prototype, "inMemoryResources", void 0);
ToolbarCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], ToolbarCommandContribution);
exports.ToolbarCommandContribution = ToolbarCommandContribution;
function bindToolbar(bind) {
    bind(toolbar_interfaces_1.ToolbarFactory).toFactory(({ container }) => () => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = container;
        child.bind(toolbar_interfaces_1.Toolbar).to(toolbar_1.ToolbarImpl);
        return child.get(toolbar_interfaces_1.Toolbar);
    });
    bind(ToolbarCommandContribution).toSelf().inSingletonScope();
    bind(core_1.CommandContribution).to(ToolbarCommandContribution);
    bind(core_1.MenuContribution).toService(ToolbarCommandContribution);
    bind(browser_1.KeybindingContribution).toService(ToolbarCommandContribution);
    bind(json_schema_store_1.JsonSchemaContribution).toService(ToolbarCommandContribution);
    bind(toolbar_command_quick_input_service_1.ToolbarCommandQuickInputService).toSelf().inSingletonScope();
    (0, toolbar_icon_selector_dialog_1.bindToolbarIconDialog)(bind);
    bind(toolbar_defaults_1.ToolbarDefaultsFactory).toConstantValue(toolbar_defaults_1.ToolbarDefaults);
    bind(toolbar_preference_contribution_1.ToolbarPreferences).toDynamicValue(({ container }) => {
        const preferences = container.get(browser_1.PreferenceService);
        return (0, browser_1.createPreferenceProxy)(preferences, toolbar_preference_contribution_1.ToolbarPreferencesSchema);
    }).inSingletonScope();
    bind(browser_1.PreferenceContribution).toConstantValue({
        schema: toolbar_preference_contribution_1.ToolbarPreferencesSchema,
    });
    bind(toolbar_constants_1.UserToolbarURI).toConstantValue(toolbar_constants_1.USER_TOOLBAR_URI);
    bind(toolbar_controller_1.ToolbarController).toSelf().inSingletonScope();
    bind(toolbar_storage_provider_1.ToolbarStorageProvider).toSelf().inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, toolbar_interfaces_1.ToolbarContribution);
    bind(toolbar_interfaces_1.LateInjector).toFactory((context) => (id) => (0, toolbar_interfaces_1.lateInjector)(context.container, id));
}
exports.bindToolbar = bindToolbar;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-command-contribution'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-command-quick-input-service.js":
/*!*********************************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-command-quick-input-service.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarCommandQuickInputService = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const toolbar_icon_selector_dialog_1 = __webpack_require__(/*! ./toolbar-icon-selector-dialog */ "../../packages/toolbar/lib/browser/toolbar-icon-selector-dialog.js");
const toolbar_interfaces_1 = __webpack_require__(/*! ./toolbar-interfaces */ "../../packages/toolbar/lib/browser/toolbar-interfaces.js");
const toolbar_controller_1 = __webpack_require__(/*! ./toolbar-controller */ "../../packages/toolbar/lib/browser/toolbar-controller.js");
let ToolbarCommandQuickInputService = class ToolbarCommandQuickInputService {
    constructor() {
        this.quickPickItems = [];
        this.columnQuickPickItems = [
            {
                label: core_1.nls.localize('theia/toolbar/leftColumn', 'Left Column'),
                id: toolbar_interfaces_1.ToolbarAlignment.LEFT,
            },
            {
                label: core_1.nls.localize('theia/toolbar/centerColumn', 'Center Column'),
                id: toolbar_interfaces_1.ToolbarAlignment.CENTER,
            },
            {
                label: core_1.nls.localize('theia/toolbar/rightColumn', 'Right Column'),
                id: toolbar_interfaces_1.ToolbarAlignment.RIGHT
            },
        ];
    }
    openIconDialog() {
        this.quickPickItems = this.generateCommandsList();
        this.quickInputService.showQuickPick(this.quickPickItems, {
            placeholder: core_1.nls.localize('theia/toolbar/addCommandPlaceholder', 'Find a command to add to the toolbar'),
        });
    }
    openColumnQP() {
        return this.quickInputService.showQuickPick(this.columnQuickPickItems, {
            placeholder: core_1.nls.localize('theia/toolbar/toolbarLocationPlaceholder', 'Where would you like the command added?')
        });
    }
    generateCommandsList() {
        const { recent, other } = this.quickCommandService.getCommands();
        return [...recent, ...other].map(command => {
            const formattedItem = this.quickCommandService.toItem(command);
            return {
                ...formattedItem,
                alwaysShow: true,
                execute: async () => {
                    var _a;
                    const iconDialog = this.iconDialogFactory(command);
                    const iconClass = await iconDialog.open();
                    if (iconClass) {
                        const { id } = (_a = await this.openColumnQP()) !== null && _a !== void 0 ? _a : {};
                        if (toolbar_interfaces_1.ToolbarAlignmentString.is(id)) {
                            this.model.addItem({ ...command, iconClass }, id);
                        }
                    }
                },
            };
        });
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.CommandService),
    __metadata("design:type", Object)
], ToolbarCommandQuickInputService.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    __metadata("design:type", Object)
], ToolbarCommandQuickInputService.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], ToolbarCommandQuickInputService.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickCommandService),
    __metadata("design:type", browser_1.QuickCommandService)
], ToolbarCommandQuickInputService.prototype, "quickCommandService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_controller_1.ToolbarController),
    __metadata("design:type", toolbar_controller_1.ToolbarController)
], ToolbarCommandQuickInputService.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_icon_selector_dialog_1.ToolbarIconDialogFactory),
    __metadata("design:type", Function)
], ToolbarCommandQuickInputService.prototype, "iconDialogFactory", void 0);
ToolbarCommandQuickInputService = __decorate([
    (0, inversify_1.injectable)()
], ToolbarCommandQuickInputService);
exports.ToolbarCommandQuickInputService = ToolbarCommandQuickInputService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-command-quick-input-service'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-controller.js":
/*!****************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-controller.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarController = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const frontend_application_state_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-state */ "../../packages/core/lib/browser/frontend-application-state.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const toolbar_defaults_1 = __webpack_require__(/*! ./toolbar-defaults */ "../../packages/toolbar/lib/browser/toolbar-defaults.js");
const toolbar_interfaces_1 = __webpack_require__(/*! ./toolbar-interfaces */ "../../packages/toolbar/lib/browser/toolbar-interfaces.js");
const toolbar_storage_provider_1 = __webpack_require__(/*! ./toolbar-storage-provider */ "../../packages/toolbar/lib/browser/toolbar-storage-provider.js");
let ToolbarController = class ToolbarController {
    constructor() {
        this.toolbarModelDidUpdateEmitter = new core_1.Emitter();
        this.onToolbarModelDidUpdate = this.toolbarModelDidUpdateEmitter.event;
        this.toolbarProviderBusyEmitter = new core_1.Emitter();
        this.onToolbarDidChangeBusyState = this.toolbarProviderBusyEmitter.event;
        this.ready = new promise_util_1.Deferred();
    }
    get toolbarItems() {
        return this._toolbarItems;
    }
    set toolbarItems(newTree) {
        this._toolbarItems = newTree;
        this.toolbarModelDidUpdateEmitter.fire();
    }
    inflateItems(schema) {
        const newTree = {
            items: {
                [toolbar_interfaces_1.ToolbarAlignment.LEFT]: [],
                [toolbar_interfaces_1.ToolbarAlignment.CENTER]: [],
                [toolbar_interfaces_1.ToolbarAlignment.RIGHT]: [],
            },
        };
        for (const column of Object.keys(schema.items)) {
            const currentColumn = schema.items[column];
            for (const group of currentColumn) {
                const newGroup = [];
                for (const item of group) {
                    if (item.group === 'contributed') {
                        const contribution = this.getContributionByID(item.id);
                        if (contribution) {
                            newGroup.push(contribution);
                        }
                    }
                    else if (tab_bar_toolbar_1.TabBarToolbarItem.is(item)) {
                        newGroup.push({ ...item });
                    }
                }
                if (newGroup.length) {
                    newTree.items[column].push(newGroup);
                }
            }
        }
        return newTree;
    }
    getContributionByID(id) {
        return this.widgetContributions.getContributions().find(contribution => contribution.id === id);
    }
    init() {
        this.doInit();
    }
    async doInit() {
        await this.appState.reachedState('ready');
        await this.storageProvider.ready;
        this.toolbarItems = await this.resolveToolbarItems();
        this.storageProvider.onToolbarItemsChanged(async () => {
            this.toolbarItems = await this.resolveToolbarItems();
        });
        this.ready.resolve();
        this.widgetContributions.getContributions().forEach(contribution => {
            if (contribution.onDidChange) {
                contribution.onDidChange(() => this.toolbarModelDidUpdateEmitter.fire());
            }
        });
    }
    async resolveToolbarItems() {
        await this.storageProvider.ready;
        if (this.storageProvider.toolbarItems) {
            try {
                return this.inflateItems(this.storageProvider.toolbarItems);
            }
            catch (e) {
                this.messageService.error(toolbar_storage_provider_1.TOOLBAR_BAD_JSON_ERROR_MESSAGE);
            }
        }
        return this.inflateItems(this.defaultsFactory());
    }
    async swapValues(oldPosition, newPosition, direction) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.swapValues(oldPosition, newPosition, direction);
        });
    }
    async clearAll() {
        return this.withBusy(() => this.storageProvider.clearAll());
    }
    async openOrCreateJSONFile(doOpen = false) {
        return this.storageProvider.openOrCreateJSONFile(this.toolbarItems, doOpen);
    }
    async addItem(command, area) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.addItem(command, area);
        });
    }
    async removeItem(position, id) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.removeItem(position);
        });
    }
    async moveItemToEmptySpace(draggedItemPosition, column, centerPosition) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.moveItemToEmptySpace(draggedItemPosition, column, centerPosition);
        });
    }
    async insertGroup(position, insertDirection) {
        return this.withBusy(async () => {
            await this.openOrCreateJSONFile(false);
            return this.storageProvider.insertGroup(position, insertDirection);
        });
    }
    async withBusy(action) {
        this.toolbarProviderBusyEmitter.fire(true);
        const toReturn = await action();
        this.toolbarProviderBusyEmitter.fire(false);
        return toReturn;
    }
};
__decorate([
    (0, inversify_1.inject)(toolbar_storage_provider_1.ToolbarStorageProvider),
    __metadata("design:type", toolbar_storage_provider_1.ToolbarStorageProvider)
], ToolbarController.prototype, "storageProvider", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], ToolbarController.prototype, "appState", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], ToolbarController.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_defaults_1.ToolbarDefaultsFactory),
    __metadata("design:type", Function)
], ToolbarController.prototype, "defaultsFactory", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(toolbar_interfaces_1.ToolbarContribution),
    __metadata("design:type", Object)
], ToolbarController.prototype, "widgetContributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarController.prototype, "init", null);
ToolbarController = __decorate([
    (0, inversify_1.injectable)()
], ToolbarController);
exports.ToolbarController = ToolbarController;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-controller'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-frontend-module.js":
/*!*********************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-frontend-module.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../../src/browser/style/toolbar.css */ "../../packages/toolbar/src/browser/style/toolbar.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const application_shell_with_toolbar_override_1 = __webpack_require__(/*! ./application-shell-with-toolbar-override */ "../../packages/toolbar/lib/browser/application-shell-with-toolbar-override.js");
const toolbar_command_contribution_1 = __webpack_require__(/*! ./toolbar-command-contribution */ "../../packages/toolbar/lib/browser/toolbar-command-contribution.js");
exports["default"] = new inversify_1.ContainerModule((bind, unbind, _isBound, rebind) => {
    (0, application_shell_with_toolbar_override_1.bindToolbarApplicationShell)(bind, rebind, unbind);
    (0, toolbar_command_contribution_1.bindToolbar)(bind);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-frontend-module'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-icon-selector-dialog.js":
/*!**************************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-icon-selector-dialog.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
var ToolbarIconSelectorDialog_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindToolbarIconDialog = exports.ICON_DIALOG_PADDING = exports.ICON_DIALOG_WIDTH = exports.ToolbarIconSelectorDialog = exports.CodiconIcons = exports.FontAwesomeIcons = exports.ToolbarCommand = exports.ToolbarIconDialogFactory = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const client_1 = __webpack_require__(/*! @theia/core/shared/react-dom/client */ "../../packages/core/shared/react-dom/client/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const react_dialog_1 = __webpack_require__(/*! @theia/core/lib/browser/dialogs/react-dialog */ "../../packages/core/lib/browser/dialogs/react-dialog.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const fuzzy_search_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/fuzzy-search */ "../../packages/core/lib/browser/tree/fuzzy-search.js");
const codicons_1 = __webpack_require__(/*! ./codicons */ "../../packages/toolbar/lib/browser/codicons.js");
const font_awesome_icons_1 = __webpack_require__(/*! ./font-awesome-icons */ "../../packages/toolbar/lib/browser/font-awesome-icons.js");
const toolbar_interfaces_1 = __webpack_require__(/*! ./toolbar-interfaces */ "../../packages/toolbar/lib/browser/toolbar-interfaces.js");
const toolbar_constants_1 = __webpack_require__(/*! ./toolbar-constants */ "../../packages/toolbar/lib/browser/toolbar-constants.js");
exports.ToolbarIconDialogFactory = Symbol('ToolbarIconDialogFactory');
exports.ToolbarCommand = Symbol('ToolbarCommand');
exports.FontAwesomeIcons = Symbol('FontAwesomeIcons');
exports.CodiconIcons = Symbol('CodiconIcons');
const FIFTY_MS = 50;
let ToolbarIconSelectorDialog = ToolbarIconSelectorDialog_1 = class ToolbarIconSelectorDialog extends react_dialog_1.ReactDialog {
    constructor(props) {
        super(props);
        this.props = props;
        this.deferredScrollContainer = new promise_util_1.Deferred();
        this.scrollOptions = { ...browser_1.DEFAULT_SCROLL_OPTIONS };
        this.activeIconPrefix = toolbar_interfaces_1.IconSet.CODICON;
        this.iconSets = new Map();
        this.filteredIcons = [];
        this.doShowFilterPlaceholder = false;
        this.debounceHandleSearch = debounce(this.doHandleSearch.bind(this), FIFTY_MS, { trailing: true });
        this.assignScrollContainerRef = (element) => this.doAssignScrollContainerRef(element);
        this.assignFilterRef = (element) => this.doAssignFilterRef(element);
        this.handleSelectOnChange = async (e) => this.doHandleSelectOnChange(e);
        this.handleOnIconClick = (e) => this.doHandleOnIconClick(e);
        this.handleOnIconBlur = (e) => this.doHandleOnIconBlur(e);
        this.doAccept = (e) => {
            const dataId = e.currentTarget.getAttribute('data-id');
            if (dataId === 'default-accept') {
                this.selectedIcon = this.toolbarCommand.iconClass;
            }
            this.accept();
        };
        this.doClose = () => {
            this.selectedIcon = undefined;
            this.close();
        };
        this.controlPanelRoot = (0, client_1.createRoot)(this.controlPanel);
        this.toDispose.push(core_1.Disposable.create(() => this.controlPanelRoot.unmount()));
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        this.controlPanelRoot.render(this.renderControls());
    }
    init() {
        this.node.id = ToolbarIconSelectorDialog_1.ID;
        this.iconSets.set(toolbar_interfaces_1.IconSet.FA, this.faIcons);
        this.iconSets.set(toolbar_interfaces_1.IconSet.CODICON, this.codiconIcons);
        this.activeIconPrefix = toolbar_interfaces_1.IconSet.CODICON;
        const initialIcons = this.iconSets.get(this.activeIconPrefix);
        if (initialIcons) {
            this.filteredIcons = initialIcons;
        }
    }
    async getScrollContainer() {
        return this.deferredScrollContainer.promise;
    }
    doAssignScrollContainerRef(element) {
        this.deferredScrollContainer.resolve(element);
    }
    doAssignFilterRef(element) {
        this.filterRef = element;
    }
    get value() {
        return this.selectedIcon;
    }
    async doHandleSelectOnChange(e) {
        const { value } = e.target;
        this.activeIconPrefix = value;
        this.filteredIcons = [];
        await this.doHandleSearch();
        this.update();
    }
    renderIconSelectorOptions() {
        return (React.createElement("div", { className: 'icon-selector-options' },
            React.createElement("div", { className: 'icon-set-selector-wrapper' },
                core_1.nls.localize('theia/toolbar/iconSet', 'Icon Set'),
                ': ',
                React.createElement("select", { className: 'toolbar-icon-select theia-select', onChange: this.handleSelectOnChange, defaultValue: toolbar_interfaces_1.IconSet.CODICON },
                    React.createElement("option", { key: toolbar_interfaces_1.IconSet.CODICON, value: toolbar_interfaces_1.IconSet.CODICON }, "Codicon"),
                    React.createElement("option", { key: toolbar_interfaces_1.IconSet.FA, value: toolbar_interfaces_1.IconSet.FA }, "Font Awesome"))),
            React.createElement("div", { className: 'icon-fuzzy-filter' },
                React.createElement("input", { ref: this.assignFilterRef, placeholder: core_1.nls.localize('theia/toolbar/filterIcons', 'Filter Icons'), type: 'text', className: 'icon-filter-input theia-input', onChange: this.debounceHandleSearch, spellCheck: false }))));
    }
    renderIconGrid() {
        var _a;
        return (React.createElement("div", { className: 'toolbar-scroll-container', ref: this.assignScrollContainerRef },
            React.createElement("div", { className: `toolbar-icon-dialog-content ${this.doShowFilterPlaceholder ? '' : 'grid'}` }, !this.doShowFilterPlaceholder ? (_a = this.filteredIcons) === null || _a === void 0 ? void 0 : _a.map(icon => (React.createElement("div", { className: 'icon-wrapper', key: icon, role: 'button', onClick: this.handleOnIconClick, onBlur: this.handleOnIconBlur, tabIndex: 0, "data-id": `${this.activeIconPrefix} ${icon}`, title: icon, onKeyPress: this.handleOnIconClick },
                React.createElement("div", { className: `${this.activeIconPrefix} ${icon}` }))))
                : React.createElement("div", { className: 'search-placeholder' }, core_1.nls.localizeByDefault('No results found')))));
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.renderIconSelectorOptions(),
            this.renderIconGrid()));
    }
    async doHandleSearch() {
        const query = this.filterRef.value;
        const pattern = query;
        const items = this.iconSets.get(this.activeIconPrefix);
        if (items) {
            if (pattern.length) {
                const transform = (item) => item;
                const filterResults = await this.fuzzySearch.filter({ pattern, items, transform });
                this.filteredIcons = filterResults.map(result => result.item);
                if (!this.filteredIcons.length) {
                    this.doShowFilterPlaceholder = true;
                }
                else {
                    this.doShowFilterPlaceholder = false;
                }
            }
            else {
                this.doShowFilterPlaceholder = false;
                this.filteredIcons = items;
            }
            this.update();
        }
    }
    doHandleOnIconClick(e) {
        e.currentTarget.classList.add('selected');
        if (toolbar_constants_1.ReactKeyboardEvent.is(e) && e.key !== 'Enter') {
            return;
        }
        const iconId = e.currentTarget.getAttribute('data-id');
        if (iconId) {
            this.selectedIcon = iconId;
            this.update();
        }
    }
    doHandleOnIconBlur(e) {
        e.currentTarget.classList.remove('selected');
    }
    renderControls() {
        return (React.createElement("div", { className: 'toolbar-icon-controls' },
            React.createElement("div", null, this.toolbarCommand.iconClass
                && (React.createElement("button", { type: 'button', className: 'theia-button main default-button', "data-id": 'default-accept', onClick: this.doAccept },
                    React.createElement("span", null, `${core_1.nls.localize('theia/toolbar/useDefaultIcon', 'Use Default Icon')}:`),
                    React.createElement("div", { className: `toolbar-default-icon ${this.toolbarCommand.iconClass}` })))),
            React.createElement("div", null,
                React.createElement("button", { type: 'button', disabled: !this.selectedIcon, className: 'theia-button main', onClick: this.doAccept }, core_1.nls.localize('theia/toolbar/selectIcon', 'Select Icon')),
                React.createElement("button", { type: 'button', className: 'theia-button secondary', onClick: this.doClose }, browser_1.Dialog.CANCEL))));
    }
};
ToolbarIconSelectorDialog.ID = 'toolbar-icon-selector-dialog';
__decorate([
    (0, inversify_1.inject)(exports.ToolbarCommand),
    __metadata("design:type", Object)
], ToolbarIconSelectorDialog.prototype, "toolbarCommand", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], ToolbarIconSelectorDialog.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(exports.FontAwesomeIcons),
    __metadata("design:type", Array)
], ToolbarIconSelectorDialog.prototype, "faIcons", void 0);
__decorate([
    (0, inversify_1.inject)(exports.CodiconIcons),
    __metadata("design:type", Array)
], ToolbarIconSelectorDialog.prototype, "codiconIcons", void 0);
__decorate([
    (0, inversify_1.inject)(fuzzy_search_1.FuzzySearch),
    __metadata("design:type", fuzzy_search_1.FuzzySearch)
], ToolbarIconSelectorDialog.prototype, "fuzzySearch", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarIconSelectorDialog.prototype, "init", null);
ToolbarIconSelectorDialog = ToolbarIconSelectorDialog_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.DialogProps)),
    __metadata("design:paramtypes", [browser_1.DialogProps])
], ToolbarIconSelectorDialog);
exports.ToolbarIconSelectorDialog = ToolbarIconSelectorDialog;
exports.ICON_DIALOG_WIDTH = 600;
exports.ICON_DIALOG_PADDING = 24;
const bindToolbarIconDialog = (bind) => {
    bind(exports.ToolbarIconDialogFactory).toFactory(ctx => (command) => {
        const child = ctx.container.createChild();
        child.bind(browser_1.DialogProps).toConstantValue({
            title: core_1.nls.localize('theia/toolbar/iconSelectDialog', "Select an Icon for '{0}'", command.label),
            maxWidth: exports.ICON_DIALOG_WIDTH + exports.ICON_DIALOG_PADDING,
        });
        child.bind(exports.FontAwesomeIcons).toConstantValue(font_awesome_icons_1.fontAwesomeIcons);
        child.bind(exports.CodiconIcons).toConstantValue(codicons_1.codicons);
        child.bind(exports.ToolbarCommand).toConstantValue(command);
        child.bind(fuzzy_search_1.FuzzySearch).toSelf().inSingletonScope();
        child.bind(ToolbarIconSelectorDialog).toSelf().inSingletonScope();
        return child.get(ToolbarIconSelectorDialog);
    });
};
exports.bindToolbarIconDialog = bindToolbarIconDialog;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-icon-selector-dialog'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-preference-contribution.js":
/*!*****************************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-preference-contribution.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarPreferences = exports.ToolbarPreferencesSchema = exports.TOOLBAR_ENABLE_PREFERENCE_ID = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
exports.TOOLBAR_ENABLE_PREFERENCE_ID = 'toolbar.showToolbar';
exports.ToolbarPreferencesSchema = {
    type: 'object',
    properties: {
        [exports.TOOLBAR_ENABLE_PREFERENCE_ID]: {
            'type': 'boolean',
            'description': 'Show toolbar',
            'default': false,
            'scope': browser_1.PreferenceScope.Workspace,
        },
    },
};
class ToolbarPreferencesContribution {
}
exports.ToolbarPreferences = Symbol('ToolbarPreferences');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-preference-contribution'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-preference-schema.js":
/*!***********************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-preference-schema.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isToolbarPreferences = exports.toolbarConfigurationSchema = exports.toolbarSchemaId = void 0;
const Ajv = __webpack_require__(/*! @theia/core/shared/ajv */ "../../packages/core/shared/ajv/index.js");
const toolbarColumnGroup = {
    'type': 'array',
    'description': 'Array of subgroups for right toolbar column',
    'items': {
        'type': 'array',
        'description': 'Grouping',
        'items': {
            'type': 'object',
            'properties': {
                'id': { 'type': 'string' },
                'command': { 'type': 'string' },
                'icon': { 'type': 'string' },
                'tooltip': { 'type': 'string' },
                'group': { 'enum': ['contributed'] },
                'when': { 'type': 'string' },
            },
            'required': [
                'id',
            ],
            'additionalProperties': false,
        }
    }
};
exports.toolbarSchemaId = 'vscode://schemas/toolbar';
exports.toolbarConfigurationSchema = {
    // '$schema': 'https://json-schema.org/draft/2019-09/schema',
    '$id': 'vscode://schemas/indexing-grid',
    'type': 'object',
    'title': 'Toolbar',
    'properties': {
        'items': {
            'type': 'object',
            'properties': {
                'left': toolbarColumnGroup,
                'center': toolbarColumnGroup,
                'right': toolbarColumnGroup,
            },
            'required': [
                'left',
                'center',
                'right'
            ],
            'additionalProperties': false,
        }
    },
    'required': [
        'items'
    ]
};
const validator = new Ajv().compile(exports.toolbarConfigurationSchema);
function isToolbarPreferences(candidate) {
    return Boolean(validator(candidate));
}
exports.isToolbarPreferences = isToolbarPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-preference-schema'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar-storage-provider.js":
/*!**********************************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar-storage-provider.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarStorageProvider = exports.TOOLBAR_BAD_JSON_ERROR_MESSAGE = void 0;
const jsoncParser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const monaco_workspace_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const frontend_application_state_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-state */ "../../packages/core/lib/browser/frontend-application-state.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const toolbar_interfaces_1 = __webpack_require__(/*! ./toolbar-interfaces */ "../../packages/toolbar/lib/browser/toolbar-interfaces.js");
const toolbar_constants_1 = __webpack_require__(/*! ./toolbar-constants */ "../../packages/toolbar/lib/browser/toolbar-constants.js");
const toolbar_preference_schema_1 = __webpack_require__(/*! ./toolbar-preference-schema */ "../../packages/toolbar/lib/browser/toolbar-preference-schema.js");
exports.TOOLBAR_BAD_JSON_ERROR_MESSAGE = 'There was an error reading your toolbar.json file. Please check if it is corrupt'
    + ' by right-clicking the toolbar and selecting "Customize Toolbar". You can also reset it to its defaults by selecting'
    + ' "Restore Toolbar Defaults"';
let ToolbarStorageProvider = class ToolbarStorageProvider {
    constructor() {
        this._ready = new promise_util_1.Deferred();
        this.toDispose = new core_1.DisposableCollection();
        this.toolbarItemsUpdatedEmitter = new core_1.Emitter();
        this.onToolbarItemsChanged = this.toolbarItemsUpdatedEmitter.event;
    }
    get ready() {
        return this._ready.promise;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const reference = await this.textModelService.createModelReference(this.USER_TOOLBAR_URI);
        this.model = reference.object;
        this.toDispose.push(reference);
        this.toDispose.push(core_1.Disposable.create(() => this.model = undefined));
        this.readConfiguration();
        if (this.model) {
            this.toDispose.push(this.model.onDidChangeContent(() => this.readConfiguration()));
            this.toDispose.push(this.model.onDirtyChanged(() => this.readConfiguration()));
            this.toDispose.push(this.model.onDidChangeValid(() => this.readConfiguration()));
        }
        this.toDispose.push(this.toolbarItemsUpdatedEmitter);
        await this.appState.reachedState('ready');
        this.monacoWorkspace = this.lateInjector(monaco_workspace_1.MonacoWorkspace);
        this.editorManager = this.lateInjector(browser_1.EditorManager);
        this._ready.resolve();
    }
    readConfiguration() {
        if (!this.model || this.model.dirty) {
            return;
        }
        try {
            if (this.model.valid) {
                const content = this.model.getText();
                this.toolbarItems = this.parseContent(content);
            }
            else {
                this.toolbarItems = undefined;
            }
            this.toolbarItemsUpdatedEmitter.fire();
        }
        catch (e) {
            console.error(`Failed to load toolbar config from '${this.USER_TOOLBAR_URI}'.`, e);
        }
    }
    async removeItem(position) {
        if (this.toolbarItems) {
            const { alignment, groupIndex, itemIndex } = position;
            const modifiedConfiguration = (0, core_1.deepClone)(this.toolbarItems);
            modifiedConfiguration.items[alignment][groupIndex].splice(itemIndex, 1);
            const sanitizedConfiguration = this.removeEmptyGroupsFromToolbar(modifiedConfiguration);
            return this.writeToFile([], sanitizedConfiguration);
        }
        return false;
    }
    async addItem(command, alignment) {
        var _a, _b;
        if (this.toolbarItems) {
            const itemFromCommand = {
                id: command.id,
                command: command.id,
                icon: command.iconClass,
            };
            const groupIndex = (_a = this.toolbarItems) === null || _a === void 0 ? void 0 : _a.items[alignment].length;
            if (groupIndex) {
                const lastItemIndex = (_b = this.toolbarItems) === null || _b === void 0 ? void 0 : _b.items[alignment][groupIndex - 1].length;
                const modifiedConfiguration = (0, core_1.deepClone)(this.toolbarItems);
                modifiedConfiguration.items[alignment][groupIndex - 1].push(itemFromCommand);
                return !!lastItemIndex && this.writeToFile([], modifiedConfiguration);
            }
            return this.addItemToEmptyColumn(itemFromCommand, alignment);
        }
        return false;
    }
    async swapValues(oldPosition, newPosition, direction) {
        var _a;
        if (this.toolbarItems) {
            const { alignment, groupIndex, itemIndex } = oldPosition;
            const draggedItem = (_a = this.toolbarItems) === null || _a === void 0 ? void 0 : _a.items[alignment][groupIndex][itemIndex];
            const newItemIndex = direction === 'location-right' ? newPosition.itemIndex + 1 : newPosition.itemIndex;
            const modifiedConfiguration = (0, core_1.deepClone)(this.toolbarItems);
            if (newPosition.alignment === oldPosition.alignment && newPosition.groupIndex === oldPosition.groupIndex) {
                modifiedConfiguration.items[newPosition.alignment][newPosition.groupIndex].splice(newItemIndex, 0, draggedItem);
                if (newPosition.itemIndex > oldPosition.itemIndex) {
                    modifiedConfiguration.items[oldPosition.alignment][oldPosition.groupIndex].splice(oldPosition.itemIndex, 1);
                }
                else {
                    modifiedConfiguration.items[oldPosition.alignment][oldPosition.groupIndex].splice(oldPosition.itemIndex + 1, 1);
                }
            }
            else {
                modifiedConfiguration.items[oldPosition.alignment][oldPosition.groupIndex].splice(oldPosition.itemIndex, 1);
                modifiedConfiguration.items[newPosition.alignment][newPosition.groupIndex].splice(newItemIndex, 0, draggedItem);
            }
            const sanitizedConfiguration = this.removeEmptyGroupsFromToolbar(modifiedConfiguration);
            return this.writeToFile([], sanitizedConfiguration);
        }
        return false;
    }
    async addItemToEmptyColumn(item, alignment) {
        if (this.toolbarItems) {
            const modifiedConfiguration = (0, core_1.deepClone)(this.toolbarItems);
            modifiedConfiguration.items[alignment].push([item]);
            return this.writeToFile([], modifiedConfiguration);
        }
        return false;
    }
    async moveItemToEmptySpace(oldPosition, newAlignment, centerPosition) {
        const { alignment: oldAlignment, itemIndex: oldItemIndex } = oldPosition;
        let oldGroupIndex = oldPosition.groupIndex;
        if (this.toolbarItems) {
            const draggedItem = this.toolbarItems.items[oldAlignment][oldGroupIndex][oldItemIndex];
            const newGroupIndex = this.toolbarItems.items[oldAlignment].length;
            const modifiedConfiguration = (0, core_1.deepClone)(this.toolbarItems);
            if (newAlignment === toolbar_interfaces_1.ToolbarAlignment.LEFT) {
                modifiedConfiguration.items[newAlignment].push([draggedItem]);
            }
            else if (newAlignment === toolbar_interfaces_1.ToolbarAlignment.CENTER) {
                if (centerPosition === 'left') {
                    modifiedConfiguration.items[newAlignment].unshift([draggedItem]);
                    if (newAlignment === oldAlignment) {
                        oldGroupIndex = oldGroupIndex + 1;
                    }
                }
                else if (centerPosition === 'right') {
                    modifiedConfiguration.items[newAlignment].splice(newGroupIndex + 1, 0, [draggedItem]);
                }
            }
            else if (newAlignment === toolbar_interfaces_1.ToolbarAlignment.RIGHT) {
                modifiedConfiguration.items[newAlignment].unshift([draggedItem]);
                if (newAlignment === oldAlignment) {
                    oldGroupIndex = oldGroupIndex + 1;
                }
            }
            modifiedConfiguration.items[oldAlignment][oldGroupIndex].splice(oldItemIndex, 1);
            const sanitizedConfiguration = this.removeEmptyGroupsFromToolbar(modifiedConfiguration);
            return this.writeToFile([], sanitizedConfiguration);
        }
        return false;
    }
    async insertGroup(position, insertDirection) {
        if (this.toolbarItems) {
            const { alignment, groupIndex, itemIndex } = position;
            const modifiedConfiguration = (0, core_1.deepClone)(this.toolbarItems);
            const originalColumn = modifiedConfiguration.items[alignment];
            if (originalColumn) {
                const existingGroup = originalColumn[groupIndex];
                const existingGroupLength = existingGroup.length;
                let poppedGroup = [];
                let numItemsToRemove;
                if (insertDirection === 'left' && itemIndex !== 0) {
                    numItemsToRemove = existingGroupLength - itemIndex;
                    poppedGroup = existingGroup.splice(itemIndex, numItemsToRemove);
                    originalColumn.splice(groupIndex, 1, existingGroup, poppedGroup);
                }
                else if (insertDirection === 'right' && itemIndex !== existingGroupLength - 1) {
                    numItemsToRemove = itemIndex + 1;
                    poppedGroup = existingGroup.splice(0, numItemsToRemove);
                    originalColumn.splice(groupIndex, 1, poppedGroup, existingGroup);
                }
                const sanitizedConfiguration = this.removeEmptyGroupsFromToolbar(modifiedConfiguration);
                return this.writeToFile([], sanitizedConfiguration);
            }
        }
        return false;
    }
    removeEmptyGroupsFromToolbar(toolbarItems) {
        if (toolbarItems) {
            const modifiedConfiguration = (0, core_1.deepClone)(toolbarItems);
            const columns = [toolbar_interfaces_1.ToolbarAlignment.LEFT, toolbar_interfaces_1.ToolbarAlignment.CENTER, toolbar_interfaces_1.ToolbarAlignment.RIGHT];
            columns.forEach(column => {
                const groups = toolbarItems.items[column];
                groups.forEach((group, index) => {
                    if (group.length === 0) {
                        modifiedConfiguration.items[column].splice(index, 1);
                    }
                });
            });
            return modifiedConfiguration;
        }
        return undefined;
    }
    async clearAll() {
        if (this.model) {
            const textModel = this.model.textEditorModel;
            await this.monacoWorkspace.applyBackgroundEdit(this.model, [
                {
                    range: textModel.getFullModelRange(),
                    // eslint-disable-next-line no-null/no-null
                    text: null,
                    forceMoveMarkers: false,
                },
            ]);
        }
        this.toolbarItemsUpdatedEmitter.fire();
        return true;
    }
    async writeToFile(path, value, insertion = false) {
        if (this.model) {
            try {
                const content = this.model.getText().trim();
                const textModel = this.model.textEditorModel;
                const editOperations = [];
                const { insertSpaces, tabSize, defaultEOL } = textModel.getOptions();
                for (const edit of jsoncParser.modify(content, path, value, {
                    isArrayInsertion: insertion,
                    formattingOptions: {
                        insertSpaces,
                        tabSize,
                        eol: defaultEOL === monaco.editor.DefaultEndOfLine.LF ? '\n' : '\r\n',
                    },
                })) {
                    const start = textModel.getPositionAt(edit.offset);
                    const end = textModel.getPositionAt(edit.offset + edit.length);
                    editOperations.push({
                        range: monaco.Range.fromPositions(start, end),
                        // eslint-disable-next-line no-null/no-null
                        text: edit.content || null,
                        forceMoveMarkers: false,
                    });
                }
                await this.monacoWorkspace.applyBackgroundEdit(this.model, editOperations, false);
                await this.model.save();
                return true;
            }
            catch (e) {
                const message = core_1.nls.localize('theia/toolbar/failedUpdate', "Failed to update the value of '{0}' in '{1}'.", path.join('.'), this.USER_TOOLBAR_URI.path.toString());
                this.messageService.error(core_1.nls.localize('theia/toolbar/jsonError', exports.TOOLBAR_BAD_JSON_ERROR_MESSAGE));
                console.error(`${message}`, e);
                return false;
            }
        }
        return false;
    }
    parseContent(fileContent) {
        const rawConfig = this.parse(fileContent);
        if (!(0, toolbar_preference_schema_1.isToolbarPreferences)(rawConfig)) {
            return undefined;
        }
        return rawConfig;
    }
    parse(fileContent) {
        let strippedContent = fileContent.trim();
        if (!strippedContent) {
            return undefined;
        }
        strippedContent = jsoncParser.stripComments(strippedContent);
        return jsoncParser.parse(strippedContent);
    }
    async openOrCreateJSONFile(state, doOpen = false) {
        const fileExists = await this.fileService.exists(this.USER_TOOLBAR_URI);
        let doWriteStateToFile = false;
        if (fileExists) {
            const fileContent = await this.fileService.read(this.USER_TOOLBAR_URI);
            if (fileContent.value.trim() === '') {
                doWriteStateToFile = true;
            }
        }
        else {
            await this.fileService.create(this.USER_TOOLBAR_URI);
            doWriteStateToFile = true;
        }
        if (doWriteStateToFile) {
            await this.writeToFile([], state);
        }
        this.readConfiguration();
        if (doOpen) {
            const widget = await this.editorManager.open(this.USER_TOOLBAR_URI);
            return widget;
        }
        return undefined;
    }
    dispose() {
        this.toDispose.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], ToolbarStorageProvider.prototype, "appState", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], ToolbarStorageProvider.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], ToolbarStorageProvider.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], ToolbarStorageProvider.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_interfaces_1.LateInjector),
    __metadata("design:type", Function)
], ToolbarStorageProvider.prototype, "lateInjector", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_constants_1.UserToolbarURI),
    __metadata("design:type", uri_1.default)
], ToolbarStorageProvider.prototype, "USER_TOOLBAR_URI", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarStorageProvider.prototype, "init", null);
ToolbarStorageProvider = __decorate([
    (0, inversify_1.injectable)()
], ToolbarStorageProvider);
exports.ToolbarStorageProvider = ToolbarStorageProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar-storage-provider'] = this;


/***/ }),

/***/ "../../packages/toolbar/lib/browser/toolbar.js":
/*!*****************************************************!*\
  !*** ../../packages/toolbar/lib/browser/toolbar.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarImpl = exports.TOOLBAR_PROGRESSBAR_ID = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const label_parser_1 = __webpack_require__(/*! @theia/core/lib/browser/label-parser */ "../../packages/core/lib/browser/label-parser.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const frontend_application_state_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-state */ "../../packages/core/lib/browser/frontend-application-state.js");
const progress_bar_factory_1 = __webpack_require__(/*! @theia/core/lib/browser/progress-bar-factory */ "../../packages/core/lib/browser/progress-bar-factory.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const toolbar_interfaces_1 = __webpack_require__(/*! ./toolbar-interfaces */ "../../packages/toolbar/lib/browser/toolbar-interfaces.js");
const toolbar_controller_1 = __webpack_require__(/*! ./toolbar-controller */ "../../packages/toolbar/lib/browser/toolbar-controller.js");
const toolbar_constants_1 = __webpack_require__(/*! ./toolbar-constants */ "../../packages/toolbar/lib/browser/toolbar-constants.js");
const TOOLBAR_BACKGROUND_DATA_ID = 'toolbar-wrapper';
exports.TOOLBAR_PROGRESSBAR_ID = 'main-toolbar-progress';
let ToolbarImpl = class ToolbarImpl extends tab_bar_toolbar_1.TabBarToolbar {
    constructor() {
        super(...arguments);
        this.deferredRef = new promise_util_1.Deferred();
        this.isBusyDeferred = new promise_util_1.Deferred();
        this.handleContextMenu = (e) => this.doHandleContextMenu(e);
        this.assignRef = (element) => this.doAssignRef(element);
        this.handleOnDragStart = (e) => this.doHandleOnDragStart(e);
        this.handleOnDragEnter = (e) => this.doHandleItemOnDragEnter(e);
        this.handleOnDragLeave = (e) => this.doHandleOnDragLeave(e);
        this.handleOnDrop = (e) => this.doHandleOnDrop(e);
        this.handleOnDragEnd = (e) => this.doHandleOnDragEnd(e);
    }
    init() {
        super.init();
        this.doInit();
    }
    async doInit() {
        this.hide();
        await this.model.ready.promise;
        this.updateInlineItems();
        this.update();
        this.model.onToolbarModelDidUpdate(() => {
            this.updateInlineItems();
            this.update();
        });
        this.model.onToolbarDidChangeBusyState(isBusy => {
            if (isBusy) {
                this.isBusyDeferred = new promise_util_1.Deferred();
                this.progressService.withProgress('', exports.TOOLBAR_PROGRESSBAR_ID, async () => this.isBusyDeferred.promise);
            }
            else {
                this.isBusyDeferred.resolve();
            }
        });
        await this.deferredRef.promise;
        this.progressFactory({ container: this.node, insertMode: 'append', locationId: exports.TOOLBAR_PROGRESSBAR_ID });
    }
    updateInlineItems() {
        var _a;
        this.inline.clear();
        const { items } = this.model.toolbarItems;
        const contextKeys = new Set();
        for (const column of Object.keys(items)) {
            for (const group of items[column]) {
                for (const item of group) {
                    this.inline.set(item.id, item);
                    if (item.when) {
                        (_a = this.contextKeyService.parseKeys(item.when)) === null || _a === void 0 ? void 0 : _a.forEach(key => contextKeys.add(key));
                    }
                }
            }
        }
        this.updateContextKeyListener(contextKeys);
    }
    doHandleContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        const contextMenuArgs = this.getContextMenuArgs(event);
        const { menuPath, anchor } = this.getMenuDetailsForClick(event);
        return this.contextMenuRenderer.render({
            args: contextMenuArgs,
            menuPath,
            anchor,
        });
    }
    getMenuDetailsForClick(event) {
        const clickId = event.currentTarget.getAttribute('data-id');
        let menuPath;
        let anchor;
        if (clickId === TOOLBAR_BACKGROUND_DATA_ID) {
            menuPath = toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU;
            const { clientX, clientY } = event;
            anchor = { x: clientX, y: clientY };
        }
        else {
            menuPath = toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU;
            const { left, bottom } = event.currentTarget.getBoundingClientRect();
            anchor = { x: left, y: bottom };
        }
        return { menuPath, anchor };
    }
    getContextMenuArgs(event) {
        const args = [this];
        // data-position is the stringified position of a given toolbar item, this allows
        // the model to be aware of start/stop positions during drag & drop and CRUD operations
        const position = event.currentTarget.getAttribute('data-position');
        const id = event.currentTarget.getAttribute('data-id');
        if (position) {
            args.push(JSON.parse(position));
        }
        else if (id) {
            args.push(id);
        }
        return args;
    }
    renderGroupsInColumn(groups, alignment) {
        const nodes = [];
        groups.forEach((group, groupIndex) => {
            if (nodes.length && group.length) {
                nodes.push(React.createElement("div", { key: `toolbar-separator-${groupIndex}`, className: 'separator' }));
            }
            group.forEach((item, itemIndex) => {
                const position = { alignment, groupIndex, itemIndex };
                nodes.push(this.renderItemWithDraggableWrapper(item, position));
            });
        });
        return nodes;
    }
    doAssignRef(element) {
        this.deferredRef.resolve(element);
    }
    render() {
        var _a, _b, _c;
        const leftGroups = (_a = this.model.toolbarItems) === null || _a === void 0 ? void 0 : _a.items[toolbar_interfaces_1.ToolbarAlignment.LEFT];
        const centerGroups = (_b = this.model.toolbarItems) === null || _b === void 0 ? void 0 : _b.items[toolbar_interfaces_1.ToolbarAlignment.CENTER];
        const rightGroups = (_c = this.model.toolbarItems) === null || _c === void 0 ? void 0 : _c.items[toolbar_interfaces_1.ToolbarAlignment.RIGHT];
        return (React.createElement("div", { className: 'toolbar-wrapper', onContextMenu: this.handleContextMenu, "data-id": TOOLBAR_BACKGROUND_DATA_ID, role: 'menu', tabIndex: 0, ref: this.assignRef },
            this.renderColumnWrapper(toolbar_interfaces_1.ToolbarAlignment.LEFT, leftGroups),
            this.renderColumnWrapper(toolbar_interfaces_1.ToolbarAlignment.CENTER, centerGroups),
            this.renderColumnWrapper(toolbar_interfaces_1.ToolbarAlignment.RIGHT, rightGroups)));
    }
    renderColumnWrapper(alignment, columnGroup) {
        let children;
        if (alignment === toolbar_interfaces_1.ToolbarAlignment.LEFT) {
            children = (React.createElement(React.Fragment, null,
                this.renderGroupsInColumn(columnGroup, alignment),
                this.renderColumnSpace(alignment)));
        }
        else if (alignment === toolbar_interfaces_1.ToolbarAlignment.CENTER) {
            const isCenterColumnEmpty = !columnGroup.length;
            if (isCenterColumnEmpty) {
                children = this.renderColumnSpace(alignment, 'left');
            }
            else {
                children = (React.createElement(React.Fragment, null,
                    this.renderColumnSpace(alignment, 'left'),
                    this.renderGroupsInColumn(columnGroup, alignment),
                    this.renderColumnSpace(alignment, 'right')));
            }
        }
        else if (alignment === toolbar_interfaces_1.ToolbarAlignment.RIGHT) {
            children = (React.createElement(React.Fragment, null,
                this.renderColumnSpace(alignment),
                this.renderGroupsInColumn(columnGroup, alignment)));
        }
        return (React.createElement("div", { role: 'group', className: `toolbar-column ${alignment}` }, children));
    }
    renderColumnSpace(alignment, position) {
        return (React.createElement("div", { className: 'empty-column-space', "data-column": `${alignment}`, "data-center-position": position, onDrop: this.handleOnDrop, onDragOver: this.handleOnDragEnter, onDragEnter: this.handleOnDragEnter, onDragLeave: this.handleOnDragLeave, key: `column-space-${alignment}-${position}` }));
    }
    renderItemWithDraggableWrapper(item, position) {
        const stringifiedPosition = JSON.stringify(position);
        let toolbarItemClassNames = '';
        let renderBody;
        if (tab_bar_toolbar_1.TabBarToolbarItem.is(item)) {
            toolbarItemClassNames = tab_bar_toolbar_1.TabBarToolbar.Styles.TAB_BAR_TOOLBAR_ITEM;
            if (this.evaluateWhenClause(item.when)) {
                toolbarItemClassNames += ' enabled';
            }
            renderBody = this.renderItem(item);
        }
        else {
            const contribution = this.model.getContributionByID(item.id);
            if (contribution) {
                renderBody = contribution.render();
            }
        }
        return (React.createElement("div", { role: 'button', tabIndex: 0, "data-id": item.id, id: item.id, "data-position": stringifiedPosition, key: `${item.id}-${stringifiedPosition}`, className: `${toolbarItemClassNames} toolbar-item action-label`, onMouseDown: this.onMouseDownEvent, onMouseUp: this.onMouseUpEvent, onMouseOut: this.onMouseUpEvent, draggable: true, onDragStart: this.handleOnDragStart, onClick: this.executeCommand, onDragOver: this.handleOnDragEnter, onDragLeave: this.handleOnDragLeave, onContextMenu: this.handleContextMenu, onDragEnd: this.handleOnDragEnd, onDrop: this.handleOnDrop },
            renderBody,
            React.createElement("div", { className: 'hover-overlay' })));
    }
    renderItem(item) {
        const classNames = [];
        if (item.text) {
            for (const labelPart of this.labelParser.parse(item.text)) {
                if (typeof labelPart !== 'string' && label_parser_1.LabelIcon.is(labelPart)) {
                    const className = `fa fa-${labelPart.name}${labelPart.animation ? ' fa-' + labelPart.animation : ''}`;
                    classNames.push(...className.split(' '));
                }
            }
        }
        const command = this.commands.getCommand(item.command);
        const iconClass = (typeof item.icon === 'function' && item.icon()) || item.icon || (command === null || command === void 0 ? void 0 : command.iconClass);
        if (iconClass) {
            classNames.push(iconClass);
        }
        let itemTooltip = '';
        if (item.tooltip) {
            itemTooltip = item.tooltip;
        }
        else if (command === null || command === void 0 ? void 0 : command.label) {
            itemTooltip = command.label;
        }
        const keybindingString = this.resolveKeybindingForCommand(command === null || command === void 0 ? void 0 : command.id);
        itemTooltip = `${itemTooltip}${keybindingString}`;
        return (React.createElement("div", { id: item.id, className: classNames.join(' '), title: itemTooltip }));
    }
    doHandleOnDragStart(e) {
        var _a;
        const draggedElement = e.currentTarget;
        draggedElement.classList.add('dragging');
        e.dataTransfer.setDragImage(draggedElement, 0, 0);
        const position = JSON.parse((_a = e.currentTarget.getAttribute('data-position')) !== null && _a !== void 0 ? _a : '');
        this.currentlyDraggedItem = e.currentTarget;
        this.draggedStartingPosition = position;
    }
    doHandleItemOnDragEnter(e) {
        var _a;
        e.preventDefault();
        e.stopPropagation();
        const targetItemDOMElement = e.currentTarget;
        const targetItemHoverOverlay = targetItemDOMElement.querySelector('.hover-overlay');
        const targetItemId = e.currentTarget.getAttribute('data-id');
        if (targetItemDOMElement.classList.contains('empty-column-space')) {
            targetItemDOMElement.classList.add('drag-over');
        }
        else if (targetItemDOMElement.classList.contains('toolbar-item') && targetItemHoverOverlay) {
            const { clientX } = e;
            const { left, right } = e.currentTarget.getBoundingClientRect();
            const targetMiddleX = (left + right) / 2;
            if (targetItemId !== ((_a = this.currentlyDraggedItem) === null || _a === void 0 ? void 0 : _a.getAttribute('data-id'))) {
                targetItemHoverOverlay.classList.add('drag-over');
                if (clientX <= targetMiddleX) {
                    targetItemHoverOverlay.classList.add('location-left');
                    targetItemHoverOverlay.classList.remove('location-right');
                }
                else {
                    targetItemHoverOverlay.classList.add('location-right');
                    targetItemHoverOverlay.classList.remove('location-left');
                }
            }
        }
    }
    doHandleOnDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetItemDOMElement = e.currentTarget;
        const targetItemHoverOverlay = targetItemDOMElement.querySelector('.hover-overlay');
        if (targetItemDOMElement.classList.contains('empty-column-space')) {
            targetItemDOMElement.classList.remove('drag-over');
        }
        else if (targetItemHoverOverlay && targetItemDOMElement.classList.contains('toolbar-item')) {
            targetItemHoverOverlay === null || targetItemHoverOverlay === void 0 ? void 0 : targetItemHoverOverlay.classList.remove('drag-over', 'location-left', 'location-right');
        }
    }
    doHandleOnDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetItemDOMElement = e.currentTarget;
        const targetItemHoverOverlay = targetItemDOMElement.querySelector('.hover-overlay');
        if (targetItemDOMElement.classList.contains('empty-column-space')) {
            this.handleDropInEmptySpace(targetItemDOMElement);
            targetItemDOMElement.classList.remove('drag-over');
        }
        else if (targetItemHoverOverlay && targetItemDOMElement.classList.contains('toolbar-item')) {
            this.handleDropInExistingGroup(targetItemDOMElement);
            targetItemHoverOverlay.classList.remove('drag-over', 'location-left', 'location-right');
        }
        this.currentlyDraggedItem = undefined;
        this.draggedStartingPosition = undefined;
    }
    handleDropInExistingGroup(element) {
        var _a;
        const position = element.getAttribute('data-position');
        const targetDirection = (_a = element.querySelector('.hover-overlay')) === null || _a === void 0 ? void 0 : _a.classList.toString().split(' ').find(className => className.includes('location'));
        const dropPosition = JSON.parse(position !== null && position !== void 0 ? position : '');
        if (this.currentlyDraggedItem && targetDirection
            && this.draggedStartingPosition && !this.arePositionsEquivalent(this.draggedStartingPosition, dropPosition)) {
            this.model.swapValues(this.draggedStartingPosition, dropPosition, targetDirection);
        }
    }
    handleDropInEmptySpace(element) {
        const column = element.getAttribute('data-column');
        if (toolbar_interfaces_1.ToolbarAlignmentString.is(column) && this.draggedStartingPosition) {
            if (column === toolbar_interfaces_1.ToolbarAlignment.CENTER) {
                const centerPosition = element.getAttribute('data-center-position');
                this.model.moveItemToEmptySpace(this.draggedStartingPosition, column, centerPosition);
            }
            else {
                this.model.moveItemToEmptySpace(this.draggedStartingPosition, column);
            }
        }
    }
    arePositionsEquivalent(start, end) {
        return start.alignment === end.alignment
            && start.groupIndex === end.groupIndex
            && start.itemIndex === end.itemIndex;
    }
    doHandleOnDragEnd(e) {
        e.preventDefault();
        e.stopPropagation();
        this.currentlyDraggedItem = undefined;
        this.draggedStartingPosition = undefined;
        e.currentTarget.classList.remove('dragging');
    }
};
__decorate([
    (0, inversify_1.inject)(tab_bar_toolbar_1.TabBarToolbarFactory),
    __metadata("design:type", Function)
], ToolbarImpl.prototype, "tabbarToolbarFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], ToolbarImpl.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], ToolbarImpl.prototype, "appState", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_controller_1.ToolbarController),
    __metadata("design:type", toolbar_controller_1.ToolbarController)
], ToolbarImpl.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], ToolbarImpl.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], ToolbarImpl.prototype, "keybindingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(progress_bar_factory_1.ProgressBarFactory),
    __metadata("design:type", Function)
], ToolbarImpl.prototype, "progressFactory", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ProgressService),
    __metadata("design:type", core_1.ProgressService)
], ToolbarImpl.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolbarImpl.prototype, "init", null);
ToolbarImpl = __decorate([
    (0, inversify_1.injectable)()
], ToolbarImpl);
exports.ToolbarImpl = ToolbarImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/toolbar/lib/browser/toolbar'] = this;


/***/ }),

/***/ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common sync recursive":
/*!*****************************************************************************!*\
  !*** ../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/ sync ***!
  \*****************************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/toolbar/src/browser/style/toolbar.css":
/*!******************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/toolbar/src/browser/style/toolbar.css ***!
  \******************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2022 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

#main-toolbar {
  --theia-toolbar-height: calc(var(--theia-private-menubar-height) - 2px);
  --theia-toolbar-item-padding: 5px;
  --theia-toolbar-icon-size: 20px;

  min-height: var(--theia-toolbar-height);
  color: var(--theia-mainToolbar-foreground);
  background: var(--theia-mainToolbar-background);
  padding: 2px 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

#main-toolbar .theia-progress-bar-container {
  position: absolute;
  bottom: 0;
}

.toolbar-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
}

.toolbar-wrapper .toolbar-column {
  display: flex;
  flex: 1;
}

.toolbar-wrapper .left {
  justify-content: flex-start;
}

.toolbar-wrapper .center {
  justify-content: center;
}

.toolbar-wrapper .right {
  justify-content: flex-end;
}

.toolbar-wrapper:focus {
  outline: none;
}

#main-toolbar .toolbar-item {
  padding: 2px;
  margin: 0 2px;
  box-sizing: border-box;
  position: relative;
  background: unset;
  cursor: pointer;
}

#main-toolbar .empty-column-space {
  flex-grow: 1;
}

#main-toolbar .toolbar-item .codicon,
#main-toolbar .toolbar-item .fa {
  font-size: var(--theia-toolbar-icon-size);
  width: unset;
  min-width: var(--theia-toolbar-icon-size);
  height: var(--theia-toolbar-icon-size);
  line-height: var(--theia-toolbar-icon-size);
}

#main-toolbar
  .toolbar-item.action-label.enabled:hover:not(.dragging):not(.active) {
  background-color: var(--theia-toolbar-hoverBackground);
}

#main-toolbar .toolbar-item.action-label:not(.enabled) {
  cursor: default;
}

#main-toolbar .toolbar-item .hover-overlay {
  position: absolute;
  pointer-events: none;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

#main-toolbar .toolbar-item .hover-overlay.drag-over {
  background-color: var(--theia-activityBar-foreground);
  opacity: 0.3;
}

#main-toolbar .toolbar-item .hover-overlay.location-left {
  width: 25%;
}

#main-toolbar .toolbar-item .hover-overlay.location-right {
  width: 25%;
  left: 75%;
  right: 0;
}

#main-toolbar .toolbar-item.dragging {
  opacity: 0.3;
}

#main-toolbar .toolbar-item:focus {
  outline: none;
}

#main-toolbar .item:focus,
#main-toolbar .item div:focus {
  outline: none;
}

#main-toolbar .separator {
  width: 1px;
  background-color: var(--theia-activityBar-foreground);
  opacity: var(--theia-mod-disabled-opacity);
  margin: 0 5px;
}

.toolbar-column {
  display: flex;
}

.toolbar-column.left {
  margin-right: var(--theia-toolbar-item-padding);
}

.toolbar-column.right {
  margin-left: var(--theia-toolbar-item-padding);
}

.toolbar-column.empty {
  min-width: 60px;
}

.empty-column-space.drag-over {
  background-color: var(--theia-activityBar-foreground);
  opacity: 0.3;
  border-radius: 2px;
}

#toolbar-icon-selector-dialog {
  --theia-icon-dialog-icon-size: 20px;
}

#toolbar-icon-selector-dialog .dialogBlock {
  max-height: 75%;
  width: 600px;
}

#toolbar-icon-selector-dialog .dialogContent {
  overflow: hidden;
  display: block;
}

#toolbar-icon-selector-dialog .dialogContent .icon-selector-options {
  display: flex;
}

#toolbar-icon-selector-dialog .dialogContent .icon-wrapper:focus {
  box-shadow: unset;
  outline: solid 1px var(--theia-focusBorder);
}

#toolbar-icon-selector-dialog .dialogControl {
  padding-top: var(--theia-ui-padding);
}

#toolbar-icon-selector-dialog .toolbar-icon-dialog-content.grid {
  --grid-size: 28px;
  display: grid;
  grid-template-columns: repeat(20, var(--grid-size));
  grid-template-rows: var(--grid-size);
  grid-auto-rows: var(--grid-size);
}

#toolbar-icon-selector-dialog .toolbar-icon-dialog-content .icon-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#toolbar-icon-selector-dialog .toolbar-icon-dialog-content .search-placeholder {
  text-align: center;
  margin-top: var(--theia-ui-padding);
  font-size: 1.2em;
}

#toolbar-icon-selector-dialog .toolbar-icon-controls {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

#toolbar-icon-selector-dialog .toolbar-icon-controls .default-button {
  display: flex;
}

#toolbar-icon-selector-dialog .toolbar-icon-controls .toolbar-default-icon {
  margin-left: var(--theia-ui-padding);
  font-size: var(--theia-icon-dialog-icon-size);
}

#toolbar-icon-selector-dialog .icon-selector-options {
  justify-content: space-between;
}

#toolbar-icon-selector-dialog .icon-selector-options .icon-filter-input {
  height: 18px;
}

#toolbar-icon-selector-dialog .toolbar-icon-select {
  margin-bottom: var(--theia-ui-padding);
}

#toolbar-icon-selector-dialog
  .toolbar-icon-dialog-content
  .icon-wrapper.selected {
  background-color: var(--theia-list-activeSelectionBackground);
}

#toolbar-icon-selector-dialog .toolbar-icon-dialog-content .fa,
#toolbar-icon-selector-dialog .toolbar-icon-dialog-content .codicon {
  font-size: var(--theia-icon-dialog-icon-size);
}

#toolbar-icon-selector-dialog .toolbar-scroll-container {
  height: 375px;
  position: relative;
  padding: 0 var(--theia-ui-padding);
  border: 1px solid var(--theia-editorWidget-border);
  background-color: var(--theia-dropdown-background);
}
`, "",{"version":3,"sources":["webpack://./../../packages/toolbar/src/browser/style/toolbar.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,uEAAuE;EACvE,iCAAiC;EACjC,+BAA+B;;EAE/B,uCAAuC;EACvC,0CAA0C;EAC1C,+CAA+C;EAC/C,gBAAgB;EAChB,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,kBAAkB;AACpB;;AAEA;EACE,kBAAkB;EAClB,SAAS;AACX;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,WAAW;EACX,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,OAAO;AACT;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,sBAAsB;EACtB,kBAAkB;EAClB,iBAAiB;EACjB,eAAe;AACjB;;AAEA;EACE,YAAY;AACd;;AAEA;;EAEE,yCAAyC;EACzC,YAAY;EACZ,yCAAyC;EACzC,sCAAsC;EACtC,2CAA2C;AAC7C;;AAEA;;EAEE,sDAAsD;AACxD;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,YAAY;EACZ,WAAW;EACX,OAAO;EACP,MAAM;AACR;;AAEA;EACE,qDAAqD;EACrD,YAAY;AACd;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;EACV,SAAS;EACT,QAAQ;AACV;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,aAAa;AACf;;AAEA;;EAEE,aAAa;AACf;;AAEA;EACE,UAAU;EACV,qDAAqD;EACrD,0CAA0C;EAC1C,aAAa;AACf;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,+CAA+C;AACjD;;AAEA;EACE,8CAA8C;AAChD;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,qDAAqD;EACrD,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,eAAe;EACf,YAAY;AACd;;AAEA;EACE,gBAAgB;EAChB,cAAc;AAChB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,iBAAiB;EACjB,2CAA2C;AAC7C;;AAEA;EACE,oCAAoC;AACtC;;AAEA;EACE,iBAAiB;EACjB,aAAa;EACb,mDAAmD;EACnD,oCAAoC;EACpC,gCAAgC;AAClC;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,kBAAkB;EAClB,mCAAmC;EACnC,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,WAAW;EACX,8BAA8B;AAChC;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,oCAAoC;EACpC,6CAA6C;AAC/C;;AAEA;EACE,8BAA8B;AAChC;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,sCAAsC;AACxC;;AAEA;;;EAGE,6DAA6D;AAC/D;;AAEA;;EAEE,6CAA6C;AAC/C;;AAEA;EACE,aAAa;EACb,kBAAkB;EAClB,kCAAkC;EAClC,kDAAkD;EAClD,kDAAkD;AACpD","sourcesContent":["/********************************************************************************\n * Copyright (C) 2022 Ericsson and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n#main-toolbar {\n  --theia-toolbar-height: calc(var(--theia-private-menubar-height) - 2px);\n  --theia-toolbar-item-padding: 5px;\n  --theia-toolbar-icon-size: 20px;\n\n  min-height: var(--theia-toolbar-height);\n  color: var(--theia-mainToolbar-foreground);\n  background: var(--theia-mainToolbar-background);\n  padding: 2px 4px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  position: relative;\n}\n\n#main-toolbar .theia-progress-bar-container {\n  position: absolute;\n  bottom: 0;\n}\n\n.toolbar-wrapper {\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  overflow: hidden;\n}\n\n.toolbar-wrapper .toolbar-column {\n  display: flex;\n  flex: 1;\n}\n\n.toolbar-wrapper .left {\n  justify-content: flex-start;\n}\n\n.toolbar-wrapper .center {\n  justify-content: center;\n}\n\n.toolbar-wrapper .right {\n  justify-content: flex-end;\n}\n\n.toolbar-wrapper:focus {\n  outline: none;\n}\n\n#main-toolbar .toolbar-item {\n  padding: 2px;\n  margin: 0 2px;\n  box-sizing: border-box;\n  position: relative;\n  background: unset;\n  cursor: pointer;\n}\n\n#main-toolbar .empty-column-space {\n  flex-grow: 1;\n}\n\n#main-toolbar .toolbar-item .codicon,\n#main-toolbar .toolbar-item .fa {\n  font-size: var(--theia-toolbar-icon-size);\n  width: unset;\n  min-width: var(--theia-toolbar-icon-size);\n  height: var(--theia-toolbar-icon-size);\n  line-height: var(--theia-toolbar-icon-size);\n}\n\n#main-toolbar\n  .toolbar-item.action-label.enabled:hover:not(.dragging):not(.active) {\n  background-color: var(--theia-toolbar-hoverBackground);\n}\n\n#main-toolbar .toolbar-item.action-label:not(.enabled) {\n  cursor: default;\n}\n\n#main-toolbar .toolbar-item .hover-overlay {\n  position: absolute;\n  pointer-events: none;\n  height: 100%;\n  width: 100%;\n  left: 0;\n  top: 0;\n}\n\n#main-toolbar .toolbar-item .hover-overlay.drag-over {\n  background-color: var(--theia-activityBar-foreground);\n  opacity: 0.3;\n}\n\n#main-toolbar .toolbar-item .hover-overlay.location-left {\n  width: 25%;\n}\n\n#main-toolbar .toolbar-item .hover-overlay.location-right {\n  width: 25%;\n  left: 75%;\n  right: 0;\n}\n\n#main-toolbar .toolbar-item.dragging {\n  opacity: 0.3;\n}\n\n#main-toolbar .toolbar-item:focus {\n  outline: none;\n}\n\n#main-toolbar .item:focus,\n#main-toolbar .item div:focus {\n  outline: none;\n}\n\n#main-toolbar .separator {\n  width: 1px;\n  background-color: var(--theia-activityBar-foreground);\n  opacity: var(--theia-mod-disabled-opacity);\n  margin: 0 5px;\n}\n\n.toolbar-column {\n  display: flex;\n}\n\n.toolbar-column.left {\n  margin-right: var(--theia-toolbar-item-padding);\n}\n\n.toolbar-column.right {\n  margin-left: var(--theia-toolbar-item-padding);\n}\n\n.toolbar-column.empty {\n  min-width: 60px;\n}\n\n.empty-column-space.drag-over {\n  background-color: var(--theia-activityBar-foreground);\n  opacity: 0.3;\n  border-radius: 2px;\n}\n\n#toolbar-icon-selector-dialog {\n  --theia-icon-dialog-icon-size: 20px;\n}\n\n#toolbar-icon-selector-dialog .dialogBlock {\n  max-height: 75%;\n  width: 600px;\n}\n\n#toolbar-icon-selector-dialog .dialogContent {\n  overflow: hidden;\n  display: block;\n}\n\n#toolbar-icon-selector-dialog .dialogContent .icon-selector-options {\n  display: flex;\n}\n\n#toolbar-icon-selector-dialog .dialogContent .icon-wrapper:focus {\n  box-shadow: unset;\n  outline: solid 1px var(--theia-focusBorder);\n}\n\n#toolbar-icon-selector-dialog .dialogControl {\n  padding-top: var(--theia-ui-padding);\n}\n\n#toolbar-icon-selector-dialog .toolbar-icon-dialog-content.grid {\n  --grid-size: 28px;\n  display: grid;\n  grid-template-columns: repeat(20, var(--grid-size));\n  grid-template-rows: var(--grid-size);\n  grid-auto-rows: var(--grid-size);\n}\n\n#toolbar-icon-selector-dialog .toolbar-icon-dialog-content .icon-wrapper {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n#toolbar-icon-selector-dialog .toolbar-icon-dialog-content .search-placeholder {\n  text-align: center;\n  margin-top: var(--theia-ui-padding);\n  font-size: 1.2em;\n}\n\n#toolbar-icon-selector-dialog .toolbar-icon-controls {\n  display: flex;\n  width: 100%;\n  justify-content: space-between;\n}\n\n#toolbar-icon-selector-dialog .toolbar-icon-controls .default-button {\n  display: flex;\n}\n\n#toolbar-icon-selector-dialog .toolbar-icon-controls .toolbar-default-icon {\n  margin-left: var(--theia-ui-padding);\n  font-size: var(--theia-icon-dialog-icon-size);\n}\n\n#toolbar-icon-selector-dialog .icon-selector-options {\n  justify-content: space-between;\n}\n\n#toolbar-icon-selector-dialog .icon-selector-options .icon-filter-input {\n  height: 18px;\n}\n\n#toolbar-icon-selector-dialog .toolbar-icon-select {\n  margin-bottom: var(--theia-ui-padding);\n}\n\n#toolbar-icon-selector-dialog\n  .toolbar-icon-dialog-content\n  .icon-wrapper.selected {\n  background-color: var(--theia-list-activeSelectionBackground);\n}\n\n#toolbar-icon-selector-dialog .toolbar-icon-dialog-content .fa,\n#toolbar-icon-selector-dialog .toolbar-icon-dialog-content .codicon {\n  font-size: var(--theia-icon-dialog-icon-size);\n}\n\n#toolbar-icon-selector-dialog .toolbar-scroll-container {\n  height: 375px;\n  position: relative;\n  padding: 0 var(--theia-ui-padding);\n  border: 1px solid var(--theia-editorWidget-border);\n  background-color: var(--theia-dropdown-background);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/toolbar/src/browser/style/toolbar.css":
/*!************************************************************!*\
  !*** ../../packages/toolbar/src/browser/style/toolbar.css ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_toolbar_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./toolbar.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/toolbar/src/browser/style/toolbar.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_toolbar_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_toolbar_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII= ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=";

/***/ }),

/***/ "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg== ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

/***/ }),

/***/ "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg== ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

/***/ })

}]);
//# sourceMappingURL=packages_filesystem_lib_browser_index_js-packages_toolbar_lib_browser_toolbar-frontend-module-09d901.js.map