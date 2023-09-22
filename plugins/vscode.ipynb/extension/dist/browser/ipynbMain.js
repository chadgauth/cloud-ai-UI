/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNotebookMetadata = exports.NotebookSerializer = void 0;
const detectIndent = __webpack_require__(3);
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(4);
const deserializers_1 = __webpack_require__(5);
const serializers_1 = __webpack_require__(6);
const fnv = __webpack_require__(7);
class NotebookSerializer {
    constructor(context) {
        this.context = context;
    }
    async deserializeNotebook(content, _token) {
        let contents = '';
        try {
            contents = new TextDecoder().decode(content);
        }
        catch {
        }
        let json = contents && /\S/.test(contents) ? JSON.parse(contents) : {};
        if (json.__webview_backup) {
            const backupId = json.__webview_backup;
            const uri = this.context.globalStorageUri;
            const folder = uri.with({ path: this.context.globalStorageUri.path.replace('vscode.ipynb', 'ms-toolsai.jupyter') });
            const fileHash = fnv.fast1a32hex(backupId);
            const fileName = `${fileHash}.ipynb`;
            const file = vscode.Uri.joinPath(folder, fileName);
            const data = await vscode.workspace.fs.readFile(file);
            json = data ? JSON.parse(data.toString()) : {};
            if (json.contents && typeof json.contents === 'string') {
                contents = json.contents;
                json = JSON.parse(contents);
            }
        }
        if (json.nbformat && json.nbformat < 4) {
            throw new Error('Only Jupyter notebooks version 4+ are supported');
        }
        // Then compute indent from the contents (only use first 1K characters as a perf optimization)
        const indentAmount = contents ? detectIndent(contents.substring(0, 1000)).indent : ' ';
        const preferredCellLanguage = (0, deserializers_1.getPreferredLanguage)(json.metadata);
        // Ensure we always have a blank cell.
        if ((json.cells || []).length === 0) {
            json.cells = [
                {
                    cell_type: 'code',
                    execution_count: null,
                    metadata: {},
                    outputs: [],
                    source: ''
                }
            ];
        }
        // For notebooks without metadata default the language in metadata to the preferred language.
        if (!json.metadata || (!json.metadata.kernelspec && !json.metadata.language_info)) {
            json.metadata = json.metadata || { orig_nbformat: constants_1.defaultNotebookFormat.major };
            json.metadata.language_info = json.metadata.language_info || { name: preferredCellLanguage };
        }
        const data = (0, deserializers_1.jupyterNotebookModelToNotebookData)(json, preferredCellLanguage);
        data.metadata = data.metadata || {};
        data.metadata.indentAmount = indentAmount;
        return data;
    }
    serializeNotebook(data, _token) {
        return new TextEncoder().encode(this.serializeNotebookToString(data));
    }
    serializeNotebookToString(data) {
        const notebookContent = getNotebookMetadata(data);
        // use the preferred language from document metadata or the first cell language as the notebook preferred cell language
        const preferredCellLanguage = notebookContent.metadata?.language_info?.name ?? data.cells.find(cell => cell.kind === vscode.NotebookCellKind.Code)?.languageId;
        notebookContent.cells = data.cells
            .map(cell => (0, serializers_1.createJupyterCellFromNotebookCell)(cell, preferredCellLanguage))
            .map(serializers_1.pruneCell);
        const indentAmount = data.metadata && 'indentAmount' in data.metadata && typeof data.metadata.indentAmount === 'string' ?
            data.metadata.indentAmount :
            ' ';
        // ipynb always ends with a trailing new line (we add this so that SCMs do not show unnecessary changes, resulting from a missing trailing new line).
        return JSON.stringify((0, serializers_1.sortObjectPropertiesRecursively)(notebookContent), undefined, indentAmount) + '\n';
    }
}
exports.NotebookSerializer = NotebookSerializer;
function getNotebookMetadata(document) {
    const notebookContent = document.metadata?.custom || {};
    notebookContent.cells = notebookContent.cells || [];
    notebookContent.nbformat = notebookContent.nbformat || 4;
    notebookContent.nbformat_minor = notebookContent.nbformat_minor ?? 2;
    notebookContent.metadata = notebookContent.metadata || { orig_nbformat: 4 };
    return notebookContent;
}
exports.getNotebookMetadata = getNotebookMetadata;


/***/ }),
/* 3 */
/***/ ((module) => {

"use strict";


// Detect either spaces or tabs but not both to properly handle tabs for indentation and spaces for alignment
const INDENT_REGEX = /^(?:( )+|\t+)/;

const INDENT_TYPE_SPACE = 'space';
const INDENT_TYPE_TAB = 'tab';

// Make a Map that counts how many indents/unindents have occurred for a given size and how many lines follow a given indentation.
// The key is a concatenation of the indentation type (s = space and t = tab) and the size of the indents/unindents.
//
// indents = {
//    t3: [1, 0],
//    t4: [1, 5],
//    s5: [1, 0],
//   s12: [1, 0],
// }
function makeIndentsMap(string, ignoreSingleSpaces) {
	const indents = new Map();

	// Remember the size of previous line's indentation
	let previousSize = 0;
	let previousIndentType;

	// Indents key (ident type + size of the indents/unindents)
	let key;

	for (const line of string.split(/\n/g)) {
		if (!line) {
			// Ignore empty lines
			continue;
		}

		let indent;
		let indentType;
		let weight;
		let entry;
		const matches = line.match(INDENT_REGEX);

		if (matches === null) {
			previousSize = 0;
			previousIndentType = '';
		} else {
			indent = matches[0].length;

			if (matches[1]) {
				indentType = INDENT_TYPE_SPACE;
			} else {
				indentType = INDENT_TYPE_TAB;
			}

			// Ignore single space unless it's the only indent detected to prevent common false positives
			if (ignoreSingleSpaces && indentType === INDENT_TYPE_SPACE && indent === 1) {
				continue;
			}

			if (indentType !== previousIndentType) {
				previousSize = 0;
			}

			previousIndentType = indentType;

			weight = 0;

			const indentDifference = indent - previousSize;
			previousSize = indent;

			// Previous line have same indent?
			if (indentDifference === 0) {
				weight++;
				// We use the key from previous loop
			} else {
				const absoluteIndentDifference = indentDifference > 0 ? indentDifference : -indentDifference;
				key = encodeIndentsKey(indentType, absoluteIndentDifference);
			}

			// Update the stats
			entry = indents.get(key);

			if (entry === undefined) {
				entry = [1, 0]; // Init
			} else {
				entry = [++entry[0], entry[1] + weight];
			}

			indents.set(key, entry);
		}
	}

	return indents;
}

// Encode the indent type and amount as a string (e.g. 's4') for use as a compound key in the indents Map.
function encodeIndentsKey(indentType, indentAmount) {
	const typeCharacter = indentType === INDENT_TYPE_SPACE ? 's' : 't';
	return typeCharacter + String(indentAmount);
}

// Extract the indent type and amount from a key of the indents Map.
function decodeIndentsKey(indentsKey) {
	const keyHasTypeSpace = indentsKey[0] === 's';
	const type = keyHasTypeSpace ? INDENT_TYPE_SPACE : INDENT_TYPE_TAB;

	const amount = Number(indentsKey.slice(1));

	return {type, amount};
}

// Return the key (e.g. 's4') from the indents Map that represents the most common indent,
// or return undefined if there are no indents.
function getMostUsedKey(indents) {
	let result;
	let maxUsed = 0;
	let maxWeight = 0;

	for (const [key, [usedCount, weight]] of indents) {
		if (usedCount > maxUsed || (usedCount === maxUsed && weight > maxWeight)) {
			maxUsed = usedCount;
			maxWeight = weight;
			result = key;
		}
	}

	return result;
}

function makeIndentString(type, amount) {
	const indentCharacter = type === INDENT_TYPE_SPACE ? ' ' : '\t';
	return indentCharacter.repeat(amount);
}

module.exports = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Identify indents while skipping single space indents to avoid common edge cases (e.g. code comments)
	// If no indents are identified, run again and include all indents for comprehensive detection
	let indents = makeIndentsMap(string, true);
	if (indents.size === 0) {
		indents = makeIndentsMap(string, false);
	}

	const keyOfMostUsedIndent = getMostUsedKey(indents);

	let type;
	let amount = 0;
	let indent = '';

	if (keyOfMostUsedIndent !== undefined) {
		({type, amount} = decodeIndentsKey(keyOfMostUsedIndent));
		indent = makeIndentString(type, amount);
	}

	return {
		amount,
		type,
		indent
	};
};


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR = exports.ATTACHMENT_CLEANUP_COMMANDID = exports.defaultNotebookFormat = void 0;
exports.defaultNotebookFormat = { major: 4, minor: 2 };
exports.ATTACHMENT_CLEANUP_COMMANDID = 'ipynb.cleanInvalidImageAttachment';
exports.JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR = { notebookType: 'jupyter-notebook', language: 'markdown' };


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jupyterNotebookModelToNotebookData = exports.jupyterCellOutputToCellOutput = exports.textMimeTypes = exports.getPreferredLanguage = void 0;
const vscode_1 = __webpack_require__(1);
const jupyterLanguageToMonacoLanguageMapping = new Map([
    ['c#', 'csharp'],
    ['f#', 'fsharp'],
    ['q#', 'qsharp'],
    ['c++11', 'c++'],
    ['c++12', 'c++'],
    ['c++14', 'c++']
]);
function getPreferredLanguage(metadata) {
    const jupyterLanguage = metadata?.language_info?.name ||
        metadata?.kernelspec?.language;
    // Default to python language only if the Python extension is installed.
    const defaultLanguage = vscode_1.extensions.getExtension('ms-python.python')
        ? 'python'
        : (vscode_1.extensions.getExtension('ms-dotnettools.dotnet-interactive-vscode') ? 'csharp' : 'python');
    // Note, whatever language is returned here, when the user selects a kernel, the cells (of blank documents) get updated based on that kernel selection.
    return translateKernelLanguageToMonaco(jupyterLanguage || defaultLanguage);
}
exports.getPreferredLanguage = getPreferredLanguage;
function translateKernelLanguageToMonaco(language) {
    language = language.toLowerCase();
    if (language.length === 2 && language.endsWith('#')) {
        return `${language.substring(0, 1)}sharp`;
    }
    return jupyterLanguageToMonacoLanguageMapping.get(language) || language;
}
const orderOfMimeTypes = [
    'application/vnd.*',
    'application/vdom.*',
    'application/geo+json',
    'application/x-nteract-model-debug+json',
    'text/html',
    'application/javascript',
    'image/gif',
    'text/latex',
    'text/markdown',
    'image/png',
    'image/svg+xml',
    'image/jpeg',
    'application/json',
    'text/plain'
];
function isEmptyVendoredMimeType(outputItem) {
    if (outputItem.mime.startsWith('application/vnd.')) {
        try {
            return outputItem.data.byteLength === 0 || Buffer.from(outputItem.data).toString().length === 0;
        }
        catch { }
    }
    return false;
}
function isMimeTypeMatch(value, compareWith) {
    if (value.endsWith('.*')) {
        value = value.substr(0, value.indexOf('.*'));
    }
    return compareWith.startsWith(value);
}
function sortOutputItemsBasedOnDisplayOrder(outputItems) {
    return outputItems
        .map(item => {
        let index = orderOfMimeTypes.findIndex((mime) => isMimeTypeMatch(mime, item.mime));
        // Sometimes we can have mime types with empty data, e.g. when using holoview we can have `application/vnd.holoviews_load.v0+json` with empty value.
        // & in these cases we have HTML/JS and those take precedence.
        // https://github.com/microsoft/vscode-jupyter/issues/6109
        if (isEmptyVendoredMimeType(item)) {
            index = -1;
        }
        index = index === -1 ? 100 : index;
        return {
            item, index
        };
    })
        .sort((outputItemA, outputItemB) => outputItemA.index - outputItemB.index).map(item => item.item);
}
var CellOutputMimeTypes;
(function (CellOutputMimeTypes) {
    CellOutputMimeTypes["error"] = "application/vnd.code.notebook.error";
    CellOutputMimeTypes["stderr"] = "application/vnd.code.notebook.stderr";
    CellOutputMimeTypes["stdout"] = "application/vnd.code.notebook.stdout";
})(CellOutputMimeTypes || (CellOutputMimeTypes = {}));
exports.textMimeTypes = ['text/plain', 'text/markdown', 'text/latex', CellOutputMimeTypes.stderr, CellOutputMimeTypes.stdout];
function concatMultilineString(str, trim) {
    const nonLineFeedWhiteSpaceTrim = /(^[\t\f\v\r ]+|[\t\f\v\r ]+$)/g;
    if (Array.isArray(str)) {
        let result = '';
        for (let i = 0; i < str.length; i += 1) {
            const s = str[i];
            if (i < str.length - 1 && !s.endsWith('\n')) {
                result = result.concat(`${s}\n`);
            }
            else {
                result = result.concat(s);
            }
        }
        // Just trim whitespace. Leave \n in place
        return trim ? result.replace(nonLineFeedWhiteSpaceTrim, '') : result;
    }
    return trim ? str.toString().replace(nonLineFeedWhiteSpaceTrim, '') : str.toString();
}
function convertJupyterOutputToBuffer(mime, value) {
    if (!value) {
        return vscode_1.NotebookCellOutputItem.text('', mime);
    }
    try {
        if ((mime.startsWith('text/') || exports.textMimeTypes.includes(mime)) &&
            (Array.isArray(value) || typeof value === 'string')) {
            const stringValue = Array.isArray(value) ? concatMultilineString(value) : value;
            return vscode_1.NotebookCellOutputItem.text(stringValue, mime);
        }
        else if (mime.startsWith('image/') && typeof value === 'string' && mime !== 'image/svg+xml') {
            // Images in Jupyter are stored in base64 encoded format.
            // VS Code expects bytes when rendering images.
            if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
                return new vscode_1.NotebookCellOutputItem(Buffer.from(value, 'base64'), mime);
            }
            else {
                const data = Uint8Array.from(atob(value), c => c.charCodeAt(0));
                return new vscode_1.NotebookCellOutputItem(data, mime);
            }
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return vscode_1.NotebookCellOutputItem.text(JSON.stringify(value), mime);
        }
        else {
            // For everything else, treat the data as strings (or multi-line strings).
            value = Array.isArray(value) ? concatMultilineString(value) : value;
            return vscode_1.NotebookCellOutputItem.text(value, mime);
        }
    }
    catch (ex) {
        return vscode_1.NotebookCellOutputItem.error(ex);
    }
}
function getNotebookCellMetadata(cell) {
    const cellMetadata = {};
    // We put this only for VSC to display in diff view.
    // Else we don't use this.
    const custom = {};
    if (cell['metadata']) {
        custom['metadata'] = JSON.parse(JSON.stringify(cell['metadata']));
    }
    if ('id' in cell && typeof cell.id === 'string') {
        custom.id = cell.id;
    }
    cellMetadata.custom = custom;
    if (cell['attachments']) {
        cellMetadata.attachments = JSON.parse(JSON.stringify(cell['attachments']));
    }
    return cellMetadata;
}
function getOutputMetadata(output) {
    // Add on transient data if we have any. This should be removed by our save functions elsewhere.
    const metadata = {
        outputType: output.output_type
    };
    if (output.transient) {
        metadata.transient = output.transient;
    }
    switch (output.output_type) {
        case 'display_data':
        case 'execute_result':
        case 'update_display_data': {
            metadata.executionCount = output.execution_count;
            metadata.metadata = output.metadata ? JSON.parse(JSON.stringify(output.metadata)) : {};
            break;
        }
        default:
            break;
    }
    return metadata;
}
function translateDisplayDataOutput(output) {
    // Metadata could be as follows:
    // We'll have metadata specific to each mime type as well as generic metadata.
    /*
    IDisplayData = {
        output_type: 'display_data',
        data: {
            'image/jpg': '/////'
            'image/png': '/////'
            'text/plain': '/////'
        },
        metadata: {
            'image/png': '/////',
            'background': true,
            'xyz': '///
        }
    }
    */
    const metadata = getOutputMetadata(output);
    const items = [];
    if (output.data) {
        for (const key in output.data) {
            items.push(convertJupyterOutputToBuffer(key, output.data[key]));
        }
    }
    return new vscode_1.NotebookCellOutput(sortOutputItemsBasedOnDisplayOrder(items), metadata);
}
function translateErrorOutput(output) {
    output = output || { output_type: 'error', ename: '', evalue: '', traceback: [] };
    return new vscode_1.NotebookCellOutput([
        vscode_1.NotebookCellOutputItem.error({
            name: output?.ename || '',
            message: output?.evalue || '',
            stack: (output?.traceback || []).join('\n')
        })
    ], { ...getOutputMetadata(output), originalError: output });
}
function translateStreamOutput(output) {
    const value = concatMultilineString(output.text);
    const item = output.name === 'stderr' ? vscode_1.NotebookCellOutputItem.stderr(value) : vscode_1.NotebookCellOutputItem.stdout(value);
    return new vscode_1.NotebookCellOutput([item], getOutputMetadata(output));
}
const cellOutputMappers = new Map();
cellOutputMappers.set('display_data', translateDisplayDataOutput);
cellOutputMappers.set('execute_result', translateDisplayDataOutput);
cellOutputMappers.set('update_display_data', translateDisplayDataOutput);
cellOutputMappers.set('error', translateErrorOutput);
cellOutputMappers.set('stream', translateStreamOutput);
function jupyterCellOutputToCellOutput(output) {
    /**
     * Stream, `application/x.notebook.stream`
     * Error, `application/x.notebook.error-traceback`
     * Rich, { mime: value }
     *
     * outputs: [
            new vscode.NotebookCellOutput([
                new vscode.NotebookCellOutputItem('application/x.notebook.stream', 2),
                new vscode.NotebookCellOutputItem('application/x.notebook.stream', 3),
            ]),
            new vscode.NotebookCellOutput([
                new vscode.NotebookCellOutputItem('text/markdown', '## header 2'),
                new vscode.NotebookCellOutputItem('image/svg+xml', [
                    "<svg baseProfile=\"full\" height=\"200\" version=\"1.1\" width=\"300\" xmlns=\"http://www.w3.org/2000/svg\">\n",
                    "  <rect fill=\"blue\" height=\"100%\" width=\"100%\"/>\n",
                    "  <circle cx=\"150\" cy=\"100\" fill=\"green\" r=\"80\"/>\n",
                    "  <text fill=\"white\" font-size=\"60\" text-anchor=\"middle\" x=\"150\" y=\"125\">SVG</text>\n",
                    "</svg>"
                    ]),
            ]),
        ]
     *
     */
    const fn = cellOutputMappers.get(output.output_type);
    let result;
    if (fn) {
        result = fn(output);
    }
    else {
        result = translateDisplayDataOutput(output);
    }
    return result;
}
exports.jupyterCellOutputToCellOutput = jupyterCellOutputToCellOutput;
function createNotebookCellDataFromRawCell(cell) {
    const cellData = new vscode_1.NotebookCellData(vscode_1.NotebookCellKind.Code, concatMultilineString(cell.source), 'raw');
    cellData.outputs = [];
    cellData.metadata = getNotebookCellMetadata(cell);
    return cellData;
}
function createNotebookCellDataFromMarkdownCell(cell) {
    const cellData = new vscode_1.NotebookCellData(vscode_1.NotebookCellKind.Markup, concatMultilineString(cell.source), 'markdown');
    cellData.outputs = [];
    cellData.metadata = getNotebookCellMetadata(cell);
    return cellData;
}
function createNotebookCellDataFromCodeCell(cell, cellLanguage) {
    const cellOutputs = Array.isArray(cell.outputs) ? cell.outputs : [];
    const outputs = cellOutputs.map(jupyterCellOutputToCellOutput);
    const hasExecutionCount = typeof cell.execution_count === 'number' && cell.execution_count > 0;
    const source = concatMultilineString(cell.source);
    const executionSummary = hasExecutionCount
        ? { executionOrder: cell.execution_count }
        : {};
    const vscodeCustomMetadata = cell.metadata['vscode'];
    const cellLanguageId = vscodeCustomMetadata && vscodeCustomMetadata.languageId && typeof vscodeCustomMetadata.languageId === 'string' ? vscodeCustomMetadata.languageId : cellLanguage;
    const cellData = new vscode_1.NotebookCellData(vscode_1.NotebookCellKind.Code, source, cellLanguageId);
    cellData.outputs = outputs;
    cellData.metadata = getNotebookCellMetadata(cell);
    cellData.executionSummary = executionSummary;
    return cellData;
}
function createNotebookCellDataFromJupyterCell(cellLanguage, cell) {
    switch (cell.cell_type) {
        case 'raw': {
            return createNotebookCellDataFromRawCell(cell);
        }
        case 'markdown': {
            return createNotebookCellDataFromMarkdownCell(cell);
        }
        case 'code': {
            return createNotebookCellDataFromCodeCell(cell, cellLanguage);
        }
    }
    return;
}
/**
 * Converts a NotebookModel into VS Code format.
 */
