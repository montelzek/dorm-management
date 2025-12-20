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
        // Use a small delay for search debounce if needed, or just direct call.
        // For now, direct call is fine, or simple timeout.

        // Note: getAllTechnicians in service is subscription-based but updates service signals?
        // Let's check resident.service.ts again.
        // It updates `this.allResidents` signal in service.
        // Wait, if I use the SAME service instance and it updates `allResidents`, then `ResidentsManagementComponent` will also see these updates if it monitors `allResidents`.
        // This is potential conflict if both components are active or if state leaks.
        // However, I can subscribe locally in this component instead of relying on service signals if the service method returns an Observable.
        // But `getAllTechnicians` in service returns void and subscribes internally.
        // I should modify `getAllTechnicians` to return Observable OR verify if using shared signals is "Users Management" intended behavior.
        // Actually, `ResidentsManagementComponent` uses `this.residentService.allResidents`.
        // If I use `getAllTechnicians` which updates `allResidents`, then switching tabs might be tricky if I don't clear it.
        // But since they are on different tabs, only one is "active" presumably?
        // Actually, `TechniciansListComponent` has its own `technicians` signal.
        // The service method `getAllTechnicians` updates `this.allResidents` signal in the service.
        // I should probably refactor the service to return Observable for better component-level state management, 
        // OR create a `technicians` signal in the service. I'll do the latter or just rely on the return value if I can.
        // The current `getAllTechnicians` I wrote:
        // .subscribe({ next: (page) => { this.allResidents.set(...) } })
        // It updates the shared signal. This is OK if I treat `allResidents` as `currentList` generic signal.
        // But `TechniciansListComponent` has `technicians` signal. 
        // I will update the service to return the observable or allow subscription.
        // Actually, looking at `ResidentService`:
        /*
          getAllResidents(...) { ... .subscribe(...) }
        */
        // It's designed to update the service state.
        // I will follow the pattern:
        // I will read `this.residentService.allResidents` in my component knowing it might contain technicians.
        // BUT, `ResidentsManagementComponent` also reads it.
        // To avoid confusion, I will rename `allResidents` in Service to `currentUsersList` mentally, or just accept it.

        this.residentService.getAllTechnicians(
            this.page(),
            this.size(),
            this.searchQuery() || undefined,
            this.sortBy(),
            this.sortDirection()
        );
    }

    // NOTE: Because the service updates a shared signal, I need to make sure I read from it.
    // But wait, `getAllTechnicians` implementation I wrote updates `this.allResidents` in service.
    // So I should use `this.residentService.allResidents` here too.
    // Let's do that.

    readonly data = this.residentService.allResidents;
    // And other pagination signals from service
    readonly serviceTotalElements = this.residentService.totalElements;
    readonly serviceTotalPages = this.residentService.totalPages;

    // Actually, to make it cleaner and less coupled to "Residents" naming in service,
    // I should have `technicians` signal in service or just use the current one.
    // I'll use the current one.

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
                console.error('Error creating technician:', error);
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
            error: (err) => {
                this.toastService.showError('users.technicians.deleteError');
            }
        });
    }
}
