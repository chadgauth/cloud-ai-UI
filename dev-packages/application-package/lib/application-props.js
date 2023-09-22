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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationProps = exports.NpmRegistryProps = exports.GeneratorConfig = exports.BackendApplicationConfig = exports.FrontendApplicationConfig = exports.DefaultTheme = exports.ElectronFrontendApplicationConfig = void 0;
exports.deepmerge = require("deepmerge");
var ElectronFrontendApplicationConfig;
(function (ElectronFrontendApplicationConfig) {
    ElectronFrontendApplicationConfig.DEFAULT = {
        windowOptions: {}
    };
})(ElectronFrontendApplicationConfig = exports.ElectronFrontendApplicationConfig || (exports.ElectronFrontendApplicationConfig = {}));
var DefaultTheme;
(function (DefaultTheme) {
    function defaultForOSTheme(theme) {
        if (typeof theme === 'string') {
            return theme;
        }
        if (typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return theme.dark;
        }
        return theme.light;
    }
    DefaultTheme.defaultForOSTheme = defaultForOSTheme;
})(DefaultTheme = exports.DefaultTheme || (exports.DefaultTheme = {}));
var FrontendApplicationConfig;
(function (FrontendApplicationConfig) {
    FrontendApplicationConfig.DEFAULT = {
        applicationName: 'Eclipse Theia',
        defaultTheme: { light: 'light', dark: 'dark' },
        defaultIconTheme: 'theia-file-icons',
        electron: ElectronFrontendApplicationConfig.DEFAULT,
        defaultLocale: '',
        validatePreferencesSchema: true
    };
})(FrontendApplicationConfig = exports.FrontendApplicationConfig || (exports.FrontendApplicationConfig = {}));
var BackendApplicationConfig;
(function (BackendApplicationConfig) {
    BackendApplicationConfig.DEFAULT = {
        singleInstance: false,
    };
})(BackendApplicationConfig = exports.BackendApplicationConfig || (exports.BackendApplicationConfig = {}));
var GeneratorConfig;
(function (GeneratorConfig) {
    GeneratorConfig.DEFAULT = {
        preloadTemplate: ''
    };
})(GeneratorConfig = exports.GeneratorConfig || (exports.GeneratorConfig = {}));
var NpmRegistryProps;
(function (NpmRegistryProps) {
    NpmRegistryProps.DEFAULT = {
        next: false,
        registry: 'https://registry.npmjs.org/'
    };
})(NpmRegistryProps = exports.NpmRegistryProps || (exports.NpmRegistryProps = {}));
var ApplicationProps;
(function (ApplicationProps) {
    let ApplicationTarget;
    (function (ApplicationTarget) {
        ApplicationTarget["browser"] = "browser";
        ApplicationTarget["electron"] = "electron";
    })(ApplicationTarget = ApplicationProps.ApplicationTarget || (ApplicationProps.ApplicationTarget = {}));
    ;
    ApplicationProps.DEFAULT = {
        ...NpmRegistryProps.DEFAULT,
        target: 'browser',
        backend: {
            config: BackendApplicationConfig.DEFAULT
        },
        frontend: {
            config: FrontendApplicationConfig.DEFAULT
        },
        generator: {
            config: GeneratorConfig.DEFAULT
        }
    };
})(ApplicationProps = exports.ApplicationProps || (exports.ApplicationProps = {}));
//# sourceMappingURL=application-props.js.map