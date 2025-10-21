import {Component, computed, input, signal} from '@angular/core';
import {ResidentPayload} from '../../models/resident.models';

type SortField = 'firstName' | 'lastName';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-resident-list',
  imports: [],
  templateUrl: 'resident-list.html'
})
export class ResidentListComponent {
  readonly residents = input<ResidentPayload[]>([]);
  
  readonly sortField = signal<SortField>('firstName');
  readonly sortDirection = signal<SortDirection>('asc');
  
  readonly sortedResidents = computed(() => {
    const residents = [...this.residents()];
    const field = this.sortField();
    const direction = this.sortDirection();
    
    return residents.sort((a, b) => {
      const aValue = a[field].toLowerCase();
      const bValue = b[field].toLowerCase();
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });
  
  onSort(field: SortField): void {
    if (this.sortField() === field) {
      // Toggle direction if same field
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }
}
