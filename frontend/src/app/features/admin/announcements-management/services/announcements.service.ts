import { Injectable, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, tap, catchError, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import {
  GET_ADMIN_ANNOUNCEMENTS,
  CREATE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT
} from '../announcements.graphql';

export interface AnnouncementBuilding {
  id: string;
  name: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  buildings: AnnouncementBuilding[];
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementsPage {
  content: Announcement[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  buildingIds: string[];
}

export interface UpdateAnnouncementInput {
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  buildingIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);

  readonly announcements = signal<Announcement[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly totalPages = signal<number>(0);
  readonly currentPage = signal<number>(0);
  readonly totalElements = signal<number>(0);

  loadAnnouncements(page: number = 0, size: number = 10): Observable<AnnouncementsPage> {
    this.loading.set(true);
    this.error.set(null);

    return this.apollo
      .query<{ adminAnnouncements: AnnouncementsPage }>({
        query: GET_ADMIN_ANNOUNCEMENTS,
        variables: { page, size },
        fetchPolicy: 'network-only'
      })
      .pipe(
        tap(({ data }) => {
          this.announcements.set(data.adminAnnouncements.content);
          this.totalPages.set(data.adminAnnouncements.totalPages);
          this.currentPage.set(data.adminAnnouncements.currentPage);
          this.totalElements.set(data.adminAnnouncements.totalElements);
          this.loading.set(false);
        }),
        catchError((error) => {
          this.error.set(error.message);
          this.loading.set(false);
          return of({ data: { adminAnnouncements: { content: [], totalElements: 0, totalPages: 0, currentPage: 0 } } } as any);
        }),
        tap(() => ({ data: { adminAnnouncements: { content: this.announcements(), totalElements: this.totalElements(), totalPages: this.totalPages(), currentPage: this.currentPage() } } }))
      ) as Observable<AnnouncementsPage>;
  }

  createAnnouncement(input: CreateAnnouncementInput): Observable<Announcement> {
    return this.apollo
      .mutate<{ createAnnouncement: Announcement }>({
        mutation: CREATE_ANNOUNCEMENT,
        variables: { input }
      })
      .pipe(
        tap(({ data }) => {
          if (data?.createAnnouncement) {
            // Add to beginning of list and increment total elements
            this.announcements.set([data.createAnnouncement, ...this.announcements()]);
            this.totalElements.set(this.totalElements() + 1);
          }
        }),
        tap(result => result.data!.createAnnouncement)
      ) as any as Observable<Announcement>;
  }

  updateAnnouncement(id: string, input: UpdateAnnouncementInput): Observable<Announcement> {
    return this.apollo
      .mutate<{ updateAnnouncement: Announcement }>({
        mutation: UPDATE_ANNOUNCEMENT,
        variables: { id, input }
      })
      .pipe(
        tap(({ data }) => {
          if (data?.updateAnnouncement) {
            const updated = data.updateAnnouncement;
            this.announcements.set(
              this.announcements().map(announcement =>
                announcement.id === id ? updated : announcement
              )
            );
          }
        }),
        tap(result => result.data!.updateAnnouncement)
      ) as any as Observable<Announcement>;
  }

  deleteAnnouncement(id: string): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteAnnouncement: boolean }>({
        mutation: DELETE_ANNOUNCEMENT,
        variables: { id },
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      })
      .pipe(
        take(1),
        map(result => {
          const success = result.data?.deleteAnnouncement ?? false;
          if (success) {
            this.announcements.set(
              this.announcements().filter(announcement => announcement.id !== id)
            );
            this.totalElements.set(Math.max(0, this.totalElements() - 1));
            this.toastService.showSuccess(this.translateService.instant('admin.announcementDeletedSuccess'));
          }
          return success;
        }),
        catchError(error => {
          const msg = error?.graphQLErrors?.[0]?.message || error?.message || 'Unknown error';
          this.toastService.showError(this.translateService.instant('admin.errorDeletingAnnouncement') + ': ' + msg);
          return of(false);
        })
      );
  }
}

