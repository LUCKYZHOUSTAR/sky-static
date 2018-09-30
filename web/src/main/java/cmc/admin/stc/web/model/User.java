package cmc.admin.stc.web.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Created by guohua.cui on 2016/10/21.
 */
@Getter
@Setter
public class User {
    private int id;
    private String name;
    private String email;
    private List<String> tags;
}
