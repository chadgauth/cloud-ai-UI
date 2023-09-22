"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const monaco_editor_zone_widget_1 = require("@theia/monaco/lib/browser/monaco-editor-zone-widget");
const plugin_api_rpc_model_1 = require("../../../common/plugin-api-rpc-model");
const comment_glyph_widget_1 = require("./comment-glyph-widget");
const browser_1 = require("@theia/core/lib/browser");
const React = require("@theia/core/shared/react");
const browser_2 = require("@theia/editor/lib/browser");
const common_1 = require("@theia/core/lib/common");
const monaco = require("@theia/monaco-editor-core");
const client_1 = require("@theia/core/shared/react-dom/client");
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
//# sourceMappingURL=comment-thread-widget.js.map