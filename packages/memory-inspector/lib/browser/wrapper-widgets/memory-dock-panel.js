"use strict";
/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryDockPanel = void 0;
const browser_1 = require("@theia/core/lib/browser");
const theia_dock_panel_1 = require("@theia/core/lib/browser/shell/theia-dock-panel");
class MemoryDockPanel extends theia_dock_panel_1.TheiaDockPanel {
    toggleMaximized() { }
}
exports.MemoryDockPanel = MemoryDockPanel;
(function (MemoryDockPanel) {
    MemoryDockPanel.ID = 'memory-dock-panel-widget';
    const DOCK_PANEL_ID = 'theia-main-content-panel';
    const THEIA_TABBAR_CLASSES = ['theia-app-centers', 'theia-app-main'];
    const MEMORY_INSPECTOR_TABBAR_CLASS = 'memory-dock-tabbar';
    const DOCK_PANEL_CLASS = 'memory-dock-panel';
    const createDockPanel = (factory) => {
        const renderer = factory();
        renderer.tabBarClasses.push(...THEIA_TABBAR_CLASSES, MEMORY_INSPECTOR_TABBAR_CLASS);
        const dockPanel = new MemoryDockPanel({
            mode: 'multiple-document',
            renderer,
            spacing: 0,
        });
        dockPanel.addClass(DOCK_PANEL_CLASS);
        dockPanel.id = DOCK_PANEL_ID;
        return dockPanel;
    };
    MemoryDockPanel.createWidget = (parent) => {
        const dockFactory = parent.get(browser_1.DockPanelRendererFactory);
        const dockPanel = createDockPanel(dockFactory);
        return dockPanel;
    };
})(MemoryDockPanel = exports.MemoryDockPanel || (exports.MemoryDockPanel = {}));
//# sourceMappingURL=memory-dock-panel.js.map