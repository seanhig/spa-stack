package io.idstudios.springapp.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/about")
public class AboutController {
    
    private class AboutResponse {
        public String apiName;
        public String version;

        public AboutResponse(String apiName, String version) {
            this.apiName = apiName;
            this.version = version;
        }
    }

    private AboutResponse aboutResponse = new AboutResponse("This is SpringBoot!", "v1.0.0" );

    @GetMapping("")
    public ResponseEntity<AboutResponse> getAbout() {
        return ResponseEntity.ok(aboutResponse);
    }
}