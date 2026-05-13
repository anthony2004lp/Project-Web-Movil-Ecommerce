package com.allProcess.frontend.controller.Client;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeClientController {
    @GetMapping("/homeclient")
    public String homeclient(){return "homeclient";}
}
