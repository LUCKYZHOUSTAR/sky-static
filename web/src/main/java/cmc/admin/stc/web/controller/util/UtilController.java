package cmc.admin.stc.web.controller.util;

import lucky.sky.web.result.ViewResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by guohua.cui on 2016/10/25.
 */
@RestController
@RequestMapping("util")
public class UtilController {
    @RequestMapping(value = "dispatcher", method = RequestMethod.GET)
    public ModelAndView dispatcher() {
        ViewResult viewResult = new ViewResult("util/dispatcher");
        return viewResult;
    }
}