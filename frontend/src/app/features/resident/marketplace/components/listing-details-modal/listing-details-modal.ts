import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MarketplaceListing, MarketplaceService } from '../../services/marketplace.service';
import { User } from '../../../../../shared/models/graphql.types';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-listing-details-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './listing-details-modal.html'
})
export class ListingDetailsModalComponent {
  @Input({ required: true }) listing!: MarketplaceListing;
  @Input() currentUser: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  private readonly marketplaceService = inject(MarketplaceService);
  private readonly toastService = inject(ToastService);

  readonly currentImageIndex = signal<number>(0);
  readonly showDeleteConfirm = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);

  onClose(): void {
    this.close.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  async onDelete(): Promise<void> {
    this.isDeleting.set(true);
    try {
      await this.marketplaceService.deleteListing(this.listing.id);
      this.toastService.showSuccess('toast.success.listingDeleted');
      this.delete.emit();
    } catch (error) {
      this.toastService.showError('toast.error.deletingListing');
      this.isDeleting.set(false);
    }
  }

  nextImage(): void {
    if (this.listing.imageFilenames.length > 0) {
      this.currentImageIndex.set(
        (this.currentImageIndex() + 1) % this.listing.imageFilenames.length
      );
    }
  }

  prevImage(): void {
    if (this.listing.imageFilenames.length > 0) {
      this.currentImageIndex.set(
        (this.currentImageIndex() - 1 + this.listing.imageFilenames.length) % this.listing.imageFilenames.length
      );
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

  formatPrice(price: number): string {
    return `${price.toFixed(2)} PLN`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

