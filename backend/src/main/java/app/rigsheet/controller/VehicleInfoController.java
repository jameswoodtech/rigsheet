package app.rigsheet.controller;

import app.rigsheet.model.VehicleInfo;
import app.rigsheet.service.VehicleInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleInfoController {

     private final VehicleInfoService vehicleInfoService;

     @Autowired
     public VehicleInfoController(VehicleInfoService vehicleInfoService) {
         this.vehicleInfoService = vehicleInfoService;
     }

     @GetMapping
     public ResponseEntity<List<VehicleInfo>> getAllVehicles() {
         return ResponseEntity.ok(vehicleInfoService.getAllVehicles());
     }

     @GetMapping("/{id}")
     public ResponseEntity<VehicleInfo> getVehicleById(@PathVariable Long id) {
         return vehicleInfoService.getVehicleById(id)
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build ());
     }

     @GetMapping("/user/{userProfileId}")
     public ResponseEntity<VehicleInfo> getByUserProfileId(@PathVariable Long userProfileId) {
         return vehicleInfoService.getVehicleByUserProfileId(userProfileId)
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
     }

     @PostMapping
     public ResponseEntity<VehicleInfo> createVehicle(@RequestBody VehicleInfo vehicleInfo) {
         return ResponseEntity.ok(vehicleInfoService.saveVehicleInfo(vehicleInfo));
     }

     @PutMapping("/{id}")
     public ResponseEntity<VehicleInfo> updateVehicle(
             @PathVariable Long id,
             @RequestBody VehicleInfo updatedVehicle
     ){
         return vehicleInfoService.getVehicleById(id)
                 .map(existing ->  {
                     updatedVehicle.setId(id);
                     return ResponseEntity.ok(vehicleInfoService.saveVehicleInfo(updatedVehicle));
                 })
                 .orElse(ResponseEntity.notFound().build());
     }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleInfoService.deleteVehicleInfo(id);
        return ResponseEntity.noContent().build();
    }
}
