import { httpClient } from "@/lib/httpClient";
import type { Room, RoomsListResponse, RoomItemResponse, RoomType } from "../domain/types";

export type RoomsFilters = {
  hotelId?: string;
  type?: RoomType;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export async function fetchRooms(filters: RoomsFilters): Promise<Room[]> {
  const { data } = await httpClient.get<RoomsListResponse>("/rooms", { params: filters });
  return data.data;
}

// ✅ CREATE: στέλνουμε καθαρά types
export async function createRoom(payload: {
  hotelId: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  isAvailable: boolean;
}) {
  const { data } = await httpClient.post<RoomItemResponse>("/rooms", payload);
  return data.data;
}

// ✅ UPDATE: στέλνουμε ΟΛΟ το record (πολλά APIs με Zod/Prisma το ζητάνε)
export async function updateRoom(id: string, payload: {
  hotelId: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  isAvailable: boolean;
}) {
  const { data } = await httpClient.put<RoomItemResponse>(`/rooms/${id}`, payload);
  return data.data;
}

export async function deleteRoom(id: string) {
  await httpClient.delete(`/rooms/${id}`);
  return { id };
}
