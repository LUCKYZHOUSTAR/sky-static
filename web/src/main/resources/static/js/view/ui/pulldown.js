var Site;
(function (Site) {
    var UI;
    (function (UI) {
        var DropdownPage = (function () {
            function DropdownPage() {
                this.initTree1();
            }
            DropdownPage.prototype.initTree1 = function () {
                var options = {
                    view: {
                        selectedMulti: false
                    },
                    callback: {
                        onClick: function (e, treeId, treeNode, clickFlag) {
                            alert("\u4F60\u9009\u4E2D\u4E86\u8282\u70B9: " + treeNode.name);
                            $("#pulldown3").pulldown("hide");
                        }
                    }
                };
                var nodes = [
                    {
                        name: "网站导航",
                        open: true,
                        children: [
                            { "name": "mtime" },
                            { "name": "google" },
                            { "name": "baidu" },
                        ]
                    }
                ];
                this.tree1 = $.fn.zTree.init($("#tree1"), options, nodes);
            };
            return DropdownPage;
        }());
        $(function () { return new DropdownPage(); });
    })(UI = Site.UI || (Site.UI = {}));
})(Site || (Site = {}));
//# sourceMappingURL=pulldown.js.map