/**
 * Created by Mtime on 2016/1/27.
 */

window.jQuery(function() {
    var movie = {
        uploadUrl: "/fi/upload",
        bucket: "movie_cover"
    }

    $("#test1").upload({
        //showPreview: false,
        uploadUrl: "/fi/upload",
        bucket: "movie_cover"
        , initValue: [
            {id:1, imageUrl:"/img/docs/2.jpg", filename:"2.jpg"}
            , {id:2, imageUrl:"/img/docs/3.jpg", filename:"3.jpg"}
        ]
    }).on("fileuploaded", function() {
        console.log("upload")
        console.log(arguments)
    }).on("fileremoved filesuccessremove", function() {
        console.log("remove")
        console.log(arguments)
        // alert("trigger event fileremoved")
    })

    $("#test2").on("fileuploaded", function() {
        console.log("upload")
        console.log(arguments)
    }).on("fileremoved filesuccessremove", function() {
        console.log("remove")
        console.log(arguments)
        // alert("trigger event fileremoved")
    })

    $(":checkbox[for]").click(function() {
        var id = $(this).attr("for"),
            $file = $( "#" + id)
        var options = {
            initValue: [
                {id:1, imageUrl:"/img/docs/2.jpg", filename:"2.jpg"}
                , {id:2, imageUrl:"/img/docs/3.jpg", filename:"3.jpg"}
                , {id:3, imageUrl:"", filename:"4.jpg"}
            ]
        }
        $(":checkbox[for="+id+"]").each(function() {
            if($(this).prop("checked")===true) {
                var item = $(this).data()
                options[item.name] = item.value
            }
        })
        $file.fi("destroy")
        $file.fi($.extend(true, {}, movie, options))

    })

    //$("#file-0b").fi({
    //    editable: true
    //    , uploadUrl: "/fi/upload"
    //    , deleteUrl: "/fi/upload"
    //    , initValue: [
    //        {id:1, imageUrl:"/img/docs/2.jpg", filename:"2.jpg"}
    //        , {id:2, imageUrl:"/img/docs/3.jpg", filename:"3.jpg"}
    //    ]
    //    , language: "zh"
    //})
})