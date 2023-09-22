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
exports.DebugScope = exports.ExpressionItem = exports.DebugVirtualVariable = exports.DebugVariable = exports.ExpressionContainer = void 0;
const React = require("@theia/core/shared/react");
const browser_1 = require("@theia/core/lib/browser");
const console_session_1 = require("@theia/console/lib/browser/console-session");
const severity_1 = require("@theia/core/lib/common/severity");
const monaco = require("@theia/monaco-editor-core");
const core_1 = require("@theia/core");
class ExpressionContainer {
    constructor(options) {
        this.sessionProvider = options.session;
        this.variablesReference = options.variablesReference || 0;
        this.namedVariables = options.namedVariables;
        this.indexedVariables = options.indexedVariables;
        this.startOfVariables = options.startOfVariables || 0;
    }
    get session() {
        return this.sessionProvider();
    }
    render() {
        return undefined;
    }
    get hasElements() {
        return !!this.variablesReference;
    }
    async getElements() {
        if (!this.hasElements || !this.session) {
            return [][Symbol.iterator]();
        }
        if (!this.elements) {
            this.elements = this.doResolve();
        }
        return (await this.elements)[Symbol.iterator]();
    }
    async doResolve() {
        const result = [];
        if (this.namedVariables) {
            await this.fetch(result, 'named');
        }
        if (this.indexedVariables) {
            let chunkSize = ExpressionContainer.BASE_CHUNK_SIZE;
            while (this.indexedVariables > chunkSize * ExpressionContainer.BASE_CHUNK_SIZE) {
                chunkSize *= ExpressionContainer.BASE_CHUNK_SIZE;
            }
            if (this.indexedVariables > chunkSize) {
                const numberOfChunks = Math.ceil(this.indexedVariables / chunkSize);
                for (let i = 0; i < numberOfChunks; i++) {
                    const start = this.startOfVariables + i * chunkSize;
                    const count = Math.min(chunkSize, this.indexedVariables - i * chunkSize);
                    const { variablesReference } = this;
                    result.push(new DebugVirtualVariable({
                        session: this.sessionProvider,
                        variablesReference,
                        namedVariables: 0,
                        indexedVariables: count,
                        startOfVariables: start,
                        name: `[${start}..${start + count - 1}]`
                    }));
                }
                return result;
            }
        }
        await this.fetch(result, 'indexed', this.startOfVariables, this.indexedVariables);
        return result;
    }
    async fetch(result, filter, start, count) {
        try {
            const { variablesReference } = this;
            const response = await this.session.sendRequest('variables', { variablesReference, filter, start, count });
            const { variables } = response.body;
            const names = new Set();
            for (const variable of variables) {
                if (!names.has(variable.name)) {
                    result.push(new DebugVariable(this.sessionProvider, variable, this));
                    names.add(variable.name);
                }
            }
        }
        catch (e) {
            result.push({
                severity: severity_1.Severity.Error,
                visible: !!e.message,
                render: () => e.message
            });
        }
    }
}
exports.ExpressionContainer = ExpressionContainer;
ExpressionContainer.BASE_CHUNK_SIZE = 100;
class DebugVariable extends ExpressionContainer {
    constructor(session, variable, parent) {
        super({
            session,
            variablesReference: variable.variablesReference,
            namedVariables: variable.namedVariables,
            indexedVariables: variable.indexedVariables
        });
        this.variable = variable;
        this.parent = parent;
        this.setValueRef = (valueRef) => this.valueRef = valueRef || undefined;
        this.setNameRef = (nameRef) => this.nameRef = nameRef || undefined;
    }
    get name() {
        return this.variable.name;
    }
    get type() {
        return this._type || this.variable.type;
    }
    get value() {
        return this._value || this.variable.value;
    }
    render() {
        const { type, value, name } = this;
        return React.createElement("div", { className: this.variableClassName },
            React.createElement("span", { title: type || name, className: 'name', ref: this.setNameRef },
                name,
                !!value && ': '),
            React.createElement("span", { title: value, ref: this.setValueRef }, value));
    }
    get variableClassName() {
        const { type, value } = this;
        const classNames = ['theia-debug-console-variable'];
        if (type === 'number' || type === 'boolean' || type === 'string') {
            classNames.push(type);
        }
        else if (!isNaN(+value)) {
            classNames.push('number');
        }
        else if (DebugVariable.booleanRegex.test(value)) {
            classNames.push('boolean');
        }
        else if (DebugVariable.stringRegex.test(value)) {
            classNames.push('string');
        }
        return classNames.join(' ');
    }
    get supportSetVariable() {
        return !!this.session && !!this.session.capabilities.supportsSetVariable;
    }
    async setValue(value) {
        if (!this.session) {
            return;
        }
        const { name, parent } = this;
        const variablesReference = parent['variablesReference'];
        try {
            const response = await this.session.sendRequest('setVariable', { variablesReference, name, value });
            this._value = response.body.value;
            this._type = response.body.type;
            this.variablesReference = response.body.variablesReference || 0;
            this.namedVariables = response.body.namedVariables;
            this.indexedVariables = response.body.indexedVariables;
            this.elements = undefined;
            this.session['fireDidChange']();
        }
        catch (error) {
            console.error('setValue failed:', error);
        }
    }
    get supportCopyValue() {
        return !!this.valueRef && document.queryCommandSupported('copy');
    }
    copyValue() {
        const selection = document.getSelection();
        if (this.valueRef && selection) {
            selection.selectAllChildren(this.valueRef);
            document.execCommand('copy');
        }
    }
    get supportCopyAsExpression() {
        return !!this.nameRef && document.queryCommandSupported('copy');
    }
    copyAsExpression() {
        const selection = document.getSelection();
        if (this.nameRef && selection) {
            selection.selectAllChildren(this.nameRef);
            document.execCommand('copy');
        }
    }
    async open() {
        if (!this.supportSetVariable) {
            return;
        }
        const input = new browser_1.SingleTextInputDialog({
            title: core_1.nls.localize('theia/debug/debugVariableInput', 'Set {0} Value', this.name),
            initialValue: this.value,
            placeholder: core_1.nls.localizeByDefault('Value')
        });
        const newValue = await input.open();
        if (newValue) {
            await this.setValue(newValue);
        }
    }
}
exports.DebugVariable = DebugVariable;
DebugVariable.booleanRegex = /^true|false$/i;
DebugVariable.stringRegex = /^(['"]).*\1$/;
class DebugVirtualVariable extends ExpressionContainer {
    constructor(options) {
        super(options);
        this.options = options;
    }
    render() {
        return this.options.name;
    }
}
exports.DebugVirtualVariable = DebugVirtualVariable;
class ExpressionItem extends ExpressionContainer {
    constructor(_expression, session) {
        super({ session });
        this._expression = _expression;
        this._value = ExpressionItem.notAvailable;
        this._available = false;
    }
    get value() {
        return this._value;
    }
    get type() {
        return this._type;
    }
    get available() {
        return this._available;
    }
    get expression() {
        return this._expression;
    }
    render() {
        const valueClassNames = [];
        if (!this._available) {
            valueClassNames.push(console_session_1.ConsoleItem.errorClassName);
            valueClassNames.push('theia-debug-console-unavailable');
        }
        return React.createElement("div", { className: 'theia-debug-console-expression' },
            React.createElement("div", null, this._expression),
            React.createElement("div", { className: valueClassNames.join(' ') }, this._value));
    }
    async evaluate(context = 'repl') {
        const session = this.session;
        if (session) {
            try {
                const body = await session.evaluate(this._expression, context);
                this.setResult(body);
            }
            catch (err) {
                this.setResult(undefined, err.message);
            }
        }
        else {
            this.setResult(undefined, 'Please start a debug session to evaluate');
        }
    }
    setResult(body, error = ExpressionItem.notAvailable) {
        if (body) {
            this._value = body.result;
            this._type = body.type;
            this._available = true;
            this.variablesReference = body.variablesReference;
            this.namedVariables = body.namedVariables;
            this.indexedVariables = body.indexedVariables;
            this.severity = severity_1.Severity.Log;
        }
        else {
            this._value = error;
            this._type = undefined;
            this._available = false;
            this.variablesReference = 0;
            this.namedVariables = undefined;
            this.indexedVariables = undefined;
            this.severity = severity_1.Severity.Error;
        }
        this.elements = undefined;
    }
}
exports.ExpressionItem = ExpressionItem;
ExpressionItem.notAvailable = 'not available';
class DebugScope extends ExpressionContainer {
    constructor(raw, session) {
        super({
            session,
            variablesReference: raw.variablesReference,
            namedVariables: raw.namedVariables,
            indexedVariables: raw.indexedVariables
        });
        this.raw = raw;
    }
    render() {
        return this.name;
    }
    get expensive() {
        return this.raw.expensive;
    }
    get range() {
        const { line, column, endLine, endColumn } = this.raw;
        if (line !== undefined && column !== undefined && endLine !== undefined && endColumn !== undefined) {
            return new monaco.Range(line, column, endLine, endColumn);
        }
        return undefined;
    }
    get name() {
        return this.raw.name;
    }
}
exports.DebugScope = DebugScope;
//# sourceMappingURL=debug-console-items.js.map