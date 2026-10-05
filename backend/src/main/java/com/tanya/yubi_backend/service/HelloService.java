package com.tanya.yubi_backend.service;
import org.springframework.stereotype.Service;
@Service
public class HelloService {
    public String getGreeting(){
        return "Hello from Yubi Service";
    }
    public String getAbout(){
        return "this is get about";
    }
}
