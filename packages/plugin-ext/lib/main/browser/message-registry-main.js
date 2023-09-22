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
exports.MessageRegistryMainImpl = void 0;
const message_service_1 = require("@theia/core/lib/common/message-service");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const modal_notification_1 = require("./dialogs/modal-notification");
class MessageRegistryMainImpl {
    constructor(container) {
        this.messageService = container.get(message_service_1.MessageService);
    }
    async $showMessage(type, message, options, actions) {
        const action = await this.doShowMessage(type, message, options, actions);
        const handle = action
            ? actions.map(a => a.title).indexOf(action)
            : undefined;
        return handle === undefined && options.modal ? options.onCloseActionHandle : handle;
    }
    async doShowMessage(type, message, options, actions) {
        if (options.modal) {
            const messageType = type === plugin_api_rpc_1.MainMessageType.Error ? modal_notification_1.MessageType.Error :
                type === plugin_api_rpc_1.MainMessageType.Warning ? modal_notification_1.MessageType.Warning :
                    modal_notification_1.MessageType.Info;
            const modalNotification = new modal_notification_1.ModalNotification();
            return modalNotification.showDialog(messageType, message, options, actions);
        }
        switch (type) {
            case plugin_api_rpc_1.MainMessageType.Info:
                return this.messageService.info(message, ...actions.map(a => a.title));
            case plugin_api_rpc_1.MainMessageType.Warning:
                return this.messageService.warn(message, ...actions.map(a => a.title));
            case plugin_api_rpc_1.MainMessageType.Error:
                return this.messageService.error(message, ...actions.map(a => a.title));
        }
        throw new Error(`Message type '${type}' is not supported yet!`);
    }
}
exports.MessageRegistryMainImpl = MessageRegistryMainImpl;
//# sourceMappingURL=message-registry-main.js.map