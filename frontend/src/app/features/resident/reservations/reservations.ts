import { Component, effect, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of, shareReplay, startWith, switchMap, tap, withLatestFrom, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { ReservationsListComponent } from './components/reservations-list/reservations-list';
import { ReservationFormComponent, ReservationFormData } from './components/reservation-form/reservation-form';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { ReservationService } from './services/reservation';
import { ToastService } from '../../../core/services/toast.service';
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
    TranslateModule
  ],
  templateUrl: './reservations.html',
  styles: []
})
export class ReservationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);

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
    if (!user || !user.building || buildingId !== user.building.id) {
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
    // Disable and reset all time-related fields first
    this.reservationForm.get('date')!.disable();
    this.reservationForm.get('laundrySlot')!.disable();
    this.reservationForm.get('startTimeHour')!.disable();
    this.reservationForm.get('endTimeHour')!.disable();
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

    // Check weekly limits before creating reservation
    const reservationDate = new Date(startTime);
    const validationError = this.validateWeeklyLimits(resource, reservationDate);
    
    if (validationError) {
      this.toastService.showError(validationError);
      return;
    }

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

  private validateWeeklyLimits(resource: ReservationResource, reservationDate: Date): string | null {
    const weekBounds = this.getWeekBounds(reservationDate);
    const reservations = this.myReservations();
    const weekDatesText = this.formatWeekDates(weekBounds.start, weekBounds.end);

    if (resource.resourceType === 'LAUNDRY') {
      const laundryReservationsThisWeek = reservations.filter(r => {
        if (r.status === 'CANCELLED') return false;
        const resDate = new Date(r.startTime);
        const isInWeek = resDate >= weekBounds.start && resDate < weekBounds.end;
        const isLaundry = r.resource.name?.toLowerCase().includes('pralnia') || 
                         r.resource.name?.toLowerCase().includes('laundry');
        return isInWeek && isLaundry;
      }).length;

      if (laundryReservationsThisWeek >= 2) {
        return this.translate.instant('reservations.errors.laundryWeeklyLimit', { dates: weekDatesText });
      }
    } else if (resource.resourceType === 'STANDARD') {
      const resourceReservationsThisWeek = reservations.filter(r => {
        if (r.status === 'CANCELLED') return false;
        const resDate = new Date(r.startTime);
        return r.resource.id === resource.id && 
               resDate >= weekBounds.start && 
               resDate < weekBounds.end;
      }).length;

      if (resourceReservationsThisWeek >= 1) {
        return this.translate.instant('reservations.errors.resourceWeeklyLimit', { dates: weekDatesText });
      }
    }

    return null;
  }

  private formatWeekDates(start: Date, end: Date): string {
    const locale = this.translate.currentLang || 'pl';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    
    const startFormatted = start.toLocaleDateString(locale, options);
    const actualEnd = new Date(end);
    actualEnd.setDate(actualEnd.getDate() - 1);
    const endFormatted = actualEnd.toLocaleDateString(locale, options);
    
    return `${startFormatted}-${endFormatted}`;
  }

  private getWeekBounds(date: Date): { start: Date; end: Date } {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 7);
    
    return { start: monday, end: sunday };
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
    console.error('Reservation creation error:', error);
    
    let errorMessage = this.translate.instant('common.error');
    
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = error.graphQLErrors[0].message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.toastService.showError(errorMessage);
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
