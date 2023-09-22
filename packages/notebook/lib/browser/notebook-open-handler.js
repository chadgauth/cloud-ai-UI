"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.NotebookOpenHandler = void 0;
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const notebook_type_registry_1 = require("./notebook-type-registry");
const glob_1 = require("@theia/core/lib/common/glob");
let NotebookOpenHandler = class NotebookOpenHandler extends browser_1.NavigatableWidgetOpenHandler {
    constructor(notebookTypeRegistry) {
        super();
        this.notebookTypeRegistry = notebookTypeRegistry;
        this.id = 'notebook';
    }
    canHandle(uri, options) {
        const priorities = this.notebookTypeRegistry.notebookTypes
            .filter(notebook => notebook.selector && this.matches(notebook.selector, uri))
            .map(notebook => this.calculatePriority(notebook));
        return Math.max(...priorities);
    }
    findHighestPriorityType(uri) {
        const matchingTypes = this.notebookTypeRegistry.notebookTypes
            .filter(notebookType => notebookType.selector && this.matches(notebookType.selector, uri))
            .map(notebookType => ({ descriptor: notebookType, priority: this.calculatePriority(notebookType) }));
        if (matchingTypes.length === 0) {
            return undefined;
        }
        let type = matchingTypes[0];
        for (let i = 1; i < matchingTypes.length; i++) {
            const notebookType = matchingTypes[i];
            if (notebookType.priority > type.priority) {
                type = notebookType;
            }
        }
        return type.descriptor;
    }
    calculatePriority(notebookType) {
        if (!notebookType) {
            return -1;
        }
        return notebookType.priority === 'option' ? 100 : 200;
    }
    createWidgetOptions(uri, options) {
        const widgetOptions = super.createWidgetOptions(uri, options);
        const notebookType = this.findHighestPriorityType(uri);
        if (!notebookType) {
            throw new Error('No notebook types registered for uri: ' + uri.toString());
        }
        return {
            notebookType: notebookType.type,
            ...widgetOptions
        };
    }
    matches(selectors, resource) {
        return selectors.some(selector => this.selectorMatches(selector, resource));
    }
    selectorMatches(selector, resource) {
        return !!selector.filenamePattern
            && (0, glob_1.match)(selector.filenamePattern, resource.path.name + resource.path.ext);
    }
};
NotebookOpenHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(notebook_type_registry_1.NotebookTypeRegistry)),
    __metadata("design:paramtypes", [notebook_type_registry_1.NotebookTypeRegistry])
], NotebookOpenHandler);
exports.NotebookOpenHandler = NotebookOpenHandler;
//# sourceMappingURL=notebook-open-handler.js.map