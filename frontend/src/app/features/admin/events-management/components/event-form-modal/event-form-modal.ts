import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

interface Building {
  id: string;
  name: string;
}

interface Room {
  id: string;
  roomNumber: string;
  buildingId: string;
}

@Component({
  selector: 'app-event-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form-modal.html'
})
export class EventFormModalComponent {
  form = input.required<FormGroup>();
  buildings = input<Building[]>([]);
  rooms = input<Room[]>([]);
  isLoading = input<boolean>(false);
  isEdit = input<boolean>(false);

  formSubmit = output<void>();
  cancel = output<void>();

  // Minimum date is today (in yyyy-MM-dd format)
  minDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  onSubmit(): void {
    if (this.form().valid) {
      this.formSubmit.emit();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get filteredRooms(): Room[] {
    const buildingId = this.form().get('buildingId')?.value;
    if (!buildingId) {
      return [];
    }
    return this.rooms().filter(room => room.buildingId === buildingId);
  }
}

