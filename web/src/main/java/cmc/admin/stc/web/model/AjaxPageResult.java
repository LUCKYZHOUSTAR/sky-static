package cmc.admin.stc.web.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lucky.sky.util.data.PageResultSet;

public class AjaxPageResult<T> {
    private List<T> items;
    private int totalCount;

    public AjaxPageResult() {
        this(new ArrayList(0), 0);
    }

    public AjaxPageResult(List<T> items, int totalCount) {
        Objects.requireNonNull(items, "items");
        this.items = items;
        this.totalCount = totalCount;
    }

    public AjaxPageResult(PageResultSet<T> pageResultSet) {
        this((List)(pageResultSet.getItems() != null?pageResultSet.getItems():new ArrayList(0)), pageResultSet.getTotalCount());
    }

    public List<T> getItems() {
        return this.items;
    }

    public int getTotalCount() {
        return this.totalCount;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
}
