/**
 * Created by Sunw on 2016/10/19.
 */
(function(w, d, $, u) {

    var plugin = {
        name: "selectable",
        version: "0.0.1-SNAPSHOT"
    }

    if(!$.fn.select2) throw "[" + plugin.name + "] jQuery.fn.select2 not found!"

    if($.fn[plugin.name]) {
        if(w.console && w.console.log) {
            w.console.log(plugin.name + " jQuery plugin exists!")
        }
        return false;
    }

    /**
     * jQuery select
     */
    $.fn[plugin.name] = function(options) {
        var element = $(this), result = [], selectable, args = arguments
        element.each(function() {
            if(typeof options === "string" && options.charAt(0) != "_" && Selectable.prototype[options]) {
                selectable =  $(this).data("mtime." + plugin.name)
                if(!selectable) {
                    throw "[" + plugin.name + "] plugin is not initialized!"
                }
                var res = Selectable.prototype[options].apply(selectable, Array.prototype.slice.call(args, 1))
                if(res !== $(this)) {
                    result.push(res)
                    return false;
                }
            } else if(!options || $.isPlainObject(options)) {
                $(this).data("mtime." + plugin.name, new Selectable($(this), options))
            } else {
                throw "[" + plugin.name + "] method '" + options + "' not exists in jQuery." + plugin.name
            }
        })
        if(result.length) {
            return result[0]
        } else {
            return element
        }
    }

    /**
     *
     * @type {}
     */
    var global = $[plugin.name] = {
        defaults: {
            source: u
            , mode: "list"  // list列表模式, group分组模式, TODO tree树形模式
            , language: "en"
            , maxSelectionLength: false
            , minInputLength: false
            , maxInputLength: false
            , minSearchResult: false
            , selected: undefined
            , auto: false

            /** ajax start **/
            // 查询参数配置
            , params: false 	//请求所需的动态静态参数，string|function，如果是string类型表示jQuery选择器,且必须是带有name属性的表单控件; 如果是function,须返回一个json对象
            , term: "term"		//参数名，默认为input的name属性，如果没有指定name属性，则默认为term
            // 分页配置
            , pageIndexKey: "pageIndex"      // 当前分页页数字段名, 默认pageIndex
            , pageSizeKey: "pageSize"       // 当前分页数据量字段名, 默认pageSize
            , pageItemsKey: "items"         // 分页数据字段名, 默认items
            , pageTotalCountKey: "totalCount"   // 分页数据量字段名, 默认totalCount
            , pageSize: 10              // 当前分页数据量, 默认10
            // 模板配置
            , tmplResult: "text"    // string, 选择面板中显示的数据, 可使用{name}占位符
            , tmplSelection: u  // string, 选中文本模板, 可使用{name}占位符, 默认与tmplResult相同
            , tmplValue: "id"       // string, value模板, 可使用{id}占位符
            /** ajax end **/

            // 级联配置
            , parent: ""        // string|jQuery, 父级下拉, 如果是string,则表示jQuery选择器
            , parentKey: "parentId"    // 父级下拉值对应的参数名称, 默认为parentId

            // group模式
            , childrenKey: "children" // group模式下, 子节点字段名
            , groupTmplResult: "text"   // group模式下, group名称, 支持{name}占位符
            , groupTmplValue: "id"      // group模式下, group值, 支持{id}占位符

            , module: ""	// TODO 模块名
            , highlight: true	//TODO 是否高亮

            , select2: {
                ajax: {
                    url: ""
                    , data: u
                    , type: "post"
                    , dataType: "json"
                    , delay: 250
                    , processResults: u
                    , cache: true	//是否缓存
                }
                , tags: false        // 标签, true用户可以自定义输入内容, false用户只能通过选择来输入内容
                , allowClear: true  // 是否显示清除按钮
                , tokenSeparators: [',', ' ']   // 分词按键
                , maximumSelectionLength: Infinity
                , maximumInputLength: 10
                , minimumInputLength: 1     // 最小输入字符, <0表示可以空字符查询并且自动加载远程数据, 0表示可以空字符查询单不自动加载远程数据, >0表示达到指定字符长度后执行查询或加载数据
                , minimumResultsForSearch: 10   // 显示搜索框的最小结果数
                , escapeMarkup: function (markup) { return markup; } // let our custom formatter work
                , templateResult: u // omitted for brevity, see the source of this page
                , templateSelection: u // omitted for brevity, see the source of this page
            }
        },
        events: {
            //change: "change"    // is fired whenever an option is selected or removed.
            open: "select2:open"    // is fired whenever the dropdown is opened. select2:opening is fired before this and can be prevented.
            , close: "select2:close"    // is fired whenever the dropdown is closed. select2:closing is fired before this and can be prevented.
            , select: "select2:select"  // is fired whenever a result is selected. select2:selecting is fired before this and can be prevented.
            , unselect: "select2:unselect"  // is fired whenever a result is unselected. select2:unselecting is fired before this and can be prevented.
        }
    }
    var defaults = global.defaults
    var events = global.events

    var Selectable = function(element, options) {
        this.element = element
        this.__multiple = this.element.is("[multiple]")
        this.__sourceType = "none"
        this.__initCompleted = []
        // 自定义配置
        this.options = $.extend(true, {}, defaults, options, this.element.data())
        if(this.options.parent && $(this.options.parent)[0]) {
            this.$parent = $(this.options.parent)
        }
        this._init();
        var that = this;
        this.__S2Init = function(opts) {
            var groupValueMap = {}, optionValueMap = {}, key, val;
            element.find("optgroup").each(function() {
                key = $(this).attr("label");
                val = $(this).data("data");
                if(key && val) {
                    groupValueMap[key] = val;
                }
            })
            element.find("option").each(function() {
                key = $(this).attr("value");
                val = $(this).data("data");
                if(key && val) {
                    optionValueMap[key] = val;
                }
            })
            if(element.data("select2")) {
                element.select2("destroy")
            }
            element.select2($.extend(true, {}, that.options, opts))

            if(that.options.__clearValue) {
                element.val("");
                try{
                    var selection = element.data("select2").selection;
                    selection.update(selection, []);
                }catch (e) {}
                that.options.__clearValue = false;
            }

            element.find("optgroup").each(function() {
                key = $(this).attr("label");
                val = groupValueMap[key];
                if(key && val) {
                    $(this).data("data", val);
                }
            })
            element.find("option").each(function() {
                key = $(this).attr("value");
                val = optionValueMap[key];
                if(key && val) {
                    $(this).data("data", val);
                }
            })
        }
        if(this.__isAjax) {
            if(this.options.auto !== true) {
                this.__S2Init(this.options.select2)
            } else {
                this.__load(function(data, opts) {
                    that.__S2Init(opts || that.options.select2)
                })
            }
        } else {
            this.__S2Init(this.options.select2)
        }
    }

    Selectable.prototype = {
        bind: function(event, handler) {
            if(event in events) {
                return this.element.on(events[event], handler)
            } else {
                return this.element.on(event, handler)
            }
        },

        /**
         * 改变默认选中配置
         * @param selected
         * @returns {*}
         */
        changeDefaultSelected: function(selected) {
            if(/^(number)$/ig.test(typeof(selected))) selected = String(selected);
            if(selected == undefined) {
                return this.options.selected
            }
            if($.isArray(selected)) {
                this.options.selected = selected;
            } else {
                this.options.selected = [selected]
            }
            if(selected != undefined) {
                this.data(selected);
            }
            return this;
        },

        /**
         * 获取/设置选中值
         * @param newVal
         * @returns {*}
         */
        data: function(newVal) {
            var that = this;
            var options = this.options
            if(/^(number)$/ig.test(typeof(newVal))) newVal = String(newVal);
            if(newVal == u || typeof newVal === "boolean") {
                return this._get(newVal === true)
            } else {
                var adapter = function(obj) {
                    if($.isPlainObject(obj)) {
                        return Holder.replaceAttr(options.tmplValue, obj)
                    } else {
                        return String(obj);
                    }
                }
                this.addInitCompleted(function() {
                    if($.isArray(newVal)) {
                        options.selected = newVal;
                        that._set($.map(newVal, function(item) {
                            return adapter(item)
                        }));
                    } else {
                        options.selected = [newVal]
                        that._set(adapter(newVal))
                    }
                })
            }
            return this.element;
        },
        addInitCompleted: function(func) {
            if($.isFunction(func)) {
                if(this.__initing) {
                    this.__initCompleted.push(func)
                } else {
                    func.call(this)
                }
            }
        },
        __fireInitCompleted: function() {
            while(this.__initCompleted.length > 0) {
                this.__initCompleted.shift().call(this)
            }
        },
        _get: function(isObj) {
            var selected = [],
                data
            this.element.find(":selected").each(function() {
                data = $(this).data("data")
                if(!$.isPlainObject(data)) return true
                selected.push(isObj ? data.__data : data.id)
            })
            if(this.__multiple) {
                return selected
            } else {
                return selected[0]
            }
        },
        _set: function(val) {
            var vals = $.isArray(val) ? val : [val];
            var values = [];
            var element = this.element;
            $.each(vals, function(i, item) {
                if(item != null && element.find("option[value='" + item + "']")[0]) {
                    values.push(item);
                }
            });
            if(!this.__multiple) {
                val = values[0];
            }
            element.val(val);
            if(!this.__initing) {
                element.triggerHandler("change");
            }
        },

        clear: function() {
            this.element.val("");
            var selection = this.element.data("select2").selection;
            selection.update(selection, []);
            return this;
        },

        load: function(force) {
            var that = this;
            if(this.options.auto === true && this.__isAjax) {
                this.__load(function(data, opts) {
                    that.__S2Init(opts || that.options.select2)
                }, force)
            }
            return this.element;
        },
        __load: function(callback, force) {
            var that = this,
                options = this.options,
                oldSelected,
                newSelected,
                select2 = options.select2,
                select2Options
            // 加载数据之前的选中项
            oldSelected = this.__getSelectedValue(this.element.find(":selected")).join(",");
            if(force) {
                this.element.find("[auto-create]").remove();
            }
            if(this.$parent && !this.__getParentValue()) {
                select2Options = $.extend(true, {}, select2)
                delete select2Options.ajax
                if(!that.__multiple && options.placeholder && (!options.selected || options.selected.length == 0)) {
                    options.__clearValue = true;
                } else {
                    select2Options.allowClear = false
                    options.select2.allowClear = false
                }
                that.__S2Init(select2Options)
                return that.element
            }
            select2Options = $.extend(true, {}, select2)
            if(select2Options.ajax) {
                select2Options.ajax.success = function(data) {
                    if($.isFunction(select2.ajax.success)) select2.ajax.success.call(this, data)
                    var res = that._responseHandler(data),
                        array
                    if($.isArray(data)) {
                        if(!that.$parent) {
                            // 列表查询, 只查询一次
                            //that.__isAjax = false
                            //that.__sourceType = "none"
                            //delete select2.ajax
                            //delete select2.minimumInputLength
                        }
                        delete select2Options.ajax
                        delete select2Options.minimumInputLength
                        array = res
                    } else {
                        // 分页查询
                        array = res[options.pageItemsKey]
                    }
                    // 创建选项
                    $.each(array, function(i, item) {
                        that.element.append(that.__createItem(item, options.mode))
                    })
                    if(!that.__multiple && options.placeholder && (!options.selected || options.selected.length == 0)) {
                        options.__clearValue = true;
                    } else {
                        select2Options.allowClear = false
                        options.select2.allowClear = false
                    }
                    if($.isFunction(callback)) callback.call(this, data, select2Options);
                    that.__fireInitCompleted();
                    delete that.__initing;
                    newSelected = that.__getSelectedValue(that.element.find(":selected")).join(",")
                    if(oldSelected != newSelected) {
                        that.element.triggerHandler("change")
                    }
                }
                if($.isFunction(select2.ajax.url)) {
                    select2Options.ajax.url = select2.ajax.url("")
                }
                if($.isFunction(select2.ajax.data)) {
                    select2Options.ajax.data = select2.ajax.data({})
                }
                this.__initing = true;  // 正在初始化标识
                $.ajax(select2Options.ajax)
            } else if(this.__sourceType == "array") {
                // 创建选项
                var array = that._responseHandler(options.source);
                $.each(array, function(i, item) {
                    that.element.append(that.__createItem(item, options.mode))
                })
                if(!that.__multiple && options.placeholder && (!options.selected || options.selected.length == 0)) {
                    options.__clearValue = true;
                } else {
                    select2Options.allowClear = false
                    options.select2.allowClear = false
                }
                delete select2Options.data;
                delete select2Options.minimumInputLength;
                if($.isFunction(callback)) callback.call(this, options.source, select2Options)
            }
            return that.element
        },

        _init: function() {
            // 参数配置适配
            this.__sourceTypeAdapter()
            this.__commonAdapter()
            this.__ajaxSourceAdapter()
            this.__noneSourceAdapter()
            this.__parent()
        },

        __sourceTypeAdapter: function() {
            var that = this;
            var options = this.options
            if(typeof options.source === "string") {
                this.__sourceType = "ajax"
                this.__isAjax = true
            } else if($.isFunction(options.source)) {
                this.__sourceType = "function"
                this.__isAjax = true
            } else if($.isArray(options.source)) {
                this.__sourceType = "array"
                var array = this._responseHandler(options.source);
                $.each(array, function(i, item) {
                    that.element.append(that.__createItem(item, options.mode))
                })
                if(!that.__multiple && options.placeholder && (!options.selected || options.selected.length == 0)) {
                    options.__clearValue = true;
                } else {
                    options.select2.allowClear = false
                }
                delete this.options.select2.data;
                this.options.select2.minimumInputLength = 0;
            } else {
                this.__sourceType = "none"
            }
        },
        __commonAdapter: function() {
            var options = this.options
            //
            if(!options.tmplSelection) {
                options.tmplSelection = options.tmplResult
            }
            // placeholder
            options.placeholder = this.element.attr("placeholder") || ""
            options.select2.language = options.language || options.select2.language
            if(typeof options.maxSelectionLength === "number") {
                options.select2.maximumSelectionLength = options.maxSelectionLength
            }
            if(typeof options.minInputLength === "number") {
                options.select2.minimumInputLength = options.minInputLength
            }
            if(typeof options.minSearchResult === "number") {
                options.select2.minimumResultsForSearch = options.minSearchResult
            }
            if(typeof options.maxInputLength === "number") {
                options.select2.maximumInputLength = options.maxInputLength
            }
            if(options.selected != undefined) {
                if(!$.isArray(options.selected)) {
                    options.selected = [options.selected + ""]
                } else {
                    options.selected = $.map(options.selected, function(item) {return String(item)})
                }
            }
            //if(!this.__multiple) options.select2.allowClear = false
        },
        __ajaxSourceAdapter: function() {
            var that = this,
                options = this.options
            if(this.__isAjax !== true) {
                delete options.select2.ajax
            } else {
                var optionData = options.select2.ajax.data
                $.extend(true, options, {
                    select2: {
                        ajax: {
                            url: function(params) {
                                if($.isFunction(options.source)) {
                                    return options.source.call(that.element, params)
                                } else {
                                    return options.source.replace(new RegExp("\{" + options.term + "\}", "g"), params);
                                }
                            },
                            data: function(params) {
                                var query = {}
                                query[options.term] = params.term  // 查询关键词
                                query[options.pageIndexKey] = params.page  // 分页参数
                                query[options.pageSizeKey] = options.pageSize
                                $.extend(true, query, Holder.toJson(optionData))
                                return $.extend(true,
                                    that._getOtherParams(),     // 其他动态静态参数
                                    that._getParentValueObject(),     // 父级下拉值
                                    query)
                            },
                            dataType: options.dataType,
                            delay: options.delay,
                            cache: options.cache,
                            processResults: function(data, params) {
                                data = that._responseHandler(data);
                                if($.isArray(data)) {
                                    // 显示列表
                                    return {
                                        results: data
                                    }
                                } else {
                                    // 显示分页
                                    params[options.pageIndexKey] = params.page || 1;
                                    return {
                                        results: data[options.pageItemsKey],
                                        pagination: {
                                            more: (params[options.pageIndexKey] * options.pageSize) < data[options.pageTotalCountKey]
                                        }
                                    };
                                }
                            }
                        }
                    }
                })
            }
        },
        __noneSourceAdapter: function() {
            var options = this.options;
            if(this.__sourceType !== "none") return;
            delete options.select2.ajax;
            if(options.select2.minimumInputLength > 0) options.select2.minimumInputLength = 0
        },

        __parent: function() {
            var that = this
            if(this.$parent) {
                this.options.auto = true;
                this.$parent.on("change", function() {
                    that.load(true);
                })
            }
        },

        _getOtherParams: function() {
            var params = this.options.params,
                p = {}, name
            if(!params) {
                return p
            } else if($.isFunction(params)) {
                p = params.call(this.element, this.options)
                if(!$.isPlainObject(p)) {
                    throw "[" + plugin.name + "] the options 'params' should return json if function type!"
                }
                return p;
            } else if(typeof params === "string" && $(params)[0] && $(params).is("[name]")) {
                name = $(params).attr("name")
                p[name] = (function(element) {
                    if(element.is(":checkbox")) {
                        return Holder.getCheckboxVal(name)
                    } else if(element.is(":radio")) {
                        return Holder.getRadioVal(name)
                    } else if(element.is(":text,input[type=hidden],select,textarea,:password,:file")) {
                        return element.val()
                    } else {
                        throw "[" + plugin.name + "] the options 'params' should be form control!"
                    }
                })($(params))
                return p
            } else {
                throw "[" + plugin.name + "] the options 'params' type does not be supported!"
            }
        },
        _getParentValueObject: function() {
            var parentValue = {},
                v = this.__getParentValue()
            if(v) {
                parentValue[this.options.parentKey] = v
            }
            return parentValue;
        },
        __getParentValue: function() {
            if(this.$parent) {
                return this.__getSelectedValue(this.$parent.find(":selected")).join(",")
            }
        },
        __getSelectedValue: function($selectedOptions) {
            var results = []
            $selectedOptions.each(function() {
                results.push($(this).attr("value"))
            })
            return results;
        },

        _responseHandler: function(data) {
            if($.isArray(data)) {
                return this.__listResponseHandler(data, this.options.mode);
            } else {
                return this.__pageResponseHandler(data, this.options.mode)
            }
        },
        __listResponseHandler: function(array, mode) {
            var that = this,
                options = this.options,
                array = array || [],
                result = []
            $.each(array, function(i, item) {
                if(mode == "list") {
                    var _id = Holder.replaceAttr(options.tmplValue, item);
                    result.push({
                        id: _id,
                        text: Holder.replaceAttr(options.tmplResult, item),
                        selected: $.inArray(_id + "", options.selected) >= 0,
                        disabled: item.disabled === true,
                        __data: item
                    })
                } else if(mode == "group") {
                    result.push({
                        id: Holder.replaceAttr(options.groupTmplValue, item),
                        text: Holder.replaceAttr(options.groupTmplResult, item),
                        disabled: item.disabled === true,
                        children: that.__listResponseHandler(item[options.childrenKey], "list"),
                        __data: item
                    })
                }
            })
            return result
        },
        __pageResponseHandler: function(page) {
            var options = this.options
            page[options.pageItemsKey] = this.__listResponseHandler(page[options.pageItemsKey], this.options.mode)
            return page;
        },

        //_highlighter: function (item) {
        //    var query = this.term.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        //    return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        //        return '<strong>' + match + '</strong>'
        //    })
        //},

        __createItem: function(item, mode) {
            var createOption = function(data) {
                return $("<option auto-create='true' " + (data.selected ? "selected='selected'" : "") + " value='" + data.id + "' " + (data.disabled ? "disabled=\"disabled\"" : "") + ">" + data.text + "</option>").data("data", data)
            }
            if(mode == "list") {
                return createOption(item)
            } else if(mode == "group") {
                var optgroup = $("<optgroup auto-create='true'>")
                    .attr("label", item.text)
                    .data("data", item)
                $.each(item.children, function(i, child) {
                    optgroup.append(createOption(child))
                })
                return optgroup;
            }
        }

    }



    var Holder = {
        toJson: function(params) {
            if($.isFunction(params)) {
                return Holder.toJson(params())
            } else if($.isPlainObject(params)) {
                return params
            } else if(typeof params === "string") {
                var results = {}
                $.each(params.split("&"), function(i, item) {
                    var kv = item.split("=")
                    results[kv[0]] = kv[1] || u
                })
                return results
            }
            return {}
        },
        getRadioVal: function(name) {
            return $(":radio[name=" + name + "]:checked").attr("value")
        },
        getCheckboxVal: function(name) {
            var checked = this._getCheckboxVal(name);
            return checked.join(",")
        },
        _getCheckboxVal: function(name) {
            var result = []
            $(":checkbox[name=" + name + "]:checked").each(function() {
                result.push($(this).attr("value"))
            })
            return result;
        },
        replaceAttr: function(str, data) {
            var regex = /\{[$_a-zA-Z][$_a-zA-Z0-9]*\}/g,
                getRegex = function(name) {
                    return new RegExp("\{" + name + "\}", "g")
                },
                getValue = function(value) {
                    return value == u ? "" : value
                }
            if(regex.test(str)) {
                if($.isPlainObject(data) || $.isArray(data)) {
                    for(var i in data) {
                        if(typeof i == "string" || typeof i == "number")
                            str = str.replace(getRegex(i), getValue(data[i]))
                    }
                    return str.replace(regex, "")
                } else {
                    throw "[" + plugin.name + "] parameter is not correct: " + str
                }
            }
            return getValue(data[str])
        }
    }

    /**
     * 自动执行
     */
    $(function() {
        $("select[role=" + plugin.name + "]")[plugin.name]();
    })

})(window, document, jQuery)