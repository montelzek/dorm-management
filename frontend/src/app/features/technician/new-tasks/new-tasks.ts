import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { TechnicianService, TechnicianTask } from '../shared/technician.service';
import { TaskListComponent } from '../shared/components/task-list/task-list.component';
import { TaskDetailModalComponent } from '../shared/components/task-detail-modal/task-detail-modal.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-new-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    TaskListComponent,
    TaskDetailModalComponent,
    ModalComponent,
    ButtonComponent
  ],
  templateUrl: './new-tasks.html'
})
export class NewTasksComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly technicianService = inject(TechnicianService);
  private readonly toastService = inject(ToastService);

  readonly Math = Math;
  readonly currentUser = this.userService.currentUser;
  readonly tasks = this.technicianService.assignedTasks;
  readonly totalElements = this.technicianService.totalElements;
  readonly totalPages = this.technicianService.totalPages;
  readonly currentPage = this.technicianService.currentPage;
  readonly pageSize = this.technicianService.pageSize;
  readonly isLoading = this.technicianService.isLoading;

  readonly page = signal<number>(0);
  readonly size = signal<number>(10);
  readonly isDetailModalOpen = signal<boolean>(false);
  readonly isStatusModalOpen = signal<boolean>(false);
  readonly selectedTask = signal<TechnicianTask | null>(null);

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.loadTasks();
  }

  private loadTasks(): void {
    this.technicianService.getMyAssignedTasks(this.page(), this.size());
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.loadTasks();
  }

  onPageSizeChange(newSize: number): void {
    this.size.set(newSize);
    this.page.set(0);
    this.loadTasks();
  }

  onViewTask(task: TechnicianTask): void {
    this.selectedTask.set(task);
    this.isDetailModalOpen.set(true);
  }

  onCloseDetailModal(): void {
    this.isDetailModalOpen.set(false);
    this.selectedTask.set(null);
  }

  onChangeStatus(task: TechnicianTask): void {
    this.selectedTask.set(task);
    this.isStatusModalOpen.set(true);
  }

  onCloseStatusModal(): void {
    this.isStatusModalOpen.set(false);
    this.selectedTask.set(null);
  }

  onUpdateStatus(taskId: string, newStatus: string): void {
    this.technicianService.updateTaskStatus(taskId, newStatus).subscribe({
      next: () => {
        this.onCloseStatusModal();
        this.loadTasks();
        this.toastService.showSuccess('Task status updated successfully!');
      },
      error: (error) => {
        console.error('Error updating task status:', error);
      }
    });
  }
}
