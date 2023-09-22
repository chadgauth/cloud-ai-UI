"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.NotebookEditorRevealType = exports.MAIN_RPC_CONTEXT = exports.PLUGIN_RPC_CONTEXT = exports.DebugConfigurationProviderTriggerKind = exports.OutputChannelRegistryFactory = exports.LanguagesMainFactory = exports.WorkspaceTextEditDto = exports.TrackedRangeStickiness = exports.TextEditorRevealType = exports.EditorPosition = exports.CommentsEditCommandArg = exports.CommentsContextCommandArg = exports.CommentsCommandArg = exports.TimelineCommandArg = exports.ScmCommandArg = exports.TreeViewItemCollapsibleState = exports.TreeViewItemReference = exports.DataTransferFileDTO = exports.MainMessageType = exports.emptyPlugin = exports.UIKind = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const rpc_protocol_1 = require("./rpc-protocol");
const common_1 = require("@theia/core/lib/common");
var UIKind;
(function (UIKind) {
    /**
     * Extensions are accessed from a desktop application.
     */
    UIKind[UIKind["Desktop"] = 1] = "Desktop";
    /**
     * Extensions are accessed from a web browser.
     */
    UIKind[UIKind["Web"] = 2] = "Web";
})(UIKind = exports.UIKind || (exports.UIKind = {}));
exports.emptyPlugin = {
    lifecycle: {
        startMethod: 'empty',
        stopMethod: 'empty'
    },
    model: {
        id: 'emptyPlugin',
        name: 'emptyPlugin',
        publisher: 'Theia',
        version: 'empty',
        displayName: 'empty',
        description: 'empty',
        engine: {
            type: 'empty',
            version: 'empty'
        },
        packagePath: 'empty',
        packageUri: 'empty',
        entryPoint: {}
    },
    pluginPath: 'empty',
    pluginFolder: 'empty',
    pluginUri: 'empty',
    rawModel: {
        name: 'emptyPlugin',
        publisher: 'Theia',
        version: 'empty',
        displayName: 'empty',
        description: 'empty',
        engines: {
            type: 'empty',
            version: 'empty'
        },
        packagePath: 'empty'
    },
    isUnderDevelopment: false
};
var MainMessageType;
(function (MainMessageType) {
    MainMessageType[MainMessageType["Error"] = 0] = "Error";
    MainMessageType[MainMessageType["Warning"] = 1] = "Warning";
    MainMessageType[MainMessageType["Info"] = 2] = "Info";
})(MainMessageType = exports.MainMessageType || (exports.MainMessageType = {}));
class DataTransferFileDTO {
    constructor(name, contentId, uri) {
        this.name = name;
        this.contentId = contentId;
        this.uri = uri;
    }
    static is(value) {
        return !(typeof value === 'string');
    }
}
exports.DataTransferFileDTO = DataTransferFileDTO;
var TreeViewItemReference;
(function (TreeViewItemReference) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && (0, common_1.isString)(arg.viewId) && (0, common_1.isString)(arg.itemId);
    }
    TreeViewItemReference.is = is;
})(TreeViewItemReference = exports.TreeViewItemReference || (exports.TreeViewItemReference = {}));
/**
 * Collapsible state of the tree item
 */
