import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Building } from '../../services/facilities.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-buildings-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DatePipe],
  templateUrl: './buildings-list.html'
})
export class BuildingsListComponent {
  readonly buildings = input.required<Building[]>();
  readonly isLoading = input<boolean>(false);

  readonly edit = output<Building>();
  readonly delete = output<Building>();
  readonly add = output<void>();
}

