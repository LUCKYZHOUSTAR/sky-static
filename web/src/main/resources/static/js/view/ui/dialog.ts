namespace Site.UI {
    import Dialog = Mtime.UI.Dialog;

    class DialogPage {
        constructor() {
            $("#btn-alert").click(this.testAlert.bind(this));
            $("#btn-confirm").click(this.testConfirm.bind(this));
            $("#btn-countdown").click(this.testCountdown.bind(this));
            $("#btn-multi").click(e => {
                $confirm("再来一个?", "确认", dlg => {
                    $alert("啦啦啦, 我是第二个对话框~", "提示", null, {width: 360});
                });
            });
        }

        private testAlert(e: JQueryEventObject) {
            $alert("Hello", "提示");
        }

        private testConfirm(e: JQueryEventObject) {
            $confirm("Are you OK?", "确认");
        }

        private testCountdown(e: JQueryEventObject) {
            Dialog.create({countdown: 5, closable: false}).body("对话框将在 5 秒后关闭").show();
        }
    }

    $(() => new DialogPage());
}