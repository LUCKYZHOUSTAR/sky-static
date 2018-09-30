namespace Site.Net {
    import ajax = Mtime.Net.Ajax;

    /**
     * User
     */
    class User {
        id: number;
        name: string;
    }

    class AjaxPage {
        constructor() {
            $("#btn-json").click(this.testGetJson.bind(this));
            $("#btn-postjson").click(this.testPostJson.bind(this));
            $("#btn-postform").click(this.testPostForm.bind(this));
            $("#btn-error").click(this.testCustomErrorHandler.bind(this));
            $("#btn-async").click(this.testAsyncAwait.bind(this));
        }

        private testGetJson(e: JQueryEventObject) {
            ajax.get("/net/ajax/get-user", {id: 1}).trigger(e.target).json<User>(u => {
                $alert(JSON.stringify(u));
            });
        }

        private testPostJson(e: JQueryEventObject) {
            $ajax.post("/net/ajax/post-user-by-json", {id: "2"}).trigger(e.target).json<User>(u => {
                $alert(JSON.stringify(u));
            });
        }

        private testPostForm(e: JQueryEventObject) {
            $ajax.post("/net/ajax/post-user-by-form", {id: 3}).encoder("form").trigger(e.target).json<User>(u => {
                $alert(JSON.stringify(u));
            });
        }

        private testCustomErrorHandler(e: JQueryEventObject) {
            let handler = (xhr: JQueryXHR, textStatus: string, error: string) => {
                $alert(error, "自定义错误处理");
            };
            ajax.get("/net/ajax/404").trigger(e.target).errorHandler(handler).text(r => {
                $alert(r);
            });
        }

        private async testAsyncAwait(e: JQueryEventObject) {
            // 从此过上幸福的没有 callback 的日子
            let u = await $ajax.get("/net/ajax/get-user", {id: 1}).trigger(e.target).json<User>();
            $alert(JSON.stringify(u));
        }
    }

    $(() => new AjaxPage());
}