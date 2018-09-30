namespace Site.UI {
    import Form = Mtime.UI.Form;

    class FormPage {
        constructor() {
            let form = new Form("#form-test");

            $("#btn-serialize").click(e => {
                let data = form.serialize();
                $alert(JSON.stringify(data));
            });
            $("#btn-deserialize").click(e => {
                form.deserialize({
                    user: {
                        name: "sha",
                        email: "test@test.com",
                        tags: [2, '3']
                    },
                    apply: true
                });
            });
            $("#btn-submit").click(e => {
                form.validate() && form.submit("/ui/form/submit").json(r => {
                    $alert(JSON.stringify(r));
                });
            });
            $("#btn-reset").click(e => form.reset());
            $("#btn-clear").click(e => form.clear());

            let formValid = new Form("#form-valid");
            $("#btn-valid-submit").click(e => {
                if (formValid.validate()) {
                    let data = formValid.serialize();
                    $alert(JSON.stringify(data));
                } else {
                    $alert("数据验证失败");
                }
            });
        }
    }

    $(() => new FormPage());
}