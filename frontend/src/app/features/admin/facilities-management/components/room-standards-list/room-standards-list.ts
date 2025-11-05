import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-room-standards-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './room-standards-list.html'
})
export class RoomStandardsListComponent {
  readonly standards = input.required<any[]>();
  readonly isLoading = input<boolean>(false);

  readonly add = output<void>();
  readonly edit = output<any>();
  readonly delete = output<any>();
}

