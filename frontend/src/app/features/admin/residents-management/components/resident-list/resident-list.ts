import {Component, input} from '@angular/core';
import {ResidentPayload} from '../../models/resident.models';

@Component({
  selector: 'app-resident-list',
  imports: [],
  templateUrl: 'resident-list.html'
})
export class ResidentListComponent {
  readonly residents = input<ResidentPayload[]>([]);
}
