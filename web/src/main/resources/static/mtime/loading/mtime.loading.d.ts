declare namespace Mtime.UI {
    /**
     * 加载组件设置
     */
    class LoadingOptions {
        maskColor?: string;
        spinner?: string;
    }
    /**
     * 加载组件
     */
    class Loading {
        private static themes;
        private target;
        private options;
        private resizeHandler;
        constructor(target: String | Element | JQuery, options?: LoadingOptions);
        static show(target: String | Element | JQuery, options?: LoadingOptions): Loading;
        show(): void;
        hide(): void;
        toggle(): void;
        private createMask($elem);
        private bindEvent();
        private unbindEvent();
        private handleResize(e);
        private static getRegion($elem);
    }
}
