package app.rigsheet.controller;

import app.rigsheet.model.Modification;
import app.rigsheet.model.VehicleInfo;
import app.rigsheet.service.ModificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mods")
@CrossOrigin(origins = "*") // You can restrict this later
public class ModificationController {

    private final ModificationService modService;

    public ModificationController(ModificationService modService) {
        this.modService = modService;
    }

    @GetMapping
    public List<Modification> getAllMods() {
        return modService.getAllMods();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Modification> getModById(@PathVariable Long id) {
        return modService.getModById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userProfileId}")
    public List<Modification> getByUserProfileId(@PathVariable Long userProfileId) {
        return modService.getModByUserId(userProfileId);
    }

    @GetMapping("/vehicle/{vehicleInfoId}")
    public List<Modification> getByVehicleInfoId(@PathVariable Long vehicleInfoId) {
        return modService.getModbyVehicleInfoId(vehicleInfoId);
    }

    @PostMapping
    public ResponseEntity<Modification> createMod(@RequestBody Modification mod) {
        Modification created = modService.createMod(mod);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Modification> updateMod(@PathVariable Long id, @RequestBody Modification updatedMod) {
        return modService.getModById(id)
                .map(existing -> {
                    updatedMod.setId(id);
                    return ResponseEntity.ok(modService.updateMod(updatedMod));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMod(@PathVariable Long id) {
        modService.deleteMod(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public List<Modification> getModsByCategory(@PathVariable String category) {
        return modService.getModsByCategory(category);
    }

    @GetMapping("/brand/{brand}")
    public List<Modification> getModsByBrand(@PathVariable String brand) {
        return modService.getModsByBrand(brand);
    }

    @GetMapping("/sponsored")
    public List<Modification> getSponsoredMods() {
        return modService.getSponsoredMods();
    }
}

