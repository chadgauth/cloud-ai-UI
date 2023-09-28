"use strict";
// *****************************************************************************
// Copyright (C) 2021 TypeFox and others.
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
exports.extractFromFile = exports.extract = void 0;
const fs = require("fs-extra");
const ts = require("typescript");
const os = require("os");
const path = require("path");
const glob_1 = require("glob");
const util_1 = require("util");
const deepmerge = require("deepmerge");
const common_1 = require("./common");
const globPromise = (0, util_1.promisify)(glob_1.glob);
class SingleFileServiceHost {
    constructor(options, filename, contents) {
        this.options = options;
        this.filename = filename;
        this.getCompilationSettings = () => this.options;
        this.getScriptFileNames = () => [this.filename];
        this.getScriptVersion = () => '1';
        this.getScriptSnapshot = (name) => name === this.filename ? this.file : this.lib;
        this.getCurrentDirectory = () => '';
        this.getDefaultLibFileName = () => 'lib.d.ts';
        this.file = ts.ScriptSnapshot.fromString(contents);
        this.lib = ts.ScriptSnapshot.fromString('');
    }
}
class TypeScriptError extends Error {
    constructor(message, node) {
        super(buildErrorMessage(message, node));
    }
}
function buildErrorMessage(message, node) {
    const source = node.getSourceFile();
    const sourcePath = source.fileName;
    const pos = source.getLineAndCharacterOfPosition(node.pos);
    return `${sourcePath}(${pos.line + 1},${pos.character + 1}): ${message}`;
}
const tsOptions = {
    allowJs: true
};
async function extract(options) {
    var _a, _b, _c;
    const cwd = path.resolve(process.env.INIT_CWD || process.cwd(), (_a = options.root) !== null && _a !== void 0 ? _a : '');
    const files = [];
    await Promise.all(((_b = options.files) !== null && _b !== void 0 ? _b : ['**/src/**/*.{ts,tsx}']).map(async (pattern) => files.push(...await globPromise(pattern, { cwd }))));
    let localization = {};
    const errors = [];
    for (const file of files) {
        const filePath = path.resolve(cwd, file);
        const content = await fs.readFile(filePath, 'utf8');
        const fileLocalization = await extractFromFile(file, content, errors, options);
        localization = deepmerge(localization, fileLocalization);
    }
    if (errors.length > 0 && options.logs) {
        await fs.writeFile(options.logs, errors.join(os.EOL));
    }
    const out = path.resolve(process.env.INIT_CWD || process.cwd(), (_c = options.output) !== null && _c !== void 0 ? _c : '');
    if (options.merge && await fs.pathExists(out)) {
        const existing = await fs.readJson(out);
        localization = deepmerge(existing, localization);
    }
    localization = (0, common_1.sortLocalization)(localization);
    await fs.mkdirs(path.dirname(out));
    await fs.writeJson(out, localization, {
        spaces: 2
    });
}
exports.extract = extract;
async function extractFromFile(file, content, errors, options) {
    const serviceHost = new SingleFileServiceHost(tsOptions, file, content);
    const service = ts.createLanguageService(serviceHost);
    const sourceFile = service.getProgram().getSourceFile(file);
    const localization = {};
    const localizationCalls = collect(sourceFile, node => isLocalizeCall(node));
    for (const call of localizationCalls) {
        try {
            const extracted = extractFromLocalizeCall(call, options);
            if (extracted) {
                insert(localization, extracted);
            }
        }
        catch (err) {
            const tsError = err;
            errors === null || errors === void 0 ? void 0 : errors.push(tsError.message);
            if (!(options === null || options === void 0 ? void 0 : options.quiet)) {
                console.log(tsError.message);
            }
        }
    }
    const localizedCommands = collect(sourceFile, node => isCommandLocalizeUtility(node));
    for (const command of localizedCommands) {
        try {
            const extracted = extractFromLocalizedCommandCall(command, errors, options);
            const label = extracted.label;
            const category = extracted.category;
            if (!isExcluded(options, label[0])) {
                insert(localization, label);
            }
            if (category && !isExcluded(options, category[0])) {
                insert(localization, category);
            }
        }
        catch (err) {
            const tsError = err;
            errors === null || errors === void 0 ? void 0 : errors.push(tsError.message);
            if (!(options === null || options === void 0 ? void 0 : options.quiet)) {
                console.log(tsError.message);
            }
        }
    }
    return localization;
}
exports.extractFromFile = extractFromFile;
function isExcluded(options, key) {
    return !!(options === null || options === void 0 ? void 0 : options.exclude) && key.startsWith(options.exclude);
}
function insert(localization, values) {
    const key = values[0];
    const value = values[1];
    const node = values[2];
    const parts = key.split('/');
    parts.forEach((part, i) => {
        let entry = localization[part];
        if (i === parts.length - 1) {
            if (typeof entry === 'object') {
                throw new TypeScriptError(`Multiple translation keys already exist at '${key}'`, node);
            }
            localization[part] = value;
        }
        else {
            if (typeof entry === 'string') {
                throw new TypeScriptError(`String entry already exists at '${parts.splice(0, i + 1).join('/')}'`, node);
            }
            if (!entry) {
                entry = {};
            }
            localization[part] = entry;
            localization = entry;
        }
    });
}
function collect(n, fn) {
    const result = [];
    function loop(node) {
        const stepResult = fn(node);
        if (stepResult) {
            result.push(node);
        }
        else {
            ts.forEachChild(node, loop);
        }
    }
    loop(n);
    return result;
}
function isLocalizeCall(node) {
    if (!ts.isCallExpression(node)) {
        return false;
    }
    return node.expression.getText() === 'nls.localize';
}
function extractFromLocalizeCall(node, options) {
    if (!ts.isCallExpression(node)) {
        throw new TypeScriptError('Invalid node type', node);
    }
    const args = node.arguments;
    if (args.length < 2) {
        throw new TypeScriptError('Localize call needs at least 2 arguments', node);
    }
    const key = extractString(args[0]);
    const value = extractString(args[1]);
    if (isExcluded(options, key)) {
        return undefined;
    }
    return [key, value, args[1]];
}
function extractFromLocalizedCommandCall(node, errors, options) {
    if (!ts.isCallExpression(node)) {
        throw new TypeScriptError('Invalid node type', node);
    }
    const args = node.arguments;
    if (args.length < 1) {
        throw new TypeScriptError('Command localization call needs at least one argument', node);
    }
    const commandObj = args[0];
    if (!ts.isObjectLiteralExpression(commandObj)) {
        throw new TypeScriptError('First argument of "toLocalizedCommand" needs to be an object literal', node);
    }
    const properties = commandObj.properties;
    const propertyMap = new Map();
    const relevantProps = ['id', 'label', 'category'];
    let labelNode = node;
    for (const property of properties) {
        if (!property.name) {
            continue;
        }
        if (!ts.isPropertyAssignment(property)) {
            throw new TypeScriptError('Only property assignments in "toLocalizedCommand" are allowed', property);
        }
        if (!ts.isIdentifier(property.name)) {
            throw new TypeScriptError('Only identifiers are allowed as property names in "toLocalizedCommand"', property);
        }
        const name = property.name.text;
        if (!relevantProps.includes(property.name.text)) {
            continue;
        }
        if (property.name.text === 'label') {
            labelNode = property.initializer;
        }
        try {
            const value = extractString(property.initializer);
            propertyMap.set(name, value);
        }
        catch (err) {
            const tsError = err;
            errors === null || errors === void 0 ? void 0 : errors.push(tsError.message);
            if (!(options === null || options === void 0 ? void 0 : options.quiet)) {
                console.log(tsError.message);
            }
        }
    }
    let labelKey = propertyMap.get('id');
    let categoryKey = undefined;
    let categoryNode;
    // We have an explicit label translation key
    if (args.length > 1) {
        try {
            const labelOverrideKey = extractStringOrUndefined(args[1]);
            if (labelOverrideKey) {
                labelKey = labelOverrideKey;
                labelNode = args[1];
            }
        }
        catch (err) {
            const tsError = err;
            errors === null || errors === void 0 ? void 0 : errors.push(tsError.message);
            if (!(options === null || options === void 0 ? void 0 : options.quiet)) {
                console.log(tsError.message);
            }
        }
    }
    // We have an explicit category translation key
    if (args.length > 2) {
        try {
            categoryKey = extractStringOrUndefined(args[2]);
            categoryNode = args[2];
        }
        catch (err) {
            const tsError = err;
            errors === null || errors === void 0 ? void 0 : errors.push(tsError.message);
            if (!(options === null || options === void 0 ? void 0 : options.quiet)) {
                console.log(tsError.message);
            }
        }
    }
    if (!labelKey) {
        throw new TypeScriptError('No label key found', node);
    }
    if (!propertyMap.get('label')) {
        throw new TypeScriptError('No default label found', node);
    }
    let categoryLocalization = undefined;
    const categoryLabel = propertyMap.get('category');
    if (categoryKey && categoryLabel && categoryNode) {
        categoryLocalization = [categoryKey, categoryLabel, categoryNode];
    }
    return {
        label: [labelKey, propertyMap.get('label'), labelNode],
        category: categoryLocalization
    };
}
function extractStringOrUndefined(node) {
    if (node.getText() === 'undefined') {
        return undefined;
    }
    return extractString(node);
}
function extractString(node) {
    if (ts.isIdentifier(node)) {
        const reference = followReference(node);
        if (!reference) {
            throw new TypeScriptError(`Could not resolve reference to '${node.text}'`, node);
        }
        node = reference;
    }
    if (ts.isTemplateLiteral(node)) {
        throw new TypeScriptError("Template literals are not supported for localization. Please use the additional arguments of the 'nls.localize' function to format strings", node);
    }
    if (!ts.isStringLiteralLike(node)) {
        throw new TypeScriptError(`'${node.getText()}' is not a string constant`, node);
    }
    return unescapeString(node.text);
}
function followReference(node) {
    const scope = collectScope(node);
    const next = scope.get(node.text);
    if (next && ts.isIdentifier(next)) {
        return followReference(next);
    }
    return next;
}
function collectScope(node, map = new Map()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const locals = node['locals'];
    if (locals) {
        for (const [key, value] of locals.entries()) {
            if (!map.has(key)) {
                const declaration = value.valueDeclaration;
                if (declaration && ts.isVariableDeclaration(declaration) && declaration.initializer) {
                    map.set(key, declaration.initializer);
                }
            }
        }
    }
    if (node.parent) {
        collectScope(node.parent, map);
    }
    return map;
}
function isCommandLocalizeUtility(node) {
    if (!ts.isCallExpression(node)) {
        return false;
    }
    return node.expression.getText() === 'Command.toLocalizedCommand';
}
const unescapeMap = {
    '\'': '\'',
    '"': '"',
    '\\': '\\',
    'n': '\n',
    'r': '\r',
    't': '\t',
    'b': '\b',
    'f': '\f'
};
function unescapeString(str) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        const ch = str.charAt(i);
        if (ch === '\\') {
            if (i + 1 < str.length) {
                const replace = unescapeMap[str.charAt(i + 1)];
                if (replace !== undefined) {
                    result.push(replace);
                    i++;
                    continue;
                }
            }
        }
        result.push(ch);
    }
    return result.join('');
}
//# sourceMappingURL=localization-extractor.js.map