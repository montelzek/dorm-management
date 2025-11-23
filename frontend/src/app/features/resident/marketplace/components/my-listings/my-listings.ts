import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MarketplaceListing, MarketplaceService } from '../../services/marketplace.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ListingFormModalComponent } from '../listing-form-modal/listing-form-modal';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, ListingFormModalComponent, TranslateModule],
  templateUrl: './my-listings.html'
})
export class MyListingsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  private readonly marketplaceService = inject(MarketplaceService);
  private readonly toastService = inject(ToastService);

  readonly myListings = this.marketplaceService.myListings;
  readonly loading = this.marketplaceService.loading;
  readonly selectedListing = signal<MarketplaceListing | null>(null);
  readonly showFormModal = signal<boolean>(false);
  readonly showDeleteConfirm = signal<string | null>(null);
  readonly isDeleting = signal<boolean>(false);

  ngOnInit(): void {
    this.marketplaceService.loadMyListings();
  }

  onClose(): void {
    this.close.emit();
  }

  openEditModal(listing: MarketplaceListing): void {
    this.selectedListing.set(listing);
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.selectedListing.set(null);
  }

  async handleFormSubmit(input: any): Promise<void> {
    try {
      if (this.selectedListing()) {
        await this.marketplaceService.updateListing(this.selectedListing()!.id, input);
        this.toastService.showSuccess('toast.success.listingUpdated');
      }
    } catch (error) {
      this.toastService.showError('toast.error.updatingListing');
    } finally {
      this.closeFormModal();
      this.marketplaceService.loadMyListings();
      this.refresh.emit();
    }
  }

  async deleteListing(id: string): Promise<void> {
    this.isDeleting.set(true);
    try {
      await this.marketplaceService.deleteListing(id);
      this.toastService.showSuccess('toast.success.listingDeleted');
      this.showDeleteConfirm.set(null);
      this.marketplaceService.loadMyListings();
      this.refresh.emit();
    } catch (error) {
      this.toastService.showError('toast.error.deletingListing');
    } finally {
      this.isDeleting.set(false);
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
    return type === 'SELL' ? 'bg-indigo-600' : 'bg-orange-600';
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

