package com.allProcess.frontend.controller.Client;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CatalogClientController {
    @GetMapping("/catalogclient")
    public String catalogClient(){return "catalogclient";}
}
