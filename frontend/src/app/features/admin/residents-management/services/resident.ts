import {inject, Injectable, signal} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {ResidentPayload} from '../models/resident.models';
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

  getAllResidents() {
    this.apollo
      .watchQuery<{ allResidents: ResidentPayload[] }>({
        query: GET_ALL_RESIDENTS,
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .pipe(
        map(result => result.data.allResidents)
      )
      .subscribe({
        next: (residents) => {
          this.allResidents.set(residents);
        },
        error: (err) => {
          console.log('Error fetching residents: ', err)
        }
      });
  }

  getResidentsByBuilding(buildingId: string) {
    this.apollo
      .watchQuery<{ residentsByBuilding: ResidentPayload[] }>({
        query: GET_RESIDENTS_BY_BUILDING,
        variables: { buildingId },
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .pipe(
        map(result => result.data.residentsByBuilding)
      )
      .subscribe({
        next: (residents) => {
          this.allResidents.set(residents);
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
