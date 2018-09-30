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
//# sourceMappingURL=mtime.form.js.map