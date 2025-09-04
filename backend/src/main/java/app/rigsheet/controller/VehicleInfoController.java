package app.rigsheet.controller;

import app.rigsheet.model.VehicleInfo;
import app.rigsheet.service.VehicleInfoService;
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
 * REST controller for VehicleInfo operations.
 *
 * <p>Notes:</p>
 * <ul>
 *   <li>Uses entities directly (no DTOs) to match the project’s current style.</li>
 *   <li>POST returns 201 Created and includes a Location header.</li>
 *   <li>PUT enforces the path id and preserves existing relationships when omitted.</li>
 *   <li>DELETE returns 404 if the vehicle does not exist (friendlier than silent no-op).</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*") // tighten for prod (domain-based)
@Tag(name = "Vehicles", description = "Manage vehicle records linked to user profiles")
public class VehicleInfoController {

    private final VehicleInfoService vehicleInfoService;

    @Autowired
    public VehicleInfoController(VehicleInfoService vehicleInfoService) {
        this.vehicleInfoService = vehicleInfoService;
    }

    /** GET /api/vehicles — list all vehicles (handy for admin/testing). */
    @Operation(
            summary = "List all vehicles",
            description = "Returns all vehicle records. Useful for admin/testing. Consider pagination if this grows."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = VehicleInfo.class))))
    })
    @GetMapping
    public ResponseEntity<List<VehicleInfo>> getAllVehicles() {
        return ResponseEntity.ok(vehicleInfoService.getAllVehicles());
    }

    /** GET /api/vehicles/{id} — fetch a vehicle by id. */
    @Operation(
            summary = "Get vehicle by ID",
            description = "Fetch a single vehicle by its numeric ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Found",
                    content = @Content(schema = @Schema(implementation = VehicleInfo.class))),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<VehicleInfo> getVehicleById(
            @Parameter(description = "Vehicle ID", required = true, example = "1")
            @PathVariable Long id) {
        return vehicleInfoService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/vehicles/user/{userProfileId} — fetch a vehicle by owning user id (assumes 1:1). */
    @Operation(
            summary = "Get vehicle by User Profile ID",
            description = "Fetch a vehicle linked to the given user profile (assumes one vehicle per user)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Found",
                    content = @Content(schema = @Schema(implementation = VehicleInfo.class))),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @GetMapping("/user/{userProfileId}")
    public ResponseEntity<VehicleInfo> getByUserProfileId(
            @Parameter(description = "User profile ID", required = true, example = "1")
            @PathVariable Long userProfileId) {
        return vehicleInfoService.getVehicleByUserProfileId(userProfileId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/vehicles — create a vehicle.
     *
     * Expects a JSON body that includes the owning userProfile id, e.g.:
     * {
     *   "userProfile": { "id": 1 },
     *   "vehicleYear": "2021",
     *   "make": "Toyota", "model": "4Runner", "trim": "TRD Pro",
     *   "color": "Cement", "nickname": "Atlas", "image": "https://..."
     * }
     */
    @Operation(
            summary = "Create a vehicle",
            description = "Creates a new vehicle. The request body must include a `userProfile.id` to establish ownership."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created",
                    content = @Content(schema = @Schema(implementation = VehicleInfo.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    @PostMapping
    public ResponseEntity<VehicleInfo> createVehicle(
            @RequestBody(
                    description = "Vehicle to create (must include userProfile.id)",
                    required = true,
                    content = @Content(schema = @Schema(implementation = VehicleInfo.class),
                            examples = @ExampleObject(
                                    name = "CreateVehicle",
                                    value = """
                                {
                                  "userProfile": { "id": 1 },
                                  "vehicleYear": "2021",
                                  "make": "Toyota",
                                  "model": "4Runner",
                                  "trim": "TRD Pro",
                                  "color": "Cement",
                                  "nickname": "Atlas",
                                  "image": "https://example.com/rig.jpg"
                                }
                                """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody VehicleInfo vehicleInfo
    ) {
        // Basic validation: must include an owning user
        if (vehicleInfo.getUserProfile() == null || vehicleInfo.getUserProfile().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        VehicleInfo saved = vehicleInfoService.saveVehicleInfo(vehicleInfo);
        URI location = URI.create(String.format("/api/vehicles/%d", saved.getId()));
        return ResponseEntity.created(location).body(saved);
    }

    /**
     * PUT /api/vehicles/{id} — update an existing vehicle.
     *
     * If the request body omits userProfile, we preserve the existing relationship.
     */
    @Operation(
            summary = "Update a vehicle",
            description = "Updates a vehicle by ID. Preserves existing user link if not provided in the request."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated",
                    content = @Content(schema = @Schema(implementation = VehicleInfo.class))),
            @ApiResponse(responseCode = "404", description = "Not Found"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    @PutMapping("/{id}")
    public ResponseEntity<VehicleInfo> updateVehicle(
            @Parameter(description = "Vehicle ID to update", required = true, example = "1")
            @PathVariable Long id,
            @RequestBody(
                    description = "Updated vehicle data (ID taken from path). If userProfile is omitted it will be preserved.",
                    required = true,
                    content = @Content(schema = @Schema(implementation = VehicleInfo.class),
                            examples = @ExampleObject(
                                    name = "UpdateVehicle",
                                    value = """
                                {
                                  "vehicleYear": "2022",
                                  "make": "Toyota",
                                  "model": "4Runner",
                                  "trim": "TRD Pro",
                                  "color": "Lunar Rock",
                                  "nickname": "Atlas",
                                  "image": "https://example.com/rig-v2.jpg"
                                }
                                """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody VehicleInfo updatedVehicle
    ) {
        return vehicleInfoService.getVehicleById(id)
                .map(existing -> {
                    // Enforce path id
                    updatedVehicle.setId(id);

                    // Preserve user relationship if not provided in the update
                    if (updatedVehicle.getUserProfile() == null) {
                        updatedVehicle.setUserProfile(existing.getUserProfile());
                    }

                    VehicleInfo saved = vehicleInfoService.saveVehicleInfo(updatedVehicle);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/vehicles/{id} — delete a vehicle.
     * Returns 404 if the vehicle does not exist.
     */
    @Operation(
            summary = "Delete a vehicle",
            description = "Deletes a vehicle by ID. Returns 204 if deleted, 404 if not found."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "No Content"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(
            @Parameter(description = "Vehicle ID to delete", required = true, example = "1")
            @PathVariable Long id) {
        if (vehicleInfoService.getVehicleById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404
        }
        vehicleInfoService.deleteVehicleInfo(id);
        return ResponseEntity.noContent().build(); // 204
    }
}