import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { AnnouncementsService, Announcement, CreateAnnouncementInput, UpdateAnnouncementInput } from './services/announcements.service';
import { FacilitiesService } from '../facilities-management/services/facilities.service';
import { ToastService } from '../../../core/services/toast.service';
import { AnnouncementFormModalComponent } from './components/announcement-form-modal/announcement-form-modal';
import { DeleteConfirmationModalComponent } from '../facilities-management/components/delete-confirmation-modal/delete-confirmation-modal';

@Component({
  selector: 'app-announcements-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainLayoutComponent,
    AnnouncementFormModalComponent,
    DeleteConfirmationModalComponent
  ],
  templateUrl: './announcements-management.html',
  styleUrls: ['./announcements-management.css']
})
export class AnnouncementsManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly currentUser = this.userService.currentUser;
  
  // State
  readonly announcements = this.announcementsService.announcements;
  readonly loading = this.announcementsService.loading;
  readonly currentPage = this.announcementsService.currentPage;
  readonly totalPages = this.announcementsService.totalPages;
  readonly totalElements = this.announcementsService.totalElements;
  
  readonly selectedCategory = signal<string>('ALL');
  
  // Buildings
  readonly allBuildings = this.facilitiesService.allBuildings;
  
  // Modal states
  readonly isFormModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  
  // Edit mode
  readonly isEditMode = signal<boolean>(false);
  readonly selectedAnnouncement = signal<Announcement | null>(null);
  readonly announcementToDelete = signal<Announcement | null>(null);
  
  // Form
  readonly announcementForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    content: ['', [Validators.required, Validators.maxLength(2000)]],
    category: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    buildingIds: [[] as string[], Validators.required]
  });

  // Categories
  readonly categories = [
    { value: 'ALL', label: 'All', color: 'bg-gray-500' },
    { value: 'WATER', label: 'Water', color: 'bg-blue-500' },
    { value: 'INTERNET', label: 'Internet', color: 'bg-purple-500' },
    { value: 'ELECTRICITY', label: 'Electricity', color: 'bg-yellow-500' },
    { value: 'MAINTENANCE', label: 'Maintenance', color: 'bg-orange-500' },
    { value: 'GENERAL', label: 'General', color: 'bg-gray-500' }
  ];

  // Filtered announcements
  readonly filteredAnnouncements = computed(() => {
    const category = this.selectedCategory();
    if (category === 'ALL') {
      return this.announcements();
    }
    return this.announcements().filter(a => a.category === category);
  });

  ngOnInit(): void {
    this.facilitiesService.getAllBuildings();
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementsService.loadAnnouncements(this.currentPage(), 10).subscribe({
      error: (error) => {
        console.error('Error loading announcements:', error);
        this.toastService.showError('Failed to load announcements');
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedAnnouncement.set(null);
    this.announcementForm.reset();
    this.isFormModalOpen.set(true);
  }

  openEditModal(announcement: Announcement): void {
    this.isEditMode.set(true);
    this.selectedAnnouncement.set(announcement);
    
    this.announcementForm.patchValue({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      startDate: announcement.startDate,
      endDate: announcement.endDate,
      buildingIds: announcement.buildings.map(b => b.id)
    });
    
    this.isFormModalOpen.set(true);
  }

  openDeleteModal(announcement: Announcement): void {
    this.announcementToDelete.set(announcement);
    this.isDeleteModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.announcementForm.reset();
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.announcementToDelete.set(null);
  }

  onFormSubmit(): void {
    if (this.announcementForm.invalid) {
      this.toastService.showError('Please fix the form errors before submitting');
      return;
    }

    const formValue = this.announcementForm.getRawValue();
    
    if (this.isEditMode() && this.selectedAnnouncement()) {
      const input: UpdateAnnouncementInput = {
        title: formValue.title!,
        content: formValue.content!,
        category: formValue.category!,
        startDate: formValue.startDate!,
        endDate: formValue.endDate!,
        buildingIds: formValue.buildingIds!
      };

      this.announcementsService.updateAnnouncement(this.selectedAnnouncement()!.id, input).subscribe({
        next: () => {
          this.toastService.showSuccess('Announcement updated successfully');
          this.closeFormModal();
          this.loadAnnouncements();
        },
        error: (error) => {
          console.error('Update error:', error);
          this.toastService.showError('Failed to update announcement');
        }
      });
    } else {
      const input: CreateAnnouncementInput = {
        title: formValue.title!,
        content: formValue.content!,
        category: formValue.category!,
        startDate: formValue.startDate!,
        endDate: formValue.endDate!,
        buildingIds: formValue.buildingIds!
      };

      this.announcementsService.createAnnouncement(input).subscribe({
        next: () => {
          this.toastService.showSuccess('Announcement created successfully');
          this.closeFormModal();
          this.loadAnnouncements();
        },
        error: (error) => {
          console.error('Create error:', error);
          this.toastService.showError('Failed to create announcement');
        }
      });
    }
  }

  confirmDelete(): void {
    const announcement = this.announcementToDelete();
    if (!announcement) return;

    this.announcementsService.deleteAnnouncement(announcement.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Announcement deleted successfully');
        this.closeDeleteModal();
        this.loadAnnouncements();
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.toastService.showError('Failed to delete announcement');
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  getCategoryColor(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.color || 'bg-gray-500';
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.label || category;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.announcementsService.loadAnnouncements(page, 10).subscribe();
    }
  }
}

