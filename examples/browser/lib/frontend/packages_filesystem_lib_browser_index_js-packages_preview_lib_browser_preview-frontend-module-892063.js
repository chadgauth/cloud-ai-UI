(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_filesystem_lib_browser_index_js-packages_preview_lib_browser_preview-frontend-module-892063"],{

/***/ "../../packages/core/shared/markdown-it.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/markdown-it.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! markdown-it */ "../../node_modules/markdown-it/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/markdown-it'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/index.js":
/*!******************************************************!*\
  !*** ../../packages/filesystem/lib/browser/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./location */ "../../packages/filesystem/lib/browser/location/index.js"), exports);
__exportStar(__webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js"), exports);
__exportStar(__webpack_require__(/*! ./file-dialog */ "../../packages/filesystem/lib/browser/file-dialog/index.js"), exports);
__exportStar(__webpack_require__(/*! ./filesystem-preferences */ "../../packages/filesystem/lib/browser/filesystem-preferences.js"), exports);
__exportStar(__webpack_require__(/*! ./file-resource */ "../../packages/filesystem/lib/browser/file-resource.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser'] = this;


/***/ }),

/***/ "../../packages/preview/lib/browser/markdown/index.js":
/*!************************************************************!*\
  !*** ../../packages/preview/lib/browser/markdown/index.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./markdown-preview-handler */ "../../packages/preview/lib/browser/markdown/markdown-preview-handler.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/markdown'] = this;


/***/ }),

/***/ "../../packages/preview/lib/browser/markdown/markdown-preview-handler.js":
/*!*******************************************************************************!*\
  !*** ../../packages/preview/lib/browser/markdown/markdown-preview-handler.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MarkdownPreviewHandler = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const path_1 = __webpack_require__(/*! @theia/core/lib/common/path */ "../../packages/core/lib/common/path.js");
