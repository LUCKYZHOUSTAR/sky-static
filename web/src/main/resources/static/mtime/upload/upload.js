/**
 * Created by Sun Wang on 2016/1/25.
 *
 * 依赖：../fileupload/css/fileinput.css
 *      ../fileupload/js/fileinput.js
 */

(function(w, d, $, u) {

    var plugin = {
        name: "upload",
        version: "1.0-SNAPSHOT"
    }

    if(!( $ = w[$] )) throw plugin.name + " requires jQuery library"

    $.fn.fileinputLocales['zh'] = {
        fileSingle: '文件',
        filePlural: '多个文件',
        browseLabel: '选择 &hellip;',
        removeLabel: '移除',
        removeTitle: '清除选中文件',
        cancelLabel: '取消',
        cancelTitle: '取消进行中的上传',
        uploadLabel: '上传',
        uploadTitle: '上传选中文件',
        msgZoomTitle: '查看详情',
        msgZoomModalHeading: '详细预览',
        msgSizeTooLarge: '文件 "{name}" (<b>{size} KB</b>) 超过了允许大小 <b>{maxSize} KB</b>.',
        msgFilesTooLess: '你必须选择最少 <b>{n}</b> {files} 来上传. ',
        msgFilesTooMany: '选择的上传文件个数 <b>({n})</b> 超出最大文件的限制个数 <b>{m}</b>.',
        msgFileNotFound: '文件 "{name}" 未找到!',
        msgFileSecured: '安全限制，为了防止读取文件 "{name}".',
        msgFileNotReadable: '文件 "{name}" 不可读.',
        msgFilePreviewAborted: '取消 "{name}" 的预览.',
        msgFilePreviewError: '读取 "{name}" 时出现了一个错误.',
        msgInvalidFileType: '不正确的类型 "{name}". 只支持 "{types}" 类型的文件.',
        msgInvalidFileExtension: '不正确的文件扩展名 "{name}". 只支持 "{extensions}" 的文件扩展名.',
        msgUploadAborted: '该文件上传被中止',
        msgValidationError: '文件上传错误',
        msgLoading: '加载第 {index} 文件 共 {files} &hellip;',
        msgProgress: '加载第 {index} 文件 共 {files} - {name} - {percent}% 完成.',
        msgSelected: '{n} {files} 选中',
        msgFoldersNotAllowed: '只支持拖拽文件! 跳过 {n} 拖拽的文件夹.',
        msgImageWidthSmall: '宽度的图像文件的"{name}"的必须是至少{size}像素.',
        msgImageHeightSmall: '图像文件的"{name}"的高度必须至少为{size}像素.',
        msgImageWidthLarge: '宽度的图像文件"{name}"不能超过{size}像素.',
        msgImageHeightLarge: '图像文件"{name}"的高度不能超过{size}像素.',
        msgImageResizeError: '无法获取的图像尺寸调整。',
        msgImageResizeException: '错误而调整图像大小。<pre>{errors}</pre>',
        dropZoneTitle: '拖拽文件到这里 &hellip;',
        fileActionSettings: {
            removeTitle: '删除文件',
            uploadTitle: '上传文件',
            indicatorNewTitle: '没有上传',
            indicatorSuccessTitle: '上传',
            indicatorErrorTitle: '上传错误',
            indicatorLoadingTitle: '上传 ...'
        }
    };

    // 固定配置项
    var fix = {
        defaultFileTypeSettings: {
            html: false,
            text: false,
            video: false,
            audio: false,
            flash: false,
            object: false,
            other: true
        }
        , fileActionSettings: {
            removeTitle: '删除文件',
            uploadTitle: '上传文件',
            indicatorNewTitle: '文件尚未上传',
            indicatorSuccessTitle: '已上传',
            indicatorErrorTitle: '上传出错',
            indicatorLoadingTitle: '正在上传 ...'
        }
        , fileTypeSettings: {   // 除了图片外，其他文件使用图标，不需要预览
            html: function() {return false;},
            text: function() {return false;},
            video: function() {return false;},
            audio: function() {return false;},
            flash: function() {return false;},
            object: function() {return false;},
            other: true
        }
        , previewFileIcon: "<i class='glyphicon glyphicon-file'></i>"   // 指定文件图标
        , initialPreviewTemplate: {
            editable: {
                image: '<img id="{id}" src="{imageUrl}" class="file-preview-image" title="{filename}" alt="{filename}" mx="init">\
                        <div class="file-thumbnail-footer">\
                            <div class="file-footer-caption" title="{filename}">{filename}</div>\
                            <div class="file-actions">\
                                <div class="file-footer-buttons">\
                                    <button type="button" class="kv-file-remove btn btn-xs btn-default" title="{removeTitle}" for="{id}">\
                                        <i class="glyphicon glyphicon-trash text-danger"></i>\
                                    </button>\
                                </div>\
                                <div class="file-upload-indicator" title="{indicatorSuccessTitle}">\
                                    <i class="glyphicon glyphicon-ok-sign text-success"></i>\
                                </div>\
                                <div class="clearfix"></div>\
                            </div>\
                        </div>',
                other: '<div  id="{id}" class="file-preview-other-frame" mx="init">\
                            <div class="file-preview-other">\
                                <span class="file-icon-4x"><i class="glyphicon glyphicon-file"></i></span>\
                            </div>\
                        </div>\
                        <div class="file-preview-other-footer"><div class="file-thumbnail-footer">\
                            <div class="file-footer-caption" title="{filename}">{filename}</div>\
                                <div class="file-actions">\
                                    <div class="file-footer-buttons">\
                                        <button type="button" class="kv-file-remove btn btn-xs btn-default" title="{removeTitle}" for="{id}">\
                                            <i class="glyphicon glyphicon-trash text-danger"></i>\
                                        </button>\
                                    </div>\
                                    <div class="file-upload-indicator" title="{indicatorSuccessTitle}">\
                                        <i class="glyphicon glyphicon-ok-sign text-success"></i>\
                                    </div>\
                                    <div class="clearfix"></div>\
                                </div>\
                            </div>\
                        </div>'
            },
            detail: {
                image: '<img id="{id}" src="{imageUrl}" class="file-preview-image" title="{filename}" alt="{filename}" mx="init">\
                        <div class="file-thumbnail-footer">\
                            <div class="file-footer-caption" title="{filename}">{filename}</div>\
                        </div>',
                other: '<div id="{id}" class="file-preview-other-frame" mx="init">\
                            <div class="file-preview-other">\
                                <span class="file-icon-4x"><i class="glyphicon glyphicon-file"></i></span>\
                            </div>\
                        </div>\
                        <div class="file-preview-other-footer"><div class="file-thumbnail-footer">\
                            <div class="file-footer-caption" title="{filename}">{filename}</div>\
                        </div>'
            }
        }
        , dropZoneEnabled: false
    }

    var global = {
            language: "zh"
            , uploadUrl: "" //通用的上传地址
        },
        ext = {
            bucket: ""      // 模块标识
            , editable: true  //可编辑模式
            , initValue: "" //初始数据：object或object数组，
            , multi: false  //是否允许多选
            , showInitialPreviewItem: function(obj) {   //返回一个json，{id:"", imageUrl:"", filename:""}，将已有数据对象转为指定格式的对象
                return obj;
            }
        }



    $.fn[plugin.name] = function(options) {
        if( options && !$.isPlainObject(options) ) return $.fn.fileinput.apply( this, arguments );
        // 初始化
        this.each(function() {
            var $this = $(this),
                data = $this.data()
            options = $.extend(true, {}, global, ext, options, data, fix) //合并配置项
            //模式
            var readonly = !options.editable,
                tmplType = readonly ? "detail" : "editable"
            //额外参数设置
            options.uploadExtraData = options.uploadExtraData || {}
            if(options.bucket) options.uploadExtraData.bucket = options.bucket
            //初始数据
            if(options.initValue) {
                options.initValue = typeof options.initValue === "string" ? eval("(" + options.initValue + ")") : options.initValue
                if(!$.isArray(options.initValue)) options.initValue = [options.initValue]
                options.initialPreview = options.initialPreview || []
                for(var i = 0; i < options.initValue.length; i++) {
                    var data = options.showInitialPreviewItem.call( $this, options.initValue[i] ),
                        tmplView = data.imageUrl ? "image" : "other",
                        tmpl = options.initialPreviewTemplate[tmplType][tmplView]
                    tmpl = tmpl.replace(/\{id\}/g, data.id)
                        .replace(/\{imageUrl\}/g, data.imageUrl)
                        .replace(/\{filename\}/g, data.filename)
                        .replace(/\{removeTitle\}/g, options.fileActionSettings.removeTitle)
                        .replace(/\{indicatorSuccessTitle\}/g, options.fileActionSettings.indicatorSuccessTitle)
                    options.initialPreview.push(tmpl)
                }
                options.initialCaption = " ";
                $this.removeAttr("data-init-value").removeData("initValue");
            }
            // 预览区域关闭按钮
            readonly && (options.showClose = false)
            //单选多选模式
            if( options.multi === true ) {
                $this.attr("multiple", "multiple")
            } else if($this.is("[multiple]")) {
                options.multi = true
            }
            // 插件初始化
            $.fn.fileinput.call( $this, options )
            // 初始附件的动作按钮事件
            $this.fileinput("initFileActions");
            // 为初始化附件添加已上传标识，避免再次上传附件时HTML标记被覆盖
            $this.closest(".file-input").find(".file-preview-frame.file-preview-initial").addClass("file-preview-success")
            // 只读模式下移除上传控件
            readonly && $this.closest(".input-group").addClass("hide")
        })
        return this;
    }

    //设置别名
    !$.fn.fi && ($.fn.fi = $.fn[plugin.name])

    $(function() {
        $("input[role=" + plugin.name + "][type=file]")[plugin.name]()
    })

})(window, document, "jQuery")