/**
 * Created by Mtime on 2016/1/27.
 */
(function($) {

    $(function() {
        $("#autocomplete1").autocompleter({
            source: "/ac/demo"
            , forced: false
            , dataType: "jsonp" //请求类型
            , jsonp: undefined  //jsonp回调函数参数名，默认为callback
            , multi: false	    //是否多选
            , message: $("div[for=autocomplete1]")    //消息提示容器，string|$()|boolean，为string表示jquery选择器，为true表示添加至input之后
            , data: ""		    //请求所需的额外参数，string|object|function，如果是string类型，请遵循序列化字符串格式
            , dynamicData: $("[name=extral]")	//请求所需的动态参数，string|function，如果是string类型，表示jQuery选择器，组件根据其标签判断调用val()方法还是html()方法
            , term: ""		    //参数名，默认为input的name属性，如果没有指定name属性，则默认为term
            , sep: ","		    //多选分隔符，默认为英文逗号","
            , text: "{nameCN}"	//作为显示文本的字段，支持自定义规则，使用{fieldName}作为占位符，为空表示label属性
            , input: ""		    //选择后显示到文本框中的字段，默认与text相同，支持自定义规则
            , value: ""		    //选中值，一般是作为主键的字段值，默认与input相同，支持自定义规则
            , valueSep: ""	    //多选模式下选中值之间的分隔符，默认与sep相同
            , minLength: 1	    //触发搜索的最小字符数
            , cache: true	    //是否缓存
            , highlight: true	//是否高亮
            // 如果是function，则返回一个json对象，表示分类字段值到要显示的分类文本的映射关系
            , responseHandler: null	//请求成功后数据预处理，返回Array
            , createItem: null		//创建列表项，返回li标签中的内容或者jQuery对象
            , sorter: null			//排序
            //其他配置项信息请查看jquery.ajax配置和jquery.ui.autocomplete配置
        })
    })

    $("#autocomplete2").autocompleter()


    $("button[for]").click(function() {
        var $input = $("#"+$(this).attr("for"))

        var selected = $input.autocompleter("selected") //multi="true"模式下返回对象数组，multi="false"模式下返回对象
            , selectedValue = $input.autocompleter("selectedValue")   //根据 value和valueSep配置获取选中值

        alert("[autocompleter(\"selected\")]: " + selected)
        alert("[autocompleter(\"selectedValue\")]: " + selectedValue)

        //简写形式
        selected = $input.acSel()
        selectedValue = $input.acVal()

        alert("[acSel()]: " + selected)
        alert("[acVal()]: " + selectedValue)
    })
})(window.jQuery)