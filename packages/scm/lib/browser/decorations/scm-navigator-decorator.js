"use strict";
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScmNavigatorDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const logger_1 = require("@theia/core/lib/common/logger");
const event_1 = require("@theia/core/lib/common/event");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/filesystem/lib/browser");
const uri_1 = require("@theia/core/lib/common/uri");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
const decorations_service_1 = require("@theia/core/lib/browser/decorations-service");
/**
 * @deprecated since 1.25.0
 * URI-based decorators should implement `DecorationsProvider` and contribute decorations via the `DecorationsService`.
 */
let ScmNavigatorDecorator = class ScmNavigatorDecorator {
    constructor(decorationsService) {
        this.decorationsService = decorationsService;
        this.id = 'theia-scm-decorator';
        this.emitter = new event_1.Emitter();
        this.decorationsService.onDidChangeDecorations(data => {
            this.decorationsMap = data;
            this.fireDidChangeDecorations((tree) => this.collectDecorators(tree));
        });
    }
    collectDecorators(tree) {
        const result = new Map();
        if (tree.root === undefined || !this.decorationsMap) {
            return result;
        }
        const markers = this.appendContainerChanges(this.decorationsMap);
        for (const treeNode of new browser_1.DepthFirstTreeIterator(tree.root)) {
            const uri = browser_2.FileStatNode.getUri(treeNode);
            if (uri) {
                const marker = markers.get(uri);
                if (marker) {
                    result.set(treeNode.id, marker);
                }
            }
        }
        return new Map(Array.from(result.entries()).map(m => [m[0], this.toDecorator(m[1])]));
    }
    toDecorator(change) {
        const colorVariable = change.colorId && this.colors.toCssVariableName(change.colorId);
        return {
            tailDecorations: [
                {
                    data: change.letter ? change.letter : '',
                    fontData: {
                        color: colorVariable && `var(${colorVariable})`
                    },
                    tooltip: change.tooltip ? change.tooltip : ''
                }
            ]
        };
    }
    async decorations(tree) {
        if (this.decorationsMap) {
            return this.collectDecorators(tree);
        }
        else {
            return new Map();
        }
    }
    appendContainerChanges(decorationsMap) {
        const result = new Map();
        for (const [uri, data] of decorationsMap.entries()) {
            const uriString = uri.toString();
            result.set(uriString, data);
            let parentUri = new uri_1.default(uri).parent;
            while (parentUri && !parentUri.path.isRoot) {
                const parentUriString = parentUri.toString();
                const existing = result.get(parentUriString);
                if (existing === undefined) {
                    result.set(parentUriString, data);
                    parentUri = parentUri.parent;
                }
                else {
                    parentUri = undefined;
                }
            }
        }
        return result;
    }
    get onDidChangeDecorations() {
        return this.emitter.event;
    }
    fireDidChangeDecorations(event) {
        this.emitter.fire(event);
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], ScmNavigatorDecorator.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], ScmNavigatorDecorator.prototype, "colors", void 0);
ScmNavigatorDecorator = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(decorations_service_1.DecorationsService)),
    __metadata("design:paramtypes", [Object])
], ScmNavigatorDecorator);
exports.ScmNavigatorDecorator = ScmNavigatorDecorator;
//# sourceMappingURL=scm-navigator-decorator.js.map