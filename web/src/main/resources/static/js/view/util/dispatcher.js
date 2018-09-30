var Site;
(function (Site) {
    var Util;
    (function (Util) {
        var Dispatcher = Mtime.Util.Dispatcher;
        var DispatcherPage = (function () {
            function DispatcherPage() {
                var dispatcher1 = Dispatcher.bind("#table-users");
                dispatcher1.on("delete-user", this.deleteUser.bind(this));
                var dispatcher2 = Dispatcher.bind(document);
                dispatcher2.on("delete-user", function (e) {
                    alert("不会触发");
                });
            }
            DispatcherPage.prototype.deleteUser = function (e) {
                $(e.target).closest("tr").remove();
            };
            return DispatcherPage;
        }());
        $(function () { return new DispatcherPage(); });
    })(Util = Site.Util || (Site.Util = {}));
})(Site || (Site = {}));
//# sourceMappingURL=dispatcher.js.map