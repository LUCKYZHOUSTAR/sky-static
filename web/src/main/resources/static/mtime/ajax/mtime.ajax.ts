/*!
 * Mtime Ajax Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
namespace Mtime.Net {
    export type AjaxErrorHandler = (xhr: JQueryXHR, textStatus: string, error: string) => void;

    /**
     * AjaxOptions
     */
    export class AjaxOptions {
        private static defaultOptions: AjaxOptions = new AjaxOptions();
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
        timeout?: number = 30000;
        /**
         * 是否以异步方式发送请求
         *
         * @type {boolean}
         */
        async?: boolean = true;
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
        encoder: "none" | "form" | "json" = "json";
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
        static getDefaultOptions(): AjaxOptions {
            return AjaxOptions.defaultOptions;
        }

        /**
         * 获取全局默认属性
         *
         * @param options
         */
        static setDefaultOptions(options: AjaxOptions) {
            if (options) {
                AjaxOptions.defaultOptions = options;
            }
        }
    }

    /**
     * AJAX 请求方式
     */
    export enum AjaxMethod {
        GET,
        POST,
        PUT,
        DELETE,
        HEAD,
        TRACE,
        OPTIONS,
        CONNECT,
        PATCH
    }

    /**
     * AJAX 请求
     */
    export class AjaxRequest {
        static preHandler: (options: AjaxOptions) => void = options => {
            options.trigger && $(options.trigger).prop("disabled", true);
        };
        static postHandler: (options: AjaxOptions) => void = options => {
            options.trigger && $(options.trigger).prop("disabled", false);
        };
        static errorHandler: (xhr: JQueryXHR, textStatus: string, error: string) => void = (xhr, status, err) => {
            let content: string;
            let width: number;
            if (xhr.responseJSON) {
                let info = xhr.responseJSON;
                width = 800
                content = `<dl class="dl-horizontal" style="height: 360px; overflow: auto">
	<dt>请求地址</dt>
	<dd>${info.url}</dd>
	<dt>状态码</dt>
	<dd>${info.status}</dd>
	<dt>状态描述</dt>
	<dd>${info.statusText}</dd>
	<dt>错误码</dt>
	<dd>${info.code}</dd>
	<dt>错误信息</dt>
	<dd>${info.message}</dd>
	<dt>时间</dt>
	<dd>${info.time}</dd>
	<dt>异常</dt>
	<dd>${info.exception}</dd>
	<dt>异常堆栈</dt>
	<dd><code>${info.exceptionDetail}</code></dd>	
</dl>`;
            } else if (status == "timeout") {
                content = "请求超时"
            } else if (xhr.status >= 400) {
                content = err || status;
            } else {
                return
            }
            Mtime.UI.Dialog.show({
                body: content,
                closable: true,
                width: width,
                buttons: [Mtime.UI.DialogButton.primary()]
            });
        };
        protected options: AjaxOptions;

        constructor(url: string, method: AjaxMethod, data?: any) {
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
        preHandler(handler: (options: AjaxOptions) => void): this {
            this.options.preHandler = handler;
            return this;
        }

        /**
         * 设置后置处理函数
         *
         * @param handler
         * @return {Mtime.Net.AjaxRequest}
         */
        postHandler(handler: (options: AjaxOptions) => void): this {
            this.options.postHandler = handler;
            return this;
        }

        /**
         * 设置错误处理函数
         *
         * @param handler
         * @return {Mtime.Net.AjaxRequest}
         */
        errorHandler(handler: AjaxErrorHandler): this {
            this.options.errorHandler = handler;
            return this;
        }

        /**
         * 设置请求超时时间
         *
         * @param timeout
         * @returns {Mtime.Net.AjaxRequest}
         */
        timeout(timeout: number): this {
            this.options.timeout = timeout;
            return this;
        }

        /**
         * 设置是用异步还是同步方式发送请求
         *
         * @param async
         * @returns {Mtime.Net.AjaxRequest}
         */
        async(async: boolean): this {
            this.options.async = async;
            return this;
        }

        /**
         * 设置触发元素
         *
         * @param {(Element | JQuery)} elem
         * @returns {Mtime.Net.AjaxRequest}
         */
        trigger(elem: Element | JQuery): this {
            this.options.trigger = elem;
            return this;
        }

        /**
         * 获取 JSON 格式响应
         *
         * @template T 数据类型
         * @param {(r: T) => void} [callback] 回调函数
         */
        json<T>(callback?: (r: T) => void): void | Promise<T> {
            return this.result<T>("json", callback);
        }

        /**
         * 获取文本格式响应
         *
         * @param {(r: string) => void} [callback] 回调函数
         */
        text(callback?: (r: string) => void): void | Promise<string> {
            return this.result<string>("text", callback);
        }

        /**
         * 获取 HTML 格式响应
         *
         * @param {(r: string) => void} [callback] 回调函数
         */
        html(callback?: (r: string) => void): void | Promise<string> {
            return this.result<string>("html", callback);
        }

        protected result<T>(dataType: string, callback?: (r: T) => void): void | Promise<T> {
            this.options.dataType = dataType;
            this.options.preHandler && this.options.preHandler(this.options);
            let settings = this.buildSettings();
            if (callback) {
                $.ajax(settings).done(callback).always(() => {
                    this.options.postHandler && this.options.postHandler(this.options);
                }).fail((xhr: JQueryXHR, textStatus: string, error: string) => {
                    this.options.errorHandler && this.options.errorHandler(xhr, textStatus, error);
                });
            } else {
                return new Promise<T>((resolve, _) => {
                    $.ajax(settings).done((r: T) => {
                        resolve(r);
                    }).always(() => {
                        AjaxRequest.postHandler && AjaxRequest.postHandler(this.options);
                    }).fail((xhr: JQueryXHR, textStatus: string, error: string) => {
                        AjaxRequest.errorHandler && AjaxRequest.errorHandler(xhr, textStatus, error);
                    });
                });
            }
        }

        protected buildSettings(): JQueryAjaxSettings {
            return {
                url: this.options.url,
                method: AjaxMethod[this.options.method],
                data: this.options.data,
                dataType: this.options.dataType,
                timeout: this.options.timeout,
                async: this.options.async,
            };
        }
    }

    /**
     * AJAX GET 请求
     */
    export class AjaxGetRequest extends AjaxRequest {
        /**
         * 获取 JSON 格式响应
         *
         * @template T 数据类型
         * @param {(r: T) => void} [callback] 回调函数
         */
        jsonp<T>(callback?: (r: T) => void): void | Promise<T> {
            return this.result<T>("jsonp", callback);
        }
    }

    /**
     * AJAX POST 请求
     */
    export class AjaxPostRequest extends AjaxRequest {
        /**
         * 设置请求数据编码方式
         *
         * @param encoder
         * @returns {Mtime.Net.AjaxPostRequest}
         */
        encoder(encoder: "none" | "form" | "json"): this {
            this.options.encoder = encoder;
            return this;
        }

        protected buildSettings(): JQueryAjaxSettings {
            let settings = super.buildSettings();
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
        }
    }

    /**
     * AJAX 请求入口类
     */
    export class Ajax {
        private constructor() {
        }

        /**
         * 发起 GET 请求
         *
         * @static
         * @param {string} url 请求地址
         * @param {Object} [args] 请求数据
         * @returns {Ajax} 当前 Ajax 对象
         */
        static get(url: string, args?: Object): AjaxGetRequest {
            return new AjaxGetRequest(url, AjaxMethod.GET, args);
        }

        /**
         * 发起 POST 请求
         *
         * @static
         * @param {string} url 请求地址
         * @param {(string | Object)} [data] 请求数据
         * @returns {Ajax} 当前 Ajax 对象
         */
        static post(url: string, data?: string | Object): AjaxPostRequest {
            return new AjaxPostRequest(url, AjaxMethod.POST, data);
        }
    }

    /**
     * AJAX 请求静态方法接口(仅用于实现 $ajax 快捷对象)
     */
    export interface AjaxStatic {
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
window.$ajax = Mtime.Net.Ajax;
declare var $ajax: Mtime.Net.AjaxStatic;
