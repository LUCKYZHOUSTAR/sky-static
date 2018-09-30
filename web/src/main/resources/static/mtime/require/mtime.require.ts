namespace Mtime.Net {

    const ROOT: string = $("script").last().attr("src").replace(/^(((http:|https:|ftp:)?\/\/)?[^\/]*)?\/.*/ig, "$1");

    /**
     * 资源模块对象
     */
    export interface Module {
        /**
         * 模块文件根目录
         */
        root?: string,
        /**
         * 模块文件地址, 只能是css和js文件
         */
        files: Array<string> | string,
        /**
         * 依赖模块名称 / 依赖文件地址
         */
        dependencies?: Array<Module|string> | Module | string
    }


    class Modules {
        private static modules: {[key:string]: Module} = {};

        /**
         * 注册资源模块
         * @param name
         * @param module
         * @returns {Mtime.Net.Modules}
         */
        public static register(name: string, module: Module|string|Array<string>): typeof Modules {
            let m: Module = Modules.toModule(module);
            if(Modules.modules[name]) {
                throw `module exists: ${name}`;
            }
            Modules.modules[name] = m;
            return Modules;
        }

        /**
         * 获取已注册资源模块
         * @param name
         * @returns {any}
         */
        public static getModule(name: string): Module {
            let module: Module = Modules.modules[name];
            if(!module) {
                throw `module not found: ${name}`;
            }
            return $.extend(true, {}, module);
        }

        /**
         * 字符串转换成资源模块对象
         * @param module
         * @returns {any}
         */
        public static toModule(module: Module|string|Array<string>): Module {
            let m: Module;
            if(typeof module === "string") {
                if(m = Modules.modules[module]) {
                    return m;
                } else if(/(.*\.(js|css))(\?.*)?(#.*)?$/ig.test(module)) {
                    return {
                        files: [<string> module]
                    };
                } else {
                    throw `module not found: ${module}`;
                }
            } else if($.isArray(module)) {
                return {
                    files: <Array<string>> module
                }
            } else if($.isPlainObject(module)) {
                m = <Module> module;
                m.files = m.files && !$.isArray(m.files) ? [<string> m.files] : m.files;
                m.dependencies = m.dependencies && !$.isArray(m.dependencies) ? [<Module|string> m.dependencies] : m.dependencies;
                return m;
            }
        }
    }


    export class ModulesLoader {

        /**
         * require JS
         * @param modules
         * @param success 加载成功后的回调函数
         */
        public static require(modules: Array<Module|string>|Module|string, success?: () => void): void {
            let ms: Array<Module> = [], m,
                callback = () => { if(success) success(); };
            modules = modules && !$.isArray(modules) ? [<Module|string> modules] : modules;
            $.each(modules || [], (i, module) => {
                if(m = Modules.toModule(module)) ms.push(m);
            });
            if(!ms.length) {
                callback();
            } else {
                ModulesLoader.createPromises(ms).then(callback);
            }
        }

        /**
         * 批量加载资源模块
         * @param modules
         * @returns {JQueryPromise<T>}
         */
        private static createPromises(modules: Array<Module>): JQueryPromise<any> {
            let dtd = $.Deferred(),
                promises = [];
            if(!modules || !modules.length) {
                dtd.resolve();
            } else {
                $.each(modules, (i, module) => {
                    promises.push(ModulesLoader.createPromise(module));
                });
                $.when.apply($, promises).then(() => {
                    dtd.resolve();
                }).fail(() => {
                    dtd.reject();
                });
            }
            return dtd.promise();
        }

        /**
         * 加载单个资源模块
         * @param module
         * @returns {JQueryPromise<T>}
         */
        private static createPromise(module: Module): JQueryPromise<any> {
            let dtd = $.Deferred(),
                dependencies = [],
                promises = [];
            $.each(module.dependencies || [], (i, dependency) => {
                // convert string to Module Object
                dependencies.push(ModulesLoader.createPromise(Modules.toModule(dependency)));
            })
            $.when.apply($, dependencies).then(() => {
                $.each(module.files, (ii, url) => {
                    url = ModulesLoader.url(url, module.root);
                    if(/\.js(\?.*)?(#.*)?$/ig.test(url)) {
                        promises.push(ModulesLoader.createScriptPromise(url));
                    } else if(/\.css(\?.*)?(#.*)?$/ig.test(url)) {
                        promises.push(ModulesLoader.createStylePromise(url));
                    }
                })
                $.when.apply($, promises).then(() => {
                    dtd.resolve();
                }).fail(() => {
                    dtd.reject();
                })
            }).fail(() => {
                dtd.reject();
            });
            return dtd.promise();
        }

        /**
         * 加载script节点
         * @param url
         * @returns {JQueryPromise<T>}
         */
        private static createScriptPromise(url: string): JQueryPromise<any> {
            let dtd = $.Deferred(),
                script;
            if(ModulesLoader.hasScriptElement(url)) {
                dtd.resolve();
            } else {
                script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                script.onload = () => { dtd.resolve(); };
                script.onerror = () => { dtd.reject(); };
                (document.head || document.body).appendChild(script);
            }
            return dtd.promise();
        }

        /**
         * 加载link节点
         * @param url
         * @returns {JQueryPromise<T>}
         */
        private static createStylePromise(url: string): JQueryPromise<any> {
            let dtd = $.Deferred(),
                style;
            if(ModulesLoader.hasStyleElement(url)) {
                dtd.resolve();
            } else {
                style = document.createElement("link");
                style.type = "text/css";
                style.rel = "stylesheet";
                style.href = url;
                style.onload = () => { dtd.resolve(); };
                style.onerror = () => { dtd.reject(); };
                (document.head || document.body).appendChild(style);
            }
            return dtd.promise();
        }

        /**
         * url是否有协议头
         * @param url
         * @returns {boolean}
         */
        private static hasProtocol(url: string): boolean {
            return /^(http:|https:|ftp:)?\/\//ig.test(url);
        }

        /**
         * JS脚本是否已经引入
         * @param url
         * @returns {boolean}
         */
        private static hasScriptElement(url: string): boolean {
            return !!$("script[src]").filter((i, script) => {
                let type = script.getAttribute("type"),
                    src = script.getAttribute("src");
                return (!type || /^(text\/)?javascript$/ig.test(type)) && src.indexOf(url) == 0;
            })[0];
        }

        /**
         * 样式表是否已经引入
         * @param url
         * @returns {boolean}
         */
        private static hasStyleElement(url: string): boolean {
            return !!$("link[rel=stylesheet][type][href]").filter((i, style) => {
                let type = style.getAttribute("type"),
                    href = style.getAttribute("href");
                return /^text\/css$/ig.test(type) && href.indexOf(url) == 0;
            })[0];
        }

        /**
         * 删除url中的参数信息
         * @param url
         * @param root
         * @returns {string}
         */
        private static url(url: string, root?: string): string {
            url = ModulesLoader.hasProtocol(url) ? url : (root || "") + url;
            return url.replace(/[\?\#].*/, "");
        }
    }

    /**
     * 注册已有资源模块
     */
    Modules.register("DatetimePicker", {
        root: `${ROOT}/lib/datetimepicker`,
        files: [
            "/css/bootstrap-datetimepicker.css",
            "/js/bootstrap-datetimepicker.js",
            "/js/bootstrap-datetimepicker.zh-CN.js"
        ]
    });
    Modules.register("DatetimePicker2", {
        root: `${ROOT}/lib/datetimepicker2`,
        files: [
            "/css/bootstrap-datetimepicker.css",
            "/js/bootstrap-datetimepicker.js",
            "/js/locales/bootstrap-datetimepicker.zh-CN.js"
        ]
    });
    Modules.register("FileInput", {
        root: `${ROOT}/lib/fileinput`,
        files: [
            "/css/fileinput.min.css",
            "/js/fileinput.js"
        ]
    });
    Modules.register("JQueryUI", {
        root: `${ROOT}/lib/jquery.ui`,
        files: [
            "/css/jquery-ui.min.css",
            "/js/jquery-ui.min.js"
        ]
    });
    Modules.register("MultiSelect", {
        root: `${ROOT}/lib/jquery.ui/multiselect`,
        files: [
            "/css/jquery.multiselect.css",
            "/css/jquery.multiselect.filter.css",
            "/js/jquery.multiselect.js",
            "/js/jquery.multiselect.filter.js",
            "/i18n/jquery.multiselect.zh-cn.js",
            "/i18n/jquery.multiselect.filter.zh-cn.js"
        ],
        dependencies: [
            "JQueryUI"
        ]
    });
    Modules.register("JSON", {
        root: `${ROOT}/lib/json`,
        files: [
            "/jquery-json.js"
        ]
    });
    Modules.register("LobiBox", {
        root: `${ROOT}/lib/lobibox`,
        files: [
            "/css/lobibox.css",
            "/js/lobibox.js"
        ]
    });
    Modules.register("Lodash", {
        root: `${ROOT}/lib/lodash`,
        files: [
            "/lodash.js"
        ]
    });
    Modules.register("Moment", {
        root: `${ROOT}/lib/moment`,
        files: [
            "/moment-with-locales.js"
        ]
    });
    Modules.register("Select", {
        root: `${ROOT}/lib/select`,
        files: [
            "/css/bootstrap-select.css",
            "/js/bootstrap-select.js",
            "/js/i18n/defaults-zh_CN.min.js"
        ]
    });
    Modules.register("Select2", {
        root: `${ROOT}/lib/select2`,
        files: [
            "/css/select2.css",
            "/js/select2.js"
        ]
    });
    Modules.register("JQValidate", {
        root: `${ROOT}/lib/select2`,
        files: [
            "/jquery.validate.js",
            "/localization/messages_zh.js"
        ]
    });

    /**
     * Mtime
     */
    Modules.register("Mtime.AutoCompleter", {
        root: `${ROOT}/mtime/autocompleter`,
        files: [
            "/css/mtime.autocompleter.css",
            "/js/mtime.autocomplete.js"
        ]
    });
    Modules.register("Mtime.DataGrid", {
        root: `${ROOT}/mtime/datagrid`,
        files: [
            "/css/datagrid.css",
            "/js/datagrid.js"
        ]
    });
    Modules.register("Mtime.DatePicker", {
        root: `${ROOT}/mtime/datepicker`,
        files: [
            "/datepicker.js"
        ],
        dependencies: [
            "DatetimePicker"
        ]
    });
    Modules.register("Mtime.MultiSelectable", {
        root: `${ROOT}/mtime/multiselectable`,
        files: [
            "/multiselectable.ext.js"
        ],
        dependencies: [
            "MultiSelect"
        ]
    });
    Modules.register("Mtime.Slectable", {
        root: `${ROOT}/mtime/selectable`,
        files: [
            "/selectable.js"
        ],
        dependencies: [
            "Select2"
        ]
    });

}