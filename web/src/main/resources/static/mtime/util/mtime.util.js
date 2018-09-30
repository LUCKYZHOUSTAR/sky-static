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
//# sourceMappingURL=mtime.util.js.map