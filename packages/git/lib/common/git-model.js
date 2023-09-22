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
exports.GitError = exports.BranchType = exports.Repository = exports.GitFileStatus = exports.WorkingDirectoryStatus = void 0;
const uri_1 = require("@theia/core/lib/common/uri");
const core_1 = require("@theia/core");
var WorkingDirectoryStatus;
(function (WorkingDirectoryStatus) {
    /**
     * `true` if the directory statuses are deep equal, otherwise `false`.
     */
    function equals(left, right) {
        if (left && right) {
            return left.exists === right.exists
                && left.branch === right.branch
                && left.upstreamBranch === right.upstreamBranch
                && left.currentHead === right.currentHead
                && (left.aheadBehind ? left.aheadBehind.ahead : -1) === (right.aheadBehind ? right.aheadBehind.ahead : -1)
                && (left.aheadBehind ? left.aheadBehind.behind : -1) === (right.aheadBehind ? right.aheadBehind.behind : -1)
                && left.changes.length === right.changes.length
                && !!left.incomplete === !!right.incomplete
                && JSON.stringify(left) === JSON.stringify(right);
        }
        else {
            return left === right;
        }
    }
    WorkingDirectoryStatus.equals = equals;
})(WorkingDirectoryStatus = exports.WorkingDirectoryStatus || (exports.WorkingDirectoryStatus = {}));
/**
 * Enumeration of states that a file resource can have in the working directory.
 */
var GitFileStatus;
(function (GitFileStatus) {
    GitFileStatus[GitFileStatus["New"] = 0] = "New";
    GitFileStatus[GitFileStatus["Copied"] = 1] = "Copied";
    GitFileStatus[GitFileStatus["Modified"] = 2] = "Modified";
    GitFileStatus[GitFileStatus["Renamed"] = 3] = "Renamed";
    GitFileStatus[GitFileStatus["Deleted"] = 4] = "Deleted";
    GitFileStatus[GitFileStatus["Conflicted"] = 5] = "Conflicted";
})(GitFileStatus = exports.GitFileStatus || (exports.GitFileStatus = {}));
(function (GitFileStatus) {
    /**
     * Compares the statuses based on the natural order of the enumeration.
     */
    GitFileStatus.statusCompare = (left, right) => left - right;
    /**
     * Returns with human readable representation of the Git file status argument. If the `staged` argument is `undefined`,
     * it will be treated as `false`.
     */
    GitFileStatus.toString = (status, staged) => {
        switch (status) {
            case GitFileStatus.New: return !!staged ? core_1.nls.localize('theia/git/added', 'Added') : core_1.nls.localize('theia/git/unstaged', 'Unstaged');
            case GitFileStatus.Renamed: return core_1.nls.localize('theia/git/renamed', 'Renamed');
            case GitFileStatus.Copied: return core_1.nls.localize('theia/git/copied', 'Copied');
            // eslint-disable-next-line @theia/localization-check
            case GitFileStatus.Modified: return core_1.nls.localize('vscode.git/repository/modified', 'Modified');
            // eslint-disable-next-line @theia/localization-check
            case GitFileStatus.Deleted: return core_1.nls.localize('vscode.git/repository/deleted', 'Deleted');
            case GitFileStatus.Conflicted: return core_1.nls.localize('theia/git/conflicted', 'Conflicted');
            default: throw new Error(`Unexpected Git file stats: ${status}.`);
        }
    };
    /**
     * Returns with the human readable abbreviation of the Git file status argument. `staged` argument defaults to `false`.
     */
    GitFileStatus.toAbbreviation = (status, staged) => {
        switch (status) {
            case GitFileStatus.New: return !!staged ? 'A' : 'U';
            case GitFileStatus.Renamed: return 'R';
            case GitFileStatus.Copied: return 'C';
            case GitFileStatus.Modified: return 'M';
            case GitFileStatus.Deleted: return 'D';
            case GitFileStatus.Conflicted: return 'C';
            default: throw new Error(`Unexpected Git file stats: ${status}.`);
        }
    };
    /**
     * It should be aligned with https://github.com/microsoft/vscode/blob/0dfa355b3ad185a6289ba28a99c141ab9e72d2be/extensions/git/src/repository.ts#L197
     */
    function getColor(status, staged) {
        switch (status) {
            case GitFileStatus.New: {
                if (!staged) {
                    return 'var(--theia-gitDecoration-untrackedResourceForeground)';
                }
                return 'var(--theia-gitDecoration-addedResourceForeground)';
            }
            case GitFileStatus.Renamed: return 'var(--theia-gitDecoration-untrackedResourceForeground)';
            case GitFileStatus.Copied: // Fall through.
            case GitFileStatus.Modified: return 'var(--theia-gitDecoration-modifiedResourceForeground)';
            case GitFileStatus.Deleted: return 'var(--theia-gitDecoration-deletedResourceForeground)';
            case GitFileStatus.Conflicted: return 'var(--theia-gitDecoration-conflictingResourceForeground)';
        }
    }
    GitFileStatus.getColor = getColor;
    function toStrikethrough(status) {
        return status === GitFileStatus.Deleted;
    }
    GitFileStatus.toStrikethrough = toStrikethrough;
})(GitFileStatus = exports.GitFileStatus || (exports.GitFileStatus = {}));
var Repository;
(function (Repository) {
    function equal(repository, repository2) {
        if (repository && repository2) {
            return repository.localUri === repository2.localUri;
        }
        return repository === repository2;
    }
    Repository.equal = equal;
    function is(repository) {
        return (0, core_1.isObject)(repository) && 'localUri' in repository;
    }
    Repository.is = is;
    function relativePath(repository, uri) {
        const repositoryUri = new uri_1.default(Repository.is(repository) ? repository.localUri : String(repository));
        return repositoryUri.relative(new uri_1.default(String(uri)));
    }
    Repository.relativePath = relativePath;
})(Repository = exports.Repository || (exports.Repository = {}));
/**
 * The branch type. Either local or remote.
 * The order matters.
 */
