package cmc.admin.stc.web.controller.upload;

import cmc.admin.stc.web.enums.Plugin;
import cmc.admin.stc.web.util.ViewUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Created by Sun Wang on 2016/1/27.
 */
@Controller
@RequestMapping("fi")
public class UploadController {

    @RequestMapping()
    public ModelAndView fi() {
        return ViewUtil.createWebViewResult(Plugin.FI, "upload/demo");
    }

    @RequestMapping("/upload")
    @ResponseBody
    public Map<String, Object> upload(MultipartFile file, @RequestParam String file_id,
                                      @RequestParam(required = false) String bucket) {
        Map<String, Object> result = new HashMap<>();
        System.out.println("file_id:" + file_id);
        System.out.println("bucket:" + bucket);
        //此处根据自己的业务逻辑保存文件对象
        /* 代码省略 */
        result.put("id", UUID.randomUUID().toString());
        result.put("image", "/img/docs/3.jpg");
        result.put("filename", "3.jpg");
        result.put("state", true);
        result.put("msg", "上传成功");
        return result;
    }

}
