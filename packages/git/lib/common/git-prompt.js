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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GitPrompt_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitPromptServerImpl = exports.GitPromptClient = exports.GitPrompt = exports.GitPromptServerProxy = exports.GitPromptServer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const disposable_1 = require("@theia/core/lib/common/disposable");
exports.GitPromptServer = Symbol('GitPromptServer');
exports.GitPromptServerProxy = Symbol('GitPromptServerProxy');
let GitPrompt = GitPrompt_1 = class GitPrompt {
    constructor() {
        this.toDispose = new disposable_1.DisposableCollection();
    }
    init() {
        this.server.setClient(this);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async ask(question) {
        return GitPrompt_1.Failure.create('Interactive Git prompt is not supported in the browser.');
    }
};
__decorate([
    (0, inversify_1.inject)(exports.GitPromptServer),
    __metadata("design:type", Object)
], GitPrompt.prototype, "server", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitPrompt.prototype, "init", null);
GitPrompt = GitPrompt_1 = __decorate([
    (0, inversify_1.injectable)()
], GitPrompt);
exports.GitPrompt = GitPrompt;
(function (GitPrompt) {
    /**
     * Unique WS endpoint path for the Git prompt service.
     */
    GitPrompt.WS_PATH = 'services/git-prompt';
    let Success;
    (function (Success) {
        function is(answer) {
            return answer.type === Answer.Type.SUCCESS
                && 'result' in answer
                && ((typeof answer.result) === 'string' || (typeof answer.result) === 'boolean');
        }
        Success.is = is;
        function create(result) {
            return {
                type: Answer.Type.SUCCESS,
                result
            };
        }
        Success.create = create;
    })(Success = GitPrompt.Success || (GitPrompt.Success = {}));
    let Cancel;
    (function (Cancel) {
        function is(answer) {
            return answer.type === Answer.Type.CANCEL;
        }
        Cancel.is = is;
        function create() {
            return {
                type: Answer.Type.CANCEL
            };
        }
        Cancel.create = create;
    })(Cancel = GitPrompt.Cancel || (GitPrompt.Cancel = {}));
    let Failure;
    (function (Failure) {
        function is(answer) {
            return answer.type === Answer.Type.FAILURE
                && 'error' in answer
                && ((typeof answer.error) === 'string' || answer.error instanceof Error);
        }
        Failure.is = is;
        function create(error) {
            return {
                type: Answer.Type.FAILURE,
                error
            };
        }
        Failure.create = create;
    })(Failure = GitPrompt.Failure || (GitPrompt.Failure = {}));
    let Answer;
    (function (Answer) {
        let Type;
        (function (Type) {
            Type[Type["SUCCESS"] = 0] = "SUCCESS";
            Type[Type["CANCEL"] = 1] = "CANCEL";
            Type[Type["FAILURE"] = 2] = "FAILURE";
        })(Type = Answer.Type || (Answer.Type = {}));
    })(Answer = GitPrompt.Answer || (GitPrompt.Answer = {}));
})(GitPrompt = exports.GitPrompt || (exports.GitPrompt = {}));
exports.GitPrompt = GitPrompt;
exports.GitPromptClient = Symbol('GitPromptClient');
/**
 * Note: This implementation is not reconnecting.
 * Git prompting is not supported in the browser. In electron, there's no need to reconnect.
 */
let GitPromptServerImpl = class GitPromptServerImpl {
    setClient(client) {
        this.proxy.setClient(client);
    }
    dispose() {
        this.proxy.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(exports.GitPromptServerProxy),
    __metadata("design:type", Object)
], GitPromptServerImpl.prototype, "proxy", void 0);
GitPromptServerImpl = __decorate([
    (0, inversify_1.injectable)()
], GitPromptServerImpl);
exports.GitPromptServerImpl = GitPromptServerImpl;
//# sourceMappingURL=git-prompt.js.map