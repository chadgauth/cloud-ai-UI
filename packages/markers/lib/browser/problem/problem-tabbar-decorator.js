"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.ProblemTabBarDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const event_1 = require("@theia/core/lib/common/event");
const widget_decoration_1 = require("@theia/core/lib/browser/widget-decoration");
const problem_manager_1 = require("./problem-manager");
const problem_preferences_1 = require("./problem-preferences");
const browser_1 = require("@theia/core/lib/browser");
let ProblemTabBarDecorator = class ProblemTabBarDecorator {
    constructor() {
        this.id = 'theia-problem-tabbar-decorator';
        this.emitter = new event_1.Emitter();
    }
    init() {
        this.problemManager.onDidChangeMarkers(() => this.fireDidChangeDecorations());
        this.preferences.onPreferenceChanged(event => this.handlePreferenceChange(event));
    }
    decorate(title) {
        if (!this.preferences['problems.decorations.tabbar.enabled']) {
            return [];
        }
        const widget = title.owner;
        if (browser_1.Navigatable.is(widget)) {
            const resourceUri = widget.getResourceUri();
            if (resourceUri) {
                // Get the list of problem markers for the given resource URI.
                const markers = this.problemManager.findMarkers({ uri: resourceUri });
                // If no markers are available, return early.
                if (markers.length === 0) {
                    return [];
                }
                // Store the marker with the highest severity.
                let maxSeverity;
                // Iterate over available markers to determine that which has the highest severity.
                // Only display a decoration if an error or warning marker is available.
                for (const marker of markers) {
                    // Break early if an error marker is present, since it represents the highest severity.
                    if (marker.data.severity === vscode_languageserver_protocol_1.DiagnosticSeverity.Error) {
                        maxSeverity = marker;
                        break;
                    }
                    else if (marker.data.severity === vscode_languageserver_protocol_1.DiagnosticSeverity.Warning) {
                        maxSeverity = marker;
                    }
                }
                // Decorate the tabbar with the highest marker severity if available.
                return maxSeverity ? [this.toDecorator(maxSeverity)] : [];
            }
        }
        return [];
    }
    get onDidChangeDecorations() {
        return this.emitter.event;
    }
    fireDidChangeDecorations() {
        this.emitter.fire(undefined);
    }
    /**
     * Handle changes in preference.
     * @param {PreferenceChangeEvent<ProblemConfiguration>} event The event of the changes in preference.
     */
    async handlePreferenceChange(event) {
        const { preferenceName } = event;
        if (preferenceName === 'problems.decorations.tabbar.enabled') {
            this.fireDidChangeDecorations();
        }
    }
    /**
     * Convert a diagnostic marker to a decorator.
     * @param {Marker<Diagnostic>} marker A diagnostic marker.
     * @returns {WidgetDecoration.Data} The decoration data.
     */
    toDecorator(marker) {
        const position = widget_decoration_1.WidgetDecoration.IconOverlayPosition.BOTTOM_RIGHT;
        const icon = this.getOverlayIcon(marker);
        const color = this.getOverlayIconColor(marker);
        return {
            iconOverlay: {
                position,
                icon,
                color,
                background: {
                    shape: 'circle',
                    color: 'transparent'
                }
            }
        };
    }
    /**
     * Get the appropriate overlay icon for decoration.
     * @param {Marker<Diagnostic>} marker A diagnostic marker.
     * @returns {string} A string representing the overlay icon class.
     */
    getOverlayIcon(marker) {
        const { severity } = marker.data;
        switch (severity) {
            case 1: return 'times-circle';
            case 2: return 'exclamation-circle';
            case 3: return 'info-circle';
            default: return 'hand-o-up';
        }
    }
    /**
     * Get the appropriate overlay icon color for decoration.
     * @param {Marker<Diagnostic>} marker A diagnostic marker.
     * @returns {WidgetDecoration.Color} The decoration color.
     */
    getOverlayIconColor(marker) {
        const { severity } = marker.data;
        switch (severity) {
            case 1: return 'var(--theia-list-errorForeground)';
            case 2: return 'var(--theia-list-warningForeground)';
            default: return 'var(--theia-successBackground)';
        }
    }
};
__decorate([
    (0, inversify_1.inject)(problem_preferences_1.ProblemPreferences),
    __metadata("design:type", Object)
], ProblemTabBarDecorator.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(problem_manager_1.ProblemManager),
    __metadata("design:type", problem_manager_1.ProblemManager)
], ProblemTabBarDecorator.prototype, "problemManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProblemTabBarDecorator.prototype, "init", null);
ProblemTabBarDecorator = __decorate([
    (0, inversify_1.injectable)()
], ProblemTabBarDecorator);
exports.ProblemTabBarDecorator = ProblemTabBarDecorator;
//# sourceMappingURL=problem-tabbar-decorator.js.map