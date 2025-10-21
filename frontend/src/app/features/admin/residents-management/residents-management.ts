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
  readonly totalElements = this.residentService.totalElements;
  readonly totalPages = this.residentService.totalPages;
  readonly currentPage = this.residentService.currentPage;
  readonly pageSize = this.residentService.pageSize;

  readonly selectedBuildingId = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly page = signal<number>(0);
  readonly size = signal<number>(10);

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
    this.loadResidents();
    this.residentService.getBuildings();
  }

  private loadResidents() {
    const buildingId = this.selectedBuildingId();
    const page = this.page();
    const size = this.size();
    
    if (buildingId === '') {
      this.residentService.getAllResidents(page, size);
    } else {
      this.residentService.getResidentsByBuilding(buildingId, page, size);
    }
  }

  onBuildingFilterChange(buildingId: string) {
    this.selectedBuildingId.set(buildingId);
    this.page.set(0); // Reset to first page
    this.loadResidents();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.loadResidents();
  }

  onPageSizeChange(newSize: number) {
    this.size.set(newSize);
    this.page.set(0); // Reset to first page
    this.loadResidents();
  }

}
