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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeServiceWithDB = exports.stateToTheme = exports.deleteTheme = exports.putTheme = exports.getThemes = exports.MonacoThemeState = exports.monacoDB = void 0;
const idb = require("idb");
const disposable_1 = require("@theia/core/lib/common/disposable");
const theming_1 = require("@theia/core/lib/browser/theming");
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
let _monacoDB;
if ('indexedDB' in window) {
    _monacoDB = idb.openDB('theia-monaco', 1, {
        upgrade: db => {
            if (!db.objectStoreNames.contains('themes')) {
                db.createObjectStore('themes', { keyPath: 'id' });
            }
        }
    });
}
exports.monacoDB = _monacoDB;
var MonacoThemeState;
(function (MonacoThemeState) {
    function is(state) {
        return (0, core_1.isObject)(state) && 'id' in state && 'label' in state && 'uiTheme' in state && 'data' in state;
    }
    MonacoThemeState.is = is;
})(MonacoThemeState = exports.MonacoThemeState || (exports.MonacoThemeState = {}));
async function getThemes() {
    if (!exports.monacoDB) {
        return [];
    }
    const db = await exports.monacoDB;
    const result = await db.transaction('themes', 'readonly').objectStore('themes').getAll();
    return result.filter(MonacoThemeState.is);
}
exports.getThemes = getThemes;
function putTheme(state) {
    const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
    doPutTheme(state, toDispose);
    return toDispose;
}
exports.putTheme = putTheme;
async function doPutTheme(state, toDispose) {
    if (!exports.monacoDB) {
        return;
    }
    const db = await exports.monacoDB;
    if (toDispose.disposed) {
        return;
    }
    const id = state.id;
    await db.transaction('themes', 'readwrite').objectStore('themes').put(state);
    if (toDispose.disposed) {
        await deleteTheme(id);
        return;
    }
    toDispose.push(disposable_1.Disposable.create(() => deleteTheme(id)));
}
async function deleteTheme(id) {
    if (!exports.monacoDB) {
        return;
    }
    const db = await exports.monacoDB;
    await db.transaction('themes', 'readwrite').objectStore('themes').delete(id);
}
exports.deleteTheme = deleteTheme;
function stateToTheme(state) {
    const { id, label, description, uiTheme, data } = state;
    const type = uiTheme === 'vs' ? 'light' : uiTheme === 'vs-dark' ? 'dark' : 'hc';
    return {
        type,
        id,
        label,
        description,
        editorTheme: data.name
    };
}
exports.stateToTheme = stateToTheme;
let ThemeServiceWithDB = class ThemeServiceWithDB extends theming_1.ThemeService {
    constructor() {
        super(...arguments);
        this.onDidRetrieveThemeEmitter = new core_1.Emitter();
    }
    get onDidRetrieveTheme() {
        return this.onDidRetrieveThemeEmitter.event;
    }
    loadUserTheme() {
        this.loadUserThemeWithDB();
    }
    async loadUserThemeWithDB() {
        var _a, _b, _c;
        const themeId = (_a = window.localStorage.getItem(theming_1.ThemeService.STORAGE_KEY)) !== null && _a !== void 0 ? _a : this.defaultTheme.id;
        const theme = (_c = (_b = this.themes[themeId]) !== null && _b !== void 0 ? _b : await getThemes().then(themes => {
            const matchingTheme = themes.find(candidate => candidate.id === themeId);
            if (matchingTheme) {
                this.onDidRetrieveThemeEmitter.fire(matchingTheme);
                return stateToTheme(matchingTheme);
            }
        })) !== null && _c !== void 0 ? _c : this.getTheme(themeId);
        // In case the theme comes from the DB.
        if (!this.themes[theme.id]) {
            this.themes[theme.id] = theme;
        }
        this.setCurrentTheme(theme.id, false);
        this.deferredInitializer.resolve();
    }
};
ThemeServiceWithDB = __decorate([
    (0, inversify_1.injectable)()
], ThemeServiceWithDB);
exports.ThemeServiceWithDB = ThemeServiceWithDB;
//# sourceMappingURL=monaco-indexed-db.js.map