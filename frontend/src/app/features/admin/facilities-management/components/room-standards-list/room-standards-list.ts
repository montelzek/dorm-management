import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-room-standards-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslateModule],
  templateUrl: './room-standards-list.html'
})
export class RoomStandardsListComponent {
  readonly standards = input.required<any[]>();
  readonly isLoading = input<boolean>(false);

  readonly add = output<void>();
  readonly edit = output<any>();
  readonly delete = output<any>();
}

