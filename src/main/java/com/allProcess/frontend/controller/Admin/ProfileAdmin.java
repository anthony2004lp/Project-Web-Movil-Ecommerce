package com.allProcess.frontend.controller.Admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProfileAdmin {
    @GetMapping("/profileadmin")
    public String profileadmin(){return "profileadmin";}
}
