var Static;
(function (Static) {
    var Require;
    (function (Require) {
        var ModulesLoader = Mtime.Net.ModulesLoader;
        alert("请看控制台输出:");
        console.log("\u70B9\u51FB\u6309\u94AE\u524D: typeof $.fn.datagrid == " + typeof $.fn.datagrid);
        $("#btn-datagrid").click(function () {
            ModulesLoader.require(["Mtime.DataGrid", "http://static.dev.cmc.com/mtime/tree/listdom.js"], function () {
                console.log("\u73B0\u5728: typeof $.fn.datagrid == " + typeof $.fn.datagrid);
            });
        });
    })(Require = Static.Require || (Static.Require = {}));
})(Static || (Static = {}));
//# sourceMappingURL=require.js.map