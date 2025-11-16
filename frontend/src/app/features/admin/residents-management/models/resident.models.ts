export interface ResidentPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  buildingName: string;
  buildingId?: string;
  roomNumber: string;
  roomId?: string;
}
