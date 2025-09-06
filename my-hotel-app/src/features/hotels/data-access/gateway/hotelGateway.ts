import { httpClient } from "@/lib/httpClient";
import type { Hotel, HotelCreateInput, HotelUpdateInput } from "../../domain/hotel";

export async function getHotels(): Promise<Hotel[]> {
  const { data } = await httpClient.get("/hotels");
  return data.data;
}

export async function getHotelById(id: string): Promise<Hotel> {
  const { data } = await httpClient.get(`/hotels/${id}`);
  return data.data;
}

export async function createHotel(input: HotelCreateInput): Promise<Hotel> {
  const { data } = await httpClient.post("/hotels", input);
  return data.data;
}

export async function updateHotel(id: string, input: HotelUpdateInput): Promise<Hotel> {
  const { data } = await httpClient.put(`/hotels/${id}`, input);
  return data.data;
}
