var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                    errorHandler: AjaxRequest.errorHandler,
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
                    async: this.options.async,
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
//# sourceMappingURL=mtime.ajax.js.map