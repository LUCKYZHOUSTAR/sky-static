package cmc.admin.stc.web.controller.multiselectable;

import cmc.admin.stc.web.enums.Plugin;
import cmc.admin.stc.web.model.SelectableModel;
import cmc.admin.stc.web.util.ViewUtil;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lucky.sky.web.result.ViewResult;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Sunw on 2016/11/10.
 */
@Controller
@RequestMapping("multiselectable")
public class MultiSelectableController {


    private static final Map<Integer, SelectableModel.Province> data = new HashMap<>();

    @RequestMapping
    public ViewResult test() {
        return  ViewUtil.createWebViewResult(Plugin.MSEL, "multiselectable/multiselectable");
    }

    @RequestMapping("cities")
    @ResponseBody
    public List<SelectableModel.City> queryCitiesByProvinceId(SelectableModel.SelectableQuery query) {
        int provinceId = query.getProvinceId() == 0 ? 104 : query.getProvinceId();
        SelectableModel.Province province = data.get(provinceId);
        List<SelectableModel.City> list = new ArrayList<>();
        province.getCities().forEach(city -> {
            if(StringUtils.isBlank(query.getTerm())) {
                list.add(city);
            } else if(city.getName().contains(query.getTerm())) {
                list.add(city);
            }
        });
        return list;
    }

    @RequestMapping("provinces")
    @ResponseBody
    public Collection<SelectableModel.Province> queryProvinces(SelectableModel.SelectableQuery query) {
        List<SelectableModel.Province> list = new ArrayList<>();
        data.values().forEach(province -> {
            if(StringUtils.isBlank(query.getTerm())) {
                list.add(province);
            } else if(province.getName().contains(query.getTerm())) {
                list.add(province);
            }
        });
        return list;
    }


    private static void register(SelectableModel.Province province) {
        Objects.requireNonNull(province);
        data.putIfAbsent(province.getId(), province);
    }

    private static void register(List<SelectableModel.Province> provinces) {
        Objects.requireNonNull(provinces);
        provinces.forEach(province -> register(province));
    }

    static {
        List<SelectableModel.Province> list = new ArrayList<>();
        SelectableModel.Province province = new SelectableModel.Province(100, "北京");
        province.addCity(new SelectableModel.City(100001, "北京市"));
        list.add(province);

        province = new SelectableModel.Province(101, "重庆");
        province.addCity(new SelectableModel.City(101001, "重庆市"));
        list.add(province);

        province = new SelectableModel.Province(102, "山西");
        province.addCity(new SelectableModel.City(102001, "吕梁市"));
        province.addCity(new SelectableModel.City(102002, "阳泉市"));
        province.addCity(new SelectableModel.City(102003, "长治市"));
        province.addCity(new SelectableModel.City(102004, "晋城市"));
        province.addCity(new SelectableModel.City(102005, "朔州市"));
        province.addCity(new SelectableModel.City(102006, "晋中市"));
        list.add(province);

        province = new SelectableModel.Province(103, "辽宁");
        province.addCity(new SelectableModel.City(103001, "大连市"));
        province.addCity(new SelectableModel.City(103002, "鞍山市"));
        province.addCity(new SelectableModel.City(103003, "抚顺市"));
        province.addCity(new SelectableModel.City(103004, "沈阳市"));
        province.addCity(new SelectableModel.City(103005, "锦州市"));
        list.add(province);

        province = new SelectableModel.Province(104, "安徽");
        province.addCity(new SelectableModel.City(104001, "蚌埠市"));
        province.addCity(new SelectableModel.City(104002, "淮南市"));
        province.addCity(new SelectableModel.City(104003, "合肥市"));
        province.addCity(new SelectableModel.City(104004, "芜湖市"));
        province.addCity(new SelectableModel.City(104005, "安庆市"));
        province.addCity(new SelectableModel.City(104006, "淮北市"));
        province.addCity(new SelectableModel.City(104007, "铜陵市"));
        list.add(province);

        register(list);
    }


}
