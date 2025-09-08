// src/features/hotels/data-access/useHotelsPagedQuery/index.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getHotelsPaged } from "../gateway/hotelGateway";
import type { Hotel } from "../../domain/hotel";

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

export function useHotelsPagedQuery(
  page = 1,
  per_page = 10,
  order: Order = "desc"
) {
  return useQuery<HotelsListResult, Error>({
    queryKey: ["hotels", { page, per_page, order }],
    queryFn: () => getHotelsPaged({ page, per_page, order }),
    // TanStack Query v5:όχι keepPreviousData option—χρησιμοποιούμε placeholderData helper
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
}
