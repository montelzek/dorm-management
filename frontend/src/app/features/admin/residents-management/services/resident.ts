import {inject, Injectable, signal} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {ResidentPayload} from '../models/resident.models';
import {ResidentPage} from '../models/resident-page.models';
import {RoomPayload} from '../models/room.models';
import {GET_ALL_RESIDENTS, GET_RESIDENTS_BY_BUILDING, GET_BUILDINGS, GET_AVAILABLE_ROOMS, ASSIGN_ROOM, DELETE_RESIDENT} from '../residents.graphql';
import {map} from 'rxjs/operators';
import {Building} from '../../../../shared/models/graphql.types';
import {Observable} from 'rxjs';

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

  getAllResidents(page: number = 0, size: number = 10, search?: string) {
    this.apollo
      .watchQuery<{ allResidents: ResidentPage }>({
        query: GET_ALL_RESIDENTS,
        variables: { page, size, search: search || null },
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

  getResidentsByBuilding(buildingId: string, page: number = 0, size: number = 10, search?: string) {
    this.apollo
      .watchQuery<{ residentsByBuilding: ResidentPage }>({
        query: GET_RESIDENTS_BY_BUILDING,
        variables: { buildingId, page, size, search: search || null },
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

  getAvailableRooms(buildingId?: string): Observable<RoomPayload[]> {
    return this.apollo
      .watchQuery<{ availableRooms: RoomPayload[] }>({
        query: GET_AVAILABLE_ROOMS,
        variables: buildingId ? { buildingId } : {},
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .pipe(
        map(result => result.data.availableRooms)
      );
  }

  assignRoom(userId: string, roomId: string): Observable<ResidentPayload> {
    return this.apollo
      .mutate<{ assignRoom: ResidentPayload }>({
        mutation: ASSIGN_ROOM,
        variables: { userId, roomId }
      })
      .pipe(
        map(result => {
          if (!result.data) {
            throw new Error('Failed to assign room');
          }
          return result.data.assignRoom;
        })
      );
  }

  deleteResident(userId: string): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteResident: boolean }>({
        mutation: DELETE_RESIDENT,
        variables: { userId }
      })
      .pipe(
        map(result => {
          if (!result.data) {
            throw new Error('Failed to delete resident');
          }
          return result.data.deleteResident;
        })
      );
  }
}
