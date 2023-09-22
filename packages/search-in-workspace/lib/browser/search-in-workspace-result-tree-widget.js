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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchInWorkspaceResultTreeWidget = exports.SearchInWorkspaceResultLineNode = exports.SearchInWorkspaceFileNode = exports.SearchInWorkspaceRootFolderNode = exports.SearchInWorkspaceRoot = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const core_1 = require("@theia/core");
const browser_2 = require("@theia/editor/lib/browser");
const browser_3 = require("@theia/workspace/lib/browser");
const browser_4 = require("@theia/filesystem/lib/browser");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const search_in_workspace_service_1 = require("./search-in-workspace-service");
const common_1 = require("@theia/core/lib/common");
const uri_1 = require("@theia/core/lib/common/uri");
const React = require("@theia/core/shared/react");
const search_in_workspace_preferences_1 = require("./search-in-workspace-preferences");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
const minimatch = require("minimatch");
const disposable_1 = require("@theia/core/lib/common/disposable");
const debounce = require("@theia/core/shared/lodash.debounce");
const nls_1 = require("@theia/core/lib/common/nls");
const ROOT_ID = 'ResultTree';
var SearchInWorkspaceRoot;
(function (SearchInWorkspaceRoot) {
    function is(node) {
        return browser_1.CompositeTreeNode.is(node) && node.id === ROOT_ID;
    }
    SearchInWorkspaceRoot.is = is;
})(SearchInWorkspaceRoot = exports.SearchInWorkspaceRoot || (exports.SearchInWorkspaceRoot = {}));
var SearchInWorkspaceRootFolderNode;
(function (SearchInWorkspaceRootFolderNode) {
    function is(node) {
        return browser_1.ExpandableTreeNode.is(node) && browser_1.SelectableTreeNode.is(node) && 'path' in node && 'folderUri' in node && !('fileUri' in node);
    }
    SearchInWorkspaceRootFolderNode.is = is;
})(SearchInWorkspaceRootFolderNode = exports.SearchInWorkspaceRootFolderNode || (exports.SearchInWorkspaceRootFolderNode = {}));
var SearchInWorkspaceFileNode;
(function (SearchInWorkspaceFileNode) {
    function is(node) {
        return browser_1.ExpandableTreeNode.is(node) && browser_1.SelectableTreeNode.is(node) && 'path' in node && 'fileUri' in node && !('folderUri' in node);
    }
    SearchInWorkspaceFileNode.is = is;
})(SearchInWorkspaceFileNode = exports.SearchInWorkspaceFileNode || (exports.SearchInWorkspaceFileNode = {}));
var SearchInWorkspaceResultLineNode;
(function (SearchInWorkspaceResultLineNode) {
    function is(node) {
        return browser_1.SelectableTreeNode.is(node) && 'line' in node && 'character' in node && 'lineText' in node;
    }
    SearchInWorkspaceResultLineNode.is = is;
})(SearchInWorkspaceResultLineNode = exports.SearchInWorkspaceResultLineNode || (exports.SearchInWorkspaceResultLineNode = {}));
let SearchInWorkspaceResultTreeWidget = class SearchInWorkspaceResultTreeWidget extends browser_1.TreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this._showReplaceButtons = false;
        this._replaceTerm = '';
        this.searchTerm = '';
        this.startSearchOnModification = (activeEditor) => debounce(() => this.searchActiveEditor(activeEditor, this.searchTerm, this.searchOptions), this.searchOnEditorModificationDelay);
        this.searchOnEditorModificationDelay = 300;
        this.toDisposeOnActiveEditorChanged = new disposable_1.DisposableCollection();
        // The default root name to add external search results in the case that a workspace is opened.
        this.defaultRootName = nls_1.nls.localizeByDefault('Other files');
        this.forceVisibleRootNode = false;
        this.appliedDecorations = new Map();
        this.changeEmitter = new core_1.Emitter();
        this.onExpansionChangedEmitter = new core_1.Emitter();
        this.onExpansionChanged = this.onExpansionChangedEmitter.event;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.focusInputEmitter = new core_1.Emitter();
        this.remove = (node, e) => this.doRemove(node, e);
        model.root = {
            id: ROOT_ID,
            parent: undefined,
            visible: false,
            children: []
        };
        this.toDispose.push(model.onSelectionChanged(nodes => {
            const node = nodes[0];
            if (SearchInWorkspaceResultLineNode.is(node)) {
                this.doOpen(node, true, true);
            }
        }));
        this.toDispose.push(model.onOpenNode(node => {
            if (SearchInWorkspaceResultLineNode.is(node)) {
                this.doOpen(node, true, false);
            }
        }));
        this.resultTree = new Map();
        this.toDispose.push(model.onNodeRefreshed(() => this.changeEmitter.fire(this.resultTree)));
    }
    init() {
        super.init();
        this.addClass('resultContainer');
        this.toDispose.push(this.changeEmitter);
        this.toDispose.push(this.focusInputEmitter);
        this.toDispose.push(this.editorManager.onActiveEditorChanged(activeEditor => {
            this.updateCurrentEditorDecorations();
            this.toDisposeOnActiveEditorChanged.dispose();
            this.toDispose.push(this.toDisposeOnActiveEditorChanged);
            if (activeEditor) {
                this.toDisposeOnActiveEditorChanged.push(activeEditor.editor.onDocumentContentChanged(() => {
                    if (this.searchTerm !== '' && this.searchInWorkspacePreferences['search.searchOnEditorModification']) {
                        this.startSearchOnModification(activeEditor)();
                    }
                }));
            }
        }));
        this.toDispose.push(this.searchInWorkspacePreferences.onPreferenceChanged(() => {
            this.update();
        }));
        this.toDispose.push(this.fileService.onDidFilesChange(event => {
            if (event.gotDeleted()) {
                event.getDeleted().forEach(deletedFile => {
                    const fileNodes = this.getFileNodesByUri(deletedFile.resource);
                    fileNodes.forEach(node => this.removeFileNode(node));
                });
                this.model.refresh();
            }
        }));
        this.toDispose.push(this.model.onExpansionChanged(() => {
            this.onExpansionChangedEmitter.fire(undefined);
        }));
    }
    get fileNumber() {
        let num = 0;
        for (const rootFolderNode of this.resultTree.values()) {
            num += rootFolderNode.children.length;
        }
        return num;
    }
    set showReplaceButtons(srb) {
        this._showReplaceButtons = srb;
        this.update();
    }
    set replaceTerm(rt) {
        this._replaceTerm = rt;
        this.update();
    }
    get isReplacing() {
        return this._replaceTerm !== '' && this._showReplaceButtons;
    }
    get onChange() {
        return this.changeEmitter.event;
    }
    get onFocusInput() {
        return this.focusInputEmitter.event;
    }
    collapseAll() {
        for (const rootFolderNode of this.resultTree.values()) {
            for (const fileNode of rootFolderNode.children) {
                this.expansionService.collapseNode(fileNode);
            }
            if (rootFolderNode.visible) {
                this.expansionService.collapseNode(rootFolderNode);
            }
        }
    }
    expandAll() {
        for (const rootFolderNode of this.resultTree.values()) {
            for (const fileNode of rootFolderNode.children) {
                this.expansionService.expandNode(fileNode);
            }
            if (rootFolderNode.visible) {
                this.expansionService.expandNode(rootFolderNode);
            }
        }
    }
    areResultsCollapsed() {
        for (const rootFolderNode of this.resultTree.values()) {
            for (const fileNode of rootFolderNode.children) {
                if (!browser_1.ExpandableTreeNode.isCollapsed(fileNode)) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Find matches for the given editor.
     * @param searchTerm the search term.
     * @param widget the editor widget.
     * @param searchOptions the search options to apply.
     *
     * @returns the list of matches.
     */
    findMatches(searchTerm, widget, searchOptions) {
        if (!widget.editor.document.findMatches) {
            return [];
        }
        const results = widget.editor.document.findMatches({
            searchString: searchTerm,
            isRegex: !!searchOptions.useRegExp,
            matchCase: !!searchOptions.matchCase,
            matchWholeWord: !!searchOptions.matchWholeWord,
            limitResultCount: searchOptions.maxResults
        });
        const matches = [];
        results.forEach(r => {
            const lineText = widget.editor.document.getLineContent(r.range.start.line);
            matches.push({
                line: r.range.start.line,
                character: r.range.start.character,
                length: r.range.end.character - r.range.start.character,
                lineText
            });
        });
        return matches;
    }
    /**
     * Convert a pattern to match all directories.
     * @param workspaceRootUri the uri of the current workspace root.
     * @param pattern the pattern to be converted.
     */
    convertPatternToGlob(workspaceRootUri, pattern) {
        if (pattern.startsWith('**/')) {
            return pattern;
        }
        if (pattern.startsWith('./')) {
            if (workspaceRootUri === undefined) {
                return pattern;
            }
            return workspaceRootUri.toString() + pattern.replace('./', '/');
        }
        return pattern.startsWith('/')
            ? '**' + pattern
            : '**/' + pattern;
    }
    /**
     * Determine if the URI matches any of the patterns.
     * @param uri the editor URI.
     * @param patterns the glob patterns to verify.
     */
    inPatternList(uri, patterns) {
        const opts = { dot: true, matchBase: true };
        return patterns.some(pattern => minimatch(uri.toString(), this.convertPatternToGlob(this.workspaceService.getWorkspaceRootUri(uri), pattern), opts));
    }
    /**
     * Determine if the given editor satisfies the filtering criteria.
     * An editor should be searched only if:
     * - it is not excluded through the `excludes` list.
     * - it is not explicitly present in a non-empty `includes` list.
     */
    shouldApplySearch(editorWidget, searchOptions) {
        const excludePatterns = this.getExcludeGlobs(searchOptions.exclude);
        if (this.inPatternList(editorWidget.editor.uri, excludePatterns)) {
            return false;
        }
        const includePatterns = searchOptions.include;
        if (!!(includePatterns === null || includePatterns === void 0 ? void 0 : includePatterns.length) && !this.inPatternList(editorWidget.editor.uri, includePatterns)) {
            return false;
        }
        return true;
    }
    /**
     * Search the active editor only and update the tree with those results.
     */
    searchActiveEditor(activeEditor, searchTerm, searchOptions) {
        const includesExternalResults = () => !!this.resultTree.get(this.defaultRootName);
        // Check if outside workspace results are present before searching.
        const hasExternalResultsBefore = includesExternalResults();
        // Collect search results for the given editor.
        const results = this.searchInEditor(activeEditor, searchTerm, searchOptions);
        // Update the tree by removing the result node, and add new results if applicable.
        this.getFileNodesByUri(activeEditor.editor.uri).forEach(fileNode => this.removeFileNode(fileNode));
        if (results) {
            this.appendToResultTree(results);
        }
        // Check if outside workspace results are present after searching.
        const hasExternalResultsAfter = includesExternalResults();
        // Redo a search to update the tree node visibility if:
        // + `Other files` node was present, now it is not.
        // + `Other files` node was not present, now it is.
        if (hasExternalResultsBefore ? !hasExternalResultsAfter : hasExternalResultsAfter) {
            this.search(this.searchTerm, this.searchOptions);
            return;
        }
        this.handleSearchCompleted();
    }
    /**
     * Perform a search in all open editors.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     *
     * @returns the tuple of result count, and the list of search results.
     */
    searchInOpenEditors(searchTerm, searchOptions) {
        // Track the number of results found.
        let numberOfResults = 0;
        const searchResults = [];
        this.editorManager.all.forEach(e => {
            const editorResults = this.searchInEditor(e, searchTerm, searchOptions);
            if (editorResults) {
                numberOfResults += editorResults.matches.length;
                searchResults.push(editorResults);
            }
        });
        return {
            numberOfResults,
            matches: searchResults
        };
    }
    /**
     * Perform a search in the target editor.
     * @param editorWidget the editor widget.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     *
     * @returns the search results from the given editor, undefined if the editor is either filtered or has no matches found.
     */
    searchInEditor(editorWidget, searchTerm, searchOptions) {
        var _a;
        if (!this.shouldApplySearch(editorWidget, searchOptions)) {
            return undefined;
        }
        const matches = this.findMatches(searchTerm, editorWidget, searchOptions);
        if (matches.length <= 0) {
            return undefined;
        }
        const fileUri = editorWidget.editor.uri.toString();
        const root = (_a = this.workspaceService.getWorkspaceRootUri(editorWidget.editor.uri)) === null || _a === void 0 ? void 0 : _a.toString();
        return {
            root: root !== null && root !== void 0 ? root : this.defaultRootName,
            fileUri,
            matches
        };
    }
    /**
     * Append search results to the result tree.
     * @param result Search result.
     */
    appendToResultTree(result) {
        const collapseValue = this.searchInWorkspacePreferences['search.collapseResults'];
        let path;
        if (result.root === this.defaultRootName) {
            path = new uri_1.default(result.fileUri).path.dir.fsPath();
        }
        else {
            path = this.filenameAndPath(result.root, result.fileUri).path;
        }
        const tree = this.resultTree;
        let rootFolderNode = tree.get(result.root);
        if (!rootFolderNode) {
            rootFolderNode = this.createRootFolderNode(result.root);
            tree.set(result.root, rootFolderNode);
        }
        let fileNode = rootFolderNode.children.find(f => f.fileUri === result.fileUri);
        if (!fileNode) {
            fileNode = this.createFileNode(result.root, path, result.fileUri, rootFolderNode);
            rootFolderNode.children.push(fileNode);
        }
        for (const match of result.matches) {
            const line = this.createResultLineNode(result, match, fileNode);
            if (fileNode.children.findIndex(lineNode => lineNode.id === line.id) < 0) {
                fileNode.children.push(line);
            }
        }
        this.collapseFileNode(fileNode, collapseValue);
    }
    /**
     * Handle when searching completed.
     */
    handleSearchCompleted(cancelIndicator) {
        if (cancelIndicator) {
            cancelIndicator.cancel();
        }
        this.sortResultTree();
        this.refreshModelChildren();
    }
    /**
     * Sort the result tree by URIs.
     */
    sortResultTree() {
        // Sort the result map by folder URI.
        const entries = [...this.resultTree.entries()];
        entries.sort(([, a], [, b]) => this.compare(a.folderUri, b.folderUri));
        this.resultTree = new Map(entries);
        // Update the list of children nodes, sorting them by their file URI.
        entries.forEach(([, folder]) => {
            folder.children.sort((a, b) => this.compare(a.fileUri, b.fileUri));
        });
    }
    /**
     * Search and populate the result tree with matches.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     */
    async search(searchTerm, searchOptions) {
        this.searchTerm = searchTerm;
        this.searchOptions = searchOptions;
        searchOptions = {
            ...searchOptions,
            exclude: this.getExcludeGlobs(searchOptions.exclude)
        };
        this.resultTree.clear();
        this.forceVisibleRootNode = false;
        if (this.cancelIndicator) {
            this.cancelIndicator.cancel();
        }
        if (searchTerm === '') {
            this.refreshModelChildren();
            return;
        }
        this.cancelIndicator = new core_1.CancellationTokenSource();
        const cancelIndicator = this.cancelIndicator;
        const token = this.cancelIndicator.token;
        const progress = await this.progressService.showProgress({ text: `search: ${searchTerm}`, options: { location: 'search' } });
        token.onCancellationRequested(() => {
            progress.cancel();
            if (searchId) {
                this.searchService.cancel(searchId);
            }
            this.cancelIndicator = undefined;
            this.changeEmitter.fire(this.resultTree);
        });
        // Collect search results for opened editors which otherwise may not be found by ripgrep (ex: dirty editors).
        const { numberOfResults, matches } = this.searchInOpenEditors(searchTerm, searchOptions);
        // The root node is visible if outside workspace results are found and workspace root(s) are present.
        this.forceVisibleRootNode = matches.some(m => m.root === this.defaultRootName) && this.workspaceService.opened;
        matches.forEach(m => this.appendToResultTree(m));
        // Exclude files already covered by searching open editors.
        this.editorManager.all.forEach(e => {
            const excludePath = e.editor.uri.path.toString();
            searchOptions.exclude = searchOptions.exclude ? searchOptions.exclude.concat(excludePath) : [excludePath];
        });
        // Reduce `maxResults` due to editor results.
        if (searchOptions.maxResults) {
            searchOptions.maxResults -= numberOfResults;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let pendingRefreshTimeout;
        const searchId = await this.searchService.search(searchTerm, {
            onResult: (aSearchId, result) => {
                if (token.isCancellationRequested || aSearchId !== searchId) {
                    return;
                }
                this.appendToResultTree(result);
                if (pendingRefreshTimeout) {
                    clearTimeout(pendingRefreshTimeout);
                }
                pendingRefreshTimeout = setTimeout(() => this.refreshModelChildren(), 100);
            },
            onDone: () => {
                this.handleSearchCompleted(cancelIndicator);
            }
        }, searchOptions).catch(() => {
            this.handleSearchCompleted(cancelIndicator);
        });
    }
    focusFirstResult() {
        if (SearchInWorkspaceRoot.is(this.model.root) && this.model.root.children.length > 0) {
            const node = this.model.root.children[0];
            if (browser_1.SelectableTreeNode.is(node)) {
                this.node.focus();
                this.model.selectNode(node);
            }
        }
    }
    /**
     * Collapse the search-in-workspace file node
     * based on the preference value.
     */
    collapseFileNode(node, preferenceValue) {
        if (preferenceValue === 'auto' && node.children.length >= 10) {
            node.expanded = false;
        }
        else if (preferenceValue === 'alwaysCollapse') {
            node.expanded = false;
        }
        else if (preferenceValue === 'alwaysExpand') {
            node.expanded = true;
        }
    }
    handleUp(event) {
        if (!this.model.getPrevSelectableNode(this.model.getFocusedNode())) {
            this.focusInputEmitter.fire(true);
        }
        else {
            super.handleUp(event);
        }
    }
    async refreshModelChildren() {
        if (SearchInWorkspaceRoot.is(this.model.root)) {
            this.model.root.children = Array.from(this.resultTree.values());
            this.model.refresh();
            this.updateCurrentEditorDecorations();
        }
    }
    updateCurrentEditorDecorations() {
        this.shell.allTabBars.forEach(tb => {
            const currentTitle = tb.currentTitle;
            if (currentTitle && currentTitle.owner instanceof browser_2.EditorWidget) {
                const widget = currentTitle.owner;
                const fileNodes = this.getFileNodesByUri(widget.editor.uri);
                if (fileNodes.length > 0) {
                    fileNodes.forEach(node => {
                        this.decorateEditor(node, widget);
                    });
                }
                else {
                    this.decorateEditor(undefined, widget);
                }
            }
        });
        const currentWidget = this.editorManager.currentEditor;
        if (currentWidget) {
            const fileNodes = this.getFileNodesByUri(currentWidget.editor.uri);
            fileNodes.forEach(node => {
                this.decorateEditor(node, currentWidget);
            });
        }
    }
    createRootFolderNode(rootUri) {
        const uri = new uri_1.default(rootUri);
        return {
            selected: false,
            path: uri.path.fsPath(),
            folderUri: rootUri,
            uri: new uri_1.default(rootUri),
            children: [],
            expanded: true,
            id: rootUri,
            parent: this.model.root,
            visible: this.forceVisibleRootNode || this.workspaceService.isMultiRootWorkspaceOpened
        };
    }
    createFileNode(rootUri, path, fileUri, parent) {
        return {
            selected: false,
            path,
            children: [],
            expanded: true,
            id: `${rootUri}::${fileUri}`,
            parent,
            fileUri,
            uri: new uri_1.default(fileUri),
        };
    }
    createResultLineNode(result, match, fileNode) {
        return {
            ...result,
            ...match,
            selected: false,
            id: result.fileUri + '-' + match.line + '-' + match.character + '-' + match.length,
            name: typeof match.lineText === 'string' ? match.lineText : match.lineText.text,
            parent: fileNode
        };
    }
    getFileNodesByUri(uri) {
        const nodes = [];
        const fileUri = uri.withScheme('file').toString();
        for (const rootFolderNode of this.resultTree.values()) {
            const rootUri = new uri_1.default(rootFolderNode.path).withScheme('file');
            if (rootUri.isEqualOrParent(uri) || rootFolderNode.id === this.defaultRootName) {
                for (const fileNode of rootFolderNode.children) {
                    if (fileNode.fileUri === fileUri) {
                        nodes.push(fileNode);
                    }
                }
            }
        }
        return nodes;
    }
    filenameAndPath(rootUriStr, uriStr) {
        const uri = new uri_1.default(uriStr);
        const relativePath = new uri_1.default(rootUriStr).relative(uri.parent);
        return {
            name: this.labelProvider.getName(uri),
            path: relativePath ? relativePath.fsPath() : ''
        };
    }
    getDepthPadding(depth) {
        return super.getDepthPadding(depth) + 5;
    }
    renderCaption(node, props) {
        if (SearchInWorkspaceRootFolderNode.is(node)) {
            return this.renderRootFolderNode(node);
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            return this.renderFileNode(node);
        }
        else if (SearchInWorkspaceResultLineNode.is(node)) {
            return this.renderResultLineNode(node);
        }
        return '';
    }
    renderTailDecorations(node, props) {
        return React.createElement("div", { className: 'result-node-buttons' },
            this._showReplaceButtons && this.renderReplaceButton(node),
            this.renderRemoveButton(node));
    }
    doReplace(node, e) {
        const selection = browser_1.SelectableTreeNode.isSelected(node) ? this.selectionService.selection : [node];
        selection.forEach(n => this.replace(n));
        e.stopPropagation();
    }
    renderReplaceButton(node) {
        const isResultLineNode = SearchInWorkspaceResultLineNode.is(node);
        return React.createElement("span", { className: isResultLineNode ? (0, browser_1.codicon)('replace') : (0, browser_1.codicon)('replace-all'), onClick: e => this.doReplace(node, e), title: isResultLineNode
                ? nls_1.nls.localizeByDefault('Replace')
                : nls_1.nls.localizeByDefault('Replace All') });
    }
    getFileCount(node) {
        if (SearchInWorkspaceRoot.is(node)) {
            return node.children.reduce((acc, current) => acc + this.getFileCount(current), 0);
        }
        else if (SearchInWorkspaceRootFolderNode.is(node)) {
            return node.children.length;
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            return 1;
        }
        return 0;
    }
    getResultCount(node) {
        if (SearchInWorkspaceRoot.is(node)) {
            return node.children.reduce((acc, current) => acc + this.getResultCount(current), 0);
        }
        else if (SearchInWorkspaceRootFolderNode.is(node)) {
            return node.children.reduce((acc, current) => acc + this.getResultCount(current), 0);
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            return node.children.length;
        }
        else if (SearchInWorkspaceResultLineNode.is(node)) {
            return 1;
        }
        return 0;
    }
    /**
     * Replace results under the node passed into the function. If node is undefined, replace all results.
     * @param node Node in the tree widget where the "replace all" operation is performed
     */
    async replace(node) {
        const replaceForNode = node || this.model.root;
        const needConfirm = !SearchInWorkspaceFileNode.is(node) && !SearchInWorkspaceResultLineNode.is(node);
        const replacementText = this._replaceTerm;
        if (!needConfirm || await this.confirmReplaceAll(this.getResultCount(replaceForNode), this.getFileCount(replaceForNode), replacementText)) {
            (node ? [node] : Array.from(this.resultTree.values())).forEach(n => {
                this.replaceResult(n, !!node, replacementText);
                this.removeNode(n);
            });
        }
    }
    confirmReplaceAll(resultNumber, fileNumber, replacementText) {
        return new browser_1.ConfirmDialog({
            title: nls_1.nls.localizeByDefault('Replace All'),
            msg: this.buildReplaceAllConfirmationMessage(resultNumber, fileNumber, replacementText)
        }).open();
    }
    buildReplaceAllConfirmationMessage(occurrences, fileCount, replaceValue) {
        if (occurrences === 1) {
            if (fileCount === 1) {
                if (replaceValue) {
                    return nls_1.nls.localizeByDefault("Replace {0} occurrence across {1} file with '{2}'?", occurrences, fileCount, replaceValue);
                }
                return nls_1.nls.localizeByDefault('Replace {0} occurrence across {1} file?', occurrences, fileCount);
            }
            if (replaceValue) {
                return nls_1.nls.localizeByDefault("Replace {0} occurrence across {1} files with '{2}'?", occurrences, fileCount, replaceValue);
            }
            return nls_1.nls.localizeByDefault('Replace {0} occurrence across {1} files?', occurrences, fileCount);
        }
        if (fileCount === 1) {
            if (replaceValue) {
                return nls_1.nls.localizeByDefault("Replace {0} occurrences across {1} file with '{2}'?", occurrences, fileCount, replaceValue);
            }
            return nls_1.nls.localizeByDefault('Replace {0} occurrences across {1} file?', occurrences, fileCount);
        }
        if (replaceValue) {
            return nls_1.nls.localizeByDefault("Replace {0} occurrences across {1} files with '{2}'?", occurrences, fileCount, replaceValue);
        }
        return nls_1.nls.localizeByDefault('Replace {0} occurrences across {1} files?', occurrences, fileCount);
    }
    updateRightResults(node) {
        const fileNode = node.parent;
        const rightPositionedNodes = fileNode.children.filter(rl => rl.line === node.line && rl.character > node.character);
        const diff = this._replaceTerm.length - this.searchTerm.length;
        rightPositionedNodes.forEach(r => r.character += diff);
    }
    /**
     * Replace text either in all search matches under a node or in all search matches, and save the changes.
     * @param node - node in the tree widget in which the "replace all" is performed.
     * @param {boolean} replaceOne - whether the function is to replace all matches under a node. If it is false, replace all.
     * @param replacementText - text to be used for all replacements in the current replacement cycle.
     */
    async replaceResult(node, replaceOne, replacementText) {
        const toReplace = [];
        if (SearchInWorkspaceRootFolderNode.is(node)) {
            node.children.forEach(fileNode => this.replaceResult(fileNode, replaceOne, replacementText));
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            toReplace.push(...node.children);
        }
        else if (SearchInWorkspaceResultLineNode.is(node)) {
            toReplace.push(node);
            this.updateRightResults(node);
        }
        if (toReplace.length > 0) {
            // Store the state of all tracked editors before another editor widget might be created for text replacing.
            const trackedEditors = this.editorManager.all;
            // Open the file only if the function is called to replace all matches under a specific node.
            const widget = replaceOne ? await this.doOpen(toReplace[0]) : await this.doGetWidget(toReplace[0]);
            const source = widget.editor.document.getText();
            const replaceOperations = toReplace.map(resultLineNode => ({
                text: replacementText,
                range: {
                    start: {
                        line: resultLineNode.line - 1,
                        character: resultLineNode.character - 1
                    },
                    end: {
                        line: resultLineNode.line - 1,
                        character: resultLineNode.character - 1 + resultLineNode.length
                    }
                }
            }));
            // Replace the text.
            await widget.editor.replaceText({
                source,
                replaceOperations
            });
            // Save the text replacement changes in the editor.
            await widget.saveable.save();
            // Dispose the widget if it is not opened but created for `replaceAll`.
            if (!replaceOne) {
                if (trackedEditors.indexOf(widget) === -1) {
                    widget.dispose();
                }
            }
        }
    }
    doRemove(node, e) {
        const selection = browser_1.SelectableTreeNode.isSelected(node) ? this.selectionService.selection : [node];
        selection.forEach(n => this.removeNode(n));
        e.stopPropagation();
    }
    renderRemoveButton(node) {
        return React.createElement("span", { className: (0, browser_1.codicon)('close'), onClick: e => this.remove(node, e), title: 'Dismiss' });
    }
    removeNode(node) {
        if (SearchInWorkspaceRootFolderNode.is(node)) {
            this.removeRootFolderNode(node);
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            this.removeFileNode(node);
        }
        else if (SearchInWorkspaceResultLineNode.is(node)) {
            this.removeResultLineNode(node);
        }
        this.refreshModelChildren();
    }
    removeRootFolderNode(node) {
        for (const rootUri of this.resultTree.keys()) {
            if (rootUri === node.folderUri) {
                this.resultTree.delete(rootUri);
                break;
            }
        }
    }
    removeFileNode(node) {
        const rootFolderNode = node.parent;
        const index = rootFolderNode.children.findIndex(fileNode => fileNode.id === node.id);
        if (index > -1) {
            rootFolderNode.children.splice(index, 1);
        }
        if (this.getFileCount(rootFolderNode) === 0) {
            this.removeRootFolderNode(rootFolderNode);
        }
    }
    removeResultLineNode(node) {
        const fileNode = node.parent;
        const index = fileNode.children.findIndex(n => n.fileUri === node.fileUri && n.line === node.line && n.character === node.character);
        if (index > -1) {
            fileNode.children.splice(index, 1);
            if (this.getResultCount(fileNode) === 0) {
                this.removeFileNode(fileNode);
            }
        }
    }
    renderRootFolderNode(node) {
        return React.createElement("div", { className: 'result' },
            React.createElement("div", { className: 'result-head' },
                React.createElement("div", { className: `result-head-info noWrapInfo noselect ${node.selected ? 'selected' : ''}` },
                    React.createElement("span", { className: `file-icon ${this.toNodeIcon(node) || ''}` }),
                    React.createElement("div", { className: 'noWrapInfo' },
                        React.createElement("span", { className: 'file-name' }, this.toNodeName(node)),
                        node.path !== '/' + this.defaultRootName &&
                            React.createElement("span", { className: 'file-path ' + browser_1.TREE_NODE_INFO_CLASS }, node.path))),
                React.createElement("span", { className: 'notification-count-container highlighted-count-container' },
                    React.createElement("span", { className: 'notification-count' }, this.getFileCount(node)))));
    }
    renderFileNode(node) {
        return React.createElement("div", { className: 'result' },
            React.createElement("div", { className: 'result-head' },
                React.createElement("div", { className: `result-head-info noWrapInfo noselect ${node.selected ? 'selected' : ''}`, title: new uri_1.default(node.fileUri).path.fsPath() },
                    React.createElement("span", { className: `file-icon ${this.toNodeIcon(node)}` }),
                    React.createElement("div", { className: 'noWrapInfo' },
                        React.createElement("span", { className: 'file-name' }, this.toNodeName(node)),
                        React.createElement("span", { className: 'file-path ' + browser_1.TREE_NODE_INFO_CLASS }, node.path))),
                React.createElement("span", { className: 'notification-count-container' },
                    React.createElement("span", { className: 'notification-count' }, this.getResultCount(node)))));
    }
    renderResultLineNode(node) {
        const character = typeof node.lineText === 'string' ? node.character : node.lineText.character;
        const lineText = typeof node.lineText === 'string' ? node.lineText : node.lineText.text;
        let start = Math.max(0, character - 26);
        const wordBreak = /\b/g;
        while (start > 0 && wordBreak.test(lineText) && wordBreak.lastIndex < character) {
            if (character - wordBreak.lastIndex < 26) {
                break;
            }
            start = wordBreak.lastIndex;
            wordBreak.lastIndex++;
        }
        const before = lineText.slice(start, character - 1).trimLeft();
        return React.createElement("div", { className: `resultLine noWrapInfo noselect ${node.selected ? 'selected' : ''}`, title: lineText.trim() },
            this.searchInWorkspacePreferences['search.lineNumbers'] && React.createElement("span", { className: 'theia-siw-lineNumber' }, node.line),
            React.createElement("span", null, before),
            this.renderMatchLinePart(node),
            React.createElement("span", null, lineText.slice(node.character + node.length - 1, 250 - before.length + node.length)));
    }
    renderMatchLinePart(node) {
        const replaceTerm = this.isReplacing ? React.createElement("span", { className: 'replace-term' }, this._replaceTerm) : '';
        const className = `match${this.isReplacing ? ' strike-through' : ''}`;
        const match = typeof node.lineText === 'string' ?
            node.lineText.substring(node.character - 1, node.length + node.character - 1)
            : node.lineText.text.substring(node.lineText.character - 1, node.length + node.lineText.character - 1);
        return React.createElement(React.Fragment, null,
            React.createElement("span", { className: className }, match),
            replaceTerm);
    }
    /**
     * Get the editor widget by the node.
     * @param {SearchInWorkspaceResultLineNode} node - the node representing a match in the search results.
     * @returns The editor widget to which the text replace will be done.
     */
    async doGetWidget(node) {
        const fileUri = new uri_1.default(node.fileUri);
        const editorWidget = await this.editorManager.getOrCreateByUri(fileUri);
        return editorWidget;
    }
    async doOpen(node, asDiffWidget = false, preview = false) {
        let fileUri;
        const resultNode = node.parent;
        if (resultNode && this.isReplacing && asDiffWidget) {
            const leftUri = new uri_1.default(node.fileUri);
            const rightUri = await this.createReplacePreview(resultNode);
            fileUri = browser_1.DiffUris.encode(leftUri, rightUri);
        }
        else {
            fileUri = new uri_1.default(node.fileUri);
        }
        const opts = {
            selection: {
                start: {
                    line: node.line - 1,
                    character: node.character - 1
                },
                end: {
                    line: node.line - 1,
                    character: node.character - 1 + node.length
                }
            },
            mode: preview ? 'reveal' : 'activate',
            preview,
        };
        const editorWidget = await this.editorManager.open(fileUri, opts);
        if (!browser_1.DiffUris.isDiffUri(fileUri)) {
            this.decorateEditor(resultNode, editorWidget);
        }
        return editorWidget;
    }
    async createReplacePreview(node) {
        const fileUri = new uri_1.default(node.fileUri).withScheme('file');
        const openedEditor = this.editorManager.all.find(({ editor }) => editor.uri.toString() === fileUri.toString());
        let content;
        if (openedEditor) {
            content = openedEditor.editor.document.getText();
        }
        else {
            const resource = await this.fileResourceResolver.resolve(fileUri);
            content = await resource.readContents();
        }
        const lines = content.split('\n');
        node.children.forEach(l => {
            const leftPositionedNodes = node.children.filter(rl => rl.line === l.line && rl.character < l.character);
            const diff = (this._replaceTerm.length - this.searchTerm.length) * leftPositionedNodes.length;
            const start = lines[l.line - 1].substring(0, l.character - 1 + diff);
            const end = lines[l.line - 1].substring(l.character - 1 + diff + l.length);
            lines[l.line - 1] = start + this._replaceTerm + end;
        });
        return fileUri.withScheme(common_1.MEMORY_TEXT).withQuery(lines.join('\n'));
    }
    decorateEditor(node, editorWidget) {
        if (!browser_1.DiffUris.isDiffUri(editorWidget.editor.uri)) {
            const key = `${editorWidget.editor.uri.toString()}#search-in-workspace-matches`;
            const oldDecorations = this.appliedDecorations.get(key) || [];
            const newDecorations = this.createEditorDecorations(node);
            const appliedDecorations = editorWidget.editor.deltaDecorations({
                newDecorations,
                oldDecorations,
            });
            this.appliedDecorations.set(key, appliedDecorations);
        }
    }
    createEditorDecorations(resultNode) {
        const decorations = [];
        if (resultNode) {
            resultNode.children.forEach(res => {
                decorations.push({
                    range: {
                        start: {
                            line: res.line - 1,
                            character: res.character - 1
                        },
                        end: {
                            line: res.line - 1,
                            character: res.character - 1 + res.length
                        }
                    },
                    options: {
                        overviewRuler: {
                            color: {
                                id: 'editor.findMatchHighlightBackground'
                            },
                            position: browser_2.OverviewRulerLane.Center
                        },
                        className: res.selected ? 'current-search-in-workspace-editor-match' : 'search-in-workspace-editor-match',
                        stickiness: browser_2.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
                    }
                });
            });
        }
        return decorations;
    }
    /**
     * Get the list of exclude globs.
     * @param excludeOptions the exclude search option.
     *
     * @returns the list of exclude globs.
     */
    getExcludeGlobs(excludeOptions) {
        const excludePreferences = this.filesystemPreferences['files.exclude'];
        const excludePreferencesGlobs = Object.keys(excludePreferences).filter(key => !!excludePreferences[key]);
        return [...new Set([...excludePreferencesGlobs, ...excludeOptions || []])];
    }
    /**
     * Compare two normalized strings.
     *
     * @param a {string} the first string.
     * @param b {string} the second string.
     */
    compare(a, b) {
        const itemA = a.toLowerCase().trim();
        const itemB = b.toLowerCase().trim();
        return itemA.localeCompare(itemB);
    }
    /**
     * @param recursive if true, all child nodes will be included in the stringified result.
     */
    nodeToString(node, recursive) {
        if (SearchInWorkspaceFileNode.is(node) || SearchInWorkspaceRootFolderNode.is(node)) {
            if (recursive) {
                return this.nodeIteratorToString(new browser_1.TopDownTreeIterator(node, { pruneSiblings: true }));
            }
            return this.labelProvider.getLongName(node.uri);
        }
        if (SearchInWorkspaceResultLineNode.is(node)) {
            return `  ${node.line}:${node.character}: ${node.lineText}`;
        }
        return '';
    }
    treeToString() {
        return this.nodeIteratorToString(this.getVisibleNodes());
    }
    *getVisibleNodes() {
        for (const { node } of this.rows.values()) {
            yield node;
        }
    }
    nodeIteratorToString(nodes) {
        const strings = [];
        for (const node of nodes) {
            const string = this.nodeToString(node, false);
            if (string.length !== 0) {
                strings.push(string);
            }
        }
        return strings.join(core_1.EOL);
    }
};
__decorate([
    (0, inversify_1.inject)(search_in_workspace_service_1.SearchInWorkspaceService),
    __metadata("design:type", search_in_workspace_service_1.SearchInWorkspaceService)
], SearchInWorkspaceResultTreeWidget.prototype, "searchService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], SearchInWorkspaceResultTreeWidget.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_4.FileResourceResolver),
    __metadata("design:type", browser_4.FileResourceResolver)
], SearchInWorkspaceResultTreeWidget.prototype, "fileResourceResolver", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], SearchInWorkspaceResultTreeWidget.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], SearchInWorkspaceResultTreeWidget.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.TreeExpansionService),
    __metadata("design:type", Object)
], SearchInWorkspaceResultTreeWidget.prototype, "expansionService", void 0);
__decorate([
    (0, inversify_1.inject)(search_in_workspace_preferences_1.SearchInWorkspacePreferences),
    __metadata("design:type", Object)
], SearchInWorkspaceResultTreeWidget.prototype, "searchInWorkspacePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ProgressService),
    __metadata("design:type", core_1.ProgressService)
], SearchInWorkspaceResultTreeWidget.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], SearchInWorkspaceResultTreeWidget.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_4.FileSystemPreferences),
    __metadata("design:type", Object)
], SearchInWorkspaceResultTreeWidget.prototype, "filesystemPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], SearchInWorkspaceResultTreeWidget.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchInWorkspaceResultTreeWidget.prototype, "init", null);
SearchInWorkspaceResultTreeWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(browser_1.TreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, Object, browser_1.ContextMenuRenderer])
], SearchInWorkspaceResultTreeWidget);
exports.SearchInWorkspaceResultTreeWidget = SearchInWorkspaceResultTreeWidget;
(function (SearchInWorkspaceResultTreeWidget) {
    let Menus;
    (function (Menus) {
        Menus.BASE = ['siw-tree-context-menu'];
        /** Dismiss command, or others that only affect the widget itself */
        Menus.INTERNAL = [...Menus.BASE, '1_internal'];
        /** Copy a stringified representation of content */
        Menus.COPY = [...Menus.BASE, '2_copy'];
        /** Commands that lead out of the widget, like revealing a file in the navigator */
        Menus.EXTERNAL = [...Menus.BASE, '3_external'];
    })(Menus = SearchInWorkspaceResultTreeWidget.Menus || (SearchInWorkspaceResultTreeWidget.Menus = {}));
})(SearchInWorkspaceResultTreeWidget = exports.SearchInWorkspaceResultTreeWidget || (exports.SearchInWorkspaceResultTreeWidget = {}));
exports.SearchInWorkspaceResultTreeWidget = SearchInWorkspaceResultTreeWidget;
//# sourceMappingURL=search-in-workspace-result-tree-widget.js.map