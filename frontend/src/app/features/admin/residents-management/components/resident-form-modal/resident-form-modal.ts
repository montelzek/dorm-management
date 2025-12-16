import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { ModalComponent } from '../../../../../shared/components/ui/modal/modal';

@Component({
    selector: 'app-resident-form-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ButtonComponent, ModalComponent],
    templateUrl: './resident-form-modal.html'
})
export class ResidentFormModalComponent {
    private readonly fb = inject(FormBuilder);

    readonly isOpen = input.required<boolean>();
    readonly close = output<void>();
    readonly submitForm = output<any>();

    readonly form = this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern('^[0-9+ ]*$')]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    onSubmit(): void {
        if (this.form.valid) {
            this.submitForm.emit(this.form.getRawValue());
            this.form.reset();
        } else {
            this.form.markAllAsTouched();
        }
    }

    onClose(): void {
        this.close.emit();
        this.form.reset();
    }
}
