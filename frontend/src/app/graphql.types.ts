export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface LoginInput {
  email: string;
  password?: string;
}

export interface Building {
  id: string;
  name: string;
}

export interface ReservationResource {
  id: string;
  name: string;
  resourceType: 'STANDARD' | 'LAUNDRY';
}

export interface TimeSlot {
  startTime: string; // ISO String
  endTime: string;
}

export interface Room { // Nowy interfejs
  id: string;
  roomNumber: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string; // Dodaj nazwisko
  building: Building | null;
  room: Room | null; // Dodaj pokój
}

export interface CreateReservationInput {
  resourceId: string;
  startTime: string;
  endTime: string;
}

export interface ReservationPayload {
  id: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  status: string;
  resource: {
    id: string;
    name: string;
  };
}