function jupyterNotebookModelToNotebookData(notebookContent, preferredLanguage) {
    const notebookContentWithoutCells = { ...notebookContent, cells: [] };
    if (!notebookContent.cells || notebookContent.cells.length === 0) {
        throw new Error('Notebook content is missing cells');
    }
    const cells = notebookContent.cells
        .map(cell => createNotebookCellDataFromJupyterCell(preferredLanguage, cell))
        .filter((item) => !!item);
    const notebookData = new vscode_1.NotebookData(cells);
    notebookData.metadata = { custom: notebookContentWithoutCells };
    return notebookData;
}
exports.jupyterNotebookModelToNotebookData = jupyterNotebookModelToNotebookData;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pruneCell = exports.createMarkdownCellFromNotebookCell = exports.getCellMetadata = exports.sortObjectPropertiesRecursively = exports.createJupyterCellFromNotebookCell = void 0;
const vscode_1 = __webpack_require__(1);
const deserializers_1 = __webpack_require__(5);
const textDecoder = new TextDecoder();
var CellOutputMimeTypes;
(function (CellOutputMimeTypes) {
    CellOutputMimeTypes["error"] = "application/vnd.code.notebook.error";
    CellOutputMimeTypes["stderr"] = "application/vnd.code.notebook.stderr";
    CellOutputMimeTypes["stdout"] = "application/vnd.code.notebook.stdout";
})(CellOutputMimeTypes || (CellOutputMimeTypes = {}));
function createJupyterCellFromNotebookCell(vscCell, preferredLanguage) {
    let cell;
    if (vscCell.kind === vscode_1.NotebookCellKind.Markup) {
        cell = createMarkdownCellFromNotebookCell(vscCell);
    }
    else if (vscCell.languageId === 'raw') {
        cell = createRawCellFromNotebookCell(vscCell);
    }
    else {
        cell = createCodeCellFromNotebookCell(vscCell, preferredLanguage);
    }
    return cell;
}
exports.createJupyterCellFromNotebookCell = createJupyterCellFromNotebookCell;
/**
 * Sort the JSON to minimize unnecessary SCM changes.
 * Jupyter notbeooks/labs sorts the JSON keys in alphabetical order.
 * https://github.com/microsoft/vscode-python/issues/13155
 */
