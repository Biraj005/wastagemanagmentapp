package com.wastemanagement.backend.repositories;

import com.wastemanagement.backend.entities.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DistrictRepository extends JpaRepository<District,Long> {
    Optional<District> findByName(String upperCase);
}
