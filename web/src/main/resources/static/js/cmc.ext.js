/***JQuery Extension***/
/**
 * json序列化表单控件
 * @author Sun Wang
 * @returns {{}}
 */
$.fn.serializeToJson = function() {
    var json = {}
    $(this).each(function() {
        $(this).find(":text,:password,:file,input[type=hidden],:radio,:checkbox,select,textarea").each(function() {
            if(!$(this).is("[name]") || $(this).is(":disabled")) return;
            if($(this).is(":radio,:checkbox") && !$(this).is(":checked")) return;
            var name = $(this).attr("name"), value = $(this).val(), index
            if(/([$_a-z0-9]+)\[([0-9]+)\]/i.test(name)) {
                name = RegExp.$1, index = RegExp.$2
                json[name] = json[name] || []
                if(!$.isArray(json[name])) throw "the value of element attribute [name] is invalid"
            }
            if( $.isArray( json[name] ) ) {
                json[name][index] = value
            } else {
                if( $(this).is(":checkbox") ) {
                    json[name] = (json[name] || "") + (json[name] ? "," : "") + value
                } else {
                    json[name] = value;
                }
            }
        })
    })
    return json;
}

/**
 * 清空表单控件
 * @returns {*}
 */
if( !$.fn.reset ) $.fn.reset = function() {
    return $(this).each(function() {
        $(this).find(":text,:password,:file,input[type=hidden],select,:checkbox,:radio,textarea").each(function() {
            if( $(this).is(":checkbox,:radio") ) {
                $(this).prop("checked", false)
            } else if( $(this).is("select") ) {
                $(this).val(0)
            } else {
                $(this).val("")
            }
        })
    })
}

/**
 * 按钮倒计时
 * @param func
 * @returns {*|jQuery|HTMLElement}
 */
$.fn.interval = function(func) {
    $(this).each(function() {
        var btn = $(this),
            txt = btn.html(),
            i, tid, _t
        if(!btn.is(".btn") || btn.is(".disabled")) return false;
        i = $("<i>").text(btn.data("interval")||5)
        btn.addClass("disabled")
            .empty()
            .append(i)
            .append("s")
        tid = setInterval(function() {
            _t = Number(i.text()) - 1
            i.text(_t)
            if(_t <= 0) {
                clearInterval(tid)
                btn.removeClass("disabled")
                    .html(txt)
            }
        }, 1000)
    })
    if($.isFunction(func)) func()
    return $(this)
}

/**
 * 动态加载资源文件
 * @param url 加载路径，string|Array
 * @param success 全部成功后回调
 * @param error 失败后回调
 * @returns {jQuery}
 */
$.loadJS = function(urls, success, error) {
    var cache = $.loadJS.cache = $.loadJS.cache || {}
    var getDeferred = function(url) {
        if( url in cache) return cache[url]
        return cache[ url ] = $.getScript( url )
    }
    // object
    if($.isPlainObject(urls)) {
        for(var url in urls) {
            $.loadJS(urls[url], function() {
                $.loadJS(url)
            })
        }
        return
    }
    // array or string
    urls = $.isArray(urls) ? urls : [ urls ]
    var ajax = []
    for(var i = 0; i < urls.length; i++) {
        if( !$("script[src^='" + urls[i] + "']")[0] ) ajax.push( getDeferred( urls[i] ) )
    }
    return $.when.apply(this, ajax).done(success).fail(error)
}

/**
 * 模态抓取
 * @returns {*}
 */
$.fn.dragmodal = function() {
    return $(this).each(function() {
        $(this).find(".modal-header").on("mousedown", function (e) {
            var modal = $(this).closest(".modal"),
                _drag = function (e) {
                    if (this.drag) {
                        var d = this.find("div.modal-content")
                        var left = d.prop("offsetLeft") + e.clientX - this.dragX;
                        var top = d.prop("offsetTop") + e.clientY - this.dragY;
                        d.css({ left: left + "px", top: top + "px" })
                        this.dragX = e.clientX;
                        this.dragY = e.clientY;
                    }
                },
                _dragEnd = function (e) {
                    $(document).unbind({
                        mousemove: _drag.bind(modal),
                        mouseup: _dragEnd.bind(modal),
                        selectstart: _disableSelect.bind(modal)
                    });
                    e.target.style.cursor = "";
                    this.drag = false;
                },
                _disableSelect = function (e) {
                    return false;
                }
            modal.drag = true;
            modal.dragX = e.clientX;
            modal.dragY = e.clientY;
            e.target.style.cursor = "move";
            $(document).bind({
                mousemove: _drag.bind(modal),
                mouseup: _dragEnd.bind(modal),
                selectstart: _disableSelect.bind(modal)
            });
        });
    });
}


