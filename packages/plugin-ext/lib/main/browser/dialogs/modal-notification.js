"use strict";
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
exports.ModalNotification = exports.MessageType = void 0;
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
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const dialogs_1 = require("@theia/core/lib/browser/dialogs");
require("../../../../src/main/browser/dialogs/style/modal-notification.css");
const frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
const nls_1 = require("@theia/core/lib/common/nls");
var MessageType;
(function (MessageType) {
    MessageType["Error"] = "error";
    MessageType["Warning"] = "warning";
    MessageType["Info"] = "info";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
const NOTIFICATION = 'modal-Notification';
const ICON = 'icon';
const TEXT = 'text';
const DETAIL = 'detail';
let ModalNotification = class ModalNotification extends dialogs_1.AbstractDialog {
    constructor() {
        super({ title: frontend_application_config_provider_1.FrontendApplicationConfigProvider.get().applicationName });
    }
    onCloseRequest(msg) {
        this.actionTitle = undefined;
        this.accept();
    }
    get value() {
        return this.actionTitle;
    }
    showDialog(messageType, text, options, actions) {
        this.contentNode.appendChild(this.createMessageNode(messageType, text, options, actions));
        return this.open();
    }
    createMessageNode(messageType, text, options, actions) {
        const messageNode = document.createElement('div');
        messageNode.classList.add(NOTIFICATION);
        const iconContainer = messageNode.appendChild(document.createElement('div'));
        iconContainer.classList.add(ICON);
        const iconElement = iconContainer.appendChild(document.createElement('i'));
        iconElement.classList.add(...this.toIconClass(messageType), messageType.toString());
        const textContainer = messageNode.appendChild(document.createElement('div'));
        textContainer.classList.add(TEXT);
        const textElement = textContainer.appendChild(document.createElement('p'));
        textElement.textContent = text;
        if (options.detail) {
            const detailContainer = textContainer.appendChild(document.createElement('div'));
            detailContainer.classList.add(DETAIL);
            const detailElement = detailContainer.appendChild(document.createElement('p'));
            detailElement.textContent = options.detail;
        }
        actions.forEach((action, index) => {
            const button = index === 0
                ? this.appendAcceptButton(action.title)
                : this.createButton(action.title);
            button.classList.add('main');
            this.controlPanel.appendChild(button);
            this.addKeyListener(button, browser_1.Key.ENTER, () => {
                this.actionTitle = action.title;
                this.accept();
            }, 'click');
        });
        if (actions.length <= 0) {
            this.appendAcceptButton();
        }
        else if (!actions.some(action => action.isCloseAffordance === true)) {
            this.appendCloseButton(nls_1.nls.localizeByDefault('Close'));
        }
        return messageNode;
    }
    toIconClass(icon) {
        if (icon === MessageType.Error) {
            return (0, browser_1.codiconArray)('error');
        }
        if (icon === MessageType.Warning) {
            return (0, browser_1.codiconArray)('warning');
        }
        return (0, browser_1.codiconArray)('info');
    }
};
ModalNotification = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ModalNotification);
exports.ModalNotification = ModalNotification;
//# sourceMappingURL=modal-notification.js.map