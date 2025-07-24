package app.rigsheet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Modification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String brand;
    private boolean sponsored;
    private String reviewUrl;
    private Double cost;
    private Double weight;
    private String imageUrl;
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "user_profile_id", referencedColumnName = "id")
    private UserProfile userProfile;

    @ManyToOne
    @JoinColumn(name = "vehicle_info_id", referencedColumnName = "id")
    private VehicleInfo vehicleInfo;

}