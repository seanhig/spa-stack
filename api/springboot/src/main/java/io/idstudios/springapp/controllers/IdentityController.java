package io.idstudios.springapp.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.idstudios.springapp.model.payload.UserResponse;
import io.idstudios.springapp.security.CurrentUser;
import io.idstudios.springapp.security.UserPrincipal;
import io.idstudios.springapp.service.UserService;
import jakarta.servlet.http.HttpServletResponse;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/identity")
public class IdentityController {
    private final UserService _userService;

    @GetMapping("/current-user")
    public ResponseEntity<UserResponse> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            log.warn("Current user is NULL, Anonymous!");
            return ResponseEntity.ok(new UserResponse());
        }

        return ResponseEntity.ok(_userService.getUserInfoById(userPrincipal.getId()));
    }

    @PostMapping("/external-login")
    void newEmployee(HttpServletResponse response, @RequestParam String provider, @RequestParam String returnUrl) {

        log.info("Signing in using [" + provider + "] provider");
        log.info("Return URL:  " + returnUrl);

        returnUrl = "http://localhost:4200";
        String authUrl = "/api/oauth2/authorize/" + provider.toLowerCase() + "?redirect_uri=" + returnUrl;

        try {
            log.debug("Redirecting to authUrl: " + authUrl);
            response.sendRedirect(authUrl);
        } catch(IOException ex) {
            log.error("Unable to send redirect!", ex);
        }

    }

}