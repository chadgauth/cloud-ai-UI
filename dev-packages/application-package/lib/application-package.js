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
exports.ApplicationPackage = exports.ApplicationPackageOptions = void 0;
const paths = require("path");
const json_file_1 = require("./json-file");
const npm_registry_1 = require("./npm-registry");
const extension_package_1 = require("./extension-package");
const extension_package_collector_1 = require("./extension-package-collector");
const application_props_1 = require("./application-props");
const deepmerge = require("deepmerge");
const resolvePackagePath = require("resolve-package-path");
class ApplicationPackageOptions {
}
exports.ApplicationPackageOptions = ApplicationPackageOptions;
class ApplicationPackage {
    constructor(options) {
        this.options = options;
        this.projectPath = options.projectPath;
        this.log = options.log || console.log.bind(console);
        this.error = options.error || console.error.bind(console);
    }
    get registry() {
        if (this._registry) {
            return this._registry;
        }
        this._registry = this.options.registry || new npm_registry_1.NpmRegistry();
        this._registry.updateProps(this.props);
        return this._registry;
    }
    get target() {
        return this.props.target;
    }
    get props() {
        if (this._props) {
            return this._props;
        }
        const theia = this.pck.theia || {};
        if (this.options.appTarget) {
            theia.target = this.options.appTarget;
        }
        if (theia.target && !(theia.target in application_props_1.ApplicationProps.ApplicationTarget)) {
            const defaultTarget = application_props_1.ApplicationProps.ApplicationTarget.browser;
            console.warn(`Unknown application target '${theia.target}', '${defaultTarget}' to be used instead`);
            theia.target = defaultTarget;
        }
        return this._props = deepmerge(application_props_1.ApplicationProps.DEFAULT, theia);
    }
    get pck() {
        if (this._pck) {
            return this._pck;
        }
        return this._pck = (0, json_file_1.readJsonFile)(this.packagePath);
    }
    /**
     * Extension packages in the topological order.
     */
    get extensionPackages() {
        if (!this._extensionPackages) {
            const collector = new extension_package_collector_1.ExtensionPackageCollector((raw, options = {}) => this.newExtensionPackage(raw, options), this.resolveModule);
            this._extensionPackages = collector.collect(this.pck);
        }
        return this._extensionPackages;
    }
    getExtensionPackage(extension) {
        return this.extensionPackages.find(pck => pck.name === extension);
    }
    async findExtensionPackage(extension) {
        return this.getExtensionPackage(extension) || this.resolveExtensionPackage(extension);
    }
    /**
     * Resolve an extension name to its associated package
     * @param extension the name of the extension's package as defined in "dependencies" (might be aliased)
     * @returns the extension package
     */
    async resolveExtensionPackage(extension) {
        const raw = await extension_package_1.RawExtensionPackage.view(this.registry, extension);
        return raw ? this.newExtensionPackage(raw, { alias: extension }) : undefined;
    }
    newExtensionPackage(raw, options = {}) {
        return new extension_package_1.ExtensionPackage(raw, this.registry, options);
    }
    get frontendPreloadModules() {
        var _a;
        return (_a = this._frontendPreloadModules) !== null && _a !== void 0 ? _a : (this._frontendPreloadModules = this.computeModules('frontendPreload'));
    }
    get frontendModules() {
        var _a;
        return (_a = this._frontendModules) !== null && _a !== void 0 ? _a : (this._frontendModules = this.computeModules('frontend'));
    }
    get frontendElectronModules() {
        var _a;
        return (_a = this._frontendElectronModules) !== null && _a !== void 0 ? _a : (this._frontendElectronModules = this.computeModules('frontendElectron', 'frontend'));
    }
    get secondaryWindowModules() {
        var _a;
        return (_a = this._secondaryWindowModules) !== null && _a !== void 0 ? _a : (this._secondaryWindowModules = this.computeModules('secondaryWindow'));
    }
    get backendModules() {
        var _a;
        return (_a = this._backendModules) !== null && _a !== void 0 ? _a : (this._backendModules = this.computeModules('backend'));
    }
    get backendElectronModules() {
        var _a;
        return (_a = this._backendElectronModules) !== null && _a !== void 0 ? _a : (this._backendElectronModules = this.computeModules('backendElectron', 'backend'));
    }
    get electronMainModules() {
        var _a;
        return (_a = this._electronMainModules) !== null && _a !== void 0 ? _a : (this._electronMainModules = this.computeModules('electronMain'));
    }
    get preloadModules() {
        var _a;
        return (_a = this._preloadModules) !== null && _a !== void 0 ? _a : (this._preloadModules = this.computeModules('preload'));
    }
    computeModules(primary, secondary) {
        const result = new Map();
        let moduleIndex = 1;
        for (const extensionPackage of this.extensionPackages) {
            const extensions = extensionPackage.theiaExtensions;
            if (extensions) {
                for (const extension of extensions) {
                    const modulePath = extension[primary] || (secondary && extension[secondary]);
                    if (typeof modulePath === 'string') {
                        const extensionPath = paths.join(extensionPackage.name, modulePath).split(paths.sep).join('/');
                        result.set(`${primary}_${moduleIndex}`, extensionPath);
                        moduleIndex = moduleIndex + 1;
                    }
                }
            }
        }
        return result;
    }
    relative(path) {
        return paths.relative(this.projectPath, path);
    }
    path(...segments) {
        return paths.resolve(this.projectPath, ...segments);
    }
    get packagePath() {
        return this.path('package.json');
    }
    lib(...segments) {
        return this.path('lib', ...segments);
    }
    srcGen(...segments) {
        return this.path('src-gen', ...segments);
    }
    backend(...segments) {
        return this.srcGen('backend', ...segments);
    }
    bundledBackend(...segments) {
        return this.path('backend', 'bundle', ...segments);
    }
    frontend(...segments) {
        return this.srcGen('frontend', ...segments);
    }
    isBrowser() {
        return this.target === application_props_1.ApplicationProps.ApplicationTarget.browser;
    }
    isElectron() {
        return this.target === application_props_1.ApplicationProps.ApplicationTarget.electron;
    }
    ifBrowser(value, defaultValue) {
        return this.isBrowser() ? value : defaultValue;
    }
    ifElectron(value, defaultValue) {
        return this.isElectron() ? value : defaultValue;
    }
    get targetBackendModules() {
        return this.ifBrowser(this.backendModules, this.backendElectronModules);
    }
    get targetFrontendModules() {
        return this.ifBrowser(this.frontendModules, this.frontendElectronModules);
    }
    get targetElectronMainModules() {
        return this.ifElectron(this.electronMainModules, new Map());
    }
    setDependency(name, version) {
        const dependencies = this.pck.dependencies || {};
        const currentVersion = dependencies[name];
        if (currentVersion === version) {
            return false;
        }
        if (version) {
            dependencies[name] = version;
        }
        else {
            delete dependencies[name];
        }
        this.pck.dependencies = (0, npm_registry_1.sortByKey)(dependencies);
        return true;
    }
    save() {
        return (0, json_file_1.writeJsonFile)(this.packagePath, this.pck, {
            detectIndent: true
        });
    }
    /**
     * A node module resolver in the context of the application package.
     */
    get resolveModule() {
        if (!this._moduleResolver) {
            const resolutionPaths = this.packagePath || process.cwd();
            this._moduleResolver = modulePath => {
                const resolved = resolvePackagePath(modulePath, resolutionPaths);
                if (!resolved) {
                    throw new Error('Could not resolve module: ' + modulePath);
                }
                return resolved;
            };
        }
        return this._moduleResolver;
    }
    resolveModulePath(moduleName, ...segments) {
        return paths.resolve(this.resolveModule(moduleName + '/package.json'), '..', ...segments);
    }
}
exports.ApplicationPackage = ApplicationPackage;
//# sourceMappingURL=application-package.js.map