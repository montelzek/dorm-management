import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

interface Building {
  id: string;
  name: string;
}

@Component({
  selector: 'app-announcement-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './announcement-form-modal.html'
})
export class AnnouncementFormModalComponent {
  form = input.required<FormGroup>();
  buildings = input<Building[]>([]);
  isLoading = input<boolean>(false);
  isEdit = input<boolean>(false);

  formSubmit = output<void>();
  cancel = output<void>();

  // Minimum date is today (in yyyy-MM-dd format)
  minDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  readonly categories = [
    { value: 'WATER', label: 'Water', color: 'bg-blue-500' },
    { value: 'INTERNET', label: 'Internet', color: 'bg-purple-500' },
    { value: 'ELECTRICITY', label: 'Electricity', color: 'bg-yellow-500' },
    { value: 'MAINTENANCE', label: 'Maintenance', color: 'bg-orange-500' },
    { value: 'GENERAL', label: 'General', color: 'bg-gray-500' }
  ];

  onSubmit(): void {
    if (this.form().valid) {
      this.formSubmit.emit();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  toggleBuilding(buildingId: string): void {
    const buildingIds = this.form().get('buildingIds')?.value || [];
    const index = buildingIds.indexOf(buildingId);
    
    if (index > -1) {
      buildingIds.splice(index, 1);
    } else {
      buildingIds.push(buildingId);
    }
    
    this.form().get('buildingIds')?.setValue([...buildingIds]);
  }

  isBuildingSelected(buildingId: string): boolean {
    const buildingIds = this.form().get('buildingIds')?.value || [];
    return buildingIds.includes(buildingId);
  }
}


