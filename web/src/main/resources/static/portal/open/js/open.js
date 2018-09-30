var Open;
(function (Open) {
    var AjaxRequest = Mtime.Net.AjaxRequest;
    var Url = Mtime.Util.Url;
    var Manager = (function () {
        function Manager() {
            this.initAjaxPreHandler();
            this.initAjaxErrorHandler();
            this.initPagers();
            $(window).bind("load resize", this.adjustPageSize);
            $("#sidebar").find("div[data-toggle='collapse']").click(this.changeMenuIcon.bind(this));
        }
        Manager.prototype.initAjaxPreHandler = function () {
            var handler = AjaxRequest.preHandler;
            AjaxRequest.preHandler = function (options) {
                if (ctxPath && options.url.charAt(0) == "/") {
                    options.url = ctxPath + options.url;
                }
                if (handler) {
                    handler(options);
                }
            };
        };
        Manager.prototype.initAjaxErrorHandler = function () {
            AjaxRequest.errorHandler = function (xhr, status, err) {
                var content;
                if (xhr.responseJSON) {
                    content = xhr.responseJSON.error;
                }
                else {
                    content = err || status;
                }
                $alert(content, "错误");
            };
        };
        Manager.prototype.adjustPageSize = function () {
            // 导航菜单
            var menus = $(".navbar-nav>li>a");
            var menuschild = $(".navbar-nav>li>ul");
            if ($(window).width() < 768) {
                menus.attr("data-toggle", "collapse");
                menus.each(function () {
                    $(this).attr("href", $(this).attr("data-id"));
                });
            }
            else {
                $("#navbar-collapse, #navbar-collapse ul.collapse").removeClass('in');
                menus.attr("data-toggle", "");
                menuschild.addClass("collapse");
                menus.each(function () {
                    $(this).attr("href", $(this).attr("data-url"));
                });
            }
            // 内容区域
            var topOffset = 110;
            var height = ((window.innerHeight > 0) ? window.innerHeight : screen.height) - 1;
            height = height - topOffset;
            if (height < 1) {
                height = 1;
            }
            if (height > topOffset) {
                $("#content").css("min-height", (height) + "px");
            }
        };
        Manager.prototype.changeMenuIcon = function (e) {
            var icon = $(e.target).closest("div[data-toggle='collapse']").find("i").first();
            icon.toggleClass("fa-plus-square-o fa-minus-square-o");
        };
        Manager.prototype.initPagers = function () {
            var $pagers = $(".pagination-wrapper");
            if ($pagers.length == 0) {
                return;
            }
            var u = new Url(location.pathname + location.search);
            var jump = function (pageIndex, pageSize) {
                u.setParam("pageIndex", pageIndex);
                pageSize && u.setParam("pageSize", pageSize);
                location.replace(u.toString());
            };
            $pagers.find("select").change(function (e) {
                jump("1", e.target.value);
            });
            $pagers.find("input").keydown(function (e) {
                e.keyCode == 13 && jump(e.target.value);
            });
            $pagers.find("nav>ul>li>a").each(function (i, dom) {
                var page = $(dom).data("page");
                if (page) {
                    u.setParam("pageIndex", page);
                    dom.href = u.toString();
                }
            });
        };
        return Manager;
    }());
    $(function (_) { return new Manager(); });
})(Open || (Open = {}));
//# sourceMappingURL=open.js.map