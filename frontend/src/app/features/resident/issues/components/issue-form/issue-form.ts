import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, TranslateModule],
  templateUrl: './issue-form.html'
})
export class IssueFormComponent {
  readonly form = input.required<FormGroup>();
  readonly isLoading = input<boolean>(false);

  readonly formSubmit = output<void>();
  readonly cancel = output<void>();

  onSubmit(): void {
    if (this.form().valid) {
      this.formSubmit.emit();
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form().controls).forEach(key => {
      const control = this.form().get(key);
      control?.markAsTouched();
    });
  }
}