const hljs = __webpack_require__(/*! highlight.js */ "../../node_modules/highlight.js/lib/index.js");
const markdownit = __webpack_require__(/*! @theia/core/shared/markdown-it */ "../../packages/core/shared/markdown-it.js");
const anchor = __webpack_require__(/*! markdown-it-anchor */ "../../node_modules/markdown-it-anchor/index.js");
const DOMPurify = __webpack_require__(/*! @theia/core/shared/dompurify */ "../../packages/core/shared/dompurify/index.js");
const preview_uri_1 = __webpack_require__(/*! ../preview-uri */ "../../packages/preview/lib/browser/preview-uri.js");
const preview_handler_1 = __webpack_require__(/*! ../preview-handler */ "../../packages/preview/lib/browser/preview-handler.js");
const preview_link_normalizer_1 = __webpack_require__(/*! ../preview-link-normalizer */ "../../packages/preview/lib/browser/preview-link-normalizer.js");
let MarkdownPreviewHandler = class MarkdownPreviewHandler {
    constructor() {
        this.iconClass = 'markdown-icon file-icon';
        this.contentClass = 'markdown-preview';
    }
    canHandle(uri) {
        return uri.scheme === 'file'
            && (uri.path.ext.toLowerCase() === '.md' ||
                uri.path.ext.toLowerCase() === '.markdown') ? 500 : 0;
    }
    renderContent(params) {
        const content = params.content;
        const renderedContent = this.getEngine().render(content, params);
        const contentElement = document.createElement('div');
        contentElement.classList.add(this.contentClass);
        contentElement.innerHTML = DOMPurify.sanitize(renderedContent);
        this.addLinkClickedListener(contentElement, params);
        return contentElement;
    }
    addLinkClickedListener(contentElement, params) {
        contentElement.addEventListener('click', (event) => {
            const candidate = (event.target || event.srcElement);
            const link = this.findLink(candidate, contentElement);
            if (link) {
                event.preventDefault();
                if (link.startsWith('#')) {
                    this.revealFragment(contentElement, link);
                }
                else {
                    const preview = !(common_1.isOSX ? event.metaKey : event.ctrlKey);
                    const uri = this.resolveUri(link, params.originUri, preview);
                    this.openLink(uri, params.originUri);
                }
            }
        });
    }
    findLink(element, container) {
        let candidate = element;
        while (candidate.tagName !== 'A') {
            if (candidate === container) {
                return;
            }
            candidate = candidate.parentElement;
            if (!candidate) {
                return;
            }
        }
        return candidate.getAttribute('href') || undefined;
    }
    async openLink(uri, originUri) {
        const opener = await this.openerService.getOpener(uri);
        opener.open(uri, { originUri });
    }
    resolveUri(link, uri, preview) {
        const linkURI = new uri_1.default(link);
        // URIs are always absolute, check link as a path whether it is relative
        if (!new path_1.Path(link).isAbsolute && linkURI.scheme === uri.scheme &&
            (!linkURI.authority || linkURI.authority === uri.authority)) {
            // get a relative path from URI by trimming leading `/`
            const relativePath = linkURI.path.toString().substring(1);
            const resolvedUri = uri.parent.resolve(relativePath).withFragment(linkURI.fragment).withQuery(linkURI.query);
            return preview ? preview_uri_1.PreviewUri.encode(resolvedUri) : resolvedUri;
        }
        return linkURI;
    }
    revealFragment(contentElement, fragment) {
        const elementToReveal = this.findElementForFragment(contentElement, fragment);
        if (!elementToReveal) {
            return;
        }
        elementToReveal.scrollIntoView();
    }
    findElementForFragment(content, link) {
        const fragment = link.startsWith('#') ? link.substring(1) : link;
        const filter = {
            acceptNode: (node) => {
                if (node instanceof HTMLHeadingElement) {
                    if (node.tagName.toLowerCase().startsWith('h') && node.id === fragment) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
                return NodeFilter.FILTER_SKIP;
            }
        };
        const treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_ELEMENT, filter);
        if (treeWalker.nextNode()) {
            const element = treeWalker.currentNode;
            return element;
        }
        return undefined;
    }
    findElementForSourceLine(content, sourceLine) {
        const markedElements = content.getElementsByClassName('line');
        let matchedElement;
        for (let i = 0; i < markedElements.length; i++) {
            const element = markedElements[i];
            const line = Number.parseInt(element.getAttribute('data-line') || '0');
            if (line > sourceLine) {
                break;
            }
            matchedElement = element;
        }
        return matchedElement;
    }
    getSourceLineForOffset(content, offset) {
        const lineElements = this.getLineElementsAtOffset(content, offset);
        if (lineElements.length < 1) {
            return undefined;
        }
        const firstLineNumber = this.getLineNumberFromAttribute(lineElements[0]);
        if (firstLineNumber === undefined) {
            return undefined;
        }
        if (lineElements.length === 1) {
            return firstLineNumber;
        }
        const secondLineNumber = this.getLineNumberFromAttribute(lineElements[1]);
        if (secondLineNumber === undefined) {
            return firstLineNumber;
        }
        const y1 = lineElements[0].offsetTop;
        const y2 = lineElements[1].offsetTop;
        const dY = (offset - y1) / (y2 - y1);
        const dL = (secondLineNumber - firstLineNumber) * dY;
        const line = firstLineNumber + Math.floor(dL);
        return line;
    }
    /**
     * returns two significant line elements for the given offset.
     */
    getLineElementsAtOffset(content, offset) {
        let skipNext = false;
        const filter = {
            acceptNode: (node) => {
                if (node instanceof HTMLElement) {
                    if (node.classList.contains('line')) {
                        if (skipNext) {
                            return NodeFilter.FILTER_SKIP;
                        }
                        if (node.offsetTop > offset) {
                            skipNext = true;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
                return NodeFilter.FILTER_REJECT;
            }
        };
        const treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_ELEMENT, filter);
        const lineElements = [];
        while (treeWalker.nextNode()) {
            const element = treeWalker.currentNode;
            lineElements.push(element);
        }
        return lineElements.slice(-2);
    }
    getLineNumberFromAttribute(element) {
        const attribute = element.getAttribute('data-line');
        return attribute ? Number.parseInt(attribute) : undefined;
    }
    getEngine() {
        if (!this.engine) {
            const engine = this.engine = markdownit({
                html: true,
                linkify: true,
                highlight: (str, lang) => {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return '<pre class="hljs"><code><div>' + hljs.highlight(lang, str, true).value + '</div></code></pre>';
                        }
                        catch { }
                    }
                    return '<pre class="hljs"><code><div>' + engine.utils.escapeHtml(str) + '</div></code></pre>';
                }
            });
            const renderers = ['heading_open', 'paragraph_open', 'list_item_open', 'blockquote_open', 'code_block', 'image', 'fence'];
            for (const renderer of renderers) {
                const originalRenderer = engine.renderer.rules[renderer];
                engine.renderer.rules[renderer] = (tokens, index, options, env, self) => {
                    const token = tokens[index];
                    if (token.map) {
                        const line = token.map[0];
                        token.attrJoin('class', 'line');
                        token.attrSet('data-line', line.toString());
                    }
                    return (originalRenderer)
                        // tslint:disable-next-line:no-void-expression
                        ? originalRenderer(tokens, index, options, env, self)
                        : self.renderToken(tokens, index, options);
                };
            }
            const originalImageRenderer = engine.renderer.rules.image;
            if (originalImageRenderer) {
                engine.renderer.rules.image = (tokens, index, options, env, self) => {
                    if (preview_handler_1.RenderContentParams.is(env)) {
                        const documentUri = env.originUri;
                        const token = tokens[index];
                        if (token.attrs) {
                            const srcAttr = token.attrs.find(a => a[0] === 'src');
                            if (srcAttr) {
                                const href = srcAttr[1];
                                srcAttr[1] = this.linkNormalizer.normalizeLink(documentUri, href);
                            }
                        }
                    }
                    return originalImageRenderer(tokens, index, options, env, self);
                };
            }
            const domParser = new DOMParser();
            const parseDOM = (html) => domParser.parseFromString(html, 'text/html').getElementsByTagName('body')[0];
            const modifyDOM = (body, tag, procedure) => {
                const elements = body.getElementsByTagName(tag);
                for (let i = 0; i < elements.length; i++) {
                    const element = elements.item(i);
                    if (element) {
                        procedure(element);
                    }
                }
            };
            const normalizeAllImgSrcInHTML = (html, normalizeLink) => {
                const body = parseDOM(html);
                modifyDOM(body, 'img', img => {
                    const src = img.getAttributeNode('src');
                    if (src) {
                        src.nodeValue = normalizeLink(src.nodeValue || '');
                    }
                });
                return body.innerHTML;
            };
            for (const name of ['html_block', 'html_inline']) {
                const originalRenderer = engine.renderer.rules[name];
                if (originalRenderer) {
                    engine.renderer.rules[name] = (tokens, index, options, env, self) => {
                        const currentToken = tokens[index];
                        const content = currentToken.content;
                        if (content.includes('<img') && preview_handler_1.RenderContentParams.is(env)) {
                            const documentUri = env.originUri;
                            currentToken.content = normalizeAllImgSrcInHTML(content, link => this.linkNormalizer.normalizeLink(documentUri, link));
                        }
                        return originalRenderer(tokens, index, options, env, self);
                    };
                }
            }
            anchor(engine, {});
        }
        return this.engine;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], MarkdownPreviewHandler.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(preview_link_normalizer_1.PreviewLinkNormalizer),
    __metadata("design:type", preview_link_normalizer_1.PreviewLinkNormalizer)
], MarkdownPreviewHandler.prototype, "linkNormalizer", void 0);
MarkdownPreviewHandler = __decorate([
    (0, inversify_1.injectable)()
], MarkdownPreviewHandler);
exports.MarkdownPreviewHandler = MarkdownPreviewHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/markdown/markdown-preview-handler'] = this;


