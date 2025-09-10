export type RoomType = "SINGLE" | "DOUBLE" | "SUITE" | "FAMILY";

export interface Room {
  id: string;
  hotelId: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  hotel?: { id: string; name: string };
}

export interface RoomsListResponse {
  data: Room[];
  success: boolean;
  count?: number;
}
export interface RoomItemResponse {
  data: Room;
  success: boolean;
}
