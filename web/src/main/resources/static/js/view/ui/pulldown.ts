interface JQuery {
    pulldown(method: "show" | "hide" | "attach" | "detach" | "disable" | "enable", data?: Object): JQuery;
}

namespace Site.UI {
    class DropdownPage {
        private tree1: ZTree;

        constructor() {
            this.initTree1();
        }

        private initTree1() {
            let options = {
                view: {
                    selectedMulti: false
                },
                callback: {
                    onClick(e: JQueryEventObject, treeId: string, treeNode: ZTreeNode, clickFlag: number) {
                        alert(`你选中了节点: ${treeNode.name}`);
                        $("#pulldown3").pulldown("hide");
                    }
                }
            };
            let nodes = [
                {
                    name: "网站导航",
                    open: true,
                    children: [
                        {"name": "mtime"},
                        {"name": "google"},
                        {"name": "baidu"},
                    ]
                }
            ];
            this.tree1 = $.fn.zTree.init($("#tree1"), options, nodes);
        }
    }

    $(() => new DropdownPage());
}