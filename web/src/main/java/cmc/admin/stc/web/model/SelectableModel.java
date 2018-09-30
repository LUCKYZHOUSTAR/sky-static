package cmc.admin.stc.web.model;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by Sunw on 2016/10/24.
 */
public class SelectableModel {

    @Getter
    @Setter
    public static class SelectableQuery  {
        private int provinceId;
        private String term;
    }

    @Getter
    @Setter
    public static class Province {
        private int id;
        private String name;
        private List<City> cities;
        public Province(int id, String name) {
            this.id = id;
            this.name = name;
        }
        public void addCity(City city) {
            if(cities == null) {
                cities = new ArrayList<>();
            }
            cities.add(city);
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class City {
        private int id;
        private String name;
    }
}
