import {Component, inject, OnInit} from '@angular/core';
import {ResidentService} from './services/resident';
import {ResidentListComponent} from './components/resident-list/resident-list';
import {MainLayoutComponent} from '../../../shared/components/layout/main-layout/main-layout';
import {UserService} from '../../../core/services/user.service';

@Component({
  selector: 'app-residents-management',
  imports: [
    ResidentListComponent,
    MainLayoutComponent
  ],
  templateUrl: './residents-management.html'
})
export class ResidentsManagementComponent implements OnInit {

  private readonly residentService = inject(ResidentService);
  private readonly userService = inject(UserService);

  readonly allResidents = this.residentService.allResidents;
  readonly currentUser = this.userService.currentUser;

  ngOnInit() {
    this.userService.loadCurrentUser();
    this.residentService.getAllResidents();
  }

}
