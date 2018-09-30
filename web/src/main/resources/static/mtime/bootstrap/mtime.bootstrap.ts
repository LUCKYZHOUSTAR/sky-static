interface JQuery {
    modal(options: 'show' | 'hide' | 'toggle' | 'handleUpdate' | { backdrop?: boolean | 'static', keyboard?: boolean, show?: boolean }): JQuery;
}

// Dialog
namespace Mtime.UI {
    /**
     * BootstrapDialogFactory
     */
    export class BootstrapDialogFactory implements DialogFactory {
        create(options?: DialogOptions): Dialog {
            return new BootstrapDialog(options);
        }
    }

    /**
     * BootstrapDialog
     */
    class BootstrapDialog extends Dialog {
        private dragData = {
            dragging: false,
            offset: {}
        };

        constructor(options: DialogOptions) {
            super(options);
            this.handleEvents();
            this.makeDraggable();
            if (this.getDialogCount() == 1) {
                // fix multiple dialog padding issue
                $("body").data("dialog-padding", document.body.style.paddingRight || '');
            }
        }

        show(): Dialog {
            let options: { backdrop?: boolean | 'static', keyboard?: boolean, show?: boolean } = { keyboard: this.options.closable };
            options.backdrop = this.options.backdrop ? (this.options.closable ? true : 'static') : false;
            this.$elem.modal(options);
            this.updateIndex();
            return this;
        }

        close() {
            this.$elem.modal('hide');
        }

        error(error?: string): Dialog {
            if (error && error.length > 0) {
                this.find('.modal-error').html(error).show();
            } else {
                this.find('.modal-error').empty().hide();
            }
            return this;
        }

        title(title: string): Dialog {
            this.find('.modal-title').html(title);
            return this;
        }

        body(body: string): Dialog {
            this.find('.modal-body').html(arguments[0]);
            return this;
        }

        protected build(): JQuery {
            // let body: string;
            // if (typeof this.options.body === "Function") {
            //     body = this.options.body();
            // } else {
            // }
            let body = this.options.body;

            let $modal = $(`<div id="dialog-${this.id}" class="modal" role="dialog" tabindex="-1" aria-hidden="true" aria-labelledby="title-${this.id}"></div>`);
            let $dialog = $('<div class="modal-dialog"></div>');
            let $content = $('<div class="modal-content"></div>');
            let $header = $('<div class="modal-header"></div>');
            let $body = $('<div class="modal-body"></div>').append(body);
            let $footer = $('<div class="modal-footer"></div>');
            let $title = $(`<h4 id="title-${this.id}" class="modal-title">${this.options.title}</h4>`);
            let $error = $('<div class="modal-error" style="display:none"></div>');

            $modal.append($dialog);
            if (this.options.animate) $modal.addClass('fade');
            $dialog.append($content);
            if (this.options.clazz) $dialog.addClass(this.options.clazz);
            if (this.options.width) $dialog.css("width", this.options.width);
            $content.append($header, $body, $error, $footer);
            if (this.options.closable) {
                let $close = $('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                $header.append($close);
            }
            $header.append($title);

            // 倒计时
            if (this.options.countdown) {
                $(`<span class="modal-count pull-left">${this.options.countdown}</span>`).appendTo($footer);
            }

            // 按钮
            if (this.options.buttons) {
                this.options.buttons.forEach(btn => {
                    let $btn = $('<button type="button" class="btn"/>').addClass(btn.clazz || (btn.primary ? 'btn-primary' : 'btn-default'));
                    if (btn.icon) {
                        $(`<i class="${btn.icon}"></i>`).appendTo($btn);
                    }
                    $btn.append(btn.text).click(e => {
                        if (btn.callback) btn.callback.call(e.target, this);
                        else this.close();
                    });
                    $footer.append($btn);
                });
            }

            return $modal;
        }

        // 更新层级以更好的支持多对话框
        private updateIndex() {
            let zIndexBackdrop = 1040;
            let zIndexModal = 1050;
            let dialogCount = this.getDialogCount();
            let $modal = this.$elem;
            let $backdrop = $modal.data('bs.modal').$backdrop;
            $modal.css('z-index', zIndexModal + (dialogCount - 1) * 20);            
            $backdrop && $backdrop.css('z-index', zIndexBackdrop + (dialogCount - 1) * 20);
        }

        private getDialogCount(): number {
            let dialogCount = 0;
            $.each(Dialog.dialogs, function () {
                dialogCount++;
            });
            return dialogCount;
        }

        // 处理事件
        private handleEvents() {
            this.$elem.on('shown.bs.modal', () => {
                this.makeAutoClose();
                this.fire("show");
            });
            this.$elem.on('hidden.bs.modal', () => {
                this.fire("close");
                delete Dialog.dialogs[this.id];
                this.$elem.remove();
                this.moveFocus();
                if (this.getDialogCount() > 0) {
                    $("body").addClass("modal-open");
                } else {
                    // fix multiple dialog padding issue
                    $("body").css('padding-right', $("body").data("dialog-padding"));
                }
            });
        }

        // 处理自动关闭
        private makeAutoClose() {
            if (this.options.countdown > 0) {
                let seconds = this.options.countdown;
                let $count = this.find('.modal-count');
                let action = () => {
                    seconds--;
                    if (seconds > 0) {
                        $count.text(seconds);
                        setTimeout(action, 1000);
                    }
                    else this.close();
                };
                setTimeout(action, 1000);
            }
        }

        // 拖动处理
        private makeDraggable() {
            if (this.options.draggable) {
                let $header = this.find('.modal-header');
                let $dialog = this.find('.modal-dialog');
                $header.on('mousedown', { dialog: this }, function (e) {
                    $header.addClass('draggable');
                    let dialog = e.data.dialog;
                    dialog.dragData.dragging = true;
                    let dialogOffset = $dialog.offset();
                    dialog.dragData.offset = {
                        top: e.clientY - dialogOffset.top,
                        left: e.clientX - dialogOffset.left
                    };
                });
                this.$elem.on('mouseup mouseleave', { dialog: this }, function (e) {
                    $header.removeClass('draggable');
                    e.data.dialog.dragData.dragging = false;
                });
                $('body').on('mousemove', { dialog: this }, function (e) {
                    let dialog = e.data.dialog;
                    if (!dialog.dragData.dragging) {
                        return;
                    }
                    $dialog.offset({
                        top: e.clientY - dialog.dragData.offset.top,
                        left: e.clientX - dialog.dragData.offset.left
                    });
                });
            }
        }

    }
}

namespace Mtime.Util {
    export class BootstrapValidationMarker implements ValidationMarker {
        setError($input: JQuery, errors: string[]) {
            let $parent = this.getParent($input);

            let $error = $parent.find('ul.error-list');
            if (!$error.length) {
                $error = $('<ul/>').addClass('error-list').appendTo($parent);
            }
            $error.empty().append($.map(errors, function (error) { return $('<li/>').text(error) })).show();

            this.getGroup($input).removeClass('has-success').addClass('has-error');
            $parent.find('.help-block').hide();
            $parent.find('.form-control-feedback').removeClass("glyphicon-ok").addClass("glyphicon-remove");

        }

