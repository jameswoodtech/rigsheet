package app.rigsheet.controller;

import app.rigsheet.model.UserProfile;
import app.rigsheet.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.Parameter;

/**
 * REST controller for UserProfile CRUD/read operations.
 *
 * Notes:
 * - Uses entities directly (no DTOs) to match existing project style.
 * - POST is for create (201 Created), PUT is for update (200 OK).
 * - A "list all" endpoint is included for admin/testing convenience.
 */
@RestController
@RequestMapping("/api/user-profiles")
@CrossOrigin(origins = "*") // tighten in prod
@Tag(name = "User Profiles", description = "Operations for creating, reading, updating and deleting user profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService){
        this.userProfileService = userProfileService;
    }

    /** GET /api/user-profiles */
    @Operation(
            summary = "List all user profiles",
            description = "Returns all user profiles. Useful for admin/testing. Consider pagination if this grows."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserProfile.class))))
    })
    @GetMapping
    public ResponseEntity<List<UserProfile>> getAll() {
        return ResponseEntity.ok(userProfileService.getAllUserProfiles());
    }

    /** GET /api/user-profiles/username/{username} */
    @Operation(
            summary = "Get user profile by username",
            description = "Fetch a single user profile by its unique username/handle."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Found",
                    content = @Content(schema = @Schema(implementation = UserProfile.class))),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @GetMapping("/username/{username}")
    public ResponseEntity<UserProfile> getByUsername(
            @Parameter(description = "Unique username/handle", required = true)
            @PathVariable String username) {
        return userProfileService.getUserProfileByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/user-profiles/{id} */
    @Operation(
            summary = "Get user profile by ID",
            description = "Fetch a single user profile by its numeric ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Found",
                    content = @Content(schema = @Schema(implementation = UserProfile.class))),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getById(
            @Parameter(description = "User profile ID", required = true, example = "1")
            @PathVariable Long id) {
        return userProfileService.getUserProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/user-profiles  — Create a new user profile.
     * Returns 201 Created with the saved entity in the body.
     *
     * Tip: callers should omit "id" for create; if present, JPA may treat this as an update.
     */
    @Operation(
            summary = "Create a new user profile",
            description = "Creates a new user profile. The request body should not include an ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created",
                    content = @Content(schema = @Schema(implementation = UserProfile.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    @PostMapping
    public ResponseEntity<UserProfile> create(
            @RequestBody(
                    description = "User profile to create",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UserProfile.class),
                            examples = {
                                    @ExampleObject(name = "Minimal",
                                            value = """
                                    {
                                      "username": "trailboss",
                                      "displayName": "Trail Boss",
                                      "location": "CO, USA",
                                      "bio": "Overlanding content creator"
                                    }
                                    """)
                            }
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody UserProfile profile
    ) {
        UserProfile saved = userProfileService.saveUserProfile(profile);
        URI location = URI.create(String.format("/api/user-profiles/%d", saved.getId()));
        return ResponseEntity.created(location).body(saved);
    }

    /**
     * PUT /api/user-profiles/{id} — Update an existing user profile.
     * Returns 200 OK if updated, 404 if the id does not exist.
     */
    @Operation(
            summary = "Update an existing user profile",
            description = "Updates all provided fields of the user profile identified by the path ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated",
                    content = @Content(schema = @Schema(implementation = UserProfile.class))),
            @ApiResponse(responseCode = "404", description = "Not Found"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> update(
            @Parameter(description = "User profile ID to update", required = true, example = "1")
            @PathVariable Long id,
            @RequestBody(
                    description = "Updated user profile data (ID is taken from path)",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UserProfile.class),
                            examples = {
                                    @ExampleObject(name = "UpdateNameAndLocation",
                                            value = """
                                    {
                                      "username": "trailboss",
                                      "displayName": "Trail Captain",
                                      "location": "UT, USA",
                                      "bio": "Overlanding content creator"
                                    }
                                    """)
                            }
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody UserProfile profile
    ) {
        return userProfileService.getUserProfileById(id)
                .map(existing -> {
                    profile.setId(id);
                    UserProfile updated = userProfileService.saveUserProfile(profile);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/user-profiles/{id} — 204 No Content (idempotent). */
    @Operation(
            summary = "Delete a user profile",
            description = "Deletes the user profile by ID. Returns 204 if deleted, 404 if not found."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "No Content"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "User profile ID to delete", required = true, example = "1")
            @PathVariable Long id) {
        if (userProfileService.getUserProfileById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        userProfileService.deleteUserProfile(id);
        return ResponseEntity.noContent().build();
    }
}