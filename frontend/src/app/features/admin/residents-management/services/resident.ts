import {inject, Injectable, signal} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {ResidentPayload} from '../models/resident.models';
import {ResidentPage} from '../models/resident-page.models';
import {GET_ALL_RESIDENTS, GET_RESIDENTS_BY_BUILDING, GET_BUILDINGS} from '../residents.graphql';
import {map} from 'rxjs/operators';
import {Building} from '../../../../shared/models/graphql.types';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  private readonly apollo = inject(Apollo);

  readonly allResidents = signal<ResidentPayload[]>([]);
  readonly buildings = signal<Building[]>([]);
  readonly totalElements = signal<number>(0);
  readonly totalPages = signal<number>(0);
  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(10);

  getAllResidents(page: number = 0, size: number = 10) {
    this.apollo
      .watchQuery<{ allResidents: ResidentPage }>({
        query: GET_ALL_RESIDENTS,
        variables: { page, size },
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .pipe(
        map(result => result.data.allResidents)
      )
      .subscribe({
        next: (residentPage) => {
          this.allResidents.set(residentPage.content);
          this.totalElements.set(residentPage.totalElements);
          this.totalPages.set(residentPage.totalPages);
          this.currentPage.set(residentPage.currentPage);
          this.pageSize.set(residentPage.pageSize);
        },
        error: (err) => {
          console.log('Error fetching residents: ', err)
        }
      });
  }

  getResidentsByBuilding(buildingId: string, page: number = 0, size: number = 10) {
    this.apollo
      .watchQuery<{ residentsByBuilding: ResidentPage }>({
        query: GET_RESIDENTS_BY_BUILDING,
        variables: { buildingId, page, size },
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .pipe(
        map(result => result.data.residentsByBuilding)
      )
      .subscribe({
        next: (residentPage) => {
          this.allResidents.set(residentPage.content);
          this.totalElements.set(residentPage.totalElements);
          this.totalPages.set(residentPage.totalPages);
          this.currentPage.set(residentPage.currentPage);
          this.pageSize.set(residentPage.pageSize);
        },
        error: (err) => {
          console.log('Error fetching residents by building: ', err)
        }
      });
  }

  getBuildings() {
    this.apollo
      .watchQuery<{ allBuildings: Building[] }>({
        query: GET_BUILDINGS,
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .pipe(
        map(result => result.data.allBuildings)
      )
      .subscribe({
        next: (buildings) => {
          this.buildings.set(buildings);
        },
        error: (err) => {
          console.log('Error fetching buildings: ', err)
        }
      });
  }
}
