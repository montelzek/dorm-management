export interface ResidentPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  buildingName: string;
  buildingId?: string;
  roomNumber: string;
  roomId?: string;
}