/***/ }),

/***/ "../../packages/preview/lib/browser/preview-frontend-module.js":
/*!*********************************************************************!*\
  !*** ../../packages/preview/lib/browser/preview-frontend-module.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const preview_contribution_1 = __webpack_require__(/*! ./preview-contribution */ "../../packages/preview/lib/browser/preview-contribution.js");
const preview_widget_1 = __webpack_require__(/*! ./preview-widget */ "../../packages/preview/lib/browser/preview-widget.js");
const preview_handler_1 = __webpack_require__(/*! ./preview-handler */ "../../packages/preview/lib/browser/preview-handler.js");
const preview_uri_1 = __webpack_require__(/*! ./preview-uri */ "../../packages/preview/lib/browser/preview-uri.js");
const markdown_1 = __webpack_require__(/*! ./markdown */ "../../packages/preview/lib/browser/markdown/index.js");
const preview_preferences_1 = __webpack_require__(/*! ./preview-preferences */ "../../packages/preview/lib/browser/preview-preferences.js");
const preview_link_normalizer_1 = __webpack_require__(/*! ./preview-link-normalizer */ "../../packages/preview/lib/browser/preview-link-normalizer.js");
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/preview/src/browser/style/index.css");
__webpack_require__(/*! ../../src/browser/markdown/style/index.css */ "../../packages/preview/src/browser/markdown/style/index.css");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, preview_preferences_1.bindPreviewPreferences)(bind);
    bind(preview_handler_1.PreviewHandlerProvider).toSelf().inSingletonScope();
    (0, common_1.bindContributionProvider)(bind, preview_handler_1.PreviewHandler);
    bind(markdown_1.MarkdownPreviewHandler).toSelf().inSingletonScope();
    bind(preview_handler_1.PreviewHandler).toService(markdown_1.MarkdownPreviewHandler);
    bind(preview_link_normalizer_1.PreviewLinkNormalizer).toSelf().inSingletonScope();
    bind(preview_widget_1.PreviewWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: preview_uri_1.PreviewUri.id,
        async createWidget(options) {
            const { container } = ctx;
            const resource = await container.get(common_1.ResourceProvider)(new uri_1.default(options.uri));
            const child = container.createChild();
            child.bind(preview_widget_1.PreviewWidgetOptions).toConstantValue({ resource });
            return child.get(preview_widget_1.PreviewWidget);
        }
    })).inSingletonScope();
    bind(preview_contribution_1.PreviewContribution).toSelf().inSingletonScope();
    [common_1.CommandContribution, common_1.MenuContribution, browser_1.OpenHandler, browser_1.FrontendApplicationContribution, tab_bar_toolbar_1.TabBarToolbarContribution].forEach(serviceIdentifier => bind(serviceIdentifier).toService(preview_contribution_1.PreviewContribution));
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/preview-frontend-module'] = this;


