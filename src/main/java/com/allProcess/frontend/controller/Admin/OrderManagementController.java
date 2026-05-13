package com.allProcess.frontend.controller.Admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OrderManagementController {
    @GetMapping("/ordermanagement")
    public String ordermanagement(){return "ordermanagement";}
}
