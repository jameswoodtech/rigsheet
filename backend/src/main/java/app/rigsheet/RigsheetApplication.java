package app.rigsheet;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import app.rigsheet.model.Modification;
import app.rigsheet.model.UserProfile;
import app.rigsheet.model.VehicleInfo;
import app.rigsheet.repository.ModificationRepository;
import app.rigsheet.repository.UserProfileRepository;
import app.rigsheet.repository.VehicleInfoRepository;

@SpringBootApplication
public class RigsheetApplication {

    public static void main(String[] args) {
        SpringApplication.run(RigsheetApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadTestData(UserProfileRepository userRepo,
                                          VehicleInfoRepository vehicleRepo,
                                          ModificationRepository modRepo) {
        return args -> {
            // Create a user
            UserProfile user = UserProfile.builder()
                    .username("user1")
                    .displayName("James Wood")
                    .location("Northwest Arkansas")
                    .build();
            user = userRepo.save(user);

            // Create vehicle info
            VehicleInfo vehicle = VehicleInfo.builder()
                    .vehicleYear("2021")
                    .make("Jeep")
                    .model("Gladiator")
                    .trim("Overland")
                    .color("Sting Gray")
                    .nickname("Slightly Boujie")
                    .userProfile(user)
                    .build();
            vehicle = vehicleRepo.save(vehicle);

            // Create some mods
            modRepo.save(Modification.builder()
                    .name("2.5 Inch Plush Ride Springs")
                    .brand("Evo")
                    .category("Suspension")
                    .sponsored(false)
                    .userProfile(user)
                    .vehicleInfo(vehicle)
                    .build());
            modRepo.save(Modification.builder()
                    .name("Adjustable Lower Front Control Arms")
                    .brand("MetalCloak")
                    .category("Suspension")
                    .sponsored(false)
                    .userProfile(user)
                    .vehicleInfo(vehicle)
                    .build());
        };
    }
}