/**
 * cookie组件
 */
if(!$.cookie) {
    $.cookie = function (a, c, b) {
        if (typeof c != "undefined") {
            b = b || {};
            null === c && (c = "", b.expires = -1);
            var d = "";
            b.expires && (typeof b.expires == "number" || b.expires.toUTCString) && (typeof b.expires == "number" ? (d = new Date(), d.setTime(d.getTime() + 864e5 * b.expires)) : d = b.expires, d = "; expires=" + d.toUTCString());
            var e = b.path ? "; path=" + b.path : "", g = b.domain ? "; domain=" + b.domain : "";
            b = b.secure ? "; secure" : "";
            window.document.cookie = [a, "=", encodeURIComponent(c), d, e, g, b].join("");
        } else {
            c = null;
            if (window.document.cookie && window.document.cookie != "") for (b = window.document.cookie.split(";"), d = 0; d < b.length; d++) if (e = jQuery.trim(b[d]), e.substring(0, a.length + 1) == a + "=") {
                c = decodeURIComponent(e.substring(a.length + 1));
                break;
            }
            return c;
        }
    }
    if($.fn.cookie) {
        $.fn.cookie = $.cookie
    }
}

/***
 Date Extension
 check http://blog.csdn.net/vbangle/article/details/5643091
 ***/
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function(fmt) { //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

/**
 * 将复杂json转成可以使用嵌套Model类接收的简单json
 * @param obj 复杂json
 * @param field 复杂对象所在Model中的字段名, 为空则直接将复杂对象当做接收Model类
 * @returns {{}}
 */
$.toModelParams = function(obj, field) {
    var res = {}, arr,
        _param = function(field, obj, result) {
            if(obj == null) {

            } if(/string|boolean|number/i.test(typeof obj)) {
                return result.push({name: field, value: obj})
            } else if($.isArray(obj)) {
                if(field) {
                    $.each(obj, function(i, item) {
                        _param(field+"[" + i + "]", item, result)
                    })
                } else {
                    throw "collection type model not supported!"
                }
            } else if($.isPlainObject(obj)) {
                $.each(obj, function(k, v) {
                    if(field) {
                        _param(field + "." + k, v, result)
                    } else {
                        _param(k, v, result);
                    }
                })
            }
            return result;
        }
    arr = _param(field, obj, []);
    $.each(arr, function(i, item) {
        res[item.name] = item.value;
    })
    return res;
}

if(window.Mtime && Mtime.Net && Mtime.Net.AjaxRequest) {
    var errorHandler = Mtime.Net.AjaxRequest.errorHandler;
    Mtime.Net.AjaxRequest.errorHandler = function(xhr, textStatus, error) {
        if(xhr.readyState == 0 && textStatus != "timeout") return ;
        xhr.responseJSON = xhr.responseJSON || JSON.parse(xhr.responseText);
        var status = xhr.responseJSON.status;
        if(status == 403) {
            // 未登录状态
            top.location.reload(true);
        } else {
            errorHandler && errorHandler(xhr, textStatus, error);
        }
    }
}

/**
 * 解决modal中的组件搜索框不能获取焦点的问题
 */
$(document).on("focus", "input.select2-search__field, .ui-multiselect-filter input", function() {
    return false;
})

jQuery(function($) {
    /**
     * datagrid错误提示
     */
    $(document).on("click", "a[mx-ajax-status=error]", function() {
        var args = $(this).data("error-args");
        if($.isArray(args) && args.length == 3) {
            Mtime.Net.AjaxRequest.errorHandler.apply(Mtime.Net.AjaxRequest, args);
        }
    })

    /**
     * 回车提交表单
     */
    $("form").not("[auto-submit=false]").on("keydown", ":text,:password,:file", function(e) {
        e = e || window.event
        if(e.keyCode == 13) {
            var form = $(this).closest("form"), btn
            if((btn = form.attr("defaultButton"))
                || (btn = form.find(".btn.btn-primary")[0])
                || (btn = form.find(":submit")[0])) {
                btn = $(btn)
            }
            if(btn && btn[0]) btn.click()
            return false;
        }
    })

    /**
     * 模态框拖拽
     */
    if($.fn.dragmodal) {
        $(".modal[role=dragmodal]").dragmodal();
    }

    if($.selectable) {
        $.selectable.defaults.language = "zh-CN";
    }

    /**
     * 分页全局设置
     */
    if($.fn.datagrid) {
        $.extend(true, $.datagrid.defaults, {
            timeout: 15000,
            ui: {
                checkAll: '<input type="checkbox">',
                checkbox: '<input type="checkbox" name="{name}">',
                radio: '<input type="radio" name="{name}">'
            }
            //, operBtnTmpl: "<a href=\"javascript:;\" class=\"t-icon\" title=\"{title}\"><i class=\"{txt}\"></i></a>"
            , operBtnTmpl: "<button class=\"btn btn-default t-icon\" title=\"{title}\"><i class=\"{txt}\"></i></button>"
            , sort: {
                asc: function(th) {
                    th.find("> .order").remove()
                    th.append("<span class=\"order o-up\"></span>")
                },
                desc: function(th) {
                    th.find("> .order").remove()
                    th.append("<span class=\"order o-down\"></span>")
                },
                both: function(th) {
                    th.find("> .order").remove()
                    th.append("<span class=\"order\"></span>")
                },
                none: function(th) {
                    th.find("> .order").remove()
                }
            }
            , pagerOpts: {
                pageSize: 10
                , sizeSelect: [10, 25, 50, 100]
                , ui: '<div class="page-turn clearfix">\
                            <span class="pull-right">\
                                共<i pager-field="totalCount">0</i>条/<i pager-field="pageCount">1</i>页，每页\
                                <select pager-field="pageSize">\
                                    <option value="1">1</option>\
                                    <option value="2">2</option>\
                                </select>\
                                    条，第<input pager-field="pageIndex" type="text">页\
                                <em class="over" pager-btn="first">首页</em>\
                                <em pager-btn="prev">上页</em>\
                                <em pager-btn="next">下页</em>\
                                <em pager-btn="last">尾页</em>\
                            </span>\
                        </div>'


            //     , ui: '<div class="page-turn clearfix">\
            //     <span class="pull-right">\
            //         共<i pager-field="totalCount">0</i>条，每页\
            //         <select pager-field="pageSize">\
            //             <option value="1">1</option>\
            //             <option value="2">2</option>\
            //         </select>\
            //         条，第\
            //         <select pager-field="pageIndex">\
            //             <option value="1">1</option>\
            //             <option value="2">2</option>\
            //         </select>页\
            //         <em class="over" pager-btn="first">首页</em>\
            //         <em pager-btn="prev">上页</em>\
            //         <em pager-btn="next">下页</em>\
            //         <em pager-btn="last">尾页</em>\
            //     </span>\
            // </div>'
                , enableBtn: function(btn) {
                    btn.removeClass("over")
                }
                , disableBtn: function(btn) {
                    btn.addClass("over")
                }
                , appendTo: function(element, table) {
                    var top = element,
                        bottom = element.clone(),
                        tableContainer = table.parent(".table-responsive")
                    tableContainer = tableContainer[0] ? tableContainer : table
                    top.insertBefore(tableContainer)
                    bottom.insertAfter(tableContainer)
                    this.element = top.add(bottom)
                }
            }
            , picker: {
                show: function(modal) {
                    modal.modal()
                }
                , close: function(modal) {
                    modal.modal("hide")
                }
                , alert: function(msg) {
                    if(window.$alert) {
                        $alert(msg, "提示")
                    } else {
                        alert(msg)
                    }
                }
                , ui: '<div class="modal fade in" tabindex="-1" role="dialog" aria-hidden="false" style="display: none;" data-backdrop="static">\
                            <div class="modal-dialog" role="datagrid-picker-dialog">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                                        <h4 class="modal-title">请选择</h4>\
                                    </div>\
                                    <div class="modal-body" role="datagrid-picker-modal-body">\
                                        <div style="min-width: 600px;display:block;" class="movie-hallbox p10" role="datagrid-picker-form-container"></div>\
                                        <div style="min-width: 600px;display:block;" class="movie-hallbox p10" role="datagrid-picker-table-container"></div>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <div class="cont-list">\
                                            <button class="btn btn-default w-btn" role="btn-ok"><i class="icon-sub"></i>确定<tton>\
                                            <button class="btn btn-default w-btn" role="btn-select"><i class="icon-plus"></i>选中<tton>\
                                            <button class="btn btn-default w-btn" role="btn-close"><i class="icon-x"></i>关闭<tton>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>'
            }

    //        <a href="javascript:;" class="w-btn save-btn" role="btn-ok">\
    //<i class="icon"></i>确定\
    //</a>\
    //<a href="javascript:;" class="w-btn save-btn" role="btn-select">\
    //<i class="icon"></i>选中\
    //</a>\
    //<a href="javascript:;" class="w-btn cle-btn" role="btn-close">\
    //<i class="icon"></i>关闭\
    //</a>\
        })
    }

})
/***JQuery Extension End***/




