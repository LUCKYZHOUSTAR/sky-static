package cmc.admin.stc.web.controller.autocompleter;

import cmc.admin.stc.web.enums.Plugin;
import cmc.admin.stc.web.util.ViewUtil;
import com.alibaba.fastjson.JSON;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lucky.sky.web.result.ViewResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by Sun Wang on 2016/1/25.
 */
@Controller
@RequestMapping("ac")
public class AutoCompleterController {

    private static final List<Map<String, Object>> list = new ArrayList<>();

    static {
        for(int i = 0; i < 50; i++) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", i);
            map.put("nameCN", "寻龙诀"+ i);
            list.add(map);
        }
    }

    @RequestMapping()
    public ModelAndView ac() {
        return ViewUtil.createWebViewResult(Plugin.AC, "autocompleter/demo");
    }

    @RequestMapping("/demo")
    @ResponseBody
    public String test(@RequestParam(required = false) String name, String callback) {
        List<Map<String, Object>> l = new ArrayList<>();
        // 查询数据 start
        if(name != null) {
            for(Map<String, Object> item : list) {
                if(item.get("nameCN").toString().contains(name)) {
                    l.add(item);
                }
            }
        }
        // 查询数据 end
        return callback + "(" + JSON.toJSONString(l) + ")";
    }

    @RequestMapping("test")
    public ViewResult test() {
        return new ViewResult("test");
    }

}
