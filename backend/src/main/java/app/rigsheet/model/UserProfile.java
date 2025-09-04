package app.rigsheet.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    private String displayName;

    @Column(length = 500)
    private String bio;

    private String profileImageUrl;

    private String location;

    /** BCrypted password; excluded from JSON responses */
    @JsonIgnore
    @Column(name = "password_hash")
    private String passwordHash;   // nullable for now; we’ll backfill then tighten

    /** Comma-separated roles, e.g. "ROLE_USER,ROLE_ADMIN" */
    @Column
    private String roles;          // nullable for now; default later to 'ROLE_USER'
}