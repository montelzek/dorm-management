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
  lastName: string;
  building: Building | null;
  room: Room | null;
  roles: string[];
}

export interface CreateReservationInput {
  resourceId: string;
  startTime: string;
  endTime: string;
}

export interface ReservationPayload {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  resource: {
    id: string;
    name: string;
  };
}