/***/ }),

/***/ "../../packages/preview/lib/browser/preview-link-normalizer.js":
/*!*********************************************************************!*\
  !*** ../../packages/preview/lib/browser/preview-link-normalizer.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreviewLinkNormalizer = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const mini_browser_environment_1 = __webpack_require__(/*! @theia/mini-browser/lib/browser/environment/mini-browser-environment */ "../../packages/mini-browser/lib/browser/environment/mini-browser-environment.js");
let PreviewLinkNormalizer = class PreviewLinkNormalizer {
    constructor() {
        this.urlScheme = new RegExp('^[a-z][a-z|0-9|\+|\-|\.]*:', 'i');
    }
    normalizeLink(documentUri, link) {
        try {
            if (!this.urlScheme.test(link)) {
                const location = documentUri.parent.resolve(link).path.toString();
                return this.miniBrowserEnvironment.getEndpoint('normalized-link').getRestUrl().resolve(location).toString();
            }
        }
        catch {
            // ignore
        }
        return link;
    }
};
__decorate([
    (0, inversify_1.inject)(mini_browser_environment_1.MiniBrowserEnvironment),
    __metadata("design:type", mini_browser_environment_1.MiniBrowserEnvironment)
], PreviewLinkNormalizer.prototype, "miniBrowserEnvironment", void 0);
PreviewLinkNormalizer = __decorate([
    (0, inversify_1.injectable)()
], PreviewLinkNormalizer);
exports.PreviewLinkNormalizer = PreviewLinkNormalizer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preview/lib/browser/preview-link-normalizer'] = this;


/***/ }),

/***/ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common sync recursive":
/*!*****************************************************************************!*\
  !*** ../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/ sync ***!
  \*****************************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/index.css":
/*!*************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/index.css ***!
  \*************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_markdown_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../../../../node_modules/css-loader/dist/cjs.js!./markdown.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/markdown.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_tomorrow_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! -!../../../../../../node_modules/css-loader/dist/cjs.js!./tomorrow.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/tomorrow.css");
// Imports




var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_markdown_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_tomorrow_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
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
`, "",{"version":3,"sources":["webpack://./../../packages/preview/src/browser/markdown/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n@import \"./markdown.css\";\n@import \"./tomorrow.css\";\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/markdown.css":
/*!****************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/markdown.css ***!
  \****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.markdown-preview {
  font-family: var(--theia-ui-font-family);
  font-size: 14px;
  padding: 0 26px;
  line-height: var(--theia-content-line-height);
  word-wrap: break-word;
}

.markdown-preview:focus {
  outline: 0;
  box-shadow: none;
}

.markdown-preview .line {
  position: relative;
}

.markdown-preview .line:hover:before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: -12px;
  height: 100%;
}

.markdown-preview li.line:hover:before {
  left: -30px;
}

.markdown-preview .line:hover:before {
  border-left: 3px solid var(--theia-editor-foreground);
}

.markdown-preview .line .line:hover:before {
  border-left: none;
}

.markdown-preview img {
  max-width: 100%;
  max-height: 100%;
}

.markdown-preview a {
  text-decoration: none;
}

.markdown-preview a:hover {
  text-decoration: underline;
}

.markdown-preview a:focus,
.markdown-preview input:focus,
.markdown-preview select:focus,
.markdown-preview textarea:focus {
  outline: 1px solid -webkit-focus-ring-color;
  outline-offset: -1px;
}

.markdown-preview hr {
  border: 0;
  height: 2px;
  border-bottom: 2px solid;
}

.markdown-preview h1 {
  padding-bottom: 0.3em;
  line-height: 1.2;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.markdown-preview h1,
h2,
h3 {
  font-weight: normal;
}

.markdown-preview h1 code,
.markdown-preview h2 code,
.markdown-preview h3 code,
.markdown-preview h4 code,
.markdown-preview h5 code,
.markdown-preview h6 code {
  font-size: inherit;
  line-height: auto;
}

.markdown-preview table {
  border-collapse: collapse;
}

.markdown-preview table > thead > tr > th {
  text-align: left;
  border-bottom: 1px solid;
  border-color: rgba(255, 255, 255, 0.69);
}

.theia-light .markdown-preview table > thead > tr > th {
  border-color: rgba(0, 0, 0, 0.69);
}

.markdown-preview table > thead > tr > th,
.markdown-preview table > thead > tr > td,
.markdown-preview table > tbody > tr > th,
.markdown-preview table > tbody > tr > td {
  padding: 5px 10px;
}

.markdown-preview table > tbody > tr + tr > td {
  border-top: 1px solid;
}

.markdown-preview blockquote {
  margin: 0 7px 0 5px;
  padding: 0 16px 0 10px;
  border-left: 5px solid;
  background: var(--theia-textBlockQuote-background);
  border-color: var(--theia-textBlockQuote-border);
}

.markdown-preview code {
  font-family: var(--theia-code-font-family);
  font-size: var(--theia-code-font-size);
  line-height: var(--theia-code-line-height);
  color: var(--md-orange-800);
}

.markdown-preview.wordWrap pre {
  white-space: pre-wrap;
}

.markdown-preview pre:not(.hljs),
.markdown-preview pre.hljs code > div {
  padding: 16px;
  border-radius: 3px;
  overflow: auto;
}

.markdown-preview,
.markdown-preview pre code {
  color: var(--theia-editor-foreground);
  tab-size: 4;
}

/** Theming */

