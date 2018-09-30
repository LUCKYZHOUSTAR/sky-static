package cmc.admin.stc.web.util;

import cmc.admin.stc.web.enums.Module;
import cmc.admin.stc.web.enums.Plugin;
import lucky.sky.web.result.ViewResult;

/**
 * Created by Sun Wang on 2016/1/27.
 */
public class ViewUtil {

    public static ViewResult createViewResult(Module module, Plugin plugin, String viewName) {
        ViewResult viewResult = new ViewResult(viewName);
        viewResult.addObject("module", module.value()).addObject("plugin", plugin.value());
        return viewResult;
    }
    public static ViewResult createWebViewResult(Plugin plugin, String viewName) {
        ViewResult viewResult = new ViewResult(viewName);
        viewResult.addObject("module", Module.WEB.value()).addObject("plugin", plugin.value());
        return viewResult;
    }
}
