package app.rigsheet.controller;

import app.rigsheet.model.Modification;
import app.rigsheet.model.VehicleInfo;
import app.rigsheet.service.ModificationService;
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

@RestController
@RequestMapping("/api/mods")
@CrossOrigin(origins = "*") // tighten for prod
@Tag(name = "Modifications", description = "Manage build modifications and gear linked to vehicles")
public class ModificationController {

    private final ModificationService modService;

    public ModificationController(ModificationService modService) {
        this.modService = modService;
    }

    @Operation(summary = "List all modifications")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Modification.class))))
    @GetMapping
    public List<Modification> getAllMods() {
        return modService.getAllMods();
    }

    @Operation(summary = "Get modification by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Found",
                    content = @Content(schema = @Schema(implementation = Modification.class))),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Modification> getModById(
            @Parameter(description = "Modification ID", required = true, example = "1")
            @PathVariable Long id) {
        return modService.getModById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "List modifications by user profile ID")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Modification.class))))
    @GetMapping("/user/{userProfileId}")
    public List<Modification> getByUserProfileId(
            @Parameter(description = "User profile ID", example = "1")
            @PathVariable Long userProfileId) {
        return modService.getModByUserId(userProfileId);
    }

    @Operation(summary = "List modifications by vehicle ID")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Modification.class))))
    @GetMapping("/vehicle/{vehicleInfoId}")
    public List<Modification> getByVehicleInfoId(
            @Parameter(description = "Vehicle ID", example = "1")
            @PathVariable Long vehicleInfoId) {
        return modService.getModbyVehicleInfoId(vehicleInfoId);
    }

    @Operation(
            summary = "Create a modification",
            description = "Adds a new modification. Must include a valid `vehicleInfo.id`."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created",
                    content = @Content(schema = @Schema(implementation = Modification.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    @PostMapping
    public ResponseEntity<Modification> createMod(
            @RequestBody(
                    description = "Modification to create",
                    required = true,
                    content = @Content(schema = @Schema(implementation = Modification.class),
                            examples = @ExampleObject(
                                    value = """
                                {
                                  "vehicleInfo": { "id": 1 },
                                  "name": "Lift Kit",
                                  "brand": "TrailMaster",
                                  "category": "Suspension",
                                  "weight": 55.0,
                                  "price": 899.99,
                                  "sponsored": false
                                }
                                """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody Modification mod) {
        VehicleInfo vehicle = mod.getVehicleInfo();
        if (vehicle == null || vehicle.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Modification created = modService.createMod(mod);
        URI location = URI.create(String.format("/api/mods/%d", created.getId()));
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Update a modification")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated",
                    content = @Content(schema = @Schema(implementation = Modification.class))),
            @ApiResponse(responseCode = "404", description = "Not Found"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Modification> updateMod(
            @Parameter(description = "Modification ID to update", example = "1")
            @PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody Modification updatedMod) {
        var existingOpt = modService.getModById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        var existing = existingOpt.get();
        updatedMod.setId(id);

        if (updatedMod.getVehicleInfo() == null) {
            updatedMod.setVehicleInfo(existing.getVehicleInfo());
        } else if (updatedMod.getVehicleInfo().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Modification saved = modService.updateMod(updatedMod);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "Delete a modification")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "No Content"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMod(
            @Parameter(description = "Modification ID to delete", example = "1")
            @PathVariable Long id) {
        if (modService.getModById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        modService.deleteMod(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List modifications by category")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Modification.class))))
    @GetMapping("/category/{category}")
    public List<Modification> getModsByCategory(
            @Parameter(description = "Category name", example = "Suspension")
            @PathVariable String category) {
        return modService.getModsByCategory(category);
    }

    @Operation(summary = "List modifications by brand")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Modification.class))))
    @GetMapping("/brand/{brand}")
    public List<Modification> getModsByBrand(
            @Parameter(description = "Brand name", example = "TrailMaster")
            @PathVariable String brand) {
        return modService.getModsByBrand(brand);
    }

    @Operation(summary = "List sponsored modifications")
    @ApiResponse(responseCode = "200", description = "OK",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Modification.class))))
    @GetMapping("/sponsored")
    public List<Modification> getSponsoredMods() {
        return modService.getSponsoredMods();
    }
}