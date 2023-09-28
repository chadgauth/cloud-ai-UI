"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
const assert = require("assert");
const Converter = require("./type-converters");
const types = require("./types-impl");
const markdown_string_1 = require("./markdown-string");
const markdown_rendering_1 = require("@theia/core/lib/common/markdown-rendering");
describe('Type converters:', () => {
    describe('convert ranges:', () => {
        // given
        const modelRange = {
            startLineNumber: 5,
            startColumn: 5,
            endLineNumber: 10,
            endColumn: 20
        };
        const pluginRange = new types.Range(4, 4, 9, 19);
        it('should convert to theia range', () => {
            // when
            const result = Converter.toRange(modelRange);
            // then
            assert.deepStrictEqual(result, pluginRange);
        });
        it('should convert to model range', () => {
            // when
            const result = Converter.fromRange(pluginRange);
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, modelRange);
        });
    });
    describe('markdown:', () => {
        describe('type guard:', () => {
            it('should recognize markdown string', () => {
                // given
                const markdownString = new markdown_string_1.MarkdownString('**test**');
                // when
                const result = markdown_rendering_1.MarkdownString.is(markdownString);
                // then
                assert.deepStrictEqual(result !== false, true);
            });
            it('should recognize markdown object', () => {
                // given
                const markdownObject = { value: '*test*' };
                // when
                const result = markdown_rendering_1.MarkdownString.is(markdownObject);
                // then
                assert.deepStrictEqual(result !== false, true);
            });
            it('should recognize markdown object with redundant fields', () => {
                // given
                const markdownObject = { field1: 5, value: '*test*', field2: 'test' };
                // when
                const result = markdown_rendering_1.MarkdownString.is(markdownObject);
                // then
                assert.deepStrictEqual(result !== false, true);
            });
            it('should reject non markdown object', () => {
                // given
                const nonMarkdownObject = { field1: 5, field2: 'test' };
                // when
                const result = markdown_rendering_1.MarkdownString.is(nonMarkdownObject);
                // then
                assert.deepStrictEqual(result === false, true);
            });
            it('should reject non markdown object if it contains isTrusted field', () => {
                // given
                const nonMarkdownObject = { isTrusted: true, field1: 5, field2: 'test' };
                // when
                const result = markdown_rendering_1.MarkdownString.is(nonMarkdownObject);
                // then
                assert.deepStrictEqual(result === false, true);
            });
        });
        describe('converter: ', () => {
            const aStringWithMarkdown = '**test**';
            const pluginMarkdown = new markdown_string_1.MarkdownString(aStringWithMarkdown);
            const aLanguage = 'typescript';
            const aValue = 'const x=5;';
            const codeblock = { language: aLanguage, value: aValue };
            const modelMarkdownWithCode = { value: '```' + aLanguage + '\n' + aValue + '\n```\n' };
            const modelMarkdown = { value: aStringWithMarkdown };
            it('should convert plugin markdown to model markdown', () => {
                // when
                const result = Converter.fromMarkdown(pluginMarkdown);
                // then
                assert.deepStrictEqual(result, { ...modelMarkdown, supportThemeIcons: false, supportHtml: false }, 'The implementation includes an explicit default `false` for `supportThemeIcons` and `supportHtml`');
            });
            it('should convert string to model markdown', () => {
                // when
                const result = Converter.fromMarkdown(aStringWithMarkdown);
                // then
                assert.deepStrictEqual(result, modelMarkdown);
            });
            it('should convert codeblock to model markdown', () => {
                // when
                const result = Converter.fromMarkdown(codeblock);
                // then
                assert.deepStrictEqual(result, modelMarkdownWithCode);
            });
            it('should convert array of markups to model markdown', () => {
                // given
                // eslint-disable-next-line deprecation/deprecation
                const markups = [
                    pluginMarkdown,
                    aStringWithMarkdown,
                    codeblock,
                    new markdown_string_1.MarkdownString('hello', true),
                ];
                // when
                const result = Converter.fromManyMarkdown(markups);
                // then
                assert.deepStrictEqual(Array.isArray(result), true);
                assert.deepStrictEqual(result.length, 4);
                assert.deepStrictEqual(result[0], { ...modelMarkdown, supportThemeIcons: false, supportHtml: false, }, 'MarkdownString implementation includes default value for `supportThemeIcons` and `supportHtml`');
                assert.deepStrictEqual(result[1], modelMarkdown, 'Strings should be converted to Markdown.');
                assert.deepStrictEqual(result[2], modelMarkdownWithCode, 'Objects matching the interface should be unchanged');
                assert.deepStrictEqual(result[3], { value: 'hello', supportThemeIcons: true, supportHtml: false }, 'The constructor argument to MarkdownString for theme icons is respected.');
            });
        });
    });
    describe('convert tasks:', () => {
        const customType = 'custom';
        const shellType = 'shell';
        const label = 'yarn build';
        const source = 'source';
        const command = 'yarn';
        const commandLine = 'yarn run build';
        const args = ['run', 'build'];
        const cwd = '/projects/theia';
        const additionalProperty = 'some property';
        const group = new types.TaskGroup('build', 'Build');
        const shellTaskDto = {
            type: shellType,
            taskType: shellType,
            label,
            source,
            scope: 1,
            command,
            args,
            options: { cwd },
            additionalProperty,
            presentation: {
                reveal: 3,
                focus: true
            },
            group: {
                kind: 'build',
                isDefault: false
            },
            runOptions: {
                reevaluateOnRerun: false
            }
        };
        const shellTaskDtoWithCommandLine = {
            type: shellType,
            taskType: shellType,
            label,
            source,
            scope: 2,
            command: commandLine,
            options: { cwd },
            additionalProperty,
            runOptions: {
                reevaluateOnRerun: false
            }
        };
        const shellPluginTask = {
            name: label,
            source,
            scope: 1,
            definition: {
                type: shellType,
                additionalProperty
            },
            presentationOptions: {
                reveal: types.TaskRevealKind.Never,
                focus: true
            },
            group,
            execution: {
                command,
                args,
                options: {
                    cwd
                }
            },
            runOptions: {
                reevaluateOnRerun: false
            }
        };
        const shellPluginTaskWithQuotedCommand = {
            ...shellPluginTask, execution: {
                command: {
                    quoting: types.ShellQuoting.Strong,
                    value: 'yarn'
                },
                args,
                options: {
                    cwd
                }
            }
        };
        const pluginTaskWithCommandLine = {
            name: label,
            source,
            scope: 2,
            definition: {
                type: shellType,
                additionalProperty
            },
            execution: {
                commandLine,
                options: {
                    cwd
                }
            },
            runOptions: {
                reevaluateOnRerun: false
            }
        };
        const customTaskDto = { ...shellTaskDto, type: customType };
        const customTaskDtoWithCommandLine = { ...shellTaskDtoWithCommandLine, type: customType };
        const customPluginTask = {
            ...shellPluginTask, definition: {
                type: customType,
                additionalProperty
            }
        };
        const customPluginTaskWithCommandLine = {
            name: label,
            source,
            scope: 2,
            definition: {
                type: customType,
                additionalProperty
            },
            execution: {
                commandLine,
                options: {
                    cwd
                }
            },
            runOptions: {
                reevaluateOnRerun: false
            }
        };
        it('should convert to task dto with string command', () => {
            // when
            const result = Converter.fromTask(shellPluginTask);
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, shellTaskDto);
        });
        it('should convert to task dto with ShellStringQuoted', () => {
            const result = Converter.fromTask(shellPluginTaskWithQuotedCommand);
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, shellTaskDto);
        });
        it('should convert from task dto', () => {
            // when
            const result = Converter.toTask(shellTaskDto);
            assert.strictEqual(result.execution instanceof types.ShellExecution, true);
            if (result.execution instanceof types.ShellExecution) {
                assert.strictEqual(result.execution.commandLine, undefined);
                result.execution = {
                    args: result.execution.args,
                    options: result.execution.options,
                    command: result.execution.command
                };
            }
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, shellPluginTask);
        });
        it('should convert to task dto from task with commandline', () => {
            // when
            const result = Converter.fromTask(pluginTaskWithCommandLine);
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, shellTaskDtoWithCommandLine);
        });
        it('should convert task with custom type to dto', () => {
            // when
            const result = Converter.fromTask(customPluginTask);
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, customTaskDto);
        });
        it('should convert task with custom type from dto', () => {
            // when
            const result = Converter.toTask(customTaskDto);
            assert.strictEqual(result.execution instanceof types.ShellExecution, true);
            if (result.execution instanceof types.ShellExecution) {
                assert.strictEqual(result.execution.commandLine, undefined);
                result.execution = {
                    args: result.execution.args,
                    options: result.execution.options,
                    command: result.execution.command
                };
            }
            // then
            assert.deepStrictEqual(result, customPluginTask);
        });
        it('should convert to task dto from custom task with commandline', () => {
            // when
            const result = Converter.fromTask(customPluginTaskWithCommandLine);
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, customTaskDtoWithCommandLine);
        });
    });
    describe('Webview Panel Show Options:', () => {
        it('should create options from view column ', () => {
            const viewColumn = types.ViewColumn.Five;
            const showOptions = {
                area: types.WebviewPanelTargetArea.Main,
                viewColumn: types.ViewColumn.Four,
                preserveFocus: false
            };
            // when
            const result = Converter.toWebviewPanelShowOptions(viewColumn);
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, showOptions);
        });
        it('should create options from given "WebviewPanelShowOptions" object ', () => {
            const incomingObject = {
                area: types.WebviewPanelTargetArea.Main,
                viewColumn: types.ViewColumn.Five,
                preserveFocus: true
            };
            const showOptions = {
                area: types.WebviewPanelTargetArea.Main,
                viewColumn: types.ViewColumn.Four,
                preserveFocus: true
            };
            // when
            const result = Converter.toWebviewPanelShowOptions(incomingObject);
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, showOptions);
        });
        it('should set default "main" area', () => {
            const incomingObject = {
                viewColumn: types.ViewColumn.Five,
                preserveFocus: false
            };
            const showOptions = {
                area: types.WebviewPanelTargetArea.Main,
                viewColumn: types.ViewColumn.Four,
                preserveFocus: false
            };
            // when
            const result = Converter.toWebviewPanelShowOptions(incomingObject);
            // then
            assert.notStrictEqual(result, undefined);
            assert.deepStrictEqual(result, showOptions);
        });
    });
    describe('#convertCode', () => {
        it('should convert a "code" of type "string"', () => {
            assert.strictEqual(Converter.convertCode('string'), 'string');
        });
        it('should convert a "code" of type "number"', () => {
            assert.strictEqual(Converter.convertCode(4), '4');
        });
        it('should convert an undefined "code"', () => {
            assert.strictEqual(Converter.convertCode(undefined), undefined);
        });
        it('should convert a "code" of type "{ value: number, target: Uri }"', () => {
            const uri = types.URI.parse('foo://example.com:8042/over/there?name=ferret#nose');
            assert.strictEqual(Converter.convertCode({ value: 4, target: uri }), '4');
        });
        it('should convert a "code" of type "{ value: number, target: Uri }"', () => {
            const uri = types.URI.parse('foo://example.com:8042/over/there?name=ferret#nose');
            assert.strictEqual(Converter.convertCode({ value: 'string', target: uri }), 'string');
        });
    });
});
//# sourceMappingURL=type-converters.spec.js.map