"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("../common");
const dugite_git_1 = require("../node/dugite-git");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const files_1 = require("@theia/filesystem/lib/common/files");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const git_repository_provider_1 = require("./git-repository-provider");
const sinon = require("sinon");
const chai = require("chai");
const git_commit_message_validator_1 = require("./git-commit-message-validator");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const scm_context_key_service_1 = require("@theia/scm/lib/browser/scm-context-key-service");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const git_scm_provider_1 = require("./git-scm-provider");
const git_frontend_module_1 = require("./git-frontend-module");
const browser_2 = require("@theia/editor/lib/browser");
const git_error_handler_1 = require("./git-error-handler");
const git_preferences_1 = require("./git-preferences");
const git_repository_tracker_1 = require("./git-repository-tracker");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const expect = chai.expect;
disableJSDOM();
const folderA = files_1.FileStat.dir('file:///home/repoA');
const repoA1 = {
    localUri: `${folderA.resource.toString()}/1`
};
const repoA2 = {
    localUri: `${folderA.resource.toString()}/2`
};
const folderB = files_1.FileStat.dir('file:///home/repoB');
const repoB = {
    localUri: folderB.resource.toString()
};
/* eslint-disable @typescript-eslint/no-explicit-any */
describe('GitRepositoryProvider', () => {
    let testContainer;
    let mockGit;
    let mockWorkspaceService;
    let mockFilesystem;
    let mockStorageService;
    let mockGitRepositoryTracker;
    let gitRepositoryProvider;
    const mockRootChangeEmitter = new core_1.Emitter();
    const mockFileChangeEmitter = new core_1.Emitter();
    before(() => {
        disableJSDOM = (0, jsdom_1.enableJSDOM)();
    });
    after(() => {
        disableJSDOM();
    });
    beforeEach(() => {
        mockGit = sinon.createStubInstance(dugite_git_1.DugiteGit);
        mockWorkspaceService = sinon.createStubInstance(workspace_service_1.WorkspaceService);
        mockFilesystem = sinon.createStubInstance(file_service_1.FileService);
        mockStorageService = sinon.createStubInstance(browser_1.LocalStorageService);
        mockGitRepositoryTracker = sinon.createStubInstance(git_repository_tracker_1.GitRepositoryTracker);
        testContainer = new inversify_1.Container();
        testContainer.bind(git_repository_provider_1.GitRepositoryProvider).toSelf().inSingletonScope();
        testContainer.bind(common_1.Git).toConstantValue(mockGit);
        testContainer.bind(workspace_service_1.WorkspaceService).toConstantValue(mockWorkspaceService);
        testContainer.bind(file_service_1.FileService).toConstantValue(mockFilesystem);
        testContainer.bind(browser_1.StorageService).toConstantValue(mockStorageService);
        testContainer.bind(scm_service_1.ScmService).toSelf().inSingletonScope();
        testContainer.bind(git_scm_provider_1.GitScmProvider.Factory).toFactory(git_frontend_module_1.createGitScmProviderFactory);
        testContainer.bind(scm_context_key_service_1.ScmContextKeyService).toSelf().inSingletonScope();
        testContainer.bind(context_key_service_1.ContextKeyService).to(context_key_service_1.ContextKeyServiceDummyImpl).inSingletonScope();
        testContainer.bind(git_commit_message_validator_1.GitCommitMessageValidator).toSelf().inSingletonScope();
        testContainer.bind(browser_2.EditorManager).toConstantValue({});
        testContainer.bind(git_error_handler_1.GitErrorHandler).toConstantValue({});
        testContainer.bind(core_1.CommandService).toConstantValue({});
        testContainer.bind(browser_1.LabelProvider).toConstantValue({});
        testContainer.bind(git_preferences_1.GitPreferences).toConstantValue({ onPreferenceChanged: () => core_1.Disposable.NULL });
        testContainer.bind(git_repository_tracker_1.GitRepositoryTracker).toConstantValue(mockGitRepositoryTracker);
        sinon.stub(mockWorkspaceService, 'onWorkspaceChanged').value(mockRootChangeEmitter.event);
        sinon.stub(mockFilesystem, 'onDidFilesChange').value(mockFileChangeEmitter.event);
    });
    it('should adds all existing git repo(s) on theia loads', async () => {
        const allRepos = [repoA1, repoA2];
        const roots = [folderA];
        mockStorageService.getData.withArgs('theia-git-selected-repository').resolves(allRepos[0]);
        mockStorageService.getData.withArgs('theia-git-all-repositories').resolves(allRepos);
        sinon.stub(mockWorkspaceService, 'roots').value(Promise.resolve(roots));
        mockWorkspaceService.tryGetRoots.returns(roots);
        gitRepositoryProvider = testContainer.get(git_repository_provider_1.GitRepositoryProvider);
        mockFilesystem.exists.resolves(true);
        mockGit.repositories.withArgs(folderA.resource.toString(), {}).resolves(allRepos);
        await gitRepositoryProvider['doInit']();
        expect(gitRepositoryProvider.allRepositories.length).to.eq(allRepos.length);
        expect(gitRepositoryProvider.allRepositories[0].localUri).to.eq(allRepos[0].localUri);
        expect(gitRepositoryProvider.allRepositories[1].localUri).to.eq(allRepos[1].localUri);
        expect(gitRepositoryProvider.selectedRepository && gitRepositoryProvider.selectedRepository.localUri).to.eq(allRepos[0].localUri);
    });
    // tslint:disable-next-line:no-void-expression
    it.skip('should refresh git repo(s) on receiving a root change event from WorkspaceService', done => {
        const allReposA = [repoA1, repoA2];
        const oldRoots = [folderA];
        const allReposB = [repoB];
        mockStorageService.getData.withArgs('theia-git-selected-repository').resolves(allReposA[0]);
        mockStorageService.getData.withArgs('theia-git-all-repositories').resolves(allReposA);
        sinon.stub(mockWorkspaceService, 'roots').resolves(oldRoots);
        const stubWsRoots = mockWorkspaceService.tryGetRoots;
        stubWsRoots.returns(oldRoots);
        gitRepositoryProvider = testContainer.get(git_repository_provider_1.GitRepositoryProvider);
        mockFilesystem.exists.resolves(true);
        mockGit.repositories.withArgs(folderA.resource.toString(), {}).resolves(allReposA);
        mockGit.repositories.withArgs(folderB.resource.toString(), {}).resolves(allReposB);
        let counter = 0;
        gitRepositoryProvider.onDidChangeRepository(selected => {
            counter++;
            if (counter === 3) {
                expect(gitRepositoryProvider.allRepositories.length).to.eq(allReposA.concat(allReposB).length);
                expect(gitRepositoryProvider.allRepositories[0].localUri).to.eq(allReposA[0].localUri);
                expect(gitRepositoryProvider.allRepositories[1].localUri).to.eq(allReposA[1].localUri);
                expect(gitRepositoryProvider.allRepositories[2].localUri).to.eq(allReposB[0].localUri);
                expect(selected && selected.localUri).to.eq(allReposA[0].localUri);
                done();
            }
        });
        gitRepositoryProvider['doInit']().then(() => {
            const newRoots = [folderA, folderB];
            stubWsRoots.returns(newRoots);
            sinon.stub(mockWorkspaceService, 'roots').resolves(newRoots);
            mockRootChangeEmitter.fire(newRoots);
        }).catch(e => done(new Error('gitRepositoryProvider.initialize() throws an error')));
    });
    // tslint:disable-next-line:no-void-expression
    it.skip('should refresh git repo(s) on receiving a file system change event', done => {
        const allReposA = [repoA1, repoA2];
        const oldRoots = [folderA];
        const allReposB = [repoB];
        const newRoots = [folderA, folderB];
        mockStorageService.getData.withArgs('theia-git-selected-repository').resolves(allReposA[0]);
        mockStorageService.getData.withArgs('theia-git-all-repositories').resolves(allReposA);
        sinon.stub(mockWorkspaceService, 'roots').onCall(0).resolves(oldRoots);
        sinon.stub(mockWorkspaceService, 'roots').onCall(1).resolves(oldRoots);
        sinon.stub(mockWorkspaceService, 'roots').onCall(2).resolves(newRoots);
        const stubWsRoots = mockWorkspaceService.tryGetRoots;
        stubWsRoots.onCall(0).returns(oldRoots);
        stubWsRoots.onCall(1).returns(oldRoots);
        stubWsRoots.onCall(2).returns(newRoots);
        gitRepositoryProvider = testContainer.get(git_repository_provider_1.GitRepositoryProvider);
        mockFilesystem.exists.resolves(true);
        mockGit.repositories.withArgs(folderA.resource.toString(), {}).resolves(allReposA);
        mockGit.repositories.withArgs(folderB.resource.toString(), {}).resolves(allReposB);
        let counter = 0;
        gitRepositoryProvider.onDidChangeRepository(selected => {
            counter++;
            if (counter === 3) {
                expect(gitRepositoryProvider.allRepositories.length).to.eq(allReposA.concat(allReposB).length);
                expect(gitRepositoryProvider.allRepositories[0].localUri).to.eq(allReposA[0].localUri);
                expect(gitRepositoryProvider.allRepositories[1].localUri).to.eq(allReposA[1].localUri);
                expect(gitRepositoryProvider.allRepositories[2].localUri).to.eq(allReposB[0].localUri);
                expect(selected && selected.localUri).to.eq(allReposA[0].localUri);
                done();
            }
        });
        gitRepositoryProvider['doInit']().then(() => mockFileChangeEmitter.fire(new files_1.FileChangesEvent([]))).catch(e => done(new Error('gitRepositoryProvider.initialize() throws an error')));
    });
    // tslint:disable-next-line:no-void-expression
    it.skip('should ignore the invalid or nonexistent root(s)', async () => {
        const allReposA = [repoA1, repoA2];
        const roots = [folderA, folderB];
        mockStorageService.getData.withArgs('theia-git-selected-repository').resolves(allReposA[0]);
        mockStorageService.getData.withArgs('theia-git-all-repositories').resolves(allReposA);
        sinon.stub(mockWorkspaceService, 'roots').value(Promise.resolve(roots));
        mockWorkspaceService.tryGetRoots.returns(roots);
        gitRepositoryProvider = testContainer.get(git_repository_provider_1.GitRepositoryProvider);
        mockFilesystem.exists.withArgs(folderA.resource.toString()).resolves(true); // folderA exists
        mockFilesystem.exists.withArgs(folderB.resource.toString()).resolves(false); // folderB does not exist
        mockGit.repositories.withArgs(folderA.resource.toString(), {}).resolves(allReposA);
        await gitRepositoryProvider['doInit']();
        expect(gitRepositoryProvider.allRepositories.length).to.eq(allReposA.length);
        expect(gitRepositoryProvider.allRepositories[0].localUri).to.eq(allReposA[0].localUri);
        expect(gitRepositoryProvider.allRepositories[1].localUri).to.eq(allReposA[1].localUri);
        expect(gitRepositoryProvider.selectedRepository && gitRepositoryProvider.selectedRepository.localUri).to.eq(allReposA[0].localUri);
    });
    it('should mark the first repo in the first root as "selectedRepository", if the "selectedRepository" is unavailable in the first place', async () => {
        const allReposA = [repoA1, repoA2];
        const roots = [folderA, folderB];
        const allReposB = [repoB];
        mockStorageService.getData.withArgs('theia-git-selected-repository').resolves(undefined);
        mockStorageService.getData.withArgs('theia-git-all-repositories').resolves(undefined);
        sinon.stub(mockWorkspaceService, 'roots').value(Promise.resolve(roots));
        mockWorkspaceService.tryGetRoots.returns(roots);
        gitRepositoryProvider = testContainer.get(git_repository_provider_1.GitRepositoryProvider);
        mockFilesystem.exists.resolves(true);
        mockGit.repositories.withArgs(folderA.resource.toString(), {}).resolves(allReposA);
        mockGit.repositories.withArgs(folderA.resource.toString(), { maxCount: 1 }).resolves([allReposA[0]]);
        mockGit.repositories.withArgs(folderB.resource.toString(), {}).resolves(allReposB);
        mockGit.repositories.withArgs(folderB.resource.toString(), { maxCount: 1 }).resolves([allReposB[0]]);
        await gitRepositoryProvider['doInit']();
        expect(gitRepositoryProvider.selectedRepository && gitRepositoryProvider.selectedRepository.localUri).to.eq(allReposA[0].localUri);
    });
});
//# sourceMappingURL=git-repository-provider.spec.js.map