        clearError($input: JQuery) {
            let $parent = this.getParent($input);

            let $error = $parent.find('ul.error-list');
            if (!$error.length || $error.is(":hidden")) {
                return;
            }
            $error.empty().hide();

            this.getGroup($input).removeClass('has-error').addClass('has-success');
            $parent.find('.help-block').show();
            $parent.find('.form-control-feedback').removeClass("glyphicon-remove").addClass("glyphicon-ok");
        }

        reset($input: JQuery): void {
            let $parent = this.getParent($input);

            $parent.find('ul.error-list').empty().hide();
            $parent.find('.help-block').show();
            this.getGroup($input).removeClass('has-error').removeClass('has-success');
            $parent.find('.form-control-feedback').removeClass("glyphicon-remove").removeClass("glyphicon-ok");
        }

        private getGroup($input: JQuery): JQuery {
            let $group = $input.closest('.control-group');
            if ($group.length == 0) {
                $group = $input.closest('.form-group');
            }
            return $group;
        }

        private getParent($input: JQuery): JQuery {
            let $parent = $input.parent();
            if ($parent.is("label")) {
                // radio & checkbox
                $parent = $parent.parent();
            }
            if ($parent.is(".input-group")) {
                // radio & checkbox
                $parent = $parent.parent();
            }
            return $parent;
        }
    }
}

/**
 * 初始化 Bootstrap 相关组件
 */
$(() => {
    // Dialog
    Mtime.UI.Dialog.factory = new Mtime.UI.BootstrapDialogFactory();

    // AJAX
    Mtime.Net.AjaxRequest.preHandler = options => {
        options.trigger && $(options.trigger).data("loading-text", '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>').button("loading");
    };
    Mtime.Net.AjaxRequest.postHandler = options => {
        options.trigger && $(options.trigger).button("reset");
    };

    // Validator
    Mtime.Util.Validator.setMarker(new Mtime.Util.BootstrapValidationMarker());
});
