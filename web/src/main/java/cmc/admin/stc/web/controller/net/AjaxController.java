package cmc.admin.stc.web.controller.net;

import cmc.admin.stc.web.model.User;
import lucky.sky.web.result.ViewResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by guohua.cui on 2016/10/21.
 */
@RestController
@RequestMapping("net/ajax")
public class AjaxController {
    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView index() {
        ViewResult viewResult = new ViewResult("net/ajax");
        return viewResult;
    }

    @RequestMapping(value = "get-user", method = {RequestMethod.GET})
    public User getUser(User u) throws InterruptedException {
        Thread.sleep(1000);
        return fillUser(u, "get");
    }

    @RequestMapping(value = "post-user-by-json", method = {RequestMethod.POST})
    public User postUser(@RequestBody User u) throws InterruptedException {
        Thread.sleep(1000);
        return fillUser(u, "post json");
    }

    @RequestMapping(value = "post-user-by-form", method = {RequestMethod.POST})
    public User postUserByForm(User u) throws InterruptedException {
        Thread.sleep(1000);
        return fillUser(u, "post form");
    }

    private User fillUser(User u, String name) {
        User user = new User();
        user.setId(u.getId());
        user.setName(name);
        return user;
    }
}
