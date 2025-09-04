package app.rigsheet.service;

import app.rigsheet.model.Modification;
import app.rigsheet.repository.ModificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for {@link Modification} operations.
 *
 * <p>Currently thin pass-throughs to {@link ModificationRepository}.
 * This is the right place to add validation, events, or caching later.</p>
 */
@Service
public class ModificationService {

    private final ModificationRepository modRepository;

    public ModificationService(ModificationRepository modRepository) {
        this.modRepository = modRepository;
    }

    /** @return all modifications (consider pagination later) */
    public List<Modification> getAllMods() {
        return modRepository.findAll();
    }

    /** @return a modification by id, if present */
    public Optional<Modification> getModById(Long id) {
        return modRepository.findById(id);
    }

    /**
     * Find mods owned by a user (if your model stores userId on the mod).
     * @param userId the owning user id
     */
    public List<Modification> getModByUserId(Long userId) {
        return modRepository.findByUserId(userId);
    }

    /**
     * Existing method to fetch by vehicle id (spelling preserved for compatibility).
     * Prefer {@link #getModsByVehicleInfoId(Long)} going forward.
     */
    public List<Modification> getModbyVehicleInfoId(Long vehicleInfoId) {
        return modRepository.findByVehicleInfoId(vehicleInfoId);
    }

    /**
     * New alias with corrected naming; delegates to the existing implementation.
     * @param vehicleInfoId the vehicle id
     */
    public List<Modification> getModsByVehicleInfoId(Long vehicleInfoId) {
        return getModbyVehicleInfoId(vehicleInfoId);
    }

    /** Create a new modification. */
    @Transactional
    public Modification createMod(Modification mod) {
        return modRepository.save(mod);
    }

    /**
     * Update a modification by saving the provided entity.
     * Ensure the caller has set the id on the entity for an update.
     */
    @Transactional
    public Modification updateMod(Modification modification) {
        return modRepository.save(modification);
    }

    /** Delete a modification by id (idempotent). */
    @Transactional
    public void deleteMod(Long id) {
        modRepository.deleteById(id);
    }

    /** Find mods by category. */
    public List<Modification> getModsByCategory(String category) {
        return modRepository.findByCategory(category);
    }

    /** Find mods by brand. */
    public List<Modification> getModsByBrand(String brand) {
        return modRepository.findByBrand(brand);
    }

    /** @return all sponsored mods. */
    public List<Modification> getSponsoredMods() {
        return modRepository.findBySponsored(true);
    }
}