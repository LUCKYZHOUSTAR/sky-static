declare namespace Mtime.Util {
    /**
     * Dispatcher
     */
    class Dispatcher {
        private attr;
        private events;
        constructor(attr?: string);
        /**
         * 创建一个 Dispatcher 并绑定事件到页面元素上
         *
         * @param elem
         * @param event
         * @returns {Dispatcher}
         */
        static bind(elem: string | JQuery | Element | Document, event?: string): Dispatcher;
        /**
         * 注册动作事件
         *
         * @param action
         * @param handler
         * @returns {Mtime.Util.Dispatcher}
         */
        on(action: string, handler: (e: JQueryEventObject) => any): Dispatcher;
        /**
         * 移除动作事件
         *
         * @param action
         * @returns {Mtime.Util.Dispatcher}
         */
        off(action: string): Dispatcher;
        /**
         * 绑定事件到页面元素上
         *
         * @param elem
         * @param event
         * @returns {Mtime.Util.Dispatcher}
         */
        bind(elem: string | JQuery | Element | Document, event?: string): Dispatcher;
        private handle(e);
    }
    /**
     * Float 浮点数操作
     */
    class Float {
        /**
         * 加
         *
         * @param numbers
         * @returns {number}
         */
        static add(...numbers: number[]): number;
        /**
         * 减
         *
         * @param n1
         * @param n2
         * @returns {number}
         */
        static subtract(n1: number, n2: number): number;
        /**
         * 乘
         *
         * @param numbers
         * @returns {number}
         */
        static multiply(...numbers: number[]): number;
        /**
         * 除
         *
         * @param n1
         * @param n2
         * @returns {number}
         */
        static divide(n1: number, n2: number): number;
        /**
         * 四舍五入
         *
         * @param num
         * @param precision
         * @returns {string}
         */
        static toFixed(num: number, precision?: number): string;
        private static getMaxTimes(...numbers);
        private static toInteger(n);
    }
    /**
     * 简单的 Url 处理类
     */
    class Url {
        private path;
        private query;
        constructor(uri: string);
        getPath(): string;
        getParam(key: string): string;
        setParam(key: string, value: string): this;
        removeParam(key: string): this;
        toString(): string;
    }
}
declare namespace Mtime.Net {
    type AjaxErrorHandler = (xhr: JQueryXHR, textStatus: string, error: string) => void;
    /**
     * AjaxOptions
     */
    class AjaxOptions {
        private static defaultOptions;
        /**
         * 请求地址
         */
        url: string;
        /**
         * 请求方式
         */
        method: AjaxMethod;
        /**
         * 请求数据
         */
        data?: Object;
        /**
         * 请求超时时间, 单位毫秒
         *
         * @type {number}
         */
        timeout?: number;
        /**
         * 是否以异步方式发送请求
         *
         * @type {boolean}
         */
        async?: boolean;
        /**
         * 服务端返回的数据类型
         */
        dataType?: "text" | "html" | "json" | "jsonp" | "xml" | "script" | string;
        /**
         * 操作触发元素
         *
         * @type {(Element | JQuery)}
         */
        trigger?: Element | JQuery;
        /**
         * 数据编码器(仅用于 POST 请求)
         */
        encoder: "none" | "form" | "json";
        /**
         * 前置处理函数
         */
        preHandler: (options: AjaxOptions) => void;
        /**
         * 后置处理函数
         */
        postHandler: (options: AjaxOptions) => void;
        /**
         * 错误处理函数
         */
        errorHandler: AjaxErrorHandler;
        /**
         * 设置全局默认属性
         *
         * @returns {AjaxOptions}
         */
        static getDefaultOptions(): AjaxOptions;
        /**
         * 获取全局默认属性
         *
         * @param options
         */
        static setDefaultOptions(options: AjaxOptions): void;
    }
    /**
     * AJAX 请求方式
     */
    enum AjaxMethod {
        GET = 0,
        POST = 1,
        PUT = 2,
        DELETE = 3,
        HEAD = 4,
        TRACE = 5,
        OPTIONS = 6,
        CONNECT = 7,
        PATCH = 8,
    }
    /**
     * AJAX 请求
     */
    class AjaxRequest {
        static preHandler: (options: AjaxOptions) => void;
        static postHandler: (options: AjaxOptions) => void;
        static errorHandler: (xhr: JQueryXHR, textStatus: string, error: string) => void;
        protected options: AjaxOptions;
        constructor(url: string, method: AjaxMethod, data?: any);
        /**
         * 设置前置处理函数
         *
         * @param handler
         * @return {Mtime.Net.AjaxRequest}
         */
        preHandler(handler: (options: AjaxOptions) => void): this;
        /**
         * 设置后置处理函数
         *
         * @param handler
         * @return {Mtime.Net.AjaxRequest}
         */
        postHandler(handler: (options: AjaxOptions) => void): this;
        /**
         * 设置错误处理函数
         *
         * @param handler
         * @return {Mtime.Net.AjaxRequest}
         */
        errorHandler(handler: AjaxErrorHandler): this;
        /**
         * 设置请求超时时间
         *
         * @param timeout
         * @returns {Mtime.Net.AjaxRequest}
         */
        timeout(timeout: number): this;
        /**
         * 设置是用异步还是同步方式发送请求
         *
         * @param async
         * @returns {Mtime.Net.AjaxRequest}
         */
        async(async: boolean): this;
        /**
         * 设置触发元素
         *
         * @param {(Element | JQuery)} elem
         * @returns {Mtime.Net.AjaxRequest}
         */
        trigger(elem: Element | JQuery): this;
        /**
         * 获取 JSON 格式响应
         *
         * @template T 数据类型
         * @param {(r: T) => void} [callback] 回调函数
         */
        json<T>(callback?: (r: T) => void): void | Promise<T>;
        /**
         * 获取文本格式响应
         *
         * @param {(r: string) => void} [callback] 回调函数
         */
        text(callback?: (r: string) => void): void | Promise<string>;
        /**
         * 获取 HTML 格式响应
         *
         * @param {(r: string) => void} [callback] 回调函数
         */
        html(callback?: (r: string) => void): void | Promise<string>;
        protected result<T>(dataType: string, callback?: (r: T) => void): void | Promise<T>;
        protected buildSettings(): JQueryAjaxSettings;
    }
    /**
     * AJAX GET 请求
     */
    class AjaxGetRequest extends AjaxRequest {
        /**
         * 获取 JSON 格式响应
         *
         * @template T 数据类型
         * @param {(r: T) => void} [callback] 回调函数
         */
        jsonp<T>(callback?: (r: T) => void): void | Promise<T>;
    }
    /**
     * AJAX POST 请求
     */
    class AjaxPostRequest extends AjaxRequest {
        /**
         * 设置请求数据编码方式
         *
         * @param encoder
         * @returns {Mtime.Net.AjaxPostRequest}
         */
        encoder(encoder: "none" | "form" | "json"): this;
        protected buildSettings(): JQueryAjaxSettings;
    }
    /**
     * AJAX 请求入口类
     */
    class Ajax {
        private constructor();
        /**
         * 发起 GET 请求
         *
         * @static
         * @param {string} url 请求地址
         * @param {Object} [args] 请求数据
         * @returns {Ajax} 当前 Ajax 对象
         */
        static get(url: string, args?: Object): AjaxGetRequest;
        /**
         * 发起 POST 请求
         *
         * @static
         * @param {string} url 请求地址
         * @param {(string | Object)} [data] 请求数据
         * @returns {Ajax} 当前 Ajax 对象
         */
        static post(url: string, data?: string | Object): AjaxPostRequest;
    }
    /**
     * AJAX 请求静态方法接口(仅用于实现 $ajax 快捷对象)
     */
    interface AjaxStatic {
        /**
         * 发起 GET 请求
         *
         * @static
         * @param {string} url 请求地址
         * @param {Object} [args] 请求数据
         * @returns {Ajax} 当前 Ajax 对象
         */
        get(url: string, args?: Object): Mtime.Net.AjaxGetRequest;
        /**
         * 发起 POST 请求
         *
         * @static
         * @param {string} url 请求地址
         * @param {(string | Object)} [data] 请求数据
         * @returns {Ajax} 当前 Ajax 对象
         */
        post(url: string, data?: string | Object): Mtime.Net.AjaxPostRequest;
    }
}
interface Window {
    $ajax: Mtime.Net.AjaxStatic;
}
declare var $ajax: Mtime.Net.AjaxStatic;
declare namespace Mtime.UI {
    /**
     * DialogButton
     */
    class DialogButton {
        text?: string;
        primary?: boolean;
        clazz?: string;
        callback?: (dlg: Dialog) => void;
        icon?: string;
        constructor(text: string, callback?: (dlg: Dialog) => void, primary?: boolean);
        static primary(text?: string, callback?: (dlg: Dialog) => void): DialogButton;
        static cancel(text?: string, callback?: (dlg: Dialog) => void): DialogButton;
    }
    /**
     * 对话框工厂
     *
     * @export
     * @interface DialogFactory
     */
    interface DialogFactory {
        create(options?: DialogOptions): Dialog;
    }
    interface DialogOptions {
        title?: string;
        body?: string;
        buttons?: DialogButton[];
        width?: string | number;
        clazz?: string;
        backdrop?: boolean;
        draggable?: boolean;
        closable?: boolean;
        countdown?: number;
        animate?: boolean;
        data?: any;
    }
    abstract class Dialog {
        static factory: DialogFactory;
        private static defaultOptions;
        protected static dialogs: {
            [index: number]: Dialog;
        };
        protected id: number;
        protected options: DialogOptions;
        protected $elem: JQuery;
        protected events: {
            [index: string]: (dlg: Dialog) => void;
        };
        constructor(options: DialogOptions);
        protected fire(event: string): void;
        protected moveFocus(): void;
        protected abstract build(): JQuery;
        find(selector: string | Element | JQuery): JQuery;
        data(data?: any): any | Dialog;
        abstract show(): Dialog;
        abstract close(): void;
        abstract error(error?: string): Dialog;
        abstract title(title: string): Dialog;
        abstract body(body: string): Dialog;
        /**
         * 绑定事件
         *
         * @param {string} event
         * @param {(dlg: Dialog) => void} action
         * @returns {Dialog}
         */
        on(event: "show" | "close", action: (dlg: Dialog) => void): Dialog;
        /**
         * 创建对话框
         *
         * @static
         * @param {DialogOptions} options
         * @returns {Dialog}
         */
        static create(options: DialogOptions): Dialog;
        /**
         * 显示对话框
         *
         * @static
         * @param {DialogOptions} options
         * @returns {Dialog}
         */
        static show(options: DialogOptions): Dialog;
        static alert(content: string, title?: string, callback?: (dlg: Dialog) => void, options?: DialogOptions): Dialog;
        static confirm(content: string, title?: string, callback?: (dlg: Dialog) => void, options?: DialogOptions): Dialog;
    }
}
interface Window {
    $alert(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
    $confirm(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
}
declare function $alert(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
declare function $confirm(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
declare namespace Mtime.Util {
    /**
     * 输入控件验证结果
     *
     * @interface ValidationResult
     */
    interface ValidationResult {
        input: JQuery;
        errors: string[];
    }
    interface ValidationRule {
        validate($form: JQuery, $input: JQuery, arg?: string): {
            ok: boolean;
            error?: string;
        };
    }
    interface ValidationMarker {
        setError($input: JQuery, errors: string[]): void;
        clearError($input: JQuery): void;
        reset($input: JQuery): void;
    }
    interface ValidatorOptions {
    }
    class Validator {
        private static selector;
        private static marker;
        private static messages;
        private static rules;
        private form;
        private options;
        /**
         * Creates an instance of Validator.
         *
         * @param {(string | HTMLElement | JQuery)} elem 验证表单或其它容器元素
         * @param {*} [options] 选项
         *
         * @memberOf Validator
         */
        private constructor(elem, options?);
        private checkValue(e);
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
        static bind(elem: string | HTMLElement | JQuery, options?: ValidatorOptions): Validator;
        /**
         * 验证表单
         *
         * @returns {ValidationResult[]}
         */
        validate(): ValidationResult[];
        /**
         * 清除验证标识
         */
        reset(): void;
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
        static register(name: string, rule: ValidationRule, msg: string): void;
        /**
         * 设置验证消息
         */
        static setMessage(name: string, msg: string): void;
        /**
         * 设置错误标识处理器
         */
        static setMarker(marker: ValidationMarker): void;
        private validateInput($input);
        private static mark($input, result);
        private static getMessge($input, rule);
    }
}
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
interface JQuery {
    modal(options: 'show' | 'hide' | 'toggle' | 'handleUpdate' | {
        backdrop?: boolean | 'static';
        keyboard?: boolean;
        show?: boolean;
    }): JQuery;
}
declare namespace Mtime.UI {
    /**
     * BootstrapDialogFactory
     */
    class BootstrapDialogFactory implements DialogFactory {
        create(options?: DialogOptions): Dialog;
    }
}
declare namespace Mtime.Util {
    class BootstrapValidationMarker implements ValidationMarker {
        setError($input: JQuery, errors: string[]): void;
        clearError($input: JQuery): void;
        reset($input: JQuery): void;
        private getGroup($input);
        private getParent($input);
    }
}
