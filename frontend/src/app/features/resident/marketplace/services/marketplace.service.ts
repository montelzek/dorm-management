import { Injectable, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { 
  GET_ALL_MARKETPLACE_LISTINGS, 
  GET_MY_MARKETPLACE_LISTINGS,
  CREATE_MARKETPLACE_LISTING,
  UPDATE_MARKETPLACE_LISTING,
  DELETE_MARKETPLACE_LISTING
} from '../marketplace.graphql';

export interface ContactInfo {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  listingType: string;
  category: string;
  price: number;
  imageFilenames: string[];
  contactInfo: ContactInfo;
  createdAt: string;
  updatedAt: string;
  isOwnListing: boolean;
}

export interface CreateListingInput {
  title: string;
  description: string;
  listingType: string;
  category: string;
  price: number;
  imageFilenames: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private readonly apollo = inject(Apollo);

  readonly listings = signal<MarketplaceListing[]>([]);
  readonly myListings = signal<MarketplaceListing[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selectedCategory = signal<string | null>(null);
  readonly selectedListingType = signal<string | null>(null);

  loadListings(category?: string | null, listingType?: string | null): void {
    this.loading.set(true);

    this.apollo
      .query<{ allMarketplaceListings: MarketplaceListing[] }>({
        query: GET_ALL_MARKETPLACE_LISTINGS,
        variables: {
          category: category || null,
          listingType: listingType || null
        },
        fetchPolicy: 'network-only'
      })
      .subscribe({
        next: ({ data }) => {
          this.listings.set(data.allMarketplaceListings);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  loadMyListings(): void {
    this.loading.set(true);

    this.apollo
      .query<{ myMarketplaceListings: MarketplaceListing[] }>({
        query: GET_MY_MARKETPLACE_LISTINGS,
        fetchPolicy: 'network-only'
      })
      .subscribe({
        next: ({ data }) => {
          this.myListings.set(data.myMarketplaceListings);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  createListing(input: CreateListingInput): Promise<MarketplaceListing> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate<{ createMarketplaceListing: MarketplaceListing }>({
          mutation: CREATE_MARKETPLACE_LISTING,
          variables: { input }
        })
        .subscribe({
          next: ({ data }) => {
            if (data?.createMarketplaceListing) {
              // Update local state
              this.listings.update(listings => [data.createMarketplaceListing, ...listings]);
              this.myListings.update(listings => [data.createMarketplaceListing, ...listings]);
              resolve(data.createMarketplaceListing);
            }
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  updateListing(id: string, input: CreateListingInput): Promise<MarketplaceListing> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate<{ updateMarketplaceListing: MarketplaceListing }>({
          mutation: UPDATE_MARKETPLACE_LISTING,
          variables: { id, input }
        })
        .subscribe({
          next: ({ data }) => {
            if (data?.updateMarketplaceListing) {
              // Update local state
              this.listings.update(listings =>
                listings.map(l => l.id === id ? data.updateMarketplaceListing : l)
              );
              this.myListings.update(listings =>
                listings.map(l => l.id === id ? data.updateMarketplaceListing : l)
              );
              resolve(data.updateMarketplaceListing);
            }
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  deleteListing(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate<{ deleteMarketplaceListing: boolean }>({
          mutation: DELETE_MARKETPLACE_LISTING,
          variables: { id }
        })
        .subscribe({
          next: ({ data }) => {
            if (data?.deleteMarketplaceListing) {
              // Update local state
              this.listings.update(listings => listings.filter(l => l.id !== id));
              this.myListings.update(listings => listings.filter(l => l.id !== id));
              resolve(true);
            }
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }
}


