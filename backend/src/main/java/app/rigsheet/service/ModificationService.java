package app.rigsheet.service;

import app.rigsheet.model.Modification;
import app.rigsheet.repository.ModificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModificationService {

    private final ModificationRepository modRepository;

    public ModificationService(ModificationRepository modRepository) {
        this.modRepository = modRepository;
    }

    public List<Modification> getAllMods() {
        return modRepository.findAll();
    }

    public Optional<Modification> getModById(Long id) {
        return modRepository.findById(id);
    }

    public List<Modification> getModByUserId(Long userid) {
        return modRepository.findByUserId(userid);
    }

    public List<Modification> getModbyVehicleInfoId(Long vehicleInfoId) {
        return modRepository.findByVehicleInfoId(vehicleInfoId);
    }

    public Modification createMod(Modification mod) {
        return modRepository.save(mod);
    }

/*    public Modification updateMod(Long id, Modification updatedMod) {
        return modRepository.findById(id).map(existingMod -> {
            existingMod.setName(updatedMod.getName());
            existingMod.setBrand(updatedMod.getBrand());
            existingMod.setCategory(updatedMod.getCategory());
            existingMod.setCost(updatedMod.getCost());
            existingMod.setWeight(updatedMod.getWeight());
            existingMod.setSponsored(updatedMod.isSponsored());
            existingMod.setUserId(updatedMod.getUserId());
            return modRepository.save(existingMod);
        }).orElseThrow(() -> new RuntimeException("Modification not found with id " + id));
    }*/
    public Modification updateMod(Modification modification) {
        return modRepository.save(modification);
    }

    public void deleteMod(Long id) {
        modRepository.deleteById(id);
    }

    public List<Modification> getModsByCategory(String category) {
        return modRepository.findByCategory(category);
    }

    public List<Modification> getModsByBrand(String brand) {
        return modRepository.findByBrand(brand);
    }

    public List<Modification> getSponsoredMods() {
        return modRepository.findBySponsored(true);
    }
}
