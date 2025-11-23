import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CalendarEvent, CalendarView, CalendarModule, CalendarUtils, DateAdapter, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { startOfMonth, endOfMonth, format, addMonths, subMonths } from 'date-fns';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { EventsService, Event as DormEvent, CreateEventInput } from './services/events.service';
import { FacilitiesService } from '../facilities-management/services/facilities.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';
import { EventFormModalComponent } from './components/event-form-modal/event-form-modal';
import { DeleteConfirmationModalComponent } from '../facilities-management/components/delete-confirmation-modal/delete-confirmation-modal';

// Custom validator to ensure date is not in the past
function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; // Don't validate empty values (let required validator handle that)
  }
  
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for fair comparison
  
  if (selectedDate < today) {
    return { pastDate: true };
  }
  
  return null;
}

@Component({
  selector: 'app-events-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    MainLayoutComponent,
    ModalComponent,
    EventFormModalComponent,
    DeleteConfirmationModalComponent,
    TranslateModule
  ],
  providers: [
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter,
    {
      provide: DateAdapter,
      useFactory: adapterFactory
    }
  ],
  templateUrl: './events-management.html',
  styleUrls: ['./events-management.css']
})
export class EventsManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventsService = inject(EventsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);

  readonly currentUser = this.userService.currentUser;
  readonly CalendarView = CalendarView;
  
  // Locale for calendar (string code for Angular pipes)
  readonly locale: string = 'pl';
  
  // State
  readonly viewDate = signal<Date>(new Date());
  readonly view = signal<CalendarView>(CalendarView.Month);
  readonly calendarEvents = signal<CalendarEvent[]>([]);
  readonly dormEvents = signal<DormEvent[]>([]);
  readonly selectedDayEvents = signal<DormEvent[]>([]);
  readonly selectedDate = signal<string>('');
  
  // Buildings and common spaces (STANDARD resources, excluding LAUNDRY)
  readonly allBuildings = this.facilitiesService.allBuildings;
  readonly allRooms = computed(() => {
    const resources = this.facilitiesService.resources();
    const commonSpaces = resources
      .filter(r => r.resourceType === 'STANDARD' && r.isActive)
      .map(r => ({
        id: r.id,
        roomNumber: r.name,
        buildingId: r.buildingId
      }));
    return commonSpaces;
  });
  
  // Modal states
  readonly isEventModalOpen = signal<boolean>(false);
  readonly isDayEventsModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  
  // Edit mode
  readonly isEditMode = signal<boolean>(false);
  readonly selectedEvent = signal<DormEvent | null>(null);
  readonly eventToDelete = signal<DormEvent | null>(null);
  
  // Loading state
  readonly eventsLoading = signal<boolean>(false);

  // Form
  readonly eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    eventDate: ['', [Validators.required, futureDateValidator]],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    buildingId: [''],
    resourceId: ['']
  });


  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.facilitiesService.getAllBuildings();
    this.loadCommonSpaces();
    this.loadEvents();
  }

  loadCommonSpaces(): void {
    // Load all resources (common spaces) with a large page size
    this.facilitiesService.getResources(0, 1000);
    // The effect above will automatically update allRooms when resources are loaded
  }

  loadEvents(): void {
    const start = startOfMonth(this.viewDate());
    const end = endOfMonth(this.viewDate());
    
    this.eventsLoading.set(true);
    this.eventsService.getEventsByDateRange(
      format(start, 'yyyy-MM-dd'),
      format(end, 'yyyy-MM-dd')
    ).subscribe({
      next: (events) => {
        this.dormEvents.set(events);
        this.convertToCalendarEvents(events);
        this.eventsLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.dormEvents.set([]);
        this.calendarEvents.set([]);
        this.eventsLoading.set(false);
      }
    });
  }

  convertToCalendarEvents(events: DormEvent[]): void {
    const calEvents: CalendarEvent[] = events.map(event => {
      const eventDateTime = new Date(`${event.eventDate}T${event.startTime}`);
      return {
        start: eventDateTime,
        title: event.title,
        color: {
          primary: '#4F46E5',
          secondary: '#E0E7FF'
        },
        meta: { dormEvent: event }
      };
    });
    this.calendarEvents.set(calEvents);
  }

  onViewDateChange(date: any): void {
    this.viewDate.set(date);
    this.loadEvents();
  }

  previousMonth(): void {
    this.viewDate.set(subMonths(this.viewDate(), 1));
    this.loadEvents();
  }

  nextMonth(): void {
    this.viewDate.set(addMonths(this.viewDate(), 1));
    this.loadEvents();
  }

  onDayClicked(event: any): void {
    const date = event.day.date;
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Find events for this day
    const eventsOnThisDay = this.dormEvents().filter(e => e.eventDate === formattedDate);
    
    this.selectedDate.set(formattedDate);
    this.selectedDayEvents.set(eventsOnThisDay);
    this.isDayEventsModalOpen.set(true);
  }

  onAddEventForDay(): void {
    this.isEditMode.set(false);
    this.selectedEvent.set(null);
    this.eventForm.reset({
      eventDate: this.selectedDate(),
      startTime: '09:00',
      endTime: '10:00'
    });
    this.isDayEventsModalOpen.set(false);
    this.isEventModalOpen.set(true);
  }

  closeDayEventsModal(): void {
    this.isDayEventsModalOpen.set(false);
    this.selectedDayEvents.set([]);
    this.selectedDate.set('');
  }

  openEventModal(event: DormEvent): void {
    this.isEditMode.set(true);
    this.selectedEvent.set(event);
    this.eventForm.patchValue({
      title: event.title,
      description: event.description || '',
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      buildingId: event.building?.id || '',
      resourceId: event.resource?.id || ''
    });
    this.isDayEventsModalOpen.set(false);
    this.isEventModalOpen.set(true);
  }

  closeEventModal(): void {
    this.isEventModalOpen.set(false);
    this.eventForm.reset();
    this.selectedEvent.set(null);
  }

  onEventFormSubmit(): void {
    if (this.eventForm.invalid) {
      this.toastService.showError(this.translateService.instant('admin.fixFormErrors'));
      return;
    }

    const formValue = this.eventForm.getRawValue();
    
    // Extra validation: ensure date is not in the past
    const eventDate = new Date(formValue.eventDate!);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      this.toastService.showError(this.translateService.instant('admin.cannotCreatePastEvents'));
      return;
    }
    const input: CreateEventInput = {
      title: formValue.title!,
      description: formValue.description || null,
      eventDate: formValue.eventDate!,
      startTime: formValue.startTime!,
      endTime: formValue.endTime!,
      buildingId: formValue.buildingId || null,
      resourceId: formValue.resourceId || null
    };

    const operation = this.isEditMode() 
      ? this.eventsService.updateEvent(this.selectedEvent()!.id, input)
      : this.eventsService.createEvent(input);

    operation.subscribe({
      next: () => {
        this.closeEventModal();
        this.loadEvents();
      },
      error: (error) => this.handleError(error)
    });
  }

  confirmDeleteEvent(event: DormEvent): void {
    this.eventToDelete.set(event);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.eventToDelete.set(null);
  }

  onConfirmDelete(): void {
    const event = this.eventToDelete();
    if (!event) return;

    this.eventsService.deleteEvent(event.id).subscribe({
      next: (success) => {
        if (success) {
          this.closeDeleteModal();
          this.closeEventModal();
          this.closeDayEventsModal();
          this.loadEvents();
        }
      },
      error: (error) => {
        this.closeDeleteModal();
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    console.error('Operation error:', error);
  }
}

