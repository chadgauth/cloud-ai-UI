"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveFileDialog = exports.OpenFileDialog = exports.FileDialog = exports.SaveFileDialogProps = exports.OpenFileDialogProps = exports.FileDialogProps = exports.TOOLBAR_ITEM_TRANSFORM_TIMEOUT = exports.CONTROL_PANEL_CLASS = exports.FILENAME_TEXTFIELD_CLASS = exports.FILENAME_LABEL_CLASS = exports.FILENAME_PANEL_CLASS = exports.FILTERS_LIST_PANEL_CLASS = exports.FILTERS_LABEL_CLASS = exports.FILTERS_PANEL_CLASS = exports.NAVIGATION_LOCATION_LIST_PANEL_CLASS = exports.NAVIGATION_UP_CLASS = exports.NAVIGATION_HOME_CLASS = exports.NAVIGATION_FORWARD_CLASS = exports.NAVIGATION_BACK_CLASS = exports.NAVIGATION_PANEL_CLASS = exports.SAVE_DIALOG_CLASS = exports.SaveFileDialogFactory = exports.OpenFileDialogFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const location_1 = require("../location");
const file_dialog_widget_1 = require("./file-dialog-widget");
const file_dialog_tree_filters_renderer_1 = require("./file-dialog-tree-filters-renderer");
const widgets_1 = require("@theia/core/shared/@phosphor/widgets");
const DOMPurify = require("@theia/core/shared/dompurify");
const file_dialog_hidden_files_renderer_1 = require("./file-dialog-hidden-files-renderer");
exports.OpenFileDialogFactory = Symbol('OpenFileDialogFactory');
exports.SaveFileDialogFactory = Symbol('SaveFileDialogFactory');
exports.SAVE_DIALOG_CLASS = 'theia-SaveFileDialog';
exports.NAVIGATION_PANEL_CLASS = 'theia-NavigationPanel';
exports.NAVIGATION_BACK_CLASS = 'theia-NavigationBack';
exports.NAVIGATION_FORWARD_CLASS = 'theia-NavigationForward';
exports.NAVIGATION_HOME_CLASS = 'theia-NavigationHome';
exports.NAVIGATION_UP_CLASS = 'theia-NavigationUp';
exports.NAVIGATION_LOCATION_LIST_PANEL_CLASS = 'theia-LocationListPanel';
exports.FILTERS_PANEL_CLASS = 'theia-FiltersPanel';
exports.FILTERS_LABEL_CLASS = 'theia-FiltersLabel';
exports.FILTERS_LIST_PANEL_CLASS = 'theia-FiltersListPanel';
exports.FILENAME_PANEL_CLASS = 'theia-FileNamePanel';
exports.FILENAME_LABEL_CLASS = 'theia-FileNameLabel';
exports.FILENAME_TEXTFIELD_CLASS = 'theia-FileNameTextField';
exports.CONTROL_PANEL_CLASS = 'theia-ControlPanel';
exports.TOOLBAR_ITEM_TRANSFORM_TIMEOUT = 100;
class FileDialogProps extends browser_1.DialogProps {
}
exports.FileDialogProps = FileDialogProps;
let OpenFileDialogProps = class OpenFileDialogProps extends FileDialogProps {
};
OpenFileDialogProps = __decorate([
    (0, inversify_1.injectable)()
], OpenFileDialogProps);
exports.OpenFileDialogProps = OpenFileDialogProps;
let SaveFileDialogProps = class SaveFileDialogProps extends FileDialogProps {
};
SaveFileDialogProps = __decorate([
    (0, inversify_1.injectable)()
], SaveFileDialogProps);
exports.SaveFileDialogProps = SaveFileDialogProps;
let FileDialog = class FileDialog extends browser_1.AbstractDialog {
    constructor(props) {
        super(props);
        this.props = props;
    }
    init() {
        this.treePanel = new widgets_1.Panel();
        this.treePanel.addWidget(this.widget);
        this.toDispose.push(this.treePanel);
        this.toDispose.push(this.model.onChanged(() => this.update()));
        this.toDispose.push(this.model.onDidOpenFile(() => this.accept()));
        this.toDispose.push(this.model.onSelectionChanged(() => this.update()));
        const navigationPanel = document.createElement('div');
        navigationPanel.classList.add(exports.NAVIGATION_PANEL_CLASS);
        this.contentNode.appendChild(navigationPanel);
        navigationPanel.appendChild(this.back = (0, browser_1.createIconButton)(...(0, browser_1.codiconArray)('chevron-left', true)));
        this.back.classList.add(exports.NAVIGATION_BACK_CLASS);
        this.back.title = common_1.nls.localize('theia/filesystem/dialog/navigateBack', 'Navigate Back');
        navigationPanel.appendChild(this.forward = (0, browser_1.createIconButton)(...(0, browser_1.codiconArray)('chevron-right', true)));
        this.forward.classList.add(exports.NAVIGATION_FORWARD_CLASS);
        this.forward.title = common_1.nls.localize('theia/filesystem/dialog/navigateForward', 'Navigate Forward');
        navigationPanel.appendChild(this.home = (0, browser_1.createIconButton)(...(0, browser_1.codiconArray)('home', true)));
        this.home.classList.add(exports.NAVIGATION_HOME_CLASS);
        this.home.title = common_1.nls.localize('theia/filesystem/dialog/initialLocation', 'Go To Initial Location');
        navigationPanel.appendChild(this.up = (0, browser_1.createIconButton)(...(0, browser_1.codiconArray)('arrow-up', true)));
        this.up.classList.add(exports.NAVIGATION_UP_CLASS);
        this.up.title = common_1.nls.localize('theia/filesystem/dialog/navigateUp', 'Navigate Up One Directory');
        const locationListRendererHost = document.createElement('div');
        this.locationListRenderer = this.locationListFactory({ model: this.model, host: locationListRendererHost });
        this.toDispose.push(this.locationListRenderer);
        this.locationListRenderer.host.classList.add(exports.NAVIGATION_LOCATION_LIST_PANEL_CLASS);
        navigationPanel.appendChild(this.locationListRenderer.host);
        this.hiddenFilesToggleRenderer = this.hiddenFilesToggleFactory(this.widget.model.tree);
        this.contentNode.appendChild(this.hiddenFilesToggleRenderer.host);
        if (this.props.filters) {
            this.treeFiltersRenderer = this.treeFiltersFactory({ suppliedFilters: this.props.filters, fileDialogTree: this.widget.model.tree });
            const filters = Object.keys(this.props.filters);
            if (filters.length) {
                this.widget.model.tree.setFilter(this.props.filters[filters[0]]);
            }
        }
    }
    get model() {
        return this.widget.model;
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        (0, browser_1.setEnabled)(this.back, this.model.canNavigateBackward());
        (0, browser_1.setEnabled)(this.forward, this.model.canNavigateForward());
        (0, browser_1.setEnabled)(this.home, !!this.model.initialLocation
            && !!this.model.location
            && this.model.initialLocation.toString() !== this.model.location.toString());
        (0, browser_1.setEnabled)(this.up, this.model.canNavigateUpward());
        this.locationListRenderer.render();
        if (this.treeFiltersRenderer) {
            this.treeFiltersRenderer.render();
        }
        this.widget.update();
    }
    handleEnter(event) {
        if (event.target instanceof HTMLTextAreaElement || this.targetIsDirectoryInput(event.target) || this.targetIsInputToggle(event.target)) {
            return false;
        }
        this.accept();
    }
    handleEscape(event) {
        if (event.target instanceof HTMLTextAreaElement || this.targetIsDirectoryInput(event.target)) {
            return false;
        }
        this.close();
    }
    targetIsDirectoryInput(target) {
        return target instanceof HTMLInputElement && target.classList.contains(location_1.LocationListRenderer.Styles.LOCATION_TEXT_INPUT_CLASS);
    }
    targetIsInputToggle(target) {
        return target instanceof HTMLSpanElement && target.classList.contains(location_1.LocationListRenderer.Styles.LOCATION_INPUT_TOGGLE_CLASS);
    }
    appendFiltersPanel() {
        if (this.treeFiltersRenderer) {
            const filtersPanel = document.createElement('div');
            filtersPanel.classList.add(exports.FILTERS_PANEL_CLASS);
            this.contentNode.appendChild(filtersPanel);
            const titlePanel = document.createElement('div');
            titlePanel.innerHTML = DOMPurify.sanitize(common_1.nls.localize('theia/filesystem/format', 'Format:'));
            titlePanel.classList.add(exports.FILTERS_LABEL_CLASS);
            filtersPanel.appendChild(titlePanel);
            this.treeFiltersRenderer.host.classList.add(exports.FILTERS_LIST_PANEL_CLASS);
            filtersPanel.appendChild(this.treeFiltersRenderer.host);
        }
    }
    onAfterAttach(msg) {
        browser_1.Widget.attach(this.treePanel, this.contentNode);
        this.toDisposeOnDetach.push(common_1.Disposable.create(() => {
            browser_1.Widget.detach(this.treePanel);
            this.locationListRenderer.dispose();
            if (this.treeFiltersRenderer) {
                this.treeFiltersRenderer.dispose();
            }
        }));
        this.appendFiltersPanel();
        this.appendCloseButton(common_1.nls.localizeByDefault('Cancel'));
        this.appendAcceptButton(this.getAcceptButtonLabel());
        this.addKeyListener(this.back, browser_1.Key.ENTER, () => {
            this.addTransformEffectToIcon(this.back);
            this.model.navigateBackward();
        }, 'click');
        this.addKeyListener(this.forward, browser_1.Key.ENTER, () => {
            this.addTransformEffectToIcon(this.forward);
            this.model.navigateForward();
        }, 'click');
        this.addKeyListener(this.home, browser_1.Key.ENTER, () => {
            this.addTransformEffectToIcon(this.home);
            if (this.model.initialLocation) {
                this.model.location = this.model.initialLocation;
            }
        }, 'click');
        this.addKeyListener(this.up, browser_1.Key.ENTER, () => {
            this.addTransformEffectToIcon(this.up);
            if (this.model.location) {
                this.model.location = this.model.location.parent;
            }
        }, 'click');
        super.onAfterAttach(msg);
    }
    addTransformEffectToIcon(element) {
        const icon = element.getElementsByTagName('i')[0];
        icon.classList.add('active');
        setTimeout(() => icon.classList.remove('active'), exports.TOOLBAR_ITEM_TRANSFORM_TIMEOUT);
    }
    onActivateRequest(msg) {
        this.widget.activate();
    }
};
__decorate([
    (0, inversify_1.inject)(file_dialog_widget_1.FileDialogWidget),
    __metadata("design:type", file_dialog_widget_1.FileDialogWidget)
], FileDialog.prototype, "widget", void 0);
__decorate([
    (0, inversify_1.inject)(location_1.LocationListRendererFactory),
    __metadata("design:type", Function)
], FileDialog.prototype, "locationListFactory", void 0);
__decorate([
    (0, inversify_1.inject)(file_dialog_tree_filters_renderer_1.FileDialogTreeFiltersRendererFactory),
    __metadata("design:type", Function)
], FileDialog.prototype, "treeFiltersFactory", void 0);
__decorate([
    (0, inversify_1.inject)(file_dialog_hidden_files_renderer_1.HiddenFilesToggleRendererFactory),
    __metadata("design:type", Function)
], FileDialog.prototype, "hiddenFilesToggleFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileDialog.prototype, "init", null);
FileDialog = __decorate([
    __param(0, (0, inversify_1.inject)(FileDialogProps)),
    __metadata("design:paramtypes", [FileDialogProps])
], FileDialog);
exports.FileDialog = FileDialog;
let OpenFileDialog = class OpenFileDialog extends FileDialog {
    constructor(props) {
        super(props);
        this.props = props;
    }
    init() {
        super.init();
        const { props } = this;
        if (props.canSelectFiles !== undefined) {
            this.widget.disableFileSelection = !props.canSelectFiles;
        }
    }
    getAcceptButtonLabel() {
        return this.props.openLabel ? this.props.openLabel : common_1.nls.localizeByDefault('Open');
    }
    isValid(value) {
        if (value && !this.props.canSelectMany && value instanceof Array) {
            return common_1.nls.localize('theia/filesystem/dialog/multipleItemMessage', 'You can select only one item');
        }
        return '';
    }
    get value() {
        if (this.widget.model.selectedFileStatNodes.length === 1) {
            return this.widget.model.selectedFileStatNodes[0];
        }
        else {
            return this.widget.model.selectedFileStatNodes;
        }
    }
    async accept() {
        const selection = this.value;
        if (!this.props.canSelectFolders
            && !Array.isArray(selection)
            && selection.fileStat.isDirectory) {
            this.widget.model.openNode(selection);
            return;
        }
        super.accept();
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OpenFileDialog.prototype, "init", null);
OpenFileDialog = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(OpenFileDialogProps)),
    __metadata("design:paramtypes", [OpenFileDialogProps])
], OpenFileDialog);
exports.OpenFileDialog = OpenFileDialog;
let SaveFileDialog = class SaveFileDialog extends FileDialog {
    constructor(props) {
        super(props);
        this.props = props;
    }
    init() {
        super.init();
        const { widget } = this;
        widget.addClass(exports.SAVE_DIALOG_CLASS);
    }
    getAcceptButtonLabel() {
        return this.props.saveLabel ? this.props.saveLabel : common_1.nls.localizeByDefault('Save');
    }
    onUpdateRequest(msg) {
        // Update file name field when changing a selection
        if (this.fileNameField) {
            if (this.widget.model.selectedFileStatNodes.length === 1) {
                const node = this.widget.model.selectedFileStatNodes[0];
                if (!node.fileStat.isDirectory) {
                    this.fileNameField.value = this.labelProvider.getName(node);
                }
            }
            else {
                this.fileNameField.value = '';
            }
        }
        // Continue updating the dialog
        super.onUpdateRequest(msg);
    }
    isValid(value) {
        if (this.fileNameField && this.fileNameField.value) {
            return '';
        }
        return false;
    }
    get value() {
        if (this.fileNameField && this.widget.model.selectedFileStatNodes.length === 1) {
            const node = this.widget.model.selectedFileStatNodes[0];
            if (node.fileStat.isDirectory) {
                return node.uri.resolve(this.fileNameField.value);
            }
            return node.uri.parent.resolve(this.fileNameField.value);
        }
        return undefined;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        const fileNamePanel = document.createElement('div');
        fileNamePanel.classList.add(exports.FILENAME_PANEL_CLASS);
        this.contentNode.appendChild(fileNamePanel);
        const titlePanel = document.createElement('div');
        titlePanel.innerHTML = DOMPurify.sanitize(common_1.nls.localize('theia/filesystem/dialog/name', 'Name:'));
        titlePanel.classList.add(exports.FILENAME_LABEL_CLASS);
        fileNamePanel.appendChild(titlePanel);
        this.fileNameField = document.createElement('input');
        this.fileNameField.type = 'text';
        this.fileNameField.spellcheck = false;
        this.fileNameField.classList.add('theia-input', exports.FILENAME_TEXTFIELD_CLASS);
        this.fileNameField.value = this.props.inputValue || '';
        fileNamePanel.appendChild(this.fileNameField);
        this.fileNameField.onkeyup = () => this.validate();
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], SaveFileDialog.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SaveFileDialog.prototype, "init", null);
SaveFileDialog = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(SaveFileDialogProps)),
    __metadata("design:paramtypes", [SaveFileDialogProps])
], SaveFileDialog);
exports.SaveFileDialog = SaveFileDialog;
//# sourceMappingURL=file-dialog.js.map