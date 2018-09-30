package cmc.admin.stc.web.controller.datepicker;

import cmc.admin.stc.web.enums.Plugin;
import cmc.admin.stc.web.util.ViewUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by Sun Wang on 2016/1/27.
 */
@Controller
@RequestMapping("dp")
public class DatepickerController {

    @RequestMapping()
    public ModelAndView dp() {
        return ViewUtil.createWebViewResult(Plugin.DP, "datepicker/demo");
    }

}
