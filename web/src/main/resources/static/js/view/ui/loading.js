var Site;
(function (Site) {
    var UI;
    (function (UI) {
        var Loading = Mtime.UI.Loading;
        var LoadingPage = (function () {
            function LoadingPage() {
                var _this = this;
                this.loading2 = new Loading("body", { maskColor: "black", spinner: "spinner1" });
                $("#btn1,#btn2,#btn3,#btn4,#btn5,#btn6,#btn7").click(function (e) {
                    if (_this.loading1) {
                        _this.loading1.hide();
                        _this.loading1 = null;
                    }
                    else {
                        var style = "spinner" + e.target.id.substr(3);
                        _this.loading1 = Loading.show("#form-test", { maskColor: "black", spinner: style });
                    }
                });
                $("#btn8").click(function (e) {
                    _this.loading2.show();
                    setTimeout(function () { return _this.loading2.hide(); }, 3000);
                });
            }
            return LoadingPage;
        }());
        $(function () { return new LoadingPage(); });
    })(UI = Site.UI || (Site.UI = {}));
})(Site || (Site = {}));
//# sourceMappingURL=loading.js.map