var Site;
(function (Site) {
    var UI;
    (function (UI) {
        var Form = Mtime.UI.Form;
        var FormPage = (function () {
            function FormPage() {
                var form = new Form("#form-test");
                $("#btn-serialize").click(function (e) {
                    var data = form.serialize();
                    $alert(JSON.stringify(data));
                });
                $("#btn-deserialize").click(function (e) {
                    form.deserialize({
                        user: {
                            name: "sha",
                            email: "test@test.com",
                            tags: [2, '3']
                        },
                        apply: true
                    });
                });
                $("#btn-submit").click(function (e) {
                    form.validate() && form.submit("/ui/form/submit").json(function (r) {
                        $alert(JSON.stringify(r));
                    });
                });
                $("#btn-reset").click(function (e) { return form.reset(); });
                $("#btn-clear").click(function (e) { return form.clear(); });
                var formValid = new Form("#form-valid");
                $("#btn-valid-submit").click(function (e) {
                    if (formValid.validate()) {
                        var data = formValid.serialize();
                        $alert(JSON.stringify(data));
                    }
                    else {
                        $alert("数据验证失败");
                    }
                });
            }
            return FormPage;
        }());
        $(function () { return new FormPage(); });
    })(UI = Site.UI || (Site.UI = {}));
})(Site || (Site = {}));
//# sourceMappingURL=form.js.map