"use strict";
// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TimelineTreeWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineItemNode = exports.TimelineTreeWidget = exports.TIMELINE_ITEM_CONTEXT_MENU = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const tree_1 = require("@theia/core/lib/browser/tree");
const browser_1 = require("@theia/core/lib/browser");
const timeline_tree_model_1 = require("./timeline-tree-model");
const timeline_service_1 = require("./timeline-service");
const timeline_context_key_service_1 = require("./timeline-context-key-service");
const React = require("@theia/core/shared/react");
exports.TIMELINE_ITEM_CONTEXT_MENU = ['timeline-item-context-menu'];
let TimelineTreeWidget = TimelineTreeWidget_1 = class TimelineTreeWidget extends tree_1.TreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        this.id = TimelineTreeWidget_1.ID;
        this.addClass('timeline-outer-container');
    }
    renderNode(node, props) {
        const attributes = this.createNodeAttributes(node, props);
        const content = React.createElement(TimelineItemNode, { timelineItem: node.timelineItem, commandRegistry: this.commandRegistry, contextKeys: this.contextKeys, contextMenuRenderer: this.contextMenuRenderer });
        return React.createElement('div', attributes, content);
    }
    handleEnter(event) {
        var _a;
        const node = this.model.getFocusedNode();
        const command = (_a = node === null || node === void 0 ? void 0 : node.timelineItem) === null || _a === void 0 ? void 0 : _a.command;
        if (command) {
            this.commandRegistry.executeCommand(command.id, ...(command.arguments ? command.arguments : []));
        }
    }
    async handleLeft(event) {
        this.model.selectPrevNode();
    }
};
TimelineTreeWidget.ID = 'timeline-tree-widget';
TimelineTreeWidget.PAGE_SIZE = 20;
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], TimelineTreeWidget.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(timeline_context_key_service_1.TimelineContextKeyService),
    __metadata("design:type", timeline_context_key_service_1.TimelineContextKeyService)
], TimelineTreeWidget.prototype, "contextKeys", void 0);
__decorate([
    (0, inversify_1.inject)(timeline_service_1.TimelineService),
    __metadata("design:type", timeline_service_1.TimelineService)
], TimelineTreeWidget.prototype, "timelineService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], TimelineTreeWidget.prototype, "commandRegistry", void 0);
TimelineTreeWidget = TimelineTreeWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tree_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(timeline_tree_model_1.TimelineTreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, timeline_tree_model_1.TimelineTreeModel,
        browser_1.ContextMenuRenderer])
], TimelineTreeWidget);
exports.TimelineTreeWidget = TimelineTreeWidget;
class TimelineItemNode extends React.Component {
    constructor() {
        super(...arguments);
        this.open = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const command = this.props.timelineItem.command;
            if (command) {
                this.props.commandRegistry.executeCommand(command.id, ...command.arguments ? command.arguments : []);
            }
        };
        this.renderContextMenu = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const { timelineItem, contextKeys, contextMenuRenderer } = this.props;
            const currentTimelineItem = contextKeys.timelineItem.get();
            contextKeys.timelineItem.set(timelineItem.contextValue);
            try {
                contextMenuRenderer.render({
                    menuPath: exports.TIMELINE_ITEM_CONTEXT_MENU,
                    anchor: event.nativeEvent,
                    args: [timelineItem]
                });
            }
            finally {
                contextKeys.timelineItem.set(currentTimelineItem);
            }
        };
    }
    render() {
        const { label, description, detail } = this.props.timelineItem;
        return React.createElement("div", { className: 'timeline-item', title: detail, onContextMenu: this.renderContextMenu, onClick: this.open },
            React.createElement("div", { className: `noWrapInfo ${tree_1.TREE_NODE_SEGMENT_GROW_CLASS}` },
                React.createElement("span", { className: 'name' }, label),
                React.createElement("span", { className: 'label' }, description)));
    }
}
exports.TimelineItemNode = TimelineItemNode;
//# sourceMappingURL=timeline-tree-widget.js.map