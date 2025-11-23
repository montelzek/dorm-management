import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { SimpleBuild } from '../../services/facilities.service';

@Component({
  selector: 'app-room-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, TranslateModule],
  templateUrl: './room-form-modal.html'
})
export class RoomFormModalComponent {
  readonly form = input.required<FormGroup>();
  readonly buildings = input.required<SimpleBuild[]>();
  readonly standards = input.required<any[]>();
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
