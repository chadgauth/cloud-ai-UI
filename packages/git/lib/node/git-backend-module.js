"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindPrompt = exports.bindRepositoryWatcher = exports.bindGit = exports.GitBindingOptions = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const git_1 = require("../common/git");
const git_watcher_1 = require("../common/git-watcher");
const dugite_git_1 = require("./dugite-git");
const dugite_git_watcher_1 = require("./dugite-git-watcher");
const common_1 = require("@theia/core/lib/common");
const git_repository_manager_1 = require("./git-repository-manager");
const git_repository_watcher_1 = require("./git-repository-watcher");
const git_locator_protocol_1 = require("./git-locator/git-locator-protocol");
const git_locator_client_1 = require("./git-locator/git-locator-client");
const git_locator_impl_1 = require("./git-locator/git-locator-impl");
const git_exec_provider_1 = require("./git-exec-provider");
const git_prompt_1 = require("../common/git-prompt");
const dugite_git_prompt_1 = require("./dugite-git-prompt");
const connection_container_module_1 = require("@theia/core/lib/node/messaging/connection-container-module");
const git_init_1 = require("./init/git-init");
const SINGLE_THREADED = process.argv.indexOf('--no-cluster') !== -1;
var GitBindingOptions;
(function (GitBindingOptions) {
    GitBindingOptions.Default = {
        bindManager(binding) {
            return binding.to(git_repository_manager_1.GitRepositoryManager).inSingletonScope();
        }
    };
})(GitBindingOptions = exports.GitBindingOptions || (exports.GitBindingOptions = {}));
function bindGit(bind, bindingOptions = GitBindingOptions.Default) {
    bindingOptions.bindManager(bind(git_repository_manager_1.GitRepositoryManager));
    bind(git_repository_watcher_1.GitRepositoryWatcherFactory).toFactory(ctx => (options) => {
        // GitRepositoryWatcherFactory is injected into the singleton GitRepositoryManager only.
        // GitRepositoryWatcher instances created there should be able to access the (singleton) Git.
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        child.bind(git_repository_watcher_1.GitRepositoryWatcher).toSelf();
        child.bind(git_repository_watcher_1.GitRepositoryWatcherOptions).toConstantValue(options);
        return child.get(git_repository_watcher_1.GitRepositoryWatcher);
    });
    if (SINGLE_THREADED) {
        bind(git_locator_protocol_1.GitLocator).toDynamicValue(ctx => {
            const logger = ctx.container.get(common_1.ILogger);
            return new git_locator_impl_1.GitLocatorImpl({
                info: (message, ...args) => logger.info(message, ...args),
                error: (message, ...args) => logger.error(message, ...args)
            });
        });
    }
    else {
        bind(git_locator_protocol_1.GitLocator).to(git_locator_client_1.GitLocatorClient);
    }
    bind(dugite_git_1.OutputParser).toSelf().inSingletonScope();
    bind(dugite_git_1.NameStatusParser).toSelf().inSingletonScope();
    bind(dugite_git_1.CommitDetailsParser).toSelf().inSingletonScope();
    bind(dugite_git_1.GitBlameParser).toSelf().inSingletonScope();
    bind(git_exec_provider_1.GitExecProvider).toSelf().inSingletonScope();
    bind(dugite_git_1.DugiteGit).toSelf().inSingletonScope();
    bind(git_1.Git).toService(dugite_git_1.DugiteGit);
    bind(git_init_1.DefaultGitInit).toSelf();
    bind(git_init_1.GitInit).toService(git_init_1.DefaultGitInit);
    bind(connection_container_module_1.ConnectionContainerModule).toConstantValue(gitConnectionModule);
}
exports.bindGit = bindGit;
const gitConnectionModule = connection_container_module_1.ConnectionContainerModule.create(({ bind, bindBackendService }) => {
    // DugiteGit is bound in singleton scope; each connection should use a proxy for that.
    const GitProxy = Symbol('GitProxy');
    bind(GitProxy).toDynamicValue(ctx => new Proxy(ctx.container.get(dugite_git_1.DugiteGit), {}));
    bindBackendService(git_1.GitPath, GitProxy);
});
function bindRepositoryWatcher(bind) {
    bind(dugite_git_watcher_1.DugiteGitWatcherServer).toSelf();
    bind(git_watcher_1.GitWatcherServer).toService(dugite_git_watcher_1.DugiteGitWatcherServer);
}
exports.bindRepositoryWatcher = bindRepositoryWatcher;
function bindPrompt(bind) {
    bind(dugite_git_prompt_1.DugiteGitPromptServer).toSelf().inSingletonScope();
    bind(git_prompt_1.GitPromptServer).toDynamicValue(context => context.container.get(dugite_git_prompt_1.DugiteGitPromptServer));
}
exports.bindPrompt = bindPrompt;
exports.default = new inversify_1.ContainerModule(bind => {
    bindGit(bind);
    bindRepositoryWatcher(bind);
    bind(common_1.ConnectionHandler).toDynamicValue(context => new common_1.RpcConnectionHandler(git_watcher_1.GitWatcherPath, client => {
        const server = context.container.get(git_watcher_1.GitWatcherServer);
        server.setClient(client);
        client.onDidCloseConnection(() => server.dispose());
        return server;
    })).inSingletonScope();
    bindPrompt(bind);
    bind(common_1.ConnectionHandler).toDynamicValue(context => new common_1.RpcConnectionHandler(git_prompt_1.GitPrompt.WS_PATH, client => {
        const server = context.container.get(git_prompt_1.GitPromptServer);
        server.setClient(client);
        client.onDidCloseConnection(() => server.dispose());
        return server;
    })).inSingletonScope();
});
//# sourceMappingURL=git-backend-module.js.map