var TreeViewItemCollapsibleState;
(function (TreeViewItemCollapsibleState) {
    /**
     * Determines an item can be neither collapsed nor expanded. Implies it has no children.
     */
    TreeViewItemCollapsibleState[TreeViewItemCollapsibleState["None"] = 0] = "None";
    /**
     * Determines an item is collapsed
     */
    TreeViewItemCollapsibleState[TreeViewItemCollapsibleState["Collapsed"] = 1] = "Collapsed";
    /**
     * Determines an item is expanded
     */
    TreeViewItemCollapsibleState[TreeViewItemCollapsibleState["Expanded"] = 2] = "Expanded";
})(TreeViewItemCollapsibleState = exports.TreeViewItemCollapsibleState || (exports.TreeViewItemCollapsibleState = {}));
var ScmCommandArg;
(function (ScmCommandArg) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && 'sourceControlHandle' in arg;
    }
    ScmCommandArg.is = is;
})(ScmCommandArg = exports.ScmCommandArg || (exports.ScmCommandArg = {}));
var TimelineCommandArg;
(function (TimelineCommandArg) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && 'timelineHandle' in arg;
    }
    TimelineCommandArg.is = is;
})(TimelineCommandArg = exports.TimelineCommandArg || (exports.TimelineCommandArg = {}));
var CommentsCommandArg;
(function (CommentsCommandArg) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && 'commentControlHandle' in arg && 'commentThreadHandle' in arg && 'text' in arg && !('commentUniqueId' in arg);
    }
    CommentsCommandArg.is = is;
})(CommentsCommandArg = exports.CommentsCommandArg || (exports.CommentsCommandArg = {}));
var CommentsContextCommandArg;
(function (CommentsContextCommandArg) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && 'commentControlHandle' in arg && 'commentThreadHandle' in arg && 'commentUniqueId' in arg && !('text' in arg);
    }
    CommentsContextCommandArg.is = is;
})(CommentsContextCommandArg = exports.CommentsContextCommandArg || (exports.CommentsContextCommandArg = {}));
var CommentsEditCommandArg;
(function (CommentsEditCommandArg) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && 'commentControlHandle' in arg && 'commentThreadHandle' in arg && 'commentUniqueId' in arg && 'text' in arg;
    }
    CommentsEditCommandArg.is = is;
})(CommentsEditCommandArg = exports.CommentsEditCommandArg || (exports.CommentsEditCommandArg = {}));
var EditorPosition;
(function (EditorPosition) {
    EditorPosition[EditorPosition["ONE"] = 0] = "ONE";
    EditorPosition[EditorPosition["TWO"] = 1] = "TWO";
    EditorPosition[EditorPosition["THREE"] = 2] = "THREE";
    EditorPosition[EditorPosition["FOUR"] = 3] = "FOUR";
    EditorPosition[EditorPosition["FIVE"] = 4] = "FIVE";
    EditorPosition[EditorPosition["SIX"] = 5] = "SIX";
    EditorPosition[EditorPosition["SEVEN"] = 6] = "SEVEN";
    EditorPosition[EditorPosition["EIGHT"] = 7] = "EIGHT";
    EditorPosition[EditorPosition["NINE"] = 8] = "NINE";
})(EditorPosition = exports.EditorPosition || (exports.EditorPosition = {}));
var TextEditorRevealType;
(function (TextEditorRevealType) {
    TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
    TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
    TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    TextEditorRevealType[TextEditorRevealType["AtTop"] = 3] = "AtTop";
})(TextEditorRevealType = exports.TextEditorRevealType || (exports.TextEditorRevealType = {}));
/**
 * Describes the behavior of decorations when typing/editing near their edges.
 */
