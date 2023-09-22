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
exports.AnyToolbarItem = exports.MenuToolbarItem = exports.TabBarToolbarItem = exports.TabBarDelegator = exports.TAB_BAR_TOOLBAR_CONTEXT_MENU = exports.NAVIGATION = void 0;
const common_1 = require("../../../common");
/** Items whose group is exactly 'navigation' will be rendered inline. */
exports.NAVIGATION = 'navigation';
exports.TAB_BAR_TOOLBAR_CONTEXT_MENU = ['TAB_BAR_TOOLBAR_CONTEXT_MENU'];
var TabBarDelegator;
(function (TabBarDelegator) {
    function is(candidate) {
        return (0, common_1.isObject)(candidate) && (0, common_1.isFunction)(candidate.getTabBarDelegate);
    }
    TabBarDelegator.is = is;
})(TabBarDelegator = exports.TabBarDelegator || (exports.TabBarDelegator = {}));
var TabBarToolbarItem;
(function (TabBarToolbarItem) {
    /**
     * Compares the items by `priority` in ascending. Undefined priorities will be treated as `0`.
     */
    TabBarToolbarItem.PRIORITY_COMPARATOR = (left, right) => {
        var _a, _b;
        const leftGroup = (_a = left.group) !== null && _a !== void 0 ? _a : exports.NAVIGATION;
        const rightGroup = (_b = right.group) !== null && _b !== void 0 ? _b : exports.NAVIGATION;
        if (leftGroup === exports.NAVIGATION && rightGroup !== exports.NAVIGATION) {
            return common_1.ArrayUtils.Sort.LeftBeforeRight;
        }
        if (rightGroup === exports.NAVIGATION && leftGroup !== exports.NAVIGATION) {
            return common_1.ArrayUtils.Sort.RightBeforeLeft;
        }
        if (leftGroup !== rightGroup) {
            return leftGroup.localeCompare(rightGroup);
        }
        return (left.priority || 0) - (right.priority || 0);
    };
    function is(arg) {
        return (0, common_1.isObject)(arg) && (0, common_1.isString)(arg.command);
    }
    TabBarToolbarItem.is = is;
})(TabBarToolbarItem = exports.TabBarToolbarItem || (exports.TabBarToolbarItem = {}));
var MenuToolbarItem;
(function (MenuToolbarItem) {
    /**
     * Type guard for a toolbar item that actually is a menu item, amongst
     * the other kinds of item that it may also be.
     *
     * @param item a toolbar item
     * @returns whether the `item` is a menu item
     */
    function is(item) {
        return Array.isArray(item.menuPath);
    }
    MenuToolbarItem.is = is;
    function getMenuPath(item) {
        return Array.isArray(item.menuPath) ? item.menuPath : undefined;
    }
    MenuToolbarItem.getMenuPath = getMenuPath;
})(MenuToolbarItem = exports.MenuToolbarItem || (exports.MenuToolbarItem = {}));
var AnyToolbarItem;
(function (AnyToolbarItem) {
    /**
     * Type guard for a toolbar item that actually manifests any of the
     * features of a conditional toolbar item.
     *
     * @param item a toolbar item
     * @returns whether the `item` is a conditional item
     */
    function isConditional(item) {
        return 'isVisible' in item && typeof item.isVisible === 'function'
            || 'onDidChange' in item && typeof item.onDidChange === 'function'
            || 'when' in item && typeof item.when === 'string';
    }
    AnyToolbarItem.isConditional = isConditional;
})(AnyToolbarItem = exports.AnyToolbarItem || (exports.AnyToolbarItem = {}));
//# sourceMappingURL=tab-bar-toolbar-types.js.map