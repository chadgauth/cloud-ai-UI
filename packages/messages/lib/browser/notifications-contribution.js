"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const notifications_commands_1 = require("./notifications-commands");
const notifications_manager_1 = require("./notifications-manager");
const notifications_renderer_1 = require("./notifications-renderer");
const color_1 = require("@theia/core/lib/common/color");
const nls_1 = require("@theia/core/lib/common/nls");
const theme_1 = require("@theia/core/lib/common/theme");
let NotificationsContribution = class NotificationsContribution {
    constructor() {
        this.id = 'theia-notification-center';
    }
    onStart(_app) {
        this.createStatusBarItem();
    }
    createStatusBarItem() {
        this.updateStatusBarItem();
        this.manager.onUpdated(e => this.updateStatusBarItem(e.notifications.length));
    }
    updateStatusBarItem(count = 0) {
        this.statusBar.setElement(this.id, {
            text: this.getStatusBarItemText(count),
            alignment: browser_1.StatusBarAlignment.RIGHT,
            priority: -900,
            command: notifications_commands_1.NotificationsCommands.TOGGLE.id,
            tooltip: this.getStatusBarItemTooltip(count),
            accessibilityInformation: {
                label: this.getStatusBarItemTooltip(count)
            }
        });
    }
    getStatusBarItemText(count) {
        return `$(${count ? 'codicon-bell-dot' : 'codicon-bell'}) ${count ? ` ${count}` : ''}`;
    }
    getStatusBarItemTooltip(count) {
        if (this.manager.centerVisible) {
            return nls_1.nls.localizeByDefault('Hide Notifications');
        }
        return count === 0
            ? nls_1.nls.localizeByDefault('No Notifications')
            : count === 1
                ? nls_1.nls.localizeByDefault('1 New Notification')
                : nls_1.nls.localizeByDefault('{0} New Notifications', count.toString());
    }
    registerCommands(commands) {
        commands.registerCommand(notifications_commands_1.NotificationsCommands.TOGGLE, {
            isEnabled: () => true,
            execute: () => this.manager.toggleCenter()
        });
        commands.registerCommand(notifications_commands_1.NotificationsCommands.SHOW, {
            isEnabled: () => true,
            execute: () => this.manager.showCenter()
        });
        commands.registerCommand(notifications_commands_1.NotificationsCommands.HIDE, {
            execute: () => this.manager.hide()
        });
        commands.registerCommand(notifications_commands_1.NotificationsCommands.CLEAR_ALL, {
            execute: () => this.manager.clearAll()
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: notifications_commands_1.NotificationsCommands.HIDE.id,
            when: 'notificationsVisible',
            keybinding: 'esc'
        });
    }
    registerColors(colors) {
        colors.register({
            id: 'notificationCenter.border', defaults: {
                hcDark: 'contrastBorder',
                hcLight: 'contrastBorder'
            }, description: 'Notifications center border color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationToast.border', defaults: {
                hcDark: 'contrastBorder',
                hcLight: 'contrastBorder'
            }, description: 'Notification toast border color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notifications.foreground', defaults: {
                dark: 'editorWidget.foreground',
                light: 'editorWidget.foreground',
                hcDark: 'editorWidget.foreground',
                hcLight: 'editorWidget.foreground'
            }, description: 'Notifications foreground color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notifications.background', defaults: {
                dark: 'editorWidget.background',
                light: 'editorWidget.background',
                hcDark: 'editorWidget.background',
                hcLight: 'editorWidget.background'
            }, description: 'Notifications background color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationLink.foreground', defaults: {
                dark: 'textLink.foreground',
                light: 'textLink.foreground',
                hcDark: 'textLink.foreground',
                hcLight: 'textLink.foreground'
            }, description: 'Notification links foreground color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationCenterHeader.foreground',
            description: 'Notifications center header foreground color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationCenterHeader.background', defaults: {
                dark: color_1.Color.lighten('notifications.background', 0.3),
                light: color_1.Color.darken('notifications.background', 0.05),
                hcDark: 'notifications.background',
                hcLight: 'notifications.background'
            }, description: 'Notifications center header background color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notifications.border', defaults: {
                dark: 'notificationCenterHeader.background',
                light: 'notificationCenterHeader.background',
                hcDark: 'notificationCenterHeader.background',
                hcLight: 'notificationCenterHeader.background'
                // eslint-disable-next-line max-len
            }, description: 'Notifications border color separating from other notifications in the notifications center. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationsErrorIcon.foreground', defaults: {
                dark: 'editorError.foreground',
                light: 'editorError.foreground',
                hcDark: 'editorError.foreground',
                hcLight: 'editorError.foreground'
            }, description: 'The color used for the icon of error notifications. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationsWarningIcon.foreground', defaults: {
                dark: 'editorWarning.foreground',
                light: 'editorWarning.foreground',
                hcDark: 'editorWarning.foreground',
                hcLight: 'editorWarning.foreground'
            }, description: 'The color used for the icon of warning notifications. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationsInfoIcon.foreground', defaults: {
                dark: 'editorInfo.foreground',
                light: 'editorInfo.foreground',
                hcDark: 'editorInfo.foreground',
                hcLight: 'editorInfo.foreground'
            }, description: 'The color used for the icon of info notifications. Notifications slide in from the bottom right of the window.'
        });
    }
    registerThemeStyle(theme, collector) {
        const notificationsBackground = theme.getColor('notifications.background');
        if (notificationsBackground) {
            collector.addRule(`
                .theia-notification-list-item-container {
                    background-color: ${notificationsBackground};
                }
            `);
        }
        const notificationHover = theme.getColor('list.hoverBackground');
        if (notificationHover) {
            collector.addRule(`
                .theia-notification-list-item:hover:not(:focus) {
                    background-color: ${notificationHover};
                }
            `);
        }
        const focusBorder = theme.getColor('focusBorder');
        if (focusBorder && (0, theme_1.isHighContrast)(theme.type)) {
            collector.addRule(`
                .theia-notification-list-item:hover:not(:focus) {
                    outline: 1px dashed ${focusBorder};
                    outline-offset: -2px;
                }
            `);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(notifications_manager_1.NotificationManager),
    __metadata("design:type", notifications_manager_1.NotificationManager)
], NotificationsContribution.prototype, "manager", void 0);
__decorate([
    (0, inversify_1.inject)(notifications_renderer_1.NotificationsRenderer),
    __metadata("design:type", notifications_renderer_1.NotificationsRenderer)
], NotificationsContribution.prototype, "notificationsRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StatusBar),
    __metadata("design:type", Object)
], NotificationsContribution.prototype, "statusBar", void 0);
NotificationsContribution = __decorate([
    (0, inversify_1.injectable)()
], NotificationsContribution);
exports.NotificationsContribution = NotificationsContribution;
//# sourceMappingURL=notifications-contribution.js.map