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
exports.ScmDecorationsService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const dirty_diff_decorator_1 = require("../dirty-diff/dirty-diff-decorator");
const diff_computer_1 = require("../dirty-diff/diff-computer");
const content_lines_1 = require("../dirty-diff/content-lines");
const browser_1 = require("@theia/editor/lib/browser");
const scm_service_1 = require("../scm-service");
let ScmDecorationsService = class ScmDecorationsService {
    constructor(decorator, scmService, editorManager, resourceProvider) {
        this.decorator = decorator;
        this.scmService = scmService;
        this.editorManager = editorManager;
        this.resourceProvider = resourceProvider;
        this.dirtyState = true;
        this.diffComputer = new diff_computer_1.DiffComputer();
        this.editorManager.onCreated(async (editor) => this.applyEditorDecorations(editor.editor));
        this.scmService.onDidAddRepository(repository => repository.provider.onDidChange(() => {
            const editor = this.editorManager.currentEditor;
            if (editor) {
                if (this.dirtyState) {
                    this.applyEditorDecorations(editor.editor);
                    this.dirtyState = false;
                }
                else {
                    /** onDidChange event might be called several times one after another, so need to prevent repeated events. */
                    setTimeout(() => {
                        this.dirtyState = true;
                    }, 500);
                }
            }
        }));
        this.scmService.onDidChangeSelectedRepository(() => {
            const editor = this.editorManager.currentEditor;
            if (editor) {
                this.applyEditorDecorations(editor.editor);
            }
        });
    }
    async applyEditorDecorations(editor) {
        const currentRepo = this.scmService.selectedRepository;
        if (currentRepo) {
            try {
                const uri = editor.uri.withScheme(currentRepo.provider.id).withQuery(`{"ref":"", "path":"${editor.uri.path.toString()}"}`);
                const previousResource = await this.resourceProvider(uri);
                const previousContent = await previousResource.readContents();
                const previousLines = content_lines_1.ContentLines.fromString(previousContent);
                const currentResource = await this.resourceProvider(editor.uri);
                const currentContent = await currentResource.readContents();
                const currentLines = content_lines_1.ContentLines.fromString(currentContent);
                const { added, removed, modified } = this.diffComputer.computeDirtyDiff(content_lines_1.ContentLines.arrayLike(previousLines), content_lines_1.ContentLines.arrayLike(currentLines));
                this.decorator.applyDecorations({ editor: editor, added, removed, modified });
                currentResource.dispose();
                previousResource.dispose();
            }
            catch (e) {
                // Scm resource may not be found, do nothing.
            }
        }
    }
};
ScmDecorationsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(dirty_diff_decorator_1.DirtyDiffDecorator)),
    __param(1, (0, inversify_1.inject)(scm_service_1.ScmService)),
    __param(2, (0, inversify_1.inject)(browser_1.EditorManager)),
    __param(3, (0, inversify_1.inject)(core_1.ResourceProvider)),
    __metadata("design:paramtypes", [dirty_diff_decorator_1.DirtyDiffDecorator,
        scm_service_1.ScmService,
        browser_1.EditorManager, Function])
], ScmDecorationsService);
exports.ScmDecorationsService = ScmDecorationsService;
//# sourceMappingURL=scm-decorations-service.js.map