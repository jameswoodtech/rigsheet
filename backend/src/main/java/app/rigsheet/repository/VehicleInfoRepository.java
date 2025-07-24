package app.rigsheet.repository;

import app.rigsheet.model.VehicleInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleInfoRepository extends JpaRepository<VehicleInfo, Long> {
    Optional<VehicleInfo> findByUserProfileId(Long userProfileId);
}
