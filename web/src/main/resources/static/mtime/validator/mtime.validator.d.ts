declare namespace Mtime.Util {
    /**
     * 输入控件验证结果
     *
     * @interface ValidationResult
     */
    interface ValidationResult {
        input: JQuery;
        errors: string[];
    }
    interface ValidationRule {
        validate($form: JQuery, $input: JQuery, arg?: string): {
            ok: boolean;
            error?: string;
        };
    }
    interface ValidationMarker {
        setError($input: JQuery, errors: string[]): void;
        clearError($input: JQuery): void;
        reset($input: JQuery): void;
    }
    interface ValidatorOptions {
    }
    class Validator {
        private static selector;
        private static marker;
        private static messages;
        private static rules;
        private form;
        private options;
        /**
         * Creates an instance of Validator.
         *
         * @param {(string | HTMLElement | JQuery)} elem 验证表单或其它容器元素
         * @param {*} [options] 选项
         *
         * @memberOf Validator
         */
        private constructor(elem, options?);
        private checkValue(e);
        /**
         * 创建验证器并绑定到表单
         *
         * @static
         * @param {(string | HTMLElement | JQuery)} elem 验证表单或其它容器元素
         * @param {ValidatorOptions} [options]
         * @returns {Validator} 选项
         *
         * @memberOf Validator
         */
        static bind(elem: string | HTMLElement | JQuery, options?: ValidatorOptions): Validator;
        /**
         * 验证表单
         *
         * @returns {ValidationResult[]}
         */
        validate(): ValidationResult[];
        /**
         * 清除验证标识
         */
        reset(): void;
        /**
         * 注册验证器
         *
         * @static
         * @param {string} name 验证器名称
         * @param {ValidationRule} rule 验证方法
         * @param {string} msg 验证消息
         *
         * @memberOf Validator
         */
        static register(name: string, rule: ValidationRule, msg: string): void;
        /**
         * 设置验证消息
         */
        static setMessage(name: string, msg: string): void;
        /**
         * 设置错误标识处理器
         */
        static setMarker(marker: ValidationMarker): void;
        private validateInput($input);
        private static mark($input, result);
        private static getMessge($input, rule);
    }
}
