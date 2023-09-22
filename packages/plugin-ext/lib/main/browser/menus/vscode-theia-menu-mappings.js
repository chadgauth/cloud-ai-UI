"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.CodeEditorWidgetUtil = exports.codeToTheiaMappings = exports.implementedVSCodeContributionPoints = exports.PLUGIN_VIEW_TITLE_MENU = exports.PLUGIN_SCM_TITLE_MENU = exports.PLUGIN_EDITOR_TITLE_RUN_MENU = exports.PLUGIN_EDITOR_TITLE_MENU = void 0;
const browser_1 = require("@theia/core/lib/browser");
const navigatable_1 = require("@theia/core/lib/browser/navigatable");
const inversify_1 = require("@theia/core/shared/inversify");
const debug_stack_frames_widget_1 = require("@theia/debug/lib/browser/view/debug-stack-frames-widget");
const debug_threads_widget_1 = require("@theia/debug/lib/browser/view/debug-threads-widget");
const debug_toolbar_widget_1 = require("@theia/debug/lib/browser/view/debug-toolbar-widget");
const debug_variables_widget_1 = require("@theia/debug/lib/browser/view/debug-variables-widget");
const browser_2 = require("@theia/editor/lib/browser");
const navigator_contribution_1 = require("@theia/navigator/lib/browser/navigator-contribution");
const scm_tree_widget_1 = require("@theia/scm/lib/browser/scm-tree-widget");
const timeline_tree_widget_1 = require("@theia/timeline/lib/browser/timeline-tree-widget");
const comment_thread_widget_1 = require("../comments/comment-thread-widget");
const tree_view_widget_1 = require("../view/tree-view-widget");
const webview_1 = require("../webview/webview");
const editor_linenumber_contribution_1 = require("@theia/editor/lib/browser/editor-linenumber-contribution");
exports.PLUGIN_EDITOR_TITLE_MENU = ['plugin_editor/title'];
exports.PLUGIN_EDITOR_TITLE_RUN_MENU = ['plugin_editor/title/run'];
exports.PLUGIN_SCM_TITLE_MENU = ['plugin_scm/title'];
exports.PLUGIN_VIEW_TITLE_MENU = ['plugin_view/title'];
exports.implementedVSCodeContributionPoints = [
    'comments/comment/context',
    'comments/comment/title',
    'comments/commentThread/context',
    'debug/callstack/context',
    'debug/variables/context',
    'debug/toolBar',
    'editor/context',
    'editor/title',
    'editor/title/context',
    'editor/title/run',
    'editor/lineNumber/context',
    'explorer/context',
    'scm/resourceFolder/context',
    'scm/resourceGroup/context',
    'scm/resourceState/context',
    'scm/title',
    'timeline/item/context',
    'view/item/context',
    'view/title'
];
/** The values are menu paths to which the VSCode contribution points correspond */
exports.codeToTheiaMappings = new Map([
    ['comments/comment/context', [comment_thread_widget_1.COMMENT_CONTEXT]],
    ['comments/comment/title', [comment_thread_widget_1.COMMENT_TITLE]],
    ['comments/commentThread/context', [comment_thread_widget_1.COMMENT_THREAD_CONTEXT]],
    ['debug/callstack/context', [debug_stack_frames_widget_1.DebugStackFramesWidget.CONTEXT_MENU, debug_threads_widget_1.DebugThreadsWidget.CONTEXT_MENU]],
    ['debug/variables/context', [debug_variables_widget_1.DebugVariablesWidget.CONTEXT_MENU]],
    ['debug/toolBar', [debug_toolbar_widget_1.DebugToolBar.MENU]],
    ['editor/context', [browser_2.EDITOR_CONTEXT_MENU]],
    ['editor/title', [exports.PLUGIN_EDITOR_TITLE_MENU]],
    ['editor/title/context', [browser_1.SHELL_TABBAR_CONTEXT_MENU]],
    ['editor/title/run', [exports.PLUGIN_EDITOR_TITLE_RUN_MENU]],
    ['editor/lineNumber/context', [editor_linenumber_contribution_1.EDITOR_LINENUMBER_CONTEXT_MENU]],
    ['explorer/context', [navigator_contribution_1.NAVIGATOR_CONTEXT_MENU]],
    ['scm/resourceFolder/context', [scm_tree_widget_1.ScmTreeWidget.RESOURCE_FOLDER_CONTEXT_MENU]],
    ['scm/resourceGroup/context', [scm_tree_widget_1.ScmTreeWidget.RESOURCE_GROUP_CONTEXT_MENU]],
    ['scm/resourceState/context', [scm_tree_widget_1.ScmTreeWidget.RESOURCE_CONTEXT_MENU]],
    ['scm/title', [exports.PLUGIN_SCM_TITLE_MENU]],
    ['timeline/item/context', [timeline_tree_widget_1.TIMELINE_ITEM_CONTEXT_MENU]],
    ['view/item/context', [tree_view_widget_1.VIEW_ITEM_CONTEXT_MENU]],
    ['view/title', [exports.PLUGIN_VIEW_TITLE_MENU]],
]);
let CodeEditorWidgetUtil = class CodeEditorWidgetUtil {
    is(arg) {
        return arg instanceof browser_2.EditorWidget || arg instanceof webview_1.WebviewWidget;
    }
    getResourceUri(editor) {
        const resourceUri = navigatable_1.Navigatable.is(editor) && editor.getResourceUri();
        return resourceUri ? resourceUri['codeUri'] : undefined;
    }
};
CodeEditorWidgetUtil = __decorate([
    (0, inversify_1.injectable)()
], CodeEditorWidgetUtil);
exports.CodeEditorWidgetUtil = CodeEditorWidgetUtil;
//# sourceMappingURL=vscode-theia-menu-mappings.js.map