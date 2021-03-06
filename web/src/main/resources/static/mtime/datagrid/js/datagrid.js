/**
 *
 * @param w window
 * @param d document
 * @param $ jQuery
 * @param dg this datagrid plugin name
 * @param u undefined
 * Created by Sunw on 16/5/21.
 */
(function(w, d, $, dg, u) {

    if($[dg]) return;

    var pre = "dg:"

    // 插件配置
    $[dg] = {
        defaults: {
            auto: true              // boolean，默认true。初始化完成后是否自动加载数据
            , source: ""            // string|Array，默认空字符串。数据源
            , searchForm: u         // string|jquery，默认undefined。关联查询条件区域。string：jquery选择器；
            , dynamic: u            // string|jquery|function|object，默认undefined。加载数据时动态查询条件。string：对象序列化字符串；function：返回这四种类型之一；object：json对象
            //TODO 主子表支持不太好
            , childFields: false   // boolean|string|array 是否关联字表，如果关联字表，请将此配置项值设置为关联字段名，多个关联字段名用英文逗号分隔","
            , timeout: 8000         // number，默认8000。加载数据的超时时间
            , type: "post"          // string，默认post。加载数据的方式
            , dataType: "json"      // string，默认json。服务器响应数据类型
            , primaryKey: "id"      // string，默认id。服务器响应数据对象主键名
            , indexKey: "pageIndex"     // string，默认pageIndex。分页对象“当前页”字段名
            , sizeKey: "pageSize"       // string，默认pageSize。分页对象“每页数据量”字段名
            , countKey: "totalCount"    // string，默认totalCount。分页对象“数据总量”字段名
            , listKey: "items"          // string，默认items。分页对象“数据”字段名
            , sortKey: "sort"           // string, 默认sort, 排序参数名称
            , multiSort: false          // boolean, 默认false, 是否支持多个字段排序
            , selectable: false         // boolean，默认false。true：单击表行是是否选中该行
            , textAlign: "center"       // string[left|l|center|c|right|r]，默认center。表格数据对齐方式，仅对数据表格有用。
            , html: false               // boolean，默认false。是否支持html数据。
            /**
             * false|object，默认{}。false：不需要分页；object：分页配置，详情见Pager.defaults
             * @link Pager.defaults
             */
            , pagerOpts: { }
            , operBtns: []  // object|Array<Object>，默认[]。操作列按钮
            , operBtnTmpl: "<a href='javascript:;'>{txt}</a>" // string，默认为<a>。操作按钮ui，通过属性data-oper-handler='{handler}'指定动作函数
            , createOperBtn: u   // 操作列按钮，function()，function手动创建按钮，参数：btn（json，按钮信息，如：{txt:查看,handler:"detail"}），tdOper（jQuery对象，要存放按钮的单元格），data（json，按钮表行数据）
            , operTxt: "操作"    // string，默认"操作"， 操作列表头文本
            , ui: {
                checkAll: '<label class="checkbox-inline">\
                            <input type="checkbox"> 全选\
                        </label>',
                checkbox: '<label class="datagrid-checkbox"><input type="checkbox" name="{name}"></label>',
                radio: '<label class="datagrid-radio"><input type="radio" name="{name}"></label>'
            }
            , sort: {
                asc: function(th) {
                    th.removeClass("sort-desc").addClass("sort sort-asc")
                },
                desc: function(th) {
                    th.removeClass("sort-asc").addClass("sort sort-desc")
                },
                both: function(th) {
                    th.removeClass("sort-asc sort-desc").addClass("sort")
                },
                none: function(th) {
                    th.removeClass("sort sort-asc sort-desc")
                }
            },


            picker: {
                canSel: false,  // 是否需要checkbox和radio
                show: function(modal) {
                    modal.modal()
                },
                close: function(modal) {
                    modal.modal("hide")
                },
                alert: function(msg) {
                    if(w.$alert) {
                        $alert("提示", msg)
                    } else {
                        alert(msg)
                    }
                },
                // 确认选中后触发
                select: u,
                ui: '<div aria-hidden="false" aria-labelledby="Modal Dialog" role="dialog" tabindex="-1" class="modal fade in" data-backdrop="static">' +
                '       <div class="modal-dialog modal-lg" role="datagrid-picker-dialog">' +
                '           <div class="modal-content">' +
                '               <div class="modal-header">' +
                '                   <button data-dismiss="modal" class="close" type="button">' +
                '                       <span aria-hidden="true">×</span>' +
                '                       <span class="sr-only">关闭</span>' +
                '                   </button>' +
                    //'                   <button class="max-modal" type="button" style="">' +
                    //'                       <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>' +
                    //'                       <span class="sr-only">全屏</span>' +
                    //'                   </button>' +
                '                   <h5 class="modal-title">请选择</h5>' +
                '               </div>' +
                '               <div class="modal-body" role="datagrid-picker-modal-body">' +
                '                   <div class="panel panel-default" role="datagrid-picker-table-container">' +
                '                       <div class="panel-heading" role="datagrid-picker-form-container"></div>' +
                '                   </div>' +
                '               </div>' +
                '               <div class="modal-footer">' +
                '                   <button class="btn btn-sm btn-primary" type="button" role="btn-ok">确定</button>' +
                '                   <button class="btn btn-sm btn-info" type="button" role="btn-select">选定</button>' +
                '                   <button class="btn btn-sm btn-default" type="button" role="btn-close">关闭</button>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '   </div>'
            }
        },
        events: {
            initialize: pre + "initialize"
            , destroy: pre + "destroy"
            , before: pre + "preload"
            , preReload: pre + "preReload"
            , success: pre + "success"
            , createTr: pre + "createTr"
            , createTd: pre + "createTd"
            , expanding: pre + "expanding"       // 展开子表
            , preShow: pre + "preShow"
            , shown: pre + "shown"
            , error: pre + "error"
            , complete: pre + "complete"
            , timeout: pre + "timeout"
        },
        dataKey: {
            columnType: "columnType"
            , html: "html"
            , extraData: "extraData"
            , fieldName: "fieldName"
            , fieldType: "fieldType"
            , sortType: "sortType"
            , sortValue: "sortValue"
            , dataObj: "dataObj"
            , tdClass: "tdClass"
            , textAlign: "textAlign"
            , checkAll: "checkAll"
            , operBtn: "operBtn"
            , operBtns: "operBtns"
            , operHandler: "operHandler"
        },
        dgPrefix: {
            operHandler: pre + "oper:"
            , fieldTdHandler: pre + "fieldTd:"
        }
    }

    var opts = $[dg],
        defaults = opts.defaults,
        dataKey = opts.dataKey,
        ui = defaults.ui,
        dgPrefix = opts.dgPrefix,
        events = opts.events,
        aligns = {
            "l": "text-left"
            , "left": "text-left"
            , "r": "text-right"
            , "right": "text-right"
            , "c": "text-center"
            , "center": "text-center"
        }

    // 绑定事件
    $.fn.dgBind = function(name, func) {
        return $(this).on("dg:" + name, func)
    }
    // 绑定操作列按钮事件
    $.fn.dgOper = function(name, func) {
        var table = $(this)
        if(!name || $.type(name) !== "string") $.error("the param [name] is undefined")
        return table.on(dgPrefix.operHandler + name, function(e, event, data, btn) {
            return func.call(table, event, data, btn)
        })
    }
    // 创建单元格处理函数
    $.fn.dgFieldTd = function(name, func) {
        var table = $(this)
        if(!name || $.type(name) !== "string") $.error("the param [name] is undefined")
        return table.on(dgPrefix.fieldTdHandler + name, function(e, fname, fvalue, extra, data) {
            if(name == fname) {
                return func.call(table, fvalue, extra, data)
            }
        })
    }

    // 插件方法
    $.fn[dg] = function(options) {
        var datagrid
        if($.type(options) === "string" && options.charAt(0) != "_" && $.isFunction(DataGrid.prototype[options])) {
            datagrid = $(this).first().data(dg)
            if(!datagrid) $.error("Plugin [" + dg + "] has not been initialized.")
            return datagrid[options].apply(datagrid, Array.prototype.slice.call(arguments, 1))
        } else if(!options || $.isPlainObject(options)) {
            return $(this).each(function() {
                if(!$(this).is("table")) return ;   //只能初始化table标签
                datagrid = $(this).data(dg)
                if(datagrid) datagrid.destroy()
                $(this).data(dg, new DataGrid( $(this), options ) )
            })
        } else {
            $.error("Parameter type [] is not supported in plugin [" +  dg + "]")
        }
    }

    // 表格对象
    var DataGrid = function(element, options) {
        this.element = element;
        this.options = $.extend(true, {}, defaults, options, this.element.data());
        this._init();
        if(this.options.auto !== false) this.load()
    }

    $.extend(true, DataGrid, {
        // 模板字符串
        tmpl: function(html, value) {
            for(var name in value) {
                html = html.replace(new RegExp("\\{" + name + "\\}", "g"), value[name])
            }
            return html
        },
        // 字符串转Json
        toJson: function(str) {
            if(str == u) return "";
            if($.trim(str) == "") return str;
            return new Function("return " + str)()
        },
        // guid
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        // 参数转换为json
        param: function(value) {
            var json = {},
                name,
                v
            if(!value) return json;
            if(value instanceof jQuery) {   // jQuery对象
                value.each(function() {
                    $(this).is("[name]") && (function() {
                        name = $(this).attr("name")
                        if($(this).is(":checkbox")) {
                            v = []
                            $(":checkbox[value][name=" + name + "]:checked").each(function() {
                                v.push($(this).attr("value"))
                            })
                            json[name] = v.join(",")
                        } else if($(this).is(":radio")) {
                            json[name] = $(":radio[value][name=" + name + "]:checked").attr("value") || ""
                        } else if(value.is("select,:text,input[type=hidden],textarea")) {
                            json[name] = value.val()
                        }
                    })()
                })
                return json;
            }
            if($.type(value) === "string" && value.indexOf("=") > 0) {   // string
                v = value.split("&")
                $.each(v, function(i, n) {
                    var tmp = n.split("=")
                    json[tmp[0]] = tmp[1]
                })
                return json;
            }
            if($.isFunction(value)) {   // function
                return DataGrid.param(value($))
            }
            return value;
        }
    })

    $.extend(true, DataGrid.prototype, {
        /**
         * 获取插件对象
         * @returns {true}
         */
        proto: function() {
            return this;
        },
        /**
         * 配置项的setter和getter方法
         * @param name
         * @param value
         * @returns {*}
         */
        options: function(name, value) {
            if(value == u) return this.options[name];
            this.options[name] = value;
            return this.element
        },
        /**
         * 加载数据
         * @param data
         * @returns {*|HTMLElement}
         */
        load: function(data) {
            var that = this,
                source = this.options.source,
                options = that.options,
                sortParameterArray = that.__getSortParameters(),
                pageParameter = that.getPageParameter()    // 分页参数
            if(this.pager) {
                this.pager.pageIndex = 1
            }
            if($.isArray(source)) {
                // TODO sort 不支持客户端排序
                // source.sort(function(a, b) {
                //     for(var i = 0, l = sortParameterArray.length; i < l; i++) {
                //         var cp = that.__compare(a[sortParameterArray[i]], b[sortParameterArray[i]])
                //         if(cp != 0) {
                //             return cp * (sortParameterArray[i].a ? 1 : -1);
                //         }
                //     }
                //     return -1;
                // })
                this.reload()
            } else if($.type(source) === "string") {
                this._query(this.options.source, data)
            } else if($.isFunction(source)) {
                data = $.extend({}
                    , data    // 即时参数
                    , DataGrid.param(options.dynamic)   // 配置的动态参数
                    , that.getSearchFormData()    // 查询表单参数
                    , pageParameter
                    , that.getSortParameters()
                )
                if(that._doBefore(null, data) !== false) {
                    source.call(that.element, data, function(res) {
                        that._clearTimeout()
                        that._doSuccess(res);
                    }, function() {
                        that._clearTimeout()
                        that._doError.apply(that, arguments)
                    });
                }
            }
            return this.element
        },
        /**
         * 刷新，会自动根据最后一次加载的请求URL和请求参数进行查询，如果这是第一次查询，则调用load方法
         */
        reload: function() {
            var that = this,
                source = this.options.source;
            if(this._trigger(events.preReload) === false) return this.element
            if($.isArray(source)) {
                if(this.pager) {
                    var start = this.pager.start(),
                        arr = source.slice(start, start + this.pager.pageSize)
                    this.tbody.empty()
                    this.showData(arr)
                    this.pager.set(this.pager.pageIndex, this.pager.pageSize, source.length)
                } else {
                    this.showData(source)
                }
            } else if($.type(source) === "string") {
                if(this._lastUrl == u) {
                    this.load()
                } else {
                    this._query(this._lastUrl, this._lastParam)
                }
            } else if($.isFunction(source)) {
                var data = $.extend({}
                    , DataGrid.param(that.options.dynamic)   // 配置的动态参数
                    , that.getPageParameter()
                    , that.getSortParameters()
                )
                if(that._doBefore(null, data) !== false) {
                    source.call(that.element, data, function(res) {
                        that._clearTimeout()
                        that._doSuccess(res);
                    }, function() {
                        that._clearTimeout()
                        that._doError.apply(that, arguments)
                    });
                }
            }
            return this.element
        },
        /**
         * 比较两个值先后顺序
         * @param a
         * @param b
         * @private
         */
        __compare: function(a, b) {
            if(a == u || typeof a == "number" && typeof b == "string") {
                return -1
            } else if(b == u || typeof a == "string" && typeof b == "number") {
                return 1
            } else {
                return a.toString().localeCompare(b.toString())
            }
        },
        /**
         * 选中/获取选中
         * @param thIndex number，可选，指定checkbox或radio列索引，默认u
         * @param allField boolean，可选，是否获取所有字段，默认false
         */
        getSelected: function(thIndex, allField) {
            if($.type(thIndex) === "boolean") {
                allField = thIndex, thIndex = u
            }
            var th = this.thead.find("th,td"),
                selectable
            if($.type(thIndex) === "number" && thIndex >= 0 && thIndex < th.length && th.eq(thIndex).is("[data-column-type=checkbox],[data-column-type=radio]")) {
                selectable = th.eq(thIndex)
            } else {
                selectable = this.thead.find("[data-column-type=checkbox],[data-column-type=radio]").first()
            }
            var index = selectable.index(),
                isCheckbox = selectable.is("[data-column-type=checkbox]"),
                selected = isCheckbox ? [] : u,
                dataId, data
            this.tbody.children("tr[data-id]").each(function() {
                dataId = $(this).data("id"),
                    data = $(this).data(dataKey.dataObj)
                if($(this).find("td").eq(index).find(":checkbox,:radio").prop("checked") === true) {
                    if(isCheckbox) {
                        selected.push( allField === true ? data : dataId )
                    } else {
                        selected = allField === true ? data : dataId
                        return false;
                    }
                }
            })
            return selected
        },
        /**
         * 获取表格所有数据
         * @param onlyPrimaryKey
         * @returns {Array}
         */
        getAllData: function(onlyPrimaryKey) {
            var data = [];
            this.tbody.children("tr[data-id]").each(function() {
                if(onlyPrimaryKey) {
                    data.push($(this).data("id"))
                } else {
                    data.push($(this).data(dataKey.dataObj))
                }
            })
            return data;
        },
        /**
         * 销毁插件
         * @returns {*|HTMLElement}
         */
        destroy: function() {
            var that = this
            if(that.xhr) that.xhr.abort();
            if(that.pager) that.pager.destroy()
            that.element
                .html($(this._html).html())
                .attr("class", $(this._html).attr("class"))
                .removeData(dg)
            that._trigger(events.destroy)
            return this.element
        },
        /**
         * 追加数据
         * @param data
         * @param single
         * @returns {*|HTMLElement}
         */
        appendData: function(data, single) {
            if($.isPlainObject(data)) {
                this.showData([data], single)
            } else if($.isArray(data)) {
                this.showData(data, single)
            }
            return this.element;
        },
        /**
         * 显示数据
         * @param list object|List<object>
         * @param single 是否根据主键去重
         * @param prepend 是否添加到第一行, 默认false
         * @returns {*|HTMLElement}
         */
        showData: function(data, single, prepend) {
            if($.isPlainObject(data)) {
                this._showPage(data, single, prepend)
            } else if($.isArray(data)) {
                this._showList(data, single, prepend)
            }
            return this.element
        },
        /**
         * 获取查询表单参数
         */
        getSearchFormData: function() {
            var formdata = {}
            if(!this.options.searchForm) return formdata;
            this.options.searchForm
                .find(":text,input[type=hidden],textarea,:password,:file,select,:checkbox:checked,:radio:checked")
                .each(function() {
                    if(!$(this).is("[name]:enabled")) return;
                    var name = $(this).attr("name")
                    if($(this).is(":checkbox")) {
                        formdata[name] = formdata[name] || ""
                        formdata[name] += (formdata[name] ? "," : "") + ($(this).attr("value")||"")
                    } else if($(this).is(":radio")) {
                        formdata[name] = $(this).attr("value") || ""
                    } else if($(this).is("select[multiple]")) {
                        var __selectedVal = $(this).val()
                        if($.isArray(__selectedVal)) {
                            formdata[name] = __selectedVal.join(",")
                        }
                    } else {
                        formdata[name] = $(this).val()
                    }
                })
            return formdata;
        },
        /**
         * 清空查询条件
         * @param clearHidden boolean，默认false，是否清空隐藏元素
         */
        clearSearchForm: function(clearHidden) {
            if(!this.options.searchForm) return this.element
            this.options.searchForm
                .find(":text,input[type=hidden],:password,:file,select,:checkbox:checked,:radio:checked")
                .each(function() {
                    if(!$(this).is("[name]")) return ;
                    if(!clearHidden && $(this).is(":hidden")) return;
                    if($(this).is(":checkbox,:radio")) {
                        $(this).prop("checked", false)
                    } else if($(this).is("select")) {
                        $(this).find(":selected").prop("selected", false)
                    } else {
                        $(this).val("")
                    }
                })
            return this.element
        },
        /**
         * 获取当前分页导航的分页参数值
         * @returns {{}}
         */
        getPageParameter: function() {
            var page = {}
            if(this.pager) {
                page[this.options.indexKey] = this.pager.pageIndex,
                    page[this.options.sizeKey] = this.pager.pageSize
            }
            return page;
        },
        /**
         * 清空datagrid
         * @param clearPager
         * @returns {*|HTMLElement}
         */
        clearData: function(clearPager) {
            this.tbody.empty()
            if(clearPager && this.pager) {
                this.pager.set(1, this.pager.pageSize, 0)
            }
            return this.element
        },
        /**
         * 初始化
         */
        _init: function() {
            var that = this
            that._html = that.element[0].outerHTML  // 原始UI
            // UI
            that.headTr = that.element.find("tr").first()
            if(!that.headTr[0]) $.error("Element [tr] is not found.")
            that.thead = that.element.find("thead") // thead
            if(!that.thead[0]) that.thead = that.headTr.unwrap().wrap("<thead>").parent("thead").prependTo(that.element)
            that.tbody = that.element.find("tbody") // tbody
            if(!that.tbody[0]) that.tbody = $("<tbody/>").insertAfter(that.thead)
            // thead th
            that.thead.find("tr").first().find("th,td").each(function() {
                that.__thColumnType($(this))
                that.__thSort($(this))
            })
            // pager
            if(that.options.pagerOpts !== false) {
                if($.type(that.options.pagerOpts) === "string") that.options.pagerOpts = DataGrid.toJson(that.options.pagerOpts)
                that.pager = new Pager(that.options.pagerOpts)
                    .create(that.element)
                    .bind(Pager.events.load, function() { that.reload() })
            }
            that.options.operBtns = that.options.operBtns || []
            that.options.operBtns = $.isPlainObject(that.options.operBtns) ? [that.options.operBtns] : that.options.operBtns;
            // child
            var childFields = that.options.childFields
            if($.isFunction(childFields)) childFields = childFields()
            else if($.type(childFields) === "string") childFields = childFields.split(/\s*(,|\|)\s*/)
            if($.isArray(childFields) && childFields.length > 0) {
                that.options.childFields = childFields
                $("<th/>").data(dataKey.columnType, "tree").prependTo(that.headTr)
            } else {
                that.options.childFields = []
            }
            // search form
            if(that.options.searchForm) that.options.searchForm = $(that.options.searchForm)
            // listen
            that._listen();
            // event
            that._trigger(events.initialize)
        },
        /**
         * 初始化列类型
         * @param th
         * @private
         */
        __thColumnType: function(th) {
            var that = this,
                columnType = th.addClass("text-center").data(dataKey.columnType)
            switch (columnType) {
                case "checkbox":    // 全选
                    var _checkAll = th.css({width: "60px"}).find(":checkbox")
                    if(!_checkAll[0]) {
                        _checkAll = $(ui.checkAll).appendTo(th)
                        _checkAll = th.find(":checkbox")
                    }
                    if(!_checkAll.data(dataKey.checkAll)) _checkAll.attr("data-check-all", DataGrid.guid())
                    that.options.selectable = true
                    break
                case "radio":   // 单选
                    if(!th.css({width: "60px"}).is("[name]")) th.attr("name", DataGrid.guid())
                    if(!$.trim(th.html())) th.html("#")
                    that.options.selectable = true
                    break
                case "index":   // 数据索引号
                    if(!$.trim(th.css({width: "60px"}).html())) th.html("#")
                    break
                case "row":     // 行号
                    if(!$.trim(th.css({width: "50px"}).html())) th.html("#")
                    break
                case "oper":    // 操作列
                    if(!$.trim(th.html())) th.html(that.options.operTxt)
                    break
                default:    // 字段
            }
        },
        /**
         * 排序初始化
         * @param th
         * @private
         */
        __thSort: function(th) {
            if(!this.__isSortable(th)) return;
            var sort = $.trim(th.attr("data-sort")).toLowerCase(),
                sorter = this.options.sort,
                sortValue
            // 默认未排序
            sorter.both(th)
            if(this.options.multiSort !== true && this.__first_sort_field) {
                th.data(dataKey.sortType, "both")
                return;
            }
            sort = sort.split(/\s+/);
            try {
                sortValue = parseInt(sort[1]) || 0
            } catch(e) {
                sortValue = 0
            }
            th.data(dataKey.sortType, sort[0])
                .data(dataKey.sortValue, sortValue)
            if(sort[0] == "asc" || sort[0] == "desc") {
                sorter[sort[0]](th)
                this.__first_sort_field = sort[0]
            }
        },
        __isSortable: function(th) {
            return th.is("[data-field-name][data-sort]")
        },
        /**
         * 事件监听
         * @private
         */
        _listen: function() {
            var that = this,
                checkboxHandler = function(e) {
                    e.stopPropagation()
                    var name = $(this).attr("name"),
                        tdIndex = $(this).closest("td").index(),
                        checkAll = true
                    that.tbody.children("tr[data-id]").each(function() {
                        var _checkbox = $(this).children("td").eq(tdIndex).find(":checkbox[name=" + name + "]")
                        if(!_checkbox.prop("checked")) return checkAll = false
                    })
                    that.headTr.children("th,td").eq(tdIndex).find(":checkbox[data-check-all="+name+"]").prop("checked", checkAll)
                }
            // 全选按钮
            that.headTr.on("click", "[data-check-all]", function(e) {
                e.stopPropagation();// 阻止冒泡
                var columnIndex = $(this).closest("th,td").index(),
                    checked = $(this).prop("checked")
                that.tbody.children("tr[data-id]").each(function() {
                    $(this).children("td").eq(columnIndex).find(":checkbox:enabled").prop("checked", checked)
                })
            }).on("click", "> [data-field-name][data-sort]", function(e) {
                var th = $(this),
                    sort = th.data(dataKey.sortType),
                    sorter = that.options.sort,
                    siblings
                if(sort == "desc") {
                    th.data(dataKey.sortType, "asc")
                    sorter.asc(th)
                } else {
                    th.data(dataKey.sortType, "desc")
                    sorter.desc(th)
                }
                if(that.options.multiSort !== true) {
                    siblings = th.siblings("[data-field-name][data-sort]")
                        .data(dataKey.sortType, "both")
                    sorter.both(siblings)
                }
                that.reload()
            })
            that.tbody.on("click", "> tr[data-id] :checkbox:enabled[name]", checkboxHandler)
            // 展开
            that.tbody.on("click", "> tr[data-id] > td > [data-btn-type=expand]", function() {
                var data = $(this).closest("tr").data(dataKey.dataObj)
                that._trigger(events.expanding, data)
            })
            // selectable
            if(that.options.selectable) {
                that.tbody
                    //.on("mouseover", "> tr[data-id] td:not(:has(:checkbox,:radio,[data-btn-type]))", function(e) {
                    //    e.stopPropagation(), $(this).css({cursor: "pointer"})
                    //})
                    .on("click", "> tr[data-id] td.selectable:not(.unselectable)", function(e) {
                        e.stopPropagation()
                        var _tr = $(this).closest("tr"),
                            _checkbox = _tr.find(":checkbox"),
                            _radio = _tr.find(":radio")
                        _checkbox.each(function() {
                            $(this).prop("checked", !$(this).prop("checked"))
                            checkboxHandler.call($(this), e)
                        })
                        _radio.each(function() {
                            $(this).prop("checked", true)
                        })
                    })
            }
            // 操作列按钮监听事件
            that.tbody.on("click", "> tr[data-id] [data-oper-handler]", function(e) {
                var handler = $(this).data(dataKey.operHandler),
                    tr = $(this).closest("tr"),
                    operBtn = $(this).data(dataKey.operBtn),
                    data = tr.data(dataKey.dataObj)
                that._trigger(dgPrefix.operHandler + handler, e, data, $(this))
                return false;   // 禁止冒泡传递
            })
            // searchform
            if(that.options.searchForm) {
                that.options.searchForm.on("click", "[for-datagrid]", function() {
                    var method = $(this).attr("for-datagrid")
                    if(/^load|reload|clearSearchForm$/g.test(method)) {
                        that[method]()
                    }
                })
            }
        },
        /**
         * 事件触发
         * @param e
         * @returns {*}
         * @private
         */
        _trigger: function(e) {
            var args = Array.prototype.slice.call(arguments, 1)
            return this.element.triggerHandler(e, args)
        },
        __toJson: function(param) {
            if(typeof param === "string") {
                var result = {},
                    arr = param.split("&"),
                    item
                for(var i = 0, l = arr.length; i < l; i++) {
                    item = arr[i].split("=")
                    result[item[0]] = item[1]
                }
                return result;
            }
            return param;
        },
        /**
         * ajax请求
         * @param url 请求路径
         * @param data 请求参数
         * @private
         */
        _query: function(url, data) {
            var that = this,
                options = that.options,
                pageParameter = that.getPageParameter(),    // 分页参数
                sortParameters = that.getSortParameters(), // 排序参数
                ajaxOpt
            data = $.extend({}
                , that.__toJson(data)    // 即时参数
                , DataGrid.param(options.dynamic)   // 配置的动态参数
                , that.getSearchFormData()    // 查询表单参数
            )
            if(that.xhr) that.xhr.abort();  // 先取消当前正在执行的ajax请求
            ajaxOpt = $.extend(true, {}
                , options   // options兼容所有ajax配置
                , {
                    url: url,   // 请求路径
                    data: $.extend({}, data, pageParameter, sortParameters),    // 分页参数优先级最高
                    beforeSend: function() {    // 请求前验证
                        return that._doBefore(url, data)
                    },
                    success: function(res) {
                        that._clearTimeout()   // 清除定时器
                        that._doSuccess(res);
                    },
                    error: function(xmlHttpRequest, textStatus, errorThrown) {
                        that._clearTimeout()   // 清除定时器
                        that._doError(xmlHttpRequest, textStatus, errorThrown);
                    },
                    complete: function() {
                        that.xhr = u    // 重置xhr
                        that._trigger(events.complete)  // 触发请求完成complete事件
                    }
                }
            )
            if(!ajaxOpt.type || /^get$/ig.test(ajaxOpt.type) || /^jsonp/ig.test(ajaxOpt.dataType)) {
                data = $.param(ajaxOpt.data)
                if(data) {
                    ajaxOpt.url = url + (url.indexOf("?") < 0 ? "?" : "&") + data;
                    ajaxOpt.data = "";
                }
            }
            that.xhr = $.ajax(ajaxOpt)
        },
        /**
         * 获取排序参数
         * @private
         */
        getSortParameters: function() {
            var arr = this.__getSortParameters(),
                params = []
            for(var i = 0, l = arr.length; i < l; i++) {
                params.push((arr[i].a ? "" : "-") + arr[i].n)
            }
            var result = {}
            if(params.length > 0) {
                result[this.options.sortKey] = params.join(",")
            }
            return result
        },
        /**
         *
         * @returns {Array}
         * @private
         */
        __getSortParameters: function() {
            var that = this,
                params = []
            that.thead.find("> tr > [data-field-name][data-sort]").each(function() {
                var th = $(this),
                    name = th.data("fieldName"),
                    sort = th.data(dataKey.sortType),
                    sortValue = th.data(dataKey.sortValue) || 0
                if(sort == "asc" || sort == "desc") {
                    params.push({
                        n: name,
                        a: sort == "asc",//是否是升序
                        v: sortValue
                    })
                }
            })
            params.sort(function(a, b) {
                return a.v - b.v;
            })
            return params;
        },
        /**
         *
         * @param url
         * @param data
         * @returns {boolean}
         * @private
         */
        _doBefore: function(url, data) {
            var that = this,
                options = that.options
            if(that._trigger(events.before) === false) return false;    // 如果before事件返回false，则阻止请求
            that.tbody.empty()  // 请求表格体
            that.headTr.find(":checkbox[data-check-all]").each(function() {$(this).prop("checked", false)})
            that.message("正在加载数据...")  // 显示动态消息
            that._lastUrl = url,    // 保存最后一次请求地址
                that._lastParam = data, // 最后一次请求参数
                that.tid = setTimeout(function() {  // 设置超时定时器
                    if(that.xhr) that.xhr.abort()
                    that.message("请求超时!", "red")
                    that._trigger(events.timeout)   // 触发timeout事件
                }, options.timeout)
        },
        /**
         *
         * @param res
         * @private
         */
        _doSuccess: function(res) {
            var that = this,
                options = that.options
            that.message()     // 隐藏动态消息提示
            if(that._trigger(events.success, res) !== false) {      // 触发success事件，如果返回false，表示手动显示数据结果
                res = $.type(res) === "string" ? $.parseJSON(res) : res;    // 支持string|json类型
                if($.isArray(res)) {    // 显示列表数据
                    if(res.length == 0) {
                        that.message("暂无数据")
                    } else {
                        that.showData(res)
                    }
                    if(that.pager) {
                        that.pager.hide()
                    }
                } else if($.isPlainObject(res)) {   // 显示分页数据
                    var _totalCount = res[options.countKey] || 0,
                        _list = res[options.listKey] || []
                    if(_totalCount <= 0 || _list.length == 0) {
                        that.message("暂无数据")
                        if(that.pager) {    // 分页设置
                            that.pager.show().set(that.pager.pageIndex, that.pager.pageSize, 0)
                        }
                    } else {
                        that.showData(res)
                    }
                }
                that._trigger(events.shown, res)    // 触发数据显示完成shown事件
            }
        },
        /**
         *
         * @private
         */
        _doError: function() {
            if(arguments && arguments.length == 3) {
                var status = arguments[0] && arguments[0].responseJSON && arguments[0].responseJSON.status;
                if(status == 403) {
                    location.reload(true);
                } else {
                    var a = $("<a>")
                        .html((status||"") + " 服务器发生错误！")
                        .css({ color: "red" })
                        .attr("href", "javascript:;")
                        .attr("mx-ajax-status", "error")
                        .data("error-args", Array.prototype.slice.call(arguments, 0, 3));
                    this.message(a, "red");
                    if(!isNaN(status)) {
                        a.click();
                    }
                }
            } else if(arguments && arguments.length == 1) {
                this.message("服务器发生错误:" + arguments[0], "red")
            } else {
                this.message("服务器发生错误!", "red")
            }
            this._trigger(events.error)     // 触发请求异常error事件
        },
        /**
         *
         * @private
         */
        _clearTimeout: function() {
            if(this.tid) clearTimeout(this.tid)
            this.tid = u   // 清除定时器
        },
        /**
         * 根据字段名显示字段文本信息
         * @param data json数据
         * @param fieldName 字段名
         * @param fieldType 字段类型：EnumName|EnumValue|Date|default，对于时间格式化依赖于moment.js
         * @returns {*}
         * @private
         */
        _getFieldDisplayValue: function(data, fieldName, fieldType) {
            fieldName = $.trim(fieldName),
                fieldType = $.trim(fieldType)
            if(!data || !fieldName || !(fieldName in data)) return ""
            var value = data[fieldName],
                getEnumTxt = function(v, EnumType, isName) {
                    if(!(EnumType in w)) return v;
                    if(isName == u) isName = $.type(v) === "string"
                    if(!!isName) {
                        return (w[EnumType][v] in w[EnumType]) ? w[EnumType][ w[EnumType][v] ] : v
                    } else {
                        return (v in w[EnumType]) ? w[EnumType][v] : v
                    }
                },
                numFormat = function(num, pos) {
                    return ("0000" + num).slice(pos * -1);
                },
                getDateTxt = function(v, format) {
                    if(!v) return "";
                    if($.isPlainObject(v)) {
                        var _v = numFormat(v.year, 4) + "-" + numFormat(v.monthValue, 2) + "-" + numFormat(v.dayOfMonth, 2)
                        if("hour" in v) {
                            _v += " " + numFormat(v.hour, 2) + ":" + numFormat(v.minute, 2) + ":" + numFormat(v.second, 2) + "." + numFormat(parseInt(v.nano / 1000000), 3)
                        }
                        v = _v
                    }
                    if(!w.moment) return v
                    if(!format) format = $.type(v) === "string" && v.length > 10 || $.type(v) === "number" ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"
                    return moment(v).format(format);
                }
            if(/^EnumName\[(\w[$_\w\d]*)\]$/.test(fieldType)) {    // 枚举名类型
                value = getEnumTxt(value, RegExp.$1, true)
            } else if(/^EnumValue\[(\w[$_\w\d]*)\]$/.test(fieldType)) {    // 枚举值类型
                value = getEnumTxt(value, RegExp.$1, false)
            } else if(/^Enum\[(\w[$_\w\d]*)\]$/.test(fieldType)) {
                value = getEnumTxt(value, RegExp.$1)
            } else if(/^Date(\[([\.\-\:YMDhmsS\s]+)\])?$/i.test(fieldType)) {   // 时间字符串类型
                value = getDateTxt(value, RegExp.$2)
            }
            return value == u ? "" : value
        },
        /**
         * 创建按钮单元格
         * @param td
         * @param data
         * @param operBtns
         * @private
         */
        _createOperBtns: function(td, data, operBtns) {
            var that = this,
                operBtns = $.isArray(operBtns) ? operBtns : [operBtns],
                _operBtnTmpl = that.options.operBtnTmpl,
                _createOperBtn = that.options.createOperBtn,
                btn
            $.each(operBtns, function(i, operBtn) {
                if($.isFunction(operBtn.condition) && operBtn.condition.call(data, td, operBtn) === false
                    || typeof operBtn.condition === "boolean" && operBtn.condition === false
                    || typeof operBtn.condition === "string" && (new Function("return " + operBtn.condition)).call(data) === false) {
                    return true;
                }
                if($.isFunction(_createOperBtn)) {
                    btn = _createOperBtn.call(that, td, data, operBtn)
                    if($.type(btn) === "string") {
                        btn = $(DataGrid.tmpl(btn, operBtn))
                    } else if(!(btn instanceof jQuery)) {
                        btn = u
                    }
                } else {
                    btn = $(DataGrid.tmpl(_operBtnTmpl, operBtn))
                }
                if(btn) {
                    if(!btn.is("[data-oper-handler]")) btn.attr("data-oper-handler", operBtn.handler)
                    td.append(btn.data(dataKey.operBtn, operBtn))
                        .append(" ")
                }
            })
            return td
        },
        /**
         * 显示列表数据
         * @param data
         * @param single
         * @private
         */
        _showList: function(data, single, prepend) {
            if(!$.isArray(data)) data = [];
            if(data.length > 0) {
                this.message();
            } else {
                return this.element;
            }
            var that = this,
                header = that.thead.find("tr").first().find("th,td"),
                tr, td, updatedTr

            var baseIndex = that.pager ? ((that.pager.pageIndex - 1) * that.pager.pageSize + 1) : 1;

            that.tbody.hide()
            if(that._trigger(events.preShow, data) === false) return that.element;  // 触发preShow事件
            $.each(data, function(index, item) {
                tr = $("<tr>")
                updatedTr = that.tbody.children("tr[data-id=" + item[that.options.primaryKey] + "]");
                if(!single || !updatedTr[0]) {
                    updatedTr = null;
                }
                // 根据主键去重
                if(that.options.primaryKey in item) {
                    //if(single && that.tbody.children("tr[data-id=" + item[that.options.primaryKey] + "]")[0]) return ;
                    tr.attr("data-id", item[that.options.primaryKey])
                } else {
                    tr.attr("data-id", "")
                }
                tr.data(dataKey.dataObj, item)
                header.each(function(i) {
                    var columnType, extra, fname, fvalue, _content,
                        _textAlign = $(this).data(dataKey.textAlign) || defaults.textAlign,
                        _html
                    extra = DataGrid.toJson( $(this).data( dataKey.extraData ) )
                    td = $("<td>")
                    if(that.options.selectable !== false && $(this).data("selectable") !== false) td.addClass("selectable")
                    switch (columnType = $(this).data(dataKey.columnType)) {
                        case "checkbox":    // 复选框
                            if(updatedTr) {
                                td = updatedTr.find("td").eq(i).clone(true);
                            } else {
                                fvalue = $( DataGrid.tmpl(ui.checkbox, {name: $(this).find(":checkbox").data(dataKey.checkAll)}) )
                                td.addClass("text-center").append( fvalue )
                            }
                            break
                        case "radio":   // 单选
                            if(updatedTr) {
                                td = updatedTr.find("td").eq(i).clone(true);
                            } else {
                                fvalue = $( DataGrid.tmpl(ui.radio, {name: $(this).attr("name")}) )
                                td.addClass("text-center").append( fvalue )
                            }
                            break
                        case "index":   // 数据索引号
                            if(updatedTr) {
                                td = updatedTr.find("td").eq(i).clone(true);
                            } else {

                                fvalue = baseIndex + that.tbody.find("tr[data-id]").length;
                                td.addClass("text-center").append( fvalue )
                            }
                            break
                        case "row":     // 行号
                            if(updatedTr) {
                                td = updatedTr.find("td").eq(i).clone(true);
                            } else {
                                fvalue = that.tbody.find("tr[data-id]").length + 1
                                td.addClass("text-center").append(fvalue)
                            }
                            break
                        case "tree":    // 主子表
                            if(updatedTr) {
                                td = updatedTr.find("td").eq(i).clone(true);
                            } else {
                                var childParams = {}
                                $.each(that.options.childFields, function (ii, pname) {
                                    childParams[pname] = pname in item ? item[pname] : ""
                                })
                                fvalue = $('<span style="cursor:pointer;" class="glyphicon glyphicon-plus" data-btn-type="expand"></span>')
                                td.addClass("text-center").append(fvalue)
                            }
                            break
                        case "oper":    // 操作列
                            fvalue = DataGrid.toJson($.trim($(this).data(dataKey.operBtns))) || that.options.operBtns || []
                            that._createOperBtns(td.addClass("text-center"), item, fvalue)
                            break
                        default:    // 字段
                            td.addClass(_textAlign in aligns ? aligns[_textAlign] : aligns["c"])
                            fname = $(this).data(dataKey.fieldName)
                            fvalue = item[fname] || ""
                            _content = that._trigger(dgPrefix.fieldTdHandler + fname, fname, fvalue, extra, item)       // 自定义创建数据表格函数
                            if($.type(_content) === "string") {
                                fvalue = DataGrid.tmpl(_content, item)
                                if($(this).data(dataKey.html) == u) $(this).data(dataKey.html, true)
                            } else if(_content instanceof jQuery) {
                                fvalue = _content
                            } else {
                                fvalue = that._getFieldDisplayValue(item, fname, $(this).data(dataKey.fieldType))
                            }
                            _html = ($(this).data(dataKey.html) === true) || defaults.html
                            if(fvalue instanceof jQuery) {
                                td.append(fvalue)
                            } else {
                                td[_html !== true ? "text" : "html"](fvalue)
                            }
                    }
                    td.attr("class", $(this).data(dataKey.tdClass)).appendTo( tr )
                    that._trigger(events.createTd, columnType, fname, item, td)
                })

                updatedTr = that.tbody.children("tr[data-id=" + item[that.options.primaryKey] + "]");
                if(single && updatedTr[0]) {
                    updatedTr.replaceWith(tr);
                } else {
                    that.tbody[prepend===true?"prepend":"append"](tr)
                }
                that._trigger(events.createTr, item, tr)
            });
            if(prepend === true) {
                that.tbody.find("> tr[data-id]").each(function(ri, tr) {
                    header.each(function(ci) {
                        switch ($(this).data(dataKey.columnType)) {
                            case "index":
                                $(tr).find(">td").eq(ci).text(baseIndex + ri);
                                break
                            case "row":
                                $(tr).find(">td").eq(ci).text(ri + 1);
                                break;
                        }
                    })
                })
            }
            that.tbody.fadeIn()
            return this.element
        },
        /**
         * 显示分页数据
         * @param data
         * @param single
         * @returns {*|HTMLElement}
         * @private
         */
        _showPage: function(data, single, prepend) {
            var that = this
            if(!$.isPlainObject(data)) return that.element
            that._showList(data[that.options.listKey], single, prepend)
            if(that.pager) {    // 分页设置
                that.pager.show().set(that.pager.pageIndex, that.pager.pageSize, data[that.options.countKey])
            }
            return that.element;
        },
        /**
         * 显示/隐藏消息
         * @param msg 消息体，支持html，为空时表示隐藏消息
         * @param color 字体颜色，rgb|css颜色单词
         * @private
         */
        message: function(msg, color) {
            var $message = this.tbody.find("[data-row-type=msg]")
            if(msg) {
                if(!$message[0]) $message = $("<tr data-row-type='msg'><td colspan='" + this.headTr.find("th,td").length + "' style='text-align: center;'><i></i></td></tr>").appendTo(this.tbody)
                $message.find("td").css("color", color || "#777")
                    .find("i").empty().append(msg)
            } else {
                $message.remove()
            }
        }
    })


    /**
     * 分页对象
     * @param options
     * @constructor
     */
    var Pager = function(options) {
        if($.isFunction(options)) { // appendTo函数
            options = {
                appendTo: options
            }
        } else if(!$.isPlainObject(options)) {
            $.error("Parameter type [] is not supported in Pager")
        }
        this.pageIndex = 1
        this.pageSize = 0
        this.totalCount = 0
        this.pageCount = 1
        this.options = $.extend(true, {}, Pager.defaults, options)
        this._init();
    }

    $.extend(true, Pager, {
        defaults: {
            pageIndex: 1        // int，默认1。默认页码
            , pageSize: 25      // int，默认25。默认每页数据量
            , sizeSelect: [25, 50, 100, 150]        // Array<int>，可选每页数据量。
            , appendTo: u   // ui绘制函数，默认实现见Pager.prototype._appendTo
            , enableBtn: function(btn) {
                btn.closest("li").removeClass("disabled")
            }
            , disableBtn: function(btn) {
                btn.closest("li").addClass("disabled")
            }
            , ui: '<div class="panel-footer" style="padding: 4px 6px;">\
                <ul class="pagination" style="line-height: 34px;">\
                    <li>共\
                        <ii pager-field="totalCount">3</ii>条\
                    </li>\
                    <li>每页\
                        <select pager-field="pageSize">\
                            <option>1</option>\
                        </select>条\
                    </li>\
                    <li>第\
                        <select pager-field="pageIndex">\
                            <option>1</option>\
                        </select>页\
                    </li>\
                </ul>\
                <ul class="pagination pull-right">\
                    <li>\
                        <a href="javascript:;" aria-label="First" title="首页" pager-btn="first">\
                            <span aria-hidden="true">&laquo;</span>\
                        </a>\
                    </li>\
                    <li>\
                        <a href="javascript:;" aria-label="Previous" title="上一页" pager-btn="prev">\
                            <span aria-hidden="true">&lsaquo;</span>\
                        </a>\
                    </li>\
                    <li>\
                        <a href="javascript:;" aria-label="Next" title="下一页" pager-btn="next">\
                            <span aria-hidden="true">&rsaquo;</span>\
                        </a>\
                    </li>\
                    <li>\
                        <a href="javascript:;" aria-label="Last" title="末页" pager-btn="last">\
                            <span aria-hidden="true">&raquo;</span>\
                        </a>\
                    </li>\
                </ul>\
                <div class="clearfix"></div>\
            </div>'
        },
        events: {
            load: "pager:load"
        },
        // 正整数校验
        checkInt: function(num, canEqZero) {
            if($.type(num) !== "number") return false;
            if(canEqZero === true) {
                return num >= 0
            } else {
                return num > 0
            }
        },
        /**
         * 计算总页数
         * @param pageSize
         * @param totalCount
         * @returns {number}
         */
        getPageCount: function(pageSize, totalCount) {
            var pageCount = Math.ceil(totalCount / pageSize)
            return pageCount > 0 ? pageCount : 1;
        }
    })

    $.extend(true, Pager.prototype, {
        /**
         * 计算当前分页第一条记录索引
         */
        start: function() {
            return (this.pageIndex - 1) * this.pageSize + 1
        },
        /**
         * 创建ui
         * @param table
         * @returns {true}
         */
        create: function(table) {
            this._appendTo(this.element, table)
            this._listen()
            return this;
        },
        /**
         * 隐藏分页
         * @param speed
         * @returns {true}
         */
        hide: function(speed) {
            this.element.hide(speed)
            return this
        },
        /**
         * 显示分页
         * @param speed
         * @returns {true}
         */
        show: function(speed) {
            this.element.show(speed)
            return this
        },
        /**
         * 销毁分页
         */
        destroy: function() {
            this.element.remove()
        },
        /**
         *
         * @param pageIndex 必须
         * @param pageSize 必须
         * @param totalCount 可选
         */
        set: function(pageIndex, pageSize, totalCount) {
            Pager.checkInt(pageIndex) && (this.pageIndex = pageIndex || 1)
            Pager.checkInt(pageSize) && (this.pageSize = pageSize)
            Pager.checkInt(totalCount, true) && (this.totalCount = totalCount)
            this.pageCount = Pager.getPageCount(this.pageSize, this.totalCount)
            this._show()
            return this;
        },
        /**
         * 绑定事件
         * @param e
         * @param func
         * @returns {true}
         */
        bind: function(e, func) {
            this.element.each(function() {
                $(this).on(e, func)
            })
            return this
        },
        /**
         * 触发事件
         * @param e
         * @returns {*}
         */
        trigger: function(e) {
            var args = Array.prototype.slice.call(arguments, 1)
            args.unshift(this)
            return this.element.first().triggerHandler(e, args)
        },
        /**
         * 事件监听
         * @private
         */
        _listen: function() {
            var that = this,
                e = Pager.events.load
            that.element.each(function() {
                var $pageIndex = $(this).find("[pager-field=pageIndex]");
                var turnTo = function(targetPageIndex) {
                    targetPageIndex = targetPageIndex || 1;
                    if(targetPageIndex > that.pageCount) {
                        $pageIndex.val(that.pageIndex)
                        $alert("页码不能大于" + that.pageCount)
                        return false;
                    } else {
                        that.pageIndex != targetPageIndex && (that.pageIndex = targetPageIndex, that.trigger(e))
                    }
                }
                if($pageIndex.is("select")) {
                    $(this).find("[pager-field=pageIndex]").change(function() {
                        turnTo(Number($pageIndex.val()))
                    })
                } else {
                    $pageIndex.keydown(function(event) {
                        var val = $pageIndex.val(),
                            keyCode = event.keyCode;
                        if(keyCode === 13 || keyCode == 108) {
                            // 回车
                            turnTo(Number($pageIndex.val()))
                            return false;
                        } else if(!$.trim(val) && (keyCode === 48 || keyCode === 96)) {
                            // 第一个数字不能为0
                            return false;
                        } else if(keyCode >= 48 && keyCode <= 57
                            || keyCode >= 96 && keyCode <= 105) {
                            // 数字键

                        } else if(/^(46|8|39|37)$/.test(String(keyCode))) {
                            // 功能键
                        } else {
                            return false;
                        }
                    }).change(function() {
                        var val = Number($pageIndex.val());
                        if(Pager.checkInt(val)) {
                            turnTo(val)
                        } else {
                            //todo
                        }
                    })
                }
                $(this).find("[pager-field=pageSize]").change(function() {
                    var targetPageSize = Number($(this).val())
                    that.pageSize != targetPageSize && (that.pageIndex = 1, that.pageSize = targetPageSize, that.trigger(e))
                })
                $(this).find("[pager-btn=first]").click(function() {
                    that.pageIndex != 1 && (that.pageIndex = 1, that.trigger(e))
                })
                $(this).find("[pager-btn=prev]").click(function() {
                    that.pageIndex > 1 && (that.pageIndex--, that.trigger(e))
                })
                $(this).find("[pager-btn=next]").click(function() {
                    that.pageIndex < that.pageCount && (that.pageIndex++, that.trigger(e))
                })
                $(this).find("[pager-btn=last]").click(function() {
                    that.pageIndex != that.pageCount && (that.pageIndex = that.pageCount, that.trigger(e))
                })
            })

        },
        /**
         * 初始化
         * @private
         */
        _init: function() {
            var that = this,
                options = that.options
            if($.isFunction(options.appendTo)) that._appendTo = options.appendTo    // 重写ui绘制方法
            // field
            that.pageIndex = Pager.checkInt(options.pageIndex) ? options.pageIndex : Pager.defaults.pageIndex
            that.pageSize = Pager.checkInt(options.pageSize) ? options.pageSize : Pager.defaults.pageSize
            that.totalCount = 0
            that.pageCount = 1
            if($.inArray(that.pageSize, that.options.sizeSelect = that.options.sizeSelect || []) < 0) {
                that.options.sizeSelect.push(that.pageSize)
            }
            that.options.sizeSelect.sort(function(a, b) {
                return a < b ? -1 : a == b ? 0 : 1;
            })
            // ui
            that.element = $(that.options.ui)
            //
            // 显示和事件
            that._show()
        },
        /**
         * 显示分页各个部件
         * @private
         */
        _show: function() {
            this._showPageIndex(),
                this._showTotalCount(),
                this._showPageSize(),
                this._showPageCount()
        },
        // 显示pageIndex
        /**
         * 显示当前页部件
         * @private
         */
        _showPageIndex: function() {
            var that = this
            that.element.each(function() {
                var element = $(this),
                    i = 0,
                    method,
                    $pageIndex = element.find("[pager-field=pageIndex]"),
                    $first = element.find("[pager-btn=first]"),
                    $prev = element.find("[pager-btn=prev]"),
                    $last = element.find("[pager-btn=last]"),
                    $next = element.find("[pager-btn=next]")
                if($pageIndex.is("select")) {
                    $pageIndex.empty()
                    while(i++ < that.pageCount) {
                        $pageIndex.append("<option value='" + i + "'>" + i + "</option>")
                    }
                }
                $pageIndex.val(that.pageIndex)
                // preve first
                method = that.pageIndex <= 1 ? "disableBtn" : "enableBtn"
                that.options[method]($first)
                that.options[method]($prev)
                method = that.pageIndex >= that.pageCount ? "disableBtn" : "enableBtn"
                that.options[method]($next)
                that.options[method]($last)
            })
        },
        // 显示pageSize
        _showPageSize: function() {
            var that = this
            that.element.each(function() {
                var element = $(this),
                    $pageSize = element.find("[pager-field=pageSize]")
                that.options.sizeSelect && ($pageSize.empty(), $.each(that.options.sizeSelect, function(i, v) {
                    $pageSize.append("<option value='" + v + "'>" + v + "</option>")
                }), that.options.sizeSelect = false)
                $pageSize.val(that.pageSize)
            })
        },
        // 显示totalCount
        _showTotalCount: function() {
            var that = this
            this.element.each(function() {
                $(this).find("[pager-field=totalCount]").text(that.totalCount)
            })
        },
        // 显示总页数
        _showPageCount: function() {
            var that = this
            this.element.each(function() {
                $(this).find("[pager-field=pageCount]").text(that.pageCount)
            })
        },
        /**
         * ui绘制函数，可重写
         * @param element 分页ui
         * @param table 表格ui
         * @private
         */
        _appendTo: function(element, table) {
            element.insertAfter(table)
        }
    })


    /**
     * DataGridPicker
     * @type {string}
     */
    var picker = dg + "Picker",
        DataGridPicker = function(element, options) {
            this.element = element.data("auto", false)
            this.options = options = $.extend(true, {}, defaults, options, element.data())
            //
            this._cloneTable = element.clone(true) // 备份原table UI
            this._cloneSearchForm = options.searchForm ? $(options.searchForm).clone(true) : u
            //
            this.searchForm = options.searchForm ? $(options.searchForm) : u,
            this.pickerModal = $(this.options.picker.ui)
            this._init()
        }

    $.extend(true, DataGridPicker.prototype, {
        /**
         * 打开table picker模态框
         * @returns {*|HTMLElement}
         */
        open: function() {
            if(this.options.pickerWidth) {
                this.pickerModal.find("[role=datagrid-picker-dialog]").css("width", this.options.pickerWidth);
            }
            this.pickerModal.find("[role=datagrid-picker-modal-body]").css({"height": $(w).height() / 3 * 2 + "px"})
            this.options.picker.show(this.pickerModal)
            this.pickerTable.datagrid("reload")
            return this.element;
        },
        /**
         * 关闭table picker模态框
         * @returns {*|HTMLElement}
         */
        close: function() {
            this.options.picker.close(modal)
            return this.element;
        },
        /**
         * 销毁插件
         * @returns {*}
         */
        destroy: function() {
            this.element
                .removeData("source")
                .data("source", this._cloneTable.data("source"))
                .removeData("pagerOpts")
                .data("pagerOpts", this._cloneTable.data("pagerOpts"))
                .removeData("selectable")
                .data("selectable", this._cloneTable.data("selectable"))
                .empty()
                .append(this._cloneTable.children())
            if(this.searchForm) this.searchForm.replaceWith(this._cloneSearchForm)
            this.pickerModal.remove()
            return this.element.removeData(picker);
        },
        /**
         * 获取选定的数据
         * @param allField
         * @returns {Array}
         */
        get: function(allField) {
            var selected = []
            this.element.find("tbody > tr[data-id]").each(function() {
                selected.push(allField ? $(this).data(dataKey.dataObj) : $(this).data("id"))
            })
            return selected;
        },
        /**
         * picker插件初始化
         * @returns {*|HTMLElement}
         * @private
         */
        _init: function() {
            if(this.searchForm) this.searchForm.hide()  // 隐藏form表单
            this.pickerTable = this.element.clone(true)
            var formId = DataGrid.guid()
            this.pickerSearchForm = this.searchForm && this.searchForm.clone(true).attr("id", formId)   // 复制查询条件区域
            this.pickerTable.find("[data-column-type=oper]").remove()   // 移除操作列
            this.pickerModal.find("[role=datagrid-picker-table-container]").append(this.pickerTable)  // 复制pickerTable
            // 拖拽
            if($.fn.dragmodal) this.pickerModal.dragmodal();
            if(this.pickerSearchForm) {
                this.pickerModal
                    .find("[role=datagrid-picker-form-container]")
                    .append( this.pickerSearchForm.removeClass("hidden").show() )
                this.pickerTable.data("searchForm", "#" + formId)   // 绑定查询条件区域
            }
            this.pickerModal.appendTo($("body"))
            this.pickerModal.find("[role=datagrid-picker-modal-body]").css({"overflow-y": "auto"})
            this._listen();
            this.pickerTable.datagrid(this.options)
            if(this.options.picker.canSel !== true) {
                this.element
                    .data("selectable", false)
                    .find("[data-column-type=checkbox],[data-column-type=radio]").remove()
            }
            this.element
                .data("source", [])
                .data("pagerOpts", false)
                .datagrid(this.options)
            return this.element;
        },
        /**
         * picker插件事件监听
         * @private
         */
        _listen: function() {
            var that = this
            this.pickerModal
                .on("click", "[role=btn-ok],[role=btn-select]", function() {
                    var close = $(this).is("[role=btn-ok]")
                    var selected = that.pickerTable.datagrid("getSelected", true)   // 获取选中项
                    if(!selected || selected.length == 0) {
                        that.options.picker.alert("请至少选中一条数据")
                    } else {
                        that.element.datagrid("showData", selected, true)
                        // 选中事件
                        if($.isFunction(that.options.picker.select)) {
                            that.options.picker.select.call(that.pickerTable, selected)
                        }
                        if(close) that.options.picker.close(that.pickerModal)    // 关闭
                    }
                })
                .on("click", "[role=btn-close]", function() {
                    that.options.picker.close(that.pickerModal)
                })
                //.on("click", ".max-modal", function() { // 最大化按钮
                //    var dialog = that.pickerModal.find(".modal-dialog"),
                //        initWidth = dialog.data("initWidth"),
                //        speed = 800
                //    if(!dialog.data("animating")) {
                //        if(initWidth) {
                //            dialog.data("animating", true).animate({"width": initWidth + "px"}, speed, function() {
                //                $(this).removeData("animating").removeData("initWidth")
                //            })
                //        } else {
                //            dialog.data("initWidth", dialog.width()).data("animating", true).animate({"width":"100%"}, speed, function() {
                //                $(this).removeData("animating")
                //            })
                //        }
                //    }
                //})
        }
    })

    // 数据表格选择器
    $.fn[picker] = function(options) {
        var datagridPicker
        if($.type(options) === "string" && options.charAt(0) != "_" && $.isFunction(DataGridPicker.prototype[options])) {
            datagridPicker = $(this).first().data(picker)
            if(!datagridPicker) $(this).data(picker, new DataGridPicker( $(this), options ))    // 没有初始化时先初始化
            return datagridPicker[options].apply(datagridPicker, Array.prototype.slice.call(arguments, 1))
        } else if(!options || $.isPlainObject(options)) {
            return $(this).each(function() {
                if(!$(this).is("table")) return ;   //只能初始化table标签
                datagridPicker = $(this).data(picker)
                if(datagridPicker) datagridPicker.destroy()
                $(this).data(picker, new DataGridPicker( $(this), options ))
            })
        } else {
            $.error("Parameter type [] is not supported in plugin [" +  picker + "]")
        }
    }

    // 自动化
    $(function() {
        // datagrid
        $("table[role=" + dg + "]").each(function() {
            $(this)[dg]()
        })
        // datagrid picker
        $("table[role=" + picker + "]").each(function() {
            $(this)[picker]()
        })
        // button
        $("[for-datagrid-picker]").click(function() {
            $($(this).attr("for-datagrid-picker")).datagridPicker("open")
        })
    })

})(window, document, jQuery, "datagrid")