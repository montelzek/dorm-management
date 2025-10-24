package com.montelzek.mydorm.marketplace;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MarketplaceListingRepository extends JpaRepository<MarketplaceListing, Long> {

    @Query("SELECT DISTINCT m FROM MarketplaceListing m LEFT JOIN FETCH m.user ORDER BY m.createdAt DESC")
    List<MarketplaceListing> findAllWithUser();

    @Query("SELECT DISTINCT m FROM MarketplaceListing m LEFT JOIN FETCH m.user " +
           "WHERE (:category IS NULL OR m.category = :category) " +
           "AND (:listingType IS NULL OR m.listingType = :listingType) " +
           "ORDER BY m.createdAt DESC")
    List<MarketplaceListing> findAllWithUserFiltered(
            @Param("category") EItemCategory category,
            @Param("listingType") EListingType listingType
    );

    @Query("SELECT DISTINCT m FROM MarketplaceListing m LEFT JOIN FETCH m.user WHERE m.user.id = :userId ORDER BY m.createdAt DESC")
    List<MarketplaceListing> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT DISTINCT m FROM MarketplaceListing m LEFT JOIN FETCH m.user WHERE m.id = :id")
    Optional<MarketplaceListing> findByIdWithUser(@Param("id") Long id);
}


