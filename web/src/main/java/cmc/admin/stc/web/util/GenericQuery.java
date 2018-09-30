package cmc.admin.stc.web.util;

import lombok.Getter;
import lombok.Setter;
import lucky.sky.util.data.PageInfo;

/**
 * 通用查询条件类。
 */
@Getter
@Setter
public class GenericQuery extends PageInfo  {

    public GenericQuery() {
        setPageIndex(1);
        setPageSize(25);
    }

    private String action;
}
