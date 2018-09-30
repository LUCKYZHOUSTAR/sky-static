/**
 * Created by Mtime on 2016/7/6.
 */
jQuery(function($) {
    $("#datagrid1").dgOper("detail", function(e, data, btn) {
        $alert("提示", "你点击了id=" + data.id + "的数据行")
    })

    $("#customSourceDatagrid").datagrid({
        source: function(data, success, error) {
            $.ajax({
                url: "",
                type: "post",
                async: false,
                data: data,
                success: success,
                error: error
            })
        }
    })
})