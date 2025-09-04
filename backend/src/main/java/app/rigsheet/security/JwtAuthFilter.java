package app.rigsheet.security;

import app.rigsheet.model.UserProfile;
import app.rigsheet.repository.UserProfileRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Reads Authorization: Bearer <token>, validates via JwtUtil,
 * loads the user, and sets Authentication in the SecurityContext.
 *
 * If the header is missing/invalid/expired, the request proceeds unauthenticated.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserProfileRepository userRepo;

    public JwtAuthFilter(JwtUtil jwtUtil, UserProfileRepository userRepo) {
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = jwtUtil.validateAndGetUsername(token);

                // Load the user (optional for MVP, but useful to attach roles)
                UserProfile user = userRepo.findByUsername(username).orElse(null);
                if (user != null) {
                    var authorities = Arrays.stream(
                                    (user.getRoles() == null ? "ROLE_USER" : user.getRoles())
                                            .split(","))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                    var authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ex) {
                // Invalid/expired token → leave unauthenticated, no hard fail
            }
        }

        chain.doFilter(request, response);
    }
}