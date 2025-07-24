package app.rigsheet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import app.rigsheet.model.Modification;

import java.util.List;

@Repository
public interface ModificationRepository extends JpaRepository<Modification, Long> {
    List<Modification> findBySponsored(boolean sponsored);
    List<Modification> findByCategory(String category);
    List<Modification> findByBrand(String brand);
    List<Modification> findByUserId(Long userId);
    List<Modification> findByVehicleInfoId(Long vehicleInfoId);
}