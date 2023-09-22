"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.GitDecorationProvider = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("../common");
const common_2 = require("@theia/core/lib/common");
const git_repository_tracker_1 = require("./git-repository-tracker");
const uri_1 = require("@theia/core/lib/common/uri");
const git_preferences_1 = require("./git-preferences");
let GitDecorationProvider = class GitDecorationProvider {
    constructor() {
        this.decorations = new Map();
        this.uris = new Set();
        this.onDidChangeDecorationsEmitter = new common_2.Emitter();
        this.onDidChange = this.onDidChangeDecorationsEmitter.event;
    }
    init() {
        this.decorationsEnabled = this.preferences['git.decorations.enabled'];
        this.colorsEnabled = this.preferences['git.decorations.colors'];
        this.gitRepositoryTracker.onGitEvent((event) => this.handleGitEvent(event));
        this.preferences.onPreferenceChanged((event) => this.handlePreferenceChange(event));
    }
    async handleGitEvent(event) {
        this.updateDecorations(event);
        this.triggerDecorationChange();
    }
    updateDecorations(event) {
        if (!event) {
            return;
        }
        const newDecorations = new Map();
        this.collectDecorationData(event.status.changes, newDecorations);
        this.uris = new Set([...this.decorations.keys()].concat([...newDecorations.keys()]));
        this.decorations = newDecorations;
    }
    collectDecorationData(changes, bucket) {
        changes.forEach(change => {
            const color = common_1.GitFileStatus.getColor(change.status, change.staged);
            bucket.set(change.uri, {
                bubble: true,
                colorId: color.substring(12, color.length - 1).replace(/-/g, '.'),
                tooltip: common_1.GitFileStatus.toString(change.status),
                letter: common_1.GitFileStatus.toAbbreviation(change.status, change.staged)
            });
        });
    }
    provideDecorations(uri, token) {
        if (this.decorationsEnabled) {
            const decoration = this.decorations.get(uri.toString());
            if (decoration && !this.colorsEnabled) {
                // Remove decoration color if disabled.
                return {
                    ...decoration,
                    colorId: undefined
                };
            }
            return decoration;
        }
        return undefined;
    }
    handlePreferenceChange(event) {
        const { preferenceName, newValue } = event;
        let updateDecorations = false;
        if (preferenceName === 'git.decorations.enabled') {
            updateDecorations = true;
            const decorationsEnabled = !!newValue;
            if (this.decorationsEnabled !== decorationsEnabled) {
                this.decorationsEnabled = decorationsEnabled;
            }
        }
        if (preferenceName === 'git.decorations.colors') {
            updateDecorations = true;
            const colorsEnabled = !!newValue;
            if (this.colorsEnabled !== colorsEnabled) {
                this.colorsEnabled = colorsEnabled;
            }
        }
        if (updateDecorations) {
            this.triggerDecorationChange();
        }
    }
    /**
     * Notify that the provider has been updated to trigger a re-render of decorations.
     */
    triggerDecorationChange() {
        this.onDidChangeDecorationsEmitter.fire(Array.from(this.uris, value => new uri_1.default(value)));
    }
};
__decorate([
    (0, inversify_1.inject)(git_preferences_1.GitPreferences),
    __metadata("design:type", Object)
], GitDecorationProvider.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], GitDecorationProvider.prototype, "gitRepositoryTracker", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitDecorationProvider.prototype, "init", null);
GitDecorationProvider = __decorate([
    (0, inversify_1.injectable)()
], GitDecorationProvider);
exports.GitDecorationProvider = GitDecorationProvider;
//# sourceMappingURL=git-decoration-provider.js.map