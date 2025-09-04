package app.rigsheet.service;

import app.rigsheet.model.VehicleInfo;
import app.rigsheet.repository.VehicleInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for {@link VehicleInfo} operations.
 *
 * <p>
 * This class centralizes access to {@link VehicleInfoRepository} and is the right
 * place to grow business logic (validation, events, caching, audit) without
 * changing controllers. For now, methods are thin pass-throughs to the repository.
 * </p>
 *
 * <h3>Conventions</h3>
 * <ul>
 *   <li>Constructor injection for testability and immutability.</li>
 *   <li>Read methods are non-transactional by default.</li>
 *   <li>Write methods are annotated with {@link Transactional} to ensure atomic updates.</li>
 *   <li>Names match existing project style (no churn in controllers).</li>
 * </ul>
 */
@Service
public class VehicleInfoService {

    private final VehicleInfoRepository vehicleInfoRepository;

    @Autowired
    public VehicleInfoService(VehicleInfoRepository vehicleInfoRepository) {
        this.vehicleInfoRepository = vehicleInfoRepository;
    }

    /**
     * Retrieve all vehicles.
     *
     * <p>Useful for admin/testing. Consider adding pagination later if this list grows.</p>
     *
     * @return a list of all {@link VehicleInfo} records (possibly empty, never {@code null})
     */
    public List<VehicleInfo> getAllVehicles() {
        return vehicleInfoRepository.findAll();
    }

    /**
     * Find a vehicle by its primary key.
     *
     * @param id the vehicle ID
     * @return an {@link Optional} containing the vehicle if found; empty otherwise
     */
    public Optional<VehicleInfo> getVehicleById(Long id) {
        return vehicleInfoRepository.findById(id);
    }

    /**
     * Find the vehicle associated with a given user profile.
     *
     * <p>Assumes a one-to-one relationship between user and vehicle. If the model
     * evolves to one-to-many, replace this with a collection query.</p>
     *
     * @param userProfileId the owning user profile ID
     * @return an {@link Optional} containing the vehicle if found; empty otherwise
     */
    public Optional<VehicleInfo> getVehicleByUserProfileId(Long userProfileId) {
        return vehicleInfoRepository.findByUserProfileId(userProfileId);
    }

    /**
     * Create or update a {@link VehicleInfo}.
     *
     * <p>
     * If the entity has a non-null ID that exists, this acts as an update; otherwise it creates a new row.
     * </p>
     *
     * @param vehicleInfo the vehicle to persist
     * @return the saved entity (with generated ID if newly created)
     */
    @Transactional
    public VehicleInfo saveVehicleInfo(VehicleInfo vehicleInfo) {
        return vehicleInfoRepository.save(vehicleInfo);
    }

    /**
     * Delete a vehicle by ID.
     *
     * <p>JPA delete is idempotent: deleting a non-existent ID does not raise an exception.</p>
     *
     * @param id the vehicle ID to delete
     */
    @Transactional
    public void deleteVehicleInfo(Long id) {
        vehicleInfoRepository.deleteById(id);
    }
}