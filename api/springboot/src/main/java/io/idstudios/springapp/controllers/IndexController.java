package io.idstudios.springapp.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class IndexController implements ErrorController {
    @RequestMapping(value = "${server.error.path:${error.path:/error}}")
    public String error() {
        log.info("IN THE ERROR REDIRECT!");
        return "forward:/index.html";
    }
}