function sortObjectPropertiesRecursively(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortObjectPropertiesRecursively);
    }
    if (obj !== undefined && obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0) {
        return Object.keys(obj)
            .sort()
            .reduce((sortedObj, prop) => {
            sortedObj[prop] = sortObjectPropertiesRecursively(obj[prop]);
            return sortedObj;
        }, {});
    }
    return obj;
}
exports.sortObjectPropertiesRecursively = sortObjectPropertiesRecursively;
function getCellMetadata(cell) {
    return {
        // it contains the cell id, and the cell metadata, along with other nb cell metadata
        ...(cell.metadata?.custom ?? {}),
        // promote the cell attachments to the top level
        attachments: cell.metadata?.custom?.attachments ?? cell.metadata?.attachments
    };
}
exports.getCellMetadata = getCellMetadata;
function createCodeCellFromNotebookCell(cell, preferredLanguage) {
    const cellMetadata = getCellMetadata(cell);
    let metadata = cellMetadata?.metadata || {}; // This cannot be empty.
    if (cell.languageId !== preferredLanguage) {
        metadata = {
            ...metadata,
            vscode: {
                languageId: cell.languageId
            }
        };
    }
    else {
        // cell current language is the same as the preferred cell language in the document, flush the vscode custom language id metadata
        metadata.vscode = undefined;
    }
    const codeCell = {
        cell_type: 'code',
        execution_count: cell.executionSummary?.executionOrder ?? null,
        source: splitMultilineString(cell.value.replace(/\r\n/g, '\n')),
        outputs: (cell.outputs || []).map(translateCellDisplayOutput),
        metadata: metadata
    };
    if (cellMetadata?.id) {
        codeCell.id = cellMetadata.id;
    }
    return codeCell;
}
function createRawCellFromNotebookCell(cell) {
    const cellMetadata = getCellMetadata(cell);
    const rawCell = {
        cell_type: 'raw',
        source: splitMultilineString(cell.value.replace(/\r\n/g, '\n')),
        metadata: cellMetadata?.metadata || {} // This cannot be empty.
    };
    if (cellMetadata?.attachments) {
        rawCell.attachments = cellMetadata.attachments;
    }
    if (cellMetadata?.id) {
        rawCell.id = cellMetadata.id;
    }
    return rawCell;
}
function splitMultilineString(source) {
    if (Array.isArray(source)) {
        return source;
    }
    const str = source.toString();
    if (str.length > 0) {
        // Each line should be a separate entry, but end with a \n if not last entry
        const arr = str.split('\n');
        return arr
            .map((s, i) => {
            if (i < arr.length - 1) {
                return `${s}\n`;
            }
            return s;
        })
            .filter(s => s.length > 0); // Skip last one if empty (it's the only one that could be length 0)
    }
    return [];
}
function translateCellDisplayOutput(output) {
    const customMetadata = output.metadata;
    let result;
    // Possible some other extension added some output (do best effort to translate & save in ipynb).
    // In which case metadata might not contain `outputType`.
    const outputType = customMetadata?.outputType;
    switch (outputType) {
        case 'error': {
            result = translateCellErrorOutput(output);
            break;
        }
        case 'stream': {
            result = convertStreamOutput(output);
            break;
        }
        case 'display_data': {
            result = {
                output_type: 'display_data',
                data: output.items.reduce((prev, curr) => {
                    prev[curr.mime] = convertOutputMimeToJupyterOutput(curr.mime, curr.data);
                    return prev;
                }, {}),
                metadata: customMetadata?.metadata || {} // This can never be undefined.
            };
            break;
        }
        case 'execute_result': {
            result = {
                output_type: 'execute_result',
                data: output.items.reduce((prev, curr) => {
                    prev[curr.mime] = convertOutputMimeToJupyterOutput(curr.mime, curr.data);
                    return prev;
                }, {}),
                metadata: customMetadata?.metadata || {},
                execution_count: typeof customMetadata?.executionCount === 'number' ? customMetadata?.executionCount : null // This can never be undefined, only a number or `null`.
            };
            break;
        }
        case 'update_display_data': {
            result = {
                output_type: 'update_display_data',
                data: output.items.reduce((prev, curr) => {
                    prev[curr.mime] = convertOutputMimeToJupyterOutput(curr.mime, curr.data);
                    return prev;
                }, {}),
                metadata: customMetadata?.metadata || {} // This can never be undefined.
            };
            break;
        }
        default: {
            const isError = output.items.length === 1 && output.items.every((item) => item.mime === CellOutputMimeTypes.error);
            const isStream = output.items.every((item) => item.mime === CellOutputMimeTypes.stderr || item.mime === CellOutputMimeTypes.stdout);
            if (isError) {
                return translateCellErrorOutput(output);
            }
            // In the case of .NET & other kernels, we need to ensure we save ipynb correctly.
            // Hence if we have stream output, save the output as Jupyter `stream` else `display_data`
            // Unless we already know its an unknown output type.
            const outputType = customMetadata?.outputType || (isStream ? 'stream' : 'display_data');
            let unknownOutput;
            if (outputType === 'stream') {
                // If saving as `stream` ensure the mandatory properties are set.
                unknownOutput = convertStreamOutput(output);
            }
            else if (outputType === 'display_data') {
                // If saving as `display_data` ensure the mandatory properties are set.
                const displayData = {
                    data: {},
                    metadata: {},
                    output_type: 'display_data'
                };
                unknownOutput = displayData;
            }
            else {
                unknownOutput = {
                    output_type: outputType
                };
            }
            if (customMetadata?.metadata) {
                unknownOutput.metadata = customMetadata.metadata;
            }
            if (output.items.length > 0) {
                unknownOutput.data = output.items.reduce((prev, curr) => {
                    prev[curr.mime] = convertOutputMimeToJupyterOutput(curr.mime, curr.data);
                    return prev;
                }, {});
            }
            result = unknownOutput;
            break;
        }
    }
    // Account for transient data as well
    // `transient.display_id` is used to update cell output in other cells, at least thats one use case we know of.
    if (result && customMetadata && customMetadata.transient) {
        result.transient = customMetadata.transient;
    }
    return result;
}
function translateCellErrorOutput(output) {
    // it should have at least one output item
    const firstItem = output.items[0];
    // Bug in VS Code.
    if (!firstItem.data) {
        return {
            output_type: 'error',
            ename: '',
            evalue: '',
            traceback: []
        };
    }
    const originalError = output.metadata?.originalError;
    const value = JSON.parse(textDecoder.decode(firstItem.data));
    return {
        output_type: 'error',
        ename: value.name,
        evalue: value.message,
        // VS Code needs an `Error` object which requires a `stack` property as a string.
        // Its possible the format could change when converting from `traceback` to `string` and back again to `string`
        // When .NET stores errors in output (with their .NET kernel),
        // stack is empty, hence store the message instead of stack (so that somethign gets displayed in ipynb).
        traceback: originalError?.traceback || splitMultilineString(value.stack || value.message || '')
    };
}
function getOutputStreamType(output) {
    if (output.items.length > 0) {
        return output.items[0].mime === CellOutputMimeTypes.stderr ? 'stderr' : 'stdout';
    }
    return;
}
function convertStreamOutput(output) {
    const outputs = [];
    output.items
        .filter((opit) => opit.mime === CellOutputMimeTypes.stderr || opit.mime === CellOutputMimeTypes.stdout)
        .map((opit) => textDecoder.decode(opit.data))
        .forEach(value => {
        // Ensure each line is a separate entry in an array (ending with \n).
        const lines = value.split('\n');
        // If the last item in `outputs` is not empty and the first item in `lines` is not empty, then concate them.
        // As they are part of the same line.
        if (outputs.length && lines.length && lines[0].length > 0) {
            outputs[outputs.length - 1] = `${outputs[outputs.length - 1]}${lines.shift()}`;
        }
        for (const line of lines) {
            outputs.push(line);
        }
    });
    for (let index = 0; index < (outputs.length - 1); index++) {
        outputs[index] = `${outputs[index]}\n`;
    }
    // Skip last one if empty (it's the only one that could be length 0)
    if (outputs.length && outputs[outputs.length - 1].length === 0) {
        outputs.pop();
    }
    const streamType = getOutputStreamType(output) || 'stdout';
    return {
        output_type: 'stream',
        name: streamType,
        text: outputs
    };
}
function convertOutputMimeToJupyterOutput(mime, value) {
    if (!value) {
        return '';
    }
    try {
        if (mime === CellOutputMimeTypes.error) {
            const stringValue = textDecoder.decode(value);
            return JSON.parse(stringValue);
        }
        else if (mime.startsWith('text/') || deserializers_1.textMimeTypes.includes(mime)) {
            const stringValue = textDecoder.decode(value);
            return splitMultilineString(stringValue);
        }
        else if (mime.startsWith('image/') && mime !== 'image/svg+xml') {
            // Images in Jupyter are stored in base64 encoded format.
            // VS Code expects bytes when rendering images.
            if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
                return Buffer.from(value).toString('base64');
            }
            else {
                return btoa(value.reduce((s, b) => s + String.fromCharCode(b), ''));
            }
        }
        else if (mime.toLowerCase().includes('json')) {
            const stringValue = textDecoder.decode(value);
            return stringValue.length > 0 ? JSON.parse(stringValue) : stringValue;
        }
        else if (mime === 'image/svg+xml') {
            return splitMultilineString(textDecoder.decode(value));
        }
        else {
            return textDecoder.decode(value);
        }
    }
    catch (ex) {
        return '';
    }
}
function createMarkdownCellFromNotebookCell(cell) {
    const cellMetadata = getCellMetadata(cell);
    const markdownCell = {
        cell_type: 'markdown',
        source: splitMultilineString(cell.value.replace(/\r\n/g, '\n')),
        metadata: cellMetadata?.metadata || {} // This cannot be empty.
    };
    if (cellMetadata?.attachments) {
        markdownCell.attachments = cellMetadata.attachments;
    }
    if (cellMetadata?.id) {
        markdownCell.id = cellMetadata.id;
    }
    return markdownCell;
}
exports.createMarkdownCellFromNotebookCell = createMarkdownCellFromNotebookCell;
function pruneCell(cell) {
    // Source is usually a single string on input. Convert back to an array
    const result = {
        ...cell,
        source: splitMultilineString(cell.source)
    };
    // Remove outputs and execution_count from non code cells
    if (result.cell_type !== 'code') {
        delete result.outputs;
        delete result.execution_count;
    }
    else {
        // Clean outputs from code cells
        result.outputs = result.outputs ? result.outputs.map(fixupOutput) : [];
    }
    return result;
}
exports.pruneCell = pruneCell;
const dummyStreamObj = {
    output_type: 'stream',
    name: 'stdout',
    text: ''
};
const dummyErrorObj = {
    output_type: 'error',
    ename: '',
    evalue: '',
    traceback: ['']
};
const dummyDisplayObj = {
    output_type: 'display_data',
    data: {},
    metadata: {}
};
const dummyExecuteResultObj = {
    output_type: 'execute_result',
    name: '',
    execution_count: 0,
    data: {},
    metadata: {}
};
const AllowedCellOutputKeys = {
    ['stream']: new Set(Object.keys(dummyStreamObj)),
    ['error']: new Set(Object.keys(dummyErrorObj)),
    ['display_data']: new Set(Object.keys(dummyDisplayObj)),
    ['execute_result']: new Set(Object.keys(dummyExecuteResultObj))
};
function fixupOutput(output) {
    let allowedKeys;
    switch (output.output_type) {
        case 'stream':
        case 'error':
        case 'execute_result':
        case 'display_data':
            allowedKeys = AllowedCellOutputKeys[output.output_type];
            break;
        default:
            return output;
    }
    const result = { ...output };
    for (const k of Object.keys(output)) {
        if (!allowedKeys.has(k)) {
            delete result[k];
        }
    }
    return result;
}


