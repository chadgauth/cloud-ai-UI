"use strict";
// *****************************************************************************
// Copyright (C) 2015-2018 Red Hat, Inc.
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
exports.GrammarsReader = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const path = require("path");
const fs = require("@theia/core/shared/fs-extra");
let GrammarsReader = class GrammarsReader {
    async readGrammars(rawGrammars, pluginPath) {
        const result = new Array();
        for (const rawGrammar of rawGrammars) {
            const grammar = await this.readGrammar(rawGrammar, pluginPath);
            if (grammar) {
                result.push(grammar);
            }
        }
        return result;
    }
    async readGrammar(rawGrammar, pluginPath) {
        // TODO: validate inputs
        let grammar;
        if (rawGrammar.path.endsWith('json')) {
            grammar = await fs.readJSON(path.resolve(pluginPath, rawGrammar.path));
        }
        else {
            grammar = await fs.readFile(path.resolve(pluginPath, rawGrammar.path), 'utf8');
        }
        return {
            language: rawGrammar.language,
            scope: rawGrammar.scopeName,
            format: rawGrammar.path.endsWith('json') ? 'json' : 'plist',
            grammar: grammar,
            grammarLocation: rawGrammar.path,
            injectTo: rawGrammar.injectTo,
            embeddedLanguages: rawGrammar.embeddedLanguages,
            tokenTypes: rawGrammar.tokenTypes
        };
    }
};
GrammarsReader = __decorate([
    (0, inversify_1.injectable)()
], GrammarsReader);
exports.GrammarsReader = GrammarsReader;
//# sourceMappingURL=grammars-reader.js.map