import { AdminReservation } from './admin-reservation.models';

export interface ReservationPage {
  content: AdminReservation[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