/***/ }),
/* 7 */
/***/ ((module) => {

/**
 * FNV-1a Hash implementation (32, 64, 128, 256, 512, and 1024 bit)
 * @author Travis Webb <me@traviswebb.com>
 * @see http://tools.ietf.org/html/draft-eastlake-fnv-06
 */
var fnvplus = (function(){
	var i, hl = [], hl16 = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'],
		version = '1a',
		useUTF8 = false,
		_hash32, _hash52, _hash64, _hash128, _hash256, _hash512, _hash1024,
		referenceSeed = 'chongo <Landon Curt Noll> /\\../\\',
		defaultKeyspace = 52,
		fnvConstants = {
			32: {offset: 0},
			64: {offset: [0,0,0,0]},
			128: {offset: [0,0,0,0,0,0,0,0]},
			256: {offset: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
			512: {offset: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
			1024: {offset: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}};

	for(i=0; i < 256; i++){
		hl[i] = ((i >> 4) & 15).toString(16) + (i & 15).toString(16);
	}

	function hexToBase(hex, base){
		var alphabet = '0123456789abcdefghijklmnopqrstuvwxyz',
			digits = [0], carry, i, j, string = '';

		for(i = 0; i < hex.length; i+=2){
			carry = parseInt(hex.substr(i,2),16);
			for(j = 0; j < digits.length; j++){
				carry += digits[j] << 8;
				digits[j] = carry % base;
				carry = (carry / base) | 0;
			}
			while (carry > 0) {
				digits.push(carry % base);
				carry = (carry / base) | 0;
			}
		}

		for (i = digits.length - 1; i >= 0; --i){
			string += alphabet[digits[i]];
		}

		return string;
	}

	function hashValHex(value, keyspace) {
		return {
			bits: keyspace,
			value: value,
			dec: function(){return hexToBase(value, 10);},
			hex: function(){return value;},
			str: function(){return hexToBase(value, 36);}
		};
	}

	function hashValInt32(value, keyspace) {
		return {
			bits: keyspace,
			value: value,
			dec: function(){return value.toString();},
			hex: function(){return hl[value>>>24]+ hl[(value>>>16)&255]+hl[(value>>>8)&255]+hl[value&255];},
			str: function(){return value.toString(36);}
		};
	}

	function hashValInt52(value, keyspace) {
		return {
			bits: keyspace,
			value: value,
			dec: function(){return value.toString();},
			hex: function(){return ('0000000000000000'+value.toString(16)).substr(-13);},
			str: function(){return value.toString(36);}
		};
	}

	function hash(message, keyspace) {
		var str = (typeof message === 'object') ? JSON.stringify(message) : message;

		switch(keyspace || defaultKeyspace){
			case 32:
				return _hash32(str);
			case 64:
				return _hash64(str);
			case 128:
				return _hash128(str);
			case 256:
				return _hash256(str);
			case 512:
				return _hash512(str);
			case 1024:
				return _hash1024(str);
			default:
				return _hash52(str);
		}
	}

	function setKeyspace(keyspace) {
		if (keyspace === 52 || fnvConstants[keyspace]) {
			defaultKeyspace = keyspace;
		} else {
			throw new Error('Supported FNV keyspacs: 32, 52, 64, 128, 256, 512, and 1024 bit');
		}
	}

	function setVersion(_version) {
		if (_version === '1a' ) {
			version = _version;
			_hash32   = useUTF8 ? _hash32_1a_utf   : _hash32_1a;
			_hash52   = useUTF8 ? _hash52_1a_utf   : _hash52_1a;
			_hash64   = useUTF8 ? _hash64_1a_utf   : _hash64_1a;
			_hash128  = useUTF8 ? _hash128_1a_utf  : _hash128_1a;
			_hash256  = useUTF8 ? _hash256_1a_utf  : _hash256_1a;
			_hash512  = useUTF8 ? _hash512_1a_utf  : _hash512_1a;
			_hash1024 = useUTF8 ? _hash1024_1a_utf : _hash1024_1a;
		} else if (_version === '1') {
			version = _version;
			_hash32   = useUTF8 ? _hash32_1_utf   : _hash32_1;
			_hash52   = useUTF8 ? _hash52_1_utf   : _hash52_1;
			_hash64   = useUTF8 ? _hash64_1_utf   : _hash64_1;
			_hash128  = useUTF8 ? _hash128_1_utf  : _hash128_1;
			_hash256  = useUTF8 ? _hash256_1_utf  : _hash256_1;
			_hash512  = useUTF8 ? _hash512_1_utf  : _hash512_1;
			_hash1024 = useUTF8 ? _hash1024_1_utf : _hash1024_1;
		} else {
			throw new Error('Supported FNV versions: 1, 1a');
		}
	}

	function setUTF8(utf8) {
		if (utf8) {
			useUTF8 = true;
			_hash32   = version == '1a' ? _hash32_1a_utf   : _hash32_1_utf;
			_hash52   = version == '1a' ? _hash52_1a_utf   : _hash52_1_utf;
			_hash64   = version == '1a' ? _hash64_1a_utf   : _hash64_1_utf;
			_hash128  = version == '1a' ? _hash128_1a_utf  : _hash128_1_utf;
			_hash256  = version == '1a' ? _hash256_1a_utf  : _hash256_1_utf;
			_hash512  = version == '1a' ? _hash512_1a_utf  : _hash512_1_utf;
			_hash1024 = version == '1a' ? _hash1024_1a_utf : _hash1024_1_utf;
		} else {
			useUTF8 = false;
			_hash32   = version == '1a' ? _hash32_1a   : _hash32_1;
			_hash52   = version == '1a' ? _hash52_1a   : _hash52_1;
			_hash64   = version == '1a' ? _hash64_1a   : _hash64_1;
			_hash128  = version == '1a' ? _hash128_1a  : _hash128_1;
			_hash256  = version == '1a' ? _hash256_1a  : _hash256_1;
			_hash512  = version == '1a' ? _hash512_1a  : _hash512_1;
			_hash1024 = version == '1a' ? _hash1024_1a : _hash1024_1;
		}
	}

	function seed(seed) {
		var oldVersion = version, res, i;

		seed = (seed || seed === 0) ? seed : referenceSeed;

		if (seed === referenceSeed) setVersion('1');

		for (var keysize in fnvConstants) {
			fnvConstants[keysize].offset = [];
			for(i = 0; i < keysize / 16; i++){
				fnvConstants[keysize].offset[i]	= 0;
			}
			res = hash(seed, parseInt(keysize, 10)).hex();
			for(i = 0; i < keysize / 16; i++){
				fnvConstants[keysize].offset[i]	= parseInt(res.substr(i*4,4), 16);
			}
		}

		setVersion(oldVersion);
	}

	/**
	 * Implementation without library overhead.
	 */

	function _hash32_1a_fast(str) {
		var i, l = str.length-3, t0=0,v0=0x9dc5,t1=0,v1=0x811c;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}


		return ((v1<<16)>>>0)+v0;
	}

	function _hash32_1a_fast_hex(str) {
		var i, l = str.length-3, t0=0,v0=0x9dc5,t1=0,v1=0x811c;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}


		return hl[(v1>>>8)&255]+hl[v1&255]+hl[(v0>>>8)&255]+hl[v0&255];
	}

	function _hash52_1a_fast(str){
		var i,l=str.length-3,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return (v3&15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0^(v3>>4));
	}

	function _hash52_1a_fast_hex(str){
		var i,l=str.length-3,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return hl16[v3&15]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[(v0>>8)^(v3>>12)]+hl[(v0^(v3>>4))&255];
	}

	function _hash64_1a_fast(str){
		var i,l=str.length-3,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255];
	}

	function _hash32_1a_fast_utf(str) {
		var c,i,l=str.length,t0=0,v0=0x9dc5,t1=0,v1=0x811c;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}

		return ((v1<<16)>>>0)+v0;
	}

	function _hash32_1a_fast_hex_utf(str) {
		var c,i,l=str.length,t0=0,v0=0x9dc5,t1=0,v1=0x811c;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}


		return hl[(v1>>>8)&255]+hl[v1&255]+hl[(v0>>>8)&255]+hl[v0&255];
	}

	function _hash52_1a_fast_utf(str){
		var c,i,l=str.length,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return (v3&15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0^(v3>>4));
	}

	function _hash52_1a_fast_hex_utf (str){
		var c,i,l=str.length,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return hl16[v3&15]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[(v0>>8)^(v3>>12)]+hl[(v0^(v3>>4))&255];
	}

	function _hash64_1a_fast_utf(str){
		var c,i,l=str.length,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255];
	}
	/**
	 * Regular functions. This versions are accessible through API
	 */

	function _hash32_1a(str){
		var i,l=str.length-3,s=fnvConstants[32].offset,t0=0,v0=s[1]|0,t1=0,v1=s[0]|0;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}

		return hashValInt32(((v1<<16)>>>0)+v0,32);
	}

	function _hash32_1(str){
		var i,l=str.length-3,s=fnvConstants[32].offset,t0=0,v0=s[1]|0,t1=0,v1=s[0]|0;

		for (i = 0; i < l;) {
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
		}

		while(i<l+3){
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			v0^=str.charCodeAt(i++);
		}

		return hashValInt32(((v1<<16)>>>0)+v0,32);
	}

	function _hash32_1a_utf(str){
		var c,i,l=str.length,s=fnvConstants[32].offset,t0=0,v0=s[1]|0,t1=0,v1=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
		}

		return hashValInt32(((v1<<16)>>>0)+v0,32);
	}

	function _hash32_1_utf(str){
		var c,i,l=str.length,s=fnvConstants[32].offset,t0=0,v0=s[1]|0,t1=0,v1=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			t0=v0*403;t1=v1*403;
			t1+=v0<<8;
			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*403;t1=v1*403;
				t1+=v0<<8;
				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
				v0^=(c&63)|128;
			}
		}

		return hashValInt32(((v1<<16)>>>0)+v0,32);
	}

	_hash32 = _hash32_1a;

	function _hash52_1a(str){
		var i,l=str.length-3,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return hashValInt52((v3&15)*281474976710656+v2*4294967296+v1*65536+(v0^(v3>>4)),52);
	}

	function _hash52_1(str){
		var i,l=str.length-3,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

		for (i = 0; i < l;) {
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
		}

		while(i<l+3){
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
		}

		return hashValInt52((v3&15)*281474976710656+v2*4294967296+v1*65536+(v0^(v3>>4)),52);
	}

	function _hash52_1a_utf(str){
		var c,i,l=str.length,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return hashValInt52((v3&15)*281474976710656+v2*4294967296+v1*65536+(v0^(v3>>4)),52);
	}

	function _hash52_1_utf(str){
		var c,i,l=str.length,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}
		}

		return hashValInt52((v3&15)*281474976710656+v2*4294967296+v1*65536+(v0^(v3>>4)),52);
	}

	_hash52 = _hash52_1a;

	function _hash64_1a(str){
		var i,l=str.length-3,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return hashValHex(hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],64);
	}

	function _hash64_1(str){
		var i,l=str.length-3,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

		for (i = 0; i < l;) {
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
		}

		while(i<l+3){
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			v0^=str.charCodeAt(i++);
		}

		return hashValHex(hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],64);
	}

	function _hash64_1a_utf(str){
		var c,i,l=str.length,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
		}

		return hashValHex(hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],64);
	}

	function _hash64_1_utf(str){
		var c,i,l=str.length,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
			t2+=v0<<8;t3+=v1<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
				t2+=v0<<8;t3+=v1<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
				v0^=(c&63)|128;
			}
		}

		return hashValHex(hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],64);
	}

	_hash64 = _hash64_1a;

	function _hash128_1a(str){
		var i,l=str.length-3,s=fnvConstants[128].offset,t0=0,v0=s[7]|0,t1=0,v1=s[6]|0,t2=0,v2=s[5]|0,t3=0,v3=s[4]|0,t4=0,v4=s[3]|0,t5=0,v5=s[2]|0,t6=0,v6=s[1]|0,t7=0,v7=s[0]|0;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
		}

		return hashValHex(hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],128);
	}

	function _hash128_1(str){
		var i,l=str.length-3,s=fnvConstants[128].offset,t0=0,v0=s[7]|0,t1=0,v1=s[6]|0,t2=0,v2=s[5]|0,t3=0,v3=s[4]|0,t4=0,v4=s[3]|0,t5=0,v5=s[2]|0,t6=0,v6=s[1]|0,t7=0,v7=s[0]|0;

		for (i = 0; i < l;) {
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			v0^=str.charCodeAt(i++);
		}

		while(i<l+3){
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			v0^=str.charCodeAt(i++);
		}

		return hashValHex(hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],128);
	}

	function _hash128_1a_utf(str){
		var c,i,l=str.length,s=fnvConstants[128].offset,t0=0,v0=s[7]|0,t1=0,v1=s[6]|0,t2=0,v2=s[5]|0,t3=0,v3=s[4]|0,t4=0,v4=s[3]|0,t5=0,v5=s[2]|0,t6=0,v6=s[1]|0,t7=0,v7=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=(c&63)|128;
			}
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
		}

		return hashValHex(hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],128);
	}

	function _hash128_1_utf(str){
		var c,i,l=str.length,s=fnvConstants[128].offset,t0=0,v0=s[7]|0,t1=0,v1=s[6]|0,t2=0,v2=s[5]|0,t3=0,v3=s[4]|0,t4=0,v4=s[3]|0,t5=0,v5=s[2]|0,t6=0,v6=s[1]|0,t7=0,v7=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
				v0^=(c&63)|128;
			}
		}

		return hashValHex(hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],128);
	}

	_hash128 = _hash128_1a;

	function _hash256_1a(str){
		var i,l=str.length-3,s=fnvConstants[256].offset,t0=0,v0=s[15]|0,t1=0,v1=s[14]|0,t2=0,v2=s[13]|0,t3=0,v3=s[12]|0,t4=0,v4=s[11]|0,t5=0,v5=s[10]|0,t6=0,v6=s[9]|0,t7=0,v7=s[8]|0,t8=0,v8=s[7]|0,t9=0,v9=s[6]|0,t10=0,v10=s[5]|0,t11=0,v11=s[4]|0,t12=0,v12=s[3]|0,t13=0,v13=s[2]|0,t14=0,v14=s[1]|0,t15=0,v15=s[0]|0;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
		}

		return hashValHex(hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],256);
	}

	function _hash256_1(str){
		var i,l=str.length-3,s=fnvConstants[256].offset,t0=0,v0=s[15]|0,t1=0,v1=s[14]|0,t2=0,v2=s[13]|0,t3=0,v3=s[12]|0,t4=0,v4=s[11]|0,t5=0,v5=s[10]|0,t6=0,v6=s[9]|0,t7=0,v7=s[8]|0,t8=0,v8=s[7]|0,t9=0,v9=s[6]|0,t10=0,v10=s[5]|0,t11=0,v11=s[4]|0,t12=0,v12=s[3]|0,t13=0,v13=s[2]|0,t14=0,v14=s[1]|0,t15=0,v15=s[0]|0;

		for (i = 0; i < l;) {
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			v0^=str.charCodeAt(i++);
		}

		while(i<l+3){
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			v0^=str.charCodeAt(i++);
		}

		return hashValHex(hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],256);
	}

	function _hash256_1a_utf(str){
		var c,i,l=str.length,s=fnvConstants[256].offset,t0=0,v0=s[15]|0,t1=0,v1=s[14]|0,t2=0,v2=s[13]|0,t3=0,v3=s[12]|0,t4=0,v4=s[11]|0,t5=0,v5=s[10]|0,t6=0,v6=s[9]|0,t7=0,v7=s[8]|0,t8=0,v8=s[7]|0,t9=0,v9=s[6]|0,t10=0,v10=s[5]|0,t11=0,v11=s[4]|0,t12=0,v12=s[3]|0,t13=0,v13=s[2]|0,t14=0,v14=s[1]|0,t15=0,v15=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=(c&63)|128;
			}
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
		}

		return hashValHex(hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],256);
	}

	function _hash256_1_utf(str){
		var c,i,l=str.length,s=fnvConstants[256].offset,t0=0,v0=s[15]|0,t1=0,v1=s[14]|0,t2=0,v2=s[13]|0,t3=0,v3=s[12]|0,t4=0,v4=s[11]|0,t5=0,v5=s[10]|0,t6=0,v6=s[9]|0,t7=0,v7=s[8]|0,t8=0,v8=s[7]|0,t9=0,v9=s[6]|0,t10=0,v10=s[5]|0,t11=0,v11=s[4]|0,t12=0,v12=s[3]|0,t13=0,v13=s[2]|0,t14=0,v14=s[1]|0,t15=0,v15=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
				v0^=(c&63)|128;
			}
		}

		return hashValHex(hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],256);
	}

	_hash256 = _hash256_1a;

	function _hash512_1a(str){
		var i,l=str.length-3,s=fnvConstants[512].offset,t0=0,v0=s[31]|0,t1=0,v1=s[30]|0,t2=0,v2=s[29]|0,t3=0,v3=s[28]|0,t4=0,v4=s[27]|0,t5=0,v5=s[26]|0,t6=0,v6=s[25]|0,t7=0,v7=s[24]|0,t8=0,v8=s[23]|0,t9=0,v9=s[22]|0,t10=0,v10=s[21]|0,t11=0,v11=s[20]|0,t12=0,v12=s[19]|0,t13=0,v13=s[18]|0,t14=0,v14=s[17]|0,t15=0,v15=s[16]|0,t16=0,v16=s[15]|0,t17=0,v17=s[14]|0,t18=0,v18=s[13]|0,t19=0,v19=s[12]|0,t20=0,v20=s[11]|0,t21=0,v21=s[10]|0,t22=0,v22=s[9]|0,t23=0,v23=s[8]|0,t24=0,v24=s[7]|0,t25=0,v25=s[6]|0,t26=0,v26=s[5]|0,t27=0,v27=s[4]|0,t28=0,v28=s[3]|0,t29=0,v29=s[2]|0,t30=0,v30=s[1]|0,t31=0,v31=s[0]|0;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
		}

		return hashValHex(hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],512);
	}

	function _hash512_1(str){
		var i,l=str.length-3,s=fnvConstants[512].offset,t0=0,v0=s[31]|0,t1=0,v1=s[30]|0,t2=0,v2=s[29]|0,t3=0,v3=s[28]|0,t4=0,v4=s[27]|0,t5=0,v5=s[26]|0,t6=0,v6=s[25]|0,t7=0,v7=s[24]|0,t8=0,v8=s[23]|0,t9=0,v9=s[22]|0,t10=0,v10=s[21]|0,t11=0,v11=s[20]|0,t12=0,v12=s[19]|0,t13=0,v13=s[18]|0,t14=0,v14=s[17]|0,t15=0,v15=s[16]|0,t16=0,v16=s[15]|0,t17=0,v17=s[14]|0,t18=0,v18=s[13]|0,t19=0,v19=s[12]|0,t20=0,v20=s[11]|0,t21=0,v21=s[10]|0,t22=0,v22=s[9]|0,t23=0,v23=s[8]|0,t24=0,v24=s[7]|0,t25=0,v25=s[6]|0,t26=0,v26=s[5]|0,t27=0,v27=s[4]|0,t28=0,v28=s[3]|0,t29=0,v29=s[2]|0,t30=0,v30=s[1]|0,t31=0,v31=s[0]|0;

		for (i = 0; i < l;) {
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			v0^=str.charCodeAt(i++);
		}

		while(i<l+3){
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			v0^=str.charCodeAt(i++);
		}

		return hashValHex(hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],512);
	}

	function _hash512_1a_utf(str){
		var c,i,l=str.length,s=fnvConstants[512].offset,t0=0,v0=s[31]|0,t1=0,v1=s[30]|0,t2=0,v2=s[29]|0,t3=0,v3=s[28]|0,t4=0,v4=s[27]|0,t5=0,v5=s[26]|0,t6=0,v6=s[25]|0,t7=0,v7=s[24]|0,t8=0,v8=s[23]|0,t9=0,v9=s[22]|0,t10=0,v10=s[21]|0,t11=0,v11=s[20]|0,t12=0,v12=s[19]|0,t13=0,v13=s[18]|0,t14=0,v14=s[17]|0,t15=0,v15=s[16]|0,t16=0,v16=s[15]|0,t17=0,v17=s[14]|0,t18=0,v18=s[13]|0,t19=0,v19=s[12]|0,t20=0,v20=s[11]|0,t21=0,v21=s[10]|0,t22=0,v22=s[9]|0,t23=0,v23=s[8]|0,t24=0,v24=s[7]|0,t25=0,v25=s[6]|0,t26=0,v26=s[5]|0,t27=0,v27=s[4]|0,t28=0,v28=s[3]|0,t29=0,v29=s[2]|0,t30=0,v30=s[1]|0,t31=0,v31=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=(c&63)|128;
			}
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
		}

		return hashValHex(hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],512);
	}

	function _hash512_1_utf(str){
		var c,i,l=str.length,s=fnvConstants[512].offset,t0=0,v0=s[31]|0,t1=0,v1=s[30]|0,t2=0,v2=s[29]|0,t3=0,v3=s[28]|0,t4=0,v4=s[27]|0,t5=0,v5=s[26]|0,t6=0,v6=s[25]|0,t7=0,v7=s[24]|0,t8=0,v8=s[23]|0,t9=0,v9=s[22]|0,t10=0,v10=s[21]|0,t11=0,v11=s[20]|0,t12=0,v12=s[19]|0,t13=0,v13=s[18]|0,t14=0,v14=s[17]|0,t15=0,v15=s[16]|0,t16=0,v16=s[15]|0,t17=0,v17=s[14]|0,t18=0,v18=s[13]|0,t19=0,v19=s[12]|0,t20=0,v20=s[11]|0,t21=0,v21=s[10]|0,t22=0,v22=s[9]|0,t23=0,v23=s[8]|0,t24=0,v24=s[7]|0,t25=0,v25=s[6]|0,t26=0,v26=s[5]|0,t27=0,v27=s[4]|0,t28=0,v28=s[3]|0,t29=0,v29=s[2]|0,t30=0,v30=s[1]|0,t31=0,v31=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
				v0^=(c&63)|128;
			}
		}

		return hashValHex(hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],512);
	}

	_hash512 = _hash512_1a;

	function _hash1024_1a(str){
		var i,l=str.length-3,s=fnvConstants[1024].offset,t0=0,v0=s[63]|0,t1=0,v1=s[62]|0,t2=0,v2=s[61]|0,t3=0,v3=s[60]|0,t4=0,v4=s[59]|0,t5=0,v5=s[58]|0,t6=0,v6=s[57]|0,t7=0,v7=s[56]|0,t8=0,v8=s[55]|0,t9=0,v9=s[54]|0,t10=0,v10=s[53]|0,t11=0,v11=s[52]|0,t12=0,v12=s[51]|0,t13=0,v13=s[50]|0,t14=0,v14=s[49]|0,t15=0,v15=s[48]|0,t16=0,v16=s[47]|0,t17=0,v17=s[46]|0,t18=0,v18=s[45]|0,t19=0,v19=s[44]|0,t20=0,v20=s[43]|0,t21=0,v21=s[42]|0,t22=0,v22=s[41]|0,t23=0,v23=s[40]|0,t24=0,v24=s[39]|0,t25=0,v25=s[38]|0,t26=0,v26=s[37]|0,t27=0,v27=s[36]|0,t28=0,v28=s[35]|0,t29=0,v29=s[34]|0,t30=0,v30=s[33]|0,t31=0,v31=s[32]|0,t32=0,v32=s[31]|0,t33=0,v33=s[30]|0,t34=0,v34=s[29]|0,t35=0,v35=s[28]|0,t36=0,v36=s[27]|0,t37=0,v37=s[26]|0,t38=0,v38=s[25]|0,t39=0,v39=s[24]|0,t40=0,v40=s[23]|0,t41=0,v41=s[22]|0,t42=0,v42=s[21]|0,t43=0,v43=s[20]|0,t44=0,v44=s[19]|0,t45=0,v45=s[18]|0,t46=0,v46=s[17]|0,t47=0,v47=s[16]|0,t48=0,v48=s[15]|0,t49=0,v49=s[14]|0,t50=0,v50=s[13]|0,t51=0,v51=s[12]|0,t52=0,v52=s[11]|0,t53=0,v53=s[10]|0,t54=0,v54=s[9]|0,t55=0,v55=s[8]|0,t56=0,v56=s[7]|0,t57=0,v57=s[6]|0,t58=0,v58=s[5]|0,t59=0,v59=s[4]|0,t60=0,v60=s[3]|0,t61=0,v61=s[2]|0,t62=0,v62=s[1]|0,t63=0,v63=s[0]|0;

		for (i = 0; i < l;) {
			v0^=str.charCodeAt(i++);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
		}

		while(i<l+3){
			v0^=str.charCodeAt(i++);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
		}

		return hashValHex(hl[v63>>8]+hl[v63&255]+hl[v62>>8]+hl[v62&255]+hl[v61>>8]+hl[v61&255]+hl[v60>>8]+hl[v60&255]+hl[v59>>8]+hl[v59&255]+hl[v58>>8]+hl[v58&255]+hl[v57>>8]+hl[v57&255]+hl[v56>>8]+hl[v56&255]+hl[v55>>8]+hl[v55&255]+hl[v54>>8]+hl[v54&255]+hl[v53>>8]+hl[v53&255]+hl[v52>>8]+hl[v52&255]+hl[v51>>8]+hl[v51&255]+hl[v50>>8]+hl[v50&255]+hl[v49>>8]+hl[v49&255]+hl[v48>>8]+hl[v48&255]+hl[v47>>8]+hl[v47&255]+hl[v46>>8]+hl[v46&255]+hl[v45>>8]+hl[v45&255]+hl[v44>>8]+hl[v44&255]+hl[v43>>8]+hl[v43&255]+hl[v42>>8]+hl[v42&255]+hl[v41>>8]+hl[v41&255]+hl[v40>>8]+hl[v40&255]+hl[v39>>8]+hl[v39&255]+hl[v38>>8]+hl[v38&255]+hl[v37>>8]+hl[v37&255]+hl[v36>>8]+hl[v36&255]+hl[v35>>8]+hl[v35&255]+hl[v34>>8]+hl[v34&255]+hl[v33>>8]+hl[v33&255]+hl[v32>>8]+hl[v32&255]+hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],1024);
	}

	function _hash1024_1(str){
		var i,l=str.length-3,s=fnvConstants[1024].offset,t0=0,v0=s[63]|0,t1=0,v1=s[62]|0,t2=0,v2=s[61]|0,t3=0,v3=s[60]|0,t4=0,v4=s[59]|0,t5=0,v5=s[58]|0,t6=0,v6=s[57]|0,t7=0,v7=s[56]|0,t8=0,v8=s[55]|0,t9=0,v9=s[54]|0,t10=0,v10=s[53]|0,t11=0,v11=s[52]|0,t12=0,v12=s[51]|0,t13=0,v13=s[50]|0,t14=0,v14=s[49]|0,t15=0,v15=s[48]|0,t16=0,v16=s[47]|0,t17=0,v17=s[46]|0,t18=0,v18=s[45]|0,t19=0,v19=s[44]|0,t20=0,v20=s[43]|0,t21=0,v21=s[42]|0,t22=0,v22=s[41]|0,t23=0,v23=s[40]|0,t24=0,v24=s[39]|0,t25=0,v25=s[38]|0,t26=0,v26=s[37]|0,t27=0,v27=s[36]|0,t28=0,v28=s[35]|0,t29=0,v29=s[34]|0,t30=0,v30=s[33]|0,t31=0,v31=s[32]|0,t32=0,v32=s[31]|0,t33=0,v33=s[30]|0,t34=0,v34=s[29]|0,t35=0,v35=s[28]|0,t36=0,v36=s[27]|0,t37=0,v37=s[26]|0,t38=0,v38=s[25]|0,t39=0,v39=s[24]|0,t40=0,v40=s[23]|0,t41=0,v41=s[22]|0,t42=0,v42=s[21]|0,t43=0,v43=s[20]|0,t44=0,v44=s[19]|0,t45=0,v45=s[18]|0,t46=0,v46=s[17]|0,t47=0,v47=s[16]|0,t48=0,v48=s[15]|0,t49=0,v49=s[14]|0,t50=0,v50=s[13]|0,t51=0,v51=s[12]|0,t52=0,v52=s[11]|0,t53=0,v53=s[10]|0,t54=0,v54=s[9]|0,t55=0,v55=s[8]|0,t56=0,v56=s[7]|0,t57=0,v57=s[6]|0,t58=0,v58=s[5]|0,t59=0,v59=s[4]|0,t60=0,v60=s[3]|0,t61=0,v61=s[2]|0,t62=0,v62=s[1]|0,t63=0,v63=s[0]|0;

		for (i = 0; i < l;) {
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			v0^=str.charCodeAt(i++);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			v0^=str.charCodeAt(i++);
		}

		while(i<l+3){
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			v0^=str.charCodeAt(i++);
		}

		return hashValHex(hl[v63>>8]+hl[v63&255]+hl[v62>>8]+hl[v62&255]+hl[v61>>8]+hl[v61&255]+hl[v60>>8]+hl[v60&255]+hl[v59>>8]+hl[v59&255]+hl[v58>>8]+hl[v58&255]+hl[v57>>8]+hl[v57&255]+hl[v56>>8]+hl[v56&255]+hl[v55>>8]+hl[v55&255]+hl[v54>>8]+hl[v54&255]+hl[v53>>8]+hl[v53&255]+hl[v52>>8]+hl[v52&255]+hl[v51>>8]+hl[v51&255]+hl[v50>>8]+hl[v50&255]+hl[v49>>8]+hl[v49&255]+hl[v48>>8]+hl[v48&255]+hl[v47>>8]+hl[v47&255]+hl[v46>>8]+hl[v46&255]+hl[v45>>8]+hl[v45&255]+hl[v44>>8]+hl[v44&255]+hl[v43>>8]+hl[v43&255]+hl[v42>>8]+hl[v42&255]+hl[v41>>8]+hl[v41&255]+hl[v40>>8]+hl[v40&255]+hl[v39>>8]+hl[v39&255]+hl[v38>>8]+hl[v38&255]+hl[v37>>8]+hl[v37&255]+hl[v36>>8]+hl[v36&255]+hl[v35>>8]+hl[v35&255]+hl[v34>>8]+hl[v34&255]+hl[v33>>8]+hl[v33&255]+hl[v32>>8]+hl[v32&255]+hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],1024);
	}

	function _hash1024_1a_utf(str){
		var c,i,l=str.length,s=fnvConstants[1024].offset,t0=0,v0=s[63]|0,t1=0,v1=s[62]|0,t2=0,v2=s[61]|0,t3=0,v3=s[60]|0,t4=0,v4=s[59]|0,t5=0,v5=s[58]|0,t6=0,v6=s[57]|0,t7=0,v7=s[56]|0,t8=0,v8=s[55]|0,t9=0,v9=s[54]|0,t10=0,v10=s[53]|0,t11=0,v11=s[52]|0,t12=0,v12=s[51]|0,t13=0,v13=s[50]|0,t14=0,v14=s[49]|0,t15=0,v15=s[48]|0,t16=0,v16=s[47]|0,t17=0,v17=s[46]|0,t18=0,v18=s[45]|0,t19=0,v19=s[44]|0,t20=0,v20=s[43]|0,t21=0,v21=s[42]|0,t22=0,v22=s[41]|0,t23=0,v23=s[40]|0,t24=0,v24=s[39]|0,t25=0,v25=s[38]|0,t26=0,v26=s[37]|0,t27=0,v27=s[36]|0,t28=0,v28=s[35]|0,t29=0,v29=s[34]|0,t30=0,v30=s[33]|0,t31=0,v31=s[32]|0,t32=0,v32=s[31]|0,t33=0,v33=s[30]|0,t34=0,v34=s[29]|0,t35=0,v35=s[28]|0,t36=0,v36=s[27]|0,t37=0,v37=s[26]|0,t38=0,v38=s[25]|0,t39=0,v39=s[24]|0,t40=0,v40=s[23]|0,t41=0,v41=s[22]|0,t42=0,v42=s[21]|0,t43=0,v43=s[20]|0,t44=0,v44=s[19]|0,t45=0,v45=s[18]|0,t46=0,v46=s[17]|0,t47=0,v47=s[16]|0,t48=0,v48=s[15]|0,t49=0,v49=s[14]|0,t50=0,v50=s[13]|0,t51=0,v51=s[12]|0,t52=0,v52=s[11]|0,t53=0,v53=s[10]|0,t54=0,v54=s[9]|0,t55=0,v55=s[8]|0,t56=0,v56=s[7]|0,t57=0,v57=s[6]|0,t58=0,v58=s[5]|0,t59=0,v59=s[4]|0,t60=0,v60=s[3]|0,t61=0,v61=s[2]|0,t62=0,v62=s[1]|0,t63=0,v63=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=(c&63)|128;
			}
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
		}

		return hashValHex(hl[v63>>8]+hl[v63&255]+hl[v62>>8]+hl[v62&255]+hl[v61>>8]+hl[v61&255]+hl[v60>>8]+hl[v60&255]+hl[v59>>8]+hl[v59&255]+hl[v58>>8]+hl[v58&255]+hl[v57>>8]+hl[v57&255]+hl[v56>>8]+hl[v56&255]+hl[v55>>8]+hl[v55&255]+hl[v54>>8]+hl[v54&255]+hl[v53>>8]+hl[v53&255]+hl[v52>>8]+hl[v52&255]+hl[v51>>8]+hl[v51&255]+hl[v50>>8]+hl[v50&255]+hl[v49>>8]+hl[v49&255]+hl[v48>>8]+hl[v48&255]+hl[v47>>8]+hl[v47&255]+hl[v46>>8]+hl[v46&255]+hl[v45>>8]+hl[v45&255]+hl[v44>>8]+hl[v44&255]+hl[v43>>8]+hl[v43&255]+hl[v42>>8]+hl[v42&255]+hl[v41>>8]+hl[v41&255]+hl[v40>>8]+hl[v40&255]+hl[v39>>8]+hl[v39&255]+hl[v38>>8]+hl[v38&255]+hl[v37>>8]+hl[v37&255]+hl[v36>>8]+hl[v36&255]+hl[v35>>8]+hl[v35&255]+hl[v34>>8]+hl[v34&255]+hl[v33>>8]+hl[v33&255]+hl[v32>>8]+hl[v32&255]+hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],1024);
	}

	function _hash1024_1_utf(str){
		var c,i,l=str.length,s=fnvConstants[1024].offset,t0=0,v0=s[63]|0,t1=0,v1=s[62]|0,t2=0,v2=s[61]|0,t3=0,v3=s[60]|0,t4=0,v4=s[59]|0,t5=0,v5=s[58]|0,t6=0,v6=s[57]|0,t7=0,v7=s[56]|0,t8=0,v8=s[55]|0,t9=0,v9=s[54]|0,t10=0,v10=s[53]|0,t11=0,v11=s[52]|0,t12=0,v12=s[51]|0,t13=0,v13=s[50]|0,t14=0,v14=s[49]|0,t15=0,v15=s[48]|0,t16=0,v16=s[47]|0,t17=0,v17=s[46]|0,t18=0,v18=s[45]|0,t19=0,v19=s[44]|0,t20=0,v20=s[43]|0,t21=0,v21=s[42]|0,t22=0,v22=s[41]|0,t23=0,v23=s[40]|0,t24=0,v24=s[39]|0,t25=0,v25=s[38]|0,t26=0,v26=s[37]|0,t27=0,v27=s[36]|0,t28=0,v28=s[35]|0,t29=0,v29=s[34]|0,t30=0,v30=s[33]|0,t31=0,v31=s[32]|0,t32=0,v32=s[31]|0,t33=0,v33=s[30]|0,t34=0,v34=s[29]|0,t35=0,v35=s[28]|0,t36=0,v36=s[27]|0,t37=0,v37=s[26]|0,t38=0,v38=s[25]|0,t39=0,v39=s[24]|0,t40=0,v40=s[23]|0,t41=0,v41=s[22]|0,t42=0,v42=s[21]|0,t43=0,v43=s[20]|0,t44=0,v44=s[19]|0,t45=0,v45=s[18]|0,t46=0,v46=s[17]|0,t47=0,v47=s[16]|0,t48=0,v48=s[15]|0,t49=0,v49=s[14]|0,t50=0,v50=s[13]|0,t51=0,v51=s[12]|0,t52=0,v52=s[11]|0,t53=0,v53=s[10]|0,t54=0,v54=s[9]|0,t55=0,v55=s[8]|0,t56=0,v56=s[7]|0,t57=0,v57=s[6]|0,t58=0,v58=s[5]|0,t59=0,v59=s[4]|0,t60=0,v60=s[3]|0,t61=0,v61=s[2]|0,t62=0,v62=s[1]|0,t63=0,v63=s[0]|0;

		for (i = 0; i < l; i++) {
			c = str.charCodeAt(i);
			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
			if(c < 128){
				v0^=c;
			}else if(c < 2048){
				v0^=(c>>6)|192;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=(c&63)|128;
			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
				v0^=(c>>18)|240;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=((c>>12)&63)|128;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=(c&63)|128;
			}else{
				v0^=(c>>12)|224;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=((c>>6)&63)|128;
				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
				v0^=(c&63)|128;
			}
		}

		return hashValHex(hl[v63>>8]+hl[v63&255]+hl[v62>>8]+hl[v62&255]+hl[v61>>8]+hl[v61&255]+hl[v60>>8]+hl[v60&255]+hl[v59>>8]+hl[v59&255]+hl[v58>>8]+hl[v58&255]+hl[v57>>8]+hl[v57&255]+hl[v56>>8]+hl[v56&255]+hl[v55>>8]+hl[v55&255]+hl[v54>>8]+hl[v54&255]+hl[v53>>8]+hl[v53&255]+hl[v52>>8]+hl[v52&255]+hl[v51>>8]+hl[v51&255]+hl[v50>>8]+hl[v50&255]+hl[v49>>8]+hl[v49&255]+hl[v48>>8]+hl[v48&255]+hl[v47>>8]+hl[v47&255]+hl[v46>>8]+hl[v46&255]+hl[v45>>8]+hl[v45&255]+hl[v44>>8]+hl[v44&255]+hl[v43>>8]+hl[v43&255]+hl[v42>>8]+hl[v42&255]+hl[v41>>8]+hl[v41&255]+hl[v40>>8]+hl[v40&255]+hl[v39>>8]+hl[v39&255]+hl[v38>>8]+hl[v38&255]+hl[v37>>8]+hl[v37&255]+hl[v36>>8]+hl[v36&255]+hl[v35>>8]+hl[v35&255]+hl[v34>>8]+hl[v34&255]+hl[v33>>8]+hl[v33&255]+hl[v32>>8]+hl[v32&255]+hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],1024);
	}

	_hash1024 = _hash1024_1a;

	// Init library.
	setVersion('1a');
	setUTF8(false);
	seed();

	return {
		hash: hash,
		setKeyspace: setKeyspace,
		version: setVersion,
		useUTF8: setUTF8,
		seed: seed,
		fast1a32: _hash32_1a_fast,
		fast1a32hex:_hash32_1a_fast_hex,
		fast1a52: _hash52_1a_fast,
		fast1a52hex: _hash52_1a_fast_hex,
		fast1a64: _hash64_1a_fast,
		fast1a32utf: _hash32_1a_fast_utf,
		fast1a32hexutf:_hash32_1a_fast_hex_utf,
		fast1a52utf: _hash52_1a_fast_utf,
		fast1a52hexutf: _hash52_1a_fast_hex_utf,
		fast1a64utf: _hash64_1a_fast_utf
	};
})();