.theia-light .markdown-preview pre {
  background-color: rgba(220, 220, 220, 0.4);
}

.theia-dark .markdown-preview pre {
  background-color: rgba(10, 10, 10, 0.4);
}

.theia-high-contrast .markdown-preview pre {
  background-color: rgb(0, 0, 0);
}

.vscode-high-contrast .markdown-preview h1 {
  border-color: rgb(0, 0, 0);
}

.theia-light .markdown-preview table > thead > tr > th {
  border-color: rgba(0, 0, 0, 0.69);
}

.theia-dark .markdown-preview table > thead > tr > th {
  border-color: rgba(255, 255, 255, 0.69);
}

.theia-light .markdown-preview h1,
.theia-light .markdown-preview hr,
.theia-light .markdown-preview table > tbody > tr + tr > td {
  border-color: rgba(0, 0, 0, 0.18);
}

.theia-dark .markdown-preview h1,
.theia-dark .markdown-preview hr,
.theia-dark .markdown-preview table > tbody > tr + tr > td {
  border-color: rgba(255, 255, 255, 0.18);
}
`, "",{"version":3,"sources":["webpack://./../../packages/preview/src/browser/markdown/style/markdown.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;;;+FAG+F;;AAE/F;EACE,wCAAwC;EACxC,eAAe;EACf,eAAe;EACf,6CAA6C;EAC7C,qBAAqB;AACvB;;AAEA;EACE,UAAU;EACV,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,WAAW;EACX,cAAc;EACd,kBAAkB;EAClB,MAAM;EACN,WAAW;EACX,YAAY;AACd;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,eAAe;EACf,gBAAgB;AAClB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;;;;EAIE,2CAA2C;EAC3C,oBAAoB;AACtB;;AAEA;EACE,SAAS;EACT,WAAW;EACX,wBAAwB;AAC1B;;AAEA;EACE,qBAAqB;EACrB,gBAAgB;EAChB,wBAAwB;EACxB,0BAA0B;AAC5B;;AAEA;;;EAGE,mBAAmB;AACrB;;AAEA;;;;;;EAME,kBAAkB;EAClB,iBAAiB;AACnB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,gBAAgB;EAChB,wBAAwB;EACxB,uCAAuC;AACzC;;AAEA;EACE,iCAAiC;AACnC;;AAEA;;;;EAIE,iBAAiB;AACnB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,mBAAmB;EACnB,sBAAsB;EACtB,sBAAsB;EACtB,kDAAkD;EAClD,gDAAgD;AAClD;;AAEA;EACE,0CAA0C;EAC1C,sCAAsC;EACtC,0CAA0C;EAC1C,2BAA2B;AAC7B;;AAEA;EACE,qBAAqB;AACvB;;AAEA;;EAEE,aAAa;EACb,kBAAkB;EAClB,cAAc;AAChB;;AAEA;;EAEE,qCAAqC;EACrC,WAAW;AACb;;AAEA,aAAa;;AAEb;EACE,0CAA0C;AAC5C;;AAEA;EACE,uCAAuC;AACzC;;AAEA;EACE,8BAA8B;AAChC;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE,uCAAuC;AACzC;;AAEA;;;EAGE,iCAAiC;AACnC;;AAEA;;;EAGE,uCAAuC;AACzC","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\n.markdown-preview {\n  font-family: var(--theia-ui-font-family);\n  font-size: 14px;\n  padding: 0 26px;\n  line-height: var(--theia-content-line-height);\n  word-wrap: break-word;\n}\n\n.markdown-preview:focus {\n  outline: 0;\n  box-shadow: none;\n}\n\n.markdown-preview .line {\n  position: relative;\n}\n\n.markdown-preview .line:hover:before {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: 0;\n  left: -12px;\n  height: 100%;\n}\n\n.markdown-preview li.line:hover:before {\n  left: -30px;\n}\n\n.markdown-preview .line:hover:before {\n  border-left: 3px solid var(--theia-editor-foreground);\n}\n\n.markdown-preview .line .line:hover:before {\n  border-left: none;\n}\n\n.markdown-preview img {\n  max-width: 100%;\n  max-height: 100%;\n}\n\n.markdown-preview a {\n  text-decoration: none;\n}\n\n.markdown-preview a:hover {\n  text-decoration: underline;\n}\n\n.markdown-preview a:focus,\n.markdown-preview input:focus,\n.markdown-preview select:focus,\n.markdown-preview textarea:focus {\n  outline: 1px solid -webkit-focus-ring-color;\n  outline-offset: -1px;\n}\n\n.markdown-preview hr {\n  border: 0;\n  height: 2px;\n  border-bottom: 2px solid;\n}\n\n.markdown-preview h1 {\n  padding-bottom: 0.3em;\n  line-height: 1.2;\n  border-bottom-width: 1px;\n  border-bottom-style: solid;\n}\n\n.markdown-preview h1,\nh2,\nh3 {\n  font-weight: normal;\n}\n\n.markdown-preview h1 code,\n.markdown-preview h2 code,\n.markdown-preview h3 code,\n.markdown-preview h4 code,\n.markdown-preview h5 code,\n.markdown-preview h6 code {\n  font-size: inherit;\n  line-height: auto;\n}\n\n.markdown-preview table {\n  border-collapse: collapse;\n}\n\n.markdown-preview table > thead > tr > th {\n  text-align: left;\n  border-bottom: 1px solid;\n  border-color: rgba(255, 255, 255, 0.69);\n}\n\n.theia-light .markdown-preview table > thead > tr > th {\n  border-color: rgba(0, 0, 0, 0.69);\n}\n\n.markdown-preview table > thead > tr > th,\n.markdown-preview table > thead > tr > td,\n.markdown-preview table > tbody > tr > th,\n.markdown-preview table > tbody > tr > td {\n  padding: 5px 10px;\n}\n\n.markdown-preview table > tbody > tr + tr > td {\n  border-top: 1px solid;\n}\n\n.markdown-preview blockquote {\n  margin: 0 7px 0 5px;\n  padding: 0 16px 0 10px;\n  border-left: 5px solid;\n  background: var(--theia-textBlockQuote-background);\n  border-color: var(--theia-textBlockQuote-border);\n}\n\n.markdown-preview code {\n  font-family: var(--theia-code-font-family);\n  font-size: var(--theia-code-font-size);\n  line-height: var(--theia-code-line-height);\n  color: var(--md-orange-800);\n}\n\n.markdown-preview.wordWrap pre {\n  white-space: pre-wrap;\n}\n\n.markdown-preview pre:not(.hljs),\n.markdown-preview pre.hljs code > div {\n  padding: 16px;\n  border-radius: 3px;\n  overflow: auto;\n}\n\n.markdown-preview,\n.markdown-preview pre code {\n  color: var(--theia-editor-foreground);\n  tab-size: 4;\n}\n\n/** Theming */\n\n.theia-light .markdown-preview pre {\n  background-color: rgba(220, 220, 220, 0.4);\n}\n\n.theia-dark .markdown-preview pre {\n  background-color: rgba(10, 10, 10, 0.4);\n}\n\n.theia-high-contrast .markdown-preview pre {\n  background-color: rgb(0, 0, 0);\n}\n\n.vscode-high-contrast .markdown-preview h1 {\n  border-color: rgb(0, 0, 0);\n}\n\n.theia-light .markdown-preview table > thead > tr > th {\n  border-color: rgba(0, 0, 0, 0.69);\n}\n\n.theia-dark .markdown-preview table > thead > tr > th {\n  border-color: rgba(255, 255, 255, 0.69);\n}\n\n.theia-light .markdown-preview h1,\n.theia-light .markdown-preview hr,\n.theia-light .markdown-preview table > tbody > tr + tr > td {\n  border-color: rgba(0, 0, 0, 0.18);\n}\n\n.theia-dark .markdown-preview h1,\n.theia-dark .markdown-preview hr,\n.theia-dark .markdown-preview table > tbody > tr + tr > td {\n  border-color: rgba(255, 255, 255, 0.18);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/tomorrow.css":
/*!****************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/tomorrow.css ***!
  \****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
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

/* Tomorrow Theme */
/* http://jmblog.github.com/color-themes-for-google-code-highlightjs */

/* Original theme - Copyright (C) 2013 Chris Kempson http://chriskempson.com
/* released under the MIT License */
/* https://github.com/chriskempson/tomorrow-theme */

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Copied from https://github.com/microsoft/vscode/blob/08537497eecd3172390194693d3d7c0ec8f52b70/extensions/markdown-language-features/media/tomorrow.css
 * with modifications.
 */

/* This theme is used to style the output of the highlight.js library which is
 * licensed under the BSD-3-Clause. See https://github.com/highlightjs/highlight.js/blob/master/LICENSE
 */

/* Tomorrow Comment */
.theia-preview-widget .hljs-comment,
.theia-preview-widget .hljs-quote {
  color: #8e908c;
}

/* Tomorrow Red */
.theia-preview-widget .hljs-variable,
.theia-preview-widget .hljs-template-variable,
.theia-preview-widget .hljs-tag,
.theia-preview-widget .hljs-name,
.theia-preview-widget .hljs-selector-id,
.theia-preview-widget .hljs-selector-class,
.theia-preview-widget .hljs-regexp,
.theia-preview-widget .hljs-deletion {
  color: #c82829;
}

/* Tomorrow Orange */
.theia-preview-widget .hljs-number,
.theia-preview-widget .hljs-built_in,
.theia-preview-widget .hljs-builtin-name,
.theia-preview-widget .hljs-literal,
.theia-preview-widget .hljs-type,
.theia-preview-widget .hljs-params,
.theia-preview-widget .hljs-meta,
.theia-preview-widget .hljs-link {
  color: #f5871f;
}

/* Tomorrow Yellow */
.theia-preview-widget .hljs-attribute {
  color: #eab700;
}

/* Tomorrow Green */
.theia-preview-widget .hljs-string,
.theia-preview-widget .hljs-symbol,
.theia-preview-widget .hljs-bullet,
.theia-preview-widget .hljs-addition {
  color: #718c00;
}

/* Tomorrow Blue */
.theia-preview-widget .hljs-title,
.theia-preview-widget .hljs-section {
  color: #4271ae;
}

/* Tomorrow Purple */
.theia-preview-widget .hljs-keyword,
.theia-preview-widget .hljs-selector-tag {
  color: #8959a8;
}

.theia-preview-widget .hljs {
  display: block;
  overflow-x: auto;
  color: #4d4d4c;
  padding: 0.5em;
}

.theia-preview-widget .hljs-emphasis {
  font-style: italic;
}

.theia-preview-widget .hljs-strong {
  font-weight: bold;
}
`, "",{"version":3,"sources":["webpack://./../../packages/preview/src/browser/markdown/style/tomorrow.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF,mBAAmB;AACnB,sEAAsE;;AAEtE;mCACmC;AACnC,mDAAmD;;AAEnD;;;+FAG+F;;AAE/F;;EAEE;;AAEF;;EAEE;;AAEF,qBAAqB;AACrB;;EAEE,cAAc;AAChB;;AAEA,iBAAiB;AACjB;;;;;;;;EAQE,cAAc;AAChB;;AAEA,oBAAoB;AACpB;;;;;;;;EAQE,cAAc;AAChB;;AAEA,oBAAoB;AACpB;EACE,cAAc;AAChB;;AAEA,mBAAmB;AACnB;;;;EAIE,cAAc;AAChB;;AAEA,kBAAkB;AAClB;;EAEE,cAAc;AAChB;;AAEA,oBAAoB;AACpB;;EAEE,cAAc;AAChB;;AAEA;EACE,cAAc;EACd,gBAAgB;EAChB,cAAc;EACd,cAAc;AAChB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,iBAAiB;AACnB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n/* Tomorrow Theme */\n/* http://jmblog.github.com/color-themes-for-google-code-highlightjs */\n\n/* Original theme - Copyright (C) 2013 Chris Kempson http://chriskempson.com\n/* released under the MIT License */\n/* https://github.com/chriskempson/tomorrow-theme */\n\n/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\n/* Copied from https://github.com/microsoft/vscode/blob/08537497eecd3172390194693d3d7c0ec8f52b70/extensions/markdown-language-features/media/tomorrow.css\n * with modifications.\n */\n\n/* This theme is used to style the output of the highlight.js library which is\n * licensed under the BSD-3-Clause. See https://github.com/highlightjs/highlight.js/blob/master/LICENSE\n */\n\n/* Tomorrow Comment */\n.theia-preview-widget .hljs-comment,\n.theia-preview-widget .hljs-quote {\n  color: #8e908c;\n}\n\n/* Tomorrow Red */\n.theia-preview-widget .hljs-variable,\n.theia-preview-widget .hljs-template-variable,\n.theia-preview-widget .hljs-tag,\n.theia-preview-widget .hljs-name,\n.theia-preview-widget .hljs-selector-id,\n.theia-preview-widget .hljs-selector-class,\n.theia-preview-widget .hljs-regexp,\n.theia-preview-widget .hljs-deletion {\n  color: #c82829;\n}\n\n/* Tomorrow Orange */\n.theia-preview-widget .hljs-number,\n.theia-preview-widget .hljs-built_in,\n.theia-preview-widget .hljs-builtin-name,\n.theia-preview-widget .hljs-literal,\n.theia-preview-widget .hljs-type,\n.theia-preview-widget .hljs-params,\n.theia-preview-widget .hljs-meta,\n.theia-preview-widget .hljs-link {\n  color: #f5871f;\n}\n\n/* Tomorrow Yellow */\n.theia-preview-widget .hljs-attribute {\n  color: #eab700;\n}\n\n/* Tomorrow Green */\n.theia-preview-widget .hljs-string,\n.theia-preview-widget .hljs-symbol,\n.theia-preview-widget .hljs-bullet,\n.theia-preview-widget .hljs-addition {\n  color: #718c00;\n}\n\n/* Tomorrow Blue */\n.theia-preview-widget .hljs-title,\n.theia-preview-widget .hljs-section {\n  color: #4271ae;\n}\n\n/* Tomorrow Purple */\n.theia-preview-widget .hljs-keyword,\n.theia-preview-widget .hljs-selector-tag {\n  color: #8959a8;\n}\n\n.theia-preview-widget .hljs {\n  display: block;\n  overflow-x: auto;\n  color: #4d4d4c;\n  padding: 0.5em;\n}\n\n.theia-preview-widget .hljs-emphasis {\n  font-style: italic;\n}\n\n.theia-preview-widget .hljs-strong {\n  font-weight: bold;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/style/index.css":
/*!****************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/style/index.css ***!
  \****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_preview_widget_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../../../node_modules/css-loader/dist/cjs.js!./preview-widget.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/style/preview-widget.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_preview_widget_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
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
`, "",{"version":3,"sources":["webpack://./../../packages/preview/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n@import \"./preview-widget.css\";\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/style/preview-widget.css":
/*!*************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/style/preview-widget.css ***!
  \*************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
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

.theia-preview-widget {
  overflow-y: auto;
  overflow-x: hidden;
}

.theia-preview-widget .scrollBeyondLastLine {
  margin-bottom: calc(100vh - var(--theia-content-line-height));
}

.theia-preview-widget:focus {
  outline: 0;
  box-shadow: none;
}
`, "",{"version":3,"sources":["webpack://./../../packages/preview/src/browser/style/preview-widget.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,6DAA6D;AAC/D;;AAEA;EACE,UAAU;EACV,gBAAgB;AAClB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-preview-widget {\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n\n.theia-preview-widget .scrollBeyondLastLine {\n  margin-bottom: calc(100vh - var(--theia-content-line-height));\n}\n\n.theia-preview-widget:focus {\n  outline: 0;\n  box-shadow: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/preview/src/browser/markdown/style/index.css":
/*!*******************************************************************!*\
  !*** ../../packages/preview/src/browser/markdown/style/index.css ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/markdown/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/preview/src/browser/style/index.css":
/*!**********************************************************!*\
  !*** ../../packages/preview/src/browser/style/index.css ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/preview/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII= ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=";

/***/ }),

/***/ "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg== ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

/***/ }),

/***/ "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg== ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

/***/ })

}]);
//# sourceMappingURL=packages_filesystem_lib_browser_index_js-packages_preview_lib_browser_preview-frontend-module-892063.js.map