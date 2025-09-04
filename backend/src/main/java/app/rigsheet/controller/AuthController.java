package app.rigsheet.controller;

import app.rigsheet.model.UserProfile;
import app.rigsheet.repository.UserProfileRepository;
import app.rigsheet.security.JwtUtil;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // tighten later
public class AuthController {

    private final UserProfileRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserProfileRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * POST /api/auth/login
     * Body: { "username": "...", "password": "..." }
     * Returns: { "token": "...", "user": { id, username, displayName, roles } }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        UserProfile user = userRepo.findByUsername(req.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
        if (user.getPasswordHash() == null ||
                !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        // 24h token TTL (adjust as needed)
        long ttl = Duration.ofHours(24).toMillis();
        String token = jwtUtil.generateToken(user.getUsername(), ttl);

        // Minimal user payload (omit sensitive fields)
        var userPayload = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "displayName", user.getDisplayName(),
                "roles", user.getRoles()
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", userPayload
        ));
    }

    // (Optional) quick auth check endpoint
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        // If you want: resolve from SecurityContext and return current user
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }
}