package com.wastemanagement.backend.repositories;

import com.wastemanagement.backend.entities.Role;
import com.wastemanagement.backend.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(@Email(message = "Invalid email format") @NotBlank(message = "Email is required") String email);

    boolean existsByEmail(@Email(message = "Invalid email format") @NotBlank(message = "Email is required") String email);

    List<User> findByRole(Role role);
    Page<User> findByRole(Role role, Pageable pageable);

    long countByRole(Role role);
}