if ( true && typeof module.exports != "undefined") module.exports = fnvplus;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ensureAllNewCellsHaveCellIds = void 0;
const vscode_1 = __webpack_require__(1);
const uuid_1 = __webpack_require__(9);
const serializers_1 = __webpack_require__(6);
const notebookSerializer_1 = __webpack_require__(2);
/**
 * Ensure all new cells in notebooks with nbformat >= 4.5 have an id.
 * Details of the spec can be found here https://jupyter.org/enhancement-proposals/62-cell-id/cell-id.html#
 */
function ensureAllNewCellsHaveCellIds(context) {
    vscode_1.workspace.onDidChangeNotebookDocument(onDidChangeNotebookCells, undefined, context.subscriptions);
}
exports.ensureAllNewCellsHaveCellIds = ensureAllNewCellsHaveCellIds;
function onDidChangeNotebookCells(e) {
    const nbMetadata = (0, notebookSerializer_1.getNotebookMetadata)(e.notebook);
    if (!isCellIdRequired(nbMetadata)) {
        return;
    }
    e.contentChanges.forEach(change => {
        change.addedCells.forEach(cell => {
            const cellMetadata = (0, serializers_1.getCellMetadata)(cell);
            if (cellMetadata?.id) {
                return;
            }
            const id = generateCellId(e.notebook);
            const edit = new vscode_1.WorkspaceEdit();
            // Don't edit the metadata directly, always get a clone (prevents accidental singletons and directly editing the objects).
            const updatedMetadata = { ...JSON.parse(JSON.stringify(cellMetadata || {})) };
            updatedMetadata.id = id;
            edit.set(cell.notebook.uri, [vscode_1.NotebookEdit.updateCellMetadata(cell.index, { ...(cell.metadata), custom: updatedMetadata })]);
            vscode_1.workspace.applyEdit(edit);
        });
    });
}
/**
 * Cell ids are required in notebooks only in notebooks with nbformat >= 4.5
 */
