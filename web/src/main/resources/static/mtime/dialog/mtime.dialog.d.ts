declare namespace Mtime.UI {
    /**
     * DialogButton
     */
    class DialogButton {
        text?: string;
        primary?: boolean;
        clazz?: string;
        callback?: (dlg: Dialog) => void;
        icon?: string;
        constructor(text: string, callback?: (dlg: Dialog) => void, primary?: boolean);
        static primary(text?: string, callback?: (dlg: Dialog) => void): DialogButton;
        static cancel(text?: string, callback?: (dlg: Dialog) => void): DialogButton;
    }
    /**
     * 对话框工厂
     *
     * @export
     * @interface DialogFactory
     */
    interface DialogFactory {
        create(options?: DialogOptions): Dialog;
    }
    interface DialogOptions {
        title?: string;
        body?: string;
        buttons?: DialogButton[];
        width?: string | number;
        clazz?: string;
        backdrop?: boolean;
        draggable?: boolean;
        closable?: boolean;
        countdown?: number;
        animate?: boolean;
        data?: any;
    }
    abstract class Dialog {
        static factory: DialogFactory;
        private static defaultOptions;
        protected static dialogs: {
            [index: number]: Dialog;
        };
        protected id: number;
        protected options: DialogOptions;
        protected $elem: JQuery;
        protected events: {
            [index: string]: (dlg: Dialog) => void;
        };
        constructor(options: DialogOptions);
        protected fire(event: string): void;
        protected moveFocus(): void;
        protected abstract build(): JQuery;
        find(selector: string | Element | JQuery): JQuery;
        data(data?: any): any | Dialog;
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
        on(event: "show" | "close", action: (dlg: Dialog) => void): Dialog;
        /**
         * 创建对话框
         *
         * @static
         * @param {DialogOptions} options
         * @returns {Dialog}
         */
        static create(options: DialogOptions): Dialog;
        /**
         * 显示对话框
         *
         * @static
         * @param {DialogOptions} options
         * @returns {Dialog}
         */
        static show(options: DialogOptions): Dialog;
        static alert(content: string, title?: string, callback?: (dlg: Dialog) => void, options?: DialogOptions): Dialog;
        static confirm(content: string, title?: string, callback?: (dlg: Dialog) => void, options?: DialogOptions): Dialog;
    }
}
interface Window {
    $alert(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
    $confirm(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
}
declare function $alert(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
declare function $confirm(content: string, title?: string, callback?: (dlg: Mtime.UI.Dialog) => void, options?: Mtime.UI.DialogOptions): Mtime.UI.Dialog;
