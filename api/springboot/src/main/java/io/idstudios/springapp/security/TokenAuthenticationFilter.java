package io.idstudios.springapp.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.idstudios.springapp.service.util.CookieUtils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final TokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;


    private String getJWTFromRequest(HttpServletRequest request) {

        Optional<Cookie> cookieToken = CookieUtils.getCookie(request, "AuthToken");
        if(cookieToken.isPresent()) {
            String cookieValue = cookieToken.get().getValue();
            try {
                log.info("Using AuthToken from COOKIE!");
                return URLDecoder.decode( cookieValue, "UTF-8" ); //.substring("Bearer ".length());
            } catch(UnsupportedEncodingException ex) {
                log.error("Something Unexpected in the Decode!", ex);
            }
        } 
        else 
        {
            String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);

            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                log.info("Using AuthToken from HEADER!");
                return bearerToken.substring("Bearer ".length());
            }    
        }
        
        return null;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJWTFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
//                Long userId = tokenProvider.getUserIdFromToken(jwt);
                String userEmail = tokenProvider.getUserEmailFromToken(jwt);
//                UserDetails userDetails = userDetailsService.loadUserById(userId);
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context.", ex);
        }

        filterChain.doFilter(request, response);
    }

}