function isCellIdRequired(metadata) {
    if ((metadata.nbformat || 0) >= 5) {
        return true;
    }
    if ((metadata.nbformat || 0) === 4 && (metadata.nbformat_minor || 0) >= 5) {
        return true;
    }
    return false;
}
function generateCellId(notebook) {
    while (true) {
        // Details of the id can be found here https://jupyter.org/enhancement-proposals/62-cell-id/cell-id.html#adding-an-id-field,
        // & here https://jupyter.org/enhancement-proposals/62-cell-id/cell-id.html#updating-older-formats
        const id = (0, uuid_1.v4)().replace(/-/g, '').substring(0, 8);
        let duplicate = false;
        for (let index = 0; index < notebook.cellCount; index++) {
            const cell = notebook.cellAt(index);
            const existingId = (0, serializers_1.getCellMetadata)(cell)?.id;
            if (!existingId) {
                continue;
            }
            if (existingId === id) {
                duplicate = true;
                break;
            }
        }
        if (!duplicate) {
            return id;
        }
    }
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NIL": () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "parse": () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "stringify": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "v1": () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "v3": () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "v4": () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "v5": () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "validate": () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "version": () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(22);
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(23);
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(13);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(12);
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(17);










/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18);


var v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DNS": () => (/* binding */ DNS),
/* harmony export */   "URL": () => (/* binding */ URL),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


function parse(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21);


var v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


