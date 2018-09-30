var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Dialog
var Mtime;
(function (Mtime) {
    var UI;
    (function (UI) {
        /**
         * BootstrapDialogFactory
         */
        var BootstrapDialogFactory = (function () {
            function BootstrapDialogFactory() {
            }
            BootstrapDialogFactory.prototype.create = function (options) {
                return new BootstrapDialog(options);
            };
            return BootstrapDialogFactory;
        }());
        UI.BootstrapDialogFactory = BootstrapDialogFactory;
        /**
         * BootstrapDialog
         */
        var BootstrapDialog = (function (_super) {
            __extends(BootstrapDialog, _super);
            function BootstrapDialog(options) {
                var _this = _super.call(this, options) || this;
                _this.dragData = {
                    dragging: false,
                    offset: {}
                };
                _this.handleEvents();
                _this.makeDraggable();
                if (_this.getDialogCount() == 1) {
                    // fix multiple dialog padding issue
                    $("body").data("dialog-padding", document.body.style.paddingRight || '');
                }
                return _this;
            }
            BootstrapDialog.prototype.show = function () {
                var options = { keyboard: this.options.closable };
                options.backdrop = this.options.backdrop ? (this.options.closable ? true : 'static') : false;
                this.$elem.modal(options);
                this.updateIndex();
                return this;
            };
            BootstrapDialog.prototype.close = function () {
                this.$elem.modal('hide');
            };
            BootstrapDialog.prototype.error = function (error) {
                if (error && error.length > 0) {
                    this.find('.modal-error').html(error).show();
                }
                else {
                    this.find('.modal-error').empty().hide();
                }
                return this;
            };
            BootstrapDialog.prototype.title = function (title) {
                this.find('.modal-title').html(title);
                return this;
            };
            BootstrapDialog.prototype.body = function (body) {
                this.find('.modal-body').html(arguments[0]);
                return this;
            };
            BootstrapDialog.prototype.build = function () {
                var _this = this;
                // let body: string;
                // if (typeof this.options.body === "Function") {
                //     body = this.options.body();
                // } else {
                // }
                var body = this.options.body;
                var $modal = $("<div id=\"dialog-" + this.id + "\" class=\"modal\" role=\"dialog\" tabindex=\"-1\" aria-hidden=\"true\" aria-labelledby=\"title-" + this.id + "\"></div>");
                var $dialog = $('<div class="modal-dialog"></div>');
                var $content = $('<div class="modal-content"></div>');
                var $header = $('<div class="modal-header"></div>');
                var $body = $('<div class="modal-body"></div>').append(body);
                var $footer = $('<div class="modal-footer"></div>');
                var $title = $("<h4 id=\"title-" + this.id + "\" class=\"modal-title\">" + this.options.title + "</h4>");
                var $error = $('<div class="modal-error" style="display:none"></div>');
                $modal.append($dialog);
                if (this.options.animate)
                    $modal.addClass('fade');
                $dialog.append($content);
                if (this.options.clazz)
                    $dialog.addClass(this.options.clazz);
                if (this.options.width)
                    $dialog.css("width", this.options.width);
                $content.append($header, $body, $error, $footer);
                if (this.options.closable) {
                    var $close = $('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    $header.append($close);
                }
                $header.append($title);
                // 倒计时
                if (this.options.countdown) {
                    $("<span class=\"modal-count pull-left\">" + this.options.countdown + "</span>").appendTo($footer);
                }
                // 按钮
                if (this.options.buttons) {
                    this.options.buttons.forEach(function (btn) {
                        var $btn = $('<button type="button" class="btn"/>').addClass(btn.clazz || (btn.primary ? 'btn-primary' : 'btn-default'));
                        if (btn.icon) {
                            $("<i class=\"" + btn.icon + "\"></i>").appendTo($btn);
                        }
                        $btn.append(btn.text).click(function (e) {
                            if (btn.callback)
                                btn.callback.call(e.target, _this);
                            else
                                _this.close();
                        });
                        $footer.append($btn);
                    });
                }
                return $modal;
            };
            // 更新层级以更好的支持多对话框
            BootstrapDialog.prototype.updateIndex = function () {
                var zIndexBackdrop = 1040;
                var zIndexModal = 1050;
                var dialogCount = this.getDialogCount();
                var $modal = this.$elem;
                var $backdrop = $modal.data('bs.modal').$backdrop;
                $modal.css('z-index', zIndexModal + (dialogCount - 1) * 20);
                $backdrop && $backdrop.css('z-index', zIndexBackdrop + (dialogCount - 1) * 20);
            };
            BootstrapDialog.prototype.getDialogCount = function () {
                var dialogCount = 0;
                $.each(UI.Dialog.dialogs, function () {
                    dialogCount++;
                });
                return dialogCount;
            };
            // 处理事件
            BootstrapDialog.prototype.handleEvents = function () {
                var _this = this;
                this.$elem.on('shown.bs.modal', function () {
                    _this.makeAutoClose();
                    _this.fire("show");
                });
                this.$elem.on('hidden.bs.modal', function () {
                    _this.fire("close");
                    delete UI.Dialog.dialogs[_this.id];
                    _this.$elem.remove();
                    _this.moveFocus();
                    if (_this.getDialogCount() > 0) {
                        $("body").addClass("modal-open");
                    }
                    else {
                        // fix multiple dialog padding issue
                        $("body").css('padding-right', $("body").data("dialog-padding"));
                    }
                });
            };
            // 处理自动关闭
            BootstrapDialog.prototype.makeAutoClose = function () {
                var _this = this;
                if (this.options.countdown > 0) {
                    var seconds_1 = this.options.countdown;
                    var $count_1 = this.find('.modal-count');
                    var action_1 = function () {
                        seconds_1--;
                        if (seconds_1 > 0) {
                            $count_1.text(seconds_1);
                            setTimeout(action_1, 1000);
                        }
                        else
                            _this.close();
                    };
                    setTimeout(action_1, 1000);
                }
            };
            // 拖动处理
            BootstrapDialog.prototype.makeDraggable = function () {
                if (this.options.draggable) {
                    var $header_1 = this.find('.modal-header');
                    var $dialog_1 = this.find('.modal-dialog');
                    $header_1.on('mousedown', { dialog: this }, function (e) {
                        $header_1.addClass('draggable');
                        var dialog = e.data.dialog;
                        dialog.dragData.dragging = true;
                        var dialogOffset = $dialog_1.offset();
                        dialog.dragData.offset = {
                            top: e.clientY - dialogOffset.top,
                            left: e.clientX - dialogOffset.left
                        };
                    });
                    this.$elem.on('mouseup mouseleave', { dialog: this }, function (e) {
                        $header_1.removeClass('draggable');
                        e.data.dialog.dragData.dragging = false;
                    });
                    $('body').on('mousemove', { dialog: this }, function (e) {
                        var dialog = e.data.dialog;
                        if (!dialog.dragData.dragging) {
                            return;
                        }
                        $dialog_1.offset({
                            top: e.clientY - dialog.dragData.offset.top,
                            left: e.clientX - dialog.dragData.offset.left
                        });
                    });
                }
            };
            return BootstrapDialog;
        }(UI.Dialog));
    })(UI = Mtime.UI || (Mtime.UI = {}));
})(Mtime || (Mtime = {}));
(function (Mtime) {
    var Util;
    (function (Util) {
        var BootstrapValidationMarker = (function () {
            function BootstrapValidationMarker() {
            }
            BootstrapValidationMarker.prototype.setError = function ($input, errors) {
                var $parent = this.getParent($input);
                var $error = $parent.find('ul.error-list');
                if (!$error.length) {
                    $error = $('<ul/>').addClass('error-list').appendTo($parent);
                }
                $error.empty().append($.map(errors, function (error) { return $('<li/>').text(error); })).show();
                this.getGroup($input).removeClass('has-success').addClass('has-error');
                $parent.find('.help-block').hide();
                $parent.find('.form-control-feedback').removeClass("glyphicon-ok").addClass("glyphicon-remove");
            };
            BootstrapValidationMarker.prototype.clearError = function ($input) {
                var $parent = this.getParent($input);
                var $error = $parent.find('ul.error-list');
                if (!$error.length || $error.is(":hidden")) {
                    return;
                }
                $error.empty().hide();
                this.getGroup($input).removeClass('has-error').addClass('has-success');
                $parent.find('.help-block').show();
                $parent.find('.form-control-feedback').removeClass("glyphicon-remove").addClass("glyphicon-ok");
            };
            BootstrapValidationMarker.prototype.reset = function ($input) {
                var $parent = this.getParent($input);
                $parent.find('ul.error-list').empty().hide();
                $parent.find('.help-block').show();
                this.getGroup($input).removeClass('has-error').removeClass('has-success');
                $parent.find('.form-control-feedback').removeClass("glyphicon-remove").removeClass("glyphicon-ok");
            };
            BootstrapValidationMarker.prototype.getGroup = function ($input) {
                var $group = $input.closest('.control-group');
                if ($group.length == 0) {
                    $group = $input.closest('.form-group');
                }
                return $group;
            };
            BootstrapValidationMarker.prototype.getParent = function ($input) {
                var $parent = $input.parent();
                if ($parent.is("label")) {
                    // radio & checkbox
                    $parent = $parent.parent();
                }
                if ($parent.is(".input-group")) {
                    // radio & checkbox
                    $parent = $parent.parent();
                }
                return $parent;
            };
            return BootstrapValidationMarker;
        }());
        Util.BootstrapValidationMarker = BootstrapValidationMarker;
    })(Util = Mtime.Util || (Mtime.Util = {}));
})(Mtime || (Mtime = {}));
/**
 * 初始化 Bootstrap 相关组件
 */
$(function () {
    // Dialog
    Mtime.UI.Dialog.factory = new Mtime.UI.BootstrapDialogFactory();
    // AJAX
    Mtime.Net.AjaxRequest.preHandler = function (options) {
        options.trigger && $(options.trigger).data("loading-text", '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>').button("loading");
    };
    Mtime.Net.AjaxRequest.postHandler = function (options) {
        options.trigger && $(options.trigger).button("reset");
    };
    // Validator
    Mtime.Util.Validator.setMarker(new Mtime.Util.BootstrapValidationMarker());
});
//# sourceMappingURL=mtime.bootstrap.js.map