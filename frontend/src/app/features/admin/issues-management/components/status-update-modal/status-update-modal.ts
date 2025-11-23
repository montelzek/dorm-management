import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-status-update-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, TranslateModule],
  templateUrl: './status-update-modal.html'
})
export class StatusUpdateModalComponent {
  readonly form = input.required<FormGroup>();
  readonly currentStatus = input.required<string>();
  readonly isLoading = input<boolean>(false);

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

