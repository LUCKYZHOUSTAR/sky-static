package cmc.admin.stc.web.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lucky.sky.util.build.BuildInfo;
import lucky.sky.util.build.BuildUtil;
import lucky.sky.util.log.LoggerManager;
import lucky.sky.web.result.ViewResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Sunw on 2016/10/18.
 */
@Controller
public class HomeController {

    private static final lucky.sky.util.log.Logger logger = LoggerManager.getLogger(HomeController.class);

    @RequestMapping("build/time")
    @ResponseBody
    public String getBuildTime() {
        try {
            BuildInfo buildInfo = BuildUtil.getBuildInfoObject();
            String strBuildTime = buildInfo.getBuildAt();
            LocalDateTime buildAt = LocalDateTime.parse(strBuildTime.replace('.', '-'));
            return DateTimeFormatter.ofPattern("yyMMdd.HHmmss").format(buildAt);
        } catch (Exception e) {
            logger.trace("get static site buildTime failed!", e);
            return "";
        }
    }

    @RequestMapping("/")
    public String index() {
        return "index";
    }

    @RequestMapping("/test")
    public String test() {
        return "test";
    }

    @RequestMapping("/mtime/require")
    public ViewResult require() {
        return new ViewResult("require/doc");
    }

}
