/*!
 * Mtime Utility Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
namespace Mtime.Util {
    /**
     * Dispatcher
     */
    export class Dispatcher {
        private attr: string;

        private events: { [index: string]: (e: JQueryEventObject) => any } = {};

        constructor(attr?: string) {
            this.attr = attr || "action";
        }

        /**
         * 创建一个 Dispatcher 并绑定事件到页面元素上
         *
         * @param elem
         * @param event
         * @returns {Dispatcher}
         */
        static bind(elem: string | JQuery | Element | Document, event: string = "click"): Dispatcher {
            return new Dispatcher().bind(elem, event);
        }

        /**
         * 注册动作事件
         *
         * @param action
         * @param handler
         * @returns {Mtime.Util.Dispatcher}
         */
        on(action: string, handler: (e: JQueryEventObject) => any): Dispatcher {
            this.events[action] = handler;
            return this;
        }

        /**
         * 移除动作事件
         *
         * @param action
         * @returns {Mtime.Util.Dispatcher}
         */
        off(action: string): Dispatcher {
            delete this.events[action];
            return this;
        }

        /**
         * 绑定事件到页面元素上
         *
         * @param elem
         * @param event
         * @returns {Mtime.Util.Dispatcher}
         */
        bind(elem: string | JQuery | Element | Document, event: string = "click"): Dispatcher {
            $(elem).on(event, this.handle.bind(this));
            return this;
        }

        private handle(e: JQueryEventObject): any {
            let action = $(e.target).data(this.attr);
            if (action) {
                let handler = this.events[action];
                if (handler) {
                    e.stopPropagation();
                    handler(e);
                }
            }
        }
    }

    /**
     * Float 浮点数操作
     */
    export class Float {
        /**
         * 加
         *
         * @param numbers
         * @returns {number}
         */
        static add(...numbers: number[]): number {
            let total = 0;
            let maxTimes = Float.getMaxTimes(...numbers);
            let pow = Math.pow(10, maxTimes);
            for (let n of numbers) {
                total += n * pow;
            }
            return total / pow;
        }

        /**
         * 减
         *
         * @param n1
         * @param n2
         * @returns {number}
         */
        static subtract(n1: number, n2: number): number {
            let result: number;
            let i1 = Float.toInteger(n1);
            let i2 = Float.toInteger(n2);
            if (i1.times === i2.times) {
                // 两个小数位数相同
                result = i1.value - i2.value;
            } else if (i1.times > i2.times) {
                result = i1.value - i2.value * (i1.times / i2.times);
            } else {
                result = i1.value * (i2.times / i1.times) - i2.value;
            }
            return result / Math.max(i1.times, i2.times);
        }

        /**
         * 乘
         *
         * @param numbers
         * @returns {number}
         */
        static multiply(...numbers: number[]): number {
            let totalValue = 1;
            let totalTimes = 1;
            for (let n of numbers) {
                let i = Float.toInteger(n);
                totalValue *= i.value;
                totalTimes *= i.times;
            }
            return totalValue / totalTimes;
        }

        /**
         * 除
         *
         * @param n1
         * @param n2
         * @returns {number}
         */
        static divide(n1: number, n2: number): number {
            let i1 = Float.toInteger(n1);
            let i2 = Float.toInteger(n2);
            return (i1.value / i2.value) * (i2.times / i1.times);
        }

        /**
         * 四舍五入
         *
         * @param num
         * @param precision
         * @returns {string}
         */
        static toFixed(num: number, precision: number = 0): string {
            let times = Math.pow(10, precision);
            return Math.floor(num * times + 0.5) / times + '';
        }

        private static getMaxTimes(...numbers: number[]): number {
            let times = 1;
            for (let n of numbers) {
                let str = n + '';
                let index = str.indexOf('.');
                times = Math.max(times, str.length - index - 1);
            }
            return times;
        }

        private static toInteger(n: number): { value: number, times: number } {
            let r: { value: number, times: number } = { value: 0, times: 1 };
            let str = n + '';
            let index = str.indexOf('.');
            if (index > -1) {
                let len = str.substr(index + 1).length;
                r.times = Math.pow(10, len);
                r.value = n * r.times;
            } else {
                r.value = n;
            }
            return r;
        }
    }

    /**
     * 简单的 Url 处理类
     */
    export class Url {
        private path: string;
        private query: Object;

        constructor(uri: string) {
            let index = uri.indexOf("?");
            if (index == -1) {
                this.path = uri;
            } else {
                this.path = uri.substr(0, index);
                this.query = {}

                let search = uri.substr(index + 1).split('&');
                search.forEach(p => {
                    let pairs = p.replace(/%20|\+/g, ' ').split('=');
                    if (pairs[1]) {
                        this.query[decodeURIComponent(pairs[0])] = decodeURIComponent(pairs[1]);
                    }
                });
            }
        }

        getPath(): string {
            return this.path;
        }

        getParam(key: string): string {
            if (this.query) {
                return this.query[key];
            }
            return null;
        }

        setParam(key: string, value: string): this {
            if (!this.query) {
                this.query = {}
            }
            this.query[key] = value;
            return this;
        }

        removeParam(key: string): this {
            if (this.query) {
                delete this.query[key];
            }
            return this;
        }

        toString(): string {
            if (this.query) {
                let s = this.path;
                let i = 0;
                for (var key in this.query) {
                    if (this.query.hasOwnProperty(key)) {
                        let value = this.query[key];
                        s += i == 0 ? "?" : "&";
                        s += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                        i++;
                    }
                }
                return s;
            }
            return this.path;
        }
    }
}
