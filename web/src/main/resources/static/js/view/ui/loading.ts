namespace Site.UI {
    import Loading = Mtime.UI.Loading;

    class LoadingPage {
        private loading1 : Loading;
        private loading2 : Loading;

        constructor() {
            this.loading2 = new Loading("body", {maskColor: "black", spinner: "spinner1"});

            $("#btn1,#btn2,#btn3,#btn4,#btn5,#btn6,#btn7").click((e: JQueryEventObject) => {
                if (this.loading1) {
                    this.loading1.hide();
                    this.loading1 = null;
                } else {
                    let style = "spinner" + e.target.id.substr(3);
                    this.loading1 = Loading.show("#form-test", {maskColor: "black", spinner: style});
                }
            });
            $("#btn8").click((e: JQueryEventObject) => {
                this.loading2.show();
                setTimeout(() => this.loading2.hide(), 3000);
            });
        }
    }

    $(() => new LoadingPage());
}