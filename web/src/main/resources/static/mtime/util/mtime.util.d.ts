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
