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
exports.MarkerManager = exports.MarkerCollection = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const uri_1 = require("@theia/core/lib/common/uri");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
class MarkerCollection {
    constructor(uri, kind) {
        this.uri = uri;
        this.kind = kind;
        this.owner2Markers = new Map();
    }
    get empty() {
        return !this.owner2Markers.size;
    }
    getOwners() {
        return Array.from(this.owner2Markers.keys());
    }
    getMarkers(owner) {
        return this.owner2Markers.get(owner) || [];
    }
    setMarkers(owner, markerData) {
        const before = this.owner2Markers.get(owner);
        if (markerData.length > 0) {
            this.owner2Markers.set(owner, markerData.map(data => this.createMarker(owner, data)));
        }
        else {
            this.owner2Markers.delete(owner);
        }
        return before || [];
    }
    createMarker(owner, data) {
        return Object.freeze({
            uri: this.uri.toString(),
            kind: this.kind,
            owner: owner,
            data
        });
    }
    findMarkers(filter) {
        if (filter.owner) {
            if (this.owner2Markers.has(filter.owner)) {
                return this.filterMarkers(filter, this.owner2Markers.get(filter.owner));
            }
            return [];
        }
        else {
            const result = [];
            for (const markers of this.owner2Markers.values()) {
                result.push(...this.filterMarkers(filter, markers));
            }
            return result;
        }
    }
    filterMarkers(filter, toFilter) {
        if (!toFilter) {
            return [];
        }
        if (filter.dataFilter) {
            return toFilter.filter(d => filter.dataFilter(d.data));
        }
        else {
            return toFilter;
        }
    }
}
exports.MarkerCollection = MarkerCollection;
let MarkerManager = class MarkerManager {
    constructor() {
        this.uri2MarkerCollection = new Map();
        this.onDidChangeMarkersEmitter = new common_1.Emitter();
    }
    init() {
        this.fileService.onDidFilesChange(event => {
            if (event.gotDeleted()) {
                this.cleanMarkers(event);
            }
        });
    }
    cleanMarkers(event) {
        for (const uriString of this.uri2MarkerCollection.keys()) {
            const uri = new uri_1.default(uriString);
            if (event.contains(uri, 2 /* DELETED */)) {
                this.cleanAllMarkers(uri);
            }
        }
    }
    get onDidChangeMarkers() {
        return this.onDidChangeMarkersEmitter.event;
    }
    fireOnDidChangeMarkers(uri) {
        this.onDidChangeMarkersEmitter.fire(uri);
    }
    /*
     * replaces the current markers for the given uri and owner with the given data.
     */
    setMarkers(uri, owner, data) {
        const uriString = uri.toString();
        const collection = this.uri2MarkerCollection.get(uriString) || new MarkerCollection(uri, this.getKind());
        const oldMarkers = collection.setMarkers(owner, data);
        if (collection.empty) {
            this.uri2MarkerCollection.delete(uri.toString());
        }
        else {
            this.uri2MarkerCollection.set(uriString, collection);
        }
        this.fireOnDidChangeMarkers(uri);
        return oldMarkers;
    }
    /*
     * returns all markers that satisfy the given filter.
     */
    findMarkers(filter = {}) {
        if (filter.uri) {
            const collection = this.uri2MarkerCollection.get(filter.uri.toString());
            return collection ? collection.findMarkers(filter) : [];
        }
        const result = [];
        for (const uri of this.getUris()) {
            result.push(...this.uri2MarkerCollection.get(uri).findMarkers(filter));
        }
        return result;
    }
    getMarkersByUri() {
        return this.uri2MarkerCollection.entries();
    }
    getUris() {
        return this.uri2MarkerCollection.keys();
    }
    cleanAllMarkers(uri) {
        if (uri) {
            this.doCleanAllMarkers(uri);
        }
        else {
            for (const uriString of this.getUris()) {
                this.doCleanAllMarkers(new uri_1.default(uriString));
            }
        }
    }
    doCleanAllMarkers(uri) {
        const uriString = uri.toString();
        const collection = this.uri2MarkerCollection.get(uriString);
        if (collection !== undefined) {
            this.uri2MarkerCollection.delete(uriString);
            this.fireOnDidChangeMarkers(uri);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MarkerManager.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarkerManager.prototype, "init", null);
MarkerManager = __decorate([
    (0, inversify_1.injectable)()
], MarkerManager);
exports.MarkerManager = MarkerManager;
//# sourceMappingURL=marker-manager.js.map