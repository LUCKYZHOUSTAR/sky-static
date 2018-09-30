namespace Site.Util {
    import Dispatcher = Mtime.Util.Dispatcher;

    class DispatcherPage {
        constructor() {
            let dispatcher1 = Dispatcher.bind("#table-users");
            dispatcher1.on("delete-user", this.deleteUser.bind(this));

            let dispatcher2 = Dispatcher.bind(document);
            dispatcher2.on("delete-user", e => {
                alert("不会触发");
            });
        }

        private deleteUser(e: JQueryEventObject) {
            $(e.target).closest("tr").remove();
        }
    }

    $(() => new DispatcherPage());
}