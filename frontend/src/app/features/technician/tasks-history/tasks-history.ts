import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { TechnicianService, TechnicianTask } from '../shared/technician.service';
import { TaskListComponent } from '../shared/components/task-list/task-list';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';

@Component({
  selector: 'app-tasks-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MainLayoutComponent,
    TaskListComponent,
    ModalComponent
  ],
  templateUrl: './tasks-history.html'
})
export class TasksHistoryComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly technicianService = inject(TechnicianService);

  readonly Math = Math;
  readonly currentUser = this.userService.currentUser;
  readonly tasks = this.technicianService.tasksHistory;
  readonly totalElements = this.technicianService.historyTotalElements;
  readonly totalPages = this.technicianService.historyTotalPages;
  readonly currentPage = this.technicianService.historyCurrentPage;
  readonly pageSize = this.technicianService.historyPageSize;
  readonly isLoading = this.technicianService.isLoading;

  readonly page = signal<number>(0);
  readonly size = signal<number>(10);
  readonly isDetailModalOpen = signal<boolean>(false);
  readonly selectedTask = signal<TechnicianTask | null>(null);

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.loadHistory();
  }

  private loadHistory(): void {
    this.technicianService.getMyTasksHistory(this.page(), this.size());
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.loadHistory();
  }

  onPageSizeChange(newSize: number): void {
    this.size.set(newSize);
    this.page.set(0);
    this.loadHistory();
  }

  onViewTask(task: TechnicianTask): void {
    this.selectedTask.set(task);
    this.isDetailModalOpen.set(true);
  }

  onCloseDetailModal(): void {
    this.isDetailModalOpen.set(false);
    this.selectedTask.set(null);
  }
}
