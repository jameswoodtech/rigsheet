package app.rigsheet.controller;

import app.rigsheet.model.UserProfile;
import app.rigsheet.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-profiles")
@CrossOrigin(origins = "*")
public class UserProfileController {

     private final UserProfileService userProfileService;

     @Autowired
     public UserProfileController(UserProfileService userProfileService){
         this.userProfileService = userProfileService;
     }

     @GetMapping("/username/{username}")
     public ResponseEntity<UserProfile> getByUsername(@PathVariable String username) {
         return userProfileService.getUserProfileByUsername(username)
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
     }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getById(@PathVariable Long id) {
        return userProfileService.getUserProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

     @PostMapping
     public ResponseEntity<UserProfile> createOrUpdate(@RequestBody UserProfile profile) {
         UserProfile saved = userProfileService.saveUserProfile(profile);
         return ResponseEntity.ok(saved);
     }

     @DeleteMapping("/{id}")
     public ResponseEntity<Void> delete(@PathVariable Long id) {
         userProfileService.deleteUserProfile(id);
         return ResponseEntity.noContent().build();
     }
}
