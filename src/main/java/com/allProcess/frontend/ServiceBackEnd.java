package com.allProcess.frontend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ServiceBackEnd {
    @Value("${backend.url}")
    private String backendUrl;

    @Autowired
    private RestTemplate restTemplate;

    public String getDatos() {
        return restTemplate.getForObject(backendUrl + "/api/endpoint", String.class);
    }
}