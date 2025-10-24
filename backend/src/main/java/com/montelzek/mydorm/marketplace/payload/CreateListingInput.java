package com.montelzek.mydorm.marketplace.payload;

import java.math.BigDecimal;
import java.util.List;

public record CreateListingInput(
        String title,
        String description,
        String listingType,
        String category,
        BigDecimal price,
        List<String> imageFilenames
) {}


