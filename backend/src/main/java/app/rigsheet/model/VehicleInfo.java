package app.rigsheet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicle_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleYear;
    private String make;
    private String model;
    private String trim;
    private String color;
    private String nickname;
    private String imageUrl;

    @OneToOne
    @JoinColumn(name = "user_profile_id", referencedColumnName = "id")
    private UserProfile userProfile;

}
