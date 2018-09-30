/**
 * 开放平台网站公共组件
 */
declare let ctxPath: string;

namespace Open {
    import AjaxOptions = Mtime.Net.AjaxOptions;
    import AjaxRequest = Mtime.Net.AjaxRequest;
    import Url = Mtime.Util.Url;

    class Manager {
        constructor() {
            this.initAjaxPreHandler();
            this.initAjaxErrorHandler();
            this.initPagers();

            $(window).bind("load resize", this.adjustPageSize);
            $("#sidebar").find("div[data-toggle='collapse']").click(this.changeMenuIcon.bind(this));
        }

        private initAjaxPreHandler() {
            let handler = AjaxRequest.preHandler;
            AjaxRequest.preHandler = (options: AjaxOptions) => {
                if (ctxPath && options.url.charAt(0) == "/") {
                    options.url = ctxPath + options.url;
                }
                if (handler) {
                    handler(options);
                }
            };
        }

        private initAjaxErrorHandler() {
            AjaxRequest.errorHandler = (xhr, status, err) => {
                let content: string;
                if (xhr.responseJSON) {
                    content = xhr.responseJSON.error;
                } else {
                    content = err || status;
                }
                $alert(content, "错误");
            };
        }

        private adjustPageSize() {
            // 导航菜单
            let menus = $(".navbar-nav>li>a");
            let menuschild = $(".navbar-nav>li>ul");
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
            let topOffset = 110;
            let height = ((window.innerHeight > 0) ? window.innerHeight : screen.height) - 1;
            height = height - topOffset;
            if (height < 1) {
                height = 1;
            }
            if (height > topOffset) {
                $("#content").css("min-height", (height) + "px");
            }
        }

        private changeMenuIcon(e: JQueryEventObject) {
            let icon = $(e.target).closest("div[data-toggle='collapse']").find("i").first();
            icon.toggleClass("fa-plus-square-o fa-minus-square-o");
        }

        private initPagers() {
            let $pagers = $(".pagination-wrapper");
            if ($pagers.length == 0) {
                return;
            }

            let u = new Url(location.pathname + location.search);
            let jump = (pageIndex: string, pageSize?: string) => {
                u.setParam("pageIndex", pageIndex);
                pageSize && u.setParam("pageSize", pageSize);
                location.replace(u.toString());
            };
            $pagers.find("select").change(e => {
                jump("1", (<HTMLSelectElement>e.target).value);
            });
            $pagers.find("input").keydown(e => {
                e.keyCode == 13 && jump((<HTMLInputElement>e.target).value);
            });
            $pagers.find("nav>ul>li>a").each((i, dom) => {
                let page = $(dom).data("page");
                if (page) {
                    u.setParam("pageIndex", page);
                    (<HTMLLinkElement>dom).href = u.toString();
                }
            });
        }
    }

    $(_ => new Manager());
}