import { httpClient } from "@/lib/httpClient";
import type { Hotel, HotelCreateInput, HotelUpdateInput } from "../../domain/hotel";

export type Order = "asc" | "desc";

export type HotelsListMeta = {
  page: number;
  per_page: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevPage: number | null;
  nextPage: number | null;
  order: Order;
};

export type HotelsListResult = {
  items: Hotel[];
  meta: HotelsListMeta;
};

type HotelsListParams = {
  page?: number;
  per_page?: number;
  order?: Order;
};

// ----------------- CRUD -----------------
export async function getHotels(): Promise<Hotel[]> {
  const { data } = await httpClient.get("/hotels");
  // backend γυρνάει { data: { data: Hotel[], meta } }
  return data.data.data as Hotel[];
}

export async function getHotelById(id: string): Promise<Hotel> {
  const { data } = await httpClient.get(`/hotels/${id}`);
  return data.data as Hotel;
}

export async function createHotel(input: HotelCreateInput): Promise<Hotel> {
  const { data } = await httpClient.post<{ data: Hotel }>("/hotels", input);
  return data.data;
}

export async function updateHotel(id: string, input: HotelUpdateInput): Promise<Hotel> {
  const { data } = await httpClient.put<{ data: Hotel }>(`/hotels/${id}`, input);
  return data.data;
}

export async function deleteHotel(id: string): Promise<void> {
  await httpClient.delete(`/hotels/${id}`);
}

// ----------------- Pagination -----------------
export async function getHotelsPaged(params: HotelsListParams = {}): Promise<HotelsListResult> {
  const { data } = await httpClient.get("/hotels", { params });
  return {
    items: data.data.data as Hotel[],
    meta: data.data.meta as HotelsListMeta,
  };
}

