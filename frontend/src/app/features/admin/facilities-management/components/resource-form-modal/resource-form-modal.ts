import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { SimpleBuild } from '../../services/facilities.service';

@Component({
  selector: 'app-resource-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './resource-form-modal.html'
})
export class ResourceFormModalComponent {
  readonly form = input.required<FormGroup>();
  readonly buildings = input.required<SimpleBuild[]>();
  readonly isLoading = input<boolean>(false);
  readonly isEdit = input<boolean>(false);

  readonly formSubmit = output<void>();
  readonly cancel = output<void>();

  onSubmit(): void {
    if (this.form().valid) {
      this.formSubmit.emit();
    } else {
      this.form().markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

