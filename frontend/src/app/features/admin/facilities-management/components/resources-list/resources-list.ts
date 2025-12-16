import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Resource, SimpleBuild } from '../../services/facilities.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-resources-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslateModule],
  templateUrl: './resources-list.html'
})
export class ResourcesListComponent {
  readonly resources = input.required<Resource[]>();
  readonly buildings = input.required<SimpleBuild[]>();
  readonly isLoading = input<boolean>(false);
  readonly selectedBuilding = input<string>('');
  readonly selectedStatus = input<string>('');

  readonly edit = output<Resource>();
  readonly toggle = output<Resource>();
  readonly delete = output<Resource>();
  readonly add = output<void>();
  readonly buildingFilterChange = output<string>();
  readonly statusFilterChange = output<string>();
}
