/**
 * Created by Sunw on 2016/11/9.
 */
(function($, m) {

    var MultiSelect = function(element, options) {
        this.element = element;
        this.options = options;
        this._initStatus = 0;    // 初始化状态, 0未初始化, 1正在初始化, 2初始化完成, 3初始化异常
        this._initHandlers = [];
        this._msinit = false;
        this._init();
    }
    MultiSelect.prototype = {
        load: function(data) {
            var that = this,
                options = this.options,
                params = {}, req, url;
            if($.isArray(options.source)) {
                this.element.empty();
                $.each(options.source, function(i, item) {
                    that._create(item);
                })
            } if($.isFunction(options.source) && typeof (url = options.source.call(this)) === "string") {
                options.url = url;
            } else if(typeof options.source === "string") {
                options.url = options.source
            }
            if(!this._isAjax) {
                return this;
            }

            // ajax
            this.element.empty();
            if(options.data && typeof options.data === "string") {
                $.each(options.data.split("&") || [], function(i, item) {
                    item = item.split("=");
                    params[item[0]] = item[1] || "";
                })
            } else if($.isPlainObject(options.data)) {
                $.extend(true, params, options.data)
            }
            if($.isFunction(options.request) && $.isPlainObject(req = options.request.call(that.element))) {
                $.extend(true, params, req)
            }
            if($.isPlainObject(data)) {
                $.extend(true, params, data);
            }
            if(options.parent) {
                params[options.parentField] = options.parent.val();
            }
            var data = $.toModelParams ? $.toModelParams(params) : params;
            $.ajax($.extend(true, {}, options, {data: data}))
            return this;
        },

        value: function(value, isObj) {
            var that = this;
            if(typeof value == "boolean") {
                isObj = value, value = null;
            }
            if(value != null) {
                this.addInitHandler(function() {
                    that.element.val(value);
                    that.element.multiselect("refresh")
                })
                return this;
            } else if(!isObj) {
                return that.element.val() || (that.options.multiple ? [] : "");
            } else {
                var selected = [], data
                that.element.find(":selected").each(function() {
                    if(data = $(this).data("data")) selected.push(data)
                })
                return that.options.multiple ? selected : selected[0];
            }
        },


        _init: function() {
            var that = this;
            var options = this.options;
            var success = this.options.success,
                beforeSend = this.options.beforeSend,
                error = this.options.error;
            // multiple
            if(this.options.multiple !== false) {
                this.element.attr("multiple", "multiple")
            } else {
                this.element.removeAttr("multiple")
            }
            // parent
            if(options.parent && (options.parent = $(options.parent)).is("select")) {
                options.auto = false;
                options.parent.bind("multiselectcheckall multiselectuncheckall multiselectclick", function() {
                    var checked = $.map(options.parent.multiselect("getChecked"), function(opt) {
                        return $(opt).val()
                    })
                    $(this).val(checked);
                    that.load()
                })
            } else {
                options.parent = false;
            }
            // source
            this._isAjax = typeof options.source === "string" || $.isFunction(options.source)
            if(!this._isAjax) {
                this._initStatus = 2;
            }
            // ajax
            $.extend(true, this.options, {
                beforeSend: function() {
                    // status
                    that._initStatus = 1;
                    if($.isFunction(beforeSend)) {
                        if(beforeSend.apply(that.element, arguments) === false) {
                            that._initStatus = 2;
                            that.__initUI();
                            return false;
                        }
                    }
                },
                success: function(res) {
                    if(res && typeof res === "string") {
                        res = (new Function("return " + res))()
                    }
                    if($.isArray(res)) {
                        $.each(res, function(i, item) {
                            that._create(item)
                        })
                    }
                    // 回调
                    that._initStatus = 2;
                    that._fireInitHandler();
                    that.__initUI();
                    if($.isFunction(success)) {
                        success.call(that.element, res)
                    }
                },
                error: function() {
                    that._initStatus = 3;
                    if($.isFunction(error)) {
                        error.apply(this.element, arguments);
                    }
                }
            })
            // default value
            if(options.value) {
                if(options.multiple) {
                    options.value = $.isArray(options.value) ? options.value : (new Function("return " + options.value))()
                }
                this.value(options.value);
            }
            //
            if(this.element.closest(".modal")[0]) {
                this.element.closest(".modal").scroll(function() {
                    that.element.multiselect("position");// 滚动时重新计算位置
                })
            }
            // multiselect init
            this.__initUI();
            // auto load
            if(options.auto) {
                this.load();
            }
        },
        addInitHandler: function(func) {
            if($.isFunction(func)) {
                if(this._initStatus == 2) {
                    func.call(this);
                } else {
                    this._initHandlers.push(func);
                }
            }
            return this;
        },
        _fireInitHandler: function() {
            while(this._initHandlers.length > 0) {
                this._initHandlers.shift().call(this)
            }
        },
        _create: function(item) {
            var options = this.options;
            if(options.groupField && options.childrenField) {
                // 分组模式
                this._createOptgroup(item, this.element);
            } else {
                // 列表模式
                this._createOption(item, this.element);
            }
        },
        _createOption: function(item, wrapper) {
            var options = this.options;
            $("<option>")
                .data("data", item)
                .attr("value", item[options.valueField] || "")
                .text(item[options.displayField] || "")
                .appendTo(wrapper);
        },
        _createOptgroup: function(item, wrapper) {
            var that = this;
            var options = this.options;
            var optgroup = $("<optgroup>")
                .attr("label", item[options.groupField] || "");
            $.each(item[options.childrenField] || [], function(i, obj) {
                that._createOption(obj, optgroup);
            })
            optgroup.appendTo(wrapper);
        },
        __initUI: function() {
            if($.fn.multiselect) {
                if(!this._msinit) {
                    this.element.multiselect(this.options)
                    if(this.options.filter && $.fn.multiselectfilter) {
                        this.element.multiselectfilter({
                            label: '过滤:',
                            placeholder: '请输入关键字'
                        });
                    }
                    this._msinit = true;
                } else {
                    this.element.multiselect("refresh");
                }
            }
        }
    }


    $[m] = {
        defaults: {
            source: false,  // Array|string|function, 不配置时初始化静态数据, Array本地数据源, string|function服务器端数据源,function需要返回一个url
            auto: true,     // 是否自动加载服务器端数据
            type: "post",   // ajax请求方式
            dataType: "json",   // ajax响应类型
            valueField: "id",   // value字段名称
            displayField: "name",   // text字段名称
            filter: false,      // 是否带筛选功能,需要引入扩展jquery.multiselect.filter.min.js
            request: false,     // function, 请求时动态参数,需返回一个json

            value: false,       //默认值,支持多选

            groupField: "",     // group字段名
            childrenField: "",  // group模式中option节点数据所在字段名

            parent: false,      // string|jQuery, 级联配置中父级下拉
            parentField: "parentId", // string, 级联配置中关系字段参数名称

            selectedList: 5
        }
    }

    $.fn[m] = function(options) {
        var result, ms, res, args = arguments
        $(this).each(function() {
            if(!$(this).is("select")) return ;
            ms = $(this).data(m)
            if(typeof options === "string" && options.charAt(0) != "_" && $.isFunction(MultiSelect.prototype[options])) {
                if(!ms) {
                    throw "[" + m + "] not initialized!"
                } else {
                    res = MultiSelect.prototype[options].apply(ms, Array.prototype.slice.call(args, 1))
                    if(!(res instanceof MultiSelect)) {
                        result = res;
                        return false;
                    }
                }
            } else if(!options || $.isPlainObject(options)) {
                if(!ms) {
                    ms = new MultiSelect($(this), $.extend(true, {}, $[m].defaults, options, $(this).data(), {
                        multiple: $(this).is("[multiple]")
                    }))
                    $(this).data(m, ms);
                }
            } else {
                throw "[" + m + "] method '" + options + "' not found!"
            }
        })
        return result === undefined ? $(this) : result;
    }

    $(function() {
        $("[role=" + m + "]")[m]();
    })

})(jQuery, "multiselectable")