import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ResidentService} from './services/resident';
import {ResidentListComponent} from './components/resident-list/resident-list';
import {MainLayoutComponent} from '../../../shared/components/layout/main-layout/main-layout';
import {UserService} from '../../../core/services/user.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-residents-management',
  imports: [
    ResidentListComponent,
    MainLayoutComponent,
    FormsModule
  ],
  templateUrl: './residents-management.html'
})
export class ResidentsManagementComponent implements OnInit {

  private readonly residentService = inject(ResidentService);
  private readonly userService = inject(UserService);

  readonly allResidents = this.residentService.allResidents;
  readonly buildings = this.residentService.buildings;
  readonly currentUser = this.userService.currentUser;

  readonly selectedBuildingId = signal<string>('');
  readonly searchQuery = signal<string>('');

  readonly filteredResidents = computed(() => {
    const residents = this.allResidents();
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) {
      return residents;
    }

    return residents.filter(resident =>
      resident.firstName.toLowerCase().includes(query) ||
      resident.lastName.toLowerCase().includes(query) ||
      resident.roomNumber.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.userService.loadCurrentUser();
    this.residentService.getAllResidents();
    this.residentService.getBuildings();
  }

  onBuildingFilterChange(buildingId: string) {
    this.selectedBuildingId.set(buildingId);
    if (buildingId === '') {
      this.residentService.getAllResidents();
    } else {
      this.residentService.getResidentsByBuilding(buildingId);
    }
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

}
