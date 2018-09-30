declare namespace Mtime.UI {
    /**
     * 表单组件设置
     */
    class FormOptions {
        delimiter: string;
        skipDisabled: boolean;
        skipReadOnly: boolean;
        skipEmpty: boolean;
        useIdOnEmptyName: boolean;
        triggerChange: boolean;
        enableValidator: boolean;
    }
    /**
     * 表单组件
     */
    class Form {
        private form;
        private options;
        private validator;
        /**
         * Creates an instance of Form.
         *
         * @param {(string | Element | JQuery)} elem 表单元素
         * @param {FormOptions} options 设置
         *
         * @memberOf Form
         */
        constructor(elem: string | Element | JQuery, options?: FormOptions);
        /**
         * 重置表单数据
         *
         * @memberOf Form
         */
        reset(): void;
        /**
         * 清除表单数据
         *
         * @memberOf Form
         */
        clear(): void;
        /**
         * 以 AJAX 方式提交表单
         *
         * @param {string} url 如果不传则自动获取 form 表单的 action 属性
         * @returns {Mtime.Net.AjaxPostRequest}
         *
         * @memberOf Form
         */
        submit(url?: string): Mtime.Net.AjaxPostRequest;
        /**
         * 验证表单
         *
         * @returns {boolean}
         */
        validate(): boolean;
        /**
         * 序列化为 JSON 对象
         *
         * @param {Function} [nodeCallback] 自定义获取表单元素值的函数
         * @returns {Object}
         *
         * @memberOf Form
         */
        serialize(nodeCallback?: Function): Object;
        /**
         * 填充对象到表单中
         *
         * @param {Object} data 要填充的数据
         * @param {Function} [nodeCallback] 自定义获取表单元素值的函数
         *
         * @memberOf Form
         */
        deserialize(data: Object, nodeCallback?: Function): void;
        private getEntryFromInput(input, key);
        private saveEntryToResult(parent, entry, input, delimiter);
        private clearInput(input);
        private parseString(str, delimiter);
        private getFields();
        private getFieldValue(key, ref);
        private setValueToInput(input, value);
        private contains(array, value);
        private isObject(obj);
        private isNumber(n);
        private isArray(arr);
    }
}
