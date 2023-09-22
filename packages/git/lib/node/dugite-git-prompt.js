"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.DugiteGitPromptServer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const git_prompt_1 = require("../common/git-prompt");
let DugiteGitPromptServer = class DugiteGitPromptServer {
    dispose() {
    }
    setClient(client) {
        this.client = client;
    }
    async ask(question) {
        if (this.client) {
            return this.client.ask(question);
        }
        return git_prompt_1.GitPrompt.Failure.create('Not yet available.');
    }
};
DugiteGitPromptServer = __decorate([
    (0, inversify_1.injectable)()
], DugiteGitPromptServer);
exports.DugiteGitPromptServer = DugiteGitPromptServer;
//# sourceMappingURL=dugite-git-prompt.js.map