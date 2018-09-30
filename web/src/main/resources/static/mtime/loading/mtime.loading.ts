/*!
 * Mtime Loading Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
namespace Mtime.UI {
    /**
     * 加载组件设置
     */
    export class LoadingOptions {
        // zIndex: number = 9999;
        maskColor?: string = "black";
        spinner?: string = "spinner1";
    }

    class Region {
        top: number;
        left: number;
        width: number;
        height: number;
    }

    /**
     * 加载组件
     */
    export class Loading {
        private static themes = {
            spinner1: '<div class="spinner1"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>',
            spinner2: '<div class="spinner2"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>',
            spinner3: '<div class="spinner3"><div class="dot1"></div><div class="dot2"></div></div>',
            spinner4: '<div class="spinner4"></div>',
            spinner5: '<div class="spinner5"><div class="cube1"></div><div class="cube2"></div></div>',
            spinner6: '<div class="spinner6"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
            spinner7: '<div class="spinner7"><div class="circ1"></div><div class="circ2"></div><div class="circ3"></div><div class="circ4"></div></div>'
        };
        private target: JQuery;
        private options: LoadingOptions;
        private resizeHandler: any;

        constructor(target: String | Element | JQuery, options?: LoadingOptions) {
            this.target = $(target);
            this.options = $.extend(new LoadingOptions(), options);
        }

        static show(target: String | Element | JQuery, options?: LoadingOptions): Loading {
            let loading = new Loading(target, options);
            loading.show();
            return loading;
        }

        show() {
            this.target.each((index: number, elem: Element) => {
                let $elem = $(elem);
                if (!$elem.data("loading")) {
                    let mask = this.createMask($elem);
                    $elem.data("loading", mask);
                    this.bindEvent();
                }
            });
        }

        hide() {
            this.target.each((index: number, elem: Element) => {
                let $elem = $(elem);
                if ($elem.data("loading")) {
                    $elem.data("loading").remove();
                    $elem.removeData("loading");
                    this.unbindEvent();
                }
            });
        }

        toggle() {
            this.target.each((index: number, elem: Element) => {
                let $elem = $(elem);
                if ($elem.data("loading")) {
                    $elem.data("loading").remove();
                    $elem.removeData("loading");
                    this.unbindEvent();
                } else {
                    let mask = this.createMask($elem);
                    $elem.data("loading", mask);
                    this.bindEvent();
                }
            });
        }

        private createMask($elem: JQuery): JQuery {
            let mask = $('<div class="spinner"></div>');
            let region = Loading.getRegion($elem);
            let styles = $.extend({
                'backgroundColor': this.options.maskColor,
                // 'zIndex': this.options.zIndex,
                'position': this.target.is("body") ? "fixed" : "absolute",
            }, region);
            mask.css(styles);
            mask.html(Loading.themes[this.options.spinner]);
            return mask.appendTo($elem.parent());
        }

        private bindEvent() {
            this.resizeHandler = this.handleResize.bind(this);
            $(window).bind("resize", this.resizeHandler);
        }

        private unbindEvent() {
            if (this.resizeHandler) {
                $(window).unbind("resize", this.resizeHandler);
                this.resizeHandler = null;
            }
        }

        private handleResize(e: JQueryEventObject) {
            // console.info("resize");
            let mask = <JQuery>this.target.data("loading");
            if (mask) {
                let region = Loading.getRegion(this.target);
                mask.css(region);
            }
        }

        private static getRegion($elem: JQuery): Region {
            let pos = $elem.position();
            let region = new Region();
            region.top = pos.top;
            region.left = pos.left;
            if ($elem.is("body")) {
                region.width = window.innerWidth;
                region.height = window.innerHeight;
            } else {
                region.width = $elem.outerWidth();
                region.height = $elem.outerHeight();
            }
            return region;
        }
    }
}