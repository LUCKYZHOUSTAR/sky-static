package cmc.admin.stc.web;

import lucky.sky.web.WebApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Bootstrap {

  public static void main(String[] args) {
    new WebApplication(Bootstrap.class, args).run();
  }
}