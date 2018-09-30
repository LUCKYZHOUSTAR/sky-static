/*!
 * Mtime Form Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 * see: https://github.com/A1rPun/transForm.js
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
namespace Mtime.UI {
    import Validator = Mtime.Util.Validator;

    /**
     * 表单组件设置
     */
    export class FormOptions {
        delimiter: string = ".";
        skipDisabled: boolean = true;
        skipReadOnly: boolean = false;
        skipEmpty: boolean = false;
        useIdOnEmptyName: boolean = true;
        triggerChange: boolean = false;
        enableValidator: boolean = true;
    }

    interface Entry {
        name: string;
        value?: any;
    }

    /**
     * 表单组件
     */
    export class Form {
        private form: JQuery;
        private options: FormOptions;
        private validator: Validator;

        /**
         * Creates an instance of Form.
         *
         * @param {(string | Element | JQuery)} elem 表单元素
         * @param {FormOptions} options 设置
         *
         * @memberOf Form
         */
        constructor(elem: string | Element | JQuery, options?: FormOptions) {
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
        reset() {
            (<HTMLFormElement>this.form.get(0)).reset();
            if (this.validator) {
                this.validator.reset();
            }
        }

        /**
         * 清除表单数据
         *
         * @memberOf Form
         */
        clear() {
            let inputs = this.getFields();
            inputs.each((i, input) => {
                this.clearInput(input);
            });
            if (this.validator) {
                this.validator.reset();
            }
        }

        /**
         * 以 AJAX 方式提交表单
         *
         * @param {string} url 如果不传则自动获取 form 表单的 action 属性
         * @returns {Mtime.Net.AjaxPostRequest}
         *
         * @memberOf Form
         */
        submit(url?: string): Mtime.Net.AjaxPostRequest {
            let data = this.serialize();
            return Mtime.Net.Ajax.post(url || this.form.attr("action"), data);
        }

        /**
         * 验证表单
         *
         * @returns {boolean}
         */
        validate(): boolean {
            if (!this.validator) {
                return true;
            }
            return this.validator.validate().length == 0;
        }

        /**
         * 序列化为 JSON 对象
         *
         * @param {Function} [nodeCallback] 自定义获取表单元素值的函数
         * @returns {Object}
         *
         * @memberOf Form
         */
        serialize(nodeCallback?: Function): Object {
            let result = {},
                inputs = this.getFields();

            for (let i = 0, l = inputs.length; i < l; i++) {
                let input: any = inputs[i],
                    key = input.name || this.options.useIdOnEmptyName && input.id;

                if (!key) continue;

                let entry: Entry = null;
                if (nodeCallback) entry = nodeCallback(input);
                if (!entry) entry = this.getEntryFromInput(input, key);

                if (typeof entry.value === 'undefined' || entry.value === null
                    || (this.options.skipEmpty && (!entry.value || (this.isArray(entry.value) && !entry.value.length))))
                    continue;
                this.saveEntryToResult(result, entry, input, this.options.delimiter);
            }
            return result;
        }

        /**
         * 填充对象到表单中
         *
         * @param {Object} data 要填充的数据
         * @param {Function} [nodeCallback] 自定义获取表单元素值的函数
         *
         * @memberOf Form
         */
        deserialize(data: Object, nodeCallback?: Function) {
            let inputs = this.getFields();
            for (let i = 0, l = inputs.length; i < l; i++) {
                let input: any = inputs[i],
                    key = input.name || this.options.useIdOnEmptyName && input.id,
                    value = this.getFieldValue(key, data);

                if (typeof value === 'undefined' || value === null) {
                    this.clearInput(input);
                    continue;
                }

                let mutated = nodeCallback && nodeCallback(input, value);
                if (!mutated) this.setValueToInput(input, value);
            }
        }

        private getEntryFromInput(input: any, key: string): Entry {
            let nodeType = input.type && input.type.toLowerCase();
            let entry: Entry = { name: key };

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
                    for (let i = 0, l = input.options.length; i < l; i++)
                        if (input.options[i].selected) entry.value.push(input.options[i].value);
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
        }

        private saveEntryToResult(parent: { [index: string]: any }, entry: Entry, input: HTMLElement, delimiter: string) {
            //not not accept empty values in array collections
            if (/\[]$/.test(entry.name) && !entry.value) return;

            let parts = this.parseString(entry.name, delimiter);
            for (let i = 0, l = parts.length; i < l; i++) {
                let part = parts[i];
                //if last
                if (i === l - 1) {
                    parent[part] = entry.value;
                } else {
                    let index = parts[i + 1];
                    if (!index || this.isNumber(index)) {
                        if (!this.isArray(parent[part]))
                            parent[part] = [];
                        //if second last
                        if (i === l - 2) {
                            parent[part].push(entry.value);
                        } else {
                            if (!this.isObject(parent[part][index]))
                                parent[part][index] = {};
                            parent = parent[part][index];
                        }
                        i++;
                    } else {
                        if (!this.isObject(parent[part]))
                            parent[part] = {};
                        parent = parent[part];
                    }
                }
            }
        }

        private clearInput(input: any) {
            let nodeType = input.type && input.type.toLowerCase();
            switch (nodeType) {
                case 'select-one':
                    input.selectedIndex = 0;
                    break;
                case 'select-multiple':
                    for (let i = input.options.length; i--;)
                        input.options[i].selected = false;
                    break;
                case 'radio':
                case 'checkbox':
                    if (input.checked) input.checked = false;
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
        }

        private parseString(str: string, delimiter: string): string[] {
            let result: string[] = [],
                split = str.split(delimiter),
                len = split.length;
            for (let i = 0; i < len; i++) {
                let s = split[i].split('['),
                    l = s.length;
                for (let j = 0; j < l; j++) {
                    let key = s[j];
                    if (!key) {
                        //if the first one is empty, continue
                        if (j === 0) continue;
                        //if the undefined key is not the last part of the string, throw error
                        if (j !== l - 1)
                            throw new Error(`Undefined key is not the last part of the name > ${str}`);
                    }
                    //strip "]" if its there
                    if (key && key[key.length - 1] === ']')
                        key = key.slice(0, -1);
                    result.push(key);
                }
            }
            return result;
        }

        private getFields(): JQuery {
            let inputs: JQuery = this.form.find("input,select,textarea").filter(':not([data-form-ignore="true"])');
            if (this.options.skipDisabled) inputs = inputs.filter(":not([disabled])");
            if (this.options.skipReadOnly) inputs = inputs.filter(":not([readonly])");
            return inputs;
        }

        private getFieldValue(key: string, ref: any): any {
            if (!key || !ref) return;

            let parts = this.parseString(key, this.options.delimiter);
            for (let i = 0, l = parts.length; i < l; i++) {
                let part = ref[parts[i]];

                if (typeof part === 'undefined' || part === null) return;

                //if last
                if (i === l - 1) {
                    return part;
                } else {
                    let index = parts[i + 1];
                    if (index === '') {
                        return part;
                    } else if (this.isNumber(index)) {
                        //if second last
                        if (i === l - 2)
                            return part[index];
                        else
                            ref = part[index];
                        i++;
                    } else {
                        ref = part;
                    }
                }
            }
        }

        private setValueToInput(input: any, value: any) {
            let nodeType = input.type && input.type.toLowerCase();
            switch (nodeType) {
                case 'radio':
                    if (value == input.value) input.checked = true;
                    break;
                case 'checkbox':
                    input.checked = this.isArray(value)
                        ? this.contains(value, input.value)
                        : value === true || value == input.value;
                    break;
                case 'select-multiple':
                    if (this.isArray(value))
                        for (let i = input.options.length; i--;)
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
        }

        /* Helper functions */
        private contains(array: any[], value: any): boolean {
            // 为便于使用, 这里不用 === 进行比较
            for (let item of array) {
                if (item == value) return true;
            }
            return false;
        }
        private isObject(obj: any) {
            return typeof obj === 'object';
        }
        private isNumber(n: any) {
            return typeof n === 'number';
        }
        private isArray(arr: any) {
            return Array.isArray(arr);
        }
    }
}