export interface RoomPayload {
  id: string;
  roomNumber: string;
  capacity: number;
  currentOccupancy: number;
  rentAmount: number;
  buildingId: string;
  buildingName: string;
}

