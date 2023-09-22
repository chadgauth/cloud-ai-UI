"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
require("../../src/browser/style/index.css");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const color_application_contribution_1 = require("@theia/core/lib/browser/color-application-contribution");
const notebook_open_handler_1 = require("./notebook-open-handler");
const core_1 = require("@theia/core");
const notebook_type_registry_1 = require("./notebook-type-registry");
const notebook_renderer_registry_1 = require("./notebook-renderer-registry");
const notebook_service_1 = require("./service/notebook-service");
const notebook_editor_widget_factory_1 = require("./notebook-editor-widget-factory");
const notebook_cell_resource_resolver_1 = require("./notebook-cell-resource-resolver");
const notebook_model_resolver_service_1 = require("./service/notebook-model-resolver-service");
const notebook_cell_actions_contribution_1 = require("./contributions/notebook-cell-actions-contribution");
const notebook_cell_toolbar_factory_1 = require("./view/notebook-cell-toolbar-factory");
const notebook_model_1 = require("./view-model/notebook-model");
const notebook_cell_model_1 = require("./view-model/notebook-cell-model");
const notebook_editor_widget_1 = require("./notebook-editor-widget");
const notebook_code_cell_view_1 = require("./view/notebook-code-cell-view");
const notebook_markdown_cell_view_1 = require("./view/notebook-markdown-cell-view");
const notebook_actions_contribution_1 = require("./contributions/notebook-actions-contribution");
const notebook_execution_service_1 = require("./service/notebook-execution-service");
const notebook_execution_state_service_1 = require("./service/notebook-execution-state-service");
const notebook_kernel_service_1 = require("./service/notebook-kernel-service");
const notebook_kernel_quick_pick_service_1 = require("./service/notebook-kernel-quick-pick-service");
const notebook_kernel_history_service_1 = require("./service/notebook-kernel-history-service");
const notebook_editor_service_1 = require("./service/notebook-editor-service");
const notebook_renderer_messaging_service_1 = require("./service/notebook-renderer-messaging-service");
const notebook_color_contribution_1 = require("./contributions/notebook-color-contribution");
const notebook_cell_context_manager_1 = require("./service/notebook-cell-context-manager");
const notebook_main_toolbar_1 = require("./view/notebook-main-toolbar");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(notebook_color_contribution_1.NotebookColorContribution).toSelf().inSingletonScope();
    bind(color_application_contribution_1.ColorContribution).toService(notebook_color_contribution_1.NotebookColorContribution);
    bind(notebook_open_handler_1.NotebookOpenHandler).toSelf().inSingletonScope();
    bind(browser_1.OpenHandler).toService(notebook_open_handler_1.NotebookOpenHandler);
    bind(notebook_type_registry_1.NotebookTypeRegistry).toSelf().inSingletonScope();
    bind(notebook_renderer_registry_1.NotebookRendererRegistry).toSelf().inSingletonScope();
    bind(browser_1.WidgetFactory).to(notebook_editor_widget_factory_1.NotebookEditorWidgetFactory).inSingletonScope();
    bind(notebook_cell_toolbar_factory_1.NotebookCellToolbarFactory).toSelf().inSingletonScope();
    bind(notebook_service_1.NotebookService).toSelf().inSingletonScope();
    bind(notebook_editor_service_1.NotebookEditorWidgetService).toSelf().inSingletonScope();
    bind(notebook_execution_service_1.NotebookExecutionService).toSelf().inSingletonScope();
    bind(notebook_execution_state_service_1.NotebookExecutionStateService).toSelf().inSingletonScope();
    bind(notebook_kernel_service_1.NotebookKernelService).toSelf().inSingletonScope();
    bind(notebook_renderer_messaging_service_1.NotebookRendererMessagingService).toSelf().inSingletonScope();
    bind(notebook_kernel_history_service_1.NotebookKernelHistoryService).toSelf().inSingletonScope();
    bind(notebook_kernel_quick_pick_service_1.NotebookKernelQuickPickService).to(notebook_kernel_quick_pick_service_1.KernelPickerMRUStrategy).inSingletonScope();
    bind(notebook_cell_resource_resolver_1.NotebookCellResourceResolver).toSelf().inSingletonScope();
    bind(core_1.ResourceResolver).toService(notebook_cell_resource_resolver_1.NotebookCellResourceResolver);
    bind(notebook_model_resolver_service_1.NotebookModelResolverService).toSelf().inSingletonScope();
    bind(notebook_cell_actions_contribution_1.NotebookCellActionContribution).toSelf().inSingletonScope();
    bind(core_1.MenuContribution).toService(notebook_cell_actions_contribution_1.NotebookCellActionContribution);
    bind(core_1.CommandContribution).toService(notebook_cell_actions_contribution_1.NotebookCellActionContribution);
    bind(notebook_actions_contribution_1.NotebookActionsContribution).toSelf().inSingletonScope();
    bind(core_1.CommandContribution).toService(notebook_actions_contribution_1.NotebookActionsContribution);
    bind(core_1.MenuContribution).toService(notebook_actions_contribution_1.NotebookActionsContribution);
    bind(notebook_code_cell_view_1.NotebookCodeCellRenderer).toSelf().inSingletonScope();
    bind(notebook_markdown_cell_view_1.NotebookMarkdownCellRenderer).toSelf().inSingletonScope();
    bind(notebook_main_toolbar_1.NotebookMainToolbarRenderer).toSelf().inSingletonScope();
    bind(notebook_editor_widget_1.NotebookEditorContainerFactory).toFactory(ctx => (props) => (0, notebook_editor_widget_1.createNotebookEditorWidgetContainer)(ctx.container, props).get(notebook_editor_widget_1.NotebookEditorWidget));
    bind(notebook_model_1.NotebookModelFactory).toFactory(ctx => (props) => (0, notebook_model_1.createNotebookModelContainer)(ctx.container, props).get(notebook_model_1.NotebookModel));
    bind(notebook_cell_model_1.NotebookCellModelFactory).toFactory(ctx => (props) => (0, notebook_cell_model_1.createNotebookCellModelContainer)(ctx.container, props, notebook_cell_context_manager_1.NotebookCellContextManager).get(notebook_cell_model_1.NotebookCellModel));
});
//# sourceMappingURL=notebook-frontend-module.js.map