import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { ModalComponent } from '../../../../../shared/components/ui/modal/modal';

@Component({
    selector: 'app-technician-form-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ModalComponent, ButtonComponent],
    templateUrl: './technician-form-modal.html'
})
export class TechnicianFormModalComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @Output() submitForm = new EventEmitter<any>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        phone: ['', [Validators.maxLength(20)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    get f() { return this.form.controls; }

    onClose() {
        this.form.reset();
        this.close.emit();
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.submitForm.emit(this.form.value);
        this.form.reset();
    }
}
