package com.allProcess.frontend.controller.Admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserManagementController {
    @GetMapping("/usermanagement")
    public String userManagement(){return "usermanagement";}
}
