import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { GET_RESIDENT_ANNOUNCEMENTS } from './announcements.graphql';
import { ToastService } from '../../../core/services/toast.service';

interface AnnouncementBuilding {
  id: string;
  name: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  buildings: AnnouncementBuilding[];
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-resident-announcements',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  templateUrl: './announcements.html',
  styleUrls: ['./announcements.css']
})
export class ResidentAnnouncementsComponent implements OnInit {
  private readonly apollo = inject(Apollo);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly currentUser = this.userService.currentUser;
  readonly announcements = signal<Announcement[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selectedCategory = signal<string>('ALL');

  readonly categories = [
    { value: 'ALL', label: 'All', color: 'bg-gray-500' },
    { value: 'WATER', label: 'Water', color: 'bg-blue-500' },
    { value: 'INTERNET', label: 'Internet', color: 'bg-purple-500' },
    { value: 'ELECTRICITY', label: 'Electricity', color: 'bg-yellow-500' },
    { value: 'MAINTENANCE', label: 'Maintenance', color: 'bg-orange-500' },
    { value: 'GENERAL', label: 'General', color: 'bg-gray-500' }
  ];

  readonly filteredAnnouncements = computed(() => {
    const category = this.selectedCategory();
    if (category === 'ALL') {
      return this.announcements();
    }
    return this.announcements().filter(a => a.category === category);
  });

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.loading.set(true);

    this.apollo
      .query<{ residentAnnouncements: Announcement[] }>({
        query: GET_RESIDENT_ANNOUNCEMENTS,
        fetchPolicy: 'network-only'
      })
      .subscribe({
        next: ({ data }) => {
          this.announcements.set(data.residentAnnouncements);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading announcements:', error);
          this.toastService.showError('Failed to load announcements');
          this.loading.set(false);
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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

