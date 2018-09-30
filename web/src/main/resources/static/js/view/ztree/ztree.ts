namespace Site.ZTree {
    class ZTreePage {
        private tree1: ZTree;
        private tree2: ZTree;

        constructor() {
            this.initTree1();
            this.initTree2();
        }

        private initTree1() {
            let options = {
                view: {
                    selectedMulti: false
                }
            };
            let nodes = [
                {
                    name: "网站导航",
                    open: true,
                    children: [
                        {"name": "google", "url": "http://www.google.com", "target": "_blank"},
                        {"name": "baidu", "url": "http://www.baidu.com", "target": "_blank"},
                        {"name": "xxx"}
                    ]
                }
            ];
            this.tree1 = $.fn.zTree.init($("#tree1"), options, nodes);
        }

        private initTree2() {
            let options = {
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: (treeId, treeNode) => treeNode && !treeNode.isParent,
                    onClick: (e: Event, treeId: string, treeNode: ZTreeNode) => {
                        $("#txt-tree").attr("value", treeNode.name);
                        hideTree();
                    }
                }
            };
            let nodes = [
                {id: 1, pId: 0, name: "北京"},
                {id: 2, pId: 0, name: "天津"},
                {id: 3, pId: 0, name: "上海"},
                {id: 6, pId: 0, name: "重庆"},
                {id: 4, pId: 0, name: "河北省", open: true},
                {id: 41, pId: 4, name: "石家庄"},
                {id: 42, pId: 4, name: "保定"},
                {id: 43, pId: 4, name: "邯郸"},
                {id: 44, pId: 4, name: "承德"},
                {id: 5, pId: 0, name: "广东省", open: true},
                {id: 51, pId: 5, name: "广州"},
                {id: 52, pId: 5, name: "深圳"},
                {id: 53, pId: 5, name: "东莞"},
                {id: 54, pId: 5, name: "佛山"},
                {id: 6, pId: 0, name: "福建省", open: true},
                {id: 61, pId: 6, name: "福州"},
                {id: 62, pId: 6, name: "厦门"},
                {id: 63, pId: 6, name: "泉州"},
                {id: 64, pId: 6, name: "三明"}
            ];
            this.tree2 = $.fn.zTree.init($("#tree2"), options, nodes);

            let onBodyClick = (e: Event) => {
                let target = <HTMLElement>e.target;
                if (!(target.id == "menuContent" || $(target).parents("#menuContent").length > 0)) {
                    hideTree();
                }
            };
            let showTree = () => {
                let cityInput = $("#txt-tree");
                let offset = $("#txt-tree").offset();
                $("#menuContent").css({
                    left: offset.left + "px",
                    top: offset.top + cityInput.outerHeight() + "px"
                }).slideDown("fast");
                $("body").bind("mousedown", onBodyClick);
            };
            let hideTree = () => {
                $("#menuContent").fadeOut("fast");
                $("body").unbind("mousedown", onBodyClick);
            };
            $("#txt-tree").focus(showTree);
        }
    }

    $(() => new ZTreePage());
}