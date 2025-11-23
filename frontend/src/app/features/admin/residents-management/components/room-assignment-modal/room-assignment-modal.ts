import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ResidentPayload} from '../../models/resident.models';
import {RoomPayload} from '../../models/room.models';
import {ResidentService} from '../../services/resident';
import {FormsModule} from '@angular/forms';
import {ToastService} from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-room-assignment-modal',
  imports: [FormsModule, TranslateModule],
  templateUrl: './room-assignment-modal.html',
  styles: []
})
export class RoomAssignmentModalComponent {
  private readonly residentService = inject(ResidentService);
  private readonly toastService = inject(ToastService);

  readonly isOpen = input<boolean>(false);
  readonly resident = input<ResidentPayload | null>(null);
  readonly close = output<void>();
  readonly assigned = output<void>();

  readonly selectedBuildingId = signal<string>('');
  readonly selectedRoomId = signal<string>('');
  readonly availableRooms = signal<RoomPayload[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly buildings = this.residentService.buildings;

  readonly filteredRooms = computed(() => {
    const buildingId = this.selectedBuildingId();
    if (!buildingId) return [];
    return this.availableRooms().filter(room => room.buildingId === buildingId);
  });

  constructor() {
    effect(() => {
      const buildingId = this.selectedBuildingId();
      if (buildingId) {
        this.loadAvailableRooms(buildingId);
      } else {
        this.availableRooms.set([]);
      }
    });

    // Pre-select current building if resident has one
    effect(() => {
      const res = this.resident();
      if (res && res.buildingId) {
        this.selectedBuildingId.set(res.buildingId);
      }
    });
  }

  private loadAvailableRooms(buildingId: string) {
    this.residentService.getAvailableRooms(buildingId).subscribe({
      next: (rooms) => {
        this.availableRooms.set(rooms);
      },
      error: (err) => {
        console.error('Error loading available rooms:', err);
        this.toastService.showError('toast.error.loadingRooms');
      }
    });
  }

  onClose() {
    this.selectedBuildingId.set('');
    this.selectedRoomId.set('');
    this.availableRooms.set([]);
    this.close.emit();
  }

  onAssign() {
    const res = this.resident();
    const roomId = this.selectedRoomId();

    if (!res || !roomId) {
      this.toastService.showWarning('toast.warning.selectRoom');
      return;
    }

    this.isLoading.set(true);
    this.residentService.assignRoom(res.id, roomId).subscribe({
      next: () => {
        this.toastService.showSuccess('toast.success.roomAssigned');
        this.isLoading.set(false);
        this.assigned.emit();
        this.onClose();
      },
      error: (err) => {
        console.error('Error assigning room:', err);
        this.toastService.showError('toast.error.assigningRoom');
        this.isLoading.set(false);
      }
    });
  }
}

