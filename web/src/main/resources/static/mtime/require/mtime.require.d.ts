declare namespace Mtime.Net {
    /**
     * 资源模块对象
     */
    interface Module {
        /**
         * 模块文件根目录
         */
        root?: string;
        /**
         * 模块文件地址, 只能是css和js文件
         */
        files: Array<string> | string;
        /**
         * 依赖模块名称 / 依赖文件地址
         */
        dependencies?: Array<Module | string> | Module | string;
    }
    class ModulesLoader {
        /**
         * require JS
         * @param modules
         * @param success 加载成功后的回调函数
         */
        static require(modules: Array<Module | string> | Module | string, success?: () => void): void;
        /**
         * 批量加载资源模块
         * @param modules
         * @returns {JQueryPromise<T>}
         */
        private static createPromises(modules);
        /**
         * 加载单个资源模块
         * @param module
         * @returns {JQueryPromise<T>}
         */
        private static createPromise(module);
        /**
         * 加载script节点
         * @param url
         * @returns {JQueryPromise<T>}
         */
        private static createScriptPromise(url);
        /**
         * 加载link节点
         * @param url
         * @returns {JQueryPromise<T>}
         */
        private static createStylePromise(url);
        /**
         * url是否有协议头
         * @param url
         * @returns {boolean}
         */
        private static hasProtocol(url);
        /**
         * JS脚本是否已经引入
         * @param url
         * @returns {boolean}
         */
        private static hasScriptElement(url);
        /**
         * 样式表是否已经引入
         * @param url
         * @returns {boolean}
         */
        private static hasStyleElement(url);
        /**
         * 删除url中的参数信息
         * @param url
         * @param root
         * @returns {string}
         */
        private static url(url, root?);
    }
}
