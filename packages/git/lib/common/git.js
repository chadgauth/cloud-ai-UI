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
exports.GitUtils = exports.Git = exports.GitPath = void 0;
const core_1 = require("@theia/core");
const git_model_1 = require("./git-model");
/**
 * The WS endpoint path to the Git service.
 */
exports.GitPath = '/services/git';
/**
 * Git symbol for DI.
 */
exports.Git = Symbol('Git');
/**
 * Contains a set of utility functions for {@link Git}.
 */
var GitUtils;
(function (GitUtils) {
    /**
     * `true` if the argument is an option for renaming an existing branch in the repository.
     */
    function isBranchRename(arg) {
        return (0, core_1.isObject)(arg) && 'newName' in arg;
    }
    GitUtils.isBranchRename = isBranchRename;
    /**
     * `true` if the argument is an option for deleting an existing branch in the repository.
     */
    function isBranchDelete(arg) {
        return (0, core_1.isObject)(arg) && 'toDelete' in arg;
    }
    GitUtils.isBranchDelete = isBranchDelete;
    /**
     * `true` if the argument is an option for creating a new branch in the repository.
     */
    function isBranchCreate(arg) {
        return (0, core_1.isObject)(arg) && 'toCreate' in arg;
    }
    GitUtils.isBranchCreate = isBranchCreate;
    /**
     * `true` if the argument is an option for listing the branches in a repository.
     */
    function isBranchList(arg) {
        return (0, core_1.isObject)(arg) && 'type' in arg;
    }
    GitUtils.isBranchList = isBranchList;
    /**
     * `true` if the argument is an option for checking out a new local branch.
     */
    function isBranchCheckout(arg) {
        return (0, core_1.isObject)(arg) && 'branch' in arg;
    }
    GitUtils.isBranchCheckout = isBranchCheckout;
    /**
     * `true` if the argument is an option for checking out a working tree file.
     */
    function isWorkingTreeFileCheckout(arg) {
        return (0, core_1.isObject)(arg) && 'paths' in arg;
    }
    GitUtils.isWorkingTreeFileCheckout = isWorkingTreeFileCheckout;
    /**
     * The error code for when the path to a repository doesn't exist.
     */
    const RepositoryDoesNotExistErrorCode = 'repository-does-not-exist-error';
    /**
     * `true` if the argument is an error indicating the absence of a local Git repository.
     * Otherwise, `false`.
     */
    function isRepositoryDoesNotExistError(error) {
        // TODO this is odd here.This piece of code is already implementation specific, so this should go to the Git API.
        // But how can we ensure that the `any` type error is serializable?
        if (error instanceof Error && ('code' in error)) {
            return error.code === RepositoryDoesNotExistErrorCode;
        }
        return false;
    }
    GitUtils.isRepositoryDoesNotExistError = isRepositoryDoesNotExistError;
    /**
     * Maps the raw status text from Git to a Git file status enumeration.
     */
    function mapStatus(rawStatus) {
        const status = rawStatus.trim();
        if (status === 'M') {
            return git_model_1.GitFileStatus.Modified;
        } // modified
        if (status === 'A') {
            return git_model_1.GitFileStatus.New;
        } // added
        if (status === 'D') {
            return git_model_1.GitFileStatus.Deleted;
        } // deleted
        if (status === 'R') {
            return git_model_1.GitFileStatus.Renamed;
        } // renamed
        if (status === 'C') {
            return git_model_1.GitFileStatus.Copied;
        } // copied
        // git log -M --name-status will return a RXXX - where XXX is a percentage
        if (status.match(/R[0-9]+/)) {
            return git_model_1.GitFileStatus.Renamed;
        }
        // git log -C --name-status will return a CXXX - where XXX is a percentage
        if (status.match(/C[0-9]+/)) {
            return git_model_1.GitFileStatus.Copied;
        }
        return git_model_1.GitFileStatus.Modified;
    }
    GitUtils.mapStatus = mapStatus;
    /**
     * `true` if the argument is a raw Git status with similarity percentage. Otherwise, `false`.
     */
    function isSimilarityStatus(rawStatus) {
        return !!rawStatus.match(/R[0-9][0-9][0-9]/) || !!rawStatus.match(/C[0-9][0-9][0-9]/);
    }
    GitUtils.isSimilarityStatus = isSimilarityStatus;
})(GitUtils = exports.GitUtils || (exports.GitUtils = {}));
//# sourceMappingURL=git.js.map