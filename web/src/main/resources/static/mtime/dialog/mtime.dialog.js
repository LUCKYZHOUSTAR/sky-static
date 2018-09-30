/*!
 * Mtime Dialog Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
var Mtime;
(function (Mtime) {
    var UI;
    (function (UI) {
        /**
         * DialogButton
         */
        var DialogButton = (function () {
            function DialogButton(text, callback, primary) {
                if (primary === void 0) { primary = false; }
                this.text = text;
                this.callback = callback;
                this.primary = primary;
            }
            DialogButton.primary = function (text, callback) {
                if (text === void 0) { text = "确定"; }
                return new DialogButton(text, callback, true);
            };
            DialogButton.cancel = function (text, callback) {
                if (text === void 0) { text = "取消"; }
                return new DialogButton(text, callback);
            };
            return DialogButton;
        }());
        UI.DialogButton = DialogButton;
        var Dialog = (function () {
            function Dialog(options) {
                this.id = $.now();
                this.options = $.extend({}, Dialog.defaultOptions, options);
                this.events = {};
                this.$elem = this.build();
                Dialog.dialogs[this.id] = this;
            }
            Dialog.prototype.fire = function (event) {
                var action = this.events[event];
                if (action)
                    action(this);
            };
            // 设置焦点到下一个对话框
            Dialog.prototype.moveFocus = function () {
                var last = null;
                $.each(Dialog.dialogs, function (id, dlg) {
                    last = dlg;
                });
                if (last !== null) {
                    last.$elem.focus();
                }
            };
            Dialog.prototype.find = function (selector) {
                if (typeof selector === "string") {
                    return this.$elem.find(selector);
                }
                else if (selector instanceof Element) {
                    return this.$elem.find(selector);
                }
                else {
                    return this.$elem.find(selector);
                }
            };
            Dialog.prototype.data = function (data) {
                if (data) {
                    this.options.data = data;
                    return this;
                }
                return this.options.data;
            };
            /**
             * 绑定事件
             *
             * @param {string} event
             * @param {(dlg: Dialog) => void} action
             * @returns {Dialog}
             */
            Dialog.prototype.on = function (event, action) {
                // show: triggered when dialog is shown
                // close: triggered when dialog is closed
                this.events[event] = action;
                return this;
            };
            /**
             * 创建对话框
             *
             * @static
             * @param {DialogOptions} options
             * @returns {Dialog}
             */
            Dialog.create = function (options) {
                if (!Dialog.factory) {
                    throw new Error("dialog factory isn't set");
                }
                return Dialog.factory.create(options);
            };
            /**
             * 显示对话框
             *
             * @static
             * @param {DialogOptions} options
             * @returns {Dialog}
             */
            Dialog.show = function (options) {
                return Dialog.create(options).show();
            };
            Dialog.alert = function (content, title, callback, options) {
                options = $.extend({}, options, {
                    title: title,
                    body: content,
                    closable: true,
                    buttons: [DialogButton.primary("确定", callback)]
                });
                return Dialog.show(options);
            };
            Dialog.confirm = function (content, title, callback, options) {
                options = $.extend({}, options, {
                    title: title,
                    body: content,
                    closable: true,
                    buttons: [DialogButton.primary("确定", callback), DialogButton.cancel()]
                });
                return Dialog.show(options);
            };
            return Dialog;
        }());
        // 静态属性与方法
        Dialog.defaultOptions = {
            title: "提示",
            body: "",
            buttons: [DialogButton.primary()],
            // width: 400,  // px
            clazz: '',
            backdrop: true,
            draggable: true,
            closable: true,
            countdown: 0,
            animate: true
        };
        Dialog.dialogs = {};
        UI.Dialog = Dialog;
    })(UI = Mtime.UI || (Mtime.UI = {}));
})(Mtime || (Mtime = {}));
window.$alert = Mtime.UI.Dialog.alert;
window.$confirm = Mtime.UI.Dialog.confirm;
//# sourceMappingURL=mtime.dialog.js.map