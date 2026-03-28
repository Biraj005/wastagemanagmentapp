package com.wastemanagement.backend.repositories;

import com.wastemanagement.backend.entities.Complaint;
import com.wastemanagement.backend.entities.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.net.ContentHandler;
import java.util.List;
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Basic queries
    List<Complaint> findByUserId(Long userId);
    List<Complaint> findByDistrictId(Long districtId);

    // Pagination queries (use Page)
    Page<Complaint> findByDistrictId(Long districtId, Pageable pageable);
    Page<Complaint> findByStatus(Status status, Pageable pageable);
    Page<Complaint> findByDistrictIdAndStatus(Long districtId, Status status, Pageable pageable);

    // Count queries
    long countByDistrictIdAndStatus(Long districtId, Status status);
    long countByDistrictId(Long districtId);
    long countByStatus(Status status);
}