"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.createTextmateTokenizer = exports.TokenizerState = void 0;
const vscode_textmate_1 = require("vscode-textmate");
class TokenizerState {
    constructor(stackElement) {
        this.stackElement = stackElement;
    }
    clone() {
        return new TokenizerState(this.stackElement);
    }
    equals(other) {
        return other instanceof TokenizerState && (other === this || other.stackElement === this.stackElement);
    }
}
exports.TokenizerState = TokenizerState;
function createTextmateTokenizer(grammar, options) {
    if (options.lineLimit !== undefined && (options.lineLimit <= 0 || !Number.isInteger(options.lineLimit))) {
        throw new Error(`The 'lineLimit' must be a positive integer. It was ${options.lineLimit}.`);
    }
    return {
        getInitialState: () => new TokenizerState(vscode_textmate_1.INITIAL),
        tokenizeEncoded(line, state) {
            if (options.lineLimit !== undefined && line.length > options.lineLimit) {
                // Skip tokenizing the line if it exceeds the line limit.
                return { endState: state.stackElement, tokens: new Uint32Array() };
            }
            const result = grammar.tokenizeLine2(line, state.stackElement, 500);
            return {
                endState: new TokenizerState(result.ruleStack),
                tokens: result.tokens
            };
        },
        tokenize(line, state) {
            if (options.lineLimit !== undefined && line.length > options.lineLimit) {
                // Skip tokenizing the line if it exceeds the line limit.
                return { endState: state.stackElement, tokens: [] };
            }
            const result = grammar.tokenizeLine(line, state.stackElement, 500);
            return {
                endState: new TokenizerState(result.ruleStack),
                tokens: result.tokens.map(t => ({
                    startIndex: t.startIndex,
                    scopes: t.scopes.reverse().join(' ')
                }))
            };
        }
    };
}
exports.createTextmateTokenizer = createTextmateTokenizer;
//# sourceMappingURL=textmate-tokenizer.js.map