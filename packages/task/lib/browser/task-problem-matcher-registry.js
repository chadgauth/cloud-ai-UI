"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.ProblemMatcherRegistry = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const disposable_1 = require("@theia/core/lib/common/disposable");
const common_2 = require("../common");
const task_problem_pattern_registry_1 = require("./task-problem-pattern-registry");
const severity_1 = require("@theia/core/lib/common/severity");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
let ProblemMatcherRegistry = class ProblemMatcherRegistry {
    constructor() {
        this.matchers = new Map();
        this.readyPromise = new promise_util_1.Deferred();
        this.onDidChangeProblemMatcherEmitter = new common_1.Emitter();
    }
    get onDidChangeProblemMatcher() {
        return this.onDidChangeProblemMatcherEmitter.event;
    }
    init() {
        this.problemPatternRegistry.onReady().then(() => {
            this.fillDefaults();
            this.readyPromise.resolve();
            this.onDidChangeProblemMatcherEmitter.fire(undefined);
        });
    }
    onReady() {
        return this.readyPromise.promise;
    }
    /**
     * Add a problem matcher to the registry.
     *
     * @param definition the problem matcher to be added.
     */
    register(matcher) {
        if (!matcher.name) {
            console.error('Only named Problem Matchers can be registered.');
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => {
            /* mark as not disposed */
            this.onDidChangeProblemMatcherEmitter.fire(undefined);
        }));
        this.doRegister(matcher, toDispose).then(() => this.onDidChangeProblemMatcherEmitter.fire(undefined));
        return toDispose;
    }
    async doRegister(matcher, toDispose) {
        const problemMatcher = await this.getProblemMatcherFromContribution(matcher);
        if (toDispose.disposed) {
            return;
        }
        toDispose.push(this.add(problemMatcher));
    }
    /**
     * Finds the problem matcher from the registry by its name.
     *
     * @param name the name of the problem matcher
     * @return the problem matcher. If the task definition is not found, `undefined` is returned.
     */
    get(name) {
        return this.matchers.get((0, common_2.fromVariableName)(name));
    }
    /**
     * Returns all registered problem matchers in the registry.
     */
    getAll() {
        const all = [];
        for (const matcherName of this.matchers.keys()) {
            all.push(this.get(matcherName));
        }
        all.sort((one, other) => one.name.localeCompare(other.name));
        return all;
    }
    /**
     * Transforms the `ProblemMatcherContribution` to a `ProblemMatcher`
     *
     * @return the problem matcher
     */
    async getProblemMatcherFromContribution(matcher) {
        let baseMatcher;
        if (matcher.base) {
            baseMatcher = this.get(matcher.base);
        }
        let fileLocation;
        let filePrefix;
        if (matcher.fileLocation === undefined) {
            fileLocation = baseMatcher ? baseMatcher.fileLocation : common_2.FileLocationKind.Relative;
            filePrefix = baseMatcher ? baseMatcher.filePrefix : '${workspaceFolder}';
        }
        else {
            const locationAndPrefix = this.getFileLocationKindAndPrefix(matcher);
            fileLocation = locationAndPrefix.fileLocation;
            filePrefix = locationAndPrefix.filePrefix;
        }
        const patterns = [];
        if (matcher.pattern) {
            if (typeof matcher.pattern === 'string') {
                await this.problemPatternRegistry.onReady();
                const registeredPattern = this.problemPatternRegistry.get((0, common_2.fromVariableName)(matcher.pattern));
                if (Array.isArray(registeredPattern)) {
                    patterns.push(...registeredPattern);
                }
                else if (!!registeredPattern) {
                    patterns.push(registeredPattern);
                }
            }
            else if (Array.isArray(matcher.pattern)) {
                patterns.push(...matcher.pattern.map(p => common_2.ProblemPattern.fromProblemPatternContribution(p)));
            }
            else {
                patterns.push(common_2.ProblemPattern.fromProblemPatternContribution(matcher.pattern));
            }
        }
        else if (baseMatcher) {
            if (Array.isArray(baseMatcher.pattern)) {
                patterns.push(...baseMatcher.pattern);
            }
            else {
                patterns.push(baseMatcher.pattern);
            }
        }
        let deprecated = matcher.deprecated;
        if (deprecated === undefined && baseMatcher) {
            deprecated = baseMatcher.deprecated;
        }
        let applyTo;
        if (matcher.applyTo === undefined) {
            applyTo = baseMatcher ? baseMatcher.applyTo : common_2.ApplyToKind.allDocuments;
        }
        else {
            applyTo = common_2.ApplyToKind.fromString(matcher.applyTo) || common_2.ApplyToKind.allDocuments;
        }
        let severity = severity_1.Severity.fromValue(matcher.severity);
        if (matcher.severity === undefined && baseMatcher && baseMatcher.severity !== undefined) {
            severity = baseMatcher.severity;
        }
        let watching = common_2.WatchingMatcher.fromWatchingMatcherContribution(matcher.background || matcher.watching);
        if (watching === undefined && baseMatcher) {
            watching = baseMatcher.watching;
        }
        const problemMatcher = {
            name: matcher.name || (baseMatcher ? baseMatcher.name : undefined),
            label: matcher.label || (baseMatcher === null || baseMatcher === void 0 ? void 0 : baseMatcher.label) || '',
            deprecated,
            owner: matcher.owner || (baseMatcher ? baseMatcher.owner : ''),
            source: matcher.source || (baseMatcher ? baseMatcher.source : undefined),
            applyTo,
            fileLocation,
            filePrefix,
            pattern: patterns,
            severity,
            watching
        };
        return problemMatcher;
    }
    add(matcher) {
        this.matchers.set(matcher.name, matcher);
        return disposable_1.Disposable.create(() => this.matchers.delete(matcher.name));
    }
    getFileLocationKindAndPrefix(matcher) {
        let fileLocation = common_2.FileLocationKind.Relative;
        let filePrefix = '${workspaceFolder}';
        if (matcher.fileLocation !== undefined) {
            if (Array.isArray(matcher.fileLocation)) {
                if (matcher.fileLocation.length > 0) {
                    const locationKind = common_2.FileLocationKind.fromString(matcher.fileLocation[0]);
                    if (matcher.fileLocation.length === 1 && locationKind === common_2.FileLocationKind.Absolute) {
                        fileLocation = locationKind;
                    }
                    else if (matcher.fileLocation.length === 2 && locationKind === common_2.FileLocationKind.Relative && matcher.fileLocation[1]) {
                        fileLocation = locationKind;
                        filePrefix = matcher.fileLocation[1];
                    }
                }
            }
            else {
                const locationKind = common_2.FileLocationKind.fromString(matcher.fileLocation);
                if (locationKind) {
                    fileLocation = locationKind;
                    if (locationKind === common_2.FileLocationKind.Relative) {
                        filePrefix = '${workspaceFolder}';
                    }
                }
            }
        }
        return { fileLocation, filePrefix };
    }
    // copied from https://github.com/Microsoft/vscode/blob/1.33.1/src/vs/workbench/contrib/tasks/common/problemMatcher.ts
    fillDefaults() {
        this.add({
            name: 'msCompile',
            label: 'Microsoft compiler problems',
            owner: 'msCompile',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('msCompile'))
        });
        this.add({
            name: 'lessCompile',
            label: 'Less problems',
            deprecated: true,
            owner: 'lessCompile',
            source: 'less',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('lessCompile')),
            severity: severity_1.Severity.Error
        });
        this.add({
            name: 'gulp-tsc',
            label: 'Gulp TSC Problems',
            owner: 'typescript',
            source: 'ts',
            applyTo: common_2.ApplyToKind.closedDocuments,
            fileLocation: common_2.FileLocationKind.Relative,
            filePrefix: '${workspaceFolder}',
            pattern: (this.problemPatternRegistry.get('gulp-tsc'))
        });
        this.add({
            name: 'jshint',
            label: 'JSHint problems',
            owner: 'jshint',
            source: 'jshint',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('jshint'))
        });
        this.add({
            name: 'jshint-stylish',
            label: 'JSHint stylish problems',
            owner: 'jshint',
            source: 'jshint',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('jshint-stylish'))
        });
        this.add({
            name: 'eslint-compact',
            label: 'ESLint compact problems',
            owner: 'eslint',
            source: 'eslint',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            filePrefix: '${workspaceFolder}',
            pattern: (this.problemPatternRegistry.get('eslint-compact'))
        });
        this.add({
            name: 'eslint-stylish',
            label: 'ESLint stylish problems',
            owner: 'eslint',
            source: 'eslint',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('eslint-stylish'))
        });
        this.add({
            name: 'go',
            label: 'Go problems',
            owner: 'go',
            source: 'go',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Relative,
            filePrefix: '${workspaceFolder}',
            pattern: (this.problemPatternRegistry.get('go'))
        });
    }
};
__decorate([
    (0, inversify_1.inject)(task_problem_pattern_registry_1.ProblemPatternRegistry),
    __metadata("design:type", task_problem_pattern_registry_1.ProblemPatternRegistry)
], ProblemMatcherRegistry.prototype, "problemPatternRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProblemMatcherRegistry.prototype, "init", null);
ProblemMatcherRegistry = __decorate([
    (0, inversify_1.injectable)()
], ProblemMatcherRegistry);
exports.ProblemMatcherRegistry = ProblemMatcherRegistry;
//# sourceMappingURL=task-problem-matcher-registry.js.map