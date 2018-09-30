package cmc.admin.stc.web.enums;

/**
 * Created by Sun Wang on 2016/1/27.
 */
public enum  Plugin {
    MSEL("multiselectable"),
    SEL("selectable"),
    DP("datepicker"),
    FI("fileinput"),
    DG("datagrid"),
    TR("tree"),
    AC("autocompleter"),
    TEST("test");

    private String name;
    private Plugin(String name) {
        this.name = name;
    }

    public String value() {
        return this.name;
    }
}
