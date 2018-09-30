var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                    errors: errors,
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
            "remote": "输入不符合要求",
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
            "remote": new RemoteRule(),
        };
        Util.Validator = Validator;
    })(Util = Mtime.Util || (Mtime.Util = {}));
})(Mtime || (Mtime = {}));
//# sourceMappingURL=mtime.validator.js.map