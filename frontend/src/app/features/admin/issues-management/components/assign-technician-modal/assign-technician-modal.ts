import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Technician } from '../../services/admin-issue.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-assign-technician-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './assign-technician-modal.html'
})
export class AssignTechnicianModalComponent {
  readonly technicians = input.required<Technician[]>();
  readonly currentTechnicianId = input<string | null>(null);
  readonly isLoading = input<boolean>(false);

  readonly assign = output<string>();
  readonly cancel = output<void>();

  selectedTechnicianId: string = '';

  ngOnInit(): void {
    const currentId = this.currentTechnicianId();
    if (currentId) {
      this.selectedTechnicianId = currentId;
    }
  }

  onAssign(): void {
    if (this.selectedTechnicianId) {
      this.assign.emit(this.selectedTechnicianId);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
