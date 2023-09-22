"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_plugin-ext_lib_main_browser_custom-editors_custom-editor-opener_js-packages_plugin-e-29d38c"],{

/***/ "../../packages/plugin-ext/lib/main/browser/comments/comment-glyph-widget.js":
/*!***********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/comments/comment-glyph-widget.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentGlyphWidget = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/contrib/comments/browser/commentGlyphWidget.ts
class CommentGlyphWidget {
    constructor(editor) {
        this.commentsDecorations = [];
        this.commentsOptions = {
            isWholeLine: true,
            linesDecorationsClassName: 'comment-range-glyph comment-thread'
        };
        this.editor = editor;
    }
    getPosition() {
        const model = this.editor.getModel();
        const range = model && this.commentsDecorations && this.commentsDecorations.length
            ? model.getDecorationRange(this.commentsDecorations[0])
            : null;
        return range ? range.startLineNumber : this.lineNumber;
    }
    setLineNumber(lineNumber) {
        this.lineNumber = lineNumber;
        const commentsDecorations = [{
                range: {
                    startLineNumber: lineNumber, startColumn: 1,
                    endLineNumber: lineNumber, endColumn: 1
                },
                options: this.commentsOptions
            }];
        this.commentsDecorations = this.editor.deltaDecorations(this.commentsDecorations, commentsDecorations);
    }
    dispose() {
        if (this.commentsDecorations) {
            this.editor.deltaDecorations(this.commentsDecorations, []);
        }
    }
}
exports.CommentGlyphWidget = CommentGlyphWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/comments/comment-glyph-widget'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/comments/comment-thread-widget.js":
/*!************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/comments/comment-thread-widget.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentAction = exports.CommentActions = exports.CommentsInlineAction = exports.CommentEditContainer = exports.CommentBody = exports.ReviewComment = exports.CommentForm = exports.CommentThreadWidget = exports.COMMENT_TITLE = exports.COMMENT_CONTEXT = exports.COMMENT_THREAD_CONTEXT = void 0;
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
const monaco_editor_zone_widget_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-zone-widget */ "../../packages/monaco/lib/browser/monaco-editor-zone-widget.js");
const plugin_api_rpc_model_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc-model */ "../../packages/plugin-ext/lib/common/plugin-api-rpc-model.js");
const comment_glyph_widget_1 = __webpack_require__(/*! ./comment-glyph-widget */ "../../packages/plugin-ext/lib/main/browser/comments/comment-glyph-widget.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const client_1 = __webpack_require__(/*! @theia/core/shared/react-dom/client */ "../../packages/core/shared/react-dom/client/index.js");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/contrib/comments/browser/commentThreadWidget.ts
exports.COMMENT_THREAD_CONTEXT = ['comment_thread-context-menu'];
exports.COMMENT_CONTEXT = ['comment-context-menu'];
exports.COMMENT_TITLE = ['comment-title-menu'];
class CommentThreadWidget extends browser_1.BaseWidget {
    constructor(editor, _owner, _commentThread, commentService, menus, contextKeyService, commands) {
        super();
        this._owner = _owner;
        this._commentThread = _commentThread;
        this.commentService = commentService;
        this.menus = menus;
        this.contextKeyService = contextKeyService;
        this.commands = commands;
        this.commentFormRef = React.createRef();
        this.toDispose.push(this.zoneWidget = new monaco_editor_zone_widget_1.MonacoEditorZoneWidget(editor));
        this.containerNodeRoot = (0, client_1.createRoot)(this.zoneWidget.containerNode);
        this.toDispose.push(this.commentGlyphWidget = new comment_glyph_widget_1.CommentGlyphWidget(editor));
        this.toDispose.push(this._commentThread.onDidChangeCollapsibleState(state => {
            if (state === plugin_api_rpc_model_1.CommentThreadCollapsibleState.Expanded && !this.isExpanded) {
                const lineNumber = this._commentThread.range.startLineNumber;
                this.display({ afterLineNumber: lineNumber, afterColumn: 1, heightInLines: 2 });
                return;
            }
            if (state === plugin_api_rpc_model_1.CommentThreadCollapsibleState.Collapsed && this.isExpanded) {
                this.hide();
                return;
            }
        }));
        this.contextKeyService.commentIsEmpty.set(true);
        this.toDispose.push(this.zoneWidget.editor.onMouseDown(e => this.onEditorMouseDown(e)));
        this.toDispose.push(this.contextKeyService.onDidChange(() => {
            const commentForm = this.commentFormRef.current;
            if (commentForm) {
                commentForm.update();
            }
        }));
        this.toDispose.push(this._commentThread.onDidChangeCanReply(_canReply => {
            const commentForm = this.commentFormRef.current;
            if (commentForm) {
                commentForm.update();
            }
        }));
        this.toDispose.push(this._commentThread.onDidChangeState(_state => {
            this.update();
        }));
        this.contextMenu = this.menus.getMenu(exports.COMMENT_THREAD_CONTEXT);
        this.contextMenu.children.map(node => node instanceof common_1.ActionMenuNode && node.when).forEach(exp => {
            if (typeof exp === 'string') {
                this.contextKeyService.setExpression(exp);
            }
        });
    }
    getGlyphPosition() {
        return this.commentGlyphWidget.getPosition();
    }
    collapse() {
        this._commentThread.collapsibleState = plugin_api_rpc_model_1.CommentThreadCollapsibleState.Collapsed;
        if (this._commentThread.comments && this._commentThread.comments.length === 0) {
            this.deleteCommentThread();
        }
        this.hide();
    }
    deleteCommentThread() {
        this.dispose();
        this.commentService.disposeCommentThread(this.owner, this._commentThread.threadId);
    }
    dispose() {
        super.dispose();
        if (this.commentGlyphWidget) {
            this.commentGlyphWidget.dispose();
        }
    }
    toggleExpand(lineNumber) {
        if (this.isExpanded) {
            this._commentThread.collapsibleState = plugin_api_rpc_model_1.CommentThreadCollapsibleState.Collapsed;
            this.hide();
            if (!this._commentThread.comments || !this._commentThread.comments.length) {
                this.deleteCommentThread();
            }
        }
        else {
            this._commentThread.collapsibleState = plugin_api_rpc_model_1.CommentThreadCollapsibleState.Expanded;
            this.display({ afterLineNumber: lineNumber, afterColumn: 1, heightInLines: 2 });
        }
    }
    hide() {
        this.zoneWidget.hide();
        this.isExpanded = false;
        super.hide();
    }
    display(options) {
        this.isExpanded = true;
        if (this._commentThread.collapsibleState && this._commentThread.collapsibleState !== plugin_api_rpc_model_1.CommentThreadCollapsibleState.Expanded) {
            return;
        }
        this.commentGlyphWidget.setLineNumber(options.afterLineNumber);
        this._commentThread.collapsibleState = plugin_api_rpc_model_1.CommentThreadCollapsibleState.Expanded;
        this.zoneWidget.show(options);
        this.update();
    }
    onEditorMouseDown(e) {
        const range = e.target.range;
        if (!range) {
            return;
        }
        if (!e.event.leftButton) {
            return;
        }
        if (e.target.type !== browser_2.MouseTargetType.GUTTER_LINE_DECORATIONS) {
            return;
        }
        const data = e.target.detail;
        const gutterOffsetX = data.offsetX - data.glyphMarginWidth - data.lineNumbersWidth - data.glyphMarginLeft;
        // don't collide with folding and git decorations
        if (gutterOffsetX > 14) {
            return;
        }
        const mouseDownInfo = { lineNumber: range.startLineNumber };
        const { lineNumber } = mouseDownInfo;
        if (!range || range.startLineNumber !== lineNumber) {
            return;
        }
        if (e.target.type !== browser_2.MouseTargetType.GUTTER_LINE_DECORATIONS) {
            return;
        }
        if (!e.target.element) {
            return;
        }
        if (this.commentGlyphWidget && this.commentGlyphWidget.getPosition() !== lineNumber) {
            return;
        }
        if (e.target.element.className.indexOf('comment-thread') >= 0) {
            this.toggleExpand(lineNumber);
            return;
        }
        if (this._commentThread.collapsibleState === plugin_api_rpc_model_1.CommentThreadCollapsibleState.Collapsed) {
            this.display({ afterLineNumber: mouseDownInfo.lineNumber, heightInLines: 2 });
        }
        else {
            this.hide();
        }
    }
    get owner() {
        return this._owner;
    }
    get commentThread() {
        return this._commentThread;
    }
    getThreadLabel() {
        let label;
        label = this._commentThread.label;
        if (label === undefined) {
            if (this._commentThread.comments && this._commentThread.comments.length) {
                const onlyUnique = (value, index, self) => self.indexOf(value) === index;
                const participantsList = this._commentThread.comments.filter(onlyUnique).map(comment => `@${comment.userName}`).join(', ');
                const resolutionState = this._commentThread.state === plugin_api_rpc_model_1.CommentThreadState.Resolved ? '(Resolved)' : '(Unresolved)';
                label = `Participants: ${participantsList} ${resolutionState}`;
            }
            else {
                label = 'Start discussion';
            }
        }
        return label;
    }
    update() {
        if (!this.isExpanded) {
            return;
        }
        this.render();
        const headHeight = Math.ceil(this.zoneWidget.editor.getOption(monaco.editor.EditorOption.lineHeight) * 1.2);
        const lineHeight = this.zoneWidget.editor.getOption(monaco.editor.EditorOption.lineHeight);
        const arrowHeight = Math.round(lineHeight / 3);
        const frameThickness = Math.round(lineHeight / 9) * 2;
        const body = this.zoneWidget.containerNode.getElementsByClassName('body')[0];
        const computedLinesNumber = Math.ceil((headHeight + body.clientHeight + arrowHeight + frameThickness + 8 /** margin bottom to avoid margin collapse */) / lineHeight);
        this.zoneWidget.show({ afterLineNumber: this._commentThread.range.startLineNumber, heightInLines: computedLinesNumber });
    }
    render() {
        var _a;
        const headHeight = Math.ceil(this.zoneWidget.editor.getOption(monaco.editor.EditorOption.lineHeight) * 1.2);
        this.containerNodeRoot.render(React.createElement("div", { className: 'review-widget' },
            React.createElement("div", { className: 'head', style: { height: headHeight, lineHeight: `${headHeight}px` } },
                React.createElement("div", { className: 'review-title' },
                    React.createElement("span", { className: 'filename' }, this.getThreadLabel())),
                React.createElement("div", { className: 'review-actions' },
                    React.createElement("div", { className: 'monaco-action-bar animated' },
                        React.createElement("ul", { className: 'actions-container', role: 'toolbar' },
                            React.createElement("li", { className: 'action-item', role: 'presentation' },
                                React.createElement("a", { className: 'action-label codicon expand-review-action codicon-chevron-up', role: 'button', tabIndex: 0, title: 'Collapse', onClick: () => this.collapse() })))))),
            React.createElement("div", { className: 'body' },
                React.createElement("div", { className: 'comments-container', role: 'presentation', tabIndex: 0 }, (_a = this._commentThread.comments) === null || _a === void 0 ? void 0 : _a.map((comment, index) => React.createElement(ReviewComment, { key: index, contextKeyService: this.contextKeyService, menus: this.menus, comment: comment, commentForm: this.commentFormRef, commands: this.commands, commentThread: this._commentThread }))),
                React.createElement(CommentForm, { contextKeyService: this.contextKeyService, commands: this.commands, commentThread: this._commentThread, menus: this.menus, widget: this, ref: this.commentFormRef }))));
    }
}
exports.CommentThreadWidget = CommentThreadWidget;
class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.inputValue = '';
        this.getInput = () => this.inputValue;
        this.clearInput = () => {
            const input = this.inputRef.current;
            if (input) {
                this.inputValue = '';
                input.value = this.inputValue;
                this.props.contextKeyService.commentIsEmpty.set(true);
            }
        };
        this.expand = () => {
            this.setState({ expanded: true });
            // Wait for the widget to be rendered.
            setTimeout(() => {
                var _a;
                // Update the widget's height.
                this.props.widget.update();
                (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }, 100);
        };
        this.collapse = () => {
            this.setState({ expanded: false });
            // Wait for the widget to be rendered.
            setTimeout(() => {
                // Update the widget's height.
                this.props.widget.update();
            }, 100);
        };
        this.onInput = (event) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value = event.target.value;
            if (this.inputValue.length === 0 || value.length === 0) {
                this.props.contextKeyService.commentIsEmpty.set(value.length === 0);
            }
            this.inputValue = value;
        };
        this.state = {
            expanded: false
        };
        const setState = this.setState.bind(this);
        this.setState = newState => {
            setState(newState);
        };
        this.menu = this.props.menus.getMenu(exports.COMMENT_THREAD_CONTEXT);
        this.menu.children.map(node => node instanceof common_1.ActionMenuNode && node.when).forEach(exp => {
            if (typeof exp === 'string') {
                this.props.contextKeyService.setExpression(exp);
            }
        });
    }
    update() {
        this.setState(this.state);
    }
    componentDidMount() {
        // Wait for the widget to be rendered.
        setTimeout(() => {
            var _a;
            (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }, 100);
    }
    render() {
        const { commands, commentThread, contextKeyService } = this.props;
        const hasExistingComments = commentThread.comments && commentThread.comments.length > 0;
        return commentThread.canReply ? React.createElement("div", { className: 'comment-form' + (this.state.expanded || commentThread.comments && commentThread.comments.length === 0 ? ' expand' : '') },
            React.createElement("div", { className: 'theia-comments-input-message-container' },
                React.createElement("textarea", { className: 'theia-comments-input-message theia-input', spellCheck: false, placeholder: hasExistingComments ? 'Reply...' : 'Type a new comment', onInput: this.onInput, 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onBlur: (event) => {
                        if (event.target.value.length > 0) {
                            return;
                        }
                        if (event.relatedTarget && event.relatedTarget.className === 'comments-button comments-text-button theia-button') {
                            this.state = { expanded: false };
                            return;
                        }
                        this.collapse();
                    }, ref: this.inputRef })),
            React.createElement(CommentActions, { menu: this.menu, contextKeyService: contextKeyService, commands: commands, commentThread: commentThread, getInput: this.getInput, clearInput: this.clearInput }),
            React.createElement("button", { className: 'review-thread-reply-button', title: 'Reply...', onClick: this.expand }, "Reply...")) : null;
    }
}
exports.CommentForm = CommentForm;
class ReviewComment extends React.Component {
    constructor(props) {
        super(props);
        this.detectHover = (element) => {
            if (element) {
                window.requestAnimationFrame(() => {
                    const hover = element.matches(':hover');
                    this.setState({ hover });
                });
            }
        };
        this.showHover = () => this.setState({ hover: true });
        this.hideHover = () => this.setState({ hover: false });
        this.state = {
            hover: false
        };
        const setState = this.setState.bind(this);
        this.setState = newState => {
            setState(newState);
        };
    }
    render() {
        const { comment, commentForm, contextKeyService, menus, commands, commentThread } = this.props;
        const commentUniqueId = comment.uniqueIdInThread;
        const { hover } = this.state;
        contextKeyService.comment.set(comment.contextValue);
        return React.createElement("div", { className: 'review-comment', tabIndex: -1, "aria-label": `${comment.userName}, ${comment.body.value}`, ref: this.detectHover, onMouseEnter: this.showHover, onMouseLeave: this.hideHover },
            React.createElement("div", { className: 'avatar-container' },
                React.createElement("img", { className: 'avatar', src: comment.userIconPath })),
            React.createElement("div", { className: 'review-comment-contents' },
                React.createElement("div", { className: 'comment-title monaco-mouse-cursor-text' },
                    React.createElement("strong", { className: 'author' }, comment.userName),
                    React.createElement("small", { className: 'timestamp' }, this.localeDate(comment.timestamp)),
                    React.createElement("span", { className: 'isPending' }, comment.label),
                    React.createElement("div", { className: 'theia-comments-inline-actions-container' },
                        React.createElement("div", { className: 'theia-comments-inline-actions', role: 'toolbar' }, hover && menus.getMenu(exports.COMMENT_TITLE).children.map((node, index) => node instanceof common_1.ActionMenuNode &&
                            React.createElement(CommentsInlineAction, { key: index, ...{ node, commands, commentThread, commentUniqueId, contextKeyService } }))))),
                React.createElement(CommentBody, { value: comment.body.value, isVisible: comment.mode === undefined || comment.mode === plugin_api_rpc_model_1.CommentMode.Preview }),
                React.createElement(CommentEditContainer, { contextKeyService: contextKeyService, menus: menus, comment: comment, commentThread: commentThread, commentForm: commentForm, commands: commands })));
    }
    localeDate(timestamp) {
        if (timestamp === undefined) {
            return '';
        }
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return date.toLocaleString();
        }
        return '';
    }
}
exports.ReviewComment = ReviewComment;
class CommentBody extends React.Component {
    render() {
        const { value, isVisible } = this.props;
        if (!isVisible) {
            return false;
        }
        return React.createElement("div", { className: 'comment-body monaco-mouse-cursor-text' },
            React.createElement("div", null,
                React.createElement("p", null, value)));
    }
}
exports.CommentBody = CommentBody;
class CommentEditContainer extends React.Component {
    constructor() {
        super(...arguments);
        this.inputRef = React.createRef();
    }
    componentDidUpdate(prevProps, prevState) {
        var _a;
        const commentFormState = (_a = this.props.commentForm.current) === null || _a === void 0 ? void 0 : _a.state;
        const mode = this.props.comment.mode;
        if (this.dirtyCommentMode !== mode || (this.dirtyCommentFormState !== (commentFormState === null || commentFormState === void 0 ? void 0 : commentFormState.expanded) && !(commentFormState === null || commentFormState === void 0 ? void 0 : commentFormState.expanded))) {
            const currentInput = this.inputRef.current;
            if (currentInput) {
                // Wait for the widget to be rendered.
                setTimeout(() => {
                    currentInput.focus();
                    currentInput.setSelectionRange(currentInput.value.length, currentInput.value.length);
                }, 50);
            }
        }
        this.dirtyCommentMode = mode;
        this.dirtyCommentFormState = commentFormState === null || commentFormState === void 0 ? void 0 : commentFormState.expanded;
    }
    render() {
        const { menus, comment, commands, commentThread, contextKeyService } = this.props;
        if (!(comment.mode === plugin_api_rpc_model_1.CommentMode.Editing)) {
            return false;
        }
        return React.createElement("div", { className: 'edit-container' },
            React.createElement("div", { className: 'edit-textarea' },
                React.createElement("div", { className: 'theia-comments-input-message-container' },
                    React.createElement("textarea", { className: 'theia-comments-input-message theia-input', spellCheck: false, defaultValue: comment.body.value, ref: this.inputRef }))),
            React.createElement("div", { className: 'form-actions' }, menus.getMenu(exports.COMMENT_CONTEXT).children.map((node, index) => {
                const onClick = () => {
                    commands.executeCommand(node.id, {
                        thread: commentThread,
                        commentUniqueId: comment.uniqueIdInThread,
                        text: this.inputRef.current ? this.inputRef.current.value : ''
                    });
                };
                return node instanceof common_1.ActionMenuNode &&
                    React.createElement(CommentAction, { key: index, ...{ node, commands, onClick, contextKeyService } });
            })));
    }
}
exports.CommentEditContainer = CommentEditContainer;
class CommentsInlineAction extends React.Component {
    render() {
        const { node, commands, contextKeyService, commentThread, commentUniqueId } = this.props;
        if (node.when && !contextKeyService.match(node.when)) {
            return false;
        }
        return React.createElement("div", { className: 'theia-comments-inline-action' },
            React.createElement("a", { className: node.icon, title: node.label, onClick: () => {
                    commands.executeCommand(node.id, {
                        thread: commentThread,
                        commentUniqueId
                    });
                } }));
    }
}
exports.CommentsInlineAction = CommentsInlineAction;
class CommentActions extends React.Component {
    render() {
        const { contextKeyService, commands, menu, commentThread, getInput, clearInput } = this.props;
        return React.createElement("div", { className: 'form-actions' }, menu.children.map((node, index) => node instanceof common_1.ActionMenuNode &&
            React.createElement(CommentAction, { key: index, commands: commands, node: node, onClick: () => {
                    commands.executeCommand(node.id, {
                        thread: commentThread,
                        text: getInput()
                    });
                    clearInput();
                }, contextKeyService: contextKeyService })));
    }
}
exports.CommentActions = CommentActions;
class CommentAction extends React.Component {
    render() {
        const classNames = ['comments-button', 'comments-text-button', 'theia-button'];
        const { node, commands, contextKeyService, onClick } = this.props;
        if (node.when && !contextKeyService.match(node.when)) {
            return false;
        }
        const isEnabled = commands.isEnabled(node.command);
        if (!isEnabled) {
            classNames.push(browser_1.DISABLED_CLASS);
        }
        return React.createElement("button", { className: classNames.join(' '), tabIndex: 0, role: 'button', onClick: () => {
                if (isEnabled) {
                    onClick();
                }
            } }, node.label);
    }
}
exports.CommentAction = CommentAction;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/comments/comment-thread-widget'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-opener.js":
/*!*****************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-opener.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomEditorOpener = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! ../../../common */ "../../packages/plugin-ext/lib/common/index.js");
const custom_editor_widget_1 = __webpack_require__(/*! ./custom-editor-widget */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js");
const uuid_1 = __webpack_require__(/*! uuid */ "../../node_modules/uuid/dist/esm-browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const glob_1 = __webpack_require__(/*! @theia/core/lib/common/glob */ "../../packages/core/lib/common/glob.js");
let CustomEditorOpener = class CustomEditorOpener {
    constructor(editor, shell, widgetManager) {
        this.editor = editor;
        this.shell = shell;
        this.widgetManager = widgetManager;
        this.onDidOpenCustomEditorEmitter = new core_1.Emitter();
        this.onDidOpenCustomEditor = this.onDidOpenCustomEditorEmitter.event;
        this.pendingWidgetPromises = new Map();
        this.id = CustomEditorOpener.toCustomEditorId(this.editor.viewType);
        this.label = this.editor.displayName;
    }
    static toCustomEditorId(editorViewType) {
        return `custom-editor-${editorViewType}`;
    }
    canHandle(uri) {
        if (this.matches(this.editor.selector, uri)) {
            return this.getPriority();
        }
        return 0;
    }
    getPriority() {
        switch (this.editor.priority) {
            case common_1.CustomEditorPriority.default: return 500;
            case common_1.CustomEditorPriority.builtin: return 400;
            /** `option` should not open the custom-editor by default. */
            case common_1.CustomEditorPriority.option: return 1;
            default: return 200;
        }
    }
    async open(uri, options) {
        let widget;
        const widgets = this.widgetManager.getWidgets(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID);
        widget = widgets.find(w => w.viewType === this.editor.viewType && w.resource.toString() === uri.toString());
        if (widget === null || widget === void 0 ? void 0 : widget.isVisible) {
            return this.shell.revealWidget(widget.id);
        }
        if (widget === null || widget === void 0 ? void 0 : widget.isAttached) {
            return this.shell.activateWidget(widget.id);
        }
        if (!widget) {
            const uriString = uri.toString();
            let widgetPromise = this.pendingWidgetPromises.get(uriString);
            if (!widgetPromise) {
                const id = (0, uuid_1.v4)();
                widgetPromise = this.widgetManager.getOrCreateWidget(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID, { id });
                this.pendingWidgetPromises.set(uriString, widgetPromise);
                widget = await widgetPromise;
                this.pendingWidgetPromises.delete(uriString);
                widget.viewType = this.editor.viewType;
                widget.resource = uri;
                this.onDidOpenCustomEditorEmitter.fire([widget, options]);
            }
        }
        return widget;
    }
    matches(selectors, resource) {
        return selectors.some(selector => this.selectorMatches(selector, resource));
    }
    selectorMatches(selector, resource) {
        if (selector.filenamePattern) {
            if ((0, glob_1.match)(selector.filenamePattern.toLowerCase(), resource.path.name.toLowerCase() + resource.path.ext.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
};
CustomEditorOpener = __decorate([
    __param(1, (0, inversify_1.inject)(browser_1.ApplicationShell)),
    __param(2, (0, inversify_1.inject)(browser_1.WidgetManager)),
    __metadata("design:paramtypes", [Object, browser_1.ApplicationShell,
        browser_1.WidgetManager])
], CustomEditorOpener);
exports.CustomEditorOpener = CustomEditorOpener;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/custom-editors/custom-editor-opener'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js":
/*!*****************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
var CustomEditorWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomEditorWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const save_resource_service_1 = __webpack_require__(/*! @theia/core/lib/browser/save-resource-service */ "../../packages/core/lib/browser/save-resource-service.js");
const webview_1 = __webpack_require__(/*! ../webview/webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const undo_redo_service_1 = __webpack_require__(/*! @theia/editor/lib/browser/undo-redo-service */ "../../packages/editor/lib/browser/undo-redo-service.js");
let CustomEditorWidget = CustomEditorWidget_1 = class CustomEditorWidget extends webview_1.WebviewWidget {
    get modelRef() {
        return this._modelRef;
    }
    set modelRef(modelRef) {
        this._modelRef = modelRef;
        this.doUpdateContent();
        browser_1.Saveable.apply(this, () => this.shell.widgets.filter(widget => !!browser_1.Saveable.get(widget)), (widget, options) => this.saveService.save(widget, options));
    }
    get saveable() {
        return this._modelRef.object;
    }
    init() {
        super.init();
        this.id = CustomEditorWidget_1.FACTORY_ID + ':' + this.identifier.id;
        this.toDispose.push(this.fileService.onDidRunOperation(e => {
            if (e.isOperation(2 /* MOVE */)) {
                this.doMove(e.target.resource);
            }
        }));
    }
    undo() {
        this.undoRedoService.undo(this.resource);
    }
    redo() {
        this.undoRedoService.redo(this.resource);
    }
    async save(options) {
        await this._modelRef.object.saveCustomEditor(options);
    }
    async saveAs(source, target, options) {
        const result = await this._modelRef.object.saveCustomEditorAs(source, target, options);
        this.doMove(target);
        return result;
    }
    getResourceUri() {
        return this.resource;
    }
    createMoveToUri(resourceUri) {
        return this.resource.withPath(resourceUri.path);
    }
    storeState() {
        return {
            ...super.storeState(),
            strResource: this.resource.toString(),
        };
    }
    restoreState(oldState) {
        const { strResource } = oldState;
        this.resource = new uri_1.default(strResource);
        super.restoreState(oldState);
    }
    onMove(handler) {
        this._moveHandler = handler;
    }
    doMove(target) {
        if (this._moveHandler) {
            this._moveHandler(target);
        }
    }
};
CustomEditorWidget.FACTORY_ID = 'plugin-custom-editor';
__decorate([
    (0, inversify_1.inject)(undo_redo_service_1.UndoRedoService),
    __metadata("design:type", undo_redo_service_1.UndoRedoService)
], CustomEditorWidget.prototype, "undoRedoService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], CustomEditorWidget.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(save_resource_service_1.SaveResourceService),
    __metadata("design:type", save_resource_service_1.SaveResourceService)
], CustomEditorWidget.prototype, "saveService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomEditorWidget.prototype, "init", null);
CustomEditorWidget = CustomEditorWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], CustomEditorWidget);
exports.CustomEditorWidget = CustomEditorWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/documents-main.js":
/*!********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/documents-main.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentsMainImpl = exports.ModelReferenceCollection = void 0;
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
const plugin_api_rpc_1 = __webpack_require__(/*! ../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const disposable_util_1 = __webpack_require__(/*! ../../common/disposable-util */ "../../packages/plugin-ext/lib/common/disposable-util.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const types_impl_1 = __webpack_require__(/*! ../../plugin/types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class ModelReferenceCollection {
    constructor(maxAge = 1000 * 60 * 3, maxLength = 1024 * 1024 * 80) {
        this.maxAge = maxAge;
        this.maxLength = maxLength;
        this.data = new Array();
        this.length = 0;
    }
    dispose() {
        this.data = (0, disposable_util_1.dispose)(this.data) || [];
    }
    add(ref) {
        const length = ref.object.textEditorModel.getValueLength();
        const handle = setTimeout(_dispose, this.maxAge);
        const entry = { length, dispose: _dispose };
        const self = this;
        function _dispose() {
            const idx = self.data.indexOf(entry);
            if (idx >= 0) {
                self.length -= length;
                ref.dispose();
                clearTimeout(handle);
                self.data.splice(idx, 1);
            }
        }
        ;
        this.data.push(entry);
        this.length += length;
        this.cleanup();
    }
    cleanup() {
        while (this.length > this.maxLength) {
            this.data[0].dispose();
        }
    }
}
exports.ModelReferenceCollection = ModelReferenceCollection;
class DocumentsMainImpl {
    constructor(editorsAndDocuments, modelService, rpc, editorManager, openerService, shell, untitledResourceResolver, languageService) {
        this.modelService = modelService;
        this.editorManager = editorManager;
        this.openerService = openerService;
        this.shell = shell;
        this.untitledResourceResolver = untitledResourceResolver;
        this.languageService = languageService;
        this.syncedModels = new Map();
        this.modelReferenceCache = new ModelReferenceCollection();
        this.saveTimeout = 1750;
        this.toDispose = new core_1.DisposableCollection(this.modelReferenceCache);
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DOCUMENTS_EXT);
        this.toDispose.push(editorsAndDocuments);
        this.toDispose.push(editorsAndDocuments.onDocumentAdd(documents => documents.forEach(this.onModelAdded, this)));
        this.toDispose.push(editorsAndDocuments.onDocumentRemove(documents => documents.forEach(this.onModelRemoved, this)));
        this.toDispose.push(modelService.onModelModeChanged(this.onModelChanged, this));
        this.toDispose.push(modelService.onModelSaved(m => {
            this.proxy.$acceptModelSaved(m.textEditorModel.uri);
        }));
        this.toDispose.push(modelService.onModelWillSave(onWillSaveModelEvent => {
            onWillSaveModelEvent.waitUntil(new Promise(async (resolve, reject) => {
                setTimeout(() => reject(new Error(`Aborted onWillSaveTextDocument-event after ${this.saveTimeout}ms`)), this.saveTimeout);
                const edits = await this.proxy.$acceptModelWillSave(onWillSaveModelEvent.model.textEditorModel.uri, onWillSaveModelEvent.reason, this.saveTimeout);
                const editOperations = [];
                for (const edit of edits) {
                    const { range, text } = edit;
                    if (!range && !text) {
                        continue;
                    }
                    if (range && range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn && !edit.text) {
                        continue;
                    }
                    editOperations.push({
                        range: range ? monaco.Range.lift(range) : onWillSaveModelEvent.model.textEditorModel.getFullModelRange(),
                        /* eslint-disable-next-line no-null/no-null */
                        text: text || null,
                        forceMoveMarkers: edit.forceMoveMarkers
                    });
                }
                resolve(editOperations);
            }));
        }));
        this.toDispose.push(modelService.onModelDirtyChanged(m => {
            this.proxy.$acceptDirtyStateChanged(m.textEditorModel.uri, m.dirty);
        }));
    }
    dispose() {
        this.toDispose.dispose();
    }
    onModelChanged(event) {
        const modelUrl = event.model.textEditorModel.uri;
        if (this.syncedModels.has(modelUrl.toString())) {
            this.proxy.$acceptModelModeChanged(modelUrl, event.oldModeId, event.model.languageId);
        }
    }
    onModelAdded(model) {
        const modelUri = model.textEditorModel.uri;
        const key = modelUri.toString();
        const toDispose = new core_1.DisposableCollection(model.textEditorModel.onDidChangeContent(e => this.proxy.$acceptModelChanged(modelUri, {
            eol: e.eol,
            versionId: e.versionId,
            reason: e.isRedoing ? types_impl_1.TextDocumentChangeReason.Redo : e.isUndoing ? types_impl_1.TextDocumentChangeReason.Undo : undefined,
            changes: e.changes.map(c => ({
                text: c.text,
                range: c.range,
                rangeLength: c.rangeLength,
                rangeOffset: c.rangeOffset
            }))
        }, model.dirty)), core_1.Disposable.create(() => this.syncedModels.delete(key)));
        this.syncedModels.set(key, toDispose);
        this.toDispose.push(toDispose);
    }
    onModelRemoved(url) {
        const model = this.syncedModels.get(url.toString());
        if (model) {
            model.dispose();
        }
    }
    async $tryCreateDocument(options) {
        const language = (options === null || options === void 0 ? void 0 : options.language) && this.languageService.getExtension(options.language);
        const content = options === null || options === void 0 ? void 0 : options.content;
        const resource = await this.untitledResourceResolver.createUntitledResource(content, language);
        return monaco.Uri.parse(resource.uri.toString());
    }
    async $tryShowDocument(uri, options) {
        // Removing try-catch block here makes it not possible to handle errors.
        // Following message is appeared in browser console
        //   - Uncaught (in promise) Error: Cannot read property 'message' of undefined.
        try {
            const editorOptions = DocumentsMainImpl.toEditorOpenerOptions(this.shell, options);
            const uriArg = new uri_1.default(vscode_uri_1.URI.revive(uri));
            const opener = await this.openerService.getOpener(uriArg, editorOptions);
            await opener.open(uriArg, editorOptions);
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async $trySaveDocument(uri) {
        const widget = await this.editorManager.getByUri(new uri_1.default(vscode_uri_1.URI.revive(uri)));
        if (widget) {
            await browser_1.Saveable.save(widget);
            return true;
        }
        return false;
    }
    async $tryOpenDocument(uri) {
        const ref = await this.modelService.createModelReference(new uri_1.default(vscode_uri_1.URI.revive(uri)));
        if (ref.object) {
            this.modelReferenceCache.add(ref);
            return true;
        }
        else {
            ref.dispose();
            return false;
        }
    }
    async $tryCloseDocument(uri) {
        const widget = await this.editorManager.getByUri(new uri_1.default(vscode_uri_1.URI.revive(uri)));
        if (widget) {
            await browser_1.Saveable.save(widget);
            widget.close();
            return true;
        }
        return false;
    }
    static toEditorOpenerOptions(shell, options) {
        if (!options) {
            return undefined;
        }
        let range;
        if (options.selection) {
            const selection = options.selection;
            range = {
                start: { line: selection.startLineNumber - 1, character: selection.startColumn - 1 },
                end: { line: selection.endLineNumber - 1, character: selection.endColumn - 1 }
            };
        }
        /* fall back to side group -> split relative to the active widget */
        let widgetOptions = { mode: 'split-right' };
        let viewColumn = options.viewColumn;
        if (viewColumn === -2) {
            /* show besides -> compute current column and adjust viewColumn accordingly */
            const tabBars = shell.mainAreaTabBars;
            const currentTabBar = shell.currentTabBar;
            if (currentTabBar) {
                const currentColumn = tabBars.indexOf(currentTabBar);
                if (currentColumn > -1) {
                    // +2 because conversion from 0-based to 1-based index and increase of 1
                    viewColumn = currentColumn + 2;
                }
            }
        }
        if (viewColumn === undefined || viewColumn === -1) {
            /* active group -> skip (default behaviour) */
            widgetOptions = undefined;
        }
        else if (viewColumn > 0 && shell.mainAreaTabBars.length > 0) {
            const tabBars = shell.mainAreaTabBars;
            if (viewColumn <= tabBars.length) {
                // convert to zero-based index
                const tabBar = tabBars[viewColumn - 1];
                if (tabBar === null || tabBar === void 0 ? void 0 : tabBar.currentTitle) {
                    widgetOptions = { ref: tabBar.currentTitle.owner };
                }
            }
            else {
                const tabBar = tabBars[tabBars.length - 1];
                if (tabBar === null || tabBar === void 0 ? void 0 : tabBar.currentTitle) {
                    widgetOptions.ref = tabBar.currentTitle.owner;
                }
            }
        }
        return {
            selection: range,
            mode: options.preserveFocus ? 'reveal' : 'activate',
            preview: options.preview,
            widgetOptions
        };
    }
}
exports.DocumentsMainImpl = DocumentsMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/documents-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/menus/vscode-theia-menu-mappings.js":
/*!**************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/menus/vscode-theia-menu-mappings.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CodeEditorWidgetUtil = exports.codeToTheiaMappings = exports.implementedVSCodeContributionPoints = exports.PLUGIN_VIEW_TITLE_MENU = exports.PLUGIN_SCM_TITLE_MENU = exports.PLUGIN_EDITOR_TITLE_RUN_MENU = exports.PLUGIN_EDITOR_TITLE_MENU = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const navigatable_1 = __webpack_require__(/*! @theia/core/lib/browser/navigatable */ "../../packages/core/lib/browser/navigatable.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const debug_stack_frames_widget_1 = __webpack_require__(/*! @theia/debug/lib/browser/view/debug-stack-frames-widget */ "../../packages/debug/lib/browser/view/debug-stack-frames-widget.js");
const debug_threads_widget_1 = __webpack_require__(/*! @theia/debug/lib/browser/view/debug-threads-widget */ "../../packages/debug/lib/browser/view/debug-threads-widget.js");
const debug_toolbar_widget_1 = __webpack_require__(/*! @theia/debug/lib/browser/view/debug-toolbar-widget */ "../../packages/debug/lib/browser/view/debug-toolbar-widget.js");
const debug_variables_widget_1 = __webpack_require__(/*! @theia/debug/lib/browser/view/debug-variables-widget */ "../../packages/debug/lib/browser/view/debug-variables-widget.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const navigator_contribution_1 = __webpack_require__(/*! @theia/navigator/lib/browser/navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const scm_tree_widget_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-tree-widget */ "../../packages/scm/lib/browser/scm-tree-widget.js");
const timeline_tree_widget_1 = __webpack_require__(/*! @theia/timeline/lib/browser/timeline-tree-widget */ "../../packages/timeline/lib/browser/timeline-tree-widget.js");
const comment_thread_widget_1 = __webpack_require__(/*! ../comments/comment-thread-widget */ "../../packages/plugin-ext/lib/main/browser/comments/comment-thread-widget.js");
const tree_view_widget_1 = __webpack_require__(/*! ../view/tree-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/tree-view-widget.js");
const webview_1 = __webpack_require__(/*! ../webview/webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const editor_linenumber_contribution_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-linenumber-contribution */ "../../packages/editor/lib/browser/editor-linenumber-contribution.js");
exports.PLUGIN_EDITOR_TITLE_MENU = ['plugin_editor/title'];
exports.PLUGIN_EDITOR_TITLE_RUN_MENU = ['plugin_editor/title/run'];
exports.PLUGIN_SCM_TITLE_MENU = ['plugin_scm/title'];
exports.PLUGIN_VIEW_TITLE_MENU = ['plugin_view/title'];
exports.implementedVSCodeContributionPoints = [
    'comments/comment/context',
    'comments/comment/title',
    'comments/commentThread/context',
    'debug/callstack/context',
    'debug/variables/context',
    'debug/toolBar',
    'editor/context',
    'editor/title',
    'editor/title/context',
    'editor/title/run',
    'editor/lineNumber/context',
    'explorer/context',
    'scm/resourceFolder/context',
    'scm/resourceGroup/context',
    'scm/resourceState/context',
    'scm/title',
    'timeline/item/context',
    'view/item/context',
    'view/title'
];
/** The values are menu paths to which the VSCode contribution points correspond */
exports.codeToTheiaMappings = new Map([
    ['comments/comment/context', [comment_thread_widget_1.COMMENT_CONTEXT]],
    ['comments/comment/title', [comment_thread_widget_1.COMMENT_TITLE]],
    ['comments/commentThread/context', [comment_thread_widget_1.COMMENT_THREAD_CONTEXT]],
    ['debug/callstack/context', [debug_stack_frames_widget_1.DebugStackFramesWidget.CONTEXT_MENU, debug_threads_widget_1.DebugThreadsWidget.CONTEXT_MENU]],
    ['debug/variables/context', [debug_variables_widget_1.DebugVariablesWidget.CONTEXT_MENU]],
    ['debug/toolBar', [debug_toolbar_widget_1.DebugToolBar.MENU]],
    ['editor/context', [browser_2.EDITOR_CONTEXT_MENU]],
    ['editor/title', [exports.PLUGIN_EDITOR_TITLE_MENU]],
    ['editor/title/context', [browser_1.SHELL_TABBAR_CONTEXT_MENU]],
    ['editor/title/run', [exports.PLUGIN_EDITOR_TITLE_RUN_MENU]],
    ['editor/lineNumber/context', [editor_linenumber_contribution_1.EDITOR_LINENUMBER_CONTEXT_MENU]],
    ['explorer/context', [navigator_contribution_1.NAVIGATOR_CONTEXT_MENU]],
    ['scm/resourceFolder/context', [scm_tree_widget_1.ScmTreeWidget.RESOURCE_FOLDER_CONTEXT_MENU]],
    ['scm/resourceGroup/context', [scm_tree_widget_1.ScmTreeWidget.RESOURCE_GROUP_CONTEXT_MENU]],
    ['scm/resourceState/context', [scm_tree_widget_1.ScmTreeWidget.RESOURCE_CONTEXT_MENU]],
    ['scm/title', [exports.PLUGIN_SCM_TITLE_MENU]],
    ['timeline/item/context', [timeline_tree_widget_1.TIMELINE_ITEM_CONTEXT_MENU]],
    ['view/item/context', [tree_view_widget_1.VIEW_ITEM_CONTEXT_MENU]],
    ['view/title', [exports.PLUGIN_VIEW_TITLE_MENU]],
]);
let CodeEditorWidgetUtil = class CodeEditorWidgetUtil {
    is(arg) {
        return arg instanceof browser_2.EditorWidget || arg instanceof webview_1.WebviewWidget;
    }
    getResourceUri(editor) {
        const resourceUri = navigatable_1.Navigatable.is(editor) && editor.getResourceUri();
        return resourceUri ? resourceUri['codeUri'] : undefined;
    }
};
CodeEditorWidgetUtil = __decorate([
    (0, inversify_1.injectable)()
], CodeEditorWidgetUtil);
exports.CodeEditorWidgetUtil = CodeEditorWidgetUtil;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/menus/vscode-theia-menu-mappings'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js":
/*!*************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
var PluginSharedStyle_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginSharedStyle = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const reference_1 = __webpack_require__(/*! @theia/core/lib/common/reference */ "../../packages/core/lib/common/reference.js");
const endpoint_1 = __webpack_require__(/*! @theia/core/lib/browser/endpoint */ "../../packages/core/lib/browser/endpoint.js");
let PluginSharedStyle = PluginSharedStyle_1 = class PluginSharedStyle {
    constructor() {
        this.rules = [];
        this.toUpdate = new disposable_1.DisposableCollection();
        this.icons = new reference_1.SyncReferenceCollection(key => this.createPluginIcon(key));
        this.iconSequence = 0;
    }
    init() {
        this.update();
        this.themeService.onDidColorThemeChange(() => this.update());
    }
    update() {
        this.toUpdate.dispose();
        const style = this.style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'screen';
        document.getElementsByTagName('head')[0].appendChild(style);
        this.toUpdate.push(disposable_1.Disposable.create(() => document.getElementsByTagName('head')[0].removeChild(style)));
        for (const rule of this.rules) {
            this.doInsertRule(rule);
        }
    }
    insertRule(selector, body) {
        const rule = { selector, body };
        this.rules.push(rule);
        this.doInsertRule(rule);
        return disposable_1.Disposable.create(() => {
            const index = this.rules.indexOf(rule);
            if (index !== -1) {
                this.rules.splice(index, 1);
                this.deleteRule(selector);
            }
        });
    }
    doInsertRule({ selector, body }) {
        const sheet = this.style.sheet;
        const cssBody = body(this.themeService.getCurrentTheme());
        sheet.insertRule(selector + ' {\n' + cssBody + '\n}', 0);
    }
    deleteRule(selector) {
        const sheet = this.style.sheet;
        const rules = sheet.rules || sheet.cssRules || [];
        for (let i = rules.length - 1; i >= 0; i--) {
            const rule = rules[i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (rule.selectorText.indexOf(selector) !== -1) {
                sheet.deleteRule(i);
            }
        }
    }
    toIconClass(url, { size } = { size: 16 }) {
        return this.icons.acquire({ url, size });
    }
    createPluginIcon(key) {
        const iconUrl = key.url;
        const size = key.size;
        const darkIconUrl = PluginSharedStyle_1.toExternalIconUrl(`${typeof iconUrl === 'object' ? iconUrl.dark : iconUrl}`);
        const lightIconUrl = PluginSharedStyle_1.toExternalIconUrl(`${typeof iconUrl === 'object' ? iconUrl.light : iconUrl}`);
        const iconClass = 'plugin-icon-' + this.iconSequence++;
        const toDispose = new disposable_1.DisposableCollection();
        toDispose.push(this.insertRule('.' + iconClass + '::before', theme => `
                content: "";
                background-position: 2px;
                width: ${size}px;
                height: ${size}px;
                background: center no-repeat url("${theme.type === 'light' ? lightIconUrl : darkIconUrl}");
                background-size: ${size}px;
            `));
        return {
            iconClass,
            dispose: () => toDispose.dispose()
        };
    }
    static toExternalIconUrl(iconUrl) {
        if (iconUrl.startsWith('hostedPlugin/')) {
            return new endpoint_1.Endpoint({ path: iconUrl }).getRestUrl().toString();
        }
        return iconUrl;
    }
};
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], PluginSharedStyle.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginSharedStyle.prototype, "init", null);
PluginSharedStyle = PluginSharedStyle_1 = __decorate([
    (0, inversify_1.injectable)()
], PluginSharedStyle);
exports.PluginSharedStyle = PluginSharedStyle;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-shared-style'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view/dnd-file-content-store.js":
/*!*********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view/dnd-file-content-store.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DnDFileContentStore_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DnDFileContentStore = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let DnDFileContentStore = DnDFileContentStore_1 = class DnDFileContentStore {
    constructor() {
        this.files = new Map();
    }
    addFile(f) {
        const id = (DnDFileContentStore_1.id++).toString();
        this.files.set(id, f);
        return id;
    }
    removeFile(id) {
        return this.files.delete(id);
    }
    getFile(id) {
        const file = this.files.get(id);
        if (file) {
            return file;
        }
        throw new Error(`File with id ${id} not found in dnd operation`);
    }
};
DnDFileContentStore.id = 0;
DnDFileContentStore = DnDFileContentStore_1 = __decorate([
    (0, inversify_1.injectable)()
], DnDFileContentStore);
exports.DnDFileContentStore = DnDFileContentStore;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view/dnd-file-content-store'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view/tree-view-widget.js":
/*!***************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view/tree-view-widget.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018-2019 Red Hat, Inc. and others.
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
exports.TreeViewWidget = exports.PluginTreeModel = exports.PluginTree = exports.TreeViewWidgetOptions = exports.CompositeTreeViewNode = exports.ResolvableCompositeTreeViewNode = exports.ResolvableTreeViewNode = exports.TreeViewNode = exports.VIEW_ITEM_INLINE_MENU = exports.VIEW_ITEM_CONTEXT_MENU = exports.TREE_NODE_HYPERLINK = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../../../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const menu_1 = __webpack_require__(/*! @theia/core/lib/common/menu */ "../../packages/core/lib/common/menu/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const plugin_shared_style_1 = __webpack_require__(/*! ../plugin-shared-style */ "../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js");
const widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/widget */ "../../packages/core/lib/browser/widgets/widget.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const markdown_rendering_1 = __webpack_require__(/*! @theia/core/lib/common/markdown-rendering */ "../../packages/core/lib/common/markdown-rendering/index.js");
const label_parser_1 = __webpack_require__(/*! @theia/core/lib/browser/label-parser */ "../../packages/core/lib/browser/label-parser.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const tree_decorator_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-decorator */ "../../packages/core/lib/browser/tree/tree-decorator.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const types_1 = __webpack_require__(/*! ../../../common/types */ "../../packages/plugin-ext/lib/common/types.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const dnd_file_content_store_1 = __webpack_require__(/*! ./dnd-file-content-store */ "../../packages/plugin-ext/lib/main/browser/view/dnd-file-content-store.js");
exports.TREE_NODE_HYPERLINK = 'theia-TreeNodeHyperlink';
exports.VIEW_ITEM_CONTEXT_MENU = ['view-item-context-menu'];
exports.VIEW_ITEM_INLINE_MENU = ['view-item-context-menu', 'inline'];
var TreeViewNode;
(function (TreeViewNode) {
    function is(arg) {
        return !!arg && browser_1.SelectableTreeNode.is(arg) && tree_decorator_1.DecoratedTreeNode.is(arg);
    }
    TreeViewNode.is = is;
})(TreeViewNode = exports.TreeViewNode || (exports.TreeViewNode = {}));
class ResolvableTreeViewNode {
    constructor(treeViewNode, resolve) {
        this._resolved = false;
        (0, types_1.mixin)(this, treeViewNode);
        this.resolve = async (token) => {
            var _a, _b;
            if (this.resolving) {
                return this.resolving.promise;
            }
            if (!this._resolved) {
                this.resolving = new promise_util_1.Deferred();
                const resolvedTreeItem = await resolve(token);
                if (resolvedTreeItem) {
                    this.command = (_a = this.command) !== null && _a !== void 0 ? _a : resolvedTreeItem.command;
                    this.tooltip = (_b = this.tooltip) !== null && _b !== void 0 ? _b : resolvedTreeItem.tooltip;
                }
                this.resolving.resolve();
                this.resolving = undefined;
            }
            if (!token.isCancellationRequested) {
                this._resolved = true;
            }
        };
    }
    reset() {
        this._resolved = false;
        this.resolving = undefined;
        this.command = undefined;
        this.tooltip = undefined;
    }
    get resolved() {
        return this._resolved;
    }
}
exports.ResolvableTreeViewNode = ResolvableTreeViewNode;
class ResolvableCompositeTreeViewNode extends ResolvableTreeViewNode {
    constructor(treeViewNode, resolve) {
        super(treeViewNode, resolve);
        this.expanded = treeViewNode.expanded;
        this.children = treeViewNode.children;
    }
}
exports.ResolvableCompositeTreeViewNode = ResolvableCompositeTreeViewNode;
var CompositeTreeViewNode;
(function (CompositeTreeViewNode) {
    function is(arg) {
        return TreeViewNode.is(arg) && browser_1.ExpandableTreeNode.is(arg) && browser_1.CompositeTreeNode.is(arg);
    }
    CompositeTreeViewNode.is = is;
})(CompositeTreeViewNode = exports.CompositeTreeViewNode || (exports.CompositeTreeViewNode = {}));
let TreeViewWidgetOptions = class TreeViewWidgetOptions {
};
TreeViewWidgetOptions = __decorate([
    (0, inversify_1.injectable)()
], TreeViewWidgetOptions);
exports.TreeViewWidgetOptions = TreeViewWidgetOptions;
let PluginTree = class PluginTree extends browser_1.TreeImpl {
    constructor() {
        super(...arguments);
        this.onDidChangeWelcomeStateEmitter = new event_1.Emitter();
        this.onDidChangeWelcomeState = this.onDidChangeWelcomeStateEmitter.event;
        this._hasTreeItemResolve = Promise.resolve(false);
    }
    set proxy(proxy) {
        this._proxy = proxy;
        if (proxy) {
            this._hasTreeItemResolve = proxy.$hasResolveTreeItem(this.options.id);
        }
        else {
            this._hasTreeItemResolve = Promise.resolve(false);
        }
    }
    get proxy() {
        return this._proxy;
    }
    get hasTreeItemResolve() {
        return this._hasTreeItemResolve;
    }
    set viewInfo(viewInfo) {
        this._viewInfo = viewInfo;
    }
    get isEmpty() {
        return this._isEmpty;
    }
    async resolveChildren(parent) {
        if (!this._proxy) {
            return super.resolveChildren(parent);
        }
        const children = await this.fetchChildren(this._proxy, parent);
        const hasResolve = await this.hasTreeItemResolve;
        return children.map(value => hasResolve ? this.createResolvableTreeNode(value, parent) : this.createTreeNode(value, parent));
    }
    async fetchChildren(proxy, parent) {
        try {
            const children = await proxy.$getChildren(this.options.id, parent.id);
            const oldEmpty = this._isEmpty;
            this._isEmpty = !parent.id && (!children || children.length === 0);
            if (oldEmpty !== this._isEmpty) {
                this.onDidChangeWelcomeStateEmitter.fire();
            }
            return children || [];
        }
        catch (e) {
            if (e) {
                console.error(`Failed to fetch children for '${this.options.id}'`, e);
                const label = this._viewInfo ? this._viewInfo.name : this.options.id;
                this.notification.error(`${label}: ${e.message}`);
            }
            return [];
        }
    }
    createTreeNode(item, parent) {
        const update = this.createTreeNodeUpdate(item);
        const node = this.getNode(item.id);
        if (item.collapsibleState !== undefined && item.collapsibleState !== plugin_api_rpc_1.TreeViewItemCollapsibleState.None) {
            if (CompositeTreeViewNode.is(node)) {
                return Object.assign(node, update);
            }
            return Object.assign({
                id: item.id,
                parent,
                visible: true,
                selected: false,
                expanded: plugin_api_rpc_1.TreeViewItemCollapsibleState.Expanded === item.collapsibleState,
                children: [],
                command: item.command
            }, update);
        }
        if (TreeViewNode.is(node) && !browser_1.ExpandableTreeNode.is(node)) {
            return Object.assign(node, update, { command: item.command });
        }
        return Object.assign({
            id: item.id,
            parent,
            visible: true,
            selected: false,
            command: item.command,
        }, update);
    }
    markAsChecked(node, checked) {
        var _a;
        function findParentsToChange(child, nodes) {
            var _a;
            if ((((_a = child.parent) === null || _a === void 0 ? void 0 : _a.checkboxInfo) !== undefined && child.parent.checkboxInfo.checked !== checked) &&
                (!checked || !child.parent.children.some(candidate => { var _a; return candidate !== child && ((_a = candidate.checkboxInfo) === null || _a === void 0 ? void 0 : _a.checked) === false; }))) {
                nodes.push(child.parent);
                findParentsToChange(child.parent, nodes);
            }
        }
        function findChildrenToChange(parent, nodes) {
            if (browser_1.CompositeTreeNode.is(parent)) {
                parent.children.forEach(child => {
                    if (child.checkboxInfo !== undefined && child.checkboxInfo.checked !== checked) {
                        nodes.push(child);
                    }
                    findChildrenToChange(child, nodes);
                });
            }
        }
        const nodesToChange = [node];
        if (!this.options.manageCheckboxStateManually) {
            findParentsToChange(node, nodesToChange);
            findChildrenToChange(node, nodesToChange);
        }
        nodesToChange.forEach(n => n.checkboxInfo.checked = checked);
        this.onDidUpdateEmitter.fire(nodesToChange);
        (_a = this.proxy) === null || _a === void 0 ? void 0 : _a.$checkStateChanged(this.options.id, [{ id: node.id, checked: checked }]);
    }
    /** Creates a resolvable tree node. If a node already exists, reset it because the underlying TreeViewItem might have been disposed in the backend. */
    createResolvableTreeNode(item, parent) {
        const update = this.createTreeNodeUpdate(item);
        const node = this.getNode(item.id);
        // Node is a composite node that might contain children
        if (item.collapsibleState !== undefined && item.collapsibleState !== plugin_api_rpc_1.TreeViewItemCollapsibleState.None) {
            // Reuse existing composite node and reset it
            if (node instanceof ResolvableCompositeTreeViewNode) {
                node.reset();
                return Object.assign(node, update);
            }
            // Create new composite node
            const compositeNode = Object.assign({
                id: item.id,
                parent,
                visible: true,
                selected: false,
                expanded: plugin_api_rpc_1.TreeViewItemCollapsibleState.Expanded === item.collapsibleState,
                children: [],
                command: item.command
            }, update);
            return new ResolvableCompositeTreeViewNode(compositeNode, async (token) => { var _a; return (_a = this._proxy) === null || _a === void 0 ? void 0 : _a.$resolveTreeItem(this.options.id, item.id, token); });
        }
        // Node is a leaf
        // Reuse existing node and reset it.
        if (node instanceof ResolvableTreeViewNode && !browser_1.ExpandableTreeNode.is(node)) {
            node.reset();
            return Object.assign(node, update);
        }
        const treeNode = Object.assign({
            id: item.id,
            parent,
            visible: true,
            selected: false,
            command: item.command,
        }, update);
        return new ResolvableTreeViewNode(treeNode, async (token) => { var _a; return (_a = this._proxy) === null || _a === void 0 ? void 0 : _a.$resolveTreeItem(this.options.id, item.id, token); });
    }
    createTreeNodeUpdate(item) {
        const decorationData = this.toDecorationData(item);
        const icon = this.toIconClass(item);
        const resourceUri = item.resourceUri && uri_1.URI.fromComponents(item.resourceUri).toString();
        const themeIcon = item.themeIcon ? item.themeIcon : item.collapsibleState !== plugin_api_rpc_1.TreeViewItemCollapsibleState.None ? { id: 'folder' } : undefined;
        return {
            name: item.label,
            decorationData,
            icon,
            description: item.description,
            themeIcon,
            resourceUri,
            tooltip: item.tooltip,
            contextValue: item.contextValue,
            command: item.command,
            checkboxInfo: item.checkboxInfo,
            accessibilityInformation: item.accessibilityInformation,
        };
    }
    toDecorationData(item) {
        let decoration = {};
        if (item.highlights) {
            const highlight = {
                ranges: item.highlights.map(h => ({ offset: h[0], length: h[1] - h[0] }))
            };
            decoration = { highlight };
        }
        return decoration;
    }
    toIconClass(item) {
        if (item.icon) {
            return 'fa ' + item.icon;
        }
        if (item.iconUrl) {
            const reference = this.sharedStyle.toIconClass(item.iconUrl);
            this.toDispose.push(reference);
            return reference.object.iconClass;
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], PluginTree.prototype, "sharedStyle", void 0);
__decorate([
    (0, inversify_1.inject)(TreeViewWidgetOptions),
    __metadata("design:type", TreeViewWidgetOptions)
], PluginTree.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], PluginTree.prototype, "notification", void 0);
PluginTree = __decorate([
    (0, inversify_1.injectable)()
], PluginTree);
exports.PluginTree = PluginTree;
let PluginTreeModel = class PluginTreeModel extends browser_1.TreeModelImpl {
    set proxy(proxy) {
        this.tree.proxy = proxy;
    }
    get proxy() {
        return this.tree.proxy;
    }
    get hasTreeItemResolve() {
        return this.tree.hasTreeItemResolve;
    }
    set viewInfo(viewInfo) {
        this.tree.viewInfo = viewInfo;
    }
    get isTreeEmpty() {
        return this.tree.isEmpty;
    }
    get onDidChangeWelcomeState() {
        return this.tree.onDidChangeWelcomeState;
    }
    doOpenNode(node) {
        super.doOpenNode(node);
        if (node instanceof ResolvableTreeViewNode) {
            node.resolve(common_1.CancellationToken.None);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(PluginTree),
    __metadata("design:type", PluginTree)
], PluginTreeModel.prototype, "tree", void 0);
PluginTreeModel = __decorate([
    (0, inversify_1.injectable)()
], PluginTreeModel);
exports.PluginTreeModel = PluginTreeModel;
let TreeViewWidget = class TreeViewWidget extends browser_1.TreeViewWelcomeWidget {
    constructor() {
        super(...arguments);
        this._contextSelection = false;
        this.expansionTimeouts = new Map();
    }
    init() {
        super.init();
        this.id = this.options.id;
        this.addClass('theia-tree-view');
        this.node.style.height = '100%';
        this.model.onDidChangeWelcomeState(this.update, this);
        this.toDispose.push(this.model.onDidChangeWelcomeState(this.update, this));
        this.toDispose.push(this.onDidChangeVisibilityEmitter);
        this.toDispose.push(this.contextKeyService.onDidChange(() => this.update()));
        this.toDispose.push(this.keybindings.onKeybindingsChanged(() => this.update()));
        this.treeDragType = `application/vnd.code.tree.${this.id.toLowerCase()}`;
    }
    get showCollapseAll() {
        return this.options.showCollapseAll || false;
    }
    renderIcon(node, props) {
        var _a;
        const icon = this.toNodeIcon(node);
        if (icon) {
            let style;
            if (TreeViewNode.is(node) && ((_a = node.themeIcon) === null || _a === void 0 ? void 0 : _a.color)) {
                const color = this.colorRegistry.getCurrentColor(node.themeIcon.color.id);
                if (color) {
                    style = { color };
                }
            }
            return React.createElement("div", { className: icon + ' theia-tree-view-icon', style: style });
        }
        return undefined;
    }
    renderCaption(node, props) {
        const classes = [browser_1.TREE_NODE_SEGMENT_CLASS];
        if (!this.hasTrailingSuffixes(node)) {
            classes.push(browser_1.TREE_NODE_SEGMENT_GROW_CLASS);
        }
        const className = classes.join(' ');
        let attrs = {
            ...this.decorateCaption(node, {}),
            className,
            id: node.id
        };
        if (node.accessibilityInformation) {
            attrs = {
                ...attrs,
                'aria-label': node.accessibilityInformation.label,
                'role': node.accessibilityInformation.role
            };
        }
        if (!node.tooltip && node instanceof ResolvableTreeViewNode) {
            let configuredTip = false;
            let source;
            attrs = {
                ...attrs,
                onMouseLeave: () => source === null || source === void 0 ? void 0 : source.cancel(),
                onMouseEnter: async (event) => {
                    const target = event.currentTarget; // event.currentTarget will be null after awaiting node resolve()
                    if (configuredTip) {
                        if (markdown_rendering_1.MarkdownString.is(node.tooltip)) {
                            this.hoverService.requestHover({
                                content: node.tooltip,
                                target: event.target,
                                position: 'right'
                            });
                        }
                        return;
                    }
                    if (!node.resolved) {
                        source = new common_1.CancellationTokenSource();
                        const token = source.token;
                        await node.resolve(token);
                        if (token.isCancellationRequested) {
                            return;
                        }
                    }
                    if (markdown_rendering_1.MarkdownString.is(node.tooltip)) {
                        this.hoverService.requestHover({
                            content: node.tooltip,
                            target: event.target,
                            position: 'right'
                        });
                    }
                    else {
                        const title = node.tooltip ||
                            (node.resourceUri && this.labelProvider.getLongName(new uri_1.URI(node.resourceUri)))
                            || this.toNodeName(node);
                        target.title = title;
                    }
                    configuredTip = true;
                }
            };
        }
        else if (markdown_rendering_1.MarkdownString.is(node.tooltip)) {
            attrs = {
                ...attrs,
                onMouseEnter: event => {
                    this.hoverService.requestHover({
                        content: node.tooltip,
                        target: event.target,
                        position: 'right'
                    });
                }
            };
        }
        else {
            const title = node.tooltip ||
                (node.resourceUri && this.labelProvider.getLongName(new uri_1.URI(node.resourceUri)))
                || this.toNodeName(node);
            attrs = {
                ...attrs,
                title
            };
        }
        const children = [];
        const caption = this.toNodeName(node);
        const highlight = this.getDecorationData(node, 'highlight')[0];
        if (highlight) {
            children.push(this.toReactNode(caption, highlight));
        }
        const searchHighlight = this.searchHighlights && this.searchHighlights.get(node.id);
        if (searchHighlight) {
            children.push(...this.toReactNode(caption, searchHighlight));
        }
        else if (!highlight) {
            children.push(caption);
        }
        const description = this.toNodeDescription(node);
        if (description) {
            children.push(React.createElement("span", { className: 'theia-tree-view-description' }, description));
        }
        return React.createElement("div", { ...attrs }, ...children);
    }
    createNodeAttributes(node, props) {
        const attrs = super.createNodeAttributes(node, props);
        if (this.options.dragMimeTypes) {
            attrs.onDragStart = event => this.handleDragStartEvent(node, event);
            attrs.onDragEnd = event => this.handleDragEnd(node, event);
            attrs.draggable = true;
        }
        if (this.options.dropMimeTypes) {
            attrs.onDrop = event => this.handleDropEvent(node, event);
            attrs.onDragEnter = event => this.handleDragEnter(node, event);
            attrs.onDragLeave = event => this.handleDragLeave(node, event);
            attrs.onDragOver = event => this.handleDragOver(event);
        }
        return attrs;
    }
    handleDragLeave(node, event) {
        const timeout = this.expansionTimeouts.get(node.id);
        if (typeof timeout !== 'undefined') {
            console.debug(`dragleave ${node.id} canceling timeout`);
            clearTimeout(timeout);
            this.expansionTimeouts.delete(node.id);
        }
    }
    handleDragEnter(node, event) {
        console.debug(`dragenter ${node.id}`);
        if (browser_1.ExpandableTreeNode.is(node)) {
            console.debug(`dragenter ${node.id} starting timeout`);
            this.expansionTimeouts.set(node.id, window.setTimeout(() => {
                console.debug(`dragenter ${node.id} timeout reached`);
                this.model.expandNode(node);
            }, 500));
        }
    }
    createContainerAttributes() {
        const attrs = super.createContainerAttributes();
        if (this.options.dropMimeTypes) {
            attrs.onDrop = event => this.handleDropEvent(undefined, event);
            attrs.onDragOver = event => this.handleDragOver(event);
        }
        return attrs;
    }
    handleDragStartEvent(node, event) {
        event.dataTransfer.setData(this.treeDragType, '');
        let selectedNodes = [];
        if (this.model.selectedNodes.find(selected => browser_1.TreeNode.equals(selected, node))) {
            selectedNodes = this.model.selectedNodes.filter(TreeViewNode.is);
        }
        else {
            selectedNodes = [node];
        }
        this.options.dragMimeTypes.forEach(type => {
            if (type === 'text/uri-list') {
                browser_1.ApplicationShell.setDraggedEditorUris(event.dataTransfer, selectedNodes.filter(n => n.resourceUri).map(n => new uri_1.URI(n.resourceUri)));
            }
            else {
                event.dataTransfer.setData(type, '');
            }
        });
        this.model.proxy.$dragStarted(this.options.id, selectedNodes.map(selected => selected.id), common_1.CancellationToken.None).then(maybeUris => {
            if (maybeUris) {
                this.applicationShell.addAdditionalDraggedEditorUris(maybeUris.map(uri_1.URI.fromComponents));
            }
        });
    }
    handleDragEnd(node, event) {
        this.applicationShell.clearAdditionalDraggedEditorUris();
        this.model.proxy.$dragEnd(this.id);
    }
    handleDragOver(event) {
        const hasFiles = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file') {
                    return true;
                }
            }
            return false;
        };
        if (event.dataTransfer) {
            const canDrop = event.dataTransfer.types.some(type => this.options.dropMimeTypes.includes(type)) ||
                event.dataTransfer.types.includes(this.treeDragType) ||
                this.options.dropMimeTypes.includes('files') && hasFiles(event.dataTransfer.items);
            if (canDrop) {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
            }
            else {
                event.dataTransfer.dropEffect = 'none';
            }
            event.stopPropagation();
        }
    }
    handleDropEvent(node, event) {
        var _a;
        if (event.dataTransfer) {
            const items = [];
            let files = [];
            try {
                for (let i = 0; i < event.dataTransfer.items.length; i++) {
                    const transferItem = event.dataTransfer.items[i];
                    if (transferItem.type !== this.treeDragType) {
                        // do not pass the artificial drag data to the extension
                        const f = event.dataTransfer.items[i].getAsFile();
                        if (f) {
                            const fileId = this.dndFileContentStore.addFile(f);
                            files.push(fileId);
                            const uri = f.path ? {
                                scheme: 'file',
                                path: f.path,
                                authority: '',
                                query: '',
                                fragment: ''
                            } : undefined;
                            items.push([transferItem.type, new plugin_api_rpc_1.DataTransferFileDTO(f.name, fileId, uri)]);
                        }
                        else {
                            const textData = event.dataTransfer.getData(transferItem.type);
                            if (textData) {
                                items.push([transferItem.type, textData]);
                            }
                        }
                    }
                }
                if (items.length > 0 || event.dataTransfer.types.includes(this.treeDragType)) {
                    event.preventDefault();
                    event.stopPropagation();
                    (_a = this.model.proxy) === null || _a === void 0 ? void 0 : _a.$drop(this.id, node === null || node === void 0 ? void 0 : node.id, items, common_1.CancellationToken.None).finally(() => {
                        for (const file of files) {
                            this.dndFileContentStore.removeFile(file);
                        }
                    });
                    files = [];
                }
            }
            catch (e) {
                for (const file of files) {
                    this.dndFileContentStore.removeFile(file);
                }
                throw e;
            }
        }
    }
    renderTailDecorations(treeViewNode, props) {
        return this.contextKeys.with({ view: this.id, viewItem: treeViewNode.contextValue }, () => {
            const menu = this.menus.getMenu(exports.VIEW_ITEM_INLINE_MENU);
            const args = this.toContextMenuArgs(treeViewNode);
            const inlineCommands = menu.children.filter((item) => item instanceof menu_1.ActionMenuNode);
            const tailDecorations = super.renderTailDecorations(treeViewNode, props);
            return React.createElement(React.Fragment, null,
                inlineCommands.length > 0 && React.createElement("div", { className: browser_1.TREE_NODE_SEGMENT_CLASS + ' flex' }, inlineCommands.map((item, index) => this.renderInlineCommand(item, index, this.focusService.hasFocus(treeViewNode), args))),
                tailDecorations !== undefined && React.createElement("div", { className: browser_1.TREE_NODE_SEGMENT_CLASS + ' flex' }, tailDecorations));
        });
    }
    toTreeViewItemReference(treeNode) {
        return { viewId: this.id, itemId: treeNode.id };
    }
    resolveKeybindingForCommand(command) {
        let result = '';
        if (command) {
            const bindings = this.keybindings.getKeybindingsForCommand(command);
            let found = false;
            if (bindings && bindings.length > 0) {
                bindings.forEach(binding => {
                    if (!found && this.keybindings.isEnabledInScope(binding, this.node)) {
                        found = true;
                        result = ` (${this.keybindings.acceleratorFor(binding, '+')})`;
                    }
                });
            }
        }
        return result;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderInlineCommand(actionMenuNode, index, tabbable, args) {
        if (!actionMenuNode.icon || !this.commands.isVisible(actionMenuNode.command, ...args) || !actionMenuNode.when || !this.contextKeys.match(actionMenuNode.when)) {
            return false;
        }
        const className = [browser_1.TREE_NODE_SEGMENT_CLASS, browser_1.TREE_NODE_TAIL_CLASS, actionMenuNode.icon, widget_1.ACTION_ITEM, 'theia-tree-view-inline-action'].join(' ');
        const tabIndex = tabbable ? 0 : undefined;
        const titleString = actionMenuNode.label + this.resolveKeybindingForCommand(actionMenuNode.command);
        return React.createElement("div", { key: index, className: className, title: titleString, tabIndex: tabIndex, onClick: e => {
                e.stopPropagation();
                this.commands.executeCommand(actionMenuNode.command, ...args);
            } });
    }
    toContextMenuArgs(target) {
        if (this.options.multiSelect) {
            return [this.toTreeViewItemReference(target), this.model.selectedNodes.map(node => this.toTreeViewItemReference(node))];
        }
        else {
            return [this.toTreeViewItemReference(target)];
        }
    }
    setFlag(flag) {
        super.setFlag(flag);
        if (flag === widget_1.Widget.Flag.IsVisible) {
            this.onDidChangeVisibilityEmitter.fire(this.isVisible);
        }
    }
    clearFlag(flag) {
        super.clearFlag(flag);
        if (flag === widget_1.Widget.Flag.IsVisible) {
            this.onDidChangeVisibilityEmitter.fire(this.isVisible);
        }
    }
    handleEnter(event) {
        super.handleEnter(event);
        this.tryExecuteCommand();
    }
    tapNode(node) {
        super.tapNode(node);
        this.findCommands(node).then(commandMap => {
            if (commandMap.size > 0) {
                this.tryExecuteCommandMap(commandMap);
            }
            else if (node && this.isExpandable(node)) {
                this.model.toggleNodeExpansion(node);
            }
        });
    }
    // execute TreeItem.command if present
    async tryExecuteCommand(node) {
        this.tryExecuteCommandMap(await this.findCommands(node));
    }
    tryExecuteCommandMap(commandMap) {
        commandMap.forEach((args, commandId) => {
            this.commands.executeCommand(commandId, ...args);
        });
    }
    async findCommands(node) {
        const commandMap = new Map();
        const treeNodes = (node ? [node] : this.model.selectedNodes);
        if (await this.model.hasTreeItemResolve) {
            const cancellationToken = new common_1.CancellationTokenSource().token;
            // Resolve all resolvable nodes that don't have a command and haven't been resolved.
            const allResolved = Promise.all(treeNodes.map(maybeNeedsResolve => {
                if (!maybeNeedsResolve.command && maybeNeedsResolve instanceof ResolvableTreeViewNode && !maybeNeedsResolve.resolved) {
                    return maybeNeedsResolve.resolve(cancellationToken).catch(err => {
                        console.error(`Failed to resolve tree item '${maybeNeedsResolve.id}'`, err);
                    });
                }
                return Promise.resolve(maybeNeedsResolve);
            }));
            // Only need to wait but don't need the values because tree items are resolved in place.
            await allResolved;
        }
        for (const treeNode of treeNodes) {
            if (treeNode && treeNode.command) {
                commandMap.set(treeNode.command.id, treeNode.command.arguments || []);
            }
        }
        return commandMap;
    }
    get message() {
        return this._message;
    }
    set message(message) {
        this._message = message;
        this.update();
    }
    render() {
        return React.createElement('div', this.createContainerAttributes(), this.renderSearchInfo(), this.renderTree(this.model));
    }
    renderSearchInfo() {
        if (this._message) {
            return React.createElement("div", { className: 'theia-TreeViewInfo' }, this._message);
        }
        return undefined;
    }
    shouldShowWelcomeView() {
        return (this.model.proxy === undefined || this.model.isTreeEmpty) && this.message === undefined;
    }
    handleContextMenuEvent(node, event) {
        if (browser_1.SelectableTreeNode.is(node)) {
            // Keep the selection for the context menu, if the widget support multi-selection and the right click happens on an already selected node.
            if (!this.props.multiSelect || !node.selected) {
                const type = !!this.props.multiSelect && this.hasCtrlCmdMask(event) ? browser_1.TreeSelection.SelectionType.TOGGLE : browser_1.TreeSelection.SelectionType.DEFAULT;
                this.model.addSelection({ node, type });
            }
            this.focusService.setFocus(node);
            const contextMenuPath = this.props.contextMenuPath;
            if (contextMenuPath) {
                const { x, y } = event.nativeEvent;
                const args = this.toContextMenuArgs(node);
                const contextKeyService = this.contextKeyService.createOverlay([
                    ['viewItem', (TreeViewNode.is(node) && node.contextValue) || undefined],
                    ['view', this.options.id]
                ]);
                setTimeout(() => this.contextMenuRenderer.render({
                    menuPath: contextMenuPath,
                    anchor: { x, y },
                    args,
                    contextKeyService,
                    onHide: () => contextKeyService.dispose(),
                }), 10);
            }
        }
        event.stopPropagation();
        event.preventDefault();
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], TreeViewWidget.prototype, "applicationShell", void 0);
__decorate([
    (0, inversify_1.inject)(menu_1.MenuModelRegistry),
    __metadata("design:type", menu_1.MenuModelRegistry)
], TreeViewWidget.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], TreeViewWidget.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TreeViewWidget.prototype, "contextKeys", void 0);
__decorate([
    (0, inversify_1.inject)(TreeViewWidgetOptions),
    __metadata("design:type", TreeViewWidgetOptions)
], TreeViewWidget.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(PluginTreeModel),
    __metadata("design:type", PluginTreeModel)
], TreeViewWidget.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TreeViewWidget.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.HoverService),
    __metadata("design:type", browser_1.HoverService)
], TreeViewWidget.prototype, "hoverService", void 0);
__decorate([
    (0, inversify_1.inject)(label_parser_1.LabelParser),
    __metadata("design:type", label_parser_1.LabelParser)
], TreeViewWidget.prototype, "labelParser", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], TreeViewWidget.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(dnd_file_content_store_1.DnDFileContentStore),
    __metadata("design:type", dnd_file_content_store_1.DnDFileContentStore)
], TreeViewWidget.prototype, "dndFileContentStore", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeViewWidget.prototype, "init", null);
TreeViewWidget = __decorate([
    (0, inversify_1.injectable)()
], TreeViewWidget);
exports.TreeViewWidget = TreeViewWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view/tree-view-widget'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview/webview-environment.js":
/*!*********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview/webview-environment.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.WebviewEnvironment = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const endpoint_1 = __webpack_require__(/*! @theia/core/lib/browser/endpoint */ "../../packages/core/lib/browser/endpoint.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const webview_protocol_1 = __webpack_require__(/*! ../../common/webview-protocol */ "../../packages/plugin-ext/lib/main/common/webview-protocol.js");
const environment_1 = __webpack_require__(/*! @theia/core/shared/@theia/application-package/lib/environment */ "../../packages/core/shared/@theia/application-package/lib/environment/index.js");
let WebviewEnvironment = class WebviewEnvironment {
    constructor() {
        this.externalEndpointHost = new promise_util_1.Deferred();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this._hostPatternPromise = this.getHostPattern();
        try {
            const endpointPattern = await this.hostPatternPromise;
            const { host } = new endpoint_1.Endpoint();
            this.externalEndpointHost.resolve(endpointPattern.replace('{{hostname}}', host));
        }
        catch (e) {
            this.externalEndpointHost.reject(e);
        }
    }
    get hostPatternPromise() {
        return this._hostPatternPromise;
    }
    async externalEndpointUrl() {
        const host = await this.externalEndpointHost.promise;
        return new endpoint_1.Endpoint({
            host,
            path: '/webview'
        }).getRestUrl();
    }
    async externalEndpoint() {
        return (await this.externalEndpointUrl()).toString(true);
    }
    async resourceRoot(host) {
        if (host === 'frontend') {
            return (await this.externalEndpointUrl()).withPath('{{path}}').toString(true);
        }
        // Make sure we preserve the scheme of the resource but convert it into a normal path segment
        // The scheme is important as we need to know if we are requesting a local or a remote resource.
        return (await this.externalEndpointUrl()).resolve('theia-resource/{{scheme}}//{{authority}}/{{path}}').toString(true);
    }
    async cspSource() {
        return (await this.externalEndpointUrl()).withPath('').withQuery('').withFragment('').toString(true).replace('{{uuid}}', '*');
    }
    async getHostPattern() {
        return environment_1.environment.electron.is()
            ? webview_protocol_1.WebviewExternalEndpoint.defaultPattern
            : this.environments.getValue(webview_protocol_1.WebviewExternalEndpoint.pattern)
                .then(variable => (variable === null || variable === void 0 ? void 0 : variable.value) || webview_protocol_1.WebviewExternalEndpoint.defaultPattern);
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], WebviewEnvironment.prototype, "environments", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebviewEnvironment.prototype, "init", null);
WebviewEnvironment = __decorate([
    (0, inversify_1.injectable)()
], WebviewEnvironment);
exports.WebviewEnvironment = WebviewEnvironment;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview/webview-environment'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview/webview-preferences.js":
/*!*********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview/webview-preferences.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.bindWebviewPreferences = exports.createWebviewPreferences = exports.WebviewPreferences = exports.WebviewPreferenceContribution = exports.WebviewConfigSchema = void 0;
const frontend_application_config_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-config-provider */ "../../packages/core/lib/browser/frontend-application-config-provider.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const frontendConfig = frontend_application_config_provider_1.FrontendApplicationConfigProvider.get();
exports.WebviewConfigSchema = {
    type: 'object',
    properties: {
        'webview.trace': {
            type: 'string',
            enum: ['off', 'on', 'verbose'],
            description: nls_1.nls.localize('theia/plugin-ext/webviewTrace', 'Controls communication tracing with webviews.'),
            default: 'off'
        }
    }
};
if (frontendConfig.securityWarnings) {
    exports.WebviewConfigSchema.properties["webview.warnIfUnsecure"] = {
        scope: 'application',
        type: 'boolean',
        description: nls_1.nls.localize('theia/plugin-ext/webviewWarnIfUnsecure', 'Warns users that webviews are currently deployed unsecurely.'),
        default: true,
    };
}
exports.WebviewPreferenceContribution = Symbol('WebviewPreferenceContribution');
exports.WebviewPreferences = Symbol('WebviewPreferences');
function createWebviewPreferences(preferences, schema = exports.WebviewConfigSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createWebviewPreferences = createWebviewPreferences;
function bindWebviewPreferences(bind) {
    bind(exports.WebviewPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(preferences_1.PreferenceService);
        const contribution = ctx.container.get(exports.WebviewPreferenceContribution);
        return createWebviewPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.WebviewPreferenceContribution).toConstantValue({ schema: exports.WebviewConfigSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.WebviewPreferenceContribution);
}
exports.bindWebviewPreferences = bindWebviewPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview/webview-preferences'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview/webview-resource-cache.js":
/*!************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview/webview-resource-cache.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.WebviewResourceCache = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
/**
 * Browser based cache of webview resources across all instances.
 */
let WebviewResourceCache = class WebviewResourceCache {
    constructor() {
        this.cache = new promise_util_1.Deferred();
        this.resolveCache();
    }
    async resolveCache() {
        try {
            this.cache.resolve(await caches.open('webview:v1'));
        }
        catch (e) {
            console.error('Failed to enable webview caching: ', e);
            this.cache.resolve(undefined);
        }
    }
    async match(url) {
        const cache = await this.cache.promise;
        if (!cache) {
            return undefined;
        }
        const response = await cache.match(url);
        if (!response) {
            return undefined;
        }
        return {
            eTag: response.headers.get('ETag') || undefined,
            body: async () => {
                const buffer = await response.arrayBuffer();
                return new Uint8Array(buffer);
            }
        };
    }
    async delete(url) {
        const cache = await this.cache.promise;
        if (!cache) {
            return false;
        }
        return cache.delete(url);
    }
    async put(url, response) {
        if (!response.eTag) {
            return;
        }
        const cache = await this.cache.promise;
        if (!cache) {
            return;
        }
        const body = await response.body();
        await cache.put(url, new Response(body, {
            status: 200,
            headers: { 'ETag': response.eTag }
        }));
    }
};
WebviewResourceCache = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], WebviewResourceCache);
exports.WebviewResourceCache = WebviewResourceCache;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview/webview-resource-cache'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview/webview-theme-data-provider.js":
/*!*****************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview/webview-theme-data-provider.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// copied and modified from https://github.com/microsoft/vscode/blob/ba40bd16433d5a817bfae15f3b4350e18f144af4/src/vs/workbench/contrib/webview/common/themeing.ts
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
exports.WebviewThemeDataProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const editor_preferences_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-preferences */ "../../packages/editor/lib/browser/editor-preferences.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const color_application_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/color-application-contribution */ "../../packages/core/lib/browser/color-application-contribution.js");
let WebviewThemeDataProvider = class WebviewThemeDataProvider {
    constructor() {
        this.onDidChangeThemeDataEmitter = new event_1.Emitter();
        this.onDidChangeThemeData = this.onDidChangeThemeDataEmitter.event;
        this.editorStyles = new Map([
            ['editor.fontFamily', 'editor-font-family'],
            ['editor.fontWeight', 'editor-font-weight'],
            ['editor.fontSize', 'editor-font-size']
        ]);
    }
    init() {
        this.colorContribution.onDidChange(() => this.reset());
        this.editorPreferences.onPreferenceChanged(e => {
            if (this.editorStyles.has(e.preferenceName)) {
                this.reset();
            }
        });
    }
    reset() {
        if (this.themeData) {
            this.themeData = undefined;
            this.onDidChangeThemeDataEmitter.fire(undefined);
        }
    }
    getThemeData() {
        if (!this.themeData) {
            this.themeData = this.computeThemeData();
        }
        return this.themeData;
    }
    computeThemeData() {
        const styles = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addStyle = (id, rawValue) => {
            if (rawValue) {
                const value = typeof rawValue === 'number' || typeof rawValue === 'string' ? rawValue : String(rawValue);
                styles[this.colors.toCssVariableName(id).substring(2)] = value;
                styles[this.colors.toCssVariableName(id, 'vscode').substring(2)] = value;
            }
        };
        addStyle('font-family', '-apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "Ubuntu", "Droid Sans", sans-serif');
        addStyle('font-weight', 'normal');
        addStyle('font-size', '13px');
        this.editorStyles.forEach((value, key) => addStyle(value, this.editorPreferences[key]));
        for (const id of this.colors.getColors()) {
            const color = this.colors.getCurrentColor(id);
            if (color) {
                addStyle(id, color.toString());
            }
        }
        const activeTheme = this.getActiveTheme();
        return {
            styles,
            activeThemeName: activeTheme.label,
            activeThemeType: this.getThemeType(activeTheme)
        };
    }
    getActiveTheme() {
        return this.themeService.getCurrentTheme();
    }
    getThemeType(theme) {
        switch (theme.type) {
            case 'light': return 'vscode-light';
            case 'dark': return 'vscode-dark';
            default: return 'vscode-high-contrast';
        }
    }
};
__decorate([
    (0, inversify_1.inject)(editor_preferences_1.EditorPreferences),
    __metadata("design:type", Object)
], WebviewThemeDataProvider.prototype, "editorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], WebviewThemeDataProvider.prototype, "colors", void 0);
__decorate([
    (0, inversify_1.inject)(color_application_contribution_1.ColorApplicationContribution),
    __metadata("design:type", color_application_contribution_1.ColorApplicationContribution)
], WebviewThemeDataProvider.prototype, "colorContribution", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], WebviewThemeDataProvider.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebviewThemeDataProvider.prototype, "init", null);
WebviewThemeDataProvider = __decorate([
    (0, inversify_1.injectable)()
], WebviewThemeDataProvider);
exports.WebviewThemeDataProvider = WebviewThemeDataProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview/webview-theme-data-provider'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview/webview.js":
/*!*********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview/webview.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
// copied and modified from https://github.com/microsoft/vscode/blob/ba40bd16433d5a817bfae15f3b4350e18f144af4/src/vs/workbench/contrib/webview/browser/baseWebviewElement.ts
// copied and modified from https://github.com/microsoft/vscode/blob/ba40bd16433d5a817bfae15f3b4350e18f144af4/src/vs/workbench/contrib/webview/browser/webviewElement.ts#
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebviewWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebviewWidget = exports.WebviewWidgetExternalEndpoint = exports.WebviewWidgetIdentifier = void 0;
const mime = __webpack_require__(/*! mime */ "../../packages/plugin-ext/node_modules/mime/index.js");
const coreutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/coreutils */ "../../packages/core/shared/@phosphor/coreutils/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/widget */ "../../packages/core/lib/browser/widgets/widget.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const application_shell_mouse_tracker_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/application-shell-mouse-tracker */ "../../packages/core/lib/browser/shell/application-shell-mouse-tracker.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const webview_environment_1 = __webpack_require__(/*! ./webview-environment */ "../../packages/plugin-ext/lib/main/browser/webview/webview-environment.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const keybinding_1 = __webpack_require__(/*! @theia/core/lib/browser/keybinding */ "../../packages/core/lib/browser/keybinding.js");
const uri_components_1 = __webpack_require__(/*! ../../../common/uri-components */ "../../packages/plugin-ext/lib/common/uri-components.js");
const plugin_shared_style_1 = __webpack_require__(/*! ../plugin-shared-style */ "../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js");
const webview_theme_data_provider_1 = __webpack_require__(/*! ./webview-theme-data-provider */ "../../packages/plugin-ext/lib/main/browser/webview/webview-theme-data-provider.js");
const external_uri_service_1 = __webpack_require__(/*! @theia/core/lib/browser/external-uri-service */ "../../packages/core/lib/browser/external-uri-service.js");
const output_channel_1 = __webpack_require__(/*! @theia/output/lib/browser/output-channel */ "../../packages/output/lib/browser/output-channel.js");
const webview_preferences_1 = __webpack_require__(/*! ./webview-preferences */ "../../packages/plugin-ext/lib/main/browser/webview/webview-preferences.js");
const webview_resource_cache_1 = __webpack_require__(/*! ./webview-resource-cache */ "../../packages/plugin-ext/lib/main/browser/webview/webview-resource-cache.js");
const endpoint_1 = __webpack_require__(/*! @theia/core/lib/browser/endpoint */ "../../packages/core/lib/browser/endpoint.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser/browser */ "../../packages/core/lib/browser/browser.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const files_1 = __webpack_require__(/*! @theia/filesystem/lib/common/files */ "../../packages/filesystem/lib/common/files.js");
const buffer_1 = __webpack_require__(/*! @theia/core/lib/common/buffer */ "../../packages/core/lib/common/buffer.js");
// Style from core
const TRANSPARENT_OVERLAY_STYLE = 'theia-transparent-overlay';
let WebviewWidgetIdentifier = class WebviewWidgetIdentifier {
};
WebviewWidgetIdentifier = __decorate([
    (0, inversify_1.injectable)()
], WebviewWidgetIdentifier);
exports.WebviewWidgetIdentifier = WebviewWidgetIdentifier;
exports.WebviewWidgetExternalEndpoint = Symbol('WebviewWidgetExternalEndpoint');
let WebviewWidget = WebviewWidget_1 = class WebviewWidget extends widget_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.viewState = {
            visible: false,
            active: false,
            position: 0
        };
        this.html = '';
        this._contentOptions = {};
        this.options = {};
        this.ready = new promise_util_1.Deferred();
        this.onMessageEmitter = new event_1.Emitter();
        this.onMessage = this.onMessageEmitter.event;
        this.pendingMessages = [];
        this.toHide = new disposable_1.DisposableCollection();
        this.isExtractable = true;
        this.secondaryWindow = undefined;
        this.onDidChangeBadgeEmitter = new event_1.Emitter();
        this.onDidChangeBadgeTooltipEmitter = new event_1.Emitter();
        this.toDisposeOnIcon = new disposable_1.DisposableCollection();
    }
    get contentOptions() {
        return this._contentOptions;
    }
    get state() {
        return this._state;
    }
    init() {
        this.node.tabIndex = 0;
        this.id = WebviewWidget_1.FACTORY_ID + ':' + this.identifier.id;
        this.title.closable = true;
        this.addClass(WebviewWidget_1.Styles.WEBVIEW);
        this.toDispose.push(this.onMessageEmitter);
        this.toDispose.push(this.onDidChangeBadgeEmitter);
        this.toDispose.push(this.onDidChangeBadgeTooltipEmitter);
        this.transparentOverlay = document.createElement('div');
        this.transparentOverlay.classList.add(TRANSPARENT_OVERLAY_STYLE);
        this.transparentOverlay.style.display = 'none';
        this.node.appendChild(this.transparentOverlay);
        this.toDispose.push(this.mouseTracker.onMousedown(() => {
            if (this.element && this.element.style.display !== 'none') {
                this.transparentOverlay.style.display = 'block';
            }
        }));
        this.toDispose.push(this.mouseTracker.onMouseup(() => {
            if (this.element && this.element.style.display !== 'none') {
                this.transparentOverlay.style.display = 'none';
            }
        }));
    }
    get onDidChangeBadge() {
        return this.onDidChangeBadgeEmitter.event;
    }
    get onDidChangeBadgeTooltip() {
        return this.onDidChangeBadgeTooltipEmitter.event;
    }
    get badge() {
        return this._badge;
    }
    set badge(badge) {
        this._badge = badge;
        this.onDidChangeBadgeEmitter.fire();
    }
    get badgeTooltip() {
        return this._badgeTooltip;
    }
    set badgeTooltip(badgeTooltip) {
        this._badgeTooltip = badgeTooltip;
        this.onDidChangeBadgeTooltipEmitter.fire();
    }
    onBeforeAttach(msg) {
        super.onBeforeAttach(msg);
        this.doShow();
        // iframe has to be reloaded when moved to another DOM element
        this.toDisposeOnDetach.push(disposable_1.Disposable.create(() => this.forceHide()));
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.addEventListener(this.node, 'focus', () => {
            if (this.element) {
                this.doSend('focus');
            }
        });
    }
    onBeforeShow(msg) {
        super.onBeforeShow(msg);
        this.doShow();
    }
    onAfterHide(msg) {
        super.onAfterHide(msg);
        this.doHide();
    }
    doHide() {
        if (this.options.retainContextWhenHidden !== true) {
            if (this.hideTimeout === undefined) {
                // avoid removing iframe if a widget moved quickly
                this.hideTimeout = setTimeout(() => this.forceHide(), 50);
            }
        }
    }
    forceHide() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = undefined;
        this.toHide.dispose();
    }
    doShow() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = undefined;
        if (!this.toHide.disposed) {
            return;
        }
        this.toDispose.push(this.toHide);
        const element = document.createElement('iframe');
        element.className = 'webview';
        element.sandbox.add('allow-scripts', 'allow-forms', 'allow-same-origin', 'allow-downloads');
        if (!browser_1.isFirefox) {
            element.setAttribute('allow', 'clipboard-read; clipboard-write; usb; serial; hid;');
        }
        element.setAttribute('src', `${this.externalEndpoint}/index.html?id=${this.identifier.id}`);
        element.style.border = 'none';
        element.style.width = '100%';
        element.style.height = '100%';
        this.element = element;
        this.node.appendChild(this.element);
        this.toHide.push(disposable_1.Disposable.create(() => {
            if (this.element) {
                this.element.remove();
                this.element = undefined;
            }
        }));
        const oldReady = this.ready;
        const ready = new promise_util_1.Deferred();
        ready.promise.then(() => oldReady.resolve());
        this.ready = ready;
        this.toHide.push(disposable_1.Disposable.create(() => this.ready = new promise_util_1.Deferred()));
        const subscription = this.on("webview-ready" /* webviewReady */, () => {
            subscription.dispose();
            ready.resolve();
        });
        this.toHide.push(subscription);
        this.toHide.push(this.on("onmessage" /* onmessage */, (data) => this.onMessageEmitter.fire(data)));
        this.toHide.push(this.on("did-click-link" /* didClickLink */, (uri) => this.openLink(new uri_1.default(uri))));
        this.toHide.push(this.on("do-update-state" /* doUpdateState */, (state) => {
            this._state = state;
        }));
        this.toHide.push(this.on("did-focus" /* didFocus */, () => 
        // emulate the webview focus without actually changing focus
        this.node.dispatchEvent(new FocusEvent('focus'))));
        this.toHide.push(this.on("did-blur" /* didBlur */, () => {
            /* no-op: webview loses focus only if another element gains focus in the main window */
        }));
        this.toHide.push(this.on("do-reload" /* doReload */, () => this.reload()));
        this.toHide.push(this.on("load-resource" /* loadResource */, (entry) => this.loadResource(entry.path)));
        this.toHide.push(this.on("load-localhost" /* loadLocalhost */, (entry) => this.loadLocalhost(entry.origin)));
        this.toHide.push(this.on("did-keydown" /* didKeydown */, (data) => {
            // Electron: workaround for https://github.com/electron/electron/issues/14258
            // We have to detect keyboard events in the <webview> and dispatch them to our
            // keybinding service because these events do not bubble to the parent window anymore.
            this.keybindings.dispatchKeyDown(data, this.element);
        }));
        this.toHide.push(this.on("did-mousedown" /* didMouseDown */, (data) => {
            // We have to dispatch mousedown events so menus will be closed when clicking inside webviews.
            // See: https://github.com/eclipse-theia/theia/issues/7752
            this.dispatchMouseEvent('mousedown', data);
        }));
        this.toHide.push(this.on("did-mouseup" /* didMouseUp */, (data) => {
            this.dispatchMouseEvent('mouseup', data);
        }));
        this.style();
        this.toHide.push(this.themeDataProvider.onDidChangeThemeData(() => this.style()));
        this.doUpdateContent();
        while (this.pendingMessages.length) {
            this.sendMessage(this.pendingMessages.shift());
        }
    }
    async loadLocalhost(origin) {
        const redirect = await this.getRedirect(origin);
        return this.doSend('did-load-localhost', { origin, location: redirect });
    }
    dispatchMouseEvent(type, data) {
        const domRect = this.node.getBoundingClientRect();
        document.dispatchEvent(new MouseEvent(type, {
            ...data,
            clientX: domRect.x + data.clientX,
            clientY: domRect.y + data.clientY
        }));
    }
    async getRedirect(url) {
        const uri = new uri_1.default(url);
        const localhost = this.externalUriService.parseLocalhost(uri);
        if (!localhost) {
            return undefined;
        }
        if (this._contentOptions.portMapping) {
            for (const mapping of this._contentOptions.portMapping) {
                if (mapping.webviewPort === localhost.port) {
                    if (mapping.webviewPort !== mapping.extensionHostPort) {
                        return this.toRemoteUrl(uri.withAuthority(`${localhost.address}:${mapping.extensionHostPort}`));
                    }
                }
            }
        }
        return this.toRemoteUrl(uri);
    }
    async toRemoteUrl(localUri) {
        const remoteUri = await this.externalUriService.resolve(localUri);
        const remoteUrl = remoteUri.toString();
        if (remoteUrl[remoteUrl.length - 1] === '/') {
            return remoteUrl.slice(0, remoteUrl.length - 1);
        }
        return remoteUrl;
    }
    setContentOptions(contentOptions) {
        if (coreutils_1.JSONExt.deepEqual(this.contentOptions, contentOptions)) {
            return;
        }
        this._contentOptions = contentOptions;
        this.doUpdateContent();
    }
    setIconUrl(iconUrl) {
        if ((this.iconUrl && iconUrl && coreutils_1.JSONExt.deepEqual(this.iconUrl, iconUrl)) || (this.iconUrl === iconUrl)) {
            return;
        }
        this.toDisposeOnIcon.dispose();
        this.toDispose.push(this.toDisposeOnIcon);
        this.iconUrl = iconUrl;
        if (iconUrl) {
            const darkIconUrl = typeof iconUrl === 'object' ? iconUrl.dark : iconUrl;
            const lightIconUrl = typeof iconUrl === 'object' ? iconUrl.light : iconUrl;
            const iconClass = `webview-${this.identifier.id}-file-icon`;
            this.toDisposeOnIcon.push(this.sharedStyle.insertRule(`.theia-webview-icon.${iconClass}::before`, theme => `background-image: url(${this.toEndpoint(theme.type === 'light' ? lightIconUrl : darkIconUrl)});`));
            this.title.iconClass = `theia-webview-icon ${iconClass}`;
        }
        else {
            this.title.iconClass = '';
        }
    }
    toEndpoint(pathname) {
        return new endpoint_1.Endpoint({ path: pathname }).getRestUrl().toString();
    }
    setHTML(value) {
        this.html = this.preprocessHtml(value);
        this.doUpdateContent();
    }
    preprocessHtml(value) {
        return value
            .replace(/(["'])(?:vscode|theia)-resource:(\/\/([^\s\/'"]+?)(?=\/))?([^\s'"]+?)(["'])/gi, (_, startQuote, _1, scheme, path, endQuote) => {
            if (scheme) {
                return `${startQuote}${this.externalEndpoint}/theia-resource/${scheme}${path}${endQuote}`;
            }
            return `${startQuote}${this.externalEndpoint}/theia-resource/file${path}${endQuote}`;
        });
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
    }
    reload() {
        this.doUpdateContent();
    }
    style() {
        const { styles, activeThemeType, activeThemeName } = this.themeDataProvider.getThemeData();
        this.doSend('styles', { styles, activeThemeType, activeThemeName });
    }
    openLink(link) {
        const supported = this.toSupportedLink(link);
        if (supported) {
            (0, opener_service_1.open)(this.openerService, supported);
        }
    }
    toSupportedLink(link) {
        if (WebviewWidget_1.standardSupportedLinkSchemes.has(link.scheme)) {
            const linkAsString = link.toString();
            for (const resourceRoot of [this.externalEndpoint + '/theia-resource', this.externalEndpoint + '/vscode-resource']) {
                if (linkAsString.startsWith(resourceRoot + '/')) {
                    return this.normalizeRequestUri(linkAsString.substring(resourceRoot.length));
                }
            }
            return link;
        }
        if (link.scheme === uri_components_1.Schemes.command) {
            if (Array.isArray(this.contentOptions.enableCommandUris) && this.contentOptions.enableCommandUris.some(value => value === link.path.toString())) {
                return link;
            }
            else if (this.contentOptions.enableCommandUris === true) {
                return link;
            }
        }
        return undefined;
    }
    async loadResource(requestPath) {
        const normalizedUri = this.normalizeRequestUri(requestPath);
        // browser cache does not support file scheme, normalize to current endpoint scheme and host
        const cacheUrl = new endpoint_1.Endpoint({ path: normalizedUri.path.toString() }).getRestUrl().toString();
        try {
            if (this.contentOptions.localResourceRoots) {
                for (const root of this.contentOptions.localResourceRoots) {
                    if (!new uri_1.default(root).path.isEqualOrParent(normalizedUri.path)) {
                        continue;
                    }
                    let cached = await this.resourceCache.match(cacheUrl);
                    try {
                        const result = await this.fileService.readFileStream(normalizedUri, { etag: cached === null || cached === void 0 ? void 0 : cached.eTag });
                        const { buffer } = await buffer_1.BinaryBufferReadableStream.toBuffer(result.value);
                        cached = { body: () => buffer, eTag: result.etag };
                        this.resourceCache.put(cacheUrl, cached);
                    }
                    catch (e) {
                        if (!(e instanceof files_1.FileOperationError && e.fileOperationResult === 2 /* FILE_NOT_MODIFIED_SINCE */)) {
                            throw e;
                        }
                    }
                    if (cached) {
                        const data = await cached.body();
                        return this.doSend('did-load-resource', {
                            status: 200,
                            path: requestPath,
                            mime: mime.getType(normalizedUri.path.toString()) || 'application/octet-stream',
                            data
                        });
                    }
                }
            }
        }
        catch {
            // no-op
        }
        this.resourceCache.delete(cacheUrl);
        return this.doSend('did-load-resource', {
            status: 404,
            path: requestPath
        });
    }
    normalizeRequestUri(requestPath) {
        const normalizedPath = decodeURIComponent(requestPath);
        const requestUri = new uri_1.default(normalizedPath.replace(/^\/([a-zA-Z0-9.\-+]+)\/(.+)$/, (_, scheme, path) => scheme + ':/' + path));
        if (requestUri.scheme !== 'theia-resource' && requestUri.scheme !== 'vscode-resource') {
            return requestUri;
        }
        // Modern vscode-resources uris put the scheme of the requested resource as the authority
        if (requestUri.authority) {
            return new uri_1.default(requestUri.authority + ':' + requestUri.path);
        }
        // Old style vscode-resource uris lose the scheme of the resource which means they are unable to
        // load a mix of local and remote content properly.
        return requestUri.withScheme('file');
    }
    sendMessage(data) {
        if (this.element) {
            this.doSend('message', data);
        }
        else {
            this.pendingMessages.push(data);
        }
    }
    doUpdateContent() {
        this.doSend('content', {
            contents: this.html,
            options: this.contentOptions,
            state: this.state
        });
    }
    storeState() {
        return {
            viewType: this.viewType,
            title: this.title.label,
            iconUrl: this.iconUrl,
            options: this.options,
            contentOptions: this.contentOptions,
            state: this.state
        };
    }
    restoreState(oldState) {
        const { viewType, title, iconUrl, options, contentOptions, state } = oldState;
        this.viewType = viewType;
        this.title.label = title;
        this.setIconUrl(iconUrl);
        this.options = options;
        this._contentOptions = contentOptions;
        this._state = state;
    }
    setIframeHeight(height) {
        if (this.element) {
            this.element.style.height = `${height}px`;
        }
    }
    async doSend(channel, data) {
        if (!this.element) {
            return;
        }
        try {
            await this.ready.promise;
            this.postMessage(channel, data);
        }
        catch (e) {
            console.error(e);
        }
    }
    postMessage(channel, data) {
        if (this.element) {
            this.trace('out', channel, data);
            if (this.secondaryWindow) {
                this.secondaryWindow.postMessage({ channel, args: data }, '*');
            }
            else {
                this.element.contentWindow.postMessage({ channel, args: data }, '*');
            }
        }
    }
    on(channel, handler) {
        const listener = (e) => {
            if (!e || !e.data || e.data.target !== this.identifier.id) {
                return;
            }
            if (e.data.channel === channel) {
                this.trace('in', e.data.channel, e.data.data);
                handler(e.data.data);
            }
        };
        window.addEventListener('message', listener);
        return disposable_1.Disposable.create(() => window.removeEventListener('message', listener));
    }
    trace(kind, channel, data) {
        const value = this.preferences['webview.trace'];
        if (value === 'off') {
            return;
        }
        const output = this.outputManager.getChannel('webviews');
        output.append('\n' + this.identifier.id);
        output.append(kind === 'out' ? ' => ' : ' <= ');
        output.append(channel);
        if (value === 'verbose') {
            if (data) {
                output.append('\n' + JSON.stringify(data, undefined, 2));
            }
        }
    }
};
WebviewWidget.standardSupportedLinkSchemes = new Set([
    uri_components_1.Schemes.http,
    uri_components_1.Schemes.https,
    uri_components_1.Schemes.mailto,
    uri_components_1.Schemes.vscode
]);
WebviewWidget.FACTORY_ID = 'plugin-webview';
__decorate([
    (0, inversify_1.inject)(WebviewWidgetIdentifier),
    __metadata("design:type", WebviewWidgetIdentifier)
], WebviewWidget.prototype, "identifier", void 0);
__decorate([
    (0, inversify_1.inject)(exports.WebviewWidgetExternalEndpoint),
    __metadata("design:type", String)
], WebviewWidget.prototype, "externalEndpoint", void 0);
__decorate([
    (0, inversify_1.inject)(application_shell_mouse_tracker_1.ApplicationShellMouseTracker),
    __metadata("design:type", application_shell_mouse_tracker_1.ApplicationShellMouseTracker)
], WebviewWidget.prototype, "mouseTracker", void 0);
__decorate([
    (0, inversify_1.inject)(webview_environment_1.WebviewEnvironment),
    __metadata("design:type", webview_environment_1.WebviewEnvironment)
], WebviewWidget.prototype, "environment", void 0);
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], WebviewWidget.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(keybinding_1.KeybindingRegistry),
    __metadata("design:type", keybinding_1.KeybindingRegistry)
], WebviewWidget.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], WebviewWidget.prototype, "sharedStyle", void 0);
__decorate([
    (0, inversify_1.inject)(webview_theme_data_provider_1.WebviewThemeDataProvider),
    __metadata("design:type", webview_theme_data_provider_1.WebviewThemeDataProvider)
], WebviewWidget.prototype, "themeDataProvider", void 0);
__decorate([
    (0, inversify_1.inject)(external_uri_service_1.ExternalUriService),
    __metadata("design:type", external_uri_service_1.ExternalUriService)
], WebviewWidget.prototype, "externalUriService", void 0);
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], WebviewWidget.prototype, "outputManager", void 0);
__decorate([
    (0, inversify_1.inject)(webview_preferences_1.WebviewPreferences),
    __metadata("design:type", Object)
], WebviewWidget.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], WebviewWidget.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(webview_resource_cache_1.WebviewResourceCache),
    __metadata("design:type", webview_resource_cache_1.WebviewResourceCache)
], WebviewWidget.prototype, "resourceCache", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebviewWidget.prototype, "init", null);
WebviewWidget = WebviewWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], WebviewWidget);
exports.WebviewWidget = WebviewWidget;
(function (WebviewWidget) {
    let Styles;
    (function (Styles) {
        Styles.WEBVIEW = 'theia-webview';
    })(Styles = WebviewWidget.Styles || (WebviewWidget.Styles = {}));
})(WebviewWidget = exports.WebviewWidget || (exports.WebviewWidget = {}));
exports.WebviewWidget = WebviewWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview/webview'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/common/webview-protocol.js":
/*!*********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/common/webview-protocol.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.WebviewExternalEndpoint = void 0;
/**
 * Each webview should be deployed on a unique origin (https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
 * to ensure isolation from browser shared state as cookies, local storage and so on.
 *
 * Default hostname pattern of a origin is `{{uuid}}.webview.{{hostname}}`. Where `{{uuid}}` is a placeholder for a webview global id.
 * For electron target the default pattern is always used.
 * For the browser target use `THEIA_WEBVIEW_EXTERNAL_ENDPOINT` env variable to customize it.
 */
var WebviewExternalEndpoint;
(function (WebviewExternalEndpoint) {
    WebviewExternalEndpoint.pattern = 'THEIA_WEBVIEW_EXTERNAL_ENDPOINT';
    WebviewExternalEndpoint.defaultPattern = '{{uuid}}.webview.{{hostname}}';
})(WebviewExternalEndpoint = exports.WebviewExternalEndpoint || (exports.WebviewExternalEndpoint = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/common/webview-protocol'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_plugin-ext_lib_main_browser_custom-editors_custom-editor-opener_js-packages_plugin-e-29d38c.js.map