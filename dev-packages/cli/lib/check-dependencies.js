"use strict";
// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
const fs = require("fs");
const path = require("path");
const glob_1 = require("glob");
const log_update_1 = require("log-update");
const chalk = require("chalk");
const NODE_MODULES = 'node_modules';
const PACKAGE_JSON = 'package.json';
const logUpdate = (0, log_update_1.create)(process.stdout);
function checkDependencies(options) {
    const workspaces = deriveWorkspaces(options);
    logUpdate(`✅ Found ${workspaces.length} workspaces`);
    console.log('🔍 Collecting dependencies...');
    const dependencies = findAllDependencies(workspaces, options);
    logUpdate(`✅ Found ${dependencies.length} dependencies`);
    console.log('🔍 Analyzing dependencies...');
    const issues = analyzeDependencies(dependencies, options);
    if (issues.length <= 0) {
        logUpdate('✅ No issues were found');
        process.exit(0);
    }
    logUpdate('🟠 Found ' + issues.length + ' issues');
    printIssues(issues);
    printHints(issues);
    process.exit(options.suppress ? 0 : 1);
}
exports.default = checkDependencies;
function deriveWorkspaces(options) {
    var _a;
    const wsGlobs = (_a = options.workspaces) !== null && _a !== void 0 ? _a : readWorkspaceGlobsFromPackageJson();
    const workspaces = [];
    for (const wsGlob of wsGlobs) {
        workspaces.push(...glob_1.glob.sync(wsGlob + '/'));
    }
    return workspaces;
}
function readWorkspaceGlobsFromPackageJson() {
    var _a;
    const rootPackageJson = path.join(process.cwd(), PACKAGE_JSON);
    if (!fs.existsSync(rootPackageJson)) {
        console.error('Directory does not contain a package.json with defined workspaces');
        console.info('Run in the root of a Theia project or specify them via --workspaces');
        process.exit(1);
    }
    return (_a = require(rootPackageJson).workspaces) !== null && _a !== void 0 ? _a : [];
}
function findAllDependencies(workspaces, options) {
    const dependencies = [];
    dependencies.push(...findDependencies('.', options));
    for (const workspace of workspaces) {
        dependencies.push(...findDependencies(workspace, options));
    }
    return dependencies;
}
function findDependencies(workspace, options) {
    const dependent = getPackageName(path.join(process.cwd(), workspace, PACKAGE_JSON));
    const nodeModulesDir = path.join(workspace, NODE_MODULES);
    const matchingPackageJsons = [];
    options.include.forEach(include => glob_1.glob.sync(`${include}/${PACKAGE_JSON}`, {
        cwd: nodeModulesDir,
        ignore: [
            `**/${NODE_MODULES}/**`,
            `[^@]*/*/**/${PACKAGE_JSON}`,
            `@*/*/*/**/${PACKAGE_JSON}`,
            ...options.exclude
        ] // user-specified exclude patterns
    }).forEach(packageJsonPath => {
        const dependency = toDependency(packageJsonPath, nodeModulesDir, dependent);
        if (!options.onlyTheiaExtensions || dependency.isTheiaExtension) {
            matchingPackageJsons.push(dependency);
        }
        const childNodeModules = path.join(nodeModulesDir, packageJsonPath, '..');
        matchingPackageJsons.push(...findDependencies(childNodeModules, options));
    }));
    return matchingPackageJsons;
}
function toDependency(packageJsonPath, nodeModulesDir, dependent) {
    const fullPackageJsonPath = path.join(process.cwd(), nodeModulesDir, packageJsonPath);
    const name = getPackageName(fullPackageJsonPath);
    const version = getPackageVersion(fullPackageJsonPath);
    return {
        name: name !== null && name !== void 0 ? name : packageJsonPath.replace('/' + PACKAGE_JSON, ''),
        version: version !== null && version !== void 0 ? version : 'unknown',
        path: path.relative(process.cwd(), fullPackageJsonPath),
        hoisted: nodeModulesDir === NODE_MODULES,
        dependent: dependent,
        isTheiaExtension: isTheiaExtension(fullPackageJsonPath)
    };
}
function getPackageVersion(fullPackageJsonPath) {
    try {
        return require(fullPackageJsonPath).version;
    }
    catch (error) {
        return undefined;
    }
}
function getPackageName(fullPackageJsonPath) {
    try {
        return require(fullPackageJsonPath).name;
    }
    catch (error) {
        return undefined;
    }
}
function isTheiaExtension(fullPackageJsonPath) {
    try {
        const theiaExtension = require(fullPackageJsonPath).theiaExtensions;
        return theiaExtension ? true : false;
    }
    catch (error) {
        return false;
    }
}
function analyzeDependencies(packages, options) {
    const issues = [];
    if (!options.skipHoisted) {
        issues.push(...findNotHoistedDependencies(packages, options));
    }
    if (!options.skipUniqueness) {
        issues.push(...findDuplicateDependencies(packages, options));
    }
    if (!options.skipSingleTheiaVersion) {
        issues.push(...findTheiaVersionMix(packages, options));
    }
    return issues;
}
function findNotHoistedDependencies(packages, options) {
    const issues = [];
    const nonHoistedPackages = packages.filter(p => p.hoisted === false);
    for (const nonHoistedPackage of nonHoistedPackages) {
        issues.push(createNonHoistedPackageIssue(nonHoistedPackage, options));
    }
    return issues;
}
function createNonHoistedPackageIssue(nonHoistedPackage, options) {
    return {
        issueType: 'not-hoisted',
        package: nonHoistedPackage,
        relatedPackages: [getHoistedPackageByName(nonHoistedPackage.name)],
        severity: options.suppress ? 'warning' : 'error'
    };
}
function getHoistedPackageByName(name) {
    return toDependency(path.join(name, PACKAGE_JSON), NODE_MODULES);
}
function findDuplicateDependencies(packages, options) {
    const duplicates = [];
    const packagesGroupedByName = new Map();
    for (const currentPackage of packages) {
        const name = currentPackage.name;
        if (!packagesGroupedByName.has(name)) {
            packagesGroupedByName.set(name, []);
        }
        const currentPackages = packagesGroupedByName.get(name);
        currentPackages.push(currentPackage);
        if (currentPackages.length > 1 && duplicates.indexOf(name) === -1) {
            duplicates.push(name);
        }
    }
    duplicates.sort();
    const issues = [];
    for (const duplicate of duplicates) {
        const duplicatePackages = packagesGroupedByName.get(duplicate);
        if (duplicatePackages && duplicatePackages.length > 0) {
            issues.push({
                issueType: 'multiple-versions',
                package: duplicatePackages.pop(),
                relatedPackages: duplicatePackages,
                severity: options.suppress ? 'warning' : 'error'
            });
        }
    }
    return issues;
}
function findTheiaVersionMix(packages, options) {
    // @theia/monaco-editor-core is following the versions of Monaco so it can't be part of this check
    const theiaPackages = packages.filter(p => p.name.startsWith('@theia/') && !p.name.startsWith('@theia/monaco-editor-core'));
    let theiaVersion = undefined;
    let referenceTheiaPackage = undefined;
    const packagesWithOtherVersion = [];
    for (const theiaPackage of theiaPackages) {
        if (!theiaVersion && theiaPackage.version) {
            theiaVersion = theiaPackage.version;
            referenceTheiaPackage = theiaPackage;
        }
        else if (theiaVersion !== theiaPackage.version) {
            packagesWithOtherVersion.push(theiaPackage);
        }
    }
    if (referenceTheiaPackage && packagesWithOtherVersion.length > 0) {
        return [{
                issueType: 'theia-version-mix',
                package: referenceTheiaPackage,
                relatedPackages: packagesWithOtherVersion,
                severity: 'error'
            }];
    }
    return [];
}
function printIssues(issues) {
    console.log();
    const indent = issues.length.toString().length;
    issues.forEach((issue, index) => {
        printIssue(issue, index + 1, indent);
    });
}
function printIssue(issue, issueNumber, indent) {
    const remainingIndent = indent - issueNumber.toString().length;
    const indentString = ' '.repeat(remainingIndent + 1);
    console.log(issueTitle(issue, issueNumber, indentString));
    console.log(issueDetails(issue, '   ' + ' '.repeat(indent)));
    console.log();
}
function issueTitle(issue, issueNumber, indent) {
    var _a;
    const dependent = issue.package.dependent ? ` in ${chalk.blueBright((_a = issue.package.dependent) !== null && _a !== void 0 ? _a : 'unknown')}` : '';
    return chalk.bgWhiteBright.bold.black(`#${issueNumber}${indent}`) + ' ' + chalk.cyanBright(issue.package.name)
        + dependent + chalk.dim(` [${issue.issueType}]`);
}
function issueDetails(issue, indent) {
    return indent + severity(issue) + ' ' + issueMessage(issue) + '\n'
        + indent + versionLine(issue.package) + '\n'
        + issue.relatedPackages.map(p => indent + versionLine(p)).join('\n');
}
function issueMessage(issue) {
    if (issue.issueType === 'multiple-versions') {
        return `Multiple versions of dependency ${chalk.bold(issue.package.name)} found.`;
    }
    else if (issue.issueType === 'theia-version-mix') {
        return `Mix of ${chalk.bold('@theia/*')} versions found.`;
    }
    else {
        return `Dependency ${chalk.bold(issue.package.name)} is not hoisted.`;
    }
}
function severity(issue) {
    return issue.severity === 'error' ? chalk.red('error') : chalk.yellow('warning');
}
function versionLine(pckg) {
    return chalk.bold(pckg.version) + ' in ' + pckg.path;
}
function printHints(issues) {
    console.log();
    if (issues.find(i => i.issueType === 'theia-version-mix')) {
        console.log('⛔ A mix of Theia versions is very likely leading to a broken application.');
    }
    console.log(`ℹ️  Use ${chalk.bold('yarn why <package-name>')} to find out why those multiple versions of a package are pulled.`);
    console.log('ℹ️  Try to resolve those issues by finding package versions along the dependency chain that depend on compatible versions.');
    console.log(`ℹ️  Use ${chalk.bold('resolutions')} in your root package.json to force specific versions as a last resort.`);
    console.log();
}
//# sourceMappingURL=check-dependencies.js.map