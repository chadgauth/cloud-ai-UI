"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.VSXExtensionsCommands = void 0;
const nls_1 = require("@theia/core/lib/common/nls");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
var VSXExtensionsCommands;
(function (VSXExtensionsCommands) {
    const EXTENSIONS_CATEGORY = 'Extensions';
    VSXExtensionsCommands.CLEAR_ALL = common_1.Command.toDefaultLocalizedCommand({
        id: 'vsxExtensions.clearAll',
        category: EXTENSIONS_CATEGORY,
        label: 'Clear Search Results',
        iconClass: (0, browser_1.codicon)('clear-all')
    });
    VSXExtensionsCommands.INSTALL_FROM_VSIX = {
        id: 'vsxExtensions.installFromVSIX',
        category: nls_1.nls.localizeByDefault(EXTENSIONS_CATEGORY),
        originalCategory: EXTENSIONS_CATEGORY,
        originalLabel: 'Install from VSIX...',
        label: nls_1.nls.localizeByDefault('Install from VSIX') + '...',
        dialogLabel: nls_1.nls.localizeByDefault('Install from VSIX')
    };
    VSXExtensionsCommands.INSTALL_ANOTHER_VERSION = {
        id: 'vsxExtensions.installAnotherVersion'
    };
    VSXExtensionsCommands.COPY = {
        id: 'vsxExtensions.copy'
    };
    VSXExtensionsCommands.COPY_EXTENSION_ID = {
        id: 'vsxExtensions.copyExtensionId'
    };
    VSXExtensionsCommands.SHOW_BUILTINS = common_1.Command.toDefaultLocalizedCommand({
        id: 'vsxExtension.showBuiltins',
        label: 'Show Built-in Extensions',
        category: EXTENSIONS_CATEGORY,
    });
    VSXExtensionsCommands.SHOW_INSTALLED = common_1.Command.toLocalizedCommand({
        id: 'vsxExtension.showInstalled',
        label: 'Show Installed Extensions',
        category: EXTENSIONS_CATEGORY,
    }, 'theia/vsx-registry/showInstalled');
    VSXExtensionsCommands.SHOW_RECOMMENDATIONS = common_1.Command.toDefaultLocalizedCommand({
        id: 'vsxExtension.showRecommendations',
        label: 'Show Recommended Extensions',
        category: EXTENSIONS_CATEGORY,
    });
})(VSXExtensionsCommands = exports.VSXExtensionsCommands || (exports.VSXExtensionsCommands = {}));
//# sourceMappingURL=vsx-extension-commands.js.map