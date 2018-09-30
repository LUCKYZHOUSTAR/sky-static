interface JQuery {
    modal(options: 'show' | 'hide' | 'toggle' | 'handleUpdate' | {
        backdrop?: boolean | 'static';
        keyboard?: boolean;
        show?: boolean;
    }): JQuery;
}
declare namespace Mtime.UI {
    /**
     * BootstrapDialogFactory
     */
    class BootstrapDialogFactory implements DialogFactory {
        create(options?: DialogOptions): Dialog;
    }
}
declare namespace Mtime.Util {
    class BootstrapValidationMarker implements ValidationMarker {
        setError($input: JQuery, errors: string[]): void;
        clearError($input: JQuery): void;
        reset($input: JQuery): void;
        private getGroup($input);
        private getParent($input);
    }
}