var BranchType;
(function (BranchType) {
    /**
     * The local branch type.
     */
    BranchType[BranchType["Local"] = 0] = "Local";
    /**
     * The remote branch type.
     */
    BranchType[BranchType["Remote"] = 1] = "Remote";
})(BranchType = exports.BranchType || (exports.BranchType = {}));
/**
 * The Git errors which can be parsed from failed Git commands.
 */
var GitError;
(function (GitError) {
    GitError[GitError["SSHKeyAuditUnverified"] = 0] = "SSHKeyAuditUnverified";
    GitError[GitError["SSHAuthenticationFailed"] = 1] = "SSHAuthenticationFailed";
    GitError[GitError["SSHPermissionDenied"] = 2] = "SSHPermissionDenied";
    GitError[GitError["HTTPSAuthenticationFailed"] = 3] = "HTTPSAuthenticationFailed";
    GitError[GitError["RemoteDisconnection"] = 4] = "RemoteDisconnection";
    GitError[GitError["HostDown"] = 5] = "HostDown";
    GitError[GitError["RebaseConflicts"] = 6] = "RebaseConflicts";
    GitError[GitError["MergeConflicts"] = 7] = "MergeConflicts";
    GitError[GitError["HTTPSRepositoryNotFound"] = 8] = "HTTPSRepositoryNotFound";
    GitError[GitError["SSHRepositoryNotFound"] = 9] = "SSHRepositoryNotFound";
    GitError[GitError["PushNotFastForward"] = 10] = "PushNotFastForward";
    GitError[GitError["BranchDeletionFailed"] = 11] = "BranchDeletionFailed";
    GitError[GitError["DefaultBranchDeletionFailed"] = 12] = "DefaultBranchDeletionFailed";
    GitError[GitError["RevertConflicts"] = 13] = "RevertConflicts";
    GitError[GitError["EmptyRebasePatch"] = 14] = "EmptyRebasePatch";
    GitError[GitError["NoMatchingRemoteBranch"] = 15] = "NoMatchingRemoteBranch";
    GitError[GitError["NoExistingRemoteBranch"] = 16] = "NoExistingRemoteBranch";
    GitError[GitError["NothingToCommit"] = 17] = "NothingToCommit";
    GitError[GitError["NoSubmoduleMapping"] = 18] = "NoSubmoduleMapping";
    GitError[GitError["SubmoduleRepositoryDoesNotExist"] = 19] = "SubmoduleRepositoryDoesNotExist";
    GitError[GitError["InvalidSubmoduleSHA"] = 20] = "InvalidSubmoduleSHA";
    GitError[GitError["LocalPermissionDenied"] = 21] = "LocalPermissionDenied";
    GitError[GitError["InvalidMerge"] = 22] = "InvalidMerge";
    GitError[GitError["InvalidRebase"] = 23] = "InvalidRebase";
    GitError[GitError["NonFastForwardMergeIntoEmptyHead"] = 24] = "NonFastForwardMergeIntoEmptyHead";
    GitError[GitError["PatchDoesNotApply"] = 25] = "PatchDoesNotApply";
    GitError[GitError["BranchAlreadyExists"] = 26] = "BranchAlreadyExists";
    GitError[GitError["BadRevision"] = 27] = "BadRevision";
    GitError[GitError["NotAGitRepository"] = 28] = "NotAGitRepository";
    GitError[GitError["CannotMergeUnrelatedHistories"] = 29] = "CannotMergeUnrelatedHistories";
    GitError[GitError["LFSAttributeDoesNotMatch"] = 30] = "LFSAttributeDoesNotMatch";
    GitError[GitError["BranchRenameFailed"] = 31] = "BranchRenameFailed";
    GitError[GitError["PathDoesNotExist"] = 32] = "PathDoesNotExist";
    GitError[GitError["InvalidObjectName"] = 33] = "InvalidObjectName";
    GitError[GitError["OutsideRepository"] = 34] = "OutsideRepository";
    GitError[GitError["LockFileAlreadyExists"] = 35] = "LockFileAlreadyExists";
    GitError[GitError["NoMergeToAbort"] = 36] = "NoMergeToAbort";
    GitError[GitError["LocalChangesOverwritten"] = 37] = "LocalChangesOverwritten";
    GitError[GitError["UnresolvedConflicts"] = 38] = "UnresolvedConflicts";
    GitError[GitError["GPGFailedToSignData"] = 39] = "GPGFailedToSignData";
    GitError[GitError["ConflictModifyDeletedInBranch"] = 40] = "ConflictModifyDeletedInBranch";
    // GitHub-specific error codes
    GitError[GitError["PushWithFileSizeExceedingLimit"] = 41] = "PushWithFileSizeExceedingLimit";
    GitError[GitError["HexBranchNameRejected"] = 42] = "HexBranchNameRejected";
    GitError[GitError["ForcePushRejected"] = 43] = "ForcePushRejected";
    GitError[GitError["InvalidRefLength"] = 44] = "InvalidRefLength";
    GitError[GitError["ProtectedBranchRequiresReview"] = 45] = "ProtectedBranchRequiresReview";
    GitError[GitError["ProtectedBranchForcePush"] = 46] = "ProtectedBranchForcePush";
    GitError[GitError["ProtectedBranchDeleteRejected"] = 47] = "ProtectedBranchDeleteRejected";
    GitError[GitError["ProtectedBranchRequiredStatus"] = 48] = "ProtectedBranchRequiredStatus";
    GitError[GitError["PushWithPrivateEmail"] = 49] = "PushWithPrivateEmail";
    // End of GitHub-specific error codes
    GitError[GitError["ConfigLockFileAlreadyExists"] = 50] = "ConfigLockFileAlreadyExists";
    GitError[GitError["RemoteAlreadyExists"] = 51] = "RemoteAlreadyExists";
    GitError[GitError["TagAlreadyExists"] = 52] = "TagAlreadyExists";
    GitError[GitError["MergeWithLocalChanges"] = 53] = "MergeWithLocalChanges";
    GitError[GitError["RebaseWithLocalChanges"] = 54] = "RebaseWithLocalChanges";
    GitError[GitError["MergeCommitNoMainlineOption"] = 55] = "MergeCommitNoMainlineOption";
    GitError[GitError["UnsafeDirectory"] = 56] = "UnsafeDirectory";
    GitError[GitError["PathExistsButNotInRef"] = 57] = "PathExistsButNotInRef";
})(GitError = exports.GitError || (exports.GitError = {}));
//# sourceMappingURL=git-model.js.map