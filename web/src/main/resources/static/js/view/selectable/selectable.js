$(function() {

    var select = $("#dataTest"),
        btnGet = $("#btnGet"),
        btnSet = $("#btnSet")

    btnGet.click(function() {
        var selected = select.selectable("data", true)
        $alert(JSON.stringify(selected))
    })

    btnSet.click(function() {
        select.selectable("data", 101)
    })

})