function version(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.notebookImagePasteSetup = void 0;
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(4);
const path_1 = __webpack_require__(25);
var MimeType;
(function (MimeType) {
    MimeType["bmp"] = "image/bmp";
    MimeType["gif"] = "image/gif";
    MimeType["ico"] = "image/ico";
    MimeType["jpeg"] = "image/jpeg";
    MimeType["png"] = "image/png";
    MimeType["tiff"] = "image/tiff";
    MimeType["webp"] = "image/webp";
    MimeType["uriList"] = "text/uri-list";
})(MimeType || (MimeType = {}));
const imageMimeTypes = new Set([
    MimeType.bmp,
    MimeType.gif,
    MimeType.ico,
    MimeType.jpeg,
    MimeType.png,
    MimeType.tiff,
    MimeType.webp,
]);
const imageExtToMime = new Map([
    ['.bmp', MimeType.bmp],
    ['.gif', MimeType.gif],
    ['.ico', MimeType.ico],
    ['.jpe', MimeType.jpeg],
    ['.jpeg', MimeType.jpeg],
    ['.jpg', MimeType.jpeg],
    ['.png', MimeType.png],
    ['.tif', MimeType.tiff],
    ['.tiff', MimeType.tiff],
    ['.webp', MimeType.webp],
]);
function getImageMimeType(uri) {
    return imageExtToMime.get((0, path_1.extname)(uri.fsPath).toLowerCase());
}
class DropOrPasteEditProvider {
    constructor() {
        this.id = 'insertAttachment';
        this.defaultPriority = 5;
    }
    async provideDocumentPasteEdits(document, _ranges, dataTransfer, token) {
        const enabled = vscode.workspace.getConfiguration('ipynb', document).get('pasteImagesAsAttachments.enabled', true);
        if (!enabled) {
            return;
        }
        const insert = await this.createInsertImageAttachmentEdit(document, dataTransfer, token);
        if (!insert) {
            return;
        }
        const pasteEdit = new vscode.DocumentPasteEdit(insert.insertText, this.id, vscode.l10n.t('Insert Image as Attachment'));
        pasteEdit.priority = this.getPastePriority(dataTransfer);
        pasteEdit.additionalEdit = insert.additionalEdit;
        return pasteEdit;
    }
    async provideDocumentDropEdits(document, _position, dataTransfer, token) {
        const insert = await this.createInsertImageAttachmentEdit(document, dataTransfer, token);
        if (!insert) {
            return;
        }
        const dropEdit = new vscode.DocumentDropEdit(insert.insertText);
        dropEdit.id = this.id;
        dropEdit.priority = this.defaultPriority;
        dropEdit.additionalEdit = insert.additionalEdit;
        dropEdit.label = vscode.l10n.t('Insert Image as Attachment');
        return dropEdit;
    }
    getPastePriority(dataTransfer) {
        if (dataTransfer.get('text/plain')) {
            // Deprioritize in favor of normal text content
            return -5;
        }
        // Otherwise boost priority so attachments are preferred
        return this.defaultPriority;
    }
    async createInsertImageAttachmentEdit(document, dataTransfer, token) {
        const imageData = await getDroppedImageData(dataTransfer, token);
        if (!imageData.length || token.isCancellationRequested) {
            return;
        }
        const currentCell = getCellFromCellDocument(document);
        if (!currentCell) {
            return undefined;
        }
        // create updated metadata for cell (prep for WorkspaceEdit)
        const newAttachment = buildAttachment(currentCell, imageData);
        if (!newAttachment) {
            return;
        }
        // build edits
        const additionalEdit = new vscode.WorkspaceEdit();
        const nbEdit = vscode.NotebookEdit.updateCellMetadata(currentCell.index, newAttachment.metadata);
        const notebookUri = currentCell.notebook.uri;
        additionalEdit.set(notebookUri, [nbEdit]);
        // create a snippet for paste
        const insertText = new vscode.SnippetString();
        newAttachment.filenames.forEach((filename, i) => {
            insertText.appendText('![');
            insertText.appendPlaceholder(`${filename}`);
            insertText.appendText(`](${/\s/.test(filename) ? `<attachment:${filename}>` : `attachment:${filename}`})`);
            if (i !== newAttachment.filenames.length - 1) {
                insertText.appendText(' ');
            }
        });
        return { insertText, additionalEdit };
    }
}
async function getDroppedImageData(dataTransfer, token) {
    // Prefer using image data in the clipboard
    const files = coalesce(await Promise.all(Array.from(dataTransfer, async ([mimeType, item]) => {
        if (!imageMimeTypes.has(mimeType)) {
            return;
        }
        const file = item.asFile();
        if (!file) {
            return;
        }
        const data = await file.data();
        return { fileName: file.name, mimeType, data };
    })));
    if (files.length) {
        return files;
    }
    // Then fallback to image files in the uri-list
    const urlList = await dataTransfer.get('text/uri-list')?.asString();
    if (token.isCancellationRequested) {
        return [];
    }
    if (urlList) {
        const uris = [];
        for (const resource of urlList.split(/\r?\n/g)) {
            try {
                uris.push(vscode.Uri.parse(resource));
            }
            catch {
                // noop
            }
        }
        const entries = await Promise.all(uris.map(async (uri) => {
            const mimeType = getImageMimeType(uri);
            if (!mimeType) {
                return;
            }
            const data = await vscode.workspace.fs.readFile(uri);
            return { fileName: (0, path_1.basename)(uri.fsPath), mimeType, data };
        }));
        return coalesce(entries);
    }
    return [];
}
function coalesce(array) {
    return array.filter(e => !!e);
}
function getCellFromCellDocument(cellDocument) {
    for (const notebook of vscode.workspace.notebookDocuments) {
        if (notebook.uri.path === cellDocument.uri.path) {
            for (const cell of notebook.getCells()) {
                if (cell.document === cellDocument) {
                    return cell;
                }
            }
        }
    }
    return undefined;
}
/**
 *  Taken from https://github.com/microsoft/vscode/blob/743b016722db90df977feecde0a4b3b4f58c2a4c/src/vs/base/common/buffer.ts#L350-L387
 */
function encodeBase64(buffer, padded = true, urlSafe = false) {
    const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const base64UrlSafeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const dictionary = urlSafe ? base64UrlSafeAlphabet : base64Alphabet;
    let output = '';
    const remainder = buffer.byteLength % 3;
    let i = 0;
    for (; i < buffer.byteLength - remainder; i += 3) {
        const a = buffer[i + 0];
        const b = buffer[i + 1];
        const c = buffer[i + 2];
        output += dictionary[a >>> 2];
        output += dictionary[(a << 4 | b >>> 4) & 0b111111];
        output += dictionary[(b << 2 | c >>> 6) & 0b111111];
        output += dictionary[c & 0b111111];
    }
    if (remainder === 1) {
        const a = buffer[i + 0];
        output += dictionary[a >>> 2];
        output += dictionary[(a << 4) & 0b111111];
        if (padded) {
            output += '==';
        }
    }
    else if (remainder === 2) {
        const a = buffer[i + 0];
        const b = buffer[i + 1];
        output += dictionary[a >>> 2];
        output += dictionary[(a << 4 | b >>> 4) & 0b111111];
        output += dictionary[(b << 2) & 0b111111];
        if (padded) {
            output += '=';
        }
    }
    return output;
}
function buildAttachment(cell, attachments) {
    const cellMetadata = { ...cell.metadata };
    const tempFilenames = [];
    if (!attachments.length) {
        return undefined;
    }
    if (!cellMetadata.attachments) {
        cellMetadata.attachments = {};
    }
    for (const attachment of attachments) {
        const b64 = encodeBase64(attachment.data);
        const fileExt = (0, path_1.extname)(attachment.fileName);
        const filenameWithoutExt = (0, path_1.basename)(attachment.fileName, fileExt);
        let tempFilename = filenameWithoutExt + fileExt;
        for (let appendValue = 2; tempFilename in cellMetadata.attachments; appendValue++) {
            const objEntries = Object.entries(cellMetadata.attachments[tempFilename]);
            if (objEntries.length) { // check that mime:b64 are present
                const [mime, attachmentb64] = objEntries[0];
                if (mime === attachment.mimeType && attachmentb64 === b64) { // checking if filename can be reused, based on comparison of image data
                    break;
                }
                else {
                    tempFilename = filenameWithoutExt.concat(`-${appendValue}`) + fileExt;
                }
            }
        }
        tempFilenames.push(tempFilename);
        cellMetadata.attachments[tempFilename] = { [attachment.mimeType]: b64 };
    }
    return {
        metadata: cellMetadata,
        filenames: tempFilenames,
    };
}
function notebookImagePasteSetup() {
    const provider = new DropOrPasteEditProvider();
    return vscode.Disposable.from(vscode.languages.registerDocumentPasteEditProvider(constants_1.JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR, provider, {
        pasteMimeTypes: [
            MimeType.png,
            MimeType.uriList,
        ],
    }), vscode.languages.registerDocumentDropEditProvider(constants_1.JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR, provider, {
        dropMimeTypes: [
            ...Object.values(imageExtToMime),
            MimeType.uriList,
        ],
    }));
}
exports.notebookImagePasteSetup = notebookImagePasteSetup;


/***/ }),
/* 25 */
/***/ ((module) => {

"use strict";
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttachmentCleaner = exports.DiagnosticCode = void 0;
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(4);
const helper_1 = __webpack_require__(27);
var DiagnosticCode;
(function (DiagnosticCode) {
    DiagnosticCode["missing_attachment"] = "notebook.missing-attachment";
})(DiagnosticCode || (exports.DiagnosticCode = DiagnosticCode = {}));
class AttachmentCleaner {
    constructor() {
        this._attachmentCache = new Map();
        this._delayer = new helper_1.Delayer(750);
        this._disposables = [];
        this._imageDiagnosticCollection = vscode.languages.createDiagnosticCollection('Notebook Image Attachment');
        this._disposables.push(this._imageDiagnosticCollection);
        this._disposables.push(vscode.commands.registerCommand(constants_1.ATTACHMENT_CLEANUP_COMMANDID, async (document, range) => {
            const workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.delete(document, range);
            await vscode.workspace.applyEdit(workspaceEdit);
        }));
        this._disposables.push(vscode.languages.registerCodeActionsProvider(constants_1.JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR, this, {
            providedCodeActionKinds: [
                vscode.CodeActionKind.QuickFix
            ],
        }));
        this._disposables.push(vscode.workspace.onDidChangeNotebookDocument(e => {
            this._delayer.trigger(() => {
                e.cellChanges.forEach(change => {
                    if (!change.document) {
                        return;
                    }
                    if (change.cell.kind !== vscode.NotebookCellKind.Markup) {
                        return;
                    }
                    const metadataEdit = this.cleanNotebookAttachments({
                        notebook: e.notebook,
                        cell: change.cell,
                        document: change.document
                    });
                    if (metadataEdit) {
                        const workspaceEdit = new vscode.WorkspaceEdit();
                        workspaceEdit.set(e.notebook.uri, [metadataEdit]);
                        vscode.workspace.applyEdit(workspaceEdit);
                    }
                });
            });
        }));
        this._disposables.push(vscode.workspace.onWillSaveNotebookDocument(e => {
            if (e.reason === vscode.TextDocumentSaveReason.Manual) {
                this._delayer.dispose();
                e.waitUntil(new Promise((resolve) => {
                    if (e.notebook.getCells().length === 0) {
                        return;
                    }
                    const notebookEdits = [];
                    for (const cell of e.notebook.getCells()) {
                        if (cell.kind !== vscode.NotebookCellKind.Markup) {
                            continue;
                        }
                        const metadataEdit = this.cleanNotebookAttachments({
                            notebook: e.notebook,
                            cell: cell,
                            document: cell.document
                        });
                        if (metadataEdit) {
                            notebookEdits.push(metadataEdit);
                        }
                    }
                    const workspaceEdit = new vscode.WorkspaceEdit();
                    workspaceEdit.set(e.notebook.uri, notebookEdits);
                    resolve(workspaceEdit);
                }));
            }
        }));
        this._disposables.push(vscode.workspace.onDidCloseNotebookDocument(e => {
            this._attachmentCache.delete(e.uri.toString());
        }));
        this._disposables.push(vscode.workspace.onWillRenameFiles(e => {
            const re = /\.ipynb$/;
            for (const file of e.files) {
                if (!re.exec(file.oldUri.toString())) {
                    continue;
                }
                // transfer cache to new uri
                if (this._attachmentCache.has(file.oldUri.toString())) {
                    this._attachmentCache.set(file.newUri.toString(), this._attachmentCache.get(file.oldUri.toString()));
                    this._attachmentCache.delete(file.oldUri.toString());
                }
            }
        }));
        this._disposables.push(vscode.workspace.onDidOpenTextDocument(e => {
            this.analyzeMissingAttachments(e);
        }));
        this._disposables.push(vscode.workspace.onDidCloseTextDocument(e => {
            this.analyzeMissingAttachments(e);
        }));
        vscode.workspace.textDocuments.forEach(document => {
            this.analyzeMissingAttachments(document);
        });
    }
    provideCodeActions(document, _range, context, _token) {
        const fixes = [];
        for (const diagnostic of context.diagnostics) {
            switch (diagnostic.code) {
                case DiagnosticCode.missing_attachment:
                    {
                        const fix = new vscode.CodeAction('Remove invalid image attachment reference', vscode.CodeActionKind.QuickFix);
                        fix.command = {
                            command: constants_1.ATTACHMENT_CLEANUP_COMMANDID,
                            title: 'Remove invalid image attachment reference',
                            arguments: [document.uri, diagnostic.range],
                        };
                        fixes.push(fix);
                    }
                    break;
            }
        }
        return fixes;
    }
    /**
     * take in a NotebookDocumentChangeEvent, and clean the attachment data for the cell(s) that have had their markdown source code changed
     * @param e NotebookDocumentChangeEvent from the onDidChangeNotebookDocument listener
     * @returns vscode.NotebookEdit, the metadata alteration performed on the json behind the ipynb
     */
    cleanNotebookAttachments(e) {
        if (e.notebook.isClosed) {
            return;
        }
        const document = e.document;
        const cell = e.cell;
        const markdownAttachmentsInUse = {};
        const cellFragment = cell.document.uri.fragment;
        const notebookUri = e.notebook.uri.toString();
        const diagnostics = [];
        const markdownAttachmentsRefedInCell = this.getAttachmentNames(document);
        if (markdownAttachmentsRefedInCell.size === 0) {
            // no attachments used in this cell, cache all images from cell metadata
            this.saveAllAttachmentsToCache(cell.metadata, notebookUri, cellFragment);
        }
        if (this.checkMetadataHasAttachmentsField(cell.metadata)) {
            // the cell metadata contains attachments, check if any are used in the markdown source
            for (const [currFilename, attachment] of Object.entries(cell.metadata.attachments)) {
                // means markdown reference is present in the metadata, rendering will work properly
                // therefore, we don't need to check it in the next loop either
                if (markdownAttachmentsRefedInCell.has(currFilename)) {
                    // attachment reference is present in the markdown source, no need to cache it
                    markdownAttachmentsRefedInCell.get(currFilename).valid = true;
                    markdownAttachmentsInUse[currFilename] = attachment;
                }
                else {
                    // attachment reference is not present in the markdown source, cache it
                    this.saveAttachmentToCache(notebookUri, cellFragment, currFilename, cell.metadata);
                }
            }
        }
        for (const [currFilename, attachment] of markdownAttachmentsRefedInCell) {
            if (attachment.valid) {
                // attachment reference is present in both the markdown source and the metadata, no op
                continue;
            }
            // if image is referenced in markdown source but not in metadata -> check if we have image in the cache
            const cachedImageAttachment = this._attachmentCache.get(notebookUri)?.get(cellFragment)?.get(currFilename);
            if (cachedImageAttachment) {
                markdownAttachmentsInUse[currFilename] = cachedImageAttachment;
                this._attachmentCache.get(notebookUri)?.get(cellFragment)?.delete(currFilename);
            }
            else {
                // if image is not in the cache, show warning
                diagnostics.push({ name: currFilename, ranges: attachment.ranges });
            }
        }
        this.updateDiagnostics(cell.document.uri, diagnostics);
        if (cell.index > -1 && !(0, helper_1.objectEquals)(markdownAttachmentsInUse, cell.metadata.attachments)) {
            const updateMetadata = (0, helper_1.deepClone)(cell.metadata);
            updateMetadata.attachments = markdownAttachmentsInUse;
            const metadataEdit = vscode.NotebookEdit.updateCellMetadata(cell.index, updateMetadata);
            return metadataEdit;
        }
        return;
    }
    analyzeMissingAttachments(document) {
        if (document.uri.scheme !== 'vscode-notebook-cell') {
            // not notebook
            return;
        }
        if (document.isClosed) {
            this.updateDiagnostics(document.uri, []);
            return;
        }
        let notebook;
        let activeCell;
        for (const notebookDocument of vscode.workspace.notebookDocuments) {
            const cell = notebookDocument.getCells().find(cell => cell.document === document);
            if (cell) {
                notebook = notebookDocument;
                activeCell = cell;
                break;
            }
        }
        if (!notebook || !activeCell) {
            return;
        }
        const diagnostics = [];
        const markdownAttachments = this.getAttachmentNames(document);
        if (this.checkMetadataHasAttachmentsField(activeCell.metadata)) {
            for (const [currFilename, attachment] of markdownAttachments) {
                if (!activeCell.metadata.attachments[currFilename]) {
                    // no attachment reference in the metadata
                    diagnostics.push({ name: currFilename, ranges: attachment.ranges });
                }
            }
        }
        this.updateDiagnostics(activeCell.document.uri, diagnostics);
    }
    updateDiagnostics(cellUri, diagnostics) {
        const vscodeDiagnostics = [];
        for (const currDiagnostic of diagnostics) {
            currDiagnostic.ranges.forEach(range => {
                const diagnostic = new vscode.Diagnostic(range, `The image named: '${currDiagnostic.name}' is not present in cell metadata.`, vscode.DiagnosticSeverity.Warning);
                diagnostic.code = DiagnosticCode.missing_attachment;
                vscodeDiagnostics.push(diagnostic);
            });
        }
        this._imageDiagnosticCollection.set(cellUri, vscodeDiagnostics);
    }
    /**
     * remove attachment from metadata and add it to the cache
     * @param notebookUri uri of the notebook currently being edited
     * @param cellFragment fragment of the cell currently being edited
     * @param currFilename filename of the image being pulled into the cell
     * @param metadata metadata of the cell currently being edited
     */
    saveAttachmentToCache(notebookUri, cellFragment, currFilename, metadata) {
        const documentCache = this._attachmentCache.get(notebookUri);
        if (!documentCache) {
            // no cache for this notebook yet
            const cellCache = new Map();
            cellCache.set(currFilename, this.getMetadataAttachment(metadata, currFilename));
            const documentCache = new Map();
            documentCache.set(cellFragment, cellCache);
            this._attachmentCache.set(notebookUri, documentCache);
        }
        else if (!documentCache.has(cellFragment)) {
            // no cache for this cell yet
            const cellCache = new Map();
            cellCache.set(currFilename, this.getMetadataAttachment(metadata, currFilename));
            documentCache.set(cellFragment, cellCache);
        }
        else {
            // cache for this cell already exists
            // add to cell cache
            documentCache.get(cellFragment)?.set(currFilename, this.getMetadataAttachment(metadata, currFilename));
        }
    }
    /**
     * get an attachment entry from the given metadata
     * @param metadata metadata to extract image data from
     * @param currFilename filename of image being extracted
     * @returns
     */
    getMetadataAttachment(metadata, currFilename) {
        return metadata.attachments[currFilename];
    }
    /**
     * returns a boolean that represents if there are any images in the attachment field of a cell's metadata
     * @param metadata metadata of cell
     * @returns boolean representing the presence of any attachments
     */
    checkMetadataHasAttachmentsField(metadata) {
        return !!metadata.attachments && typeof metadata.attachments === 'object';
    }
    /**
     * given metadata from a cell, cache every image (used in cases with no image links in markdown source)
     * @param metadata metadata for a cell with no images in markdown source
     * @param notebookUri uri for the notebook being edited
     * @param cellFragment fragment of cell being edited
     */
    saveAllAttachmentsToCache(metadata, notebookUri, cellFragment) {
        const documentCache = this._attachmentCache.get(notebookUri) ?? new Map();
        this._attachmentCache.set(notebookUri, documentCache);
        const cellCache = documentCache.get(cellFragment) ?? new Map();
        documentCache.set(cellFragment, cellCache);
        if (metadata.attachments && typeof metadata.attachments === 'object') {
            for (const [currFilename, attachment] of Object.entries(metadata.attachments)) {
                cellCache.set(currFilename, attachment);
            }
        }
    }
    /**
     * pass in all of the markdown source code, and get a dictionary of all images referenced in the markdown. keys are image filenames, values are render state
     * @param document the text document for the cell, formatted as a string
     */
    getAttachmentNames(document) {
        const source = document.getText();
        const filenames = new Map();
        const re = /!\[.*?\]\(<?attachment:(?<filename>.*?)>?\)/gm;
        let match;
        while ((match = re.exec(source))) {
            if (match.groups?.filename) {
                const index = match.index;
                const length = match[0].length;
                const startPosition = document.positionAt(index);
                const endPosition = document.positionAt(index + length);
                const range = new vscode.Range(startPosition, endPosition);
                const filename = filenames.get(match.groups.filename) ?? { valid: false, ranges: [] };
                filenames.set(match.groups.filename, filename);
                filename.ranges.push(range);
            }
        }
        return filenames;
    }
    dispose() {
        this._disposables.forEach(d => d.dispose());
        this._delayer.dispose();
    }
}
exports.AttachmentCleaner = AttachmentCleaner;


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Delayer = exports.objectEquals = exports.deepClone = void 0;
function deepClone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof RegExp) {
        // See https://github.com/microsoft/TypeScript/issues/10990
        return obj;
    }
    const result = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
            result[key] = deepClone(obj[key]);
        }
        else {
            result[key] = obj[key];
        }
    });
    return result;
}
exports.deepClone = deepClone;
// from https://github.com/microsoft/vscode/blob/43ae27a30e7b5e8711bf6b218ee39872ed2b8ef6/src/vs/base/common/objects.ts#L117
function objectEquals(one, other) {
    if (one === other) {
        return true;
    }
    if (one === null || one === undefined || other === null || other === undefined) {
        return false;
    }
    if (typeof one !== typeof other) {
        return false;
    }
    if (typeof one !== 'object') {
        return false;
    }
    if ((Array.isArray(one)) !== (Array.isArray(other))) {
        return false;
    }
    let i;
    let key;
    if (Array.isArray(one)) {
        if (one.length !== other.length) {
            return false;
        }
        for (i = 0; i < one.length; i++) {
            if (!objectEquals(one[i], other[i])) {
                return false;
            }
        }
    }
    else {
        const oneKeys = [];
        for (key in one) {
            oneKeys.push(key);
        }
        oneKeys.sort();
        const otherKeys = [];
        for (key in other) {
            otherKeys.push(key);
        }
        otherKeys.sort();
        if (!objectEquals(oneKeys, otherKeys)) {
            return false;
        }
        for (i = 0; i < oneKeys.length; i++) {
            if (!objectEquals(one[oneKeys[i]], other[oneKeys[i]])) {
                return false;
            }
        }
    }
    return true;
}
exports.objectEquals = objectEquals;
/**
 * A helper to delay/debounce execution of a task, includes cancellation/disposal support.
 * Pulled from https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/extensions/markdown-language-features/src/util/async.ts
 */
