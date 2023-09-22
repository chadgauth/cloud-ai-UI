"use strict";
// *****************************************************************************
// Copyright (C) 2022 Toro Cloud Pty Ltd and others.
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
const jsdom_1 = require("@theia/core/lib/browser/test/jsdom");
let disableJSDOM = (0, jsdom_1.enableJSDOM)();
const frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
frontend_application_config_provider_1.FrontendApplicationConfigProvider.set({});
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const node_1 = require("@theia/core/lib/node");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_2 = require("@theia/editor/lib/browser");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const scm_input_1 = require("@theia/scm/lib/browser/scm-input");
const chai_1 = require("chai");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const rimraf = require("rimraf");
const sinon = require("sinon");
const common_1 = require("../common");
const dugite_git_1 = require("../node/dugite-git");
const git_env_provider_1 = require("../node/env/git-env-provider");
const git_backend_module_1 = require("../node/git-backend-module");
const git_repository_watcher_1 = require("../node/git-repository-watcher");
const git_error_handler_1 = require("./git-error-handler");
const git_preferences_1 = require("./git-preferences");
const git_scm_provider_1 = require("./git-scm-provider");
disableJSDOM();
describe('GitScmProvider', () => {
    let testContainer;
    let mockEditorManager;
    let mockGitErrorHandler;
    let mockFileService;
    let git;
    let mockCommandService;
    let mockLabelProvider;
    let gitScmProvider;
    const repository = {
        localUri: node_1.FileUri.create(path.join(os.tmpdir(), 'GitScmProvider.test', 'repoA')).toString()
    };
    before(() => {
        disableJSDOM = (0, jsdom_1.enableJSDOM)();
    });
    after(async () => {
        disableJSDOM();
    });
    beforeEach(async () => {
        mockEditorManager = sinon.createStubInstance(browser_2.EditorManager);
        mockGitErrorHandler = sinon.createStubInstance(git_error_handler_1.GitErrorHandler);
        mockFileService = sinon.createStubInstance(file_service_1.FileService);
        git = sinon.createStubInstance(dugite_git_1.DugiteGit);
        mockCommandService = {};
        mockLabelProvider = sinon.createStubInstance(browser_1.LabelProvider);
        testContainer = new inversify_1.Container();
        testContainer.bind(browser_2.EditorManager).toConstantValue(mockEditorManager);
        testContainer.bind(git_error_handler_1.GitErrorHandler).toConstantValue(mockGitErrorHandler);
        testContainer.bind(file_service_1.FileService).toConstantValue(mockFileService);
        testContainer.bind(core_1.ILogger).toConstantValue(console);
        testContainer.bind(git_env_provider_1.GitEnvProvider).to(git_env_provider_1.DefaultGitEnvProvider);
        (0, git_backend_module_1.bindGit)(testContainer.bind.bind(testContainer));
        // We have to mock the watcher because it runs after the afterEach
        // which removes the git repository, causing an error in the watcher
        // which tries to get the git repo status.
        testContainer.rebind(git_repository_watcher_1.GitRepositoryWatcherFactory).toConstantValue(() => {
            const mockWatcher = sinon.createStubInstance(git_repository_watcher_1.GitRepositoryWatcher);
            mockWatcher.sync.resolves();
            return mockWatcher;
        });
        testContainer.bind(core_1.MessageService).toConstantValue(sinon.createStubInstance(core_1.MessageService));
        testContainer.bind(core_1.CommandService).toConstantValue(mockCommandService);
        testContainer.bind(browser_1.LabelProvider).toConstantValue(mockLabelProvider);
        testContainer.bind(git_preferences_1.GitPreferences).toConstantValue({ onPreferenceChanged: () => core_1.Disposable.NULL });
        testContainer.bind(git_scm_provider_1.GitScmProviderOptions).toConstantValue({
            repository
        });
        testContainer.bind(git_scm_provider_1.GitScmProvider).toSelf();
        gitScmProvider = testContainer.get(git_scm_provider_1.GitScmProvider);
        gitScmProvider.input = sinon.createStubInstance(scm_input_1.ScmInput);
        git = testContainer.get(common_1.Git);
        await fs.mkdirp(node_1.FileUri.fsPath(repository.localUri));
        await git.exec(repository, ['init']);
    });
    afterEach(async () => {
        await new Promise((resolve, reject) => rimraf(node_1.FileUri.fsPath(repository.localUri), error => {
            if (error) {
                reject(error);
            }
            resolve();
        }));
    });
    it('should unstage all the changes', async () => {
        const uris = [
            repository.localUri + '/test1.txt',
            repository.localUri + '/test2.txt'
        ];
        await Promise.all(uris.map(uri => fs.createFile(node_1.FileUri.fsPath(uri))));
        await git.add(repository, uris);
        gitScmProvider.setStatus({
            changes: uris.map(uri => ({
                status: common_1.GitFileStatus.New,
                uri,
                staged: true
            })),
            exists: true
        });
        (0, chai_1.expect)(gitScmProvider.stagedChanges.length).to.eq(2);
        await gitScmProvider.unstageAll();
        const status = await git.status(repository);
        (0, chai_1.expect)(status.changes.filter(change => change.staged).length).to.eq(0);
        (0, chai_1.expect)(status.changes.filter(change => !change.staged).length).to.eq(2);
    });
});
//# sourceMappingURL=git-scm-provider.spec.js.map