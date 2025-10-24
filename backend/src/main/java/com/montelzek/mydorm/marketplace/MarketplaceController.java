package com.montelzek.mydorm.marketplace;

import com.montelzek.mydorm.marketplace.payload.*;
import com.montelzek.mydorm.security.UserDetailsImpl;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class MarketplaceController {

    private final MarketplaceListingService marketplaceListingService;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<MarketplaceListingPayload> allMarketplaceListings(
            @Argument String category,
            @Argument String listingType,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return marketplaceListingService.getAllListings(category, listingType, userDetails.getId());
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<MarketplaceListingPayload> myMarketplaceListings(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return marketplaceListingService.getMyListings(userDetails.getId());
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public MarketplaceListingPayload createMarketplaceListing(
            @Argument CreateListingInput input,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return marketplaceListingService.createListing(userDetails.getId(), input);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public MarketplaceListingPayload updateMarketplaceListing(
            @Argument Long id,
            @Argument UpdateListingInput input,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return marketplaceListingService.updateListing(id, userDetails.getId(), input);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public Boolean deleteMarketplaceListing(
            @Argument Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return marketplaceListingService.deleteListing(id, userDetails.getId());
    }
}


