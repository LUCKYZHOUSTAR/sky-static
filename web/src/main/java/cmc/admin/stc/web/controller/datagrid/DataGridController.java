package cmc.admin.stc.web.controller.datagrid;

import cmc.admin.stc.web.enums.MovieStatus;
import cmc.admin.stc.web.enums.Plugin;
import cmc.admin.stc.web.enums.PromoTemplateType;
import cmc.admin.stc.web.model.AjaxPageResult;
import cmc.admin.stc.web.model.Movie;
import cmc.admin.stc.web.util.GenericQuery;
import cmc.admin.stc.web.util.ViewUtil;
import com.alibaba.fastjson.JSON;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by Mtime on 2016/6/24.
 */
@RestController
@RequestMapping("datagrid")
public class DataGridController {

    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView datagrid() {
        return ViewUtil.createWebViewResult(Plugin.DG, "datagrid/demo");}

    /**
     * test
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    public AjaxPageResult<Movie> movies(Query query) {
        List<Movie> list = new ArrayList<>();
        int totalCount = 200;
        int pageIndex = query.getPageIndex(),
                pageSize = query.getPageSize();
        for(int i = (pageIndex - 1) * pageSize + 1, l = pageIndex * pageSize; i <= totalCount && i <= l; i++) {
            Movie obj = new Movie();
            obj.setId(i);
            obj.setNameCN("美国队长" + i);
            obj.setShortComment("队长变逃犯，美国政局将会如何变动？");
            obj.setDuration(100 + i);
            obj.setYear("2016");
            obj.setReleaseDate(LocalDate.now().plusDays(i));
            obj.setShowtime(LocalDateTime.now());
            obj.setStatus(MovieStatus.valueOf(i % 3 + 1));
            list.add(obj);
        }
        return new AjaxPageResult<>(list, totalCount);
    }

    /**
     * test
     * @return
     */
    @RequestMapping("test")
    public String test(@RequestParam(required = false, defaultValue = "1") Integer pageIndex,
                       @RequestParam(required = false, defaultValue = "25") Integer pageSize,
                       String callback) {
        List<Map<String, Object>> list = new ArrayList<>();
        for(int i = (pageIndex - 1) * pageSize + 1, l = pageIndex * pageSize; i <= 200 && i <= l; i++) {
            Map<String, Object> item = new HashMap<>();
            String tmp = "000" + i;
            tmp = tmp.substring(tmp.length() - 3);
            item.put("MerchanName", "北京万达影视" + tmp);
            item.put("CreateTime", System.currentTimeMillis());
            item.put("Name", "UME国际影城" + tmp);
            item.put("CompanyName", "北京万达集团" + tmp);
            item.put("localDateTime", LocalDateTime.now());
            item.put("localDate", LocalDate.now());
            item.put("date", new Date());
            item.put("Id", i);
            item.put("enumValue", i % 3 + 1);
            item.put("enumName", i % 3 == 1 ? "COUPON" : (i % 3 == 2 ? "STRATEGY" : "MCARD"));
            list.add(item);
        }
        Map<String, Object> page = new HashMap<>();
        page.put("totalCount", 200);
        page.put("items", list);
        return callback + "(" + JSON.toJSONString(page) + ")";
    }


    public static class Query extends GenericQuery {
    }
}
