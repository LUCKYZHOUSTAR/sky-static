namespace Static.Require {

    import ModulesLoader = Mtime.Net.ModulesLoader;

    alert("请看控制台输出:")
    console.log(`点击按钮前: typeof $.fn.datagrid == ${typeof $.fn.datagrid}`)

    $("#btn-datagrid").click(() => {
        ModulesLoader.require(["Mtime.DataGrid","http://static.dev.cmc.com/mtime/tree/listdom.js"], () => {
            console.log(`现在: typeof $.fn.datagrid == ${typeof $.fn.datagrid}`);
        })
    })
}