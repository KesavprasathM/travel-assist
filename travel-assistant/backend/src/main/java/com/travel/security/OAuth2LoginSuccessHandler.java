package com.travel.security;

import com.travel.model.User;
import com.travel.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
        throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("OAuth user not found after login"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        String redirectUrl = "http://localhost:4200/auth/login?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
            + "&name=" + URLEncoder.encode(user.getName(), StandardCharsets.UTF_8)
            + "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
            + "&id=" + user.getId()
            + "&role=" + URLEncoder.encode(user.getRole(), StandardCharsets.UTF_8);

        response.sendRedirect(redirectUrl);
    }
}
