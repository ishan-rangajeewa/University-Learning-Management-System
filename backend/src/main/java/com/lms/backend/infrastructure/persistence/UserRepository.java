package com.lms.backend.infrastructure.persistence;

import com.lms.backend.domain.enums.Role;
import com.lms.backend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

//    Optional<User> findByFirstNameAndLastName(String firstName, String lastName);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);
}