class Delayer {
    constructor(defaultDelay) {
        this.defaultDelay = defaultDelay;
        this._timeout = null;
        this._cancelTimeout = null;
        this._onSuccess = null;
        this._task = null;
    }
    dispose() {
        this._doCancelTimeout();
    }
    trigger(task, delay = this.defaultDelay) {
        this._task = task;
        if (delay >= 0) {
            this._doCancelTimeout();
        }
        if (!this._cancelTimeout) {
            this._cancelTimeout = new Promise((resolve) => {
                this._onSuccess = resolve;
            }).then(() => {
                this._cancelTimeout = null;
                this._onSuccess = null;
                const result = this._task && this._task?.();
                this._task = null;
                return result;
            });
        }
        if (delay >= 0 || this._timeout === null) {
            this._timeout = setTimeout(() => {
                this._timeout = null;
                this._onSuccess?.(undefined);
            }, delay >= 0 ? delay : this.defaultDelay);
        }
        return this._cancelTimeout;
    }
    _doCancelTimeout() {
        if (this._timeout !== null) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }
}
exports.Delayer = Delayer;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const notebookSerializer_1 = __webpack_require__(2);
const cellIdService_1 = __webpack_require__(8);
const notebookImagePaste_1 = __webpack_require__(24);
const notebookAttachmentCleaner_1 = __webpack_require__(26);
function activate(context) {
    const serializer = new notebookSerializer_1.NotebookSerializer(context);
    (0, cellIdService_1.ensureAllNewCellsHaveCellIds)(context);
    context.subscriptions.push(vscode.workspace.registerNotebookSerializer('jupyter-notebook', serializer, {
        transientOutputs: false,
        transientCellMetadata: {
            breakpointMargin: true,
            custom: false,
            attachments: false
        },
        cellContentMetadata: {
            attachments: true
        }
    }));
    vscode.languages.registerCodeLensProvider({ pattern: '**/*.ipynb' }, {
        provideCodeLenses: (document) => {
            if (document.uri.scheme === 'vscode-notebook-cell' ||
                document.uri.scheme === 'vscode-notebook-cell-metadata' ||
                document.uri.scheme === 'vscode-notebook-cell-output') {
                return [];
            }
            const codelens = new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), { title: 'Open in Notebook Editor', command: 'ipynb.openIpynbInNotebookEditor', arguments: [document.uri] });
            return [codelens];
        }
    });
    context.subscriptions.push(vscode.commands.registerCommand('ipynb.newUntitledIpynb', async () => {
        const language = 'python';
        const cell = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, '', language);
        const data = new vscode.NotebookData([cell]);
        data.metadata = {
            custom: {
                cells: [],
                metadata: {
                    orig_nbformat: 4
                },
                nbformat: 4,
                nbformat_minor: 2
            }
        };
        const doc = await vscode.workspace.openNotebookDocument('jupyter-notebook', data);
        await vscode.window.showNotebookDocument(doc);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('ipynb.openIpynbInNotebookEditor', async (uri) => {
        if (vscode.window.activeTextEditor?.document.uri.toString() === uri.toString()) {
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        }
        const document = await vscode.workspace.openNotebookDocument(uri);
        await vscode.window.showNotebookDocument(document);
    }));
    context.subscriptions.push((0, notebookImagePaste_1.notebookImagePasteSetup)());
    const enabled = vscode.workspace.getConfiguration('ipynb').get('pasteImagesAsAttachments.enabled', false);
    if (enabled) {
        const cleaner = new notebookAttachmentCleaner_1.AttachmentCleaner();
        context.subscriptions.push(cleaner);
    }
    // Update new file contribution
    vscode.extensions.onDidChange(() => {
        vscode.commands.executeCommand('setContext', 'jupyterEnabled', vscode.extensions.getExtension('ms-toolsai.jupyter'));
    });
    vscode.commands.executeCommand('setContext', 'jupyterEnabled', vscode.extensions.getExtension('ms-toolsai.jupyter'));
    return {
        exportNotebook: (notebook) => {
            return exportNotebook(notebook, serializer);
        },
        setNotebookMetadata: async (resource, metadata) => {
            const document = vscode.workspace.notebookDocuments.find(doc => doc.uri.toString() === resource.toString());
            if (!document) {
                return false;
            }
            const edit = new vscode.WorkspaceEdit();
            edit.set(resource, [vscode.NotebookEdit.updateNotebookMetadata({
                    ...document.metadata,
                    custom: {
                        ...(document.metadata.custom ?? {}),
                        metadata: {
                            ...(document.metadata.custom?.metadata ?? {}),
                            ...metadata
                        },
                    }
                })]);
            return vscode.workspace.applyEdit(edit);
        },
    };
}
exports.activate = activate;
function exportNotebook(notebook, serializer) {
    return serializer.serializeNotebookToString(notebook);
}
function deactivate() { }
exports.deactivate = deactivate;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=ipynbMain.js.map