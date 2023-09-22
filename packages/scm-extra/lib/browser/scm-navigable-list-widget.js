"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.ScmItemComponent = exports.ScmNavigableListWidget = void 0;
const browser_1 = require("@theia/core/lib/browser");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const uri_1 = require("@theia/core/lib/common/uri");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const domutils_1 = require("@theia/core/shared/@phosphor/domutils");
const inversify_1 = require("@theia/core/shared/inversify");
const react_widget_1 = require("@theia/core/lib/browser/widgets/react-widget");
const React = require("@theia/core/shared/react");
const scm_file_change_label_provider_1 = require("./scm-file-change-label-provider");
let ScmNavigableListWidget = class ScmNavigableListWidget extends react_widget_1.ReactWidget {
    constructor() {
        super();
        this.scmNodes = [];
        this.node.tabIndex = 0;
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.update();
        this.node.focus();
    }
    set scrollContainer(id) {
        this._scrollContainer = id + Date.now();
    }
    get scrollContainer() {
        return this._scrollContainer;
    }
    onUpdateRequest(msg) {
        if (!this.isAttached || !this.isVisible) {
            return;
        }
        super.onUpdateRequest(msg);
        (async () => {
            const selected = this.node.getElementsByClassName(browser_1.SELECTED_CLASS)[0];
            if (selected) {
                const container = document.getElementById(this.scrollContainer);
                if (container) {
                    domutils_1.ElementExt.scrollIntoViewIfNeeded(container, selected);
                }
            }
        })();
    }
    onResize(msg) {
        super.onResize(msg);
        this.update();
    }
    getRepositoryLabel(uri) {
        const repository = this.scmService.findRepository(new uri_1.default(uri));
        const isSelectedRepo = this.scmService.selectedRepository && repository && this.scmService.selectedRepository.provider.rootUri === repository.provider.rootUri;
        return repository && !isSelectedRepo ? this.labelProvider.getLongName(new uri_1.default(repository.provider.rootUri)) : undefined;
    }
    renderHeaderRow({ name, value, classNames, title }) {
        if (!value) {
            return;
        }
        const className = ['header-row', ...(classNames || [])].join(' ');
        return React.createElement("div", { key: name, className: className, title: title },
            React.createElement("div", { className: 'theia-header' }, name),
            React.createElement("div", { className: 'header-value' }, value));
    }
    addListNavigationKeyListeners(container) {
        this.addKeyListener(container, browser_1.Key.ARROW_LEFT, () => this.navigateLeft());
        this.addKeyListener(container, browser_1.Key.ARROW_RIGHT, () => this.navigateRight());
        this.addKeyListener(container, browser_1.Key.ARROW_UP, () => this.navigateUp());
        this.addKeyListener(container, browser_1.Key.ARROW_DOWN, () => this.navigateDown());
        this.addKeyListener(container, browser_1.Key.ENTER, () => this.handleListEnter());
    }
    navigateLeft() {
        this.selectPreviousNode();
    }
    navigateRight() {
        this.selectNextNode();
    }
    navigateUp() {
        this.selectPreviousNode();
    }
    navigateDown() {
        this.selectNextNode();
    }
    handleListEnter() {
    }
    getSelected() {
        return this.scmNodes ? this.scmNodes.find(c => c.selected || false) : undefined;
    }
    selectNode(node) {
        const n = this.getSelected();
        if (n) {
            n.selected = false;
        }
        node.selected = true;
        this.update();
    }
    selectNextNode() {
        const idx = this.indexOfSelected;
        if (idx >= 0 && idx < this.scmNodes.length - 1) {
            this.selectNode(this.scmNodes[idx + 1]);
        }
        else if (this.scmNodes.length > 0 && idx === -1) {
            this.selectNode(this.scmNodes[0]);
        }
    }
    selectPreviousNode() {
        const idx = this.indexOfSelected;
        if (idx > 0) {
            this.selectNode(this.scmNodes[idx - 1]);
        }
    }
    get indexOfSelected() {
        if (this.scmNodes && this.scmNodes.length > 0) {
            return this.scmNodes.findIndex(c => c.selected || false);
        }
        return -1;
    }
};
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmNavigableListWidget.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], ScmNavigableListWidget.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(scm_file_change_label_provider_1.ScmFileChangeLabelProvider),
    __metadata("design:type", scm_file_change_label_provider_1.ScmFileChangeLabelProvider)
], ScmNavigableListWidget.prototype, "scmLabelProvider", void 0);
ScmNavigableListWidget = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ScmNavigableListWidget);
exports.ScmNavigableListWidget = ScmNavigableListWidget;
class ScmItemComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.revealChange = () => this.props.revealChange(this.props.change);
        this.selectNode = () => this.props.selectNode(this.props.change);
    }
    render() {
        const { labelProvider, scmLabelProvider, change } = this.props;
        const icon = labelProvider.getIcon(change);
        const label = labelProvider.getName(change);
        const description = labelProvider.getLongName(change);
        const caption = scmLabelProvider.getCaption(change);
        const statusCaption = scmLabelProvider.getStatusCaption(change);
        return React.createElement("div", { className: `scmItem noselect${change.selected ? ' ' + browser_1.SELECTED_CLASS : ''}`, onDoubleClick: this.revealChange, onClick: this.selectNode },
            React.createElement("span", { className: icon + ' file-icon' }),
            React.createElement("div", { className: 'noWrapInfo', title: caption },
                React.createElement("span", { className: 'name' }, label + ' '),
                React.createElement("span", { className: 'path' }, description)),
            React.createElement("div", { title: caption, className: change.fileChange.getClassNameForStatus() }, statusCaption.charAt(0)));
    }
}
exports.ScmItemComponent = ScmItemComponent;
//# sourceMappingURL=scm-navigable-list-widget.js.map