package cmc.admin.stc.web.controller.tree;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Sunw on 2016/10/18.
 */
@Controller
@RequestMapping("tree")
public class TreeController {


    @RequestMapping
    public String index() {
        return "tree/tree";
    }

}
