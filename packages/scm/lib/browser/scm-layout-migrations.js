"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.ScmLayoutVersion5Migration = exports.ScmLayoutVersion3Migration = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const scm_contribution_1 = require("./scm-contribution");
let ScmLayoutVersion3Migration = class ScmLayoutVersion3Migration {
    constructor() {
        this.layoutVersion = 3.0;
    }
    onWillInflateWidget(desc, { parent }) {
        if (desc.constructionOptions.factoryId === 'scm' && !parent) {
            return {
                constructionOptions: {
                    factoryId: scm_contribution_1.SCM_VIEW_CONTAINER_ID
                },
                innerWidgetState: {
                    parts: [
                        {
                            widget: {
                                constructionOptions: {
                                    factoryId: scm_contribution_1.SCM_WIDGET_FACTORY_ID
                                },
                                innerWidgetState: desc.innerWidgetState
                            },
                            partId: {
                                factoryId: scm_contribution_1.SCM_WIDGET_FACTORY_ID
                            },
                            collapsed: false,
                            hidden: false
                        }
                    ],
                    title: scm_contribution_1.SCM_VIEW_CONTAINER_TITLE_OPTIONS
                }
            };
        }
        return undefined;
    }
};
ScmLayoutVersion3Migration = __decorate([
    (0, inversify_1.injectable)()
], ScmLayoutVersion3Migration);
exports.ScmLayoutVersion3Migration = ScmLayoutVersion3Migration;
let ScmLayoutVersion5Migration = class ScmLayoutVersion5Migration {
    constructor() {
        this.layoutVersion = 5.0;
    }
    onWillInflateWidget(desc) {
        if (desc.constructionOptions.factoryId === scm_contribution_1.SCM_VIEW_CONTAINER_ID && typeof desc.innerWidgetState === 'string') {
            desc.innerWidgetState = desc.innerWidgetState.replace(/scm-tab-icon/g, scm_contribution_1.SCM_VIEW_CONTAINER_TITLE_OPTIONS.iconClass);
            return desc;
        }
        return undefined;
    }
};
ScmLayoutVersion5Migration = __decorate([
    (0, inversify_1.injectable)()
], ScmLayoutVersion5Migration);
exports.ScmLayoutVersion5Migration = ScmLayoutVersion5Migration;
//# sourceMappingURL=scm-layout-migrations.js.map