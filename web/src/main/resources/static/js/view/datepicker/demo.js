/**
 * Created by Mtime on 2016/1/27.
 */
jQuery(function($) {

    $("#clearSlot").click(function() {
        $(this).closest(".row").find("input").each(function(i, input) {
            $(input).datepicker("date", null);
        })
    })

    $("#test1").dp()

    $("#test1, [role=cmc_datepicker]").on("dp.change", function() {
        var id = $(this).attr("id"),
            $div, val, date
        if(!id) return ;
        $div = $("div[for="+id+"]"), val = $(this).dpVal(), date = $(this).dpDate()
        val && $div.append("String类型：").append(val).append(";&nbsp;&nbsp;")
        date && $div.append("Date类型：").append(date).append("<br>")

    })

    $(":checkbox[for], :radio[for]").click(function() {
        var id = $(this).attr("for"),
            $input = $("#" + id),
            opts = {},
            data
        $(":checkbox[for="+id+"],:radio[for="+id+"]").each(function() {
            data = $(this).data() || {}
            if($(this).prop("checked") === true && data.name && data.value!=null) {
                opts[data.name] = data.value
            }
        })
        $input.cmc_datepicker("destroy")
        $input.cmc_datepicker(opts)
    })


    $("table", "#dataAttr").find("tbody tr").each(function() {
        var $td = $(this).find("td")
        $td.eq(1).text( $td.first().find("input")[0].outerHTML )
    })

    $(".btn[for]").click(function() {
        var id = $( this).attr("for"),
            $input = $("#"+ id),
            $div = $("div[for="+id+"]"),
            val = $input.dpVal(),
            date = $input.dpDate()
        val && $div.append("String类型：").append(val).append(";&nbsp;&nbsp;")
        date && $div.append("Date类型：").append(date).append("<br>")
    })
})