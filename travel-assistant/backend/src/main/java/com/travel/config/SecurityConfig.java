package com.travel.config;

import com.travel.security.CustomOAuth2UserService;
import com.travel.security.JwtFilter;
import com.travel.security.OAuth2LoginSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)   // enables @PreAuthorize("hasRole('ADMIN')")
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomOAuth2UserService oauth2UserService;
    private final OAuth2LoginSuccessHandler oauth2LoginSuccessHandler;

    public SecurityConfig(JwtFilter jwtFilter, CustomOAuth2UserService oauth2UserService,
                          OAuth2LoginSuccessHandler oauth2LoginSuccessHandler) {
        this.jwtFilter = jwtFilter;
        this.oauth2UserService = oauth2UserService;
        this.oauth2LoginSuccessHandler = oauth2LoginSuccessHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(c -> c.disable())
            .cors(c -> c.configurationSource(corsSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(a -> a
                // Public routes
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/destinations/**").permitAll()
                .requestMatchers("/api/weather/**").permitAll()
                .requestMatchers("/api/disasters/**").permitAll()
                .requestMatchers("/api/pois/**").permitAll()
                .requestMatchers("/api/recommendations/**").permitAll()
                .requestMatchers("/api/reviews/destination/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/login/oauth2/**").permitAll()
                // Admin routes — also protected by @PreAuthorize
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // All other routes need authentication
                .anyRequest().authenticated()
            )
            .oauth2Login(o -> o
                .userInfoEndpoint(u -> u.userService(oauth2UserService))
                .successHandler(oauth2LoginSuccessHandler)
            )
            .headers(h -> h.frameOptions(f -> f.sameOrigin()))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsSource() {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200", "http://localhost:4201"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean public AuthenticationManager authManager(AuthenticationConfiguration c) throws Exception { return c.getAuthenticationManager(); }
}
