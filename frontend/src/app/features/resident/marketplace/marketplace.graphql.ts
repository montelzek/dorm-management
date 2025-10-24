import { gql } from 'apollo-angular';

export const GET_ALL_MARKETPLACE_LISTINGS = gql`
  query GetAllMarketplaceListings($category: String, $listingType: String) {
    allMarketplaceListings(category: $category, listingType: $listingType) {
      id
      title
      description
      listingType
      category
      price
      imageFilenames
      contactInfo {
        email
        phone
        firstName
        lastName
      }
      createdAt
      updatedAt
      isOwnListing
    }
  }
`;

export const GET_MY_MARKETPLACE_LISTINGS = gql`
  query GetMyMarketplaceListings {
    myMarketplaceListings {
      id
      title
      description
      listingType
      category
      price
      imageFilenames
      contactInfo {
        email
        phone
        firstName
        lastName
      }
      createdAt
      updatedAt
      isOwnListing
    }
  }
`;

export const CREATE_MARKETPLACE_LISTING = gql`
  mutation CreateMarketplaceListing($input: CreateListingInput!) {
    createMarketplaceListing(input: $input) {
      id
      title
      description
      listingType
      category
      price
      imageFilenames
      contactInfo {
        email
        phone
        firstName
        lastName
      }
      createdAt
      updatedAt
      isOwnListing
    }
  }
`;

export const UPDATE_MARKETPLACE_LISTING = gql`
  mutation UpdateMarketplaceListing($id: ID!, $input: UpdateListingInput!) {
    updateMarketplaceListing(id: $id, input: $input) {
      id
      title
      description
      listingType
      category
      price
      imageFilenames
      contactInfo {
        email
        phone
        firstName
        lastName
      }
      createdAt
      updatedAt
      isOwnListing
    }
  }
`;

export const DELETE_MARKETPLACE_LISTING = gql`
  mutation DeleteMarketplaceListing($id: ID!) {
    deleteMarketplaceListing(id: $id)
  }
`;


