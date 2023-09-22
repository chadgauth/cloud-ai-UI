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
exports.ViewColumnService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const application_shell_1 = require("@theia/core/lib/browser/shell/application-shell");
const algorithm_1 = require("@theia/core/shared/@phosphor/algorithm");
let ViewColumnService = class ViewColumnService {
    constructor(shell) {
        this.shell = shell;
        this.columnValues = new Map();
        this.viewColumnIds = new Map();
        this.onViewColumnChangedEmitter = new event_1.Emitter();
        let oldColumnValues = new Map();
        const update = async () => {
            await new Promise((resolve => setTimeout(resolve)));
            this.updateViewColumns();
            this.viewColumnIds.forEach((ids, viewColumn) => {
                ids.forEach((id) => {
                    if (!oldColumnValues.has(id) || oldColumnValues.get(id) !== viewColumn) {
                        this.onViewColumnChangedEmitter.fire({ id, viewColumn });
                    }
                });
            });
            oldColumnValues = new Map(this.columnValues.entries());
        };
        this.shell.mainPanel.widgetAdded.connect(() => update());
        this.shell.mainPanel.widgetRemoved.connect(() => update());
    }
    get onViewColumnChanged() {
        return this.onViewColumnChangedEmitter.event;
    }
    updateViewColumns() {
        this.columnValues.clear();
        this.viewColumnIds.clear();
        const rows = new Map();
        const columns = new Map();
        for (const tabBar of (0, algorithm_1.toArray)(this.shell.mainPanel.tabBars())) {
            if (!tabBar.node.style.top || !tabBar.node.style.left) {
                continue;
            }
            const top = parseInt(tabBar.node.style.top);
            const left = parseInt(tabBar.node.style.left);
            const row = rows.get(top) || new Set();
            row.add(left);
            rows.set(top, row);
            const column = columns.get(left) || new Map();
            column.set(top, tabBar);
            columns.set(left, column);
        }
        const firstRow = rows.get([...rows.keys()].sort()[0]);
        if (!firstRow) {
            return;
        }
        const lefts = [...firstRow.keys()].sort();
        for (let i = 0; i < lefts.length; i++) {
            const column = columns.get(lefts[i]);
            if (!column) {
                break;
            }
            const cellIndexes = [...column.keys()].sort();
            let viewColumn = Math.min(i, 2);
            for (let j = 0; j < cellIndexes.length; j++) {
                const cell = column.get(cellIndexes[j]);
                if (!cell) {
                    break;
                }
                this.setViewColumn(cell, viewColumn);
                if (viewColumn < 7) {
                    viewColumn += 3;
                }
            }
        }
    }
    setViewColumn(tabBar, viewColumn) {
        const ids = [];
        for (const title of tabBar.titles) {
            const id = title.owner.id;
            ids.push(id);
            this.columnValues.set(id, viewColumn);
        }
        this.viewColumnIds.set(viewColumn, ids);
    }
    getViewColumnIds(viewColumn) {
        return this.viewColumnIds.get(viewColumn) || [];
    }
    getViewColumn(id) {
        return this.columnValues.get(id);
    }
    hasViewColumn(id) {
        return this.columnValues.has(id);
    }
    viewColumnsSize() {
        return this.viewColumnIds.size;
    }
};
ViewColumnService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(application_shell_1.ApplicationShell)),
    __metadata("design:paramtypes", [application_shell_1.ApplicationShell])
], ViewColumnService);
exports.ViewColumnService = ViewColumnService;
//# sourceMappingURL=view-column-service.js.map