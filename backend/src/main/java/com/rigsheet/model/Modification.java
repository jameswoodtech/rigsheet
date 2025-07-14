@Entity
public class Modification {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String category;
    private String brand;
    private String sponsor;
    private String reviewUrl;
    private Double cost;
}
