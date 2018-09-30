/*!
 * Mtime Dialog Library v1.0.0
 * Copyright 2016 Mtime Inc. All rights reserved.
 *
 * @author guohua.cui(guohua.cui@mtime.com)
 */
namespace Mtime.UI {
    /**
     * DialogButton
     */
    export class DialogButton {
        text?: string;
        primary?: boolean;
        clazz?: string;
        callback?: (dlg: Dialog) => void;
        icon?: string;

        constructor(text: string, callback?: (dlg: Dialog) => void, primary: boolean = false) {
            this.text = text;
            this.callback = callback;
            this.primary = primary;
        }

        static primary(text: string = "确定", callback?: (dlg: Dialog) => void): DialogButton {
            return new DialogButton(text, callback, true);
        }

        static cancel(text: string = "取消", callback?: (dlg: Dialog) => void): DialogButton {
            return new DialogButton(text, callback);
        }
    }

    /**
     * 对话框工厂
     *
     * @export
     * @interface DialogFactory
     */
    export interface DialogFactory {
        create(options?: DialogOptions): Dialog;
    }

    export interface DialogOptions {
        title?: string
        body?: string;
        buttons?: DialogButton[];
        width?: string | number;  // 如果为整数, 则单位为 px
        clazz?: string;
        backdrop?: boolean;
        draggable?: boolean;
        closable?: boolean;
        countdown?: number;   // 自动关闭倒计时(秒)
        animate?: boolean;
        data?: any;
    }

    export abstract class Dialog {
        static factory: DialogFactory;

        // 静态属性与方法
        private static defaultOptions: DialogOptions = {
            title: "提示",
            body: "",
            buttons: [DialogButton.primary()],
            // width: 400,  // px
            clazz: '',
            backdrop: true,
            draggable: true,
            closable: true,
            countdown: 0,   // 自动关闭倒计时(秒)
            animate: true
        };
        protected static dialogs: {[index: number]: Dialog} = {};
        protected id: number;
        protected options: DialogOptions;
        protected $elem: JQuery;
        protected events: {[index: string]: (dlg: Dialog) => void};

        constructor(options: DialogOptions) {
            this.id = $.now();
            this.options = $.extend({}, Dialog.defaultOptions, options);
            this.events = {};
            this.$elem = this.build();
            Dialog.dialogs[this.id] = this;
        }

        protected fire(event: string) {
            var action = this.events[event];
            if (action) action(this);
        }

        // 设置焦点到下一个对话框
        protected moveFocus() {
            let last: Dialog = null;
            $.each(Dialog.dialogs, (id, dlg) => {
                last = dlg;
            });
            if (last !== null) {
                last.$elem.focus();
            }
        }

        // 创建对话框
        protected abstract build(): JQuery;

        find(selector: string | Element | JQuery): JQuery {
            if (typeof selector === "string") {
                return this.$elem.find(selector);
            } else if (selector instanceof Element) {
                return this.$elem.find(selector);
            } else {
                return this.$elem.find(selector);
            }
        }

        data(data?: any): any | Dialog {
            if (data) {
                this.options.data = data;
                return this;
            }
            return this.options.data;
        }

        abstract show(): Dialog;

        abstract close(): void;

        abstract error(error?: string): Dialog;

        abstract title(title: string): Dialog;

        abstract body(body: string): Dialog;

        /**
         * 绑定事件
         *
         * @param {string} event
         * @param {(dlg: Dialog) => void} action
         * @returns {Dialog}
         */
        on(event: "show" | "close", action: (dlg: Dialog) => void): Dialog {
            // show: triggered when dialog is shown
            // close: triggered when dialog is closed
            this.events[event] = action;
            return this;
        }

        /**
         * 创建对话框
         *
         * @static
         * @param {DialogOptions} options
         * @returns {Dialog}
         */
        static create(options: DialogOptions): Dialog {
            if (!Dialog.factory) {
                throw new Error("dialog factory isn't set")
            }
            return Dialog.factory.create(options);
        }

        /**
         * 显示对话框
         *
         * @static
         * @param {DialogOptions} options
         * @returns {Dialog}
         */
        static show(options: DialogOptions): Dialog {
            return Dialog.create(options).show();
        }

        static alert(content: string, title?: string, callback?: (dlg: Dialog) => void, options?: DialogOptions): Dialog {
            options = $.extend({}, options, {
                title: title,
                body: content,
                closable: true,
                buttons: [DialogButton.primary("确定", callback)]
            });
            return Dialog.show(options);
        }

        static confirm(content: string, title?: string, callback?: (dlg: Dialog) => void, options?: DialogOptions): Dialog {
            options = $.extend({}, options,{
                title: title,
                body: content,
                closable: true,
                buttons: [DialogButton.primary("确定", callback), DialogButton.cancel()]
            });
            return Dialog.show(options);
        }
    }
}

interface Window {
    $alert(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
    $confirm(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
}
window.$alert = Mtime.UI.Dialog.alert;
window.$confirm = Mtime.UI.Dialog.confirm;
declare function $alert(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
declare function $confirm(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;