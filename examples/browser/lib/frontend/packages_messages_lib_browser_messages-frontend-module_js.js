(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_messages_lib_browser_messages-frontend-module_js"],{

/***/ "../../node_modules/react-perfect-scrollbar/lib/index.js":
/*!***************************************************************!*\
  !*** ../../node_modules/react-perfect-scrollbar/lib/index.js ***!
  \***************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _scrollbar = __webpack_require__(/*! ./scrollbar */ "../../node_modules/react-perfect-scrollbar/lib/scrollbar.js");

var _scrollbar2 = _interopRequireDefault(_scrollbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = _scrollbar2.default;
module.exports = exports['default'];
;(globalThis['theia'] = globalThis['theia'] || {})['react-perfect-scrollbar/lib'] = this;


/***/ }),

/***/ "../../node_modules/react-perfect-scrollbar/lib/scrollbar.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/react-perfect-scrollbar/lib/scrollbar.js ***!
  \*******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "../../node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "../../node_modules/prop-types/index.js");

var _perfectScrollbar = __webpack_require__(/*! perfect-scrollbar */ "../../node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js");

var _perfectScrollbar2 = _interopRequireDefault(_perfectScrollbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var handlerNameByEvent = {
  'ps-scroll-y': 'onScrollY',
  'ps-scroll-x': 'onScrollX',
  'ps-scroll-up': 'onScrollUp',
  'ps-scroll-down': 'onScrollDown',
  'ps-scroll-left': 'onScrollLeft',
  'ps-scroll-right': 'onScrollRight',
  'ps-y-reach-start': 'onYReachStart',
  'ps-y-reach-end': 'onYReachEnd',
  'ps-x-reach-start': 'onXReachStart',
  'ps-x-reach-end': 'onXReachEnd'
};
Object.freeze(handlerNameByEvent);

var ScrollBar = function (_Component) {
  _inherits(ScrollBar, _Component);

  function ScrollBar(props) {
    _classCallCheck(this, ScrollBar);

    var _this = _possibleConstructorReturn(this, (ScrollBar.__proto__ || Object.getPrototypeOf(ScrollBar)).call(this, props));

    _this.handleRef = _this.handleRef.bind(_this);
    _this._handlerByEvent = {};
    return _this;
  }

  _createClass(ScrollBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.option) {
        console.warn('react-perfect-scrollbar: the "option" prop has been deprecated in favor of "options"');
      }

      this._ps = new _perfectScrollbar2.default(this._container, this.props.options || this.props.option);
      // hook up events
      this._updateEventHook();
      this._updateClassName();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this._updateEventHook(prevProps);

      this.updateScroll();

      if (prevProps.className !== this.props.className) {
        this._updateClassName();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this2 = this;

      // unhook up evens
      Object.keys(this._handlerByEvent).forEach(function (key) {
        var value = _this2._handlerByEvent[key];

        if (value) {
          _this2._container.removeEventListener(key, value, false);
        }
      });
      this._handlerByEvent = {};
      this._ps.destroy();
      this._ps = null;
    }
  }, {
    key: '_updateEventHook',
    value: function _updateEventHook() {
      var _this3 = this;

      var prevProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // hook up events
      Object.keys(handlerNameByEvent).forEach(function (key) {
        var callback = _this3.props[handlerNameByEvent[key]];
        var prevCallback = prevProps[handlerNameByEvent[key]];
        if (callback !== prevCallback) {
          if (prevCallback) {
            var prevHandler = _this3._handlerByEvent[key];
            _this3._container.removeEventListener(key, prevHandler, false);
            _this3._handlerByEvent[key] = null;
          }
          if (callback) {
            var handler = function handler() {
              return callback(_this3._container);
            };
            _this3._container.addEventListener(key, handler, false);
            _this3._handlerByEvent[key] = handler;
          }
        }
      });
    }
  }, {
    key: '_updateClassName',
    value: function _updateClassName() {
      var className = this.props.className;


      var psClassNames = this._container.className.split(' ').filter(function (name) {
        return name.match(/^ps([-_].+|)$/);
      }).join(' ');

      if (this._container) {
        this._container.className = 'scrollbar-container' + (className ? ' ' + className : '') + (psClassNames ? ' ' + psClassNames : '');
      }
    }
  }, {
    key: 'updateScroll',
    value: function updateScroll() {
      this.props.onSync(this._ps);
    }
  }, {
    key: 'handleRef',
    value: function handleRef(ref) {
      this._container = ref;
      this.props.containerRef(ref);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          style = _props.style,
          option = _props.option,
          options = _props.options,
          containerRef = _props.containerRef,
          onScrollY = _props.onScrollY,
          onScrollX = _props.onScrollX,
          onScrollUp = _props.onScrollUp,
          onScrollDown = _props.onScrollDown,
          onScrollLeft = _props.onScrollLeft,
          onScrollRight = _props.onScrollRight,
          onYReachStart = _props.onYReachStart,
          onYReachEnd = _props.onYReachEnd,
          onXReachStart = _props.onXReachStart,
          onXReachEnd = _props.onXReachEnd,
          component = _props.component,
          onSync = _props.onSync,
          children = _props.children,
          remainProps = _objectWithoutProperties(_props, ['className', 'style', 'option', 'options', 'containerRef', 'onScrollY', 'onScrollX', 'onScrollUp', 'onScrollDown', 'onScrollLeft', 'onScrollRight', 'onYReachStart', 'onYReachEnd', 'onXReachStart', 'onXReachEnd', 'component', 'onSync', 'children']);

      var Comp = component;

      return _react2.default.createElement(
        Comp,
        _extends({ style: style, ref: this.handleRef }, remainProps),
        children
      );
    }
  }]);

  return ScrollBar;
}(_react.Component);

exports["default"] = ScrollBar;


ScrollBar.defaultProps = {
  className: '',
  style: undefined,
  option: undefined,
  options: undefined,
  containerRef: function containerRef() {},
  onScrollY: undefined,
  onScrollX: undefined,
  onScrollUp: undefined,
  onScrollDown: undefined,
  onScrollLeft: undefined,
  onScrollRight: undefined,
  onYReachStart: undefined,
  onYReachEnd: undefined,
  onXReachStart: undefined,
  onXReachEnd: undefined,
  onSync: function onSync(ps) {
    return ps.update();
  },
  component: 'div'
};

ScrollBar.propTypes = {
  children: _propTypes.PropTypes.node.isRequired,
  className: _propTypes.PropTypes.string,
  style: _propTypes.PropTypes.object,
  option: _propTypes.PropTypes.object,
  options: _propTypes.PropTypes.object,
  containerRef: _propTypes.PropTypes.func,
  onScrollY: _propTypes.PropTypes.func,
  onScrollX: _propTypes.PropTypes.func,
  onScrollUp: _propTypes.PropTypes.func,
  onScrollDown: _propTypes.PropTypes.func,
  onScrollLeft: _propTypes.PropTypes.func,
  onScrollRight: _propTypes.PropTypes.func,
  onYReachStart: _propTypes.PropTypes.func,
  onYReachEnd: _propTypes.PropTypes.func,
  onXReachStart: _propTypes.PropTypes.func,
  onXReachEnd: _propTypes.PropTypes.func,
  onSync: _propTypes.PropTypes.func,
  component: _propTypes.PropTypes.string
};
module.exports = exports['default'];
;(globalThis['theia'] = globalThis['theia'] || {})['react-perfect-scrollbar/lib/scrollbar'] = this;


