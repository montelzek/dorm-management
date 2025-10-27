package com.montelzek.mydorm.marketplace;

import com.montelzek.mydorm.marketplace.payload.*;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MarketplaceListingService {

    private final MarketplaceListingRepository marketplaceListingRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<MarketplaceListingPayload> getAllListings(String category, String listingType, Long currentUserId) {
        EItemCategory categoryEnum = category != null && !category.isEmpty() ? EItemCategory.valueOf(category) : null;
        EListingType listingTypeEnum = listingType != null && !listingType.isEmpty() ? EListingType.valueOf(listingType) : null;

        List<MarketplaceListing> listings = marketplaceListingRepository.findAllWithUserFiltered(categoryEnum, listingTypeEnum);
        
        return listings.stream()
                .map(listing -> toPayload(listing, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MarketplaceListingPayload> getMyListings(Long userId) {
        List<MarketplaceListing> listings = marketplaceListingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return listings.stream()
                .map(listing -> toPayload(listing, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public MarketplaceListingPayload createListing(Long userId, CreateListingInput input) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

        // Validate image filenames (max 3)
        if (input.imageFilenames() != null && input.imageFilenames().size() > 3) {
            throw new IllegalArgumentException("Maximum 3 images allowed");
        }

        MarketplaceListing listing = new MarketplaceListing();
        listing.setUser(user);
        listing.setTitle(input.title());
        listing.setDescription(input.description());
        listing.setListingType(EListingType.valueOf(input.listingType()));
        listing.setCategory(EItemCategory.valueOf(input.category()));
        listing.setPrice(input.price());
        listing.setImageFilenames(input.imageFilenames() != null ? input.imageFilenames() : List.of());

        MarketplaceListing savedListing = marketplaceListingRepository.save(listing);
        return toPayload(savedListing, userId);
    }

    @Transactional
    public MarketplaceListingPayload updateListing(Long id, Long userId, UpdateListingInput input) {
        MarketplaceListing listing = marketplaceListingRepository.findByIdWithUser(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + id));

        // Verify ownership
        if (!listing.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own listings");
        }

        // Validate image filenames (max 3)
        if (input.imageFilenames() != null && input.imageFilenames().size() > 3) {
            throw new IllegalArgumentException("Maximum 3 images allowed");
        }

        listing.setTitle(input.title());
        listing.setDescription(input.description());
        listing.setListingType(EListingType.valueOf(input.listingType()));
        listing.setCategory(EItemCategory.valueOf(input.category()));
        listing.setPrice(input.price());
        listing.setImageFilenames(input.imageFilenames() != null ? input.imageFilenames() : List.of());

        MarketplaceListing updatedListing = marketplaceListingRepository.save(listing);
        return toPayload(updatedListing, userId);
    }

    @Transactional
    public Boolean deleteListing(Long id, Long userId) {
        MarketplaceListing listing = marketplaceListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + id));

        // Verify ownership
        if (!listing.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own listings");
        }

        marketplaceListingRepository.delete(listing);
        return true;
    }

    public MarketplaceListingPayload toPayload(MarketplaceListing listing, Long currentUserId) {
        User user = listing.getUser();
        
        ContactInfoPayload contactInfo = new ContactInfoPayload(
                user.getEmail(),
                user.getPhone(),
                user.getFirstName(),
                user.getLastName()
        );

        Boolean isOwnListing = currentUserId != null && user.getId().equals(currentUserId);

        return new MarketplaceListingPayload(
                listing.getId(),
                listing.getTitle(),
                listing.getDescription(),
                listing.getListingType().name(),
                listing.getCategory().name(),
                listing.getPrice(),
                listing.getImageFilenames(),
                contactInfo,
                listing.getCreatedAt(),
                listing.getUpdatedAt(),
                isOwnListing
        );
    }
}


