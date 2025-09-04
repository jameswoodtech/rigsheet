// src/main/java/app/rigsheet/config/SecurityConfig.java
package app.rigsheet.config;

import app.rigsheet.repository.UserProfileRepository;
import app.rigsheet.security.JwtAuthFilter;
import app.rigsheet.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Basic Spring Security setup:
 * - Stateless (JWT) API
 * - Public endpoints for auth & public profile reads
 * - Everything else requires a valid Bearer token
 * - Registers JwtAuthFilter to process Authorization headers
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtUtil jwtUtil,
            UserProfileRepository userRepo
    ) throws Exception {

        http
                // Stateless API + CORS (your GlobalCorsConfig applies)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization rules (keep this minimal for now)
                .authorizeHttpRequests(auth -> auth
                        // OpenAPI / Swagger
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Auth endpoints (login, later register if you enable it)
                        .requestMatchers("/api/auth/**").permitAll()

                        // Public profile reads
                        .requestMatchers(
                                "/api/user-profiles/**",     // if you expose read-only user info
                                "/api/vehicles/user/**",     // vehicle by user id
                                "/api/mods/vehicle/**"       // mods by vehicle id
                        ).permitAll()

                        // Everything else requires JWT
                        .anyRequest().authenticated()
                )

                // Register JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(new JwtAuthFilter(jwtUtil, userRepo), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /** BCrypt encoder for hashing & verifying passwords. */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}