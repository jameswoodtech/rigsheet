package app.rigsheet.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * Minimal JWT utility for issuing and validating HS256 tokens.
 * - Uses a secret from env var JWT_SECRET (recommended in prod)
 *   and falls back to a dev secret if not set.
 */
@Component
public class JwtUtil {

    private final Key key;

    public JwtUtil() {
        // Ensure at least 32+ chars for HS256
        String secret = System.getenv().getOrDefault(
                "JWT_SECRET",
                "dev-secret-please-change-this-dev-secret-please-change-this"
        );
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Issue a JWT with subject = username and given TTL in milliseconds.
     */
    public String generateToken(String username, long ttlMillis) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + ttlMillis))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validate the token and return the username (subject) if valid.
     * Throws JwtException on invalid/expired tokens.
     */
    public String validateAndGetUsername(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}