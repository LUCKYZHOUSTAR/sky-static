var Static;
(function (Static) {
    var Test;
    (function (Test) {
        var ModulesLoader = Mtime.Net.ModulesLoader;
        var datagrid = "/mtime/datagrid/js/datagrid.js?version=201700000";
        $("#info").click(function () {
            ModulesLoader.require(datagrid, function () {
                console.log($.fn.datagrid);
            });
        });
        $("#alert").click(function () {
            ModulesLoader.require("Mtime.MultiSelectable", function () {
                console.log($.widget);
            });
        });
    })(Test = Static.Test || (Static.Test = {}));
})(Static || (Static = {}));
//# sourceMappingURL=test.js.map