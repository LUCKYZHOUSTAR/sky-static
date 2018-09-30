var Site;
(function (Site) {
    var UI;
    (function (UI) {
        var Dialog = Mtime.UI.Dialog;
        var DialogPage = (function () {
            function DialogPage() {
                $("#btn-alert").click(this.testAlert.bind(this));
                $("#btn-confirm").click(this.testConfirm.bind(this));
                $("#btn-countdown").click(this.testCountdown.bind(this));
                $("#btn-multi").click(function (e) {
                    $confirm("再来一个?", "确认", function (dlg) {
                        $alert("啦啦啦, 我是第二个对话框~", "提示", null, { width: 360 });
                    });
                });
            }
            DialogPage.prototype.testAlert = function (e) {
                $alert("Hello", "提示");
            };
            DialogPage.prototype.testConfirm = function (e) {
                $confirm("Are you OK?", "确认");
            };
            DialogPage.prototype.testCountdown = function (e) {
                Dialog.create({ countdown: 5, closable: false }).body("对话框将在 5 秒后关闭").show();
            };
            return DialogPage;
        }());
        $(function () { return new DialogPage(); });
    })(UI = Site.UI || (Site.UI = {}));
})(Site || (Site = {}));
//# sourceMappingURL=dialog.js.map