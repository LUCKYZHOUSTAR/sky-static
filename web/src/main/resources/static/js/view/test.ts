namespace Static.Test {

    import ModulesLoader = Mtime.Net.ModulesLoader;

    let datagrid = "/mtime/datagrid/js/datagrid.js?version=201700000";

    $("#info").click(() => {
        ModulesLoader.require(datagrid, () => {
            console.log($.fn.datagrid);
        })

    })
    $("#alert").click(() => {
        ModulesLoader.require("Mtime.MultiSelectable", () => {
            console.log($.widget);
        })

    })
}