/***/ }),

/***/ "../../packages/core/shared/dompurify/index.js":
/*!*****************************************************!*\
  !*** ../../packages/core/shared/dompurify/index.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! dompurify */ "../../node_modules/dompurify/dist/purify.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/dompurify'] = this;


/***/ }),

/***/ "../../packages/core/shared/lodash.throttle/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/shared/lodash.throttle/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! lodash.throttle */ "../../node_modules/lodash.throttle/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/lodash.throttle'] = this;


/***/ }),

/***/ "../../packages/core/shared/markdown-it.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/markdown-it.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! markdown-it */ "../../node_modules/markdown-it/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/markdown-it'] = this;


/***/ }),

/***/ "../../packages/core/shared/react-dom/client/index.js":
/*!************************************************************!*\
  !*** ../../packages/core/shared/react-dom/client/index.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react-dom/client */ "../../node_modules/react-dom/client.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react-dom/client'] = this;


/***/ }),

/***/ "../../packages/core/shared/react/index.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/react/index.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react */ "../../node_modules/react/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/messages-frontend-module.js":
/*!***********************************************************************!*\
  !*** ../../packages/messages/lib/browser/messages-frontend-module.js ***!
  \***********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/messages/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const notifications_manager_1 = __webpack_require__(/*! ./notifications-manager */ "../../packages/messages/lib/browser/notifications-manager.js");
const notification_preferences_1 = __webpack_require__(/*! ./notification-preferences */ "../../packages/messages/lib/browser/notification-preferences.js");
const notifications_renderer_1 = __webpack_require__(/*! ./notifications-renderer */ "../../packages/messages/lib/browser/notifications-renderer.js");
const notifications_contribution_1 = __webpack_require__(/*! ./notifications-contribution */ "../../packages/messages/lib/browser/notifications-contribution.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const color_application_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/color-application-contribution */ "../../packages/core/lib/browser/color-application-contribution.js");
const notification_content_renderer_1 = __webpack_require__(/*! ./notification-content-renderer */ "../../packages/messages/lib/browser/notification-content-renderer.js");
exports["default"] = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(notification_content_renderer_1.NotificationContentRenderer).toSelf().inSingletonScope();
    bind(notifications_renderer_1.NotificationsRenderer).toSelf().inSingletonScope();
    bind(notifications_contribution_1.NotificationsContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(notifications_contribution_1.NotificationsContribution);
    bind(core_1.CommandContribution).toService(notifications_contribution_1.NotificationsContribution);
    bind(browser_1.KeybindingContribution).toService(notifications_contribution_1.NotificationsContribution);
    bind(color_application_contribution_1.ColorContribution).toService(notifications_contribution_1.NotificationsContribution);
    bind(browser_1.StylingParticipant).toService(notifications_contribution_1.NotificationsContribution);
    bind(notifications_manager_1.NotificationManager).toSelf().inSingletonScope();
    rebind(common_1.MessageClient).toService(notifications_manager_1.NotificationManager);
    (0, notification_preferences_1.bindNotificationPreferences)(bind);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/messages-frontend-module'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notification-center-component.js":
/*!****************************************************************************!*\
  !*** ../../packages/messages/lib/browser/notification-center-component.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.NotificationCenterComponent = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const notification_component_1 = __webpack_require__(/*! ./notification-component */ "../../packages/messages/lib/browser/notification-component.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const PerfectScrollbar = __webpack_require__(/*! react-perfect-scrollbar */ "../../node_modules/react-perfect-scrollbar/lib/index.js");
class NotificationCenterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.toDisposeOnUnmount = new core_1.DisposableCollection();
        this.onHide = () => {
            this.props.manager.hideCenter();
        };
        this.onClearAll = () => {
            this.props.manager.clearAll();
        };
        this.state = {
            notifications: [],
            visibilityState: 'hidden'
        };
    }
    async componentDidMount() {
        this.toDisposeOnUnmount.push(this.props.manager.onUpdated(({ notifications, visibilityState }) => {
            this.setState({
                notifications: notifications,
                visibilityState
            });
        }));
    }
    componentWillUnmount() {
        this.toDisposeOnUnmount.dispose();
    }
    render() {
        const empty = this.state.notifications.length === 0;
        const title = empty
            ? nls_1.nls.localizeByDefault('No New Notifications')
            : nls_1.nls.localizeByDefault('Notifications');
        return (React.createElement("div", { className: `theia-notifications-container theia-notification-center ${this.state.visibilityState === 'center' ? 'open' : 'closed'}` },
            React.createElement("div", { className: 'theia-notification-center-header' },
                React.createElement("div", { className: 'theia-notification-center-header-title' }, title),
                React.createElement("div", { className: 'theia-notification-center-header-actions' },
                    React.createElement("ul", { className: 'theia-notification-actions' },
                        React.createElement("li", { className: (0, browser_1.codicon)('clear-all', true), title: nls_1.nls.localizeByDefault('Clear All Notifications'), onClick: this.onClearAll }),
                        React.createElement("li", { className: (0, browser_1.codicon)('chevron-down', true), title: nls_1.nls.localizeByDefault('Hide Notifications'), onClick: this.onHide })))),
            React.createElement(PerfectScrollbar, { className: 'theia-notification-list-scroll-container' },
                React.createElement("div", { className: 'theia-notification-list' }, this.state.notifications.map(notification => React.createElement(notification_component_1.NotificationComponent, { key: notification.messageId, notification: notification, manager: this.props.manager }))))));
    }
}
exports.NotificationCenterComponent = NotificationCenterComponent;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notification-center-component'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notification-component.js":
/*!*********************************************************************!*\
  !*** ../../packages/messages/lib/browser/notification-component.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.NotificationComponent = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const DOMPurify = __webpack_require__(/*! @theia/core/shared/dompurify */ "../../packages/core/shared/dompurify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onClear = (event) => {
            if (event.target instanceof HTMLElement) {
                const messageId = event.target.dataset.messageId;
                if (messageId) {
                    this.props.manager.clear(messageId);
                }
            }
        };
        this.onToggleExpansion = (event) => {
            if (event.target instanceof HTMLElement) {
                const messageId = event.target.dataset.messageId;
                if (messageId) {
                    this.props.manager.toggleExpansion(messageId);
                }
            }
        };
        this.onAction = (event) => {
            if (event.target instanceof HTMLElement) {
                const messageId = event.target.dataset.messageId;
                const action = event.target.dataset.action;
                if (messageId && action) {
                    this.props.manager.accept(messageId, action);
                }
            }
        };
        this.onMessageClick = (event) => {
            if (event.target instanceof HTMLAnchorElement) {
                event.stopPropagation();
                event.preventDefault();
                const link = event.target.href;
                this.props.manager.openLink(link);
            }
        };
        this.state = {};
    }
    render() {
        const { messageId, message, type, progress, collapsed, expandable, source, actions } = this.props.notification;
        const isProgress = type === 'progress' || typeof progress === 'number';
        const icon = type === 'progress' ? 'info' : type;
        return (React.createElement("div", { key: messageId, className: 'theia-notification-list-item-container' },
            React.createElement("div", { className: 'theia-notification-list-item', tabIndex: 0 },
                React.createElement("div", { className: `theia-notification-list-item-content ${collapsed ? 'collapsed' : ''}` },
                    React.createElement("div", { className: 'theia-notification-list-item-content-main' },
                        React.createElement("div", { className: `theia-notification-icon ${(0, browser_1.codicon)(icon)} ${icon}` }),
                        React.createElement("div", { className: 'theia-notification-message' },
                            React.createElement("span", { 
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML: {
                                    __html: DOMPurify.sanitize(message, {
                                        ALLOW_UNKNOWN_PROTOCOLS: true // DOMPurify usually strips non http(s) links from hrefs
                                    })
                                }, onClick: this.onMessageClick })),
                        React.createElement("ul", { className: 'theia-notification-actions' },
                            expandable && (React.createElement("li", { className: (0, browser_1.codicon)('chevron-down', true) + (collapsed ? ' expand' : ' collapse'), title: collapsed ? 'Expand' : 'Collapse', "data-message-id": messageId, onClick: this.onToggleExpansion })),
                            !isProgress && (React.createElement("li", { className: (0, browser_1.codicon)('close', true), title: nls_1.nls.localizeByDefault('Clear'), "data-message-id": messageId, onClick: this.onClear })))),
                    (source || !!actions.length) && (React.createElement("div", { className: 'theia-notification-list-item-content-bottom' },
                        React.createElement("div", { className: 'theia-notification-source' }, source && (React.createElement("span", null, source))),
                        React.createElement("div", { className: 'theia-notification-buttons' }, actions && actions.map((action, index) => (React.createElement("button", { key: messageId + `-action-${index}`, className: 'theia-button', "data-message-id": messageId, "data-action": action, onClick: this.onAction }, action))))))),
                isProgress && (React.createElement("div", { className: 'theia-notification-item-progress' },
                    React.createElement("div", { className: `theia-notification-item-progressbar ${progress ? 'determinate' : 'indeterminate'}`, style: { width: `${progress !== null && progress !== void 0 ? progress : '100'}%` } }))))));
    }
}
exports.NotificationComponent = NotificationComponent;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notification-component'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notification-content-renderer.js":
/*!****************************************************************************!*\
  !*** ../../packages/messages/lib/browser/notification-content-renderer.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.NotificationContentRenderer = void 0;
const markdownit = __webpack_require__(/*! @theia/core/shared/markdown-it */ "../../packages/core/shared/markdown-it.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let NotificationContentRenderer = class NotificationContentRenderer {
    constructor() {
        this.mdEngine = markdownit({ html: false });
    }
    renderMessage(content) {
        // in alignment with vscode, new lines aren't supported
        const contentWithoutNewlines = content.replace(/((\r)?\n)+/gm, ' ');
        return this.mdEngine.renderInline(contentWithoutNewlines);
    }
};
NotificationContentRenderer = __decorate([
    (0, inversify_1.injectable)()
], NotificationContentRenderer);
exports.NotificationContentRenderer = NotificationContentRenderer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notification-content-renderer'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notification-preferences.js":
/*!***********************************************************************!*\
  !*** ../../packages/messages/lib/browser/notification-preferences.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindNotificationPreferences = exports.createNotificationPreferences = exports.NotificationPreferences = exports.NotificationPreferenceContribution = exports.NotificationConfigSchema = void 0;
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.NotificationConfigSchema = {
    'type': 'object',
    'properties': {
        'notification.timeout': {
            'type': 'number',
            'description': nls_1.nls.localize('theia/messages/notificationTimeout', 'Informative notifications will be hidden after this timeout.'),
            'default': 30 * 1000 // `0` and negative values are treated as no timeout.
        }
    }
};
exports.NotificationPreferenceContribution = Symbol('NotificationPreferenceContribution');
exports.NotificationPreferences = Symbol('NotificationPreferences');
function createNotificationPreferences(preferences, schema = exports.NotificationConfigSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createNotificationPreferences = createNotificationPreferences;
function bindNotificationPreferences(bind) {
    bind(exports.NotificationPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(preferences_1.PreferenceService);
        const contribution = ctx.container.get(exports.NotificationPreferenceContribution);
        return createNotificationPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.NotificationPreferenceContribution).toConstantValue({ schema: exports.NotificationConfigSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.NotificationPreferenceContribution);
}
exports.bindNotificationPreferences = bindNotificationPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notification-preferences'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notification-toasts-component.js":
/*!****************************************************************************!*\
  !*** ../../packages/messages/lib/browser/notification-toasts-component.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.NotificationToastsComponent = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const notification_component_1 = __webpack_require__(/*! ./notification-component */ "../../packages/messages/lib/browser/notification-component.js");
class NotificationToastsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.toDisposeOnUnmount = new core_1.DisposableCollection();
        this.state = {
            toasts: [],
            visibilityState: 'hidden'
        };
    }
    async componentDidMount() {
        this.toDisposeOnUnmount.push(this.props.manager.onUpdated(({ toasts, visibilityState }) => {
            visibilityState = this.props.corePreferences['workbench.silentNotifications'] ? 'hidden' : visibilityState;
            this.setState({
                toasts: toasts.slice(-3),
                visibilityState
            });
        }));
    }
    componentWillUnmount() {
        this.toDisposeOnUnmount.dispose();
    }
    render() {
        return (React.createElement("div", { className: `theia-notifications-container theia-notification-toasts ${this.state.visibilityState === 'toasts' ? 'open' : 'closed'}` },
            React.createElement("div", { className: 'theia-notification-list' }, this.state.toasts.map(notification => React.createElement(notification_component_1.NotificationComponent, { key: notification.messageId, notification: notification, manager: this.props.manager })))));
    }
}
exports.NotificationToastsComponent = NotificationToastsComponent;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notification-toasts-component'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notifications-commands.js":
/*!*********************************************************************!*\
  !*** ../../packages/messages/lib/browser/notifications-commands.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.NotificationsCommands = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
var NotificationsCommands;
(function (NotificationsCommands) {
    const NOTIFICATIONS_CATEGORY = 'Notifications';
    const NOTIFICATIONS_CATEGORY_KEY = core_1.nls.getDefaultKey(NOTIFICATIONS_CATEGORY);
    NotificationsCommands.TOGGLE = core_1.Command.toLocalizedCommand({
        id: 'notifications.commands.toggle',
        category: NOTIFICATIONS_CATEGORY,
        iconClass: (0, browser_1.codicon)('list-unordered'),
        label: 'Toggle Notifications'
    }, 'theia/messages/toggleNotifications', NOTIFICATIONS_CATEGORY_KEY);
    NotificationsCommands.SHOW = core_1.Command.toDefaultLocalizedCommand({
        id: 'notifications.commands.show',
        category: NOTIFICATIONS_CATEGORY,
        label: 'Show Notifications'
    });
    NotificationsCommands.HIDE = core_1.Command.toDefaultLocalizedCommand({
        id: 'notifications.commands.hide',
        category: NOTIFICATIONS_CATEGORY,
        label: 'Hide Notifications'
    });
    NotificationsCommands.CLEAR_ALL = core_1.Command.toDefaultLocalizedCommand({
        id: 'notifications.commands.clearAll',
        category: NOTIFICATIONS_CATEGORY,
        iconClass: (0, browser_1.codicon)('clear-all'),
        label: 'Clear All Notifications'
    });
})(NotificationsCommands = exports.NotificationsCommands || (exports.NotificationsCommands = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notifications-commands'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notifications-contribution.js":
/*!*************************************************************************!*\
  !*** ../../packages/messages/lib/browser/notifications-contribution.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.NotificationsContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const notifications_commands_1 = __webpack_require__(/*! ./notifications-commands */ "../../packages/messages/lib/browser/notifications-commands.js");
