package app.rigsheet;

import org.springframework.beans.factory.annotation.Value;
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
           

        };
    }
}
