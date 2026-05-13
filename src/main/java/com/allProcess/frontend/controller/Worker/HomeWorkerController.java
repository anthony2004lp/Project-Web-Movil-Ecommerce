package com.allProcess.frontend.controller.Worker;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeWorkerController {
    @GetMapping("/homeworker")
    public String homeworker(){return "homeworker";}
}
