/**
 * Created by Mtime on 2016/1/27.
 */

(function(w, d, $, u) {

    var plugin = {
        name: "datepicker",
        version: "1.1.0-SNAPSHOT"
    }
    if(!( $ = w[$] )) throw plugin.name + " requires jQuery library"
    if($.fn[plugin.name]) {
        if(console.log) {
            console.log(plugin.name + " plugin exists!")
        }
        return false;
    }

    var units = [
        {Shorthand:"S",key:"milliseconds"}
        ,{Shorthand:"s",key:"seconds"}
        ,{Shorthand:"m",key:"minutes"}
        ,{Shorthand:"h",key:"hours"}
        ,{Shorthand:"H",key:"hours"}
        ,{Shorthand:"D",key:"days"}
        ,{Shorthand:"M",key:"months"}
        ,{Shorthand:"Y",key:"years"}
    ]
    units.get = function(date) {
        if(date) {
            for(var i = 0, l = units.length; i < l; i++) {
                if(date.indexOf(units[i].Shorthand) >= 0) {
                    return units[i].key;
                }
            }
        }
    }

    /**
     * 通用配置
     * @type {{}}
     */
    var mx = {
            locale: 'zh_cn',    //语言
            format: 'YYYY-MM-DD HH:mm:ss'
        },
        // 三种默认样式
        roles = {
            year: {
                format: 'YYYY',
                unit: "year"
            },
            month: {
                format: 'YYYY-MM',
                unit: "month"
            },
            date: {
                format: 'YYYY-MM-DD',
                unit: "day"
            },
            mdatetime: {
                format: 'YYYY-MM-DD HH:mm',
                unit: "minute"
            },
            sdatetime: {
                format: 'YYYY-MM-DD HH:mm:ss',
                unit: "second"
            },
            mtime: {
                format: 'HH:mm',
                icon: "glyphicon glyphicon-time",
                unit: "minute"
            },
            stime: {
                format: 'HH:mm:ss',
                icon: "glyphicon glyphicon-time",
                unit: "second"
            }
        },
        ext = {
            dateType: "",   // 日期类型，可选值：date(对应日期格式 YYYY-MM-DD)、mdatetime(YYYY-MM-DD HH:mm)、sdatetime(YYYY-MM-DD HH:mm:ss)、mtime(HH:mm)、stime(HH:mm:ss)
            initElement: true,  // 是否初始化HTML标记，当作用域为input元素时，用于自动生成input-group容器，默认为true
            icon: "",   //initElement=true时自定义图标
            min: "",    //指定日期最小值的关联控件,jQuery选择器
            max: ""     //指定日期最大值关联控件,jQuery选择器
        }


    var methods = {
        /**
         * 初始化HTML
         * @param $input
         * @private
         */
        _initElement: function( $input, options ) {
            var clazz = ( $input.attr("class") || "" ).split(" "),
                opts = options || {},
                dateType = ( opts.dateType && roles[opts.dateType] ) || {},
                icon = opts.icon || dateType.icon || "glyphicon glyphicon-calendar",
                cols = []
            for(var i in clazz) {
                if(/^col\-(lg|md|sm|xs)(\-offset)?\-(1[0-2]|[1-9])$/.test(clazz[i])) {
                    cols.push(clazz[i])
                    $input.removeClass(clazz[i])
                }
            }
            $input.wrap("<div class='input-group date " + cols.join(" ") + "'></div>")
                .after("<span class='input-group-addon'><span class='" + icon + "'></span></span>")
        },
        /**
         * 获取关联的input
         */
        _getInputElement: function( $input ) {
            if( !$input[0] ) return $input
            if( $input.is("input") ) return $input;
            if( $input.find("input")[0] ) return $input.find("input")
            throw "There is no input element."
        },
        /**
         * 获取picker
         * @param $input
         * @returns {*}
         */
        _getDateTimePicker: function( $input ) {
            return $input.data("DateTimePicker");
        },

        /**
         * 获取选中值
         */
        getValue: function() {
            var $this = $( this ), value = ""
            if( methods._getDateTimePicker( $this ) ) value = methods._getInputElement( $this ).val()
            return value
        },
        /**
         * 获取选中时间
         */
        getDate: function() {
            var picker = methods._getDateTimePicker( $(this) );
            if( picker ) return picker.getDate()
        }
    }


    $.fn[plugin.name] = function(options) {
        var result = [], args = arguments
        this.each(function() {
            var $this = $( this ),
                data = $this.data() || {},
                min, max, opts, picker,
                $input = methods._getInputElement($this);
            if(typeof options === "string" && options.charAt(0) != "_") {
                if( methods[options] ) {
                    result.push( methods[options].apply( $this, Array.prototype.slice.call(args, 1) ) )
                } else if( ( picker = methods._getDateTimePicker( $this ) ) && picker[options] ) {
                    result.push( picker[options].apply( picker, Array.prototype.slice.call(args, 1) ) )
                }
            } else if( $.isPlainObject( options ) || !options ) {
                var _options = $.extend(true, data, options||{})
                if(_options.dateType && roles[_options.dateType])  {
                    _options = $.extend(true, {}, roles[_options.dateType], _options)
                }
                opts = $.extend( true, {}, mx, _options )
                if($this.is("input") && !$this.closest(".input-group")[0] && opts.initElement !== false) {
                    methods._initElement($this, opts)
                }

                var start = function(date, unit) {
                    if(unit) {
                        return date ? moment(date).startOf(unit) : false;
                    } else {
                        return date || false;
                    }

                }
                var end = function(date, unit) {
                    if(unit) {
                        return date ? moment(date).endOf(unit) : false;
                    } else {
                        return date || false;
                    }
                }

                //关联时间
                if(min = opts.min) {
                    var $minInput = methods._getInputElement($(min));
                    opts.minDate = $minInput.val() || false;
                    $this.on("dp.change", function(e) {
                        var minPicker = methods._getDateTimePicker($(min));
                        if(minPicker) {
                            minPicker.maxDate(end(e.date, units.get(opts.format)))
                        }
                    }).on("dp.show", function(e) {
                        var picker = methods._getDateTimePicker($this);
                        var minPicker = methods._getDateTimePicker($(min));
                        var minDate = $minInput.val();
                        if(picker && minDate && !$this.val()) {
                            picker.date(minPicker ? minPicker.date() : moment(minDate))
                        }
                    })
                }

                if(max = opts.max) {
                    var $maxInput = methods._getInputElement($(max));
                    opts.maxDate = $maxInput.val() || false;
                    $this.on("dp.change", function(e) {
                        var picker = methods._getDateTimePicker($(max));
                        if(picker) {
                            picker.minDate(start(e.date, units.get(opts.format)));
                        }
                    }).on("dp.show", function(e) {
                        var picker = methods._getDateTimePicker($this);
                        var maxPicker = methods._getDateTimePicker($(max));
                        var maxDate = $maxInput.val();
                        if(maxDate && !$this.val() && picker) {
                            picker.date(maxPicker ? maxPicker.date() : moment(maxDate))
                        }
                    })
                }

                var __defaults = $.fn.datetimepicker.defaults;
                for(var i in opts) {
                    if(!(i in __defaults)) {
                        delete opts[i]
                    }
                }

                if($this.is("input")) {
                    // 图标点击事件
                    $this.closest(".input-group").find(".input-group-addon").click(function() {
                        $this.focus();
                    })
                }
                $.fn.datetimepicker.call( $this, opts )
            }
        })
        switch (result.length) {
            case 0:
                return this;
            case 1:
                return result[0]
            default:
                return result
        }
    }

    //简写
    !$.fn.dp && ($.fn.dp = $.fn[plugin.name])

    !$.fn.dpVal && ($.fn.dpVal = function() {
        return $( this )[plugin.name]( "getValue" )
    })

    !$.fn.dpDate && ($.fn.dpDate = function() {
        return $( this)[plugin.name]( "getDate" )
    })

    $(function() {
        $("[role=" + plugin.name + "]")[plugin.name]()
    })

})(window, document, "jQuery")