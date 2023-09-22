"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.NavigatorSymlinkDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/filesystem/lib/browser");
const decorations_service_1 = require("@theia/core/lib/browser/decorations-service");
let NavigatorSymlinkDecorator = class NavigatorSymlinkDecorator {
    constructor() {
        this.id = 'theia-navigator-symlink-decorator';
        this.onDidChangeDecorationsEmitter = new core_1.Emitter();
    }
    init() {
        this.decorationsService.onDidChangeDecorations(() => {
            this.fireDidChangeDecorations((tree) => this.collectDecorator(tree));
        });
    }
    async decorations(tree) {
        return this.collectDecorator(tree);
    }
    collectDecorator(tree) {
        const result = new Map();
        if (tree.root === undefined) {
            return result;
        }
        for (const node of new browser_1.DepthFirstTreeIterator(tree.root)) {
            if (browser_2.FileStatNode.is(node) && node.fileStat.isSymbolicLink) {
                const decorations = {
                    tailDecorations: [{ data: '⤷', tooltip: core_1.nls.localizeByDefault('Symbolic Link') }]
                };
                result.set(node.id, decorations);
            }
        }
        return result;
    }
    get onDidChangeDecorations() {
        return this.onDidChangeDecorationsEmitter.event;
    }
    fireDidChangeDecorations(event) {
        this.onDidChangeDecorationsEmitter.fire(event);
    }
};
__decorate([
    (0, inversify_1.inject)(decorations_service_1.DecorationsService),
    __metadata("design:type", Object)
], NavigatorSymlinkDecorator.prototype, "decorationsService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NavigatorSymlinkDecorator.prototype, "init", null);
NavigatorSymlinkDecorator = __decorate([
    (0, inversify_1.injectable)()
], NavigatorSymlinkDecorator);
exports.NavigatorSymlinkDecorator = NavigatorSymlinkDecorator;
//# sourceMappingURL=navigator-symlink-decorator.js.map