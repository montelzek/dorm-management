import {inject, Injectable, Resource} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {
  Building,
  CreateReservationInput,
  ReservationPayload,
  ReservationResource,
  TimeSlot,
  User
} from '../../../graphql.types';
import {
  CREATE_RESERVATION,
  GET_AVAILABLE_LAUNDRY_SLOTS,
  GET_BUILDINGS,
  GET_MY_DETAILS, GET_MY_RESERVATIONS,
  GET_RESOURCES_BY_BUILDING
} from '../../../graphql.operations';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apollo = inject(Apollo);

  getMyDetails() {
    return this.apollo.watchQuery<{ me: User }>({
      query: GET_MY_DETAILS
    }).valueChanges.pipe(map(result => result.data.me));
  }

  getBuildings() {
    return this.apollo.watchQuery<{ allBuildings: Building[] }>({
      query: GET_BUILDINGS
    }).valueChanges.pipe(map(result => result.data.allBuildings));
  }

  getResources(buildingId: string) {
    return this.apollo.watchQuery<{ resourcesByBuilding: ReservationResource[] }>({
      query: GET_RESOURCES_BY_BUILDING,
      variables: { buildingId }
    }).valueChanges.pipe(map(result => result.data.resourcesByBuilding));
  }

  getAvailableLaundrySlots(resourceId: string, date: string): Observable<TimeSlot[]> {
    return this.apollo.watchQuery<{ availableLaundrySlots: TimeSlot[] }>({
      query: GET_AVAILABLE_LAUNDRY_SLOTS,
      variables: { resourceId, date },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(map(result => result.data.availableLaundrySlots));
  }

  createReservation(input: CreateReservationInput) {
    return this.apollo.mutate({
      mutation: CREATE_RESERVATION,
      variables: { input },
      refetchQueries: [{ query: GET_MY_RESERVATIONS }]
    });
  }

  getMyReservations() {
    return this.apollo.watchQuery<{ myReservations: ReservationPayload[] }>({
      query: GET_MY_RESERVATIONS,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(map(result => result.data.myReservations));
  }
}