var TrackedRangeStickiness;
(function (TrackedRangeStickiness) {
    TrackedRangeStickiness[TrackedRangeStickiness["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
    TrackedRangeStickiness[TrackedRangeStickiness["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
    TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
    TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
})(TrackedRangeStickiness = exports.TrackedRangeStickiness || (exports.TrackedRangeStickiness = {}));
var WorkspaceTextEditDto;
(function (WorkspaceTextEditDto) {
    function is(arg) {
        return !!arg
            && 'resource' in arg
            && 'textEdit' in arg
            && arg.textEdit !== null
            && typeof arg.textEdit === 'object';
    }
    WorkspaceTextEditDto.is = is;
})(WorkspaceTextEditDto = exports.WorkspaceTextEditDto || (exports.WorkspaceTextEditDto = {}));
exports.LanguagesMainFactory = Symbol('LanguagesMainFactory');
exports.OutputChannelRegistryFactory = Symbol('OutputChannelRegistryFactory');
/**
 * A DebugConfigurationProviderTriggerKind specifies when the `provideDebugConfigurations` method of a `DebugConfigurationProvider` should be called.
 * Currently there are two situations:
 *  (1) providing debug configurations to populate a newly created `launch.json`
 *  (2) providing dynamically generated configurations when the user asks for them through the UI (e.g. via the "Select and Start Debugging" command).
 * A trigger kind is used when registering a `DebugConfigurationProvider` with {@link debug.registerDebugConfigurationProvider}.
 */
var DebugConfigurationProviderTriggerKind;
(function (DebugConfigurationProviderTriggerKind) {
    /**
     * `DebugConfigurationProvider.provideDebugConfigurations` is called to provide the initial debug
     * configurations for a newly created launch.json.
     */
    DebugConfigurationProviderTriggerKind[DebugConfigurationProviderTriggerKind["Initial"] = 1] = "Initial";
    /**
     * `DebugConfigurationProvider.provideDebugConfigurations` is called to provide dynamically generated debug configurations when the user asks for them through the UI
     * (e.g. via the "Select and Start Debugging" command).
     */
    DebugConfigurationProviderTriggerKind[DebugConfigurationProviderTriggerKind["Dynamic"] = 2] = "Dynamic";
})(DebugConfigurationProviderTriggerKind = exports.DebugConfigurationProviderTriggerKind || (exports.DebugConfigurationProviderTriggerKind = {}));
// endregion
exports.PLUGIN_RPC_CONTEXT = {
    AUTHENTICATION_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('AuthenticationMain'),
    COMMAND_REGISTRY_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('CommandRegistryMain'),
    QUICK_OPEN_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('QuickOpenMain'),
    DIALOGS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('DialogsMain'),
    WORKSPACE_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('WorkspaceMain'),
    MESSAGE_REGISTRY_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('MessageRegistryMain'),
    TEXT_EDITORS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('TextEditorsMain'),
    DOCUMENTS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('DocumentsMain'),
    NOTEBOOKS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('NotebooksMain'),
    NOTEBOOK_DOCUMENTS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('NotebookDocumentsMain'),
    NOTEBOOK_EDITORS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('NotebookEditorsMain'),
    NOTEBOOK_DOCUMENTS_AND_EDITORS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('NotebooksAndEditorsMain'),
    NOTEBOOK_RENDERERS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('NotebookRenderersMain'),
    NOTEBOOK_KERNELS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('NotebookKernelsMain'),
    STATUS_BAR_MESSAGE_REGISTRY_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('StatusBarMessageRegistryMain'),
    ENV_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('EnvMain'),
    NOTIFICATION_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('NotificationMain'),
    TERMINAL_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('TerminalServiceMain'),
    TREE_VIEWS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('TreeViewsMain'),
    PREFERENCE_REGISTRY_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('PreferenceRegistryMain'),
    OUTPUT_CHANNEL_REGISTRY_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('OutputChannelRegistryMain'),
    LANGUAGES_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('LanguagesMain'),
    CONNECTION_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('ConnectionMain'),
    WEBVIEWS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('WebviewsMain'),
    CUSTOM_EDITORS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('CustomEditorsMain'),
    WEBVIEW_VIEWS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('WebviewViewsMain'),
    STORAGE_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('StorageMain'),
    TASKS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('TasksMain'),
    DEBUG_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('DebugMain'),
    FILE_SYSTEM_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('FileSystemMain'),
    SCM_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('ScmMain'),
    SECRETS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('SecretsMain'),
    DECORATIONS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('DecorationsMain'),
    WINDOW_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('WindowMain'),
    CLIPBOARD_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('ClipboardMain'),
    LABEL_SERVICE_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('LabelServiceMain'),
    TIMELINE_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('TimelineMain'),
    THEMING_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('ThemingMain'),
    COMMENTS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('CommentsMain'),
    TABS_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('TabsMain'),
    TELEMETRY_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('TelemetryMain'),
    LOCALIZATION_MAIN: (0, rpc_protocol_1.createProxyIdentifier)('LocalizationMain'),
};
exports.MAIN_RPC_CONTEXT = {
    AUTHENTICATION_EXT: (0, rpc_protocol_1.createProxyIdentifier)('AuthenticationExt'),
    HOSTED_PLUGIN_MANAGER_EXT: (0, rpc_protocol_1.createProxyIdentifier)('PluginManagerExt'),
    COMMAND_REGISTRY_EXT: (0, rpc_protocol_1.createProxyIdentifier)('CommandRegistryExt'),
    QUICK_OPEN_EXT: (0, rpc_protocol_1.createProxyIdentifier)('QuickOpenExt'),
    WINDOW_STATE_EXT: (0, rpc_protocol_1.createProxyIdentifier)('WindowStateExt'),
    NOTIFICATION_EXT: (0, rpc_protocol_1.createProxyIdentifier)('NotificationExt'),
    WORKSPACE_EXT: (0, rpc_protocol_1.createProxyIdentifier)('WorkspaceExt'),
    TEXT_EDITORS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('TextEditorsExt'),
    EDITORS_AND_DOCUMENTS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('EditorsAndDocumentsExt'),
    DOCUMENTS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('DocumentsExt'),
    NOTEBOOKS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('NotebooksExt'),
    NOTEBOOK_DOCUMENTS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('NotebookDocumentsExt'),
    NOTEBOOK_EDITORS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('NotebookEditorsExt'),
    NOTEBOOK_RENDERERS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('NotebooksExt'),
    NOTEBOOK_KERNELS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('NotebookKernelsExt'),
    TERMINAL_EXT: (0, rpc_protocol_1.createProxyIdentifier)('TerminalServiceExt'),
    OUTPUT_CHANNEL_REGISTRY_EXT: (0, rpc_protocol_1.createProxyIdentifier)('OutputChannelRegistryExt'),
    TREE_VIEWS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('TreeViewsExt'),
    PREFERENCE_REGISTRY_EXT: (0, rpc_protocol_1.createProxyIdentifier)('PreferenceRegistryExt'),
    LANGUAGES_EXT: (0, rpc_protocol_1.createProxyIdentifier)('LanguagesExt'),
    CONNECTION_EXT: (0, rpc_protocol_1.createProxyIdentifier)('ConnectionExt'),
    WEBVIEWS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('WebviewsExt'),
    CUSTOM_EDITORS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('CustomEditorsExt'),
    WEBVIEW_VIEWS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('WebviewViewsExt'),
    STORAGE_EXT: (0, rpc_protocol_1.createProxyIdentifier)('StorageExt'),
    TASKS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('TasksExt'),
    DEBUG_EXT: (0, rpc_protocol_1.createProxyIdentifier)('DebugExt'),
    FILE_SYSTEM_EXT: (0, rpc_protocol_1.createProxyIdentifier)('FileSystemExt'),
    ExtHostFileSystemEventService: (0, rpc_protocol_1.createProxyIdentifier)('ExtHostFileSystemEventService'),
    SCM_EXT: (0, rpc_protocol_1.createProxyIdentifier)('ScmExt'),
    SECRETS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('SecretsExt'),
    DECORATIONS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('DecorationsExt'),
    LABEL_SERVICE_EXT: (0, rpc_protocol_1.createProxyIdentifier)('LabelServiceExt'),
    TIMELINE_EXT: (0, rpc_protocol_1.createProxyIdentifier)('TimeLineExt'),
    THEMING_EXT: (0, rpc_protocol_1.createProxyIdentifier)('ThemingExt'),
    COMMENTS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('CommentsExt'),
    TABS_EXT: (0, rpc_protocol_1.createProxyIdentifier)('TabsExt'),
    TELEMETRY_EXT: (0, rpc_protocol_1.createProxyIdentifier)('TelemetryExt)')
};
;
var NotebookEditorRevealType;
(function (NotebookEditorRevealType) {
    NotebookEditorRevealType[NotebookEditorRevealType["Default"] = 0] = "Default";
    NotebookEditorRevealType[NotebookEditorRevealType["InCenter"] = 1] = "InCenter";
    NotebookEditorRevealType[NotebookEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    NotebookEditorRevealType[NotebookEditorRevealType["AtTop"] = 3] = "AtTop";
})(NotebookEditorRevealType = exports.NotebookEditorRevealType || (exports.NotebookEditorRevealType = {}));
//# sourceMappingURL=plugin-api-rpc.js.map