import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarView, CalendarModule, CalendarUtils, DateAdapter, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { startOfMonth, endOfMonth, format, addMonths, subMonths } from 'date-fns';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { EventsService, Event as DormEvent } from '../../admin/events-management/services/events.service';

@Component({
  selector: 'app-resident-events',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    MainLayoutComponent
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
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class ResidentEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly userService = inject(UserService);

  readonly currentUser = this.userService.currentUser;
  readonly CalendarView = CalendarView;
  
  // State
  readonly viewDate = signal<Date>(new Date());
  readonly view = signal<CalendarView>(CalendarView.Month);
  readonly calendarEvents = signal<CalendarEvent[]>([]);
  readonly dormEvents = signal<DormEvent[]>([]);
  readonly selectedDayEvents = signal<DormEvent[]>([]);
  readonly selectedDate = signal<string>('');
  
  // Loading state
  readonly eventsLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.loadEvents();
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
      error: () => {
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
    
    if (eventsOnThisDay.length > 0) {
      this.selectedDate.set(formattedDate);
      this.selectedDayEvents.set(eventsOnThisDay);
    }
  }

  closeEventDetails(): void {
    this.selectedDayEvents.set([]);
    this.selectedDate.set('');
  }
}

