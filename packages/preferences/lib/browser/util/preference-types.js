"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.PreferenceMenus = exports.PreferencesCommands = exports.Preference = void 0;
const browser_1 = require("@theia/core/lib/browser");
const core_1 = require("@theia/core");
var Preference;
(function (Preference) {
    let EditorCommandArgs;
    (function (EditorCommandArgs) {
        function is(prefObject) {
            return !!prefObject && 'id' in prefObject && 'value' in prefObject;
        }
        EditorCommandArgs.is = is;
    })(EditorCommandArgs = Preference.EditorCommandArgs || (Preference.EditorCommandArgs = {}));
    Preference.Node = Symbol('Preference.Node');
    let TreeNode;
    (function (TreeNode) {
        TreeNode.is = (node) => 'depth' in node;
        TreeNode.isTopLevel = (node) => {
            const { group, id } = TreeNode.getGroupAndIdFromNodeId(node.id);
            return group === id;
        };
        TreeNode.getGroupAndIdFromNodeId = (nodeId) => {
            const separator = nodeId.indexOf('@');
            const group = nodeId.substring(0, separator);
            const id = nodeId.substring(separator + 1, nodeId.length);
            return { group, id };
        };
    })(TreeNode = Preference.TreeNode || (Preference.TreeNode = {}));
    let LeafNode;
    (function (LeafNode) {
        LeafNode.is = (node) => 'preference' in node && !!node.preference.data;
        LeafNode.getType = (node) => LeafNode.is(node)
            ? Array.isArray(node.preference.data.type) ? node.preference.data.type[0] : node.preference.data.type
            : undefined;
    })(LeafNode = Preference.LeafNode || (Preference.LeafNode = {}));
    Preference.getValueInScope = (preferenceInfo, scope) => {
        if (!preferenceInfo) {
            return undefined;
        }
        switch (scope) {
            case browser_1.PreferenceScope.User:
                return preferenceInfo.globalValue;
            case browser_1.PreferenceScope.Workspace:
                return preferenceInfo.workspaceValue;
            case browser_1.PreferenceScope.Folder:
                return preferenceInfo.workspaceFolderValue;
            default:
                return undefined;
        }
    };
    ;
    Preference.DEFAULT_SCOPE = {
        scope: browser_1.PreferenceScope.User,
        uri: undefined,
        activeScopeIsFolder: false
    };
})(Preference = exports.Preference || (exports.Preference = {}));
var PreferencesCommands;
(function (PreferencesCommands) {
    PreferencesCommands.OPEN_PREFERENCES_JSON_TOOLBAR = {
        id: 'preferences:openJson.toolbar',
        iconClass: 'codicon codicon-json'
    };
    PreferencesCommands.COPY_JSON_NAME = core_1.Command.toDefaultLocalizedCommand({
        id: 'preferences:copyJson.name',
        label: 'Copy Setting ID'
    });
    PreferencesCommands.RESET_PREFERENCE = core_1.Command.toDefaultLocalizedCommand({
        id: 'preferences:reset',
        label: 'Reset Setting'
    });
    PreferencesCommands.COPY_JSON_VALUE = core_1.Command.toDefaultLocalizedCommand({
        id: 'preferences:copyJson.value',
        label: 'Copy Setting as JSON',
    });
    PreferencesCommands.OPEN_USER_PREFERENCES = core_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.openGlobalSettings',
        category: browser_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open User Settings',
    });
    PreferencesCommands.OPEN_WORKSPACE_PREFERENCES = core_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.openWorkspaceSettings',
        category: browser_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Workspace Settings',
    });
    PreferencesCommands.OPEN_FOLDER_PREFERENCES = core_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.openFolderSettings',
        category: browser_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Folder Settings'
    });
    PreferencesCommands.OPEN_USER_PREFERENCES_JSON = core_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.openSettingsJson',
        category: browser_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Settings (JSON)'
    });
    PreferencesCommands.OPEN_WORKSPACE_PREFERENCES_JSON = core_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.openWorkspaceSettingsFile',
        category: browser_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Workspace Settings (JSON)',
    });
    PreferencesCommands.OPEN_FOLDER_PREFERENCES_JSON = core_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.openFolderSettingsFile',
        category: browser_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Folder Settings (JSON)',
    });
})(PreferencesCommands = exports.PreferencesCommands || (exports.PreferencesCommands = {}));
var PreferenceMenus;
(function (PreferenceMenus) {
    PreferenceMenus.PREFERENCE_EDITOR_CONTEXT_MENU = ['preferences:editor.contextMenu'];
    PreferenceMenus.PREFERENCE_EDITOR_COPY_ACTIONS = [...PreferenceMenus.PREFERENCE_EDITOR_CONTEXT_MENU, 'preferences:editor.contextMenu.copy'];
    PreferenceMenus.FOLDER_SCOPE_MENU_PATH = ['preferences:scope.menu'];
})(PreferenceMenus = exports.PreferenceMenus || (exports.PreferenceMenus = {}));
//# sourceMappingURL=preference-types.js.map