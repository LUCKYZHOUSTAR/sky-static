var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*!
 * Mtime Utility Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
var Mtime;
(function (Mtime) {
    var Util;
    (function (Util) {
        /**
         * Dispatcher
         */
        var Dispatcher = (function () {
            function Dispatcher(attr) {
                this.events = {};
                this.attr = attr || "action";
            }
            /**
             * 创建一个 Dispatcher 并绑定事件到页面元素上
             *
             * @param elem
             * @param event
             * @returns {Dispatcher}
             */
            Dispatcher.bind = function (elem, event) {
                if (event === void 0) { event = "click"; }
                return new Dispatcher().bind(elem, event);
            };
            /**
             * 注册动作事件
             *
             * @param action
             * @param handler
             * @returns {Mtime.Util.Dispatcher}
             */
            Dispatcher.prototype.on = function (action, handler) {
                this.events[action] = handler;
                return this;
            };
            /**
             * 移除动作事件
             *
             * @param action
             * @returns {Mtime.Util.Dispatcher}
             */
            Dispatcher.prototype.off = function (action) {
                delete this.events[action];
                return this;
            };
            /**
             * 绑定事件到页面元素上
             *
             * @param elem
             * @param event
             * @returns {Mtime.Util.Dispatcher}
             */
            Dispatcher.prototype.bind = function (elem, event) {
                if (event === void 0) { event = "click"; }
                $(elem).on(event, this.handle.bind(this));
                return this;
            };
            Dispatcher.prototype.handle = function (e) {
                var action = $(e.target).data(this.attr);
                if (action) {
                    var handler = this.events[action];
                    if (handler) {
                        e.stopPropagation();
                        handler(e);
                    }
                }
            };
            return Dispatcher;
        }());
        Util.Dispatcher = Dispatcher;
        /**
         * Float 浮点数操作
         */
        var Float = (function () {
            function Float() {
            }
            /**
             * 加
             *
             * @param numbers
             * @returns {number}
             */
            Float.add = function () {
                var numbers = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    numbers[_i] = arguments[_i];
                }
                var total = 0;
                var maxTimes = Float.getMaxTimes.apply(Float, numbers);
                var pow = Math.pow(10, maxTimes);
                for (var _a = 0, numbers_1 = numbers; _a < numbers_1.length; _a++) {
                    var n = numbers_1[_a];
                    total += n * pow;
                }
                return total / pow;
            };
            /**
             * 减
             *
             * @param n1
             * @param n2
             * @returns {number}
             */
            Float.subtract = function (n1, n2) {
                var result;
                var i1 = Float.toInteger(n1);
                var i2 = Float.toInteger(n2);
                if (i1.times === i2.times) {
                    // 两个小数位数相同
                    result = i1.value - i2.value;
                }
                else if (i1.times > i2.times) {
                    result = i1.value - i2.value * (i1.times / i2.times);
                }
                else {
                    result = i1.value * (i2.times / i1.times) - i2.value;
                }
                return result / Math.max(i1.times, i2.times);
            };
            /**
             * 乘
             *
             * @param numbers
             * @returns {number}
             */
            Float.multiply = function () {
                var numbers = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    numbers[_i] = arguments[_i];
                }
                var totalValue = 1;
                var totalTimes = 1;
                for (var _a = 0, numbers_2 = numbers; _a < numbers_2.length; _a++) {
                    var n = numbers_2[_a];
                    var i = Float.toInteger(n);
                    totalValue *= i.value;
                    totalTimes *= i.times;
                }
                return totalValue / totalTimes;
            };
            /**
             * 除
             *
             * @param n1
             * @param n2
             * @returns {number}
             */
            Float.divide = function (n1, n2) {
                var i1 = Float.toInteger(n1);
                var i2 = Float.toInteger(n2);
                return (i1.value / i2.value) * (i2.times / i1.times);
            };
            /**
             * 四舍五入
             *
             * @param num
             * @param precision
             * @returns {string}
             */
            Float.toFixed = function (num, precision) {
                if (precision === void 0) { precision = 0; }
                var times = Math.pow(10, precision);
                return Math.floor(num * times + 0.5) / times + '';
            };
            Float.getMaxTimes = function () {
                var numbers = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    numbers[_i] = arguments[_i];
                }
                var times = 1;
                for (var _a = 0, numbers_3 = numbers; _a < numbers_3.length; _a++) {
                    var n = numbers_3[_a];
                    var str = n + '';
                    var index = str.indexOf('.');
                    times = Math.max(times, str.length - index - 1);
                }
                return times;
            };
            Float.toInteger = function (n) {
                var r = { value: 0, times: 1 };
                var str = n + '';
                var index = str.indexOf('.');
                if (index > -1) {
                    var len = str.substr(index + 1).length;
                    r.times = Math.pow(10, len);
                    r.value = n * r.times;
                }
                else {
                    r.value = n;
                }
                return r;
            };
            return Float;
        }());
        Util.Float = Float;
        /**
         * 简单的 Url 处理类
         */
        var Url = (function () {
            function Url(uri) {
                var _this = this;
                var index = uri.indexOf("?");
                if (index == -1) {
                    this.path = uri;
                }
                else {
                    this.path = uri.substr(0, index);
                    this.query = {};
                    var search = uri.substr(index + 1).split('&');
                    search.forEach(function (p) {
                        var pairs = p.replace(/%20|\+/g, ' ').split('=');
                        if (pairs[1]) {
                            _this.query[decodeURIComponent(pairs[0])] = decodeURIComponent(pairs[1]);
                        }
                    });
                }
            }
            Url.prototype.getPath = function () {
                return this.path;
            };
            Url.prototype.getParam = function (key) {
                if (this.query) {
                    return this.query[key];
                }
                return null;
            };
            Url.prototype.setParam = function (key, value) {
                if (!this.query) {
                    this.query = {};
                }
                this.query[key] = value;
                return this;
            };
            Url.prototype.removeParam = function (key) {
                if (this.query) {
                    delete this.query[key];
                }
                return this;
            };
            Url.prototype.toString = function () {
                if (this.query) {
                    var s = this.path;
                    var i = 0;
                    for (var key in this.query) {
                        if (this.query.hasOwnProperty(key)) {
                            var value = this.query[key];
                            s += i == 0 ? "?" : "&";
                            s += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                            i++;
                        }
                    }
                    return s;
                }
                return this.path;
            };
            return Url;
        }());
        Util.Url = Url;
    })(Util = Mtime.Util || (Mtime.Util = {}));
})(Mtime || (Mtime = {}));
/*!
 * Mtime Ajax Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
var Mtime;
(function (Mtime) {
    var Net;
    (function (Net) {
        /**
         * AjaxOptions
         */
        var AjaxOptions = (function () {
            function AjaxOptions() {
                /**
                 * 请求超时时间, 单位毫秒
                 *
                 * @type {number}
                 */
                this.timeout = 30000;
                /**
                 * 是否以异步方式发送请求
                 *
                 * @type {boolean}
                 */
                this.async = true;
                /**
                 * 数据编码器(仅用于 POST 请求)
                 */
                this.encoder = "json";
            }
            /**
             * 设置全局默认属性
             *
             * @returns {AjaxOptions}
             */
            AjaxOptions.getDefaultOptions = function () {
                return AjaxOptions.defaultOptions;
            };
            /**
             * 获取全局默认属性
             *
             * @param options
             */
            AjaxOptions.setDefaultOptions = function (options) {
                if (options) {
                    AjaxOptions.defaultOptions = options;
                }
            };
            return AjaxOptions;
        }());
        AjaxOptions.defaultOptions = new AjaxOptions();
        Net.AjaxOptions = AjaxOptions;
        /**
         * AJAX 请求方式
         */
        var AjaxMethod;
        (function (AjaxMethod) {
            AjaxMethod[AjaxMethod["GET"] = 0] = "GET";
            AjaxMethod[AjaxMethod["POST"] = 1] = "POST";
            AjaxMethod[AjaxMethod["PUT"] = 2] = "PUT";
            AjaxMethod[AjaxMethod["DELETE"] = 3] = "DELETE";
            AjaxMethod[AjaxMethod["HEAD"] = 4] = "HEAD";
            AjaxMethod[AjaxMethod["TRACE"] = 5] = "TRACE";
            AjaxMethod[AjaxMethod["OPTIONS"] = 6] = "OPTIONS";
            AjaxMethod[AjaxMethod["CONNECT"] = 7] = "CONNECT";
            AjaxMethod[AjaxMethod["PATCH"] = 8] = "PATCH";
        })(AjaxMethod = Net.AjaxMethod || (Net.AjaxMethod = {}));
        /**
         * AJAX 请求
         */
        var AjaxRequest = (function () {
            function AjaxRequest(url, method, data) {
                this.options = $.extend({
                    url: url,
                    method: method,
                    data: data,
                    preHandler: AjaxRequest.preHandler,
                    postHandler: AjaxRequest.postHandler,
                    errorHandler: AjaxRequest.errorHandler
                }, AjaxOptions.getDefaultOptions());
            }
            /**
             * 设置前置处理函数
             *
             * @param handler
             * @return {Mtime.Net.AjaxRequest}
             */
            AjaxRequest.prototype.preHandler = function (handler) {
                this.options.preHandler = handler;
                return this;
            };
            /**
             * 设置后置处理函数
             *
             * @param handler
             * @return {Mtime.Net.AjaxRequest}
             */
            AjaxRequest.prototype.postHandler = function (handler) {
                this.options.postHandler = handler;
                return this;
            };
            /**
             * 设置错误处理函数
             *
             * @param handler
             * @return {Mtime.Net.AjaxRequest}
             */
            AjaxRequest.prototype.errorHandler = function (handler) {
                this.options.errorHandler = handler;
                return this;
            };
            /**
             * 设置请求超时时间
             *
             * @param timeout
             * @returns {Mtime.Net.AjaxRequest}
             */
            AjaxRequest.prototype.timeout = function (timeout) {
                this.options.timeout = timeout;
                return this;
            };
            /**
             * 设置是用异步还是同步方式发送请求
             *
             * @param async
             * @returns {Mtime.Net.AjaxRequest}
             */
            AjaxRequest.prototype.async = function (async) {
                this.options.async = async;
                return this;
            };
            /**
             * 设置触发元素
             *
             * @param {(Element | JQuery)} elem
             * @returns {Mtime.Net.AjaxRequest}
             */
            AjaxRequest.prototype.trigger = function (elem) {
                this.options.trigger = elem;
                return this;
            };
            /**
             * 获取 JSON 格式响应
             *
             * @template T 数据类型
             * @param {(r: T) => void} [callback] 回调函数
             */
            AjaxRequest.prototype.json = function (callback) {
                return this.result("json", callback);
            };
            /**
             * 获取文本格式响应
             *
             * @param {(r: string) => void} [callback] 回调函数
             */
            AjaxRequest.prototype.text = function (callback) {
                return this.result("text", callback);
            };
            /**
             * 获取 HTML 格式响应
             *
             * @param {(r: string) => void} [callback] 回调函数
             */
            AjaxRequest.prototype.html = function (callback) {
                return this.result("html", callback);
            };
            AjaxRequest.prototype.result = function (dataType, callback) {
                var _this = this;
                this.options.dataType = dataType;
                this.options.preHandler && this.options.preHandler(this.options);
                var settings = this.buildSettings();
                if (callback) {
                    $.ajax(settings).done(callback).always(function () {
                        _this.options.postHandler && _this.options.postHandler(_this.options);
                    }).fail(function (xhr, textStatus, error) {
                        _this.options.errorHandler && _this.options.errorHandler(xhr, textStatus, error);
                    });
                }
                else {
                    return new Promise(function (resolve, _) {
                        $.ajax(settings).done(function (r) {
                            resolve(r);
                        }).always(function () {
                            AjaxRequest.postHandler && AjaxRequest.postHandler(_this.options);
                        }).fail(function (xhr, textStatus, error) {
                            AjaxRequest.errorHandler && AjaxRequest.errorHandler(xhr, textStatus, error);
                        });
                    });
                }
            };
            AjaxRequest.prototype.buildSettings = function () {
                return {
                    url: this.options.url,
                    method: AjaxMethod[this.options.method],
                    data: this.options.data,
                    dataType: this.options.dataType,
                    timeout: this.options.timeout,
                    async: this.options.async
                };
            };
            return AjaxRequest;
        }());
        AjaxRequest.preHandler = function (options) {
            options.trigger && $(options.trigger).prop("disabled", true);
        };
        AjaxRequest.postHandler = function (options) {
            options.trigger && $(options.trigger).prop("disabled", false);
        };
        AjaxRequest.errorHandler = function (xhr, status, err) {
            var content;
            var width;
            if (xhr.responseJSON) {
                var info = xhr.responseJSON;
                width = 800;
                content = "<dl class=\"dl-horizontal\" style=\"height: 360px; overflow: auto\">\n\t<dt>\u8BF7\u6C42\u5730\u5740</dt>\n\t<dd>" + info.url + "</dd>\n\t<dt>\u72B6\u6001\u7801</dt>\n\t<dd>" + info.status + "</dd>\n\t<dt>\u72B6\u6001\u63CF\u8FF0</dt>\n\t<dd>" + info.statusText + "</dd>\n\t<dt>\u9519\u8BEF\u7801</dt>\n\t<dd>" + info.code + "</dd>\n\t<dt>\u9519\u8BEF\u4FE1\u606F</dt>\n\t<dd>" + info.message + "</dd>\n\t<dt>\u65F6\u95F4</dt>\n\t<dd>" + info.time + "</dd>\n\t<dt>\u5F02\u5E38</dt>\n\t<dd>" + info.exception + "</dd>\n\t<dt>\u5F02\u5E38\u5806\u6808</dt>\n\t<dd><code>" + info.exceptionDetail + "</code></dd>\t\n</dl>";
            }
            else if (status == "timeout") {
                content = "请求超时";
            }
            else if (xhr.status >= 400) {
                content = err || status;
            }
            else {
                return;
            }
            Mtime.UI.Dialog.show({
                body: content,
                closable: true,
                width: width,
                buttons: [Mtime.UI.DialogButton.primary()]
            });
        };
        Net.AjaxRequest = AjaxRequest;
        /**
         * AJAX GET 请求
         */
        var AjaxGetRequest = (function (_super) {
            __extends(AjaxGetRequest, _super);
            function AjaxGetRequest() {
                return _super.apply(this, arguments) || this;
            }
            /**
             * 获取 JSON 格式响应
             *
             * @template T 数据类型
             * @param {(r: T) => void} [callback] 回调函数
             */
            AjaxGetRequest.prototype.jsonp = function (callback) {
                return this.result("jsonp", callback);
            };
            return AjaxGetRequest;
        }(AjaxRequest));
        Net.AjaxGetRequest = AjaxGetRequest;
        /**
         * AJAX POST 请求
         */
        var AjaxPostRequest = (function (_super) {
            __extends(AjaxPostRequest, _super);
            function AjaxPostRequest() {
                return _super.apply(this, arguments) || this;
            }
            /**
             * 设置请求数据编码方式
             *
             * @param encoder
             * @returns {Mtime.Net.AjaxPostRequest}
             */
            AjaxPostRequest.prototype.encoder = function (encoder) {
                this.options.encoder = encoder;
                return this;
            };
            AjaxPostRequest.prototype.buildSettings = function () {
                var settings = _super.prototype.buildSettings.call(this);
                switch (this.options.encoder) {
                    case "none":
                        settings.contentType = false;
                        break;
                    case "json":
                        settings.contentType = "application/json; charset=UTF-8";
                        settings.data = JSON.stringify(this.options.data);
                        break;
                    case "form":
                        settings.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
                        break;
                }
                return settings;
            };
            return AjaxPostRequest;
        }(AjaxRequest));
        Net.AjaxPostRequest = AjaxPostRequest;
        /**
         * AJAX 请求入口类
         */
        var Ajax = (function () {
            function Ajax() {
            }
            /**
             * 发起 GET 请求
             *
             * @static
             * @param {string} url 请求地址
             * @param {Object} [args] 请求数据
             * @returns {Ajax} 当前 Ajax 对象
             */
            Ajax.get = function (url, args) {
                return new AjaxGetRequest(url, AjaxMethod.GET, args);
            };
            /**
             * 发起 POST 请求
             *
             * @static
             * @param {string} url 请求地址
             * @param {(string | Object)} [data] 请求数据
             * @returns {Ajax} 当前 Ajax 对象
             */
            Ajax.post = function (url, data) {
                return new AjaxPostRequest(url, AjaxMethod.POST, data);
            };
            return Ajax;
        }());
        Net.Ajax = Ajax;
    })(Net = Mtime.Net || (Mtime.Net = {}));
})(Mtime || (Mtime = {}));
window.$ajax = Mtime.Net.Ajax;
/*!
 * Mtime Dialog Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
var Mtime;
(function (Mtime) {
    var UI;
    (function (UI) {
        /**
         * DialogButton
         */
        var DialogButton = (function () {
            function DialogButton(text, callback, primary) {
                if (primary === void 0) { primary = false; }
                this.text = text;
                this.callback = callback;
                this.primary = primary;
            }
            DialogButton.primary = function (text, callback) {
                if (text === void 0) { text = "确定"; }
                return new DialogButton(text, callback, true);
            };
            DialogButton.cancel = function (text, callback) {
                if (text === void 0) { text = "取消"; }
                return new DialogButton(text, callback);
            };
            return DialogButton;
        }());
        UI.DialogButton = DialogButton;
        var Dialog = (function () {
            function Dialog(options) {
                this.id = $.now();
                this.options = $.extend({}, Dialog.defaultOptions, options);
                this.events = {};
                this.$elem = this.build();
                Dialog.dialogs[this.id] = this;
            }
            Dialog.prototype.fire = function (event) {
                var action = this.events[event];
                if (action)
                    action(this);
            };
            // 设置焦点到下一个对话框
            Dialog.prototype.moveFocus = function () {
                var last = null;
                $.each(Dialog.dialogs, function (id, dlg) {
                    last = dlg;
                });
                if (last !== null) {
                    last.$elem.focus();
                }
            };
            Dialog.prototype.find = function (selector) {
                if (typeof selector === "string") {
                    return this.$elem.find(selector);
                }
                else if (selector instanceof Element) {
                    return this.$elem.find(selector);
                }
                else {
                    return this.$elem.find(selector);
                }
            };
            Dialog.prototype.data = function (data) {
                if (data) {
                    this.options.data = data;
                    return this;
                }
                return this.options.data;
            };
            /**
             * 绑定事件
             *
             * @param {string} event
             * @param {(dlg: Dialog) => void} action
             * @returns {Dialog}
             */
            Dialog.prototype.on = function (event, action) {
                // show: triggered when dialog is shown
                // close: triggered when dialog is closed
                this.events[event] = action;
                return this;
            };
            /**
             * 创建对话框
             *
             * @static
             * @param {DialogOptions} options
             * @returns {Dialog}
             */
            Dialog.create = function (options) {
                if (!Dialog.factory) {
                    throw new Error("dialog factory isn't set");
                }
                return Dialog.factory.create(options);
            };
            /**
             * 显示对话框
             *
             * @static
             * @param {DialogOptions} options
             * @returns {Dialog}
             */
            Dialog.show = function (options) {
                return Dialog.create(options).show();
            };
            Dialog.alert = function (content, title, callback, options) {
                options = $.extend({}, options, {
                    title: title,
                    body: content,
                    closable: true,
                    buttons: [DialogButton.primary("确定", callback)]
                });
                return Dialog.show(options);
            };
            Dialog.confirm = function (content, title, callback, options) {
                options = $.extend({}, options, {
                    title: title,
                    body: content,
                    closable: true,
                    buttons: [DialogButton.primary("确定", callback), DialogButton.cancel()]
                });
                return Dialog.show(options);
            };
            return Dialog;
        }());
        // 静态属性与方法
        Dialog.defaultOptions = {
            title: "提示",
            body: "",
            buttons: [DialogButton.primary()],
            // width: 400,  // px
            clazz: '',
            backdrop: true,
            draggable: true,
            closable: true,
            countdown: 0,
            animate: true
        };
        Dialog.dialogs = {};
        UI.Dialog = Dialog;
    })(UI = Mtime.UI || (Mtime.UI = {}));
})(Mtime || (Mtime = {}));
window.$alert = Mtime.UI.Dialog.alert;
window.$confirm = Mtime.UI.Dialog.confirm;
/*!
 * Mtime Validator Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
var Mtime;
(function (Mtime) {
    var Util;
    (function (Util) {
        /**
         * HTML5 表单元素原生验证器
         *
         * @class NativeRule
         * @implements {ValidationRule}
         */
        var NativeRule = (function () {
            function NativeRule() {
            }
            NativeRule.prototype.validate = function ($form, $input, arg) {
                var el = $input[0];
                return { ok: el.checkValidity ? el.checkValidity() : true };
            };
            return NativeRule;
        }());
        /**
         * 必填字段验证器
         *
         * @class RequiredRule
         * @implements {ValidationRule}
         */
        var RequiredRule = (function () {
            function RequiredRule() {
            }
            RequiredRule.prototype.validate = function ($form, $input, arg) {
                return { ok: $.trim($input.val()).length > 0 };
            };
            return RequiredRule;
        }());
        /**
         * 必选字段验证器(用于 radio 和 checkbox), 示例: checked, checked(2), checked(1~2)
         *
         * @class CheckedRule
         * @implements {ValidationRule}
         */
        var CheckedRule = (function () {
            function CheckedRule() {
            }
            CheckedRule.prototype.validate = function ($form, $input, arg) {
                var count = parseInt(arg);
                var siblings = $form.find(":input:checked[name='" + $input.attr("name") + "']");
                return { ok: siblings.length >= count };
            };
            return CheckedRule;
        }());
        /**
         * 电子邮箱验证器
         *
         * @class EmailValidator
         * @implements {ValidationRule}
         */
        var EmailRule = (function () {
            function EmailRule() {
            }
            EmailRule.prototype.validate = function ($form, $input, arg) {
                var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
                var value = $.trim($input.val());
                return { ok: !value || regex.test(value) };
            };
            return EmailRule;
        }());
        /**
         * HTTP/FTP 地址验证器
         *
         * @class UrlValidator
         * @implements {ValidationRule}
         */
        var UrlRule = (function () {
            function UrlRule() {
            }
            UrlRule.prototype.validate = function ($form, $input, arg) {
                var regex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
                var value = $.trim($input.val());
                return { ok: !value || regex.test(value) };
            };
            return UrlRule;
        }());
        /**
         * IPV4 地址验证器
         *
         * @class IPValidator
         * @implements {ValidationRule}
         */
        var IPRule = (function () {
            function IPRule() {
            }
            IPRule.prototype.validate = function ($form, $input, arg) {
                var regex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i;
                var value = $.trim($input.val());
                return { ok: !value || regex.test(value) };
            };
            return IPRule;
        }());
        /**
         * 字段匹配验证器(如密码)
         *
         * @class MatchValidator
         * @implements {ValidationRule}
         */
        var MatchValidator = (function () {
            function MatchValidator() {
            }
            MatchValidator.prototype.validate = function ($form, $input, arg) {
                return { ok: $input.val() == $('#' + arg).val() };
            };
            return MatchValidator;
        }());
        /**
         * 字符串长度验证器
         *
         * @class LengthValidator
         * @implements {ValidationRule}
         */
        var LengthRule = (function () {
            function LengthRule() {
            }
            LengthRule.prototype.validate = function ($form, $input, arg) {
                var r = { ok: true };
                if (arg) {
                    var len = this.getLength($.trim($input.val()));
                    var args = arg.split('~');
                    if (args.length == 1) {
                        if ($.isNumeric(args[0])) {
                            r.ok = len >= parseInt(args[0]);
                        }
                    }
                    else {
                        if ($.isNumeric(args[0]) && $.isNumeric(args[1])) {
                            r.ok = len >= parseInt(args[0]) && len <= parseInt(args[1]);
                        }
                    }
                }
                return r;
            };
            LengthRule.prototype.getLength = function (value) {
                return value.length;
            };
            return LengthRule;
        }());
        /**
         * 字符串宽度验证器(中文字符宽度为2)
         *
         * @class WidthValidator
         * @extends {LengthRule}
         */
        var WidthRule = (function (_super) {
            __extends(WidthRule, _super);
            function WidthRule() {
                return _super.apply(this, arguments) || this;
            }
            WidthRule.prototype.getLength = function (value) {
                var doubleByteChars = value.match(/[^\x00-\xff]/ig);
                return value.length + (doubleByteChars == null ? 0 : doubleByteChars.length);
            };
            return WidthRule;
        }(LengthRule));
        /**
         * 整数验证器
         *
         * @class IntegerValidator
         * @implements {ValidationRule}
         */
        var IntegerRule = (function () {
            function IntegerRule() {
            }
            IntegerRule.prototype.validate = function ($form, $input, arg) {
                var regex = /^\d*$/;
                return { ok: regex.test($.trim($input.val())) };
            };
            return IntegerRule;
        }());
        /**
         * 正则表达式验证器
         *
         * @class RegexValidator
         * @implements {ValidationRule}
         */
        var RegexRule = (function () {
            function RegexRule() {
            }
            RegexRule.prototype.validate = function ($form, $input, arg) {
                var regex = new RegExp(arg, 'i');
                var value = $.trim($input.val());
                return { ok: !value || regex.test(value) };
            };
            return RegexRule;
        }());
        /**
         * 服务器端验证器
         *
         * @class RemoteRule
         * @implements {ValidationRule}
         */
        var RemoteRule = (function () {
            function RemoteRule() {
            }
            RemoteRule.prototype.validate = function ($form, $input, arg) {
                if (!arg) {
                    throw new Error("服务器验证地址未设置");
                }
                var value = $.trim($input.val());
                var r = { ok: false };
                $ajax.post(arg, { value: value }).encoder("form").async(false).json(function (result) {
                    r.ok = !result.error;
                    r.error = result.error;
                });
                return r;
            };
            return RemoteRule;
        }());
        var Validator = (function () {
            /**
             * Creates an instance of Validator.
             *
             * @param {(string | HTMLElement | JQuery)} elem 验证表单或其它容器元素
             * @param {*} [options] 选项
             *
             * @memberOf Validator
             */
            function Validator(elem, options) {
                this.form = $(elem);
                this.options = options;
                // 禁用 HTML5 默认验证, 处理表单提交事件
                if (this.form.is("form")) {
                    this.form.attr("novalidate", "true");
                }
                // 实时验证事件绑定
                this.form.on("click", ':radio[data-v-rule],:checkbox[data-v-rule]', this.checkValue.bind(this));
                this.form.on("change", 'select[data-v-rule],input[type="file"][data-v-rule]', this.checkValue.bind(this));
                this.form.on("blur", ':input[data-v-rule]:not(select,:radio,:checkbox,:file)', this.checkValue.bind(this));
            }
            Validator.prototype.checkValue = function (e) {
                var $input = $(e.target);
                var result = this.validateInput($input);
                Validator.mark($input, result);
            };
            /**
             * 创建验证器并绑定到表单
             *
             * @static
             * @param {(string | HTMLElement | JQuery)} elem 验证表单或其它容器元素
             * @param {ValidatorOptions} [options]
             * @returns {Validator} 选项
             *
             * @memberOf Validator
             */
            Validator.bind = function (elem, options) {
                var v = $(elem).data("validator");
                if (!v) {
                    v = new Validator(elem, options);
                    $(elem).data("validator", v);
                }
                return v;
            };
            /**
             * 验证表单
             *
             * @returns {ValidationResult[]}
             */
            Validator.prototype.validate = function () {
                var _this = this;
                var results = [];
                this.form.find(Validator.selector).each(function (i, el) {
                    var $input = $(el);
                    var result = _this.validateInput($input);
                    if (result != null) {
                        results.push(result);
                    }
                    Validator.mark($input, result);
                });
                return results;
            };
            /**
             * 清除验证标识
             */
            Validator.prototype.reset = function () {
                this.form.find(Validator.selector).each(function (i, el) {
                    var $input = $(el);
                    Validator.marker.reset($input);
                });
            };
            /**
             * 注册验证器
             *
             * @static
             * @param {string} name 验证器名称
             * @param {ValidationRule} rule 验证方法
             * @param {string} msg 验证消息
             *
             * @memberOf Validator
             */
            Validator.register = function (name, rule, msg) {
                this.rules[name] = rule;
                this.messages[name] = msg;
            };
            /**
             * 设置验证消息
             */
            Validator.setMessage = function (name, msg) {
                this.messages[name] = msg;
            };
            /**
             * 设置错误标识处理器
             */
            Validator.setMarker = function (marker) {
                this.marker = marker;
            };
            Validator.prototype.validateInput = function ($input) {
                var _this = this;
                var errors = [];
                var rules = ($input.data('v-rule') || 'native').split(';');
                rules.forEach(function (name) {
                    var rule = Validator.rules[name];
                    if (rule) {
                        var arg = $input.data("v-arg-" + name);
                        var r = rule.validate(_this.form, $input, arg);
                        if (!r.ok) {
                            errors.push(r.error || Validator.getMessge($input, name));
                        }
                    }
                });
                return (errors.length == 0) ? null : {
                    input: $input,
                    errors: errors
                };
            };
            Validator.mark = function ($input, result) {
                if (Validator.marker != null) {
                    if (result) {
                        Validator.marker.setError($input, result.errors);
                    }
                    else {
                        Validator.marker.clearError($input);
                    }
                }
            };
            Validator.getMessge = function ($input, rule) {
                // $input[0].validationMessage
                // if (!success) $input[0].setCustomValidity("错误信息");
                if (rule == 'native')
                    return $input[0].validationMessage;
                else {
                    var msg = $input.data('v-msg-' + rule);
                    if (!msg)
                        msg = this.messages[rule];
                    return msg;
                }
            };
            return Validator;
        }());
        Validator.selector = ':input[data-v-rule]:not(:submit,:button,:reset,:image,:disabled)';
        // 错误信息
        Validator.messages = {
            "required": "字段为必填",
            "checked": "选择的选项数不合要求",
            "email": "请输入有效的电子邮箱地址",
            "match": "两次输入必须一致",
            "length": "字段长度不满足条件",
            "width": "字段长度不满足条件",
            "url": "请输入有效的链接地址",
            "ip": "请输入有效的 IP 地址",
            "integer": "请输入整数",
            "regex": "输入不符合要求",
            "remote": "输入不符合要求"
        };
        // 验证规则
        Validator.rules = {
            "native": new NativeRule(),
            "required": new RequiredRule(),
            "checked": new CheckedRule(),
            "email": new EmailRule(),
            "match": new MatchValidator(),
            "length": new LengthRule(),
            "width": new WidthRule(),
            "url": new UrlRule(),
            "ip": new IPRule(),
            "integer": new IntegerRule(),
            "regex": new RegexRule(),
            "remote": new RemoteRule()
        };
        Util.Validator = Validator;
    })(Util = Mtime.Util || (Mtime.Util = {}));
})(Mtime || (Mtime = {}));
/*!
 * Mtime Form Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 * see: https://github.com/A1rPun/transForm.js
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
var Mtime;
(function (Mtime) {
    var UI;
    (function (UI) {
        var Validator = Mtime.Util.Validator;
        /**
         * 表单组件设置
         */
        var FormOptions = (function () {
            function FormOptions() {
                this.delimiter = ".";
                this.skipDisabled = true;
                this.skipReadOnly = false;
                this.skipEmpty = false;
                this.useIdOnEmptyName = true;
                this.triggerChange = false;
                this.enableValidator = true;
            }
            return FormOptions;
        }());
        UI.FormOptions = FormOptions;
        /**
         * 表单组件
         */
        var Form = (function () {
            /**
             * Creates an instance of Form.
             *
             * @param {(string | Element | JQuery)} elem 表单元素
             * @param {FormOptions} options 设置
             *
             * @memberOf Form
             */
            function Form(elem, options) {
                this.form = $(elem);
                this.options = $.extend(new FormOptions(), options);
                if (this.options.enableValidator) {
                    this.validator = Validator.bind(this.form);
                }
            }
            /**
             * 重置表单数据
             *
             * @memberOf Form
             */
            Form.prototype.reset = function () {
                this.form.get(0).reset();
                if (this.validator) {
                    this.validator.reset();
                }
            };
            /**
             * 清除表单数据
             *
             * @memberOf Form
             */
            Form.prototype.clear = function () {
                var _this = this;
                var inputs = this.getFields();
                inputs.each(function (i, input) {
                    _this.clearInput(input);
                });
                if (this.validator) {
                    this.validator.reset();
                }
            };
            /**
             * 以 AJAX 方式提交表单
             *
             * @param {string} url 如果不传则自动获取 form 表单的 action 属性
             * @returns {Mtime.Net.AjaxPostRequest}
             *
             * @memberOf Form
             */
            Form.prototype.submit = function (url) {
                var data = this.serialize();
                return Mtime.Net.Ajax.post(url || this.form.attr("action"), data);
            };
            /**
             * 验证表单
             *
             * @returns {boolean}
             */
            Form.prototype.validate = function () {
                if (!this.validator) {
                    return true;
                }
                return this.validator.validate().length == 0;
            };
            /**
             * 序列化为 JSON 对象
             *
             * @param {Function} [nodeCallback] 自定义获取表单元素值的函数
             * @returns {Object}
             *
             * @memberOf Form
             */
            Form.prototype.serialize = function (nodeCallback) {
                var result = {}, inputs = this.getFields();
                for (var i = 0, l = inputs.length; i < l; i++) {
                    var input = inputs[i], key = input.name || this.options.useIdOnEmptyName && input.id;
                    if (!key)
                        continue;
                    var entry = null;
                    if (nodeCallback)
                        entry = nodeCallback(input);
                    if (!entry)
                        entry = this.getEntryFromInput(input, key);
                    if (typeof entry.value === 'undefined' || entry.value === null
                        || (this.options.skipEmpty && (!entry.value || (this.isArray(entry.value) && !entry.value.length))))
                        continue;
                    this.saveEntryToResult(result, entry, input, this.options.delimiter);
                }
                return result;
            };
            /**
             * 填充对象到表单中
             *
             * @param {Object} data 要填充的数据
             * @param {Function} [nodeCallback] 自定义获取表单元素值的函数
             *
             * @memberOf Form
             */
            Form.prototype.deserialize = function (data, nodeCallback) {
                var inputs = this.getFields();
                for (var i = 0, l = inputs.length; i < l; i++) {
                    var input = inputs[i], key = input.name || this.options.useIdOnEmptyName && input.id, value = this.getFieldValue(key, data);
                    if (typeof value === 'undefined' || value === null) {
                        this.clearInput(input);
                        continue;
                    }
                    var mutated = nodeCallback && nodeCallback(input, value);
                    if (!mutated)
                        this.setValueToInput(input, value);
                }
            };
            Form.prototype.getEntryFromInput = function (input, key) {
                var nodeType = input.type && input.type.toLowerCase();
                var entry = { name: key };
                switch (nodeType) {
                    case 'radio':
                        if (input.checked)
                            entry.value = input.value === 'on' ? true : input.value;
                        break;
                    case 'checkbox':
                        entry.value = input.checked ? (input.value === 'on' ? true : input.value) : false;
                        break;
                    case 'select-multiple':
                        entry.value = [];
                        for (var i = 0, l = input.options.length; i < l; i++)
                            if (input.options[i].selected)
                                entry.value.push(input.options[i].value);
                        break;
                    case 'file':
                        //Only interested in the filename (Chrome adds C:\fakepath\ for security anyway)
                        entry.value = input.value.split('\\').pop();
                        break;
                    case 'button':
                    case 'submit':
                    case 'reset':
                        break;
                    default:
                        entry.value = input.value;
                }
                return entry;
            };
            Form.prototype.saveEntryToResult = function (parent, entry, input, delimiter) {
                //not not accept empty values in array collections
                if (/\[]$/.test(entry.name) && !entry.value)
                    return;
                var parts = this.parseString(entry.name, delimiter);
                for (var i = 0, l = parts.length; i < l; i++) {
                    var part = parts[i];
                    //if last
                    if (i === l - 1) {
                        parent[part] = entry.value;
                    }
                    else {
                        var index = parts[i + 1];
                        if (!index || this.isNumber(index)) {
                            if (!this.isArray(parent[part]))
                                parent[part] = [];
                            //if second last
                            if (i === l - 2) {
                                parent[part].push(entry.value);
                            }
                            else {
                                if (!this.isObject(parent[part][index]))
                                    parent[part][index] = {};
                                parent = parent[part][index];
                            }
                            i++;
                        }
                        else {
                            if (!this.isObject(parent[part]))
                                parent[part] = {};
                            parent = parent[part];
                        }
                    }
                }
            };
            Form.prototype.clearInput = function (input) {
                var nodeType = input.type && input.type.toLowerCase();
                switch (nodeType) {
                    case 'select-one':
                        input.selectedIndex = 0;
                        break;
                    case 'select-multiple':
                        for (var i = input.options.length; i--;)
                            input.options[i].selected = false;
                        break;
                    case 'radio':
                    case 'checkbox':
                        if (input.checked)
                            input.checked = false;
                        break;
                    case 'button':
                    case 'submit':
                    case 'reset':
                    case 'file':
                        break;
                    default:
                        input.value = '';
                }
                if (this.options.triggerChange) {
                    $(input).change();
                }
            };
            Form.prototype.parseString = function (str, delimiter) {
                var result = [], split = str.split(delimiter), len = split.length;
                for (var i = 0; i < len; i++) {
                    var s = split[i].split('['), l = s.length;
                    for (var j = 0; j < l; j++) {
                        var key = s[j];
                        if (!key) {
                            //if the first one is empty, continue
                            if (j === 0)
                                continue;
                            //if the undefined key is not the last part of the string, throw error
                            if (j !== l - 1)
                                throw new Error("Undefined key is not the last part of the name > " + str);
                        }
                        //strip "]" if its there
                        if (key && key[key.length - 1] === ']')
                            key = key.slice(0, -1);
                        result.push(key);
                    }
                }
                return result;
            };
            Form.prototype.getFields = function () {
                var inputs = this.form.find("input,select,textarea").filter(':not([data-form-ignore="true"])');
                if (this.options.skipDisabled)
                    inputs = inputs.filter(":not([disabled])");
                if (this.options.skipReadOnly)
                    inputs = inputs.filter(":not([readonly])");
                return inputs;
            };
            Form.prototype.getFieldValue = function (key, ref) {
                if (!key || !ref)
                    return;
                var parts = this.parseString(key, this.options.delimiter);
                for (var i = 0, l = parts.length; i < l; i++) {
                    var part = ref[parts[i]];
                    if (typeof part === 'undefined' || part === null)
                        return;
                    //if last
                    if (i === l - 1) {
                        return part;
                    }
                    else {
                        var index = parts[i + 1];
                        if (index === '') {
                            return part;
                        }
                        else if (this.isNumber(index)) {
                            //if second last
                            if (i === l - 2)
                                return part[index];
                            else
                                ref = part[index];
                            i++;
                        }
                        else {
                            ref = part;
                        }
                    }
                }
            };
            Form.prototype.setValueToInput = function (input, value) {
                var nodeType = input.type && input.type.toLowerCase();
                switch (nodeType) {
                    case 'radio':
                        if (value == input.value)
                            input.checked = true;
                        break;
                    case 'checkbox':
                        input.checked = this.isArray(value)
                            ? this.contains(value, input.value)
                            : value === true || value == input.value;
                        break;
                    case 'select-multiple':
                        if (this.isArray(value))
                            for (var i = input.options.length; i--;)
                                input.options[i].selected = this.contains(value, input.options[i].value);
                        else
                            input.value = value;
                        break;
                    case 'button':
                    case 'submit':
                    case 'reset':
                    case 'file':
                        break;
                    default:
                        input.value = value;
                }
                if (this.options.triggerChange) {
                    $(input).change();
                }
            };
            /* Helper functions */
            Form.prototype.contains = function (array, value) {
                // 为便于使用, 这里不用 === 进行比较
                for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                    var item = array_1[_i];
                    if (item == value)
                        return true;
                }
                return false;
            };
            Form.prototype.isObject = function (obj) {
                return typeof obj === 'object';
            };
            Form.prototype.isNumber = function (n) {
                return typeof n === 'number';
            };
            Form.prototype.isArray = function (arr) {
                return Array.isArray(arr);
            };
            return Form;
        }());
        UI.Form = Form;
    })(UI = Mtime.UI || (Mtime.UI = {}));
})(Mtime || (Mtime = {}));
// Dialog
var Mtime;
(function (Mtime) {
    var UI;
    (function (UI) {
        /**
         * BootstrapDialogFactory
         */
        var BootstrapDialogFactory = (function () {
            function BootstrapDialogFactory() {
            }
            BootstrapDialogFactory.prototype.create = function (options) {
                return new BootstrapDialog(options);
            };
            return BootstrapDialogFactory;
        }());
        UI.BootstrapDialogFactory = BootstrapDialogFactory;
        /**
         * BootstrapDialog
         */
        var BootstrapDialog = (function (_super) {
            __extends(BootstrapDialog, _super);
            function BootstrapDialog(options) {
                var _this = _super.call(this, options) || this;
                _this.dragData = {
                    dragging: false,
                    offset: {}
                };
                _this.handleEvents();
                _this.makeDraggable();
                if (_this.getDialogCount() == 1) {
                    // fix multiple dialog padding issue
                    $("body").data("dialog-padding", document.body.style.paddingRight || '');
                }
                return _this;
            }
            BootstrapDialog.prototype.show = function () {
                var options = { keyboard: this.options.closable };
                options.backdrop = this.options.backdrop ? (this.options.closable ? true : 'static') : false;
                this.$elem.modal(options);
                this.updateIndex();
                return this;
            };
            BootstrapDialog.prototype.close = function () {
                this.$elem.modal('hide');
            };
            BootstrapDialog.prototype.error = function (error) {
                if (error && error.length > 0) {
                    this.find('.modal-error').html(error).show();
                }
                else {
                    this.find('.modal-error').empty().hide();
                }
                return this;
            };
            BootstrapDialog.prototype.title = function (title) {
                this.find('.modal-title').html(title);
                return this;
            };
            BootstrapDialog.prototype.body = function (body) {
                this.find('.modal-body').html(arguments[0]);
                return this;
            };
            BootstrapDialog.prototype.build = function () {
                var _this = this;
                // let body: string;
                // if (typeof this.options.body === "Function") {
                //     body = this.options.body();
                // } else {
                // }
                var body = this.options.body;
                var $modal = $("<div id=\"dialog-" + this.id + "\" class=\"modal\" role=\"dialog\" tabindex=\"-1\" aria-hidden=\"true\" aria-labelledby=\"title-" + this.id + "\"></div>");
                var $dialog = $('<div class="modal-dialog"></div>');
                var $content = $('<div class="modal-content"></div>');
                var $header = $('<div class="modal-header"></div>');
                var $body = $('<div class="modal-body"></div>').append(body);
                var $footer = $('<div class="modal-footer"></div>');
                var $title = $("<h4 id=\"title-" + this.id + "\" class=\"modal-title\">" + this.options.title + "</h4>");
                var $error = $('<div class="modal-error" style="display:none"></div>');
                $modal.append($dialog);
                if (this.options.animate)
                    $modal.addClass('fade');
                $dialog.append($content);
                if (this.options.clazz)
                    $dialog.addClass(this.options.clazz);
                if (this.options.width)
                    $dialog.css("width", this.options.width);
                $content.append($header, $body, $error, $footer);
                if (this.options.closable) {
                    var $close = $('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    $header.append($close);
                }
                $header.append($title);
                // 倒计时
                if (this.options.countdown) {
                    $("<span class=\"modal-count pull-left\">" + this.options.countdown + "</span>").appendTo($footer);
                }
                // 按钮
                if (this.options.buttons) {
                    this.options.buttons.forEach(function (btn) {
                        var $btn = $('<button type="button" class="btn"/>').addClass(btn.clazz || (btn.primary ? 'btn-primary' : 'btn-default'));
                        if (btn.icon) {
                            $("<i class=\"" + btn.icon + "\"></i>").appendTo($btn);
                        }
                        $btn.append(btn.text).click(function (e) {
                            if (btn.callback)
                                btn.callback.call(e.target, _this);
                            else
                                _this.close();
                        });
                        $footer.append($btn);
                    });
                }
                return $modal;
            };
            // 更新层级以更好的支持多对话框
            BootstrapDialog.prototype.updateIndex = function () {
                var zIndexBackdrop = 1040;
                var zIndexModal = 1050;
                var dialogCount = this.getDialogCount();
                var $modal = this.$elem;
                var $backdrop = $modal.data('bs.modal').$backdrop;
                $modal.css('z-index', zIndexModal + (dialogCount - 1) * 20);
                $backdrop && $backdrop.css('z-index', zIndexBackdrop + (dialogCount - 1) * 20);
            };
            BootstrapDialog.prototype.getDialogCount = function () {
                var dialogCount = 0;
                $.each(UI.Dialog.dialogs, function () {
                    dialogCount++;
                });
                return dialogCount;
            };
            // 处理事件
            BootstrapDialog.prototype.handleEvents = function () {
                var _this = this;
                this.$elem.on('shown.bs.modal', function () {
                    _this.makeAutoClose();
                    _this.fire("show");
                });
                this.$elem.on('hidden.bs.modal', function () {
                    _this.fire("close");
                    delete UI.Dialog.dialogs[_this.id];
                    _this.$elem.remove();
                    _this.moveFocus();
                    if (_this.getDialogCount() > 0) {
                        $("body").addClass("modal-open");
                    }
                    else {
                        // fix multiple dialog padding issue
                        $("body").css('padding-right', $("body").data("dialog-padding"));
                    }
                });
            };
            // 处理自动关闭
            BootstrapDialog.prototype.makeAutoClose = function () {
                var _this = this;
                if (this.options.countdown > 0) {
                    var seconds_1 = this.options.countdown;
                    var $count_1 = this.find('.modal-count');
                    var action_1 = function () {
                        seconds_1--;
                        if (seconds_1 > 0) {
                            $count_1.text(seconds_1);
                            setTimeout(action_1, 1000);
                        }
                        else
                            _this.close();
                    };
                    setTimeout(action_1, 1000);
                }
            };
            // 拖动处理
            BootstrapDialog.prototype.makeDraggable = function () {
                if (this.options.draggable) {
                    var $header_1 = this.find('.modal-header');
                    var $dialog_1 = this.find('.modal-dialog');
                    $header_1.on('mousedown', { dialog: this }, function (e) {
                        $header_1.addClass('draggable');
                        var dialog = e.data.dialog;
                        dialog.dragData.dragging = true;
                        var dialogOffset = $dialog_1.offset();
                        dialog.dragData.offset = {
                            top: e.clientY - dialogOffset.top,
                            left: e.clientX - dialogOffset.left
                        };
                    });
                    this.$elem.on('mouseup mouseleave', { dialog: this }, function (e) {
                        $header_1.removeClass('draggable');
                        e.data.dialog.dragData.dragging = false;
                    });
                    $('body').on('mousemove', { dialog: this }, function (e) {
                        var dialog = e.data.dialog;
                        if (!dialog.dragData.dragging) {
                            return;
                        }
                        $dialog_1.offset({
                            top: e.clientY - dialog.dragData.offset.top,
                            left: e.clientX - dialog.dragData.offset.left
                        });
                    });
                }
            };
            return BootstrapDialog;
        }(UI.Dialog));
    })(UI = Mtime.UI || (Mtime.UI = {}));
})(Mtime || (Mtime = {}));
(function (Mtime) {
    var Util;
    (function (Util) {
        var BootstrapValidationMarker = (function () {
            function BootstrapValidationMarker() {
            }
            BootstrapValidationMarker.prototype.setError = function ($input, errors) {
                var $parent = this.getParent($input);
                var $error = $parent.find('ul.error-list');
                if (!$error.length) {
                    $error = $('<ul/>').addClass('error-list').appendTo($parent);
                }
                $error.empty().append($.map(errors, function (error) { return $('<li/>').text(error); })).show();
                this.getGroup($input).removeClass('has-success').addClass('has-error');
                $parent.find('.help-block').hide();
                $parent.find('.form-control-feedback').removeClass("glyphicon-ok").addClass("glyphicon-remove");
            };
            BootstrapValidationMarker.prototype.clearError = function ($input) {
                var $parent = this.getParent($input);
                var $error = $parent.find('ul.error-list');
                if (!$error.length || $error.is(":hidden")) {
                    return;
                }
                $error.empty().hide();
                this.getGroup($input).removeClass('has-error').addClass('has-success');
                $parent.find('.help-block').show();
                $parent.find('.form-control-feedback').removeClass("glyphicon-remove").addClass("glyphicon-ok");
            };
            BootstrapValidationMarker.prototype.reset = function ($input) {
                var $parent = this.getParent($input);
                $parent.find('ul.error-list').empty().hide();
                $parent.find('.help-block').show();
                this.getGroup($input).removeClass('has-error').removeClass('has-success');
                $parent.find('.form-control-feedback').removeClass("glyphicon-remove").removeClass("glyphicon-ok");
            };
            BootstrapValidationMarker.prototype.getGroup = function ($input) {
                var $group = $input.closest('.control-group');
                if ($group.length == 0) {
                    $group = $input.closest('.form-group');
                }
                return $group;
            };
            BootstrapValidationMarker.prototype.getParent = function ($input) {
                var $parent = $input.parent();
                if ($parent.is("label")) {
                    // radio & checkbox
                    $parent = $parent.parent();
                }
                if ($parent.is(".input-group")) {
                    // radio & checkbox
                    $parent = $parent.parent();
                }
                return $parent;
            };
            return BootstrapValidationMarker;
        }());
        Util.BootstrapValidationMarker = BootstrapValidationMarker;
    })(Util = Mtime.Util || (Mtime.Util = {}));
})(Mtime || (Mtime = {}));
/**
 * 初始化 Bootstrap 相关组件
 */
$(function () {
    // Dialog
    Mtime.UI.Dialog.factory = new Mtime.UI.BootstrapDialogFactory();
    // AJAX
    Mtime.Net.AjaxRequest.preHandler = function (options) {
        options.trigger && $(options.trigger).data("loading-text", '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>').button("loading");
    };
    Mtime.Net.AjaxRequest.postHandler = function (options) {
        options.trigger && $(options.trigger).button("reset");
    };
    // Validator
    Mtime.Util.Validator.setMarker(new Mtime.Util.BootstrapValidationMarker());
});
//# sourceMappingURL=mtime.all.js.map