import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room, SimpleBuild } from '../../services/facilities.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './rooms-list.html'
})
export class RoomsListComponent {
  readonly rooms = input.required<Room[]>();
  readonly buildings = input.required<SimpleBuild[]>();
  readonly isLoading = input<boolean>(false);
  readonly selectedBuilding = input<string>('');
  readonly selectedStatus = input<string>('');

  readonly edit = output<Room>();
  readonly delete = output<Room>();
  readonly add = output<void>();
  readonly buildingFilterChange = output<string>();
  readonly statusFilterChange = output<string>();

  getOccupancyBadgeClass(occupancy: number, capacity: number): string {
    if (occupancy === 0) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (occupancy < capacity) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }

  getOccupancyLabel(occupancy: number, capacity: number): string {
    if (occupancy === 0) return 'Free';
    if (occupancy < capacity) return 'Partial';
    return 'Full';
  }
}
