"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagnostics = exports.DiagnosticCollection = void 0;
const event_1 = require("@theia/core/lib/common/event");
const type_converters_1 = require("../type-converters");
const types_impl_1 = require("../types-impl");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const uuid_1 = require("uuid");
class DiagnosticCollection {
    constructor(name, maxCountPerFile, proxy, onDidChangeDiagnosticsEmitter) {
        this.collectionName = name;
        this.diagnosticsLimitPerResource = maxCountPerFile;
        this.proxy = proxy;
        this.onDidChangeDiagnosticsEmitter = onDidChangeDiagnosticsEmitter;
        this.diagnostics = new Map();
        this.isDisposed = false;
        this.onDisposeCallback = undefined;
    }
    get name() {
        return this.collectionName;
    }
    set(arg, diagnostics) {
        this.ensureNotDisposed();
        if (arg instanceof vscode_uri_1.URI) {
            this.setDiagnosticsForUri(arg, diagnostics);
        }
        else if (!arg) {
            this.clear();
        }
        else if (arg instanceof Array) {
            this.setDiagnostics(arg);
        }
    }
    setDiagnosticsForUri(uri, diagnostics) {
        if (!diagnostics) {
            this.diagnostics.delete(uri.toString());
        }
        else {
            this.diagnostics.set(uri.toString(), diagnostics);
        }
        this.fireDiagnosticChangeEvent(uri);
        this.sendChangesToEditor([uri]);
    }
    setDiagnostics(entries) {
        const delta = [];
        // clear old diagnostics for given resources
        for (const [uri] of entries) {
            this.diagnostics.delete(uri.toString());
        }
        for (const [uri, diagnostics] of entries) {
            const uriString = uri.toString();
            if (!diagnostics) {
                // clear existed
                this.diagnostics.delete(uriString);
                delta.push(uri);
            }
            else {
                // merge with existed if any
                const existedDiagnostics = this.diagnostics.get(uriString);
                if (existedDiagnostics) {
                    existedDiagnostics.push(...diagnostics);
                }
                else {
                    this.diagnostics.set(uriString, diagnostics);
                }
            }
            if (delta.indexOf(uri) === -1) {
                delta.push(uri);
            }
        }
        this.fireDiagnosticChangeEvent(delta);
        this.sendChangesToEditor(delta);
    }
    delete(uri) {
        if (this.has(uri)) {
            this.fireDiagnosticChangeEvent(uri);
            this.diagnostics.delete(uri.toString());
            this.proxy.$changeDiagnostics(this.name, [[uri.toString(), []]]);
        }
    }
    clear() {
        this.ensureNotDisposed();
        this.fireDiagnosticChangeEvent(this.getAllResourcesUris());
        this.diagnostics.clear();
        this.proxy.$clearDiagnostics(this.name);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach(callback, thisArg) {
        this.ensureNotDisposed();
        this.diagnostics.forEach((diagnostics, uriString) => {
            const uri = vscode_uri_1.URI.parse(uriString);
            callback.apply(thisArg, [uri, this.getDiagnosticsByUri(uri), this]);
        });
    }
    get(uri) {
        this.ensureNotDisposed();
        return this.getDiagnosticsByUri(uri);
    }
    has(uri) {
        this.ensureNotDisposed();
        return (this.diagnostics.get(uri.toString()) instanceof Array);
    }
    dispose() {
        if (!this.isDisposed) {
            if (this.onDisposeCallback) {
                this.onDisposeCallback();
            }
            this.clear();
            this.isDisposed = true;
        }
    }
    setOnDisposeCallback(onDisposeCallback) {
        this.onDisposeCallback = onDisposeCallback;
    }
    ensureNotDisposed() {
        if (this.isDisposed) {
            throw new Error('Diagnostic collection with name "' + this.name + '" is already disposed.');
        }
    }
    getAllResourcesUris() {
        const resourcesUris = [];
        this.diagnostics.forEach((diagnostics, uri) => resourcesUris.push(uri));
        return resourcesUris;
    }
    getDiagnosticsByUri(uri) {
        const diagnostics = this.diagnostics.get(uri.toString());
        return (diagnostics instanceof Array) ? Object.freeze(diagnostics) : undefined;
    }
    fireDiagnosticChangeEvent(arg) {
        this.onDidChangeDiagnosticsEmitter.fire({ uris: this.toUrisArray(arg) });
    }
    toUrisArray(arg) {
        if (arg instanceof Array) {
            if (arg.length === 0) {
                return [];
            }
            if (arg[0] instanceof vscode_uri_1.URI) {
                return arg;
            }
            else {
                const result = [];
                for (const uriString of arg) {
                    result.push(vscode_uri_1.URI.parse(uriString));
                }
                return result;
            }
        }
        else {
            if (arg instanceof vscode_uri_1.URI) {
                return [arg];
            }
            else {
                return [vscode_uri_1.URI.parse(arg)];
            }
        }
    }
    sendChangesToEditor(uris) {
        const markers = [];
        nextUri: for (const uri of uris) {
            const uriMarkers = [];
            const uriDiagnostics = this.diagnostics.get(uri.toString());
            if (uriDiagnostics) {
                if (uriDiagnostics.length > this.diagnosticsLimitPerResource) {
                    for (const severity of DiagnosticCollection.DIAGNOSTICS_PRIORITY) {
                        for (const diagnostic of uriDiagnostics) {
                            if (severity === diagnostic.severity) {
                                if (uriMarkers.push((0, type_converters_1.convertDiagnosticToMarkerData)(diagnostic)) + 1 === this.diagnosticsLimitPerResource) {
                                    const lastMarker = uriMarkers[uriMarkers.length - 1];
                                    uriMarkers.push({
                                        severity: types_impl_1.MarkerSeverity.Info,
                                        message: 'Limit of diagnostics is reached. ' + (uriDiagnostics.length - this.diagnosticsLimitPerResource) + ' items are hidden',
                                        startLineNumber: lastMarker.startLineNumber,
                                        startColumn: lastMarker.startColumn,
                                        endLineNumber: lastMarker.endLineNumber,
                                        endColumn: lastMarker.endColumn
                                    });
                                    markers.push([uri.toString(), uriMarkers]);
                                    continue nextUri;
                                }
                            }
                        }
                    }
                }
                else {
                    uriDiagnostics.forEach(diagnostic => uriMarkers.push((0, type_converters_1.convertDiagnosticToMarkerData)(diagnostic)));
                    markers.push([uri.toString(), uriMarkers]);
                }
            }
            else {
                markers.push([uri.toString(), []]);
            }
        }
        this.proxy.$changeDiagnostics(this.name, markers);
    }
}
exports.DiagnosticCollection = DiagnosticCollection;
DiagnosticCollection.DIAGNOSTICS_PRIORITY = [
    types_impl_1.DiagnosticSeverity.Error, types_impl_1.DiagnosticSeverity.Warning, types_impl_1.DiagnosticSeverity.Information, types_impl_1.DiagnosticSeverity.Hint
];
class Diagnostics {
    constructor(rpc) {
        this.diagnosticsChangedEmitter = new event_1.Emitter();
        this.onDidChangeDiagnostics = this.diagnosticsChangedEmitter.event;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.LANGUAGES_MAIN);
        this.diagnosticCollections = new Map();
    }
    getDiagnostics(resource) {
        if (resource) {
            return this.getAllDiagnosticsForResource(resource);
        }
        else {
            return this.getAllDiagnostics();
        }
    }
    createDiagnosticCollection(name) {
        if (!name) {
            do {
                name = Diagnostics.GENERATED_DIAGNOSTIC_COLLECTION_NAME_PREFIX + this.getNextId();
            } while (this.diagnosticCollections.has(name));
        }
        else if (this.diagnosticCollections.has(name)) {
            console.warn(`Diagnostic collection with name '${name}' already exist.`);
        }
        const diagnosticCollection = new DiagnosticCollection(name, Diagnostics.MAX_DIAGNOSTICS_PER_FILE, this.proxy, this.diagnosticsChangedEmitter);
        diagnosticCollection.setOnDisposeCallback(() => {
            this.diagnosticCollections.delete(name);
        });
        this.diagnosticCollections.set(name, diagnosticCollection);
        return diagnosticCollection;
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    getAllDiagnosticsForResource(uri) {
        let result = [];
        this.diagnosticCollections.forEach(diagnosticCollection => {
            const diagnostics = diagnosticCollection.get(uri);
            if (diagnostics) {
                result = result.concat(...diagnostics);
            }
        });
        return result;
    }
    getAllDiagnostics() {
        const result = [];
        // Holds uri index in result array of tuples.
        const urisIndexes = new Map();
        let nextIndex = 0;
        this.diagnosticCollections.forEach(diagnosticsCollection => diagnosticsCollection.forEach((uri, diagnostics) => {
            let uriIndex = urisIndexes.get(uri.toString());
            if (uriIndex === undefined) {
                uriIndex = nextIndex++;
                urisIndexes.set(uri.toString(), uriIndex);
                result.push([uri, [...diagnostics]]);
            }
            else {
                result[uriIndex][1] = result[uriIndex][1].concat(...diagnostics);
            }
        }));
        return result;
    }
}
exports.Diagnostics = Diagnostics;
Diagnostics.MAX_DIAGNOSTICS_PER_FILE = 1000;
Diagnostics.GENERATED_DIAGNOSTIC_COLLECTION_NAME_PREFIX = '_generated_diagnostic_collection_name_#';
//# sourceMappingURL=diagnostics.js.map