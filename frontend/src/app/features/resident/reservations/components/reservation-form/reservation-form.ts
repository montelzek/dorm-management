import { Component, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { Building, ReservationResource, TimeSlot } from '../../../../../shared/models/graphql.types';

export interface ReservationFormData {
  buildingId: string;
  resourceId: string;
  date?: string;
  laundrySlot?: string;
  startTime?: string;
  endTime?: string;
  startTimeHour?: string; // New field for Standard Resource
  endTimeHour?: string; // New field for Standard Resource
}

@Component({
  selector: 'app-reservation-form',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './reservation-form.html',
  styleUrl: './reservation-form.css'
})
export class ReservationFormComponent {
  readonly form = input.required<FormGroup>();
  readonly buildings = input<Building[]>([]);
  readonly resources = input<ReservationResource[]>([]);
  readonly slots = input<TimeSlot[]>([]);
  readonly selectedResource = input<ReservationResource | null>(null);
  readonly isLoading = input<boolean>(false);

  readonly formSubmit = output<ReservationFormData>();
  readonly stringifySlot = output<(slot: TimeSlot) => string>();
  readonly cancel = output<void>();

  onFormSubmit(): void {
    if (this.form().valid) {
      this.formSubmit.emit(this.form().value);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form().controls).forEach(key => {
      const control = this.form().get(key);
      control?.markAsTouched();
    });
  }

  onStringifySlot(slot: TimeSlot): string {
    return JSON.stringify(slot);
  }

  onCancel(): void {
    this.cancel.emit();
  }

      getAvailableHours(): string[] {
        // Use available slots from backend instead of hardcoded hours
        const availableSlots = this.slots();
        if (availableSlots.length > 0) {
          return availableSlots.map(slot => {
            const startTime = new Date(slot.startTime);
            return `${startTime.getHours().toString().padStart(2, '0')}:00`;
          });
        }
        
        // Fallback: Generate hours from 8:00 to 22:00 (8 AM to 10 PM)
        const hours: string[] = [];
        for (let hour = 8; hour <= 22; hour++) {
          hours.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return hours;
      }

  get isLaundryResource(): boolean {
    return this.selectedResource()?.resourceType === 'LAUNDRY';
  }

  get isStandardResource(): boolean {
    return this.selectedResource()?.resourceType === 'STANDARD';
  }
}
