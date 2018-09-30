/*!
 * Mtime Loading Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
var Mtime;
(function (Mtime) {
    var UI;
    (function (UI) {
        /**
         * 加载组件设置
         */
        var LoadingOptions = (function () {
            function LoadingOptions() {
                // zIndex: number = 9999;
                this.maskColor = "black";
                this.spinner = "spinner1";
            }
            return LoadingOptions;
        }());
        UI.LoadingOptions = LoadingOptions;
        var Region = (function () {
            function Region() {
            }
            return Region;
        }());
        /**
         * 加载组件
         */
        var Loading = (function () {
            function Loading(target, options) {
                this.target = $(target);
                this.options = $.extend(new LoadingOptions(), options);
            }
            Loading.show = function (target, options) {
                var loading = new Loading(target, options);
                loading.show();
                return loading;
            };
            Loading.prototype.show = function () {
                var _this = this;
                this.target.each(function (index, elem) {
                    var $elem = $(elem);
                    if (!$elem.data("loading")) {
                        var mask = _this.createMask($elem);
                        $elem.data("loading", mask);
                        _this.bindEvent();
                    }
                });
            };
            Loading.prototype.hide = function () {
                var _this = this;
                this.target.each(function (index, elem) {
                    var $elem = $(elem);
                    if ($elem.data("loading")) {
                        $elem.data("loading").remove();
                        $elem.removeData("loading");
                        _this.unbindEvent();
                    }
                });
            };
            Loading.prototype.toggle = function () {
                var _this = this;
                this.target.each(function (index, elem) {
                    var $elem = $(elem);
                    if ($elem.data("loading")) {
                        $elem.data("loading").remove();
                        $elem.removeData("loading");
                        _this.unbindEvent();
                    }
                    else {
                        var mask = _this.createMask($elem);
                        $elem.data("loading", mask);
                        _this.bindEvent();
                    }
                });
            };
            Loading.prototype.createMask = function ($elem) {
                var mask = $('<div class="spinner"></div>');
                var region = Loading.getRegion($elem);
                var styles = $.extend({
                    'backgroundColor': this.options.maskColor,
                    // 'zIndex': this.options.zIndex,
                    'position': this.target.is("body") ? "fixed" : "absolute",
                }, region);
                mask.css(styles);
                mask.html(Loading.themes[this.options.spinner]);
                return mask.appendTo($elem.parent());
            };
            Loading.prototype.bindEvent = function () {
                this.resizeHandler = this.handleResize.bind(this);
                $(window).bind("resize", this.resizeHandler);
            };
            Loading.prototype.unbindEvent = function () {
                if (this.resizeHandler) {
                    $(window).unbind("resize", this.resizeHandler);
                    this.resizeHandler = null;
                }
            };
            Loading.prototype.handleResize = function (e) {
                // console.info("resize");
                var mask = this.target.data("loading");
                if (mask) {
                    var region = Loading.getRegion(this.target);
                    mask.css(region);
                }
            };
            Loading.getRegion = function ($elem) {
                var pos = $elem.position();
                var region = new Region();
                region.top = pos.top;
                region.left = pos.left;
                if ($elem.is("body")) {
                    region.width = window.innerWidth;
                    region.height = window.innerHeight;
                }
                else {
                    region.width = $elem.outerWidth();
                    region.height = $elem.outerHeight();
                }
                return region;
            };
            return Loading;
        }());
        Loading.themes = {
            spinner1: '<div class="spinner1"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>',
            spinner2: '<div class="spinner2"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>',
            spinner3: '<div class="spinner3"><div class="dot1"></div><div class="dot2"></div></div>',
            spinner4: '<div class="spinner4"></div>',
            spinner5: '<div class="spinner5"><div class="cube1"></div><div class="cube2"></div></div>',
            spinner6: '<div class="spinner6"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
            spinner7: '<div class="spinner7"><div class="circ1"></div><div class="circ2"></div><div class="circ3"></div><div class="circ4"></div></div>'
        };
        UI.Loading = Loading;
    })(UI = Mtime.UI || (Mtime.UI = {}));
})(Mtime || (Mtime = {}));
//# sourceMappingURL=mtime.loading.js.map