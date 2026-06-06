package com.allProcess.frontend.controller.Client;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProfileClientController {
    @GetMapping("/profileclient")
    public String profile(){return "profileclient";}
}
