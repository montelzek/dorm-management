import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {Header} from "../../../shared/components/header/header";
import {Sidebar} from "../../../shared/components/sidebar/sidebar";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReservationService} from './reservation.service';
import {EMPTY, Observable, of, shareReplay, startWith, switchMap, tap, withLatestFrom} from 'rxjs';
import {
  Building,
  CreateReservationInput,
  ReservationPayload,
  ReservationResource,
  TimeSlot,
  User
} from '../../../graphql.types';
import {map} from 'rxjs/operators';
import {AsyncPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-reservations',
  imports: [
    Header,
    Sidebar,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class Reservations implements OnInit {

  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);

  currentUserr = signal<User | null>(null);

  reservationForm = this.fb.group({
    buildingId: ['', Validators.required],
    resourceId: [{ value: '', disabled: true }, Validators.required],
    date: [{ value: '', disabled: true }],
    laundrySlot: [{ value: '', disabled: true }],
    startTime: [{ value: '', disabled: true }],
    endTime: [{ value: '', disabled: true }],
  });

  buildings$: Observable<Building[]> = EMPTY;
  resources$: Observable<ReservationResource[]> = EMPTY;
  slots$: Observable<TimeSlot[]> = EMPTY;

  reservations$: Observable<ReservationPayload[]> = EMPTY;

  currentUser: User | null = null;
  selectedResource = signal<ReservationResource | null>(null);

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.reservationService.getMyDetails().subscribe(user => {
      this.currentUserr.set(user);
    });
    effect(() => {
      const resource = this.selectedResource();
      const laundrySlotControl = this.reservationForm.get('laundrySlot');
      const startTimeControl = this.reservationForm.get('startTime');
      const endTimeControl = this.reservationForm.get('endTime');
      const dateControl = this.reservationForm.get('date');

      if (resource?.resourceType === 'LAUNDRY') {
        dateControl?.setValidators([Validators.required]);
        laundrySlotControl?.setValidators([Validators.required]);
        startTimeControl?.clearValidators();
        endTimeControl?.clearValidators();
      } else {
        dateControl?.clearValidators();
        laundrySlotControl?.clearValidators();
        startTimeControl?.setValidators([Validators.required]);
        endTimeControl?.setValidators([Validators.required]);
      }

      dateControl?.updateValueAndValidity();
      laundrySlotControl?.updateValueAndValidity();
      startTimeControl?.updateValueAndValidity();
      endTimeControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.reservations$ = this.reservationService.getMyReservations();

    const currentUser$ = this.reservationService.getMyDetails().pipe(
      tap(user => this.currentUser = user),
      shareReplay(1)
    );
    this.buildings$ = this.reservationService.getBuildings().pipe(shareReplay(1));

    const buildingId$ = this.reservationForm.get('buildingId')!.valueChanges.pipe(
      startWith(this.reservationForm.get('buildingId')!.value)
    );

    this.resources$ = buildingId$.pipe(
      tap(() => this.resetFields(['resourceId', 'date', 'laundrySlot', 'startTime', 'endTime'])),
      withLatestFrom(currentUser$),
      switchMap(([buildingId, user]) => {
        if (!buildingId) return of([]);

        this.reservationForm.get('resourceId')!.enable();
        return this.reservationService.getResources(buildingId).pipe(
          map(resources => {
            if (user && buildingId !== user.building?.id) {
              return resources.filter(r => r.resourceType !== 'LAUNDRY');
            }
            return resources;
          })
        );
      }),
      shareReplay(1)
    );

    const resourceId$ = this.reservationForm.get('resourceId')!.valueChanges;

    resourceId$.pipe(
      withLatestFrom(this.resources$),
      tap(([resourceId, resources]) => {
        this.resetFields(['date', 'laundrySlot', 'startTime', 'endTime']);
        const resource = resources.find(r => r.id === resourceId) || null;
        this.selectedResource.set(resource);

        if (resource) {
          this.reservationForm.get('date')!.enable();
          if (resource.resourceType === 'STANDARD') {
            this.reservationForm.get('startTime')!.enable();
            this.reservationForm.get('endTime')!.enable();
          }
        }
      })
    ).subscribe();

    const dateControl = this.reservationForm.get('date')!;
    this.slots$ = dateControl.valueChanges.pipe(
      startWith(dateControl.value),
      tap(() => this.resetFields(['laundrySlot'])),
      switchMap(date => {
        const resource = this.selectedResource();
        if (!date || !resource || resource.resourceType !== 'LAUNDRY') {
          return of([]);
        }
        this.reservationForm.get('laundrySlot')!.enable();
        return this.reservationService.getAvailableLaundrySlots(resource.id, date);
      })
    );
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) return;
    this.errorMessage = this.successMessage = null;

    const formValue = this.reservationForm.value;
    const resource = this.selectedResource();
    let startTime: string, endTime: string;

    if (resource?.resourceType === 'LAUNDRY') {
      const slot = JSON.parse(formValue.laundrySlot!);
      startTime = new Date(slot.startTime).toISOString();
      endTime = new Date(slot.endTime).toISOString();
    } else {
      startTime = new Date(formValue.startTime!).toISOString();
      endTime = new Date(formValue.endTime!).toISOString();
    }

    const input: CreateReservationInput = {
      resourceId: formValue.resourceId!,
      startTime,
      endTime
    };

    this.reservationService.createReservation(input).subscribe({
      next: () => {
        this.successMessage = 'Rezerwacja utworzona pomyślnie!';
        this.reservationForm.reset();
        this.selectedResource.set(null);
      },
      error: (err) => this.errorMessage = err.message,
    });
  }

  private resetFields(fieldNames: string[]): void {
    fieldNames.forEach(name => {
      this.reservationForm.get(name)?.reset({ value: '', disabled: true });
    });
  }

  public stringifySlot(slot: TimeSlot): string {
    return JSON.stringify(slot);
  }

}
