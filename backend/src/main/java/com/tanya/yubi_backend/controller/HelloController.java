package com.tanya.yubi_backend.controller;

import com.tanya.yubi_backend.service.HelloService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    private final HelloService helloService;
    public HelloController(HelloService helloService){
        this.helloService = helloService;
    }
    @GetMapping("/hello")
    public String hello(){
        return helloService.getGreeting();
    };

    @GetMapping("/about")
    public String getAbout(){
        return helloService.getAbout();
    }

}