const notifications_manager_1 = __webpack_require__(/*! ./notifications-manager */ "../../packages/messages/lib/browser/notifications-manager.js");
const notifications_renderer_1 = __webpack_require__(/*! ./notifications-renderer */ "../../packages/messages/lib/browser/notifications-renderer.js");
const color_1 = __webpack_require__(/*! @theia/core/lib/common/color */ "../../packages/core/lib/common/color.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const theme_1 = __webpack_require__(/*! @theia/core/lib/common/theme */ "../../packages/core/lib/common/theme.js");
let NotificationsContribution = class NotificationsContribution {
    constructor() {
        this.id = 'theia-notification-center';
    }
    onStart(_app) {
        this.createStatusBarItem();
    }
    createStatusBarItem() {
        this.updateStatusBarItem();
        this.manager.onUpdated(e => this.updateStatusBarItem(e.notifications.length));
    }
    updateStatusBarItem(count = 0) {
        this.statusBar.setElement(this.id, {
            text: this.getStatusBarItemText(count),
            alignment: browser_1.StatusBarAlignment.RIGHT,
            priority: -900,
            command: notifications_commands_1.NotificationsCommands.TOGGLE.id,
            tooltip: this.getStatusBarItemTooltip(count),
            accessibilityInformation: {
                label: this.getStatusBarItemTooltip(count)
            }
        });
    }
    getStatusBarItemText(count) {
        return `$(${count ? 'codicon-bell-dot' : 'codicon-bell'}) ${count ? ` ${count}` : ''}`;
    }
    getStatusBarItemTooltip(count) {
        if (this.manager.centerVisible) {
            return nls_1.nls.localizeByDefault('Hide Notifications');
        }
        return count === 0
            ? nls_1.nls.localizeByDefault('No Notifications')
            : count === 1
                ? nls_1.nls.localizeByDefault('1 New Notification')
                : nls_1.nls.localizeByDefault('{0} New Notifications', count.toString());
    }
    registerCommands(commands) {
        commands.registerCommand(notifications_commands_1.NotificationsCommands.TOGGLE, {
            isEnabled: () => true,
            execute: () => this.manager.toggleCenter()
        });
        commands.registerCommand(notifications_commands_1.NotificationsCommands.SHOW, {
            isEnabled: () => true,
            execute: () => this.manager.showCenter()
        });
        commands.registerCommand(notifications_commands_1.NotificationsCommands.HIDE, {
            execute: () => this.manager.hide()
        });
        commands.registerCommand(notifications_commands_1.NotificationsCommands.CLEAR_ALL, {
            execute: () => this.manager.clearAll()
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: notifications_commands_1.NotificationsCommands.HIDE.id,
            when: 'notificationsVisible',
            keybinding: 'esc'
        });
    }
    registerColors(colors) {
        colors.register({
            id: 'notificationCenter.border', defaults: {
                hcDark: 'contrastBorder',
                hcLight: 'contrastBorder'
            }, description: 'Notifications center border color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationToast.border', defaults: {
                hcDark: 'contrastBorder',
                hcLight: 'contrastBorder'
            }, description: 'Notification toast border color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notifications.foreground', defaults: {
                dark: 'editorWidget.foreground',
                light: 'editorWidget.foreground',
                hcDark: 'editorWidget.foreground',
                hcLight: 'editorWidget.foreground'
            }, description: 'Notifications foreground color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notifications.background', defaults: {
                dark: 'editorWidget.background',
                light: 'editorWidget.background',
                hcDark: 'editorWidget.background',
                hcLight: 'editorWidget.background'
            }, description: 'Notifications background color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationLink.foreground', defaults: {
                dark: 'textLink.foreground',
                light: 'textLink.foreground',
                hcDark: 'textLink.foreground',
                hcLight: 'textLink.foreground'
            }, description: 'Notification links foreground color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationCenterHeader.foreground',
            description: 'Notifications center header foreground color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationCenterHeader.background', defaults: {
                dark: color_1.Color.lighten('notifications.background', 0.3),
                light: color_1.Color.darken('notifications.background', 0.05),
                hcDark: 'notifications.background',
                hcLight: 'notifications.background'
            }, description: 'Notifications center header background color. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notifications.border', defaults: {
                dark: 'notificationCenterHeader.background',
                light: 'notificationCenterHeader.background',
                hcDark: 'notificationCenterHeader.background',
                hcLight: 'notificationCenterHeader.background'
                // eslint-disable-next-line max-len
            }, description: 'Notifications border color separating from other notifications in the notifications center. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationsErrorIcon.foreground', defaults: {
                dark: 'editorError.foreground',
                light: 'editorError.foreground',
                hcDark: 'editorError.foreground',
                hcLight: 'editorError.foreground'
            }, description: 'The color used for the icon of error notifications. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationsWarningIcon.foreground', defaults: {
                dark: 'editorWarning.foreground',
                light: 'editorWarning.foreground',
                hcDark: 'editorWarning.foreground',
                hcLight: 'editorWarning.foreground'
            }, description: 'The color used for the icon of warning notifications. Notifications slide in from the bottom right of the window.'
        }, {
            id: 'notificationsInfoIcon.foreground', defaults: {
                dark: 'editorInfo.foreground',
                light: 'editorInfo.foreground',
                hcDark: 'editorInfo.foreground',
                hcLight: 'editorInfo.foreground'
            }, description: 'The color used for the icon of info notifications. Notifications slide in from the bottom right of the window.'
        });
    }
    registerThemeStyle(theme, collector) {
        const notificationsBackground = theme.getColor('notifications.background');
        if (notificationsBackground) {
            collector.addRule(`
                .theia-notification-list-item-container {
                    background-color: ${notificationsBackground};
                }
            `);
        }
        const notificationHover = theme.getColor('list.hoverBackground');
        if (notificationHover) {
            collector.addRule(`
                .theia-notification-list-item:hover:not(:focus) {
                    background-color: ${notificationHover};
                }
            `);
        }
        const focusBorder = theme.getColor('focusBorder');
        if (focusBorder && (0, theme_1.isHighContrast)(theme.type)) {
            collector.addRule(`
                .theia-notification-list-item:hover:not(:focus) {
                    outline: 1px dashed ${focusBorder};
                    outline-offset: -2px;
                }
            `);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(notifications_manager_1.NotificationManager),
    __metadata("design:type", notifications_manager_1.NotificationManager)
], NotificationsContribution.prototype, "manager", void 0);
__decorate([
    (0, inversify_1.inject)(notifications_renderer_1.NotificationsRenderer),
    __metadata("design:type", notifications_renderer_1.NotificationsRenderer)
], NotificationsContribution.prototype, "notificationsRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StatusBar),
    __metadata("design:type", Object)
], NotificationsContribution.prototype, "statusBar", void 0);
NotificationsContribution = __decorate([
    (0, inversify_1.injectable)()
], NotificationsContribution);
exports.NotificationsContribution = NotificationsContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notifications-contribution'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notifications-manager.js":
/*!********************************************************************!*\
  !*** ../../packages/messages/lib/browser/notifications-manager.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.NotificationManager = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const objects_1 = __webpack_require__(/*! @theia/core/lib/common/objects */ "../../packages/core/lib/common/objects.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const ts_md5_1 = __webpack_require__(/*! ts-md5 */ "../../node_modules/ts-md5/dist/esm/index.js");
const throttle = __webpack_require__(/*! @theia/core/shared/lodash.throttle */ "../../packages/core/shared/lodash.throttle/index.js");
const notification_preferences_1 = __webpack_require__(/*! ./notification-preferences */ "../../packages/messages/lib/browser/notification-preferences.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const notification_content_renderer_1 = __webpack_require__(/*! ./notification-content-renderer */ "../../packages/messages/lib/browser/notification-content-renderer.js");
let NotificationManager = class NotificationManager extends common_1.MessageClient {
    constructor() {
        super(...arguments);
        this.onUpdatedEmitter = new core_1.Emitter();
        this.onUpdated = this.onUpdatedEmitter.event;
        this.fireUpdatedEvent = throttle(() => {
            const notifications = (0, objects_1.deepClone)(Array.from(this.notifications.values()).filter((notification) => notification.message));
            const toasts = (0, objects_1.deepClone)(Array.from(this.toasts.values()).filter((toast) => toast.message));
            const visibilityState = this.visibilityState;
            this.onUpdatedEmitter.fire({ notifications, toasts, visibilityState });
        }, 250, { leading: true, trailing: true });
        this.deferredResults = new Map();
        this.notifications = new Map();
        this.toasts = new Map();
        this.visibilityState = 'hidden';
        this.hideTimeouts = new Map();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.notificationToastsVisibleKey = this.contextKeyService.createKey('notificationToastsVisible', false);
        this.notificationCenterVisibleKey = this.contextKeyService.createKey('notificationCenterVisible', false);
        this.notificationsVisible = this.contextKeyService.createKey('notificationsVisible', false);
    }
    updateContextKeys() {
        this.notificationToastsVisibleKey.set(this.toastsVisible);
        this.notificationCenterVisibleKey.set(this.centerVisible);
        this.notificationsVisible.set(this.toastsVisible || this.centerVisible);
    }
    get toastsVisible() {
        return this.visibilityState === 'toasts';
    }
    get centerVisible() {
        return this.visibilityState === 'center';
    }
    setVisibilityState(newState) {
        const changed = this.visibilityState !== newState;
        this.visibilityState = newState;
        if (changed) {
            this.fireUpdatedEvent();
            this.updateContextKeys();
        }
    }
    hideCenter() {
        this.setVisibilityState('hidden');
    }
    showCenter() {
        this.setVisibilityState('center');
    }
    toggleCenter() {
        this.setVisibilityState(this.centerVisible ? 'hidden' : 'center');
    }
    accept(notification, action) {
        const messageId = this.getId(notification);
        if (!messageId) {
            return;
        }
        this.notifications.delete(messageId);
        this.toasts.delete(messageId);
        const result = this.deferredResults.get(messageId);
        if (!result) {
            return;
        }
        this.deferredResults.delete(messageId);
        if ((this.centerVisible && !this.notifications.size) || (this.toastsVisible && !this.toasts.size)) {
            this.setVisibilityState('hidden');
        }
        result.resolve(action);
        this.fireUpdatedEvent();
    }
    find(notification) {
        return typeof notification === 'string' ? this.notifications.get(notification) : notification;
    }
    getId(notification) {
        return typeof notification === 'string' ? notification : notification.messageId;
    }
    hide() {
        if (this.toastsVisible) {
            this.toasts.clear();
        }
        this.setVisibilityState('hidden');
    }
    clearAll() {
        this.setVisibilityState('hidden');
        Array.from(this.notifications.values()).forEach(n => this.clear(n));
    }
    clear(notification) {
        this.accept(notification, undefined);
    }
    toggleExpansion(notificationId) {
        const notification = this.find(notificationId);
        if (!notification) {
            return;
        }
        notification.collapsed = !notification.collapsed;
        this.fireUpdatedEvent();
    }
    showMessage(plainMessage) {
        const messageId = this.getMessageId(plainMessage);
        let notification = this.notifications.get(messageId);
        if (!notification) {
            const message = this.contentRenderer.renderMessage(plainMessage.text);
            const type = this.toNotificationType(plainMessage.type);
            const actions = Array.from(new Set(plainMessage.actions));
            const source = plainMessage.source;
            const expandable = this.isExpandable(message, source, actions);
            const collapsed = expandable;
            notification = { messageId, message, type, actions, expandable, collapsed };
            this.notifications.set(messageId, notification);
        }
        const result = this.deferredResults.get(messageId) || new promise_util_1.Deferred();
        this.deferredResults.set(messageId, result);
        if (!this.centerVisible) {
            this.toasts.delete(messageId);
            this.toasts.set(messageId, notification);
            this.startHideTimeout(messageId, this.getTimeout(plainMessage));
            this.setVisibilityState('toasts');
        }
        this.fireUpdatedEvent();
        return result.promise;
    }
    startHideTimeout(messageId, timeout) {
        if (timeout > 0) {
            this.hideTimeouts.set(messageId, window.setTimeout(() => {
                this.hideToast(messageId);
            }, timeout));
        }
    }
    hideToast(messageId) {
        this.toasts.delete(messageId);
        if (this.toastsVisible && !this.toasts.size) {
            this.setVisibilityState('hidden');
        }
        else {
            this.fireUpdatedEvent();
        }
    }
    getTimeout(plainMessage) {
        if (plainMessage.actions && plainMessage.actions.length > 0) {
            // Ignore the timeout if at least one action is set, and we wait for user interaction.
            return 0;
        }
        return plainMessage.options && plainMessage.options.timeout || this.preferences['notification.timeout'];
    }
    isExpandable(message, source, actions) {
        if (!actions.length && source) {
            return true;
        }
        return message.length > 500;
    }
    toNotificationType(type) {
        switch (type) {
            case common_1.MessageType.Error:
                return 'error';
            case common_1.MessageType.Warning:
                return 'warning';
            case common_1.MessageType.Progress:
                return 'progress';
            default:
                return 'info';
        }
    }
    getMessageId(m) {
        return String(ts_md5_1.Md5.hashStr(`[${m.type}] ${m.text} : ${(m.actions || []).join(' | ')};`));
    }
    async showProgress(messageId, plainMessage, cancellationToken) {
        let notification = this.notifications.get(messageId);
        if (!notification) {
            const message = this.contentRenderer.renderMessage(plainMessage.text);
            const type = this.toNotificationType(plainMessage.type);
            const actions = Array.from(new Set(plainMessage.actions));
            const source = plainMessage.source;
            const expandable = this.isExpandable(message, source, actions);
            const collapsed = expandable;
            notification = { messageId, message, type, actions, expandable, collapsed };
            this.notifications.set(messageId, notification);
            notification.progress = 0;
            cancellationToken.onCancellationRequested(() => {
                this.accept(messageId, common_1.ProgressMessage.Cancel);
            });
        }
        const result = this.deferredResults.get(messageId) || new promise_util_1.Deferred();
        this.deferredResults.set(messageId, result);
        if (!this.centerVisible) {
            this.toasts.set(messageId, notification);
            this.setVisibilityState('toasts');
        }
        this.fireUpdatedEvent();
        return result.promise;
    }
    async reportProgress(messageId, update, originalMessage, cancellationToken) {
        const notification = this.find(messageId);
        if (!notification) {
            return;
        }
        if (cancellationToken.isCancellationRequested) {
            this.clear(messageId);
        }
        else {
            const textMessage = originalMessage.text && update.message ? `${originalMessage.text}: ${update.message}` : originalMessage.text || (update === null || update === void 0 ? void 0 : update.message);
            if (textMessage) {
                notification.message = this.contentRenderer.renderMessage(textMessage);
            }
            notification.progress = this.toPlainProgress(update) || notification.progress;
        }
        this.fireUpdatedEvent();
    }
    toPlainProgress(update) {
        return update.work && Math.min(update.work.done / update.work.total * 100, 100);
    }
    async openLink(link) {
        const uri = new uri_1.default(link);
        const opener = await this.openerService.getOpener(uri);
        opener.open(uri);
    }
};
__decorate([
    (0, inversify_1.inject)(notification_preferences_1.NotificationPreferences),
    __metadata("design:type", Object)
], NotificationManager.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], NotificationManager.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], NotificationManager.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(notification_content_renderer_1.NotificationContentRenderer),
    __metadata("design:type", notification_content_renderer_1.NotificationContentRenderer)
], NotificationManager.prototype, "contentRenderer", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationManager.prototype, "init", null);
NotificationManager = __decorate([
    (0, inversify_1.injectable)()
], NotificationManager);
exports.NotificationManager = NotificationManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notifications-manager'] = this;


