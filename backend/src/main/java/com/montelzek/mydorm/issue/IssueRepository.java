package com.montelzek.mydorm.issue;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    
    List<Issue> findByUserId(Long userId);
    
    List<Issue> findByUserIdAndStatus(Long userId, EIssueStatus status);
    
    // Admin methods for pagination and filtering
    Page<Issue> findByStatus(EIssueStatus status, Pageable pageable);
    
    Page<Issue> findByPriority(EIssuePriority priority, Pageable pageable);
    
    Page<Issue> findByBuildingId(Long buildingId, Pageable pageable);
    
    Long countByStatus(EIssueStatus status);
    
    @Query(value = "SELECT i FROM Issue i " +
            "WHERE " +
            "(:status IS NULL OR i.status = :status) AND " +
            "(:priority IS NULL OR i.priority = :priority) AND " +
            "(:buildingId IS NULL OR i.building.id = :buildingId)",
            countQuery = "SELECT COUNT(i) FROM Issue i " +
            "WHERE " +
            "(:status IS NULL OR i.status = :status) AND " +
            "(:priority IS NULL OR i.priority = :priority) AND " +
            "(:buildingId IS NULL OR i.building.id = :buildingId)")
    Page<Issue> findByFilters(@Param("status") EIssueStatus status,
                               @Param("priority") EIssuePriority priority,
                               @Param("buildingId") Long buildingId,
                               Pageable pageable);

    Long countByPriority(EIssuePriority priority);

    @Query("SELECT i FROM Issue i LEFT JOIN FETCH i.user u LEFT JOIN FETCH i.building b ORDER BY i.createdAt DESC")
    List<Issue> findTop5ByOrderByCreatedAtDesc();
}

