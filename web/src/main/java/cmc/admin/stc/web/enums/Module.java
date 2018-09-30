package cmc.admin.stc.web.enums;

/**
 * Created by Sun Wang on 2016/1/27.
 */
public enum Module {
    WEB("web");

    private String name;
    private Module(String name) {
        this.name = name;
    }

    public String value() {
        return this.name;
    }
}
