import {inject, Injectable, signal} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {AdminReservation} from '../models/admin-reservation.models';
import {ReservationPage} from '../models/reservation-page.models';
import {GET_ADMIN_RESERVATIONS, GET_BUILDINGS, GET_RESOURCES, CANCEL_RESERVATION_ADMIN} from '../admin-reservations.graphql';
import {map} from 'rxjs/operators';
import {Building} from '../../../../shared/models/graphql.types';
import {Observable} from 'rxjs';

interface Resource {
  id: string;
  name: string;
  resourceType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminReservationService {

  private readonly apollo = inject(Apollo);

  readonly allReservations = signal<AdminReservation[]>([]);
  readonly buildings = signal<Building[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly totalElements = signal<number>(0);
  readonly totalPages = signal<number>(0);
  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(10);

  getAdminReservations(page: number = 0, size: number = 10, sortDirection?: string, 
                       resourceId?: string, buildingId?: string, date?: string, search?: string) {
    this.apollo
      .watchQuery<{ adminReservations: ReservationPage }>({
        query: GET_ADMIN_RESERVATIONS,
        variables: { 
          page, 
          size, 
          sortDirection: sortDirection || null,
          resourceId: resourceId || null,
          buildingId: buildingId || null,
          date: date || null,
          search: search || null
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .pipe(
        map(result => result.data.adminReservations)
      )
      .subscribe({
        next: (reservationPage) => {
          this.allReservations.set(reservationPage.content);
          this.totalElements.set(reservationPage.totalElements);
          this.totalPages.set(reservationPage.totalPages);
          this.currentPage.set(reservationPage.currentPage);
          this.pageSize.set(reservationPage.pageSize);
        },
        error: (err) => {
          console.log('Error fetching reservations: ', err)
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

  getResources(buildingId: string) {
    this.apollo
      .watchQuery<{ resourcesByBuilding: Resource[] }>({
        query: GET_RESOURCES,
        variables: { buildingId },
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .pipe(
        map(result => result.data.resourcesByBuilding)
      )
      .subscribe({
        next: (resources) => {
          this.resources.set(resources);
        },
        error: (err) => {
          console.log('Error fetching resources: ', err)
        }
      });
  }

  cancelReservation(reservationId: string): Observable<boolean> {
    return this.apollo
      .mutate<{ cancelReservation: boolean }>({
        mutation: CANCEL_RESERVATION_ADMIN,
        variables: { reservationId }
      })
      .pipe(
        map(result => {
          if (!result.data) {
            throw new Error('Failed to cancel reservation');
          }
          return result.data.cancelReservation;
        })
      );
  }
}

