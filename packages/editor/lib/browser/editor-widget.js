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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorWidget = void 0;
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const algorithm_1 = require("@theia/core/shared/@phosphor/algorithm");
class EditorWidget extends browser_1.BaseWidget {
    constructor(editor, selectionService) {
        super(editor);
        this.editor = editor;
        this.selectionService = selectionService;
        this.toDisposeOnTabbarChange = new common_1.DisposableCollection();
        this.addClass('theia-editor');
        if (editor.isReadonly) {
            (0, browser_1.lock)(this.title);
        }
        this.toDispose.push(this.editor);
        this.toDispose.push(this.toDisposeOnTabbarChange);
        this.toDispose.push(this.editor.onSelectionChanged(() => this.setSelection()));
        this.toDispose.push(this.editor.onFocusChanged(() => this.setSelection()));
        this.toDispose.push(common_1.Disposable.create(() => {
            if (this.selectionService.selection === this.editor) {
                this.selectionService.selection = undefined;
            }
        }));
    }
    setSelection() {
        if (this.editor.isFocused() && this.selectionService.selection !== this.editor) {
            this.selectionService.selection = this.editor;
        }
    }
    get saveable() {
        return this.editor.document;
    }
    getResourceUri() {
        return this.editor.getResourceUri();
    }
    createMoveToUri(resourceUri) {
        return this.editor.createMoveToUri(resourceUri);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.editor.focus();
        this.selectionService.selection = this.editor;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        if (this.isVisible) {
            this.editor.refresh();
        }
        this.checkForTabbarChange();
    }
    checkForTabbarChange() {
        const { parent } = this;
        if (parent instanceof browser_1.DockPanel) {
            const newTabbar = (0, algorithm_1.find)(parent.tabBars(), tabbar => !!tabbar.titles.find(title => title === this.title));
            if (this.currentTabbar !== newTabbar) {
                this.toDisposeOnTabbarChange.dispose();
                const listener = () => this.checkForTabbarChange();
                parent.layoutModified.connect(listener);
                this.toDisposeOnTabbarChange.push(common_1.Disposable.create(() => parent.layoutModified.disconnect(listener)));
                const last = this.currentTabbar;
                this.currentTabbar = newTabbar;
                this.handleTabBarChange(last, newTabbar);
            }
        }
    }
    handleTabBarChange(oldTabBar, newTabBar) {
        const ownSaveable = browser_1.Saveable.get(this);
        const competingEditors = ownSaveable && (newTabBar === null || newTabBar === void 0 ? void 0 : newTabBar.titles.filter(title => title !== this.title
            && (title.owner instanceof EditorWidget)
            && title.owner.editor.uri.isEqual(this.editor.uri)
            && browser_1.Saveable.get(title.owner) === ownSaveable));
        competingEditors === null || competingEditors === void 0 ? void 0 : competingEditors.forEach(title => title.owner.close());
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.editor.refresh();
    }
    onResize(msg) {
        if (msg.width < 0 || msg.height < 0) {
            this.editor.resizeToFit();
        }
        else {
            this.editor.setSize(msg);
        }
    }
    storeState() {
        var _a;
        return ((_a = this.getResourceUri()) === null || _a === void 0 ? void 0 : _a.scheme) === common_1.UNTITLED_SCHEME ? undefined : this.editor.storeViewState();
    }
    restoreState(oldState) {
        this.editor.restoreViewState(oldState);
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
}
exports.EditorWidget = EditorWidget;
//# sourceMappingURL=editor-widget.js.map