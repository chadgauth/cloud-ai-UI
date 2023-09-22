/********************************************************************************
 * Copyright (C) 2022 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
import { CommandContribution, CommandRegistry, MaybeArray, MessageService } from '@theia/core';
import { interfaces } from '@theia/core/shared/inversify';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { PreferenceItem, PreferenceValidationService } from '@theia/core/lib/browser';
import { JSONValue } from '@theia/core/shared/@phosphor/coreutils';
import { JsonType } from '@theia/core/lib/common/json-schema';
import { MonacoEditorProvider } from '@theia/monaco/lib/browser/monaco-editor-provider';
/**
 * This class is intended for use when uplifting Monaco.
 */
export declare class MonacoEditorPreferenceSchemaExtractor implements CommandContribution {
    protected readonly workspaceService: WorkspaceService;
    protected readonly messageService: MessageService;
    protected readonly fileService: FileService;
    protected readonly preferenceValidationService: PreferenceValidationService;
    protected readonly monacoEditorProvider: MonacoEditorProvider;
    registerCommands(commands: CommandRegistry): void;
    protected codeSnippetReplacer(): (key: string, value: any) => any;
    protected getScope(monacoScope: unknown): string | undefined;
    protected formatSchemaForInterface(schema: PreferenceItem): string;
    protected formatTypeForInterface(jsonType?: MaybeArray<JsonType | JSONValue> | undefined): string;
    protected dequoteCodeSnippets(stringification: string): string;
    /**
     * Ensures that options that are only relevant on certain platforms are caught.
     * Check for use of `platform` in src/vs/editor/common/config/editorOptions.ts
     */
    protected guaranteePlatformOptions(properties: object): void;
}
export declare function bindMonacoPreferenceExtractor(bind: interfaces.Bind): void;
//# sourceMappingURL=monaco-editor-preference-extractor.d.ts.map