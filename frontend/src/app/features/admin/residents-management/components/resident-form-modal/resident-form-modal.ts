import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { ModalComponent } from '../../../../../shared/components/ui/modal/modal';
import { ResidentService } from '../../services/resident';

@Component({
    selector: 'app-resident-form-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ButtonComponent, ModalComponent],
    templateUrl: './resident-form-modal.html'
})
export class ResidentFormModalComponent {
    private readonly fb = inject(FormBuilder);
    protected readonly residentService = inject(ResidentService);

    readonly isOpen = input.required<boolean>();
    readonly close = output<void>();
    readonly submitForm = output<any>();

    readonly rooms = signal<any[]>([]);
    readonly isLoadingRooms = signal<boolean>(false);

    readonly form = this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern('^[0-9+ ]*$')]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        buildingId: [''], // Helper control for UI
        roomId: ['']
    });

    constructor() {
        // Load buildings when component is improved (or when modal opens if we used an effect, but constructor is fine for now if service handles caching or we call it)
        this.residentService.getBuildings();
    }

    onBuildingChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const buildingId = select.value;

        this.form.patchValue({ roomId: '' }); // Reset room selection
        this.rooms.set([]);

        if (buildingId) {
            this.isLoadingRooms.set(true);
            this.residentService.getAvailableRooms(buildingId).subscribe({
                next: (rooms) => {
                    this.rooms.set(rooms);
                    this.isLoadingRooms.set(false);
                },
                error: () => this.isLoadingRooms.set(false)
            });
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            // Exclude buildingId from payload if backend doesn't need it (it likely doesn't, only roomId)
            const { buildingId, ...payload } = this.form.getRawValue();

            // If roomId is empty string, make it null or prevent sending? 
            // Backend probably handles null.
            const finalPayload = {
                ...payload,
                roomId: payload.roomId || null
            };

            this.submitForm.emit(finalPayload);
            this.resetForm();
        } else {
            this.form.markAllAsTouched();
        }
    }

    onClose(): void {
        this.close.emit();
        this.resetForm();
    }

    private resetForm(): void {
        this.form.reset();
        this.rooms.set([]);
    }
}
