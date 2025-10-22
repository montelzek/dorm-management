import {Component, input, output} from '@angular/core';
import {ResidentPayload} from '../../models/resident.models';

@Component({
  selector: 'app-resident-list',
  imports: [],
  templateUrl: 'resident-list.html'
})
export class ResidentListComponent {
  readonly residents = input<ResidentPayload[]>([]);
  readonly sortBy = input<string>('firstName');
  readonly sortDirection = input<'asc' | 'desc'>('asc');
  
  readonly assignRoom = output<ResidentPayload>();
  readonly deleteResident = output<ResidentPayload>();
  readonly sortChange = output<string>();
  
  onSort(field: string): void {
    this.sortChange.emit(field);
  }

  onAssignRoom(resident: ResidentPayload): void {
    this.assignRoom.emit(resident);
  }

  onDeleteResident(resident: ResidentPayload): void {
    this.deleteResident.emit(resident);
  }

  hasRoom(resident: ResidentPayload): boolean {
    return resident.roomNumber !== 'N/A' && resident.roomId != null;
  }
}
