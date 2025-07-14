@RestController
@RequestMapping(\"/api/mods\")
@CrossOrigin(origins = \"http://localhost:3000\") // for React dev
public class ModificationController {

    @Autowired
    private ModificationRepository repo;

    @GetMapping
    public List<Modification> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Modification create(@RequestBody Modification mod) {
        return repo.save(mod);
    }

    @DeleteMapping(\"/{id}\")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
