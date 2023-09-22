"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_filesystem_lib_browser_breadcrumbs_filepath-breadcrumb_js-packages_filesystem_lib_br-eff824"],{

/***/ "../../packages/core/lib/common/selection-command-handler.js":
/*!*******************************************************************!*\
  !*** ../../packages/core/lib/common/selection-command-handler.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectionCommandHandler = void 0;
class SelectionCommandHandler {
    constructor(selectionService, toSelection, options) {
        this.selectionService = selectionService;
        this.toSelection = toSelection;
        this.options = options;
    }
    execute(...args) {
        const selection = this.getSelection(...args);
        return selection ? this.options.execute(selection, ...args) : undefined;
    }
    isVisible(...args) {
        const selection = this.getSelection(...args);
        return !!selection && (!this.options.isVisible || this.options.isVisible(selection, ...args));
    }
    isEnabled(...args) {
        const selection = this.getSelection(...args);
        return !!selection && (!this.options.isEnabled || this.options.isEnabled(selection, ...args));
    }
    isMulti() {
        return this.options && !!this.options.multi;
    }
    getSelection(...args) {
        const givenSelection = args.length && this.toSelection(args[0]);
        if (givenSelection) {
            return this.isMulti() ? [givenSelection] : givenSelection;
        }
        const globalSelection = this.getSingleSelection(this.selectionService.selection);
        if (this.isMulti()) {
            return this.getMultiSelection(globalSelection);
        }
        return this.getSingleSelection(globalSelection);
    }
    getSingleSelection(arg) {
        let selection = this.toSelection(arg);
        if (selection) {
            return selection;
        }
        if (Array.isArray(arg)) {
            for (const element of arg) {
                selection = this.toSelection(element);
                if (selection) {
                    return selection;
                }
            }
        }
        return undefined;
    }
    getMultiSelection(arg) {
        let selection = this.toSelection(arg);
        if (selection) {
            return [selection];
        }
        const result = [];
        if (Array.isArray(arg)) {
            for (const element of arg) {
                selection = this.toSelection(element);
                if (selection) {
                    result.push(selection);
                }
            }
        }
        return result.length ? result : undefined;
    }
}
exports.SelectionCommandHandler = SelectionCommandHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/selection-command-handler'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumb.js":
/*!********************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumb.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilepathBreadcrumb = void 0;
const filepath_breadcrumbs_contribution_1 = __webpack_require__(/*! ./filepath-breadcrumbs-contribution */ "../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-contribution.js");
class FilepathBreadcrumb {
    constructor(uri, label, longLabel, iconClass, containerClass) {
        this.uri = uri;
        this.label = label;
        this.longLabel = longLabel;
        this.iconClass = iconClass;
        this.containerClass = containerClass;
    }
    get id() {
        return this.type.toString() + '_' + this.uri.toString();
    }
    get type() {
        return filepath_breadcrumbs_contribution_1.FilepathBreadcrumbType;
    }
}
exports.FilepathBreadcrumb = FilepathBreadcrumb;
(function (FilepathBreadcrumb) {
    function is(breadcrumb) {
        return 'uri' in breadcrumb;
    }
    FilepathBreadcrumb.is = is;
})(FilepathBreadcrumb = exports.FilepathBreadcrumb || (exports.FilepathBreadcrumb = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/breadcrumbs/filepath-breadcrumb'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-container.js":
/*!*******************************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-container.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BreadcrumbsFileTreeWidget = exports.createFileTreeBreadcrumbsWidget = exports.createFileTreeBreadcrumbsContainer = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_tree_1 = __webpack_require__(/*! ../file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js");
const BREADCRUMBS_FILETREE_CLASS = 'theia-FilepathBreadcrumbFileTree';
function createFileTreeBreadcrumbsContainer(parent) {
    const child = (0, file_tree_1.createFileTreeContainer)(parent);
    child.unbind(file_tree_1.FileTreeWidget);
    child.rebind(browser_1.TreeProps).toConstantValue({ ...browser_1.defaultTreeProps, virtualized: false });
    child.bind(BreadcrumbsFileTreeWidget).toSelf();
    return child;
}
exports.createFileTreeBreadcrumbsContainer = createFileTreeBreadcrumbsContainer;
function createFileTreeBreadcrumbsWidget(parent) {
    return createFileTreeBreadcrumbsContainer(parent).get(BreadcrumbsFileTreeWidget);
}
exports.createFileTreeBreadcrumbsWidget = createFileTreeBreadcrumbsWidget;
let BreadcrumbsFileTreeWidget = class BreadcrumbsFileTreeWidget extends file_tree_1.FileTreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        this.addClass(BREADCRUMBS_FILETREE_CLASS);
    }
    createNodeAttributes(node, props) {
        const elementAttrs = super.createNodeAttributes(node, props);
        return {
            ...elementAttrs,
            draggable: false
        };
    }
    tapNode(node) {
        if (file_tree_1.FileStatNode.is(node) && !node.fileStat.isDirectory) {
            (0, browser_1.open)(this.openerService, node.uri, { preview: true });
        }
        else {
            super.tapNode(node);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], BreadcrumbsFileTreeWidget.prototype, "openerService", void 0);
BreadcrumbsFileTreeWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(file_tree_1.FileTreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, file_tree_1.FileTreeModel,
        browser_1.ContextMenuRenderer])
], BreadcrumbsFileTreeWidget);
exports.BreadcrumbsFileTreeWidget = BreadcrumbsFileTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-container'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-contribution.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-contribution.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilepathBreadcrumbsContribution = exports.FilepathBreadcrumbType = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const filepath_breadcrumb_1 = __webpack_require__(/*! ./filepath-breadcrumb */ "../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumb.js");
const filepath_breadcrumbs_container_1 = __webpack_require__(/*! ./filepath-breadcrumbs-container */ "../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-container.js");
const file_tree_1 = __webpack_require__(/*! ../file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js");
const file_service_1 = __webpack_require__(/*! ../file-service */ "../../packages/filesystem/lib/browser/file-service.js");
exports.FilepathBreadcrumbType = Symbol('FilepathBreadcrumb');
let FilepathBreadcrumbsContribution = class FilepathBreadcrumbsContribution {
    constructor() {
        this.onDidChangeBreadcrumbsEmitter = new core_1.Emitter();
        this.type = exports.FilepathBreadcrumbType;
        this.priority = 100;
    }
    get onDidChangeBreadcrumbs() {
        return this.onDidChangeBreadcrumbsEmitter.event;
    }
    async computeBreadcrumbs(uri) {
        if (uri.scheme !== 'file') {
            return [];
        }
        const getContainerClass = this.getContainerClassCreator(uri);
        const getIconClass = this.getIconClassCreator(uri);
        return uri.allLocations
            .map((location, index) => {
            const icon = getIconClass(location, index);
            const containerClass = getContainerClass(location, index);
            return new filepath_breadcrumb_1.FilepathBreadcrumb(location, this.labelProvider.getName(location), this.labelProvider.getLongName(location), icon, containerClass);
        })
            .filter(b => this.filterBreadcrumbs(uri, b))
            .reverse();
    }
    getContainerClassCreator(fileURI) {
        return (location, index) => location.isEqual(fileURI) ? 'file' : 'folder';
    }
    getIconClassCreator(fileURI) {
        return (location, index) => location.isEqual(fileURI) ? this.labelProvider.getIcon(location) + ' file-icon' : '';
    }
    filterBreadcrumbs(_, breadcrumb) {
        return !breadcrumb.uri.path.isRoot;
    }
    async attachPopupContent(breadcrumb, parent) {
        if (!filepath_breadcrumb_1.FilepathBreadcrumb.is(breadcrumb)) {
            return undefined;
        }
        const folderFileStat = await this.fileSystem.resolve(breadcrumb.uri.parent);
        if (folderFileStat) {
            const rootNode = await this.createRootNode(folderFileStat);
            if (rootNode) {
                const { model } = this.breadcrumbsFileTreeWidget;
                await model.navigateTo({ ...rootNode, visible: false });
                browser_1.Widget.attach(this.breadcrumbsFileTreeWidget, parent);
                const toDisposeOnTreePopulated = model.onChanged(() => {
                    if (browser_1.CompositeTreeNode.is(model.root) && model.root.children.length > 0) {
                        toDisposeOnTreePopulated.dispose();
                        const targetNode = model.getNode(breadcrumb.uri.path.toString());
                        if (targetNode && browser_1.SelectableTreeNode.is(targetNode)) {
                            model.selectNode(targetNode);
                        }
                        this.breadcrumbsFileTreeWidget.activate();
                    }
                });
                return {
                    dispose: () => {
                        // Clear model otherwise the next time a popup is opened the old model is rendered first
                        // and is shown for a short time period.
                        toDisposeOnTreePopulated.dispose();
                        this.breadcrumbsFileTreeWidget.model.root = undefined;
                        browser_1.Widget.detach(this.breadcrumbsFileTreeWidget);
                    }
                };
            }
        }
    }
    async createRootNode(folderToOpen) {
        const folderUri = folderToOpen.resource;
        const rootUri = folderToOpen.isDirectory ? folderUri : folderUri.parent;
        const rootStat = await this.fileSystem.resolve(rootUri);
        if (rootStat) {
            return file_tree_1.DirNode.createRoot(rootStat);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], FilepathBreadcrumbsContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FilepathBreadcrumbsContribution.prototype, "fileSystem", void 0);
__decorate([
    (0, inversify_1.inject)(filepath_breadcrumbs_container_1.BreadcrumbsFileTreeWidget),
    __metadata("design:type", filepath_breadcrumbs_container_1.BreadcrumbsFileTreeWidget)
], FilepathBreadcrumbsContribution.prototype, "breadcrumbsFileTreeWidget", void 0);
FilepathBreadcrumbsContribution = __decorate([
    (0, inversify_1.injectable)()
], FilepathBreadcrumbsContribution);
exports.FilepathBreadcrumbsContribution = FilepathBreadcrumbsContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-contribution'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-selection.js":
/*!***************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-selection.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileSelection = void 0;
const selection_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/selection-command-handler */ "../../packages/core/lib/common/selection-command-handler.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const files_1 = __webpack_require__(/*! ../common/files */ "../../packages/filesystem/lib/common/files.js");
var FileSelection;
(function (FileSelection) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && files_1.FileStat.is(arg.fileStat);
    }
    FileSelection.is = is;
    class CommandHandler extends selection_command_handler_1.SelectionCommandHandler {
        constructor(selectionService, options) {
            super(selectionService, arg => FileSelection.is(arg) ? arg : undefined, options);
            this.selectionService = selectionService;
            this.options = options;
        }
    }
    FileSelection.CommandHandler = CommandHandler;
})(FileSelection = exports.FileSelection || (exports.FileSelection = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-selection'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/filesystem-frontend-contribution.js":
/*!*********************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/filesystem-frontend-contribution.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileSystemFrontendContribution = exports.FileSystemCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const environment_1 = __webpack_require__(/*! @theia/core/shared/@theia/application-package/lib/environment */ "../../packages/core/shared/@theia/application-package/lib/environment/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const mime_service_1 = __webpack_require__(/*! @theia/core/lib/browser/mime-service */ "../../packages/core/lib/browser/mime-service.js");
const tree_widget_selection_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-widget-selection */ "../../packages/core/lib/browser/tree/tree-widget-selection.js");
const filesystem_preferences_1 = __webpack_require__(/*! ./filesystem-preferences */ "../../packages/filesystem/lib/browser/filesystem-preferences.js");
const file_selection_1 = __webpack_require__(/*! ./file-selection */ "../../packages/filesystem/lib/browser/file-selection.js");
const file_upload_service_1 = __webpack_require__(/*! ./file-upload-service */ "../../packages/filesystem/lib/browser/file-upload-service.js");
const file_service_1 = __webpack_require__(/*! ./file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
var FileSystemCommands;
(function (FileSystemCommands) {
    FileSystemCommands.UPLOAD = command_1.Command.toLocalizedCommand({
        id: 'file.upload',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Upload Files...'
    }, 'theia/filesystem/uploadFiles', browser_1.CommonCommands.FILE_CATEGORY_KEY);
})(FileSystemCommands = exports.FileSystemCommands || (exports.FileSystemCommands = {}));
let FileSystemFrontendContribution = class FileSystemFrontendContribution {
    constructor() {
        this.onDidChangeEditorFileEmitter = new common_1.Emitter();
        this.onDidChangeEditorFile = this.onDidChangeEditorFileEmitter.event;
        this.userOperations = new Map();
        this.pendingOperation = Promise.resolve();
        this.moveSnapshots = new Map();
        this.deletedSuffix = `(${core_1.nls.localizeByDefault('Deleted')})`;
    }
    queueUserOperation(event) {
        const moveOperation = new promise_util_1.Deferred();
        this.userOperations.set(event.correlationId, moveOperation);
        this.run(() => moveOperation.promise);
    }
    resolveUserOperation(event) {
        const operation = this.userOperations.get(event.correlationId);
        if (operation) {
            this.userOperations.delete(event.correlationId);
            operation.resolve();
        }
    }
    initialize() {
        this.fileService.onDidFilesChange(event => this.run(() => this.updateWidgets(event)));
        this.fileService.onWillRunUserOperation(event => {
            this.queueUserOperation(event);
            event.waitUntil(this.runEach((uri, widget) => this.pushMove(uri, widget, event)));
        });
        this.fileService.onDidFailUserOperation(event => event.waitUntil((async () => {
            await this.runEach((uri, widget) => this.revertMove(uri, widget, event));
            this.resolveUserOperation(event);
        })()));
        this.fileService.onDidRunUserOperation(event => event.waitUntil((async () => {
            await this.runEach((uri, widget) => this.applyMove(uri, widget, event));
            this.resolveUserOperation(event);
        })()));
    }
    onStart(app) {
        this.updateAssociations();
        this.preferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'files.associations') {
                this.updateAssociations();
            }
        });
    }
    registerCommands(commands) {
        commands.registerCommand(FileSystemCommands.UPLOAD, {
            isEnabled: (...args) => {
                const selection = this.getSelection(...args);
                return !!selection && this.canUpload(selection);
            },
            isVisible: () => !environment_1.environment.electron.is(),
            execute: (...args) => {
                const selection = this.getSelection(...args);
                if (selection) {
                    return this.upload(selection);
                }
            }
        });
    }
    canUpload({ fileStat }) {
        return !environment_1.environment.electron.is() && fileStat.isDirectory;
    }
    async upload(selection) {
        try {
            const source = tree_widget_selection_1.TreeWidgetSelection.getSource(this.selectionService.selection);
            const fileUploadResult = await this.uploadService.upload(selection.fileStat.resource);
            if (browser_1.ExpandableTreeNode.is(selection) && source) {
                await source.model.expandNode(selection);
            }
            return fileUploadResult;
        }
        catch (e) {
            if (!(0, common_1.isCancelled)(e)) {
                console.error(e);
            }
        }
    }
    getSelection(...args) {
        var _a;
        const { selection } = this.selectionService;
        return (_a = this.toSelection(args[0])) !== null && _a !== void 0 ? _a : (Array.isArray(selection) ? selection.find(file_selection_1.FileSelection.is) : this.toSelection(selection));
    }
    ;
    toSelection(arg) {
        return file_selection_1.FileSelection.is(arg) ? arg : undefined;
    }
    run(operation) {
        return this.pendingOperation = this.pendingOperation.then(async () => {
            try {
                await operation();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    async runEach(participant) {
        const promises = [];
        for (const [resourceUri, widget] of browser_1.NavigatableWidget.get(this.shell.widgets)) {
            promises.push(participant(resourceUri, widget));
        }
        await Promise.all(promises);
    }
    popMoveSnapshot(resourceUri) {
        const snapshotKey = resourceUri.toString();
        const snapshot = this.moveSnapshots.get(snapshotKey);
        if (snapshot) {
            this.moveSnapshots.delete(snapshotKey);
        }
        return snapshot;
    }
    applyMoveSnapshot(widget, snapshot) {
        if (!snapshot) {
            return undefined;
        }
        if (snapshot.dirty) {
            const saveable = browser_1.Saveable.get(widget);
            if (saveable && saveable.applySnapshot) {
                saveable.applySnapshot(snapshot.dirty);
            }
        }
        if (snapshot.view && browser_1.StatefulWidget.is(widget)) {
            widget.restoreState(snapshot.view);
        }
    }
    async pushMove(resourceUri, widget, event) {
        const newResourceUri = this.createMoveToUri(resourceUri, widget, event);
        if (!newResourceUri) {
            return;
        }
        const snapshot = {};
        const saveable = browser_1.Saveable.get(widget);
        if (browser_1.StatefulWidget.is(widget)) {
            snapshot.view = widget.storeState();
        }
        if (saveable && saveable.dirty) {
            if (saveable.createSnapshot) {
                snapshot.dirty = saveable.createSnapshot();
            }
            if (saveable.revert) {
                await saveable.revert({ soft: true });
            }
        }
        this.moveSnapshots.set(newResourceUri.toString(), snapshot);
    }
    async revertMove(resourceUri, widget, event) {
        const newResourceUri = this.createMoveToUri(resourceUri, widget, event);
        if (!newResourceUri) {
            return;
        }
        const snapshot = this.popMoveSnapshot(newResourceUri);
        this.applyMoveSnapshot(widget, snapshot);
    }
    async applyMove(resourceUri, widget, event) {
        const newResourceUri = this.createMoveToUri(resourceUri, widget, event);
        if (!newResourceUri) {
            return;
        }
        const snapshot = this.popMoveSnapshot(newResourceUri);
        const description = this.widgetManager.getDescription(widget);
        if (!description) {
            return;
        }
        const { factoryId, options } = description;
        if (!browser_1.NavigatableWidgetOptions.is(options)) {
            return;
        }
        const newWidget = await this.widgetManager.getOrCreateWidget(factoryId, {
            ...options,
            uri: newResourceUri.toString()
        });
        this.applyMoveSnapshot(newWidget, snapshot);
        const area = this.shell.getAreaFor(widget) || 'main';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pending = [this.shell.addWidget(newWidget, {
                area, ref: widget
            })];
        if (this.shell.activeWidget === widget) {
            pending.push(this.shell.activateWidget(newWidget.id));
        }
        else if (widget.isVisible) {
            pending.push(this.shell.revealWidget(newWidget.id));
        }
        pending.push(this.shell.closeWidget(widget.id, { save: false }));
        await Promise.all(pending);
    }
    createMoveToUri(resourceUri, widget, event) {
        var _a;
        if (event.operation !== 2 /* MOVE */) {
            return undefined;
        }
        const path = (_a = event.source) === null || _a === void 0 ? void 0 : _a.relative(resourceUri);
        const targetUri = path && event.target.resolve(path);
        return targetUri && widget.createMoveToUri(targetUri);
    }
    async updateWidgets(event) {
        if (!event.gotDeleted() && !event.gotAdded()) {
            return;
        }
        const dirty = new Set();
        const toClose = new Map();
        for (const [uri, widget] of browser_1.NavigatableWidget.get(this.shell.widgets)) {
            this.updateWidget(uri, widget, event, { dirty, toClose: toClose });
        }
        if (this.corePreferences['workbench.editor.closeOnFileDelete']) {
            const doClose = [];
            for (const [uri, widgets] of toClose.entries()) {
                if (!dirty.has(uri)) {
                    doClose.push(...widgets);
                }
            }
            await this.shell.closeMany(doClose);
        }
    }
    updateWidget(uri, widget, event, { dirty, toClose }) {
        const label = widget.title.label;
        const deleted = label.endsWith(this.deletedSuffix);
        if (event.contains(uri, 2 /* DELETED */)) {
            const uriString = uri.toString();
            if (browser_1.Saveable.isDirty(widget)) {
                dirty.add(uriString);
            }
            if (!deleted) {
                widget.title.label += this.deletedSuffix;
                this.onDidChangeEditorFileEmitter.fire({ editor: widget, type: 2 /* DELETED */ });
            }
            const widgets = toClose.get(uriString) || [];
            widgets.push(widget);
            toClose.set(uriString, widgets);
        }
        else if (event.contains(uri, 1 /* ADDED */)) {
            if (deleted) {
                widget.title.label = widget.title.label.substring(0, label.length - this.deletedSuffix.length);
                this.onDidChangeEditorFileEmitter.fire({ editor: widget, type: 1 /* ADDED */ });
            }
        }
    }
    updateAssociations() {
        const fileAssociations = this.preferences['files.associations'];
        const mimeAssociations = Object.keys(fileAssociations).map(filepattern => ({ id: fileAssociations[filepattern], filepattern }));
        this.mimeService.setAssociations(mimeAssociations);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], FileSystemFrontendContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], FileSystemFrontendContribution.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(mime_service_1.MimeService),
    __metadata("design:type", mime_service_1.MimeService)
], FileSystemFrontendContribution.prototype, "mimeService", void 0);
__decorate([
    (0, inversify_1.inject)(filesystem_preferences_1.FileSystemPreferences),
    __metadata("design:type", Object)
], FileSystemFrontendContribution.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.CorePreferences),
    __metadata("design:type", Object)
], FileSystemFrontendContribution.prototype, "corePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], FileSystemFrontendContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(file_upload_service_1.FileUploadService),
    __metadata("design:type", file_upload_service_1.FileUploadService)
], FileSystemFrontendContribution.prototype, "uploadService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FileSystemFrontendContribution.prototype, "fileService", void 0);
FileSystemFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], FileSystemFrontendContribution);
exports.FileSystemFrontendContribution = FileSystemFrontendContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/filesystem-frontend-contribution'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/filesystem-save-resource-service.js":
/*!*********************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/filesystem-save-resource-service.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilesystemSaveResourceService = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const save_resource_service_1 = __webpack_require__(/*! @theia/core/lib/browser/save-resource-service */ "../../packages/core/lib/browser/save-resource-service.js");
const file_service_1 = __webpack_require__(/*! ./file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const file_dialog_1 = __webpack_require__(/*! ./file-dialog */ "../../packages/filesystem/lib/browser/file-dialog/index.js");
let FilesystemSaveResourceService = class FilesystemSaveResourceService extends save_resource_service_1.SaveResourceService {
    /**
     * This method ensures a few things about `widget`:
     * - `widget.getResourceUri()` actually returns a URI.
     * - `widget.saveable.createSnapshot` is defined.
     * - `widget.saveable.revert` is defined.
     */
    canSaveAs(widget) {
        return widget !== undefined
            && browser_1.Saveable.isSource(widget)
            && typeof widget.saveable.createSnapshot === 'function'
            && typeof widget.saveable.revert === 'function'
            && browser_1.Navigatable.is(widget)
            && widget.getResourceUri() !== undefined;
    }
    /**
     * Save `sourceWidget` to a new file picked by the user.
     */
    async saveAs(sourceWidget, options) {
        let exist = false;
        let overwrite = false;
        let selected;
        const canSave = this.canSaveNotSaveAs(sourceWidget);
        const uri = sourceWidget.getResourceUri();
        do {
            selected = await this.fileDialogService.showSaveDialog({
                title: browser_1.CommonCommands.SAVE_AS.label,
                filters: {},
                inputValue: uri.path.base
            });
            if (selected) {
                exist = await this.fileService.exists(selected);
                if (exist) {
                    overwrite = await this.confirmOverwrite(selected);
                }
            }
        } while ((selected && exist && !overwrite) || ((selected === null || selected === void 0 ? void 0 : selected.isEqual(uri)) && !canSave));
        if (selected && selected.isEqual(uri)) {
            await this.save(sourceWidget, options);
        }
        else if (selected) {
            try {
                await this.copyAndSave(sourceWidget, selected, overwrite);
            }
            catch (e) {
                console.warn(e);
            }
        }
    }
    /**
     * @param sourceWidget widget to save as `target`.
     * @param target The new URI for the widget.
     * @param overwrite
     */
    async copyAndSave(sourceWidget, target, overwrite) {
        const snapshot = sourceWidget.saveable.createSnapshot();
        if (!await this.fileService.exists(target)) {
            const sourceUri = sourceWidget.getResourceUri();
            if (this.fileService.canHandleResource(sourceUri)) {
                await this.fileService.copy(sourceUri, target, { overwrite });
            }
            else {
                await this.fileService.createFile(target);
            }
        }
        const targetWidget = await (0, browser_1.open)(this.openerService, target, { widgetOptions: { ref: sourceWidget } });
        const targetSaveable = browser_1.Saveable.get(targetWidget);
        if (targetWidget && targetSaveable && targetSaveable.applySnapshot) {
            targetSaveable.applySnapshot(snapshot);
            await sourceWidget.saveable.revert();
            sourceWidget.close();
            browser_1.Saveable.save(targetWidget, { formatType: 1 /* ON */ });
        }
        else {
            this.messageService.error(core_1.nls.localize('theia/workspace/failApply', 'Could not apply changes to new file'));
        }
    }
    async confirmOverwrite(uri) {
        // Electron already handles the confirmation so do not prompt again.
        if (this.isElectron()) {
            return true;
        }
        // Prompt users for confirmation before overwriting.
        const confirmed = await new browser_1.ConfirmDialog({
            title: core_1.nls.localizeByDefault('Overwrite'),
            msg: core_1.nls.localizeByDefault('{0} already exists. Are you sure you want to overwrite it?', uri.toString())
        }).open();
        return !!confirmed;
    }
    isElectron() {
        return core_1.environment.electron.is();
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FilesystemSaveResourceService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(file_dialog_1.FileDialogService),
    __metadata("design:type", Object)
], FilesystemSaveResourceService.prototype, "fileDialogService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], FilesystemSaveResourceService.prototype, "openerService", void 0);
FilesystemSaveResourceService = __decorate([
    (0, inversify_1.injectable)()
], FilesystemSaveResourceService);
exports.FilesystemSaveResourceService = FilesystemSaveResourceService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/filesystem-save-resource-service'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_filesystem_lib_browser_breadcrumbs_filepath-breadcrumb_js-packages_filesystem_lib_br-eff824.js.map