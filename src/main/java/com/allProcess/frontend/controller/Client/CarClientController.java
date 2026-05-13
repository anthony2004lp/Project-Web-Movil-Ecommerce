package com.allProcess.frontend.controller.Client;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CarClientController {
    @GetMapping("/carclient")
    public String carClient(){return "carclient";}
}
