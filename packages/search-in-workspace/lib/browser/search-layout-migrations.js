"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.SearchLayoutVersion3Migration = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const search_in_workspace_widget_1 = require("./search-in-workspace-widget");
const search_in_workspace_factory_1 = require("./search-in-workspace-factory");
let SearchLayoutVersion3Migration = class SearchLayoutVersion3Migration {
    constructor() {
        this.layoutVersion = 6.0;
    }
    onWillInflateWidget(desc, { parent }) {
        if (desc.constructionOptions.factoryId === search_in_workspace_widget_1.SearchInWorkspaceWidget.ID && !parent) {
            return {
                constructionOptions: {
                    factoryId: search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID
                },
                innerWidgetState: {
                    parts: [
                        {
                            widget: {
                                constructionOptions: {
                                    factoryId: search_in_workspace_widget_1.SearchInWorkspaceWidget.ID
                                },
                                innerWidgetState: desc.innerWidgetState
                            },
                            partId: {
                                factoryId: search_in_workspace_widget_1.SearchInWorkspaceWidget.ID
                            },
                            collapsed: false,
                            hidden: false
                        }
                    ],
                    title: search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_TITLE_OPTIONS
                }
            };
        }
        return undefined;
    }
};
SearchLayoutVersion3Migration = __decorate([
    (0, inversify_1.injectable)()
], SearchLayoutVersion3Migration);
exports.SearchLayoutVersion3Migration = SearchLayoutVersion3Migration;
//# sourceMappingURL=search-layout-migrations.js.map