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
import { PreferenceSchema } from '@theia/core/lib/browser';
/**
 * Please do not modify this file by hand. It should be generated automatically
 * during a Monaco uplift using the command registered by monaco-editor-preference-extractor.ts
 * The only manual work required is fixing preferences with type 'array' or 'object'.
 */
export declare const editorGeneratedPreferenceProperties: PreferenceSchema['properties'];
declare type QuickSuggestionValues = boolean | 'on' | 'inline' | 'off';
export interface GeneratedEditorPreferences {
    'editor.tabSize': number;
    'editor.insertSpaces': boolean;
    'editor.detectIndentation': boolean;
    'editor.trimAutoWhitespace': boolean;
    'editor.largeFileOptimizations': boolean;
    'editor.wordBasedSuggestions': boolean;
    'editor.wordBasedSuggestionsMode': 'currentDocument' | 'matchingDocuments' | 'allDocuments';
    'editor.semanticHighlighting.enabled': true | false | 'configuredByTheme';
    'editor.stablePeek': boolean;
    'editor.maxTokenizationLineLength': number;
    'editor.language.brackets': Array<[string, string]> | null | 'null';
    'editor.language.colorizedBracketPairs': Array<[string, string]> | null;
    'diffEditor.maxComputationTime': number;
    'diffEditor.maxFileSize': number;
    'diffEditor.renderSideBySide': boolean;
    'diffEditor.renderMarginRevertIcon': boolean;
    'diffEditor.ignoreTrimWhitespace': boolean;
    'diffEditor.renderIndicators': boolean;
    'diffEditor.codeLens': boolean;
    'diffEditor.wordWrap': 'off' | 'on' | 'inherit';
    'diffEditor.diffAlgorithm': 'smart' | 'experimental';
    'editor.acceptSuggestionOnCommitCharacter': boolean;
    'editor.acceptSuggestionOnEnter': 'on' | 'smart' | 'off';
    'editor.accessibilitySupport': 'auto' | 'on' | 'off';
    'editor.accessibilityPageSize': number;
    'editor.autoClosingBrackets': 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
    'editor.autoClosingDelete': 'always' | 'auto' | 'never';
    'editor.autoClosingOvertype': 'always' | 'auto' | 'never';
    'editor.autoClosingQuotes': 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
    'editor.autoIndent': 'none' | 'keep' | 'brackets' | 'advanced' | 'full';
    'editor.autoSurround': 'languageDefined' | 'quotes' | 'brackets' | 'never';
    'editor.bracketPairColorization.enabled': boolean;
    'editor.bracketPairColorization.independentColorPoolPerBracketType': boolean;
    'editor.guides.bracketPairs': true | 'active' | false;
    'editor.guides.bracketPairsHorizontal': true | 'active' | false;
    'editor.guides.highlightActiveBracketPair': boolean;
    'editor.guides.indentation': boolean;
    'editor.guides.highlightActiveIndentation': true | 'always' | false;
    'editor.codeLens': boolean;
    'editor.codeLensFontFamily': string;
    'editor.codeLensFontSize': number;
    'editor.colorDecorators': boolean;
    'editor.columnSelection': boolean;
    'editor.comments.insertSpace': boolean;
    'editor.comments.ignoreEmptyLines': boolean;
    'editor.copyWithSyntaxHighlighting': boolean;
    'editor.cursorBlinking': 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
    'editor.cursorSmoothCaretAnimation': boolean;
    'editor.cursorStyle': 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
    'editor.cursorSurroundingLines': number;
    'editor.cursorSurroundingLinesStyle': 'default' | 'all';
    'editor.cursorWidth': number;
    'editor.dragAndDrop': boolean;
    'editor.dropIntoEditor.enabled': boolean;
    'editor.emptySelectionClipboard': boolean;
    'editor.fastScrollSensitivity': number;
    'editor.find.cursorMoveOnType': boolean;
    'editor.find.seedSearchStringFromSelection': 'never' | 'always' | 'selection';
    'editor.find.autoFindInSelection': 'never' | 'always' | 'multiline';
    'editor.find.addExtraSpaceOnTop': boolean;
    'editor.find.loop': boolean;
    'editor.folding': boolean;
    'editor.foldingStrategy': 'auto' | 'indentation';
    'editor.foldingHighlight': boolean;
    'editor.foldingImportsByDefault': boolean;
    'editor.foldingMaximumRegions': number;
    'editor.unfoldOnClickAfterEndOfLine': boolean;
    'editor.fontFamily': string;
    'editor.fontLigatures': boolean | string;
    'editor.fontSize': number;
    'editor.fontWeight': number | string | 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    'editor.formatOnPaste': boolean;
    'editor.formatOnType': boolean;
    'editor.glyphMargin': boolean;
    'editor.gotoLocation.multiple': null;
    'editor.gotoLocation.multipleDefinitions': 'peek' | 'gotoAndPeek' | 'goto';
    'editor.gotoLocation.multipleTypeDefinitions': 'peek' | 'gotoAndPeek' | 'goto';
    'editor.gotoLocation.multipleDeclarations': 'peek' | 'gotoAndPeek' | 'goto';
    'editor.gotoLocation.multipleImplementations': 'peek' | 'gotoAndPeek' | 'goto';
    'editor.gotoLocation.multipleReferences': 'peek' | 'gotoAndPeek' | 'goto';
    'editor.gotoLocation.alternativeDefinitionCommand': '' | 'editor.action.referenceSearch.trigger' | 'editor.action.goToReferences' | 'editor.action.peekImplementation' | 'editor.action.goToImplementation' | 'editor.action.peekTypeDefinition' | 'editor.action.goToTypeDefinition' | 'editor.action.peekDeclaration' | 'editor.action.revealDeclaration' | 'editor.action.peekDefinition' | 'editor.action.revealDefinitionAside' | 'editor.action.revealDefinition';
    'editor.gotoLocation.alternativeTypeDefinitionCommand': '' | 'editor.action.referenceSearch.trigger' | 'editor.action.goToReferences' | 'editor.action.peekImplementation' | 'editor.action.goToImplementation' | 'editor.action.peekTypeDefinition' | 'editor.action.goToTypeDefinition' | 'editor.action.peekDeclaration' | 'editor.action.revealDeclaration' | 'editor.action.peekDefinition' | 'editor.action.revealDefinitionAside' | 'editor.action.revealDefinition';
    'editor.gotoLocation.alternativeDeclarationCommand': '' | 'editor.action.referenceSearch.trigger' | 'editor.action.goToReferences' | 'editor.action.peekImplementation' | 'editor.action.goToImplementation' | 'editor.action.peekTypeDefinition' | 'editor.action.goToTypeDefinition' | 'editor.action.peekDeclaration' | 'editor.action.revealDeclaration' | 'editor.action.peekDefinition' | 'editor.action.revealDefinitionAside' | 'editor.action.revealDefinition';
    'editor.gotoLocation.alternativeImplementationCommand': '' | 'editor.action.referenceSearch.trigger' | 'editor.action.goToReferences' | 'editor.action.peekImplementation' | 'editor.action.goToImplementation' | 'editor.action.peekTypeDefinition' | 'editor.action.goToTypeDefinition' | 'editor.action.peekDeclaration' | 'editor.action.revealDeclaration' | 'editor.action.peekDefinition' | 'editor.action.revealDefinitionAside' | 'editor.action.revealDefinition';
    'editor.gotoLocation.alternativeReferenceCommand': '' | 'editor.action.referenceSearch.trigger' | 'editor.action.goToReferences' | 'editor.action.peekImplementation' | 'editor.action.goToImplementation' | 'editor.action.peekTypeDefinition' | 'editor.action.goToTypeDefinition' | 'editor.action.peekDeclaration' | 'editor.action.revealDeclaration' | 'editor.action.peekDefinition' | 'editor.action.revealDefinitionAside' | 'editor.action.revealDefinition';
    'editor.hideCursorInOverviewRuler': boolean;
    'editor.hover.enabled': boolean;
    'editor.hover.delay': number;
    'editor.hover.sticky': boolean;
    'editor.hover.above': boolean;
    'editor.inlineSuggest.enabled': boolean;
    'editor.letterSpacing': number;
    'editor.lightbulb.enabled': boolean;
    'editor.lineHeight': number;
    'editor.lineNumbers': 'off' | 'on' | 'relative' | 'interval';
    'editor.linkedEditing': boolean;
    'editor.links': boolean;
    'editor.matchBrackets': 'always' | 'near' | 'never';
    'editor.minimap.enabled': boolean;
    'editor.minimap.autohide': boolean;
    'editor.minimap.size': 'proportional' | 'fill' | 'fit';
    'editor.minimap.side': 'left' | 'right';
    'editor.minimap.showSlider': 'always' | 'mouseover';
    'editor.minimap.scale': '1' | '2' | '3';
    'editor.minimap.renderCharacters': boolean;
    'editor.minimap.maxColumn': number;
    'editor.mouseWheelScrollSensitivity': number;
    'editor.mouseWheelZoom': boolean;
    'editor.multiCursorMergeOverlapping': boolean;
    'editor.multiCursorModifier': 'ctrlCmd' | 'alt';
    'editor.multiCursorPaste': 'spread' | 'full';
    'editor.occurrencesHighlight': boolean;
    'editor.overviewRulerBorder': boolean;
    'editor.padding.top': number;
    'editor.padding.bottom': number;
    'editor.parameterHints.enabled': boolean;
    'editor.parameterHints.cycle': boolean;
    'editor.peekWidgetDefaultFocus': 'tree' | 'editor';
    'editor.definitionLinkOpensInPeek': boolean;
    'editor.quickSuggestions': boolean | {
        other?: QuickSuggestionValues;
        comments?: QuickSuggestionValues;
        strings?: QuickSuggestionValues;
    };
    'editor.quickSuggestionsDelay': number;
    'editor.renameOnType': boolean;
    'editor.renderControlCharacters': boolean;
    'editor.renderFinalNewline': boolean;
    'editor.renderLineHighlight': 'none' | 'gutter' | 'line' | 'all';
    'editor.renderLineHighlightOnlyWhenFocus': boolean;
    'editor.renderWhitespace': 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
    'editor.roundedSelection': boolean;
    'editor.rulers': Array<number | {
        column: number;
        color: string;
    }>;
    'editor.scrollbar.vertical': 'auto' | 'visible' | 'hidden';
    'editor.scrollbar.horizontal': 'auto' | 'visible' | 'hidden';
    'editor.scrollbar.verticalScrollbarSize': number;
    'editor.scrollbar.horizontalScrollbarSize': number;
    'editor.scrollbar.scrollByPage': boolean;
    'editor.scrollBeyondLastColumn': number;
    'editor.scrollBeyondLastLine': boolean;
    'editor.scrollPredominantAxis': boolean;
    'editor.selectionClipboard': boolean;
    'editor.selectionHighlight': boolean;
    'editor.showFoldingControls': 'always' | 'never' | 'mouseover';
    'editor.showUnused': boolean;
    'editor.snippetSuggestions': 'top' | 'bottom' | 'inline' | 'none';
    'editor.smartSelect.selectLeadingAndTrailingWhitespace': boolean;
    'editor.smoothScrolling': boolean;
    'editor.stickyScroll.enabled': boolean;
    'editor.stickyScroll.maxLineCount': number;
    'editor.stickyTabStops': boolean;
    'editor.suggest.insertMode': 'insert' | 'replace';
    'editor.suggest.filterGraceful': boolean;
    'editor.suggest.localityBonus': boolean;
    'editor.suggest.shareSuggestSelections': boolean;
    'editor.suggest.snippetsPreventQuickSuggestions': boolean;
    'editor.suggest.showIcons': boolean;
    'editor.suggest.showStatusBar': boolean;
    'editor.suggest.preview': boolean;
    'editor.suggest.showInlineDetails': boolean;
    'editor.suggest.maxVisibleSuggestions': number;
    'editor.suggest.filteredTypes': Record<string, boolean>;
    'editor.suggest.showMethods': boolean;
    'editor.suggest.showFunctions': boolean;
    'editor.suggest.showConstructors': boolean;
    'editor.suggest.showDeprecated': boolean;
    'editor.suggest.matchOnWordStartOnly': boolean;
    'editor.suggest.showFields': boolean;
    'editor.suggest.showVariables': boolean;
    'editor.suggest.showClasses': boolean;
    'editor.suggest.showStructs': boolean;
    'editor.suggest.showInterfaces': boolean;
    'editor.suggest.showModules': boolean;
    'editor.suggest.showProperties': boolean;
    'editor.suggest.showEvents': boolean;
    'editor.suggest.showOperators': boolean;
    'editor.suggest.showUnits': boolean;
    'editor.suggest.showValues': boolean;
    'editor.suggest.showConstants': boolean;
    'editor.suggest.showEnums': boolean;
    'editor.suggest.showEnumMembers': boolean;
    'editor.suggest.showKeywords': boolean;
    'editor.suggest.showWords': boolean;
    'editor.suggest.showColors': boolean;
    'editor.suggest.showFiles': boolean;
    'editor.suggest.showReferences': boolean;
    'editor.suggest.showCustomcolors': boolean;
    'editor.suggest.showFolders': boolean;
    'editor.suggest.showTypeParameters': boolean;
    'editor.suggest.showSnippets': boolean;
    'editor.suggest.showUsers': boolean;
    'editor.suggest.showIssues': boolean;
    'editor.suggestFontSize': number;
    'editor.suggestLineHeight': number;
    'editor.suggestOnTriggerCharacters': boolean;
    'editor.suggestSelection': 'first' | 'recentlyUsed' | 'recentlyUsedByPrefix';
    'editor.tabCompletion': 'on' | 'off' | 'onlySnippets';
    'editor.unicodeHighlight.nonBasicASCII': true | false | 'inUntrustedWorkspace';
    'editor.unicodeHighlight.invisibleCharacters': boolean;
    'editor.unicodeHighlight.ambiguousCharacters': boolean;
    'editor.unicodeHighlight.includeComments': true | false | 'inUntrustedWorkspace';
    'editor.unicodeHighlight.includeStrings': true | false | 'inUntrustedWorkspace';
    'editor.unicodeHighlight.allowedCharacters': Record<string, boolean>;
    'editor.unicodeHighlight.allowedLocales': Record<string, boolean>;
    'editor.unusualLineTerminators': 'auto' | 'off' | 'prompt';
    'editor.useTabStops': boolean;
    'editor.wordSeparators': string;
    'editor.wordWrap': 'off' | 'on' | 'wordWrapColumn' | 'bounded';
    'editor.wordWrapColumn': number;
    'editor.wrappingIndent': 'none' | 'same' | 'indent' | 'deepIndent';
    'editor.wrappingStrategy': 'simple' | 'advanced';
    'editor.showDeprecated': boolean;
    'editor.inlayHints.enabled': 'on' | 'onUnlessPressed' | 'offUnlessPressed' | 'off';
    'editor.inlayHints.fontSize': number;
    'editor.inlayHints.fontFamily': string;
    'editor.inlayHints.padding': boolean;
    'editor.codeActionWidget.showHeaders': boolean;
    'editor.experimental.pasteActions.enabled': boolean;
    'editor.rename.enablePreview': boolean;
    'editor.find.globalFindClipboard': boolean;
}
export {};
//# sourceMappingURL=editor-generated-preference-schema.d.ts.map