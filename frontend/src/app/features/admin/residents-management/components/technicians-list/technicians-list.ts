import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '../../../../../core/services/toast.service';
import { ResidentService } from '../../services/resident';
import { ResidentPayload } from '../../models/resident.models';
import { TechnicianFormModalComponent } from '../technician-form-modal/technician-form-modal';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog';

@Component({
    selector: 'app-technicians-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TechnicianFormModalComponent,
        ConfirmationDialogComponent
    ],
    templateUrl: './technicians-list.html'
})
export class TechniciansListComponent implements OnInit {
    protected readonly Math = Math;
    private residentService = inject(ResidentService);
    private toastService = inject(ToastService);

    // Signals
    technicians = signal<ResidentPayload[]>([]);
    totalElements = signal(0);
    totalPages = signal(0);
    currentPage = signal(0);
    pageSize = signal(10);
    isLoading = signal(false);

    // Filter signals
    searchQuery = signal('');
    page = signal(0);
    size = signal(10);
    sortBy = signal('firstName');
    sortDirection = signal<'asc' | 'desc'>('asc');

    // Modals
    isCreateModalOpen = signal(false);
    isDeleteDialogOpen = signal(false);
    technicianToDelete = signal<ResidentPayload | null>(null);

    ngOnInit() {
        this.loadTechnicians();
    }

    loadTechnicians() {
        this.isLoading.set(true);


        this.residentService.getAllTechnicians(
            this.page(),
            this.size(),
            this.searchQuery() || undefined,
            this.sortBy(),
            this.sortDirection()
        );
    }


    readonly data = this.residentService.allResidents;
  readonly serviceTotalPages = this.residentService.totalPages;


    onSearchChange(query: string) {
        this.searchQuery.set(query);
        this.page.set(0);
        this.loadTechnicians();
    }

    onPageChange(newPage: number) {
        this.page.set(newPage);
        this.loadTechnicians();
    }

    onPageSizeChange(newSize: number) {
        this.size.set(newSize);
        this.page.set(0);
        this.loadTechnicians();
    }

    onSort(field: string) {
        if (this.sortBy() === field) {
            this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
        } else {
            this.sortBy.set(field);
            this.sortDirection.set('asc');
        }
        this.loadTechnicians();
    }

    openCreateModal() {
        this.isCreateModalOpen.set(true);
    }

    closeCreateModal() {
        this.isCreateModalOpen.set(false);
    }

    onTechnicianSubmit(data: any) {
        this.residentService.createTechnician(data).subscribe({
            next: () => {
                this.toastService.showSuccess('users.technicians.createdSuccess'); // Need to ensure this key exists or use generic
                this.closeCreateModal();
                this.loadTechnicians();
            },
            error: (error) => {
                console.error(error);
                this.toastService.showError('users.technicians.createError');
            }
        });
    }

    onDelete(technician: ResidentPayload) {
        this.technicianToDelete.set(technician);
        this.isDeleteDialogOpen.set(true);
    }

    onConfirmDelete() {
        const tech = this.technicianToDelete();
        if (!tech) return;

        this.residentService.deleteTechnician(tech.id).subscribe({
            next: () => {
                this.toastService.showSuccess('users.technicians.deletedSuccess');
                this.isDeleteDialogOpen.set(false);
                this.technicianToDelete.set(null);
                this.loadTechnicians();
            },
            error: () => {
                this.toastService.showError('users.technicians.deleteError');
            }
        });
    }
}
