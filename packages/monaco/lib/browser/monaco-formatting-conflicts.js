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
exports.MonacoFormattingConflictsContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const monaco_quick_input_service_1 = require("./monaco-quick-input-service");
const format_1 = require("@theia/monaco-editor-core/esm/vs/editor/contrib/format/browser/format");
const nls_1 = require("@theia/core/lib/common/nls");
const PREFERENCE_NAME = 'editor.defaultFormatter';
let MonacoFormattingConflictsContribution = class MonacoFormattingConflictsContribution {
    async initialize() {
        format_1.FormattingConflicts.setFormatterSelector((formatters, document, mode) => this.selectFormatter(formatters, document, mode));
    }
    async setDefaultFormatter(language, formatter) {
        const name = this.preferenceSchema.overridePreferenceName({
            preferenceName: PREFERENCE_NAME,
            overrideIdentifier: language
        });
        await this.preferenceService.set(name, formatter);
    }
    getDefaultFormatter(language) {
        const name = this.preferenceSchema.overridePreferenceName({
            preferenceName: PREFERENCE_NAME,
            overrideIdentifier: language
        });
        return this.preferenceService.get(name);
    }
    async selectFormatter(formatters, document, mode) {
        if (formatters.length === 0) {
            return undefined;
        }
        if (formatters.length === 1) {
            return formatters[0];
        }
        const currentEditor = this.editorManager.currentEditor;
        if (!currentEditor) {
            return undefined;
        }
        const languageId = currentEditor.editor.document.languageId;
        const defaultFormatterId = this.getDefaultFormatter(languageId);
        if (defaultFormatterId) {
            const formatter = formatters.find(f => f.extensionId && f.extensionId.value === defaultFormatterId);
            if (formatter) {
                return formatter;
            }
        }
        return new Promise(async (resolve, reject) => {
            const items = formatters
                .filter(formatter => formatter.displayName)
                .map(formatter => ({
                label: formatter.displayName,
                detail: formatter.extensionId ? formatter.extensionId.value : undefined,
                value: formatter,
            }))
                .sort((a, b) => a.label.localeCompare(b.label));
            const selectedFormatter = await this.monacoQuickInputService.showQuickPick(items, { placeholder: nls_1.nls.localizeByDefault('Format Document With...') });
            if (selectedFormatter) {
                this.setDefaultFormatter(languageId, selectedFormatter.detail ? selectedFormatter.detail : '');
                resolve(selectedFormatter.value);
            }
            else {
                resolve(undefined);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_quick_input_service_1.MonacoQuickInputService),
    __metadata("design:type", monaco_quick_input_service_1.MonacoQuickInputService)
], MonacoFormattingConflictsContribution.prototype, "monacoQuickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], MonacoFormattingConflictsContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceLanguageOverrideService),
    __metadata("design:type", browser_1.PreferenceLanguageOverrideService)
], MonacoFormattingConflictsContribution.prototype, "preferenceSchema", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], MonacoFormattingConflictsContribution.prototype, "editorManager", void 0);
MonacoFormattingConflictsContribution = __decorate([
    (0, inversify_1.injectable)()
], MonacoFormattingConflictsContribution);
exports.MonacoFormattingConflictsContribution = MonacoFormattingConflictsContribution;
//# sourceMappingURL=monaco-formatting-conflicts.js.map