/***/ }),

/***/ "../../packages/messages/lib/browser/notifications-renderer.js":
/*!*********************************************************************!*\
  !*** ../../packages/messages/lib/browser/notifications-renderer.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.NotificationsRenderer = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const client_1 = __webpack_require__(/*! @theia/core/shared/react-dom/client */ "../../packages/core/shared/react-dom/client/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const notifications_manager_1 = __webpack_require__(/*! ./notifications-manager */ "../../packages/messages/lib/browser/notifications-manager.js");
const notification_center_component_1 = __webpack_require__(/*! ./notification-center-component */ "../../packages/messages/lib/browser/notification-center-component.js");
const notification_toasts_component_1 = __webpack_require__(/*! ./notification-toasts-component */ "../../packages/messages/lib/browser/notification-toasts-component.js");
let NotificationsRenderer = class NotificationsRenderer {
    init() {
        this.createOverlayContainer();
        this.render();
    }
    createOverlayContainer() {
        this.container = window.document.createElement('div');
        this.container.className = 'theia-notifications-overlay';
        if (window.document.body) {
            window.document.body.appendChild(this.container);
        }
        this.containerRoot = (0, client_1.createRoot)(this.container);
    }
    render() {
        this.containerRoot.render(React.createElement("div", null,
            React.createElement(notification_toasts_component_1.NotificationToastsComponent, { manager: this.manager, corePreferences: this.corePreferences }),
            React.createElement(notification_center_component_1.NotificationCenterComponent, { manager: this.manager })));
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], NotificationsRenderer.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(notifications_manager_1.NotificationManager),
    __metadata("design:type", notifications_manager_1.NotificationManager)
], NotificationsRenderer.prototype, "manager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.CorePreferences),
    __metadata("design:type", Object)
], NotificationsRenderer.prototype, "corePreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsRenderer.prototype, "init", null);
NotificationsRenderer = __decorate([
    (0, inversify_1.injectable)()
], NotificationsRenderer);
exports.NotificationsRenderer = NotificationsRenderer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/messages/lib/browser/notifications-renderer'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/messages/src/browser/style/index.css":
/*!*****************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/messages/src/browser/style/index.css ***!
  \*****************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_notifications_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../../../node_modules/css-loader/dist/cjs.js!./notifications.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/messages/src/browser/style/notifications.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_notifications_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
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
`, "",{"version":3,"sources":["webpack://./../../packages/messages/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF","sourcesContent":["/********************************************************************************\n * Copyright (C) 2017 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n@import \"./notifications.css\";\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/messages/src/browser/style/notifications.css":
/*!*************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/messages/src/browser/style/notifications.css ***!
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
 * Copyright (C) 2019 TypeFox and others.
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

/* Container */

