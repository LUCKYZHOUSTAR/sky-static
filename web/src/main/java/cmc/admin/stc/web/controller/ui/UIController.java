package cmc.admin.stc.web.controller.ui;

import cmc.admin.stc.web.model.User;
import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lucky.sky.util.convert.StringConverter;
import lucky.sky.web.result.ViewResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by guohua.cui on 2016/10/24.
 */
@RestController
@RequestMapping("ui")
public class UIController {
    @RequestMapping(value = "dialog", method = RequestMethod.GET)
    public ModelAndView dialog() {
        ViewResult viewResult = new ViewResult("ui/dialog");
        return viewResult;
    }

    @RequestMapping(value = "form", method = RequestMethod.GET)
    public ModelAndView form() {
        ViewResult viewResult = new ViewResult("ui/form");
        return viewResult;
    }

    @RequestMapping(value = "loading", method = RequestMethod.GET)
    public ModelAndView loading() {
        ViewResult viewResult = new ViewResult("ui/loading");
        return viewResult;
    }

    @RequestMapping(value = "pulldown", method = RequestMethod.GET)
    public ModelAndView pulldown() {
        ViewResult viewResult = new ViewResult("ui/pulldown");
        return viewResult;
    }

    @RequestMapping(value = "form/submit", method = RequestMethod.POST)
    @ResponseBody
    public FormInfo formSubmit(@RequestBody FormInfo info) {
        info.getUser().setId(10000);
        return info;
    }

    @RequestMapping(value = "form/validate", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> formValidate(String value) {
        String error = (StringConverter.toInt32(value, 0) <= 100) ? "请输入大于 100 的整数" : null;
        Map<String, String> r = new HashMap<>(1);
        r.put("error", error);
        return r;
    }

    @Getter
    @Setter
    public static class FormInfo {
        private User user;
        private boolean apply;
    }
}
