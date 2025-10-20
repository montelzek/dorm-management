import { Component, effect, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of, shareReplay, startWith, switchMap, tap, withLatestFrom, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { ReservationsListComponent } from './components/reservations-list/reservations-list';
import { ReservationFormComponent, ReservationFormData } from './components/reservation-form/reservation-form';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { ReservationService } from './services/reservation';
import {
  CreateReservationInput,
  ReservationResource,
  TimeSlot,
  User
} from '../../../shared/models/graphql.types';

@Component({
  selector: 'app-reservations',
  imports: [
    MainLayoutComponent,
    ReservationsListComponent,
    ReservationFormComponent,
    ModalComponent,
    ButtonComponent,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './reservations.html',
  styles: []
})
export class ReservationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);

  readonly selectedResource = signal<ReservationResource | null>(null);
  readonly isModalOpen = signal<boolean>(false);

  readonly currentUser = this.reservationService.currentUser;
  readonly isLoading = this.reservationService.isLoading;

  readonly reservationForm = this.fb.group({
    buildingId: ['', Validators.required],
    resourceId: [{ value: '', disabled: true }, Validators.required],
    date: [{ value: '', disabled: true }],
    laundrySlot: [{ value: '', disabled: true }],
    startTime: [{ value: '', disabled: true }],
    endTime: [{ value: '', disabled: true }],
    startTimeHour: [{ value: '', disabled: true }],
    endTimeHour: [{ value: '', disabled: true }],
  });

  readonly buildings = this.reservationService.buildings;
  readonly myReservations = this.reservationService.myReservations;

  resources$: Observable<ReservationResource[]> = EMPTY;
  slots$: Observable<TimeSlot[]> = EMPTY;

  constructor() {
    this.initializeUserData();
    this.setupFormValidationEffect();
  }

  private initializeUserData(): void {
    this.reservationService.loadUserDetails();
  }

  private setupFormValidationEffect(): void {
    effect(() => {
      const resource = this.selectedResource();
      this.updateFormValidators(resource);
    });
  }

  private updateFormValidators(resource: ReservationResource | null): void {
    const controls = {
      date: this.reservationForm.get('date'),
      laundrySlot: this.reservationForm.get('laundrySlot'),
      startTime: this.reservationForm.get('startTime'),
      endTime: this.reservationForm.get('endTime'),
      startTimeHour: this.reservationForm.get('startTimeHour'),
      endTimeHour: this.reservationForm.get('endTimeHour')
    };

    if (resource?.resourceType === 'LAUNDRY') {
      this.setLaundryValidators(controls);
    } else {
      this.setStandardValidators(controls);
    }

    Object.values(controls).forEach(control => control?.updateValueAndValidity());
  }

  private setLaundryValidators(controls: Record<string, any>): void {
    controls['date']?.setValidators([Validators.required]);
    controls['laundrySlot']?.setValidators([Validators.required]);
    controls['startTime']?.clearValidators();
    controls['endTime']?.clearValidators();
    controls['startTimeHour']?.clearValidators();
    controls['endTimeHour']?.clearValidators();
  }

  private setStandardValidators(controls: Record<string, any>): void {
    controls['date']?.setValidators([Validators.required]);
    controls['startTimeHour']?.setValidators([Validators.required]);
    controls['endTimeHour']?.setValidators([Validators.required]);
    controls['laundrySlot']?.clearValidators();
    controls['startTime']?.clearValidators();
    controls['endTime']?.clearValidators();
  }

  ngOnInit(): void {
    this.initializeDataStreams();
    this.setupFormReactivity();
  }

  private initializeDataStreams(): void {
    this.reservationService.loadMyReservations();
    this.reservationService.loadBuildings();
  }

  private setupFormReactivity(): void {
    this.setupBuildingSelection();
    this.setupResourceSelection();
    this.setupDateSelection();
  }

  private setupBuildingSelection(): void {
    const buildingId$ = this.reservationForm.get('buildingId')!.valueChanges.pipe(
      startWith(this.reservationForm.get('buildingId')!.value)
    );

    this.resources$ = buildingId$.pipe(
      tap(() => this.resetFields(['resourceId', 'date', 'laundrySlot', 'startTime', 'endTime'])),
      switchMap((buildingId) => this.loadResourcesForBuilding(buildingId)),
      shareReplay(1)
    );
  }

  private loadResourcesForBuilding(buildingId: string | null): Observable<ReservationResource[]> {
    if (!buildingId) return of([]);

    this.reservationForm.get('resourceId')!.enable();
    return this.reservationService.getResources(buildingId).pipe(
      map(resources => this.filterResourcesForUser(resources, this.currentUser(), buildingId))
    );
  }

  private filterResourcesForUser(resources: ReservationResource[], user: User | null, buildingId: string): ReservationResource[] {
    if (user && buildingId !== user.building?.id) {
      return resources.filter(r => r.resourceType !== 'LAUNDRY');
    }
    return resources;
  }

  private setupResourceSelection(): void {
    const resourceId$ = this.reservationForm.get('resourceId')!.valueChanges;

    resourceId$.pipe(
      withLatestFrom(this.resources$),
      tap(([resourceId, resources]) => this.handleResourceSelection(resourceId, resources))
    ).subscribe();
  }

  private handleResourceSelection(resourceId: string | null, resources: ReservationResource[]): void {
    this.resetFields(['date', 'laundrySlot', 'startTime', 'endTime', 'startTimeHour', 'endTimeHour']);

    const resource = resources.find(r => r.id === resourceId) || null;
    this.selectedResource.set(resource);

    if (resource) {
      this.enableResourceSpecificFields(resource);
    }
  }

  private enableResourceSpecificFields(resource: ReservationResource): void {
    this.reservationForm.get('date')!.enable();

    if (resource.resourceType === 'STANDARD') {
      this.reservationForm.get('startTimeHour')!.enable();
      this.reservationForm.get('endTimeHour')!.enable();
    }

    this.updateFormValidators(resource);
  }

  private setupDateSelection(): void {
    const dateControl = this.reservationForm.get('date')!;
    this.slots$ = dateControl.valueChanges.pipe(
      startWith(dateControl.value),
      tap(() => this.resetFields(['laundrySlot'])),
      switchMap(date => this.loadLaundrySlots(date))
    );
  }

      private loadLaundrySlots(date: string | null): Observable<TimeSlot[]> {
        const resource = this.selectedResource();

        if (!date || !resource) {
          return of([]);
        }

        if (resource.resourceType === 'LAUNDRY') {
          this.reservationForm.get('laundrySlot')!.enable();
          return this.reservationService.getAvailableLaundrySlots(resource.id, date);
        } else if (resource.resourceType === 'STANDARD') {
          return this.reservationService.getAvailableStandardSlots(resource.id, date);
        }

        return of([]);
      }

  onFormSubmit(formData: ReservationFormData): void {
    this.clearMessages();
    this.createReservation(formData);
  }
  private clearMessages(): void {
    this.reservationService.clearError();
  }

  private createReservation(formData: ReservationFormData): void {
    const resource = this.selectedResource();

    if (!resource || !formData.resourceId) {
      return;
    }

    const { startTime, endTime } = this.calculateTimeSlot(formData, resource);

    const input: CreateReservationInput = {
      resourceId: formData.resourceId,
      startTime,
      endTime
    };


    this.reservationService.createReservation(input).subscribe({
      next: () => this.handleReservationSuccess(),
      error: (error) => this.handleReservationError(error)
    });
  }

  private calculateTimeSlot(formValue: any, resource: ReservationResource): { startTime: string; endTime: string } {
    if (resource.resourceType === 'LAUNDRY') {
      return this.calculateLaundryTimeSlot(formValue.laundrySlot);
    } else {
      return this.calculateStandardTimeSlot(formValue);
    }
  }

  private calculateLaundryTimeSlot(laundrySlot: string): { startTime: string; endTime: string } {
    const slot = JSON.parse(laundrySlot);
    return {
      startTime: new Date(slot.startTime).toISOString(),
      endTime: new Date(slot.endTime).toISOString()
    };
  }

  private calculateStandardTimeSlot(formValue: any): { startTime: string; endTime: string } {
    const date = formValue.date;
    const startTimeHour = formValue.startTimeHour;
    const endTimeHour = formValue.endTimeHour;

    const startDateTime = `${date}T${startTimeHour}:00`;
    const endDateTime = `${date}T${endTimeHour}:00`;

    return {
      startTime: new Date(startDateTime).toISOString(),
      endTime: new Date(endDateTime).toISOString()
    };
  }

  private handleReservationSuccess(): void {
    this.resetForm();
    this.closeModal();
  }

  openModal(): void {
    this.isModalOpen.set(true);
    this.clearMessages();
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  private handleReservationError(error: any): void {

  }

  private resetForm(): void {
    this.reservationForm.reset();
    this.selectedResource.set(null);
    this.reservationForm.get('buildingId')?.enable();
    this.resetFields(['resourceId', 'date', 'laundrySlot', 'startTime', 'endTime', 'startTimeHour', 'endTimeHour']);
  }

  private resetFields(fieldNames: string[]): void {
    fieldNames.forEach(name => {
      const control = this.reservationForm.get(name);
      control?.reset({ value: '', disabled: true });
    });
  }

  onCancelReservation(reservationId: string): void {
    this.reservationService.cancelReservation(reservationId).subscribe({
      next: () => {
        
      },
      error: (error) => {
        console.error('Error canceling reservation:', error);
      }
    });
  }
}