.theia-notifications-overlay {
  height: 0px;
}

.theia-notifications-container {
  position: absolute;
  bottom: 36px;
  right: 16px;
  width: 500px;
  user-select: none;
  z-index: 1111;
}
.theia-notifications-container.closed {
  display: none;
}
.theia-notifications-container > * {
  position: relative;
}

/* Toasts */

.theia-notifications-container.theia-notification-toasts .theia-notification-list-item-container {
  border-radius: 4px;
  margin-top: 6px;
}

.theia-notifications-container.theia-notification-toasts .theia-notification-list-item {
  box-shadow: 0px 0px 4px 0px var(--theia-widget-shadow);
  border: 1px solid var(--theia-notificationToast-border);
  border-radius: 4px;
}

/* Center */

.theia-notifications-container.theia-notification-center {
  background-color: var(--theia-notifications-background);
  border: 1px solid var(--theia-notificationCenter-border);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 0px 6px 0px var(--theia-widget-shadow);
}

/* Center > Header */

.theia-notification-center-header {
  color: var(--theia-notificationCenterHeader-foreground);
  background-color: var(--theia-notificationCenterHeader-background);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  min-height: 30px;
  align-items: center;
}

.theia-notification-center-header-title {
  font-size: calc(var(--theia-ui-font-size1) / 1.1);
  font-family: var(--theia-ui-font-family);
  margin: 8px;
  flex-grow: 2;
}

.theia-notification-center-header-actions {
  margin: 8px;
}

/* List */

