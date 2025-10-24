package com.montelzek.mydorm.marketplace.payload;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record MarketplaceListingPayload(
        Long id,
        String title,
        String description,
        String listingType,
        String category,
        BigDecimal price,
        List<String> imageFilenames,
        ContactInfoPayload contactInfo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isOwnListing
) {}


