import { Component, EventEmitter, Input, OnInit, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MarketplaceListing } from '../../services/marketplace.service';
import { firstValueFrom } from 'rxjs';

interface ImagePreview {
  file?: File;
  url: string;
  filename?: string;
}

@Component({
  selector: 'app-listing-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './listing-form-modal.html'
})
export class ListingFormModalComponent implements OnInit {
  @Input() listing: MarketplaceListing | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  readonly isLoading = signal<boolean>(false);
  readonly imagePreviews = signal<ImagePreview[]>([]);
  readonly uploadError = signal<string | null>(null);

  readonly categories = [
    { value: 'TEXTBOOKS', label: 'Textbooks' },
    { value: 'FURNITURE', label: 'Furniture' },
    { value: 'ELECTRONICS', label: 'Electronics' },
    { value: 'OTHER', label: 'Other' }
  ];

  readonly listingTypes = [
    { value: 'SELL', label: 'Sell' },
    { value: 'BUY', label: 'Buy' }
  ];

  ngOnInit(): void {
    this.initForm();
    if (this.listing) {
      this.populateForm();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      listingType: ['SELL', Validators.required],
      category: ['TEXTBOOKS', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  populateForm(): void {
    if (!this.listing) return;

    this.form.patchValue({
      title: this.listing.title,
      description: this.listing.description,
      listingType: this.listing.listingType,
      category: this.listing.category,
      price: this.listing.price
    });

    // Load existing images
    const previews: ImagePreview[] = this.listing.imageFilenames.map(filename => ({
      url: `http://localhost:8080/api/files/${filename}`,
      filename: filename
    }));
    this.imagePreviews.set(previews);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const currentPreviews = this.imagePreviews();
    const remainingSlots = 3 - currentPreviews.length;

    if (remainingSlots <= 0) {
      this.uploadError.set('Maximum 3 images allowed');
      return;
    }

    const filesToAdd = Array.from(input.files).slice(0, remainingSlots);

    for (const file of filesToAdd) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        this.uploadError.set('Only JPG, PNG, and WEBP images are allowed');
        continue;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.uploadError.set('File size must not exceed 5MB');
        continue;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.update(previews => [
          ...previews,
          { file, url: e.target?.result as string }
        ]);
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    input.value = '';
  }

  removeImage(index: number): void {
    this.imagePreviews.update(previews => previews.filter((_, i) => i !== index));
    this.uploadError.set(null);
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid) return;

    this.isLoading.set(true);
    this.uploadError.set(null);

    try {
      const imageFilenames: string[] = [];

      // Upload new files
      for (const preview of this.imagePreviews()) {
        if (preview.file) {
          // New file - upload it
          const formData = new FormData();
          formData.append('file', preview.file);

          const response = await firstValueFrom(
            this.http.post<{ filename: string, url: string }>('http://localhost:8080/api/files/upload', formData)
          );
          imageFilenames.push(response.filename);
        } else if (preview.filename) {
          // Existing file - keep filename
          imageFilenames.push(preview.filename);
        }
      }

      // Create clean input object with only required fields
      const input = {
        title: this.form.value.title,
        description: this.form.value.description,
        listingType: this.form.value.listingType,
        category: this.form.value.category,
        price: Number(this.form.value.price),
        imageFilenames
      };

      this.formSubmit.emit(input);
      
      // Reset loading state after a short delay to allow parent to process
      setTimeout(() => this.isLoading.set(false), 100);
    } catch (error: any) {
      this.uploadError.set(error.error?.error || 'Failed to upload images');
      this.isLoading.set(false);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get isEdit(): boolean {
    return this.listing !== null;
  }

  get canAddMore(): boolean {
    return this.imagePreviews().length < 3;
  }
}

