package cmc.admin.stc.web.controller.ztree;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by guohua.cui on 2016/11/28.
 */
@Controller
@RequestMapping("ztree")
public class ZtreeController {
    @RequestMapping
    public String index() {
        return "ztree/ztree";
    }

}