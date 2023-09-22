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
exports.MonacoLanguages = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const problem_manager_1 = require("@theia/markers/lib/browser/problem/problem-manager");
const uri_1 = require("@theia/core/lib/common/uri");
const disposable_1 = require("@theia/core/lib/common/disposable");
const monaco_marker_collection_1 = require("./monaco-marker-collection");
const protocol_to_monaco_converter_1 = require("./protocol-to-monaco-converter");
const monaco = require("@theia/monaco-editor-core");
let MonacoLanguages = class MonacoLanguages {
    constructor() {
        this.workspaceSymbolProviders = [];
        this.markers = new Map();
    }
    init() {
        this.problemManager.onDidChangeMarkers(uri => this.updateMarkers(uri));
        monaco.editor.onDidCreateModel(model => this.updateModelMarkers(model));
    }
    updateMarkers(uri) {
        const markers = this.problemManager.findMarkers({ uri });
        const uriString = uri.toString();
        const collection = this.markers.get(uriString) || new monaco_marker_collection_1.MonacoMarkerCollection(uri, this.p2m);
        this.markers.set(uriString, collection);
        collection.updateMarkers(markers);
    }
    updateModelMarkers(model) {
        const uriString = model.uri.toString();
        const uri = new uri_1.default(uriString);
        const collection = this.markers.get(uriString) || new monaco_marker_collection_1.MonacoMarkerCollection(uri, this.p2m);
        this.markers.set(uriString, collection);
        collection.updateModelMarkers(model);
    }
    registerWorkspaceSymbolProvider(provider) {
        this.workspaceSymbolProviders.push(provider);
        return disposable_1.Disposable.create(() => {
            const index = this.workspaceSymbolProviders.indexOf(provider);
            if (index !== -1) {
                this.workspaceSymbolProviders.splice(index, 1);
            }
        });
    }
    get languages() {
        return [...this.mergeLanguages(monaco.languages.getLanguages()).values()];
    }
    getLanguage(languageId) {
        return this.mergeLanguages(monaco.languages.getLanguages().filter(language => language.id === languageId)).get(languageId);
    }
    getExtension(languageId) {
        var _a;
        return (_a = this.getLanguage(languageId)) === null || _a === void 0 ? void 0 : _a.extensions.values().next().value;
    }
    getLanguageIdByLanguageName(languageName) {
        var _a;
        return (_a = monaco.languages.getLanguages().find(language => { var _a; return (_a = language.aliases) === null || _a === void 0 ? void 0 : _a.includes(languageName); })) === null || _a === void 0 ? void 0 : _a.id;
    }
    mergeLanguages(registered) {
        const languages = new Map();
        for (const { id, aliases, extensions, filenames } of registered) {
            const merged = languages.get(id) || {
                id,
                name: '',
                extensions: new Set(),
                filenames: new Set()
            };
            if (!merged.name && aliases && aliases.length) {
                merged.name = aliases[0];
            }
            if (extensions && extensions.length) {
                for (const extension of extensions) {
                    merged.extensions.add(extension);
                }
            }
            if (filenames && filenames.length) {
                for (const filename of filenames) {
                    merged.filenames.add(filename);
                }
            }
            languages.set(id, merged);
        }
        for (const [id, language] of languages) {
            if (!language.name) {
                language.name = id;
            }
        }
        return languages;
    }
};
__decorate([
    (0, inversify_1.inject)(problem_manager_1.ProblemManager),
    __metadata("design:type", problem_manager_1.ProblemManager)
], MonacoLanguages.prototype, "problemManager", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], MonacoLanguages.prototype, "p2m", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoLanguages.prototype, "init", null);
MonacoLanguages = __decorate([
    (0, inversify_1.injectable)()
], MonacoLanguages);
exports.MonacoLanguages = MonacoLanguages;
//# sourceMappingURL=monaco-languages.js.map