.theia-notification-list-scroll-container {
  max-height: 300px;
  overflow: auto;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.theia-notification-list {
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: nowrap;
}

/* List > Item */

.theia-notification-list-item {
  background-color: var(--theia-notifications-background);
  width: 100%;
  cursor: pointer;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.theia-notification-list-item:focus {
  border-color: var(--theia-focusBorder);
}

.theia-notification-center .theia-notification-list-item:not(:last-child) {
  border-top: 1px var(--theia-notifications-border) solid;
}

.theia-notification-list-item-content {
  margin: 6px;
  flex-grow: 3;
}
.theia-notification-list-item-content.collapsed
  .theia-notification-list-item-content-bottom {
  display: none;
}
.theia-notification-list-item-content.collapsed .theia-notification-message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theia-notification-list-item-content-main {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 5px 4px 7px 4px;
}

.theia-notification-message {
  font-size: var(--theia-ui-font-size1);
  font-family: var(--theia-ui-font-family);
  overflow-wrap: break-word;
  box-sizing: border-box;
  flex-basis: 0%;
  flex-grow: 1;
  flex-shrink: 1;
  display: block;
  overflow: hidden;
  user-select: text;
  margin-top: 3px;
}

.theia-notification-message a {
  border: none;
  color: var(--theia-notificationLink-foreground);
  outline: 0;
  text-decoration: none;
}
.theia-notification-message a:focus {
  outline-color: var(--theia-focusBorder);
}

.theia-notification-icon {
  margin-top: 1px;
}

.theia-notification-icon:before {
  font-size: 18px;
  padding-right: 4px;
}

.theia-notification-icon.info:before {
  color: var(--theia-notificationsInfoIcon-foreground);
}

.theia-notification-icon.warning:before {
  color: var(--theia-notificationsWarningIcon-foreground);
}

.theia-notification-icon.error:before {
  color: var(--theia-notificationsErrorIcon-foreground);
}

.theia-notification-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 0px;
  padding: 0px;
}

.theia-notification-actions > li {
  display: inline-block;
  height: 16px;
  width: 16px;
  cursor: pointer;
  margin-left: 4px;
}

.theia-notification-actions > .expand {
  transform: rotate(180deg);
}

.theia-notification-list-item-content-bottom {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.theia-notification-source {
  font-size: var(--theia-ui-font-size0);
  font-family: var(--theia-ui-font-family);
  overflow-wrap: break-word;
  box-sizing: border-box;
  flex-grow: 1;
  padding: 4px;
  display: block;
  overflow: hidden;
}

.theia-notification-buttons {
  flex-grow: 2;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.theia-notification-buttons > button {
  margin: 4px;
  max-width: 160px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.theia-notification-item-progress {
  display: block;
}

.theia-notification-item-progressbar {
  height: 2px;
  background-color: var(--theia-progressBar-background);
  width: 66%;
}

.theia-notification-item-progressbar.indeterminate {
  /* \`progress-animation\` is defined in \`packages/core/src/browser/style/progress-bar.css\` */
  animation: progress-animation 1.3s 0s infinite
    cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* Perfect scrollbar */

.theia-notification-list-scroll-container .ps__rail-y {
  width: var(--theia-scrollbar-rail-width);
}

.theia-notification-list-scroll-container .ps__rail-y:hover > .ps__thumb-y,
.theia-notification-list-scroll-container .ps__rail-y:focus > .ps__thumb-y,
.theia-notification-list-scroll-container
  .ps__rail-y.ps--clicking
  .ps__thumb-y {
  right: calc(
    (var(--theia-scrollbar-rail-width) - var(--theia-scrollbar-width)) / 2
  );
  width: var(--theia-scrollbar-width);
}

.theia-notification-list-scroll-container .ps__rail-y > .ps__thumb-y {
  width: var(--theia-scrollbar-width);
  right: calc(
    (var(--theia-scrollbar-rail-width) - var(--theia-scrollbar-width)) / 2
  );
  background: var(--theia-scrollbarSlider-background);
  border-radius: 0px;
}
`, "",{"version":3,"sources":["webpack://./../../packages/messages/src/browser/style/notifications.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF,cAAc;;AAEd;EACE,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,YAAY;EACZ,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;AACpB;;AAEA,WAAW;;AAEX;EACE,kBAAkB;EAClB,eAAe;AACjB;;AAEA;EACE,sDAAsD;EACtD,uDAAuD;EACvD,kBAAkB;AACpB;;AAEA,WAAW;;AAEX;EACE,uDAAuD;EACvD,wDAAwD;EACxD,kBAAkB;EAClB,gBAAgB;EAChB,sDAAsD;AACxD;;AAEA,oBAAoB;;AAEpB;EACE,uDAAuD;EACvD,kEAAkE;EAClE,aAAa;EACb,mBAAmB;EACnB,iBAAiB;EACjB,yBAAyB;EACzB,gBAAgB;EAChB,mBAAmB;AACrB;;AAEA;EACE,iDAAiD;EACjD,wCAAwC;EACxC,WAAW;EACX,YAAY;AACd;;AAEA;EACE,WAAW;AACb;;AAEA,SAAS;;AAET;EACE,iBAAiB;EACjB,cAAc;EACd,8BAA8B;EAC9B,+BAA+B;AACjC;;AAEA;EACE,aAAa;EACb,8BAA8B;EAC9B,iBAAiB;AACnB;;AAEA,gBAAgB;;AAEhB;EACE,uDAAuD;EACvD,WAAW;EACX,eAAe;EACf,YAAY;EACZ,aAAa;EACb,sBAAsB;EACtB,iBAAiB;EACjB,8BAA8B;AAChC;;AAEA;EACE,sCAAsC;AACxC;;AAEA;EACE,uDAAuD;AACzD;;AAEA;EACE,WAAW;EACX,YAAY;AACd;AACA;;EAEE,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,iBAAiB;EACjB,8BAA8B;EAC9B,wBAAwB;AAC1B;;AAEA;EACE,qCAAqC;EACrC,wCAAwC;EACxC,yBAAyB;EACzB,sBAAsB;EACtB,cAAc;EACd,YAAY;EACZ,cAAc;EACd,cAAc;EACd,gBAAgB;EAChB,iBAAiB;EACjB,eAAe;AACjB;;AAEA;EACE,YAAY;EACZ,+CAA+C;EAC/C,UAAU;EACV,qBAAqB;AACvB;AACA;EACE,uCAAuC;AACzC;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,eAAe;EACf,kBAAkB;AACpB;;AAEA;EACE,oDAAoD;AACtD;;AAEA;EACE,uDAAuD;AACzD;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,iBAAiB;EACjB,8BAA8B;EAC9B,WAAW;EACX,YAAY;AACd;;AAEA;EACE,qBAAqB;EACrB,YAAY;EACZ,WAAW;EACX,eAAe;EACf,gBAAgB;AAClB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,eAAe;EACf,8BAA8B;AAChC;;AAEA;EACE,qCAAqC;EACrC,wCAAwC;EACxC,yBAAyB;EACzB,sBAAsB;EACtB,YAAY;EACZ,YAAY;EACZ,cAAc;EACd,gBAAgB;AAClB;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,yBAAyB;EACzB,eAAe;AACjB;;AAEA;EACE,WAAW;EACX,gBAAgB;EAChB,uBAAuB;EACvB,mBAAmB;EACnB,gBAAgB;AAClB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,WAAW;EACX,qDAAqD;EACrD,UAAU;AACZ;;AAEA;EACE,0FAA0F;EAC1F;wCACsC;AACxC;;AAEA,sBAAsB;;AAEtB;EACE,wCAAwC;AAC1C;;AAEA;;;;;EAKE;;GAEC;EACD,mCAAmC;AACrC;;AAEA;EACE,mCAAmC;EACnC;;GAEC;EACD,mDAAmD;EACnD,kBAAkB;AACpB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2019 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n/* Container */\n\n.theia-notifications-overlay {\n  height: 0px;\n}\n\n.theia-notifications-container {\n  position: absolute;\n  bottom: 36px;\n  right: 16px;\n  width: 500px;\n  user-select: none;\n  z-index: 1111;\n}\n.theia-notifications-container.closed {\n  display: none;\n}\n.theia-notifications-container > * {\n  position: relative;\n}\n\n/* Toasts */\n\n.theia-notifications-container.theia-notification-toasts .theia-notification-list-item-container {\n  border-radius: 4px;\n  margin-top: 6px;\n}\n\n.theia-notifications-container.theia-notification-toasts .theia-notification-list-item {\n  box-shadow: 0px 0px 4px 0px var(--theia-widget-shadow);\n  border: 1px solid var(--theia-notificationToast-border);\n  border-radius: 4px;\n}\n\n/* Center */\n\n.theia-notifications-container.theia-notification-center {\n  background-color: var(--theia-notifications-background);\n  border: 1px solid var(--theia-notificationCenter-border);\n  border-radius: 4px;\n  overflow: hidden;\n  box-shadow: 0px 0px 6px 0px var(--theia-widget-shadow);\n}\n\n/* Center > Header */\n\n.theia-notification-center-header {\n  color: var(--theia-notificationCenterHeader-foreground);\n  background-color: var(--theia-notificationCenterHeader-background);\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: flex-end;\n  min-height: 30px;\n  align-items: center;\n}\n\n.theia-notification-center-header-title {\n  font-size: calc(var(--theia-ui-font-size1) / 1.1);\n  font-family: var(--theia-ui-font-family);\n  margin: 8px;\n  flex-grow: 2;\n}\n\n.theia-notification-center-header-actions {\n  margin: 8px;\n}\n\n/* List */\n\n.theia-notification-list-scroll-container {\n  max-height: 300px;\n  overflow: auto;\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n\n.theia-notification-list {\n  display: flex;\n  flex-direction: column-reverse;\n  flex-wrap: nowrap;\n}\n\n/* List > Item */\n\n.theia-notification-list-item {\n  background-color: var(--theia-notifications-background);\n  width: 100%;\n  cursor: pointer;\n  flex-grow: 1;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n}\n\n.theia-notification-list-item:focus {\n  border-color: var(--theia-focusBorder);\n}\n\n.theia-notification-center .theia-notification-list-item:not(:last-child) {\n  border-top: 1px var(--theia-notifications-border) solid;\n}\n\n.theia-notification-list-item-content {\n  margin: 6px;\n  flex-grow: 3;\n}\n.theia-notification-list-item-content.collapsed\n  .theia-notification-list-item-content-bottom {\n  display: none;\n}\n.theia-notification-list-item-content.collapsed .theia-notification-message {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.theia-notification-list-item-content-main {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  padding: 5px 4px 7px 4px;\n}\n\n.theia-notification-message {\n  font-size: var(--theia-ui-font-size1);\n  font-family: var(--theia-ui-font-family);\n  overflow-wrap: break-word;\n  box-sizing: border-box;\n  flex-basis: 0%;\n  flex-grow: 1;\n  flex-shrink: 1;\n  display: block;\n  overflow: hidden;\n  user-select: text;\n  margin-top: 3px;\n}\n\n.theia-notification-message a {\n  border: none;\n  color: var(--theia-notificationLink-foreground);\n  outline: 0;\n  text-decoration: none;\n}\n.theia-notification-message a:focus {\n  outline-color: var(--theia-focusBorder);\n}\n\n.theia-notification-icon {\n  margin-top: 1px;\n}\n\n.theia-notification-icon:before {\n  font-size: 18px;\n  padding-right: 4px;\n}\n\n.theia-notification-icon.info:before {\n  color: var(--theia-notificationsInfoIcon-foreground);\n}\n\n.theia-notification-icon.warning:before {\n  color: var(--theia-notificationsWarningIcon-foreground);\n}\n\n.theia-notification-icon.error:before {\n  color: var(--theia-notificationsErrorIcon-foreground);\n}\n\n.theia-notification-actions {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  margin: 0px;\n  padding: 0px;\n}\n\n.theia-notification-actions > li {\n  display: inline-block;\n  height: 16px;\n  width: 16px;\n  cursor: pointer;\n  margin-left: 4px;\n}\n\n.theia-notification-actions > .expand {\n  transform: rotate(180deg);\n}\n\n.theia-notification-list-item-content-bottom {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: space-between;\n}\n\n.theia-notification-source {\n  font-size: var(--theia-ui-font-size0);\n  font-family: var(--theia-ui-font-family);\n  overflow-wrap: break-word;\n  box-sizing: border-box;\n  flex-grow: 1;\n  padding: 4px;\n  display: block;\n  overflow: hidden;\n}\n\n.theia-notification-buttons {\n  flex-grow: 2;\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n}\n\n.theia-notification-buttons > button {\n  margin: 4px;\n  max-width: 160px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.theia-notification-item-progress {\n  display: block;\n}\n\n.theia-notification-item-progressbar {\n  height: 2px;\n  background-color: var(--theia-progressBar-background);\n  width: 66%;\n}\n\n.theia-notification-item-progressbar.indeterminate {\n  /* `progress-animation` is defined in `packages/core/src/browser/style/progress-bar.css` */\n  animation: progress-animation 1.3s 0s infinite\n    cubic-bezier(0.645, 0.045, 0.355, 1);\n}\n\n/* Perfect scrollbar */\n\n.theia-notification-list-scroll-container .ps__rail-y {\n  width: var(--theia-scrollbar-rail-width);\n}\n\n.theia-notification-list-scroll-container .ps__rail-y:hover > .ps__thumb-y,\n.theia-notification-list-scroll-container .ps__rail-y:focus > .ps__thumb-y,\n.theia-notification-list-scroll-container\n  .ps__rail-y.ps--clicking\n  .ps__thumb-y {\n  right: calc(\n    (var(--theia-scrollbar-rail-width) - var(--theia-scrollbar-width)) / 2\n  );\n  width: var(--theia-scrollbar-width);\n}\n\n.theia-notification-list-scroll-container .ps__rail-y > .ps__thumb-y {\n  width: var(--theia-scrollbar-width);\n  right: calc(\n    (var(--theia-scrollbar-rail-width) - var(--theia-scrollbar-width)) / 2\n  );\n  background: var(--theia-scrollbarSlider-background);\n  border-radius: 0px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/messages/src/browser/style/index.css":
/*!***********************************************************!*\
  !*** ../../packages/messages/src/browser/style/index.css ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/messages/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_messages_lib_browser_messages-frontend-module_js.js.map