import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { MarketplaceService, MarketplaceListing } from './services/marketplace.service';
import { ToastService } from '../../../core/services/toast.service';
import { ListingFormModalComponent } from './components/listing-form-modal/listing-form-modal';
import { ListingDetailsModalComponent } from './components/listing-details-modal/listing-details-modal';
import { MyListingsComponent } from './components/my-listings/my-listings';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    ListingFormModalComponent,
    ListingDetailsModalComponent,
    MyListingsComponent,
    TranslateModule
  ],
  templateUrl: './marketplace.html'
})
export class MarketplaceComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly marketplaceService = inject(MarketplaceService);
  private readonly toastService = inject(ToastService);

  readonly currentUser = this.userService.currentUser;
  readonly listings = this.marketplaceService.listings;
  readonly loading = this.marketplaceService.loading;

  readonly selectedCategory = signal<string>('ALL');
  readonly selectedListingType = signal<string>('ALL');
  readonly selectedListing = signal<MarketplaceListing | null>(null);

  readonly showFormModal = signal<boolean>(false);
  readonly showDetailsModal = signal<boolean>(false);
  readonly showMyListings = signal<boolean>(false);

  readonly categories = [
    { value: 'ALL', label: 'marketplace.categories.ALL' },
    { value: 'TEXTBOOKS', label: 'marketplace.categories.TEXTBOOKS' },
    { value: 'FURNITURE', label: 'marketplace.categories.FURNITURE' },
    { value: 'ELECTRONICS', label: 'marketplace.categories.ELECTRONICS' },
    { value: 'OTHER', label: 'marketplace.categories.OTHER' }
  ];

  readonly listingTypes = [
    { value: 'ALL', label: 'marketplace.types.ALL' },
    { value: 'SELL', label: 'marketplace.types.SELL' },
    { value: 'BUY', label: 'marketplace.types.BUY' }
  ];

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.loadListings();
  }

  loadListings(): void {
    const category = this.selectedCategory() === 'ALL' ? null : this.selectedCategory();
    const listingType = this.selectedListingType() === 'ALL' ? null : this.selectedListingType();
    this.marketplaceService.loadListings(category, listingType);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.loadListings();
  }

  selectListingType(type: string): void {
    this.selectedListingType.set(type);
    this.loadListings();
  }

  openCreateModal(): void {
    this.selectedListing.set(null);
    this.showFormModal.set(true);
  }

  openDetailsModal(listing: MarketplaceListing): void {
    this.selectedListing.set(listing);
    this.showDetailsModal.set(true);
  }

  openMyListings(): void {
    this.showMyListings.set(true);
    this.marketplaceService.loadMyListings();
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.selectedListing.set(null);
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedListing.set(null);
  }

  closeMyListings(): void {
    this.showMyListings.set(false);
  }

  async handleFormSubmit(input: any): Promise<void> {
    try {
      if (this.selectedListing()) {
        await this.marketplaceService.updateListing(this.selectedListing()!.id, input);
        this.toastService.showSuccess('toast.success.listingUpdated');
      } else {
        await this.marketplaceService.createListing(input);
        this.toastService.showSuccess('toast.success.listingCreated');
      }
    } catch (error) {
      this.toastService.showError('toast.error.savingListing');
    } finally {
      this.closeFormModal();
      this.loadListings();
    }
  }

  getCategoryBadgeColor(category: string): string {
    const colors: Record<string, string> = {
      'TEXTBOOKS': 'bg-blue-600',
      'FURNITURE': 'bg-green-600',
      'ELECTRONICS': 'bg-purple-600',
      'OTHER': 'bg-gray-600'
    };
    return colors[category] || 'bg-gray-600';
  }

  getListingTypeBadgeColor(type: string): string {
    const colors: Record<string, string> = {
      'SELL': 'bg-green-600',
      'BUY': 'bg-blue-600',
      'EXCHANGE': 'bg-purple-600'
    };
    return colors[type] || 'bg-gray-600';
  }

  getCategoryKey(category: string): string {
    return `marketplace.categories.${category}`;
  }

  getListingTypeKey(type: string): string {
    return `marketplace.types.${type}`;
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} PLN`;
  }
}

