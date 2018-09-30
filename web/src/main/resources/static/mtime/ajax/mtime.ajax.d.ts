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
