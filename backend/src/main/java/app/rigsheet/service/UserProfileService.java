package app.rigsheet.service;

import app.rigsheet.model.UserProfile;
import app.rigsheet.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for {@link UserProfile} operations.
 *
 * <p>This class encapsulates all data access for user profiles and
 * provides a single place to evolve business logic in the future
 * (validation, events, caching, etc.) without changing controllers.</p>
 *
 * <p>Notes:
 * <ul>
 *   <li>All methods are simple pass-throughs to the repository for now.</li>
 *   <li>We use constructor injection for better testability and immutability.</li>
 *   <li>Method names are aligned with your existing code to avoid churn.</li>
 * </ul>
 * </p>
 */
@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Autowired
    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Find a user profile by its primary key.
     *
     * @param id the user profile ID
     * @return an {@link Optional} containing the profile if found; empty otherwise
     */
    public Optional<UserProfile> getUserProfileById(Long id) {
        return userProfileRepository.findById(id);
    }

    /**
     * Find a user profile by its unique username/handle.
     *
     * @param username unique username
     * @return an {@link Optional} containing the profile if found; empty otherwise
     */
    public Optional<UserProfile> getUserProfileByUsername(String username) {
        return userProfileRepository.findByUsername(username);
    }

    /**
     * Persist a user profile.
     *
     * <p>If the entity has an ID that exists, this will perform an update; otherwise a create.</p>
     *
     * @param profile the user profile to save
     * @return the saved entity (with generated ID if created)
     */
    public UserProfile saveUserProfile(UserProfile profile) {
        return userProfileRepository.save(profile);
    }

    /**
     * Delete a user profile by ID.
     *
     * <p>Does not throw if the ID does not exist—delete is idempotent from JPA’s perspective.</p>
     *
     * @param id the user profile ID to delete
     */
    public void deleteUserProfile(Long id) {
        userProfileRepository.deleteById(id);
    }

    /**
     * Retrieve all user profiles.
     *
     * <p>Useful for admin views or sanity checks. Consider pagination later if this list grows.</p>
     *
     * @return list of all user profiles (possibly empty, never null)
     */
    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }
}
