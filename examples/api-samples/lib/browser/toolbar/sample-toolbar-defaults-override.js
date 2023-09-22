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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleToolbarDefaultsOverride = void 0;
const toolbar_interfaces_1 = require("@theia/toolbar/lib/browser/toolbar-interfaces");
const SampleToolbarDefaultsOverride = () => ({
    items: {
        [toolbar_interfaces_1.ToolbarAlignment.LEFT]: [
            [
                {
                    id: 'textEditor.commands.go.back',
                    command: 'textEditor.commands.go.back',
                    icon: 'codicon codicon-arrow-left',
                },
                {
                    id: 'textEditor.commands.go.forward',
                    command: 'textEditor.commands.go.forward',
                    icon: 'codicon codicon-arrow-right',
                },
            ],
            [
                {
                    id: 'workbench.action.splitEditorRight',
                    command: 'workbench.action.splitEditor',
                    icon: 'codicon codicon-split-horizontal',
                },
            ],
        ],
        [toolbar_interfaces_1.ToolbarAlignment.CENTER]: [[
                {
                    id: 'theia-sample-toolbar-contribution',
                    group: 'contributed'
                }
            ]],
        [toolbar_interfaces_1.ToolbarAlignment.RIGHT]: [
            [
                {
                    id: 'workbench.action.showCommands',
                    command: 'workbench.action.showCommands',
                    icon: 'codicon codicon-terminal',
                    tooltip: 'Command Palette',
                },
            ]
        ]
    },
});
exports.SampleToolbarDefaultsOverride = SampleToolbarDefaultsOverride;
//# sourceMappingURL=sample-toolbar-defaults-override.js.map