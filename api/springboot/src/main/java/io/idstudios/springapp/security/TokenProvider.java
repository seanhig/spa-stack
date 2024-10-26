package io.idstudios.springapp.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import io.idstudios.springapp.config.AppProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.stereotype.Service;

import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenProvider {

    private final AppProperties appProperties;
    private Algorithm ALGORITHM;

    public String createToken(Authentication authentication) {

        String idToken = "";

        if(authentication.getPrincipal() instanceof UserPrincipal) {
            idToken = ((UserPrincipal) authentication.getPrincipal()).getEmail();
        } else if (authentication.getPrincipal() instanceof DefaultOidcUser) {
            DefaultOidcUser oidcUser = (DefaultOidcUser) authentication.getPrincipal();
            idToken = oidcUser.getEmail();
            if(idToken == null) {
                log.warn("EMAIL is NULL from OIDC!");
            }
        } else {
            log.error("Principal is NOT KNOWN!");
        }

        ALGORITHM = Algorithm.HMAC256(appProperties.getAuth().getTokenSecret());

        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());

        log.info("Setting token Subject as: " + idToken);
        return JWT.create()
                .withSubject(idToken)
                .withIssuedAt(now)
                .withExpiresAt(expirationDate)
                .sign(ALGORITHM);
    }

    public String getUserEmailFromToken(String token) {
        JWTVerifier verifier = JWT.require(ALGORITHM).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        String subject = decodedJWT.getSubject();
        return subject;
    }

    public Long getUserIdFromToken(String token) {
        JWTVerifier verifier = JWT.require(ALGORITHM).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        String subject = decodedJWT.getSubject();
        return Long.parseLong(subject);
    }

    public boolean validateToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(ALGORITHM).build();
            verifier.verify(token);
            return true;
        } catch (Exception e) {
            log.error("Invalid or expired JWT.");
        }
        return false;
    }

}