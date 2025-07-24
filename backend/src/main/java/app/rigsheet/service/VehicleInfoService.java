package app.rigsheet.service;

import app.rigsheet.model.VehicleInfo;
import app.rigsheet.repository.VehicleInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleInfoService {

    private final VehicleInfoRepository vehicleInfoRepository;

    @Autowired
    public VehicleInfoService(VehicleInfoRepository vehicleInfoRepository) {
        this.vehicleInfoRepository = vehicleInfoRepository;
    }

    public List<VehicleInfo> getAllVehicles() {
        return vehicleInfoRepository.findAll();
    }

    public Optional<VehicleInfo> getVehicleById(Long id) {
        return vehicleInfoRepository.findById(id);
    }

    public Optional<VehicleInfo> getVehicleByUserProfileId(Long userProfileId) {
        return vehicleInfoRepository.findByUserProfileId(userProfileId);
    }

    public VehicleInfo saveVehicleInfo(VehicleInfo vehicleInfo) {
        return vehicleInfoRepository.save(vehicleInfo);
    }

     public void deleteVehicleInfo(Long id) {
        vehicleInfoRepository.deleteById(id);
     }
}
